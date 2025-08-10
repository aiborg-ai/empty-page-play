import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Bot, 
  Wrench, 
  FileText, 
  Layout,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  Users,
  Tag,
  Calendar,
  Activity,
  Globe,
  Lock,
  Shield
} from 'lucide-react';
import { DashboardService } from '../lib/dashboardService';
import type { 
  Dashboard, 
  AIAgent, 
  Tool, 
  Dataset, 
  Report,
  CreateDashboardData
} from '../types/cms';
import { InstantUser } from '../lib/instantAuth';

interface CMSStudioProps {
  currentUser: InstantUser;
  projectId?: string;
}

type AssetType = 'dashboards' | 'ai_agents' | 'tools' | 'datasets' | 'reports';

const CMSStudio: React.FC<CMSStudioProps> = ({ currentUser, projectId }) => {
  const [activeTab, setActiveTab] = useState<AssetType>('dashboards');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Asset data
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [aiAgents, setAIAgents] = useState<AIAgent[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  
  const dashboardService = DashboardService.getInstance();

  const assetTypes = [
    { id: 'dashboards', label: 'Dashboards', icon: Layout, count: dashboards.length },
    { id: 'ai_agents', label: 'AI Agents', icon: Bot, count: aiAgents.length },
    { id: 'tools', label: 'Tools', icon: Wrench, count: tools.length },
    { id: 'datasets', label: 'Datasets', icon: Database, count: datasets.length },
    { id: 'reports', label: 'Reports', icon: FileText, count: reports.length },
  ] as const;

  useEffect(() => {
    loadAssets();
  }, [activeTab, projectId]);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'dashboards':
          const { data: dashboardData } = await dashboardService.getUserDashboards();
          setDashboards(dashboardData || []);
          break;
        case 'ai_agents':
          // TODO: Implement AI agents service once tables are created
          setAIAgents([]);
          break;
        case 'tools':
          // TODO: Implement tools service once tables are created
          setTools([]);
          break;
        case 'datasets':
          // TODO: Implement datasets service once tables are created
          setDatasets([]);
          break;
        case 'reports':
          // TODO: Implement reports service once tables are created
          setReports([]);
          break;
      }
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentAssets = () => {
    switch (activeTab) {
      case 'dashboards': return dashboards;
      case 'ai_agents': return aiAgents;
      case 'tools': return tools;
      case 'datasets': return datasets;
      case 'reports': return reports;
      default: return [];
    }
  };

  const filteredAssets = getCurrentAssets().filter(asset => {
    const hasName = 'name' in asset && asset.name;
    const hasDescription = 'description' in asset && asset.description;
    return (
      (hasName && (asset as any).name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (hasDescription && (asset as any).description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const getAccessLevelIcon = (accessLevel?: string) => {
    switch (accessLevel) {
      case 'public': return <Globe className="w-4 h-4 text-green-600" />;
      case 'organization': return <Users className="w-4 h-4 text-blue-600" />;
      case 'team': return <Shield className="w-4 h-4 text-orange-600" />;
      default: return <Lock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'template': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CreateAssetModal = () => {
    const [formData, setFormData] = useState<any>({});

    const handleCreate = async () => {
      try {
        setIsLoading(true);
        const assetData = {
          ...formData,
          project_id: projectId,
        };

        switch (activeTab) {
          case 'dashboards':
            await dashboardService.createDashboard(assetData as CreateDashboardData);
            break;
          case 'ai_agents':
            // TODO: Implement AI agents creation once service is available
            console.log('AI Agents creation not yet implemented');
            break;
          case 'tools':
            // TODO: Implement tools creation once service is available
            console.log('Tools creation not yet implemented');
            break;
          case 'datasets':
            // TODO: Implement datasets creation once service is available
            console.log('Datasets creation not yet implemented');
            break;
          case 'reports':
            // TODO: Implement reports creation once service is available
            console.log('Reports creation not yet implemented');
            break;
        }

        setShowCreateModal(false);
        setFormData({});
        loadAssets();
      } catch (error) {
        console.error('Error creating asset:', error);
        alert('Error creating asset: ' + error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Create New {assetTypes.find(t => t.id === activeTab)?.label}</h2>
            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter description..."
              />
            </div>

            {activeTab === 'dashboards' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type || 'custom'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="custom">Custom</option>
                    <option value="analytics">Analytics</option>
                    <option value="reporting">Reporting</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="kpi">KPI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                  <select
                    value={formData.access_level || 'private'}
                    onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="private">Private</option>
                    <option value="team">Team</option>
                    <option value="organization">Organization</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'ai_agents' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="research, analysis, synthesis..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="gpt-4, claude-3, gemini-pro..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="NLP, Computer Vision, Analytics..."
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_public || false}
                      onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                      className="mr-2"
                    />
                    Make Public
                  </label>
                </div>
              </>
            )}

            {activeTab === 'tools' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="analysis, visualization, export..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Data Processing, Visualization, API..."
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_public || false}
                      onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                      className="mr-2"
                    />
                    Make Public
                  </label>
                </div>
              </>
            )}

            {activeTab === 'datasets' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="patent, research, analysis..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select
                    value={formData.format || 'csv'}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="xml">XML</option>
                    <option value="sql">SQL</option>
                    <option value="xlsx">Excel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                  <select
                    value={formData.access_level || 'private'}
                    onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="private">Private</option>
                    <option value="team">Team</option>
                    <option value="organization">Organization</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'reports' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="patent_analysis, market_research..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                  <select
                    value={formData.access_level || 'private'}
                    onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="private">Private</option>
                    <option value="team">Team</option>
                    <option value="organization">Organization</option>
                    <option value="public">Public</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_template || false}
                      onChange={(e) => setFormData({ ...formData, is_template: e.target.checked })}
                      className="mr-2"
                    />
                    Save as Template
                  </label>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="tag1, tag2, tag3..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!formData.name || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AssetCard = ({ asset }: { asset: any }) => {
    const [showActions, setShowActions] = useState(false);

    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-900">{asset.name}</h3>
              {asset.access_level && getAccessLevelIcon(asset.access_level)}
              {asset.is_public && <Globe className="w-4 h-4 text-green-600" />}
            </div>
            
            {'description' in asset && asset.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{asset.description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500">
              {asset.status && (
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(asset.status)}`}>
                  {asset.status}
                </span>
              )}
              
              {asset.type && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{asset.type}</span>
                </div>
              )}
              
              {asset.category && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{asset.category}</span>
                </div>
              )}
              
              {asset.usage_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  <span>{asset.usage_count} uses</span>
                </div>
              )}
              
              {asset.view_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{asset.view_count} views</span>
                </div>
              )}
            </div>

            {asset.tags && asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {asset.tags.slice(0, 3).map((tag: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
                {asset.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{asset.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {showActions && (
            <div className="flex items-center gap-1 ml-2">
              <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {currentUser.firstName?.[0] || currentUser.email?.[0] || '?'}
                </span>
              </div>
              <span>
                {currentUser.displayName}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(asset.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CMS Studio</h1>
            <p className="text-sm text-gray-600">
              Manage your AI agents, tools, datasets, reports, and dashboards
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
          </div>
        </div>

        {/* Asset Type Tabs */}
        <div className="flex items-center gap-1 mt-4">
          {assetTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === type.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <type.icon className="w-4 h-4" />
              <span>{type.label}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeTab === type.id 
                  ? 'bg-blue-200 text-blue-800' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {type.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {React.createElement(assetTypes.find(t => t.id === activeTab)?.icon || Layout, {
                className: "w-8 h-8 text-gray-400"
              })}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {assetTypes.find(t => t.id === activeTab)?.label} Found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No ${assetTypes.find(t => t.id === activeTab)?.label.toLowerCase()} match your search.`
                : `Get started by creating your first ${assetTypes.find(t => t.id === activeTab)?.label.toLowerCase().slice(0, -1)}.`
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create New {assetTypes.find(t => t.id === activeTab)?.label.slice(0, -1)}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>

      {/* Create Asset Modal */}
      {showCreateModal && <CreateAssetModal />}
    </div>
  );
};

export default CMSStudio;