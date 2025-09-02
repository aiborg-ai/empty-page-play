-- Safe Showcase Marketplace Tables Migration
-- Handles existing objects gracefully with IF NOT EXISTS

-- Create enum types (safe)
DO $$ BEGIN
    CREATE TYPE capability_category AS ENUM ('analysis', 'search', 'visualization', 'ai', 'automation', 'collaboration');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE capability_type AS ENUM ('tool', 'dashboard', 'ai-agent', 'workflow', 'integration');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE capability_status AS ENUM ('available', 'purchased', 'enabled', 'disabled', 'shared');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE billing_type AS ENUM ('one-time', 'monthly', 'per-use');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE parameter_type AS ENUM ('text', 'number', 'boolean', 'select', 'multi-select', 'file', 'date', 'range');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Capability providers table (safe)
CREATE TABLE IF NOT EXISTS public.capability_providers (
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

-- Main capabilities table (safe)
CREATE TABLE IF NOT EXISTS public.capabilities (
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
    average_run_time DECIMAL(5,2) DEFAULT 0.0, -- minutes
    success_rate DECIMAL(4,3) DEFAULT 1.0 CHECK (success_rate >= 0 AND success_rate <= 1),
    user_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (user_rating >= 0 AND user_rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    
    -- Configuration and parameters
    parameters JSONB DEFAULT '[]',
    configuration JSONB DEFAULT '{}',
    
    -- Content and media
    icon_url TEXT,
    screenshot_urls TEXT[] DEFAULT '{}',
    demo_video_url TEXT,
    documentation_url TEXT,
    
    -- Categorization and discovery
    tags TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    
    -- Sharing and permissions
    allow_sharing BOOLEAN DEFAULT true,
    max_shares INTEGER DEFAULT 10,
    sharing_price_override DECIMAL(10,2),
    
    -- Status and lifecycle
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    featured_order INTEGER DEFAULT 0,
    
    -- Timestamps
    published_at TIMESTAMPTZ,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User capability instances (safe)
CREATE TABLE IF NOT EXISTS public.user_capabilities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    capability_id UUID REFERENCES public.capabilities(id) ON DELETE CASCADE,
    status capability_status DEFAULT 'available',
    purchased_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    runs_remaining INTEGER,
    total_runs INTEGER DEFAULT 0,
    last_run_at TIMESTAMPTZ,
    configuration_override JSONB DEFAULT '{}',
    shared_by_user_id UUID REFERENCES auth.users(id),
    shared_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, capability_id)
);

-- Capability runs/usage history (safe)
CREATE TABLE IF NOT EXISTS public.capability_runs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    capability_id UUID REFERENCES public.capabilities(id) ON DELETE CASCADE,
    user_capability_id UUID REFERENCES public.user_capabilities(id) ON DELETE CASCADE,
    
    -- Run details
    input_data JSONB,
    output_data JSONB,
    parameters JSONB DEFAULT '{}',
    
    -- Performance metrics
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    
    -- Status and results
    status TEXT DEFAULT 'running', -- running, completed, failed, cancelled
    success BOOLEAN,
    error_message TEXT,
    
    -- Resource usage
    credits_used INTEGER DEFAULT 1,
    data_processed_mb DECIMAL(10,3),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Capability reviews and ratings (safe)
CREATE TABLE IF NOT EXISTS public.capability_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    capability_id UUID REFERENCES public.capabilities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    pros TEXT[] DEFAULT '{}',
    cons TEXT[] DEFAULT '{}',
    recommended BOOLEAN DEFAULT true,
    helpful_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(capability_id, user_id)
);

-- Enable RLS on all tables (safe)
ALTER TABLE public.capability_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_reviews ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance (safe)
CREATE INDEX IF NOT EXISTS idx_capability_providers_verified ON public.capability_providers(verified);
CREATE INDEX IF NOT EXISTS idx_capability_providers_rating ON public.capability_providers(rating);
CREATE INDEX IF NOT EXISTS idx_capabilities_category ON public.capabilities(category);
CREATE INDEX IF NOT EXISTS idx_capabilities_type ON public.capabilities(type);
CREATE INDEX IF NOT EXISTS idx_capabilities_provider_id ON public.capabilities(provider_id);
CREATE INDEX IF NOT EXISTS idx_capabilities_is_published ON public.capabilities(is_published);
CREATE INDEX IF NOT EXISTS idx_capabilities_is_featured ON public.capabilities(is_featured);
CREATE INDEX IF NOT EXISTS idx_capabilities_tags ON public.capabilities USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_capabilities_rating ON public.capabilities(user_rating);
CREATE INDEX IF NOT EXISTS idx_user_capabilities_user_id ON public.user_capabilities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_capabilities_capability_id ON public.user_capabilities(capability_id);
CREATE INDEX IF NOT EXISTS idx_user_capabilities_status ON public.user_capabilities(status);
CREATE INDEX IF NOT EXISTS idx_capability_runs_user_id ON public.capability_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_capability_runs_capability_id ON public.capability_runs(capability_id);
CREATE INDEX IF NOT EXISTS idx_capability_runs_started_at ON public.capability_runs(started_at);
CREATE INDEX IF NOT EXISTS idx_capability_reviews_capability_id ON public.capability_reviews(capability_id);
CREATE INDEX IF NOT EXISTS idx_capability_reviews_rating ON public.capability_reviews(rating);

-- Update timestamp triggers (safe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers and recreate them (safe)
DROP TRIGGER IF EXISTS update_capability_providers_updated_at ON public.capability_providers;
DROP TRIGGER IF EXISTS update_capabilities_updated_at ON public.capabilities;
DROP TRIGGER IF EXISTS update_user_capabilities_updated_at ON public.user_capabilities;
DROP TRIGGER IF EXISTS update_capability_reviews_updated_at ON public.capability_reviews;

CREATE TRIGGER update_capability_providers_updated_at 
    BEFORE UPDATE ON public.capability_providers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_capabilities_updated_at 
    BEFORE UPDATE ON public.capabilities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_user_capabilities_updated_at 
    BEFORE UPDATE ON public.user_capabilities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_capability_reviews_updated_at 
    BEFORE UPDATE ON public.capability_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Basic RLS policies (safe)

-- Capability providers: Everyone can read published providers
CREATE POLICY "Anyone can view capability providers" ON public.capability_providers
    FOR SELECT USING (true);

-- Capabilities: Everyone can read published capabilities
CREATE POLICY "Anyone can view published capabilities" ON public.capabilities
    FOR SELECT USING (is_published = true);

-- User capabilities: Users can only see their own
CREATE POLICY "Users can view their own capabilities" ON public.user_capabilities
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own capabilities" ON public.user_capabilities
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own capabilities" ON public.user_capabilities
    FOR UPDATE USING (user_id = auth.uid());

-- Capability runs: Users can only see their own runs
CREATE POLICY "Users can view their own runs" ON public.capability_runs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own runs" ON public.capability_runs
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Capability reviews: Users can see all reviews but only modify their own
CREATE POLICY "Anyone can view capability reviews" ON public.capability_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON public.capability_reviews
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews" ON public.capability_reviews
    FOR UPDATE USING (user_id = auth.uid());