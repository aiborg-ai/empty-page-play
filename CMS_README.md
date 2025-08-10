# InnoSpot CMS System

A comprehensive Content Management System built on Supabase for the InnoSpot patent intelligence platform.

## Overview

The CMS system provides:
- **User Management**: Role-based access control (admin, editor, user, trial)
- **Project Management**: Organize work into projects with collaboration features
- **Content Management**: Flexible content system with types and categories
- **Asset Management**: AI agents, tools, datasets, and reports
- **Activity Tracking**: Comprehensive audit log and user activity tracking
- **Full-text Search**: Advanced search across all content types

## Database Schema

### Core Tables

#### Users & Organizations
- `users` - User profiles and account information
- `organizations` - Company/team organization data
- `project_collaborators` - Project access and permissions

#### Projects & Content
- `projects` - Research projects and workspaces
- `categories` - Content organization categories
- `content_types` - Flexible content type definitions
- `contents` - Main content storage with JSON data fields

#### Assets
- `ai_agents` - AI agent configurations and templates
- `tools` - Analysis and processing tools
- `datasets` - Research datasets and file storage
- `reports` - Generated reports and analytics
- `files` - File uploads and media management

#### System
- `activities` - User action audit log and activity tracking

### Key Features

#### Row Level Security (RLS)
All tables implement comprehensive RLS policies:
- Users can only access their own data
- Project-based access control for collaborative content
- Admin users have elevated permissions
- Public content visibility controls

#### Full-text Search
- Automatic search vector generation for content
- Multi-field search across titles, descriptions, and content
- Tag-based filtering and categorization

#### Activity Logging
- Automatic tracking of all user actions
- Resource-specific activity logs
- IP address and user agent tracking for security

## API Service Layer

### CMSService Class
Centralized service for all CMS operations:

```typescript
const cms = CMSService.getInstance();

// Projects
const projects = await cms.getProjects({ status: 'active' });
const project = await cms.createProject({ name: 'New Research Project' });

// Content
const contents = await cms.getContents({ category_id: 'ai-ml' });
const content = await cms.createContent({
  title: 'New AI Tool',
  data: { features: ['analysis', 'automation'] }
});

// Assets
const agents = await cms.getAIAgents(projectId);
const tools = await cms.getTools(projectId);
const datasets = await cms.getDatasets(projectId);
```

## Installation & Setup

### 1. Deploy Database Schema

```bash
# Set your Supabase service key
export SUPABASE_SERVICE_KEY=your_service_key_here

# Deploy the CMS schema
node scripts/deploy-cms.js
```

### 2. Environment Configuration

The application uses the existing Supabase configuration in `.env`:

```env
VITE_SUPABASE_URL=https://lkpykvqkobvldrpdktks.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Initialize CMS Service

```typescript
import { CMSService } from './lib/cmsService';

const cms = CMSService.getInstance();
const currentUser = await cms.getCurrentUser();
```

## Usage Examples

### Creating a Project

```typescript
const project = await cms.createProject({
  name: 'Electric Vehicle Patents',
  description: 'Research project focusing on EV technology trends',
  color: '#10b981',
  tags: ['electric-vehicles', 'patents', 'automotive']
});
```

### Adding Showcase Content

```typescript
const showcaseItem = await cms.createContent({
  title: 'Advanced Patent Analyzer',
  content_type_id: 'showcase-item-type-id',
  category_id: 'ai-ml-category-id',
  data: {
    features: ['AI-powered analysis', 'Citation networks', 'Trend detection'],
    pricing: { type: 'subscription', starting_price: 99 },
    provider: 'InnoSpot'
  },
  status: 'published'
});
```

### Managing AI Agents

```typescript
const agent = await cms.createAIAgent({
  name: 'Research Synthesizer',
  type: 'research',
  model: 'gpt-4',
  prompt_template: 'Analyze the following patent data...',
  project_id: 'project-uuid'
});
```

## Content Types

### Showcase Items
Flexible schema for marketplace/showcase items:
- Features and capabilities
- Pricing information
- Provider details
- Demo URLs and documentation

### Blog Posts & Documentation
Rich content with SEO optimization:
- Full-text content with formatting
- Reading time estimation
- SEO metadata

### Case Studies & Tutorials
Educational content with structured data:
- Step-by-step instructions
- Difficulty levels and prerequisites
- Industry-specific examples

## Security Features

### Authentication
- Supabase Auth integration
- JWT-based session management
- Role-based access control

### Data Protection
- Row Level Security on all tables
- Project-based data isolation
- Audit logging for compliance

### API Security
- Rate limiting (configured in Supabase)
- Input validation and sanitization
- SQL injection prevention through parameterized queries

## Performance Optimization

### Database Indexing
Optimized indexes for common queries:
- User and project lookups
- Content search and filtering
- Activity log queries

### Caching Strategy
- Client-side query caching
- Supabase built-in caching
- CDN integration for static assets

## Monitoring & Analytics

### Activity Tracking
- User behavior analytics
- Content performance metrics
- System usage statistics

### Error Monitoring
- Comprehensive error logging
- Performance monitoring
- User experience tracking

## Development Workflow

### Local Development
1. Clone the repository
2. Set up environment variables
3. Deploy schema to development Supabase instance
4. Run the development server

### Testing
```bash
# Run tests
npm test

# Run specific CMS tests
npm test -- cms
```

### Deployment
```bash
# Build for production
npm run build

# Deploy to staging/production
npm run deploy
```

## API Reference

### Projects API
- `GET /api/projects` - List projects with filtering
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Content API
- `GET /api/contents` - List content with search and filtering
- `POST /api/contents` - Create new content
- `GET /api/contents/:id` - Get content details
- `PUT /api/contents/:id` - Update content
- `DELETE /api/contents/:id` - Delete content

### Search API
- `GET /api/search?q=query` - Global search across all content types
- `GET /api/search/projects?q=query` - Project-specific search
- `GET /api/search/contents?q=query` - Content search with filters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request

## Support

For questions or issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

*Generated for InnoSpot CMS System*