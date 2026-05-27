-- DeliverView D1 Schema
-- Async screen-recording handover platform for Penny Wise I.T.

-- Staff (synced from Clerk webhooks)
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'staff',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Client contacts
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL REFERENCES staff(id),
  company_name TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_clients_staff ON clients(staff_id);

-- Individual recorded clips
CREATE TABLE IF NOT EXISTS clips (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL REFERENCES staff(id),
  title TEXT NOT NULL,
  description TEXT,
  r2_key TEXT NOT NULL,
  thumbnail_r2_key TEXT,
  duration_seconds REAL,
  file_size_bytes INTEGER,
  mime_type TEXT DEFAULT 'video/webm',
  status TEXT DEFAULT 'ready',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_clips_staff ON clips(staff_id);

-- Handover packages (ordered collection of clips)
CREATE TABLE IF NOT EXISTS handovers (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL REFERENCES staff(id),
  client_id TEXT NOT NULL REFERENCES clients(id),
  title TEXT NOT NULL,
  description TEXT,
  ai_summary TEXT,
  status TEXT DEFAULT 'draft',
  magic_token TEXT UNIQUE NOT NULL,
  sent_at TEXT,
  viewed_at TEXT,
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_handovers_staff ON handovers(staff_id);
CREATE INDEX IF NOT EXISTS idx_handovers_client ON handovers(client_id);
CREATE INDEX IF NOT EXISTS idx_handovers_token ON handovers(magic_token);

-- Clips within a handover (ordered)
CREATE TABLE IF NOT EXISTS handover_clips (
  id TEXT PRIMARY KEY,
  handover_id TEXT NOT NULL REFERENCES handovers(id) ON DELETE CASCADE,
  clip_id TEXT NOT NULL REFERENCES clips(id),
  position INTEGER NOT NULL,
  chapter_title TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_handover_clips_handover ON handover_clips(handover_id);

-- Legal acknowledgment record (immutable audit log)
CREATE TABLE IF NOT EXISTS acknowledgments (
  id TEXT PRIMARY KEY,
  handover_id TEXT NOT NULL REFERENCES handovers(id),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  signature_data TEXT,
  signature_r2_key TEXT,
  acknowledged_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ack_handover ON acknowledgments(handover_id);

-- Email delivery tracking
CREATE TABLE IF NOT EXISTS email_log (
  id TEXT PRIMARY KEY,
  handover_id TEXT NOT NULL REFERENCES handovers(id),
  resend_id TEXT,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  template TEXT,
  status TEXT DEFAULT 'sent',
  sent_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_email_handover ON email_log(handover_id);

-- Reminder tracking
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  handover_id TEXT NOT NULL REFERENCES handovers(id),
  reminder_number INTEGER NOT NULL,
  sent_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reminders_handover ON reminders(handover_id);
