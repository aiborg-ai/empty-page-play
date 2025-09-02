-- =====================================================
-- MIGRATION 5: ROW LEVEL SECURITY FOR PROJECT SYSTEM
-- Copy from here to the end of this block and paste into Supabase SQL Editor
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is project collaborator
CREATE OR REPLACE FUNCTION is_project_collaborator(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.project_collaborators 
        WHERE project_id = project_uuid 
        AND user_id = auth.uid() 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user can edit project
CREATE OR REPLACE FUNCTION can_edit_project(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.projects p
        LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id AND pc.user_id = auth.uid()
        WHERE p.id = project_uuid 
        AND (
            p.owner_id = auth.uid() 
            OR (pc.is_active = true AND pc.role IN ('admin', 'editor'))
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for project_assets
CREATE POLICY "Users can view assets of projects they have access to" ON public.project_assets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id AND pc.user_id = auth.uid()
            WHERE p.id = project_id 
            AND (p.owner_id = auth.uid() OR p.is_public = true OR (pc.is_active = true))
        )
    );

CREATE POLICY "Users can add assets to projects they can edit" ON public.project_assets
    FOR INSERT WITH CHECK (can_edit_project(project_id));

CREATE POLICY "Users can update assets of projects they can edit" ON public.project_assets
    FOR UPDATE USING (can_edit_project(project_id));

CREATE POLICY "Users can delete assets of projects they own or admin" ON public.project_assets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id AND pc.user_id = auth.uid()
            WHERE p.id = project_id 
            AND (p.owner_id = auth.uid() OR (pc.is_active = true AND pc.role IN ('owner', 'admin')))
        )
    );

-- RLS Policies for project_activities
CREATE POLICY "Users can view activities of accessible projects" ON public.project_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id AND pc.user_id = auth.uid()
            WHERE p.id = project_id 
            AND (p.owner_id = auth.uid() OR p.is_public = true OR (pc.is_active = true))
        )
    );

CREATE POLICY "Users can create activities for projects they have access to" ON public.project_activities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id AND pc.user_id = auth.uid()
            WHERE p.id = project_id 
            AND (p.owner_id = auth.uid() OR (pc.is_active = true))
        )
    );

-- RLS Policies for project_milestones
CREATE POLICY "Users can view milestones of accessible projects" ON public.project_milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id AND pc.user_id = auth.uid()
            WHERE p.id = project_id 
            AND (p.owner_id = auth.uid() OR p.is_public = true OR (pc.is_active = true))
        )
    );

CREATE POLICY "Users can manage milestones of projects they can edit" ON public.project_milestones
    FOR ALL USING (can_edit_project(project_id))
    WITH CHECK (can_edit_project(project_id));

-- RLS Policies for project_collaborators
CREATE POLICY "Users can view collaborators of their projects" ON public.project_collaborators
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND owner_id = auth.uid()
        ) OR
        is_project_collaborator(project_id)
    );

CREATE POLICY "Project owners can manage collaborators" ON public.project_collaborators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND owner_id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND owner_id = auth.uid()
        )
    );

-- RLS Policies for project_templates
CREATE POLICY "Anyone can view public templates" ON public.project_templates
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create their own templates" ON public.project_templates
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates" ON public.project_templates
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own templates" ON public.project_templates
    FOR DELETE USING (auth.uid() = created_by);

-- Update existing project policies to be more comprehensive
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view public projects" ON public.projects;

CREATE POLICY "Users can view accessible projects" ON public.projects
    FOR SELECT USING (
        owner_id = auth.uid() 
        OR is_public = true 
        OR is_project_collaborator(id)
    );

CREATE POLICY "Users can update their own projects or projects they admin" ON public.projects
    FOR UPDATE USING (
        owner_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.project_collaborators 
            WHERE project_id = id 
            AND user_id = auth.uid() 
            AND role IN ('admin')
            AND is_active = true
        )
    );

CREATE POLICY "Project owners can delete their projects" ON public.projects
    FOR DELETE USING (owner_id = auth.uid());

-- =====================================================
-- END OF MIGRATION 5
-- =====================================================