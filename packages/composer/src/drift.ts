#!/usr/bin/env npx tsx
/**
 * drift.ts — Schema drift detector for PennyWiseIT apps
 *
 * Compares the tables that the compose engine expects against what's
 * actually in the live D1 database, and reports any drift.
 *
 * Usage:
 *   npx tsx drift.ts --config examples/wirez.json
 *   npx tsx drift.ts --config examples/wirez.json --db-id <d1-database-id>
 *   npx tsx drift.ts --all           # check all apps listed in seed.sql
 *   npx tsx drift.ts --config examples/wirez.json --fix  # print ALTER TABLE stmts
 */

import fs from 'fs';
import path from 'path';

// ============ TYPES ============

interface AppConfig {
  id: string;
  name: string;
  template: string;
  domain?: string;
  branding: { name: string; color: string };
  features: string[];
  env?: Record<string, string>;
  secrets?: string[];
}

interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  indexes: string[];
}

interface ColumnInfo {
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

interface DriftReport {
  appId: string;
  appName: string;
  template: string;
  dbId: string;
  checkedAt: string;
  status: 'ok' | 'drift' | 'error' | 'skipped';
  missing_tables: string[];
  extra_tables: string[];
  tables_ok: string[];
  errors: string[];
  fix_sql: string[];
  duration_ms: number;
}

// ============ CLOUDFLARE D1 API ============

async function queryD1(
  accountId: string,
  apiToken: string,
  dbId: string,
  sql: string,
  params: unknown[] = []
): Promise<{ results: Record<string, unknown>[]; error?: string }> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { results: [], error: `HTTP ${res.status}: ${text}` };
  }

  const json = (await res.json()) as {
    success: boolean;
    result?: Array<{ results: Record<string, unknown>[] }>;
    errors?: Array<{ message: string }>;
  };

  if (!json.success) {
    const msg = json.errors?.map((e) => e.message).join(', ') || 'Unknown error';
    return { results: [], error: msg };
  }

  return { results: (json.result?.[0]?.results ?? []) };
}

async function getActualTables(
  accountId: string,
  apiToken: string,
  dbId: string
): Promise<{ tables: string[]; error?: string }> {
  const { results, error } = await queryD1(
    accountId,
    apiToken,
    dbId,
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY name"
  );
  if (error) return { tables: [], error };
  return { tables: results.map((r) => r.name as string) };
}

async function getTableColumns(
  accountId: string,
  apiToken: string,
  dbId: string,
  tableName: string
): Promise<ColumnInfo[]> {
  const { results } = await queryD1(
    accountId,
    apiToken,
    dbId,
    `PRAGMA table_info(${tableName})`
  );
  return results as unknown as ColumnInfo[];
}

// ============ SCHEMA PARSING ============

function parseExpectedTablesFromSchema(schemaPath: string): string[] {
  if (!fs.existsSync(schemaPath)) return [];
  const sql = fs.readFileSync(schemaPath, 'utf-8');
  const tables: string[] = [];
  const re = /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(\w+)/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(sql)) !== null) {
    tables.push(match[1]);
  }
  return tables;
}

function parseExpectedColumnsFromSchema(
  schemaPath: string,
  tableName: string
): string[] {
  if (!fs.existsSync(schemaPath)) return [];
  const sql = fs.readFileSync(schemaPath, 'utf-8');
  // Find the CREATE TABLE block for this table
  const re = new RegExp(
    `CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+${tableName}\\s*\\(([^;]+)\\)`,
    'is'
  );
  const match = re.exec(sql);
  if (!match) return [];
  const body = match[1];
  const columns: string[] = [];
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.toUpperCase().startsWith('FOREIGN KEY')) continue;
    if (trimmed.toUpperCase().startsWith('PRIMARY KEY')) continue;
    if (trimmed.toUpperCase().startsWith('UNIQUE')) continue;
    const col = trimmed.split(/\s+/)[0].replace(/[",]/g, '');
    if (col) columns.push(col);
  }
  return columns;
}

// ============ DRIFT DETECTION ============

async function detectDrift(
  config: AppConfig,
  dbId: string,
  accountId: string,
  apiToken: string,
  schemaPath: string,
  opts: { verbose: boolean; fix: boolean }
): Promise<DriftReport> {
  const start = Date.now();
  const report: DriftReport = {
    appId: config.id,
    appName: config.branding?.name || config.id,
    template: config.template,
    dbId,
    checkedAt: new Date().toISOString(),
    status: 'ok',
    missing_tables: [],
    extra_tables: [],
    tables_ok: [],
    errors: [],
    fix_sql: [],
    duration_ms: 0,
  };

  // Get expected tables from the generated schema.sql
  const expectedTables = parseExpectedTablesFromSchema(schemaPath);
  if (expectedTables.length === 0) {
    report.status = 'skipped';
    report.errors.push(`No schema.sql found at ${schemaPath} — run compose first`);
    report.duration_ms = Date.now() - start;
    return report;
  }

  // Get actual tables from D1
  const { tables: actualTables, error } = await getActualTables(accountId, apiToken, dbId);
  if (error) {
    report.status = 'error';
    report.errors.push(error);
    report.duration_ms = Date.now() - start;
    return report;
  }

  const expectedSet = new Set(expectedTables);
  const actualSet = new Set(actualTables);

  // Missing tables (in expected but not in actual)
  for (const t of expectedSet) {
    if (!actualSet.has(t)) {
      report.missing_tables.push(t);
    }
  }

  // Extra tables (in actual but not in expected — could be legacy or manual)
  const knownSystemTables = new Set(['d1_migrations', '_cf_KV', 'd1_sequence']);
  for (const t of actualSet) {
    if (!expectedSet.has(t) && !knownSystemTables.has(t)) {
      report.extra_tables.push(t);
    }
  }

  // Tables that are present — check columns for drift if verbose
  for (const t of expectedSet) {
    if (actualSet.has(t)) {
      if (opts.verbose) {
        const actualCols = await getTableColumns(accountId, apiToken, dbId, t);
        const actualColNames = new Set(actualCols.map((c) => c.name));
        const expectedCols = parseExpectedColumnsFromSchema(schemaPath, t);
        const missingCols = expectedCols.filter((c) => !actualColNames.has(c));
        if (missingCols.length > 0) {
          report.errors.push(`Table '${t}' is missing columns: ${missingCols.join(', ')}`);
          if (opts.fix) {
            for (const col of missingCols) {
              report.fix_sql.push(`-- Column '${col}' missing from '${t}' (add manually with correct type):`);
              report.fix_sql.push(`-- ALTER TABLE ${t} ADD COLUMN ${col} TEXT;`);
            }
          }
        } else {
          report.tables_ok.push(t);
        }
      } else {
        report.tables_ok.push(t);
      }
    }
  }

  // Generate fix SQL for missing tables
  if (opts.fix && report.missing_tables.length > 0) {
    report.fix_sql.push('');
    report.fix_sql.push('-- === Run these statements to fix missing tables ===');
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    for (const tableName of report.missing_tables) {
      const re = new RegExp(
        `(CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+${tableName}[^;]+;)`,
        'is'
      );
      const m = re.exec(schemaContent);
      if (m) {
        report.fix_sql.push(m[1]);
        // Also pull associated indexes
        const idxRe = new RegExp(`(CREATE\\s+INDEX\\s+IF\\s+NOT\\s+EXISTS\\s+\\S+\\s+ON\\s+${tableName}[^;]+;)`, 'gis');
        let idxMatch: RegExpExecArray | null;
        while ((idxMatch = idxRe.exec(schemaContent)) !== null) {
          report.fix_sql.push(idxMatch[1]);
        }
      }
    }
  }

  if (report.missing_tables.length > 0 || report.extra_tables.length > 0 || report.errors.length > 0) {
    report.status = 'drift';
  }

  report.duration_ms = Date.now() - start;
  return report;
}

// ============ SEED PARSER (for --all mode) ============

interface SeedApp {
  id: string;
  template: string;
  dbId: string | null;
}

function parseSeedApps(seedPath: string): SeedApp[] {
  if (!fs.existsSync(seedPath)) return [];
  const sql = fs.readFileSync(seedPath, 'utf-8');
  const apps: SeedApp[] = [];
  // Match INSERT rows: ('id', 'name', 'template', ..., 'd1_database_id', ...)
  // Columns: id, name, template, domain, worker_name, brand_name, brand_color,
  //          clerk_enabled, payment_provider, payment_configured, resend_enabled, resend_from_email,
  //          sms_enabled, sms_provider, d1_database_id, r2_bucket_name, features
  const rowRe = /\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*[^,]*,\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*\d+,\s*'[^']*',\s*\d+,\s*\d+,\s*(?:NULL|'[^']*'),\s*\d+,\s*(?:NULL|'[^']*'),\s*(?:NULL|'([^']+)'),/g;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(sql)) !== null) {
    apps.push({ id: m[1], template: m[3], dbId: m[4] || null });
  }
  return apps;
}

// ============ REPORT PRINTER ============

function printReport(report: DriftReport, opts: { json: boolean }) {
  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const icon = report.status === 'ok' ? '✅' : report.status === 'drift' ? '⚠️ ' : report.status === 'error' ? '❌' : '⏭️ ';
  console.log(`\n${icon} ${report.appName} (${report.appId}) — ${report.template}`);
  console.log(`   DB: ${report.dbId}  |  Checked: ${report.checkedAt}  |  ${report.duration_ms}ms`);

  if (report.errors.length > 0) {
    console.log(`\n   Errors:`);
    for (const e of report.errors) console.log(`     ✗ ${e}`);
  }

  if (report.missing_tables.length > 0) {
    console.log(`\n   Missing tables (${report.missing_tables.length}):`);
    for (const t of report.missing_tables) console.log(`     ✗ ${t}`);
  }

  if (report.extra_tables.length > 0) {
    console.log(`\n   Extra tables (${report.extra_tables.length}) — not in schema:`);
    for (const t of report.extra_tables) console.log(`     + ${t}`);
  }

  if (report.tables_ok.length > 0) {
    console.log(`\n   Tables OK (${report.tables_ok.length}): ${report.tables_ok.join(', ')}`);
  }

  if (report.fix_sql.length > 0) {
    console.log(`\n   Fix SQL:`);
    for (const line of report.fix_sql) console.log(`     ${line}`);
  }

  if (report.status === 'ok') {
    console.log(`   No drift detected.`);
  }
}

// ============ MAIN ============

async function main() {
  const args = process.argv.slice(2);

  const configPath = args[args.indexOf('--config') + 1] || null;
  const dbIdArg = args[args.indexOf('--db-id') + 1] || null;
  const outputDir = args[args.indexOf('--output') + 1] || './dist';
  const allMode = args.includes('--all');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const fix = args.includes('--fix');
  const jsonOutput = args.includes('--json');

  if (!configPath && !allMode) {
    console.error('Usage: npx tsx drift.ts --config <path> [--db-id <id>] [--output <dir>] [--verbose] [--fix] [--json]');
    console.error('       npx tsx drift.ts --all [--verbose] [--fix]');
    process.exit(1);
  }

  const accountId = process.env.CF_ACCOUNT_ID || '';
  const apiToken = process.env.CF_API_TOKEN || '';

  if (!accountId || !apiToken) {
    console.error('❌ CF_ACCOUNT_ID and CF_API_TOKEN environment variables are required');
    console.error('   Export them or add to a .env file:');
    console.error('   export CF_ACCOUNT_ID=your-account-id');
    console.error('   export CF_API_TOKEN=your-api-token');
    process.exit(1);
  }

  const featuresRoot = path.resolve(__dirname, '../../features');

  if (allMode) {
    const seedPath = path.resolve(__dirname, '../../../validator/seed.sql');
    const apps = parseSeedApps(seedPath);
    if (apps.length === 0) {
      console.error('No apps found in seed.sql');
      process.exit(1);
    }
    console.log(`\n🔍 Checking ${apps.length} apps for schema drift...`);
    let driftCount = 0;
    for (const app of apps) {
      if (!app.dbId) {
        console.log(`⏭️  ${app.id} — no D1 database ID, skipping`);
        continue;
      }
      const schemaPath = path.join(outputDir, app.id, 'schema.sql');
      // Try the dist output first, then fall back to a placeholder
      const config: AppConfig = {
        id: app.id,
        name: app.id,
        template: app.template,
        branding: { name: app.id, color: '#000' },
        features: [],
      };
      const report = await detectDrift(config, app.dbId, accountId, apiToken, schemaPath, { verbose, fix });
      printReport(report, { json: jsonOutput });
      if (report.status === 'drift' || report.status === 'error') driftCount++;
    }
    console.log(`\n${driftCount === 0 ? '✅ All apps clean' : `⚠️  ${driftCount} app(s) have drift`}`);
    process.exit(driftCount > 0 ? 1 : 0);
  }

  // Single app mode
  if (!fs.existsSync(configPath!)) {
    console.error(`Config not found: ${configPath}`);
    process.exit(1);
  }

  const config: AppConfig = JSON.parse(fs.readFileSync(configPath!, 'utf-8'));
  const schemaPath = path.join(outputDir, 'schema.sql');

  let dbId = dbIdArg;
  if (!dbId) {
    // Try to read from generated wrangler.toml
    const wranglerPath = path.join(outputDir, 'wrangler.toml');
    if (fs.existsSync(wranglerPath)) {
      const wrangler = fs.readFileSync(wranglerPath, 'utf-8');
      const m = /database_id\s*=\s*"([^"]+)"/.exec(wrangler);
      if (m) dbId = m[1];
    }
  }

  if (!dbId) {
    console.error('❌ No D1 database ID found.');
    console.error('   Either pass --db-id <id> or run compose first (which writes wrangler.toml)');
    process.exit(1);
  }

  // Check if schema exists, if not suggest composing first
  if (!fs.existsSync(schemaPath)) {
    console.warn(`⚠️  No schema.sql at ${schemaPath}`);
    console.warn(`   Run first: npx tsx compose.ts --config ${configPath} --output ${outputDir}`);
  }

  console.log(`\n🔍 Checking schema drift for ${config.branding?.name || config.id}...`);
  console.log(`   Config: ${configPath}`);
  console.log(`   Schema: ${schemaPath}`);
  console.log(`   DB ID:  ${dbId}`);

  const report = await detectDrift(config, dbId, accountId, apiToken, schemaPath, { verbose, fix });
  printReport(report, { json: jsonOutput });

  // Write report to file
  const reportPath = path.join(outputDir, 'DRIFT_REPORT.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report written to ${reportPath}`);

  process.exit(report.status === 'drift' || report.status === 'error' ? 1 : 0);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
