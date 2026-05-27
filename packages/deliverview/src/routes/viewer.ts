import { Hono } from 'hono';
import type { Env } from '../types';
import { generateId } from '../utils';
import { verifyMagicToken } from '../services/token';
import { uploadToR2 } from '../services/r2';

const viewer = new Hono<{ Bindings: Env }>();

// Get handover data for client viewer
viewer.get('/:token', async (c) => {
  const token = c.req.param('token');
  const { valid, handoverId } = await verifyMagicToken(token, c.env.MAGIC_TOKEN_SECRET);

  if (!valid || !handoverId) {
    return c.json({ error: 'Invalid or expired link' }, 403);
  }

  const handover = await c.env.DB.prepare(
    `SELECT h.id, h.title, h.description, h.status, h.expires_at, h.ai_summary,
            s.name as staff_name
     FROM handovers h
     JOIN staff s ON h.staff_id = s.id
     WHERE h.id = ?`
  )
    .bind(handoverId)
    .first();

  if (!handover) return c.json({ error: 'Handover not found' }, 404);

  // Check expiry
  const expiresAt = (handover as Record<string, unknown>).expires_at as string | null;
  if (expiresAt && new Date(expiresAt) < new Date()) {
    return c.json({ error: 'This handover link has expired' }, 410);
  }

  // Get clips
  const clips = await c.env.DB.prepare(
    `SELECT hc.id, hc.position, hc.chapter_title,
            cl.id as clip_id, cl.title as clip_title, cl.duration_seconds, cl.mime_type
     FROM handover_clips hc
     JOIN clips cl ON hc.clip_id = cl.id
     WHERE hc.handover_id = ?
     ORDER BY hc.position ASC`
  )
    .bind(handoverId)
    .all();

  // Check if already acknowledged
  const ack = await c.env.DB.prepare(
    `SELECT id, acknowledged_at FROM acknowledgments WHERE handover_id = ?`
  )
    .bind(handoverId)
    .first();

  // Mark as viewed on first access
  const status = (handover as Record<string, unknown>).status as string;
  if (status === 'sent') {
    await c.env.DB.prepare(
      `UPDATE handovers SET status = 'viewed', viewed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`
    )
      .bind(handoverId)
      .run();
  }

  return c.json({
    handover,
    clips: clips.results,
    acknowledged: !!ack,
    acknowledgment: ack,
  });
});

// Stream a clip video (public, via token)
viewer.get('/:token/clip/:clipId/stream', async (c) => {
  const token = c.req.param('token');
  const clipId = c.req.param('clipId');
  const { valid, handoverId } = await verifyMagicToken(token, c.env.MAGIC_TOKEN_SECRET);

  if (!valid || !handoverId) {
    return c.json({ error: 'Invalid or expired link' }, 403);
  }

  // Verify clip belongs to this handover
  const hc = await c.env.DB.prepare(
    `SELECT cl.r2_key, cl.mime_type, cl.file_size_bytes
     FROM handover_clips hc
     JOIN clips cl ON hc.clip_id = cl.id
     WHERE hc.handover_id = ? AND cl.id = ?`
  )
    .bind(handoverId, clipId)
    .first<{ r2_key: string; mime_type: string; file_size_bytes: number | null }>();

  if (!hc) return c.json({ error: 'Clip not found' }, 404);

  const obj = await c.env.MEDIA.get(hc.r2_key);
  if (!obj) return c.json({ error: 'Video file not found' }, 404);

  return new Response(obj.body, {
    headers: {
      'Content-Type': hc.mime_type,
      'Content-Length': String(hc.file_size_bytes ?? obj.size),
      'Accept-Ranges': 'bytes',
    },
  });
});

// Log chapter progress
viewer.post('/:token/progress', async (c) => {
  const token = c.req.param('token');
  const { valid } = await verifyMagicToken(token, c.env.MAGIC_TOKEN_SECRET);
  if (!valid) return c.json({ error: 'Invalid link' }, 403);

  // Progress tracking is client-side for now
  return c.json({ ok: true });
});

// Submit acknowledgment
viewer.post('/:token/acknowledge', async (c) => {
  const token = c.req.param('token');
  const { valid, handoverId } = await verifyMagicToken(token, c.env.MAGIC_TOKEN_SECRET);

  if (!valid || !handoverId) {
    return c.json({ error: 'Invalid or expired link' }, 403);
  }

  const body = await c.req.json<{
    client_name: string;
    client_email: string;
    consent_text: string;
    signature_data?: string; // base64 PNG
  }>();

  if (!body.client_name || !body.client_email || !body.consent_text) {
    return c.json({ error: 'client_name, client_email, and consent_text are required' }, 400);
  }

  // Check not already acknowledged
  const existing = await c.env.DB.prepare(
    `SELECT id FROM acknowledgments WHERE handover_id = ?`
  )
    .bind(handoverId)
    .first();

  if (existing) {
    return c.json({ error: 'This handover has already been acknowledged' }, 409);
  }

  // Store signature in R2 if provided
  let signatureR2Key: string | null = null;
  if (body.signature_data) {
    const sigId = generateId();
    signatureR2Key = `signatures/${handoverId}/${sigId}.png`;
    const sigBytes = Uint8Array.from(atob(body.signature_data.replace(/^data:image\/png;base64,/, '')), ch => ch.charCodeAt(0));
    await uploadToR2(c.env.MEDIA, signatureR2Key, sigBytes.buffer, 'image/png');
  }

  const ipAddress = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  const userAgent = c.req.header('User-Agent') || 'unknown';
  const ackId = generateId();

  await c.env.DB.prepare(
    `INSERT INTO acknowledgments (id, handover_id, client_name, client_email, ip_address, user_agent, consent_text, signature_data, signature_r2_key)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      ackId,
      handoverId,
      body.client_name,
      body.client_email,
      ipAddress,
      userAgent,
      body.consent_text,
      body.signature_data ?? null,
      signatureR2Key
    )
    .run();

  // Update handover status
  await c.env.DB.prepare(
    `UPDATE handovers SET status = 'acknowledged', acknowledged_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`
  )
    .bind(handoverId)
    .run();

  return c.json({ ok: true, acknowledgment_id: ackId });
});

export default viewer;
