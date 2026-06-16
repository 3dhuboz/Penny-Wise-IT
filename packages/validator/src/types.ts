// Core types for the PennyWiseIT Validator

export interface Env {
  DB: D1Database;
  AI: Ai; // Cloudflare Workers AI binding — used for Lead Finder
  DRAFTS_LOGOS?: R2Bucket; // R2 bucket for Pitch Studio prospect logos
  ARCHIVE?: R2Bucket; // R2 bucket for cold storage of old auto_scan_leads rows
  ANALYTICS?: AnalyticsEngineDataset; // Workers Analytics Engine \u2014 cron + request metrics
  RATE_LIMIT?: KVNamespace; // KV namespace for sliding-window rate limiting
  CF_ACCOUNT_ID: string;
  CF_API_TOKEN: string;
  RESEND_API_KEY?: string;
  VALIDATOR_SECRET: string; // protects the validator dashboard
  TEST_EMAIL_RECIPIENT?: string; // where test emails go (defaults to admin@cupcycle.au)
  GOOGLE_CSE_ID?: string; // Google Custom Search Engine ID — for Lead Scanner
  GOOGLE_CSE_KEY?: string; // Google Custom Search API key — for Lead Scanner
  SERPER_API_KEY?: string; // Serper.dev API key — for Lead Scanner (real Google results)
  PENNYWISEIT_ZONE_ID?: string; // Cloudflare zone ID for pennywiseit.com.au — used for Email Routing forwarding rules
  STRIPE_SECRET_KEY?: string; // Stripe secret key (sk_live_... or sk_test_...) — enables one-click invoice checkout
  STRIPE_WEBHOOK_SECRET?: string; // Stripe webhook signing secret (whsec_...) — verifies inbound payment events
  SENTRY_DSN?: string; // Sentry DSN \u2014 if set, unhandled errors are forwarded to Sentry
}

export interface CheckResult {
  check_name: string;
  category: 'health' | 'auth' | 'email' | 'payments' | 'database' | 'storage' | 'dns';
  status: 'pass' | 'fail' | 'skip' | 'warn';
  message: string;
  details?: string;
  duration_ms?: number;
}

export interface ValidationRun {
  app_id: string;
  triggered_by: 'manual' | 'deploy' | 'cron';
  checks: CheckResult[];
  total_duration_ms: number;
}

export interface AppConfig {
  id: string;
  name: string;
  template: string;
  domain: string;
  worker_name: string;
  brand_name: string;
  brand_color: string;

  // Stack
  clerk_enabled: boolean;
  clerk_secret_key?: string;
  payment_provider: 'stripe' | 'square' | 'paypal' | null;
  payment_key?: string;
  payment_secret?: string;
  resend_enabled: boolean;
  resend_api_key?: string;
  resend_from_email?: string;
  sms_enabled: boolean;
  d1_database_id?: string;
  r2_bucket_name?: string;

  // Features
  features: string[];

  // Expected DB tables based on features
  expected_tables?: string[];
}

// Template definitions — what tables each app type expects
export const TEMPLATE_TABLES: Record<string, string[]> = {
  'food-truck': [
    'users', 'tickets', 'ticket_types', 'raffle_entries', 'raffle_prizes',
    'schedule', 'alerts', 'pois', 'vendors', 'sms_logs',
  ],
  'simple-website': [
    'products', 'categories', 'orders', 'order_items', 'users',
    'posts', 'messages', 'app_settings',
  ],
  'autohue': [
    'customers', 'validations', 'payments', 'audit_log',
  ],
  'wirez': [
    'jobs', 'job_time_entries', 'job_materials', 'job_photos',
    'electricians', 'licenses', 'user_profiles', 'parts_catalog',
    'tech_stock', 'settings', 'tenants',
  ],
  'oconnor': [
    'users', 'customers', 'products', 'orders', 'delivery_days',
    'delivery_runs', 'stops', 'driver_sessions', 'stock_movements',
    'subscriptions', 'push_subscriptions', 'promo_codes', 'config',
  ],
  'festival': [
    'users', 'tickets', 'ticket_types', 'raffle_entries', 'raffle_prizes',
    'schedule', 'alerts', 'pois', 'vendors', 'sms_logs',
  ],
  'aussie-saver': [
    'users', 'fuel_prices', 'fuel_stations', 'vehicles', 'fill_ups', 'app_settings',
  ],
  'socialai': [
    'users', 'clients', 'posts', 'portal', 'pending_activations', 'pending_cancellations',
  ],
};

// Feature-based tables — what each composable feature contributes
export const FEATURE_TABLES: Record<string, string[]> = {
  'auth-clerk': ['users'],
  'auth-bearer': ['users', 'refresh_tokens'],
  'payments-stripe': ['payments', 'subscriptions'],
  'payments-paypal': ['payments', 'subscriptions'],
  'payments-square': ['payments'],
  'email-resend': ['email_log'],
  'sms-twilio': ['sms_log'],
  'ai-openrouter': ['ai_log'],
};

// Template-specific extra tables (added by the composition engine beyond features)
export const TEMPLATE_EXTRA_TABLES: Record<string, string[]> = {
  'simple-website': ['products', 'messages'],
  'food-truck': ['menu_items', 'orders', 'schedule', 'alerts'],
  'festival': ['events', 'tickets', 'vendors', 'pois', 'raffle_entries', 'schedule', 'alerts'],
  'wirez': ['customers', 'jobs', 'job_time_entries', 'job_materials', 'job_notes', 'invoices', 'invoice_items', 'staff', 'job_sequences', 'invoice_sequences'],
  'oconnor': ['customers', 'products', 'orders', 'order_items', 'delivery_runs', 'delivery_stops', 'subscriptions', 'driver_locations', 'push_subscriptions'],
  'autohue': ['products', 'licenses', 'activations', 'releases', 'download_log'],
  'aussie-saver': ['fuel_stations', 'fuel_prices', 'vehicles', 'fill_ups', 'app_settings'],
  'socialai': ['clients', 'posts', 'portal', 'pending_activations', 'pending_cancellations'],
};

// Resolve expected tables for an app — uses features if available, falls back to template
export function resolveExpectedTables(
  template: string,
  features: string[]
): string[] {
  // If app has explicit features, build table list from features + template extras
  if (features && features.length > 0) {
    const tables = new Set<string>();
    for (const feature of features) {
      const featureTables = FEATURE_TABLES[feature];
      if (featureTables) {
        featureTables.forEach((t) => tables.add(t));
      }
    }
    // Add template-specific tables
    const extraTables = TEMPLATE_EXTRA_TABLES[template];
    if (extraTables) {
      extraTables.forEach((t) => tables.add(t));
    }
    return Array.from(tables);
  }
  // Fall back to template defaults
  return TEMPLATE_TABLES[template] || [];
}
