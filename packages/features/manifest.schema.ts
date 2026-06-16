// Feature Manifest Schema — defines how composable features are declared
// Each feature is a self-contained module that can be mixed into any app

export interface FeatureManifest {
  id: string; // e.g. "auth-clerk", "payments-stripe", "ordering"
  name: string; // Human-friendly name
  version: string; // Semver
  category: FeatureCategory;
  description: string;

  // What this feature needs to function
  requires: {
    envVars: EnvVarRequirement[]; // Secrets/config this feature needs
    features: string[]; // Other feature IDs this depends on
    dbTables: TableDefinition[]; // D1 tables this feature needs
    bindings: BindingRequirement[]; // CF bindings (R2, KV, etc.)
  };

  // What this feature provides
  provides: {
    routes: RouteDefinition[]; // API endpoints added
    webhooks: WebhookDefinition[]; // Webhook handlers
    cronJobs: CronDefinition[]; // Scheduled tasks
    middleware: string[]; // Named middleware this feature exports
    dbTables: string[]; // Table names created by this feature
  };

  // Conflicts — features that can't coexist
  conflicts: string[]; // Feature IDs

  // Stack options — what integrations this feature supports
  stackOptions?: {
    auth?: ('clerk' | 'custom-jwt' | 'api-key')[];
    payments?: ('stripe' | 'square' | 'paypal')[];
    email?: ('resend')[];
    sms?: ('twilio')[];
    ai?: ('openrouter' | 'cloudflare-ai')[];
    storage?: ('r2' | 'aws-s3')[];
  };
}

export type FeatureCategory =
  | 'foundation' // Auth, payments, email, SMS — core infrastructure
  | 'commerce' // Ordering, products, cart, checkout
  | 'operations' // Jobs, inventory, delivery, scheduling
  | 'engagement' // Loyalty, raffle, push notifications, alerts
  | 'content' // AI generation, CMS, social publishing
  | 'analytics'; // Reporting, dashboards

export interface EnvVarRequirement {
  name: string; // e.g. "CLERK_SECRET_KEY"
  description: string;
  required: boolean;
  secret: boolean; // Should be stored as a worker secret, not plaintext
  example?: string;
}

export interface TableDefinition {
  name: string;
  sql: string; // CREATE TABLE statement
  indexes?: string[]; // CREATE INDEX statements
  seedData?: string; // Optional INSERT statements
}

export interface BindingRequirement {
  type: 'r2' | 'kv' | 'd1'; // Cloudflare resource type
  name: string; // Binding name in wrangler.toml
  description: string;
  optional: boolean;
}

export interface RouteDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string; // e.g. "/api/orders"
  description: string;
  auth: 'public' | 'authenticated' | 'admin';
  rateLimit?: number; // Requests per minute
}

export interface WebhookDefinition {
  path: string; // e.g. "/webhooks/stripe"
  provider: string; // e.g. "stripe", "paypal", "clerk"
  events: string[]; // e.g. ["checkout.session.completed"]
  description: string;
}

export interface CronDefinition {
  schedule: string; // Cron expression
  handler: string; // Function name
  description: string;
}
