// sms-twilio — Twilio SMS feature module
// Provides shared SMS sending, broadcast, and logging
import { Context } from 'hono';

interface SmsEnv {
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_FROM_NUMBER: string;
  DB: D1Database;
}

interface SendSmsOptions {
  to: string;
  message: string;
  from?: string; // Override default from number
}

interface SendSmsResult {
  success: boolean;
  sid?: string;
  error?: string;
}

// ============ CORE SMS FUNCTION ============

// Send an SMS via Twilio — use this from any feature
export async function sendSms(env: SmsEnv, options: SendSmsOptions): Promise<SendSmsResult> {
  const from = options.from || env.TWILIO_FROM_NUMBER;

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);

    const body = new URLSearchParams({
      To: options.to,
      From: from,
      Body: options.message,
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data: any = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || `Twilio error ${data.code}` };
    }

    // Log the send
    await env.DB.prepare(
      'INSERT INTO sms_log (id, to_number, from_number, message, twilio_sid, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(), options.to, from,
      options.message, data.sid, data.status || 'queued'
    ).run();

    return { success: true, sid: data.sid };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// Send SMS to multiple recipients
export async function broadcastSms(
  env: SmsEnv,
  recipients: string[],
  message: string
): Promise<{ total: number; sent: number; failed: number; results: SendSmsResult[] }> {
  const results: SendSmsResult[] = [];
  let sent = 0;
  let failed = 0;

  for (const to of recipients) {
    const result = await sendSms(env, { to, message });
    results.push(result);
    if (result.success) sent++;
    else failed++;
  }

  return { total: recipients.length, sent, failed, results };
}

// ============ ROUTE HANDLERS ============

// POST /api/sms/send — admin-only single SMS
export async function handleSendSms(c: Context<{ Bindings: SmsEnv }>) {
  const { to, message } = await c.req.json();
  if (!to || !message) {
    return c.json({ error: 'to and message are required' }, 400);
  }

  // Basic phone number validation (Australian format)
  const cleaned = to.replace(/[\s\-()]/g, '');
  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return c.json({ error: 'Invalid phone number format' }, 400);
  }

  const result = await sendSms(c.env, { to: cleaned, message });
  if (!result.success) {
    return c.json({ error: result.error }, 500);
  }
  return c.json({ success: true, sid: result.sid });
}

// POST /api/sms/broadcast — admin-only bulk send
export async function handleBroadcastSms(c: Context<{ Bindings: SmsEnv }>) {
  const { recipients, message } = await c.req.json();
  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return c.json({ error: 'recipients array is required' }, 400);
  }
  if (!message) {
    return c.json({ error: 'message is required' }, 400);
  }
  if (recipients.length > 100) {
    return c.json({ error: 'Maximum 100 recipients per broadcast' }, 400);
  }

  const result = await broadcastSms(c.env, recipients, message);
  return c.json(result);
}

// GET /api/sms/log — view recent SMS sends
export async function handleSmsLog(c: Context<{ Bindings: SmsEnv }>) {
  const limit = parseInt(c.req.query('limit') || '50');
  const logs = await c.env.DB.prepare(
    'SELECT * FROM sms_log ORDER BY created_at DESC LIMIT ?'
  ).bind(Math.min(limit, 200)).all();

  return c.json({ messages: logs.results });
}

// ============ FEATURE REGISTRATION ============

export function registerSmsTwilio(app: any, adminMiddleware?: any) {
  const admin = adminMiddleware || ((c: any, next: any) => next());
  app.post('/api/sms/send', admin, handleSendSms);
  app.post('/api/sms/broadcast', admin, handleBroadcastSms);
  app.get('/api/sms/log', admin, handleSmsLog);
}
