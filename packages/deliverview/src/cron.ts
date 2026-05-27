import type { Env, Handover } from './types';
import { generateId } from './utils';
import { sendReminderEmail } from './services/email';

export async function processAutoReminders(env: Env): Promise<void> {
  console.log('[cron] Processing auto-reminders...');

  // Find handovers sent >3 days ago with no view, and <3 reminders
  const needsViewReminder = await env.DB.prepare(
    `SELECT h.id, h.title, h.magic_token, c.contact_email,
            (SELECT COUNT(*) FROM reminders WHERE handover_id = h.id) as reminder_count
     FROM handovers h
     JOIN clients c ON h.client_id = c.id
     WHERE h.status = 'sent'
       AND h.sent_at < datetime('now', '-3 days')
       AND (SELECT COUNT(*) FROM reminders WHERE handover_id = h.id) < 3`
  ).all<Handover & { contact_email: string; reminder_count: number }>();

  // Find handovers viewed >2 days ago with no acknowledgment, and <3 reminders
  const needsAckReminder = await env.DB.prepare(
    `SELECT h.id, h.title, h.magic_token, c.contact_email,
            (SELECT COUNT(*) FROM reminders WHERE handover_id = h.id) as reminder_count
     FROM handovers h
     JOIN clients c ON h.client_id = c.id
     WHERE h.status = 'viewed'
       AND h.viewed_at < datetime('now', '-2 days')
       AND (SELECT COUNT(*) FROM reminders WHERE handover_id = h.id) < 3`
  ).all<Handover & { contact_email: string; reminder_count: number }>();

  const allPending = [...(needsViewReminder.results ?? []), ...(needsAckReminder.results ?? [])];

  console.log(`[cron] Found ${allPending.length} handovers needing reminders`);

  for (const h of allPending) {
    const handover = h as Handover & { contact_email: string; reminder_count: number };
    const nextNumber = handover.reminder_count + 1;
    const viewerUrl = `${env.VIEWER_URL}/view/${handover.magic_token}`;

    await sendReminderEmail(
      env.RESEND_API_KEY,
      handover.contact_email,
      handover.title,
      viewerUrl,
      nextNumber
    );

    await env.DB.prepare(
      `INSERT INTO reminders (id, handover_id, reminder_number) VALUES (?, ?, ?)`
    ).bind(generateId(), handover.id, nextNumber).run();

    console.log(`[cron] Sent reminder #${nextNumber} for handover ${handover.id}`);
  }

  console.log('[cron] Auto-reminders complete');
}
