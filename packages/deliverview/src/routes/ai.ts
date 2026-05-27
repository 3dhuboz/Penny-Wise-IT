import { Hono } from 'hono';
import type { Env, AppVariables } from '../types';

const ai = new Hono<{ Bindings: Env; Variables: AppVariables }>();

ai.post('/summary', async (c) => {
  return c.json({ message: 'AI summary generation — Phase 5' }, 501);
});

export default ai;
