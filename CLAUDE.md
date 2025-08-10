# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite on port 5173)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint with TypeScript rules and strict warnings
- `npm run preview` - Preview production build

## Architecture Overview

InnoSpot is a comprehensive React TypeScript patent intelligence platform with the following architecture:

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Authentication**: Dual system - Supabase Auth + Demo Authentication Service
- **Icons**: Lucide React
- **Routing**: Client-side routing via state management (no React Router DOM currently active)

### Application Structure

The app uses a single-page application pattern with state-based navigation managed in `App.tsx`. Key architectural elements:

- **State Management**: useState hooks for navigation and user state
- **Component Architecture**: Modular components in `/src/components/`
- **Type Safety**: Full TypeScript coverage with strict configuration
- **Authentication**: Two-layer auth system for demo and production use

### Key Components & Responsibilities

- `App.tsx`: Main application shell, navigation state management, authentication flow
- `Header.tsx`: Top navigation with user actions and branding
- `Sidebar.tsx`: Primary navigation menu with section routing
- `RegisterForm.tsx`: User registration with multiple account types (trial, non-commercial, commercial)
- `LoginForm.tsx`: Demo authentication for evaluation users
- `UserDashboard.tsx`: Main dashboard view post-authentication
- Dashboard Components: Specialized dashboards for patents, jurisdictions, applicants, citations, legal status, owners
- `PatentSearch.tsx`: Advanced patent search interface with tour integration
- `PlatformTour.tsx`: Interactive onboarding experience

### Authentication Architecture

The application implements a dual authentication system:

1. **Demo Authentication** (`/src/lib/demoAuth.ts`): Simplified auth for evaluation
2. **Supabase Integration** (`/src/lib/supabase.ts`): Production authentication system

User types supported: trial, non-commercial, commercial with different feature access levels.

### Dashboard System

The platform features multiple specialized dashboards:
- Jurisdiction Dashboard: Geographic patent analysis with world maps
- Applicants Dashboard: Company-focused patent portfolio analysis  
- Patent Citations Dashboard: Citation network analysis
- Legal Status Dashboard: Patent status and lifecycle tracking
- Owners Dashboard: Patent ownership and assignment tracking

### Navigation Flow

Navigation is state-based with sections including:
- `register/login`: Authentication flows
- `dashboard`: Main user dashboard
- `search`: Patent search interface
- `dashboards`: Main dashboard hub
- Specialized dashboards: `jurisdictions`, `applicants`, `citations`, `legal-status`, `owners`
- User features: `collections`, `work-area`, `user-dashboards`, `claimed-work`
- Support: Various support sections for different features

### Help System

Help links have been moved from sidebar "Need help?" links to contextual info icons (ℹ️) next to page titles:
- `PageHeader.tsx`: Reusable component for consistent page headers with optional help icons
- Pages with help: Collections, Claimed Work, AI Assistant, Dashboards
- Help icons appear next to page titles and navigate to relevant support pages
- This provides better visual spacing in the sidebar menu

## Environment Setup

1. Copy `.env.example` to `.env`
2. Configure Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## TypeScript Configuration

- Target: ES2020 with strict mode enabled
- JSX: react-jsx (React 17+ transform)
- Module resolution: bundler mode for Vite
- Strict linting: unused locals/parameters detection enabled

## Development Notes

- Vite dev server configured for `0.0.0.0:5173` (accessible from network)
- Demo credentials pre-filled in registration form for quick testing
- Platform tour integration available from search interface
- Full-screen dashboard modes supported with negative margins (`-m-6`)

## AI Assistant Feature

The platform includes a comprehensive AI chat assistant that slides in from the left sidebar:

### Components
- `AIChat.tsx`: Main sliding panel interface with context scoping and model selection
- `AIChatSupport.tsx`: Help page with setup instructions and usage guides
- `openrouter.ts`: Service for OpenRouter API integration supporting multiple LLM providers

### Key Features
- **Context Scoping**: Users can scope AI conversations to:
  - Search Results: Current filtered patent data
  - Collections: Saved patent collections
  - Reports: Generated analysis reports
  - Complete Patent Corpus: Full 165M+ patent database
- **Model Selection**: Support for GPT-4, GPT-3.5, Claude 3, Gemini Pro, Mixtral, and other models via OpenRouter
- **User API Key Management**: Secure local storage of OpenRouter API keys with settings in Account Settings
- **Chat History**: Local browser storage of conversations
- **Real-time Streaming**: Support for streaming responses from AI models

### Usage
1. Click "AI Assistant" in sidebar to open chat panel
2. Configure OpenRouter API key in settings panel or Account Settings > AI Settings
3. Select context scope and AI model
4. Chat with the platform about patent data and analysis

## Design System

- Primary: Blue theme (#3b82f6) 
- Success: Green (#10b981)
- Layout: Header + Sidebar + Main content area
- Gray-50 background with white content cards
- Responsive Tailwind utilities throughout
- Icon system: Lucide React with consistent sizing
- AI Chat: Sliding panel (384px width) positioned left of sidebar with blue accent styling