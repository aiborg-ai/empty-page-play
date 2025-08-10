-- =====================================================
-- MIGRATION 4: ENHANCED USER PROJECTS SYSTEM
-- Copy from here to the end of this block and paste into Supabase SQL Editor
-- =====================================================

-- Add additional columns to existing projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'research';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget DECIMAL(10,2);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS collaborators UUID[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS external_links JSONB DEFAULT '[]';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create project assets table
CREATE TABLE IF NOT EXISTS public.project_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'document', 'dataset', 'tool', 'agent', 'patent', 'report'
    description TEXT,
    file_url TEXT,
    file_size BIGINT,
    file_type TEXT,
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    uploaded_by UUID REFERENCES public.users(id) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project activities/timeline table
CREATE TABLE IF NOT EXISTS public.project_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    activity_type TEXT NOT NULL, -- 'created', 'updated', 'comment', 'milestone', 'asset_added', 'status_changed'
    title TEXT NOT NULL,
    description TEXT,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project milestones table
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.users(id) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project collaborators table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.project_collaborators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    permissions JSONB DEFAULT '{"read": true, "write": false, "delete": false}',
    invited_by UUID REFERENCES public.users(id) NOT NULL,
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(project_id, user_id)
);

-- Create project templates table
CREATE TABLE IF NOT EXISTS public.project_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    template_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.users(id) NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_assets_project_id ON public.project_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assets_type ON public.project_assets(type);
CREATE INDEX IF NOT EXISTS idx_project_activities_project_id ON public.project_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activities_user_id ON public.project_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_project_activities_created_at ON public.project_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_project_id ON public.project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_user_id ON public.project_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_status ON public.projects(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_projects_type ON public.projects(project_type);

-- Add triggers for updated_at columns
CREATE TRIGGER update_project_assets_updated_at 
    BEFORE UPDATE ON public.project_assets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at 
    BEFORE UPDATE ON public.project_milestones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_templates_updated_at 
    BEFORE UPDATE ON public.project_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create project activity when project is created
CREATE OR REPLACE FUNCTION create_project_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.project_activities (
        project_id, 
        user_id, 
        activity_type, 
        title, 
        description,
        data
    ) VALUES (
        NEW.id,
        NEW.owner_id,
        'created',
        'Project Created',
        'Project "' || NEW.name || '" was created',
        jsonb_build_object('project_name', NEW.name, 'status', NEW.status)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for project creation activity
CREATE TRIGGER project_created_activity
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION create_project_activity();

-- Function to log project updates
CREATE OR REPLACE FUNCTION log_project_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if significant fields changed
    IF OLD.name != NEW.name OR OLD.status != NEW.status OR OLD.progress != NEW.progress THEN
        INSERT INTO public.project_activities (
            project_id, 
            user_id, 
            activity_type, 
            title, 
            description,
            data
        ) VALUES (
            NEW.id,
            NEW.owner_id,
            'updated',
            'Project Updated',
            CASE 
                WHEN OLD.name != NEW.name THEN 'Project renamed from "' || OLD.name || '" to "' || NEW.name || '"'
                WHEN OLD.status != NEW.status THEN 'Status changed from ' || OLD.status || ' to ' || NEW.status
                WHEN OLD.progress != NEW.progress THEN 'Progress updated to ' || NEW.progress || '%'
                ELSE 'Project updated'
            END,
            jsonb_build_object(
                'old_name', OLD.name,
                'new_name', NEW.name,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'old_progress', OLD.progress,
                'new_progress', NEW.progress
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for project updates
CREATE TRIGGER project_updated_activity
    AFTER UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION log_project_update();

-- =====================================================
-- END OF MIGRATION 4
-- =====================================================