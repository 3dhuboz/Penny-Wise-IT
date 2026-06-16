// Data powering every whitelabel demo proposal page.
// Add / edit entries here — the rendering is all shared.

export type ProductConfig = {
  id: string;
  // Marketing
  brand: string;              // "Street Meatz BBQ"
  tagline_top: string;        // "YOUR FOOD TRUCK,"  -- white text
  tagline_bottom: string;     // "RUNNING LIKE 2026." -- gradient text
  descriptor: string;         // "Food truck with live online ordering..."
  kicker: string;             // pill badge above headline "MODERN FOOD-TRUCK PLATFORM"
  industry_label: string;     // "APP · PROPOSAL · FOOD-TRUCK" in the top nav
  sell_point: string;         // one-sentence elevator pitch for hero
  accent_gradient: [string, string, string]; // e.g. ['#f87171','#fb923c','#fbbf24']
  icon_bg_gradient: [string, string]; // for the feature icons
  cta_color: string;          // yellow, green etc for main CTA button
  // Live URLs
  live_url: string;           // https://streetmeatzbbq.com.au
  demo_url?: string;          // prospect-safe demo instance, if different
  // Stats (4 stat cards in hero)
  stats: { value: string; label: string; sub: string; color: string }[];
  // Features (8 cards with icon + title + body)
  features: { icon: string; title: string; body: string; gradient: [string, string] }[];
  // Why this works section (4 cards)
  why: { icon: string; title: string; body: string }[];
  // Admin time section (4 rows)
  admin_time: { task: string; before: string; after: string; saves: string }[];
  // Pricing tiers (up to 2)
  pricing: { tier: string; price_per_month: number; setup: number; features: string[]; popular?: boolean; color: string }[];
};

export const PRODUCTS: Record<string, ProductConfig> = {
  'food-truck': {
    id: 'food-truck',
    brand: 'Food-Truck App',
    tagline_top: 'YOUR FOOD TRUCK,',
    tagline_bottom: 'RUNNING LIKE 2026.',
    descriptor: 'Live online ordering. Auto-SMS updates. QR menu. Pickup-ready alerts. Your brand, your domain, your customers. Zero hardware.',
    kicker: 'MODERN FOOD-TRUCK PLATFORM',
    industry_label: 'FOOD-TRUCK APP · PROPOSAL',
    sell_point: 'Pre-orders before the queue starts. SMS when the burger\'s ready.',
    accent_gradient: ['#f87171', '#fb923c', '#fbbf24'],
    icon_bg_gradient: ['#f87171', '#fb923c'],
    cta_color: '#fbbf24',
    live_url: 'https://streetmeatzbbq.com.au',
    stats: [
      { value: '+35%', label: 'ORDERS / HOUR',    sub: 'Pre-orders fill the dead times', color: '#fbbf24' },
      { value: '~6 HRS',label: 'ADMIN SAVED / WK', sub: 'No phone tag, no paper dockets',  color: '#2dd4bf' },
      { value: '24/7',  label: 'MENU ALWAYS OPEN', sub: 'Customers order the night before', color: '#f87171' },
      { value: '100%',  label: 'YOUR BRAND',       sub: 'Your logo, your domain, no SaaS',   color: '#34d399' },
    ],
    features: [
      { icon: '🍔', title: 'LIVE ONLINE ORDERING', body: 'Customers order and pay before they arrive. Orders print / ping your KDS the second they hit.', gradient: ['#f87171', '#fb923c'] },
      { icon: '📱', title: 'AUTO SMS UPDATES',     body: '"Order received", "cooking now", "ready to collect". Every customer feels looked after without you lifting a thumb.', gradient: ['#4f8ef7', '#a78bfa'] },
      { icon: '🔲', title: 'QR CODE MENU',         body: 'Plaster QR codes on your van/stall. Guests scan, browse, order, pay. No app install. No waiter dance.', gradient: ['#a78bfa', '#f87171'] },
      { icon: '🏷️', title: 'LOYALTY / REWARDS',   body: 'Points per dollar auto-tracked per phone number. "Every 10th burger free" without a paper card.', gradient: ['#fbbf24', '#fb923c'] },
      { icon: '💳', title: 'STRIPE PAYMENTS',      body: 'Money lands in your bank, not ours. Card + Apple Pay + Google Pay. 1.75% + $0.30.', gradient: ['#34d399', '#4f8ef7'] },
      { icon: '📍', title: 'LOCATION TRACKER',     body: '"Where\'s the truck today?" auto-updated map. Posts to socials with one tap.', gradient: ['#f87171', '#a78bfa'] },
      { icon: '📊', title: 'DAILY SALES DASHBOARD',body: 'Know top sellers, hours worth sitting open, average ticket. Decide tomorrow\'s prep based on today\'s data.', gradient: ['#2dd4bf', '#34d399'] },
      { icon: '🎁', title: 'CATERING / PRE-ORDER', body: 'Corporate gets its own "order 48h ahead" flow. Bigger tickets, zero phone chaos.', gradient: ['#fbbf24', '#f87171'] },
    ],
    why: [
      { icon: '⏰', title: 'CUSTOMERS HATE QUEUES', body: 'Average walk-away rate at busy food vans ≈ 30%. Pre-orders recover it.' },
      { icon: '🎤', title: 'YOU CAN COOK, NOT TYPE', body: 'Orders print themselves. Your hands stay on the grill, not on a phone keypad.' },
      { icon: '🔁', title: 'REPEAT BUSINESS',       body: 'SMS campaigns straight from the customer DB. "Back at the brewery Sat 12-3" → pre-orders flood in.' },
      { icon: '👥', title: 'EVENTS WANT THIS',      body: 'Markets and festivals favour vans with online ordering. One feature = more bookings.' },
    ],
    admin_time: [
      { task: 'Taking orders at the window',   before: '3 hrs',    after: '1 hr (pre-orders handle rest)', saves: '2.0 hrs' },
      { task: 'Dealing with "is it ready?"',    before: '1.5 hrs', after: '0 (auto SMS)',                    saves: '1.5 hrs' },
      { task: 'Paper docket chaos',             before: '1 hr',    after: '0 (digital KDS)',                 saves: '1.0 hrs' },
      { task: 'End-of-day reconciliation',     before: '1.5 hrs', after: '0.2 hr (auto report)',            saves: '1.3 hrs' },
    ],
    pricing: [
      { tier: 'SINGLE VAN', price_per_month: 79, setup: 499, features: [
        'Up to 500 orders / month', 'Live ordering + pickup times', 'Auto-SMS confirmations & ready alerts',
        'QR menu + loyalty points', 'Stripe payments', 'Your own domain', 'Daily sales dashboard',
      ], color: '#fbbf24' },
      { tier: 'FLEET / FRANCHISE', price_per_month: 159, setup: 499, popular: true, features: [
        'Unlimited orders + multiple locations', 'Staff logins per van', 'Catering / pre-order flow',
        'Loyalty campaigns + SMS broadcasts', 'Instagram + Facebook order buttons', 'Custom domain',
        'Featured on streetmeatz-style wall',
      ], color: '#f87171' },
    ],
  },

  'tradie': {
    id: 'tradie',
    brand: 'Tradie Field Service',
    tagline_top: 'YOUR TRADE BUSINESS,',
    tagline_bottom: 'RUNNING LIKE 2026.',
    descriptor: 'Quote → schedule → invoice in one. Live online booking. Auto-SMS. Rego lookup. Admin console on your phone. Your brand, your domain, your customers. Zero hardware.',
    kicker: 'MODERN FIELD SERVICE PLATFORM',
    industry_label: 'TRADIE APP · PROPOSAL',
    sell_point: 'Quote on site, book at the door, invoice before you leave the driveway.',
    accent_gradient: ['#fbbf24', '#fb923c', '#f87171'],
    icon_bg_gradient: ['#4f8ef7', '#a78bfa'],
    cta_color: '#fbbf24',
    live_url: 'https://wirezapp.au',
    stats: [
      { value: '+40%', label: 'FEWER NO-SHOWS',    sub: 'SMS reminders + deposit bookings',   color: '#fbbf24' },
      { value: '~8 HRS',label: 'ADMIN SAVED / WEEK',sub: 'No phone tag, no paper diary',       color: '#2dd4bf' },
      { value: '24/7', label: 'DIARY ALWAYS OPEN', sub: 'Customers book while you\'re on tools',color: '#f472b6' },
      { value: '100%', label: 'YOUR BRAND',        sub: 'Your logo, colours, domain',          color: '#fbbf24' },
    ],
    features: [
      { icon: '📅', title: 'LIVE ONLINE BOOKING',  body: 'Customers pick a slot that\'s actually free. No reception, no missed calls. You get an SMS the moment a booking lands.', gradient: ['#4f8ef7', '#34d399'] },
      { icon: '💬', title: 'AUTO SMS CONFIRM/REMIND', body: 'Booking confirm, day-before reminder, "is it ready?" follow-up. Every customer feels looked after without you lifting a thumb.', gradient: ['#fb923c', '#f472b6'] },
      { icon: '🎥', title: '30-SEC VIDEO WRAP-UPS', body: 'Record a quick walkaround at the end of every job. Texted straight to the customer as proof of work. Nobody else offers this.', gradient: ['#f472b6', '#a78bfa'] },
      { icon: '🔍', title: 'REGO AUTO-LOOKUP',      body: 'Customer types their plate, make/model/year auto-fills from the real rego database. 30 seconds saved per booking × every booking.', gradient: ['#4f8ef7', '#a78bfa'] },
      { icon: '💳', title: 'DEPOSIT-BACKED BOOKINGS',body: 'A small deposit (you set the amount) holds every slot and lands in your Stripe account before any work starts. Cuts no-shows, funds cash flow.', gradient: ['#a78bfa', '#4f8ef7'] },
      { icon: '👥', title: 'ADMIN CONSOLE, ANY DEVICE',body: 'Drag-and-drop calendar, customer CRM, SMS composer, email templates, content editor. Runs on your phone, tablet or laptop.', gradient: ['#a78bfa', '#4f8ef7'] },
      { icon: '🧰', title: 'WORKSHOP PHONE MODE',    body: 'Optimised screen for a bench phone — tap today\'s job, big record button, send. Made for greasy hands, not desk chairs.', gradient: ['#4f8ef7', '#34d399'] },
      { icon: '✨', title: 'AI CHAT ASSISTANT',     body: 'Virtual tradie answers customer questions on your site 24/7 — diagnoses from symptoms, nudges them to book. Your voice, tuned to your services.', gradient: ['#a78bfa', '#4f8ef7'] },
    ],
    why: [
      { icon: '🚫', title: 'NO-SHOW RATES ARE BRUTAL', body: 'No-shows cost trades ~$250 of bay time each. One recovered no-show/month pays the entire platform.' },
      { icon: '☎️', title: 'MISSED CALLS ARE MONEY LOST', body: 'A live calendar captures it. A voicemail loses it to the next tradie in Google.' },
      { icon: '🔁', title: 'REPEAT WORK VIA ADVISORIES', body: 'Video wrap-ups flag future work in a way customers trust. Higher lifetime value, lower marketing spend.' },
      { icon: '🚗', title: 'FLEET CUSTOMERS WANT THIS',  body: 'Fleet managers actively choose trades with SMS updates + online scheduling. One fleet account = dozens of services / year.' },
    ],
    admin_time: [
      { task: 'Answering booking calls',   before: '2.5 hrs', after: '~0',                 saves: '2.5 hrs' },
      { task: 'Manual SMS reminders',      before: '1 hr',    after: '0 (automated)',      saves: '1.0 hrs' },
      { task: 'Rego paperwork',            before: '1 hr',    after: '0 (auto-lookup)',    saves: '1.0 hrs' },
      { task: 'Whiteboard / diary admin',  before: '1 hr',    after: '~0.2 hr',            saves: '0.8 hrs' },
    ],
    pricing: [
      { tier: 'SOLO WORKSHOP', price_per_month: 99, setup: 499, features: [
        'Up to 100 bookings / month', 'Live booking calendar + deposits', 'Auto-SMS confirmations, reminders, pickup',
        'Video wrap-ups + customer viewer', 'Rego auto-lookup included', 'Your own domain', 'Single admin login',
      ], color: '#fbbf24' },
      { tier: 'MULTI-BAY / FLEET', price_per_month: 199, setup: 499, popular: true, features: [
        'Unlimited bookings', 'Fleet account billing + invoicing', 'Multiple staff logins',
        'AI chat assistant included', 'Featured drivers gallery', 'Priority support',
      ], color: '#2dd4bf' },
    ],
  },

  'online-store': {
    id: 'online-store',
    brand: 'Online Store',
    tagline_top: 'YOUR LITTLE SHOP,',
    tagline_bottom: 'SELLING WHILE YOU SLEEP.',
    descriptor: 'Branded product catalogue. Stripe checkout. Auto-SMS shipping updates. Inventory you actually understand. Your domain, your customers, zero Shopify tax.',
    kicker: 'MODERN ONLINE STORE',
    industry_label: 'STORE APP · PROPOSAL',
    sell_point: 'Leave Shopify. Keep Stripe. Own your customer list forever.',
    accent_gradient: ['#34d399', '#2dd4bf', '#4f8ef7'],
    icon_bg_gradient: ['#34d399', '#2dd4bf'],
    cta_color: '#34d399',
    live_url: 'https://picklenick.au',
    stats: [
      { value: '+28%', label: 'CONVERSION',    sub: 'Vs Shopify default theme',     color: '#34d399' },
      { value: '0%',   label: 'PLATFORM FEES', sub: 'You keep every dollar Stripe lets through', color: '#4f8ef7' },
      { value: '1 DAY',label: 'TO LAUNCH',     sub: 'From yes to live, not weeks',  color: '#fbbf24' },
      { value: '100%', label: 'YOUR DATA',     sub: 'Customer list lives in your DB',color: '#a78bfa' },
    ],
    features: [
      { icon: '🛒', title: 'PRODUCT CATALOGUE',    body: 'Photos, variants, stock, discounts. Built for products that actually sell — not enterprise SKU matrices.', gradient: ['#34d399', '#2dd4bf'] },
      { icon: '💳', title: 'STRIPE CHECKOUT',      body: 'Apple Pay, Google Pay, card. Money in your account the same day. No 2.9% Shopify cut.', gradient: ['#4f8ef7', '#a78bfa'] },
      { icon: '📦', title: 'LOCAL DELIVERY + PICKUP',body: 'Order radius by postcode, customer pickup windows, Australia Post / StarTrack labels auto-generated.', gradient: ['#fbbf24', '#fb923c'] },
      { icon: '💬', title: 'ORDER SMS UPDATES',    body: '"Received", "packed", "shipped with tracking". Auto-sent from your number. 1/3 fewer "where\'s my order?" emails.', gradient: ['#f472b6', '#a78bfa'] },
      { icon: '🎁', title: 'DISCOUNT CODES',        body: 'Percentage, fixed, free shipping, first-timer. Social-shareable with one click.', gradient: ['#fb923c', '#f472b6'] },
      { icon: '📊', title: 'BEST-SELLERS DASHBOARD',body: 'Live graph of what\'s moving. Decide what to restock before the spreadsheet tells you.', gradient: ['#2dd4bf', '#34d399'] },
      { icon: '📧', title: 'EMAIL / SMS CAMPAIGNS', body: 'Build a list, blast a new drop. No Klaviyo subscription, no 2500-contact cap.', gradient: ['#4f8ef7', '#2dd4bf'] },
      { icon: '🤝', title: 'WHOLESALE / B2B LOGINS',body: 'Trade customers log in for trade prices. Same checkout, different margins.', gradient: ['#a78bfa', '#4f8ef7'] },
    ],
    why: [
      { icon: '💸', title: 'SHOPIFY TAX IS REAL',   body: 'Basic plan $51/mo + apps + fees. Our one-off beats year-1 Shopify on deal 1.' },
      { icon: '🔑', title: 'OWN YOUR CUSTOMER LIST',body: 'Shopify can suspend your account. Ours: customer data lives in YOUR Cloudflare database.' },
      { icon: '🎨', title: 'ACTUALLY LOOKS LIKE YOU',body: 'Not a theme store template every third store uses. Built around your brand, not the other way around.' },
      { icon: '⚡', title: 'FAST. SERIOUSLY FAST.', body: 'Cloudflare edge + Stripe checkout = page loads under 1s globally. Shopify averages 3-5.' },
    ],
    admin_time: [
      { task: 'Answering "where\'s my order"', before: '2 hrs',   after: '0.2 hr (auto SMS)',    saves: '1.8 hrs' },
      { task: 'Updating stock manually',        before: '1.5 hrs', after: '0.3 hr (bulk CSV)',    saves: '1.2 hrs' },
      { task: 'Running discount campaigns',     before: '1 hr',    after: '10 min (built-in)',    saves: '0.8 hrs' },
      { task: 'Exporting customer list',        before: '30 min',  after: '1 click',               saves: '0.5 hrs' },
    ],
    pricing: [
      { tier: 'STARTER STORE', price_per_month: 79, setup: 499, features: [
        'Up to 100 products', 'Stripe checkout + discount codes', 'Order SMS updates',
        'Your own domain', 'Single admin login', 'Daily backups',
      ], color: '#34d399' },
      { tier: 'GROWING BRAND', price_per_month: 149, setup: 499, popular: true, features: [
        'Unlimited products + variants', 'Wholesale / B2B logins', 'SMS + email campaigns',
        'Auto Australia Post labels', 'Multiple staff logins', 'Priority support',
      ], color: '#4f8ef7' },
    ],
  },

  'festival': {
    id: 'festival',
    brand: 'Festival & Event App',
    tagline_top: 'YOUR EVENT,',
    tagline_bottom: 'IN EVERY POCKET.',
    descriptor: 'Tickets. Schedule. Vendor map. Push alerts. QR-scan gate entry. Your branding, not someone else\'s Eventbrite wrapper.',
    kicker: 'MODERN EVENT PLATFORM',
    industry_label: 'EVENT APP · PROPOSAL',
    sell_point: 'One app from ticket purchase to "where do I park?" to "meet you at the main stage".',
    accent_gradient: ['#a78bfa', '#f472b6', '#f87171'],
    icon_bg_gradient: ['#a78bfa', '#f472b6'],
    cta_color: '#a78bfa',
    live_url: 'https://gladstonebbqfest.au',
    stats: [
      { value: '5-20%', label: 'MORE TICKET SALES', sub: 'Your own checkout, not Eventbrite\'s fees',color: '#a78bfa' },
      { value: '70%',   label: 'APP ADOPTION',      sub: 'Attendees actually open it day-of',       color: '#34d399' },
      { value: '0',     label: 'PRINTED PROGRAMS',  sub: 'Live schedule, swap at a tap',            color: '#fbbf24' },
      { value: '100%',  label: 'YOUR DATA',         sub: 'Keep the attendee list post-event',       color: '#f472b6' },
    ],
    features: [
      { icon: '🎟️', title: 'TICKET SALES + STRIPE', body: 'Your Stripe account, your bank. Not Eventbrite\'s 3.5% + $1.79/ticket rinse. Physical + digital + VIP.', gradient: ['#34d399', '#4f8ef7'] },
      { icon: '📅', title: 'LIVE SCHEDULE',         body: 'Multi-stage schedule. Attendees favourite sessions, get reminders 10 min before. Update from backstage in real time.', gradient: ['#a78bfa', '#4f8ef7'] },
      { icon: '🗺️', title: 'VENDOR MAP',            body: 'Interactive site map with pin-drops. "Where\'s food?" "Toilets?" "Lost kid?" — answered visually.', gradient: ['#fb923c', '#fbbf24'] },
      { icon: '📢', title: 'PUSH ALERTS',           body: 'Weather change, stage shift, lost property. Reach every attendee instantly. Optional SMS broadcast fallback.', gradient: ['#f472b6', '#a78bfa'] },
      { icon: '📱', title: 'QR GATE SCANNING',      body: 'Volunteer at the gate with a phone. Scan → green tick / red cross. Two-factor for VIP.', gradient: ['#34d399', '#2dd4bf'] },
      { icon: '🍺', title: 'VENDOR ORDER APP',      body: 'Every food vendor gets their own ordering flow — patrons order from their seat on the hill.', gradient: ['#fbbf24', '#f87171'] },
      { icon: '⭐', title: 'POST-EVENT REVIEWS',     body: 'Auto-push survey 2h after event. Honest feedback → better next year → more sponsors.', gradient: ['#f472b6', '#fbbf24'] },
      { icon: '🎁', title: 'SPONSOR ZONES',          body: 'Give every sponsor a dedicated in-app page. Clicks tracked. Sell it next year for more.', gradient: ['#4f8ef7', '#a78bfa'] },
    ],
    why: [
      { icon: '💸', title: 'EVENTBRITE FEES ARE HUGE', body: 'At $40 ticket × 500 = $895 in fees. Our whole platform costs less than that.' },
      { icon: '📞', title: 'YOU NEED REAL-TIME COMMS', body: 'Weather changes, lineups shift, lost kids. Push-to-app beats "check our socials".' },
      { icon: '🎪', title: 'SPONSORS PAY MORE',        body: 'Trackable sponsor pages + click-through metrics = pitch deck ammunition for next year.' },
      { icon: '📋', title: 'YOUR LIST IS GOLD',        body: '1 event attendee = 3 years of marketing to them. Eventbrite doesn\'t share. We do.' },
    ],
    admin_time: [
      { task: 'Printed program reprints',        before: '3 hrs', after: '0 (digital)',      saves: '3.0 hrs' },
      { task: 'Answering same 10 questions',    before: '5 hrs', after: '0.5 hr (AI FAQ)',  saves: '4.5 hrs' },
      { task: 'Vendor check-in + payout',       before: '2 hrs', after: '0.3 hr (auto)',    saves: '1.7 hrs' },
      { task: 'Pulling attendee reports',       before: '1 hr',  after: '1 click',          saves: '1.0 hrs' },
    ],
    pricing: [
      { tier: 'SINGLE EVENT', price_per_month: 199, setup: 999, features: [
        'Up to 2,000 attendees', 'Ticket sales + Stripe', 'Live schedule + vendor map',
        'QR gate scanning', 'Push + SMS broadcasts', 'Your own domain',
      ], color: '#a78bfa' },
      { tier: 'FESTIVAL / MULTI-EVENT', price_per_month: 399, setup: 999, popular: true, features: [
        'Unlimited attendees + events / year', 'Sponsor zones + click tracking', 'Post-event review auto-survey',
        'Multi-stage scheduling', 'White-label mobile apps (iOS + Android)', 'Priority support',
      ], color: '#f472b6' },
    ],
  },

  'delivery': {
    id: 'delivery',
    brand: 'Delivery & Logistics',
    tagline_top: 'YOUR DELIVERY RUN,',
    tagline_bottom: 'ON THE MAP.',
    descriptor: 'Live driver tracking. Route planning. Customer signatures. SMS ETAs. Admin console for the whole fleet. Your brand, no third-party courier fees.',
    kicker: 'MODERN DELIVERY PLATFORM',
    industry_label: 'DELIVERY APP · PROPOSAL',
    sell_point: 'Customers see the truck coming. You see every driver\'s day in one glance.',
    accent_gradient: ['#4f8ef7', '#2dd4bf', '#34d399'],
    icon_bg_gradient: ['#4f8ef7', '#2dd4bf'],
    cta_color: '#4f8ef7',
    live_url: 'https://oconnoragriculture.com.au',
    stats: [
      { value: '3×',    label: 'FEWER "WHERE\'S MY ORDER" CALLS', sub: 'Live tracking kills the question', color: '#4f8ef7' },
      { value: '~10hrs',label: 'ADMIN SAVED / WK',                  sub: 'Auto-route + auto-SMS',           color: '#2dd4bf' },
      { value: '99.2%', label: 'ON-TIME RATE',                      sub: 'Route optimised per run',         color: '#34d399' },
      { value: '100%',  label: 'YOUR DRIVERS',                      sub: 'No DoorDash / Uber cut',          color: '#fbbf24' },
    ],
    features: [
      { icon: '📍', title: 'LIVE DRIVER TRACKING',  body: 'Customers follow the truck on a map, like Domino\'s Pizza Tracker for your run. No phone needed.', gradient: ['#4f8ef7', '#a78bfa'] },
      { icon: '🛣️', title: 'ROUTE OPTIMISER',      body: '30 drops sorted by fastest route. Driver sees next stop in big text. "Done" button moves on.', gradient: ['#34d399', '#2dd4bf'] },
      { icon: '✍️', title: 'SIGNATURE + PHOTO POD', body: 'Proof of delivery with photo and signature, auto-emailed to customer. Disputes cut 90%.', gradient: ['#f472b6', '#a78bfa'] },
      { icon: '💬', title: 'SMS ETAS',             body: '"Your order is 3 stops away" SMS fires automatically. No driver messaging.', gradient: ['#fb923c', '#f472b6'] },
      { icon: '👥', title: 'DRIVER APP (MOBILE)',  body: 'Phone-optimised. Swipe to deliver. Picks up photos + signatures. Works offline + syncs.', gradient: ['#4f8ef7', '#34d399'] },
      { icon: '📊', title: 'FLEET DASHBOARD',      body: 'Every driver\'s progress on one screen. Reassign drops with a drag. See delays before they become complaints.', gradient: ['#2dd4bf', '#4f8ef7'] },
      { icon: '🧾', title: 'CUSTOMER PORTAL',       body: 'Customer logs in, schedules next delivery, views history, changes address. One less phone call.', gradient: ['#a78bfa', '#4f8ef7'] },
      { icon: '🔁', title: 'RECURRING DROPS',       body: 'Weekly / monthly delivery runs auto-schedule. Customer can pause, resume, change.', gradient: ['#fbbf24', '#fb923c'] },
    ],
    why: [
      { icon: '📞', title: '"WHERE\'S MY ORDER" KILLS YOUR DAY', body: 'Live tracking eliminates 70-80% of those calls. That\'s hours back to you.' },
      { icon: '💵', title: 'NO THIRD-PARTY FEES',                body: 'DoorDash / Uber Drive take 30%. Your drivers, your customers, your margins.' },
      { icon: '🛡️', title: 'DISPUTES DROP HARD',                body: 'Photo + signature = no more "I never got it". Chargebacks drop, cash flow improves.' },
      { icon: '🗺️', title: 'SCALING IS TRIVIAL',                body: 'Add a driver? One login. Add a truck? One checkbox. No enterprise bolt-on hell.' },
    ],
    admin_time: [
      { task: '"Where\'s my order" calls',  before: '4 hrs',   after: '0.5 hr',              saves: '3.5 hrs' },
      { task: 'Manual route planning',      before: '3 hrs',   after: '15 min (auto)',       saves: '2.75 hrs' },
      { task: 'Signing POD / chasing',      before: '2 hrs',   after: '0 (app does it)',     saves: '2.0 hrs' },
      { task: 'End-of-day reconciliation',  before: '1.5 hrs', after: '0.3 hr (auto)',       saves: '1.2 hrs' },
    ],
    pricing: [
      { tier: 'SOLO / FLEET-OF-2', price_per_month: 149, setup: 799, features: [
        'Up to 200 deliveries / month', 'Live tracking + driver app', 'SMS ETAs + customer portal',
        'Photo + signature POD', 'Your own domain', 'Single admin login',
      ], color: '#4f8ef7' },
      { tier: 'MULTI-TRUCK / LOGISTICS', price_per_month: 349, setup: 799, popular: true, features: [
        'Unlimited deliveries', 'Multi-driver dispatch + route optimiser', 'Recurring delivery automation',
        'Customer portal + self-service', 'API for your existing ERP', 'Priority support',
      ], color: '#2dd4bf' },
    ],
  },

  'car-hire': {
    id: 'car-hire',
    brand: 'Car Hire & Rentals',
    tagline_top: 'YOUR RENTAL YARD,',
    tagline_bottom: 'KEYS IN 2 MINUTES FLAT.',
    descriptor: 'Vehicle browsing. Date-range booking. License upload. Stripe deposit. SMS at pickup. Auto-invoice on return. Drop-in for an existing rental yard. Owner gets a fleet calendar with blackouts, customers get keys without a queue.',
    kicker: 'MODERN CAR-HIRE PLATFORM',
    industry_label: 'CAR-HIRE APP · PROPOSAL',
    sell_point: 'Daily, weekend, week — keys in 2 minutes flat. No counter queue, no franchise tax.',
    accent_gradient: ['#0ea5e9', '#06b6d4', '#fbbf24'],
    icon_bg_gradient: ['#0ea5e9', '#06b6d4'],
    cta_color: '#06b6d4',
    live_url: 'https://yapoonauto.com.au',
    stats: [
      { value: '+45%', label: 'DIRECT BOOKINGS', sub: 'Skip Turo / Hertz portal cuts',         color: '#06b6d4' },
      { value: '~9 HRS',label: 'ADMIN SAVED / WK',sub: 'No paper rental agreements',           color: '#0ea5e9' },
      { value: '24/7', label: 'RESERVE & PAY',   sub: 'License upload + deposit before arrival',color: '#fbbf24' },
      { value: '100%', label: 'YOUR FLEET',      sub: 'Your domain, your customer list',       color: '#34d399' },
    ],
    features: [
      { icon: '🚗', title: 'VEHICLE BROWSING',    body: 'Customers filter by date, type, seats, transmission. Photos, daily rate, weekly rate, included km — all on the listing page.', gradient: ['#0ea5e9', '#06b6d4'] },
      { icon: '📅', title: 'DATE-RANGE BOOKING',  body: 'Real calendar with blackouts, service days, and existing bookings already crossed off. Pick dates, see total + bond up-front.', gradient: ['#06b6d4', '#0ea5e9'] },
      { icon: '🪪', title: 'LICENSE UPLOAD + KYC',body: 'Customer photographs their licence + selfie at booking. You approve from the admin app. Pickup is faster because the paperwork already happened.', gradient: ['#fbbf24', '#fb923c'] },
      { icon: '💳', title: 'STRIPE DEPOSIT + BOND',body: 'Daily rate charged, bond pre-authorised. Deposit captured if no-show. Bond released automatically on clean return.', gradient: ['#34d399', '#06b6d4'] },
      { icon: '📱', title: 'SMS AT PICKUP',       body: 'Auto-text the morning of pickup with your address, gate code, and vehicle bay. The customer skips the counter — keys are in the lockbox.', gradient: ['#06b6d4', '#a78bfa'] },
      { icon: '🗓️', title: 'FLEET CALENDAR',      body: 'Every vehicle on a Gantt-style timeline — bookings, services, blackouts. Drag to reassign, see utilisation per car at a glance.', gradient: ['#0ea5e9', '#fbbf24'] },
      { icon: '🧾', title: 'AUTO-INVOICE ON RETURN',body: 'Mileage in, fuel in, damage notes in — invoice goes out via email + SMS automatically. Bond top-up captured by Stripe if needed.', gradient: ['#fbbf24', '#06b6d4'] },
      { icon: '🎁', title: 'PROMO CODES + PARTNERS', body: 'Resort + airbnb partner discount codes. Track redemptions per partner, settle with them monthly.', gradient: ['#a78bfa', '#0ea5e9'] },
    ],
    why: [
      { icon: '💸', title: 'TURO TAKES UP TO 35%',   body: 'Turo bill costs ~25–35% per rental — at $200/day on a popular SUV that\'s $50–70/day gone. Direct bookings keep every dollar minus Stripe.' },
      { icon: '📞', title: 'COUNTER QUEUES KILL TRUST',body: 'Hertz/Avis make customers queue at 7am after a 6-hour drive. Lockbox + SMS pickup is the new bar — small yards win on this alone.' },
      { icon: '🛡️', title: 'BOND DRAMA DROPS HARD',  body: 'Pre-auth + photo damage notes = no he-said-she-said when they bring it back with a scratch. Stripe handles the dispute trail.' },
      { icon: '📍', title: 'TOURIST TOWNS WIN BIG',  body: 'Yeppoon, Airlie, Noosa, Margaret River — regional fleets compete on price and "actually answer the phone". Online booking closes that gap.' },
    ],
    admin_time: [
      { task: 'Manual booking calls',         before: '4 hrs',   after: '0.5 hr',                 saves: '3.5 hrs' },
      { task: 'Paper licence/agreement intake',before: '2.5 hrs',after: '0 (uploaded at booking)',saves: '2.5 hrs' },
      { task: 'Bond capture / refund admin',  before: '1.5 hrs', after: '0.2 hr (Stripe auto)',   saves: '1.3 hrs' },
      { task: 'Calendar reconciliation',      before: '2 hrs',   after: '0.3 hr (live calendar)', saves: '1.7 hrs' },
    ],
    pricing: [
      { tier: 'SOLO YARD', price_per_month: 129, setup: 499, features: [
        'Up to 10 vehicles', 'Date-range booking + Stripe deposits', 'Licence + KYC upload',
        'Auto-SMS pickup + return', 'Fleet calendar + blackouts', 'Your own domain', 'Single admin login',
      ], color: '#06b6d4' },
      { tier: 'FLEET (10+ VEHICLES)', price_per_month: 269, setup: 499, popular: true, features: [
        'Unlimited vehicles + locations', 'Multi-yard staff logins', 'Promo codes + partner tracking',
        'Auto-invoice on return + bond settlement', 'Damage / fuel / km audit log', 'Priority support',
      ], color: '#0ea5e9' },
    ],
  },

  'butchers': {
    id: 'butchers',
    brand: 'Butcher Shop & Online Orders',
    tagline_top: 'YOUR BUTCHER SHOP,',
    tagline_bottom: 'OPEN WHILE YOU\'RE BREAKING DOWN.',
    descriptor: 'Browse cuts by category. Custom-weight requests. Freezer pack bundles. Click & collect or local delivery. SMS when ready. Loyalty per kilo. Owner gets a weekly specials editor + auto-stocktake from sales.',
    kicker: 'MODERN BUTCHER SHOP PLATFORM',
    industry_label: 'BUTCHER APP · PROPOSAL',
    sell_point: 'Custom cuts, freezer packs, ordered online — picked up Friday with the dog walked.',
    accent_gradient: ['#dc2626', '#b91c1c', '#d97706'],
    icon_bg_gradient: ['#dc2626', '#b91c1c'],
    cta_color: '#dc2626',
    live_url: 'https://moeysmeats.com.au',
    stats: [
      { value: '+38%', label: 'AVG ORDER VALUE',  sub: 'Freezer packs vs walk-in single cuts',color: '#dc2626' },
      { value: '~7 HRS',label: 'ADMIN SAVED / WK',sub: 'No phone tag for custom orders',     color: '#d97706' },
      { value: '24/7',  label: 'STOREFRONT OPEN', sub: 'Customers order weekend nights',      color: '#fbbf24' },
      { value: '100%',  label: 'YOUR MARGIN',     sub: 'No Shopify Local Delivery app tax',   color: '#b91c1c' },
    ],
    features: [
      { icon: '🥩', title: 'CUTS BY CATEGORY',     body: 'Beef, lamb, pork, chicken, smallgoods. Photos, $/kg, marbling notes. Filter by "ready Friday", "custom-cut", "wholesale".', gradient: ['#dc2626', '#b91c1c'] },
      { icon: '⚖️', title: 'CUSTOM-WEIGHT REQUESTS',body: '"~1.2kg ribeye, trimmed". Customer types target weight; you confirm actual weight + price at the block. Stripe top-up captured on completion.', gradient: ['#b91c1c', '#dc2626'] },
      { icon: '📦', title: 'FREEZER PACK BUNDLES', body: '$150 mixed pack, $250 family pack, $400 quarter beast. Build templates once, sell every week. Stock-controlled.', gradient: ['#d97706', '#fbbf24'] },
      { icon: '🛍️', title: 'CLICK & COLLECT + DELIVERY',body: 'Friday-collect timeslots, local-radius delivery (you set the postcodes), driver app for the apprentice doing the runs.', gradient: ['#dc2626', '#d97706'] },
      { icon: '💬', title: 'SMS WHEN READY',       body: '"Your custom-cut ribeye is bagged and in the cool room — collect any time before 5pm." Cuts the "is it ready?" calls dead.', gradient: ['#fbbf24', '#dc2626'] },
      { icon: '🏷️', title: 'WEEKLY SPECIALS EDITOR',body: 'Drag-and-drop the Tuesday specials, photo, price, valid-until. Posts auto-share to Facebook + Instagram with one button.', gradient: ['#b91c1c', '#d97706'] },
      { icon: '📊', title: 'AUTO-STOCKTAKE',       body: 'Every sale decrements stock. Tomorrow\'s mince forecast based on last 4 weeks. Reorder alerts when ribeye dips under 8kg.', gradient: ['#d97706', '#b91c1c'] },
      { icon: '🎯', title: 'LOYALTY BY THE KILO',  body: 'Buy 9 kilos of mince, the 10th is half-price. Phone-number-based, no plastic card, automated. Customers come back monthly without asking.', gradient: ['#dc2626', '#fbbf24'] },
    ],
    why: [
      { icon: '🛒', title: 'SHOPIFY ISN\'T BUILT FOR MEAT', body: 'Variable weight, custom cuts, freezer packs, and "ready Friday" don\'t fit Shopify\'s SKU model. Local Delivery app is $80/mo on top.' },
      { icon: '📞', title: 'CUSTOM ORDERS ARE PHONE TAG',  body: 'Most shops chase 20+ daily phone calls for "can you do me 1.5kg eye fillet". This kills the calls dead — written, signed, paid.' },
      { icon: '❄️', title: 'FREEZER PACKS = ANCHOR REVENUE',body: 'A $150 freezer pack is 4× the spend of a walk-in. Online makes them a one-tap repeat order — most shops underprice these badly.' },
      { icon: '📍', title: 'LOCAL = TRUST = LOYALTY',      body: 'Customers WANT to support local butchers but can\'t buy at 9pm Sunday when they remember. A web order on the couch beats Woolies in a Tuesday queue.' },
    ],
    admin_time: [
      { task: 'Phone orders / custom cuts',  before: '5 hrs',   after: '0.5 hr (orders queue)',  saves: '4.5 hrs' },
      { task: 'Manual stocktake on Sunday',  before: '2.5 hrs', after: '0 (auto)',                saves: '2.5 hrs' },
      { task: 'Reconciling Friday collect',  before: '1 hr',    after: '0.2 hr (auto-marked)',    saves: '0.8 hrs' },
      { task: 'Posting weekly specials',     before: '1.5 hrs', after: '15 min (one editor)',     saves: '1.25 hrs' },
    ],
    pricing: [
      { tier: 'SINGLE SHOP', price_per_month: 99, setup: 499, features: [
        'Up to 200 SKUs + freezer packs', 'Custom-weight orders + Stripe top-up', 'Click & collect + local delivery',
        'Auto-SMS ready alerts', 'Weekly specials editor', 'Your own domain', 'Single admin login',
      ], color: '#dc2626' },
      { tier: 'MULTI-SHOP / WHOLESALE', price_per_month: 199, setup: 499, popular: true, features: [
        'Unlimited SKUs + multiple shops', 'Wholesale logins + restaurant accounts', 'Auto-stocktake + reorder alerts',
        'Loyalty per kilo + SMS broadcasts', 'Driver app for delivery runs', 'Priority support',
      ], color: '#b91c1c' },
    ],
  },

  'ai-social': {
    id: 'ai-social',
    brand: 'AI Social Platform',
    tagline_top: 'YOUR OWN SOCIAL,',
    tagline_bottom: 'WITHOUT FACEBOOK.',
    descriptor: 'Private community. AI moderation. Creator monetisation. Your domain, your rules, your terms. Quit the algorithm casino.',
    kicker: 'MODERN COMMUNITY PLATFORM',
    industry_label: 'COMMUNITY APP · PROPOSAL',
    sell_point: 'Build a community you own — not one Meta rents to you with ads.',
    accent_gradient: ['#f472b6', '#a78bfa', '#4f8ef7'],
    icon_bg_gradient: ['#f472b6', '#a78bfa'],
    cta_color: '#f472b6',
    live_url: 'https://socialaistudio.au',
    stats: [
      { value: '+60%',  label: 'ENGAGEMENT',        sub: 'Vs a Facebook group',            color: '#f472b6' },
      { value: '0',     label: 'ADS IN YOUR FACE',  sub: 'Ever. Unless you sell them.',    color: '#34d399' },
      { value: '24/7',  label: 'AI MODERATION',     sub: 'Nukes spam and abuse in seconds', color: '#a78bfa' },
      { value: '100%',  label: 'YOUR DATA',         sub: 'Meta cannot shadow-ban you',      color: '#4f8ef7' },
    ],
    features: [
      { icon: '💬', title: 'FEED + THREADS',        body: 'Feed, sub-channels, threaded replies, reactions, @mentions. Everything people expect.', gradient: ['#f472b6', '#a78bfa'] },
      { icon: '🛡️', title: 'AI MODERATION',         body: 'Every post scored for spam, abuse, off-topic in milliseconds. Auto-hide, auto-nuke, or queue for review.', gradient: ['#34d399', '#2dd4bf'] },
      { icon: '💎', title: 'PAID MEMBERSHIPS',       body: 'Free + paid tiers. Stripe-backed. Access-gated channels. Your creators keep 90-95%.', gradient: ['#fbbf24', '#fb923c'] },
      { icon: '📅', title: 'EVENTS + RSVPS',         body: 'Host IRL / online events. Members RSVP, get reminders. Optional paid tickets.', gradient: ['#4f8ef7', '#34d399'] },
      { icon: '🎁', title: 'CREATOR PAYOUTS',        body: 'Tip jar, course sales, PPV streams. Stripe Connect handles the money. Members trust your brand.', gradient: ['#f472b6', '#fbbf24'] },
      { icon: '📱', title: 'MOBILE APP READY',       body: 'PWA that installs from a button. Push notifications. Feels native without App Store tax.', gradient: ['#a78bfa', '#4f8ef7'] },
      { icon: '🔍', title: 'SEARCH + DISCOVERY',     body: 'Actually finds things. New-member onboarding flow points them at relevant channels.', gradient: ['#2dd4bf', '#a78bfa'] },
      { icon: '🎯', title: 'BROADCAST EMAILS',       body: 'Email your whole community about an event or drop. Resend-powered. Deliverable.', gradient: ['#fb923c', '#f472b6'] },
    ],
    why: [
      { icon: '📉', title: 'FACEBOOK REACH IS DEAD', body: 'Organic post reach on FB groups ≈ 5-10%. Yours: 100%, every post, every member.' },
      { icon: '💸', title: 'CREATORS DESERVE 95%',   body: 'Patreon takes 8-12%. We take 0% — Stripe processing only. Creators keep more, stay longer.' },
      { icon: '🚫', title: 'ZERO SHADOW-BANS',       body: 'Meta\'s algorithm isn\'t your ally. Your rules, your moderation, your community.' },
      { icon: '📊', title: 'REAL ANALYTICS',         body: 'Most-engaged members, hot threads, drop-off points. Build what the data tells you.' },
    ],
    admin_time: [
      { task: 'Moderating spam',          before: '5 hrs', after: '0.5 hr (AI does it)', saves: '4.5 hrs' },
      { task: 'Welcoming new members',    before: '2 hrs', after: '0 (auto-onboard)',    saves: '2.0 hrs' },
      { task: 'Pulling analytics',        before: '1 hr',  after: '1 click',             saves: '1.0 hrs' },
      { task: 'Chasing paid subs',        before: '1 hr',  after: '0 (Stripe)',          saves: '1.0 hrs' },
    ],
    pricing: [
      { tier: 'STARTER COMMUNITY', price_per_month: 99, setup: 799, features: [
        'Up to 500 members', 'Feed + threads + reactions', 'AI moderation included',
        'PWA mobile app', 'Your own domain', 'Email broadcasts',
      ], color: '#f472b6' },
      { tier: 'CREATOR-BACKED', price_per_month: 249, setup: 799, popular: true, features: [
        'Up to 10,000 members', 'Paid memberships + Stripe Connect', 'Multiple creator payouts',
        'Event ticketing', 'Push notifications + native-feel PWA', 'Priority support',
      ], color: '#a78bfa' },
    ],
  },

  'sports-club': {
    id: 'sports-club',
    brand: 'Sports Club Hub',
    tagline_top: 'YOUR CLUB,',
    tagline_bottom: 'IN EVERY PARENT\'S POCKET.',
    descriptor: 'Player profiles + stats + achievements (gamified). Fixtures with auto match-day reminders. In-app team chat. News + announcements. Parent registrations + payments. Coach team-sheets + lineup tools. Admin oversight + financials.',
    kicker: 'MODERN SPORTS CLUB PLATFORM',
    industry_label: 'CLUB APP · PROPOSAL',
    sell_point: 'One app for every parent, player, coach and committee member. Replaces TeamSnap + GameDay + Facebook + the carpark group chat.',
    accent_gradient: ['#1e40af', '#10b981', '#f59e0b'],
    icon_bg_gradient: ['#1e40af', '#10b981'],
    cta_color: '#10b981',
    live_url: 'https://yjrl.com.au',
    stats: [
      { value: '+72%', label: 'PARENT ENGAGEMENT', sub: 'Vs the old Facebook page',           color: '#10b981' },
      { value: '~12 HRS',label: 'SECRETARY HRS / WK',sub: 'Saved across rego, fees, fixtures',color: '#1e40af' },
      { value: '0',    label: 'NO-SHOW PARENTS',   sub: 'Auto match-day reminders + push',    color: '#f59e0b' },
      { value: '100%', label: 'CLUB-OWNED DATA',   sub: 'GameDay can\'t lock you out',        color: '#10b981' },
    ],
    features: [
      { icon: '🏉', title: 'PLAYER PROFILES + STATS', body: 'Every player gets a profile. Tries, runs, tackles, achievements. Gamified for the kids — they actually want to check the app.', gradient: ['#1e40af', '#10b981'] },
      { icon: '📅', title: 'FIXTURES + AUTO REMINDERS',body: 'Round-by-round draw, ground addresses with maps, auto push 90 min before kick-off. "Where do I drop them?" calls = zero.', gradient: ['#10b981', '#f59e0b'] },
      { icon: '💬', title: 'IN-APP TEAM CHAT',       body: 'One channel per team — coach, manager, parents, players. Replaces the WhatsApp group nobody can find. Moderated, exportable, club-controlled.', gradient: ['#f59e0b', '#1e40af'] },
      { icon: '📰', title: 'NEWS + ANNOUNCEMENTS',   body: 'Club admin posts ground closures, presentation night, fundraiser dates. Push notifications to every member. Pinned announcements stay top.', gradient: ['#1e40af', '#f59e0b'] },
      { icon: '💳', title: 'REGO + PAYMENTS',        body: 'Parents register kids end-to-end on the app. Stripe takes the rego fee + photo + medical. Sub-fee instalments by direct debit. Secretary stops chasing.', gradient: ['#10b981', '#1e40af'] },
      { icon: '👕', title: 'COACH TEAM-SHEET',       body: 'Coach drags players into positions for Saturday\'s lineup. Submit to the ref via PDF. Parents see who\'s starting, who\'s on the bench.', gradient: ['#f59e0b', '#10b981'] },
      { icon: '📊', title: 'COMMITTEE FINANCIALS',   body: 'Live view of rego received, fees outstanding, sponsor income, canteen takings. Treasurer\'s job goes from 8 hrs/week to 30 min reconciling.', gradient: ['#1e40af', '#10b981'] },
      { icon: '🏆', title: 'ACHIEVEMENTS + AWARDS',  body: 'Player of the match, 50-game milestone, hat-trick badges. Auto-pushed to the player\'s profile and parents\' news feed.', gradient: ['#f59e0b', '#1e40af'] },
    ],
    why: [
      { icon: '📞', title: 'TEAMSNAP/GAMEDAY ARE GENERIC', body: 'TeamSnap is built for US baseball, GameDay for AFL admin staff. Junior rugby league + Aussie community sport gets a half-built feature set.' },
      { icon: '👥', title: 'PARENTS WANT ONE APP',         body: 'Right now: Facebook for news + WhatsApp for team + GameDay for rego + email for fees. One app replaces four fragmented chats and parents stop missing things.' },
      { icon: '💸', title: 'REGO IS WHERE CLUBS BLEED',    body: 'GameDay\'s service fees + Stripe combo eat 6–8% of rego. On a club doing $40k/year that\'s ~$3k gone. Direct Stripe through the app keeps it.' },
      { icon: '🏟️', title: 'REGIONAL CLUBS PUNCH ABOVE',   body: 'Yeppoon, Gladstone, Mackay, Bundaberg — clubs that adopt this become the model. Federations notice. Sponsors notice. Players come back.' },
    ],
    admin_time: [
      { task: 'Chasing late rego payments',  before: '4 hrs',   after: '0.5 hr (Stripe auto)',   saves: '3.5 hrs' },
      { task: 'Posting fixtures + maps',     before: '2 hrs',   after: '0 (auto from draw)',     saves: '2.0 hrs' },
      { task: 'Match-day "where am I?" calls',before: '3 hrs',  after: '0.2 hr (push reminders)',saves: '2.8 hrs' },
      { task: 'Treasurer reconciliation',    before: '5 hrs',   after: '0.5 hr (live ledger)',   saves: '4.5 hrs' },
    ],
    pricing: [
      { tier: 'JUNIOR CLUB (≤200 PLAYERS)', price_per_month: 79, setup: 999, features: [
        'Up to 200 player profiles', 'Fixtures + push reminders', 'Team chat + news feed',
        'Stripe rego + sub-fee billing', 'Coach team-sheet builder', 'Your own domain',
      ], color: '#10b981' },
      { tier: 'SENIOR + JUNIOR (FEDERATION)', price_per_month: 199, setup: 999, popular: true, features: [
        'Unlimited players + grades', 'Multi-team / multi-club federation view', 'Sponsor pages + canteen takings',
        'Committee financial dashboard', 'Achievements / awards engine', 'Priority support',
      ], color: '#1e40af' },
    ],
  },
};

export const DEFAULT_PRODUCT_ID = 'tradie';
