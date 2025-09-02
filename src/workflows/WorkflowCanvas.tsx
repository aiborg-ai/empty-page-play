// Interactive Canvas for Visual Workflow Building
// Handles drag-and-drop, node connections, and visual workflow representation

import React, { forwardRef, useCallback, useRef, useState, useEffect } from 'react';
import { WorkflowDefinition, WorkflowNode, WorkflowConnection } from '../types/automation';

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
}

interface WorkflowCanvasProps {
  workflow: WorkflowDefinition;
  canvasState: CanvasState;
  selectedNode: WorkflowNode | null;
  selectedConnection: WorkflowConnection | null;
  onNodeSelect: (node: WorkflowNode | null) => void;
  onConnectionSelect: (connection: WorkflowConnection | null) => void;
  onNodeMove: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onAddConnection: (sourceNodeId: string, sourcePortId: string, targetNodeId: string, targetPortId: string) => void;
  onDeleteConnection: (connectionId: string) => void;
  onPan: (deltaX: number, deltaY: number) => void;
  readonly?: boolean;
}

interface DragState {
  isDragging: boolean;
  dragType: 'node' | 'pan' | 'connection';
  dragNodeId?: string;
  dragStartPos: { x: number; y: number };
  dragCurrentPos: { x: number; y: number };
  connectionStart?: { nodeId: string; portId: string; type: 'input' | 'output' };
}

const WorkflowCanvas = forwardRef<HTMLDivElement, WorkflowCanvasProps>(({
  workflow,
  canvasState,
  selectedNode,
  selectedConnection,
  onNodeSelect,
  onConnectionSelect,
  onNodeMove,
  onAddConnection,
  onDeleteConnection,
  onPan,
  readonly = false
}, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: 'node',
    dragStartPos: { x: 0, y: 0 },
    dragCurrentPos: { x: 0, y: 0 }
  });

  // Handle mouse down events
  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId?: string) => {
    e.preventDefault();
    
    if (readonly) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasState.panX) / canvasState.zoom;
    const y = (e.clientY - rect.top - canvasState.panY) / canvasState.zoom;

    if (nodeId) {
      // Start node dragging
      setDragState({
        isDragging: true,
        dragType: 'node',
        dragNodeId: nodeId,
        dragStartPos: { x, y },
        dragCurrentPos: { x, y }
      });
      
      const node = workflow.nodes.find(n => n.id === nodeId);
      if (node) {
        onNodeSelect(node);
      }
    } else {
      // Start canvas panning
      setDragState({
        isDragging: true,
        dragType: 'pan',
        dragStartPos: { x: e.clientX, y: e.clientY },
        dragCurrentPos: { x: e.clientX, y: e.clientY }
      });
      
      onNodeSelect(null);
      onConnectionSelect(null);
    }
  }, [workflow.nodes, canvasState, onNodeSelect, onConnectionSelect, readonly]);

  // Handle mouse move events
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || readonly) return;

    const currentPos = { x: e.clientX, y: e.clientY };

    if (dragState.dragType === 'node' && dragState.dragNodeId) {
      // Update node position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasState.panX) / canvasState.zoom;
      const y = (e.clientY - rect.top - canvasState.panY) / canvasState.zoom;

      onNodeMove(dragState.dragNodeId, {
        position: { x: x - 100, y: y - 50 } // Adjust for node center
      });
    } else if (dragState.dragType === 'pan') {
      // Update canvas pan
      const deltaX = currentPos.x - dragState.dragStartPos.x;
      const deltaY = currentPos.y - dragState.dragStartPos.y;
      
      onPan(deltaX, deltaY);
      
      setDragState(prev => ({
        ...prev,
        dragStartPos: currentPos
      }));
    }

    setDragState(prev => ({
      ...prev,
      dragCurrentPos: currentPos
    }));
  }, [dragState, canvasState, onNodeMove, onPan, readonly]);

  // Handle mouse up events
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragType: 'node',
      dragStartPos: { x: 0, y: 0 },
      dragCurrentPos: { x: 0, y: 0 }
    });
  }, []);

  // Handle connection port clicks
  const handlePortClick = useCallback((e: React.MouseEvent, nodeId: string, portId: string, type: 'input' | 'output') => {
    e.stopPropagation();
    
    if (readonly) return;

    if (!dragState.connectionStart) {
      // Start connection
      setDragState(prev => ({
        ...prev,
        connectionStart: { nodeId, portId, type }
      }));
    } else {
      // Complete connection
      const { nodeId: startNodeId, portId: startPortId, type: startType } = dragState.connectionStart;
      
      // Validate connection (output to input)
      if (startType !== type && startNodeId !== nodeId) {
        if (startType === 'output') {
          onAddConnection(startNodeId, startPortId, nodeId, portId);
        } else {
          onAddConnection(nodeId, portId, startNodeId, startPortId);
        }
      }
      
      setDragState(prev => ({
        ...prev,
        connectionStart: undefined
      }));
    }
  }, [dragState.connectionStart, onAddConnection, readonly]);

  // Handle connection clicks
  const handleConnectionClick = useCallback((connection: WorkflowConnection) => {
    if (readonly) return;
    onConnectionSelect(connection);
  }, [onConnectionSelect, readonly]);

  // Handle key down events for deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readonly) return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedConnection) {
          onDeleteConnection(selectedConnection.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedConnection, onDeleteConnection, readonly]);

  // Get node visual properties
  const getNodeStyle = (node: WorkflowNode, isSelected: boolean) => {
    const baseStyle = {
      transform: `translate(${node.position.x}px, ${node.position.y}px)`,
      opacity: node.enabled ? 1 : 0.6
    };

    const borderColor = isSelected ? 'border-blue-500' : 
                       node.type === 'trigger' ? 'border-green-500' :
                       node.type === 'condition' ? 'border-yellow-500' :
                       node.type === 'action' ? 'border-blue-500' :
                       'border-gray-300';

    return { ...baseStyle, borderColor };
  };

  // Get connection path
  const getConnectionPath = (connection: WorkflowConnection) => {
    const sourceNode = workflow.nodes.find(n => n.id === connection.source_node_id);
    const targetNode = workflow.nodes.find(n => n.id === connection.target_node_id);

    if (!sourceNode || !targetNode) return '';

    const startX = sourceNode.position.x + 200; // Node width
    const startY = sourceNode.position.y + 50;  // Node center
    const endX = targetNode.position.x;
    const endY = targetNode.position.y + 50;

    // Create curved connection
    const controlX1 = startX + (endX - startX) * 0.5;
    const controlY1 = startY;
    const controlX2 = startX + (endX - startX) * 0.5;
    const controlY2 = endY;

    return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
  };

  return (
    <div 
      ref={ref}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid Background */}
      {canvasState.showGrid && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #999 1px, transparent 1px)`,
            backgroundSize: `${20 * canvasState.zoom}px ${20 * canvasState.zoom}px`,
            backgroundPosition: `${canvasState.panX}px ${canvasState.panY}px`
          }}
        />
      )}

      {/* Main Canvas */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Connections SVG */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {workflow.connections.map((connection) => (
            <g key={connection.id}>
              <path
                d={getConnectionPath(connection)}
                stroke={selectedConnection?.id === connection.id ? '#3b82f6' : '#6b7280'}
                strokeWidth={selectedConnection?.id === connection.id ? 3 : 2}
                fill="none"
                className="pointer-events-auto cursor-pointer hover:stroke-blue-400"
                onClick={() => handleConnectionClick(connection)}
              />
              {/* Connection arrowhead */}
              <defs>
                <marker
                  id={`arrowhead-${connection.id}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill={selectedConnection?.id === connection.id ? '#3b82f6' : '#6b7280'}
                  />
                </marker>
              </defs>
            </g>
          ))}
        </svg>

        {/* Workflow Nodes */}
        {workflow.nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const style = getNodeStyle(node, isSelected);

          return (
            <div
              key={node.id}
              className={`absolute w-48 bg-white border-2 rounded-lg shadow-lg cursor-pointer select-none ${style.borderColor} ${
                isSelected ? 'ring-2 ring-blue-200' : ''
              }`}
              style={style}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
            >
              {/* Node Header */}
              <div className="p-3 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      node.type === 'trigger' ? 'bg-green-500' :
                      node.type === 'condition' ? 'bg-yellow-500' :
                      node.type === 'action' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="font-medium text-sm">{node.name}</span>
                  </div>
                  {!node.enabled && (
                    <div className="text-xs text-gray-400">Disabled</div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1 capitalize">{node.type}</div>
              </div>

              {/* Node Content */}
              <div className="p-3">
                <div className="text-xs text-gray-600">
                  {node.description || `${node.type} node`}
                </div>
              </div>

              {/* Input Ports */}
              {node.inputs.map((port) => (
                <div
                  key={port.id}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-pointer hover:bg-blue-600"
                  onClick={(e) => handlePortClick(e, node.id, port.id, 'input')}
                  title={port.name}
                />
              ))}

              {/* Output Ports */}
              {node.outputs.map((port, index) => (
                <div
                  key={port.id}
                  className="absolute right-0 bg-green-500 border-2 border-white rounded-full cursor-pointer hover:bg-green-600"
                  style={{
                    top: `${30 + index * 25}%`,
                    transform: 'translateX(50%)',
                    width: '16px',
                    height: '16px'
                  }}
                  onClick={(e) => handlePortClick(e, node.id, port.id, 'output')}
                  title={port.name}
                />
              ))}
            </div>
          );
        })}

        {/* Temporary Connection Line */}
        {dragState.connectionStart && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
            <line
              x1={0}
              y1={0}
              x2={dragState.dragCurrentPos.x}
              y2={dragState.dragCurrentPos.y}
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
          </svg>
        )}
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded text-xs text-gray-600">
        Zoom: {Math.round(canvasState.zoom * 100)}% | 
        Nodes: {workflow.nodes.length} | 
        Connections: {workflow.connections.length}
      </div>
    </div>
  );
});

WorkflowCanvas.displayName = 'WorkflowCanvas';

export default WorkflowCanvas;