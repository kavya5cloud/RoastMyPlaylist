# Overview

This is a Spotify music taste roasting application that generates humorous critiques of users' music preferences. The app integrates with the Spotify API to analyze listening habits and uses OpenAI to create entertaining, shareable roasts based on musical patterns and preferences.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript using Vite as the build tool. The UI layer uses shadcn/ui components built on top of Radix UI primitives with Tailwind CSS for styling. State management is handled through TanStack Query for server state and React hooks for local state.

The routing system uses Wouter for client-side navigation between the home page, loading screen, and results display. The application follows a single-page application (SPA) pattern with three main routes: authentication/home, analysis loading, and roast results.

## Backend Architecture
The server is built with Express.js and TypeScript, following a modular service-oriented architecture. Core services include:

- **Spotify Service**: Handles OAuth flow, token management, and Spotify API interactions
- **OpenAI Service**: Generates creative roasts using GPT-5 based on music analysis data
- **Music Analyzer**: Processes Spotify data to extract patterns like sad song percentages, mainstream preferences, and nostalgia factors
- **Storage Layer**: Currently implements in-memory storage with interfaces designed for future database integration

The server uses session-based authentication with middleware for request logging and error handling.

## Data Storage
The application uses Drizzle ORM with PostgreSQL schemas defined for users, roasts, and Spotify data. The current implementation includes an in-memory storage adapter with interfaces designed for seamless migration to persistent database storage.

Database tables include:
- Users table with Spotify integration fields and token management
- Roasts table storing generated content and analysis data
- Spotify data table for caching user music information

## Authentication and Authorization
Authentication flows through Spotify OAuth 2.0 with PKCE. The system manages access tokens, refresh tokens, and automatic token renewal. Session state is maintained server-side with security measures for CSRF protection.

The OAuth flow includes state validation and secure callback handling with error recovery mechanisms.

# External Dependencies

## Third-Party Services
- **Spotify Web API**: Core integration for user authentication and music data retrieval including top tracks, artists, playlists, and audio features
- **OpenAI API**: Powers the roast generation using GPT-5 for creative content creation
- **Neon Database**: PostgreSQL hosting service (configured via Drizzle but not yet actively used)

## Key Libraries
- **Frontend**: React, TanStack Query, Wouter (routing), Radix UI, Tailwind CSS, html2canvas (image generation)
- **Backend**: Express.js, Drizzle ORM, connect-pg-simple (session storage)
- **Development**: Vite, TypeScript, ESBuild
- **UI Components**: Complete shadcn/ui component library for consistent design system

## Build and Deployment
The application builds the frontend with Vite and bundles the backend with ESBuild. It's configured for deployment with separate development and production environments, including Replit-specific tooling and error handling.