import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Settings, Calendar, BarChart3, Wand2, Image as ImageIcon,
  Loader2, Trash2, Clock, CheckCircle, Zap, Save, Brain, Instagram, Facebook,
  Palette, Crown, ArrowRight, Star, Shield, ExternalLink, X
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import './SocialAI.css';

const PLAN_DETAILS = {
  starter: { name: 'Starter', price: 49, color: '#3b82f6', icon: Star, features: ['AI Content Generation', 'Content Calendar', 'Basic Insights', '1 Brand Profile'] },
  professional: { name: 'Professional', price: 99, color: '#f59e0b', icon: Crown, popular: true, features: ['Everything in Starter', 'Smart AI Scheduler', 'AI Image Generation', 'Advanced Insights', 'White-Label Branding', '3 Brand Profiles'] },
  enterprise: { name: 'Enterprise', price: 199, color: '#a855f7', icon: Shield, features: ['Everything in Professional', 'Custom Domain', 'Priority Support', 'API Access', 'Unlimited Brand Profiles', 'Dedicated Account Manager'] }
};

const SocialAI = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  // Content generator state
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState([]);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  // Smart schedule state
  const [smartPosts, setSmartPosts] = useState([]);
  const [smartStrategy, setSmartStrategy] = useState('');
  const [isSmartGenerating, setIsSmartGenerating] = useState(false);
  const [smartCount, setSmartCount] = useState(7);

  // Insights state
  const [recommendations, setRecommendations] = useState('');
  const [bestTimes, setBestTimes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // White-label state
  const [branding, setBranding] = useState({});
  const [savingBranding, setSavingBranding] = useState(false);

  // Marketplace subscription state (generic system)
  const [mpSub, setMpSub] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [profileRes, postsRes, mpRes] = await Promise.all([
        api.get('/social/profile').catch(() => ({ data: null })),
        api.get('/social/posts').catch(() => ({ data: [] })),
        api.get('/marketplace/my-apps/social-ai-studio').catch(() => ({ data: null }))
      ]);
      setProfile(profileRes.data);
      setPosts(postsRes.data);
      if (mpRes.data && mpRes.data.planKey) setMpSub(mpRes.data);
      // Use marketplace white-label if available, else fall back to legacy
      if (mpRes.data?.whiteLabel?.brandName) {
        setBranding(mpRes.data.whiteLabel);
      } else if (profileRes.data?.whiteLabel) {
        setBranding(profileRes.data.whiteLabel);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const hasApiKey = !!profile?.geminiApiKey;
  // Subscribed via legacy SocialProfile OR marketplace AppSubscription
  const legacySubscribed = profile?.isSubscribed;
  const mpSubscribed = mpSub?.isActive;
  const isSubscribed = legacySubscribed || mpSubscribed;
  // Determine plan from marketplace first, then legacy
  const currentPlan = (mpSubscribed ? mpSub.planKey : profile?.subscription?.plan) || 'none';
  const canWhiteLabel = isSubscribed && (currentPlan === 'professional' || currentPlan === 'enterprise');

  // White-label derived styles (use branding state which is sourced from marketplace or legacy)
  const brandColor = branding.primaryColor || '#f59e0b';
  const headerBg = branding.headerBg || '#0f172a';
  const displayName = branding.brandName || 'SocialAI Studio';
  const displayTagline = branding.tagline || '';
  // Keep wl for byline check
  const wl = branding;

  // ── Purchase Plan ──
  const handlePurchase = async (plan) => {
    setPurchasing(true);
    try {
      // Try marketplace first, fall back to legacy
      const mpRes = await api.post('/marketplace/subscribe', { appSlug: 'social-ai-studio', planKey: plan }).catch(() => null);
      if (mpRes?.data) {
        setMpSub(mpRes.data.subscription);
        toast.success(mpRes.data.message);
      } else {
        const res = await api.post('/social/subscribe', { plan });
        setProfile(res.data.profile);
        toast.success(res.data.message);
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    }
    setPurchasing(false);
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Cancel your subscription? You\'ll keep access until the end of your billing period.')) return;
    try {
      if (mpSubscribed) {
        await api.post('/marketplace/cancel', { appSlug: 'social-ai-studio' });
      } else {
        await api.post('/social/cancel-subscription');
      }
      toast.success('Subscription cancelled. Access remains until end of billing period.');
      loadData();
    } catch (err) {
      toast.error('Cancellation failed');
    }
  };

  // ── Save White-Label ──
  const saveBranding = async () => {
    setSavingBranding(true);
    try {
      // Try marketplace white-label first, fall back to legacy
      const mpRes = await api.put('/marketplace/white-label/social-ai-studio', branding).catch(() => null);
      if (mpRes?.data) {
        setBranding(mpRes.data);
        toast.success('Branding saved!');
      } else {
        const res = await api.put('/social/white-label', branding);
        setBranding(res.data);
        toast.success('Branding saved!');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save branding');
    }
    setSavingBranding(false);
  };

  // ── Content Generation ──
  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Enter a topic first.');
    if (!hasApiKey) return toast.error('Set your Gemini API key in Settings.');
    setIsGenerating(true);
    try {
      const res = await api.post('/social/ai/generate', { topic, platform });
      setGeneratedContent(res.data.content);
      setGeneratedHashtags(res.data.hashtags || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    }
    setIsGenerating(false);
  };

  const handleGenerateImage = async () => {
    if (!topic.trim()) return toast.error('Enter a topic first.');
    if (!hasApiKey) return toast.error('Set your Gemini API key in Settings.');
    setIsGeneratingImage(true);
    try {
      const res = await api.post('/social/ai/image', { prompt: topic });
      setGeneratedImage(res.data.image);
    } catch (err) {
      toast.error('Image generation failed. Try again.');
    }
    setIsGeneratingImage(false);
  };

  const handleSavePost = async () => {
    if (!generatedContent) return toast.error('Generate content first.');
    try {
      const postData = {
        platform,
        content: generatedContent,
        hashtags: generatedHashtags,
        scheduledFor: scheduleDate || new Date().toISOString(),
        status: scheduleDate ? 'Scheduled' : 'Draft',
        image: generatedImage || undefined,
        topic
      };
      await api.post('/social/posts', postData);
      toast.success(`Post ${scheduleDate ? 'scheduled' : 'saved as draft'}!`);
      setGeneratedContent('');
      setGeneratedHashtags([]);
      setGeneratedImage(null);
      setTopic('');
      setScheduleDate('');
      loadData();
    } catch (err) {
      toast.error('Failed to save post');
    }
  };

  // ── Smart Schedule ──
  const handleSmartSchedule = async () => {
    if (!hasApiKey) return toast.error('Set your Gemini API key in Settings.');
    setIsSmartGenerating(true);
    try {
      const res = await api.post('/social/ai/smart-schedule', { count: smartCount });
      setSmartPosts(res.data.posts || []);
      setSmartStrategy(res.data.strategy || '');
    } catch (err) {
      toast.error('Smart schedule failed');
    }
    setIsSmartGenerating(false);
  };

  const handleAcceptSmartPosts = async () => {
    try {
      const postsData = smartPosts.map(sp => ({
        platform: sp.platform,
        content: sp.content,
        hashtags: sp.hashtags,
        scheduledFor: sp.scheduledFor,
        status: 'Scheduled',
        imagePrompt: sp.imagePrompt,
        reasoning: sp.reasoning,
        pillar: sp.pillar,
        topic: sp.topic
      }));
      await api.post('/social/posts/bulk', { posts: postsData });
      toast.success(`${postsData.length} posts added to calendar!`);
      setSmartPosts([]);
      setSmartStrategy('');
      loadData();
    } catch (err) {
      toast.error('Failed to save posts');
    }
  };

  // ── Insights ──
  const handleAnalyze = async () => {
    if (!hasApiKey) return toast.error('Set your Gemini API key in Settings.');
    setIsAnalyzing(true);
    try {
      const res = await api.post('/social/ai/recommendations');
      setRecommendations(res.data.recommendations || '');
      setBestTimes(res.data.bestTimes || '');
    } catch (err) {
      toast.error('Analysis failed');
    }
    setIsAnalyzing(false);
  };

  // ── Delete Post ──
  const deletePost = async (id) => {
    try {
      await api.delete(`/social/posts/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
      toast.success('Post deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  // ── Profile Save ──
  const saveProfile = async () => {
    try {
      const res = await api.put('/social/profile', profile);
      setProfile(res.data);
      toast.success('Profile saved!');
    } catch (err) {
      toast.error('Failed to save profile');
    }
  };

  // ── Stats update ──
  const updateStat = (key, value) => {
    setProfile(prev => ({ ...prev, stats: { ...prev.stats, [key]: Number(value) } }));
  };

  const tabs = [
    { id: 'create', label: 'Create', icon: Wand2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'smart', label: 'Smart AI', icon: Brain, requirePlan: ['professional', 'enterprise'] },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'branding', label: 'Branding', icon: Palette, requirePlan: ['professional', 'enterprise'] },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) return <div className="page-loading">Loading Social AI...</div>;

  const PlatformIcon = ({ p, size = 14 }) =>
    p === 'Instagram' ? <Instagram size={size} style={{ color: '#e1306c' }} /> : <Facebook size={size} style={{ color: '#1877f2' }} />;

  // ── Purchase Gate ──
  if (!isSubscribed) {
    return (
      <div className="social-ai-page">
        <div className="sai-header">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Sparkles size={28} style={{ color: '#f59e0b' }} />
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>SocialAI Studio</h1>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Crown size={48} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Choose Your Plan</h2>
            <p style={{ color: '#9ca3af', fontSize: '1.0625rem', maxWidth: '500px', margin: '0 auto' }}>
              Get your own branded AI social media manager. Each plan gives you a personalised login and full white-label control.
            </p>
          </div>

          <div className="sai-plans-grid">
            {Object.entries(PLAN_DETAILS).map(([key, plan]) => {
              const Icon = plan.icon;
              return (
                <div key={key} className={`sai-plan-card${plan.popular ? ' sai-plan-popular' : ''}`}>
                  {plan.popular && <div className="sai-plan-badge">MOST POPULAR</div>}
                  <Icon size={28} style={{ color: plan.color, marginBottom: '0.75rem' }} />
                  <h3>{plan.name}</h3>
                  <div className="sai-plan-price">
                    <span className="sai-plan-amount">${plan.price}</span>
                    <span className="sai-plan-period">/month AUD</span>
                  </div>
                  <ul className="sai-plan-features">
                    {plan.features.map((f, i) => (
                      <li key={i}><CheckCircle size={14} style={{ color: plan.color }} /> {f}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePurchase(key)}
                    disabled={purchasing}
                    className="btn btn-primary"
                    style={{ width: '100%', background: plan.color, borderColor: plan.color }}
                  >
                    {purchasing ? <Loader2 size={16} className="spin" /> : <><Zap size={16} /> Get {plan.name}</>}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/social-ai" className="service-link" style={{ color: '#9ca3af' }}>
              Learn more about SocialAI Studio <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Subscribed: Full App ──
  return (
    <div className="social-ai-page">
      {/* Header — branded */}
      <div className="sai-header" style={{ background: headerBg }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {wl.logoUrl ? (
              <img src={wl.logoUrl} alt="" style={{ height: 32, width: 32, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <Sparkles size={28} style={{ color: brandColor }} />
            )}
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{displayName}</h1>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {displayTagline || profile?.businessName || 'Configure in Settings'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <span style={{ color: brandColor, display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'capitalize' }}>
              <Crown size={14} /> {currentPlan}
            </span>
            {hasApiKey ? (
              <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={14} /> AI Active</span>
            ) : (
              <span style={{ color: '#fbbf24' }}>No API Key</span>
            )}
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="sai-tabs">
        <div className="container" style={{ display: 'flex', gap: '0.25rem', padding: '0 1.5rem', overflowX: 'auto' }}>
          {tabs.map(tab => {
            const locked = tab.requirePlan && !tab.requirePlan.includes(currentPlan);
            return (
              <button
                key={tab.id}
                onClick={() => !locked && setActiveTab(tab.id)}
                className={`sai-tab ${activeTab === tab.id ? 'active' : ''} ${locked ? 'locked' : ''}`}
                title={locked ? `Requires ${tab.requirePlan.join(' or ')} plan` : ''}
                style={activeTab === tab.id ? { borderBottomColor: brandColor, color: brandColor } : {}}
              >
                <tab.icon size={16} />
                {tab.label}
                {locked && <Crown size={10} style={{ opacity: 0.5 }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '900px' }}>

        {/* ═══ CREATE TAB ═══ */}
        {activeTab === 'create' && (
          <div className="sai-section">
            <h2 className="sai-title"><Wand2 size={22} style={{ color: '#f59e0b' }} /> AI Content Generator</h2>

            <div className="sai-card">
              <div className="form-group">
                <label>Topic / Prompt</label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g., Weekend sale, new product launch, behind the scenes..."
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="sai-select">
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                </select>
                <button onClick={handleGenerate} disabled={isGenerating} className="btn btn-primary">
                  {isGenerating ? <Loader2 size={16} className="spin" /> : <Wand2 size={16} />}
                  Generate Text
                </button>
                <button onClick={handleGenerateImage} disabled={isGeneratingImage} className="btn sai-btn-image">
                  {isGeneratingImage ? <Loader2 size={16} className="spin" /> : <ImageIcon size={16} />}
                  Image
                </button>
              </div>
            </div>

            {generatedContent && (
              <div className="sai-card" style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <PlatformIcon p={platform} size={18} />
                  <strong style={{ color: 'white' }}>Generated Post</strong>
                </div>
                <div className="sai-output">{generatedContent}</div>
                {generatedHashtags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', margin: '0.75rem 0' }}>
                    {generatedHashtags.map((tag, i) => (
                      <span key={i} className="sai-hashtag">{tag.startsWith('#') ? tag : `#${tag}`}</span>
                    ))}
                  </div>
                )}
                {generatedImage && (
                  <img src={generatedImage} alt="Generated" style={{ maxWidth: '300px', borderRadius: '8px', margin: '0.75rem 0' }} />
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end', marginTop: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>Schedule (optional)</label>
                    <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
                  </div>
                  <button onClick={handleSavePost} className="btn sai-btn-save">
                    <Save size={16} /> {scheduleDate ? 'Schedule' : 'Save Draft'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ CALENDAR TAB ═══ */}
        {activeTab === 'calendar' && (
          <div className="sai-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="sai-title"><Calendar size={22} style={{ color: '#f59e0b' }} /> Content Calendar</h2>
              <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>{posts.length} posts</span>
            </div>

            {posts.length === 0 ? (
              <div className="sai-empty">
                <Calendar size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p>No posts yet. Create one in the Create tab or use Smart AI.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {posts.map(post => (
                  <div key={post._id} className="sai-post-card">
                    {post.image && <img src={post.image} alt="" className="sai-post-thumb" />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                        <PlatformIcon p={post.platform} />
                        <span className={`sai-status ${post.status.toLowerCase()}`}>{post.status}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />
                          {new Date(post.scheduledFor).toLocaleDateString()} {new Date(post.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {post.pillar && <span className="sai-pillar">{post.pillar}</span>}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#d1d5db', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>
                      {post.hashtags?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.375rem' }}>
                          {post.hashtags.slice(0, 5).map((t, i) => <span key={i} style={{ fontSize: '0.625rem', color: '#f59e0b' }}>{t}</span>)}
                        </div>
                      )}
                    </div>
                    <button onClick={() => deletePost(post._id)} className="sai-delete-btn" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ SMART AI TAB ═══ */}
        {activeTab === 'smart' && (
          <div className="sai-section">
            <h2 className="sai-title"><Brain size={22} style={{ color: '#f59e0b' }} /> Smart AI Scheduler</h2>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Let AI plan your entire content calendar for the next 2 weeks — optimized for engagement, timing, and variety.</p>

            <div className="sai-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem' }}>Posts to Generate</label>
                  <select value={smartCount} onChange={e => setSmartCount(Number(e.target.value))} className="sai-select">
                    <option value={5}>5 posts</option>
                    <option value={7}>7 posts</option>
                    <option value={10}>10 posts</option>
                    <option value={14}>14 posts</option>
                  </select>
                </div>
                <button onClick={handleSmartSchedule} disabled={isSmartGenerating} className="btn sai-btn-smart">
                  {isSmartGenerating ? <Loader2 size={16} className="spin" /> : <Zap size={16} />}
                  Generate Schedule
                </button>
              </div>

              {smartStrategy && (
                <div className="sai-strategy">
                  <h4>Strategy</h4>
                  <p>{smartStrategy}</p>
                </div>
              )}
            </div>

            {smartPosts.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <strong style={{ color: 'white' }}>{smartPosts.length} Posts Generated</strong>
                  <button onClick={handleAcceptSmartPosts} className="btn sai-btn-save">
                    <CheckCircle size={16} /> Accept All & Add to Calendar
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {smartPosts.map((sp, i) => (
                    <div key={i} className="sai-card" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <PlatformIcon p={sp.platform} />
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          {new Date(sp.scheduledFor).toLocaleDateString()} {new Date(sp.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {sp.pillar && <span className="sai-pillar">{sp.pillar}</span>}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#e5e7eb', marginBottom: '0.5rem' }}>{sp.content}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {sp.hashtags.map((t, j) => <span key={j} style={{ fontSize: '0.625rem', color: '#f59e0b' }}>{t}</span>)}
                      </div>
                      {sp.reasoning && <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>{sp.reasoning}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ INSIGHTS TAB ═══ */}
        {activeTab === 'insights' && (
          <div className="sai-section">
            <h2 className="sai-title"><BarChart3 size={22} style={{ color: '#f59e0b' }} /> AI Insights</h2>

            <div className="sai-card">
              <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Your Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                {[
                  { label: 'Followers', key: 'followers' },
                  { label: 'Monthly Reach', key: 'reach' },
                  { label: 'Engagement %', key: 'engagement' },
                  { label: 'Posts (30d)', key: 'postsLast30Days' }
                ].map(s => (
                  <div key={s.key} className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>{s.label}</label>
                    <input
                      type="number"
                      value={profile?.stats?.[s.key] || 0}
                      onChange={e => updateStat(s.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleAnalyze} disabled={isAnalyzing} className="btn btn-primary">
                  {isAnalyzing ? <Loader2 size={16} className="spin" /> : <BarChart3 size={16} />}
                  Analyze & Recommend
                </button>
                <button onClick={saveProfile} className="btn btn-secondary"><Save size={16} /> Save Stats</button>
              </div>
            </div>

            {recommendations && (
              <div className="sai-card" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, color: '#fcd34d', marginBottom: '0.75rem' }}>Recommendations</h3>
                <div style={{ fontSize: '0.875rem', color: '#d1d5db', whiteSpace: 'pre-wrap' }}>{recommendations}</div>
              </div>
            )}

            {bestTimes && (
              <div className="sai-card" style={{ marginTop: '1rem' }}>
                <h3 style={{ fontWeight: 600, color: '#fcd34d', marginBottom: '0.75rem' }}>Best Posting Times</h3>
                <div style={{ fontSize: '0.875rem', color: '#d1d5db', whiteSpace: 'pre-wrap' }}>{bestTimes}</div>
              </div>
            )}
          </div>
        )}

        {/* ═══ BRANDING TAB ═══ */}
        {activeTab === 'branding' && canWhiteLabel && (
          <div className="sai-section">
            <h2 className="sai-title"><Palette size={22} style={{ color: brandColor }} /> White-Label Branding</h2>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Customise the look and feel of your AI manager. Your customers will see your brand, not ours.</p>

            {/* Live Preview */}
            <div className="sai-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Live Preview</h3>
              <div style={{ background: branding.headerBg || '#0f172a', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt="" style={{ height: 32, width: 32, borderRadius: 8, objectFit: 'cover' }} />
                ) : (
                  <Sparkles size={28} style={{ color: branding.primaryColor || '#f59e0b' }} />
                )}
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>{branding.brandName || 'Your Brand Name'}</div>
                  {branding.tagline && <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{branding.tagline}</div>}
                </div>
              </div>
            </div>

            {/* Identity */}
            <div className="sai-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Brand Identity</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Brand Name</label>
                  <input value={branding.brandName || ''} onChange={e => setBranding(prev => ({ ...prev, brandName: e.target.value }))} placeholder="Your Company Name" />
                </div>
                <div className="form-group">
                  <label>Tagline</label>
                  <input value={branding.tagline || ''} onChange={e => setBranding(prev => ({ ...prev, tagline: e.target.value }))} placeholder="Your smart social manager" />
                </div>
                <div className="form-group">
                  <label>Logo URL</label>
                  <input value={branding.logoUrl || ''} onChange={e => setBranding(prev => ({ ...prev, logoUrl: e.target.value }))} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Favicon URL</label>
                  <input value={branding.faviconUrl || ''} onChange={e => setBranding(prev => ({ ...prev, faviconUrl: e.target.value }))} placeholder="https://..." />
                </div>
              </div>
            </div>

            {/* Colours */}
            <div className="sai-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Colours</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                {[
                  { key: 'primaryColor', label: 'Primary / Accent' },
                  { key: 'accentColor', label: 'Background Accent' },
                  { key: 'headerBg', label: 'Header Background' },
                  { key: 'buttonColor', label: 'Button Colour' }
                ].map(c => (
                  <div key={c.key} className="form-group">
                    <label style={{ fontSize: '0.7rem' }}>{c.label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={branding[c.key] || '#f59e0b'}
                        onChange={e => setBranding(prev => ({ ...prev, [c.key]: e.target.value }))}
                        style={{ width: 36, height: 36, padding: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={branding[c.key] || ''}
                        onChange={e => setBranding(prev => ({ ...prev, [c.key]: e.target.value }))}
                        style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.75rem' }}
                        placeholder="#hex"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced */}
            <div className="sai-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Advanced</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Custom Font Family</label>
                  <input value={branding.fontFamily || ''} onChange={e => setBranding(prev => ({ ...prev, fontFamily: e.target.value }))} placeholder="e.g., Inter, Poppins" />
                </div>
                {currentPlan === 'enterprise' && (
                  <div className="form-group">
                    <label>Custom Domain</label>
                    <input value={branding.customDomain || ''} onChange={e => setBranding(prev => ({ ...prev, customDomain: e.target.value }))} placeholder="social.yourdomain.com" />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="hideByline"
                  checked={branding.hideByline || false}
                  onChange={e => setBranding(prev => ({ ...prev, hideByline: e.target.checked }))}
                  style={{ width: 16, height: 16 }}
                />
                <label htmlFor="hideByline" style={{ fontSize: '0.8125rem', color: '#d1d5db', cursor: 'pointer' }}>
                  Hide "Powered by Penny Wise I.T" byline
                </label>
              </div>
            </div>

            <button onClick={saveBranding} disabled={savingBranding} className="btn btn-primary" style={{ background: brandColor, borderColor: brandColor }}>
              {savingBranding ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              Save Branding
            </button>
          </div>
        )}

        {/* ═══ SETTINGS TAB ═══ */}
        {activeTab === 'settings' && (
          <div className="sai-section">
            <h2 className="sai-title"><Settings size={22} style={{ color: brandColor }} /> Settings</h2>

            {/* Subscription Status */}
            <div className="sai-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Crown size={18} style={{ color: brandColor }} /> Subscription
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Plan</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: brandColor, textTransform: 'capitalize' }}>{currentPlan}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', textTransform: 'capitalize' }}>{profile?.subscription?.status}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Renews</div>
                  <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                    {profile?.subscription?.endDate ? new Date(profile.subscription.endDate).toLocaleDateString() : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Amount</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#d1d5db' }}>${profile?.subscription?.amount || 0}/mo</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {currentPlan !== 'enterprise' && (
                  <button onClick={() => handlePurchase(currentPlan === 'starter' ? 'professional' : 'enterprise')} className="btn btn-primary btn-sm" style={{ background: brandColor, borderColor: brandColor }}>
                    <Zap size={14} /> Upgrade Plan
                  </button>
                )}
                <button onClick={handleCancelSubscription} className="btn btn-danger btn-sm">
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* API Key */}
            <div className="sai-card">
              <h3 style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} style={{ color: brandColor }} /> Gemini API Key
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>
                Powers all AI features. Get a free key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: brandColor }}>Google AI Studio</a>.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px' }}>
                <input
                  type="password"
                  value={profile?.geminiApiKey || ''}
                  onChange={e => setProfile(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                  placeholder="Paste your API key..."
                  style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8125rem' }}
                />
                <button onClick={saveProfile} className="btn btn-primary btn-sm" style={{ background: brandColor, borderColor: brandColor }}>Save</button>
              </div>
              {hasApiKey && (
                <p style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <CheckCircle size={12} /> Key configured
                </p>
              )}
            </div>

            {/* Business Profile */}
            <div className="sai-card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>Business Profile</h3>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>AI uses this to tailor content to your brand.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Business Name</label>
                  <input value={profile?.businessName || ''} onChange={e => setProfile(prev => ({ ...prev, businessName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Business Type</label>
                  <input value={profile?.businessType || ''} onChange={e => setProfile(prev => ({ ...prev, businessType: e.target.value }))} placeholder="e.g., cafe, gym, retail" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input value={profile?.location || ''} onChange={e => setProfile(prev => ({ ...prev, location: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Tone / Voice</label>
                  <input value={profile?.tone || ''} onChange={e => setProfile(prev => ({ ...prev, tone: e.target.value }))} placeholder="e.g., Casual and fun" />
                </div>
              </div>
              <div className="form-group">
                <label>Business Description</label>
                <textarea value={profile?.description || ''} onChange={e => setProfile(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief description of your business..." rows={2} />
              </div>
              <button onClick={saveProfile} className="btn btn-primary" style={{ background: brandColor, borderColor: brandColor }}><Save size={16} /> Save Profile</button>
            </div>

            {/* Data */}
            <div className="sai-card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Data</h3>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    const data = JSON.stringify({ posts, profile }, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `socialai-export-${new Date().toISOString().split('T')[0]}.json`;
                    a.click(); URL.revokeObjectURL(url);
                    toast.success('Data exported!');
                  }}
                  className="btn btn-secondary btn-sm"
                >Export All Data</button>
                <button
                  onClick={async () => {
                    if (!window.confirm('Delete all posts? This cannot be undone.')) return;
                    try {
                      await api.delete('/social/posts');
                      setPosts([]);
                      toast.success('All posts cleared');
                    } catch (err) {
                      toast.error('Failed to clear posts');
                    }
                  }}
                  className="btn btn-danger btn-sm"
                >Clear All Posts</button>
              </div>
            </div>

            {/* Powered By */}
            {!wl.hideByline && (
              <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: '#4b5563' }}>
                Powered by <strong>Penny Wise I.T</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialAI;
