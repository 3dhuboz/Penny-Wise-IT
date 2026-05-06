// PennyWiseIT Command Centre — admin dashboard
//
// Auth: validates the admin's salesperson session token (issued by
// /salesperson/auth on the validator and dropped in here by the
// /admin/login flow on the showcase). Token can arrive via:
//   1. ?token=<jwt-style-id> query param  — set on first arrival from the
//      showcase login redirect, immediately stored as a cookie + stripped
//      from the URL bar
//   2. pwit_admin_token cookie               — used on every subsequent request
//
// Data: reads composer-db (the validator's D1 database) directly via the
// DB binding instead of HTTP-proxying through the validator. Saves a
// network hop and means we don't need to share VALIDATOR_SECRET.
//
// Anything not authenticated as an owner/admin gets a 302 redirect to the
// showcase admin login page.
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import dashboardHtml from '../index.html';

type Env = {
  DB: D1Database;
};

type Session = {
  salesperson_id: string;
  name: string;
  role: string;
};

type Variables = {
  session: Session;
};

const COOKIE_NAME = 'pwit_admin_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days — matches sales_sessions expiry
const LOGIN_URL = 'https://pennywiseit.com.au/admin/login';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use('*', cors());

async function verifyToken(db: D1Database, token: string): Promise<Session | null> {
  if (!token) return null;
  const row = await db
    .prepare(
      `SELECT s.salesperson_id, sp.name, sp.role
       FROM sales_sessions s
       JOIN salespeople sp ON sp.id = s.salesperson_id
       WHERE s.token = ? AND s.expires_at > datetime('now') AND sp.active = 1`
    )
    .bind(token)
    .first<Session>();
  if (!row) return null;
  if (row.role !== 'owner' && row.role !== 'admin') return null;
  return row;
}

// Health check — no auth.
app.get('/health', (c) =>
  c.json({ status: 'ok', app: 'pennywiseit-dashboard', version: '2.0.0' })
);

// Auth middleware — runs on everything else. Extracts token from query
// (first hop) or cookie (subsequent), validates against sales_sessions,
// promotes valid query tokens to cookies and strips them from the URL bar.
app.use('*', async (c, next) => {
  const url = new URL(c.req.url);
  const queryToken = url.searchParams.get('token');
  const cookieToken = getCookie(c, COOKIE_NAME);
  const token = (queryToken || cookieToken || '').trim();

  const session = await verifyToken(c.env.DB, token);
  if (!session) {
    return c.redirect(LOGIN_URL, 302);
  }

  // Token freshly arrived via query string — promote to cookie + strip.
  if (queryToken) {
    setCookie(c, COOKIE_NAME, queryToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    // Redirect to the same path without ?token= so the URL bar is clean.
    url.searchParams.delete('token');
    const clean = url.pathname + (url.search ? url.search : '') + url.hash;
    return c.redirect(clean || '/', 302);
  }

  c.set('session', session);
  await next();
});

// Root — serve the dashboard HTML.
app.get('/', (c) => c.html(dashboardHtml));

// Apps list — read directly from D1.
app.get('/api/apps', async (c) => {
  const result = await c.env.DB.prepare(
    `SELECT * FROM apps WHERE status = 'active' ORDER BY name`
  ).all();
  return c.json({ apps: result.results || [] });
});

// Recent validation runs — for the activity widget (if/when the HTML uses it).
app.get('/api/runs', async (c) => {
  const result = await c.env.DB.prepare(
    `SELECT vr.*, a.name AS app_name, a.brand_name, a.brand_color, a.domain
     FROM validation_runs vr
     JOIN apps a ON a.id = vr.app_id
     ORDER BY vr.created_at DESC
     LIMIT 50`
  ).all();
  return c.json({ runs: result.results || [] });
});

// Who am I — used by the dashboard to show the signed-in admin's name.
app.get('/api/me', (c) => {
  const session = c.get('session');
  return c.json({
    name: session.name,
    role: session.role,
    salesperson_id: session.salesperson_id,
  });
});

// Validation triggers — currently routes 503 with a clear note. Once the
// validator deploys with the new auth middleware, swap this to a fetch()
// proxy that forwards `Authorization: Bearer <session-token>` upstream.
app.post('/api/validate/:id', (c) =>
  c.json(
    {
      error:
        'Validation runs require the validator deploy update. Re-run the deploy with an API token that has Workers KV: Edit perms.',
    },
    503
  )
);
app.post('/api/validate-all', (c) =>
  c.json(
    {
      error:
        'Bulk validation requires the validator deploy update. Re-run the deploy with an API token that has Workers KV: Edit perms.',
    },
    503
  )
);

// Logout — clears the cookie and bounces to /admin/login.
app.get('/logout', (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/' });
  return c.redirect(LOGIN_URL, 302);
});

export default { fetch: app.fetch };
