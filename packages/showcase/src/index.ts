// PennyWiseIT Showcase — public marketing site at pennywiseit.com.au
// Multi-page traditional website: each route renders its own HTML page sharing
// header + footer chrome from layout.ts. No client-side router.
import { Hono } from 'hono';
import { renderLayout } from './layout';
import {
  aboutBody,
  appsBody,
  faqBody,
  homeBody,
  notFoundBody,
  numbersBody,
  pricingBody,
  privacyBody,
  productPageBody,
  roiBody,
  termsBody,
} from './pages';
import type { PageId } from './layout';

type Env = {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
};

const app = new Hono<{ Bindings: Env }>();

const HTML_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

function htmlResponse(body: string, status = 200): Response {
  return new Response(body, { status, headers: HTML_HEADERS });
}

app.get('/healthz', (c) => c.json({ ok: true }));

// ─── Home ───
app.get('/', () =>
  htmlResponse(
    renderLayout({
      page: 'home',
      pathname: '/',
      title: 'Penny Wise I.T — Whitelabel Apps for Australian Small Business',
      description:
        '9 production-ready whitelabel apps for Australian small businesses. Live ordering, field service, delivery, events, communities, car hire, butcher shops, sports clubs and more. Monthly flat fee. Your brand. Your data.',
      socialTitle:
        '9 Ready-to-Launch Apps for Your Business — Penny Wise I.T',
      body: homeBody(),
      includeCounters: true,
    })
  )
);

// ─── Apps ───
app.get('/apps', () =>
  htmlResponse(
    renderLayout({
      page: 'apps',
      pathname: '/apps',
      title: 'Apps — 9 Whitelabel Platforms · Penny Wise I.T',
      description:
        'Browse all 9 production-ready whitelabel apps — built for Australian small businesses. Click any one to try a live demo.',
      body: appsBody(),
      includeProductSchema: true,
    })
  )
);

// ─── Numbers ───
app.get('/numbers', () =>
  htmlResponse(
    renderLayout({
      page: 'numbers',
      pathname: '/numbers',
      title: 'Numbers — What It Actually Saves · Penny Wise I.T',
      description:
        'Real numbers from 9 platforms in production: hours of admin saved per week, platform fees taken (zero), data ownership, and more.',
      body: numbersBody(),
      includeCounters: true,
    })
  )
);

// ─── ROI Calculator ───
app.get('/roi', () =>
  htmlResponse(
    renderLayout({
      page: 'roi',
      pathname: '/roi',
      title: 'ROI Calculator — How Much Will It Save You? · Penny Wise I.T',
      description:
        'Plug in your industry and rough volume; see your weekly admin savings, annual revenue impact, and net benefit in year one.',
      body: roiBody(),
      includeRoiForm: true,
    })
  )
);

// ─── Pricing ───
app.get('/pricing', () =>
  htmlResponse(
    renderLayout({
      page: 'pricing',
      pathname: '/pricing',
      title: 'Pricing — Plans That Scale With You · Penny Wise I.T',
      description:
        'Flat monthly fee for every whitelabel platform. No per-transaction tax. Setup once, branded for life. See all 9 apps and their tiers.',
      body: pricingBody(),
      includeProductSchema: true,
    })
  )
);

// ─── About ───
app.get('/about', () =>
  htmlResponse(
    renderLayout({
      page: 'about',
      pathname: '/about',
      title: "About — Who's Behind Penny Wise I.T",
      description:
        'Penny Wise I.T is run by Steve, a single developer building production whitelabel apps for Australian small businesses out of Queensland.',
      body: aboutBody(),
    })
  )
);

// ─── FAQ ───
app.get('/faq', () =>
  htmlResponse(
    renderLayout({
      page: 'faq',
      pathname: '/faq',
      title: 'FAQ — Straight Answers · Penny Wise I.T',
      description:
        'Common questions about Penny Wise I.T whitelabel apps: ownership, customisation, deployment timelines, payments, contracts.',
      body: faqBody(),
    })
  )
);

// ─── Privacy ───
app.get('/privacy', () =>
  htmlResponse(
    renderLayout({
      page: 'privacy',
      pathname: '/privacy',
      title: 'Privacy Policy · Penny Wise I.T',
      description:
        'How Penny Wise I.T handles your personal information — plain English, Australian Privacy Act 1988 aligned. We collect what we need to reply, store nothing we don’t use, and never sell your data.',
      body: privacyBody(),
    })
  )
);

// ─── Terms ───
app.get('/terms', () =>
  htmlResponse(
    renderLayout({
      page: 'terms',
      pathname: '/terms',
      title: 'Terms of Service · Penny Wise I.T',
      description:
        'The contract between you and Penny Wise I.T in plain English. Flat monthly fee, no lock-in, your data stays yours, 30-day setup guarantee.',
      body: termsBody(),
    })
  )
);

// ─── Vertical landing pages ───
// 9 per-product entry points for SEO + paid traffic. A tradie searching
// "tradie booking app Australia" should land on /tradies, not /apps.
// These are intentionally short and one-job-focused (~3 viewports) and do
// NOT appear in the primary nav — they're entry points only.
type VerticalRoute = {
  path: string;
  page: PageId & string;
  slug: string;
  title: string;
  description: string;
};

const VERTICAL_ROUTES: ReadonlyArray<VerticalRoute> = [
  {
    path: '/food-trucks',
    page: 'food-trucks',
    slug: 'food-trucks',
    title: 'Food Truck App for Australian food truck businesses · Penny Wise I.T',
    description:
      'A whitelabel food-truck app for Australian operators — pre-orders, auto-SMS pickup alerts, Stripe direct (no Square cut), live in a week. Your domain, your customer list.',
  },
  {
    path: '/tradies',
    page: 'tradies',
    slug: 'tradies',
    title: 'Tradie Booking App for Australian tradies · Penny Wise I.T',
    description:
      'A whitelabel field-service app for Aussie tradies — sparkies, plumbers, mechanics. Online booking, deposit capture, SMS reminders, quote-to-invoice. Live in a week.',
  },
  {
    path: '/store',
    page: 'store',
    slug: 'store',
    title: 'Online Store App for Australian small retailers · Penny Wise I.T',
    description:
      'A whitelabel online store for Australian DTC brands and small retailers. Stripe direct (no Shopify tax), built-in SMS shipping updates, customer list lives in your D1.',
  },
  {
    path: '/festivals',
    page: 'festivals',
    slug: 'festivals',
    title: 'Festival & Event App for Australian event organisers · Penny Wise I.T',
    description:
      'A whitelabel festival app for Australian event committees and councils — Stripe ticketing (no Eventbrite cut), live schedule, push alerts, QR gate scanning. Live before your next pop-up.',
  },
  {
    path: '/butchers',
    page: 'butchers',
    slug: 'butchers',
    title: 'Butcher Shop App for Australian independent butchers · Penny Wise I.T',
    description:
      'A whitelabel ordering app for Australian butchers — custom cuts with weight tolerance, freezer pack bundles, click & collect, auto-stocktake. Sunday phone calls go to zero.',
  },
  {
    path: '/sports-clubs',
    page: 'sports-clubs',
    slug: 'sports-clubs',
    title: 'Sports Club App for Australian community sports clubs · Penny Wise I.T',
    description:
      'A whitelabel sports-club app for Australian junior leagues and senior clubs. Player + parent + coach + admin portals. Fixtures, fees via Stripe, chat per team. Live before next season.',
  },
  {
    path: '/car-hire',
    page: 'car-hire',
    slug: 'car-hire',
    title: 'Car Hire App for Australian rental yards · Penny Wise I.T',
    description:
      'A whitelabel car-hire app for Australian rental yards. Date-range booking, license upload, Stripe deposits, lockbox SMS pickup. No Turo cut, no counter staff. Live in a week.',
  },
  {
    path: '/community',
    page: 'community',
    slug: 'community',
    title: 'Community App for Australian niche communities · Penny Wise I.T',
    description:
      'A whitelabel members-only community app for Australian rotary clubs, hobby groups, and creators. 100% reach, AI moderation, Stripe memberships (no Patreon cut). Live in a week.',
  },
  {
    path: '/delivery',
    page: 'delivery',
    slug: 'delivery',
    title: 'Delivery App for Australian local couriers · Penny Wise I.T',
    description:
      'A whitelabel delivery + logistics app for Australian local courier businesses. Live driver tracking, auto-route optimisation, photo + signature POD. No DoorDash 30% cut.',
  },
];

for (const r of VERTICAL_ROUTES) {
  app.get(r.path, () =>
    htmlResponse(
      renderLayout({
        page: r.page,
        pathname: r.path,
        title: r.title,
        description: r.description,
        body: productPageBody(r.slug),
      })
    )
  );
}

// ─── SEO infrastructure ───
// Sitemap + robots.txt for search-engine discovery. Defined here (not as
// static assets) so the sitemap's <lastmod> stamps refresh on every deploy.
const SITE_ORIGIN_FOR_SEO = 'https://www.pennywiseit.com.au';

type SitemapEntry = {
  path: string;
  changefreq: 'weekly' | 'monthly';
  priority: string;
};

const SITEMAP_ENTRIES: ReadonlyArray<SitemapEntry> = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  // Vertical landing pages — high SEO value, primary paid-traffic targets.
  { path: '/food-trucks', changefreq: 'monthly', priority: '0.9' },
  { path: '/tradies', changefreq: 'monthly', priority: '0.9' },
  { path: '/store', changefreq: 'monthly', priority: '0.9' },
  { path: '/festivals', changefreq: 'monthly', priority: '0.9' },
  { path: '/butchers', changefreq: 'monthly', priority: '0.9' },
  { path: '/sports-clubs', changefreq: 'monthly', priority: '0.9' },
  { path: '/car-hire', changefreq: 'monthly', priority: '0.9' },
  { path: '/community', changefreq: 'monthly', priority: '0.9' },
  { path: '/delivery', changefreq: 'monthly', priority: '0.9' },
  { path: '/pricing', changefreq: 'monthly', priority: '0.9' },
  // Marketing pages — lower priority but indexed.
  { path: '/apps', changefreq: 'monthly', priority: '0.8' },
  { path: '/roi', changefreq: 'monthly', priority: '0.8' },
  { path: '/numbers', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  // Legal pages — needed for indexability but low search intent.
  { path: '/privacy', changefreq: 'monthly', priority: '0.5' },
  { path: '/terms', changefreq: 'monthly', priority: '0.5' },
];

// Stamp lastmod at module load — refreshes on every Worker deploy.
const SITEMAP_LASTMOD = new Date().toISOString().slice(0, 10);

app.get('/sitemap.xml', () => {
  const urls = SITEMAP_ENTRIES.map(
    (e) =>
      `  <url>\n    <loc>${SITE_ORIGIN_FOR_SEO}${e.path}</loc>\n    <lastmod>${SITEMAP_LASTMOD}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
  ).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});

app.get('/robots.txt', () => {
  const body = `User-agent: *\nAllow: /\nDisallow: /healthz\n\nSitemap: ${SITE_ORIGIN_FOR_SEO}/sitemap.xml\n`;
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});

// ─── 404 ───
// Static asset routes (/manifest.json, /sw.js, /icons/*) are served by the
// [assets] binding before this handler ever runs.
app.get('*', (c) =>
  htmlResponse(
    renderLayout({
      page: '404',
      pathname: new URL(c.req.url).pathname,
      title: 'Page not found · Penny Wise I.T',
      description: "The page you're looking for doesn't exist. Browse 9 whitelabel apps for Australian small businesses.",
      body: notFoundBody(),
    }),
    404
  )
);

export default { fetch: app.fetch };
