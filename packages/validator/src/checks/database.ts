// Database (D1) and storage (R2) validation checks
// These use the Cloudflare API since we can't directly access another worker's bindings
import { CheckResult } from '../types';

const CF_API = 'https://api.cloudflare.com/client/v4';

export async function checkD1Exists(
  accountId: string,
  apiToken: string,
  databaseId: string
): Promise<CheckResult> {
  const start = Date.now();
  try {
    const res = await fetch(
      `${CF_API}/accounts/${accountId}/d1/database/${databaseId}`,
      {
        headers: { Authorization: `Bearer ${apiToken}` },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (res.ok) {
      const data: any = await res.json();
      const db = data.result;
      return {
        check_name: 'D1 Database Exists',
        category: 'database',
        status: 'pass',
        message: `Database "${db.name}" exists (${(db.file_size / 1024).toFixed(0)} KB)`,
        details: JSON.stringify({ name: db.name, uuid: db.uuid, size: db.file_size }),
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'D1 Database Exists',
      category: 'database',
      status: 'fail',
      message: `Database ${databaseId} not found (${res.status})`,
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'D1 Database Exists',
      category: 'database',
      status: 'fail',
      message: `Database check failed: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}

export async function checkD1Tables(
  accountId: string,
  apiToken: string,
  databaseId: string,
  expectedTables: string[]
): Promise<CheckResult> {
  const start = Date.now();
  try {
    const res = await fetch(
      `${CF_API}/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY name",
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!res.ok) {
      return {
        check_name: 'D1 Schema Valid',
        category: 'database',
        status: 'fail',
        message: `Could not query database (${res.status})`,
        duration_ms: Date.now() - start,
      };
    }

    const data: any = await res.json();
    const results = data.result?.[0]?.results || [];
    const existingTables = results.map((r: any) => r.name);

    const missing = expectedTables.filter((t) => !existingTables.includes(t));
    const extra = existingTables.filter((t: string) => !expectedTables.includes(t));

    if (missing.length === 0) {
      return {
        check_name: 'D1 Schema Valid',
        category: 'database',
        status: 'pass',
        message: `All ${expectedTables.length} expected tables present${extra.length > 0 ? ` (+${extra.length} extra)` : ''}`,
        details: JSON.stringify({ existing: existingTables, expected: expectedTables }),
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'D1 Schema Valid',
      category: 'database',
      status: 'fail',
      message: `Missing ${missing.length} table(s): ${missing.join(', ')}`,
      details: JSON.stringify({ missing, existing: existingTables, expected: expectedTables }),
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'D1 Schema Valid',
      category: 'database',
      status: 'fail',
      message: `Schema check failed: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}

export async function checkR2BucketExists(
  accountId: string,
  apiToken: string,
  bucketName: string
): Promise<CheckResult> {
  const start = Date.now();
  try {
    const res = await fetch(
      `${CF_API}/accounts/${accountId}/r2/buckets/${bucketName}`,
      {
        headers: { Authorization: `Bearer ${apiToken}` },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (res.ok) {
      return {
        check_name: 'R2 Bucket Exists',
        category: 'storage',
        status: 'pass',
        message: `R2 bucket "${bucketName}" exists and accessible`,
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'R2 Bucket Exists',
      category: 'storage',
      status: 'fail',
      message: `R2 bucket "${bucketName}" not found (${res.status})`,
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'R2 Bucket Exists',
      category: 'storage',
      status: 'fail',
      message: `Bucket check failed: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}
