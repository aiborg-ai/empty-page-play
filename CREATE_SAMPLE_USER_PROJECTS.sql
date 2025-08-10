-- =====================================================
-- CREATE SAMPLE USER AND PROJECTS
-- Run this AFTER creating a user account through the app
-- Replace 'your-actual-user-id' with your real user UUID from auth.users
-- =====================================================

-- First, check what users exist:
-- SELECT id, email FROM auth.users;

-- Then replace 'your-actual-user-id' below with the actual UUID from the query above
-- Example: '123e4567-e89b-12d3-a456-426614174000'

DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Try to get an existing user ID
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    -- If we found a user, create sample projects
    IF sample_user_id IS NOT NULL THEN
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
            sample_user_id,
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
            sample_user_id,
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
            sample_user_id,
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
            sample_user_id,
            '{"notifications": true, "auto_backup": true, "collaboration_enabled": true, "real_time_alerts": true}',
            '{"competitors": ["company_a", "company_b", "company_c"], "technology_domains": ["automotive", "electronics", "software"]}',
            ARRAY['Competitive Intelligence', 'Market Analysis', 'Patents'],
            false
        )
        ON CONFLICT (owner_id, slug) DO NOTHING;

        -- Insert sample milestones for the AI project
        INSERT INTO public.project_milestones (
            project_id,
            title,
            description,
            due_date,
            created_by,
            sort_order
        ) 
        SELECT 
            p.id,
            'Data Collection Phase',
            'Gather and clean patent data from multiple sources including USPTO, EPO, and CNIPA databases.',
            NOW() + INTERVAL '2 weeks',
            sample_user_id,
            1
        FROM public.projects p 
        WHERE p.slug = 'ai-patent-analytics' AND p.owner_id = sample_user_id
        ON CONFLICT DO NOTHING;

        INSERT INTO public.project_milestones (
            project_id,
            title,
            description,
            due_date,
            created_by,
            sort_order
        ) 
        SELECT 
            p.id,
            'NLP Model Training',
            'Train and validate natural language processing models for patent classification and analysis.',
            NOW() + INTERVAL '6 weeks',
            sample_user_id,
            2
        FROM public.projects p 
        WHERE p.slug = 'ai-patent-analytics' AND p.owner_id = sample_user_id
        ON CONFLICT DO NOTHING;

        RAISE NOTICE 'Sample projects created successfully for user ID: %', sample_user_id;
    ELSE
        RAISE NOTICE 'No users found. Please create a user account first through the application.';
    END IF;
END $$;

-- =====================================================
-- END OF SAMPLE USER PROJECTS
-- =====================================================