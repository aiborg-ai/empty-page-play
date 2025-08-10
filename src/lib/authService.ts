import { supabase } from './supabase';
import { CMSService } from './cmsService';
import type { User } from '../types/cms';
import { DemoAuthService, DemoUser } from './demoAuth';

export interface AuthUser extends User {
  // Extends CMS User with additional auth properties
}

export class AuthService {
  private static instance: AuthService;
  private cms: CMSService;

  private constructor() {
    this.cms = CMSService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Register new user with Supabase Auth and CMS profile
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    useType: 'trial' | 'non_commercial' | 'commercial';
    recordSearchHistory?: boolean;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          }
        }
      });

      if (authError) {
        // Fallback to demo auth if Supabase fails
        console.log('Supabase auth failed, using demo auth:', authError.message);
        return this.fallbackToDemoAuth('register', userData);
      }

      if (!authData.user) {
        return { success: false, error: 'Registration failed' };
      }

      // Create CMS user profile
      const profileResponse = await this.cms.createUserProfile({
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        display_name: `${userData.firstName} ${userData.lastName}`,
        account_type: userData.useType,
        preferences: {
          recordSearchHistory: userData.recordSearchHistory ?? true
        }
      });

      if (profileResponse.error) {
        console.warn('Failed to create CMS profile:', profileResponse.error);
      }

      return { 
        success: true, 
        user: profileResponse.data as AuthUser || {
          id: authData.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          display_name: `${userData.firstName} ${userData.lastName}`,
          role: 'user',
          account_type: userData.useType,
          preferences: {},
          subscription_status: 'inactive',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as AuthUser
      };
    } catch (error: any) {
      console.log('Registration error, using demo auth fallback:', error.message);
      return this.fallbackToDemoAuth('register', userData);
    }
  }

  // Login user with Supabase Auth
  async login(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      // Try Supabase auth first
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        // Fallback to demo auth
        console.log('Supabase auth failed, using demo auth:', authError.message);
        return this.fallbackToDemoAuth('login', { email, password });
      }

      if (!authData.user) {
        return { success: false, error: 'Login failed' };
      }

      // Get or create CMS user profile
      const userResponse = await this.cms.getCurrentUser();
      
      let user = userResponse.data;
      if (!user) {
        // Create profile if it doesn't exist
        const profileResponse = await this.cms.createUserProfile({
          email: authData.user.email!,
          display_name: authData.user.user_metadata?.display_name || authData.user.email!.split('@')[0]
        });
        user = profileResponse.data;
      }

      return { success: true, user: user as AuthUser };
    } catch (error: any) {
      console.log('Login error, using demo auth fallback:', error.message);
      return this.fallbackToDemoAuth('login', { email, password });
    }
  }

  // Get current authenticated user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // Try CMS first
      const userResponse = await this.cms.getCurrentUser();
      if (userResponse.data) {
        return userResponse.data as AuthUser;
      }

      // Fallback to demo auth
      const demoUser = DemoAuthService.getCurrentUser();
      if (demoUser) {
        return this.convertDemoUserToAuthUser(demoUser);
      }

      return null;
    } catch (error) {
      console.log('getCurrentUser error, checking demo auth:', error);
      const demoUser = DemoAuthService.getCurrentUser();
      return demoUser ? this.convertDemoUserToAuthUser(demoUser) : null;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Supabase logout error:', error);
    }
    
    // Always clear demo auth as well
    DemoAuthService.logout();
  }

  // Check if user has specific role
  async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === role;
  }

  // Check if user is admin
  async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  // Fallback to demo auth when Supabase is unavailable
  private async fallbackToDemoAuth(
    action: 'login' | 'register', 
    data: any
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      let result;
      if (action === 'login') {
        result = await DemoAuthService.login(data.email, data.password);
      } else {
        result = await DemoAuthService.register(data);
      }

      if (result.success && result.user) {
        return {
          success: true,
          user: this.convertDemoUserToAuthUser(result.user)
        };
      }

      return { success: false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Convert demo user to auth user format
  private convertDemoUserToAuthUser(demoUser: DemoUser): AuthUser {
    return {
      id: demoUser.id,
      email: demoUser.email,
      first_name: demoUser.firstName,
      last_name: demoUser.lastName,
      display_name: `${demoUser.firstName} ${demoUser.lastName}`,
      role: 'user',
      account_type: demoUser.useType === 'non-commercial' ? 'non_commercial' : demoUser.useType,
      preferences: {
        recordSearchHistory: demoUser.recordSearchHistory
      },
      subscription_status: 'inactive',
      created_at: `${demoUser.registrationDate}T00:00:00Z`,
      updated_at: `${demoUser.registrationDate}T00:00:00Z`
    } as AuthUser;
  }

  // Get auth session status
  async getSession() {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch (error) {
      return null;
    }
  }
}