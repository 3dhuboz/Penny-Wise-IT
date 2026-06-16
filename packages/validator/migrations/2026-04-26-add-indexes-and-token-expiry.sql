-- Migration: add hot-path indexes + customer client_token sliding expiry column.
-- Apply with:
--   npx wrangler d1 execute composer-db --remote --file=migrations/2026-04-26-add-indexes-and-token-expiry.sql
-- Safe to re-run: all statements use IF NOT EXISTS or guarded ALTER patterns.

-- Hot-path indexes (from data-architecture audit)
CREATE INDEX IF NOT EXISTS idx_invoices_customer_type ON invoices(customer_id, type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_customer_stage ON projects(customer_id, stage);
CREATE INDEX IF NOT EXISTS idx_customer_events_customer_created ON customer_events(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auto_scan_leads_rep_created ON auto_scan_leads(salesperson_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_stage_created ON leads(stage, created_at DESC);

-- Sliding 90-day expiry for customer magic-link tokens (security hardening).
-- NULL means legacy / never-touched — treated as valid on first use, then bumped.
-- D1 / SQLite ALTER TABLE ADD COLUMN is idempotent-unsafe, so this will fail
-- if the column already exists. Run once, then comment out:
ALTER TABLE customers ADD COLUMN client_token_expires_at TEXT;
