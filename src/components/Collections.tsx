import { useState, useMemo } from 'react';
import { 
  FolderPlus, 
  Search, 
  Filter,
  Share2,
  MoreHorizontal,
  Plus,
  Folder,
  FileText,
  Calendar,
  User,
  Lock,
  Globe,
  Users,
  X,
  Upload,
  HelpCircle,
  CheckCircle,
  XCircle,
  Bell,
  Sparkles
} from 'lucide-react';
import PageHeader from './PageHeader';

interface Collection {
  id: string;
  title: string;
  description: string;
  type: 'static' | 'dynamic';
  access: 'restricted' | 'limited' | 'public';
  itemCount: number;
  lastAccessed: string;
  creator: string;
  queries?: string[];
}

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collection: Omit<Collection, 'id' | 'itemCount' | 'lastAccessed'>) => void;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
}

const CreateCollectionModal = ({ isOpen, onClose, onSave }: CreateCollectionModalProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'dynamic' | 'media'>('details');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'static' as 'static' | 'dynamic',
    access: 'restricted' as 'restricted' | 'limited' | 'public',
    creator: 'Current User',
    queries: [] as string[]
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
    setFormData({
      title: '',
      description: '',
      type: 'static',
      access: 'restricted',
      creator: 'Current User',
      queries: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b bg-slate-700 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Create a new collection</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-600 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('dynamic')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'dynamic'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Dynamic
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'media'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Media
          </button>
          <div className="ml-auto flex items-center px-4 text-xs text-gray-500">
            <HelpCircle className="w-4 h-4 mr-1" />
            Limit: 50,000
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'static' | 'dynamic' })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="static">Patent</option>
                  <option value="dynamic">Scholarly Work</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border-2 border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter collection title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter collection description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Who has access
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="access"
                      value="restricted"
                      checked={formData.access === 'restricted'}
                      onChange={(e) => setFormData({ ...formData, access: e.target.value as any })}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Restricted access: Only you can view
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="access"
                      value="limited"
                      checked={formData.access === 'limited'}
                      onChange={(e) => setFormData({ ...formData, access: e.target.value as any })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Limited access: Anyone with the link can view
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="access"
                      value="public"
                      checked={formData.access === 'public'}
                      onChange={(e) => setFormData({ ...formData, access: e.target.value as any })}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Public access: Discoverable through search
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dynamic' && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 mb-6">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div className="text-sm">
                  <strong>Make Dynamic Collection</strong>
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Dynamic Collections</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Dynamic collections are automatically updated when new items are added to our search index. 
                    Stay up to date with emails and notifications then choose to accept or reject new items into your collection.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Auto update from this query.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Auto update from multiple queries.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Receive alert notifications.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Review new items when available.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Always up to date.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Static Collections</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Collections are a saved grouping of patents or scholarly works. Any items in a search result 
                    can be manually added or removed from a collection. You can give your collection a name and 
                    description, import/export items or choose your sharing settings.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Manually curate items.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Add notes to annotate collections.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Private or public publishing.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>Receive alert notifications.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>Automatically updated.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="displayAvatar"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="displayAvatar" className="text-sm font-medium text-gray-700">
                  Display Collection Avatar
                </label>
              </div>
              
              <p className="text-xs text-gray-600">
                This will display your profile avatar in the collection header. Alternatively you can upload another image to represent this collection. 
                Supported file types: .png, .jpg and can be resized and cropped after upload. By sharing this data with Lens.org and the public, 
                you acknowledge that you are authorized to do so.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-500 mb-4">
                  Drop files here to upload, or
                </div>
                <div className="flex justify-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50">
                    <Upload className="w-4 h-4" />
                    Select Files
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50">
                    <Folder className="w-4 h-4" />
                    Choose from Library
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!formData.title.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const ShareModal = ({ isOpen, onClose, collection }: ShareModalProps) => {

  if (!isOpen || !collection) return null;

  const shareUrl = `${window.location.origin}/collections/${collection.id}`;

  const handleShare = (platform: string) => {
    let url = '';
    const text = `Check out this collection: ${collection.title}`;
    
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(collection.title)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`;
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
          <h3 className="text-lg font-semibold">Share Collection</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{collection.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{collection.description}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleShare('copy')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Share2 className="w-4 h-4 text-blue-600" />
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

interface CollectionsProps {
  onNavigate?: (section: string) => void;
}

export default function Collections({ onNavigate }: CollectionsProps = {}) {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: '1',
      title: 'AI Patent Research',
      description: 'Collection of artificial intelligence related patents',
      type: 'dynamic',
      access: 'restricted',
      itemCount: 247,
      lastAccessed: '2025-08-08',
      creator: 'John Doe',
      queries: ['artificial intelligence', 'machine learning']
    },
    {
      id: '2',
      title: 'Renewable Energy Patents',
      description: 'Static collection of renewable energy innovations',
      type: 'static',
      access: 'public',
      itemCount: 156,
      lastAccessed: '2025-08-07',
      creator: 'Jane Smith'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'static' | 'dynamic'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const filteredCollections = useMemo(() => {
    return collections.filter(collection => {
      const matchesSearch = collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          collection.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || collection.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [collections, searchQuery, filterType]);

  const handleCreateCollection = (newCollection: Omit<Collection, 'id' | 'itemCount' | 'lastAccessed'>) => {
    const collection: Collection = {
      ...newCollection,
      id: (collections.length + 1).toString(),
      itemCount: 0,
      lastAccessed: new Date().toISOString().split('T')[0]
    };
    setCollections([...collections, collection]);
  };

  const handleShare = (collection: Collection) => {
    setSelectedCollection(collection);
    setShowShareModal(true);
  };

  const handleGenerateAISummary = (collection: Collection) => {
    console.log('Generating AI summary for collection:', collection.title);
    // Implement OpenRouter API integration
    alert(`Generating AI summary for collection "${collection.title}"...`);
  };

  const getAccessIcon = (access: string) => {
    switch (access) {
      case 'restricted':
        return <Lock className="w-4 h-4 text-red-500" />;
      case 'limited':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'public':
        return <Globe className="w-4 h-4 text-green-500" />;
      default:
        return <Lock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'dynamic' ? 
      <Bell className="w-4 h-4 text-blue-500" /> : 
      <Folder className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <PageHeader
              title="Collections"
              subtitle="Organise your findings with Collections."
              helpLink="collections-support"
              onNavigate={onNavigate}
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Collection
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search collections..."
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
            <option value="all">All Types</option>
            <option value="static">Static Collections</option>
            <option value="dynamic">Dynamic Collections</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredCollections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FolderPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterType !== 'all' ? 'No collections found' : 'No collections yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search terms or filters'
                : 'Collections are a saved grouping of patents or scholarly works. Any items in a search result can be added or removed from a collection. Give your collection a name and description, import/export items or choose your sharing settings.'
              }
            </p>
            {!searchQuery && filterType === 'all' && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Create Collection
                </button>
                <button className="flex items-center gap-2 px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <HelpCircle className="w-4 h-4" />
                  Read More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((collection) => (
                <div key={collection.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(collection.type)}
                        <h3 className="font-medium text-gray-900">{collection.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {getAccessIcon(collection.access)}
                        <button
                          onClick={() => handleGenerateAISummary(collection)}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Generate AI Summary"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShare(collection)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {collection.description}
                    </p>
                    
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        <span>{collection.itemCount} items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>Last accessed: {collection.lastAccessed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>Created by: {collection.creator}</span>
                      </div>
                      {collection.queries && (
                        <div className="flex items-center gap-2">
                          <Search className="w-3 h-3" />
                          <span>Linked queries: {collection.queries.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        collection.type === 'dynamic' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {collection.type === 'dynamic' ? 'Dynamic' : 'Static'}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Collection
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateCollection}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        collection={selectedCollection}
      />
    </div>
  );
}