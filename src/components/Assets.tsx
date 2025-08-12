import React, { useState, useEffect } from 'react';
import {
  Folder,
  File,
  FileText,
  FileSpreadsheet,
  Image,
  Video,
  Code,
  Database,
  BarChart3,
  Brain,
  Search,
  Upload,
  Download,
  Share2,
  Filter,
  Grid3x3,
  List,
  MoreVertical,
  Eye,
  X,
  CheckSquare,
  Square,
  Trash2,
  Archive,
  Users,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Asset, AssetType, AssetFilter, AssetSort, AssetStats } from '../types/assets';
import { assetService } from '../lib/assetService';
import AssetUploadModal from './modals/AssetUploadModal';
import AssetShareModal from './modals/AssetShareModal';
import AssetPreviewPanel from './panels/AssetPreviewPanel';

interface AssetsProps {
  currentUser: any;
  onNavigate?: (section: string) => void;
}

const Assets: React.FC<AssetsProps> = ({ currentUser, onNavigate }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<AssetFilter>({});
  const [sort, setSort] = useState<AssetSort>({ field: 'createdAt', direction: 'desc' });
  const [stats, setStats] = useState<AssetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAssets();
    loadStats();
  }, [filter, sort]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await assetService.getAssets({ ...filter, search: searchQuery }, sort);
      setAssets(data);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await assetService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSelectAsset = (assetId: string, multiSelect = false) => {
    if (multiSelect) {
      const newSelection = new Set(selectedAssets);
      if (newSelection.has(assetId)) {
        newSelection.delete(assetId);
      } else {
        newSelection.add(assetId);
      }
      setSelectedAssets(newSelection);
    } else {
      setSelectedAssets(new Set([assetId]));
    }
  };

  const handleSelectAll = () => {
    if (selectedAssets.size === assets.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(assets.map(a => a.id)));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedAssets.size === 0) return;
    
    switch (action) {
      case 'delete':
        if (confirm(`Delete ${selectedAssets.size} asset(s)?`)) {
          await assetService.bulkDelete(Array.from(selectedAssets));
          loadAssets();
          setSelectedAssets(new Set());
        }
        break;
      case 'archive':
        await assetService.bulkArchive(Array.from(selectedAssets));
        loadAssets();
        setSelectedAssets(new Set());
        break;
      case 'share':
        setShowShareModal(true);
        break;
    }
  };

  const getAssetIcon = (type: AssetType) => {
    const icons: Record<AssetType, React.ReactNode> = {
      'document': <FileText className="w-5 h-5" />,
      'report': <FileText className="w-5 h-5 text-blue-600" />,
      'dataset': <Database className="w-5 h-5 text-green-600" />,
      'visualization': <BarChart3 className="w-5 h-5 text-purple-600" />,
      'dashboard': <Grid3x3 className="w-5 h-5 text-indigo-600" />,
      'ai-output': <Brain className="w-5 h-5 text-pink-600" />,
      'patent-search': <Search className="w-5 h-5 text-orange-600" />,
      'analysis': <FileText className="w-5 h-5 text-cyan-600" />,
      'presentation': <FileText className="w-5 h-5 text-yellow-600" />,
      'spreadsheet': <FileSpreadsheet className="w-5 h-5 text-green-600" />,
      'image': <Image className="w-5 h-5 text-gray-600" />,
      'video': <Video className="w-5 h-5 text-red-600" />,
      'code': <Code className="w-5 h-5 text-gray-800" />,
      'model': <Brain className="w-5 h-5 text-purple-600" />,
      'template': <File className="w-5 h-5 text-gray-600" />
    };
    return icons[type] || <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderAssetCard = (asset: Asset) => {
    const isSelected = selectedAssets.has(asset.id);
    
    return (
      <div
        key={asset.id}
        className={`bg-white rounded-lg border ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} 
          hover:shadow-lg transition-all duration-200 cursor-pointer group`}
        onClick={() => setSelectedAsset(asset)}
        onDoubleClick={() => setShowPreview(true)}
      >
        {/* Checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelectAsset(asset.id, true);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isSelected ? (
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Preview Area */}
        <div className="h-32 bg-gray-50 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          {asset.thumbnailUrl ? (
            <img src={asset.thumbnailUrl} alt={asset.name} className="object-cover w-full h-full" />
          ) : (
            <div className="text-gray-400">
              {getAssetIcon(asset.type)}
            </div>
          )}
          
          {/* Source Badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs rounded-full font-medium">
              {asset.source === 'platform-generated' && '🤖 Generated'}
              {asset.source === 'user-upload' && '📤 Uploaded'}
              {asset.source === 'ai-generated' && '✨ AI Created'}
              {asset.source === 'decision-engine' && '🧠 Engine Output'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate flex-1" title={asset.name}>
              {asset.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Show context menu
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {asset.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {asset.description}
            </p>
          )}

          {/* Tags */}
          {asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {asset.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                  {tag}
                </span>
              ))}
              {asset.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                  +{asset.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span>{formatFileSize(asset.fileSize)}</span>
              <span>•</span>
              <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              {asset.viewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{asset.viewCount}</span>
                </div>
              )}
              {asset.downloadCount > 0 && (
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{asset.downloadCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shared Indicator */}
          {asset.sharedWith.length > 0 && (
            <div className="mt-2 pt-2 border-t flex items-center gap-1 text-xs text-blue-600">
              <Users className="w-3 h-3" />
              <span>Shared with {asset.sharedWith.length} {asset.sharedWith.length === 1 ? 'person' : 'people'}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAssetRow = (asset: Asset) => {
    const isSelected = selectedAssets.has(asset.id);
    
    return (
      <tr
        key={asset.id}
        className={`${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer transition-colors`}
        onClick={() => setSelectedAsset(asset)}
        onDoubleClick={() => setShowPreview(true)}
      >
        <td className="px-4 py-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelectAsset(asset.id, true);
            }}
          >
            {isSelected ? (
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {getAssetIcon(asset.type)}
            <div>
              <div className="font-medium text-gray-900">{asset.name}</div>
              {asset.description && (
                <div className="text-sm text-gray-600 truncate max-w-md">{asset.description}</div>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="capitalize text-sm text-gray-600">{asset.type.replace('-', ' ')}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-gray-600">{formatFileSize(asset.fileSize)}</span>
        </td>
        <td className="px-4 py-3">
          <div className="text-sm text-gray-600">
            <div>{asset.createdByName}</div>
            <div className="text-xs text-gray-500">
              {new Date(asset.createdAt).toLocaleDateString()}
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {asset.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                {tag}
              </span>
            ))}
            {asset.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{asset.tags.length - 2}</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Download
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAsset(asset);
                setShowShareModal(true);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // More options
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Folder className="w-7 h-7 text-blue-600" />
                Assets Studio
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all your platform artifacts and uploaded files
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Assets
            </button>
          </div>

          {/* Stats Bar */}
          {stats && (
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalAssets}</div>
                <div className="text-sm text-gray-600">Total Assets</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatFileSize(stats.totalSize)}
                </div>
                <div className="text-sm text-gray-600">Total Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round((stats.storageUsed / stats.storageLimit) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Storage Used</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {assets.filter(a => a.sharedWith.length > 0).length}
                </div>
                <div className="text-sm text-gray-600">Shared Assets</div>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadAssets()}
                placeholder="Search assets..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    loadAssets();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Bulk Actions */}
              {selectedAssets.size > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedAssets.size} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction('share')}
                    className="p-1 hover:bg-blue-100 rounded"
                  >
                    <Share2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="p-1 hover:bg-blue-100 rounded"
                  >
                    <Archive className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                  <button
                    onClick={() => setSelectedAssets(new Set())}
                    className="p-1 hover:bg-blue-100 rounded"
                  >
                    <X className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              )}

              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                  showFilters ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {Object.keys(filter).length > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {Object.keys(filter).length}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                <select
                  value={sort.field}
                  onChange={(e) => setSort({ ...sort, field: e.target.value as any })}
                  className="px-3 py-2 bg-transparent border-none focus:ring-0"
                >
                  <option value="name">Name</option>
                  <option value="createdAt">Date Created</option>
                  <option value="updatedAt">Date Modified</option>
                  <option value="fileSize">Size</option>
                  <option value="viewCount">Views</option>
                </select>
                <button
                  onClick={() => setSort({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  {sort.direction === 'asc' ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* View Mode */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  onChange={(e) => setFilter({ ...filter, type: e.target.value ? [e.target.value as AssetType] : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Types</option>
                  <option value="document">Documents</option>
                  <option value="report">Reports</option>
                  <option value="dataset">Datasets</option>
                  <option value="visualization">Visualizations</option>
                  <option value="ai-output">AI Outputs</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                <select
                  onChange={(e) => setFilter({ ...filter, source: e.target.value ? [e.target.value as any] : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Sources</option>
                  <option value="platform-generated">Platform Generated</option>
                  <option value="user-upload">User Upload</option>
                  <option value="ai-generated">AI Generated</option>
                  <option value="decision-engine">Decision Engine</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ownership</label>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilter({
                      ...filter,
                      myAssets: value === 'mine' ? true : undefined,
                      sharedWithMe: value === 'shared' ? true : undefined
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Assets</option>
                  <option value="mine">My Assets</option>
                  <option value="shared">Shared with Me</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Assets Grid/List */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 mt-4">Loading assets...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="p-12 text-center">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || Object.keys(filter).length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first asset to get started'}
              </p>
              {!searchQuery && Object.keys(filter).length === 0 && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload Asset
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-6">
              {/* Select All */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  {selectedAssets.size === assets.length ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  Select All ({assets.length})
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {assets.map(renderAssetCard)}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <button onClick={handleSelectAll}>
                        {selectedAssets.size === assets.length ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tags</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {assets.map(renderAssetRow)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showUploadModal && (
        <AssetUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={() => {
            loadAssets();
            setShowUploadModal(false);
          }}
          currentUser={currentUser}
        />
      )}

      {showShareModal && selectedAsset && (
        <AssetShareModal
          asset={selectedAsset}
          onClose={() => setShowShareModal(false)}
          onShare={() => {
            loadAssets();
            setShowShareModal(false);
          }}
        />
      )}

      {showPreview && selectedAsset && (
        <AssetPreviewPanel
          asset={selectedAsset}
          onClose={() => setShowPreview(false)}
          onDownload={() => {
            // Handle download
          }}
          onShare={() => {
            setShowPreview(false);
            setShowShareModal(true);
          }}
        />
      )}
    </div>
  );
};

export default Assets;