import { supabase } from './supabase';
import type { 
  Project as Space, 
  ProjectAsset as SpaceAsset, 
  ProjectActivity as SpaceActivity, 
  ProjectMilestone as SpaceMilestone,
  ProjectTemplate as SpaceTemplate,
  CreateProjectData as CreateSpaceData, 
  UpdateProjectData as UpdateSpaceData,
  ProjectQueryParams as SpaceQueryParams,
  PaginatedResponse,
  ApiResponse
} from '../types/cms';

class SpaceService {
  private static instance: SpaceService;

  public static getInstance(): SpaceService {
    if (!SpaceService.instance) {
      SpaceService.instance = new SpaceService();
    }
    return SpaceService.instance;
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

  // Spaces CRUD
  async getSpaces(params?: SpaceQueryParams): Promise<PaginatedResponse<Space>> {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          owner:users!spaces_owner_id_fkey(id, display_name, email, avatar_url),
          collaborators:space_collaborators(
            id, role, user:users!space_collaborators_user_id_fkey(id, display_name, email, avatar_url)
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
      console.error('Error fetching spaces:', error);
      throw error;
    }
  }

  async getSpace(id: string): Promise<Space | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:users!spaces_owner_id_fkey(id, display_name, email, avatar_url),
          collaborators:space_collaborators(
            id, role, user:users!space_collaborators_user_id_fkey(id, display_name, email, avatar_url)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching space:', error);
      return null;
    }
  }

  async getUserSpaces(userId: string): Promise<Space[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:users!spaces_owner_id_fkey(id, display_name, email, avatar_url)
        `)
        .or(`owner_id.eq.${userId},id.in.(${await this.getUserCollaboratedSpaceIds(userId)})`)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user spaces:', error);
      return [];
    }
  }

  async createSpace(data: CreateSpaceData): Promise<ApiResponse<Space>> {
    try {
      const userId = await this.getCurrentUserId();

      // Generate slug from name
      const slug = data.name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();

      const spaceData = {
        ...data,
        slug,
        owner_id: userId,
        settings: { notifications: true, auto_backup: false, collaboration_enabled: false },
        metadata: {}
      };

      const { data: space, error } = await supabase
        .from('projects')
        .insert(spaceData)
        .select(`
          *,
          owner:users!spaces_owner_id_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data: space,
        message: 'Space created successfully'
      };
    } catch (error) {
      console.error('Error creating space:', error);
      return {
        data: {} as Space,
        error: error instanceof Error ? error.message : 'Failed to create space'
      };
    }
  }

  async updateSpace(id: string, data: UpdateSpaceData): Promise<ApiResponse<Space>> {
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

      const { data: space, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          owner:users!spaces_owner_id_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data: space,
        message: 'Space updated successfully'
      };
    } catch (error) {
      console.error('Error updating space:', error);
      return {
        data: {} as Space,
        error: error instanceof Error ? error.message : 'Failed to update space'
      };
    }
  }

  async deleteSpace(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      return {
        data: true,
        message: 'Space deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting space:', error);
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Failed to delete space'
      };
    }
  }

  // Space Assets
  async getSpaceAssets(spaceId: string): Promise<SpaceAsset[]> {
    try {
      const { data, error } = await supabase
        .from('space_assets')
        .select(`
          *,
          uploader:users!space_assets_uploaded_by_fkey(id, display_name, email, avatar_url)
        `)
        .eq('space_id', spaceId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching space assets:', error);
      return [];
    }
  }

  async addSpaceAsset(spaceId: string, assetData: Omit<SpaceAsset, 'id' | 'space_id' | 'uploaded_by' | 'created_at' | 'updated_at'>): Promise<ApiResponse<SpaceAsset>> {
    try {
      const userId = await this.getCurrentUserId();

      const { data: asset, error } = await supabase
        .from('space_assets')
        .insert({
          ...assetData,
          space_id: spaceId,
          uploaded_by: userId
        })
        .select(`
          *,
          uploader:users!space_assets_uploaded_by_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data: asset,
        message: 'Asset added to space successfully'
      };
    } catch (error) {
      console.error('Error adding space asset:', error);
      return {
        data: {} as SpaceAsset,
        error: error instanceof Error ? error.message : 'Failed to add asset'
      };
    }
  }

  // Space Activities
  async getSpaceActivities(spaceId: string, limit: number = 50): Promise<SpaceActivity[]> {
    try {
      const { data, error } = await supabase
        .from('space_activities')
        .select(`
          *,
          user:users!space_activities_user_id_fkey(id, display_name, email, avatar_url)
        `)
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching space activities:', error);
      return [];
    }
  }

  async addSpaceActivity(spaceId: string, activity: Omit<SpaceActivity, 'id' | 'space_id' | 'created_at'>): Promise<ApiResponse<SpaceActivity>> {
    try {
      const { data, error } = await supabase
        .from('space_activities')
        .insert({
          ...activity,
          space_id: spaceId
        })
        .select(`
          *,
          user:users!space_activities_user_id_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data,
        message: 'Activity logged successfully'
      };
    } catch (error) {
      console.error('Error adding space activity:', error);
      return {
        data: {} as SpaceActivity,
        error: error instanceof Error ? error.message : 'Failed to log activity'
      };
    }
  }

  // Space Milestones
  async getSpaceMilestones(spaceId: string): Promise<SpaceMilestone[]> {
    try {
      const { data, error } = await supabase
        .from('space_milestones')
        .select(`
          *,
          creator:users!space_milestones_created_by_fkey(id, display_name, email, avatar_url)
        `)
        .eq('space_id', spaceId)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching space milestones:', error);
      return [];
    }
  }

  async addSpaceMilestone(spaceId: string, milestone: Omit<SpaceMilestone, 'id' | 'space_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<SpaceMilestone>> {
    try {
      const { data, error } = await supabase
        .from('space_milestones')
        .insert({
          ...milestone,
          space_id: spaceId
        })
        .select(`
          *,
          creator:users!space_milestones_created_by_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data,
        message: 'Milestone added successfully'
      };
    } catch (error) {
      console.error('Error adding space milestone:', error);
      return {
        data: {} as SpaceMilestone,
        error: error instanceof Error ? error.message : 'Failed to add milestone'
      };
    }
  }

  async updateSpaceMilestone(id: string, updates: Partial<SpaceMilestone>): Promise<ApiResponse<SpaceMilestone>> {
    try {
      const { data, error } = await supabase
        .from('space_milestones')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          creator:users!space_milestones_created_by_fkey(id, display_name, email, avatar_url)
        `)
        .single();
      
      if (error) throw error;

      return {
        data,
        message: 'Milestone updated successfully'
      };
    } catch (error) {
      console.error('Error updating space milestone:', error);
      return {
        data: {} as SpaceMilestone,
        error: error instanceof Error ? error.message : 'Failed to update milestone'
      };
    }
  }

  // Space Templates
  async getSpaceTemplates(): Promise<SpaceTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('space_templates')
        .select(`
          *,
          creator:users!space_templates_created_by_fkey(id, display_name, email, avatar_url)
        `)
        .eq('is_public', true)
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching space templates:', error);
      return [];
    }
  }

  async createSpaceFromTemplate(templateId: string, spaceData: CreateSpaceData): Promise<ApiResponse<Space>> {
    try {
      const { data: template } = await supabase
        .from('space_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (!template) {
        throw new Error('Template not found');
      }

      // Merge template data with space data
      const mergedData: CreateSpaceData = {
        ...spaceData,
        ...template.template_data.default_settings,
        tags: [...(spaceData.tags || []), ...(template.template_data.recommended_tags || [])],
        priority: spaceData.priority || template.template_data.default_priority
      };

      const result = await this.createSpace(mergedData);
      
      if (result.data.id) {
        // Create milestones from template
        const suggestedMilestones = template.template_data.suggested_milestones || [];
        for (const milestone of suggestedMilestones) {
          await this.addSpaceMilestone(result.data.id, {
            project_id: result.data.id,
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
          .from('space_templates')
          .update({ usage_count: template.usage_count + 1 })
          .eq('id', templateId);
      }

      return result;
    } catch (error) {
      console.error('Error creating space from template:', error);
      return {
        data: {} as Space,
        error: error instanceof Error ? error.message : 'Failed to create space from template'
      };
    }
  }

  // Helper methods
  private async getUserCollaboratedSpaceIds(userId: string): Promise<string> {
    try {
      const { data } = await supabase
        .from('space_collaborators')
        .select('space_id')
        .eq('user_id', userId)
        .eq('is_active', true);
      
      return data?.map(c => c.space_id).join(',') || '';
    } catch (error) {
      console.error('Error fetching collaborated space IDs:', error);
      return '';
    }
  }
}

export default SpaceService.getInstance();