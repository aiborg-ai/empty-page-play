import { useState, useEffect, useMemo } from 'react';
import { 
  Store, 
  Loader2,
  ChevronRight,
  Bot,
  Database,
  FileText,
  BarChart3,
  Wrench,
  Star,
  Clock,
  Shield,
  Zap,
  Download,
  DownloadCloud,
  Share2,
  Play,
  Plug2
} from 'lucide-react';
import { CapabilityCategory } from '../types/capabilities';
import { useSpaceContext } from '../hooks/useSpaceContext';
import { useShowcase } from '../hooks/useShowcase';
import { RunCapabilityModal } from './modals/RunCapabilityModal';
import { ShareCapabilityModal } from './modals/ShareCapabilityModal';
import { CapabilityDownloadService } from '../lib/capabilityDownloadService';
import { InstantAuthService } from '../lib/instantAuth';
import DownloadSystemDebug from './DownloadSystemDebug';
import CapabilityDetailView from './CapabilityDetailView';
import HelpIcon from './utils/HelpIcon';
import SearchFilterBar from './common/SearchFilterBar';
import { useShowcaseFilter } from '../hooks/useSearchFilter';
import { memoizedGenerateCategories, createFilterFunction } from '../utils/filterUtils';

interface ShowcaseProps {
  onNavigate?: (section: string) => void;
  initialCategory?: CapabilityCategory | 'all';
}

const CATEGORY_CONFIGS = {
  'all': { icon: Store, color: 'gray', bgGradient: 'from-gray-600 to-gray-700' },
  'ai': { icon: Bot, color: 'purple', bgGradient: 'from-purple-600 to-pink-600' },
  'analysis': { icon: Wrench, color: 'blue', bgGradient: 'from-blue-600 to-cyan-600' },
  'visualization': { icon: Database, color: 'green', bgGradient: 'from-green-600 to-emerald-600' },
  'search': { icon: FileText, color: 'orange', bgGradient: 'from-orange-600 to-red-600' },
  'automation': { icon: BarChart3, color: 'indigo', bgGradient: 'from-indigo-600 to-purple-600' },
  'mcp': { icon: Plug2, color: 'teal', bgGradient: 'from-teal-600 to-cyan-600' },
  'datasets': { icon: Database, color: 'yellow', bgGradient: 'from-yellow-600 to-amber-600' }
};


export default function ShowcaseModern({ initialCategory = 'all', onNavigate }: ShowcaseProps) {
  const { currentSpace: currentProject } = useSpaceContext();
  
  // Original showcase data
  const {
    selectedCapability,
    capabilities,
    userProjects,
    loading,
    showRunModal,
    showShareModal,
    handleRunCapability,
    handleShareCapability,
    handleRunRequest,
    handleShareRequest,
    closeModals
  } = useShowcase(initialCategory);

  // New unified filter hook
  const filterState = useShowcaseFilter({
    defaultCategory: initialCategory,
    onSearchChange: (query) => {
      // Update original showcase hook if needed
      console.log('Search changed:', query);
    },
    onCategoryChange: (category) => {
      console.log('Category changed:', category);
    },
    persistInUrl: true
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'detail'>('grid');
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);
  const [downloadedCapabilities, setDownloadedCapabilities] = useState<Record<string, boolean>>({});
  const [downloadingCapabilities, setDownloadingCapabilities] = useState<Record<string, boolean>>({});

  // Create filter function for capabilities
  const filterCapabilities = createFilterFunction<any>();

  // Apply filters to capabilities
  const filteredCapabilities = useMemo(() => {
    const capabilitiesAsFilterable = capabilities.map(cap => ({
      id: cap.id,
      name: cap.name,
      description: cap.description,
      category: cap.category,
      tags: cap.tags,
      createdAt: cap.metadata?.createdAt,
      updatedAt: cap.metadata?.updatedAt,
      metadata: cap.metadata
    }));
    
    const filtered = filterCapabilities(capabilitiesAsFilterable, filterState);
    
    // Map back to original capability objects
    return filtered.map(filtered => 
      capabilities.find(cap => cap.id === filtered.id)
    ).filter(Boolean);
  }, [capabilities, filterState, filterCapabilities]);

  // Load downloaded capabilities when component mounts or capabilities change
  useEffect(() => {
    const loadDownloadedCapabilities = async () => {
      if (capabilities.length > 0) {
        const capabilityIds = capabilities.map(cap => cap.id);
        const downloadedMap = await CapabilityDownloadService.areCapabilitiesDownloaded(capabilityIds);
        setDownloadedCapabilities(downloadedMap);
      }
    };

    loadDownloadedCapabilities();
  }, [capabilities]);

  // Handle capability download
  const handleDownloadCapability = async (capability: any, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const currentUser = InstantAuthService.getCurrentUser();
    if (!currentUser) {
      alert('Please log in to download capabilities.');
      return;
    }

    // Check if already downloaded
    if (downloadedCapabilities[capability.id]) {
      setDownloadingCapabilities(prev => ({ ...prev, [capability.id]: true }));
      
      const result = await CapabilityDownloadService.removeDownload(capability.id);
      
      if (result.success) {
        setDownloadedCapabilities(prev => ({ ...prev, [capability.id]: false }));
        alert('Capability removed from your downloads');
      } else {
        alert(`Failed to remove download: ${result.message}`);
      }
      
      setDownloadingCapabilities(prev => ({ ...prev, [capability.id]: false }));
    } else {
      setDownloadingCapabilities(prev => ({ ...prev, [capability.id]: true }));
      
      const result = await CapabilityDownloadService.downloadCapability(
        capability.id,
        capability.name,
        capability.type,
        capability.category
      );
      
      if (result.success) {
        setDownloadedCapabilities(prev => ({ ...prev, [capability.id]: true }));
        alert('Capability downloaded successfully! Check your Studio section.');
      } else {
        alert(`Download failed: ${result.message}`);
      }
      
      setDownloadingCapabilities(prev => ({ ...prev, [capability.id]: false }));
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      cyan: 'bg-cyan-100 text-cyan-600 border-cyan-200',
      pink: 'bg-pink-100 text-pink-600 border-pink-200',
      teal: 'bg-teal-100 text-teal-600 border-teal-200'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai-agent': return Bot;
      case 'tool': return Wrench;
      case 'dataset': return Database;
      case 'dashboard': return BarChart3;
      case 'report': return FileText;
      case 'integration': return Plug2;
      default: return Store;
    }
  };


  // filteredCapabilities is now handled by the filtering system above

  // Detail view navigation handlers
  const handleNextCapability = () => {
    if (currentDetailIndex < filteredCapabilities.length - 1) {
      setCurrentDetailIndex(currentDetailIndex + 1);
    }
  };

  const handlePreviousCapability = () => {
    if (currentDetailIndex > 0) {
      setCurrentDetailIndex(currentDetailIndex - 1);
    }
  };

  const handleCloseDetailView = () => {
    setViewMode('grid');
    setCurrentDetailIndex(0);
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                Capability Showcase
                <HelpIcon section="showcase" onNavigate={undefined} className="text-white/80 hover:text-white hover:bg-white/20" />
              </h1>
              <p className="text-blue-100 text-lg">
                Discover and deploy powerful tools to accelerate your innovation
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm">{filteredCapabilities.length} Capabilities Available</span>
                </div>
                {currentProject && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Space: {currentProject.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  <span className="text-sm">Enterprise Ready</span>
                </div>
              </div>
            </div>
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <SearchFilterBar
          placeholder="Search capabilities by name, type, or tags..."
          categories={memoizedGenerateCategories(capabilities.map(cap => ({
            id: cap.id,
            name: cap.name,
            description: cap.description,
            category: cap.category,
            tags: cap.tags
          })))}
          sortOptions={[
            { value: 'relevance', label: 'Best Match' },
            { value: 'recent', label: 'Most Recent' },
            { value: 'popular', label: 'Most Popular' },
            { value: 'rating', label: 'Highest Rated' }
          ]}
          className="-mx-6 mb-6"
          // State and actions from hook
          {...filterState}
        />

        {/* Main Content */}
        <div>
          {/* Detail View */}
          {viewMode === 'detail' && filteredCapabilities.length > 0 && (
            <CapabilityDetailView
              capabilities={filteredCapabilities}
              currentIndex={currentDetailIndex}
              onNext={handleNextCapability}
              onPrevious={handlePreviousCapability}
              onClose={handleCloseDetailView}
              onRun={handleRunCapability}
              onDownload={handleDownloadCapability}
              onShare={handleShareCapability}
              downloadedCapabilities={downloadedCapabilities}
              downloadingCapabilities={downloadingCapabilities}
            />
          )}
          
          {/* Grid/List Views */}
          {viewMode !== 'detail' && (
            <>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                  <p className="text-gray-600">Loading capabilities...</p>
                </div>
              ) : filteredCapabilities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
                  <Store className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No capabilities found</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Try adjusting your search or filters to discover more capabilities
                  </p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
                }>
                  {filteredCapabilities.map(capability => {
                    const TypeIcon = getTypeIcon(capability.type);
                    const isAvailable = capability.isPurchased || capability.price.amount === 0;
                    
                    return viewMode === 'grid' ? (
                      // Grid View Card
                      <div
                        key={capability.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => {
                          const capabilityIndex = filteredCapabilities.findIndex(c => c.id === capability.id);
                          setCurrentDetailIndex(capabilityIndex);
                          setViewMode('detail');
                        }}
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${getColorClasses(
                              capability.category === 'ai' ? 'purple' :
                              capability.category === 'analysis' ? 'blue' :
                              capability.category === 'visualization' ? 'green' :
                              capability.category === 'search' ? 'orange' :
                              capability.category === 'mcp' ? 'teal' :
                              'indigo'
                            )}`}>
                              <TypeIcon className="w-5 h-5" />
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-sm">
                            {capability.name}
                          </h3>
                          
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {capability.description}
                          </p>

                          {/* Stats Row */}
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              <span>{capability.userRating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              <span>{capability.totalRuns}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{capability.averageRunTime}s</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                              ✓ Available
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => handleDownloadCapability(capability, e)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  downloadedCapabilities[capability.id]
                                    ? 'text-green-600 hover:bg-green-50'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                title={downloadedCapabilities[capability.id] ? "Downloaded" : "Download"}
                                disabled={downloadingCapabilities[capability.id]}
                              >
                                {downloadingCapabilities[capability.id] ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : downloadedCapabilities[capability.id] ? (
                                  <Download className="w-3.5 h-3.5 fill-current" />
                                ) : (
                                  <DownloadCloud className="w-3.5 h-3.5" />
                                )}
                              </button>
                              
                              {isAvailable && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRunCapability(capability);
                                    }}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Run"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleShareCapability(capability);
                                    }}
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Share"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View Card
                      <div
                        key={capability.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer p-5"
                        onClick={() => {
                          const capabilityIndex = filteredCapabilities.findIndex(c => c.id === capability.id);
                          setCurrentDetailIndex(capabilityIndex);
                          setViewMode('detail');
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl ${getColorClasses(
                            capability.category === 'ai' ? 'purple' :
                            capability.category === 'analysis' ? 'blue' :
                            capability.category === 'visualization' ? 'green' :
                            capability.category === 'search' ? 'orange' :
                            capability.category === 'mcp' ? 'teal' :
                            'indigo'
                          )}`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                  {capability.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {capability.description}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                            </div>
                            
                            <div className="flex items-center gap-6 mt-3">
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  <span>{capability.userRating.toFixed(1)} ({capability.totalReviews})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  <span>{capability.totalRuns} runs</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{capability.averageRunTime}s avg</span>
                                </div>
                              </div>
                              
                              <div className="ml-auto flex items-center gap-3">
                                <button
                                  onClick={(e) => handleDownloadCapability(capability, e)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    downloadedCapabilities[capability.id]
                                      ? 'text-green-600 hover:bg-green-50'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                  title={downloadedCapabilities[capability.id] ? "Downloaded" : "Download"}
                                  disabled={downloadingCapabilities[capability.id]}
                                >
                                  {downloadingCapabilities[capability.id] ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : downloadedCapabilities[capability.id] ? (
                                    <Download className="w-4 h-4 fill-current" />
                                  ) : (
                                    <DownloadCloud className="w-4 h-4" />
                                  )}
                                </button>
                                
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                  ✓ Available
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRunCapability(capability);
                                  }}
                                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                  Run
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

      {/* Modals */}
      {showRunModal && selectedCapability && (
        <RunCapabilityModal
          isOpen={showRunModal}
          capability={selectedCapability}
          projects={userProjects}
          onRun={handleRunRequest}
          onClose={closeModals}
        />
      )}

      {showShareModal && selectedCapability && (
        <ShareCapabilityModal
          isOpen={showShareModal}
          capability={selectedCapability}
          onShare={handleShareRequest}
          onClose={closeModals}
        />
      )}

        {/* Debug Component - Only show in development mode */}
        {process.env.NODE_ENV === 'development' && <DownloadSystemDebug />}
      </div>
    </div>
  );
}