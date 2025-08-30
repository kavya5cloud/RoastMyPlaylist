import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface RoastGenerationRequest {
  topArtists: string[];
  topGenres: string[];
  sadSongsPercentage: number;
  mainStreamPercentage: number;
  nostalgiaPercentage: number;
  repeatArtist: string;
  repeatArtistCount: number;
  avgTempo: number;
  averageValence: number;
  oldestSong: number;
  uniqueArtists: number;
}

export interface GeneratedRoast {
  headline: string;
  description: string;
  category: string;
}

export class OpenAIService {
  async generateRoast(musicData: RoastGenerationRequest): Promise<GeneratedRoast> {
    try {
      const prompt = this.buildRoastPrompt(musicData);

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
        messages: [
          {
            role: "system",
            content: "You are a witty, sarcastic music critic who creates hilarious roasts of people's music taste. Your roasts should be funny, meme-like, and shareable but not genuinely mean or offensive. Use emojis sparingly and focus on clever observations about music patterns. Respond with JSON in this exact format: { 'headline': string, 'description': string, 'category': string }"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      if (!result.headline || !result.description || !result.category) {
        throw new Error('Invalid response format from OpenAI');
      }

      return {
        headline: result.headline,
        description: result.description,
        category: result.category
      };
    } catch (error) {
      console.error('Failed to generate roast:', error);
      // Fallback to pre-written roasts
      return this.getFallbackRoast(musicData);
    }
  }

  private buildRoastPrompt(data: RoastGenerationRequest): string {
    return `
Roast this person's music taste based on their Spotify data:

Top Artists: ${data.topArtists.slice(0, 5).join(', ')}
Top Genres: ${data.topGenres.slice(0, 3).join(', ')}
${data.repeatArtist} appears ${data.repeatArtistCount} times in their top tracks
${data.sadSongsPercentage}% of their music has low valence (sad vibes)
${data.mainStreamPercentage}% of their music is mainstream/popular
${data.nostalgiaPercentage}% of their music is from 2010-2015 (nostalgia territory)
Average tempo: ${data.avgTempo} BPM
They listen to ${data.uniqueArtists} unique artists
Oldest song in their library: ${data.oldestSong}

Create a witty, shareable roast that's sarcastic but not mean. The headline should be a punchy quote, and the description should elaborate with specific observations. Categories can be: "sad_songs", "mainstream", "nostalgia", "obsessed_fan", "slow_vibes", "basic_taste", or "eclectic".
    `.trim();
  }

  private getFallbackRoast(data: RoastGenerationRequest): GeneratedRoast {
    const roastTemplates = {
      sad_songs: {
        headline: "This playlist screams crying in the shower at 3 AM",
        description: `With ${data.sadSongsPercentage}% sad songs and an average tempo of ${data.avgTempo} BPM, your playlist is basically a therapy session set to music. Maybe try some upbeat songs between the emotional breakdowns?`
      },
      obsessed_fan: {
        headline: `Are you in a relationship with ${data.repeatArtist} or what?`,
        description: `Playing ${data.repeatArtist} ${data.repeatArtistCount} times in your top tracks isn't dedication, it's a cry for help. Even Spotify is concerned about your commitment issues.`
      },
      mainstream: {
        headline: "Your taste is so basic, even vanilla is jealous",
        description: `${data.mainStreamPercentage}% mainstream music means you basically let radio DJs curate your personality. At least you're consistent in your lack of originality.`
      },
      nostalgia: {
        headline: "Still living in the 2010s, I see",
        description: `${data.nostalgiaPercentage}% of your music is from the early 2010s. We get it, high school was the peak of your existence, but maybe it's time to discover what happened after 2015?`
      }
    };

    // Determine category based on data
    let category = 'basic_taste';
    if (data.sadSongsPercentage > 60) category = 'sad_songs';
    else if (data.repeatArtistCount > 8) category = 'obsessed_fan';
    else if (data.mainStreamPercentage > 80) category = 'mainstream';
    else if (data.nostalgiaPercentage > 50) category = 'nostalgia';

    const fallbackTemplate = {
      headline: "Your taste is questionably unique",
      description: `With ${data.uniqueArtists} artists in your rotation, you're either really eclectic or just can't make up your mind. Either way, it's... interesting.`
    };
    
    const template = roastTemplates[category as keyof typeof roastTemplates] || fallbackTemplate;
    
    return {
      ...template,
      category
    };
  }
}

export const openAIService = new OpenAIService();
