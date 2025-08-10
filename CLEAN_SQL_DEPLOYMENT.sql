-- =====================================================
-- MIGRATION 1: CREATE CMS TABLES AND SCHEMA
-- Copy from here to the end of this block and paste into Supabase SQL Editor
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('admin', 'editor', 'user', 'trial');
CREATE TYPE user_account_type AS ENUM ('trial', 'non_commercial', 'commercial');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived', 'on_hold');

CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    account_type user_account_type DEFAULT 'trial',
    organization TEXT,
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    subscription_status TEXT DEFAULT 'inactive',
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    cover_image_url TEXT,
    status project_status DEFAULT 'active',
    owner_id UUID REFERENCES public.users(id) NOT NULL,
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(owner_id, slug)
);

CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    color TEXT DEFAULT '#6b7280',
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(slug)
);

CREATE TABLE public.content_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    schema JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.contents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content_type_id UUID REFERENCES public.content_types(id),
    category_id UUID REFERENCES public.categories(id),
    project_id UUID REFERENCES public.projects(id),
    author_id UUID REFERENCES public.users(id) NOT NULL,
    status content_status DEFAULT 'draft',
    data JSONB DEFAULT '{}',
    excerpt TEXT,
    featured_image_url TEXT,
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_contents_status ON public.contents(status);
CREATE INDEX idx_contents_category_id ON public.contents(category_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON public.contents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- END OF MIGRATION 1
-- =====================================================