import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Server, Code, Workflow, Shield, Lightbulb, ArrowRight, CheckCircle, Star, Zap, Globe,
  Sparkles, Wand2, Brain, BarChart3, Palette, Camera, Cpu, Download, ExternalLink,
  Wrench, Search, Target, Clock, TrendingUp, Users, AlertTriangle, Settings, Database, Layers
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
              <Wrench size={14} /> Australian I.T Problem Solvers
            </div>
            <h1>You've Got a Problem.<br /><span className="hero-highlight">We Fix It.</span></h1>
            <p className="hero-subtitle">
              Broken systems, messy workflows, slow websites, complex challenges nobody else
              wants to touch. That's exactly where we come in. We diagnose, we build, we fix
              — and we integrate cutting-edge smarts where it actually matters.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Tell Us Your Problem <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn btn-outline btn-lg">
                See How We Work
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
                <div className="code-line"><span className="code-keyword">const</span> <span className="code-var">problem</span> = <span className="code-func">diagnose</span>({`{`}</div>
                <div className="code-line indent"><span className="code-prop">broken</span>: <span className="code-string">'workflows'</span>,</div>
                <div className="code-line indent"><span className="code-prop">slow</span>: <span className="code-string">'systems'</span>,</div>
                <div className="code-line indent"><span className="code-prop">complex</span>: <span className="code-string">'data problems'</span>,</div>
                <div className="code-line indent"><span className="code-prop">fix</span>: <span className="code-string">'all of the above'</span></div>
                <div className="code-line">{`}`});</div>
                <div className="code-line"><span className="code-comment">// Consider it handled.</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="problems-section">
        <div className="container">
          <div className="section-header">
            <h2>Problems We Solve Every Day</h2>
            <p>If it's broken, complicated, or just not working — we've probably fixed it before</p>
          </div>
          <div className="problems-grid">
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><AlertTriangle size={24} /></div>
              <h3>Broken Workflows</h3>
              <p>Manual processes, spreadsheet chaos, things falling through the cracks. We replace the mess with systems that actually work.</p>
            </div>
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Clock size={24} /></div>
              <h3>Slow, Unreliable Websites</h3>
              <p>Your site is slow, goes down, or the host doesn't care. We move you to rock-solid infrastructure and keep it running.</p>
            </div>
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}><Database size={24} /></div>
              <h3>Data That's Everywhere</h3>
              <p>Customer data in five places, no single source of truth. We build databases and dashboards that unify everything.</p>
            </div>
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}><Settings size={24} /></div>
              <h3>Off-the-Shelf Doesn't Fit</h3>
              <p>You've tried the generic tools and they don't do what you need. We build custom applications from scratch, tailored to your exact workflow.</p>
            </div>
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Layers size={24} /></div>
              <h3>Complex Challenges</h3>
              <p>Car photo sorting, social media scheduling, wiring diagrams — whatever the problem, we integrate cutting-edge smarts to crack it.</p>
            </div>
            <div className="problem-card card fade-in">
              <div className="problem-icon" style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}><TrendingUp size={24} /></div>
              <h3>Scaling Pains</h3>
              <p>What worked for 10 customers breaks at 100. We re-architect, optimise, and build systems that grow with you.</p>
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
                <p>You tell us what's broken. We dig in, understand the root cause, and figure out what's actually needed — not what sounds fancy.</p>
              </div>
            </div>
            <div className="approach-step">
              <div className="approach-number">2</div>
              <div className="approach-content">
                <h3><Target size={20} /> Design the Fix</h3>
                <p>We map out a solution that fits your budget and timeline. If cutting-edge tech solves it better, we use it. If a simple script does the job, we do that instead.</p>
              </div>
            </div>
            <div className="approach-step">
              <div className="approach-number">3</div>
              <div className="approach-content">
                <h3><Wrench size={20} /> Build & Deploy</h3>
                <p>We build it from scratch, test it thoroughly, deploy it to production, and make sure it works in the real world — not just on a demo.</p>
              </div>
            </div>
            <div className="approach-step">
              <div className="approach-number">4</div>
              <div className="approach-content">
                <h3><Shield size={20} /> Support & Evolve</h3>
                <p>We don't disappear after launch. We monitor, maintain, and improve. When your needs change, the system adapts.</p>
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
            <p>We're not a flashy agency. We're the people you call when it needs to actually work.</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <Wrench size={24} className="why-icon" />
              <h3>Fixers First</h3>
              <p>We exist to solve problems. Not to upsell you on things you don't need. If it's broken, we fix it. Simple as that.</p>
            </div>
            <div className="why-card">
              <Code size={24} className="why-icon" />
              <h3>Built From Scratch</h3>
              <p>No cookie-cutter templates. Every app, workflow, and system is purpose-built for your specific challenge.</p>
            </div>
            <div className="why-card">
              <Zap size={24} className="why-icon" />
              <h3>Cutting-Edge Where It Counts</h3>
              <p>We don't chase trends. But when smart technology — like machine learning or automation — genuinely solves the problem better, we integrate it.</p>
            </div>
            <div className="why-card">
              <Users size={24} className="why-icon" />
              <h3>Long-Term Partner</h3>
              <p>We're not a one-and-done shop. We stick around, keep things running, and evolve the solution as your business grows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Examples */}
      <section className="examples-section">
        <div className="container">
          <div className="section-header">
            <h2>Real Problems, Real Solutions</h2>
            <p>Here's how we've applied cutting-edge smarts to solve complex, real-world problems</p>
          </div>
          <div className="examples-grid">
            <div className="example-card">
              <div className="example-header">
                <Palette size={20} style={{ color: '#06b6d4' }} />
                <span className="example-label">AutoHue</span>
              </div>
              <h3>Car Dealership Needed Photos Sorted by Colour</h3>
              <p>Thousands of vehicle photos, zero organisation. We built an app that uses machine vision to detect cars, extract their dominant colour, and sort everything into labelled folders automatically. What used to take hours now takes minutes.</p>
              <div className="example-actions">
                <Link to="/autohue" className="service-link">See How It Works <ArrowRight size={14} /></Link>
                <a href="https://autohue.vercel.app" target="_blank" rel="noopener noreferrer" className="service-link">Try It Free <ExternalLink size={14} /></a>
              </div>
            </div>
            <div className="example-card">
              <div className="example-header">
                <Sparkles size={20} style={{ color: '#f59e0b' }} />
                <span className="example-label">SocialAI Studio</span>
              </div>
              <h3>Small Businesses Struggling with Social Media</h3>
              <p>Most small businesses know they need to post on social media but don't have the time or ideas. We built a tool that generates on-brand content, images, and a full 2-week posting schedule — tailored to their industry and audience.</p>
              <div className="example-actions">
                <Link to="/social-ai" className="service-link">See Plans <ArrowRight size={14} /></Link>
              </div>
            </div>
            <div className="example-card">
              <div className="example-header">
                <Workflow size={20} style={{ color: '#a855f7' }} />
                <span className="example-label">Custom Build</span>
              </div>
              <h3>Messy Spreadsheets Replaced with Real Systems</h3>
              <p>A growing business was running on a tangle of shared spreadsheets and email chains. We built a custom workflow engine with role-based dashboards, automated task assignment, and real-time tracking — all from scratch.</p>
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
            <p>The tools and services we use to fix your problems</p>
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
            <h2>Got a Problem That Needs Fixing?</h2>
            <p>Tell us what's broken, what's slow, or what's driving you crazy. We'll figure out the smartest way to solve it.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Let's Talk <ArrowRight size={18} /></Link>
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
  { title: 'SocialAI Studio', shortDescription: 'Smart social media content generation and scheduling for your business.', icon: 'sparkles', features: ['Content Generation', 'Smart Scheduling', 'Engagement Insights'] },
  { title: 'AutoHue', shortDescription: 'Free car photo colour sorter. Upload vehicle photos and auto-sort by colour.', icon: 'palette', features: ['Car Detection', 'Colour Classification', 'ZIP Export'] }
];

export default Home;
