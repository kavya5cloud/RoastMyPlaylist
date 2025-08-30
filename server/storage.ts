import { type User, type InsertUser, type Roast, type InsertRoast, type SpotifyData, type InsertSpotifyData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserBySpotifyId(spotifyId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTokens(id: string, tokens: { accessToken: string; refreshToken: string; tokenExpiresAt: Date }): Promise<User>;
  createRoast(roast: InsertRoast): Promise<Roast>;
  getRoast(id: string): Promise<Roast | undefined>;
  createOrUpdateSpotifyData(data: InsertSpotifyData): Promise<SpotifyData>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private roasts: Map<string, Roast>;
  private spotifyData: Map<string, SpotifyData>;

  constructor() {
    this.users = new Map();
    this.roasts = new Map();
    this.spotifyData = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserBySpotifyId(spotifyId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.spotifyId === spotifyId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      email: insertUser.email || null,
      profileImage: insertUser.profileImage || null,
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserTokens(id: string, tokens: { accessToken: string; refreshToken: string; tokenExpiresAt: Date }): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = { ...user, ...tokens };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createRoast(insertRoast: InsertRoast): Promise<Roast> {
    const id = randomUUID();
    const roast: Roast = { 
      ...insertRoast, 
      id, 
      createdAt: new Date(),
      shareableUrl: null
    };
    this.roasts.set(id, roast);
    return roast;
  }

  async getRoast(id: string): Promise<Roast | undefined> {
    return this.roasts.get(id);
  }

  async createOrUpdateSpotifyData(insertData: InsertSpotifyData): Promise<SpotifyData> {
    const id = randomUUID();
    const data: SpotifyData = { 
      ...insertData, 
      id, 
      lastUpdated: new Date() 
    };
    this.spotifyData.set(id, data);
    return data;
  }
}

export const storage = new MemStorage();
