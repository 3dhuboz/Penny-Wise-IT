import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = dirname(scriptDir);
const dist = join(root, "dist");

const builderUrl = "https://builder.pennywiseit.com.au/sign-up";
const talkUrl = "mailto:steve@pennywiseit.com.au?subject=Penny%20Wise%20I.T%20website%20enquiry";

const paths = [
  { href: "/ai-websites", label: "AI Websites" },
  { href: "/apps", label: "Apps" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/roi", label: "ROI" },
  { href: "/about", label: "About" },
];

const appPlatforms = [
  ["Live Ordering", "Own-brand ordering without third-party platform tax."],
  ["Field Service", "Jobs, photos, status updates, and customer comms."],
  ["Delivery", "Simple dispatch and delivery tracking for local operators."],
  ["Events", "Ticketing, bookings, guest lists, and event workflows."],
  ["Car Hire", "Bookings, fleet availability, handover, and reminders."],
  ["Butchers", "Pre-orders, pickup windows, and local product catalogues."],
  ["Sports Clubs", "Memberships, events, payments, and sponsor visibility."],
  ["SimpleWebsite Pro", "Managed sites, storefronts, content, and support."],
];

const tools = [
  ["PennyBuilder", "AI websites from $9/mo", "Build a simple site for free, refine it by chatting, then publish when ready."],
  ["SocialAI Studio", "Local content engine", "Turn offers, events, and product updates into usable social posts."],
  ["ChowNow", "Food ordering", "A direct ordering path for food businesses that want more control."],
  ["Healthforecast", "Operational forecasting", "Plan stock, staff, and demand using plain-English business signals."],
  ["HACCP", "Food safety workflows", "Digital logs and compliance views for cafes, kitchens, and venues."],
];

const pricing = [
  ["AI Website", "$9/mo", "For a simple business site that needs to exist this week.", ["Free draft", "Hosted site", "Penny Wise URL", "Upgrade path"]],
  ["SimpleWebsite Pro", "$39/mo", "For a managed site, content help, and more hands-on support.", ["Managed updates", "Storefront options", "Custom domain help", "Support"]],
  ["Whitelabel App", "$99/mo+", "For operators who need a business workflow, not just a website.", ["Your brand", "Your domain", "Admin dashboard", "Automation"]],
];

const decisions = [
  ["I just need a website", "Start with PennyBuilder", "Build free, publish from $9/mo, and keep it simple until the business proves it needs more."],
  ["I need customers to do something", "Use an app platform", "Ordering, bookings, delivery, events, clubs, hire, and field work need workflows, not just pages."],
  ["I am losing time every week", "Automate the repeat work", "Turn admin, follow-up, content, compliance, or reporting into a repeatable system."],
];

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function nav(active) {
  return paths.map((item) => {
    const className = active === item.href ? ' class="active"' : "";
    return `<a${className} href="${item.href}">${item.label}</a>`;
  }).join("");
}

function ctaBand({ title = "Want the simplest next step?", text = "Tell Steve what the business does and what currently wastes time. He will point you to the smallest useful option.", primary = "Talk to Steve", secondary = "Build an AI website" } = {}) {
  return `<section class="cta-band"><div class="container cta-inner"><div><h2>${title}</h2><p>${text}</p></div><div class="actions"><a class="btn btn-primary" href="${talkUrl}">${primary}</a><a class="btn btn-secondary" href="${builderUrl}">${secondary}</a></div></div></section>`;
}

function shell({ title, description, active = "/", body }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#0b0d12">
  <link rel="icon" href="/favicon.svg">
  <style>
    :root {
      --bg: #090b10;
      --bg-2: #11141c;
      --ink: #f5f3ee;
      --muted: #a9b2c2;
      --soft: #747f91;
      --line: rgba(255,255,255,.11);
      --panel: rgba(255,255,255,.055);
      --panel-2: rgba(255,255,255,.085);
      --copper: #d48739;
      --copper-2: #f0b36b;
      --green: #32d49a;
      --blue: #87b7ff;
      --max: 1110px;
      color-scheme: dark;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 78% 18%, rgba(212,135,57,.16), transparent 30rem),
        linear-gradient(180deg, #080a0f 0%, #0d1017 42%, #090b10 100%);
      color: var(--ink);
      line-height: 1.55;
      overflow-x: hidden;
    }
    a { color: inherit; }
    .site-header {
      position: sticky;
      top: 0;
      z-index: 20;
      background: rgba(9,11,16,.92);
      border-bottom: 1px solid var(--line);
      backdrop-filter: blur(18px);
    }
    .nav-wrap {
      max-width: var(--max);
      min-height: 82px;
      margin: 0 auto;
      padding: 0 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 28px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      font-weight: 850;
      letter-spacing: 0;
      white-space: nowrap;
    }
    .brand-copy {
      display: grid;
      gap: 1px;
      line-height: 1.08;
    }
    .brand-name { font-size: 1.05rem; }
    .brand-sub {
      color: var(--muted);
      font-size: .72rem;
      font-weight: 780;
      letter-spacing: .02em;
    }
    .mark {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: #17100a;
      background: linear-gradient(135deg, var(--copper-2), #b46a24);
      box-shadow: 0 0 0 5px rgba(212,135,57,.12);
      font-weight: 950;
    }
    nav {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    nav a {
      padding: 9px 11px;
      color: var(--muted);
      text-decoration: none;
      font-size: .9rem;
      font-weight: 760;
      border-radius: 999px;
    }
    nav a:hover, nav a.active {
      color: var(--copper-2);
      background: rgba(212,135,57,.10);
    }
    .nav-cta {
      margin-left: 8px;
      padding: 11px 17px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--copper-2), #bd6f25);
      color: #16100b;
      font-weight: 900;
      text-decoration: none;
      box-shadow: 0 12px 26px rgba(212,135,57,.22);
      white-space: nowrap;
    }
    .nav-builder {
      margin-left: 8px;
      border: 1px solid rgba(240,179,107,.38);
      color: var(--ink);
      background: rgba(212,135,57,.08);
    }
    main { overflow: hidden; }
    section { padding: 78px 22px; }
    .container { max-width: var(--max); min-width: 0; margin: 0 auto; }
    .hero { padding-top: 104px; padding-bottom: 82px; }
    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(330px, .78fr);
      gap: 56px;
      align-items: center;
    }
    h1, h2, h3, p { margin-top: 0; }
    h1 {
      margin-bottom: 24px;
      font-size: clamp(3.2rem, 8vw, 6.5rem);
      line-height: .88;
      letter-spacing: 0;
      max-width: 900px;
      overflow-wrap: anywhere;
    }
    h2 {
      font-size: clamp(2rem, 4.5vw, 4rem);
      line-height: .98;
      letter-spacing: 0;
      margin-bottom: 18px;
      max-width: 850px;
    }
    h3 { font-size: 1.35rem; line-height: 1.18; margin-bottom: 10px; }
    .lead {
      color: var(--muted);
      font-size: clamp(1.08rem, 2vw, 1.32rem);
      max-width: 720px;
      margin-bottom: 30px;
    }
    .section-lead {
      color: var(--muted);
      font-size: 1.08rem;
      max-width: 760px;
      margin-bottom: 34px;
    }
    .actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .btn {
      display: inline-flex;
      min-height: 48px;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 13px 18px;
      text-decoration: none;
      font-weight: 900;
      font-size: .98rem;
      line-height: 1;
    }
    .btn-primary {
      border: 0;
      color: #17100a;
      background: linear-gradient(135deg, var(--copper-2), #b86e27);
      box-shadow: 0 14px 34px rgba(212,135,57,.24);
    }
    .btn-secondary { background: rgba(255,255,255,.055); color: var(--ink); }
    .path-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .path {
      display: grid;
      align-content: start;
      padding: 28px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.035));
      min-height: 210px;
    }
    .path strong {
      display: block;
      color: var(--copper-2);
      font-size: .82rem;
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .path p, .item p, .price p, .question p, .mock p { color: var(--muted); margin-bottom: 0; }
    .section-header {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 28px;
      margin-bottom: 22px;
    }
    .section-header h2 {
      margin-bottom: 0;
      font-size: clamp(1.9rem, 3.6vw, 3.3rem);
    }
    .section-header p {
      max-width: 470px;
      color: var(--muted);
      margin-bottom: 0;
    }
    .offer-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 28px;
      margin-bottom: 22px;
    }
    .offer-head h2 {
      margin-bottom: 0;
      font-size: clamp(2rem, 4.2vw, 3.7rem);
    }
    .offer-head p {
      max-width: 430px;
      color: var(--muted);
      margin-bottom: 0;
      font-size: 1.02rem;
    }
    .offer-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .offer-card {
      position: relative;
      display: grid;
      align-content: start;
      min-height: 300px;
      padding: 26px;
      border: 1px solid var(--line);
      border-radius: 8px;
      color: var(--ink);
      text-decoration: none;
      background:
        linear-gradient(160deg, rgba(255,255,255,.09), rgba(255,255,255,.035)),
        rgba(17,20,28,.9);
      box-shadow: 0 22px 52px rgba(0,0,0,.20);
      transition: transform .16s ease, border-color .16s ease, background .16s ease;
    }
    .offer-card:hover {
      transform: translateY(-3px);
      border-color: rgba(240,179,107,.42);
      background:
        linear-gradient(160deg, rgba(212,135,57,.16), rgba(135,183,255,.06)),
        rgba(17,20,28,.94);
    }
    .offer-top {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      margin-bottom: 34px;
    }
    .offer-kicker {
      color: var(--copper-2);
      font-size: .76rem;
      font-weight: 900;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .offer-icon {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(240,179,107,.28);
      border-radius: 8px;
      color: var(--copper-2);
      background: rgba(212,135,57,.12);
      font-weight: 950;
    }
    .offer-card h3 {
      font-size: 1.55rem;
      margin-bottom: 14px;
    }
    .offer-card p {
      color: var(--muted);
      margin-bottom: 22px;
    }
    .offer-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: auto;
      padding-top: 20px;
    }
    .offer-meta span {
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 999px;
      padding: 6px 9px;
      color: #d7deeb;
      background: rgba(255,255,255,.045);
      font-size: .78rem;
      font-weight: 780;
    }
    .offer-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 22px;
      color: var(--copper-2);
      font-weight: 900;
    }
    .mockup {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
      background: linear-gradient(145deg, rgba(255,255,255,.09), rgba(255,255,255,.035));
      box-shadow: 0 30px 80px rgba(0,0,0,.28);
    }
    .mock-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      color: var(--soft);
      font-size: .78rem;
      font-weight: 850;
      letter-spacing: .08em;
      text-transform: uppercase;
      border-bottom: 1px solid var(--line);
      padding-bottom: 14px;
      margin-bottom: 14px;
    }
    .mock-row {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr);
      gap: 14px;
      padding: 16px 0;
      border-bottom: 1px solid var(--line);
    }
    .mock-row:last-child { border-bottom: 0; }
    .dot {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background: rgba(212,135,57,.16);
      color: var(--copper-2);
      font-weight: 950;
    }
    .mock h3 { margin-bottom: 4px; }
    .split {
      display: grid;
      grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
      gap: 54px;
      align-items: start;
    }
    .list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .item {
      min-height: 168px;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background:
        linear-gradient(155deg, rgba(255,255,255,.08), rgba(255,255,255,.035)),
        rgba(18,22,31,.86);
    }
    .item b {
      display: block;
      color: var(--ink);
      font-size: 1.08rem;
      margin-bottom: 12px;
    }
    .item .tag {
      display: inline-flex;
      width: fit-content;
      margin-bottom: 16px;
      border: 1px solid rgba(240,179,107,.24);
      border-radius: 999px;
      padding: 5px 8px;
      color: var(--copper-2);
      background: rgba(212,135,57,.08);
      font-size: .72rem;
      font-weight: 900;
      letter-spacing: .07em;
      text-transform: uppercase;
    }
    .split .list { grid-template-columns: 1fr; }
    .split .item { min-height: auto; }
    .quiet-band {
      background: rgba(255,255,255,.035);
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .price {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 28px;
      background: rgba(255,255,255,.05);
    }
    .price .amount {
      display: block;
      margin: 18px 0 16px;
      color: var(--copper-2);
      font-size: 2.15rem;
      font-weight: 950;
      line-height: 1;
    }
    ul { margin: 18px 0 0; padding-left: 18px; color: var(--muted); }
    li + li { margin-top: 8px; }
    .faq-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .question {
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255,255,255,.045);
    }
    .footer {
      padding: 38px 22px;
      border-top: 1px solid var(--line);
      color: var(--soft);
    }
    .footer .container {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      flex-wrap: wrap;
    }
    .footer-links { display: flex; gap: 14px; flex-wrap: wrap; }
    .footer a { color: var(--muted); text-decoration-color: rgba(255,255,255,.24); text-underline-offset: 3px; }
    .cta-band {
      padding-top: 54px;
      padding-bottom: 54px;
      background: linear-gradient(135deg, rgba(212,135,57,.13), rgba(135,183,255,.06));
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }
    .cta-inner {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 28px;
      align-items: center;
    }
    .cta-inner h2 { font-size: clamp(1.8rem, 3.2vw, 3rem); margin-bottom: 10px; }
    .cta-inner p { color: var(--muted); max-width: 700px; margin-bottom: 0; }
    @media (max-width: 880px) {
      .nav-wrap { align-items: flex-start; flex-direction: column; padding-top: 16px; padding-bottom: 16px; gap: 12px; }
      nav { justify-content: flex-start; }
      .nav-cta, .nav-builder { margin-left: 0; }
      .hero { padding-top: 64px; }
      .hero-grid, .split, .path-strip, .offer-grid, .list, .faq-grid, .pricing-grid, .cta-inner { grid-template-columns: 1fr; }
      .offer-head, .section-header { align-items: flex-start; flex-direction: column; }
      .offer-card { min-height: auto; }
      .item { grid-template-columns: 1fr; gap: 10px; }
    }
    @media (max-width: 520px) {
      section { padding: 54px 18px; }
      .nav-wrap { padding-left: 18px; padding-right: 18px; }
      nav { width: 100%; justify-content: flex-start; gap: 2px 6px; }
      nav a { padding: 8px 7px; font-size: .82rem; }
      .nav-cta { width: auto; }
      .brand-sub, .nav-builder { display: none; }
      .container { width: min(330px, calc(100vw - 36px)) !important; max-width: min(330px, calc(100vw - 36px)) !important; margin-left: 0; margin-right: 0; }
      .hero-grid, .hero-grid > *, h1, .lead { min-width: 0; max-width: 100%; }
      h1 { width: 100%; font-size: clamp(1.95rem, 9vw, 2.28rem); line-height: 1.04; }
      .lead { width: 100%; font-size: 1.02rem; }
      .actions { width: 100%; max-width: 100%; }
      .btn { width: 100%; max-width: 100%; }
      .path, .offer-card, .price, .question { padding: 22px; }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="nav-wrap">
      <a class="brand" href="/" aria-label="Penny Wise I.T home"><span class="mark">P</span><span class="brand-copy"><span class="brand-name">Penny Wise I.T</span><span class="brand-sub">Websites, apps & automation</span></span></a>
      <nav aria-label="Primary navigation">${nav(active)}<a class="nav-builder" href="${builderUrl}">Build AI Website</a><a class="nav-cta" href="${talkUrl}">Talk to Steve</a></nav>
    </div>
  </header>
  ${body}
  <footer class="footer">
    <div class="container">
      <span>Penny Wise I.T - websites, apps, and automation for Australian small business.</span>
      <span class="footer-links"><a href="/faq">FAQ</a><a href="/admin">Admin</a><a href="${talkUrl}">steve@pennywiseit.com.au</a></span>
    </div>
  </footer>
</body>
</html>`;
}

function home() {
  return shell({
    active: "/",
    title: "Penny Wise I.T - Websites, Apps, and Automation",
    description: "AI websites from $9/mo, whitelabel app platforms, and automation tools for Australian small businesses.",
    body: `<main>
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <h1>Websites and apps<br>for small business.</h1>
          <p class="lead">Start with a $9/mo AI website, then grow into ordering, field service, delivery, events, and business automation when the business needs more.</p>
          <div class="actions">
            <a class="btn btn-primary" href="/ai-websites">Build an AI website</a>
            <a class="btn btn-secondary" href="/apps">Browse apps</a>
          </div>
        </div>
        <div class="mockup" aria-label="Penny Wise product paths">
          <div class="mock-top"><span>Pick the right starting point</span><span>PWIT</span></div>
          <div class="mock-row"><div class="dot">1</div><div class="mock"><h3>AI Website</h3><p>Get online quickly from $9/mo.</p></div></div>
          <div class="mock-row"><div class="dot">2</div><div class="mock"><h3>App Platform</h3><p>Ordering, bookings, delivery, field work, and clubs.</p></div></div>
          <div class="mock-row"><div class="dot">3</div><div class="mock"><h3>Automation</h3><p>Connect the repetitive work so owners get time back.</p></div></div>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="offer-head">
          <h2>Pick the service that fits where you are now.</h2>
          <p>Start small, prove the idea, then move into the apps and automation that actually save time or make money.</p>
        </div>
        <div class="offer-grid">
          <a class="offer-card" href="/ai-websites">
            <div class="offer-top"><span class="offer-kicker">AI Websites</span><span class="offer-icon">$9</span></div>
            <h3>Get a clean site online without a big project.</h3>
            <p>Build a free draft, preview it first, then publish from $9/mo when it is ready to be seen.</p>
            <div class="offer-meta"><span>Free draft</span><span>Fast publish</span><span>Upgrade later</span></div>
            <span class="offer-link">Build an AI website -></span>
          </a>
          <a class="offer-card" href="/apps">
            <div class="offer-top"><span class="offer-kicker">Whitelabel Apps</span><span class="offer-icon">APP</span></div>
            <h3>Give customers a branded way to order, book, or request work.</h3>
            <p>Practical platforms for food, trades, delivery, hire, events, clubs, and local operators.</p>
            <div class="offer-meta"><span>Your brand</span><span>Your domain</span><span>Admin tools</span></div>
            <span class="offer-link">Browse app paths -></span>
          </a>
          <a class="offer-card" href="/tools">
            <div class="offer-top"><span class="offer-kicker">Self-Serve Tools</span><span class="offer-icon">AI</span></div>
            <h3>Use focused tools for the jobs owners keep putting off.</h3>
            <p>Social content, ordering, forecasting, HACCP logs, and website polish without starting from scratch.</p>
            <div class="offer-meta"><span>Simple SaaS</span><span>Local support</span><span>No bloat</span></div>
            <span class="offer-link">See the tools -></span>
          </a>
        </div>
      </div>
    </section>
    <section class="quiet-band">
      <div class="container split">
        <div><h2>Clear offer. No platform tax. No confusing stack.</h2><p class="section-lead">The site now points buyers to the right first step instead of making them decode a catalogue. Budget website buyers, app buyers, and automation buyers each get their own path.</p></div>
        <div class="list">
          ${tools.slice(0, 3).map(([name, label, text]) => `<div class="item"><b>${name}</b><p>${label}. ${text}</p></div>`).join("")}
        </div>
      </div>
    </section>
  </main>`,
  });
}

function appsPage() {
  return shell({
    active: "/apps",
    title: "Apps - Penny Wise I.T",
    description: "Whitelabel app platforms for Australian small businesses.",
    body: `<main>
      <section class="hero"><div class="container"><h1>Whitelabel apps for real operators.</h1><p class="lead">Eight practical platforms for businesses that want their own brand, own domain, and own customer flow.</p><div class="actions"><a class="btn btn-primary" href="${talkUrl}">Talk through an app</a><a class="btn btn-secondary" href="/pricing">See pricing</a></div></div></section>
      <section><div class="container"><div class="section-header"><h2>Practical platforms, not one-off brochure pages.</h2><p>Each option gives the business a branded customer flow, an admin surface, and a clear reason to replace manual work or third-party fees.</p></div><div class="list">${appPlatforms.map(([name, text]) => `<article class="item"><span class="tag">App platform</span><b>${name}</b><p>${text}</p></article>`).join("")}</div></div></section>
    </main>`,
  });
}

function toolsPage() {
  return shell({
    active: "/tools",
    title: "Tools - Penny Wise I.T",
    description: "Self-serve tools from Penny Wise I.T.",
    body: `<main><section class="hero"><div class="container"><h1>Self-serve tools that solve one job clearly.</h1><p class="lead">Not every customer needs a full custom build. These tools let them start smaller and still stay inside the Penny Wise ecosystem.</p></div></section><section><div class="container"><div class="section-header"><h2>Small tools with a clear next action.</h2><p>For buyers who need one useful outcome now: a website, content, ordering, forecasting, or food-safety workflow.</p></div><div class="list">${tools.map(([name, label, text]) => `<article class="item"><span class="tag">${label}</span><b>${name}</b><p>${text}</p></article>`).join("")}</div></div></section>${ctaBand({ title: "Not sure which tool fits?", text: "Send the current business problem and Steve can point you at the smallest useful option.", secondary: "Try PennyBuilder" })}</main>`,
  });
}

function aiWebsitesPage() {
  return shell({
    active: "/ai-websites",
    title: "AI Websites from $9/mo - Penny Wise I.T",
    description: "Build a simple business website with PennyBuilder. Free to draft and preview, publish from $9/mo.",
    body: `<main>
      <section class="hero"><div class="container hero-grid"><div><h1>AI websites for budget buyers.</h1><p class="lead">Build a simple business website for free, tweak it by chatting, and publish from $9/mo. It catches the cheap AI website market without cheapening Penny Wise custom work.</p><div class="actions"><a class="btn btn-primary" href="${builderUrl}">Build one free</a><a class="btn btn-secondary" href="${talkUrl}">Want Steve to polish it?</a></div></div><div class="mockup"><div class="mock-top"><span>PennyBuilder flow</span><span>$9/mo</span></div><div class="mock-row"><div class="dot">A</div><div class="mock"><h3>Describe the business</h3><p>Type what you do, where you work, and the tone you want.</p></div></div><div class="mock-row"><div class="dot">B</div><div class="mock"><h3>Preview the draft</h3><p>AI builds copy, sections, layout, and a clear contact path.</p></div></div><div class="mock-row"><div class="dot">C</div><div class="mock"><h3>Publish or upgrade</h3><p>Go live from $9/mo or bring Steve in for managed polish.</p></div></div></div></div></section>
      <section><div class="container"><div class="section-header"><h2>A clean way in for budget buyers.</h2><p>Cheap AI website traffic should become a lead path, not a race to the bottom.</p></div><div class="path-strip"><div class="path"><strong>Good for</strong><h3>Brochure sites</h3><p>Local service businesses, early-stage ideas, landing pages, and quick web presence.</p></div><div class="path"><strong>Not for</strong><h3>Complex systems</h3><p>Bookings, ordering, portals, and automation should move into SimpleWebsite Pro or a whitelabel app.</p></div><div class="path"><strong>Upgrade path</strong><h3>No dead end</h3><p>Every AI website buyer can grow into hosting, social content, apps, and custom automation.</p></div></div></div></section>
    </main>`,
  });
}

function pricingPage() {
  return shell({
    active: "/pricing",
    title: "Pricing - Penny Wise I.T",
    description: "Simple starting prices for Penny Wise I.T websites, apps, and automation.",
    body: `<main><section class="hero"><div class="container"><h1>Simple starting points.</h1><p class="lead">Choose the smallest thing that solves the current problem. Upgrade when the business has earned the next step.</p></div></section><section><div class="container"><div class="section-header"><h2>Start small, then grow into the right level of help.</h2><p>The pricing is meant to make the first step obvious without trapping the business in the wrong tool.</p></div><div class="pricing-grid">${pricing.map(([name, amount, text, items]) => `<article class="price"><h3>${name}</h3><span class="amount">${amount}</span><p>${text}</p><ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul></article>`).join("")}</div></div></section></main>`,
  });
}

function roiPage() {
  return shell({
    active: "/roi",
    title: "ROI - Penny Wise I.T",
    description: "Estimate the time and platform fees a Penny Wise I.T system can save.",
    body: `<main><section class="hero"><div class="container split"><div><h1>Know what the system has to pay back.</h1><p class="lead">ROI is usually hiding in avoided platform fees, fewer admin hours, faster follow-up, and customers staying in your own brand experience.</p></div><div class="mockup"><div class="mock-top"><span>Quick estimate</span><span>Monthly</span></div><div class="mock-row"><div class="dot">$</div><div class="mock"><h3>Platform fees avoided</h3><p>Third-party ordering and marketplace costs.</p></div></div><div class="mock-row"><div class="dot">H</div><div class="mock"><h3>Admin hours saved</h3><p>Repeating tasks that software can handle.</p></div></div><div class="mock-row"><div class="dot">C</div><div class="mock"><h3>Customers retained</h3><p>Direct ordering, bookings, and local brand trust.</p></div></div></div></div></section></main>`,
  });
}

function aboutPage() {
  return shell({
    active: "/about",
    title: "About - Penny Wise I.T",
    description: "Penny Wise I.T builds practical websites, apps, and automation for small businesses.",
    body: `<main><section class="hero"><div class="container"><h1>Practical tech for owners who need the work handled.</h1><p class="lead">Penny Wise I.T is built around a simple idea: use the right amount of software for the job, keep it affordable, and make it useful to the person actually running the business.</p><div class="actions"><a class="btn btn-primary" href="${talkUrl}">Talk to Steve</a><a class="btn btn-secondary" href="/apps">See the app paths</a></div></div></section></main>`,
  });
}

function faqPage() {
  const questions = [
    ["Can I start with an AI website?", "Yes. PennyBuilder is the low-cost way in: build free, preview first, then publish from $9/mo."],
    ["What if I need more than a website?", "Move into SimpleWebsite Pro, a whitelabel app, or a custom automation path."],
    ["Is this for Australian small businesses?", "Yes. The language, pricing, and product paths are built for local operators."],
    ["Do I keep my brand?", "For whitelabel apps and managed sites, the goal is your brand, your domain, and your customer relationship."],
  ];
  return shell({
    active: "/about",
    title: "FAQ - Penny Wise I.T",
    description: "Common questions about Penny Wise I.T websites, apps, and automation.",
    body: `<main><section class="hero"><div class="container"><h1>Frequently asked questions.</h1><p class="lead">The short version: start small, keep ownership, and upgrade only when the business case is clear.</p></div></section><section><div class="container"><div class="section-header"><h2>Simple answers before anyone has to book a call.</h2><p>The offer should feel easy to understand before a customer ever talks to Steve.</p></div><div class="faq-grid">${questions.map(([q, a]) => `<article class="question"><h3>${q}</h3><p>${a}</p></article>`).join("")}</div></div></section></main>`,
  });
}

function adminPage() {
  return shell({
    active: "/admin",
    title: "Admin - Penny Wise I.T",
    description: "Admin access for Penny Wise I.T.",
    body: `<main><section class="hero"><div class="container"><h1>Admin access.</h1><p class="lead">Use the Penny Wise admin console for leads, content, and operational tools.</p><div class="actions"><a class="btn btn-primary" href="https://sales.pennywiseit.com.au/admin">Open admin console</a><a class="btn btn-secondary" href="/">Back to site</a></div></div></section></main>`,
  });
}

function numbersPage() {
  return shell({
    active: "/roi",
    title: "Numbers - Penny Wise I.T",
    description: "Numbers that make the Penny Wise I.T offer easier to compare.",
    body: `<main><section class="hero"><div class="container"><h1>The numbers should be easy to compare.</h1><p class="lead">A $9/mo website catches the budget buyer. A managed site saves time. A whitelabel app pays back when it replaces fees, manual admin, or lost customers.</p><div class="actions"><a class="btn btn-primary" href="/pricing">Compare pricing</a><a class="btn btn-secondary" href="/roi">Estimate ROI</a></div></div></section></main>`,
  });
}

async function write(relativePath, content) {
  const file = join(dist, relativePath);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await write("index.html", home());
await write("apps/index.html", appsPage());
await write("tools/index.html", toolsPage());
await write("ai-websites/index.html", aiWebsitesPage());
await write("pricing/index.html", pricingPage());
await write("roi/index.html", roiPage());
await write("about/index.html", aboutPage());
await write("faq/index.html", faqPage());
await write("admin/index.html", adminPage());
await write("numbers/index.html", numbersPage());
await write("favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#d48739"/><text x="32" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="900" fill="#17100a">P</text></svg>`);
await write("manifest.json", JSON.stringify({
  name: "Penny Wise I.T",
  short_name: "Penny Wise",
  start_url: "/",
  display: "standalone",
  background_color: "#090b10",
  theme_color: "#0b0d12",
}, null, 2));
await write("sw.js", "self.addEventListener('install', function(event) { self.skipWaiting(); });\nself.addEventListener('activate', function(event) { event.waitUntil(self.clients.claim()); });\n");

console.log(`Built clean showcase site at ${dist}`);
