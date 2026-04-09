// email-resend — Resend email feature module
// Provides shared email sending, templating, and logging
import { Context } from 'hono';

interface EmailEnv {
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  EMAIL_REPLY_TO?: string;
  DB: D1Database;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string; // Override default from
  replyTo?: string;
  template?: string; // Template name for logging
}

// ============ CORE EMAIL FUNCTION ============

// Send an email via Resend — use this from any feature
export async function sendEmail(env: EmailEnv, options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const from = options.from || env.EMAIL_FROM;
  const replyTo = options.replyTo || env.EMAIL_REPLY_TO;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: replyTo,
      }),
    });

    const data: any = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || 'Resend API error' };
    }

    // Log the send
    const toEmail = Array.isArray(options.to) ? options.to.join(', ') : options.to;
    await env.DB.prepare(
      'INSERT INTO email_log (id, to_email, from_email, subject, template, resend_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(), toEmail, from, options.subject,
      options.template || null, data.id, 'sent'
    ).run();

    return { success: true, id: data.id };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ============ EMAIL TEMPLATES ============

// Wrap content in a branded email template
export function emailTemplate(
  brandName: string,
  brandColor: string,
  content: string,
  footerText?: string
): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;">
    <tr>
      <td style="background:${brandColor};padding:20px 30px;">
        <h1 style="margin:0;color:#fff;font-size:20px;">${brandName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:30px;">
        ${content}
      </td>
    </tr>
    <tr>
      <td style="padding:20px 30px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
        ${footerText || `&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.`}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Common email templates
export const templates = {
  welcome: (brandName: string, brandColor: string, userName: string) =>
    emailTemplate(brandName, brandColor, `
      <h2 style="color:#111;margin:0 0 16px;">Welcome, ${userName}!</h2>
      <p style="color:#374151;line-height:1.6;">Thanks for signing up. We're excited to have you on board.</p>
    `),

  orderConfirmation: (brandName: string, brandColor: string, orderId: string, items: string, total: string) =>
    emailTemplate(brandName, brandColor, `
      <h2 style="color:#111;margin:0 0 16px;">Order Confirmed</h2>
      <p style="color:#374151;">Your order <strong>#${orderId}</strong> has been received.</p>
      <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:16px 0;">
        ${items}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;">
        <p style="color:#111;font-weight:600;">Total: ${total}</p>
      </div>
    `),

  passwordReset: (brandName: string, brandColor: string, resetUrl: string) =>
    emailTemplate(brandName, brandColor, `
      <h2 style="color:#111;margin:0 0 16px;">Reset Your Password</h2>
      <p style="color:#374151;line-height:1.6;">Click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="display:inline-block;background:${brandColor};color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">Reset Password</a>
    `),

  notification: (brandName: string, brandColor: string, title: string, message: string) =>
    emailTemplate(brandName, brandColor, `
      <h2 style="color:#111;margin:0 0 16px;">${title}</h2>
      <p style="color:#374151;line-height:1.6;">${message}</p>
    `),
};

// ============ ROUTE HANDLERS ============

// POST /api/email/send — admin-only direct send
export async function handleSendEmail(c: Context<{ Bindings: EmailEnv }>) {
  const { to, subject, html, text, template } = await c.req.json();
  if (!to || !subject || !html) {
    return c.json({ error: 'to, subject, and html are required' }, 400);
  }

  const result = await sendEmail(c.env, { to, subject, html, text, template });
  if (!result.success) {
    return c.json({ error: result.error }, 500);
  }
  return c.json({ success: true, id: result.id });
}

// GET /api/email/log — view recent sends
export async function handleEmailLog(c: Context<{ Bindings: EmailEnv }>) {
  const limit = parseInt(c.req.query('limit') || '50');
  const logs = await c.env.DB.prepare(
    'SELECT * FROM email_log ORDER BY created_at DESC LIMIT ?'
  ).bind(Math.min(limit, 200)).all();

  return c.json({ emails: logs.results });
}

// ============ FEATURE REGISTRATION ============

export function registerEmailResend(app: any, adminMiddleware?: any) {
  const admin = adminMiddleware || ((c: any, next: any) => next());
  app.post('/api/email/send', admin, handleSendEmail);
  app.get('/api/email/log', admin, handleEmailLog);
}
