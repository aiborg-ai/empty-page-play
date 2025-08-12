import { Store, Search, Filter, Loader2 } from 'lucide-react';
import { CapabilityCategory } from '../types/capabilities';
import { useSpaceContext } from '../hooks/useSpaceContext';
import { useShowcase } from '../hooks/useShowcase';
import HarmonizedCard from './HarmonizedCard';
import { ShowcaseSidebar } from './showcase/ShowcaseSidebar';
import { RunCapabilityModal } from './modals/RunCapabilityModal';
import { ShareCapabilityModal } from './modals/ShareCapabilityModal';
import {
  createCapabilityStats,
  createCapabilityKeywords,
  createCapabilityAttributes,
  createCapabilityActions
} from '../utils/showcaseUtils';

interface ShowcaseProps {
  onNavigate?: (section: string) => void;
  initialCategory?: CapabilityCategory | 'all';
}

export default function Showcase({ initialCategory = 'all' }: ShowcaseProps) {
  const { currentSpace: currentProject } = useSpaceContext();
  const {
    searchQuery,
    selectedCategory,
    selectedCapability,
    capabilities,
    userProjects,
    loading,
    showRunModal,
    showShareModal,
    setSearchQuery,
    setSelectedCategory,
    handleRunCapability,
    handleShareCapability,
    handleCapabilityDetails,
    handleRunRequest,
    handleShareRequest,
    closeModals
  } = useShowcase(initialCategory);

  return (
    <div className="h-full bg-gray-50 flex">
      {/* Secondary Sidebar */}
      <ShowcaseSidebar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        totalCapabilities={capabilities.length}
        userProjects={userProjects}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Store className="w-5 h-5 text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Showcase</h1>
              </div>
              <p className="text-lg text-gray-600">
                Discover and use powerful capabilities to enhance your research workflow
              </p>
              {currentProject && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Current project:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: currentProject.color }}
                    />
                    <span className="font-medium text-blue-600">{currentProject.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search capabilities, providers, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading capabilities...</h3>
                <p className="text-gray-600">Discovering the latest capabilities for your research workflow</p>
              </div>
            ) : capabilities.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery || selectedCategory !== 'all' ? 'No capabilities found' : 'No capabilities available'}
                </h3>
                <p className="text-gray-600">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'Try adjusting your search terms or category filter'
                    : 'Capabilities will appear here once they are added to the database'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {capabilities.map((capability) => {
                  const stats = createCapabilityStats(capability);
                  const keywords = createCapabilityKeywords(capability);
                  const attributes = createCapabilityAttributes(capability);
                  const actions = createCapabilityActions(
                    capability,
                    () => handleRunCapability(capability),
                    () => handleShareCapability(capability),
                    () => handleCapabilityDetails(capability.id)
                  );

                  return (
                    <HarmonizedCard
                      key={capability.id}
                      title={capability.name}
                      description={capability.description}
                      stats={stats}
                      keywords={keywords}
                      attributes={attributes}
                      actions={actions}
                      colorAccent="#3b82f6"
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RunCapabilityModal
        isOpen={showRunModal}
        onClose={closeModals}
        capability={selectedCapability}
        projects={userProjects}
        onRun={handleRunRequest}
      />

      <ShareCapabilityModal
        isOpen={showShareModal}
        onClose={closeModals}
        capability={selectedCapability}
        onShare={handleShareRequest}
      />
    </div>
  );
}