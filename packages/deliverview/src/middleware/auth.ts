import { createMiddleware } from 'hono/factory';
import { verifyToken } from '@clerk/backend';
import type { Env, AppVariables } from '../types';

export const clerkAuth = createMiddleware<{
  Bindings: Env;
  Variables: AppVariables;
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyToken(token, {
      secretKey: c.env.CLERK_SECRET_KEY,
    });

    c.set('userId', payload.sub);
    c.set('userEmail', (payload as Record<string, unknown>).email as string ?? '');
    await next();
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
});
