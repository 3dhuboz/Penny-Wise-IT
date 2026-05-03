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
  roiBody,
} from './pages';

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
