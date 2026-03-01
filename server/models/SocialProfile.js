const mongoose = require('mongoose');

const socialProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, default: 'My Business' },
  businessType: { type: String, default: 'small business' },
  description: { type: String, default: '' },
  tone: { type: String, default: 'Friendly and professional' },
  location: { type: String, default: 'Australia' },
  logoUrl: { type: String, default: '' },
  geminiApiKey: { type: String, default: '' },
  facebookAppId: { type: String, default: '' },
  facebookPageId: { type: String, default: '' },
  facebookPageAccessToken: { type: String, default: '' },
  facebookConnected: { type: Boolean, default: false },
  instagramBusinessAccountId: { type: String, default: '' },
  stats: {
    followers: { type: Number, default: 500 },
    reach: { type: Number, default: 2000 },
    engagement: { type: Number, default: 4.5 },
    postsLast30Days: { type: Number, default: 8 }
  }
}, { timestamps: true });

module.exports = mongoose.model('SocialProfile', socialProfileSchema);
