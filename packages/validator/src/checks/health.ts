// Health check — hits the app's /api/health endpoint
// Falls back to CF API verification for same-account *.workers.dev domains
import { CheckResult } from '../types';

// Extract worker name from workers.dev domain (e.g. "coastal-candles.steve-700.workers.dev" → "coastal-candles")
function getWorkerName(domain: string): string | null {
  const match = domain.replace(/^https?:\/\//, '').match(/^([^.]+)\.[^.]+\.workers\.dev$/);
  return match ? match[1] : null;
}

async function verifyWorkerViaAPI(
  workerName: string,
  accountId: string,
  apiToken: string
): Promise<{ exists: boolean; message: string }> {
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`,
      {
        headers: { Authorization: `Bearer ${apiToken}` },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (res.ok) {
      return { exists: true, message: `Worker "${workerName}" exists (verified via CF API)` };
    }
    return { exists: false, message: `Worker "${workerName}" not found via CF API (${res.status})` };
  } catch (err: any) {
    return { exists: false, message: `CF API check failed: ${err.message}` };
  }
}

export async function checkHealth(
  domain: string,
  accountId?: string,
  apiToken?: string
): Promise<CheckResult> {
  const start = Date.now();
  try {
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    const res = await fetch(`${url}/api/health`, {
      method: 'GET',
      headers: { 'User-Agent': 'PennyWiseIT-Validator/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    const duration = Date.now() - start;

    if (res.ok) {
      return {
        check_name: 'Worker Health Endpoint',
        category: 'health',
        status: 'pass',
        message: `Health endpoint responded ${res.status} in ${duration}ms`,
        duration_ms: duration,
      };
    }

    // If 404 on a workers.dev domain, it's likely a same-account fetch issue
    const workerName = getWorkerName(domain);
    if (res.status === 404 && workerName && accountId && apiToken) {
      const apiCheck = await verifyWorkerViaAPI(workerName, accountId, apiToken);
      return {
        check_name: 'Worker Health Endpoint',
        category: 'health',
        status: apiCheck.exists ? 'pass' : 'fail',
        message: apiCheck.exists
          ? `${apiCheck.message} (direct fetch returned 404 — same-account workers.dev limitation)`
          : `Health endpoint returned 404 and ${apiCheck.message}`,
        details: JSON.stringify({ status: res.status, workerName, apiVerified: apiCheck.exists }),
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Worker Health Endpoint',
      category: 'health',
      status: 'fail',
      message: `Health endpoint returned ${res.status} ${res.statusText}`,
      details: JSON.stringify({ status: res.status, statusText: res.statusText }),
      duration_ms: duration,
    };
  } catch (err: any) {
    return {
      check_name: 'Worker Health Endpoint',
      category: 'health',
      status: 'fail',
      message: `Health endpoint unreachable: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}

export async function checkWorkerResponds(
  domain: string,
  accountId?: string,
  apiToken?: string
): Promise<CheckResult> {
  const start = Date.now();
  try {
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'PennyWiseIT-Validator/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    const duration = Date.now() - start;
    const cfRay = res.headers.get('cf-ray');

    if (res.ok || res.status === 308 || res.status === 301 || res.status === 302) {
      return {
        check_name: 'Worker Responds',
        category: 'health',
        status: 'pass',
        message: `Domain responds (${res.status}) via Cloudflare${cfRay ? ` [ray: ${cfRay}]` : ''}`,
        duration_ms: duration,
      };
    }

    // If 404 on a workers.dev domain, fall back to CF API
    const workerName = getWorkerName(domain);
    if (res.status === 404 && workerName && accountId && apiToken) {
      const apiCheck = await verifyWorkerViaAPI(workerName, accountId, apiToken);
      return {
        check_name: 'Worker Responds',
        category: 'health',
        status: apiCheck.exists ? 'pass' : 'fail',
        message: apiCheck.exists
          ? `${apiCheck.message} (direct fetch returned 404 — same-account workers.dev limitation)`
          : `Domain returned 404 and ${apiCheck.message}`,
        details: JSON.stringify({ workerName, apiVerified: apiCheck.exists }),
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Worker Responds',
      category: 'health',
      status: 'fail',
      message: `Domain returned ${res.status} ${res.statusText}`,
      duration_ms: duration,
    };
  } catch (err: any) {
    return {
      check_name: 'Worker Responds',
      category: 'health',
      status: 'fail',
      message: `Domain unreachable: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}
