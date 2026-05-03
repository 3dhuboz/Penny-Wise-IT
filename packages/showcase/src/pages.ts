// Per-page <main> bodies for the showcase site.
// Each function returns inner HTML that the layout wraps with chrome + footer.
// CTA panel is appended to every page so every visitor has a clear conversion path.

import { ctaSection } from './layout';

const HERO_SECTION = `
    <section id="hero" aria-labelledby="hero-heading">
      <img src="/icon-mark.svg" alt="" aria-hidden="true" class="hero-coin" loading="eager" decoding="async">
      <div class="container">
        <div class="hero-inner">
          <span class="pill">🇦🇺 9 ready-to-launch apps · live in a week</span>
          <h1 id="hero-heading" class="display">
            <span class="grad">YOUR BUSINESS, AUTOMATED.</span>
          </h1>
          <p class="sub">9 production-ready whitelabel apps for Australian small businesses. Live ordering, field service, delivery, events, communities, car hire, butcher shops, sports clubs — flat monthly fee, your brand, your domain, zero platform tax.</p>
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
              <div id="roi-post-cta" class="roi-post-cta" hidden>
                <button type="button" data-open-lead data-source="/roi" class="btn btn-primary" style="width:100%">
                  Lock this estimate — talk to Steve
                </button>
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

          <div class="pricing-row" role="row" data-product="ai-social">
            <div role="cell"><div class="p-name">AI Social Platform</div><div class="p-cat">For clubs, creators, private communities</div></div>
            <div role="cell"><span class="p-tier">Starter Community</span><span class="p-price">$99/mo + $799 setup</span></div>
            <div role="cell"><span class="p-tier">Creator-Backed</span><span class="p-price">$249/mo + $799 setup</span></div>
            <div role="cell" class="pricing-cta-col"><a href="https://demos.pennywiseit.com.au/demo/ai-social" target="_blank" rel="noopener noreferrer" class="p-demo-link">Try demo →</a><br><button type="button" data-open-lead data-source="/pricing#ai-social" class="p-setup-link">Get this set up →</button></div>
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
          <div class="compare-row"><div class="compare-name">Shopify Advanced + apps</div><div>~$430/mo at $10k MRR</div><div>Account suspendable</div><div>Theirs</div></div>
          <div class="compare-row"><div class="compare-name">Square POS</div><div>2.6% per transaction</div><div>Hardware lock</div><div>Theirs</div></div>
          <div class="compare-row"><div class="compare-name">Eventbrite</div><div>3.5% + $1.79/ticket</div><div>Per-event fees</div><div>Theirs</div></div>
          <div class="compare-row"><div class="compare-name">Patreon</div><div>8–12% of every sub</div><div>Their domain</div><div>Theirs</div></div>
          <div class="compare-row compare-us"><div class="compare-name">Penny Wise I.T</div><div>$0 — Stripe fee only</div><div>Cancel any month</div><div>Yours, exportable</div></div>
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
              <p>I build every app myself — from database schema to pixel-perfect UI — and maintain them personally for each client. All 9 platforms on this page are running in production right now, for real Australian businesses. Flat monthly fee. No hidden platform cut. Your brand from day one. If something breaks at 2am, I'm the one who fixes it — not a help desk in Manila.</p>
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

// ─── Page bodies ──────────────────────────────────────────────────────────

export function homeBody(): string {
  return `${HERO_SECTION}

    <section class="home-summary" aria-label="Quick links">
      <div class="container">
        <div class="home-summary-grid">
          <a href="/apps" class="summary-tile">
            <div class="summary-tile-eyebrow">9 ready-made platforms</div>
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
          <p>Averaged across all 9 whitelabel platforms running in production today.</p>
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
          <h1 id="apps-heading" class="display">Nine platforms. Each one already running for a business like yours.</h1>
          <p>Every one is running for a real Australian business right now. Hover for a preview, click to try the live demo.</p>
        </div>${PRODUCTS_GRID}
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
          <p>Averaged across all 9 whitelabel platforms running in production today.</p>
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
          <p>One developer. Nine production platforms. No agency markup. When something breaks at 2am, you get me — not a help desk in Manila.</p>
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
