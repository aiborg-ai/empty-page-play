-- Sample Dashboard Data for Testing
-- Run this AFTER running the ultra-safe dashboard migration

-- Note: Replace the owner_id UUIDs with actual user IDs from your auth.users table
-- You can find user IDs by running: SELECT id, email FROM auth.users;

-- Sample Dashboard 1: Analytics Dashboard
INSERT INTO public.dashboards (
    name,
    description,
    type,
    status,
    access_level,
    layout,
    widgets,
    filters,
    theme,
    tags,
    owner_id,
    metadata
) VALUES (
    'Patent Analytics Dashboard',
    'Comprehensive analytics dashboard for patent portfolio analysis including trends, jurisdictions, and competitor insights.',
    'analytics',
    'published',
    'private',
    '{"rows": 3, "columns": 4, "gridGap": 16}',
    '[
        {"id": "patent-trends", "type": "line-chart", "title": "Patent Filing Trends", "position": {"x": 0, "y": 0, "w": 2, "h": 1}},
        {"id": "top-jurisdictions", "type": "bar-chart", "title": "Top Jurisdictions", "position": {"x": 2, "y": 0, "w": 2, "h": 1}},
        {"id": "technology-areas", "type": "pie-chart", "title": "Technology Areas", "position": {"x": 0, "y": 1, "w": 2, "h": 1}},
        {"id": "competitor-analysis", "type": "table", "title": "Competitor Analysis", "position": {"x": 2, "y": 1, "w": 2, "h": 1}},
        {"id": "filing-status", "type": "donut-chart", "title": "Filing Status", "position": {"x": 0, "y": 2, "w": 1, "h": 1}},
        {"id": "recent-patents", "type": "list", "title": "Recent Patents", "position": {"x": 1, "y": 2, "w": 3, "h": 1}}
    ]',
    '{"dateRange": "last-12-months", "jurisdictions": ["US", "EP", "JP"], "status": "granted"}',
    'modern',
    ARRAY['analytics', 'patents', 'dashboard', 'trends'],
    (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
    '{"created_from": "template", "template_version": "1.0", "last_modified_by": "system"}'
);

-- Sample Dashboard 2: KPI Dashboard  
INSERT INTO public.dashboards (
    name,
    description,
    type,
    status,
    access_level,
    layout,
    widgets,
    filters,
    theme,
    tags,
    owner_id,
    metadata
) VALUES (
    'Patent KPI Dashboard',
    'Key performance indicators for patent portfolio management including filing rates, costs, and success metrics.',
    'kpi',
    'published',
    'team',
    '{"rows": 2, "columns": 3, "gridGap": 12}',
    '[
        {"id": "total-patents", "type": "metric-card", "title": "Total Patents", "position": {"x": 0, "y": 0, "w": 1, "h": 1}},
        {"id": "filing-rate", "type": "metric-card", "title": "Monthly Filing Rate", "position": {"x": 1, "y": 0, "w": 1, "h": 1}},
        {"id": "grant-rate", "type": "metric-card", "title": "Grant Success Rate", "position": {"x": 2, "y": 0, "w": 1, "h": 1}},
        {"id": "portfolio-value", "type": "metric-card", "title": "Portfolio Value", "position": {"x": 0, "y": 1, "w": 1, "h": 1}},
        {"id": "maintenance-costs", "type": "metric-card", "title": "Annual Maintenance", "position": {"x": 1, "y": 1, "w": 1, "h": 1}},
        {"id": "roi-metric", "type": "metric-card", "title": "Portfolio ROI", "position": {"x": 2, "y": 1, "w": 1, "h": 1}}
    ]',
    '{"period": "ytd", "currency": "USD"}',
    'minimal',
    ARRAY['kpi', 'metrics', 'performance', 'portfolio'],
    (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
    '{"refresh_rate": 300, "auto_update": true, "data_sources": ["portfolio_api", "cost_tracker"]}'
);

-- Sample Dashboard 3: Monitoring Dashboard
INSERT INTO public.dashboards (
    name,
    description,
    type,
    status,
    access_level,
    layout,
    widgets,
    filters,
    theme,
    tags,
    owner_id,
    metadata
) VALUES (
    'Patent Monitoring Dashboard',
    'Real-time monitoring of patent applications, deadlines, and portfolio health metrics.',
    'monitoring',
    'draft',
    'private',
    '{"rows": 4, "columns": 2, "gridGap": 8}',
    '[
        {"id": "active-applications", "type": "status-list", "title": "Active Applications", "position": {"x": 0, "y": 0, "w": 1, "h": 2}},
        {"id": "upcoming-deadlines", "type": "timeline", "title": "Upcoming Deadlines", "position": {"x": 1, "y": 0, "w": 1, "h": 2}},
        {"id": "system-health", "type": "health-check", "title": "System Health", "position": {"x": 0, "y": 2, "w": 2, "h": 1}},
        {"id": "recent-activity", "type": "activity-feed", "title": "Recent Activity", "position": {"x": 0, "y": 3, "w": 2, "h": 1}}
    ]',
    '{"alertsEnabled": true, "notificationThreshold": 30}',
    'dark',
    ARRAY['monitoring', 'alerts', 'deadlines', 'realtime'],
    (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
    '{"alert_config": {"email": true, "slack": false}, "monitoring_enabled": true}'
);

-- Sample Dashboard 4: Template Dashboard
INSERT INTO public.dashboards (
    name,
    description,
    type,
    status,
    access_level,
    layout,
    widgets,
    filters,
    theme,
    tags,
    owner_id,
    is_template,
    template_category,
    template_data,
    metadata
) VALUES (
    'Basic Patent Dashboard Template',
    'A template for creating basic patent analytics dashboards with standard widgets and layouts.',
    'analytics',
    'published',
    'public',
    '{"rows": 2, "columns": 2, "gridGap": 16}',
    '[
        {"id": "template-chart-1", "type": "line-chart", "title": "Patent Trends", "position": {"x": 0, "y": 0, "w": 2, "h": 1}},
        {"id": "template-chart-2", "type": "bar-chart", "title": "Technology Areas", "position": {"x": 0, "y": 1, "w": 1, "h": 1}},
        {"id": "template-chart-3", "type": "pie-chart", "title": "Jurisdictions", "position": {"x": 1, "y": 1, "w": 1, "h": 1}}
    ]',
    '{"dateRange": "last-6-months"}',
    'default',
    ARRAY['template', 'basic', 'analytics', 'starter'],
    (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
    true,
    'Analytics Templates',
    '{"widgets_config": {"customizable": true, "presets": ["minimal", "detailed"]}, "instructions": "This template provides a basic structure for patent analytics dashboards."}',
    '{"template_version": "1.0", "compatibility": ["v1", "v2"], "usage_count": 0}'
);

-- Sample Dashboard 5: Custom Dashboard
INSERT INTO public.dashboards (
    name,
    description,
    type,
    status,
    access_level,
    layout,
    widgets,
    filters,
    theme,
    color_scheme,
    tags,
    owner_id,
    metadata
) VALUES (
    'Custom Research Dashboard',
    'Customized dashboard for research team with specific metrics and data visualizations for ongoing patent research projects.',
    'custom',
    'published',
    'organization',
    '{"rows": 3, "columns": 3, "gridGap": 20}',
    '[
        {"id": "research-progress", "type": "progress-bar", "title": "Research Progress", "position": {"x": 0, "y": 0, "w": 3, "h": 1}},
        {"id": "citation-analysis", "type": "network-graph", "title": "Citation Network", "position": {"x": 0, "y": 1, "w": 2, "h": 1}},
        {"id": "research-metrics", "type": "scorecard", "title": "Research Metrics", "position": {"x": 2, "y": 1, "w": 1, "h": 1}},
        {"id": "publication-timeline", "type": "gantt-chart", "title": "Publication Timeline", "position": {"x": 0, "y": 2, "w": 3, "h": 1}}
    ]',
    '{"researchArea": "AI", "timeframe": "2024", "includePreprints": true}',
    'research',
    '{"primary": "#2563eb", "secondary": "#64748b", "accent": "#f59e0b", "background": "#f8fafc"}',
    ARRAY['research', 'custom', 'ai', 'publications'],
    (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
    '{"custom_theme": true, "research_focus": "artificial_intelligence", "team_size": 5}'
);

-- Update view counts for more realistic data
UPDATE public.dashboards SET view_count = floor(random() * 100) + 10 WHERE view_count = 0;
UPDATE public.dashboards SET last_viewed_at = NOW() - interval '1 hour' * floor(random() * 24);

-- Add some sample comments (optional)
INSERT INTO public.dashboard_comments (
    dashboard_id,
    user_id,
    content
) SELECT 
    d.id,
    d.owner_id,
    'Great dashboard! Very useful for tracking our patent portfolio.'
FROM public.dashboards d 
WHERE d.name = 'Patent Analytics Dashboard';