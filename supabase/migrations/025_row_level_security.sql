-- Row Level Security (RLS) Policies
-- Migration: 025_row_level_security.sql

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_reviews ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'org_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user's organization
CREATE OR REPLACE FUNCTION public.get_user_organization()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check project membership
CREATE OR REPLACE FUNCTION public.is_project_member(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_uuid
    AND (
      p.owner_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM project_members pm
        WHERE pm.project_id = project_uuid
        AND pm.user_id = auth.uid()
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check project permissions
CREATE OR REPLACE FUNCTION public.has_project_permission(
  project_uuid UUID, 
  required_role TEXT DEFAULT 'viewer'
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  role_hierarchy INTEGER;
  required_hierarchy INTEGER;
BEGIN
  -- Define role hierarchy (higher number = more permissions)
  role_hierarchy := CASE 
    WHEN required_role = 'owner' THEN 5
    WHEN required_role = 'admin' THEN 4
    WHEN required_role = 'editor' THEN 3
    WHEN required_role = 'member' THEN 2
    WHEN required_role = 'viewer' THEN 1
    ELSE 0
  END;

  -- Check if user is project owner
  IF EXISTS (
    SELECT 1 FROM projects 
    WHERE id = project_uuid AND owner_id = auth.uid()
  ) THEN
    RETURN TRUE;
  END IF;

  -- Get user's role in project
  SELECT pm.role INTO user_role
  FROM project_members pm
  WHERE pm.project_id = project_uuid
  AND pm.user_id = auth.uid();

  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check role hierarchy
  required_hierarchy := CASE 
    WHEN user_role = 'owner' THEN 5
    WHEN user_role = 'admin' THEN 4
    WHEN user_role = 'editor' THEN 3
    WHEN user_role = 'member' THEN 2
    WHEN user_role = 'viewer' THEN 1
    ELSE 0
  END;

  RETURN required_hierarchy >= role_hierarchy;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USER MANAGEMENT POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "users_own_profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own_profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users in their organization
CREATE POLICY "admins_view_org_users" ON users
  FOR SELECT USING (
    is_admin() AND 
    organization_id = get_user_organization()
  );

-- Organization members can view other members (limited fields)
CREATE POLICY "org_members_view_members" ON users
  FOR SELECT USING (
    organization_id = get_user_organization() AND
    organization_id IS NOT NULL
  );

-- ============================================================================
-- ORGANIZATION POLICIES
-- ============================================================================

-- Organization members can view their organization
CREATE POLICY "org_members_view_org" ON organizations
  FOR SELECT USING (
    id = get_user_organization()
  );

-- Org admins can update their organization
CREATE POLICY "org_admins_update_org" ON organizations
  FOR UPDATE USING (
    id = get_user_organization() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'org_admin'
    )
  );

-- ============================================================================
-- PROJECT POLICIES
-- ============================================================================

-- Users can view projects they own or are members of
CREATE POLICY "project_member_access" ON projects
  FOR SELECT USING (
    owner_id = auth.uid() OR
    id IN (
      SELECT pm.project_id 
      FROM project_members pm
      WHERE pm.user_id = auth.uid()
    ) OR
    (visibility = 'organization' AND organization_id = get_user_organization()) OR
    visibility = 'public'
  );

-- Users can create projects
CREATE POLICY "users_create_projects" ON projects
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Project owners and admins can update projects
CREATE POLICY "project_owners_update" ON projects
  FOR UPDATE USING (
    owner_id = auth.uid() OR
    has_project_permission(id, 'admin')
  );

-- Project owners can delete projects
CREATE POLICY "project_owners_delete" ON projects
  FOR DELETE USING (owner_id = auth.uid());

-- ============================================================================
-- PROJECT MEMBER POLICIES
-- ============================================================================

-- Project members can view other members
CREATE POLICY "project_members_view_members" ON project_members
  FOR SELECT USING (is_project_member(project_id));

-- Project owners and admins can manage members
CREATE POLICY "project_admins_manage_members" ON project_members
  FOR ALL USING (
    has_project_permission(project_id, 'admin')
  );

-- Users can leave projects (delete their own membership)
CREATE POLICY "users_leave_projects" ON project_members
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- ASSET POLICIES (Dashboards, AI Agents, Tools, etc.)
-- ============================================================================

-- Generic asset access policy template
-- Users can view assets they own, in projects they're members of, or public assets

-- Dashboards
CREATE POLICY "dashboard_access" ON dashboards
  FOR SELECT USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND is_project_member(project_id)) OR
    (access_level = 'organization' AND 
     project_id IN (
       SELECT id FROM projects 
       WHERE organization_id = get_user_organization()
     )) OR
    access_level = 'public'
  );

CREATE POLICY "dashboard_modify" ON dashboards
  FOR ALL USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND has_project_permission(project_id, 'editor'))
  );

-- AI Agents
CREATE POLICY "ai_agent_access" ON ai_agents
  FOR SELECT USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND is_project_member(project_id)) OR
    (access_level = 'organization' AND 
     project_id IN (
       SELECT id FROM projects 
       WHERE organization_id = get_user_organization()
     )) OR
    access_level = 'public'
  );

CREATE POLICY "ai_agent_modify" ON ai_agents
  FOR ALL USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND has_project_permission(project_id, 'editor'))
  );

-- Tools
CREATE POLICY "tool_access" ON tools
  FOR SELECT USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND is_project_member(project_id)) OR
    (access_level = 'organization' AND 
     project_id IN (
       SELECT id FROM projects 
       WHERE organization_id = get_user_organization()
     )) OR
    access_level = 'public'
  );

CREATE POLICY "tool_modify" ON tools
  FOR ALL USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND has_project_permission(project_id, 'editor'))
  );

-- Datasets
CREATE POLICY "dataset_access" ON datasets
  FOR SELECT USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND is_project_member(project_id)) OR
    (access_level = 'organization' AND 
     project_id IN (
       SELECT id FROM projects 
       WHERE organization_id = get_user_organization()
     )) OR
    access_level = 'public'
  );

CREATE POLICY "dataset_modify" ON datasets
  FOR ALL USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND has_project_permission(project_id, 'editor'))
  );

-- Reports
CREATE POLICY "report_access" ON reports
  FOR SELECT USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND is_project_member(project_id)) OR
    (access_level = 'organization' AND 
     project_id IN (
       SELECT id FROM projects 
       WHERE organization_id = get_user_organization()
     )) OR
    access_level = 'public'
  );

CREATE POLICY "report_modify" ON reports
  FOR ALL USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND has_project_permission(project_id, 'editor'))
  );

-- MCP Integrations
CREATE POLICY "mcp_integration_access" ON mcp_integrations
  FOR SELECT USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND is_project_member(project_id))
  );

CREATE POLICY "mcp_integration_modify" ON mcp_integrations
  FOR ALL USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND has_project_permission(project_id, 'admin'))
  );

-- ============================================================================
-- KNOWLEDGE BASE POLICIES
-- ============================================================================

-- Knowledge base access
CREATE POLICY "knowledge_base_access" ON knowledge_bases
  FOR SELECT USING (
    owner_id = auth.uid() OR
    (access_level = 'organization' AND organization_id = get_user_organization()) OR
    access_level = 'public'
  );

CREATE POLICY "knowledge_base_modify" ON knowledge_bases
  FOR ALL USING (
    owner_id = auth.uid() OR
    (organization_id = get_user_organization() AND is_admin())
  );

-- Document access (inherits from knowledge base)
CREATE POLICY "document_access" ON documents
  FOR SELECT USING (
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases
      WHERE owner_id = auth.uid() OR
      (access_level = 'organization' AND organization_id = get_user_organization()) OR
      access_level = 'public'
    )
  );

CREATE POLICY "document_modify" ON documents
  FOR ALL USING (
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases
      WHERE owner_id = auth.uid() OR
      (organization_id = get_user_organization() AND is_admin())
    )
  );

-- ============================================================================
-- FILE POLICIES
-- ============================================================================

-- File access
CREATE POLICY "file_access" ON files
  FOR SELECT USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND is_project_member(project_id)) OR
    (access_level = 'organization' AND 
     project_id IN (
       SELECT id FROM projects 
       WHERE organization_id = get_user_organization()
     )) OR
    access_level = 'public'
  );

CREATE POLICY "file_modify" ON files
  FOR ALL USING (
    owner_id = auth.uid() OR
    (project_id IS NOT NULL AND has_project_permission(project_id, 'editor'))
  );

-- ============================================================================
-- CAPABILITY MARKETPLACE POLICIES
-- ============================================================================

-- Anyone can view published capabilities
CREATE POLICY "capability_public_view" ON capabilities
  FOR SELECT USING (
    status = 'published' AND approval_status = 'approved'
  );

-- Providers can view/modify their own capabilities
CREATE POLICY "capability_provider_access" ON capabilities
  FOR ALL USING (provider_id = auth.uid());

-- Org admins can view org capabilities
CREATE POLICY "capability_org_access" ON capabilities
  FOR SELECT USING (
    organization_id = get_user_organization() AND is_admin()
  );

-- Capability downloads - users can view their own downloads
CREATE POLICY "capability_download_own" ON capability_downloads
  FOR ALL USING (user_id = auth.uid());

-- Capability reviews - users can manage their own reviews
CREATE POLICY "capability_review_own" ON capability_reviews
  FOR ALL USING (user_id = auth.uid());

-- Anyone can view published reviews
CREATE POLICY "capability_review_public" ON capability_reviews
  FOR SELECT USING (status = 'published');

-- ============================================================================
-- SESSION POLICIES
-- ============================================================================

-- Users can only access their own sessions
CREATE POLICY "user_session_own" ON user_sessions
  FOR ALL USING (user_id = auth.uid());

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant read access to anonymous users for public content
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON capabilities TO anon;
GRANT SELECT ON capability_reviews TO anon;