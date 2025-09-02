/**
 * Third-Party Service Integrations Component
 * Manages connections to third-party services like Slack, Teams, Google Workspace,
 * file storage providers, and automation platforms
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  Folder,
  Zap,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  ExternalLink,
  Bell,
  Link,
  Activity
} from 'lucide-react';
import { integrationService } from '@/lib/integrationService';
import type { 
  ThirdPartyIntegration, 
  ThirdPartyService, 
  ThirdPartyFeature 
} from '@/types/integrations';

interface ThirdPartyIntegrationsProps {
  userId: string;
}

export const ThirdPartyIntegrations: React.FC<ThirdPartyIntegrationsProps> = ({ userId }) => {
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<ThirdPartyIntegration | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const serviceCategories = {
    communication: {
      title: 'Communication',
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-100',
      services: ['slack', 'microsoft_teams', 'discord', 'telegram']
    },
    productivity: {
      title: 'Productivity',
      icon: Mail,
      color: 'text-green-600 bg-green-100',
      services: ['google_workspace']
    },
    storage: {
      title: 'File Storage',
      icon: Folder,
      color: 'text-purple-600 bg-purple-100',
      services: ['dropbox', 'box', 'onedrive']
    },
    automation: {
      title: 'Automation',
      icon: Zap,
      color: 'text-orange-600 bg-orange-100',
      services: ['zapier', 'make', 'ifttt']
    }
  };

  const serviceInfo = {
    slack: {
      name: 'Slack',
      description: 'Team communication and collaboration platform',
      icon: '💬',
      features: ['notifications', 'messaging', 'file_sharing'],
      authType: 'OAuth 2.0',
      website: 'https://slack.com'
    },
    microsoft_teams: {
      name: 'Microsoft Teams',
      description: 'Unified communication and collaboration platform',
      icon: '🟦',
      features: ['notifications', 'messaging', 'calendar', 'file_sharing'],
      authType: 'OAuth 2.0',
      website: 'https://teams.microsoft.com'
    },
    google_workspace: {
      name: 'Google Workspace',
      description: 'Productivity and collaboration tools',
      icon: '📧',
      features: ['calendar', 'document_collaboration', 'file_sharing'],
      authType: 'OAuth 2.0',
      website: 'https://workspace.google.com'
    },
    dropbox: {
      name: 'Dropbox',
      description: 'Cloud file storage and sharing',
      icon: '📦',
      features: ['file_sharing', 'document_collaboration'],
      authType: 'OAuth 2.0',
      website: 'https://dropbox.com'
    },
    box: {
      name: 'Box',
      description: 'Enterprise cloud content management',
      icon: '🗃️',
      features: ['file_sharing', 'document_collaboration'],
      authType: 'OAuth 2.0',
      website: 'https://box.com'
    },
    onedrive: {
      name: 'OneDrive',
      description: 'Microsoft cloud storage service',
      icon: '☁️',
      features: ['file_sharing', 'document_collaboration'],
      authType: 'OAuth 2.0',
      website: 'https://onedrive.live.com'
    },
    zapier: {
      name: 'Zapier',
      description: 'Workflow automation platform',
      icon: '⚡',
      features: ['automation', 'task_management'],
      authType: 'API Key',
      website: 'https://zapier.com'
    },
    make: {
      name: 'Make',
      description: 'Visual platform for workflow automation',
      icon: '🔧',
      features: ['automation', 'task_management'],
      authType: 'API Key',
      website: 'https://make.com'
    },
    ifttt: {
      name: 'IFTTT',
      description: 'Simple automation for everyday tasks',
      icon: '🤖',
      features: ['automation'],
      authType: 'API Key',
      website: 'https://ifttt.com'
    },
    discord: {
      name: 'Discord',
      description: 'Voice, video and text communication',
      icon: '🎮',
      features: ['notifications', 'messaging'],
      authType: 'Bot Token',
      website: 'https://discord.com'
    },
    telegram: {
      name: 'Telegram',
      description: 'Cloud-based instant messaging',
      icon: '✈️',
      features: ['notifications', 'messaging'],
      authType: 'Bot Token',
      website: 'https://telegram.org'
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const integrationsData = await integrationService.getIntegrationsByCategory(userId, 'third_party');
      setIntegrations(integrationsData as ThirdPartyIntegration[]);
    } catch (err) {
      console.error('Error loading third-party integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntegration = async (integrationData: Omit<ThirdPartyIntegration, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newIntegration = await integrationService.createIntegration(userId, integrationData);
      setIntegrations([newIntegration as ThirdPartyIntegration, ...integrations]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating third-party integration:', err);
    }
  };

  const handleToggleIntegration = async (integrationId: string, isActive: boolean) => {
    try {
      const updatedIntegration = await integrationService.updateIntegration(integrationId, {
        status: isActive ? 'active' : 'inactive'
      });
      setIntegrations(integrations.map(i => 
        i.id === integrationId ? updatedIntegration as ThirdPartyIntegration : i
      ));
    } catch (err) {
      console.error('Error toggling integration:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Third-Party Integrations</h1>
            <p className="text-gray-600">
              Connect with external services to enhance your workflow and collaboration
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Integration
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Link className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.filter(i => i.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Connections</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.filter(i => i.features.includes('notifications')).length}
              </p>
              <p className="text-sm text-gray-600">Notification Channels</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.filter(i => i.features.includes('automation')).length}
              </p>
              <p className="text-sm text-gray-600">Automation Tools</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Folder className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.filter(i => i.features.includes('file_sharing')).length}
              </p>
              <p className="text-sm text-gray-600">Storage Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      {Object.entries(serviceCategories).map(([categoryKey, category]) => {
        const CategoryIcon = category.icon;
        const categoryIntegrations = integrations.filter(i => 
          category.services.includes(i.service)
        );

        return (
          <div key={categoryKey} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                <CategoryIcon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
              <span className="text-sm text-gray-500">
                ({categoryIntegrations.length} connected)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map(service => {
                const info = serviceInfo[service as keyof typeof serviceInfo];
                const integration = integrations.find(i => i.service === service);
                
                return (
                  <ServiceCard
                    key={service}
                    service={service as ThirdPartyService}
                    info={info}
                    integration={integration}
                    onConnect={() => {
                      setShowCreateModal(true);
                      // Could pre-select service in modal
                    }}
                    onConfigure={() => {
                      if (integration) {
                        setSelectedIntegration(integration);
                        setShowConfigModal(true);
                      }
                    }}
                    onToggle={(isActive) => {
                      if (integration) {
                        handleToggleIntegration(integration.id, isActive);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Create Integration Modal */}
      {showCreateModal && (
        <CreateIntegrationModal
          services={serviceInfo}
          connectedServices={integrations.map(i => i.service)}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateIntegration}
        />
      )}

      {/* Configure Integration Modal */}
      {showConfigModal && selectedIntegration && (
        <ConfigureIntegrationModal
          integration={selectedIntegration}
          serviceInfo={serviceInfo[selectedIntegration.service]}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedIntegration(null);
          }}
          onSave={(updatedIntegration) => {
            setIntegrations(integrations.map(i => 
              i.id === updatedIntegration.id ? updatedIntegration : i
            ));
            setShowConfigModal(false);
            setSelectedIntegration(null);
          }}
        />
      )}
    </div>
  );
};

// Service Card Component
const ServiceCard: React.FC<{
  service: ThirdPartyService;
  info: any;
  integration?: ThirdPartyIntegration;
  onConnect: () => void;
  onConfigure: () => void;
  onToggle: (isActive: boolean) => void;
}> = ({ info, integration, onConnect, onConfigure, onToggle }) => {
  const isConnected = !!integration;
  const isActive = integration?.status === 'active';

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 hover:shadow-md transition-all p-6 ${
      isConnected ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{info.icon}</span>
          <div>
            <h3 className="font-bold text-gray-900">{info.name}</h3>
            <p className="text-xs text-gray-500">{info.authType}</p>
          </div>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2">
            {isActive ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {info.description}
      </p>

      {/* Features */}
      <div className="flex flex-wrap gap-1 mb-4">
        {info.features.slice(0, 3).map((feature: string) => (
          <span
            key={feature}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
          >
            {feature.replace('_', ' ')}
          </span>
        ))}
        {info.features.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
            +{info.features.length - 3}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!isConnected ? (
          <button
            onClick={onConnect}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Connect
          </button>
        ) : (
          <>
            <button
              onClick={() => onToggle(!isActive)}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isActive ? 'Disable' : 'Enable'}
            </button>
            <button
              onClick={onConfigure}
              className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-3 w-3 inline mr-1" />
              Configure
            </button>
          </>
        )}
        
        <a
          href={info.website}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 border border-gray-300 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          title="Visit website"
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Connection Status */}
      {isConnected && integration && (
        <div className="mt-4 pt-4 border-t text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <span>Connected: {new Date(integration.createdAt).toLocaleDateString()}</span>
            <span>Last used: {integration.lastUsed ? new Date(integration.lastUsed).toLocaleDateString() : 'Never'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Create Integration Modal Component
const CreateIntegrationModal: React.FC<{
  services: any;
  connectedServices: ThirdPartyService[];
  onClose: () => void;
  onCreate: (integration: Omit<ThirdPartyIntegration, 'id' | 'createdAt' | 'updatedAt'>) => void;
}> = ({ services, connectedServices, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    service: 'slack' as ThirdPartyService,
    features: [] as ThirdPartyFeature[],
    permissions: [] as string[],
    configuration: {
      apiUrl: '',
      clientId: '',
      clientSecret: '',
      redirectUri: '',
      scopes: [] as string[],
      webhookUrl: '',
      customSettings: {} as Record<string, any>
    }
  });

  const availableFeatures: ThirdPartyFeature[] = [
    'notifications',
    'file_sharing',
    'automation',
    'messaging',
    'calendar',
    'task_management',
    'document_collaboration'
  ];

  const commonScopes = {
    slack: ['channels:read', 'chat:write', 'files:write', 'users:read'],
    microsoft_teams: ['Chat.ReadWrite', 'Files.ReadWrite', 'Calendars.ReadWrite'],
    google_workspace: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/drive'],
    dropbox: ['files.content.write', 'files.content.read', 'sharing.write'],
    box: ['root_readwrite', 'manage_webhook'],
    onedrive: ['Files.ReadWrite', 'Sites.ReadWrite.All'],
    zapier: [],
    make: [],
    ifttt: [],
    discord: [],
    telegram: []
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.features.length > 0) {
      onCreate({
        ...formData,
        category: 'third_party',
        status: 'pending',
        provider: formData.service,
        version: '1.0.0'
      } as any);
    }
  };

  const toggleFeature = (feature: ThirdPartyFeature) => {
    const exists = formData.features.includes(feature);
    if (exists) {
      setFormData({
        ...formData,
        features: formData.features.filter(f => f !== feature)
      });
    } else {
      setFormData({
        ...formData,
        features: [...formData.features, feature]
      });
    }
  };

  const toggleScope = (scope: string) => {
    const exists = formData.configuration.scopes.includes(scope);
    if (exists) {
      setFormData({
        ...formData,
        configuration: {
          ...formData.configuration,
          scopes: formData.configuration.scopes.filter(s => s !== scope)
        }
      });
    } else {
      setFormData({
        ...formData,
        configuration: {
          ...formData.configuration,
          scopes: [...formData.configuration.scopes, scope]
        }
      });
    }
  };

  const selectedService = services[formData.service];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Connect Third-Party Service</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Integration Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Team Slack Notifications"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      service: e.target.value as ThirdPartyService,
                      configuration: {
                        ...formData.configuration,
                        scopes: []
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    {Object.entries(services).map(([service, info]) => (
                      <option 
                        key={service} 
                        value={service}
                        disabled={connectedServices.includes(service as ThirdPartyService)}
                      >
                        {(info as any).name}
                        {connectedServices.includes(service as ThirdPartyService) ? ' (Connected)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe how you'll use this integration..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Features *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableFeatures.map(feature => (
                  <label key={feature} className="flex items-center p-3 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 capitalize">
                        {feature.replace('_', ' ')}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* OAuth Configuration */}
            {selectedService.authType === 'OAuth 2.0' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">OAuth Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client ID *
                    </label>
                    <input
                      type="text"
                      placeholder="Your app's client ID"
                      value={formData.configuration.clientId}
                      onChange={(e) => setFormData({
                        ...formData,
                        configuration: {
                          ...formData.configuration,
                          clientId: e.target.value
                        }
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Secret *
                    </label>
                    <input
                      type="password"
                      placeholder="Your app's client secret"
                      value={formData.configuration.clientSecret}
                      onChange={(e) => setFormData({
                        ...formData,
                        configuration: {
                          ...formData.configuration,
                          clientSecret: e.target.value
                        }
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Redirect URI
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-app.com/callback"
                    value={formData.configuration.redirectUri}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        redirectUri: e.target.value
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Scopes */}
                {commonScopes[formData.service].length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions (Scopes)
                    </label>
                    <div className="space-y-2">
                      {commonScopes[formData.service].map(scope => (
                        <label key={scope} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.configuration.scopes.includes(scope)}
                            onChange={() => toggleScope(scope)}
                            className="mr-2"
                          />
                          <span className="text-sm font-mono">{scope}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* API Key Configuration */}
            {(selectedService.authType === 'API Key' || selectedService.authType === 'Bot Token') && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{selectedService.authType} Configuration</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedService.authType} *
                  </label>
                  <input
                    type="password"
                    placeholder={`Enter your ${selectedService.authType.toLowerCase()}`}
                    value={formData.configuration.customSettings.apiKey || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        customSettings: {
                          ...formData.configuration.customSettings,
                          apiKey: e.target.value
                        }
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
            )}

            {/* Webhook Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Webhook Configuration (Optional)</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-app.com/webhooks"
                  value={formData.configuration.webhookUrl}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuration: {
                      ...formData.configuration,
                      webhookUrl: e.target.value
                    }
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Connect Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Configure Integration Modal Component
const ConfigureIntegrationModal: React.FC<{
  integration: ThirdPartyIntegration;
  serviceInfo: any;
  onClose: () => void;
  onSave: (integration: ThirdPartyIntegration) => void;
}> = ({ integration, serviceInfo, onClose, onSave }) => {
  const [settings, setSettings] = useState(integration.configuration.customSettings);

  const handleSave = () => {
    const updatedIntegration = {
      ...integration,
      configuration: {
        ...integration.configuration,
        customSettings: settings
      }
    };
    onSave(updatedIntegration);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Configure {serviceInfo.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Basic Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Service:</span>
                  <p className="font-medium">{serviceInfo.name}</p>
                </div>
                
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p className={`font-medium ${
                    integration.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {integration.status}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium">
                    {new Date(integration.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {integration.lastUsed && (
                  <div>
                    <span className="text-gray-500">Last Used:</span>
                    <p className="font-medium">
                      {new Date(integration.lastUsed).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Enabled Features</h3>
              <div className="flex flex-wrap gap-2">
                {integration.features.map(feature => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {feature.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Permissions</h3>
              <div className="space-y-2">
                {integration.permissions.map(permission => (
                  <div key={permission} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-mono">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Custom Settings</h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <span>Enable notifications</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoSync || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      autoSync: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <span>Auto-sync data</span>
                </label>

                {integration.features.includes('file_sharing') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Folder
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., /InnoSpot Patents"
                      value={settings.defaultFolder || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        defaultFolder: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Usage Analytics Placeholder */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Usage Analytics</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Usage analytics would be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Including API calls, data transfers, and feature usage
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdPartyIntegrations;
