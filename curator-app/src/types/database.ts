export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name?: string
          last_name?: string
          display_name?: string
          avatar_url?: string
          role: 'super_admin' | 'admin' | 'content_manager' | 'content_creator' | 'reviewer' | 'user'
          account_type: 'trial' | 'non_commercial' | 'commercial'
          organization?: string
          bio?: string
          preferences: Record<string, any>
          subscription_status: string
          subscription_expires_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string
          last_name?: string
          display_name?: string
          avatar_url?: string
          role?: 'super_admin' | 'admin' | 'content_manager' | 'content_creator' | 'reviewer' | 'user'
          account_type?: 'trial' | 'non_commercial' | 'commercial'
          organization?: string
          bio?: string
          preferences?: Record<string, any>
          subscription_status?: string
          subscription_expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          first_name?: string
          last_name?: string
          display_name?: string
          avatar_url?: string
          role?: 'super_admin' | 'admin' | 'content_manager' | 'content_creator' | 'reviewer' | 'user'
          account_type?: 'trial' | 'non_commercial' | 'commercial'
          organization?: string
          bio?: string
          preferences?: Record<string, any>
          subscription_status?: string
          subscription_expires_at?: string
          updated_at?: string
        }
      }
      content_versions: {
        Row: {
          id: string
          content_id: string
          version_number: number
          content_data: Record<string, any>
          created_by: string
          created_at: string
          status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published'
        }
        Insert: {
          id?: string
          content_id: string
          version_number: number
          content_data: Record<string, any>
          created_by: string
          created_at?: string
          status?: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published'
        }
        Update: {
          content_data?: Record<string, any>
          status?: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published'
        }
      }
      approval_workflows: {
        Row: {
          id: string
          content_id: string
          workflow_type: 'capability' | 'content' | 'asset'
          current_stage: number
          total_stages: number
          assigned_reviewers: string[]
          created_at: string
          completed_at?: string
        }
        Insert: {
          id?: string
          content_id: string
          workflow_type: 'capability' | 'content' | 'asset'
          current_stage?: number
          total_stages: number
          assigned_reviewers: string[]
          created_at?: string
          completed_at?: string
        }
        Update: {
          current_stage?: number
          assigned_reviewers?: string[]
          completed_at?: string
        }
      }
      content_templates: {
        Row: {
          id: string
          name: string
          template_type: 'capability' | 'content_piece' | 'asset_metadata'
          template_schema: Record<string, any>
          ai_prompts: Record<string, any>
          created_by: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          template_type: 'capability' | 'content_piece' | 'asset_metadata'
          template_schema: Record<string, any>
          ai_prompts?: Record<string, any>
          created_by: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          template_schema?: Record<string, any>
          ai_prompts?: Record<string, any>
          is_active?: boolean
          updated_at?: string
        }
      }
      ai_content_generations: {
        Row: {
          id: string
          content_id?: string
          generation_type: 'text' | 'image' | 'description' | 'metadata' | 'tags'
          input_prompt: string
          generated_content: Record<string, any>
          model_used: string
          generation_params: Record<string, any>
          quality_score?: number
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          content_id?: string
          generation_type: 'text' | 'image' | 'description' | 'metadata' | 'tags'
          input_prompt: string
          generated_content: Record<string, any>
          model_used: string
          generation_params: Record<string, any>
          quality_score?: number
          created_by: string
          created_at?: string
        }
        Update: {
          generated_content?: Record<string, any>
          quality_score?: number
        }
      }
      asset_library: {
        Row: {
          id: string
          filename: string
          original_filename: string
          file_type: string
          file_size: number
          mime_type: string
          storage_path: string
          metadata: Record<string, any>
          tags: string[]
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_filename: string
          file_type: string
          file_size: number
          mime_type: string
          storage_path: string
          metadata?: Record<string, any>
          tags?: string[]
          created_by: string
          created_at?: string
        }
        Update: {
          filename?: string
          metadata?: Record<string, any>
          tags?: string[]
        }
      }
      curator_roles: {
        Row: {
          id: string
          name: string
          permissions: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          permissions: string[]
          created_at?: string
        }
        Update: {
          name?: string
          permissions?: string[]
        }
      }
      user_curator_roles: {
        Row: {
          user_id: string
          role_id: string
          granted_by: string
          granted_at: string
        }
        Insert: {
          user_id: string
          role_id: string
          granted_by: string
          granted_at?: string
        }
        Update: {
          granted_by?: string
          granted_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published'
      user_role: 'super_admin' | 'admin' | 'content_manager' | 'content_creator' | 'reviewer' | 'user'
      workflow_type: 'capability' | 'content' | 'asset'
      template_type: 'capability' | 'content_piece' | 'asset_metadata'
      generation_type: 'text' | 'image' | 'description' | 'metadata' | 'tags'
    }
  }
}