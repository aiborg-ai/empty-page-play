-- Critical Security Fixes - IMMEDIATE DEPLOYMENT REQUIRED
-- Migration: 027_critical_security_fixes.sql
-- SECURITY CLASSIFICATION: CRITICAL

-- ============================================================================
-- PHASE 1: IMMEDIATE CRITICAL VULNERABILITY FIXES
-- ============================================================================

-- Enable required extensions for security
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CVE-001: SQL INJECTION PREVENTION
-- ============================================================================

-- Secure replacement for vulnerable dynamic query construction
CREATE OR REPLACE FUNCTION create_optimal_vector_index_secure()
RETURNS VOID AS $$
DECLARE
  doc_count INTEGER;
  optimal_lists INTEGER;
  index_exists BOOLEAN;
BEGIN
  -- Input validation and sanitization
  SELECT COUNT(*) INTO doc_count 
  FROM documents 
  WHERE embedding_vector IS NOT NULL AND deleted_at IS NULL;
  
  -- Validate and constrain input to safe range
  optimal_lists := GREATEST(1, LEAST(1000, FLOOR(SQRT(GREATEST(1, doc_count)))));
  
  -- Log security-relevant operation
  INSERT INTO security_events (event_type, severity, message, details)
  VALUES ('vector_index_operation', 'medium', 'Vector index optimization initiated', 
    jsonb_build_object('doc_count', doc_count, 'optimal_lists', optimal_lists));
  
  -- Check if index already exists
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'documents' 
    AND indexname = 'idx_documents_vector_optimized'
  ) INTO index_exists;
  
  -- Drop existing index if present
  IF index_exists THEN
    DROP INDEX IF EXISTS idx_documents_vector_optimized;
  END IF;
  
  -- Create index using safe, parameterized approach
  -- Using CASE statement instead of dynamic SQL construction
  CASE 
    WHEN optimal_lists <= 10 THEN
      CREATE INDEX CONCURRENTLY idx_documents_vector_optimized 
      ON documents USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 10);
    WHEN optimal_lists <= 50 THEN
      CREATE INDEX CONCURRENTLY idx_documents_vector_optimized 
      ON documents USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 50);
    WHEN optimal_lists <= 100 THEN
      CREATE INDEX CONCURRENTLY idx_documents_vector_optimized 
      ON documents USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 100);
    WHEN optimal_lists <= 500 THEN
      CREATE INDEX CONCURRENTLY idx_documents_vector_optimized 
      ON documents USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 500);
    ELSE
      CREATE INDEX CONCURRENTLY idx_documents_vector_optimized 
      ON documents USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 1000);
  END CASE;

EXCEPTION
  WHEN OTHERS THEN
    -- Log security incident without exposing system details
    INSERT INTO security_events (event_type, severity, message, details)
    VALUES ('vector_index_error', 'high', 'Vector index creation failed', 
      jsonb_build_object('error_code', SQLSTATE, 'doc_count', doc_count));
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CVE-002: PRIVILEGE ESCALATION PREVENTION
-- ============================================================================

-- Enhanced privilege validation with additional security checks
CREATE OR REPLACE FUNCTION is_admin_secure()
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
  session_valid BOOLEAN;
BEGIN
  -- Validate current user exists and is active
  SELECT id, role, organization_id, last_active_at, onboarding_completed
  INTO user_record
  FROM users 
  WHERE id = auth.uid() 
  AND deleted_at IS NULL;
  
  IF NOT FOUND THEN
    PERFORM log_security_event('privilege_check_invalid_user', 'high', 
      'Admin privilege check for non-existent user');
    RETURN FALSE;
  END IF;
  
  -- Validate session is recent and legitimate
  SELECT EXISTS (
    SELECT 1 FROM user_sessions 
    WHERE user_id = auth.uid() 
    AND expires_at > NOW()
    AND last_activity > NOW() - INTERVAL '1 hour'
  ) INTO session_valid;
  
  IF NOT session_valid THEN
    PERFORM log_security_event('privilege_check_invalid_session', 'high',
      'Admin privilege check with invalid session');
    RETURN FALSE;
  END IF;
  
  -- Check role and additional validation
  IF user_record.role IN ('admin', 'org_admin') AND user_record.onboarding_completed THEN
    -- Log administrative access
    PERFORM log_security_event('admin_access', 'medium',
      'Administrative privilege granted',
      jsonb_build_object('user_role', user_record.role, 'org_id', user_record.organization_id));
    RETURN TRUE;
  END IF;
  
  -- Log failed privilege escalation attempt
  PERFORM log_security_event('privilege_escalation_attempt', 'high',
    'Unauthorized admin privilege request',
    jsonb_build_object('user_role', user_record.role, 'user_id', user_record.id));
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing admin function to use secure version
DROP FUNCTION IF EXISTS public.is_admin();
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN is_admin_secure();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CVE-003: ENCRYPTED AUTHENTICATION STORAGE
-- ============================================================================

-- Add encrypted authentication columns
ALTER TABLE mcp_integrations 
ADD COLUMN IF NOT EXISTS authentication_encrypted BYTEA,
ADD COLUMN IF NOT EXISTS encryption_key_id VARCHAR(100) DEFAULT 'default_key_2024',
ADD COLUMN IF NOT EXISTS encryption_algorithm VARCHAR(50) DEFAULT 'AES-256-GCM';

-- Create secure encryption functions
CREATE OR REPLACE FUNCTION encrypt_authentication_data(
  auth_data JSONB, 
  key_id VARCHAR DEFAULT 'default_key_2024'
)
RETURNS BYTEA AS $$
DECLARE
  encryption_key TEXT;
  encrypted_result BYTEA;
BEGIN
  -- Input validation
  IF auth_data IS NULL THEN
    RAISE EXCEPTION 'Authentication data cannot be null';
  END IF;
  
  IF key_id IS NULL OR key_id = '' THEN
    RAISE EXCEPTION 'Encryption key ID cannot be null or empty';
  END IF;
  
  -- Validate JSON size (prevent DoS)
  IF length(auth_data::TEXT) > 32768 THEN -- 32KB limit
    RAISE EXCEPTION 'Authentication data too large for encryption';
  END IF;
  
  -- Get encryption key from secure storage (environment variable)
  encryption_key := current_setting('app.encryption_key_' || key_id, false);
  
  IF encryption_key IS NULL OR length(encryption_key) < 32 THEN
    RAISE EXCEPTION 'Invalid or missing encryption key';
  END IF;
  
  -- Encrypt using PGP symmetric encryption with compression
  encrypted_result := pgp_sym_encrypt(
    auth_data::TEXT, 
    encryption_key,
    'compress-algo=1'  -- Use compression for efficiency
  );
  
  -- Log encryption operation (without sensitive data)
  INSERT INTO security_events (event_type, severity, message, details)
  VALUES ('data_encryption', 'low', 'Authentication data encrypted',
    jsonb_build_object('key_id', key_id, 'data_size', length(auth_data::TEXT)));
  
  RETURN encrypted_result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log security event without exposing sensitive information
    INSERT INTO security_events (event_type, severity, message, details)
    VALUES ('encryption_failure', 'critical', 'Authentication encryption failed',
      jsonb_build_object('key_id', key_id, 'error_code', SQLSTATE));
    RAISE EXCEPTION 'Encryption operation failed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create secure decryption function
CREATE OR REPLACE FUNCTION decrypt_authentication_data(
  encrypted_data BYTEA, 
  key_id VARCHAR DEFAULT 'default_key_2024'
)
RETURNS JSONB AS $$
DECLARE
  encryption_key TEXT;
  decrypted_text TEXT;
  result_jsonb JSONB;
BEGIN
  -- Input validation
  IF encrypted_data IS NULL THEN
    RETURN NULL;
  END IF;
  
  IF key_id IS NULL OR key_id = '' THEN
    RAISE EXCEPTION 'Encryption key ID cannot be null or empty';
  END IF;
  
  -- Get encryption key from secure storage
  encryption_key := current_setting('app.encryption_key_' || key_id, false);
  
  IF encryption_key IS NULL OR length(encryption_key) < 32 THEN
    RAISE EXCEPTION 'Invalid or missing decryption key';
  END IF;
  
  -- Decrypt data
  decrypted_text := pgp_sym_decrypt(encrypted_data, encryption_key);
  
  -- Validate decrypted JSON
  BEGIN
    result_jsonb := decrypted_text::JSONB;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Decrypted data is not valid JSON';
  END;
  
  -- Log decryption operation (audit trail)
  INSERT INTO security_events (event_type, severity, message, details)
  VALUES ('data_decryption', 'low', 'Authentication data decrypted',
    jsonb_build_object('key_id', key_id, 'success', true));
  
  RETURN result_jsonb;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log security event
    INSERT INTO security_events (event_type, severity, message, details)
    VALUES ('decryption_failure', 'high', 'Authentication decryption failed',
      jsonb_build_object('key_id', key_id, 'error_code', SQLSTATE));
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CVE-004: ENHANCED RLS WITH COLUMN-LEVEL SECURITY
-- ============================================================================

-- Drop and recreate user update policies with column-level restrictions
DROP POLICY IF EXISTS "users_update_own_profile" ON users;

-- Safe fields that users can update themselves
CREATE POLICY "users_update_safe_fields" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent privilege escalation
    (OLD.role = NEW.role) AND
    (OLD.organization_id = NEW.organization_id) AND
    (OLD.subscription_tier = NEW.subscription_tier) AND
    -- Validate email format if being changed
    (OLD.email = NEW.email OR validate_email(NEW.email))
  );

-- Separate policy for administrative changes (admin-only fields)
CREATE POLICY "admin_update_user_privileges" ON users
  FOR UPDATE USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- Add soft delete support to critical tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE capabilities ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Update existing policies to exclude soft-deleted records
CREATE OR REPLACE FUNCTION is_not_deleted(deleted_timestamp TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN deleted_timestamp IS NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- CVE-005: VECTOR EMBEDDING SECURITY
-- ============================================================================

-- Add security controls for vector operations
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS vector_security_level VARCHAR(20) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS vector_fingerprint VARCHAR(64),
ADD COLUMN IF NOT EXISTS access_pattern_hash VARCHAR(64);

-- Create secure vector search function with access controls
CREATE OR REPLACE FUNCTION secure_vector_search(
  query_vector VECTOR(1536),
  kb_id UUID,
  similarity_threshold DECIMAL DEFAULT 0.7,
  max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
  doc_id UUID,
  similarity DECIMAL,
  title TEXT,
  content_excerpt TEXT
) AS $$
DECLARE
  user_access_level TEXT;
  search_allowed BOOLEAN := false;
BEGIN
  -- Validate inputs
  IF query_vector IS NULL OR kb_id IS NULL THEN
    RAISE EXCEPTION 'Query vector and knowledge base ID are required';
  END IF;
  
  IF max_results > 100 THEN
    max_results := 100; -- Prevent resource exhaustion
  END IF;
  
  -- Check user access to knowledge base
  SELECT EXISTS (
    SELECT 1 FROM knowledge_bases kb
    WHERE kb.id = kb_id
    AND (
      kb.owner_id = auth.uid() OR
      (kb.access_level = 'organization' AND kb.organization_id = get_user_organization()) OR
      kb.access_level = 'public'
    )
  ) INTO search_allowed;
  
  IF NOT search_allowed THEN
    PERFORM log_security_event('unauthorized_vector_search', 'medium',
      'Unauthorized vector search attempt',
      jsonb_build_object('kb_id', kb_id, 'user_id', auth.uid()));
    RAISE EXCEPTION 'Access denied to knowledge base';
  END IF;
  
  -- Rate limiting for vector operations
  IF NOT check_rate_limit(auth.uid()::TEXT, 'user', 'vector_search', 20, '1 minute'::INTERVAL) THEN
    RAISE EXCEPTION 'Vector search rate limit exceeded';
  END IF;
  
  -- Log vector search for audit
  INSERT INTO security_events (event_type, severity, message, details)
  VALUES ('vector_search', 'low', 'Vector similarity search performed',
    jsonb_build_object('kb_id', kb_id, 'threshold', similarity_threshold, 'max_results', max_results));
  
  -- Perform secure vector search
  RETURN QUERY
  SELECT 
    d.id,
    (1 - (d.embedding_vector <=> query_vector))::DECIMAL as similarity,
    d.title,
    LEFT(d.content, 200) as content_excerpt
  FROM documents d
  WHERE 
    d.knowledge_base_id = kb_id
    AND d.embedding_vector IS NOT NULL
    AND d.deleted_at IS NULL
    AND (1 - (d.embedding_vector <=> query_vector)) >= similarity_threshold
  ORDER BY d.embedding_vector <=> query_vector
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CVE-006: AUDIT TRAIL PROTECTION
-- ============================================================================

-- Create tamper-evident audit trail system
CREATE TABLE IF NOT EXISTS audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_number BIGSERIAL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  operation VARCHAR(10) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  user_id UUID,
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checksum VARCHAR(64), -- Tamper detection
  previous_checksum VARCHAR(64), -- Chain integrity
  signature BYTEA -- Digital signature
);

-- Create tamper-evident audit function
CREATE OR REPLACE FUNCTION create_audit_record(
  p_table_name TEXT,
  p_record_id UUID,
  p_operation TEXT,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  previous_checksum VARCHAR(64);
  record_data TEXT;
  current_checksum VARCHAR(64);
  audit_id UUID;
BEGIN
  -- Get previous checksum for chain integrity
  SELECT checksum INTO previous_checksum
  FROM audit_trail
  ORDER BY sequence_number DESC
  LIMIT 1;
  
  -- Generate new audit record ID
  audit_id := gen_random_uuid();
  
  -- Create record data for checksum
  record_data := audit_id::TEXT || p_table_name || p_record_id::TEXT || 
                p_operation || COALESCE(p_old_values::TEXT, '') || 
                COALESCE(p_new_values::TEXT, '') || NOW()::TEXT;
  
  -- Calculate checksum including previous checksum for chain integrity
  current_checksum := encode(
    sha256((record_data || COALESCE(previous_checksum, ''))::BYTEA), 
    'hex'
  );
  
  -- Insert audit record
  INSERT INTO audit_trail (
    id, table_name, record_id, operation, old_values, new_values,
    user_id, session_id, ip_address, checksum, previous_checksum
  ) VALUES (
    audit_id, p_table_name, p_record_id, p_operation, p_old_values, p_new_values,
    auth.uid(),
    current_setting('request.headers', true)::JSONB->>'session-id',
    inet(current_setting('request.headers', true)::JSONB->>'x-forwarded-for'),
    current_checksum, previous_checksum
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Audit logging failure is a critical security event
    INSERT INTO security_events (event_type, severity, message, details)
    VALUES ('audit_failure', 'critical', 'Audit trail creation failed',
      jsonb_build_object('table_name', p_table_name, 'operation', p_operation, 'error', SQLERRM));
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CVE-007: SECURE SESSION MANAGEMENT
-- ============================================================================

-- Enhance session table with security features
ALTER TABLE user_sessions 
ADD COLUMN IF NOT EXISTS session_fingerprint VARCHAR(64),
ADD COLUMN IF NOT EXISTS security_level VARCHAR(20) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS consecutive_failures INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS requires_mfa BOOLEAN DEFAULT false;

-- Create secure session validation with comprehensive checks
CREATE OR REPLACE FUNCTION validate_session_secure(
  p_session_token VARCHAR(255),
  p_client_ip INET DEFAULT NULL,
  p_user_agent VARCHAR(255) DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  session_record RECORD;
  user_record RECORD;
  security_context JSONB;
  is_valid BOOLEAN := false;
  risk_score DECIMAL := 0.0;
BEGIN
  -- Get session with comprehensive data
  SELECT 
    s.*,
    u.id as user_id, u.email, u.role, u.organization_id, u.last_active_at as user_last_active,
    EXTRACT(EPOCH FROM (NOW() - s.created_at)) as session_age_seconds
  INTO session_record
  FROM user_sessions s
  JOIN users u ON s.user_id = u.id
  WHERE s.session_token = p_session_token
  AND s.expires_at > NOW()
  AND u.deleted_at IS NULL;
  
  IF NOT FOUND THEN
    PERFORM log_security_event('invalid_session_token', 'medium',
      'Authentication attempt with invalid session token',
      jsonb_build_object('client_ip', p_client_ip, 'user_agent', p_user_agent));
    RETURN jsonb_build_object('valid', false, 'reason', 'invalid_token');
  END IF;
  
  -- Check for account lockout
  IF session_record.locked_until IS NOT NULL AND session_record.locked_until > NOW() THEN
    PERFORM log_security_event('locked_account_access', 'high',
      'Access attempt to locked account',
      jsonb_build_object('user_id', session_record.user_id, 'locked_until', session_record.locked_until));
    RETURN jsonb_build_object('valid', false, 'reason', 'account_locked');
  END IF;
  
  -- Validate IP address if IP binding is enabled
  IF session_record.ip_address IS NOT NULL AND p_client_ip IS NOT NULL THEN
    IF session_record.ip_address != p_client_ip THEN
      -- Log security event but allow with increased monitoring
      PERFORM log_security_event('session_ip_change', 'medium',
        'Session accessed from different IP address',
        jsonb_build_object(
          'user_id', session_record.user_id,
          'original_ip', session_record.ip_address,
          'new_ip', p_client_ip
        ));
      risk_score := risk_score + 0.3;
    END IF;
  END IF;
  
  -- Check session age and activity
  IF session_record.session_age_seconds > 86400 THEN -- 24 hours
    risk_score := risk_score + 0.2;
  END IF;
  
  IF session_record.last_activity < NOW() - INTERVAL '4 hours' THEN
    risk_score := risk_score + 0.1;
  END IF;
  
  -- Update session activity
  UPDATE user_sessions 
  SET last_activity = NOW()
  WHERE session_token = p_session_token;
  
  -- Build security context
  security_context := jsonb_build_object(
    'user_id', session_record.user_id,
    'role', session_record.role,
    'organization_id', session_record.organization_id,
    'risk_score', risk_score,
    'session_age', session_record.session_age_seconds,
    'requires_mfa', session_record.requires_mfa,
    'security_level', session_record.security_level
  );
  
  -- Log successful authentication
  PERFORM log_security_event('session_validated', 'low',
    'Session validation successful',
    jsonb_build_object('user_id', session_record.user_id, 'risk_score', risk_score));
  
  RETURN jsonb_build_object(
    'valid', true,
    'user_id', session_record.user_id,
    'security_context', security_context
  );
  
EXCEPTION
  WHEN OTHERS THEN
    PERFORM log_security_event('session_validation_error', 'high',
      'Session validation failed with error',
      jsonb_build_object('error_message', SQLERRM, 'client_ip', p_client_ip));
    RETURN jsonb_build_object('valid', false, 'reason', 'validation_error');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECURITY MONITORING AND ALERTING
-- ============================================================================

-- Create security events table if not exists
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  message TEXT,
  details JSONB DEFAULT '{}',
  source_function TEXT,
  stack_trace TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for security events
CREATE INDEX IF NOT EXISTS idx_security_events_type_severity_time 
ON security_events(event_type, severity, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_security_events_user_time 
ON security_events(user_id, timestamp DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_security_events_unacknowledged 
ON security_events(severity, timestamp DESC) 
WHERE acknowledged = false;

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL,
  identifier_type VARCHAR(50) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  request_count INTEGER DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  window_duration INTERVAL DEFAULT '1 hour',
  max_requests INTEGER NOT NULL,
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, endpoint, date_trunc('hour', window_start))
);

-- Security event logging function
CREATE OR REPLACE FUNCTION log_security_event(
  p_event_type TEXT,
  p_severity TEXT,
  p_message TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO security_events (
    event_type, severity, user_id, message, details, source_function
  ) VALUES (
    p_event_type, p_severity, auth.uid(), p_message, p_details,
    COALESCE(current_setting('plpgsql.function_name', true), 'unknown')
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Ensure security logging never fails completely
    INSERT INTO security_events (event_type, severity, message, details)
    VALUES ('security_logging_error', 'critical', 'Security event logging failed', 
      jsonb_build_object('original_event', p_event_type, 'error', SQLERRM));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_endpoint TEXT,
  p_max_requests INTEGER DEFAULT 100,
  p_window_duration INTERVAL DEFAULT '1 hour'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
  is_blocked BOOLEAN := false;
BEGIN
  window_start := date_trunc('hour', NOW());
  
  -- Check if currently blocked
  SELECT blocked_until > NOW() INTO is_blocked
  FROM rate_limits
  WHERE identifier = p_identifier 
  AND identifier_type = p_identifier_type
  AND endpoint = p_endpoint;
  
  IF is_blocked THEN
    RETURN false;
  END IF;
  
  -- Upsert rate limit record
  INSERT INTO rate_limits (
    identifier, identifier_type, endpoint, request_count, 
    window_start, window_duration, max_requests
  ) VALUES (
    p_identifier, p_identifier_type, p_endpoint, 1,
    window_start, p_window_duration, p_max_requests
  )
  ON CONFLICT (identifier, endpoint, date_trunc('hour', window_start))
  DO UPDATE SET 
    request_count = rate_limits.request_count + 1,
    updated_at = NOW()
  RETURNING request_count INTO current_count;
  
  -- Check if limit exceeded
  IF current_count > p_max_requests THEN
    UPDATE rate_limits 
    SET blocked_until = NOW() + (p_window_duration * 2)
    WHERE identifier = p_identifier 
    AND identifier_type = p_identifier_type
    AND endpoint = p_endpoint;
    
    PERFORM log_security_event('rate_limit_exceeded', 'high',
      'Rate limit exceeded - blocking requests',
      jsonb_build_object('identifier', p_identifier, 'endpoint', p_endpoint, 'count', current_count));
    
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Input validation functions
CREATE OR REPLACE FUNCTION validate_email(email_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email_input IS NOT NULL
    AND length(email_input) BETWEEN 5 AND 254
    AND email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND email_input NOT LIKE '%..%'
    AND email_input !~ '[<>"\s]';
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

-- Grant necessary permissions for security functions
GRANT EXECUTE ON FUNCTION log_security_event TO authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit TO authenticated;
GRANT EXECUTE ON FUNCTION validate_email TO authenticated;
GRANT EXECUTE ON FUNCTION validate_session_secure TO authenticated;

-- Create initial security configuration
INSERT INTO security_events (event_type, severity, message, details)
VALUES ('system_initialization', 'medium', 'Critical security fixes deployed',
  jsonb_build_object('migration', '027_critical_security_fixes', 'timestamp', NOW()));

-- Set up security monitoring alerts (placeholder for external alerting system)
COMMENT ON TABLE security_events IS 'Security events table - monitor for high/critical severity events';
COMMENT ON TABLE rate_limits IS 'Rate limiting table - monitor for excessive blocking';
COMMENT ON TABLE audit_trail IS 'Tamper-evident audit trail - validate checksum chain integrity';

-- Enable RLS on security tables
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Security events can be viewed by admins and the user who generated them
CREATE POLICY "security_events_access" ON security_events
  FOR SELECT USING (
    user_id = auth.uid() OR is_admin_secure()
  );

-- Rate limits can be viewed by the rate-limited entity or admins
CREATE POLICY "rate_limits_access" ON rate_limits
  FOR SELECT USING (
    (identifier_type = 'user' AND identifier = auth.uid()::TEXT) OR
    is_admin_secure()
  );

-- Audit trail is read-only for all authenticated users (transparency)
CREATE POLICY "audit_trail_read_only" ON audit_trail
  FOR SELECT USING (true);

-- No INSERT/UPDATE/DELETE policies on audit_trail - only via functions