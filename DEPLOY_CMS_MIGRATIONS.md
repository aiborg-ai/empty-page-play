# CMS Database Deployment Guide

## ⚠️ Migration Order (IMPORTANT!)

Run these migrations in **EXACT ORDER** in your Supabase SQL Editor:

### 1. **FIRST**: Initial CMS Schema
```sql
-- File: supabase/migrations/001_initial_cms_schema.sql
-- This creates all the base tables including organizations, projects, etc.
```

### 2. **SECOND**: Row Level Security Policies  
```sql
-- File: supabase/migrations/002_rls_policies.sql
-- This sets up security policies for the base tables
```

### 3. **THIRD**: Dashboard Enhancement (NEW)
```sql
-- File: supabase/migrations/004_cms_dashboard_enhancement.sql  
-- This adds dashboard table and enhances existing tables
```

### 4. **FOURTH**: Dashboard Security Policies (NEW)
```sql
-- File: supabase/migrations/005_dashboard_rls_policies.sql
-- This adds security policies for dashboards
```

## 🔧 Quick Fix Option

If you want to run just the dashboard enhancement without the full CMS, here's a simplified version:

### Option A: Minimal Dashboard-Only Migration

Run this instead of the full 004 migration:

```sql
-- Minimal Dashboard Enhancement (No Dependencies)
-- Only run this if you don't want the full CMS system

-- Create dashboard enums
CREATE TYPE dashboard_status AS ENUM ('draft', 'published', 'archived', 'template');
CREATE TYPE dashboard_type AS ENUM ('analytics', 'reporting', 'monitoring', 'kpi', 'custom');
CREATE TYPE access_level AS ENUM ('private', 'team', 'organization', 'public');

-- Simple dashboards table (no foreign key dependencies)
CREATE TABLE public.dashboards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type dashboard_type DEFAULT 'custom',
    status dashboard_status DEFAULT 'draft',
    access_level access_level DEFAULT 'private',
    
    -- Layout and configuration
    layout JSONB DEFAULT '{}',
    widgets JSONB DEFAULT '[]',
    filters JSONB DEFAULT '{}',
    refresh_interval INTEGER DEFAULT 300,
    
    -- Styling and appearance
    theme TEXT DEFAULT 'default',
    color_scheme JSONB DEFAULT '{}',
    custom_css TEXT,
    
    -- Data sources and connections
    data_sources JSONB DEFAULT '[]',
    queries JSONB DEFAULT '{}',
    parameters JSONB DEFAULT '{}',
    
    -- Ownership (using auth.users directly)
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    
    -- Categories and tags
    tags TEXT[] DEFAULT '{}',
    
    -- Usage tracking
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMPTZ,
    usage_stats JSONB DEFAULT '{}',
    
    -- Template functionality
    is_template BOOLEAN DEFAULT false,
    template_category TEXT,
    template_data JSONB DEFAULT '{}',
    
    -- Metadata and settings
    metadata JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    version INTEGER DEFAULT 1,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view their own dashboards" ON public.dashboards
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create dashboards" ON public.dashboards
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own dashboards" ON public.dashboards
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own dashboards" ON public.dashboards
    FOR DELETE USING (owner_id = auth.uid());

-- Indexes
CREATE INDEX idx_dashboards_owner_id ON public.dashboards(owner_id);
CREATE INDEX idx_dashboards_status ON public.dashboards(status);
CREATE INDEX idx_dashboards_type ON public.dashboards(type);
CREATE INDEX idx_dashboards_access_level ON public.dashboards(access_level);
CREATE INDEX idx_dashboards_tags ON public.dashboards USING gin(tags);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dashboards_updated_at 
    BEFORE UPDATE ON public.dashboards 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Option B: Full CMS System (Recommended)

Run all migrations in order:
1. `001_initial_cms_schema.sql` 
2. `002_rls_policies.sql`
3. `004_cms_dashboard_enhancement.sql`
4. `005_dashboard_rls_policies.sql`

## 🚀 After Migration

Your CMS system will support:
- ✅ User-specific dashboards with owner_id tagging
- ✅ Access level controls (private/team/org/public)  
- ✅ Full dashboard configuration and layout
- ✅ Widget management and data sources
- ✅ Template system and versioning
- ✅ Usage analytics and activity tracking

## ❓ Which Option Should You Choose?

- **Option A (Minimal)**: Just want dashboards, no full CMS
- **Option B (Full CMS)**: Want the complete system with projects, organizations, etc.

Let me know which option you prefer!