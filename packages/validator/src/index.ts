import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env, AppConfig, TEMPLATE_TABLES, resolveExpectedTables } from './types';
import { runValidation, saveValidationRun } from './runner';
import { renderDashboard } from './ui/dashboard';

const app = new Hono<{ Bindings: Env }>();

// Load per-app secrets from D1
async function loadAppSecrets(db: D1Database, appId: string): Promise<Record<string, string>> {
  const rows = await db.prepare(
    `SELECT secret_name, secret_value FROM app_secrets WHERE app_id = ?`
  ).bind(appId).all();
  const secrets: Record<string, string> = {};
  for (const row of rows.results || []) {
    secrets[row.secret_name as string] = row.secret_value as string;
  }
  return secrets;
}

// Build AppConfig from DB row + secrets
function buildAppConfig(appRow: Record<string, unknown>, secrets: Record<string, string>): AppConfig {
  return {
    id: appRow.id as string,
    name: appRow.name as string,
    template: appRow.template as string,
    domain: appRow.domain as string,
    worker_name: appRow.worker_name as string,
    brand_name: appRow.brand_name as string,
    brand_color: appRow.brand_color as string,
    clerk_enabled: !!appRow.clerk_enabled,
    clerk_secret_key: secrets.clerk_secret_key,
    payment_provider: appRow.payment_provider as any,
    payment_key: secrets.stripe_secret_key || secrets.square_access_token || secrets.paypal_client_id,
    payment_secret: secrets.paypal_client_secret,
    resend_enabled: !!appRow.resend_enabled,
    resend_api_key: secrets.resend_api_key,
    resend_from_email: appRow.resend_from_email as string,
    sms_enabled: !!appRow.sms_enabled,
    d1_database_id: appRow.d1_database_id as string,
    r2_bucket_name: appRow.r2_bucket_name as string,
    features: JSON.parse((appRow.features as string) || '[]'),
    expected_tables: resolveExpectedTables(appRow.template as string, JSON.parse((appRow.features as string) || '[]')),
  };
}

// CORS for the dashboard
app.use('*', cors());

// Simple auth middleware — protects all routes
app.use('/api/*', async (c, next) => {
  const auth = c.req.header('Authorization');
  const secret = c.env.VALIDATOR_SECRET;
  if (!auth || auth !== `Bearer ${secret}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});

// ============ DASHBOARD ============

app.get('/', async (c) => {
  // Serve the validation dashboard (no auth required for viewing — auth on API calls)
  const apps = await c.env.DB.prepare(
    `SELECT * FROM apps WHERE status = 'active' ORDER BY name`
  ).all();

  const recentRuns = await c.env.DB.prepare(
    `SELECT vr.*, a.name as app_name, a.brand_name, a.brand_color, a.domain
     FROM validation_runs vr
     JOIN apps a ON a.id = vr.app_id
     ORDER BY vr.created_at DESC
     LIMIT 50`
  ).all();

  return c.html(renderDashboard(apps.results || [], recentRuns.results || []));
});

// ============ APP REGISTRY ============

// List all registered apps
app.get('/api/apps', async (c) => {
  const apps = await c.env.DB.prepare(
    `SELECT * FROM apps WHERE status = 'active' ORDER BY name`
  ).all();
  return c.json({ apps: apps.results });
});

// Register a new app
app.post('/api/apps', async (c) => {
  const body = await c.req.json();
  const {
    id, name, template, domain, worker_name, brand_name,
    brand_color, clerk_enabled, payment_provider,
    resend_enabled, resend_from_email, sms_enabled,
    d1_database_id, r2_bucket_name, features,
  } = body;

  if (!id || !name || !template || !worker_name || !brand_name) {
    return c.json({ error: 'Missing required fields: id, name, template, worker_name, brand_name' }, 400);
  }

  await c.env.DB.prepare(
    `INSERT INTO apps (id, name, template, domain, worker_name, brand_name, brand_color,
      clerk_enabled, payment_provider, resend_enabled, resend_from_email,
      sms_enabled, d1_database_id, r2_bucket_name, features)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, name, template, domain || null, worker_name, brand_name,
    brand_color || '#7c3aed', clerk_enabled ? 1 : 0, payment_provider || null,
    resend_enabled ? 1 : 0, resend_from_email || null,
    sms_enabled ? 1 : 0, d1_database_id || null, r2_bucket_name || null,
    JSON.stringify(features || [])
  ).run();

  return c.json({ success: true, id });
});

// Update an app
app.put('/api/apps/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const fields: string[] = [];
  const values: any[] = [];

  for (const [key, val] of Object.entries(body)) {
    if (key === 'id') continue;
    if (key === 'features') {
      fields.push(`${key} = ?`);
      values.push(JSON.stringify(val));
    } else if (typeof val === 'boolean') {
      fields.push(`${key} = ?`);
      values.push(val ? 1 : 0);
    } else {
      fields.push(`${key} = ?`);
      values.push(val);
    }
  }

  fields.push(`updated_at = datetime('now')`);
  values.push(id);

  await c.env.DB.prepare(`UPDATE apps SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

// Delete an app
app.delete('/api/apps/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare(`UPDATE apps SET status = 'archived' WHERE id = ?`).bind(id).run();
  return c.json({ success: true });
});

// ============ SECRETS MANAGEMENT ============

// List secrets for an app (names only, not values)
app.get('/api/apps/:id/secrets', async (c) => {
  const id = c.req.param('id');
  const rows = await c.env.DB.prepare(
    `SELECT secret_name, created_at, updated_at FROM app_secrets WHERE app_id = ?`
  ).bind(id).all();
  return c.json({ secrets: rows.results });
});

// Set a secret for an app (upsert)
app.put('/api/apps/:id/secrets', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { secret_name, secret_value } = body;

  if (!secret_name || !secret_value) {
    return c.json({ error: 'secret_name and secret_value are required' }, 400);
  }

  const validNames = [
    'clerk_secret_key', 'resend_api_key',
    'stripe_secret_key', 'square_access_token',
    'paypal_client_id', 'paypal_client_secret',
  ];
  if (!validNames.includes(secret_name)) {
    return c.json({ error: `Invalid secret_name. Must be one of: ${validNames.join(', ')}` }, 400);
  }

  await c.env.DB.prepare(
    `INSERT INTO app_secrets (app_id, secret_name, secret_value)
     VALUES (?, ?, ?)
     ON CONFLICT(app_id, secret_name)
     DO UPDATE SET secret_value = excluded.secret_value, updated_at = datetime('now')`
  ).bind(id, secret_name, secret_value).run();

  return c.json({ success: true, app_id: id, secret_name });
});

// Bulk set secrets for an app
app.post('/api/apps/:id/secrets/bulk', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { secrets } = body; // { clerk_secret_key: "sk_...", resend_api_key: "re_..." }

  if (!secrets || typeof secrets !== 'object') {
    return c.json({ error: 'Provide a "secrets" object with key-value pairs' }, 400);
  }

  const stmt = c.env.DB.prepare(
    `INSERT INTO app_secrets (app_id, secret_name, secret_value)
     VALUES (?, ?, ?)
     ON CONFLICT(app_id, secret_name)
     DO UPDATE SET secret_value = excluded.secret_value, updated_at = datetime('now')`
  );

  const batch = Object.entries(secrets).map(([name, value]) =>
    stmt.bind(id, name, value as string)
  );

  if (batch.length > 0) {
    await c.env.DB.batch(batch);
  }

  return c.json({ success: true, app_id: id, count: batch.length });
});

// Delete a secret
app.delete('/api/apps/:id/secrets/:secretName', async (c) => {
  const id = c.req.param('id');
  const secretName = c.req.param('secretName');
  await c.env.DB.prepare(
    `DELETE FROM app_secrets WHERE app_id = ? AND secret_name = ?`
  ).bind(id, secretName).run();
  return c.json({ success: true });
});

// ============ PROVISIONING ============

// Auto-provision: create D1 database + R2 bucket + save secrets for a new app
app.post('/api/provision', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { app_id, d1_name, r2_name, secrets } = body as {
    app_id?: string; d1_name?: string; r2_name?: string;
    secrets?: Record<string, string>;
  };

  if (!app_id) return c.json({ error: 'app_id is required' }, 400);

  const results: Record<string, unknown> = { app_id };
  const cfBase = `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_ACCOUNT_ID}`;
  const cfHeaders = {
    Authorization: `Bearer ${c.env.CF_API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  // Create D1 database
  if (d1_name && c.env.CF_ACCOUNT_ID && c.env.CF_API_TOKEN) {
    try {
      const res = await fetch(`${cfBase}/d1/database`, {
        method: 'POST', headers: cfHeaders,
        body: JSON.stringify({ name: d1_name }),
      });
      const data = await res.json() as { success: boolean; result?: { uuid: string; name: string }; errors?: { message: string }[] };
      if (data.success && data.result) {
        results.d1_database_id = data.result.uuid;
        results.d1_name = data.result.name;
        await c.env.DB.prepare('UPDATE apps SET d1_database_id = ? WHERE id = ?')
          .bind(data.result.uuid, app_id).run();
      } else {
        results.d1_error = data.errors?.[0]?.message ?? 'Failed to create D1 database';
      }
    } catch (e) {
      results.d1_error = (e as Error).message;
    }
  }

  // Create R2 bucket
  if (r2_name && c.env.CF_ACCOUNT_ID && c.env.CF_API_TOKEN) {
    try {
      const res = await fetch(`${cfBase}/r2/buckets`, {
        method: 'POST', headers: cfHeaders,
        body: JSON.stringify({ name: r2_name }),
      });
      const data = await res.json() as { success: boolean; errors?: { message: string }[] };
      if (data.success) {
        results.r2_bucket = r2_name;
      } else {
        results.r2_error = data.errors?.[0]?.message ?? 'Failed to create R2 bucket';
      }
    } catch (e) {
      results.r2_error = (e as Error).message;
    }
  }

  // Bulk-save secrets
  if (secrets && typeof secrets === 'object') {
    const entries = Object.entries(secrets).filter(([, v]) => v);
    if (entries.length > 0) {
      const stmt = c.env.DB.prepare(
        `INSERT INTO app_secrets (app_id, secret_name, secret_value) VALUES (?, ?, ?)
         ON CONFLICT(app_id, secret_name)
         DO UPDATE SET secret_value = excluded.secret_value, updated_at = datetime('now')`
      );
      await c.env.DB.batch(entries.map(([name, value]) => stmt.bind(app_id, name, value)));
      results.secrets_saved = entries.map(([k]) => k);
    }
  }

  return c.json({ success: true, ...results });
});

// Set secrets directly on a deployed Cloudflare Worker — replaces `wrangler secret put`
app.post('/api/worker-secrets', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { worker_name, secrets } = body as { worker_name?: string; secrets?: Record<string, string> };

  if (!worker_name) return c.json({ error: 'worker_name is required' }, 400);
  if (!secrets || typeof secrets !== 'object') return c.json({ error: 'secrets object is required' }, 400);
  if (!c.env.CF_ACCOUNT_ID || !c.env.CF_API_TOKEN) return c.json({ error: 'Cloudflare credentials not set on validator' }, 500);

  const results: Record<string, string> = {};
  const cfBase = `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_ACCOUNT_ID}/workers/scripts/${worker_name}/secrets`;

  for (const [name, value] of Object.entries(secrets)) {
    if (!value) continue;
    try {
      const res = await fetch(cfBase, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${c.env.CF_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text: value, type: 'secret_text' }),
      });
      const data = await res.json() as { success: boolean; errors?: { message: string }[] };
      results[name] = data.success ? 'ok' : (data.errors?.[0]?.message ?? 'failed');
    } catch (e) {
      results[name] = (e as Error).message;
    }
  }

  const failed = Object.entries(results).filter(([, v]) => v !== 'ok');
  return c.json({ success: failed.length === 0, results, failed: failed.map(([k]) => k) });
});

// Run SQL migrations against a D1 database via CF API — replaces `wrangler d1 execute`
app.post('/api/run-migrations', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { app_id, sql } = body as { app_id?: string; sql?: string };

  if (!app_id) return c.json({ error: 'app_id is required' }, 400);
  if (!sql) return c.json({ error: 'sql is required' }, 400);
  if (!c.env.CF_ACCOUNT_ID || !c.env.CF_API_TOKEN) return c.json({ error: 'Cloudflare credentials not set on validator' }, 500);

  const appRow = await c.env.DB.prepare(`SELECT d1_database_id FROM apps WHERE id = ?`).bind(app_id).first();
  if (!appRow?.d1_database_id) return c.json({ error: 'No D1 database_id on record for this app — run provision first' }, 400);

  // Split SQL into individual statements and execute each
  const statements = sql.split(';').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
  const errors: string[] = [];

  for (const statement of statements) {
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_ACCOUNT_ID}/d1/database/${appRow.d1_database_id}/query`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${c.env.CF_API_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ sql: statement }),
        }
      );
      const data = await res.json() as { success: boolean; errors?: { message: string }[] };
      if (!data.success) errors.push(data.errors?.[0]?.message ?? `Failed: ${statement.slice(0, 60)}`);
    } catch (e) {
      errors.push((e as Error).message);
    }
  }

  return c.json({ success: errors.length === 0, statements_run: statements.length, errors });
});

// ============ VALIDATION ============

// Run validation for a specific app
app.post('/api/validate/:appId', async (c) => {
  const appId = c.req.param('appId');
  const body = await c.req.json().catch(() => ({}));
  const sendTestEmail = body.send_test_email === true;

  // Get app config from registry
  const appRow = await c.env.DB.prepare(`SELECT * FROM apps WHERE id = ?`).bind(appId).first();
  if (!appRow) {
    return c.json({ error: `App "${appId}" not found` }, 404);
  }

  // Load stored secrets, allow request body overrides
  const storedSecrets = await loadAppSecrets(c.env.DB, appId);
  if (body.clerk_secret_key) storedSecrets.clerk_secret_key = body.clerk_secret_key;
  if (body.resend_api_key) storedSecrets.resend_api_key = body.resend_api_key;
  if (body.payment_key) {
    const provider = appRow.payment_provider as string;
    if (provider === 'stripe') storedSecrets.stripe_secret_key = body.payment_key;
    else if (provider === 'square') storedSecrets.square_access_token = body.payment_key;
    else if (provider === 'paypal') storedSecrets.paypal_client_id = body.payment_key;
  }
  if (body.payment_secret) storedSecrets.paypal_client_secret = body.payment_secret;

  const appConfig = buildAppConfig(appRow, storedSecrets);

  // Run validation
  const result = await runValidation(appConfig, c.env, { sendTestEmail });

  // Save results
  const saved = await saveValidationRun(
    c.env.DB, appId, 'manual', result.checks, result.duration_ms
  );

  return c.json({
    app_id: appId,
    app_name: appConfig.brand_name,
    status: saved.status,
    summary: {
      total: saved.total,
      passed: saved.passed,
      failed: saved.failed,
    },
    checks: result.checks,
    duration_ms: result.duration_ms,
  });
});

// Run validation for ALL apps
app.post('/api/validate-all', async (c) => {
  const apps = await c.env.DB.prepare(
    `SELECT * FROM apps WHERE status = 'active'`
  ).all();

  const results = [];
  for (const appRow of apps.results || []) {
    const secrets = await loadAppSecrets(c.env.DB, appRow.id as string);
    const appConfig = buildAppConfig(appRow, secrets);

    const result = await runValidation(appConfig, c.env);
    const saved = await saveValidationRun(
      c.env.DB, appRow.id as string, 'cron', result.checks, result.duration_ms
    );

    results.push({
      app_id: appRow.id,
      app_name: appConfig.brand_name,
      status: saved.status,
      passed: saved.passed,
      failed: saved.failed,
    });
  }

  return c.json({ results });
});

// Get validation history for an app
app.get('/api/validate/:appId/history', async (c) => {
  const appId = c.req.param('appId');
  const runs = await c.env.DB.prepare(
    `SELECT * FROM validation_runs WHERE app_id = ? ORDER BY created_at DESC LIMIT 20`
  ).bind(appId).all();

  return c.json({ runs: runs.results });
});

// Get details of a specific validation run
app.get('/api/validate/run/:runId', async (c) => {
  const runId = c.req.param('runId');
  const run = await c.env.DB.prepare(
    `SELECT vr.*, a.name as app_name, a.brand_name
     FROM validation_runs vr JOIN apps a ON a.id = vr.app_id
     WHERE vr.id = ?`
  ).bind(runId).first();

  const checks = await c.env.DB.prepare(
    `SELECT * FROM validation_checks WHERE run_id = ? ORDER BY id`
  ).bind(runId).all();

  return c.json({ run, checks: checks.results });
});

// ============ HEALTH ============

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', service: 'pennywiseit-validator', version: '0.1.0' });
});

// ============ SALESPERSON MANAGEMENT (owner-only, uses VALIDATOR_SECRET) ============

// List all salespeople
app.get('/api/salespeople', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, name, email, username, active, commission_pct, monthly_comm_pct, notes, created_at
     FROM salespeople ORDER BY name`
  ).all();
  return c.json({ salespeople: rows.results });
});

// Create salesperson
app.post('/api/salespeople', async (c) => {
  const body = await c.req.json();
  const { name, email, username, password, commission_pct, monthly_comm_pct, notes } = body;
  if (!name || !username || !password) {
    return c.json({ error: 'name, username, and password are required' }, 400);
  }

  const salt = crypto.randomUUID().replace(/-/g, '');
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password + salt));
  const password_hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  const id = crypto.randomUUID();

  try {
    await c.env.DB.prepare(
      `INSERT INTO salespeople (id, name, email, username, password_hash, password_salt, commission_pct, monthly_comm_pct, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, name, email || null, username, password_hash, salt,
      commission_pct ?? 15, monthly_comm_pct ?? 10, notes || null).run();
  } catch (e: any) {
    if (e.message?.includes('UNIQUE')) return c.json({ error: 'Username already taken' }, 409);
    throw e;
  }

  return c.json({ success: true, id, username });
});

// Update salesperson (reset password, toggle active, update commission)
app.put('/api/salespeople/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const updates: string[] = [];
  const values: any[] = [];

  if (body.name !== undefined) { updates.push('name = ?'); values.push(body.name); }
  if (body.email !== undefined) { updates.push('email = ?'); values.push(body.email); }
  if (body.active !== undefined) { updates.push('active = ?'); values.push(body.active ? 1 : 0); }
  if (body.commission_pct !== undefined) { updates.push('commission_pct = ?'); values.push(body.commission_pct); }
  if (body.monthly_comm_pct !== undefined) { updates.push('monthly_comm_pct = ?'); values.push(body.monthly_comm_pct); }
  if (body.notes !== undefined) { updates.push('notes = ?'); values.push(body.notes); }
  if (body.password) {
    const salt = crypto.randomUUID().replace(/-/g, '');
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(body.password + salt));
    const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    updates.push('password_hash = ?', 'password_salt = ?');
    values.push(hash, salt);
  }

  if (updates.length === 0) return c.json({ error: 'Nothing to update' }, 400);
  updates.push(`updated_at = datetime('now')`);
  values.push(id);

  await c.env.DB.prepare(`UPDATE salespeople SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

// Delete salesperson (soft delete)
app.delete('/api/salespeople/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare(`UPDATE salespeople SET active = 0 WHERE id = ?`).bind(id).run();
  return c.json({ success: true });
});

// Owner-level: view ALL leads across all salespeople
app.get('/api/leads', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT l.*, sp.name as salesperson_name, sp.username as salesperson_username,
            sp.commission_pct, sp.monthly_comm_pct
     FROM leads l JOIN salespeople sp ON sp.id = l.salesperson_id
     ORDER BY l.updated_at DESC`
  ).all();
  return c.json({ leads: rows.results });
});

// ============ SALESPERSON AUTH + LEAD ROUTES (separate from owner auth) ============
// These routes accept EITHER the owner secret OR a valid salesperson session token.

async function getSalespersonFromToken(db: D1Database, authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const session = await db.prepare(
    `SELECT s.salesperson_id, sp.name, sp.commission_pct, sp.monthly_comm_pct, sp.active
     FROM sales_sessions s JOIN salespeople sp ON sp.id = s.salesperson_id
     WHERE s.token = ? AND s.expires_at > datetime('now') AND sp.active = 1`
  ).bind(token).first();
  return session || null;
}

// Salesperson login — no owner auth required
app.post('/salesperson/auth', async (c) => {
  const body = await c.req.json();
  const { username, password } = body;
  if (!username || !password) return c.json({ error: 'username and password required' }, 400);

  const sp = await c.env.DB.prepare(
    `SELECT * FROM salespeople WHERE (username = ? OR email = ?) AND active = 1`
  ).bind(username, username).first();

  if (!sp) return c.json({ error: 'Invalid credentials' }, 401);

  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password + sp.password_salt));
  const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  if (hash !== sp.password_hash) return c.json({ error: 'Invalid credentials' }, 401);

  // Generate session token — expires in 30 days
  const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

  await c.env.DB.prepare(
    `INSERT INTO sales_sessions (token, salesperson_id, expires_at) VALUES (?, ?, ?)`
  ).bind(token, sp.id, expires).run();

  return c.json({
    token,
    salesperson: {
      id: sp.id, name: sp.name, username: sp.username,
      commission_pct: sp.commission_pct, monthly_comm_pct: sp.monthly_comm_pct,
      role: sp.role || 'salesperson',
    },
  });
});

// Get salesperson's own leads
app.get('/salesperson/leads', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);

  const rows = await c.env.DB.prepare(
    `SELECT * FROM leads WHERE salesperson_id = ? ORDER BY updated_at DESC`
  ).bind(sp.salesperson_id).all();
  return c.json({ leads: rows.results, salesperson: sp });
});

// Create a lead
app.post('/salesperson/leads', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json();
  const { business_name, contact_name, phone, email, industry, app_type,
          stage, setup_value, monthly_value, notes } = body;
  if (!business_name) return c.json({ error: 'business_name required' }, 400);

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO leads (id, salesperson_id, business_name, contact_name, phone, email,
      industry, app_type, stage, setup_value, monthly_value, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, sp.salesperson_id, business_name, contact_name || null, phone || null,
    email || null, industry || null, app_type || null,
    stage || 'new', setup_value || 0, monthly_value || 0, notes || null).run();

  return c.json({ success: true, id });
});

// Update a lead
app.put('/salesperson/leads/:id', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);

  const leadId = c.req.param('id');
  const lead = await c.env.DB.prepare(
    `SELECT id FROM leads WHERE id = ? AND salesperson_id = ?`
  ).bind(leadId, sp.salesperson_id).first();
  if (!lead) return c.json({ error: 'Lead not found' }, 404);

  const body = await c.req.json();
  const allowed = ['business_name','contact_name','phone','email','industry','app_type',
                   'stage','setup_value','monthly_value','notes','lost_reason'];
  const updates: string[] = [];
  const values: any[] = [];

  for (const key of allowed) {
    if (body[key] !== undefined) { updates.push(`${key} = ?`); values.push(body[key]); }
  }
  if (updates.length === 0) return c.json({ error: 'Nothing to update' }, 400);
  updates.push(`updated_at = datetime('now')`);
  values.push(leadId, sp.salesperson_id);

  await c.env.DB.prepare(
    `UPDATE leads SET ${updates.join(', ')} WHERE id = ? AND salesperson_id = ?`
  ).bind(...values).run();

  return c.json({ success: true });
});

// Delete a lead
app.delete('/salesperson/leads/:id', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);

  const leadId = c.req.param('id');
  await c.env.DB.prepare(
    `DELETE FROM leads WHERE id = ? AND salesperson_id = ?`
  ).bind(leadId, sp.salesperson_id).run();
  return c.json({ success: true });
});

// ============ LEAD FINDER ============

// Pain-point queries per app type — each generates a separate Google search
const LEAD_QUERIES: Record<string, { targets: string[]; painPhrases: string[] }> = {
  'food-truck':       { targets: ['food truck', 'street food', 'market stall', 'coffee van', 'pop-up food'], painPhrases: ['no online ordering', 'can I pre-order', 'do you take card', 'wish I could order ahead', 'queue is so long', 'how do I order'] },
  'online-store':     { targets: ['local shop', 'boutique', 'handmade', 'small business', 'market stall'], painPhrases: ['no website', 'DM to order', 'do you ship', 'cash only', 'how do I buy', 'do you have an online store'] },
  'tradie':           { targets: ['plumber', 'electrician', 'cleaner', 'landscaper', 'painter', 'builder', 'handyman'], painPhrases: ['online booking', 'free quote', 'anyone recommend', 'looking for a good', 'how do I book', 'need a quote'] },
  'festival':         { targets: ['market', 'festival', 'night market', 'community fair', 'food festival', 'expo'], painPhrases: ['no app', 'where is the map', 'whats on this weekend', 'schedule', 'vendor list', 'how do I find'] },
  'delivery':         { targets: ['courier', 'delivery', 'local delivery', 'flower delivery', 'bottle shop'], painPhrases: ['can I track', 'where is my order', 'delivery failed', 'no tracking', 'missed delivery', 'do you deliver'] },
  'desktop':          { targets: ['software', 'tool', 'spreadsheet', 'template', 'custom tool'], painPhrases: ['sells via email', 'no licensing', 'manual updates', 'people sharing my tool', 'activate software'] },
  'price-comparison': { targets: ['insurance', 'finance broker', 'solar', 'mortgage broker', 'internet plan'], painPhrases: ['compare quotes', 'best deal', 'how do I compare', 'which is better', 'quote comparison'] },
  'ai-social':        { targets: ['community', 'group', 'association', 'club', 'creator'], painPhrases: ['leave facebook', 'own platform', 'tired of facebook', 'better community', 'private group alternative'] },
};

// Salesperson OR owner can call this — accepts either session token or validator bearer
async function authLeadFinder(db: D1Database, authHeader: string | null, validatorSecret: string): Promise<boolean> {
  if (!authHeader) return false;
  if (authHeader === `Bearer ${validatorSecret}`) return true;
  const sp = await getSalespersonFromToken(db, authHeader);
  return !!sp;
}

app.get('/salesperson/find-leads', async (c) => {
  const isAuth = await authLeadFinder(c.env.DB, c.req.header('Authorization'), c.env.VALIDATOR_SECRET);
  if (!isAuth) return c.json({ error: 'Unauthorized' }, 401);

  const appId = c.req.query('appId') || '';
  const location = c.req.query('location') || 'Australia';
  const data = LEAD_QUERIES[appId];
  if (!data) return c.json({ error: 'Unknown app type' }, 400);

  const targets = data.targets.slice(0, 3).join(', ');
  const pains = data.painPhrases.slice(0, 3).join('; ');

  const locationSlug = location.replace(/\s+/g, '+');
  const prompt = `You are a sales lead generator for an Australian app development agency called PennyWiseIT.
Generate 6 realistic local business leads in "${location}" that would benefit from a custom app or website.
Business types to target: ${targets}
Common pain points: ${pains}

Generate TWO types of leads:
- 3 "hot" leads: businesses or people actively seeking a website/app developer (someone who has posted asking for help)
- 3 "maybe" leads: businesses that likely have NO website and would benefit from one

Return ONLY a JSON array (no markdown, no explanation) with exactly 6 objects:
[
  {
    "title": "Business name and type (e.g. Joe's Food Truck - Street Food)",
    "snippet": "One sentence: for hot leads describe what they posted/asked; for maybe leads describe why they likely have no website and what they're missing out on",
    "confidence": "hot",
    "link": "https://www.facebook.com/search/posts/?q=looking+for+website+developer+${locationSlug}"
  }
]

Rules:
- "hot" confidence: link must be a Facebook POSTS search — use query like "looking for website developer ${locationSlug}" or "need app developer ${locationSlug}" or "anyone recommend web design ${locationSlug}" (vary the phrasing, spaces as +)
- "maybe" confidence: link must be a Facebook PAGES search for the business type + suburb + location (spaces as +). Example: "https://www.facebook.com/search/pages/?q=food+truck+Newstead+${locationSlug}"
- Make business names, suburbs, and pain points realistic for ${location}, Australia. Vary the suburbs.`;

  try {
    const response: any = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
    });

    const text = (response.response || '').trim();
    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return c.json({ leads: [], total: 0, location, appId });

    const leads = JSON.parse(jsonMatch[0]);
    return c.json({ leads, total: leads.length, location, appId });
  } catch (e: any) {
    return c.json({ error: 'AI generation failed: ' + e?.message }, 500);
  }
});

// ============ LEAD SCANNER — searches Google for real social complaints ============

// Find BUSINESS OWNERS looking for websites, apps, developers, hosting — OUR customers
const SCAN_QUERIES: Record<string, { intentQueries: string[]; complaintQueries: string[] }> = {
  'all': {
    intentQueries: [
      'site:facebook.com "need a website" OR "who builds websites" OR "recommend web developer" {location}',
      'site:reddit.com "need a website built" OR "looking for web developer" OR "app developer" {location}',
      'site:facebook.com "need an app" OR "need online ordering" OR "need booking system" {location}',
      'site:reddit.com "how much does a website cost" OR "affordable website" small business Australia',
      'site:facebook.com "shopify too expensive" OR "need cheaper alternative" OR "wix frustrating" {location}',
    ],
    complaintQueries: [
      'site:reddit.com "my website sucks" OR "website is terrible" OR "need new website" Australia',
      'site:facebook.com "ripped off by web developer" OR "agency too expensive" OR "quoted $5000" {location}',
      'site:reddit.com "shopify fees" OR "wix limitations" OR "need simpler solution" small business',
    ],
  },
  'food-truck': {
    intentQueries: [
      'site:facebook.com OR site:reddit.com "food truck" "need a website" OR "need an app" OR "online ordering system"',
      'site:facebook.com OR site:reddit.com "food truck" OR "food van" "how do I take online orders"',
    ],
    complaintQueries: [
      'site:reddit.com "food truck" "taking orders by phone" OR "need better system" OR "spreadsheet"',
    ],
  },
  'online-store': {
    intentQueries: [
      'site:facebook.com OR site:reddit.com "need an online store" OR "want to sell online" OR "ecommerce" {location}',
      'site:facebook.com OR site:reddit.com "shopify alternative" OR "cheaper than shopify" OR "simple store" Australia',
    ],
    complaintQueries: [
      'site:reddit.com "shopify fees" OR "etsy fees" OR "wix limitations" small business Australia',
    ],
  },
  'tradie': {
    intentQueries: [
      'site:facebook.com OR site:reddit.com "need a website" tradie OR electrician OR plumber business {location}',
      'site:facebook.com OR site:reddit.com "job management" OR "quoting app" OR "tradie app" Australia',
    ],
    complaintQueries: [
      'site:reddit.com "no website" OR "losing customers" tradie OR tradesman business Australia',
    ],
  },
  'festival': {
    intentQueries: [
      'site:facebook.com OR site:reddit.com "need event app" OR "ticketing system" OR "event management" {location}',
    ],
    complaintQueries: [],
  },
  'delivery': {
    intentQueries: [
      'site:facebook.com OR site:reddit.com "need delivery app" OR "tracking system" OR "delivery management" {location}',
    ],
    complaintQueries: [],
  },
  'desktop': {
    intentQueries: [
      'site:reddit.com "sell my software" OR "licensing system" OR "distribute my app" indie developer',
    ],
    complaintQueries: [],
  },
  'price-comparison': {
    intentQueries: [
      'site:reddit.com "build comparison" OR "comparison tool" OR "comparison website" business',
    ],
    complaintQueries: [],
  },
  'ai-social': {
    intentQueries: [
      'site:reddit.com "build community platform" OR "own social network" OR "facebook groups alternative"',
    ],
    complaintQueries: [],
  },
};

let lastCseDebug = '';
async function googleCSE(query: string, cseId: string, cseKey: string): Promise<Array<{title:string;link:string;snippet:string;displayLink:string}>> {
  const url = new URL('https://www.googleapis.com/customsearch/v1');
  url.searchParams.set('key', cseKey);
  url.searchParams.set('cx', cseId);
  url.searchParams.set('q', query);
  url.searchParams.set('num', '5');
  url.searchParams.set('gl', 'au');
  const res = await fetch(url.toString());
  const data: any = await res.json();
  if (!res.ok) { lastCseDebug = `HTTP ${res.status}: ${JSON.stringify(data?.error?.message || data).slice(0,200)}`; return []; }
  lastCseDebug = `OK: ${data.searchInformation?.totalResults || 0} total, ${(data.items || []).length} returned`;
  return (data.items || []).map((item: any) => ({
    title: item.title || '',
    link: item.link || '',
    snippet: item.snippet || '',
    displayLink: item.displayLink || '',
  }));
}

function detectSource(url: string): string {
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('reddit.com')) return 'Reddit';
  if (url.includes('google.com/maps') || url.includes('maps.google')) return 'Google Reviews';
  if (url.includes('yellowpages.com.au')) return 'Yellow Pages';
  if (url.includes('productreview.com.au')) return 'Product Review';
  if (url.includes('truelocal.com.au')) return 'True Local';
  if (url.includes('gumtree.com.au')) return 'Gumtree';
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return 'Web'; }
}

const PRODUCT_NAMES: Record<string, string> = {
  'food-truck':'Food Truck App','online-store':'Online Store','tradie':'Tradie & Field Service',
  'festival':'Festival & Event App','delivery':'Delivery & Logistics','desktop':'Desktop + Licensing',
  'price-comparison':'Price Comparison App','ai-social':'AI Social Platform',
};

async function analyseLeadResults(ai: any, results: Array<{title:string;link:string;snippet:string;source:string}>, location: string) {
  if (!results.length) return [];
  // Pre-filter: reject obvious competitors before wasting AI tokens
  const competitorPhrases = ['i build', 'i help', 'i create', 'we build', 'we create', 'we design', 'i design', 'my services', 'our services', 'check our portfolio', 'contact me', 'send me a pm', 'dm me', 'message me', 'i specialize', 'we specialize', 'hire me', 'my agency', 'our agency', 'i offer', 'we offer', 'my team', 'our team can', 'i\'m building websites', 'building websites for', 'i make websites', 'we make websites', 'website builder for hire', 'web developer for hire', 'freelance web', 'freelance developer', 'i do web design', 'we do web design', 'affordable website for', 'i can build you', 'we can build you', 'i\'ll build you', 'we\'ll build you', 'take a unique approach', 'does your website pass', 'is your website costing you', 'are you losing clients', 'your website is losing', 'book a free', 'free consultation', 'free audit', 'free quote', 'get in touch today', 'visit our website', 'check out our', 'our work speaks', 'we\'ve helped', 'we have helped', 'let us help', 'let me help', 'we can help you', 'i can help you', 'looking for clients', 'accepting new clients', 'spots available', 'limited spots', 'book now', 'sign up today', 'launching soon', 'just launched', 'i\'m migara', 'i have over 10 years', 'i have over 5 years', 'years of experience in designing', 'years of experience in web', 'do you need a website for your business', 'does your business need', 'digital marketing services', 'marketing services for small', 'my biggest advantages', 'video ads for small', 'site in a day', 'workshop where', 'i\'ll guide you', 'guide you step by step', 'this is your sign', 'comment or message me', 'who builds websites for', 'from someone who builds', 'builds websites for local', 'call us on', 'call us today', 'visit web.', 'i run a small web', 'i run a web design', 'web design agency', 'my web design', 'our web design', 'let\'s chat', 'sets you up for growth', 'need a website that sets', '.com.au -', '1300 ', '1800 ', 'get a free', 'get your free'];
  // Also reject old posts
  const oldPostPatterns = /\b(\d+y)\b|\b(20[0-2][0-9])\b|\b(20[2][0-4])\b|\b\d+ years? ago\b/i;
  const filtered = results.filter(r => {
    const text = (r.title + ' ' + r.snippet).toLowerCase();
    // Reject competitors
    if (competitorPhrases.some(phrase => text.includes(phrase))) return false;
    // Reject old posts (8y, 2y, 2024, 2023, etc.)
    if (oldPostPatterns.test(r.snippet)) return false;
    return true;
  });
  if (!filtered.length) return [];
  const productList = Object.entries(PRODUCT_NAMES).map(([k,v]) => `${k}: ${v}`).join(', ');
  const resultBlock = filtered.map((r, i) => `[${i}] Source: ${r.source} | Title: ${r.title} | Snippet: ${r.snippet} | URL: ${r.link}`).join('\n');

  const prompt = `You qualify leads for PennyWiseIT, run by Steve — 30+ years as a software and app engineer. We build custom websites and apps for small businesses in Australia.

ONLY include results where a BUSINESS OWNER or PERSON is:
- Asking "who can build me a website/app?"
- Asking for web developer recommendations
- Complaining their website is bad or too expensive
- Saying they need online ordering, booking, or ecommerce
- Asking how much a website costs
- Frustrated with Shopify/Wix/agencies being too expensive

REJECT (not our customers):
- People looking for a plumber/electrician/food truck (they want the SERVICE, not a website)
- Business directory listings, news, blog posts, articles
- ANYONE OFFERING to build websites/apps — competitors, freelancers, agencies, workshops, courses. If the post says "I build" or "I can help" or "message me" or "DM me" or "send me a PM" — it's a COMPETITOR, reject it
- Job listings for developers
- Businesses that already have good websites
- Shopify/Wix/Squarespace tutorials
- Posts older than 1 month (look for "8y", "2y", "6mo", "2024", "2023" in snippet)

Results:
${resultBlock}

Return JSON array. If NONE qualify, return [].
[{"index":0,"businessName":"Name or null","matchedProduct":"online-store","confidence":"hot","painPoint":"what they specifically need","approachMessage":"write as Steve personally — casual Aussie tone, mention 30+ years experience, offer to show examples of similar projects, keep it short and genuine, NOT salesy","relevant":true}]

APPROACH MESSAGE RULES — write as if Steve is personally replying to their Facebook/Reddit post:
- Start with "Hey" or "Hi [name]" if name is visible
- Mention 30+ years experience briefly
- Include a LINK to a relevant live project Steve built (pick the most relevant one):
  * Food truck / ordering: streetmeatzbbq.com.au
  * Tradie / field service: wirezapp.au
  * Online store / retail: picklenick.au
  * Festival / events: gladstonebbqfest.au
  * Delivery / logistics: oconnoragriculture.com.au
  * SaaS / software: autohue.app
  * Social media platform: socialaistudio.au
  * General website: pennywiseit.com.au
- Keep it 2-3 sentences max, casual and genuine
- End with "Happy to have a chat" or "Can show you more if you're keen"
- Say "I" not "we"
- Never sound corporate

Example: "Hey! I've got 30+ years in software and app development — I build custom websites and apps for small businesses. Here's one I did recently for a food truck: streetmeatzbbq.com.au — happy to have a chat if you're interested!"

"hot" = actively looking for someone to build them something. "warm" = complaining about their current website/lack of one.

Be EXTREMELY strict on filtering. Return [] rather than bad leads.`;

  try {
    const response: any = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    });
    const text = (response.response || '').trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return results.map((r, i) => ({ ...r, index: i, businessName: null, matchedProduct: 'online-store', matchedProductName: 'Online Store', confidence: 'cold' as const, painPoint: '', approachMessage: '', relevant: true }));
    const analysed = JSON.parse(jsonMatch[0]);
    return analysed.filter((a: any) => a.relevant !== false).map((a: any) => ({
      ...results[a.index],
      businessName: a.businessName || null,
      matchedProduct: a.matchedProduct || 'online-store',
      matchedProductName: PRODUCT_NAMES[a.matchedProduct] || 'Online Store',
      confidence: a.confidence || 'cold',
      painPoint: a.painPoint || '',
      approachMessage: a.approachMessage || '',
    }));
  } catch {
    return results.map((r, i) => ({ ...r, index: i, businessName: null, matchedProduct: 'online-store', matchedProductName: 'Online Store', confidence: 'cold' as const, painPoint: r.snippet, approachMessage: '', relevant: true }));
  }
}

// Lead Scanner — scan endpoint
app.post('/salesperson/scan-leads', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json();
  const location = (body.location || '').trim();
  const appType = body.appType || '';
  const page = body.page || 0;
  if (!location) return c.json({ error: 'Location is required' }, 400);

  // Rate limit: 5 scans per day per salesperson
  const today = new Date().toISOString().slice(0, 10);
  const countRow = await c.env.DB.prepare(
    `SELECT COUNT(*) as cnt FROM lead_scans WHERE salesperson_id = ? AND created_at >= ?`
  ).bind(sp.salesperson_id, today + ' 00:00:00').first();
  const scansUsed = Number(countRow?.cnt || 0);
  if (scansUsed >= 20) return c.json({ error: 'Daily scan limit reached (20/day)', scansUsed: 20, scansLimit: 20 }, 429);

  // Determine which product types to scan — default to 'all' for general web/app leads
  const types = appType && SCAN_QUERIES[appType] ? [appType] : ['all'];
  const typeDetails = types.map(t => {
    const scanQ = SCAN_QUERIES[t];
    const pains = [...(scanQ.intentQueries || []).slice(0,1), ...(scanQ.complaintQueries || []).slice(0,1)].join('; ');
    return `${PRODUCT_NAMES[t]}: ${pains}`;
  }).join('\n');

  const serperKey = c.env.SERPER_API_KEY;
  if (!serperKey) return c.json({ error: 'Lead Scanner not configured. Contact admin.' }, 503);

  const targetType = types[0] || 'all';
  const sq = SCAN_QUERIES[targetType] || SCAN_QUERIES['all'];

  const allResults: Array<{title:string;link:string;snippet:string;source:string}> = [];
  const seen = new Set<string>();

  // ── SOURCE 1: Reddit Direct API (minutes-old posts) ──
  const redditKeywords = ['need a website', 'need an app', 'looking for web developer', 'need someone to build', 'looking for developer', 'website for my business', 'need an online store', 'recommend web designer', 'affordable website', 'shopify too expensive', 'wix frustrating', 'need a booking system', 'need online ordering', 'who can build me', 'web developer recommendations', 'app developer', 'need a developer', 'website quote', 'how much does a website cost', 'small business website'];
  const redditSubs = ['smallbusiness', 'webdev', 'Entrepreneur', 'startups', 'freelance', 'australia', 'brisbane', 'AusFinance', 'goldcoast', 'sydney', 'melbourne', 'perth', 'Adelaide'];
  const subStart = (page * 4) % redditSubs.length;
  const subSlice = redditSubs.slice(subStart, subStart + 4);

  for (const sub of subSlice) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/new.json?limit=50`, {
        headers: { 'User-Agent': 'PennyWiseIT-LeadScanner/1.0' },
      });
      if (!res.ok) continue;
      const data: any = await res.json();
      for (const child of (data?.data?.children || [])) {
        const post = child.data;
        if (!post?.title || !post?.permalink) continue;
        const text = (post.title + ' ' + (post.selftext || '')).toLowerCase();
        const matched = redditKeywords.some(kw => text.includes(kw));
        if (matched && !seen.has(post.permalink)) {
          seen.add(post.permalink);
          const ageHours = (Date.now() / 1000 - post.created_utc) / 3600;
          if (ageHours > 168) continue;
          const ageTxt = ageHours < 1 ? Math.round(ageHours * 60) + 'm ago' : ageHours < 24 ? Math.round(ageHours) + 'h ago' : Math.round(ageHours / 24) + 'd ago';
          allResults.push({
            title: `${post.title} [${ageTxt}]`,
            link: 'https://www.reddit.com' + post.permalink,
            snippet: (post.selftext || '').slice(0, 250),
            source: 'Reddit',
          });
        }
      }
    } catch { /* skip */ }
  }

  // ── SOURCE 2: Serper.dev — Facebook, Airtasker, Gumtree, Quora, LinkedIn ──
  const serperQueries = [
    // Facebook groups — people asking for web help
    `site:facebook.com/groups "need a website" OR "looking for web developer" OR "recommend web designer" ${location}`,
    // Airtasker — people PAYING for website builds (hottest leads)
    `site:airtasker.com.au "website" OR "web developer" OR "shopify" OR "online store" ${location}`,
    // Gumtree — Aussies looking for web developers
    `site:gumtree.com.au "website" OR "web developer" OR "web designer" ${location}`,
    // Quora — people asking about website costs
    `site:quora.com "need a website for my business" OR "how much does a website cost" OR "affordable web developer" Australia`,
  ];
  // Pick 2-3 queries based on page to rotate through sources
  const serperSlice = serperQueries.slice((page * 2) % serperQueries.length, (page * 2) % serperQueries.length + 3);

  for (const query of serperSlice) {
    try {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': serperKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, gl: 'au', num: 10, tbs: 'qdr:w' }),
      });
      if (!res.ok) continue;
      const data: any = await res.json();
      for (const item of (data.organic || [])) {
        if (!seen.has(item.link)) {
          seen.add(item.link);
          allResults.push({ title: item.title || '', link: item.link || '', snippet: item.snippet || '', source: detectSource(item.link) });
        }
      }
    } catch { /* skip */ }
  }

  // ── SOURCE 3: Hacker News (real-time, free API) ──
  try {
    const hnRes = await fetch('https://hn.algolia.com/api/v1/search_by_date?query=%22need+a+website%22+OR+%22looking+for+developer%22+OR+%22web+developer%22+OR+%22build+me+a+website%22&tags=ask_hn,show_hn,story&numericFilters=created_at_i>' + Math.floor(Date.now() / 1000 - 604800));
    if (hnRes.ok) {
      const hnData: any = await hnRes.json();
      for (const hit of (hnData.hits || []).slice(0, 5)) {
        const link = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
        if (!seen.has(link)) {
          seen.add(link);
          const ageHours = (Date.now() / 1000 - hit.created_at_i) / 3600;
          const ageTxt = ageHours < 1 ? Math.round(ageHours * 60) + 'm ago' : ageHours < 24 ? Math.round(ageHours) + 'h ago' : Math.round(ageHours / 24) + 'd ago';
          allResults.push({ title: `${hit.title} [${ageTxt}]`, link, snippet: hit.story_text?.slice(0, 200) || '', source: 'Hacker News' });
        }
      }
    }
  } catch { /* skip */ }

  // AI analyses ALL results
  const leads = await analyseLeadResults(c.env.AI, allResults.slice(0, 15), location);

  // Sort: hot > warm > cold
  const order = { hot: 0, warm: 1, cold: 2 };
  leads.sort((a: any, b: any) => (order[a.confidence as keyof typeof order] ?? 2) - (order[b.confidence as keyof typeof order] ?? 2));

  // Record scan
  const scanId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO lead_scans (id, salesperson_id, location, app_type, results_count) VALUES (?, ?, ?, ?, ?)`
  ).bind(scanId, sp.salesperson_id, location, appType || null, leads.length).run();

  return c.json({ leads, total: leads.length, location, appType, page, scanId, scansUsed: scansUsed + 1, scansLimit: 20 });
});

// Lead Scanner — status/quota check
app.get('/salesperson/scan-leads/status', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);

  const today = new Date().toISOString().slice(0, 10);
  const countRow = await c.env.DB.prepare(
    `SELECT COUNT(*) as cnt FROM lead_scans WHERE salesperson_id = ? AND created_at >= ?`
  ).bind(sp.salesperson_id, today + ' 00:00:00').first();

  const recentRows = await c.env.DB.prepare(
    `SELECT id, location, app_type, results_count, created_at FROM lead_scans
     WHERE salesperson_id = ? ORDER BY created_at DESC LIMIT 10`
  ).bind(sp.salesperson_id).all();

  return c.json({ scansUsed: Number(countRow?.cnt || 0), scansLimit: 20, recentScans: recentRows.results });
});

// Delete a scan
app.delete('/salesperson/scan-leads/:id', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);
  await c.env.DB.prepare(`DELETE FROM lead_scans WHERE id = ? AND salesperson_id = ?`).bind(c.req.param('id'), sp.salesperson_id).run();
  return c.json({ success: true });
});

// ============ AUTO-SCAN CONFIG ============

// Salesperson updates their auto-scan settings
app.put('/salesperson/scan-config', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);
  const body = await c.req.json();
  const updates: string[] = [];
  const values: any[] = [];
  if (body.scan_location !== undefined) { updates.push('scan_location = ?'); values.push(body.scan_location || null); }
  if (body.scan_app_type !== undefined) { updates.push('scan_app_type = ?'); values.push(body.scan_app_type || 'all'); }
  if (body.auto_scan !== undefined) { updates.push('auto_scan = ?'); values.push(body.auto_scan ? 1 : 0); }
  if (body.scan_email !== undefined) { updates.push('scan_email = ?'); values.push(body.scan_email || null); }
  if (!updates.length) return c.json({ error: 'Nothing to update' }, 400);
  values.push(sp.salesperson_id);
  await c.env.DB.prepare(`UPDATE salespeople SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

// Get auto-scan config
app.get('/salesperson/scan-config', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);
  const row = await c.env.DB.prepare(
    `SELECT scan_location, scan_app_type, auto_scan, scan_email FROM salespeople WHERE id = ?`
  ).bind(sp.salesperson_id).first();
  return c.json(row || {});
});

// Get unseen auto-scan leads
app.get('/salesperson/auto-leads', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);
  const rows = await c.env.DB.prepare(
    `SELECT * FROM auto_scan_leads WHERE salesperson_id = ? AND seen = 0 ORDER BY created_at DESC LIMIT 20`
  ).bind(sp.salesperson_id).all();
  return c.json({ leads: rows.results, total: rows.results?.length || 0 });
});

// Mark auto-scan leads as seen
app.post('/salesperson/auto-leads/seen', async (c) => {
  const sp = await getSalespersonFromToken(c.env.DB, c.req.header('Authorization'));
  if (!sp) return c.json({ error: 'Unauthorized' }, 401);
  await c.env.DB.prepare(
    `UPDATE auto_scan_leads SET seen = 1 WHERE salesperson_id = ? AND seen = 0`
  ).bind(sp.salesperson_id).run();
  return c.json({ success: true });
});

// ============ AUTO-SCAN RUNNER (called by cron) ============

async function runAutoScans(env: Env) {
  const serperKey = env.SERPER_API_KEY;
  if (!serperKey) return;

  // Get all salespeople with auto_scan enabled and a location set
  const reps = await env.DB.prepare(
    `SELECT id, name, scan_location, scan_app_type, scan_email, email FROM salespeople WHERE auto_scan = 1 AND scan_location IS NOT NULL AND active = 1`
  ).all();

  for (const rep of (reps.results || [])) {
    const location = rep.scan_location as string;
    const appType = (rep.scan_app_type as string) || 'all';
    const types = appType && SCAN_QUERIES[appType] ? [appType] : ['all'];
    const targetType = types[0] || 'all';
    const sq = SCAN_QUERIES[targetType] || SCAN_QUERIES['all'];
    const allQueries = [...(sq.intentQueries || []), ...(sq.complaintQueries || [])];

    // Pick a random query to vary daily results
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const query = allQueries[dayOfYear % allQueries.length]?.replace(/\{location\}/g, location);
    if (!query) continue;

    // Search
    const results: Array<{title:string;link:string;snippet:string;source:string}> = [];
    const seen = new Set<string>();
    try {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': serperKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, gl: 'au', num: 10, tbs: 'qdr:w' }), // past week only
      });
      if (!res.ok) continue;
      const data: any = await res.json();
      for (const item of (data.organic || [])) {
        if (!seen.has(item.link)) {
          seen.add(item.link);
          results.push({ title: item.title || '', link: item.link || '', snippet: item.snippet || '', source: detectSource(item.link) });
        }
      }
    } catch { continue; }

    if (!results.length) continue;

    // AI analysis
    const leads = await analyseLeadResults(env.AI, results.slice(0, 10), location);
    if (!leads.length) continue;

    // Check for duplicates — skip links already stored for this rep
    const existingLinks = await env.DB.prepare(
      `SELECT link FROM auto_scan_leads WHERE salesperson_id = ? AND created_at >= datetime('now', '-7 days')`
    ).bind(rep.id).all();
    const existingSet = new Set((existingLinks.results || []).map((r: any) => r.link));
    const newLeads = leads.filter((l: any) => !existingSet.has(l.link));
    if (!newLeads.length) continue;

    // Store new leads
    for (const lead of newLeads) {
      await env.DB.prepare(
        `INSERT INTO auto_scan_leads (id, salesperson_id, title, snippet, link, source, business_name, matched_product, confidence, pain_point, approach_message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        crypto.randomUUID(), rep.id, lead.title, lead.snippet, lead.link, lead.source,
        lead.businessName || null, lead.matchedProduct || null, lead.confidence || 'warm',
        lead.painPoint || '', lead.approachMessage || ''
      ).run();
    }

    // Send email notification
    const notifyEmail = (rep.scan_email || rep.email) as string;
    if (notifyEmail && env.RESEND_API_KEY) {
      const leadList = newLeads.map((l: any, i: number) =>
        `${i + 1}. ${l.title}\n   ${l.snippet}\n   Pain: ${l.painPoint}\n   Link: ${l.link}\n   Pitch: ${l.approachMessage}\n`
      ).join('\n');

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'PennyWiseIT Leads <leads@pennywiseit.com.au>',
            to: [notifyEmail],
            subject: `${newLeads.length} new lead${newLeads.length > 1 ? 's' : ''} found in ${location}`,
            text: `Hey ${rep.name},\n\nThe Lead Scanner found ${newLeads.length} new potential customer${newLeads.length > 1 ? 's' : ''} in ${location} looking for web/app services:\n\n${leadList}\nOpen your Sales Portal to follow up: https://sales.pennywiseit.com.au\n\n— PennyWiseIT Lead Scanner`,
          }),
        });
      } catch { /* email failed, leads still stored */ }
    }
  }
}

// ============ CRON HANDLER ============

export default {
  fetch: app.fetch,

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Run auto-scans for salespeople (daily lead finding)
    ctx.waitUntil(runAutoScans(env));

    // Run app health checks (existing)
    const apps = await env.DB.prepare(
      `SELECT * FROM apps WHERE status = 'active'`
    ).all();

    for (const appRow of apps.results || []) {
      const secrets = await loadAppSecrets(env.DB, appRow.id as string);
      const appConfig = buildAppConfig(appRow, secrets);

      const result = await runValidation(appConfig, env);
      await saveValidationRun(
        env.DB, appRow.id as string, 'cron', result.checks, result.duration_ms
      );
    }
  },
};
