// Space system types and interfaces - collaborative spaces for teams to work together with assets, capabilities, and tagged people

export type AssetType = 'search-query' | 'dataset' | 'dashboard' | 'report' | 'collection' | 'claimed-work' | 'network-contact';

export type SpaceAccessLevel = 'private' | 'team' | 'organization' | 'public';

export type ActivityType = 
  | 'space_created' 
  | 'asset_added' 
  | 'asset_removed' 
  | 'search_performed' 
  | 'dashboard_created' 
  | 'report_generated' 
  | 'collaboration_invited' 
  | 'asset_shared' 
  | 'space_settings_changed';

export interface SpaceAsset {
  id: string;
  type: AssetType;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  metadata: Record<string, any>;
  sourceSpaceId?: string; // For cross-space shared assets
  isSharedFromOtherSpace: boolean;
  size?: number; // For datasets, file size, etc.
  tags: string[];
}

export interface SpaceActivity {
  id: string;
  type: ActivityType;
  description: string;
  performedBy: string;
  performedAt: string;
  assetId?: string;
  assetType?: AssetType;
  metadata: Record<string, any>;
  spaceId: string;
}

export interface SpaceCollaborator {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'contributor' | 'viewer';
  joinedAt: string;
  lastActive: string;
  permissions: {
    canEdit: boolean;
    canInvite: boolean;
    canDelete: boolean;
    canManageAssets: boolean;
  };
}

export interface Space {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  accessLevel: SpaceAccessLevel;
  
  // Assets management
  assets: SpaceAsset[];
  assetCount: number;
  
  // Collaboration
  collaborators: SpaceCollaborator[];
  collaboratorCount: number;
  
  // Activity tracking
  activities: SpaceActivity[];
  lastActivity: string;
  
  // Space settings
  settings: {
    autoSaveSearches: boolean;
    autoCreateAssets: boolean;
    allowCrossSpaceAssets: boolean;
    notificationSettings: {
      onNewActivity: boolean;
      onCollaboratorJoin: boolean;
      onAssetAdded: boolean;
    };
  };
  
  // Metadata
  tags: string[];
  color?: string; // For UI customization
  isFavorite: boolean;
  isArchived: boolean;
}

export interface SpaceContext {
  currentSpace: Space | null;
  isInSpace: boolean;
  availableSpaces: Space[];
  recentSpaces: Space[];
}

export interface CreateSpaceData {
  name: string;
  description: string;
  accessLevel: SpaceAccessLevel;
  settings: Space['settings'];
  tags: string[];
  color?: string;
}

export interface AssetCreationContext {
  spaceId?: string;
  autoAssociate: boolean;
  metadata?: Record<string, any>;
}

export interface CrossSpaceAssetReference {
  assetId: string;
  sourceSpaceId: string;
  targetSpaceId: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canCopy: boolean;
  };
  sharedAt: string;
  sharedBy: string;
}