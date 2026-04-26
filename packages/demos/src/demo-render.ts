import type { ProductConfig } from '../products';

const esc = (s: string) => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] || c));

const VALIDATOR_URL = 'https://pennywiseit-validator.steve-700.workers.dev';

// Sample-data personas — each product type gets a fictional business
const SAMPLE_BRAND: Record<string, { name: string; tagline: string; suburb: string; phone: string; logo_emoji: string }> = {
  'food-truck':       { name: "Big Red's BBQ Cruiser",  tagline: 'Low & slow Texas-style BBQ — at a van near you',       suburb: 'Rockhampton',  phone: '0412 345 001', logo_emoji: '🌮' },
  'online-store':     { name: 'Bay City Pickle Co.',    tagline: 'Small-batch pickles, hot sauce &amp; ferments',         suburb: 'Yeppoon',      phone: '0412 345 002', logo_emoji: '🛒' },
  'tradie':           { name: "Sparky Mike's Electrical", tagline: 'Residential &amp; commercial sparkies — 24/7 callouts', suburb: 'Rockhampton',  phone: '0412 345 003', logo_emoji: '🔧' },
  'festival':         { name: 'Gladstone Summer Fest',  tagline: 'Three days of food, music &amp; market stalls',         suburb: 'Gladstone',    phone: '0412 345 004', logo_emoji: '🎪' },
  'delivery':         { name: 'Central QLD Courier Co.', tagline: 'Same-day pickup and delivery across Central QLD',      suburb: 'Rockhampton',  phone: '0412 345 005', logo_emoji: '🚚' },
  'desktop':          { name: 'Hexpaint Studio',        tagline: 'Digital painting software for Windows & Mac',           suburb: 'Online',       phone: '—',            logo_emoji: '🖥️' },
  'ai-social':        { name: 'Rotary Mates',           tagline: 'A private community for rotary-engine tragics',         suburb: 'Global',       phone: '—',            logo_emoji: '🏁' },
  'price-comparison': { name: 'Solar Compare QLD',      tagline: 'Compare 40+ solar installers across Queensland',        suburb: 'Queensland',   phone: '0412 345 007', logo_emoji: '☀️' },
};

// The interactive demo IS the proposal. One link.
export function renderDemo(p: ProductConfig, ref: string = ''): string {
  const b = SAMPLE_BRAND[p.id] || { name: p.brand, tagline: p.sell_point, suburb: 'Somewhere', phone: '0412 345 000', logo_emoji: '🏢' };
  const [g1, g2, g3] = p.accent_gradient;

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(b.name)} — Interactive Demo</title>
<style>
:root {
  --bg:#0b0f1a; --surface:#141b2d; --card:#1a2338; --border:#1f2d45;
  --text:#e8edf5; --muted:#6b7fa3; --soft:#a0aec0;
  --brand:${p.cta_color}; --g1:${g1}; --g2:${g2}; --g3:${g3};
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--text); font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; min-height: 100vh; line-height: 1.55; padding-bottom: 90px; }
body::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:0; background: radial-gradient(ellipse 600px 400px at 80% 10%, ${g1}18, transparent 60%), radial-gradient(ellipse 500px 300px at 15% 80%, ${g2}15, transparent 60%); }
.demo-banner { position:sticky; top:0; z-index:60; background:${p.cta_color}; color:#0b0f1a; text-align:center; font-size:0.72rem; font-weight:800; letter-spacing:0.03em; padding:0.3rem 1rem; }

nav { position:sticky; top:22px; z-index:50; background:rgba(11,15,26,0.92); backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.05); padding:0.85rem 1.5rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
.brand { display:flex; align-items:center; gap:0.65rem; font-weight:800; font-size:1rem; }
.brand-logo { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,${g1},${g2}); display:flex; align-items:center; justify-content:center; font-size:1.15rem; box-shadow:0 4px 16px ${g1}55; }
.nav-cta { background:var(--brand); color:#0b0f1a; padding:0.5rem 1rem; border-radius:999px; font-weight:800; font-size:0.82rem; text-decoration:none; box-shadow:0 4px 16px ${p.cta_color}55; cursor:pointer; border:none; font-family:inherit; }

main { max-width:1100px; margin:0 auto; padding:2rem 1.5rem 4rem; position:relative; z-index:1; }
.display { font-family:"Impact","Haettenschweiler","Franklin Gothic Bold",system-ui,sans-serif; font-weight:900; letter-spacing:-0.01em; text-transform:uppercase; line-height:0.95; }

.hero { padding:2rem 0 3rem; }
.hero .pill { display:inline-flex; gap:0.4rem; align-items:center; background:${g1}14; color:${g1}; padding:0.35rem 0.85rem; border-radius:999px; font-size:0.7rem; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:1rem; border:1px solid ${g1}33; }
.hero h1 { font-size:clamp(2.5rem,6vw,4.5rem); margin-bottom:0.5rem; }
.hero h1 .grad { background:linear-gradient(135deg,${g1},${g2} 50%,${g3}); -webkit-background-clip:text; background-clip:text; color:transparent; }
.hero .subbrand { font-size:0.95rem; color:var(--muted); margin-top:0.5rem; font-style:italic; }
.hero .tagline { font-size:1.1rem; color:var(--soft); max-width:640px; margin:1rem 0 1.5rem; }
.hero-ctas { display:flex; gap:0.6rem; flex-wrap:wrap; }

/* Benefit callout — attached to every section */
.benefit {
  display:flex; gap:0.9rem; align-items:flex-start;
  background:linear-gradient(135deg,rgba(52,211,153,0.08),rgba(52,211,153,0.03));
  border:1px solid rgba(52,211,153,0.25);
  border-radius:12px; padding:0.85rem 1.15rem;
  margin-top:1.25rem;
}
.benefit .b-icon { font-size:1.5rem; flex-shrink:0; }
.benefit .b-body { flex:1; }
.benefit .b-title { font-size:0.65rem; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#34d399; margin-bottom:0.2rem; }
.benefit .b-text { font-size:0.82rem; color:var(--soft); line-height:1.55; }
.benefit .b-text strong { color:var(--text); }

.panel { background:linear-gradient(160deg,rgba(26,35,56,0.95),rgba(20,27,45,0.92)); border:1px solid rgba(255,255,255,0.06); border-radius:18px; padding:1.75rem 2rem; margin-bottom:1.5rem; }
.panel h2 { font-size:clamp(1.4rem,3.5vw,2rem); margin-bottom:0.75rem; }
.panel .kicker { font-size:0.68rem; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; color:${p.cta_color}; margin-bottom:0.4rem; }

/* Shared interactive styles */
.menu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:0.9rem; }
.menu-item { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:1rem 1.25rem; display:flex; flex-direction:column; gap:0.5rem; }
.menu-item .item-name { font-weight:700; font-size:1rem; }
.menu-item .item-desc { font-size:0.82rem; color:var(--soft); flex:1; }
.menu-item .item-row { display:flex; justify-content:space-between; align-items:center; margin-top:0.4rem; }
.menu-item .item-price { font-weight:900; font-size:1.15rem; color:${p.cta_color}; }
.btn-brand { background:var(--brand); color:#0b0f1a; border:none; padding:0.45rem 0.9rem; border-radius:999px; font-weight:800; cursor:pointer; font-family:inherit; font-size:0.8rem; transition:transform 0.1s; text-decoration:none; display:inline-flex; align-items:center; gap:0.3rem; }
.btn-brand:hover { transform:scale(1.03); }
.btn-ghost { background:rgba(255,255,255,0.06); color:var(--text); border:1px solid rgba(255,255,255,0.1); padding:0.45rem 0.9rem; border-radius:999px; font-weight:700; cursor:pointer; font-family:inherit; font-size:0.8rem; text-decoration:none; display:inline-flex; align-items:center; gap:0.3rem; }

.status-pill { display:inline-flex; align-items:center; gap:0.4rem; padding:0.3rem 0.75rem; border-radius:999px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; }
.status-open { background:rgba(52,211,153,0.12); color:#34d399; }

.form-row { display:flex; flex-direction:column; gap:0.3rem; margin-bottom:0.85rem; }
.form-row label { font-size:0.68rem; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); }
.form-row input, .form-row select, .form-row textarea { background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:0.65rem 0.85rem; color:var(--text); font-family:inherit; font-size:0.92rem; outline:none; }
.form-row input:focus, .form-row select:focus, .form-row textarea:focus { border-color:var(--brand); }

.time-slot { display:inline-block; padding:0.5rem 0.85rem; background:var(--card); border:1px solid var(--border); border-radius:8px; margin:0.25rem; cursor:pointer; font-size:0.85rem; transition:all 0.1s; }
.time-slot:hover { border-color:var(--brand); }
.time-slot.picked { background:var(--brand); color:#0b0f1a; border-color:var(--brand); font-weight:700; }

.toast { position:fixed; bottom:6.5rem; left:50%; transform:translateX(-50%) translateY(40px); background:var(--brand); color:#0b0f1a; padding:0.75rem 1.25rem; border-radius:10px; font-weight:800; opacity:0; transition:all 0.3s; z-index:200; box-shadow:0 8px 30px ${p.cta_color}88; pointer-events:none; }
.toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

/* Sticky "I want this" CTA bar \u2014 always visible */
.get-bar {
  position:fixed; left:0; right:0; bottom:0; z-index:90;
  background:rgba(11,15,26,0.95); backdrop-filter:blur(12px);
  border-top:1px solid ${p.cta_color}55;
  padding:0.75rem 1.25rem;
  display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;
  box-shadow:0 -8px 30px rgba(0,0,0,0.4);
}
.get-bar-label { font-size:0.85rem; color:var(--soft); }
.get-bar-label strong { color:var(--text); }
.get-bar-cta { background:var(--brand); color:#0b0f1a; padding:0.75rem 1.5rem; border-radius:999px; font-weight:800; border:none; cursor:pointer; font-family:inherit; font-size:0.92rem; box-shadow:0 4px 20px ${p.cta_color}88; }

/* Get-this modal */
.modal-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:300; align-items:center; justify-content:center; backdrop-filter:blur(8px); padding:1rem; overflow-y:auto; }
.modal-overlay.open { display:flex; }
.modal-card { background:linear-gradient(160deg,rgba(26,35,56,0.97),rgba(20,27,45,0.95)); border:1px solid ${p.cta_color}33; border-radius:20px; padding:2rem; max-width:500px; width:100%; position:relative; box-shadow:0 20px 80px rgba(0,0,0,0.6), 0 0 80px ${p.cta_color}22; }
.modal-close { position:absolute; top:1rem; right:1rem; background:rgba(255,255,255,0.08); border:none; width:32px; height:32px; border-radius:50%; color:var(--soft); cursor:pointer; font-size:1.1rem; }

/* ROI summary strip \u2014 at top so prospect sees benefit early */
.roi-strip { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:0.75rem; margin-top:1.5rem; }
.roi-tile { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:1rem 1.25rem; text-align:left; }
.roi-val { font-size:1.75rem; font-weight:900; line-height:1; letter-spacing:-0.02em; }
.roi-lbl { font-size:0.65rem; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:var(--text); margin-top:0.5rem; }
.roi-sub { font-size:0.72rem; color:var(--muted); margin-top:0.2rem; }

/* Rep card */
.rep-card { background:linear-gradient(135deg,${g1}14,${g2}10); border:1px solid ${p.cta_color}33; border-radius:14px; padding:1.1rem 1.25rem; margin-top:1rem; display:flex; align-items:center; gap:0.85rem; }
.rep-avatar { width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg,${g1},${g2}); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.1rem; color:#0b0f1a; }
.rep-info { flex:1; font-size:0.88rem; }
.rep-info strong { display:block; color:var(--text); }
.rep-info .sub { color:var(--soft); font-size:0.78rem; margin-top:0.1rem; }

footer { text-align:center; padding:2rem 1.5rem; color:var(--muted); font-size:0.82rem; border-top:1px solid rgba(255,255,255,0.05); margin-top:3rem; margin-bottom:-30px; }
footer a { color:var(--soft); }
</style>
</head><body>

<div class="demo-banner">
  \ud83e\uddea You're playing with a sample version of <strong>${esc(p.brand)}</strong>. Tap around \u2014 it all works. Your version would use <strong>your</strong> brand, data, and domain.
</div>

<nav>
  <div class="brand">
    <div class="brand-logo">${b.logo_emoji}</div>
    <div>${esc(b.name)}</div>
  </div>
  <button class="nav-cta" onclick="openGetThis()">\u{1F680} Get this for my business</button>
</nav>

<main>
  <section class="hero">
    <div class="pill">${esc(b.suburb.toUpperCase())} \u00b7 ${esc(p.kicker)}</div>
    <h1 class="display"><span class="grad">${esc(b.name)}</span></h1>
    <div class="subbrand">\u2014 example of a real ${esc(p.brand)} deployment</div>
    <div class="tagline">${b.tagline}</div>
    <div class="hero-ctas">
      <a href="#demo" class="btn-brand" style="padding:0.75rem 1.5rem">\ud83d\udc47 Play with the demo</a>
      <button class="btn-ghost" style="padding:0.75rem 1.5rem" onclick="openGetThis()">\u{1F680} I want this for my business</button>
    </div>

    <div class="roi-strip">
      ${p.stats.map(s => `
        <div class="roi-tile" style="color:${s.color}">
          <div class="roi-val">${esc(s.value)}</div>
          <div class="roi-lbl">${esc(s.label)}</div>
          <div class="roi-sub">${esc(s.sub)}</div>
        </div>
      `).join('')}
    </div>
  </section>

  ${renderDemoBody(p, b)}

  <section class="panel" style="background:linear-gradient(135deg,${g1}14,${g2}10,${g3}14);border:1px solid ${p.cta_color}33;text-align:center">
    <div class="kicker">Ready for yours?</div>
    <h2 class="display">Stop watching. Start running yours.</h2>
    <p style="color:var(--soft);max-width:600px;margin:0.5rem auto 1.25rem">${esc(p.sell_point)} All the value above, branded to <em>your</em> business, live within the week.</p>
    <button class="btn-brand" style="padding:1rem 2rem;font-size:1rem" onclick="openGetThis()">\u{1F680} Get this for my business</button>
    <div style="margin-top:0.75rem;font-size:0.78rem;color:var(--muted)">From $${p.pricing[0]?.setup || 499} setup + $${p.pricing[0]?.price_per_month || 79}/mo \u00b7 no lock-in \u00b7 live in 1 week</div>
  </section>
</main>

<div id="toast" class="toast"></div>

<div class="get-bar">
  <div class="get-bar-label">Loving it? <strong>Get your own version.</strong></div>
  <button class="get-bar-cta" onclick="openGetThis()">\u{1F680} Get this</button>
</div>

<div id="get-modal" class="modal-overlay" onclick="if(event.target===this)closeGetThis()">
  <div class="modal-card">
    <button class="modal-close" onclick="closeGetThis()">\u00d7</button>
    <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${p.cta_color};margin-bottom:0.4rem">Get ${esc(p.brand)} for your business</div>
    <h3 class="display" style="font-size:1.5rem;margin-bottom:0.4rem">Send this to your rep.</h3>
    <p style="color:var(--soft);font-size:0.88rem;margin-bottom:1.25rem">Drop your details \u2014 <span id="rep-name-inline">your Penny Wise I.T rep</span> will follow up within 24 hours with a tailored plan.</p>

    <div id="rep-card-slot"></div>

    <div class="form-row"><label>Your name *</label><input type="text" id="g-name" placeholder="Sarah Mitchell" required></div>
    <div class="form-row"><label>Business name</label><input type="text" id="g-business" placeholder="Sarah\u2019s Cafe"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
      <div class="form-row"><label>Phone</label><input type="tel" id="g-phone" placeholder="0412 345 678"></div>
      <div class="form-row"><label>Email *</label><input type="email" id="g-email" placeholder="sarah@email.com" required></div>
    </div>
    <div class="form-row"><label>Anything specific? (optional)</label><textarea id="g-note" rows="2" placeholder="I\u2019d love my own online store for our bakery..."></textarea></div>

    <button id="g-submit" class="nav-cta" style="width:100%;padding:0.85rem;font-size:0.95rem;margin-top:0.5rem" onclick="submitGetThis()">\u{1F680} Send to my rep</button>
    <div id="g-status" style="margin-top:0.5rem;font-size:0.82rem;text-align:center;color:var(--soft);min-height:1em"></div>
    <div style="margin-top:0.75rem;font-size:0.68rem;color:var(--muted);text-align:center">No spam. No tricks. One human follow-up.</div>
  </div>
</div>

<footer>
  <div><strong>${esc(b.name)}</strong> is a <em>sample business</em> for Penny Wise I.T's <strong>${esc(p.brand)}</strong> whitelabel.</div>
  <div style="margin-top:0.5rem">Your version would use your brand, your colours, your customer list.</div>
</footer>

<script>
const REF = ${JSON.stringify(ref)};
const PRODUCT_ID = ${JSON.stringify(p.id)};
const PRODUCT_NAME = ${JSON.stringify(p.brand)};

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

// Load rep info if ?ref=USERNAME present
async function loadRep() {
  if (!REF) return;
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/rep-info?u=' + encodeURIComponent(REF));
    const data = await res.json();
    if (!data.found) return;
    const firstName = data.first_name || 'your rep';
    const slot = document.getElementById('rep-card-slot');
    if (slot) {
      slot.innerHTML =
        '<div class="rep-card">' +
          '<div class="rep-avatar">' + (firstName[0] || '?').toUpperCase() + '</div>' +
          '<div class="rep-info">' +
            '<strong>' + firstName + '</strong>' +
            '<div class="sub">Your Penny Wise I.T contact' + (data.phone ? ' \u00b7 ' + data.phone : '') + '</div>' +
          '</div>' +
        '</div>';
    }
    const inline = document.getElementById('rep-name-inline');
    if (inline) inline.textContent = firstName;
  } catch {}
}
loadRep();

function openGetThis() { document.getElementById('get-modal').classList.add('open'); }
function closeGetThis() { document.getElementById('get-modal').classList.remove('open'); }

async function submitGetThis() {
  const name = document.getElementById('g-name').value.trim();
  const business = document.getElementById('g-business').value.trim();
  const phone = document.getElementById('g-phone').value.trim();
  const email = document.getElementById('g-email').value.trim();
  const note = document.getElementById('g-note').value.trim();
  const btn = document.getElementById('g-submit');
  const status = document.getElementById('g-status');
  if (!name) { status.textContent = 'Enter your name.'; status.style.color = '#f87171'; return; }
  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { status.textContent = 'Enter a valid email.'; status.style.color = '#f87171'; return; }
  btn.disabled = true; btn.textContent = 'Sending...';
  status.textContent = ''; status.style.color = '#a0aec0';
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/demo-interest', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: PRODUCT_ID, product_name: PRODUCT_NAME,
        name, business_name: business, phone, email, note, ref: REF,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    status.innerHTML = '\u2705 Sent to ' + (data.rep_first_name || 'Steve') + '. They\\'ll be in touch within 24 hours.';
    status.style.color = '#34d399';
    btn.textContent = 'On its way';
  } catch (e) {
    status.textContent = e.message || 'Failed. Please try again.';
    status.style.color = '#f87171';
    btn.disabled = false; btn.textContent = '\u{1F680} Send to my rep';
  }
}

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

// Benefit callout HTML helper
export function bf(icon: string, title: string, body: string): string {
  return `<div class="benefit"><div class="b-icon">${icon}</div><div class="b-body"><div class="b-title">What this means for you</div><div class="b-text">${body}</div></div></div>`;
}

function renderDemoBody(p: ProductConfig, b: any): string {
  switch (p.id) {
    case 'food-truck': return foodTruckDemo(b);
    case 'online-store': return onlineStoreDemo(b);
    case 'tradie': return tradieDemo(b);
    case 'festival': return festivalDemo(b);
    case 'delivery': return deliveryDemo(b, p);
    case 'desktop': return desktopDemo(b);
    case 'ai-social': return aiSocialDemo(b);
    case 'price-comparison': return priceCompareDemo(b);
    default: return '<p>Demo coming soon.</p>';
  }
}

// ──────────────── Per-product demo bodies with inline benefit callouts ────────────────

export function foodTruckDemo(b: any): string {
  const menu = [
    { name: 'Texas Brisket Roll',    desc: '14-hr smoked brisket, pickles, BBQ slaw on soft brioche',   price: 16.50 },
    { name: 'Low &amp; Slow Pulled Pork', desc: 'House-smoked pork shoulder, apple slaw, sweet pickles', price: 14.00 },
    { name: 'Smoke Shack Loaded Fries', desc: 'Chips, brisket burnt ends, cheese sauce, spring onion', price: 12.00 },
    { name: 'Sticky BBQ Ribs (half)', desc: 'Fall-off-the-bone ribs, house BBQ glaze, pickles',         price: 22.00 },
    { name: 'Mac &amp; Cheese Bowl',  desc: 'Creamy 3-cheese mac, smoked bacon crumb',                  price: 10.00 },
    { name: 'House Lemonade',          desc: 'Fresh-squeezed, cold, bottomless',                         price: 5.00 },
  ];

  return `
<section id="demo" class="panel">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem">
    <div><div class="kicker">Live menu</div><h2 class="display">What's cooking today</h2></div>
    <span class="status-pill status-open">\u25cf Open \u00b7 Ready in 10\u201315 min</span>
  </div>
  <div class="menu-grid">
    ${menu.map(m => `
      <div class="menu-item">
        <div class="item-name">${m.name}</div>
        <div class="item-desc">${m.desc}</div>
        <div class="item-row">
          <span class="item-price">$${m.price.toFixed(2)}</span>
          <button class="btn-brand" onclick="addToCart('${m.name.replace(/&amp;/g, '&').replace(/'/g, "\\'")}', ${m.price})">+ Add</button>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcc8', 'Live menu', '<strong>Pre-orders on quiet hours</strong> = revenue when the window is dead. <strong>Stripe payments in your account</strong> not ours. When items sell out, one tap marks them sold. No yelling &ldquo;we&rsquo;re out of ribs&rdquo; to the queue.')}
</section>

<section class="panel">
  <div class="kicker">\ud83d\udccd Where's the truck today</div>
  <h2 class="display">Riverside Markets \u00b7 till 2pm</h2>
  <p style="color:var(--soft);margin-bottom:0.5rem">Tomorrow: <strong>Yeppoon Main Beach</strong> \u00b7 Friday: <strong>Gracemere Pub</strong></p>
  <p style="font-size:0.85rem;color:var(--muted)">\ud83d\udcde ${esc(b.phone)} \u00b7 Real version auto-posts to Facebook &amp; Instagram when you tap "I'm here".</p>
  ${bf('\ud83d\udccd', 'Real-world value', 'Customers <strong>never ring asking "where are you today?"</strong> again. Real-time location + auto-posted updates = <strong>20-40% more walk-ups on pop-up days</strong>.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Pre-order for catering</div>
  <h2 class="display">Feeding a crowd?</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
    <div>
      <div class="form-row"><label>Your name</label><input type="text" placeholder="Jane"></div>
      <div class="form-row"><label>Phone</label><input type="tel" placeholder="0412 345 678"></div>
      <div class="form-row"><label>Pickup date</label><input type="date"></div>
      <div class="form-row"><label>Guests</label><input type="number" placeholder="25" min="5" max="200"></div>
    </div>
    <div>
      <div class="form-row"><label>What do you want?</label><textarea rows="5" placeholder="25 \u00d7 brisket rolls + sides?"></textarea></div>
      <button class="btn-brand" style="width:100%;padding:0.85rem;font-size:1rem" onclick="mockSubmit('Catering quote')">\ud83d\udccb Request quote</button>
    </div>
  </div>
  ${bf('\ud83d\udcb0', 'Catering = 2\u20133\u00d7 avg ticket', '<strong>One catering order a week = ~$400 extra revenue</strong>. This form captures inquiries while you&rsquo;re cooking. You text a quote back from the couch at night, done.')}
</section>

<div id="cart-bar" style="position:fixed;bottom:5.5rem;left:1rem;right:1rem;max-width:500px;margin:0 auto;background:var(--brand);color:#0b0f1a;border-radius:14px;padding:0.75rem 1.25rem;display:none;justify-content:space-between;align-items:center;gap:1rem;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-weight:800;z-index:70" class="hidden">
  <div><span id="cart-count">0 items</span> \u00b7 <span id="cart-total">$0.00</span></div>
  <button class="btn-ghost" style="background:#0b0f1a;color:var(--text);border-color:rgba(255,255,255,0.1)" onclick="mockCheckout()">Mock checkout \u2192</button>
</div>
<style>#cart-bar.hidden { display:none !important; } #cart-bar:not(.hidden) { display:flex !important; }</style>
`;
}

export function onlineStoreDemo(b: any): string {
  const products = [
    { name: 'Classic Dill Pickles (500g)', desc: 'Tangy, crunchy, made with fresh Gherkins from Bundaberg', price: 14.00, emoji: '\ud83e\udd52' },
    { name: 'Smoky Hot Sauce',              desc: 'Chipotle + brown sugar + a hint of mango',                price: 12.00, emoji: '\ud83c\udf36\ufe0f' },
    { name: 'Fermented Sauerkraut (1kg)',   desc: 'Raw, probiotic, zero preservatives',                      price: 18.00, emoji: '\ud83e\udd6c' },
    { name: 'Pickle Gift Trio',             desc: 'Three 250g jars, branded box, perfect for gifting',       price: 35.00, emoji: '\ud83c\udf81' },
    { name: 'Hot Chilli Oil',               desc: 'Made with our own smoked chillies',                       price: 16.00, emoji: '\ud83c\udf36\ufe0f' },
    { name: 'Starter Kit (5 items)',        desc: 'One of everything, save 15%',                             price: 70.00, emoji: '\ud83d\udce6' },
  ];
  return `
<section id="demo" class="panel">
  <div class="kicker">Live storefront</div>
  <h2 class="display">Shop small-batch goodness</h2>
  <div class="menu-grid">
    ${products.map(p => `
      <div class="menu-item">
        <div style="font-size:2.5rem;margin-bottom:0.3rem">${p.emoji}</div>
        <div class="item-name">${p.name}</div>
        <div class="item-desc">${p.desc}</div>
        <div class="item-row">
          <span class="item-price">$${p.price.toFixed(2)}</span>
          <button class="btn-brand" onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})">+ Add</button>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcb3', 'Own your store, keep your customers', 'Stripe \u2192 <strong>your bank, same day</strong>. No Shopify 2.9% tax. Customer list = <strong>your</strong> database, not someone else&rsquo;s. At $10k/mo revenue you save <strong>$290/mo in fees alone</strong> \u2014 covers 3\u00d7 the monthly hosting.')}
</section>

<section class="panel">
  <div class="kicker">\ud83d\ude9a Shipping</div>
  <h2 class="display">Delivered to your door</h2>
  <ul style="list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem">
    <li style="padding:0.85rem 1.25rem;background:var(--card);border:1px solid var(--border);border-radius:10px"><strong>Local</strong> \u2014 $5 flat \u00b7 Rocky/Yeppoon</li>
    <li style="padding:0.85rem 1.25rem;background:var(--card);border:1px solid var(--border);border-radius:10px"><strong>Australia-wide</strong> \u2014 $9.95 Aus Post</li>
    <li style="padding:0.85rem 1.25rem;background:var(--card);border:1px solid var(--border);border-radius:10px"><strong>Free over $60</strong> \u2014 ships everywhere</li>
  </ul>
  ${bf('\ud83d\udce6', 'SMS order updates = fewer support emails', 'Auto-SMS at <strong>Received \u2192 Packed \u2192 Shipped</strong> cuts <strong>&ldquo;where&rsquo;s my order?&rdquo;</strong> emails by 1/3. Your customers feel looked after, you get your evenings back.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Keep in touch</div>
  <h2 class="display">Subscribe for drops</h2>
  <div style="display:flex;gap:0.5rem;max-width:520px">
    <input type="email" placeholder="your@email.com.au" style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:0.75rem 1rem;color:var(--text);font-family:inherit">
    <button class="btn-brand" onclick="mockSubmit('Newsletter signup')">Sign up</button>
  </div>
  ${bf('\ud83d\udcec', 'Built-in email list = no Klaviyo bill', 'Klaviyo starts at $20/mo and caps free use at 250 contacts. Ours: <strong>unlimited, included</strong>. One new-drop email can move $500+ of stock overnight.')}
</section>

<div id="cart-bar" style="position:fixed;bottom:5.5rem;left:1rem;right:1rem;max-width:500px;margin:0 auto;background:var(--brand);color:#0b0f1a;border-radius:14px;padding:0.75rem 1.25rem;display:none;justify-content:space-between;align-items:center;gap:1rem;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-weight:800;z-index:70" class="hidden">
  <div><span id="cart-count">0 items</span> \u00b7 <span id="cart-total">$0.00</span></div>
  <button class="btn-ghost" style="background:#0b0f1a;color:var(--text);border-color:rgba(255,255,255,0.1)" onclick="mockCheckout()">Mock checkout \u2192</button>
</div>
<style>#cart-bar.hidden { display:none !important; } #cart-bar:not(.hidden) { display:flex !important; }</style>
`;
}

export function tradieDemo(b: any): string {
  const services = [
    { name: 'Safety switch + smoke alarm install', price: 'from $180',    time: '~1 hr' },
    { name: 'Ceiling fan installation',            price: 'from $220',    time: '1\u20132 hr' },
    { name: 'Switchboard upgrade',                 price: 'from $1,400',  time: 'half day' },
    { name: 'New power points (x4)',               price: 'from $320',    time: '2 hr' },
    { name: 'EV charger installation',             price: 'from $950',    time: 'half day' },
    { name: '24/7 emergency call-out',             price: 'from $220',    time: 'ASAP' },
  ];
  return `
<section id="demo" class="panel">
  <div class="kicker">Book a job</div>
  <h2 class="display">Pick what you need</h2>
  <div class="menu-grid">
    ${services.map(s => `
      <div class="menu-item">
        <div class="item-name">${s.name}</div>
        <div class="item-desc">${s.price} \u00b7 ${s.time}</div>
        <div class="item-row">
          <span style="font-size:0.78rem;color:var(--muted)">Avg job time</span>
          <button class="btn-brand" onclick="addToCart('${s.name.replace(/'/g, "\\'")}', 0)">Select</button>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\u26a1', '24/7 booking = revenue while you sleep', 'Customers book <strong>after hours</strong> \u2014 when tradie phones go to voicemail. Real workshops using this see a <strong>~30% rise in first-time bookings</strong> captured at nights/weekends.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Pick a time</div>
  <h2 class="display">Available this week</h2>
  <div>
    ${['Tue 9am','Tue 1pm','Wed 10am','Wed 2pm','Thu 8am','Thu 11am','Fri 9am','Fri 3pm'].map(t => `
      <span class="time-slot" onclick="pickSlot(this)">${t}</span>
    `).join('')}
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.5rem">
    <div class="form-row"><label>Your name</label><input type="text" placeholder="Sarah"></div>
    <div class="form-row"><label>Phone</label><input type="tel" placeholder="0412 345 678"></div>
    <div class="form-row"><label>Address</label><input type="text" placeholder="12 Main St, Rockhampton"></div>
    <div class="form-row"><label>Email</label><input type="email" placeholder="sarah@email.com"></div>
  </div>
  <div class="form-row"><label>Describe the job</label><textarea rows="3" placeholder="New ceiling fan in master bedroom..."></textarea></div>
  <button class="btn-brand" style="width:100%;padding:0.85rem;font-size:1rem" onclick="mockSubmit('Booking')">\ud83d\udd27 Book this slot</button>
  <p style="font-size:0.78rem;color:var(--muted);margin-top:0.5rem">\ud83d\udcf1 Real version: customer gets SMS confirm + day-before reminder. You get SMS the moment a booking lands.</p>
  ${bf('\ud83d\udcbc', 'No-shows cost $250+ of bay time each', 'SMS reminders + optional deposit-on-booking <strong>cut no-shows by ~40%</strong>. Recovering <strong>one no-show per month pays the whole platform 2.5\u00d7 over</strong>.')}
</section>

<section class="panel">
  <div class="kicker">\u2b50 Real reviews</div>
  <h2 class="display">What Rocky locals say</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem"><div style="color:var(--brand);letter-spacing:0.2em">\u2605\u2605\u2605\u2605\u2605</div><p style="margin-top:0.5rem;color:var(--soft)">"Showed up on time, sorted our switchboard in a morning. Quoted, invoiced, all done through the app."</p><div style="font-size:0.78rem;color:var(--muted);margin-top:0.5rem">\u2014 Mark, Berserker</div></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem"><div style="color:var(--brand);letter-spacing:0.2em">\u2605\u2605\u2605\u2605\u2605</div><p style="margin-top:0.5rem;color:var(--soft)">"Booked EV charger install online Sunday night, Mike rang Monday morning. Done by Wednesday."</p><div style="font-size:0.78rem;color:var(--muted);margin-top:0.5rem">\u2014 Lisa, Parkhurst</div></div>
  </div>
  ${bf('\ud83c\udfc6', 'Real reviews compound \u2192 rankings', '<strong>Verified customer reviews</strong> on your own site = Google ranks you higher for "best electrician near me". Every review is a free ad that never expires.')}
</section>

<div id="cart-bar" style="position:fixed;bottom:5.5rem;left:1rem;right:1rem;max-width:500px;margin:0 auto;background:var(--brand);color:#0b0f1a;border-radius:14px;padding:0.75rem 1.25rem;display:none;justify-content:space-between;align-items:center;gap:1rem;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-weight:800;z-index:70" class="hidden">
  <div><span id="cart-count">0 items</span> \u00b7 request quote</div>
  <button class="btn-ghost" style="background:#0b0f1a;color:var(--text);border-color:rgba(255,255,255,0.1)" onclick="mockCheckout()">Get quote \u2192</button>
</div>
<style>#cart-bar.hidden { display:none !important; } #cart-bar:not(.hidden) { display:flex !important; }</style>
`;
}

export function festivalDemo(b: any): string {
  return `
<section id="demo" class="panel">
  <div class="kicker">3 days \u00b7 Gladstone Marina</div>
  <h2 class="display">Fri 8 Jan \u2014 Sun 10 Jan</h2>
  <div class="menu-grid">
    ${[
      { name: 'Early Bird (GA)', desc: '3-day pass \u00b7 no fees', price: 45 },
      { name: 'Weekend Pass',    desc: '3-day pass \u00b7 regular', price: 65 },
      { name: 'Saturday Only',   desc: 'The big headline night', price: 35 },
      { name: 'VIP Pass',        desc: 'Backstage + fast lane', price: 180 },
    ].map(t => `
      <div class="menu-item">
        <div class="item-name">${t.name}</div>
        <div class="item-desc">${t.desc}</div>
        <div class="item-row">
          <span class="item-price">$${t.price}</span>
          <button class="btn-brand" onclick="addToCart('${t.name}', ${t.price})">\ud83c\udf9f Buy</button>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcb0', 'Eventbrite fees eat 3-5% of ticket revenue', 'At $40 \u00d7 500 tickets = <strong>$895 in Eventbrite fees alone</strong>. Our platform costs less than fees on a single event. Your Stripe, your account, your money same-day.')}
</section>

<section class="panel">
  <div class="kicker">\ud83d\udcc5 Schedule</div>
  <h2 class="display">What's on</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
    ${[
      ['MAIN STAGE', [['6pm Fri','Opening ceremony'],['8pm Fri','Headline band'],['10pm Fri','Fireworks']]],
      ['FOOD STAGE', [['12pm Sat','Chef demo'],['3pm Sat','Taste of Gladstone'],['6pm Sat','Iron Grill-off']]],
      ['KIDS ZONE',  [['10am Sat','Face painting'],['12pm Sat','Magic show'],['2pm Sat','Puppet theatre']]],
    ].map(([name, items]) => `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem">
        <div style="font-size:0.68rem;font-weight:800;letter-spacing:0.12em;color:var(--brand);margin-bottom:0.5rem">${name}</div>
        ${(items as string[][]).map(([t, ev]) => `<div style="padding:0.35rem 0;border-bottom:1px dashed rgba(255,255,255,0.05);font-size:0.85rem"><strong>${t}</strong> \u00b7 <span style="color:var(--soft)">${ev}</span></div>`).join('')}
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcf2', 'Push alerts = zero printed programs', 'Weather change? Stage shift? <strong>One push reaches every attendee in 2 seconds</strong>. No more reprinting $500 programs when a band pulls out.')}
</section>

<section id="book" class="panel">
  <div class="kicker">\ud83d\uddfa Vendor map</div>
  <h2 class="display">40+ local makers &amp; food vans</h2>
  <p style="color:var(--soft)">Interactive map with stall pins. Attendees tap \u2192 menu + specials. On-site navigation.</p>
  <div style="margin-top:1rem;height:220px;border-radius:14px;background:linear-gradient(135deg,var(--g1)11,var(--g2)11,var(--g3)11);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:0.92rem">\ud83d\uddfa Interactive vendor map (plots 40+ pins in real use)</div>
  ${bf('\ud83c\udf86', 'Vendors pay to be featured', '<strong>"Featured stall" upgrade for vendors = $50-100 each</strong>. 10 featured vendors = your entire platform cost covered. Data on foot traffic = sponsors pay more next year.')}
</section>

<div id="cart-bar" style="position:fixed;bottom:5.5rem;left:1rem;right:1rem;max-width:500px;margin:0 auto;background:var(--brand);color:#0b0f1a;border-radius:14px;padding:0.75rem 1.25rem;display:none;justify-content:space-between;align-items:center;gap:1rem;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-weight:800;z-index:70" class="hidden">
  <div><span id="cart-count">0 items</span> \u00b7 <span id="cart-total">$0.00</span></div>
  <button class="btn-ghost" style="background:#0b0f1a;color:var(--text);border-color:rgba(255,255,255,0.1)" onclick="mockCheckout()">Mock checkout \u2192</button>
</div>
<style>#cart-bar.hidden { display:none !important; } #cart-bar:not(.hidden) { display:flex !important; }</style>
`;
}

export function deliveryDemo(b: any, p: ProductConfig): string {
  return `
<section id="demo" class="panel">
  <div class="kicker">\ud83d\udccd Live tracking</div>
  <h2 class="display">Where's my driver?</h2>
  <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:1.25rem;margin-bottom:1rem">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem">
      <div><strong>Order #DL-4882</strong> \u00b7 2 \u00d7 parcels</div>
      <span class="status-pill status-open">\u25cf Out for delivery</span>
    </div>
    <div style="height:200px;border-radius:12px;background:linear-gradient(135deg,${p.accent_gradient[0]}22,${p.accent_gradient[1]}22,${p.accent_gradient[2]}22);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:var(--muted);position:relative">
      \ud83d\uddfa Live driver pin \u2014 ETA 12 min
      <div style="position:absolute;top:45%;left:62%;width:20px;height:20px;background:var(--brand);border-radius:50%;box-shadow:0 0 0 6px ${p.cta_color}44;animation:ddot 1.5s infinite"></div>
    </div>
    <style>@keyframes ddot { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.3); opacity:0.6; } }</style>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;text-align:center">
    ${['Accepted','Picked up','Out for delivery','Delivered'].map((s, i) => `
      <div style="padding:0.7rem 0.4rem;border-radius:10px;background:${i <= 2 ? 'var(--brand)' : 'var(--card)'};color:${i <= 2 ? '#0b0f1a' : 'var(--muted)'};font-size:0.75rem;font-weight:700">${i <= 2 ? '\u2713 ' : ''}${s}</div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcde', 'Kill the &ldquo;where&rsquo;s my parcel?&rdquo; call', 'Live tracking eliminates <strong>70-80%</strong> of &ldquo;where is it?&rdquo; calls. That&rsquo;s <strong>~4 hours back</strong> every week, every driver.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Book a pickup</div>
  <h2 class="display">Same-day courier</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
    <div class="form-row"><label>From (pickup)</label><input type="text" placeholder="123 George St, Rockhampton"></div>
    <div class="form-row"><label>To (destination)</label><input type="text" placeholder="45 Park Ave, Yeppoon"></div>
    <div class="form-row"><label>Package size</label><select><option>Satchel (&lt; 500g)</option><option>Box (&lt; 5kg)</option><option>Box (&lt; 20kg)</option><option>Pallet</option></select></div>
    <div class="form-row"><label>When</label><select><option>ASAP (1\u20133 hr)</option><option>Today, before 5pm</option><option>Tomorrow AM</option></select></div>
  </div>
  <button class="btn-brand" style="width:100%;padding:0.85rem;font-size:1rem" onclick="mockSubmit('Pickup request')">\ud83d\ude9a Schedule pickup</button>
  ${bf('\ud83d\udcb5', 'No DoorDash / Uber 30% cut', 'On $20k/mo delivery revenue <strong>that&rsquo;s $6,000/mo you keep</strong>. Platform pays itself 47\u00d7 over. Your drivers, your customers, your margins.')}
</section>

<section class="panel">
  <div class="kicker">Route today</div>
  <h2 class="display">Driver dashboard (your team view)</h2>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    ${[
      [1, 'Mia, 12 George St', '9:15 am', '\u2713 Done'],
      [2, 'Joe, 88 Bolsover', '9:40 am', '\u2713 Done'],
      [3, 'Sarah, 14 Denham', '10:20 am', '\u25b8 Next'],
      [4, 'Mark, 9 Musgrave', '11:00 am', 'Pending'],
    ].map(([n, name, time, status]) => `
      <div style="display:flex;justify-content:space-between;align-items:center;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:0.75rem 1rem">
        <div style="display:flex;align-items:center;gap:0.75rem"><div style="width:28px;height:28px;border-radius:50%;background:var(--brand);color:#0b0f1a;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.85rem">${n}</div><div><strong>${name}</strong><div style="font-size:0.75rem;color:var(--muted)">ETA ${time}</div></div></div>
        <span style="font-size:0.78rem;color:${status === '\u2713 Done' ? '#34d399' : status === '\u25b8 Next' ? 'var(--brand)' : 'var(--muted)'}">${status}</span>
      </div>
    `).join('')}
  </div>
  ${bf('\u23f1', 'Auto-routed = more drops per driver', 'Route optimiser = <strong>20-30% more drops per shift</strong> with zero extra work. One extra drop/day \u00d7 5 drivers = <strong>~100 more deliveries/month</strong>.')}
</section>`;
}

export function desktopDemo(b: any): string {
  return `
<section id="demo" class="panel" style="text-align:center">
  <div class="kicker">Try it free</div>
  <h2 class="display">Download Hexpaint Studio</h2>
  <p style="color:var(--soft);margin-bottom:1.5rem">14-day free trial \u00b7 no card required \u00b7 Windows, Mac, Linux</p>
  <div style="display:flex;justify-content:center;gap:0.75rem;flex-wrap:wrap">
    <button class="btn-brand" onclick="mockSubmit('Windows download')" style="padding:0.85rem 1.5rem">\u2b07 Windows (x64)</button>
    <button class="btn-brand" onclick="mockSubmit('macOS download')" style="padding:0.85rem 1.5rem">\u2b07 macOS (ARM + Intel)</button>
    <button class="btn-brand" onclick="mockSubmit('Linux download')" style="padding:0.85rem 1.5rem">\u2b07 Linux (.deb + AppImage)</button>
  </div>
  ${bf('\ud83d\udce6', 'Free trials convert at 8\u00d7 the rate', 'Auto-nudge emails on days 3, 6, 10 = <strong>industry-leading 8\u00d7 trial-to-paid conversion</strong>. Your users get gently reminded; you stop leaving money on the table.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Pricing</div>
  <h2 class="display">Pick a licence</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem">
    ${[
      { tier: 'Personal',  price: '$15/mo', features: ['All painting tools','10 GB cloud sync','Community support'] },
      { tier: 'Pro',       price: '$29/mo', features: ['Everything in Personal','Unlimited cloud','Priority support','Lifetime updates'], popular: true },
      { tier: 'Lifetime',  price: '$499',   features: ['All of Pro','Never billed again','Founders community'] },
    ].map(t => `
      <div style="background:var(--card);border:1px solid ${t.popular ? 'var(--brand)' : 'var(--border)'};border-radius:14px;padding:1.5rem;position:relative">
        ${t.popular ? '<div style="position:absolute;top:1rem;right:1rem;background:var(--brand);color:#0b0f1a;padding:0.2rem 0.6rem;border-radius:999px;font-size:0.65rem;font-weight:800">POPULAR</div>' : ''}
        <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.1em;color:var(--muted);text-transform:uppercase;margin-bottom:0.4rem">${t.tier}</div>
        <div style="font-size:2.2rem;font-weight:900;color:var(--brand);margin-bottom:1rem">${t.price}</div>
        <ul style="list-style:none;font-size:0.88rem;color:var(--soft)">${t.features.map(f => `<li style="padding:0.3rem 0 0.3rem 1.3rem;position:relative"><span style="position:absolute;left:0;color:#34d399;font-weight:800">\u2713</span>${f}</li>`).join('')}</ul>
        <button class="btn-brand" style="width:100%;margin-top:1rem;padding:0.75rem" onclick="mockSubmit('License: ${t.tier}')">Get ${t.tier}</button>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udd13', '100% licensed = 0% piracy loss', 'Signed keys + phone-home validation. <strong>Every paid copy stays paid</strong>. Without this, one paid licence typically becomes 10 shared copies. Your server = your rules.')}
</section>

<section class="panel">
  <div class="kicker">Your customer portal</div>
  <h2 class="display">Keys, billing, updates \u2014 in one place</h2>
  <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div><div style="font-size:0.65rem;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase">Active licence</div><div style="font-family:monospace;font-size:0.88rem;margin-top:0.25rem">HEXP-PRO-2026-XR4K-92M</div></div>
      <div><div style="font-size:0.65rem;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase">Next billing</div><div style="font-size:0.88rem;margin-top:0.25rem">$29 \u00b7 15 May 2026</div></div>
    </div>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap"><button class="btn-brand" onclick="mockSubmit('Key reset')">Reset key</button><button class="btn-ghost" onclick="mockSubmit('Download latest')">\u2b07 Get latest build</button><button class="btn-ghost" onclick="mockSubmit('Cancel plan')" style="color:#f87171">Cancel plan</button></div>
  </div>
  ${bf('\u2709\ufe0f', 'Self-serve = zero support tickets', 'Users reset keys, upgrade, download, cancel without emailing you. <strong>~2 hours of support time saved every week</strong>.')}
</section>`;
}

export function aiSocialDemo(b: any): string {
  return `
<section id="demo" class="panel">
  <div class="kicker">Community feed</div>
  <h2 class="display">Latest from Rotary Mates</h2>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    ${[
      { author: 'Dave (admin)', time: '2h', body: 'Ran the RX-8 at QR today. New PB on turn 3 after the LSD swap. Dyno sheet dropping tonight \ud83c\udfc1', likes: 47 },
      { author: 'Shannon', time: '5h', body: 'FS: 13B bridgeport, fully rebuilt, 4k km. Pick up Mackay. DMs open for serious buyers.', likes: 12 },
      { author: 'Tim', time: '1d', body: 'Anyone else had the stock apex seal issue on a port? Looking at Mazdatrix 3mm. Thoughts?', likes: 8 },
    ].map(pp => `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.1rem 1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem"><strong>${pp.author}</strong><span style="font-size:0.72rem;color:var(--muted)">${pp.time} ago</span></div>
        <div style="color:var(--soft);font-size:0.92rem;margin-bottom:0.6rem">${pp.body}</div>
        <div style="display:flex;gap:0.6rem"><button class="btn-ghost" onclick="mockSubmit('Liked')">\u2764\ufe0f ${pp.likes}</button><button class="btn-ghost" onclick="mockSubmit('Comment')">\ud83d\udcac Reply</button></div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcc8', 'Facebook reach is dead \u2014 5-10% on a good day', 'On your own community, <strong>100% of members see every post</strong>. No algorithm, no shadow-ban, no "boost this for $10" prompts. Every post reaches everyone.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Join up</div>
  <h2 class="display">Become a Mate</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
    ${[
      { tier: 'Free', price: 'Free', f: ['Read the feed','Weekly digest','Public events'] },
      { tier: 'Garage ($12/mo)', price: '$12/mo', f: ['All free perks','Post in the feed','Private channels','Discount codes'], popular: true },
      { tier: 'Lifetime', price: '$240 once', f: ['All Garage perks','Custom badge','Founders room'] },
    ].map(t => `
      <div style="background:var(--card);border:1px solid ${t.popular ? 'var(--brand)' : 'var(--border)'};border-radius:14px;padding:1.5rem">
        <div style="font-size:0.7rem;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase">${t.tier}</div>
        <div style="font-size:1.75rem;font-weight:900;color:var(--brand);margin:0.4rem 0">${t.price}</div>
        <ul style="list-style:none;font-size:0.85rem;color:var(--soft);margin-bottom:1rem">${t.f.map(x => `<li style="padding:0.25rem 0 0.25rem 1.2rem;position:relative"><span style="position:absolute;left:0;color:#34d399">\u2713</span>${x}</li>`).join('')}</ul>
        <button class="btn-brand" style="width:100%;padding:0.7rem" onclick="mockSubmit('${t.tier}')">Join</button>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcb3', 'Patreon takes 8-12%. We take 0.', '<strong>100 members \u00d7 $12/mo = $1,200/mo</strong>. Patreon takes ~$120. Ours \u2014 Stripe fee only. You keep $1,150. Monthly platform cost covers itself by member 9.')}
</section>

<section class="panel">
  <div class="kicker">\ud83e\udd16 AI moderation</div>
  <h2 class="display">Spam? Gone before you see it</h2>
  <p style="color:var(--soft)">Every post scored for spam, abuse, and off-topic in milliseconds. Your community stays tidy while you sleep.</p>
  <div style="margin-top:1rem;display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;text-align:center">
    <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem"><div style="font-size:1.5rem;font-weight:900;color:#34d399">94%</div><div style="font-size:0.72rem;color:var(--muted)">Auto-cleared</div></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem"><div style="font-size:1.5rem;font-weight:900;color:var(--brand)">4%</div><div style="font-size:0.72rem;color:var(--muted)">Review queue</div></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem"><div style="font-size:1.5rem;font-weight:900;color:#f87171">2%</div><div style="font-size:0.72rem;color:var(--muted)">Auto-removed</div></div>
  </div>
  ${bf('\u23f0', 'Save 4-5 hours of moderation weekly', 'AI handles 94%. <strong>You check a review queue for 15 min/day</strong> instead of manually deleting spam. That&rsquo;s your evenings back.')}
</section>`;
}

export function priceCompareDemo(b: any): string {
  return `
<section id="demo" class="panel">
  <div class="kicker">Your quote in 30 seconds</div>
  <h2 class="display">Compare solar for your home</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem">
    <div class="form-row"><label>Your postcode</label><input type="text" placeholder="4700"></div>
    <div class="form-row"><label>Quarterly power bill</label><select><option>Under $300</option><option>$300\u2013$600</option><option>$600\u2013$1,000</option><option>Over $1,000</option></select></div>
    <div class="form-row"><label>Roof space</label><select><option>Small (1\u20132 cars)</option><option>Medium (3\u20134 cars)</option><option>Large (5+)</option></select></div>
    <div style="display:flex;align-items:flex-end"><button class="btn-brand" style="width:100%;padding:0.7rem" onclick="mockSubmit('Compare quotes')">\ud83d\udd0d Compare now</button></div>
  </div>
  ${bf('\ud83c\udfaf', 'Niche beats broad \u2014 every time', 'Finder &amp; iSelect ignore narrow niches where <strong>affiliate fees are $80-200/lead</strong>. Pick one, rank for it, own it.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Top 3 matches</div>
  <h2 class="display">Ranked for your home</h2>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    ${[
      { rank: 1, brand: 'SunRight Solar',   system: '6.6 kW Trina + Fronius',  price: '$6,490', rebate: '\u2212 $2,890 STC', net: '$3,600', rating: 4.8, reviews: 284, badge: 'CHEAPEST' },
      { rank: 2, brand: 'QLD Solar Pros',   system: '6.6 kW LONGi + SolarEdge', price: '$7,250', rebate: '\u2212 $2,890 STC', net: '$4,360', rating: 4.9, reviews: 511, badge: 'BEST RATED' },
      { rank: 3, brand: 'Rocky Solar Co.',  system: '6.6 kW Jinko + Goodwe',    price: '$5,990', rebate: '\u2212 $2,890 STC', net: '$3,100', rating: 4.6, reviews: 127, badge: 'LOCAL' },
    ].map(r => `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap">
          <div style="flex:1;min-width:200px">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem"><span style="background:var(--brand);color:#0b0f1a;padding:0.15rem 0.5rem;border-radius:999px;font-size:0.65rem;font-weight:800">#${r.rank} ${r.badge}</span></div>
            <div style="font-size:1.1rem;font-weight:800">${r.brand}</div>
            <div style="font-size:0.82rem;color:var(--soft);margin:0.3rem 0">${r.system}</div>
            <div style="font-size:0.78rem;color:var(--muted)">\u2b50 ${r.rating} \u00b7 ${r.reviews} reviews</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:0.75rem;color:var(--muted)">${r.price} ${r.rebate}</div>
            <div style="font-size:1.5rem;font-weight:900;color:#34d399">${r.net}</div>
            <button class="btn-brand" style="margin-top:0.4rem" onclick="mockSubmit('Lead: ${r.brand}')">Get this quote \u2192</button>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcb0', 'Each clickout = $80-200 in your account', '<strong>2 solar installs/week = ~$800/mo</strong> recurring income. Platform pays for itself 8\u00d7 at that pace. No inventory, no customer service, no staff.')}
</section>`;
}
