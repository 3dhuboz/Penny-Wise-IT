import { Hono } from 'hono';
import type { Env, AppVariables, Client } from '../types';
import { generateId } from '../utils';

const clients = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// List clients for current user
clients.get('/', async (c) => {
  const userId = c.get('userId');
  const result = await c.env.DB.prepare(
    `SELECT * FROM clients WHERE staff_id = ? ORDER BY contact_name ASC`
  )
    .bind(userId)
    .all<Client>();

  return c.json({ clients: result.results });
});

// Get single client
clients.get('/:id', async (c) => {
  const userId = c.get('userId');
  const clientId = c.req.param('id');

  const client = await c.env.DB.prepare(
    `SELECT * FROM clients WHERE id = ? AND staff_id = ?`
  )
    .bind(clientId, userId)
    .first<Client>();

  if (!client) return c.json({ error: 'Client not found' }, 404);
  return c.json({ client });
});

// Create client
clients.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{
    contact_name: string;
    contact_email: string;
    company_name?: string;
    phone?: string;
    notes?: string;
  }>();

  if (!body.contact_name || !body.contact_email) {
    return c.json({ error: 'contact_name and contact_email are required' }, 400);
  }

  const id = generateId();

  await c.env.DB.prepare(
    `INSERT INTO clients (id, staff_id, contact_name, contact_email, company_name, phone, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      userId,
      body.contact_name,
      body.contact_email,
      body.company_name ?? null,
      body.phone ?? null,
      body.notes ?? null
    )
    .run();

  return c.json({ id, contact_name: body.contact_name }, 201);
});

// Update client
clients.put('/:id', async (c) => {
  const userId = c.get('userId');
  const clientId = c.req.param('id');
  const body = await c.req.json<{
    contact_name?: string;
    contact_email?: string;
    company_name?: string;
    phone?: string;
    notes?: string;
  }>();

  const existing = await c.env.DB.prepare(
    `SELECT id FROM clients WHERE id = ? AND staff_id = ?`
  )
    .bind(clientId, userId)
    .first();

  if (!existing) return c.json({ error: 'Client not found' }, 404);

  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (body.contact_name !== undefined) { fields.push('contact_name = ?'); values.push(body.contact_name); }
  if (body.contact_email !== undefined) { fields.push('contact_email = ?'); values.push(body.contact_email); }
  if (body.company_name !== undefined) { fields.push('company_name = ?'); values.push(body.company_name); }
  if (body.phone !== undefined) { fields.push('phone = ?'); values.push(body.phone); }
  if (body.notes !== undefined) { fields.push('notes = ?'); values.push(body.notes); }

  if (fields.length === 0) return c.json({ error: 'No fields to update' }, 400);

  fields.push("updated_at = datetime('now')");

  await c.env.DB.prepare(
    `UPDATE clients SET ${fields.join(', ')} WHERE id = ?`
  )
    .bind(...values, clientId)
    .run();

  return c.json({ ok: true });
});

// Delete client
clients.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const clientId = c.req.param('id');

  const existing = await c.env.DB.prepare(
    `SELECT id FROM clients WHERE id = ? AND staff_id = ?`
  )
    .bind(clientId, userId)
    .first();

  if (!existing) return c.json({ error: 'Client not found' }, 404);

  await c.env.DB.prepare(`DELETE FROM clients WHERE id = ?`).bind(clientId).run();
  return c.json({ ok: true });
});

export default clients;
