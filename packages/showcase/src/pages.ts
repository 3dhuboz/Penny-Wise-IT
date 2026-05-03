// Per-page <main> bodies for the showcase site.
// Each function returns inner HTML that the layout wraps with chrome + footer.
// CTA panel is appended to every page so every visitor has a clear conversion path.

import { CTA_SECTION } from './layout';

const HERO_SECTION = `
    <section id="hero" aria-labelledby="hero-heading">
      <img src="/icon-mark.svg" alt="" aria-hidden="true" class="hero-coin" loading="eager" decoding="async">
      <div class="container">
        <div class="hero-inner">
          <span class="pill">🇦🇺 9 READY-TO-LAUNCH WHITELABEL APPS</span>
          <h1 id="hero-heading" class="display">
            <span class="grad">YOUR BUSINESS, AUTOMATED.</span>
          </h1>
          <p class="sub">9 production-ready whitelabel apps for Australian small businesses. Live ordering, field service, delivery, events, communities, car hire, butcher shops, sports clubs — flat monthly fee, your brand, your domain, zero platform tax.</p>
          <div class="hero-ctas">
            <a href="/apps" class="btn btn-primary" aria-label="See all 9 apps">
              See all 9 apps
            </a>
            <a href="/roi" class="btn btn-ghost" aria-label="Open the ROI calculator">
              Calculate your ROI
            </a>
          </div>
        </div>
      </div>
    </section>`;

const PRODUCTS_GRID = `
        <div class="product-grid product-grid-9">
          <article class="product-card" data-product="food-truck">
            <span class="kicker pc-kicker">FOOD-TRUCK PLATFORM</span>
            <h4>Food-Truck App</h4>
            <p class="pc-pitch">Pre-orders the moment the truck rolls in. Auto-SMS when ready.</p>
            <div class="iframe-wrap">
              <iframe class="product-mock" data-mock src="/mocks/food-truck" loading="lazy" sandbox="allow-scripts" title="Food-Truck App interactive demo" referrerpolicy="no-referrer"></iframe>
            </div>
            <a href="https://demos.pennywiseit.com.au/demo/food-truck" target="_blank" rel="noopener noreferrer" class="pc-cta" aria-label="See Food-Truck App live">Full details →</a>
          </article>

          <article class="product-card" data-product="tradie">
            <span class="kicker pc-kicker">FIELD SERVICE PLATFORM</span>
            <h4>Tradie Field Service</h4>
            <p class="pc-pitch">Online booking, deposit captured, SMS reminders. Quote-to-invoice in one app.</p>
            <div class="iframe-wrap">
              <iframe class="product-mock" data-mock src="/mocks/tradie" loading="lazy" sandbox="allow-scripts" title="Tradie Field Service interactive demo" referrerpolicy="no-referrer"></iframe>
            </div>
            <a href="https://demos.pennywiseit.com.au/demo/tradie" target="_blank" rel="noopener noreferrer" class="pc-cta" aria-label="See Tradie Field Service live">Full details →</a>
          </article>

          <article class="product-card" data-product="online-store">
            <span class="kicker pc-kicker">ONLINE STORE PLATFORM</span>
            <h4>Online Store</h4>
            <p class="pc-pitch">Stripe direct, no Shopify tax. Your domain, your customer list, your data.</p>
            <div class="iframe-wrap">
              <iframe class="product-mock" data-mock src="/mocks/online-store" loading="lazy" sandbox="allow-scripts" title="Online Store interactive demo" referrerpolicy="no-referrer"></iframe>
            </div>
            <a href="https://demos.pennywiseit.com.au/demo/online-store" target="_blank" rel="noopener noreferrer" class="pc-cta" aria-label="See Online Store live">Full details →</a>
          </article>

          <article class="product-card" data-product="ai-social">
            <span class="kicker pc-kicker">COMMUNITY PLATFORM</span>
            <h4>AI Social Platform</h4>
            <p class="pc-pitch">Private community on your domain. AI moderates spam while you sleep.</p>
            <div class="iframe-wrap">
              <iframe class="product-mock" data-mock src="/mocks/ai-social" loading="lazy" sandbox="allow-scripts" title="AI Social Platform interactive demo" referrerpolicy="no-referrer"></iframe>
            </div>
            <a href="https://demos.pennywiseit.com.au/demo/ai-social" target="_blank" rel="noopener noreferrer" class="pc-cta" aria-label="See AI Social Platform live">Full details →</a>
          </article>

          <article class="product-card" data-product="festival">
            <span class="kicker pc-kicker">EVENT PLATFORM</span>
            <h4>Festival & Event App</h4>
            <p class="pc-pitch">Tickets, schedule, QR scan, push alerts — all under your branding.</p>
            <div class="iframe-wrap">
              <iframe class="product-mock" data-mock src="/mocks/festival" loading="lazy" sandbox="allow-scripts" title="Festival & Event App interactive demo" referrerpolicy="no-referrer"></iframe>
            </div>
            <a href="https://demos.pennywiseit.com.au/demo/festival" target="_blank" rel="noopener noreferrer" class="pc-cta" aria-label="See Festival & Event App live">Full details →</a>
          </article>

          <article class="product-card" data-product="delivery">
            <span class="kicker pc-kicker">DELIVERY PLATFORM</span>
            <h4>Delivery & Logistics</h4>
            <p class="pc-pitch">Live driver tracking + auto-routing. Customers stop ringing 'where's my order?'.</p>
            <div class="iframe-wrap">
              <iframe class="product-mock" data-mock src="/mocks/delivery" loading="lazy" sandbox="allow-scripts" title="Delivery & Logistics interactive demo" referrerpolicy="no-referrer"></iframe>
            </div>
            <a href="https://demos.pennywiseit.com.au/demo/delivery" target="_blank" rel="noopener noreferrer" class="pc-cta" aria-label="See Delivery & Logistics live">Full details →</a>
          </article>

          <article class="product-card" data-product="car-hire">
            <span class="kicker pc-kicker">CAR-HIRE PLATFORM</span>
            <h4>Car Hire & Rentals</h4>
            <p class="pc-pitch">Date-range booking, license upload, lockbox SMS pickup. Flat-fee, no Turo cut.</p>
            <div class="iframe-wrap">
              <iframe class="product-mock" data-mock src="/mocks/car-hire" loading="lazy" sandbox="allow-scripts" title="Car Hire & Rentals interactive demo" referrerpolicy="no-referrer"></iframe>
            </div>
            <a href="https://demos.pennywiseit.com.au/demo/car-hire" target="_blank" rel="noopener noreferrer" class="pc-cta" aria-label="See Car Hire & Rentals live">Full details →</a>
          </article>

          <article class="product-card" data-product="butchers">
            <span class="kicker pc-kicker">BUTCHER SHOP PLATFORM</span>
            <h4>Butcher Shop & Online Orders</h4>
            <p class="pc-pitch">Custom cuts, freezer packs, click & collect — Sunday phone calls go to zero.</p>
            <div class="iframe-wrap">
              <iframe class="product-mock" data-mock src="/mocks/butchers" loading="lazy" sandbox="allow-scripts" title="Butcher Shop & Online Orders interactive demo" referrerpolicy="no-referrer"></iframe>
            </div>
            <a href="https://demos.pennywiseit.com.au/demo/butchers" target="_blank" rel="noopener noreferrer" class="pc-cta" aria-label="See Butcher Shop & Online Orders live">Full details →</a>
          </article>

          <article class="product-card" data-product="sports-club">
            <span class="kicker pc-kicker">SPORTS CLUB PLATFORM</span>
            <h4>Sports Club Hub</h4>
            <p class="pc-pitch">Player + parent + coach + admin portals. Fixtures, fees, and chat in one app.</p>
            <div class="iframe-wrap">
              <iframe class="product-mock" data-mock src="/mocks/sports-club" loading="lazy" sandbox="allow-scripts" title="Sports Club Hub interactive demo" referrerpolicy="no-referrer"></iframe>
            </div>
            <a href="https://demos.pennywiseit.com.au/demo/sports-club" target="_blank" rel="noopener noreferrer" class="pc-cta" aria-label="See Sports Club Hub live">Full details →</a>
          </article>
        </div>`;

const NUMBERS_TILES = `
        <div class="numbers-grid">
          <div class="panel number-tile">
            <div class="num-value display" data-counter="62" data-counter-suffix=" hrs">~62 hrs</div>
            <div class="num-label">Admin hours saved per week</div>
            <div class="num-sub">Across ordering, bookings, tracking, and delivery admin</div>
          </div>
          <div class="panel number-tile">
            <div class="num-value display" data-counter="0" data-counter-suffix="%">0%</div>
            <div class="num-label">Platform percentage</div>
            <div class="num-sub">Stripe's processing fee is the only cut. We take nothing.</div>
          </div>
          <div class="panel number-tile">
            <div class="num-value display" data-counter="100" data-counter-suffix="%">100%</div>
            <div class="num-label">Your brand, your data</div>
            <div class="num-sub">Every app runs under your domain. Customer list is yours forever.</div>
          </div>
          <div class="panel number-tile">
            <div class="num-value display">∞</div>
            <div class="num-label">Clients you can take on</div>
            <div class="num-sub">These are whitelabel — we white-glove any industry, any business.</div>
          </div>
        </div>`;

const ROI_FORM = `
        <form class="panel" id="roi-form" data-engagement="roi-completed" aria-labelledby="roi-heading" novalidate>
          <div class="calc-grid">
            <div class="calc-form">
              <div class="form-row">
                <label for="roi-industry">Which app fits your business?</label>
                <select id="roi-industry" name="industry" required>
                  <option value="">Select an app…</option>
                  <option value="food-truck">Food-Truck App</option>
                  <option value="tradie">Tradie Field Service</option>
                  <option value="online-store">Online Store</option>
                  <option value="festival">Festival & Event App</option>
                  <option value="delivery">Delivery & Logistics</option>
                  <option value="ai-social">AI Social Platform</option>
                  <option value="car-hire">Car Hire & Rentals</option>
                  <option value="butchers">Butcher Shop & Online Orders</option>
                  <option value="sports-club">Sports Club Hub</option>
                </select>
              </div>

              <div class="form-row range-row">
                <div class="range-head">
                  <label for="roi-customers">Customers / transactions per month</label>
                  <span class="range-value" id="roi-customers-value" aria-live="polite">300</span>
                </div>
                <input type="range" id="roi-customers" name="customers" min="10" max="2000" step="10" value="300" aria-describedby="roi-customers-help">
                <small id="roi-customers-help" style="color:var(--muted);font-size:0.78rem">Orders, bookings, deliveries, or members</small>
              </div>

              <div class="form-row range-row">
                <div class="range-head">
                  <label for="roi-admin">Hours spent on admin per week</label>
                  <span class="range-value" id="roi-admin-value" aria-live="polite">15</span>
                </div>
                <input type="range" id="roi-admin" name="admin_hours" min="0" max="40" step="1" value="15" aria-describedby="roi-admin-help">
                <small id="roi-admin-help" style="color:var(--muted);font-size:0.78rem">Phone calls, paper, scheduling, reconciliation</small>
              </div>

              <button type="submit" id="roi-submit" class="btn btn-primary" style="align-self:flex-start">
                Calculate my savings
              </button>
            </div>

            <div class="calc-output" aria-live="polite" aria-atomic="true">
              <div class="output-label">YOUR ESTIMATE</div>
              <div class="output-body" id="roi-output">
                Select an app above to see your personalised estimate.
              </div>
            </div>
          </div>
        </form>`;

const PRICING_TABLE = `
        <div class="pricing-table panel" role="table" aria-label="Pricing for all 9 whitelabel apps">
          <div class="pricing-row pricing-head" role="row">
            <div role="columnheader">App</div>
            <div role="columnheader">Entry tier</div>
            <div role="columnheader">Top tier</div>
            <div role="columnheader" class="pricing-cta-col">Demo</div>
          </div>

          <div class="pricing-row" role="row" data-product="food-truck">
            <div role="cell"><div class="p-name">Food-Truck App</div><div class="p-cat">For markets, pop-ups, mobile vans</div></div>
            <div role="cell"><span class="p-tier">Single Van</span><span class="p-price">$79/mo + $499 setup</span></div>
            <div role="cell"><span class="p-tier">Fleet/Franchise</span><span class="p-price">$159/mo + $499 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/food-truck" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a></div>
          </div>

          <div class="pricing-row" role="row" data-product="tradie">
            <div role="cell"><div class="p-name">Tradie Field Service</div><div class="p-cat">For mechanics, sparkies, plumbers, mobile trades</div></div>
            <div role="cell"><span class="p-tier">Solo Workshop</span><span class="p-price">$99/mo + $499 setup</span></div>
            <div role="cell"><span class="p-tier">Multi-Bay/Fleet</span><span class="p-price">$199/mo + $499 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/tradie" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a></div>
          </div>

          <div class="pricing-row" role="row" data-product="online-store">
            <div role="cell"><div class="p-name">Online Store</div><div class="p-cat">For makers, retailers, direct-to-consumer brands</div></div>
            <div role="cell"><span class="p-tier">Starter Store</span><span class="p-price">$79/mo + $499 setup</span></div>
            <div role="cell"><span class="p-tier">Growing Brand</span><span class="p-price">$149/mo + $499 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/online-store" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a></div>
          </div>

          <div class="pricing-row" role="row" data-product="ai-social">
            <div role="cell"><div class="p-name">AI Social Platform</div><div class="p-cat">For clubs, creators, private communities</div></div>
            <div role="cell"><span class="p-tier">Starter Community</span><span class="p-price">$99/mo + $799 setup</span></div>
            <div role="cell"><span class="p-tier">Creator-Backed</span><span class="p-price">$249/mo + $799 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/ai-social" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a></div>
          </div>

          <div class="pricing-row" role="row" data-product="festival">
            <div role="cell"><div class="p-name">Festival & Event App</div><div class="p-cat">For festivals, conferences, multi-day events</div></div>
            <div role="cell"><span class="p-tier">Single Event</span><span class="p-price">$199/mo + $999 setup</span></div>
            <div role="cell"><span class="p-tier">Festival/Multi-Event</span><span class="p-price">$399/mo + $999 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/festival" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a></div>
          </div>

          <div class="pricing-row" role="row" data-product="delivery">
            <div role="cell"><div class="p-name">Delivery & Logistics</div><div class="p-cat">For couriers, last-mile, multi-truck fleets</div></div>
            <div role="cell"><span class="p-tier">Solo / Fleet-of-2</span><span class="p-price">$149/mo + $799 setup</span></div>
            <div role="cell"><span class="p-tier">Multi-Truck/Logistics</span><span class="p-price">$349/mo + $799 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/delivery" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a></div>
          </div>

          <div class="pricing-row" role="row" data-product="car-hire">
            <div role="cell"><div class="p-name">Car Hire & Rentals</div><div class="p-cat">For rental yards, fleet hire, equipment rental</div></div>
            <div role="cell"><span class="p-tier">Solo Yard</span><span class="p-price">$129/mo + $499 setup</span></div>
            <div role="cell"><span class="p-tier">Fleet (10+ vehicles)</span><span class="p-price">$269/mo + $499 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/car-hire" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a></div>
          </div>

          <div class="pricing-row" role="row" data-product="butchers">
            <div role="cell"><div class="p-name">Butcher Shop & Online Orders</div><div class="p-cat">For butchers, smallgoods, farm-direct meat</div></div>
            <div role="cell"><span class="p-tier">Single Shop</span><span class="p-price">$99/mo + $499 setup</span></div>
            <div role="cell"><span class="p-tier">Multi-Shop/Wholesale</span><span class="p-price">$199/mo + $499 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/butchers" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a></div>
          </div>

          <div class="pricing-row" role="row" data-product="sports-club">
            <div role="cell"><div class="p-name">Sports Club Hub</div><div class="p-cat">For junior + senior clubs, federations</div></div>
            <div role="cell"><span class="p-tier">Junior Club (≤200)</span><span class="p-price">$79/mo + $999 setup</span></div>
            <div role="cell"><span class="p-tier">Senior + Junior</span><span class="p-price">$199/mo + $999 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/sports-club" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a></div>
          </div>
        </div>`;

const ABOUT_PANEL = `
        <div class="panel">
          <div class="about-grid">
            <svg class="founder-medallion" viewBox="0 0 220 220" width="220" height="220" aria-label="Steve, founder">
              <defs><radialGradient id="med" cx="35%" cy="30%">
                <stop offset="0" stop-color="#E8A665"/>
                <stop offset=".6" stop-color="#C67A3C"/>
                <stop offset="1" stop-color="#8B5A2B"/>
              </radialGradient></defs>
              <circle cx="110" cy="110" r="104" fill="url(#med)"/>
              <circle cx="110" cy="110" r="104" fill="none" stroke="#1A1A28" stroke-width="3"/>
              <circle cx="110" cy="110" r="92" fill="none" stroke="#1A1A28" stroke-opacity=".25" stroke-dasharray="2 4"/>
              <text x="110" y="138" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="100" fill="#1A1A28">S</text>
            </svg>
            <div class="about-body">
              <p>I'm Steve, an Australian full-stack developer and IT consultant based in Queensland. I started Penny Wise I.T after watching small business owners get locked into expensive SaaS subscriptions they barely used — paying $200-$500/month for features they didn't need, on platforms they'd never own.</p>
              <p>I build every app myself — from database schema to pixel-perfect UI — and maintain them personally for each client. All 9 platforms on this page are running in production right now, for real Australian businesses. Flat monthly fee. No hidden platform cut. Your brand from day one. If something breaks at 2am, I'm the one who fixes it.</p>
              <div class="about-footer">📍 Queensland, Australia &middot; hello@pennywiseit.com.au &middot; ABN pending</div>
            </div>
          </div>
        </div>`;

const FAQ_LIST = `
        <div class="faq-list">
          <details class="faq-item">
            <summary>How quickly can I get an app live?</summary>
            <div class="faq-body">Most clients are live within 1–5 business days from the first conversation. Your branding (logo, colours, domain) takes the most time — the tech is already built and tested.</div>
          </details>
          <details class="faq-item">
            <summary>Do I own the app or am I just renting it?</summary>
            <div class="faq-body">You're on a flat monthly subscription. The platform infrastructure, updates, and hosting are included. You own your customer data, your domain, and your brand — all of it is exportable on request. Think of it like renting a shopfront: you control everything inside.</div>
          </details>
          <details class="faq-item">
            <summary>What if I want features that aren't in the standard package?</summary>
            <div class="faq-body">Custom features are quoted per-project on top of the monthly plan. Most requests are smaller than clients expect — a new report, an integration, a flow tweak. I quote honestly and build fast.</div>
          </details>
          <details class="faq-item">
            <summary>Which payment processor do you use?</summary>
            <div class="faq-body">Stripe exclusively. Stripe's Australian processing rate is 1.75% + $0.30 per transaction. That goes directly to Stripe — I take zero percentage of your revenue. You connect your own Stripe account during onboarding.</div>
          </details>
          <details class="faq-item">
            <summary>Can I see a real working demo before committing?</summary>
            <div class="faq-body">Yes — every app on this page has a live demo linked. The interactive mocks above are also running live code, not screenshots. You can also request a personalised walkthrough via email.</div>
          </details>
          <details class="faq-item">
            <summary>What's the contract length?</summary>
            <div class="faq-body">Month to month. No lock-in. Cancel any time with 30 days notice. Setup fees are non-refundable (they cover the initial build time), but monthly fees stop the day you cancel.</div>
          </details>
        </div>`;

// ─── Page bodies ──────────────────────────────────────────────────────────

export function homeBody(): string {
  return `${HERO_SECTION}

    <section class="home-summary" aria-labelledby="home-summary-heading">
      <div class="container">
        <h2 id="home-summary-heading" class="sr-only-focusable" aria-hidden="true">Quick links</h2>
        <div class="home-summary-grid">
          <a href="/apps" class="summary-tile">
            <div class="summary-tile-eyebrow">9 ready-made platforms</div>
            <h2 class="display">Browse the apps</h2>
            <p>Food trucks, tradies, online stores, festivals, delivery, car hire, butchers, sports clubs, communities. Each one production-ready.</p>
            <span class="summary-tile-cta">See all 9 →</span>
          </a>
          <a href="/pricing" class="summary-tile">
            <div class="summary-tile-eyebrow">Flat monthly fee</div>
            <h2 class="display">Pricing</h2>
            <p>From $79/mo + setup. No per-transaction tax. No platform cut. No surprises.</p>
            <span class="summary-tile-cta">See pricing →</span>
          </a>
          <a href="/roi" class="summary-tile">
            <div class="summary-tile-eyebrow">Estimate your savings</div>
            <h2 class="display">ROI calculator</h2>
            <p>Pick your industry, slide your volume. See weekly admin saved, annual revenue impact.</p>
            <span class="summary-tile-cta">Calculate →</span>
          </a>
        </div>
      </div>
    </section>

    <section id="home-numbers" aria-labelledby="home-numbers-heading">
      <div class="container">
        <div class="section-head">
          <h2 id="home-numbers-heading" class="display">By the numbers</h2>
          <p>Averaged across all 9 whitelabel platforms running in production today.</p>
        </div>${NUMBERS_TILES}
      </div>
    </section>
${CTA_SECTION}`;
}

export function appsBody(): string {
  return `
    <section id="products" aria-labelledby="apps-heading">
      <div class="container">
        <div class="section-head">
          <h1 id="apps-heading" class="display">9 apps. Pick one. Make it yours.</h1>
          <p>Each platform is production-ready and running for a real Australian business today. Hover any card for a live preview, click through to try the full demo.</p>
        </div>${PRODUCTS_GRID}
      </div>
    </section>
${CTA_SECTION}`;
}

export function numbersBody(): string {
  return `
    <section id="numbers" aria-labelledby="numbers-heading">
      <div class="container">
        <div class="section-head">
          <h1 id="numbers-heading" class="display">What it actually saves.</h1>
          <p>Averaged across all 9 whitelabel platforms running in production today.</p>
        </div>${NUMBERS_TILES}
      </div>
    </section>
${CTA_SECTION}`;
}

export function roiBody(): string {
  return `
    <section id="calculator" aria-labelledby="roi-heading">
      <div class="container">
        <div class="section-head">
          <h1 id="roi-heading" class="display">How much would this save you?</h1>
          <p>Pick your industry and roughly how busy you are. The calculator does the rest. Real numbers, no fluff.</p>
        </div>${ROI_FORM}
      </div>
    </section>
${CTA_SECTION}`;
}

export function pricingBody(): string {
  return `
    <section id="pricing" aria-labelledby="pricing-heading">
      <div class="container">
        <div class="section-head">
          <h1 id="pricing-heading" class="display">Plans that scale with you.</h1>
          <p>Flat monthly fee. No per-transaction tax. Setup once, branded for life.</p>
        </div>${PRICING_TABLE}
      </div>
    </section>
${CTA_SECTION}`;
}

export function aboutBody(): string {
  return `
    <section id="about" aria-labelledby="about-heading">
      <div class="container">
        <div class="section-head">
          <h1 id="about-heading" class="display">Who's behind this.</h1>
          <p>One developer. Eight production platforms. No agency markup.</p>
        </div>${ABOUT_PANEL}
      </div>
    </section>
${CTA_SECTION}`;
}

export function faqBody(): string {
  return `
    <section id="faq" aria-labelledby="faq-heading">
      <div class="container">
        <div class="section-head">
          <h1 id="faq-heading" class="display">Straight answers.</h1>
          <p>No sales fluff. If your question isn't here, email me and I'll answer it the same day.</p>
        </div>${FAQ_LIST}
      </div>
    </section>
${CTA_SECTION}`;
}

export function notFoundBody(): string {
  return `
    <section class="notfound" aria-labelledby="notfound-heading">
      <div class="container">
        <span class="pill">404</span>
        <h1 id="notfound-heading" class="display">Page not found.</h1>
        <p>The page you were looking for doesn't exist (or maybe it never did). Head back to the home page or browse one of the sections below.</p>
        <div class="hero-ctas" style="justify-content:center">
          <a href="/" class="btn btn-primary">Back to home</a>
          <a href="/apps" class="btn btn-ghost">Browse the apps</a>
        </div>
      </div>
    </section>
${CTA_SECTION}`;
}
