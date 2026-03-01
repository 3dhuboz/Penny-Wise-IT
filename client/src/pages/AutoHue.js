import React from 'react';
import { Link } from 'react-router-dom';
import {
  Palette, Camera, Cpu, Download, Upload, FolderOpen,
  CheckCircle, ArrowRight, Zap, ExternalLink, Car, Eye, Layers
} from 'lucide-react';
import './AutoHue.css';

const AutoHue = () => {
  const colorCategories = [
    { name: 'Red', colors: 'Maroon, Burgundy, Crimson', hex: '#dc2626' },
    { name: 'Blue', colors: 'Navy, Royal, Sky', hex: '#2563eb' },
    { name: 'Green', colors: 'Emerald, Forest, Lime', hex: '#16a34a' },
    { name: 'Yellow', colors: 'Gold, Amber, Mustard', hex: '#eab308' },
    { name: 'Orange', colors: 'Tangerine, Coral', hex: '#ea580c' },
    { name: 'Purple', colors: 'Violet, Indigo, Magenta', hex: '#9333ea' },
    { name: 'Pink', colors: 'Rose, Fuchsia', hex: '#ec4899' },
    { name: 'Brown', colors: 'Tan, Beige, Khaki', hex: '#92400e' },
    { name: 'Black/Gray', colors: 'Charcoal, Slate', hex: '#374151' },
    { name: 'White', colors: 'Cream, Ivory, Pearl', hex: '#e5e7eb' },
    { name: 'Metallic', colors: 'Chrome, Steel, Aluminum', hex: '#94a3b8' }
  ];

  return (
    <div className="autohue-page">
      {/* Hero */}
      <section className="ah-hero">
        <div className="container">
          <div className="ah-hero-badge">
            <Palette size={14} /> FREE TOOL
          </div>
          <h1>AutoHue</h1>
          <p className="ah-hero-sub">
            AI-powered car photo color sorter. Upload your vehicle photos and let AI automatically
            detect cars, identify colours, and sort them into organised folders.
          </p>
          <div className="ah-hero-actions">
            <a href="https://autohue.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              Launch AutoHue <ExternalLink size={18} />
            </a>
            <a href="#how-it-works" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
              How It Works
            </a>
          </div>
          <div className="ah-hero-stats">
            <div><strong>YOLOv8 AI</strong><span>Car Detection</span></div>
            <div><strong>11 Colours</strong><span>Auto-Sorted</span></div>
            <div><strong>100% Free</strong><span>No Account Needed</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="ah-features">
        <div className="container">
          <h2 className="section-heading">Powerful Features, Zero Cost</h2>
          <p className="section-sub">Built with enterprise-grade AI, available for free.</p>

          <div className="ah-features-grid">
            <div className="ah-feature-card">
              <div className="ah-feature-icon" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}><Upload size={28} /></div>
              <h3>Bulk Upload</h3>
              <p>Upload multiple car photos at once. Drag and drop or browse — process entire batches in one go.</p>
            </div>
            <div className="ah-feature-card">
              <div className="ah-feature-icon" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}><Cpu size={28} /></div>
              <h3>AI Car Detection</h3>
              <p>YOLOv8 neural network automatically detects and isolates vehicles in every image with high accuracy.</p>
            </div>
            <div className="ah-feature-card">
              <div className="ah-feature-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Palette size={28} /></div>
              <h3>Colour Classification</h3>
              <p>K-means clustering identifies the dominant colour of each vehicle and maps it to 11 colour categories.</p>
            </div>
            <div className="ah-feature-card">
              <div className="ah-feature-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><FolderOpen size={28} /></div>
              <h3>Automatic Sorting</h3>
              <p>Photos are automatically organised into colour-coded folders — no manual work required.</p>
            </div>
            <div className="ah-feature-card">
              <div className="ah-feature-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><Download size={28} /></div>
              <h3>ZIP Export</h3>
              <p>Download all sorted photos as a single ZIP file, ready for use in your inventory or listings.</p>
            </div>
            <div className="ah-feature-card">
              <div className="ah-feature-icon" style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}><Eye size={28} /></div>
              <h3>Real-Time Progress</h3>
              <p>Watch live processing status as each image is analysed, detected, and colour-classified.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="ah-how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="section-heading">How It Works</h2>
          <p className="section-sub">Four simple steps from upload to sorted results.</p>

          <div className="ah-steps">
            <div className="ah-step">
              <div className="ah-step-number">1</div>
              <h3>Upload Photos</h3>
              <p>Drag and drop your car photos or click to browse. Supports JPG, PNG, GIF, and BMP formats.</p>
            </div>
            <div className="ah-step">
              <div className="ah-step-number">2</div>
              <h3>AI Detects Cars</h3>
              <p>YOLOv8 scans each image to locate and isolate vehicles, even in complex backgrounds.</p>
            </div>
            <div className="ah-step">
              <div className="ah-step-number">3</div>
              <h3>Colours Extracted</h3>
              <p>K-means clustering analyses the detected vehicle region and identifies its dominant colour.</p>
            </div>
            <div className="ah-step">
              <div className="ah-step-number">4</div>
              <h3>Download Sorted</h3>
              <p>Photos are sorted into colour folders and packaged as a ZIP. Download and you're done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Color Categories */}
      <section className="ah-colors">
        <div className="container">
          <h2 className="section-heading">11 Colour Categories</h2>
          <p className="section-sub">AutoHue recognises a wide range of shades and maps them to these groups.</p>

          <div className="ah-color-grid">
            {colorCategories.map((cat, i) => (
              <div key={i} className="ah-color-chip">
                <div className="ah-color-swatch" style={{ background: cat.hex }}></div>
                <div>
                  <strong>{cat.name}</strong>
                  <span>{cat.colors}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="ah-use-cases">
        <div className="container">
          <h2 className="section-heading">Perfect For</h2>
          <div className="ah-use-grid">
            <div className="ah-use-card">
              <Car size={32} />
              <h3>Car Dealerships</h3>
              <p>Organise your entire vehicle inventory photos by colour for quick listing and marketing.</p>
            </div>
            <div className="ah-use-card">
              <Camera size={32} />
              <h3>Automotive Photographers</h3>
              <p>Sort thousands of car shoot photos in minutes instead of hours of manual work.</p>
            </div>
            <div className="ah-use-card">
              <Layers size={32} />
              <h3>Auction Houses</h3>
              <p>Quickly categorise incoming vehicle photos for catalogue organisation and display.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="ah-tech">
        <div className="container">
          <div className="ah-tech-card">
            <h2>Built With Serious Tech</h2>
            <div className="ah-tech-grid">
              <div className="ah-tech-item">
                <strong>YOLOv8</strong>
                <span>Object Detection</span>
              </div>
              <div className="ah-tech-item">
                <strong>K-Means</strong>
                <span>Colour Extraction</span>
              </div>
              <div className="ah-tech-item">
                <strong>OpenCV</strong>
                <span>Image Processing</span>
              </div>
              <div className="ah-tech-item">
                <strong>PyTorch</strong>
                <span>Machine Learning</span>
              </div>
            </div>
            <p style={{ color: '#c4b5fd', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              Open source under MIT License.
              <a href="https://github.com/3dhuboz/autohue" target="_blank" rel="noopener noreferrer" style={{ color: '#fcd34d', marginLeft: '0.5rem' }}>
                View on GitHub <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ah-cta">
        <div className="container">
          <Palette size={40} style={{ color: '#06b6d4', marginBottom: '1rem' }} />
          <h2>Ready to Sort Your Car Photos?</h2>
          <p>Free to use. No sign-up required. Just upload and go.</p>
          <a href="https://autohue.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            Launch AutoHue <ExternalLink size={18} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default AutoHue;
