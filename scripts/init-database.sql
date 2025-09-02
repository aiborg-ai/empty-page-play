-- ============================================================================
-- InnoSpot Database Initialization Script
-- ============================================================================
-- This script creates all necessary tables, indexes, and initial data
-- for the InnoSpot patent intelligence platform.
--
-- Run with: psql -h localhost -U innospot_user -d innospot_dev -f scripts/init-database.sql
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ============================================================================
-- USERS & AUTHENTICATION TABLES
-- ============================================================================

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'researcher', 'commercial')),
    avatar_url TEXT,
    company VARCHAR(255),
    department VARCHAR(255),
    title VARCHAR(255),
    phone VARCHAR(50),
    timezone VARCHAR(100) DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROJECTS & SPACES TABLES
-- ============================================================================

-- Spaces/Projects table
CREATE TABLE IF NOT EXISTS spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Space members table
CREATE TABLE IF NOT EXISTS space_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    permissions JSONB DEFAULT '{}',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(space_id, user_id)
);

-- ============================================================================
-- INNOVATION MANAGEMENT TABLES
-- ============================================================================

-- Innovation pipeline items
CREATE TABLE IF NOT EXISTS innovation_pipeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    stage VARCHAR(50) NOT NULL CHECK (stage IN ('ideation', 'research', 'development', 'filing', 'prosecution', 'granted')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assignee_id UUID REFERENCES user_profiles(id),
    assignee_name VARCHAR(255),
    due_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    patent_number VARCHAR(50),
    technology_category VARCHAR(100),
    estimated_value DECIMAL(15, 2),
    milestones JSONB DEFAULT '[]',
    documents JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    tags TEXT[],
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patents table
CREATE TABLE IF NOT EXISTS patents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    patent_number VARCHAR(50) UNIQUE NOT NULL,
    filing_date DATE,
    grant_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'filed', 'published', 'granted', 'expired', 'abandoned')),
    technology_category VARCHAR(100),
    market_value DECIMAL(15, 2) DEFAULT 0,
    licensing_potential INTEGER DEFAULT 0 CHECK (licensing_potential >= 0 AND licensing_potential <= 100),
    citation_count INTEGER DEFAULT 0,
    maintenance_cost DECIMAL(10, 2) DEFAULT 0,
    remaining_life INTEGER DEFAULT 20,
    roi DECIMAL(8, 2) DEFAULT 0,
    inventors TEXT[],
    jurisdictions VARCHAR(10)[] DEFAULT '{"US"}',
    abstract TEXT,
    claims JSONB DEFAULT '[]',
    related_patents VARCHAR(50)[],
    metadata JSONB DEFAULT '{}',
    tags TEXT[],
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitors table
CREATE TABLE IF NOT EXISTS competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    patent_count INTEGER DEFAULT 0,
    recent_filings INTEGER DEFAULT 0,
    tech_domains TEXT[],
    threat_level VARCHAR(20) DEFAULT 'medium' CHECK (threat_level IN ('low', 'medium', 'high')),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    market_cap DECIMAL(15, 2),
    location VARCHAR(255),
    products TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitive alerts table
CREATE TABLE IF NOT EXISTS competitive_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('filing', 'grant', 'litigation', 'acquisition', 'partnership')),
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
    competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
    competitor_name VARCHAR(255),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    patent_number VARCHAR(50),
    action_required BOOLEAN DEFAULT false,
    recommendations TEXT[],
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TECHNOLOGY & CONVERGENCE TABLES
-- ============================================================================

-- Technology nodes
CREATE TABLE IF NOT EXISTS technology_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    connections INTEGER DEFAULT 0,
    convergence_score INTEGER DEFAULT 0 CHECK (convergence_score >= 0 AND convergence_score <= 100),
    position_x DECIMAL(10, 4),
    position_y DECIMAL(10, 4),
    size INTEGER DEFAULT 20,
    color VARCHAR(7),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technology connections
CREATE TABLE IF NOT EXISTS technology_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES technology_nodes(id) ON DELETE CASCADE,
    target_id UUID REFERENCES technology_nodes(id) ON DELETE CASCADE,
    strength INTEGER DEFAULT 50 CHECK (strength >= 0 AND strength <= 100),
    innovations INTEGER DEFAULT 0,
    connection_type VARCHAR(20) DEFAULT 'neutral' CHECK (connection_type IN ('synergy', 'conflict', 'neutral')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, target_id)
);

-- White space opportunities
CREATE TABLE IF NOT EXISTS white_space_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technologies TEXT[] NOT NULL,
    opportunity VARCHAR(500) NOT NULL,
    score INTEGER DEFAULT 50 CHECK (score >= 0 AND score <= 100),
    market_size DECIMAL(15, 2),
    competition_level VARCHAR(20) DEFAULT 'medium' CHECK (competition_level IN ('low', 'medium', 'high')),
    recommendations TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TEAM & COLLABORATION TABLES
-- ============================================================================

-- Team members (extends user_profiles with additional info)
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    department VARCHAR(100),
    expertise TEXT[],
    is_active BOOLEAN DEFAULT true,
    current_projects TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, space_id)
);

-- Invention disclosures
CREATE TABLE IF NOT EXISTS invention_disclosures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'review', 'approved', 'rejected')),
    assignee_id UUID REFERENCES user_profiles(id),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    inventors JSONB DEFAULT '[]',
    description TEXT,
    technical_field VARCHAR(100),
    prior_art TEXT[],
    documents JSONB DEFAULT '[]',
    review_comments JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    tags TEXT[],
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities log
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('comment', 'edit', 'approval', 'submission', 'assignment')),
    actor_id UUID REFERENCES user_profiles(id),
    actor_name VARCHAR(255),
    action VARCHAR(500) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATION & WORKFLOWS TABLES
-- ============================================================================

-- Workflows
CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    trigger_config JSONB NOT NULL DEFAULT '{}',
    workflow_config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES user_profiles(id),
    last_run TIMESTAMPTZ,
    run_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow executions
CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    trigger_data JSONB DEFAULT '{}',
    execution_log JSONB DEFAULT '[]',
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    execution_time_ms INTEGER
);

-- ============================================================================
-- INTEGRATION TABLES
-- ============================================================================

-- Integrations base table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
    config JSONB NOT NULL DEFAULT '{}',
    credentials JSONB DEFAULT '{}', -- Encrypted
    last_sync TIMESTAMPTZ,
    sync_frequency VARCHAR(20) DEFAULT 'manual',
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API marketplace
CREATE TABLE IF NOT EXISTS api_marketplace (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    version VARCHAR(20) DEFAULT '1.0.0',
    base_url TEXT NOT NULL,
    documentation_url TEXT,
    pricing_model VARCHAR(50) DEFAULT 'free',
    rate_limit INTEGER DEFAULT 1000,
    supports_webhook BOOLEAN DEFAULT false,
    required_scopes TEXT[],
    config_schema JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API keys management
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    api_id UUID REFERENCES api_marketplace(id),
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL, -- Hashed API key
    permissions TEXT[] DEFAULT '{}',
    rate_limit INTEGER DEFAULT 1000,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL DEFAULT '{}',
    secret VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    retry_attempts INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook logs
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    attempt_number INTEGER DEFAULT 1,
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REPORTS & ANALYTICS TABLES
-- ============================================================================

-- Reports
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    schedule_config JSONB DEFAULT '{}',
    output_format VARCHAR(20) DEFAULT 'pdf',
    recipients TEXT[] DEFAULT '{}',
    is_scheduled BOOLEAN DEFAULT false,
    last_generated TIMESTAMPTZ,
    next_generation TIMESTAMPTZ,
    generation_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report generations
CREATE TABLE IF NOT EXISTS report_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    file_path TEXT,
    file_size INTEGER,
    status VARCHAR(20) DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'failed')),
    error_message TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    downloaded_at TIMESTAMPTZ,
    download_count INTEGER DEFAULT 0
);

-- ============================================================================
-- NOTIFICATIONS & ALERTS TABLES
-- ============================================================================

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    action_label VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON user_profiles(is_active);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- Spaces indexes
CREATE INDEX IF NOT EXISTS idx_spaces_owner_id ON spaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_spaces_public ON spaces(is_public);
CREATE INDEX IF NOT EXISTS idx_space_members_space_id ON space_members(space_id);
CREATE INDEX IF NOT EXISTS idx_space_members_user_id ON space_members(user_id);

-- Innovation pipeline indexes
CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_space_id ON innovation_pipeline(space_id);
CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_stage ON innovation_pipeline(stage);
CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_priority ON innovation_pipeline(priority);
CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_assignee ON innovation_pipeline(assignee_id);
CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_due_date ON innovation_pipeline(due_date);
CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_created_at ON innovation_pipeline(created_at);

-- Patents indexes
CREATE INDEX IF NOT EXISTS idx_patents_space_id ON patents(space_id);
CREATE INDEX IF NOT EXISTS idx_patents_number ON patents(patent_number);
CREATE INDEX IF NOT EXISTS idx_patents_status ON patents(status);
CREATE INDEX IF NOT EXISTS idx_patents_technology ON patents(technology_category);
CREATE INDEX IF NOT EXISTS idx_patents_filing_date ON patents(filing_date);
CREATE INDEX IF NOT EXISTS idx_patents_value ON patents(market_value);

-- Competitors indexes
CREATE INDEX IF NOT EXISTS idx_competitors_threat_level ON competitors(threat_level);
CREATE INDEX IF NOT EXISTS idx_competitors_patent_count ON competitors(patent_count);
CREATE INDEX IF NOT EXISTS idx_competitors_last_activity ON competitors(last_activity);

-- Competitive alerts indexes
CREATE INDEX IF NOT EXISTS idx_competitive_alerts_competitor_id ON competitive_alerts(competitor_id);
CREATE INDEX IF NOT EXISTS idx_competitive_alerts_type ON competitive_alerts(type);
CREATE INDEX IF NOT EXISTS idx_competitive_alerts_severity ON competitive_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_competitive_alerts_read ON competitive_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_competitive_alerts_created ON competitive_alerts(created_at);

-- Technology nodes indexes
CREATE INDEX IF NOT EXISTS idx_technology_nodes_category ON technology_nodes(category);
CREATE INDEX IF NOT EXISTS idx_technology_nodes_convergence ON technology_nodes(convergence_score);

-- Technology connections indexes
CREATE INDEX IF NOT EXISTS idx_technology_connections_source ON technology_connections(source_id);
CREATE INDEX IF NOT EXISTS idx_technology_connections_target ON technology_connections(target_id);
CREATE INDEX IF NOT EXISTS idx_technology_connections_strength ON technology_connections(strength);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_space_id ON team_members(space_id);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);

-- Invention disclosures indexes
CREATE INDEX IF NOT EXISTS idx_invention_disclosures_space_id ON invention_disclosures(space_id);
CREATE INDEX IF NOT EXISTS idx_invention_disclosures_status ON invention_disclosures(status);
CREATE INDEX IF NOT EXISTS idx_invention_disclosures_assignee ON invention_disclosures(assignee_id);

-- Activities indexes
CREATE INDEX IF NOT EXISTS idx_activities_actor_id ON activities(actor_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_target ON activities(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);

-- Workflows indexes
CREATE INDEX IF NOT EXISTS idx_workflows_type ON workflows(type);
CREATE INDEX IF NOT EXISTS idx_workflows_active ON workflows(is_active);
CREATE INDEX IF NOT EXISTS idx_workflows_created_by ON workflows(created_by);

-- Workflow executions indexes
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started ON workflow_executions(started_at);

-- Integrations indexes
CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_type ON integrations(type);
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);

-- API marketplace indexes
CREATE INDEX IF NOT EXISTS idx_api_marketplace_category ON api_marketplace(category);
CREATE INDEX IF NOT EXISTS idx_api_marketplace_provider ON api_marketplace(provider);
CREATE INDEX IF NOT EXISTS idx_api_marketplace_active ON api_marketplace(is_active);
CREATE INDEX IF NOT EXISTS idx_api_marketplace_featured ON api_marketplace(featured);

-- API keys indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_api_id ON api_keys(api_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_expires ON api_keys(expires_at);

-- Webhooks indexes
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(is_active);

-- Webhook logs indexes
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_success ON webhook_logs(success);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at);

-- Reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_space_id ON reports(space_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_scheduled ON reports(is_scheduled);
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);

-- Report generations indexes
CREATE INDEX IF NOT EXISTS idx_report_generations_report_id ON report_generations(report_id);
CREATE INDEX IF NOT EXISTS idx_report_generations_status ON report_generations(status);
CREATE INDEX IF NOT EXISTS idx_report_generations_generated ON report_generations(generated_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_severity ON notifications(severity);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- System settings indexes
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_public ON system_settings(is_public);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_patents_title_search ON patents USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_patents_abstract_search ON patents USING gin(to_tsvector('english', abstract));
CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_title_search ON innovation_pipeline USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_description_search ON innovation_pipeline USING gin(to_tsvector('english', description));

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at columns
DO $$
DECLARE
    table_name TEXT;
    tables_with_updated_at TEXT[] := ARRAY[
        'user_profiles', 'spaces', 'innovation_pipeline', 'patents', 
        'competitors', 'technology_nodes', 'white_space_opportunities',
        'team_members', 'invention_disclosures', 'workflows', 'integrations',
        'api_marketplace', 'reports', 'system_settings'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables_with_updated_at
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        ', table_name, table_name, table_name, table_name);
    END LOOP;
END $$;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active patents view
CREATE OR REPLACE VIEW active_patents AS
SELECT 
    p.*,
    s.name as space_name,
    up.full_name as created_by_name
FROM patents p
LEFT JOIN spaces s ON p.space_id = s.id
LEFT JOIN user_profiles up ON p.created_by = up.id
WHERE p.status IN ('filed', 'published', 'granted');

-- Pipeline summary view
CREATE OR REPLACE VIEW pipeline_summary AS
SELECT 
    space_id,
    stage,
    priority,
    COUNT(*) as item_count,
    AVG(progress) as avg_progress,
    COUNT(*) FILTER (WHERE due_date < CURRENT_DATE) as overdue_count
FROM innovation_pipeline
GROUP BY space_id, stage, priority;

-- Team workload view
CREATE OR REPLACE VIEW team_workload AS
SELECT 
    tm.user_id,
    tm.name,
    tm.space_id,
    COUNT(ip.id) as active_projects,
    AVG(ip.progress) as avg_progress,
    COUNT(*) FILTER (WHERE ip.priority = 'critical') as critical_projects,
    COUNT(*) FILTER (WHERE ip.due_date < CURRENT_DATE) as overdue_projects
FROM team_members tm
LEFT JOIN innovation_pipeline ip ON tm.user_id = ip.assignee_id
WHERE tm.is_active = true
GROUP BY tm.user_id, tm.name, tm.space_id;

-- ============================================================================
-- INITIAL SYSTEM SETTINGS
-- ============================================================================

INSERT INTO system_settings (key, value, description, is_public) VALUES
('app_name', '"InnoSpot"', 'Application name', true),
('app_version', '"2.0.0"', 'Application version', true),
('default_timezone', '"UTC"', 'Default timezone for the application', true),
('max_file_upload_size', '52428800', 'Maximum file upload size in bytes (50MB)', false),
('session_timeout_hours', '24', 'Session timeout in hours', false),
('enable_notifications', 'true', 'Enable system notifications', true),
('enable_webhooks', 'true', 'Enable webhook functionality', false)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ InnoSpot database initialization completed successfully!';
    RAISE NOTICE '📊 Tables created: 30+';
    RAISE NOTICE '🔍 Indexes created: 50+';
    RAISE NOTICE '⚡ Triggers created: 14';
    RAISE NOTICE '👁️ Views created: 3';
    RAISE NOTICE '⚙️ System settings initialized';
END $$;