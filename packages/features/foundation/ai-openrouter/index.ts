// ai-openrouter — AI completions via OpenRouter
// Supports chat, text generation, model listing, and usage tracking
import { Context } from 'hono';

interface AiEnv {
  OPENROUTER_API_KEY: string;
  OPENROUTER_DEFAULT_MODEL?: string;
  OPENROUTER_SITE_URL?: string;
  OPENROUTER_APP_NAME?: string;
  DB: D1Database;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  model?: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
  purpose?: string; // For usage logging
}

interface AiResult {
  content: string;
  model: string;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  cost?: number;
}

// ============ OPENROUTER API ============

const OPENROUTER_API = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'anthropic/claude-sonnet-4';
const MAX_TOKENS_DEFAULT = 2048;

export async function chatCompletion(env: AiEnv, options: ChatOptions): Promise<AiResult> {
  const model = options.model || env.OPENROUTER_DEFAULT_MODEL || DEFAULT_MODEL;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  };

  if (env.OPENROUTER_SITE_URL) headers['HTTP-Referer'] = env.OPENROUTER_SITE_URL;
  if (env.OPENROUTER_APP_NAME) headers['X-Title'] = env.OPENROUTER_APP_NAME;

  const res = await fetch(`${OPENROUTER_API}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: options.messages,
      max_tokens: options.max_tokens || MAX_TOKENS_DEFAULT,
      temperature: options.temperature ?? 0.7,
      stream: false, // Streaming handled separately if needed
    }),
  });

  if (!res.ok) {
    const error = await res.json() as any;
    throw new Error(error.error?.message || `OpenRouter API error: ${res.status}`);
  }

  const data = await res.json() as any;
  const choice = data.choices?.[0];

  if (!choice) throw new Error('No response from model');

  const result: AiResult = {
    content: choice.message?.content || '',
    model: data.model || model,
    usage: {
      prompt_tokens: data.usage?.prompt_tokens || 0,
      completion_tokens: data.usage?.completion_tokens || 0,
      total_tokens: data.usage?.total_tokens || 0,
    },
    cost: data.usage?.total_cost,
  };

  // Log usage
  try {
    await env.DB.prepare(
      'INSERT INTO ai_log (id, user_id, model, prompt_tokens, completion_tokens, total_cost, purpose, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(),
      null, // User ID set by route handler
      result.model,
      result.usage.prompt_tokens,
      result.usage.completion_tokens,
      result.cost || 0,
      options.purpose || 'chat',
      'success'
    ).run();
  } catch {
    // Don't fail if logging fails
  }

  return result;
}

export async function textGenerate(env: AiEnv, prompt: string, options?: Partial<ChatOptions>): Promise<string> {
  const result = await chatCompletion(env, {
    messages: [{ role: 'user', content: prompt }],
    ...options,
  });
  return result.content;
}

// ============ ROUTE HANDLERS ============

// POST /api/ai/chat — multi-turn conversation
export async function handleChat(c: Context<{ Bindings: AiEnv }>) {
  const user = c.get('user') as any;
  const { messages, model, max_tokens, temperature, purpose } = await c.req.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return c.json({ error: 'messages array is required' }, 400);
  }

  // Validate message format
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return c.json({ error: 'Each message needs role and content' }, 400);
    }
    if (!['system', 'user', 'assistant'].includes(msg.role)) {
      return c.json({ error: `Invalid role: ${msg.role}` }, 400);
    }
  }

  // Rate limiting: max 50 requests per user per hour
  const hourAgo = new Date(Date.now() - 3600000).toISOString();
  const recentCount = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM ai_log WHERE user_id = ? AND created_at > ?"
  ).bind(user?.id || 'anonymous', hourAgo).first();

  if ((recentCount?.count as number) >= 50) {
    return c.json({ error: 'Rate limit exceeded (50 requests/hour)' }, 429);
  }

  try {
    const result = await chatCompletion(c.env, { messages, model, max_tokens, temperature, purpose });

    // Update log with user_id
    if (user?.id) {
      await c.env.DB.prepare(
        "UPDATE ai_log SET user_id = ? WHERE id = (SELECT id FROM ai_log WHERE user_id IS NULL ORDER BY created_at DESC LIMIT 1)"
      ).bind(user.id).run();
    }

    return c.json({
      content: result.content,
      model: result.model,
      usage: result.usage,
    });
  } catch (err: any) {
    // Log failure
    await c.env.DB.prepare(
      'INSERT INTO ai_log (id, user_id, model, purpose, status) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), user?.id || null, model || 'unknown', purpose || 'chat', 'error').run().catch(() => {});

    return c.json({ error: err.message }, 500);
  }
}

// POST /api/ai/generate — simple single-prompt generation
export async function handleGenerate(c: Context<{ Bindings: AiEnv }>) {
  const user = c.get('user') as any;
  const { prompt, model, max_tokens, temperature, system, purpose } = await c.req.json();

  if (!prompt) return c.json({ error: 'prompt is required' }, 400);

  const messages: ChatMessage[] = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: prompt });

  try {
    const result = await chatCompletion(c.env, { messages, model, max_tokens, temperature, purpose: purpose || 'generate' });

    if (user?.id) {
      await c.env.DB.prepare(
        "UPDATE ai_log SET user_id = ? WHERE id = (SELECT id FROM ai_log WHERE user_id IS NULL ORDER BY created_at DESC LIMIT 1)"
      ).bind(user.id).run();
    }

    return c.json({ text: result.content, model: result.model, usage: result.usage });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
}

// GET /api/ai/models — list available models
export async function handleListModels(c: Context<{ Bindings: AiEnv }>) {
  try {
    const res = await fetch(`${OPENROUTER_API}/models`, {
      headers: { Authorization: `Bearer ${c.env.OPENROUTER_API_KEY}` },
    });
    const data = await res.json() as any;

    // Return simplified model list
    const models = (data.data || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      context_length: m.context_length,
      pricing: {
        prompt: m.pricing?.prompt,
        completion: m.pricing?.completion,
      },
    }));

    return c.json({ models, count: models.length });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
}

// GET /api/ai/usage — user's AI usage stats
export async function handleUsage(c: Context<{ Bindings: AiEnv }>) {
  const user = c.get('user') as any;

  const stats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as total_requests,
      SUM(prompt_tokens) as total_prompt_tokens,
      SUM(completion_tokens) as total_completion_tokens,
      SUM(total_cost) as total_cost,
      COUNT(CASE WHEN created_at > datetime('now', '-24 hours') THEN 1 END) as requests_24h,
      COUNT(CASE WHEN created_at > datetime('now', '-1 hour') THEN 1 END) as requests_1h
    FROM ai_log WHERE user_id = ?
  `).bind(user.id).first();

  const byModel = await c.env.DB.prepare(`
    SELECT model, COUNT(*) as count, SUM(total_cost) as cost
    FROM ai_log WHERE user_id = ? GROUP BY model ORDER BY count DESC
  `).bind(user.id).all();

  return c.json({
    usage: stats,
    by_model: byModel.results,
    rate_limit: { max_per_hour: 50, used: stats?.requests_1h || 0 },
  });
}

// GET /api/ai/usage/admin — all usage stats (admin only)
export async function handleAdminUsage(c: Context<{ Bindings: AiEnv }>) {
  const stats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as total_requests,
      SUM(prompt_tokens) as total_prompt_tokens,
      SUM(completion_tokens) as total_completion_tokens,
      SUM(total_cost) as total_cost,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(CASE WHEN created_at > datetime('now', '-24 hours') THEN 1 END) as requests_24h
    FROM ai_log
  `).first();

  const topUsers = await c.env.DB.prepare(`
    SELECT user_id, COUNT(*) as count, SUM(total_cost) as cost
    FROM ai_log WHERE user_id IS NOT NULL GROUP BY user_id ORDER BY cost DESC LIMIT 20
  `).all();

  const topModels = await c.env.DB.prepare(`
    SELECT model, COUNT(*) as count, SUM(total_cost) as cost
    FROM ai_log GROUP BY model ORDER BY count DESC
  `).all();

  const daily = await c.env.DB.prepare(`
    SELECT date(created_at) as day, COUNT(*) as requests, SUM(total_cost) as cost
    FROM ai_log WHERE created_at > datetime('now', '-30 days')
    GROUP BY date(created_at) ORDER BY day DESC
  `).all();

  return c.json({
    overall: stats,
    top_users: topUsers.results,
    top_models: topModels.results,
    daily: daily.results,
  });
}

// ============ FEATURE REGISTRATION ============

export function registerAiOpenrouter(app: any, authMiddleware?: any, adminMiddleware?: any) {
  const auth = authMiddleware || ((c: any, next: any) => next());
  const admin = adminMiddleware || ((c: any, next: any) => next());
  app.post('/api/ai/chat', auth, handleChat);
  app.post('/api/ai/generate', auth, handleGenerate);
  app.get('/api/ai/models', auth, handleListModels);
  app.get('/api/ai/usage', auth, handleUsage);
  app.get('/api/ai/usage/admin', admin, handleAdminUsage);
}
