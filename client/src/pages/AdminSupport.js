import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink,
  LifeBuoy,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import './Admin.css';

const STATUS_OPTIONS = ['New', 'Needs info', 'Fixing', 'Deployed', 'Closed'];

const emptyClientForm = {
  displayName: '',
  slug: '',
  shortName: '',
  installTitle: '',
  primaryContactName: '',
  primaryContactEmail: '',
  primaryContactPhone: '',
  preferredContact: 'email',
  themeColor: '#0f766e',
  emergencySmsEnabled: true,
  sites: [{ label: 'Main website', url: '', isDefault: true }]
};

function AdminSupport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [savingStatus, setSavingStatus] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientForm, setClientForm] = useState(emptyClientForm);
  const [savingClient, setSavingClient] = useState(false);

  const loadSupport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/support-admin/summary');
      setData(res.data);
      setSelectedIssue((current) => {
        if (!current) return res.data.issues?.[0] || null;
        return res.data.issues?.find((issue) => issue.id === current.id) || res.data.issues?.[0] || null;
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load Bug Squasher admin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSupport();
  }, [loadSupport]);

  const filteredIssues = useMemo(() => {
    const issues = data?.issues || [];
    const query = search.trim().toLowerCase();
    if (!query) return issues;
    return issues.filter((issue) =>
      [
        issue.publicId,
        issue.title,
        issue.category,
        issue.clientDisplayName,
        issue.businessName,
        issue.clientName,
        issue.status,
        issue.severity
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [data, search]);

  const activeClients = data?.clients || [];
  const stats = data?.stats || {};

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  const updateIssueStatus = async (issue, status) => {
    if (!issue || issue.status === status) return;
    setSavingStatus(issue.id);
    try {
      const res = await api.patch(`/support-admin/issues/${encodeURIComponent(issue.id)}`, { status });
      const updated = res.data.issue;
      setData((current) => ({
        ...current,
        issues: (current?.issues || []).map((item) => (item.id === updated.id ? updated : item))
      }));
      setSelectedIssue(updated);
      toast.success(`${updated.publicId} is now ${updated.status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
    } finally {
      setSavingStatus('');
    }
  };

  const updateClientSite = (patch) => {
    setClientForm((current) => ({
      ...current,
      sites: [{ ...(current.sites?.[0] || { label: 'Main website', isDefault: true }), ...patch }]
    }));
  };

  const handleClientName = (value) => {
    setClientForm((current) => ({
      ...current,
      displayName: value,
      slug: current.slug || slugify(value),
      shortName: current.shortName || value.slice(0, 24),
      installTitle: current.installTitle || `${value.slice(0, 24)} Support`
    }));
  };

  const createClient = async (event) => {
    event.preventDefault();
    if (!clientForm.displayName || !clientForm.slug) {
      toast.error('Client name and slug are required');
      return;
    }

    setSavingClient(true);
    try {
      const payload = {
        ...clientForm,
        sites: clientForm.sites?.filter((site) => site.label) || []
      };
      await api.post('/support-admin/clients', payload);
      toast.success('Client support portal created');
      setClientForm(emptyClientForm);
      setShowClientForm(false);
      loadSupport();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create client portal');
    } finally {
      setSavingClient(false);
    }
  };

  if (loading && !data) {
    return <div className="page-loading">Loading support admin...</div>;
  }

  return (
    <div className="admin-page">
      <div className="container support-admin" style={{ padding: '2rem 1.5rem' }}>
        <Link to="/admin" className="back-link"><ArrowLeft size={16} /> Back to Admin</Link>

        <div className="admin-header">
          <div>
            <h1><LifeBuoy size={24} /> Bug Squasher Admin</h1>
            <p>Manage client portals, support queue status, and fast issue follow-up.</p>
          </div>
          <div className="support-admin-actions">
            <a href={data?.portalBaseUrl || 'https://support.pennywiseit.com.au'} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <ExternalLink size={15} /> Portal
            </a>
            <button onClick={loadSupport} className="btn btn-secondary" disabled={loading}>
              {loading ? <Loader2 size={15} className="spin" /> : <RefreshCw size={15} />} Refresh
            </button>
            <button onClick={() => setShowClientForm(true)} className="btn btn-primary">
              <Plus size={15} /> Client Portal
            </button>
          </div>
        </div>

        {error && (
          <div className="support-alert">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {data && (
          <>
            <div className="admin-stats">
              <StatCard icon={<LifeBuoy size={24} />} label="Open" value={stats.open || 0} color="#f59e0b" />
              <StatCard icon={<Zap size={24} />} label="Priority" value={stats.priority || 0} color="#ef4444" />
              <StatCard icon={<AlertTriangle size={24} />} label="Needs Info" value={stats.needsInfo || 0} color="#06b6d4" />
              <StatCard icon={<ShieldCheck size={24} />} label="Clients" value={stats.clients || 0} color="#10b981" />
            </div>

            <div className="support-readiness card">
              <div>
                {data.readiness?.ok ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                <strong>{data.readiness?.ok ? 'Support system ready' : 'Support system needs attention'}</strong>
              </div>
              <span>{data.portalBaseUrl}</span>
            </div>

            <div className="support-layout">
              <section className="support-column">
                <div className="support-section-head">
                  <h2>Issue Queue</h2>
                  <label>
                    <Search size={15} />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reports" />
                  </label>
                </div>

                <div className="support-issue-list">
                  {filteredIssues.map((issue) => (
                    <button
                      key={issue.id}
                      type="button"
                      className={selectedIssue?.id === issue.id ? 'support-issue-card active' : 'support-issue-card'}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div>
                        <strong>{issue.publicId}</strong>
                        <span>{issue.clientDisplayName || issue.businessName || issue.clientName}</span>
                      </div>
                      <p>{issue.title}</p>
                      <div className="support-card-meta">
                        <Badge tone={issue.severity}>{issue.severity}</Badge>
                        <Badge tone={issue.status}>{issue.status}</Badge>
                        <small>{formatDate(issue.updatedAt)}</small>
                      </div>
                    </button>
                  ))}
                  {!filteredIssues.length && <p className="support-empty">No matching Bug Squasher issues.</p>}
                </div>
              </section>

              <aside className="support-detail card">
                {selectedIssue ? (
                  <>
                    <div className="support-detail-head">
                      <div>
                        <strong>{selectedIssue.publicId}</strong>
                        <h2>{selectedIssue.title}</h2>
                        <span>{selectedIssue.clientDisplayName || selectedIssue.businessName || selectedIssue.clientName}</span>
                      </div>
                      <Badge tone={selectedIssue.severity}>{selectedIssue.severity}</Badge>
                    </div>

                    <div className="support-detail-grid">
                      <Info label="Status" value={selectedIssue.status} />
                      <Info label="Category" value={selectedIssue.category} />
                      <Info label="Site" value={selectedIssue.siteLabel} />
                      <Info label="Updated" value={formatDate(selectedIssue.updatedAt)} />
                    </div>

                    <label className="support-status-control">
                      <span>Status</span>
                      <select
                        value={selectedIssue.status}
                        disabled={savingStatus === selectedIssue.id}
                        onChange={(event) => updateIssueStatus(selectedIssue, event.target.value)}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </label>

                    <div className="support-detail-copy">
                      <strong>Customer note</strong>
                      <p>{selectedIssue.triage?.clientMessage || selectedIssue.triage?.summary || selectedIssue.description}</p>
                    </div>

                    <div className="support-events">
                      <strong>Timeline</strong>
                      {(selectedIssue.events || []).map((event) => (
                        <div key={event.id} className="support-event">
                          <span>{eventLabel(event.eventType)}</span>
                          <p>{event.message}</p>
                          <small>{formatDate(event.createdAt)}</small>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="support-empty">Select an issue to inspect it.</p>
                )}
              </aside>
            </div>

            <section className="support-clients card">
              <div className="support-section-head">
                <h2>Client Portals</h2>
                <span>{activeClients.length} configured</span>
              </div>
              <div className="support-client-grid">
                {activeClients.map((client) => (
                  <article key={client.id} className="support-client-card">
                    <div>
                      <Smartphone size={18} />
                      <strong>{client.displayName}</strong>
                      <span>{client.installTitle}</span>
                    </div>
                    <div className="support-client-actions">
                      <button type="button" onClick={() => copyText(client.portalUrl, 'Portal link')}>
                        <Copy size={13} /> Copy
                      </button>
                      <a href={client.portalUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={13} /> Open
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {showClientForm && (
          <div className="modal-overlay" onClick={() => setShowClientForm(false)}>
            <div className="modal-content support-modal" onClick={(event) => event.stopPropagation()}>
              <h2>Create Bug Squasher Client Portal</h2>
              <form onSubmit={createClient}>
                <div className="support-form-grid">
                  <label>
                    <span>Client name *</span>
                    <input required value={clientForm.displayName} onChange={(event) => handleClientName(event.target.value)} />
                  </label>
                  <label>
                    <span>Portal slug *</span>
                    <input required value={clientForm.slug} onChange={(event) => setClientForm((current) => ({ ...current, slug: slugify(event.target.value) }))} />
                  </label>
                  <label>
                    <span>Home-screen name</span>
                    <input value={clientForm.installTitle} onChange={(event) => setClientForm((current) => ({ ...current, installTitle: event.target.value }))} />
                  </label>
                  <label>
                    <span>Preferred contact</span>
                    <select value={clientForm.preferredContact} onChange={(event) => setClientForm((current) => ({ ...current, preferredContact: event.target.value }))}>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="phone">Phone</option>
                      <option value="facebook">Facebook</option>
                      <option value="any">Best available</option>
                    </select>
                  </label>
                  <label>
                    <span>Contact name</span>
                    <input value={clientForm.primaryContactName} onChange={(event) => setClientForm((current) => ({ ...current, primaryContactName: event.target.value }))} />
                  </label>
                  <label>
                    <span>Contact email</span>
                    <input type="email" value={clientForm.primaryContactEmail} onChange={(event) => setClientForm((current) => ({ ...current, primaryContactEmail: event.target.value }))} />
                  </label>
                  <label>
                    <span>Contact phone</span>
                    <input value={clientForm.primaryContactPhone} onChange={(event) => setClientForm((current) => ({ ...current, primaryContactPhone: event.target.value }))} />
                  </label>
                  <label>
                    <span>Theme colour</span>
                    <input type="color" value={clientForm.themeColor} onChange={(event) => setClientForm((current) => ({ ...current, themeColor: event.target.value }))} />
                  </label>
                  <label>
                    <span>Main site label</span>
                    <input value={clientForm.sites[0]?.label || ''} onChange={(event) => updateClientSite({ label: event.target.value })} />
                  </label>
                  <label>
                    <span>Main site URL</span>
                    <input value={clientForm.sites[0]?.url || ''} onChange={(event) => updateClientSite({ url: event.target.value })} />
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowClientForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={savingClient}>
                    {savingClient ? <Loader2 size={14} className="spin" /> : <Plus size={14} />} Create Portal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card card">
      <div className="stat-icon" style={{ background: `${color}1a`, color }}>{icon}</div>
      <div className="stat-info"><strong>{value}</strong><span>{label}</span></div>
    </div>
  );
}

function Badge({ tone, children }) {
  return <span className={`support-badge ${badgeClass(tone)}`}>{children}</span>;
}

function Info({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </div>
  );
}

function badgeClass(value = '') {
  return String(value).toLowerCase().replace(/\s+/g, '-');
}

function eventLabel(value = '') {
  return String(value).replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

export default AdminSupport;
