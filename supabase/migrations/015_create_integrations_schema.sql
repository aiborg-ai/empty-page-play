-- Create comprehensive integration schema for InnoSpot
-- This migration creates all necessary tables for managing integrations

-- Base integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    version TEXT DEFAULT '1.0.0',
    category TEXT NOT NULL CHECK (category IN ('api_marketplace', 'webhook', 'enterprise', 'patent_office', 'third_party')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending', 'error', 'deprecated', 'beta')),
    provider TEXT NOT NULL,
    icon_url TEXT,
    documentation_url TEXT,
    support_url TEXT,
    last_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API marketplace table
CREATE TABLE IF NOT EXISTS api_marketplace (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    methods TEXT[] DEFAULT ARRAY['GET'],
    authentication_type TEXT DEFAULT 'api_key' CHECK (authentication_type IN ('api_key', 'bearer_token', 'oauth2', 'basic_auth', 'digest_auth')),
    rate_limit_per_minute INTEGER DEFAULT 100,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    rate_limit_per_day INTEGER DEFAULT 10000,
    pricing_model TEXT DEFAULT 'free' CHECK (pricing_model IN ('free', 'freemium', 'paid', 'enterprise')),
    price_per_request DECIMAL(10,4),
    monthly_quota INTEGER,
    schemas JSONB DEFAULT '[]',
    examples JSONB DEFAULT '[]',
    analytics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_value TEXT NOT NULL, -- encrypted
    permissions TEXT[] DEFAULT ARRAY['read'],
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    last_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    url TEXT NOT NULL,
    events JSONB DEFAULT '[]',
    authentication JSONB DEFAULT '{}',
    retry_policy JSONB DEFAULT '{"maxRetries": 3, "retryDelayMs": 1000, "backoffMultiplier": 2, "maxDelayMs": 30000}',
    headers JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    payload JSONB NOT NULL,
    response JSONB,
    attempt INTEGER DEFAULT 1,
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    processing_time_ms INTEGER DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enterprise connectors table
CREATE TABLE IF NOT EXISTS enterprise_connectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    connector_type TEXT NOT NULL CHECK (connector_type IN ('sap', 'oracle', 'microsoft_dynamics', 'salesforce', 'rest_api', 'soap_api')),
    configuration JSONB NOT NULL DEFAULT '{}',
    mappings JSONB DEFAULT '[]',
    sync_settings JSONB DEFAULT '{}',
    sync_status TEXT DEFAULT 'idle' CHECK (sync_status IN ('idle', 'running', 'completed', 'failed', 'paused')),
    last_sync TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patent office integrations table
CREATE TABLE IF NOT EXISTS patent_office_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    office TEXT NOT NULL CHECK (office IN ('uspto', 'epo', 'wipo', 'jpo', 'kipo', 'cnipa', 'ip_australia', 'cipo', 'ukipo')),
    services TEXT[] DEFAULT ARRAY[]::TEXT[],
    credentials JSONB DEFAULT '{}',
    docketing_settings JSONB DEFAULT '{}',
    filing_settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Third-party integrations table
CREATE TABLE IF NOT EXISTS third_party_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    service TEXT NOT NULL CHECK (service IN ('slack', 'microsoft_teams', 'google_workspace', 'dropbox', 'box', 'onedrive', 'zapier', 'make', 'ifttt', 'discord', 'telegram')),
    configuration JSONB DEFAULT '{}',
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration errors table
CREATE TABLE IF NOT EXISTS integration_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    error_type TEXT NOT NULL CHECK (error_type IN ('connection', 'authentication', 'configuration', 'data', 'rate_limit')),
    message TEXT NOT NULL,
    details JSONB,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Integration usage analytics table
CREATE TABLE IF NOT EXISTS integration_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    period TEXT NOT NULL CHECK (period IN ('hour', 'day', 'week', 'month')),
    requests INTEGER DEFAULT 0,
    errors INTEGER DEFAULT 0,
    data_transferred_bytes BIGINT DEFAULT 0,
    average_response_time_ms INTEGER DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- API analytics table
CREATE TABLE IF NOT EXISTS api_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id UUID REFERENCES api_marketplace(id) ON DELETE CASCADE,
    requests INTEGER DEFAULT 0,
    errors INTEGER DEFAULT 0,
    response_time INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_category ON integrations(category);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_integration_id ON api_keys(integration_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_timestamp ON webhook_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_enterprise_connectors_user_id ON enterprise_connectors(user_id);
CREATE INDEX IF NOT EXISTS idx_patent_office_integrations_user_id ON patent_office_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_third_party_integrations_user_id ON third_party_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_errors_integration_id ON integration_errors(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_usage_integration_id ON integration_usage(integration_id);

-- Enable RLS on all tables
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_marketplace ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patent_office_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE third_party_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own integrations" ON integrations
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can create their own integrations" ON integrations
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update their own integrations" ON integrations
    FOR UPDATE USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can delete their own integrations" ON integrations
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- API marketplace policies (readable by all authenticated users)
CREATE POLICY "All users can view API marketplace" ON api_marketplace
    FOR SELECT USING (auth.role() = 'authenticated');

-- API keys policies
CREATE POLICY "Users can manage their own API keys" ON api_keys
    FOR ALL USING (user_id = auth.uid()::uuid);

-- Webhooks policies
CREATE POLICY "Users can manage their own webhooks" ON webhooks
    FOR ALL USING (user_id = auth.uid()::uuid);

-- Webhook logs policies
CREATE POLICY "Users can view logs for their webhooks" ON webhook_logs
    FOR SELECT USING (
        webhook_id IN (
            SELECT id FROM webhooks WHERE user_id = auth.uid()::uuid
        )
    );

-- Enterprise connectors policies
CREATE POLICY "Users can manage their own enterprise connectors" ON enterprise_connectors
    FOR ALL USING (user_id = auth.uid()::uuid);

-- Patent office integrations policies
CREATE POLICY "Users can manage their own patent office integrations" ON patent_office_integrations
    FOR ALL USING (user_id = auth.uid()::uuid);

-- Third-party integrations policies
CREATE POLICY "Users can manage their own third-party integrations" ON third_party_integrations
    FOR ALL USING (user_id = auth.uid()::uuid);

-- Integration errors policies
CREATE POLICY "Users can view errors for their integrations" ON integration_errors
    FOR SELECT USING (
        integration_id IN (
            SELECT id FROM integrations WHERE user_id = auth.uid()::uuid
        )
    );

-- Integration usage policies
CREATE POLICY "Users can view usage for their integrations" ON integration_usage
    FOR SELECT USING (
        integration_id IN (
            SELECT id FROM integrations WHERE user_id = auth.uid()::uuid
        )
    );

-- API analytics policies (readable by all for public APIs)
CREATE POLICY "Users can view API analytics" ON api_analytics
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create some sample data for the API marketplace
INSERT INTO integrations (id, user_id, name, description, category, status, provider, version, icon_url, documentation_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'Patent Search API', 'Comprehensive patent search and retrieval service', 'api_marketplace', 'active', 'patent_search_co', '2.1.0', NULL, 'https://docs.patent-search.com'),
('550e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'Citation Analysis API', 'Advanced patent citation analysis and mapping', 'api_marketplace', 'active', 'citation_analytics', '1.5.2', NULL, 'https://docs.citation-analytics.com'),
('550e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', 'IP Valuation API', 'AI-powered intellectual property valuation service', 'api_marketplace', 'active', 'ip_valuator', '3.0.1', NULL, 'https://docs.ip-valuator.com');

INSERT INTO api_marketplace (integration_id, endpoint, methods, authentication_type, rate_limit_per_minute, pricing_model, schemas, examples, analytics) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'https://api.patent-search.com/v2', ARRAY['GET', 'POST'], 'api_key', 100, 'freemium', 
 '[{"name": "search", "schema": {"type": "object", "properties": {"query": {"type": "string"}, "limit": {"type": "number"}}}}]'::jsonb,
 '[{"title": "Basic Search", "method": "GET", "endpoint": "/search?q=artificial+intelligence&limit=10"}]'::jsonb,
 '{"totalRequests": 15420, "successfulRequests": 15280, "failedRequests": 140, "averageResponseTime": 245, "uptimePercentage": 99.1}'::jsonb),
 
('550e8400-e29b-41d4-a716-446655440002', 'https://api.citation-analytics.com/v1', ARRAY['GET', 'POST'], 'bearer_token', 50, 'paid', 
 '[{"name": "citations", "schema": {"type": "object", "properties": {"patent_id": {"type": "string"}, "depth": {"type": "number"}}}}]'::jsonb,
 '[{"title": "Get Citations", "method": "GET", "endpoint": "/citations/US10123456"}]'::jsonb,
 '{"totalRequests": 8750, "successfulRequests": 8690, "failedRequests": 60, "averageResponseTime": 180, "uptimePercentage": 99.7}'::jsonb),
 
('550e8400-e29b-41d4-a716-446655440003', 'https://api.ip-valuator.com/v3', ARRAY['POST'], 'oauth2', 25, 'enterprise', 
 '[{"name": "valuation", "schema": {"type": "object", "properties": {"patent_data": {"type": "object"}, "market_context": {"type": "object"}}}}]'::jsonb,
 '[{"title": "Value Patent", "method": "POST", "endpoint": "/valuate", "body": {"patent_id": "US10123456", "market": "technology"}}]'::jsonb,
 '{"totalRequests": 2100, "successfulRequests": 2085, "failedRequests": 15, "averageResponseTime": 1200, "uptimePercentage": 99.8}'::jsonb);

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enterprise_connectors_updated_at BEFORE UPDATE ON enterprise_connectors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patent_office_integrations_updated_at BEFORE UPDATE ON patent_office_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_third_party_integrations_updated_at BEFORE UPDATE ON third_party_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();