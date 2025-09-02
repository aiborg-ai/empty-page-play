import { useState } from 'react';
import { UserRegistration } from '../types/auth';
import { RegistrationService, RegistrationData } from '../lib/registrationService';
import { Check, User, Eye, EyeOff } from 'lucide-react';
import EmailVerificationModal from './EmailVerificationModal';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState<UserRegistration>({
    email: 'demo@innospot.com',
    username: 'demo_user',
    firstName: 'Demo',
    lastName: 'User',
    password: 'demo123456',
    useType: 'non-commercial',
    recordSearchHistory: true,
    agreeToTerms: true,
  });

  const [confirmPassword, setConfirmPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUseTypeChange = (useType: UserRegistration['useType']) => {
    setFormData(prev => ({ ...prev, useType }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData: RegistrationData = {
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        useType: formData.useType,
        recordSearchHistory: formData.recordSearchHistory,
        agreeToTerms: formData.agreeToTerms,
      };

      const result = await RegistrationService.register(registrationData);

      if (result.success) {
        if (result.needsEmailVerification) {
          setRegistrationEmail(formData.email);
          setShowEmailVerification(true);
        } else {
          console.log('Registration Success:', result.user);
          onSuccess?.();
        }
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailVerificationSuccess = () => {
    setShowEmailVerification(false);
    onSuccess?.();
  };

  const handleCloseEmailVerification = () => {
    setShowEmailVerification(false);
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Register</h2>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Your personal details are secure. We don't share or sell any knowledge of your use of InnoSpot. 
            We don't keep track of what you do or use your email address (unless you ask us to) via your privacy settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Use Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Define Use Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="useType"
                  value="trial"
                  checked={formData.useType === 'trial'}
                  onChange={() => handleUseTypeChange('trial')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">Trial Use</div>
                  <div className="text-xs text-gray-600">
                    For platform evaluation purposes, Trial accounts will remain active for 2 weeks from registration.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 bg-green-50 border-green-200">
                <input
                  type="radio"
                  name="useType"
                  value="non-commercial"
                  checked={formData.useType === 'non-commercial'}
                  onChange={() => handleUseTypeChange('non-commercial')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">Non-commercial Use</div>
                  <div className="text-xs text-gray-600">
                    For users affiliated with a public good or non-profit institution or using InnoSpot for non-commercial purposes.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="useType"
                  value="commercial"
                  checked={formData.useType === 'commercial'}
                  onChange={() => handleUseTypeChange('commercial')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">Commercial Use</div>
                  <div className="text-xs text-gray-600">
                    For professional users using, or planning to use, InnoSpot platform or metadata for commercial purposes.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your Email <span className="text-red-500">*</span>
              {formData.useType === 'non-commercial' && (
                <span className="text-xs text-gray-500 block">
                  (for non-commercial use, You must use your email affiliated with your non-profit or public good institution)
                </span>
              )}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose your desired Username <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 block">
                (Please use only letters, numbers and underscores)
              </span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              pattern="[A-Za-z0-9_]+"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Choose username"
            />
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Create a password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat your password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-green-800">Verifying you are a valid user</div>
              <div className="text-sm text-green-700">Success!</div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="recordSearchHistory"
                checked={formData.recordSearchHistory}
                onChange={handleInputChange}
                className="mt-1"
              />
              <span className="text-sm text-gray-700">
                Do you want to record your search history?
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
              <span className="text-sm text-gray-700">
                Do you agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  terms and conditions
                </a>{' '}
                of using our services?
              </span>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="text-right">
            <p className="text-xs text-gray-500 mb-3">* All fields are required</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>

      <EmailVerificationModal
        isOpen={showEmailVerification}
        email={registrationEmail}
        onClose={handleCloseEmailVerification}
        onSuccess={handleEmailVerificationSuccess}
      />
    </>
  );
}