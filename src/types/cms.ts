// CMS Types for InnoSpot application

export type UserRole = 'admin' | 'editor' | 'user' | 'trial';
export type UserAccountType = 'trial' | 'non_commercial' | 'commercial';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type ProjectStatus = 'active' | 'completed' | 'archived' | 'on_hold';
export type DashboardStatus = 'draft' | 'published' | 'archived' | 'template';
export type DashboardType = 'analytics' | 'reporting' | 'monitoring' | 'kpi' | 'custom';
export type AccessLevel = 'private' | 'team' | 'organization' | 'public';

// Database table interfaces
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  role: UserRole;
  account_type: UserAccountType;
  organization?: string;
  bio?: string;
  preferences: Record<string, any>;
  subscription_status: string;
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  settings: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  cover_image_url?: string;
  status: ProjectStatus;
  owner_id: string;
  organization_id?: string;
  settings: Record<string, any>;
  metadata: Record<string, any>;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  
  // Enhanced project fields
  project_type?: string;
  progress?: number;
  budget?: number;
  currency?: string;
  deadline?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  collaborators_array?: string[];
  external_links?: Record<string, any>[];
  notes?: string;
  
  // Relations
  owner?: User;
  organization?: Organization;
  collaborators?: ProjectCollaborator[];
  asset_count?: number;
  collaborator_count?: number;
}

export interface ProjectCollaborator {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  permissions: Record<string, any>;
  invited_by?: string;
  invited_at: string;
  joined_at?: string;
  
  // Relations
  user?: User;
  project?: Project;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  sort_order: number;
  color: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  parent?: Category;
  children?: Category[];
}

export interface ContentType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  schema: Record<string, any>;
  template?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  content_type_id?: string;
  category_id?: string;
  project_id?: string;
  author_id: string;
  status: ContentStatus;
  data: Record<string, any>;
  excerpt?: string;
  featured_image_url?: string;
  metadata: Record<string, any>;
  tags: string[];
  view_count: number;
  is_featured: boolean;
  published_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  content_type?: ContentType;
  category?: Category;
  project?: Project;
  author?: User;
}

export interface AIAgent {
  id: string;
  name: string;
  description?: string;
  type: string;
  model?: string;
  prompt_template?: string;
  parameters: Record<string, any>;
  project_id?: string;
  owner_id: string;
  is_active: boolean;
  usage_count: number;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
  
  // Enhanced parameters
  category?: string;
  version?: string;
  api_endpoint?: string;
  api_key_required?: boolean;
  input_schema?: Record<string, any>;
  output_schema?: Record<string, any>;
  rate_limit?: number;
  cost_per_call?: number;
  tags?: string[];
  capabilities?: any[];
  training_data?: string;
  model_size?: string;
  accuracy_metrics?: Record<string, any>;
  is_public?: boolean;
  
  // Relations
  project?: Project;
  owner?: User;
}

export interface Tool {
  id: string;
  name: string;
  description?: string;
  type: string;
  category?: string;
  configuration: Record<string, any>;
  project_id?: string;
  owner_id: string;
  is_active: boolean;
  usage_count: number;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
  
  // Enhanced parameters
  version?: string;
  api_endpoint?: string;
  authentication?: Record<string, any>;
  input_schema?: Record<string, any>;
  output_schema?: Record<string, any>;
  rate_limit?: number;
  cost_per_use?: number;
  tags?: string[];
  supported_formats?: string[];
  requirements?: Record<string, any>;
  documentation_url?: string;
  is_public?: boolean;
  integration_type?: string;
  
  // Relations
  project?: Project;
  owner?: User;
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  type?: string;
  source?: string;
  file_url?: string;
  file_size?: number;
  record_count?: number;
  schema?: Record<string, any>;
  metadata: Record<string, any>;
  project_id?: string;
  owner_id: string;
  is_public: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
  
  // Enhanced parameters
  version?: string;
  format?: string;
  encoding?: string;
  compression?: string;
  access_level?: AccessLevel;
  license?: string;
  tags?: string[];
  quality_score?: number;
  freshness?: string;
  validation_rules?: Record<string, any>;
  sample_data?: Record<string, any>;
  statistics?: Record<string, any>;
  related_datasets?: string[];
  
  // Relations
  project?: Project;
  owner?: User;
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  type?: string;
  content: Record<string, any>;
  charts: Record<string, any>;
  filters: Record<string, any>;
  project_id?: string;
  author_id: string;
  status: ContentStatus;
  is_template: boolean;
  view_count: number;
  shared_count: number;
  created_at: string;
  updated_at: string;
  
  // Enhanced parameters
  version?: string;
  template_id?: string;
  schedule?: Record<string, any>;
  recipients?: any[];
  export_formats?: string[];
  data_sources?: any[];
  refresh_frequency?: string;
  last_generated_at?: string;
  next_generation_at?: string;
  tags?: string[];
  access_level?: AccessLevel;
  interactive?: boolean;
  parameters_schema?: Record<string, any>;
  
  // Relations
  project?: Project;
  author?: User;
  template?: Report;
}

export interface File {
  id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  file_url: string;
  thumbnail_url?: string;
  alt_text?: string;
  project_id?: string;
  uploaded_by: string;
  is_public: boolean;
  metadata: Record<string, any>;
  created_at: string;
  
  // Relations
  project?: Project;
  uploader?: User;
}

export interface Activity {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  project_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  
  // Relations
  user?: User;
  project?: Project;
}

// Dashboard-related interfaces
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  type: DashboardType;
  status: DashboardStatus;
  access_level: AccessLevel;
  
  // Layout and configuration
  layout: Record<string, any>;
  widgets: any[];
  filters: Record<string, any>;
  refresh_interval: number;
  
  // Styling and appearance
  theme: string;
  color_scheme: Record<string, any>;
  custom_css?: string;
  
  // Data sources and connections
  data_sources: any[];
  queries: Record<string, any>;
  parameters: Record<string, any>;
  
  // Permissions and sharing
  permissions: Record<string, any>;
  share_settings: Record<string, any>;
  embed_settings: Record<string, any>;
  
  // Ownership and project association
  project_id?: string;
  owner_id: string;
  organization_id?: string;
  
  // Categories and tags
  category_id?: string;
  tags: string[];
  
  // Usage tracking
  view_count: number;
  last_viewed_at?: string;
  usage_stats: Record<string, any>;
  
  // Template functionality
  is_template: boolean;
  template_category?: string;
  template_data: Record<string, any>;
  
  // Metadata and settings
  metadata: Record<string, any>;
  settings: Record<string, any>;
  version: number;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  published_at?: string;
  archived_at?: string;
  
  // Relations
  project?: Project;
  owner?: User;
  organization?: Organization;
  category?: Category;
  collaborators?: DashboardCollaborator[];
}

export interface DashboardCollaborator {
  id: string;
  dashboard_id: string;
  user_id: string;
  role: string;
  permissions: Record<string, any>;
  invited_by?: string;
  invited_at: string;
  accepted_at?: string;
  
  // Relations
  dashboard?: Dashboard;
  user?: User;
  inviter?: User;
}

export interface DashboardComment {
  id: string;
  dashboard_id: string;
  user_id?: string;
  widget_id?: string;
  content: string;
  position?: Record<string, any>;
  is_resolved: boolean;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  dashboard?: Dashboard;
  user?: User;
  parent?: DashboardComment;
  replies?: DashboardComment[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Query parameter types
export interface QueryParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
}

export interface ProjectQueryParams extends QueryParams {
  status?: ProjectStatus;
  owner_id?: string;
  organization_id?: string;
  is_public?: boolean;
}

export interface ContentQueryParams extends QueryParams {
  status?: ContentStatus;
  author_id?: string;
  category_id?: string;
  project_id?: string;
  content_type?: string;
  tags?: string[];
  is_featured?: boolean;
}

// Form data types
export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
  cover_image_url?: string;
  organization_id?: string;
  tags?: string[];
  is_public?: boolean;
  project_type?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  budget?: number;
  currency?: string;
  notes?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: ProjectStatus;
  metadata?: Record<string, any>;
  settings?: Record<string, any>;
  progress?: number;
  external_links?: Record<string, any>[];
  collaborators_array?: string[];
}

export interface CreateContentData {
  title: string;
  content_type_id?: string;
  category_id?: string;
  project_id?: string;
  data: Record<string, any>;
  excerpt?: string;
  featured_image_url?: string;
  tags?: string[];
  status?: ContentStatus;
  is_featured?: boolean;
}

export interface UpdateContentData extends Partial<CreateContentData> {
  metadata?: Record<string, any>;
  published_at?: string;
  expires_at?: string;
}

export interface CreateAIAgentData {
  name: string;
  description?: string;
  type: string;
  model?: string;
  prompt_template?: string;
  parameters?: Record<string, any>;
  project_id?: string;
  category?: string;
  version?: string;
  api_endpoint?: string;
  api_key_required?: boolean;
  input_schema?: Record<string, any>;
  output_schema?: Record<string, any>;
  rate_limit?: number;
  cost_per_call?: number;
  tags?: string[];
  capabilities?: any[];
  training_data?: string;
  model_size?: string;
  accuracy_metrics?: Record<string, any>;
  is_public?: boolean;
}

export interface CreateToolData {
  name: string;
  description?: string;
  type: string;
  category?: string;
  configuration?: Record<string, any>;
  project_id?: string;
  version?: string;
  api_endpoint?: string;
  authentication?: Record<string, any>;
  input_schema?: Record<string, any>;
  output_schema?: Record<string, any>;
  rate_limit?: number;
  cost_per_use?: number;
  tags?: string[];
  supported_formats?: string[];
  requirements?: Record<string, any>;
  documentation_url?: string;
  is_public?: boolean;
  integration_type?: string;
}

export interface CreateDatasetData {
  name: string;
  description?: string;
  type?: string;
  source?: string;
  file_url?: string;
  schema?: Record<string, any>;
  project_id?: string;
  is_public?: boolean;
  version?: string;
  format?: string;
  encoding?: string;
  compression?: string;
  access_level?: AccessLevel;
  license?: string;
  tags?: string[];
  quality_score?: number;
  validation_rules?: Record<string, any>;
  sample_data?: Record<string, any>;
  statistics?: Record<string, any>;
  related_datasets?: string[];
}

export interface CreateReportData {
  title: string;
  description?: string;
  type?: string;
  content: Record<string, any>;
  charts?: Record<string, any>;
  filters?: Record<string, any>;
  project_id?: string;
  status?: ContentStatus;
  is_template?: boolean;
  version?: string;
  template_id?: string;
  schedule?: Record<string, any>;
  recipients?: any[];
  export_formats?: string[];
  data_sources?: any[];
  refresh_frequency?: string;
  tags?: string[];
  access_level?: AccessLevel;
  interactive?: boolean;
  parameters_schema?: Record<string, any>;
}

export interface CreateDashboardData {
  name: string;
  description?: string;
  type: DashboardType;
  access_level?: AccessLevel;
  layout?: Record<string, any>;
  widgets?: any[];
  filters?: Record<string, any>;
  refresh_interval?: number;
  theme?: string;
  color_scheme?: Record<string, any>;
  custom_css?: string;
  data_sources?: any[];
  queries?: Record<string, any>;
  parameters?: Record<string, any>;
  permissions?: Record<string, any>;
  share_settings?: Record<string, any>;
  embed_settings?: Record<string, any>;
  project_id?: string;
  organization_id?: string;
  category_id?: string;
  tags?: string[];
  is_template?: boolean;
  template_category?: string;
  template_data?: Record<string, any>;
  metadata?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface UpdateDashboardData extends Partial<CreateDashboardData> {
  status?: DashboardStatus;
  version?: number;
  published_at?: string;
  archived_at?: string;
}

// Enhanced project-related types
export interface ProjectAsset {
  id: string;
  project_id: string;
  name: string;
  type: 'document' | 'dataset' | 'tool' | 'agent' | 'patent' | 'report';
  description?: string;
  file_url?: string;
  file_size?: number;
  file_type?: string;
  metadata: Record<string, any>;
  tags: string[];
  uploaded_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Relations
  project?: Project;
  uploader?: User;
}

export interface ProjectActivity {
  id: string;
  project_id: string;
  user_id: string;
  activity_type: 'created' | 'updated' | 'comment' | 'milestone' | 'asset_added' | 'status_changed';
  title: string;
  description?: string;
  data: Record<string, any>;
  created_at: string;

  // Relations
  project?: Project;
  user?: User;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed_at?: string;
  is_completed: boolean;
  created_by: string;
  sort_order: number;
  created_at: string;
  updated_at: string;

  // Relations
  project?: Project;
  creator?: User;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  template_data: Record<string, any>;
  is_public: boolean;
  created_by: string;
  usage_count: number;
  created_at: string;
  updated_at: string;

  // Relations
  creator?: User;
}