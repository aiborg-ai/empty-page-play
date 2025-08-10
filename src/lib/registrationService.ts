import { supabase } from './supabase';
import { User, UserAccountType } from '../types/cms';

export interface RegistrationData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  useType: 'trial' | 'non-commercial' | 'commercial';
  recordSearchHistory?: boolean;
  agreeToTerms: boolean;
}

export interface RegistrationResult {
  success: boolean;
  user?: User;
  error?: string;
  needsEmailVerification?: boolean;
}

export class RegistrationService {
  static async register(data: RegistrationData): Promise<RegistrationResult> {
    try {
      if (!data.agreeToTerms) {
        return {
          success: false,
          error: 'You must agree to the terms and conditions'
        };
      }

      // Map useType to account_type
      const accountTypeMap: Record<string, UserAccountType> = {
        'trial': 'trial',
        'non-commercial': 'non_commercial',
        'commercial': 'commercial'
      };

      // Create auth user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            username: data.username,
            account_type: accountTypeMap[data.useType],
            record_search_history: data.recordSearchHistory ?? true
          }
        }
      });

      if (authError) {
        return {
          success: false,
          error: authError.message
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Failed to create user account'
        };
      }

      // Check if user needs email verification
      const needsVerification = !authData.user.email_confirmed_at;

      // If user is confirmed, create the profile record
      if (!needsVerification) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            display_name: `${data.firstName} ${data.lastName}`,
            account_type: accountTypeMap[data.useType],
            role: data.useType === 'trial' ? 'trial' : 'user',
            preferences: {
              record_search_history: data.recordSearchHistory ?? true,
              username: data.username
            }
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue anyway - profile might be created by trigger
        }
      }

      // Get the created user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      return {
        success: true,
        user: userProfile || undefined,
        needsEmailVerification: needsVerification
      };

    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  }

  static async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Email verification failed'
      };
    }
  }

  static async resendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to resend verification email'
      };
    }
  }

  static async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .select('id')
        .eq('preferences->>username', username)
        .limit(1);

      if (error) {
        console.error('Username check error:', error);
        return false;
      }

      return true; // Simplified for now
    } catch (error) {
      console.error('Username availability check failed:', error);
      return false;
    }
  }

  static async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (error) {
        console.error('Email check error:', error);
        return false;
      }

      return true; // Simplified for now
    } catch (error) {
      console.error('Email availability check failed:', error);
      return false;
    }
  }
}