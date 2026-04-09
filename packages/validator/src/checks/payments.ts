// Payment provider validation checks (Stripe, Square, PayPal)
import { CheckResult } from '../types';

// ============ STRIPE ============

export async function checkStripeApiKey(stripeSecretKey: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: { Authorization: `Bearer ${stripeSecretKey}` },
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      const data: any = await res.json();
      const isTest = stripeSecretKey.startsWith('sk_test_');
      return {
        check_name: 'Stripe API Key Valid',
        category: 'payments',
        status: 'pass',
        message: `Stripe key valid (${isTest ? 'TEST' : 'LIVE'} mode)`,
        details: JSON.stringify({ livemode: !isTest }),
        duration_ms: Date.now() - start,
      };
    }

    if (res.status === 401) {
      return {
        check_name: 'Stripe API Key Valid',
        category: 'payments',
        status: 'fail',
        message: 'Stripe API key is invalid or expired',
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Stripe API Key Valid',
      category: 'payments',
      status: 'warn',
      message: `Stripe returned unexpected status: ${res.status}`,
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'Stripe API Key Valid',
      category: 'payments',
      status: 'fail',
      message: `Could not reach Stripe: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}

export async function checkStripeWebhook(
  stripeSecretKey: string,
  webhookUrl: string
): Promise<CheckResult> {
  const start = Date.now();
  try {
    // List webhook endpoints to verify one points to the customer domain
    const res = await fetch('https://api.stripe.com/v1/webhook_endpoints?limit=100', {
      headers: { Authorization: `Bearer ${stripeSecretKey}` },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return {
        check_name: 'Stripe Webhook Configured',
        category: 'payments',
        status: 'fail',
        message: `Could not list webhooks (${res.status})`,
        duration_ms: Date.now() - start,
      };
    }

    const data: any = await res.json();
    const webhooks = data.data || [];
    const match = webhooks.find((wh: any) =>
      wh.url.includes(webhookUrl) && wh.status === 'enabled'
    );

    if (match) {
      return {
        check_name: 'Stripe Webhook Configured',
        category: 'payments',
        status: 'pass',
        message: `Active webhook found pointing to ${match.url}`,
        details: JSON.stringify({
          url: match.url,
          events: match.enabled_events?.length || 0,
          status: match.status,
        }),
        duration_ms: Date.now() - start,
      };
    }

    // Check if there's any webhook with matching domain but disabled
    const disabled = webhooks.find((wh: any) => wh.url.includes(webhookUrl));
    if (disabled) {
      return {
        check_name: 'Stripe Webhook Configured',
        category: 'payments',
        status: 'fail',
        message: `Webhook found but status is "${disabled.status}" — needs to be enabled`,
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Stripe Webhook Configured',
      category: 'payments',
      status: 'fail',
      message: `No webhook endpoint found for "${webhookUrl}". Payments won't process.`,
      details: JSON.stringify({
        existing_webhooks: webhooks.map((wh: any) => wh.url),
      }),
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'Stripe Webhook Configured',
      category: 'payments',
      status: 'fail',
      message: `Webhook check failed: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}

// ============ SQUARE ============

export async function checkSquareAccessToken(
  accessToken: string,
  environment: 'sandbox' | 'production' = 'production'
): Promise<CheckResult> {
  const start = Date.now();
  const baseUrl = environment === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';

  try {
    const res = await fetch(`${baseUrl}/v2/locations`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Square-Version': '2024-06-04',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      const data: any = await res.json();
      const locations = data.locations || [];
      return {
        check_name: 'Square Access Token Valid',
        category: 'payments',
        status: 'pass',
        message: `Square token valid — ${locations.length} location(s) found`,
        details: JSON.stringify({
          locations: locations.map((l: any) => ({
            id: l.id,
            name: l.name,
            status: l.status,
          })),
        }),
        duration_ms: Date.now() - start,
      };
    }

    if (res.status === 401) {
      return {
        check_name: 'Square Access Token Valid',
        category: 'payments',
        status: 'fail',
        message: 'Square access token is invalid or expired',
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Square Access Token Valid',
      category: 'payments',
      status: 'warn',
      message: `Square returned ${res.status}`,
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'Square Access Token Valid',
      category: 'payments',
      status: 'fail',
      message: `Could not reach Square: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}

// ============ PAYPAL ============

export async function checkPayPalCredentials(
  clientId: string,
  clientSecret: string,
  sandbox: boolean = false
): Promise<CheckResult> {
  const start = Date.now();
  const baseUrl = sandbox
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

  try {
    const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      const data: any = await res.json();
      return {
        check_name: 'PayPal Credentials Valid',
        category: 'payments',
        status: 'pass',
        message: `PayPal credentials valid (${sandbox ? 'SANDBOX' : 'LIVE'}) — token obtained`,
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'PayPal Credentials Valid',
      category: 'payments',
      status: 'fail',
      message: `PayPal auth failed (${res.status}) — check client ID and secret`,
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'PayPal Credentials Valid',
      category: 'payments',
      status: 'fail',
      message: `Could not reach PayPal: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}
