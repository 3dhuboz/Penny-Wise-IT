import { Hono } from 'hono';
import type { Env, AppVariables, Clip } from '../types';
import { generateId } from '../utils';
import { uploadToR2, deleteFromR2 } from '../services/r2';

const clips = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// Upload a clip
clips.post('/upload', async (c) => {
  const userId = c.get('userId');
  const formData = await c.req.formData();
  const file = formData.get('file') as File | null;
  const title = formData.get('title') as string | null;

  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }

  const id = generateId();
  const ext = file.name.split('.').pop() || 'webm';
  const r2Key = `clips/${userId}/${id}.${ext}`;

  await uploadToR2(c.env.MEDIA, r2Key, file.stream(), file.type || 'video/webm');

  await c.env.DB.prepare(
    `INSERT INTO clips (id, staff_id, title, r2_key, file_size_bytes, mime_type, status)
     VALUES (?, ?, ?, ?, ?, ?, 'ready')`
  )
    .bind(id, userId, title || file.name, r2Key, file.size, file.type || 'video/webm')
    .run();

  return c.json({ id, r2Key, title: title || file.name }, 201);
});

// List clips for current user
clips.get('/', async (c) => {
  const userId = c.get('userId');

  const result = await c.env.DB.prepare(
    `SELECT * FROM clips WHERE staff_id = ? ORDER BY created_at DESC`
  )
    .bind(userId)
    .all<Clip>();

  return c.json({ clips: result.results });
});

// Delete a clip
clips.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const clipId = c.req.param('id');

  const clip = await c.env.DB.prepare(
    `SELECT * FROM clips WHERE id = ? AND staff_id = ?`
  )
    .bind(clipId, userId)
    .first<Clip>();

  if (!clip) {
    return c.json({ error: 'Clip not found' }, 404);
  }

  await deleteFromR2(c.env.MEDIA, clip.r2_key);
  if (clip.thumbnail_r2_key) {
    await deleteFromR2(c.env.MEDIA, clip.thumbnail_r2_key);
  }

  await c.env.DB.prepare(`DELETE FROM clips WHERE id = ?`).bind(clipId).run();

  return c.json({ ok: true });
});

// Get a single clip's video stream
clips.get('/:id/stream', async (c) => {
  const userId = c.get('userId');
  const clipId = c.req.param('id');

  const clip = await c.env.DB.prepare(
    `SELECT * FROM clips WHERE id = ? AND staff_id = ?`
  )
    .bind(clipId, userId)
    .first<Clip>();

  if (!clip) {
    return c.json({ error: 'Clip not found' }, 404);
  }

  const obj = await c.env.MEDIA.get(clip.r2_key);
  if (!obj) {
    return c.json({ error: 'File not found in storage' }, 404);
  }

  return new Response(obj.body, {
    headers: {
      'Content-Type': clip.mime_type,
      'Content-Length': String(clip.file_size_bytes ?? obj.size),
    },
  });
});

export default clips;
