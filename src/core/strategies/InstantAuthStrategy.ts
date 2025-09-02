import { AuthStrategy, AuthResult, User, Credentials } from '../types/auth';

const DEMO_USERS = {
  'demo@innospot.com': {
    id: 'demo-user-001',
    password: 'Demo2024!',
    displayName: 'Demo User',
    role: 'standard'
  },
  'researcher@innospot.com': {
    id: 'researcher-001',
    password: 'Research2024!',
    displayName: 'Research User',
    role: 'researcher'
  },
  'commercial@innospot.com': {
    id: 'commercial-001',
    password: 'Commercial2024!',
    displayName: 'Commercial User',
    role: 'commercial'
  }
} as const;

export class InstantAuthStrategy implements AuthStrategy {
  private currentUser: User | null = null;

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser() {
    try {
      const storedUser = localStorage.getItem('instant_auth_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Failed to load stored user:', error);
    }
  }

  private saveUser(user: User | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('instant_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('instant_auth_user');
    }
  }

  async login(credentials: Credentials): Promise<AuthResult> {
    const demoUser = DEMO_USERS[credentials.email as keyof typeof DEMO_USERS];
    
    if (demoUser && demoUser.password === credentials.password) {
      const user: User = {
        id: demoUser.id,
        email: credentials.email,
        displayName: demoUser.displayName,
        role: demoUser.role,
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
      error: 'Invalid demo credentials'
    };
  }

  async logout(): Promise<void> {
    this.saveUser(null);
  }

  async register(_credentials: Credentials & { metadata?: any }): Promise<AuthResult> {
    return {
      success: false,
      error: 'Demo accounts cannot be registered. Please use provided demo credentials.'
    };
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async resetPassword(_email: string): Promise<void> {
    throw new Error('Password reset not available for demo accounts');
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