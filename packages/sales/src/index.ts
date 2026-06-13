// PennyWiseIT Sales App + Owner Console
//
// Public routes (`/`, `/apply`, `/wins`, etc.) serve the salesperson portal +
// public marketing pages — these have always been here.
//
// /admin/* routes are the new owner console. Authenticate via the same
// /salesperson/auth token issued by the validator. Token can arrive via
// `?token=<id>` query (first hop from pennywiseit.com.au/admin/login) or
// the `pwit_admin_token` cookie. Sessions are validated against
// composer-db.sales_sessions and gated on role = owner | admin.
//
// All admin reads happen directly against D1 — same database the validator
// writes to — so we don't have to round-trip through the validator Worker
// (which is currently locked behind a KV-perm OAuth deploy issue anyway).
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import salesHtml from '../SALES.html';
import applyHtml from '../APPLY.html';
import winsHtml from '../WINS.html';
import helpHtml from '../HELP.html';
import privacyHtml from '../PRIVACY.html';
import termsHtml from '../TERMS.html';
import onboardHtml from '../ONBOARD.html';
import adminHtml from '../ADMIN.html';
import adminAppsHtml from '../ADMIN_APPS.html';
import adminLeadsHtml from '../ADMIN_LEADS.html';
import adminTeamHtml from '../ADMIN_TEAM.html';
import adminSupportHtml from '../ADMIN_SUPPORT.html';

type Env = {
  DB: D1Database;
  BUG_SQUASHER_ADMIN_TOKEN?: string;
  BUG_SQUASHER_API_URL?: string;
  BUG_SQUASHER_PORTAL_BASE_URL?: string;
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
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const LOGIN_URL = 'https://pennywiseit.com.au/admin/login';
const DEFAULT_SUPPORT_API_URL = 'https://support.pennywiseit.com.au/api';
const DEFAULT_SUPPORT_PORTAL_BASE_URL = 'https://support.pennywiseit.com.au';
const SUPPORT_STATUSES = ['New', 'Needs info', 'Fixing', 'Deployed', 'Closed'] as const;

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use('*', cors());

async function verifyAdminToken(db: D1Database, token: string): Promise<Session | null> {
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

type SupportStatus = (typeof SUPPORT_STATUSES)[number];

type SupportClient = {
  id?: string;
  slug?: string;
  displayName?: string;
  shortName?: string;
  status?: string;
  installTitle?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  preferredContact?: string;
  themeColor?: string;
  emergencySmsEnabled?: boolean;
  notes?: string;
  sites?: Array<{
    id?: string;
    label?: string;
    url?: string;
    healthUrl?: string;
    repoHint?: string;
    cloudflareHint?: string;
    isDefault?: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

type SupportIssue = {
  id?: string;
  publicId?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: SupportStatus | string;
  severity?: string;
  category?: string;
  clientSlug?: string;
  clientDisplayName?: string;
  clientName?: string;
  businessName?: string;
  siteLabel?: string;
  title?: string;
  description?: string;
  impact?: string;
  urgency?: string;
  afterHours?: boolean;
  attachments?: unknown[];
  triage?: {
    summary?: string;
    nextAction?: string;
    easyFixCandidate?: boolean;
    questions?: string[];
    routing?: {
      afterHours?: boolean;
      ownerAlert?: boolean;
      queue?: string;
      nextUpdateWindow?: string;
    };
  };
};

type SupportConfig = {
  apiUrl: string;
  portalBaseUrl: string;
  token: string;
};

type SupportApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; response: Response };

function readSupportConfig(c: any): SupportConfig | null {
  const token = String(c.env.BUG_SQUASHER_ADMIN_TOKEN || '').trim();
  if (!token) return null;

  return {
    token,
    apiUrl: stripTrailingSlash(String(c.env.BUG_SQUASHER_API_URL || DEFAULT_SUPPORT_API_URL)),
    portalBaseUrl: stripTrailingSlash(String(c.env.BUG_SQUASHER_PORTAL_BASE_URL || DEFAULT_SUPPORT_PORTAL_BASE_URL)),
  };
}

function supportUnavailable(c: any): Response {
  return c.json(
    {
      error: 'support_bridge_not_configured',
      message: 'BUG_SQUASHER_ADMIN_TOKEN is not configured on the sales Worker.',
      missing: ['BUG_SQUASHER_ADMIN_TOKEN'],
    },
    503
  );
}

async function callSupportApi<T>(c: any, path: string, init: RequestInit = {}): Promise<SupportApiResult<T>> {
  const config = readSupportConfig(c);
  if (!config) return { ok: false, response: supportUnavailable(c) };

  const headers = new Headers(init.headers || {});
  headers.set('accept', 'application/json');
  headers.set('x-admin-token', config.token);
  if (init.body) headers.set('content-type', 'application/json');

  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = { error: 'support_non_json_response', message: text.slice(0, 500) };
    }
  }

  if (!response.ok) {
    return { ok: false, response: c.json(data, response.status) };
  }

  return { ok: true, status: response.status, data: data as T };
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function summarizeSupport(issues: SupportIssue[], clients: SupportClient[]) {
  const open = issues.filter((issue) => issue.status !== 'Closed');
  const priority = open.filter((issue) => issue.severity === 'critical' || issue.severity === 'high');
  const needsInfo = open.filter((issue) => issue.status === 'Needs info');
  const fixing = open.filter((issue) => issue.status === 'Fixing');
  const easyFix = open.filter((issue) => Boolean(issue.triage?.easyFixCandidate));
  const afterHours = open.filter((issue) => Boolean(issue.afterHours || issue.triage?.routing?.afterHours));
  const withAttachments = open.filter((issue) => Array.isArray(issue.attachments) && issue.attachments.length > 0);

  return {
    generatedAt: new Date().toISOString(),
    counts: {
      clients: clients.length,
      open: open.length,
      priority: priority.length,
      needsInfo: needsInfo.length,
      fixing: fixing.length,
      easyFix: easyFix.length,
      afterHours: afterHours.length,
      withAttachments: withAttachments.length,
    },
    recent: issues.slice(0, 8),
    priority: priority.slice(0, 8),
  };
}

function cleanText(value: unknown, maxLength = 160): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanSlug(value: unknown): string {
  return cleanText(value, 80)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function normalizeClientAdminPayload(raw: unknown) {
  const input = (raw || {}) as Record<string, unknown>;
  const displayName = cleanText(input.displayName, 120);
  const slug = cleanSlug(input.slug || displayName);
  const siteLabel = cleanText(input.siteLabel, 80);
  const siteUrl = cleanText(input.siteUrl, 240);

  return {
    slug,
    displayName,
    shortName: cleanText(input.shortName, 40) || displayName.slice(0, 24),
    installTitle: cleanText(input.installTitle, 80) || `${displayName || 'Client'} Support`,
    primaryContactName: cleanText(input.primaryContactName, 80),
    primaryContactEmail: cleanText(input.primaryContactEmail, 120),
    primaryContactPhone: cleanText(input.primaryContactPhone, 40),
    preferredContact: cleanText(input.preferredContact, 24) || 'any',
    themeColor: cleanText(input.themeColor, 16) || '#0f766e',
    emergencySmsEnabled: input.emergencySmsEnabled !== false,
    notes: cleanText(input.notes, 500),
    sites: siteLabel
      ? [
          {
            label: siteLabel,
            url: siteUrl,
            isDefault: true,
          },
        ]
      : [],
  };
}

// ─── Existing public routes (unchanged) ───
app.get('/', (c) => c.html(salesHtml));
app.get('/apply', (c) => c.html(applyHtml));
app.get('/join', (c) => c.html(applyHtml));
app.get('/wins', (c) => c.html(winsHtml));
app.get('/help', (c) => c.html(helpHtml));
app.get('/privacy', (c) => c.html(privacyHtml));
app.get('/terms', (c) => c.html(termsHtml));
app.get('/onboard', (c) => c.html(onboardHtml));
app.get('/sample-leads.csv', (c) => {
  const csv = `business_name,contact_name,phone,email,app_type,notes\nJoe's BBQ,Joe Smith,0412345678,joe@joebbq.com.au,Food Truck App,Met at markets, interested in online orders\nSarah's Boutique,Sarah Chen,,sarah@boutique.au,Online Store,Saw her on Instagram\n`;
  return c.text(csv, 200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="sample-leads.csv"' });
});

app.get('/manifest.webmanifest', (c) => c.json({
  name: 'Penny Wise I.T Sales',
  short_name: 'PWS',
  description: 'Penny Wise I.T sales portal — find leads, send quotes, close deals.',
  start_url: '/',
  display: 'standalone',
  background_color: '#0b0f1a',
  theme_color: '#4f8ef7',
  icons: [
    { src: 'https://pub-e9f06ab167a44125b75d7528e2271086.r2.dev/icon-dark.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    { src: 'https://pub-e9f06ab167a44125b75d7528e2271086.r2.dev/icon-dark.png', sizes: '192x192', type: 'image/png' },
  ],
}, 200, { 'Cache-Control': 'public, max-age=3600' }));

app.get('/health', (c) => c.json({ status: 'ok', app: 'pennywiseit-sales', version: '2.0.0' }));

// ─── Admin auth middleware ───
// Promotes ?token= (first hop) into a httpOnly cookie + strips from URL.
// On any path under /admin (including /admin itself), unauthenticated
// requests get a 302 to the showcase login page.
app.use('/admin', adminAuth);
app.use('/admin/*', adminAuth);

async function adminAuth(c: any, next: () => Promise<void>): Promise<Response | void> {
  const url = new URL(c.req.url);
  const queryToken = url.searchParams.get('token');
  const cookieToken = getCookie(c, COOKIE_NAME);
  const token = (queryToken || cookieToken || '').trim();

  const session = await verifyAdminToken(c.env.DB, token);
  if (!session) {
    return c.redirect(LOGIN_URL, 302);
  }

  if (queryToken) {
    setCookie(c, COOKIE_NAME, queryToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    url.searchParams.delete('token');
    const clean = url.pathname + (url.search ? url.search : '') + url.hash;
    return c.redirect(clean || '/admin', 302);
  }

  c.set('session', session);
  await next();
}

// ─── Admin pages ───
app.get('/admin', (c) => c.html(adminHtml));
app.get('/admin/apps', (c) => c.html(adminAppsHtml));
app.get('/admin/leads', (c) => c.html(adminLeadsHtml));
app.get('/admin/team', (c) => c.html(adminTeamHtml));
app.get('/admin/support', (c) => c.html(adminSupportHtml));

// ─── Admin API (D1-direct reads) ───
app.get('/admin/api/me', (c) => {
  const s = c.get('session');
  return c.json({ name: s.name, role: s.role, salesperson_id: s.salesperson_id });
});

app.get('/admin/api/apps', async (c) => {
  const result = await c.env.DB.prepare(
    `SELECT * FROM apps WHERE status = 'active' ORDER BY name`
  ).all();
  return c.json({ apps: result.results || [] });
});

app.get('/admin/api/leads', async (c) => {
  const result = await c.env.DB.prepare(
    `SELECT l.*, sp.name AS salesperson_name
     FROM leads l
     LEFT JOIN salespeople sp ON sp.id = l.salesperson_id
     ORDER BY l.updated_at DESC
     LIMIT 500`
  ).all();
  return c.json({ leads: result.results || [] });
});

app.get('/admin/api/team', async (c) => {
  const result = await c.env.DB.prepare(
    `SELECT sp.id, sp.name, sp.email, sp.username, sp.role, sp.active,
            sp.commission_pct, sp.monthly_comm_pct, sp.created_at,
            COUNT(l.id) AS lead_count,
            SUM(CASE WHEN l.stage = 'won' THEN 1 ELSE 0 END) AS won_count,
            COALESCE(SUM(CASE WHEN l.stage = 'won' THEN l.setup_value ELSE 0 END), 0) AS won_value
     FROM salespeople sp
     LEFT JOIN leads l ON l.salesperson_id = sp.id
     GROUP BY sp.id
     ORDER BY sp.role DESC, sp.name`
  ).all();
  return c.json({ team: result.results || [] });
});

app.get('/admin/api/runs', async (c) => {
  const result = await c.env.DB.prepare(
    `SELECT vr.*, a.name AS app_name, a.brand_name, a.brand_color, a.domain
     FROM validation_runs vr
     JOIN apps a ON a.id = vr.app_id
     ORDER BY vr.created_at DESC
     LIMIT 50`
  ).all();
  return c.json({ runs: result.results || [] });
});

// Bug Squasher support bridge. The admin token stays server-side and only
// named support actions are exposed to the owner console.
app.get('/admin/api/support/config', (c) => {
  const config = readSupportConfig(c);
  return c.json({
    configured: Boolean(config),
    portalBaseUrl: config?.portalBaseUrl || DEFAULT_SUPPORT_PORTAL_BASE_URL,
    apiUrl: config?.apiUrl || DEFAULT_SUPPORT_API_URL,
  });
});

app.get('/admin/api/support/readiness', async (c) => {
  const result = await callSupportApi(c, '/readiness');
  if (!result.ok) return result.response;
  return c.json(result.data, result.status);
});

app.get('/admin/api/support/summary', async (c) => {
  const [issuesResult, clientsResult] = await Promise.all([
    callSupportApi<{ issues?: SupportIssue[] }>(c, '/issues'),
    callSupportApi<{ clients?: SupportClient[] }>(c, '/clients'),
  ]);

  if (!issuesResult.ok) return issuesResult.response;
  if (!clientsResult.ok) return clientsResult.response;

  const issues = Array.isArray(issuesResult.data.issues) ? issuesResult.data.issues : [];
  const clients = Array.isArray(clientsResult.data.clients) ? clientsResult.data.clients : [];
  const config = readSupportConfig(c);

  return c.json({
    ...summarizeSupport(issues, clients),
    portalBaseUrl: config?.portalBaseUrl || DEFAULT_SUPPORT_PORTAL_BASE_URL,
  });
});

app.get('/admin/api/support/issues', async (c) => {
  const clientSlug = cleanSlug(c.req.query('client'));
  const path = clientSlug ? `/issues?client=${encodeURIComponent(clientSlug)}` : '/issues';
  const result = await callSupportApi(c, path);
  if (!result.ok) return result.response;
  return c.json(result.data, result.status);
});

app.patch('/admin/api/support/issues/:id', async (c) => {
  const id = cleanText(c.req.param('id'), 120);
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const status = cleanText(body.status, 40);
  if (!SUPPORT_STATUSES.includes(status as SupportStatus)) {
    return c.json({ error: 'invalid_status', allowed: SUPPORT_STATUSES }, 400);
  }

  const result = await callSupportApi(c, `/issues/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      note: cleanText(body.note, 300),
    }),
  });
  if (!result.ok) return result.response;
  return c.json(result.data, result.status);
});

app.get('/admin/api/support/clients', async (c) => {
  const result = await callSupportApi(c, '/clients');
  if (!result.ok) return result.response;
  return c.json(result.data, result.status);
});

app.post('/admin/api/support/clients', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const payload = normalizeClientAdminPayload(body);
  if (!payload.slug || !payload.displayName) {
    return c.json({ error: 'invalid_client', details: ['displayName is required'] }, 400);
  }

  const result = await callSupportApi(c, '/clients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!result.ok) return result.response;
  return c.json(result.data, result.status);
});

// Validation triggers are currently 503 until validator deploy unblocks.
const VALIDATOR_DEPLOY_BLOCKED = {
  error:
    'Validation runs require the validator deploy update. Re-run wrangler deploy on packages/validator with an API token that has Workers KV: Edit perms to unblock.',
};
app.post('/admin/api/validate/:id', (c) => c.json(VALIDATOR_DEPLOY_BLOCKED, 503));
app.post('/admin/api/validate-all', (c) => c.json(VALIDATOR_DEPLOY_BLOCKED, 503));

// Logout — clears the cookie + bounces to /admin/login on the showcase.
app.get('/admin/logout', (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/' });
  return c.redirect(LOGIN_URL, 302);
});

export default { fetch: app.fetch };
