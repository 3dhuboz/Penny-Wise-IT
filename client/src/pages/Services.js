import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Server, Code, Workflow, Shield, Lightbulb, Globe, CheckCircle, ArrowRight, Sparkles, Star } from 'lucide-react';
import api from '../api';
import './Services.css';

const iconMap = { server: Server, code: Code, workflow: Workflow, shield: Shield, lightbulb: Lightbulb, globe: Globe, sparkles: Sparkles };

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then(res => { setServices(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading services...</div>;

  return (
    <div className="services-page">
      <section className="page-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Complete technology solutions for your business - from hosting to custom apps and workflow automation</p>
        </div>
      </section>

      <section className="container services-detail-grid">
        {services.map((service, idx) => {
          const Icon = iconMap[service.icon] || Globe;
          const isSocialAI = service.category === 'social-ai';
          return (
            <div key={idx} className={`service-detail-card card fade-in${isSocialAI ? ' sdc-featured' : ''}`}>
              {isSocialAI && <div className="sdc-featured-badge"><Star size={12} /> FEATURED PRODUCT</div>}
              <div className="sdc-header">
                <div className="sdc-icon" style={isSocialAI ? { background: 'rgba(245,158,11,0.1)', color: '#f59e0b' } : {}}><Icon size={28} /></div>
                <div>
                  <h2>{service.title}</h2>
                  <span className="badge badge-info">{service.category?.replace(/-/g, ' ')}</span>
                </div>
              </div>
              <p className="sdc-description">{service.fullDescription || service.shortDescription}</p>
              {service.features && service.features.length > 0 && (
                <ul className="sdc-features">
                  {service.features.map((f, i) => (
                    <li key={i}><CheckCircle size={16} /> {f}</li>
                  ))}
                </ul>
              )}
              {service.pricing && (
                <div className="sdc-pricing">
                  {service.pricing.type === 'custom' ? (
                    <span className="price-label">Custom Quote</span>
                  ) : (
                    <span className="price-amount">
                      ${service.pricing.amount} <small>{service.pricing.currency}/{service.pricing.type === 'monthly' ? 'mo' : service.pricing.type === 'hourly' ? 'hr' : ''}</small>
                    </span>
                  )}
                </div>
              )}
              {isSocialAI ? (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link to="/social-ai" className="btn btn-primary">
                    View Plans & Pricing <ArrowRight size={16} />
                  </Link>
                  <Link to="/contact" className="btn btn-secondary">
                    Contact Sales
                  </Link>
                </div>
              ) : (
                <Link to="/contact" className="btn btn-primary">
                  Get Started <ArrowRight size={16} />
                </Link>
              )}
            </div>
          );
        })}
      </section>

      <section className="services-cta">
        <div className="container">
          <div className="cta-card">
            <h2>Need Something Custom?</h2>
            <p>Every business is unique. Let's discuss a tailored solution for yours.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">Get a Free Quote</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
