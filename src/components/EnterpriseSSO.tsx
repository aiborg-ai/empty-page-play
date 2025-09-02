import { useState } from 'react';
import {
  Shield,
  Key,
  Users,
  Settings,
  Plus,
  Edit3,
  Copy,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Link as LinkIcon,
  Lock,
  UserCheck,
  UserPlus,
  Clock,
  MoreHorizontal,
  Search,
  Filter,
  Save,
  TestTube
} from 'lucide-react';
import { SSOProvider } from '@/types/enterprise';

interface EnterpriseSSOProps {
  onNavigate?: (section: string) => void;
}

export default function EnterpriseSSO({ onNavigate: _onNavigate }: EnterpriseSSOProps) {
  const [selectedTab, setSelectedTab] = useState('providers');
  const [_showAddModal, setShowAddModal] = useState(false);
  const [_selectedProvider, _setSelectedProvider] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Mock SSO providers data
  const ssoProviders: SSOProvider[] = [
    {
      id: '1',
      name: 'Microsoft Azure AD',
      type: 'saml',
      status: 'active',
      organizationId: 'org_1',
      config: {
        entityId: 'urn:techcorp:azure:ad',
        ssoUrl: 'https://login.microsoftonline.com/12345/saml2',
        x509Certificate: '-----BEGIN CERTIFICATE-----\nMIIC...truncated...==\n-----END CERTIFICATE-----',
        attributeMapping: {
          email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
          firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
          lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
          displayName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
          groups: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/groups'
        },
        autoProvisioning: true,
        defaultRole: 'user',
        groupMapping: [
          { ssoGroup: 'InnoSpot-Admins', internalRole: 'admin', department: 'IT' },
          { ssoGroup: 'InnoSpot-Users', internalRole: 'user' },
          { ssoGroup: 'InnoSpot-Researchers', internalRole: 'researcher', department: 'R&D' }
        ]
      },
      userCount: 156,
      lastSync: '2024-01-15T10:30:00Z',
      createdAt: '2023-06-15T08:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Google Workspace',
      type: 'oauth',
      status: 'active',
      organizationId: 'org_1',
      config: {
        clientId: '123456789-abcdefg.apps.googleusercontent.com',
        clientSecret: 'GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxx',
        authUrl: 'https://accounts.google.com/oauth/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
        scope: ['openid', 'email', 'profile'],
        attributeMapping: {
          email: 'email',
          firstName: 'given_name',
          lastName: 'family_name',
          displayName: 'name'
        },
        autoProvisioning: false,
        defaultRole: 'user'
      },
      userCount: 89,
      lastSync: '2024-01-14T16:45:00Z',
      createdAt: '2023-08-20T14:30:00Z',
      updatedAt: '2024-01-10T09:15:00Z'
    },
    {
      id: '3',
      name: 'Okta',
      type: 'oidc',
      status: 'inactive',
      organizationId: 'org_1',
      config: {
        clientId: '0oa1b2c3d4e5f6g7h8i9',
        clientSecret: 'abcdefghijklmnopqrstuvwxyz1234567890ABCD',
        authUrl: 'https://dev-123456.okta.com/oauth2/v1/authorize',
        tokenUrl: 'https://dev-123456.okta.com/oauth2/v1/token',
        userInfoUrl: 'https://dev-123456.okta.com/oauth2/v1/userinfo',
        scope: ['openid', 'profile', 'email', 'groups'],
        attributeMapping: {
          email: 'email',
          firstName: 'given_name',
          lastName: 'family_name',
          displayName: 'name',
          groups: 'groups'
        },
        autoProvisioning: true,
        defaultRole: 'user',
        groupMapping: [
          { ssoGroup: 'TechCorp-Admins', internalRole: 'admin' },
          { ssoGroup: 'TechCorp-Managers', internalRole: 'manager' }
        ]
      },
      userCount: 0,
      createdAt: '2023-12-01T10:00:00Z',
      updatedAt: '2024-01-05T11:20:00Z'
    }
  ];

  const toggleSecretVisibility = (providerId: string, field: string) => {
    const key = `${providerId}-${field}`;
    const newShowSecrets = new Set(showSecrets);
    if (newShowSecrets.has(key)) {
      newShowSecrets.delete(key);
    } else {
      newShowSecrets.add(key);
    }
    setShowSecrets(newShowSecrets);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'saml': return <Shield className="w-4 h-4" />;
      case 'oauth': return <Key className="w-4 h-4" />;
      case 'oidc': return <Lock className="w-4 h-4" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  const testConnection = async (providerId: string) => {
    setTestResults({ ...testResults, [providerId]: { testing: true } });
    
    // Simulate test
    setTimeout(() => {
      setTestResults({
        ...testResults,
        [providerId]: {
          success: Math.random() > 0.3,
          message: Math.random() > 0.3 ? 'Connection successful' : 'Invalid certificate',
          timestamp: new Date().toISOString()
        }
      });
    }, 2000);
  };

  const renderProvidersTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">SSO Providers</h3>
          <p className="text-sm text-gray-600">Configure identity providers for single sign-on</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Provider
        </button>
      </div>

      {/* Providers List */}
      <div className="space-y-4">
        {ssoProviders.map((provider) => (
          <div key={provider.id} className="border border-gray-200 rounded-lg bg-white">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getTypeIcon(provider.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                        {provider.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded uppercase">
                        {provider.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{provider.userCount} users configured</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => testConnection(provider.id)}
                    disabled={testResults[provider.id]?.testing}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1"
                  >
                    {testResults[provider.id]?.testing ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <TestTube className="w-3 h-3" />
                    )}
                    Test
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit3 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Test Results */}
              {testResults[provider.id] && !testResults[provider.id].testing && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                  testResults[provider.id].success 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {testResults[provider.id].success ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm">{testResults[provider.id].message}</span>
                  <span className="text-xs opacity-75 ml-auto">
                    {new Date(testResults[provider.id].timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )}

              {/* Provider Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configuration
                  </h5>
                  <div className="space-y-3 text-sm">
                    {provider.type === 'saml' && (
                      <>
                        <div>
                          <label className="text-gray-600">Entity ID:</label>
                          <div className="font-mono text-xs text-gray-900 mt-1 p-2 bg-gray-50 rounded">
                            {provider.config.entityId}
                          </div>
                        </div>
                        <div>
                          <label className="text-gray-600">SSO URL:</label>
                          <div className="font-mono text-xs text-gray-900 mt-1 p-2 bg-gray-50 rounded">
                            {provider.config.ssoUrl}
                          </div>
                        </div>
                      </>
                    )}
                    {(provider.type === 'oauth' || provider.type === 'oidc') && (
                      <>
                        <div>
                          <label className="text-gray-600">Client ID:</label>
                          <div className="font-mono text-xs text-gray-900 mt-1 p-2 bg-gray-50 rounded flex items-center justify-between">
                            <span>{provider.config.clientId}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(provider.config.clientId || '')}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-gray-600">Client Secret:</label>
                          <div className="font-mono text-xs text-gray-900 mt-1 p-2 bg-gray-50 rounded flex items-center justify-between">
                            <span>
                              {showSecrets.has(`${provider.id}-secret`) 
                                ? provider.config.clientSecret 
                                : '••••••••••••••••'
                              }
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => toggleSecretVisibility(provider.id, 'secret')}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                {showSecrets.has(`${provider.id}-secret`) ? (
                                  <EyeOff className="w-3 h-3" />
                                ) : (
                                  <Eye className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => navigator.clipboard.writeText(provider.config.clientSecret || '')}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Auto Provisioning:</span>
                      {provider.config.autoProvisioning ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Default Role:</span>
                      <span className="font-medium capitalize">{provider.config.defaultRole}</span>
                    </div>
                  </div>
                </div>

                {/* Attribute Mapping */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Attribute Mapping
                  </h5>
                  <div className="space-y-2 text-sm">
                    {Object.entries(provider.config.attributeMapping).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-mono text-xs text-gray-900 max-w-48 truncate">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Group Mapping */}
                  {provider.config.groupMapping && (
                    <div className="mt-4">
                      <h6 className="font-medium text-gray-900 mb-2 text-sm">Group Mapping</h6>
                      <div className="space-y-2">
                        {provider.config.groupMapping.map((mapping, index) => (
                          <div key={index} className="text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">{mapping.ssoGroup}</span>
                              <span className="font-medium">{mapping.internalRole}</span>
                            </div>
                            {mapping.department && (
                              <div className="text-gray-500 ml-2">→ {mapping.department}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Created {new Date(provider.createdAt).toLocaleDateString()}</span>
                  {provider.lastSync && (
                    <span>Last sync {new Date(provider.lastSync).toLocaleDateString()}</span>
                  )}
                </div>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  View Logs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">SSO Users</h3>
          <p className="text-sm text-gray-600">Manage users from identity providers</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync Users
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Invite User
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              {
                name: 'John Smith',
                email: 'john.smith@techcorp.com',
                provider: 'Microsoft Azure AD',
                role: 'Admin',
                lastLogin: '2024-01-15T10:30:00Z',
                status: 'active'
              },
              {
                name: 'Sarah Connor',
                email: 'sarah.connor@techcorp.com',
                provider: 'Google Workspace',
                role: 'User',
                lastLogin: '2024-01-14T16:45:00Z',
                status: 'active'
              },
              {
                name: 'Mike Johnson',
                email: 'mike.johnson@techcorp.com',
                provider: 'Microsoft Azure AD',
                role: 'Researcher',
                lastLogin: '2024-01-10T09:15:00Z',
                status: 'inactive'
              }
            ].map((user, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.provider}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">SSO Settings</h3>
        <p className="text-sm text-gray-600">Global SSO configuration and security settings</p>
      </div>

      {/* Settings Form */}
      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">General Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Enforce SSO for all users</label>
                <p className="text-sm text-gray-500">Require all users to authenticate via SSO</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Allow password fallback</label>
                <p className="text-sm text-gray-500">Users can use password if SSO fails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Auto-provision new users</label>
                <p className="text-sm text-gray-500">Automatically create accounts for new SSO users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Session Management
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (hours)
              </label>
              <input
                type="number"
                defaultValue="8"
                min="1"
                max="24"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idle Timeout (minutes)
              </label>
              <input
                type="number"
                defaultValue="30"
                min="5"
                max="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Settings
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Domains (comma-separated)
              </label>
              <input
                type="text"
                defaultValue="techcorp.com, subsidiary.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Require MFA after SSO</label>
                <p className="text-sm text-gray-500">Additional security layer after SSO login</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'providers', label: 'SSO Providers', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Enterprise SSO</h1>
        <p className="text-gray-600">Single Sign-On configuration and identity provider management</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'providers' && renderProvidersTab()}
      {selectedTab === 'users' && renderUsersTab()}
      {selectedTab === 'settings' && renderSettingsTab()}
    </div>
  );
}