-- Projects and Spaces Management
-- Migration: 021_projects_and_spaces.sql

-- Projects (Spaces) table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(100) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  visibility VARCHAR(50) DEFAULT 'private', -- private, organization, public
  status VARCHAR(50) DEFAULT 'active', -- active, archived, deleted
  settings JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  asset_count INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 1,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT projects_visibility_check 
    CHECK (visibility IN ('private', 'organization', 'public')),
  CONSTRAINT projects_status_check 
    CHECK (status IN ('active', 'archived', 'deleted')),
  CONSTRAINT projects_unique_org_slug 
    UNIQUE(organization_id, slug)
);

-- Project members table
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- owner, admin, editor, member, viewer
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT project_members_role_check 
    CHECK (role IN ('owner', 'admin', 'editor', 'member', 'viewer')),
  CONSTRAINT project_members_unique_user 
    UNIQUE(project_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_role ON project_members(role);

-- Function to automatically add project owner as member
CREATE OR REPLACE FUNCTION public.add_project_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.project_members (project_id, user_id, role, joined_at)
  VALUES (NEW.id, NEW.owner_id, 'owner', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to add owner as member
CREATE OR REPLACE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION add_project_owner_as_member();

-- Function to update project member count
CREATE OR REPLACE FUNCTION public.update_project_member_count()
RETURNS TRIGGER AS $$
DECLARE
  project_uuid UUID;
BEGIN
  project_uuid := COALESCE(NEW.project_id, OLD.project_id);
  
  UPDATE projects 
  SET member_count = (
    SELECT COUNT(*) 
    FROM project_members 
    WHERE project_id = project_uuid
  )
  WHERE id = project_uuid;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain member count
CREATE TRIGGER update_project_member_count_trigger
  AFTER INSERT OR DELETE ON project_members
  FOR EACH ROW EXECUTE FUNCTION update_project_member_count();

-- Apply updated_at trigger
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();