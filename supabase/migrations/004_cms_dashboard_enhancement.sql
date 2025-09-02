-- CMS Dashboard Enhancement Migration
-- Adds dashboard table and enhances existing CMS system with additional parameters

-- Create dashboard status enum
CREATE TYPE dashboard_status AS ENUM ('draft', 'published', 'archived', 'template');
CREATE TYPE dashboard_type AS ENUM ('analytics', 'reporting', 'monitoring', 'kpi', 'custom');
CREATE TYPE access_level AS ENUM ('private', 'team', 'organization', 'public');

-- Dashboards table
CREATE TABLE public.dashboards (
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
CREATE TABLE public.dashboard_collaborators (
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
CREATE TABLE public.dashboard_comments (
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

-- Enhance existing AI Agents table with additional parameters
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0';
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS api_endpoint TEXT;
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS api_key_required BOOLEAN DEFAULT false;
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS input_schema JSONB DEFAULT '{}';
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS output_schema JSONB DEFAULT '{}';
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS rate_limit INTEGER DEFAULT 100;
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS cost_per_call DECIMAL(10,6);
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS capabilities JSONB DEFAULT '[]';
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS training_data TEXT;
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS model_size TEXT;
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS accuracy_metrics JSONB DEFAULT '{}';
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Enhance existing Tools table with additional parameters
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0';
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS api_endpoint TEXT;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS authentication JSONB DEFAULT '{}';
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS input_schema JSONB DEFAULT '{}';
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS output_schema JSONB DEFAULT '{}';
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS rate_limit INTEGER DEFAULT 1000;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS cost_per_use DECIMAL(10,6);
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS supported_formats TEXT[] DEFAULT '{}';
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '{}';
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS documentation_url TEXT;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS integration_type TEXT; -- 'api', 'webhook', 'direct', 'plugin'

-- Enhance existing Datasets table with additional parameters
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0';
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS format TEXT; -- 'csv', 'json', 'xml', 'sql', etc.
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS encoding TEXT DEFAULT 'utf-8';
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS compression TEXT; -- 'gzip', 'zip', 'none'
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS access_level access_level DEFAULT 'private';
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS license TEXT;
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS quality_score INTEGER; -- 1-100 quality rating
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS freshness TIMESTAMPTZ; -- When data was last updated
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS validation_rules JSONB DEFAULT '{}';
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS sample_data JSONB DEFAULT '{}';
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS statistics JSONB DEFAULT '{}';
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS related_datasets UUID[] DEFAULT '{}';

-- Enhance existing Reports table with additional parameters
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0';
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.reports(id);
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '{}'; -- Automated report generation
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS recipients JSONB DEFAULT '[]'; -- Email recipients
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS export_formats TEXT[] DEFAULT '{"pdf","excel","html"}';
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS data_sources JSONB DEFAULT '[]';
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS refresh_frequency TEXT; -- 'manual', 'daily', 'weekly', 'monthly'
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS last_generated_at TIMESTAMPTZ;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS next_generation_at TIMESTAMPTZ;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS access_level access_level DEFAULT 'private';
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS interactive BOOLEAN DEFAULT false;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS parameters_schema JSONB DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX idx_dashboards_owner_id ON public.dashboards(owner_id);
CREATE INDEX idx_dashboards_project_id ON public.dashboards(project_id);
CREATE INDEX idx_dashboards_status ON public.dashboards(status);
CREATE INDEX idx_dashboards_type ON public.dashboards(type);
CREATE INDEX idx_dashboards_access_level ON public.dashboards(access_level);
CREATE INDEX idx_dashboards_tags ON public.dashboards USING gin(tags);
CREATE INDEX idx_dashboard_collaborators_user_id ON public.dashboard_collaborators(user_id);
CREATE INDEX idx_dashboard_comments_dashboard_id ON public.dashboard_comments(dashboard_id);
CREATE INDEX idx_dashboard_comments_user_id ON public.dashboard_comments(user_id);

-- Enhanced indexes for existing tables
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

-- Add update timestamp triggers for new tables
CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON public.dashboards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dashboard_comments_updated_at BEFORE UPDATE ON public.dashboard_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add full-text search for dashboards
ALTER TABLE public.dashboards ADD COLUMN search_vector tsvector;

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

CREATE TRIGGER update_dashboards_search_vector
    BEFORE INSERT OR UPDATE ON public.dashboards
    FOR EACH ROW
    EXECUTE FUNCTION update_dashboard_search_vector();

CREATE INDEX idx_dashboards_search_vector ON public.dashboards USING gin(search_vector);