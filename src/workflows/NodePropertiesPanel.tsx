// Node Properties Panel - Configure selected nodes and workflow settings
// Provides context-sensitive property editing for workflow elements

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Trash2, 
  Copy,
  Code,
  Zap
} from 'lucide-react';
import { 
  WorkflowDefinition, 
  WorkflowNode, 
  WorkflowConnection, 
  WorkflowVariable 
} from '../types/automation';

interface NodePropertiesPanelProps {
  workflow: WorkflowDefinition;
  selectedNode: WorkflowNode | null;
  selectedConnection: WorkflowConnection | null;
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateWorkflow: (updates: Partial<WorkflowDefinition>) => void;
  readonly?: boolean;
}

type TabType = 'node' | 'connection' | 'workflow' | 'variables';

export default function NodePropertiesPanel({
  workflow,
  selectedNode,
  selectedConnection,
  onUpdateNode,
  onDeleteNode,
  onUpdateWorkflow,
  readonly = false
}: NodePropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('workflow');
  const [nodeConfig, setNodeConfig] = useState<Record<string, any>>({});

  // Update active tab based on selection
  useEffect(() => {
    if (selectedNode) {
      setActiveTab('node');
      setNodeConfig(selectedNode.config || {});
    } else if (selectedConnection) {
      setActiveTab('connection');
    }
  }, [selectedNode, selectedConnection]);

  // Update node configuration
  const updateNodeConfig = (key: string, value: any) => {
    if (!selectedNode || readonly) return;

    const updatedConfig = { ...nodeConfig, [key]: value };
    setNodeConfig(updatedConfig);
    onUpdateNode(selectedNode.id, { config: updatedConfig });
  };

  // Update node basic properties
  const updateNodeProperty = (property: keyof WorkflowNode, value: any) => {
    if (!selectedNode || readonly) return;
    onUpdateNode(selectedNode.id, { [property]: value });
  };

  // Delete selected node
  const handleDeleteNode = () => {
    if (!selectedNode || readonly) return;
    if (confirm(`Delete node "${selectedNode.name}"?`)) {
      onDeleteNode(selectedNode.id);
    }
  };

  // Duplicate selected node
  const handleDuplicateNode = () => {
    if (!selectedNode || readonly) return;
    // Implementation would duplicate the node
    console.log('Duplicate node:', selectedNode);
  };

  // Render node-specific configuration
  const renderNodeConfig = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'trigger':
        return renderTriggerConfig();
      case 'condition':
        return renderConditionConfig();
      case 'action':
        return renderActionConfig();
      case 'delay':
        return renderDelayConfig();
      default:
        return renderGenericConfig();
    }
  };

  const renderTriggerConfig = () => {
    const triggerType = nodeConfig.trigger_type || 'manual';

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trigger Type
          </label>
          <select
            value={triggerType}
            onChange={(e) => updateNodeConfig('trigger_type', e.target.value)}
            disabled={readonly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="manual">Manual</option>
            <option value="scheduled">Scheduled</option>
            <option value="webhook">Webhook</option>
            <option value="event">Event</option>
          </select>
        </div>

        {triggerType === 'scheduled' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule (Cron Expression)
            </label>
            <input
              type="text"
              value={nodeConfig.cron_expression || ''}
              onChange={(e) => updateNodeConfig('cron_expression', e.target.value)}
              disabled={readonly}
              placeholder="0 0 * * * (daily at midnight)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use cron syntax for scheduling
            </p>
          </div>
        )}

        {triggerType === 'webhook' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL
            </label>
            <input
              type="text"
              value={nodeConfig.webhook_url || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              placeholder="Auto-generated on save"
            />
          </div>
        )}
      </div>
    );
  };

  const renderConditionConfig = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition Expression
          </label>
          <textarea
            value={nodeConfig.condition || ''}
            onChange={(e) => updateNodeConfig('condition', e.target.value)}
            disabled={readonly}
            placeholder="e.g., {patent_count} > 5"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use {`{variable_name}`} for dynamic values
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              True Output
            </label>
            <input
              type="text"
              value={nodeConfig.true_output || 'continue'}
              onChange={(e) => updateNodeConfig('true_output', e.target.value)}
              disabled={readonly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              False Output
            </label>
            <input
              type="text"
              value={nodeConfig.false_output || 'stop'}
              onChange={(e) => updateNodeConfig('false_output', e.target.value)}
              disabled={readonly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderActionConfig = () => {
    const actionType = nodeConfig.action_type || 'log_message';

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Action Type
          </label>
          <select
            value={actionType}
            onChange={(e) => updateNodeConfig('action_type', e.target.value)}
            disabled={readonly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="log_message">Log Message</option>
            <option value="send_email">Send Email</option>
            <option value="create_alert">Create Alert</option>
            <option value="update_database">Update Database</option>
            <option value="call_webhook">Call Webhook</option>
            <option value="generate_report">Generate Report</option>
          </select>
        </div>

        {renderActionTypeConfig(actionType)}
      </div>
    );
  };

  const renderActionTypeConfig = (actionType: string) => {
    switch (actionType) {
      case 'send_email':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients
              </label>
              <input
                type="text"
                value={nodeConfig.recipients || ''}
                onChange={(e) => updateNodeConfig('recipients', e.target.value)}
                disabled={readonly}
                placeholder="email1@example.com, email2@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={nodeConfig.subject || ''}
                onChange={(e) => updateNodeConfig('subject', e.target.value)}
                disabled={readonly}
                placeholder="Email subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={nodeConfig.message || ''}
                onChange={(e) => updateNodeConfig('message', e.target.value)}
                disabled={readonly}
                placeholder="Email message content"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
        );

      case 'call_webhook':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={nodeConfig.url || ''}
                onChange={(e) => updateNodeConfig('url', e.target.value)}
                disabled={readonly}
                placeholder="https://api.example.com/webhook"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Method
              </label>
              <select
                value={nodeConfig.method || 'POST'}
                onChange={(e) => updateNodeConfig('method', e.target.value)}
                disabled={readonly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headers (JSON)
              </label>
              <textarea
                value={nodeConfig.headers || '{}'}
                onChange={(e) => updateNodeConfig('headers', e.target.value)}
                disabled={readonly}
                placeholder='{"Content-Type": "application/json"}'
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 font-mono text-sm"
              />
            </div>
          </div>
        );

      case 'create_alert':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Type
              </label>
              <select
                value={nodeConfig.alert_type || 'info'}
                onChange={(e) => updateNodeConfig('alert_type', e.target.value)}
                disabled={readonly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={nodeConfig.title || ''}
                onChange={(e) => updateNodeConfig('title', e.target.value)}
                disabled={readonly}
                placeholder="Alert title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={nodeConfig.message || ''}
              onChange={(e) => updateNodeConfig('message', e.target.value)}
              disabled={readonly}
              placeholder="Log message content"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        );
    }
  };

  const renderDelayConfig = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delay Duration
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={nodeConfig.delay_value || 60}
              onChange={(e) => updateNodeConfig('delay_value', parseInt(e.target.value))}
              disabled={readonly}
              min="1"
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <select
              value={nodeConfig.delay_unit || 'seconds'}
              onChange={(e) => updateNodeConfig('delay_unit', e.target.value)}
              disabled={readonly}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderGenericConfig = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Configuration (JSON)
          </label>
          <textarea
            value={JSON.stringify(nodeConfig, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setNodeConfig(parsed);
              } catch {
                // Invalid JSON, don't update
              }
            }}
            disabled={readonly}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 font-mono text-sm"
          />
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'node':
        return renderNodeTab();
      case 'connection':
        return renderConnectionTab();
      case 'workflow':
        return renderWorkflowTab();
      case 'variables':
        return renderVariablesTab();
      default:
        return null;
    }
  };

  const renderNodeTab = () => {
    if (!selectedNode) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Settings className="mx-auto mb-2 opacity-50" size={32} />
          <p>Select a node to configure</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Basic Properties */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Basic Properties</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Node Name
            </label>
            <input
              type="text"
              value={selectedNode.name}
              onChange={(e) => updateNodeProperty('name', e.target.value)}
              disabled={readonly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={selectedNode.description || ''}
              onChange={(e) => updateNodeProperty('description', e.target.value)}
              disabled={readonly}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedNode.enabled}
                onChange={(e) => updateNodeProperty('enabled', e.target.checked)}
                disabled={readonly}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-100"
              />
              <span className="text-sm font-medium text-gray-700">Enabled</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedNode.continue_on_error}
                onChange={(e) => updateNodeProperty('continue_on_error', e.target.checked)}
                disabled={readonly}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-100"
              />
              <span className="text-sm font-medium text-gray-700">Continue on Error</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (seconds)
            </label>
            <input
              type="number"
              value={selectedNode.timeout || 300}
              onChange={(e) => updateNodeProperty('timeout', parseInt(e.target.value))}
              disabled={readonly}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Node Configuration */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Configuration</h4>
          {renderNodeConfig()}
        </div>

        {/* Actions */}
        {!readonly && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-gray-900">Actions</h4>
            <div className="flex space-x-2">
              <button
                onClick={handleDuplicateNode}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                <Copy size={16} />
                <span>Duplicate</span>
              </button>
              <button
                onClick={handleDeleteNode}
                className="flex items-center space-x-2 px-3 py-2 text-red-600 bg-red-100 rounded hover:bg-red-200"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderConnectionTab = () => {
    if (!selectedConnection) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Zap className="mx-auto mb-2 opacity-50" size={32} />
          <p>Select a connection to configure</p>
        </div>
      );
    }

    const sourceNode = workflow.nodes.find(n => n.id === selectedConnection.source_node_id);
    const targetNode = workflow.nodes.find(n => n.id === selectedConnection.target_node_id);

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Connection Details</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded-md">
              {sourceNode?.name || 'Unknown Node'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded-md">
              {targetNode?.name || 'Unknown Node'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition (Optional)
            </label>
            <textarea
              value={selectedConnection.condition || ''}
              onChange={(_e) => {
                // Update connection condition
                if (!readonly) {
                  // const _updatedConnection = { ...selectedConnection, condition: e.target.value };
                  // Would need to implement connection update
                }
              }}
              disabled={readonly}
              placeholder="Leave empty for unconditional connection"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderWorkflowTab = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Workflow Settings</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={workflow.name}
              onChange={(e) => onUpdateWorkflow({ name: e.target.value })}
              disabled={readonly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={workflow.description}
              onChange={(e) => onUpdateWorkflow({ description: e.target.value })}
              disabled={readonly}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={workflow.priority}
                onChange={(e) => onUpdateWorkflow({ priority: e.target.value as any })}
                disabled={readonly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={workflow.status}
                onChange={(e) => onUpdateWorkflow({ status: e.target.value as any })}
                disabled={readonly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={workflow.tags.join(', ')}
              onChange={(e) => onUpdateWorkflow({ tags: e.target.value.split(',').map(tag => tag.trim()) })}
              disabled={readonly}
              placeholder="tag1, tag2, tag3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Execution Settings</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Retries
              </label>
              <input
                type="number"
                value={workflow.max_retries}
                onChange={(e) => onUpdateWorkflow({ max_retries: parseInt(e.target.value) })}
                disabled={readonly}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retry Delay (seconds)
              </label>
              <input
                type="number"
                value={workflow.retry_delay}
                onChange={(e) => onUpdateWorkflow({ retry_delay: parseInt(e.target.value) })}
                disabled={readonly}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (seconds)
            </label>
            <input
              type="number"
              value={workflow.timeout}
              onChange={(e) => onUpdateWorkflow({ timeout: parseInt(e.target.value) })}
              disabled={readonly}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Statistics</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-2xl font-bold text-gray-900">{workflow.execution_count}</div>
              <div className="text-xs text-gray-500">Total Runs</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-2xl font-bold text-green-600">{workflow.success_count}</div>
              <div className="text-xs text-gray-500">Successful</div>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <div className="text-2xl font-bold text-red-600">{workflow.failure_count}</div>
              <div className="text-xs text-gray-500">Failed</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVariablesTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Workflow Variables</h4>
          {!readonly && (
            <button
              onClick={() => {
                // Add new variable
                const newVariable: WorkflowVariable = {
                  id: `var_${Date.now()}`,
                  name: 'new_variable',
                  type: 'string',
                  value: '',
                  is_sensitive: false
                };
                onUpdateWorkflow({
                  variables: [...workflow.variables, newVariable]
                });
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Add Variable
            </button>
          )}
        </div>

        {workflow.variables.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Code className="mx-auto mb-2 opacity-50" size={32} />
            <p>No variables defined</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workflow.variables.map((variable) => (
              <div key={variable.id} className="p-4 border rounded-lg">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={variable.name}
                        onChange={(e) => {
                          const updatedVariables = workflow.variables.map(v =>
                            v.id === variable.id ? { ...v, name: e.target.value } : v
                          );
                          onUpdateWorkflow({ variables: updatedVariables });
                        }}
                        disabled={readonly}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={variable.type}
                        onChange={(e) => {
                          const updatedVariables = workflow.variables.map(v =>
                            v.id === variable.id ? { ...v, type: e.target.value as any } : v
                          );
                          onUpdateWorkflow({ variables: updatedVariables });
                        }}
                        disabled={readonly}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="object">Object</option>
                        <option value="array">Array</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <input
                      type={variable.is_sensitive ? 'password' : 'text'}
                      value={variable.value}
                      onChange={(e) => {
                        const updatedVariables = workflow.variables.map(v =>
                          v.id === variable.id ? { ...v, value: e.target.value } : v
                        );
                        onUpdateWorkflow({ variables: updatedVariables });
                      }}
                      disabled={readonly}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={variable.is_sensitive}
                        onChange={(e) => {
                          const updatedVariables = workflow.variables.map(v =>
                            v.id === variable.id ? { ...v, is_sensitive: e.target.checked } : v
                          );
                          onUpdateWorkflow({ variables: updatedVariables });
                        }}
                        disabled={readonly}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-100"
                      />
                      <span className="text-sm text-gray-700">Sensitive</span>
                    </label>

                    {!readonly && (
                      <button
                        onClick={() => {
                          const updatedVariables = workflow.variables.filter(v => v.id !== variable.id);
                          onUpdateWorkflow({ variables: updatedVariables });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {variable.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={variable.description}
                        onChange={(e) => {
                          const updatedVariables = workflow.variables.map(v =>
                            v.id === variable.id ? { ...v, description: e.target.value } : v
                          );
                          onUpdateWorkflow({ variables: updatedVariables });
                        }}
                        disabled={readonly}
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex">
          {[
            { id: 'workflow', name: 'Workflow', icon: Settings },
            { id: 'node', name: 'Node', icon: selectedNode ? Settings : Settings },
            { id: 'connection', name: 'Connection', icon: Zap },
            { id: 'variables', name: 'Variables', icon: Code }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
}