-- =====================================================
-- MIGRATION 3: SAMPLE DATA AND CATEGORIES
-- Copy from here to the end of this block and paste into Supabase SQL Editor
-- =====================================================

INSERT INTO public.categories (name, slug, description, color, icon) VALUES
('AI & Machine Learning', 'ai-ml', 'Artificial Intelligence and Machine Learning technologies', '#8b5cf6', 'Bot'),
('Analysis Tools', 'analysis', 'Data analysis and research tools', '#10b981', 'BarChart3'),
('Search & Discovery', 'search', 'Search engines and discovery tools', '#f59e0b', 'Search'),
('Visualization', 'visualization', 'Data visualization and charting tools', '#06b6d4', 'PieChart'),
('Export & Reports', 'export', 'Export tools and report generation', '#6b7280', 'Download'),
('Patent Research', 'patents', 'Patent research and analysis', '#3b82f6', 'FileText'),
('Market Intelligence', 'market', 'Market research and competitive analysis', '#ef4444', 'TrendingUp'),
('Legal & Compliance', 'legal', 'Legal analysis and compliance tools', '#7c3aed', 'Scale');

INSERT INTO public.content_types (name, slug, description, schema) VALUES
('Showcase Item', 'showcase-item', 'Items displayed in the showcase', '{"type": "object", "properties": {"category": {"type": "string"}, "features": {"type": "array"}, "pricing": {"type": "object"}, "provider": {"type": "string"}}}'),
('Blog Post', 'blog-post', 'Blog posts and articles', '{"type": "object", "properties": {"content": {"type": "string"}, "summary": {"type": "string"}}}'),
('Documentation', 'documentation', 'Help and documentation pages', '{"type": "object", "properties": {"content": {"type": "string"}, "section": {"type": "string"}}}');

INSERT INTO public.contents (title, slug, content_type_id, category_id, author_id, status, data, excerpt, tags, published_at) VALUES
('GPT-4 Patent Analyzer', 'gpt4-patent-analyzer', 
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'ai-ml'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    '{"category": "ai-ml", "features": ["Natural language patent analysis", "Automated claim extraction", "Prior art discovery"], "pricing": {"type": "subscription", "starting_price": 99}, "provider": "OpenAI", "version": "2.0"}',
    'Advanced AI-powered patent analysis using GPT-4 for comprehensive IP research.',
    ARRAY['AI', 'GPT-4', 'Patent Analysis'],
    NOW()
),
('Patent Citation Analyzer', 'patent-citation-analyzer',
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'analysis'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    '{"category": "analysis", "features": ["Citation network visualization", "Influence metrics", "Technology evolution tracking"], "pricing": {"type": "freemium", "starting_price": 0, "premium_price": 49}, "provider": "InnoSpot", "version": "1.5"}',
    'Comprehensive patent citation network analysis tool for understanding technology landscapes.',
    ARRAY['Citations', 'Network Analysis', 'Patents'],
    NOW()
),
('Global Patent Search', 'global-patent-search',
    (SELECT id FROM public.content_types WHERE slug = 'showcase-item'),
    (SELECT id FROM public.categories WHERE slug = 'search'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    '{"category": "search", "features": ["Multi-jurisdiction search", "Semantic search", "Image-based search"], "pricing": {"type": "tiered", "starting_price": 29, "enterprise_price": 299}, "provider": "PatentDB", "version": "3.0"}',
    'Comprehensive patent search engine covering global patent databases with advanced search capabilities.',
    ARRAY['Search', 'Patents', 'Global'],
    NOW()
);

-- =====================================================
-- END OF MIGRATION 3
-- =====================================================