import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env, AppVariables } from './types';
import { clerkAuth } from './middleware/auth';
import clips from './routes/clips';
import handovers from './routes/handovers';
import viewer from './routes/viewer';
import clients from './routes/clients';
import webhooks from './routes/webhooks';
import ai from './routes/ai';
import { processAutoReminders } from './cron';

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// CORS — allow both frontend and viewer origins
app.use(
  '/api/*',
  cors({
    origin: (origin, c) => {
      const allowed = [c.env.FRONTEND_URL, c.env.VIEWER_URL, 'http://localhost:5173', 'http://localhost:5174'];
      return allowed.includes(origin) ? origin : '';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);

// Health check — no auth
app.get('/api/health', (c) =>
  c.json({ status: 'ok', app: 'pennywiseit-deliverview', version: '1.0.0' })
);

// Webhook routes — no Clerk auth (use their own verification)
app.route('/api/webhooks', webhooks);

// Public viewer routes — token-based, no Clerk
app.route('/api/view', viewer);

// All other /api routes require Clerk auth
app.use('/api/*', clerkAuth);
app.route('/api/clips', clips);
app.route('/api/handovers', handovers);
app.route('/api/clients', clients);
app.route('/api/ai', ai);

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(processAutoReminders(env));
  },
};
