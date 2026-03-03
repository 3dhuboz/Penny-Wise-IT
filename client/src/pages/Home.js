import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Server, Code, Workflow, Shield, Lightbulb, ArrowRight, CheckCircle, Star, Zap, Globe,
  Sparkles, Wand2, Brain, BarChart3, Palette, Camera, Cpu, Download, ExternalLink,
  Wrench, Search, Target, Clock, TrendingUp, Users, AlertTriangle, Settings, Database, Layers,
  DollarSign, Timer, Rocket
} from 'lucide-react';
import api from '../api';
import './Home.css';

const iconMap = {
  server: Server, code: Code, workflow: Workflow, shield: Shield, lightbulb: Lightbulb, globe: Globe, sparkles: Sparkles, palette: Palette
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
            <img src="/logo.png" alt="Penny Wise I.T" className="hero-logo" />
            <div className="hero-badge">
              <Zap size={14} /> Apps That Save You Time & Money
            </div>
            <h1>Stop Wasting Hours.<br /><span className="hero-highlight">Start Automating.</span></h1>
            <p className="hero-subtitle">
              We build smart apps and systems that replace manual work, cut costs, and give you
              back your time. Real tools for real businesses — built from scratch in Australia.
            </p>
            <div className="hero-actions">
              <Link to="/marketplace" className="btn btn-primary btn-lg">
                Browse Our Apps <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Get a Custom Solution
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <strong>10x</strong>
                <span>Faster</span>
              </div>
              <div className="stat">
                <strong>50%</strong>
                <span>Cost Saved</span>
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
                <div className="code-line"><span className="code-keyword">const</span> <span className="code-var">savings</span> = <span className="code-func">automate</span>({`{`}</div>
                <div className="code-line indent"><span className="code-prop">manual_hours</span>: <span className="code-string">'eliminated'</span>,</div>
                <div className="code-line indent"><span className="code-prop">costs</span>: <span className="code-string">'halved'</span>,</div>
                <div className="code-line indent"><span className="code-prop">errors</span>: <span className="code-string">'gone'</span>,</div>
                <div className="code-line indent"><span className="code-prop">growth</span>: <span className="code-string">'unlocked'</span></div>
                <div className="code-line">{`}`});</div>
                <div className="code-line"><span className="code-comment">// Your business, supercharged.</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props - Save Time & Money */}
      <section className="value-section">
        <div className="container">
          <div className="section-header">
            <h2>Apps That Actually <span className="section-highlight">Pay For Themselves</span></h2>
            <p>Every tool we build is designed to save you more than it costs — usually within the first month</p>
          </div>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}><Timer size={28} /></div>
              <span className="value-number">10x</span>
              <h3>Faster Than Manual</h3>
              <p>Tasks that took hours now take minutes. Our apps automate the repetitive work so you can focus on growing your business.</p>
            </div>
            <div className="value-card">
              <div className="value-icon" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88' }}><DollarSign size={28} /></div>
              <span className="value-number">50%</span>
              <h3>Average Cost Reduction</h3>
              <p>Replace expensive manual processes, eliminate errors, and cut the tools you're overpaying for. One app, massive savings.</p>
            </div>
            <div className="value-card">
              <div className="value-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}><Rocket size={28} /></div>
              <span className="value-number">24/7</span>
              <h3>Works While You Sleep</h3>
              <p>Your apps don't take days off. Automated workflows, scheduled tasks, and smart systems running around the clock.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section 1 - Business Automation */}
      <section className="video-section">
        <div className="container">
          <div className="video-grid">
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/Rta13IKAEW4?autoplay=0&rel=0&modestbranding=1"
                title="Business Automation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-content">
              <h3>Replace Manual Work With <span className="highlight-text">Smart Automation</span></h3>
              <p>
                Every hour your team spends on repetitive tasks is money down the drain.
                We build apps that do the heavy lifting — so your people can focus on what actually matters.
              </p>
              <ul className="video-features">
                <li><CheckCircle size={16} /> Automate data entry, sorting, and reporting</li>
                <li><CheckCircle size={16} /> Eliminate human error from critical workflows</li>
                <li><CheckCircle size={16} /> Get real-time dashboards instead of spreadsheet chaos</li>
                <li><CheckCircle size={16} /> Scale without hiring more staff</li>
              </ul>
              <Link to="/services" className="btn btn-primary">
                See Our Solutions <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="problems-section">
        <div className="container">
          <div className="section-header">
            <h2>Problems We <span className="section-highlight">Eliminate</span></h2>
            <p>If it's costing you time, money, or sanity — we've probably built a fix for it</p>
          </div>
          <div className="problems-grid">
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(255,71,87,0.1)', color: '#ff4757' }}><AlertTriangle size={24} /></div>
              <h3>Broken Workflows</h3>
              <p>Manual processes, spreadsheet chaos, things falling through the cracks. We replace the mess with systems that actually work.</p>
            </div>
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}><Clock size={24} /></div>
              <h3>Wasted Hours</h3>
              <p>Your team is doing the same tasks over and over. Our apps automate the repetitive stuff and give you those hours back.</p>
            </div>
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}><Database size={24} /></div>
              <h3>Data Everywhere</h3>
              <p>Customer data in five places, no single source of truth. We build dashboards that unify everything in one place.</p>
            </div>
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}><Settings size={24} /></div>
              <h3>Generic Tools Don't Fit</h3>
              <p>Off-the-shelf software can't do what you need. We build custom apps from scratch, tailored to your exact workflow.</p>
            </div>
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88' }}><Layers size={24} /></div>
              <h3>Too Many Subscriptions</h3>
              <p>Paying for 10 different tools that half-work? We consolidate everything into one purpose-built app that does it all.</p>
            </div>
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(255,0,110,0.1)', color: '#ff006e' }}><TrendingUp size={24} /></div>
              <h3>Can't Scale</h3>
              <p>What worked for 10 customers breaks at 100. We build systems that grow with you — without growing your costs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section 2 - App Showcase */}
      <section className="video-section">
        <div className="container">
          <div className="video-grid reverse">
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/2U1FChFPMbk?autoplay=0&rel=0&modestbranding=1"
                title="Custom App Development"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-content">
              <h3>Ready-to-Go Apps in Our <span className="highlight-text">Marketplace</span></h3>
              <p>
                Don't want to wait for a custom build? Browse our marketplace of pre-built apps — each one designed 
                to solve a specific business problem and save you real money from day one.
              </p>
              <ul className="video-features">
                <li><CheckCircle size={16} /> AI-powered social media content generator</li>
                <li><CheckCircle size={16} /> Mobile ordering platform for food businesses</li>
                <li><CheckCircle size={16} /> Vehicle photo colour sorting with machine vision</li>
                <li><CheckCircle size={16} /> All white-labelled under your brand</li>
              </ul>
              <Link to="/marketplace" className="btn btn-primary">
                Explore Marketplace <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="approach-section">
        <div className="container">
          <div className="section-header">
            <h2>How We Work</h2>
            <p>No fluff, no buzzwords — just a clear process that gets results</p>
          </div>
          <div className="approach-steps">
            <div className="approach-step">
              <div className="approach-number">1</div>
              <div className="approach-content">
                <h3><Search size={20} /> Listen & Diagnose</h3>
                <p>You tell us what's costing you time and money. We dig in and figure out the smartest fix — not the most expensive one.</p>
              </div>
            </div>
            <div className="approach-step">
              <div className="approach-number">2</div>
              <div className="approach-content">
                <h3><Target size={20} /> Design the Solution</h3>
                <p>We map out exactly what to build, how it saves you money, and when you'll see the ROI. No surprises.</p>
              </div>
            </div>
            <div className="approach-step">
              <div className="approach-number">3</div>
              <div className="approach-content">
                <h3><Wrench size={20} /> Build & Deploy</h3>
                <p>We build it from scratch, test it in the real world, and deploy it to production. You start saving immediately.</p>
              </div>
            </div>
            <div className="approach-step">
              <div className="approach-number">4</div>
              <div className="approach-content">
                <h3><Shield size={20} /> Support & Evolve</h3>
                <p>We don't disappear. We monitor, maintain, and improve. As your business grows, your tools grow with it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="why-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Penny Wise I.T?</h2>
            <p>We build tools that make you money — not drain it</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <DollarSign size={24} className="why-icon" />
              <h3>ROI-Focused</h3>
              <p>Every app we build is designed to save you more than it costs. If it doesn't pay for itself, we don't build it.</p>
            </div>
            <div className="why-card">
              <Code size={24} className="why-icon" />
              <h3>Built From Scratch</h3>
              <p>No cookie-cutter templates. Every app is purpose-built for your specific problem and workflow.</p>
            </div>
            <div className="why-card">
              <Zap size={24} className="why-icon" />
              <h3>AI-Powered Smarts</h3>
              <p>We integrate machine learning and automation where it genuinely saves time — not just because it sounds cool.</p>
            </div>
            <div className="why-card">
              <Users size={24} className="why-icon" />
              <h3>Long-Term Partner</h3>
              <p>We stick around, keep things running, and evolve the solution as your business grows. No vendor lock-in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Examples */}
      <section className="examples-section">
        <div className="container">
          <div className="section-header">
            <h2>Real Problems, <span className="section-highlight">Real Savings</span></h2>
            <p>See how our apps save businesses real time and money every single day</p>
          </div>
          <div className="examples-grid">
            <div className="example-card">
              <div className="example-header">
                <Palette size={20} style={{ color: '#00d4ff' }} />
                <span className="example-label">AutoHue</span>
              </div>
              <h3>8 Hours of Photo Sorting → 5 Minutes</h3>
              <p>A car dealership was manually sorting thousands of vehicle photos by colour. Our AI app does it automatically — detecting cars, identifying colours, and organising everything into folders. They saved 40+ hours per month.</p>
              <div className="example-actions">
                <Link to="/autohue" className="service-link">See How It Works <ArrowRight size={14} /></Link>
                <a href="https://autohue.vercel.app" target="_blank" rel="noopener noreferrer" className="service-link">Try It Free <ExternalLink size={14} /></a>
              </div>
            </div>
            <div className="example-card">
              <div className="example-header">
                <Sparkles size={20} style={{ color: '#fbbf24' }} />
                <span className="example-label">SocialAI Studio</span>
              </div>
              <h3>$2,000/mo Social Media Manager → $49/mo App</h3>
              <p>Small businesses were paying agencies thousands for mediocre social posts. Our AI generates on-brand content, images, and a full 2-week schedule in minutes — for a fraction of the cost.</p>
              <div className="example-actions">
                <Link to="/social-ai" className="service-link">See Plans <ArrowRight size={14} /></Link>
              </div>
            </div>
            <div className="example-card">
              <div className="example-header">
                <Workflow size={20} style={{ color: '#8b5cf6' }} />
                <span className="example-label">Custom Build</span>
              </div>
              <h3>5 Spreadsheets → 1 Smart Dashboard</h3>
              <p>A growing business replaced their tangle of shared spreadsheets and email chains with a custom workflow engine — automated task assignment, real-time tracking, and role-based dashboards.</p>
              <div className="example-actions">
                <Link to="/contact" className="service-link">Tell Us Your Problem <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>What We Offer</h2>
            <p>The tools and services behind your time and money savings</p>
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

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Save Time & Money?</h2>
            <p>Tell us what's eating your hours and budget. We'll show you exactly how an app can fix it — and what it'll save you.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Let's Talk ROI <ArrowRight size={18} /></Link>
              <Link to="/marketplace" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                Browse Apps
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
  { title: 'Custom App Development', shortDescription: 'Bespoke applications that replace manual work and save you real money.', icon: 'code', features: ['Custom Web Apps', 'Mobile Apps', 'API Development'] },
  { title: 'Workflow Automation', shortDescription: 'Eliminate repetitive tasks and streamline your business processes.', icon: 'workflow', features: ['Process Automation', 'Smart Dashboards', 'Database Solutions'] },
  { title: 'Website Maintenance', shortDescription: 'Keep your website secure, updated, and performing at its best.', icon: 'shield', features: ['Security Updates', 'Performance Monitoring', 'Content Updates'] },
  { title: 'IT Consulting', shortDescription: 'Expert guidance on using technology to cut costs and save time.', icon: 'lightbulb', features: ['Technology Audits', 'Architecture Planning', 'Digital Strategy'] },
  { title: 'SocialAI Studio', shortDescription: 'AI-powered social media content that replaces expensive agencies.', icon: 'sparkles', features: ['Content Generation', 'Smart Scheduling', 'Brand Consistency'] },
  { title: 'AutoHue', shortDescription: 'AI car photo colour sorter — hours of manual work in minutes.', icon: 'palette', features: ['Car Detection', 'Colour Classification', 'ZIP Export'] }
];

export default Home;
