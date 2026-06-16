import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PRODUCTS, DEFAULT_PRODUCT_ID } from '../products';
import { renderProposal, renderIndex } from './render';
import { renderDemo } from './demo-render';
import { renderDraft, renderDraftFlyer, type DraftPayload } from './draft-render';
import { renderClientPortal, renderContractPage, renderIntakePage, renderWalkthroughPage } from './client-render';

const VALIDATOR_URL = 'https://pennywiseit-validator.steve-700.workers.dev';

const app = new Hono();
app.use('*', cors());

// Index: list all whitelabels
app.get('/', (c) => c.html(renderIndex()));

// Unified proposal+demo: /p/<id>?ref=<rep>  (this is THE link the rep shares)
app.get('/p/:id', (c) => {
  const id = c.req.param('id');
  const product = PRODUCTS[id];
  if (!product) return c.text('Product not found', 404);
  const ref = (c.req.query('ref') || '').toLowerCase();
  return c.html(renderDemo(product, ref));
});

// Backward-compat: /demo/<id> serves the same unified experience
app.get('/demo/:id', (c) => {
  const id = c.req.param('id');
  const product = PRODUCTS[id];
  if (!product) return c.text('Product not found', 404);
  const ref = (c.req.query('ref') || '').toLowerCase();
  return c.html(renderDemo(product, ref));
});

// Pitch Studio — prospect-specific custom draft
async function fetchDraft(slug: string): Promise<DraftPayload | null> {
  try {
    const res = await fetch(`${VALIDATOR_URL}/api/public/drafts/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return await res.json() as DraftPayload;
  } catch { return null; }
}

app.get('/draft/:slug/flyer', async (c) => {
  const draft = await fetchDraft(c.req.param('slug'));
  if (!draft) return c.text('Draft not found', 404);
  return c.html(renderDraftFlyer(draft));
});

app.get('/draft/:slug', async (c) => {
  const draft = await fetchDraft(c.req.param('slug'));
  if (!draft) return c.text('Draft not found \u2014 ask your rep for a fresh link', 404);
  return c.html(renderDraft(draft));
});

// ─────────────── CUSTOMER PORTAL (post-approval) ───────────────
async function fetchClient(token: string): Promise<any | null> {
  try {
    const res = await fetch(`${VALIDATOR_URL}/api/public/client/${encodeURIComponent(token)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

// Main customer portal — single page showing every open item
app.get('/client/:token', async (c) => {
  const data = await fetchClient(c.req.param('token'));
  if (!data) return c.text('Portal not found — please double-check the link from your welcome email, or reply to it.', 404);
  return c.html(renderClientPortal(data));
});

// Contract view + e-sign
app.get('/client/:token/contract/:contract_id', async (c) => {
  const token = c.req.param('token');
  const contractId = c.req.param('contract_id');
  const data = await fetchClient(token);
  if (!data) return c.text('Not found', 404);
  // Fetch full contract HTML
  try {
    const res = await fetch(`${VALIDATOR_URL}/api/public/client/${token}/contract/${contractId}`);
    if (!res.ok) return c.text('Contract not found', 404);
    const contract = await res.json() as any;
    return c.html(renderContractPage({ customer: data.customer, contract, rep: data.rep }));
  } catch { return c.text('Failed to load', 500); }
});

// Intake form (schema-driven per product)
app.get('/client/:token/intake/:intake_id', async (c) => {
  const data = await fetchClient(c.req.param('token'));
  if (!data) return c.text('Not found', 404);
  const intake = (data.intakes || []).find((i: any) => i.id === c.req.param('intake_id'));
  if (!intake) return c.text('Intake form not found', 404);
  return c.html(renderIntakePage({ customer: data.customer, intake }));
});

// Walkthrough page
app.get('/client/:token/walkthrough', async (c) => {
  const data = await fetchClient(c.req.param('token'));
  if (!data) return c.text('Not found', 404);
  const project = (data.projects || []).find((p: any) => p.walkthrough_url);
  if (!project) return c.text('No walkthrough yet', 404);
  return c.html(renderWalkthroughPage({ customer: data.customer, project }));
});

// Public invoice page — anyone with the invoice number can view (it's already in their email)
app.get('/invoice/:invoice_number', async (c) => {
  // Look up invoice via validator (need a public endpoint for that, fold into /api/public/invoice)
  try {
    const res = await fetch(`${VALIDATOR_URL}/api/public/invoice/${encodeURIComponent(c.req.param('invoice_number'))}`);
    if (!res.ok) return c.text('Invoice not found', 404);
    const html = await res.text();
    return c.html(html);
  } catch { return c.text('Failed to load', 500); }
});

// Short referral alias: /r/<CODE> \u2014 looks up the referrer + redirects to a landing
// page that explains who referred them. Sets a cookie so the prospect's draft
// approval picks up the referral automatically.
app.get('/r/:code', async (c) => {
  const code = c.req.param('code').toUpperCase();
  let referrerName: string | null = null;
  try {
    const res = await fetch(`${VALIDATOR_URL}/api/public/referral/${encodeURIComponent(code)}`);
    if (res.ok) {
      const data = await res.json() as { found: boolean; referrer_business_name?: string };
      if (data.found && data.referrer_business_name) referrerName = data.referrer_business_name;
    }
  } catch {}
  // Set a cookie + render a friendly landing page
  const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
  headers.append('Set-Cookie', `pwit_ref=${encodeURIComponent(code)}; Path=/; Max-Age=2592000; SameSite=Lax`);
  const safeCode = code.replace(/[^A-Z0-9-]/g, '');
  const safeName = (referrerName || '').replace(/[<>]/g, '');
  const body = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Referred by ${safeName || 'a Penny Wise I.T customer'}</title>
<style>body{font-family:ui-sans-serif,system-ui,sans-serif;background:#0b0f1a;color:#e8edf5;line-height:1.55;margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem}.wrap{max-width:520px;text-align:center}.brand-logo{width:60px;height:60px;border-radius:14px;background:linear-gradient(135deg,#4f8ef7,#a78bfa);display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:1.6rem;color:white;margin-bottom:1rem}h1{font-size:1.8rem;font-weight:900;margin-bottom:0.5rem}p{color:#a0aec0;margin-bottom:0.75rem}.code{background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.3);color:#c4b5fd;padding:0.4rem 0.85rem;border-radius:999px;font-family:monospace;display:inline-block;margin-bottom:1.5rem}.btn{display:inline-block;background:#4f8ef7;color:white;padding:0.85rem 1.75rem;border-radius:999px;font-weight:800;text-decoration:none;margin:0.4rem}.btn-secondary{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1)}</style>
</head><body><div class="wrap">
  <div class="brand-logo">P</div>
  <h1>${safeName ? safeName + ' sent you' : 'Welcome'}</h1>
  <p>${safeName ? safeName + ' is a Penny Wise I.T customer and referred you to us.' : 'You\u2019ve been invited to check out Penny Wise I.T.'}</p>
  ${safeName ? '<p>If you sign up, <strong style="color:#34d399">they get a free month</strong> and we\u2019ll look after you with the same care we\u2019ve looked after them.</p>' : ''}
  <div class="code">REF: ${safeCode}</div>
  <div>
    <a class="btn" href="/">See what we build</a>
    <a class="btn btn-secondary" href="https://sales.pennywiseit.com.au/apply?ref=${safeCode}">Apply to sell with us</a>
  </div>
  <p style="font-size:0.78rem;margin-top:1.5rem">This referral code is saved in your browser. If you approve a draft from any of our links, the referrer is credited automatically.</p>
</div></body></html>`;
  return new Response(body, { status: 200, headers });
});

// Short alias: /<product-id>
app.get('/:id', (c) => {
  const id = c.req.param('id');
  if (PRODUCTS[id]) {
    const source = (c.req.query('v') || 'direct').toLowerCase();
    return c.html(renderProposal(PRODUCTS[id], source));
  }
  return c.text('Product not found', 404);
});

app.get('/health', (c) => c.json({ status: 'ok', app: 'pennywiseit-demos' }));

export default { fetch: app.fetch };
