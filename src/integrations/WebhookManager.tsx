/**
 * Webhook Manager Component
 * Comprehensive webhook management interface with configuration, testing,
 * logging, retry mechanisms, and security features
 */

import React, { useState, useEffect } from 'react';
import {
  Webhook,
  Plus,
  Play,
  Pause,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Activity,
  Edit3
} from 'lucide-react';
import { integrationService } from '@/lib/integrationService';
import type { 
  WebhookIntegration, 
  WebhookLog, 
  WebhookEvent,
  WebhookTestRequest,
  WebhookTestResponse 
} from '@/types/integrations';

interface WebhookManagerProps {
  userId: string;
}

export const WebhookManager: React.FC<WebhookManagerProps> = ({ userId }) => {
  const [webhooks, setWebhooks] = useState<WebhookIntegration[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookIntegration | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<WebhookTestResponse | null>(null);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      setLoading(true);
      const webhooksData = await integrationService.getWebhooks(userId);
      setWebhooks(webhooksData);
    } catch (err) {
      console.error('Error loading webhooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWebhookLogs = async (webhookId: string) => {
    try {
      const logsData = await integrationService.getWebhookLogs(webhookId);
      setLogs(logsData);
    } catch (err) {
      console.error('Error loading webhook logs:', err);
    }
  };

  const handleCreateWebhook = async (webhookData: Omit<WebhookIntegration, 'id' | 'createdAt' | 'updatedAt' | 'logs'>) => {
    try {
      const newWebhook = await integrationService.createWebhook(userId, webhookData);
      setWebhooks([newWebhook, ...webhooks]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating webhook:', err);
    }
  };

  const handleTestWebhook = async (request: WebhookTestRequest) => {
    try {
      const result = await integrationService.testWebhook(request);
      setTestResult(result);
      // Refresh logs after test
      if (selectedWebhook) {
        await loadWebhookLogs(selectedWebhook.id);
      }
    } catch (err) {
      console.error('Error testing webhook:', err);
      setTestResult({
        success: false,
        status: 0,
        response: null,
        error: 'Test failed',
        processingTimeMs: 0
      });
    }
  };

  const availableEvents: WebhookEvent[] = [
    {
      name: 'patent.status.changed',
      description: 'Triggered when a patent status changes',
      payloadSchema: {
        type: 'object',
        properties: {
          patentId: { type: 'string' },
          oldStatus: { type: 'string' },
          newStatus: { type: 'string' },
          timestamp: { type: 'string' }
        }
      },
      example: {
        patentId: 'US12345678',
        oldStatus: 'pending',
        newStatus: 'approved',
        timestamp: new Date().toISOString()
      }
    },
    {
      name: 'search.completed',
      description: 'Triggered when a search operation completes',
      payloadSchema: {
        type: 'object',
        properties: {
          searchId: { type: 'string' },
          query: { type: 'string' },
          resultCount: { type: 'number' },
          timestamp: { type: 'string' }
        }
      },
      example: {
        searchId: 'search_123',
        query: 'artificial intelligence',
        resultCount: 1250,
        timestamp: new Date().toISOString()
      }
    },
    {
      name: 'analysis.ready',
      description: 'Triggered when patent analysis is complete',
      payloadSchema: {
        type: 'object',
        properties: {
          analysisId: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string' },
          timestamp: { type: 'string' }
        }
      },
      example: {
        analysisId: 'analysis_456',
        type: 'prior_art',
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Webhook Manager</h1>
            <p className="text-gray-600">
              Configure and monitor webhook endpoints for real-time notifications
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Webhook
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Webhook className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {webhooks.filter(w => w.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Active Webhooks</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.success).length}
              </p>
              <p className="text-sm text-gray-600">Successful Calls</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => !log.success).length}
              </p>
              <p className="text-sm text-gray-600">Failed Calls</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {logs.length > 0 
                  ? Math.round(logs.reduce((sum, log) => sum + log.processingTimeMs, 0) / logs.length)
                  : 0
                }ms
              </p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Webhooks List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your Webhooks</h2>
        </div>

        <div className="divide-y">
          {webhooks.map((webhook) => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              onTest={() => {
                setSelectedWebhook(webhook);
                setShowTestModal(true);
              }}
              onViewLogs={() => {
                setSelectedWebhook(webhook);
                loadWebhookLogs(webhook.id);
                setShowLogsModal(true);
              }}
              onToggleActive={() => {
                // Implementation for toggling webhook active status
                console.log('Toggle webhook:', webhook.id);
              }}
            />
          ))}
        </div>

        {webhooks.length === 0 && (
          <div className="text-center py-12">
            <Webhook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No webhooks configured</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Webhook
            </button>
          </div>
        )}
      </div>

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <CreateWebhookModal
          availableEvents={availableEvents}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWebhook}
        />
      )}

      {/* Test Webhook Modal */}
      {showTestModal && selectedWebhook && (
        <TestWebhookModal
          webhook={selectedWebhook}
          availableEvents={availableEvents}
          testResult={testResult}
          onClose={() => {
            setShowTestModal(false);
            setTestResult(null);
          }}
          onTest={handleTestWebhook}
        />
      )}

      {/* Webhook Logs Modal */}
      {showLogsModal && selectedWebhook && (
        <WebhookLogsModal
          webhook={selectedWebhook}
          logs={logs}
          onClose={() => setShowLogsModal(false)}
          onRefresh={() => loadWebhookLogs(selectedWebhook.id)}
        />
      )}
    </div>
  );
};

// Webhook Card Component
const WebhookCard: React.FC<{
  webhook: WebhookIntegration;
  onTest: () => void;
  onViewLogs: () => void;
  onToggleActive: () => void;
}> = ({ webhook, onTest, onViewLogs, onToggleActive }) => {
  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'text-green-600 bg-green-100' 
      : 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {webhook.name}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(webhook.isActive)}`}>
              {webhook.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{webhook.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">URL:</span>
              <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1">
                {webhook.url}
              </p>
            </div>
            
            <div>
              <span className="text-gray-500">Events:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {webhook.events.slice(0, 3).map(event => (
                  <span
                    key={event.name}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                  >
                    {event.name}
                  </span>
                ))}
                {webhook.events.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{webhook.events.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-gray-500">Authentication:</span>
              <p className="font-medium capitalize">
                {webhook.authentication.type.replace('_', ' ')}
              </p>
            </div>

            <div>
              <span className="text-gray-500">Max Retries:</span>
              <p className="font-medium">{webhook.retryPolicy.maxRetries}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onTest}
            className="p-2 text-blue-600 hover:text-blue-800 rounded"
            title="Test webhook"
          >
            <Play className="h-4 w-4" />
          </button>
          
          <button
            onClick={onViewLogs}
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
            title="View logs"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={onToggleActive}
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
            title={webhook.isActive ? 'Pause webhook' : 'Activate webhook'}
          >
            {webhook.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
            title="Edit webhook"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Webhook Modal Component
const CreateWebhookModal: React.FC<{
  availableEvents: WebhookEvent[];
  onClose: () => void;
  onCreate: (webhook: Omit<WebhookIntegration, 'id' | 'createdAt' | 'updatedAt' | 'logs'>) => void;
}> = ({ availableEvents, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    events: [] as WebhookEvent[],
    authentication: {
      type: 'none' as const,
      secret: '',
      algorithm: 'sha256' as const,
      headerName: 'X-Webhook-Signature'
    },
    retryPolicy: {
      maxRetries: 3,
      retryDelayMs: 1000,
      backoffMultiplier: 2,
      maxDelayMs: 30000
    },
    headers: {} as Record<string, string>,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.url && formData.events.length > 0) {
      onCreate({
        ...formData,
        category: 'webhook',
        status: 'active',
        provider: 'innospot',
        version: '1.0.0',
        logs: []
      } as any);
    }
  };

  const toggleEvent = (event: WebhookEvent) => {
    const exists = formData.events.find(e => e.name === event.name);
    if (exists) {
      setFormData({
        ...formData,
        events: formData.events.filter(e => e.name !== event.name)
      });
    } else {
      setFormData({
        ...formData,
        events: [...formData.events, event]
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Create Webhook</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Patent Status Notifications"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe what this webhook does..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endpoint URL *
                </label>
                <input
                  type="url"
                  placeholder="https://your-app.com/webhook"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Events */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Events *</h3>
              <div className="space-y-2">
                {availableEvents.map(event => (
                  <label key={event.name} className="flex items-start p-3 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.events.some(e => e.name === event.name)}
                      onChange={() => toggleEvent(event)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{event.name}</div>
                      <div className="text-sm text-gray-600">{event.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Authentication */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Authentication</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.authentication.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    authentication: {
                      ...formData.authentication,
                      type: e.target.value as any
                    }
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="none">None</option>
                  <option value="secret">Shared Secret</option>
                  <option value="signature">HMAC Signature</option>
                  <option value="bearer_token">Bearer Token</option>
                </select>
              </div>

              {formData.authentication.type !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secret/Token
                  </label>
                  <input
                    type="password"
                    placeholder="Enter secret or token"
                    value={formData.authentication.secret}
                    onChange={(e) => setFormData({
                      ...formData,
                      authentication: {
                        ...formData.authentication,
                        secret: e.target.value
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              )}

              {(formData.authentication.type as string) === 'signature' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Algorithm
                    </label>
                    <select
                      value={formData.authentication.algorithm}
                      onChange={(e) => setFormData({
                        ...formData,
                        authentication: {
                          ...formData.authentication,
                          algorithm: e.target.value as any
                        }
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="sha256">SHA-256</option>
                      <option value="sha1">SHA-1</option>
                      <option value="md5">MD5</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Header Name
                    </label>
                    <input
                      type="text"
                      value={formData.authentication.headerName}
                      onChange={(e) => setFormData({
                        ...formData,
                        authentication: {
                          ...formData.authentication,
                          headerName: e.target.value
                        }
                      })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Retry Policy */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Retry Policy</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Retries
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.retryPolicy.maxRetries}
                    onChange={(e) => setFormData({
                      ...formData,
                      retryPolicy: {
                        ...formData.retryPolicy,
                        maxRetries: parseInt(e.target.value)
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Delay (ms)
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={formData.retryPolicy.retryDelayMs}
                    onChange={(e) => setFormData({
                      ...formData,
                      retryPolicy: {
                        ...formData.retryPolicy,
                        retryDelayMs: parseInt(e.target.value)
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
              Create Webhook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Test Webhook Modal Component
const TestWebhookModal: React.FC<{
  webhook: WebhookIntegration;
  availableEvents: WebhookEvent[];
  testResult: WebhookTestResponse | null;
  onClose: () => void;
  onTest: (request: WebhookTestRequest) => void;
}> = ({ webhook, availableEvents, testResult, onClose, onTest }) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [customPayload, setCustomPayload] = useState('');

  const handleTest = () => {
    const event = availableEvents.find(e => e.name === selectedEvent);
    if (event) {
      const payload = customPayload 
        ? JSON.parse(customPayload)
        : event.example;

      onTest({
        webhookId: webhook.id,
        event: selectedEvent,
        payload,
        timestamp: new Date().toISOString()
      });
    }
  };

  const populateExamplePayload = () => {
    const event = availableEvents.find(e => e.name === selectedEvent);
    if (event) {
      setCustomPayload(JSON.stringify(event.example, null, 2));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Test Webhook: {webhook.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Event
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Choose an event...</option>
                  {webhook.events.map(event => (
                    <option key={event.name} value={event.name}>
                      {event.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={populateExamplePayload}
                  disabled={!selectedEvent}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Use Example
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payload (JSON)
              </label>
              <textarea
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm h-40"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTest}
                disabled={!selectedEvent}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Test Webhook
              </button>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Test Result</h3>
                
                <div className={`p-4 rounded-lg mb-4 ${
                  testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {testResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      testResult.success ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {testResult.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-medium">{testResult.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Response Time:</span>
                      <span className="ml-2 font-medium">{testResult.processingTimeMs}ms</span>
                    </div>
                  </div>

                  {testResult.error && (
                    <div className="mt-2">
                      <span className="text-gray-500">Error:</span>
                      <p className="text-red-700 font-medium">{testResult.error}</p>
                    </div>
                  )}
                </div>

                {testResult.response && (
                  <div>
                    <h4 className="font-medium mb-2">Response:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(testResult.response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Webhook Logs Modal Component
const WebhookLogsModal: React.FC<{
  webhook: WebhookIntegration;
  logs: WebhookLog[];
  onClose: () => void;
  onRefresh: () => void;
}> = ({ webhook, logs, onClose, onRefresh }) => {
  const [filter, setFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    switch (filter) {
      case 'success': return log.success;
      case 'failed': return !log.success;
      default: return true;
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Webhook Logs: {webhook.name}</h2>
            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">All Logs</option>
                <option value="success">Success Only</option>
                <option value="failed">Failed Only</option>
              </select>
              <button
                onClick={onRefresh}
                className="p-2 text-gray-400 hover:text-gray-600 rounded"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {filteredLogs.length > 0 ? (
            <div className="divide-y">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {log.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{log.event}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Attempt {log.attempt}</span>
                      <span>{log.processingTimeMs}ms</span>
                      {log.response && (
                        <span className={
                          log.response.status >= 200 && log.response.status < 300
                            ? 'text-green-600'
                            : 'text-red-600'
                        }>
                          {log.response.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {log.error && (
                    <div className="mb-2">
                      <span className="text-xs text-red-600 font-medium">Error: </span>
                      <span className="text-xs text-red-700">{log.error}</span>
                    </div>
                  )}

                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                      View payload and response
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <div className="font-medium text-gray-700 mb-1">Payload:</div>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>
                      {log.response && (
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Response:</div>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                            {JSON.stringify(log.response.body, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">
                {filter === 'all' ? 'No logs found' : `No ${filter} logs found`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default WebhookManager;
