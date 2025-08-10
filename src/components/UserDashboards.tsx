import { useState, useMemo } from 'react';
import { 
  BarChart3,
  Search,
  Filter,
  Share2,
  Plus,
  MoreHorizontal,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Copy,
  FileText,
  TrendingUp,
  Users,
  Scale,
  Hash,
  MapPin,
  BookOpen,
  X,
  Activity,
  Target,
  Sparkles
} from 'lucide-react';

interface UserDashboard {
  id: string;
  title: string;
  description: string;
  type: 'patents' | 'citations' | 'inventors' | 'applicants' | 'owners' | 'legal' | 'jurisdictions' | 'biologicals' | 'classifications' | 'custom';
  visualizationType: 'bar' | 'scatter' | 'line' | 'horizontal_bar';
  createdDate: string;
  lastModified: string;
  creator: string;
  isShared: boolean;
  chartCount: number;
  dataCount: number;
}

interface CreateDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dashboard: Omit<UserDashboard, 'id' | 'createdDate' | 'lastModified'>) => void;
}

interface ShareDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboard: UserDashboard | null;
}

const CreateDashboardModal = ({ isOpen, onClose, onSave }: CreateDashboardModalProps) => {
  const [step, setStep] = useState<'type' | 'visualization'>('type');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedVisualization, setSelectedVisualization] = useState<string>('');
  const [dashboardTitle, setDashboardTitle] = useState('');

  const analysisTypes = [
    { id: 'patents', label: 'Patents', icon: FileText, description: 'Analyze patent documents' },
    { id: 'citations', label: 'Citations', icon: BookOpen, description: 'Citation analysis' },
    { id: 'inventors', label: 'Inventors', icon: Users, description: 'Inventor analysis' },
    { id: 'applicants', label: 'Applicants', icon: User, description: 'Applicant analysis' },
    { id: 'owners', label: 'Owners', icon: Users, description: 'Owner analysis' },
    { id: 'legal', label: 'Legal', icon: Scale, description: 'Legal status analysis' },
    { id: 'jurisdictions', label: 'Jurisdictions', icon: MapPin, description: 'Geographic analysis' },
    { id: 'biologicals', label: 'Biologicals', icon: Activity, description: 'Biological sequence analysis' },
    { id: 'classifications', label: 'Classifications', icon: Hash, description: 'Classification analysis' },
    { id: 'custom', label: 'Custom', icon: Target, description: 'Custom analysis' }
  ];

  const visualizationTypes = [
    { 
      id: 'horizontal_bar', 
      label: 'Most cited by Patents', 
      icon: BarChart3, 
      preview: '📊',
      description: 'Horizontal bar chart showing most cited patents'
    },
    { 
      id: 'scatter', 
      label: 'Most cited by Patents Scatter Plot', 
      icon: TrendingUp, 
      preview: '📈',
      description: 'Scatter plot visualization'
    },
    { 
      id: 'line', 
      label: 'Patent Citations over Time', 
      icon: Activity, 
      preview: '📉',
      description: 'Time series line chart'
    },
    { 
      id: 'bar', 
      label: 'Most Cited Inventors', 
      icon: Users, 
      preview: '📊',
      description: 'Bar chart for inventor analysis'
    }
  ];

  const handleSave = () => {
    if (selectedType && selectedVisualization && dashboardTitle.trim()) {
      onSave({
        title: dashboardTitle,
        description: `${selectedType} analysis dashboard`,
        type: selectedType as any,
        visualizationType: selectedVisualization as any,
        creator: 'Current User',
        isShared: false,
        chartCount: 1,
        dataCount: Math.floor(Math.random() * 10000)
      });
      onClose();
      setStep('type');
      setSelectedType('');
      setSelectedVisualization('');
      setDashboardTitle('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">
              Step {step === 'type' ? '1' : '2'}: {step === 'type' ? 'What would you like to analyse?' : 'Choose a visualisation'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'type' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
                {analysisTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">{type.label}</h3>
                        <p className="text-xs text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedType && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dashboard Name
                  </label>
                  <input
                    type="text"
                    value={dashboardTitle}
                    onChange={(e) => setDashboardTitle(e.target.value)}
                    placeholder={`${analysisTypes.find(t => t.id === selectedType)?.label} Analysis`}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <div></div>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep('visualization')}
                    disabled={!selectedType || !dashboardTitle.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Choose Visualization
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'visualization' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {visualizationTypes.map((viz) => {
                      return (
                    <div
                      key={viz.id}
                      onClick={() => setSelectedVisualization(viz.id)}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedVisualization === viz.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-12 bg-gray-100 rounded mb-4 flex items-center justify-center">
                          <span className="text-2xl">{viz.preview}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2 text-sm">{viz.label}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button
                  onClick={() => setStep('type')}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Back
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!selectedVisualization}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ShareDashboardModal = ({ isOpen, onClose, dashboard }: ShareDashboardModalProps) => {
  if (!isOpen || !dashboard) return null;

  const shareUrl = `${window.location.origin}/dashboards/${dashboard.id}`;

  const handleShare = (platform: string) => {
    let url = '';
    const text = `Check out my dashboard: ${dashboard.title}`;
    
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(dashboard.title)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`;
        break;
      default:
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        return;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Share Dashboard</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{dashboard.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{dashboard.description}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleShare('copy')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Copy className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Copy Link</span>
            </button>

            <button
              onClick={() => handleShare('email')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs font-bold">@</span>
              </div>
              <span className="text-sm font-medium">Share via Email</span>
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">W</span>
              </div>
              <span className="text-sm font-medium">Share on WhatsApp</span>
            </button>

            <button
              onClick={() => handleShare('linkedin')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">in</span>
              </div>
              <span className="text-sm font-medium">Share on LinkedIn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UserDashboards() {
  const [dashboards, setDashboards] = useState<UserDashboard[]>([
    {
      id: '1',
      title: 'Patent Analysis',
      description: 'Patents analysis dashboard',
      type: 'patents',
      visualizationType: 'bar',
      createdDate: '2025-08-08',
      lastModified: '2025-08-08',
      creator: 'Hirendra Vikram',
      isShared: false,
      chartCount: 3,
      dataCount: 165281274
    },
    {
      id: '2',
      title: 'Citation Analysis',
      description: 'Citations analysis dashboard',
      type: 'citations',
      visualizationType: 'scatter',
      createdDate: '2025-08-07',
      lastModified: '2025-08-08',
      creator: 'Hirendra Vikram',
      isShared: true,
      chartCount: 2,
      dataCount: 482259938
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'shared' | 'private'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<UserDashboard | null>(null);

  const filteredDashboards = useMemo(() => {
    return dashboards.filter(dashboard => {
      const matchesSearch = dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dashboard.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'shared' && dashboard.isShared) ||
                           (filterType === 'private' && !dashboard.isShared);
      return matchesSearch && matchesFilter;
    });
  }, [dashboards, searchQuery, filterType]);

  const handleCreateDashboard = (newDashboard: Omit<UserDashboard, 'id' | 'createdDate' | 'lastModified'>) => {
    const dashboard: UserDashboard = {
      ...newDashboard,
      id: (dashboards.length + 1).toString(),
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    setDashboards([...dashboards, dashboard]);
  };

  const handleShare = (dashboard: UserDashboard) => {
    setSelectedDashboard(dashboard);
    setShowShareModal(true);
  };

  const handleDelete = (dashboardId: string) => {
    if (confirm('Are you sure you want to delete this dashboard?')) {
      setDashboards(dashboards.filter(d => d.id !== dashboardId));
    }
  };

  const handleGenerateAISummary = (dashboard: UserDashboard) => {
    console.log('Generating AI summary for dashboard:', dashboard.title);
    // Implement OpenRouter API integration
    alert(`Generating AI summary for dashboard "${dashboard.title}"...`);
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      patents: FileText,
      citations: BookOpen,
      inventors: Users,
      applicants: User,
      owners: Users,
      legal: Scale,
      jurisdictions: MapPin,
      biologicals: Activity,
      classifications: Hash,
      custom: Target
    };
    const IconComponent = icons[type] || BarChart3;
    return <IconComponent className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Analysis Dashboards</h1>
            <div className="text-sm text-gray-500">
              Our suite of analysis and visualisation tools enable real-time discovery and analysis. Dashboards can be saved, presented and shared via LinkedIn, Twitter, Facebook or email.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <Plus className="w-4 h-4" />
              New Patent Dashboard
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              New Scholar Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Dashboards</option>
            <option value="shared">Shared Only</option>
            <option value="private">Private Only</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredDashboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterType !== 'all' ? 'No dashboards found' : 'No dashboards yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search terms or filters'
                : 'Create your first analysis dashboard to get started with data visualization and insights.'
              }
            </p>
            {!searchQuery && filterType === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Create Dashboard
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDashboards.map((dashboard) => (
                <div key={dashboard.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(dashboard.type)}
                        <h3 className="font-medium text-gray-900">{dashboard.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {dashboard.isShared && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" title="Shared" />
                        )}
                        <button
                          onClick={() => handleGenerateAISummary(dashboard)}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Generate AI Summary"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShare(dashboard)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <div className="relative group">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                              <Copy className="w-3 h-3" />
                              Duplicate
                            </button>
                            <button 
                              onClick={() => handleDelete(dashboard.id)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {dashboard.description}
                    </p>
                    
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-3 h-3" />
                        <span>{dashboard.chartCount} charts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        <span>{dashboard.dataCount.toLocaleString()} data points</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>Modified: {dashboard.lastModified}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>Created by: {dashboard.creator}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        dashboard.isShared 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {dashboard.isShared ? 'Shared' : 'Private'}
                      </span>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateDashboardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateDashboard}
      />

      <ShareDashboardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        dashboard={selectedDashboard}
      />
    </div>
  );
}