-- Performance Optimization and Advanced Indexing
-- Migration: 026_performance_optimization.sql

-- ============================================================================
-- COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
-- ============================================================================

-- Project-related composite indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_org_status_owner 
ON projects(organization_id, status, owner_id) 
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_visibility_org 
ON projects(visibility, organization_id, created_at DESC) 
WHERE status = 'active';

-- Asset-related composite indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dashboards_project_status_owner 
ON dashboards(project_id, status, owner_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_capabilities_category_status_featured 
ON capabilities(category, status, featured, created_at DESC) 
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_agents_project_type_status 
ON ai_agents(project_id, agent_type, status, created_at DESC);

-- Knowledge base composite indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_kb_type_language 
ON documents(knowledge_base_id, document_type, language, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_files_owner_project_type 
ON files(owner_id, project_id, entity_type, created_at DESC);

-- ============================================================================
-- PARTIAL INDEXES FOR FILTERED QUERIES
-- ============================================================================

-- Active capabilities only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_active_capabilities 
ON capabilities(category, (metrics->>'rating')::DECIMAL DESC, created_at DESC) 
WHERE status = 'published' 
AND approval_status = 'approved' 
AND deleted_at IS NULL;

-- Recent user activity (last 30 days)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_recent_user_activity 
ON user_activity_log(user_id, timestamp DESC) 
WHERE timestamp > NOW() - INTERVAL '30 days';

-- Published documents with embeddings
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_with_embeddings 
ON documents(knowledge_base_id, document_type, confidence_score DESC) 
WHERE embedding_vector IS NOT NULL 
AND processed_at IS NOT NULL;

-- Active project members
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_active_project_members 
ON project_members(project_id, role, joined_at DESC) 
WHERE joined_at IS NOT NULL;

-- Installed capability downloads
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_installed_downloads 
ON capability_downloads(user_id, capability_id, downloaded_at DESC) 
WHERE installation_status = 'installed';

-- ============================================================================
-- EXPRESSION INDEXES FOR COMPUTED FIELDS
-- ============================================================================

-- Full-text search indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_capabilities_fulltext 
ON capabilities USING GIN(
  to_tsvector('english', 
    name || ' ' || 
    description || ' ' || 
    COALESCE(detailed_description, '') || ' ' ||
    array_to_string(tags, ' ') || ' ' ||
    array_to_string(keywords, ' ')
  )
) WHERE status = 'published';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_fulltext 
ON documents USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(content, ''))
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_fulltext 
ON projects USING GIN(
  to_tsvector('english', name || ' ' || COALESCE(description, ''))
) WHERE status = 'active';

-- JSON field indexes for metrics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_capabilities_rating 
ON capabilities(((metrics->>'rating')::DECIMAL)) 
WHERE status = 'published' AND (metrics->>'rating') IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_capabilities_downloads 
ON capabilities(((metrics->>'downloads')::INTEGER)) 
WHERE status = 'published' AND (metrics->>'downloads') IS NOT NULL;

-- Date extraction indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_log_date 
ON user_activity_log(user_id, DATE(timestamp), timestamp DESC);

-- ============================================================================
-- OPTIMIZED VECTOR INDEXES
-- ============================================================================

-- Drop existing vector index
DROP INDEX IF EXISTS idx_documents_vector;

-- Function to create optimal vector index based on data size
CREATE OR REPLACE FUNCTION create_optimal_vector_index()
RETURNS VOID AS $$
DECLARE
  doc_count INTEGER;
  optimal_lists INTEGER;
BEGIN
  SELECT COUNT(*) INTO doc_count 
  FROM documents 
  WHERE embedding_vector IS NOT NULL;
  
  -- Calculate optimal lists: sqrt(rows) but at least 1 and at most 1000
  optimal_lists := GREATEST(1, LEAST(1000, FLOOR(SQRT(doc_count))));
  
  -- Create index with optimal configuration
  EXECUTE format(
    'CREATE INDEX CONCURRENTLY idx_documents_vector_optimized 
     ON documents USING ivfflat (embedding_vector vector_cosine_ops) 
     WITH (lists = %s)', 
    optimal_lists
  );
  
  -- Log the operation
  RAISE NOTICE 'Created vector index with % lists for % documents', 
    optimal_lists, doc_count;
END;
$$ LANGUAGE plpgsql;

-- Create optimized vector index
SELECT create_optimal_vector_index();

-- ============================================================================
-- MATERIALIZED VIEWS FOR EXPENSIVE QUERIES
-- ============================================================================

-- Capability statistics by category
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_capability_stats AS
SELECT 
  category,
  COUNT(*) as total_capabilities,
  COUNT(*) FILTER (WHERE featured = true) as featured_count,
  ROUND(AVG((metrics->>'rating')::DECIMAL), 2) as avg_rating,
  SUM((metrics->>'downloads')::INTEGER) as total_downloads,
  SUM((metrics->>'reviews')::INTEGER) as total_reviews,
  MAX(created_at) as latest_capability
FROM capabilities 
WHERE status = 'published' 
AND approval_status = 'approved'
AND deleted_at IS NULL
GROUP BY category;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_capability_stats_category 
ON mv_capability_stats(category);

-- Organization statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_organization_stats AS
SELECT 
  o.id,
  o.name,
  COUNT(DISTINCT u.id) as user_count,
  COUNT(DISTINCT p.id) as project_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active') as active_projects,
  SUM(p.asset_count) as total_assets,
  MAX(p.last_activity_at) as last_activity
FROM organizations o
LEFT JOIN users u ON o.id = u.organization_id
LEFT JOIN projects p ON o.id = p.organization_id
GROUP BY o.id, o.name;

-- Create unique index on organization stats
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_organization_stats_id 
ON mv_organization_stats(id);

-- User activity summary
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_activity_summary AS
SELECT 
  user_id,
  COUNT(*) as total_activities,
  COUNT(DISTINCT activity_type) as activity_types,
  COUNT(DISTINCT entity_type) as entity_types,
  MAX(timestamp) as last_activity,
  COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '7 days') as recent_activities
FROM user_activity_log
WHERE timestamp > NOW() - INTERVAL '90 days'
GROUP BY user_id;

-- Create unique index on user activity summary
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_user_activity_summary_user 
ON mv_user_activity_summary(user_id);

-- ============================================================================
-- PARTITIONING FOR LARGE TABLES
-- ============================================================================

-- Partition user_activity_log by month
-- First, create the partitioned table structure
CREATE TABLE IF NOT EXISTS user_activity_log_partitioned (
  LIKE user_activity_log INCLUDING ALL
) PARTITION BY RANGE (timestamp);

-- Function to create monthly partitions
CREATE OR REPLACE FUNCTION create_monthly_partition(table_name TEXT, start_date DATE)
RETURNS VOID AS $$
DECLARE
  partition_name TEXT;
  end_date DATE;
BEGIN
  partition_name := table_name || '_' || to_char(start_date, 'YYYY_MM');
  end_date := start_date + INTERVAL '1 month';
  
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I
     FOR VALUES FROM (%L) TO (%L)',
    partition_name, table_name, start_date, end_date
  );
  
  -- Create indexes on partition
  EXECUTE format(
    'CREATE INDEX IF NOT EXISTS %I ON %I(user_id, timestamp DESC)',
    'idx_' || partition_name || '_user_time', partition_name
  );
END;
$$ LANGUAGE plpgsql;

-- Create partitions for current and next 3 months
SELECT create_monthly_partition(
  'user_activity_log_partitioned', 
  date_trunc('month', NOW() + (i || ' months')::INTERVAL)::DATE
) FROM generate_series(-1, 3) i;

-- ============================================================================
-- FUNCTIONS FOR AUTOMATED MAINTENANCE
-- ============================================================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_capability_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_organization_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_activity_summary;
  
  -- Log the refresh
  INSERT INTO user_activity_log (
    user_id, activity_type, entity_type, action, details
  ) VALUES (
    NULL, 'system', 'materialized_view', 'refresh', 
    '{"views": ["capability_stats", "organization_stats", "user_activity_summary"]}'::JSONB
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update vector index when needed
CREATE OR REPLACE FUNCTION maintain_vector_index()
RETURNS VOID AS $$
DECLARE
  doc_count INTEGER;
  current_lists INTEGER;
  optimal_lists INTEGER;
BEGIN
  -- Get current document count
  SELECT COUNT(*) INTO doc_count 
  FROM documents 
  WHERE embedding_vector IS NOT NULL;
  
  -- Get current index lists (simplified check)
  optimal_lists := GREATEST(1, LEAST(1000, FLOOR(SQRT(doc_count))));
  
  -- If we have significantly more documents, recreate index
  IF doc_count > 1000 AND doc_count % 10000 = 0 THEN
    DROP INDEX IF EXISTS idx_documents_vector_optimized;
    PERFORM create_optimal_vector_index();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old activity logs
CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete activity logs older than 1 year
  DELETE FROM user_activity_log 
  WHERE timestamp < NOW() - INTERVAL '1 year';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup
  INSERT INTO user_activity_log (
    user_id, activity_type, entity_type, action, details
  ) VALUES (
    NULL, 'system', 'activity_log', 'cleanup', 
    jsonb_build_object('deleted_count', deleted_count)
  );
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- QUERY OPTIMIZATION HINTS
-- ============================================================================

-- Create query plan analysis function
CREATE OR REPLACE FUNCTION analyze_query_performance(query_text TEXT)
RETURNS TABLE(
  plan_step TEXT,
  cost_estimate DECIMAL,
  rows_estimate BIGINT,
  execution_time DECIMAL
) AS $$
BEGIN
  -- This would be expanded with actual query analysis
  -- For now, it's a placeholder for monitoring
  RETURN QUERY SELECT 
    'Query analysis not implemented'::TEXT,
    0::DECIMAL,
    0::BIGINT,
    0::DECIMAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- MONITORING AND ALERTING SETUP
-- ============================================================================

-- Table for performance monitoring
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type VARCHAR(100) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  value DECIMAL(10,4) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  dimensions JSONB DEFAULT '{}',
  entity_type VARCHAR(100),
  entity_id UUID,
  user_id UUID REFERENCES users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type_time 
ON performance_metrics(metric_type, metric_name, timestamp DESC);

-- Function to record performance metrics
CREATE OR REPLACE FUNCTION record_performance_metric(
  p_metric_type TEXT,
  p_metric_name TEXT,
  p_value DECIMAL,
  p_unit TEXT DEFAULT 'count',
  p_dimensions JSONB DEFAULT '{}',
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO performance_metrics (
    metric_type, metric_name, value, unit, dimensions, 
    entity_type, entity_id, user_id
  ) VALUES (
    p_metric_type, p_metric_name, p_value, p_unit, p_dimensions,
    p_entity_type, p_entity_id, auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- DATABASE MAINTENANCE SCHEDULE
-- ============================================================================

-- Note: These would typically be set up as cron jobs or scheduled tasks

-- Daily maintenance (run at 2 AM)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_capability_stats;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_organization_stats;

-- Weekly maintenance (run on Sunday at 3 AM)
-- SELECT refresh_materialized_views();
-- SELECT maintain_vector_index();
-- ANALYZE; -- Update table statistics

-- Monthly maintenance (run on 1st of month at 4 AM)
-- SELECT cleanup_old_activity_logs();
-- VACUUM ANALYZE; -- Reclaim space and update statistics

-- Quarterly maintenance
-- REINDEX INDEX CONCURRENTLY idx_documents_vector_optimized;
-- CLUSTER documents USING idx_documents_vector_optimized; -- Only if needed