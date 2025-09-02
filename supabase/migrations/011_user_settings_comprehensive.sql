-- Comprehensive User Settings Schema
-- Extends the existing users table with detailed settings management

-- Create user_settings table for structured settings storage
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Account Settings
    use_type TEXT DEFAULT 'non-commercial' CHECK (use_type IN ('non-commercial', 'commercial')),
    make_profile_public BOOLEAN DEFAULT false,
    record_search_history BOOLEAN DEFAULT true,
    
    -- Interface Settings
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'vanilla', 'contrast')),
    beta_features BOOLEAN DEFAULT false,
    
    -- AI Settings
    llm_provider TEXT DEFAULT 'openai' CHECK (llm_provider IN ('openai', 'openrouter', 'anthropic', 'google', 'cohere')),
    default_ai_model TEXT,
    default_context_scope TEXT DEFAULT 'search-results' CHECK (default_context_scope IN ('search-results', 'projects', 'reports', 'dashboards', 'patent-corpus')),
    save_chat_history BOOLEAN DEFAULT true,
    auto_clear_sensitive_data BOOLEAN DEFAULT false,
    
    -- API Keys (encrypted storage)
    api_keys JSONB DEFAULT '{}', -- Stores encrypted API keys for different providers
    
    -- Agent Settings
    auto_analysis BOOLEAN DEFAULT true,
    smart_suggestions BOOLEAN DEFAULT true,
    contextual_help BOOLEAN DEFAULT false,
    batch_processing BOOLEAN DEFAULT false,
    primary_analysis_model TEXT,
    batch_processing_model TEXT,
    daily_spending_limit NUMERIC DEFAULT 10.00,
    email_notifications_usage BOOLEAN DEFAULT true,
    
    -- Payment & Billing Settings
    auto_renew_subscriptions BOOLEAN DEFAULT true,
    email_receipts BOOLEAN DEFAULT true,
    usage_based_billing_alerts BOOLEAN DEFAULT false,
    
    -- Privacy Settings
    allow_error_reports BOOLEAN DEFAULT true,
    opt_out_analytics BOOLEAN DEFAULT false,
    default_access_level TEXT DEFAULT 'restricted' CHECK (default_access_level IN ('restricted', 'limited', 'public')),
    
    -- Security Settings
    two_factor_enabled BOOLEAN DEFAULT false,
    session_timeout INTEGER DEFAULT 7200, -- seconds
    login_notifications BOOLEAN DEFAULT true,
    suspicious_activity_alerts BOOLEAN DEFAULT true,
    
    -- Notification Preferences
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    slack_notifications BOOLEAN DEFAULT false,
    notification_frequency TEXT DEFAULT 'daily' CHECK (notification_frequency IN ('immediate', 'daily', 'weekly', 'monthly')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on user_id (one settings record per user)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_settings_llm_provider ON public.user_settings(llm_provider);
CREATE INDEX IF NOT EXISTS idx_user_settings_theme ON public.user_settings(theme);
CREATE INDEX IF NOT EXISTS idx_user_settings_updated_at ON public.user_settings(updated_at);

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings" 
    ON public.user_settings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" 
    ON public.user_settings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
    ON public.user_settings FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" 
    ON public.user_settings FOR DELETE 
    USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_user_settings_updated_at();

-- API Keys encryption functions
CREATE OR REPLACE FUNCTION encrypt_api_key(api_key TEXT, user_id UUID)
RETURNS TEXT AS $$
BEGIN
    -- Simple encryption using pgcrypto - in production, use more sophisticated encryption
    RETURN encode(encrypt(api_key::bytea, user_id::text, 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_api_key(encrypted_key TEXT, user_id UUID)
RETURNS TEXT AS $$
BEGIN
    -- Decrypt API key - only if the user requesting is the owner
    IF auth.uid() = user_id THEN
        RETURN convert_from(decrypt(decode(encrypted_key, 'base64'), user_id::text, 'aes'), 'UTF8');
    ELSE
        RAISE EXCEPTION 'Unauthorized access to API key';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create default settings for new users
CREATE OR REPLACE FUNCTION create_default_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_settings (
        user_id,
        use_type,
        theme,
        llm_provider,
        default_ai_model,
        default_context_scope,
        daily_spending_limit
    ) VALUES (
        NEW.id,
        COALESCE((NEW.raw_user_meta_data->>'use_type'), 'non-commercial'),
        'light',
        'openai',
        'gpt-4o-mini',
        'search-results',
        10.00
    ) ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default settings when a new user is created
CREATE TRIGGER trigger_create_default_user_settings
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_user_settings();

-- Create settings history table for audit trail
CREATE TABLE IF NOT EXISTS public.user_settings_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    setting_name TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    changed_by UUID REFERENCES auth.users(id),
    change_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for settings history
CREATE INDEX IF NOT EXISTS idx_user_settings_history_user_id ON public.user_settings_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_history_created_at ON public.user_settings_history(user_id, created_at DESC);

-- Enable RLS on settings history
ALTER TABLE public.user_settings_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy for settings history
CREATE POLICY "Users can view own settings history" 
    ON public.user_settings_history FOR SELECT 
    USING (auth.uid() = user_id);

-- Function to log settings changes
CREATE OR REPLACE FUNCTION log_settings_change()
RETURNS TRIGGER AS $$
DECLARE
    col_name TEXT;
    old_val JSONB;
    new_val JSONB;
BEGIN
    -- Only log for updates, not inserts
    IF TG_OP = 'UPDATE' THEN
        -- Check each column for changes and log them
        FOR col_name IN 
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'user_settings' 
            AND column_name NOT IN ('id', 'user_id', 'created_at', 'updated_at')
        LOOP
            EXECUTE format('SELECT to_jsonb($1.%I), to_jsonb($2.%I)', col_name, col_name) 
            USING OLD, NEW INTO old_val, new_val;
            
            IF old_val IS DISTINCT FROM new_val THEN
                INSERT INTO public.user_settings_history (
                    user_id, setting_name, old_value, new_value, changed_by
                ) VALUES (
                    NEW.user_id, col_name, old_val, new_val, auth.uid()
                );
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log settings changes
CREATE TRIGGER trigger_log_settings_changes
    AFTER UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION log_settings_change();

-- Create default settings for existing demo users
INSERT INTO public.user_settings (
    user_id, use_type, theme, llm_provider, default_ai_model, 
    make_profile_public, record_search_history, daily_spending_limit
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000', -- demo@innospot.com
    'non-commercial', 'light', 'openai', 'gpt-4o-mini', 
    false, true, 10.00
),
(
    '550e8400-e29b-41d4-a716-446655440001', -- researcher@innospot.com
    'non-commercial', 'light', 'anthropic', 'claude-3-5-sonnet-20241022',
    true, true, 15.00
),
(
    '550e8400-e29b-41d4-a716-446655440002', -- commercial@innospot.com
    'commercial', 'dark', 'openai', 'gpt-4o',
    false, false, 50.00
) ON CONFLICT (user_id) DO UPDATE SET
    updated_at = NOW();

-- Create view for easy settings access with decrypted API keys
CREATE OR REPLACE VIEW user_settings_with_keys AS
SELECT 
    us.*,
    CASE 
        WHEN us.user_id = auth.uid() THEN us.api_keys
        ELSE NULL
    END as decrypted_api_keys
FROM public.user_settings us;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings_history TO authenticated;
GRANT SELECT ON user_settings_with_keys TO authenticated;

-- Create helpful functions for the application

-- Get user settings with defaults
CREATE OR REPLACE FUNCTION get_user_settings(target_user_id UUID DEFAULT NULL)
RETURNS TABLE(
    id UUID,
    user_id UUID,
    use_type TEXT,
    make_profile_public BOOLEAN,
    record_search_history BOOLEAN,
    theme TEXT,
    beta_features BOOLEAN,
    llm_provider TEXT,
    default_ai_model TEXT,
    default_context_scope TEXT,
    save_chat_history BOOLEAN,
    auto_clear_sensitive_data BOOLEAN,
    api_keys JSONB,
    auto_analysis BOOLEAN,
    smart_suggestions BOOLEAN,
    contextual_help BOOLEAN,
    batch_processing BOOLEAN,
    primary_analysis_model TEXT,
    batch_processing_model TEXT,
    daily_spending_limit NUMERIC,
    email_notifications_usage BOOLEAN,
    auto_renew_subscriptions BOOLEAN,
    email_receipts BOOLEAN,
    usage_based_billing_alerts BOOLEAN,
    allow_error_reports BOOLEAN,
    opt_out_analytics BOOLEAN,
    default_access_level TEXT,
    two_factor_enabled BOOLEAN,
    session_timeout INTEGER,
    login_notifications BOOLEAN,
    suspicious_activity_alerts BOOLEAN,
    email_notifications BOOLEAN,
    push_notifications BOOLEAN,
    slack_notifications BOOLEAN,
    notification_frequency TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
DECLARE
    lookup_user_id UUID;
BEGIN
    lookup_user_id := COALESCE(target_user_id, auth.uid());
    
    -- Ensure user can only access their own settings
    IF lookup_user_id != auth.uid() THEN
        RAISE EXCEPTION 'Access denied: Cannot access other user settings';
    END IF;
    
    RETURN QUERY
    SELECT us.* FROM public.user_settings us 
    WHERE us.user_id = lookup_user_id;
    
    -- If no settings found, return defaults
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            uuid_generate_v4(), lookup_user_id, 'non-commercial'::TEXT, false, true,
            'light'::TEXT, false, 'openai'::TEXT, 'gpt-4o-mini'::TEXT, 'search-results'::TEXT,
            true, false, '{}'::JSONB, true, true, false, false,
            NULL::TEXT, NULL::TEXT, 10.00, true, true, true, false,
            true, false, 'restricted'::TEXT, false, 7200, true, true,
            true, true, false, 'daily'::TEXT, NOW(), NOW();
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user settings function
CREATE OR REPLACE FUNCTION update_user_settings(settings_json JSONB)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN QUERY SELECT false, 'User not authenticated';
        RETURN;
    END IF;
    
    -- Insert or update user settings
    INSERT INTO public.user_settings (
        user_id,
        use_type,
        make_profile_public,
        record_search_history,
        theme,
        beta_features,
        llm_provider,
        default_ai_model,
        default_context_scope,
        save_chat_history,
        auto_clear_sensitive_data,
        api_keys,
        auto_analysis,
        smart_suggestions,
        contextual_help,
        batch_processing,
        primary_analysis_model,
        batch_processing_model,
        daily_spending_limit,
        email_notifications_usage,
        auto_renew_subscriptions,
        email_receipts,
        usage_based_billing_alerts,
        allow_error_reports,
        opt_out_analytics,
        default_access_level,
        two_factor_enabled,
        session_timeout,
        login_notifications,
        suspicious_activity_alerts,
        email_notifications,
        push_notifications,
        slack_notifications,
        notification_frequency
    ) VALUES (
        current_user_id,
        COALESCE(settings_json->>'use_type', 'non-commercial'),
        COALESCE((settings_json->>'make_profile_public')::boolean, false),
        COALESCE((settings_json->>'record_search_history')::boolean, true),
        COALESCE(settings_json->>'theme', 'light'),
        COALESCE((settings_json->>'beta_features')::boolean, false),
        COALESCE(settings_json->>'llm_provider', 'openai'),
        settings_json->>'default_ai_model',
        COALESCE(settings_json->>'default_context_scope', 'search-results'),
        COALESCE((settings_json->>'save_chat_history')::boolean, true),
        COALESCE((settings_json->>'auto_clear_sensitive_data')::boolean, false),
        COALESCE(settings_json->'api_keys', '{}'::jsonb),
        COALESCE((settings_json->>'auto_analysis')::boolean, true),
        COALESCE((settings_json->>'smart_suggestions')::boolean, true),
        COALESCE((settings_json->>'contextual_help')::boolean, false),
        COALESCE((settings_json->>'batch_processing')::boolean, false),
        settings_json->>'primary_analysis_model',
        settings_json->>'batch_processing_model',
        COALESCE((settings_json->>'daily_spending_limit')::numeric, 10.00),
        COALESCE((settings_json->>'email_notifications_usage')::boolean, true),
        COALESCE((settings_json->>'auto_renew_subscriptions')::boolean, true),
        COALESCE((settings_json->>'email_receipts')::boolean, true),
        COALESCE((settings_json->>'usage_based_billing_alerts')::boolean, false),
        COALESCE((settings_json->>'allow_error_reports')::boolean, true),
        COALESCE((settings_json->>'opt_out_analytics')::boolean, false),
        COALESCE(settings_json->>'default_access_level', 'restricted'),
        COALESCE((settings_json->>'two_factor_enabled')::boolean, false),
        COALESCE((settings_json->>'session_timeout')::integer, 7200),
        COALESCE((settings_json->>'login_notifications')::boolean, true),
        COALESCE((settings_json->>'suspicious_activity_alerts')::boolean, true),
        COALESCE((settings_json->>'email_notifications')::boolean, true),
        COALESCE((settings_json->>'push_notifications')::boolean, true),
        COALESCE((settings_json->>'slack_notifications')::boolean, false),
        COALESCE(settings_json->>'notification_frequency', 'daily')
    )
    ON CONFLICT (user_id) DO UPDATE SET
        use_type = COALESCE(EXCLUDED.use_type, user_settings.use_type),
        make_profile_public = COALESCE(EXCLUDED.make_profile_public, user_settings.make_profile_public),
        record_search_history = COALESCE(EXCLUDED.record_search_history, user_settings.record_search_history),
        theme = COALESCE(EXCLUDED.theme, user_settings.theme),
        beta_features = COALESCE(EXCLUDED.beta_features, user_settings.beta_features),
        llm_provider = COALESCE(EXCLUDED.llm_provider, user_settings.llm_provider),
        default_ai_model = COALESCE(EXCLUDED.default_ai_model, user_settings.default_ai_model),
        default_context_scope = COALESCE(EXCLUDED.default_context_scope, user_settings.default_context_scope),
        save_chat_history = COALESCE(EXCLUDED.save_chat_history, user_settings.save_chat_history),
        auto_clear_sensitive_data = COALESCE(EXCLUDED.auto_clear_sensitive_data, user_settings.auto_clear_sensitive_data),
        api_keys = COALESCE(EXCLUDED.api_keys, user_settings.api_keys),
        auto_analysis = COALESCE(EXCLUDED.auto_analysis, user_settings.auto_analysis),
        smart_suggestions = COALESCE(EXCLUDED.smart_suggestions, user_settings.smart_suggestions),
        contextual_help = COALESCE(EXCLUDED.contextual_help, user_settings.contextual_help),
        batch_processing = COALESCE(EXCLUDED.batch_processing, user_settings.batch_processing),
        primary_analysis_model = COALESCE(EXCLUDED.primary_analysis_model, user_settings.primary_analysis_model),
        batch_processing_model = COALESCE(EXCLUDED.batch_processing_model, user_settings.batch_processing_model),
        daily_spending_limit = COALESCE(EXCLUDED.daily_spending_limit, user_settings.daily_spending_limit),
        email_notifications_usage = COALESCE(EXCLUDED.email_notifications_usage, user_settings.email_notifications_usage),
        auto_renew_subscriptions = COALESCE(EXCLUDED.auto_renew_subscriptions, user_settings.auto_renew_subscriptions),
        email_receipts = COALESCE(EXCLUDED.email_receipts, user_settings.email_receipts),
        usage_based_billing_alerts = COALESCE(EXCLUDED.usage_based_billing_alerts, user_settings.usage_based_billing_alerts),
        allow_error_reports = COALESCE(EXCLUDED.allow_error_reports, user_settings.allow_error_reports),
        opt_out_analytics = COALESCE(EXCLUDED.opt_out_analytics, user_settings.opt_out_analytics),
        default_access_level = COALESCE(EXCLUDED.default_access_level, user_settings.default_access_level),
        two_factor_enabled = COALESCE(EXCLUDED.two_factor_enabled, user_settings.two_factor_enabled),
        session_timeout = COALESCE(EXCLUDED.session_timeout, user_settings.session_timeout),
        login_notifications = COALESCE(EXCLUDED.login_notifications, user_settings.login_notifications),
        suspicious_activity_alerts = COALESCE(EXCLUDED.suspicious_activity_alerts, user_settings.suspicious_activity_alerts),
        email_notifications = COALESCE(EXCLUDED.email_notifications, user_settings.email_notifications),
        push_notifications = COALESCE(EXCLUDED.push_notifications, user_settings.push_notifications),
        slack_notifications = COALESCE(EXCLUDED.slack_notifications, user_settings.slack_notifications),
        notification_frequency = COALESCE(EXCLUDED.notification_frequency, user_settings.notification_frequency),
        updated_at = NOW();
    
    RETURN QUERY SELECT true, 'Settings updated successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;