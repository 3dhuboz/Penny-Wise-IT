// payments-square — Square payment processing feature module
// Supports one-time Checkout links and webhook handling
import { Context } from 'hono';

interface SquareEnv {
  SQUARE_ACCESS_TOKEN: string;
  SQUARE_LOCATION_ID: string;
  SQUARE_WEBHOOK_SIGNATURE_KEY?: string;
  SQUARE_ENVIRONMENT?: string;
  DB: D1Database;
}

// ============ SQUARE API HELPERS ============

function getBaseUrl(env: SquareEnv): string {
  return env.SQUARE_ENVIRONMENT === 'sandbox'
    ? 'https://connect.squareupsandbox.com/v2'
    : 'https://connect.squareup.com/v2';
}

async function squareRequest(baseUrl: string, path: string, token: string, opts: RequestInit = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Square-Version': '2024-06-04',
      ...opts.headers,
    },
  });
  const data = await res.json() as any;
  if (!res.ok) {
    const msg = data.errors?.[0]?.detail || 'Square API error';
    throw new Error(msg);
  }
  return data;
}

// ============ ROUTE HANDLERS ============

// POST /api/payments/create-checkout — create Square Checkout link
export async function handleCreateCheckout(c: Context<{ Bindings: SquareEnv }>) {
  const user = c.get('user') as any;
  const { amount, currency, description, redirect_url } = await c.req.json();

  if (!amount || !redirect_url) {
    return c.json({ error: 'amount and redirect_url are required' }, 400);
  }

  const baseUrl = getBaseUrl(c.env);
  const idempotencyKey = crypto.randomUUID();

  const order = await squareRequest(baseUrl, '/orders', c.env.SQUARE_ACCESS_TOKEN, {
    method: 'POST',
    body: JSON.stringify({
      idempotency_key: idempotencyKey,
      order: {
        location_id: c.env.SQUARE_LOCATION_ID,
        line_items: [{
          name: description || 'Payment',
          quantity: '1',
          base_price_money: {
            amount: amount,
            currency: (currency || 'AUD').toUpperCase(),
          },
        }],
        metadata: user ? { user_id: user.id } : {},
      },
    }),
  });

  const checkout = await squareRequest(baseUrl, '/online-checkout/payment-links', c.env.SQUARE_ACCESS_TOKEN, {
    method: 'POST',
    body: JSON.stringify({
      idempotency_key: crypto.randomUUID(),
      payment_link: {
        order_id: order.order.id,
        checkout_options: {
          redirect_url,
        },
      },
    }),
  });

  return c.json({
    checkout_url: checkout.payment_link.url,
    order_id: order.order.id,
    payment_link_id: checkout.payment_link.id,
  });
}

// GET /api/payments/history — user's payment history
export async function handlePaymentHistory(c: Context<{ Bindings: SquareEnv }>) {
  const user = c.get('user') as any;
  const payments = await c.env.DB.prepare(
    'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
  ).bind(user.id).all();

  return c.json({ payments: payments.results });
}

// POST /webhooks/square — handle Square events
export async function handleSquareWebhook(c: Context<{ Bindings: SquareEnv }>) {
  const body = await c.req.text();

  // TODO: Verify webhook signature with SQUARE_WEBHOOK_SIGNATURE_KEY
  const event = JSON.parse(body);

  switch (event.type) {
    case 'payment.completed': {
      const payment = event.data.object.payment;
      const orderId = payment.order_id;
      const userId = payment.note ? null : null; // Extracted from order metadata in real impl

      await c.env.DB.prepare(
        'INSERT OR IGNORE INTO payments (id, user_id, square_payment_id, square_customer_id, amount, currency, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        userId,
        payment.id,
        payment.customer_id || null,
        payment.amount_money?.amount || 0,
        payment.amount_money?.currency || 'AUD',
        'completed',
        `Order ${orderId || 'unknown'}`
      ).run();
      break;
    }

    case 'payment.updated': {
      const payment = event.data.object.payment;
      if (payment.status === 'FAILED' || payment.status === 'CANCELED') {
        await c.env.DB.prepare(
          "UPDATE payments SET status = ?, metadata = datetime('now') WHERE square_payment_id = ?"
        ).bind(payment.status.toLowerCase(), payment.id).run();
      }
      break;
    }
  }

  return c.json({ received: true });
}

// ============ FEATURE REGISTRATION ============

export function registerPaymentsSquare(app: any, authMiddleware?: any) {
  const auth = authMiddleware || ((c: any, next: any) => next());
  app.post('/api/payments/create-checkout', auth, handleCreateCheckout);
  app.get('/api/payments/history', auth, handlePaymentHistory);
  app.post('/webhooks/square', handleSquareWebhook);
}
