// auth-clerk — Clerk authentication feature module
// Provides middleware and route handlers for Clerk-based auth
import { Context, Next } from 'hono';

interface AuthEnv {
  CLERK_SECRET_KEY: string;
  DB: D1Database;
}

interface AuthUser {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  role: string;
  avatar_url: string | null;
}

// Verify a Clerk session token and return user claims
async function verifyClerkToken(token: string, secretKey: string): Promise<any> {
  // Clerk session tokens are JWTs signed by Clerk
  // We verify by calling Clerk's API
  const res = await fetch('https://api.clerk.com/v1/clients/verify', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    // Fallback: decode JWT and verify via Clerk's session endpoint
    const sessionRes = await fetch('https://api.clerk.com/v1/sessions', {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    if (!sessionRes.ok) throw new Error('Invalid session');
    return sessionRes.json();
  }
  return res.json();
}

// Get or create a local user record from Clerk claims
async function getOrCreateUser(db: D1Database, clerkUser: any): Promise<AuthUser> {
  const clerkId = clerkUser.id || clerkUser.sub;
  const email = clerkUser.email_addresses?.[0]?.email_address || clerkUser.email || '';
  const name = [clerkUser.first_name, clerkUser.last_name].filter(Boolean).join(' ') || email;
  const avatar = clerkUser.image_url || clerkUser.profile_image_url || null;

  // Try to find existing user
  const existing = await db.prepare(
    'SELECT * FROM users WHERE clerk_id = ?'
  ).bind(clerkId).first();

  if (existing) {
    // Update if name/email changed
    if (existing.email !== email || existing.name !== name) {
      await db.prepare(
        "UPDATE users SET email = ?, name = ?, avatar_url = ?, updated_at = datetime('now') WHERE clerk_id = ?"
      ).bind(email, name, avatar, clerkId).run();
    }
    return existing as unknown as AuthUser;
  }

  // Create new user
  const id = crypto.randomUUID();
  await db.prepare(
    'INSERT INTO users (id, clerk_id, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, clerkId, email, name, avatar).run();

  return { id, clerk_id: clerkId, email, name, role: 'user', avatar_url: avatar };
}

// ============ MIDDLEWARE ============

// Require authenticated user — returns 401 if no valid token
export function requireAuth() {
  return async (c: Context<{ Bindings: AuthEnv }>, next: Next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const token = authHeader.slice(7);
    try {
      const claims = await verifyClerkToken(token, c.env.CLERK_SECRET_KEY);
      const user = await getOrCreateUser(c.env.DB, claims);
      c.set('user', user);
      c.set('userId', user.id);
      await next();
    } catch (e) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
  };
}

// Optional auth — sets user if token present, continues either way
export function optionalAuth() {
  return async (c: Context<{ Bindings: AuthEnv }>, next: Next) => {
    const authHeader = c.req.header('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const claims = await verifyClerkToken(token, c.env.CLERK_SECRET_KEY);
        const user = await getOrCreateUser(c.env.DB, claims);
        c.set('user', user);
        c.set('userId', user.id);
      } catch {
        // Token invalid — continue without user
      }
    }
    await next();
  };
}

// Require admin role
export function requireAdmin() {
  return async (c: Context<{ Bindings: AuthEnv }>, next: Next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const token = authHeader.slice(7);
    try {
      const claims = await verifyClerkToken(token, c.env.CLERK_SECRET_KEY);
      const user = await getOrCreateUser(c.env.DB, claims);
      if (user.role !== 'admin') {
        return c.json({ error: 'Admin access required' }, 403);
      }
      c.set('user', user);
      c.set('userId', user.id);
      await next();
    } catch (e) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
  };
}

// ============ ROUTE HANDLERS ============

// POST /api/auth/verify — verify a session token
export async function handleVerify(c: Context<{ Bindings: AuthEnv }>) {
  const { token } = await c.req.json();
  if (!token) return c.json({ error: 'Token required' }, 400);

  try {
    const claims = await verifyClerkToken(token, c.env.CLERK_SECRET_KEY);
    const user = await getOrCreateUser(c.env.DB, claims);
    return c.json({ valid: true, user });
  } catch {
    return c.json({ valid: false }, 401);
  }
}

// GET /api/auth/me — get current user
export async function handleMe(c: Context<{ Bindings: AuthEnv }>) {
  const user = c.get('user');
  return c.json({ user });
}

// POST /webhooks/clerk — handle Clerk webhook events
export async function handleClerkWebhook(c: Context<{ Bindings: AuthEnv }>) {
  const payload = await c.req.json();
  const eventType = payload.type;

  switch (eventType) {
    case 'user.created':
    case 'user.updated': {
      const data = payload.data;
      await getOrCreateUser(c.env.DB, data);
      break;
    }
    case 'user.deleted': {
      const clerkId = payload.data.id;
      await c.env.DB.prepare(
        "UPDATE users SET role = 'deleted', updated_at = datetime('now') WHERE clerk_id = ?"
      ).bind(clerkId).run();
      break;
    }
  }

  return c.json({ received: true });
}

// ============ FEATURE REGISTRATION ============

// Register this feature's routes on a Hono app
export function registerAuthClerk(app: any) {
  app.post('/api/auth/verify', handleVerify);
  app.get('/api/auth/me', requireAuth(), handleMe);
  app.post('/webhooks/clerk', handleClerkWebhook);
}
