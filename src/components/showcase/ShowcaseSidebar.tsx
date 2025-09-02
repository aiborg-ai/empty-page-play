import { Store, Bot, Wrench, Database, FileText, BarChart3, Plug2 } from 'lucide-react';
import { CapabilityCategory } from '../../types/capabilities';
import { Project } from '../../types/cms';

interface ShowcaseSidebarProps {
  selectedCategory: CapabilityCategory | 'all';
  onCategorySelect: (category: CapabilityCategory | 'all') => void;
  totalCapabilities: number;
  userProjects: Project[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Store },
  { id: 'ai', label: 'AI Agents', icon: Bot },
  { id: 'analysis', label: 'Tools', icon: Wrench },
  { id: 'visualization', label: 'Datasets', icon: Database },
  { id: 'mcp', label: 'MCP', icon: Plug2 },
  { id: 'search', label: 'Reports', icon: FileText },
  { id: 'automation', label: 'Dashboards', icon: BarChart3 }
] as const;

export const ShowcaseSidebar = ({ 
  selectedCategory, 
  onCategorySelect, 
  totalCapabilities, 
  userProjects 
}: ShowcaseSidebarProps) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        <p className="text-sm text-gray-600">Browse by category</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">{category.label}</span>
                {category.id === 'all' && (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {totalCapabilities}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Stats */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm font-medium text-blue-900 mb-2">Marketplace Stats</div>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex items-center justify-between">
              <span>Total Capabilities:</span>
              <span className="font-medium">{totalCapabilities}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Your Projects:</span>
              <span className="font-medium">{userProjects.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Available Tools:</span>
              <span className="font-medium text-green-600">All Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};