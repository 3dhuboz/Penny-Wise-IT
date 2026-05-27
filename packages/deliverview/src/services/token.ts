// Magic token: base64url(handoverId:timestamp:hmac)
// HMAC-SHA256 signed with MAGIC_TOKEN_SECRET

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function generateMagicToken(handoverId: string, secret: string): Promise<string> {
  const timestamp = Date.now().toString();
  const payload = `${handoverId}:${timestamp}`;
  const hmac = await hmacSign(secret, payload);
  const raw = `${payload}:${hmac}`;
  return btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function verifyMagicToken(
  token: string,
  secret: string
): Promise<{ valid: boolean; handoverId?: string }> {
  try {
    // Restore base64 padding
    const padded = token.replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(padded);
    const parts = raw.split(':');
    if (parts.length !== 3) return { valid: false };

    const [handoverId, timestamp, providedHmac] = parts;
    const payload = `${handoverId}:${timestamp}`;
    const expectedHmac = await hmacSign(secret, payload);

    if (providedHmac !== expectedHmac) return { valid: false };

    return { valid: true, handoverId };
  } catch {
    return { valid: false };
  }
}
