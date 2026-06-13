const express = require('express');
const fetch = require('node-fetch');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_SUPPORT_API_URL = 'https://support.pennywiseit.com.au/api';
const DEFAULT_SUPPORT_PORTAL_URL = 'https://support.pennywiseit.com.au';

function supportConfig() {
  return {
    apiUrl: (process.env.BUG_SQUASHER_API_URL || DEFAULT_SUPPORT_API_URL).replace(/\/+$/, ''),
    portalUrl: (process.env.BUG_SQUASHER_PORTAL_BASE_URL || DEFAULT_SUPPORT_PORTAL_URL).replace(/\/+$/, ''),
    adminToken: process.env.BUG_SQUASHER_ADMIN_TOKEN || ''
  };
}

function ensureConfigured(res, config) {
  if (!config.adminToken) {
    res.status(503).json({
      message: 'Bug Squasher admin token is not configured on this backend.',
      missing: ['BUG_SQUASHER_ADMIN_TOKEN']
    });
    return false;
  }
  return true;
}

async function supportRequest(path, options = {}) {
  const config = supportConfig();
  const response = await fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      'x-admin-token': config.adminToken,
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch (error) {
    body = { message: text || 'Support admin API returned a non-JSON response.' };
  }

  if (!response.ok) {
    const error = new Error(body?.message || body?.error || `Support admin API returned ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

function summarizeIssues(issues) {
  const open = issues.filter((issue) => issue.status !== 'Closed');
  return {
    total: issues.length,
    open: open.length,
    priority: open.filter((issue) => ['critical', 'high'].includes(issue.severity)).length,
    needsInfo: open.filter((issue) => issue.status === 'Needs info').length,
    easyFixes: open.filter((issue) => issue.triage?.easyFixCandidate).length
  };
}

function portalUrl(client, config = supportConfig()) {
  return client?.slug ? `${config.portalUrl}/c/${client.slug}` : config.portalUrl;
}

router.use(auth, adminOnly);

router.get('/summary', async (req, res) => {
  const config = supportConfig();
  if (!ensureConfigured(res, config)) return;

  try {
    const [readiness, issuesBody, clientsBody] = await Promise.all([
      supportRequest('/readiness').catch((error) => ({ ok: false, error: error.message })),
      supportRequest('/issues'),
      supportRequest('/clients')
    ]);

    const issues = issuesBody.issues || [];
    const clients = clientsBody.clients || [];

    res.json({
      readiness,
      stats: {
        ...summarizeIssues(issues),
        clients: clients.length
      },
      portalBaseUrl: config.portalUrl,
      issues,
      clients: clients.map((client) => ({
        ...client,
        portalUrl: portalUrl(client, config)
      }))
    });
  } catch (error) {
    res.status(error.status || 502).json(error.body || { message: error.message });
  }
});

router.get('/issues', async (req, res) => {
  const config = supportConfig();
  if (!ensureConfigured(res, config)) return;

  try {
    const query = req.query.client ? `?client=${encodeURIComponent(req.query.client)}` : '';
    const body = await supportRequest(`/issues${query}`);
    res.json(body);
  } catch (error) {
    res.status(error.status || 502).json(error.body || { message: error.message });
  }
});

router.patch('/issues/:id', async (req, res) => {
  const config = supportConfig();
  if (!ensureConfigured(res, config)) return;

  try {
    const body = await supportRequest(`/issues/${encodeURIComponent(req.params.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: req.body.status,
        note: req.body.note
      })
    });
    res.json(body);
  } catch (error) {
    res.status(error.status || 502).json(error.body || { message: error.message });
  }
});

router.get('/clients', async (req, res) => {
  const config = supportConfig();
  if (!ensureConfigured(res, config)) return;

  try {
    const body = await supportRequest('/clients');
    res.json({
      clients: (body.clients || []).map((client) => ({
        ...client,
        portalUrl: portalUrl(client, config)
      }))
    });
  } catch (error) {
    res.status(error.status || 502).json(error.body || { message: error.message });
  }
});

router.post('/clients', async (req, res) => {
  const config = supportConfig();
  if (!ensureConfigured(res, config)) return;

  try {
    const body = await supportRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(req.body)
    });
    res.status(201).json({
      ...body,
      client: body.client ? { ...body.client, portalUrl: portalUrl(body.client, config) } : body.client
    });
  } catch (error) {
    res.status(error.status || 502).json(error.body || { message: error.message });
  }
});

module.exports = router;
