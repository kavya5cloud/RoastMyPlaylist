# Deploying to Vercel

This guide will help you deploy your Spotify Music Roast app to Vercel.

## Prerequisites

1. A Vercel account (free tier available)
2. GitHub account for connecting your repository
3. Required API keys:
   - OpenAI API key
   - Spotify API credentials (Client ID & Secret)

## Step 1: Prepare Your Repository

1. Push your code to a GitHub repository
2. Make sure all files are committed including:
   - `vercel.json` (Vercel configuration)
   - `api/index.ts` (Serverless API handler)
   - `.env.example` (Environment variables template)

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it as a Node.js project

## Step 3: Configure Environment Variables

In your Vercel dashboard, go to Settings > Environment Variables and add:

```
OPENAI_API_KEY=your_openai_api_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id_here  
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SESSION_SECRET=your_random_session_secret_here
```

## Step 4: Configure Spotify Redirect URI

1. Go to your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Edit your app settings
3. Add your Vercel domain to Redirect URIs:
   ```
   https://your-app-name.vercel.app/api/auth/spotify/callback
   ```

## Step 5: Build Configuration

Vercel will automatically:
- Build your frontend with `vite build` (configured in vercel.json)
- Set up serverless functions from `api/index.ts`
- Handle static file serving from `client/dist`

The build process:
1. Runs `vite build` to create the client bundle in `client/dist`
2. Sets up the API as a serverless function at `/api/*`
3. Routes all other requests to static files

## Step 6: Deploy

Click "Deploy" and Vercel will:
1. Install dependencies
2. Build your application
3. Deploy to a production URL

## Environment Variables Needed

- `OPENAI_API_KEY`: Your OpenAI API key for generating roasts
- `SPOTIFY_CLIENT_ID`: Spotify app client ID  
- `SPOTIFY_CLIENT_SECRET`: Spotify app client secret
- `SESSION_SECRET`: Random string for session encryption

## Notes

- The app uses in-memory storage by default (resets on deployment)
- For persistent data, configure a PostgreSQL database and set `DATABASE_URL`
- Static files are served from `client/dist`
- API routes are handled by `api/index.ts` as serverless functions

Your app will be available at: `https://your-project-name.vercel.app`