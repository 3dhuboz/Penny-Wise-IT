// PennyWiseIT Showcase — public marketing site at pennywiseit.com.au
import { Hono } from 'hono';
import SHOWCASE_HTML from '../SHOWCASE.html';

type Env = {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
};

const app = new Hono<{ Bindings: Env }>();

const HTML_CACHE_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

app.get('/healthz', (c) => c.json({ ok: true }));

app.get('/', (c) => new Response(SHOWCASE_HTML, { status: 200, headers: HTML_CACHE_HEADERS }));

// SPA-style catch-all so deep links + hash sections (/#about etc.) still hit the page.
// Static asset routes (/manifest.json, /sw.js, /icons/*) are served by the [assets] binding
// before this handler ever runs, so they get long cache headers from the platform.
app.get('*', (c) => new Response(SHOWCASE_HTML, { status: 200, headers: HTML_CACHE_HEADERS }));

export default { fetch: app.fetch };
