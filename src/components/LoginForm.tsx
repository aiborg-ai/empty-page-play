import { useState } from 'react';
import { UnifiedAuthService } from '../lib/unifiedAuth';
import { MFAService } from '../lib/mfaService';
import { User, Eye, EyeOff, LogIn } from 'lucide-react';
import MFAVerification from './MFAVerification';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('demo@innospot.com');
  const [password, setPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMFA, setShowMFA] = useState(false);
  const [tempToken, setTempToken] = useState('');

  const demoCredentials = UnifiedAuthService.getDemoCredentials();
  const mfaService = MFAService.getInstance();
  const authMode = UnifiedAuthService.getMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await UnifiedAuthService.login(email, password);
      
      if (result.success) {
        console.log(`${authMode === 'production' ? '🚀 Production' : '🔧 Demo'} Login Success:`, result.user);
        
        // For production mode, skip MFA for demo users, for demo mode use existing MFA logic
        if (authMode === 'production' || mfaService.isDeviceTrusted()) {
          onSuccess?.();
        } else {
          // Require MFA verification (demo mode only)
          setTempToken('temp-auth-token-' + Date.now());
          setShowMFA(true);
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const handleMFAVerificationSuccess = (trustToken?: string) => {
    console.log('MFA Verification Success');
    if (trustToken) {
      console.log('Device trusted with token:', trustToken);
    }
    setShowMFA(false);
    onSuccess?.();
  };

  const handleMFACanceled = () => {
    setShowMFA(false);
    setError('Two-factor authentication is required to complete sign in');
  };

  // Show MFA verification if needed
  if (showMFA) {
    const availableMethods = mfaService.getUserSecuritySettings('current-user').mfaMethods;
    return (
      <MFAVerification
        methods={availableMethods}
        onVerificationSuccess={handleMFAVerificationSuccess}
        onCancel={handleMFACanceled}
        tempToken={tempToken}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <LogIn className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
        </div>

        {/* Demo Accounts */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-green-800">Demo Accounts Available</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              authMode === 'production' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {authMode === 'production' ? '🚀 Production' : '🔧 Demo'} Mode
            </span>
          </div>
          <div className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <div key={index} className="flex items-center justify-between text-xs border rounded p-2 bg-white">
                <div>
                  <div className="font-mono text-green-700 font-medium">
                    {cred.email}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {'type' in cred ? cred.type : cred.email.split('@')[0]} 
                    {' • '}
                    {'description' in cred ? cred.description : 'Demo user'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDemoLogin(cred.email, cred.password)}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-medium"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-green-600 mt-3">
            {authMode === 'production' 
              ? '✅ Pre-verified accounts - No email verification required!' 
              : 'Click "Use" to auto-fill login credentials'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button className="text-blue-600 hover:underline">
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}