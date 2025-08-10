import { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Mail, 
  Monitor, 
  History,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { UserSecuritySettings } from '../types/auth';
import { MFAService } from '../lib/mfaService';
import MFASetup from './MFASetup';

export default function SecuritySettings() {
  const [securitySettings, setSecuritySettings] = useState<UserSecuritySettings | null>(null);
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'methods' | 'devices' | 'history'>('methods');
  const [isLoading, setIsLoading] = useState(true);

  const mfaService = MFAService.getInstance();

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      // In a real app, you'd get the actual user ID
      const settings = mfaService.getUserSecuritySettings('current-user');
      setSecuritySettings(settings);
    } catch (error) {
      console.error('Failed to load security settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFASetupComplete = async () => {
    setShowMFASetup(false);
    await loadSecuritySettings(); // Refresh settings
  };

  const handleDisableMFA = async (methodId: string) => {
    if (window.confirm('Are you sure you want to disable this MFA method?')) {
      try {
        await mfaService.disableMFAMethod(methodId);
        await loadSecuritySettings(); // Refresh settings
      } catch (error) {
        console.error('Failed to disable MFA method:', error);
      }
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (window.confirm('Are you sure you want to remove this trusted device?')) {
      try {
        await mfaService.removeTrustedDevice(deviceId);
        await loadSecuritySettings(); // Refresh settings
      } catch (error) {
        console.error('Failed to remove trusted device:', error);
      }
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'totp':
        return <Key className="w-5 h-5 text-blue-600" />;
      case 'sms':
        return <Smartphone className="w-5 h-5 text-green-600" />;
      case 'email':
        return <Mail className="w-5 h-5 text-purple-600" />;
      default:
        return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="w-5 h-5 text-blue-600" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-green-600" />;
      case 'tablet':
        return <Smartphone className="w-5 h-5 text-purple-600" />;
      default:
        return <Monitor className="w-5 h-5 text-gray-600" />;
    }
  };

  if (showMFASetup) {
    return (
      <MFASetup
        onSetupComplete={handleMFASetupComplete}
        onCancel={() => setShowMFASetup(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!securitySettings) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Security Settings</h3>
          <p className="text-gray-600 mb-4">Unable to load your security configuration</p>
          <button
            onClick={loadSecuritySettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        </div>
        <p className="text-gray-600">
          Manage your account security and two-factor authentication settings
        </p>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">MFA Status</p>
              <p className={`text-lg font-semibold ${securitySettings.mfaEnabled ? 'text-green-600' : 'text-red-600'}`}>
                {securitySettings.mfaEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${securitySettings.mfaEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
              <Shield className={`w-6 h-6 ${securitySettings.mfaEnabled ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">MFA Methods</p>
              <p className="text-lg font-semibold text-gray-900">
                {securitySettings.mfaMethods.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trusted Devices</p>
              <p className="text-lg font-semibold text-gray-900">
                {securitySettings.trustedDevices.filter(d => d.isActive).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Monitor className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'methods', label: 'MFA Methods', icon: Key },
            { key: 'devices', label: 'Trusted Devices', icon: Monitor },
            { key: 'history', label: 'Login History', icon: History }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* MFA Methods Tab */}
      {selectedTab === 'methods' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication Methods</h2>
            <button
              onClick={() => setShowMFASetup(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Method
            </button>
          </div>

          {securitySettings.mfaMethods.length === 0 ? (
            <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Shield className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No MFA Methods Enabled</h3>
              <p className="text-gray-600 mb-4">
                Secure your account by enabling two-factor authentication
              </p>
              <button
                onClick={() => setShowMFASetup(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enable MFA
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {securitySettings.mfaMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {getMethodIcon(method.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{method.name}</h3>
                        {method.isPrimary && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {method.lastUsed ? (
                          <>Last used: {new Date(method.lastUsed).toLocaleDateString()}</>
                        ) : (
                          'Never used'
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      method.isEnabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {method.isEnabled ? 'Active' : 'Inactive'}
                    </div>
                    <button
                      onClick={() => handleDisableMFA(method.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Remove method"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trusted Devices Tab */}
      {selectedTab === 'devices' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Trusted Devices</h2>
            <p className="text-gray-600">
              Devices where you've chosen to skip MFA verification for 30 days
            </p>
          </div>

          {securitySettings.trustedDevices.filter(d => d.isActive).length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
              <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Trusted Devices</h3>
              <p className="text-gray-600">
                When you choose to trust a device during MFA verification, it will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {securitySettings.trustedDevices
                .filter(device => device.isActive)
                .map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {getDeviceIcon(device.deviceType)}
                      <div>
                        <h3 className="font-medium text-gray-900">{device.deviceName}</h3>
                        <div className="text-sm text-gray-600 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {device.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Added: {new Date(device.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last used: {new Date(device.lastUsed).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDevice(device.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Remove device"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Login History Tab */}
      {selectedTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Login History</h2>
            <p className="text-gray-600">
              Recent login attempts and their verification status
            </p>
          </div>

          <div className="space-y-4">
            {securitySettings.loginHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    entry.success
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {entry.success ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${
                        entry.success ? 'text-gray-900' : 'text-red-900'
                      }`}>
                        {entry.success ? 'Successful Login' : 'Failed Login'}
                      </h3>
                      {entry.mfaUsed && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          MFA Used
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>{entry.device}</span>
                        <span>{entry.location}</span>
                        <span>{entry.ipAddress}</span>
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      {entry.failureReason && (
                        <div className="text-red-600 mt-1">
                          Reason: {entry.failureReason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}