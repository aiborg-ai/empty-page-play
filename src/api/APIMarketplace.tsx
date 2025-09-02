/**
 * API Marketplace Component
 * Provides a comprehensive interface for browsing, connecting to, and managing APIs
 * Includes API documentation, key management, usage analytics, and rate limiting
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  BarChart3,
  Book,
  Plus,
  Filter,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { integrationService } from '@/lib/integrationService';
import type { APIIntegration, APIKey } from '@/types/integrations';

interface APIMarketplaceProps {
  userId: string;
}

export const APIMarketplace: React.FC<APIMarketplaceProps> = ({ userId }) => {
  const [apis, setApis] = useState<APIIntegration[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedApi, setSelectedApi] = useState<APIIntegration | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'All APIs', icon: Globe },
    { value: 'patent', label: 'Patent Data', icon: Shield },
    { value: 'ai', label: 'AI Services', icon: Zap },
    { value: 'analytics', label: 'Analytics', icon: TrendingUp },
    { value: 'search', label: 'Search', icon: Search }
  ];

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      const [marketplaceApis, userApiKeys] = await Promise.all([
        integrationService.getMarketplaceAPIs(),
        integrationService.getAPIKeys(userId)
      ]);
      
      setApis(marketplaceApis);
      setApiKeys(userApiKeys);
    } catch (err) {
      setError('Failed to load marketplace data');
      console.error('Error loading marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const results = query 
        ? await integrationService.searchMarketplaceAPIs(query)
        : await integrationService.getMarketplaceAPIs();
      setApis(results);
    } catch (err) {
      console.error('Error searching APIs:', err);
    }
  };

  const handleCreateApiKey = async (apiId: string, keyName: string) => {
    try {
      const newKey = await integrationService.createAPIKey(userId, apiId, {
        name: keyName,
        key: generateAPIKey(),
        integrationId: apiId,
        permissions: ['read', 'write'],
        isActive: true
      });
      
      setApiKeys([newKey, ...apiKeys]);
      setShowKeyModal(false);
    } catch (err) {
      console.error('Error creating API key:', err);
    }
  };

  const generateAPIKey = () => {
    return 'inno_' + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           api.name.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Marketplace</h1>
        <p className="text-gray-600">
          Discover and integrate powerful APIs to extend your InnoSpot platform
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search APIs by name or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setShowKeyModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create API Key
            </button>
          </div>
        </div>
      </div>

      {/* API Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredApis.map((api) => (
          <APICard
            key={api.id}
            api={api}
            hasApiKey={apiKeys.some(key => key.integrationId === api.id)}
            onSelect={() => setSelectedApi(api)}
            onViewAnalytics={() => {
              setSelectedApi(api);
              setShowAnalytics(true);
            }}
          />
        ))}
      </div>

      {filteredApis.length === 0 && (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No APIs found matching your criteria</p>
        </div>
      )}

      {/* API Detail Modal */}
      {selectedApi && !showAnalytics && (
        <APIDetailModal
          api={selectedApi}
          onClose={() => setSelectedApi(null)}
          onCreateKey={(keyName) => handleCreateApiKey(selectedApi.id, keyName)}
        />
      )}

      {/* Analytics Modal */}
      {selectedApi && showAnalytics && (
        <APIAnalyticsModal
          api={selectedApi}
          onClose={() => {
            setSelectedApi(null);
            setShowAnalytics(false);
          }}
        />
      )}

      {/* Create API Key Modal */}
      {showKeyModal && (
        <CreateAPIKeyModal
          apis={apis}
          onClose={() => setShowKeyModal(false)}
          onCreate={(apiId, keyName) => handleCreateApiKey(apiId, keyName)}
        />
      )}
    </div>
  );
};

// API Card Component
const APICard: React.FC<{
  api: APIIntegration;
  hasApiKey: boolean;
  onSelect: () => void;
  onViewAnalytics: () => void;
}> = ({ api, hasApiKey, onSelect, onViewAnalytics }) => {
  const getPricingColor = (model: string) => {
    switch (model) {
      case 'free': return 'text-green-600 bg-green-100';
      case 'freemium': return 'text-blue-600 bg-blue-100';
      case 'paid': return 'text-orange-600 bg-orange-100';
      case 'enterprise': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {api.iconUrl ? (
            <img src={api.iconUrl} alt={api.name} className="w-8 h-8 rounded" />
          ) : (
            <Globe className="h-8 w-8 text-gray-400" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{api.name}</h3>
            <p className="text-sm text-gray-500">v{api.version}</p>
          </div>
        </div>
        {hasApiKey && (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {api.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getPricingColor(api.pricing.model)}`}>
          {api.pricing.model.charAt(0).toUpperCase() + api.pricing.model.slice(1)}
        </span>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {api.analytics.averageResponseTime}ms
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {api.analytics.uptimePercentage}%
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSelect}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
        >
          <Book className="h-3 w-3" />
          View Details
        </button>
        {hasApiKey && (
          <button
            onClick={onViewAnalytics}
            className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};

// API Detail Modal Component
const APIDetailModal: React.FC<{
  api: APIIntegration;
  onClose: () => void;
  onCreateKey: (keyName: string) => void;
}> = ({ api, onClose, onCreateKey }) => {
  const [keyName, setKeyName] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{api.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* API Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">API Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-600">{api.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endpoint
                  </label>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {api.endpoint}
                  </code>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Methods
                  </label>
                  <div className="flex gap-2">
                    {api.methods.map(method => (
                      <span
                        key={method}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate Limits
                  </label>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{api.rateLimit.requestsPerMinute}/min</div>
                    <div>{api.rateLimit.requestsPerHour}/hour</div>
                    <div>{api.rateLimit.requestsPerDay}/day</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Authentication */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Pricing & Access</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pricing Model
                  </label>
                  <p className="text-gray-600 capitalize">{api.pricing.model}</p>
                  {api.pricing.pricePerRequest && (
                    <p className="text-sm text-gray-500">
                      ${api.pricing.pricePerRequest} per request
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authentication
                  </label>
                  <p className="text-gray-600 capitalize">
                    {api.authentication.replace('_', ' ')}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Create API Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Key name"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => {
                        if (keyName.trim()) {
                          onCreateKey(keyName.trim());
                          setKeyName('');
                        }
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {api.documentationUrl && (
                    <a
                      href={api.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Documentation
                    </a>
                  )}
                  {api.supportUrl && (
                    <a
                      href={api.supportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Support
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          {api.examples.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Code Examples</h3>
              <div className="space-y-4">
                {api.examples.map((example, index) => (
                  <div key={index} className="border rounded-lg">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h4 className="font-medium">{example.title}</h4>
                      <p className="text-sm text-gray-600">{example.description}</p>
                    </div>
                    <div className="p-4">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`curl -X ${example.method} "${example.endpoint}" \\
${Object.entries(example.headers || {}).map(([key, value]) => 
  `  -H "${key}: ${value}"`).join(' \\\n')}${example.body ? ' \\\n  -d \'' + JSON.stringify(example.body, null, 2) + '\'' : ''}`}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Analytics Modal Component
const APIAnalyticsModal: React.FC<{
  api: APIIntegration;
  onClose: () => void;
}> = ({ api, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{api.name} Analytics</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Requests</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {api.analytics.totalRequests.toLocaleString()}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Success Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {Math.round((api.analytics.successfulRequests / api.analytics.totalRequests) * 100)}%
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Avg Response</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">
                {api.analytics.averageResponseTime}ms
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Uptime</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {api.analytics.uptimePercentage}%
              </p>
            </div>
          </div>

          {/* Usage Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Usage analytics chart would be displayed here</p>
            <p className="text-sm text-gray-500 mt-2">
              Integration with charting library required for full implementation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create API Key Modal Component
const CreateAPIKeyModal: React.FC<{
  apis: APIIntegration[];
  onClose: () => void;
  onCreate: (apiId: string, keyName: string) => void;
}> = ({ apis, onClose, onCreate }) => {
  const [selectedApiId, setSelectedApiId] = useState('');
  const [keyName, setKeyName] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Create API Key</h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select API
              </label>
              <select
                value={selectedApiId}
                onChange={(e) => setSelectedApiId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Choose an API...</option>
                {apis.map(api => (
                  <option key={api.id} value={api.id}>{api.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Name
              </label>
              <input
                type="text"
                placeholder="Enter a name for this key"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedApiId && keyName.trim()) {
                  onCreate(selectedApiId, keyName.trim());
                }
              }}
              disabled={!selectedApiId || !keyName.trim()}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};