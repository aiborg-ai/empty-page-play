# Deploying the InnoSpot CMS System

## Quick Start

To deploy the CMS system to your Supabase database, you'll need to execute the SQL migration files. Here are two methods:

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project: `Innospot_webapp_cc`
   - Go to the SQL Editor

2. **Execute Migration Files**
   
   Copy and paste each file content in order:
   
   **Step 1:** Execute `supabase/migrations/001_initial_cms_schema.sql`
   ```sql
   -- Copy and paste the entire content of 001_initial_cms_schema.sql
   -- This creates all tables, indexes, and triggers
   ```
   
   **Step 2:** Execute `supabase/migrations/002_rls_policies.sql`
   ```sql
   -- Copy and paste the entire content of 002_rls_policies.sql
   -- This sets up Row Level Security policies
   ```
   
   **Step 3:** Execute `supabase/migrations/003_seed_data.sql`
   ```sql
   -- Copy and paste the entire content of 003_seed_data.sql
   -- This adds initial categories, content types, and sample data
   ```

### Method 2: Using Node.js Script (Advanced)

1. **Set Environment Variable**
   ```bash
   export SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```

2. **Run Deployment Script**
   ```bash
   node scripts/deploy-cms.js
   ```

## What Gets Created

### Database Tables
- **users** - Extended user profiles with roles and preferences
- **organizations** - Team/company organization management
- **projects** - Research projects and workspaces
- **project_collaborators** - Project access and permissions
- **categories** - Content organization categories
- **content_types** - Flexible content type definitions
- **contents** - Main content storage with JSON data
- **ai_agents** - AI agent configurations
- **tools** - Analysis and processing tools
- **datasets** - Research datasets and files
- **reports** - Generated reports and analytics
- **files** - File uploads and media management
- **activities** - User action audit log

### Security Features
- Row Level Security (RLS) enabled on all tables
- Role-based access control (admin, editor, user, trial)
- Project-based data isolation
- Activity logging for audit trails

### Sample Data
- 8 default categories (AI & ML, Analysis Tools, Search, etc.)
- 5 content types (Showcase Item, Blog Post, Documentation, etc.)
- Sample showcase items for each category
- Activity logging triggers

## Verification

After deployment, verify the setup:

1. **Check Tables**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

2. **Check Sample Data**
   ```sql
   SELECT name FROM categories;
   SELECT title FROM contents WHERE status = 'published';
   ```

3. **Test RLS Policies**
   ```sql
   -- This should return empty for anonymous users
   SELECT * FROM users;
   ```

## Using the CMS

### In Your Application

1. **Import CMS Service**
   ```typescript
   import { CMSService } from './lib/cmsService';
   const cms = CMSService.getInstance();
   ```

2. **Get Current User**
   ```typescript
   const currentUser = await cms.getCurrentUser();
   ```

3. **Fetch Content**
   ```typescript
   const projects = await cms.getProjects();
   const showcaseItems = await cms.getContents({ 
     content_type: 'showcase-item',
     status: 'published' 
   });
   ```

### Admin Interface

Access the CMS admin interface by adding this route to your application:

```typescript
// In App.tsx or your router
{activeSection === 'cms-admin' && (
  <CMSAdmin onNavigate={handleNavigate} />
)}
```

## Next Steps

1. **Create First Admin User**
   - Register through your application
   - Manually update user role to 'admin' in Supabase dashboard:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

2. **Add Real Content**
   - Use the CMS admin interface to create projects
   - Add content items for your showcase
   - Configure AI agents and tools

3. **Customize Schema**
   - Modify content types to match your needs
   - Add custom categories
   - Extend user profiles as needed

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Ensure you're using the service role key for deployment
   - Check that RLS policies are properly configured

2. **Missing Data**
   - Verify all migration files were executed in order
   - Check that seed data was properly inserted

3. **Application Errors**
   - Ensure environment variables are set correctly
   - Verify Supabase client configuration

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Review Supabase logs in the dashboard
3. Verify database schema in the Table Editor
4. Test API calls using the Supabase dashboard

---

Your CMS system is now ready to power the InnoSpot application!