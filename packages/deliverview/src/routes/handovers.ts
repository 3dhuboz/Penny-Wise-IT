import { Hono } from 'hono';
import type { Env, AppVariables, Handover, HandoverClip, Clip } from '../types';
import { generateId } from '../utils';
import { generateMagicToken } from '../services/token';
import { sendHandoverEmail, sendReminderEmail } from '../services/email';

const handovers = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// List handovers for current user
handovers.get('/', async (c) => {
  const userId = c.get('userId');
  const result = await c.env.DB.prepare(
    `SELECT h.*, c.contact_name as client_name, c.contact_email as client_email, c.company_name
     FROM handovers h
     JOIN clients c ON h.client_id = c.id
     WHERE h.staff_id = ?
     ORDER BY h.created_at DESC`
  )
    .bind(userId)
    .all();

  return c.json({ handovers: result.results });
});

// Get handover detail with clips
handovers.get('/:id', async (c) => {
  const userId = c.get('userId');
  const handoverId = c.req.param('id');

  const handover = await c.env.DB.prepare(
    `SELECT h.*, c.contact_name as client_name, c.contact_email as client_email, c.company_name
     FROM handovers h
     JOIN clients c ON h.client_id = c.id
     WHERE h.id = ? AND h.staff_id = ?`
  )
    .bind(handoverId, userId)
    .first();

  if (!handover) return c.json({ error: 'Handover not found' }, 404);

  const clips = await c.env.DB.prepare(
    `SELECT hc.*, cl.title as clip_title, cl.duration_seconds, cl.file_size_bytes, cl.r2_key, cl.mime_type
     FROM handover_clips hc
     JOIN clips cl ON hc.clip_id = cl.id
     WHERE hc.handover_id = ?
     ORDER BY hc.position ASC`
  )
    .bind(handoverId)
    .all();

  // Get acknowledgment if exists
  const ack = await c.env.DB.prepare(
    `SELECT * FROM acknowledgments WHERE handover_id = ?`
  )
    .bind(handoverId)
    .first();

  // Get email log
  const emails = await c.env.DB.prepare(
    `SELECT * FROM email_log WHERE handover_id = ? ORDER BY sent_at DESC`
  )
    .bind(handoverId)
    .all();

  // Get reminders
  const reminders = await c.env.DB.prepare(
    `SELECT * FROM reminders WHERE handover_id = ? ORDER BY sent_at DESC`
  )
    .bind(handoverId)
    .all();

  return c.json({
    handover,
    clips: clips.results,
    acknowledgment: ack,
    emails: emails.results,
    reminders: reminders.results,
  });
});

// Create handover
handovers.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{
    title: string;
    client_id: string;
    description?: string;
    clip_ids?: { clip_id: string; chapter_title?: string }[];
    expires_at?: string;
  }>();

  if (!body.title || !body.client_id) {
    return c.json({ error: 'title and client_id are required' }, 400);
  }

  // Verify client belongs to this user
  const client = await c.env.DB.prepare(
    `SELECT id FROM clients WHERE id = ? AND staff_id = ?`
  )
    .bind(body.client_id, userId)
    .first();

  if (!client) return c.json({ error: 'Client not found' }, 404);

  const id = generateId();
  const magicToken = await generateMagicToken(id, c.env.MAGIC_TOKEN_SECRET);

  await c.env.DB.prepare(
    `INSERT INTO handovers (id, staff_id, client_id, title, description, magic_token, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      userId,
      body.client_id,
      body.title,
      body.description ?? null,
      magicToken,
      body.expires_at ?? null
    )
    .run();

  // Add clips if provided
  if (body.clip_ids?.length) {
    const batch = body.clip_ids.map((item, index) =>
      c.env.DB.prepare(
        `INSERT INTO handover_clips (id, handover_id, clip_id, position, chapter_title) VALUES (?, ?, ?, ?, ?)`
      ).bind(generateId(), id, item.clip_id, index, item.chapter_title ?? null)
    );
    await c.env.DB.batch(batch);
  }

  return c.json({ id, magic_token: magicToken }, 201);
});

// Update handover (title, description, clips)
handovers.put('/:id', async (c) => {
  const userId = c.get('userId');
  const handoverId = c.req.param('id');
  const body = await c.req.json<{
    title?: string;
    description?: string;
    clip_ids?: { clip_id: string; chapter_title?: string }[];
    expires_at?: string;
  }>();

  const existing = await c.env.DB.prepare(
    `SELECT * FROM handovers WHERE id = ? AND staff_id = ? AND status = 'draft'`
  )
    .bind(handoverId, userId)
    .first<Handover>();

  if (!existing) return c.json({ error: 'Handover not found or not editable' }, 404);

  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (body.title !== undefined) { fields.push('title = ?'); values.push(body.title); }
  if (body.description !== undefined) { fields.push('description = ?'); values.push(body.description); }
  if (body.expires_at !== undefined) { fields.push('expires_at = ?'); values.push(body.expires_at); }

  if (fields.length > 0) {
    fields.push("updated_at = datetime('now')");
    await c.env.DB.prepare(
      `UPDATE handovers SET ${fields.join(', ')} WHERE id = ?`
    )
      .bind(...values, handoverId)
      .run();
  }

  // Replace clips if provided
  if (body.clip_ids !== undefined) {
    await c.env.DB.prepare(`DELETE FROM handover_clips WHERE handover_id = ?`)
      .bind(handoverId)
      .run();

    if (body.clip_ids.length > 0) {
      const batch = body.clip_ids.map((item, index) =>
        c.env.DB.prepare(
          `INSERT INTO handover_clips (id, handover_id, clip_id, position, chapter_title) VALUES (?, ?, ?, ?, ?)`
        ).bind(generateId(), handoverId, item.clip_id, index, item.chapter_title ?? null)
      );
      await c.env.DB.batch(batch);
    }
  }

  return c.json({ ok: true });
});

// Delete draft handover
handovers.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const handoverId = c.req.param('id');

  const existing = await c.env.DB.prepare(
    `SELECT id, status FROM handovers WHERE id = ? AND staff_id = ?`
  )
    .bind(handoverId, userId)
    .first<{ id: string; status: string }>();

  if (!existing) return c.json({ error: 'Handover not found' }, 404);
  if (existing.status !== 'draft') {
    return c.json({ error: 'Only draft handovers can be deleted' }, 400);
  }

  await c.env.DB.batch([
    c.env.DB.prepare(`DELETE FROM handover_clips WHERE handover_id = ?`).bind(handoverId),
    c.env.DB.prepare(`DELETE FROM handovers WHERE id = ?`).bind(handoverId),
  ]);

  return c.json({ ok: true });
});

// Send handover to client
handovers.post('/:id/send', async (c) => {
  const userId = c.get('userId');
  const handoverId = c.req.param('id');

  const handover = await c.env.DB.prepare(
    `SELECT h.*, c.contact_email, c.contact_name
     FROM handovers h
     JOIN clients c ON h.client_id = c.id
     WHERE h.id = ? AND h.staff_id = ?`
  )
    .bind(handoverId, userId)
    .first<Handover & { contact_email: string; contact_name: string }>();

  if (!handover) return c.json({ error: 'Handover not found' }, 404);
  if (handover.status !== 'draft' && handover.status !== 'sent') {
    return c.json({ error: 'Handover cannot be sent in its current state' }, 400);
  }

  // Check there are clips attached
  const clipCount = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM handover_clips WHERE handover_id = ?`
  )
    .bind(handoverId)
    .first<{ count: number }>();

  if (!clipCount || clipCount.count === 0) {
    return c.json({ error: 'Add at least one clip before sending' }, 400);
  }

  const viewerUrl = `${c.env.VIEWER_URL}/view/${handover.magic_token}`;

  const emailResult = await sendHandoverEmail(
    c.env.RESEND_API_KEY,
    handover.contact_email,
    handover.title,
    viewerUrl
  );

  // Log email
  await c.env.DB.prepare(
    `INSERT INTO email_log (id, handover_id, resend_id, recipient_email, subject, template, status)
     VALUES (?, ?, ?, ?, ?, 'handover', ?)`
  )
    .bind(
      generateId(),
      handoverId,
      emailResult.id ?? null,
      handover.contact_email,
      `Website Handover: ${handover.title}`,
      emailResult.ok ? 'sent' : 'failed'
    )
    .run();

  // Update status
  await c.env.DB.prepare(
    `UPDATE handovers SET status = 'sent', sent_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`
  )
    .bind(handoverId)
    .run();

  return c.json({ ok: true, viewer_url: viewerUrl });
});

// Send reminder
handovers.post('/:id/remind', async (c) => {
  const userId = c.get('userId');
  const handoverId = c.req.param('id');

  const handover = await c.env.DB.prepare(
    `SELECT h.*, c.contact_email
     FROM handovers h
     JOIN clients c ON h.client_id = c.id
     WHERE h.id = ? AND h.staff_id = ?`
  )
    .bind(handoverId, userId)
    .first<Handover & { contact_email: string }>();

  if (!handover) return c.json({ error: 'Handover not found' }, 404);
  if (handover.status === 'draft' || handover.status === 'acknowledged') {
    return c.json({ error: 'Cannot send reminder for this handover' }, 400);
  }

  // Check reminder count (max 3)
  const reminderCount = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM reminders WHERE handover_id = ?`
  )
    .bind(handoverId)
    .first<{ count: number }>();

  if (reminderCount && reminderCount.count >= 3) {
    return c.json({ error: 'Maximum 3 reminders per handover' }, 400);
  }

  const nextNumber = (reminderCount?.count ?? 0) + 1;
  const viewerUrl = `${c.env.VIEWER_URL}/view/${handover.magic_token}`;

  await sendReminderEmail(
    c.env.RESEND_API_KEY,
    handover.contact_email,
    handover.title,
    viewerUrl,
    nextNumber
  );

  await c.env.DB.prepare(
    `INSERT INTO reminders (id, handover_id, reminder_number) VALUES (?, ?, ?)`
  )
    .bind(generateId(), handoverId, nextNumber)
    .run();

  return c.json({ ok: true, reminder_number: nextNumber });
});

export default handovers;
