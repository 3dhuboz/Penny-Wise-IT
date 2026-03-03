const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

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
    ? ['https://pennywiseit.com.au', 'https://www.pennywiseit.com.au']
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

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pennywise-it')
  .then(async () => {
    console.log('MongoDB connected successfully');
    // Auto-seed marketplace apps (upsert — always ensures apps exist)
    try {
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
          features: ['AI Content Generation', 'AI Image Generation', 'Smart 2-Week Scheduler', 'Content Calendar', 'Engagement Insights', 'Multi-Platform (Facebook & Instagram)', 'White-Label Branding', 'Export Data'],
          techStack: ['Google Gemini AI', 'React', 'Node.js', 'MongoDB'],
          plans: [
            { key: 'starter', name: 'Starter', price: 49, features: ['AI Content Generation', 'Content Calendar', 'Basic Insights', '1 Brand Profile'], color: '#3b82f6', whiteLabel: false, customDomain: false },
            { key: 'professional', name: 'Professional', price: 99, features: ['Everything in Starter', 'Smart AI Scheduler', 'AI Image Generation', 'Advanced Insights', 'White-Label Branding', '3 Brand Profiles'], popular: true, color: '#f59e0b', whiteLabel: true, customDomain: false },
            { key: 'enterprise', name: 'Enterprise', price: 199, features: ['Everything in Professional', 'Custom Domain', 'Priority Support', 'API Access', 'Unlimited Brand Profiles', 'Dedicated Account Manager'], color: '#a855f7', whiteLabel: true, customDomain: true }
          ],
          isActive: true,
          isPublished: true,
          displayOrder: 1
        },
        {
          slug: 'foodtruc',
          name: 'FoodTruc',
          shortDescription: 'White-label mobile ordering platform for food trucks, caterers, and pop-up kitchens. Online ordering, payments, AI assistant, and loyalty — all under your brand.',
          fullDescription: 'FoodTruc is a fully-featured, mobile-first ordering web app purpose-built for food trucks, BBQ vendors, caterers, and pop-up kitchens. Customers can browse your menu, place takeaway or catering orders, pay via Square, track deliveries, and earn loyalty stamps — all from a PWA that works offline. The admin dashboard gives you full control over orders, menu items, cook-day planner, customer database, email/SMS blasts, social content generation, and AI-powered chat assistance. Every element — colours, logos, business name, images — is white-label configurable so it looks 100% yours.',
          icon: 'zap',
          category: 'food-service',
          routePath: '/foodtruc',
          features: [
            'Online Ordering (Takeaway & Catering)',
            'DIY Catering Builder',
            'Square Payment Integration',
            'AI Chat Assistant (Gemini + Claude)',
            'Admin Dashboard & Order Management',
            'Loyalty Rewards Program',
            'Email & SMS Notifications',
            'Cook-Day Planner & Events Calendar',
            'Customer Gallery with Moderation',
            'PWA — Installable & Offline Ready',
            'Full White-Label Branding',
            'Delivery Tracking'
          ],
          techStack: ['React 19', 'TypeScript', 'Firebase', 'Square Payments', 'Google Gemini AI', 'Twilio SMS', 'Vite', 'TailwindCSS'],
          plans: [
            { key: 'starter', name: 'Starter', price: 79, features: ['Online Menu & Ordering', 'Square Payments', 'Order Management Dashboard', 'Cook-Day Planner', 'Email Notifications', '1 Location'], color: '#10b981', whiteLabel: false, customDomain: false },
            { key: 'professional', name: 'Professional', price: 149, features: ['Everything in Starter', 'DIY Catering Builder', 'Loyalty Rewards Program', 'SMS Notifications (Twilio)', 'AI Chat Assistant', 'Customer Gallery', 'Full White-Label Branding', '3 Locations'], popular: true, color: '#f59e0b', whiteLabel: true, customDomain: false },
            { key: 'enterprise', name: 'Enterprise', price: 299, features: ['Everything in Professional', 'Custom Domain', 'Multi-Location Management', 'Priority Support', 'AI Social Content Generator', 'Advanced Analytics', 'Dedicated Account Manager', 'Unlimited Locations'], color: '#a855f7', whiteLabel: true, customDomain: true }
          ],
          isActive: true,
          isPublished: true,
          displayOrder: 2
        }
      ];
      for (const appData of seedApps) {
        await AppDefinition.findOneAndUpdate(
          { slug: appData.slug },
          { $set: appData },
          { upsert: true, new: true }
        );
      }
      console.log('Marketplace apps synced (' + seedApps.length + ' apps)');
    } catch (err) {
      console.error('Auto-seed error:', err.message);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

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

// In production on SiteGround, Phusion Passenger binds the port.
// Only call listen() when running standalone (dev or non-Passenger).
if (typeof(PhusionPassenger) === 'undefined') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Penny Wise I.T server running on port ${PORT}`);
  });
} else {
  app.listen('passenger');
  console.log('Penny Wise I.T running via Phusion Passenger');
}

module.exports = app;
