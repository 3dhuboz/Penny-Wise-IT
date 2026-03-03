// Use Google DNS locally to resolve MongoDB Atlas SRV records (skip on Vercel)
if (!process.env.VERCEL) {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://pennywiseit.com.au', 'https://www.pennywiseit.com.au', /\.vercel\.app$/]
    : 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection — cached for serverless (Vercel cold starts)
let dbConnected = false;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pennywise-it';

async function connectDB() {
  if (dbConnected && mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    dbConnected = true;
    console.log('MongoDB connected successfully');
    // Auto-seed marketplace apps (upsert)
    const AppDefinition = require('./models/AppDefinition');
    const seedApps = [
      {
        slug: 'social-ai-studio',
        name: 'SocialAI Studio',
        shortDescription: 'AI-powered social media content generator and scheduler. Create weeks of engaging posts in minutes.',
        fullDescription: 'SocialAI Studio uses Google Gemini AI to generate on-brand social media content, images, and full 2-week posting schedules for Facebook and Instagram. Each subscriber gets their own branded AI social media manager with full white-label control.',
        icon: 'sparkles',
        category: 'marketing',
        routePath: '/social',
        setupFee: 299,
        features: ['AI Content Generation', 'AI Image Generation', 'Smart 2-Week Scheduler', 'Content Calendar', 'Engagement Insights', 'Multi-Platform (Facebook & Instagram)', 'White-Label Branding', 'Export Data'],
        techStack: ['Google Gemini AI', 'React', 'Node.js', 'MongoDB'],
        plans: [
          { key: 'starter', name: 'Starter', price: 49, yearlyPrice: 490, features: ['AI Content Generation', 'Content Calendar', 'Basic Insights', '1 Brand Profile'], color: '#3b82f6', whiteLabel: false, customDomain: false },
          { key: 'professional', name: 'Professional', price: 99, yearlyPrice: 990, features: ['Everything in Starter', 'Smart AI Scheduler', 'AI Image Generation', 'Advanced Insights', 'White-Label Branding', '3 Brand Profiles'], popular: true, color: '#f59e0b', whiteLabel: true, customDomain: false },
          { key: 'enterprise', name: 'Enterprise', price: 199, yearlyPrice: 1990, features: ['Everything in Professional', 'Custom Domain', 'Priority Support', 'API Access', 'Unlimited Brand Profiles', 'Dedicated Account Manager'], color: '#a855f7', whiteLabel: true, customDomain: true }
        ],
        isActive: true, isPublished: true, displayOrder: 1
      },
      {
        slug: 'foodtruc',
        name: 'Food Truck',
        shortDescription: 'White-label mobile ordering platform for food trucks, caterers, and pop-up kitchens. Online ordering, payments, AI assistant, and loyalty — all under your brand.',
        fullDescription: 'Food Truck is a fully-featured, mobile-first ordering web app purpose-built for food trucks, BBQ vendors, caterers, and pop-up kitchens. Customers can browse your menu, place takeaway or catering orders, pay via Square, track deliveries, and earn loyalty stamps — all from a PWA that works offline. The admin dashboard gives you full control over orders, menu items, cook-day planner, customer database, email/SMS blasts, social content generation, and AI-powered chat assistance. Every element — colours, logos, business name, images — is white-label configurable so it looks 100% yours.',
        icon: 'zap',
        category: 'food-service',
        routePath: '/foodtruc',
        setupFee: 499,
        features: ['Online Ordering (Takeaway & Catering)', 'DIY Catering Builder', 'Square Payment Integration', 'AI Chat Assistant (Gemini + Claude)', 'Admin Dashboard & Order Management', 'Loyalty Rewards Program', 'Email & SMS Notifications', 'Cook-Day Planner & Events Calendar', 'Customer Gallery with Moderation', 'PWA — Installable & Offline Ready', 'Full White-Label Branding', 'Delivery Tracking'],
        techStack: ['React 19', 'TypeScript', 'Firebase', 'Square Payments', 'Google Gemini AI', 'Twilio SMS', 'Vite', 'TailwindCSS'],
        plans: [
          { key: 'starter', name: 'Starter', price: 79, yearlyPrice: 790, features: ['Online Menu & Ordering', 'Square Payments', 'Order Management Dashboard', 'Cook-Day Planner', 'Email Notifications', '1 Location'], color: '#10b981', whiteLabel: false, customDomain: false },
          { key: 'professional', name: 'Professional', price: 149, yearlyPrice: 1490, features: ['Everything in Starter', 'DIY Catering Builder', 'Loyalty Rewards Program', 'SMS Notifications (Twilio)', 'AI Chat Assistant', 'Customer Gallery', 'Full White-Label Branding', '3 Locations'], popular: true, color: '#f59e0b', whiteLabel: true, customDomain: false },
          { key: 'enterprise', name: 'Enterprise', price: 299, yearlyPrice: 2990, features: ['Everything in Professional', 'Custom Domain', 'Multi-Location Management', 'Priority Support', 'AI Social Content Generator', 'Advanced Analytics', 'Dedicated Account Manager', 'Unlimited Locations'], color: '#a855f7', whiteLabel: true, customDomain: true }
        ],
        isActive: true, isPublished: true, displayOrder: 2
      },
      {
        slug: 'autohue',
        name: 'AutoHue',
        shortDescription: 'AI-powered car photo colour sorter. Upload vehicle photos and let AI detect cars, identify colours, and sort them into organised folders instantly.',
        fullDescription: 'AutoHue uses YOLOv8 neural networks and K-means colour clustering to automatically detect vehicles in photos, extract the dominant colour, and sort images into 11 colour-coded folders. Perfect for car dealerships, automotive photographers, and auction houses who need to organise thousands of vehicle photos quickly. Upload in bulk, download sorted results as a ZIP. White-label it with your own branding for your business or clients.',
        icon: 'palette',
        category: 'automotive',
        routePath: '/autohue',
        demoUrl: 'https://autohue.vercel.app',
        setupFee: 199,
        features: ['AI Car Detection (YOLOv8)', 'Dominant Colour Extraction', '11 Colour Categories', 'Bulk Photo Upload', 'Automatic Folder Sorting', 'ZIP Download Export', 'Real-Time Processing Status', 'White-Label Branding', 'API Access'],
        techStack: ['YOLOv8', 'PyTorch', 'OpenCV', 'K-Means Clustering', 'React', 'Vercel'],
        plans: [
          { key: 'starter', name: 'Starter', price: 29, yearlyPrice: 290, features: ['Up to 500 photos/month', 'AI Car Detection', '11 Colour Categories', 'ZIP Export', 'Email Support'], color: '#06b6d4', whiteLabel: false, customDomain: false },
          { key: 'professional', name: 'Professional', price: 69, yearlyPrice: 690, features: ['Everything in Starter', 'Unlimited Photos', 'API Access', 'Batch Processing', 'White-Label Branding', 'Priority Processing'], popular: true, color: '#f59e0b', whiteLabel: true, customDomain: false },
          { key: 'enterprise', name: 'Enterprise', price: 149, yearlyPrice: 1490, features: ['Everything in Professional', 'Custom Domain', 'Custom Colour Categories', 'Dedicated Support', 'SLA-Backed Uptime', 'Multi-User Access'], color: '#a855f7', whiteLabel: true, customDomain: true }
        ],
        isActive: true, isPublished: true, displayOrder: 3
      }
    ];
    for (const appData of seedApps) {
      await AppDefinition.findOneAndUpdate({ slug: appData.slug }, { $set: appData }, { upsert: true, new: true });
    }
    console.log('Marketplace apps synced (' + seedApps.length + ' apps)');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    dbConnected = false;
    throw err;
  }
}

// Ensure DB is connected before handling any API request
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ message: 'Database connection failed', error: err.message });
  }
});

// For non-serverless (local dev), connect immediately
if (!process.env.VERCEL) {
  connectDB().catch(err => console.error('Initial DB connect failed:', err.message));
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/workflows', require('./routes/workflows'));
app.use('/api/siteground', require('./routes/siteground'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/social', require('./routes/social'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/invoices', require('./routes/invoices'));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// Vercel: export only, no listen(). Passenger: use passenger socket. Otherwise: normal listen.
if (process.env.VERCEL) {
  // Vercel serverless — do not call listen()
} else if (typeof(PhusionPassenger) !== 'undefined') {
  app.listen('passenger');
  console.log('Penny Wise I.T running via Phusion Passenger');
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Penny Wise I.T server running on port ${PORT}`);
  });
}

module.exports = app;
