-- Studio Asset Management
-- Migration: 023_studio_assets.sql

-- Dashboards table
CREATE TABLE IF NOT EXISTS public.dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'custom', -- custom, ai_generated, template
  layout JSONB NOT NULL DEFAULT '{}', -- dashboard configuration
  widgets JSONB NOT NULL DEFAULT '[]', -- widget configurations
  data_sources JSONB DEFAULT '{}', -- connected data sources
  access_level VARCHAR(50) DEFAULT 'private', -- private, organization, public
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
  settings JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  template_id UUID, -- will reference dashboard_templates later
  metrics JSONB DEFAULT '{"views": 0, "shares": 0, "forks": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT dashboards_type_check 
    CHECK (type IN ('custom', 'ai_generated', 'template')),
  CONSTRAINT dashboards_access_level_check 
    CHECK (access_level IN ('private', 'organization', 'public')),
  CONSTRAINT dashboards_status_check 
    CHECK (status IN ('draft', 'published', 'archived'))
);

-- AI Agents table
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_type VARCHAR(100) NOT NULL, -- patent_analyzer, claim_generator, prior_art_searcher
  configuration JSONB NOT NULL DEFAULT '{}', -- agent-specific config
  model_settings JSONB DEFAULT '{}', -- AI model configuration
  prompt_templates JSONB DEFAULT '{}', -- custom prompts
  knowledge_base_id UUID REFERENCES knowledge_bases(id) ON DELETE SET NULL,
  access_level VARCHAR(50) DEFAULT 'private',
  status VARCHAR(50) DEFAULT 'active', -- active, training, paused, archived
  performance_metrics JSONB DEFAULT '{}',
  usage_stats JSONB DEFAULT '{"runs": 0, "success_rate": 0}',
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT ai_agents_access_level_check 
    CHECK (access_level IN ('private', 'organization', 'public')),
  CONSTRAINT ai_agents_status_check 
    CHECK (status IN ('active', 'training', 'paused', 'archived'))
);

-- Tools table
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_type VARCHAR(100) NOT NULL, -- api_connector, data_processor, analyzer
  configuration JSONB NOT NULL DEFAULT '{}',
  input_schema JSONB DEFAULT '{}',
  output_schema JSONB DEFAULT '{}',
  code_content TEXT, -- for custom tools
  runtime_environment VARCHAR(50) DEFAULT 'nodejs', -- nodejs, python, rust
  dependencies JSONB DEFAULT '[]',
  access_level VARCHAR(50) DEFAULT 'private',
  status VARCHAR(50) DEFAULT 'active',
  metrics JSONB DEFAULT '{"runs": 0, "avg_runtime": 0, "error_rate": 0}',
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT tools_runtime_environment_check 
    CHECK (runtime_environment IN ('nodejs', 'python', 'rust', 'go', 'java')),
  CONSTRAINT tools_access_level_check 
    CHECK (access_level IN ('private', 'organization', 'public')),
  CONSTRAINT tools_status_check 
    CHECK (status IN ('active', 'inactive', 'error', 'archived'))
);

-- Datasets table
CREATE TABLE IF NOT EXISTS public.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dataset_type VARCHAR(100) NOT NULL, -- patent_data, market_data, legal_data
  source_type VARCHAR(50) NOT NULL, -- upload, api, crawled, generated
  file_paths TEXT[], -- paths to stored files
  schema_definition JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  size_bytes BIGINT DEFAULT 0,
  record_count INTEGER DEFAULT 0,
  access_level VARCHAR(50) DEFAULT 'private',
  status VARCHAR(50) DEFAULT 'processing', -- processing, ready, error, archived
  quality_score DECIMAL(3,2), -- 0.00 to 1.00
  last_updated_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT datasets_dataset_type_check 
    CHECK (dataset_type IN ('patent_data', 'market_data', 'legal_data', 'research_data', 'financial_data')),
  CONSTRAINT datasets_source_type_check 
    CHECK (source_type IN ('upload', 'api', 'crawled', 'generated')),
  CONSTRAINT datasets_access_level_check 
    CHECK (access_level IN ('private', 'organization', 'public')),
  CONSTRAINT datasets_status_check 
    CHECK (status IN ('processing', 'ready', 'error', 'archived')),
  CONSTRAINT datasets_quality_score_check 
    CHECK (quality_score IS NULL OR (quality_score >= 0.00 AND quality_score <= 1.00))
);

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type VARCHAR(100) NOT NULL, -- patent_landscape, portfolio_analysis, freedom_to_operate
  template_id UUID, -- will reference report_templates later
  content JSONB NOT NULL DEFAULT '{}', -- report content and structure
  data_sources UUID[] DEFAULT '{}', -- references to datasets/dashboards
  generation_config JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft', -- draft, generating, completed, published
  format_types VARCHAR(50)[] DEFAULT '{"pdf"}', -- pdf, docx, html, json
  file_paths JSONB DEFAULT '{}', -- generated file paths
  access_level VARCHAR(50) DEFAULT 'private',
  metrics JSONB DEFAULT '{"views": 0, "downloads": 0, "shares": 0}',
  tags TEXT[] DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT reports_report_type_check 
    CHECK (report_type IN ('patent_landscape', 'portfolio_analysis', 'freedom_to_operate', 'market_analysis', 'competitive_intelligence')),
  CONSTRAINT reports_status_check 
    CHECK (status IN ('draft', 'generating', 'completed', 'published', 'archived')),
  CONSTRAINT reports_access_level_check 
    CHECK (access_level IN ('private', 'organization', 'public'))
);

-- MCP Integrations table
CREATE TABLE IF NOT EXISTS public.mcp_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mcp_type VARCHAR(100) NOT NULL, -- server, client, bridge
  endpoint_url TEXT NOT NULL,
  authentication JSONB DEFAULT '{}', -- encrypted auth details
  capabilities JSONB DEFAULT '[]', -- supported MCP capabilities
  configuration JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'inactive', -- active, inactive, error, testing
  health_status JSONB DEFAULT '{}', -- connection health metrics
  usage_metrics JSONB DEFAULT '{}',
  last_ping_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT mcp_integrations_mcp_type_check 
    CHECK (mcp_type IN ('server', 'client', 'bridge')),
  CONSTRAINT mcp_integrations_status_check 
    CHECK (status IN ('active', 'inactive', 'error', 'testing', 'maintenance'))
);

-- Create indexes for all asset tables
CREATE INDEX IF NOT EXISTS idx_dashboards_project ON dashboards(project_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_owner ON dashboards(owner_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_status ON dashboards(status);
CREATE INDEX IF NOT EXISTS idx_dashboards_access ON dashboards(access_level);
CREATE INDEX IF NOT EXISTS idx_dashboards_type ON dashboards(type);

CREATE INDEX IF NOT EXISTS idx_ai_agents_project ON ai_agents(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_owner ON ai_agents(owner_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_type ON ai_agents(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_agents_status ON ai_agents(status);
CREATE INDEX IF NOT EXISTS idx_ai_agents_kb ON ai_agents(knowledge_base_id);

CREATE INDEX IF NOT EXISTS idx_tools_project ON tools(project_id);
CREATE INDEX IF NOT EXISTS idx_tools_owner ON tools(owner_id);
CREATE INDEX IF NOT EXISTS idx_tools_type ON tools(tool_type);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_runtime ON tools(runtime_environment);

CREATE INDEX IF NOT EXISTS idx_datasets_project ON datasets(project_id);
CREATE INDEX IF NOT EXISTS idx_datasets_owner ON datasets(owner_id);
CREATE INDEX IF NOT EXISTS idx_datasets_type ON datasets(dataset_type);
CREATE INDEX IF NOT EXISTS idx_datasets_status ON datasets(status);
CREATE INDEX IF NOT EXISTS idx_datasets_source ON datasets(source_type);

CREATE INDEX IF NOT EXISTS idx_reports_project ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_owner ON reports(owner_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

CREATE INDEX IF NOT EXISTS idx_mcp_integrations_project ON mcp_integrations(project_id);
CREATE INDEX IF NOT EXISTS idx_mcp_integrations_owner ON mcp_integrations(owner_id);
CREATE INDEX IF NOT EXISTS idx_mcp_integrations_type ON mcp_integrations(mcp_type);
CREATE INDEX IF NOT EXISTS idx_mcp_integrations_status ON mcp_integrations(status);

-- Function to update project asset count
CREATE OR REPLACE FUNCTION public.update_project_asset_count()
RETURNS TRIGGER AS $$
DECLARE
  project_uuid UUID;
BEGIN
  project_uuid := COALESCE(NEW.project_id, OLD.project_id);
  
  IF project_uuid IS NOT NULL THEN
    UPDATE projects 
    SET 
      asset_count = (
        SELECT COUNT(*) FROM (
          SELECT project_id FROM dashboards WHERE project_id = project_uuid
          UNION ALL
          SELECT project_id FROM ai_agents WHERE project_id = project_uuid
          UNION ALL
          SELECT project_id FROM tools WHERE project_id = project_uuid
          UNION ALL
          SELECT project_id FROM datasets WHERE project_id = project_uuid
          UNION ALL
          SELECT project_id FROM reports WHERE project_id = project_uuid
          UNION ALL
          SELECT project_id FROM mcp_integrations WHERE project_id = project_uuid
        ) AS all_assets
      ),
      last_activity_at = NOW()
    WHERE id = project_uuid;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers to maintain project asset counts
CREATE TRIGGER update_project_asset_count_dashboards
  AFTER INSERT OR DELETE ON dashboards
  FOR EACH ROW EXECUTE FUNCTION update_project_asset_count();

CREATE TRIGGER update_project_asset_count_ai_agents
  AFTER INSERT OR DELETE ON ai_agents
  FOR EACH ROW EXECUTE FUNCTION update_project_asset_count();

CREATE TRIGGER update_project_asset_count_tools
  AFTER INSERT OR DELETE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_project_asset_count();

CREATE TRIGGER update_project_asset_count_datasets
  AFTER INSERT OR DELETE ON datasets
  FOR EACH ROW EXECUTE FUNCTION update_project_asset_count();

CREATE TRIGGER update_project_asset_count_reports
  AFTER INSERT OR DELETE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_project_asset_count();

CREATE TRIGGER update_project_asset_count_mcp
  AFTER INSERT OR DELETE ON mcp_integrations
  FOR EACH ROW EXECUTE FUNCTION update_project_asset_count();

-- Apply updated_at triggers to all asset tables
CREATE TRIGGER update_dashboards_updated_at
  BEFORE UPDATE ON dashboards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ai_agents_updated_at
  BEFORE UPDATE ON ai_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_datasets_updated_at
  BEFORE UPDATE ON datasets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_mcp_integrations_updated_at
  BEFORE UPDATE ON mcp_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();