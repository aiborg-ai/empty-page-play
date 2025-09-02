// Visual Drag-and-Drop Workflow Builder Component
// Provides intuitive interface for creating and editing automation workflows

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Save,
  TestTube,
  History
} from 'lucide-react';
import { 
  WorkflowDefinition, 
  WorkflowNode, 
  WorkflowConnection,
  WorkflowTemplate 
} from '../types/automation';
import { automationEngine } from '../lib/automationEngine';
import WorkflowCanvas from './WorkflowCanvas';
import NodePalette from './NodePalette';
import NodePropertiesPanel from './NodePropertiesPanel';
import WorkflowToolbar from './WorkflowToolbar';
import WorkflowTestRunner from './WorkflowTestRunner';
import WorkflowVersionHistory from './WorkflowVersionHistory';

interface WorkflowBuilderProps {
  workflowId?: string;
  templateId?: string;
  onSave?: (workflow: WorkflowDefinition) => void;
  onClose?: () => void;
  readonly?: boolean;
}

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
}

export default function WorkflowBuilder({
  workflowId,
  templateId,
  onSave,
  onClose,
  readonly = false
}: WorkflowBuilderProps) {
  // Core workflow state
  const [workflow, setWorkflow] = useState<WorkflowDefinition | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<WorkflowConnection | null>(null);
  
  // UI state
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true
  });
  const [showTestRunner, setShowTestRunner] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [_isDragging, _setIsDragging] = useState(false);
  const [_dragOffset, _setDragOffset] = useState({ x: 0, y: 0 });
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nextNodeId, setNextNodeId] = useState(1);

  // Load workflow on mount
  useEffect(() => {
    loadWorkflow();
  }, [workflowId, templateId]);

  // Track unsaved changes
  useEffect(() => {
    if (workflow) {
      setHasUnsavedChanges(true);
    }
  }, [workflow]);

  /**
   * Load workflow from ID or template
   */
  const loadWorkflow = async () => {
    if (!workflowId && !templateId) {
      // Create new workflow
      setWorkflow(createNewWorkflow());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (workflowId) {
        const loadedWorkflow = await automationEngine.getWorkflow(workflowId);
        if (loadedWorkflow) {
          setWorkflow(loadedWorkflow);
        } else {
          throw new Error('Workflow not found');
        }
      } else if (templateId) {
        // Load from template (would implement template service)
        const template = await loadWorkflowTemplate(templateId);
        setWorkflow(createWorkflowFromTemplate(template));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflow');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create new empty workflow
   */
  const createNewWorkflow = (): WorkflowDefinition => {
    return {
      id: '',
      name: 'New Workflow',
      description: '',
      status: 'draft',
      priority: 'medium',
      scope: 'project',
      owner_id: '', // Would get from auth context
      tags: [],
      version: 1,
      is_template: false,
      nodes: [],
      connections: [],
      variables: [],
      max_retries: 3,
      retry_delay: 60,
      timeout: 3600,
      concurrent_executions: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      execution_count: 0,
      success_count: 0,
      failure_count: 0,
    };
  };

  /**
   * Create workflow from template
   */
  const createWorkflowFromTemplate = (template: WorkflowTemplate): WorkflowDefinition => {
    return {
      ...template.template_data,
      id: '',
      name: `${template.name} - Copy`,
      template_id: template.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  /**
   * Save workflow
   */
  const saveWorkflow = async () => {
    if (!workflow || readonly) return;

    setIsSaving(true);
    setError(null);

    try {
      const savedWorkflow = workflow.id 
        ? await automationEngine.updateWorkflow(workflow.id, workflow)
        : await automationEngine.createWorkflow(workflow);

      setWorkflow(savedWorkflow);
      setHasUnsavedChanges(false);
      onSave?.(savedWorkflow);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Add node to workflow
   */
  const addNode = useCallback((nodeType: string, position: { x: number; y: number }) => {
    if (!workflow || readonly) return;

    const newNode: WorkflowNode = {
      id: `node_${nextNodeId}`,
      type: nodeType as any,
      name: `${nodeType} ${nextNodeId}`,
      position,
      config: getDefaultNodeConfig(nodeType),
      inputs: getDefaultInputPorts(nodeType),
      outputs: getDefaultOutputPorts(nodeType),
      enabled: true,
      continue_on_error: false,
    };

    setWorkflow(prev => prev ? {
      ...prev,
      nodes: [...prev.nodes, newNode]
    } : null);

    setNextNodeId(prev => prev + 1);
    setSelectedNode(newNode);
  }, [workflow, nextNodeId, readonly]);

  /**
   * Update selected node
   */
  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    if (!workflow || readonly) return;

    setWorkflow(prev => prev ? {
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    } : null);

    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [workflow, selectedNode, readonly]);

  /**
   * Delete node
   */
  const deleteNode = useCallback((nodeId: string) => {
    if (!workflow || readonly) return;

    setWorkflow(prev => prev ? {
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(conn => 
        conn.source_node_id !== nodeId && conn.target_node_id !== nodeId
      )
    } : null);

    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [workflow, selectedNode, readonly]);

  /**
   * Add connection between nodes
   */
  const addConnection = useCallback((
    sourceNodeId: string,
    sourcePortId: string,
    targetNodeId: string,
    targetPortId: string
  ) => {
    if (!workflow || readonly) return;

    const newConnection: WorkflowConnection = {
      id: `conn_${Date.now()}`,
      source_node_id: sourceNodeId,
      source_port_id: sourcePortId,
      target_node_id: targetNodeId,
      target_port_id: targetPortId,
    };

    setWorkflow(prev => prev ? {
      ...prev,
      connections: [...prev.connections, newConnection]
    } : null);
  }, [workflow, readonly]);

  /**
   * Delete connection
   */
  const deleteConnection = useCallback((connectionId: string) => {
    if (!workflow || readonly) return;

    setWorkflow(prev => prev ? {
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId)
    } : null);

    if (selectedConnection?.id === connectionId) {
      setSelectedConnection(null);
    }
  }, [workflow, selectedConnection, readonly]);

  /**
   * Handle canvas zoom
   */
  const handleZoom = (delta: number) => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(3, prev.zoom + delta))
    }));
  };

  /**
   * Handle canvas pan
   */
  const handlePan = (deltaX: number, deltaY: number) => {
    setCanvasState(prev => ({
      ...prev,
      panX: prev.panX + deltaX,
      panY: prev.panY + deltaY
    }));
  };

  /**
   * Test workflow
   */
  const testWorkflow = async () => {
    if (!workflow) return;
    setShowTestRunner(true);
  };

  /**
   * Export workflow
   */
  const exportWorkflow = () => {
    if (!workflow) return;

    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${workflow.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    link.click();
  };

  /**
   * Import workflow
   */
  const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedWorkflow = JSON.parse(e.target?.result as string);
        setWorkflow({
          ...importedWorkflow,
          id: '', // Clear ID for new workflow
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch (error) {
        setError('Invalid workflow file');
      }
    };
    reader.readAsText(file);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workflow...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={loadWorkflow}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!workflow) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">{workflow.name}</h1>
          {hasUnsavedChanges && (
            <span className="text-sm text-orange-600 font-medium">• Unsaved changes</span>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className={`px-2 py-1 rounded ${
              workflow.status === 'active' ? 'bg-green-100 text-green-800' :
              workflow.status === 'draft' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {workflow.status}
            </span>
            <span>v{workflow.version}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!readonly && (
            <>
              <button
                onClick={testWorkflow}
                className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded"
              >
                <TestTube size={16} />
                <span>Test</span>
              </button>
              <button
                onClick={saveWorkflow}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
            </>
          )}
          <button
            onClick={() => setShowVersionHistory(true)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            <History size={16} />
            <span>History</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Node Palette */}
        {!readonly && (
          <div className="w-64 bg-white border-r">
            <NodePalette onAddNode={addNode} />
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <WorkflowToolbar
            canvasState={canvasState}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
            onToggleGrid={() => setCanvasState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
            onExport={exportWorkflow}
            onImport={importWorkflow}
            readonly={readonly}
          />

          <WorkflowCanvas
            ref={canvasRef}
            workflow={workflow}
            canvasState={canvasState}
            selectedNode={selectedNode}
            selectedConnection={selectedConnection}
            onNodeSelect={setSelectedNode}
            onConnectionSelect={setSelectedConnection}
            onNodeMove={updateNode}
            onAddConnection={addConnection}
            onDeleteConnection={deleteConnection}
            onPan={handlePan}
            readonly={readonly}
          />
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l">
          <NodePropertiesPanel
            workflow={workflow}
            selectedNode={selectedNode}
            selectedConnection={selectedConnection}
            onUpdateNode={updateNode}
            onDeleteNode={deleteNode}
            onUpdateWorkflow={(updates) => setWorkflow(prev => prev ? { ...prev, ...updates } : null)}
            readonly={readonly}
          />
        </div>
      </div>

      {/* Test Runner Modal */}
      {showTestRunner && (
        <WorkflowTestRunner
          workflow={workflow}
          onClose={() => setShowTestRunner(false)}
        />
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <WorkflowVersionHistory
          workflowId={workflow.id}
          onClose={() => setShowVersionHistory(false)}
          onRestoreVersion={(_version) => {
            // Implement version restoration
            setShowVersionHistory(false);
          }}
        />
      )}
    </div>
  );
}

// Helper functions
function getDefaultNodeConfig(nodeType: string): Record<string, any> {
  switch (nodeType) {
    case 'trigger':
      return { trigger_type: 'manual' };
    case 'condition':
      return { condition: 'true', true_output: 'continue', false_output: 'stop' };
    case 'action':
      return { action_type: 'log_message', message: 'Hello World' };
    case 'delay':
      return { delay_seconds: 60 };
    default:
      return {};
  }
}

function getDefaultInputPorts(nodeType: string) {
  switch (nodeType) {
    case 'trigger':
      return [];
    default:
      return [{ id: 'input', name: 'Input', type: 'input' as const, data_type: 'any', required: false }];
  }
}

function getDefaultOutputPorts(nodeType: string) {
  switch (nodeType) {
    case 'condition':
      return [
        { id: 'true', name: 'True', type: 'output' as const, data_type: 'any', required: false },
        { id: 'false', name: 'False', type: 'output' as const, data_type: 'any', required: false }
      ];
    default:
      return [{ id: 'output', name: 'Output', type: 'output' as const, data_type: 'any', required: false }];
  }
}

async function loadWorkflowTemplate(_templateId: string): Promise<WorkflowTemplate> {
  // Implementation would load from template service
  throw new Error('Template loading not implemented');
}