import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Store, Crown, BarChart3, Users, DollarSign, Zap, XCircle,
  CheckCircle, Sparkles, Palette, Eye, Plus, Trash2, Edit, Loader2,
  Star, Shield, Globe, Brain, Wand2, Code, Layers, Settings, Workflow
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import './Admin.css';

const ICON_MAP = {
  sparkles: Sparkles, zap: Zap, 'bar-chart': BarChart3, brain: Brain,
  wand: Wand2, palette: Palette, globe: Globe, workflow: Workflow,
  settings: Settings, code: Code, layers: Layers, star: Star
};

const AdminApps = () => {
  const [stats, setStats] = useState(null);
  const [apps, setApps] = useState([]);
  const [subs, setSubs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubModal, setShowSubModal] = useState(false);
  const [newSub, setNewSub] = useState({ userId: '', appSlug: '', planKey: '' });

  const loadAll = async () => {
    try {
      const [statsRes, appsRes, subsRes, custRes] = await Promise.all([
        api.get('/marketplace/admin/stats').catch(() => ({ data: null })),
        api.get('/marketplace/admin/apps').catch(() => ({ data: [] })),
        api.get('/marketplace/admin/subscriptions').catch(() => ({ data: [] })),
        api.get('/customers').catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setApps(appsRes.data);
      setSubs(subsRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const seedApps = async () => {
    try {
      const res = await api.post('/marketplace/admin/seed');
      toast.success(res.data.message);
      loadAll();
    } catch (err) {
      toast.error('Seed failed');
    }
  };

  const cancelSub = async (subId) => {
    if (!window.confirm('Cancel this subscription?')) return;
    try {
      await api.post('/marketplace/admin/cancel', { subscriptionId: subId });
      toast.success('Subscription cancelled');
      loadAll();
    } catch (err) {
      toast.error('Failed to cancel');
    }
  };

  const activateSub = async () => {
    if (!newSub.userId || !newSub.appSlug || !newSub.planKey) return toast.error('Fill all fields');
    try {
      await api.post('/marketplace/admin/subscribe', newSub);
      toast.success('Subscription activated');
      setShowSubModal(false);
      setNewSub({ userId: '', appSlug: '', planKey: '' });
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Activation failed');
    }
  };

  if (loading) return <div className="page-loading">Loading app management...</div>;

  const activeSubs = subs.filter(s => s.status === 'active');

  return (
    <div className="admin-page">
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <Link to="/admin" className="back-link"><ArrowLeft size={16} /> Back to Admin</Link>
        <div className="admin-header">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Store size={24} style={{ color: 'var(--primary)' }} /> App Marketplace Management
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              Manage apps, subscriptions, and white-label configurations
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={seedApps} className="btn btn-secondary btn-sm"><Zap size={14} /> Seed Apps</button>
            <button onClick={() => setShowSubModal(true)} className="btn btn-primary btn-sm"><Plus size={14} /> New Subscription</button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="admin-stats">
            <div className="stat-card card">
              <div className="stat-icon" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}><Store size={24} /></div>
              <div className="stat-info"><strong>{stats.totalApps}</strong><span>Apps</span></div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Crown size={24} /></div>
              <div className="stat-info"><strong>{stats.activeSubscriptions}</strong><span>Active Subs</span></div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><DollarSign size={24} /></div>
              <div className="stat-info"><strong>${stats.monthlyRevenue}</strong><span>Monthly Revenue</span></div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}><Users size={24} /></div>
              <div className="stat-info"><strong>{stats.totalSubscriptions}</strong><span>Total Subs</span></div>
            </div>
          </div>
        )}

        {/* Revenue by App */}
        {stats?.subsByApp?.length > 0 && (
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>Revenue by App</h3>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {stats.subsByApp.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} style={{ color: '#f59e0b' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.appName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{s.count} subs &middot; ${s.revenue}/mo</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apps Catalog */}
        <div className="admin-section">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Store size={18} /> App Catalog ({apps.length})
          </h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>App</th>
                  <th>Category</th>
                  <th>Plans</th>
                  <th>Status</th>
                  <th>Active Subs</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => {
                  const Icon = ICON_MAP[app.icon] || Sparkles;
                  const appSubs = activeSubs.filter(s => {
                    const appId = s.app?._id || s.app;
                    return appId === app._id;
                  });
                  return (
                    <tr key={app._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon size={16} style={{ color: 'var(--primary)' }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{app.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{app.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{app.category}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {app.plans.map(p => (
                            <span key={p.key} style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem', borderRadius: 4, background: `${p.color}15`, color: p.color, fontWeight: 600 }}>
                              {p.name} ${p.price}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${app.isActive ? 'badge-success' : 'badge-gray'}`}>
                          {app.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{appSubs.length}</td>
                    </tr>
                  );
                })}
                {apps.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>No apps yet. Click "Seed Apps" to add SocialAI Studio.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Subscriptions */}
        <div className="admin-section" style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crown size={18} style={{ color: '#f59e0b' }} /> All Subscriptions ({subs.length})
          </h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>App</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>White-Label</th>
                  <th>Started</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subs.map(sub => (
                  <tr key={sub._id}>
                    <td style={{ fontWeight: 600 }}>{sub.user?.firstName} {sub.user?.lastName}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        {(() => { const I = ICON_MAP[sub.app?.icon] || Sparkles; return <I size={14} />; })()}
                        {sub.app?.name || '—'}
                      </div>
                    </td>
                    <td><span style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.8125rem' }}>{sub.planKey}</span></td>
                    <td>
                      <span className={`badge ${sub.status === 'active' ? 'badge-success' : sub.status === 'cancelled' ? 'badge-gray' : 'badge-info'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td>${sub.amount}/mo</td>
                    <td>
                      {sub.whiteLabel?.brandName ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem' }}>
                          <Palette size={12} style={{ color: sub.whiteLabel.primaryColor || '#3b82f6' }} />
                          {sub.whiteLabel.brandName}
                        </span>
                      ) : <span style={{ color: 'var(--gray-400)' }}>—</span>}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                      {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      {sub.status === 'active' && (
                        <button onClick={() => cancelSub(sub._id)} className="btn btn-sm btn-danger" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem' }}>
                          <XCircle size={12} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {subs.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>No subscriptions yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Subscription Modal */}
        {showSubModal && (
          <div className="modal-overlay" onClick={() => setShowSubModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <h2>Activate Subscription</h2>

              <div className="form-group">
                <label>Customer</label>
                <select value={newSub.userId} onChange={e => setNewSub({ ...newSub, userId: e.target.value })}>
                  <option value="">Select customer...</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.firstName} {c.lastName} — {c.email}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>App</label>
                <select value={newSub.appSlug} onChange={e => setNewSub({ ...newSub, appSlug: e.target.value, planKey: '' })}>
                  <option value="">Select app...</option>
                  {apps.map(a => (
                    <option key={a._id} value={a.slug}>{a.name}</option>
                  ))}
                </select>
              </div>

              {newSub.appSlug && (
                <div className="form-group">
                  <label>Plan</label>
                  <select value={newSub.planKey} onChange={e => setNewSub({ ...newSub, planKey: e.target.value })}>
                    <option value="">Select plan...</option>
                    {apps.find(a => a.slug === newSub.appSlug)?.plans.map(p => (
                      <option key={p.key} value={p.key}>{p.name} — ${p.price}/mo</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="modal-actions">
                <button onClick={() => setShowSubModal(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={activateSub} className="btn btn-primary"><Zap size={14} /> Activate</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApps;
