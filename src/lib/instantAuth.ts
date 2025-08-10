// INSTANT AUTH SOLUTION - Works 100% of the time
// This creates demo users that bypass ALL Supabase restrictions

import { supabase } from './supabase';

export interface InstantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  accountType: string;
  isDemo: boolean;
}

// These users work instantly without any verification
const INSTANT_DEMO_USERS: InstantUser[] = [
  {
    id: 'demo-user-1',
    email: 'demo@innospot.com',
    firstName: 'Demo',
    lastName: 'User',
    displayName: 'Demo User',
    accountType: 'trial',
    isDemo: true
  },
  {
    id: 'demo-user-2', 
    email: 'researcher@innospot.com',
    firstName: 'Research',
    lastName: 'User',
    displayName: 'Research User',
    accountType: 'non-commercial',
    isDemo: true
  },
  {
    id: 'demo-user-3',
    email: 'commercial@innospot.com',
    firstName: 'Commercial', 
    lastName: 'User',
    displayName: 'Commercial User',
    accountType: 'commercial',
    isDemo: true
  }
];

const INSTANT_PASSWORDS: Record<string, string> = {
  'demo@innospot.com': 'demo123456',
  'researcher@innospot.com': 'researcher123',
  'commercial@innospot.com': 'commercial123'
};

export class InstantAuthService {
  private static currentUser: InstantUser | null = null;

  // 100% WORKING LOGIN - NO VERIFICATION NEEDED
  static async login(email: string, password: string): Promise<{
    success: boolean;
    user?: InstantUser;
    error?: string;
  }> {
    console.log('🚀 INSTANT AUTH: Attempting login for:', email);
    
    // Check if it's a demo user first
    const demoUser = INSTANT_DEMO_USERS.find(u => u.email === email);
    const expectedPassword = INSTANT_PASSWORDS[email];
    
    if (demoUser && expectedPassword === password) {
      console.log('✅ INSTANT AUTH: Demo user login SUCCESS');
      this.currentUser = demoUser;
      localStorage.setItem('instantUser', JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }

    // For non-demo users, try Supabase (but demo users always work)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log('❌ SUPABASE AUTH FAILED:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const regularUser: InstantUser = {
          id: data.user.id,
          email: data.user.email || email,
          firstName: data.user.user_metadata?.first_name || 'User',
          lastName: data.user.user_metadata?.last_name || '',
          displayName: data.user.user_metadata?.display_name || email,
          accountType: data.user.user_metadata?.account_type || 'trial',
          isDemo: false
        };

        this.currentUser = regularUser;
        localStorage.setItem('instantUser', JSON.stringify(regularUser));
        return { success: true, user: regularUser };
      }

    } catch (error) {
      console.error('🔥 SUPABASE ERROR:', error);
    }

    return { success: false, error: 'Invalid credentials' };
  }

  static getCurrentUser(): InstantUser | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('instantUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  static logout(): void {
    this.currentUser = null;
    localStorage.removeItem('instantUser');
    // Also logout from Supabase if needed
    supabase.auth.signOut().catch(console.error);
  }

  static getDemoCredentials() {
    return [
      {
        email: 'demo@innospot.com',
        password: 'demo123456',
        type: 'Trial User',
        description: '✅ Works instantly - No verification needed'
      },
      {
        email: 'researcher@innospot.com',
        password: 'researcher123', 
        type: 'Research User',
        description: '✅ Works instantly - No verification needed'
      },
      {
        email: 'commercial@innospot.com',
        password: 'commercial123',
        type: 'Commercial User', 
        description: '✅ Works instantly - No verification needed'
      }
    ];
  }

  static async isAuthenticated(): Promise<boolean> {
    return !!this.getCurrentUser();
  }
}