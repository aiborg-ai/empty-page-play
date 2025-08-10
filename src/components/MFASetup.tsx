import { useState } from 'react';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Mail, 
  Copy, 
  Eye, 
  EyeOff,
  Check,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';
import { MFASetupResponse } from '../types/auth';
import { MFAService } from '../lib/mfaService';

interface MFASetupProps {
  onSetupComplete: () => void;
  onCancel: () => void;
}

export default function MFASetup({ onSetupComplete, onCancel }: MFASetupProps) {
  const [step, setStep] = useState<'method' | 'setup' | 'verify' | 'backup'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'sms' | 'email'>('totp');
  const [setupData, setSetupData] = useState<MFASetupResponse | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [downloadedBackupCodes, setDownloadedBackupCodes] = useState(false);

  const mfaService = MFAService.getInstance();

  const handleMethodSelection = (method: 'totp' | 'sms' | 'email') => {
    setSelectedMethod(method);
    setStep('setup');
    if (method === 'totp') {
      setupTOTP();
    }
  };

  const setupTOTP = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await mfaService.setupTOTP('user@example.com');
      setSetupData(data);
    } catch (err) {
      setError('Failed to set up authenticator app. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let success = false;

      if (selectedMethod === 'totp' && setupData) {
        success = await mfaService.verifyTOTPSetup(setupData.secret, verificationCode);
      } else if (selectedMethod === 'sms') {
        success = await mfaService.verifyMFACode({
          methodId: 'sms-setup',
          code: verificationCode
        }).then(r => r.success);
      } else if (selectedMethod === 'email') {
        success = await mfaService.verifyMFACode({
          methodId: 'email-setup',
          code: verificationCode
        }).then(r => r.success);
      }

      if (success) {
        if (selectedMethod === 'totp') {
          setStep('backup');
        } else {
          onSetupComplete();
        }
      } else {
        setError('Invalid verification code. Please try again.');
        setVerificationCode('');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendSMSCode = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      await mfaService.sendSMSCode(phoneNumber);
      setStep('verify');
    } catch (err) {
      setError('Failed to send SMS code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailCode = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await mfaService.sendEmailCode(email);
      setStep('verify');
    } catch (err) {
      setError('Failed to send email code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could show a toast notification here
  };

  const downloadBackupCodes = () => {
    if (!setupData) return;

    const content = `InnoSpot Backup Codes\n\nIMPORTANT: Save these backup codes in a secure location.\nEach code can only be used once.\n\n${setupData.backupCodes.join('\n')}\n\nGenerated: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'innospot-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloadedBackupCodes(true);
  };

  if (step === 'method') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Enable Two-Factor Authentication</h2>
          <p className="text-gray-600 mt-2">
            Add an extra layer of security to your account
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleMethodSelection('totp')}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <Key className="w-6 h-6 text-blue-600 mr-4" />
            <div>
              <div className="font-medium text-gray-900">Authenticator App</div>
              <div className="text-sm text-gray-600">
                Use Google Authenticator, Authy, or similar apps
              </div>
            </div>
            <div className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Recommended
            </div>
          </button>

          <button
            onClick={() => handleMethodSelection('sms')}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <Smartphone className="w-6 h-6 text-blue-600 mr-4" />
            <div>
              <div className="font-medium text-gray-900">SMS Text Message</div>
              <div className="text-sm text-gray-600">
                Receive codes via text message
              </div>
            </div>
          </button>

          <button
            onClick={() => handleMethodSelection('email')}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <Mail className="w-6 h-6 text-blue-600 mr-4" />
            <div>
              <div className="font-medium text-gray-900">Email</div>
              <div className="text-sm text-gray-600">
                Receive codes via email
              </div>
            </div>
          </button>
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

  if (step === 'setup' && selectedMethod === 'totp') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Key className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Set Up Authenticator App</h2>
          <p className="text-gray-600 mt-2">
            Scan the QR code or enter the secret key manually
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Setting up authenticator...</p>
          </div>
        ) : setupData ? (
          <>
            {/* QR Code */}
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg">
                <img
                  src={setupData.qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>

            {/* Manual Entry */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Can't scan? Enter this key manually:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={setupData.manualEntryKey}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(setupData.secret)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Install an authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>2. Scan the QR code or enter the key manually</li>
                <li>3. Enter the 6-digit code from your app below</li>
              </ol>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Continue to Verification
            </button>
          </>
        ) : error && (
          <div className="text-center py-8">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={setupTOTP}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  }

  if (step === 'setup' && selectedMethod === 'sms') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Smartphone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Set Up SMS Authentication</h2>
          <p className="text-gray-600 mt-2">
            Enter your phone number to receive verification codes
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={sendSMSCode}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
            Send Verification Code
          </button>

          <button
            onClick={() => setStep('method')}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (step === 'setup' && selectedMethod === 'email') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Set Up Email Authentication</h2>
          <p className="text-gray-600 mt-2">
            Enter your email address to receive verification codes
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={sendEmailCode}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            Send Verification Code
          </button>

          <button
            onClick={() => setStep('method')}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Verify Setup</h2>
          <p className="text-gray-600 mt-2">
            Enter the verification code to complete setup
          </p>
        </div>

        <div className="mb-6">
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
            className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg font-mono tracking-widest focus:ring-blue-500 focus:border-blue-500"
            maxLength={6}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleVerification}
            disabled={isLoading || !verificationCode.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Verify & Complete Setup
          </button>

          <button
            onClick={() => setStep('setup')}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (step === 'backup' && setupData) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Setup Complete!</h2>
          <p className="text-gray-600 mt-2">
            Save your backup codes for account recovery
          </p>
        </div>

        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">Important!</h4>
              <p className="text-sm text-amber-700">
                Save these backup codes in a secure location. Each code can only be used once.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Backup Codes:</h4>
          <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            {setupData.backupCodes.map((code, index) => (
              <div
                key={index}
                className="text-center font-mono text-sm p-2 bg-white border border-gray-200 rounded"
              >
                {code}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={downloadBackupCodes}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
          >
            <Download className="w-4 h-4" />
            Download Backup Codes
          </button>

          <button
            onClick={onSetupComplete}
            disabled={!downloadedBackupCodes}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Check className="w-4 h-4" />
            {downloadedBackupCodes ? 'Complete Setup' : 'Download Codes First'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            You can always generate new backup codes in your security settings
          </p>
        </div>
      </div>
    );
  }

  return null;
}