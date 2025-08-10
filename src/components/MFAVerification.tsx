import { useState, useEffect } from 'react';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  Key, 
  RefreshCw, 
  Clock, 
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { MFAMethod, MFAVerificationRequest } from '../types/auth';
import { MFAService } from '../lib/mfaService';

interface MFAVerificationProps {
  methods: MFAMethod[];
  onVerificationSuccess: (trustToken?: string) => void;
  onCancel: () => void;
  tempToken: string;
}

export default function MFAVerification({ methods, onVerificationSuccess, onCancel }: MFAVerificationProps) {
  const [selectedMethod, setSelectedMethod] = useState<MFAMethod | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const mfaService = MFAService.getInstance();

  useEffect(() => {
    // Auto-select the primary method if available
    const primaryMethod = methods.find(m => m.isPrimary) || methods[0];
    if (primaryMethod) {
      setSelectedMethod(primaryMethod);
    }
  }, [methods]);

  useEffect(() => {
    // Countdown timer for resend
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async (method: MFAMethod) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      let sent = false;
      if (method.type === 'sms') {
        sent = await mfaService.sendSMSCode('placeholder-phone');
        setSuccess('SMS code sent to your phone');
      } else if (method.type === 'email') {
        sent = await mfaService.sendEmailCode('placeholder-email');
        setSuccess('Verification code sent to your email');
      }

      if (sent) {
        setCountdown(30); // 30 second cooldown
      }
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!selectedMethod || !verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const request: MFAVerificationRequest = {
        methodId: selectedMethod.id,
        code: verificationCode.trim(),
        trustDevice
      };

      const response = await mfaService.verifyMFACode(request);

      if (response.success) {
        setSuccess('Verification successful!');
        setTimeout(() => {
          onVerificationSuccess(response.trustToken);
        }, 1000);
      } else {
        setError(response.message || 'Invalid verification code');
        setVerificationCode('');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'totp':
        return <Key className="w-5 h-5" />;
      case 'sms':
        return <Smartphone className="w-5 h-5" />;
      case 'email':
        return <Mail className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getMethodDescription = (method: MFAMethod) => {
    switch (method.type) {
      case 'totp':
        return 'Enter the 6-digit code from your authenticator app';
      case 'sms':
        return 'Enter the code sent to your phone';
      case 'email':
        return 'Enter the code sent to your email';
      default:
        return 'Enter your verification code';
    }
  };

  if (!selectedMethod) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
          <p className="text-gray-600 mt-2">No MFA methods available</p>
        </div>
        <button
          onClick={onCancel}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
        <p className="text-gray-600 mt-2">
          Additional verification required to complete sign in
        </p>
      </div>

      {/* Method Selection */}
      {methods.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose verification method:
          </label>
          <div className="space-y-2">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={`w-full flex items-center p-3 border rounded-lg text-left transition-colors ${
                  selectedMethod.id === method.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getMethodIcon(method.type)}
                  <div>
                    <div className="font-medium">{method.name}</div>
                    {method.isPrimary && (
                      <div className="text-xs text-blue-600">Primary method</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Verification Form */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          {getMethodIcon(selectedMethod.type)}
          <div>
            <div className="font-medium text-gray-900">{selectedMethod.name}</div>
            <div className="text-sm text-gray-600">
              {getMethodDescription(selectedMethod)}
            </div>
          </div>
        </div>

        {/* Send Code Button (for SMS/Email) */}
        {(selectedMethod.type === 'sms' || selectedMethod.type === 'email') && (
          <div className="mb-4">
            <button
              onClick={() => handleSendCode(selectedMethod)}
              disabled={isLoading || countdown > 0}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              {countdown > 0 ? (
                <>
                  <Clock className="w-4 h-4" />
                  Resend in {countdown}s
                </>
              ) : (
                `Send ${selectedMethod.type === 'sms' ? 'SMS' : 'Email'} Code`
              )}
            </button>
          </div>
        )}

        {/* Verification Code Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(value);
              setError('');
            }}
            placeholder="000000"
            className={`w-full p-3 border rounded-lg text-center text-lg font-mono tracking-widest focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={6}
            autoComplete="one-time-code"
          />
        </div>

        {/* Trust Device Option */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Trust this device for 30 days
            </span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm text-green-600">{success}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleVerification}
          disabled={isLoading || !verificationCode.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>

        <button
          onClick={onCancel}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Having trouble? Contact support for assistance with account recovery.
        </p>
      </div>
    </div>
  );
}