-- PennyWiseIT Composer — App Registry & Validation Results
-- This is the central database for tracking all deployed apps and their health

-- App registry: every deployed customer app
CREATE TABLE IF NOT EXISTS apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  domain TEXT,
  worker_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',

  -- Branding
  brand_name TEXT NOT NULL,
  brand_color TEXT DEFAULT '#7c3aed',
  logo_url TEXT,

  -- Stack connections (what's configured)
  clerk_enabled INTEGER DEFAULT 0,
  clerk_instance_url TEXT,

  payment_provider TEXT, -- 'stripe', 'square', 'paypal', or null
  payment_configured INTEGER DEFAULT 0,

  resend_enabled INTEGER DEFAULT 0,
  resend_from_email TEXT,
  resend_domain_verified INTEGER DEFAULT 0,

  sms_enabled INTEGER DEFAULT 0,
  sms_provider TEXT, -- 'twilio' or null

  d1_database_id TEXT,
  r2_bucket_name TEXT,
  kv_namespace_id TEXT,

  -- Features enabled (JSON array of feature IDs)
  features TEXT DEFAULT '[]',

  -- Metadata
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  last_validated_at TEXT,
  validation_status TEXT DEFAULT 'unknown' -- 'passing', 'failing', 'unknown'
);

-- Validation runs: each time we test an app
CREATE TABLE IF NOT EXISTS validation_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_id TEXT NOT NULL REFERENCES apps(id),
  triggered_by TEXT DEFAULT 'manual', -- 'manual', 'deploy', 'cron'
  status TEXT NOT NULL, -- 'passing', 'failing', 'partial'
  total_checks INTEGER DEFAULT 0,
  passed_checks INTEGER DEFAULT 0,
  failed_checks INTEGER DEFAULT 0,
  duration_ms INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Individual check results within a validation run
CREATE TABLE IF NOT EXISTS validation_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL REFERENCES validation_runs(id),
  app_id TEXT NOT NULL REFERENCES apps(id),
  check_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'health', 'auth', 'email', 'payments', 'database', 'storage', 'dns'
  status TEXT NOT NULL, -- 'pass', 'fail', 'skip', 'warn'
  message TEXT,
  details TEXT, -- JSON with extra context
  duration_ms INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Feature registry: all available composable features
CREATE TABLE IF NOT EXISTS features (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',

  -- Requirements (JSON)
  required_env_vars TEXT DEFAULT '[]',
  required_features TEXT DEFAULT '[]',
  conflicts_with TEXT DEFAULT '[]',
  required_tables TEXT DEFAULT '[]',

  -- What it provides (JSON)
  provided_routes TEXT DEFAULT '[]',
  provided_webhooks TEXT DEFAULT '[]',

  created_at TEXT DEFAULT (datetime('now'))
);

-- Per-app secrets: API keys for Clerk, Resend, Stripe, etc.
CREATE TABLE IF NOT EXISTS app_secrets (
  app_id TEXT NOT NULL REFERENCES apps(id),
  secret_name TEXT NOT NULL, -- e.g. 'clerk_secret_key', 'resend_api_key', 'stripe_secret_key', 'paypal_client_id', 'paypal_client_secret', 'square_access_token'
  secret_value TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (app_id, secret_name)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_validation_runs_app ON validation_runs(app_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_validation_checks_run ON validation_checks(run_id);
CREATE INDEX IF NOT EXISTS idx_apps_status ON apps(status);

-- ============ SALES TEAM ============

-- Salesperson accounts (managed by owner from HUB)
CREATE TABLE IF NOT EXISTS salespeople (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  commission_pct REAL DEFAULT 15.0, -- % of setup fee per won deal
  monthly_comm_pct REAL DEFAULT 10.0, -- % of monthly fee for 12 months
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Session tokens for salesperson login
CREATE TABLE IF NOT EXISTS sales_sessions (
  token TEXT PRIMARY KEY,
  salesperson_id TEXT NOT NULL REFERENCES salespeople(id),
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Sales leads (each salesperson's pipeline)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  salesperson_id TEXT NOT NULL REFERENCES salespeople(id),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  industry TEXT,
  app_type TEXT,
  stage TEXT DEFAULT 'new', -- 'new', 'contacted', 'demo', 'proposal', 'won', 'lost'
  setup_value REAL DEFAULT 0,
  monthly_value REAL DEFAULT 0,
  notes TEXT,
  lost_reason TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_salesperson ON leads(salesperson_id, stage);
CREATE INDEX IF NOT EXISTS idx_sales_sessions_token ON sales_sessions(token, expires_at);
