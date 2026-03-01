import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, Wand2, Brain, Calendar, BarChart3, Image as ImageIcon,
  CheckCircle, ArrowRight, Zap, Star, Users, Clock, Shield
} from 'lucide-react';
import './SocialAIProduct.css';

const SocialAIProduct = () => {
  const { user } = useAuth();

  const plans = [
    {
      name: 'Starter',
      price: 49,
      period: '/mo',
      description: 'Perfect for solo businesses getting started with AI social media.',
      features: [
        'AI Content Generation (50 posts/mo)',
        'Facebook & Instagram Optimised',
        'Content Calendar',
        'Brand Profile Setup',
        'Data Export',
        'Email Support'
      ],
      cta: 'Start Free Trial',
      highlight: false
    },
    {
      name: 'Professional',
      price: 99,
      period: '/mo',
      description: 'For growing businesses that want full AI-powered social management.',
      features: [
        'Unlimited AI Content Generation',
        'AI Marketing Image Creation',
        'Smart 2-Week Auto-Scheduler',
        'Engagement Insights & Analytics',
        'Best Posting Time Recommendations',
        'Brand Voice Customisation',
        'Content Calendar with Bulk Actions',
        'Priority Support'
      ],
      cta: 'Get Started',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 199,
      period: '/mo',
      description: 'Full white-glove service with dedicated account management.',
      features: [
        'Everything in Professional',
        'Dedicated Account Manager',
        'Custom AI Model Training',
        'Multi-Brand Management',
        'Advanced Analytics Dashboard',
        'API Access for Integrations',
        'Monthly Strategy Review Call',
        'SLA-Backed Support'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  return (
    <div className="sai-product-page">
      {/* Hero */}
      <section className="sai-hero">
        <div className="container">
          <div className="sai-hero-badge">
            <Sparkles size={14} /> NEW PRODUCT
          </div>
          <h1>SocialAI Studio</h1>
          <p className="sai-hero-sub">
            AI-powered social media content generation and scheduling for your business.
            Create weeks of engaging content in minutes, not hours.
          </p>
          <div className="sai-hero-actions">
            {user ? (
              <Link to="/social" className="btn btn-primary btn-lg">
                <Sparkles size={18} /> Open SocialAI Studio
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Start Free Trial <ArrowRight size={18} />
                </Link>
                <a href="#pricing" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                  View Pricing
                </a>
              </>
            )}
          </div>
          <div className="sai-hero-stats">
            <div><strong>Google Gemini 2.5</strong><span>AI Engine</span></div>
            <div><strong>Facebook & Instagram</strong><span>Platforms</span></div>
            <div><strong>2-Week</strong><span>Smart Scheduling</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="sai-features">
        <div className="container">
          <h2 className="section-heading">Everything You Need for Social Media Success</h2>
          <p className="section-sub">Powered by the latest Google Gemini AI, tailored to your brand.</p>

          <div className="sai-features-grid">
            <div className="sai-feature-card">
              <div className="sai-feature-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Wand2 size={28} /></div>
              <h3>AI Content Generator</h3>
              <p>Write platform-optimised posts for Facebook and Instagram in seconds. AI adapts to your brand voice, industry, and audience.</p>
            </div>
            <div className="sai-feature-card">
              <div className="sai-feature-icon" style={{ background: 'rgba(79,70,229,0.1)', color: '#4f46e5' }}><ImageIcon size={28} /></div>
              <h3>AI Image Generation</h3>
              <p>Create stunning marketing visuals from text prompts. No design skills needed — AI generates professional images for your posts.</p>
            </div>
            <div className="sai-feature-card">
              <div className="sai-feature-icon" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}><Brain size={28} /></div>
              <h3>Smart AI Scheduler</h3>
              <p>Auto-generate a full 2-week content calendar optimised for engagement. AI picks the best times, platforms, and content mix.</p>
            </div>
            <div className="sai-feature-card">
              <div className="sai-feature-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><BarChart3 size={28} /></div>
              <h3>Engagement Insights</h3>
              <p>Get AI-powered recommendations on posting strategy, best times, and content that resonates with your audience.</p>
            </div>
            <div className="sai-feature-card">
              <div className="sai-feature-icon" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}><Calendar size={28} /></div>
              <h3>Content Calendar</h3>
              <p>Manage all your drafts, scheduled, and posted content in one place. Filter, edit, and organise with ease.</p>
            </div>
            <div className="sai-feature-card">
              <div className="sai-feature-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><Shield size={28} /></div>
              <h3>Brand-Safe AI</h3>
              <p>Configure your business profile and tone — AI ensures every post sounds authentically you. No generic content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="sai-how-it-works">
        <div className="container">
          <h2 className="section-heading">How It Works</h2>
          <div className="sai-steps">
            <div className="sai-step">
              <div className="sai-step-number">1</div>
              <h3>Set Up Your Profile</h3>
              <p>Tell AI about your business — name, type, tone, and location. This is used to tailor every piece of content.</p>
            </div>
            <div className="sai-step">
              <div className="sai-step-number">2</div>
              <h3>Add Your API Key</h3>
              <p>Paste your free Google Gemini API key. This powers all AI features at no additional cost to you.</p>
            </div>
            <div className="sai-step">
              <div className="sai-step-number">3</div>
              <h3>Generate & Schedule</h3>
              <p>Create individual posts or let Smart AI generate your entire 2-week calendar automatically.</p>
            </div>
            <div className="sai-step">
              <div className="sai-step-number">4</div>
              <h3>Grow Your Audience</h3>
              <p>Use AI Insights to optimise your strategy. Watch engagement grow with consistent, quality content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="sai-pricing" id="pricing">
        <div className="container">
          <h2 className="section-heading">Simple, Transparent Pricing</h2>
          <p className="section-sub">No hidden fees. Cancel anytime. All plans include a 14-day free trial.</p>

          <div className="sai-pricing-grid">
            {plans.map((plan, idx) => (
              <div key={idx} className={`sai-plan-card ${plan.highlight ? 'featured' : ''}`}>
                {plan.highlight && <div className="sai-plan-badge"><Star size={12} /> MOST POPULAR</div>}
                <h3>{plan.name}</h3>
                <div className="sai-plan-price">
                  <span className="sai-price-amount">${plan.price}</span>
                  <span className="sai-price-period">{plan.period}</span>
                </div>
                <p className="sai-plan-desc">{plan.description}</p>
                <ul className="sai-plan-features">
                  {plan.features.map((f, i) => (
                    <li key={i}><CheckCircle size={16} /> {f}</li>
                  ))}
                </ul>
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : user ? '/social' : '/register'}
                  className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'} btn-lg sai-plan-cta`}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="sai-social-proof">
        <div className="container">
          <div className="sai-proof-grid">
            <div className="sai-proof-item">
              <Zap size={32} style={{ color: '#f59e0b' }} />
              <strong>10x Faster</strong>
              <span>than manual content creation</span>
            </div>
            <div className="sai-proof-item">
              <Users size={32} style={{ color: '#f59e0b' }} />
              <strong>Small Business</strong>
              <span>built for real businesses</span>
            </div>
            <div className="sai-proof-item">
              <Clock size={32} style={{ color: '#f59e0b' }} />
              <strong>Hours Saved</strong>
              <span>every single week</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="sai-final-cta">
        <div className="container">
          <Sparkles size={40} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
          <h2>Ready to Transform Your Social Media?</h2>
          <p>Start your 14-day free trial today. No credit card required.</p>
          <Link to={user ? '/social' : '/register'} className="btn btn-primary btn-lg">
            {user ? 'Open SocialAI Studio' : 'Start Free Trial'} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SocialAIProduct;
