import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, Settings, Calendar, BarChart3, Wand2, Image as ImageIcon,
  Loader2, Trash2, Clock, CheckCircle, Zap, Save, Brain, Instagram, Facebook
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import './SocialAI.css';

const SocialAI = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const loadData = useCallback(async () => {
    try {
      const [profileRes, postsRes] = await Promise.all([
        api.get('/social/profile').catch(() => ({ data: null })),
        api.get('/social/posts').catch(() => ({ data: [] }))
      ]);
      setProfile(profileRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const hasApiKey = !!profile?.geminiApiKey;

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
    { id: 'smart', label: 'Smart AI', icon: Brain },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) return <div className="page-loading">Loading Social AI...</div>;

  const PlatformIcon = ({ p, size = 14 }) =>
    p === 'Instagram' ? <Instagram size={size} style={{ color: '#e1306c' }} /> : <Facebook size={size} style={{ color: '#1877f2' }} />;

  return (
    <div className="social-ai-page">
      {/* Header */}
      <div className="sai-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={28} style={{ color: '#f59e0b' }} />
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>SocialAI Studio</h1>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{profile?.businessName || 'Configure in Settings'}</p>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem' }}>
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
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sai-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
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

        {/* ═══ SETTINGS TAB ═══ */}
        {activeTab === 'settings' && (
          <div className="sai-section">
            <h2 className="sai-title"><Settings size={22} style={{ color: '#f59e0b' }} /> Settings</h2>

            {/* API Key */}
            <div className="sai-card">
              <h3 style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} style={{ color: '#f59e0b' }} /> Gemini API Key
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>
                Powers all AI features. Get a free key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b' }}>Google AI Studio</a>.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px' }}>
                <input
                  type="password"
                  value={profile?.geminiApiKey || ''}
                  onChange={e => setProfile(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                  placeholder="Paste your API key..."
                  style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8125rem' }}
                />
                <button onClick={saveProfile} className="btn btn-primary btn-sm">Save</button>
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
              <button onClick={saveProfile} className="btn btn-primary"><Save size={16} /> Save Profile</button>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialAI;
