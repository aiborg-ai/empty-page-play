-- Insert default categories
INSERT INTO public.categories (name, slug, description, color, icon) VALUES
('AI & Machine Learning', 'ai-ml', 'Artificial Intelligence and Machine Learning technologies', '#8b5cf6', 'Bot'),
('Analysis Tools', 'analysis', 'Data analysis and research tools', '#10b981', 'BarChart3'),
('Search & Discovery', 'search', 'Search engines and discovery tools', '#f59e0b', 'Search'),
('Visualization', 'visualization', 'Data visualization and charting tools', '#06b6d4', 'PieChart'),
('Export & Reports', 'export', 'Export tools and report generation', '#6b7280', 'Download'),
('Patent Research', 'patents', 'Patent research and analysis', '#3b82f6', 'FileText'),
('Market Intelligence', 'market', 'Market research and competitive analysis', '#ef4444', 'TrendingUp'),
('Legal & Compliance', 'legal', 'Legal analysis and compliance tools', '#7c3aed', 'Scale');

-- Insert default content types
INSERT INTO public.content_types (name, slug, description, schema) VALUES
('Showcase Item', 'showcase-item', 'Items displayed in the showcase', '{
    "type": "object",
    "properties": {
        "category": {"type": "string"},
        "features": {"type": "array", "items": {"type": "string"}},
        "pricing": {"type": "object"},
        "demo_url": {"type": "string"},
        "documentation_url": {"type": "string"},
        "provider": {"type": "string"},
        "version": {"type": "string"},
        "compatibility": {"type": "array", "items": {"type": "string"}},
        "screenshots": {"type": "array", "items": {"type": "string"}}
    }
}'),
('Blog Post', 'blog-post', 'Blog posts and articles', '{
    "type": "object",
    "properties": {
        "content": {"type": "string"},
        "summary": {"type": "string"},
        "reading_time": {"type": "number"},
        "seo_title": {"type": "string"},
        "seo_description": {"type": "string"}
    }
}'),
('Documentation', 'documentation', 'Help and documentation pages', '{
    "type": "object",
    "properties": {
        "content": {"type": "string"},
        "section": {"type": "string"},
        "order": {"type": "number"},
        "related_links": {"type": "array", "items": {"type": "object"}}
    }
}'),
('Tutorial', 'tutorial', 'Step-by-step tutorials', '{
    "type": "object",
    "properties": {
        "content": {"type": "string"},
        "difficulty": {"type": "string"},
        "duration": {"type": "number"},
        "prerequisites": {"type": "array", "items": {"type": "string"}},
        "steps": {"type": "array", "items": {"type": "object"}}
    }
}'),
('Case Study', 'case-study', 'Research and analysis case studies', '{
    "type": "object",
    "properties": {
        "content": {"type": "string"},
        "industry": {"type": "string"},
        "methodology": {"type": "string"},
        "results": {"type": "object"},
        "conclusions": {"type": "array", "items": {"type": "string"}}
    }
}');

-- Insert sample showcase items
INSERT INTO public.contents (title, slug, content_type_id, category_id, author_id, status, data, excerpt, tags, published_at) VALUES
-- AI & ML Category
('GPT-4 Patent Analyzer', 'gpt4-patent-analyzer', 
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'ai-ml'),
    '00000000-0000-0000-0000-000000000000', -- Will be updated with real user ID
    'published',
    '{
        "category": "ai-ml",
        "features": ["Natural language patent analysis", "Automated claim extraction", "Prior art discovery", "Patent landscape mapping"],
        "pricing": {"type": "subscription", "starting_price": 99, "currency": "USD", "billing": "monthly"},
        "provider": "OpenAI",
        "version": "2.0",
        "compatibility": ["API", "Web Interface"],
        "demo_url": "https://demo.example.com/gpt4-patent"
    }',
    'Advanced AI-powered patent analysis using GPT-4 for comprehensive IP research and analysis.',
    ARRAY['AI', 'GPT-4', 'Patent Analysis', 'NLP'],
    NOW()
),
('Claude Research Assistant', 'claude-research-assistant',
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'ai-ml'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    '{
        "category": "ai-ml",
        "features": ["Research synthesis", "Literature review", "Data interpretation", "Hypothesis generation"],
        "pricing": {"type": "pay-per-use", "starting_price": 0.02, "currency": "USD", "billing": "per-token"},
        "provider": "Anthropic",
        "version": "3.5",
        "compatibility": ["API", "SDK", "Web Interface"]
    }',
    'Intelligent research assistant for comprehensive literature review and data analysis.',
    ARRAY['AI', 'Claude', 'Research', 'Analysis'],
    NOW()
),

-- Analysis Tools Category
('Patent Citation Network Analyzer', 'patent-citation-analyzer',
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'analysis'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    '{
        "category": "analysis",
        "features": ["Citation network visualization", "Influence metrics", "Technology evolution tracking", "Inventor collaboration analysis"],
        "pricing": {"type": "freemium", "starting_price": 0, "premium_price": 49, "currency": "USD", "billing": "monthly"},
        "provider": "InnoSpot",
        "version": "1.5",
        "compatibility": ["Web Interface", "API", "CSV Export"]
    }',
    'Comprehensive patent citation network analysis tool for understanding technology landscapes.',
    ARRAY['Citations', 'Network Analysis', 'Patents', 'Visualization'],
    NOW()
),
('Technology Trend Analyzer', 'tech-trend-analyzer',
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'analysis'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    '{
        "category": "analysis",
        "features": ["Trend identification", "Technology lifecycle analysis", "Market adoption curves", "Innovation hotspots"],
        "pricing": {"type": "subscription", "starting_price": 79, "currency": "USD", "billing": "monthly"},
        "provider": "TrendScope",
        "version": "2.1",
        "compatibility": ["Dashboard", "API", "Mobile App"]
    }',
    'Advanced analytics for identifying and tracking technology trends across industries.',
    ARRAY['Trends', 'Analytics', 'Technology', 'Forecasting'],
    NOW()
),

-- Search & Discovery Category
('Global Patent Search Engine', 'global-patent-search',
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'search'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    '{
        "category": "search",
        "features": ["Multi-jurisdiction search", "Semantic search", "Image-based search", "Real-time updates"],
        "pricing": {"type": "tiered", "starting_price": 29, "enterprise_price": 299, "currency": "USD", "billing": "monthly"},
        "provider": "PatentDB",
        "version": "3.0",
        "compatibility": ["Web Interface", "API", "Mobile"]
    }',
    'Comprehensive patent search engine covering global patent databases with advanced search capabilities.',
    ARRAY['Search', 'Patents', 'Global', 'Semantic'],
    NOW()
),
('Prior Art Discovery Tool', 'prior-art-discovery',
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'search'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    '{
        "category": "search",
        "features": ["AI-powered discovery", "Non-patent literature search", "Image similarity search", "Citation analysis"],
        "pricing": {"type": "subscription", "starting_price": 149, "currency": "USD", "billing": "monthly"},
        "provider": "PriorArt AI",
        "version": "1.8",
        "compatibility": ["Web Platform", "API Integration"]
    }',
    'AI-powered tool for comprehensive prior art discovery and patent landscape analysis.',
    ARRAY['Prior Art', 'AI', 'Discovery', 'Search'],
    NOW()
),

-- Visualization Category
('Patent Landscape Visualizer', 'patent-landscape-viz',
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'visualization'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    '{
        "category": "visualization",
        "features": ["Interactive maps", "Technology clusters", "Competitive positioning", "Timeline visualization"],
        "pricing": {"type": "subscription", "starting_price": 89, "currency": "USD", "billing": "monthly"},
        "provider": "VizPatent",
        "version": "2.3",
        "compatibility": ["Web Dashboard", "Export Options"]
    }',
    'Interactive patent landscape visualization tool for strategic IP analysis.',
    ARRAY['Visualization', 'Mapping', 'Interactive', 'Strategy'],
    NOW()
),
('Innovation Dashboard', 'innovation-dashboard',
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'visualization'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    '{
        "category": "visualization",
        "features": ["Real-time metrics", "Custom KPIs", "Collaborative workspace", "Export capabilities"],
        "pricing": {"type": "per-user", "starting_price": 39, "currency": "USD", "billing": "monthly"},
        "provider": "InnoMetrics",
        "version": "1.9",
        "compatibility": ["Web Dashboard", "Mobile App", "API"]
    }',
    'Comprehensive innovation dashboard for tracking IP performance and strategic metrics.',
    ARRAY['Dashboard', 'KPIs', 'Innovation', 'Metrics'],
    NOW()
);

-- Create activity log trigger function
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Log the activity
    INSERT INTO public.activities (user_id, action, resource_type, resource_id, project_id, details)
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        COALESCE(NEW.project_id, OLD.project_id),
        jsonb_build_object(
            'table', TG_TABLE_NAME,
            'operation', TG_OP,
            'timestamp', NOW()
        )
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create activity triggers for key tables
CREATE TRIGGER log_projects_activity
    AFTER INSERT OR UPDATE OR DELETE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_contents_activity
    AFTER INSERT OR UPDATE OR DELETE ON public.contents
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_reports_activity
    AFTER INSERT OR UPDATE OR DELETE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_ai_agents_activity
    AFTER INSERT OR UPDATE OR DELETE ON public.ai_agents
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_tools_activity
    AFTER INSERT OR UPDATE OR DELETE ON public.tools
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_datasets_activity
    AFTER INSERT OR UPDATE OR DELETE ON public.datasets
    FOR EACH ROW EXECUTE FUNCTION log_activity();