# Muslim Gen - Islamic Web Application

## Overview

Muslim Gen (المرشد الإسلامي) is an Islamic question-and-answer web application that provides guidance based on Quran and Sunnah. Users can ask Islamic questions through a chat interface and receive AI-powered responses from an Islamic bot service. The application features a clean, modern interface with support for Arabic typography, dark/light themes, and a conversational experience with chat history.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight React Router alternative)
- **TanStack Query** (React Query) for server state management
- **Tailwind CSS** with shadcn/ui component library for styling

**Design System:**
- Uses shadcn/ui components with the "new-york" style preset
- Custom theme system supporting **3 themes**: Light, Dark, and Midnight (deep blue/purple) via ThemeProvider context
- Tailwind configuration with custom HSL-based color system for consistent theming
- Arabic and English typography support (Noto Sans Arabic, Amiri, Inter fonts)
- Theme toggle cycles through: Light -> Dark -> Midnight -> Light
- Multi-language welcome screen with suggested questions in Arabic, English, Turkish, Urdu, French, and German with animated slide-in effects and language badges

**State Management:**
- Local component state (useState) for chat messages and UI interactions
- React Context for theme management
- In-memory chat history (no persistent storage on frontend)
- TanStack Query configured with infinite stale time and no automatic refetching

### Backend Architecture

**Server Framework:**
- **Express.js** server with TypeScript
- API-only backend that proxies requests to external Islamic bot service
- Custom Vite integration for development with HMR support

**API Design:**
- RESTful endpoint: `POST /api/chat`
- Accepts chat messages with optional conversation history
- Validates requests using Zod schemas
- Proxies to external Moslem Bot API (api.moslembot.com)
- Conversation history formatted as nested string arrays for external API compatibility

**Request/Response Flow:**
1. Client sends message with conversation history array
2. Server validates against `chatMessageSchema`
3. Server formats history as stringified nested arrays
4. Request proxied to external Islamic bot API with authentication
5. Response streamed back to client
6. Frontend handles streaming text display with typing indicators

### Data Storage Solutions

**Database Configuration:**
- Drizzle ORM configured with PostgreSQL dialect
- Neon Database serverless driver (@neondatabase/serverless)
- Schema location: `./shared/schema.ts`
- Migrations output: `./migrations`

**Current Storage:**
- No active database usage for chat messages (handled in-memory)
- Storage interface defined but not implemented (`server/storage.ts`)
- Conversation history maintained client-side during session
- No persistent user authentication or message history

**Rationale:** The application currently prioritizes stateless chat interactions. Database infrastructure is prepared for future features like user accounts, saved conversations, or analytics.

### External Dependencies

**Third-Party Services:**
- **Moslem Bot API** (api.moslembot.com) - Primary Islamic knowledge service
  - Requires API key and user ID environment variables
  - Provides Quran references, Hadith citations, and scholarly responses
  - Response format includes special markup for references (e.g., #49:17# for Quran, <sahih-muslim:1:162> for Hadith)

**Local Services:**
- **Hijri Date Calculator** - Local Python script using hijridate library
  - `server/hijri_date.py` - Converts Gregorian date to Hijri using Umm al-Qura calendar
  - `hijridate-2.5.0-py3-none-any.whl` - Python wheel file for hijridate library
  - No external API dependency - works offline
  - Returns format: "8 Jumada al-Thani 1447 AH"

**UI Component Libraries:**
- **Radix UI** - Headless component primitives (accordion, dialog, dropdown, popover, etc.)
- **Lucide React** - Icon library
- **cmdk** - Command menu component
- **Embla Carousel** - Carousel functionality
- **React Markdown** with remark-gfm - Markdown rendering for bot responses

**Development Tools:**
- **Replit-specific plugins** for vite (cartographer, dev banner, runtime error overlay)
- **tsx** for running TypeScript server in development
- **esbuild** for production server bundling

**Deployment:**
- Vercel configuration with separate builds for API and static client
- API routes proxied through Vercel serverless functions
- Static client served from `client/dist`

**Environment Variables Required:**
- `DATABASE_URL` - PostgreSQL connection string (for future use)
- `MOSLEM_BOT_API_KEY` - Authentication for Islamic bot service
- `MOSLEM_BOT_USER_ID` - User identifier for Islamic bot service