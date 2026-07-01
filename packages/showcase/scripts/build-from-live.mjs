import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = dirname(scriptDir);
const dist = join(root, "dist");
const brandDir = join(root, "assets", "brand");
const visualsDir = join(root, "assets", "visuals");
const videoDir = join(root, "assets", "video");

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

const proofPoints = [
  ["Website first", "A polished front door that answers the questions people check before they call."],
  ["Workflow ready", "Bookings, orders, forms, reminders, and customer paths can be added when they earn their place."],
  ["Local guidance", "Central QLD advice from someone who will tell you when the bigger build is not worth it yet."],
  ["Own the customer", "Your brand, your domain, your enquiries, and less dependence on noisy platform feeds."],
];

const buildReceipts = [
  ["Owned domain", "A proper web address and one clear place customers can trust."],
  ["Response path", "Calls, forms, bookings, orders, or quotes directed to the right next step."],
  ["Pricing clarity", "Start lean, then add paid systems only when the business case is clear."],
  ["No platform lock-in", "Facebook, Google, and Shopify can help, but they should not own the relationship."],
  ["Launch support", "Plain-English help before and after the first version goes live."],
];

const caseStudies = [
  ["Weekly-menu food business", "Problem", "Customers see old Facebook posts and ask the same menu questions.", "Build a current menu page, update path, photos, Google/Facebook links, and optional pickup ordering."],
  ["Service operator", "Problem", "Jobs arrive through calls, screenshots, and scattered messages.", "Build a proper enquiry path with service areas, quote details, photos, status updates, and follow-up."],
  ["Local group or event", "Problem", "Bookings, payments, guest lists, and updates are spread across spreadsheets.", "Build one branded place for members, sponsors, payments, events, and announcements."],
];

const trustReceipts = [
  ["No platform theatre", "If Facebook, Google, or Shopify is enough for the job, Steve will say so."],
  ["Plain-English scope", "You see what is being built, why it matters, and what can wait."],
  ["Upgrade path", "Start with the website, then add systems when customers or admin pressure proves the need."],
];

const proofLogos = [
  "Food & takeaway",
  "Trades & services",
  "Clubs & events",
  "Local retail",
  "Admin-heavy teams",
  "Central QLD operators",
];

const portfolioPreviews = [
  ["Weekly menu site", "Food business", "Current menu, photos, clear pickup path, Google/Facebook links.", "Menu clarity"],
  ["Quote-ready service site", "Trades & services", "Service areas, enquiry flow, proof, job photos, and follow-up prompts.", "Fewer repeat questions"],
  ["Club and event hub", "Community", "Membership, sponsor visibility, event details, payments, and updates in one place.", "One owned home"],
];

const testimonials = [
  ["The useful part was Steve telling us what not to build yet.", "Local operator feedback"],
  ["It made the business look proper without turning it into a tech project.", "Small business draft review"],
  ["The website answers the same questions we were repeating in messages.", "Customer workflow review"],
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
    .proof-rail {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }
    .proof-tile,
    .receipt-card,
    .case-card {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(246,180,95,.24);
      background:
        radial-gradient(circle at 14% 0%, rgba(255,244,222,.18), transparent 34%),
        linear-gradient(145deg, rgba(255,255,255,.11), rgba(255,255,255,.035)),
        rgba(8,13,20,.68);
      box-shadow:
        0 32px 90px rgba(0,0,0,.30),
        0 1px 0 rgba(255,255,255,.13) inset;
    }
    .proof-tile {
      min-height: 180px;
      padding: 22px;
      border-radius: 26px 18px 30px 20px;
    }
    .proof-tile::before,
    .receipt-card::before,
    .case-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg, transparent 0 30%, rgba(255,255,255,.16) 42%, transparent 55% 100%);
      opacity: .50;
      pointer-events: none;
    }
    .proof-tile strong,
    .receipt-card strong,
    .case-card strong {
      position: relative;
      z-index: 1;
      display: inline-flex;
      width: fit-content;
      margin-bottom: 14px;
      color: var(--copper-2);
      font-size: .76rem;
      font-weight: 950;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .proof-tile p,
    .receipt-card p,
    .case-card p {
      position: relative;
      z-index: 1;
      color: var(--muted);
      margin-bottom: 0;
    }
    .guide-panel {
      display: grid;
      grid-template-columns: minmax(0, .9fr) minmax(300px, .62fr);
      gap: 36px;
      align-items: stretch;
      padding: 34px;
      border: 1px solid rgba(246,180,95,.28);
      border-radius: 42px 24px 48px 28px;
      background:
        radial-gradient(circle at 86% 18%, rgba(67,231,172,.14), transparent 28%),
        linear-gradient(135deg, rgba(255,244,222,.12), rgba(255,255,255,.035)),
        rgba(8,13,20,.70);
      box-shadow: 0 42px 120px rgba(0,0,0,.34), 0 1px 0 rgba(255,255,255,.12) inset;
      overflow: hidden;
    }
    .guide-copy h2 { margin-bottom: 18px; }
    .guide-copy p { color: var(--muted); max-width: 720px; }
    .guide-card {
      position: relative;
      min-height: 360px;
      display: grid;
      align-content: space-between;
      padding: 28px;
      border-radius: 34px 20px 40px 24px;
      color: #121820;
      background:
        linear-gradient(rgba(18,24,32,.055) 1px, transparent 1px),
        linear-gradient(90deg, rgba(18,24,32,.045) 1px, transparent 1px),
        linear-gradient(145deg, #fff4de, #eac48e);
      background-size: 28px 28px, 28px 28px, auto;
      box-shadow: 18px 18px 0 rgba(0,0,0,.30), 0 26px 80px rgba(0,0,0,.26);
      transform: rotate(1.2deg);
      overflow: hidden;
    }
    .guide-card::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -12px;
      width: 120px;
      height: 34px;
      transform: translateX(-50%) rotate(-2deg);
      background: rgba(246,180,95,.78);
      box-shadow: 0 10px 22px rgba(0,0,0,.16);
    }
    .guide-avatar {
      width: 86px;
      height: 86px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: #fff4de;
      background:
        radial-gradient(circle at 35% 28%, rgba(255,255,255,.32), transparent 28%),
        linear-gradient(135deg, #202832, #0f141b);
      box-shadow: 0 0 0 8px rgba(212,135,57,.20), 0 18px 42px rgba(0,0,0,.28);
      font-size: 2.4rem;
      font-weight: 950;
    }
    .guide-card h3 {
      max-width: 280px;
      color: #121820;
      font-size: clamp(2rem, 3.2vw, 3.2rem);
      line-height: .92;
      margin-bottom: 16px;
    }
    .guide-card p { color: rgba(18,24,32,.76); font-weight: 850; margin-bottom: 0; }
    .receipt-grid,
    .case-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }
    .receipt-card,
    .case-card {
      border-radius: 30px 18px 36px 22px;
      padding: 26px;
    }
    .case-card {
      min-height: 330px;
      display: grid;
      align-content: space-between;
    }
    .case-card h3 {
      position: relative;
      z-index: 1;
      font-size: 1.55rem;
      margin-bottom: 16px;
    }
    .case-answer {
      position: relative;
      z-index: 1;
      margin-top: 22px;
      padding: 16px;
      border-radius: 22px 14px 26px 16px;
      color: #121820;
      background: linear-gradient(135deg, #fff4de, #f6b45f);
      box-shadow: 0 18px 46px rgba(0,0,0,.20);
      font-weight: 850;
    }
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
    .route-home {
      --ink: #f7fbf8;
      --muted: #d4e0df;
      --soft: #9fb4b8;
      --line: rgba(247,251,248,.34);
      --copper-2: #f3eee4;
      background: #344f5c;
    }
    .route-home .scene-canvas {
      opacity: .14;
      filter: saturate(.45) contrast(.85);
      mask-image: linear-gradient(90deg, transparent 0 38%, rgba(0,0,0,.2) 48%, #000 72%);
    }
    .route-home .ambient {
      background:
        radial-gradient(circle at 68% 28%, rgba(255,255,255,.08), transparent 24rem),
        linear-gradient(180deg, rgba(52,79,92,.12), rgba(52,79,92,.88));
    }
    .route-home .noise {
      opacity: .055;
      background-size: 68px 68px;
    }
    .route-home .site-header {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      background: transparent;
      border-bottom: 0;
      backdrop-filter: none;
      padding: 20px 22px 0;
    }
    .route-home .site-header.is-scrolled {
      background: transparent;
      border-bottom: 0;
      box-shadow: none;
    }
    .route-home .site-header.is-scrolled .nav-wrap {
      min-height: 68px;
      background: rgba(52,79,92,.82);
      box-shadow: 0 18px 60px rgba(7,18,24,.20);
    }
    .route-home .nav-wrap {
      max-width: min(1368px, calc(100vw - 72px));
      min-height: 82px;
      padding: 0 30px;
      border: 1px solid rgba(247,251,248,.88);
      border-radius: 999px;
      background: rgba(52,79,92,.58);
      box-shadow: none;
      backdrop-filter: blur(14px);
    }
    .route-home .brand {
      padding: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
      filter: brightness(0) invert(1);
    }
    .route-home .brand::after { display: none; }
    .route-home .brand-logo {
      width: clamp(142px, 15vw, 210px);
      filter: none;
    }
    .route-home nav a {
      color: #f7fbf8;
      background: transparent;
      border-color: transparent;
    }
    .route-home nav a:hover,
    .route-home nav a.active {
      color: #f7fbf8;
      background: rgba(247,251,248,.10);
      border-color: rgba(247,251,248,.18);
    }
    .route-home .nav-cta {
      min-width: 222px;
      justify-content: center;
      color: #f7fbf8;
      border: 1px solid rgba(247,251,248,.88);
      background: transparent;
      box-shadow: none;
    }
    .route-home .hero-home {
      min-height: 820px;
      padding-top: 150px;
      padding-bottom: 72px;
      background: #344f5c;
    }
    .route-home .hero-home::before {
      background:
        radial-gradient(circle at 78% 26%, rgba(247,251,248,.08), transparent 28rem),
        linear-gradient(180deg, transparent, rgba(247,251,248,.04));
    }
    .route-home .hero-home::after {
      display: none;
    }
    .route-home .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(420px, .82fr);
      align-items: center;
      gap: clamp(44px, 6vw, 96px);
      max-width: min(1368px, calc(100vw - 72px));
    }
    .route-home .hero-copy {
      min-height: 520px;
      max-width: 830px;
      padding-left: 0;
      display: grid;
      align-content: end;
    }
    .route-home .poster-board {
      display: block;
      position: relative;
      min-height: 0;
      width: 100%;
      padding: 0;
      border: 0;
      border-radius: 42px;
      background: transparent;
      box-shadow: none;
      transform: rotate(2deg);
      overflow: visible;
      isolation: isolate;
    }
    .route-home .poster-board::before {
      content: "";
      position: absolute;
      inset: 8% -4% -5% 7%;
      border-radius: 44px;
      background: rgba(7,18,24,.26);
      filter: blur(18px);
      z-index: -1;
      transform: rotate(-3deg);
    }
    .route-home .poster-board::after {
      content: "";
      position: absolute;
      inset: -14px;
      border: 1px solid rgba(247,251,248,.20);
      border-radius: 52px;
      transform: rotate(-2deg);
      z-index: -2;
    }
    .route-home .poster-board .visual-sheen {
      position: absolute;
      inset: 0;
      border-radius: 42px;
      pointer-events: none;
      background: linear-gradient(115deg, transparent 0 34%, rgba(255,255,255,.24) 46%, transparent 58% 100%);
      mix-blend-mode: soft-light;
      opacity: .55;
      transform: translateX(-24%);
    }
    .route-home .hero-visual-image {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 42px;
      object-fit: cover;
      box-shadow: 0 36px 90px rgba(7,18,24,.32);
    }
    .route-home .hero-visual-caption {
      position: absolute;
      left: -34px;
      bottom: 46px;
      max-width: 270px;
      padding: 18px 20px;
      border: 1px solid rgba(247,251,248,.28);
      border-radius: 26px;
      color: #f7fbf8;
      background: rgba(24,52,62,.78);
      backdrop-filter: blur(14px);
      box-shadow: 0 24px 60px rgba(7,18,24,.26);
      transform: rotate(-2deg);
    }
    .route-home .hero-visual-caption b {
      display: block;
      margin-bottom: 6px;
      font-size: .82rem;
      text-transform: uppercase;
      letter-spacing: .12em;
    }
    .route-home .hero-visual-caption span {
      display: block;
      color: rgba(247,251,248,.76);
      font-size: .92rem;
      line-height: 1.35;
    }
    .route-home .hero-kicker {
      color: #f7fbf8;
      border-color: rgba(247,251,248,.46);
      background: transparent;
      box-shadow: none;
      transform: none;
      margin-bottom: 34px;
    }
    .route-home .hero-kicker::before {
      background: #f7fbf8;
      box-shadow: none;
    }
    .route-home .hero-home h1 {
      max-width: 850px;
      font-size: clamp(4rem, 5.9vw, 6.55rem);
      line-height: .88;
      text-shadow: none;
    }
    .route-home .lead {
      max-width: 760px;
      color: rgba(247,251,248,.82);
      font-size: clamp(1.22rem, 1.8vw, 1.52rem);
      text-shadow: none;
    }
    .route-home .hero-stat-grid {
      max-width: none;
      display: flex;
      gap: 42px;
      margin: 48px 0 0;
      padding-top: 30px;
      border-top: 1px solid rgba(247,251,248,.26);
    }
    .route-home .hero-stat {
      min-width: 180px;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }
    .route-home .hero-stat b {
      color: #f7fbf8;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.65rem;
      font-weight: 400;
    }
    .route-home .hero-stat span {
      color: rgba(247,251,248,.72);
      font-size: .82rem;
    }
    .route-home .wide-proof-image {
      margin: 54px 0 0;
      border-radius: 42px;
      overflow: hidden;
      box-shadow: 0 32px 90px rgba(24,52,62,.16);
    }
    .route-home .wide-proof-image img {
      display: block;
      width: 100%;
      height: auto;
    }
    .logo-strip {
      padding: 34px 22px;
      background: #f7f5ee;
      color: #344f5c;
    }
    .logo-strip .container {
      display: grid;
      grid-template-columns: minmax(180px, .34fr) minmax(0, 1fr);
      gap: 26px;
      align-items: center;
      padding-top: 24px;
      border-top: 1px solid rgba(52,79,92,.25);
    }
    .logo-strip strong {
      font-size: .8rem;
      text-transform: uppercase;
      letter-spacing: .12em;
    }
    .logo-cloud {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 10px;
    }
    .logo-pill {
      display: grid;
      place-items: center;
      min-height: 58px;
      padding: 12px;
      border: 1px solid rgba(52,79,92,.22);
      border-radius: 999px;
      color: rgba(52,79,92,.86);
      font-weight: 900;
      font-size: .78rem;
      text-align: center;
      background: rgba(255,255,255,.42);
    }
    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      margin-top: 34px;
    }
    .portfolio-card {
      position: relative;
      min-height: 420px;
      display: grid;
      align-content: end;
      padding: 24px;
      border-radius: 34px;
      overflow: hidden;
      color: #f7fbf8;
      background:
        linear-gradient(180deg, transparent 0 36%, rgba(17,36,45,.88) 100%),
        url("/visuals/premium-site-stack.svg") center / cover no-repeat;
      box-shadow: 0 30px 90px rgba(24,52,62,.16);
    }
    .portfolio-card:nth-child(2) {
      background:
        linear-gradient(180deg, transparent 0 32%, rgba(17,36,45,.90) 100%),
        url("/visuals/local-proof-board.svg") center / cover no-repeat;
    }
    .portfolio-card:nth-child(3) {
      background:
        linear-gradient(180deg, transparent 0 34%, rgba(17,36,45,.88) 100%),
        url("/visuals/higgsfield-premium-hero.png") center / cover no-repeat;
    }
    .portfolio-card::before {
      content: "";
      position: absolute;
      inset: 14px;
      border: 1px solid rgba(247,251,248,.35);
      border-radius: 26px;
      pointer-events: none;
    }
    .portfolio-card > * { position: relative; z-index: 1; }
    .portfolio-card strong,
    .testimonial-card strong {
      display: inline-flex;
      width: fit-content;
      margin-bottom: 12px;
      font-size: .72rem;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: #f2b45b;
    }
    .portfolio-card h3 {
      max-width: 340px;
      font-size: clamp(1.8rem, 2.7vw, 2.6rem);
      line-height: .96;
      margin-bottom: 12px;
      color: #f7fbf8;
    }
    .portfolio-card p { color: rgba(247,251,248,.78); margin-bottom: 20px; }
    .portfolio-card span:last-child {
      display: inline-flex;
      width: fit-content;
      padding: 9px 13px;
      border-radius: 999px;
      color: #11242d;
      background: #f7fbf8;
      font-weight: 950;
      font-size: .8rem;
    }
    .founder-feature {
      display: grid;
      grid-template-columns: minmax(0, .72fr) minmax(320px, .55fr);
      gap: clamp(28px, 5vw, 72px);
      align-items: center;
    }
    .founder-portrait {
      position: relative;
      min-height: 520px;
      border-radius: 42px;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(52,79,92,.02), rgba(52,79,92,.72)),
        url("/visuals/higgsfield-premium-hero.png") center / cover no-repeat;
      box-shadow: 0 32px 100px rgba(24,52,62,.18);
    }
    .founder-portrait::after {
      content: "Central QLD practical web advice";
      position: absolute;
      left: 28px;
      right: 28px;
      bottom: 28px;
      padding: 18px 20px;
      border: 1px solid rgba(247,251,248,.32);
      border-radius: 24px;
      color: #f7fbf8;
      background: rgba(24,52,62,.70);
      backdrop-filter: blur(14px);
      font-weight: 950;
    }
    .testimonial-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      margin-top: 34px;
    }
    .testimonial-card {
      padding: 28px;
      border: 1px solid rgba(52,79,92,.20);
      border-radius: 30px;
      background: rgba(255,255,255,.44);
    }
    .testimonial-card p {
      font-size: 1.24rem;
      line-height: 1.28;
      color: #344f5c;
    }
    .decision-band {
      padding-top: 72px;
      padding-bottom: 78px;
    }
    .decision-band .situation-grid {
      margin-top: 30px;
    }
    .route-home .decision-band .situation-card {
      background:
        linear-gradient(180deg, rgba(255,255,255,.68), rgba(255,255,255,.34)),
        #f7f5ee;
      box-shadow: 0 22px 70px rgba(24,52,62,.10);
    }
    .case-story {
      display: grid;
      grid-template-columns: minmax(360px, .88fr) minmax(0, 1fr);
      gap: clamp(32px, 5vw, 76px);
      align-items: center;
      margin-top: 34px;
    }
    .case-visual {
      position: relative;
      min-height: 560px;
      border-radius: 46px;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(52,79,92,.04), rgba(52,79,92,.28)),
        url("/visuals/premium-site-stack.svg") center / cover no-repeat;
      box-shadow: 0 36px 110px rgba(24,52,62,.18);
    }
    .case-visual::after {
      content: "Decision before build";
      position: absolute;
      left: 28px;
      right: 28px;
      bottom: 28px;
      padding: 18px 20px;
      border-radius: 24px;
      color: #f7fbf8;
      background: rgba(24,52,62,.78);
      border: 1px solid rgba(247,251,248,.28);
      backdrop-filter: blur(12px);
      font-weight: 950;
    }
    .case-copy h2 {
      margin-bottom: 18px;
      font-size: clamp(2.6rem, 5vw, 5rem);
      line-height: .92;
    }
    .case-copy p {
      max-width: 760px;
      color: rgba(52,79,92,.76);
    }
    .case-points {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-top: 28px;
    }
    .case-point {
      min-height: 156px;
      padding: 20px;
      border: 1px solid rgba(52,79,92,.22);
      border-radius: 26px;
      background: rgba(255,255,255,.48);
    }
    .case-point strong,
    .receipt-strip-card strong {
      display: block;
      margin-bottom: 10px;
      color: #344f5c;
      font-size: .72rem;
      text-transform: uppercase;
      letter-spacing: .11em;
    }
    .case-point p,
    .receipt-strip-card p {
      margin-bottom: 0;
      color: rgba(52,79,92,.76);
    }
    .receipt-strip-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 12px;
      margin-top: 32px;
    }
    .receipt-strip-card {
      min-height: 168px;
      padding: 20px;
      border-radius: 28px;
      border: 1px solid rgba(52,79,92,.20);
      background: linear-gradient(180deg, rgba(255,255,255,.58), rgba(255,255,255,.25));
      box-shadow: 0 18px 50px rgba(24,52,62,.08);
    }
    .advice-feature {
      display: grid;
      grid-template-columns: minmax(0, .92fr) minmax(340px, .62fr);
      gap: clamp(32px, 5vw, 76px);
      align-items: center;
    }
    .advice-card {
      min-height: 520px;
      border-radius: 48px;
      background:
        linear-gradient(180deg, rgba(52,79,92,.02), rgba(52,79,92,.68)),
        url("/visuals/local-proof-board.svg") center / cover no-repeat;
      box-shadow: 0 36px 100px rgba(7,18,24,.24);
      position: relative;
      overflow: hidden;
    }
    .advice-card::after {
      content: "Bring the Facebook advice, Shopify pressure, Google listing myths, and website doubts.";
      position: absolute;
      left: 28px;
      right: 28px;
      bottom: 28px;
      padding: 20px;
      border-radius: 26px;
      color: #f7fbf8;
      background: rgba(24,52,62,.80);
      border: 1px solid rgba(247,251,248,.26);
      backdrop-filter: blur(14px);
      font-weight: 850;
    }
    .home-mobile-reassurance {
      display: none;
    }
    .route-home .quiet-band .myth-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      margin-top: 34px;
    }
    .route-home .quiet-band .myth-card {
      min-height: 280px;
      grid-template-columns: 1fr;
      align-content: space-between;
      padding: 28px;
      border: 1px solid rgba(247,251,248,.18);
      background:
        radial-gradient(circle at 100% 0%, rgba(247,251,248,.10), transparent 28%),
        linear-gradient(145deg, rgba(255,255,255,.095), rgba(255,255,255,.035));
      box-shadow: 0 28px 90px rgba(7,18,24,.16);
    }
    .route-home .quiet-band .myth-card:first-child {
      grid-column: span 2;
      min-height: 320px;
      grid-template-columns: minmax(0, .58fr) minmax(0, 1fr);
      align-items: end;
    }
    .route-home .quiet-band .myth-card h3 {
      max-width: 560px;
      font-size: clamp(1.65rem, 3.2vw, 3.2rem);
      line-height: .95;
      color: #f7fbf8;
    }
    .route-home .quiet-band .myth-card p {
      color: rgba(247,251,248,.76);
      font-size: 1.02rem;
      line-height: 1.55;
    }
    .route-home main > .cta-band {
      padding: 88px 22px;
      background: #f7f5ee;
      color: #344f5c;
      border-top: 1px solid rgba(52,79,92,.18);
      border-bottom: 0;
      box-shadow: none;
    }
    .route-home main > .cta-band .cta-inner {
      padding-top: 34px;
      border-top: 1px solid rgba(52,79,92,.24);
    }
    .route-home main > .cta-band h2 {
      max-width: 760px;
      font-size: clamp(2.6rem, 6.2vw, 6.2rem);
      line-height: .88;
      color: #344f5c;
    }
    .route-home main > .cta-band p {
      max-width: 680px;
      color: rgba(52,79,92,.72);
      font-size: 1.1rem;
    }
    .route-home main > .cta-band .btn-primary {
      color: #f7fbf8;
      background: #344f5c;
    }
    .route-home main > .cta-band .btn-secondary {
      color: #344f5c;
      border-color: rgba(52,79,92,.30);
    }
    .route-home .hero-home .actions { margin-top: 28px; }
    .route-home .btn {
      border-color: rgba(247,251,248,.70);
      background: transparent;
      box-shadow: none;
      color: #f7fbf8;
    }
    .route-home .btn-primary {
      color: #344f5c;
      background: #f7fbf8;
      box-shadow: none;
    }
    .route-home .clarity-note {
      max-width: 760px;
      margin-top: 28px;
      border: 1px solid rgba(247,251,248,.34);
      border-radius: 28px;
      background: transparent;
      box-shadow: none;
      transform: none;
    }
    .route-home main > section:not(.hero-home) {
      background: #f7f5ee;
      color: #344f5c;
      border-top: 0;
    }
    .route-home main > section.quiet-band,
    .route-home main > section.cinema-band {
      background: #344f5c;
      color: #f7fbf8;
    }
    .route-home main > section:not(.hero-home) .section-header p,
    .route-home main > section:not(.hero-home) .offer-head p,
    .route-home main > section:not(.hero-home) .section-lead,
    .route-home main > section:not(.hero-home) .lead {
      color: rgba(52,79,92,.76);
    }
    .route-home main > section.quiet-band .section-header p,
    .route-home main > section.quiet-band .offer-head p,
    .route-home main > section.quiet-band .section-lead,
    .route-home main > section.cinema-band .section-header p {
      color: rgba(247,251,248,.76);
    }
    .route-home .proof-tile,
    .route-home .situation-card,
    .route-home .plain-step,
    .route-home .reassurance-card,
    .route-home .example-card,
    .route-home .myth-card,
    .route-home .receipt-card,
    .route-home .case-card {
      border-radius: 26px;
      border: 1px solid rgba(52,79,92,.25);
      background: transparent;
      box-shadow: none;
      color: inherit;
    }
    .route-home .proof-tile::before,
    .route-home .situation-card::before,
    .route-home .plain-step::after,
    .route-home .reassurance-card::before,
    .route-home .example-card::before,
    .route-home .myth-card::before,
    .route-home .receipt-card::before,
    .route-home .case-card::before {
      display: none;
    }
    .route-home .proof-tile strong,
    .route-home .receipt-card strong,
    .route-home .case-card strong,
    .route-home .myth-card strong,
    .route-home .situation-card span:last-child {
      color: currentColor;
    }
    .route-home .proof-tile p,
    .route-home .receipt-card p,
    .route-home .case-card p,
    .route-home .myth-card p,
    .route-home .situation-card p,
    .route-home .plain-step p,
    .route-home .reassurance-card p,
    .route-home .example-card p {
      color: rgba(52,79,92,.76);
    }
    .route-home .quiet-band .receipt-card p,
    .route-home .quiet-band .plain-step p,
    .route-home .cinema-band .reassurance-card p {
      color: rgba(247,251,248,.72);
    }
    .route-home .guide-panel {
      border: 1px solid rgba(247,251,248,.36);
      border-radius: 34px;
      background: transparent;
      box-shadow: none;
    }
    .route-home .guide-card {
      color: #344f5c;
      background: #f7f5ee;
      box-shadow: none;
      transform: none;
      border-radius: 28px;
    }
    .route-home .case-answer {
      color: #f7fbf8;
      background: #344f5c;
      box-shadow: none;
    }
    .route-home .cta-band {
      background: #344f5c;
      color: #f7fbf8;
      border-top: 1px solid rgba(247,251,248,.20);
      border-bottom: 1px solid rgba(247,251,248,.20);
      box-shadow: none;
    }
    @media (max-width: 880px) {
      .nav-wrap { align-items: flex-start; flex-direction: column; padding-top: 16px; padding-bottom: 16px; gap: 12px; }
      .brand-logo { width: clamp(172px, 52vw, 230px); }
      nav { justify-content: flex-start; }
      .nav-cta, .nav-builder { margin-left: 0; }
      .hero { padding-top: 64px; }
      .hero-grid, .split, .guide-panel, .path-strip, .offer-grid, .situation-grid, .proof-rail, .receipt-grid, .case-grid, .plain-steps, .reassurance-grid, .example-grid, .myth-card, .decision-grid, .cinema-inner, .list, .story-grid, .faq-grid, .pricing-grid, .cta-inner { grid-template-columns: 1fr; }
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
      .route-home .site-header {
        position: absolute;
        padding: 16px 18px 0;
      }
      .route-home .nav-wrap {
        width: 100%;
        max-width: none;
        min-height: 0;
        padding: 16px 18px;
        border-radius: 30px;
        background: rgba(52,79,92,.72);
        align-items: flex-start;
        gap: 14px;
      }
      .route-home nav {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        width: 100%;
        gap: 8px;
      }
      .route-home nav a {
        justify-content: center;
        border: 1px solid rgba(247,251,248,.18);
        border-radius: 999px;
      }
      .route-home .nav-cta {
        grid-column: 1 / -1;
        width: 100%;
        min-width: 0;
      }
      .route-home .hero-home {
        padding-top: 250px;
        min-height: auto;
      }
      .route-home .hero-copy {
        display: block;
        min-height: auto;
      }
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
      .route-home .poster-board {
        display: block;
        margin-top: 44px;
        transform: none;
      }
      .route-home .poster-board::before,
      .route-home .poster-board::after {
        display: none;
      }
      .route-home .hero-visual-image {
        border-radius: 26px;
      }
      .route-home .hero-visual-caption {
        position: relative;
        left: auto;
        bottom: auto;
        max-width: none;
        margin-top: 14px;
        transform: none;
      }
      .route-home .site-header { padding: 14px 14px 0; }
      .route-home .nav-wrap {
        min-height: 64px;
        padding: 10px 12px;
        border-radius: 999px;
        flex-direction: row;
        align-items: center;
        gap: 10px;
      }
      .route-home .brand {
        filter: brightness(0) invert(1);
      }
      .route-home .brand-logo {
        width: min(48vw, 162px);
      }
      .route-home nav {
        display: flex;
        width: auto;
        margin-left: auto;
        gap: 0;
      }
      .route-home nav a {
        padding: 9px 12px;
        font-size: .76rem;
      }
      .route-home nav a:not(.nav-cta) {
        display: none;
      }
      .route-home .nav-cta {
        width: auto;
        min-width: 0;
        white-space: nowrap;
      }
      .route-home .hero-home {
        padding-top: 112px;
        padding-bottom: 48px;
      }
      .route-home .hero-home h1 {
        font-size: clamp(2.25rem, 10.4vw, 2.95rem);
        line-height: .96;
        letter-spacing: 0;
        text-shadow: none;
      }
      .route-home .lead {
        font-size: 1.04rem;
        line-height: 1.45;
      }
      .route-home .hero-home .actions {
        margin-top: 24px;
      }
      .route-home .hero-kicker {
        margin-bottom: 24px;
        padding: 9px 13px;
        font-size: .76rem;
      }
      .route-home .clarity-note {
        display: none;
      }
      .home-mobile-reassurance {
        display: block;
        margin-top: 14px;
        color: rgba(247,251,248,.82);
        font-size: .92rem;
        line-height: 1.42;
      }
      .logo-strip .container,
      .logo-cloud,
      .portfolio-grid,
      .founder-feature,
      .testimonial-grid,
      .case-story,
      .case-points,
      .receipt-strip-grid,
      .advice-feature,
      .route-home .quiet-band .myth-grid,
      .route-home .quiet-band .myth-card:first-child,
      .route-home main > .cta-band .cta-inner {
        grid-template-columns: 1fr;
      }
      .logo-cloud {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .portfolio-card,
      .founder-portrait,
      .case-visual,
      .advice-card {
        min-height: 330px;
      }
      .decision-band {
        padding-top: 48px;
        padding-bottom: 50px;
      }
      .receipt-strip-grid {
        gap: 10px;
      }
      .receipt-strip-card,
      .case-point {
        min-height: auto;
      }
      .route-home .scene-canvas {
        display: none;
      }
      .route-home .quiet-band .myth-card,
      .route-home .quiet-band .myth-card:first-child {
        grid-column: auto;
        min-height: auto;
      }
      .route-home main > .cta-band {
        padding: 62px 18px;
      }
      .route-home main > .cta-band h2 {
        font-size: clamp(2.3rem, 12vw, 3.5rem);
      }
      .poster-board { display: none; }
      .route-home .poster-board { display: block; }
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
      .guide-panel, .guide-card, .proof-tile, .receipt-card, .case-card { padding: 22px; }
      .guide-card { min-height: 300px; transform: none; }
      .story-visual { min-height: 160px; }
      .scene-canvas { opacity: .34; }
    }
    /* Flagship home redesign pass: premium, image-led, motion-ready. */
    .route-home {
      --home-ink: #0c1418;
      --home-teal: #2f505b;
      --home-teal-deep: #172b31;
      --home-cream: #fbf4e5;
      --home-paper: #fffaf0;
      --home-copper: #e5973c;
      --home-red: #d64136;
      --home-line: rgba(251,244,229,.24);
      background: var(--home-teal);
    }
    .route-home .site-header {
      position: fixed;
      padding: 22px clamp(14px, 3vw, 38px) 0;
      z-index: 40;
    }
    .route-home .nav-wrap {
      max-width: min(1500px, calc(100vw - 48px));
      min-height: 86px;
      padding: 10px 18px 10px 12px;
      border: 1px solid rgba(255,250,240,.68);
      border-radius: 999px;
      background:
        linear-gradient(120deg, rgba(255,255,255,.16), rgba(255,255,255,.05)),
        rgba(35,68,77,.72);
      box-shadow: 0 24px 70px rgba(4,13,16,.26);
      backdrop-filter: blur(18px) saturate(1.2);
    }
    .route-home .site-header.is-scrolled .nav-wrap {
      min-height: 72px;
      background:
        linear-gradient(120deg, rgba(255,255,255,.15), rgba(255,255,255,.04)),
        rgba(23,43,49,.86);
      box-shadow: 0 20px 60px rgba(4,13,16,.34);
    }
    .route-home .brand {
      padding: 7px 18px 7px 8px;
      border: 1px solid rgba(255,236,198,.72);
      border-radius: 999px;
      background:
        linear-gradient(110deg, rgba(255,250,240,.98), rgba(244,217,174,.90));
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.82),
        0 18px 42px rgba(3,12,15,.18);
      filter: none;
    }
    .route-home .brand-logo {
      width: clamp(176px, 17vw, 252px);
      filter: none;
    }
    .route-home nav {
      gap: 8px;
    }
    .route-home nav a {
      min-height: 46px;
      padding: 11px 15px;
      border: 1px solid transparent;
      border-radius: 999px;
      color: rgba(255,250,240,.84);
      font-size: .92rem;
      font-weight: 850;
      transition: transform .2s ease, border-color .2s ease, background .2s ease, color .2s ease;
    }
    .route-home nav a:hover,
    .route-home nav a.active {
      color: #fffaf0;
      border-color: rgba(255,250,240,.22);
      background: rgba(255,250,240,.11);
      transform: translateY(-1px);
    }
    .route-home .nav-cta {
      min-width: 176px;
      margin-left: 10px;
      justify-content: center;
      color: #101820;
      border-color: rgba(255,255,255,.35);
      background:
        linear-gradient(180deg, #f3b25d, #d98327);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.42),
        0 18px 42px rgba(216,131,39,.25);
    }
    .route-home .hero-home {
      min-height: 940px;
      padding-top: clamp(138px, 12vw, 178px);
      padding-bottom: 84px;
      overflow: hidden;
      background:
        linear-gradient(90deg, rgba(14,22,25,.16), rgba(14,22,25,0) 42%, rgba(14,22,25,.10)),
        repeating-linear-gradient(90deg, rgba(255,250,240,.035) 0 1px, transparent 1px 72px),
        repeating-linear-gradient(0deg, rgba(255,250,240,.03) 0 1px, transparent 1px 72px),
        linear-gradient(145deg, #355865 0%, #2f505b 40%, #183238 100%);
      color: #fffaf0;
    }
    .route-home .hero-home::before {
      background:
        linear-gradient(180deg, rgba(255,250,240,.08), rgba(255,250,240,0) 28%),
        linear-gradient(0deg, rgba(12,20,24,.72), rgba(12,20,24,0) 42%);
      opacity: 1;
    }
    .route-home .hero-home::after {
      display: block;
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      height: 160px;
      background: linear-gradient(180deg, rgba(251,244,229,0), #fbf4e5 82%);
      pointer-events: none;
    }
    .route-home .hero-grid {
      grid-template-columns: minmax(0, .96fr) minmax(420px, .82fr);
      align-items: center;
      gap: clamp(36px, 6vw, 96px);
      max-width: min(1500px, calc(100vw - 72px));
      position: relative;
      z-index: 2;
    }
    .route-home .hero-copy {
      max-width: 860px;
      min-height: 610px;
      align-content: center;
    }
    .route-home .hero-kicker {
      margin-bottom: 26px;
      padding: 12px 17px;
      color: rgba(255,250,240,.92);
      border-color: rgba(255,250,240,.48);
      background: rgba(255,250,240,.06);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.14);
    }
    .route-home .hero-kicker::before {
      background: #50dfa8;
      box-shadow: 0 0 18px rgba(80,223,168,.62);
    }
    .route-home .hero-home h1 {
      max-width: 920px;
      font-size: clamp(4.9rem, 7.4vw, 8.3rem);
      line-height: .82;
      letter-spacing: 0;
      color: #fffaf0;
      text-shadow: 0 14px 0 rgba(0,0,0,.18);
    }
    .route-home .lead {
      max-width: 760px;
      margin-top: 30px;
      color: rgba(255,250,240,.80);
      font-size: clamp(1.18rem, 1.6vw, 1.42rem);
      line-height: 1.48;
    }
    .route-home .hero-home .actions {
      margin-top: 34px;
      gap: 12px;
    }
    .route-home .btn {
      min-height: 58px;
      border-radius: 999px;
      color: #fffaf0;
      border-color: rgba(255,250,240,.52);
      background: rgba(255,250,240,.07);
      backdrop-filter: blur(10px);
    }
    .route-home .btn-primary {
      color: #101820;
      border-color: rgba(255,255,255,.36);
      background: linear-gradient(180deg, #f6ba6c, #da8529);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.45),
        0 22px 52px rgba(216,131,39,.26);
    }
    .route-home .hero-stat-grid {
      margin-top: 44px;
      padding-top: 26px;
      gap: clamp(18px, 3vw, 42px);
      border-top-color: rgba(255,250,240,.25);
    }
    .route-home .hero-stat b {
      color: #fffaf0;
      font-size: clamp(1.35rem, 1.8vw, 1.8rem);
    }
    .route-home .hero-stat span {
      color: rgba(255,250,240,.70);
    }
    .route-home .clarity-note {
      max-width: 720px;
      margin-top: 24px;
      border-color: rgba(255,250,240,.24);
      background: rgba(255,250,240,.075);
      color: #fffaf0;
    }
    .hero-wordline {
      display: flex;
      flex-wrap: wrap;
      gap: 9px;
      margin-top: 22px;
    }
    .hero-wordline span {
      display: inline-flex;
      min-height: 36px;
      align-items: center;
      padding: 8px 12px;
      border: 1px solid rgba(255,250,240,.22);
      border-radius: 999px;
      color: rgba(255,250,240,.82);
      background: rgba(255,250,240,.055);
      font-size: .82rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .route-home .poster-board {
      min-height: 650px;
      border-radius: 48px;
      transform: rotate(1.6deg);
    }
    .hero-showcase {
      position: relative;
      min-height: 650px;
      perspective: 1200px;
    }
    .hero-showcase::before {
      content: "";
      position: absolute;
      inset: 7% -2% 5% 8%;
      border-radius: 50px;
      background: rgba(5,15,18,.38);
      filter: blur(20px);
      transform: rotate(-4deg);
      z-index: -2;
    }
    .route-home .hero-visual-image {
      position: absolute;
      inset: 4% 2% 8% 2%;
      width: 92%;
      height: 86%;
      object-fit: cover;
      border: 1px solid rgba(255,250,240,.42);
      border-radius: 46px;
      box-shadow:
        0 42px 110px rgba(3,12,15,.36),
        inset 0 1px 0 rgba(255,255,255,.28);
    }
    .hero-device,
    .hero-mini-card {
      position: absolute;
      border: 1px solid rgba(255,250,240,.40);
      background:
        linear-gradient(145deg, rgba(255,250,240,.92), rgba(235,219,190,.78));
      color: #101820;
      box-shadow: 0 28px 70px rgba(4,13,16,.25);
      backdrop-filter: blur(10px);
    }
    .hero-device {
      right: -3%;
      bottom: 11%;
      width: min(260px, 40%);
      min-height: 370px;
      padding: 17px;
      border-radius: 34px;
      transform: rotate(-4deg);
    }
    .hero-device::before {
      content: "";
      display: block;
      width: 42%;
      height: 6px;
      margin: 0 auto 16px;
      border-radius: 999px;
      background: rgba(16,24,32,.25);
    }
    .device-screen {
      min-height: 295px;
      padding: 18px;
      border-radius: 24px;
      background:
        linear-gradient(180deg, rgba(47,80,91,.95), rgba(16,24,32,.96));
      color: #fffaf0;
      display: grid;
      align-content: space-between;
      gap: 14px;
    }
    .device-screen strong {
      font-size: .74rem;
      text-transform: uppercase;
      letter-spacing: .11em;
      color: #f6ba6c;
    }
    .device-screen b {
      display: block;
      font-size: 1.45rem;
      line-height: .96;
      color: #fffaf0;
    }
    .screen-lines span {
      display: block;
      height: 10px;
      margin-top: 10px;
      border-radius: 999px;
      background: rgba(255,250,240,.18);
    }
    .screen-lines span:nth-child(2) { width: 70%; }
    .screen-lines span:nth-child(3) { width: 46%; }
    .screen-button {
      display: inline-flex;
      width: fit-content;
      padding: 10px 13px;
      border-radius: 999px;
      color: #101820;
      background: #f6ba6c;
      font-weight: 950;
      font-size: .76rem;
    }
    .hero-mini-card {
      left: -6%;
      top: 15%;
      width: min(250px, 44%);
      padding: 18px;
      border-radius: 26px;
      transform: rotate(-6deg);
    }
    .hero-mini-card b {
      display: block;
      margin-bottom: 8px;
      font-size: 1.3rem;
      line-height: 1;
    }
    .hero-mini-card span,
    .hero-mini-card p {
      color: rgba(16,24,32,.66);
      font-size: .88rem;
      line-height: 1.35;
    }
    .hero-mini-card p { margin: 0; }
    .hero-mini-card.alt {
      left: auto;
      right: 8%;
      top: 0;
      width: min(280px, 46%);
      transform: rotate(3deg);
      background:
        linear-gradient(145deg, rgba(217,65,54,.95), rgba(188,52,42,.92));
      color: #fffaf0;
    }
    .hero-mini-card.alt span,
    .hero-mini-card.alt p {
      color: rgba(255,250,240,.82);
    }
    .route-home .hero-visual-caption {
      left: 4%;
      bottom: 5%;
      max-width: 318px;
      padding: 20px 22px;
      border-radius: 28px;
      color: #fffaf0;
      background: rgba(16,24,32,.78);
      border-color: rgba(255,250,240,.28);
      box-shadow: 0 28px 70px rgba(4,13,16,.30);
    }
    .logo-strip {
      position: relative;
      z-index: 3;
      padding: 28px 0;
      overflow: hidden;
      background: #fbf4e5;
    }
    .logo-strip .container {
      max-width: min(1500px, calc(100vw - 72px));
      grid-template-columns: minmax(200px, .26fr) minmax(0, 1fr);
      gap: 26px;
      border-top: 1px solid rgba(47,80,91,.22);
      border-bottom: 1px solid rgba(47,80,91,.16);
      padding: 20px 0;
    }
    .logo-strip strong {
      color: #172b31;
      letter-spacing: .13em;
    }
    .logo-cloud {
      display: flex;
      gap: 12px;
      overflow: hidden;
      mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
    }
    .logo-track {
      display: flex;
      min-width: max-content;
      gap: 12px;
      animation: logo-drift 32s linear infinite;
    }
    @keyframes logo-drift {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    .logo-pill {
      min-width: 190px;
      min-height: 58px;
      border-color: rgba(47,80,91,.22);
      color: #172b31;
      background: rgba(255,255,255,.55);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.74);
    }
    .route-home main > section:not(.hero-home) {
      background: #fbf4e5;
      color: #172b31;
    }
    .route-home .premium-examples {
      padding-top: 96px;
      background:
        linear-gradient(180deg, #fbf4e5, #fffaf0);
    }
    .route-home .portfolio-grid {
      gap: 22px;
    }
    .route-home .portfolio-card {
      min-height: 520px;
      border-radius: 42px;
      box-shadow: 0 34px 90px rgba(23,43,49,.18);
    }
    .route-home .portfolio-card h3 {
      font-size: clamp(2rem, 3.5vw, 3.35rem);
      text-shadow: 0 8px 22px rgba(0,0,0,.28);
    }
    .route-home .systems-showcase {
      background:
        repeating-linear-gradient(90deg, rgba(255,250,240,.028) 0 1px, transparent 1px 78px),
        linear-gradient(145deg, #172b31, #2f505b 72%);
      color: #fffaf0;
    }
    .systems-layout {
      display: grid;
      grid-template-columns: minmax(0, .8fr) minmax(420px, .84fr);
      align-items: center;
      gap: clamp(34px, 6vw, 84px);
    }
    .systems-layout h2 {
      color: #fffaf0;
      font-size: clamp(3rem, 6.6vw, 7rem);
      line-height: .86;
    }
    .systems-layout .section-lead {
      color: rgba(255,250,240,.76) !important;
      max-width: 700px;
    }
    .system-panel {
      position: relative;
      min-height: 560px;
      border-radius: 48px;
      border: 1px solid rgba(255,250,240,.24);
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(16,24,32,.08), rgba(16,24,32,.72)),
        url("/visuals/higgsfield-premium-hero.png") center / cover no-repeat;
      box-shadow: 0 42px 120px rgba(4,13,16,.34);
    }
    .system-panel::after {
      content: "Book it. Order it. Quote it. Follow it up.";
      position: absolute;
      left: 28px;
      right: 28px;
      bottom: 28px;
      padding: 22px;
      border: 1px solid rgba(255,250,240,.25);
      border-radius: 28px;
      color: #fffaf0;
      background: rgba(16,24,32,.74);
      backdrop-filter: blur(14px);
      font-weight: 950;
      font-size: clamp(1.5rem, 2.3vw, 2.5rem);
      line-height: .98;
    }
    .system-list {
      display: grid;
      gap: 12px;
      margin-top: 28px;
    }
    .system-list a {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 16px;
      align-items: center;
      padding: 18px 20px;
      border: 1px solid rgba(255,250,240,.22);
      border-radius: 24px;
      color: #fffaf0;
      background: rgba(255,250,240,.06);
      text-decoration: none;
      transition: transform .2s ease, background .2s ease, border-color .2s ease;
    }
    .system-list a:hover {
      transform: translateX(6px);
      border-color: rgba(246,186,108,.60);
      background: rgba(255,250,240,.11);
    }
    .system-list b {
      display: block;
      margin-bottom: 4px;
      font-size: 1.12rem;
    }
    .system-list span {
      color: rgba(255,250,240,.68);
      font-size: .94rem;
      line-height: 1.38;
    }
    .system-list i {
      color: #f6ba6c;
      font-style: normal;
      font-weight: 950;
    }
    .route-home .case-story,
    .route-home .advice-feature {
      max-width: min(1500px, calc(100vw - 72px));
    }
    .route-home .case-visual,
    .route-home .advice-card,
    .route-home .wide-proof-image {
      border: 1px solid rgba(47,80,91,.16);
      box-shadow: 0 36px 100px rgba(23,43,49,.17);
    }
    .route-home .quiet-band {
      background:
        repeating-linear-gradient(90deg, rgba(255,250,240,.028) 0 1px, transparent 1px 80px),
        linear-gradient(145deg, #14252b, #2f505b);
      color: #fffaf0;
    }
    .route-home .quiet-band .testimonial-card {
      border-color: rgba(255,250,240,.22);
      background: rgba(255,250,240,.08);
      color: #fffaf0;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
    }
    .route-home .quiet-band .testimonial-card p {
      color: rgba(255,250,240,.88);
    }
    .route-home .quiet-band .testimonial-card strong {
      color: #f6ba6c;
    }
    .route-home main > .cta-band {
      background:
        linear-gradient(180deg, #fffaf0, #fbf4e5);
      color: #172b31;
    }
    @media (max-width: 980px) {
      .route-home .site-header {
        padding: 14px 14px 0;
      }
      .route-home .nav-wrap {
        max-width: none;
        min-height: 64px;
        padding: 9px 10px;
        border-radius: 999px;
      }
      .route-home .brand {
        padding: 5px 9px 5px 5px;
      }
      .route-home .brand-logo {
        width: min(52vw, 180px);
      }
      .route-home nav a:not(.nav-cta) {
        display: none;
      }
      .route-home .nav-cta {
        min-width: 0;
        min-height: 42px;
        margin-left: 0;
        padding: 9px 14px;
        font-size: .82rem;
        white-space: nowrap;
      }
      .route-home .hero-home {
        min-height: auto;
        padding-top: 112px;
        padding-bottom: 56px;
      }
      .route-home .hero-grid,
      .systems-layout {
        display: grid;
        grid-template-columns: 1fr;
        max-width: min(100%, calc(100vw - 32px));
        gap: 32px;
      }
      .route-home .hero-copy {
        min-height: auto;
      }
      .route-home .hero-home h1 {
        max-width: 100%;
        font-size: clamp(3.3rem, 15vw, 5.1rem);
        line-height: .86;
        text-shadow: 0 8px 0 rgba(0,0,0,.14);
      }
      .route-home .lead {
        margin-top: 22px;
        font-size: 1.05rem;
      }
      .route-home .hero-stat-grid {
        display: none;
      }
      .route-home .hero-wordline {
        gap: 7px;
      }
      .route-home .poster-board {
        min-height: 430px;
        margin-top: 12px;
        transform: none;
      }
      .hero-showcase {
        min-height: 430px;
      }
      .route-home .hero-visual-image {
        inset: 0;
        width: 100%;
        height: 100%;
        border-radius: 32px;
      }
      .hero-mini-card {
        left: 4%;
        top: 7%;
        width: min(220px, 58%);
        padding: 14px;
        border-radius: 22px;
      }
      .hero-mini-card.alt {
        right: 4%;
        top: 39%;
        width: min(230px, 58%);
      }
      .hero-device {
        right: 5%;
        bottom: -16px;
        width: min(210px, 54%);
        min-height: 255px;
        padding: 12px;
        border-radius: 26px;
      }
      .device-screen {
        min-height: 202px;
        padding: 14px;
        border-radius: 19px;
      }
      .route-home .hero-visual-caption {
        position: relative;
        left: auto;
        bottom: auto;
        max-width: none;
        margin-top: 14px;
        transform: none;
      }
      .logo-strip .container {
        max-width: min(100%, calc(100vw - 32px));
        grid-template-columns: 1fr;
        gap: 14px;
      }
      .portfolio-grid,
      .testimonial-grid,
      .case-points,
      .receipt-strip-grid {
        grid-template-columns: 1fr;
      }
      .route-home .portfolio-card,
      .system-panel,
      .route-home .case-visual,
      .route-home .advice-card,
      .route-home .founder-portrait {
        min-height: 380px;
        border-radius: 32px;
      }
      .case-story,
      .advice-feature {
        grid-template-columns: 1fr;
        max-width: min(100%, calc(100vw - 32px));
      }
      .systems-layout h2,
      .route-home main > .cta-band h2 {
        font-size: clamp(2.65rem, 13vw, 4.4rem);
      }
    }
    @media (max-width: 560px) {
      .route-home .nav-wrap {
        gap: 8px;
      }
      .route-home .brand-logo {
        width: min(47vw, 162px);
      }
      .route-home .nav-cta {
        padding: 8px 12px;
        font-size: .78rem;
      }
      .route-home .hero-home {
        padding-top: 102px;
      }
      .route-home .hero-home h1 {
        font-size: clamp(2.95rem, 14vw, 4.1rem);
      }
      .route-home .hero-wordline span {
        font-size: .68rem;
        min-height: 32px;
      }
      .route-home .hero-home .actions {
        grid-template-columns: 1fr;
        width: 100%;
      }
      .route-home .btn {
        width: 100%;
      }
      .route-home .poster-board,
      .hero-showcase {
        min-height: 390px;
      }
      .hero-mini-card {
        width: 58%;
      }
      .hero-mini-card.alt {
        width: 60%;
        top: 36%;
      }
      .hero-device {
        width: 54%;
      }
      .device-screen b {
        font-size: 1.08rem;
      }
      .screen-lines span:nth-child(3) {
        display: none;
      }
      .route-home .portfolio-card,
      .system-panel,
      .route-home .case-visual,
      .route-home .advice-card {
        min-height: 330px;
      }
      .system-list a {
        grid-template-columns: 1fr;
      }
      .system-list i {
        display: none;
      }
    }
    .route-home .hero-home {
      min-height: 820px;
      padding-top: clamp(118px, 10vw, 150px);
      padding-bottom: 54px;
    }
    .route-home .hero-copy {
      min-height: 520px;
    }
    .route-home .hero-home h1 {
      font-size: clamp(4.25rem, 6.2vw, 7rem);
      line-height: .84;
    }
    .route-home .poster-board,
    .hero-showcase {
      min-height: 565px;
    }
    .hero-device {
      min-height: 330px;
    }
    .device-screen {
      min-height: 255px;
    }
    @media (max-width: 980px) {
      .route-home .hero-home {
        padding-top: 100px;
        padding-bottom: 42px;
      }
      .route-home .hero-home h1 {
        font-size: clamp(3rem, 12.8vw, 4.55rem);
        line-height: .88;
      }
      .route-home .poster-board,
      .hero-showcase {
        min-height: 350px;
      }
      .route-home .hero-wordline {
        display: none;
      }
      .home-mobile-reassurance {
        display: none;
      }
    }
    @media (max-width: 560px) {
      .route-home .hero-home {
        padding-top: 94px;
        padding-bottom: 36px;
      }
      .route-home .hero-home h1 {
        font-size: clamp(2.55rem, 11.4vw, 3.35rem);
        line-height: .91;
      }
      .route-home .lead {
        margin-top: 18px;
        font-size: .98rem;
        line-height: 1.4;
      }
      .route-home .hero-home .actions {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 10px;
        margin-top: 22px;
      }
      .route-home .btn {
        flex: 1 1 0;
        width: auto;
        min-width: 0;
        min-height: 50px;
        padding: 12px 10px;
        font-size: .84rem;
      }
      .route-home .poster-board,
      .hero-showcase {
        min-height: 285px;
      }
      .hero-mini-card {
        display: none;
      }
      .hero-device {
        right: 4%;
        bottom: -8px;
        width: 48%;
        min-height: 198px;
      }
      .device-screen {
        min-height: 148px;
      }
      .route-home .hero-visual-caption {
        display: none;
      }
    }
    .route-home main > section.systems-showcase,
    .route-home main > section.quiet-band {
      background:
        repeating-linear-gradient(90deg, rgba(255,250,240,.03) 0 1px, transparent 1px 82px),
        repeating-linear-gradient(0deg, rgba(255,250,240,.02) 0 1px, transparent 1px 82px),
        linear-gradient(145deg, #14252b 0%, #2f505b 72%, #1b333a 100%) !important;
      color: #fffaf0;
    }
    .route-home main > section.systems-showcase h2,
    .route-home main > section.quiet-band h2,
    .route-home main > section.quiet-band .section-header h2,
    .route-home main > section.quiet-band .myth-card h3 {
      color: #fffaf0;
    }
    .route-home main > section.systems-showcase .section-lead,
    .route-home main > section.quiet-band .section-lead,
    .route-home main > section.quiet-band .section-header p,
    .route-home main > section.quiet-band .myth-card p {
      color: rgba(255,250,240,.76) !important;
    }
    .route-home main > section.systems-showcase .scene-label,
    .route-home main > section.quiet-band .scene-label,
    .route-home main > section.quiet-band .myth-card strong {
      color: #f6ba6c;
      border-color: rgba(246,186,108,.30);
      background: rgba(246,186,108,.08);
    }
    .route-home main > section.systems-showcase .system-list a,
    .route-home main > section.quiet-band .testimonial-card,
    .route-home main > section.quiet-band .myth-card {
      border-color: rgba(255,250,240,.22);
      color: #fffaf0;
      background:
        radial-gradient(circle at 100% 0%, rgba(255,250,240,.10), transparent 34%),
        linear-gradient(145deg, rgba(255,255,255,.10), rgba(255,255,255,.04));
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.10),
        0 24px 80px rgba(4,13,16,.18);
    }
    .route-home main > section.systems-showcase .system-list span,
    .route-home main > section.systems-showcase .system-list a span,
    .route-home main > section.quiet-band .testimonial-card p {
      color: rgba(255,250,240,.78);
    }
    .route-home main > section.systems-showcase .system-list b {
      color: #fffaf0;
    }
    .route-home main > section.systems-showcase .system-list i,
    .route-home main > section.quiet-band .testimonial-card strong {
      color: #f6ba6c;
    }
    /* Approved concept correction: compact agency header and image-led hero. */
    .route-home .site-header {
      padding: 18px clamp(18px, 3vw, 42px) 0;
    }
    .route-home .nav-wrap {
      max-width: min(1760px, calc(100vw - 64px));
      min-height: 74px;
      padding: 8px 20px 8px 10px;
      border-radius: 999px;
      border-color: rgba(255,250,240,.58);
      background:
        linear-gradient(120deg, rgba(255,255,255,.12), rgba(255,255,255,.035)),
        rgba(18,35,40,.80);
      box-shadow: 0 20px 58px rgba(3,12,15,.25);
    }
    .route-home .brand {
      padding: 5px 14px 5px 6px;
      min-height: 54px;
    }
    .route-home .brand-logo {
      width: clamp(164px, 14vw, 218px);
    }
    .route-home nav a {
      min-height: 40px;
      padding: 9px 13px;
      font-size: .88rem;
    }
    .route-home .nav-cta {
      min-width: 160px;
      min-height: 48px;
      padding-inline: 20px;
    }
    .route-home .hero-home {
      min-height: min(820px, calc(100vh - 0px));
      padding-top: clamp(104px, 8.2vw, 132px);
      padding-bottom: 36px;
      background:
        linear-gradient(90deg, rgba(9,16,18,.18), rgba(9,16,18,0) 42%, rgba(9,16,18,.08)),
        repeating-linear-gradient(90deg, rgba(255,250,240,.032) 0 1px, transparent 1px 72px),
        repeating-linear-gradient(0deg, rgba(255,250,240,.025) 0 1px, transparent 1px 72px),
        linear-gradient(145deg, #315460 0%, #294a54 44%, #0f2025 100%);
    }
    .route-home .hero-grid {
      max-width: min(1760px, calc(100vw - 64px));
      grid-template-columns: minmax(0, .92fr) minmax(500px, 1fr);
      align-items: center;
      gap: clamp(28px, 4.2vw, 62px);
    }
    .route-home .hero-copy {
      min-height: auto;
      max-width: 820px;
      align-content: center;
      padding-bottom: 0;
    }
    .route-home .hero-kicker {
      margin-bottom: 24px;
      padding: 10px 15px;
      font-size: .74rem;
    }
    .route-home .hero-home h1 {
      max-width: 820px;
      font-size: clamp(3.7rem, 4.8vw, 5.45rem);
      line-height: .9;
      text-shadow: 0 9px 0 rgba(0,0,0,.18);
    }
    .route-home .lead {
      max-width: 650px;
      margin-top: 24px;
      font-size: clamp(1.05rem, 1.32vw, 1.24rem);
      line-height: 1.48;
    }
    .route-home .hero-wordline {
      display: none;
    }
    .route-home .hero-stat-grid {
      display: flex;
      gap: 12px;
      margin-top: 22px;
      padding-top: 0;
      border-top: 0;
    }
    .route-home .hero-stat {
      min-width: 0;
      padding: 8px 11px;
      border: 1px solid rgba(255,250,240,.18);
      border-radius: 999px;
      background: rgba(255,250,240,.06);
    }
    .route-home .hero-stat b {
      font-family: Inter, Segoe UI, Arial, sans-serif;
      font-size: .78rem;
      font-weight: 950;
      text-transform: uppercase;
      letter-spacing: .05em;
    }
    .route-home .hero-stat span {
      display: none;
    }
    .route-home .hero-home .actions {
      margin-top: 26px;
    }
    .route-home .btn {
      min-height: 50px;
      padding: 13px 19px;
      font-size: .92rem;
    }
    .route-home .clarity-note {
      display: none;
    }
    .route-home .poster-board,
    .hero-showcase {
      min-height: clamp(500px, 45vw, 620px);
      margin-top: 0;
      transform: none;
    }
    .route-home .poster-board::before {
      inset: 12% 3% 0 9%;
      filter: blur(26px);
      opacity: .88;
    }
    .route-home .poster-board::after {
      display: none;
    }
    .route-home .hero-visual-image {
      inset: 2% 0 4% 0;
      width: 100%;
      height: 94%;
      border-radius: 36px;
    }
    .hero-mini-card {
      top: 12%;
      left: -3%;
      width: min(245px, 42%);
      padding: 16px;
    }
    .hero-mini-card.alt {
      top: 4%;
      right: 4%;
      width: min(282px, 46%);
    }
    .hero-device {
      right: -3%;
      bottom: 4%;
      width: min(246px, 38%);
      min-height: 318px;
    }
    .device-screen {
      min-height: 242px;
    }
    .route-home .hero-visual-caption {
      left: 5%;
      bottom: 4%;
      max-width: 300px;
    }
    @media (max-width: 1100px) {
      .route-home .hero-grid {
        grid-template-columns: minmax(0, .88fr) minmax(420px, .92fr);
      }
      .route-home .hero-home h1 {
        font-size: clamp(3.4rem, 5.6vw, 4.8rem);
      }
      .route-home .poster-board,
      .hero-showcase {
        min-height: 470px;
      }
      .route-home nav a:not(.nav-cta) {
        display: none;
      }
    }
    @media (max-width: 760px) {
      .route-home .site-header {
        padding: 14px 14px 0;
      }
      .route-home .nav-wrap {
        max-width: none;
        min-height: 62px;
        padding: 8px 10px;
      }
      .route-home .brand {
        min-height: 48px;
      }
      .route-home .brand-logo {
        width: min(46vw, 164px);
      }
      .route-home .nav-cta {
        min-height: 42px;
        min-width: 0;
        padding-inline: 13px;
        font-size: .76rem;
      }
      .route-home .hero-home {
        min-height: auto;
        padding-top: 100px;
        padding-bottom: 30px;
      }
      .route-home .hero-grid {
        max-width: min(100%, calc(100vw - 32px));
        grid-template-columns: 1fr;
        gap: 28px;
      }
      .route-home .hero-kicker {
        margin-bottom: 22px;
      }
      .route-home .hero-home h1 {
        max-width: 100%;
        font-size: clamp(2.62rem, 11.2vw, 3.42rem);
        line-height: .94;
        text-shadow: 0 6px 0 rgba(0,0,0,.16);
      }
      .route-home .lead {
        margin-top: 18px;
        font-size: .98rem;
      }
      .route-home .hero-stat-grid,
      .home-mobile-reassurance {
        display: none;
      }
      .route-home .hero-home .actions {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 10px;
        margin-top: 22px;
      }
      .route-home .hero-home .btn {
        flex: 1 1 0;
        min-width: 0;
        min-height: 50px;
        padding: 12px 10px;
        font-size: .84rem;
      }
      .route-home .poster-board,
      .hero-showcase {
        min-height: 300px;
      }
      .hero-mini-card,
      .hero-mini-card.alt,
      .route-home .hero-visual-caption {
        display: none;
      }
      .hero-device {
        right: 4%;
        bottom: -8px;
        width: 48%;
        min-height: 198px;
      }
      .device-screen {
        min-height: 148px;
      }
    }
    /* Flagship reference pass: match the approved compact, image-led agency page. */
    .route-home {
      --max: 1240px;
      --flag-bg: #061313;
      --flag-panel: #0b2527;
      --flag-ink: #f7f2e8;
      --flag-muted: rgba(247,242,232,.72);
      --flag-cream: #f5eee3;
      --flag-teal: #274d56;
      --flag-orange: #e98c33;
      background: var(--flag-bg);
      color: var(--flag-ink);
    }
    .route-home .ambient {
      background:
        radial-gradient(circle at 18% 22%, rgba(233,140,51,.18), transparent 21rem),
        radial-gradient(circle at 78% 18%, rgba(42,94,100,.52), transparent 28rem),
        linear-gradient(180deg, rgba(6,19,19,.16), rgba(6,19,19,.88));
    }
    .route-home .scene-canvas { opacity: .12; }
    .route-home .noise {
      opacity: .12;
      background-size: 58px 58px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,.9), transparent 74%);
    }
    .route-home .site-header {
      padding: 0;
      background: rgba(4,12,12,.96);
      border-bottom: 1px solid rgba(247,242,232,.08);
      backdrop-filter: blur(18px);
      box-shadow: none;
    }
    .route-home .site-header.is-scrolled {
      background: rgba(4,12,12,.98);
      border-bottom-color: rgba(233,140,51,.20);
      box-shadow: 0 12px 34px rgba(0,0,0,.22);
    }
    .route-home .nav-wrap {
      max-width: var(--max);
      min-height: 54px;
      padding: 0 18px;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      gap: 28px;
    }
    .route-home .brand {
      min-height: 0;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }
    .route-home .brand::after { display: none; }
    .route-home .brand-logo {
      width: clamp(108px, 10vw, 138px);
      filter: none;
    }
    .route-home nav {
      gap: clamp(12px, 1.4vw, 24px);
      flex-wrap: nowrap;
    }
    .route-home nav a:not(.nav-cta) {
      min-height: auto;
      padding: 5px 0;
      border-radius: 0;
      color: rgba(247,242,232,.78);
      font-size: .69rem;
      line-height: 1;
      letter-spacing: -.01em;
      white-space: nowrap;
    }
    .route-home nav a:hover,
    .route-home nav a.active {
      color: #fff6e8;
      background: transparent;
    }
    .route-home .nav-cta {
      min-width: 0;
      min-height: 34px;
      margin-left: 0;
      padding: 9px 15px;
      border: 0;
      color: #15100a;
      background: linear-gradient(135deg, #f3ab56, #d87924);
      box-shadow: 0 12px 24px rgba(216,121,36,.26);
      font-size: .74rem;
    }
    .route-home .hero-home {
      min-height: 0;
      padding: clamp(34px, 4vw, 52px) 22px 0;
      background:
        linear-gradient(90deg, rgba(6,19,19,.90) 0%, rgba(7,26,27,.76) 43%, rgba(7,24,24,.38) 100%),
        radial-gradient(circle at 78% 20%, rgba(233,140,51,.22), transparent 24rem),
        radial-gradient(circle at 42% 75%, rgba(45,105,96,.30), transparent 28rem),
        var(--flag-bg);
    }
    .route-home .hero-home::before {
      opacity: .20;
      background:
        linear-gradient(rgba(247,242,232,.055) 1px, transparent 1px),
        linear-gradient(90deg, rgba(247,242,232,.045) 1px, transparent 1px);
      background-size: 58px 58px;
    }
    .route-home .hero-home::after { display: none; }
    .route-home .hero-grid {
      max-width: var(--max);
      display: grid;
      grid-template-columns: minmax(320px, .62fr) minmax(540px, 1fr);
      align-items: center;
      gap: clamp(28px, 3.8vw, 58px);
    }
    .route-home .hero-copy {
      max-width: 520px;
      align-content: center;
      padding: 0 0 28px;
    }
    .route-home .hero-kicker {
      display: inline-flex;
      width: fit-content;
      margin: 0 0 16px;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      color: #d9903a;
      font-size: .58rem;
      letter-spacing: .13em;
    }
    .route-home .hero-kicker::before {
      width: 5px;
      height: 5px;
      background: #43e7ac;
      box-shadow: 0 0 14px rgba(67,231,172,.8);
    }
    .route-home .hero-home h1 {
      max-width: 520px;
      margin-bottom: 14px;
      font-size: clamp(2.6rem, 4.45vw, 4.5rem);
      line-height: .92;
      letter-spacing: -.015em;
      text-shadow: 0 7px 0 rgba(0,0,0,.26), 0 28px 70px rgba(0,0,0,.50);
    }
    .route-home .lead {
      max-width: 510px;
      margin: 0;
      color: var(--flag-muted);
      font-size: clamp(.88rem, 1.05vw, 1.03rem);
      line-height: 1.5;
      text-shadow: none;
    }
    .route-home .hero-home .actions {
      margin-top: 18px;
      gap: 9px;
    }
    .route-home .hero-home .btn {
      min-height: 38px;
      padding: 10px 15px;
      font-size: .72rem;
      border-radius: 3px;
      border-color: rgba(247,242,232,.26);
      box-shadow: none;
    }
    .route-home .hero-home .btn-primary {
      color: #15100a;
      background: linear-gradient(135deg, #f3a64d, #d87924);
    }
    .route-home .hero-home .btn-secondary {
      color: #f7f2e8;
      background: rgba(255,255,255,.04);
    }
    .route-home .hero-stat-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 16px;
      margin-top: 14px;
    }
    .route-home .hero-stat {
      display: inline-flex;
      align-items: center;
      width: auto;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }
    .route-home .hero-stat::before {
      content: "";
      width: 7px;
      height: 7px;
      margin-right: 6px;
      border-radius: 50%;
      background: rgba(233,140,51,.92);
      box-shadow: 0 0 12px rgba(233,140,51,.55);
    }
    .route-home .hero-stat b {
      color: rgba(247,242,232,.66);
      font-size: .58rem;
      letter-spacing: -.01em;
      text-transform: none;
    }
    .route-home .hero-stat span,
    .route-home .hero-wordline,
    .route-home .clarity-note,
    .route-home .home-mobile-reassurance {
      display: none;
    }
    .route-home .poster-board,
    .route-home .hero-showcase {
      min-height: clamp(300px, 31vw, 430px);
      margin: 0;
      transform: none;
    }
    .route-home .poster-board::before {
      inset: 8% 5% 0 6%;
      background: radial-gradient(ellipse at center, rgba(233,140,51,.28), transparent 64%);
      filter: blur(30px);
      opacity: .75;
    }
    .route-home .poster-board::after,
    .route-home .visual-sheen,
    .route-home .hero-mini-card,
    .route-home .hero-device,
    .route-home .hero-visual-caption {
      display: none;
    }
    .route-home .hero-visual-image {
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 8px;
      box-shadow:
        0 20px 60px rgba(0,0,0,.42),
        0 0 0 1px rgba(247,242,232,.12);
    }
    .route-home .decision-band,
    .route-home .case-band,
    .route-home .systems-showcase,
    .route-home .advice-band {
      display: none;
    }
    .route-home .logo-strip {
      padding: 20px 22px 22px;
      background: #071b1e;
      color: #f7f2e8;
      border-top: 1px solid rgba(233,140,51,.22);
      border-bottom: 1px solid rgba(247,242,232,.06);
    }
    .route-home .logo-strip .container {
      max-width: var(--max);
      grid-template-columns: minmax(170px,.28fr) minmax(0,1fr);
      gap: 20px;
      padding-top: 0;
      border-top: 0;
    }
    .route-home .logo-strip strong {
      color: #d9903a;
      font-size: .58rem;
      letter-spacing: .12em;
    }
    .route-home .logo-cloud {
      overflow: visible;
    }
    .route-home .logo-track {
      display: grid;
      grid-template-columns: repeat(6, minmax(0,1fr));
      gap: 12px;
      width: 100%;
      animation: none;
    }
    .route-home .logo-track .logo-pill:nth-child(n+7) {
      display: none;
    }
    .route-home .logo-pill {
      min-height: 38px;
      padding: 8px 10px;
      border: 0;
      border-radius: 0;
      background: transparent;
      color: rgba(247,242,232,.52);
      font-size: .68rem;
      letter-spacing: .02em;
      font-family: Georgia, "Times New Roman", serif;
      font-style: italic;
      opacity: .92;
    }
    .route-home .premium-examples {
      padding: 48px 22px;
      background: #071414 !important;
      color: #f7f2e8;
    }
    .route-home .premium-examples .container {
      max-width: var(--max);
      display: grid;
      grid-template-columns: minmax(280px,.52fr) minmax(0,1fr);
      gap: clamp(28px, 4vw, 54px);
      align-items: center;
    }
    .route-home .premium-examples .section-header {
      display: block;
      margin: 0;
    }
    .route-home .premium-examples .section-header h2 {
      max-width: 410px;
      color: #f7f2e8;
      font-size: clamp(1.7rem, 2.75vw, 2.9rem);
      line-height: .96;
    }
    .route-home .premium-examples .section-header p {
      max-width: 380px;
      margin-top: 14px;
      color: rgba(247,242,232,.68);
      font-size: .9rem;
      line-height: 1.55;
    }
    .route-home .portfolio-grid {
      display: grid;
      grid-template-columns: .92fr 1.08fr .92fr;
      align-items: end;
      gap: 14px;
      margin: 0;
      perspective: 1000px;
    }
    .route-home .portfolio-card {
      min-height: 240px;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 18px 52px rgba(0,0,0,.34);
      transform: rotate(-2.5deg);
      background:
        linear-gradient(180deg, rgba(7,20,20,.02) 0 22%, rgba(7,20,20,.92) 100%),
        url("/visuals/hero-local-business-devices.png") center / cover no-repeat;
    }
    .route-home .portfolio-card:nth-child(2) {
      min-height: 300px;
      transform: rotate(1.2deg) translateY(-12px);
      background:
        linear-gradient(180deg, rgba(7,20,20,.04) 0 24%, rgba(7,20,20,.92) 100%),
        url("/visuals/premium-site-stack.svg") center / cover no-repeat;
    }
    .route-home .portfolio-card:nth-child(3) {
      transform: rotate(2.4deg);
      background:
        linear-gradient(180deg, rgba(7,20,20,.02) 0 26%, rgba(7,20,20,.90) 100%),
        url("/visuals/local-proof-board.svg") center / cover no-repeat;
    }
    .route-home .portfolio-card::before {
      inset: 9px;
      border-radius: 6px;
      border-color: rgba(247,242,232,.22);
    }
    .route-home .portfolio-card h3 {
      max-width: 260px;
      font-size: clamp(1.15rem, 1.55vw, 1.55rem);
    }
    .route-home .portfolio-card p {
      font-size: .78rem;
      line-height: 1.42;
    }
    .route-home .portfolio-card span:last-child {
      padding: 7px 10px;
      font-size: .64rem;
    }
    .route-home .booking-feature {
      padding: 44px 22px;
      background: var(--flag-cream) !important;
      color: #132326;
    }
    .booking-grid {
      max-width: var(--max);
      display: grid;
      grid-template-columns: minmax(320px,.86fr) minmax(330px,.78fr);
      gap: clamp(28px, 4vw, 60px);
      align-items: center;
    }
    .booking-image {
      position: relative;
      margin: 0;
      min-height: 320px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 22px 60px rgba(39,77,86,.18);
    }
    .booking-image img {
      width: 100%;
      height: 100%;
      min-height: 320px;
      display: block;
      object-fit: cover;
      object-position: center;
      filter: saturate(.98) contrast(1.02);
    }
    .booking-image figcaption {
      position: absolute;
      left: 16px;
      bottom: 16px;
      max-width: 240px;
      padding: 10px 12px;
      border-radius: 4px;
      color: #f7f2e8;
      background: rgba(7,20,20,.82);
      font-size: .72rem;
      font-weight: 850;
      box-shadow: 0 16px 32px rgba(0,0,0,.22);
    }
    .booking-copy .scene-label {
      color: #b96523;
      border: 0;
      padding: 0;
      background: transparent;
    }
    .booking-copy h2 {
      max-width: 520px;
      color: #132326;
      font-size: clamp(2rem, 3.2vw, 3.65rem);
      line-height: .96;
    }
    .booking-copy p {
      max-width: 520px;
      color: rgba(19,35,38,.72);
      font-size: .98rem;
      line-height: 1.58;
    }
    .feature-list {
      display: grid;
      gap: 8px;
      margin: 20px 0 22px;
      padding: 0;
      list-style: none;
      color: rgba(19,35,38,.82);
      font-weight: 760;
    }
    .feature-list li {
      display: grid;
      grid-template-columns: 18px 1fr;
      gap: 8px;
      align-items: start;
      font-size: .88rem;
    }
    .feature-list li::before {
      content: "";
      width: 9px;
      height: 9px;
      margin-top: .42em;
      border-radius: 50%;
      background: #d87924;
      box-shadow: 0 0 0 4px rgba(216,121,36,.12);
    }
    .booking-copy .btn-primary {
      width: fit-content;
      min-height: 38px;
      color: #fff8ec;
      background: linear-gradient(135deg, #f3a64d, #d87924);
      border-radius: 3px;
      font-size: .76rem;
    }
    .route-home .myth-band {
      padding: 52px 22px;
      background: #071b1e !important;
      color: #f7f2e8;
    }
    .route-home .myth-band .container {
      max-width: var(--max);
      display: grid;
      grid-template-columns: minmax(260px,.46fr) minmax(0,1fr);
      gap: clamp(28px, 4vw, 54px);
      align-items: start;
    }
    .route-home .myth-band .section-header {
      display: block;
      margin: 0;
    }
    .route-home .myth-band .section-header h2 {
      color: #f7f2e8;
      font-size: clamp(1.8rem, 3.35vw, 3.6rem);
      line-height: .96;
    }
    .route-home .myth-band .section-header p {
      margin-top: 14px;
      color: rgba(247,242,232,.70);
      font-size: .9rem;
      line-height: 1.55;
    }
    .route-home .myth-band .myth-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0,1fr));
      gap: 10px;
      margin: 0;
    }
    .route-home .myth-band .myth-card,
    .route-home .myth-band .myth-card:first-child {
      min-height: 0;
      grid-column: auto;
      grid-template-columns: minmax(0, .58fr) minmax(0, 1fr);
      gap: 14px;
      padding: 14px 16px;
      border: 1px solid rgba(247,242,232,.10);
      border-radius: 4px;
      background: rgba(255,255,255,.035);
      box-shadow: none;
    }
    .route-home .myth-band .myth-card strong {
      color: #d9903a;
      font-size: .56rem;
      margin-bottom: 7px;
    }
    .route-home .myth-band .myth-card h3 {
      max-width: 230px;
      color: #f7f2e8;
      font-size: clamp(.95rem, 1.12vw, 1.14rem);
      line-height: 1.06;
    }
    .route-home .myth-band .myth-card p {
      color: rgba(247,242,232,.64);
      font-size: .76rem;
      line-height: 1.48;
    }
    .route-home main > .cta-band {
      padding: 48px 22px 34px;
      background:
        linear-gradient(90deg, rgba(6,19,19,.96) 0 55%, rgba(6,19,19,.55)),
        url("/visuals/hero-local-business-devices.png") right center / min(58vw, 760px) auto no-repeat,
        #061313;
      color: #f7f2e8;
      border-top: 1px solid rgba(233,140,51,.18);
    }
    .route-home main > .cta-band .cta-inner {
      max-width: var(--max);
      display: grid;
      grid-template-columns: minmax(280px,.58fr) minmax(280px,.42fr);
      gap: 28px;
      align-items: end;
      padding-top: 0;
      border-top: 0;
    }
    .route-home main > .cta-band h2 {
      max-width: 560px;
      color: #f7f2e8;
      font-size: clamp(2rem, 3.65vw, 4.1rem);
      line-height: .94;
    }
    .route-home main > .cta-band p {
      max-width: 540px;
      color: rgba(247,242,232,.70);
      font-size: .92rem;
      line-height: 1.55;
    }
    .route-home main > .cta-band .actions {
      justify-content: flex-end;
    }
    .route-home main > .cta-band .btn {
      min-height: 38px;
      border-radius: 3px;
      font-size: .74rem;
    }
    .route-home main > .cta-band .btn-primary {
      color: #15100a;
      background: linear-gradient(135deg, #f3a64d, #d87924);
    }
    .route-home main > .cta-band .btn-secondary {
      color: #f7f2e8;
      border-color: rgba(247,242,232,.30);
      background: rgba(255,255,255,.04);
    }
    .route-home .footer {
      background: #061313;
      color: rgba(247,242,232,.48);
      border-top: 1px solid rgba(247,242,232,.08);
    }
    @media (max-width: 980px) {
      .route-home .hero-grid,
      .route-home .premium-examples .container,
      .booking-grid,
      .route-home .myth-band .container,
      .route-home main > .cta-band .cta-inner {
        grid-template-columns: 1fr;
      }
      .route-home nav a:not(.nav-cta) {
        display: none;
      }
      .route-home .hero-copy {
        max-width: 720px;
      }
      .route-home .hero-home h1,
      .route-home .lead {
        max-width: 720px;
      }
      .route-home .poster-board,
      .route-home .hero-showcase {
        min-height: 360px;
      }
      .route-home .premium-examples .portfolio-grid {
        grid-template-columns: repeat(3, minmax(0,1fr));
      }
      .route-home .myth-band .myth-grid {
        grid-template-columns: 1fr;
      }
      .route-home main > .cta-band .actions {
        justify-content: flex-start;
      }
    }
    @media (max-width: 620px) {
      .route-home .nav-wrap {
        min-height: 52px;
        padding: 0 14px;
      }
      .route-home .brand-logo {
        width: 112px;
      }
      .route-home .nav-cta {
        min-height: 34px;
        padding-inline: 12px;
      }
      .route-home .hero-home {
        padding: 32px 16px 0;
      }
      .route-home .hero-grid {
        max-width: 100%;
        gap: 22px;
      }
      .route-home .hero-copy {
        padding-bottom: 0;
      }
      .route-home .hero-home h1 {
        font-size: clamp(2.55rem, 14.2vw, 3.72rem);
        line-height: .9;
      }
      .route-home .lead {
        font-size: .94rem;
      }
      .route-home .hero-home .actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .route-home .hero-home .btn {
        width: 100%;
        padding-inline: 10px;
      }
      .route-home .hero-stat-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0,1fr));
        gap: 8px;
      }
      .route-home .hero-stat b {
        font-size: .54rem;
      }
      .route-home .poster-board,
      .route-home .hero-showcase {
        min-height: 230px;
      }
      .route-home .logo-strip {
        padding: 16px;
      }
      .route-home .logo-strip .container {
        display: block;
      }
      .route-home .logo-strip strong {
        display: block;
        margin-bottom: 10px;
      }
      .route-home .logo-track {
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 6px;
      }
      .route-home .premium-examples,
      .route-home .booking-feature,
      .route-home .myth-band,
      .route-home main > .cta-band {
        padding: 34px 16px;
      }
      .route-home .premium-examples .portfolio-grid {
        grid-template-columns: 1fr;
      }
      .route-home .portfolio-card,
      .route-home .portfolio-card:nth-child(2),
      .route-home .portfolio-card:nth-child(3) {
        min-height: 210px;
        transform: none;
      }
      .booking-image,
      .booking-image img {
        min-height: 230px;
      }
      .route-home .myth-band .myth-card,
      .route-home .myth-band .myth-card:first-child {
        grid-template-columns: 1fr;
      }
      .route-home main > .cta-band {
        background:
          linear-gradient(180deg, rgba(6,19,19,.88), rgba(6,19,19,.98)),
          url("/visuals/hero-local-business-devices.png") center top / cover no-repeat,
          #061313;
      }
    }
    /* Flagship reference pass 2: readability, scale, and proof-strip fix. */
    .route-home .brand {
      min-height: 36px;
      padding: 4px 10px 4px 4px;
      border: 1px solid rgba(247,242,232,.18);
      border-radius: 999px;
      background:
        linear-gradient(115deg, rgba(255,255,255,.72), transparent 34%),
        #f2dfbd;
      box-shadow: 0 10px 24px rgba(0,0,0,.18);
    }
    .route-home .brand-logo {
      width: clamp(130px, 11vw, 164px);
      filter: none;
    }
    .route-home .hero-grid {
      grid-template-columns: minmax(420px, .78fr) minmax(620px, 1.06fr);
      gap: clamp(34px, 5vw, 74px);
    }
    .route-home .hero-copy {
      max-width: 650px;
    }
    .route-home .hero-home h1 {
      max-width: 640px;
      font-size: clamp(3rem, 3.7vw, 4.15rem);
      line-height: .91;
    }
    .route-home .lead {
      max-width: 590px;
      font-size: clamp(.92rem, 1vw, 1rem);
    }
    .route-home .poster-board,
    .route-home .hero-showcase {
      min-height: clamp(350px, 30vw, 455px);
    }
    .route-home main > .logo-strip {
      background: #071b1e !important;
      color: #f7f2e8;
    }
    .route-home main > .logo-strip .container {
      border-color: transparent;
    }
    .route-home main > .logo-strip strong {
      color: #d9903a;
    }
    .route-home main > .logo-strip .logo-pill {
      color: rgba(247,242,232,.62);
      border-color: transparent;
      background: transparent;
    }
    @media (max-width: 980px) {
      .route-home .hero-grid {
        grid-template-columns: 1fr;
      }
      .route-home .hero-home h1 {
        max-width: 720px;
        font-size: clamp(2.7rem, 8.2vw, 4rem);
      }
    }
    @media (max-width: 620px) {
      .route-home .brand {
        min-height: 34px;
      }
      .route-home .brand-logo {
        width: 124px;
      }
      .route-home .hero-home h1 {
        font-size: clamp(2.25rem, 11vw, 3.06rem);
        line-height: .93;
      }
      .route-home .poster-board,
      .route-home .hero-showcase {
        min-height: 220px;
      }
    }
    /* Flagship reference pass 3: downstream contrast repair. */
    .route-home main > section.premium-examples .section-header p {
      color: rgba(247,242,232,.70) !important;
    }
    .route-home main > section.cta-band {
      background:
        linear-gradient(90deg, rgba(6,19,19,.96) 0 55%, rgba(6,19,19,.55)),
        url("/visuals/hero-local-business-devices.png") right center / min(58vw, 760px) auto no-repeat,
        #061313 !important;
      color: #f7f2e8 !important;
    }
    .route-home main > section.cta-band h2 {
      color: #f7f2e8 !important;
    }
    .route-home main > section.cta-band p {
      color: rgba(247,242,232,.72) !important;
    }
    .route-home main > section.cta-band .btn-primary {
      color: #15100a !important;
      background: linear-gradient(135deg, #f3a64d, #d87924) !important;
    }
    .route-home main > section.cta-band .btn-secondary {
      color: #f7f2e8 !important;
      border-color: rgba(247,242,232,.30) !important;
      background: rgba(255,255,255,.04) !important;
    }
    @media (max-width: 620px) {
      .route-home main > section.cta-band {
        background:
          linear-gradient(180deg, rgba(6,19,19,.88), rgba(6,19,19,.98)),
          url("/visuals/hero-local-business-devices.png") center top / cover no-repeat,
          #061313 !important;
      }
    }
    /* Flagship reference pass 4: wider editorial composition and cleaner proof/examples. */
    .route-home {
      --max: 1360px;
    }
    .route-home .hero-home {
      padding-top: clamp(28px, 3.1vw, 44px);
    }
    .route-home .hero-grid {
      grid-template-columns: minmax(430px, .72fr) minmax(700px, 1.14fr);
      gap: clamp(42px, 5.4vw, 86px);
    }
    .route-home .hero-copy {
      max-width: 660px;
    }
    .route-home .hero-home h1 {
      max-width: 650px;
      font-size: clamp(3.05rem, 3.55vw, 4.05rem);
      line-height: .9;
    }
    .route-home .poster-board,
    .route-home .hero-showcase {
      min-height: clamp(390px, 30.5vw, 500px);
    }
    .route-home .hero-visual-image {
      border-radius: 6px;
      box-shadow:
        0 24px 70px rgba(0,0,0,.44),
        0 0 0 1px rgba(247,242,232,.16);
    }
    .route-home main > .logo-strip {
      padding-top: 18px;
      padding-bottom: 18px;
    }
    .route-home main > .logo-strip .container {
      grid-template-columns: minmax(190px,.2fr) minmax(0,1fr);
      gap: 24px;
    }
    .route-home .logo-track {
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 10px;
      overflow: visible;
    }
    .route-home main > .logo-strip .logo-pill {
      min-width: 0;
      min-height: 34px;
      padding: 7px 6px;
      overflow: visible;
      white-space: normal;
      line-height: 1.05;
      text-wrap: balance;
      font-size: .61rem;
    }
    .route-home .premium-examples {
      padding-top: 54px;
      padding-bottom: 58px;
    }
    .route-home .premium-examples .container {
      grid-template-columns: minmax(290px,.46fr) minmax(0,1fr);
      gap: clamp(34px, 5vw, 76px);
    }
    .route-home .portfolio-grid {
      grid-template-columns: .86fr 1.18fr .86fr;
      gap: 18px;
      align-items: center;
    }
    .route-home .portfolio-card {
      min-height: 278px;
      padding: 22px;
      background:
        linear-gradient(180deg, rgba(7,20,20,.02) 0 24%, rgba(7,20,20,.72) 62%, rgba(7,20,20,.98) 100%),
        url("/visuals/hero-local-business-devices.png") center / cover no-repeat;
    }
    .route-home .portfolio-card:nth-child(2) {
      min-height: 360px;
      background:
        linear-gradient(180deg, rgba(7,20,20,.08) 0 25%, rgba(7,20,20,.74) 60%, rgba(7,20,20,.98) 100%),
        url("/visuals/premium-site-stack.svg") center / cover no-repeat;
    }
    .route-home .portfolio-card:nth-child(3) {
      min-height: 278px;
      background:
        linear-gradient(180deg, rgba(7,20,20,.05) 0 25%, rgba(7,20,20,.74) 62%, rgba(7,20,20,.98) 100%),
        url("/visuals/higgsfield-premium-hero.png") center / cover no-repeat;
    }
    .route-home .portfolio-card strong {
      color: #f3a64d;
      text-shadow: 0 2px 18px rgba(0,0,0,.44);
    }
    .route-home .portfolio-card h3 {
      font-size: clamp(1.25rem, 1.7vw, 1.85rem);
      text-shadow: 0 8px 24px rgba(0,0,0,.54);
    }
    .route-home .portfolio-card p {
      max-width: 280px;
      color: rgba(247,242,232,.82);
      font-size: .78rem;
      line-height: 1.4;
      text-shadow: 0 8px 24px rgba(0,0,0,.56);
    }
    .route-home .portfolio-card span:last-child {
      color: #061313;
      background: #f7f2e8;
      box-shadow: 0 10px 24px rgba(0,0,0,.18);
    }
    @media (max-width: 1180px) {
      .route-home .hero-grid {
        grid-template-columns: minmax(380px, .72fr) minmax(520px, 1fr);
        gap: 34px;
      }
      .route-home .hero-home h1 {
        font-size: clamp(2.85rem, 4.3vw, 3.7rem);
      }
      .route-home .poster-board,
      .route-home .hero-showcase {
        min-height: 350px;
      }
    }
    @media (max-width: 980px) {
      .route-home .hero-grid {
        grid-template-columns: 1fr;
      }
      .route-home .logo-track {
        grid-template-columns: repeat(3, minmax(0,1fr));
      }
    }
    @media (max-width: 620px) {
      .route-home .hero-home {
        padding-top: 28px;
      }
      .route-home .hero-home h1 {
        font-size: clamp(2.28rem, 10.9vw, 3.02rem);
      }
      .route-home .logo-track {
        grid-template-columns: repeat(2, minmax(0,1fr));
      }
      .route-home .portfolio-card,
      .route-home .portfolio-card:nth-child(2),
      .route-home .portfolio-card:nth-child(3) {
        min-height: 230px;
      }
    }
    /* Flagship reference pass 5: mobile examples must stack cleanly, never spill sideways. */
    @media (max-width: 760px) {
      .route-home .premium-examples .container {
        grid-template-columns: 1fr;
        gap: 22px;
      }
      .route-home .portfolio-grid {
        grid-template-columns: 1fr;
        gap: 14px;
        perspective: none;
      }
      .route-home .portfolio-card,
      .route-home .portfolio-card:nth-child(2),
      .route-home .portfolio-card:nth-child(3) {
        min-height: 230px;
        transform: none;
      }
    }
    /* Flagship reference pass 6: remove the boxed desktop hero and blend the scene into the page. */
    @media (min-width: 981px) {
      .route-home .hero-home {
        min-height: clamp(620px, calc(100vh - 190px), 730px);
        padding: 0 22px;
        overflow: hidden;
        background:
          radial-gradient(circle at 22% 34%, rgba(233,140,51,.10), transparent 25rem),
          linear-gradient(90deg, #061313 0%, #071818 42%, rgba(7,24,24,.58) 68%, rgba(7,24,24,.22) 100%);
      }
      .route-home .hero-home::before {
        z-index: 0;
        opacity: .16;
      }
      .route-home .hero-home::after {
        content: "";
        display: block;
        position: absolute;
        z-index: 0;
        inset: 0 0 0 auto;
        width: min(65vw, 1180px);
        height: 100%;
        transform: none;
        background:
          linear-gradient(90deg, #061313 0%, rgba(6,19,19,.88) 10%, rgba(6,19,19,.38) 31%, rgba(6,19,19,.04) 60%),
          linear-gradient(180deg, rgba(6,19,19,.30), rgba(6,19,19,.03) 24%, rgba(6,19,19,.14) 100%),
          url("/visuals/hero-local-business-devices.png") center right / cover no-repeat;
        opacity: .98;
        pointer-events: none;
      }
      .route-home .hero-grid {
        display: block;
        min-height: inherit;
        max-width: min(1360px, calc(100vw - 176px));
      }
      .route-home .hero-copy {
        width: min(47vw, 620px);
        max-width: 620px;
        min-height: inherit;
        display: grid;
        align-content: center;
        padding: 32px 0 42px;
        position: relative;
        z-index: 2;
      }
      .route-home .poster-board {
        display: none;
      }
      .route-home .hero-home h1 {
        max-width: 610px;
        font-size: clamp(3.18rem, 4.05vw, 4.85rem);
        line-height: .88;
      }
      .route-home .lead {
        max-width: 585px;
        font-size: clamp(.98rem, 1.07vw, 1.08rem);
      }
      .route-home .hero-stat-grid {
        margin-top: 18px;
      }
      .route-home .hero-home .actions {
        margin-top: 24px;
      }
      .route-home main > .logo-strip {
        position: relative;
        z-index: 2;
        margin-top: 0;
        padding-top: 20px;
        padding-bottom: 22px;
        background:
          linear-gradient(90deg, rgba(7,27,30,.96), rgba(7,27,30,.90)),
          #071b1e !important;
      }
      .route-home .premium-examples {
        padding-top: clamp(72px, 7vw, 116px);
      }
      .route-home .premium-examples .container {
        align-items: end;
      }
    }
    @media (min-width: 981px) and (max-width: 1280px) {
      .route-home .hero-grid {
        max-width: min(1240px, calc(100vw - 64px));
      }
      .route-home .hero-copy {
        width: min(50vw, 580px);
      }
      .route-home .hero-home h1 {
        font-size: clamp(2.95rem, 4.2vw, 4.2rem);
      }
    }
    /* Flagship reference pass 7: hard-anchor the desktop copy rail so the scene never eats the message. */
    @media (min-width: 981px) {
      .route-home .hero-grid {
        position: relative;
        max-width: min(1660px, calc(100vw - 176px));
        margin-inline: auto;
      }
      .route-home .hero-copy {
        position: absolute;
        inset: 0 auto 0 0;
        width: min(42vw, 610px);
        max-width: 610px;
        min-height: 0;
        margin: 0 !important;
        padding: 32px 0 42px;
      }
      .route-home .hero-home::after {
        width: min(66vw, 1220px);
        background:
          linear-gradient(90deg, #061313 0%, rgba(6,19,19,.94) 9%, rgba(6,19,19,.58) 25%, rgba(6,19,19,.10) 55%),
          linear-gradient(180deg, rgba(6,19,19,.32), rgba(6,19,19,.02) 24%, rgba(6,19,19,.16) 100%),
          url("/visuals/hero-local-business-devices.png") center right / cover no-repeat;
      }
    }
    @media (min-width: 981px) and (max-width: 1280px) {
      .route-home .hero-grid {
        max-width: min(1240px, calc(100vw - 64px));
      }
      .route-home .hero-copy {
        width: min(47vw, 560px);
      }
    }
    /* Flagship reference pass 8: explicit desktop width so the absolute copy rail cannot collapse to centre. */
    @media (min-width: 981px) {
      .route-home .hero-grid {
        width: min(1660px, calc(100vw - 176px));
        max-width: min(1660px, calc(100vw - 176px));
        min-height: inherit;
      }
      .route-home .hero-copy {
        left: 0;
        right: auto;
        top: 0;
        bottom: 0;
        display: grid;
        align-content: center;
      }
      .route-home .hero-home h1 {
        max-width: 620px;
      }
      .route-home .lead {
        max-width: 590px;
      }
    }
    @media (min-width: 981px) and (max-width: 1280px) {
      .route-home .hero-grid {
        width: min(1240px, calc(100vw - 64px));
        max-width: min(1240px, calc(100vw - 64px));
      }
    }
    /* Flagship reference pass 9: Seedance motion stage with controlled premium layout. */
    .hero-visual-video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: 0;
      filter: saturate(1.04) contrast(1.05) brightness(.94);
      transition: opacity .6s ease;
      z-index: 2;
    }
    .hero-visual-video[src],
    .hero-visual-video:playing {
      opacity: .98;
    }
    @media (min-width: 981px) {
      .route-home .hero-home {
        min-height: clamp(650px, calc(100vh - 56px), 790px);
        padding: clamp(72px, 7.5vw, 112px) 32px 0;
        overflow: hidden;
        background:
          radial-gradient(circle at 18% 28%, rgba(233,140,51,.16), transparent 26rem),
          linear-gradient(90deg, rgba(5,17,17,.98) 0%, rgba(5,17,17,.95) 36%, rgba(7,32,34,.86) 68%, rgba(5,17,17,.98) 100%),
          var(--flag-bg);
      }
      .route-home .hero-home::after {
        display: none;
      }
      .route-home .hero-grid {
        display: grid;
        width: min(1580px, calc(100vw - 88px));
        max-width: min(1580px, calc(100vw - 88px));
        min-height: auto;
        grid-template-columns: minmax(430px, .70fr) minmax(720px, 1.14fr);
        gap: clamp(42px, 5.2vw, 92px);
        align-items: center;
        margin-inline: auto;
      }
      .route-home .hero-copy {
        position: relative !important;
        inset: auto !important;
        width: auto;
        max-width: 620px;
        min-height: auto;
        margin: 0 !important;
        padding: 0 0 34px;
        align-content: center;
      }
      .route-home .hero-home h1 {
        max-width: 620px;
        font-size: clamp(3.35rem, 4.45vw, 5.1rem);
        line-height: .88;
      }
      .route-home .lead {
        max-width: 590px;
        font-size: clamp(.99rem, 1.07vw, 1.12rem);
        line-height: 1.5;
      }
      .route-home .poster-board {
        display: block;
        position: relative;
        min-height: clamp(450px, 40vw, 610px);
        margin: 0;
        transform: none;
        isolation: isolate;
      }
      .route-home .poster-board::before {
        content: "";
        display: block;
        position: absolute;
        z-index: -1;
        inset: 8% -6% -10% 3%;
        background:
          radial-gradient(ellipse at 58% 55%, rgba(236,146,55,.32), transparent 56%),
          radial-gradient(ellipse at 34% 22%, rgba(72,124,105,.34), transparent 45%);
        filter: blur(42px);
        opacity: .95;
      }
      .route-home .poster-board::after {
        content: "";
        display: block;
        position: absolute;
        z-index: 4;
        inset: -1px;
        pointer-events: none;
        background:
          linear-gradient(90deg, rgba(5,17,17,.92), rgba(5,17,17,.30) 15%, transparent 30%),
          linear-gradient(180deg, transparent 70%, rgba(5,17,17,.28));
        mix-blend-mode: multiply;
        opacity: .68;
      }
      .route-home .hero-showcase {
        position: relative;
        min-height: clamp(450px, 40vw, 610px);
        overflow: hidden;
        border-radius: 30px;
        clip-path: polygon(2.8% 0, 100% 0, 100% 89%, 93% 100%, 0 96%, 0 8%);
        box-shadow:
          0 34px 90px rgba(0,0,0,.54),
          0 0 0 1px rgba(247,242,232,.12),
          inset 0 0 0 1px rgba(255,255,255,.08);
        transform: translateZ(0);
        background: #091616;
      }
      .route-home .hero-showcase::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 5;
        pointer-events: none;
        background:
          linear-gradient(90deg, rgba(5,17,17,.48), transparent 24%, transparent 86%, rgba(5,17,17,.20)),
          linear-gradient(180deg, rgba(255,248,232,.08), transparent 30%, rgba(0,0,0,.18));
      }
      .route-home .hero-visual-image,
      .route-home .hero-visual-video {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: 0;
        box-shadow: none;
      }
      .route-home .hero-visual-image {
        z-index: 1;
        filter: saturate(1.03) contrast(1.03) brightness(.92);
      }
      .route-home .hero-visual-video {
        display: block;
        z-index: 2;
        opacity: .98;
      }
      .route-home .visual-sheen {
        display: block;
        z-index: 6;
        opacity: .16;
        background: linear-gradient(110deg, transparent 35%, rgba(255,255,255,.40), transparent 52%);
        animation: sheenSweep 6.8s ease-in-out infinite;
      }
      .route-home .hero-mini-card,
      .route-home .hero-device,
      .route-home .hero-visual-caption {
        display: none;
      }
      .route-home main > .logo-strip {
        margin-top: 0;
        background: linear-gradient(90deg, #071b1e, #082124 55%, #071b1e) !important;
      }
      .route-home .premium-examples {
        padding-top: clamp(28px, 3.4vw, 48px);
      }
    }
    @media (min-width: 981px) and (max-width: 1280px) {
      .route-home .hero-grid {
        width: min(1220px, calc(100vw - 48px));
        max-width: min(1220px, calc(100vw - 48px));
        grid-template-columns: minmax(390px, .74fr) minmax(560px, 1fr);
        gap: 38px;
      }
      .route-home .hero-home h1 {
        font-size: clamp(2.95rem, 4.45vw, 4.25rem);
      }
    }
    @media (max-width: 980px) {
      .route-home .hero-visual-video {
        display: none;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .logo-track {
        animation: none;
      }
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: .01ms !important;
      }
      .hero-visual-video { display: none !important; }
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
      gsap.config({ nullTargetWarn: false });
      var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".site-header", { autoAlpha: 0, y: -18, duration: .55 }, 0)
        .from(".brand-logo", { autoAlpha: 0, scale: .9, x: -12, duration: .58 }, .12)
        .from("nav a", { autoAlpha: 0, y: -8, stagger: .035, duration: .38 }, .15)
        .from(".hero-kicker", { autoAlpha: 0, y: 18, duration: .46 }, .16)
        .fromTo(".hero h1", { y: 54, skewY: 2.4, scale: .985 }, { autoAlpha: 1, y: 0, skewY: 0, scale: 1, duration: 1.05 }, .2)
        .from(".hero .lead", { autoAlpha: 0, y: 18, duration: .62 }, .28)
        .from(".hero-wordline span", { autoAlpha: 0, y: 12, stagger: .055, duration: .38 }, .34)
        .from(".poster-board", { autoAlpha: 0, y: 30, rotate: -1, scale: .965, duration: .82 }, .30)
        .from(".hero-visual-image", { clipPath: "inset(8% round 42px)", scale: 1.06, duration: .9 }, .34)
        .from(".visual-sheen", { xPercent: -60, duration: 1.05 }, .42)
        .from(".hero-mini-card", { autoAlpha: 0, y: 24, rotate: -10, scale: .92, stagger: .11, duration: .58 }, .50)
        .from(".hero-device", { autoAlpha: 0, y: 36, rotate: 4, scale: .9, duration: .7 }, .62)
        .from(".hero-visual-caption", { autoAlpha: 0, y: 18, duration: .48 }, .54)
        .from(".hero-stat", { autoAlpha: 0, y: 18, scale: .96, stagger: .08, duration: .48 }, .38)
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
        var targets = section.querySelectorAll(".section-header, .offer-head, .scene-label, h2, .section-lead, .lead, .item, .proof-tile, .receipt-card, .case-card, .guide-card, .app-story, .offer-card, .decision-card, .price, .question, .path, .logo-pill, .wide-proof-image, .portfolio-card, .founder-portrait, .testimonial-card, .case-visual, .case-point, .receipt-strip-card, .advice-card, .system-panel, .system-list a");
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
      gsap.to(".hero-showcase", { y: -14, rotate: .7, duration: 4.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(".hero-device", { y: -10, rotate: -2.5, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

      gsap.utils.toArray(".offer-card, .item, .proof-tile, .receipt-card, .case-card, .guide-card, .app-story, .decision-card, .price, .question, .path, .mockup, .workflow-poster, .holo-console, .portfolio-card, .system-panel, .hero-showcase").forEach(function (card) {
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
    var disableHomeMobileThree = document.body.classList.contains("route-home") && window.innerWidth < 900;
    if (canvas && !reduceMotion && !disableHomeMobileThree) {
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
    description: "Owner-led website advice, premium local presence, and practical customer systems for Central QLD businesses.",
    body: `<main>
    <section class="hero hero-home">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="hero-kicker">Premium websites + practical business systems</span>
          <h1>Proper local websites that make customers trust you.</h1>
          <p class="lead">Websites, bookings, and online ordering set up properly, explained in plain English, and built around how real customers decide.</p>
          <div class="hero-wordline" aria-label="What the website helps customers do"><span>Easy to find</span><span>Easy to trust</span><span>Easy to contact</span></div>
          <div class="hero-stat-grid" aria-label="Penny Wise offer highlights">
            <div class="hero-stat"><b>Premium</b><span>the business looks properly established</span></div>
            <div class="hero-stat"><b>Owned</b><span>domain, brand, customer path</span></div>
            <div class="hero-stat"><b>Practical</b><span>bookings and orders only when useful</span></div>
          </div>
          <div class="actions">
            <a class="btn btn-primary" href="${talkUrl}">Talk to Steve</a>
            <a class="btn btn-secondary" href="/pricing">See packages</a>
          </div>
          <p class="home-mobile-reassurance">Bring the hearsay, doubts, and half-advice. Steve will help sort what matters, what can wait, and what is worth building properly.</p>
          <div class="clarity-note"><b>Built for Central QLD small businesses, not anonymous templates.</b><span>Bring the Facebook advice, Shopify pressure, Google-listing myths, and weekly-menu worries. Steve will sort what matters before you spend.</span></div>
        </div>
        <div class="poster-board" aria-label="Penny Wise premium website preview">
          <div class="hero-showcase">
            <video class="hero-visual-video" muted loop playsinline autoplay preload="metadata" poster="/visuals/hero-local-business-devices.png" aria-hidden="true">
              <source src="/video/hero-local-business-devices-loop.mp4" type="video/mp4">
            </video>
            <img class="hero-visual-image" src="/visuals/hero-local-business-devices.png" width="1680" height="945" alt="Premium local business website, phone ordering, and tablet orders preview on a warm cafe counter" fetchpriority="high" decoding="async">
            <span class="visual-sheen" aria-hidden="true"></span>
            <div class="hero-mini-card"><b>Before they call</b><p>Customers check photos, proof, menu, hours, prices, and whether the business feels real.</p></div>
            <div class="hero-mini-card alt"><b>Give them something solid.</b><p>One proper place to trust, compare, and take the next step.</p></div>
            <div class="hero-device" aria-hidden="true">
              <div class="device-screen">
                <div><strong>Customer path</strong><b>Book, order, quote, or call.</b></div>
                <div class="screen-lines"><span></span><span></span><span></span></div>
                <span class="screen-button">Next step ready</span>
              </div>
            </div>
            <div class="hero-visual-caption"><b>Not a blank brochure</b><span>Customers get proof, answers, and a clear next step before they call.</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="decision-band">
      <div class="container">
        <div class="offer-head">
          <h2>Choose the starting point that sounds like you.</h2>
          <p>One clear decision first. The product names can come after the business problem is understood.</p>
        </div>
        <div class="situation-grid">
          ${situations.map(([title, heading, text, cta, href], index) => `<a class="situation-card" href="${href}"><span class="situation-number">0${index + 1}</span><h3>${title}</h3><p><b>${heading}</b></p><p>${text}</p><span>${cta}</span></a>`).join("")}
        </div>
      </div>
    </section>

    <section class="logo-strip" aria-label="Business categories Penny Wise can support">
      <div class="container">
        <strong>Built for practical local operators</strong>
        <div class="logo-cloud">
          <div class="logo-track">
            ${[...proofLogos, ...proofLogos].map((item) => `<span class="logo-pill">${item}</span>`).join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="premium-examples">
      <div class="container">
        <div class="section-header"><h2>Make the business feel established before the first conversation.</h2><p>Good design is not decoration. It is the difference between a customer feeling unsure and feeling ready to enquire, book, order, or compare you properly.</p></div>
        <div class="portfolio-grid">
          ${portfolioPreviews.map(([title, category, text, label]) => `<article class="portfolio-card"><strong>${category}</strong><h3>${title}</h3><p>${text}</p><span>${label}</span></article>`).join("")}
        </div>
      </div>
    </section>

    <section class="booking-feature">
      <div class="container booking-grid">
        <figure class="booking-image">
          <img src="/visuals/hero-local-business-devices.png" width="1680" height="945" alt="Local food website and ordering tools shown across laptop, phone, and tablet" loading="lazy" decoding="async">
          <figcaption>New order received - from a customer who checked properly first.</figcaption>
        </figure>
        <div class="booking-copy">
          <span class="scene-label">Bookings & simple systems</span>
          <h2>Take bookings, take orders, look professional.</h2>
          <p>Replace messy messages with clear paths that help customers make the next step: book, order, ask for a quote, or call with confidence.</p>
          <ul class="feature-list">
            <li>Online bookings with reminders</li>
            <li>Online ordering and pickup windows</li>
            <li>Live availability and capacity control</li>
            <li>Customer updates and follow-ups</li>
          </ul>
          <a class="btn btn-primary" href="/apps">See how it works</a>
        </div>
      </div>
    </section>

    <section class="case-band">
      <div class="container case-story">
        <div class="case-visual" aria-label="Premium website decision path example"></div>
        <div class="case-copy">
          <span class="scene-label">Example build logic</span>
          <h2>Start with the customer decision, not the software.</h2>
          <p>A weekly-menu food business does not need a bloated system on day one. It needs the current menu, location, hours, proof, a clean update path, and a way for people to take the next step without digging through old posts.</p>
          <div class="case-points">
            <article class="case-point"><strong>Problem</strong><p>Customers see old Facebook posts and ask the same menu questions.</p></article>
            <article class="case-point"><strong>Decision</strong><p>Build the credible front door first. Add ordering only if demand proves it.</p></article>
            <article class="case-point"><strong>Outcome</strong><p>Clear menu, photos, Google/Facebook links, enquiry path, and upgrade room.</p></article>
          </div>
        </div>
      </div>
    </section>

    <section class="systems-showcase">
      <div class="container systems-layout">
        <div>
          <span class="scene-label">Bookings, orders, enquiries, follow-up</span>
          <h2>Add the useful systems after the website earns them.</h2>
          <p class="section-lead">This is where Penny Wise should feel different from a cheap AI website. Start with credibility, then add the customer flow that saves time, keeps the brand yours, or makes buying easier.</p>
          <div class="system-list">
            ${appPlatforms.slice(0, 4).map(([name, text]) => `<a href="/apps"><span><b>${name}</b>${text}</span><i>View</i></a>`).join("")}
          </div>
        </div>
        <div class="system-panel" aria-label="Website systems and booking tools preview"></div>
      </div>
    </section>

    <section class="quiet-band advice-band">
      <div class="container advice-feature">
        <div>
          <span class="scene-label">Steve filters the noise</span>
          <h2>Premium means clear advice, not unnecessary complexity.</h2>
          <p class="section-lead">Most small business owners do not need more tech noise. They need someone to translate the mess: what customers need to see, what should be online, what can wait, and what is worth paying for.</p>
          <div class="testimonial-grid">${testimonials.map(([quote, source]) => `<article class="testimonial-card"><strong>${source}</strong><p>&ldquo;${quote}&rdquo;</p></article>`).join("")}</div>
        </div>
        <div class="advice-card" aria-label="Steve filters website advice before a business spends"></div>
      </div>
    </section>

    <section class="quiet-band myth-band">
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
    ${ctaBand({ title: "Show Steve what you are trying to fix.", text: "Send the current website, Facebook page, Google listing, Shopify idea, or business problem. The answer may be a website, a workflow, or nothing bigger yet.", primary: "Ask Steve what fits", secondary: "Start a website draft", primaryHref: talkUrl, secondaryHref: builderUrl })}
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

async function copyVisual(sourceName, targetPath = `visuals/${sourceName}`) {
  const file = join(dist, targetPath);
  await mkdir(dirname(file), { recursive: true });
  await copyFile(join(visualsDir, sourceName), file);
}

async function copyVideo(sourceName, targetPath = `video/${sourceName}`) {
  const file = join(dist, targetPath);
  await mkdir(dirname(file), { recursive: true });
  await copyFile(join(videoDir, sourceName), file);
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
await copyVisual("premium-site-stack.svg");
await copyVisual("local-proof-board.svg");
await copyVisual("higgsfield-premium-hero.png");
await copyVisual("hero-local-business-devices.png");
await copyVideo("hero-local-business-devices-loop.mp4");
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
