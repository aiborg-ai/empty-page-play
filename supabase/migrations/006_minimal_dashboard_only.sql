-- Minimal Dashboard Enhancement (No Dependencies)
-- Use this if you don't want the full CMS system and just need dashboards

-- Create dashboard enums
CREATE TYPE IF NOT EXISTS dashboard_status AS ENUM ('draft', 'published', 'archived', 'template');
CREATE TYPE IF NOT EXISTS dashboard_type AS ENUM ('analytics', 'reporting', 'monitoring', 'kpi', 'custom');
CREATE TYPE IF NOT EXISTS access_level AS ENUM ('private', 'team', 'organization', 'public');

-- Simple dashboards table (no foreign key dependencies except auth.users)
CREATE TABLE IF NOT EXISTS public.dashboards (
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
    
    -- Permissions and sharing
    permissions JSONB DEFAULT '{}',
    share_settings JSONB DEFAULT '{}',
    embed_settings JSONB DEFAULT '{}',
    
    -- Ownership (using auth.users directly - works with existing Supabase auth)
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

-- Dashboard collaborators (simplified - no complex project dependencies)
CREATE TABLE IF NOT EXISTS public.dashboard_collaborators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'viewer', -- owner, editor, viewer, commenter
    permissions JSONB DEFAULT '{}',
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

-- Helper function to check dashboard access
CREATE OR REPLACE FUNCTION can_access_dashboard_simple(dashboard_uuid UUID)
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
            RETURN FALSE; -- team/organization access not implemented in minimal version
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- DASHBOARDS table policies
CREATE POLICY "Users can view dashboards they have access to" ON public.dashboards
    FOR SELECT USING (can_access_dashboard_simple(id));

CREATE POLICY "Users can create dashboards" ON public.dashboards
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own dashboards" ON public.dashboards
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own dashboards" ON public.dashboards
    FOR DELETE USING (owner_id = auth.uid());

-- DASHBOARD_COLLABORATORS table policies
CREATE POLICY "Users can view collaborators of accessible dashboards" ON public.dashboard_collaborators
    FOR SELECT USING (can_access_dashboard_simple(dashboard_id));

CREATE POLICY "Dashboard owners can manage collaborators" ON public.dashboard_collaborators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.dashboards 
            WHERE id = dashboard_id AND owner_id = auth.uid()
        )
    );

-- DASHBOARD_COMMENTS table policies
CREATE POLICY "Users can view comments on accessible dashboards" ON public.dashboard_comments
    FOR SELECT USING (can_access_dashboard_simple(dashboard_id));

CREATE POLICY "Users can add comments to accessible dashboards" ON public.dashboard_comments
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        can_access_dashboard_simple(dashboard_id)
    );

CREATE POLICY "Users can update their own comments" ON public.dashboard_comments
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON public.dashboard_comments
    FOR DELETE USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.dashboards 
            WHERE id = dashboard_id AND owner_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dashboards_owner_id ON public.dashboards(owner_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_status ON public.dashboards(status);
CREATE INDEX IF NOT EXISTS idx_dashboards_type ON public.dashboards(type);
CREATE INDEX IF NOT EXISTS idx_dashboards_access_level ON public.dashboards(access_level);
CREATE INDEX IF NOT EXISTS idx_dashboards_tags ON public.dashboards USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_dashboard_collaborators_user_id ON public.dashboard_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_comments_dashboard_id ON public.dashboard_comments(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_comments_user_id ON public.dashboard_comments(user_id);

-- Update timestamp triggers
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
    
CREATE TRIGGER update_dashboard_comments_updated_at 
    BEFORE UPDATE ON public.dashboard_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();