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
      background: rgba(5,7,11,.70);
      border-bottom: 1px solid var(--line);
      backdrop-filter: blur(22px) saturate(1.25);
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
    }
    .btn-primary {
      border: 0;
      color: #17100a;
      background: linear-gradient(135deg, var(--copper-2), #b86e27);
      box-shadow: 0 14px 34px rgba(212,135,57,.24);
    }
    .btn-secondary { background: rgba(255,255,255,.07); color: var(--ink); }
    .btn:hover { transform: translateY(-2px); border-color: rgba(246,180,95,.46); }
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
        linear-gradient(160deg, rgba(255,255,255,.14), rgba(255,255,255,.04)),
        rgba(12,18,27,.74);
      box-shadow: 0 22px 52px rgba(0,0,0,.22);
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
      transform: translateY(-5px) rotateX(1deg);
      border-color: rgba(240,179,107,.42);
      background:
        linear-gradient(160deg, rgba(212,135,57,.16), rgba(135,183,255,.06)),
        rgba(17,20,28,.94);
      box-shadow: 0 30px 70px rgba(0,0,0,.30);
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
      background: linear-gradient(135deg, rgba(212,135,57,.18), rgba(135,183,255,.09));
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
      .container { width: min(100%, var(--max)); max-width: var(--max); margin-inline: auto; }
      .hero-grid, .hero-grid > *, h1, .lead { min-width: 0; max-width: 100%; }
      h1 { width: 100%; font-size: clamp(1.95rem, 9vw, 2.28rem); line-height: 1.04; }
      .lead { width: 100%; font-size: 1.02rem; }
      .hero { min-height: auto; padding-top: 74px; padding-bottom: 70px; }
      .actions { width: 100%; max-width: 100%; }
      .btn { width: 100%; max-width: 100%; }
      .path, .offer-card, .price, .question { padding: 22px; }
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
<body>
  <canvas class="scene-canvas" aria-hidden="true"></canvas>
  <div class="ambient" aria-hidden="true"></div>
  <div class="noise" aria-hidden="true"></div>
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
  <script>
    (function () {
      var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!window.gsap || reduceMotion) return;
      gsap.registerPlugin(window.ScrollTrigger);
      var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".site-header", { autoAlpha: 0, y: -18, duration: .55 }, 0)
        .from(".brand .mark", { scale: .82, rotate: -8, duration: .5 }, .12)
        .from("nav a", { autoAlpha: 0, y: -8, stagger: .035, duration: .38 }, .15)
        .fromTo(".hero h1", { y: 38, skewY: 1.4 }, { autoAlpha: 1, y: 0, skewY: 0, duration: .9 }, .1)
        .from(".hero .lead", { autoAlpha: 0, y: 18, duration: .62 }, .28)
        .from(".hero .actions .btn", { autoAlpha: 0, y: 14, stagger: .08, duration: .48 }, .42)
        .from(".hero .mockup", { autoAlpha: 0, y: 28, scale: .985, duration: .85 }, .34)
        .from(".hero .mock-row", { autoAlpha: 0, x: 18, stagger: .08, duration: .42 }, .58);

      ScrollTrigger.create({
        start: 12,
        end: 99999,
        toggleClass: { targets: ".site-header", className: "is-scrolled" }
      });

      gsap.utils.toArray("section:not(.hero)").forEach(function (section) {
        var targets = section.querySelectorAll(".section-header, .offer-head, h2, .section-lead, .lead, .item, .offer-card, .price, .question, .path");
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
      gsap.utils.toArray(".offer-card, .item, .price, .question, .path, .mockup").forEach(function (card) {
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
      var camera = new THREE.PerspectiveCamera(48, 1, .1, 100);
      camera.position.set(0, 0, 9);

      var group = new THREE.Group();
      scene.add(group);

      var geometry = new THREE.IcosahedronGeometry(1, 2);
      var material = new THREE.MeshStandardMaterial({
        color: 0xf0a64f,
        roughness: .42,
        metalness: .18,
        transparent: true,
        opacity: .34,
        wireframe: true
      });
      var core = new THREE.Mesh(geometry, material);
      core.scale.set(2.2, 2.2, 2.2);
      core.position.set(3.8, 1.2, -1);
      group.add(core);

      var smallMaterial = new THREE.MeshStandardMaterial({ color: 0x8fc5ff, roughness: .55, metalness: .12, transparent: true, opacity: .22, wireframe: true });
      for (var i = 0; i < 18; i += 1) {
        var mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(.18 + Math.random() * .32, 0), smallMaterial);
        mesh.position.set((Math.random() - .5) * 12, (Math.random() - .5) * 7, -2 - Math.random() * 9);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        group.add(mesh);
      }

      var particles = new THREE.BufferGeometry();
      var count = window.innerWidth < 700 ? 64 : 150;
      var positions = new Float32Array(count * 3);
      for (var p = 0; p < count; p += 1) {
        positions[p * 3] = (Math.random() - .5) * 16;
        positions[p * 3 + 1] = (Math.random() - .5) * 10;
        positions[p * 3 + 2] = -Math.random() * 13;
      }
      particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      var particleMaterial = new THREE.PointsMaterial({ color: 0xf6b45f, size: .025, transparent: true, opacity: .62 });
      var points = new THREE.Points(particles, particleMaterial);
      scene.add(points);

      scene.add(new THREE.AmbientLight(0xffffff, .8));
      var key = new THREE.DirectionalLight(0xf6b45f, 1.4);
      key.position.set(5, 3, 4);
      scene.add(key);
      var fill = new THREE.DirectionalLight(0x8fc5ff, .8);
      fill.position.set(-4, -2, 3);
      scene.add(fill);

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
            <span class="offer-link">Build an AI website</span>
          </a>
          <a class="offer-card" href="/apps">
            <div class="offer-top"><span class="offer-kicker">Whitelabel Apps</span><span class="offer-icon">APP</span></div>
            <h3>Give customers a branded way to order, book, or request work.</h3>
            <p>Practical platforms for food, trades, delivery, hire, events, clubs, and local operators.</p>
            <div class="offer-meta"><span>Your brand</span><span>Your domain</span><span>Admin tools</span></div>
            <span class="offer-link">Browse app paths</span>
          </a>
          <a class="offer-card" href="/tools">
            <div class="offer-top"><span class="offer-kicker">Self-Serve Tools</span><span class="offer-icon">AI</span></div>
            <h3>Use focused tools for the jobs owners keep putting off.</h3>
            <p>Social content, ordering, forecasting, HACCP logs, and website polish without starting from scratch.</p>
            <div class="offer-meta"><span>Simple SaaS</span><span>Local support</span><span>No bloat</span></div>
            <span class="offer-link">See the tools</span>
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
