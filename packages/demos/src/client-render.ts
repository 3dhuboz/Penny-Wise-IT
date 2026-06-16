// Customer Portal — single page at /client/:token where the prospect
// (now a customer) handles everything: signs the contract, pays the
// deposit invoice, fills the intake form, watches the walkthrough,
// pays the final, gets their app live.

const esc = (s: string) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] || c));
const VALIDATOR_URL = 'https://pennywiseit-validator.steve-700.workers.dev';

const STAGE_LABELS: Record<string, string> = {
  approved: 'Approved',
  contract_sent: 'Contract sent — awaiting signature',
  contract_signed: 'Contract signed',
  deposit_invoiced: 'Deposit invoice — awaiting payment',
  deposit_paid: 'Deposit received',
  intake_open: 'Intake form open — awaiting your info',
  intake_received: 'Intake received — Steve building',
  building: 'Building your app',
  walkthrough_sent: 'Walkthrough ready — please review',
  walkthrough_approved: 'Walkthrough approved — final invoice issued',
  final_invoiced: 'Final invoice — awaiting payment',
  final_paid: 'Final paid — going live',
  live: 'Live!',
  on_hold: 'On hold',
  cancelled: 'Cancelled',
};

const sharedStyles = `
:root { --bg:#f8fafc; --surface:#fff; --card:#fff; --border:#e2e8f0; --text:#0f172a; --soft:#475569; --muted:#94a3b8; --brand:#4f8ef7; --accent:#a78bfa; --green:#34d399; --yellow:#f59e0b; --red:#f87171; }
* { box-sizing: border-box; margin:0; padding:0; }
body { background: var(--bg); color: var(--text); font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; line-height: 1.55; min-height:100vh; }
a { color: var(--brand); text-decoration: none; }
.wrap { max-width: 980px; margin: 0 auto; padding: 1.5rem; }
.topbar { background: white; border-bottom: 1px solid var(--border); padding: 1rem 1.5rem; }
.topbar-inner { max-width: 980px; margin: 0 auto; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.topbar .brand-h { display:flex; align-items:center; gap:0.7rem; font-weight:800; font-size:1.05rem; }
.topbar .brand-logo { width:42px; height:42px; border-radius:10px; background:linear-gradient(135deg,var(--brand),var(--accent)); display:flex; align-items:center; justify-content:center; font-size:1.2rem; color:white; flex-shrink:0; overflow:hidden; }
.topbar .brand-logo img { width:100%; height:100%; object-fit:cover; }
.topbar .meta { font-size:0.78rem; color:var(--muted); }

.hero-card { background: linear-gradient(135deg, var(--brand), var(--accent)); color: white; padding: 1.5rem 1.75rem; border-radius: 16px; margin-bottom: 1.5rem; box-shadow: 0 10px 40px rgba(79,142,247,0.25); }
.hero-card h1 { font-size: 1.6rem; font-weight: 900; letter-spacing: -0.01em; margin-bottom: 0.4rem; }
.hero-card p { font-size: 0.95rem; opacity: 0.95; }
.stage-pill { display:inline-block; background:rgba(255,255,255,0.2); padding:0.25rem 0.7rem; border-radius:999px; font-size:0.72rem; font-weight:800; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:0.6rem; }

.steps { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
.step { flex: 1; min-width: 130px; background: white; border: 1px solid var(--border); border-radius: 10px; padding: 0.65rem 0.85rem; font-size: 0.78rem; }
.step .step-num { font-size: 0.6rem; font-weight: 800; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
.step .step-title { font-weight: 700; margin-top: 0.2rem; }
.step.done { background: rgba(52,211,153,0.08); border-color: rgba(52,211,153,0.3); }
.step.done .step-num { color: var(--green); }
.step.current { background: rgba(79,142,247,0.06); border-color: var(--brand); box-shadow: 0 4px 16px rgba(79,142,247,0.15); }
.step.current .step-num { color: var(--brand); }
.step .step-status { font-size: 0.68rem; color: var(--muted); margin-top: 0.2rem; }

.section { background: white; border: 1px solid var(--border); border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 6px rgba(15,23,42,0.04); }
.section h2 { font-size: 1.15rem; font-weight: 800; margin-bottom: 0.5rem; display:flex; align-items:center; gap:0.5rem; }
.section .desc { font-size: 0.88rem; color: var(--soft); margin-bottom: 1rem; }
.section .desc.warn { background: rgba(245,158,11,0.08); border-left: 3px solid var(--yellow); padding: 0.75rem 1rem; border-radius: 0 6px 6px 0; color: #78350f; }
.section .due { font-size: 0.78rem; color: var(--yellow); font-weight: 700; }

.btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 0.9rem; border: none; cursor: pointer; font-family: inherit; text-decoration: none; transition: all 0.15s; }
.btn-primary { background: var(--brand); color: white; }
.btn-primary:hover { background: #3b7ce5; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(79,142,247,0.35); }
.btn-green { background: var(--green); color: white; }
.btn-green:hover { background: #10b981; }
.btn-secondary { background: white; color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { border-color: var(--brand); color: var(--brand); }

.form-row { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }
.form-row label { font-size: 0.78rem; color: var(--soft); font-weight: 600; }
.form-row .hint { font-size: 0.72rem; color: var(--muted); margin-top: -0.15rem; }
.form-row input, .form-row textarea, .form-row select { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 0.65rem 0.85rem; font-family: inherit; font-size: 0.92rem; color: var(--text); outline: none; }
.form-row input:focus, .form-row textarea:focus { border-color: var(--brand); }
.form-row .req { color: var(--red); }

.invoice-row { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; background: var(--bg); border-radius: 8px; margin-bottom: 0.5rem; }
.invoice-row .inv-num { font-family: monospace; font-size: 0.85rem; color: var(--soft); }
.invoice-row .inv-amount { font-weight: 800; font-size: 1.05rem; }
.invoice-row .inv-status { padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
.invoice-row .inv-status.paid { background: rgba(52,211,153,0.15); color: #047857; }
.invoice-row .inv-status.sent { background: rgba(245,158,11,0.15); color: #b45309; }
.invoice-row .inv-status.overdue { background: rgba(248,113,113,0.15); color: #b91c1c; }

footer { text-align:center; color: var(--muted); font-size: 0.78rem; padding: 2rem 1rem; }
.toast { position:fixed; bottom: 1.5rem; left:50%; transform:translateX(-50%) translateY(40px); background: var(--text); color:white; padding:0.7rem 1.2rem; border-radius:10px; font-weight:700; opacity:0; transition:all 0.3s; z-index:200; }
.toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
`;

export function renderClientPortal(data: any): string {
  const customer = data.customer;
  const project = data.projects?.[0]; // V1: one active project per customer
  const contract = data.contracts?.[0];
  const invoices = data.invoices || [];
  const intake = data.intakes?.[0];
  const rep = data.rep;
  const stage = project?.stage || 'approved';
  const repFirst = rep?.first_name || 'Steve';

  const STAGE_ORDER = ['approved','contract_sent','contract_signed','deposit_invoiced','deposit_paid','intake_open','intake_received','building','walkthrough_sent','walkthrough_approved','final_invoiced','final_paid','live'];
  const currentIdx = STAGE_ORDER.indexOf(stage);
  const STEPS = [
    { key: 'contract', label: 'Sign contract', stages: ['contract_sent','contract_signed'] },
    { key: 'deposit', label: 'Pay deposit (50%)', stages: ['deposit_invoiced','deposit_paid'] },
    { key: 'intake', label: 'Send us your info', stages: ['intake_open','intake_received'] },
    { key: 'building', label: 'We build', stages: ['building'] },
    { key: 'walkthrough', label: 'Approve walkthrough', stages: ['walkthrough_sent','walkthrough_approved'] },
    { key: 'final', label: 'Pay final (50%)', stages: ['final_invoiced','final_paid'] },
    { key: 'live', label: 'Go live!', stages: ['live'] },
  ];
  const stepHTML = STEPS.map((s, i) => {
    const stagesCovered = s.stages;
    const minIdx = Math.min(...stagesCovered.map(st => STAGE_ORDER.indexOf(st)));
    const maxIdx = Math.max(...stagesCovered.map(st => STAGE_ORDER.indexOf(st)));
    const cls = currentIdx > maxIdx ? 'done' : (currentIdx >= minIdx && currentIdx <= maxIdx ? 'current' : '');
    return `<div class="step ${cls}">
      <div class="step-num">${cls === 'done' ? '\u2713 ' : ''}STEP ${i + 1}</div>
      <div class="step-title">${esc(s.label)}</div>
    </div>`;
  }).join('');

  // Active section content based on current stage
  const unpaidDeposit = invoices.find((i: any) => i.type === 'deposit' && i.status !== 'paid');
  const unpaidFinal = invoices.find((i: any) => i.type === 'final' && i.status !== 'paid');

  // Sections — only show what's currently relevant
  let activeSection = '';
  if (contract && !contract.signed_at) {
    activeSection = `
      <div class="section">
        <h2>\u270D\uFE0F Sign your contract</h2>
        <p class="desc">Your software development agreement is ready. Read it carefully \u2014 it sets out what we deliver, what you owe, and importantly, the <strong>14-day deadline</strong> for getting your info to us.</p>
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
          <a href="/client/${esc(customer.client_token)}/contract/${esc(contract.id)}" class="btn btn-primary">\u{1F4C4} Read &amp; sign contract</a>
        </div>
      </div>`;
  } else if (unpaidDeposit) {
    activeSection = `
      <div class="section">
        <h2>\u{1F4B0} Pay your deposit invoice</h2>
        <p class="desc">Your 50% deposit (<strong>$${(unpaidDeposit.amount).toLocaleString()}</strong>) is due. We start as soon as it clears (usually 1\u20132 business days).</p>
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
          <a href="/invoice/${esc(unpaidDeposit.invoice_number)}" class="btn btn-primary">\u{1F4B3} View invoice + bank details</a>
        </div>
      </div>`;
  }

  // Intake section — show if intake_open and not yet submitted
  if (intake && !intake.submitted_at && (stage === 'intake_open' || stage === 'deposit_paid')) {
    const intakeDue = project.intake_due_at ? new Date(project.intake_due_at).toLocaleDateString('en-AU') : '14 days from deposit';
    const daysLeft = project.intake_due_at ? Math.max(0, Math.ceil((new Date(project.intake_due_at).getTime() - Date.now()) / 86400000)) : null;
    activeSection += `
      <div class="section">
        <h2>\u{1F4DD} Tell us what to build</h2>
        <p class="desc warn">We can't start building until you submit this form. <strong>${daysLeft != null ? daysLeft + ' days left' : 'Due ' + intakeDue}</strong> \u2014 deadline ${esc(intakeDue)}.</p>
        <p class="desc">Logo, business details, content, and the specifics for each module you ordered. About 10\u201320 minutes to fill out.</p>
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
          <a href="/client/${esc(customer.client_token)}/intake/${esc(intake.id)}" class="btn btn-primary">\u270D\uFE0F Open intake form</a>
        </div>
      </div>`;
  }

  // Walkthrough section
  if (project?.walkthrough_url && !project.walkthrough_approved_at && stage === 'walkthrough_sent') {
    activeSection += `
      <div class="section">
        <h2>\u{1F39E}\uFE0F Approve your walkthrough</h2>
        <p class="desc">Your app is built. Watch the recorded walkthrough, then approve or list reasonable revisions. You have 5 business days.</p>
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
          <a href="/client/${esc(customer.client_token)}/walkthrough" class="btn btn-primary">\u25B6\uFE0F Watch walkthrough</a>
        </div>
      </div>`;
  }

  if (unpaidFinal) {
    activeSection += `
      <div class="section">
        <h2>\u{1F389} Pay the final invoice and we go live</h2>
        <p class="desc">Final 50% (<strong>$${(unpaidFinal.amount).toLocaleString()}</strong>). The moment it clears, your app goes live.</p>
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
          <a href="/invoice/${esc(unpaidFinal.invoice_number)}" class="btn btn-primary">\u{1F4B3} View final invoice</a>
        </div>
      </div>`;
  }

  if (stage === 'live') {
    activeSection = `
      <div class="section" style="background:linear-gradient(135deg,rgba(52,211,153,0.06),rgba(79,142,247,0.04));border:1px solid rgba(52,211,153,0.3)">
        <h2>\u{1F389} You're live!</h2>
        <p class="desc">Your app is at <a href="${esc(project.domain || '#')}" target="_blank"><strong>${esc(project.domain || 'your domain')}</strong></a>. ${repFirst} will reach out to walk you through admin access.</p>
      </div>`;
  }

  if (!activeSection) {
    activeSection = `
      <div class="section">
        <h2>\u2705 You're all caught up</h2>
        <p class="desc">${esc(STAGE_LABELS[stage] || 'In progress')}. We'll email you the moment there's a next step.</p>
      </div>`;
  }

  // Invoice history
  const invoiceHistory = invoices.length ? `
    <div class="section">
      <h2>\u{1F4C4} Invoice history</h2>
      ${invoices.map((inv: any) => `
        <div class="invoice-row">
          <span class="inv-num">${esc(inv.invoice_number)}</span>
          <span style="flex:1;font-size:0.85rem;color:var(--soft)">${inv.type === 'deposit' ? 'Deposit (50%)' : inv.type === 'final' ? 'Final (50%)' : 'Monthly hosting'}</span>
          <span class="inv-amount">$${(inv.amount).toLocaleString()}</span>
          <span class="inv-status ${esc(inv.status)}">${esc(inv.status)}</span>
          <a href="/invoice/${esc(inv.invoice_number)}" class="btn btn-secondary" style="padding:0.4rem 0.85rem;font-size:0.78rem">View</a>
        </div>
      `).join('')}
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(customer.business_name)} \u2014 Project portal</title>
<style>${sharedStyles}</style>
</head><body>

<div class="topbar">
  <div class="topbar-inner">
    <div class="brand-h">
      <div class="brand-logo">${customer.logo_url ? `<img src="${esc(customer.logo_url)}" alt="">` : esc((customer.business_name[0] || '?').toUpperCase())}</div>
      <div>${esc(customer.business_name)}</div>
    </div>
    <div style="margin-left:auto" class="meta">Project portal \u00b7 ${esc(repFirst)} at Penny Wise I.T</div>
  </div>
</div>

<div class="wrap">

  <div class="hero-card">
    <div class="stage-pill">${esc(STAGE_LABELS[stage] || stage)}</div>
    <h1>Welcome, ${esc((customer.contact_name || customer.business_name).split(' ')[0])}.</h1>
    <p>This page shows you exactly where your project is up to and what we need from you next. Bookmark it.</p>
  </div>

  <div class="steps">${stepHTML}</div>

  ${activeSection}
  ${invoiceHistory}

  <!-- Request a change \u2014 always available, becomes primary post-launch -->
  <div class="section">
    <h2>\u270F\uFE0F Request a change</h2>
    <p class="desc">Need something added, tweaked, or fixed? Drop a message here and ${esc(repFirst)} will get back to you. ${stage === 'live' ? 'Most reasonable changes are included in your monthly support; bigger work gets quoted upfront.' : 'You can request changes anytime, even before launch.'}</p>
    <div class="form-row" style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <select id="rc-category" style="flex:0 0 auto;min-width:140px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:0.65rem 0.85rem;color:var(--text)">
        <option value="content">Content / wording</option>
        <option value="design">Design / colours</option>
        <option value="feature">New feature</option>
        <option value="bug">Bug / not working</option>
        <option value="general">Something else</option>
      </select>
      <select id="rc-urgency" style="flex:0 0 auto;min-width:120px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:0.65rem 0.85rem;color:var(--text)">
        <option value="low">Low \u2014 whenever</option>
        <option value="normal" selected>Normal \u2014 this week</option>
        <option value="urgent">Urgent \u2014 today</option>
      </select>
    </div>
    <div class="form-row">
      <textarea id="rc-message" rows="4" placeholder="What needs changing? Be specific \u2014 e.g. 'Update the menu to add the new $14 brisket roll, and change the hero photo to the one I emailed last week.'"></textarea>
    </div>
    <button class="btn btn-primary" id="rc-submit" onclick="submitChangeRequest()">\u{1F4E8} Send to ${esc(repFirst)}</button>
    <span id="rc-status" style="margin-left:0.6rem;font-size:0.85rem"></span>
  </div>

  <!-- Activity timeline \u2014 their full history -->
  <div class="section">
    <h2>\u{1F4DD} Your project history</h2>
    <div id="client-events" style="font-size:0.88rem;color:var(--soft)">Loading...</div>
  </div>

  <!-- Referral panel \u2014 every customer gets a code and tally -->
  <div class="section" style="background:linear-gradient(135deg,rgba(167,139,250,0.06),rgba(79,142,247,0.04));border-color:rgba(167,139,250,0.25)">
    <h2>\u{1F381} Refer another business, get a free month</h2>
    <p class="desc">Know another business that needs a website or app? Share your code. When they sign up, <strong>you both get a free month of hosting</strong>.</p>
    <div id="referral-panel" style="display:flex;flex-direction:column;gap:0.5rem">
      <div style="font-size:0.85rem;color:var(--soft)">Loading your code...</div>
    </div>
  </div>

  ${stage === 'live' ? `
    <!-- Testimonial opt-in \u2014 only when live, helps the team and you -->
    <div class="section" style="background:linear-gradient(135deg,rgba(52,211,153,0.05),rgba(79,142,247,0.04));border-color:rgba(52,211,153,0.25)">
      <h2>\u{1F4AC} Help us out (1 minute, optional)</h2>
      <p class="desc">Mind if we mention <strong>${esc(customer.business_name)}</strong> as a recent build on our site? It helps other businesses see real proof. We don\u2019t share emails or numbers \u2014 just your business name and (optionally) a one-line quote you write below.</p>
      <div class="form-row">
        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-weight:600">
          <input type="checkbox" id="ts-optin" ${customer.testimonial_opt_in ? 'checked' : ''}> Yes, you can mention us publicly
        </label>
      </div>
      <div class="form-row">
        <label>Optional one-line quote</label>
        <textarea id="ts-quote" rows="2" placeholder="e.g. 'Steve had us live in a week \u2014 our online orders are already up 30%.'">${esc(customer.testimonial_quote || '')}</textarea>
      </div>
      <button class="btn btn-secondary" id="ts-save" onclick="saveTestimonial()">Save preference</button>
      <span id="ts-status" style="margin-left:0.5rem;font-size:0.85rem"></span>
    </div>
  ` : ''}

  <div class="section" style="background:var(--bg);border-style:dashed">
    <h2 style="font-size:1rem">Need help?</h2>
    <p class="desc">Reply to any email from us, or reach ${esc(repFirst)} directly${rep?.phone ? ' on <strong>' + esc(rep.phone) + '</strong>' : ''}${rep?.email ? ' / <a href="mailto:' + esc(rep.email) + '">' + esc(rep.email) + '</a>' : ''}.</p>
  </div>

</div>

<footer>
  Penny Wise I.T \u2014 ABN 70 661 074 824 \u2014 <a href="https://pennywiseit.com.au">pennywiseit.com.au</a>
</footer>

<div id="toast" class="toast"></div>

<script>
const CLIENT_TOKEN = ${JSON.stringify(customer.client_token)};

function toast(msg, kind) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = kind === 'error' ? 'var(--red)' : kind === 'success' ? 'var(--green)' : 'var(--text)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

async function submitChangeRequest() {
  const message = document.getElementById('rc-message').value.trim();
  const category = document.getElementById('rc-category').value;
  const urgency = document.getElementById('rc-urgency').value;
  const status = document.getElementById('rc-status');
  const btn = document.getElementById('rc-submit');
  if (!message || message.length < 10) { status.textContent = 'Add a bit more detail (10+ characters)'; status.style.color = 'var(--red)'; return; }
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/client/' + CLIENT_TOKEN + '/request-change', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, category, urgency }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    status.textContent = '\u2713 Sent. We\\'ll be in touch within 24 hours.';
    status.style.color = 'var(--green)';
    document.getElementById('rc-message').value = '';
    btn.textContent = '\u2713 Sent';
    setTimeout(() => { btn.disabled = false; btn.textContent = '\u{1F4E8} Send to ${esc(repFirst)}'; status.textContent = ''; loadClientEvents(); }, 1800);
  } catch (e) {
    status.textContent = e.message; status.style.color = 'var(--red)';
    btn.disabled = false; btn.textContent = '\u{1F4E8} Send to ${esc(repFirst)}';
  }
}

const EVENT_ICONS = {
  approved: '\u2728', contract_signed: '\u270D\uFE0F', invoice_sent: '\u{1F4E8}',
  invoice_paid: '\u{1F4B0}', intake_submitted: '\u{1F4E5}', walkthrough_approved: '\u{1F39E}\uFE0F',
  monthly_invoice: '\u{1F501}', stage_changed: '\u{1F504}',
  health_down: '\u{1F534}', health_recovered: '\u2705',
  change_request: '\u270F\uFE0F',
};

async function loadClientEvents() {
  const el = document.getElementById('client-events');
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/client/' + CLIENT_TOKEN + '/events');
    const data = await res.json();
    const events = data.events || [];
    if (!events.length) {
      el.innerHTML = '<p style="color:var(--muted);font-size:0.85rem">Activity will appear here as your project moves forward.</p>';
      return;
    }
    el.innerHTML = '<div style="position:relative;padding-left:1rem;border-left:2px solid var(--border)">' +
      events.map(ev => {
        const icon = EVENT_ICONS[ev.kind] || '\u{1F538}';
        const when = ev.created_at ? new Date(ev.created_at + 'Z').toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' }) : '';
        return '<div style="margin-bottom:0.6rem;position:relative">' +
          '<span style="position:absolute;left:-1.4rem;top:0;background:var(--surface);font-size:0.85rem;width:1.2rem;height:1.2rem;display:flex;align-items:center;justify-content:center;border-radius:50%">' + icon + '</span>' +
          '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:baseline">' +
            '<span style="font-size:0.85rem;color:var(--text)">' + escHtml(ev.message) + '</span>' +
            '<span style="font-size:0.7rem;color:var(--muted);margin-left:auto">' + escHtml(when) + '</span>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  } catch {
    el.innerHTML = '<p style="color:var(--muted);font-size:0.85rem">Could not load history right now.</p>';
  }
}
function escHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c)); }
loadClientEvents();

async function loadReferral() {
  const el = document.getElementById('referral-panel');
  if (!el) return;
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/client/' + CLIENT_TOKEN + '/referral');
    const d = await res.json();
    if (!res.ok) throw new Error(d.error || 'Failed');
    const code = d.referral_code || '\u2014';
    const url = d.share_url || '';
    el.innerHTML =
      '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center">' +
        '<input readonly value="' + escHtml(url) + '" style="flex:1;min-width:240px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:0.55rem 0.75rem;color:var(--text);font-family:monospace;font-size:0.82rem" onclick="this.select()">' +
        '<button class="btn btn-secondary" onclick="navigator.clipboard.writeText(\\'' + url + '\\').then(()=>toast(\\'Copied\\',\\'success\\'))">\u{1F4CB} Copy link</button>' +
      '</div>' +
      '<div style="display:flex;gap:1.5rem;flex-wrap:wrap;font-size:0.82rem;color:var(--soft);padding-top:0.4rem;border-top:1px dashed rgba(255,255,255,0.07)">' +
        '<span>Your code: <strong style="color:var(--text);font-family:monospace">' + escHtml(code) + '</strong></span>' +
        '<span>Referrals: <strong style="color:var(--text)">' + d.converted_count + '</strong></span>' +
        '<span>Free months earned: <strong style="color:var(--green)">' + d.credits_earned + '</strong></span>' +
        (d.credits_pending > 0 ? '<span style="color:var(--yellow)">\u23F3 ' + d.credits_pending + ' pending application</span>' : '') +
      '</div>';
  } catch (e) {
    el.innerHTML = '<p style="color:var(--muted);font-size:0.85rem">Couldn\\'t load your referral details right now.</p>';
  }
}
loadReferral();

async function saveTestimonial() {
  const opt_in = document.getElementById('ts-optin').checked;
  const quote = document.getElementById('ts-quote').value.trim();
  const status = document.getElementById('ts-status');
  const btn = document.getElementById('ts-save');
  btn.disabled = true; btn.textContent = 'Saving...';
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/client/' + CLIENT_TOKEN + '/testimonial', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opt_in, quote }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    status.textContent = '\u2713 Saved'; status.style.color = 'var(--green)';
    setTimeout(() => { status.textContent = ''; }, 2500);
  } catch (e) {
    status.textContent = e.message; status.style.color = 'var(--red)';
  } finally { btn.disabled = false; btn.textContent = 'Save preference'; }
}
<\/script>

</body></html>`;
}

// ───── CONTRACT page (e-sign) ─────
export function renderContractPage(data: { customer: any; contract: any; rep?: any }): string {
  const c = data.customer;
  const contract = data.contract;
  const repFirst = (data.rep?.first_name) || 'Steve';
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contract \u2014 ${esc(c.business_name)}</title>
<style>${sharedStyles}
.contract-body { background: white; border:1px solid var(--border); border-radius:10px; padding: 0; max-width: 760px; margin: 0 auto 1.5rem; }
.contract-body iframe { width: 100%; border: none; min-height: 70vh; }
.sign-box { background: white; border: 2px solid var(--brand); border-radius: 12px; padding: 1.5rem; max-width: 760px; margin: 0 auto 2rem; box-shadow: 0 8px 30px rgba(79,142,247,0.15); }
.sign-box h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 0.6rem; }
</style>
</head><body>

<div class="topbar">
  <div class="topbar-inner">
    <a href="/client/${esc(c.client_token)}" class="btn btn-secondary" style="padding:0.4rem 0.9rem;font-size:0.85rem">\u2190 Portal</a>
    <div style="margin-left:auto" class="meta">${esc(c.business_name)} \u00b7 Contract</div>
  </div>
</div>

<div class="wrap">

  <div class="contract-body">
    <iframe srcdoc="${esc(contract.body_html)}"></iframe>
  </div>

  ${contract.signed_at ? `
    <div class="sign-box" style="border-color:var(--green);background:rgba(52,211,153,0.05)">
      <h3 style="color:var(--green)">\u2713 Signed by ${esc(contract.signed_by_name)} on ${new Date(contract.signed_at + 'Z').toLocaleString('en-AU')}</h3>
      <p style="font-size:0.85rem;color:var(--soft)">IP recorded: ${esc(contract.signed_by_ip || 'unknown')}. The deposit invoice has been sent to your portal.</p>
      <a href="/client/${esc(c.client_token)}" class="btn btn-primary" style="margin-top:0.85rem">\u2190 Back to portal</a>
    </div>
  ` : `
    <div class="sign-box">
      <h3>\u270D\uFE0F Sign to accept</h3>
      <p style="font-size:0.85rem;color:var(--soft);margin-bottom:1rem">By typing your name and clicking "I agree", you legally accept this agreement. We log your name, IP address, and timestamp.</p>
      <div class="form-row" style="max-width:420px">
        <label>Your full name <span class="req">*</span></label>
        <input type="text" id="signer-name" placeholder="As it appears on official documents">
      </div>
      <button class="btn btn-primary" id="sign-btn" onclick="signContract()">\u2713 I have read and agree</button>
      <div id="sign-status" style="margin-top:0.85rem;font-size:0.85rem;min-height:1em"></div>
    </div>
  `}

</div>

<footer>Penny Wise I.T \u2014 pennywiseit.com.au</footer>

<div id="toast" class="toast"></div>
<script>
async function signContract() {
  const name = document.getElementById('signer-name').value.trim();
  const status = document.getElementById('sign-status');
  if (!name) { status.textContent = 'Please type your full name.'; status.style.color = 'var(--red)'; return; }
  const btn = document.getElementById('sign-btn');
  btn.disabled = true; btn.textContent = 'Signing...';
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/client/${esc(c.client_token)}/contract/${esc(contract.id)}/sign', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signed_by_name: name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    status.textContent = '\u2713 Signed. The deposit invoice is now in your portal.';
    status.style.color = 'var(--green)';
    setTimeout(() => { window.location.href = '/client/${esc(c.client_token)}'; }, 1500);
  } catch (e) {
    status.textContent = e.message; status.style.color = 'var(--red)';
    btn.disabled = false; btn.textContent = '\u2713 I have read and agree';
  }
}
<\/script>

</body></html>`;
}

// ───── INVOICE page (public, with bank transfer details) ─────
export function renderInvoicePage(html: string): string {
  // The validator already returns the styled invoice HTML; we just wrap it
  return html;
}

// ───── INTAKE form page (schema-driven) ─────
export function renderIntakePage(data: { customer: any; intake: any }): string {
  const c = data.customer;
  const intake = data.intake;
  const schema = intake.schema || [];
  const responses = intake.responses || {};

  const fieldHtml = (f: any): string => {
    if (f.type === 'section') return `<h3 style="font-size:1.05rem;font-weight:800;margin:1.5rem 0 0.5rem;color:var(--brand)">${esc(f.label)}</h3>`;
    const required = f.required ? '<span class="req">*</span>' : '';
    const hint = f.hint ? `<div class="hint">${esc(f.hint)}</div>` : '';
    const value = responses[f.id] || '';
    let input = '';
    if (f.type === 'textarea') {
      input = `<textarea id="fld-${esc(f.id)}" rows="4" data-id="${esc(f.id)}" placeholder="${esc(f.placeholder || '')}">${esc(value)}</textarea>`;
    } else if (f.type === 'radio') {
      input = `<div style="display:flex;flex-direction:column;gap:0.4rem">${(f.options || []).map((o: string) => `
        <label style="display:flex;align-items:center;gap:0.5rem;font-weight:500;font-size:0.92rem;cursor:pointer">
          <input type="radio" name="rg-${esc(f.id)}" data-id="${esc(f.id)}" value="${esc(o)}" ${value === o ? 'checked' : ''}> ${esc(o)}
        </label>`).join('')}</div>`;
    } else if (f.type === 'file' || f.type === 'files') {
      input = `<div>
        <input type="file" id="fld-${esc(f.id)}" data-id="${esc(f.id)}" accept="${esc(f.accept || '')}" ${f.type === 'files' ? 'multiple' : ''} onchange="handleIntakeFile(event,'${esc(f.id)}',${f.type === 'files'})">
        <div id="prev-${esc(f.id)}" style="margin-top:0.4rem;font-size:0.78rem;color:var(--green)">${value ? '\u2713 Uploaded' : ''}</div>
      </div>`;
    } else {
      input = `<input type="${esc(f.type || 'text')}" id="fld-${esc(f.id)}" data-id="${esc(f.id)}" value="${esc(value)}" placeholder="${esc(f.placeholder || '')}">`;
    }
    return `<div class="form-row">
      <label>${esc(f.label)} ${required}</label>
      ${hint}
      ${input}
    </div>`;
  };

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Intake \u2014 ${esc(c.business_name)}</title>
<style>${sharedStyles}</style>
</head><body>

<div class="topbar">
  <div class="topbar-inner">
    <a href="/client/${esc(c.client_token)}" class="btn btn-secondary" style="padding:0.4rem 0.9rem;font-size:0.85rem">\u2190 Portal</a>
    <div style="margin-left:auto" class="meta">${esc(c.business_name)} \u00b7 Intake form</div>
  </div>
</div>

<div class="wrap" style="max-width:780px">

  <div class="hero-card">
    <h1>Tell us what to build for ${esc(c.business_name)}</h1>
    <p>Logo, brand details, content, and a few specifics per module. About 10\u201320 minutes. ${intake.submitted_at ? '\u2014 already submitted; you can edit and re-submit if anything changed.' : ''}</p>
  </div>

  <div class="section">
    <form id="intake-form" onsubmit="return false">
      ${schema.map(fieldHtml).join('')}
      <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);display:flex;gap:0.6rem;flex-wrap:wrap;align-items:center">
        <button type="button" class="btn btn-primary" id="submit-btn" onclick="submitIntake()">\u{1F4E5} Submit intake</button>
        <span id="intake-status" style="font-size:0.85rem"></span>
      </div>
    </form>
  </div>

</div>

<footer>Penny Wise I.T \u2014 pennywiseit.com.au</footer>

<div id="toast" class="toast"></div>

<script>
let UPLOADED_FILES = ${JSON.stringify(responses)};

function toast(msg, color) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color || 'var(--text)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

async function handleIntakeFile(e, fieldId, multiple) {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;
  const prev = document.getElementById('prev-' + fieldId);
  prev.textContent = 'Uploading...';
  prev.style.color = 'var(--soft)';
  const urls = [];
  for (const f of files) {
    const fd = new FormData();
    fd.append('file', f);
    try {
      const res = await fetch('${VALIDATOR_URL}/api/public/client/${esc(c.client_token)}/intake/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      urls.push(data.url);
    } catch (err) {
      prev.textContent = 'Upload failed: ' + err.message;
      prev.style.color = 'var(--red)';
      return;
    }
  }
  UPLOADED_FILES[fieldId] = multiple ? urls : urls[0];
  prev.innerHTML = '\u2713 ' + urls.length + ' file' + (urls.length > 1 ? 's' : '') + ' uploaded';
  prev.style.color = 'var(--green)';
}

async function submitIntake() {
  const responses = { ...UPLOADED_FILES };
  document.querySelectorAll('[data-id]').forEach(el => {
    const id = el.dataset.id;
    if (el.type === 'radio') {
      if (el.checked) responses[id] = el.value;
    } else if (el.type === 'file') {
      // already handled by upload
    } else {
      responses[id] = el.value;
    }
  });
  const status = document.getElementById('intake-status');
  const btn = document.getElementById('submit-btn');
  btn.disabled = true; btn.textContent = 'Submitting...';
  status.textContent = '';
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/client/${esc(c.client_token)}/intake/${esc(intake.id)}/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    status.innerHTML = '\u2713 Submitted. Steve will start building. You can close this tab.';
    status.style.color = 'var(--green)';
    setTimeout(() => { window.location.href = '/client/${esc(c.client_token)}'; }, 1800);
  } catch (e) {
    status.textContent = e.message;
    status.style.color = 'var(--red)';
    btn.disabled = false; btn.textContent = '\u{1F4E5} Submit intake';
  }
}
<\/script>

</body></html>`;
}

// ───── WALKTHROUGH page ─────
export function renderWalkthroughPage(data: { customer: any; project: any }): string {
  const c = data.customer;
  const p = data.project;
  const url = p.walkthrough_url || '';
  // Extract YouTube/Loom embed
  let embedHtml = '';
  if (url.includes('loom.com/share/')) {
    const id = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)?.[1];
    if (id) embedHtml = `<iframe src="https://www.loom.com/embed/${id}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9"></iframe>`;
  } else if (url.includes('youtu')) {
    const id = url.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]+)/)?.[1];
    if (id) embedHtml = `<iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9"></iframe>`;
  } else if (url) {
    embedHtml = `<video src="${esc(url)}" controls style="width:100%;aspect-ratio:16/9;background:#000"></video>`;
  }
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Walkthrough \u2014 ${esc(c.business_name)}</title>
<style>${sharedStyles}</style>
</head><body>

<div class="topbar">
  <div class="topbar-inner">
    <a href="/client/${esc(c.client_token)}" class="btn btn-secondary" style="padding:0.4rem 0.9rem;font-size:0.85rem">\u2190 Portal</a>
    <div style="margin-left:auto" class="meta">${esc(c.business_name)} \u00b7 Walkthrough</div>
  </div>
</div>

<div class="wrap" style="max-width:880px">

  <div class="hero-card">
    <h1>Your app walkthrough</h1>
    <p>Watch the video, then approve or list the changes you want. ${p.walkthrough_approved_at ? 'Already approved \u2014 final invoice has been issued.' : 'You have 5 business days.'}</p>
  </div>

  <div class="section">
    ${embedHtml || `<p style="color:var(--soft)">Walkthrough video link: <a href="${esc(url)}" target="_blank">${esc(url)}</a></p>`}
  </div>

  ${p.walkthrough_approved_at ? `
    <div class="section" style="background:rgba(52,211,153,0.05);border-color:rgba(52,211,153,0.3)">
      <h2 style="color:var(--green)">\u2713 Approved on ${new Date(p.walkthrough_approved_at + 'Z').toLocaleString('en-AU')}</h2>
      <p class="desc">The final invoice has been issued. As soon as it clears, your app goes live.</p>
      <a href="/client/${esc(c.client_token)}" class="btn btn-primary">\u2190 Back to portal</a>
    </div>
  ` : `
    <div class="section">
      <h2>\u2705 Looks good, let\u2019s go live</h2>
      <p class="desc">Click below to approve. The final invoice (50%) will be issued. Once paid, your app launches.</p>
      <button class="btn btn-green" id="approve-btn" onclick="approveWalkthrough()">\u2713 Approve walkthrough \u2014 issue final invoice</button>
      <div id="wt-status" style="margin-top:0.85rem;font-size:0.88rem"></div>

      <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border)">
        <h3 style="font-size:0.95rem;margin-bottom:0.4rem">Want a change first?</h3>
        <p style="font-size:0.85rem;color:var(--soft);margin-bottom:0.7rem">Reply to the email Steve sent with the walkthrough, or call him directly. Reasonable revisions are included; major scope changes may incur additional cost.</p>
      </div>
    </div>
  `}

</div>

<footer>Penny Wise I.T \u2014 pennywiseit.com.au</footer>

<script>
async function approveWalkthrough() {
  const btn = document.getElementById('approve-btn');
  const status = document.getElementById('wt-status');
  btn.disabled = true; btn.textContent = 'Approving...';
  try {
    const res = await fetch('${VALIDATOR_URL}/api/public/client/${esc(c.client_token)}/project/${esc(p.id)}/walkthrough/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    status.innerHTML = '\u2713 Approved. Final invoice ' + data.final_invoice + ' has been issued.';
    status.style.color = 'var(--green)';
    setTimeout(() => { window.location.href = '/client/${esc(c.client_token)}'; }, 1800);
  } catch (e) {
    status.textContent = e.message; status.style.color = 'var(--red)';
    btn.disabled = false; btn.textContent = '\u2713 Approve walkthrough';
  }
}
<\/script>

</body></html>`;
}
