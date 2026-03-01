import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Server, Code, Workflow, Shield, Lightbulb, ArrowRight, CheckCircle, Star, Zap, Globe, Sparkles, Wand2, Brain, BarChart3 } from 'lucide-react';
import api from '../api';
import './Home.css';

const iconMap = {
  server: Server, code: Code, workflow: Workflow, shield: Shield, lightbulb: Lightbulb, globe: Globe, sparkles: Sparkles
};

const Home = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data)).catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in">
            <div className="hero-badge">
              <Zap size={14} /> Trusted Australian I.T Partner
            </div>
            <h1>Smart Technology.<br /><span className="hero-highlight">Wise Investment.</span></h1>
            <p className="hero-subtitle">
              Web hosting, custom applications built from the ground up, and workflow
              solutions that transform how your business operates.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="btn btn-primary btn-lg">
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Get a Free Quote
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <strong>99.9%</strong>
                <span>Uptime</span>
              </div>
              <div className="stat">
                <strong>24/7</strong>
                <span>Support</span>
              </div>
              <div className="stat">
                <strong>100%</strong>
                <span>Australian</span>
              </div>
            </div>
          </div>
          <div className="hero-visual fade-in">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
              </div>
              <div className="hero-card-body">
                <div className="code-line"><span className="code-keyword">const</span> <span className="code-var">business</span> = <span className="code-func">createApp</span>({`{`}</div>
                <div className="code-line indent"><span className="code-prop">hosting</span>: <span className="code-string">'SiteGround GoGeek'</span>,</div>
                <div className="code-line indent"><span className="code-prop">apps</span>: <span className="code-string">'Built from scratch'</span>,</div>
                <div className="code-line indent"><span className="code-prop">workflows</span>: <span className="code-string">'Fully automated'</span>,</div>
                <div className="code-line indent"><span className="code-prop">support</span>: <span className="code-string">'Always on'</span></div>
                <div className="code-line">{`}`});</div>
                <div className="code-line"><span className="code-comment">// Your success starts here</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>What We Do</h2>
            <p>End-to-end technology solutions tailored to your business needs</p>
          </div>
          <div className="services-grid">
            {(services.length > 0 ? services : defaultServices).map((service, idx) => {
              const Icon = iconMap[service.icon] || Globe;
              return (
                <div key={idx} className="service-card card fade-in">
                  <div className="service-icon"><Icon size={24} /></div>
                  <h3>{service.title}</h3>
                  <p>{service.shortDescription}</p>
                  <ul className="service-features">
                    {(service.features || []).slice(0, 3).map((f, i) => (
                      <li key={i}><CheckCircle size={14} /> {f}</li>
                    ))}
                  </ul>
                  <Link to="/services" className="service-link">
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Penny Wise I.T?</h2>
            <p>We are not just another I.T company</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <Star size={24} className="why-icon" />
              <h3>Built From Scratch</h3>
              <p>No cookie-cutter templates. Every app and workflow is custom-built to solve your specific challenges.</p>
            </div>
            <div className="why-card">
              <Shield size={24} className="why-icon" />
              <h3>Reliable Hosting</h3>
              <p>Powered by SiteGround GoGeek infrastructure with enterprise-grade security and 99.9% uptime.</p>
            </div>
            <div className="why-card">
              <Workflow size={24} className="why-icon" />
              <h3>True Workflow Solutions</h3>
              <p>We don't just build apps - we build complete database and workflow solutions that transform your operations.</p>
            </div>
            <div className="why-card">
              <Zap size={24} className="why-icon" />
              <h3>Ongoing Partnership</h3>
              <p>From initial concept through deployment and beyond. We are your long-term technology partner.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SocialAI Featured */}
      <section className="sai-featured-section">
        <div className="container">
          <div className="sai-featured-banner">
            <div className="sai-featured-content">
              <div className="sai-featured-badge-home"><Sparkles size={14} /> NEW</div>
              <h2>SocialAI Studio</h2>
              <p>AI-powered social media content generation. Create weeks of engaging Facebook & Instagram posts in minutes — powered by Google Gemini.</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/social-ai" className="btn btn-primary btn-lg">
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="sai-featured-visual">
              <div className="sai-featured-icons">
                <div className="sai-fi"><Sparkles size={24} /></div>
                <div className="sai-fi"><Wand2 size={24} /></div>
                <div className="sai-fi"><Brain size={24} /></div>
                <div className="sai-fi"><BarChart3 size={24} /></div>
              </div>
              <div className="sai-featured-price">From <strong>$49</strong>/mo</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Get Started?</h2>
            <p>Let's discuss how we can help your business grow with the right technology solutions.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Contact Us Today</Link>
              <Link to="/register" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const defaultServices = [
  { title: 'Web Hosting', shortDescription: 'Reliable, fast web hosting powered by SiteGround GoGeek infrastructure.', icon: 'server', features: ['SSD Storage', 'Free SSL', 'Daily Backups'] },
  { title: 'Custom App Development', shortDescription: 'Bespoke applications built from the ground up to solve your unique business challenges.', icon: 'code', features: ['Custom Web Apps', 'Mobile Apps', 'API Development'] },
  { title: 'Workflow Solutions', shortDescription: 'Streamline your business processes with custom workflow automation.', icon: 'workflow', features: ['Process Automation', 'Custom Dashboards', 'Database Solutions'] },
  { title: 'Website Maintenance', shortDescription: 'Keep your website secure, updated, and performing at its best.', icon: 'shield', features: ['Security Updates', 'Performance Monitoring', 'Content Updates'] },
  { title: 'IT Consulting', shortDescription: 'Expert guidance on technology strategy and digital transformation.', icon: 'lightbulb', features: ['Technology Audits', 'Architecture Planning', 'Digital Strategy'] },
  { title: 'SocialAI Studio', shortDescription: 'AI-powered social media content generator and scheduler for your business.', icon: 'sparkles', features: ['AI Content Generation', 'Smart Scheduling', 'Engagement Insights'] }
];

export default Home;
