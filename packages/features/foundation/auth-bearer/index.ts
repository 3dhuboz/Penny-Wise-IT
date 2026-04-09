// auth-bearer — Custom JWT Bearer authentication feature module
// Uses Web Crypto API (CF Workers native), PBKDF2 password hashing, HMAC-SHA256 JWTs
// No external auth provider — self-contained email/password auth
import { Context, Next } from 'hono';

interface AuthEnv {
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRY?: string;
  JWT_REFRESH_EXPIRY?: string;
  DB: D1Database;
}

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  active: number;
}

interface JwtPayload {
  sub: string;       // user id
  email: string;
  role: string;
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

// ============ CRYPTO HELPERS ============

// Encode string to base64url
function base64urlEncode(data: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < data.length; i++) binary += String.fromCharCode(data[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Decode base64url to string
function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '==='.slice(0, (4 - base64.length % 4) % 4);
  return atob(padded);
}

// Import HMAC-SHA256 key
async function importHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// Create a signed JWT
async function createJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>, secret: string, expirySeconds: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const full: JwtPayload = { ...payload, iat: now, exp: now + expirySeconds, type: payload.type };

  const header = base64urlEncode(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = base64urlEncode(new TextEncoder().encode(JSON.stringify(full)));
  const toSign = `${header}.${body}`;

  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(toSign));
  const sigB64 = base64urlEncode(new Uint8Array(sig));

  return `${toSign}.${sigB64}`;
}

// Verify and decode a JWT — throws on invalid/expired
async function verifyJwt(token: string, secret: string): Promise<JwtPayload> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const [header, body, sigB64] = parts;
  const key = await importHmacKey(secret);
  const valid = await crypto.subtle.verify(
    'HMAC', key,
    (() => { const b = atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; })(),
    new TextEncoder().encode(`${header}.${body}`)
  );

  if (!valid) throw new Error('Invalid token signature');

  const payload: JwtPayload = JSON.parse(base64urlDecode(body));
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');

  return payload;
}

// Hash a password using PBKDF2
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 },
    key, 256
  );
  const hashHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2:${saltHex}:${hashHex}`;
}

// Verify a password against a stored hash
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':');
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false;

  const [, saltHex, storedHash] = parts;
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 },
    key, 256
  );
  const hashHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === storedHash;
}

// Hash a refresh token for storage (we store hash, not plaintext)
async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============ TOKEN ISSUANCE ============

async function issueTokenPair(user: AuthUser, env: AuthEnv): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const accessExpiry = parseInt(env.JWT_ACCESS_EXPIRY || '3600');
  const refreshExpiry = parseInt(env.JWT_REFRESH_EXPIRY || '604800');

  const base = { sub: user.id, email: user.email, role: user.role };
  const accessToken = await createJwt({ ...base, type: 'access' }, env.JWT_SECRET, accessExpiry);
  const refreshToken = await createJwt({ ...base, type: 'refresh' }, env.JWT_SECRET, refreshExpiry);

  // Store refresh token hash
  const tokenHash = await hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + refreshExpiry * 1000).toISOString();
  await env.DB.prepare(
    'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)'
  ).bind(crypto.randomUUID(), user.id, tokenHash, expiresAt).run();

  return { accessToken, refreshToken, expiresIn: accessExpiry };
}

// ============ MIDDLEWARE ============

// Require authenticated user — returns 401 if no valid access token
export function requireAuth() {
  return async (c: Context<{ Bindings: AuthEnv }>, next: Next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const token = authHeader.slice(7);
    try {
      const payload = await verifyJwt(token, c.env.JWT_SECRET);
      if (payload.type !== 'access') return c.json({ error: 'Invalid token type' }, 401);

      // Fetch user from DB to check if still active
      const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ? AND active = 1').bind(payload.sub).first() as AuthUser | null;
      if (!user) return c.json({ error: 'User not found or deactivated' }, 401);

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
        const payload = await verifyJwt(token, c.env.JWT_SECRET);
        if (payload.type === 'access') {
          const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ? AND active = 1').bind(payload.sub).first() as AuthUser | null;
          if (user) {
            c.set('user', user);
            c.set('userId', user.id);
          }
        }
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
      const payload = await verifyJwt(token, c.env.JWT_SECRET);
      if (payload.type !== 'access') return c.json({ error: 'Invalid token type' }, 401);
      if (payload.role !== 'admin') return c.json({ error: 'Admin access required' }, 403);

      const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ? AND active = 1').bind(payload.sub).first() as AuthUser | null;
      if (!user) return c.json({ error: 'User not found or deactivated' }, 401);

      c.set('user', user);
      c.set('userId', user.id);
      await next();
    } catch (e) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
  };
}

// Require a specific role or higher (user < staff < admin)
export function requireRole(minRole: 'user' | 'staff' | 'admin') {
  const roleLevel = { user: 0, staff: 1, admin: 2 };
  return async (c: Context<{ Bindings: AuthEnv }>, next: Next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const token = authHeader.slice(7);
    try {
      const payload = await verifyJwt(token, c.env.JWT_SECRET);
      if (payload.type !== 'access') return c.json({ error: 'Invalid token type' }, 401);

      const userLevel = roleLevel[payload.role as keyof typeof roleLevel] ?? 0;
      if (userLevel < roleLevel[minRole]) {
        return c.json({ error: `${minRole} access required` }, 403);
      }

      const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ? AND active = 1').bind(payload.sub).first() as AuthUser | null;
      if (!user) return c.json({ error: 'User not found or deactivated' }, 401);

      c.set('user', user);
      c.set('userId', user.id);
      await next();
    } catch (e) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
  };
}

// ============ ROUTE HANDLERS ============

// POST /api/auth/register
export async function handleRegister(c: Context<{ Bindings: AuthEnv }>) {
  const { email, password, name } = await c.req.json();
  if (!email || !password) return c.json({ error: 'email and password required' }, 400);
  if (password.length < 8) return c.json({ error: 'Password must be at least 8 characters' }, 400);

  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
  if (existing) return c.json({ error: 'Email already registered' }, 409);

  const passwordHash = await hashPassword(password);
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)'
  ).bind(id, email.toLowerCase(), passwordHash, name || null).run();

  const user: AuthUser = { id, email: email.toLowerCase(), name: name || null, role: 'user', active: 1 };
  const tokens = await issueTokenPair(user, c.env);
  return c.json({ user: { id, email, name, role: 'user' }, ...tokens }, 201);
}

// POST /api/auth/login
export async function handleLogin(c: Context<{ Bindings: AuthEnv }>) {
  const { email, password } = await c.req.json();
  if (!email || !password) return c.json({ error: 'email and password required' }, 400);

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ? AND active = 1'
  ).bind(email.toLowerCase()).first() as AuthUser & { password_hash: string } | null;

  if (!user) return c.json({ error: 'Invalid email or password' }, 401);

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return c.json({ error: 'Invalid email or password' }, 401);

  // Update last_login
  await c.env.DB.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").bind(user.id).run();

  const tokens = await issueTokenPair(user, c.env);
  return c.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens });
}

// POST /api/auth/refresh
export async function handleRefresh(c: Context<{ Bindings: AuthEnv }>) {
  const { refreshToken } = await c.req.json();
  if (!refreshToken) return c.json({ error: 'refreshToken required' }, 400);

  try {
    const payload = await verifyJwt(refreshToken, c.env.JWT_SECRET);
    if (payload.type !== 'refresh') return c.json({ error: 'Invalid token type' }, 401);

    const tokenHash = await hashToken(refreshToken);
    const stored = await c.env.DB.prepare(
      'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked = 0'
    ).bind(tokenHash).first();

    if (!stored) return c.json({ error: 'Token not found or revoked' }, 401);

    const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ? AND active = 1').bind(payload.sub).first() as AuthUser | null;
    if (!user) return c.json({ error: 'User not found' }, 401);

    // Revoke old refresh token (rotation)
    await c.env.DB.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?').bind(tokenHash).run();

    const tokens = await issueTokenPair(user, c.env);
    return c.json(tokens);
  } catch {
    return c.json({ error: 'Invalid or expired refresh token' }, 401);
  }
}

// POST /api/auth/logout
export async function handleLogout(c: Context<{ Bindings: AuthEnv }>) {
  const { refreshToken } = await c.req.json();
  if (refreshToken) {
    const tokenHash = await hashToken(refreshToken);
    await c.env.DB.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?').bind(tokenHash).run();
  }
  return c.json({ success: true });
}

// GET /api/auth/me
export async function handleMe(c: Context<{ Bindings: AuthEnv }>) {
  const user = c.get('user') as AuthUser;
  return c.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}

// PUT /api/auth/me — update name or password
export async function handleUpdateMe(c: Context<{ Bindings: AuthEnv }>) {
  const user = c.get('user') as AuthUser;
  const { name, currentPassword, newPassword } = await c.req.json();

  if (newPassword) {
    if (!currentPassword) return c.json({ error: 'currentPassword required to change password' }, 400);
    if (newPassword.length < 8) return c.json({ error: 'Password must be at least 8 characters' }, 400);

    const stored = await c.env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(user.id).first() as { password_hash: string } | null;
    if (!stored) return c.json({ error: 'User not found' }, 404);

    const valid = await verifyPassword(currentPassword, stored.password_hash);
    if (!valid) return c.json({ error: 'Current password incorrect' }, 401);

    const newHash = await hashPassword(newPassword);
    await c.env.DB.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").bind(newHash, user.id).run();
  }

  if (name !== undefined) {
    await c.env.DB.prepare("UPDATE users SET name = ?, updated_at = datetime('now') WHERE id = ?").bind(name, user.id).run();
  }

  return c.json({ success: true });
}

// GET /api/admin/users
export async function handleListUsers(c: Context<{ Bindings: AuthEnv }>) {
  const users = await c.env.DB.prepare(
    'SELECT id, email, name, role, active, last_login, created_at FROM users ORDER BY created_at DESC'
  ).all();
  return c.json({ users: users.results });
}

// PUT /api/admin/users/:id/role
export async function handleSetRole(c: Context<{ Bindings: AuthEnv }>) {
  const { id } = c.req.param();
  const { role } = await c.req.json();
  if (!['user', 'staff', 'admin'].includes(role)) return c.json({ error: 'Invalid role' }, 400);
  await c.env.DB.prepare("UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?").bind(role, id).run();
  return c.json({ success: true });
}

// DELETE /api/admin/users/:id — soft delete
export async function handleDeactivateUser(c: Context<{ Bindings: AuthEnv }>) {
  const { id } = c.req.param();
  await c.env.DB.prepare("UPDATE users SET active = 0, updated_at = datetime('now') WHERE id = ?").bind(id).run();
  // Revoke all refresh tokens
  await c.env.DB.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?').bind(id).run();
  return c.json({ success: true });
}

// Cron: clean up expired/revoked tokens
export async function cleanupExpiredTokens(db: D1Database): Promise<void> {
  await db.prepare(
    "DELETE FROM refresh_tokens WHERE expires_at < datetime('now') OR revoked = 1"
  ).run();
}

// ============ FEATURE REGISTRATION ============

export function registerAuthBearer(app: any) {
  app.post('/api/auth/register', handleRegister);
  app.post('/api/auth/login', handleLogin);
  app.post('/api/auth/refresh', handleRefresh);
  app.post('/api/auth/logout', requireAuth(), handleLogout);
  app.get('/api/auth/me', requireAuth(), handleMe);
  app.put('/api/auth/me', requireAuth(), handleUpdateMe);
  app.get('/api/admin/users', requireAdmin(), handleListUsers);
  app.put('/api/admin/users/:id/role', requireAdmin(), handleSetRole);
  app.delete('/api/admin/users/:id', requireAdmin(), handleDeactivateUser);
}
