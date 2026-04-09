// Clerk authentication validation checks
import { CheckResult } from '../types';

export async function checkClerkSecretKey(clerkSecretKey: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    // Use the Clerk Backend API to verify the key
    const res = await fetch('https://api.clerk.com/v1/clients', {
      headers: { Authorization: `Bearer ${clerkSecretKey}` },
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      return {
        check_name: 'Clerk Secret Key Valid',
        category: 'auth',
        status: 'pass',
        message: 'Clerk secret key is valid and active',
        duration_ms: Date.now() - start,
      };
    }

    if (res.status === 401 || res.status === 403) {
      return {
        check_name: 'Clerk Secret Key Valid',
        category: 'auth',
        status: 'fail',
        message: 'Clerk secret key is invalid or expired',
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Clerk Secret Key Valid',
      category: 'auth',
      status: 'warn',
      message: `Clerk API returned ${res.status}`,
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'Clerk Secret Key Valid',
      category: 'auth',
      status: 'fail',
      message: `Could not reach Clerk: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}

export async function checkClerkRedirectUrls(
  clerkSecretKey: string,
  expectedDomain: string
): Promise<CheckResult> {
  const start = Date.now();
  try {
    // Get the instance settings to check allowed redirect origins
    const res = await fetch('https://api.clerk.com/v1/instance', {
      headers: { Authorization: `Bearer ${clerkSecretKey}` },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return {
        check_name: 'Clerk Redirect URLs',
        category: 'auth',
        status: 'fail',
        message: `Could not fetch Clerk instance config (${res.status})`,
        duration_ms: Date.now() - start,
      };
    }

    const data: any = await res.json();
    const allowedOrigins = data.allowed_origins || [];
    const homeUrl = data.home_url || '';

    const domainInOrigins = allowedOrigins.some(
      (origin: string) => origin.includes(expectedDomain)
    );
    const domainInHome = homeUrl.includes(expectedDomain);

    if (domainInOrigins || domainInHome) {
      return {
        check_name: 'Clerk Redirect URLs',
        category: 'auth',
        status: 'pass',
        message: `Customer domain "${expectedDomain}" is configured in Clerk`,
        details: JSON.stringify({ home_url: homeUrl, allowed_origins: allowedOrigins }),
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Clerk Redirect URLs',
      category: 'auth',
      status: 'fail',
      message: `Customer domain "${expectedDomain}" NOT found in Clerk redirect URLs. Auth login will fail or redirect to wrong domain.`,
      details: JSON.stringify({ home_url: homeUrl, allowed_origins: allowedOrigins }),
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'Clerk Redirect URLs',
      category: 'auth',
      status: 'fail',
      message: `Redirect URL check failed: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}

export async function checkClerkSignInEndpoint(domain: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    // Try hitting a common auth-related path to see if Clerk is wired up
    const res = await fetch(`${url}/api/auth`, {
      method: 'GET',
      headers: { 'User-Agent': 'PennyWiseIT-Validator/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    // We expect either a 401 (auth required = Clerk is working) or a proper response
    if (res.status === 401 || res.status === 403) {
      return {
        check_name: 'Auth Endpoint Active',
        category: 'auth',
        status: 'pass',
        message: `Auth endpoint returns ${res.status} (correctly requires authentication)`,
        duration_ms: Date.now() - start,
      };
    }

    if (res.ok) {
      return {
        check_name: 'Auth Endpoint Active',
        category: 'auth',
        status: 'pass',
        message: 'Auth endpoint responds (200)',
        duration_ms: Date.now() - start,
      };
    }

    return {
      check_name: 'Auth Endpoint Active',
      category: 'auth',
      status: 'warn',
      message: `Auth endpoint returned ${res.status} — may need investigation`,
      duration_ms: Date.now() - start,
    };
  } catch (err: any) {
    return {
      check_name: 'Auth Endpoint Active',
      category: 'auth',
      status: 'warn',
      message: `Auth endpoint not reachable: ${err.message}`,
      duration_ms: Date.now() - start,
    };
  }
}
