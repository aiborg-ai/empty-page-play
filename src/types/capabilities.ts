// Capability marketplace types and interfaces

export type CapabilityCategory = 'analysis' | 'search' | 'visualization' | 'ai' | 'automation' | 'collaboration';
export type CapabilityStatus = 'available' | 'purchased' | 'enabled' | 'disabled' | 'shared';
export type CapabilityType = 'tool' | 'dashboard' | 'ai-agent' | 'workflow' | 'integration';

export interface CapabilityProvider {
  id: string;
  name: string;
  company: string;
  email: string;
  profileImage?: string;
  verified: boolean;
  rating: number;
  totalCapabilities: number;
}

export interface CapabilityAsset {
  id: string;
  name: string;
  type: 'dataset' | 'report' | 'dashboard' | 'search-query' | 'visualization';
  description: string;
  size?: number;
  metadata: Record<string, any>;
}

export interface CapabilityRun {
  id: string;
  capabilityId: string;
  projectId: string;
  projectName: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  assetsProduced: CapabilityAsset[];
  parameters: Record<string, any>;
  userId: string;
  duration?: number;
  errorMessage?: string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: CapabilityCategory;
  type: CapabilityType;
  
  // Provider information
  providerId: string;
  providerName: string;
  providerCompany: string;
  
  // Status and availability
  status: CapabilityStatus;
  isEnabled: boolean;
  isPurchased: boolean;
  isShared: boolean;
  sharedBy?: string;
  purchasedAt?: string;
  enabledAt?: string;
  
  // Pricing and marketplace info
  price: {
    amount: number;
    currency: string;
    billingType: 'one-time' | 'monthly' | 'per-use';
  };
  freeTrialAvailable: boolean;
  trialDuration?: number; // days
  
  // Technical details
  version: string;
  lastUpdated: string;
  requirements: string[];
  supportedDataTypes: string[];
  estimatedRunTime: string;
  
  // Assets and outputs
  sampleAssets: CapabilityAsset[];
  outputTypes: string[];
  
  // Usage and performance
  totalRuns: number;
  averageRunTime: number;
  successRate: number;
  userRating: number;
  totalReviews: number;
  
  // Configuration
  parameters: CapabilityParameter[];
  
  // Media and marketing
  thumbnailUrl: string;
  screenshotUrls: string[];
  demoVideoUrl?: string;
  tags: string[];
  
  // Permissions and sharing
  shareSettings: {
    allowSharing: boolean;
    maxShares: number;
    currentShares: number;
  };
}

export interface CapabilityParameter {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multi-select' | 'file' | 'date' | 'range';
  required: boolean;
  defaultValue?: any;
  options?: Array<{ value: any; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  description: string;
  helpText?: string;
}

export interface UserCapability {
  capabilityId: string;
  userId: string;
  status: CapabilityStatus;
  purchasedAt?: string;
  enabledAt?: string;
  disabledAt?: string;
  sharedBy?: string;
  sharedAt?: string;
  totalRuns: number;
  lastRunAt?: string;
  customSettings: Record<string, any>;
  licenseType: 'purchased' | 'shared' | 'trial';
  expiresAt?: string;
}

export interface CapabilityReview {
  id: string;
  capabilityId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  title: string;
  review: string;
  helpful: number;
  createdAt: string;
  verified: boolean; // verified purchase
}

export interface RunCapabilityRequest {
  capabilityId: string;
  projectId: string;
  parameters: Record<string, any>;
  settings?: {
    notifyOnComplete: boolean;
    saveAssets: boolean;
    assetNamingPrefix?: string;
  };
}

export interface CapabilityShare {
  id: string;
  capabilityId: string;
  sharedBy: string;
  sharedByName: string;
  sharedWith: string;
  sharedWithName: string;
  sharedAt: string;
  message?: string;
  permissions: {
    canRun: boolean;
    canReshare: boolean;
    expiresAt?: string;
  };
  status: 'pending' | 'accepted' | 'declined' | 'revoked';
}

export interface CapabilityMarketplaceStats {
  totalCapabilities: number;
  totalProviders: number;
  totalRuns: number;
  averageRating: number;
  categoryCounts: Record<CapabilityCategory, number>;
  trending: Capability[];
  newReleases: Capability[];
  topRated: Capability[];
}