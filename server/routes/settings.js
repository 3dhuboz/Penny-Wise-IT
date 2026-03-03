const express = require('express');
const SiteSettings = require('../models/SiteSettings');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get site settings (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update site settings (admin only)
router.put('/', auth, adminOnly, async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    const allowed = [
      'businessName', 'businessEmail', 'businessPhone', 'businessFacebook',
      'businessInstagram', 'businessLinkedin', 'businessWebsite', 'businessABN',
      'squareAccessToken', 'squareLocationId', 'squareEnvironment', 'squareWebhookSecret',
      'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpFromName', 'smtpFromEmail', 'smtpSecure',
      'sitegroundApiUrl', 'sitegroundApiToken',
      'hostingPlans', 'domainSalesEnabled', 'domainMarkup', 'domainNotes'
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        settings[key] = req.body[key];
      }
    }
    await settings.save();
    res.json({ message: 'Settings updated', settings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get public hosting plans (no auth needed — for storefront)
router.get('/hosting-plans', async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    const plans = (settings.hostingPlans || []).filter(p => p.isActive);
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get public business contact info (for footer, contact page)
router.get('/public', async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json({
      businessName: settings.businessName,
      businessEmail: settings.businessEmail,
      businessPhone: settings.businessPhone,
      businessFacebook: settings.businessFacebook,
      businessInstagram: settings.businessInstagram,
      businessLinkedin: settings.businessLinkedin,
      businessWebsite: settings.businessWebsite,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
