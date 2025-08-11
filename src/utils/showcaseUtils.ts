import { Capability } from '../types/capabilities';
import { Project } from '../types/cms';
import { HCLStat, HCLKeyword, HCLAttribute, HCLAction } from '../components/HarmonizedCard';
import { Star, Play, CheckCircle, User, Settings, Database, Share2, Eye } from 'lucide-react';

/**
 * Creates stats for display in capability cards
 */
export const createCapabilityStats = (capability: Capability): HCLStat[] => [
  {
    label: 'Rating',
    value: capability.userRating,
    icon: Star,
    color: 'text-yellow-500'
  },
  {
    label: 'Runs',
    value: capability.totalRuns,
    icon: Play,
    color: 'text-blue-500'
  },
  {
    label: 'Success',
    value: `${Math.round(capability.successRate * 100)}%`,
    icon: CheckCircle,
    color: 'text-green-500'
  }
];

/**
 * Creates keywords/tags for capability cards
 */
export const createCapabilityKeywords = (capability: Capability): HCLKeyword[] => [
  // Status badges
  { label: 'Available', color: 'green' },
  ...(capability.isShared ? [{ label: 'Shared', color: 'orange' }] : []),
  ...(capability.freeTrialAvailable ? [{ label: 'Trial', color: 'yellow' }] : []),
  // Tags (limited to prevent overflow)
  ...capability.tags.slice(0, 3).map(tag => ({ label: tag, color: 'gray' as const }))
];

/**
 * Creates attributes for capability cards
 */
export const createCapabilityAttributes = (capability: Capability): HCLAttribute[] => [
  {
    label: 'Provider',
    value: capability.providerName,
    icon: User
  },
  {
    label: 'Company',
    value: capability.providerCompany,
    icon: Settings
  },
  {
    label: 'Price',
    value: capability.price.amount === 0 ? 'Free' : `$${capability.price.amount}`,
    icon: Database
  }
];

/**
 * Creates action buttons for capability cards
 */
export const createCapabilityActions = (
  _capability: Capability,
  onRun: () => void,
  onShare: () => void,
  onDetails: () => void
): HCLAction[] => [
  // All tools are now available for use
  {
    id: 'use',
    label: 'Use',
    icon: Play,
    onClick: onRun,
    variant: 'primary' as const,
    isPrimary: true
  },
  {
    id: 'share',
    label: 'Share',
    icon: Share2,
    onClick: onShare
  },
  {
    id: 'details',
    label: 'Details',
    icon: Eye,
    onClick: onDetails
  }
];

/**
 * Gets the project asset count in a type-safe way
 */
export const getProjectAssetCount = (project: Project): number => {
  // Handle different Project type schemas
  return (project as any).asset_count || 
         (project as any).assetCount || 
         0;
};

/**
 * Formats project display name with asset count
 */
export const formatProjectDisplayName = (project: Project): string => {
  const assetCount = getProjectAssetCount(project);
  return `${project.name} (${assetCount} assets)`;
};

/**
 * Validates project selection for running capabilities
 */
export const validateProjectSelection = (
  selectedProjectId: string, 
  projects: Project[]
): { isValid: boolean; project?: Project } => {
  if (!selectedProjectId) {
    return { isValid: false };
  }
  
  const project = projects.find(p => p.id === selectedProjectId);
  return { 
    isValid: !!project, 
    project 
  };
};