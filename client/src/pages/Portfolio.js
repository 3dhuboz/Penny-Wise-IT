import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import api from '../api';
import './Portfolio.css';

const categories = [
  { value: '', label: 'All Projects' },
  { value: 'web-hosting', label: 'Web Hosting' },
  { value: 'app-development', label: 'App Development' },
  { value: 'workflow-solutions', label: 'Workflow Solutions' },
  { value: 'website-design', label: 'Website Design' }
];

const Portfolio = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = filter ? `?category=${filter}` : '';
    api.get(`/portfolio${params}`).then(res => { setItems(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  return (
    <div className="portfolio-page">
      <section className="page-hero">
        <div className="container">
          <h1>Our Work</h1>
          <p>Showcasing projects we've delivered for businesses across Australia</p>
        </div>
      </section>

      <section className="container" style={{ padding: '2rem 1.5rem' }}>
        <div className="portfolio-filters">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`filter-btn ${filter === cat.value ? 'active' : ''}`}
              onClick={() => setFilter(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="page-loading">Loading portfolio...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <h3>Portfolio Coming Soon</h3>
            <p>We're preparing our showcase. Check back soon to see our latest projects!</p>
          </div>
        ) : (
          <div className="portfolio-grid">
            {items.map((item, idx) => (
              <div key={idx} className="portfolio-card card fade-in">
                {item.images && item.images[0] && (
                  <div className="pc-image">
                    <img src={item.images[0].url} alt={item.title} />
                  </div>
                )}
                <div className="pc-body">
                  <div className="pc-meta">
                    <span className="badge badge-info">{item.category?.replace(/-/g, ' ')}</span>
                    {item.completedDate && (
                      <span className="pc-date"><Calendar size={12} /> {new Date(item.completedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <h3>{item.title}</h3>
                  {item.client && <p className="pc-client">{item.client}</p>}
                  <p className="pc-desc">{item.description}</p>
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="pc-tech">
                      {item.technologies.map((t, i) => <span key={i} className="tech-tag">{t}</span>)}
                    </div>
                  )}
                  {item.liveUrl && (
                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="pc-link">
                      View Live <ExternalLink size={14} />
                    </a>
                  )}
                  {item.testimonial && item.testimonial.quote && (
                    <blockquote className="pc-testimonial">
                      <p>"{item.testimonial.quote}"</p>
                      <cite>- {item.testimonial.author}{item.testimonial.role ? `, ${item.testimonial.role}` : ''}</cite>
                    </blockquote>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Portfolio;
