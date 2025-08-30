import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  spotifyId: text("spotify_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email"),
  profileImage: text("profile_image"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  tokenExpiresAt: timestamp("token_expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roasts = pgTable("roasts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  headline: text("headline").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  musicData: jsonb("music_data").notNull(),
  analysisData: jsonb("analysis_data").notNull(),
  shareableUrl: text("shareable_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const spotifyData = pgTable("spotify_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  topTracks: jsonb("top_tracks").notNull(),
  topArtists: jsonb("top_artists").notNull(),
  recentlyPlayed: jsonb("recently_played").notNull(),
  audioFeatures: jsonb("audio_features").notNull(),
  playlists: jsonb("playlists").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertRoastSchema = createInsertSchema(roasts).omit({
  id: true,
  createdAt: true,
  shareableUrl: true,
});

export const insertSpotifyDataSchema = createInsertSchema(spotifyData).omit({
  id: true,
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRoast = z.infer<typeof insertRoastSchema>;
export type Roast = typeof roasts.$inferSelect;
export type InsertSpotifyData = z.infer<typeof insertSpotifyDataSchema>;
export type SpotifyData = typeof spotifyData.$inferSelect;

// Spotify API response types
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  album: { name: string; release_date: string };
  duration_ms: number;
  popularity: number;
  external_urls: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface AudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
}

export interface MusicAnalysis {
  sadSongsPercentage: number;
  mainStreamPercentage: number;
  nostalgiaPercentage: number;
  topArtistPlays: number;
  oldestSong: number;
  avgTempo: number;
  uniqueArtists: number;
  dominantGenres: string[];
  averagePopularity: number;
  averageValence: number;
  repeatArtist: string;
  repeatArtistCount: number;
}
