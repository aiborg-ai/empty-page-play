/**
 * Enterprise Connectors Component
 * Manages connections to enterprise systems including SAP, Oracle, 
 * Microsoft Dynamics, Salesforce, and generic REST/SOAP APIs
 */

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Settings,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  Cloud,
  Server,
  Shield,
  Link,
  Clock,
  Zap
} from 'lucide-react';
import { integrationService } from '@/lib/integrationService';
import type { 
  EnterpriseConnector, 
  EnterpriseSystem, 
  SyncStatus,
  FieldMapping,
  EnterpriseConfig 
} from '@/types/integrations';

interface EnterpriseConnectorsProps {
  userId: string;
}

export const EnterpriseConnectors: React.FC<EnterpriseConnectorsProps> = ({ userId }) => {
  const [connectors, setConnectors] = useState<EnterpriseConnector[]>([]);
  const [selectedConnector, setSelectedConnector] = useState<EnterpriseConnector | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const systemIcons = {
    sap: Database,
    oracle: Server,
    microsoft_dynamics: Cloud,
    salesforce: Zap,
    rest_api: Link,
    soap_api: Shield
  };

  const systemColors = {
    sap: 'text-blue-600 bg-blue-100',
    oracle: 'text-red-600 bg-red-100',
    microsoft_dynamics: 'text-green-600 bg-green-100',
    salesforce: 'text-indigo-600 bg-indigo-100',
    rest_api: 'text-purple-600 bg-purple-100',
    soap_api: 'text-orange-600 bg-orange-100'
  };

  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    try {
      setLoading(true);
      const connectorsData = await integrationService.getIntegrationsByCategory(userId, 'enterprise');
      setConnectors(connectorsData as EnterpriseConnector[]);
    } catch (err) {
      console.error('Error loading connectors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConnector = async (connectorData: Omit<EnterpriseConnector, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newConnector = await integrationService.createEnterpriseConnector(userId, connectorData);
      setConnectors([newConnector, ...connectors]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating connector:', err);
    }
  };

  const handleTestConnection = async (connectorId: string) => {
    try {
      const success = await integrationService.testEnterpriseConnection(connectorId);
      // Update connector status based on test result
      setConnectors(connectors.map(connector => 
        connector.id === connectorId 
          ? { ...connector, status: success ? 'active' : 'error' }
          : connector
      ));
    } catch (err) {
      console.error('Error testing connection:', err);
    }
  };

  const getSyncStatusColor = (status: SyncStatus) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSyncStatusIcon = (status: SyncStatus) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'running': return RefreshCw;
      case 'failed': return XCircle;
      case 'paused': return Pause;
      default: return Clock;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Connectors</h1>
            <p className="text-gray-600">
              Connect to your enterprise systems for seamless data integration
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Connector
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {connectors.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Connections</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {connectors.filter(c => c.syncStatus === 'running').length}
              </p>
              <p className="text-sm text-gray-600">Syncing Now</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {connectors.filter(c => c.lastSync && 
                  new Date(c.lastSync) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                ).length}
              </p>
              <p className="text-sm text-gray-600">Synced Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {connectors.filter(c => c.status === 'error').length}
              </p>
              <p className="text-sm text-gray-600">Need Attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Systems */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Enterprise Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(systemIcons).map(([system, Icon]) => {
            const connectedCount = connectors.filter(c => c.connectorType === system).length;
            return (
              <div
                key={system}
                className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setShowCreateModal(true);
                  // Could pre-select the system type in the modal
                }}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${systemColors[system as keyof typeof systemColors]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-gray-900 capitalize">
                  {system.replace('_', ' ')}
                </h3>
                <p className="text-xs text-gray-500">
                  {connectedCount} connected
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connectors List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your Connectors</h2>
        </div>

        <div className="divide-y">
          {connectors.map((connector) => {
            const Icon = systemIcons[connector.connectorType];
            const StatusIcon = getSyncStatusIcon(connector.syncStatus);
            
            return (
              <ConnectorCard
                key={connector.id}
                connector={connector}
                icon={Icon}
                statusIcon={StatusIcon}
                systemColor={systemColors[connector.connectorType]}
                syncStatusColor={getSyncStatusColor(connector.syncStatus)}
                onTest={() => handleTestConnection(connector.id)}
                onConfigure={() => {
                  setSelectedConnector(connector);
                  setShowConfigModal(true);
                }}
                onSync={() => {
                  // Implement sync logic
                  console.log('Sync connector:', connector.id);
                }}
              />
            );
          })}
        </div>

        {connectors.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No enterprise connectors configured</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Connector
            </button>
          </div>
        )}
      </div>

      {/* Create Connector Modal */}
      {showCreateModal && (
        <CreateConnectorModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateConnector}
        />
      )}

      {/* Configure Connector Modal */}
      {showConfigModal && selectedConnector && (
        <ConfigureConnectorModal
          connector={selectedConnector}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedConnector(null);
          }}
          onSave={(updatedConnector) => {
            setConnectors(connectors.map(c => 
              c.id === updatedConnector.id ? updatedConnector : c
            ));
            setShowConfigModal(false);
            setSelectedConnector(null);
          }}
        />
      )}
    </div>
  );
};

// Connector Card Component
const ConnectorCard: React.FC<{
  connector: EnterpriseConnector;
  icon: React.ComponentType<any>;
  statusIcon: React.ComponentType<any>;
  systemColor: string;
  syncStatusColor: string;
  onTest: () => void;
  onConfigure: () => void;
  onSync: () => void;
}> = ({ connector, icon: Icon, statusIcon: StatusIcon, systemColor, syncStatusColor, onTest, onConfigure, onSync }) => {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${systemColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {connector.name}
              </h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${syncStatusColor}`}>
                <StatusIcon className="h-3 w-3 inline mr-1" />
                {connector.syncStatus}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{connector.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">System:</span>
                <p className="font-medium capitalize">
                  {connector.connectorType.replace('_', ' ')}
                </p>
              </div>
              
              <div>
                <span className="text-gray-500">Host:</span>
                <p className="font-medium">{connector.configuration.host}</p>
              </div>
              
              {connector.lastSync && (
                <div>
                  <span className="text-gray-500">Last Sync:</span>
                  <p className="font-medium">
                    {new Date(connector.lastSync).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div>
                <span className="text-gray-500">Sync Direction:</span>
                <p className="font-medium capitalize">
                  {connector.syncSettings.direction}
                </p>
              </div>

              <div>
                <span className="text-gray-500">Frequency:</span>
                <p className="font-medium capitalize">
                  {connector.syncSettings.frequency}
                </p>
              </div>

              <div>
                <span className="text-gray-500">Field Mappings:</span>
                <p className="font-medium">
                  {connector.mappings.length} configured
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onTest}
            className="p-2 text-blue-600 hover:text-blue-800 rounded"
            title="Test connection"
          >
            <Play className="h-4 w-4" />
          </button>
          
          <button
            onClick={onSync}
            className="p-2 text-green-600 hover:text-green-800 rounded"
            title="Sync now"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={onConfigure}
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
            title="Configure"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Connector Modal Component
const CreateConnectorModal: React.FC<{
  onClose: () => void;
  onCreate: (connector: Omit<EnterpriseConnector, 'id' | 'createdAt' | 'updatedAt'>) => void;
}> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    connectorType: 'rest_api' as EnterpriseSystem,
    configuration: {
      host: '',
      port: 443,
      protocol: 'https' as const,
      basePath: '',
      authentication: {
        type: 'basic' as const,
        username: '',
        password: '',
        clientId: '',
        clientSecret: '',
        tokenUrl: '',
        scope: [] as string[],
        apiKey: '',
        certificatePath: ''
      },
      timeout: 30000,
      ssl: {
        enabled: true,
        verifyCertificate: true,
        certificatePath: '',
        keyPath: ''
      }
    } as EnterpriseConfig,
    mappings: [] as FieldMapping[],
    syncSettings: {
      enabled: true,
      frequency: 'daily' as const,
      direction: 'import' as const,
      batchSize: 100,
      errorHandling: 'continue' as const
    },
    syncStatus: 'idle' as SyncStatus
  });

  const systemOptions = [
    { value: 'sap', label: 'SAP' },
    { value: 'oracle', label: 'Oracle' },
    { value: 'microsoft_dynamics', label: 'Microsoft Dynamics' },
    { value: 'salesforce', label: 'Salesforce' },
    { value: 'rest_api', label: 'REST API' },
    { value: 'soap_api', label: 'SOAP API' }
  ];

  const authOptions = [
    { value: 'basic', label: 'Basic Authentication' },
    { value: 'oauth2', label: 'OAuth 2.0' },
    { value: 'saml', label: 'SAML' },
    { value: 'api_key', label: 'API Key' },
    { value: 'certificate', label: 'Certificate' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.configuration.host) {
      onCreate({
        ...formData,
        category: 'enterprise',
        status: 'pending',
        provider: formData.connectorType,
        version: '1.0.0'
      } as any);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Create Enterprise Connector</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Connector Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Production SAP System"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    System Type *
                  </label>
                  <select
                    value={formData.connectorType}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      connectorType: e.target.value as EnterpriseSystem 
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    {systemOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
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
                  placeholder="Describe this connector..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                />
              </div>
            </div>

            {/* Connection Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connection Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Host *
                  </label>
                  <input
                    type="text"
                    placeholder="server.company.com"
                    value={formData.configuration.host}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        host: e.target.value
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={formData.configuration.port}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        port: parseInt(e.target.value)
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protocol
                  </label>
                  <select
                    value={formData.configuration.protocol}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        protocol: e.target.value as 'http' | 'https'
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="https">HTTPS</option>
                    <option value="http">HTTP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Path
                </label>
                <input
                  type="text"
                  placeholder="/api/v1"
                  value={formData.configuration.basePath}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuration: {
                      ...formData.configuration,
                      basePath: e.target.value
                    }
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Authentication */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Authentication</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Authentication Type
                </label>
                <select
                  value={formData.configuration.authentication.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuration: {
                      ...formData.configuration,
                      authentication: {
                        ...formData.configuration.authentication,
                        type: e.target.value as any
                      }
                    }
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {authOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic auth fields based on type */}
              {formData.configuration.authentication.type === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.configuration.authentication.username}
                      onChange={(e) => setFormData({
                        ...formData,
                        configuration: {
                          ...formData.configuration,
                          authentication: {
                            ...formData.configuration.authentication,
                            username: e.target.value
                          }
                        }
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.configuration.authentication.password}
                      onChange={(e) => setFormData({
                        ...formData,
                        configuration: {
                          ...formData.configuration,
                          authentication: {
                            ...formData.configuration.authentication,
                            password: e.target.value
                          }
                        }
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {formData.configuration.authentication.type === 'oauth2' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={formData.configuration.authentication.clientId}
                      onChange={(e) => setFormData({
                        ...formData,
                        configuration: {
                          ...formData.configuration,
                          authentication: {
                            ...formData.configuration.authentication,
                            clientId: e.target.value
                          }
                        }
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Secret
                    </label>
                    <input
                      type="password"
                      value={formData.configuration.authentication.clientSecret}
                      onChange={(e) => setFormData({
                        ...formData,
                        configuration: {
                          ...formData.configuration,
                          authentication: {
                            ...formData.configuration.authentication,
                            clientSecret: e.target.value
                          }
                        }
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Token URL
                    </label>
                    <input
                      type="url"
                      value={formData.configuration.authentication.tokenUrl}
                      onChange={(e) => setFormData({
                        ...formData,
                        configuration: {
                          ...formData.configuration,
                          authentication: {
                            ...formData.configuration.authentication,
                            tokenUrl: e.target.value
                          }
                        }
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {formData.configuration.authentication.type === 'api_key' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={formData.configuration.authentication.apiKey}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        authentication: {
                          ...formData.configuration.authentication,
                          apiKey: e.target.value
                        }
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              )}
            </div>

            {/* Sync Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sync Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.syncSettings.frequency}
                    onChange={(e) => setFormData({
                      ...formData,
                      syncSettings: {
                        ...formData.syncSettings,
                        frequency: e.target.value as any
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Direction
                  </label>
                  <select
                    value={formData.syncSettings.direction}
                    onChange={(e) => setFormData({
                      ...formData,
                      syncSettings: {
                        ...formData.syncSettings,
                        direction: e.target.value as any
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="import">Import Only</option>
                    <option value="export">Export Only</option>
                    <option value="bidirectional">Bidirectional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.syncSettings.batchSize}
                    onChange={(e) => setFormData({
                      ...formData,
                      syncSettings: {
                        ...formData.syncSettings,
                        batchSize: parseInt(e.target.value)
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
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
              Create Connector
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Configure Connector Modal Component
const ConfigureConnectorModal: React.FC<{
  connector: EnterpriseConnector;
  onClose: () => void;
  onSave: (connector: EnterpriseConnector) => void;
}> = ({ connector, onClose, onSave }) => {
  const [mappings, setMappings] = useState<FieldMapping[]>(connector.mappings);
  const [newMapping, setNewMapping] = useState<Partial<FieldMapping>>({
    sourceField: '',
    targetField: '',
    transformation: '',
    required: false,
    dataType: 'string'
  });

  const addMapping = () => {
    if (newMapping.sourceField && newMapping.targetField) {
      setMappings([...mappings, newMapping as FieldMapping]);
      setNewMapping({
        sourceField: '',
        targetField: '',
        transformation: '',
        required: false,
        dataType: 'string'
      });
    }
  };

  const removeMapping = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedConnector = {
      ...connector,
      mappings
    };
    onSave(updatedConnector);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Configure Field Mappings: {connector.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Current Mappings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Current Field Mappings</h3>
              
              {mappings.length > 0 ? (
                <div className="space-y-3">
                  {mappings.map((mapping, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded">
                      <div className="flex-1 grid grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Source:</span>
                          <p className="font-medium">{mapping.sourceField}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Target:</span>
                          <p className="font-medium">{mapping.targetField}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">{mapping.dataType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Required:</span>
                          <p className="font-medium">{mapping.required ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Transform:</span>
                          <p className="font-medium text-xs">
                            {mapping.transformation || 'None'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeMapping(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No field mappings configured yet
                </p>
              )}
            </div>

            {/* Add New Mapping */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Add New Mapping</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Source Field
                  </label>
                  <input
                    type="text"
                    placeholder="source_field"
                    value={newMapping.sourceField}
                    onChange={(e) => setNewMapping({
                      ...newMapping,
                      sourceField: e.target.value
                    })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Target Field
                  </label>
                  <input
                    type="text"
                    placeholder="target_field"
                    value={newMapping.targetField}
                    onChange={(e) => setNewMapping({
                      ...newMapping,
                      targetField: e.target.value
                    })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Data Type
                  </label>
                  <select
                    value={newMapping.dataType}
                    onChange={(e) => setNewMapping({
                      ...newMapping,
                      dataType: e.target.value as any
                    })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                    <option value="object">Object</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Transform
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., uppercase"
                    value={newMapping.transformation}
                    onChange={(e) => setNewMapping({
                      ...newMapping,
                      transformation: e.target.value
                    })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={newMapping.required}
                      onChange={(e) => setNewMapping({
                        ...newMapping,
                        required: e.target.checked
                      })}
                      className="mr-1"
                    />
                    Required
                  </label>
                </div>
              </div>

              <button
                onClick={addMapping}
                disabled={!newMapping.sourceField || !newMapping.targetField}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Mapping
              </button>
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
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};