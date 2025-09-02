import { useState } from 'react';
import { InstantAuthService } from '../lib/instantAuth';
import { startLiveDemo } from '../lib/liveDemoService';
import { User, Eye, EyeOff, LogIn, Sparkles, Zap } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('demo@innospot.com');
  const [password, setPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoStarting, setIsDemoStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const demoCredentials = InstantAuthService.getDemoCredentials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log('🔥 ATTEMPTING INSTANT LOGIN:', email);
      const result = await InstantAuthService.login(email, password);
      
      if (result.success) {
        console.log('✅ INSTANT LOGIN SUCCESS:', result.user);
        // Skip ALL verification for instant auth
        onSuccess?.();
      } else {
        console.log('❌ INSTANT LOGIN FAILED:', result.error);
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('🔥 LOGIN ERROR:', err);
      setError('Login failed - please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const handleStartLiveDemo = async () => {
    setIsDemoStarting(true);
    setError(null);
    
    try {
      console.log('🚀 Starting Live Demo Session');
      const session = startLiveDemo();
      
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Live Demo Started:', session);
      
      // Trigger success callback to navigate to dashboard
      onSuccess?.();
    } catch (err) {
      console.error('❌ Failed to start demo:', err);
      setError('Failed to start demo - please try again');
    } finally {
      setIsDemoStarting(false);
    }
  };


  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <LogIn className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
        </div>

        {/* Live Demo Button - Most Prominent */}
        <div className="mb-6">
          <button
            onClick={handleStartLiveDemo}
            disabled={isDemoStarting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isDemoStarting ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Starting Live Demo...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <Zap className="w-6 h-6" />
                Try Live Demo - No Login Required
                <Sparkles className="w-5 h-5 animate-pulse" />
              </span>
            )}
          </button>
          <p className="text-xs text-center text-gray-600 mt-2">
            🚀 Instant access • No signup • Full features for 24 hours
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign in with account</span>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-green-800">✅ Instant Demo Accounts</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
              🔥 NO VERIFICATION NEEDED
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
                    {cred.type} • {cred.description}
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
            🚀 <strong>GUARANTEED TO WORK:</strong> These accounts bypass ALL verification requirements!
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