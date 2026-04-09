#!/usr/bin/env tsx
// PennyWiseIT Deploy Pipeline — one command to go from config → live validated app
// Usage: npx tsx deploy.ts --config app-config.json [--compose-only] [--skip-validate]

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ============ CONFIG ============

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '6700423b76671a05d196916b43410458';
const CF_API_TOKEN = process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN || '';
const VALIDATOR_URL = process.env.VALIDATOR_URL || 'https://pennywiseit-validator.steve-700.workers.dev';
const VALIDATOR_SECRET = process.env.VALIDATOR_SECRET || '';

// ============ TYPES ============

interface AppConfig {
  id: string;
  name: string;
  domain: string;
  template: string;
  branding: { name: string; color: string; logo_url?: string };
  features: string[];
  env: Record<string, string>;
  secrets: string[];
}

interface StepResult {
  step: string;
  success: boolean;
  message: string;
  data?: any;
}

// ============ CF API HELPERS ============

async function cfApi(path: string, opts: RequestInit = {}): Promise<any> {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
  const data = await res.json() as any;
  if (!data.success) {
    throw new Error(`CF API ${path}: ${data.errors?.[0]?.message || JSON.stringify(data.errors)}`);
  }
  return data;
}

async function validatorApi(method: string, path: string, body?: any): Promise<any> {
  const res = await fetch(`${VALIDATOR_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${VALIDATOR_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// ============ PIPELINE STEPS ============

async function step1_compose(configPath: string, outputDir: string): Promise<StepResult> {
  console.log('\n📦 Step 1: Composing app...');
  try {
    const composerPath = path.resolve(__dirname, 'compose.ts');
    const output = execSync(
      `npx tsx "${composerPath}" --config "${configPath}" --output "${outputDir}"`,
      { cwd: path.dirname(configPath), encoding: 'utf-8', stdio: 'pipe' }
    );
    console.log(output);
    return { step: 'compose', success: true, message: 'Composition complete' };
  } catch (err: any) {
    return { step: 'compose', success: false, message: err.stderr || err.message };
  }
}

async function step2_createD1(config: AppConfig, outputDir: string): Promise<StepResult> {
  console.log('\n🗄️  Step 2: Creating D1 database...');
  const dbName = `${config.id}-db`;

  // Check if DB already exists
  try {
    const existing = await cfApi('/d1/database');
    const found = existing.result?.find((db: any) => db.name === dbName);
    if (found) {
      console.log(`   Database "${dbName}" already exists: ${found.uuid}`);
      // Update wrangler.toml
      updateWranglerDbId(outputDir, found.uuid);
      return { step: 'create-d1', success: true, message: `Existing DB: ${found.uuid}`, data: { db_id: found.uuid } };
    }
  } catch (err: any) {
    // List might fail, try creating anyway
  }

  try {
    const result = await cfApi('/d1/database', {
      method: 'POST',
      body: JSON.stringify({ name: dbName, primary_location_hint: 'apac' }),
    });
    const dbId = result.result.uuid;
    console.log(`   Created "${dbName}": ${dbId}`);

    // Update wrangler.toml with real ID
    updateWranglerDbId(outputDir, dbId);

    return { step: 'create-d1', success: true, message: `Created DB: ${dbId}`, data: { db_id: dbId } };
  } catch (err: any) {
    return { step: 'create-d1', success: false, message: err.message };
  }
}

function updateWranglerDbId(outputDir: string, dbId: string) {
  const wranglerPath = path.join(outputDir, 'wrangler.toml');
  let content = fs.readFileSync(wranglerPath, 'utf-8');
  content = content.replace(/database_id = "REPLACE_WITH_DB_ID"/, `database_id = "${dbId}"`);
  // Also replace if it was already set (re-deploy)
  content = content.replace(/database_id = "[a-f0-9-]+"/, `database_id = "${dbId}"`);
  fs.writeFileSync(wranglerPath, content);
}

async function step3_runSchema(config: AppConfig, outputDir: string, dbId: string): Promise<StepResult> {
  console.log('\n📋 Step 3: Running schema migrations...');
  const schemaPath = path.join(outputDir, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // Parse individual statements (split on semicolons, ignoring comments)
  const statements = schema
    .split('\n')
    .filter(line => !line.startsWith('--') && line.trim().length > 0)
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`   Executing ${statements.length} SQL statements...`);

  // Batch statements (D1 supports multi-statement)
  const batchSize = 20;
  let executed = 0;

  for (let i = 0; i < statements.length; i += batchSize) {
    const batch = statements.slice(i, i + batchSize).join('; ');
    try {
      await cfApi(`/d1/database/${dbId}/query`, {
        method: 'POST',
        body: JSON.stringify({ sql: batch }),
      });
      executed += Math.min(batchSize, statements.length - i);
    } catch (err: any) {
      return { step: 'run-schema', success: false, message: `Failed at statement ${i}: ${err.message}` };
    }
  }

  console.log(`   ✅ ${executed} statements executed`);
  return { step: 'run-schema', success: true, message: `${executed} statements executed` };
}

async function step4_installAndDeploy(config: AppConfig, outputDir: string): Promise<StepResult> {
  console.log('\n🚀 Step 4: Installing dependencies & deploying worker...');
  try {
    // npm install
    console.log('   Installing dependencies...');
    execSync('npm install', { cwd: outputDir, encoding: 'utf-8', stdio: 'pipe' });

    // wrangler deploy
    console.log('   Deploying to Cloudflare Workers...');
    const deployOutput = execSync('npx wrangler deploy', {
      cwd: outputDir,
      encoding: 'utf-8',
      stdio: 'pipe',
      env: {
        ...process.env,
        CLOUDFLARE_API_TOKEN: CF_API_TOKEN,
        CLOUDFLARE_ACCOUNT_ID: CF_ACCOUNT_ID,
      },
    });

    // Extract worker URL from output
    const urlMatch = deployOutput.match(/https:\/\/[^\s]+\.workers\.dev/);
    const workerUrl = urlMatch ? urlMatch[0] : `https://${config.id}.steve-700.workers.dev`;

    console.log(`   ✅ Deployed: ${workerUrl}`);
    return { step: 'deploy', success: true, message: `Deployed: ${workerUrl}`, data: { url: workerUrl } };
  } catch (err: any) {
    return { step: 'deploy', success: false, message: err.stderr || err.message };
  }
}

async function step5_register(config: AppConfig, dbId: string): Promise<StepResult> {
  console.log('\n📝 Step 5: Registering with validator...');

  if (!VALIDATOR_SECRET) {
    return { step: 'register', success: false, message: 'VALIDATOR_SECRET not set, skipping registration' };
  }

  const paymentProvider = config.features.find(f => f.startsWith('payments-'))?.replace('payments-', '') || null;

  try {
    const result = await validatorApi('POST', '/api/apps', {
      id: config.id,
      name: config.name,
      template: config.template,
      domain: `${config.id}.steve-700.workers.dev`,
      worker_name: config.id,
      brand_name: config.branding.name,
      brand_color: config.branding.color,
      clerk_enabled: config.features.includes('auth-clerk'),
      payment_provider: paymentProvider,
      resend_enabled: config.features.includes('email-resend'),
      sms_enabled: config.features.includes('sms-twilio'),
      d1_database_id: dbId,
      features: config.features.join(','),
    });

    if (result.success) {
      console.log(`   ✅ Registered: ${config.id}`);
      return { step: 'register', success: true, message: `Registered: ${config.id}` };
    } else {
      // May already exist — try updating
      console.log(`   ⚠️  Registration returned: ${JSON.stringify(result)}`);
      return { step: 'register', success: true, message: `Registration response: ${JSON.stringify(result)}` };
    }
  } catch (err: any) {
    return { step: 'register', success: false, message: err.message };
  }
}

async function step6_validate(config: AppConfig): Promise<StepResult> {
  console.log('\n🔍 Step 6: Running validation...');

  if (!VALIDATOR_SECRET) {
    return { step: 'validate', success: false, message: 'VALIDATOR_SECRET not set' };
  }

  try {
    const result = await validatorApi('POST', `/api/validate/${config.id}`);
    const checks = result.checks || [];
    const passed = checks.filter((c: any) => c.status === 'pass').length;
    const failed = checks.filter((c: any) => c.status === 'fail').length;

    console.log(`\n   Validation Results:`);
    for (const check of checks) {
      const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️';
      console.log(`   ${icon} [${check.category}] ${check.check_name}: ${check.message}`);
    }
    console.log(`\n   Score: ${passed}/${passed + failed} checks passing`);

    return {
      step: 'validate',
      success: true,
      message: `${passed}/${passed + failed} checks passing`,
      data: { passed, failed, checks },
    };
  } catch (err: any) {
    return { step: 'validate', success: false, message: err.message };
  }
}

// ============ MAIN ============

async function main() {
  const args = process.argv.slice(2);

  // Parse args
  const configIdx = args.indexOf('--config');
  const configPath = configIdx >= 0 ? args[configIdx + 1] : null;
  const composeOnly = args.includes('--compose-only');
  const skipValidate = args.includes('--skip-validate');
  const outputArg = args.indexOf('--output');
  const outputBase = outputArg >= 0 ? args[outputArg + 1] : './dist';

  if (!configPath) {
    console.error('Usage: npx tsx deploy.ts --config <app-config.json> [--compose-only] [--skip-validate] [--output <dir>]');
    console.error('');
    console.error('Environment variables:');
    console.error('  CF_API_TOKEN        Cloudflare API token (required for deploy)');
    console.error('  CF_ACCOUNT_ID       Cloudflare account ID (defaults to PennyWiseIT)');
    console.error('  VALIDATOR_SECRET    Validator API secret (required for register/validate)');
    console.error('  VALIDATOR_URL       Validator URL (defaults to production)');
    process.exit(1);
  }

  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config file not found: ${configPath}`);
    process.exit(1);
  }

  const config: AppConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const outputDir = path.resolve(outputBase, config.id);

  console.log('═══════════════════════════════════════════════════');
  console.log(`  PennyWiseIT Deploy Pipeline`);
  console.log(`  App: ${config.branding.name} (${config.id})`);
  console.log(`  Template: ${config.template}`);
  console.log(`  Features: ${config.features.join(', ')}`);
  console.log('═══════════════════════════════════════════════════');

  const results: StepResult[] = [];
  const startTime = Date.now();

  // Step 1: Compose
  const composeResult = await step1_compose(configPath, outputDir);
  results.push(composeResult);
  if (!composeResult.success) {
    printSummary(config, results, startTime);
    process.exit(1);
  }

  if (composeOnly) {
    console.log('\n✨ Compose-only mode — stopping here.');
    printSummary(config, results, startTime);
    return;
  }

  // Check for required env vars
  if (!CF_API_TOKEN) {
    console.error('\n❌ CF_API_TOKEN / CLOUDFLARE_API_TOKEN not set. Cannot deploy.');
    console.error('   Set it via: export CF_API_TOKEN=your_token');
    process.exit(1);
  }

  // Step 2: Create D1
  const d1Result = await step2_createD1(config, outputDir);
  results.push(d1Result);
  if (!d1Result.success) {
    printSummary(config, results, startTime);
    process.exit(1);
  }

  // Step 3: Run schema
  const schemaResult = await step3_runSchema(config, outputDir, d1Result.data.db_id);
  results.push(schemaResult);
  if (!schemaResult.success) {
    printSummary(config, results, startTime);
    process.exit(1);
  }

  // Step 4: Deploy
  const deployResult = await step4_installAndDeploy(config, outputDir);
  results.push(deployResult);
  if (!deployResult.success) {
    printSummary(config, results, startTime);
    process.exit(1);
  }

  // Step 5: Register
  const registerResult = await step5_register(config, d1Result.data.db_id);
  results.push(registerResult);

  // Step 6: Validate
  if (!skipValidate) {
    const validateResult = await step6_validate(config);
    results.push(validateResult);
  }

  printSummary(config, results, startTime);
}

function printSummary(config: AppConfig, results: StepResult[], startTime: number) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const allPassed = results.every(r => r.success);

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`  Deploy Summary: ${config.branding.name}`);
  console.log('═══════════════════════════════════════════════════');

  for (const r of results) {
    const icon = r.success ? '✅' : '❌';
    console.log(`  ${icon} ${r.step}: ${r.message}`);
  }

  console.log(`\n  Total time: ${elapsed}s`);
  console.log(`  Status: ${allPassed ? '🎉 ALL STEPS PASSED' : '⚠️  SOME STEPS FAILED'}`);
  console.log('═══════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
