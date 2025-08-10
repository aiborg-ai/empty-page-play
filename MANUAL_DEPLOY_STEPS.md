# Manual CMS Deployment Steps

## Step 1: Open Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/lkpykvqkobvldrpdktks
2. Click on **SQL Editor** in the left sidebar

## Step 2: Execute Migration 1 - Create Schema

Copy and paste this entire content into the SQL Editor and click **Run**:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'user', 'trial');
CREATE TYPE user_account_type AS ENUM ('trial', 'non_commercial', 'commercial');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived', 'on_hold');

-- Users table (extends Supabase auth.users)
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

-- Organizations table
CREATE TABLE public.organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    settings JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    cover_image_url TEXT,
    status project_status DEFAULT 'active',
    owner_id UUID REFERENCES public.users(id) NOT NULL,
    organization_id UUID REFERENCES public.organizations(id),
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(owner_id, slug)
);

-- Project collaborators
CREATE TABLE public.project_collaborators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'viewer',
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES public.users(id),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ,
    UNIQUE(project_id, user_id)
);

-- Categories table
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id),
    sort_order INTEGER DEFAULT 0,
    color TEXT DEFAULT '#6b7280',
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(slug)
);

-- Content types
CREATE TABLE public.content_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    schema JSONB NOT NULL DEFAULT '{}',
    template TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contents table
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
    search_vector tsvector,
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_type_id, slug)
);

-- Create indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_contents_status ON public.contents(status);
CREATE INDEX idx_contents_category_id ON public.contents(category_id);
CREATE INDEX idx_contents_search_vector ON public.contents USING gin(search_vector);

-- Update triggers
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
```

## Step 3: Execute Migration 2 - Set Up Security

Copy and paste this entire content and click **Run**:

```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Basic RLS policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view active categories" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active content types" ON public.content_types
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view published contents" ON public.contents
    FOR SELECT USING (status = 'published' OR author_id = auth.uid());

CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view public projects" ON public.projects
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Project owners can update their projects" ON public.projects
    FOR UPDATE USING (owner_id = auth.uid());
```

## Step 4: Execute Migration 3 - Add Sample Data

Copy and paste this entire content and click **Run**:

```sql
-- Insert categories
INSERT INTO public.categories (name, slug, description, color, icon) VALUES
('AI & Machine Learning', 'ai-ml', 'Artificial Intelligence and Machine Learning technologies', '#8b5cf6', 'Bot'),
('Analysis Tools', 'analysis', 'Data analysis and research tools', '#10b981', 'BarChart3'),
('Search & Discovery', 'search', 'Search engines and discovery tools', '#f59e0b', 'Search'),
('Visualization', 'visualization', 'Data visualization and charting tools', '#06b6d4', 'PieChart'),
('Export & Reports', 'export', 'Export tools and report generation', '#6b7280', 'Download'),
('Patent Research', 'patents', 'Patent research and analysis', '#3b82f6', 'FileText'),
('Market Intelligence', 'market', 'Market research and competitive analysis', '#ef4444', 'TrendingUp'),
('Legal & Compliance', 'legal', 'Legal analysis and compliance tools', '#7c3aed', 'Scale');

-- Insert content types
INSERT INTO public.content_types (name, slug, description, schema) VALUES
('Showcase Item', 'showcase-item', 'Items displayed in the showcase', '{"type": "object", "properties": {"category": {"type": "string"}, "features": {"type": "array"}, "pricing": {"type": "object"}}}'),
('Blog Post', 'blog-post', 'Blog posts and articles', '{"type": "object", "properties": {"content": {"type": "string"}, "summary": {"type": "string"}}}'),
('Documentation', 'documentation', 'Help and documentation pages', '{"type": "object", "properties": {"content": {"type": "string"}, "section": {"type": "string"}}}');
```

## Step 5: Verify Deployment

Run this query to check if everything was created successfully:

```sql
SELECT 
    'categories' as table_name, 
    COUNT(*) as count 
FROM public.categories
UNION ALL
SELECT 
    'content_types' as table_name, 
    COUNT(*) as count 
FROM public.content_types
UNION ALL
SELECT 
    'users' as table_name, 
    COUNT(*) as count 
FROM public.users;
```

You should see:
- categories: 8 rows
- content_types: 3 rows  
- users: 0 rows (initially empty)

## Next Steps

After successful deployment:

1. **Test the connection** by running:
   ```bash
   node test-cms-deployment.js
   ```

2. **Register your first user** through the application

3. **Make yourself admin** by running this in Supabase SQL Editor:
   ```sql
   UPDATE public.users 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

4. **Access CMS Admin** through the application interface

That's it! Your CMS system is now deployed and ready to use.