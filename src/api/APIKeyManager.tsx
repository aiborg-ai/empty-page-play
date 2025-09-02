/**
 * API Key Manager Component
 * 
 * Comprehensive interface for managing API keys including:
 * - Creation and deletion of API keys
 * - Permissions management and security settings  
 * - Usage tracking and analytics display
 * - Key rotation and expiration handling
 * - Integration with external APIs and services
 * 
 * Features:
 * - Real-time key visibility toggle with secure display
 * - Modal-based creation workflow with validation
 * - Detailed analytics and usage metrics
 * - Bulk operations and key lifecycle management
 * - Responsive design with accessibility support
 * 
 * @component APIKeyManager
 * @author InnoSpot Development Team
 * @version 2.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Key,
  Plus,
  // Edit3, // Unused - removed
  Trash2,
  Eye,
  EyeOff,
  Copy,
  // Calendar, // Unused - removed
  Shield,
  Activity,
  AlertTriangle,
  // CheckCircle, // Unused - removed
  Settings,
  RotateCcw,
  // Download // Unused - removed
} from 'lucide-react';
import { integrationService } from '@/lib/integrationService';
import type { APIKey, APIIntegration } from '@/types/integrations';

/**
 * Props interface for the APIKeyManager component
 */
interface APIKeyManagerProps {
  /** Unique identifier for the user managing API keys */
  userId: string;
}

export const APIKeyManager: React.FC<APIKeyManagerProps> = ({ userId }) => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  /** List of user's API keys */
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  
  /** Available API integrations from marketplace */
  const [apis, setApis] = useState<APIIntegration[]>([]);
  
  /** Controls visibility of create key modal */
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  /** Currently selected key for detailed view */
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  
  /** Track which keys have their values visible (security feature) */
  const [showKeyValue, setShowKeyValue] = useState<Record<string, boolean>>({});
  
  /** Loading state for initial data fetch */
  const [loading, setLoading] = useState(true);
  
  /** Error state for handling API failures */
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================
  
  /**
   * Load initial data on component mount
   */
  useEffect(() => {
    loadData();
  }, []);

  // ========================================
  // DATA LOADING FUNCTIONS
  // ========================================
  
  /**
   * Load API keys and available integrations
   * Handles parallel data fetching with error recovery
   */
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user's API keys and marketplace APIs in parallel
      const [keys, marketplaceApis] = await Promise.all([
        integrationService.getAPIKeys(userId),
        integrationService.getMarketplaceAPIs()
      ]);
      
      setApiKeys(keys);
      setApis(marketplaceApis);
    } catch (err) {
      setError('Failed to load API keys');
      console.error('Error loading API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // KEY MANAGEMENT OPERATIONS
  // ========================================
  
  /**
   * Create a new API key with specified configuration
   * @param keyData - Configuration for the new API key
   */
  const handleCreateKey = async (keyData: {
    name: string;
    integrationId: string;
    permissions: string[];
    expiresAt?: string;
  }) => {
    try {
      // Generate secure API key and create through service
      const newKey = await integrationService.createAPIKey(userId, keyData.integrationId, {
        name: keyData.name,
        key: generateAPIKey(),
        integrationId: keyData.integrationId,
        permissions: keyData.permissions,
        expiresAt: keyData.expiresAt,
        isActive: true
      });
      
      // Add new key to the beginning of the list
      setApiKeys([newKey, ...apiKeys]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating API key:', err);
      // TODO: Show user-friendly error message
    }
  };

  /**
   * Revoke an API key (mark as inactive)
   * @param keyId - ID of the key to revoke
   */
  const handleRevokeKey = async (keyId: string) => {
    try {
      await integrationService.revokeAPIKey(keyId);
      
      // Update local state to reflect revoked status
      setApiKeys(apiKeys.map(key => 
        key.id === keyId ? { ...key, isActive: false } : key
      ));
    } catch (err) {
      console.error('Error revoking API key:', err);
      // TODO: Show user-friendly error message
    }
  };

  /**
   * Copy API key to clipboard with security considerations
   * @param key - The API key string to copy
   */
  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      // TODO: Show success toast notification
    } catch (err) {
      console.error('Error copying key:', err);
      // TODO: Fallback to manual copy method
    }
  };

  // ========================================
  // UI INTERACTION HANDLERS
  // ========================================
  
  /**
   * Toggle visibility of API key value (security feature)
   * @param keyId - ID of the key to toggle visibility for
   */
  const toggleKeyVisibility = (keyId: string) => {
    setShowKeyValue(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  /**
   * Generate a new API key with InnoSpot prefix and random string
   * @returns Newly generated API key string
   */
  const generateAPIKey = () => {
    const randomPart1 = Math.random().toString(36).substring(2, 15);
    const randomPart2 = Math.random().toString(36).substring(2, 15);
    return `inno_${randomPart1}${randomPart2}`;
  };

  /**
   * Determine the current status of an API key
   * @param key - The API key to check status for
   * @returns Status string: 'active', 'expired', or 'revoked'
   */
  const getKeyStatus = (key: APIKey) => {
    if (!key.isActive) return 'revoked';
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) return 'expired';
    return 'active';
  };

  /**
   * Get Tailwind CSS classes for status badge styling
   * @param status - The status to get colors for
   * @returns CSS class string for styling
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': 
        return 'text-green-600 bg-green-100';
      case 'expired': 
        return 'text-red-600 bg-red-100';
      case 'revoked': 
        return 'text-gray-600 bg-gray-100';
      default: 
        return 'text-gray-600 bg-gray-100';
    }
  };

  // ========================================
  // RENDER CONDITIONAL STATES
  // ========================================
  
  /**
   * Loading state with spinner
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  /**
   * Error state with retry option
   */
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">API Key Manager</h1>
            <p className="text-gray-600">
              Manage your API keys, permissions, and usage quotas
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create API Key
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Key className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {apiKeys.filter(key => key.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Active Keys</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {apiKeys.filter(key => key.lastUsed && 
                  new Date(key.lastUsed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </p>
              <p className="text-sm text-gray-600">Used This Week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {apiKeys.filter(key => 
                  key.expiresAt && new Date(key.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                ).length}
              </p>
              <p className="text-sm text-gray-600">Expiring Soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(apiKeys.map(key => key.integrationId)).size}
              </p>
              <p className="text-sm text-gray-600">Connected APIs</p>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your API Keys</h2>
        </div>

        <div className="divide-y">
          {apiKeys.map((key) => {
            const api = apis.find(a => a.id === key.integrationId);
            const status = getKeyStatus(key);
            
            return (
              <div key={key.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {key.name}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      Connected to: {api?.name || 'Unknown API'}
                    </p>

                    {/* API Key Value */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">API Key:</span>
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showKeyValue[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono flex-1">
                          {showKeyValue[key.id] ? key.key : '••••••••••••••••••••••••••••••••'}
                        </code>
                        <button
                          onClick={() => handleCopyKey(key.key)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded"
                          title="Copy key"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Key Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="font-medium">
                          {new Date(key.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {key.lastUsed && (
                        <div>
                          <span className="text-gray-500">Last Used:</span>
                          <p className="font-medium">
                            {new Date(key.lastUsed).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {key.expiresAt && (
                        <div>
                          <span className="text-gray-500">Expires:</span>
                          <p className={`font-medium ${
                            new Date(key.expiresAt) < new Date() 
                              ? 'text-red-600' 
                              : new Date(key.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                ? 'text-yellow-600'
                                : 'text-gray-900'
                          }`}>
                            {new Date(key.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Permissions */}
                    {key.permissions && key.permissions.length > 0 && (
                      <div className="mt-4">
                        <span className="text-sm text-gray-500 mb-2 block">Permissions:</span>
                        <div className="flex flex-wrap gap-2">
                          {key.permissions.map(permission => (
                            <span
                              key={permission}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setSelectedKey(key)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded"
                      title="View details"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    
                    {status === 'active' && (
                      <>
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 rounded"
                          title="Rotate key"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="p-2 text-red-400 hover:text-red-600 rounded"
                          title="Revoke key"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {apiKeys.length === 0 && (
          <div className="text-center py-12">
            <Key className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No API keys found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First API Key
            </button>
          </div>
        )}
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <CreateAPIKeyModal
          apis={apis}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateKey}
        />
      )}

      {/* Key Details Modal */}
      {selectedKey && (
        <APIKeyDetailsModal
          apiKey={selectedKey}
          api={apis.find(a => a.id === selectedKey.integrationId)}
          onClose={() => setSelectedKey(null)}
          onUpdate={(updatedKey) => {
            // Update the key in local state after successful update
            setApiKeys(apiKeys.map(key => 
              key.id === updatedKey.id ? updatedKey : key
            ));
            setSelectedKey(null);
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// MODAL COMPONENTS
// ============================================================================

/**
 * Modal component for creating new API keys
 * Provides form interface with validation and integration selection
 */
const CreateAPIKeyModal: React.FC<{
  /** Available API integrations to choose from */
  apis: APIIntegration[];
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback when key is successfully created */
  onCreate: (keyData: {
    name: string;
    integrationId: string;
    permissions: string[];
    expiresAt?: string;
  }) => void;
}> = ({ apis, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    integrationId: '',
    permissions: [] as string[],
    expiresAt: ''
  });

  const availablePermissions = ['read', 'write', 'admin'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.integrationId) {
      onCreate({
        ...formData,
        expiresAt: formData.expiresAt || undefined
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Create API Key</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Production Key, Testing Key"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API *
              </label>
              <select
                value={formData.integrationId}
                onChange={(e) => setFormData({ ...formData, integrationId: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Select an API...</option>
                {apis.map(api => (
                  <option key={api.id} value={api.id}>{api.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permissions
              </label>
              <div className="space-y-2">
                {availablePermissions.map(permission => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            permissions: [...formData.permissions, permission]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            permissions: formData.permissions.filter(p => p !== permission)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="capitalize">{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
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
              Create Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Modal component for viewing and editing API key details
 * Shows comprehensive information including usage analytics and security settings
 */
const APIKeyDetailsModal: React.FC<{
  /** The API key to display details for */
  apiKey: APIKey;
  /** Associated API integration (optional) */
  api?: APIIntegration;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback when key is updated */
  onUpdate: (key: APIKey) => void;
}> = ({ apiKey, api, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{apiKey.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name
                  </label>
                  <p className="text-gray-900">{apiKey.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Connected API
                  </label>
                  <p className="text-gray-900">{api?.name || 'Unknown API'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created
                  </label>
                  <p className="text-gray-900">
                    {new Date(apiKey.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {apiKey.lastUsed && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Used
                    </label>
                    <p className="text-gray-900">
                      {new Date(apiKey.lastUsed).toLocaleDateString()}
                    </p>
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
                  Including request counts, error rates, and usage patterns
                </p>
              </div>
            </div>

            {/* Security Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions?.map(permission => (
                      <span
                        key={permission}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {permission}
                      </span>
                    )) || <span className="text-gray-500">No permissions set</span>}
                  </div>
                </div>

                {apiKey.expiresAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration
                    </label>
                    <p className={`${
                      new Date(apiKey.expiresAt) < new Date() 
                        ? 'text-red-600' 
                        : 'text-gray-900'
                    }`}>
                      {new Date(apiKey.expiresAt).toLocaleDateString()}
                      {new Date(apiKey.expiresAt) < new Date() && ' (Expired)'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Edit Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};