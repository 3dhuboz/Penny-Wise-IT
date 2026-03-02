const express = require('express');
const SocialPost = require('../models/SocialPost');
const SocialProfile = require('../models/SocialProfile');
const { auth, staffOrAdmin, adminOnly } = require('../middleware/auth');
const {
  generateSocialPost,
  generateMarketingImage,
  analyzePostTimes,
  generateRecommendations,
  generateSmartSchedule
} = require('../services/gemini');

const router = express.Router();

// ── Profile ──

// Get current user's social profile
router.get('/profile', auth, async (req, res) => {
  try {
    let profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await SocialProfile.create({ user: req.user._id });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update social profile
router.put('/profile', auth, async (req, res) => {
  try {
    const profile = await SocialProfile.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, user: req.user._id },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── Posts CRUD ──

// Get posts (customers see own, admin sees all or filtered by userId)
router.get('/posts', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query.user = req.user._id;
    } else if (req.query.userId) {
      query.user = req.query.userId;
    }
    if (req.query.status) query.status = req.query.status;
    if (req.query.platform) query.platform = req.query.platform;

    const posts = await SocialPost.find(query)
      .populate('user', 'firstName lastName email company')
      .sort('-scheduledFor');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create post
router.post('/posts', auth, async (req, res) => {
  try {
    const post = new SocialPost({ ...req.body, user: req.user._id });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Bulk create posts (for smart schedule)
router.post('/posts/bulk', auth, async (req, res) => {
  try {
    const posts = (req.body.posts || []).map(p => ({ ...p, user: req.user._id }));
    const created = await SocialPost.insertMany(posts);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update post
router.put('/posts/:id', auth, async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (req.user.role === 'customer' && post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete post
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (req.user.role === 'customer' && post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete all posts for current user
router.delete('/posts', auth, async (req, res) => {
  try {
    const query = req.user.role === 'customer' ? { user: req.user._id } : {};
    await SocialPost.deleteMany(query);
    res.json({ message: 'All posts cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── AI Generation ──

// Helper to get user's API key
const getUserApiKey = async (userId) => {
  const profile = await SocialProfile.findOne({ user: userId });
  return profile?.geminiApiKey || '';
};

// Generate text post
router.post('/ai/generate', auth, async (req, res) => {
  try {
    const { topic, platform } = req.body;
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile?.geminiApiKey) {
      return res.status(400).json({ message: 'Gemini API key not configured. Go to Social AI Settings.' });
    }
    const result = await generateSocialPost(
      profile.geminiApiKey, topic, platform,
      profile.businessName, profile.businessType, profile.tone
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'AI generation failed', error: err.message });
  }
});

// Generate image
router.post('/ai/image', auth, async (req, res) => {
  try {
    const { prompt } = req.body;
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile?.geminiApiKey) {
      return res.status(400).json({ message: 'Gemini API key not configured.' });
    }
    const image = await generateMarketingImage(profile.geminiApiKey, `${profile.businessType}: ${prompt}`);
    if (image) {
      res.json({ image });
    } else {
      res.status(500).json({ message: 'Image generation failed. Try again.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Image generation failed', error: err.message });
  }
});

// Smart schedule
router.post('/ai/smart-schedule', auth, async (req, res) => {
  try {
    const { count } = req.body;
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile?.geminiApiKey) {
      return res.status(400).json({ message: 'Gemini API key not configured.' });
    }
    const result = await generateSmartSchedule(
      profile.geminiApiKey, profile.businessName, profile.businessType,
      profile.tone, profile.stats, count || 7
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Smart schedule failed', error: err.message });
  }
});

// Insights - recommendations
router.post('/ai/recommendations', auth, async (req, res) => {
  try {
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile?.geminiApiKey) {
      return res.status(400).json({ message: 'Gemini API key not configured.' });
    }
    const [recs, times] = await Promise.all([
      generateRecommendations(profile.geminiApiKey, profile.businessName, profile.businessType, profile.stats),
      analyzePostTimes(profile.geminiApiKey, profile.businessType, profile.location)
    ]);
    res.json({ recommendations: recs, bestTimes: times });
  } catch (err) {
    res.status(500).json({ message: 'Analysis failed', error: err.message });
  }
});

// ── Subscription & Purchase ──

const PLANS = {
  starter: { name: 'Starter', amount: 49, features: ['AI Content Generation', 'Content Calendar', 'Basic Insights', '1 Brand Profile'] },
  professional: { name: 'Professional', amount: 99, features: ['Everything in Starter', 'Smart AI Scheduler', 'AI Image Generation', 'Advanced Insights', 'White-Label Branding', '3 Brand Profiles'] },
  enterprise: { name: 'Enterprise', amount: 199, features: ['Everything in Professional', 'Custom Domain', 'Priority Support', 'API Access', 'Unlimited Brand Profiles', 'Dedicated Account Manager'] }
};

// Get available plans
router.get('/plans', (req, res) => {
  res.json(PLANS);
});

// Purchase / activate a plan
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan. Choose starter, professional, or enterprise.' });

    const profile = await SocialProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        'subscription.plan': plan,
        'subscription.status': 'active',
        'subscription.startDate': new Date(),
        'subscription.endDate': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        'subscription.lastPayment': new Date(),
        'subscription.amount': PLANS[plan].amount,
        'subscription.currency': 'AUD'
      },
      { new: true, upsert: true }
    );

    res.json({ message: `${PLANS[plan].name} plan activated!`, profile });
  } catch (err) {
    res.status(500).json({ message: 'Subscription failed', error: err.message });
  }
});

// Cancel subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const profile = await SocialProfile.findOneAndUpdate(
      { user: req.user._id },
      { 'subscription.status': 'cancelled' },
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ message: 'Subscription cancelled. Access remains until end of billing period.', profile });
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed', error: err.message });
  }
});

// ── White Label ──

// Get white-label settings
router.get('/white-label', auth, async (req, res) => {
  try {
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (!profile.isSubscribed) return res.status(403).json({ message: 'Active subscription required.' });
    if (profile.subscription.plan === 'starter') return res.status(403).json({ message: 'White-label requires Professional or Enterprise plan.' });
    res.json(profile.whiteLabel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update white-label settings
router.put('/white-label', auth, async (req, res) => {
  try {
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (!profile.isSubscribed) return res.status(403).json({ message: 'Active subscription required.' });
    if (profile.subscription.plan === 'starter') return res.status(403).json({ message: 'White-label requires Professional or Enterprise plan.' });

    const allowed = ['brandName', 'tagline', 'logoUrl', 'faviconUrl', 'primaryColor', 'accentColor', 'headerBg', 'buttonColor', 'fontFamily', 'hideByline'];
    if (profile.subscription.plan === 'enterprise') allowed.push('customDomain');

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[`whiteLabel.${key}`] = req.body[key];
    }

    const updated = await SocialProfile.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true }
    );
    res.json(updated.whiteLabel);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update branding', error: err.message });
  }
});

// ── Admin: manage subscriptions ──

// Admin: activate subscription for a user
router.post('/admin/subscribe/:userId', auth, adminOnly, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan' });

    const profile = await SocialProfile.findOneAndUpdate(
      { user: req.params.userId },
      {
        user: req.params.userId,
        'subscription.plan': plan,
        'subscription.status': 'active',
        'subscription.startDate': new Date(),
        'subscription.endDate': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        'subscription.lastPayment': new Date(),
        'subscription.amount': PLANS[plan].amount,
        'subscription.currency': 'AUD'
      },
      { new: true, upsert: true }
    );
    res.json({ message: `${PLANS[plan].name} plan activated for user`, profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: cancel subscription for a user
router.post('/admin/cancel-subscription/:userId', auth, adminOnly, async (req, res) => {
  try {
    const profile = await SocialProfile.findOneAndUpdate(
      { user: req.params.userId },
      { 'subscription.status': 'cancelled', 'subscription.plan': 'none' },
      { new: true }
    );
    res.json({ message: 'Subscription cancelled', profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: list all subscribers
router.get('/admin/subscribers', auth, adminOnly, async (req, res) => {
  try {
    const subscribers = await SocialProfile.find({
      'subscription.plan': { $ne: 'none' }
    }).populate('user', 'firstName lastName email company');
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── Admin: view any user's social data ──

// Admin: get social stats across all users
router.get('/admin/stats', auth, adminOnly, async (req, res) => {
  try {
    const [totalPosts, draftPosts, scheduledPosts, postedPosts, totalProfiles] = await Promise.all([
      SocialPost.countDocuments(),
      SocialPost.countDocuments({ status: 'Draft' }),
      SocialPost.countDocuments({ status: 'Scheduled' }),
      SocialPost.countDocuments({ status: 'Posted' }),
      SocialProfile.countDocuments()
    ]);

    const postsByPlatform = await SocialPost.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);

    const recentPosts = await SocialPost.find()
      .populate('user', 'firstName lastName company')
      .sort('-createdAt')
      .limit(10);

    res.json({
      stats: { totalPosts, draftPosts, scheduledPosts, postedPosts, totalProfiles },
      postsByPlatform,
      recentPosts
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: get a specific user's profile
router.get('/admin/profile/:userId', auth, adminOnly, async (req, res) => {
  try {
    const profile = await SocialProfile.findOne({ user: req.params.userId });
    res.json(profile || { message: 'No social profile found for this user' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: update a specific user's profile
router.put('/admin/profile/:userId', auth, adminOnly, async (req, res) => {
  try {
    const profile = await SocialProfile.findOneAndUpdate(
      { user: req.params.userId },
      { ...req.body, user: req.params.userId },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
