#!/usr/bin/env tsx
// PennyWiseIT App Composer — generates a complete worker from feature manifests
// Usage: npx tsx compose.ts --config app-config.json --output ./dist

import * as fs from 'fs';
import * as path from 'path';

// ============ TYPES ============

interface AppComposition {
  id: string;
  name: string;
  domain: string;
  template: string; // Base template for shared patterns
  branding: {
    name: string;
    color: string;
    logo_url?: string;
  };
  features: string[]; // Feature IDs to include
  env: Record<string, string>; // Non-secret config
  secrets: string[]; // Secret names that need wrangler secret put
}

interface FeatureManifest {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  requires: {
    envVars: { name: string; description: string; required: boolean; secret: boolean; example?: string }[];
    features: string[];
    dbTables: { name: string; sql: string; indexes?: string[]; seedData?: string }[];
    bindings: { type: string; name: string; description: string; optional: boolean }[];
  };
  provides: {
    routes: { method: string; path: string; description: string; auth: string }[];
    webhooks: { path: string; provider: string; events: string[]; description: string }[];
    cronJobs: { schedule: string; handler: string; description: string }[];
    middleware: string[];
    dbTables: string[];
  };
  conflicts: string[];
}

// ============ MANIFEST LOADER ============

function loadManifest(featureDir: string): FeatureManifest {
  const manifestPath = path.join(featureDir, 'manifest.json');
  return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}

function findFeatureDir(featureId: string, featuresRoot: string): string | null {
  // Search through category subdirectories
  const categories = ['foundation', 'commerce', 'operations', 'engagement', 'content', 'analytics'];
  for (const cat of categories) {
    const dir = path.join(featuresRoot, cat, featureId);
    if (fs.existsSync(path.join(dir, 'manifest.json'))) {
      return dir;
    }
  }
  // Also check flat structure
  const flatDir = path.join(featuresRoot, featureId);
  if (fs.existsSync(path.join(flatDir, 'manifest.json'))) {
    return flatDir;
  }
  return null;
}

// ============ DEPENDENCY RESOLUTION ============

function resolveDependencies(
  featureIds: string[],
  featuresRoot: string
): { ordered: FeatureManifest[]; errors: string[] } {
  const manifests = new Map<string, FeatureManifest>();
  const errors: string[] = [];

  // Load all requested features and their dependencies
  const toProcess = [...featureIds];
  const processed = new Set<string>();

  while (toProcess.length > 0) {
    const id = toProcess.shift()!;
    if (processed.has(id)) continue;
    processed.add(id);

    const dir = findFeatureDir(id, featuresRoot);
    if (!dir) {
      errors.push(`Feature "${id}" not found`);
      continue;
    }

    const manifest = loadManifest(dir);
    manifests.set(id, manifest);

    // Add dependencies
    for (const dep of manifest.requires.features) {
      if (!processed.has(dep)) {
        toProcess.push(dep);
      }
    }
  }

  // Check for conflicts
  const allIds = [...manifests.keys()];
  for (const [id, manifest] of manifests) {
    for (const conflict of manifest.conflicts) {
      if (allIds.includes(conflict)) {
        errors.push(`Feature "${id}" conflicts with "${conflict}"`);
      }
    }
  }

  // Topological sort — dependencies first
  const sorted: FeatureManifest[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(id: string) {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      errors.push(`Circular dependency detected involving "${id}"`);
      return;
    }
    visiting.add(id);
    const manifest = manifests.get(id);
    if (manifest) {
      for (const dep of manifest.requires.features) {
        visit(dep);
      }
      sorted.push(manifest);
    }
    visiting.delete(id);
    visited.add(id);
  }

  for (const id of manifests.keys()) {
    visit(id);
  }

  return { ordered: sorted, errors };
}

// ============ SCHEMA GENERATOR ============

function generateSchema(config: AppComposition, features: FeatureManifest[]): string {
  const lines: string[] = [
    '-- Auto-generated schema for composed app',
    `-- Generated: ${new Date().toISOString()}`,
    `-- Features: ${features.map(f => f.id).join(', ')}`,
    '',
  ];

  const createdTables = new Set<string>();

  for (const feature of features) {
    lines.push(`-- === ${feature.name} (${feature.id}) ===`);
    for (const table of feature.requires.dbTables) {
      if (createdTables.has(table.name)) {
        lines.push(`-- Table "${table.name}" already created by a previous feature`);
        continue;
      }
      createdTables.add(table.name);
      lines.push(table.sql + ';');
      for (const idx of table.indexes || []) {
        lines.push(idx + ';');
      }
      if (table.seedData) {
        lines.push(table.seedData);
      }
    }
    lines.push('');
  }

  // Template-specific tables
  if (config.template === 'food-truck') {
    lines.push('-- === Food Truck template tables ===');
    const foodTruckTables: { name: string; sql: string; indexes?: string[] }[] = [
      {
        name: 'menu_items',
        sql: `CREATE TABLE IF NOT EXISTS menu_items (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, price INTEGER NOT NULL, category TEXT DEFAULT 'main', image_url TEXT, available INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_menu_category ON menu_items(category, available)`],
      },
      {
        name: 'orders',
        sql: `CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT, customer_name TEXT, items TEXT NOT NULL, total INTEGER NOT NULL, status TEXT DEFAULT 'pending', notes TEXT, pickup_time TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at DESC)`, `CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`],
      },
      {
        name: 'schedule',
        sql: `CREATE TABLE IF NOT EXISTS schedule (id TEXT PRIMARY KEY, date TEXT NOT NULL, location TEXT NOT NULL, address TEXT, lat REAL, lng REAL, start_time TEXT, end_time TEXT, notes TEXT, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_schedule_date ON schedule(date, active)`],
      },
      {
        name: 'alerts',
        sql: `CREATE TABLE IF NOT EXISTS alerts (id TEXT PRIMARY KEY, title TEXT NOT NULL, message TEXT NOT NULL, type TEXT DEFAULT 'info', active INTEGER DEFAULT 1, expires_at TEXT, created_at TEXT DEFAULT (datetime('now')))`,
      },
    ];

    for (const table of foodTruckTables) {
      if (!createdTables.has(table.name)) {
        lines.push(table.sql + ';');
        for (const idx of table.indexes || []) {
          lines.push(idx + ';');
        }
        createdTables.add(table.name);
      }
    }
    lines.push('');
  }

  if (config.template === 'festival') {
    lines.push('-- === Festival template tables ===');
    const festivalTables: { name: string; sql: string; indexes?: string[] }[] = [
      {
        name: 'events',
        sql: `CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, venue TEXT, date TEXT NOT NULL, start_time TEXT, end_time TEXT, category TEXT DEFAULT 'general', image_url TEXT, featured INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_events_date ON events(date, active)`, `CREATE INDEX IF NOT EXISTS idx_events_category ON events(category, active)`],
      },
      {
        name: 'tickets',
        sql: `CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, user_id TEXT, event_id TEXT, ticket_type TEXT DEFAULT 'general', quantity INTEGER DEFAULT 1, price INTEGER NOT NULL, status TEXT DEFAULT 'active', qr_code TEXT, holder_name TEXT, holder_email TEXT, purchased_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (event_id) REFERENCES events(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id)`, `CREATE INDEX IF NOT EXISTS idx_tickets_event ON tickets(event_id)`, `CREATE INDEX IF NOT EXISTS idx_tickets_qr ON tickets(qr_code)`],
      },
      {
        name: 'vendors',
        sql: `CREATE TABLE IF NOT EXISTS vendors (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, category TEXT DEFAULT 'food', location TEXT, contact_name TEXT, contact_email TEXT, contact_phone TEXT, logo_url TEXT, active INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category, active)`],
      },
      {
        name: 'pois',
        sql: `CREATE TABLE IF NOT EXISTS pois (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, type TEXT DEFAULT 'amenity', lat REAL, lng REAL, icon TEXT, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_pois_type ON pois(type, active)`],
      },
      {
        name: 'raffle_entries',
        sql: `CREATE TABLE IF NOT EXISTS raffle_entries (id TEXT PRIMARY KEY, user_id TEXT, raffle_id TEXT NOT NULL, ticket_number TEXT UNIQUE, name TEXT NOT NULL, email TEXT, phone TEXT, drawn INTEGER DEFAULT 0, winner INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_raffle_user ON raffle_entries(user_id)`, `CREATE INDEX IF NOT EXISTS idx_raffle_id ON raffle_entries(raffle_id)`],
      },
      {
        name: 'schedule',
        sql: `CREATE TABLE IF NOT EXISTS schedule (id TEXT PRIMARY KEY, date TEXT NOT NULL, location TEXT NOT NULL, address TEXT, lat REAL, lng REAL, start_time TEXT, end_time TEXT, notes TEXT, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_schedule_date ON schedule(date, active)`],
      },
      {
        name: 'alerts',
        sql: `CREATE TABLE IF NOT EXISTS alerts (id TEXT PRIMARY KEY, title TEXT NOT NULL, message TEXT NOT NULL, type TEXT DEFAULT 'info', active INTEGER DEFAULT 1, expires_at TEXT, created_at TEXT DEFAULT (datetime('now')))`,
      },
    ];

    for (const table of festivalTables) {
      if (!createdTables.has(table.name)) {
        lines.push(table.sql + ';');
        for (const idx of table.indexes || []) {
          lines.push(idx + ';');
        }
        createdTables.add(table.name);
      }
    }
    lines.push('');
  }

  if (config.template === 'simple-website') {
    lines.push('-- === Storefront (simple-website template) ===');
    if (!createdTables.has('products')) {
      lines.push(`CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, price INTEGER NOT NULL, image_url TEXT, category TEXT DEFAULT 'general', active INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));`);
      lines.push(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category, active);`);
      createdTables.add('products');
    }
    if (!createdTables.has('messages')) {
      lines.push(`CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, read INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')));`);
      createdTables.add('messages');
    }
    lines.push('');
  }

  // Wirez — electrician business organiser
  if (config.template === 'wirez') {
    lines.push('-- === Wirez template tables ===');
    const wirezTables: { name: string; sql: string; indexes?: string[] }[] = [
      {
        name: 'customers',
        sql: `CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, name TEXT NOT NULL, company TEXT, email TEXT, phone TEXT, address TEXT, suburb TEXT, state TEXT DEFAULT 'QLD', postcode TEXT, notes TEXT, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name)`, `CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)`],
      },
      {
        name: 'jobs',
        sql: `CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, job_number TEXT UNIQUE NOT NULL, customer_id TEXT, title TEXT NOT NULL, description TEXT, status TEXT DEFAULT 'quote', type TEXT DEFAULT 'residential', priority TEXT DEFAULT 'normal', assigned_to TEXT, scheduled_date TEXT, scheduled_time TEXT, completed_at TEXT, address TEXT, suburb TEXT, state TEXT DEFAULT 'QLD', postcode TEXT, quote_total INTEGER, invoice_total INTEGER, notes TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (customer_id) REFERENCES customers(id))`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status, scheduled_date)`,
          `CREATE INDEX IF NOT EXISTS idx_jobs_customer ON jobs(customer_id)`,
          `CREATE INDEX IF NOT EXISTS idx_jobs_assigned ON jobs(assigned_to)`,
          `CREATE INDEX IF NOT EXISTS idx_jobs_number ON jobs(job_number)`,
        ],
      },
      {
        name: 'job_time_entries',
        sql: `CREATE TABLE IF NOT EXISTS job_time_entries (id TEXT PRIMARY KEY, job_id TEXT NOT NULL, user_id TEXT, start_time TEXT NOT NULL, end_time TEXT, duration_mins INTEGER, notes TEXT, billable INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (job_id) REFERENCES jobs(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_time_job ON job_time_entries(job_id)`, `CREATE INDEX IF NOT EXISTS idx_time_user ON job_time_entries(user_id)`],
      },
      {
        name: 'job_materials',
        sql: `CREATE TABLE IF NOT EXISTS job_materials (id TEXT PRIMARY KEY, job_id TEXT NOT NULL, description TEXT NOT NULL, quantity REAL DEFAULT 1, unit_cost INTEGER, total_cost INTEGER, supplier TEXT, part_number TEXT, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (job_id) REFERENCES jobs(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_materials_job ON job_materials(job_id)`],
      },
      {
        name: 'job_notes',
        sql: `CREATE TABLE IF NOT EXISTS job_notes (id TEXT PRIMARY KEY, job_id TEXT NOT NULL, user_id TEXT, note TEXT NOT NULL, type TEXT DEFAULT 'general', file_url TEXT, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (job_id) REFERENCES jobs(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_notes_job ON job_notes(job_id)`],
      },
      {
        name: 'invoices',
        sql: `CREATE TABLE IF NOT EXISTS invoices (id TEXT PRIMARY KEY, invoice_number TEXT UNIQUE NOT NULL, job_id TEXT, customer_id TEXT, status TEXT DEFAULT 'draft', subtotal INTEGER, gst INTEGER, total INTEGER, due_date TEXT, paid_at TEXT, payment_ref TEXT, xero_invoice_id TEXT, notes TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (job_id) REFERENCES jobs(id), FOREIGN KEY (customer_id) REFERENCES customers(id))`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status, due_date)`,
          `CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id)`,
          `CREATE INDEX IF NOT EXISTS idx_invoices_job ON invoices(job_id)`,
        ],
      },
      {
        name: 'invoice_items',
        sql: `CREATE TABLE IF NOT EXISTS invoice_items (id TEXT PRIMARY KEY, invoice_id TEXT NOT NULL, description TEXT NOT NULL, quantity REAL DEFAULT 1, unit_price INTEGER, total INTEGER, gst_included INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (invoice_id) REFERENCES invoices(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_inv_items_invoice ON invoice_items(invoice_id)`],
      },
      {
        name: 'staff',
        sql: `CREATE TABLE IF NOT EXISTS staff (id TEXT PRIMARY KEY, user_id TEXT UNIQUE, name TEXT NOT NULL, email TEXT, phone TEXT, role TEXT DEFAULT 'technician', licence_number TEXT, licence_expiry TEXT, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_staff_user ON staff(user_id)`, `CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(active)`],
      },
    ];

    for (const table of wirezTables) {
      if (!createdTables.has(table.name)) {
        lines.push(table.sql + ';');
        for (const idx of table.indexes || []) lines.push(idx + ';');
        createdTables.add(table.name);
      }
    }

    // Auto-increment job number sequence
    lines.push(`CREATE TABLE IF NOT EXISTS job_sequences (key TEXT PRIMARY KEY, next_val INTEGER DEFAULT 1);`);
    lines.push(`INSERT OR IGNORE INTO job_sequences (key, next_val) VALUES ('job_number', 1001);`);
    lines.push(`CREATE TABLE IF NOT EXISTS invoice_sequences (key TEXT PRIMARY KEY, next_val INTEGER DEFAULT 1);`);
    lines.push(`INSERT OR IGNORE INTO invoice_sequences (key, next_val) VALUES ('invoice_number', 1001);`);
    lines.push('');
  }

  // O'Connor — butcher home delivery
  if (config.template === 'oconnor') {
    lines.push("-- === O'Connor delivery template tables ===");
    const oconnorTables: { name: string; sql: string; indexes?: string[] }[] = [
      {
        name: 'customers',
        sql: `CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, phone TEXT, address TEXT, suburb TEXT, state TEXT DEFAULT 'QLD', postcode TEXT, delivery_notes TEXT, active INTEGER DEFAULT 1, stripe_customer_id TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_cust_email ON customers(email)`, `CREATE INDEX IF NOT EXISTS idx_cust_active ON customers(active)`],
      },
      {
        name: 'products',
        sql: `CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, price INTEGER NOT NULL, unit TEXT DEFAULT 'kg', image_url TEXT, category TEXT DEFAULT 'beef', stock_available INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_prod_category ON products(category, active)`],
      },
      {
        name: 'orders',
        sql: `CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, status TEXT DEFAULT 'pending', delivery_date TEXT, delivery_window TEXT, subtotal INTEGER, gst INTEGER, total INTEGER, payment_status TEXT DEFAULT 'unpaid', payment_ref TEXT, delivery_notes TEXT, driver_notes TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (customer_id) REFERENCES customers(id))`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id)`,
          `CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(delivery_date, status)`,
          `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`,
        ],
      },
      {
        name: 'order_items',
        sql: `CREATE TABLE IF NOT EXISTS order_items (id TEXT PRIMARY KEY, order_id TEXT NOT NULL, product_id TEXT NOT NULL, quantity REAL NOT NULL, unit_price INTEGER, total INTEGER, notes TEXT, FOREIGN KEY (order_id) REFERENCES orders(id), FOREIGN KEY (product_id) REFERENCES products(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_oi_order ON order_items(order_id)`],
      },
      {
        name: 'delivery_runs',
        sql: `CREATE TABLE IF NOT EXISTS delivery_runs (id TEXT PRIMARY KEY, run_date TEXT NOT NULL, driver_id TEXT, status TEXT DEFAULT 'planned', started_at TEXT, completed_at TEXT, notes TEXT, created_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_runs_date ON delivery_runs(run_date, status)`],
      },
      {
        name: 'delivery_stops',
        sql: `CREATE TABLE IF NOT EXISTS delivery_stops (id TEXT PRIMARY KEY, run_id TEXT NOT NULL, order_id TEXT NOT NULL, stop_order INTEGER DEFAULT 0, status TEXT DEFAULT 'pending', arrived_at TEXT, completed_at TEXT, signature_url TEXT, notes TEXT, FOREIGN KEY (run_id) REFERENCES delivery_runs(id), FOREIGN KEY (order_id) REFERENCES orders(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_stops_run ON delivery_stops(run_id, stop_order)`],
      },
      {
        name: 'subscriptions',
        sql: `CREATE TABLE IF NOT EXISTS subscriptions (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, status TEXT DEFAULT 'active', frequency TEXT DEFAULT 'weekly', next_delivery_date TEXT, items TEXT NOT NULL, stripe_subscription_id TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (customer_id) REFERENCES customers(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_subs_customer ON subscriptions(customer_id)`, `CREATE INDEX IF NOT EXISTS idx_subs_next ON subscriptions(next_delivery_date, status)`],
      },
      {
        name: 'driver_locations',
        sql: `CREATE TABLE IF NOT EXISTS driver_locations (id TEXT PRIMARY KEY, driver_id TEXT NOT NULL, run_id TEXT, lat REAL NOT NULL, lng REAL NOT NULL, recorded_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_loc_driver ON driver_locations(driver_id, recorded_at DESC)`],
      },
      {
        name: 'push_subscriptions',
        sql: `CREATE TABLE IF NOT EXISTS push_subscriptions (id TEXT PRIMARY KEY, customer_id TEXT, endpoint TEXT NOT NULL, keys TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_push_customer ON push_subscriptions(customer_id)`],
      },
    ];

    for (const table of oconnorTables) {
      if (!createdTables.has(table.name)) {
        lines.push(table.sql + ';');
        for (const idx of table.indexes || []) lines.push(idx + ';');
        createdTables.add(table.name);
      }
    }
    lines.push('');
  }

  // AutoHue — desktop app with license key management
  if (config.template === 'autohue') {
    lines.push('-- === AutoHue license key template tables ===');
    const autohueTables: { name: string; sql: string; indexes?: string[] }[] = [
      {
        name: 'products',
        sql: `CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, price INTEGER NOT NULL, currency TEXT DEFAULT 'AUD', type TEXT DEFAULT 'perpetual', max_activations INTEGER DEFAULT 1, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')))`,
        indexes: [],
      },
      {
        name: 'licenses',
        sql: `CREATE TABLE IF NOT EXISTS licenses (id TEXT PRIMARY KEY, license_key TEXT UNIQUE NOT NULL, product_id TEXT NOT NULL, customer_email TEXT NOT NULL, customer_name TEXT, status TEXT DEFAULT 'active', max_activations INTEGER DEFAULT 1, activation_count INTEGER DEFAULT 0, expires_at TEXT, stripe_payment_id TEXT, paypal_payment_id TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (product_id) REFERENCES products(id))`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_lic_key ON licenses(license_key)`,
          `CREATE INDEX IF NOT EXISTS idx_lic_email ON licenses(customer_email)`,
          `CREATE INDEX IF NOT EXISTS idx_lic_status ON licenses(status)`,
        ],
      },
      {
        name: 'activations',
        sql: `CREATE TABLE IF NOT EXISTS activations (id TEXT PRIMARY KEY, license_id TEXT NOT NULL, machine_id TEXT NOT NULL, machine_name TEXT, platform TEXT, app_version TEXT, activated_at TEXT DEFAULT (datetime('now')), last_seen TEXT DEFAULT (datetime('now')), active INTEGER DEFAULT 1, FOREIGN KEY (license_id) REFERENCES licenses(id))`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_act_license ON activations(license_id)`,
          `CREATE UNIQUE INDEX IF NOT EXISTS idx_act_machine ON activations(license_id, machine_id)`,
        ],
      },
      {
        name: 'releases',
        sql: `CREATE TABLE IF NOT EXISTS releases (id TEXT PRIMARY KEY, version TEXT UNIQUE NOT NULL, platform TEXT NOT NULL, channel TEXT DEFAULT 'stable', r2_key TEXT NOT NULL, file_name TEXT, file_size INTEGER, sha256 TEXT, changelog TEXT, min_license_date TEXT, created_at TEXT DEFAULT (datetime('now')), active INTEGER DEFAULT 1)`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_rel_channel ON releases(channel, platform, active)`,
          `CREATE INDEX IF NOT EXISTS idx_rel_version ON releases(version)`,
        ],
      },
      {
        name: 'download_log',
        sql: `CREATE TABLE IF NOT EXISTS download_log (id TEXT PRIMARY KEY, license_id TEXT, release_id TEXT NOT NULL, machine_id TEXT, ip_address TEXT, user_agent TEXT, downloaded_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (release_id) REFERENCES releases(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_dl_license ON download_log(license_id)`, `CREATE INDEX IF NOT EXISTS idx_dl_release ON download_log(release_id)`],
      },
    ];

    for (const table of autohueTables) {
      if (!createdTables.has(table.name)) {
        lines.push(table.sql + ';');
        for (const idx of table.indexes || []) lines.push(idx + ';');
        createdTables.add(table.name);
      }
    }

    // Seed default product
    lines.push(`INSERT OR IGNORE INTO products (id, name, description, price, type, max_activations) VALUES ('default-product', ${JSON.stringify(config.branding.name)}, 'Desktop application license', 4900, 'perpetual', 2);`);
    lines.push('');
  }

  // Aussie Saver — fuel & utility comparison
  if (config.template === 'aussie-saver') {
    lines.push('-- === Aussie Saver template tables ===');
    const aussieSaverTables: { name: string; sql: string; indexes?: string[] }[] = [
      {
        name: 'fuel_stations',
        sql: `CREATE TABLE IF NOT EXISTS fuel_stations (id TEXT PRIMARY KEY, name TEXT NOT NULL, brand TEXT, address TEXT, suburb TEXT, state TEXT DEFAULT 'QLD', postcode TEXT, lat REAL, lng REAL, phone TEXT, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_stations_brand ON fuel_stations(brand)`,
          `CREATE INDEX IF NOT EXISTS idx_stations_suburb ON fuel_stations(suburb, state)`,
        ],
      },
      {
        name: 'fuel_prices',
        sql: `CREATE TABLE IF NOT EXISTS fuel_prices (id TEXT PRIMARY KEY, station_id TEXT NOT NULL, fuel_type TEXT NOT NULL, price_cents INTEGER NOT NULL, reported_by TEXT, confirmed_count INTEGER DEFAULT 0, reported_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (station_id) REFERENCES fuel_stations(id))`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_prices_station ON fuel_prices(station_id, fuel_type, reported_at DESC)`,
          `CREATE INDEX IF NOT EXISTS idx_prices_type_date ON fuel_prices(fuel_type, reported_at DESC)`,
        ],
      },
      {
        name: 'vehicles',
        sql: `CREATE TABLE IF NOT EXISTS vehicles (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, nickname TEXT, make TEXT, model TEXT, year INTEGER, fuel_type TEXT DEFAULT 'ULP91', tank_size_litres REAL, avg_l_per_100km REAL, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_vehicles_user ON vehicles(user_id)`],
      },
      {
        name: 'fill_ups',
        sql: `CREATE TABLE IF NOT EXISTS fill_ups (id TEXT PRIMARY KEY, vehicle_id TEXT NOT NULL, station_id TEXT, litres REAL NOT NULL, price_per_litre_cents INTEGER NOT NULL, total_cost_cents INTEGER NOT NULL, odometer INTEGER, notes TEXT, filled_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (vehicle_id) REFERENCES vehicles(id))`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_fillups_vehicle ON fill_ups(vehicle_id, filled_at DESC)`,
          `CREATE INDEX IF NOT EXISTS idx_fillups_station ON fill_ups(station_id)`,
        ],
      },
      {
        name: 'app_settings',
        sql: `CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [],
      },
    ];
    for (const table of aussieSaverTables) {
      if (!createdTables.has(table.name)) {
        lines.push(table.sql + ';');
        for (const idx of table.indexes || []) lines.push(idx + ';');
        createdTables.add(table.name);
      }
    }
    lines.push(`INSERT OR IGNORE INTO app_settings (key, value) VALUES ('supported_fuel_types', 'ULP91,ULP95,ULP98,Diesel,LPG,E10,Premium');`);
    lines.push(`INSERT OR IGNORE INTO app_settings (key, value) VALUES ('max_price_age_hours', '24');`);
    lines.push('');
  }

  // SocialAI — white-label AI social media management
  if (config.template === 'socialai') {
    lines.push('-- === SocialAI template tables ===');
    const socialaiTables: { name: string; sql: string; indexes?: string[] }[] = [
      {
        name: 'clients',
        sql: `CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, user_id TEXT, business_name TEXT NOT NULL, industry TEXT, website TEXT, facebook_page_id TEXT, facebook_access_token TEXT, instagram_account_id TEXT, linkedin_page_id TEXT, brand_voice TEXT, tone TEXT DEFAULT 'professional', post_frequency TEXT DEFAULT 'daily', status TEXT DEFAULT 'active', subscription_plan TEXT DEFAULT 'starter', onboarded_at TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id)`,
          `CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status)`,
        ],
      },
      {
        name: 'posts',
        sql: `CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, client_id TEXT NOT NULL, platform TEXT NOT NULL, content TEXT NOT NULL, image_url TEXT, status TEXT DEFAULT 'draft', ai_model TEXT, ai_prompt TEXT, rejection_reason TEXT, scheduled_for TEXT, published_at TEXT, approved_at TEXT, approved_by TEXT, created_by TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (client_id) REFERENCES clients(id))`,
        indexes: [
          `CREATE INDEX IF NOT EXISTS idx_posts_client ON posts(client_id, status)`,
          `CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON posts(scheduled_for, status)`,
        ],
      },
      {
        name: 'portal',
        sql: `CREATE TABLE IF NOT EXISTS portal (id TEXT PRIMARY KEY, client_id TEXT NOT NULL UNIQUE, token TEXT UNIQUE NOT NULL, expires_at TEXT, last_accessed TEXT, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (client_id) REFERENCES clients(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_portal_token ON portal(token)`],
      },
      {
        name: 'pending_activations',
        sql: `CREATE TABLE IF NOT EXISTS pending_activations (id TEXT PRIMARY KEY, email TEXT NOT NULL, business_name TEXT, plan TEXT DEFAULT 'starter', token TEXT UNIQUE NOT NULL, expires_at TEXT NOT NULL, completed_at TEXT, created_at TEXT DEFAULT (datetime('now')))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_pa_token ON pending_activations(token)`],
      },
      {
        name: 'pending_cancellations',
        sql: `CREATE TABLE IF NOT EXISTS pending_cancellations (id TEXT PRIMARY KEY, client_id TEXT NOT NULL, reason TEXT, requested_at TEXT DEFAULT (datetime('now')), processed_at TEXT, FOREIGN KEY (client_id) REFERENCES clients(id))`,
        indexes: [`CREATE INDEX IF NOT EXISTS idx_pc_client ON pending_cancellations(client_id)`],
      },
    ];
    for (const table of socialaiTables) {
      if (!createdTables.has(table.name)) {
        lines.push(table.sql + ';');
        for (const idx of table.indexes || []) lines.push(idx + ';');
        createdTables.add(table.name);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ============ WRANGLER.TOML GENERATOR ============

function generateWranglerToml(config: AppComposition, features: FeatureManifest[]): string {
  const lines: string[] = [
    `name = "${config.id}"`,
    `main = "src/index.ts"`,
    `compatibility_date = "2024-06-01"`,
    '',
    '[vars]',
    `ENVIRONMENT = "production"`,
    `APP_NAME = "${config.branding.name}"`,
    `APP_COLOR = "${config.branding.color}"`,
  ];

  // Add non-secret env vars
  for (const [key, val] of Object.entries(config.env)) {
    lines.push(`${key} = "${val}"`);
  }

  lines.push('', '# D1 Database', '[[d1_databases]]', 'binding = "DB"',
    `database_name = "${config.id}-db"`, `database_id = "REPLACE_WITH_DB_ID"`);

  // Collect R2/KV bindings from features
  const r2Buckets = new Set<string>();
  const kvNamespaces = new Set<string>();

  for (const feature of features) {
    for (const binding of feature.requires.bindings) {
      if (binding.type === 'r2') r2Buckets.add(binding.name);
      if (binding.type === 'kv') kvNamespaces.add(binding.name);
    }
  }

  for (const bucket of r2Buckets) {
    lines.push('', `[[r2_buckets]]`, `binding = "${bucket}"`, `bucket_name = "${config.id}-${bucket.toLowerCase()}"`);
  }

  for (const ns of kvNamespaces) {
    lines.push('', `[[kv_namespaces]]`, `binding = "${ns}"`, `id = "REPLACE_WITH_KV_ID"`);
  }

  // Cron jobs
  const crons = features.flatMap(f => f.provides.cronJobs.map(c => c.schedule));
  if (crons.length > 0) {
    lines.push('', '[triggers]', `crons = [${crons.map(c => `"${c}"`).join(', ')}]`);
  }

  return lines.join('\n');
}

// ============ INDEX.TS GENERATOR ============

function generateIndexTs(config: AppComposition, features: FeatureManifest[]): string {
  const featureIds = features.map(f => f.id);
  const hasAuth = featureIds.includes('auth-clerk');
  const hasAuthBearer = featureIds.includes('auth-bearer');
  const anyAuth = hasAuth || hasAuthBearer;
  const hasPaymentsStripe = featureIds.includes('payments-stripe');
  const hasPaymentsPaypal = featureIds.includes('payments-paypal');
  const hasPaymentsSquare = featureIds.includes('payments-square');
  const hasEmail = featureIds.includes('email-resend');
  const hasSms = featureIds.includes('sms-twilio');
  const hasAi = featureIds.includes('ai-openrouter');

  const lines: string[] = [
    `// ${config.branding.name} — Composed Worker`,
    `// Features: ${featureIds.join(', ')}`,
    `// Generated: ${new Date().toISOString().split('T')[0]}`,
    "import { Hono } from 'hono';",
    "import { cors } from 'hono/cors';",
    '',
    '// Feature imports',
  ];

  // Generate real imports based on features
  if (hasAuth) {
    lines.push("import { requireAuth, requireAdmin, optionalAuth, handleVerify, handleMe, handleClerkWebhook, registerAuthClerk } from '../features/foundation/auth-clerk/index';");
  }
  if (hasAuthBearer) {
    lines.push("import { requireAuth, requireAdmin, optionalAuth, requireRole, registerAuthBearer, cleanupExpiredTokens } from '../features/foundation/auth-bearer/index';");
  }
  if (hasPaymentsStripe) {
    lines.push("import { registerPaymentsStripe } from '../features/foundation/payments-stripe/index';");
  }
  if (hasPaymentsPaypal) {
    lines.push("import { registerPaymentsPaypal } from '../features/foundation/payments-paypal/index';");
  }
  if (hasPaymentsSquare) {
    lines.push("import { registerPaymentsSquare } from '../features/foundation/payments-square/index';");
  }
  if (hasEmail) {
    lines.push("import { sendEmail, emailTemplate, registerEmailResend, handleSendEmail, handleEmailLog } from '../features/foundation/email-resend/index';");
  }
  if (hasSms) {
    lines.push("import { sendSms, broadcastSms, registerSmsTwilio } from '../features/foundation/sms-twilio/index';");
  }
  if (hasAi) {
    lines.push("import { chatCompletion, textGenerate, registerAiOpenrouter } from '../features/foundation/ai-openrouter/index';");
  }

  lines.push('', `const app = new Hono();`, '');

  // CORS
  lines.push(`// CORS`);
  lines.push(`app.use('*', cors({ origin: ['https://${config.domain}', 'http://localhost:3000'] }));`);
  lines.push('');

  // Root route (HEAD + GET) for validator health checks
  lines.push(`// ============ ROOT & HEALTH ============`);
  lines.push(`app.on(['GET', 'HEAD'], '/', (c) => c.json({`);
  lines.push(`  app: ${JSON.stringify(config.branding.name)},`);
  lines.push(`  status: 'ok',`);
  lines.push(`  docs: '/api/health',`);
  lines.push(`}));`);
  lines.push('');

  // Health endpoint
  lines.push(`app.get('/api/health', (c) => c.json({`);
  lines.push(`  status: 'ok',`);
  lines.push(`  app: ${JSON.stringify(config.branding.name)},`);
  lines.push(`  features: ${JSON.stringify(featureIds)},`);
  lines.push(`  version: '1.0.0'`);
  lines.push(`}));`);
  lines.push('');

  // Register features with real function calls
  lines.push(`// ============ REGISTER FEATURES ============`);
  if (hasAuth) lines.push(`registerAuthClerk(app);`);
  if (hasAuthBearer) lines.push(`registerAuthBearer(app);`);
  if (hasPaymentsStripe) {
    lines.push(`registerPaymentsStripe(app${anyAuth ? ', requireAuth()' : ''});`);
  }
  if (hasPaymentsPaypal) {
    lines.push(`registerPaymentsPaypal(app${anyAuth ? ', requireAuth()' : ''});`);
  }
  if (hasPaymentsSquare) {
    lines.push(`registerPaymentsSquare(app${anyAuth ? ', requireAuth()' : ''});`);
  }
  if (hasEmail) {
    lines.push(`registerEmailResend(app${anyAuth ? ', requireAdmin()' : ''});`);
  }
  if (hasSms) {
    lines.push(`registerSmsTwilio(app${anyAuth ? ', requireAdmin()' : ''});`);
  }
  if (hasAi) {
    lines.push(`registerAiOpenrouter(app${anyAuth ? ', requireAuth()' : ''}${anyAuth ? ', requireAdmin()' : ''});`);
  }
  lines.push('');

  // Template-specific routes
  if (config.template === 'simple-website') {
    const authGuard = anyAuth ? 'requireAdmin(), ' : '';

    lines.push(`// ============ STOREFRONT ============`);
    lines.push(`app.get('/api/products', async (c) => {`);
    lines.push(`  const products = await c.env.DB.prepare(`);
    lines.push(`    "SELECT * FROM products WHERE active = 1 ORDER BY sort_order, name"`);
    lines.push(`  ).all();`);
    lines.push(`  return c.json({ products: products.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/products/:id', async (c) => {`);
    lines.push(`  const product = await c.env.DB.prepare(`);
    lines.push(`    "SELECT * FROM products WHERE id = ?"`);
    lines.push(`  ).bind(c.req.param('id')).first();`);
    lines.push(`  if (!product) return c.json({ error: 'Not found' }, 404);`);
    lines.push(`  return c.json({ product });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/products', ${authGuard}async (c) => {`);
    lines.push(`  const { name, description, price, image_url, category } = await c.req.json();`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO products (id, name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, name, description || '', price, image_url || null, category || 'general').run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/products/:id', ${authGuard}async (c) => {`);
    lines.push(`  const id = c.req.param('id');`);
    lines.push(`  const body = await c.req.json();`);
    lines.push(`  const fields: string[] = [];`);
    lines.push(`  const values: any[] = [];`);
    lines.push(`  for (const [key, val] of Object.entries(body)) {`);
    lines.push(`    if (key === 'id') continue;`);
    lines.push(`    fields.push(\`\${key} = ?\`);`);
    lines.push(`    values.push(val);`);
    lines.push(`  }`);
    lines.push(`  fields.push("updated_at = datetime('now')");`);
    lines.push(`  values.push(id);`);
    lines.push(`  await c.env.DB.prepare(\`UPDATE products SET \${fields.join(', ')} WHERE id = ?\`).bind(...values).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.delete('/api/products/:id', ${authGuard}async (c) => {`);
    lines.push(`  await c.env.DB.prepare('UPDATE products SET active = 0 WHERE id = ?').bind(c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    // Contact form
    if (hasEmail) {
      lines.push(`// ============ CONTACT ============`);
      lines.push(`app.post('/api/contact', async (c) => {`);
      lines.push(`  const { name, email, message } = await c.req.json();`);
      lines.push(`  if (!name || !email || !message) {`);
      lines.push(`    return c.json({ error: 'name, email, and message are required' }, 400);`);
      lines.push(`  }`);
      lines.push(`  const id = crypto.randomUUID();`);
      lines.push(`  await c.env.DB.prepare(`);
      lines.push(`    'INSERT INTO messages (id, name, email, message) VALUES (?, ?, ?, ?)'`);
      lines.push(`  ).bind(id, name, email, message).run();`);
      lines.push(`  await sendEmail(c.env, {`);
      lines.push(`    to: c.env.EMAIL_FROM,`);
      lines.push(`    subject: \`New enquiry from \${name}\`,`);
      lines.push(`    html: emailTemplate(${JSON.stringify(config.branding.name)}, '${config.branding.color}', \``);
      lines.push(`      <h2 style="color:#111;margin:0 0 16px;">New Contact Form Submission</h2>`);
      lines.push(`      <p><strong>From:</strong> \${name} (\${email})</p>`);
      lines.push(`      <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:16px 0;">`);
      lines.push(`        <p style="color:#374151;white-space:pre-wrap;">\${message}</p>`);
      lines.push(`      </div>\`),`);
      lines.push(`    template: 'contact-notification',`);
      lines.push(`  });`);
      lines.push(`  return c.json({ success: true });`);
      lines.push(`});`);
      lines.push('');
    }

    lines.push(`app.get('/api/messages', ${authGuard}async (c) => {`);
    lines.push(`  const messages = await c.env.DB.prepare(`);
    lines.push(`    'SELECT * FROM messages ORDER BY created_at DESC LIMIT 100'`);
    lines.push(`  ).all();`);
    lines.push(`  return c.json({ messages: messages.results });`);
    lines.push(`});`);
    lines.push('');
  }

  // Food truck template routes
  if (config.template === 'food-truck') {
    const authGuard = anyAuth ? 'requireAdmin(), ' : '';

    lines.push(`// ============ MENU ============`);
    lines.push(`app.get('/api/menu', async (c) => {`);
    lines.push(`  const items = await c.env.DB.prepare(`);
    lines.push(`    "SELECT * FROM menu_items WHERE available = 1 ORDER BY sort_order, name"`);
    lines.push(`  ).all();`);
    lines.push(`  return c.json({ menu: items.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/menu', ${authGuard}async (c) => {`);
    lines.push(`  const { name, description, price, category, image_url } = await c.req.json();`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO menu_items (id, name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, name, description || '', price, category || 'main', image_url || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/menu/:id', ${authGuard}async (c) => {`);
    lines.push(`  const id = c.req.param('id');`);
    lines.push(`  const body = await c.req.json();`);
    lines.push(`  const fields: string[] = [];`);
    lines.push(`  const values: any[] = [];`);
    lines.push(`  for (const [key, val] of Object.entries(body)) {`);
    lines.push(`    if (key === 'id') continue;`);
    lines.push(`    fields.push(\`\${key} = ?\`);`);
    lines.push(`    values.push(val);`);
    lines.push(`  }`);
    lines.push(`  fields.push("updated_at = datetime('now')");`);
    lines.push(`  values.push(id);`);
    lines.push(`  await c.env.DB.prepare(\`UPDATE menu_items SET \${fields.join(', ')} WHERE id = ?\`).bind(...values).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ ORDERS ============`);
    lines.push(`app.get('/api/orders', ${authGuard}async (c) => {`);
    lines.push(`  const status = c.req.query('status');`);
    lines.push(`  let sql = 'SELECT * FROM orders';`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (status) { sql += ' WHERE status = ?'; params.push(status); }`);
    lines.push(`  sql += ' ORDER BY created_at DESC LIMIT 100';`);
    lines.push(`  const orders = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ orders: orders.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/orders', async (c) => {`);
    lines.push(`  const { customer_name, items, total, notes, pickup_time } = await c.req.json();`);
    lines.push(`  if (!items || !total) return c.json({ error: 'items and total required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO orders (id, customer_name, items, total, notes, pickup_time) VALUES (?, ?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, customer_name || 'Walk-in', JSON.stringify(items), total, notes || null, pickup_time || null).run();`);

    // Send SMS notification if sms-twilio is included
    if (hasSms) {
      lines.push(`  // SMS notification to owner`);
      lines.push(`  if (c.env.TWILIO_ACCOUNT_SID) {`);
      lines.push(`    await sendSms(c.env, {`);
      lines.push(`      to: c.env.OWNER_PHONE || c.env.TWILIO_FROM_NUMBER,`);
      lines.push(`      message: \`New order #\${id.slice(0,8)} from \${customer_name || 'Walk-in'} - $\${(total/100).toFixed(2)}\`,`);
      lines.push(`    }).catch(() => {}); // Don't fail the order if SMS fails`);
      lines.push(`  }`);
    }

    // Send email notification if email-resend is included
    if (hasEmail) {
      lines.push(`  // Email notification to owner`);
      lines.push(`  if (c.env.RESEND_API_KEY) {`);
      lines.push(`    await sendEmail(c.env, {`);
      lines.push(`      to: c.env.EMAIL_FROM,`);
      lines.push(`      subject: \`New order from \${customer_name || 'Walk-in'}\`,`);
      lines.push(`      html: emailTemplate(${JSON.stringify(config.branding.name)}, '${config.branding.color}', \``);
      lines.push(`        <h2>New Order #\${id.slice(0,8)}</h2>`);
      lines.push(`        <p><strong>Customer:</strong> \${customer_name || 'Walk-in'}</p>`);
      lines.push(`        <p><strong>Total:</strong> $\${(total/100).toFixed(2)}</p>`);
      lines.push(`        <p><strong>Items:</strong> \${JSON.stringify(items)}</p>\`),`);
      lines.push(`      template: 'order-notification',`);
      lines.push(`    }).catch(() => {});`);
      lines.push(`  }`);
    }

    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/orders/:id/status', ${authGuard}async (c) => {`);
    lines.push(`  const { status } = await c.req.json();`);
    lines.push(`  if (!['pending','preparing','ready','completed','cancelled'].includes(status)) {`);
    lines.push(`    return c.json({ error: 'Invalid status' }, 400);`);
    lines.push(`  }`);
    lines.push(`  await c.env.DB.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ SCHEDULE ============`);
    lines.push(`app.get('/api/schedule', async (c) => {`);
    lines.push(`  const schedule = await c.env.DB.prepare(`);
    lines.push(`    "SELECT * FROM schedule WHERE active = 1 AND date >= date('now') ORDER BY date, start_time LIMIT 30"`);
    lines.push(`  ).all();`);
    lines.push(`  return c.json({ schedule: schedule.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/schedule', ${authGuard}async (c) => {`);
    lines.push(`  const { date, location, address, lat, lng, start_time, end_time, notes } = await c.req.json();`);
    lines.push(`  if (!date || !location) return c.json({ error: 'date and location required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO schedule (id, date, location, address, lat, lng, start_time, end_time, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, date, location, address || null, lat || null, lng || null, start_time || null, end_time || null, notes || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ ALERTS ============`);
    lines.push(`app.get('/api/alerts', async (c) => {`);
    lines.push(`  const alerts = await c.env.DB.prepare(`);
    lines.push(`    "SELECT * FROM alerts WHERE active = 1 AND (expires_at IS NULL OR expires_at > datetime('now')) ORDER BY created_at DESC"`);
    lines.push(`  ).all();`);
    lines.push(`  return c.json({ alerts: alerts.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/alerts', ${authGuard}async (c) => {`);
    lines.push(`  const { title, message, type, expires_at } = await c.req.json();`);
    lines.push(`  if (!title || !message) return c.json({ error: 'title and message required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO alerts (id, title, message, type, expires_at) VALUES (?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, title, message, type || 'info', expires_at || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
  }

  // Festival template routes
  if (config.template === 'festival') {
    const authGuard = anyAuth ? 'requireAdmin(), ' : '';

    // Events
    lines.push(`// ============ EVENTS ============`);
    lines.push(`app.get('/api/events', async (c) => {`);
    lines.push(`  const category = c.req.query('category');`);
    lines.push(`  let sql = "SELECT * FROM events WHERE active = 1";`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (category) { sql += ' AND category = ?'; params.push(category); }`);
    lines.push(`  sql += ' ORDER BY date, start_time, sort_order';`);
    lines.push(`  const events = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ events: events.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/events/:id', async (c) => {`);
    lines.push(`  const event = await c.env.DB.prepare("SELECT * FROM events WHERE id = ?").bind(c.req.param('id')).first();`);
    lines.push(`  if (!event) return c.json({ error: 'Not found' }, 404);`);
    lines.push(`  return c.json({ event });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/events', ${authGuard}async (c) => {`);
    lines.push(`  const { name, description, venue, date, start_time, end_time, category, image_url, featured } = await c.req.json();`);
    lines.push(`  if (!name || !date) return c.json({ error: 'name and date required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO events (id, name, description, venue, date, start_time, end_time, category, image_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, name, description || '', venue || null, date, start_time || null, end_time || null, category || 'general', image_url || null, featured ? 1 : 0).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/events/:id', ${authGuard}async (c) => {`);
    lines.push(`  const id = c.req.param('id');`);
    lines.push(`  const body = await c.req.json();`);
    lines.push(`  const fields: string[] = [];`);
    lines.push(`  const values: any[] = [];`);
    lines.push(`  for (const [key, val] of Object.entries(body)) {`);
    lines.push(`    if (key === 'id') continue;`);
    lines.push(`    fields.push(\`\${key} = ?\`);`);
    lines.push(`    values.push(val);`);
    lines.push(`  }`);
    lines.push(`  fields.push("updated_at = datetime('now')");`);
    lines.push(`  values.push(id);`);
    lines.push(`  await c.env.DB.prepare(\`UPDATE events SET \${fields.join(', ')} WHERE id = ?\`).bind(...values).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    // Tickets
    lines.push(`// ============ TICKETS ============`);
    lines.push(`app.post('/api/tickets/purchase', async (c) => {`);
    lines.push(`  const { event_id, ticket_type, quantity, holder_name, holder_email } = await c.req.json();`);
    lines.push(`  if (!event_id || !holder_name || !holder_email) return c.json({ error: 'event_id, holder_name, holder_email required' }, 400);`);
    lines.push(`  const event = await c.env.DB.prepare("SELECT * FROM events WHERE id = ? AND active = 1").bind(event_id).first();`);
    lines.push(`  if (!event) return c.json({ error: 'Event not found' }, 404);`);
    lines.push(`  const qty = quantity || 1;`);
    lines.push(`  const tickets: any[] = [];`);
    lines.push(`  for (let i = 0; i < qty; i++) {`);
    lines.push(`    const id = crypto.randomUUID();`);
    lines.push(`    const qr = crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();`);
    lines.push(`    const user = c.get('user') as any;`);
    lines.push(`    await c.env.DB.prepare(`);
    lines.push(`      'INSERT INTO tickets (id, user_id, event_id, ticket_type, quantity, price, qr_code, holder_name, holder_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'`);
    lines.push(`    ).bind(id, user?.id || null, event_id, ticket_type || 'general', 1, 0, qr, holder_name, holder_email).run();`);
    lines.push(`    tickets.push({ id, qr_code: qr });`);
    lines.push(`  }`);
    if (hasSms) {
      lines.push(`  if (c.env.TWILIO_ACCOUNT_SID) {`);
      lines.push(`    await sendSms(c.env, {`);
      lines.push(`      to: c.env.OWNER_PHONE || c.env.TWILIO_FROM_NUMBER,`);
      lines.push(`      message: \`Ticket purchased for \${(event as any).name} by \${holder_name} (x\${qty})\`,`);
      lines.push(`    }).catch(() => {});`);
      lines.push(`  }`);
    }
    if (hasEmail) {
      lines.push(`  if (c.env.RESEND_API_KEY) {`);
      lines.push(`    await sendEmail(c.env, {`);
      lines.push(`      to: holder_email,`);
      lines.push(`      subject: \`Your tickets for \${(event as any).name}\`,`);
      lines.push(`      html: emailTemplate(${JSON.stringify(config.branding.name)}, '${config.branding.color}', \``);
      lines.push(`        <h2>Ticket Confirmation</h2>`);
      lines.push(`        <p><strong>Event:</strong> \${(event as any).name}</p>`);
      lines.push(`        <p><strong>Tickets:</strong> \${qty}</p>`);
      lines.push(`        <p><strong>QR Codes:</strong> \${tickets.map((t: any) => t.qr_code).join(', ')}</p>\`),`);
      lines.push(`      template: 'ticket-confirmation',`);
      lines.push(`    }).catch(() => {});`);
      lines.push(`  }`);
    }
    lines.push(`  return c.json({ success: true, tickets });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/tickets', ${anyAuth ? 'requireAuth(), ' : ''}async (c) => {`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const tickets = await c.env.DB.prepare(`);
    lines.push(`    'SELECT t.*, e.name as event_name, e.date as event_date FROM tickets t LEFT JOIN events e ON t.event_id = e.id WHERE t.user_id = ? ORDER BY t.purchased_at DESC'`);
    lines.push(`  ).bind(user.id).all();`);
    lines.push(`  return c.json({ tickets: tickets.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/tickets/verify/:qr', ${authGuard}async (c) => {`);
    lines.push(`  const ticket = await c.env.DB.prepare(`);
    lines.push(`    'SELECT t.*, e.name as event_name FROM tickets t LEFT JOIN events e ON t.event_id = e.id WHERE t.qr_code = ?'`);
    lines.push(`  ).bind(c.req.param('qr')).first();`);
    lines.push(`  if (!ticket) return c.json({ valid: false, error: 'Ticket not found' }, 404);`);
    lines.push(`  return c.json({ valid: ticket.status === 'active', ticket });`);
    lines.push(`});`);
    lines.push('');

    // Vendors
    lines.push(`// ============ VENDORS ============`);
    lines.push(`app.get('/api/vendors', async (c) => {`);
    lines.push(`  const category = c.req.query('category');`);
    lines.push(`  let sql = "SELECT * FROM vendors WHERE active = 1";`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (category) { sql += ' AND category = ?'; params.push(category); }`);
    lines.push(`  sql += ' ORDER BY sort_order, name';`);
    lines.push(`  const vendors = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ vendors: vendors.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/vendors', ${authGuard}async (c) => {`);
    lines.push(`  const { name, description, category, location, contact_name, contact_email, contact_phone, logo_url } = await c.req.json();`);
    lines.push(`  if (!name) return c.json({ error: 'name required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO vendors (id, name, description, category, location, contact_name, contact_email, contact_phone, logo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, name, description || '', category || 'food', location || null, contact_name || null, contact_email || null, contact_phone || null, logo_url || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    // POIs
    lines.push(`// ============ POINTS OF INTEREST ============`);
    lines.push(`app.get('/api/pois', async (c) => {`);
    lines.push(`  const type = c.req.query('type');`);
    lines.push(`  let sql = "SELECT * FROM pois WHERE active = 1";`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (type) { sql += ' AND type = ?'; params.push(type); }`);
    lines.push(`  const pois = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ pois: pois.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/pois', ${authGuard}async (c) => {`);
    lines.push(`  const { name, description, type, lat, lng, icon } = await c.req.json();`);
    lines.push(`  if (!name) return c.json({ error: 'name required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO pois (id, name, description, type, lat, lng, icon) VALUES (?, ?, ?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, name, description || '', type || 'amenity', lat || null, lng || null, icon || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    // Raffle
    lines.push(`// ============ RAFFLE ============`);
    lines.push(`app.post('/api/raffle/enter', async (c) => {`);
    lines.push(`  const { raffle_id, name, email, phone } = await c.req.json();`);
    lines.push(`  if (!raffle_id || !name || !email) return c.json({ error: 'raffle_id, name, email required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  const ticketNum = Math.random().toString(36).slice(2, 8).toUpperCase();`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO raffle_entries (id, user_id, raffle_id, ticket_number, name, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, user?.id || null, raffle_id, ticketNum, name, email, phone || null).run();`);
    lines.push(`  return c.json({ success: true, ticket_number: ticketNum });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/raffle/:raffleId/entries', ${authGuard}async (c) => {`);
    lines.push(`  const entries = await c.env.DB.prepare(`);
    lines.push(`    'SELECT * FROM raffle_entries WHERE raffle_id = ? ORDER BY created_at DESC'`);
    lines.push(`  ).bind(c.req.param('raffleId')).all();`);
    lines.push(`  return c.json({ entries: entries.results, count: entries.results.length });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/raffle/:raffleId/draw', ${authGuard}async (c) => {`);
    lines.push(`  const raffleId = c.req.param('raffleId');`);
    lines.push(`  const { count } = await c.req.json();`);
    lines.push(`  const numWinners = count || 1;`);
    lines.push(`  const eligible = await c.env.DB.prepare(`);
    lines.push(`    'SELECT * FROM raffle_entries WHERE raffle_id = ? AND drawn = 0'`);
    lines.push(`  ).bind(raffleId).all();`);
    lines.push(`  if (eligible.results.length === 0) return c.json({ error: 'No eligible entries' }, 400);`);
    lines.push(`  const entries = [...eligible.results];`);
    lines.push(`  for (let i = entries.length - 1; i > 0; i--) {`);
    lines.push(`    const j = Math.floor(Math.random() * (i + 1));`);
    lines.push(`    [entries[i], entries[j]] = [entries[j], entries[i]];`);
    lines.push(`  }`);
    lines.push(`  const winners = entries.slice(0, Math.min(numWinners, entries.length));`);
    lines.push(`  for (const w of winners) {`);
    lines.push(`    await c.env.DB.prepare('UPDATE raffle_entries SET drawn = 1, winner = 1 WHERE id = ?').bind((w as any).id).run();`);
    lines.push(`  }`);
    if (hasSms) {
      lines.push(`  if (c.env.TWILIO_ACCOUNT_SID) {`);
      lines.push(`    for (const w of winners) {`);
      lines.push(`      if ((w as any).phone) {`);
      lines.push(`        await sendSms(c.env, {`);
      lines.push(`          to: (w as any).phone,`);
      lines.push(`          message: \`Congratulations \${(w as any).name}! You won the raffle at ${config.branding.name.replace(/'/g, "\\'")}! See the info tent to claim your prize.\`,`);
      lines.push(`        }).catch(() => {});`);
      lines.push(`      }`);
      lines.push(`    }`);
      lines.push(`  }`);
    }
    lines.push(`  return c.json({ success: true, winners: winners.map((w: any) => ({ id: w.id, name: w.name, ticket_number: w.ticket_number })) });`);
    lines.push(`});`);
    lines.push('');

    // Schedule
    lines.push(`// ============ SCHEDULE ============`);
    lines.push(`app.get('/api/schedule', async (c) => {`);
    lines.push(`  const schedule = await c.env.DB.prepare(`);
    lines.push(`    "SELECT * FROM schedule WHERE active = 1 AND date >= date('now') ORDER BY date, start_time LIMIT 50"`);
    lines.push(`  ).all();`);
    lines.push(`  return c.json({ schedule: schedule.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/schedule', ${authGuard}async (c) => {`);
    lines.push(`  const { date, location, address, lat, lng, start_time, end_time, notes } = await c.req.json();`);
    lines.push(`  if (!date || !location) return c.json({ error: 'date and location required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO schedule (id, date, location, address, lat, lng, start_time, end_time, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, date, location, address || null, lat || null, lng || null, start_time || null, end_time || null, notes || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    // Alerts
    lines.push(`// ============ ALERTS ============`);
    lines.push(`app.get('/api/alerts', async (c) => {`);
    lines.push(`  const alerts = await c.env.DB.prepare(`);
    lines.push(`    "SELECT * FROM alerts WHERE active = 1 AND (expires_at IS NULL OR expires_at > datetime('now')) ORDER BY created_at DESC"`);
    lines.push(`  ).all();`);
    lines.push(`  return c.json({ alerts: alerts.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/alerts', ${authGuard}async (c) => {`);
    lines.push(`  const { title, message, type, expires_at } = await c.req.json();`);
    lines.push(`  if (!title || !message) return c.json({ error: 'title and message required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare(`);
    lines.push(`    'INSERT INTO alerts (id, title, message, type, expires_at) VALUES (?, ?, ?, ?, ?)'`);
    lines.push(`  ).bind(id, title, message, type || 'info', expires_at || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
  }

  // ========== WIREZ TEMPLATE ==========
  if (config.template === 'wirez') {
    const staffGuard = anyAuth ? 'requireRole(\'staff\'), ' : '';
    const adminGuard = anyAuth ? 'requireAdmin(), ' : '';

    lines.push(`// ============ CUSTOMERS ============`);
    lines.push(`app.get('/api/customers', ${staffGuard}async (c) => {`);
    lines.push(`  const q = c.req.query('q');`);
    lines.push(`  let sql = 'SELECT * FROM customers WHERE active = 1';`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (q) { sql += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)'; params.push(\`%\${q}%\`, \`%\${q}%\`, \`%\${q}%\`); }`);
    lines.push(`  sql += ' ORDER BY name LIMIT 100';`);
    lines.push(`  const customers = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ customers: customers.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/customers/:id', ${staffGuard}async (c) => {`);
    lines.push(`  const customer = await c.env.DB.prepare('SELECT * FROM customers WHERE id = ?').bind(c.req.param('id')).first();`);
    lines.push(`  if (!customer) return c.json({ error: 'Not found' }, 404);`);
    lines.push(`  const jobs = await c.env.DB.prepare('SELECT id, job_number, title, status, scheduled_date, quote_total, invoice_total FROM jobs WHERE customer_id = ? ORDER BY created_at DESC').bind(c.req.param('id')).all();`);
    lines.push(`  return c.json({ customer, jobs: jobs.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/customers', ${staffGuard}async (c) => {`);
    lines.push(`  const { name, company, email, phone, address, suburb, state, postcode, notes } = await c.req.json();`);
    lines.push(`  if (!name) return c.json({ error: 'name required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO customers (id, name, company, email, phone, address, suburb, state, postcode, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, name, company || null, email || null, phone || null, address || null, suburb || null, state || 'QLD', postcode || null, notes || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/customers/:id', ${staffGuard}async (c) => {`);
    lines.push(`  const id = c.req.param('id');`);
    lines.push(`  const body = await c.req.json();`);
    lines.push(`  const fields: string[] = []; const values: any[] = [];`);
    lines.push(`  for (const [k, v] of Object.entries(body)) { if (k === 'id') continue; fields.push(\`\${k} = ?\`); values.push(v); }`);
    lines.push(`  fields.push("updated_at = datetime('now')"); values.push(id);`);
    lines.push(`  await c.env.DB.prepare(\`UPDATE customers SET \${fields.join(', ')} WHERE id = ?\`).bind(...values).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ JOBS ============`);
    lines.push(`app.get('/api/jobs', ${staffGuard}async (c) => {`);
    lines.push(`  const status = c.req.query('status');`);
    lines.push(`  const assignedTo = c.req.query('assigned_to');`);
    lines.push(`  let sql = 'SELECT j.*, c.name as customer_name FROM jobs j LEFT JOIN customers c ON j.customer_id = c.id WHERE 1=1';`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (status) { sql += ' AND j.status = ?'; params.push(status); }`);
    lines.push(`  if (assignedTo) { sql += ' AND j.assigned_to = ?'; params.push(assignedTo); }`);
    lines.push(`  sql += ' ORDER BY j.scheduled_date DESC, j.created_at DESC LIMIT 100';`);
    lines.push(`  const jobs = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ jobs: jobs.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/jobs/:id', ${staffGuard}async (c) => {`);
    lines.push(`  const job = await c.env.DB.prepare('SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone FROM jobs j LEFT JOIN customers c ON j.customer_id = c.id WHERE j.id = ?').bind(c.req.param('id')).first();`);
    lines.push(`  if (!job) return c.json({ error: 'Not found' }, 404);`);
    lines.push(`  const timeEntries = await c.env.DB.prepare('SELECT * FROM job_time_entries WHERE job_id = ? ORDER BY start_time DESC').bind(c.req.param('id')).all();`);
    lines.push(`  const materials = await c.env.DB.prepare('SELECT * FROM job_materials WHERE job_id = ? ORDER BY created_at').bind(c.req.param('id')).all();`);
    lines.push(`  const notes = await c.env.DB.prepare('SELECT * FROM job_notes WHERE job_id = ? ORDER BY created_at DESC').bind(c.req.param('id')).all();`);
    lines.push(`  return c.json({ job, timeEntries: timeEntries.results, materials: materials.results, notes: notes.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/jobs', ${staffGuard}async (c) => {`);
    lines.push(`  const { customer_id, title, description, type, priority, assigned_to, scheduled_date, scheduled_time, address, suburb, state, postcode } = await c.req.json();`);
    lines.push(`  if (!title) return c.json({ error: 'title required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  // Get next job number`);
    lines.push(`  const seq = await c.env.DB.prepare('UPDATE job_sequences SET next_val = next_val + 1 WHERE key = ? RETURNING next_val').bind('job_number').first() as any;`);
    lines.push(`  const jobNumber = \`J\${(seq?.next_val - 1 || 1001).toString().padStart(4, '0')}\`;`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO jobs (id, job_number, customer_id, title, description, type, priority, assigned_to, scheduled_date, scheduled_time, address, suburb, state, postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, jobNumber, customer_id || null, title, description || null, type || 'residential', priority || 'normal', assigned_to || null, scheduled_date || null, scheduled_time || null, address || null, suburb || null, state || 'QLD', postcode || null).run();`);
    lines.push(`  return c.json({ success: true, id, job_number: jobNumber });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/jobs/:id/status', ${staffGuard}async (c) => {`);
    lines.push(`  const { status } = await c.req.json();`);
    lines.push(`  const validStatuses = ['quote', 'scheduled', 'in-progress', 'completed', 'invoiced', 'cancelled'];`);
    lines.push(`  if (!validStatuses.includes(status)) return c.json({ error: 'Invalid status' }, 400);`);
    lines.push(`  const updates: Record<string, any> = { status };`);
    lines.push(`  if (status === 'completed') updates.completed_at = "datetime('now')";`);
    lines.push(`  await c.env.DB.prepare("UPDATE jobs SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ TIME TRACKING ============`);
    lines.push(`app.post('/api/jobs/:id/time', ${staffGuard}async (c) => {`);
    lines.push(`  const { start_time, end_time, duration_mins, notes, billable } = await c.req.json();`);
    lines.push(`  if (!start_time) return c.json({ error: 'start_time required' }, 400);`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  let dur = duration_mins;`);
    lines.push(`  if (!dur && end_time) { dur = Math.round((new Date(end_time).getTime() - new Date(start_time).getTime()) / 60000); }`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO job_time_entries (id, job_id, user_id, start_time, end_time, duration_mins, notes, billable) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, c.req.param('id'), user?.id || null, start_time, end_time || null, dur || null, notes || null, billable !== false ? 1 : 0).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ MATERIALS ============`);
    lines.push(`app.post('/api/jobs/:id/materials', ${staffGuard}async (c) => {`);
    lines.push(`  const { description, quantity, unit_cost, supplier, part_number } = await c.req.json();`);
    lines.push(`  if (!description) return c.json({ error: 'description required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  const qty = quantity || 1;`);
    lines.push(`  const total = unit_cost ? Math.round(unit_cost * qty) : null;`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO job_materials (id, job_id, description, quantity, unit_cost, total_cost, supplier, part_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, c.req.param('id'), description, qty, unit_cost || null, total, supplier || null, part_number || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ JOB NOTES ============`);
    lines.push(`app.post('/api/jobs/:id/notes', ${staffGuard}async (c) => {`);
    lines.push(`  const { note, type, file_url } = await c.req.json();`);
    lines.push(`  if (!note) return c.json({ error: 'note required' }, 400);`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO job_notes (id, job_id, user_id, note, type, file_url) VALUES (?, ?, ?, ?, ?, ?)').bind(id, c.req.param('id'), user?.id || null, note, type || 'general', file_url || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ INVOICES ============`);
    lines.push(`app.get('/api/invoices', ${staffGuard}async (c) => {`);
    lines.push(`  const status = c.req.query('status');`);
    lines.push(`  let sql = 'SELECT i.*, c.name as customer_name, j.job_number FROM invoices i LEFT JOIN customers c ON i.customer_id = c.id LEFT JOIN jobs j ON i.job_id = j.id WHERE 1=1';`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (status) { sql += ' AND i.status = ?'; params.push(status); }`);
    lines.push(`  sql += ' ORDER BY i.created_at DESC LIMIT 100';`);
    lines.push(`  const invoices = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ invoices: invoices.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/invoices', ${staffGuard}async (c) => {`);
    lines.push(`  const { job_id, customer_id, items, due_date, notes } = await c.req.json();`);
    lines.push(`  if (!items || !Array.isArray(items) || items.length === 0) return c.json({ error: 'items array required' }, 400);`);
    lines.push(`  const invId = crypto.randomUUID();`);
    lines.push(`  const seq = await c.env.DB.prepare('UPDATE invoice_sequences SET next_val = next_val + 1 WHERE key = ? RETURNING next_val').bind('invoice_number').first() as any;`);
    lines.push(`  const invNumber = \`INV-\${(seq?.next_val - 1 || 1001).toString().padStart(4, '0')}\`;`);
    lines.push(`  let subtotal = 0;`);
    lines.push(`  for (const item of items) { subtotal += (item.unit_price || 0) * (item.quantity || 1); }`);
    lines.push(`  const gst = Math.round(subtotal * 0.1);`);
    lines.push(`  const total = subtotal + gst;`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO invoices (id, invoice_number, job_id, customer_id, subtotal, gst, total, due_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(invId, invNumber, job_id || null, customer_id || null, subtotal, gst, total, due_date || null, notes || null).run();`);
    lines.push(`  for (const item of items) {`);
    lines.push(`    const itemId = crypto.randomUUID();`);
    lines.push(`    const itemTotal = Math.round((item.unit_price || 0) * (item.quantity || 1));`);
    lines.push(`    await c.env.DB.prepare('INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?, ?)').bind(itemId, invId, item.description, item.quantity || 1, item.unit_price || 0, itemTotal).run();`);
    lines.push(`  }`);
    if (hasEmail) {
      lines.push(`  // Email invoice to customer`);
      lines.push(`  const customer = customer_id ? await c.env.DB.prepare('SELECT * FROM customers WHERE id = ?').bind(customer_id).first() as any : null;`);
      lines.push(`  if (customer?.email && c.env.RESEND_API_KEY) {`);
      lines.push(`    await sendEmail(c.env, {`);
      lines.push(`      to: customer.email,`);
      lines.push(`      subject: \`Invoice \${invNumber} from ${JSON.stringify(config.branding.name).slice(1, -1)}\`,`);
      lines.push(`      html: emailTemplate(${JSON.stringify(config.branding.name)}, '${config.branding.color}', \``);
      lines.push(`        <h2>Invoice \${invNumber}</h2>`);
      lines.push(`        <p>Dear \${customer.name},</p>`);
      lines.push(`        <p>Please find your invoice details below.</p>`);
      lines.push(`        <table style="width:100%;border-collapse:collapse;">`);
      lines.push(`        \${items.map((item: any) => \`<tr><td>\${item.description}</td><td>x\${item.quantity}</td><td>$\${((item.unit_price||0)/100).toFixed(2)}</td></tr>\`).join('')}`);
      lines.push(`        </table>`);
      lines.push(`        <hr/><p><strong>Subtotal:</strong> $\${(subtotal/100).toFixed(2)}<br/><strong>GST (10%):</strong> $\${(gst/100).toFixed(2)}<br/><strong>Total:</strong> $\${(total/100).toFixed(2)}</p>\`),`);
      lines.push(`      template: 'invoice',`);
      lines.push(`    }).catch(() => {});`);
      lines.push(`  }`);
    }
    lines.push(`  return c.json({ success: true, id: invId, invoice_number: invNumber, total });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/invoices/:id/status', ${staffGuard}async (c) => {`);
    lines.push(`  const { status, payment_ref } = await c.req.json();`);
    lines.push(`  const valid = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];`);
    lines.push(`  if (!valid.includes(status)) return c.json({ error: 'Invalid status' }, 400);`);
    lines.push(`  await c.env.DB.prepare("UPDATE invoices SET status = ?, payment_ref = ?, paid_at = CASE WHEN ? = 'paid' THEN datetime('now') ELSE paid_at END, updated_at = datetime('now') WHERE id = ?").bind(status, payment_ref || null, status, c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    // Staff management
    lines.push(`// ============ STAFF ============`);
    lines.push(`app.get('/api/staff', ${adminGuard}async (c) => {`);
    lines.push(`  const staff = await c.env.DB.prepare('SELECT * FROM staff WHERE active = 1 ORDER BY name').all();`);
    lines.push(`  return c.json({ staff: staff.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/staff', ${adminGuard}async (c) => {`);
    lines.push(`  const { name, email, phone, role, licence_number, licence_expiry } = await c.req.json();`);
    lines.push(`  if (!name) return c.json({ error: 'name required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO staff (id, name, email, phone, role, licence_number, licence_expiry) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, name, email || null, phone || null, role || 'technician', licence_number || null, licence_expiry || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
  }

  // ========== O'CONNOR DELIVERY TEMPLATE ==========
  if (config.template === 'oconnor') {
    const staffGuard = anyAuth ? 'requireRole(\'staff\'), ' : '';
    const adminGuard = anyAuth ? 'requireAdmin(), ' : '';
    const authGuard = anyAuth ? 'requireAuth(), ' : '';

    lines.push(`// ============ CUSTOMERS ============`);
    lines.push(`app.get('/api/customers', ${staffGuard}async (c) => {`);
    lines.push(`  const q = c.req.query('q');`);
    lines.push(`  let sql = 'SELECT * FROM customers WHERE active = 1';`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (q) { sql += ' AND (name LIKE ? OR email LIKE ? OR suburb LIKE ?)'; params.push(\`%\${q}%\`, \`%\${q}%\`, \`%\${q}%\`); }`);
    lines.push(`  sql += ' ORDER BY name LIMIT 200';`);
    lines.push(`  const customers = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ customers: customers.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/customers', ${adminGuard}async (c) => {`);
    lines.push(`  const { name, email, phone, address, suburb, state, postcode, delivery_notes } = await c.req.json();`);
    lines.push(`  if (!name || !email) return c.json({ error: 'name and email required' }, 400);`);
    lines.push(`  const existing = await c.env.DB.prepare('SELECT id FROM customers WHERE email = ?').bind(email.toLowerCase()).first();`);
    lines.push(`  if (existing) return c.json({ error: 'Customer already exists' }, 409);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO customers (id, name, email, phone, address, suburb, state, postcode, delivery_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, name, email.toLowerCase(), phone || null, address || null, suburb || null, state || 'QLD', postcode || null, delivery_notes || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ PRODUCTS ============`);
    lines.push(`app.get('/api/products', async (c) => {`);
    lines.push(`  const category = c.req.query('category');`);
    lines.push(`  let sql = 'SELECT * FROM products WHERE active = 1';`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (category) { sql += ' AND category = ?'; params.push(category); }`);
    lines.push(`  sql += ' ORDER BY sort_order, name';`);
    lines.push(`  const products = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ products: products.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/products', ${adminGuard}async (c) => {`);
    lines.push(`  const { name, description, price, unit, image_url, category } = await c.req.json();`);
    lines.push(`  if (!name || !price) return c.json({ error: 'name and price required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO products (id, name, description, price, unit, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, name, description || null, price, unit || 'kg', image_url || null, category || 'beef').run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ ORDERS ============`);
    lines.push(`app.get('/api/orders', ${staffGuard}async (c) => {`);
    lines.push(`  const delivDate = c.req.query('delivery_date');`);
    lines.push(`  const status = c.req.query('status');`);
    lines.push(`  let sql = 'SELECT o.*, c.name as customer_name, c.address, c.suburb, c.phone FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE 1=1';`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (delivDate) { sql += ' AND o.delivery_date = ?'; params.push(delivDate); }`);
    lines.push(`  if (status) { sql += ' AND o.status = ?'; params.push(status); }`);
    lines.push(`  sql += ' ORDER BY o.delivery_date DESC, c.suburb, c.name LIMIT 200';`);
    lines.push(`  const orders = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ orders: orders.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/orders', ${authGuard}async (c) => {`);
    lines.push(`  const { customer_id, delivery_date, delivery_window, items, delivery_notes } = await c.req.json();`);
    lines.push(`  if (!customer_id || !items || !Array.isArray(items) || items.length === 0) return c.json({ error: 'customer_id and items required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  let subtotal = 0;`);
    lines.push(`  for (const item of items) { subtotal += (item.price || 0) * (item.quantity || 0); }`);
    lines.push(`  const gst = Math.round(subtotal * 0.1);`);
    lines.push(`  const total = subtotal + gst;`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO orders (id, customer_id, delivery_date, delivery_window, subtotal, gst, total, delivery_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, customer_id, delivery_date || null, delivery_window || null, subtotal, gst, total, delivery_notes || null).run();`);
    lines.push(`  for (const item of items) {`);
    lines.push(`    const iid = crypto.randomUUID();`);
    lines.push(`    await c.env.DB.prepare('INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?, ?)').bind(iid, id, item.product_id, item.quantity, item.price, Math.round(item.price * item.quantity)).run();`);
    lines.push(`  }`);
    if (hasEmail) {
      lines.push(`  const customer = await c.env.DB.prepare('SELECT * FROM customers WHERE id = ?').bind(customer_id).first() as any;`);
      lines.push(`  if (customer?.email && c.env.RESEND_API_KEY) {`);
      lines.push(`    await sendEmail(c.env, {`);
      lines.push(`      to: customer.email,`);
      lines.push(`      subject: \`Order confirmed - delivery on \${delivery_date || 'TBC'}\`,`);
      lines.push(`      html: emailTemplate(${JSON.stringify(config.branding.name)}, '${config.branding.color}', \``);
      lines.push(`        <h2>Order Confirmed</h2>`);
      lines.push(`        <p>Thanks \${customer.name}! Your order is confirmed for delivery on \${delivery_date || 'TBC'}.</p>`);
      lines.push(`        <p><strong>Total:</strong> $\${(total/100).toFixed(2)}</p>\`),`);
      lines.push(`      template: 'order-confirmation',`);
      lines.push(`    }).catch(() => {});`);
      lines.push(`  }`);
    }
    lines.push(`  return c.json({ success: true, id, total });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/orders/:id/status', ${staffGuard}async (c) => {`);
    lines.push(`  const { status, driver_notes } = await c.req.json();`);
    lines.push(`  const valid = ['pending', 'confirmed', 'picking', 'out-for-delivery', 'delivered', 'cancelled'];`);
    lines.push(`  if (!valid.includes(status)) return c.json({ error: 'Invalid status' }, 400);`);
    lines.push(`  await c.env.DB.prepare("UPDATE orders SET status = ?, driver_notes = COALESCE(?, driver_notes), updated_at = datetime('now') WHERE id = ?").bind(status, driver_notes || null, c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ DELIVERY RUNS ============`);
    lines.push(`app.get('/api/runs', ${staffGuard}async (c) => {`);
    lines.push(`  const runDate = c.req.query('date') || new Date().toISOString().split('T')[0];`);
    lines.push(`  const runs = await c.env.DB.prepare('SELECT r.*, COUNT(s.id) as stop_count FROM delivery_runs r LEFT JOIN delivery_stops s ON s.run_id = r.id WHERE r.run_date = ? GROUP BY r.id').bind(runDate).all();`);
    lines.push(`  return c.json({ runs: runs.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/runs', ${staffGuard}async (c) => {`);
    lines.push(`  const { run_date, driver_id, notes } = await c.req.json();`);
    lines.push(`  if (!run_date) return c.json({ error: 'run_date required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO delivery_runs (id, run_date, driver_id, notes) VALUES (?, ?, ?, ?)').bind(id, run_date, driver_id || null, notes || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/runs/:id/stops', ${staffGuard}async (c) => {`);
    lines.push(`  const { order_ids } = await c.req.json();`);
    lines.push(`  if (!Array.isArray(order_ids)) return c.json({ error: 'order_ids array required' }, 400);`);
    lines.push(`  for (let i = 0; i < order_ids.length; i++) {`);
    lines.push(`    const sid = crypto.randomUUID();`);
    lines.push(`    await c.env.DB.prepare('INSERT OR IGNORE INTO delivery_stops (id, run_id, order_id, stop_order) VALUES (?, ?, ?, ?)').bind(sid, c.req.param('id'), order_ids[i], i + 1).run();`);
    lines.push(`  }`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/stops/:id/complete', ${staffGuard}async (c) => {`);
    lines.push(`  const { signature_url, notes } = await c.req.json();`);
    lines.push(`  await c.env.DB.prepare("UPDATE delivery_stops SET status = 'completed', completed_at = datetime('now'), signature_url = ?, notes = ? WHERE id = ?").bind(signature_url || null, notes || null, c.req.param('id')).run();`);
    lines.push(`  // Also update order status`);
    lines.push(`  const stop = await c.env.DB.prepare('SELECT order_id FROM delivery_stops WHERE id = ?').bind(c.req.param('id')).first() as any;`);
    lines.push(`  if (stop?.order_id) await c.env.DB.prepare("UPDATE orders SET status = 'delivered', updated_at = datetime('now') WHERE id = ?").bind(stop.order_id).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ SUBSCRIPTIONS ============`);
    lines.push(`app.get('/api/subscriptions', ${staffGuard}async (c) => {`);
    lines.push(`  const subs = await c.env.DB.prepare('SELECT s.*, c.name as customer_name, c.email FROM subscriptions s LEFT JOIN customers c ON s.customer_id = c.id WHERE s.status = ? ORDER BY s.next_delivery_date').bind('active').all();`);
    lines.push(`  return c.json({ subscriptions: subs.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/subscriptions', ${authGuard}async (c) => {`);
    lines.push(`  const { customer_id, frequency, next_delivery_date, items } = await c.req.json();`);
    lines.push(`  if (!customer_id || !items) return c.json({ error: 'customer_id and items required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO subscriptions (id, customer_id, frequency, next_delivery_date, items) VALUES (?, ?, ?, ?, ?)').bind(id, customer_id, frequency || 'weekly', next_delivery_date || null, JSON.stringify(items)).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ DRIVER LOCATION ============`);
    lines.push(`app.post('/api/driver/location', ${authGuard}async (c) => {`);
    lines.push(`  const { lat, lng, run_id } = await c.req.json();`);
    lines.push(`  if (!lat || !lng) return c.json({ error: 'lat and lng required' }, 400);`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO driver_locations (id, driver_id, run_id, lat, lng) VALUES (?, ?, ?, ?, ?)').bind(id, user?.id, run_id || null, lat, lng).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
  }

  // ========== AUTOHUE TEMPLATE ==========
  if (config.template === 'autohue') {
    const adminGuard = anyAuth ? 'requireAdmin(), ' : '';

    lines.push(`// ============ LICENSE MANAGEMENT ============`);
    lines.push(`app.post('/api/licenses/validate', async (c) => {`);
    lines.push(`  const { license_key, machine_id, machine_name, platform, app_version } = await c.req.json();`);
    lines.push(`  if (!license_key || !machine_id) return c.json({ error: 'license_key and machine_id required' }, 400);`);
    lines.push(`  const license = await c.env.DB.prepare('SELECT l.*, p.max_activations as product_max FROM licenses l LEFT JOIN products p ON l.product_id = p.id WHERE l.license_key = ? AND l.status = ?').bind(license_key, 'active').first() as any;`);
    lines.push(`  if (!license) return c.json({ valid: false, error: 'License not found or inactive' }, 404);`);
    lines.push(`  if (license.expires_at && new Date(license.expires_at) < new Date()) return c.json({ valid: false, error: 'License expired' });`);
    lines.push(`  // Check existing activation for this machine`);
    lines.push(`  const existing = await c.env.DB.prepare('SELECT id FROM activations WHERE license_id = ? AND machine_id = ? AND active = 1').bind(license.id, machine_id).first();`);
    lines.push(`  if (!existing) {`);
    lines.push(`    const maxAct = license.max_activations || license.product_max || 1;`);
    lines.push(`    if (license.activation_count >= maxAct) return c.json({ valid: false, error: \`Maximum activations reached (\${maxAct})\` });`);
    lines.push(`    const actId = crypto.randomUUID();`);
    lines.push(`    await c.env.DB.prepare('INSERT INTO activations (id, license_id, machine_id, machine_name, platform, app_version) VALUES (?, ?, ?, ?, ?, ?)').bind(actId, license.id, machine_id, machine_name || null, platform || null, app_version || null).run();`);
    lines.push(`    await c.env.DB.prepare("UPDATE licenses SET activation_count = activation_count + 1, updated_at = datetime('now') WHERE id = ?").bind(license.id).run();`);
    lines.push(`  } else {`);
    lines.push(`    await c.env.DB.prepare("UPDATE activations SET last_seen = datetime('now'), app_version = ? WHERE license_id = ? AND machine_id = ?").bind(app_version || null, license.id, machine_id).run();`);
    lines.push(`  }`);
    lines.push(`  return c.json({ valid: true, license: { key: license_key, email: license.customer_email, name: license.customer_name } });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`app.post('/api/licenses/deactivate', async (c) => {`);
    lines.push(`  const { license_key, machine_id } = await c.req.json();`);
    lines.push(`  if (!license_key || !machine_id) return c.json({ error: 'license_key and machine_id required' }, 400);`);
    lines.push(`  const license = await c.env.DB.prepare('SELECT id, activation_count FROM licenses WHERE license_key = ?').bind(license_key).first() as any;`);
    lines.push(`  if (!license) return c.json({ error: 'License not found' }, 404);`);
    lines.push(`  await c.env.DB.prepare('UPDATE activations SET active = 0 WHERE license_id = ? AND machine_id = ?').bind(license.id, machine_id).run();`);
    lines.push(`  await c.env.DB.prepare("UPDATE licenses SET activation_count = MAX(0, activation_count - 1), updated_at = datetime('now') WHERE id = ?").bind(license.id).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ RELEASES & DOWNLOADS ============`);
    lines.push(`app.get('/api/releases/latest', async (c) => {`);
    lines.push(`  const platform = c.req.query('platform') || 'win';`);
    lines.push(`  const channel = c.req.query('channel') || 'stable';`);
    lines.push(`  const release = await c.env.DB.prepare('SELECT id, version, platform, channel, file_name, file_size, sha256, changelog, created_at FROM releases WHERE platform = ? AND channel = ? AND active = 1 ORDER BY created_at DESC LIMIT 1').bind(platform, channel).first();`);
    lines.push(`  if (!release) return c.json({ error: 'No release found' }, 404);`);
    lines.push(`  return c.json({ release });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/releases/download/:id', async (c) => {`);
    lines.push(`  const { license_key, machine_id } = c.req.query() as Record<string, string>;`);
    lines.push(`  if (!license_key) return c.json({ error: 'license_key required' }, 400);`);
    lines.push(`  const license = await c.env.DB.prepare('SELECT id, status FROM licenses WHERE license_key = ?').bind(license_key).first() as any;`);
    lines.push(`  if (!license || license.status !== 'active') return c.json({ error: 'Invalid license' }, 403);`);
    lines.push(`  const release = await c.env.DB.prepare('SELECT * FROM releases WHERE id = ? AND active = 1').bind(c.req.param('id')).first() as any;`);
    lines.push(`  if (!release) return c.json({ error: 'Release not found' }, 404);`);
    lines.push(`  // Log download`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO download_log (id, license_id, release_id, machine_id) VALUES (?, ?, ?, ?)').bind(crypto.randomUUID(), license.id, release.id, machine_id || null).run();`);
    if (config.features.some(f => f.includes('r2') || f.includes('storage'))) {
      lines.push(`  // Generate presigned R2 URL — RELEASES_BUCKET must be bound`);
      lines.push(`  const url = await (c.env as any).RELEASES.createPresignedUrl(release.r2_key, { expiresIn: 3600 });`);
      lines.push(`  return c.json({ url, version: release.version, sha256: release.sha256 });`);
    } else {
      lines.push(`  // Return R2 key (caller generates download URL separately if needed)`);
      lines.push(`  return c.json({ r2_key: release.r2_key, version: release.version, sha256: release.sha256 });`);
    }
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ ADMIN — LICENSE MANAGEMENT ============`);
    lines.push(`app.get('/api/admin/licenses', ${adminGuard}async (c) => {`);
    lines.push(`  const licenses = await c.env.DB.prepare('SELECT l.*, p.name as product_name FROM licenses l LEFT JOIN products p ON l.product_id = p.id ORDER BY l.created_at DESC LIMIT 200').all();`);
    lines.push(`  return c.json({ licenses: licenses.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/admin/licenses', ${adminGuard}async (c) => {`);
    lines.push(`  const { product_id, customer_email, customer_name, max_activations, expires_at } = await c.req.json();`);
    lines.push(`  if (!customer_email) return c.json({ error: 'customer_email required' }, 400);`);
    lines.push(`  const prodId = product_id || 'default-product';`);
    lines.push(`  // Generate a readable license key: XXXX-XXXX-XXXX-XXXX`);
    lines.push(`  const raw = crypto.randomUUID().replace(/-/g, '').toUpperCase();`);
    lines.push(`  const licenseKey = \`\${raw.slice(0,4)}-\${raw.slice(4,8)}-\${raw.slice(8,12)}-\${raw.slice(12,16)}\`;`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO licenses (id, license_key, product_id, customer_email, customer_name, max_activations, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, licenseKey, prodId, customer_email.toLowerCase(), customer_name || null, max_activations || 1, expires_at || null).run();`);
    if (hasEmail) {
      lines.push(`  if (c.env.RESEND_API_KEY) {`);
      lines.push(`    await sendEmail(c.env, {`);
      lines.push(`      to: customer_email,`);
      lines.push(`      subject: \`Your ${JSON.stringify(config.branding.name).slice(1, -1)} License Key\`,`);
      lines.push(`      html: emailTemplate(${JSON.stringify(config.branding.name)}, '${config.branding.color}', \``);
      lines.push(`        <h2>Thank You for Your Purchase!</h2>`);
      lines.push(`        <p>Your license key is:</p>`);
      lines.push(`        <div style="background:#f3f4f6;padding:20px;border-radius:8px;text-align:center;font-size:24px;font-family:monospace;letter-spacing:4px;font-weight:bold;">`);
      lines.push(`          \${licenseKey}`);
      lines.push(`        </div>`);
      lines.push(`        <p>Enter this key when prompted on first launch. You can activate on up to \${max_activations || 1} machine(s).</p>\`),`);
      lines.push(`      template: 'license-delivery',`);
      lines.push(`    }).catch(() => {});`);
      lines.push(`  }`);
    }
    lines.push(`  return c.json({ success: true, id, license_key: licenseKey });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.delete('/api/admin/licenses/:id/activations', ${adminGuard}async (c) => {`);
    lines.push(`  const { machine_id } = await c.req.json();`);
    lines.push(`  const license = await c.env.DB.prepare('SELECT id, activation_count FROM licenses WHERE id = ?').bind(c.req.param('id')).first() as any;`);
    lines.push(`  if (!license) return c.json({ error: 'License not found' }, 404);`);
    lines.push(`  if (machine_id) {`);
    lines.push(`    await c.env.DB.prepare('UPDATE activations SET active = 0 WHERE license_id = ? AND machine_id = ?').bind(license.id, machine_id).run();`);
    lines.push(`    await c.env.DB.prepare("UPDATE licenses SET activation_count = MAX(0, activation_count - 1), updated_at = datetime('now') WHERE id = ?").bind(license.id).run();`);
    lines.push(`  } else {`);
    lines.push(`    await c.env.DB.prepare('UPDATE activations SET active = 0 WHERE license_id = ?').bind(license.id).run();`);
    lines.push(`    await c.env.DB.prepare("UPDATE licenses SET activation_count = 0, updated_at = datetime('now') WHERE id = ?").bind(license.id).run();`);
    lines.push(`  }`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ RELEASE MANAGEMENT ============`);
    lines.push(`app.post('/api/admin/releases', ${adminGuard}async (c) => {`);
    lines.push(`  const { version, platform, channel, r2_key, file_name, file_size, sha256, changelog, min_license_date } = await c.req.json();`);
    lines.push(`  if (!version || !platform || !r2_key) return c.json({ error: 'version, platform, r2_key required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO releases (id, version, platform, channel, r2_key, file_name, file_size, sha256, changelog, min_license_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, version, platform, channel || 'stable', r2_key, file_name || null, file_size || null, sha256 || null, changelog || null, min_license_date || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');

    // Cron: cleanup expired tokens if auth-bearer present
    if (hasAuthBearer) {
      lines.push(`// ============ CRON HANDLER ============`);
      lines.push(`export default {`);
      lines.push(`  fetch: app.fetch,`);
      lines.push(`  async scheduled(_event: ScheduledEvent, env: any, _ctx: ExecutionContext) {`);
      lines.push(`    await cleanupExpiredTokens(env.DB);`);
      lines.push(`  },`);
      lines.push(`};`);
      return lines.join('\n');
    }
  }

  // Cron handler for auth-bearer — templates that handle their own export are excluded
  if (hasAuthBearer && !['autohue', 'aussie-saver', 'socialai'].includes(config.template)) {
    lines.push(`// ============ CRON HANDLER ============`);
    lines.push(`export default {`);
    lines.push(`  fetch: app.fetch,`);
    lines.push(`  async scheduled(_event: ScheduledEvent, env: any, _ctx: ExecutionContext) {`);
    lines.push(`    await cleanupExpiredTokens(env.DB);`);
    lines.push(`  },`);
    lines.push(`};`);
    return lines.join('\n');
  }

  // ========== AUSSIE SAVER TEMPLATE ==========
  if (config.template === 'aussie-saver') {
    const authGuard = anyAuth ? 'requireAuth(), ' : '';
    const adminGuard = anyAuth ? 'requireAdmin(), ' : '';

    lines.push(`// ============ FUEL STATIONS ============`);
    lines.push(`app.get('/api/stations', async (c) => {`);
    lines.push(`  const { suburb, state, brand, q } = c.req.query() as Record<string, string>;`);
    lines.push(`  let sql = 'SELECT * FROM fuel_stations WHERE active = 1';`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (suburb) { sql += ' AND suburb LIKE ?'; params.push(\`%\${suburb}%\`); }`);
    lines.push(`  if (state) { sql += ' AND state = ?'; params.push(state.toUpperCase()); }`);
    lines.push(`  if (brand) { sql += ' AND brand = ?'; params.push(brand); }`);
    lines.push(`  if (q) { sql += ' AND (name LIKE ? OR address LIKE ? OR suburb LIKE ?)'; params.push(\`%\${q}%\`, \`%\${q}%\`, \`%\${q}%\`); }`);
    lines.push(`  sql += ' ORDER BY suburb, name LIMIT 100';`);
    lines.push(`  const stations = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ stations: stations.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/stations/:id', async (c) => {`);
    lines.push(`  const station = await c.env.DB.prepare('SELECT * FROM fuel_stations WHERE id = ? AND active = 1').bind(c.req.param('id')).first();`);
    lines.push(`  if (!station) return c.json({ error: 'Not found' }, 404);`);
    lines.push(`  const prices = await c.env.DB.prepare(`);
    lines.push(`    'SELECT fuel_type, price_cents, reported_by, confirmed_count, reported_at FROM fuel_prices WHERE station_id = ? ORDER BY fuel_type, reported_at DESC'`);
    lines.push(`  ).bind(c.req.param('id')).all();`);
    lines.push(`  // Keep only latest per fuel type`);
    lines.push(`  const latest: Record<string, any> = {};`);
    lines.push(`  for (const p of prices.results) { if (!latest[(p as any).fuel_type]) latest[(p as any).fuel_type] = p; }`);
    lines.push(`  return c.json({ station, prices: Object.values(latest) });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/stations', ${adminGuard}async (c) => {`);
    lines.push(`  const { name, brand, address, suburb, state, postcode, lat, lng, phone } = await c.req.json();`);
    lines.push(`  if (!name || !suburb) return c.json({ error: 'name and suburb required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO fuel_stations (id, name, brand, address, suburb, state, postcode, lat, lng, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, name, brand || null, address || null, suburb, state || 'QLD', postcode || null, lat || null, lng || null, phone || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/stations/:id', ${adminGuard}async (c) => {`);
    lines.push(`  const id = c.req.param('id');`);
    lines.push(`  const body = await c.req.json();`);
    lines.push(`  const fields: string[] = []; const values: any[] = [];`);
    lines.push(`  for (const [k, v] of Object.entries(body)) { if (k === 'id') continue; fields.push(\`\${k} = ?\`); values.push(v); }`);
    lines.push(`  fields.push("updated_at = datetime('now')"); values.push(id);`);
    lines.push(`  await c.env.DB.prepare(\`UPDATE fuel_stations SET \${fields.join(', ')} WHERE id = ?\`).bind(...values).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ FUEL PRICES ============`);
    lines.push(`app.post('/api/stations/:id/prices', async (c) => {`);
    lines.push(`  const { fuel_type, price_cents } = await c.req.json();`);
    lines.push(`  if (!fuel_type || !price_cents) return c.json({ error: 'fuel_type and price_cents required' }, 400);`);
    lines.push(`  const validTypes = ['ULP91', 'ULP95', 'ULP98', 'Diesel', 'LPG', 'E10', 'Premium'];`);
    lines.push(`  if (!validTypes.includes(fuel_type)) return c.json({ error: \`fuel_type must be one of: \${validTypes.join(', ')}\` }, 400);`);
    lines.push(`  const station = await c.env.DB.prepare('SELECT id FROM fuel_stations WHERE id = ? AND active = 1').bind(c.req.param('id')).first();`);
    lines.push(`  if (!station) return c.json({ error: 'Station not found' }, 404);`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO fuel_prices (id, station_id, fuel_type, price_cents, reported_by) VALUES (?, ?, ?, ?, ?)').bind(id, c.req.param('id'), fuel_type, price_cents, user?.id || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/prices/:id/confirm', async (c) => {`);
    lines.push(`  await c.env.DB.prepare('UPDATE fuel_prices SET confirmed_count = confirmed_count + 1 WHERE id = ?').bind(c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/prices/compare', async (c) => {`);
    lines.push(`  const { fuel_type, suburb, state } = c.req.query() as Record<string, string>;`);
    lines.push(`  if (!fuel_type) return c.json({ error: 'fuel_type required' }, 400);`);
    lines.push(`  let sql = "SELECT s.id, s.name, s.brand, s.suburb, s.state, s.address, s.lat, s.lng, fp.price_cents, fp.reported_at, fp.confirmed_count FROM fuel_prices fp JOIN fuel_stations s ON s.id = fp.station_id WHERE fp.fuel_type = ? AND s.active = 1 AND fp.reported_at >= datetime('now', '-24 hours')";`);
    lines.push(`  const params: any[] = [fuel_type];`);
    lines.push(`  if (suburb) { sql += ' AND s.suburb LIKE ?'; params.push(\`%\${suburb}%\`); }`);
    lines.push(`  if (state) { sql += ' AND s.state = ?'; params.push(state.toUpperCase()); }`);
    lines.push(`  sql += ' ORDER BY fp.price_cents ASC LIMIT 50';`);
    lines.push(`  const results = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ fuel_type, results: results.results });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ VEHICLES ============`);
    lines.push(`app.get('/api/vehicles', ${authGuard}async (c) => {`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const vehicles = await c.env.DB.prepare('SELECT * FROM vehicles WHERE user_id = ? AND active = 1 ORDER BY created_at DESC').bind(user.id).all();`);
    lines.push(`  return c.json({ vehicles: vehicles.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/vehicles', ${authGuard}async (c) => {`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const { nickname, make, model, year, fuel_type, tank_size_litres, avg_l_per_100km } = await c.req.json();`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO vehicles (id, user_id, nickname, make, model, year, fuel_type, tank_size_litres, avg_l_per_100km) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, user.id, nickname || null, make || null, model || null, year || null, fuel_type || 'ULP91', tank_size_litres || null, avg_l_per_100km || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/vehicles/:id', ${authGuard}async (c) => {`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const vehicle = await c.env.DB.prepare('SELECT id FROM vehicles WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();`);
    lines.push(`  if (!vehicle) return c.json({ error: 'Not found' }, 404);`);
    lines.push(`  const body = await c.req.json();`);
    lines.push(`  const fields: string[] = []; const values: any[] = [];`);
    lines.push(`  for (const [k, v] of Object.entries(body)) { if (k === 'id' || k === 'user_id') continue; fields.push(\`\${k} = ?\`); values.push(v); }`);
    lines.push(`  values.push(c.req.param('id'));`);
    lines.push(`  await c.env.DB.prepare(\`UPDATE vehicles SET \${fields.join(', ')} WHERE id = ?\`).bind(...values).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.delete('/api/vehicles/:id', ${authGuard}async (c) => {`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  await c.env.DB.prepare("UPDATE vehicles SET active = 0 WHERE id = ? AND user_id = ?").bind(c.req.param('id'), user.id).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ FILL-UPS ============`);
    lines.push(`app.get('/api/vehicles/:id/fillups', ${authGuard}async (c) => {`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const vehicle = await c.env.DB.prepare('SELECT id FROM vehicles WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();`);
    lines.push(`  if (!vehicle) return c.json({ error: 'Not found' }, 404);`);
    lines.push(`  const fillups = await c.env.DB.prepare(`);
    lines.push(`    'SELECT f.*, s.name as station_name, s.brand, s.suburb FROM fill_ups f LEFT JOIN fuel_stations s ON f.station_id = s.id WHERE f.vehicle_id = ? ORDER BY f.filled_at DESC LIMIT 50'`);
    lines.push(`  ).bind(c.req.param('id')).all();`);
    lines.push(`  return c.json({ fillups: fillups.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/vehicles/:id/fillups', ${authGuard}async (c) => {`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const vehicle = await c.env.DB.prepare('SELECT * FROM vehicles WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first() as any;`);
    lines.push(`  if (!vehicle) return c.json({ error: 'Not found' }, 404);`);
    lines.push(`  const { station_id, litres, price_per_litre_cents, odometer, notes, filled_at } = await c.req.json();`);
    lines.push(`  if (!litres || !price_per_litre_cents) return c.json({ error: 'litres and price_per_litre_cents required' }, 400);`);
    lines.push(`  const total_cost_cents = Math.round(litres * price_per_litre_cents);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO fill_ups (id, vehicle_id, station_id, litres, price_per_litre_cents, total_cost_cents, odometer, notes, filled_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, c.req.param('id'), station_id || null, litres, price_per_litre_cents, total_cost_cents, odometer || null, notes || null, filled_at || new Date().toISOString()).run();`);
    lines.push(`  // Also record the price report`);
    lines.push(`  if (station_id) {`);
    lines.push(`    const priceId = crypto.randomUUID();`);
    lines.push(`    await c.env.DB.prepare('INSERT INTO fuel_prices (id, station_id, fuel_type, price_cents, reported_by) VALUES (?, ?, ?, ?, ?)').bind(priceId, station_id, vehicle.fuel_type, price_per_litre_cents, user.id).run();`);
    lines.push(`  }`);
    lines.push(`  return c.json({ success: true, id, total_cost_cents });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ STATS ============`);
    lines.push(`app.get('/api/stats', ${authGuard}async (c) => {`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const summary = await c.env.DB.prepare(`);
    lines.push(`    \`SELECT v.id, v.nickname, v.make, v.model, v.fuel_type,\``);
    lines.push(`    + \` COUNT(f.id) as total_fillups, SUM(f.litres) as total_litres,\``);
    lines.push(`    + \` SUM(f.total_cost_cents) as total_spent_cents,\``);
    lines.push(`    + \` AVG(f.price_per_litre_cents) as avg_price_cents\``);
    lines.push(`    + \` FROM vehicles v LEFT JOIN fill_ups f ON f.vehicle_id = v.id\``);
    lines.push(`    + \` WHERE v.user_id = ? AND v.active = 1 GROUP BY v.id\``);
    lines.push(`  ).bind(user.id).all();`);
    lines.push(`  return c.json({ stats: summary.results });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ SETTINGS ============`);
    lines.push(`app.get('/api/settings', async (c) => {`);
    lines.push(`  const rows = await c.env.DB.prepare('SELECT key, value FROM app_settings').all();`);
    lines.push(`  const settings: Record<string, string> = {};`);
    lines.push(`  for (const r of rows.results) settings[(r as any).key] = (r as any).value;`);
    lines.push(`  return c.json({ settings });`);
    lines.push(`});`);
    lines.push(`app.put('/api/settings/:key', ${adminGuard}async (c) => {`);
    lines.push(`  const { value } = await c.req.json();`);
    lines.push(`  await c.env.DB.prepare("INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')").bind(c.req.param('key'), value).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    // Cron + export for aussie-saver
    if (hasAuthBearer) {
      lines.push(`// ============ CRON HANDLER ============`);
      lines.push(`export default {`);
      lines.push(`  fetch: app.fetch,`);
      lines.push(`  async scheduled(_event: ScheduledEvent, env: any, _ctx: ExecutionContext) {`);
      lines.push(`    await cleanupExpiredTokens(env.DB);`);
      lines.push(`  },`);
      lines.push(`};`);
    } else {
      lines.push(`export default { fetch: app.fetch };`);
    }
    return lines.join('\n');
  }

  // ========== SOCIALAI TEMPLATE ==========
  if (config.template === 'socialai') {
    const adminGuard = anyAuth ? 'requireAdmin(), ' : '';
    const authGuard = anyAuth ? 'requireAuth(), ' : '';

    lines.push(`// ============ CLIENTS ============`);
    lines.push(`app.get('/api/clients', ${adminGuard}async (c) => {`);
    lines.push(`  const status = c.req.query('status') || 'active';`);
    lines.push(`  const clients = await c.env.DB.prepare(`);
    lines.push(`    'SELECT id, business_name, industry, website, status, subscription_plan, onboarded_at, created_at FROM clients WHERE status = ? ORDER BY business_name'`);
    lines.push(`  ).bind(status).all();`);
    lines.push(`  return c.json({ clients: clients.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/clients/:id', ${adminGuard}async (c) => {`);
    lines.push(`  const client = await c.env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(c.req.param('id')).first();`);
    lines.push(`  if (!client) return c.json({ error: 'Not found' }, 404);`);
    lines.push(`  const pendingPosts = await c.env.DB.prepare(`);
    lines.push(`    "SELECT COUNT(*) as count FROM posts WHERE client_id = ? AND status = 'draft'"  `);
    lines.push(`  ).bind(c.req.param('id')).first();`);
    lines.push(`  return c.json({ client, pending_posts: (pendingPosts as any)?.count || 0 });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/clients', ${adminGuard}async (c) => {`);
    lines.push(`  const { business_name, industry, website, brand_voice, tone, post_frequency, subscription_plan } = await c.req.json();`);
    lines.push(`  if (!business_name) return c.json({ error: 'business_name required' }, 400);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO clients (id, business_name, industry, website, brand_voice, tone, post_frequency, subscription_plan, onboarded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))').bind(id, business_name, industry || null, website || null, brand_voice || null, tone || 'professional', post_frequency || 'daily', subscription_plan || 'starter').run();`);
    lines.push(`  // Create approval portal token`);
    lines.push(`  const portalToken = crypto.randomUUID().replace(/-/g, '');`);
    lines.push(`  const portalId = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO portal (id, client_id, token) VALUES (?, ?, ?)').bind(portalId, id, portalToken).run();`);
    lines.push(`  return c.json({ success: true, id, portal_token: portalToken });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/clients/:id', ${adminGuard}async (c) => {`);
    lines.push(`  const id = c.req.param('id');`);
    lines.push(`  const body = await c.req.json();`);
    lines.push(`  const fields: string[] = []; const values: any[] = [];`);
    lines.push(`  for (const [k, v] of Object.entries(body)) { if (k === 'id') continue; fields.push(\`\${k} = ?\`); values.push(v); }`);
    lines.push(`  fields.push("updated_at = datetime('now')"); values.push(id);`);
    lines.push(`  await c.env.DB.prepare(\`UPDATE clients SET \${fields.join(', ')} WHERE id = ?\`).bind(...values).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.delete('/api/clients/:id', ${adminGuard}async (c) => {`);
    lines.push(`  await c.env.DB.prepare("UPDATE clients SET status = 'archived', updated_at = datetime('now') WHERE id = ?").bind(c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/clients/:id/portal/refresh', ${adminGuard}async (c) => {`);
    lines.push(`  const newToken = crypto.randomUUID().replace(/-/g, '');`);
    lines.push(`  await c.env.DB.prepare("INSERT INTO portal (id, client_id, token) VALUES (?, ?, ?) ON CONFLICT(client_id) DO UPDATE SET token = excluded.token, last_accessed = NULL").bind(crypto.randomUUID(), c.req.param('id'), newToken).run();`);
    lines.push(`  return c.json({ success: true, portal_token: newToken });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ POSTS ============`);
    lines.push(`app.get('/api/posts', ${adminGuard}async (c) => {`);
    lines.push(`  const { client_id, status, platform } = c.req.query() as Record<string, string>;`);
    lines.push(`  let sql = 'SELECT p.*, c.business_name FROM posts p LEFT JOIN clients c ON p.client_id = c.id WHERE 1=1';`);
    lines.push(`  const params: any[] = [];`);
    lines.push(`  if (client_id) { sql += ' AND p.client_id = ?'; params.push(client_id); }`);
    lines.push(`  if (status) { sql += ' AND p.status = ?'; params.push(status); }`);
    lines.push(`  if (platform) { sql += ' AND p.platform = ?'; params.push(platform); }`);
    lines.push(`  sql += ' ORDER BY p.created_at DESC LIMIT 100';`);
    lines.push(`  const posts = await c.env.DB.prepare(sql).bind(...params).all();`);
    lines.push(`  return c.json({ posts: posts.results });`);
    lines.push(`});`);
    lines.push('');

    if (hasAi) {
      lines.push(`app.post('/api/posts/generate', ${adminGuard}async (c) => {`);
      lines.push(`  const { client_id, platform, topic, custom_prompt } = await c.req.json();`);
      lines.push(`  if (!client_id || !platform) return c.json({ error: 'client_id and platform required' }, 400);`);
      lines.push(`  const client = await c.env.DB.prepare('SELECT * FROM clients WHERE id = ? AND status = ?').bind(client_id, 'active').first() as any;`);
      lines.push(`  if (!client) return c.json({ error: 'Client not found' }, 404);`);
      lines.push(`  const systemPrompt = \`You are a social media manager for \${client.business_name}. Industry: \${client.industry || 'general'}. Tone: \${client.tone || 'professional'}. Brand voice: \${client.brand_voice || 'authentic and engaging'}. Write a \${platform} post\${topic ? ' about: ' + topic : ''}. Keep it concise, relevant, and platform-appropriate. No hashtag spam.\`;`);
      lines.push(`  const prompt = custom_prompt || \`Write an engaging \${platform} post for \${client.business_name}\${topic ? ' about ' + topic : ''}.\`;`);
      lines.push(`  const completion = await chatCompletion(c.env, [`);
      lines.push(`    { role: 'system', content: systemPrompt },`);
      lines.push(`    { role: 'user', content: prompt },`);
      lines.push(`  ]);`);
      lines.push(`  const content = completion.choices?.[0]?.message?.content || '';`);
      lines.push(`  const user = c.get('user') as any;`);
      lines.push(`  const id = crypto.randomUUID();`);
      lines.push(`  await c.env.DB.prepare('INSERT INTO posts (id, client_id, platform, content, status, ai_model, ai_prompt, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, client_id, platform, content, 'draft', 'openrouter', prompt, user?.id || null).run();`);
      lines.push(`  return c.json({ success: true, id, content, platform });`);
      lines.push(`});`);
    } else {
      lines.push(`app.post('/api/posts/generate', ${adminGuard}async (c) => {`);
      lines.push(`  return c.json({ error: 'AI feature (ai-openrouter) not included in this composition' }, 501);`);
      lines.push(`});`);
    }
    lines.push('');

    lines.push(`app.post('/api/posts', ${adminGuard}async (c) => {`);
    lines.push(`  const { client_id, platform, content, image_url, scheduled_for } = await c.req.json();`);
    lines.push(`  if (!client_id || !platform || !content) return c.json({ error: 'client_id, platform, content required' }, 400);`);
    lines.push(`  const user = c.get('user') as any;`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO posts (id, client_id, platform, content, image_url, status, scheduled_for, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, client_id, platform, content, image_url || null, 'draft', scheduled_for || null, user?.id || null).run();`);
    lines.push(`  return c.json({ success: true, id });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.put('/api/posts/:id', ${adminGuard}async (c) => {`);
    lines.push(`  const body = await c.req.json();`);
    lines.push(`  const fields: string[] = []; const values: any[] = [];`);
    lines.push(`  for (const [k, v] of Object.entries(body)) { if (k === 'id' || k === 'client_id') continue; fields.push(\`\${k} = ?\`); values.push(v); }`);
    lines.push(`  fields.push("updated_at = datetime('now')"); values.push(c.req.param('id'));`);
    lines.push(`  await c.env.DB.prepare(\`UPDATE posts SET \${fields.join(', ')} WHERE id = ?\`).bind(...values).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.delete('/api/posts/:id', ${adminGuard}async (c) => {`);
    lines.push(`  await c.env.DB.prepare("DELETE FROM posts WHERE id = ? AND status = 'draft'").bind(c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/posts/:id/approve', async (c) => {`);
    lines.push(`  const { approved_by } = await c.req.json().catch(() => ({})) as any;`);
    lines.push(`  await c.env.DB.prepare("UPDATE posts SET status = 'approved', approved_at = datetime('now'), approved_by = ?, updated_at = datetime('now') WHERE id = ? AND status = 'draft'").bind(approved_by || 'portal', c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/posts/:id/reject', async (c) => {`);
    lines.push(`  const { reason } = await c.req.json().catch(() => ({})) as any;`);
    lines.push(`  await c.env.DB.prepare("UPDATE posts SET status = 'rejected', rejection_reason = ?, updated_at = datetime('now') WHERE id = ?").bind(reason || null, c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/posts/:id/publish', ${adminGuard}async (c) => {`);
    lines.push(`  await c.env.DB.prepare("UPDATE posts SET status = 'published', published_at = datetime('now'), updated_at = datetime('now') WHERE id = ? AND status = 'approved'").bind(c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ CLIENT PORTAL (token-based, no auth) ============`);
    lines.push(`app.get('/api/portal/:token', async (c) => {`);
    lines.push(`  const portal = await c.env.DB.prepare('SELECT p.*, c.business_name, c.industry FROM portal p JOIN clients c ON c.id = p.client_id WHERE p.token = ?').bind(c.req.param('token')).first() as any;`);
    lines.push(`  if (!portal) return c.json({ error: 'Invalid or expired portal link' }, 404);`);
    lines.push(`  await c.env.DB.prepare("UPDATE portal SET last_accessed = datetime('now') WHERE token = ?").bind(c.req.param('token')).run();`);
    lines.push(`  const posts = await c.env.DB.prepare("SELECT * FROM posts WHERE client_id = ? AND status = 'draft' ORDER BY created_at DESC").bind(portal.client_id).all();`);
    lines.push(`  return c.json({ client: { id: portal.client_id, business_name: portal.business_name, industry: portal.industry }, posts: posts.results });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/portal/:token/respond', async (c) => {`);
    lines.push(`  const portal = await c.env.DB.prepare('SELECT client_id FROM portal WHERE token = ?').bind(c.req.param('token')).first() as any;`);
    lines.push(`  if (!portal) return c.json({ error: 'Invalid portal link' }, 404);`);
    lines.push(`  const { decisions } = await c.req.json();`);
    lines.push(`  if (!Array.isArray(decisions)) return c.json({ error: 'decisions array required: [{id, action, reason?}]' }, 400);`);
    lines.push(`  let approved = 0, rejected = 0;`);
    lines.push(`  for (const d of decisions) {`);
    lines.push(`    if (d.action === 'approve') {`);
    lines.push(`      await c.env.DB.prepare("UPDATE posts SET status = 'approved', approved_at = datetime('now'), approved_by = 'client-portal', updated_at = datetime('now') WHERE id = ? AND client_id = ? AND status = 'draft'").bind(d.id, portal.client_id).run();`);
    lines.push(`      approved++;`);
    lines.push(`    } else if (d.action === 'reject') {`);
    lines.push(`      await c.env.DB.prepare("UPDATE posts SET status = 'rejected', rejection_reason = ?, updated_at = datetime('now') WHERE id = ? AND client_id = ?").bind(d.reason || null, d.id, portal.client_id).run();`);
    lines.push(`      rejected++;`);
    lines.push(`    }`);
    lines.push(`  }`);
    lines.push(`  return c.json({ success: true, approved, rejected });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ ACTIVATION FLOW ============`);
    lines.push(`app.post('/api/activate', ${adminGuard}async (c) => {`);
    lines.push(`  const { email, business_name, plan } = await c.req.json();`);
    lines.push(`  if (!email) return c.json({ error: 'email required' }, 400);`);
    lines.push(`  const token = crypto.randomUUID().replace(/-/g, '');`);
    lines.push(`  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO pending_activations (id, email, business_name, plan, token, expires_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, email, business_name || null, plan || 'starter', token, expires).run();`);
    if (hasEmail) {
      lines.push(`  if (c.env.RESEND_API_KEY) {`);
      lines.push(`    await sendEmail(c.env, {`);
      lines.push(`      to: email,`);
      lines.push(`      subject: \`Welcome to ${JSON.stringify(config.branding.name).slice(1,-1)} — Complete your setup\`,`);
      lines.push(`      html: emailTemplate(${JSON.stringify(config.branding.name)}, '${config.branding.color}', \``);
      lines.push(`        <h2>Welcome\${business_name ? ' ' + business_name : ''}!</h2>`);
      lines.push(`        <p>You've been invited to ${JSON.stringify(config.branding.name).slice(1,-1)}. Click below to complete your account setup.</p>`);
      lines.push(`        <p style="text-align:center;margin:24px 0;"><a href="https://${config.domain}/activate/\${token}" style="background:${config.branding.color};color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Complete Setup</a></p>`);
      lines.push(`        <p style="color:#9ca3af;font-size:0.85rem;">This link expires in 7 days.</p>\`),`);
      lines.push(`      template: 'activation',`);
      lines.push(`    }).catch(() => {});`);
      lines.push(`  }`);
    }
    lines.push(`  return c.json({ success: true, token });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.get('/api/activate/:token', async (c) => {`);
    lines.push(`  const activation = await c.env.DB.prepare("SELECT * FROM pending_activations WHERE token = ? AND completed_at IS NULL AND expires_at > datetime('now')").bind(c.req.param('token')).first();`);
    lines.push(`  if (!activation) return c.json({ error: 'Invalid or expired activation link' }, 404);`);
    lines.push(`  return c.json({ activation: { email: (activation as any).email, business_name: (activation as any).business_name, plan: (activation as any).plan } });`);
    lines.push(`});`);
    lines.push('');
    lines.push(`app.post('/api/activate/:token/complete', async (c) => {`);
    lines.push(`  const activation = await c.env.DB.prepare("SELECT * FROM pending_activations WHERE token = ? AND completed_at IS NULL AND expires_at > datetime('now')").bind(c.req.param('token')).first() as any;`);
    lines.push(`  if (!activation) return c.json({ error: 'Invalid or expired activation link' }, 404);`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare("INSERT INTO clients (id, business_name, status, subscription_plan, onboarded_at) VALUES (?, ?, 'active', ?, datetime('now'))").bind(id, activation.business_name || activation.email, activation.plan || 'starter').run();`);
    lines.push(`  const portalToken = crypto.randomUUID().replace(/-/g, '');`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO portal (id, client_id, token) VALUES (?, ?, ?)').bind(crypto.randomUUID(), id, portalToken).run();`);
    lines.push(`  await c.env.DB.prepare("UPDATE pending_activations SET completed_at = datetime('now') WHERE token = ?").bind(c.req.param('token')).run();`);
    lines.push(`  return c.json({ success: true, client_id: id, portal_token: portalToken });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ CANCELLATIONS ============`);
    lines.push(`app.post('/api/clients/:id/cancel', async (c) => {`);
    lines.push(`  const { reason } = await c.req.json().catch(() => ({})) as any;`);
    lines.push(`  const id = crypto.randomUUID();`);
    lines.push(`  await c.env.DB.prepare('INSERT INTO pending_cancellations (id, client_id, reason) VALUES (?, ?, ?)').bind(id, c.req.param('id'), reason || null).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push(`app.get('/api/admin/cancellations', ${adminGuard}async (c) => {`);
    lines.push(`  const pending = await c.env.DB.prepare('SELECT pc.*, c.business_name FROM pending_cancellations pc JOIN clients c ON c.id = pc.client_id WHERE pc.processed_at IS NULL ORDER BY pc.requested_at DESC').all();`);
    lines.push(`  return c.json({ cancellations: pending.results });`);
    lines.push(`});`);
    lines.push(`app.post('/api/admin/cancellations/:id/process', ${adminGuard}async (c) => {`);
    lines.push(`  const cancellation = await c.env.DB.prepare('SELECT * FROM pending_cancellations WHERE id = ?').bind(c.req.param('id')).first() as any;`);
    lines.push(`  if (!cancellation) return c.json({ error: 'Not found' }, 404);`);
    lines.push(`  await c.env.DB.prepare("UPDATE clients SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?").bind(cancellation.client_id).run();`);
    lines.push(`  await c.env.DB.prepare("UPDATE pending_cancellations SET processed_at = datetime('now') WHERE id = ?").bind(c.req.param('id')).run();`);
    lines.push(`  return c.json({ success: true });`);
    lines.push(`});`);
    lines.push('');

    lines.push(`// ============ ADMIN QUEUE ============`);
    lines.push(`app.get('/api/admin/queue', ${adminGuard}async (c) => {`);
    lines.push(`  const queue = await c.env.DB.prepare(`);
    lines.push(`    "SELECT p.*, c.business_name FROM posts p JOIN clients c ON c.id = p.client_id WHERE p.status = 'approved' ORDER BY p.approved_at ASC LIMIT 100"`);
    lines.push(`  ).all();`);
    lines.push(`  return c.json({ queue: queue.results });`);
    lines.push(`});`);
    lines.push('');
    // Cron + export for socialai
    if (hasAuthBearer) {
      lines.push(`// ============ CRON HANDLER ============`);
      lines.push(`export default {`);
      lines.push(`  fetch: app.fetch,`);
      lines.push(`  async scheduled(_event: ScheduledEvent, env: any, _ctx: ExecutionContext) {`);
      lines.push(`    await cleanupExpiredTokens(env.DB);`);
      lines.push(`  },`);
      lines.push(`};`);
    } else {
      lines.push(`export default { fetch: app.fetch };`);
    }
    return lines.join('\n');
  }

  lines.push('export default { fetch: app.fetch };');

  return lines.join('\n');
}

// ============ REPORT GENERATOR ============

function generateReport(config: AppComposition, features: FeatureManifest[]): string {
  const allEnvVars = features.flatMap(f => f.requires.envVars);
  const allRoutes = features.flatMap(f => f.provides.routes);
  const allTables = [...new Set(features.flatMap(f => f.requires.dbTables.map(t => t.name)))];
  const requiredSecrets = allEnvVars.filter(v => v.required && v.secret);
  const requiredConfig = allEnvVars.filter(v => v.required && !v.secret);

  return `
# ${config.branding.name} — Composition Report
Generated: ${new Date().toISOString()}

## Features (${features.length})
${features.map(f => `- **${f.name}** (${f.id}) v${f.version} — ${f.description}`).join('\n')}

## API Routes (${allRoutes.length})
${allRoutes.map(r => `- ${r.method} ${r.path} [${r.auth}] — ${r.description}`).join('\n')}

## Database Tables (${allTables.length})
${allTables.map(t => `- ${t}`).join('\n')}

## Required Secrets (set via wrangler secret put)
${requiredSecrets.map(v => `- ${v.name} — ${v.description}`).join('\n') || 'None'}

## Required Config (set in wrangler.toml [vars])
${requiredConfig.map(v => `- ${v.name} — ${v.description}`).join('\n') || 'None'}

## Setup Steps
1. Create D1 database: \`wrangler d1 create ${config.id}-db\`
2. Run schema: \`wrangler d1 execute ${config.id}-db --file=schema.sql\`
3. Set secrets:
${requiredSecrets.map(v => `   \`wrangler secret put ${v.name}\``).join('\n')}
4. Update wrangler.toml with real database ID
5. Deploy: \`wrangler deploy\`
`.trim();
}

// ============ HELPERS ============

function pascalCase(str: string): string {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

// ============ MAIN ============

async function main() {
  const args = process.argv.slice(2);
  const configPath = args[args.indexOf('--config') + 1] || 'app-config.json';
  const outputDir = args[args.indexOf('--output') + 1] || './dist';
  const featuresRoot = path.resolve(__dirname, '../../features');

  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }

  const config: AppComposition = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  console.log(`\n🔨 Composing: ${config.branding.name}`);
  console.log(`   Features: ${config.features.join(', ')}`);
  console.log(`   Domain: ${config.domain}`);
  console.log('');

  // Resolve dependencies
  const { ordered, errors } = resolveDependencies(config.features, featuresRoot);

  if (errors.length > 0) {
    console.error('❌ Composition errors:');
    errors.forEach(e => console.error(`   - ${e}`));
    process.exit(1);
  }

  console.log(`✅ Resolved ${ordered.length} features (including dependencies)`);
  ordered.forEach(f => console.log(`   ${f.id} v${f.version}`));
  console.log('');

  // Generate outputs
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'src'), { recursive: true });

  // Schema
  const schema = generateSchema(config, ordered);
  fs.writeFileSync(path.join(outputDir, 'schema.sql'), schema);
  console.log('📄 Generated schema.sql');

  // Wrangler config
  const wrangler = generateWranglerToml(config, ordered);
  fs.writeFileSync(path.join(outputDir, 'wrangler.toml'), wrangler);
  console.log('📄 Generated wrangler.toml');

  // Worker index
  const indexTs = generateIndexTs(config, ordered);
  fs.writeFileSync(path.join(outputDir, 'src', 'index.ts'), indexTs);
  console.log('📄 Generated src/index.ts');

  // Report
  const report = generateReport(config, ordered);
  fs.writeFileSync(path.join(outputDir, 'COMPOSITION_REPORT.md'), report);
  console.log('📄 Generated COMPOSITION_REPORT.md');

  // Package files
  const packageJson = {
    name: config.id,
    version: '1.0.0',
    private: true,
    scripts: { deploy: 'wrangler deploy' },
    dependencies: { hono: '^4.0.0' },
    devDependencies: { '@cloudflare/workers-types': '^4.0.0', wrangler: '^3.0.0' },
  };
  fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  const tsconfig = {
    compilerOptions: {
      target: 'ES2022', module: 'ES2022', moduleResolution: 'bundler',
      lib: ['ES2022'], types: ['@cloudflare/workers-types'],
      strict: true, esModuleInterop: true, skipLibCheck: true, outDir: './dist',
    },
    include: ['src/**/*', 'features/**/*'],
  };
  fs.writeFileSync(path.join(outputDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
  console.log('📄 Generated package.json + tsconfig.json');

  // Copy feature source files
  for (const feature of ordered) {
    const srcDir = findFeatureDir(feature.id, featuresRoot);
    if (srcDir) {
      const destDir = path.join(outputDir, 'features', feature.category, feature.id);
      fs.mkdirSync(destDir, { recursive: true });
      // Copy index.ts and manifest.json
      for (const file of ['index.ts', 'manifest.json']) {
        const srcFile = path.join(srcDir, file);
        if (fs.existsSync(srcFile)) {
          fs.copyFileSync(srcFile, path.join(destDir, file));
        }
      }
    }
  }
  console.log('📦 Copied feature source files');

  console.log(`\n✨ Composition complete → ${outputDir}/`);
  console.log(`   Run: cd ${outputDir} && wrangler deploy`);
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
