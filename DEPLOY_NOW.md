# 🚀 Deploy CMS Schema Now - Step by Step

## Quick Deployment Guide

Follow these exact steps to deploy your CMS system:

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard/project/lkpykvqkobvldrpdktks**
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"** button

### Step 2: Execute Migration 1 - Create Tables
Copy and paste this ENTIRE block, then click **"Run"**:

```sql
-- Migration 1: Create CMS Tables and Schema
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
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(owner_id, slug)
);

-- Categories table
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

-- Content types
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
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_contents_status ON public.contents(status);
CREATE INDEX idx_contents_category_id ON public.contents(category_id);

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

### Step 3: Execute Migration 2 - Set Up Security
Click **"New query"** again, then copy/paste and **"Run"**:

```sql
-- Migration 2: Row Level Security and Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Anyone can view active categories" ON public.categories
    FOR SELECT USING (is_active = true);

-- Content types policies (public read)
CREATE POLICY "Anyone can view active content types" ON public.content_types
    FOR SELECT USING (is_active = true);

-- Contents policies
CREATE POLICY "Users can view published contents" ON public.contents
    FOR SELECT USING (status = 'published' OR author_id = auth.uid());
CREATE POLICY "Users can create contents" ON public.contents
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update their contents" ON public.contents
    FOR UPDATE USING (author_id = auth.uid());

-- Projects policies
CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Users can view public projects" ON public.projects
    FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Project owners can update their projects" ON public.projects
    FOR UPDATE USING (owner_id = auth.uid());
```

### Step 4: Execute Migration 3 - Add Sample Data
Click **"New query"** once more, then copy/paste and **"Run"**:

```sql
-- Migration 3: Sample Data and Categories
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

-- Sample showcase content (using a dummy user ID for now)
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
```

### Step 5: Verify Deployment
After running all 3 migrations, verify everything worked by running this test query:

```sql
-- Verification Query
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
    'contents' as table_name, 
    COUNT(*) as count 
FROM public.contents
UNION ALL
SELECT 
    'users' as table_name, 
    COUNT(*) as count 
FROM public.users;
```

**Expected Results:**
- categories: 8 rows
- content_types: 3 rows  
- contents: 3 rows
- users: 0 rows (initially)

## ✅ Success Indicators

If everything worked correctly, you should see:
1. All queries executed without errors
2. Verification query shows expected counts
3. Tables visible in Supabase Dashboard > Table Editor

## 🚀 Next Steps After Deployment

1. **Test the application:**
   ```bash
   npm run dev
   ```

2. **Register as a user** through the app

3. **Make yourself admin** (replace with your email):
   ```sql
   UPDATE public.users 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

4. **Access CMS Admin** from the sidebar (Shield icon)

## 🐛 If Something Goes Wrong

- **Permission errors**: Make sure you're using the SQL Editor in your Supabase dashboard
- **Table already exists**: Some queries might be partially successful - this is okay
- **Foreign key errors**: Make sure you run migrations in the exact order shown

The CMS system will be fully functional once all migrations complete successfully!