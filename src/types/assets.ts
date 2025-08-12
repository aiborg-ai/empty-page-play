// Assets Management System Types

export type AssetType = 
  | 'document'
  | 'report'
  | 'dataset'
  | 'visualization'
  | 'dashboard'
  | 'ai-output'
  | 'patent-search'
  | 'analysis'
  | 'presentation'
  | 'spreadsheet'
  | 'image'
  | 'video'
  | 'code'
  | 'model'
  | 'template';

export type AssetSource = 
  | 'platform-generated'
  | 'user-upload'
  | 'ai-generated'
  | 'external-import'
  | 'decision-engine'
  | 'showcase-output';

export type AssetStatus = 
  | 'processing'
  | 'ready'
  | 'archived'
  | 'deleted'
  | 'error';

export type AssetPermission = 
  | 'view'
  | 'download'
  | 'edit'
  | 'delete'
  | 'share'
  | 'admin';

export interface Asset {
  id: string;
  name: string;
  description?: string;
  type: AssetType;
  source: AssetSource;
  status: AssetStatus;
  
  // File Information
  fileSize: number;
  mimeType: string;
  extension: string;
  url?: string;
  thumbnailUrl?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  lastModifiedBy?: string;
  
  // Organization
  spaces: string[]; // Space IDs this asset belongs to
  tags: string[];
  category?: string;
  version: number;
  parentId?: string; // For versioning
  
  // Sharing & Permissions
  isPublic: boolean;
  sharedWith: AssetShare[];
  permissions: AssetPermissionSet;
  
  // Analytics
  viewCount: number;
  downloadCount: number;
  lastViewedAt?: string;
  lastDownloadedAt?: string;
  
  // Platform Integration
  generatedBy?: {
    type: 'decision-engine' | 'showcase' | 'ai-chat' | 'report';
    id: string;
    name: string;
  };
  linkedAssets?: string[]; // Related asset IDs
  
  // Additional Metadata
  metadata?: {
    [key: string]: any;
    // For reports/analysis
    patentCount?: number;
    dateRange?: { start: string; end: string };
    jurisdiction?: string[];
    // For datasets
    recordCount?: number;
    columns?: string[];
    // For AI outputs
    model?: string;
    confidence?: number;
    // For visualizations
    chartType?: string;
    dataSource?: string;
  };
}

export interface AssetShare {
  userId?: string;
  email?: string;
  name: string;
  permissions: AssetPermission[];
  sharedAt: string;
  sharedBy: string;
  expiresAt?: string;
  message?: string;
}

export interface AssetPermissionSet {
  owner: AssetPermission[];
  space: AssetPermission[];
  shared: AssetPermission[];
  public: AssetPermission[];
}

export interface AssetFilter {
  search?: string;
  type?: AssetType[];
  source?: AssetSource[];
  status?: AssetStatus[];
  spaces?: string[];
  tags?: string[];
  createdBy?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sharedWithMe?: boolean;
  myAssets?: boolean;
}

export interface AssetSort {
  field: 'name' | 'createdAt' | 'updatedAt' | 'fileSize' | 'viewCount';
  direction: 'asc' | 'desc';
}

export interface AssetUpload {
  file: File;
  name?: string;
  description?: string;
  type: AssetType;
  spaces: string[];
  tags: string[];
  isPublic?: boolean;
}

export interface AssetFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  createdBy: string;
  assetCount: number;
  subfolderCount: number;
  color?: string;
  icon?: string;
}

export interface AssetActivity {
  id: string;
  assetId: string;
  assetName: string;
  action: 'created' | 'viewed' | 'downloaded' | 'edited' | 'shared' | 'deleted' | 'restored';
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

export interface AssetStats {
  totalAssets: number;
  totalSize: number;
  assetsByType: Record<AssetType, number>;
  assetsBySource: Record<AssetSource, number>;
  recentActivity: AssetActivity[];
  topAssets: Asset[];
  storageUsed: number;
  storageLimit: number;
}

export interface AssetBulkAction {
  action: 'delete' | 'archive' | 'share' | 'tag' | 'move';
  assetIds: string[];
  params?: {
    spaces?: string[];
    tags?: string[];
    shareWith?: AssetShare[];
  };
}

export interface AssetPreview {
  assetId: string;
  type: 'inline' | 'modal' | 'external';
  content?: any;
  url?: string;
  viewer?: 'pdf' | 'image' | 'video' | 'code' | 'data' | 'office';
}

export interface AssetVersion {
  id: string;
  assetId: string;
  version: number;
  name: string;
  fileSize: number;
  createdAt: string;
  createdBy: string;
  changeLog?: string;
  url: string;
}