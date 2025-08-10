-- Showcase marketplace tables for capabilities, providers, and related data

-- Enum types for showcase
CREATE TYPE capability_category AS ENUM ('analysis', 'search', 'visualization', 'ai', 'automation', 'collaboration');
CREATE TYPE capability_type AS ENUM ('tool', 'dashboard', 'ai-agent', 'workflow', 'integration');
CREATE TYPE capability_status AS ENUM ('available', 'purchased', 'enabled', 'disabled', 'shared');
CREATE TYPE billing_type AS ENUM ('one-time', 'monthly', 'per-use');
CREATE TYPE parameter_type AS ENUM ('text', 'number', 'boolean', 'select', 'multi-select', 'file', 'date', 'range');

-- Capability providers table
CREATE TABLE public.capability_providers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    profile_image_url TEXT,
    bio TEXT,
    website_url TEXT,
    verified BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    total_capabilities INTEGER DEFAULT 0,
    total_runs INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Main capabilities table
CREATE TABLE public.capabilities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    category capability_category NOT NULL,
    type capability_type NOT NULL,
    
    -- Provider information
    provider_id UUID REFERENCES public.capability_providers(id) ON DELETE CASCADE,
    
    -- Pricing and availability
    price_amount DECIMAL(10,2) DEFAULT 0.00,
    price_currency TEXT DEFAULT 'USD',
    billing_type billing_type DEFAULT 'one-time',
    free_trial_available BOOLEAN DEFAULT false,
    trial_duration INTEGER DEFAULT 0, -- days
    
    -- Technical details
    version TEXT DEFAULT '1.0.0',
    requirements TEXT[] DEFAULT '{}',
    supported_data_types TEXT[] DEFAULT '{}',
    estimated_run_time TEXT DEFAULT '1-5 minutes',
    output_types TEXT[] DEFAULT '{}',
    
    -- Usage statistics
    total_runs INTEGER DEFAULT 0,
    average_run_time DECIMAL(10,2) DEFAULT 0.0, -- minutes
    success_rate DECIMAL(5,4) DEFAULT 0.0 CHECK (success_rate >= 0 AND success_rate <= 1),
    user_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (user_rating >= 0 AND user_rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    
    -- Media and presentation
    thumbnail_url TEXT,
    screenshot_urls TEXT[] DEFAULT '{}',
    demo_video_url TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- Sharing and permissions
    allow_sharing BOOLEAN DEFAULT true,
    max_shares INTEGER DEFAULT 5,
    current_shares INTEGER DEFAULT 0,
    
    -- Status and visibility
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    search_vector tsvector,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Capability parameters table
CREATE TABLE public.capability_parameters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    capability_id UUID REFERENCES public.capabilities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    label TEXT NOT NULL,
    type parameter_type NOT NULL,
    required BOOLEAN DEFAULT false,
    default_value TEXT,
    options JSONB DEFAULT '[]', -- Array of {value, label} objects
    validation JSONB DEFAULT '{}', -- {min, max, pattern, minLength, maxLength}
    description TEXT,
    help_text TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User capability relationships (purchases, shares, etc.)
CREATE TABLE public.user_capabilities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    capability_id UUID REFERENCES public.capabilities(id) ON DELETE CASCADE,
    status capability_status DEFAULT 'available',
    
    -- Purchase/sharing info
    purchased_at TIMESTAMPTZ,
    enabled_at TIMESTAMPTZ,
    disabled_at TIMESTAMPTZ,
    shared_by UUID REFERENCES public.users(id),
    shared_at TIMESTAMPTZ,
    
    -- Usage tracking
    total_runs INTEGER DEFAULT 0,
    last_run_at TIMESTAMPTZ,
    
    -- Configuration
    custom_settings JSONB DEFAULT '{}',
    license_type TEXT DEFAULT 'purchased', -- purchased, shared, trial
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, capability_id)
);

-- Capability runs/executions table
CREATE TABLE public.capability_runs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    capability_id UUID REFERENCES public.capabilities(id),
    user_id UUID REFERENCES public.users(id),
    project_id UUID REFERENCES public.projects(id),
    
    -- Run details
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'running', -- running, completed, failed, cancelled
    
    -- Configuration and results
    parameters JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    assets_produced JSONB DEFAULT '[]',
    error_message TEXT,
    duration_minutes DECIMAL(10,2),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Capability reviews table
CREATE TABLE public.capability_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    capability_id UUID REFERENCES public.capabilities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    review TEXT,
    helpful_count INTEGER DEFAULT 0,
    verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, capability_id)
);

-- Capability shares table
CREATE TABLE public.capability_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    capability_id UUID REFERENCES public.capabilities(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    shared_with UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT,
    permissions JSONB DEFAULT '{"can_run": true, "can_reshare": false}',
    status TEXT DEFAULT 'pending', -- pending, accepted, declined, revoked
    shared_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(capability_id, shared_by, shared_with)
);

-- Create indexes for performance
CREATE INDEX idx_capabilities_category ON public.capabilities(category);
CREATE INDEX idx_capabilities_type ON public.capabilities(type);
CREATE INDEX idx_capabilities_provider_id ON public.capabilities(provider_id);
CREATE INDEX idx_capabilities_is_active ON public.capabilities(is_active);
CREATE INDEX idx_capabilities_is_published ON public.capabilities(is_published);
CREATE INDEX idx_capabilities_rating ON public.capabilities(user_rating DESC);
CREATE INDEX idx_capabilities_runs ON public.capabilities(total_runs DESC);
CREATE INDEX idx_capabilities_tags ON public.capabilities USING gin(tags);
CREATE INDEX idx_capabilities_search_vector ON public.capabilities USING gin(search_vector);

CREATE INDEX idx_capability_parameters_capability_id ON public.capability_parameters(capability_id);
CREATE INDEX idx_capability_parameters_sort_order ON public.capability_parameters(capability_id, sort_order);

CREATE INDEX idx_user_capabilities_user_id ON public.user_capabilities(user_id);
CREATE INDEX idx_user_capabilities_capability_id ON public.user_capabilities(capability_id);
CREATE INDEX idx_user_capabilities_status ON public.user_capabilities(status);

CREATE INDEX idx_capability_runs_capability_id ON public.capability_runs(capability_id);
CREATE INDEX idx_capability_runs_user_id ON public.capability_runs(user_id);
CREATE INDEX idx_capability_runs_project_id ON public.capability_runs(project_id);
CREATE INDEX idx_capability_runs_status ON public.capability_runs(status);
CREATE INDEX idx_capability_runs_started_at ON public.capability_runs(started_at DESC);

CREATE INDEX idx_capability_reviews_capability_id ON public.capability_reviews(capability_id);
CREATE INDEX idx_capability_reviews_rating ON public.capability_reviews(rating DESC);

-- Full-text search function for capabilities
CREATE OR REPLACE FUNCTION update_capabilities_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.long_description, '')), 'C') ||
        setweight(to_tsvector('english', array_to_string(NEW.tags, ' ')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_capabilities_search_vector
    BEFORE INSERT OR UPDATE ON public.capabilities
    FOR EACH ROW
    EXECUTE FUNCTION update_capabilities_search_vector();

-- Trigger to update provider statistics
CREATE OR REPLACE FUNCTION update_provider_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update provider total capabilities
    UPDATE public.capability_providers 
    SET total_capabilities = (
        SELECT COUNT(*) 
        FROM public.capabilities 
        WHERE provider_id = NEW.provider_id AND is_active = true
    )
    WHERE id = NEW.provider_id;
    
    -- Update provider total runs
    UPDATE public.capability_providers 
    SET total_runs = (
        SELECT COALESCE(SUM(total_runs), 0) 
        FROM public.capabilities 
        WHERE provider_id = NEW.provider_id
    )
    WHERE id = NEW.provider_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_provider_stats_on_capability
    AFTER INSERT OR UPDATE ON public.capabilities
    FOR EACH ROW
    EXECUTE FUNCTION update_provider_stats();

-- Function to update capability statistics
CREATE OR REPLACE FUNCTION update_capability_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'capability_runs' AND NEW.status = 'completed' THEN
        -- Update total runs and average runtime
        UPDATE public.capabilities 
        SET 
            total_runs = total_runs + 1,
            average_run_time = (
                SELECT AVG(duration_minutes) 
                FROM public.capability_runs 
                WHERE capability_id = NEW.capability_id 
                AND status = 'completed'
                AND duration_minutes IS NOT NULL
            )
        WHERE id = NEW.capability_id;
        
        -- Update success rate
        UPDATE public.capabilities 
        SET success_rate = (
            SELECT 
                CAST(COUNT(*) FILTER (WHERE status = 'completed') AS DECIMAL) / 
                CAST(COUNT(*) AS DECIMAL)
            FROM public.capability_runs 
            WHERE capability_id = NEW.capability_id
        )
        WHERE id = NEW.capability_id;
        
    ELSIF TG_TABLE_NAME = 'capability_reviews' THEN
        -- Update rating and review count
        UPDATE public.capabilities 
        SET 
            user_rating = (
                SELECT AVG(rating::DECIMAL) 
                FROM public.capability_reviews 
                WHERE capability_id = NEW.capability_id
            ),
            total_reviews = (
                SELECT COUNT(*) 
                FROM public.capability_reviews 
                WHERE capability_id = NEW.capability_id
            )
        WHERE id = NEW.capability_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_capability_stats_from_runs
    AFTER INSERT OR UPDATE ON public.capability_runs
    FOR EACH ROW
    EXECUTE FUNCTION update_capability_stats();

CREATE TRIGGER update_capability_stats_from_reviews
    AFTER INSERT OR UPDATE OR DELETE ON public.capability_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_capability_stats();

-- Row Level Security policies
ALTER TABLE public.capability_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_shares ENABLE ROW LEVEL SECURITY;

-- Providers can manage their own profiles
CREATE POLICY "Providers can manage own profile" ON public.capability_providers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND email = capability_providers.email
        )
    );

-- Everyone can read published capabilities
CREATE POLICY "Everyone can read published capabilities" ON public.capabilities
    FOR SELECT USING (is_published = true AND is_active = true);

-- Providers can manage their own capabilities
CREATE POLICY "Providers can manage own capabilities" ON public.capabilities
    FOR ALL USING (
        provider_id IN (
            SELECT id FROM public.capability_providers 
            WHERE email = (
                SELECT email FROM public.users WHERE id = auth.uid()
            )
        )
    );

-- Admins can manage all capabilities
CREATE POLICY "Admins can manage all capabilities" ON public.capabilities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Everyone can read capability parameters for published capabilities
CREATE POLICY "Everyone can read published capability parameters" ON public.capability_parameters
    FOR SELECT USING (
        capability_id IN (
            SELECT id FROM public.capabilities 
            WHERE is_published = true AND is_active = true
        )
    );

-- Providers can manage their capability parameters
CREATE POLICY "Providers can manage own capability parameters" ON public.capability_parameters
    FOR ALL USING (
        capability_id IN (
            SELECT c.id FROM public.capabilities c
            JOIN public.capability_providers p ON c.provider_id = p.id
            JOIN public.users u ON p.email = u.email
            WHERE u.id = auth.uid()
        )
    );

-- Users can manage their own capability relationships
CREATE POLICY "Users can manage own capability relationships" ON public.user_capabilities
    FOR ALL USING (user_id = auth.uid());

-- Users can read their own capability runs
CREATE POLICY "Users can read own capability runs" ON public.capability_runs
    FOR SELECT USING (user_id = auth.uid());

-- Users can create capability runs for capabilities they have access to
CREATE POLICY "Users can create capability runs" ON public.capability_runs
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        (
            -- They own/purchased the capability
            EXISTS (
                SELECT 1 FROM public.user_capabilities 
                WHERE user_id = auth.uid() 
                AND capability_id = capability_runs.capability_id 
                AND status IN ('purchased', 'enabled', 'shared')
            )
            -- Or it's a free capability
            OR EXISTS (
                SELECT 1 FROM public.capabilities 
                WHERE id = capability_runs.capability_id 
                AND price_amount = 0
            )
            -- Or they have a free trial
            OR EXISTS (
                SELECT 1 FROM public.capabilities 
                WHERE id = capability_runs.capability_id 
                AND free_trial_available = true
            )
        )
    );

-- Users can read and write their own reviews
CREATE POLICY "Users can manage own reviews" ON public.capability_reviews
    FOR ALL USING (user_id = auth.uid());

-- Everyone can read reviews for published capabilities
CREATE POLICY "Everyone can read published capability reviews" ON public.capability_reviews
    FOR SELECT USING (
        capability_id IN (
            SELECT id FROM public.capabilities 
            WHERE is_published = true AND is_active = true
        )
    );

-- Users can manage capability shares they're involved in
CREATE POLICY "Users can manage own capability shares" ON public.capability_shares
    FOR ALL USING (shared_by = auth.uid() OR shared_with = auth.uid());

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON public.capability_providers TO authenticated, anon;
GRANT SELECT ON public.capabilities TO authenticated, anon;
GRANT SELECT ON public.capability_parameters TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_capabilities TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.capability_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.capability_reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.capability_shares TO authenticated;

-- Admin permissions for all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;