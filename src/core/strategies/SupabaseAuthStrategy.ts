import { AuthStrategy, AuthResult, User, Credentials } from '../types/auth';
import { supabase } from '@/lib/supabase';

export class SupabaseAuthStrategy implements AuthStrategy {
  async login(credentials: Credentials): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'No user returned from Supabase'
        };
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        displayName: data.user.user_metadata?.display_name,
        avatar: data.user.user_metadata?.avatar_url,
        role: data.user.user_metadata?.role || 'standard',
        metadata: data.user.user_metadata,
        emailVerified: !!data.user.email_confirmed_at,
        createdAt: data.user.created_at
      };

      return {
        success: true,
        user,
        requiresVerification: !user.emailVerified
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async register(credentials: Credentials & { metadata?: any }): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: credentials.metadata || {}
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Registration failed'
        };
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        displayName: credentials.metadata?.display_name,
        role: credentials.metadata?.role || 'standard',
        metadata: credentials.metadata,
        emailVerified: false,
        createdAt: data.user.created_at
      };

      return {
        success: true,
        user,
        requiresVerification: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        displayName: user.user_metadata?.display_name,
        avatar: user.user_metadata?.avatar_url,
        role: user.user_metadata?.role || 'standard',
        metadata: user.user_metadata,
        emailVerified: !!user.email_confirmed_at,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw error;
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        display_name: updates.displayName,
        avatar_url: updates.avatar,
        ...updates.metadata
      }
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Failed to update profile');
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      displayName: data.user.user_metadata?.display_name,
      avatar: data.user.user_metadata?.avatar_url,
      role: data.user.user_metadata?.role || 'standard',
      metadata: data.user.user_metadata,
      emailVerified: !!data.user.email_confirmed_at,
      createdAt: data.user.created_at
    };
  }

  async verifyEmail(token: string): Promise<boolean> {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });
    
    return !error;
  }

  async refreshToken(): Promise<string> {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      throw error;
    }
    
    if (!data.session) {
      throw new Error('No session to refresh');
    }
    
    return data.session.access_token;
  }
}