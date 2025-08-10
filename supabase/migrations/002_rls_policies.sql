-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is project collaborator
CREATE OR REPLACE FUNCTION is_project_collaborator(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.project_collaborators 
        WHERE project_id = project_uuid AND user_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.projects 
        WHERE id = project_uuid AND owner_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user owns resource
CREATE OR REPLACE FUNCTION owns_resource(owner_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN owner_uuid = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USERS table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (is_admin());

-- ORGANIZATIONS table policies
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
    FOR SELECT USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admins and editors can create organizations" ON public.organizations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Organization owners can update their organizations" ON public.organizations
    FOR UPDATE USING (created_by = auth.uid() OR is_admin());

-- PROJECTS table policies
CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view projects they collaborate on" ON public.projects
    FOR SELECT USING (is_project_collaborator(id));

CREATE POLICY "Users can view public projects" ON public.projects
    FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can view all projects" ON public.projects
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Project owners can update their projects" ON public.projects
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Admins can update all projects" ON public.projects
    FOR UPDATE USING (is_admin());

CREATE POLICY "Project owners can delete their projects" ON public.projects
    FOR DELETE USING (owner_id = auth.uid() OR is_admin());

-- PROJECT_COLLABORATORS table policies
CREATE POLICY "Users can view collaborators of their projects" ON public.project_collaborators
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND owner_id = auth.uid()
        ) OR
        is_admin()
    );

CREATE POLICY "Project owners can manage collaborators" ON public.project_collaborators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND owner_id = auth.uid()
        ) OR is_admin()
    );

-- CATEGORIES table policies (global categories, managed by admins/editors)
CREATE POLICY "Anyone can view active categories" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins and editors can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- CONTENT_TYPES table policies
CREATE POLICY "Anyone can view active content types" ON public.content_types
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins and editors can manage content types" ON public.content_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- CONTENTS table policies
CREATE POLICY "Users can view published contents" ON public.contents
    FOR SELECT USING (status = 'published' OR author_id = auth.uid());

CREATE POLICY "Users can view contents from their projects" ON public.contents
    FOR SELECT USING (
        project_id IS NULL OR 
        is_project_collaborator(project_id) OR
        is_admin()
    );

CREATE POLICY "Users can create contents" ON public.contents
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        (project_id IS NULL OR is_project_collaborator(project_id))
    );

CREATE POLICY "Authors can update their contents" ON public.contents
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Admins can update all contents" ON public.contents
    FOR UPDATE USING (is_admin());

CREATE POLICY "Authors can delete their contents" ON public.contents
    FOR DELETE USING (author_id = auth.uid() OR is_admin());

-- AI_AGENTS table policies
CREATE POLICY "Users can view their own AI agents" ON public.ai_agents
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view AI agents from their projects" ON public.ai_agents
    FOR SELECT USING (
        project_id IS NULL OR 
        is_project_collaborator(project_id)
    );

CREATE POLICY "Admins can view all AI agents" ON public.ai_agents
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can create AI agents" ON public.ai_agents
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        (project_id IS NULL OR is_project_collaborator(project_id))
    );

CREATE POLICY "Owners can update their AI agents" ON public.ai_agents
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their AI agents" ON public.ai_agents
    FOR DELETE USING (owner_id = auth.uid() OR is_admin());

-- TOOLS table policies
CREATE POLICY "Users can view their own tools" ON public.tools
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view tools from their projects" ON public.tools
    FOR SELECT USING (
        project_id IS NULL OR 
        is_project_collaborator(project_id)
    );

CREATE POLICY "Admins can view all tools" ON public.tools
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can create tools" ON public.tools
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        (project_id IS NULL OR is_project_collaborator(project_id))
    );

CREATE POLICY "Owners can update their tools" ON public.tools
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their tools" ON public.tools
    FOR DELETE USING (owner_id = auth.uid() OR is_admin());

-- DATASETS table policies
CREATE POLICY "Users can view their own datasets" ON public.datasets
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view public datasets" ON public.datasets
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view datasets from their projects" ON public.datasets
    FOR SELECT USING (
        project_id IS NULL OR 
        is_project_collaborator(project_id)
    );

CREATE POLICY "Admins can view all datasets" ON public.datasets
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can create datasets" ON public.datasets
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        (project_id IS NULL OR is_project_collaborator(project_id))
    );

CREATE POLICY "Owners can update their datasets" ON public.datasets
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their datasets" ON public.datasets
    FOR DELETE USING (owner_id = auth.uid() OR is_admin());

-- REPORTS table policies
CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Users can view published reports" ON public.reports
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view reports from their projects" ON public.reports
    FOR SELECT USING (
        project_id IS NULL OR 
        is_project_collaborator(project_id)
    );

CREATE POLICY "Admins can view all reports" ON public.reports
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        (project_id IS NULL OR is_project_collaborator(project_id))
    );

CREATE POLICY "Authors can update their reports" ON public.reports
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their reports" ON public.reports
    FOR DELETE USING (author_id = auth.uid() OR is_admin());

-- FILES table policies
CREATE POLICY "Users can view their own files" ON public.files
    FOR SELECT USING (uploaded_by = auth.uid());

CREATE POLICY "Users can view public files" ON public.files
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view files from their projects" ON public.files
    FOR SELECT USING (
        project_id IS NULL OR 
        is_project_collaborator(project_id)
    );

CREATE POLICY "Admins can view all files" ON public.files
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can upload files" ON public.files
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        (project_id IS NULL OR is_project_collaborator(project_id))
    );

CREATE POLICY "Uploaders can delete their files" ON public.files
    FOR DELETE USING (uploaded_by = auth.uid() OR is_admin());

-- ACTIVITIES table policies
CREATE POLICY "Users can view their own activities" ON public.activities
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activities" ON public.activities
    FOR SELECT USING (is_admin());

CREATE POLICY "System can insert activities" ON public.activities
    FOR INSERT WITH CHECK (true); -- Activities are inserted by system/triggers