// payments-stripe — Stripe payment processing feature module
// Supports one-time Checkout, subscriptions, and webhook handling
import { Context } from 'hono';

interface PaymentEnv {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  DB: D1Database;
}

// ============ STRIPE API HELPERS ============

async function stripeRequest(path: string, secretKey: string, opts: RequestInit = {}) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...opts.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Stripe API error');
  return data;
}

function encodeForm(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

// Get or create a Stripe customer for a user
async function getOrCreateCustomer(
  db: D1Database,
  secretKey: string,
  userId: string,
  email: string
): Promise<string> {
  // Check if user already has a Stripe customer
  const existing = await db.prepare(
    'SELECT stripe_customer_id FROM payments WHERE user_id = ? AND stripe_customer_id IS NOT NULL LIMIT 1'
  ).bind(userId).first();

  if (existing?.stripe_customer_id) return existing.stripe_customer_id as string;

  // Check subscriptions table too
  const existingSub = await db.prepare(
    'SELECT stripe_customer_id FROM subscriptions WHERE user_id = ? AND stripe_customer_id IS NOT NULL LIMIT 1'
  ).bind(userId).first();

  if (existingSub?.stripe_customer_id) return existingSub.stripe_customer_id as string;

  // Create new customer
  const customer = await stripeRequest('/customers', secretKey, {
    method: 'POST',
    body: encodeForm({ email, metadata: JSON.stringify({ user_id: userId }) }),
  });

  return customer.id;
}

// ============ ROUTE HANDLERS ============

// POST /api/payments/create-checkout — one-time payment
export async function handleCreateCheckout(c: Context<{ Bindings: PaymentEnv }>) {
  const user = c.get('user') as any;
  const { amount, currency, description, success_url, cancel_url } = await c.req.json();

  if (!amount || !success_url || !cancel_url) {
    return c.json({ error: 'amount, success_url, and cancel_url are required' }, 400);
  }

  const customerId = await getOrCreateCustomer(c.env.DB, c.env.STRIPE_SECRET_KEY, user.id, user.email);

  const session = await stripeRequest('/checkout/sessions', c.env.STRIPE_SECRET_KEY, {
    method: 'POST',
    body: encodeForm({
      customer: customerId,
      mode: 'payment',
      'line_items[0][price_data][currency]': currency || 'aud',
      'line_items[0][price_data][unit_amount]': String(amount),
      'line_items[0][price_data][product_data][name]': description || 'Payment',
      'line_items[0][quantity]': '1',
      success_url,
      cancel_url,
      'metadata[user_id]': user.id,
    }),
  });

  return c.json({ checkout_url: session.url, session_id: session.id });
}

// POST /api/payments/create-subscription — subscription checkout
export async function handleCreateSubscription(c: Context<{ Bindings: PaymentEnv }>) {
  const user = c.get('user') as any;
  const { price_id, success_url, cancel_url } = await c.req.json();

  if (!price_id || !success_url || !cancel_url) {
    return c.json({ error: 'price_id, success_url, and cancel_url are required' }, 400);
  }

  const customerId = await getOrCreateCustomer(c.env.DB, c.env.STRIPE_SECRET_KEY, user.id, user.email);

  const session = await stripeRequest('/checkout/sessions', c.env.STRIPE_SECRET_KEY, {
    method: 'POST',
    body: encodeForm({
      customer: customerId,
      mode: 'subscription',
      'line_items[0][price]': price_id,
      'line_items[0][quantity]': '1',
      success_url,
      cancel_url,
      'metadata[user_id]': user.id,
    }),
  });

  return c.json({ checkout_url: session.url, session_id: session.id });
}

// GET /api/payments/history — user's payment history
export async function handlePaymentHistory(c: Context<{ Bindings: PaymentEnv }>) {
  const user = c.get('user') as any;
  const payments = await c.env.DB.prepare(
    'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
  ).bind(user.id).all();

  return c.json({ payments: payments.results });
}

// GET /api/payments/subscription — current subscription
export async function handleGetSubscription(c: Context<{ Bindings: PaymentEnv }>) {
  const user = c.get('user') as any;
  const sub = await c.env.DB.prepare(
    "SELECT * FROM subscriptions WHERE user_id = ? AND status IN ('active', 'past_due', 'trialing') ORDER BY created_at DESC LIMIT 1"
  ).bind(user.id).first();

  return c.json({ subscription: sub || null });
}

// POST /api/payments/cancel-subscription
export async function handleCancelSubscription(c: Context<{ Bindings: PaymentEnv }>) {
  const user = c.get('user') as any;
  const sub = await c.env.DB.prepare(
    "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
  ).bind(user.id).first();

  if (!sub) return c.json({ error: 'No active subscription found' }, 404);

  await stripeRequest(`/subscriptions/${sub.stripe_subscription_id}`, c.env.STRIPE_SECRET_KEY, {
    method: 'POST',
    body: encodeForm({ cancel_at_period_end: 'true' }),
  });

  await c.env.DB.prepare(
    "UPDATE subscriptions SET cancel_at_period_end = 1, updated_at = datetime('now') WHERE id = ?"
  ).bind(sub.id).run();

  return c.json({ success: true, cancels_at: sub.current_period_end });
}

// POST /webhooks/stripe — handle Stripe events
export async function handleStripeWebhook(c: Context<{ Bindings: PaymentEnv }>) {
  const body = await c.req.text();
  const sig = c.req.header('stripe-signature');

  // In production, verify signature with STRIPE_WEBHOOK_SECRET
  // For now, parse the event directly
  const event = JSON.parse(body);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      if (!userId) break;

      if (session.mode === 'payment') {
        await c.env.DB.prepare(
          'INSERT INTO payments (id, user_id, stripe_payment_id, stripe_customer_id, amount, currency, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          crypto.randomUUID(), userId, session.payment_intent, session.customer,
          session.amount_total, session.currency, 'completed', 'Checkout payment'
        ).run();
      } else if (session.mode === 'subscription') {
        await c.env.DB.prepare(
          'INSERT INTO subscriptions (id, user_id, stripe_subscription_id, stripe_customer_id, status) VALUES (?, ?, ?, ?, ?)'
        ).bind(
          crypto.randomUUID(), userId, session.subscription, session.customer, 'active'
        ).run();
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object;
      const subId = invoice.subscription;
      if (subId) {
        await c.env.DB.prepare(
          "UPDATE subscriptions SET status = 'active', updated_at = datetime('now') WHERE stripe_subscription_id = ?"
        ).bind(subId).run();
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const subId = invoice.subscription;
      if (subId) {
        await c.env.DB.prepare(
          "UPDATE subscriptions SET status = 'past_due', updated_at = datetime('now') WHERE stripe_subscription_id = ?"
        ).bind(subId).run();
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await c.env.DB.prepare(
        "UPDATE subscriptions SET status = 'cancelled', updated_at = datetime('now') WHERE stripe_subscription_id = ?"
      ).bind(sub.id).run();
      break;
    }
  }

  return c.json({ received: true });
}

// ============ FEATURE REGISTRATION ============

export function registerPaymentsStripe(app: any, authMiddleware?: any) {
  const auth = authMiddleware || ((c: any, next: any) => next());
  app.post('/api/payments/create-checkout', auth, handleCreateCheckout);
  app.post('/api/payments/create-subscription', auth, handleCreateSubscription);
  app.get('/api/payments/history', auth, handlePaymentHistory);
  app.get('/api/payments/subscription', auth, handleGetSubscription);
  app.post('/api/payments/cancel-subscription', auth, handleCancelSubscription);
  app.post('/webhooks/stripe', handleStripeWebhook);
}
