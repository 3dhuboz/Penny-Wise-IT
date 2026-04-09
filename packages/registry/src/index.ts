import { Hono } from 'hono';
import { cors } from 'hono/cors';

// ============ EMBEDDED FEATURE MANIFESTS ============
// These are inlined at build time. Update when new features are added.

const FEATURES = [
  {
    id: 'auth-bearer',
    name: 'Bearer Token Authentication',
    version: '1.0.0',
    category: 'foundation',
    description: 'Custom JWT-based Bearer authentication with email/password. No third-party auth provider. PBKDF2 password hashing, HMAC-SHA256 JWTs, refresh token rotation, role-based access (user/staff/admin).',
    conflicts: ['auth-clerk'],
    requires: {
      secrets: ['JWT_SECRET'],
      env: ['JWT_ACCESS_EXPIRY', 'JWT_REFRESH_EXPIRY'],
      tables: ['users', 'refresh_tokens'],
    },
    provides: {
      routes: 9,
      middleware: ['requireAuth', 'optionalAuth', 'requireAdmin', 'requireRole'],
      crons: ['0 3 * * * — cleanup expired tokens'],
      webhooks: [],
    },
    tags: ['auth', 'jwt', 'self-hosted'],
    use_when: 'You do not want Clerk. Best for apps with custom roles like staff/admin/driver.',
  },
  {
    id: 'auth-clerk',
    name: 'Clerk Authentication',
    version: '1.0.0',
    category: 'foundation',
    description: 'Managed authentication via Clerk. Handles sign-up, sign-in, session management, and webhooks that sync user data to D1.',
    conflicts: ['auth-bearer'],
    requires: {
      secrets: ['CLERK_SECRET_KEY', 'CLERK_WEBHOOK_SECRET'],
      env: [],
      tables: ['users'],
    },
    provides: {
      routes: 1,
      middleware: ['requireAuth', 'optionalAuth'],
      crons: [],
      webhooks: ['POST /webhooks/clerk — syncs user to D1 on create/update/delete'],
    },
    tags: ['auth', 'clerk', 'managed'],
    use_when: 'You want managed auth with social login, MFA, and a hosted user dashboard.',
  },
  {
    id: 'email-resend',
    name: 'Email via Resend',
    version: '1.0.0',
    category: 'foundation',
    description: 'Transactional and notification email via Resend. Provides a shared sendEmail() helper, a branded HTML email template, and an email send log.',
    conflicts: [],
    requires: {
      secrets: ['RESEND_API_KEY'],
      env: ['EMAIL_FROM', 'EMAIL_REPLY_TO'],
      tables: ['email_log'],
    },
    provides: {
      routes: 2,
      middleware: [],
      crons: [],
      webhooks: [],
    },
    tags: ['email', 'resend', 'transactional'],
    use_when: 'Any app that sends emails — order confirmations, invoices, licence keys, activation links.',
  },
  {
    id: 'payments-stripe',
    name: 'Stripe Payments',
    version: '1.0.0',
    category: 'foundation',
    description: 'Payment processing via Stripe. Supports one-time charges, subscriptions, Checkout sessions, and full webhook handling for lifecycle events.',
    conflicts: [],
    requires: {
      secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
      env: ['STRIPE_PUBLISHABLE_KEY'],
      tables: ['payments', 'subscriptions'],
    },
    provides: {
      routes: 6,
      middleware: [],
      crons: [],
      webhooks: ['POST /webhooks/stripe — checkout.session.completed, invoice.paid, subscription events'],
    },
    tags: ['payments', 'stripe', 'subscriptions'],
    use_when: 'Australian-based SaaS or e-commerce with recurring billing or one-off purchases.',
  },
  {
    id: 'payments-paypal',
    name: 'PayPal Payments',
    version: '1.0.0',
    category: 'foundation',
    description: 'Payment processing via PayPal. Supports orders, subscriptions, and webhook events.',
    conflicts: [],
    requires: {
      secrets: ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET'],
      env: [],
      tables: ['payments', 'subscriptions'],
    },
    provides: {
      routes: 5,
      middleware: [],
      crons: [],
      webhooks: ['POST /webhooks/paypal — PAYMENT.CAPTURE.COMPLETED, BILLING events'],
    },
    tags: ['payments', 'paypal', 'subscriptions'],
    use_when: 'Customers that prefer PayPal. Also good for AU businesses with high PayPal adoption.',
  },
  {
    id: 'payments-square',
    name: 'Square Payments',
    version: '1.0.0',
    category: 'foundation',
    description: 'Payment processing via Square. One-time charges, payment links, and webhook handling.',
    conflicts: [],
    requires: {
      secrets: ['SQUARE_ACCESS_TOKEN', 'SQUARE_WEBHOOK_SIGNATURE_KEY'],
      env: ['SQUARE_LOCATION_ID', 'SQUARE_ENVIRONMENT'],
      tables: ['payments'],
    },
    provides: {
      routes: 4,
      middleware: [],
      crons: [],
      webhooks: ['POST /webhooks/square — payment.completed'],
    },
    tags: ['payments', 'square', 'in-person'],
    use_when: 'Food trucks or retail that already use Square hardware.',
  },
  {
    id: 'sms-twilio',
    name: 'SMS via Twilio',
    version: '1.0.0',
    category: 'foundation',
    description: 'SMS messaging via Twilio. Provides a shared sendSms() helper, delivery tracking, and SMS log. Used for order notifications, dispatch alerts, and broadcast messages.',
    conflicts: [],
    requires: {
      secrets: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'],
      env: ['TWILIO_FROM_NUMBER', 'OWNER_PHONE'],
      tables: ['sms_log'],
    },
    provides: {
      routes: 3,
      middleware: [],
      crons: [],
      webhooks: [],
    },
    tags: ['sms', 'twilio', 'notifications'],
    use_when: 'Dispatch workflows, food truck orders, or any time instant customer contact matters.',
  },
  {
    id: 'ai-openrouter',
    name: 'AI via OpenRouter',
    version: '1.0.0',
    category: 'foundation',
    description: 'AI completions via OpenRouter. Chat, text generation, and streaming. Access to Claude, GPT-4o, Llama, Mistral and more via a single API. Logs usage per user.',
    conflicts: [],
    requires: {
      secrets: ['OPENROUTER_API_KEY'],
      env: ['OPENROUTER_DEFAULT_MODEL', 'OPENROUTER_SITE_URL', 'OPENROUTER_APP_NAME'],
      tables: ['ai_log'],
    },
    provides: {
      routes: 5,
      middleware: [],
      crons: [],
      webhooks: [],
    },
    tags: ['ai', 'openrouter', 'llm', 'claude'],
    use_when: 'Post generation (SocialAI), content assistance, AI-powered classification or summaries.',
  },
] as const;

type Feature = (typeof FEATURES)[number];

// ============ TEMPLATES CATALOG ============

const TEMPLATES = [
  {
    id: 'food-truck',
    name: 'Food Truck',
    description: 'Online ordering, menu management, loyalty raffle, SMS notifications, schedule, and alerts.',
    tables: ['menu_items', 'orders', 'order_items', 'schedule', 'alerts', 'loyalty_cards', 'raffle_entries'],
    recommended_features: ['auth-bearer', 'payments-stripe', 'email-resend', 'sms-twilio'],
    examples: ['Street Meatz BBQ', 'Hugheseys Que'],
  },
  {
    id: 'festival',
    name: 'Festival / Event',
    description: 'Event listings, ticketing with QR codes, raffle draw, vendor directory, POI map, schedule, and alerts.',
    tables: ['events', 'tickets', 'vendors', 'pois', 'raffle_entries', 'schedule', 'alerts'],
    recommended_features: ['auth-clerk', 'payments-stripe', 'email-resend', 'sms-twilio'],
    examples: ['Gladstone BBQ Festival'],
  },
  {
    id: 'simple-website',
    name: 'Simple Website / E-commerce',
    description: 'Product catalogue, shopping cart, orders, contact form messages, and CMS posts.',
    tables: ['products', 'orders', 'order_items', 'messages', 'posts'],
    recommended_features: ['auth-clerk', 'payments-stripe', 'email-resend'],
    examples: ['Pickle Nick'],
  },
  {
    id: 'wirez',
    name: 'Trade / Field Service',
    description: 'Customer CRM, job management (quote→scheduled→in-progress→completed→invoiced), time tracking, materials, GST invoices with auto-increment numbering, staff management.',
    tables: ['customers', 'jobs', 'job_time_entries', 'job_materials', 'job_notes', 'invoices', 'invoice_items', 'staff'],
    recommended_features: ['auth-bearer', 'email-resend', 'sms-twilio'],
    examples: ['Wirez Electrical'],
  },
  {
    id: 'oconnor',
    name: 'Delivery / Agriculture',
    description: 'Customer management, product catalogue, orders, delivery run planning, stop-by-stop tracking with signature capture, driver GPS, recurring subscriptions.',
    tables: ['customers', 'products', 'orders', 'delivery_runs', 'delivery_stops', 'subscriptions', 'driver_locations'],
    recommended_features: ['auth-bearer', 'payments-stripe', 'email-resend'],
    examples: ["O'Connor Agriculture"],
  },
  {
    id: 'autohue',
    name: 'Desktop App Licensing',
    description: 'License key generation (XXXX-XXXX-XXXX-XXXX format), per-machine activation tracking, admin revocation, R2-gated release downloads, changelog.',
    tables: ['products', 'licenses', 'activations', 'releases', 'download_log'],
    recommended_features: ['auth-bearer', 'payments-stripe', 'payments-paypal', 'email-resend'],
    examples: ['AutoHue'],
  },
  {
    id: 'aussie-saver',
    name: 'Fuel / Utility Comparison',
    description: 'Crowdsourced fuel price reporting, station search by suburb/brand, price comparison, vehicle tracking, fill-up log with cost analytics.',
    tables: ['fuel_stations', 'fuel_prices', 'vehicles', 'fill_ups', 'app_settings'],
    recommended_features: ['auth-bearer', 'email-resend'],
    examples: ['Aussie Saver'],
  },
  {
    id: 'socialai',
    name: 'AI Social Media Management',
    description: 'White-label social media agency platform. Client management, AI-generated post drafts, client approval portal (token-based, no login required), post scheduling, activation/cancellation flows.',
    tables: ['clients', 'posts', 'portal', 'pending_activations', 'pending_cancellations'],
    recommended_features: ['auth-bearer', 'payments-paypal', 'email-resend', 'ai-openrouter'],
    examples: ['SocialAI Studio'],
  },
] as const;

// ============ HTML UI ============

function renderHtml(env: { REGISTRY_TITLE?: string }): string {
  const title = env.REGISTRY_TITLE || 'PennyWiseIT Feature Registry';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      --bg: #0f172a; --surface: #1e293b; --border: #334155;
      --text: #f1f5f9; --muted: #94a3b8; --accent: #6366f1;
      --green: #22c55e; --yellow: #eab308; --red: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; }
    header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem; }
    header h1 { font-size: 1.25rem; font-weight: 700; }
    header span { color: var(--muted); font-size: 0.875rem; }
    nav { display: flex; gap: 0.5rem; margin-left: auto; }
    nav button { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 0.375rem 0.875rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem; transition: all 0.15s; }
    nav button.active, nav button:hover { background: var(--accent); border-color: var(--accent); color: #fff; }
    main { max-width: 1280px; margin: 0 auto; padding: 2rem; }
    h2 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1.25rem; color: var(--text); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.25rem; transition: border-color 0.15s; cursor: pointer; }
    .card:hover { border-color: var(--accent); }
    .card-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; }
    .card-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
    .card-title { font-weight: 600; font-size: 0.95rem; }
    .card-sub { color: var(--muted); font-size: 0.8rem; margin-top: 0.1rem; }
    .card-desc { color: var(--muted); font-size: 0.825rem; margin-bottom: 0.875rem; line-height: 1.5; }
    .tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }
    .tag { background: #1e2d40; color: #7dd3fc; font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 500; }
    .tag.conflict { background: #3b1f1f; color: #fca5a5; }
    .tag.table { background: #1a2b1a; color: #86efac; }
    .tag.feature { background: #251f3b; color: #c4b5fd; }
    .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
    .detail { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; }
    .detail h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
    .detail-section { background: #0f172a; border-radius: 8px; padding: 1rem; }
    .detail-section h4 { font-size: 0.8rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .detail-section ul { list-style: none; }
    .detail-section li { font-size: 0.825rem; color: var(--muted); padding: 0.2rem 0; border-bottom: 1px solid var(--border); }
    .detail-section li:last-child { border-bottom: none; }
    .detail-section li code { color: #7dd3fc; font-family: 'Courier New', monospace; font-size: 0.8rem; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; }
    .badge-green { background: #14532d; color: #86efac; }
    .badge-yellow { background: #422006; color: #fde68a; }
    .badge-blue { background: #1e3a5f; color: #93c5fd; }
    .search { width: 100%; background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 0.625rem 1rem; border-radius: 8px; font-size: 0.9rem; margin-bottom: 1.5rem; outline: none; }
    .search:focus { border-color: var(--accent); }
    .empty { text-align: center; color: var(--muted); padding: 3rem; }
    #modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; align-items: center; justify-content: center; padding: 1rem; }
    #modal.open { display: flex; }
    #modal-content { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 1.5rem; position: relative; }
    #modal-close { position: absolute; top: 1rem; right: 1rem; background: var(--border); border: none; color: var(--text); width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
    .info-row { display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 0.75rem 0; }
    .info-item { font-size: 0.825rem; color: var(--muted); }
    .info-item strong { color: var(--text); }
    pre { background: #0a0f1a; border: 1px solid var(--border); border-radius: 8px; padding: 1rem; font-size: 0.8rem; color: #7dd3fc; overflow-x: auto; margin-top: 0.75rem; }
  </style>
</head>
<body>
  <header>
    <h1>🧩 ${title}</h1>
    <span id="feature-count"></span>
    <nav>
      <button class="active" onclick="showTab('features')">Features</button>
      <button onclick="showTab('templates')">Templates</button>
      <button onclick="showTab('compose')">Compose Helper</button>
    </nav>
  </header>

  <main>
    <!-- FEATURES TAB -->
    <div id="tab-features">
      <input class="search" type="text" placeholder="Search features…" oninput="filterFeatures(this.value)" />
      <div class="grid" id="feature-grid"></div>
    </div>

    <!-- TEMPLATES TAB -->
    <div id="tab-templates" style="display:none">
      <div class="grid" id="template-grid"></div>
    </div>

    <!-- COMPOSE HELPER TAB -->
    <div id="tab-compose" style="display:none">
      <div class="detail">
        <h3>Compose Helper</h3>
        <p style="color:var(--muted);font-size:0.875rem;margin-top:0.25rem">Select a template and features to generate a starter app config JSON.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.25rem">
          <div>
            <label style="font-size:0.8rem;color:var(--muted);display:block;margin-bottom:0.4rem">App ID</label>
            <input id="compose-id" class="search" style="margin:0" placeholder="my-app" />
          </div>
          <div>
            <label style="font-size:0.8rem;color:var(--muted);display:block;margin-bottom:0.4rem">App Name</label>
            <input id="compose-name" class="search" style="margin:0" placeholder="My App" />
          </div>
          <div>
            <label style="font-size:0.8rem;color:var(--muted);display:block;margin-bottom:0.4rem">Domain</label>
            <input id="compose-domain" class="search" style="margin:0" placeholder="myapp.com.au" />
          </div>
          <div>
            <label style="font-size:0.8rem;color:var(--muted);display:block;margin-bottom:0.4rem">Brand Colour</label>
            <input id="compose-color" type="color" value="#6366f1" style="width:100%;height:38px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer" />
          </div>
        </div>
        <div style="margin-top:1rem">
          <label style="font-size:0.8rem;color:var(--muted);display:block;margin-bottom:0.4rem">Template</label>
          <select id="compose-template" class="search" style="margin:0"></select>
        </div>
        <div style="margin-top:1rem">
          <label style="font-size:0.8rem;color:var(--muted);display:block;margin-bottom:0.4rem">Features (select all that apply)</label>
          <div id="compose-features" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.5rem;margin-top:0.375rem"></div>
        </div>
        <button onclick="generateConfig()" style="margin-top:1.25rem;background:var(--accent);border:none;color:#fff;padding:0.625rem 1.5rem;border-radius:8px;cursor:pointer;font-size:0.875rem;font-weight:600">Generate Config</button>
        <pre id="compose-output" style="display:none;margin-top:1.25rem"></pre>
        <button id="compose-copy" onclick="copyConfig()" style="display:none;margin-top:0.5rem;background:var(--border);border:none;color:var(--text);padding:0.5rem 1rem;border-radius:6px;cursor:pointer;font-size:0.8rem">Copy to clipboard</button>
      </div>
    </div>
  </main>

  <!-- MODAL -->
  <div id="modal">
    <div id="modal-content">
      <button id="modal-close" onclick="closeModal()">✕</button>
      <div id="modal-body"></div>
    </div>
  </div>

  <script>
    const FEATURES = ${JSON.stringify(FEATURES, null, 2)};
    const TEMPLATES = ${JSON.stringify(TEMPLATES, null, 2)};

    const ICONS = {
      'auth-bearer': '🔐', 'auth-clerk': '🪪', 'email-resend': '📧',
      'payments-stripe': '💳', 'payments-paypal': '🅿️', 'payments-square': '🟦',
      'sms-twilio': '📱', 'ai-openrouter': '🤖',
    };
    const ICON_COLORS = {
      'auth-bearer': '#4f46e5', 'auth-clerk': '#0891b2', 'email-resend': '#ea580c',
      'payments-stripe': '#7c3aed', 'payments-paypal': '#1d4ed8', 'payments-square': '#065f46',
      'sms-twilio': '#be185d', 'ai-openrouter': '#d97706',
    };
    const TMPL_ICONS = {
      'food-truck': '🍖', 'festival': '🎪', 'simple-website': '🛒',
      'wirez': '⚡', 'oconnor': '🚚', 'autohue': '🖥️',
      'aussie-saver': '⛽', 'socialai': '📲',
    };

    document.getElementById('feature-count').textContent = FEATURES.length + ' features · ' + TEMPLATES.length + ' templates';

    function showTab(name) {
      ['features', 'templates', 'compose'].forEach(t => {
        document.getElementById('tab-' + t).style.display = t === name ? '' : 'none';
      });
      document.querySelectorAll('nav button').forEach((b, i) => {
        b.classList.toggle('active', ['features','templates','compose'][i] === name);
      });
      if (name === 'templates' && !document.getElementById('template-grid').childElementCount) renderTemplates();
      if (name === 'compose' && !document.getElementById('compose-template').childElementCount) initCompose();
    }

    function renderFeatureCard(f) {
      const icon = ICONS[f.id] || '🧩';
      const color = ICON_COLORS[f.id] || '#6366f1';
      const conflicts = f.conflicts.length ? \`<span class="tag conflict">conflicts: \${f.conflicts.join(', ')}</span>\` : '';
      return \`<div class="card" onclick="showFeatureModal('\${f.id}')">
        <div class="card-header">
          <div class="card-icon" style="background:\${color}20">\${icon}</div>
          <div>
            <div class="card-title">\${f.name}</div>
            <div class="card-sub">v\${f.version} · \${f.category} · \${f.provides.routes} routes</div>
          </div>
        </div>
        <div class="card-desc">\${f.description}</div>
        <div class="tags">
          \${f.tags.map(t => '<span class="tag">' + t + '</span>').join('')}
          \${conflicts}
        </div>
      </div>\`;
    }

    function renderTemplateCard(t) {
      const icon = TMPL_ICONS[t.id] || '📦';
      return \`<div class="card" onclick="showTemplateModal('\${t.id}')">
        <div class="card-header">
          <div class="card-icon" style="background:#6366f120;font-size:1.3rem">\${icon}</div>
          <div>
            <div class="card-title">\${t.name}</div>
            <div class="card-sub">\${t.tables.length} tables · \${t.recommended_features.length} recommended features</div>
          </div>
        </div>
        <div class="card-desc">\${t.description}</div>
        <div class="tags">
          \${t.examples.map(e => '<span class="tag feature">' + e + '</span>').join('')}
        </div>
      </div>\`;
    }

    function filterFeatures(q) {
      const lq = q.toLowerCase();
      const filtered = FEATURES.filter(f =>
        f.id.includes(lq) || f.name.toLowerCase().includes(lq) ||
        f.description.toLowerCase().includes(lq) || f.tags.some(t => t.includes(lq))
      );
      document.getElementById('feature-grid').innerHTML = filtered.length
        ? filtered.map(renderFeatureCard).join('')
        : '<div class="empty">No features match your search.</div>';
    }

    function renderTemplates() {
      document.getElementById('template-grid').innerHTML = TEMPLATES.map(renderTemplateCard).join('');
    }

    function showFeatureModal(id) {
      const f = FEATURES.find(x => x.id === id);
      if (!f) return;
      const icon = ICONS[f.id] || '🧩';
      document.getElementById('modal-body').innerHTML = \`
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
          <div style="font-size:2rem">\${icon}</div>
          <div>
            <h3 style="font-size:1.1rem;font-weight:700">\${f.name}</h3>
            <div style="color:var(--muted);font-size:0.825rem">v\${f.version} · \${f.category}</div>
          </div>
        </div>
        <p style="color:var(--muted);font-size:0.875rem;margin-bottom:1rem">\${f.description}</p>
        <div style="background:#0a1520;border-radius:8px;padding:0.875rem;margin-bottom:1rem;font-size:0.825rem;color:#7dd3fc;font-style:italic">
          💡 \${f.use_when}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.875rem">
          <div style="background:#0a0f1a;border-radius:8px;padding:1rem">
            <div style="font-size:0.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Required Secrets</div>
            \${f.requires.secrets.length ? f.requires.secrets.map(s => '<div style="font-size:0.825rem;color:#fca5a5;font-family:monospace;padding:0.15rem 0">' + s + '</div>').join('') : '<div style="color:var(--muted);font-size:0.8rem">None</div>'}
          </div>
          <div style="background:#0a0f1a;border-radius:8px;padding:1rem">
            <div style="font-size:0.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Config Variables</div>
            \${f.requires.env.length ? f.requires.env.map(s => '<div style="font-size:0.825rem;color:#fde68a;font-family:monospace;padding:0.15rem 0">' + s + '</div>').join('') : '<div style="color:var(--muted);font-size:0.8rem">None</div>'}
          </div>
          <div style="background:#0a0f1a;border-radius:8px;padding:1rem">
            <div style="font-size:0.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">DB Tables</div>
            \${f.requires.tables.map(t => '<div style="font-size:0.825rem;color:#86efac;font-family:monospace;padding:0.15rem 0">' + t + '</div>').join('')}
          </div>
          <div style="background:#0a0f1a;border-radius:8px;padding:1rem">
            <div style="font-size:0.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Provides</div>
            <div style="font-size:0.825rem;color:var(--muted)">\${f.provides.routes} API routes</div>
            \${f.provides.middleware.length ? '<div style="font-size:0.8rem;color:#c4b5fd;margin-top:0.25rem">middleware: ' + f.provides.middleware.join(', ') + '</div>' : ''}
            \${f.provides.crons.length ? '<div style="font-size:0.8rem;color:#7dd3fc;margin-top:0.25rem">cron: ' + f.provides.crons[0] + '</div>' : ''}
          </div>
        </div>
        \${f.conflicts.length ? '<div style="margin-top:0.875rem;background:#1f0f0f;border-radius:8px;padding:0.875rem;font-size:0.825rem;color:#fca5a5">⚠️ Conflicts with: ' + f.conflicts.join(', ') + '</div>' : ''}
      \`;
      document.getElementById('modal').classList.add('open');
    }

    function showTemplateModal(id) {
      const t = TEMPLATES.find(x => x.id === id);
      if (!t) return;
      const icon = TMPL_ICONS[t.id] || '📦';
      document.getElementById('modal-body').innerHTML = \`
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
          <div style="font-size:2rem">\${icon}</div>
          <div>
            <h3 style="font-size:1.1rem;font-weight:700">\${t.name}</h3>
            <div style="color:var(--muted);font-size:0.825rem">template: \${t.id}</div>
          </div>
        </div>
        <p style="color:var(--muted);font-size:0.875rem;margin-bottom:1rem">\${t.description}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.875rem">
          <div style="background:#0a0f1a;border-radius:8px;padding:1rem">
            <div style="font-size:0.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">DB Tables</div>
            \${t.tables.map(x => '<div style="font-size:0.825rem;color:#86efac;font-family:monospace;padding:0.15rem 0">' + x + '</div>').join('')}
          </div>
          <div style="background:#0a0f1a;border-radius:8px;padding:1rem">
            <div style="font-size:0.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Recommended Features</div>
            \${t.recommended_features.map(x => '<div style="font-size:0.825rem;color:#c4b5fd;font-family:monospace;padding:0.15rem 0">' + x + '</div>').join('')}
          </div>
        </div>
        <div style="margin-top:0.875rem;background:#0a1520;border-radius:8px;padding:0.875rem;font-size:0.825rem;color:var(--muted)">
          Real deployments: \${t.examples.join(', ')}
        </div>
      \`;
      document.getElementById('modal').classList.add('open');
    }

    function closeModal() {
      document.getElementById('modal').classList.remove('open');
    }

    document.getElementById('modal').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });

    function initCompose() {
      const sel = document.getElementById('compose-template');
      TEMPLATES.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name;
        sel.appendChild(opt);
      });
      sel.addEventListener('change', updateRecommended);
      const fc = document.getElementById('compose-features');
      FEATURES.forEach(f => {
        const label = document.createElement('label');
        label.style.cssText = 'display:flex;align-items:center;gap:0.5rem;font-size:0.825rem;cursor:pointer;background:#0a0f1a;padding:0.5rem 0.75rem;border-radius:6px';
        label.innerHTML = \`<input type="checkbox" value="\${f.id}" style="accent-color:var(--accent)"> \${f.name}\`;
        fc.appendChild(label);
      });
      updateRecommended();
    }

    function updateRecommended() {
      const tmpl = TEMPLATES.find(t => t.id === document.getElementById('compose-template').value);
      if (!tmpl) return;
      document.querySelectorAll('#compose-features input[type=checkbox]').forEach(cb => {
        cb.checked = tmpl.recommended_features.includes(cb.value);
      });
    }

    function generateConfig() {
      const id = document.getElementById('compose-id').value.trim() || 'my-app';
      const name = document.getElementById('compose-name').value.trim() || 'My App';
      const domain = document.getElementById('compose-domain').value.trim() || '';
      const color = document.getElementById('compose-color').value;
      const template = document.getElementById('compose-template').value;
      const features = Array.from(document.querySelectorAll('#compose-features input:checked')).map(cb => cb.value);
      const allSecrets = [...new Set(features.flatMap(fid => (FEATURES.find(f => f.id === fid)?.requires.secrets || [])))];
      const allEnv = [...new Set(features.flatMap(fid => (FEATURES.find(f => f.id === fid)?.requires.env || [])))];
      const config = {
        id, name, domain: domain || undefined,
        template,
        branding: { name, color },
        features,
        env: Object.fromEntries(allEnv.map(k => [k, ''])),
        secrets: allSecrets,
      };
      const out = document.getElementById('compose-output');
      out.textContent = JSON.stringify(config, null, 2);
      out.style.display = '';
      document.getElementById('compose-copy').style.display = '';
    }

    function copyConfig() {
      navigator.clipboard.writeText(document.getElementById('compose-output').textContent);
      document.getElementById('compose-copy').textContent = '✓ Copied!';
      setTimeout(() => { document.getElementById('compose-copy').textContent = 'Copy to clipboard'; }, 2000);
    }

    // Initial render
    document.getElementById('feature-grid').innerHTML = FEATURES.map(renderFeatureCard).join('');
  </script>
</body>
</html>`;
}

// ============ WORKER ============

const app = new Hono<{ Bindings: { REGISTRY_TITLE?: string } }>();

app.use('*', cors());

app.get('/', (c) => {
  return c.html(renderHtml(c.env));
});

app.get('/api/features', (c) => {
  const category = c.req.query('category');
  const q = c.req.query('q')?.toLowerCase();
  let results = [...FEATURES] as unknown as Feature[];
  if (category) results = results.filter((f) => f.category === category);
  if (q) results = results.filter(
    (f) => f.id.includes(q) || (f.name as string).toLowerCase().includes(q) ||
      (f.description as string).toLowerCase().includes(q) ||
      (f.tags as readonly string[]).some((t) => t.includes(q))
  );
  return c.json({ features: results, total: results.length });
});

app.get('/api/features/:id', (c) => {
  const feature = FEATURES.find((f) => f.id === c.req.param('id'));
  if (!feature) return c.json({ error: 'Feature not found' }, 404);
  return c.json({ feature });
});

app.get('/api/templates', (c) => {
  return c.json({ templates: TEMPLATES, total: TEMPLATES.length });
});

app.get('/api/templates/:id', (c) => {
  const template = TEMPLATES.find((t) => t.id === c.req.param('id'));
  if (!template) return c.json({ error: 'Template not found' }, 404);
  const recommendedFeatures = FEATURES.filter((f) =>
    (template.recommended_features as readonly string[]).includes(f.id)
  );
  return c.json({ template, recommended_features: recommendedFeatures });
});

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', features: FEATURES.length, templates: TEMPLATES.length });
});

export default { fetch: app.fetch };
