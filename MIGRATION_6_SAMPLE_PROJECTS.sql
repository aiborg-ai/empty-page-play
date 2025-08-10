-- =====================================================
-- MIGRATION 6: SAMPLE USER PROJECTS DATA
-- Copy from here to the end of this block and paste into Supabase SQL Editor
-- =====================================================

-- Insert sample projects for demonstration
-- Note: This uses a placeholder user ID. Replace with actual user ID after creating a user account.

INSERT INTO public.projects (
    name, 
    slug, 
    description, 
    color, 
    project_type, 
    progress, 
    priority, 
    deadline, 
    status, 
    owner_id, 
    settings, 
    metadata, 
    tags, 
    is_public
) VALUES 
(
    'AI-Powered Patent Analytics', 
    'ai-patent-analytics', 
    'Comprehensive analysis of AI and machine learning patents using advanced natural language processing and data visualization techniques.',
    '#8b5cf6', 
    'research', 
    45, 
    'high', 
    NOW() + INTERVAL '3 months',
    'active',
    '00000000-0000-0000-0000-000000000000', -- Placeholder - replace with actual user ID
    '{"notifications": true, "auto_backup": true, "collaboration_enabled": true}',
    '{"research_focus": "AI/ML patents", "target_jurisdictions": ["US", "EP", "CN"], "analysis_period": "2020-2024"}',
    ARRAY['AI', 'Patents', 'Analytics', 'Machine Learning'],
    false
),
(
    'Pharmaceutical Innovation Landscape', 
    'pharma-innovation-landscape', 
    'Mapping the pharmaceutical innovation ecosystem through patent analysis, focusing on emerging drug discovery technologies and therapeutic areas.',
    '#10b981', 
    'research', 
    72, 
    'medium', 
    NOW() + INTERVAL '2 months',
    'active',
    '00000000-0000-0000-0000-000000000000', -- Placeholder - replace with actual user ID
    '{"notifications": true, "auto_backup": false, "collaboration_enabled": false}',
    '{"therapeutic_areas": ["oncology", "immunology", "neuroscience"], "company_focus": "top_10_pharma"}',
    ARRAY['Pharmaceuticals', 'Drug Discovery', 'Innovation', 'Patents'],
    true
),
(
    'Green Technology Patent Trends', 
    'green-tech-patent-trends', 
    'Analysis of renewable energy and sustainability patents to identify emerging trends and investment opportunities in clean technology.',
    '#059669', 
    'market_analysis', 
    23, 
    'medium', 
    NOW() + INTERVAL '4 months',
    'active',
    '00000000-0000-0000-0000-000000000000', -- Placeholder - replace with actual user ID
    '{"notifications": false, "auto_backup": true, "collaboration_enabled": true}',
    '{"focus_areas": ["solar", "wind", "battery", "carbon_capture"], "geographic_scope": "global"}',
    ARRAY['Green Technology', 'Renewable Energy', 'Sustainability', 'Patents'],
    true
),
(
    'Competitive Intelligence Dashboard', 
    'competitive-intelligence', 
    'Real-time monitoring and analysis of competitor patent activities and innovation strategies across multiple technology domains.',
    '#f59e0b', 
    'competitive_analysis', 
    89, 
    'urgent', 
    NOW() + INTERVAL '1 month',
    'active',
    '00000000-0000-0000-0000-000000000000', -- Placeholder - replace with actual user ID
    '{"notifications": true, "auto_backup": true, "collaboration_enabled": true, "real_time_alerts": true}',
    '{"competitors": ["company_a", "company_b", "company_c"], "technology_domains": ["automotive", "electronics", "software"]}',
    ARRAY['Competitive Intelligence', 'Market Analysis', 'Patents'],
    false
);

-- Insert sample milestones
INSERT INTO public.project_milestones (
    project_id,
    title,
    description,
    due_date,
    created_by,
    sort_order
) VALUES 
(
    (SELECT id FROM public.projects WHERE slug = 'ai-patent-analytics'),
    'Data Collection Phase',
    'Gather and clean patent data from multiple sources including USPTO, EPO, and CNIPA databases.',
    NOW() + INTERVAL '2 weeks',
    '00000000-0000-0000-0000-000000000000',
    1
),
(
    (SELECT id FROM public.projects WHERE slug = 'ai-patent-analytics'),
    'NLP Model Training',
    'Train and validate natural language processing models for patent classification and analysis.',
    NOW() + INTERVAL '6 weeks',
    '00000000-0000-0000-0000-000000000000',
    2
),
(
    (SELECT id FROM public.projects WHERE slug = 'ai-patent-analytics'),
    'Dashboard Development',
    'Create interactive dashboards and visualization components for data exploration.',
    NOW() + INTERVAL '10 weeks',
    '00000000-0000-0000-0000-000000000000',
    3
),
(
    (SELECT id FROM public.projects WHERE slug = 'pharma-innovation-landscape'),
    'Literature Review',
    'Comprehensive review of existing pharmaceutical patent landscape studies.',
    NOW() + INTERVAL '1 week',
    '00000000-0000-0000-0000-000000000000',
    1
),
(
    (SELECT id FROM public.projects WHERE slug = 'pharma-innovation-landscape'),
    'Final Report',
    'Compile findings into comprehensive market intelligence report.',
    NOW() + INTERVAL '7 weeks',
    '00000000-0000-0000-0000-000000000000',
    2
);

-- Insert sample project templates
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
    '00000000-0000-0000-0000-000000000000'
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
    '00000000-0000-0000-0000-000000000000'
);

-- =====================================================
-- END OF MIGRATION 6
-- =====================================================