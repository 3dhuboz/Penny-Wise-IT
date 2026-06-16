// Dashboard HTML renderer for the validation system

export function renderDashboard(apps: any[], recentRuns: any[]): string {
  const passing = apps.filter((a) => a.validation_status === 'passing').length;
  const failing = apps.filter((a) => a.validation_status === 'failing').length;
  const unknown = apps.filter((a) => a.validation_status === 'unknown' || !a.validation_status).length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PennyWiseIT — App Validator Dashboard</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #0a0a0f; color: #e0e0e0; }
  .header { background: linear-gradient(135deg, #1a1a2e, #0f3460); padding: 1.5rem 2rem; border-bottom: 2px solid #7c3aed; display: flex; justify-content: space-between; align-items: center; }
  .header h1 { font-size: 1.5rem; color: #fff; }
  .header .actions { display: flex; gap: 0.5rem; }
  .btn { padding: 0.5rem 1rem; border-radius: 6px; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 600; }
  .btn-primary { background: #7c3aed; color: #fff; }
  .btn-primary:hover { background: #6d28d9; }
  .btn-outline { background: transparent; color: #a78bfa; border: 1px solid #374151; }

  .container { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }

  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .stat { background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 1rem; text-align: center; }
  .stat-num { font-size: 2rem; font-weight: 700; }
  .stat-label { font-size: 0.8rem; color: #6b7280; margin-top: 0.25rem; }
  .green { color: #10b981; }
  .red { color: #ef4444; }
  .yellow { color: #f59e0b; }
  .gray { color: #6b7280; }

  .app-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .app-card { background: #111827; border: 1px solid #1f2937; border-radius: 10px; padding: 1.25rem; position: relative; transition: border-color 0.2s; }
  .app-card:hover { border-color: #374151; }
  .app-card.passing { border-left: 4px solid #10b981; }
  .app-card.failing { border-left: 4px solid #ef4444; }
  .app-card.unknown { border-left: 4px solid #6b7280; }
  .app-card.partial { border-left: 4px solid #f59e0b; }

  .app-name { font-size: 1.1rem; font-weight: 600; color: #fff; }
  .app-meta { font-size: 0.8rem; color: #6b7280; margin-top: 0.25rem; }
  .app-domain { font-size: 0.8rem; color: #60a5fa; }
  .app-status { position: absolute; top: 1.25rem; right: 1.25rem; }
  .status-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .status-dot.passing { background: #10b981; box-shadow: 0 0 8px #10b98155; }
  .status-dot.failing { background: #ef4444; box-shadow: 0 0 8px #ef444455; }
  .status-dot.unknown { background: #6b7280; }
  .status-dot.partial { background: #f59e0b; box-shadow: 0 0 8px #f59e0b55; }

  .app-features { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-top: 0.75rem; }
  .feature-tag { background: #1f2937; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; color: #9ca3af; }

  .app-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #1f2937; }
  .app-validated { font-size: 0.75rem; color: #4b5563; }
  .validate-btn { background: #1f2937; color: #a78bfa; border: 1px solid #374151; padding: 4px 12px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }
  .validate-btn:hover { background: #374151; }

  .section-title { font-size: 1.2rem; color: #a78bfa; margin-bottom: 1rem; }

  .run-table { width: 100%; border-collapse: collapse; }
  .run-table th { background: #1f2937; color: #9ca3af; text-align: left; padding: 0.5rem 0.75rem; font-size: 0.75rem; text-transform: uppercase; }
  .run-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #1f2937; font-size: 0.85rem; }
  .run-table tr:hover td { background: #111827; }

  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
  .badge-pass { background: #064e3b; color: #6ee7b7; }
  .badge-fail { background: #7f1d1d; color: #fca5a5; }
  .badge-partial { background: #78350f; color: #fde68a; }

  /* Modal for validation results */
  .modal-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 100; justify-content: center; align-items: center; }
  .modal-overlay.active { display: flex; }
  .modal { background: #111827; border: 1px solid #374151; border-radius: 12px; width: 90%; max-width: 700px; max-height: 80vh; overflow-y: auto; padding: 1.5rem; }
  .modal h3 { color: #fff; margin-bottom: 1rem; }
  .modal .close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #6b7280; font-size: 1.5rem; cursor: pointer; }

  .check-item { padding: 0.75rem; border-bottom: 1px solid #1f2937; display: flex; align-items: flex-start; gap: 0.75rem; }
  .check-icon { font-size: 1rem; flex-shrink: 0; margin-top: 2px; }
  .check-details { flex: 1; }
  .check-name { font-weight: 600; font-size: 0.85rem; }
  .check-msg { font-size: 0.8rem; color: #9ca3af; margin-top: 2px; }
  .check-cat { font-size: 0.7rem; color: #4b5563; text-transform: uppercase; }

  @media (max-width: 768px) { .stats { grid-template-columns: repeat(2, 1fr); } .app-grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>

<div class="header">
  <h1>PennyWiseIT Validator</h1>
  <div class="actions">
    <button class="btn btn-outline" onclick="location.reload()">Refresh</button>
    <button class="btn btn-primary" onclick="validateAll()">Validate All Apps</button>
  </div>
</div>

<div class="container">

  <div class="stats">
    <div class="stat"><div class="stat-num">${apps.length}</div><div class="stat-label">Total Apps</div></div>
    <div class="stat"><div class="stat-num green">${passing}</div><div class="stat-label">Passing</div></div>
    <div class="stat"><div class="stat-num red">${failing}</div><div class="stat-label">Failing</div></div>
    <div class="stat"><div class="stat-num gray">${unknown}</div><div class="stat-label">Not Tested</div></div>
  </div>

  <h2 class="section-title">Registered Apps</h2>
  <div class="app-grid">
    ${apps.length === 0
      ? '<div style="color:#6b7280;padding:2rem;text-align:center;grid-column:1/-1;">No apps registered yet. Use the API to register your first app.</div>'
      : apps.map((a: any) => `
      <div class="app-card ${a.validation_status || 'unknown'}">
        <div class="app-status"><span class="status-dot ${a.validation_status || 'unknown'}"></span></div>
        <div class="app-name" style="color:${a.brand_color || '#fff'}">${esc(a.brand_name)}</div>
        <div class="app-meta">${esc(a.template)} · ${esc(a.worker_name)}</div>
        ${a.domain ? `<div class="app-domain">${esc(a.domain)}</div>` : ''}
        <div class="app-features">
          ${a.clerk_enabled ? '<span class="feature-tag">Clerk</span>' : ''}
          ${a.payment_provider ? `<span class="feature-tag">${esc(a.payment_provider)}</span>` : ''}
          ${a.resend_enabled ? '<span class="feature-tag">Resend</span>' : ''}
          ${a.sms_enabled ? '<span class="feature-tag">SMS</span>' : ''}
          ${a.d1_database_id ? '<span class="feature-tag">D1</span>' : ''}
          ${a.r2_bucket_name ? '<span class="feature-tag">R2</span>' : ''}
        </div>
        <div class="app-footer">
          <span class="app-validated">${a.last_validated_at ? 'Last checked: ' + a.last_validated_at : 'Never validated'}</span>
          <div style="display:flex;gap:0.25rem;">
            <button class="validate-btn" onclick="openSecrets('${esc(a.id)}','${esc(a.brand_name)}','${esc(a.clerk_enabled)}','${esc(a.payment_provider)}','${esc(a.resend_enabled)}')">🔑 Keys</button>
            <button class="validate-btn" onclick="validateApp('${esc(a.id)}')">Run Checks</button>
          </div>
        </div>
      </div>
    `).join('')}
  </div>

  <h2 class="section-title">Recent Validation Runs</h2>
  <table class="run-table">
    <thead>
      <tr><th>App</th><th>Status</th><th>Checks</th><th>Triggered</th><th>Duration</th><th>When</th></tr>
    </thead>
    <tbody>
      ${recentRuns.length === 0
        ? '<tr><td colspan="6" style="color:#6b7280;text-align:center;padding:1rem;">No validation runs yet</td></tr>'
        : recentRuns.map((r: any) => `
        <tr onclick="viewRun(${r.id})" style="cursor:pointer;">
          <td><strong style="color:${r.brand_color || '#fff'}">${esc(r.brand_name || r.app_name)}</strong></td>
          <td><span class="badge badge-${r.status === 'passing' ? 'pass' : r.status === 'failing' ? 'fail' : 'partial'}">${r.status}</span></td>
          <td>${r.passed_checks}/${r.total_checks} passed</td>
          <td style="color:#6b7280">${r.triggered_by}</td>
          <td style="color:#6b7280">${r.duration_ms}ms</td>
          <td style="color:#6b7280">${r.created_at}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</div>

<div class="modal-overlay" id="modal">
  <div class="modal" id="modal-content">
    <h3 id="modal-title">Validation Results</h3>
    <div id="modal-body">Loading...</div>
    <button class="btn btn-outline" style="margin-top:1rem;" onclick="closeModal()">Close</button>
  </div>
</div>

<script>
const API_KEY = localStorage.getItem('pw_validator_key') || prompt('Enter your validator API key:');
if (API_KEY) localStorage.setItem('pw_validator_key', API_KEY);

async function apiFetch(path, opts = {}) {
  return fetch(path, { ...opts, headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json', ...opts.headers } });
}

async function validateApp(appId) {
  const btn = event.target;
  btn.textContent = 'Running...';
  btn.disabled = true;
  try {
    const res = await apiFetch('/api/validate/' + appId, { method: 'POST', body: '{}' });
    const data = await res.json();
    showResults(data);
  } catch (e) { alert('Validation failed: ' + e.message); }
  finally { btn.textContent = 'Run Checks'; btn.disabled = false; }
}

async function validateAll() {
  const btn = event.target;
  btn.textContent = 'Running...';
  btn.disabled = true;
  try {
    const res = await apiFetch('/api/validate-all', { method: 'POST' });
    const data = await res.json();
    alert('Validated ' + data.results.length + ' apps. Refreshing...');
    location.reload();
  } catch (e) { alert('Failed: ' + e.message); }
  finally { btn.textContent = 'Validate All Apps'; btn.disabled = false; }
}

async function viewRun(runId) {
  const res = await apiFetch('/api/validate/run/' + runId);
  const data = await res.json();
  showRunDetails(data);
}

function showResults(data) {
  document.getElementById('modal-title').textContent = data.app_name + ' — Validation Results';
  const icons = { pass: '✅', fail: '❌', warn: '⚠️', skip: '⏭️' };
  document.getElementById('modal-body').innerHTML = \`
    <div style="margin-bottom:1rem;font-size:0.9rem;">
      <span class="badge badge-\${data.status === 'passing' ? 'pass' : data.status === 'failing' ? 'fail' : 'partial'}">\${data.status}</span>
      &nbsp; \${data.summary.passed}/\${data.summary.total} passed &nbsp; (\${data.duration_ms}ms)
    </div>
    \${data.checks.map(c => \`
      <div class="check-item">
        <span class="check-icon">\${icons[c.status]}</span>
        <div class="check-details">
          <div class="check-cat">\${c.category}</div>
          <div class="check-name">\${c.check_name}</div>
          <div class="check-msg">\${c.message}</div>
        </div>
      </div>
    \`).join('')}
  \`;
  document.getElementById('modal').classList.add('active');
}

function showRunDetails(data) {
  const run = data.run;
  const checks = data.checks || [];
  document.getElementById('modal-title').textContent = (run.brand_name || run.app_name) + ' — Run #' + run.id;
  const icons = { pass: '✅', fail: '❌', warn: '⚠️', skip: '⏭️' };
  document.getElementById('modal-body').innerHTML = \`
    <div style="margin-bottom:1rem;font-size:0.9rem;">
      <span class="badge badge-\${run.status === 'passing' ? 'pass' : run.status === 'failing' ? 'fail' : 'partial'}">\${run.status}</span>
      &nbsp; \${run.passed_checks}/\${run.total_checks} passed &nbsp; (\${run.duration_ms}ms) &nbsp; \${run.created_at}
    </div>
    \${checks.map(c => \`
      <div class="check-item">
        <span class="check-icon">\${icons[c.status]}</span>
        <div class="check-details">
          <div class="check-cat">\${c.category}</div>
          <div class="check-name">\${c.check_name}</div>
          <div class="check-msg">\${c.message}</div>
        </div>
      </div>
    \`).join('')}
  \`;
  document.getElementById('modal').classList.add('active');
}

function closeModal() { document.getElementById('modal').classList.remove('active'); }
document.getElementById('modal').addEventListener('click', (e) => { if (e.target === document.getElementById('modal')) closeModal(); });

// Secrets management
async function openSecrets(appId, appName, clerkEnabled, paymentProvider, resendEnabled) {
  document.getElementById('modal-title').textContent = appName + ' — API Keys';

  // Load existing secrets
  const res = await apiFetch('/api/apps/' + appId + '/secrets');
  const data = await res.json();
  const existing = {};
  (data.secrets || []).forEach(s => { existing[s.secret_name] = true; });

  let fields = '';

  if (clerkEnabled === '1') {
    fields += secretField('clerk_secret_key', 'Clerk Secret Key', 'sk_live_...', existing.clerk_secret_key);
  }
  if (resendEnabled === '1') {
    fields += secretField('resend_api_key', 'Resend API Key', 're_...', existing.resend_api_key);
  }
  if (paymentProvider === 'stripe') {
    fields += secretField('stripe_secret_key', 'Stripe Secret Key', 'sk_live_... or sk_test_...', existing.stripe_secret_key);
  } else if (paymentProvider === 'square') {
    fields += secretField('square_access_token', 'Square Access Token', 'EAAAl...', existing.square_access_token);
  } else if (paymentProvider === 'paypal') {
    fields += secretField('paypal_client_id', 'PayPal Client ID', 'AX...', existing.paypal_client_id);
    fields += secretField('paypal_client_secret', 'PayPal Client Secret', 'EL...', existing.paypal_client_secret);
  }

  if (!fields) fields = '<div style="color:#6b7280;padding:1rem;">No configurable API keys for this app.</div>';

  document.getElementById('modal-body').innerHTML = \`
    <form id="secrets-form" onsubmit="saveSecrets(event, '\${appId}')">
      \${fields}
      <div style="display:flex;gap:0.5rem;margin-top:1rem;">
        <button type="submit" class="btn btn-primary">Save Keys</button>
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
      </div>
    </form>
  \`;
  document.getElementById('modal').classList.add('active');
}

function secretField(name, label, placeholder, exists) {
  const dot = exists ? '🟢' : '🔴';
  return \`
    <div style="margin-bottom:0.75rem;">
      <label style="display:block;font-size:0.8rem;color:#9ca3af;margin-bottom:0.25rem;">\${dot} \${label}</label>
      <input name="\${name}" type="password" placeholder="\${exists ? '••• stored — leave blank to keep' : placeholder}"
        style="width:100%;padding:0.5rem;background:#1f2937;border:1px solid #374151;border-radius:6px;color:#e0e0e0;font-size:0.85rem;" />
    </div>
  \`;
}

async function saveSecrets(e, appId) {
  e.preventDefault();
  const form = new FormData(e.target);
  const secrets = {};
  for (const [k, v] of form.entries()) {
    if (v) secrets[k] = v;
  }
  if (Object.keys(secrets).length === 0) {
    alert('No new keys entered.');
    return;
  }
  const res = await apiFetch('/api/apps/' + appId + '/secrets/bulk', {
    method: 'POST',
    body: JSON.stringify({ secrets })
  });
  const data = await res.json();
  if (data.success) {
    alert('Saved ' + data.count + ' key(s). Run validation to test them.');
    closeModal();
  } else {
    alert('Error: ' + (data.error || 'unknown'));
  }
}
</script>
</body>
</html>`;
}

function esc(str: any): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
