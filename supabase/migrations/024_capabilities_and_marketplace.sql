-- Capability Showcase and Marketplace
-- Migration: 024_capabilities_and_marketplace.sql

-- Capabilities table
CREATE TABLE IF NOT EXISTS public.capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  category VARCHAR(100) NOT NULL, -- ai, analysis, visualization, search, automation, mcp
  type VARCHAR(100) NOT NULL, -- ai-agent, tool, dataset, dashboard, report, integration
  provider_id UUID REFERENCES users(id) ON DELETE SET NULL, -- capability creator
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
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
  published_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT capabilities_category_check 
    CHECK (category IN ('ai', 'analysis', 'visualization', 'search', 'automation', 'mcp', 'datasets')),
  CONSTRAINT capabilities_type_check 
    CHECK (type IN ('ai-agent', 'tool', 'dataset', 'dashboard', 'report', 'integration')),
  CONSTRAINT capabilities_status_check 
    CHECK (status IN ('draft', 'review', 'published', 'deprecated')),
  CONSTRAINT capabilities_approval_status_check 
    CHECK (approval_status IN ('pending', 'approved', 'rejected'))
);

-- Capability downloads table
CREATE TABLE IF NOT EXISTS public.capability_downloads (
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
  
  CONSTRAINT capability_downloads_download_type_check 
    CHECK (download_type IN ('standard', 'fork', 'clone')),
  CONSTRAINT capability_downloads_installation_status_check 
    CHECK (installation_status IN ('pending', 'installed', 'failed', 'removed')),
  CONSTRAINT capability_downloads_unique_user_project 
    UNIQUE(capability_id, user_id, project_id)
);

-- Capability reviews table
CREATE TABLE IF NOT EXISTS public.capability_reviews (
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
  
  CONSTRAINT capability_reviews_status_check 
    CHECK (status IN ('published', 'hidden', 'reported')),
  CONSTRAINT capability_reviews_unique_user_capability 
    UNIQUE(capability_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_capabilities_category ON capabilities(category);
CREATE INDEX IF NOT EXISTS idx_capabilities_type ON capabilities(type);
CREATE INDEX IF NOT EXISTS idx_capabilities_status ON capabilities(status);
CREATE INDEX IF NOT EXISTS idx_capabilities_approval ON capabilities(approval_status);
CREATE INDEX IF NOT EXISTS idx_capabilities_featured ON capabilities(featured);
CREATE INDEX IF NOT EXISTS idx_capabilities_provider ON capabilities(provider_id);
CREATE INDEX IF NOT EXISTS idx_capabilities_organization ON capabilities(organization_id);
CREATE INDEX IF NOT EXISTS idx_capabilities_published ON capabilities(published_at);

-- GIN indexes for array fields and full-text search
CREATE INDEX IF NOT EXISTS idx_capabilities_tags ON capabilities USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_capabilities_keywords ON capabilities USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_capabilities_formats ON capabilities USING GIN(supported_formats);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_capabilities_search ON capabilities 
  USING GIN(to_tsvector('english', name || ' ' || description || ' ' || COALESCE(detailed_description, '')));

CREATE INDEX IF NOT EXISTS idx_capability_downloads_capability ON capability_downloads(capability_id);
CREATE INDEX IF NOT EXISTS idx_capability_downloads_user ON capability_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_capability_downloads_project ON capability_downloads(project_id);
CREATE INDEX IF NOT EXISTS idx_capability_downloads_status ON capability_downloads(installation_status);
CREATE INDEX IF NOT EXISTS idx_capability_downloads_downloaded ON capability_downloads(downloaded_at);

CREATE INDEX IF NOT EXISTS idx_capability_reviews_capability ON capability_reviews(capability_id);
CREATE INDEX IF NOT EXISTS idx_capability_reviews_user ON capability_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_capability_reviews_rating ON capability_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_capability_reviews_status ON capability_reviews(status);

-- Function to update capability metrics
CREATE OR REPLACE FUNCTION public.update_capability_metrics()
RETURNS TRIGGER AS $$
DECLARE
  capability_uuid UUID;
  avg_rating DECIMAL(3,2);
  total_downloads INTEGER;
  total_reviews INTEGER;
BEGIN
  capability_uuid := COALESCE(NEW.capability_id, OLD.capability_id);
  
  -- Calculate average rating
  SELECT AVG(rating)::DECIMAL(3,2), COUNT(*)
  INTO avg_rating, total_reviews
  FROM capability_reviews 
  WHERE capability_id = capability_uuid AND status = 'published';
  
  -- Count total downloads
  SELECT COUNT(*)
  INTO total_downloads
  FROM capability_downloads 
  WHERE capability_id = capability_uuid;
  
  -- Update capability metrics
  UPDATE capabilities 
  SET metrics = jsonb_set(
    jsonb_set(
      jsonb_set(
        metrics,
        '{rating}',
        to_jsonb(COALESCE(avg_rating, 0))
      ),
      '{downloads}',
      to_jsonb(total_downloads)
    ),
    '{reviews}',
    to_jsonb(total_reviews)
  )
  WHERE id = capability_uuid;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers to maintain capability metrics
CREATE TRIGGER update_capability_metrics_downloads
  AFTER INSERT OR DELETE ON capability_downloads
  FOR EACH ROW EXECUTE FUNCTION update_capability_metrics();

CREATE TRIGGER update_capability_metrics_reviews
  AFTER INSERT OR UPDATE OR DELETE ON capability_reviews
  FOR EACH ROW EXECUTE FUNCTION update_capability_metrics();

-- Function to verify download for reviews
CREATE OR REPLACE FUNCTION public.verify_review_download()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has downloaded the capability
  IF EXISTS (
    SELECT 1 FROM capability_downloads 
    WHERE capability_id = NEW.capability_id 
    AND user_id = NEW.user_id 
    AND installation_status = 'installed'
  ) THEN
    NEW.verified_download = true;
  ELSE
    NEW.verified_download = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to verify downloads for reviews
CREATE TRIGGER verify_review_download_trigger
  BEFORE INSERT OR UPDATE ON capability_reviews
  FOR EACH ROW EXECUTE FUNCTION verify_review_download();

-- Function to update published timestamp
CREATE OR REPLACE FUNCTION public.update_capability_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set published_at when status changes to published
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = NOW();
  END IF;
  
  -- Clear published_at when status changes from published
  IF NEW.status != 'published' AND OLD.status = 'published' THEN
    NEW.published_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to manage published timestamp
CREATE TRIGGER update_capability_published_at_trigger
  BEFORE UPDATE ON capabilities
  FOR EACH ROW EXECUTE FUNCTION update_capability_published_at();

-- Apply updated_at triggers
CREATE TRIGGER update_capabilities_updated_at
  BEFORE UPDATE ON capabilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_capability_reviews_updated_at
  BEFORE UPDATE ON capability_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();