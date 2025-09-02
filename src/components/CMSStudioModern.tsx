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
  Share2,
  Users,
  Activity,
  Globe,
  Lock,
  Shield,
  Sparkles,
  Download,
  Plug2,
  X,
  Briefcase,
  TrendingUp,
  Clock,
  Grid,
  List,
  ChevronRight
} from 'lucide-react';
import { DashboardService } from '../lib/dashboardService';
import { CapabilityDownloadService, DownloadsByCategory } from '../lib/capabilityDownloadService';
import type { 
  Dashboard, 
  AIAgent, 
  Tool, 
  Dataset, 
  Report
} from '../types/cms';
import { InstantUser } from '../lib/instantAuth';
import AIDashboardModal from './modals/AIDashboardModal';
import VoiceSearchButton from './VoiceSearchButton';
import HelpIcon from './utils/HelpIcon';
import SearchFilterBar from './common/SearchFilterBar';

interface CMSStudioModernProps {
  currentUser: InstantUser;
  projectId?: string;
}

type AssetType = 'all' | 'dashboards' | 'ai_agents' | 'tools' | 'datasets' | 'mcp' | 'reports' | 'downloaded';

type ViewMode = 'grid' | 'list';

const ASSET_CATEGORIES = {
  'all': { icon: Briefcase, color: 'gray', bgGradient: 'from-gray-600 to-gray-700' },
  'dashboards': { icon: Layout, color: 'blue', bgGradient: 'from-blue-600 to-cyan-600' },
  'ai_agents': { icon: Bot, color: 'purple', bgGradient: 'from-purple-600 to-pink-600' },
  'tools': { icon: Wrench, color: 'orange', bgGradient: 'from-orange-600 to-red-600' },
  'datasets': { icon: Database, color: 'green', bgGradient: 'from-green-600 to-emerald-600' },
  'mcp': { icon: Plug2, color: 'teal', bgGradient: 'from-teal-600 to-cyan-600' },
  'reports': { icon: FileText, color: 'indigo', bgGradient: 'from-indigo-600 to-purple-600' },
  'downloaded': { icon: Download, color: 'yellow', bgGradient: 'from-yellow-600 to-orange-600' }
};

const CMSStudioModern: React.FC<CMSStudioModernProps> = ({ currentUser, projectId }) => {
  const [activeCategory, setActiveCategory] = useState<AssetType>('all');
  const [selectedType, setSelectedType] = useState<AssetType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setShowCreateModal] = useState(false);
  const [showAIDashboardModal, setShowAIDashboardModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'popular'>('recent');
  
  // Asset data
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [aiAgents, setAIAgents] = useState<AIAgent[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [mcpIntegrations, setMcpIntegrations] = useState<any[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [downloadedCapabilities, setDownloadedCapabilities] = useState<DownloadsByCategory[]>([]);
  
  const dashboardService = DashboardService.getInstance();

  const totalDownloadedCount = downloadedCapabilities.reduce((sum, category) => sum + category.downloadCount, 0);

  const assetCounts = {
    'all': dashboards.length + aiAgents.length + tools.length + datasets.length + mcpIntegrations.length + reports.length + totalDownloadedCount,
    'dashboards': dashboards.length,
    'ai_agents': aiAgents.length,
    'tools': tools.length,
    'datasets': datasets.length,
    'mcp': mcpIntegrations.length,
    'reports': reports.length,
    'downloaded': totalDownloadedCount
  };

  const categories = [
    { id: 'all', label: 'All Assets', count: assetCounts.all },
    { id: 'dashboards', label: 'Dashboards', count: assetCounts.dashboards },
    { id: 'ai_agents', label: 'AI Agents', count: assetCounts.ai_agents },
    { id: 'tools', label: 'Tools', count: assetCounts.tools },
    { id: 'datasets', label: 'Datasets', count: assetCounts.datasets },
    { id: 'mcp', label: 'MCP', count: assetCounts.mcp },
    { id: 'reports', label: 'Reports', count: assetCounts.reports },
    { id: 'downloaded', label: 'Downloaded', count: assetCounts.downloaded }
  ];

  useEffect(() => {
    loadAssets();
  }, [projectId]);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      // Load all asset types
      const { data: dashboardData } = await dashboardService.getUserDashboards();
      setDashboards(dashboardData || []);
      
      // TODO: Load other asset types when services are implemented
      setAIAgents([]);
      setTools([]);
      setDatasets([]);
      setMcpIntegrations([]);
      setReports([]);
      
      const downloadedData = await CapabilityDownloadService.getUserDownloadsByCategory();
      setDownloadedCapabilities(downloadedData);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllAssets = () => {
    const allAssets: any[] = [];
    
    if (activeCategory === 'all' || activeCategory === 'dashboards') {
      dashboards.forEach(d => allAssets.push({ ...d, assetType: 'dashboard' }));
    }
    if (activeCategory === 'all' || activeCategory === 'ai_agents') {
      aiAgents.forEach(a => allAssets.push({ ...a, assetType: 'ai_agent' }));
    }
    if (activeCategory === 'all' || activeCategory === 'tools') {
      tools.forEach(t => allAssets.push({ ...t, assetType: 'tool' }));
    }
    if (activeCategory === 'all' || activeCategory === 'datasets') {
      datasets.forEach(d => allAssets.push({ ...d, assetType: 'dataset' }));
    }
    if (activeCategory === 'all' || activeCategory === 'mcp') {
      mcpIntegrations.forEach(m => allAssets.push({ ...m, assetType: 'mcp' }));
    }
    if (activeCategory === 'all' || activeCategory === 'reports') {
      reports.forEach(r => allAssets.push({ ...r, assetType: 'report' }));
    }
    
    return allAssets;
  };

  const filteredAssets = getAllAssets().filter(asset => {
    const hasName = 'name' in asset && asset.name;
    const hasDescription = 'description' in asset && asset.description;
    return (
      (hasName && asset.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (hasDescription && asset.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'popular':
        return (b.metrics?.views || 0) - (a.metrics?.views || 0);
      default: // recent
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'dashboard': return Layout;
      case 'ai_agent': return Bot;
      case 'tool': return Wrench;
      case 'dataset': return Database;
      case 'mcp': return Plug2;
      case 'report': return FileText;
      default: return Briefcase;
    }
  };

  const getAssetColor = (type: string) => {
    switch (type) {
      case 'dashboard': return 'blue';
      case 'ai_agent': return 'purple';
      case 'tool': return 'orange';
      case 'dataset': return 'green';
      case 'mcp': return 'teal';
      case 'report': return 'indigo';
      default: return 'gray';
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      teal: 'bg-teal-100 text-teal-600 border-teal-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      gray: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getAccessLevelIcon = (accessLevel?: string) => {
    switch (accessLevel) {
      case 'public': return <Globe className="w-4 h-4 text-green-600" />;
      case 'organization': return <Users className="w-4 h-4 text-blue-600" />;
      case 'team': return <Shield className="w-4 h-4 text-orange-600" />;
      default: return <Lock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                Studio
                <HelpIcon section="studio" onNavigate={undefined} className="text-white/80 hover:text-white hover:bg-white/20" />
              </h1>
              <p className="text-indigo-100 text-lg">
                Create and manage your innovation assets
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span className="text-sm">{assetCounts.all} Total Assets</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm">Active Workspace</span>
                </div>
                {projectId && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Space Assets</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <SearchFilterBar
          placeholder="Search assets by name, type, or tags..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={[
            { value: 'all', label: 'All Assets', count: assetCounts.all },
            { value: 'dashboards', label: 'Dashboards', count: assetCounts.dashboards },
            { value: 'ai_agents', label: 'AI Agents', count: assetCounts.ai_agents },
            { value: 'tools', label: 'Tools', count: assetCounts.tools },
            { value: 'datasets', label: 'Datasets', count: assetCounts.datasets },
            { value: 'mcp', label: 'MCP', count: assetCounts.mcp },
            { value: 'reports', label: 'Reports', count: assetCounts.reports },
            { value: 'downloaded', label: 'Downloaded', count: assetCounts.downloaded }
          ]}
          selectedCategory={selectedType}
          setSelectedCategory={(value) => setSelectedType(value as AssetType)}
          sortOptions={[
            { value: 'recent', label: 'Most Recent' },
            { value: 'name', label: 'Name (A-Z)' },
            { value: 'updated', label: 'Last Updated' }
          ]}
          className="mb-6"
          // Additional required props
          selectedSort="recent"
          setSelectedSort={() => {}}
          activeFilters={{}}
          isExpanded={false}
          activeFilterCount={0}
          setActiveFilter={() => {}}
          toggleQuickFilter={() => {}}
          clearAllFilters={() => {}}
          setExpanded={() => {}}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar with Categories and Search */}
          <div className="xl:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Search Assets</h3>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <VoiceSearchButton
                    onTranscription={(text) => setSearchQuery(text)}
                    onInterimTranscription={(text) => setSearchQuery(text)}
                    className="!p-1.5"
                    placeholder="Say the asset name you're looking for..."
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = ASSET_CATEGORIES[category.id as keyof typeof ASSET_CATEGORIES]?.icon || Briefcase;
                  const isSelected = activeCategory === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id as AssetType)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-blue-100 text-blue-700 shadow-sm'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                          <span className="text-sm font-medium">{category.label}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {category.count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Create New Asset</span>
                </button>
                <button
                  onClick={() => setShowAIDashboardModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Dashboard</span>
                </button>
              </div>
            </div>

            {/* Stats Widget */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Studio Insights</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Most Active</span>
                  <span className="text-blue-600 font-medium">Dashboards</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New This Week</span>
                  <span className="text-green-600 font-medium">+12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shared Assets</span>
                  <span className="text-purple-600 font-medium">34</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3">
            {/* Sort and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'recent', label: 'Most Recent' },
                      { id: 'name', label: 'Name' },
                      { id: 'popular', label: 'Most Popular' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id as any)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          sortBy === option.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredAssets.length} {filteredAssets.length === 1 ? 'asset' : 'assets'} found
                </div>
              </div>
            </div>

            {/* Assets Grid/List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
                <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  {searchQuery 
                    ? `No assets match your search "${searchQuery}"`
                    : 'Get started by creating your first asset'
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create First Asset
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {sortedAssets.map((asset, index) => {
                  const AssetIcon = getAssetIcon(asset.assetType);
                  const assetColor = getAssetColor(asset.assetType);
                  
                  return viewMode === 'grid' ? (
                    // Grid View Card
                    <div
                      key={asset.id || index}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl ${getColorClasses(assetColor)}`}>
                            <AssetIcon className="w-6 h-6" />
                          </div>
                          <div className="flex items-center gap-2">
                            {getAccessLevelIcon(asset.access_level)}
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {asset.name || 'Untitled Asset'}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {asset.description || 'No description available'}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{asset.metrics?.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{asset.metrics?.shares || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(asset.created_at || new Date().toISOString())}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle view
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle share
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Share"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            asset.status === 'published' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {asset.status || 'draft'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View Card
                    <div
                      key={asset.id || index}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${getColorClasses(assetColor)}`}>
                          <AssetIcon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                {asset.name || 'Untitled Asset'}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {asset.description || 'No description available'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getAccessLevelIcon(asset.access_level)}
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 mt-3">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{asset.metrics?.views || 0} views</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{asset.metrics?.shares || 0} shares</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(asset.created_at || new Date().toISOString())}</span>
                              </div>
                            </div>
                            
                            <div className="ml-auto flex items-center gap-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                asset.status === 'published' 
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {asset.status || 'draft'}
                              </span>
                              <div className="flex items-center gap-1">
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Share2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Downloaded Capabilities Special View */}
            {activeCategory === 'downloaded' && downloadedCapabilities.length > 0 && (
              <div className="mt-6 space-y-6">
                {downloadedCapabilities.map((category) => (
                  <div key={category.category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-600" />
                      Downloaded {category.category}
                      <span className="text-sm font-normal text-gray-500">({category.downloadCount} items)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.capabilities.map((capability) => (
                        <div key={capability.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-1">{capability.name}</h4>
                          <p className="text-xs text-gray-500">
                            Downloaded {formatDate(capability.downloadedAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAIDashboardModal && (
        <AIDashboardModal
          isOpen={showAIDashboardModal}
          onClose={() => setShowAIDashboardModal(false)}
          onDashboardCreated={async (dashboardId) => {
            console.log('AI Dashboard created:', dashboardId);
            setShowAIDashboardModal(false);
            await loadAssets();
          }}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default CMSStudioModern;