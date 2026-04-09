// payments-paypal — PayPal payment processing feature module
// Supports Orders API (one-time), Subscriptions API, and webhooks
import { Context } from 'hono';

interface PayPalEnv {
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_SANDBOX?: string;
  DB: D1Database;
}

function getBaseUrl(env: PayPalEnv): string {
  return env.PAYPAL_SANDBOX === 'true'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
}

// Get OAuth token from PayPal
async function getAccessToken(env: PayPalEnv): Promise<string> {
  const base = getBaseUrl(env);
  const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data: any = await res.json();
  if (!res.ok) throw new Error(data.error_description || 'PayPal auth failed');
  return data.access_token;
}

async function paypalRequest(env: PayPalEnv, path: string, opts: RequestInit = {}) {
  const token = await getAccessToken(env);
  const base = getBaseUrl(env);

  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error((data as any).message || 'PayPal API error');
  return data;
}

// ============ ROUTE HANDLERS ============

// POST /api/payments/create-order — create a one-time payment order
export async function handleCreateOrder(c: Context<{ Bindings: PayPalEnv }>) {
  const user = c.get('user') as any;
  const { amount, currency, description, return_url, cancel_url } = await c.req.json();

  if (!amount || !return_url || !cancel_url) {
    return c.json({ error: 'amount, return_url, and cancel_url are required' }, 400);
  }

  const order: any = await paypalRequest(c.env, '/v2/checkout/orders', {
    method: 'POST',
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency || 'AUD',
          value: (amount / 100).toFixed(2), // Convert cents to dollars
        },
        description: description || 'Payment',
        custom_id: user.id,
      }],
      application_context: {
        return_url,
        cancel_url,
        brand_name: c.env.APP_NAME || 'PennyWiseIT',
        user_action: 'PAY_NOW',
      },
    }),
  });

  // Save pending payment
  await c.env.DB.prepare(
    'INSERT INTO payments (id, user_id, paypal_order_id, amount, currency, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(crypto.randomUUID(), user.id, order.id, amount, currency || 'AUD', 'pending', description || 'Payment').run();

  const approvalUrl = order.links?.find((l: any) => l.rel === 'approve')?.href;
  return c.json({ order_id: order.id, approval_url: approvalUrl });
}

// POST /api/payments/capture-order — capture after buyer approves
export async function handleCaptureOrder(c: Context<{ Bindings: PayPalEnv }>) {
  const { order_id } = await c.req.json();
  if (!order_id) return c.json({ error: 'order_id required' }, 400);

  const capture: any = await paypalRequest(c.env, `/v2/checkout/orders/${order_id}/capture`, {
    method: 'POST',
  });

  const payerId = capture.payer?.payer_id;
  await c.env.DB.prepare(
    "UPDATE payments SET status = 'completed', paypal_payer_id = ? WHERE paypal_order_id = ?"
  ).bind(payerId || null, order_id).run();

  return c.json({ success: true, status: capture.status });
}

// POST /api/payments/create-subscription
export async function handleCreateSubscription(c: Context<{ Bindings: PayPalEnv }>) {
  const user = c.get('user') as any;
  const { plan_id, return_url, cancel_url } = await c.req.json();

  if (!plan_id || !return_url || !cancel_url) {
    return c.json({ error: 'plan_id, return_url, and cancel_url are required' }, 400);
  }

  const sub: any = await paypalRequest(c.env, '/v1/billing/subscriptions', {
    method: 'POST',
    body: JSON.stringify({
      plan_id,
      custom_id: user.id,
      application_context: {
        return_url,
        cancel_url,
        brand_name: c.env.APP_NAME || 'PennyWiseIT',
        user_action: 'SUBSCRIBE_NOW',
      },
    }),
  });

  const approvalUrl = sub.links?.find((l: any) => l.rel === 'approve')?.href;
  return c.json({ subscription_id: sub.id, approval_url: approvalUrl });
}

// GET /api/payments/history
export async function handlePaymentHistory(c: Context<{ Bindings: PayPalEnv }>) {
  const user = c.get('user') as any;
  const payments = await c.env.DB.prepare(
    'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
  ).bind(user.id).all();
  return c.json({ payments: payments.results });
}

// GET /api/payments/subscription
export async function handleGetSubscription(c: Context<{ Bindings: PayPalEnv }>) {
  const user = c.get('user') as any;
  const sub = await c.env.DB.prepare(
    "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
  ).bind(user.id).first();
  return c.json({ subscription: sub || null });
}

// POST /api/payments/cancel-subscription
export async function handleCancelSubscription(c: Context<{ Bindings: PayPalEnv }>) {
  const user = c.get('user') as any;
  const sub = await c.env.DB.prepare(
    "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
  ).bind(user.id).first();

  if (!sub) return c.json({ error: 'No active subscription' }, 404);

  await paypalRequest(c.env, `/v1/billing/subscriptions/${sub.paypal_subscription_id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason: 'Customer requested cancellation' }),
  });

  await c.env.DB.prepare(
    "UPDATE subscriptions SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?"
  ).bind(sub.id).run();

  return c.json({ success: true });
}

// POST /webhooks/paypal
export async function handlePayPalWebhook(c: Context<{ Bindings: PayPalEnv }>) {
  const event = await c.req.json();

  switch (event.event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED': {
      const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
      if (orderId) {
        await c.env.DB.prepare(
          "UPDATE payments SET status = 'completed' WHERE paypal_order_id = ?"
        ).bind(orderId).run();
      }
      break;
    }
    case 'BILLING.SUBSCRIPTION.ACTIVATED': {
      const sub = event.resource;
      const userId = sub.custom_id;
      if (userId && sub.id) {
        await c.env.DB.prepare(
          'INSERT INTO subscriptions (id, user_id, paypal_subscription_id, paypal_plan_id, status) VALUES (?, ?, ?, ?, ?)'
        ).bind(crypto.randomUUID(), userId, sub.id, sub.plan_id, 'active').run();
      }
      break;
    }
    case 'BILLING.SUBSCRIPTION.CANCELLED': {
      const subId = event.resource?.id;
      if (subId) {
        await c.env.DB.prepare(
          "UPDATE subscriptions SET status = 'cancelled', updated_at = datetime('now') WHERE paypal_subscription_id = ?"
        ).bind(subId).run();
      }
      break;
    }
  }

  return c.json({ received: true });
}

// ============ FEATURE REGISTRATION ============

export function registerPaymentsPaypal(app: any, authMiddleware?: any) {
  const auth = authMiddleware || ((c: any, next: any) => next());
  app.post('/api/payments/create-order', auth, handleCreateOrder);
  app.post('/api/payments/capture-order', auth, handleCaptureOrder);
  app.post('/api/payments/create-subscription', auth, handleCreateSubscription);
  app.get('/api/payments/history', auth, handlePaymentHistory);
  app.get('/api/payments/subscription', auth, handleGetSubscription);
  app.post('/api/payments/cancel-subscription', auth, handleCancelSubscription);
  app.post('/webhooks/paypal', handlePayPalWebhook);
}
