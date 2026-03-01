const { GoogleGenAI, Type } = require('@google/genai');

const getAI = (apiKey) => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const generateSocialPost = async (apiKey, topic, platform, businessName, businessType, tone) => {
  const ai = getAI(apiKey);
  if (!ai) return { content: 'API Key missing. Configure in Social AI Settings.', hashtags: [] };

  try {
    const prompt = `
      You are an expert social media manager for "${businessName}", a ${businessType}.
      Tone: ${tone}.
      Write a catchy, engaging ${platform} post about: "${topic}".
      Include relevant emojis.
      Return JSON with "content" (the post text) and "hashtags" (array of strings).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

    return response.text ? JSON.parse(response.text) : { content: 'Error generating content.', hashtags: [] };
  } catch (error) {
    console.error('Gemini Text Error:', error);
    const msg = error?.message || String(error);
    if (msg.includes('API_KEY_INVALID') || msg.includes('401')) {
      return { content: 'Invalid API Key. Check your key in Settings.', hashtags: [] };
    }
    return { content: `AI Error: ${msg.substring(0, 120)}`, hashtags: [] };
  }
};

const generateMarketingImage = async (apiKey, prompt) => {
  const ai = getAI(apiKey);
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Professional marketing image: ${prompt}. High quality, vibrant, cinematic lighting.` }]
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

const analyzePostTimes = async (apiKey, businessType, location) => {
  const ai = getAI(apiKey);
  if (!ai) return 'API Key missing.';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `What are the best times to post on Instagram and Facebook for a ${businessType} in ${location}? Give a concise bulleted list of 3 best time slots for the upcoming week.`
    });
    return response.text;
  } catch (error) {
    return 'Could not analyze times.';
  }
};

const generateRecommendations = async (apiKey, businessName, businessType, stats) => {
  const ai = getAI(apiKey);
  if (!ai) return 'API Key missing.';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are a social media strategist for "${businessName}", a ${businessType}.
        Stats: Followers: ${stats.followers}, Reach: ${stats.reach}, Engagement: ${stats.engagement}%, Posts: ${stats.postsLast30Days}.
        Provide 3 specific, high-impact recommendations. Format as a concise bulleted list.
      `
    });
    return response.text || 'No recommendations generated.';
  } catch (error) {
    return 'Unable to analyze stats at this time.';
  }
};

const generateSmartSchedule = async (apiKey, businessName, businessType, tone, stats, postsToGenerate = 7) => {
  const ai = getAI(apiKey);
  if (!ai) return { posts: [], strategy: 'API Key missing.' };

  try {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const prompt = `
      You are a social media strategist for "${businessName}", a ${businessType}. Tone: ${tone}.
      Current date: ${now.toISOString().split('T')[0]}.
      Window: ${now.toISOString().split('T')[0]} to ${windowEnd.toISOString().split('T')[0]}.
      Stats: Followers ${stats.followers}, Engagement ${stats.engagement}%, Reach ${stats.reach}.

      Generate exactly ${postsToGenerate} social media posts spread across the next 2 weeks.
      Mix platforms (Facebook and Instagram). Schedule at optimal times for Australia.
      
      Return JSON with:
      - "strategy": a 2-sentence strategy summary
      - "posts": array of objects with: platform, scheduledFor (ISO datetime), topic, content, hashtags (array), imagePrompt, reasoning, pillar
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

    const data = response.text ? JSON.parse(response.text) : { posts: [], strategy: '' };
    return { posts: data.posts || [], strategy: data.strategy || '' };
  } catch (error) {
    console.error('Smart Schedule Error:', error);
    return { posts: [], strategy: `Error: ${error?.message || 'Unknown'}` };
  }
};

module.exports = {
  generateSocialPost,
  generateMarketingImage,
  analyzePostTimes,
  generateRecommendations,
  generateSmartSchedule
};
