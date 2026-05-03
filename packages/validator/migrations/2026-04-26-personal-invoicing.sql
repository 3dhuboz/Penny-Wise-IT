-- Migration: personal invoicing module (Phase A foundations + Phase B tables)
-- Apply with:
--   npx wrangler d1 execute composer-db --remote --file=migrations/2026-04-26-personal-invoicing.sql
-- All CREATE TABLE / INDEX statements use IF NOT EXISTS — safe to re-run.

CREATE TABLE IF NOT EXISTS personal_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  abn TEXT,
  billing_address TEXT,
  notes TEXT,
  linked_customer_id TEXT,
  magic_token TEXT UNIQUE,
  magic_token_expires_at TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_personal_clients_active ON personal_clients(active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_personal_clients_email ON personal_clients(email);
CREATE INDEX IF NOT EXISTS idx_personal_clients_token ON personal_clients(magic_token);

CREATE TABLE IF NOT EXISTS personal_invoices (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  seq INTEGER UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  subject TEXT,
  notes TEXT,
  total REAL NOT NULL DEFAULT 0,
  paid_amount REAL NOT NULL DEFAULT 0,
  payment_reference TEXT,
  issued_at TEXT,
  due_at TEXT,
  paid_at TEXT,
  paid_marked_by TEXT,
  cancelled_at TEXT,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_paid_at TEXT,
  recurring_id TEXT,
  source_quote_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_personal_invoices_client ON personal_invoices(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_personal_invoices_status ON personal_invoices(status, due_at);
CREATE INDEX IF NOT EXISTS idx_personal_invoices_stripe_session ON personal_invoices(stripe_session_id);

CREATE TABLE IF NOT EXISTS personal_invoice_items (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  description TEXT NOT NULL,
  qty REAL NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL DEFAULT 0,
  line_total REAL NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_personal_invoice_items_invoice ON personal_invoice_items(invoice_id, sort_order);

CREATE TABLE IF NOT EXISTS personal_quotes (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  quote_number TEXT UNIQUE NOT NULL,
  seq INTEGER UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  subject TEXT,
  notes TEXT,
  total REAL NOT NULL DEFAULT 0,
  issued_at TEXT,
  expires_at TEXT,
  accepted_at TEXT,
  accepted_by_name TEXT,
  accepted_by_ip TEXT,
  rejected_at TEXT,
  converted_invoice_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_personal_quotes_client ON personal_quotes(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_personal_quotes_status ON personal_quotes(status, created_at DESC);

CREATE TABLE IF NOT EXISTS personal_quote_items (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL,
  description TEXT NOT NULL,
  qty REAL NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL DEFAULT 0,
  line_total REAL NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_personal_quote_items_quote ON personal_quote_items(quote_id, sort_order);

CREATE TABLE IF NOT EXISTS personal_recurring (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'monthly',
  template_items_json TEXT NOT NULL,
  due_days INTEGER NOT NULL DEFAULT 14,
  next_issue_at TEXT NOT NULL,
  last_issued_at TEXT,
  paused INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_personal_recurring_active ON personal_recurring(paused, next_issue_at);
