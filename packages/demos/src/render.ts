import { PRODUCTS, type ProductConfig } from '../products';

const esc = (s: string) => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] || c));

export function renderProposal(p: ProductConfig, source: string): string {
  const sourceLabel = source === 'direct' ? '' : ` · ${source.toUpperCase()}`;
  const [g1, g2, g3] = p.accent_gradient;
  const [ig1, ig2] = p.icon_bg_gradient;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.brand)} — Penny Wise I.T Proposal</title>
<meta name="description" content="${esc(p.descriptor)}">
<meta property="og:title" content="${esc(p.brand)} — ${esc(p.tagline_bottom)}">
<meta property="og:description" content="${esc(p.descriptor)}">
<link rel="icon" href="https://pub-e9f06ab167a44125b75d7528e2271086.r2.dev/icon-dark.png">
<style>
:root {
  --bg:#0b0f1a; --surface:#141b2d; --card:#1a2338; --border:#1f2d45;
  --text:#e8edf5; --muted:#6b7fa3; --soft:#a0aec0;
  --accent:#4f8ef7; --green:#34d399; --yellow:#fbbf24; --red:#f87171; --purple:#a78bfa; --orange:#fb923c; --pink:#f472b6; --teal:#2dd4bf;
  --cta:${p.cta_color};
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg); color: var(--text); min-height: 100vh;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
}
/* Decorative ambient glow */
body::before {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 600px 400px at 85% 10%, ${g1}18, transparent 60%),
    radial-gradient(ellipse 500px 300px at 15% 30%, ${g2}15, transparent 60%),
    radial-gradient(ellipse 700px 400px at 50% 90%, ${g3}10, transparent 60%);
}
.wrap { max-width: 1120px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 1; }

/* Display font */
.display { font-family: "Impact", "Haettenschweiler", "Franklin Gothic Bold", system-ui, sans-serif; font-weight: 900; letter-spacing: -0.01em; text-transform: uppercase; line-height: 0.95; }

/* Nav */
nav { position: sticky; top: 0; z-index: 20; background: rgba(11,15,26,0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.04); }
.nav-inner { max-width: 1120px; margin: 0 auto; padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.nav-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: var(--muted); }
.nav-cta {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--cta); color: #0b0f1a; text-decoration: none;
  padding: 0.6rem 1.1rem; border-radius: 999px;
  font-weight: 800; font-size: 0.85rem; letter-spacing: 0.02em;
  box-shadow: 0 4px 20px ${p.cta_color}55;
  transition: transform 0.15s;
}
.nav-cta:hover { transform: translateY(-1px); }

/* Pill badge */
.pill {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 0.5rem 1rem; border-radius: 999px;
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--cta);
  box-shadow: 0 0 40px ${p.cta_color}22;
}

/* Hero */
.hero { padding: 4rem 0 3rem; text-align: center; }
.hero h1 { font-size: clamp(3rem, 8vw, 6rem); margin: 1.5rem 0 1rem; }
.hero h1 .white { color: #fff; display: block; }
.hero h1 .grad {
  display: block;
  background: linear-gradient(135deg, ${g1} 0%, ${g2} 50%, ${g3} 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero .descriptor { max-width: 700px; margin: 0 auto; font-size: 1.05rem; color: var(--soft); }

/* Stats */
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 3rem; }
.stat {
  background: var(--card); border: 1px solid var(--border); border-radius: 16px;
  padding: 1.5rem 1.25rem;
  position: relative; overflow: hidden;
}
.stat::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(circle at 100% 0%, currentColor 0%, transparent 50%);
  opacity: 0.06;
}
.stat-val { font-size: 2.5rem; font-weight: 900; line-height: 1; letter-spacing: -0.02em; }
.stat-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text); margin-top: 0.75rem; }
.stat-sub { font-size: 0.78rem; color: var(--muted); margin-top: 0.3rem; }

/* Section headers */
section { padding: 4rem 0 2rem; }
.section-kicker {
  display: inline-flex; align-items: center; gap: 0.75rem;
  font-size: 0.7rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase;
  margin-bottom: 1rem;
}
.section-kicker::before {
  content: ''; width: 48px; height: 2px;
  background: linear-gradient(90deg, ${g1}, ${g2});
  border-radius: 2px;
}
.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 2.5rem;
}

/* Feature grid */
.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1rem; }
.feature {
  background: linear-gradient(160deg, rgba(26,35,56,0.9), rgba(20,27,45,0.9));
  border: 1px solid var(--border); border-radius: 16px;
  padding: 1.5rem 1.75rem;
  display: flex; gap: 1.25rem; align-items: flex-start;
  transition: all 0.2s;
}
.feature:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
.feature-icon {
  flex-shrink: 0;
  width: 48px; height: 48px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
  background: linear-gradient(135deg, ${ig1}, ${ig2});
  box-shadow: 0 4px 16px ${ig1}55;
}
.feature-body h3 { font-size: 1rem; margin-bottom: 0.5rem; letter-spacing: 0.02em; }
.feature-body p { font-size: 0.88rem; color: var(--soft); line-height: 1.55; }

/* Why grid */
.why { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
.why-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 14px;
  padding: 1.25rem 1.5rem;
}
.why-icon { font-size: 1.75rem; margin-bottom: 0.5rem; }
.why-card h4 { font-size: 0.92rem; margin-bottom: 0.4rem; letter-spacing: 0.03em; }
.why-card p { font-size: 0.85rem; color: var(--soft); }

/* Admin time */
.admin-box {
  background: var(--card); border: 1px solid var(--border); border-radius: 16px;
  padding: 1.5rem 2rem;
}
.admin-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem 2.5rem; }
.admin-row { padding: 0.5rem 0; border-bottom: 1px dashed rgba(255,255,255,0.05); }
.admin-row:last-child { border-bottom: none; }
.admin-task { font-size: 0.88rem; font-weight: 600; margin-bottom: 0.2rem; }
.admin-task::before { content: '⏱'; margin-right: 0.4rem; color: var(--yellow); }
.admin-math { font-size: 0.78rem; color: var(--muted); }
.admin-math .red { color: var(--red); text-decoration: line-through; }
.admin-math .green { color: var(--green); font-weight: 700; }
.admin-math .saves { color: var(--green); font-weight: 800; margin-left: 0.4rem; }

/* Pricing */
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; }
.price-card {
  background: linear-gradient(160deg, rgba(26,35,56,0.95), rgba(20,27,45,0.95));
  border: 1px solid var(--border); border-radius: 18px;
  padding: 1.75rem 2rem;
  position: relative; overflow: hidden;
}
.price-card.popular { border-color: var(--cta); box-shadow: 0 0 40px ${p.cta_color}22; }
.popular-tag {
  position: absolute; top: 1.25rem; right: 1.25rem;
  background: var(--cta); color: #0b0f1a;
  padding: 0.2rem 0.7rem; border-radius: 999px;
  font-size: 0.65rem; font-weight: 800; letter-spacing: 0.08em;
}
.price-tier { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.75rem; }
.price-amount { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.03em; line-height: 1; }
.price-amount .slash { font-size: 1rem; font-weight: 600; color: var(--muted); vertical-align: middle; letter-spacing: 0; text-transform: none; }
.price-setup { font-size: 0.72rem; color: var(--muted); margin-top: 0.3rem; letter-spacing: 0.08em; text-transform: uppercase; }
.price-features { list-style: none; margin: 1.5rem 0 0; display: flex; flex-direction: column; gap: 0.5rem; }
.price-features li { font-size: 0.85rem; color: var(--soft); padding-left: 1.25rem; position: relative; }
.price-features li::before { content: '✓'; position: absolute; left: 0; color: var(--green); font-weight: 800; }

/* CTA band */
.cta-band {
  margin-top: 4rem; padding: 3rem 2rem;
  background: linear-gradient(135deg, ${g1}15, ${g2}10, ${g3}15);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  text-align: center;
}
.cta-band h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 0.5rem; }
.cta-band p { color: var(--soft); margin-bottom: 1.5rem; }
.cta-band .ctas { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.btn-primary, .btn-secondary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.85rem 1.5rem; border-radius: 999px;
  font-weight: 800; font-size: 0.9rem; letter-spacing: 0.02em;
  text-decoration: none; transition: transform 0.15s;
}
.btn-primary { background: var(--cta); color: #0b0f1a; box-shadow: 0 6px 24px ${p.cta_color}55; }
.btn-primary:hover { transform: translateY(-2px); }
.btn-secondary { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: var(--text); }
.btn-secondary:hover { background: rgba(255,255,255,0.12); }

/* Comparison */
.compare { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem; margin-top: 2rem; }
.compare-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 1.25rem 1.5rem; }
.compare-card h4 { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; }
.compare-card.good h4 { color: var(--cta); }
.compare-card ul { list-style: none; }
.compare-card li { font-size: 0.85rem; padding: 0.3rem 0 0.3rem 1.4rem; position: relative; color: var(--soft); }
.compare-card li::before { position: absolute; left: 0; font-weight: 800; }
.compare-card.bad li::before { content: '✕'; color: var(--muted); }
.compare-card.good li::before { content: '✓'; color: var(--green); }

/* Footer */
footer { padding: 3rem 0 4rem; text-align: center; color: var(--muted); font-size: 0.82rem; margin-top: 4rem; border-top: 1px solid rgba(255,255,255,0.04); }
footer a { color: var(--soft); text-decoration: none; margin: 0 0.5rem; }
footer a:hover { color: var(--text); }

/* Print */
@media print {
  body::before { display: none; }
  nav { position: static; border-bottom: 1px solid #333; }
  .nav-cta, .cta-band .ctas { display: none; }
  .hero h1 { font-size: 3.5rem; }
  section { padding: 2rem 0 1rem; page-break-inside: avoid; }
  .feature, .stat, .price-card { page-break-inside: avoid; }
}
</style>
</head>
<body>

<nav>
  <div class="nav-inner">
    <div class="nav-label">${esc(p.industry_label)}${esc(sourceLabel)}</div>
    <a href="javascript:window.print()" class="nav-cta">🖨 Save as PDF</a>
  </div>
</nav>

<div class="wrap">

<section class="hero">
  <div class="pill">✨ ${esc(p.kicker)}</div>
  <h1 class="display">
    <span class="white">${esc(p.tagline_top)}</span>
    <span class="grad">${esc(p.tagline_bottom)}</span>
  </h1>
  <p class="descriptor">${esc(p.descriptor)}</p>
  <div class="stats">
    ${p.stats.map(s => `
      <div class="stat" style="color:${s.color}">
        <div class="stat-val">${esc(s.value)}</div>
        <div class="stat-label">${esc(s.label)}</div>
        <div class="stat-sub">${esc(s.sub)}</div>
      </div>
    `).join('')}
  </div>
</section>

<section>
  <div class="section-kicker" style="color:${p.cta_color}">What's in the box</div>
  <h2 class="section-title display">The full kit</h2>
  <div class="features">
    ${p.features.map(f => `
      <div class="feature">
        <div class="feature-icon" style="background:linear-gradient(135deg,${f.gradient[0]},${f.gradient[1]})">${f.icon}</div>
        <div class="feature-body">
          <h3 class="display">${esc(f.title)}</h3>
          <p>${esc(f.body)}</p>
        </div>
      </div>
    `).join('')}
  </div>
</section>

<section>
  <div class="section-kicker" style="color:${g3}">Why this works</div>
  <h2 class="section-title display">The economics</h2>
  <div class="why">
    ${p.why.map(w => `
      <div class="why-card">
        <div class="why-icon">${w.icon}</div>
        <h4 class="display">${esc(w.title)}</h4>
        <p>${esc(w.body)}</p>
      </div>
    `).join('')}
  </div>
</section>

<section>
  <div class="section-kicker" style="color:${p.pricing[0]?.color || p.cta_color}">Hours you get back</div>
  <h2 class="section-title display">Admin time, week by week</h2>
  <div class="admin-box">
    <div class="admin-grid">
      ${p.admin_time.map(a => `
        <div class="admin-row">
          <div class="admin-task">${esc(a.task)}</div>
          <div class="admin-math">
            <span class="red">${esc(a.before)}</span> → <span class="green">${esc(a.after)}</span>
            <span class="saves">saves ${esc(a.saves)}</span>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<section>
  <div class="section-kicker" style="color:${g1}">White-label vs SaaS</div>
  <h2 class="section-title display">Not a rental. Yours.</h2>
  <div class="compare">
    <div class="compare-card bad">
      <h4>Generic SaaS</h4>
      <ul>
        <li>Their logo on every page customers see</li>
        <li>their-brand.com/yourshop — ugly URL</li>
        <li>Customer data locked in their database</li>
        <li>If they change pricing, you wear it</li>
        <li>Features you can't turn off, ones you can't add</li>
        <li>One feature request lost in a helpdesk queue</li>
      </ul>
    </div>
    <div class="compare-card good">
      <h4>What we build for you</h4>
      <ul>
        <li>Your logo, colours, and voice throughout</li>
        <li>Your own domain — ${esc((p.live_url || '').replace(/^https?:\/\//, ''))}</li>
        <li>Your customers' data in your Cloudflare account</li>
        <li>Your Stripe, your bank, your deposits</li>
        <li>Features tuned to how your ${esc(p.brand.toLowerCase())} actually runs</li>
        <li>A text message to us = a change shipped</li>
      </ul>
    </div>
  </div>
</section>

<section>
  <div class="section-kicker" style="color:${p.cta_color}">Honest pricing</div>
  <h2 class="section-title display">What it costs</h2>
  <div class="pricing-grid">
    ${p.pricing.map(t => `
      <div class="price-card ${t.popular ? 'popular' : ''}">
        ${t.popular ? '<div class="popular-tag">Most popular</div>' : ''}
        <div class="price-tier" style="color:${t.color}">${esc(t.tier)}</div>
        <div class="price-amount">$${t.price_per_month}<span class="slash">/month</span></div>
        <div class="price-setup">+ $${t.setup} one-time setup</div>
        <ul class="price-features">
          ${t.features.map(f => `<li>${esc(f)}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>
</section>

<section id="try-it" style="scroll-margin-top:80px">
  <div class="section-kicker" style="color:${p.cta_color}">Try it yourself</div>
  <h2 class="section-title display">Click through your own version</h2>
  <div style="background:linear-gradient(160deg,rgba(26,35,56,0.95),rgba(20,27,45,0.92));border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:2rem;text-align:center">
    <div style="font-size:3rem;margin-bottom:0.5rem">🎮</div>
    <h3 class="display" style="font-size:1.6rem;margin-bottom:0.75rem">Not a slideshow. A real working app.</h3>
    <p style="color:var(--soft);max-width:600px;margin:0 auto 1.5rem;font-size:0.95rem">We've loaded up a full sample version of <strong style="color:var(--text)">${esc(p.brand)}</strong> with dummy business data. Tap around like it's your own. No signup, no card, no timer.</p>
    <a href="/demo/${esc(p.id)}" target="_blank" class="btn-primary" style="font-size:1rem;padding:1rem 2rem">🚀 Open the interactive demo</a>
    <div style="margin-top:1rem;font-size:0.78rem;color:var(--muted)">Opens in a new tab · Click around the sample storefront · Back here for pricing &amp; proposal</div>

    <div style="margin-top:2rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.75rem;max-width:640px;margin-left:auto;margin-right:auto">
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem">
        <div style="font-size:1.4rem">📱</div>
        <div style="font-size:0.72rem;color:var(--soft);margin-top:0.25rem">Full customer flow</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem">
        <div style="font-size:1.4rem">🎨</div>
        <div style="font-size:0.72rem;color:var(--soft);margin-top:0.25rem">Your branding possible</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem">
        <div style="font-size:1.4rem">⚡</div>
        <div style="font-size:0.72rem;color:var(--soft);margin-top:0.25rem">Live on your device</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem">
        <div style="font-size:1.4rem">🧪</div>
        <div style="font-size:0.72rem;color:var(--soft);margin-top:0.25rem">Sample data, safe to play</div>
      </div>
    </div>
  </div>
</section>

<div class="cta-band">
  <h2 class="display">Ready to own one?</h2>
  <p>${esc(p.sell_point)}</p>
  <div class="ctas">
    <a href="/demo/${esc(p.id)}" target="_blank" class="btn-primary">🎮 Try the demo</a>
    <a href="mailto:steve@pennywiseit.com.au?subject=${encodeURIComponent('Interested in ' + p.brand)}" class="btn-secondary">📧 Chat to Steve</a>
  </div>
</div>

<footer>
  <div>Built by <a href="https://pennywiseit.com.au">Penny Wise I.T</a> — 30+ years in software &amp; app development · Rockhampton, QLD</div>
  <div style="margin-top:0.5rem">
    <a href="/">All whitelabels</a> ·
    <a href="https://sales.pennywiseit.com.au/apply">Join the sales team</a> ·
    <a href="https://sales.pennywiseit.com.au/privacy">Privacy</a>
  </div>
</footer>

</div>

</body>
</html>`;
}

export function renderIndex(): string {
  const cards = Object.values(PRODUCTS).map(p => {
    const [g1, g2, g3] = p.accent_gradient;
    return `
      <a href="/p/${p.id}" class="card">
        <div class="card-glow" style="background:radial-gradient(circle at 30% 20%, ${g1}33, transparent 60%)"></div>
        <div class="card-kicker" style="color:${g1}">${esc(p.kicker)}</div>
        <div class="card-title display">${esc(p.brand)}</div>
        <div class="card-desc">${esc(p.descriptor.slice(0, 110))}…</div>
        <div class="card-cta" style="color:${p.cta_color}">View proposal →</div>
      </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Penny Wise I.T — Whitelabel Demos</title>
<style>
:root {
  --bg:#0b0f1a; --card:#141b2d; --border:#1f2d45;
  --text:#e8edf5; --muted:#6b7fa3; --soft:#a0aec0;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--text); font-family: ui-sans-serif, system-ui, sans-serif; min-height: 100vh; padding: 3rem 1.5rem; }
body::before {
  content: ''; position: fixed; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 700px 500px at 15% 10%, rgba(79,142,247,0.08), transparent), radial-gradient(ellipse 600px 400px at 85% 90%, rgba(167,139,250,0.08), transparent);
}
.wrap { max-width: 1100px; margin: 0 auto; position: relative; }
.display { font-family: "Impact", "Haettenschweiler", system-ui, sans-serif; font-weight: 900; letter-spacing: -0.01em; text-transform: uppercase; line-height: 0.95; }
header { text-align: center; margin-bottom: 3rem; }
header .pill { display: inline-block; background: rgba(79,142,247,0.12); color: #4f8ef7; padding: 0.4rem 1rem; border-radius: 999px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 1.25rem; }
header h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); margin-bottom: 1rem; }
header h1 .grad { background: linear-gradient(135deg, #f87171, #a78bfa, #4f8ef7); -webkit-background-clip: text; background-clip: text; color: transparent; }
header p { max-width: 640px; margin: 0 auto; color: var(--soft); font-size: 1.05rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
.card { position: relative; background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem 1.75rem; text-decoration: none; color: var(--text); transition: all 0.2s; overflow: hidden; }
.card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.15); }
.card-glow { position: absolute; inset: 0; pointer-events: none; }
.card > * { position: relative; }
.card-kicker { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.75rem; }
.card-title { font-size: 1.5rem; margin-bottom: 0.5rem; }
.card-desc { font-size: 0.88rem; color: var(--soft); margin-bottom: 1rem; line-height: 1.55; }
.card-cta { font-size: 0.82rem; font-weight: 800; letter-spacing: 0.02em; }
footer { text-align: center; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.04); color: var(--muted); font-size: 0.82rem; }
footer a { color: var(--soft); }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <span class="pill">Penny Wise I.T · Whitelabel catalogue</span>
    <h1 class="display">Every kit we build, <span class="grad">for your brand.</span></h1>
    <p>Pick the one closest to your business. Every page is a Facebook-ready proposal — printable, shareable, yours to pitch.</p>
  </header>
  <div class="grid">${cards}</div>
  <footer>
    Built by <a href="https://pennywiseit.com.au">Penny Wise I.T</a> — want to sell this? <a href="https://sales.pennywiseit.com.au/apply">Join the team</a>.
  </footer>
</div>
</body>
</html>`;
}
