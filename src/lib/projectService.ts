import { supabase } from './supabase';
import type { 
  Project, 
  ProjectAsset, 
  ProjectActivity, 
  ProjectMilestone,
  ProjectTemplate,
  CreateProjectData, 
  UpdateProjectData,
  ProjectQueryParams,
  PaginatedResponse,
  ApiResponse
} from '../types/cms';

class ProjectService {
  private static instance: ProjectService;

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  // Helper method to get current user ID from demo auth or Supabase auth
  private async getCurrentUserId(): Promise<string> {
    // Check for demo authentication first
    const demoUserString = localStorage.getItem('demoUser');
    
    if (demoUserString) {
      // Use demo user ID
      const demoUser = JSON.parse(demoUserString);
      return demoUser.id;
    } else {
      // Fallback to Supabase auth
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) {
        throw new Error('User not authenticated');
      }
      return user.user.id;
    }
  }

  // Projects CRUD
  async getProjects(params?: ProjectQueryParams): Promise<PaginatedResponse<Project>> {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          owner:users!projects_owner_id_fkey(id, display_name, email, avatar_url),
          collaborators:project_collaborators(
            id, role, user:users!project_collaborators_user_id_fkey(id, display_name, email, avatar_url)
          )
        `);

      // Apply filters
      if (params?.status) {
        query = query.eq('status', params.status);
      }
      if (params?.owner_id) {
        query = query.eq('owner_id', params.owner_id);
      }
      if (params?.is_public !== undefined) {
        query = query.eq('is_public', params.is_public);
      }
      if (params?.search) {
        query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }

      // Apply sorting
      const sortBy = params?.sort_by || 'updated_at';
      const sortOrder = params?.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = params?.page || 1;
      const perPage = params?.per_page || 20;
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data, error, count } = await query.range(from, to);
      
      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        per_page: perPage,
        total_pages: Math.ceil((count || 0) / perPage)
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getProject(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:users!projects_owner_id_fkey(id, display_name, email, avatar_url),
          collaborators:project_collaborators(
            id, role, user:users!project_collaborators_user_id_fkey(id, display_name, email, avatar_url)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:users!projects_owner_id_fkey(id, display_name, email, avatar_url)
        `)
        .or(`owner_id.eq.${userId},id.in.(${await this.getUserCollaboratedProjectIds(userId)})`)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user projects:', error);
      return [];
    }
  }

  async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    try {
      const userId = await this.getCurrentUserId();

      // Generate slug from name
      const slug = data.name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();

      const projectData = {
        ...data,
        slug,
        owner_id: userId,
        settings: { notifications: true, auto_backup: false, collaboration_enabled: false },
        metadata: {}
      };

      const { data: project, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select(`
          *,
          owner:users!projects_owner_id_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data: project,
        message: 'Project created successfully'
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return {
        data: {} as Project,
        error: error instanceof Error ? error.message : 'Failed to create project'
      };
    }
  }

  async updateProject(id: string, data: UpdateProjectData): Promise<ApiResponse<Project>> {
    try {
      // Update slug if name changed
      let updateData = { ...data };
      if (data.name) {
        updateData = {
          ...updateData,
          slug: data.name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim()
        } as any;
      }

      const { data: project, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          owner:users!projects_owner_id_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data: project,
        message: 'Project updated successfully'
      };
    } catch (error) {
      console.error('Error updating project:', error);
      return {
        data: {} as Project,
        error: error instanceof Error ? error.message : 'Failed to update project'
      };
    }
  }

  async deleteProject(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      return {
        data: true,
        message: 'Project deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting project:', error);
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Failed to delete project'
      };
    }
  }

  // Project Assets
  async getProjectAssets(projectId: string): Promise<ProjectAsset[]> {
    try {
      const { data, error } = await supabase
        .from('project_assets')
        .select(`
          *,
          uploader:users!project_assets_uploaded_by_fkey(id, display_name, email, avatar_url)
        `)
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project assets:', error);
      return [];
    }
  }

  async addProjectAsset(projectId: string, assetData: Omit<ProjectAsset, 'id' | 'project_id' | 'uploaded_by' | 'created_at' | 'updated_at'>): Promise<ApiResponse<ProjectAsset>> {
    try {
      const userId = await this.getCurrentUserId();

      const { data: asset, error } = await supabase
        .from('project_assets')
        .insert({
          ...assetData,
          project_id: projectId,
          uploaded_by: userId
        })
        .select(`
          *,
          uploader:users!project_assets_uploaded_by_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data: asset,
        message: 'Asset added to project successfully'
      };
    } catch (error) {
      console.error('Error adding project asset:', error);
      return {
        data: {} as ProjectAsset,
        error: error instanceof Error ? error.message : 'Failed to add asset'
      };
    }
  }

  // Project Activities
  async getProjectActivities(projectId: string, limit: number = 50): Promise<ProjectActivity[]> {
    try {
      const { data, error } = await supabase
        .from('project_activities')
        .select(`
          *,
          user:users!project_activities_user_id_fkey(id, display_name, email, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project activities:', error);
      return [];
    }
  }

  async addProjectActivity(projectId: string, activity: Omit<ProjectActivity, 'id' | 'project_id' | 'created_at'>): Promise<ApiResponse<ProjectActivity>> {
    try {
      const { data, error } = await supabase
        .from('project_activities')
        .insert({
          ...activity,
          project_id: projectId
        })
        .select(`
          *,
          user:users!project_activities_user_id_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data,
        message: 'Activity logged successfully'
      };
    } catch (error) {
      console.error('Error adding project activity:', error);
      return {
        data: {} as ProjectActivity,
        error: error instanceof Error ? error.message : 'Failed to log activity'
      };
    }
  }

  // Project Milestones
  async getProjectMilestones(projectId: string): Promise<ProjectMilestone[]> {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .select(`
          *,
          creator:users!project_milestones_created_by_fkey(id, display_name, email, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project milestones:', error);
      return [];
    }
  }

  async addProjectMilestone(projectId: string, milestone: Omit<ProjectMilestone, 'id' | 'project_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<ProjectMilestone>> {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .insert({
          ...milestone,
          project_id: projectId
        })
        .select(`
          *,
          creator:users!project_milestones_created_by_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data,
        message: 'Milestone added successfully'
      };
    } catch (error) {
      console.error('Error adding project milestone:', error);
      return {
        data: {} as ProjectMilestone,
        error: error instanceof Error ? error.message : 'Failed to add milestone'
      };
    }
  }

  async updateProjectMilestone(id: string, updates: Partial<ProjectMilestone>): Promise<ApiResponse<ProjectMilestone>> {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          creator:users!project_milestones_created_by_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data,
        message: 'Milestone updated successfully'
      };
    } catch (error) {
      console.error('Error updating project milestone:', error);
      return {
        data: {} as ProjectMilestone,
        error: error instanceof Error ? error.message : 'Failed to update milestone'
      };
    }
  }

  // Project Templates
  async getProjectTemplates(): Promise<ProjectTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .select(`
          *,
          creator:users!project_templates_created_by_fkey(id, display_name, email, avatar_url)
        `)
        .eq('is_public', true)
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project templates:', error);
      return [];
    }
  }

  async createProjectFromTemplate(templateId: string, projectData: CreateProjectData): Promise<ApiResponse<Project>> {
    try {
      const { data: template } = await supabase
        .from('project_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (!template) {
        throw new Error('Template not found');
      }

      // Merge template data with project data
      const mergedData: CreateProjectData = {
        ...projectData,
        ...template.template_data.default_settings,
        tags: [...(projectData.tags || []), ...(template.template_data.recommended_tags || [])],
        priority: projectData.priority || template.template_data.default_priority
      };

      const result = await this.createProject(mergedData);
      
      if (result.data.id) {
        // Create milestones from template
        const suggestedMilestones = template.template_data.suggested_milestones || [];
        for (const milestone of suggestedMilestones) {
          await this.addProjectMilestone(result.data.id, {
            title: milestone.title,
            description: `Auto-generated from template: ${template.name}`,
            due_date: new Date(Date.now() + milestone.weeks_from_start * 7 * 24 * 60 * 60 * 1000).toISOString(),
            is_completed: false,
            created_by: result.data.owner_id,
            sort_order: suggestedMilestones.indexOf(milestone)
          });
        }

        // Increment template usage count
        await supabase
          .from('project_templates')
          .update({ usage_count: template.usage_count + 1 })
          .eq('id', templateId);
      }

      return result;
    } catch (error) {
      console.error('Error creating project from template:', error);
      return {
        data: {} as Project,
        error: error instanceof Error ? error.message : 'Failed to create project from template'
      };
    }
  }

  // Helper methods
  private async getUserCollaboratedProjectIds(userId: string): Promise<string> {
    try {
      const { data } = await supabase
        .from('project_collaborators')
        .select('project_id')
        .eq('user_id', userId)
        .eq('is_active', true);
      
      return data?.map(c => c.project_id).join(',') || '';
    } catch (error) {
      console.error('Error fetching collaborated project IDs:', error);
      return '';
    }
  }
}

export default ProjectService.getInstance();