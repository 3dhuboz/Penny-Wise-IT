-- Migration: email_failures observability table.
-- Apply with:
--   npx wrangler d1 execute composer-db --remote --file=migrations/2026-04-26-email-failures.sql

CREATE TABLE IF NOT EXISTS email_failures (
  id TEXT PRIMARY KEY,
  kind TEXT,
  to_addr TEXT,
  subject TEXT,
  status INTEGER,
  body_preview TEXT,
  error TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_email_failures_created ON email_failures(created_at DESC);
