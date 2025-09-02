-- Ultra Safe Dashboard Migration - No Dependencies
-- This version creates dashboards without any foreign key dependencies that might not exist

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

-- Ultra Safe Dashboards table (minimal dependencies)
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
    
    -- Ownership (ONLY reference auth.users - guaranteed to exist)
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    
    -- Optional references (stored as UUIDs, no foreign keys for now)
    project_id UUID, -- Will add constraint later if projects table exists
    organization_id UUID, -- Will add constraint later if organizations table exists
    category_id UUID, -- Will add constraint later if categories table exists
    
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

-- Dashboard collaborators (simplified)
CREATE TABLE IF NOT EXISTS public.dashboard_collaborators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'viewer', -- owner, editor, viewer, commenter
    permissions JSONB DEFAULT '{}', -- Specific permissions
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    UNIQUE(dashboard_id, user_id)
);

-- Dashboard comments/annotations
CREATE TABLE IF NOT EXISTS public.dashboard_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    widget_id TEXT, -- Optional: comment on specific widget
    content TEXT NOT NULL,
    position JSONB, -- Optional: position on dashboard
    is_resolved BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES public.dashboard_comments(id), -- For replies
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_comments ENABLE ROW LEVEL SECURITY;

-- Simple access function (no dependencies on other tables)
CREATE OR REPLACE FUNCTION can_access_dashboard_ultra_safe(dashboard_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    dashboard_record RECORD;
BEGIN
    SELECT access_level, owner_id INTO dashboard_record
    FROM public.dashboards 
    WHERE id = dashboard_uuid;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Owner always has access
    IF dashboard_record.owner_id = auth.uid() THEN
        RETURN TRUE;
    END IF;
    
    -- Check based on access level
    CASE dashboard_record.access_level
        WHEN 'public' THEN
            RETURN TRUE;
        WHEN 'private' THEN
            RETURN EXISTS (
                SELECT 1 FROM public.dashboard_collaborators
                WHERE dashboard_id = dashboard_uuid AND user_id = auth.uid()
            );
        ELSE
            -- For team/organization, just check if user is collaborator for now
            RETURN EXISTS (
                SELECT 1 FROM public.dashboard_collaborators
                WHERE dashboard_id = dashboard_uuid AND user_id = auth.uid()
            );
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ultra Safe RLS Policies
CREATE POLICY "Users can view accessible dashboards" ON public.dashboards
    FOR SELECT USING (can_access_dashboard_ultra_safe(id));

CREATE POLICY "Users can create dashboards" ON public.dashboards
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

CREATE POLICY "Owners can update their dashboards" ON public.dashboards
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their dashboards" ON public.dashboards
    FOR DELETE USING (owner_id = auth.uid());

-- Dashboard collaborators policies
CREATE POLICY "View collaborators of accessible dashboards" ON public.dashboard_collaborators
    FOR SELECT USING (can_access_dashboard_ultra_safe(dashboard_id));

CREATE POLICY "Dashboard owners manage collaborators" ON public.dashboard_collaborators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.dashboards 
            WHERE id = dashboard_id AND owner_id = auth.uid()
        )
    );

-- Dashboard comments policies
CREATE POLICY "View comments on accessible dashboards" ON public.dashboard_comments
    FOR SELECT USING (can_access_dashboard_ultra_safe(dashboard_id));

CREATE POLICY "Add comments to accessible dashboards" ON public.dashboard_comments
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        can_access_dashboard_ultra_safe(dashboard_id)
    );

CREATE POLICY "Update own comments" ON public.dashboard_comments
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Delete own comments or dashboard owner can delete" ON public.dashboard_comments
    FOR DELETE USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.dashboards 
            WHERE id = dashboard_id AND owner_id = auth.uid()
        )
    );

-- Create indexes (safe)
CREATE INDEX IF NOT EXISTS idx_dashboards_owner_id ON public.dashboards(owner_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_status ON public.dashboards(status);
CREATE INDEX IF NOT EXISTS idx_dashboards_type ON public.dashboards(type);
CREATE INDEX IF NOT EXISTS idx_dashboards_access_level ON public.dashboards(access_level);
CREATE INDEX IF NOT EXISTS idx_dashboards_tags ON public.dashboards USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_dashboards_project_id ON public.dashboards(project_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_organization_id ON public.dashboards(organization_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_collaborators_user_id ON public.dashboard_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_collaborators_dashboard_id ON public.dashboard_collaborators(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_comments_dashboard_id ON public.dashboard_comments(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_comments_user_id ON public.dashboard_comments(user_id);

-- Update timestamp function (safe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp triggers (safe)
DROP TRIGGER IF EXISTS update_dashboards_updated_at ON public.dashboards;
DROP TRIGGER IF EXISTS update_dashboard_comments_updated_at ON public.dashboard_comments;

CREATE TRIGGER update_dashboards_updated_at 
    BEFORE UPDATE ON public.dashboards 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_dashboard_comments_updated_at 
    BEFORE UPDATE ON public.dashboard_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add search vector column if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='dashboards' AND column_name='search_vector') THEN
        ALTER TABLE public.dashboards ADD COLUMN search_vector tsvector;
    END IF;
END $$;

-- Full-text search function
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

-- Search trigger (safe)
DROP TRIGGER IF EXISTS update_dashboards_search_vector ON public.dashboards;
CREATE TRIGGER update_dashboards_search_vector
    BEFORE INSERT OR UPDATE ON public.dashboards
    FOR EACH ROW
    EXECUTE FUNCTION update_dashboard_search_vector();

CREATE INDEX IF NOT EXISTS idx_dashboards_search_vector ON public.dashboards USING gin(search_vector);

-- Optional: Add foreign key constraints later if tables exist
-- You can run these later once other tables are created:
--
-- ALTER TABLE public.dashboards 
-- ADD CONSTRAINT fk_dashboards_project_id 
-- FOREIGN KEY (project_id) REFERENCES public.projects(id);
--
-- ALTER TABLE public.dashboards 
-- ADD CONSTRAINT fk_dashboards_organization_id 
-- FOREIGN KEY (organization_id) REFERENCES public.organizations(id);
--
-- ALTER TABLE public.dashboards 
-- ADD CONSTRAINT fk_dashboards_category_id 
-- FOREIGN KEY (category_id) REFERENCES public.categories(id);