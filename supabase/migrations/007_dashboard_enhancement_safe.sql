-- Safe Dashboard Enhancement Migration
-- Handles existing objects gracefully with IF NOT EXISTS

-- Create dashboard enums (safe)
DO $$ BEGIN
    CREATE TYPE dashboard_status AS ENUM ('draft', 'published', 'archived', 'template');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dashboard_type AS ENUM ('analytics', 'reporting', 'monitoring', 'kpi', 'custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE access_level AS ENUM ('private', 'team', 'organization', 'public');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Dashboards table
CREATE TABLE IF NOT EXISTS public.dashboards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type dashboard_type DEFAULT 'custom',
    status dashboard_status DEFAULT 'draft',
    access_level access_level DEFAULT 'private',
    
    -- Layout and configuration
    layout JSONB DEFAULT '{}', -- Dashboard layout configuration
    widgets JSONB DEFAULT '[]', -- Widget configurations
    filters JSONB DEFAULT '{}', -- Default filters
    refresh_interval INTEGER DEFAULT 300, -- Auto-refresh in seconds
    
    -- Styling and appearance
    theme TEXT DEFAULT 'default',
    color_scheme JSONB DEFAULT '{}',
    custom_css TEXT,
    
    -- Data sources and connections
    data_sources JSONB DEFAULT '[]', -- Connected data sources
    queries JSONB DEFAULT '{}', -- Stored queries
    parameters JSONB DEFAULT '{}', -- Dashboard parameters
    
    -- Permissions and sharing
    permissions JSONB DEFAULT '{}', -- Granular permissions
    share_settings JSONB DEFAULT '{}', -- Sharing configuration
    embed_settings JSONB DEFAULT '{}', -- Embed options
    
    -- Ownership and project association
    project_id UUID REFERENCES public.projects(id),
    owner_id UUID REFERENCES public.users(id) NOT NULL,
    organization_id UUID REFERENCES public.organizations(id),
    
    -- Categories and tags
    category_id UUID REFERENCES public.categories(id),
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

-- Dashboard collaborators (for granular access control)
CREATE TABLE IF NOT EXISTS public.dashboard_collaborators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'viewer', -- owner, editor, viewer, commenter
    permissions JSONB DEFAULT '{}', -- Specific permissions
    invited_by UUID REFERENCES public.users(id),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    UNIQUE(dashboard_id, user_id)
);

-- Dashboard comments/annotations
CREATE TABLE IF NOT EXISTS public.dashboard_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    widget_id TEXT, -- Optional: comment on specific widget
    content TEXT NOT NULL,
    position JSONB, -- Optional: position on dashboard
    is_resolved BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES public.dashboard_comments(id), -- For replies
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhance existing AI Agents table with additional parameters (safe)
DO $$
BEGIN
    -- Add columns only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='category') THEN
        ALTER TABLE public.ai_agents ADD COLUMN category TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='version') THEN
        ALTER TABLE public.ai_agents ADD COLUMN version TEXT DEFAULT '1.0';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='api_endpoint') THEN
        ALTER TABLE public.ai_agents ADD COLUMN api_endpoint TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='api_key_required') THEN
        ALTER TABLE public.ai_agents ADD COLUMN api_key_required BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='input_schema') THEN
        ALTER TABLE public.ai_agents ADD COLUMN input_schema JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='output_schema') THEN
        ALTER TABLE public.ai_agents ADD COLUMN output_schema JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='rate_limit') THEN
        ALTER TABLE public.ai_agents ADD COLUMN rate_limit INTEGER DEFAULT 100;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='cost_per_call') THEN
        ALTER TABLE public.ai_agents ADD COLUMN cost_per_call DECIMAL(10,6);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='tags') THEN
        ALTER TABLE public.ai_agents ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='capabilities') THEN
        ALTER TABLE public.ai_agents ADD COLUMN capabilities JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_agents' AND column_name='is_public') THEN
        ALTER TABLE public.ai_agents ADD COLUMN is_public BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Enhance existing Tools table with additional parameters (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tools' AND column_name='version') THEN
        ALTER TABLE public.tools ADD COLUMN version TEXT DEFAULT '1.0';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tools' AND column_name='api_endpoint') THEN
        ALTER TABLE public.tools ADD COLUMN api_endpoint TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tools' AND column_name='authentication') THEN
        ALTER TABLE public.tools ADD COLUMN authentication JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tools' AND column_name='input_schema') THEN
        ALTER TABLE public.tools ADD COLUMN input_schema JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tools' AND column_name='output_schema') THEN
        ALTER TABLE public.tools ADD COLUMN output_schema JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tools' AND column_name='tags') THEN
        ALTER TABLE public.tools ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tools' AND column_name='is_public') THEN
        ALTER TABLE public.tools ADD COLUMN is_public BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Enhance existing Datasets table with additional parameters (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='datasets' AND column_name='version') THEN
        ALTER TABLE public.datasets ADD COLUMN version TEXT DEFAULT '1.0';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='datasets' AND column_name='format') THEN
        ALTER TABLE public.datasets ADD COLUMN format TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='datasets' AND column_name='access_level') THEN
        ALTER TABLE public.datasets ADD COLUMN access_level access_level DEFAULT 'private';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='datasets' AND column_name='tags') THEN
        ALTER TABLE public.datasets ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='datasets' AND column_name='quality_score') THEN
        ALTER TABLE public.datasets ADD COLUMN quality_score INTEGER;
    END IF;
END $$;

-- Enhance existing Reports table with additional parameters (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='version') THEN
        ALTER TABLE public.reports ADD COLUMN version TEXT DEFAULT '1.0';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='access_level') THEN
        ALTER TABLE public.reports ADD COLUMN access_level access_level DEFAULT 'private';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='tags') THEN
        ALTER TABLE public.reports ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='interactive') THEN
        ALTER TABLE public.reports ADD COLUMN interactive BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create indexes for better performance (safe)
CREATE INDEX IF NOT EXISTS idx_dashboards_owner_id ON public.dashboards(owner_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_project_id ON public.dashboards(project_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_status ON public.dashboards(status);
CREATE INDEX IF NOT EXISTS idx_dashboards_type ON public.dashboards(type);
CREATE INDEX IF NOT EXISTS idx_dashboards_access_level ON public.dashboards(access_level);
CREATE INDEX IF NOT EXISTS idx_dashboards_tags ON public.dashboards USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_dashboard_collaborators_user_id ON public.dashboard_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_comments_dashboard_id ON public.dashboard_comments(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_comments_user_id ON public.dashboard_comments(user_id);

-- Enhanced indexes for existing tables (safe)
CREATE INDEX IF NOT EXISTS idx_ai_agents_tags ON public.ai_agents USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_ai_agents_category ON public.ai_agents(category);
CREATE INDEX IF NOT EXISTS idx_ai_agents_is_public ON public.ai_agents(is_public);
CREATE INDEX IF NOT EXISTS idx_tools_tags ON public.tools USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_tools_category ON public.tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_is_public ON public.tools(is_public);
CREATE INDEX IF NOT EXISTS idx_datasets_tags ON public.datasets USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_datasets_access_level ON public.datasets(access_level);
CREATE INDEX IF NOT EXISTS idx_datasets_format ON public.datasets(format);
CREATE INDEX IF NOT EXISTS idx_reports_tags ON public.reports USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_reports_access_level ON public.reports(access_level);

-- Add update timestamp triggers for new tables (safe)
DROP TRIGGER IF EXISTS update_dashboards_updated_at ON public.dashboards;
DROP TRIGGER IF EXISTS update_dashboard_comments_updated_at ON public.dashboard_comments;

CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON public.dashboards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dashboard_comments_updated_at BEFORE UPDATE ON public.dashboard_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add full-text search for dashboards (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='dashboards' AND column_name='search_vector') THEN
        ALTER TABLE public.dashboards ADD COLUMN search_vector tsvector;
    END IF;
END $$;

CREATE OR REPLACE FUNCTION update_dashboard_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', array_to_string(NEW.tags, ' ')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_dashboards_search_vector ON public.dashboards;
CREATE TRIGGER update_dashboards_search_vector
    BEFORE INSERT OR UPDATE ON public.dashboards
    FOR EACH ROW
    EXECUTE FUNCTION update_dashboard_search_vector();

CREATE INDEX IF NOT EXISTS idx_dashboards_search_vector ON public.dashboards USING gin(search_vector);