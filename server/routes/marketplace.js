const express = require('express');
const AppDefinition = require('../models/AppDefinition');
const AppSubscription = require('../models/AppSubscription');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ══════════════════════════════════════════════
// PUBLIC — Browse Apps
// ══════════════════════════════════════════════

// List all published apps
router.get('/apps', async (req, res) => {
  try {
    const apps = await AppDefinition.find({ isActive: true, isPublished: true }).sort('displayOrder');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single app by slug
router.get('/apps/:slug', async (req, res) => {
  try {
    const app = await AppDefinition.findOne({ slug: req.params.slug, isActive: true });
    if (!app) return res.status(404).json({ message: 'App not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ══════════════════════════════════════════════
// CUSTOMER — Subscriptions
// ══════════════════════════════════════════════

// Get all my subscriptions
router.get('/my-apps', auth, async (req, res) => {
  try {
    const subs = await AppSubscription.find({ user: req.user._id })
      .populate('app');
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get my subscription for a specific app
router.get('/my-apps/:appSlug', auth, async (req, res) => {
  try {
    const appDef = await AppDefinition.findOne({ slug: req.params.appSlug });
    if (!appDef) return res.status(404).json({ message: 'App not found' });
    const sub = await AppSubscription.findOne({ user: req.user._id, app: appDef._id }).populate('app');
    res.json(sub || { subscribed: false, app: appDef });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Purchase / subscribe to an app
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { appSlug, planKey } = req.body;
    const appDef = await AppDefinition.findOne({ slug: appSlug, isActive: true });
    if (!appDef) return res.status(404).json({ message: 'App not found' });

    const plan = appDef.plans.find(p => p.key === planKey);
    if (!plan) return res.status(400).json({ message: 'Invalid plan' });

    const now = new Date();
    const endDate = plan.interval === 'yearly'
      ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const sub = await AppSubscription.findOneAndUpdate(
      { user: req.user._id, app: appDef._id },
      {
        user: req.user._id,
        app: appDef._id,
        planKey: plan.key,
        status: 'active',
        startDate: now,
        endDate,
        lastPayment: now,
        amount: plan.price,
        currency: plan.currency || 'AUD'
      },
      { new: true, upsert: true }
    ).populate('app');

    res.json({ message: `${plan.name} plan activated for ${appDef.name}!`, subscription: sub });
  } catch (err) {
    res.status(500).json({ message: 'Subscription failed', error: err.message });
  }
});

// Upgrade plan
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { appSlug, planKey } = req.body;
    const appDef = await AppDefinition.findOne({ slug: appSlug, isActive: true });
    if (!appDef) return res.status(404).json({ message: 'App not found' });

    const plan = appDef.plans.find(p => p.key === planKey);
    if (!plan) return res.status(400).json({ message: 'Invalid plan' });

    const sub = await AppSubscription.findOneAndUpdate(
      { user: req.user._id, app: appDef._id },
      { planKey: plan.key, amount: plan.price, lastPayment: new Date() },
      { new: true }
    ).populate('app');

    if (!sub) return res.status(404).json({ message: 'No subscription found for this app' });

    res.json({ message: `Upgraded to ${plan.name}!`, subscription: sub });
  } catch (err) {
    res.status(500).json({ message: 'Upgrade failed', error: err.message });
  }
});

// Cancel subscription
router.post('/cancel', auth, async (req, res) => {
  try {
    const { appSlug } = req.body;
    const appDef = await AppDefinition.findOne({ slug: appSlug });
    if (!appDef) return res.status(404).json({ message: 'App not found' });

    const sub = await AppSubscription.findOneAndUpdate(
      { user: req.user._id, app: appDef._id },
      { status: 'cancelled' },
      { new: true }
    ).populate('app');

    if (!sub) return res.status(404).json({ message: 'No subscription found' });

    res.json({ message: 'Subscription cancelled. Access remains until end of billing period.', subscription: sub });
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed', error: err.message });
  }
});

// ══════════════════════════════════════════════
// CUSTOMER — White-Label
// ══════════════════════════════════════════════

// Get white-label settings for an app subscription
router.get('/white-label/:appSlug', auth, async (req, res) => {
  try {
    const appDef = await AppDefinition.findOne({ slug: req.params.appSlug });
    if (!appDef) return res.status(404).json({ message: 'App not found' });

    const sub = await AppSubscription.findOne({ user: req.user._id, app: appDef._id });
    if (!sub || !sub.isActive) return res.status(403).json({ message: 'Active subscription required' });

    const plan = appDef.plans.find(p => p.key === sub.planKey);
    if (!plan?.whiteLabel) return res.status(403).json({ message: 'White-label requires a higher plan' });

    res.json(sub.whiteLabel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update white-label settings
router.put('/white-label/:appSlug', auth, async (req, res) => {
  try {
    const appDef = await AppDefinition.findOne({ slug: req.params.appSlug });
    if (!appDef) return res.status(404).json({ message: 'App not found' });

    const sub = await AppSubscription.findOne({ user: req.user._id, app: appDef._id });
    if (!sub || !sub.isActive) return res.status(403).json({ message: 'Active subscription required' });

    const plan = appDef.plans.find(p => p.key === sub.planKey);
    if (!plan?.whiteLabel) return res.status(403).json({ message: 'White-label requires a higher plan' });

    const allowed = ['brandName', 'tagline', 'logoUrl', 'faviconUrl', 'primaryColor', 'accentColor', 'headerBg', 'buttonColor', 'fontFamily', 'hideByline'];
    if (plan?.customDomain) allowed.push('customDomain');

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[`whiteLabel.${key}`] = req.body[key];
    }

    const updated = await AppSubscription.findByIdAndUpdate(sub._id, updates, { new: true });
    res.json(updated.whiteLabel);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update branding', error: err.message });
  }
});

// ══════════════════════════════════════════════
// ADMIN — App Management
// ══════════════════════════════════════════════

// List all apps (including unpublished)
router.get('/admin/apps', auth, adminOnly, async (req, res) => {
  try {
    const apps = await AppDefinition.find().sort('displayOrder');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a new app
router.post('/admin/apps', auth, adminOnly, async (req, res) => {
  try {
    const app = new AppDefinition({ ...req.body, createdBy: req.user._id });
    await app.save();
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create app', error: err.message });
  }
});

// Update an app
router.put('/admin/apps/:id', auth, adminOnly, async (req, res) => {
  try {
    const app = await AppDefinition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!app) return res.status(404).json({ message: 'App not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update app', error: err.message });
  }
});

// Delete an app
router.delete('/admin/apps/:id', auth, adminOnly, async (req, res) => {
  try {
    await AppDefinition.findByIdAndDelete(req.params.id);
    res.json({ message: 'App deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Seed initial apps (SocialAI Studio as first app)
router.post('/admin/seed', auth, adminOnly, async (req, res) => {
  try {
    const apps = [
      {
        slug: 'social-ai-studio',
        name: 'SocialAI Studio',
        shortDescription: 'AI-powered social media content generator and scheduler. Create weeks of engaging posts in minutes.',
        fullDescription: 'SocialAI Studio uses Google Gemini AI to generate on-brand social media content, images, and full 2-week posting schedules for Facebook and Instagram. Each subscriber gets their own branded AI social media manager.',
        icon: 'sparkles',
        category: 'marketing',
        routePath: '/social',
        features: [
          'AI Content Generation',
          'AI Image Generation',
          'Smart 2-Week Scheduler',
          'Content Calendar',
          'Engagement Insights',
          'Multi-Platform (Facebook & Instagram)',
          'White-Label Branding',
          'Export Data'
        ],
        techStack: ['Google Gemini AI', 'React', 'Node.js', 'MongoDB'],
        plans: [
          {
            key: 'starter',
            name: 'Starter',
            price: 49,
            features: ['AI Content Generation', 'Content Calendar', 'Basic Insights', '1 Brand Profile'],
            color: '#3b82f6',
            whiteLabel: false,
            customDomain: false
          },
          {
            key: 'professional',
            name: 'Professional',
            price: 99,
            features: ['Everything in Starter', 'Smart AI Scheduler', 'AI Image Generation', 'Advanced Insights', 'White-Label Branding', '3 Brand Profiles'],
            popular: true,
            color: '#f59e0b',
            whiteLabel: true,
            customDomain: false
          },
          {
            key: 'enterprise',
            name: 'Enterprise',
            price: 199,
            features: ['Everything in Professional', 'Custom Domain', 'Priority Support', 'API Access', 'Unlimited Brand Profiles', 'Dedicated Account Manager'],
            color: '#a855f7',
            whiteLabel: true,
            customDomain: true
          }
        ],
        displayOrder: 1
      }
    ];

    for (const appData of apps) {
      await AppDefinition.findOneAndUpdate(
        { slug: appData.slug },
        appData,
        { upsert: true, new: true }
      );
    }

    res.json({ message: `${apps.length} app(s) seeded`, count: apps.length });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

// ══════════════════════════════════════════════
// ADMIN — Subscription Management
// ══════════════════════════════════════════════

// Get all subscriptions (with filters)
router.get('/admin/subscriptions', auth, adminOnly, async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.appId) query.app = req.query.appId;

    const subs = await AppSubscription.find(query)
      .populate('user', 'firstName lastName email company')
      .populate('app', 'name slug icon')
      .sort('-createdAt');
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin stats
router.get('/admin/stats', auth, adminOnly, async (req, res) => {
  try {
    const [totalApps, totalSubs, activeSubs, apps] = await Promise.all([
      AppDefinition.countDocuments({ isActive: true }),
      AppSubscription.countDocuments(),
      AppSubscription.countDocuments({ status: 'active' }),
      AppDefinition.find({ isActive: true }, 'name slug')
    ]);

    const revenue = await AppSubscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const subsByApp = await AppSubscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$app', count: { $sum: 1 }, revenue: { $sum: '$amount' } } }
    ]);

    // Populate app names for subsByApp
    const appMap = {};
    apps.forEach(a => { appMap[a._id.toString()] = a.name; });
    const subsByAppNamed = subsByApp.map(s => ({
      appName: appMap[s._id?.toString()] || 'Unknown',
      count: s.count,
      revenue: s.revenue
    }));

    res.json({
      totalApps,
      totalSubscriptions: totalSubs,
      activeSubscriptions: activeSubs,
      monthlyRevenue: revenue[0]?.total || 0,
      subsByApp: subsByAppNamed
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: activate subscription for a user
router.post('/admin/subscribe', auth, adminOnly, async (req, res) => {
  try {
    const { userId, appSlug, planKey } = req.body;
    const appDef = await AppDefinition.findOne({ slug: appSlug });
    if (!appDef) return res.status(404).json({ message: 'App not found' });

    const plan = appDef.plans.find(p => p.key === planKey);
    if (!plan) return res.status(400).json({ message: 'Invalid plan' });

    const now = new Date();
    const sub = await AppSubscription.findOneAndUpdate(
      { user: userId, app: appDef._id },
      {
        user: userId,
        app: appDef._id,
        planKey: plan.key,
        status: 'active',
        startDate: now,
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        lastPayment: now,
        amount: plan.price,
        currency: plan.currency || 'AUD'
      },
      { new: true, upsert: true }
    ).populate('app').populate('user', 'firstName lastName email');

    res.json({ message: `${plan.name} activated`, subscription: sub });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: cancel subscription
router.post('/admin/cancel', auth, adminOnly, async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const sub = await AppSubscription.findByIdAndUpdate(
      subscriptionId,
      { status: 'cancelled' },
      { new: true }
    ).populate('app').populate('user', 'firstName lastName email');

    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription cancelled', subscription: sub });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
