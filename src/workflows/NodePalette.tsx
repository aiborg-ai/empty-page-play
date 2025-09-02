// Node Palette Component - Provides draggable workflow node types
// Users can drag nodes from here to the canvas to build workflows

import React, { useState } from 'react';
import { 
  Play, 
  GitBranch, 
  Zap, 
  Clock, 
  Mail, 
  Database, 
  FileText, 
  AlertTriangle,
  Webhook,
  Filter,
  Shuffle,
  Timer,
  MessageSquare,
  Send,
  Save,
  Search,
  Code,
  Globe
} from 'lucide-react';

interface NodeType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  category: 'triggers' | 'conditions' | 'actions' | 'utilities' | 'integrations';
  color: string;
}

interface NodePaletteProps {
  onAddNode: (nodeType: string, position: { x: number; y: number }) => void;
}

const NODE_TYPES: NodeType[] = [
  // Triggers
  {
    id: 'manual_trigger',
    name: 'Manual Trigger',
    description: 'Start workflow manually',
    icon: Play,
    category: 'triggers',
    color: 'bg-green-100 border-green-300 text-green-700'
  },
  {
    id: 'schedule_trigger',
    name: 'Schedule Trigger',
    description: 'Start workflow on schedule',
    icon: Clock,
    category: 'triggers',
    color: 'bg-green-100 border-green-300 text-green-700'
  },
  {
    id: 'webhook_trigger',
    name: 'Webhook Trigger',
    description: 'Start workflow via webhook',
    icon: Webhook,
    category: 'triggers',
    color: 'bg-green-100 border-green-300 text-green-700'
  },
  {
    id: 'event_trigger',
    name: 'Event Trigger',
    description: 'Start workflow on system event',
    icon: Zap,
    category: 'triggers',
    color: 'bg-green-100 border-green-300 text-green-700'
  },

  // Conditions
  {
    id: 'if_condition',
    name: 'If Condition',
    description: 'Branch based on condition',
    icon: GitBranch,
    category: 'conditions',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700'
  },
  {
    id: 'filter_condition',
    name: 'Filter',
    description: 'Filter data based on criteria',
    icon: Filter,
    category: 'conditions',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700'
  },
  {
    id: 'switch_condition',
    name: 'Switch',
    description: 'Multi-way branch condition',
    icon: Shuffle,
    category: 'conditions',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700'
  },

  // Actions
  {
    id: 'send_email',
    name: 'Send Email',
    description: 'Send email notification',
    icon: Mail,
    category: 'actions',
    color: 'bg-blue-100 border-blue-300 text-blue-700'
  },
  {
    id: 'create_alert',
    name: 'Create Alert',
    description: 'Create system alert',
    icon: AlertTriangle,
    category: 'actions',
    color: 'bg-blue-100 border-blue-300 text-blue-700'
  },
  {
    id: 'update_database',
    name: 'Update Database',
    description: 'Update database records',
    icon: Database,
    category: 'actions',
    color: 'bg-blue-100 border-blue-300 text-blue-700'
  },
  {
    id: 'generate_report',
    name: 'Generate Report',
    description: 'Generate and send report',
    icon: FileText,
    category: 'actions',
    color: 'bg-blue-100 border-blue-300 text-blue-700'
  },
  {
    id: 'call_webhook',
    name: 'Call Webhook',
    description: 'Make HTTP request',
    icon: Send,
    category: 'actions',
    color: 'bg-blue-100 border-blue-300 text-blue-700'
  },
  {
    id: 'send_notification',
    name: 'Send Notification',
    description: 'Send push notification',
    icon: MessageSquare,
    category: 'actions',
    color: 'bg-blue-100 border-blue-300 text-blue-700'
  },

  // Utilities
  {
    id: 'delay',
    name: 'Delay',
    description: 'Wait for specified time',
    icon: Timer,
    category: 'utilities',
    color: 'bg-gray-100 border-gray-300 text-gray-700'
  },
  {
    id: 'transform_data',
    name: 'Transform Data',
    description: 'Transform data structure',
    icon: Code,
    category: 'utilities',
    color: 'bg-gray-100 border-gray-300 text-gray-700'
  },
  {
    id: 'store_data',
    name: 'Store Data',
    description: 'Store data temporarily',
    icon: Save,
    category: 'utilities',
    color: 'bg-gray-100 border-gray-300 text-gray-700'
  },
  {
    id: 'search_patents',
    name: 'Search Patents',
    description: 'Search patent database',
    icon: Search,
    category: 'utilities',
    color: 'bg-gray-100 border-gray-300 text-gray-700'
  },

  // Integrations
  {
    id: 'patent_office_api',
    name: 'Patent Office API',
    description: 'Connect to patent office',
    icon: Globe,
    category: 'integrations',
    color: 'bg-purple-100 border-purple-300 text-purple-700'
  },
  {
    id: 'slack_integration',
    name: 'Slack',
    description: 'Send Slack messages',
    icon: MessageSquare,
    category: 'integrations',
    color: 'bg-purple-100 border-purple-300 text-purple-700'
  },
  {
    id: 'custom_script',
    name: 'Custom Script',
    description: 'Execute custom code',
    icon: Code,
    category: 'integrations',
    color: 'bg-purple-100 border-purple-300 text-purple-700'
  },
];

const CATEGORIES = [
  { id: 'triggers', name: 'Triggers', description: 'Start workflow execution' },
  { id: 'conditions', name: 'Conditions', description: 'Control workflow flow' },
  { id: 'actions', name: 'Actions', description: 'Perform operations' },
  { id: 'utilities', name: 'Utilities', description: 'Helper functions' },
  { id: 'integrations', name: 'Integrations', description: 'External services' },
] as const;

export default function NodePalette({ onAddNode }: NodePaletteProps) {
  const [activeCategory, setActiveCategory] = useState<string>('triggers');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  // Filter nodes based on category and search
  const filteredNodes = NODE_TYPES.filter(node => {
    const matchesCategory = node.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    setDraggedNode(nodeType);
    e.dataTransfer.setData('application/json', JSON.stringify({ nodeType }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedNode(null);
  };

  // Handle click to add node at center
  const handleNodeClick = (nodeType: string) => {
    // Add node at center of canvas
    onAddNode(nodeType, { x: 400, y: 300 });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Node Palette</h3>
        <p className="text-sm text-gray-500 mt-1">
          Drag nodes to canvas or click to add
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 ${
                activeCategory === category.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category Description */}
      <div className="p-3 bg-gray-50 border-b">
        <p className="text-sm text-gray-600">
          {CATEGORIES.find(c => c.id === activeCategory)?.description}
        </p>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredNodes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="mx-auto mb-2 opacity-50" size={32} />
            <p>No nodes found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNodes.map((node) => {
              const IconComponent = node.icon;
              const isDragging = draggedNode === node.id;
              
              return (
                <div
                  key={node.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleNodeClick(node.id)}
                  className={`p-3 border-2 border-dashed rounded-lg cursor-grab active:cursor-grabbing transition-all ${
                    node.color
                  } ${
                    isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{node.name}</h4>
                      <p className="text-xs opacity-75 mt-1">{node.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Usage Tips */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="font-medium mb-2">Quick Tips:</div>
          <ul className="space-y-1">
            <li>• Drag nodes to canvas</li>
            <li>• Click to add at center</li>
            <li>• Connect output → input ports</li>
            <li>• Use conditions for branching</li>
          </ul>
        </div>
      </div>
    </div>
  );
}