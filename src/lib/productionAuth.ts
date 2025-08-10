import { supabase } from './supabase';

export interface ProductionUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  role: string;
  account_type: string;
  organization?: string;
  avatar_url?: string;
  preferences?: any;
}

// Production demo users - these match the ones created in migration 010
export const PRODUCTION_DEMO_USERS = [
  {
    email: 'demo@innospot.com',
    password: 'demo123456',
    type: 'Trial User',
    description: 'Full access demo account'
  },
  {
    email: 'researcher@innospot.com', 
    password: 'researcher123',
    type: 'Research User',
    description: 'Academic/non-commercial demo account'
  },
  {
    email: 'commercial@innospot.com',
    password: 'commercial123', 
    type: 'Commercial User',
    description: 'Business intelligence demo account'
  }
];

export class ProductionAuthService {
  static async login(email: string, password: string): Promise<{
    success: boolean;
    user?: ProductionUser;
    error?: string;
  }> {
    try {
      // First try Supabase authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Authentication failed' };
      }

      // Get user profile from public.users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !userProfile) {
        // If no profile exists, create a basic one (for existing users)
        const newProfile = {
          id: authData.user.id,
          email: authData.user.email,
          first_name: authData.user.user_metadata?.first_name || '',
          last_name: authData.user.user_metadata?.last_name || '',
          display_name: authData.user.user_metadata?.display_name || authData.user.email,
          role: 'user',
          account_type: authData.user.user_metadata?.use_type || 'trial'
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          return { success: false, error: 'Failed to create user profile' };
        }

        return { success: true, user: createdProfile };
      }

      return { success: true, user: userProfile };
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  static async getCurrentUser(): Promise<ProductionUser | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return null;
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      return userProfile || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static getDemoCredentials() {
    return PRODUCTION_DEMO_USERS;
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }

  // Get session
  static async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
}