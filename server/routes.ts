import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { spotifyService } from "./services/spotify";
import { openAIService } from "./services/openai";
import { musicAnalyzer } from "./services/roast-generator";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Spotify OAuth routes
  app.get("/api/auth/spotify", async (req, res) => {
    try {
      const state = randomUUID();
      req.session.spotifyState = state;
      
      const authUrl = await spotifyService.getAuthUrl(state);
      res.json({ authUrl });
    } catch (error) {
      console.error('Spotify auth error:', error);
      res.status(500).json({ message: "Failed to initiate Spotify authentication" });
    }
  });

  app.get("/api/auth/spotify/callback", async (req, res) => {
    try {
      const { code, state } = req.query as { code: string; state: string };
      
      if (!code || !state || state !== req.session.spotifyState) {
        return res.status(400).json({ message: "Invalid authorization code or state" });
      }

      // Exchange code for tokens
      const tokens = await spotifyService.exchangeCodeForTokens(code);
      
      // Get user profile
      const profile = await spotifyService.getUserProfile(tokens.access_token);
      
      // Create or update user
      const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
      
      let user = await storage.getUserBySpotifyId(profile.id);
      if (user) {
        user = await storage.updateUserTokens(user.id, {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiresAt: expiresAt
        });
      } else {
        user = await storage.createUser({
          spotifyId: profile.id,
          displayName: profile.display_name,
          email: profile.email,
          profileImage: profile.images[0]?.url || null,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiresAt: expiresAt
        });
      }

      req.session.userId = user.id;
      res.redirect('/?auth=success');
    } catch (error) {
      console.error('Spotify callback error:', error);
      res.redirect('/?auth=error');
    }
  });

  // Get current user
  app.get("/api/user", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without sensitive data
      const { accessToken, refreshToken, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  // Generate roast
  app.post("/api/roast", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if token needs refresh
      let accessToken = user.accessToken;
      if (new Date() >= user.tokenExpiresAt) {
        const refreshed = await spotifyService.refreshToken(user.refreshToken);
        const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000);
        
        await storage.updateUserTokens(user.id, {
          accessToken: refreshed.access_token,
          refreshToken: user.refreshToken,
          tokenExpiresAt: newExpiresAt
        });
        
        accessToken = refreshed.access_token;
      }

      // Fetch Spotify data
      const [topTracks, topArtists, recentlyPlayed, playlists] = await Promise.all([
        spotifyService.getTopTracks(accessToken),
        spotifyService.getTopArtists(accessToken),
        spotifyService.getRecentlyPlayed(accessToken),
        spotifyService.getUserPlaylists(accessToken)
      ]);

      // Get audio features for top tracks (with fallback)
      const trackIds = topTracks.map(t => t.id);
      let audioFeatures: any[] = [];
      
      try {
        audioFeatures = await spotifyService.getAudioFeatures(accessToken, trackIds);
      } catch (error) {
        console.warn('Failed to fetch audio features, using fallback analysis:', error);
        // Create fallback audio features with default values
        audioFeatures = trackIds.map(() => ({
          danceability: 0.5,
          energy: 0.5,
          valence: 0.5,
          tempo: 120,
          acousticness: 0.5,
          instrumentalness: 0.1,
          speechiness: 0.1
        }));
      }

      // Store Spotify data
      await storage.createOrUpdateSpotifyData({
        userId: user.id,
        topTracks,
        topArtists,
        recentlyPlayed,
        audioFeatures,
        playlists
      });

      // Analyze music data
      const analysis = musicAnalyzer.analyzeMusicData(topTracks, topArtists, audioFeatures);

      // Generate roast using OpenAI
      const roastData = await openAIService.generateRoast({
        topArtists: topArtists.slice(0, 5).map(a => a.name),
        topGenres: analysis.dominantGenres,
        sadSongsPercentage: analysis.sadSongsPercentage,
        mainStreamPercentage: analysis.mainStreamPercentage,
        nostalgiaPercentage: analysis.nostalgiaPercentage,
        repeatArtist: analysis.repeatArtist,
        repeatArtistCount: analysis.repeatArtistCount,
        avgTempo: analysis.avgTempo,
        averageValence: analysis.averageValence,
        oldestSong: analysis.oldestSong,
        uniqueArtists: analysis.uniqueArtists
      });

      // Save roast
      const roast = await storage.createRoast({
        userId: user.id,
        headline: roastData.headline,
        description: roastData.description,
        category: roastData.category,
        musicData: {
          topTracks: topTracks.slice(0, 10),
          topArtists: topArtists.slice(0, 10)
        },
        analysisData: analysis
      });

      res.json({
        roast,
        analysis,
        user: {
          id: user.id,
          displayName: user.displayName,
          profileImage: user.profileImage
        }
      });
    } catch (error) {
      console.error('Generate roast error:', error);
      res.status(500).json({ message: "Failed to generate roast. Please try again." });
    }
  });

  // Get roast by ID (for sharing)
  app.get("/api/roast/:id", async (req, res) => {
    try {
      const roast = await storage.getRoast(req.params.id);
      if (!roast) {
        return res.status(404).json({ message: "Roast not found" });
      }

      const user = await storage.getUser(roast.userId);
      res.json({
        roast,
        user: user ? {
          displayName: user.displayName,
          profileImage: user.profileImage
        } : null
      });
    } catch (error) {
      console.error('Get roast error:', error);
      res.status(500).json({ message: "Failed to fetch roast" });
    }
  });

  // Logout
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
