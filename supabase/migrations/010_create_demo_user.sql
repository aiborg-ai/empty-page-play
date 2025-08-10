-- Create pre-verified demo user for production testing
-- This user will be created with email_confirmed_at set so no verification is needed

-- First, let's create the demo user in auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- instance_id  
    '550e8400-e29b-41d4-a716-446655440000', -- id (fixed UUID for demo user)
    'authenticated', -- aud
    'authenticated', -- role
    'demo@innospot.com', -- email
    crypt('demo123456', gen_salt('bf')), -- encrypted_password (hashed with bcrypt)
    NOW(), -- email_confirmed_at (IMPORTANT: This bypasses email verification)
    NULL, -- invited_at
    '', -- confirmation_token
    NULL, -- confirmation_sent_at
    '', -- recovery_token
    NULL, -- recovery_sent_at
    '', -- email_change_token_new
    '', -- email_change
    NULL, -- email_change_sent_at
    NULL, -- last_sign_in_at
    '{"provider": "email", "providers": ["email"]}', -- raw_app_meta_data
    '{"first_name": "Demo", "last_name": "User", "use_type": "trial", "record_search_history": true}', -- raw_user_meta_data
    false, -- is_super_admin
    NOW(), -- created_at
    NOW(), -- updated_at
    NULL, -- phone
    NULL, -- phone_confirmed_at
    '', -- phone_change
    '', -- phone_change_token
    NULL, -- phone_change_sent_at
    '', -- email_change_token_current
    0, -- email_change_confirm_status
    NULL, -- banned_until
    '', -- reauthentication_token
    NULL, -- reauthentication_sent_at
    false, -- is_sso_user
    NULL -- deleted_at
) ON CONFLICT (id) DO NOTHING;

-- Now create an identity for the demo user (required for email/password auth)
INSERT INTO auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000', -- provider_id (same as user_id for email provider)
    '550e8400-e29b-41d4-a716-446655440000', -- user_id
    '{"sub": "550e8400-e29b-41d4-a716-446655440000", "email": "demo@innospot.com", "email_verified": true, "phone_verified": false}', -- identity_data
    'email', -- provider
    NULL, -- last_sign_in_at
    NOW(), -- created_at
    NOW() -- updated_at
) ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create additional demo users for different use cases
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000000',
    '550e8400-e29b-41d4-a716-446655440001',
    'authenticated', 'authenticated',
    'researcher@innospot.com',
    crypt('researcher123', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"first_name": "Research", "last_name": "User", "use_type": "non-commercial", "record_search_history": true}',
    false, NOW(), NOW()
),
(
    '00000000-0000-0000-0000-000000000000',
    '550e8400-e29b-41d4-a716-446655440002', 
    'authenticated', 'authenticated',
    'commercial@innospot.com',
    crypt('commercial123', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"first_name": "Commercial", "last_name": "User", "use_type": "commercial", "record_search_history": false}',
    false, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create identities for additional demo users
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '{"sub": "550e8400-e29b-41d4-a716-446655440001", "email": "researcher@innospot.com", "email_verified": true, "phone_verified": false}',
    'email', NOW(), NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002', 
    '{"sub": "550e8400-e29b-41d4-a716-446655440002", "email": "commercial@innospot.com", "email_verified": true, "phone_verified": false}',
    'email', NOW(), NOW()
) ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create sample dashboards for the demo user (if dashboard table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboards') THEN
    INSERT INTO public.dashboards (
      id, name, description, type, status, access_level, user_id, 
      layout, widgets, filters, settings, tags, created_at, updated_at
    ) VALUES 
    (
      uuid_generate_v4(),
      'Welcome Dashboard', 
      'Sample dashboard showing key metrics and insights',
      'analytics',
      'published',
      'private',
      '550e8400-e29b-41d4-a716-446655440000',
      'grid',
      '[]',
      '{}',
      '{"theme": "light", "auto_refresh": false}',
      ARRAY['sample', 'demo', 'analytics'],
      NOW(),
      NOW()
    ),
    (
      uuid_generate_v4(),
      'Patent Analysis Dashboard',
      'Comprehensive patent landscape analysis dashboard', 
      'reporting',
      'published',
      'private',
      '550e8400-e29b-41d4-a716-446655440000',
      'flexible',
      '[]',
      '{}',
      '{"theme": "light", "auto_refresh": true}',
      ARRAY['patents', 'analysis', 'research'],
      NOW(),
      NOW()
    ) ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Grant necessary permissions (if using RLS)
-- The RLS policies should already handle user access based on user_id