// Pitch Studio — renders a prospect-specific multi-product draft page.
// The salesperson chose 1+ products in the admin Pitch Studio. Here we stitch
// the existing per-product demo bodies into one branded page, themed with the
// prospect's colours/logo, with per-section feedback controls.

import { PRODUCTS, type ProductConfig } from '../products';
import {
  bf,
  foodTruckDemo, onlineStoreDemo, tradieDemo, festivalDemo,
  deliveryDemo, aiSocialDemo, carHireDemo, butchersDemo, sportsClubDemo,
} from './demo-render';

const esc = (s: string) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] || c));

export type DraftPayload = {
  slug: string;
  prospect_name: string;
  prospect_suburb?: string | null;
  industry_label?: string | null;
  products: string[];
  brand_color: string;
  accent_color: string;
  logo_url?: string | null;
  tagline?: string | null;
  vibe?: string | null;
  design_brief?: string | null;
  facebook_url?: string | null;
  rep?: { name: string; first_name: string; phone?: string | null; booking_url?: string | null; username?: string | null } | null;
};

// Vibe presets — typography + density per the prospect's industry feel.
// The salesperson picks one in the create form; we inject the matching CSS
// into the draft page so a "gritty workshop" looks gritty and a "premium
// fine-dining" looks premium without requiring a designer in the loop.
export const VIBES: Record<string, { label: string; bodyFont: string; displayFont: string; importLine: string; tilt: string; pillRadius: string; cardRadius: string; texture: string; }> = {
  'minimal': {
    label: 'Minimal · clean SaaS',
    bodyFont: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
    displayFont: '"Inter", ui-sans-serif, system-ui, sans-serif',
    importLine: '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap");',
    tilt: '0deg', pillRadius: '999px', cardRadius: '14px', texture: 'none',
  },
  'gritty': {
    label: 'Gritty · workshop / trades',
    bodyFont: '"Roboto Condensed", ui-sans-serif, system-ui, sans-serif',
    displayFont: '"Bebas Neue", "Oswald", Impact, sans-serif',
    importLine: '@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Condensed:wght@400;700&display=swap");',
    tilt: '-1deg', pillRadius: '4px', cardRadius: '4px',
    texture: 'background-image: repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.015) 12px, rgba(255,255,255,0.015) 13px);',
  },
  'premium': {
    label: 'Premium · luxury / fine dining',
    bodyFont: '"Cormorant Garamond", Georgia, serif',
    displayFont: '"Playfair Display", Georgia, serif',
    importLine: '@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Playfair+Display:wght@700;900&display=swap");',
    tilt: '0deg', pillRadius: '2px', cardRadius: '2px', texture: 'none',
  },
  'fun': {
    label: 'Fun · food trucks / kids / festivals',
    bodyFont: '"Quicksand", ui-sans-serif, system-ui, sans-serif',
    displayFont: '"Fredoka", "Quicksand", system-ui, sans-serif',
    importLine: '@import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Quicksand:wght@500;700&display=swap");',
    tilt: '-1.5deg', pillRadius: '999px', cardRadius: '24px', texture: 'none',
  },
  'corporate': {
    label: 'Corporate · B2B / professional services',
    bodyFont: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
    displayFont: '"IBM Plex Sans", system-ui, sans-serif',
    importLine: '@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap");',
    tilt: '0deg', pillRadius: '4px', cardRadius: '6px', texture: 'none',
  },
  'bold': {
    label: 'Bold · gym / action / automotive',
    bodyFont: '"Barlow", ui-sans-serif, system-ui, sans-serif',
    displayFont: '"Anton", "Bebas Neue", Impact, sans-serif',
    importLine: '@import url("https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;700;900&display=swap");',
    tilt: '-2deg', pillRadius: '2px', cardRadius: '2px',
    texture: 'background-image: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%);',
  },
};

const VALIDATOR_URL = 'https://pennywiseit-validator.steve-700.workers.dev';

// Each product gets a label for the quick-jump nav
const PRODUCT_NAV_LABEL: Record<string, string> = {
  'food-truck': 'Online Ordering',
  'online-store': 'Your Online Store',
  'tradie': 'Job Booking & Quotes',
  'festival': 'Event App',
  'delivery': 'Delivery Dispatch',
  'ai-social': 'Community Platform',
  'car-hire': 'Vehicle Rentals',
  'butchers': 'Butcher Online Orders',
  'sports-club': 'Sports Club Hub',
};

function brandedSampleFor(productId: string, draft: DraftPayload) {
  // Reuse the "sample brand" idea but populate with the PROSPECT's details.
  // Logo emoji is used only when no logo_url is given.
  const emojiByProduct: Record<string, string> = {
    'food-truck': '🌮', 'online-store': '🛒', 'tradie': '🔧', 'festival': '🎪',
    'delivery': '🚚', 'ai-social': '💬', 'car-hire': '🚗', 'butchers': '🥩', 'sports-club': '🏉',
  };
  return {
    name: draft.prospect_name,
    tagline: draft.tagline || `${draft.prospect_name} — your branded ${PRODUCT_NAV_LABEL[productId] || 'app'}`,
    suburb: draft.prospect_suburb || 'Your area',
    phone: '(your number)',
    logo_emoji: emojiByProduct[productId] || '🏢',
  };
}

function renderProductSection(productId: string, draft: DraftPayload): string {
  const product: ProductConfig | undefined = PRODUCTS[productId];
  if (!product) return '';
  const sample = brandedSampleFor(productId, draft);
  let body = '';
  switch (productId) {
    case 'food-truck':       body = foodTruckDemo(sample); break;
    case 'online-store':     body = onlineStoreDemo(sample); break;
    case 'tradie':           body = tradieDemo(sample); break;
    case 'festival':         body = festivalDemo(sample); break;
    case 'delivery':         body = deliveryDemo(sample, product); break;
    case 'ai-social':        body = aiSocialDemo(sample); break;
    case 'car-hire':         body = carHireDemo(sample); break;
    case 'butchers':         body = butchersDemo(sample); break;
    case 'sports-club':      body = sportsClubDemo(sample); break;
    default: body = '<p>Demo coming soon.</p>';
  }
  const navLabel = PRODUCT_NAV_LABEL[productId] || product.brand;
  // Wrap each product's demo in a section anchor + feedback footer
  return `
  <section id="sec-${productId}" class="prod-section">
    <div class="prod-divider">
      <span class="prod-divider-pill">${esc(navLabel.toUpperCase())} \u00b7 Module ${esc(String(draft.products.indexOf(productId) + 1))} of ${esc(String(draft.products.length))}</span>
    </div>
    ${body}
    <div class="section-feedback">
      <div class="sf-prompt">
        <span>How does <strong>${esc(navLabel)}</strong> look for ${esc(draft.prospect_name)}?</span>
        <div class="sf-thumbs">
          <button class="sf-thumb" data-section="${esc(productId)}" data-thumb="up" onclick="sendFeedback(this)" title="Looks great">\u{1F44D}</button>
          <button class="sf-thumb" data-section="${esc(productId)}" data-thumb="down" onclick="sendFeedback(this)" title="Not quite">\u{1F44E}</button>
          <button class="sf-comment" data-section="${esc(productId)}" onclick="openCommentFor('${esc(productId)}','${esc(navLabel)}')">\u270F\uFE0F Comment</button>
        </div>
      </div>
      <div id="sf-status-${esc(productId)}" class="sf-status"></div>
    </div>
  </section>
  `;
}

export function renderDraft(draft: DraftPayload): string {
  const brand = draft.brand_color || '#4f8ef7';
  const accent = draft.accent_color || '#a78bfa';
  // Auto-derived tertiary colour for gradients: lighten the brand
  const tertiary = '#34d399';
  const vibe = VIBES[draft.vibe || 'minimal'] || VIBES['minimal'];
  const productSections = draft.products.map(p => renderProductSection(p, draft)).join('\n');
  const navLinks = draft.products.map(p => `<a href="#sec-${p}">${esc(PRODUCT_NAV_LABEL[p] || PRODUCTS[p]?.brand || p)}</a>`).join('');
  const repFirstName = draft.rep?.first_name || 'your Penny Wise I.T rep';
  const repPhone = draft.rep?.phone || '';
  const logoHtml = draft.logo_url
    ? `<img src="${esc(draft.logo_url)}" alt="${esc(draft.prospect_name)} logo" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`
    : (PRODUCTS[draft.products[0]]?.brand?.[0] || draft.prospect_name[0] || '?').toUpperCase();

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(draft.prospect_name)} \u2014 Your custom draft from Penny Wise I.T</title>
<style>
${vibe.importLine}
:root {
  --bg:#0b0f1a; --surface:#141b2d; --card:#1a2338; --border:#1f2d45;
  --text:#e8edf5; --muted:#6b7fa3; --soft:#a0aec0;
  --brand:${brand}; --g1:${brand}; --g2:${accent}; --g3:${tertiary};
  --vibe-body:${vibe.bodyFont}; --vibe-display:${vibe.displayFont}; --vibe-radius:${vibe.cardRadius}; --vibe-pill:${vibe.pillRadius};
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--text); font-family: var(--vibe-body); min-height: 100vh; line-height: 1.55; padding-bottom: 110px; ${vibe.texture} }
body::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:0; background: radial-gradient(ellipse 600px 400px at 80% 10%, ${brand}1f, transparent 60%), radial-gradient(ellipse 500px 300px at 15% 80%, ${accent}19, transparent 60%); }
.display { font-family: var(--vibe-display) !important; transform: rotate(${vibe.tilt}); }
.panel { border-radius: var(--vibe-radius) !important; }
.modal-card { border-radius: var(--vibe-radius) !important; }
.nav-cta, .get-bar-cta, .btn-brand { border-radius: var(--vibe-pill) !important; font-family: var(--vibe-body); }

.draft-banner { position:sticky; top:0; z-index:60; background:linear-gradient(90deg,${brand},${accent}); color:#0b0f1a; text-align:center; font-size:0.74rem; font-weight:800; letter-spacing:0.04em; padding:0.4rem 1rem; }
.draft-banner strong { font-weight:900; }

nav.top { position:sticky; top:24px; z-index:55; background:rgba(11,15,26,0.94); backdrop-filter:blur(14px); border-bottom:1px solid rgba(255,255,255,0.06); padding:0.85rem 1.5rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
.brand { display:flex; align-items:center; gap:0.7rem; font-weight:800; font-size:1.05rem; min-width:0; }
.brand-logo { width:42px; height:42px; border-radius:11px; background:linear-gradient(135deg,${brand},${accent}); display:flex; align-items:center; justify-content:center; font-size:1.3rem; box-shadow:0 4px 16px ${brand}66; flex-shrink:0; overflow:hidden; }
.brand-name { display:flex; flex-direction:column; min-width:0; }
.brand-name .biz { font-weight:900; letter-spacing:-0.01em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.brand-name .meta { font-size:0.62rem; color:var(--muted); font-weight:600; letter-spacing:0.08em; text-transform:uppercase; }

.nav-links { display:flex; gap:0.4rem; flex-wrap:wrap; }
.nav-links a { font-size:0.74rem; color:var(--soft); text-decoration:none; padding:0.35rem 0.7rem; border-radius:999px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); white-space:nowrap; }
.nav-links a:hover { color:var(--text); border-color:${brand}66; }

.nav-cta { background:${brand}; color:#0b0f1a; padding:0.55rem 1.1rem; border-radius:999px; font-weight:800; font-size:0.82rem; text-decoration:none; box-shadow:0 4px 16px ${brand}66; cursor:pointer; border:none; font-family:inherit; }

main { max-width:1100px; margin:0 auto; padding:2rem 1.5rem 4rem; position:relative; z-index:1; }
.display { font-family:"Impact","Haettenschweiler","Franklin Gothic Bold",system-ui,sans-serif; font-weight:900; letter-spacing:-0.01em; text-transform:uppercase; line-height:0.95; }

.hero { padding:1.5rem 0 2.5rem; }
.hero .pill { display:inline-flex; gap:0.4rem; align-items:center; background:${brand}1c; color:${brand}; padding:0.4rem 0.95rem; border-radius:999px; font-size:0.7rem; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:1rem; border:1px solid ${brand}3a; }
.hero h1 { font-size:clamp(2.5rem,6vw,4.5rem); margin-bottom:0.5rem; }
.hero h1 .grad { background:linear-gradient(135deg,${brand},${accent} 50%,${tertiary}); -webkit-background-clip:text; background-clip:text; color:transparent; }
.hero .made-for { display:inline-block; font-size:0.78rem; color:var(--muted); font-style:italic; margin-top:0.5rem; padding:0.25rem 0.7rem; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:999px; }
.hero .tagline { font-size:1.15rem; color:var(--soft); max-width:680px; margin:1.25rem 0 1.75rem; line-height:1.55; }
.hero-ctas { display:flex; gap:0.6rem; flex-wrap:wrap; }

.draft-callout { display:flex; gap:1rem; align-items:flex-start; background:linear-gradient(135deg,${brand}10,${accent}0c); border:1px solid ${brand}33; border-radius:14px; padding:1rem 1.25rem; margin-top:1.5rem; }
.draft-callout .dc-icon { font-size:1.6rem; flex-shrink:0; line-height:1; }
.draft-callout .dc-body { flex:1; font-size:0.88rem; color:var(--soft); line-height:1.55; }
.draft-callout .dc-body strong { color:var(--text); }

/* Section divider between products */
.prod-section { margin:0; padding:0; }
.prod-divider { display:flex; align-items:center; justify-content:center; margin:3rem 0 1.5rem; position:relative; }
.prod-divider::before, .prod-divider::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,transparent,${brand}55,transparent); }
.prod-divider-pill { padding:0.4rem 1rem; background:${brand}1a; color:${brand}; border:1px solid ${brand}44; border-radius:999px; font-size:0.65rem; font-weight:900; letter-spacing:0.12em; margin:0 1rem; }

/* Per-section feedback footer */
.section-feedback { margin:1.25rem 0 0; padding:1rem 1.25rem; background:rgba(255,255,255,0.03); border:1px dashed rgba(255,255,255,0.08); border-radius:12px; }
.sf-prompt { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
.sf-prompt > span { font-size:0.85rem; color:var(--soft); flex:1; min-width:200px; }
.sf-thumbs { display:flex; gap:0.4rem; }
.sf-thumb, .sf-comment { background:var(--card); color:var(--text); border:1px solid var(--border); padding:0.5rem 0.85rem; border-radius:8px; cursor:pointer; font-size:0.85rem; font-family:inherit; transition:all 0.15s; }
.sf-thumb:hover, .sf-comment:hover { border-color:${brand}; transform:translateY(-1px); }
.sf-thumb.sent { background:${brand}; color:#0b0f1a; border-color:${brand}; font-weight:800; }
.sf-status { margin-top:0.5rem; font-size:0.78rem; color:#34d399; min-height:1em; }

/* Sticky CTA bar */
.get-bar { position:fixed; left:0; right:0; bottom:0; z-index:90; background:rgba(11,15,26,0.96); backdrop-filter:blur(14px); border-top:1px solid ${brand}55; padding:0.85rem 1.25rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; box-shadow:0 -8px 30px rgba(0,0,0,0.45); }
.get-bar-label { font-size:0.85rem; color:var(--soft); }
.get-bar-label strong { color:var(--text); }
.get-bar-cta { background:${brand}; color:#0b0f1a; padding:0.8rem 1.6rem; border-radius:999px; font-weight:800; border:none; cursor:pointer; font-family:inherit; font-size:0.92rem; box-shadow:0 4px 20px ${brand}88; }
.get-bar-flyer { background:rgba(255,255,255,0.06); color:var(--text); border:1px solid rgba(255,255,255,0.12); padding:0.8rem 1.2rem; border-radius:999px; font-weight:700; cursor:pointer; font-family:inherit; font-size:0.85rem; text-decoration:none; }

/* Comment modal */
.modal-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.72); z-index:300; align-items:center; justify-content:center; backdrop-filter:blur(8px); padding:1rem; overflow-y:auto; }
.modal-overlay.open { display:flex; }
.modal-card { background:linear-gradient(160deg,rgba(26,35,56,0.97),rgba(20,27,45,0.95)); border:1px solid ${brand}40; border-radius:18px; padding:1.75rem; max-width:480px; width:100%; position:relative; box-shadow:0 20px 80px rgba(0,0,0,0.6), 0 0 80px ${brand}22; }
.modal-close { position:absolute; top:0.85rem; right:0.85rem; background:rgba(255,255,255,0.08); border:none; width:30px; height:30px; border-radius:50%; color:var(--soft); cursor:pointer; font-size:1rem; }
.modal-card h3 { font-size:1.3rem; margin-bottom:0.4rem; }

.form-row { display:flex; flex-direction:column; gap:0.3rem; margin-bottom:0.85rem; }
.form-row label { font-size:0.65rem; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); }
.form-row input, .form-row textarea { background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:0.65rem 0.85rem; color:var(--text); font-family:inherit; font-size:0.92rem; outline:none; }
.form-row input:focus, .form-row textarea:focus { border-color:${brand}; }

/* Rep card */
.rep-card { background:linear-gradient(135deg,${brand}14,${accent}10); border:1px solid ${brand}44; border-radius:14px; padding:1.1rem 1.25rem; margin-top:1rem; display:flex; align-items:center; gap:0.85rem; }
.rep-avatar { width:46px; height:46px; border-radius:50%; background:linear-gradient(135deg,${brand},${accent}); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.15rem; color:#0b0f1a; flex-shrink:0; }
.rep-info { flex:1; font-size:0.88rem; }
.rep-info strong { display:block; color:var(--text); }
.rep-info .sub { color:var(--soft); font-size:0.78rem; margin-top:0.1rem; }

footer { text-align:center; padding:2rem 1.5rem; color:var(--muted); font-size:0.82rem; border-top:1px solid rgba(255,255,255,0.05); margin-top:3rem; margin-bottom:-30px; }
footer a { color:var(--soft); }
.toast { position:fixed; bottom:7rem; left:50%; transform:translateX(-50%) translateY(40px); background:${brand}; color:#0b0f1a; padding:0.75rem 1.25rem; border-radius:10px; font-weight:800; opacity:0; transition:all 0.3s; z-index:200; box-shadow:0 8px 30px ${brand}88; pointer-events:none; }
.toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
</style>
</head><body>

<div class="draft-banner">
  \u2728 This is a <strong>draft</strong> built specifically for ${esc(draft.prospect_name)}. Click around \u2014 it all works.
  <span style="opacity:0.85"> \u00b7 Made by ${esc(repFirstName)} at Penny Wise I.T</span>
</div>

<nav class="top">
  <div class="brand">
    <div class="brand-logo">${logoHtml}</div>
    <div class="brand-name">
      <div class="biz">${esc(draft.prospect_name)}</div>
      <div class="meta">${esc(draft.industry_label || draft.prospect_suburb || 'Your custom draft')}</div>
    </div>
  </div>
  <div class="nav-links">${navLinks}</div>
  <button class="nav-cta" onclick="openGetThis()">\u{1F680} I want this</button>
</nav>

<main>
  <section class="hero">
    <div class="pill">\u2728 Custom draft \u00b7 ${draft.products.length} module${draft.products.length > 1 ? 's' : ''} included</div>
    <h1 class="display"><span class="grad">${esc(draft.prospect_name)}</span></h1>
    <div class="made-for">Built for ${esc(draft.prospect_name)} by ${esc(repFirstName)} \u00b7 Penny Wise I.T</div>
    ${draft.tagline ? `<p class="tagline">${esc(draft.tagline)}</p>` : `<p class="tagline">A working version of your business app, ready to play with. Tap through every feature \u2014 it all works. When you're happy, hit "I want this" and we'll launch your real version this week.</p>`}
    <div class="hero-ctas">
      <a href="#sec-${esc(draft.products[0])}" class="nav-cta" style="padding:0.85rem 1.5rem;font-size:0.9rem">\u{1F447} Start playing</a>
      <a href="/draft/${esc(draft.slug)}/flyer" target="_blank" class="get-bar-flyer" style="padding:0.85rem 1.5rem">\u{1F4C4} Print one-page flyer</a>
    </div>

    <div class="draft-callout">
      <div class="dc-icon">\u{1F4A1}</div>
      <div class="dc-body">
        <strong>This isn't a generic demo.</strong> Every section below is the actual app you'd own \u2014 same code, same buttons, same workflow. We've themed it with placeholder branding for ${esc(draft.prospect_name)}; on launch it would use your real logo, photos, prices, and customers. <strong>Use the \u{1F44D}/\u{1F44E}/comment buttons under each section</strong> to tell us what to keep, change, or add.
      </div>
    </div>
    <div id="rep-card-slot"></div>
  </section>

  ${productSections}

  <section class="prod-section" style="margin-top:3rem">
    <div class="prod-divider"><span class="prod-divider-pill">READY?</span></div>
    <div style="background:linear-gradient(135deg,${brand}1a,${accent}14,${tertiary}1a);border:1px solid ${brand}44;border-radius:18px;padding:2rem;text-align:center">
      <h2 class="display" style="font-size:clamp(1.75rem,4vw,2.5rem);margin-bottom:0.75rem">Like what you see, ${esc(draft.prospect_name.split(' ')[0])}?</h2>
      <p style="color:var(--soft);max-width:600px;margin:0 auto 1.5rem;font-size:1rem;line-height:1.55">Two ways forward. Either suggest changes first (use the \u270F\uFE0F buttons above), or hit Approve and we lock it in \u2014 contract and deposit invoice land in your inbox in 60 seconds, app live within a week of receiving your info.</p>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center">
        <button class="nav-cta" style="padding:1rem 2rem;font-size:1rem" onclick="openApprove()">\u2705 Approve \u2014 build it for real</button>
        <button class="get-bar-flyer" style="padding:1rem 1.5rem;font-size:0.95rem" onclick="openGetThis()">\u{1F4AC} Just send a message first</button>
      </div>
      <div style="margin-top:0.75rem;font-size:0.78rem;color:var(--muted)">Approving creates a contract you can read before signing. No payment until you sign.</div>
    </div>
  </section>
</main>

<div id="toast" class="toast"></div>

<div class="get-bar">
  <div class="get-bar-label">Loving it? <strong>Tell ${esc(repFirstName)} you want this.</strong></div>
  <div style="display:flex;gap:0.5rem">
    <a href="/draft/${esc(draft.slug)}/flyer" target="_blank" class="get-bar-flyer">\u{1F4C4} Flyer</a>
    <button class="get-bar-cta" onclick="openGetThis()">\u{1F680} I want this</button>
  </div>
</div>

<div id="comment-modal" class="modal-overlay" onclick="if(event.target===this)closeComment()">
  <div class="modal-card">
    <button class="modal-close" onclick="closeComment()">\u00d7</button>
    <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${brand};margin-bottom:0.4rem" id="cm-section-label">Comment on this section</div>
    <h3 class="display">What would you change?</h3>
    <p style="color:var(--soft);font-size:0.86rem;margin:0.4rem 0 1rem">Be specific \u2014 "the colour", "needs a 'X' button", "love it but make Y bigger". Goes straight to ${esc(repFirstName)}.</p>
    <div class="form-row"><label>Your message *</label><textarea id="cm-message" rows="4" placeholder="e.g. Love the menu, but I'd want my logo in the header, and a section for catering quotes..." required></textarea></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
      <div class="form-row"><label>Your name</label><input type="text" id="cm-name" placeholder="${esc(draft.prospect_name)}"></div>
      <div class="form-row"><label>Phone or email</label><input type="text" id="cm-contact" placeholder="0412 345 678 or you@business.com"></div>
    </div>
    <button id="cm-submit" class="nav-cta" style="width:100%;padding:0.85rem;font-size:0.95rem;margin-top:0.5rem" onclick="submitComment()">\u{1F4E8} Send to ${esc(repFirstName)}</button>
    <div id="cm-status" style="margin-top:0.5rem;font-size:0.82rem;text-align:center;color:var(--soft);min-height:1em"></div>
  </div>
</div>

<div id="approve-modal" class="modal-overlay" onclick="if(event.target===this)closeApprove()">
  <div class="modal-card">
    <button class="modal-close" onclick="closeApprove()">\u00d7</button>
    <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${brand};margin-bottom:0.4rem">\u2705 Approve &amp; build it for real</div>
    <h3 class="display">Let\u2019s lock it in.</h3>
    <p style="color:var(--soft);font-size:0.86rem;margin:0.4rem 0 1rem">Confirm a few things and we\u2019ll set up your project portal. <strong>No payment yet</strong> \u2014 you sign the contract first, then the 50% deposit invoice goes out.</p>
    <div class="form-row"><label>Business legal name *</label><input type="text" id="ap-biz-name" value="${esc(draft.prospect_name)}" placeholder="As registered with ASIC"></div>
    <div class="form-row"><label>Your name *</label><input type="text" id="ap-name" placeholder="Sarah Mitchell" required></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
      <div class="form-row"><label>Email *</label><input type="email" id="ap-email" placeholder="sarah@${esc((draft.prospect_name || 'business').toLowerCase().replace(/[^a-z]/g, '').slice(0, 12))}.com.au" required></div>
      <div class="form-row"><label>Phone</label><input type="tel" id="ap-phone" placeholder="0412 345 678"></div>
    </div>
    <div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.25);border-radius:8px;padding:0.7rem 0.9rem;margin-bottom:1rem;font-size:0.78rem;color:var(--soft);line-height:1.55">
      \u2713 You\u2019ll get a portal link by email immediately<br>
      \u2713 Sign the contract online (2 mins) \u2014 then the 50% deposit invoice fires<br>
      \u2713 We start building the moment the deposit clears + you\u2019ve sent your info
    </div>
    <button id="ap-submit" class="nav-cta" style="width:100%;padding:0.85rem;font-size:0.95rem;margin-top:0.5rem" onclick="submitApprove()">\u2705 Approve &amp; send me the contract</button>
    <div id="ap-status" style="margin-top:0.5rem;font-size:0.82rem;text-align:center;color:var(--soft);min-height:1em"></div>
  </div>
</div>

<div id="get-modal" class="modal-overlay" onclick="if(event.target===this)closeGetThis()">
  <div class="modal-card">
    <button class="modal-close" onclick="closeGetThis()">\u00d7</button>
    <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${brand};margin-bottom:0.4rem">I want this for my business</div>
    <h3 class="display">Let's launch the real one.</h3>
    <p style="color:var(--soft);font-size:0.86rem;margin:0.4rem 0 1rem">Drop a quick note for ${esc(repFirstName)} \u2014 they'll send you the final quote and timeline.</p>
    <div class="form-row"><label>Your name *</label><input type="text" id="g-name" placeholder="Sarah Mitchell" required></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
      <div class="form-row"><label>Phone</label><input type="tel" id="g-phone" placeholder="0412 345 678"></div>
      <div class="form-row"><label>Email *</label><input type="email" id="g-email" placeholder="sarah@email.com" required></div>
    </div>
    <div class="form-row"><label>Anything specific? (optional)</label><textarea id="g-note" rows="2" placeholder="Anything you'd want changed or added before launch..."></textarea></div>
    <button id="g-submit" class="nav-cta" style="width:100%;padding:0.85rem;font-size:0.95rem;margin-top:0.5rem" onclick="submitGetThis()">\u{1F680} Send to ${esc(repFirstName)}</button>
    <div id="g-status" style="margin-top:0.5rem;font-size:0.82rem;text-align:center;color:var(--soft);min-height:1em"></div>
    <div style="margin-top:0.75rem;font-size:0.68rem;color:var(--muted);text-align:center">No spam. No tricks. One human follow-up.</div>
  </div>
</div>

<footer>
  <div><strong>${esc(draft.prospect_name)}</strong> \u2014 a custom draft from <strong>Penny Wise I.T</strong>.</div>
  <div style="margin-top:0.5rem">Built and themed for you by ${esc(repFirstName)}. <a href="https://pennywiseit.com.au">pennywiseit.com.au</a></div>
</footer>

<script>
const SLUG = ${JSON.stringify(draft.slug)};
const PROSPECT_NAME = ${JSON.stringify(draft.prospect_name)};
const REP_FIRST_NAME = ${JSON.stringify(repFirstName)};
const REP_PHONE = ${JSON.stringify(repPhone)};

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

// Show rep card if we have the rep info
(function showRep() {
  const slot = document.getElementById('rep-card-slot');
  if (!slot) return;
  const initial = (REP_FIRST_NAME[0] || 'P').toUpperCase();
  slot.innerHTML =
    '<div class="rep-card">' +
      '<div class="rep-avatar">' + initial + '</div>' +
      '<div class="rep-info">' +
        '<strong>' + REP_FIRST_NAME + '</strong>' +
        '<div class="sub">Your Penny Wise I.T contact for ' + PROSPECT_NAME +
        (REP_PHONE ? ' \u00b7 ' + REP_PHONE : '') + '</div>' +
      '</div>' +
    '</div>';
})();

function openGetThis() { document.getElementById('get-modal').classList.add('open'); }
function closeGetThis() { document.getElementById('get-modal').classList.remove('open'); }
function openApprove() { document.getElementById('approve-modal').classList.add('open'); }
function closeApprove() { document.getElementById('approve-modal').classList.remove('open'); }

async function submitApprove() {
  const business_legal_name = document.getElementById('ap-biz-name').value.trim();
  const contact_name = document.getElementById('ap-name').value.trim();
  const contact_email = document.getElementById('ap-email').value.trim();
  const contact_phone = document.getElementById('ap-phone').value.trim();
  const status = document.getElementById('ap-status');
  const btn = document.getElementById('ap-submit');
  if (!contact_name || !contact_email) { status.textContent = 'Name and email required.'; status.style.color = '#f87171'; return; }
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(contact_email)) { status.textContent = 'Enter a valid email.'; status.style.color = '#f87171'; return; }
  btn.disabled = true; btn.textContent = 'Setting up your portal...';
  status.textContent = ''; status.style.color = '#a0aec0';
  // Pick up referral code from cookie or URL param so the referrer gets credit
  const cookieMatch = document.cookie.match(/(?:^|; )pwit_ref=([^;]+)/);
  const urlRef = new URLSearchParams(window.location.search).get('ref');
  const referral_code = (urlRef || (cookieMatch ? decodeURIComponent(cookieMatch[1]) : '')).toUpperCase();
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/drafts/' + SLUG + '/approve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_legal_name, contact_name, contact_email, contact_phone, referral_code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    status.innerHTML = '\u2705 Done. Check your inbox \u2014 your project portal link is on its way.';
    status.style.color = '#34d399';
    btn.textContent = 'Check your inbox';
    setTimeout(() => { window.location.href = data.portal_url; }, 2000);
  } catch (e) {
    status.textContent = e.message || 'Failed. Please try again.';
    status.style.color = '#f87171';
    btn.disabled = false; btn.textContent = '\u2705 Approve &amp; send me the contract';
  }
}

function openCommentFor(section, label) {
  document.getElementById('cm-section-label').textContent = 'Comment on: ' + label;
  document.getElementById('comment-modal').dataset.section = section;
  document.getElementById('comment-modal').classList.add('open');
}
function closeComment() { document.getElementById('comment-modal').classList.remove('open'); }

async function sendFeedback(btn) {
  const section = btn.dataset.section;
  const thumb = btn.dataset.thumb;
  btn.disabled = true;
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/drafts/' + SLUG + '/feedback', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, thumb }),
    });
    if (!res.ok) throw new Error('Could not send');
    btn.classList.add('sent');
    document.getElementById('sf-status-' + section).textContent =
      thumb === 'up' ? '\u2713 Thanks \u2014 ' + REP_FIRST_NAME + ' knows you love this section.' :
                       '\u2713 Got it \u2014 ' + REP_FIRST_NAME + ' will take a look at this.';
  } catch (e) {
    document.getElementById('sf-status-' + section).textContent = 'Could not send. Try again or use the comment button.';
    document.getElementById('sf-status-' + section).style.color = '#f87171';
  } finally {
    setTimeout(() => { btn.disabled = false; }, 1500);
  }
}

async function submitComment() {
  const section = document.getElementById('comment-modal').dataset.section || 'overall';
  const message = document.getElementById('cm-message').value.trim();
  const name = document.getElementById('cm-name').value.trim();
  const contact = document.getElementById('cm-contact').value.trim();
  const status = document.getElementById('cm-status');
  const btn = document.getElementById('cm-submit');
  if (!message) { status.textContent = 'Please enter a message.'; status.style.color = '#f87171'; return; }
  // Heuristic: if contact looks like email, send as email; else as phone
  const isEmail = contact.includes('@');
  btn.disabled = true; btn.textContent = 'Sending...';
  status.textContent = ''; status.style.color = '#a0aec0';
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/drafts/' + SLUG + '/feedback', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section, message, name,
        email: isEmail ? contact : '',
        phone: isEmail ? '' : contact,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed');
    }
    status.innerHTML = '\u2705 Sent to ' + REP_FIRST_NAME + '. They\\'ll be in touch shortly.';
    status.style.color = '#34d399';
    btn.textContent = 'Sent';
    setTimeout(closeComment, 1500);
  } catch (e) {
    status.textContent = e.message || 'Failed. Please try again.';
    status.style.color = '#f87171';
    btn.disabled = false; btn.textContent = '\u{1F4E8} Send to ' + REP_FIRST_NAME;
  }
}

async function submitGetThis() {
  const name = document.getElementById('g-name').value.trim();
  const phone = document.getElementById('g-phone').value.trim();
  const email = document.getElementById('g-email').value.trim();
  const note = document.getElementById('g-note').value.trim();
  const status = document.getElementById('g-status');
  const btn = document.getElementById('g-submit');
  if (!name) { status.textContent = 'Enter your name.'; status.style.color = '#f87171'; return; }
  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { status.textContent = 'Enter a valid email.'; status.style.color = '#f87171'; return; }
  btn.disabled = true; btn.textContent = 'Sending...';
  status.textContent = ''; status.style.color = '#a0aec0';
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/drafts/' + SLUG + '/feedback', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'iwantthis',
        message: 'I want this for my business. ' + (note || ''),
        name, email, phone,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed');
    }
    status.innerHTML = '\u2705 Sent. ' + REP_FIRST_NAME + ' will be in touch within 24 hours.';
    status.style.color = '#34d399';
    btn.textContent = 'On its way';
  } catch (e) {
    status.textContent = e.message || 'Failed. Please try again.';
    status.style.color = '#f87171';
    btn.disabled = false; btn.textContent = '\u{1F680} Send to ' + REP_FIRST_NAME;
  }
}

// Re-use the demo body interactivity
let cart = [];
function addToCart(name, price) { cart.push({ name, price }); updateCartBar(); toast('\u2713 ' + name + ' added'); }
function updateCartBar() {
  const bar = document.getElementById('cart-bar');
  if (!bar) return;
  if (!cart.length) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  const total = cart.reduce((s, i) => s + i.price, 0);
  document.getElementById('cart-count').textContent = cart.length + ' item' + (cart.length > 1 ? 's' : '');
  document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
}
function mockCheckout() {
  if (!cart.length) return;
  const total = cart.reduce((s, i) => s + i.price, 0);
  toast('\ud83c\udf89 Mock checkout \u00b7 $' + total.toFixed(2) + ' \u00b7 Real version uses Stripe');
  cart = [];
  updateCartBar();
}
function pickSlot(el) {
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('picked'));
  el.classList.add('picked');
  toast('\u2713 ' + el.textContent + ' selected');
}
function mockSubmit(label) { toast('\u2713 ' + label + ' \u00b7 Real version notifies the owner instantly'); }
</script>

</body></html>`;
}

// ───── FLYER (one-page premium "take a look at your new app") ─────
//
// Design language: huge ROI hero, per-module monetary impact, social proof
// strip, and a single dominant CTA. Black-on-white with the prospect's brand
// colour as the only accent. Print-ready (A4) but designed to feel premium
// on screen too.
export function renderDraftFlyer(draft: DraftPayload): string {
  const brand = draft.brand_color || '#4f8ef7';
  const accent = draft.accent_color || '#a78bfa';
  const repFirstName = draft.rep?.first_name || 'Steve';
  const repPhone = draft.rep?.phone || '';
  const productList = draft.products.map(p => PRODUCTS[p]).filter(Boolean);
  const totalSetup = productList.reduce((s, p) => s + (p.pricing[0]?.setup || 0), 0);
  const totalMonthly = productList.reduce((s, p) => s + (p.pricing[0]?.price_per_month || 0), 0);

  // Per-product ROI maths (same numbers used across the marketing site)
  const ROI_MATHS: Record<string, { headline: string; per_year: number; payback_months: string; }> = {
    'food-truck':       { headline: '+35% orders/hr at peak', per_year: 18000, payback_months: '< 1' },
    'online-store':     { headline: '$290+/mo saved vs Shopify on $10k revenue', per_year: 3500, payback_months: '< 1' },
    'tradie':           { headline: '+40% fewer no-shows; ~8 hrs/wk admin saved', per_year: 24000, payback_months: '< 1' },
    'festival':         { headline: '$0 platform fees vs Eventbrite ($895/event)', per_year: 8950, payback_months: '< 1' },
    'delivery':         { headline: 'Skip 30% DoorDash cut; on $20k/mo = $6,000 kept', per_year: 72000, payback_months: '< 1' },
    'ai-social':        { headline: 'AI moderates 94% of posts; 4-5 hrs/wk back', per_year: 9000, payback_months: '< 1' },
    'car-hire':         { headline: '+45% direct bookings; skip 25-35% Turo skim', per_year: 24000, payback_months: '< 1' },
    'butchers':         { headline: '+38% AOV via freezer packs; ~7 hrs/wk admin saved', per_year: 22000, payback_months: '< 1' },
    'sports-club':      { headline: '~12 hrs/wk secretary admin back; rego stops bleeding 6-8%', per_year: 14000, payback_months: '< 1' },
  };

  const totalAnnualValue = productList.reduce((s, p) => s + (ROI_MATHS[p.id]?.per_year || 0), 0);
  const annualCost = totalSetup + (totalMonthly * 12);
  const roi = annualCost > 0 ? Math.round((totalAnnualValue / annualCost) * 10) / 10 : 0;

  const iconFor = (id: string) => ({ 'food-truck':'🌮','online-store':'🛒','tradie':'🔧','festival':'🎪','delivery':'🚚','ai-social':'💬','car-hire':'🚗','butchers':'🥩','sports-club':'🏉' } as any)[id] || '🏢';

  const logoHtml = draft.logo_url
    ? `<img src="${esc(draft.logo_url)}" alt="${esc(draft.prospect_name)}" style="width:80px;height:80px;border-radius:14px;object-fit:cover;border:1px solid #e2e8f0">`
    : `<div style="width:80px;height:80px;border-radius:14px;background:linear-gradient(135deg,${brand},${accent});display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:900;color:white">${esc((draft.prospect_name[0] || '?').toUpperCase())}</div>`;

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(draft.prospect_name)} \u2014 your new app</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800;900&family=Playfair+Display:wght@900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --brand:${brand}; --accent:${accent}; --ink:#0a0f1c; --soft:#475569; --muted:#94a3b8; --border:#e2e8f0; --paper:#fefefe; }
body { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; color: var(--ink); background: #e2e8f0; line-height: 1.5; padding: 1.5rem; }
.flyer { max-width: 820px; margin: 0 auto; background: var(--paper); padding: 0; box-shadow: 0 16px 60px rgba(10,15,28,0.12); border-radius: 12px; overflow: hidden; }
@media print { body { background: white; padding: 0; } .flyer { box-shadow: none; max-width: 100%; border-radius: 0; } .no-print { display: none; } @page { size: A4 portrait; margin: 0.4cm; } }

.display { font-family: 'Playfair Display', Georgia, serif; font-weight: 900; letter-spacing: -0.02em; line-height: 1; }

/* HERO with the prospect's brand colour as accent */
.hero { padding: 2.25rem 2.25rem 1.5rem; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
.hero::before { content:''; position:absolute; top:-40px; right:-40px; width:200px; height:200px; border-radius:50%; background: linear-gradient(135deg, ${brand}10, ${accent}06); pointer-events:none; }
.hero-row { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1rem; position: relative; z-index: 1; }
.hero-meta { flex: 1; min-width: 0; }
.hero-eyebrow { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--brand); margin-bottom: 0.4rem; }
.hero-title { font-size: 2.4rem; line-height: 1.05; margin-bottom: 0.35rem; }
.hero-sub { font-size: 1rem; color: var(--soft); }

.hero-banner { padding: 1.25rem 2.25rem; background: linear-gradient(90deg, ${brand}10, ${accent}06); display: flex; align-items: baseline; gap: 0.85rem; flex-wrap: wrap; border-bottom: 1px solid var(--border); }
.hero-banner .label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--soft); }
.hero-banner .big { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 900; color: var(--brand); line-height: 1; }
.hero-banner .small { font-size: 0.95rem; color: var(--ink); font-weight: 600; }

/* MAIN CTA — the entire reason for this flyer */
.main-cta { padding: 1.5rem 2.25rem; background: var(--ink); color: white; text-align: center; }
.main-cta-eyebrow { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: ${brand}; margin-bottom: 0.5rem; opacity: 0.9; }
.main-cta-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; font-weight: 900; line-height: 1.1; margin-bottom: 0.4rem; }
.main-cta-sub { font-size: 0.95rem; color: rgba(255,255,255,0.75); margin-bottom: 1.1rem; max-width: 480px; margin-left: auto; margin-right: auto; }
.main-cta-btn { display: inline-block; background: ${brand}; color: white; padding: 0.95rem 2rem; border-radius: 4px; font-weight: 800; font-size: 1.05rem; text-decoration: none; box-shadow: 0 8px 30px ${brand}55; }
.main-cta-url { font-size: 0.78rem; color: rgba(255,255,255,0.55); margin-top: 0.85rem; font-family: monospace; }

/* MODULES section */
.section { padding: 1.5rem 2.25rem; }
.section + .section { border-top: 1px solid var(--border); }
.section-eyebrow { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--brand); margin-bottom: 0.85rem; }
.section-h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.5rem; font-weight: 900; margin-bottom: 1rem; }

.modules { display: grid; grid-template-columns: 1fr; gap: 0.85rem; }
.module { display: flex; gap: 1rem; padding: 0.95rem 1rem; border-left: 4px solid ${brand}; background: ${brand}06; border-radius: 0 6px 6px 0; }
.module .m-icon { font-size: 1.6rem; line-height: 1; flex-shrink: 0; }
.module .m-body { flex: 1; min-width: 0; }
.module .m-name { font-weight: 800; font-size: 1rem; margin-bottom: 0.15rem; display: flex; gap: 0.5rem; align-items: baseline; flex-wrap: wrap; }
.module .m-name .m-price { font-size: 0.7rem; color: var(--soft); font-weight: 600; }
.module .m-roi { font-size: 0.85rem; color: var(--ink); margin-bottom: 0.25rem; font-weight: 600; }
.module .m-roi-amt { color: var(--brand); font-weight: 800; }
.module .m-pitch { font-size: 0.78rem; color: var(--soft); line-height: 1.5; }

/* THE MATHS — the financial knockout punch */
.maths { display: flex; gap: 0; background: var(--ink); color: white; border-radius: 10px; overflow: hidden; }
.maths-cell { flex: 1; padding: 1rem 1.1rem; text-align: center; }
.maths-cell + .maths-cell { border-left: 1px solid rgba(255,255,255,0.1); }
.maths-cell .label { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem; }
.maths-cell .val { font-family: 'Playfair Display', Georgia, serif; font-size: 1.7rem; font-weight: 900; line-height: 1; color: white; }
.maths-cell .val.brand { color: ${brand}; }
.maths-cell .sub { font-size: 0.7rem; color: rgba(255,255,255,0.55); margin-top: 0.3rem; }

.maths-summary { background: ${brand}; color: white; padding: 1rem 1.25rem; text-align: center; border-radius: 6px; margin-top: 0.85rem; font-size: 0.92rem; }
.maths-summary strong { font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem; }

/* Footer */
.footer { padding: 1rem 2.25rem; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; gap: 1rem; font-size: 0.75rem; color: var(--soft); border-top: 1px solid var(--border); }
.footer .rep-name { font-weight: 700; color: var(--ink); }

/* Floating actions */
.print-bar { position: fixed; bottom: 1.5rem; right: 1.5rem; display: flex; gap: 0.5rem; z-index: 100; }
.print-btn { background: var(--ink); color: white; padding: 0.75rem 1.25rem; border-radius: 999px; font-weight: 700; text-decoration: none; box-shadow: 0 6px 20px rgba(10,15,28,0.25); border: none; cursor: pointer; font-family: inherit; font-size: 0.85rem; }
.back-btn { background: white; color: var(--ink); padding: 0.75rem 1.25rem; border-radius: 999px; font-weight: 700; text-decoration: none; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border: 1px solid var(--border); }
</style>
</head><body>

<div class="flyer">

  <!-- HERO -->
  <div class="hero">
    <div class="hero-row">
      ${logoHtml}
      <div class="hero-meta">
        <div class="hero-eyebrow">Custom app draft \u00b7 prepared for</div>
        <h1 class="display hero-title">${esc(draft.prospect_name)}</h1>
        <div class="hero-sub">${esc(draft.tagline || (draft.industry_label || 'Your branded software \u2014 built and ready to launch'))}</div>
      </div>
    </div>
  </div>

  <!-- ROI BANNER (the financial hook) -->
  ${totalAnnualValue > 0 ? `<div class="hero-banner">
    <div>
      <div class="label">Estimated annual upside</div>
      <div class="big">+$${totalAnnualValue.toLocaleString()}/yr</div>
    </div>
    <div style="margin-left:auto;text-align:right">
      <div class="label">Total cost (yr 1)</div>
      <div class="small">$${annualCost.toLocaleString()} \u00b7 ${roi > 0 ? roi + '\u00d7 ROI' : ''}</div>
    </div>
  </div>` : ''}

  <!-- THE MAIN CTA \u2014 take a look at your new app -->
  <div class="main-cta">
    <div class="main-cta-eyebrow">\u2728 The link below is a working app</div>
    <h2 class="main-cta-title">Take a look at your new app</h2>
    <p class="main-cta-sub">Click anywhere. Add things to the cart. Submit a booking. It all works \u2014 themed for ${esc(draft.prospect_name)} and ready to launch under your name.</p>
    <a href="https://demos.pennywiseit.com.au/draft/${esc(draft.slug)}" class="main-cta-btn">\u{1F449} Open ${esc(draft.prospect_name)}'s draft</a>
    <div class="main-cta-url">demos.pennywiseit.com.au/draft/${esc(draft.slug)}</div>
  </div>

  <!-- MODULES with per-product ROI -->
  <div class="section">
    <div class="section-eyebrow">In this draft</div>
    <h2 class="section-h2">${productList.length} module${productList.length > 1 ? 's' : ''}, all your branding, one launch</h2>
    <div class="modules">
      ${productList.map(p => {
        const roiData = ROI_MATHS[p.id];
        return `<div class="module">
          <div class="m-icon">${iconFor(p.id)}</div>
          <div class="m-body">
            <div class="m-name">${esc(PRODUCT_NAV_LABEL[p.id] || p.brand)}<span class="m-price">$${(p.pricing[0]?.setup || 0).toLocaleString()} once \u00b7 $${p.pricing[0]?.price_per_month || 0}/mo</span></div>
            ${roiData ? `<div class="m-roi"><span class="m-roi-amt">+$${roiData.per_year.toLocaleString()}/yr</span> &mdash; ${esc(roiData.headline)}</div>` : ''}
            <div class="m-pitch">${esc(p.sell_point)}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- THE MATHS -->
  <div class="section">
    <div class="section-eyebrow">The maths</div>
    <h2 class="section-h2">What it costs vs what it returns</h2>
    <div class="maths">
      <div class="maths-cell">
        <div class="label">One-off setup</div>
        <div class="val">$${totalSetup.toLocaleString()}</div>
        <div class="sub">Paid 50% on signing, 50% on launch</div>
      </div>
      <div class="maths-cell">
        <div class="label">Monthly hosting</div>
        <div class="val">$${totalMonthly}<span style="font-size:0.55em;color:rgba(255,255,255,0.55)">/mo</span></div>
        <div class="sub">Begins on go-live</div>
      </div>
      <div class="maths-cell">
        <div class="label">Estimated upside</div>
        <div class="val brand">+$${Math.round(totalAnnualValue / 12).toLocaleString()}<span style="font-size:0.55em;color:rgba(255,255,255,0.55)">/mo</span></div>
        <div class="sub">Conservative \u00b7 industry averages</div>
      </div>
    </div>
    ${totalAnnualValue > 0 ? `<div class="maths-summary">In year one, ${esc(draft.prospect_name)} should earn back the cost of this build <strong>${roi > 0 ? roi + '\u00d7' : ''}</strong> over.</div>` : ''}
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div>
      <div class="rep-name">${esc(repFirstName)} \u00b7 Penny Wise I.T</div>
      <div>${repPhone ? esc(repPhone) + ' \u00b7 ' : ''}30+ years in software \u00b7 pennywiseit.com.au</div>
    </div>
    <div style="text-align:right">
      <div>No commitment yet \u2014 we send a final quote first.</div>
      <div>Live in 1 week of approval.</div>
    </div>
  </div>

</div>

<div class="print-bar no-print">
  <a href="/draft/${esc(draft.slug)}" class="back-btn">\u2190 Back to draft</a>
  <button class="print-btn" onclick="window.print()">\u{1F5A8}\uFE0F Print / Save as PDF</button>
</div>

</body></html>`;
}
