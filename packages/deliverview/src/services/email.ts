interface ResendResponse {
  id?: string;
  message?: string;
}

async function sendEmail(
  apiKey: string,
  to: string,
  subject: string,
  html: string
): Promise<{ ok: boolean; id?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Penny Wise I.T <deliverview@pennywiseit.com.au>',
        to: [to],
        subject,
        html,
      }),
    });

    const data = (await res.json()) as ResendResponse;
    return { ok: res.ok, id: data.id };
  } catch (err) {
    console.error('[email] Send failed:', err);
    return { ok: false };
  }
}

export async function sendHandoverEmail(
  apiKey: string,
  to: string,
  handoverTitle: string,
  viewerUrl: string
): Promise<{ ok: boolean; id?: string }> {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
  <div style="text-align: center; padding: 24px 0; border-bottom: 1px solid #e2e8f0;">
    <h2 style="margin: 0; color: #1e3a5f; font-size: 24px;">Penny Wise I.T</h2>
    <p style="margin: 4px 0 0; color: #94a3b8; font-size: 14px;">DeliverView</p>
  </div>

  <div style="padding: 32px 0;">
    <h1 style="font-size: 20px; color: #1e293b; margin: 0 0 16px;">Your Website Handover is Ready</h1>
    <p style="color: #64748b; line-height: 1.6; margin: 0 0 8px;">
      A website handover has been prepared for you:
    </p>
    <p style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0 0 24px;">${handoverTitle}</p>
    <p style="color: #64748b; line-height: 1.6; margin: 0 0 24px;">
      Please review the walkthrough video(s) and acknowledge receipt. This creates a formal record of the website handover.
    </p>

    <div style="text-align: center; padding: 16px 0;">
      <a href="${viewerUrl}"
         style="display: inline-block; padding: 14px 32px; background-color: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        View Your Handover
      </a>
    </div>
  </div>

  <div style="border-top: 1px solid #e2e8f0; padding: 24px 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
    <p style="margin: 0;">By viewing and acknowledging this handover, you confirm receipt of the delivered website as demonstrated in the walkthrough.</p>
    <p style="margin: 8px 0 0;">Penny Wise I.T | ABN: XX XXX XXX XXX</p>
  </div>
</body>
</html>`;

  return sendEmail(apiKey, to, `Website Handover: ${handoverTitle}`, html);
}

export async function sendReminderEmail(
  apiKey: string,
  to: string,
  handoverTitle: string,
  viewerUrl: string,
  reminderNumber: number
): Promise<{ ok: boolean; id?: string }> {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
  <div style="text-align: center; padding: 24px 0; border-bottom: 1px solid #e2e8f0;">
    <h2 style="margin: 0; color: #1e3a5f; font-size: 24px;">Penny Wise I.T</h2>
    <p style="margin: 4px 0 0; color: #94a3b8; font-size: 14px;">DeliverView</p>
  </div>

  <div style="padding: 32px 0;">
    <h1 style="font-size: 20px; color: #1e293b; margin: 0 0 16px;">Reminder: Handover Awaiting Your Review</h1>
    <p style="color: #64748b; line-height: 1.6; margin: 0 0 8px;">
      This is reminder ${reminderNumber} for the following handover:
    </p>
    <p style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0 0 24px;">${handoverTitle}</p>
    <p style="color: #64748b; line-height: 1.6; margin: 0 0 24px;">
      Please take a moment to review the walkthrough and acknowledge receipt at your earliest convenience.
    </p>

    <div style="text-align: center; padding: 16px 0;">
      <a href="${viewerUrl}"
         style="display: inline-block; padding: 14px 32px; background-color: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        View Your Handover
      </a>
    </div>
  </div>

  <div style="border-top: 1px solid #e2e8f0; padding: 24px 0; color: #94a3b8; font-size: 12px;">
    <p style="margin: 0;">Penny Wise I.T | ABN: XX XXX XXX XXX</p>
  </div>
</body>
</html>`;

  return sendEmail(apiKey, to, `Reminder: ${handoverTitle} — Awaiting Your Review`, html);
}

export async function sendAcknowledgmentReceipt(
  apiKey: string,
  to: string,
  handoverTitle: string
): Promise<{ ok: boolean; id?: string }> {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
  <div style="text-align: center; padding: 24px 0; border-bottom: 1px solid #e2e8f0;">
    <h2 style="margin: 0; color: #1e3a5f; font-size: 24px;">Penny Wise I.T</h2>
    <p style="margin: 4px 0 0; color: #94a3b8; font-size: 14px;">DeliverView</p>
  </div>

  <div style="padding: 32px 0;">
    <h1 style="font-size: 20px; color: #1e293b; margin: 0 0 16px;">Handover Acknowledged</h1>
    <p style="color: #64748b; line-height: 1.6; margin: 0 0 16px;">
      Thank you for acknowledging receipt of:
    </p>
    <p style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0 0 24px;">${handoverTitle}</p>
    <p style="color: #64748b; line-height: 1.6;">
      This email serves as confirmation that you have reviewed and acknowledged the website handover. A copy of the acknowledgment record has been stored for both parties.
    </p>
    <p style="color: #64748b; line-height: 1.6; margin: 16px 0 0;">
      Any issues not raised within 14 business days of this acknowledgment will be considered accepted.
    </p>
  </div>

  <div style="border-top: 1px solid #e2e8f0; padding: 24px 0; color: #94a3b8; font-size: 12px;">
    <p style="margin: 0;">Penny Wise I.T | ABN: XX XXX XXX XXX</p>
  </div>
</body>
</html>`;

  return sendEmail(apiKey, to, `Confirmed: ${handoverTitle} — Handover Acknowledged`, html);
}
