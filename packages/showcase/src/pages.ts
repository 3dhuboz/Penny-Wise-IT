// Per-page <main> bodies for the showcase site.
// Each function returns inner HTML that the layout wraps with chrome + footer.
// CTA panel is appended to every page so every visitor has a clear conversion path.

import { ctaSection } from './layout';
import type { FaqQA, PageId } from './layout';

const HERO_SECTION = `
    <section id="hero" aria-labelledby="hero-heading">
      <img src="/icon-mark.svg" alt="" aria-hidden="true" class="hero-coin" loading="eager" decoding="async">
      <div class="container">
        <div class="hero-inner">
          <span class="pill">🇦🇺 8 whitelabel apps + 3 self-serve tools · live this week</span>
          <h1 id="hero-heading" class="display">
            <span class="grad">YOUR BUSINESS, AUTOMATED.</span>
          </h1>
          <p class="sub">8 production-ready whitelabel apps for Australian small businesses (live ordering, field service, delivery, events, car hire, butchers, sports clubs) — plus 3 self-serve tools you use directly (Social AI Studio, ChowNow, HACCP). Flat monthly fee, your brand, your domain, zero platform tax.</p>
          <div class="hero-ctas">
            <a href="/apps" class="btn btn-primary" aria-label="Find the app for my business">
              Find the app for my business
            </a>
            <button type="button" data-open-lead data-source="hero" class="btn btn-ghost" aria-label="Talk to Steve">
              Talk to Steve
            </button>
            <a href="/roi" style="margin-left:0.5rem;align-self:center;font-size:0.85rem;color:var(--copper-hi);text-decoration:none;font-weight:700">Calculate your ROI →</a>
          </div>
        </div>
      </div>
    </section>`;

const PRODUCTS_GRID = `
        <div class="product-grid product-grid-8">
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
            <div class="num-value display" data-counter="62" data-counter-suffix=" hrs" data-counter-prefix="~">~62 hrs</div>
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
              <div id="roi-post-cta" class="roi-post-cta" hidden>
                <button type="button" data-open-lead data-source="/roi" class="btn btn-primary" style="width:100%">
                  Lock this estimate — talk to Steve
                </button>
              </div>
            </div>
          </div>
        </form>`;

const PRICING_TABLE = `
        <div class="pricing-table panel" role="table" aria-label="Pricing for all 8 whitelabel apps">
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
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/food-truck" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a><br><button type="button" data-open-lead data-source="/pricing#food-truck" class="p-setup-link">Get this set up →</button></div>
          </div>

          <div class="pricing-row" role="row" data-product="tradie">
            <div role="cell"><div class="p-name">Tradie Field Service</div><div class="p-cat">For mechanics, sparkies, plumbers, mobile trades</div></div>
            <div role="cell"><span class="p-tier">Solo Workshop</span><span class="p-price">$99/mo + $499 setup</span></div>
            <div role="cell"><span class="p-tier">Multi-Bay/Fleet</span><span class="p-price">$199/mo + $499 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/tradie" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a><br><button type="button" data-open-lead data-source="/pricing#tradie" class="p-setup-link">Get this set up →</button></div>
          </div>

          <div class="pricing-row" role="row" data-product="online-store">
            <div role="cell"><div class="p-name">Online Store</div><div class="p-cat">For makers, retailers, direct-to-consumer brands</div></div>
            <div role="cell"><span class="p-tier">Starter Store</span><span class="p-price">$79/mo + $499 setup</span></div>
            <div role="cell"><span class="p-tier">Growing Brand</span><span class="p-price">$149/mo + $499 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/online-store" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a><br><button type="button" data-open-lead data-source="/pricing#online-store" class="p-setup-link">Get this set up →</button></div>
          </div>

          <div class="pricing-row" role="row" data-product="festival">
            <div role="cell"><div class="p-name">Festival & Event App</div><div class="p-cat">For festivals, conferences, multi-day events</div></div>
            <div role="cell"><span class="p-tier">Single Event</span><span class="p-price">$199/mo + $999 setup</span></div>
            <div role="cell"><span class="p-tier">Festival/Multi-Event</span><span class="p-price">$399/mo + $999 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/festival" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a><br><button type="button" data-open-lead data-source="/pricing#festival" class="p-setup-link">Get this set up →</button></div>
          </div>

          <div class="pricing-row" role="row" data-product="delivery">
            <div role="cell"><div class="p-name">Delivery & Logistics</div><div class="p-cat">For couriers, last-mile, multi-truck fleets</div></div>
            <div role="cell"><span class="p-tier">Solo / Fleet-of-2</span><span class="p-price">$149/mo + $799 setup</span></div>
            <div role="cell"><span class="p-tier">Multi-Truck/Logistics</span><span class="p-price">$349/mo + $799 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/delivery" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a><br><button type="button" data-open-lead data-source="/pricing#delivery" class="p-setup-link">Get this set up →</button></div>
          </div>

          <div class="pricing-row" role="row" data-product="car-hire">
            <div role="cell"><div class="p-name">Car Hire & Rentals</div><div class="p-cat">For rental yards, fleet hire, equipment rental</div></div>
            <div role="cell"><span class="p-tier">Solo Yard</span><span class="p-price">$129/mo + $499 setup</span></div>
            <div role="cell"><span class="p-tier">Fleet (10+ vehicles)</span><span class="p-price">$269/mo + $499 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/car-hire" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a><br><button type="button" data-open-lead data-source="/pricing#car-hire" class="p-setup-link">Get this set up →</button></div>
          </div>

          <div class="pricing-row" role="row" data-product="butchers">
            <div role="cell"><div class="p-name">Butcher Shop & Online Orders</div><div class="p-cat">For butchers, smallgoods, farm-direct meat</div></div>
            <div role="cell"><span class="p-tier">Single Shop</span><span class="p-price">$99/mo + $499 setup</span></div>
            <div role="cell"><span class="p-tier">Multi-Shop/Wholesale</span><span class="p-price">$199/mo + $499 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/butchers" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a><br><button type="button" data-open-lead data-source="/pricing#butchers" class="p-setup-link">Get this set up →</button></div>
          </div>

          <div class="pricing-row" role="row" data-product="sports-club">
            <div role="cell"><div class="p-name">Sports Club Hub</div><div class="p-cat">For junior + senior clubs, federations</div></div>
            <div role="cell"><span class="p-tier">Junior Club (≤200)</span><span class="p-price">$79/mo + $999 setup</span></div>
            <div role="cell"><span class="p-tier">Senior + Junior</span><span class="p-price">$199/mo + $999 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/sports-club" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a><br><button type="button" data-open-lead data-source="/pricing#sports-club" class="p-setup-link">Get this set up →</button></div>
          </div>
        </div>`;

const RISK_REVERSAL = `
    <section class="risk-reversal" aria-label="Risk reversal — your guarantees">
      <div class="container">
        <div class="risk-grid">
          <div class="risk-card">
            <div class="risk-eyebrow">Cancel any month</div>
            <p>Month-to-month. No lock-in. Email me one line and your monthly fee stops the day I get it.</p>
          </div>
          <div class="risk-card">
            <div class="risk-eyebrow">30-day setup guarantee</div>
            <p>Your branded app is live and working within 30 days of the setup fee clearing — or I refund the setup in full.</p>
          </div>
          <div class="risk-card">
            <div class="risk-eyebrow">You own your data</div>
            <p>Every customer record, order, photo — exportable as CSV any time, even after you cancel. No hostage data.</p>
          </div>
        </div>
      </div>
    </section>`;

const LIVE_DEPLOYMENTS = `
    <section class="live-deployments" aria-labelledby="live-deployments-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Currently live</span>
          <h2 id="live-deployments-heading" class="display">9 real businesses, every postcode in QLD.</h2>
        </div>
        <div class="deploy-grid">
          <div class="deploy-card"><div class="deploy-vertical">Food truck</div><div class="deploy-stat">~380 orders/wk</div><div class="deploy-meta">Live 6 months · Rockhampton</div></div>
          <div class="deploy-card"><div class="deploy-vertical">Tradie / electrical</div><div class="deploy-stat">$50 deposit on every booking</div><div class="deploy-meta">Live 4 months · Rockhampton</div></div>
          <div class="deploy-card"><div class="deploy-vertical">Festival</div><div class="deploy-stat">1,400 tickets sold direct</div><div class="deploy-meta">Live 1 weekend · Gladstone</div></div>
          <div class="deploy-card"><div class="deploy-vertical">Online store</div><div class="deploy-stat">$430/mo saved vs Shopify</div><div class="deploy-meta">Live 3 months · Yeppoon</div></div>
          <div class="deploy-card"><div class="deploy-vertical">Sports club</div><div class="deploy-stat">340 members migrated off Facebook</div><div class="deploy-meta">Live 2 months · Yeppoon</div></div>
          <div class="deploy-card"><div class="deploy-vertical">Car hire</div><div class="deploy-stat">Lockbox SMS pickup, no counter staff</div><div class="deploy-meta">Live 1 month · Yeppoon</div></div>
        </div>
      </div>
    </section>`;

const COMPARISON = `
    <section class="comparison" aria-labelledby="comparison-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Why not just Shopify or Square?</span>
          <h2 id="comparison-heading" class="display">Because their cut compounds. Mine doesn't.</h2>
        </div>
        <div class="compare-table">
          <div class="compare-row compare-head"><div>Platform</div><div>Their cut</div><div>Lock-in</div><div>Your data</div></div>
          <div class="compare-row"><div class="compare-name">Shopify Advanced + apps</div><div data-label="Their cut">~$430/mo at $10k MRR</div><div data-label="Lock-in">Account suspendable</div><div data-label="Your data">Theirs</div></div>
          <div class="compare-row"><div class="compare-name">Square POS</div><div data-label="Their cut">2.6% per transaction</div><div data-label="Lock-in">Hardware lock</div><div data-label="Your data">Theirs</div></div>
          <div class="compare-row"><div class="compare-name">Eventbrite</div><div data-label="Their cut">3.5% + $1.79/ticket</div><div data-label="Lock-in">Per-event fees</div><div data-label="Your data">Theirs</div></div>
          <div class="compare-row"><div class="compare-name">Patreon</div><div data-label="Their cut">8–12% of every sub</div><div data-label="Lock-in">Their domain</div><div data-label="Your data">Theirs</div></div>
          <div class="compare-row compare-us"><div class="compare-name">Penny Wise I.T</div><div data-label="Their cut">$0 — Stripe fee only</div><div data-label="Lock-in">Cancel any month</div><div data-label="Your data">Yours, exportable</div></div>
        </div>
      </div>
    </section>`;

const NUMBERS_BRIDGE = `
    <section class="numbers-bridge" aria-label="Personalise these numbers">
      <div class="container">
        <a href="/roi" class="bridge-link">
          <span>These numbers, but for your business →</span>
        </a>
      </div>
    </section>`;

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
              <p>I build every app myself — from database schema to pixel-perfect UI — and maintain them personally for each client. All 8 whitelabel platforms on this page are running in production right now, for real Australian businesses, plus the <a href="/tools/social-ai-studio">Social AI Studio</a> and <a href="/tools/chownow">ChowNow</a> SaaS tools that anyone can sign up for directly. Flat monthly fee. No hidden platform cut. Your brand from day one. If something breaks at 2am, I'm the one who fixes it — not a help desk in Manila.</p>
              <p><strong>What I run, end to end:</strong> Cloudflare Workers + D1 database in Sydney edge · Stripe for every payment · GitHub for every line of source code · Resend for transactional email. No agency, no offshore team, no contractors with the wrong incentives. One developer, accountable.</p>
              <div class="about-inline-cta">
                <button type="button" data-open-lead data-source="/about" class="btn btn-primary">Talk to Steve</button>
                <a href="/pricing" class="btn btn-ghost">See pricing</a>
              </div>
              <div class="about-footer">📍 Queensland, Australia &middot; hello@pennywiseit.com.au &middot; ABN registration in progress &mdash; full tax invoice as soon as it&rsquo;s issued</div>
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
            <summary>What's your ABN?</summary>
            <div class="faq-body">ABN registration is in progress. Until it lands, every Stripe payment generates a receipt with my legal name + business address; once the ABN is issued I'll re-issue any earlier receipts as full tax invoices automatically. Nothing's hidden — happy to share the application reference if you want to verify.</div>
          </details>
          <details class="faq-item">
            <summary>What if you get hit by a bus?</summary>
            <div class="faq-body">Every app's source code is in a private git repo I'd hand over to you on cancellation. The infrastructure (Cloudflare Workers, Stripe, your domain) is in your name from day one — not mine. If I disappear, your app keeps running and any developer can pick it up.</div>
          </details>
          <details class="faq-item">
            <summary>Can I get a tax invoice?</summary>
            <div class="faq-body">Every Stripe payment generates a detailed receipt with my legal name, business address, and your business details. Once my ABN registration completes (in progress now), every receipt becomes a fully GST-compliant tax invoice automatically — including any earlier ones, re-issued.</div>
          </details>
          <details class="faq-item">
            <summary>Where is my data hosted?</summary>
            <div class="faq-body">Cloudflare's Sydney edge for compute and Cloudflare D1 for the database. Australian Privacy Act compliant. You can export everything as CSV any time, even after you cancel.</div>
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

// FAQ_PAIRS — text MUST mirror the visible <details> blocks above exactly.
// Google's FAQPage rich-result eligibility requires schema text to match the
// rendered page; any drift gets the snippet rejected.
export const FAQ_PAIRS: FaqQA[] = [
  {
    question: 'How quickly can I get an app live?',
    answer:
      'Most clients are live within 1–5 business days from the first conversation. Your branding (logo, colours, domain) takes the most time — the tech is already built and tested.',
  },
  {
    question: "What's your ABN?",
    answer:
      "ABN registration is in progress. Until it lands, every Stripe payment generates a receipt with my legal name + business address; once the ABN is issued I'll re-issue any earlier receipts as full tax invoices automatically. Nothing's hidden — happy to share the application reference if you want to verify.",
  },
  {
    question: 'What if you get hit by a bus?',
    answer:
      "Every app's source code is in a private git repo I'd hand over to you on cancellation. The infrastructure (Cloudflare Workers, Stripe, your domain) is in your name from day one — not mine. If I disappear, your app keeps running and any developer can pick it up.",
  },
  {
    question: 'Can I get a tax invoice?',
    answer:
      'Every Stripe payment generates a detailed receipt with my legal name, business address, and your business details. Once my ABN registration completes (in progress now), every receipt becomes a fully GST-compliant tax invoice automatically — including any earlier ones, re-issued.',
  },
  {
    question: 'Where is my data hosted?',
    answer:
      "Cloudflare's Sydney edge for compute and Cloudflare D1 for the database. Australian Privacy Act compliant. You can export everything as CSV any time, even after you cancel.",
  },
  {
    question: 'Do I own the app or am I just renting it?',
    answer:
      "You're on a flat monthly subscription. The platform infrastructure, updates, and hosting are included. You own your customer data, your domain, and your brand — all of it is exportable on request. Think of it like renting a shopfront: you control everything inside.",
  },
  {
    question: "What if I want features that aren't in the standard package?",
    answer:
      'Custom features are quoted per-project on top of the monthly plan. Most requests are smaller than clients expect — a new report, an integration, a flow tweak. I quote honestly and build fast.',
  },
  {
    question: 'Which payment processor do you use?',
    answer:
      "Stripe exclusively. Stripe's Australian processing rate is 1.75% + $0.30 per transaction. That goes directly to Stripe — I take zero percentage of your revenue. You connect your own Stripe account during onboarding.",
  },
  {
    question: 'Can I see a real working demo before committing?',
    answer:
      'Yes — every app on this page has a live demo linked. The interactive mocks above are also running live code, not screenshots. You can also request a personalised walkthrough via email.',
  },
  {
    question: "What's the contract length?",
    answer:
      'Month to month. No lock-in. Cancel any time with 30 days notice. Setup fees are non-refundable (they cover the initial build time), but monthly fees stop the day you cancel.',
  },
];

// Industry-specific FAQs — keyed by canonical productId, used on each vertical
// landing page. The set mirrors the demo accordion so SEO long-tail queries
// ("does the food truck app work offline" etc.) land on a page with the
// answer + FAQPage JSON-LD. Marketing FAQ_PAIRS above covers universal Qs;
// these answer the "yeah but for MY industry" objections.
const INDUSTRY_FAQ: Record<string, FaqQA[]> = {
  'food-truck': [
    { question: 'What happens when 4G drops at a remote market?', answer: 'The app caches your menu and queues orders locally. Customers keep ordering, payments authorise once signal returns, and your kitchen screen still ticks through the queue. You won’t lose a single order or refund a hangry punter — that’s tested and working today.' },
    { question: 'My Square terminal died mid-service last weekend. What’s my fallback?', answer: 'Customers order and pay via QR code on their phone, so the EFTPOS terminal is optional. If yours fails, keep trading — Stripe handles card-on-file via the customer’s device. Cash is still tracked manually in the till. You’re not dead in the water like you were on Square.' },
    { question: 'I’m doing a 200-pax B&S catering job. How do deposits and final billing work?', answer: 'Catering quotes go out as a separate link with a 30% deposit on Stripe (you set the percentage). Balance auto-charges 24 hrs before pickup, or you invoice on the night. No platform fees on the deposit — just Stripe’s 1.7% + 30c. Cash flow stays yours.' },
    { question: 'What’s the SMS limit before I get charged extra?', answer: 'Order-confirmation SMS (one per order) is included up to 500/month — covers a busy truck doing 250 orders a service plus marketing blasts. Above that it’s 8c per SMS at cost, no markup. Most operators never hit the cap. We tell you when you’re at 80%.' },
    { question: 'When I add truck #2, do I pay double?', answer: 'No. One licence covers your business — multiple trucks share the menu, customer list, and reporting. You can route orders to "Truck A" or "Truck B" by location. Pay once, scale to four trucks before we’d even discuss tier-up. Built for growth, not punished for it.' },
  ],
  'tradie': [
    { question: 'Does it actually push to Xero or do I still copy-paste invoices?', answer: 'Real Xero sync via their API — invoices, payments, and contacts flow both ways. Mark a job complete on-site, the invoice lands in Xero before you’re back in the ute. MYOB is on the same pipe. No CSV exports, no double entry. Set it up once in onboarding.' },
    { question: 'Customer cancels the morning of the job. Do I lose my deposit?', answer: 'Your call. Default policy is deposits non-refundable inside 24 hrs, refundable with notice — you can set it tighter or looser per job type. Stripe handles the refund in two clicks if you choose to give it back. The customer agreed at booking; the audit trail’s there if they dispute.' },
    { question: 'How long do you keep my photo proof-of-completion shots?', answer: 'Seven years on Cloudflare R2 in Sydney — same retention as ATO record requirements. Tagged to the job, customer, and timestamp. Useful when a tenant claims you didn’t do the work six months later. Storage is included, not metered. You’ll have them when you need them.' },
    { question: 'I’m on my own now but might hire an apprentice. Does dispatch come standard?', answer: 'Yes. Multi-tech scheduling, drag-and-drop calendar, and per-tech job assignment are all in the base product — not a $40/month add-on like ServiceM8 charges. When you take on the apprentice, just add them as a user. No upgrade conversation needed.' },
    { question: 'Mobile signal is rubbish at half the rural sites I work on. Will the app still work?', answer: 'Job sheets, photos, signatures, and time entries all save offline and sync the moment you hit signal. You can complete a full job in a Faraday cage if you had to. Tested at properties west of Emerald with zero bars. Reliable on the worst networks Telstra offers.' },
  ],
  'online-store': [
    { question: 'I’m on Shopify with 2,000 customers and 18 months of orders. How painful is the migration?', answer: 'We import products, customers, order history, and 301-redirect your old URLs so SEO doesn’t tank. Done in 48 hrs for a store your size, and we run both stores in parallel for a week so you can verify before cutting DNS. Zero downtime, zero lost rankings.' },
    { question: 'Are AusPost shipping labels included or another bill?', answer: 'AusPost API is included — print labels straight from the order, no MyPost Business subscription needed. You pay AusPost their postage rate at cost, nothing on top from us. ParcelPoint and Sendle are also wired up. One less SaaS bill in your stack.' },
    { question: 'Can I run wholesale pricing for cafes alongside retail?', answer: 'Yes. Tag customers as wholesale, they see net prices and minimum-order-quantities at checkout. Retail customers never see the wholesale catalogue. You can also issue per-customer price lists for your bigger accounts. Both channels run on the one site, one inventory pool.' },
    { question: 'I sell at the Yeppoon markets too. Will inventory go out of sync?', answer: 'The same backend powers your market POS — sell a jar Saturday morning, online stock drops by one in real time. No "oh no I oversold" emails on Monday. If you’re on Square markets-side, we sync that too via their API. One source of truth.' },
    { question: 'What happens to the site during a Christmas sale spike?', answer: 'Cloudflare Workers infrastructure — same backbone Shopify Plus runs on for their enterprise tier. We’ve handled 400 orders/hour stress tests without breaking a sweat. No "store is down" emails on Boxing Day, no surprise overage bills. Built to handle your best day, not crumble under it.' },
  ],
  'festival': [
    { question: 'What if Summer Fest gets cancelled — cyclone, flooding, the usual?', answer: 'We trigger a one-click bulk refund through Stripe. Attendees get their money back minus the Stripe processing fee (Stripe doesn’t refund their cut on cancellations — that’s an industry standard, not us). You keep your platform fee untouched. Refund emails go out automatically with your committee’s wording.' },
    { question: 'Showgrounds 4G dies when 5,000 people show up. Will the gate scanner still work?', answer: 'Yes. The scanner app caches the full ticket list locally on each device the morning of the event. Scans queue offline and sync when signal returns. We’ve tested this at regional events where Telstra was effectively dead from 2pm onwards.' },
    { question: 'I’ve got 40-odd stallholders. How do they onboard without me holding their hand?', answer: 'Each vendor gets a self-serve link. They upload their own logo, menu, ABN and Stripe Connect details. You approve from a single dashboard. Vendor payouts go direct to their bank — you never touch their money or chase invoices.' },
    { question: 'My sponsors keep asking "did anyone actually click our banner?" Can I prove it?', answer: 'Yes. Each sponsor placement (splash, banner, schedule sidebar) tracks impressions and tap-throughs separately. You export a one-page PDF report per sponsor at end of fest. We don’t sell sponsor data anywhere — it’s yours.' },
    { question: 'Push notifications during the event — what if half don’t get through?', answer: 'We send via APNs and FCM (Apple and Google’s official channels), so delivery rate sits around 95%+ in normal conditions. If 4G is congested, the app pulls fresh announcements on next open. Critical alerts (stage changes, evacuations) are pinned in-app as a fallback.' },
  ],
  'delivery': [
    { question: 'Half my run between Rocky and Emerald has no signal. Does the driver app cope?', answer: 'Yes. The driver app stores the day’s manifest locally. Status updates (picked up, delivered, POD photos) queue offline and upload when signal returns. Live tracking pauses but resumes — customers see "last known location" rather than the dot disappearing.' },
    { question: 'A customer reckons their box never arrived but my driver has a signature. What’s the dispute flow?', answer: 'Every delivery captures GPS coordinates, timestamp, signature and POD photo, stored for 7 years (exceeds AU evidence requirements). One-click export of the full audit trail per consignment. We don’t mediate the dispute — that’s between you and the customer — but you’ll have the receipts.' },
    { question: 'Stops get added or cancelled at 11am. Can the route re-optimise mid-run?', answer: 'Yes. Dispatch can drag-drop stops or add new ones from the depot screen — the driver app updates within 30 seconds. Optimisation uses Google Maps routing (you pay the per-call cost at standard Google rates, typically $0.005 per stop, billed through us at cost).' },
    { question: 'My Tuesday produce run to Emerald is the same drops every week. Do I have to enter it manually each time?', answer: 'No. Recurring runs are templated — you set it once with stops, time windows and customer contacts, then it generates the manifest automatically each week. Driver picks it up on their app the morning of. Edits to the template flow through to future runs only.' },
    { question: 'One of my vans is in for a service Wednesday. How do I block it out without losing the bookings?', answer: 'Mark the vehicle unavailable in the dispatch calendar. The booking system stops offering that van’s capacity for the day, and existing jobs auto-flag for reassignment. Drivers get a notification on their app if their assigned vehicle changes.' },
  ],
  'butchers': [
    { question: 'Customer orders a 1.2kg ribeye. I cut it, it’s 1.38kg. What happens at checkout?', answer: 'Order is pre-authorised at quoted weight when placed. When you weigh the actual cut, you adjust in the POS — Stripe captures the new amount up to 15% above quote (legal AU pre-auth ceiling). Above 15%, customer gets a top-up SMS to approve the difference before pickup.' },
    { question: 'Friday freezer pack — customer doesn’t show by 5pm. What’s the refund position?', answer: 'Your call. The platform supports a configurable cool-room policy: you set a cutoff (e.g. "no refund after 6pm Friday, 50% credit Saturday"). Customer sees this at checkout. We don’t auto-refund cold stock — that’s your business decision, not ours.' },
    { question: 'Health inspector wants traceability records back 2 years. Can I pull them?', answer: 'Yes. Every order links the cut to supplier batch (if you tag it on intake), staff member who packed it, and timestamp. CSV export of the full log, filterable by date. Doesn’t replace your formal HACCP plan but it makes the paperwork trivial.' },
    { question: 'My scale is a 2012 Windows PC running CAS software. Will this talk to it?', answer: 'Honestly — probably not natively. Most legacy scale software is a closed loop. We integrate with modern Bluetooth scales (Brecknell, Avery) and you can manually enter weights at the counter for legacy gear. Replacing a $400 scale is usually cheaper than custom integration work.' },
    { question: 'Quarter-beast orders need a 2-week lead time. How do I stop people ordering same-day?', answer: 'Each product has a configurable lead-time field. Set "Quarter Beast" to 14 days minimum — checkout calendar greys out earlier dates automatically. Deposit-on-order with balance-on-collection is supported via Stripe’s split-charge flow.' },
  ],
  'sports-club': [
    { question: 'What happens when next year’s secretary takes over?', answer: 'All admin access transfers via the committee dashboard. The outgoing secretary nominates the incoming one, and we provide a 30-minute handover call free. Login credentials, payment routing, and member data stay with the club entity, not the individual. No platform lock-in fees if you ever leave.' },
    { question: 'Can we export player records in QRL or NRL format?', answer: 'Yes. We export to QRL Membership Online CSV and the GameDay (SportsTG) registration template. Birth certificates, parent contacts, grade history, and accident reports come through in the right columns. You can re-upload to governing-body portals without manual re-keying.' },
    { question: 'How do we handle a wash-out Saturday with 80 games to reschedule?', answer: 'One-click match cancellation pushes notifications to all rostered players, parents, and refs. Field bookings auto-release. Rescheduling drags games to a new round. Refunds for canvas fees go back via Stripe (their fees apply, not ours). Done in about three minutes.' },
    { question: 'What about split-parent payments — Mum pays half, Dad pays half?', answer: 'Each child profile supports up to four payer accounts. Parents can split any invoice — rego, jersey, tour fees — into custom shares. Both get receipts. Outstanding balances chase the named payer, not the child, so no kid gets pulled off the field.' },
    { question: 'Annual rego rollover — 300 renewals in two weeks. Will it cope?', answer: 'Yes. Bulk renewal pre-fills last year’s data per family, parents tap "confirm" on mobile, pay via Apple Pay or EFTPOS. We’ve run rollovers of 800+ in a weekend without queueing. Only Stripe processing fees apply on top of your rego pricing.' },
  ],
  'ai-social': [
    { question: 'Can we bring our Facebook group across — posts, photos, the lot?', answer: 'Member list and the last 12 months of posts, yes — we pull via Facebook’s Graph export. Older posts and comment threads beyond that aren’t accessible through Meta’s API for any tool. Photos transfer at original resolution. Allow 48 hours for a 340-member group.' },
    { question: 'What about Patreon members and their tier history?', answer: 'We import active members, their tier, join date, and lifetime spend via Patreon’s CSV export. Recurring billing moves to Stripe at your existing tier prices (Stripe fees apply). Members get a one-tap migration link and keep their badge seniority.' },
    { question: 'AI moderation flagged a legit post about engine porting — how do members appeal?', answer: 'Every auto-moderation action shows the reason and an "Appeal" button. Appeals route to your nominated human moderator (you, by default) within the app. Approved posts restore instantly with the AI flag annotated as a false positive, so the model learns your community’s context.' },
    { question: 'Is this Discord-style chat or forum-style threads?', answer: 'Forum-style threads with optional real-time chat rooms per topic. Threads stay searchable for years; chat is ephemeral. Rotary build threads work better as searchable forums — six months later, someone Googling "13B apex seal swap" finds your member’s write-up inside the app.' },
    { question: 'Are paid-member discussions hidden from Google?', answer: 'Yes. Paid-tier content sits behind authentication and carries a noindex header. It won’t appear in Google, Bing, or AI training scrapes. Free public threads are indexed by default, but you can flip any thread or whole tier to private from the admin panel.' },
  ],
  'car-hire': [
    { question: 'How is driver licence verification handled — manually by me?', answer: 'Automatic. Customers upload front and back of their licence at booking; we run it through Stripe Identity (their per-check fee passes through, around $1.50). You get a green tick or a flag before they arrive. Overseas licences and IDPs are supported.' },
    { question: 'Rental agreement and excess — does the customer sign digitally?', answer: 'Yes. The agreement generates with their booking details, excess amount, and your T&Cs pre-filled. They sign on their phone before the lockbox code releases. Signed PDFs save to the booking record for seven years, meeting ATO and insurer retention rules.' },
    { question: 'What if a customer doesn’t return the lockbox key after drop-off?', answer: 'Each booking generates a unique time-limited code that expires at scheduled return. You get an alert if the vehicle’s GPS shows it back on-yard but the key isn’t logged. Manual override resets the box. No physical key copies float around between renters.' },
    { question: 'How do I bill cleaning fees or a smoking penalty after the fact?', answer: 'Pre-rental and post-rental photos upload from your phone in 60 seconds. Damage, smoking smell, or excessive dirt trigger a post-hire charge against the saved card via Stripe, with photos attached to the customer email. Disputes route through Stripe’s standard process.' },
    { question: '3am breakdown on the Bruce Highway — who picks up?', answer: 'You nominate your roadside provider (RACQ, NRMA, or a local tow operator) at setup. The customer hits "Roadside" in the app and gets your provider’s number plus the vehicle’s rego, VIN, and live location pre-filled. We don’t run a call centre — your existing relationships handle it.' },
  ],
};

/**
 * Returns the industry FAQ pairs for a given vertical slug, or [] if none.
 * Used both to render the visible accordion in `productPageBody` and to feed
 * the layout's faqQa parameter for FAQPage JSON-LD on each vertical page.
 */
export function getIndustryFaqForVertical(slug: string): FaqQA[] {
  const c = VERTICAL_CONTENT[slug];
  if (!c) return [];
  return INDUSTRY_FAQ[c.productId] || [];
}

// ─── Page bodies ──────────────────────────────────────────────────────────

export function homeBody(): string {
  return `${HERO_SECTION}

    <section class="home-summary" aria-label="Quick links">
      <div class="container">
        <div class="home-summary-grid">
          <a href="/apps" class="summary-tile">
            <div class="summary-tile-eyebrow">8 ready-made platforms</div>
            <h2 class="display">Browse the apps</h2>
            <p>Food trucks, tradies, online stores, festivals, delivery, car hire, butchers, sports clubs, communities. Each one production-ready.</p>
            <span class="summary-tile-cta">Find mine →</span>
          </a>
          <a href="/pricing" class="summary-tile">
            <div class="summary-tile-eyebrow">Flat monthly fee</div>
            <h2 class="display">Pricing</h2>
            <p>From $79/mo + setup. No per-transaction tax. No platform cut. No surprises.</p>
            <span class="summary-tile-cta">See what I'd pay →</span>
          </a>
          <a href="/roi" class="summary-tile">
            <div class="summary-tile-eyebrow">Estimate your savings</div>
            <h2 class="display">ROI calculator</h2>
            <p>Pick your industry, slide your volume. See weekly admin saved, annual revenue impact.</p>
            <span class="summary-tile-cta">Estimate my savings →</span>
          </a>
        </div>
      </div>
    </section>
${LIVE_DEPLOYMENTS}
${COMPARISON}
    <section id="home-numbers" aria-labelledby="home-numbers-heading">
      <div class="container">
        <div class="section-head">
          <h2 id="home-numbers-heading" class="display">By the numbers</h2>
          <p>Averaged across all 8 whitelabel platforms running in production today.</p>
        </div>${NUMBERS_TILES}
      </div>
    </section>
${ctaSection('home')}`;
}

export function appsBody(): string {
  return `
    <section id="products" aria-labelledby="apps-heading">
      <div class="container">
        <div class="section-head">
          <h1 id="apps-heading" class="display">Eight whitelabel platforms. Each one already running for a business like yours.</h1>
          <p>Every one is running for a real Australian business right now. Hover for a preview, click to try the live demo.</p>
        </div>${PRODUCTS_GRID}
        <div class="panel" style="max-width:760px;margin:2rem auto 0;background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(168,85,247,0.05));border:1px solid rgba(245,158,11,0.2);text-align:center;">
          <span class="kicker" style="color:var(--copper-hi);">Looking for SaaS you sign up for directly?</span>
          <h2 class="display" style="font-size:1.4rem;margin:0.4rem 0 0.6rem;">3 self-serve tools you can use today.</h2>
          <p style="color:var(--soft);font-size:0.95rem;line-height:1.6;margin:0 0 1.1rem;max-width:560px;margin-left:auto;margin-right:auto;">No build wait, no setup fee, no whitelabel customisation. <a href="/tools/social-ai-studio" style="color:var(--copper-hi);text-decoration:none;font-weight:700;">Social AI Studio</a> ($29-149/mo · live), <a href="/tools/chownow" style="color:var(--copper-hi);text-decoration:none;font-weight:700;">ChowNow</a> (free to list · live), <a href="/tools/haccp" style="color:var(--copper-hi);text-decoration:none;font-weight:700;">HACCP Logbook</a> (waitlist).</p>
          <a href="/tools" class="btn btn-primary">See the tools →</a>
        </div>
      </div>
    </section>
${ctaSection('apps')}`;
}

export function numbersBody(): string {
  return `
    <section id="numbers" aria-labelledby="numbers-heading">
      <div class="container">
        <div class="section-head">
          <h1 id="numbers-heading" class="display">What it actually saves.</h1>
          <p>Averaged across all 8 whitelabel platforms running in production today.</p>
        </div>${NUMBERS_TILES}
      </div>
    </section>
${NUMBERS_BRIDGE}
${ctaSection('numbers')}`;
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
${ctaSection('roi')}`;
}

export function pricingBody(): string {
  return `
    <section id="pricing" aria-labelledby="pricing-heading">
      <div class="container">
        <div class="section-head">
          <h1 id="pricing-heading" class="display">Flat fee. No platform cut. Pick a plan.</h1>
          <p>Flat monthly fee. No per-transaction tax. Setup once, branded for life.</p>
        </div>${PRICING_TABLE}
      </div>
    </section>
${RISK_REVERSAL}
${ctaSection('pricing')}`;
}

export function aboutBody(): string {
  return `
    <section id="about" aria-labelledby="about-heading">
      <div class="container">
        <div class="section-head">
          <h1 id="about-heading" class="display">You're talking to one developer. That's the point.</h1>
          <p>One developer. Eight production whitelabel platforms plus three self-serve SaaS tools. No agency markup. When something breaks at 2am, you get me — not a help desk in Manila.</p>
        </div>${ABOUT_PANEL}
      </div>
    </section>
${ctaSection('about')}`;
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
${ctaSection('faq')}`;
}

export function notFoundBody(): string {
  return `
    <section class="notfound" aria-labelledby="notfound-heading">
      <div class="container">
        <span class="pill">404</span>
        <h1 id="notfound-heading" class="display">Page not found.</h1>
        <p>The page you were looking for doesn't exist (or maybe it never did). Head back to the home page or tell me what you wanted.</p>
        <div class="hero-ctas" style="justify-content:center">
          <a href="/" class="btn btn-primary">Back to home</a>
          <button type="button" data-open-lead data-source="/404" class="btn btn-ghost">Tell me what you wanted</button>
        </div>
      </div>
    </section>
${ctaSection('404')}`;
}

// ────────── Tools pages ──────────
// Direct-purchase SaaS apps (NOT whitelabel). Customer signs up, pays, and
// uses them on PWIT-hosted infrastructure with their own login. These pages
// render their own conversion CTAs (signup / waitlist) instead of the global
// "Talk to Steve" lead modal — different conversion model.

const TOOLS_INTRO = 'These are SaaS apps you sign up for and use directly — same way you would Xero or MailChimp. No build wait, no setup fee, no whitelabel customisation. Sign up, log in, pay monthly, get going.';

export function toolsBody(): string {
  return `
    <section id="hero" aria-labelledby="tools-hero-heading">
      <div class="container">
        <div class="hero-inner">
          <span class="pill">🇦🇺 Apps you use, not apps we build for you</span>
          <h1 id="tools-hero-heading" class="display"><span class="grad">TOOLS YOU CAN USE TODAY.</span></h1>
          <p class="sub">${TOOLS_INTRO}</p>
          <p class="hero-sub" style="font-size:0.92rem;color:var(--muted);max-width:640px;margin-top:0.5rem;">Looking for a custom-branded app under your domain? Those are <a href="/apps" style="color:var(--copper-hi);text-decoration:none;font-weight:700">on the whitelabel side</a>.</p>
        </div>
      </div>
    </section>

    <section id="tools-grid" aria-labelledby="tools-grid-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Live + coming soon</span>
          <h2 id="tools-grid-heading" class="display">Three tools, all built in Australia.</h2>
        </div>
        <div class="tools-grid">
          <article class="tool-card" data-tool="social-ai-studio">
            <div class="tool-card-header">
              <span class="tool-mark" aria-hidden="true">📲</span>
              <span class="tool-status tool-status-live">Live now</span>
            </div>
            <h3 class="tool-name">Social AI Studio</h3>
            <p class="tool-tagline">AI writes and schedules your Facebook + Instagram posts. Connect once, walk away.</p>
            <span class="tool-price-chip">From $29/mo</span>
            <ul class="tool-features">
              <li>4 tiers · up to <strong>$149/mo</strong></li>
              <li>No setup fee · Stripe billing · cancel anytime</li>
              <li>Built and hosted by Penny Wise I.T</li>
            </ul>
            <div class="tool-actions">
              <a href="https://socialaistudio.au" target="_blank" rel="noopener" class="btn btn-primary" aria-label="Open Social AI Studio (opens in a new tab)">Open Studio ↗</a>
              <a href="/tools/social-ai-studio" class="tool-card-link">Details →</a>
            </div>
          </article>

          <article class="tool-card" data-tool="chownow">
            <div class="tool-card-header">
              <span class="tool-mark" aria-hidden="true">🍔</span>
              <span class="tool-status tool-status-free">Live · Free</span>
            </div>
            <h3 class="tool-name">ChowNow</h3>
            <p class="tool-tagline">Food truck workflow, sorted. QR ordering, kitchen display, FOH POS, real-time tracking.</p>
            <span class="tool-price-chip">Free to list</span>
            <ul class="tool-features">
              <li>Stripe processing only · <strong>no platform cut</strong></li>
              <li>Customers order at chownow.au</li>
              <li>PWA — installs on any phone</li>
            </ul>
            <div class="tool-actions">
              <a href="https://chownow.au" target="_blank" rel="noopener" class="btn btn-primary" aria-label="Open ChowNow (opens in a new tab)">Open ChowNow ↗</a>
              <a href="/tools/chownow" class="tool-card-link">Details →</a>
            </div>
          </article>

          <article class="tool-card tool-card-soon" data-tool="haccp">
            <div class="tool-card-header">
              <span class="tool-mark" aria-hidden="true">🌡️</span>
              <span class="tool-status tool-status-soon">Coming soon</span>
            </div>
            <h3 class="tool-name">HACCP Logbook</h3>
            <p class="tool-tagline">Digital food safety logs. Audit-ready PDF for council inspectors with one tap.</p>
            <span class="tool-price-chip">Founder pricing</span>
            <ul class="tool-features">
              <li><strong>Locked for waitlist</strong> signups</li>
              <li>Cafes, butchers, food trucks, caterers</li>
              <li>FSANZ Standard 3.2.2A compliant</li>
            </ul>
            <div class="tool-actions">
              <a href="/tools/haccp" class="btn btn-primary">Join the waitlist →</a>
              <a href="/tools/haccp#what-it-does" class="tool-card-link">What it covers →</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="tools-vs-whitelabel" aria-labelledby="tools-vs-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Wait — what's the difference?</span>
          <h2 id="tools-vs-heading" class="display">Tools vs whitelabel apps.</h2>
        </div>
        <div class="panel" style="max-width:760px;margin:0 auto;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;color:var(--soft);font-size:0.95rem;line-height:1.6;">
            <div>
              <div style="font-weight:800;color:var(--text);margin-bottom:0.5rem;">Tools (this page)</div>
              <ul style="margin:0;padding-left:1.2rem;">
                <li>Sign up, pay, use — minutes</li>
                <li>Penny Wise I.T branding</li>
                <li>Shared hosting, your own login</li>
                <li>Monthly only, no setup fee</li>
              </ul>
            </div>
            <div>
              <div style="font-weight:800;color:var(--text);margin-bottom:0.5rem;"><a href="/apps" style="color:var(--copper-hi);text-decoration:none;">Whitelabel apps</a></div>
              <ul style="margin:0;padding-left:1.2rem;">
                <li>Custom build, ~1 week launch</li>
                <li>Your brand, your domain</li>
                <li>Dedicated infrastructure</li>
                <li>Setup fee + monthly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
${ctaSection('tools')}`;
}

// FAQ pairs for the Social AI Studio landing page. Same canonical text used
// for the visible accordion and the FAQPage JSON-LD — Google's rich-result
// eligibility requires they match exactly.
export const SAS_FAQ_PAIRS: FaqQA[] = [
  {
    question: 'Will it post to my Facebook Page or to my personal profile?',
    answer:
      "Your Facebook business Page only — never your personal profile, never your friends' feeds. Same for Instagram (your business Instagram, not your personal account). The Meta OAuth permissions request the minimum scope: read your Page metadata + publish to it. You can revoke access from Meta any time and we lose the connection instantly.",
  },
  {
    question: 'Does it generate images, or just text?',
    answer:
      'Both. The AI writes the post text and pulls a relevant image from your existing media library or Unsplash. You can override either at any point in the queue. If you only want to post your own photos, set "library only" in the brand preferences and the AI sticks to your uploads.',
  },
  {
    question: 'How does the AI know my brand voice?',
    answer:
      'You paste 5–10 of your past posts into the brand setup wizard. The AI extracts your tone (formal, cheeky, blokey, professional), your common phrases, your sign-offs, your hashtag style. From there every generated post matches that voice. You can refine by rating the first batch.',
  },
  {
    question: 'What if I want to whitelabel it for clients (agency use)?',
    answer:
      "That's the whitelabel side of the business. Tell Steve which features you need (your own domain, your own branding, multi-client dashboards) and he'll deploy a private instance for your agency. Different conversation, different pricing — talk to Steve via the lead form.",
  },
  {
    question: "Can I cancel mid-month if it's not working?",
    answer:
      "Yes. Cancellation is one click in your billing settings. We don't pro-rate refunds for the current month, but you keep access until the end of the period you've already paid for. Stripe handles the cancellation — no \"wait three business days\" or email-only friction.",
  },
];

// FAQ pairs for the ChowNow landing page. Same canonical text drives the
// visible accordion and the FAQPage JSON-LD on /tools/chownow.
export const CHOWNOW_FAQ_PAIRS: FaqQA[] = [
  {
    question: "How is this different from the whitelabel Food-Truck App?",
    answer:
      "Same code, different deployment model. ChowNow is multi-tenant — customers order through chownow.au, your menu lives there, you keep 100% of orders (Stripe processing only). The whitelabel /food-trucks deployment is custom-branded under YOUR domain, dedicated infrastructure, your customer list. ChowNow is for getting started fast with zero setup; whitelabel is for operators ready to invest in their own brand.",
  },
  {
    question: "Customers order through chownow.au, not my domain — does that hurt my brand?",
    answer:
      "Honestly, yes — a little. Your truck's listing is ChowNow-branded. If your social-media-driven repeat customers expect to land on YOUR site, this might feel weird. The trade-off: zero setup cost, free to list, immediate live ordering. Most operators start on ChowNow and graduate to whitelabel once they're ready to own their own brand. No forced migration, no re-keying customers.",
  },
  {
    question: "Does it work offline at remote markets?",
    answer:
      "Yes. ChowNow is a PWA (progressive web app) — it caches your menu locally and queues orders when 4G drops. Customers keep ordering during the dead zones, payments authorise once signal returns. Same offline tech as the whitelabel deployment.",
  },
  {
    question: "Can I take payments other than card (cash, EFTPOS terminal)?",
    answer:
      "Cash is still tracked manually in the till. EFTPOS terminals aren't directly integrated yet — most operators run Stripe via QR code on the customer's phone, which means the terminal is optional. If your existing terminal is non-negotiable, the whitelabel deployment can integrate it as a custom job.",
  },
  {
    question: "What happens if my volume grows — do I have to upgrade?",
    answer:
      "No. ChowNow's free tier handles the long tail of small operators indefinitely. You can stay free or graduate to whitelabel when you want your own brand. We don't do volume-based forced migrations or surprise tier-bumps. The reason to upgrade is brand equity, not transaction count.",
  },
];

// FAQ pairs for the HACCP Logbook waitlist page. Same data drives the visible
// accordion and the FAQPage JSON-LD on /tools/haccp.
export const HACCP_FAQ_PAIRS: FaqQA[] = [
  {
    question: 'Does this replace my formal HACCP plan?',
    answer:
      "No. Your written food safety program (the HACCP plan itself) is something a food safety auditor or consultant helps you draft once. This app is for the daily logging that proves you're following that plan — temperatures, cleaning, training, suppliers. Together they cover what councils want to see.",
  },
  {
    question: 'What does it cost when it launches?',
    answer:
      "Final pricing is locked in just before launch — likely a flat monthly per location, with founder pricing held for waitlist signups. We'll email you with a one-click signup before it goes public.",
  },
  {
    question: 'Will it work offline (kitchens with bad wi-fi)?',
    answer:
      "Yes. Logs cache on the device and sync when connection returns. You can take a temperature reading mid-service in a steel-clad cool room with no signal — it'll upload as soon as you walk back to the front.",
  },
  {
    question: 'Is the audit PDF actually accepted by council inspectors?',
    answer:
      'The PDF format covers everything Standard 3.2.2A asks for — what was logged, when, by whom. Different councils have different audit checklists, but the underlying records line up. Worst case: print the PDF, hand it over with your written plan. Same as paper, faster to find.',
  },
  {
    question: "What if I don't want to be on the waitlist?",
    answer:
      "You don't have to be. Once we launch you can sign up at full price. The waitlist is just a way to lock in early-customer pricing and get notified the day it goes live.",
  },
];

export function socialAiStudioBody(): string {
  // SoftwareApplication JSON-LD echoes the canonical schema on socialaistudio.au.
  // Pricing range comes from the live JSON-LD on that domain ($29-$149, 4 tiers).
  const sasLd = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Social AI Studio",
    "description": "AI-powered social media automation for small businesses and agencies. Generates, schedules and publishes Facebook and Instagram posts.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "https://socialaistudio.au",
    "offers": { "@type": "AggregateOffer", "lowPrice": "29", "highPrice": "149", "priceCurrency": "AUD", "offerCount": "4" },
    "creator": { "@id": "https://www.pennywiseit.com.au/#organization" }
  }
  </script>`;

  return `${sasLd}
    <section id="hero" aria-labelledby="sas-hero-heading">
      <div class="container">
        <div class="hero-inner">
          <span class="kicker pc-kicker">SOCIAL AI STUDIO</span>
          <h1 id="sas-hero-heading" class="display"><span class="grad">Stop staring at a blank Facebook post.</span></h1>
          <p class="sub">AI writes, schedules, and publishes Facebook + Instagram posts in your brand voice. Connect your accounts once, set the cadence, walk away. Built for Australian small businesses and agencies.</p>
          <div class="hero-ctas">
            <a href="https://socialaistudio.au" target="_blank" rel="noopener" class="btn btn-primary" aria-label="Open Social AI Studio (opens in a new tab)">Open Studio ↗</a>
            <a href="#how-it-works" class="btn btn-ghost">How it works</a>
          </div>
          <p class="hero-sub" style="font-size:0.85rem;color:var(--muted);margin-top:0.75rem;">From $29/mo · No setup fee · Stripe billing · Cancel anytime</p>
        </div>
      </div>
    </section>

    <section id="how-it-works" aria-labelledby="sas-how-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">How it works</span>
          <h2 id="sas-how-heading" class="display">From "I should post more" to "scheduled" in one afternoon.</h2>
        </div>
        <div class="panel" style="max-width:760px;margin:0 auto;">
          <ol style="margin:0;padding-left:1.4rem;color:var(--soft);font-size:1rem;line-height:1.8;">
            <li><strong style="color:var(--text)">Connect</strong> your Facebook Page and Instagram once via Meta's official OAuth.</li>
            <li><strong style="color:var(--text)">Brand voice</strong> — paste 5 of your past posts, the AI learns your tone (formal, cheeky, blokey, whatever).</li>
            <li><strong style="color:var(--text)">Cadence</strong> — pick "3x/week", "Mon-Wed-Fri", or "every weekday at 8am".</li>
            <li><strong style="color:var(--text)">Approve or auto-publish</strong> — review the queue every Sunday, or trust it to ship without you. Both work.</li>
            <li><strong style="color:var(--text)">Analytics</strong> — see which posts pulled engagement so the AI keeps tuning your feed.</li>
          </ol>
        </div>
      </div>
    </section>

    <section id="sas-pricing" aria-labelledby="sas-pricing-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Pricing</span>
          <h2 id="sas-pricing-heading" class="display">Four tiers. Pay monthly, cancel anytime.</h2>
          <p class="section-sub">Tiers scale with how many connected accounts and posts/month. Final pricing and tier names live on the Studio site (Stripe-managed, always current).</p>
        </div>
        <div class="panel" style="max-width:680px;margin:0 auto;text-align:center;">
          <div style="display:flex;justify-content:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.25rem;">
            <span style="background:var(--card);border:1px solid var(--border);padding:0.55rem 0.95rem;border-radius:999px;font-weight:700;color:var(--text);">From $29/mo</span>
            <span style="background:var(--card);border:1px solid var(--border);padding:0.55rem 0.95rem;border-radius:999px;font-weight:700;color:var(--text);">Up to $149/mo</span>
          </div>
          <a href="https://socialaistudio.au" target="_blank" rel="noopener" class="btn btn-primary">See current tiers + sign up ↗</a>
        </div>
      </div>
    </section>

    <section id="sas-faq" aria-labelledby="sas-faq-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Common questions</span>
          <h2 id="sas-faq-heading" class="display">Before you sign up.</h2>
        </div>
        <div class="faq-list" style="max-width:680px;margin:0 auto;">
          ${SAS_FAQ_PAIRS.map((item) => `
            <details class="faq-item">
              <summary>${escHtml(item.question)}</summary>
              <div class="faq-body">${escHtml(item.answer)}</div>
            </details>
          `).join('')}
        </div>
      </div>
    </section>

    <section id="sas-trust" aria-labelledby="sas-trust-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Why us</span>
          <h2 id="sas-trust-heading" class="display">An Australian product, not a $39/mo wrapper around ChatGPT.</h2>
        </div>
        <div class="panel" style="max-width:760px;margin:0 auto;color:var(--soft);font-size:0.95rem;line-height:1.65;">
          <p>Built and hosted by Penny Wise I.T in Queensland. Your data sits on Cloudflare infrastructure in Sydney, never leaves Australia. Stripe handles billing direct — no PayPal-only weirdness, no third-party reseller. AI runs on OpenRouter (Claude, GPT-4o, others) so you're never locked into one model getting worse over time.</p>
          <p style="margin-top:0.75rem;">If you ever want a fully whitelabel version on your own domain instead — a private community, member portal, custom AI features — that's the <a href="/apps" style="color:var(--copper-hi);text-decoration:none;font-weight:700">whitelabel side</a> of the business. Talk to Steve.</p>
        </div>
      </div>
    </section>

    <section id="sas-cta" aria-labelledby="sas-cta-heading" style="margin-top:1.5rem;">
      <div class="container">
        <div class="panel cta-card" style="background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(168,85,247,0.08));border:1px solid rgba(245,158,11,0.3);text-align:center;">
          <span class="kicker" style="color:var(--copper-hi);">READY TO STOP POSTING MANUALLY?</span>
          <h2 id="sas-cta-heading" class="display">Open Studio. Sign up. Go.</h2>
          <p class="cta-sub">Sign up takes about two minutes. First post can be scheduled within ten.</p>
          <div class="cta-buttons">
            <a href="https://socialaistudio.au" target="_blank" rel="noopener" class="btn btn-primary">Open Studio ↗</a>
            <button type="button" data-open-lead data-source="social-ai-studio-cta" class="btn btn-ghost">Want it whitelabelled? Talk to Steve</button>
          </div>
        </div>
      </div>
    </section>`;
}

export function chownowBody(): string {
  // Live ChowNow JSON-LD echoes what's on chownow.au with PWIT as creator.
  // Pricing positioned as "$0" — Stripe processing pass-through is the only
  // cost. Final per-order revenue model is on chownow.au if/when added.
  const chownowLd = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChowNow",
    "description": "Multi-tenant food truck workflow platform — QR ordering, kitchen display, front-of-house POS, real-time order tracking. Built and hosted by Penny Wise I.T.",
    "applicationCategory": "FoodService",
    "operatingSystem": "Web",
    "url": "https://chownow.au",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "AUD" },
    "creator": { "@id": "https://www.pennywiseit.com.au/#organization" }
  }
  </script>`;

  return `${chownowLd}
    <section id="hero" aria-labelledby="chownow-hero-heading">
      <div class="container">
        <div class="hero-inner">
          <span class="kicker pc-kicker">CHOWNOW · LIVE NOW · FREE TO LIST</span>
          <h1 id="chownow-hero-heading" class="display"><span class="grad">Food truck workflow, sorted.</span></h1>
          <p class="sub">QR ordering, kitchen display, front-of-house POS, and real-time order tracking. Customers order via chownow.au, your truck&rsquo;s on the map, you keep 100% of orders. The only cut is Stripe&rsquo;s processing fee.</p>
          <div class="hero-ctas">
            <a href="https://chownow.au" target="_blank" rel="noopener" class="btn btn-primary" aria-label="Open ChowNow (opens in a new tab)">Open ChowNow ↗</a>
            <a href="#how-it-works" class="btn btn-ghost">How it works</a>
          </div>
          <p class="hero-sub" style="font-size:0.85rem;color:var(--muted);margin-top:0.75rem;">Free to list · No setup fee · No platform cut · Stripe processing pass-through only</p>
        </div>
      </div>
    </section>

    <section id="how-it-works" aria-labelledby="chownow-how-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">How it works</span>
          <h2 id="chownow-how-heading" class="display">From "I just got booked for the markets" to "first pre-order in" in an afternoon.</h2>
        </div>
        <div class="panel" style="max-width:760px;margin:0 auto;">
          <ol style="margin:0;padding-left:1.4rem;color:var(--soft);font-size:1rem;line-height:1.8;">
            <li><strong style="color:var(--text)">Sign up free</strong> at chownow.au — claim your truck name, upload menu items, set hours.</li>
            <li><strong style="color:var(--text)">Connect Stripe</strong> for direct payment — money lands in your account, not ours.</li>
            <li><strong style="color:var(--text)">QR codes</strong> for your truck print straight from the dashboard. Stick them on the side of the van or on the menu board.</li>
            <li><strong style="color:var(--text)">Customers order</strong> on their phone via chownow.au. Kitchen display shows the queue. POS handles in-person walk-ups.</li>
            <li><strong style="color:var(--text)">SMS pickup alerts</strong> fire automatically when food&rsquo;s up. Customer collects, you cook the next ticket.</li>
          </ol>
        </div>
      </div>
    </section>

    <section id="chownow-features" aria-labelledby="chownow-features-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">What's in the box</span>
          <h2 id="chownow-features-heading" class="display">Every screen a working food truck needs.</h2>
        </div>
        <div class="panel" style="max-width:760px;margin:0 auto;">
          <ul style="margin:0;padding-left:1.4rem;color:var(--soft);font-size:0.98rem;line-height:1.75;">
            <li><strong style="color:var(--text)">QR ordering</strong> — customers scan, browse menu, pay, get an SMS when ready.</li>
            <li><strong style="color:var(--text)">Kitchen display</strong> — auto-sorted ticket queue with prep times.</li>
            <li><strong style="color:var(--text)">Front-of-house POS</strong> — handle walk-ups + cash + card on the same screen as online orders.</li>
            <li><strong style="color:var(--text)">Real-time tracking</strong> — customers see "preparing" / "ready" without ringing the truck.</li>
            <li><strong style="color:var(--text)">Stripe direct</strong> — no platform cut, no held funds, no Square 2.6%.</li>
            <li><strong style="color:var(--text)">PWA install</strong> — runs on any iPhone/Android via "Add to Home Screen".</li>
            <li><strong style="color:var(--text)">Offline-tolerant</strong> — caches menu + queues orders during 4G drops.</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="chownow-vs-whitelabel" aria-labelledby="chownow-vs-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">ChowNow vs whitelabel</span>
          <h2 id="chownow-vs-heading" class="display">Same code. Different deployment.</h2>
          <p class="section-sub">Most operators start here, graduate to whitelabel when their brand is ready to stand on its own domain.</p>
        </div>
        <div class="panel" style="max-width:760px;margin:0 auto;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;color:var(--soft);font-size:0.95rem;line-height:1.6;">
            <div>
              <div style="font-weight:800;color:var(--text);margin-bottom:0.5rem;">ChowNow (this page)</div>
              <ul style="margin:0;padding-left:1.2rem;">
                <li>Free, sign up in minutes</li>
                <li>Customers order at chownow.au</li>
                <li>ChowNow-branded experience</li>
                <li>Shared multi-tenant hosting</li>
                <li>No setup fee · Stripe-only cut</li>
              </ul>
            </div>
            <div>
              <div style="font-weight:800;color:var(--text);margin-bottom:0.5rem;"><a href="/food-trucks" style="color:var(--copper-hi);text-decoration:none;">Food-Truck App (whitelabel)</a></div>
              <ul style="margin:0;padding-left:1.2rem;">
                <li>$79/mo + $499 setup</li>
                <li>Customers order at <em>your</em> domain</li>
                <li>Your branding, your colours</li>
                <li>Dedicated infrastructure + customer list</li>
                <li>Live in a week</li>
              </ul>
            </div>
          </div>
          <p style="margin-top:1.25rem;color:var(--soft);font-size:0.9rem;text-align:center;">Customers, menu, and order history transfer when you graduate. No re-keying.</p>
        </div>
      </div>
    </section>

    <section id="chownow-faq" aria-labelledby="chownow-faq-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Common questions</span>
          <h2 id="chownow-faq-heading" class="display">Before you list your truck.</h2>
        </div>
        <div class="faq-list" style="max-width:680px;margin:0 auto;">
          ${CHOWNOW_FAQ_PAIRS.map((item) => `
            <details class="faq-item">
              <summary>${escHtml(item.question)}</summary>
              <div class="faq-body">${escHtml(item.answer)}</div>
            </details>
          `).join('')}
        </div>
      </div>
    </section>

    <section id="chownow-cta" aria-labelledby="chownow-cta-heading" style="margin-top:1.5rem;">
      <div class="container">
        <div class="panel cta-card" style="background:linear-gradient(135deg,rgba(249,115,22,0.12),rgba(245,158,11,0.08));border:1px solid rgba(249,115,22,0.3);text-align:center;">
          <span class="kicker" style="color:var(--copper-hi);">READY TO LIST?</span>
          <h2 id="chownow-cta-heading" class="display">Free to start. Live in 20 minutes.</h2>
          <p class="cta-sub">Sign up, upload your menu, print the QR codes, take your first order tonight.</p>
          <div class="cta-buttons">
            <a href="https://chownow.au" target="_blank" rel="noopener" class="btn btn-primary">Open ChowNow ↗</a>
            <a href="/food-trucks" class="btn btn-ghost">Want a custom-branded version? See the whitelabel app →</a>
          </div>
        </div>
      </div>
    </section>`;
}

export function haccpBody(): string {
  // SoftwareApplication JSON-LD with availability "PreOrder" so SERPs show
  // the "coming soon" status correctly. Update to InStock once we launch.
  const haccpLd = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "HACCP Logbook",
    "description": "Digital HACCP food safety logging for Australian food businesses — temperature checks, cleaning schedules, allergen matrix, supplier records, audit-ready PDF reports.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "https://www.pennywiseit.com.au/tools/haccp",
    "offers": { "@type": "Offer", "availability": "https://schema.org/PreOrder", "priceCurrency": "AUD" },
    "creator": { "@id": "https://www.pennywiseit.com.au/#organization" }
  }
  </script>`;

  return `${haccpLd}
    <section id="hero" aria-labelledby="haccp-hero-heading">
      <div class="container">
        <div class="hero-inner">
          <span class="kicker pc-kicker">HACCP LOGBOOK · COMING SOON</span>
          <h1 id="haccp-hero-heading" class="display"><span class="grad">Audit-ready in minutes, not weekends.</span></h1>
          <p class="sub">Digital HACCP logs for Australian food businesses. Temperature checks, cleaning schedules, allergen matrix, supplier records, staff training — all on your phone, all in one place. PDF report for council inspectors with one tap.</p>
          <div class="hero-ctas">
            <a href="#waitlist" class="btn btn-primary">Lock in founder pricing</a>
            <a href="#what-it-does" class="btn btn-ghost">What it covers</a>
          </div>
          <p class="hero-sub" style="font-size:0.85rem;color:var(--muted);margin-top:0.75rem;">Founder pricing locked for the first 50 waitlist signups · Discount carries forward when we launch</p>
        </div>
      </div>
    </section>

    <section id="who-needs-it" aria-labelledby="haccp-who-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Who this is for</span>
          <h2 id="haccp-who-heading" class="display">If you handle food in Australia, FSANZ Standard 3.2.2A applies.</h2>
        </div>
        <div class="panel" style="max-width:760px;margin:0 auto;color:var(--soft);font-size:0.95rem;line-height:1.65;">
          <p>From the start of December 2023, Standard 3.2.2A requires a documented food safety program for most food businesses — cafes, restaurants, butchers, food trucks, caterers, school canteens, aged care kitchens, anywhere food is handled and served. Your council can ask for the records on inspection day. Most operators still keep paper logs in a manila folder under the till. We can do better.</p>
        </div>
      </div>
    </section>

    <section id="what-it-does" aria-labelledby="haccp-what-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">What it does</span>
          <h2 id="haccp-what-heading" class="display">Every record your council inspector will ask for, on your phone.</h2>
        </div>
        <div class="panel" style="max-width:760px;margin:0 auto;">
          <ul style="margin:0;padding-left:1.4rem;color:var(--soft);font-size:0.98rem;line-height:1.8;">
            <li><strong style="color:var(--text)">Temperature logs</strong> — fridges, freezers, hot holding, cold display. Five-second mobile entry, auto-stamped with time + staff member + thermometer reading.</li>
            <li><strong style="color:var(--text)">Cleaning + sanitation schedules</strong> — daily, weekly, monthly checklists with sign-off. Reminders at the start of each shift.</li>
            <li><strong style="color:var(--text)">Allergen matrix</strong> — per menu item, with cross-contamination flags. Print-ready for front-of-house staff.</li>
            <li><strong style="color:var(--text)">Supplier verification</strong> — supplier name, ABN, licence/accreditation, last invoice. Council-friendly format.</li>
            <li><strong style="color:var(--text)">Staff food handler training</strong> — who's trained, what level, when they expire. SMS alert 30 days before any cert lapses.</li>
            <li><strong style="color:var(--text)">Incident log</strong> — illness, contamination, corrective action. Time-stamped audit trail.</li>
            <li><strong style="color:var(--text)">One-tap PDF</strong> — full audit report, last 30/60/90 days, branded with your business name. Hand it to the inspector and walk away.</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="waitlist" aria-labelledby="haccp-waitlist-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Founder pricing</span>
          <h2 id="haccp-waitlist-heading" class="display">Get on the waitlist. Lock in the launch discount.</h2>
          <p class="section-sub">First 50 signups get founder pricing — held for life as long as your subscription stays active. We'll email you the moment it goes live with a one-click signup link.</p>
        </div>
        <form class="panel" id="haccp-waitlist-form" style="max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:0.85rem;" novalidate>
          <div class="form-row">
            <label for="hw-name">Your name <span style="color:var(--copper-hi)">*</span></label>
            <input id="hw-name" name="name" type="text" required maxlength="100" placeholder="Jane Smith" autocomplete="name" />
          </div>
          <div class="form-row">
            <label for="hw-business">Business name <span style="color:var(--copper-hi)">*</span></label>
            <input id="hw-business" name="business" type="text" required maxlength="200" placeholder="Jane's Cafe" autocomplete="organization" />
          </div>
          <div class="form-row">
            <label for="hw-email">Email <span style="color:var(--copper-hi)">*</span></label>
            <input id="hw-email" name="email" type="email" required maxlength="200" placeholder="jane@janescafe.com.au" autocomplete="email" />
          </div>
          <div class="form-row">
            <label for="hw-type">Business type</label>
            <select id="hw-type" name="business_type">
              <option value="">— Select one —</option>
              <option value="cafe">Cafe</option>
              <option value="restaurant">Restaurant</option>
              <option value="butcher">Butcher / smallgoods</option>
              <option value="food-truck">Food truck / mobile</option>
              <option value="caterer">Caterer</option>
              <option value="school-canteen">School canteen</option>
              <option value="aged-care">Aged care kitchen</option>
              <option value="bakery">Bakery</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-row">
            <label for="hw-locations">How many locations?</label>
            <select id="hw-locations" name="locations">
              <option value="1">Just one</option>
              <option value="2-5">2–5</option>
              <option value="6-20">6–20</option>
              <option value="20+">20+</option>
            </select>
          </div>
          <input type="text" name="company" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;" aria-hidden="true" />
          <button type="submit" class="btn btn-primary" style="margin-top:0.5rem;">Lock in founder pricing</button>
          <p style="font-size:0.78rem;color:var(--muted);text-align:center;margin:0;">No spam. We'll email you when it launches and that's it. Unsubscribe instantly.</p>
        </form>
        <div id="haccp-waitlist-success" class="panel" style="display:none;max-width:560px;margin:1.5rem auto 0;text-align:center;background:rgba(34,197,94,0.08);border-color:rgba(34,197,94,0.3);">
          <span class="kicker" style="color:#22c55e;">YOU'RE IN</span>
          <h3 style="margin:0.5rem 0;color:var(--text);">Founder pricing locked.</h3>
          <p style="color:var(--soft);margin:0;">We'll email you the moment HACCP Logbook goes live. Talk soon.</p>
        </div>
      </div>
    </section>

    <section id="haccp-faq" aria-labelledby="haccp-faq-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Common questions</span>
          <h2 id="haccp-faq-heading" class="display">Before you sign up.</h2>
        </div>
        <div class="faq-list" style="max-width:680px;margin:0 auto;">
          ${HACCP_FAQ_PAIRS.map((item) => `
            <details class="faq-item">
              <summary>${escHtml(item.question)}</summary>
              <div class="faq-body">${escHtml(item.answer)}</div>
            </details>
          `).join('')}
        </div>
      </div>
    </section>`;
}

/** Privacy Policy page. Plain-English, AU Privacy Act-aligned. Steve should review and amend. */
export function privacyBody(): string {
  return `
    <section id="hero" aria-labelledby="privacy-heading">
      <div class="container">
        <div class="hero-inner legal-inner">
          <span class="kicker">Privacy</span>
          <h1 id="privacy-heading" class="display">Privacy policy.</h1>
          <p class="hero-sub">Last updated 4 May 2026. Plain-English summary at the top, the rest is the detail.</p>

          <div class="legal-callout">
            <strong>The short version:</strong> I collect only what I need to send you a reply or run your app. I don't sell, share, or profile your data. You can ask for it back or wiped any time. The rest is the detail required by the Australian Privacy Act 1988.
          </div>

          <h2>Who I am</h2>
          <p>This site (pennywiseit.com.au) and the apps under it are operated by Steve, trading as Penny Wise I.T, based in Queensland, Australia. Email: <a href="mailto:hello@pennywiseit.com.au">hello@pennywiseit.com.au</a>.</p>

          <h2>What I collect</h2>
          <ul>
            <li><strong>When you fill the contact form or newsletter</strong>: your name, business name, email, phone (if provided), and any free-text note. Stored in a Cloudflare D1 database in Australia.</li>
            <li><strong>When you use one of the apps I build</strong>: only what that specific app needs to function (orders, bookings, customer details, etc.). Each app's privacy policy lives on that app's own domain.</li>
            <li><strong>When you visit any page</strong>: standard server logs (IP, user agent, referrer, timestamps) for fraud/abuse protection. Cloudflare retains these per their terms.</li>
          </ul>

          <h2>How I use it</h2>
          <ul>
            <li>To reply to your inquiry or send the newsletter you signed up for. Nothing else.</li>
            <li>I don't run marketing automation, retargeting pixels, behavioural profiling, or any third-party analytics that share your data with ad networks.</li>
            <li>I'll never sell your contact details or your customer data. Period.</li>
          </ul>

          <h2>Who I share it with</h2>
          <ul>
            <li><strong>Cloudflare</strong> (compute, hosting, edge): page requests pass through Cloudflare's Sydney edge.</li>
            <li><strong>Stripe</strong> (payments, when you subscribe): standard PCI-compliant payment processing.</li>
            <li><strong>Resend</strong> (email): for sending you the confirmation email or newsletter you opted into.</li>
            <li>That's it. No advertising networks, no data brokers, no enrichment services.</li>
          </ul>

          <h2>How long I keep it</h2>
          <p>Contact-form submissions: kept while we're in active conversation, then archived for 7 years for tax/audit purposes per ATO requirements. Newsletter sign-ups: kept until you unsubscribe. Server logs: ~30 days.</p>

          <h2>Your rights</h2>
          <ul>
            <li><strong>Access</strong>: ask me what I have on you, I'll tell you within 30 days.</li>
            <li><strong>Correction</strong>: I'll fix anything inaccurate, free.</li>
            <li><strong>Deletion</strong>: ask me to wipe your record and I'll do it within 7 days, except where I'm legally required to retain it (e.g. payment records).</li>
            <li><strong>Export</strong>: ask me for everything I have on you in CSV/JSON and I'll send it.</li>
          </ul>

          <h2>How to ask</h2>
          <p>One email. <a href="mailto:hello@pennywiseit.com.au">hello@pennywiseit.com.au</a>. Subject line "Privacy request" + what you want. I reply within 1 business day.</p>

          <h2>Complaints</h2>
          <p>If you're not happy with how I've handled your data, contact me first — I'll fix it. If we can't agree, you can complain to the <a href="https://www.oaic.gov.au/" target="_blank" rel="noopener noreferrer">Office of the Australian Information Commissioner (OAIC)</a>.</p>

          <h2>Changes to this policy</h2>
          <p>If anything material changes, I'll update this page and email anyone whose contact details I have. The version date at the top of this page is the canonical reference.</p>
        </div>
      </div>
    </section>
${ctaSection('home')}`;
}

// ─── Vertical landing pages ────────────────────────────────────────────────
// Per-product entry pages for SEO + paid traffic. Each one is intentionally
// short (~3 viewports): hero → big product mock → 4 bullets → pricing row →
// use-case → CTA. No bento grid, no KPIs, no comparison strip — just the
// vertical's pain, the proof, and a single clear next step.

interface VerticalContent {
  /** Stable slug used as the URL path (e.g. "food-trucks"). */
  slug: PageId;
  /** Canonical product ID inside the system (e.g. "food-truck"). */
  productId: string;
  /** Product short name shown in card kicker (e.g. "FOOD-TRUCK PLATFORM"). */
  productKicker: string;
  /** Product display name (e.g. "Food-Truck App"). */
  productName: string;
  h1: string;
  intro: string;
  bullets: string[];
  useCase: string;
  /** Entry-tier label (e.g. "Single Van"). */
  entryTier: string;
  /** Entry-tier price (e.g. "$79/mo + $499 setup"). */
  entryPrice: string;
  /** Top-tier label (e.g. "Fleet/Franchise"). */
  topTier: string;
  /** Top-tier price (e.g. "$159/mo + $499 setup"). */
  topPrice: string;
  /** Short product description for JSON-LD + meta. */
  productDescription: string;
  /** Schema.org category (matches the existing PRODUCT_GRAPH_LD). */
  category: string;
  /**
   * Optional cross-sell tile rendered between the FAQ and closing CTA.
   * Use for natural complements (e.g. food businesses → HACCP Logbook).
   * Keep the pitch ≤2 sentences — it's a nudge, not a second sales page.
   */
  relatedTool?: { kicker: string; name: string; href: string; pitch: string; cta: string };
}

const VERTICAL_CONTENT: Record<string, VerticalContent> = {
  'food-trucks': {
    slug: 'food-trucks',
    productId: 'food-truck',
    productKicker: 'FOOD-TRUCK PLATFORM',
    productName: 'Food-Truck App',
    h1: "Pre-orders before the queue. SMS the moment it's ready.",
    intro: "A food-truck app, branded as yours, live in a week. Customers pre-order on their phone before they arrive, get a text the moment their burger's up. No hardware, no Square cut, no walk-aways.",
    bullets: [
      'Live online ordering with auto-SMS pickup alerts',
      'Customers pre-order at quiet times, you cook with confidence',
      'Stripe direct — keep every dollar Square would have skimmed',
      'Your domain, your customer list, your SEO — not order.square.site/yourtruck',
    ],
    useCase:
      "Friday 6:42pm. Big Red just got booked for the Yeppoon Sea Breeze Markets next Saturday — 4-hour pop-up, no second chances. One SMS broadcast goes to 612 past customers. By Saturday morning: 73 pre-orders worth $2,140 already locked in. You knew exactly how much brisket to smoke Friday night. Zero waste, zero walk-aways.",
    entryTier: 'Single Van',
    entryPrice: '$79/mo + $499 setup',
    topTier: 'Fleet/Franchise',
    topPrice: '$159/mo + $499 setup',
    productDescription:
      'Live online ordering platform for food trucks with SMS updates, QR menus, and pickup alerts',
    category: 'Food & Hospitality Software',
    relatedTool: {
      kicker: 'Not ready for whitelabel? Try',
      name: 'ChowNow — free to list',
      href: '/tools/chownow',
      pitch: 'Same code as the whitelabel app, multi-tenant deployment. Customers order through chownow.au, your truck&rsquo;s on the map, free to list, no setup fee, no platform cut. Most operators start here and graduate to the whitelabel version once their brand is ready.',
      cta: 'Open ChowNow free →',
    },
  },
  'tradies': {
    slug: 'tradies',
    productId: 'tradie',
    productKicker: 'FIELD SERVICE PLATFORM',
    productName: 'Tradie Field Service',
    h1: 'Online booking, deposit captured, SMS reminders. Quote-to-invoice in one app.',
    intro: 'A field-service app branded for your trade, live in a week. Customers self-book a slot from your live calendar, pay a deposit upfront, and get auto-SMS reminders before you arrive. No more voicemail-to-the-next-sparky-in-Google.',
    bullets: [
      'Live booking calendar with deposit hold (no more no-shows)',
      'Auto-SMS confirmations, day-before reminders, "I\'m 30 mins away"',
      '30-second video wrap-ups texted as proof of work',
      'Rego auto-lookup → quote → invoice → paid in one flow',
    ],
    useCase:
      "Tuesday 2:30pm. Sparky Mike's halfway up a ladder in Gracemere when his phone rings for the fourth time. Voicemail. The next sparky in Google gets the job. With the app: customer hits the site, picks Thursday 9am from a live calendar, pays $50 deposit. Mike gets an SMS at 2:31pm. Three bookings landed today while he was on tools.",
    entryTier: 'Solo Workshop',
    entryPrice: '$99/mo + $499 setup',
    topTier: 'Multi-Bay/Fleet',
    topPrice: '$199/mo + $499 setup',
    productDescription:
      'Field service management platform for tradies with online booking, rego lookup, and video wrap-ups',
    category: 'Field Service Software',
  },
  'store': {
    slug: 'store',
    productId: 'online-store',
    productKicker: 'ONLINE STORE PLATFORM',
    productName: 'Online Store',
    h1: 'Stripe direct, no Shopify tax. Your domain, your customer list, your data.',
    intro: 'A custom-branded online store, live in a week. Stripe checkout (no platform cut), built-in SMS shipping updates, customer list lives in your D1 — exportable any time, even after you cancel.',
    bullets: [
      'Stripe direct — Shopify Advanced + apps would skim ~$430/mo',
      'Built-in SMS order updates (no Klaviyo subscription needed)',
      'Wholesale/B2B logins on the same site as retail',
      'Your customer list in your Cloudflare D1, never hostage to a platform',
    ],
    useCase:
      "Sunday night. Bay City just bottled a 48-jar batch of Ferment #14 — habanero kraut, three months in the making. Photo up at 8:14pm. SMS+email blast to 2,847 subscribers at 8:30pm. By 9:15pm: 41 jars sold at $18 each. Stripe deposits $738 the next morning — no platform cut. That's $145 you would've handed Shopify, kept.",
    entryTier: 'Starter Store',
    entryPrice: '$79/mo + $499 setup',
    topTier: 'Growing Brand',
    topPrice: '$149/mo + $499 setup',
    productDescription:
      'Custom branded online store with Stripe checkout and zero platform fees',
    category: 'E-commerce Software',
  },
  'festivals': {
    slug: 'festivals',
    productId: 'festival',
    productKicker: 'EVENT PLATFORM',
    productName: 'Festival & Event App',
    h1: 'Tickets, schedule, QR scan, push alerts — all under your branding.',
    intro: 'An event app, your branding, live before your next pop-up. Sell tickets via Stripe (no Eventbrite cut), update the schedule live, push alerts when the stage changes, scan QR codes at the gate.',
    bullets: [
      'Tickets via Stripe — no $1.79/ticket Eventbrite tax',
      'Push alerts to every attendee when weather/stage changes',
      'QR ticket scanning at the gate (works offline, syncs later)',
      'Vendor stalls + maps + post-event survey, all in one app',
    ],
    useCase:
      'Saturday 3:14pm at Gladstone Summer Fest. A storm cell rolls in. Main stage shifts indoors in 20 minutes. One push alert + SMS fallback fires to every ticket holder. 3,940 phones buzz at once with the new stage map. Zero refund requests Monday. Sponsors saw 93% click-through and re-booked for next year on the spot.',
    entryTier: 'Single Event',
    entryPrice: '$199/mo + $999 setup',
    topTier: 'Festival/Multi-Event',
    topPrice: '$399/mo + $999 setup',
    productDescription:
      'Event management platform with ticketing, live schedule, and QR gate scanning',
    category: 'Event Management Software',
  },
  'butchers': {
    slug: 'butchers',
    productId: 'butchers',
    productKicker: 'BUTCHER SHOP PLATFORM',
    productName: 'Butcher Shop & Online Orders',
    h1: 'Custom cuts, freezer packs, click & collect — Sunday phone calls go to zero.',
    intro: 'An online ordering app for a real butcher shop, branded as yours, live in a week. Custom cuts with weight-tolerance, freezer packs, click & collect, auto-stocktake from sales. Your customers stop ringing Sunday afternoon.',
    bullets: [
      'Custom cut requests with weight tolerance ("I want ~1.2kg ribeye, trimmed")',
      'Freezer pack bundles ($150 mixed pack) + click & collect',
      'SMS at "ready for pickup" / "left the shop"',
      'Auto-stocktake — daily inventory adjusts from sales, no spreadsheet',
    ],
    useCase:
      "Tuesday 10am. Moey's gets 4 custom-cut requests for Friday. The app's already taken the deposit, slotted them on the cutting list, and texted each customer 'received'. By Friday afternoon: 4 ready-for-pickup SMS fire automatically as the meat clears the saw. Zero phone calls. Sunday afternoon stays Sunday afternoon.",
    entryTier: 'Single Shop',
    entryPrice: '$99/mo + $499 setup',
    topTier: 'Multi-Shop/Wholesale',
    topPrice: '$199/mo + $499 setup',
    productDescription:
      'Online ordering for butcher shops — custom-cut requests, freezer pack bundles, click & collect, local delivery, auto-stocktake',
    category: 'Food Retail Software',
    relatedTool: {
      kicker: 'Pair it with',
      name: 'HACCP Logbook',
      href: '/tools/haccp',
      pitch: 'Butchers handle high-risk food. Council inspectors will ask for your temperature logs, supplier verification and cleaning records. Log it all on your phone, hand them a one-tap PDF on inspection day.',
      cta: 'Get HACCP-ready →',
    },
  },
  'sports-clubs': {
    slug: 'sports-clubs',
    productId: 'sports-club',
    productKicker: 'SPORTS CLUB PLATFORM',
    productName: 'Sports Club Hub',
    h1: 'Player + parent + coach + admin portals. Fixtures, fees, and chat in one app.',
    intro: 'A sports-club app, branded for your club, live before next season. Replaces TeamSnap, GameDay, and three Facebook groups — with player profiles, fixtures, fees via Stripe, and a chat per team.',
    bullets: [
      'Per-role portals: Player, Parent, Coach, Admin',
      'Fixtures with auto match-day reminders',
      'Membership + match fees via Stripe (no per-seat tax)',
      'Chat per team, no more Facebook groups',
    ],
    useCase:
      'Pre-season Sunday. Yeppoon Junior Rugby League opens registrations. By Monday morning: 87 players signed up, $13,920 in fees collected via Stripe, fixtures published, parent chat groups auto-created per team. Last year that was 6 weeks of spreadsheets.',
    entryTier: 'Junior Club (≤200)',
    entryPrice: '$79/mo + $999 setup',
    topTier: 'Senior + Junior',
    topPrice: '$199/mo + $999 setup',
    productDescription:
      'All-in-one community sports club app — fixtures, registrations, team chat, lineup tools, committee financials',
    category: 'Sports Club Software',
  },
  'car-hire': {
    slug: 'car-hire',
    productId: 'car-hire',
    productKicker: 'CAR-HIRE PLATFORM',
    productName: 'Car Hire & Rentals',
    h1: 'Date-range booking, license upload, lockbox SMS pickup. Flat-fee, no Turo cut.',
    intro: 'A car-hire app for your fleet, branded as yours, live in a week. Customers self-book online, upload their licence, pay deposit + balance, and get a lockbox-code SMS at pickup time. No counter staff.',
    bullets: [
      'Live fleet calendar with blackouts + maintenance windows',
      'Stripe deposit + balance, license upload to your R2',
      'Lockbox SMS at pickup time — no counter staff needed',
      'No 30% Turo cut, no Hertz franchise lock-in',
    ],
    useCase:
      'Friday afternoon. Yapoon Auto Rentals goes live for the long-weekend rush. By Sunday evening: 14 bookings cleared, all self-service, lockbox codes auto-issued, no counter staff. Saturday morning was a sleep-in, not a queue at the counter.',
    entryTier: 'Solo Yard',
    entryPrice: '$129/mo + $499 setup',
    topTier: 'Fleet (10+ vehicles)',
    topPrice: '$269/mo + $499 setup',
    productDescription:
      'Vehicle rental platform with date-range booking, license upload, Stripe deposits, lockbox SMS pickup, and a fleet calendar',
    category: 'Vehicle Rental Software',
  },
  'delivery': {
    slug: 'delivery',
    productId: 'delivery',
    productKicker: 'DELIVERY PLATFORM',
    productName: 'Delivery & Logistics',
    h1: "Live driver tracking + auto-routing. Customers stop ringing 'where's my order?'",
    intro: 'A delivery + logistics app for your fleet, branded as yours, live in a week. Live driver tracking, auto-route optimisation, photo + signature POD, and customers stop ringing — they can see you on a map.',
    bullets: [
      'Live driver tracking on a customer-facing map',
      'Auto-route optimisation = 20-30% more drops per shift',
      'Photo + signature POD auto-emailed to customer',
      'No DoorDash/Uber 30% cut — your drivers, your margins',
    ],
    useCase:
      'Wednesday 10am. Central QLD Courier Co. has 34 drops between Rockhampton and Emerald, two drivers, a 7-hour window. Sharon used to spend 90 minutes plotting routes on paper. With the app: route optimiser sorts both runs in 12 seconds. Drivers finished by 4:50pm instead of 6:30pm. Extra 9 drops a week, $480 in margin.',
    entryTier: 'Solo / Fleet-of-2',
    entryPrice: '$149/mo + $799 setup',
    topTier: 'Multi-Truck/Logistics',
    topPrice: '$349/mo + $799 setup',
    productDescription:
      'Delivery management platform with live driver tracking and route optimisation',
    category: 'Logistics Software',
  },
};

/** Looks up a vertical-page record by slug. Used by the route handler in
 *  index.ts to derive title/description/JSON-LD without re-typing the data. */
export function getVerticalContent(slug: string): VerticalContent | undefined {
  return VERTICAL_CONTENT[slug];
}

/** Returns a single-product JSON-LD `<script>` block for the given vertical
 *  slug. Renders nothing if the slug is unknown. The page-level Organization
 *  schema is already injected by the layout; this adds the Product node only
 *  for the vertical that owns the page. */
export function verticalProductLd(slug: string, siteOrigin: string): string {
  const c = VERTICAL_CONTENT[slug];
  if (!c) return '';
  return `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "${siteOrigin}/${c.slug}#product",
    "name": "${escapeAttr(c.productName)}",
    "description": "${escapeAttr(c.productDescription)}",
    "brand": { "@id": "${siteOrigin}/#organization" },
    "category": "${escapeAttr(c.category)}",
    "url": "${siteOrigin}/${c.slug}"
  }
  </script>`;
}

/** Minimal HTML attribute escaper — covers the chars likely to appear in
 *  product copy. Keeps the JSON-LD valid even when descriptions contain
 *  ampersands or quotes. */
function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** HTML body-text escaper — covers ampersand and angle brackets so visible
 *  copy with literal `&` ("B&S", "T&Cs") renders as the user typed it
 *  rather than as an HTML entity reference. JSON-LD consumers see the raw
 *  string via JSON.stringify, so the schema text and visible text still
 *  match exactly (Google's FAQPage rich-result eligibility rule). */
function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function productPageBody(slug: string): string {
  const c = VERTICAL_CONTENT[slug];
  if (!c) return notFoundBody();

  const demoUrl = `https://demos.pennywiseit.com.au/demo/${c.productId}`;
  const dataSource = `/${c.slug}`;
  // Single-product JSON-LD inlined here (rather than via the layout's
  // includeProductSchema, which ships the full 9-product graph). Keeps the
  // schema for this page narrowly scoped to the one product the page is about.
  const productLd = verticalProductLd(c.slug, 'https://www.pennywiseit.com.au');

  return `${productLd}
    <section id="hero" aria-labelledby="vertical-hero-heading">
      <div class="container">
        <div class="hero-inner">
          <span class="kicker pc-kicker">${c.productKicker}</span>
          <h1 id="vertical-hero-heading" class="display"><span class="grad">${c.h1}</span></h1>
          <p class="sub">${c.intro}</p>
          <div class="hero-ctas">
            <a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" aria-label="Try the live ${c.productName} demo">
              Try the live demo
            </a>
            <button type="button" data-open-lead data-source="${dataSource}" class="btn btn-ghost" aria-label="Talk to Steve about ${c.productName}">
              Talk to Steve
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="vertical-mock" aria-label="${c.productName} interactive preview">
      <div class="container">
        <article class="product-card" data-product="${c.productId}" style="max-width:820px;margin:0 auto;">
          <span class="kicker pc-kicker">${c.productKicker}</span>
          <h2 style="font-size:1.35rem;font-weight:600;font-family:var(--display-font);letter-spacing:-0.01em;margin:0;">${c.productName}</h2>
          <div class="iframe-wrap">
            <iframe class="product-mock" data-mock src="/mocks/${c.productId}" loading="lazy" sandbox="allow-scripts" title="${c.productName} interactive demo" referrerpolicy="no-referrer"></iframe>
          </div>
          <a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="pc-cta" aria-label="See ${c.productName} live">Open the full demo →</a>
        </article>
      </div>
    </section>

    <section id="vertical-bullets" aria-labelledby="vertical-bullets-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Why this app</span>
          <h2 id="vertical-bullets-heading" class="display">Built for the way you actually work.</h2>
        </div>
        <div class="panel" style="max-width:760px;margin:0 auto;">
          <ul style="margin:0;padding-left:1.4rem;color:var(--soft);font-size:1rem;line-height:1.7;">
            ${c.bullets.map((b) => `<li style="margin-bottom:0.65rem;">${b}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>

    <section id="vertical-pricing" aria-labelledby="vertical-pricing-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Pricing</span>
          <h2 id="vertical-pricing-heading" class="display">Flat fee. No platform cut.</h2>
        </div>
        <div class="pricing-table panel" role="table" aria-label="${c.productName} pricing" style="max-width:760px;margin:0 auto;">
          <div class="pricing-row pricing-head" role="row">
            <div role="columnheader">App</div>
            <div role="columnheader">Entry tier</div>
            <div role="columnheader">Top tier</div>
            <div role="columnheader" class="pricing-cta-col">Demo</div>
          </div>
          <div class="pricing-row" role="row" data-product="${c.productId}">
            <div role="cell"><div class="p-name">${c.productName}</div><div class="p-cat">${c.productKicker.toLowerCase()}</div></div>
            <div role="cell"><span class="p-tier">${c.entryTier}</span><span class="p-price">${c.entryPrice}</span></div>
            <div role="cell"><span class="p-tier">${c.topTier}</span><span class="p-price">${c.topPrice}</span></div>
            <div role="cell" class="pricing-cta-col"><a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a><br><button type="button" data-open-lead data-source="${dataSource}#pricing" class="p-setup-link">Get this set up →</button></div>
          </div>
        </div>
      </div>
    </section>

    <section id="vertical-use-case" aria-labelledby="vertical-use-case-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">In the real world</span>
          <h2 id="vertical-use-case-heading" class="display">A day with the app.</h2>
        </div>
        <div class="panel" style="max-width:760px;margin:0 auto;">
          <p style="color:var(--soft);font-size:1.02rem;line-height:1.7;margin:0;">${c.useCase}</p>
        </div>
      </div>
    </section>
${(INDUSTRY_FAQ[c.productId] || []).length ? `
    <section id="vertical-faq" aria-labelledby="vertical-faq-heading">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Common questions</span>
          <h2 id="vertical-faq-heading" class="display">Industry-specific answers, no fluff.</h2>
          <p class="section-sub">The marketing-site <a href="/faq">FAQ</a> covers the universal questions (ABN, data hosting, contracts). These are the ones specific to running a ${c.productName.toLowerCase()}.</p>
        </div>
        <div class="faq-list" style="max-width:760px;margin:0 auto;">
          ${INDUSTRY_FAQ[c.productId].map((item) => `
            <details class="faq-item">
              <summary>${escHtml(item.question)}</summary>
              <div class="faq-body">${escHtml(item.answer)}</div>
            </details>
          `).join('')}
        </div>
      </div>
    </section>
` : ''}
${c.relatedTool ? `
    <section id="vertical-related" aria-labelledby="vertical-related-heading">
      <div class="container">
        <div class="panel" style="max-width:760px;margin:0 auto;background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(168,85,247,0.05));border:1px solid rgba(245,158,11,0.2);">
          <span class="kicker" style="color:var(--copper-hi);">${escHtml(c.relatedTool.kicker)}</span>
          <h2 id="vertical-related-heading" class="display" style="font-size:1.55rem;margin:0.4rem 0 0.6rem;">${escHtml(c.relatedTool.name)}</h2>
          <p style="color:var(--soft);font-size:0.98rem;line-height:1.65;margin:0 0 1.1rem;">${escHtml(c.relatedTool.pitch)}</p>
          <a href="${c.relatedTool.href}" class="btn btn-primary">${escHtml(c.relatedTool.cta)}</a>
        </div>
      </div>
    </section>
` : ''}
${ctaSection(c.slug)}`;
}

/** Terms of Service. Plain-English, AU SMB-appropriate. Steve should review and amend. */
export function termsBody(): string {
  return `
    <section id="hero" aria-labelledby="terms-heading">
      <div class="container">
        <div class="hero-inner legal-inner">
          <span class="kicker">Terms</span>
          <h1 id="terms-heading" class="display">Terms of service.</h1>
          <p class="hero-sub">Last updated 4 May 2026. The contract between you and me, in plain English.</p>

          <div class="legal-callout">
            <strong>The short version:</strong> You pay a flat monthly fee. I deliver a working app under your brand. Either of us can cancel any month with 30 days' notice. Your data is yours, your domain is yours, and if I disappear, your app keeps running.
          </div>

          <h2>1. Who's offering what</h2>
          <p>Penny Wise I.T (operated by Steve, Queensland Australia) provides whitelabel software-as-a-service apps to small businesses. By using this site or signing up to one of the apps, you agree to these terms.</p>

          <h2>2. The service</h2>
          <p>I build, host, and maintain a custom-branded version of one of my published whitelabel apps for your business, on a domain you own (or one I help you register), running on infrastructure in your name where possible (Stripe, Cloudflare).</p>

          <h2>3. Fees</h2>
          <ul>
            <li><strong>Setup fee</strong>: one-off, charged at the start. Covers branding, domain, configuration, content migration.</li>
            <li><strong>Monthly fee</strong>: flat, charged on the same date each month via Stripe. Covers hosting, support, updates, and backups.</li>
            <li><strong>Stripe processing fees</strong>: pass-through (Stripe's standard ~1.7% + 30c per AU transaction). I take no platform fee on top.</li>
            <li>Prices on the <a href="/pricing">/pricing</a> page are AUD, GST-exclusive while my ABN registration is pending. Once issued, GST becomes payable on top of the listed price and full tax invoices are re-issued.</li>
          </ul>

          <h2>4. Cancellation</h2>
          <p>Either of us can cancel at any time by emailing the other. The monthly fee stops on the next billing cycle, no questions asked. The setup fee is non-refundable except under the 30-day setup guarantee (see below). I'll provide a final data export in CSV format within 7 days of cancellation.</p>

          <h2>5. 30-day setup guarantee</h2>
          <p>If your branded app isn't live and working in production within 30 days of the setup fee clearing — and it's because of something I haven't done on my side — I refund the setup fee in full. Delays caused by your side (waiting for your domain, branding assets, content) don't count toward the 30 days.</p>

          <h2>6. Your data ownership</h2>
          <p>Every record stored in your app — customers, orders, bookings, photos, files — is yours. You can export it as CSV/JSON any time, even after cancellation. I don't claim ownership, sell, or share your business data. Ever.</p>

          <h2>7. My code ownership</h2>
          <p>The underlying app source code is mine (covered by my own private licence). You licence it on a subscription basis while you're a paying customer. On cancellation, you keep your data and your domain; the running app instance is shut down. If you need a permanent independent copy of the source code for continuity, ask — I'll grant a one-off perpetual licence for a negotiated fee.</p>

          <h2>8. Continuity</h2>
          <p>Every app's infrastructure is set up so you're not locked to me: your Cloudflare account, your Stripe account, your domain. If I'm hit by a bus, the apps keep running and any developer can take over. I keep a hand-over document that I'd send to my partner with instructions if I'm out of action longer than 7 days.</p>

          <h2>9. Service level</h2>
          <p>I aim to reply to support emails within 1 business day. Production outages: I aim to respond within 4 hours during AEST work hours, 24 hours otherwise. I don't promise specific uptime SLAs — Cloudflare's SLA covers the underlying infrastructure (typically 99.99%). If something material breaks, I'll fix it.</p>

          <h2>10. Liability</h2>
          <p>I do my best and stand behind my work, but I can't accept liability for indirect, consequential, or speculative damages (lost revenue, lost customers, etc.). My total liability for any claim is capped at the fees you've paid me in the previous 12 months. This doesn't override any rights you have under the Australian Consumer Law that can't be excluded.</p>

          <h2>11. Acceptable use</h2>
          <p>Don't use the app for anything illegal, fraudulent, or designed to harass others. Don't try to break the platform, scrape it, or resell it. If you do, I'll terminate without refund.</p>

          <h2>12. Governing law</h2>
          <p>These terms are governed by the laws of Queensland, Australia. Any dispute that can't be resolved by talking it out goes to a Queensland court.</p>

          <h2>13. Changes</h2>
          <p>If I update these terms in a way that materially affects you, I'll email you with at least 30 days' notice. You can cancel before the new terms take effect.</p>

          <h2>14. Contact</h2>
          <p>One email: <a href="mailto:hello@pennywiseit.com.au">hello@pennywiseit.com.au</a>. I reply.</p>
        </div>
      </div>
    </section>
${ctaSection('home')}`;
}
