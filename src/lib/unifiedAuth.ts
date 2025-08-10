// Unified Authentication Service
// Handles both demo mode (development) and production mode (Supabase)

import { DemoAuthService, DemoUser } from './demoAuth';
import { ProductionAuthService, ProductionUser, PRODUCTION_DEMO_USERS } from './productionAuth';

// Check if we're in production mode (has Supabase config)
const isProductionMode = !!(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type UnifiedUser = DemoUser | ProductionUser;

export class UnifiedAuthService {
  static async login(email: string, password: string): Promise<{
    success: boolean;
    user?: UnifiedUser;
    error?: string;
  }> {
    if (isProductionMode) {
      console.log('🚀 Using Production Authentication');
      return await ProductionAuthService.login(email, password);
    } else {
      console.log('🔧 Using Demo Authentication'); 
      return await DemoAuthService.login(email, password);
    }
  }

  static async logout(): Promise<void> {
    if (isProductionMode) {
      await ProductionAuthService.logout();
    } else {
      DemoAuthService.logout();
    }
  }

  static async getCurrentUser(): Promise<UnifiedUser | null> {
    if (isProductionMode) {
      return await ProductionAuthService.getCurrentUser();
    } else {
      return DemoAuthService.getCurrentUser();
    }
  }

  static getDemoCredentials() {
    if (isProductionMode) {
      return PRODUCTION_DEMO_USERS;
    } else {
      return DemoAuthService.getDemoCredentials();
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    if (isProductionMode) {
      return await ProductionAuthService.isAuthenticated();
    } else {
      return !!DemoAuthService.getCurrentUser();
    }
  }

  static getMode(): 'production' | 'demo' {
    return isProductionMode ? 'production' : 'demo';
  }

  // Helper to convert users to a common format
  static normalizeUser(user: UnifiedUser): {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    accountType: string;
  } {
    if ('username' in user) {
      // Demo user format
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: `${user.firstName} ${user.lastName}`,
        accountType: user.useType
      };
    } else {
      // Production user format
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        displayName: user.display_name || `${user.first_name} ${user.last_name}`,
        accountType: user.account_type || 'trial'
      };
    }
  }
}