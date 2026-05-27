export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
  MAGIC_TOKEN_SECRET: string;
  ENVIRONMENT: string;
  FRONTEND_URL: string;
  VIEWER_URL: string;
}

export interface AppVariables {
  userId: string;
  userEmail: string;
}

// DB row types
export interface Staff {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  staff_id: string;
  company_name: string | null;
  contact_name: string;
  contact_email: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Clip {
  id: string;
  staff_id: string;
  title: string;
  description: string | null;
  r2_key: string;
  thumbnail_r2_key: string | null;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  mime_type: string;
  status: string;
  created_at: string;
}

export interface Handover {
  id: string;
  staff_id: string;
  client_id: string;
  title: string;
  description: string | null;
  ai_summary: string | null;
  status: string;
  magic_token: string;
  sent_at: string | null;
  viewed_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HandoverClip {
  id: string;
  handover_id: string;
  clip_id: string;
  position: number;
  chapter_title: string | null;
  created_at: string;
}

export interface Acknowledgment {
  id: string;
  handover_id: string;
  client_name: string;
  client_email: string;
  ip_address: string;
  user_agent: string;
  consent_text: string;
  signature_data: string | null;
  signature_r2_key: string | null;
  acknowledged_at: string;
}

export interface EmailLog {
  id: string;
  handover_id: string;
  resend_id: string | null;
  recipient_email: string;
  subject: string | null;
  template: string | null;
  status: string;
  sent_at: string;
}

export interface Reminder {
  id: string;
  handover_id: string;
  reminder_number: number;
  sent_at: string;
}
