import { MFAMethod, MFASetupResponse, MFAVerificationRequest, MFAVerificationResponse, UserSecuritySettings } from '../types/auth';

export class MFAService {
  private static instance: MFAService;

  private constructor() {}

  public static getInstance(): MFAService {
    if (!MFAService.instance) {
      MFAService.instance = new MFAService();
    }
    return MFAService.instance;
  }

  // Generate TOTP secret and QR code
  public async setupTOTP(userId: string): Promise<MFASetupResponse> {
    // In a real implementation, this would call your backend API
    const secret = this.generateTOTPSecret();
    const qrCodeUrl = this.generateQRCodeUrl(secret, userId);
    const backupCodes = this.generateBackupCodes();
    const manualEntryKey = this.formatManualEntryKey(secret);

    return {
      secret,
      qrCodeUrl,
      backupCodes,
      manualEntryKey
    };
  }

  // Verify TOTP code during setup
  public async verifyTOTPSetup(_secret: string, code: string): Promise<boolean> {
    // In a real implementation, this would verify the TOTP code
    // For demo purposes, accept any 6-digit code
    return code.length === 6 && /^\d{6}$/.test(code);
  }

  // Send SMS code
  public async sendSMSCode(phoneNumber: string): Promise<boolean> {
    // In a real implementation, this would send an SMS via Twilio or similar
    console.log(`SMS code sent to ${phoneNumber}`);
    return true;
  }

  // Send email code
  public async sendEmailCode(email: string): Promise<boolean> {
    // In a real implementation, this would send an email
    console.log(`Email code sent to ${email}`);
    return true;
  }

  // Verify MFA code during login
  public async verifyMFACode(request: MFAVerificationRequest): Promise<MFAVerificationResponse> {
    // In a real implementation, this would verify against your backend
    const success = request.code.length === 6 && /^\d{6}$/.test(request.code);
    
    if (success) {
      return {
        success: true,
        message: 'MFA verification successful',
        requiresMFA: false,
        availableMethods: [],
        trustToken: request.trustDevice ? this.generateTrustToken() : undefined
      };
    } else {
      return {
        success: false,
        message: 'Invalid verification code',
        requiresMFA: true,
        availableMethods: this.getMockAvailableMethods()
      };
    }
  }

  // Get user's security settings
  public getUserSecuritySettings(_userId: string): UserSecuritySettings {
    // In a real implementation, this would fetch from your backend
    return {
      mfaEnabled: true,
      mfaMethods: [
        {
          id: 'totp-1',
          type: 'totp',
          name: 'Authenticator App',
          isEnabled: true,
          isPrimary: true,
          createdAt: '2025-08-01T00:00:00Z',
          lastUsed: '2025-08-09T12:00:00Z'
        },
        {
          id: 'sms-1',
          type: 'sms',
          name: 'SMS to +1***-***-1234',
          isEnabled: true,
          isPrimary: false,
          createdAt: '2025-08-02T00:00:00Z',
          lastUsed: '2025-08-08T15:30:00Z'
        }
      ],
      trustedDevices: [
        {
          id: 'device-1',
          deviceName: 'Chrome on MacBook Pro',
          deviceType: 'desktop',
          browser: 'Chrome 128.0',
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.100',
          createdAt: '2025-08-01T00:00:00Z',
          lastUsed: '2025-08-09T12:00:00Z',
          isActive: true
        }
      ],
      securityQuestions: [
        {
          id: 'sq-1',
          question: 'What was the name of your first pet?',
          hasAnswer: true
        },
        {
          id: 'sq-2',
          question: 'What city were you born in?',
          hasAnswer: true
        }
      ],
      loginHistory: [
        {
          id: 'login-1',
          timestamp: '2025-08-09T12:00:00Z',
          ipAddress: '192.168.1.100',
          location: 'San Francisco, CA',
          device: 'Chrome on MacBook Pro',
          success: true,
          mfaUsed: true
        },
        {
          id: 'login-2',
          timestamp: '2025-08-08T15:30:00Z',
          ipAddress: '192.168.1.100',
          location: 'San Francisco, CA',
          device: 'Chrome on MacBook Pro',
          success: true,
          mfaUsed: true
        },
        {
          id: 'login-3',
          timestamp: '2025-08-07T09:15:00Z',
          ipAddress: '203.0.113.0',
          location: 'Unknown Location',
          device: 'Firefox on Windows',
          success: false,
          failureReason: 'Invalid MFA code',
          mfaUsed: false
        }
      ]
    };
  }

  // Disable MFA method
  public async disableMFAMethod(methodId: string): Promise<boolean> {
    // In a real implementation, this would call your backend
    console.log(`Disabling MFA method: ${methodId}`);
    return true;
  }

  // Remove trusted device
  public async removeTrustedDevice(deviceId: string): Promise<boolean> {
    // In a real implementation, this would call your backend
    console.log(`Removing trusted device: ${deviceId}`);
    return true;
  }

  // Check if device is trusted
  public isDeviceTrusted(): boolean {
    // Check if current device has a trust token
    return localStorage.getItem('mfa_trust_token') !== null;
  }

  // Private helper methods
  private generateTOTPSecret(): string {
    // Generate a base32 secret
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
  }

  private generateQRCodeUrl(secret: string, userId: string): string {
    // Generate QR code URL for authenticator apps
    const issuer = 'InnoSpot';
    const label = `${issuer}:${userId}`;
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
  }

  private generateBackupCodes(): string[] {
    // Generate 10 backup codes
    const codes = [];
    for (let i = 0; i < 10; i++) {
      let code = '';
      for (let j = 0; j < 8; j++) {
        code += Math.floor(Math.random() * 10).toString();
      }
      // Format as XXXX-XXXX
      code = code.substring(0, 4) + '-' + code.substring(4);
      codes.push(code);
    }
    return codes;
  }

  private formatManualEntryKey(secret: string): string {
    // Format secret for manual entry (groups of 4 characters)
    return secret.match(/.{1,4}/g)?.join(' ') || secret;
  }

  private generateTrustToken(): string {
    // Generate a trust token for the device
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('mfa_trust_token', token);
    localStorage.setItem('mfa_trust_expires', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString()); // 30 days
    return token;
  }

  private getMockAvailableMethods(): MFAMethod[] {
    return [
      {
        id: 'totp-1',
        type: 'totp',
        name: 'Authenticator App',
        isEnabled: true,
        isPrimary: true,
        createdAt: '2025-08-01T00:00:00Z'
      },
      {
        id: 'sms-1',
        type: 'sms',
        name: 'SMS',
        isEnabled: true,
        isPrimary: false,
        createdAt: '2025-08-02T00:00:00Z'
      }
    ];
  }
}