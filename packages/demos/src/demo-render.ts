import type { ProductConfig } from '../products';

const esc = (s: string) => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] || c));

const VALIDATOR_URL = 'https://pennywiseit-validator.steve-700.workers.dev';

// Sample-data personas — each product type gets a fictional business
const SAMPLE_BRAND: Record<string, { name: string; tagline: string; suburb: string; phone: string; logo_emoji: string }> = {
  'food-truck':       { name: "Big Red's BBQ Cruiser",  tagline: 'Low & slow Texas-style BBQ — at a van near you',       suburb: 'Rockhampton',  phone: '0412 345 001', logo_emoji: '🌮' },
  'online-store':     { name: 'Bay City Pickle Co.',    tagline: 'Small-batch pickles, hot sauce &amp; ferments',         suburb: 'Yeppoon',      phone: '0412 345 002', logo_emoji: '🛒' },
  'tradie':           { name: "Sparky Mike's Electrical", tagline: 'Residential &amp; commercial sparkies — 24/7 callouts', suburb: 'Rockhampton',  phone: '0412 345 003', logo_emoji: '🔧' },
  'festival':         { name: 'Gladstone Summer Fest',  tagline: 'Three days of food, music &amp; market stalls',         suburb: 'Gladstone',    phone: '0412 345 004', logo_emoji: '🎪' },
  'delivery':         { name: 'Central QLD Courier Co.', tagline: 'Same-day pickup and delivery across Central QLD',      suburb: 'Rockhampton',  phone: '0412 345 005', logo_emoji: '🚚' },
  'ai-social':        { name: 'Rotary Mates',           tagline: 'A private community for rotary-engine tragics',         suburb: 'Global',       phone: '—',            logo_emoji: '🏁' },
  'car-hire':         { name: 'Yapoon Auto Rentals',    tagline: 'Daily, weekend, week — keys in 2 minutes flat',         suburb: 'Yeppoon',      phone: '0412 345 008', logo_emoji: '🚗' },
  'butchers':         { name: "Moey's Premium Meats",   tagline: 'Custom cuts, freezer packs, ordered online — picked up Friday', suburb: 'Yeppoon', phone: '0412 345 009', logo_emoji: '🥩' },
  'sports-club':      { name: 'Yeppoon Junior Rugby League', tagline: 'One app for every parent, player, coach &amp; committee member', suburb: 'Yeppoon', phone: '0412 345 010', logo_emoji: '🏉' },
};

// Per-product hero/nav configuration — defines the BUSINESS-side framing
// (what a real homepage for this kind of company would actually say).
type DemoChrome = {
  hero_benefit: string;
  primary_cta: { label: string; href: string };
  secondary_cta: { label: string; href: string };
  trust_pill: string;
  nav_links: { label: string; href: string }[];
};
const DEMO_CHROME: Record<string, DemoChrome> = {
  'food-truck': {
    hero_benefit: 'Pre-order before you arrive, skip the queue, get a text the moment it’s ready.',
    primary_cta:   { label: 'Order now ↓',    href: '#demo' },
    secondary_cta: { label: 'Book catering',  href: '#book' },
    trust_pill: '🟢 Open now · Ready in 10–15 min',
    nav_links: [
      { label: 'Menu',     href: '#demo' },
      { label: 'Find Us',  href: '#location' },
      { label: 'Catering', href: '#book' },
    ],
  },
  'online-store': {
    hero_benefit: 'Small-batch ferments, made in Yeppoon, shipped Australia-wide. Free over $60.',
    primary_cta:   { label: 'Shop the drop ↓', href: '#demo' },
    secondary_cta: { label: 'Get drop alerts', href: '#book' },
    trust_pill: '🚚 Free shipping over $60 · Ships Aus-wide',
    nav_links: [
      { label: 'Shop',       href: '#demo' },
      { label: 'Shipping',   href: '#shipping' },
      { label: 'Newsletter', href: '#book' },
    ],
  },
  'tradie': {
    hero_benefit: 'Licensed sparkies, real-time bookings, SMS confirmations. No phone tag.',
    primary_cta:   { label: 'Book a sparky ↓',       href: '#book' },
    secondary_cta: { label: 'After-hours emergency', href: '#demo' },
    trust_pill: '📅 Available this week · Licensed & insured',
    nav_links: [
      { label: 'Services', href: '#demo' },
      { label: 'Book Now', href: '#book' },
      { label: 'Reviews',  href: '#reviews' },
    ],
  },
  'festival': {
    hero_benefit: 'Three days of food, music & market stalls on the Gladstone Marina. 8–10 January.',
    primary_cta:   { label: 'Buy tickets ↓',  href: '#demo' },
    secondary_cta: { label: 'View schedule',  href: '#schedule' },
    trust_pill: '🎟 Early bird ends 1 Dec',
    nav_links: [
      { label: 'Tickets',  href: '#demo' },
      { label: 'Schedule', href: '#schedule' },
      { label: 'Vendors',  href: '#book' },
    ],
  },
  'delivery': {
    hero_benefit: 'Same-day pickup, live driver tracking, no DoorDash margin grab. Rocky to Yeppoon and back.',
    primary_cta:   { label: 'Track my order',    href: '#demo' },
    secondary_cta: { label: 'Schedule a pickup', href: '#book' },
    trust_pill: '🚚 Same-day Rocky–Yeppoon · Live tracking',
    nav_links: [
      { label: 'Track',       href: '#demo' },
      { label: 'Book Pickup', href: '#book' },
      { label: 'Drivers',     href: '#drivers' },
    ],
  },
  'ai-social': {
    hero_benefit: 'Rotary-engine talk for people who actually run them. No ads, no algorithm, no shadow-bans.',
    primary_cta:   { label: 'Join the Mates ↓', href: '#book' },
    secondary_cta: { label: 'Browse the feed',  href: '#demo' },
    trust_pill: '👥 1,247 members · 0 ads · 0 algorithm',
    nav_links: [
      { label: 'Feed',       href: '#demo' },
      { label: 'Join',       href: '#book' },
      { label: 'Moderation', href: '#moderation' },
    ],
  },
  'car-hire': {
    hero_benefit: 'Daily, weekend, or weeklong rentals from a small Yeppoon yard. Lockbox pickup, no counter queue, no franchise tax.',
    primary_cta:   { label: 'Reserve a vehicle ↓', href: '#demo' },
    secondary_cta: { label: 'Fleet calendar',      href: '#book' },
    trust_pill: '🟢 12 vehicles available this week',
    nav_links: [
      { label: 'Vehicles', href: '#demo' },
      { label: 'Book',     href: '#book' },
      { label: 'Locations',href: '#locations' },
    ],
  },
  'butchers': {
    hero_benefit: 'Tuesday block, Wednesday smallgoods, Friday freezer packs — order online, picked up after work.',
    primary_cta:   { label: 'Shop the block ↓',  href: '#demo' },
    secondary_cta: { label: 'Custom cut request',href: '#book' },
    trust_pill: '🟢 Open · Friday collect 7am–5pm',
    nav_links: [
      { label: 'Shop',         href: '#demo' },
      { label: 'Freezer Packs',href: '#book' },
      { label: 'Specials',     href: '#specials' },
    ],
  },
  'sports-club': {
    hero_benefit: 'Fixtures, rego, team chat, lineup tools — every parent, player, coach and committee member in one app.',
    primary_cta:   { label: 'See this week\'s fixtures ↓', href: '#demo' },
    secondary_cta: { label: 'Register a player',          href: '#book' },
    trust_pill: '🟢 Round 7 · Sat 5 May · 5 grades',
    nav_links: [
      { label: 'Fixtures', href: '#demo' },
      { label: 'Register', href: '#book' },
      { label: 'News',     href: '#news' },
    ],
  },
};

// Per-product narrative + mockup + differentiation + trust content.
// (Populated from the design squad's report — narrative copy verbatim.)
type DemoContent = {
  use_case: { scene: string; old_way: string; with_app: string; proof: string };
  hero_mockup: string;
  differentiation: { vs: string; points: Array<{ title: string; body: string }> };
  trust: {
    quote: string;
    quote_attr: string;
    stat_value: string;
    stat_label: string;
    before: string;
    after: string;
    icp_yes: string;
    icp_no: string;
  };
};

// Phone-frame chrome shared across all 8 mockups (60-540 outer bezel, 80-520 inner screen,
// notch 240-360, status text y=112, home-indicator pill y=800). Each product picks its
// gradient + screen content; chrome stays consistent so the page feels like a coherent set.
const DEMO_CONTENT: Record<string, DemoContent> = {
  'food-truck': {
    use_case: {
      scene:    "Friday 6:42pm. Big Red just got booked for the Yeppoon Sea Breeze Markets next Saturday — 4-hour pop-up, no second chances.",
      old_way:  "Hope a queue forms. Pray you've prepped enough brisket. Walk-aways from 12:30 onwards because the line scares people off.",
      with_app: "One SMS broadcast goes to 612 past customers — 'Markets Sat 11–3, pre-order now'. By Saturday morning: 73 pre-orders worth $2,140 already locked in. Each customer gets an auto-SMS at their pickup slot. No queue ever forms.",
      proof:    "You knew exactly how much brisket to smoke Friday night. Zero waste, zero walk-aways.",
    },
    hero_mockup: '<svg viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Food truck SMS lock-screen mockup">'
      + '<defs>'
      + '<linearGradient id="ft-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0a05"/><stop offset="1" stop-color="#0b0f1a"/></linearGradient>'
      + '<linearGradient id="ft-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2118"/><stop offset="1" stop-color="#0f0a06"/></linearGradient>'
      + '<linearGradient id="ft-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1a0a"/><stop offset="1" stop-color="#1a0a05"/></linearGradient>'
      + '</defs>'
      + '<rect x="60" y="40" width="480" height="820" rx="60" fill="url(#ft-bezel)" stroke="#3a2a1c" stroke-width="2"/>'
      + '<rect x="80" y="60" width="440" height="780" rx="44" fill="url(#ft-screen)"/>'
      + '<rect x="240" y="60" width="120" height="34" rx="17" fill="#0a0604"/>'
      + '<text x="300" y="112" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">9:41</text>'
      + '<text x="300" y="180" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="84" font-weight="300">Sat</text>'
      + '<text x="300" y="240" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="64" font-weight="200">11:42</text>'
      + '<g transform="translate(110,330)">'
      + '<rect width="380" height="160" rx="22" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)"/>'
      + '<circle cx="36" cy="36" r="18" fill="#ff6b35"/>'
      + '<text x="36" y="42" text-anchor="middle" fill="#1a0a05" font-family="Inter,sans-serif" font-size="20">🌮</text>'
      + '<text x="68" y="32" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="700">BIG RED&apos;S BBQ CRUISER</text>'
      + '<text x="350" y="32" text-anchor="end" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="11">now</text>'
      + '<text x="68" y="58" fill="rgba(255,255,255,0.7)" font-family="Inter,sans-serif" font-size="11" font-weight="600">Order #047 ready</text>'
      + '<text x="22" y="92" fill="#e8edf5" font-family="Inter,sans-serif" font-size="16" font-weight="600">Brisket roll + slaw is up</text>'
      + '<text x="22" y="116" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14">at the truck — pickup window</text>'
      + '<text x="22" y="136" fill="#ff6b35" font-family="Inter,sans-serif" font-size="14" font-weight="700">11:45–11:50am · Bay 2</text>'
      + '</g>'
      + '<g transform="translate(110,520)">'
      + '<rect width="380" height="80" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)"/>'
      + '<circle cx="36" cy="40" r="16" fill="rgba(255,107,53,0.4)"/>'
      + '<text x="36" y="46" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif" font-size="16">📱</text>'
      + '<text x="68" y="36" fill="rgba(255,255,255,0.7)" font-family="Inter,sans-serif" font-size="11" font-weight="700">PRE-ORDER CONFIRMED · $18.50</text>'
      + '<text x="68" y="58" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13">Paid via Stripe · Tap to view</text>'
      + '</g>'
      + '<rect x="220" y="800" width="160" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>'
      + '</svg>',
    differentiation: {
      vs: "Square POS, Order with Google",
      points: [
        { title: "Pre-orders before you arrive",
          body: "Square needs you parked + open before customers can order; ours sells out the next pop-up while you're still loading the truck." },
        { title: "SMS bundled, not metered",
          body: "Square charges per text via Twilio add-ons (~5c/SMS = $50+/mo on volume); our $79 plan bundles auto 'ready in 5' SMS at zero per-message cost." },
        { title: "Your .au domain forever",
          body: "Customers bookmark bigredsbbq.com.au, not order.square.site/bigredsbbq — your SEO juice, no upsell to a competing van on Google's order panel." },
      ],
    },
    trust: {
      quote: "Tripled my Friday night brisket sales without yelling once. Reckon I've got my voice back.",
      quote_attr: "Macca, Big Red's BBQ Cruiser, Rockhampton",
      stat_value: "$680",
      stat_label: "Average pre-order tally before the gennie even fires up",
      before: "Cash tin overflowing, EFTPOS dropped out, three blokes giving up and walking off.",
      after: "Phone pings, food's bagged, customer grabs it and goes. No queue, no chaos.",
      icp_yes: "Single van or trailer doing markets, footy nights, B&S balls — 30–250 orders a service",
      icp_no: "Sit-down food courts with waitstaff or anyone running Lightspeed/Square already",
    },
  },

  'online-store': {
    use_case: {
      scene:    "Sunday night. Bay City just bottled a 48-jar batch of Ferment #14 — habanero kraut, three months in the making.",
      old_way:  "Photograph it Monday, list on Shopify Advanced Tuesday — $79/mo plus six app subscriptions plus 2.9% + $0.30 per jar — watch it sell over a fortnight.",
      with_app: "Photo up at 8:14pm. SMS+email blast to 2,847 subscribers at 8:30pm. By 9:15pm: 41 jars sold at $18 each. Stripe deposits $738 the next morning — no platform cut.",
      proof:    "That's $145 you would've handed Shopify, kept. Every drop, forever.",
    },
    hero_mockup: '<svg viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Online store order tracking mockup">'
      + '<defs>'
      + '<linearGradient id="os-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2a25"/><stop offset="1" stop-color="#0a0f0c"/></linearGradient>'
      + '<linearGradient id="os-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1a14"/><stop offset="1" stop-color="#0a0f0c"/></linearGradient>'
      + '</defs>'
      + '<rect x="60" y="40" width="480" height="820" rx="60" fill="url(#os-bezel)" stroke="#2a3a35" stroke-width="2"/>'
      + '<rect x="80" y="60" width="440" height="780" rx="44" fill="url(#os-screen)"/>'
      + '<rect x="240" y="60" width="120" height="34" rx="17" fill="#000"/>'
      + '<text x="300" y="112" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">9:41</text>'
      + '<text x="110" y="160" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="11" font-weight="700" letter-spacing="1.5">ORDER #BC-2871</text>'
      + '<text x="110" y="200" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="28" font-weight="700">On its way</text>'
      + '<text x="110" y="226" fill="rgba(255,255,255,0.6)" font-family="Inter,sans-serif" font-size="13">ETA Tuesday 28 April</text>'
      + '<g transform="translate(110,270)">'
      + '<line x1="14" y1="14" x2="14" y2="240" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>'
      + '<circle cx="14" cy="14" r="10" fill="#10b981"/><text x="14" y="18" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">✓</text>'
      + '<text x="44" y="10" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1">PLACED</text>'
      + '<text x="44" y="28" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="600">Sun 26 Apr · 8:14pm</text>'
      + '<circle cx="14" cy="84" r="10" fill="#10b981"/><text x="14" y="88" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">✓</text>'
      + '<text x="44" y="80" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1">PACKED</text>'
      + '<text x="44" y="98" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="600">Mon 27 Apr · 9:02am</text>'
      + '<circle cx="14" cy="154" r="10" fill="#10b981" stroke="#10b981" stroke-width="3" opacity="0.95"/>'
      + '<text x="14" y="158" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">✓</text>'
      + '<text x="44" y="150" fill="#10b981" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1">SHIPPED</text>'
      + '<text x="44" y="168" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="700">AusPost · BCB938711</text>'
      + '<circle cx="14" cy="224" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>'
      + '<text x="44" y="220" fill="rgba(255,255,255,0.4)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1">DELIVERED</text>'
      + '<text x="44" y="238" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="13">Tue 28 Apr · est.</text>'
      + '</g>'
      + '<g transform="translate(110,610)">'
      + '<rect width="380" height="120" rx="18" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)"/>'
      + '<text x="20" y="32" fill="rgba(16,185,129,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">3 ITEMS</text>'
      + '<text x="20" y="60" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">2 × Habanero Kraut $36</text>'
      + '<text x="20" y="82" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">1 × Smoky Hot Sauce $12</text>'
      + '<text x="20" y="104" fill="#10b981" font-family="Space Grotesk,Inter,sans-serif" font-size="16" font-weight="800">$48.00 paid · Stripe</text>'
      + '</g>'
      + '<rect x="220" y="800" width="160" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>'
      + '</svg>',
    differentiation: {
      vs: "Shopify Advanced + apps",
      points: [
        { title: "Stripe direct, no 2% tax",
          body: "Shopify charges 2% extra on top of Stripe unless you use Shopify Payments — at $10k AUD/mo revenue that's $200/mo skimmed; ours: zero platform fee, Stripe's 1.75% + 30c only." },
        { title: "Apps included, not bolted on",
          body: "Klaviyo ($45+), Recharge ($60), wholesale app ($39) push real Shopify cost past $200/mo — our $149 Growing Brand bundles email/SMS, B2B logins and AusPost labels native." },
        { title: "Customer list in your D1",
          body: "Shopify can suspend an account and the list goes with it; ours runs on a Cloudflare D1 database in your account — export, port, or quit anytime, no hostage data." },
      ],
    },
    trust: {
      quote: "Switched off Shopify on a Tuesday. Saved $430 the first month and our checkout's actually faster.",
      quote_attr: "Jess, Bay City Pickle Co., Yeppoon",
      stat_value: "$0",
      stat_label: "Monthly platform fees vs ~$430/mo on Shopify Advanced + apps",
      before: "Paying $79 USD plus six app subscriptions to sell 40 jars a week.",
      after: "Flat hosting bill, Stripe takes its cut, the rest is mine.",
      icp_yes: "Single-maker brands, 20–500 SKUs, doing $2k–$30k/mo, sick of platform tax",
      icp_no: "Stores needing complex multi-warehouse, 3PL integrations, or B2B wholesale portals",
    },
  },

  'tradie': {
    use_case: {
      scene:    "Tuesday 2:30pm. Sparky Mike's halfway up a ladder in Gracemere when his phone rings for the fourth time today.",
      old_way:  "Voicemail. Caller goes to the next sparky in Google. Mike loses the job and never knows.",
      with_app: "Customer hits the site, picks Thursday 9am from a live calendar, pays $50 deposit. Mike gets an SMS at 2:31pm: 'New booking, $50 held, address in calendar.' He keeps wiring. Auto-reminder fires Wednesday night — the customer turns up.",
      proof:    "Three bookings landed while he was on tools today. Last week, that would've been three voicemails.",
    },
    hero_mockup: '<svg viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tradie booking confirmation mockup">'
      + '<defs>'
      + '<linearGradient id="tr-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#252118"/><stop offset="1" stop-color="#0e0c08"/></linearGradient>'
      + '<linearGradient id="tr-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#161310"/><stop offset="1" stop-color="#0a0908"/></linearGradient>'
      + '</defs>'
      + '<rect x="60" y="40" width="480" height="820" rx="60" fill="url(#tr-bezel)" stroke="#3a3424" stroke-width="2"/>'
      + '<rect x="80" y="60" width="440" height="780" rx="44" fill="url(#tr-screen)"/>'
      + '<rect x="240" y="60" width="120" height="34" rx="17" fill="#000"/>'
      + '<text x="300" y="112" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">9:41</text>'
      + '<g transform="translate(110,170)">'
      + '<circle cx="190" cy="55" r="48" fill="rgba(34,197,94,0.18)" stroke="rgba(34,197,94,0.4)" stroke-width="2"/>'
      + '<text x="190" y="72" text-anchor="middle" fill="#22c55e" font-family="Inter,sans-serif" font-size="48" font-weight="700">✓</text>'
      + '<text x="190" y="150" text-anchor="middle" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="24" font-weight="700">Booking confirmed</text>'
      + '<text x="190" y="178" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter,sans-serif" font-size="13">Job #SE-118</text>'
      + '</g>'
      + '<g transform="translate(110,400)">'
      + '<rect width="380" height="200" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>'
      + '<text x="22" y="34" fill="rgba(255,255,255,0.45)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">SERVICE</text>'
      + '<text x="22" y="56" fill="#e8edf5" font-family="Inter,sans-serif" font-size="15" font-weight="600">Switchboard upgrade</text>'
      + '<line x1="22" y1="76" x2="358" y2="76" stroke="rgba(255,255,255,0.08)"/>'
      + '<text x="22" y="100" fill="rgba(255,255,255,0.45)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">WHEN</text>'
      + '<text x="22" y="122" fill="#e8edf5" font-family="Inter,sans-serif" font-size="15" font-weight="600">Wed 30 Apr · 10:00am</text>'
      + '<line x1="22" y1="142" x2="358" y2="142" stroke="rgba(255,255,255,0.08)"/>'
      + '<text x="22" y="166" fill="rgba(255,255,255,0.45)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">DEPOSIT</text>'
      + '<text x="22" y="188" fill="#22c55e" font-family="Space Grotesk,Inter,sans-serif" font-size="18" font-weight="800">$50.00 paid</text>'
      + '<text x="358" y="188" text-anchor="end" fill="rgba(255,255,255,0.4)" font-family="Inter,sans-serif" font-size="11">Stripe · ✓</text>'
      + '</g>'
      + '<g transform="translate(110,620)">'
      + '<rect width="380" height="60" rx="14" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.25)"/>'
      + '<text x="20" y="26" fill="rgba(245,158,11,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">📱 SMS REMINDER</text>'
      + '<text x="20" y="46" fill="#e8edf5" font-family="Inter,sans-serif" font-size="12">Auto-fires Tuesday 6pm — confirms the slot</text>'
      + '</g>'
      + '<rect x="220" y="800" width="160" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>'
      + '</svg>',
    differentiation: {
      vs: "ServiceM8, Tradify",
      points: [
        { title: "Per-business, not per-seat",
          body: "ServiceM8 charges ~$29/user/month so a 4-tradie shop hits $116+/mo before SMS credits; our $199 Multi-Bay covers unlimited staff logins flat." },
        { title: "30-second video wrap-ups",
          body: "No incumbent ships proof-of-work video texted to the customer — flags future advisories the customer trusts, and one recovered no-show ($250 bay time) pays the platform." },
        { title: "Rego auto-lookup native",
          body: "ServiceM8/AroFlo make you type make/model/year manually; ours pulls it from the rego DB in 2 seconds — 30 seconds × every booking × every year." },
      ],
    },
    trust: {
      quote: "Quote out before I'm back in the ute. Cashflow's tidier than it's been in twenty years.",
      quote_attr: "Mike, Sparky Mike's Electrical, Rockhampton",
      stat_value: "4.2 days",
      stat_label: "Average invoice-to-paid (was 23 on the old paper book)",
      before: "Saturday morning at the kitchen table chasing invoices and arguing with the missus about it.",
      after: "Quote sent on the driveway, invoice goes the second I'm packed up.",
      icp_yes: "Sole trader or 2–4 hand crew — sparkies, plumbers, chippies doing residential + small commercial",
      icp_no: "Big builders running ServiceM8 + Xero already, or anyone needing detailed job costing across 50+ staff",
    },
  },

  'festival': {
    use_case: {
      scene:    "Saturday 3:14pm at Gladstone Summer Fest. A storm cell rolls in from the harbour — main stage needs to shift indoors in 20 minutes.",
      old_way:  "Run around with a megaphone. Post on Facebook. Hope 4,200 punters check their feeds in time. Refund threats start by 4pm.",
      with_app: "One push alert + SMS fallback fires to every ticket holder. 3,940 phones buzz at once with the new stage map. The schedule updates live in the app. Vendors see the notice and shuffle stock.",
      proof:    "Zero refund requests Monday. The sponsors saw 93% click-through on the alert and re-booked for next year on the spot.",
    },
    hero_mockup: '<svg viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Festival ticket scan mockup">'
      + '<defs>'
      + '<linearGradient id="fs-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f1525"/><stop offset="1" stop-color="#0a0610"/></linearGradient>'
      + '<linearGradient id="fs-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#170d20"/><stop offset="1" stop-color="#08040c"/></linearGradient>'
      + '</defs>'
      + '<rect x="60" y="40" width="480" height="820" rx="60" fill="url(#fs-bezel)" stroke="#2e1d3a" stroke-width="2"/>'
      + '<rect x="80" y="60" width="440" height="780" rx="44" fill="url(#fs-screen)"/>'
      + '<rect x="240" y="60" width="120" height="34" rx="17" fill="#000"/>'
      + '<text x="300" y="112" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">9:41</text>'
      + '<text x="300" y="160" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-family="Inter,sans-serif" font-size="11" font-weight="700" letter-spacing="2">YOUR TICKET</text>'
      + '<text x="300" y="190" text-anchor="middle" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="22" font-weight="700">Gladstone Summer Fest</text>'
      + '<g transform="translate(160,220)">'
      + '<rect width="280" height="280" rx="20" fill="#fff"/>'
      + '<g fill="#000">'
      + '<rect x="20" y="20" width="60" height="60"/><rect x="200" y="20" width="60" height="60"/><rect x="20" y="200" width="60" height="60"/>'
      + '<rect x="32" y="32" width="36" height="36" fill="#fff"/><rect x="40" y="40" width="20" height="20"/>'
      + '<rect x="212" y="32" width="36" height="36" fill="#fff"/><rect x="220" y="40" width="20" height="20"/>'
      + '<rect x="32" y="212" width="36" height="36" fill="#fff"/><rect x="40" y="220" width="20" height="20"/>'
      + '<rect x="100" y="20" width="12" height="12"/><rect x="120" y="32" width="12" height="12"/><rect x="140" y="20" width="12" height="12"/><rect x="160" y="40" width="12" height="12"/>'
      + '<rect x="100" y="60" width="12" height="12"/><rect x="140" y="60" width="12" height="12"/><rect x="180" y="80" width="12" height="12"/>'
      + '<rect x="100" y="100" width="20" height="20"/><rect x="140" y="100" width="12" height="12"/><rect x="180" y="120" width="12" height="12"/>'
      + '<rect x="100" y="140" width="12" height="12"/><rect x="120" y="140" width="20" height="20"/><rect x="160" y="160" width="12" height="12"/>'
      + '<rect x="100" y="180" width="12" height="20"/><rect x="140" y="180" width="20" height="12"/><rect x="180" y="200" width="20" height="20"/>'
      + '<rect x="100" y="220" width="12" height="12"/><rect x="140" y="220" width="12" height="20"/><rect x="180" y="240" width="12" height="12"/>'
      + '<rect x="220" y="100" width="20" height="20"/><rect x="220" y="140" width="12" height="12"/><rect x="220" y="180" width="12" height="12"/><rect x="220" y="220" width="20" height="20"/>'
      + '</g>'
      + '</g>'
      + '<g transform="translate(110,540)">'
      + '<rect width="380" height="60" rx="30" fill="#22c55e"/>'
      + '<text x="190" y="38" text-anchor="middle" fill="#0a0908" font-family="Space Grotesk,Inter,sans-serif" font-size="22" font-weight="800">✓ ADMIT — VALID</text>'
      + '</g>'
      + '<g transform="translate(110,630)">'
      + '<text x="0" y="20" fill="rgba(255,255,255,0.45)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">3-DAY PASS · SECTION A4</text>'
      + '<text x="0" y="50" fill="#e8edf5" font-family="Inter,sans-serif" font-size="15" font-weight="600">Sarah Mitchell</text>'
      + '<text x="0" y="74" fill="rgba(255,255,255,0.55)" font-family="Inter,sans-serif" font-size="12">Ticket #GSF-26-01-A412</text>'
      + '</g>'
      + '<rect x="220" y="800" width="160" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>'
      + '</svg>',
    differentiation: {
      vs: "Eventbrite, Humanitix",
      points: [
        { title: "Flat fee beats per-ticket cut",
          body: "Eventbrite is 3.5% + $1.79/ticket — at 500 × $40 tickets that's $895 in fees; our $399/mo Festival tier is less than half that and scales unlimited." },
        { title: "Push alerts, not 'check our socials'",
          body: "Eventbrite has no day-of comms layer; weather shifts and stage changes go via Instagram and miss half the crowd — ours pushes notifications + SMS fallback to every attendee instantly." },
        { title: "Sponsor pages with click data",
          body: "Eventbrite gives sponsors a logo at the bottom of an email; ours gives each sponsor a tracked in-app page — clickthroughs become next year's sponsorship pitch deck." },
      ],
    },
    trust: {
      quote: "Sold 1,400 tickets without paying Eventbrite a cent. Vendors paid up front for stalls — game changer.",
      quote_attr: "Kel, Gladstone Summer Fest committee",
      stat_value: "$4,100",
      stat_label: "Saved on ticketing fees across one weekend (vs Eventbrite at 3.5% + $1.79/ticket)",
      before: "Spreadsheet of stallholders, eight unpaid invoices, ticket platform clipping every sale.",
      after: "Stallholders pay through the app, tickets scanned at the gate, money in our account same day.",
      icp_yes: "Community/regional fests — 500–5,000 attendees, 20–80 stalls, run by a committee not a corporate",
      icp_no: "Multi-day ticketed music festivals needing wristband cashless, or anything over 10k attendance",
    },
  },

  'delivery': {
    use_case: {
      scene:    "Wednesday 10am. Central QLD Courier Co. has 34 drops between Rockhampton and Emerald, two drivers, a 7-hour window.",
      old_way:  "Sharon spends 90 minutes with a paper map and sticky notes plotting the run. Phones ring all day with 'where's my order?' — Sharon answers 27 of them.",
      with_app: "Route optimiser sorts both runs in 12 seconds. Customers get a live tracker link via SMS. Sharon's phone rings 3 times all day — and two were sales.",
      proof:    "Drivers finished by 4:50pm instead of 6:30pm. That's an extra 9 drops a week, $480 in margin.",
    },
    hero_mockup: '<svg viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Delivery driver tracking mockup">'
      + '<defs>'
      + '<linearGradient id="dl-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2530"/><stop offset="1" stop-color="#080c10"/></linearGradient>'
      + '<linearGradient id="dl-map" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2438"/><stop offset="1" stop-color="#0e1422"/></linearGradient>'
      + '</defs>'
      + '<rect x="60" y="40" width="480" height="820" rx="60" fill="url(#dl-bezel)" stroke="#2a3848" stroke-width="2"/>'
      + '<rect x="80" y="60" width="440" height="780" rx="44" fill="#0a0f1a"/>'
      + '<rect x="240" y="60" width="120" height="34" rx="17" fill="#000"/>'
      + '<text x="300" y="112" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">9:41</text>'
      + '<g transform="translate(80,140)">'
      + '<rect width="440" height="500" fill="url(#dl-map)"/>'
      + '<g stroke="rgba(255,255,255,0.06)" stroke-width="1">'
      + '<line x1="0" y1="80" x2="440" y2="80"/><line x1="0" y1="160" x2="440" y2="160"/><line x1="0" y1="240" x2="440" y2="240"/>'
      + '<line x1="0" y1="320" x2="440" y2="320"/><line x1="0" y1="400" x2="440" y2="400"/>'
      + '<line x1="80" y1="0" x2="80" y2="500"/><line x1="160" y1="0" x2="160" y2="500"/><line x1="240" y1="0" x2="240" y2="500"/>'
      + '<line x1="320" y1="0" x2="320" y2="500"/><line x1="400" y1="0" x2="400" y2="500"/>'
      + '</g>'
      + '<g stroke="rgba(255,255,255,0.12)" stroke-width="3" fill="none">'
      + '<path d="M 60 420 Q 120 380, 180 340 T 280 240 Q 320 180, 360 140"/>'
      + '<path d="M 0 280 L 440 280" stroke-width="6" stroke="rgba(255,255,255,0.08)"/>'
      + '<path d="M 220 0 L 220 500" stroke-width="6" stroke="rgba(255,255,255,0.08)"/>'
      + '</g>'
      + '<g stroke="#06b6d4" stroke-width="4" fill="none" stroke-linecap="round">'
      + '<path d="M 60 420 Q 120 380, 180 340 T 280 240 Q 320 180, 360 140"/>'
      + '</g>'
      + '<circle cx="60" cy="420" r="8" fill="#06b6d4"/>'
      + '<circle cx="360" cy="140" r="14" fill="#06b6d4" stroke="#fff" stroke-width="3"/>'
      + '<circle cx="240" cy="280" r="20" fill="rgba(6,182,212,0.3)" opacity="0.7"><animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/></circle>'
      + '<circle cx="240" cy="280" r="12" fill="#06b6d4" stroke="#fff" stroke-width="3"/>'
      + '<g transform="translate(232,272)" fill="#fff">'
      + '<path d="M0 8 L8 0 L16 8 L13 8 L13 16 L3 16 L3 8 Z" transform="scale(0.7)"/>'
      + '</g>'
      + '</g>'
      + '<g transform="translate(110,670)">'
      + '<rect width="380" height="100" rx="20" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)"/>'
      + '<circle cx="40" cy="50" r="22" fill="#06b6d4"/>'
      + '<text x="40" y="58" text-anchor="middle" fill="#0b0f1a" font-family="Inter,sans-serif" font-size="20" font-weight="800">J</text>'
      + '<text x="80" y="34" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">YOUR DRIVER</text>'
      + '<text x="80" y="56" fill="#e8edf5" font-family="Inter,sans-serif" font-size="16" font-weight="700">Joe · Van #3</text>'
      + '<text x="80" y="80" fill="#06b6d4" font-family="Inter,sans-serif" font-size="13" font-weight="600">ETA 12 min · 2 stops away</text>'
      + '</g>'
      + '<rect x="220" y="800" width="160" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>'
      + '</svg>',
    differentiation: {
      vs: "DoorDash Drive, Uber Direct",
      points: [
        { title: "Keep the 30%",
          body: "DoorDash Drive takes ~30% per delivery — on $50k/mo delivery volume that's $15,000/mo gone; our $349 flat covers unlimited deliveries with your drivers, your margin." },
        { title: "Recurring routes, not gig dispatch",
          body: "DoorDash/Uber are one-shot — they can't book a customer's standing Tuesday 9am drop; ours auto-schedules recurring runs (produce boxes, ag supply, laundry) the gig apps refuse." },
        { title: "Photo + signature POD built-in",
          body: "Uber Direct offers signature only via API at extra cost; ours captures photo + signature + auto-emails the customer, killing ~90% of 'I never got it' chargebacks." },
      ],
    },
    trust: {
      quote: "We were quoting from memory and losing money on long runs. Now every job pays for itself.",
      quote_attr: "Davo, Central QLD Courier Co., Rockhampton",
      stat_value: "28 jobs/day",
      stat_label: "Per driver, up from 19 — same fleet, smarter routing",
      before: "Drivers ringing dispatch every drop, paper run-sheets, no idea where anyone is.",
      after: "Live map, auto-allocated runs, customer gets an SMS the moment we leave the depot.",
      icp_yes: "Regional courier firms, 3–15 vans, B2B deliveries + pallets, owner-operator dispatch",
      icp_no: "Last-mile parcel resellers fronting for Auspost/StarTrack, or anyone running a fleet over 50",
    },
  },

  'car-hire': {
    use_case: {
      scene:    "Friday 6:14pm. Yapoon Auto Rentals — a 12-vehicle yard run by Dan + his wife — just got a booking enquiry from a Brisbane couple flying into Rocky Sunday morning for a week-long Capricorn Coast getaway.",
      old_way:  "Phone tag for two days. Couple end up booking with Hertz Rocky Airport at $189/day plus the $35/day insurance scam. Yapoon ute sits idle on the lot all week.",
      with_app: "Couple opens yapoonauto.com.au at the gate, books a Hilux SR5 for 7 days at $129/day, uploads licences from the Brisbane terminal, Stripe pre-auths a $500 bond. Sunday morning at 7am they get an SMS: 'Bay 3, lockbox code 4827, fuel card in glovebox'. They walk straight from the airport shuttle to the keys.",
      proof:    "Dan netted $903 + bond on a vehicle that would've sat dead. 11 minutes of his Friday — most of which was the customer scrolling, not him.",
    },
    hero_mockup: '<svg viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Car hire booking confirmation mockup">'
      + '<defs>'
      + '<linearGradient id="ch-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1f2a"/><stop offset="1" stop-color="#040910"/></linearGradient>'
      + '<linearGradient id="ch-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1825"/><stop offset="1" stop-color="#040810"/></linearGradient>'
      + '</defs>'
      + '<rect x="60" y="40" width="480" height="820" rx="60" fill="url(#ch-bezel)" stroke="#1c3a4d" stroke-width="2"/>'
      + '<rect x="80" y="60" width="440" height="780" rx="44" fill="url(#ch-screen)"/>'
      + '<rect x="240" y="60" width="120" height="34" rx="17" fill="#000"/>'
      + '<text x="300" y="112" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">9:41</text>'
      + '<text x="110" y="160" fill="rgba(6,182,212,0.85)" font-family="Inter,sans-serif" font-size="11" font-weight="700" letter-spacing="2">PICKUP TOMORROW</text>'
      + '<text x="110" y="194" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="22" font-weight="700">Hilux SR5 · 7 days</text>'
      + '<g transform="translate(110,220)">'
      + '<rect width="380" height="200" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(6,182,212,0.25)" stroke-width="2"/>'
      + '<g transform="translate(20,20)">'
      + '<rect width="340" height="80" rx="14" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.18)"/>'
      + '<g transform="translate(20,20)" fill="#06b6d4"><rect width="90" height="44" rx="6" fill="rgba(6,182,212,0.25)"/>'
      + '<text x="45" y="28" text-anchor="middle" fill="#06b6d4" font-family="Inter,sans-serif" font-size="22">🚙</text></g>'
      + '<text x="130" y="28" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="700">TOYOTA HILUX SR5 4×4</text>'
      + '<text x="130" y="48" fill="rgba(255,255,255,0.55)" font-family="Inter,sans-serif" font-size="11">Auto · Diesel · 5 seats · tow pkg</text>'
      + '<text x="130" y="68" fill="#06b6d4" font-family="Inter,sans-serif" font-size="11" font-weight="700">$129/day · Bay 3</text>'
      + '</g>'
      + '<g transform="translate(20,120)">'
      + '<text x="0" y="14" fill="rgba(255,255,255,0.45)" font-family="Inter,sans-serif" font-size="9" font-weight="700" letter-spacing="1.5">PICKUP</text>'
      + '<text x="0" y="34" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="600">Sun 4 May · 7:00am</text>'
      + '<text x="180" y="14" text-anchor="end" fill="rgba(255,255,255,0.45)" font-family="Inter,sans-serif" font-size="9" font-weight="700" letter-spacing="1.5">RETURN</text>'
      + '<text x="180" y="34" text-anchor="end" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="600">Sun 11 May · 5:00pm</text>'
      + '<line x1="0" y1="50" x2="340" y2="50" stroke="rgba(255,255,255,0.08)"/>'
      + '<text x="0" y="70" fill="#fbbf24" font-family="Space Grotesk,Inter,sans-serif" font-size="18" font-weight="800">$903.00</text>'
      + '<text x="340" y="70" text-anchor="end" fill="#34d399" font-family="Inter,sans-serif" font-size="11" font-weight="700">+ $500 BOND HELD</text>'
      + '</g>'
      + '</g>'
      + '<g transform="translate(110,440)">'
      + '<rect width="380" height="100" rx="18" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.3)"/>'
      + '<text x="20" y="28" fill="rgba(245,158,11,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">📦 LOCKBOX PICKUP</text>'
      + '<text x="20" y="54" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="22" font-weight="800">CODE 4827</text>'
      + '<text x="20" y="80" fill="rgba(255,255,255,0.6)" font-family="Inter,sans-serif" font-size="11">Bay 3 · fuel card in glovebox · keys in lockbox</text>'
      + '</g>'
      + '<g transform="translate(110,560)">'
      + '<rect width="380" height="100" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>'
      + '<circle cx="32" cy="32" r="18" fill="#06b6d4"/>'
      + '<text x="32" y="38" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif" font-size="14">🪪</text>'
      + '<text x="62" y="28" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="700">Licence verified</text>'
      + '<text x="62" y="46" fill="rgba(255,255,255,0.55)" font-family="Inter,sans-serif" font-size="11">QLD Open · Selfie matched · KYC ✓</text>'
      + '<text x="20" y="84" fill="rgba(52,211,153,0.85)" font-family="Inter,sans-serif" font-size="11" font-weight="600">Stripe pre-auth captured · bond ready to release on return</text>'
      + '</g>'
      + '<g transform="translate(110,680)">'
      + '<rect width="380" height="60" rx="30" fill="#06b6d4"/>'
      + '<text x="190" y="38" text-anchor="middle" fill="#06141a" font-family="Space Grotesk,Inter,sans-serif" font-size="16" font-weight="800">Open lockbox instructions →</text>'
      + '</g>'
      + '<rect x="220" y="800" width="160" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>'
      + '</svg>',
    differentiation: {
      vs: "Turo, Hertz franchise portals, Rentalcars",
      points: [
        { title: "No 25–35% Turo skim",
          body: "Turo / Drive mate take 25–35% per rental — on $200/day that's $50–70/day gone forever; our $269 flat covers your fleet, you keep every dollar minus Stripe's 1.75%." },
        { title: "Lockbox + SMS pickup",
          body: "Hertz/Avis make customers queue at the counter even after a 6-hour drive — small yards win on lockbox + SMS pickup, but only with a real booking system; ours is the system." },
        { title: "Built for 5–50 vehicle yards",
          body: "Rentalcars affiliate cuts you out of the customer relationship and Hertz franchise portals are bloated; ours is built for the regional yard who wants to compete on service, not scale." },
      ],
    },
    trust: {
      quote: "We were the third-cheapest yard in Yeppoon and still losing weekenders to Hertz at the airport. Now they book us before they even land.",
      quote_attr: "Dan & Sarah, Yapoon Auto Rentals, Yeppoon",
      stat_value: "94%",
      stat_label: "Of weekend bookings now arrive paid + verified before pickup (was 38%)",
      before: "Phone tag through Friday afternoon, half the deals fall through, vehicle sits idle on the lot.",
      after: "Customer self-serves, Stripe takes the deposit, lockbox handles the keys. We breathe on Saturdays.",
      icp_yes: "Regional rental yards — 5–50 vehicles, mix of cars/utes/4WDs, owner-operator + family staff",
      icp_no: "Multi-state corporate fleets needing fleet-management software (Lytx, Geotab) or short-term peer-to-peer (Turo replaces this)",
    },
  },

  'butchers': {
    use_case: {
      scene:    "Sunday 8:43pm. Moey's Premium Meats on James Street, Yeppoon — Moe's just had his weekly text from a regular: 'mate, can you do me a 1.4kg eye fillet trimmed for Friday + a $150 freezer pack?'",
      old_way:  "Moe writes it on the back of a docket. Tuesday he forgets the trim spec. Wednesday he rings to clarify. Thursday's freezer pack runs short on porterhouse so he subs in extra mince. Customer's polite but slightly annoyed.",
      with_app: "Customer opened moeysmeats.com.au from the couch — tapped Eye Fillet → typed '~1.4kg, fully trimmed', added the $150 Family Freezer Pack, paid. Order lands in Moe's tablet. Friday morning he weighs the actual fillet (1.38kg), Stripe top-up captured automatically. SMS fires: 'Your order is bagged in the cool room — collect any time before 5pm'.",
      proof:    "Moe takes Sunday night for himself. Friday he runs three custom orders + four freezer packs without a single phone call. $640 of takings he didn't have to talk anyone into.",
    },
    hero_mockup: '<svg viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Butcher shop order ticket mockup">'
      + '<defs>'
      + '<linearGradient id="bu-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0a0a"/><stop offset="1" stop-color="#0d0303"/></linearGradient>'
      + '<linearGradient id="bu-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0606"/><stop offset="1" stop-color="#0a0303"/></linearGradient>'
      + '</defs>'
      + '<rect x="60" y="40" width="480" height="820" rx="60" fill="url(#bu-bezel)" stroke="#3d1414" stroke-width="2"/>'
      + '<rect x="80" y="60" width="440" height="780" rx="44" fill="url(#bu-screen)"/>'
      + '<rect x="240" y="60" width="120" height="34" rx="17" fill="#000"/>'
      + '<text x="300" y="112" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">9:41</text>'
      + '<text x="110" y="160" fill="rgba(220,38,38,0.85)" font-family="Inter,sans-serif" font-size="11" font-weight="700" letter-spacing="2">FRIDAY ORDERS · 4</text>'
      + '<text x="110" y="190" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="22" font-weight="700">Today\'s pickups</text>'
      + '<g transform="translate(110,220)">'
      + '<rect width="380" height="120" rx="18" fill="rgba(220,38,38,0.1)" stroke="#dc2626" stroke-width="2"/>'
      + '<rect x="0" y="0" width="170" height="26" rx="13" fill="#dc2626"/>'
      + '<text x="85" y="18" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif" font-size="11" font-weight="800" letter-spacing="1">★ CUSTOM CUT</text>'
      + '<text x="20" y="56" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="16" font-weight="800">Eye Fillet · ~1.4kg</text>'
      + '<text x="20" y="78" fill="rgba(255,255,255,0.6)" font-family="Inter,sans-serif" font-size="12">Fully trimmed · Sarah M · 4pm collect</text>'
      + '<text x="360" y="56" text-anchor="end" fill="#fbbf24" font-family="Space Grotesk,Inter,sans-serif" font-size="20" font-weight="800">$84.00</text>'
      + '<text x="360" y="78" text-anchor="end" fill="rgba(52,211,153,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700">PAID · Top-up at weigh</text>'
      + '<rect x="20" y="92" width="120" height="20" rx="10" fill="rgba(34,197,94,0.18)" stroke="rgba(34,197,94,0.4)"/>'
      + '<text x="80" y="106" text-anchor="middle" fill="#34d399" font-family="Inter,sans-serif" font-size="9" font-weight="800" letter-spacing="1">✓ READY · TEXTED</text>'
      + '</g>'
      + '<g transform="translate(110,360)">'
      + '<rect width="380" height="100" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(217,119,6,0.3)"/>'
      + '<text x="20" y="28" fill="rgba(217,119,6,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">📦 FREEZER PACK · $150</text>'
      + '<text x="20" y="56" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="16" font-weight="700">Family Mixed Pack</text>'
      + '<text x="20" y="78" fill="rgba(255,255,255,0.55)" font-family="Inter,sans-serif" font-size="11">2kg mince · 1kg sausages · 6 ribeyes · 1kg lamb cutlets</text>'
      + '<text x="360" y="58" text-anchor="end" fill="#dc2626" font-family="Inter,sans-serif" font-size="11" font-weight="700">Sarah M</text>'
      + '<text x="360" y="80" text-anchor="end" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="10">collect 4pm</text>'
      + '</g>'
      + '<g transform="translate(110,480)">'
      + '<rect width="380" height="100" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>'
      + '<text x="20" y="28" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">CLICK &amp; COLLECT · 30 MIN</text>'
      + '<text x="20" y="56" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="16" font-weight="700">Pork Roast (1.6kg) + crackle</text>'
      + '<text x="20" y="78" fill="rgba(255,255,255,0.55)" font-family="Inter,sans-serif" font-size="11">Tom B · 4:30pm collect · loyalty: kg 8/10</text>'
      + '<text x="360" y="56" text-anchor="end" fill="#fbbf24" font-family="Space Grotesk,Inter,sans-serif" font-size="18" font-weight="800">$36.80</text>'
      + '</g>'
      + '<g transform="translate(110,600)">'
      + '<rect width="380" height="80" rx="14" fill="rgba(220,38,38,0.08)" stroke="rgba(220,38,38,0.2)"/>'
      + '<text x="20" y="26" fill="rgba(220,38,38,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">📊 AUTO-STOCKTAKE</text>'
      + '<text x="20" y="50" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="600">Mince running low · 6.2kg left</text>'
      + '<text x="20" y="68" fill="rgba(255,255,255,0.55)" font-family="Inter,sans-serif" font-size="11">Reorder by 4pm · forecast 14kg by Sat</text>'
      + '</g>'
      + '<g transform="translate(110,700)">'
      + '<rect width="380" height="60" rx="30" fill="#dc2626"/>'
      + '<text x="190" y="38" text-anchor="middle" fill="#fff" font-family="Space Grotesk,Inter,sans-serif" font-size="16" font-weight="800">Send "ready" SMS to all →</text>'
      + '</g>'
      + '<rect x="220" y="800" width="160" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>'
      + '</svg>',
    differentiation: {
      vs: "Square for Restaurants, Shopify + Local Delivery, Hunt's Family Butcher POS",
      points: [
        { title: "Custom-weight without phone tag",
          body: "Square POS / Shopify can't do '~1.2kg ribeye, trimmed, top-up at weigh' — you end up taking it on the phone; ours captures intent + does the Stripe top-up automatically when you weigh." },
        { title: "Freezer packs as bundles",
          body: "Generic POS treats a $150 freezer pack as one SKU and breaks the stock count; ours decrements 4 cuts at once + auto-flags low-stock cuts before next weekend." },
        { title: "Built for the block, not a deli line",
          body: "Square POS is for cafes, Hunt's is built for over-the-counter retail; ours assumes orders come in via web Friday night and the boss reads them on a tablet at 6am." },
      ],
    },
    trust: {
      quote: "Stopped the Sunday-night phone calls completely. I get my custom orders in writing, weighed, paid — done. Wife's not picking the phone up at dinner anymore.",
      quote_attr: "Moe, Moey's Premium Meats, Yeppoon",
      stat_value: "$640",
      stat_label: "Average Friday-collect online takings (vs walk-in average $190 ticket)",
      before: "Custom orders on the back of a docket, freezer packs sub'd in last-minute, mince running out before lunch.",
      after: "Tablet shows the morning's orders sorted by collect time. Stocktake auto-runs. Specials posted by Tuesday lunch.",
      icp_yes: "Single-shop or 2–3-location butchers — $300k–$2M annual turnover, mix of retail walk-in + custom orders",
      icp_no: "Big-box meat wholesalers running CCRSlate / Carr-Bidwell, or grass-roots delis without click-and-collect demand",
    },
  },

  'sports-club': {
    use_case: {
      scene:    "Tuesday 7:42pm. Yeppoon Junior Rugby League — secretary Karen runs registrations + fees + the Facebook page out of her kitchen. Round 7 fixtures came out today; 5 grades, 17 teams, 184 kids playing Saturday.",
      old_way:  "Karen drafts a Facebook post. 60% of parents see it. Wednesday morning her phone rings four times: 'where's our game?', 'what time?', 'is the U10s away?'. Saturday morning 14 kids miss kick-off because their parents didn't see the post.",
      with_app: "Karen opens the admin panel — fixtures import from QRL with one click. Each team gets a push notification with their game time + map link. Parents tap RSVP. Saturday 7:30am the auto-reminder fires: '⏰ U10s game at Showgrounds, 9:00am, kick-off in 90 min'. 178 of 184 RSVPs are 'in', and the 6 'outs' are accounted for before Karen's first coffee.",
      proof:    "Zero late arrivals across 5 grades. Karen's Tuesday went from 4 hours of fixture admin to 12 minutes. The new $99 sponsorship from the chemist sits inside the app's sponsor zone — they're tracking 340 in-app clicks already.",
    },
    hero_mockup: '<svg viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sports club fixtures + match-day reminder mockup">'
      + '<defs>'
      + '<linearGradient id="sc-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1428"/><stop offset="1" stop-color="#03060f"/></linearGradient>'
      + '<linearGradient id="sc-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06101e"/><stop offset="1" stop-color="#020407"/></linearGradient>'
      + '</defs>'
      + '<rect x="60" y="40" width="480" height="820" rx="60" fill="url(#sc-bezel)" stroke="#1a2c4a" stroke-width="2"/>'
      + '<rect x="80" y="60" width="440" height="780" rx="44" fill="url(#sc-screen)"/>'
      + '<rect x="240" y="60" width="120" height="34" rx="17" fill="#000"/>'
      + '<text x="300" y="112" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">9:41</text>'
      + '<text x="110" y="160" fill="rgba(16,185,129,0.85)" font-family="Inter,sans-serif" font-size="11" font-weight="700" letter-spacing="2">YJRL · ROUND 7</text>'
      + '<text x="110" y="190" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="22" font-weight="700">Saturday 5 May</text>'
      + '<g transform="translate(110,220)">'
      + '<rect width="380" height="100" rx="20" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.4)" stroke-width="2"/>'
      + '<text x="20" y="28" fill="rgba(245,158,11,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">⏰ MATCH STARTING IN 90 MIN</text>'
      + '<text x="20" y="56" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="18" font-weight="800">U10 Sharks vs Mackay Eagles</text>'
      + '<text x="20" y="80" fill="rgba(255,255,255,0.65)" font-family="Inter,sans-serif" font-size="12">9:00am · Showgrounds Field 2 · jersey #14 (away)</text>'
      + '</g>'
      + '<g transform="translate(110,340)">'
      + '<rect width="380" height="180" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(30,64,175,0.3)"/>'
      + '<text x="20" y="26" fill="rgba(30,64,175,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">FIXTURES TODAY · 17 GAMES</text>'
      + '<g transform="translate(20,40)" font-family="Inter,sans-serif" font-size="12" fill="#e8edf5">'
      + '<text x="0" y="14" font-weight="700">U7 Sharks</text><text x="180" y="14" fill="rgba(255,255,255,0.55)">vs Bandits</text><text x="340" y="14" text-anchor="end" fill="#10b981" font-weight="700">8:00am ✓</text>'
      + '<text x="0" y="36" font-weight="700">U8 Storm</text><text x="180" y="36" fill="rgba(255,255,255,0.55)">vs Capras</text><text x="340" y="36" text-anchor="end" fill="#10b981" font-weight="700">8:30am ✓</text>'
      + '<text x="0" y="58" font-weight="700">U10 Sharks</text><text x="180" y="58" fill="rgba(255,255,255,0.55)">vs Eagles</text><text x="340" y="58" text-anchor="end" fill="#f59e0b" font-weight="700">9:00am ⏰</text>'
      + '<text x="0" y="80" font-weight="700">U12 Storm</text><text x="180" y="80" fill="rgba(255,255,255,0.55)">vs Roos</text><text x="340" y="80" text-anchor="end" fill="rgba(255,255,255,0.4)" font-weight="700">10:30am</text>'
      + '<text x="0" y="102" font-weight="700">U14 Sharks</text><text x="180" y="102" fill="rgba(255,255,255,0.55)">vs Bulls</text><text x="340" y="102" text-anchor="end" fill="rgba(255,255,255,0.4)" font-weight="700">12:00pm</text>'
      + '<text x="0" y="124" font-weight="700">U16 Storm</text><text x="180" y="124" fill="rgba(255,255,255,0.55)">vs Tigers</text><text x="340" y="124" text-anchor="end" fill="rgba(255,255,255,0.4)" font-weight="700">2:00pm</text>'
      + '</g>'
      + '</g>'
      + '<g transform="translate(110,540)">'
      + '<rect width="380" height="80" rx="14" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)"/>'
      + '<text x="20" y="26" fill="rgba(16,185,129,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">📊 RSVP STATUS</text>'
      + '<text x="20" y="50" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="22" font-weight="800">178/184 in</text>'
      + '<text x="20" y="68" fill="rgba(255,255,255,0.55)" font-family="Inter,sans-serif" font-size="11">6 outs accounted for · 0 unanswered</text>'
      + '</g>'
      + '<g transform="translate(110,640)">'
      + '<rect width="380" height="100" rx="18" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.18)"/>'
      + '<text x="20" y="26" fill="rgba(245,158,11,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">🏆 LIVE SCORE · U10 SHARKS</text>'
      + '<text x="20" y="56" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="22" font-weight="800">12 - 4</text>'
      + '<text x="20" y="78" fill="rgba(255,255,255,0.55)" font-family="Inter,sans-serif" font-size="11">Try: J. Wilson (8 min) · Conv: T. Brown</text>'
      + '<text x="360" y="58" text-anchor="end" fill="#10b981" font-family="Inter,sans-serif" font-size="11" font-weight="700">HALF TIME</text>'
      + '</g>'
      + '<g transform="translate(110,760)">'
      + '<rect width="380" height="60" rx="30" fill="#10b981"/>'
      + '<text x="190" y="38" text-anchor="middle" fill="#031410" font-family="Space Grotesk,Inter,sans-serif" font-size="16" font-weight="800">View team chat (7 new) →</text>'
      + '</g>'
      + '<rect x="220" y="800" width="160" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>'
      + '</svg>',
    differentiation: {
      vs: "TeamSnap, GameDay, SportsTG, Facebook groups",
      points: [
        { title: "Built for Aussie community sport",
          body: "TeamSnap is built for US baseball + soccer dads, GameDay's UI is geared at AFL admin staff — junior rugby league + community footy gets a half-built feature set; ours speaks the language (rounds, grades, jerseys, tries)." },
        { title: "Rego doesn't get skimmed",
          body: "GameDay's service fees + Stripe combo eat 6–8% of rego — on a $40k club that's ~$3k gone yearly; ours runs Stripe direct so the club keeps every cent minus 1.75% processing." },
        { title: "Replaces 4 fragmented chats",
          body: "Right now: Facebook for news + WhatsApp per team + GameDay for rego + email for fees — parents miss things; one app means one push, one ledger, one inbox for the whole club." },
      ],
    },
    trust: {
      quote: "Treasurer's job went from 8 hours a week to 30 minutes reconciling. We've finally got every parent in one place. Reckon I might actually go to a game this year.",
      quote_attr: "Karen, Yeppoon Junior Rugby League secretary",
      stat_value: "12 → 0",
      stat_label: "Late arrivals on a Saturday morning round (was averaging 12 of 184)",
      before: "Three Facebook posts a week, the parents who matter never see them, fixture day chaos at the showgrounds.",
      after: "One push, every team gets their own time + map, RSVPs in by Friday lunch, Karen runs the canteen instead of the phone.",
      icp_yes: "Junior + senior community clubs — rugby league, AFL, soccer, netball — 100–800 registered players, run by volunteers",
      icp_no: "Professional / state-league clubs running custom STATS / Genius integrations, or solo-coach scenarios where TeamSnap is enough",
    },
  },

  'ai-social': {
    use_case: {
      scene:    "Saturday 2pm. Rotary Mates — the rotary-engine community Dave runs out of Rocky — 340 members, used to live in a Facebook Group that buried 92% of posts. Sunday cruise to Mt Archer is on for sunrise.",
      old_way:  "Dave posts the meet-up at 2pm Saturday. FB algorithm shows it to 47 people. 8 cars turn up at the BP at sunrise. Half hear about it Monday on Messenger.",
      with_app: "Same post hits 100% of members via push. RSVP button right there — 23 cars confirmed within the hour. Paid memberships ($12/mo Garage tier) auto-renew via Stripe. AI moderation nuked two For-Sale spam posts overnight before anyone saw them.",
      proof:    "Sunday's cruise: 38 cars at the BP, biggest turnout since the chapter started. Dues collect themselves now — Stripe handles it monthly.",
    },
    hero_mockup: '<svg viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AI social community feed mockup">'
      + '<defs>'
      + '<linearGradient id="ai-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#171a2e"/><stop offset="1" stop-color="#08091a"/></linearGradient>'
      + '<linearGradient id="ai-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1024"/><stop offset="1" stop-color="#06081a"/></linearGradient>'
      + '</defs>'
      + '<rect x="60" y="40" width="480" height="820" rx="60" fill="url(#ai-bezel)" stroke="#252846" stroke-width="2"/>'
      + '<rect x="80" y="60" width="440" height="780" rx="44" fill="url(#ai-screen)"/>'
      + '<rect x="240" y="60" width="120" height="34" rx="17" fill="#000"/>'
      + '<text x="300" y="112" text-anchor="middle" fill="#e8edf5" font-family="Inter,sans-serif" font-size="14" font-weight="600">9:41</text>'
      + '<text x="110" y="160" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="22" font-weight="700">Rotary Mates</text>'
      + '<text x="490" y="160" text-anchor="end" fill="rgba(99,102,241,0.85)" font-family="Inter,sans-serif" font-size="11" font-weight="700">340 members</text>'
      + '<g transform="translate(110,190)">'
      + '<rect width="380" height="160" rx="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)"/>'
      + '<circle cx="32" cy="32" r="18" fill="#6366f1"/>'
      + '<text x="32" y="38" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif" font-size="14" font-weight="800">J</text>'
      + '<text x="62" y="28" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="700">Dave · Admin</text>'
      + '<text x="62" y="46" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="11">2h ago · Pinned 📌</text>'
      + '<text x="20" y="80" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="600">Sun cruise — Mt Archer 7am sharp.</text>'
      + '<text x="20" y="100" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="600">Meet at the BP servo on Bruce Hwy.</text>'
      + '<text x="20" y="120" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13">Tap RSVP if you&apos;re bringing a car.</text>'
      + '<rect x="20" y="132" width="100" height="22" rx="11" fill="#6366f1"/>'
      + '<text x="70" y="148" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif" font-size="11" font-weight="700">✓ RSVP YES</text>'
      + '<text x="140" y="148" fill="rgba(255,255,255,0.55)" font-family="Inter,sans-serif" font-size="11">23 cars going</text>'
      + '</g>'
      + '<g transform="translate(110,370)" opacity="0.45">'
      + '<rect width="380" height="60" rx="14" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.2)" stroke-dasharray="4 3"/>'
      + '<text x="20" y="26" fill="rgba(239,68,68,0.85)" font-family="Inter,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">🚫 AUTO-HIDDEN · SPAM</text>'
      + '<text x="20" y="46" fill="rgba(255,255,255,0.4)" font-family="Inter,sans-serif" font-size="11" text-decoration="line-through">FREE BITCOIN!!! Click here to claim your...</text>'
      + '</g>'
      + '<g transform="translate(110,450)">'
      + '<rect width="380" height="120" rx="18" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.3)"/>'
      + '<circle cx="32" cy="32" r="18" fill="rgba(99,102,241,0.3)" stroke="#6366f1" stroke-width="2"/>'
      + '<text x="32" y="38" text-anchor="middle" fill="#6366f1" font-family="Inter,sans-serif" font-size="16">🤖</text>'
      + '<text x="62" y="28" fill="#a5b4fc" font-family="Inter,sans-serif" font-size="11" font-weight="700" letter-spacing="1">AI MODERATOR</text>'
      + '<text x="62" y="46" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="11">Last 24 hours</text>'
      + '<text x="20" y="80" fill="#e8edf5" font-family="Space Grotesk,Inter,sans-serif" font-size="16" font-weight="700">Hid 3 spam posts overnight</text>'
      + '<text x="20" y="102" fill="#22c55e" font-family="Inter,sans-serif" font-size="12" font-weight="600">0 false flags · 1 review queued</text>'
      + '</g>'
      + '<g transform="translate(110,590)">'
      + '<rect width="380" height="100" rx="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)"/>'
      + '<circle cx="32" cy="32" r="18" fill="#10b981"/>'
      + '<text x="32" y="38" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif" font-size="14" font-weight="800">D</text>'
      + '<text x="62" y="28" fill="#e8edf5" font-family="Inter,sans-serif" font-size="13" font-weight="700">Dave</text>'
      + '<text x="62" y="46" fill="rgba(255,255,255,0.5)" font-family="Inter,sans-serif" font-size="11">5h ago</text>'
      + '<text x="20" y="78" fill="rgba(255,255,255,0.85)" font-family="Inter,sans-serif" font-size="12">Anyone got a 13B bridgeport intake</text>'
      + '<text x="20" y="94" fill="rgba(255,255,255,0.85)" font-family="Inter,sans-serif" font-size="12">to spare? Building a new daily.</text>'
      + '</g>'
      + '<rect x="220" y="800" width="160" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>'
      + '</svg>',
    differentiation: {
      vs: "Circle, Patreon, Discord",
      points: [
        { title: "Creators keep ~98%, not 88–92%",
          body: "Patreon takes 8–12% of every paid sub forever; ours takes 0% — Stripe processing only (~1.75% AU) — on $10k/mo memberships that's $800–1200/mo back in your pocket." },
        { title: "AI moderation 24/7 included",
          body: "Circle's $99 Basic has no AI mod — you pay humans or watch spam; ours scores every post for spam/abuse in milliseconds, auto-quarantining the junk overnight while you sleep." },
        { title: "Members in your DB, not Meta's",
          body: "Facebook Group reach is 5–10% organic and Meta can shadow-ban tomorrow; your member list lives in your Cloudflare D1, exportable, never throttled, never shadow-banned." },
      ],
    },
    trust: {
      quote: "Cruise turnouts have doubled since we left Facebook. Algorithm's not eating our posts anymore — every member sees every meet-up.",
      quote_attr: "Dave, Rotary Mates Rockhampton chapter admin",
      stat_value: "+312%",
      stat_label: "Average post engagement vs the Facebook Group it replaced",
      before: "Members miss the meet-up because Facebook hides the post. Dues chased on Messenger one-by-one.",
      after: "Push hits 100% of the chapter. RSVP, pay dues, browse classifieds in one app. AI moderates the spam.",
      icp_yes: "Enthusiast communities — car clubs, motorsport tribes, hobby groups — 100–10,000 members",
      icp_no: "Open public communities (Discord works fine), or anything needing real-time voice/video calls",
    },
  },

};

// The interactive demo IS the proposal. One link.
export function renderDemo(p: ProductConfig, ref: string = ''): string {
  const b = SAMPLE_BRAND[p.id] || { name: p.brand, tagline: p.sell_point, suburb: 'Somewhere', phone: '0412 345 000', logo_emoji: '🏢' };
  const [g1, g2, g3] = p.accent_gradient;
  const chrome = DEMO_CHROME[p.id] || {
    hero_benefit: p.sell_point,
    primary_cta:   { label: 'Explore ↓',    href: '#demo' },
    secondary_cta: { label: 'Get in touch', href: '#book' },
    trust_pill: '✨ Local business',
    nav_links: [{ label: 'Explore', href: '#demo' }, { label: 'Contact', href: '#book' }],
  };
  const content: DemoContent = DEMO_CONTENT[p.id] || {
    use_case: { scene: '', old_way: '', with_app: '', proof: '' },
    hero_mockup: '',
    differentiation: { vs: 'the incumbents', points: [] },
    trust: {
      quote: '', quote_attr: '', stat_value: '', stat_label: '',
      before: '', after: '', icp_yes: '', icp_no: '',
    },
  };
  const nonStateSuburb = b.suburb === 'Online' || b.suburb === 'Global' || b.suburb === 'Queensland';
  const suburbLabel = `${b.suburb}${nonStateSuburb ? '' : ', QLD'}`;
  const cleanTagline = b.tagline.replace(/&amp;/g, '&');

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(b.name)} — ${esc(cleanTagline)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>
:root {
  --bg:#0b0f1a; --surface:#141b2d; --card:#1a2338; --border:#1f2d45;
  --text:#e8edf5; --muted:#6b7fa3; --soft:#a0aec0;
  --brand:${p.cta_color}; --g1:${g1}; --g2:${g2}; --g3:${g3};
  --display-font:"Space Grotesk","Inter",system-ui,sans-serif;
  --body-font:"Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior:smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--body-font); min-height: 100vh; line-height: 1.55; padding-bottom: 90px; -webkit-font-smoothing:antialiased; }
body::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:0; background: radial-gradient(ellipse 600px 400px at 80% 10%, ${g1}18, transparent 60%), radial-gradient(ellipse 500px 300px at 15% 80%, ${g2}15, transparent 60%); }
.demo-banner { position:sticky; top:0; z-index:60; background:${p.cta_color}; color:#0b0f1a; text-align:center; font-size:0.72rem; font-weight:800; letter-spacing:0.03em; padding:0.3rem 1rem; }

/* Real-business top nav */
.site-nav { position:sticky; top:22px; z-index:50; background:rgba(11,15,26,0.92); backdrop-filter:blur(14px); border-bottom:1px solid rgba(255,255,255,0.06); padding:0.85rem 1.5rem; display:flex; align-items:center; justify-content:space-between; gap:1.25rem; flex-wrap:wrap; }
.brand { display:flex; align-items:center; gap:0.7rem; font-weight:800; font-size:1rem; color:var(--text); text-decoration:none; }
.brand-logo { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,${g1},${g2} 55%,${g3}); display:flex; align-items:center; justify-content:center; font-size:1.2rem; box-shadow:0 4px 14px ${g1}55, inset 0 0 0 1px rgba(255,255,255,0.18); }
.brand-name { display:none; }
@media (min-width:560px) { .brand-name { display:inline; } }
.site-links { display:flex; gap:0.25rem; align-items:center; flex-wrap:wrap; }
.site-links a { color:var(--soft); text-decoration:none; font-weight:600; font-size:0.88rem; padding:0.45rem 0.75rem; border-radius:10px; transition:color 0.15s, background 0.15s; }
.site-links a:hover { color:var(--text); background:rgba(255,255,255,0.05); }
.site-links a.nav-meta { color:var(--muted); font-size:0.75rem; font-weight:700; opacity:0.85; margin-left:0.5rem; padding:0.4rem 0.7rem; border:1px dashed rgba(255,255,255,0.12); }
.site-links a.nav-meta:hover { color:${p.cta_color}; border-color:${p.cta_color}55; }
.nav-cta { background:var(--brand); color:#0b0f1a; padding:0.5rem 1rem; border-radius:999px; font-weight:700; font-size:0.82rem; text-decoration:none; box-shadow:0 4px 16px ${p.cta_color}55; cursor:pointer; border:none; font-family:inherit; }

main { max-width:1100px; margin:0 auto; padding:clamp(2rem,4vw,3rem) 1.5rem 2rem; position:relative; z-index:1; }
section.panel, section.hero, section.evidence { padding-top:clamp(2.5rem,4vw,3.5rem); padding-bottom:clamp(2.5rem,4vw,3.5rem); }
.display { font-family:var(--display-font); font-weight:700; letter-spacing:-0.015em; line-height:1.05; }

/* Hero - real business homepage feel */
.hero { display:grid; grid-template-columns:1fr; gap:2.5rem; align-items:center; padding:clamp(2.5rem,5vw,4rem) 0 clamp(2rem,4vw,3rem); }
@media (min-width:880px) { .hero { grid-template-columns:1.15fr 1fr; gap:3rem; } }
.hero-trust { display:inline-flex; align-items:center; gap:0.45rem; padding:0.4rem 0.9rem; border-radius:999px; font-size:0.78rem; font-weight:600; color:var(--text); background:rgba(52,211,153,0.1); border:1px solid rgba(52,211,153,0.25); margin-bottom:1.25rem; width:max-content; max-width:100%; }
.hero h1 { font-size:clamp(2.25rem,5.5vw,3.75rem); margin-bottom:1rem; color:var(--text); }
.hero h1 .grad { background:linear-gradient(135deg,${g1},${g2} 50%,${g3}); -webkit-background-clip:text; background-clip:text; color:transparent; }
.hero .hero-sub { font-size:1.05rem; color:var(--soft); max-width:560px; margin:0 0 1.75rem; }
.hero-ctas { display:flex; gap:0.7rem; flex-wrap:wrap; }
.hero-ctas .btn-brand, .hero-ctas .btn-ghost { padding:0.85rem 1.5rem; font-size:0.95rem; }
.hero-meta { display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center; margin-top:1.75rem; font-size:0.85rem; color:var(--muted); }
.hero-meta strong { color:var(--soft); font-weight:600; }

/* Hero artwork - geometric brand-coloured backdrop, no fake photo */
.hero-art { position:relative; aspect-ratio:1.05/1; max-width:480px; margin:0 auto; width:100%; }
.hero-art .blob { position:absolute; border-radius:50%; filter:blur(2px); }
.hero-art .b1 { top:5%; left:8%; width:62%; height:62%; background:radial-gradient(circle at 30% 30%, ${g1}cc, ${g1}22 70%); }
.hero-art .b2 { bottom:8%; right:5%; width:55%; height:55%; background:radial-gradient(circle at 60% 40%, ${g2}cc, ${g2}22 70%); mix-blend-mode:screen; }
.hero-art .b3 { top:38%; left:38%; width:42%; height:42%; background:radial-gradient(circle at 50% 50%, ${g3}aa, ${g3}11 75%); mix-blend-mode:screen; }
.hero-art .stamp { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:140px; height:140px; border-radius:50%; background:rgba(11,15,26,0.55); backdrop-filter:blur(14px); display:flex; align-items:center; justify-content:center; font-size:3.2rem; box-shadow:inset 0 0 0 1px rgba(255,255,255,0.12), 0 12px 40px rgba(0,0,0,0.4); }

/* Benefit callout — attached to every section */
.benefit {
  display:flex; gap:0.9rem; align-items:flex-start;
  background:linear-gradient(135deg,rgba(52,211,153,0.08),rgba(52,211,153,0.03));
  border:1px solid rgba(52,211,153,0.25);
  border-radius:12px; padding:0.85rem 1.15rem;
  margin-top:1.25rem;
}
.benefit .b-icon { font-size:1.5rem; flex-shrink:0; }
.benefit .b-body { flex:1; }
.benefit .b-title { font-size:0.65rem; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#34d399; margin-bottom:0.2rem; }
.benefit .b-text { font-size:0.82rem; color:var(--soft); line-height:1.55; }
.benefit .b-text strong { color:var(--text); }

/* Panels with real depth */
.panel {
  background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 35%), linear-gradient(160deg, var(--card), var(--surface));
  border:1px solid rgba(255,255,255,0.07);
  border-radius:18px;
  box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 40px -16px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.35);
  padding:1.75rem 2rem;
  margin-bottom:1.5rem;
}
.panel h2 { font-size:clamp(1.4rem,3.5vw,2rem); margin-bottom:0.75rem; }
.panel .kicker { font-size:0.68rem; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; color:${p.cta_color}; margin-bottom:0.4rem; }

/* Shared interactive styles */
.menu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:0.9rem; }
.menu-item { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:1rem 1.25rem; display:flex; flex-direction:column; gap:0.5rem; }
.menu-item .item-name { font-weight:700; font-size:1rem; }
.menu-item .item-desc { font-size:0.82rem; color:var(--soft); flex:1; }
.menu-item .item-row { display:flex; justify-content:space-between; align-items:center; margin-top:0.4rem; }
.menu-item .item-price { font-weight:800; font-size:1.15rem; color:${p.cta_color}; font-variant-numeric:tabular-nums; }
.btn-brand { background:var(--brand); color:#0b0f1a; border:none; padding:0.45rem 0.9rem; border-radius:999px; font-weight:700; cursor:pointer; font-family:inherit; font-size:0.8rem; transition:transform 0.1s, box-shadow 0.1s; text-decoration:none; display:inline-flex; align-items:center; gap:0.3rem; box-shadow:0 6px 18px ${p.cta_color}55, inset 0 0 0 1px rgba(0,0,0,0.05); }
.btn-brand:hover { transform:translateY(-1px); box-shadow:0 9px 24px ${p.cta_color}88, inset 0 0 0 1px rgba(0,0,0,0.05); }
.btn-ghost { background:rgba(255,255,255,0.05); color:var(--text); border:1px solid rgba(255,255,255,0.12); padding:0.45rem 0.9rem; border-radius:999px; font-weight:600; cursor:pointer; font-family:inherit; font-size:0.8rem; text-decoration:none; display:inline-flex; align-items:center; gap:0.3rem; transition:background 0.15s, border-color 0.15s; }
.btn-ghost:hover { background:rgba(255,255,255,0.09); border-color:rgba(255,255,255,0.22); }

.status-pill { display:inline-flex; align-items:center; gap:0.4rem; padding:0.3rem 0.75rem; border-radius:999px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; }
.status-open { background:rgba(52,211,153,0.12); color:#34d399; }

.form-row { display:flex; flex-direction:column; gap:0.3rem; margin-bottom:0.85rem; }
.form-row label { font-size:0.68rem; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); }
.form-row input, .form-row select, .form-row textarea { background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:0.65rem 0.85rem; color:var(--text); font-family:inherit; font-size:0.92rem; outline:none; }
.form-row input:focus, .form-row select:focus, .form-row textarea:focus { border-color:var(--brand); }

.time-slot { display:inline-block; padding:0.5rem 0.85rem; background:var(--card); border:1px solid var(--border); border-radius:8px; margin:0.25rem; cursor:pointer; font-size:0.85rem; transition:all 0.1s; }
.time-slot:hover { border-color:var(--brand); }
.time-slot.picked { background:var(--brand); color:#0b0f1a; border-color:var(--brand); font-weight:700; }

.toast { position:fixed; bottom:6.5rem; left:50%; transform:translateX(-50%) translateY(40px); background:var(--brand); color:#0b0f1a; padding:0.75rem 1.25rem; border-radius:10px; font-weight:800; opacity:0; transition:all 0.3s; z-index:200; box-shadow:0 8px 30px ${p.cta_color}88; pointer-events:none; }
.toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

/* Sticky bottom CTA bar \u2014 quieter than before, supportive not screaming */
.get-bar {
  position:fixed; left:0; right:0; bottom:0; z-index:90;
  background:rgba(11,15,26,0.92); backdrop-filter:blur(14px);
  border-top:1px solid rgba(255,255,255,0.06);
  padding:0.65rem 1.25rem;
  display:flex; align-items:center; justify-content:flex-end; gap:1rem; flex-wrap:wrap;
  box-shadow:0 -6px 24px rgba(0,0,0,0.35);
}
.get-bar-label { font-size:0.82rem; color:var(--soft); flex:1; text-align:left; min-width:200px; }
.get-bar-label strong { color:var(--text); font-weight:700; }
.get-bar-cta { background:transparent; color:${p.cta_color}; padding:0.55rem 1.1rem; border-radius:999px; font-weight:700; border:1px solid ${p.cta_color}66; cursor:pointer; font-family:inherit; font-size:0.85rem; transition:background 0.15s, border-color 0.15s; }
.get-bar-cta:hover { background:${p.cta_color}14; border-color:${p.cta_color}; }

/* Get-this modal */
.modal-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:300; align-items:center; justify-content:center; backdrop-filter:blur(8px); padding:1rem; overflow-y:auto; }
.modal-overlay.open { display:flex; }
.modal-card { background:linear-gradient(160deg,rgba(26,35,56,0.97),rgba(20,27,45,0.95)); border:1px solid ${p.cta_color}33; border-radius:20px; padding:2rem; max-width:500px; width:100%; position:relative; box-shadow:0 20px 80px rgba(0,0,0,0.6), 0 0 80px ${p.cta_color}22; }
.modal-close { position:absolute; top:1rem; right:1rem; background:rgba(255,255,255,0.08); border:none; width:32px; height:32px; border-radius:50%; color:var(--soft); cursor:pointer; font-size:1.1rem; }

/* "Why this works" evidence panel \u2014 moved to bottom, supporting evidence */
.evidence { margin-top:1.5rem; }
.evidence .section-head { text-align:center; margin-bottom:1.5rem; }
.evidence .section-head .kicker { font-size:0.7rem; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; color:${p.cta_color}; margin-bottom:0.4rem; }
.evidence .section-head h2 { font-size:clamp(1.5rem,3.5vw,2.1rem); }
.roi-strip { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:0.85rem; }
.roi-tile { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:1.1rem 1.25rem; text-align:left; }
.roi-val { font-size:1.85rem; font-weight:800; line-height:1; letter-spacing:-0.025em; font-variant-numeric:tabular-nums; font-family:var(--display-font); }
.roi-lbl { font-size:0.68rem; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:var(--text); margin-top:0.55rem; }
.roi-sub { font-size:0.72rem; color:var(--muted); margin-top:0.25rem; }

/* Rep card */
.rep-card { background:linear-gradient(135deg,${g1}14,${g2}10); border:1px solid ${p.cta_color}33; border-radius:14px; padding:1.1rem 1.25rem; margin-top:1rem; display:flex; align-items:center; gap:0.85rem; }
.rep-avatar { width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg,${g1},${g2}); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.1rem; color:#0b0f1a; }
.rep-info { flex:1; font-size:0.88rem; }
.rep-info strong { display:block; color:var(--text); }
.rep-info .sub { color:var(--soft); font-size:0.78rem; margin-top:0.1rem; }

/* Real business footer — 3-column NAP */
.site-footer { margin-top:3rem; padding:clamp(2.5rem,4vw,3.5rem) 1.5rem 2rem; border-top:1px solid rgba(255,255,255,0.06); background:linear-gradient(180deg, transparent, rgba(0,0,0,0.18)); }
.site-footer-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr; gap:2rem; }
@media (min-width:760px) { .site-footer-inner { grid-template-columns:1.2fr 1fr 1.2fr; gap:3rem; } }
.foot-col h4 { font-family:var(--display-font); font-size:1rem; color:var(--text); margin-bottom:0.7rem; font-weight:700; }
.foot-col p, .foot-col li { color:var(--soft); font-size:0.88rem; line-height:1.6; }
.foot-col ul { list-style:none; }
.foot-col li { padding:0.2rem 0; }
.foot-col a { color:var(--soft); text-decoration:none; }
.foot-col a:hover { color:var(--text); }
.foot-disclaimer { background:rgba(255,255,255,0.04); border:1px dashed rgba(255,255,255,0.15); border-radius:12px; padding:1rem 1.15rem; }
.foot-disclaimer strong { color:var(--text); }
.foot-bottom { max-width:1100px; margin:2rem auto 0; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; font-size:0.78rem; color:var(--muted); }
.foot-bottom a { color:var(--soft); }

/* Hero mockup SVG container — replaces the old blob artwork */
.hero-mockup { position:relative; max-width:480px; margin:0 auto; width:100%; filter: drop-shadow(0 24px 60px rgba(0,0,0,0.55)) drop-shadow(0 0 80px ${g1}33); display:none; }
.hero-mockup svg { width:100%; height:auto; display:block; }
@media (min-width:720px) { .hero-mockup { display:block; max-width:380px; } }
@media (min-width:1000px) { .hero-mockup { max-width:480px; } }

/* Use-case narrative panel — one moment in a week */
.use-case-panel { padding:1.75rem 2rem; max-width:780px; margin:0 auto 1.5rem; }
.use-case-row { display:grid; grid-template-columns:auto 1fr; gap:1.1rem; align-items:start; padding:0.85rem 0; border-bottom:1px dashed rgba(255,255,255,0.06); }
.use-case-row:last-child { border-bottom:none; }
.use-case-kicker { font-size:0.62rem; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; padding:0.4rem 0.7rem; border-radius:8px; white-space:nowrap; align-self:start; min-width:120px; text-align:center; line-height:1.2; }
.use-case-kicker.k-scene { background:rgba(160,174,192,0.1); color:#a0aec0; border:1px solid rgba(160,174,192,0.22); }
.use-case-kicker.k-old { background:rgba(248,113,113,0.1); color:#f87171; border:1px solid rgba(248,113,113,0.28); }
.use-case-kicker.k-app { background:linear-gradient(135deg,${g1}26,${g2}1a); color:${p.cta_color}; border:1px solid ${p.cta_color}55; }
.use-case-kicker.k-proof { background:rgba(52,211,153,0.12); color:#34d399; border:1px solid rgba(52,211,153,0.32); }
.use-case-body { font-family:var(--body-font); line-height:1.65; color:var(--soft); font-size:0.95rem; }
.use-case-body.b-app { color:var(--text); font-size:1rem; }
.use-case-body.b-proof { color:var(--text); font-size:1rem; font-weight:600; }
@media (max-width:640px) {
  .use-case-row { grid-template-columns:1fr; gap:0.45rem; }
  .use-case-kicker { min-width:0; width:max-content; }
}

/* Differentiation grid — "Why X beats Y" */
.diff-section { margin-top:1.5rem; }
.diff-section .section-head { text-align:center; margin-bottom:1.5rem; }
.diff-section .section-head h2 { font-size:clamp(1.5rem,3.5vw,2.1rem); }
.diff-section .section-head .kicker { font-size:0.7rem; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; color:${p.cta_color}; margin-bottom:0.4rem; }
.diff-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
@media (min-width:760px) { .diff-grid { grid-template-columns:repeat(3, 1fr); gap:1.1rem; } }
.diff-card { background:linear-gradient(160deg, var(--card), var(--surface)); border:1px solid ${p.cta_color}33; border-radius:16px; padding:1.4rem 1.5rem; box-shadow:0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 30px -12px rgba(0,0,0,0.5); position:relative; }
.diff-card .diff-tick { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,${g1},${g2}); display:flex; align-items:center; justify-content:center; color:#0b0f1a; font-weight:900; font-size:1.05rem; box-shadow:0 6px 18px ${p.cta_color}44; margin-bottom:0.85rem; }
.diff-card h3 { font-family:var(--display-font); font-size:1.05rem; font-weight:700; line-height:1.25; margin-bottom:0.55rem; color:var(--text); }
.diff-card p { font-family:var(--body-font); font-size:0.88rem; line-height:1.55; color:var(--soft); }

/* Trust block — quote, stat, before/after, ICP fit */
.trust-block { margin-top:1.5rem; }
.trust-quote { background:linear-gradient(135deg,${g1}10,${g2}08,${g3}10); border:1px solid ${p.cta_color}33; border-radius:18px; padding:2rem 2.25rem; text-align:center; max-width:820px; margin:0 auto 1.5rem; position:relative; }
.trust-quote::before { content:'\\201C'; position:absolute; top:-6px; left:18px; font-family:var(--display-font); font-size:5rem; font-weight:700; color:${p.cta_color}55; line-height:1; }
.trust-quote blockquote { font-family:var(--display-font); font-size:clamp(1.15rem,2.2vw,1.5rem); font-style:italic; font-weight:500; line-height:1.4; color:var(--text); margin-bottom:0.85rem; }
.trust-quote cite { font-style:normal; font-size:0.82rem; color:var(--soft); font-weight:600; letter-spacing:0.01em; }
.trust-stat-grid { display:grid; grid-template-columns:1fr; gap:1rem; max-width:820px; margin:0 auto 1.25rem; }
@media (min-width:680px) { .trust-stat-grid { grid-template-columns:1fr 1.4fr; } }
.trust-stat-tile { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:1.5rem 1.75rem; }
.trust-stat-tile.tile-stat { display:flex; flex-direction:column; justify-content:center; align-items:flex-start; }
.trust-stat-tile .t-stat-val { font-family:var(--display-font); font-size:clamp(2.4rem,5vw,3.4rem); font-weight:800; line-height:1; letter-spacing:-0.02em; background:linear-gradient(135deg,${g1},${g2} 55%,${g3}); -webkit-background-clip:text; background-clip:text; color:transparent; margin-bottom:0.5rem; font-variant-numeric:tabular-nums; }
.trust-stat-tile .t-stat-lbl { font-size:0.85rem; color:var(--soft); line-height:1.45; }
.trust-stat-tile.tile-compare { display:flex; flex-direction:column; gap:0.85rem; }
.trust-compare-row { display:grid; grid-template-columns:auto 1fr; gap:0.85rem; align-items:start; }
.trust-compare-icon { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem; flex-shrink:0; }
.trust-compare-row.row-before .trust-compare-icon { background:rgba(248,113,113,0.16); color:#f87171; border:1px solid rgba(248,113,113,0.3); }
.trust-compare-row.row-after .trust-compare-icon { background:rgba(52,211,153,0.16); color:#34d399; border:1px solid rgba(52,211,153,0.3); }
.trust-compare-text { font-size:0.92rem; line-height:1.5; }
.trust-compare-row.row-before .trust-compare-text { color:var(--muted); text-decoration:line-through; text-decoration-color:rgba(248,113,113,0.5); }
.trust-compare-row.row-after .trust-compare-text { color:var(--text); }
.trust-compare-row .t-row-label { display:block; font-size:0.62rem; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; margin-bottom:0.25rem; }
.trust-compare-row.row-before .t-row-label { color:#f87171; }
.trust-compare-row.row-after .t-row-label { color:#34d399; }
.trust-icp-strip { background:rgba(255,255,255,0.04); border:1px dashed rgba(255,255,255,0.16); border-radius:14px; padding:1rem 1.25rem; max-width:820px; margin:0 auto; display:grid; grid-template-columns:1fr; gap:0.75rem; }
@media (min-width:680px) { .trust-icp-strip { grid-template-columns:1fr 1fr; gap:1.5rem; } }
.trust-icp-cell { display:grid; grid-template-columns:auto 1fr; gap:0.7rem; align-items:start; }
.trust-icp-cell .icp-tag { font-size:0.62rem; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; padding:0.35rem 0.6rem; border-radius:8px; white-space:nowrap; align-self:start; }
.trust-icp-cell.cell-yes .icp-tag { background:rgba(52,211,153,0.14); color:#34d399; border:1px solid rgba(52,211,153,0.3); }
.trust-icp-cell.cell-no  .icp-tag { background:rgba(248,113,113,0.12); color:#f87171; border:1px solid rgba(248,113,113,0.26); }
.trust-icp-cell .icp-text { font-size:0.85rem; line-height:1.5; color:var(--soft); }

/* Hero risk-reversal pill row + price subline (added in conversion overhaul) */
.hero-trust-row { display: flex; flex-wrap: wrap; gap: 0.5rem 0.85rem; margin: 0.85rem 0 0.5rem; align-items: center; font-size: 0.78rem; color: var(--soft); }
.hero-trust-pill { display: inline-flex; align-items: center; padding: 0.3rem 0.65rem; background: rgba(52, 211, 153, 0.08); border: 1px solid rgba(52, 211, 153, 0.25); border-radius: 999px; color: #34d399; font-weight: 600; }
.hero-price-line { display: inline-flex; align-items: center; padding: 0.4rem 0.7rem; font-size: 0.78rem; color: var(--soft); font-weight: 500; }
@media (max-width: 720px) { .hero-trust-row { gap: 0.35rem; } .hero-trust-pill { font-size: 0.72rem; padding: 0.25rem 0.55rem; } }

/* Inline mid-page CTA strip */
.inline-cta { display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap; padding: 1.25rem 1.5rem; margin: 1.5rem 0; background: linear-gradient(135deg, ${g1}10, ${g2}08); border: 1px solid ${p.cta_color}33; border-radius: 14px; }
.inline-cta > span { color: var(--text); font-weight: 600; font-size: 1rem; }
.inline-cta .btn-brand { white-space: nowrap; }
@media (max-width: 720px) { .inline-cta { padding: 1rem; } .inline-cta > span { font-size: 0.95rem; flex-basis: 100%; } }

/* "Your first week" timeline */
.week-grid { display: grid; grid-template-columns: 1fr; gap: 0.85rem; margin-top: 0.5rem; }
@media (min-width: 720px) { .week-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1100px) { .week-grid { grid-template-columns: repeat(4, 1fr); } }
.week-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.15rem; }
.week-day { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; color: ${p.cta_color}; margin-bottom: 0.45rem; }
.week-task { font-size: 0.88rem; color: var(--soft); line-height: 1.5; }

/* Modal risk-reversal strip */
.modal-reassurance { display: flex; flex-wrap: wrap; gap: 0.4rem 0.75rem; padding: 0.65rem 0; margin: 0.5rem 0 0.85rem; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); justify-content: center; font-size: 0.78rem; color: #34d399; font-weight: 600; }

/* Modal post-submit success card */
.modal-success-card { text-align: center; padding: 0.5rem 0; }
.modal-success-tick { width: 56px; height: 56px; margin: 0 auto 1rem; background: linear-gradient(135deg, #34d399, #10b981); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; color: #0b0f1a; box-shadow: 0 8px 24px rgba(52, 211, 153, 0.35); }
.modal-success-card h3 { margin: 0 0 0.5rem; }
.modal-success-actions { display: flex; flex-direction: column; gap: 0.5rem; }
.modal-success-btn { width: 100%; padding: 0.75rem 1.25rem !important; font-size: 0.92rem !important; text-align: center; justify-content: center; }
.hidden { display: none !important; }

/* Reduced-motion guard */
@media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation: none !important; transition-duration: 0.01ms !important; scroll-behavior:auto !important; } }
</style>
</head><body>

<div class="demo-banner">
  \ud83d\ude80 This is a real, working app \u2014 branded for <strong>${esc(b.name)}</strong>. Yours could go live like this in 7 days. Tap around \u2192
</div>

<nav class="site-nav" aria-label="Main">
  <a href="#" class="brand">
    <div class="brand-logo">${b.logo_emoji}</div>
    <span class="brand-name">${esc(b.name)}</span>
  </a>
  <div class="site-links">
    ${chrome.nav_links.map(l => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join('')}
    <a href="#" class="nav-meta" onclick="event.preventDefault();openGetThis()">\u{1F680} Get this for my business</a>
  </div>
</nav>

<main>
  <section class="hero">
    <div class="hero-copy">
      <div class="hero-trust">${chrome.trust_pill}</div>
      <h1 class="display"><span class="grad">${esc(cleanTagline)}</span></h1>
      <p class="hero-sub">${esc(chrome.hero_benefit)}</p>
      <div class="hero-ctas">
        <a href="${esc(chrome.primary_cta.href)}" class="btn-brand">${esc(chrome.primary_cta.label)}</a>
        <a href="${esc(chrome.secondary_cta.href)}" class="btn-ghost">${esc(chrome.secondary_cta.label)}</a>
        <button type="button" class="btn-brand hero-modal-cta" onclick="openGetThis()">\u{1F680} I want this \u2014 show me a plan</button>
        <span class="hero-price-line">From $${p.pricing[0]?.setup || 499} setup + $${p.pricing[0]?.price_per_month || 79}/mo \u00b7 live in 1 week</span>
      </div>
      <div class="hero-trust-row">
        <span class="hero-trust-pill">\u2713 Cancel any month \u00b7 no lock-in</span>
        <span class="hero-trust-pill">\u2713 30-day setup guarantee</span>
        <span class="hero-trust-pill">\u2713 Your data, exportable any time</span>
      </div>
      <div class="hero-meta">
        ${b.phone !== '\u2014' ? `<span>\ud83d\udcde <strong>${esc(b.phone)}</strong></span>` : ''}
        <span>\ud83d\udccd <strong>${esc(suburbLabel)}</strong></span>
      </div>
    </div>
    <div class="hero-mockup">
      ${content.hero_mockup || `<div class="hero-art" aria-hidden="true"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="stamp">${b.logo_emoji}</div></div>`}
    </div>
  </section>

  ${content.use_case.scene ? `
  <section class="panel use-case-panel" id="use-case">
    <div class="kicker">A real moment</div>
    <h2 class="display" style="margin-bottom:1.25rem">How ${esc(b.name)} actually uses this</h2>
    <div class="use-case-row">
      <span class="use-case-kicker k-scene">🎬 Scene</span>
      <div class="use-case-body">${esc(content.use_case.scene)}</div>
    </div>
    <div class="use-case-row">
      <span class="use-case-kicker k-old">🚫 The old way</span>
      <div class="use-case-body">${esc(content.use_case.old_way)}</div>
    </div>
    <div class="use-case-row">
      <span class="use-case-kicker k-app">✨ With the app</span>
      <div class="use-case-body b-app">${esc(content.use_case.with_app)}</div>
    </div>
    <div class="use-case-row">
      <span class="use-case-kicker k-proof">🎯 The proof</span>
      <div class="use-case-body b-proof">${esc(content.use_case.proof)}</div>
    </div>
  </section>
  <div class="inline-cta">
    <span>Want this kind of week for your business?</span>
    <button type="button" class="btn-brand" onclick="openGetThis()">Get a tailored plan →</button>
  </div>
  ` : ''}

  ${renderDemoBody(p, b)}

  ${content.differentiation.points.length ? `
  <section class="diff-section" id="differentiation">
    <div class="section-head">
      <div class="kicker">Head-to-head</div>
      <h2 class="display">Why ${esc(b.name)} beats ${esc(content.differentiation.vs)}</h2>
    </div>
    <div class="diff-grid">
      ${content.differentiation.points.map(pt => `
        <div class="diff-card">
          <div class="diff-tick" aria-hidden="true">✓</div>
          <h3>${esc(pt.title)}</h3>
          <p>${esc(pt.body)}</p>
        </div>
      `).join('')}
    </div>
  </section>
  <div class="inline-cta">
    <span>Stop paying ${p.id === 'tradie' ? 'ServiceM8' : p.id === 'online-store' ? 'Shopify' : p.id === 'festival' ? 'Eventbrite' : p.id === 'ai-social' ? 'Patreon' : 'them'}.</span>
    <button type="button" class="btn-brand" onclick="openGetThis()">Switch in a week →</button>
  </div>
  ` : ''}

  ${content.trust.quote ? `
  <section class="trust-block" id="real-results">
    <div class="section-head" style="text-align:center;margin-bottom:1.5rem">
      <div class="kicker" style="font-size:0.7rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:${p.cta_color};margin-bottom:0.4rem">Real results</div>
      <h2 class="display" style="font-size:clamp(1.5rem,3.5vw,2.1rem)">From people running this today</h2>
    </div>
    <div class="trust-quote">
      <blockquote>${esc(content.trust.quote)}</blockquote>
      <cite>— ${esc(content.trust.quote_attr)}</cite>
    </div>
    <div class="trust-stat-grid">
      <div class="trust-stat-tile tile-stat">
        <div class="t-stat-val">${esc(content.trust.stat_value)}</div>
        <div class="t-stat-lbl">${esc(content.trust.stat_label)}</div>
      </div>
      <div class="trust-stat-tile tile-compare">
        <div class="trust-compare-row row-before">
          <div class="trust-compare-icon" aria-hidden="true">✕</div>
          <div class="trust-compare-text"><span class="t-row-label">Before</span>${esc(content.trust.before)}</div>
        </div>
        <div class="trust-compare-row row-after">
          <div class="trust-compare-icon" aria-hidden="true">✓</div>
          <div class="trust-compare-text"><span class="t-row-label">After</span>${esc(content.trust.after)}</div>
        </div>
      </div>
    </div>
    <div class="trust-icp-strip">
      <div class="trust-icp-cell cell-yes">
        <span class="icp-tag">✓ Right for</span>
        <div class="icp-text">${esc(content.trust.icp_yes)}</div>
      </div>
      <div class="trust-icp-cell cell-no">
        <span class="icp-tag">✕ Not right for</span>
        <div class="icp-text">${esc(content.trust.icp_no)}</div>
      </div>
    </div>
  </section>
  <div class="inline-cta">
    <span>Become the next ${esc(b.name)}.</span>
    <button type="button" class="btn-brand" onclick="openGetThis()">Get started →</button>
  </div>
  ` : ''}

  <section class="evidence" id="why">
    <div class="section-head">
      <div class="kicker">Behind the scenes</div>
      <h2 class="display">Why this works for businesses like yours</h2>
    </div>
    <div class="roi-strip">
      ${p.stats.map(s => `
        <div class="roi-tile" style="color:${s.color}">
          <div class="roi-val">${esc(s.value)}</div>
          <div class="roi-lbl">${esc(s.label)}</div>
          <div class="roi-sub">${esc(s.sub)}</div>
        </div>
      `).join('')}
    </div>
  </section>

  <section class="panel" style="background:linear-gradient(135deg,${g1}10,${g2}08);border:1px solid ${p.cta_color}33">
    <div class="kicker">Your first week</div>
    <h2 class="display">From "yes" to live in 7 days.</h2>
    <p style="color:var(--soft);max-width:600px;margin:0.5rem 0 1.25rem">No lock-in contracts. No surprise fees. Here's exactly what happens once you reply:</p>
    <div class="week-grid">
      <div class="week-card"><div class="week-day">Day 1</div><div class="week-task">You send: logo, brand colours, 3 sample listings, your domain (or we register one for you).</div></div>
      <div class="week-card"><div class="week-day">Day 2\u20133</div><div class="week-task">I configure your branded version, set up Stripe in your name, wire your domain.</div></div>
      <div class="week-card"><div class="week-day">Day 4\u20135</div><div class="week-task">You preview, request changes, we tweak. Test orders + SMS together.</div></div>
      <div class="week-card"><div class="week-day">Day 6\u20137</div><div class="week-task">Live. You start taking orders. I'm on Slack/SMS for any questions.</div></div>
    </div>
  </section>

  <section class="panel">
    <div class="kicker">What you actually pay for</div>
    <h2 class="display">$${p.pricing[0]?.price_per_month || 79}/month, all-in.</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div>
        <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#34d399;margin-bottom:0.5rem">\u2713 Included flat</div>
        <ul style="list-style:none;padding:0;color:var(--soft);font-size:0.92rem;line-height:1.7">
          <li>\u2022 Hosting (Cloudflare Sydney edge)</li>
          <li>\u2022 Your .au domain</li>
          <li>\u2022 Branded site + admin app</li>
          <li>\u2022 Auto-SMS to customers (fair-use bundle)</li>
          <li>\u2022 Unlimited content changes</li>
          <li>\u2022 Same-day support replies</li>
        </ul>
      </div>
      <div>
        <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:0.5rem">\u2192 Pass-through (your accounts)</div>
        <ul style="list-style:none;padding:0;color:var(--soft);font-size:0.92rem;line-height:1.7">
          <li>\u2022 Stripe processing (~1.75% + 30c per AU transaction)</li>
          <li>\u2022 Domain rego if you don't have one (~$15/yr)</li>
          <li>\u2022 That's it. No platform cut. No app store.</li>
        </ul>
      </div>
    </div>
    <p style="color:var(--muted);font-size:0.82rem;margin:0;padding-top:0.75rem;border-top:1px solid rgba(255,255,255,0.05)">Setup fee is one-off. After that, the only line on your invoice from me is $${p.pricing[0]?.price_per_month || 79}/mo.</p>
  </section>

  <section class="panel" style="background:linear-gradient(135deg,${g1}14,${g2}10,${g3}14);border:1px solid ${p.cta_color}33;text-align:center;margin-top:1.5rem">
    <div class="kicker">Ready for yours?</div>
    <h2 class="display">Stop watching. Start running yours.</h2>
    <p style="color:var(--soft);max-width:600px;margin:0.5rem auto 1.25rem">${esc(p.sell_point)} All the value above, branded to <em>your</em> business, live within the week.</p>
    <button class="btn-brand" style="padding:1rem 2rem;font-size:1rem" onclick="openGetThis()">\u{1F680} Get this for my business</button>
    <div style="margin-top:0.75rem;font-size:0.78rem;color:var(--muted)">From $${p.pricing[0]?.setup || 499} setup + $${p.pricing[0]?.price_per_month || 79}/mo \u00b7 no lock-in \u00b7 live in 1 week</div>
  </section>
</main>

<div id="toast" class="toast"></div>

<div class="get-bar">
  <div class="get-bar-label">Want this for your business? <strong>Send me a tailored plan →</strong></div>
  <button class="get-bar-cta" onclick="openGetThis()">Get a plan</button>
</div>

<div id="get-modal" class="modal-overlay" onclick="if(event.target===this)closeGetThis()">
  <div class="modal-card">
    <button class="modal-close" onclick="closeGetThis()">\u00d7</button>
    <div id="g-modal-body">
      <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${p.cta_color};margin-bottom:0.4rem">Get ${esc(p.brand)} for your business</div>
      <h3 class="display" style="font-size:1.5rem;margin-bottom:0.4rem">Get ${esc(b.name)}, branded as yours.</h3>
      <p style="color:var(--soft);font-size:0.88rem;margin-bottom:1rem">Drop your details. <span id="rep-name-inline">Steve</span> will email you within 1 business day with a setup plan + final price.</p>

      <div id="rep-card-slot"></div>

      <div class="modal-reassurance">
        <span>\u2713 No lock-in</span>
        <span>\u2713 Cancel any month</span>
        <span>\u2713 Quote before you commit</span>
      </div>

      <div class="form-row"><label>Your name *</label><input type="text" id="g-name" placeholder="Sarah Mitchell" required></div>
      <div class="form-row"><label>Business name (optional)</label><input type="text" id="g-business" placeholder="Optional"></div>
      <div class="form-row"><label>Email *</label><input type="email" id="g-email" placeholder="sarah@email.com" required></div>
      <div class="form-row"><label>Anything specific? (optional)</label><textarea id="g-note" rows="2" placeholder="I\u2019d love my own online store for our bakery..."></textarea></div>

      <button id="g-submit" class="nav-cta" style="width:100%;padding:0.85rem;font-size:0.95rem;margin-top:0.5rem" onclick="submitGetThis()">Get my tailored plan \u2192</button>
      <div id="g-status" style="margin-top:0.5rem;font-size:0.82rem;text-align:center;color:var(--soft);min-height:1em"></div>
      <div style="margin-top:0.75rem;font-size:0.68rem;color:var(--muted);text-align:center">No spam. No tricks. One human follow-up.</div>
    </div>
  </div>
</div>

<footer class="site-footer">
  <div class="site-footer-inner">
    <div class="foot-col">
      <h4 style="display:flex;align-items:center;gap:0.55rem"><span style="display:inline-flex;width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,${g1},${g2});align-items:center;justify-content:center;font-size:0.92rem">${b.logo_emoji}</span>${esc(b.name)}</h4>
      <p style="margin-bottom:0.5rem">${b.tagline}</p>
      <p>${b.phone !== '—' ? `📞 ${esc(b.phone)} · ` : ''}📍 ${esc(suburbLabel)}</p>
    </div>
    <div class="foot-col">
      <h4>Explore</h4>
      <ul>
        ${chrome.nav_links.map(l => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('')}
      </ul>
    </div>
    <div class="foot-col">
      <div class="foot-disclaimer">
        <h4 style="margin-bottom:0.5rem">🏷 This is a sample.</h4>
        <p><strong>${esc(b.name)}</strong> is a sample business showcasing the <strong>${esc(p.brand)}</strong> whitelabel platform. Your version would use <em>your</em> brand, <em>your</em> colours, <em>your</em> customer list.</p>
      </div>
    </div>
  </div>
  <div class="foot-bottom">
    <div>© 2026 ${esc(b.name)} · Built on Penny Wise I.T whitelabel</div>
    <div><a href="#" onclick="event.preventDefault();openGetThis()">Get this for my business →</a></div>
  </div>
</footer>

<script>
const REF = ${JSON.stringify(ref)};
const PRODUCT_ID = ${JSON.stringify(p.id)};
const PRODUCT_NAME = ${JSON.stringify(p.brand)};

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

// Load rep info if ?ref=USERNAME present
async function loadRep() {
  if (!REF) return;
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/rep-info?u=' + encodeURIComponent(REF));
    const data = await res.json();
    if (!data.found) return;
    const firstName = data.first_name || 'your rep';
    const slot = document.getElementById('rep-card-slot');
    if (slot) {
      slot.innerHTML =
        '<div class="rep-card">' +
          '<div class="rep-avatar">' + (firstName[0] || '?').toUpperCase() + '</div>' +
          '<div class="rep-info">' +
            '<strong>' + firstName + '</strong>' +
            '<div class="sub">Your Penny Wise I.T contact' + (data.phone ? ' \u00b7 ' + data.phone : '') + '</div>' +
          '</div>' +
        '</div>';
    }
    const inline = document.getElementById('rep-name-inline');
    if (inline) inline.textContent = firstName;
  } catch {}
}
loadRep();

function openGetThis() { document.getElementById('get-modal').classList.add('open'); }
function closeGetThis() { document.getElementById('get-modal').classList.remove('open'); }
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const m = document.getElementById('get-modal');
    if (m && m.classList.contains('open')) closeGetThis();
  }
});

function escAttr(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c)); }

function showSuccessCard(name, email, repFirstName) {
  const body = document.getElementById('g-modal-body');
  if (!body) return;
  const safeName = escAttr(name);
  const safeEmail = escAttr(email);
  const productBrand = ${JSON.stringify(p.brand)};
  const shareSubject = encodeURIComponent('Have a look at this \u2014 ' + productBrand);
  const shareBody = encodeURIComponent('Found this \u2014 looks like a fit for our business: ' + window.location.href);
  body.innerHTML =
    '<div class="modal-success-card">' +
      '<div class="modal-success-tick">\u2713</div>' +
      '<h3 class="display">On its way, ' + safeName + '.</h3>' +
      '<p style="color:var(--soft);font-size:0.95rem;line-height:1.55;margin:0 0 1.25rem">' +
        (repFirstName || 'Steve') + ' will email <strong>' + safeEmail + '</strong> within 1 business day with a setup plan + final price for ' + escAttr(productBrand) + ' branded as your business. Check spam if you don\\'t see it.' +
      '</p>' +
      '<div class="modal-success-actions">' +
        '<a href="#book-call" class="btn-brand modal-success-btn" onclick="event.preventDefault(); document.getElementById(\\'book-call-form\\').classList.remove(\\'hidden\\'); this.style.display=\\'none\\'">\ud83d\udcc5 Book a 15-min call instead</a>' +
        '<a href="https://www.pennywiseit.com.au/apps" target="_blank" rel="noopener noreferrer" class="btn-ghost modal-success-btn">See the other 8 apps</a>' +
        '<a href="mailto:?subject=' + shareSubject + '&body=' + shareBody + '" class="btn-ghost modal-success-btn">Send to a partner</a>' +
      '</div>' +
      '<form id="book-call-form" class="hidden" style="margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.06)" onsubmit="event.preventDefault();bookCall()">' +
        '<div class="form-row"><label>Three times that work for you</label><textarea rows="3" id="bc-times" placeholder="e.g. Tue 9\u201311am, Wed afternoon, Fri 4pm" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:0.7rem 0.85rem;color:var(--text);font-family:inherit;font-size:0.92rem;width:100%"></textarea></div>' +
        '<button type="button" class="btn-brand" onclick="bookCall()" style="width:100%">Send my times</button>' +
        '<div id="bc-status" style="margin-top:0.5rem;font-size:0.82rem;text-align:center;color:var(--soft)"></div>' +
      '</form>' +
    '</div>';
}

async function submitGetThis() {
  const name = document.getElementById('g-name').value.trim();
  const business = document.getElementById('g-business').value.trim();
  const email = document.getElementById('g-email').value.trim();
  const note = document.getElementById('g-note').value.trim();
  const btn = document.getElementById('g-submit');
  const status = document.getElementById('g-status');
  if (!name) { status.textContent = 'Enter your name.'; status.style.color = '#f87171'; return; }
  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { status.textContent = 'Enter a valid email.'; status.style.color = '#f87171'; return; }
  btn.disabled = true; btn.textContent = 'Sending...';
  status.textContent = ''; status.style.color = '#a0aec0';
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/demo-interest', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: PRODUCT_ID, product_name: PRODUCT_NAME,
        name, business_name: business, email, note, ref: REF,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    showSuccessCard(name, email, data.rep_first_name || 'Steve');
  } catch (e) {
    status.textContent = e.message || 'Failed. Please try again.';
    status.style.color = '#f87171';
    btn.disabled = false; btn.textContent = 'Get my tailored plan \u2192';
  }
}

async function bookCall() {
  const times = document.getElementById('bc-times').value.trim();
  const status = document.getElementById('bc-status');
  if (!times) { status.textContent = 'Enter at least one time.'; status.style.color = '#f87171'; return; }
  status.textContent = 'Sending...'; status.style.color = '#a0aec0';
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/demo-interest', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: PRODUCT_ID + '-booking', product_name: PRODUCT_NAME,
        name: 'Booking request', email: '', note: 'Booking: ' + times, ref: REF,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Something went wrong');
    }
    status.textContent = '\u2705 Times sent. Steve will confirm by email shortly.';
    status.style.color = '#34d399';
  } catch (e) {
    status.textContent = e.message || 'Failed. Please try again.';
    status.style.color = '#f87171';
  }
}

let cart = [];
function addToCart(name, price) { cart.push({ name, price }); updateCartBar(); toast('\u2713 ' + name + ' added'); }
function updateCartBar() {
  const bar = document.getElementById('cart-bar');
  if (!bar) return;
  if (!cart.length) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  const total = cart.reduce((s, i) => s + i.price, 0);
  document.getElementById('cart-count').textContent = cart.length + ' item' + (cart.length > 1 ? 's' : '');
  document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
}
function mockCheckout() {
  if (!cart.length) return;
  const total = cart.reduce((s, i) => s + i.price, 0);
  toast('\ud83c\udf89 Mock checkout \u00b7 $' + total.toFixed(2) + ' \u00b7 Real version uses Stripe');
  cart = [];
  updateCartBar();
}
function pickSlot(el) {
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('picked'));
  el.classList.add('picked');
  toast('\u2713 ' + el.textContent + ' selected');
}
function mockSubmit(label) { toast('\u2713 ' + label + ' \u00b7 Real version notifies the owner instantly'); }
</script>

</body></html>`;
}

// Benefit callout HTML helper
export function bf(icon: string, title: string, body: string): string {
  return `<div class="benefit"><div class="b-icon">${icon}</div><div class="b-body"><div class="b-title">What this means for you</div><div class="b-text">${body}</div></div></div>`;
}

function renderDemoBody(p: ProductConfig, b: any): string {
  switch (p.id) {
    case 'food-truck': return foodTruckDemo(b);
    case 'online-store': return onlineStoreDemo(b);
    case 'tradie': return tradieDemo(b);
    case 'festival': return festivalDemo(b);
    case 'delivery': return deliveryDemo(b, p);
    case 'ai-social': return aiSocialDemo(b);
    case 'car-hire': return carHireDemo(b);
    case 'butchers': return butchersDemo(b);
    case 'sports-club': return sportsClubDemo(b);
    default: return '<p>Demo coming soon.</p>';
  }
}

// ──────────────── Per-product demo bodies with inline benefit callouts ────────────────

export function foodTruckDemo(b: any): string {
  const menu = [
    { name: 'Texas Brisket Roll',    desc: '14-hr smoked brisket, pickles, BBQ slaw on soft brioche',   price: 16.50 },
    { name: 'Low &amp; Slow Pulled Pork', desc: 'House-smoked pork shoulder, apple slaw, sweet pickles', price: 14.00 },
    { name: 'Smoke Shack Loaded Fries', desc: 'Chips, brisket burnt ends, cheese sauce, spring onion', price: 12.00 },
    { name: 'Sticky BBQ Ribs (half)', desc: 'Fall-off-the-bone ribs, house BBQ glaze, pickles',         price: 22.00 },
    { name: 'Mac &amp; Cheese Bowl',  desc: 'Creamy 3-cheese mac, smoked bacon crumb',                  price: 10.00 },
    { name: 'House Lemonade',          desc: 'Fresh-squeezed, cold, bottomless',                         price: 5.00 },
  ];

  return `
<section id="demo" class="panel">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem">
    <div><div class="kicker">Live menu</div><h2 class="display">What's cooking today</h2></div>
    <span class="status-pill status-open">\u25cf Open \u00b7 Ready in 10\u201315 min</span>
  </div>
  <div class="menu-grid">
    ${menu.map(m => `
      <div class="menu-item">
        <div class="item-name">${m.name}</div>
        <div class="item-desc">${m.desc}</div>
        <div class="item-row">
          <span class="item-price">$${m.price.toFixed(2)}</span>
          <button class="btn-brand" onclick="addToCart('${m.name.replace(/&amp;/g, '&').replace(/'/g, "\\'")}', ${m.price})">+ Add</button>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcc8', 'Live menu', '<strong>Pre-orders on quiet hours</strong> = revenue when the window is dead. <strong>Stripe payments in your account</strong> not ours. When items sell out, one tap marks them sold. No yelling &ldquo;we&rsquo;re out of ribs&rdquo; to the queue.')}
</section>

<section id="location" class="panel">
  <div class="kicker">\ud83d\udccd Where's the truck today</div>
  <h2 class="display">Riverside Markets \u00b7 till 2pm</h2>
  <p style="color:var(--soft);margin-bottom:0.5rem">Tomorrow: <strong>Yeppoon Main Beach</strong> \u00b7 Friday: <strong>Gracemere Pub</strong></p>
  <p style="font-size:0.85rem;color:var(--muted)">\ud83d\udcde ${esc(b.phone)} \u00b7 Real version auto-posts to Facebook &amp; Instagram when you tap "I'm here".</p>
  ${bf('\ud83d\udccd', 'Real-world value', 'Customers <strong>never ring asking "where are you today?"</strong> again. Real-time location + auto-posted updates = <strong>20-40% more walk-ups on pop-up days</strong>.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Pre-order for catering</div>
  <h2 class="display">Feeding a crowd?</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
    <div>
      <div class="form-row"><label>Your name</label><input type="text" placeholder="Jane"></div>
      <div class="form-row"><label>Phone</label><input type="tel" placeholder="0412 345 678"></div>
      <div class="form-row"><label>Pickup date</label><input type="date"></div>
      <div class="form-row"><label>Guests</label><input type="number" placeholder="25" min="5" max="200"></div>
    </div>
    <div>
      <div class="form-row"><label>What do you want?</label><textarea rows="5" placeholder="25 \u00d7 brisket rolls + sides?"></textarea></div>
      <button class="btn-brand" style="width:100%;padding:0.85rem;font-size:1rem" onclick="mockSubmit('Catering quote')">\ud83d\udccb Request quote</button>
    </div>
  </div>
  ${bf('\ud83d\udcb0', 'Catering = 2\u20133\u00d7 avg ticket', '<strong>One catering order a week = ~$400 extra revenue</strong>. This form captures inquiries while you&rsquo;re cooking. You text a quote back from the couch at night, done.')}
</section>

<div id="cart-bar" style="position:fixed;bottom:5.5rem;left:1rem;right:1rem;max-width:500px;margin:0 auto;background:var(--brand);color:#0b0f1a;border-radius:14px;padding:0.75rem 1.25rem;display:none;justify-content:space-between;align-items:center;gap:1rem;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-weight:800;z-index:70" class="hidden">
  <div><span id="cart-count">0 items</span> \u00b7 <span id="cart-total">$0.00</span></div>
  <button class="btn-ghost" style="background:#0b0f1a;color:var(--text);border-color:rgba(255,255,255,0.1)" onclick="mockCheckout()">Mock checkout \u2192</button>
</div>
<style>#cart-bar.hidden { display:none !important; } #cart-bar:not(.hidden) { display:flex !important; }</style>
`;
}

export function onlineStoreDemo(b: any): string {
  const products = [
    { name: 'Classic Dill Pickles (500g)', desc: 'Tangy, crunchy, made with fresh Gherkins from Bundaberg', price: 14.00, emoji: '\ud83e\udd52' },
    { name: 'Smoky Hot Sauce',              desc: 'Chipotle + brown sugar + a hint of mango',                price: 12.00, emoji: '\ud83c\udf36\ufe0f' },
    { name: 'Fermented Sauerkraut (1kg)',   desc: 'Raw, probiotic, zero preservatives',                      price: 18.00, emoji: '\ud83e\udd6c' },
    { name: 'Pickle Gift Trio',             desc: 'Three 250g jars, branded box, perfect for gifting',       price: 35.00, emoji: '\ud83c\udf81' },
    { name: 'Hot Chilli Oil',               desc: 'Made with our own smoked chillies',                       price: 16.00, emoji: '\ud83c\udf36\ufe0f' },
    { name: 'Starter Kit (5 items)',        desc: 'One of everything, save 15%',                             price: 70.00, emoji: '\ud83d\udce6' },
  ];
  return `
<section id="demo" class="panel">
  <div class="kicker">Live storefront</div>
  <h2 class="display">Shop small-batch goodness</h2>
  <div class="menu-grid">
    ${products.map(p => `
      <div class="menu-item">
        <div style="font-size:2.5rem;margin-bottom:0.3rem">${p.emoji}</div>
        <div class="item-name">${p.name}</div>
        <div class="item-desc">${p.desc}</div>
        <div class="item-row">
          <span class="item-price">$${p.price.toFixed(2)}</span>
          <button class="btn-brand" onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})">+ Add</button>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcb3', 'Own your store, keep your customers', 'Stripe \u2192 <strong>your bank, same day</strong>. No Shopify 2.9% tax. Customer list = <strong>your</strong> database, not someone else&rsquo;s. At $10k/mo revenue you save <strong>$290/mo in fees alone</strong> \u2014 covers 3\u00d7 the monthly hosting.')}
</section>

<section id="shipping" class="panel">
  <div class="kicker">\ud83d\ude9a Shipping</div>
  <h2 class="display">Delivered to your door</h2>
  <ul style="list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem">
    <li style="padding:0.85rem 1.25rem;background:var(--card);border:1px solid var(--border);border-radius:10px"><strong>Local</strong> \u2014 $5 flat \u00b7 Rocky/Yeppoon</li>
    <li style="padding:0.85rem 1.25rem;background:var(--card);border:1px solid var(--border);border-radius:10px"><strong>Australia-wide</strong> \u2014 $9.95 Aus Post</li>
    <li style="padding:0.85rem 1.25rem;background:var(--card);border:1px solid var(--border);border-radius:10px"><strong>Free over $60</strong> \u2014 ships everywhere</li>
  </ul>
  ${bf('\ud83d\udce6', 'SMS order updates = fewer support emails', 'Auto-SMS at <strong>Received \u2192 Packed \u2192 Shipped</strong> cuts <strong>&ldquo;where&rsquo;s my order?&rdquo;</strong> emails by 1/3. Your customers feel looked after, you get your evenings back.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Keep in touch</div>
  <h2 class="display">Subscribe for drops</h2>
  <div style="display:flex;gap:0.5rem;max-width:520px">
    <input type="email" placeholder="your@email.com.au" style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:0.75rem 1rem;color:var(--text);font-family:inherit">
    <button class="btn-brand" onclick="mockSubmit('Newsletter signup')">Sign up</button>
  </div>
  ${bf('\ud83d\udcec', 'Built-in email list = no Klaviyo bill', 'Klaviyo starts at $20/mo and caps free use at 250 contacts. Ours: <strong>unlimited, included</strong>. One new-drop email can move $500+ of stock overnight.')}
</section>

<div id="cart-bar" style="position:fixed;bottom:5.5rem;left:1rem;right:1rem;max-width:500px;margin:0 auto;background:var(--brand);color:#0b0f1a;border-radius:14px;padding:0.75rem 1.25rem;display:none;justify-content:space-between;align-items:center;gap:1rem;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-weight:800;z-index:70" class="hidden">
  <div><span id="cart-count">0 items</span> \u00b7 <span id="cart-total">$0.00</span></div>
  <button class="btn-ghost" style="background:#0b0f1a;color:var(--text);border-color:rgba(255,255,255,0.1)" onclick="mockCheckout()">Mock checkout \u2192</button>
</div>
<style>#cart-bar.hidden { display:none !important; } #cart-bar:not(.hidden) { display:flex !important; }</style>
`;
}

export function tradieDemo(b: any): string {
  const services = [
    { name: 'Safety switch + smoke alarm install', price: 'from $180',    time: '~1 hr' },
    { name: 'Ceiling fan installation',            price: 'from $220',    time: '1\u20132 hr' },
    { name: 'Switchboard upgrade',                 price: 'from $1,400',  time: 'half day' },
    { name: 'New power points (x4)',               price: 'from $320',    time: '2 hr' },
    { name: 'EV charger installation',             price: 'from $950',    time: 'half day' },
    { name: '24/7 emergency call-out',             price: 'from $220',    time: 'ASAP' },
  ];
  return `
<section id="demo" class="panel">
  <div class="kicker">Book a job</div>
  <h2 class="display">Pick what you need</h2>
  <div class="menu-grid">
    ${services.map(s => `
      <div class="menu-item">
        <div class="item-name">${s.name}</div>
        <div class="item-desc">${s.price} \u00b7 ${s.time}</div>
        <div class="item-row">
          <span style="font-size:0.78rem;color:var(--muted)">Avg job time</span>
          <button class="btn-brand" onclick="addToCart('${s.name.replace(/'/g, "\\'")}', 0)">Select</button>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\u26a1', '24/7 booking = revenue while you sleep', 'Customers book <strong>after hours</strong> \u2014 when tradie phones go to voicemail. Real workshops using this see a <strong>~30% rise in first-time bookings</strong> captured at nights/weekends.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Pick a time</div>
  <h2 class="display">Available this week</h2>
  <div>
    ${['Tue 9am','Tue 1pm','Wed 10am','Wed 2pm','Thu 8am','Thu 11am','Fri 9am','Fri 3pm'].map(t => `
      <span class="time-slot" onclick="pickSlot(this)">${t}</span>
    `).join('')}
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.5rem">
    <div class="form-row"><label>Your name</label><input type="text" placeholder="Sarah"></div>
    <div class="form-row"><label>Phone</label><input type="tel" placeholder="0412 345 678"></div>
    <div class="form-row"><label>Address</label><input type="text" placeholder="12 Main St, Rockhampton"></div>
    <div class="form-row"><label>Email</label><input type="email" placeholder="sarah@email.com"></div>
  </div>
  <div class="form-row"><label>Describe the job</label><textarea rows="3" placeholder="New ceiling fan in master bedroom..."></textarea></div>
  <button class="btn-brand" style="width:100%;padding:0.85rem;font-size:1rem" onclick="mockSubmit('Booking')">\ud83d\udd27 Book this slot</button>
  <p style="font-size:0.78rem;color:var(--muted);margin-top:0.5rem">\ud83d\udcf1 Real version: customer gets SMS confirm + day-before reminder. You get SMS the moment a booking lands.</p>
  ${bf('\ud83d\udcbc', 'No-shows cost $250+ of bay time each', 'SMS reminders + optional deposit-on-booking <strong>cut no-shows by ~40%</strong>. Recovering <strong>one no-show per month pays the whole platform 2.5\u00d7 over</strong>.')}
</section>

<section id="reviews" class="panel">
  <div class="kicker">\u2b50 Real reviews</div>
  <h2 class="display">What Rocky locals say</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem"><div style="color:var(--brand);letter-spacing:0.2em">\u2605\u2605\u2605\u2605\u2605</div><p style="margin-top:0.5rem;color:var(--soft)">"Showed up on time, sorted our switchboard in a morning. Quoted, invoiced, all done through the app."</p><div style="font-size:0.78rem;color:var(--muted);margin-top:0.5rem">\u2014 Mark, Berserker</div></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem"><div style="color:var(--brand);letter-spacing:0.2em">\u2605\u2605\u2605\u2605\u2605</div><p style="margin-top:0.5rem;color:var(--soft)">"Booked EV charger install online Sunday night, Mike rang Monday morning. Done by Wednesday."</p><div style="font-size:0.78rem;color:var(--muted);margin-top:0.5rem">\u2014 Lisa, Parkhurst</div></div>
  </div>
  ${bf('\ud83c\udfc6', 'Real reviews compound \u2192 rankings', '<strong>Verified customer reviews</strong> on your own site = Google ranks you higher for "best electrician near me". Every review is a free ad that never expires.')}
</section>

<div id="cart-bar" style="position:fixed;bottom:5.5rem;left:1rem;right:1rem;max-width:500px;margin:0 auto;background:var(--brand);color:#0b0f1a;border-radius:14px;padding:0.75rem 1.25rem;display:none;justify-content:space-between;align-items:center;gap:1rem;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-weight:800;z-index:70" class="hidden">
  <div><span id="cart-count">0 items</span> \u00b7 request quote</div>
  <button class="btn-ghost" style="background:#0b0f1a;color:var(--text);border-color:rgba(255,255,255,0.1)" onclick="mockCheckout()">Get quote \u2192</button>
</div>
<style>#cart-bar.hidden { display:none !important; } #cart-bar:not(.hidden) { display:flex !important; }</style>
`;
}

export function festivalDemo(b: any): string {
  return `
<section id="demo" class="panel">
  <div class="kicker">3 days \u00b7 Gladstone Marina</div>
  <h2 class="display">Fri 8 Jan \u2014 Sun 10 Jan</h2>
  <div class="menu-grid">
    ${[
      { name: 'Early Bird (GA)', desc: '3-day pass \u00b7 no fees', price: 45 },
      { name: 'Weekend Pass',    desc: '3-day pass \u00b7 regular', price: 65 },
      { name: 'Saturday Only',   desc: 'The big headline night', price: 35 },
      { name: 'VIP Pass',        desc: 'Backstage + fast lane', price: 180 },
    ].map(t => `
      <div class="menu-item">
        <div class="item-name">${t.name}</div>
        <div class="item-desc">${t.desc}</div>
        <div class="item-row">
          <span class="item-price">$${t.price}</span>
          <button class="btn-brand" onclick="addToCart('${t.name}', ${t.price})">\ud83c\udf9f Buy</button>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcb0', 'Eventbrite fees eat 3-5% of ticket revenue', 'At $40 \u00d7 500 tickets = <strong>$895 in Eventbrite fees alone</strong>. Our platform costs less than fees on a single event. Your Stripe, your account, your money same-day.')}
</section>

<section id="schedule" class="panel">
  <div class="kicker">\ud83d\udcc5 Schedule</div>
  <h2 class="display">What's on</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
    ${[
      ['MAIN STAGE', [['6pm Fri','Opening ceremony'],['8pm Fri','Headline band'],['10pm Fri','Fireworks']]],
      ['FOOD STAGE', [['12pm Sat','Chef demo'],['3pm Sat','Taste of Gladstone'],['6pm Sat','Iron Grill-off']]],
      ['KIDS ZONE',  [['10am Sat','Face painting'],['12pm Sat','Magic show'],['2pm Sat','Puppet theatre']]],
    ].map(([name, items]) => `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem">
        <div style="font-size:0.68rem;font-weight:800;letter-spacing:0.12em;color:var(--brand);margin-bottom:0.5rem">${name}</div>
        ${(items as string[][]).map(([t, ev]) => `<div style="padding:0.35rem 0;border-bottom:1px dashed rgba(255,255,255,0.05);font-size:0.85rem"><strong>${t}</strong> \u00b7 <span style="color:var(--soft)">${ev}</span></div>`).join('')}
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcf2', 'Push alerts = zero printed programs', 'Weather change? Stage shift? <strong>One push reaches every attendee in 2 seconds</strong>. No more reprinting $500 programs when a band pulls out.')}
</section>

<section id="book" class="panel">
  <div class="kicker">\ud83d\uddfa Vendor map</div>
  <h2 class="display">40+ local makers &amp; food vans</h2>
  <p style="color:var(--soft)">Interactive map with stall pins. Attendees tap \u2192 menu + specials. On-site navigation.</p>
  <div style="margin-top:1rem;height:220px;border-radius:14px;background:linear-gradient(135deg,var(--g1)11,var(--g2)11,var(--g3)11);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:0.92rem">\ud83d\uddfa Interactive vendor map (plots 40+ pins in real use)</div>
  ${bf('\ud83c\udf86', 'Vendors pay to be featured', '<strong>"Featured stall" upgrade for vendors = $50-100 each</strong>. 10 featured vendors = your entire platform cost covered. Data on foot traffic = sponsors pay more next year.')}
</section>

<div id="cart-bar" style="position:fixed;bottom:5.5rem;left:1rem;right:1rem;max-width:500px;margin:0 auto;background:var(--brand);color:#0b0f1a;border-radius:14px;padding:0.75rem 1.25rem;display:none;justify-content:space-between;align-items:center;gap:1rem;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-weight:800;z-index:70" class="hidden">
  <div><span id="cart-count">0 items</span> \u00b7 <span id="cart-total">$0.00</span></div>
  <button class="btn-ghost" style="background:#0b0f1a;color:var(--text);border-color:rgba(255,255,255,0.1)" onclick="mockCheckout()">Mock checkout \u2192</button>
</div>
<style>#cart-bar.hidden { display:none !important; } #cart-bar:not(.hidden) { display:flex !important; }</style>
`;
}

export function deliveryDemo(b: any, p: ProductConfig): string {
  return `
<section id="demo" class="panel">
  <div class="kicker">\ud83d\udccd Live tracking</div>
  <h2 class="display">Where's my driver?</h2>
  <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:1.25rem;margin-bottom:1rem">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem">
      <div><strong>Order #DL-4882</strong> \u00b7 2 \u00d7 parcels</div>
      <span class="status-pill status-open">\u25cf Out for delivery</span>
    </div>
    <div style="height:200px;border-radius:12px;background:linear-gradient(135deg,${p.accent_gradient[0]}22,${p.accent_gradient[1]}22,${p.accent_gradient[2]}22);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:var(--muted);position:relative">
      \ud83d\uddfa Live driver pin \u2014 ETA 12 min
      <div style="position:absolute;top:45%;left:62%;width:20px;height:20px;background:var(--brand);border-radius:50%;box-shadow:0 0 0 6px ${p.cta_color}44;animation:ddot 1.5s infinite"></div>
    </div>
    <style>@keyframes ddot { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.3); opacity:0.6; } }</style>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;text-align:center">
    ${['Accepted','Picked up','Out for delivery','Delivered'].map((s, i) => `
      <div style="padding:0.7rem 0.4rem;border-radius:10px;background:${i <= 2 ? 'var(--brand)' : 'var(--card)'};color:${i <= 2 ? '#0b0f1a' : 'var(--muted)'};font-size:0.75rem;font-weight:700">${i <= 2 ? '\u2713 ' : ''}${s}</div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcde', 'Kill the &ldquo;where&rsquo;s my parcel?&rdquo; call', 'Live tracking eliminates <strong>70-80%</strong> of &ldquo;where is it?&rdquo; calls. That&rsquo;s <strong>~4 hours back</strong> every week, every driver.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Book a pickup</div>
  <h2 class="display">Same-day courier</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
    <div class="form-row"><label>From (pickup)</label><input type="text" placeholder="123 George St, Rockhampton"></div>
    <div class="form-row"><label>To (destination)</label><input type="text" placeholder="45 Park Ave, Yeppoon"></div>
    <div class="form-row"><label>Package size</label><select><option>Satchel (&lt; 500g)</option><option>Box (&lt; 5kg)</option><option>Box (&lt; 20kg)</option><option>Pallet</option></select></div>
    <div class="form-row"><label>When</label><select><option>ASAP (1\u20133 hr)</option><option>Today, before 5pm</option><option>Tomorrow AM</option></select></div>
  </div>
  <button class="btn-brand" style="width:100%;padding:0.85rem;font-size:1rem" onclick="mockSubmit('Pickup request')">\ud83d\ude9a Schedule pickup</button>
  ${bf('\ud83d\udcb5', 'No DoorDash / Uber 30% cut', 'On $20k/mo delivery revenue <strong>that&rsquo;s $6,000/mo you keep</strong>. Platform pays itself 47\u00d7 over. Your drivers, your customers, your margins.')}
</section>

<section id="drivers" class="panel">
  <div class="kicker">Route today</div>
  <h2 class="display">Driver dashboard (your team view)</h2>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    ${[
      [1, 'Mia, 12 George St', '9:15 am', '\u2713 Done'],
      [2, 'Joe, 88 Bolsover', '9:40 am', '\u2713 Done'],
      [3, 'Sarah, 14 Denham', '10:20 am', '\u25b8 Next'],
      [4, 'Mark, 9 Musgrave', '11:00 am', 'Pending'],
    ].map(([n, name, time, status]) => `
      <div style="display:flex;justify-content:space-between;align-items:center;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:0.75rem 1rem">
        <div style="display:flex;align-items:center;gap:0.75rem"><div style="width:28px;height:28px;border-radius:50%;background:var(--brand);color:#0b0f1a;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.85rem">${n}</div><div><strong>${name}</strong><div style="font-size:0.75rem;color:var(--muted)">ETA ${time}</div></div></div>
        <span style="font-size:0.78rem;color:${status === '\u2713 Done' ? '#34d399' : status === '\u25b8 Next' ? 'var(--brand)' : 'var(--muted)'}">${status}</span>
      </div>
    `).join('')}
  </div>
  ${bf('\u23f1', 'Auto-routed = more drops per driver', 'Route optimiser = <strong>20-30% more drops per shift</strong> with zero extra work. One extra drop/day \u00d7 5 drivers = <strong>~100 more deliveries/month</strong>.')}
</section>`;
}

export function aiSocialDemo(b: any): string {
  return `
<section id="demo" class="panel">
  <div class="kicker">Community feed</div>
  <h2 class="display">Latest from Rotary Mates</h2>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    ${[
      { author: 'Dave (admin)', time: '2h', body: 'Ran the RX-8 at QR today. New PB on turn 3 after the LSD swap. Dyno sheet dropping tonight \ud83c\udfc1', likes: 47 },
      { author: 'Shannon', time: '5h', body: 'FS: 13B bridgeport, fully rebuilt, 4k km. Pick up Mackay. DMs open for serious buyers.', likes: 12 },
      { author: 'Tim', time: '1d', body: 'Anyone else had the stock apex seal issue on a port? Looking at Mazdatrix 3mm. Thoughts?', likes: 8 },
    ].map(pp => `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.1rem 1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem"><strong>${pp.author}</strong><span style="font-size:0.72rem;color:var(--muted)">${pp.time} ago</span></div>
        <div style="color:var(--soft);font-size:0.92rem;margin-bottom:0.6rem">${pp.body}</div>
        <div style="display:flex;gap:0.6rem"><button class="btn-ghost" onclick="mockSubmit('Liked')">\u2764\ufe0f ${pp.likes}</button><button class="btn-ghost" onclick="mockSubmit('Comment')">\ud83d\udcac Reply</button></div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcc8', 'Facebook reach is dead \u2014 5-10% on a good day', 'On your own community, <strong>100% of members see every post</strong>. No algorithm, no shadow-ban, no "boost this for $10" prompts. Every post reaches everyone.')}
  <p style="margin-top:1rem;font-size:0.82rem;color:var(--muted);font-style:italic">Works for verticals beyond enthusiast clubs too &mdash; <strong>Jonesy\'s Garage</strong> in Rocky uses this exact platform to run their socials, post weekly specials, and keep regular customers in the loop without paying Meta to be seen.</p>
</section>

<section id="book" class="panel">
  <div class="kicker">Join up</div>
  <h2 class="display">Become a Mate</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
    ${[
      { tier: 'Free', price: 'Free', f: ['Read the feed','Weekly digest','Public events'] },
      { tier: 'Garage ($12/mo)', price: '$12/mo', f: ['All free perks','Post in the feed','Private channels','Discount codes'], popular: true },
      { tier: 'Lifetime', price: '$240 once', f: ['All Garage perks','Custom badge','Founders room'] },
    ].map(t => `
      <div style="background:var(--card);border:1px solid ${t.popular ? 'var(--brand)' : 'var(--border)'};border-radius:14px;padding:1.5rem">
        <div style="font-size:0.7rem;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase">${t.tier}</div>
        <div style="font-size:1.75rem;font-weight:900;color:var(--brand);margin:0.4rem 0">${t.price}</div>
        <ul style="list-style:none;font-size:0.85rem;color:var(--soft);margin-bottom:1rem">${t.f.map(x => `<li style="padding:0.25rem 0 0.25rem 1.2rem;position:relative"><span style="position:absolute;left:0;color:#34d399">\u2713</span>${x}</li>`).join('')}</ul>
        <button class="btn-brand" style="width:100%;padding:0.7rem" onclick="mockSubmit('${t.tier}')">Join</button>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcb3', 'Patreon takes 8-12%. We take 0.', '<strong>100 members \u00d7 $12/mo = $1,200/mo</strong>. Patreon takes ~$120. Ours \u2014 Stripe fee only. You keep $1,150. Monthly platform cost covers itself by member 9.')}
</section>

<section id="moderation" class="panel">
  <div class="kicker">\ud83e\udd16 AI moderation</div>
  <h2 class="display">Spam? Gone before you see it</h2>
  <p style="color:var(--soft)">Every post scored for spam, abuse, and off-topic in milliseconds. Your community stays tidy while you sleep.</p>
  <div style="margin-top:1rem;display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;text-align:center">
    <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem"><div style="font-size:1.5rem;font-weight:900;color:#34d399">94%</div><div style="font-size:0.72rem;color:var(--muted)">Auto-cleared</div></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem"><div style="font-size:1.5rem;font-weight:900;color:var(--brand)">4%</div><div style="font-size:0.72rem;color:var(--muted)">Review queue</div></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem"><div style="font-size:1.5rem;font-weight:900;color:#f87171">2%</div><div style="font-size:0.72rem;color:var(--muted)">Auto-removed</div></div>
  </div>
  ${bf('\u23f0', 'Save 4-5 hours of moderation weekly', 'AI handles 94%. <strong>You check a review queue for 15 min/day</strong> instead of manually deleting spam. That&rsquo;s your evenings back.')}
</section>`;
}

export function carHireDemo(b: any): string {
  const fleet = [
    { name: 'Toyota Hilux SR5 4\u00d74',  desc: 'Auto \u00b7 Diesel \u00b7 5 seats \u00b7 Tow pkg \u00b7 Bay 3', price: 129, emoji: '\ud83d\udefb' },
    { name: 'Mazda CX-5 Touring',    desc: 'Auto \u00b7 Petrol \u00b7 5 seats \u00b7 Roof racks',     price: 99,  emoji: '\ud83d\ude99' },
    { name: 'Hyundai i30 Hatch',     desc: 'Auto \u00b7 Petrol \u00b7 5 seats \u00b7 Cheap on fuel',  price: 69,  emoji: '\ud83d\ude97' },
    { name: 'Toyota HiAce Van',      desc: 'Auto \u00b7 Diesel \u00b7 3 seats \u00b7 Cargo',           price: 119, emoji: '\ud83d\ude90' },
    { name: 'Subaru Outback AWD',    desc: 'Auto \u00b7 Petrol \u00b7 5 seats \u00b7 Camp-ready',      price: 109, emoji: '\ud83d\ude99' },
    { name: 'LDV T60 Dual-Cab',      desc: 'Manual \u00b7 Diesel \u00b7 5 seats \u00b7 Tow + tray',    price: 119, emoji: '\ud83d\udefb' },
  ];
  return `
<section id="demo" class="panel">
  <div class="kicker">Available now</div>
  <h2 class="display">Pick your vehicle for next weekend</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;margin-bottom:1rem">
    <div class="form-row"><label>Pickup date</label><input type="date" value="2026-05-04"></div>
    <div class="form-row"><label>Return date</label><input type="date" value="2026-05-11"></div>
    <div class="form-row"><label>Vehicle type</label><select><option>Any</option><option>SUV / 4\u00d74</option><option>Sedan / Hatch</option><option>Van / Ute</option></select></div>
    <div style="display:flex;align-items:flex-end"><button class="btn-brand" style="width:100%;padding:0.7rem" onclick="mockSubmit('Search fleet')">\ud83d\udd0d Search</button></div>
  </div>
  <div class="menu-grid">
    ${fleet.map(v => `
      <div class="menu-item">
        <div style="font-size:2.2rem;margin-bottom:0.3rem">${v.emoji}</div>
        <div class="item-name">${v.name}</div>
        <div class="item-desc">${v.desc}</div>
        <div class="item-row">
          <span class="item-price">$${v.price}/day</span>
          <button class="btn-brand" onclick="addToCart('${v.name.replace(/'/g, "\\'")}', ${v.price})">Reserve \u2192</button>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udfe2', 'No counter queues. No franchise tax.', '<strong>Lockbox + SMS pickup</strong> = customer skips the desk and walks straight to the keys. <strong>$0 in counter staff overtime</strong> on Saturday mornings, <strong>+$50\u201370/day kept per booking</strong> vs Turo\'s 25\u201335% skim.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Reserve in 2 minutes</div>
  <h2 class="display">Book the Hilux SR5 \u00b7 7 days</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
    <div class="form-row"><label>Your name</label><input type="text" placeholder="Sarah Mitchell"></div>
    <div class="form-row"><label>Phone</label><input type="tel" placeholder="0412 345 678"></div>
    <div class="form-row"><label>Email</label><input type="email" placeholder="sarah@email.com.au"></div>
    <div class="form-row"><label>Licence number</label><input type="text" placeholder="QLD \u00b7 upload photo on next step"></div>
  </div>
  <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem;margin-top:0.75rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div><div style="font-size:0.65rem;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase">Daily rate \u00d7 7</div><div style="font-size:1.1rem;font-weight:800;margin-top:0.25rem">$903.00</div></div>
      <div><div style="font-size:0.65rem;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase">Bond (pre-auth)</div><div style="font-size:1.1rem;font-weight:800;margin-top:0.25rem">$500.00</div></div>
    </div>
    <div style="font-size:0.78rem;color:var(--muted);margin-top:0.6rem">Bond is held by Stripe and released the day you return the vehicle clean and full of fuel.</div>
  </div>
  <button class="btn-brand" style="width:100%;padding:0.85rem;font-size:1rem;margin-top:0.75rem" onclick="mockSubmit('Reservation + Stripe')">\ud83d\ude97 Reserve \u00b7 Stripe pre-auth</button>
  ${bf('\ud83d\udee1', 'Bond drama drops hard', 'Photo damage notes + Stripe pre-auth = no he-said-she-said when they bring the ute back with a scratch. <strong>~90% fewer disputes</strong>, the bond either releases automatically or tops up cleanly with paperwork.')}
</section>

<section id="locations" class="panel">
  <div class="kicker">\ud83d\udccd Locations</div>
  <h2 class="display">Yeppoon yard \u00b7 Rocky pickup on request</h2>
  <p style="color:var(--soft);margin-bottom:0.5rem">Main yard: <strong>14 James Street, Yeppoon QLD 4703</strong>. Lockbox pickup 24/7. Rockhampton airport hand-off Saturday mornings on request.</p>
  <p style="font-size:0.85rem;color:var(--muted)">\ud83d\udcde ${esc(b.phone)} \u00b7 Real version: lockbox code SMS-fired the morning of pickup. Fleet calendar updates with blackouts in real time.</p>
  ${bf('\ud83d\udcc5', 'Fleet calendar = no double-booking', 'Every vehicle on a Gantt timeline \u2014 bookings, services, blackouts crossed out. <strong>Drag to reassign</strong> when a customer extends, see utilisation per car at a glance. <strong>~9 hours of admin saved every week</strong>.')}
</section>

<div id="cart-bar" style="position:fixed;bottom:5.5rem;left:1rem;right:1rem;max-width:500px;margin:0 auto;background:var(--brand);color:#0b0f1a;border-radius:14px;padding:0.75rem 1.25rem;display:none;justify-content:space-between;align-items:center;gap:1rem;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-weight:800;z-index:70" class="hidden">
  <div><span id="cart-count">0 items</span> \u00b7 <span id="cart-total">$0.00</span> /day</div>
  <button class="btn-ghost" style="background:#0b0f1a;color:var(--text);border-color:rgba(255,255,255,0.1)" onclick="mockCheckout()">Continue to booking \u2192</button>
</div>
<style>#cart-bar.hidden { display:none !important; } #cart-bar:not(.hidden) { display:flex !important; }</style>
`;
}

export function butchersDemo(b: any): string {
  const cuts = [
    { name: 'Eye Fillet (custom-cut)',  desc: 'Type your weight \u00b7 trimmed at the block \u00b7 Stripe top-up at weigh', price: '$60/kg', emoji: '\ud83e\udd69', custom: true },
    { name: 'Family Freezer Pack',      desc: '2kg mince \u00b7 1kg sausages \u00b7 6 ribeyes \u00b7 1kg lamb cutlets \u00b7 ready Friday', price: '$150 flat', emoji: '\ud83d\udce6' },
    { name: 'Quarter Beast Pack',       desc: 'Roughly 60kg of mixed beef \u00b7 5 weeks freezer \u00b7 ready in 2 weeks',     price: '$1,250',    emoji: '\ud83d\udc02' },
    { name: 'Pork Shoulder (boneless)', desc: 'Score-ready \u00b7 ~2kg average \u00b7 for crackle', price: '$18.90/kg', emoji: '\ud83d\udc16' },
    { name: 'Sirloin Steaks (3-pack)',  desc: 'Aged 21 days \u00b7 ~280g each \u00b7 house seasoning', price: '$36.00', emoji: '\ud83e\udd69' },
    { name: 'Smoky Beef Sausages (1kg)',desc: 'Made in-house \u00b7 9 sausages \u00b7 pork-free option', price: '$22.00', emoji: '\ud83c\udf2d' },
  ];
  return `
<section id="demo" class="panel">
  <div class="kicker">Order online \u00b7 pickup Friday</div>
  <h2 class="display">This week at the block</h2>
  <div class="menu-grid">
    ${cuts.map(c => `
      <div class="menu-item" style="${c.custom ? 'border-color:#dc2626;background:rgba(220,38,38,0.05)' : ''}">
        <div style="font-size:2.2rem;margin-bottom:0.3rem">${c.emoji}</div>
        <div class="item-name">${c.name}${c.custom ? ' <span style="background:#dc2626;color:#fff;padding:0.1rem 0.4rem;border-radius:999px;font-size:0.6rem;font-weight:700;margin-left:0.3rem">CUSTOM</span>' : ''}</div>
        <div class="item-desc">${c.desc}</div>
        <div class="item-row">
          <span class="item-price">${c.price}</span>
          <button class="btn-brand" onclick="addToCart('${c.name.replace(/'/g, "\\'")}', 0)">${c.custom ? 'Custom +' : '+ Add'}</button>
        </div>
      </div>
    `).join('')}
  </div>
  ${bf('\ud83d\udcb8', 'Custom-weight without phone tag', '<strong>Customers type their target weight</strong> ("~1.4kg, fully trimmed"); you weigh it Friday morning, Stripe captures the actual amount. <strong>Sunday-night phone calls go to zero</strong>, the missus stops getting the dinner-time interruptions.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Custom cut request</div>
  <h2 class="display">Tell us exactly what you want</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
    <div class="form-row"><label>Your name</label><input type="text" placeholder="Sarah"></div>
    <div class="form-row"><label>Phone</label><input type="tel" placeholder="0412 345 678"></div>
    <div class="form-row"><label>Cut</label><select><option>Eye Fillet</option><option>Ribeye</option><option>Sirloin</option><option>Lamb Backstrap</option><option>Pork Belly</option></select></div>
    <div class="form-row"><label>Target weight</label><input type="text" placeholder="~1.4kg, fully trimmed"></div>
    <div class="form-row"><label>Pickup day</label><select><option>Friday morning</option><option>Friday afternoon</option><option>Saturday morning</option></select></div>
    <div class="form-row"><label>Special notes</label><input type="text" placeholder="Score the fat for crackle, please"></div>
  </div>
  <button class="btn-brand" style="width:100%;padding:0.85rem;font-size:1rem;margin-top:0.5rem" onclick="mockSubmit('Custom cut \u00b7 pre-auth')">\ud83d\udccb Submit \u00b7 Stripe pre-auth $80</button>
  <p style="font-size:0.78rem;color:var(--muted);margin-top:0.5rem">Real version: pre-auth held until weigh-in Friday morning, then captured at actual weight \u00d7 $/kg. Texts you when it\'s bagged in the cool room.</p>
  ${bf('\u2744\ufe0f', 'Freezer packs = anchor revenue', 'A <strong>$150 freezer pack is 4\u00d7 the spend of a walk-in</strong>. Online makes them a one-tap repeat order \u2014 most shops underprice these badly. <strong>One pack a day = $4,500 extra/month</strong>, kept off the phone tag.')}
</section>

<section id="specials" class="panel">
  <div class="kicker">\ud83c\udff7 This week\'s specials</div>
  <h2 class="display">Posted Tuesday lunch</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem"><div style="font-size:0.7rem;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase">SPECIAL \u00b7 35% off</div><div style="font-size:1.1rem;font-weight:800;margin-top:0.4rem">Lamb Cutlets</div><p style="color:var(--soft);font-size:0.85rem;margin-top:0.3rem">Was $42/kg, now $27/kg until Sunday</p></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem"><div style="font-size:0.7rem;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase">FROM THE BLOCK</div><div style="font-size:1.1rem;font-weight:800;margin-top:0.4rem">Wagyu Brisket</div><p style="color:var(--soft);font-size:0.85rem;margin-top:0.3rem">Marble score 6+ \u00b7 Hold for Saturday smoking</p></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem"><div style="font-size:0.7rem;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase">LOYALTY \u00b7 KG 8/10</div><div style="font-size:1.1rem;font-weight:800;margin-top:0.4rem">Half-price kg coming up</div><p style="color:var(--soft);font-size:0.85rem;margin-top:0.3rem">Buy 2 more kg of mince, the next 1kg is half price.</p></div>
  </div>
  ${bf('\ud83d\udcca', 'Auto-stocktake = no mid-week panic', '<strong>Every sale decrements stock</strong>, tomorrow\'s mince forecast based on last 4 weeks. Reorder alerts at 8kg ribeye. Your Sunday-night manual count goes <strong>2.5 hrs \u2192 0</strong>.')}
</section>

<div id="cart-bar" style="position:fixed;bottom:5.5rem;left:1rem;right:1rem;max-width:500px;margin:0 auto;background:var(--brand);color:#0b0f1a;border-radius:14px;padding:0.75rem 1.25rem;display:none;justify-content:space-between;align-items:center;gap:1rem;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-weight:800;z-index:70" class="hidden">
  <div><span id="cart-count">0 items</span> \u00b7 pickup Friday</div>
  <button class="btn-ghost" style="background:#0b0f1a;color:var(--text);border-color:rgba(255,255,255,0.1)" onclick="mockCheckout()">Continue \u2192</button>
</div>
<style>#cart-bar.hidden { display:none !important; } #cart-bar:not(.hidden) { display:flex !important; }</style>
`;
}

export function sportsClubDemo(b: any): string {
  return `
<section id="demo" class="panel">
  <div class="kicker">Round 7 \u00b7 Saturday 5 May</div>
  <h2 class="display">Today\'s fixtures</h2>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    ${[
      { team: 'U7 Sharks',   vs: 'Yeppoon Bandits',  time: '8:00am',  ground: 'Showgrounds Field 1', state: 'finished', score: '20\u20134' },
      { team: 'U8 Storm',    vs: 'Rocky Capras',     time: '8:30am',  ground: 'Showgrounds Field 2', state: 'finished', score: '14\u201314' },
      { team: 'U10 Sharks',  vs: 'Mackay Eagles',    time: '9:00am',  ground: 'Showgrounds Field 2', state: 'live',     score: '12\u20134 (HT)' },
      { team: 'U12 Storm',   vs: 'Bundy Roos',       time: '10:30am', ground: 'Hartwig Field',       state: 'upcoming', score: 'in 90 min' },
      { team: 'U14 Sharks',  vs: 'Mackay Bulls',     time: '12:00pm', ground: 'Showgrounds Field 1', state: 'upcoming', score: '\u2014' },
      { team: 'U16 Storm',   vs: 'Gladstone Tigers', time: '2:00pm',  ground: 'Hartwig Field',       state: 'upcoming', score: '\u2014' },
    ].map(f => {
      const colours = f.state === 'finished' ? '#34d399' : f.state === 'live' ? '#f59e0b' : 'var(--muted)';
      const tag = f.state === 'finished' ? 'FT' : f.state === 'live' ? '\u23f0 LIVE' : f.time;
      return `
      <div style="display:flex;justify-content:space-between;align-items:center;background:var(--card);border:1px solid ${f.state === 'live' ? '#f59e0b' : 'var(--border)'};border-radius:10px;padding:0.85rem 1rem">
        <div style="display:flex;align-items:center;gap:0.75rem"><div style="font-weight:800;font-size:1rem">${f.team}</div><div style="color:var(--soft);font-size:0.85rem">vs ${f.vs}</div></div>
        <div style="text-align:right">
          <div style="color:${colours};font-weight:700;font-size:0.78rem">${tag}</div>
          <div style="font-size:0.95rem;font-weight:800;margin-top:0.15rem">${f.score}</div>
          <div style="font-size:0.7rem;color:var(--muted);margin-top:0.1rem">${f.ground}</div>
        </div>
      </div>
    `;}).join('')}
  </div>
  ${bf('\u23f0', 'Auto-reminder kills the late arrivals', 'Push fires <strong>90 min before kick-off</strong> with field, time, jersey side. <strong>Late arrivals 12 \u2192 0</strong> across a Saturday round. Karen runs the canteen instead of the phone.')}
</section>

<section id="book" class="panel">
  <div class="kicker">Register a player</div>
  <h2 class="display">2026 season \u00b7 all grades</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
    <div class="form-row"><label>Player name</label><input type="text" placeholder="Jack Wilson"></div>
    <div class="form-row"><label>DOB</label><input type="date"></div>
    <div class="form-row"><label>Grade</label><select><option>U7</option><option>U8</option><option>U10 (returning)</option><option>U12</option><option>U14</option><option>U16</option></select></div>
    <div class="form-row"><label>Parent name</label><input type="text" placeholder="Sarah Wilson"></div>
    <div class="form-row"><label>Parent mobile</label><input type="tel" placeholder="0412 345 678"></div>
    <div class="form-row"><label>Medical / allergies</label><input type="text" placeholder="Asthma \u00b7 ventolin in bag"></div>
  </div>
  <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem;margin-top:0.75rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div><div style="font-size:0.65rem;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase">Rego fee</div><div style="font-size:1.2rem;font-weight:800;margin-top:0.25rem">$285</div></div>
      <div><div style="font-size:0.65rem;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase">Family discount (2nd kid)</div><div style="font-size:1.2rem;font-weight:800;margin-top:0.25rem;color:#10b981">\u2212$60</div></div>
    </div>
    <div style="font-size:0.78rem;color:var(--muted);margin-top:0.6rem">Pay in 3 fortnightly instalments by direct debit, or upfront for a $20 discount.</div>
  </div>
  <button class="btn-brand" style="width:100%;padding:0.85rem;font-size:1rem;margin-top:0.75rem" onclick="mockSubmit('Register \u00b7 Stripe')">\ud83c\udfc9 Register Jack \u00b7 Stripe</button>
  ${bf('\ud83d\udcb3', 'Rego doesn\'t get skimmed', 'GameDay\'s service fees + Stripe combo eat 6\u20138% of rego \u2014 on a $40k club <strong>that\'s $3k/year gone</strong>. Direct Stripe through the app: <strong>1.75% only</strong>, you keep the rest.')}
</section>

<section id="news" class="panel">
  <div class="kicker">\ud83d\udcf0 News \u00b7 this week</div>
  <h2 class="display">From the committee</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem"><div style="font-size:0.7rem;color:#10b981;letter-spacing:0.08em;font-weight:800;text-transform:uppercase">\ud83d\udccc PINNED</div><div style="font-size:1.05rem;font-weight:800;margin-top:0.4rem">Presentation Night \u00b7 Sat 23 Nov</div><p style="color:var(--soft);font-size:0.85rem;margin-top:0.3rem">Showgrounds hall \u00b7 6pm dinner \u00b7 trophies + life member induction. RSVP via app.</p></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem"><div style="font-size:0.7rem;color:#1e40af;letter-spacing:0.08em;font-weight:800;text-transform:uppercase">SPONSOR \u00b7 YEPPOON CHEMIST</div><div style="font-size:1.05rem;font-weight:800;margin-top:0.4rem">10% off any first-aid order</div><p style="color:var(--soft);font-size:0.85rem;margin-top:0.3rem">Show your YJRL profile in store \u00b7 340 in-app clicks already this season.</p></div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem"><div style="font-size:0.7rem;color:#f59e0b;letter-spacing:0.08em;font-weight:800;text-transform:uppercase">\ud83c\udfc6 PLAYER OF THE WEEK</div><div style="font-size:1.05rem;font-weight:800;margin-top:0.4rem">Jack W \u00b7 U10 Sharks</div><p style="color:var(--soft);font-size:0.85rem;margin-top:0.3rem">Hat-trick + 2 try-savers. Achievement badge auto-pushed to his profile.</p></div>
  </div>
  ${bf('\ud83d\udcac', 'One app replaces four chats', 'Right now: Facebook for news + WhatsApp per team + GameDay for rego + email for fees. <strong>One push, one ledger, one inbox</strong> \u2014 parents stop missing things, secretary saves <strong>~12 hrs/week</strong>.')}
</section>`;
}
