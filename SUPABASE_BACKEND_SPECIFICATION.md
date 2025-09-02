# InnoSpot Supabase Backend Specification

## Overview
This document defines the complete database schema and API requirements for the InnoSpot patent intelligence platform, including all features from Capability Showcase, Studio, Innovation Hub, Decision Engines, and core platform functionality.

## Database Schema

### 1. Authentication & User Management

#### `users` (extends Supabase auth.users)
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id),
  role VARCHAR(50) DEFAULT 'user', -- user, admin, org_admin
  subscription_tier VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
  settings JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT false,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `organizations`
```sql
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  size_category VARCHAR(50), -- startup, small, medium, large, enterprise
  logo_url TEXT,
  website_url TEXT,
  billing_email VARCHAR(255),
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_sessions`
```sql
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Project & Space Management

#### `projects` (Spaces)
```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(100) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  visibility VARCHAR(50) DEFAULT 'private', -- private, organization, public
  status VARCHAR(50) DEFAULT 'active', -- active, archived, deleted
  settings JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  asset_count INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 1,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);
```

#### `project_members`
```sql
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- owner, admin, editor, member, viewer
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);
```

### 3. Studio Asset Management

#### `dashboards`
```sql
CREATE TABLE public.dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) DEFAULT 'custom', -- custom, ai_generated, template
  layout JSONB NOT NULL DEFAULT '{}', -- dashboard configuration
  widgets JSONB NOT NULL DEFAULT '[]', -- widget configurations
  data_sources JSONB DEFAULT '{}', -- connected data sources
  access_level VARCHAR(50) DEFAULT 'private', -- private, organization, public
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
  settings JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  template_id UUID REFERENCES dashboard_templates(id),
  metrics JSONB DEFAULT '{"views": 0, "shares": 0, "forks": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `ai_agents`
```sql
CREATE TABLE public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id),
  agent_type VARCHAR(100) NOT NULL, -- patent_analyzer, claim_generator, prior_art_searcher
  configuration JSONB NOT NULL DEFAULT '{}', -- agent-specific config
  model_settings JSONB DEFAULT '{}', -- AI model configuration
  prompt_templates JSONB DEFAULT '{}', -- custom prompts
  knowledge_base_id UUID REFERENCES knowledge_bases(id),
  access_level VARCHAR(50) DEFAULT 'private',
  status VARCHAR(50) DEFAULT 'active', -- active, training, paused, archived
  performance_metrics JSONB DEFAULT '{}',
  usage_stats JSONB DEFAULT '{"runs": 0, "success_rate": 0}',
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `tools`
```sql
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id),
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `datasets`
```sql
CREATE TABLE public.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id),
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `reports`
```sql
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id),
  report_type VARCHAR(100) NOT NULL, -- patent_landscape, portfolio_analysis, freedom_to_operate
  template_id UUID REFERENCES report_templates(id),
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `mcp_integrations`
```sql
CREATE TABLE public.mcp_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id),
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Capability Showcase & Downloads

#### `capabilities`
```sql
CREATE TABLE public.capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  category VARCHAR(100) NOT NULL, -- ai, analysis, visualization, search, automation, mcp
  type VARCHAR(100) NOT NULL, -- ai-agent, tool, dataset, dashboard, report, integration
  provider_id UUID REFERENCES users(id), -- capability creator
  organization_id UUID REFERENCES organizations(id),
  icon_url TEXT,
  screenshot_urls TEXT[],
  demo_url TEXT,
  documentation_url TEXT,
  source_code_url TEXT,
  configuration_schema JSONB DEFAULT '{}',
  input_requirements JSONB DEFAULT '{}',
  output_format JSONB DEFAULT '{}',
  pricing JSONB DEFAULT '{"type": "free", "amount": 0}',
  tags TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  supported_formats TEXT[] DEFAULT '{}',
  requirements JSONB DEFAULT '{}', -- system requirements
  compatibility JSONB DEFAULT '{}', -- platform compatibility
  status VARCHAR(50) DEFAULT 'draft', -- draft, review, published, deprecated
  approval_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  featured BOOLEAN DEFAULT false,
  metrics JSONB DEFAULT '{"downloads": 0, "runs": 0, "rating": 0, "reviews": 0}',
  performance_stats JSONB DEFAULT '{}',
  version VARCHAR(50) DEFAULT '1.0.0',
  changelog TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);
```

#### `capability_downloads`
```sql
CREATE TABLE public.capability_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capability_id UUID NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  download_type VARCHAR(50) DEFAULT 'standard', -- standard, fork, clone
  installation_status VARCHAR(50) DEFAULT 'pending', -- pending, installed, failed, removed
  configuration JSONB DEFAULT '{}', -- user-specific configuration
  usage_stats JSONB DEFAULT '{"runs": 0, "last_run": null}',
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  installed_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(capability_id, user_id, project_id)
);
```

#### `capability_reviews`
```sql
CREATE TABLE public.capability_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capability_id UUID NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  pros TEXT,
  cons TEXT,
  use_case_tags TEXT[] DEFAULT '{}',
  verified_download BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'published', -- published, hidden, reported
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(capability_id, user_id)
);
```

### 5. Decision Engines

#### `decision_engines`
```sql
CREATE TABLE public.decision_engines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engine_id VARCHAR(100) UNIQUE NOT NULL, -- patentability, filing-strategy, etc.
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  purpose TEXT NOT NULL,
  category VARCHAR(100) NOT NULL, -- strategy, legal, technical, business
  icon VARCHAR(100),
  estimated_time INTEGER NOT NULL, -- minutes
  target_personas TEXT[] NOT NULL,
  question_flow JSONB NOT NULL, -- adaptive question configuration
  data_sources JSONB DEFAULT '{}', -- connected data sources
  ai_models JSONB DEFAULT '{}', -- AI model configurations
  output_templates JSONB DEFAULT '{}', -- recommendation templates
  confidence_thresholds JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active', -- active, maintenance, deprecated
  version VARCHAR(50) DEFAULT '1.0.0',
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `decision_sessions`
```sql
CREATE TABLE public.decision_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engine_id VARCHAR(100) NOT NULL REFERENCES decision_engines(engine_id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  session_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active', -- active, completed, abandoned, paused
  current_step INTEGER DEFAULT 0,
  responses JSONB DEFAULT '{}', -- user responses to questions
  context_data JSONB DEFAULT '{}', -- additional context
  recommendations JSONB DEFAULT '{}', -- generated recommendations
  confidence_scores JSONB DEFAULT '{}',
  data_sources_used JSONB DEFAULT '{}',
  execution_log JSONB DEFAULT '[]', -- processing steps log
  duration_minutes INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `decision_recommendations`
```sql
CREATE TABLE public.decision_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES decision_sessions(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  detailed_analysis TEXT,
  confidence_score DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00
  supporting_data JSONB DEFAULT '{}',
  citations JSONB DEFAULT '[]',
  risk_factors JSONB DEFAULT '[]',
  actionable_steps JSONB DEFAULT '[]',
  cost_implications JSONB DEFAULT '{}',
  timeline_estimate JSONB DEFAULT '{}',
  alternative_options JSONB DEFAULT '[]',
  priority_level VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
  status VARCHAR(50) DEFAULT 'active', -- active, implemented, dismissed, superseded
  user_feedback JSONB DEFAULT '{}',
  implementation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Innovation Hub Features

#### `innovation_features`
```sql
CREATE TABLE public.innovation_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL, -- ai, analytics, collaboration, monitoring
  icon VARCHAR(100),
  color VARCHAR(50),
  status VARCHAR(50) DEFAULT 'available', -- available, beta, coming-soon, maintenance
  feature_type VARCHAR(100) NOT NULL, -- component, service, integration
  configuration_schema JSONB DEFAULT '{}',
  requirements JSONB DEFAULT '{}',
  pricing_tier VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
  documentation_url TEXT,
  demo_url TEXT,
  api_endpoints JSONB DEFAULT '{}',
  usage_limits JSONB DEFAULT '{}',
  performance_benchmarks JSONB DEFAULT '{}',
  integration_guides JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `feature_usage`
```sql
CREATE TABLE public.feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id VARCHAR(100) NOT NULL REFERENCES innovation_features(feature_id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  usage_type VARCHAR(100) NOT NULL, -- activation, execution, configuration
  session_id UUID, -- for grouping related activities
  parameters JSONB DEFAULT '{}',
  execution_time_ms INTEGER,
  resource_usage JSONB DEFAULT '{}',
  success BOOLEAN DEFAULT true,
  error_details JSONB,
  metrics JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_activity_log`
```sql
CREATE TABLE public.user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL, -- login, feature_use, asset_create, etc.
  entity_type VARCHAR(100), -- project, dashboard, capability, etc.
  entity_id UUID,
  action VARCHAR(100) NOT NULL, -- create, read, update, delete, download, share
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. Knowledge & Content Management

#### `knowledge_bases`
```sql
CREATE TABLE public.knowledge_bases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  kb_type VARCHAR(100) NOT NULL, -- patent_data, legal_docs, market_intel
  data_sources JSONB DEFAULT '{}',
  indexing_config JSONB DEFAULT '{}',
  search_config JSONB DEFAULT '{}',
  document_count INTEGER DEFAULT 0,
  total_size_bytes BIGINT DEFAULT 0,
  last_indexed_at TIMESTAMP WITH TIME ZONE,
  access_level VARCHAR(50) DEFAULT 'private',
  status VARCHAR(50) DEFAULT 'active', -- active, indexing, error, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `documents`
```sql
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_base_id UUID NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  document_type VARCHAR(100) NOT NULL, -- patent, legal_doc, research_paper
  source_url TEXT,
  file_path TEXT,
  metadata JSONB DEFAULT '{}',
  extracted_entities JSONB DEFAULT '{}',
  embedding_vector VECTOR(1536), -- for semantic search
  content_hash VARCHAR(64), -- for duplicate detection
  language VARCHAR(10) DEFAULT 'en',
  word_count INTEGER,
  confidence_score DECIMAL(3,2),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. File & Asset Storage

#### `files`
```sql
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(500) NOT NULL,
  original_filename VARCHAR(500) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_hash VARCHAR(64) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  entity_type VARCHAR(100), -- dashboard, report, dataset, etc.
  entity_id UUID,
  access_level VARCHAR(50) DEFAULT 'private',
  storage_provider VARCHAR(50) DEFAULT 'supabase', -- supabase, s3, gcs
  cdn_url TEXT,
  metadata JSONB DEFAULT '{}',
  download_count INTEGER DEFAULT 0,
  virus_scan_status VARCHAR(50) DEFAULT 'pending', -- pending, clean, infected, failed
  encryption_status VARCHAR(50) DEFAULT 'none', -- none, client, server
  retention_policy JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 9. Templates & Presets

#### `dashboard_templates`
```sql
CREATE TABLE public.dashboard_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  template_data JSONB NOT NULL,
  preview_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  access_level VARCHAR(50) DEFAULT 'public',
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `report_templates`
```sql
CREATE TABLE public.report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  template_structure JSONB NOT NULL,
  style_config JSONB DEFAULT '{}',
  required_data_sources JSONB DEFAULT '{}',
  preview_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  access_level VARCHAR(50) DEFAULT 'public',
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10. Notifications & Communication

#### `notifications`
```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(100) NOT NULL, -- system, feature, collaboration, billing
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  action_label VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high, urgent
  category VARCHAR(100), -- info, success, warning, error
  entity_type VARCHAR(100),
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `collaboration_activities`
```sql
CREATE TABLE public.collaboration_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL, -- comment, share, mention, edit
  entity_type VARCHAR(100) NOT NULL, -- dashboard, report, dataset
  entity_id UUID NOT NULL,
  content TEXT,
  mentioned_users UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  parent_activity_id UUID REFERENCES collaboration_activities(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 11. Analytics & Metrics

#### `usage_analytics`
```sql
CREATE TABLE public.usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  event_type VARCHAR(100) NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  properties JSONB DEFAULT '{}',
  session_id UUID,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `performance_metrics`
```sql
CREATE TABLE public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type VARCHAR(100) NOT NULL, -- api_response_time, query_duration, etc.
  metric_name VARCHAR(100) NOT NULL,
  value DECIMAL(10,4) NOT NULL,
  unit VARCHAR(50) NOT NULL, -- ms, seconds, count, percentage
  dimensions JSONB DEFAULT '{}', -- additional categorization
  entity_type VARCHAR(100),
  entity_id UUID,
  user_id UUID REFERENCES users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Specifications

### 1. Authentication APIs

#### POST `/auth/login`
```typescript
interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

interface LoginResponse {
  user: User;
  session: Session;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
```

#### POST `/auth/register`
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
  organization_name?: string;
  invite_code?: string;
}
```

#### POST `/auth/refresh`
```typescript
interface RefreshRequest {
  refresh_token: string;
}
```

#### POST `/auth/logout`
```typescript
interface LogoutRequest {
  session_id: string;
}
```

### 2. Project Management APIs

#### GET `/api/projects`
```typescript
interface ProjectListParams {
  organization_id?: string;
  visibility?: 'private' | 'organization' | 'public';
  status?: 'active' | 'archived';
  limit?: number;
  offset?: number;
  search?: string;
}

interface ProjectListResponse {
  projects: Project[];
  total_count: number;
  has_more: boolean;
}
```

#### POST `/api/projects`
```typescript
interface CreateProjectRequest {
  name: string;
  description?: string;
  visibility?: 'private' | 'organization' | 'public';
  tags?: string[];
  settings?: Record<string, any>;
}
```

#### GET `/api/projects/:id`
#### PUT `/api/projects/:id`
#### DELETE `/api/projects/:id`

#### POST `/api/projects/:id/members`
```typescript
interface AddMemberRequest {
  user_email: string;
  role: 'admin' | 'editor' | 'member' | 'viewer';
  permissions?: Record<string, boolean>;
}
```

### 3. Studio Asset APIs

#### Dashboards
```typescript
// GET /api/dashboards
interface DashboardListParams {
  project_id?: string;
  type?: 'custom' | 'ai_generated' | 'template';
  status?: 'draft' | 'published' | 'archived';
  access_level?: 'private' | 'organization' | 'public';
  limit?: number;
  offset?: number;
}

// POST /api/dashboards
interface CreateDashboardRequest {
  name: string;
  description?: string;
  project_id?: string;
  type?: 'custom' | 'ai_generated';
  layout: Record<string, any>;
  widgets: WidgetConfig[];
  access_level?: 'private' | 'organization' | 'public';
  tags?: string[];
}

// GET /api/dashboards/:id
// PUT /api/dashboards/:id
// DELETE /api/dashboards/:id
// POST /api/dashboards/:id/clone
// POST /api/dashboards/:id/share
```

#### AI Agents
```typescript
// GET /api/ai-agents
interface AIAgentListParams {
  project_id?: string;
  agent_type?: string;
  status?: 'active' | 'training' | 'paused' | 'archived';
  limit?: number;
  offset?: number;
}

// POST /api/ai-agents
interface CreateAIAgentRequest {
  name: string;
  description?: string;
  project_id?: string;
  agent_type: string;
  configuration: Record<string, any>;
  model_settings?: Record<string, any>;
  prompt_templates?: Record<string, any>;
  knowledge_base_id?: string;
}

// POST /api/ai-agents/:id/execute
interface ExecuteAgentRequest {
  input_data: Record<string, any>;
  execution_config?: Record<string, any>;
}

interface ExecuteAgentResponse {
  execution_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: Record<string, any>;
  execution_time_ms?: number;
  resource_usage?: Record<string, any>;
}
```

#### Tools
```typescript
// Similar patterns for Tools, Datasets, Reports, MCP Integrations
// GET /api/tools
// POST /api/tools
// GET /api/tools/:id
// PUT /api/tools/:id
// DELETE /api/tools/:id
// POST /api/tools/:id/execute
```

### 4. Capability Showcase APIs

#### GET `/api/capabilities`
```typescript
interface CapabilityListParams {
  category?: string;
  type?: string;
  featured?: boolean;
  search?: string;
  tags?: string[];
  sort_by?: 'popularity' | 'rating' | 'recent' | 'name';
  pricing_type?: 'free' | 'paid' | 'freemium';
  limit?: number;
  offset?: number;
}
```

#### POST `/api/capabilities/:id/download`
```typescript
interface DownloadCapabilityRequest {
  project_id?: string;
  configuration?: Record<string, any>;
}
```

#### POST `/api/capabilities/:id/review`
```typescript
interface CreateReviewRequest {
  rating: number; // 1-5
  title?: string;
  content?: string;
  pros?: string;
  cons?: string;
  use_case_tags?: string[];
}
```

#### GET `/api/user/downloads`
```typescript
interface UserDownloadsResponse {
  downloads: CapabilityDownload[];
  total_count: number;
  categories: {
    category: string;
    count: number;
    capabilities: CapabilityDownload[];
  }[];
}
```

### 5. Decision Engine APIs

#### GET `/api/decision-engines`
```typescript
interface DecisionEngineListResponse {
  engines: DecisionEngine[];
  categories: EngineCategory[];
}
```

#### POST `/api/decision-engines/:engine_id/sessions`
```typescript
interface CreateSessionRequest {
  session_name?: string;
  project_id?: string;
  initial_context?: Record<string, any>;
}

interface CreateSessionResponse {
  session_id: string;
  engine: DecisionEngine;
  current_step: number;
  question: QuestionConfig;
}
```

#### POST `/api/decision-sessions/:id/respond`
```typescript
interface RespondToQuestionRequest {
  step: number;
  response: Record<string, any>;
  additional_context?: Record<string, any>;
}

interface RespondToQuestionResponse {
  next_step?: number;
  next_question?: QuestionConfig;
  is_complete: boolean;
  recommendations?: Recommendation[];
  confidence_scores?: Record<string, number>;
}
```

#### GET `/api/decision-sessions/:id`
#### PUT `/api/decision-sessions/:id`
#### DELETE `/api/decision-sessions/:id`

#### GET `/api/decision-sessions/:id/recommendations`
#### POST `/api/decision-sessions/:id/export`
```typescript
interface ExportSessionRequest {
  format: 'json' | 'pdf' | 'docx';
  include_data_sources?: boolean;
  include_raw_responses?: boolean;
}
```

### 6. Innovation Hub APIs

#### GET `/api/innovation-features`
```typescript
interface InnovationFeatureListResponse {
  features: InnovationFeature[];
  categories: FeatureCategory[];
  user_activity?: UserActivity[];
}
```

#### POST `/api/innovation-features/:feature_id/activate`
```typescript
interface ActivateFeatureRequest {
  project_id?: string;
  configuration?: Record<string, any>;
}
```

#### GET `/api/innovation-features/:feature_id/usage`
```typescript
interface FeatureUsageResponse {
  total_usage: number;
  usage_by_period: UsagePeriod[];
  performance_metrics: PerformanceMetric[];
  user_feedback: FeedbackSummary;
}
```

### 7. Knowledge Base APIs

#### POST `/api/knowledge-bases`
```typescript
interface CreateKnowledgeBaseRequest {
  name: string;
  description?: string;
  kb_type: 'patent_data' | 'legal_docs' | 'market_intel';
  data_sources?: Record<string, any>;
  indexing_config?: Record<string, any>;
}
```

#### POST `/api/knowledge-bases/:id/documents`
```typescript
interface AddDocumentRequest {
  title: string;
  content?: string;
  document_type: string;
  source_url?: string;
  file_path?: string;
  metadata?: Record<string, any>;
}
```

#### POST `/api/knowledge-bases/:id/search`
```typescript
interface SearchKnowledgeBaseRequest {
  query: string;
  filters?: Record<string, any>;
  limit?: number;
  include_metadata?: boolean;
  semantic_search?: boolean;
}

interface SearchKnowledgeBaseResponse {
  results: SearchResult[];
  total_count: number;
  search_time_ms: number;
  suggestions?: string[];
}
```

### 8. File Management APIs

#### POST `/api/files/upload`
```typescript
interface FileUploadRequest {
  file: File;
  project_id?: string;
  entity_type?: string;
  entity_id?: string;
  access_level?: 'private' | 'organization' | 'public';
  metadata?: Record<string, any>;
}

interface FileUploadResponse {
  file_id: string;
  file_path: string;
  cdn_url?: string;
  file_size: number;
  mime_type: string;
}
```

#### GET `/api/files/:id`
#### DELETE `/api/files/:id`
#### GET `/api/files/:id/download`

### 9. Analytics APIs

#### GET `/api/analytics/usage`
```typescript
interface UsageAnalyticsParams {
  start_date: string;
  end_date: string;
  granularity: 'hour' | 'day' | 'week' | 'month';
  entity_type?: string;
  entity_id?: string;
  event_types?: string[];
}

interface UsageAnalyticsResponse {
  metrics: AnalyticsMetric[];
  summaries: AnalyticsSummary[];
  trends: TrendData[];
}
```

#### GET `/api/analytics/performance`
```typescript
interface PerformanceAnalyticsResponse {
  api_performance: APIPerformanceMetric[];
  feature_performance: FeaturePerformanceMetric[];
  user_experience: UXMetric[];
  system_health: SystemHealthMetric[];
}
```

### 10. Notification APIs

#### GET `/api/notifications`
```typescript
interface NotificationListParams {
  unread_only?: boolean;
  notification_types?: string[];
  limit?: number;
  offset?: number;
}
```

#### PUT `/api/notifications/:id/read`
#### POST `/api/notifications/mark-all-read`
#### DELETE `/api/notifications/:id`

## Row Level Security (RLS) Policies

### User Data Access
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Organization Access
```sql
-- Members can view organization data
CREATE POLICY "Organization members can view" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid()
    )
  );
```

### Project Access
```sql
-- Project members can access project data
CREATE POLICY "Project members can access" ON projects
  FOR ALL USING (
    owner_id = auth.uid() OR
    id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    )
  );
```

### Asset Access Control
```sql
-- Dashboard access based on project membership and access level
CREATE POLICY "Dashboard access control" ON dashboards
  FOR SELECT USING (
    owner_id = auth.uid() OR
    (access_level = 'public') OR
    (access_level = 'organization' AND 
     project_id IN (
       SELECT p.id FROM projects p
       JOIN users u ON p.organization_id = u.organization_id
       WHERE u.id = auth.uid()
     )) OR
    (project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    ))
  );
```

## Indexes for Performance

```sql
-- User and authentication indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Project and membership indexes
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);

-- Asset indexes
CREATE INDEX idx_dashboards_project ON dashboards(project_id);
CREATE INDEX idx_dashboards_owner ON dashboards(owner_id);
CREATE INDEX idx_dashboards_status ON dashboards(status);
CREATE INDEX idx_dashboards_access ON dashboards(access_level);

-- Capability indexes
CREATE INDEX idx_capabilities_category ON capabilities(category);
CREATE INDEX idx_capabilities_type ON capabilities(type);
CREATE INDEX idx_capabilities_status ON capabilities(status);
CREATE INDEX idx_capabilities_featured ON capabilities(featured);
CREATE INDEX idx_capabilities_provider ON capabilities(provider_id);

-- Decision engine indexes
CREATE INDEX idx_decision_sessions_user ON decision_sessions(user_id);
CREATE INDEX idx_decision_sessions_engine ON decision_sessions(engine_id);
CREATE INDEX idx_decision_sessions_status ON decision_sessions(status);

-- Performance indexes
CREATE INDEX idx_documents_kb ON documents(knowledge_base_id);
CREATE INDEX idx_documents_vector ON documents USING ivfflat (embedding_vector vector_cosine_ops);
CREATE INDEX idx_user_activity_user ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_timestamp ON user_activity_log(timestamp);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
```

## Database Functions and Triggers

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Asset count maintenance
```sql
CREATE OR REPLACE FUNCTION update_project_asset_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects 
  SET asset_count = (
    SELECT COUNT(*) FROM (
      SELECT project_id FROM dashboards WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
      UNION ALL
      SELECT project_id FROM ai_agents WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
      UNION ALL
      SELECT project_id FROM tools WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
      UNION ALL
      SELECT project_id FROM datasets WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
      UNION ALL
      SELECT project_id FROM reports WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
    ) AS all_assets
  )
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

This comprehensive specification provides the foundation for a robust Supabase backend that can support all the features in the InnoSpot platform, from basic user management to advanced AI-powered decision engines and innovation features.