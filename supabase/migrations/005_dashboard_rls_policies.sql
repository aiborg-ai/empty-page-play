-- Row Level Security policies for dashboard tables and enhanced CMS features

-- Enable RLS on new dashboard tables
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_comments ENABLE ROW LEVEL SECURITY;

-- Helper function to check dashboard access based on access_level
CREATE OR REPLACE FUNCTION can_access_dashboard(dashboard_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    dashboard_record RECORD;
BEGIN
    SELECT access_level, owner_id, organization_id, project_id 
    INTO dashboard_record
    FROM public.dashboards 
    WHERE id = dashboard_uuid;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Owner always has access
    IF dashboard_record.owner_id = auth.uid() THEN
        RETURN TRUE;
    END IF;
    
    -- Admin always has access
    IF is_admin() THEN
        RETURN TRUE;
    END IF;
    
    -- Check based on access level
    CASE dashboard_record.access_level
        WHEN 'public' THEN
            RETURN TRUE;
        WHEN 'organization' THEN
            RETURN EXISTS (
                SELECT 1 FROM public.users 
                WHERE id = auth.uid() 
                AND organization = (
                    SELECT name FROM public.organizations 
                    WHERE id = dashboard_record.organization_id
                )
            );
        WHEN 'team' THEN
            RETURN dashboard_record.project_id IS NOT NULL 
            AND is_project_collaborator(dashboard_record.project_id);
        WHEN 'private' THEN
            RETURN EXISTS (
                SELECT 1 FROM public.dashboard_collaborators
                WHERE dashboard_id = dashboard_uuid AND user_id = auth.uid()
            );
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check dashboard edit permissions
CREATE OR REPLACE FUNCTION can_edit_dashboard(dashboard_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    dashboard_record RECORD;
    collaborator_role TEXT;
BEGIN
    SELECT owner_id INTO dashboard_record
    FROM public.dashboards 
    WHERE id = dashboard_uuid;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Owner can edit
    IF dashboard_record.owner_id = auth.uid() THEN
        RETURN TRUE;
    END IF;
    
    -- Admin can edit
    IF is_admin() THEN
        RETURN TRUE;
    END IF;
    
    -- Check collaborator permissions
    SELECT role INTO collaborator_role
    FROM public.dashboard_collaborators
    WHERE dashboard_id = dashboard_uuid AND user_id = auth.uid();
    
    RETURN collaborator_role IN ('owner', 'editor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- DASHBOARDS table policies
CREATE POLICY "Users can view dashboards they have access to" ON public.dashboards
    FOR SELECT USING (can_access_dashboard(id));

CREATE POLICY "Users can create dashboards" ON public.dashboards
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update dashboards they can edit" ON public.dashboards
    FOR UPDATE USING (can_edit_dashboard(id));

CREATE POLICY "Owners and admins can delete dashboards" ON public.dashboards
    FOR DELETE USING (owner_id = auth.uid() OR is_admin());

-- DASHBOARD_COLLABORATORS table policies
CREATE POLICY "Users can view collaborators of accessible dashboards" ON public.dashboard_collaborators
    FOR SELECT USING (can_access_dashboard(dashboard_id));

CREATE POLICY "Dashboard owners can manage collaborators" ON public.dashboard_collaborators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.dashboards 
            WHERE id = dashboard_id AND owner_id = auth.uid()
        ) OR is_admin()
    );

-- DASHBOARD_COMMENTS table policies
CREATE POLICY "Users can view comments on accessible dashboards" ON public.dashboard_comments
    FOR SELECT USING (can_access_dashboard(dashboard_id));

CREATE POLICY "Users can add comments to accessible dashboards" ON public.dashboard_comments
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        can_access_dashboard(dashboard_id)
    );

CREATE POLICY "Users can update their own comments" ON public.dashboard_comments
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON public.dashboard_comments
    FOR DELETE USING (
        user_id = auth.uid() OR 
        can_edit_dashboard(dashboard_id) OR 
        is_admin()
    );

-- Enhanced policies for AI Agents (public access)
CREATE POLICY "Users can view public AI agents" ON public.ai_agents
    FOR SELECT USING (is_public = true OR owner_id = auth.uid() OR is_admin());

-- Enhanced policies for Tools (public access)  
CREATE POLICY "Users can view public tools" ON public.tools
    FOR SELECT USING (is_public = true OR owner_id = auth.uid() OR is_admin());

-- Enhanced policies for Reports (access level based)
CREATE POLICY "Users can view reports based on access level" ON public.reports
    FOR SELECT USING (
        author_id = auth.uid() OR
        is_admin() OR
        (access_level = 'public') OR
        (access_level = 'team' AND project_id IS NOT NULL AND is_project_collaborator(project_id)) OR
        (access_level = 'organization' AND EXISTS (
            SELECT 1 FROM public.users u1, public.users u2, public.projects p
            WHERE u1.id = auth.uid() 
            AND u2.id = author_id 
            AND p.id = project_id
            AND u1.organization = u2.organization
        ))
    );

-- Enhanced policies for Datasets (access level based)
CREATE POLICY "Users can view datasets based on access level" ON public.datasets
    FOR SELECT USING (
        owner_id = auth.uid() OR
        is_admin() OR
        (access_level = 'public') OR
        (access_level = 'team' AND project_id IS NOT NULL AND is_project_collaborator(project_id)) OR
        (access_level = 'organization' AND EXISTS (
            SELECT 1 FROM public.users u1, public.users u2, public.projects p
            WHERE u1.id = auth.uid() 
            AND u2.id = owner_id 
            AND p.id = project_id
            AND u1.organization = u2.organization
        ))
    );

-- Activity logging for dashboard actions
CREATE OR REPLACE FUNCTION log_dashboard_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.activities (
        user_id,
        action,
        resource_type,
        resource_id,
        project_id,
        details
    ) VALUES (
        auth.uid(),
        CASE TG_OP
            WHEN 'INSERT' THEN 'create'
            WHEN 'UPDATE' THEN 'update'
            WHEN 'DELETE' THEN 'delete'
        END,
        'dashboard',
        COALESCE(NEW.id, OLD.id),
        COALESCE(NEW.project_id, OLD.project_id),
        jsonb_build_object(
            'dashboard_name', COALESCE(NEW.name, OLD.name),
            'operation', TG_OP
        )
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_dashboard_activity_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.dashboards
    FOR EACH ROW EXECUTE FUNCTION log_dashboard_activity();

-- Usage tracking function for dashboards
CREATE OR REPLACE FUNCTION track_dashboard_view()
RETURNS TRIGGER AS $$
BEGIN
    -- Update view count and last viewed timestamp
    UPDATE public.dashboards 
    SET 
        view_count = view_count + 1,
        last_viewed_at = NOW()
    WHERE id = NEW.resource_id 
    AND NEW.action = 'view' 
    AND NEW.resource_type = 'dashboard';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER track_dashboard_view_trigger
    AFTER INSERT ON public.activities
    FOR EACH ROW EXECUTE FUNCTION track_dashboard_view();