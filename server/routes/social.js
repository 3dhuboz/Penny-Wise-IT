const express = require('express');
const fetch = require('node-fetch');
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

// Generate text post — context-aware with past performance data
router.post('/ai/generate', auth, async (req, res) => {
  try {
    const { topic, platform } = req.body;
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile?.geminiApiKey) {
      return res.status(400).json({ message: 'Gemini API key not configured. Go to Social AI Settings.' });
    }

    // Gather top-performing posts for context
    let topPostExamples = [];
    if (profile.facebookConnected && profile.facebookPageAccessToken) {
      try {
        const token = profile.facebookPageAccessToken;
        const source = platform === 'Instagram' && profile.instagramBusinessAccountId
          ? `${profile.instagramBusinessAccountId}/media?fields=caption,like_count,comments_count`
          : `${profile.facebookPageId}/posts?fields=message,likes.limit(0).summary(true),comments.limit(0).summary(true),shares`;
        const fbRes = await fetch(`${FB_GRAPH}/${source}&limit=10&access_token=${token}`);
        const fbData = await fbRes.json();
        if (fbData.data) {
          topPostExamples = fbData.data
            .map(p => ({
              text: (p.message || p.caption || '').substring(0, 150),
              engagement: (p.likes?.summary?.total_count || p.like_count || 0) +
                (p.comments?.summary?.total_count || p.comments_count || 0) * 3 +
                (p.shares?.count || 0) * 5
            }))
            .filter(p => p.text.length > 20)
            .sort((a, b) => b.engagement - a.engagement)
            .slice(0, 3);
        }
      } catch (e) { /* research is optional */ }
    }

    const result = await generateSocialPost(
      profile.geminiApiKey, topic, platform,
      profile.businessName, profile.businessType, profile.tone,
      topPostExamples
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

// Smart schedule — research-driven AI engine
router.post('/ai/smart-schedule', auth, async (req, res) => {
  try {
    const { count } = req.body;
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile?.geminiApiKey) {
      return res.status(400).json({ message: 'Gemini API key not configured.' });
    }
    const stats = {
      followers: profile.stats?.followers ?? 0,
      reach: profile.stats?.reach ?? 0,
      engagement: profile.stats?.engagement ?? 0,
      postsLast30Days: profile.stats?.postsLast30Days ?? 0
    };

    // ── RESEARCH PHASE: Gather real data for the AI ──
    let pastFbPosts = [], pastIgPosts = [], scheduledPosts = [];

    // 1. Fetch real Facebook post history with engagement metrics
    if (profile.facebookConnected && profile.facebookPageAccessToken) {
      try {
        const token = profile.facebookPageAccessToken;
        const pageId = profile.facebookPageId;
        const fbRes = await fetch(
          `${FB_GRAPH}/${pageId}/posts?fields=id,message,created_time,shares,likes.limit(0).summary(true),comments.limit(0).summary(true)&limit=25&access_token=${token}`
        );
        const fbData = await fbRes.json();
        if (fbData.data) {
          pastFbPosts = fbData.data.map(p => ({
            message: (p.message || '').substring(0, 200),
            date: p.created_time,
            day: new Date(p.created_time).toLocaleDateString('en-AU', { weekday: 'long' }),
            time: new Date(p.created_time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true }),
            likes: p.likes?.summary?.total_count || 0,
            comments: p.comments?.summary?.total_count || 0,
            shares: p.shares?.count || 0,
            engagement: (p.likes?.summary?.total_count || 0) + (p.comments?.summary?.total_count || 0) * 3 + (p.shares?.count || 0) * 5
          }));
        }
      } catch (e) { console.log('[Research] FB posts fetch failed:', e.message); }

      // 2. Fetch real Instagram post history with engagement
      if (profile.instagramBusinessAccountId) {
        try {
          const token = profile.facebookPageAccessToken;
          const igRes = await fetch(
            `${FB_GRAPH}/${profile.instagramBusinessAccountId}/media?fields=id,caption,timestamp,like_count,comments_count,media_type&limit=25&access_token=${token}`
          );
          const igData = await igRes.json();
          if (igData.data) {
            pastIgPosts = igData.data.map(p => ({
              caption: (p.caption || '').substring(0, 200),
              date: p.timestamp,
              day: new Date(p.timestamp).toLocaleDateString('en-AU', { weekday: 'long' }),
              time: new Date(p.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true }),
              likes: p.like_count || 0,
              comments: p.comments_count || 0,
              mediaType: p.media_type,
              engagement: (p.like_count || 0) + (p.comments_count || 0) * 3
            }));
          }
        } catch (e) { console.log('[Research] IG posts fetch failed:', e.message); }
      }
    }

    // 3. Fetch existing scheduled/draft posts from our DB
    try {
      scheduledPosts = await SocialPost.find({
        user: req.user._id,
        scheduledFor: { $gte: new Date() }
      }).sort('scheduledFor').lean();
      scheduledPosts = scheduledPosts.map(p => ({
        platform: p.platform,
        topic: p.topic || '',
        pillar: p.pillar || '',
        scheduledFor: p.scheduledFor,
        day: new Date(p.scheduledFor).toLocaleDateString('en-AU', { weekday: 'long' }),
        status: p.status
      }));
    } catch (e) { console.log('[Research] Scheduled posts fetch failed:', e.message); }

    const researchData = { pastFbPosts, pastIgPosts, scheduledPosts };
    console.log('[Smart Schedule] Research:', pastFbPosts.length, 'FB posts,', pastIgPosts.length, 'IG posts,', scheduledPosts.length, 'scheduled');

    const result = await generateSmartSchedule(
      profile.geminiApiKey, profile.businessName, profile.businessType,
      profile.tone, stats, count || 7, researchData
    );
    res.json(result);
  } catch (err) {
    console.error('[Smart Schedule] Route error:', err);
    res.status(500).json({ message: 'Smart schedule failed', error: err.message });
  }
});

// Insights - research-driven recommendations (with 25s timeout)
router.post('/ai/recommendations', auth, async (req, res) => {
  try {
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile?.geminiApiKey) {
      return res.status(400).json({ message: 'Gemini API key not configured.' });
    }
    const stats = {
      followers: profile.stats?.followers ?? 0,
      reach: profile.stats?.reach ?? 0,
      engagement: profile.stats?.engagement ?? 0,
      postsLast30Days: profile.stats?.postsLast30Days ?? 0
    };

    // ── RESEARCH PHASE: Gather real post data for analysis ──
    let pastFbPosts = [], pastIgPosts = [];
    if (profile.facebookConnected && profile.facebookPageAccessToken) {
      try {
        const token = profile.facebookPageAccessToken;
        const pageId = profile.facebookPageId;
        const fbRes = await fetch(
          `${FB_GRAPH}/${pageId}/posts?fields=id,message,created_time,shares,likes.limit(0).summary(true),comments.limit(0).summary(true)&limit=25&access_token=${token}`
        );
        const fbData = await fbRes.json();
        if (fbData.data) {
          pastFbPosts = fbData.data.map(p => ({
            message: (p.message || '').substring(0, 200),
            day: new Date(p.created_time).toLocaleDateString('en-AU', { weekday: 'long' }),
            time: new Date(p.created_time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true }),
            likes: p.likes?.summary?.total_count || 0,
            comments: p.comments?.summary?.total_count || 0,
            shares: p.shares?.count || 0,
            engagement: (p.likes?.summary?.total_count || 0) + (p.comments?.summary?.total_count || 0) * 3 + (p.shares?.count || 0) * 5
          }));
        }
      } catch (e) { console.log('[Insights Research] FB posts failed:', e.message); }

      if (profile.instagramBusinessAccountId) {
        try {
          const token = profile.facebookPageAccessToken;
          const igRes = await fetch(
            `${FB_GRAPH}/${profile.instagramBusinessAccountId}/media?fields=id,caption,timestamp,like_count,comments_count&limit=25&access_token=${token}`
          );
          const igData = await igRes.json();
          if (igData.data) {
            pastIgPosts = igData.data.map(p => ({
              caption: (p.caption || '').substring(0, 200),
              day: new Date(p.timestamp).toLocaleDateString('en-AU', { weekday: 'long' }),
              time: new Date(p.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true }),
              likes: p.like_count || 0,
              comments: p.comments_count || 0,
              engagement: (p.like_count || 0) + (p.comments_count || 0) * 3
            }));
          }
        } catch (e) { console.log('[Insights Research] IG posts failed:', e.message); }
      }
    }

    const postData = { pastFbPosts, pastIgPosts };
    console.log('[Insights] Research:', pastFbPosts.length, 'FB posts,', pastIgPosts.length, 'IG posts for', profile.businessName);

    // Run with 25s timeout to stay under Render's 30s request limit
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Analysis timed out — the AI took too long. Please try again.')), 25000);
    });
    try {
      const [recs, times] = await Promise.race([
        Promise.all([
          generateRecommendations(profile.geminiApiKey, profile.businessName, profile.businessType, stats, postData),
          analyzePostTimes(profile.geminiApiKey, profile.businessType, profile.location || 'Australia', postData)
        ]),
        timeoutPromise
      ]);
      clearTimeout(timer);
      res.json({ recommendations: recs, bestTimes: times });
    } catch (innerErr) {
      clearTimeout(timer);
      throw innerErr;
    }
  } catch (err) {
    console.error('[Insights] Route error:', err?.message || err);
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

// ── Facebook / Instagram Integration ──

const FB_GRAPH = 'https://graph.facebook.com/v21.0';

// Connect Facebook Page — save page access token + page ID
// Accepts either a Page Access Token OR a User Access Token.
// If a User token is provided, we auto-exchange it for the correct Page token.
router.post('/facebook/connect', auth, async (req, res) => {
  try {
    const { pageId, pageAccessToken } = req.body;
    if (!pageId || !pageAccessToken) {
      return res.status(400).json({ message: 'Page ID and Page Access Token are required.' });
    }

    let finalPageToken = pageAccessToken;

    // Step 1: Try the token directly against the page
    let verifyRes = await fetch(`${FB_GRAPH}/${pageId}?fields=name,fan_count,picture&access_token=${finalPageToken}`);
    let pageData = await verifyRes.json();

    // Step 2: If it failed, the token might be a User Access Token — try auto-exchanging
    if (pageData.error) {
      console.log(`[FB Connect] Direct page query failed: ${pageData.error.message}. Trying me/accounts...`);

      // Query me/accounts to list pages the user manages and get the correct Page token
      const accountsRes = await fetch(`${FB_GRAPH}/me/accounts?fields=id,name,access_token&access_token=${pageAccessToken}`);
      const accountsData = await accountsRes.json();

      if (accountsData.error) {
        // Token is completely invalid
        return res.status(400).json({
          message: `Facebook error: ${accountsData.error.message}. Make sure your token has pages_show_list, pages_read_engagement, and pages_read_user_content permissions.`
        });
      }

      if (!accountsData.data || accountsData.data.length === 0) {
        return res.status(400).json({
          message: 'No Facebook Pages found for this token. Make sure the token belongs to an account that manages at least one Facebook Page, and that pages_show_list permission is granted.'
        });
      }

      // Find the matching page by ID
      const matchedPage = accountsData.data.find(p => p.id === pageId);
      if (!matchedPage) {
        const availablePages = accountsData.data.map(p => `"${p.name}" (${p.id})`).join(', ');
        return res.status(400).json({
          message: `Page ID ${pageId} not found in your managed pages. Available pages: ${availablePages}. Use one of these Page IDs instead.`
        });
      }

      // Use the Page Access Token from me/accounts
      finalPageToken = matchedPage.access_token;
      console.log(`[FB Connect] Auto-exchanged user token for page token for "${matchedPage.name}"`);

      // Re-verify with the correct Page token
      verifyRes = await fetch(`${FB_GRAPH}/${pageId}?fields=name,fan_count,picture&access_token=${finalPageToken}`);
      pageData = await verifyRes.json();

      if (pageData.error) {
        return res.status(400).json({ message: `Facebook error after token exchange: ${pageData.error.message}` });
      }
    }

    // Check for linked Instagram Business Account
    const igRes = await fetch(`${FB_GRAPH}/${pageId}?fields=instagram_business_account&access_token=${finalPageToken}`);
    const igData = await igRes.json();
    const igId = igData?.instagram_business_account?.id || '';

    const profile = await SocialProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        facebookPageId: pageId,
        facebookPageAccessToken: finalPageToken,
        facebookConnected: true,
        instagramBusinessAccountId: igId
      },
      { new: true, upsert: true }
    );

    res.json({
      message: `Connected to "${pageData.name}"${igId ? ' + Instagram Business linked' : ''}`,
      pageName: pageData.name,
      pageFollowers: pageData.fan_count,
      pagePicture: pageData.picture?.data?.url,
      instagramConnected: !!igId,
      instagramId: igId,
      profile
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to connect Facebook page', error: err.message });
  }
});

// Disconnect Facebook Page
router.post('/facebook/disconnect', auth, async (req, res) => {
  try {
    const profile = await SocialProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        facebookPageId: '',
        facebookPageAccessToken: '',
        facebookConnected: false,
        instagramBusinessAccountId: ''
      },
      { new: true }
    );
    res.json({ message: 'Facebook page disconnected', profile });
  } catch (err) {
    res.status(500).json({ message: 'Disconnect failed', error: err.message });
  }
});

// Fetch live stats from Facebook Page + Instagram
router.get('/facebook/stats', auth, async (req, res) => {
  try {
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile?.facebookConnected || !profile?.facebookPageAccessToken) {
      return res.status(400).json({ message: 'Facebook not connected' });
    }

    const token = profile.facebookPageAccessToken;
    const pageId = profile.facebookPageId;

    // Page info + fan count
    const pageRes = await fetch(`${FB_GRAPH}/${pageId}?fields=name,fan_count,picture,followers_count&access_token=${token}`);
    const pageData = await pageRes.json();
    if (pageData.error) return res.status(400).json({ message: pageData.error.message });

    // Page insights (28-day reach + engagement)
    let reach = 0, engagement = 0, impressions = 0;
    try {
      const insightsRes = await fetch(
        `${FB_GRAPH}/${pageId}/insights?metric=page_impressions_unique,page_post_engagements,page_impressions&period=days_28&access_token=${token}`
      );
      const insightsData = await insightsRes.json();
      if (insightsData.data) {
        for (const metric of insightsData.data) {
          const val = metric.values?.[metric.values.length - 1]?.value || 0;
          if (metric.name === 'page_impressions_unique') reach = val;
          if (metric.name === 'page_post_engagements') engagement = val;
          if (metric.name === 'page_impressions') impressions = val;
        }
      }
    } catch (e) { /* insights may not be available for all pages */ }

    // Recent posts count (last 30 days)
    let recentPostCount = 0;
    try {
      const postsRes = await fetch(
        `${FB_GRAPH}/${pageId}/posts?fields=id&since=${Math.floor(Date.now() / 1000) - 30 * 86400}&access_token=${token}`
      );
      const postsData = await postsRes.json();
      recentPostCount = postsData.data?.length || 0;
    } catch (e) {}

    // Instagram stats if linked
    let igStats = null;
    if (profile.instagramBusinessAccountId) {
      try {
        const igRes = await fetch(
          `${FB_GRAPH}/${profile.instagramBusinessAccountId}?fields=followers_count,media_count,username,profile_picture_url&access_token=${token}`
        );
        const igData = await igRes.json();
        if (!igData.error) {
          igStats = {
            followers: igData.followers_count,
            mediaCount: igData.media_count,
            username: igData.username,
            profilePicture: igData.profile_picture_url
          };
        }
      } catch (e) {}
    }

    const followers = pageData.fan_count || pageData.followers_count || 0;
    const engagementRate = impressions > 0 ? ((engagement / impressions) * 100).toFixed(1) : 0;

    // Update stored stats
    await SocialProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        'stats.followers': followers,
        'stats.reach': reach,
        'stats.engagement': parseFloat(engagementRate),
        'stats.postsLast30Days': recentPostCount
      }
    );

    res.json({
      page: {
        name: pageData.name,
        picture: pageData.picture?.data?.url,
        followers,
        reach,
        engagement,
        engagementRate: parseFloat(engagementRate),
        impressions,
        postsLast30Days: recentPostCount
      },
      instagram: igStats
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

// Fetch recent Facebook Page posts
router.get('/facebook/posts', auth, async (req, res) => {
  try {
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile?.facebookConnected || !profile?.facebookPageAccessToken) {
      return res.status(400).json({ message: 'Facebook not connected' });
    }

    const token = profile.facebookPageAccessToken;
    const pageId = profile.facebookPageId;
    const limit = req.query.limit || 10;

    const postsRes = await fetch(
      `${FB_GRAPH}/${pageId}/posts?fields=id,message,created_time,full_picture,permalink_url,shares,likes.limit(0).summary(true),comments.limit(0).summary(true)&limit=${limit}&access_token=${token}`
    );
    const postsData = await postsRes.json();
    if (postsData.error) return res.status(400).json({ message: postsData.error.message });

    const posts = (postsData.data || []).map(p => ({
      id: p.id,
      message: p.message || '',
      createdTime: p.created_time,
      image: p.full_picture || null,
      permalink: p.permalink_url,
      likes: p.likes?.summary?.total_count || 0,
      comments: p.comments?.summary?.total_count || 0,
      shares: p.shares?.count || 0
    }));

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
});

// Fetch recent Instagram posts (if linked)
router.get('/instagram/posts', auth, async (req, res) => {
  try {
    const profile = await SocialProfile.findOne({ user: req.user._id });
    if (!profile?.instagramBusinessAccountId || !profile?.facebookPageAccessToken) {
      return res.status(400).json({ message: 'Instagram not connected' });
    }

    const token = profile.facebookPageAccessToken;
    const igId = profile.instagramBusinessAccountId;
    const limit = req.query.limit || 10;

    const mediaRes = await fetch(
      `${FB_GRAPH}/${igId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${token}`
    );
    const mediaData = await mediaRes.json();
    if (mediaData.error) return res.status(400).json({ message: mediaData.error.message });

    const posts = (mediaData.data || []).map(p => ({
      id: p.id,
      caption: p.caption || '',
      mediaType: p.media_type,
      mediaUrl: p.media_url || p.thumbnail_url,
      permalink: p.permalink,
      timestamp: p.timestamp,
      likes: p.like_count || 0,
      comments: p.comments_count || 0
    }));

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch Instagram posts', error: err.message });
  }
});

module.exports = router;
