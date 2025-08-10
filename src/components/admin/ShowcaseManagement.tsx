import { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Star,
  Search,
  Settings,
  Users,
  DollarSign,
  Play,
  AlertCircle,
  CheckCircle,
  Tag
} from 'lucide-react';
import { ShowcaseService } from '../../lib/showcaseService';
import { Capability, CapabilityCategory } from '../../types/capabilities';

interface ShowcaseManagementProps {
  onNavigate?: (section: string) => void;
}

export default function ShowcaseManagement(_props: ShowcaseManagementProps) {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CapabilityCategory | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories: Array<{ id: CapabilityCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'ai', label: 'AI & Machine Learning' },
    { id: 'analysis', label: 'Analysis Tools' },
    { id: 'visualization', label: 'Data Visualization' },
    { id: 'search', label: 'Search & Discovery' },
    { id: 'automation', label: 'Automation' },
    { id: 'collaboration', label: 'Collaboration' }
  ];

  useEffect(() => {
    loadCapabilities();
  }, [selectedCategory, searchQuery]);

  const loadCapabilities = async () => {
    setLoading(true);
    try {
      const data = await ShowcaseService.getCapabilities(selectedCategory, searchQuery);
      setCapabilities(data);
    } catch (error) {
      console.error('Error loading capabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (capabilityId: string, currentStatus: boolean) => {
    // In a real implementation, you would update the capability's published status
    console.log('Toggle published status for capability:', capabilityId, !currentStatus);
    // Reload capabilities after update
    await loadCapabilities();
  };

  const handleDeleteCapability = async (capabilityId: string) => {
    if (confirm('Are you sure you want to delete this capability? This action cannot be undone.')) {
      // In a real implementation, you would delete the capability
      console.log('Delete capability:', capabilityId);
      // Reload capabilities after deletion
      await loadCapabilities();
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Showcase Management</h1>
            </div>
            <p className="text-lg text-gray-600">
              Manage capabilities, providers, and marketplace content
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Capability
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-w-48"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capabilities</p>
                <p className="text-2xl font-bold text-gray-900">{capabilities.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Providers</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Runs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {capabilities.reduce((sum, cap) => sum + cap.totalRuns, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {capabilities.length > 0 
                    ? (capabilities.reduce((sum, cap) => sum + cap.userRating, 0) / capabilities.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading capabilities...</p>
          </div>
        ) : capabilities.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No capabilities found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search terms or filters'
                : 'Get started by adding your first capability to the showcase'
              }
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add First Capability
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {capabilities.map((capability) => (
                    <tr key={capability.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {capability.type === 'ai-agent' && <Settings className="w-5 h-5 text-gray-600" />}
                            {capability.type === 'tool' && <Settings className="w-5 h-5 text-gray-600" />}
                            {capability.type === 'dashboard' && <Settings className="w-5 h-5 text-gray-600" />}
                          </div>
                          <div className="ml-3 min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {capability.name}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {capability.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {capability.tags.slice(0, 3).map((tag) => (
                                <span 
                                  key={tag}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {capability.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{capability.providerName}</div>
                          <div className="text-gray-500">{capability.providerCompany}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {capability.price.amount === 0 ? 'Free' : `$${capability.price.amount}`}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{capability.price.billingType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{capability.userRating}</span>
                            <span className="text-gray-500 ml-1">({capability.totalReviews})</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Play className="w-4 h-4 mr-1" />
                            <span>{capability.totalRuns} runs</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* Published status would come from database */}
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-800">Published</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => console.log('Edit capability:', capability.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="Edit capability"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTogglePublished(capability.id, true)}
                            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                            title="Toggle visibility"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCapability(capability.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Delete capability"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add New Capability</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">
                  The capability creation form will be implemented next. For now, you can add capabilities 
                  directly to the database using the Supabase dashboard or SQL scripts.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}