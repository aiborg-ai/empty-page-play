# InnoSpot - Innovation Intelligence Platform

A comprehensive React TypeScript application for innovation intelligence featuring project-based research management, AI-powered capabilities, and professional collaboration tools.

## Features

### 🏠 Core Platform
- **Showcase Marketplace**: Discover and test AI capabilities with "Try Once" and "Sample me" functionality
- **Project-Centric Studio**: Unified workspace for research management and collaboration
- **AI Assistant**: OpenRouter-powered chat interface with context-aware support
- **Professional Network**: Connect with innovators and share research insights

### 🏢 Studio (Research Workspace)
- **Projects**: Categorized project management with Recent/Shared/Other organization
- **AI Agents**: Configure and deploy AI-powered research assistants
- **Tools**: Access analysis tools for patent research and data processing
- **Datasets**: Manage research datasets with import/export capabilities
- **Reports**: Generate and share analytical reports with AI insights

### 🤖 AI-Powered Features
- **Universal AI Integration**: AI summaries available across all content types
- **Interactive Testing**: "Try Once" for AI agents, "Sample me" for datasets/reports
- **Project Context Awareness**: All AI interactions scoped to current project
- **Smart Recommendations**: Personalized capability and connection suggestions

### 🔐 Authentication & Access
- **Multi-tier Registration**: Trial, Non-commercial, and Commercial user types
- **Project Access Levels**: Private, Team, Organization, and Public collaboration
- **Professional Profiles**: ORCID integration and innovation portfolio management

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Authentication**: Dual system - Supabase Auth + Demo Authentication Service
- **Icons**: Lucide React
- **Routing**: Client-side routing via state management (no React Router DOM currently active)
- **AI Integration**: OpenRouter API for multiple LLM providers
- **Project Management**: Custom project context service with asset management

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Supabase project credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint with TypeScript rules
- `npm run preview` - Preview production build

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Update the `.env` file with your credentials
4. The authentication table will be created automatically by Supabase

## Project Structure

```
src/
├── components/           # React components
│   ├── Showcase.tsx        # Capability marketplace with Try Once/Sample me
│   ├── Projects.tsx        # Project management with HarmonizedCard
│   ├── AIChat.tsx          # AI assistant with OpenRouter integration  
│   ├── Sidebar.tsx         # Two-level navigation with project context
│   ├── Header.tsx          # Top navigation with user actions
│   ├── RegisterForm.tsx    # Multi-tier user registration
│   ├── LoginForm.tsx       # Demo authentication
│   ├── AccountSettings.tsx # User settings with AI configuration
│   ├── PatentSearch.tsx    # Advanced patent search with tour
│   ├── *Dashboard.tsx      # Specialized dashboards (Jurisdiction, etc.)
│   ├── PlatformTour.tsx    # Interactive onboarding
│   └── HarmonizedCard.tsx  # Unified card component for all content types
├── lib/                  # Services and utilities
│   ├── projectContext.ts  # Project management and asset tracking
│   ├── sampleAssetsService.ts  # Sample generation for Try Once/Sample me
│   ├── demoAuth.ts         # Demo authentication service
│   ├── supabase.ts         # Supabase client configuration
│   └── openrouter.ts       # AI integration service
├── types/                # TypeScript definitions
│   ├── projects.ts         # Project and asset type definitions
│   ├── capabilities.ts     # Showcase marketplace types
│   ├── subscription.ts     # Billing and subscription types
│   └── auth.ts             # Authentication types
├── hooks/                # Custom React hooks
│   └── useProjectContext.ts # Project state management hook
├── App.tsx               # Main app with state-based routing
└── main.tsx              # Application entry point
```

## Application Architecture

### Authentication Flow
- **Dual Authentication**: Supabase Auth for production, Demo Auth for evaluation
- **Multi-tier Registration**: Trial, Non-commercial, and Commercial user types
- **Secure Login**: Comprehensive validation and error handling
- **Profile Management**: User preferences, AI settings, and professional details

### Project-Centric Studio Workflow
- **Project Selection**: Users select or create projects as context for all activities
- **Current Project Display**: Active project shown throughout Studio sections
- **Asset Management**: All assets (datasets, reports, analyses) tied to projects
- **Cross-Project Sharing**: Resources can be shared between projects with permissions
- **Activity Logging**: All user actions tracked within project context

### Navigation System
- **Two-Level Architecture**: Main menu with context-specific secondary navigation
- **State-Based Routing**: Client-side navigation without React Router DOM
- **Dynamic Sidebar**: Project context and current selection always visible
- **Breadcrumb Navigation**: Clear path showing current location and project

## Design System

- **Primary Colors**: Blue theme (#3b82f6) with success green (#10b981)  
- **Layout**: Header + Two-level Sidebar + Main content area
- **Typography**: Tailwind CSS utilities for consistent text hierarchy
- **Cards**: HarmonizedCard component for unified content display across the platform
- **Project Context**: Color-coded project indicators throughout UI
- **Responsive Design**: Mobile-first with breakpoint-specific layouts
- **AI Chat**: Sliding panel (384px width) positioned left of sidebar with blue accent styling

## AI Integration Features

### OpenRouter API Integration
- **Multiple AI Models**: GPT-4, GPT-3.5, Claude 3, Gemini Pro, Mixtral support
- **User API Key Management**: Secure local storage with settings in Account Settings
- **Context Scoping**: AI conversations scoped to Search Results, Collections, Reports, or Complete Patent Corpus
- **Streaming Support**: Real-time AI responses with proper loading states

### Try Once & Sample Me
- **Try Once**: Available for AI agents and Deep Dive capabilities - generates sample analyses and reports
- **Sample Me**: Available for Datasets and Reports - provides sample data and documentation  
- **Immediate Studio Access**: Sample assets instantly available in Studio sections
- **Project Integration**: All samples automatically associated with current project