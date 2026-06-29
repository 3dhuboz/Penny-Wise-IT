import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = dirname(scriptDir);
const dist = join(root, "dist");
const brandDir = join(root, "assets", "brand");

const builderUrl = "https://builder.pennywiseit.com.au/sign-up";
const talkUrl = "mailto:steve@pennywiseit.com.au?subject=Penny%20Wise%20I.T%20website%20enquiry";

const paths = [
  { href: "/ai-websites", label: "Premium Websites" },
  { href: "/apps", label: "Bookings & Orders" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "Questions" },
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

const appStoriesPremium = [
  ["Live Ordering", "When customers want to order without calling, messaging, or paying marketplace markups.", "Menu, payments, pickup windows, reminders", "OWN THE ORDER", "Table ready", "warm"],
  ["Field Service", "When quote requests, job photos, customer updates, and follow-ups keep getting lost in messages.", "Quotes, jobs, photos, updates", "LESS CHASING", "Job booked", "green"],
  ["Delivery", "When dispatch needs a clear local run sheet instead of another spreadsheet and call-around.", "Runs, stops, driver updates", "LOCAL RUNS", "Run mapped", "blue"],
  ["Events", "When guests need a simple path to tickets, bookings, reminders, and event-day details.", "Tickets, guests, reminders", "FILL THE ROOM", "Seats held", "red"],
  ["Car Hire", "When people need availability, handover notes, reminders, and an easy way to book.", "Availability, handover, reminders", "READY TO GO", "Keys ready", "warm"],
  ["Butchers", "When weekly specials, pre-orders, pickup windows, and fresh updates should be simple.", "Specials, pickup, catalogue", "FRESH THIS WEEK", "Fresh list", "green"],
  ["Sports Clubs", "When memberships, sponsors, events, payments, and announcements need one proper home.", "Members, events, sponsors", "CLUB RUNS SMOOTHER", "Members in", "blue"],
  ["SimpleWebsite Pro", "When the business needs a premium managed site with storefronts, updates, and support.", "Content, store, updates", "POLISHED PRESENCE", "Site polished", "red"],
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

const situations = [
  ["I want a professional website", "Launch with a polished site that makes the business look credible.", "Start with a guided draft, refine the wording and layout, then publish from $9/month or upgrade to managed polish when presentation matters.", "Start my website", builderUrl],
  ["I need customers to book, order, or enquire online", "Make it easier for customers to deal with you.", "Add practical online tools for bookings, orders, requests, payments, delivery, events, or service jobs without sending people through a generic platform.", "Plan customer tools", "/apps"],
  ["I want admin handled properly", "Get repeat jobs off your plate.", "Steve can help with reminders, customer messages, forms, reports, content, logs, and other weekly jobs that slow the business down.", "Talk through my admin", talkUrl],
  ["I want advice before I choose", "A premium build starts with the right call.", "Explain what you are trying to improve. Steve will point you at the smallest serious option, even if that means not building the bigger thing yet.", "Ask Steve what fits", talkUrl],
];

const howItWorks = [
  ["Tell us what you need", "Send through what your business does and what you are trying to fix: a website, bookings, orders, admin, or something customers keep asking for."],
  ["Pick the right level of polish", "Start lean if that is enough, or move into managed website, booking, ordering, and automation work when the business case is clear."],
  ["Go live, then improve it", "Launch a professional first version, then add useful extras as the business grows instead of paying for a big system before you need one."],
];

const reassurance = [
  ["Premium does not mean bloated", "If a professional website is enough, we stop at the website. You do not need to rebuild the whole business at once."],
  ["Your business stays yours", "Your brand, your domain, your customer relationship. The goal is not to trap you inside software you do not understand."],
  ["Commercial advice first", "If an app will not save time, avoid fees, or help customers buy from you more easily, it should not be built yet."],
];

const examples = [
  ["Cafe or takeaway", "Replace marketplace fees with simple own-brand ordering when the numbers make sense."],
  ["Tradie or service business", "Turn calls and scattered messages into clear quote requests, job details, photos, and follow-ups."],
  ["Club, event, or local group", "Move memberships, bookings, payments, guest lists, and updates out of spreadsheets."],
];

const myths = [
  ["My customers are already on Facebook", "Facebook mainly helps people who already know the business. A website helps the next customer check the menu, prices, hours, photos, reviews, location, and contact details before they decide. Facebook is useful. It should not be the only front door."],
  ["My menu changes every week", "That is a reason to make the website easy to update, not a reason to avoid one. A weekly menu page can be built so the latest menu, specials, photos, or PDF are quick to change, then Facebook and Google can point people to the current version."],
  ["A Google listing is enough because I just want calls", "A Google listing can make the phone ring, but many people check details before calling. A simple website answers the repeat questions first: what you do, where you service, prices or menu, proof, photos, opening hours, and whether you look trustworthy enough to contact."],
  ["Shopify will make the store SEO friendly", "Shopify can be right for product-heavy stores. But a platform does not automatically create search demand, local trust, useful pages, or better margins. SEO still depends on clear product pages, helpful content, local intent, technical structure, speed, and a customer journey that turns visits into orders."],
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

function ctaBand({ title = "Want the simplest next step?", text = "Tell Steve what the business does and what currently wastes time. He will point you to the smallest useful option.", primary = "Talk to Steve", secondary = "Build an AI website", primaryHref = talkUrl, secondaryHref = builderUrl } = {}) {
  return `<section class="cta-band"><div class="container cta-inner"><div><h2>${title}</h2><p>${text}</p></div><div class="actions"><a class="btn btn-primary" href="${primaryHref}">${primary}</a><a class="btn btn-secondary" href="${secondaryHref}">${secondary}</a></div></div></section>`;
}

function shell({ title, description, active = "/", body }) {
  const routeClass = active === "/" ? "route-home" : `route-${active.replace(/^\//, "").replace(/[^a-z0-9-]/gi, "-")}`;
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
  <meta property="og:image" content="/brand/pennywise-it-cover.svg">
  <meta name="theme-color" content="#0b0d12">
  <link rel="icon" href="/brand/pennywise-it-icon-small.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/brand/pennywise-it-icon-small.svg">
  <link rel="manifest" href="/manifest.json">
  <style>
    :root {
      --bg: #05070b;
      --bg-2: #101720;
      --ink: #fff9ef;
      --muted: #b4c1d7;
      --soft: #77869d;
      --line: rgba(255,255,255,.14);
      --panel: rgba(255,255,255,.07);
      --panel-2: rgba(255,255,255,.12);
      --copper: #d48739;
      --copper-2: #f6b45f;
      --green: #43e7ac;
      --blue: #8fc5ff;
      --violet: #b79cff;
      --max: 1110px;
      color-scheme: dark;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        linear-gradient(135deg, rgba(246,180,95,.12), transparent 28%),
        linear-gradient(220deg, rgba(143,197,255,.10), transparent 32%),
        linear-gradient(180deg, #05070b 0%, #0b1018 46%, #05070b 100%);
      color: var(--ink);
      line-height: 1.55;
      overflow-x: hidden;
    }
    body.route-home {
      background:
        radial-gradient(circle at 9% 8%, rgba(246,180,95,.34), transparent 27%),
        radial-gradient(circle at 76% 14%, rgba(255,244,222,.13), transparent 22%),
        radial-gradient(circle at 86% 42%, rgba(67,231,172,.18), transparent 26%),
        linear-gradient(135deg, #080706 0%, #21170f 44%, #04130e 100%);
    }
    a { color: inherit; }
    a:focus-visible, .btn:focus-visible, nav a:focus-visible {
      outline: 3px solid rgba(246,180,95,.72);
      outline-offset: 4px;
    }
    .scene-canvas {
      position: fixed;
      inset: 0;
      z-index: -3;
      width: 100%;
      height: 100%;
      opacity: .78;
      pointer-events: none;
    }
    .route-home .scene-canvas { opacity: .22; filter: saturate(.95) contrast(1.05); }
    .ambient {
      position: fixed;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      background:
        radial-gradient(circle at 18% 24%, rgba(246,180,95,.18), transparent 24rem),
        radial-gradient(circle at 76% 18%, rgba(143,197,255,.14), transparent 25rem),
        radial-gradient(circle at 52% 88%, rgba(67,231,172,.08), transparent 28rem),
        linear-gradient(180deg, rgba(5,7,11,.18), rgba(5,7,11,.86));
    }
    .noise {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      opacity: .10;
      background-image:
        linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
      background-size: 52px 52px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,.9), transparent 86%);
    }
    .site-header {
      position: sticky;
      top: 0;
      z-index: 40;
      background:
        linear-gradient(180deg, rgba(12,13,16,.92), rgba(5,7,11,.72)),
        rgba(5,7,11,.70);
      border-bottom: 1px solid rgba(246,180,95,.16);
      backdrop-filter: blur(24px) saturate(1.35);
      will-change: background-color, box-shadow, border-color;
      transition: background-color .22s ease, box-shadow .22s ease, border-color .22s ease;
    }
    .site-header.is-scrolled {
      background: rgba(5,7,11,.94);
      border-bottom-color: rgba(246,180,95,.22);
      box-shadow: 0 18px 46px rgba(0,0,0,.30);
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
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 8px 12px 8px 9px;
      border: 1px solid rgba(246,180,95,.52);
      border-radius: 999px;
      background:
        linear-gradient(115deg, rgba(255,255,255,.72), transparent 28% 62%, rgba(255,255,255,.22)),
        radial-gradient(circle at 16% 22%, rgba(255,255,255,.94), transparent 24%),
        linear-gradient(135deg, rgba(255,247,232,.98), rgba(235,190,126,.94));
      box-shadow:
        0 22px 54px rgba(0,0,0,.32),
        0 0 0 1px rgba(255,255,255,.18) inset,
        0 -18px 34px rgba(112,64,24,.14) inset;
      text-decoration: none;
      font-weight: 850;
      letter-spacing: 0;
      white-space: nowrap;
      transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
      overflow: hidden;
    }
    .brand::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(105deg, transparent 0 34%, rgba(255,255,255,.58) 43%, transparent 54% 100%);
      transform: translateX(-120%);
      transition: transform .7s ease;
      pointer-events: none;
    }
    .brand:hover {
      transform: translateY(-1px);
      border-color: rgba(246,180,95,.68);
      box-shadow: 0 18px 46px rgba(212,135,57,.20), 0 0 0 1px rgba(255,255,255,.08) inset;
    }
    .brand:hover::after { transform: translateX(120%); }
    .brand-logo {
      width: clamp(180px, 18vw, 245px);
      height: auto;
      display: block;
      filter:
        drop-shadow(0 14px 26px rgba(212,135,57,.22))
        drop-shadow(0 2px 0 rgba(255,255,255,.04));
      transform-origin: left center;
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
      box-shadow: 0 0 0 5px rgba(212,135,57,.12), 0 14px 34px rgba(212,135,57,.24);
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
      box-shadow: 0 16px 34px rgba(212,135,57,.28);
      white-space: nowrap;
    }
    .nav-builder {
      margin-left: 8px;
      border: 1px solid rgba(240,179,107,.38);
      color: var(--ink);
      background: rgba(212,135,57,.08);
    }
    main, .footer { position: relative; z-index: 1; }
    main { overflow: hidden; }
    section {
      position: relative;
      padding: 86px 22px;
      isolation: isolate;
    }
    .container { max-width: var(--max); min-width: 0; margin: 0 auto; position: relative; z-index: 1; }
    .hero {
      min-height: clamp(640px, calc(100vh - 82px), 820px);
      display: grid;
      align-items: center;
      padding-top: 96px;
      padding-bottom: 92px;
    }
    .hero::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 18px;
      width: min(760px, 70vw);
      height: 1px;
      transform: translateX(-50%);
      background: linear-gradient(90deg, transparent, rgba(246,180,95,.45), transparent);
      opacity: .72;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(330px, .78fr);
      gap: 56px;
      align-items: center;
    }
    .route-home .hero-home {
      min-height: clamp(720px, calc(100vh - 82px), 880px);
      background:
        radial-gradient(circle at 36% 46%, rgba(255,244,222,.11), transparent 22%),
        radial-gradient(circle at 69% 45%, rgba(246,180,95,.24), transparent 28%),
        radial-gradient(ellipse at 14% 68%, rgba(67,231,172,.18), transparent 30%),
        radial-gradient(ellipse at 78% 20%, rgba(246,180,95,.24), transparent 34%);
    }
    .route-home .hero-home::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(110deg, rgba(246,180,95,.18), transparent 24%),
        linear-gradient(180deg, rgba(255,255,255,.035), transparent 26%),
        radial-gradient(ellipse at 18% 24%, rgba(255,244,222,.08), transparent 30%),
        radial-gradient(ellipse at 72% 72%, rgba(67,231,172,.07), transparent 28%);
      opacity: .9;
      pointer-events: none;
    }
    .route-home .hero-grid {
      grid-template-columns: minmax(0, .96fr) minmax(330px, .64fr);
      gap: 44px;
      align-items: stretch;
    }
    .hero > .container:not(.hero-grid) {
      max-width: 980px;
      padding: 42px;
      border: 1px solid rgba(255,255,255,.13);
      border-radius: 18px;
      background:
        linear-gradient(135deg, rgba(255,255,255,.105), rgba(255,255,255,.022)),
        linear-gradient(90deg, rgba(246,180,95,.12), transparent 58%);
      box-shadow: 0 44px 120px rgba(0,0,0,.28);
      overflow: hidden;
    }
    .hero > .container:not(.hero-grid)::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(246,180,95,.22), transparent 32%, rgba(143,197,255,.16)),
        repeating-linear-gradient(90deg, transparent 0 72px, rgba(255,255,255,.045) 73px 74px);
      mask-image: linear-gradient(135deg, rgba(0,0,0,.8), transparent 70%);
      opacity: .8;
    }
    .apps-hero {
      min-height: clamp(640px, calc(100vh - 82px), 800px);
      background:
        radial-gradient(ellipse at 12% 18%, rgba(246,180,95,.20), transparent 28%),
        radial-gradient(ellipse at 84% 38%, rgba(67,231,172,.11), transparent 30%);
    }
    .apps-hero .hero-grid {
      grid-template-columns: minmax(0, .92fr) minmax(330px, .72fr);
      gap: 48px;
      align-items: center;
    }
    .apps-hero h1 {
      max-width: 880px;
      font-size: clamp(3.2rem, 6.35vw, 6rem);
      line-height: .9;
    }
    .apps-hero .lead {
      max-width: 760px;
      color: rgba(223,231,245,.86);
    }
    .workflow-poster {
      position: relative;
      min-height: 540px;
      padding: 28px;
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 44px 24px 52px 30px;
      background:
        radial-gradient(circle at 22% 10%, rgba(246,180,95,.20), transparent 26%),
        linear-gradient(155deg, rgba(255,249,239,.12), rgba(255,255,255,.035)),
        rgba(7,11,17,.76);
      box-shadow: 0 44px 130px rgba(0,0,0,.40);
      overflow: hidden;
      transform-style: preserve-3d;
    }
    .workflow-poster::before {
      content: "";
      position: absolute;
      inset: 22px;
      border-radius: 34px 18px 42px 22px;
      background:
        linear-gradient(rgba(21,26,33,.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(21,26,33,.05) 1px, transparent 1px),
        linear-gradient(150deg, #fff2d6, #f8dcc0 58%, #e8fff6);
      background-size: 34px 34px, 34px 34px, auto;
      box-shadow: inset 0 0 0 1px rgba(21,26,33,.08);
      transform: rotate(1.6deg);
    }
    .workflow-poster > * {
      position: relative;
      z-index: 1;
    }
    .poster-clip {
      width: 36%;
      height: 22px;
      margin: -6px auto 22px;
      border-radius: 0 0 8px 8px;
      background: rgba(246,180,95,.58);
      box-shadow: 0 10px 20px rgba(21,26,33,.13);
      transform: rotate(1.6deg);
    }
    .poster-label {
      display: inline-flex;
      padding: 8px 11px;
      color: #fff9ef;
      background: #121820;
      box-shadow: 8px 8px 0 rgba(216,41,47,.82);
      font-size: .72rem;
      font-weight: 950;
      letter-spacing: .12em;
      text-transform: uppercase;
      transform: rotate(-1deg);
    }
    .workflow-poster h2 {
      max-width: 410px;
      margin: 30px 0 20px;
      color: #121820;
      font-size: clamp(2.65rem, 4.45vw, 4.35rem);
      line-height: .88;
      letter-spacing: 0;
    }
    .poster-note {
      width: fit-content;
      max-width: 260px;
      margin-left: auto;
      padding: 13px 15px;
      color: #fff9ef;
      background: #d8292f;
      font-size: .88rem;
      font-weight: 950;
      line-height: 1.15;
      box-shadow: 0 12px 28px rgba(216,41,47,.32);
      transform: rotate(4deg) translateY(-12px);
    }
    .workflow-steps {
      display: grid;
      gap: 12px;
      margin-top: 20px;
      color: #121820;
    }
    .workflow-step {
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr);
      gap: 13px;
      align-items: start;
      padding-top: 14px;
      border-top: 1px solid rgba(21,26,33,.16);
      font-size: .95rem;
      font-weight: 850;
    }
    .workflow-step span {
      color: #d48739;
      font-weight: 950;
      letter-spacing: .08em;
    }
    .workflow-step p {
      margin: 0;
      color: rgba(18,24,32,.78);
    }
    .poster-stamp {
      position: absolute;
      right: 28px;
      bottom: 24px;
      width: 112px;
      height: 112px;
      display: grid;
      place-items: center;
      border: 2px solid rgba(18,24,32,.72);
      border-radius: 50%;
      color: #121820;
      font-size: .68rem;
      font-weight: 950;
      letter-spacing: .09em;
      text-align: center;
      text-transform: uppercase;
      transform: rotate(-9deg);
    }
    .hero-kicker, .scene-label {
      display: inline-flex;
      width: fit-content;
      align-items: center;
      gap: 9px;
      margin-bottom: 18px;
      border: 1px solid rgba(246,180,95,.28);
      border-radius: 999px;
      padding: 8px 11px;
      color: var(--copper-2);
      background: rgba(246,180,95,.08);
      font-size: .75rem;
      font-weight: 950;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    .hero-kicker::before, .scene-label::before {
      content: "";
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 18px rgba(67,231,172,.9);
    }
    .hero-copy { position: relative; z-index: 2; }
    .route-home .hero-copy {
      display: grid;
      align-content: center;
      min-height: 620px;
      padding-left: 6px;
    }
    .route-home .hero-kicker {
      border-radius: 999px;
      border-color: rgba(246,180,95,.62);
      background:
        linear-gradient(120deg, rgba(255,244,222,.10), rgba(246,180,95,.18)),
        rgba(246,180,95,.13);
      box-shadow:
        0 20px 44px rgba(0,0,0,.24),
        0 0 24px rgba(246,180,95,.10) inset;
      transform: rotate(-1.2deg);
    }
    .route-home .hero-kicker::before {
      border-radius: 50%;
    }
    .hero-stat-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin: 26px 0 30px;
      max-width: 650px;
    }
    .hero-stat {
      border: 1px solid rgba(255,255,255,.13);
      border-radius: 14px;
      padding: 14px;
      background: rgba(255,255,255,.055);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
    }
    .route-home .hero-stat {
      border-radius: 999px;
      border-color: rgba(255,244,222,.26);
      background:
        linear-gradient(125deg, rgba(255,255,255,.12), rgba(255,255,255,.035)),
        rgba(255,244,222,.035);
      box-shadow:
        0 22px 54px rgba(0,0,0,.24),
        0 1px 0 rgba(255,255,255,.16) inset;
    }
    .hero-stat b {
      display: block;
      color: var(--ink);
      font-size: 1.34rem;
      line-height: 1;
      margin-bottom: 7px;
    }
    .hero-stat span {
      color: var(--muted);
      font-size: .78rem;
      font-weight: 780;
    }
    .clarity-note {
      margin-top: 20px;
      max-width: 680px;
      display: grid;
      gap: 8px;
      padding: 18px 20px;
      border: 1px solid rgba(67,231,172,.28);
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(67,231,172,.10), rgba(255,255,255,.045));
      box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
    }
    .clarity-note b { color: var(--ink); font-size: 1rem; }
    .clarity-note span { color: var(--muted); font-weight: 650; }
    .route-home .clarity-note {
      border-radius: 28px;
      border-color: rgba(246,180,95,.34);
      background:
        linear-gradient(135deg, rgba(246,180,95,.12), rgba(255,255,255,.045));
      box-shadow: 0 26px 70px rgba(0,0,0,.22);
      transform: rotate(.35deg);
    }
    .poster-board {
      position: relative;
      align-self: center;
      min-height: 620px;
      padding: 34px;
      display: grid;
      align-content: space-between;
      border: 1px solid rgba(255,244,222,.54);
      border-radius: 32px 18px 38px 24px;
      background:
        radial-gradient(circle at 14% 9%, rgba(255,255,255,.95), transparent 18%),
        radial-gradient(circle at 88% 8%, rgba(216,41,47,.16), transparent 18%),
        linear-gradient(112deg, rgba(255,255,255,.34), transparent 22% 58%, rgba(255,255,255,.16)),
        linear-gradient(135deg, rgba(255,246,225,.99), rgba(238,204,157,.95)),
        #fff4de;
      color: #151a21;
      box-shadow:
        30px 28px 0 rgba(0,0,0,.46),
        -13px 12px 0 rgba(67,231,172,.26),
        0 50px 130px rgba(0,0,0,.46),
        0 1px 0 rgba(255,255,255,.82) inset,
        0 -42px 70px rgba(167,104,38,.16) inset;
      overflow: hidden;
      transform: rotate(1.5deg);
    }
    .poster-board::before {
      content: "";
      position: absolute;
      top: -18px;
      left: 32%;
      width: 160px;
      height: 42px;
      background:
        linear-gradient(115deg, rgba(255,255,255,.38), transparent 46%),
        rgba(246,180,95,.78);
      border: 1px solid rgba(21,26,33,.15);
      transform: rotate(-3deg);
      box-shadow: 0 10px 24px rgba(0,0,0,.12);
      pointer-events: none;
    }
    .poster-board::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(110deg, transparent 0 18%, rgba(255,255,255,.38) 26%, transparent 36% 100%),
        linear-gradient(90deg, rgba(21,26,33,.055) 1px, transparent 1px),
        linear-gradient(180deg, rgba(21,26,33,.05) 1px, transparent 1px);
      background-size: auto, 24px 24px, 24px 24px;
      opacity: .74;
      pointer-events: none;
    }
    .poster-board > * { position: relative; z-index: 1; }
    .poster-frame {
      position: absolute;
      inset: 22px;
      z-index: 0;
      border: 2px solid rgba(21,26,33,.18);
      border-radius: 24px 12px 30px 18px;
      pointer-events: none;
    }
    .poster-label {
      width: fit-content;
      padding: 8px 10px;
      color: #fff4de;
      background: linear-gradient(135deg, #202832, #0f141b);
      border-radius: 999px;
      font-size: .78rem;
      font-weight: 950;
      letter-spacing: .12em;
      text-transform: uppercase;
      box-shadow:
        8px 8px 0 rgba(216,41,47,.82),
        0 14px 24px rgba(0,0,0,.20);
    }
    .poster-board h2 {
      max-width: 430px;
      margin: 44px 0 28px;
      color: #151a21;
      font-size: clamp(2.45rem, 4.2vw, 4.35rem);
      line-height: .9;
      text-shadow: none;
    }
    .poster-lines {
      display: grid;
      gap: 12px;
    }
    .poster-line {
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr);
      gap: 12px;
      align-items: start;
      padding-top: 14px;
      border-top: 2px solid rgba(21,26,33,.18);
    }
    .poster-line b {
      font-size: 1.35rem;
      line-height: 1;
      color: #151a21;
    }
    .poster-line span {
      color: rgba(21,26,33,.76);
      font-weight: 800;
      line-height: 1.32;
    }
    .poster-stamp {
      justify-self: end;
      width: 116px;
      height: 116px;
      display: grid;
      place-items: center;
      border: 2px solid #151a21;
      border-radius: 50%;
      color: #151a21;
      font-weight: 950;
      text-align: center;
      line-height: 1;
      transform: rotate(-10deg);
    }
    .poster-note {
      position: absolute;
      right: -4px;
      top: 118px;
      z-index: 2;
      max-width: 158px;
      padding: 14px 14px 16px;
      color: #fff4de;
      background:
        linear-gradient(135deg, #ff474d, #b9141b);
      border: 2px solid rgba(21,26,33,.22);
      border-radius: 22px 14px 26px 16px;
      box-shadow:
        0 22px 42px rgba(0,0,0,.30),
        10px 10px 0 rgba(0,0,0,.20),
        0 1px 0 rgba(255,255,255,.34) inset;
      font-weight: 950;
      line-height: 1.05;
      transform: rotate(5deg);
    }
    .poster-note small {
      display: block;
      margin-top: 8px;
      color: rgba(255,244,222,.78);
      font-size: .72rem;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .holo-stage {
      position: relative;
      min-height: 560px;
      perspective: 1200px;
    }
    .holo-stage::before {
      content: "";
      position: absolute;
      inset: 6% -4% 0 6%;
      border-radius: 50%;
      background:
        radial-gradient(circle, rgba(246,180,95,.23), transparent 58%),
        conic-gradient(from 20deg, rgba(246,180,95,.16), rgba(143,197,255,.10), rgba(67,231,172,.11), rgba(246,180,95,.16));
      filter: blur(2px);
      opacity: .75;
      transform: rotateX(68deg) rotateZ(-18deg);
    }
    .orbit-ring {
      position: absolute;
      inset: 8% 0 auto 4%;
      aspect-ratio: 1;
      width: min(520px, 92%);
      border: 1px solid rgba(246,180,95,.28);
      border-radius: 50%;
      transform: rotateX(62deg) rotateZ(-18deg);
      box-shadow: 0 0 60px rgba(246,180,95,.10), inset 0 0 40px rgba(143,197,255,.08);
    }
    .orbit-ring:nth-child(2) {
      inset: 16% auto auto 24%;
      width: min(390px, 70%);
      border-color: rgba(143,197,255,.22);
      transform: rotateX(66deg) rotateZ(26deg);
    }
    .holo-console {
      position: absolute;
      top: 12%;
      right: 0;
      width: min(440px, 94%);
      padding: 22px;
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 20px;
      background:
        linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.045)),
        rgba(7,12,20,.78);
      box-shadow: 0 50px 120px rgba(0,0,0,.42);
      transform: rotateY(-13deg) rotateX(7deg);
      transform-style: preserve-3d;
      overflow: hidden;
    }
    .holo-console::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(120deg, transparent 0 35%, rgba(255,255,255,.20), transparent 56%),
        repeating-linear-gradient(180deg, rgba(255,255,255,.035) 0 1px, transparent 1px 9px);
      opacity: .36;
      pointer-events: none;
    }
    .console-top {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      color: var(--soft);
      font-size: .76rem;
      font-weight: 950;
      letter-spacing: .11em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }
    .console-card {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) auto;
      align-items: center;
      gap: 14px;
      padding: 16px 0;
      border-top: 1px solid rgba(255,255,255,.12);
      position: relative;
      z-index: 1;
    }
    .console-card b { display: block; font-size: 1.02rem; }
    .console-card span { color: var(--muted); font-size: .88rem; }
    .console-icon {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      color: #160f08;
      background: linear-gradient(135deg, var(--copper-2), #c8792d);
      font-weight: 950;
      box-shadow: 0 14px 34px rgba(212,135,57,.26);
    }
    .console-status {
      color: var(--green);
      font-size: .72rem;
      font-weight: 950;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .floating-chip {
      position: absolute;
      z-index: 3;
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 999px;
      padding: 10px 12px;
      color: var(--ink);
      background: rgba(255,255,255,.08);
      box-shadow: 0 22px 60px rgba(0,0,0,.28);
      font-size: .82rem;
      font-weight: 900;
      backdrop-filter: blur(16px);
    }
    .chip-one { top: 7%; left: 6%; }
    .chip-two { bottom: 17%; right: 8%; }
    .chip-three { bottom: 6%; left: 18%; color: var(--copper-2); }
    h1, h2, h3, p { margin-top: 0; }
    h1 {
      margin-bottom: 24px;
      font-size: clamp(3.2rem, 8vw, 6.5rem);
      line-height: .88;
      letter-spacing: 0;
      max-width: 900px;
      overflow-wrap: anywhere;
      text-wrap: balance;
      text-shadow: 0 18px 70px rgba(0,0,0,.62);
    }
    .hero-home h1 {
      font-size: clamp(3.3rem, 6.3vw, 5.9rem);
      line-height: .88;
      max-width: 790px;
      text-shadow:
        1px 1px 0 rgba(255,255,255,.10),
        9px 10px 0 rgba(0,0,0,.28),
        0 28px 90px rgba(0,0,0,.62),
        0 0 34px rgba(246,180,95,.10);
    }
    .route-home .lead {
      max-width: 710px;
      font-size: clamp(1.15rem, 1.8vw, 1.42rem);
      color: rgba(223,231,245,.88);
      text-shadow: 0 12px 42px rgba(0,0,0,.55);
    }
    h2 {
      font-size: clamp(2rem, 4.5vw, 4rem);
      line-height: .98;
      letter-spacing: 0;
      margin-bottom: 18px;
      max-width: 850px;
      text-wrap: balance;
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
      position: relative;
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
      transform: translateZ(0);
      transition: transform .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease;
      overflow: hidden;
    }
    .btn::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, transparent 0 34%, rgba(255,255,255,.44) 45%, transparent 56% 100%);
      transform: translateX(-130%);
      transition: transform .65s ease;
      pointer-events: none;
    }
    .btn-primary {
      border: 0;
      color: #17100a;
      background:
        radial-gradient(circle at 24% 20%, rgba(255,255,255,.46), transparent 22%),
        linear-gradient(135deg, var(--copper-2), #b86e27);
      box-shadow:
        0 18px 42px rgba(212,135,57,.30),
        0 1px 0 rgba(255,255,255,.30) inset,
        0 -16px 24px rgba(112,64,24,.16) inset;
    }
    .btn-secondary {
      background:
        linear-gradient(135deg, rgba(255,255,255,.11), rgba(255,255,255,.035));
      color: var(--ink);
      box-shadow: 0 18px 42px rgba(0,0,0,.18), 0 1px 0 rgba(255,255,255,.10) inset;
      backdrop-filter: blur(14px);
    }
    .btn:hover { transform: translateY(-2px); border-color: rgba(246,180,95,.46); }
    .btn:hover::after { transform: translateX(130%); }
    .btn-primary:hover { box-shadow: 0 20px 42px rgba(212,135,57,.34); }
    .path-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .path {
      position: relative;
      display: grid;
      align-content: start;
      padding: 28px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background:
        linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04)),
        rgba(12,18,27,.62);
      min-height: 210px;
      box-shadow: 0 20px 60px rgba(0,0,0,.18);
      overflow: hidden;
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
      gap: 20px;
    }
    .offer-card {
      position: relative;
      display: grid;
      align-content: start;
      min-height: 340px;
      padding: 30px;
      border: 1px solid var(--line);
      border-radius: 22px;
      color: var(--ink);
      text-decoration: none;
      background:
        linear-gradient(160deg, rgba(255,255,255,.14), rgba(255,255,255,.04)),
        rgba(12,18,27,.74);
      box-shadow: 0 34px 90px rgba(0,0,0,.30);
      overflow: hidden;
      transform-style: preserve-3d;
      transition: transform .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease;
    }
    .offer-card::before, .item::before, .price::before, .question::before, .mockup::before, .path::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(135deg, rgba(255,255,255,.16), transparent 34%, rgba(246,180,95,.08));
      opacity: .46;
    }
    .offer-card:hover {
      transform: translateY(-10px) rotateX(2deg);
      border-color: rgba(240,179,107,.42);
      background:
        linear-gradient(160deg, rgba(212,135,57,.16), rgba(135,183,255,.06)),
        rgba(17,20,28,.94);
      box-shadow: 0 46px 100px rgba(0,0,0,.38);
    }
    .offer-card > *, .item > *, .price > *, .question > *, .path > *, .mockup > * { position: relative; z-index: 1; }
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
      font-size: 1.75rem;
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
    .offer-link::after {
      content: "";
      width: 1.2em;
      height: 1px;
      background: currentColor;
      box-shadow: .82em -.26em 0 -.02em transparent;
      mask:
        linear-gradient(currentColor 0 0) left center / .92em 2px no-repeat,
        linear-gradient(45deg, transparent 42%, currentColor 43% 57%, transparent 58%) right center / .58em .58em no-repeat;
      -webkit-mask:
        linear-gradient(currentColor 0 0) left center / .92em 2px no-repeat,
        linear-gradient(45deg, transparent 42%, currentColor 43% 57%, transparent 58%) right center / .58em .58em no-repeat;
      background-color: currentColor;
      transition: transform .18s ease;
    }
    .offer-card:hover .offer-link::after { transform: translateX(4px); }
    .situation-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }
    .situation-card {
      position: relative;
      min-height: 310px;
      display: grid;
      align-content: start;
      padding: 26px;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 22px;
      background:
        radial-gradient(circle at 18% 0%, rgba(246,180,95,.16), transparent 42%),
        linear-gradient(145deg, rgba(255,255,255,.09), rgba(255,255,255,.035));
      color: var(--ink);
      text-decoration: none;
      overflow: hidden;
      box-shadow: 0 26px 72px rgba(0,0,0,.24);
      transition: transform .18s ease, border-color .18s ease, background .18s ease;
    }
    .situation-card:hover {
      transform: translateY(-8px);
      border-color: rgba(246,180,95,.42);
      background:
        radial-gradient(circle at 18% 0%, rgba(246,180,95,.23), transparent 42%),
        linear-gradient(145deg, rgba(255,255,255,.12), rgba(255,255,255,.05));
    }
    .route-home .situation-card,
    .route-home .plain-step,
    .route-home .reassurance-card,
    .route-home .example-card,
    .route-home .myth-card {
      border-radius: 28px 18px 34px 22px;
      border-color: rgba(246,180,95,.28);
      background:
        radial-gradient(circle at 18% 0%, rgba(255,244,222,.18), transparent 35%),
        linear-gradient(135deg, rgba(255,244,222,.12), transparent 44%),
        linear-gradient(150deg, rgba(255,255,255,.10), rgba(255,255,255,.025)),
        rgba(255,255,255,.045);
      box-shadow:
        0 34px 92px rgba(0,0,0,.30),
        0 1px 0 rgba(255,255,255,.13) inset,
        0 -26px 48px rgba(0,0,0,.12) inset;
      overflow: hidden;
    }
    .route-home .situation-card::before,
    .route-home .plain-step::after,
    .route-home .reassurance-card::before,
    .route-home .example-card::before,
    .route-home .myth-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg, transparent 0 26%, rgba(255,255,255,.16) 37%, transparent 50% 100%);
      opacity: .58;
      pointer-events: none;
    }
    .route-home .situation-card:nth-child(2),
    .route-home .example-card:nth-child(2),
    .route-home .reassurance-card:nth-child(2) {
      transform: rotate(.45deg);
    }
    .route-home .situation-card:nth-child(3),
    .route-home .example-card:nth-child(3),
    .route-home .reassurance-card:nth-child(3) {
      transform: rotate(-.35deg);
    }
    .route-home .situation-card:hover {
      transform: translateY(-8px) rotate(0);
      box-shadow:
        0 42px 110px rgba(0,0,0,.38),
        0 0 0 1px rgba(246,180,95,.16) inset;
    }
    .situation-number {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--copper-2), #c7752c);
      color: #130e08;
      font-weight: 950;
      margin-bottom: 22px;
    }
    .situation-card h3 { font-size: 1.25rem; margin-bottom: 10px; }
    .situation-card p { color: var(--muted); margin-bottom: 18px; }
    .situation-card span:last-child {
      align-self: end;
      color: var(--copper-2);
      font-weight: 900;
    }
    .plain-steps, .reassurance-grid, .example-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }
    .myth-grid {
      display: grid;
      gap: 16px;
    }
    .plain-step, .reassurance-card, .example-card, .myth-card {
      position: relative;
      padding: 28px;
      border-radius: 22px;
      border: 1px solid rgba(255,255,255,.13);
      background:
        linear-gradient(135deg, rgba(67,231,172,.08), transparent 38%),
        rgba(255,255,255,.055);
      box-shadow: 0 24px 60px rgba(0,0,0,.22);
    }
    .myth-card {
      display: grid;
      grid-template-columns: minmax(210px, .42fr) minmax(0, 1fr);
      gap: 24px;
      align-items: start;
      background:
        linear-gradient(135deg, rgba(246,180,95,.12), transparent 35%),
        rgba(255,255,255,.055);
    }
    .route-home .myth-card {
      grid-template-columns: minmax(250px, .38fr) minmax(0, 1fr);
      background:
        radial-gradient(circle at 0% 0%, rgba(216,41,47,.16), transparent 26%),
        linear-gradient(90deg, rgba(246,180,95,.16), transparent 38%),
        rgba(255,244,222,.055);
    }
    .myth-card strong {
      color: var(--copper-2);
      font-size: .76rem;
      font-weight: 950;
      letter-spacing: .08em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 10px;
    }
    .myth-card h3 { font-size: 1.32rem; margin-bottom: 0; }
    .myth-card p { color: var(--muted); margin-bottom: 0; }
    .plain-steps { counter-reset: step; }
    .plain-step::before {
      counter-increment: step;
      content: counter(step);
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      margin-bottom: 20px;
      color: #111;
      font-weight: 950;
      background: var(--green);
    }
    .plain-step h3, .reassurance-card h3, .example-card h3 { font-size: 1.28rem; margin-bottom: 10px; }
    .plain-step p, .reassurance-card p, .example-card p { color: var(--muted); margin-bottom: 0; }
    .mockup {
      position: relative;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
      background:
        linear-gradient(145deg, rgba(255,255,255,.13), rgba(255,255,255,.04)),
        rgba(20,16,16,.58);
      box-shadow: 0 36px 90px rgba(0,0,0,.34);
      overflow: hidden;
    }
    .decision-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }
    .decision-card {
      position: relative;
      overflow: hidden;
      min-height: 270px;
      padding: 28px;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 22px;
      background:
        linear-gradient(145deg, rgba(143,197,255,.11), transparent 38%),
        linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04)),
        rgba(9,14,22,.78);
      box-shadow: 0 32px 86px rgba(0,0,0,.28);
    }
    .decision-card::before {
      content: attr(data-index);
      position: absolute;
      right: 18px;
      top: 12px;
      color: rgba(246,180,95,.16);
      font-size: 5.2rem;
      line-height: 1;
      font-weight: 950;
    }
    .decision-card strong {
      display: block;
      color: var(--copper-2);
      font-size: .76rem;
      letter-spacing: .10em;
      text-transform: uppercase;
      margin-bottom: 22px;
    }
    .decision-card h3 {
      position: relative;
      z-index: 1;
      font-size: 1.55rem;
      margin-bottom: 14px;
    }
    .decision-card p {
      position: relative;
      z-index: 1;
      color: var(--muted);
      margin-bottom: 0;
    }
    .cinema-band {
      overflow: hidden;
      background:
        linear-gradient(90deg, rgba(246,180,95,.10), transparent 35%, rgba(143,197,255,.08)),
        rgba(255,255,255,.025);
      border-block: 1px solid rgba(255,255,255,.10);
    }
    .cinema-band::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, transparent 0 12%, rgba(255,255,255,.08) 13%, transparent 14% 48%, rgba(246,180,95,.11) 49%, transparent 50%),
        repeating-linear-gradient(90deg, transparent 0 95px, rgba(255,255,255,.035) 96px 97px);
      opacity: .56;
      transform: skewY(-2deg);
    }
    .cinema-inner {
      display: grid;
      grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
      gap: 44px;
      align-items: center;
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
      box-shadow: inset 0 0 18px rgba(246,180,95,.12);
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
    .story-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 22px;
    }
    .app-story {
      position: relative;
      min-height: 330px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 205px;
      gap: 24px;
      align-items: stretch;
      padding: 28px;
      border: 1px solid rgba(255,255,255,.13);
      border-radius: 38px 22px 44px 26px;
      background:
        radial-gradient(circle at 12% 0%, rgba(246,180,95,.16), transparent 34%),
        linear-gradient(135deg, rgba(255,244,222,.105), rgba(255,255,255,.035)),
        rgba(8,13,20,.74);
      box-shadow: 0 34px 90px rgba(0,0,0,.28);
      overflow: hidden;
    }
    .app-story::before {
      content: "";
      position: absolute;
      width: 280px;
      height: 190px;
      right: -90px;
      top: -60px;
      border-radius: 999px;
      background: rgba(246,180,95,.14);
      transform: rotate(-18deg);
      pointer-events: none;
    }
    .app-story.green::before { background: rgba(67,231,172,.14); }
    .app-story.blue::before { background: rgba(143,197,255,.14); }
    .app-story.red::before { background: rgba(216,41,47,.16); }
    .app-story > * { position: relative; z-index: 1; }
    .story-copy {
      display: grid;
      align-content: space-between;
      gap: 18px;
    }
    .story-kicker {
      width: fit-content;
      padding: 7px 10px;
      border-radius: 999px;
      color: #151a21;
      background: var(--copper-2);
      font-size: .72rem;
      font-weight: 950;
      letter-spacing: .09em;
      text-transform: uppercase;
    }
    .app-story h3 {
      margin-bottom: 10px;
      font-size: clamp(1.55rem, 2vw, 2.05rem);
    }
    .app-story p {
      color: var(--muted);
      margin-bottom: 0;
    }
    .story-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .story-meta span {
      padding: 7px 10px;
      border-radius: 999px;
      color: rgba(255,249,239,.88);
      border: 1px solid rgba(255,255,255,.13);
      background: rgba(255,255,255,.055);
      font-size: .78rem;
      font-weight: 800;
    }
    .story-visual {
      position: relative;
      min-height: 210px;
      display: grid;
      align-content: space-between;
      gap: 12px;
      padding: 18px;
      border-radius: 38% 62% 52% 48% / 36% 44% 56% 64%;
      color: #121820;
      background:
        linear-gradient(rgba(18,24,32,.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(18,24,32,.05) 1px, transparent 1px),
        linear-gradient(135deg, #fff4de, #f6b45f);
      background-size: 24px 24px, 24px 24px, auto;
      box-shadow: inset 0 0 0 2px rgba(21,26,33,.08), 0 26px 70px rgba(0,0,0,.25);
      transform: rotate(2deg);
    }
    .app-story.green .story-visual { background: linear-gradient(135deg, #e8fff6, #43e7ac); }
    .app-story.blue .story-visual { background: linear-gradient(135deg, #eef7ff, #8fc5ff); }
    .app-story.red .story-visual { background: linear-gradient(135deg, #fff1ef, #f37b76); }
    .story-icon {
      align-self: start;
      width: fit-content;
      padding: 8px 10px;
      color: #fff9ef;
      background: #121820;
      box-shadow: 6px 6px 0 rgba(216,41,47,.72);
      font-size: .76rem;
      font-weight: 950;
      letter-spacing: .11em;
      line-height: 1;
      text-transform: uppercase;
      transform: rotate(-2deg);
    }
    .story-visual::before,
    .story-visual::after {
      content: "";
      display: block;
      border-radius: 999px;
      background: rgba(18,24,32,.82);
      box-shadow:
        0 18px 0 rgba(18,24,32,.22),
        0 36px 0 rgba(18,24,32,.14);
    }
    .story-visual::before {
      width: 74%;
      height: 12px;
      margin-top: 36px;
    }
    .story-visual::after {
      width: 44%;
      height: 12px;
      margin-left: auto;
      opacity: .72;
    }
    .story-caption {
      justify-self: end;
      width: fit-content;
      max-width: 154px;
      padding: 9px 11px;
      border-radius: 999px;
      color: #121820;
      border: 1px solid rgba(18,24,32,.18);
      background: rgba(255,249,239,.64);
      font-size: .72rem;
      font-weight: 950;
      letter-spacing: .05em;
      text-align: center;
      text-transform: uppercase;
      transform: rotate(-2deg);
    }
    .item {
      position: relative;
      min-height: 168px;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background:
        linear-gradient(155deg, rgba(255,255,255,.12), rgba(255,255,255,.04)),
        rgba(14,20,30,.70);
      overflow: hidden;
      box-shadow: 0 22px 58px rgba(0,0,0,.18);
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
      background: linear-gradient(135deg, rgba(255,255,255,.04), rgba(143,197,255,.035));
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .price {
      position: relative;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 28px;
      background:
        linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04)),
        rgba(14,20,30,.70);
      overflow: hidden;
      box-shadow: 0 22px 58px rgba(0,0,0,.18);
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
      position: relative;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background:
        linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.035)),
        rgba(14,20,30,.70);
      overflow: hidden;
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
      background:
        radial-gradient(circle at 18% 20%, rgba(255,244,222,.13), transparent 22%),
        linear-gradient(135deg, rgba(212,135,57,.23), rgba(67,231,172,.08) 52%, rgba(135,183,255,.10));
      border-top: 1px solid rgba(246,180,95,.22);
      border-bottom: 1px solid rgba(246,180,95,.18);
      box-shadow:
        0 1px 0 rgba(255,255,255,.08) inset,
        0 -42px 90px rgba(0,0,0,.16) inset;
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
      .brand-logo { width: clamp(172px, 52vw, 230px); }
      nav { justify-content: flex-start; }
      .nav-cta, .nav-builder { margin-left: 0; }
      .hero { padding-top: 64px; }
      .hero-grid, .split, .path-strip, .offer-grid, .situation-grid, .plain-steps, .reassurance-grid, .example-grid, .myth-card, .decision-grid, .cinema-inner, .list, .story-grid, .faq-grid, .pricing-grid, .cta-inner { grid-template-columns: 1fr; }
      .apps-hero .hero-grid { grid-template-columns: 1fr; }
      .workflow-poster { min-height: 480px; }
      .app-story { grid-template-columns: 1fr; }
      .story-visual { min-height: 190px; }
      .offer-head, .section-header { align-items: flex-start; flex-direction: column; }
      .offer-card { min-height: auto; }
      .situation-card { min-height: auto; }
      .item { grid-template-columns: 1fr; gap: 10px; }
      .holo-stage { min-height: 500px; }
      .holo-console { position: relative; top: auto; right: auto; margin: 40px auto 0; transform: none; }
      .floating-chip { display: none; }
    }
    @media (max-width: 520px) {
      section { padding: 54px 18px; }
      .nav-wrap { padding-left: 18px; padding-right: 18px; }
      nav { width: 100%; justify-content: flex-start; gap: 2px 6px; }
      nav a { padding: 8px 7px; font-size: .82rem; }
      .nav-cta { width: auto; }
      .brand-logo { width: min(76vw, 210px); }
      .brand-sub, .nav-builder { display: none; }
      .container { width: min(100%, var(--max)); max-width: var(--max); margin-inline: auto; }
      .hero-grid, .hero-grid > *, h1, .lead { min-width: 0; max-width: 100%; }
      h1 { width: 100%; font-size: clamp(1.95rem, 9vw, 2.28rem); line-height: 1.04; }
      .hero-home h1 {
        font-size: clamp(2.35rem, 11vw, 3.15rem);
        line-height: 1;
        max-width: 100%;
        overflow-wrap: normal;
        word-break: normal;
        text-shadow:
          0 8px 28px rgba(0,0,0,.58),
          0 1px 0 rgba(255,255,255,.08);
      }
      .route-home .hero-grid { display: block; }
      .route-home .hero-copy { display: block; min-height: auto; }
      .route-home .hero-kicker { max-width: 100%; box-shadow: none; }
      .poster-board { display: none; }
      .lead { width: 100%; font-size: 1.02rem; }
      .hero { min-height: auto; padding-top: 74px; padding-bottom: 70px; }
      .apps-hero h1 { font-size: clamp(2.35rem, 11vw, 3.2rem); line-height: .98; }
      .workflow-poster { min-height: 390px; padding: 20px; border-radius: 28px 18px 34px 20px; }
      .workflow-poster::before { inset: 14px; }
      .workflow-poster h2 { display: none; }
      .poster-note { display: none; }
      .workflow-step { grid-template-columns: 34px minmax(0, 1fr); font-size: .86rem; }
      .poster-stamp { display: none; }
      .hero > .container:not(.hero-grid) { padding: 24px; border-radius: 16px; }
      .hero-stat-grid { grid-template-columns: 1fr; }
      .hero-home .hero-stat-grid { display: none; }
      .hero-home .holo-stage { display: none; }
      .holo-stage { min-height: auto; }
      .orbit-ring, .holo-stage::before { display: none; }
      .actions { width: 100%; max-width: 100%; }
      .btn { width: 100%; max-width: 100%; }
      .path, .offer-card, .app-story, .situation-card, .plain-step, .reassurance-card, .example-card, .myth-card, .decision-card, .price, .question { padding: 22px; }
      .story-visual { min-height: 160px; }
      .scene-canvas { opacity: .34; }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: .01ms !important;
      }
      .scene-canvas { display: none; }
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
</head>
<body class="${routeClass}">
  <canvas class="scene-canvas" aria-hidden="true"></canvas>
  <div class="ambient" aria-hidden="true"></div>
  <div class="noise" aria-hidden="true"></div>
  <header class="site-header">
    <div class="nav-wrap">
      <a class="brand" href="/" aria-label="Penny Wise I.T home"><img class="brand-logo" src="/brand/pennywise-it-logo-header.svg" width="980" height="220" alt="Penny Wise I.T"></a>
      <nav aria-label="Primary navigation">${nav(active)}<a class="nav-cta" href="${talkUrl}">Talk to Steve</a></nav>
    </div>
  </header>
  ${body}
  <footer class="footer">
    <div class="container">
      <span>Penny Wise I.T - websites, apps, and automation for Australian small business.</span>
      <span class="footer-links"><a href="/faq">FAQ</a><a href="/admin">Admin</a><a href="${talkUrl}">steve@pennywiseit.com.au</a></span>
    </div>
  </footer>
  <script>
    (function () {
      var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!window.gsap || reduceMotion) return;
      gsap.registerPlugin(window.ScrollTrigger);
      var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".site-header", { autoAlpha: 0, y: -18, duration: .55 }, 0)
        .from(".brand-logo", { autoAlpha: 0, scale: .9, x: -12, duration: .58 }, .12)
        .from("nav a", { autoAlpha: 0, y: -8, stagger: .035, duration: .38 }, .15)
        .from(".hero-kicker", { autoAlpha: 0, y: 18, duration: .46 }, .16)
        .fromTo(".hero h1", { y: 54, skewY: 2.4, scale: .985 }, { autoAlpha: 1, y: 0, skewY: 0, scale: 1, duration: 1.05 }, .2)
        .from(".hero .lead", { autoAlpha: 0, y: 18, duration: .62 }, .28)
        .from(".hero-stat", { autoAlpha: 0, y: 18, scale: .96, stagger: .08, duration: .48 }, .38)
        .from(".hero .actions .btn", { autoAlpha: 0, y: 14, stagger: .08, duration: .48 }, .52)
        .from(".hero .mockup, .workflow-poster", { autoAlpha: 0, y: 28, scale: .985, duration: .85 }, .34)
        .from(".hero .mock-row", { autoAlpha: 0, x: 18, stagger: .08, duration: .42 }, .58)
        .from(".workflow-step", { autoAlpha: 0, x: 18, stagger: .08, duration: .42 }, .58)
        .from(".orbit-ring", { autoAlpha: 0, rotate: -30, scale: .78, stagger: .12, duration: 1.1 }, .18)
        .from(".holo-console", { autoAlpha: 0, y: 46, rotateY: -24, rotateX: 16, scale: .92, duration: 1.05 }, .34)
        .from(".console-card", { autoAlpha: 0, x: 34, stagger: .09, duration: .48 }, .68)
        .from(".floating-chip", { autoAlpha: 0, y: 22, scale: .84, stagger: .1, duration: .5 }, .72);

      ScrollTrigger.create({
        start: 12,
        end: 99999,
        toggleClass: { targets: ".site-header", className: "is-scrolled" }
      });

      gsap.utils.toArray("section:not(.hero)").forEach(function (section) {
        var targets = section.querySelectorAll(".section-header, .offer-head, .scene-label, h2, .section-lead, .lead, .item, .app-story, .offer-card, .decision-card, .price, .question, .path");
        if (!targets.length) return;
        gsap.from(targets, {
          autoAlpha: 0,
          y: 28,
          duration: .72,
          ease: "power2.out",
          stagger: .055,
          immediateRender: false,
          scrollTrigger: { trigger: section, start: "top 88%", once: true }
        });
      });

      var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!finePointer) return;
      gsap.to(".orbit-ring", { rotate: "+=360", duration: 32, ease: "none", repeat: -1, stagger: 6 });
      gsap.to(".floating-chip", { y: -12, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: .35 });
      gsap.to(".holo-console", { y: -10, rotateY: -10, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

      gsap.utils.toArray(".offer-card, .item, .app-story, .decision-card, .price, .question, .path, .mockup, .workflow-poster, .holo-console").forEach(function (card) {
        card.addEventListener("mousemove", function (event) {
          var rect = card.getBoundingClientRect();
          var x = (event.clientX - rect.left) / rect.width - .5;
          var y = (event.clientY - rect.top) / rect.height - .5;
          gsap.to(card, { rotateY: x * 4, rotateX: y * -4, transformPerspective: 900, duration: .28, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", function () {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: .45, ease: "power2.out" });
        });
      });
    })();
  </script>
  <script type="module">
    import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var canvas = document.querySelector(".scene-canvas");
    if (canvas && !reduceMotion) {
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(52, 1, .1, 100);
      camera.position.set(0, 0, 10);

      var group = new THREE.Group();
      scene.add(group);

      var geometry = new THREE.IcosahedronGeometry(1, 3);
      var material = new THREE.MeshStandardMaterial({
        color: 0xf0a64f,
        roughness: .28,
        metalness: .46,
        transparent: true,
        opacity: .40,
        wireframe: true
      });
      var core = new THREE.Mesh(geometry, material);
      core.scale.set(3.15, 3.15, 3.15);
      core.position.set(4.35, 1.02, -1.35);
      group.add(core);

      var ringMaterial = new THREE.MeshBasicMaterial({ color: 0xf6b45f, transparent: true, opacity: .30, wireframe: true });
      var ringOne = new THREE.Mesh(new THREE.TorusGeometry(3.58, .014, 10, 160), ringMaterial);
      ringOne.position.copy(core.position);
      ringOne.rotation.set(1.28, .18, -.62);
      group.add(ringOne);
      var ringTwo = new THREE.Mesh(new THREE.TorusGeometry(2.76, .012, 10, 140), new THREE.MeshBasicMaterial({ color: 0x8fc5ff, transparent: true, opacity: .22, wireframe: true }));
      ringTwo.position.copy(core.position);
      ringTwo.rotation.set(1.05, -.45, .35);
      group.add(ringTwo);

      var beamGeometry = new THREE.BufferGeometry();
      var beamPositions = new Float32Array([
        -5.8, -2.3, -5.5, 3.7, 1.1, -1.2,
        -3.8, 2.4, -6.8, 3.7, 1.1, -1.2,
        4.2, -2.8, -4.2, 3.7, 1.1, -1.2,
        -1.4, -.2, -7.2, 3.7, 1.1, -1.2
      ]);
      beamGeometry.setAttribute("position", new THREE.BufferAttribute(beamPositions, 3));
      var beams = new THREE.LineSegments(beamGeometry, new THREE.LineBasicMaterial({ color: 0x43e7ac, transparent: true, opacity: .28 }));
      group.add(beams);

      var smallMaterial = new THREE.MeshStandardMaterial({ color: 0x8fc5ff, roughness: .38, metalness: .22, transparent: true, opacity: .28, wireframe: true });
      for (var i = 0; i < 26; i += 1) {
        var mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(.18 + Math.random() * .32, 0), smallMaterial);
        mesh.position.set((Math.random() - .5) * 12, (Math.random() - .5) * 7, -2 - Math.random() * 9);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        group.add(mesh);
      }

      var particles = new THREE.BufferGeometry();
      var count = window.innerWidth < 700 ? 92 : 230;
      var positions = new Float32Array(count * 3);
      for (var p = 0; p < count; p += 1) {
        positions[p * 3] = (Math.random() - .5) * 16;
        positions[p * 3 + 1] = (Math.random() - .5) * 10;
        positions[p * 3 + 2] = -Math.random() * 13;
      }
      particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      var particleMaterial = new THREE.PointsMaterial({ color: 0xf6b45f, size: .028, transparent: true, opacity: .72 });
      var points = new THREE.Points(particles, particleMaterial);
      scene.add(points);

      scene.add(new THREE.AmbientLight(0xfff4de, .62));
      var key = new THREE.DirectionalLight(0xf6b45f, 2.1);
      key.position.set(5, 3, 4);
      scene.add(key);
      var fill = new THREE.DirectionalLight(0x8fc5ff, .95);
      fill.position.set(-4, -2, 3);
      scene.add(fill);
      var rim = new THREE.PointLight(0xffffff, 1.2, 18);
      rim.position.set(2.8, 2.2, 3.6);
      scene.add(rim);

      var mouseX = 0;
      var mouseY = 0;
      window.addEventListener("pointermove", function (event) {
        mouseX = (event.clientX / window.innerWidth - .5) * 2;
        mouseY = (event.clientY / window.innerHeight - .5) * 2;
      }, { passive: true });

      function resize() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      resize();
      window.addEventListener("resize", resize, { passive: true });

      var running = true;
      document.addEventListener("visibilitychange", function () {
        running = !document.hidden;
        if (running) requestAnimationFrame(animate);
      });

      function animate(time) {
        if (!running) return;
        var t = time * .001;
        group.rotation.y = t * .12 + mouseX * .08;
        group.rotation.x = Math.sin(t * .35) * .07 + mouseY * .05;
        core.rotation.x = t * .18;
        core.rotation.y = t * .28;
        ringOne.rotation.z = t * .18;
        ringTwo.rotation.z = -t * .24;
        beams.rotation.y = Math.sin(t * .28) * .08;
        points.rotation.y = t * .025;
        points.rotation.x = Math.sin(t * .2) * .025;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  </script>
</body>
</html>`;
}

function home() {
  return shell({
    active: "/",
    title: "Penny Wise I.T - Premium Websites and Business Systems",
    description: "Premium websites, customer tools, and automation for Australian small businesses that want a clear, guided build without the tech headache.",
    body: `<main>
    <section class="hero hero-home">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="hero-kicker">Premium websites + practical business systems</span>
          <h1>Professional websites and tools without the tech headache.</h1>
          <p class="lead">Penny Wise I.T helps local businesses launch with a polished website, then add bookings, ordering, forms, follow-ups, or automation only when it clearly helps the business.</p>
          <div class="hero-stat-grid" aria-label="Penny Wise offer highlights">
            <div class="hero-stat"><b>Local</b><span>Central QLD business focus</span></div>
            <div class="hero-stat"><b>Pro</b><span>managed polish available</span></div>
            <div class="hero-stat"><b>Yours</b><span>brand, domain, customers</span></div>
          </div>
          <div class="actions">
            <a class="btn btn-primary" href="${builderUrl}">Start my website</a>
            <a class="btn btn-secondary" href="${talkUrl}">Ask Steve what fits</a>
          </div>
          <div class="clarity-note"><b>Built for Central QLD small businesses, not anonymous templates.</b><span>Bring the hearsay, doubts, and half-advice you have been given. Steve will help sort what matters, what can wait, and what is worth building properly.</span></div>
        </div>
        <div class="poster-board" aria-label="Penny Wise premium website poster">
          <span class="poster-frame" aria-hidden="true"></span>
          <span class="poster-label">Central QLD buying reality</span>
          <span class="poster-note">Customers check before they call.<small>Give them somewhere solid</small></span>
          <h2>People do not just find you. They compare you.</h2>
          <div class="poster-lines">
            <div class="poster-line"><b>01</b><span>Facebook keeps warm customers updated. Your website helps strangers understand why they should trust you.</span></div>
            <div class="poster-line"><b>02</b><span>Google can surface the business. Your website gives the proof, menu, services, answers, and next step.</span></div>
            <div class="poster-line"><b>03</b><span>Premium means the customer journey feels considered before anyone spends money or picks up the phone.</span></div>
          </div>
          <div class="poster-stamp">Control the first impression</div>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="offer-head">
          <h2>Choose the starting point that sounds like you.</h2>
          <p>One clear decision first. The product names can come later.</p>
        </div>
        <div class="situation-grid">
          ${situations.map(([title, heading, text, cta, href], index) => `<a class="situation-card" href="${href}"><span class="situation-number">0${index + 1}</span><h3>${title}</h3><p><b>${heading}</b></p><p>${text}</p><span>${cta}</span></a>`).join("")}
        </div>
      </div>
    </section>
    <section class="quiet-band">
      <div class="container split">
        <div><span class="scene-label">How it works</span><h2>Simple steps. No tech lecture.</h2><p class="section-lead">A premium build should feel calm and guided. The first job is to understand the business, not bury you in product names.</p></div>
        <div class="plain-steps">
          ${howItWorks.map(([title, text]) => `<article class="plain-step"><h3>${title}</h3><p>${text}</p></article>`).join("")}
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="section-header"><h2>Built for real business jobs.</h2><p>Use the website as the polished front door. Add the serious parts when customers need to do something.</p></div>
        <div class="example-grid">
          ${examples.map(([title, text]) => `<article class="example-card"><h3>${title}</h3><p>${text}</p></article>`).join("")}
        </div>
      </div>
    </section>
    <section class="quiet-band">
      <div class="container">
        <div class="section-header">
          <h2>Worth knowing before you rely on Facebook, Google, or Shopify alone.</h2>
          <p>Those platforms can all help. Your own website gives Central QLD customers one clear place to understand the business, trust it, and take the next step.</p>
        </div>
        <div class="myth-grid">
          ${myths.map(([title, text]) => `<article class="myth-card"><div><strong>Worth knowing</strong><h3>${title}</h3></div><p>${text}</p></article>`).join("")}
        </div>
      </div>
    </section>
    <section class="cinema-band">
      <div class="container">
        <div class="section-header">
          <h2>Premium means clear advice, not unnecessary complexity.</h2>
          <p>Start with the right level of build. Add more only when it earns its place.</p>
        </div>
        <div class="reassurance-grid">
          ${reassurance.map(([title, text]) => `<article class="reassurance-card"><h3>${title}</h3><p>${text}</p></article>`).join("")}
        </div>
      </div>
    </section>
    ${ctaBand({ title: "Start with a professional first step.", text: "Build a guided website draft, or talk to Steve about what is worth building before you spend more.", primary: "Start my website", secondary: "Ask Steve what fits", primaryHref: builderUrl, secondaryHref: talkUrl })}
  </main>`,
  });
}

function appsPage() {
  const workflowSteps = [
    ["01", "Customer finds a clear path instead of guessing what to do next."],
    ["02", "Your brand collects the details, payment, booking, or request."],
    ["03", "The business gets a cleaner admin view and fewer repeated messages."],
  ];
  return shell({
    active: "/apps",
    title: "Bookings, Orders, and Customer Tools - Penny Wise I.T",
    description: "Premium customer workflows for Australian small businesses: ordering, bookings, field service, delivery, events, clubs, and managed websites.",
    body: `<main>
      <section class="hero apps-hero"><div class="container hero-grid"><div><span class="hero-kicker">Customer tools that feel like your business</span><h1>Turn messy customer moments into smooth owned workflows.</h1><p class="lead">Bookings, orders, requests, payments, reminders, menus, memberships, and admin should not live across Facebook messages, missed calls, and spreadsheets. Build the path customers need, under your brand, only when it clearly helps the business.</p><div class="actions"><a class="btn btn-primary" href="${talkUrl}">Talk through my workflow</a><a class="btn btn-secondary" href="/pricing">See starting points</a></div></div><aside class="workflow-poster" aria-label="How Penny Wise apps help customers"><div class="poster-clip"></div><span class="poster-label">Owned customer path</span><h2>Find it. Choose it. Book it. Come back.</h2><div class="poster-note">The app is not the point. The smoother customer decision is.</div><div class="workflow-steps">${workflowSteps.map(([step, text]) => `<div class="workflow-step"><span>${step}</span><p>${text}</p></div>`).join("")}</div><div class="poster-stamp">Your brand first</div></aside></div></section>
      <section><div class="container"><div class="section-header"><h2>Pick the moment customers get stuck.</h2><p>Each path starts with a real customer decision, then turns it into a branded experience with your name, your domain, and a clearer admin flow behind it.</p></div><div class="story-grid">${appStoriesPremium.map(([name, text, meta, caption, visualLabel, tone]) => `<article class="app-story ${tone}"><div class="story-copy"><div><span class="story-kicker">${caption}</span><h3>${name}</h3><p>${text}</p></div><div class="story-meta">${meta.split(", ").map((item) => `<span>${item}</span>`).join("")}</div></div><div class="story-visual" aria-hidden="true"><span class="story-icon">${visualLabel}</span><span class="story-caption">${caption}</span></div></article>`).join("")}</div></div></section>
      ${ctaBand({ title: "Not sure if this should be an app?", text: "That is exactly the right question. Steve can help decide whether you need a workflow, a simple form, a managed website, or nothing custom yet.", primary: "Ask Steve", secondary: "Compare pricing", primaryHref: talkUrl, secondaryHref: "/pricing" })}
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

async function copyAsset(sourceName, targetPath = `brand/${sourceName}`) {
  const file = join(dist, targetPath);
  await mkdir(dirname(file), { recursive: true });
  await copyFile(join(brandDir, sourceName), file);
}

try {
  await rm(dist, { recursive: true, force: true });
} catch (error) {
  if (error?.code !== "EBUSY") throw error;
  console.warn(`Output folder is busy; updating files in place at ${dist}`);
}
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
await copyAsset("pennywise-it-cover.svg");
await copyAsset("pennywise-it-icon-one-color.svg");
await copyAsset("pennywise-it-icon-small.svg");
await copyAsset("pennywise-it-logo-header.svg");
await copyAsset("pennywise-it-logo-primary.svg");
await copyAsset("pennywise-it-logo-stacked.svg");
await copyAsset("README.md");
await copyAsset("pennywise-it-icon-small.svg", "favicon.svg");
await write("manifest.json", JSON.stringify({
  name: "Penny Wise I.T",
  short_name: "Penny Wise",
  start_url: "/",
  display: "standalone",
  background_color: "#090b10",
  theme_color: "#0b0d12",
  icons: [
    {
      src: "/brand/pennywise-it-icon-small.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any maskable"
    }
  ],
}, null, 2));
await write("sw.js", "self.addEventListener('install', function(event) { self.skipWaiting(); });\nself.addEventListener('activate', function(event) { event.waitUntil(self.clients.claim()); });\n");

console.log(`Built clean showcase site at ${dist}`);
