// Email (Resend) validation checks
import { CheckResult, AppConfig } from '../types';

const RESEND_API = 'https://api.resend.com';

export async function checkResendApiKey(resendApiKey: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    // Verify the API key works by listing domains
    const res = await fetch(`${RESEND_API}/domains`, {
      headers: { Authorization: `Bearer ${resendApiKey}` },
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      const data: any = await res.json();
      const domainCount = data?.data?.length || 0;
      return {
        check_name: 'Resend API Key Valid',
        category: 'email',
        status: 'pass',
        message: `API key valid — ${domainCount} domain(s) configured`,
        duration_ms: Date.now() - start,
      };
    }

    if (res.status === 401 || res.status === 403) {
      return {
        check_name: 'Resend API Key Valid',
        category: 'email',
        status: 'fail',
        message: 'Resend API key is invalid or expired',
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Resend API Key Valid',
      category: 'email',
      status: 'warn',
      message: `Resend API returned unexpected status: ${res.status}`,
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'Resend API Key Valid',
      category: 'email',
      status: 'fail',
      message: `Could not reach Resend API: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}

export async function checkResendDomainVerified(
  resendApiKey: string,
  fromEmail: string
): Promise<CheckResult> {
  const start = Date.now();
  try {
    const senderDomain = fromEmail.split('@')[1];
    if (!senderDomain) {
      return {
        check_name: 'Sender Domain Verified',
        category: 'email',
        status: 'fail',
        message: `Invalid from email: "${fromEmail}" — no domain found`,
        duration_ms: Date.now() - start,
      };
    }

    const res = await fetch(`${RESEND_API}/domains`, {
      headers: { Authorization: `Bearer ${resendApiKey}` },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return {
        check_name: 'Sender Domain Verified',
        category: 'email',
        status: 'fail',
        message: `Could not list Resend domains (${res.status})`,
        duration_ms: Date.now() - start,
      };
    }

    const data: any = await res.json();
    const domains = data?.data || [];
    const match = domains.find((d: any) => d.name === senderDomain);

    if (!match) {
      return {
        check_name: 'Sender Domain Verified',
        category: 'email',
        status: 'fail',
        message: `Domain "${senderDomain}" not found in Resend account. Emails will fail to send.`,
        details: JSON.stringify({ available_domains: domains.map((d: any) => d.name) }),
        duration_ms: Date.now() - start,
      };
    }

    if (match.status === 'verified') {
      return {
        check_name: 'Sender Domain Verified',
        category: 'email',
        status: 'pass',
        message: `Domain "${senderDomain}" is verified in Resend`,
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Sender Domain Verified',
      category: 'email',
      status: 'fail',
      message: `Domain "${senderDomain}" exists but status is "${match.status}" — needs DNS verification`,
      details: JSON.stringify({ domain: match.name, status: match.status }),
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'Sender Domain Verified',
      category: 'email',
      status: 'fail',
      message: `Domain check failed: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}

export async function checkResendTestEmail(
  resendApiKey: string,
  fromEmail: string,
  testRecipient: string
): Promise<CheckResult> {
  const start = Date.now();
  try {
    const res = await fetch(`${RESEND_API}/emails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [testRecipient],
        subject: `[PennyWiseIT Validator] Test email from ${fromEmail}`,
        html: `<p>This is an automated validation test from PennyWiseIT Composer.</p><p>If you received this email, the Resend integration for <strong>${fromEmail}</strong> is working correctly.</p><p>Sent at: ${new Date().toISOString()}</p>`,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const data: any = await res.json();

    if (res.ok && data.id) {
      return {
        check_name: 'Test Email Sends',
        category: 'email',
        status: 'pass',
        message: `Test email sent successfully (ID: ${data.id})`,
        details: JSON.stringify({ email_id: data.id, to: testRecipient }),
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Test Email Sends',
      category: 'email',
      status: 'fail',
      message: `Email send failed: ${data.message || data.error || JSON.stringify(data)}`,
      details: JSON.stringify(data),
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'Test Email Sends',
      category: 'email',
      status: 'fail',
      message: `Email send error: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}
