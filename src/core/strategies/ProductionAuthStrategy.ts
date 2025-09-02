import { AuthStrategy, AuthResult, User, Credentials } from '../types/auth';

const PRODUCTION_DEMO_USERS = {
  'demo@innospot.com': {
    id: 'prod-demo-001',
    password: 'Demo2024!',
    displayName: 'Production Demo User',
    role: 'standard'
  }
} as const;

export class ProductionAuthStrategy implements AuthStrategy {
  private currentUser: User | null = null;

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser() {
    try {
      const storedUser = sessionStorage.getItem('production_auth_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Failed to load production user:', error);
    }
  }

  private saveUser(user: User | null) {
    this.currentUser = user;
    if (user) {
      sessionStorage.setItem('production_auth_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('production_auth_user');
    }
  }

  async login(credentials: Credentials): Promise<AuthResult> {
    const prodUser = PRODUCTION_DEMO_USERS[credentials.email as keyof typeof PRODUCTION_DEMO_USERS];
    
    if (prodUser && prodUser.password === credentials.password) {
      const user: User = {
        id: prodUser.id,
        email: credentials.email,
        displayName: prodUser.displayName,
        role: prodUser.role,
        isDemo: true,
        emailVerified: true,
        createdAt: new Date().toISOString()
      };
      
      this.saveUser(user);
      
      return {
        success: true,
        user
      };
    }
    
    return {
      success: false,
      error: 'Invalid production credentials'
    };
  }

  async logout(): Promise<void> {
    this.saveUser(null);
  }

  async register(_credentials: Credentials & { metadata?: any }): Promise<AuthResult> {
    return {
      success: false,
      error: 'Registration not available in production demo mode'
    };
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async resetPassword(_email: string): Promise<void> {
    throw new Error('Password reset not available in production demo mode');
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }
    
    const updatedUser = {
      ...this.currentUser,
      ...updates,
      id: this.currentUser.id,
      email: this.currentUser.email,
      isDemo: true
    };
    
    this.saveUser(updatedUser);
    return updatedUser;
  }
}