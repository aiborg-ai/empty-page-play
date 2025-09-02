-- ============================================================================
-- InnoSpot Database Seed Data Script
-- ============================================================================
-- This script populates the database with sample data for testing and
-- demonstration purposes.
--
-- Run with: psql -h localhost -U innospot_user -d innospot_dev -f scripts/seed-data.sql
-- ============================================================================

-- Clear existing data (in correct order to avoid foreign key conflicts)
DELETE FROM webhook_logs;
DELETE FROM webhooks;
DELETE FROM api_keys;
DELETE FROM report_generations;
DELETE FROM reports;
DELETE FROM workflow_executions;
DELETE FROM workflows;
DELETE FROM activities;
DELETE FROM invention_disclosures;
DELETE FROM team_members;
DELETE FROM competitive_alerts;
DELETE FROM technology_connections;
DELETE FROM white_space_opportunities;
DELETE FROM technology_nodes;
DELETE FROM patents;
DELETE FROM innovation_pipeline;
DELETE FROM competitors;
DELETE FROM integrations;
DELETE FROM api_marketplace;
DELETE FROM notifications;
DELETE FROM space_members;
DELETE FROM spaces;
DELETE FROM user_sessions;
DELETE FROM user_profiles;

-- Reset sequences
ALTER SEQUENCE IF EXISTS user_profiles_id_seq RESTART WITH 1;

-- ============================================================================
-- DEMO USERS
-- ============================================================================

INSERT INTO user_profiles (id, email, username, full_name, role, company, department, title, phone, timezone, is_active, email_verified, created_at) VALUES
-- Admin users
('550e8400-e29b-41d4-a716-446655440001', 'admin@innospot.com', 'admin', 'System Administrator', 'admin', 'InnoSpot', 'IT', 'System Administrator', '+1-555-0101', 'UTC', true, true, NOW() - INTERVAL '30 days'),

-- Demo users (matching InstantAuth credentials)
('550e8400-e29b-41d4-a716-446655440002', 'demo@innospot.com', 'demo_user', 'Demo User', 'user', 'InnoSpot Demo', 'Innovation', 'Innovation Manager', '+1-555-0102', 'UTC', true, true, NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440003', 'researcher@innospot.com', 'researcher', 'Dr. Sarah Chen', 'researcher', 'TechCorp Research', 'R&D', 'Senior Researcher', '+1-555-0103', 'UTC', true, true, NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440004', 'commercial@innospot.com', 'commercial', 'Michael Roberts', 'commercial', 'Innovation Partners', 'Business Development', 'Commercial Director', '+1-555-0104', 'UTC', true, true, NOW() - INTERVAL '15 days'),

-- Additional team members
('550e8400-e29b-41d4-a716-446655440005', 'dr.liu@innospot.com', 'dr_liu', 'Dr. Michael Liu', 'researcher', 'Quantum Labs', 'Research', 'Principal Scientist', '+1-555-0105', 'UTC', true, true, NOW() - INTERVAL '18 days'),
('550e8400-e29b-41d4-a716-446655440006', 'emma.watson@innospot.com', 'emma_watson', 'Dr. Emma Watson', 'researcher', 'BioTech Solutions', 'Biotechnology', 'Research Director', '+1-555-0106', 'UTC', true, true, NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440007', 'john.smith@innospot.com', 'john_smith', 'Dr. John Smith', 'user', 'Energy Innovations', 'Engineering', 'Lead Engineer', '+1-555-0107', 'UTC', true, true, NOW() - INTERVAL '10 days');

-- ============================================================================
-- DEMO SPACES/PROJECTS
-- ============================================================================

INSERT INTO spaces (id, name, description, color, owner_id, is_public, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'AI & Machine Learning', 'Advanced AI research and patent development', '#3b82f6', '550e8400-e29b-41d4-a716-446655440003', true, NOW() - INTERVAL '20 days'),
('660e8400-e29b-41d4-a716-446655440002', 'Quantum Computing', 'Quantum algorithms and hardware innovations', '#8b5cf6', '550e8400-e29b-41d4-a716-446655440005', true, NOW() - INTERVAL '18 days'),
('660e8400-e29b-41d4-a716-446655440003', 'Green Energy Solutions', 'Sustainable energy technologies', '#10b981', '550e8400-e29b-41d4-a716-446655440007', true, NOW() - INTERVAL '15 days'),
('660e8400-e29b-41d4-a716-446655440004', 'Biotechnology Innovations', 'Medical and biotechnology breakthroughs', '#f59e0b', '550e8400-e29b-41d4-a716-446655440006', false, NOW() - INTERVAL '12 days');

-- Add members to spaces
INSERT INTO space_members (space_id, user_id, role, joined_at) VALUES
-- AI & ML space
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'owner', NOW() - INTERVAL '20 days'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'admin', NOW() - INTERVAL '19 days'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'member', NOW() - INTERVAL '18 days'),

-- Quantum space
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'owner', NOW() - INTERVAL '18 days'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'member', NOW() - INTERVAL '17 days'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', 'member', NOW() - INTERVAL '15 days'),

-- Green Energy space
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'owner', NOW() - INTERVAL '15 days'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'admin', NOW() - INTERVAL '14 days'),

-- Biotech space
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', 'owner', NOW() - INTERVAL '12 days'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'member', NOW() - INTERVAL '11 days');

-- ============================================================================
-- INNOVATION PIPELINE DATA
-- ============================================================================

INSERT INTO innovation_pipeline (id, space_id, title, description, stage, priority, assignee_id, assignee_name, due_date, progress, patent_number, technology_category, estimated_value, tags, created_by, created_at) VALUES

-- AI & ML Projects
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'AI-Powered Battery Management System', 'Revolutionary battery management using neural networks for electric vehicles', 'filing', 'high', '550e8400-e29b-41d4-a716-446655440003', 'Dr. Sarah Chen', CURRENT_DATE + INTERVAL '45 days', 75, NULL, 'AI/ML', 8500000.00, ARRAY['ai', 'battery', 'automotive'], '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '120 days'),

('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Computer Vision for Medical Imaging', 'Advanced AI algorithms for medical diagnosis and imaging', 'development', 'critical', '550e8400-e29b-41d4-a716-446655440003', 'Dr. Sarah Chen', CURRENT_DATE + INTERVAL '30 days', 45, NULL, 'AI/ML', 12000000.00, ARRAY['ai', 'medical', 'imaging'], '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '90 days'),

('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Natural Language Processing Engine', 'Advanced NLP engine for patent document analysis', 'research', 'medium', '550e8400-e29b-41d4-a716-446655440005', 'Dr. Michael Liu', CURRENT_DATE + INTERVAL '60 days', 30, NULL, 'AI/ML', 5500000.00, ARRAY['nlp', 'patents', 'analysis'], '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '60 days'),

-- Quantum Computing Projects
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Quantum Encryption Protocol', 'Next-generation encryption for quantum computing era', 'development', 'critical', '550e8400-e29b-41d4-a716-446655440005', 'Dr. Michael Liu', CURRENT_DATE + INTERVAL '75 days', 55, NULL, 'Quantum Computing', 15000000.00, ARRAY['quantum', 'encryption', 'security'], '550e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '150 days'),

('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Quantum Error Correction', 'Advanced error correction algorithms for quantum computers', 'filing', 'high', '550e8400-e29b-41d4-a716-446655440005', 'Dr. Michael Liu', CURRENT_DATE + INTERVAL '20 days', 80, NULL, 'Quantum Computing', 9800000.00, ARRAY['quantum', 'error-correction'], '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '180 days'),

-- Green Energy Projects
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', 'Biodegradable Solar Cell Technology', 'Environmental-friendly solar cells with biodegradable components', 'granted', 'medium', '550e8400-e29b-41d4-a716-446655440007', 'Dr. John Smith', CURRENT_DATE - INTERVAL '30 days', 100, 'US11,456,789', 'Green Energy', 6500000.00, ARRAY['solar', 'biodegradable', 'renewable'], '550e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '365 days'),

('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', 'Smart Grid Optimization Algorithm', 'AI-powered smart grid management and optimization', 'prosecution', 'high', '550e8400-e29b-41d4-a716-446655440007', 'Dr. John Smith', CURRENT_DATE + INTERVAL '90 days', 70, NULL, 'Green Energy', 4200000.00, ARRAY['smart-grid', 'optimization', 'ai'], '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '200 days'),

-- Biotechnology Projects
('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440004', 'Nanobot Medical Delivery System', 'Precision medicine delivery using programmable nanobots', 'development', 'critical', '550e8400-e29b-41d4-a716-446655440006', 'Dr. Emma Watson', CURRENT_DATE + INTERVAL '120 days', 35, NULL, 'Biotechnology', 18000000.00, ARRAY['nanobot', 'medicine', 'delivery'], '550e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '80 days'),

('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440004', 'Gene Therapy Optimization', 'Advanced techniques for gene therapy effectiveness', 'ideation', 'high', '550e8400-e29b-41d4-a716-446655440006', 'Dr. Emma Watson', CURRENT_DATE + INTERVAL '180 days', 15, NULL, 'Biotechnology', 22000000.00, ARRAY['gene-therapy', 'genetics'], '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '30 days');

-- ============================================================================
-- PATENTS DATA
-- ============================================================================

INSERT INTO patents (id, space_id, title, patent_number, filing_date, grant_date, status, technology_category, market_value, licensing_potential, citation_count, maintenance_cost, remaining_life, roi, inventors, jurisdictions, abstract, created_by, created_at) VALUES

-- Granted Patents
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Quantum Encryption Algorithm', 'US11,234,567', '2021-03-15', '2023-06-20', 'granted', 'Quantum Computing', 8500000.00, 95, 142, 25000.00, 18, 340.00, ARRAY['Dr. Michael Liu', 'Dr. Sarah Chen'], ARRAY['US', 'EP'], 'A novel quantum encryption algorithm providing unprecedented security for data transmission in quantum networks.', '550e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '200 days'),

('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'AI-Powered Drug Discovery Platform', 'US11,345,678', '2020-08-10', '2022-11-15', 'granted', 'AI/ML', 12000000.00, 88, 89, 30000.00, 17, 400.00, ARRAY['Dr. Sarah Chen', 'Dr. Emma Watson'], ARRAY['US', 'EP', 'JP'], 'An artificial intelligence platform for accelerated drug discovery and molecular optimization using deep learning techniques.', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '180 days'),

('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'Biodegradable Battery Technology', 'US11,456,789', '2022-01-20', '2024-03-10', 'granted', 'Green Energy', 6500000.00, 72, 56, 20000.00, 19, 325.00, ARRAY['Dr. John Smith'], ARRAY['US'], 'Revolutionary biodegradable battery components that decompose naturally without environmental impact.', '550e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '160 days'),

-- Filed Patents
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'Nanobot Medical Delivery System', 'PCT/US2024/123456', '2024-02-15', NULL, 'filed', 'Biotechnology', 4500000.00, 65, 12, 15000.00, 20, 300.00, ARRAY['Dr. Emma Watson', 'Dr. Sarah Chen'], ARRAY['US', 'EP', 'JP', 'CN'], 'Programmable nanobots for targeted drug delivery and precision medicine applications.', '550e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '100 days'),

('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'Autonomous Vehicle Navigation', 'US10,987,654', '2019-05-10', '2021-08-20', 'granted', 'AI/ML', 9800000.00, 91, 203, 35000.00, 16, 280.00, ARRAY['Dr. Sarah Chen', 'Dr. Michael Liu'], ARRAY['US', 'EP'], 'Advanced AI navigation system for autonomous vehicles with real-time obstacle detection and path optimization.', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '220 days');

-- ============================================================================
-- COMPETITORS DATA
-- ============================================================================

INSERT INTO competitors (id, name, patent_count, recent_filings, tech_domains, threat_level, last_activity, market_cap, location, products, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'TechCorp Industries', 3456, 45, ARRAY['AI/ML', 'Quantum Computing', 'Robotics'], 'high', NOW() - INTERVAL '2 hours', 125000000000.00, 'Silicon Valley, CA', ARRAY['AI Processors', 'Quantum Computers', 'Robotics Systems'], NOW() - INTERVAL '365 days'),

('990e8400-e29b-41d4-a716-446655440002', 'Innovation Labs Inc', 2189, 28, ARRAY['Biotechnology', 'Nanotechnology', 'Green Energy'], 'medium', NOW() - INTERVAL '1 day', 85000000000.00, 'Boston, MA', ARRAY['Gene Therapy', 'Nanomaterials', 'Solar Technology'], NOW() - INTERVAL '300 days'),

('990e8400-e29b-41d4-a716-446655440003', 'Future Systems Corp', 1567, 12, ARRAY['IoT', 'Blockchain', 'Cybersecurity'], 'low', NOW() - INTERVAL '3 days', 45000000000.00, 'Austin, TX', ARRAY['IoT Platforms', 'Security Solutions', 'Blockchain Services'], NOW() - INTERVAL '200 days'),

('990e8400-e29b-41d4-a716-446655440004', 'Quantum Dynamics', 987, 35, ARRAY['Quantum Computing', 'Cryptography'], 'high', NOW() - INTERVAL '4 hours', 28000000000.00, 'Vancouver, Canada', ARRAY['Quantum Processors', 'Encryption Software'], NOW() - INTERVAL '150 days');

-- ============================================================================
-- COMPETITIVE ALERTS DATA
-- ============================================================================

INSERT INTO competitive_alerts (id, type, severity, competitor_id, competitor_name, title, description, patent_number, action_required, recommendations, is_read, created_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'filing', 'critical', '990e8400-e29b-41d4-a716-446655440001', 'TechCorp Industries', 'New Patent Filing in Your Core Technology', 'TechCorp filed a patent for "Advanced Neural Network Battery Optimization" that overlaps with your current R&D in AI-powered battery management.', 'US2025/123456', true, ARRAY['Conduct freedom-to-operate analysis', 'Consider alternative approaches', 'File continuation patent'], false, NOW() - INTERVAL '2 hours'),

('aa0e8400-e29b-41d4-a716-446655440002', 'grant', 'warning', '990e8400-e29b-41d4-a716-446655440002', 'Innovation Labs Inc', 'Patent Granted for Competing Technology', 'Innovation Labs received grant for biodegradable sensor technology that competes with our green energy solutions.', 'US11,345,678', false, ARRAY['Monitor licensing opportunities', 'Analyze patent scope'], false, NOW() - INTERVAL '1 day'),

('aa0e8400-e29b-41d4-a716-446655440003', 'acquisition', 'info', '990e8400-e29b-41d4-a716-446655440003', 'Future Systems Corp', 'Strategic Patent Portfolio Acquisition', 'Future Systems acquired 50+ IoT patents from startup, expanding their portfolio in edge computing.', NULL, false, ARRAY['Review portfolio gaps', 'Consider partnerships'], true, NOW() - INTERVAL '3 days'),

('aa0e8400-e29b-41d4-a716-446655440004', 'filing', 'warning', '990e8400-e29b-41d4-a716-446655440004', 'Quantum Dynamics', 'New Quantum Cryptography Patent', 'Quantum Dynamics filed a patent for quantum key distribution that may affect our encryption protocol development.', 'PCT/CA2024/789123', true, ARRAY['Review patent claims', 'Assess infringement risk'], false, NOW() - INTERVAL '6 hours');

-- ============================================================================
-- TECHNOLOGY NODES DATA
-- ============================================================================

INSERT INTO technology_nodes (id, name, category, connections, convergence_score, position_x, position_y, size, color, created_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'AI/ML', 'Computing', 8, 95, 100.0000, 100.0000, 35, '#3b82f6', NOW() - INTERVAL '30 days'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Quantum Computing', 'Computing', 6, 78, 200.0000, 150.0000, 28, '#8b5cf6', NOW() - INTERVAL '30 days'),
('bb0e8400-e29b-41d4-a716-446655440003', 'Biotechnology', 'Life Sciences', 7, 82, 150.0000, 200.0000, 32, '#10b981', NOW() - INTERVAL '30 days'),
('bb0e8400-e29b-41d4-a716-446655440004', 'Nanotechnology', 'Materials', 5, 71, 300.0000, 100.0000, 25, '#f59e0b', NOW() - INTERVAL '30 days'),
('bb0e8400-e29b-41d4-a716-446655440005', 'Green Energy', 'Energy', 6, 88, 250.0000, 250.0000, 33, '#059669', NOW() - INTERVAL '30 days'),
('bb0e8400-e29b-41d4-a716-446655440006', 'Robotics', 'Automation', 9, 91, 50.0000, 200.0000, 36, '#dc2626', NOW() - INTERVAL '30 days'),
('bb0e8400-e29b-41d4-a716-446655440007', 'IoT', 'Connectivity', 7, 85, 350.0000, 180.0000, 31, '#0ea5e9', NOW() - INTERVAL '30 days'),
('bb0e8400-e29b-41d4-a716-446655440008', 'Blockchain', 'Security', 4, 65, 400.0000, 120.0000, 22, '#6b7280', NOW() - INTERVAL '30 days');

-- ============================================================================
-- TECHNOLOGY CONNECTIONS DATA
-- ============================================================================

INSERT INTO technology_connections (source_id, target_id, strength, innovations, connection_type, description, created_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440003', 85, 23, 'synergy', 'AI applications in drug discovery and medical diagnosis', NOW() - INTERVAL '25 days'),
('bb0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440006', 92, 31, 'synergy', 'AI-powered robotics and autonomous systems', NOW() - INTERVAL '25 days'),
('bb0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440007', 78, 18, 'synergy', 'AI for IoT edge computing and smart devices', NOW() - INTERVAL '25 days'),
('bb0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440001', 71, 12, 'synergy', 'Quantum machine learning algorithms', NOW() - INTERVAL '25 days'),
('bb0e8400-e29b-41d4-a716-446655440003', 'bb0e8400-e29b-41d4-a716-446655440004', 88, 27, 'synergy', 'Nanotechnology in biotechnology applications', NOW() - INTERVAL '25 days'),
('bb0e8400-e29b-41d4-a716-446655440005', 'bb0e8400-e29b-41d4-a716-446655440004', 65, 9, 'synergy', 'Nanomaterials for energy storage and conversion', NOW() - INTERVAL '25 days'),
('bb0e8400-e29b-41d4-a716-446655440006', 'bb0e8400-e29b-41d4-a716-446655440007', 83, 21, 'synergy', 'Robotic systems with IoT connectivity', NOW() - INTERVAL '25 days'),
('bb0e8400-e29b-41d4-a716-446655440007', 'bb0e8400-e29b-41d4-a716-446655440008', 59, 7, 'neutral', 'IoT security using blockchain technology', NOW() - INTERVAL '25 days');

-- ============================================================================
-- WHITE SPACE OPPORTUNITIES DATA
-- ============================================================================

INSERT INTO white_space_opportunities (id, technologies, opportunity, score, market_size, competition_level, recommendations, created_at) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', ARRAY['AI/ML', 'Quantum Computing'], 'Quantum Machine Learning Algorithms', 92, 15000000000.00, 'low', ARRAY['Develop hybrid quantum-classical ML models', 'Patent core algorithms', 'Partner with quantum hardware companies'], NOW() - INTERVAL '20 days'),

('cc0e8400-e29b-41d4-a716-446655440002', ARRAY['Biotechnology', 'Robotics'], 'Surgical Nanobots', 88, 8500000000.00, 'medium', ARRAY['Focus on specific surgical applications', 'Develop safety protocols', 'Collaborate with medical device companies'], NOW() - INTERVAL '20 days'),

('cc0e8400-e29b-41d4-a716-446655440003', ARRAY['Green Energy', 'IoT'], 'Smart Grid Optimization', 85, 12000000000.00, 'medium', ARRAY['Create AI-powered grid management', 'Develop edge computing solutions', 'Partner with utility companies'], NOW() - INTERVAL '20 days'),

('cc0e8400-e29b-41d4-a716-446655440004', ARRAY['Blockchain', 'Biotechnology'], 'Secure Health Records', 79, 6500000000.00, 'high', ARRAY['Focus on privacy-preserving solutions', 'Develop interoperability standards', 'Address regulatory compliance'], NOW() - INTERVAL '20 days');

-- ============================================================================
-- TEAM MEMBERS DATA
-- ============================================================================

INSERT INTO team_members (id, user_id, space_id, name, role, department, expertise, is_active, current_projects, created_at) VALUES
-- AI & ML Team
('dd0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Dr. Sarah Chen', 'Lead Researcher', 'AI Research', ARRAY['Machine Learning', 'Computer Vision', 'Natural Language Processing'], true, ARRAY['AI Battery Management', 'Medical Imaging'], NOW() - INTERVAL '20 days'),

('dd0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'Dr. Michael Liu', 'Senior Scientist', 'AI Research', ARRAY['Deep Learning', 'Reinforcement Learning', 'AI Ethics'], true, ARRAY['NLP Engine'], NOW() - INTERVAL '18 days'),

-- Quantum Team
('dd0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Dr. Michael Liu', 'Principal Scientist', 'Quantum Research', ARRAY['Quantum Algorithms', 'Quantum Cryptography', 'Error Correction'], true, ARRAY['Quantum Encryption', 'Error Correction'], NOW() - INTERVAL '18 days'),

('dd0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Dr. Sarah Chen', 'Collaborator', 'AI Research', ARRAY['Quantum Machine Learning'], true, ARRAY['Quantum-AI Hybrid'], NOW() - INTERVAL '17 days'),

-- Green Energy Team
('dd0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', 'Dr. John Smith', 'Lead Engineer', 'Energy Systems', ARRAY['Solar Technology', 'Battery Systems', 'Smart Grids'], true, ARRAY['Solar Cells', 'Smart Grid'], NOW() - INTERVAL '15 days'),

-- Biotech Team
('dd0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', 'Dr. Emma Watson', 'Research Director', 'Biotechnology', ARRAY['Gene Therapy', 'Nanotechnology', 'Drug Delivery'], true, ARRAY['Nanobots', 'Gene Therapy'], NOW() - INTERVAL '12 days');

-- ============================================================================
-- NOTIFICATIONS DATA
-- ============================================================================

INSERT INTO notifications (id, user_id, type, title, message, severity, is_read, action_url, action_label, created_at) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'patent_alert', 'New Competitor Patent Filed', 'TechCorp Industries filed a patent that may overlap with your AI battery management project.', 'critical', false, '/competitive-intelligence', 'Review Alert', NOW() - INTERVAL '2 hours'),

('ee0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'milestone', 'Project Milestone Due', 'Quantum Encryption Protocol milestone "Security Review" is due in 3 days.', 'warning', false, '/innovation-manager', 'View Project', NOW() - INTERVAL '1 day'),

('ee0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'patent_granted', 'Patent Granted!', 'Congratulations! Your patent "Biodegradable Battery Technology" has been granted.', 'info', true, '/patents/US11,456,789', 'View Patent', NOW() - INTERVAL '5 days'),

('ee0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'collaboration', 'New Team Member Added', 'Dr. Michael Liu has been added to the AI & ML project team.', 'info', false, '/team-hub', 'View Team', NOW() - INTERVAL '7 days'),

('ee0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006', 'budget_alert', 'Budget Optimization Available', 'AI analysis suggests reallocating 15% of budget could increase ROI by 23%.', 'warning', false, '/innovation-manager', 'View Recommendations', NOW() - INTERVAL '3 days');

-- ============================================================================
-- API MARKETPLACE SAMPLE DATA
-- ============================================================================

INSERT INTO api_marketplace (id, name, provider, category, description, version, base_url, documentation_url, pricing_model, rate_limit, supports_webhook, required_scopes, is_active, featured, created_at) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', 'USPTO Patent Database API', 'US Patent Office', 'Patent Data', 'Official USPTO patent search and data retrieval API', '3.0', 'https://api.uspto.gov/patents/v3', 'https://developer.uspto.gov/apis', 'free', 1000, true, ARRAY['read:patents', 'search:patents'], true, true, NOW() - INTERVAL '100 days'),

('ff0e8400-e29b-41d4-a716-446655440002', 'Google Patents Public API', 'Google', 'Patent Search', 'Google Patents search and analysis API with AI-powered insights', '2.1', 'https://api.patents.google.com/v2', 'https://developers.google.com/patents', 'freemium', 5000, false, ARRAY['read:patents'], true, true, NOW() - INTERVAL '80 days'),

('ff0e8400-e29b-41d4-a716-446655440003', 'OpenAI GPT API', 'OpenAI', 'AI/ML', 'Advanced language model API for patent analysis and generation', '4.0', 'https://api.openai.com/v1', 'https://platform.openai.com/docs', 'paid', 3000, true, ARRAY['generate:text', 'analyze:text'], true, true, NOW() - INTERVAL '60 days'),

('ff0e8400-e29b-41d4-a716-446655440004', 'Semantic Scholar API', 'Allen Institute', 'Research', 'Academic paper and research publication search API', '1.0', 'https://api.semanticscholar.org/v1', 'https://api.semanticscholar.org/', 'free', 100, false, ARRAY['read:papers'], true, false, NOW() - INTERVAL '40 days');

-- ============================================================================
-- ACTIVITIES LOG SAMPLE DATA
-- ============================================================================

INSERT INTO activities (id, type, actor_id, actor_name, action, target_type, target_id, details, created_at) VALUES
('gg0e8400-e29b-41d4-a716-446655440001', 'edit', '550e8400-e29b-41d4-a716-446655440003', 'Dr. Sarah Chen', 'Updated project progress to 75%', 'innovation_pipeline', '770e8400-e29b-41d4-a716-446655440001', '{"progress_from": 70, "progress_to": 75}', NOW() - INTERVAL '2 hours'),

('gg0e8400-e29b-41d4-a716-446655440002', 'comment', '550e8400-e29b-41d4-a716-446655440005', 'Dr. Michael Liu', 'Added technical review comments', 'invention_disclosure', 'hh0e8400-e29b-41d4-a716-446655440001', '{"comment_count": 3}', NOW() - INTERVAL '1 day'),

('gg0e8400-e29b-41d4-a716-446655440003', 'approval', '550e8400-e29b-41d4-a716-446655440002', 'Demo User', 'Approved patent filing request', 'innovation_pipeline', '770e8400-e29b-41d4-a716-446655440004', '{"approval_type": "filing"}', NOW() - INTERVAL '3 days'),

('gg0e8400-e29b-41d4-a716-446655440004', 'assignment', '550e8400-e29b-41d4-a716-446655440007', 'Dr. John Smith', 'Assigned project to team member', 'innovation_pipeline', '770e8400-e29b-41d4-a716-446655440007', '{"assigned_to": "550e8400-e29b-41d4-a716-446655440007"}', NOW() - INTERVAL '5 days'),

('gg0e8400-e29b-41d4-a716-446655440005', 'submission', '550e8400-e29b-41d4-a716-446655440006', 'Dr. Emma Watson', 'Submitted invention disclosure', 'invention_disclosure', 'hh0e8400-e29b-41d4-a716-446655440002', '{"disclosure_type": "biotech"}', NOW() - INTERVAL '7 days');

-- ============================================================================
-- INVENTION DISCLOSURES SAMPLE DATA
-- ============================================================================

INSERT INTO invention_disclosures (id, space_id, title, status, assignee_id, progress, description, technical_field, prior_art, created_by, created_at) VALUES
('hh0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Quantum Key Distribution Protocol', 'review', '550e8400-e29b-41d4-a716-446655440005', 80, 'Novel protocol for secure quantum key distribution with enhanced error correction.', 'Quantum Computing', ARRAY['US10,123,456', 'EP2,345,678'], '550e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '14 days'),

('hh0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', 'Targeted Drug Delivery Nanobots', 'submitted', '550e8400-e29b-41d4-a716-446655440006', 60, 'Programmable nanobots for precise drug delivery to specific cellular targets.', 'Biotechnology', ARRAY['US9,876,543', 'WO2020/123456'], '550e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '10 days'),

('hh0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Federated Learning for Edge AI', 'draft', '550e8400-e29b-41d4-a716-446655440003', 25, 'Distributed machine learning approach for privacy-preserving AI on edge devices.', 'AI/ML', ARRAY[], '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '5 days');

-- Update sequences to prevent conflicts
SELECT setval('user_profiles_id_seq', (SELECT MAX(id) FROM user_profiles) + 1, true);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '🎉 InnoSpot database seeded successfully!';
    RAISE NOTICE '👥 Users created: %', (SELECT COUNT(*) FROM user_profiles);
    RAISE NOTICE '🏢 Spaces created: %', (SELECT COUNT(*) FROM spaces);
    RAISE NOTICE '💡 Innovation projects: %', (SELECT COUNT(*) FROM innovation_pipeline);
    RAISE NOTICE '📄 Patents: %', (SELECT COUNT(*) FROM patents);
    RAISE NOTICE '🏭 Competitors: %', (SELECT COUNT(*) FROM competitors);
    RAISE NOTICE '🔔 Alerts: %', (SELECT COUNT(*) FROM competitive_alerts);
    RAISE NOTICE '🧪 Technology nodes: %', (SELECT COUNT(*) FROM technology_nodes);
    RAISE NOTICE '🔗 Tech connections: %', (SELECT COUNT(*) FROM technology_connections);
    RAISE NOTICE '⚪ White spaces: %', (SELECT COUNT(*) FROM white_space_opportunities);
    RAISE NOTICE '👨‍💼 Team members: %', (SELECT COUNT(*) FROM team_members);
    RAISE NOTICE '📋 Invention disclosures: %', (SELECT COUNT(*) FROM invention_disclosures);
    RAISE NOTICE '🔔 Notifications: %', (SELECT COUNT(*) FROM notifications);
    RAISE NOTICE '🔌 API marketplace: %', (SELECT COUNT(*) FROM api_marketplace);
    RAISE NOTICE '📊 Activities logged: %', (SELECT COUNT(*) FROM activities);
    RAISE NOTICE '';
    RAISE NOTICE '✅ Database is ready for testing!';
    RAISE NOTICE '🔑 Demo login credentials:';
    RAISE NOTICE '   - demo@innospot.com (Demo User)';
    RAISE NOTICE '   - researcher@innospot.com (Dr. Sarah Chen)';
    RAISE NOTICE '   - commercial@innospot.com (Michael Roberts)';
END $$;