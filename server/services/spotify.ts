import type { User, SpotifyTrack, SpotifyArtist, AudioFeatures } from "@shared/schema";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.REPLIT_DOMAINS 
  ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/api/auth/spotify/callback`
  : 'http://localhost:5000/api/auth/spotify/callback';

export class SpotifyService {
  private baseUrl = 'https://api.spotify.com/v1';

  async getAuthUrl(state: string): Promise<string> {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-read-private',
      'playlist-read-collaborative'
    ].join(' ');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: REDIRECT_URI,
      state
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
    expires_in: number;
  }> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return response.json();
  }

  async getUserProfile(accessToken: string): Promise<{
    id: string;
    display_name: string;
    email: string;
    images: { url: string }[];
  }> {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }

  async getTopTracks(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<SpotifyTrack[]> {
    const response = await fetch(`${this.baseUrl}/me/top/tracks?limit=50&time_range=${timeRange}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }

    const data = await response.json();
    return data.items;
  }

  async getTopArtists(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<SpotifyArtist[]> {
    const response = await fetch(`${this.baseUrl}/me/top/artists?limit=50&time_range=${timeRange}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top artists');
    }

    const data = await response.json();
    return data.items;
  }

  async getRecentlyPlayed(accessToken: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/me/player/recently-played?limit=50`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recently played tracks');
    }

    const data = await response.json();
    return data.items;
  }

  async getAudioFeatures(accessToken: string, trackIds: string[]): Promise<AudioFeatures[]> {
    if (trackIds.length === 0) {
      return [];
    }

    // Spotify API allows max 100 tracks per request
    const batchSize = 100;
    const allFeatures: AudioFeatures[] = [];

    for (let i = 0; i < trackIds.length; i += batchSize) {
      const batch = trackIds.slice(i, i + batchSize);
      const idsParam = batch.join(',');
      
      console.log(`Fetching audio features for ${batch.length} tracks`);
      
      const response = await fetch(`${this.baseUrl}/audio-features?ids=${idsParam}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Audio features error:', response.status, errorText);
        throw new Error(`Failed to fetch audio features: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      if (data.audio_features) {
        allFeatures.push(...data.audio_features.filter(Boolean));
      }
    }

    return allFeatures;
  }

  async getUserPlaylists(accessToken: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/me/playlists?limit=50`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user playlists');
    }

    const data = await response.json();
    return data.items;
  }
}

export const spotifyService = new SpotifyService();
