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
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? 'https://pennywiseit.com.au' : 'http://localhost:3000', credentials: true }));

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
    // Auto-seed marketplace apps if empty
    try {
      const AppDefinition = require('./models/AppDefinition');
      const count = await AppDefinition.countDocuments();
      if (count === 0) {
        await AppDefinition.insertMany([
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
            displayOrder: 1
          }
        ]);
        console.log('Marketplace apps auto-seeded');
      }
    } catch (err) {
      console.error('Auto-seed check error:', err.message);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Penny Wise I.T server running on port ${PORT}`);
});

module.exports = app;
