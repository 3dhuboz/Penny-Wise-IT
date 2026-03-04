const { GoogleGenAI, Type } = require('@google/genai');

// Use the most capable model available
const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const getAI = (apiKey) => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// ═══════════════════════════════════════════════════════════════
//  CUTTING-EDGE POST GENERATION
//  - Platform-specific algorithm knowledge
//  - Hook formulas (Pattern Interrupt, Open Loop, Controversy)
//  - Engagement psychology (curiosity gap, social proof, FOMO)
//  - Trending content formats per platform
//  - Optimal hashtag strategy per platform
// ═══════════════════════════════════════════════════════════════

const generateSocialPost = async (apiKey, topic, platform, businessName, businessType, tone) => {
  const ai = getAI(apiKey);
  if (!ai) return { content: 'API Key missing. Configure in Social AI Settings.', hashtags: [] };

  const platformRules = platform === 'Instagram' ? `
INSTAGRAM-SPECIFIC RULES (2025 Algorithm):
- First line MUST be a scroll-stopping hook (pattern interrupt, bold claim, or question)
- Use line breaks for readability — short punchy paragraphs (1-2 sentences max)
- Include a clear CTA (save this, share with a friend, comment below, link in bio)
- Emojis: use 3-6 strategically placed emojis, not clustered
- Hashtag strategy: 5-8 highly targeted hashtags. Mix: 2 broad (500K-5M posts), 3 niche (10K-500K posts), 2-3 micro-niche (<10K posts). NO banned or overused spam hashtags
- Carousel/Reel hooks perform 3x better — frame content as if it's a carousel or reel script when relevant
- End with a micro-CTA question to drive comments (the algorithm rewards comment velocity in first 30 min)
` : `
FACEBOOK-SPECIFIC RULES (2025 Algorithm):
- First line MUST hook — Facebook truncates after ~3 lines so the hook is critical
- Longer-form storytelling performs best on Facebook (150-300 words ideal)
- Ask a genuine question — Facebook's algorithm heavily rewards comment-generating posts
- Use "Share if you agree" or "Tag someone who..." patterns for organic reach
- Emojis: use sparingly (2-4), Facebook's audience skews slightly more professional
- NO hashtags or max 1-2 branded ones — Facebook's algorithm doesn't reward hashtags like Instagram
- Native video/photo descriptions outperform link posts — write as if accompanying an image
- Controversy and opinion posts get 2-5x more reach than promotional content
`;

  try {
    const prompt = `You are a world-class social media strategist and copywriter working for "${businessName}", a ${businessType} business.

VOICE & TONE: ${tone}

YOUR MISSION: Write a ${platform} post about "${topic}" that is engineered to maximise engagement, reach, and conversions.

${platformRules}

ADVANCED COPYWRITING TECHNIQUES TO APPLY:
1. HOOK FORMULA — Use one of: Pattern Interrupt ("Stop scrolling if..."), Open Loop ("Most people don't know this about..."), Contrarian Take ("Unpopular opinion:"), Social Proof ("We just hit..."), or Direct Address ("Hey ${businessType} lovers")
2. CURIOSITY GAP — Create tension between what the reader knows and what they want to know
3. EMOTIONAL TRIGGER — Tap into aspiration, belonging, FOMO, pride, or surprise
4. VALUE-FIRST — Lead with what the audience GETS, not what you're selling
5. CONVERSATIONAL — Write like you're texting a smart friend, not writing an essay

Return JSON with:
- "content": the full post text (properly formatted with line breaks as \\n)
- "hashtags": array of hashtag strings (follow the platform-specific rules above)`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    // Safely extract text — response.text can throw on blocked/empty responses
    let rawText;
    try { rawText = response.text; } catch (e) {
      console.error('[Generate Post] response.text threw:', e.message);
      return { content: 'Content generation was blocked. Try a different topic.', hashtags: [] };
    }

    if (!rawText) return { content: 'Empty response from AI. Try again.', hashtags: [] };

    const parsed = JSON.parse(rawText);
    // Ensure content is always a string (Gemini may return error objects)
    return {
      content: typeof parsed.content === 'string' ? parsed.content : (parsed.content?.message || JSON.stringify(parsed.content) || 'Generation failed.'),
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.filter(h => typeof h === 'string') : []
    };
  } catch (error) {
    console.error('[Generate Post] Error:', error?.message || error);
    const msg = error?.message || String(error);
    if (msg.includes('API_KEY_INVALID') || msg.includes('401')) {
      return { content: 'Invalid API Key. Check your key in Settings.', hashtags: [] };
    }
    return { content: `AI Error: ${msg.substring(0, 120)}`, hashtags: [] };
  }
};

// ═══════════════════════════════════════════════════════════════
//  IMAGE GENERATION — Professional marketing visuals
// ═══════════════════════════════════════════════════════════════

const generateMarketingImage = async (apiKey, prompt) => {
  const ai = getAI(apiKey);
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: `Create a professional, scroll-stopping social media marketing image for a business: ${prompt}. Style: modern, clean, high-contrast, vibrant brand colours. Photography style with cinematic lighting. No text overlays. Suitable for Instagram/Facebook feed. Commercial quality, aspirational, lifestyle-focused.` }]
      },
      config: { imageConfig: { aspectRatio: '1:1' } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error('Gemini Image Error:', error);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════
//  BEST POSTING TIMES — Algorithm-aware, data-driven
// ═══════════════════════════════════════════════════════════════

const analyzePostTimes = async (apiKey, businessType, location) => {
  const ai = getAI(apiKey);
  if (!ai) return 'API Key missing.';

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `You are a social media data scientist. Based on the latest 2024-2025 research from Hootsuite, Sprout Social, Later, and Buffer's annual reports:

BUSINESS: ${businessType} located in ${location}

Provide a detailed, data-backed analysis of the BEST times to post on each platform. Consider:
- Platform algorithm behaviour (Instagram prioritises recency + early engagement velocity; Facebook rewards posts that generate discussion within the first hour)
- Industry-specific audience behaviour for ${businessType}
- ${location} timezone and cultural patterns (e.g. commute times, lunch breaks, evening wind-down)
- Weekday vs weekend differences
- The "golden hours" where competition is lower but engagement is high

FORMAT YOUR RESPONSE AS:

📱 INSTAGRAM — Best Times:
• [Day]: [Time] — [Why this works]
(3-5 time slots)

📘 FACEBOOK — Best Times:
• [Day]: [Time] — [Why this works]
(3-5 time slots)

⚡ PRO TIPS:
• [2-3 algorithm-specific tips for timing]

Be specific with times (e.g. "Tuesday 7:15 AM" not "mornings"). Use the ${location} local timezone.`
    });
    let text;
    try { text = response.text; } catch (e) {
      console.error('[Post Times] response.text threw:', e.message);
      return 'Could not analyze times — response was blocked.';
    }
    return text || 'Could not analyze times.';
  } catch (error) {
    console.error('[Post Times] Error:', error?.message || error);
    return 'Could not analyze times.';
  }
};

// ═══════════════════════════════════════════════════════════════
//  AI STRATEGIST — Deep competitive analysis & growth hacking
// ═══════════════════════════════════════════════════════════════

const generateRecommendations = async (apiKey, businessName, businessType, stats) => {
  const ai = getAI(apiKey);
  if (!ai) return 'API Key missing.';

  const engagementBenchmark = stats.engagement > 5 ? 'above average' : stats.engagement > 2 ? 'average' : 'below average';
  const reachToFollowerRatio = stats.followers > 0 ? ((stats.reach / stats.followers) * 100).toFixed(0) : 0;
  const postFrequency = stats.postsLast30Days > 20 ? 'high' : stats.postsLast30Days > 8 ? 'moderate' : 'low';

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `You are an elite social media growth strategist hired to audit and supercharge the social media presence of "${businessName}", a ${businessType} business.

CURRENT PERFORMANCE DATA:
- Followers: ${stats.followers.toLocaleString()}
- Monthly Reach: ${stats.reach.toLocaleString()} (${reachToFollowerRatio}% of followers — ${reachToFollowerRatio > 80 ? 'excellent' : reachToFollowerRatio > 30 ? 'decent' : 'needs improvement'})
- Engagement Rate: ${stats.engagement}% (${engagementBenchmark} for ${businessType} industry)
- Post Frequency: ${stats.postsLast30Days} posts/month (${postFrequency} frequency)

Perform a COMPREHENSIVE STRATEGIC AUDIT. Your analysis must include:

📊 PERFORMANCE DIAGNOSIS
- What the numbers tell us about content-audience fit
- Identify the biggest bottleneck (reach? engagement? conversion? frequency?)

🚀 TOP 5 HIGH-IMPACT ACTIONS (ranked by expected ROI)
For each action:
- What to do (specific, not vague)
- Why it works (cite algorithm mechanics or psychology)
- Expected impact (e.g. "+20-40% reach within 2 weeks")

📈 CONTENT MIX RECOMMENDATION
- Ideal ratio of content pillars (educational / entertaining / promotional / community / behind-the-scenes)
- Which formats to prioritise (Reels, carousels, Stories, lives, static posts)
- Posting frequency recommendation

🎯 QUICK WINS (things they can do THIS WEEK)
- 3 immediate actions that require minimal effort but high impact

💡 ADVANCED GROWTH TACTICS
- 2 cutting-edge strategies most businesses aren't using yet (e.g. collaborative posts, AI-assisted engagement pods, story interaction stacking, comment-to-DM funnels, SEO-optimised captions)

Be specific to ${businessType} businesses. Give actual examples, not generic advice. Reference current platform algorithm behaviour.`
    });
    let text;
    try { text = response.text; } catch (e) {
      console.error('[Recommendations] response.text threw:', e.message);
      return 'Unable to generate recommendations — response was blocked. Try again.';
    }
    return text || 'No recommendations generated.';
  } catch (error) {
    console.error('[Recommendations] Error:', error?.message || error);
    return `Unable to analyze stats: ${error?.message || 'Unknown error'}`;
  }
};

// ═══════════════════════════════════════════════════════════════
//  SMART AI SCHEDULER — Full content calendar with viral science
// ═══════════════════════════════════════════════════════════════

const generateSmartSchedule = async (apiKey, businessName, businessType, tone, stats, postsToGenerate = 7) => {
  const ai = getAI(apiKey);
  if (!ai) return { posts: [], strategy: 'API Key missing.' };

  try {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const prompt = `You are an elite social media strategist and content creator for "${businessName}", a ${businessType} business.

BRAND VOICE: ${tone}
CURRENT DATE: ${now.toISOString().split('T')[0]}
SCHEDULE WINDOW: ${now.toISOString().split('T')[0]} to ${windowEnd.toISOString().split('T')[0]}
PERFORMANCE DATA: ${stats.followers.toLocaleString()} followers, ${stats.engagement}% engagement, ${stats.reach.toLocaleString()} monthly reach

Generate exactly ${postsToGenerate} social media posts that form a COHESIVE CONTENT STRATEGY for the next 2 weeks.

STRATEGIC REQUIREMENTS:
1. CONTENT PILLAR MIX — Follow the proven 4-1-1 rule adapted for 2025:
   - 40% VALUE posts (educational, tips, how-tos, industry insights)
   - 25% ENGAGEMENT posts (questions, polls, this-or-that, controversial takes, memes)
   - 20% BEHIND-THE-SCENES / COMMUNITY posts (team, process, customer stories, UGC reposts)
   - 15% PROMOTIONAL posts (offers, products, services — but disguised as value)

2. PLATFORM OPTIMIZATION — Mix Facebook and Instagram. Each post MUST be optimised for its specific platform:
   - Instagram: scroll-stopping hook in line 1, line breaks, 5-8 targeted hashtags, micro-CTA for comments
   - Facebook: storytelling format, genuine question to drive discussion, minimal/no hashtags

3. TIMING SCIENCE — Schedule at algorithm-optimal times for Australian audiences:
   - Instagram: Tue/Wed/Thu 7-8AM, 12-1PM, 7-9PM AEST perform best
   - Facebook: Wed/Thu/Fri 9-10AM, 1-2PM AEST for business pages
   - Space posts 2-3 days apart (don't cluster)
   - Vary the days and times for each post

4. HOOK FORMULAS — Every post MUST open with a proven hook:
   - Pattern Interrupt: "Stop scrolling if..."
   - Open Loop: "Most ${businessType} businesses don't know this..."
   - Contrarian: "Unpopular opinion about ${businessType}:"
   - Social Proof: "Our customers keep telling us..."
   - Direct Value: "Save this for later — here's how to..."

5. HASHTAG STRATEGY (Instagram only):
   - 5-8 per post, mix of broad (500K+), niche (10K-500K), and micro-niche (<10K)
   - Industry-specific and trending tags for ${businessType}

6. CONTENT VARIETY — No two consecutive posts should have the same format, pillar, or platform

Return JSON with:
- "strategy": A detailed 3-4 sentence strategy summary explaining the content calendar logic, expected outcomes, and key themes
- "posts": array of ${postsToGenerate} objects, each with:
  - platform (string: "Instagram" or "Facebook")
  - scheduledFor (ISO datetime string in AEST, e.g. "2025-03-15T07:30:00+10:00")
  - topic (string: brief topic)
  - content (string: the FULL ready-to-post caption with \\n line breaks)
  - hashtags (array of strings — 5-8 for Instagram, 0-2 for Facebook)
  - imagePrompt (string: detailed prompt for an AI image generator to create the perfect visual)
  - reasoning (string: why this post at this time on this platform — reference algorithm science)
  - pillar (string: one of "Value", "Engagement", "Community", "Promotional")`;

    console.log('[Smart Schedule] Calling Gemini API with model:', TEXT_MODEL);
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategy: { type: Type.STRING },
            posts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  scheduledFor: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  content: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  imagePrompt: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  pillar: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    // Safely extract text — response.text can throw on blocked/empty responses
    let rawText;
    try {
      rawText = response.text;
    } catch (textErr) {
      console.error('[Smart Schedule] response.text threw:', textErr.message);
      const blockReason = response.candidates?.[0]?.finishReason || 'unknown';
      return { posts: [], strategy: `Content generation was blocked (reason: ${blockReason}). Try again.` };
    }

    if (!rawText) {
      console.error('[Smart Schedule] Empty response from Gemini');
      return { posts: [], strategy: 'Gemini returned an empty response. Try again.' };
    }

    const data = JSON.parse(rawText);
    // Sanitize every post field — Gemini may return objects instead of strings
    const safePosts = (Array.isArray(data.posts) ? data.posts : []).map(p => ({
      platform: typeof p.platform === 'string' ? p.platform : String(p.platform || 'Instagram'),
      scheduledFor: typeof p.scheduledFor === 'string' ? p.scheduledFor : new Date().toISOString(),
      topic: typeof p.topic === 'string' ? p.topic : (p.topic?.message || JSON.stringify(p.topic) || ''),
      content: typeof p.content === 'string' ? p.content : (p.content?.message || JSON.stringify(p.content) || ''),
      hashtags: Array.isArray(p.hashtags) ? p.hashtags.filter(h => typeof h === 'string') : [],
      imagePrompt: typeof p.imagePrompt === 'string' ? p.imagePrompt : '',
      reasoning: typeof p.reasoning === 'string' ? p.reasoning : (p.reasoning?.message || ''),
      pillar: typeof p.pillar === 'string' ? p.pillar : (p.pillar?.message || 'Value')
    }));
    const safeStrategy = typeof data.strategy === 'string' ? data.strategy : (data.strategy?.message || JSON.stringify(data.strategy) || '');
    return { posts: safePosts, strategy: safeStrategy };
  } catch (error) {
    console.error('[Smart Schedule] Error:', error?.message || error);
    return { posts: [], strategy: `Error: ${error?.message || 'Unknown error — check your Gemini API key and try again.'}` };
  }
};

module.exports = {
  generateSocialPost,
  generateMarketingImage,
  analyzePostTimes,
  generateRecommendations,
  generateSmartSchedule
};
