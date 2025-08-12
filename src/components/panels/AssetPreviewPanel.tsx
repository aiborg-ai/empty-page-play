import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  Edit,
  Trash2,
  Eye,
  User,
  Tag,
  Folder,
  FileText,
  Database,
  Brain,
  BarChart3,
  Image,
  Video,
  Code,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info,
  Calendar,
  HardDrive,
  Shield,
  Activity
} from 'lucide-react';
import { Asset, AssetActivity } from '../../types/assets';
import { assetService } from '../../lib/assetService';

interface AssetPreviewPanelProps {
  asset: Asset;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AssetPreviewPanel: React.FC<AssetPreviewPanelProps> = ({
  asset,
  onClose,
  onDownload,
  onShare,
  onEdit,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'activity'>('preview');
  const [activities, setActivities] = useState<AssetActivity[]>([]);
  const [previewScale, setPreviewScale] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssetDetails();
  }, [asset.id]);

  const loadAssetDetails = async () => {
    setLoading(true);
    try {
      // Load full asset details including activity
      const details = await assetService.getAssetDetails(asset.id);
      if (details) {
        // In production, this would load actual activities
        setActivities([
          {
            id: '1',
            assetId: asset.id,
            assetName: asset.name,
            action: 'viewed',
            userId: 'current-user',
            userName: 'You',
            timestamp: new Date().toISOString(),
            details: 'Viewed the asset'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading asset details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssetIcon = () => {
    const icons: Record<string, React.ReactNode> = {
      'document': <FileText className="w-6 h-6" />,
      'report': <FileText className="w-6 h-6 text-blue-600" />,
      'dataset': <Database className="w-6 h-6 text-green-600" />,
      'visualization': <BarChart3 className="w-6 h-6 text-purple-600" />,
      'ai-output': <Brain className="w-6 h-6 text-pink-600" />,
      'image': <Image className="w-6 h-6 text-gray-600" />,
      'video': <Video className="w-6 h-6 text-red-600" />,
      'code': <Code className="w-6 h-6 text-gray-800" />
    };
    return icons[asset.type] || <FileText className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleZoomIn = () => {
    setPreviewScale(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setPreviewScale(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setPreviewScale(100);
  };

  const renderPreview = () => {
    // In production, this would render actual file preview
    switch (asset.type) {
      case 'image':
        return (
          <div className="flex items-center justify-center h-full bg-gray-100">
            {asset.url ? (
              <img 
                src={asset.url} 
                alt={asset.name}
                style={{ transform: `scale(${previewScale / 100})` }}
                className="max-w-full max-h-full object-contain transition-transform"
              />
            ) : (
              <div className="text-center">
                <Image className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Image preview</p>
              </div>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="flex items-center justify-center h-full bg-black">
            {asset.url ? (
              <video 
                controls 
                className="max-w-full max-h-full"
                style={{ transform: `scale(${previewScale / 100})` }}
              >
                <source src={asset.url} type={asset.mimeType} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center">
                <Video className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Video preview</p>
              </div>
            )}
          </div>
        );
      
      case 'document':
      case 'report':
        return (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Document: {asset.name}</p>
              <button
                onClick={onDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                Download to View
              </button>
            </div>
          </div>
        );
      
      case 'dataset':
        return (
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Dataset Information</h3>
              {asset.metadata && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Records:</span>
                    <span className="font-medium">{asset.metadata.recordCount?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Columns:</span>
                    <span className="font-medium">{asset.metadata.columns?.length || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>
            
            {asset.metadata?.columns && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Column Names</h4>
                <div className="flex flex-wrap gap-2">
                  {asset.metadata.columns.map((col: string) => (
                    <span key={col} className="px-2 py-1 bg-gray-100 text-xs rounded">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              {getAssetIcon()}
              <p className="text-gray-600 mt-4">{asset.name}</p>
              <p className="text-sm text-gray-500 mt-2">
                Preview not available for {asset.type} files
              </p>
              <button
                onClick={onDownload}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                Download File
              </button>
            </div>
          </div>
        );
    }
  };

  const renderDetails = () => (
    <div className="p-6 space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Basic Information</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-gray-600">Name</div>
              <div className="font-medium text-gray-900">{asset.name}</div>
            </div>
          </div>
          
          {asset.description && (
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-600">Description</div>
                <div className="text-gray-900">{asset.description}</div>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3">
            <HardDrive className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-gray-600">Size</div>
              <div className="font-medium text-gray-900">{formatFileSize(asset.fileSize)}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-gray-600">Created</div>
              <div className="text-gray-900">
                {new Date(asset.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-gray-600">Created by</div>
              <div className="text-gray-900">{asset.createdByName}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tags */}
      {asset.tags.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {asset.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-sm rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Spaces */}
      {asset.spaces.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Spaces</h3>
          <div className="space-y-2">
            {asset.spaces.map(space => (
              <div key={space} className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{space}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Permissions */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Access & Permissions</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {asset.isPublic ? 'Public - Anyone with link can view' : 'Private - Restricted access'}
            </span>
          </div>
          {asset.sharedWith.length > 0 && (
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">
                Shared with {asset.sharedWith.length} {asset.sharedWith.length === 1 ? 'person' : 'people'}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Analytics */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Analytics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm">Views</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{asset.viewCount}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Download className="w-4 h-4" />
              <span className="text-sm">Downloads</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{asset.downloadCount}</div>
          </div>
        </div>
      </div>
      
      {/* Source Information */}
      {asset.generatedBy && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Source</h3>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-600 mb-1">Generated by</div>
            <div className="font-medium text-blue-900">{asset.generatedBy.name}</div>
            <div className="text-xs text-blue-700 mt-1">
              Type: {asset.generatedBy.type.replace('-', ' ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderActivity = () => (
    <div className="p-6">
      <h3 className="font-medium text-gray-900 mb-4">Recent Activity</h3>
      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">
                  <span className="font-medium">{activity.userName}</span>
                  {' '}{activity.action} this asset
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No activity recorded yet</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative ml-auto bg-white w-full max-w-3xl h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            {getAssetIcon()}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{asset.name}</h2>
              <p className="text-sm text-gray-600">
                {asset.extension.toUpperCase()} • {formatFileSize(asset.fileSize)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'activity'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Activity
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 mt-4">Loading asset...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'preview' && renderPreview()}
              {activeTab === 'details' && renderDetails()}
              {activeTab === 'activity' && renderActivity()}
            </>
          )}
        </div>
        
        {/* Preview Controls */}
        {activeTab === 'preview' && (asset.type === 'image' || asset.type === 'document') && (
          <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {previewScale}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <button
              onClick={handleResetZoom}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Reset Zoom"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetPreviewPanel;