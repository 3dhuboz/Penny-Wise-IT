// Shared layout for all showcase pages — head, header, footer, scripts.
// Per-page bodies (in pages.ts) supply just the inner <main> markup.
//
// Renders a full HTML document. Boolean flags let pages opt into:
//   - includeProductSchema: 9 Product nodes JSON-LD (only on /apps + /pricing)
//   - includeCounters: counter-animation script (numbers + home strip)
//   - includeRoiForm: range-output sync + ROI calc script (ROI page only)

export type PageId =
  | 'home'
  | 'apps'
  | 'numbers'
  | 'roi'
  | 'pricing'
  | 'about'
  | 'faq'
  | '404';

export interface RenderLayoutOptions {
  page: PageId;
  /** Full <title> contents (overrides default site title). */
  title: string;
  /** <meta name="description"> + og:description + twitter:description. */
  description: string;
  /** og:title + twitter:title. Defaults to `title`. */
  socialTitle?: string;
  /** Path-and-search part of canonical URL, e.g. "/apps". */
  pathname: string;
  /** Inner HTML of <main>. */
  body: string;
  /** Include 9-Product JSON-LD graph. Default false (Organization always included). */
  includeProductSchema?: boolean;
  /** Include the counter-animation script. */
  includeCounters?: boolean;
  /** Include range-output + ROI calculator scripts. */
  includeRoiForm?: boolean;
}

const SITE_ORIGIN = 'https://www.pennywiseit.com.au';
const OG_IMAGE = `${SITE_ORIGIN}/og.png`;

const NAV_LINKS: ReadonlyArray<{ href: string; label: string; page: PageId }> = [
  { href: '/apps', label: 'Apps', page: 'apps' },
  { href: '/numbers', label: 'Numbers', page: 'numbers' },
  { href: '/roi', label: 'ROI', page: 'roi' },
  { href: '/pricing', label: 'Pricing', page: 'pricing' },
  { href: '/about', label: 'About', page: 'about' },
  { href: '/faq', label: 'FAQ', page: 'faq' },
];

const ORGANIZATION_LD = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "${SITE_ORIGIN}/#organization",
    "name": "Penny Wise I.T",
    "alternateName": "Penny Wise I.T",
    "url": "${SITE_ORIGIN}/",
    "logo": "${SITE_ORIGIN}/icons/icon-512.png",
    "description": "Custom whitelabel app development and IT consulting for Australian small businesses",
    "email": "hello@pennywiseit.com.au",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AU",
      "addressRegion": "QLD",
      "addressLocality": "Queensland"
    },
    "founder": { "@type": "Person", "name": "Steve" },
    "sameAs": [
      "https://facebook.com/pennywiseit",
      "https://linkedin.com/company/pennywiseit"
    ]
  }
  </script>`;

const PRODUCT_GRAPH_LD = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Product", "@id": "${SITE_ORIGIN}/#product-food-truck", "name": "Food-Truck App", "description": "Live online ordering platform for food trucks with SMS updates, QR menus, and pickup alerts", "brand": { "@id": "${SITE_ORIGIN}/#organization" }, "category": "Food & Hospitality Software", "url": "${SITE_ORIGIN}/#product-food-truck" },
      { "@type": "Product", "@id": "${SITE_ORIGIN}/#product-tradie", "name": "Tradie Field Service", "description": "Field service management platform for tradies with online booking, rego lookup, and video wrap-ups", "brand": { "@id": "${SITE_ORIGIN}/#organization" }, "category": "Field Service Software", "url": "${SITE_ORIGIN}/#product-tradie" },
      { "@type": "Product", "@id": "${SITE_ORIGIN}/#product-online-store", "name": "Online Store", "description": "Custom branded online store with Stripe checkout and zero platform fees", "brand": { "@id": "${SITE_ORIGIN}/#organization" }, "category": "E-commerce Software", "url": "${SITE_ORIGIN}/#product-online-store" },
      { "@type": "Product", "@id": "${SITE_ORIGIN}/#product-ai-social", "name": "AI Social Platform", "description": "Private community platform with AI moderation and creator monetisation", "brand": { "@id": "${SITE_ORIGIN}/#organization" }, "category": "Community Software", "url": "${SITE_ORIGIN}/#product-ai-social" },
      { "@type": "Product", "@id": "${SITE_ORIGIN}/#product-festival", "name": "Festival & Event App", "description": "Event management platform with ticketing, live schedule, and QR gate scanning", "brand": { "@id": "${SITE_ORIGIN}/#organization" }, "category": "Event Management Software", "url": "${SITE_ORIGIN}/#product-festival" },
      { "@type": "Product", "@id": "${SITE_ORIGIN}/#product-delivery", "name": "Delivery & Logistics", "description": "Delivery management platform with live driver tracking and route optimisation", "brand": { "@id": "${SITE_ORIGIN}/#organization" }, "category": "Logistics Software", "url": "${SITE_ORIGIN}/#product-delivery" },
      { "@type": "Product", "@id": "${SITE_ORIGIN}/#product-car-hire", "name": "Car Hire & Rentals", "description": "Vehicle rental platform with date-range booking, license upload, Stripe deposits, lockbox SMS pickup, and a fleet calendar", "brand": { "@id": "${SITE_ORIGIN}/#organization" }, "category": "Vehicle Rental Software", "url": "${SITE_ORIGIN}/#product-car-hire" },
      { "@type": "Product", "@id": "${SITE_ORIGIN}/#product-butchers", "name": "Butcher Shop & Online Orders", "description": "Online ordering for butcher shops — custom-cut requests, freezer pack bundles, click & collect, local delivery, auto-stocktake", "brand": { "@id": "${SITE_ORIGIN}/#organization" }, "category": "Food Retail Software", "url": "${SITE_ORIGIN}/#product-butchers" },
      { "@type": "Product", "@id": "${SITE_ORIGIN}/#product-sports-club", "name": "Sports Club Hub", "description": "All-in-one community sports club app — fixtures, registrations, team chat, lineup tools, committee financials", "brand": { "@id": "${SITE_ORIGIN}/#organization" }, "category": "Sports Club Software", "url": "${SITE_ORIGIN}/#product-sports-club" }
    ]
  }
  </script>`;

const STYLES = `
    :root {
      --copper-hi: #E8A665;
      --copper:    #C67A3C;
      --copper-lo: #A86428;
      --copper-deep: #8B5A2B;
      --accent-ink: #1a1208;
      --bg: #0c0e15;
      --surface: #161826;
      --card: #1c1e2e;
      --border: #2a2536;
      --text: #e8edf5;
      --muted: #7a8aa8;
      --soft: #a0aec0;
      --accent: var(--copper);
      --green: #34d399;
      --yellow: #fbbf24;
      --red: #f87171;
      --purple: #a78bfa;
      --orange: #fb923c;
      --teal: #2dd4bf;
      --pink: #f472b6;
      --radius: 14px;
      --radius-lg: 18px;
      --container: 1100px;
      --display-font: "Space Grotesk", "Inter", system-ui, sans-serif;
      --body-font: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

      --grad-food-truck: linear-gradient(135deg, #f87171, #fb923c, #fbbf24);
      --grad-tradie: linear-gradient(135deg, #fbbf24, #fb923c, #f87171);
      --grad-online-store: linear-gradient(135deg, #34d399, #2dd4bf, #4f8ef7);
      --grad-festival: linear-gradient(135deg, #a78bfa, #f472b6, #f87171);
      --grad-delivery: linear-gradient(135deg, #4f8ef7, #2dd4bf, #34d399);
      --grad-ai-social: linear-gradient(135deg, #f472b6, #a78bfa, #4f8ef7);
      --grad-car-hire: linear-gradient(135deg, #0ea5e9, #06b6d4, #fbbf24);
      --grad-butchers: linear-gradient(135deg, #dc2626, #b91c1c, #d97706);
      --grad-sports-club: linear-gradient(135deg, #1e40af, #10b981, #f59e0b);
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; overflow-x: clip; }
    html { scroll-behavior: smooth; }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--body-font);
      line-height: 1.6;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(ellipse 900px 600px at 85% -5%, rgba(232,166,101,0.14), transparent 60%),
        radial-gradient(ellipse 700px 500px at 0% 40%, rgba(198,122,60,0.07), transparent 65%),
        radial-gradient(ellipse 600px 500px at 100% 90%, rgba(168,100,40,0.06), transparent 65%);
    }

    .display { font-family: var(--display-font); font-weight: 700; letter-spacing: -0.025em; line-height: 0.95; text-transform: none; }
    .kicker { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 800; }
    h1, h2, h3, h4, h5, h6 { margin: 0; }
    p { margin: 0; }

    .container { max-width: var(--container); margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 1; }
    .panel {
      background:
        linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 35%),
        linear-gradient(160deg, rgba(28,30,46,0.95), rgba(20,22,36,0.92));
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: var(--radius-lg);
      padding: 1.75rem 2rem;
      box-shadow:
        0 1px 0 rgba(255,255,255,0.04) inset,
        0 18px 40px -16px rgba(0,0,0,0.55),
        0 2px 6px rgba(0,0,0,0.35);
    }
    .pill {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.4rem 0.95rem; border-radius: 999px;
      font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em;
      background: rgba(232, 166, 101, 0.12); border: 1px solid rgba(232, 166, 101, 0.30); color: var(--copper-hi);
    }

    .sr-only-focusable { position: absolute; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden; }
    .sr-only-focusable:focus {
      position: fixed; top: 0.5rem; left: 0.5rem; width: auto; height: auto;
      padding: 0.65rem 1rem; background: var(--accent); color: #0b0f1a; font-weight: 800;
      border-radius: 8px; z-index: 9999; outline: 2px solid var(--text);
    }

    a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, summary:focus-visible {
      outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px;
    }

    .site-header {
      position: sticky; top: 0; z-index: 50;
      background: rgba(11, 15, 26, 0.78);
      backdrop-filter: blur(14px) saturate(140%);
      -webkit-backdrop-filter: blur(14px) saturate(140%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 1px 0 rgba(0,0,0,0.5);
    }
    .site-header-inner {
      max-width: var(--container); margin: 0 auto; padding: 0.85rem 1.5rem;
      display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    }
    .wordmark {
      display: inline-flex; align-items: center; gap: 0.5rem;
      font-weight: 900; font-size: 1.05rem; letter-spacing: -0.01em;
      color: var(--text); text-decoration: none;
    }
    .wordmark .wm-mark {
      width: 32px; height: 32px; display: block;
      filter: drop-shadow(0 0 12px rgba(232,166,101,0.35));
      transition: transform 0.6s cubic-bezier(.2,.7,.2,1);
      transform-style: preserve-3d;
    }
    .motion-on .wordmark:hover .wm-mark { transform: rotateY(360deg); }
    .wordmark .wm-it { color: var(--copper-hi); letter-spacing: 0.18em; margin-left: 0.15em; font-weight: 700; }

    .primary-nav { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
    .primary-nav a {
      font-size: 0.8rem; color: var(--soft); text-decoration: none;
      padding: 0.45rem 0.8rem; border-radius: 999px;
      transition: color 0.15s, background 0.15s; font-weight: 500;
    }
    .primary-nav a:hover { color: var(--text); background: rgba(255, 255, 255, 0.05); }
    .primary-nav a.is-active { color: var(--copper-hi); background: rgba(232,166,101,0.08); }

    .install-button {
      display: none; align-items: center; gap: 0.4rem;
      background: var(--accent); color: #0b0f1a; border: none;
      padding: 0.55rem 1rem; border-radius: 999px;
      font-weight: 800; font-size: 0.82rem; cursor: pointer; font-family: inherit;
      box-shadow: 0 4px 16px rgba(232, 166, 101, 0.45);
    }
    .install-button[hidden] { display: none; }

    .mobile-nav { display: none; margin-left: auto; }
    .mobile-nav summary {
      list-style: none; cursor: pointer; padding: 0.5rem 0.85rem;
      background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px; font-size: 0.85rem; font-weight: 700; color: var(--text);
    }
    .mobile-nav summary::-webkit-details-marker { display: none; }
    .mobile-nav summary::after { content: '☰'; margin-left: 0.4rem; }
    .mobile-nav[open] summary::after { content: '×'; }
    .mobile-nav-panel {
      position: absolute; right: 1rem; margin-top: 0.5rem;
      background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 0.5rem; display: flex; flex-direction: column; min-width: 200px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
    }
    .mobile-nav-panel a {
      padding: 0.65rem 0.85rem; color: var(--text); text-decoration: none;
      border-radius: 8px; font-size: 0.92rem;
    }
    .mobile-nav-panel a:hover { background: rgba(255, 255, 255, 0.05); }
    .mobile-nav-panel a.is-active { color: var(--copper-hi); background: rgba(232,166,101,0.08); }

    @media (max-width: 720px) { .primary-nav { display: none; } .mobile-nav { display: block; } }

    main { position: relative; z-index: 1; }
    section { padding: clamp(2.5rem, 5vw, 5rem) 0; }
    section + section { border-top: 0; position: relative; }
    section + section::before {
      content:''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      width: min(880px, 90%); height: 1px;
      background: linear-gradient(90deg, transparent, rgba(232,166,101,0.35), transparent);
    }

    .section-head { text-align: center; max-width: 720px; margin: 0 auto 2.5rem; }
    .section-head h1, .section-head h2 { font-size: clamp(2rem, 3.5vw, 3rem); margin: 0.75rem 0 0.6rem; }
    .section-head p { color: var(--soft); font-size: 1.05rem; }

    /* Hero */
    #hero { padding: 5rem 0 3rem; text-align: left; position: relative; isolation: isolate; }
    #hero .hero-inner { max-width: 880px; }
    #hero h1 { font-size: clamp(2.75rem, 6.5vw, 5rem); margin: 1rem 0 1.25rem; line-height: 0.92; letter-spacing: -0.025em; }
    #hero h1 .grad {
      background: linear-gradient(180deg, #F2B97B 0%, #D4923E 50%, #A86428 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block;
    }
    #hero::before {
      content: ''; position: absolute; inset: -10% -10% auto auto; width: 780px; height: 780px;
      background: radial-gradient(closest-side, rgba(232,166,101,0.28), rgba(198,122,60,0.10) 45%, transparent 70%);
      filter: blur(12px); z-index: -1; pointer-events: none;
    }
    .hero-coin {
      position: absolute; top: -40px; right: -60px; width: 380px; opacity: 0.12;
      filter: drop-shadow(0 30px 80px rgba(198,122,60,0.4));
      transform: rotate(-8deg); z-index: -1; pointer-events: none;
    }
    @media (max-width: 768px) { .hero-coin { width: 220px; right: -80px; opacity: 0.08; } #hero::before { width: 480px; height: 480px; } }
    #hero .sub { font-size: clamp(1rem, 2vw, 1.25rem); color: var(--soft); max-width: 640px; line-height: 1.55; margin-bottom: 2rem; }
    .hero-ctas { display: flex; gap: 0.6rem; flex-wrap: wrap; }

    .btn {
      display: inline-flex; align-items: center; gap: 0.45rem;
      padding: 0.85rem 1.5rem; border-radius: 999px;
      font-weight: 800; font-size: 0.95rem; text-decoration: none;
      cursor: pointer; border: none; font-family: inherit;
      transition: transform 0.1s ease;
    }
    .motion-on .btn:hover { transform: translateY(-1px); }
    .btn-primary {
      background: linear-gradient(180deg, #E8A665 0%, #C67A3C 55%, #A86428 100%);
      color: var(--accent-ink);
      box-shadow:
        0 1px 0 rgba(255,255,255,0.25) inset,
        0 8px 24px rgba(198, 122, 60, 0.40),
        0 2px 6px rgba(0, 0, 0, 0.40);
    }
    .btn-ghost { background: rgba(255, 255, 255, 0.06); color: var(--text); border: 1px solid rgba(255, 255, 255, 0.12); }

    /* Home summary tiles */
    .home-summary { padding: clamp(2rem, 4vw, 4rem) 0; }
    .home-summary-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
    @media (min-width: 720px) { .home-summary-grid { grid-template-columns: repeat(3, 1fr); } }
    .summary-tile {
      display: flex; flex-direction: column;
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 35%), linear-gradient(160deg, var(--card), var(--surface));
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 18px; padding: 1.75rem;
      text-decoration: none; color: var(--text);
      box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 40px -16px rgba(0,0,0,0.55);
      transition: transform .25s, border-color .25s;
    }
    .motion-on .summary-tile:hover { transform: translate3d(0,-3px,0); border-color: rgba(232,166,101,0.25); }
    .summary-tile-eyebrow { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700; color: var(--copper-hi); margin-bottom: 0.6rem; }
    .summary-tile h2 { font-size: 1.5rem; margin: 0 0 0.6rem; }
    .summary-tile p { color: var(--soft); font-size: 0.95rem; flex: 1; margin-bottom: 1rem; }
    .summary-tile-cta { font-size: 0.95rem; font-weight: 700; color: var(--copper-hi); }

    /* Products / bento */
    .product-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
    @media (min-width: 720px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
    .product-grid-9 { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
    @media (min-width: 720px) { .product-grid-9 { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1100px) { .product-grid-9 { grid-template-columns: repeat(3, 1fr); } }

    .product-card {
      background:
        linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 35%),
        linear-gradient(160deg, rgba(28,30,46,0.95), rgba(20,22,36,0.92));
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: var(--radius-lg);
      padding: 1.25rem 1.25rem 1.5rem;
      display: flex; flex-direction: column; gap: 0.85rem;
      position: relative; will-change: transform;
      box-shadow:
        0 1px 0 rgba(255,255,255,0.04) inset,
        0 18px 40px -16px rgba(0,0,0,0.55),
        0 2px 6px rgba(0,0,0,0.35);
      transition: transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s, border-color .35s;
    }
    .product-card::before {
      content:''; position: absolute; inset: -1px; border-radius: inherit;
      background: var(--card-grad, transparent); opacity: 0; transition: opacity 0.3s; z-index: -1;
      filter: blur(14px); pointer-events: none;
    }
    .motion-on .product-card:hover::before { opacity: 0.35; }
    .motion-on .product-card:hover {
      transform: perspective(900px) rotateX(1.5deg) rotateY(-1.5deg) translate3d(0,-3px,0);
      border-color: rgba(232,166,101,0.22);
    }
    .product-card[data-product="food-truck"] { --card-grad: var(--grad-food-truck); }
    .product-card[data-product="tradie"] { --card-grad: var(--grad-tradie); }
    .product-card[data-product="online-store"] { --card-grad: var(--grad-online-store); }
    .product-card[data-product="ai-social"] { --card-grad: var(--grad-ai-social); }
    .product-card[data-product="festival"] { --card-grad: var(--grad-festival); }
    .product-card[data-product="delivery"] { --card-grad: var(--grad-delivery); }
    .product-card[data-product="car-hire"] { --card-grad: var(--grad-car-hire); }
    .product-card[data-product="butchers"] { --card-grad: var(--grad-butchers); }
    .product-card[data-product="sports-club"] { --card-grad: var(--grad-sports-club); }

    .product-card .pc-kicker { color: var(--soft); }
    .product-card[data-product="food-truck"] .pc-kicker { color: var(--orange); }
    .product-card[data-product="tradie"] .pc-kicker { color: var(--yellow); }
    .product-card[data-product="online-store"] .pc-kicker { color: var(--green); }
    .product-card[data-product="ai-social"] .pc-kicker { color: var(--pink); }
    .product-card[data-product="festival"] .pc-kicker { color: var(--purple); }
    .product-card[data-product="delivery"] .pc-kicker { color: var(--accent); }
    .product-card[data-product="car-hire"] .pc-kicker { color: #06b6d4; }
    .product-card[data-product="butchers"] .pc-kicker { color: #dc2626; }
    .product-card[data-product="sports-club"] .pc-kicker { color: #10b981; }

    .product-card h4 { font-size: 1.125rem; font-weight: 600; font-family: var(--display-font); letter-spacing: -0.01em; }
    .product-card .pc-pitch { color: var(--soft); font-size: 0.92rem; line-height: 1.5; }

    .iframe-wrap {
      position: relative; width: 100%; aspect-ratio: 16 / 10;
      background: var(--bg); border: 1px solid var(--border);
      border-radius: var(--radius); overflow: hidden;
    }
    .product-mock { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; display: block; }
    @media (prefers-reduced-motion: reduce) { .motion-on .btn:hover { transform: none; } }

    .pc-cta {
      align-self: flex-start; color: var(--text); text-decoration: none;
      font-size: 0.9rem; font-weight: 700; padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2); transition: border-color 0.15s;
    }
    .pc-cta:hover { border-color: var(--accent); color: var(--accent); }

    /* Numbers strip */
    .numbers-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
    @media (min-width: 720px) { .numbers-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1100px) { .numbers-grid { grid-template-columns: repeat(4, 1fr); } }
    .number-tile { text-align: left; }
    .number-tile .num-value {
      font-size: clamp(2.25rem, 4vw, 3rem); line-height: 1; letter-spacing: -0.02em;
      background: linear-gradient(180deg, #F2B97B 0%, #D4923E 55%, #A86428 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
      font-feature-settings: "tnum" 1; font-weight: 600;
    }
    .number-tile .num-label { margin-top: 0.65rem; font-size: 0.8rem; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.08em; }
    .number-tile .num-sub { margin-top: 0.4rem; color: var(--muted); font-size: 0.82rem; }

    /* Calculator */
    .calc-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
    @media (min-width: 1100px) { .calc-grid { grid-template-columns: 1.1fr 1fr; } }
    .calc-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-row { display: flex; flex-direction: column; gap: 0.45rem; }
    .form-row label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
    .form-row select, .form-row input[type="text"], .form-row input[type="number"], .form-row input[type="email"] {
      background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
      padding: 0.7rem 0.9rem; color: var(--text); font-family: inherit; font-size: 0.95rem; outline: none;
    }
    .form-row select:focus, .form-row input:focus { border-color: var(--accent); }

    .range-row { display: flex; flex-direction: column; gap: 0.45rem; }
    .range-row .range-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; }
    .range-row .range-value { font-size: 1.05rem; font-feature-settings: "tnum" 1; color: var(--copper-hi); font-weight: 600; }
    .range-row input[type="range"] {
      -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
      background: var(--border); border-radius: 999px; outline: none;
    }
    .range-row input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none; width: 22px; height: 22px;
      border-radius: 50%; background: var(--accent); border: 3px solid var(--bg); cursor: pointer;
      box-shadow: 0 4px 12px rgba(232,166,101,0.5);
    }
    .range-row input[type="range"]::-moz-range-thumb {
      width: 22px; height: 22px; border-radius: 50%; background: var(--accent);
      border: 3px solid var(--bg); cursor: pointer;
    }

    .calc-output {
      background: linear-gradient(135deg, rgba(232,166,101,0.10), rgba(198,122,60,0.06));
      border: 1px solid rgba(232,166,101,0.25);
      border-radius: var(--radius-lg); padding: 1.5rem; min-height: 200px;
    }
    .calc-output .output-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: var(--copper-hi); margin-bottom: 0.75rem; }
    .calc-output .output-body { color: var(--soft); font-size: 0.95rem; line-height: 1.55; }

    /* Pricing table */
    .pricing-table { padding: 0; overflow: hidden; }
    .pricing-row { display: grid; grid-template-columns: 2fr 1.4fr 1.4fr 1fr; gap: 1.25rem; padding: 1rem 1.5rem; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .pricing-row:last-child { border-bottom: 0; }
    .pricing-row.pricing-head {
      background: rgba(255,255,255,0.02);
      font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em;
      font-weight: 700; color: var(--muted); padding: 0.85rem 1.5rem;
    }
    .pricing-row[data-product="food-truck"] .p-name { color: #f87171; }
    .pricing-row[data-product="tradie"] .p-name { color: #fbbf24; }
    .pricing-row[data-product="online-store"] .p-name { color: #34d399; }
    .pricing-row[data-product="ai-social"] .p-name { color: #f472b6; }
    .pricing-row[data-product="festival"] .p-name { color: #a78bfa; }
    .pricing-row[data-product="delivery"] .p-name { color: #4f8ef7; }
    .pricing-row[data-product="car-hire"] .p-name { color: #06b6d4; }
    .pricing-row[data-product="butchers"] .p-name { color: #dc2626; }
    .pricing-row[data-product="sports-club"] .p-name { color: #10b981; }
    .p-name { font-weight: 700; font-size: 1rem; font-family: var(--display-font); }
    .p-cat { font-size: 0.78rem; color: var(--muted); margin-top: 0.15rem; }
    .p-tier { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: var(--muted); margin-bottom: 0.15rem; }
    .p-price { display: block; font-size: 0.92rem; color: var(--text); font-weight: 600; font-feature-settings: "tnum" 1; }
    .p-demo-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; font-weight: 700; color: var(--copper-hi); text-decoration: none; white-space: nowrap; }
    .p-demo-link:hover { color: var(--text); }

    @media (max-width: 720px) {
      .pricing-row { grid-template-columns: 1fr; gap: 0.4rem; padding: 1rem; }
      .pricing-row.pricing-head { display: none; }
      .pricing-row[role="row"]:not(.pricing-head) { border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; margin-bottom: 0.75rem; }
    }

    /* About */
    .about-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; align-items: center; }
    @media (min-width: 720px) { .about-grid { grid-template-columns: 220px 1fr; } }
    .founder-medallion { width: 220px; height: 220px; display: block; filter: drop-shadow(0 12px 30px rgba(0,0,0,0.5)); }
    .about-body p { margin-bottom: 1rem; color: var(--soft); }
    .about-body p:last-child { margin-bottom: 0; }
    .about-footer { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 0.85rem; color: var(--muted); }

    /* FAQ */
    .faq-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .faq-item { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 0; }
    .faq-item summary {
      list-style: none; cursor: pointer; padding: 1rem 1.25rem;
      font-weight: 500; font-size: 1.05rem; color: var(--text);
      display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
    }
    .faq-item summary::-webkit-details-marker { display: none; }
    .faq-item summary::after { content: '+'; font-size: 1.4rem; color: var(--muted); flex-shrink: 0; transition: transform 0.2s; }
    .faq-item[open] summary::after { content: '−'; }
    .faq-item .faq-body { padding: 0 1.25rem 1.25rem; color: var(--soft); font-size: 0.95rem; line-height: 1.6; }

    /* CTA */
    #cta { text-align: center; padding: 4rem 0 5rem; }
    #cta .cta-card {
      background:
        radial-gradient(ellipse 70% 100% at 50% 0%, rgba(232,166,101,0.22), transparent 60%),
        linear-gradient(180deg, rgba(28,22,16,0.98), rgba(16,14,20,0.98));
      border: 1px solid rgba(232,166,101,0.28);
      box-shadow:
        0 1px 0 rgba(255,210,160,0.10) inset,
        0 30px 80px -30px rgba(198,122,60,0.35),
        0 10px 30px -10px rgba(0,0,0,0.6);
      position: relative; overflow: hidden; padding: 3rem 2rem;
    }
    #cta h2 { font-size: clamp(1.75rem, 4vw, 2.6rem); }
    #cta .cta-sub { max-width: 580px; margin: 1rem auto 1.75rem; color: var(--soft); font-size: 1.05rem; }
    #cta .cta-buttons { display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: center; }

    /* 404 */
    .notfound { padding: 6rem 0; text-align: center; }
    .notfound h1 { font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 1rem; }
    .notfound p { color: var(--soft); max-width: 540px; margin: 0 auto 2rem; font-size: 1.05rem; }

    /* Footer */
    .site-footer {
      background: rgba(11, 15, 26, 0.6);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 2rem 0; margin-top: 1rem;
    }
    .footer-inner {
      max-width: var(--container); margin: 0 auto; padding: 0 1.5rem;
      display: flex; justify-content: space-between; align-items: center;
      gap: 1rem; flex-wrap: wrap; font-size: 0.85rem; color: var(--muted);
    }
    .footer-links { display: flex; gap: 1.25rem; flex-wrap: wrap; }
    .footer-links a { color: var(--soft); text-decoration: none; }
    .footer-links a:hover { color: var(--text); }

    /* Motion */
    .motion-on .reveal { opacity: 0; transform: translate3d(0,16px,0); transition: opacity .6s cubic-bezier(.2,.7,.2,1), transform .6s cubic-bezier(.2,.7,.2,1); }
    .motion-on .reveal.in { opacity: 1; transform: none; }

    .motion-on #hero h1, .motion-on #hero .sub, .motion-on .hero-ctas .btn { opacity: 0; transform: translate3d(0,12px,0); animation: rise .7s cubic-bezier(.2,.7,.2,1) forwards; }
    .motion-on #hero .sub { animation-delay: .12s; }
    .motion-on .hero-ctas .btn:nth-child(1) { animation-delay: .22s; }
    .motion-on .hero-ctas .btn:nth-child(2) { animation-delay: .30s; }
    @keyframes rise { to { opacity: 1; transform: none; } }

    .btn { transition: transform .18s cubic-bezier(.2,.7,.2,1), filter .18s; position: relative; overflow: hidden; isolation: isolate; }
    .motion-on .btn:hover { transform: translate3d(0,-2px,0) scale(1.015); filter: brightness(1.06); }
    .motion-on .btn:active { transform: translate3d(0,0,0) scale(.985); transition-duration: .08s; }
    .btn-primary::after {
      content: ""; position: absolute; inset: 0; border-radius: inherit;
      background: radial-gradient(120px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.18), transparent 60%);
      opacity: 0; transition: opacity .25s; pointer-events: none;
    }
    .motion-on .btn-primary:hover::after { opacity: 1; }

    .motion-on .install-button:not([hidden]) { animation: slideIn .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes slideIn { from { opacity: 0; transform: translate3d(20px,0,0) scale(.96); } to { opacity: 1; transform: none; } }

    .faq-item summary::after { transition: transform .25s cubic-bezier(.2,.7,.2,1); }
    .faq-item[open] summary::after { transform: rotate(180deg); }
    .motion-on .faq-item[open] .faq-body { animation: faqIn .3s ease-out; }
    @keyframes faqIn { from { opacity: 0; transform: translate3d(0,-6px,0); } to { opacity: 1; transform: none; } }

    #scrollbar { position: fixed; top: 0; left: 0; right: 0; height: 2px; transform-origin: 0 50%; transform: scaleX(0); background: linear-gradient(90deg, var(--copper-hi), var(--copper)); z-index: 80; pointer-events: none; transition: transform .08s linear; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }`;

const COUNTER_SCRIPT = `
  <script>
    (function () {
      var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var nodes = document.querySelectorAll('[data-counter]');
      if (!nodes.length || !('IntersectionObserver' in window)) return;
      function animate(el) {
        var target = parseFloat(el.getAttribute('data-counter')) || 0;
        var suffix = el.getAttribute('data-counter-suffix') || '';
        if (prefersReduced) { el.textContent = target + suffix; return; }
        var start = performance.now();
        var dur = 1100;
        function tick(now) {
          var t = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !e.target.dataset.counted) {
            e.target.dataset.counted = '1';
            animate(e.target);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      nodes.forEach(function (n) { io.observe(n); });
    })();
  </script>`;

const ROI_SCRIPT = `
  <script>
    (function () {
      function bind(rangeId, outId) {
        var r = document.getElementById(rangeId);
        var o = document.getElementById(outId);
        if (!r || !o) return;
        var update = function () { o.textContent = r.value; };
        r.addEventListener('input', update);
        update();
      }
      bind('roi-customers', 'roi-customers-value');
      bind('roi-admin', 'roi-admin-value');
    })();
  </script>
  <script>
    (function () {
      var pricing = {
        'food-truck':   { monthly: 79,  setup: 499 },
        'tradie':       { monthly: 99,  setup: 499 },
        'online-store': { monthly: 79,  setup: 499 },
        'festival':     { monthly: 199, setup: 999 },
        'delivery':     { monthly: 149, setup: 799 },
        'ai-social':    { monthly: 99,  setup: 799 },
        'car-hire':     { monthly: 129, setup: 499 },
        'butchers':     { monthly: 99,  setup: 499 },
        'sports-club':  { monthly: 79,  setup: 999 }
      };

      var form     = document.getElementById('roi-form');
      var output   = document.getElementById('roi-output');
      var industry = document.getElementById('roi-industry');
      var customers = document.getElementById('roi-customers');
      var admin    = document.getElementById('roi-admin');

      if (!form || !output || !industry || !customers || !admin) return;

      function calculate() {
        var ind = industry.value;
        var adminHours = parseFloat(admin.value) || 0;

        if (!ind) {
          output.innerHTML = 'Select an app above to see your personalised estimate.';
          return;
        }

        var p = pricing[ind];
        if (!p) return;

        var adminSaved   = adminHours * 0.7;
        var hourlyRate   = 35;
        var weeklySaving = adminSaved * hourlyRate;
        var annualSaving = weeklySaving * 52;
        var annualCost   = p.monthly * 12 + p.setup;
        var netBenefit   = annualSaving - annualCost;

        output.innerHTML =
          '<strong>Estimated annual time saving:</strong> ~$' + weeklySaving.toFixed(0) + ' / week — $' + Math.round(annualSaving).toLocaleString() + ' / year in reclaimed hours<br><br>' +
          '<strong>First-year platform cost:</strong> $' + annualCost.toLocaleString() + ' (including setup)<br><br>' +
          '<strong>Net benefit year one:</strong> $' + Math.round(netBenefit).toLocaleString() + '<br><br>' +
          '<em>This is a rough guide. Real savings depend on your volume and existing process. Ready to chat? <a href="mailto:hello@pennywiseit.com.au?subject=ROI enquiry" style="color:var(--accent)">hello@pennywiseit.com.au</a></em>';
      }

      industry.addEventListener('change', calculate);
      customers.addEventListener('input', calculate);
      admin.addEventListener('input', calculate);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculate();
        form.dispatchEvent(new CustomEvent('roi-completed', { bubbles: true }));
      });
    })();
  </script>`;

const COMMON_SCRIPTS = `
  <script>
    (function () {
      var y = document.getElementById('footer-year');
      if (y) y.textContent = String(new Date().getFullYear());
    })();
  </script>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () { /* swallow */ });
      });
    }
  </script>
  <script>
    (function () {
      var deferred = null;
      var btn = document.querySelector('[data-install-button]');
      var form = document.getElementById('roi-form');
      function reveal() {
        if (!btn || !deferred) return;
        btn.hidden = false;
        btn.style.display = 'inline-flex';
      }
      function engaged() {
        try { localStorage.setItem('engaged', '1'); } catch (e) {}
        reveal();
      }
      window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferred = e;
        try { if (localStorage.getItem('engaged') === '1') reveal(); } catch (err) {}
      });
      if (form) {
        form.addEventListener('submit', function () { engaged(); });
        form.addEventListener('roi-completed', engaged);
      }
      if (btn) {
        btn.addEventListener('click', function () {
          if (!deferred) return;
          deferred.prompt();
          deferred.userChoice.finally(function () { deferred = null; btn.hidden = true; });
        });
      }
    })();
  </script>
  <script>
(function(){
  if(!document.documentElement.classList.contains('motion-on'))return;
  document.querySelectorAll('.btn-primary').forEach(function(b){
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();
      b.style.setProperty('--mx',(e.clientX-r.left)+'px');b.style.setProperty('--my',(e.clientY-r.top)+'px');});
  });
  var bar=document.getElementById('scrollbar'),ticking=false;
  addEventListener('scroll',function(){
    if(ticking)return;ticking=true;
    requestAnimationFrame(function(){
      var h=document.documentElement;
      bar.style.transform='scaleX('+(h.scrollTop/(h.scrollHeight-h.clientHeight)||0)+')';
      ticking=false;
    });
  },{passive:true});
})();
  </script>`;

/** Final CTA panel — same on every page (above footer). */
export const CTA_SECTION = `
    <section id="cta" aria-labelledby="cta-heading">
      <div class="container">
        <div class="panel cta-card">
          <span class="kicker" style="color: var(--orange);">LET'S BUILD</span>
          <h2 id="cta-heading" class="display">READY WHEN YOU ARE</h2>
          <p class="cta-sub">Drop me an email. Tell me your industry and the roughest idea of what you need. I'll reply within one business day with an honest assessment.</p>
          <div class="cta-buttons">
            <a href="mailto:hello@pennywiseit.com.au?subject=App enquiry" class="btn btn-primary" aria-label="Email Steve at Penny Wise I.T">
              Email Steve
            </a>
            <a href="/apps" class="btn btn-ghost" aria-label="Browse all 9 apps">
              Browse the apps
            </a>
          </div>
        </div>
      </div>
    </section>`;

function navHtml(activePage: PageId, mobile = false): string {
  const containerClass = mobile ? 'mobile-nav-panel' : 'primary-nav';
  const containerOpen = mobile
    ? `<div class="${containerClass}" role="navigation" aria-label="Mobile primary">`
    : `<nav class="${containerClass}" aria-label="Primary">`;
  const containerClose = mobile ? '</div>' : '</nav>';
  const links = NAV_LINKS.map(({ href, label, page }) => {
    const isActive = page === activePage;
    const classes = isActive ? ' class="is-active"' : '';
    const aria = isActive ? ' aria-current="page"' : '';
    return `          <a href="${href}"${classes}${aria}>${label}</a>`;
  }).join('\n');
  const mobileExtra = mobile
    ? `\n          <a href="mailto:hello@pennywiseit.com.au?subject=App enquiry">Start a project</a>`
    : '';
  return `${containerOpen}\n${links}${mobileExtra}\n        ${containerClose}`;
}

export function renderLayout(opts: RenderLayoutOptions): string {
  const {
    page,
    title,
    description,
    socialTitle = title,
    pathname,
    body,
    includeProductSchema = false,
    includeCounters = false,
    includeRoiForm = false,
  } = opts;

  const canonical = `${SITE_ORIGIN}${pathname}`;
  const productLd = includeProductSchema ? PRODUCT_GRAPH_LD : '';
  const counterScript = includeCounters ? COUNTER_SCRIPT : '';
  const roiScript = includeRoiForm ? ROI_SCRIPT : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0b0f1a">
  <meta name="color-scheme" content="dark">
  <meta name="format-detection" content="telephone=no">

  <title>${title}</title>
  <meta name="description" content="${description}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Penny Wise I.T">
  <meta property="og:title" content="${socialTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Penny Wise I.T — 9 whitelabel apps for Australian small business">
  <meta property="og:locale" content="en_AU">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${socialTitle}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <meta name="twitter:image:alt" content="Penny Wise I.T — 9 whitelabel apps for Australian small business">

  <link rel="canonical" href="${canonical}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png">
  <link rel="apple-touch-icon" href="/icons/icon-192.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Penny Wise I.T">
  <meta name="application-name" content="Penny Wise I.T">
${ORGANIZATION_LD}${productLd}
  <style>${STYLES}
  </style>
</head>
<body>
<script>
(function(){
  var r=document.documentElement;
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)r.classList.add('motion-on');
})();
</script>
<div id="scrollbar"></div>

  <a href="#main" class="sr-only-focusable">Skip to content</a>

  <header class="site-header" role="banner">
    <div class="site-header-inner">
      <a href="/" class="wordmark" aria-label="Penny Wise I.T home">
        <img src="/icon-mark.svg" alt="" class="wm-mark" width="32" height="32" aria-hidden="true">
        <span>Penny Wise <span class="wm-it">I.T</span></span>
      </a>

      ${navHtml(page, false)}

      <button
        type="button"
        class="install-button"
        data-install-button
        aria-label="Install Penny Wise I.T as an app"
        hidden
      >
        <span aria-hidden="true">⬇</span>
        <span>Install app</span>
      </button>

      <details class="mobile-nav" aria-label="Mobile navigation">
        <summary>Menu</summary>
        ${navHtml(page, true)}
      </details>
    </div>
  </header>

  <main id="main">
${body}
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div>
        <strong>Penny Wise I.T</strong> &middot;
        <span>hello@pennywiseit.com.au</span> &middot;
        <span>&copy; <span id="footer-year">2026</span> Penny Wise I.T. All rights reserved.</span>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
        <a href="mailto:hello@pennywiseit.com.au">Contact</a>
      </nav>
    </div>
  </footer>
${counterScript}${roiScript}${COMMON_SCRIPTS}

</body></html>`;
}
