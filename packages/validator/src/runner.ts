// Validation runner — orchestrates all checks for an app
import { AppConfig, CheckResult, Env, TEMPLATE_TABLES, resolveExpectedTables } from './types';
import { checkHealth, checkWorkerResponds } from './checks/health';
import { checkResendApiKey, checkResendDomainVerified, checkResendTestEmail } from './checks/email';
import { checkStripeApiKey, checkStripeWebhook, checkSquareAccessToken, checkPayPalCredentials } from './checks/payments';
import { checkClerkSecretKey, checkClerkRedirectUrls } from './checks/auth';
import { checkD1Exists, checkD1Tables, checkR2BucketExists } from './checks/database';

export async function runValidation(
  app: AppConfig,
  env: Env,
  options: { sendTestEmail?: boolean } = {}
): Promise<{ checks: CheckResult[]; duration_ms: number }> {
  const start = Date.now();
  const checks: CheckResult[] = [];

  // 1. Health checks (always run)
  if (app.domain) {
    const [workerCheck, healthCheck] = await Promise.all([
      checkWorkerResponds(app.domain, env.CF_ACCOUNT_ID, env.CF_API_TOKEN),
      checkHealth(app.domain, env.CF_ACCOUNT_ID, env.CF_API_TOKEN),
    ]);
    checks.push(workerCheck, healthCheck);
  } else {
    checks.push({
      check_name: 'Worker Responds',
      category: 'health',
      status: 'skip',
      message: 'No domain configured — cannot check health',
    });
  }

  // 2. Auth checks (if Clerk enabled)
  if (app.clerk_enabled && app.clerk_secret_key) {
    const clerkKeyCheck = await checkClerkSecretKey(app.clerk_secret_key);
    checks.push(clerkKeyCheck);

    if (clerkKeyCheck.status === 'pass' && app.domain) {
      const redirectCheck = await checkClerkRedirectUrls(app.clerk_secret_key, app.domain);
      checks.push(redirectCheck);
    }
  } else if (app.clerk_enabled) {
    checks.push({
      check_name: 'Clerk Secret Key Valid',
      category: 'auth',
      status: 'fail',
      message: 'Clerk is enabled but no secret key provided for validation',
    });
  }

  // 3. Email checks (if Resend enabled)
  const resendKey = app.resend_api_key || env.RESEND_API_KEY;
  if (app.resend_enabled && resendKey) {
    const keyCheck = await checkResendApiKey(resendKey);
    checks.push(keyCheck);

    if (keyCheck.status === 'pass' && app.resend_from_email) {
      const domainCheck = await checkResendDomainVerified(resendKey, app.resend_from_email);
      checks.push(domainCheck);

      // Only send test email if explicitly requested
      if (options.sendTestEmail && domainCheck.status === 'pass') {
        const recipient = env.TEST_EMAIL_RECIPIENT || 'admin@cupcycle.au';
        const emailCheck = await checkResendTestEmail(resendKey, app.resend_from_email, recipient);
        checks.push(emailCheck);
      }
    }
  } else if (app.resend_enabled) {
    checks.push({
      check_name: 'Resend API Key Valid',
      category: 'email',
      status: 'fail',
      message: 'Email is enabled but no Resend API key available',
    });
  }

  // 4. Payment checks
  if (app.payment_provider === 'stripe' && app.payment_key) {
    const stripeCheck = await checkStripeApiKey(app.payment_key);
    checks.push(stripeCheck);

    if (stripeCheck.status === 'pass' && app.domain) {
      const webhookCheck = await checkStripeWebhook(app.payment_key, app.domain);
      checks.push(webhookCheck);
    }
  } else if (app.payment_provider === 'square' && app.payment_key) {
    const squareCheck = await checkSquareAccessToken(app.payment_key);
    checks.push(squareCheck);
  } else if (app.payment_provider === 'paypal' && app.payment_key && app.payment_secret) {
    const paypalCheck = await checkPayPalCredentials(app.payment_key, app.payment_secret);
    checks.push(paypalCheck);
  } else if (app.payment_provider) {
    checks.push({
      check_name: `${app.payment_provider} Credentials`,
      category: 'payments',
      status: 'fail',
      message: `${app.payment_provider} is configured but no API key provided for validation`,
    });
  }

  // 5. Database checks
  if (app.d1_database_id && env.CF_ACCOUNT_ID && env.CF_API_TOKEN) {
    const dbCheck = await checkD1Exists(env.CF_ACCOUNT_ID, env.CF_API_TOKEN, app.d1_database_id);
    checks.push(dbCheck);

    if (dbCheck.status === 'pass') {
      const expectedTables = app.expected_tables || resolveExpectedTables(app.template, app.features || []);
      if (expectedTables.length > 0) {
        const tableCheck = await checkD1Tables(
          env.CF_ACCOUNT_ID, env.CF_API_TOKEN, app.d1_database_id, expectedTables
        );
        checks.push(tableCheck);
      }
    }
  }

  // 6. Storage checks
  if (app.r2_bucket_name && env.CF_ACCOUNT_ID && env.CF_API_TOKEN) {
    const bucketCheck = await checkR2BucketExists(env.CF_ACCOUNT_ID, env.CF_API_TOKEN, app.r2_bucket_name);
    checks.push(bucketCheck);
  }

  return {
    checks,
    duration_ms: Date.now() - start,
  };
}

// Save validation results to the database
export async function saveValidationRun(
  db: D1Database,
  appId: string,
  triggeredBy: string,
  checks: CheckResult[],
  durationMs: number
) {
  const passed = checks.filter((c) => c.status === 'pass').length;
  const failed = checks.filter((c) => c.status === 'fail').length;
  const status = failed === 0 ? 'passing' : passed === 0 ? 'failing' : 'partial';

  // Insert run
  const runResult = await db
    .prepare(
      `INSERT INTO validation_runs (app_id, triggered_by, status, total_checks, passed_checks, failed_checks, duration_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(appId, triggeredBy, status, checks.length, passed, failed, durationMs)
    .run();

  const runId = runResult.meta.last_row_id;

  // Insert individual checks
  const stmt = db.prepare(
    `INSERT INTO validation_checks (run_id, app_id, check_name, category, status, message, details, duration_ms)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const batch = checks.map((c) =>
    stmt.bind(runId, appId, c.check_name, c.category, c.status, c.message, c.details || null, c.duration_ms || null)
  );

  await db.batch(batch);

  // Update app validation status
  await db
    .prepare(`UPDATE apps SET last_validated_at = datetime('now'), validation_status = ? WHERE id = ?`)
    .bind(status, appId)
    .run();

  return { runId, status, passed, failed, total: checks.length };
}
