import { supabase } from './supabase';
import type {
  User,
  Project,
  Content,
  AIAgent,
  Tool,
  Dataset,
  Report,
  Dashboard,
  DashboardCollaborator,
  DashboardComment,
  Category,
  ContentType,
  Activity,
  ApiResponse,
  PaginatedResponse,
  ProjectQueryParams,
  ContentQueryParams,
  CreateProjectData,
  UpdateProjectData,
  CreateContentData,
  UpdateContentData,
  CreateAIAgentData,
  CreateToolData,
  CreateDatasetData,
  CreateReportData,
  CreateDashboardData,
  UpdateDashboardData,
} from '../types/cms';

export class CMSService {
  private static instance: CMSService;

  private constructor() {}

  public static getInstance(): CMSService {
    if (!CMSService.instance) {
      CMSService.instance = new CMSService();
    }
    return CMSService.instance;
  }

  // Authentication helpers
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!authUser.user) {
        return { data: null };
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return { data: user };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async createUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: authUser.user.id,
          email: authUser.user.email!,
          ...userData,
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Projects
  async getProjects(params: ProjectQueryParams = {}): Promise<PaginatedResponse<Project>> {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          owner:users!owner_id(id, display_name, avatar_url),
          organization:organizations(id, name, slug),
          collaborators:project_collaborators(count)
        `, { count: 'exact' });

      // Apply filters
      if (params.status) query = query.eq('status', params.status);
      if (params.owner_id) query = query.eq('owner_id', params.owner_id);
      if (params.organization_id) query = query.eq('organization_id', params.organization_id);
      if (params.is_public !== undefined) query = query.eq('is_public', params.is_public);
      if (params.search) {
        query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }

      // Apply sorting
      const sortBy = params.sort_by || 'updated_at';
      const sortOrder = params.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = params.page || 1;
      const perPage = params.per_page || 20;
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        per_page: perPage,
        total_pages: Math.ceil((count || 0) / perPage),
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:users!owner_id(id, display_name, avatar_url, email),
          organization:organizations(id, name, slug),
          collaborators:project_collaborators(
            id,
            role,
            user:users(id, display_name, avatar_url, email)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async createProject(projectData: CreateProjectData): Promise<ApiResponse<Project>> {
    try {
      const slug = projectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          slug,
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async updateProject(id: string, updates: UpdateProjectData): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async deleteProject(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true };
    } catch (error: any) {
      return { data: false, error: error.message };
    }
  }

  // Content Management
  async getContents(params: ContentQueryParams = {}): Promise<PaginatedResponse<Content>> {
    try {
      let query = supabase
        .from('contents')
        .select(`
          *,
          content_type:content_types(id, name, slug),
          category:categories(id, name, slug, color),
          project:projects(id, name, slug),
          author:users!author_id(id, display_name, avatar_url)
        `, { count: 'exact' });

      // Apply filters
      if (params.status) query = query.eq('status', params.status);
      if (params.author_id) query = query.eq('author_id', params.author_id);
      if (params.category_id) query = query.eq('category_id', params.category_id);
      if (params.project_id) query = query.eq('project_id', params.project_id);
      if (params.content_type) {
        query = query.eq('content_types.slug', params.content_type);
      }
      if (params.is_featured !== undefined) query = query.eq('is_featured', params.is_featured);
      if (params.tags && params.tags.length > 0) {
        query = query.overlaps('tags', params.tags);
      }
      if (params.search) {
        query = query.textSearch('search_vector', params.search);
      }

      // Apply sorting
      const sortBy = params.sort_by || 'updated_at';
      const sortOrder = params.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = params.page || 1;
      const perPage = params.per_page || 20;
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        per_page: perPage,
        total_pages: Math.ceil((count || 0) / perPage),
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getContent(id: string): Promise<ApiResponse<Content>> {
    try {
      const { data, error } = await supabase
        .from('contents')
        .select(`
          *,
          content_type:content_types(id, name, slug, schema),
          category:categories(id, name, slug, color),
          project:projects(id, name, slug),
          author:users!author_id(id, display_name, avatar_url, email)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from('contents')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async createContent(contentData: CreateContentData): Promise<ApiResponse<Content>> {
    try {
      const slug = contentData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const { data, error } = await supabase
        .from('contents')
        .insert({
          ...contentData,
          slug,
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async updateContent(id: string, updates: UpdateContentData): Promise<ApiResponse<Content>> {
    try {
      const { data, error } = await supabase
        .from('contents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // Content Types
  async getContentTypes(): Promise<ApiResponse<ContentType[]>> {
    try {
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // AI Agents
  async getAIAgents(projectId?: string): Promise<ApiResponse<AIAgent[]>> {
    try {
      let query = supabase
        .from('ai_agents')
        .select(`
          *,
          project:projects(id, name, slug),
          owner:users!owner_id(id, display_name, avatar_url)
        `)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async createAIAgent(agentData: CreateAIAgentData): Promise<ApiResponse<AIAgent>> {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .insert(agentData)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Tools
  async getTools(projectId?: string): Promise<ApiResponse<Tool[]>> {
    try {
      let query = supabase
        .from('tools')
        .select(`
          *,
          project:projects(id, name, slug),
          owner:users!owner_id(id, display_name, avatar_url)
        `)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async createTool(toolData: CreateToolData): Promise<ApiResponse<Tool>> {
    try {
      const { data, error } = await supabase
        .from('tools')
        .insert(toolData)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Datasets
  async getDatasets(projectId?: string): Promise<ApiResponse<Dataset[]>> {
    try {
      let query = supabase
        .from('datasets')
        .select(`
          *,
          project:projects(id, name, slug),
          owner:users!owner_id(id, display_name, avatar_url)
        `)
        .order('updated_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async createDataset(datasetData: CreateDatasetData): Promise<ApiResponse<Dataset>> {
    try {
      const { data, error } = await supabase
        .from('datasets')
        .insert(datasetData)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Reports
  async getReports(projectId?: string): Promise<ApiResponse<Report[]>> {
    try {
      let query = supabase
        .from('reports')
        .select(`
          *,
          project:projects(id, name, slug),
          author:users!author_id(id, display_name, avatar_url)
        `)
        .order('updated_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async createReport(reportData: CreateReportData): Promise<ApiResponse<Report>> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Activities
  async getActivities(projectId?: string, limit = 50): Promise<ApiResponse<Activity[]>> {
    try {
      let query = supabase
        .from('activities')
        .select(`
          *,
          user:users(id, display_name, avatar_url),
          project:projects(id, name, slug)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // Dashboards
  async getDashboards(projectId?: string): Promise<ApiResponse<Dashboard[]>> {
    try {
      let query = supabase
        .from('dashboards')
        .select(`
          *,
          project:projects(id, name, slug),
          owner:users!owner_id(id, display_name, avatar_url),
          organization:organizations(id, name, slug),
          category:categories(id, name, slug, color),
          collaborators:dashboard_collaborators(count)
        `)
        .order('updated_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async getDashboard(id: string): Promise<ApiResponse<Dashboard>> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select(`
          *,
          project:projects(id, name, slug),
          owner:users!owner_id(id, display_name, avatar_url, email),
          organization:organizations(id, name, slug),
          category:categories(id, name, slug, color),
          collaborators:dashboard_collaborators(
            id,
            role,
            user:users(id, display_name, avatar_url, email)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Log view activity
      await this.logActivity('view', 'dashboard', id, data.project_id);

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async createDashboard(dashboardData: CreateDashboardData): Promise<ApiResponse<Dashboard>> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .insert(dashboardData)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async updateDashboard(id: string, updates: UpdateDashboardData): Promise<ApiResponse<Dashboard>> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async deleteDashboard(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('dashboards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true };
    } catch (error: any) {
      return { data: false, error: error.message };
    }
  }

  async duplicateDashboard(id: string, name: string): Promise<ApiResponse<Dashboard>> {
    try {
      // Get original dashboard
      const { data: original, error: fetchError } = await supabase
        .from('dashboards')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Create copy with new name
      const { id: originalId, created_at, updated_at, ...dashboardData } = original;
      
      const { data, error } = await supabase
        .from('dashboards')
        .insert({
          ...dashboardData,
          name,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Dashboard Collaborators
  async getDashboardCollaborators(dashboardId: string): Promise<ApiResponse<DashboardCollaborator[]>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_collaborators')
        .select(`
          *,
          user:users(id, display_name, avatar_url, email),
          dashboard:dashboards(id, name),
          inviter:users!invited_by(id, display_name, avatar_url)
        `)
        .eq('dashboard_id', dashboardId);

      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async addDashboardCollaborator(
    dashboardId: string, 
    userId: string, 
    role: string = 'viewer'
  ): Promise<ApiResponse<DashboardCollaborator>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_collaborators')
        .insert({
          dashboard_id: dashboardId,
          user_id: userId,
          role,
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async updateDashboardCollaborator(
    id: string, 
    updates: { role?: string; permissions?: Record<string, any> }
  ): Promise<ApiResponse<DashboardCollaborator>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_collaborators')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async removeDashboardCollaborator(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('dashboard_collaborators')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true };
    } catch (error: any) {
      return { data: false, error: error.message };
    }
  }

  // Dashboard Comments
  async getDashboardComments(dashboardId: string): Promise<ApiResponse<DashboardComment[]>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_comments')
        .select(`
          *,
          user:users(id, display_name, avatar_url),
          replies:dashboard_comments!parent_id(
            *,
            user:users(id, display_name, avatar_url)
          )
        `)
        .eq('dashboard_id', dashboardId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async addDashboardComment(
    dashboardId: string,
    content: string,
    widgetId?: string,
    position?: Record<string, any>,
    parentId?: string
  ): Promise<ApiResponse<DashboardComment>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_comments')
        .insert({
          dashboard_id: dashboardId,
          content,
          widget_id: widgetId,
          position,
          parent_id: parentId,
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async updateDashboardComment(id: string, content: string): Promise<ApiResponse<DashboardComment>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_comments')
        .update({ content })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async deleteDashboardComment(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('dashboard_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true };
    } catch (error: any) {
      return { data: false, error: error.message };
    }
  }

  async resolveDashboardComment(id: string): Promise<ApiResponse<DashboardComment>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_comments')
        .update({ is_resolved: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Enhanced methods for other entities
  async updateAIAgent(id: string, updates: Partial<CreateAIAgentData>): Promise<ApiResponse<AIAgent>> {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async deleteAIAgent(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('ai_agents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true };
    } catch (error: any) {
      return { data: false, error: error.message };
    }
  }

  async updateTool(id: string, updates: Partial<CreateToolData>): Promise<ApiResponse<Tool>> {
    try {
      const { data, error } = await supabase
        .from('tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async deleteTool(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true };
    } catch (error: any) {
      return { data: false, error: error.message };
    }
  }

  async updateDataset(id: string, updates: Partial<CreateDatasetData>): Promise<ApiResponse<Dataset>> {
    try {
      const { data, error } = await supabase
        .from('datasets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async deleteDataset(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true };
    } catch (error: any) {
      return { data: false, error: error.message };
    }
  }

  async updateReport(id: string, updates: Partial<CreateReportData>): Promise<ApiResponse<Report>> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  async deleteReport(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true };
    } catch (error: any) {
      return { data: false, error: error.message };
    }
  }

  // Utility methods
  private async logActivity(
    action: string,
    resourceType: string,
    resourceId: string,
    projectId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('activities')
        .insert({
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          project_id: projectId,
          details: details || {},
        });
    } catch (error) {
      // Log activity failure should not break the main operation
      console.error('Failed to log activity:', error);
    }
  }

  // Enhanced search with dashboards
  async search(query: string): Promise<ApiResponse<any[]>> {
    try {
      const results: any[] = [];

      // Search projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, description, slug, created_at')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);

      if (projects) {
        results.push(...projects.map(p => ({ ...p, type: 'project' })));
      }

      // Search contents
      const { data: contents } = await supabase
        .from('contents')
        .select('id, title, excerpt, slug, created_at')
        .textSearch('search_vector', query)
        .eq('status', 'published')
        .limit(10);

      if (contents) {
        results.push(...contents.map(c => ({ ...c, type: 'content' })));
      }

      // Search dashboards
      const { data: dashboards } = await supabase
        .from('dashboards')
        .select('id, name, description, created_at')
        .textSearch('search_vector', query)
        .eq('status', 'published')
        .limit(10);

      if (dashboards) {
        results.push(...dashboards.map(d => ({ ...d, type: 'dashboard' })));
      }

      // Search AI agents
      const { data: agents } = await supabase
        .from('ai_agents')
        .select('id, name, description, type, created_at')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
        .eq('is_public', true)
        .limit(5);

      if (agents) {
        results.push(...agents.map(a => ({ ...a, type: 'ai_agent' })));
      }

      // Search tools
      const { data: tools } = await supabase
        .from('tools')
        .select('id, name, description, type, created_at')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
        .eq('is_public', true)
        .limit(5);

      if (tools) {
        results.push(...tools.map(t => ({ ...t, type: 'tool' })));
      }

      return { data: results };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }
}