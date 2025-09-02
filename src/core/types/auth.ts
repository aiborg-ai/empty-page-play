export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
  role?: string;
  metadata?: Record<string, any>;
  isDemo?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  requiresVerification?: boolean;
}

export interface AuthStrategy {
  login(credentials: Credentials): Promise<AuthResult>;
  logout(): Promise<void>;
  register(credentials: Credentials & { metadata?: any }): Promise<AuthResult>;
  getCurrentUser(): Promise<User | null>;
  resetPassword(email: string): Promise<void>;
  updateProfile(updates: Partial<User>): Promise<User>;
  verifyEmail?(token: string): Promise<boolean>;
  refreshToken?(): Promise<string>;
}