# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite on port 8080, accessible from network on ::)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint with TypeScript rules and strict warnings (max-warnings 0)
- `npm run preview` - Preview production build

**Testing**: No test scripts configured - verify with user before running tests

**Important**: Always run `npm run lint` and `npm run build` after making changes to ensure code quality and successful compilation.

## Architecture Overview

InnoSpot is a comprehensive React TypeScript patent intelligence platform with the following architecture:

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Authentication**: Triple-layer system - InstantAuth (demo), Supabase Auth, ProductionAuth
- **Icons**: Lucide React
- **Routing**: State-based navigation managed in App.tsx (no React Router DOM active)
- **Path Aliases**: `@` maps to `./src` directory

### Core Application Architecture

The app uses a single-page application pattern with centralized state management:

1. **Navigation State**: Managed entirely in `App.tsx` through `activeSection` state
2. **Authentication Flow**: InstantAuth → Supabase → ProductionAuth fallback chain
3. **Project Context**: Global project selection affects all workspace features
4. **Component Composition**: Modular components with extracted business logic in custom hooks

### Authentication System (Critical)

The platform implements a triple-layer authentication to ensure demo users work without email/SMS verification:

1. **InstantAuth** (`/src/lib/instantAuth.ts`): Primary demo authentication that bypasses ALL verification
   - Demo accounts: demo@innospot.com, researcher@innospot.com, commercial@innospot.com
   - Passwords stored in INSTANT_PASSWORDS map
   - Returns InstantUser interface with isDemo flag

2. **Supabase Auth** (`/src/lib/supabase.ts`): Production authentication with RLS
   - Requires email/SMS verification for real users
   - Manages Row Level Security policies

3. **ProductionAuth** (`/src/lib/productionAuth.ts`): Fallback for production demo users

### CMS & Dashboard System

The platform features a comprehensive CMS system with multiple asset types:

- **CMSStudio** (`/src/components/CMSStudio.tsx`): Central hub for managing all assets
- **Asset Types**: Dashboards, AI Agents, Tools, Datasets, Reports
- **Dashboard Service** (`/src/lib/dashboardService.ts`): CRUD operations with Supabase
- **Database Migrations**: Located in `/supabase/migrations/` - use ultra-safe patterns with IF NOT EXISTS

Key migration: `008_ultra_safe_dashboard.sql` - Zero foreign key dependencies approach

### Showcase System (Recently Refactored)

The Showcase component was refactored from 1077+ lines to 179 lines with improved architecture:

**Component Structure**:
- `Showcase.tsx`: Main component (179 lines)
- `modals/RunCapabilityModal.tsx`: Capability execution modal
- `modals/ShareCapabilityModal.tsx`: Sharing functionality
- `showcase/ShowcaseSidebar.tsx`: Category navigation sidebar
- `hooks/useShowcase.ts`: Business logic and state management
- `utils/showcaseUtils.ts`: Type-safe utility functions
- `constants/mockCapabilities.ts`: Mock data separation

**Key Features**:
- All tools available for immediate use (no purchase required)
- Project selection populated from user's actual projects
- Harmonized categories with Studio: AI Agents, Tools, Datasets, Reports, Dashboards

### Project Context System

Global project selection that affects multiple features:

- **ProjectContextService** (`/src/lib/projectContext.ts`): Singleton service for project state
- **useProjectContext** hook: Access current project throughout the app
- **Project Banner**: Shows current project in workspace features
- Affects: CMSStudio, Showcase, Work Area, Collections

### Type System

The codebase uses comprehensive TypeScript with multiple type definitions:

- `/src/types/cms.ts`: CMS entities (Dashboard, Project, AIAgent, Tool, Dataset, Report)
- `/src/types/capabilities.ts`: Showcase capabilities and parameters
- `/src/types/auth.ts`: Authentication interfaces
- `/src/types/projects.ts`: Legacy project types (being migrated to cms.ts)

**Important**: Project type has inconsistent property names across modules:
- CMS uses: `asset_count`, `owner_id`
- Legacy uses: `assetCount`, `ownerId`
- Use utility functions in `showcaseUtils.ts` for safe access

### Component Patterns

1. **Harmonized Cards**: Reusable card component with stats, keywords, attributes, actions
2. **Page Headers**: Consistent headers with optional help icons (ℹ️)
3. **Modal Pattern**: Extracted modals as separate components with props interfaces
4. **Custom Hooks**: Business logic separated into hooks (useShowcase, useProjectContext)
5. **Service Layer**: API calls abstracted in service files

### Database & Supabase

- **Migrations**: Use ultra-safe patterns with IF NOT EXISTS to avoid conflicts
- **RLS Policies**: Row Level Security enabled on all tables
- **Demo Data**: Created via migration `010_create_demo_user.sql`
- **Foreign Keys**: Minimal FK constraints to avoid dependency issues

### Environment Setup

1. Copy `.env.example` to `.env`
2. Configure Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

**Development Quick Start**:
```bash
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### Build Configuration

**Vite Config**:
- Server runs on port 8080 (not 5173)
- Host set to `::` for network accessibility
- Manual chunks for optimization: vendor, supabase, ui, router
- Chunk size warning limit: 1000kb

**TypeScript Config**:
- Target: ES2020 with strict mode
- JSX: react-jsx transform
- Module resolution: bundler mode
- Path alias: `@` → `./src`

### AI Assistant Integration

The platform includes OpenRouter integration for AI chat:

- **AIChat Component**: Sliding panel from left sidebar
- **Context Scoping**: Search results, collections, reports, or full corpus
- **Model Support**: GPT-4, Claude 3, Gemini Pro via OpenRouter API
- **Key Storage**: User's OpenRouter API key stored in localStorage

### Design System

- **Primary Color**: Blue (#3b82f6)
- **Success Color**: Green (#10b981)
- **Layout**: Header + Sidebar + Main content
- **Background**: Gray-50 with white content cards
- **Spacing**: Consistent Tailwind utilities
- **Full-screen Mode**: Use `-m-6` for dashboard views

### Migration Management

Supabase migrations are located in `/supabase/migrations/` with strict naming convention:
- Always use `IF NOT EXISTS` patterns for safety
- Zero foreign key dependencies approach (see `008_ultra_safe_dashboard.sql`)
- Demo user created via `010_create_demo_user.sql`
- Run migrations in order - see `MIGRATION_ORDER_GUIDE.md` for deployment sequence

### Deployment

The project includes comprehensive deployment guides:
- **Primary**: `DEPLOYMENT_GUIDE.md` - Vercel + Supabase (recommended)
- **Alternative**: Netlify + Supabase setup
- **Migration Scripts**: Located in `/scripts/` directory
- **Production**: See `PRODUCTION_DEPLOYMENT_GUIDE.md` for production setup

### Recent Major Changes

1. **Showcase Refactoring**: Component split from 1077+ lines to modular architecture
2. **InstantAuth Implementation**: Bypasses all Supabase verification for demo users
3. **CMS System Addition**: Complete asset management with Studio interface
4. **Project Context**: Global project selection system
5. **Secondary Sidebars**: Added to Showcase and Studio for harmonized navigation

## Important Development Reminders

- **No test framework configured**: Always verify testing approach with user before running tests
- **TypeScript strict mode**: Code must pass strict TypeScript compilation (`npm run build`)
- **Linting enforced**: Zero warnings policy with ESLint (`npm run lint`)
- **Demo authentication**: InstantAuth bypasses Supabase verification for demo users
- **Database migrations**: Use ultra-safe patterns with `IF NOT EXISTS` clauses
- **Path aliases**: Use `@/` prefix for src imports (configured in tsconfig.json and vite.config.ts)