/**
 * Secure Authentication Service
 * Replaces hardcoded credentials with environment-based configuration
 */

import { z } from 'zod';

// User schema with runtime validation
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'researcher', 'commercial', 'user']),
  isDemo: z.boolean().optional(),
  createdAt: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export type SecureUser = z.infer<typeof UserSchema>;

// Session schema
export const SessionSchema = z.object({
  user: UserSchema,
  token: z.string(),
  expiresAt: z.number(),
  refreshToken: z.string().optional()
});

export type SecureSession = z.infer<typeof SessionSchema>;

// Configuration from environment
const config = {
  isDemoEnabled: import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true',
  sessionSecret: import.meta.env.VITE_SESSION_SECRET || 'default_dev_secret',
  environment: import.meta.env.VITE_APP_ENV || 'development',
  demoPasswords: {
    'demo@innospot.com': import.meta.env.VITE_DEMO_ADMIN_PASSWORD || undefined,
    'researcher@innospot.com': import.meta.env.VITE_DEMO_RESEARCHER_PASSWORD || undefined,
    'commercial@innospot.com': import.meta.env.VITE_DEMO_COMMERCIAL_PASSWORD || undefined
  } as Record<string, string | undefined>
};

// Demo users configuration (only in development)
const DEMO_USERS: Record<string, Omit<SecureUser, 'id'>> = {
  'demo@innospot.com': {
    email: 'demo@innospot.com',
    name: 'Demo Admin',
    role: 'admin',
    isDemo: true
  },
  'researcher@innospot.com': {
    email: 'researcher@innospot.com',
    name: 'Research User',
    role: 'researcher',
    isDemo: true
  },
  'commercial@innospot.com': {
    email: 'commercial@innospot.com',
    name: 'Commercial User',
    role: 'commercial',
    isDemo: true
  }
};

/**
 * Secure session storage using sessionStorage with encryption
 */
class SecureSessionStorage {
  private readonly storageKey = 'innospot_secure_session';
  
  /**
   * Encrypt data before storage (simplified for demo)
   * In production, use proper encryption library
   */
  private encrypt(data: string): string {
    // In production, use crypto-js or similar
    return btoa(data);
  }
  
  /**
   * Decrypt data from storage
   */
  private decrypt(data: string): string {
    try {
      return atob(data);
    } catch {
      return '';
    }
  }
  
  /**
   * Save session securely
   */
  saveSession(session: SecureSession): void {
    const encrypted = this.encrypt(JSON.stringify(session));
    sessionStorage.setItem(this.storageKey, encrypted);
  }
  
  /**
   * Get session with validation
   */
  getSession(): SecureSession | null {
    const encrypted = sessionStorage.getItem(this.storageKey);
    if (!encrypted) return null;
    
    try {
      const decrypted = this.decrypt(encrypted);
      const data = JSON.parse(decrypted);
      const session = SessionSchema.parse(data);
      
      // Check expiration
      if (session.expiresAt < Date.now()) {
        this.clearSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Invalid session data:', error);
      this.clearSession();
      return null;
    }
  }
  
  /**
   * Clear session
   */
  clearSession(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}

/**
 * Main authentication service
 */
export class SecureAuthService {
  private storage = new SecureSessionStorage();
  
  /**
   * Validate demo credentials
   */
  private validateDemoCredentials(email: string, password: string): boolean {
    if (!config.isDemoEnabled || config.environment === 'production') {
      return false;
    }
    
    const expectedPassword = config.demoPasswords[email as keyof typeof config.demoPasswords];
    return expectedPassword ? password === expectedPassword : false;
  }
  
  /**
   * Generate secure token
   */
  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<SecureSession> {
    // Input validation
    const emailSchema = z.string().email();
    const passwordSchema = z.string().min(6);
    
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (error) {
      throw new Error('Invalid email or password format');
    }
    
    // Check demo users first (only in development)
    if (config.isDemoEnabled && DEMO_USERS[email]) {
      if (!this.validateDemoCredentials(email, password)) {
        throw new Error('Invalid demo credentials');
      }
      
      const user: SecureUser = {
        id: `demo_${Date.now()}`,
        ...DEMO_USERS[email]
      };
      
      const session: SecureSession = {
        user,
        token: this.generateToken(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        refreshToken: this.generateToken()
      };
      
      this.storage.saveSession(session);
      return session;
    }
    
    // Production authentication would go here
    // This would integrate with Supabase or other auth provider
    throw new Error('Production authentication not implemented');
  }
  
  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    this.storage.clearSession();
  }
  
  /**
   * Get current session
   */
  getSession(): SecureSession | null {
    return this.storage.getSession();
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
  
  /**
   * Refresh session
   */
  async refreshSession(refreshToken: string): Promise<SecureSession> {
    const currentSession = this.getSession();
    if (!currentSession || currentSession.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }
    
    // Extend session
    currentSession.expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    currentSession.token = this.generateToken();
    
    this.storage.saveSession(currentSession);
    return currentSession;
  }
}

// Export singleton instance
export const secureAuth = new SecureAuthService();