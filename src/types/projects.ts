// Project system types and interfaces

export type AssetType = 'search-query' | 'dataset' | 'dashboard' | 'report' | 'collection' | 'claimed-work' | 'network-contact';

export type ProjectAccessLevel = 'private' | 'team' | 'organization' | 'public';

export type ActivityType = 
  | 'project_created' 
  | 'asset_added' 
  | 'asset_removed' 
  | 'search_performed' 
  | 'dashboard_created' 
  | 'report_generated' 
  | 'collaboration_invited' 
  | 'asset_shared' 
  | 'project_settings_changed';

export interface ProjectAsset {
  id: string;
  type: AssetType;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  metadata: Record<string, any>;
  sourceProjectId?: string; // For cross-project shared assets
  isSharedFromOtherProject: boolean;
  size?: number; // For datasets, file size, etc.
  tags: string[];
}

export interface ProjectActivity {
  id: string;
  type: ActivityType;
  description: string;
  performedBy: string;
  performedAt: string;
  assetId?: string;
  assetType?: AssetType;
  metadata: Record<string, any>;
  projectId: string;
}

export interface ProjectCollaborator {
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

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  accessLevel: ProjectAccessLevel;
  
  // Assets management
  assets: ProjectAsset[];
  assetCount: number;
  
  // Collaboration
  collaborators: ProjectCollaborator[];
  collaboratorCount: number;
  
  // Activity tracking
  activities: ProjectActivity[];
  lastActivity: string;
  
  // Project settings
  settings: {
    autoSaveSearches: boolean;
    autoCreateAssets: boolean;
    allowCrossProjectAssets: boolean;
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

export interface ProjectContext {
  currentProject: Project | null;
  isInProject: boolean;
  availableProjects: Project[];
  recentProjects: Project[];
}

export interface CreateProjectData {
  name: string;
  description: string;
  accessLevel: ProjectAccessLevel;
  settings: Project['settings'];
  tags: string[];
  color?: string;
}

export interface AssetCreationContext {
  projectId?: string;
  autoAssociate: boolean;
  metadata?: Record<string, any>;
}

export interface CrossProjectAssetReference {
  assetId: string;
  sourceProjectId: string;
  targetProjectId: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canCopy: boolean;
  };
  sharedAt: string;
  sharedBy: string;
}