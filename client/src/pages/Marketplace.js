import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Store, Sparkles, Zap, CheckCircle, ArrowRight, Crown, Star, Shield,
  Search, Filter, Loader2, ExternalLink, BarChart3, Brain, Wand2,
  Palette, Globe, Workflow, Settings, Code, Layers
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import './Marketplace.css';

const ICON_MAP = {
  sparkles: Sparkles, zap: Zap, 'bar-chart': BarChart3, brain: Brain,
  wand: Wand2, palette: Palette, globe: Globe, workflow: Workflow,
  settings: Settings, code: Code, layers: Layers, star: Star
};

const CATEGORY_LABELS = {
  ai: 'AI', automation: 'Automation', analytics: 'Analytics',
  productivity: 'Productivity', marketing: 'Marketing', 'food-service': 'Food & Hospitality',
  automotive: 'Automotive', utility: 'Utility', other: 'Other'
};

const Marketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [mySubs, setMySubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [appsRes, subsRes] = await Promise.all([
          api.get('/marketplace/apps'),
          user ? api.get('/marketplace/my-apps').catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
        ]);
        setApps(appsRes.data);
        setMySubs(subsRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const getSubForApp = (appId) => mySubs.find(s => (s.app?._id || s.app) === appId);

  const handlePurchase = async (appSlug, planKey) => {
    if (!user) { navigate('/login'); return; }
    setPurchasing(true);
    try {
      const res = await api.post('/marketplace/subscribe', { appSlug, planKey });
      toast.success(res.data.message);
      // Refresh subs
      const subsRes = await api.get('/marketplace/my-apps');
      setMySubs(subsRes.data);
      setSelectedApp(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    }
    setPurchasing(false);
  };

  const filteredApps = apps.filter(a => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    if (searchTerm && !a.name.toLowerCase().includes(searchTerm.toLowerCase()) && !a.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const categories = ['all', ...new Set(apps.map(a => a.category))];

  if (loading) return <div className="page-loading">Loading Marketplace...</div>;

  return (
    <div className="marketplace-page">
      {/* Hero */}
      <section className="mp-hero">
        <div className="container">
          <div className="mp-hero-content">
            <div className="mp-hero-badge"><Store size={14} /> App Marketplace</div>
            <h1>Smart Apps.<br /><span className="mp-hero-highlight">Your Brand.</span></h1>
            <p>Browse our growing library of apps. Subscribe to any, get your own login, and white-label it as your own. Each app is a fully managed, branded product — powered by Penny Wise I.T under the hood.</p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="mp-browse">
        <div className="container">
          <div className="mp-toolbar">
            <div className="mp-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mp-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`mp-filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                >
                  {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          {/* App Grid */}
          <div className="mp-grid">
            {filteredApps.map(app => {
              const Icon = ICON_MAP[app.icon] || Sparkles;
              const sub = getSubForApp(app._id);
              const isSubscribed = sub?.isActive;
              return (
                <div key={app._id} className="mp-card" onClick={() => setSelectedApp(app)}>
                  <div className="mp-card-header">
                    <div className="mp-card-icon"><Icon size={24} /></div>
                    <div className="mp-card-meta">
                      <span className="mp-category-tag">{CATEGORY_LABELS[app.category] || app.category}</span>
                      {isSubscribed && (
                        <span className="mp-subscribed-badge"><CheckCircle size={12} /> Subscribed</span>
                      )}
                    </div>
                  </div>
                  <h3>{app.name}</h3>
                  <p>{app.shortDescription}</p>
                  <div className="mp-card-features">
                    {(app.features || []).slice(0, 3).map((f, i) => (
                      <span key={i} className="mp-feature-tag">{f}</span>
                    ))}
                    {app.features?.length > 3 && <span className="mp-feature-more">+{app.features.length - 3} more</span>}
                  </div>
                  <div className="mp-card-footer">
                    <div className="mp-price">
                      From <strong>${Math.min(...app.plans.map(p => p.price))}</strong>/mo
                    </div>
                    <span className="mp-card-cta">
                      {isSubscribed ? 'Manage' : 'View Plans'} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredApps.length === 0 && (
            <div className="mp-empty">
              <Store size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>No apps found. Check back soon — more are on the way.</p>
            </div>
          )}
        </div>
      </section>

      {/* App Detail Modal */}
      {selectedApp && (
        <div className="mp-modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="mp-modal" onClick={e => e.stopPropagation()}>
            <button className="mp-modal-close" onClick={() => setSelectedApp(null)}>&times;</button>

            <div className="mp-modal-header">
              {(() => { const Icon = ICON_MAP[selectedApp.icon] || Sparkles; return <Icon size={32} />; })()}
              <div>
                <h2>{selectedApp.name}</h2>
                <span className="mp-category-tag" style={{ marginTop: 4 }}>{CATEGORY_LABELS[selectedApp.category]}</span>
              </div>
            </div>

            <p className="mp-modal-desc">{selectedApp.fullDescription || selectedApp.shortDescription}</p>

            <div className="mp-modal-actions">
              {selectedApp.routePath && (
                <Link to={selectedApp.routePath} className="btn btn-outline" onClick={() => setSelectedApp(null)}>
                  <ArrowRight size={14} /> Learn More
                </Link>
              )}
              {selectedApp.demoUrl && (
                <a href={selectedApp.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <ExternalLink size={14} /> Try Demo
                </a>
              )}
            </div>

            {selectedApp.features?.length > 0 && (
              <div className="mp-modal-features">
                <h4>Features</h4>
                <ul>
                  {selectedApp.features.map((f, i) => (
                    <li key={i}><CheckCircle size={14} /> {f}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mp-modal-plans">
              <h4>Choose a Plan</h4>
              <div className="mp-plans-row">
                {selectedApp.plans.map(plan => {
                  const sub = getSubForApp(selectedApp._id);
                  const isCurrent = sub?.isActive && sub?.planKey === plan.key;
                  const PlanIcon = plan.color === '#a855f7' ? Shield : plan.color === '#f59e0b' ? Crown : Star;
                  return (
                    <div key={plan.key} className={`mp-plan-card ${plan.popular ? 'mp-plan-popular' : ''} ${isCurrent ? 'mp-plan-current' : ''}`}>
                      {plan.popular && <div className="mp-plan-badge">POPULAR</div>}
                      {isCurrent && <div className="mp-plan-badge mp-plan-badge-current">CURRENT</div>}
                      <PlanIcon size={22} style={{ color: plan.color, marginBottom: '0.5rem' }} />
                      <h5>{plan.name}</h5>
                      <div className="mp-plan-price">
                        <span className="mp-plan-amount">${plan.price}</span>
                        <span className="mp-plan-period">/mo</span>
                      </div>
                      <ul className="mp-plan-features">
                        {plan.features.map((f, i) => (
                          <li key={i}><CheckCircle size={12} style={{ color: plan.color }} /> {f}</li>
                        ))}
                        {plan.whiteLabel && <li><Palette size={12} style={{ color: plan.color }} /> White-Label Branding</li>}
                        {plan.customDomain && <li><Globe size={12} style={{ color: plan.color }} /> Custom Domain</li>}
                      </ul>
                      {isCurrent ? (
                        <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                          <CheckCircle size={14} /> Current Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePurchase(selectedApp.slug, plan.key)}
                          disabled={purchasing}
                          className="btn btn-primary"
                          style={{ width: '100%', background: plan.color, borderColor: plan.color }}
                        >
                          {purchasing ? <Loader2 size={14} className="spin" /> : <Zap size={14} />}
                          {sub?.isActive ? 'Switch Plan' : 'Subscribe'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedApp.techStack?.length > 0 && (
              <div className="mp-modal-tech">
                <h4>Tech Stack</h4>
                <div className="mp-tech-tags">
                  {selectedApp.techStack.map((t, i) => <span key={i}>{t}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
