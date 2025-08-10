#!/bin/bash

# CMS Enhancement Push Script
# Replace YOUR_PERSONAL_ACCESS_TOKEN with your actual token

echo "🚀 Pushing CMS Enhancement to GitHub"

# Configure git (if not already done)
git config user.email "hirendra.vikram@aiborg.ai"
git config user.name "Hirendra Vikram"

# Set remote URL with token (replace YOUR_PERSONAL_ACCESS_TOKEN)
git remote set-url origin https://YOUR_PERSONAL_ACCESS_TOKEN@github.com/aiborg-ai/appinnospot.git

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Create and checkout feature branch
echo "🌿 Creating feature branch..."
git checkout -b feature/cms-enhancement

# Add all files
echo "📁 Adding files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: Add comprehensive CMS system for AI agents, tools, datasets, dashboards

🔥 Major Features Added:
- Complete database schema with 5 main entity types
- Enhanced AI Agents table with 15+ parameters (API config, cost tracking, capabilities)
- Enhanced Tools table with integration types and schemas
- Enhanced Datasets table with quality scoring and validation rules
- Enhanced Reports table with scheduling and template system
- New Dashboards table with layout, collaboration, and access controls

🛠️ Technical Implementation:
- Row Level Security (RLS) policies for user-specific access
- Full TypeScript interfaces and service layer
- Modern React CMS Studio component
- Advanced search and filtering capabilities
- Project-based collaboration system

📊 Database Enhancements:
- User-specific asset tagging via owner_id
- Access level controls (private/team/org/public)
- Activity logging and audit trails
- Full-text search across all entities
- Template and versioning systems

🎨 UI Components:
- CMSStudio component with tabbed interface
- Asset creation modals with validation
- Card-based responsive layout
- Advanced filtering and search
- Collaboration and sharing features

Files Added/Modified:
- supabase/migrations/004_cms_dashboard_enhancement.sql
- supabase/migrations/005_dashboard_rls_policies.sql
- src/components/CMSStudio.tsx
- src/types/cms.ts (enhanced)
- src/lib/cmsService.ts (enhanced)"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin feature/cms-enhancement

echo "✅ Done! Create a pull request at:"
echo "https://github.com/aiborg-ai/appinnospot/compare/feature/cms-enhancement"