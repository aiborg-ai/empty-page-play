export interface UserRegistration {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  useType: 'trial' | 'non-commercial' | 'commercial';
  recordSearchHistory: boolean;
  agreeToTerms: boolean;
}

export interface MFAMethod {
  id: string;
  type: 'totp' | 'sms' | 'email';
  name: string;
  isEnabled: boolean;
  isPrimary: boolean;
  createdAt: string;
  lastUsed?: string;
}

export interface TOTPMethod extends MFAMethod {
  type: 'totp';
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  isVerified: boolean;
}

export interface SMSMethod extends MFAMethod {
  type: 'sms';
  phoneNumber: string;
  isVerified: boolean;
}

export interface EmailMethod extends MFAMethod {
  type: 'email';
  email: string;
  isVerified: boolean;
}

export interface MFASetupResponse {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  manualEntryKey: string;
}

export interface MFAVerificationRequest {
  methodId: string;
  code: string;
  trustDevice?: boolean;
}

export interface MFAVerificationResponse {
  success: boolean;
  message: string;
  requiresMFA: boolean;
  availableMethods: MFAMethod[];
  trustToken?: string;
}

export interface UserSecuritySettings {
  mfaEnabled: boolean;
  mfaMethods: MFAMethod[];
  trustedDevices: TrustedDevice[];
  securityQuestions: SecurityQuestion[];
  loginHistory: LoginHistoryEntry[];
}

export interface TrustedDevice {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  ipAddress: string;
  createdAt: string;
  lastUsed: string;
  isActive: boolean;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  hasAnswer: boolean;
}

export interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  success: boolean;
  failureReason?: string;
  mfaUsed: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: any;
  requiresMFA?: boolean;
  mfaMethods?: MFAMethod[];
  message?: string;
  tempToken?: string;
}