-- =====================================================
-- MIGRATION 6: SAMPLE DATA AND CATEGORIES (FIXED)
-- Copy from here to the end of this block and paste into Supabase SQL Editor
-- =====================================================

-- Insert sample categories (safe - no foreign key dependencies)
INSERT INTO public.categories (name, slug, description, color, icon) VALUES
('AI & Machine Learning', 'ai-ml', 'Artificial Intelligence and Machine Learning technologies', '#8b5cf6', 'Bot'),
('Analysis Tools', 'analysis', 'Data analysis and research tools', '#10b981', 'BarChart3'),
('Search & Discovery', 'search', 'Search engines and discovery tools', '#f59e0b', 'Search'),
('Visualization', 'visualization', 'Data visualization and charting tools', '#06b6d4', 'PieChart'),
('Export & Reports', 'export', 'Export tools and report generation', '#6b7280', 'Download'),
('Patent Research', 'patents', 'Patent research and analysis', '#3b82f6', 'FileText'),
('Market Intelligence', 'market', 'Market research and competitive analysis', '#ef4444', 'TrendingUp'),
('Legal & Compliance', 'legal', 'Legal analysis and compliance tools', '#7c3aed', 'Scale')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample content types (safe - no foreign key dependencies)
INSERT INTO public.content_types (name, slug, description, schema) VALUES
('Showcase Item', 'showcase-item', 'Items displayed in the showcase', '{"type": "object", "properties": {"category": {"type": "string"}, "features": {"type": "array"}, "pricing": {"type": "object"}, "provider": {"type": "string"}}}'),
('Blog Post', 'blog-post', 'Blog posts and articles', '{"type": "object", "properties": {"content": {"type": "string"}, "summary": {"type": "string"}}}'),
('Documentation', 'documentation', 'Help and documentation pages', '{"type": "object", "properties": {"content": {"type": "string"}, "section": {"type": "string"}}}')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample showcase content using existing categories (safe - uses system user)
INSERT INTO public.contents (title, slug, content_type_id, category_id, author_id, status, data, excerpt, tags, published_at) 
SELECT 
    'GPT-4 Patent Analyzer', 
    'gpt4-patent-analyzer', 
    ct.id,
    cat.id,
    auth.uid(), -- Use the currently authenticated user
    'published',
    '{"category": "ai-ml", "features": ["Natural language patent analysis", "Automated claim extraction", "Prior art discovery"], "pricing": {"type": "subscription", "starting_price": 99}, "provider": "OpenAI", "version": "2.0"}',
    'Advanced AI-powered patent analysis using GPT-4 for comprehensive IP research.',
    ARRAY['AI', 'GPT-4', 'Patent Analysis'],
    NOW()
FROM public.content_types ct, public.categories cat
WHERE ct.slug = 'showcase-item' AND cat.slug = 'ai-ml'
AND NOT EXISTS (SELECT 1 FROM public.contents WHERE slug = 'gpt4-patent-analyzer');

-- Insert more sample content
INSERT INTO public.contents (title, slug, content_type_id, category_id, author_id, status, data, excerpt, tags, published_at)
SELECT 
    'Patent Citation Analyzer',
    'patent-citation-analyzer',
    ct.id,
    cat.id,
    auth.uid(),
    'published',
    '{"category": "analysis", "features": ["Citation network visualization", "Influence metrics", "Technology evolution tracking"], "pricing": {"type": "freemium", "starting_price": 0, "premium_price": 49}, "provider": "InnoSpot", "version": "1.5"}',
    'Comprehensive patent citation network analysis tool for understanding technology landscapes.',
    ARRAY['Citations', 'Network Analysis', 'Patents'],
    NOW()
FROM public.content_types ct, public.categories cat
WHERE ct.slug = 'showcase-item' AND cat.slug = 'analysis'
AND NOT EXISTS (SELECT 1 FROM public.contents WHERE slug = 'patent-citation-analyzer');

INSERT INTO public.contents (title, slug, content_type_id, category_id, author_id, status, data, excerpt, tags, published_at)
SELECT 
    'Global Patent Search',
    'global-patent-search',
    ct.id,
    cat.id,
    auth.uid(),
    'published',
    '{"category": "search", "features": ["Multi-jurisdiction search", "Semantic search", "Image-based search"], "pricing": {"type": "tiered", "starting_price": 29, "enterprise_price": 299}, "provider": "PatentDB", "version": "3.0"}',
    'Comprehensive patent search engine covering global patent databases with advanced search capabilities.',
    ARRAY['Search', 'Patents', 'Global'],
    NOW()
FROM public.content_types ct, public.categories cat
WHERE ct.slug = 'showcase-item' AND cat.slug = 'search'
AND NOT EXISTS (SELECT 1 FROM public.contents WHERE slug = 'global-patent-search');

-- Insert sample project templates (safe - uses current user if available)
DO $$
BEGIN
    IF auth.uid() IS NOT NULL THEN
        INSERT INTO public.project_templates (
            name,
            description,
            category,
            template_data,
            is_public,
            created_by
        ) VALUES 
        (
            'Patent Landscape Analysis',
            'Standard template for comprehensive patent landscape analysis projects',
            'research',
            '{
                "default_settings": {
                    "notifications": true,
                    "auto_backup": true,
                    "collaboration_enabled": false
                },
                "suggested_milestones": [
                    {"title": "Data Collection", "weeks_from_start": 2},
                    {"title": "Analysis Phase", "weeks_from_start": 6},
                    {"title": "Report Generation", "weeks_from_start": 10},
                    {"title": "Final Review", "weeks_from_start": 12}
                ],
                "recommended_tags": ["Patent Analysis", "Research", "IP Intelligence"],
                "default_priority": "medium"
            }',
            true,
            auth.uid()
        ),
        (
            'Competitive Intelligence Monitor',
            'Template for ongoing competitive intelligence monitoring projects',
            'competitive_analysis',
            '{
                "default_settings": {
                    "notifications": true,
                    "auto_backup": true,
                    "collaboration_enabled": true,
                    "real_time_alerts": true
                },
                "suggested_milestones": [
                    {"title": "Competitor Identification", "weeks_from_start": 1},
                    {"title": "Baseline Analysis", "weeks_from_start": 3},
                    {"title": "Monitor Setup", "weeks_from_start": 4},
                    {"title": "First Quarterly Review", "weeks_from_start": 12}
                ],
                "recommended_tags": ["Competitive Intelligence", "Monitoring", "Market Analysis"],
                "default_priority": "high"
            }',
            true,
            auth.uid()
        )
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Note: Sample projects are NOT included in this migration because they require
-- existing users. Projects should be created through the application after users
-- are properly set up through the authentication system.

-- =====================================================
-- END OF MIGRATION 6 (FIXED)
-- =====================================================