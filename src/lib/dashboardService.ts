import { supabase } from './supabase';
import type {
  Dashboard,
  DashboardCollaborator,
  DashboardComment,
  ApiResponse,
  CreateDashboardData,
  UpdateDashboardData,
} from '../types/cms';

/**
 * Simplified Dashboard Service
 * Works with the ultra-safe dashboard schema (no foreign key dependencies)
 */
export class DashboardService {
  private static instance: DashboardService;

  private constructor() {}

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  // Get current user's dashboards
  async getUserDashboards(): Promise<ApiResponse<Dashboard[]>> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // Get dashboard by ID
  async getDashboard(id: string): Promise<ApiResponse<Dashboard>> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select(`
          *,
          collaborators:dashboard_collaborators(
            id,
            role,
            user_id,
            invited_at,
            accepted_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Log view activity
      await this.logView(id);

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Create new dashboard
  async createDashboard(dashboardData: CreateDashboardData): Promise<ApiResponse<Dashboard>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('dashboards')
        .insert({
          ...dashboardData,
          owner_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Update dashboard
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

  // Delete dashboard
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

  // Duplicate dashboard
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
       
      const { id: _id, created_at: _created_at, updated_at: _updated_at, ...dashboardData } = original;
      
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

  // Get dashboard collaborators
  async getDashboardCollaborators(dashboardId: string): Promise<ApiResponse<DashboardCollaborator[]>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_collaborators')
        .select('*')
        .eq('dashboard_id', dashboardId);

      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // Add collaborator
  async addCollaborator(dashboardId: string, userId: string, role: string = 'viewer'): Promise<ApiResponse<DashboardCollaborator>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_collaborators')
        .insert({
          dashboard_id: dashboardId,
          user_id: userId,
          role,
          accepted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Remove collaborator
  async removeCollaborator(collaboratorId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('dashboard_collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;

      return { data: true };
    } catch (error: any) {
      return { data: false, error: error.message };
    }
  }

  // Get dashboard comments
  async getDashboardComments(dashboardId: string): Promise<ApiResponse<DashboardComment[]>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_comments')
        .select('*')
        .eq('dashboard_id', dashboardId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // Add comment
  async addComment(
    dashboardId: string,
    content: string,
    widgetId?: string,
    position?: Record<string, any>
  ): Promise<ApiResponse<DashboardComment>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('dashboard_comments')
        .insert({
          dashboard_id: dashboardId,
          user_id: user.user.id,
          content,
          widget_id: widgetId,
          position,
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Update comment
  async updateComment(commentId: string, content: string): Promise<ApiResponse<DashboardComment>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_comments')
        .update({ content })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error: any) {
      return { data: null as any, error: error.message };
    }
  }

  // Delete comment
  async deleteComment(commentId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('dashboard_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      return { data: true };
    } catch (error: any) {
      return { data: false, error: error.message };
    }
  }

  // Search dashboards
  async searchDashboards(query: string): Promise<ApiResponse<Dashboard[]>> {
    try {
      let searchQuery = supabase
        .from('dashboards')
        .select('*')
        .order('updated_at', { ascending: false });

      if (query) {
        searchQuery = searchQuery.or(
          `name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`
        );
      }

      const { data, error } = await searchQuery;
      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // Get dashboards by type
  async getDashboardsByType(type: string): Promise<ApiResponse<Dashboard[]>> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('type', type)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // Get public dashboards
  async getPublicDashboards(): Promise<ApiResponse<Dashboard[]>> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('access_level', 'public')
        .eq('status', 'published')
        .order('view_count', { ascending: false });

      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // Get dashboard templates
  async getDashboardTemplates(): Promise<ApiResponse<Dashboard[]>> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('is_template', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // Private method to log dashboard view
  private async logView(dashboardId: string): Promise<void> {
    try {
      await supabase.rpc('increment', {
        table_name: 'dashboards',
        row_id: dashboardId,
        column_name: 'view_count'
      });
      
      await supabase
        .from('dashboards')
        .update({ last_viewed_at: new Date().toISOString() })
        .eq('id', dashboardId);
    } catch (error) {
      // Log view failure should not break the main operation
      console.error('Failed to log dashboard view:', error);
    }
  }
}