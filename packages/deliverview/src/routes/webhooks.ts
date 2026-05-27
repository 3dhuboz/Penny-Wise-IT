import { Hono } from 'hono';
import type { Env } from '../types';

const webhooks = new Hono<{ Bindings: Env }>();

// Clerk webhook — sync user data to staff table
webhooks.post('/clerk', async (c) => {
  const svixId = c.req.header('svix-id');
  const svixTimestamp = c.req.header('svix-timestamp');
  const svixSignature = c.req.header('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.json({ error: 'Missing webhook headers' }, 400);
  }

  const body = await c.req.text();

  // Verify webhook signature using raw HMAC
  const secret = c.env.CLERK_WEBHOOK_SECRET;
  // Clerk webhook secrets are base64-encoded after the "whsec_" prefix
  const secretBytes = Uint8Array.from(
    atob(secret.replace('whsec_', '')),
    (ch) => ch.charCodeAt(0)
  );

  const toSign = `${svixId}.${svixTimestamp}.${body}`;
  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(toSign));
  const computedSig = btoa(String.fromCharCode(...new Uint8Array(sig)));

  // svix-signature contains multiple sigs separated by spaces, each prefixed with "v1,"
  const signatures = svixSignature.split(' ');
  const valid = signatures.some((s) => s.replace('v1,', '') === computedSig);

  if (!valid) {
    return c.json({ error: 'Invalid webhook signature' }, 401);
  }

  const event = JSON.parse(body) as {
    type: string;
    data: {
      id: string;
      email_addresses?: { email_address: string }[];
      first_name?: string;
      last_name?: string;
      image_url?: string;
    };
  };

  const { type, data } = event;

  if (type === 'user.created' || type === 'user.updated') {
    const email = data.email_addresses?.[0]?.email_address ?? '';
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'Staff';

    await c.env.DB.prepare(
      `INSERT INTO staff (id, email, name, avatar_url, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email,
         name = excluded.name,
         avatar_url = excluded.avatar_url,
         updated_at = datetime('now')`
    )
      .bind(data.id, email, name, data.image_url ?? null)
      .run();
  } else if (type === 'user.deleted') {
    await c.env.DB.prepare(`DELETE FROM staff WHERE id = ?`).bind(data.id).run();
  }

  return c.json({ ok: true });
});

// Resend webhook — email delivery status (Phase 4)
webhooks.post('/resend', async (c) => {
  console.log('[webhook] Resend webhook not yet implemented');
  return c.json({ ok: true });
});

export default webhooks;
