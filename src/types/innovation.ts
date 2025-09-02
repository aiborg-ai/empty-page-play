/**
 * TypeScript Type Definitions for Innovation Management Features
 * 
 * This file contains all type definitions, interfaces, and enums
 * used across the innovation management components.
 * 
 * @module types/innovation
 * @version 2.0.0
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Innovation pipeline stages from ideation to grant
 */
export enum PipelineStage {
  IDEATION = 'ideation',
  RESEARCH = 'research',
  DEVELOPMENT = 'development',
  FILING = 'filing',
  PROSECUTION = 'prosecution',
  GRANTED = 'granted'
}

/**
 * Priority levels for innovation projects
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Risk assessment levels
 */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * Patent status types
 */
export enum PatentStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  FILED = 'filed',
  PUBLISHED = 'published',
  GRANTED = 'granted',
  EXPIRED = 'expired',
  ABANDONED = 'abandoned'
}

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

/**
 * Technology categories
 */
export enum TechnologyCategory {
  AI_ML = 'AI/ML',
  QUANTUM = 'Quantum Computing',
  BIOTECH = 'Biotechnology',
  GREEN_ENERGY = 'Green Energy',
  ROBOTICS = 'Robotics',
  IOT = 'IoT',
  BLOCKCHAIN = 'Blockchain',
  NANOTECH = 'Nanotechnology',
  MATERIALS = 'Materials Science',
  TELECOM = 'Telecommunications'
}

// ============================================================================
// BASE INTERFACES
// ============================================================================

/**
 * Base interface for all entities with common properties
 */
export interface BaseEntity {
  /** Unique identifier */
  id: string;
  
  /** Creation timestamp */
  createdAt?: Date;
  
  /** Last update timestamp */
  updatedAt?: Date;
  
  /** Creator user ID */
  createdBy?: string;
  
  /** Last updater user ID */
  updatedBy?: string;
}

/**
 * Interface for entities with metadata
 */
export interface WithMetadata {
  /** Additional metadata */
  metadata?: Record<string, any>;
  
  /** Tags for categorization */
  tags?: string[];
  
  /** Custom attributes */
  attributes?: Record<string, any>;
}

// ============================================================================
// INNOVATION PIPELINE INTERFACES
// ============================================================================

/**
 * Milestone in an innovation project
 */
export interface Milestone {
  /** Milestone name */
  name: string;
  
  /** Completion status */
  completed: boolean;
  
  /** Completion or target date */
  date?: string;
  
  /** Responsible person/team */
  assignee?: string;
  
  /** Additional notes */
  notes?: string;
}

/**
 * Innovation pipeline item
 */
export interface PipelineItem extends BaseEntity, WithMetadata {
  /** Innovation title */
  title: string;
  
  /** Detailed description */
  description: string;
  
  /** Current pipeline stage */
  stage: PipelineStage;
  
  /** Priority level */
  priority: Priority;
  
  /** Assigned person/team */
  assignee: string;
  
  /** Due date */
  dueDate: string;
  
  /** Progress percentage (0-100) */
  progress: number;
  
  /** Patent number if granted */
  patentNumber?: string;
  
  /** Project milestones */
  milestones: Milestone[];
  
  /** Estimated value */
  estimatedValue?: number;
  
  /** Associated technology domain */
  technology?: TechnologyCategory;
  
  /** Related documents */
  documents?: Document[];
  
  /** Comments/notes */
  comments?: Comment[];
}

// ============================================================================
// COMPETITIVE INTELLIGENCE INTERFACES
// ============================================================================

/**
 * Competitor entity
 */
export interface Competitor extends BaseEntity {
  /** Company name */
  name: string;
  
  /** Company logo URL or emoji */
  logo: string;
  
  /** Total patent count */
  patentCount: number;
  
  /** Recent patent filings */
  recentFilings: number;
  
  /** Technology domains */
  techDomains: TechnologyCategory[];
  
  /** Threat assessment level */
  threatLevel: RiskLevel;
  
  /** Last detected activity */
  lastActivity: string;
  
  /** Market cap or size */
  marketCap?: number;
  
  /** Headquarters location */
  location?: string;
  
  /** Key products/services */
  products?: string[];
}

/**
 * Competitive intelligence alert
 */
export interface CompetitiveAlert extends BaseEntity {
  /** Alert type */
  type: 'filing' | 'grant' | 'litigation' | 'acquisition' | 'partnership';
  
  /** Severity level */
  severity: AlertSeverity;
  
  /** Related competitor */
  competitor: string;
  
  /** Alert title */
  title: string;
  
  /** Detailed description */
  description: string;
  
  /** Timestamp */
  timestamp: string;
  
  /** Related patent number */
  patentNumber?: string;
  
  /** Action required */
  actionRequired?: boolean;
  
  /** Recommended actions */
  recommendations?: string[];
}

// ============================================================================
// IP PORTFOLIO INTERFACES
// ============================================================================

/**
 * Patent in portfolio
 */
export interface Patent extends BaseEntity, WithMetadata {
  /** Patent title */
  title: string;
  
  /** Patent number */
  number: string;
  
  /** Filing date */
  filingDate: string;
  
  /** Grant date */
  grantDate?: string;
  
  /** Current status */
  status: PatentStatus;
  
  /** Technology category */
  technology: TechnologyCategory;
  
  /** Market value estimation */
  marketValue: number;
  
  /** Licensing potential (0-100) */
  licensingPotential: number;
  
  /** Citation count */
  citationCount: number;
  
  /** Annual maintenance cost */
  maintenanceCost: number;
  
  /** Remaining patent life in years */
  remainingLife: number;
  
  /** Return on investment percentage */
  roi: number;
  
  /** Inventors */
  inventors?: string[];
  
  /** Jurisdictions */
  jurisdictions?: string[];
  
  /** Abstract */
  abstract?: string;
  
  /** Claims */
  claims?: PatentClaim[];
  
  /** Related patents */
  relatedPatents?: string[];
}

/**
 * Patent claim
 */
export interface PatentClaim {
  /** Claim number */
  number: number;
  
  /** Claim text */
  text: string;
  
  /** Claim type (independent/dependent) */
  type: 'independent' | 'dependent';
  
  /** Dependencies on other claims */
  dependencies?: number[];
}

/**
 * Portfolio valuation metrics
 */
export interface PortfolioMetrics {
  /** Total portfolio value */
  totalValue: number;
  
  /** Average ROI */
  averageROI: number;
  
  /** Total maintenance costs */
  totalMaintenance: number;
  
  /** Number of high-value patents */
  highValuePatents: number;
  
  /** Technology distribution */
  technologyDistribution: Record<TechnologyCategory, number>;
  
  /** Risk assessment */
  riskProfile: {
    expiringSoon: number;
    maintenanceDue: number;
    lowCitations: number;
    infringementRisk: number;
  };
}

// ============================================================================
// TECHNOLOGY CONVERGENCE INTERFACES
// ============================================================================

/**
 * Technology node in convergence map
 */
export interface TechNode {
  /** Node identifier */
  id: string;
  
  /** Technology name */
  name: string;
  
  /** Category */
  category: string;
  
  /** Number of connections */
  connections: number;
  
  /** Convergence score (0-100) */
  convergenceScore: number;
  
  /** Position coordinates */
  x?: number;
  y?: number;
  
  /** Node size */
  size?: number;
  
  /** Color */
  color?: string;
}

/**
 * Connection between technology nodes
 */
export interface TechConnection {
  /** Source node ID */
  source: string;
  
  /** Target node ID */
  target: string;
  
  /** Connection strength (0-100) */
  strength: number;
  
  /** Number of innovations at intersection */
  innovations: number;
  
  /** Connection type */
  type?: 'synergy' | 'conflict' | 'neutral';
  
  /** Description */
  description?: string;
}

/**
 * Innovation white space opportunity
 */
export interface WhiteSpace {
  /** Involved technologies */
  technologies: string[];
  
  /** Opportunity description */
  opportunity: string;
  
  /** Opportunity score (0-100) */
  score: number;
  
  /** Market size estimation */
  marketSize?: number;
  
  /** Competition level */
  competitionLevel?: 'low' | 'medium' | 'high';
  
  /** Recommended actions */
  recommendations?: string[];
}

// ============================================================================
// TEAM COLLABORATION INTERFACES
// ============================================================================

/**
 * Team member
 */
export interface TeamMember extends BaseEntity {
  /** Member name */
  name: string;
  
  /** Email address */
  email: string;
  
  /** Role/title */
  role: string;
  
  /** Department */
  department?: string;
  
  /** Expertise areas */
  expertise?: string[];
  
  /** Active status */
  isActive: boolean;
  
  /** Avatar URL */
  avatar?: string;
  
  /** Current projects */
  projects?: string[];
}

/**
 * Invention disclosure
 */
export interface InventionDisclosure extends BaseEntity, WithMetadata {
  /** Disclosure title */
  title: string;
  
  /** Current status */
  status: 'draft' | 'submitted' | 'review' | 'approved' | 'rejected';
  
  /** Primary assignee */
  assignee: string;
  
  /** Progress percentage */
  progress: number;
  
  /** Inventors */
  inventors: TeamMember[];
  
  /** Description */
  description: string;
  
  /** Technical field */
  technicalField: TechnologyCategory;
  
  /** Prior art references */
  priorArt?: string[];
  
  /** Supporting documents */
  documents?: Document[];
  
  /** Review comments */
  reviewComments?: Comment[];
}

/**
 * Collaboration activity
 */
export interface Activity {
  /** Activity ID */
  id: string;
  
  /** Activity type */
  type: 'comment' | 'edit' | 'approval' | 'submission' | 'assignment';
  
  /** Actor */
  actor: string;
  
  /** Action description */
  action: string;
  
  /** Target entity */
  target?: string;
  
  /** Timestamp */
  timestamp: Date;
  
  /** Additional details */
  details?: Record<string, any>;
}

// ============================================================================
// METRICS & KPI INTERFACES
// ============================================================================

/**
 * Innovation KPI
 */
export interface InnovationKPI {
  /** KPI label */
  label: string;
  
  /** Current value */
  value: string | number;
  
  /** Unit of measurement */
  unit: string;
  
  /** Trend indicator */
  trend: string;
  
  /** Trend direction */
  trendDirection?: 'up' | 'down' | 'stable';
  
  /** Target value */
  target?: string | number;
  
  /** Icon identifier */
  icon?: string;
  
  /** Color scheme */
  color?: string;
}

/**
 * Performance metric
 */
export interface PerformanceMetric {
  /** Metric name */
  metric: string;
  
  /** Current value */
  current: string | number;
  
  /** Target value */
  target: string | number;
  
  /** Performance percentage */
  performance: number;
  
  /** Status */
  status?: 'on-track' | 'at-risk' | 'behind';
  
  /** Historical data */
  history?: Array<{
    date: string;
    value: number;
  }>;
}

/**
 * Innovation funnel stage
 */
export interface FunnelStage {
  /** Stage name */
  stage: string;
  
  /** Item count */
  count: number;
  
  /** Percentage of total */
  percentage: number;
  
  /** Conversion rate from previous stage */
  conversionRate?: number;
  
  /** Average time in stage */
  avgTimeInStage?: number;
}

// ============================================================================
// BUDGET & RESOURCE INTERFACES
// ============================================================================

/**
 * Innovation project for budget allocation
 */
export interface BudgetProject extends BaseEntity {
  /** Project name */
  name: string;
  
  /** Current budget allocation */
  currentBudget: number;
  
  /** Recommended budget */
  recommendedBudget: number;
  
  /** Expected ROI */
  roi: number;
  
  /** Patent potential count */
  patentPotential: number;
  
  /** Market size */
  marketSize: number;
  
  /** Risk assessment */
  riskScore: RiskLevel;
  
  /** Technology domain */
  technology?: TechnologyCategory;
  
  /** Team size */
  teamSize?: number;
  
  /** Timeline in months */
  timeline?: number;
}

/**
 * Budget allocation recommendation
 */
export interface BudgetRecommendation {
  /** Total budget */
  totalBudget: number;
  
  /** Allocated amount */
  allocatedBudget: number;
  
  /** Recommended total */
  recommendedTotal: number;
  
  /** Expected portfolio ROI */
  expectedROI: number;
  
  /** Expected patent output */
  expectedPatents: number;
  
  /** Project allocations */
  allocations: Array<{
    projectId: string;
    currentAmount: number;
    recommendedAmount: number;
    change: number;
    changePercent: number;
  }>;
  
  /** Budget distribution by category */
  distribution: Record<string, number>;
  
  /** Optimization insights */
  insights: string[];
}

// ============================================================================
// RISK ASSESSMENT INTERFACES
// ============================================================================

/**
 * Patent risk assessment
 */
export interface PatentRiskAssessment extends BaseEntity {
  /** Patent or product title */
  title: string;
  
  /** Assessment type */
  type: 'freedom-to-operate' | 'infringement' | 'invalidity';
  
  /** Risk level */
  riskLevel: RiskLevel;
  
  /** Risk score (0-100) */
  score: number;
  
  /** Number of blocking patents */
  blockers: number;
  
  /** Risk description */
  description: string;
  
  /** Conflicting patents */
  conflictingPatents?: Array<{
    number: string;
    title: string;
    owner: string;
    relevance: number;
  }>;
  
  /** Mitigation strategies */
  mitigationStrategies?: string[];
  
  /** Assessment date */
  assessmentDate: string;
  
  /** Valid until */
  validUntil?: string;
}

/**
 * Risk matrix summary
 */
export interface RiskMatrix {
  /** Low risk items */
  lowRisk: number;
  
  /** Medium risk items */
  mediumRisk: number;
  
  /** High risk items */
  highRisk: number;
  
  /** Total assessments */
  total: number;
  
  /** Risk distribution */
  distribution: Record<string, number>;
  
  /** Trend analysis */
  trend?: 'improving' | 'stable' | 'worsening';
}

// ============================================================================
// TECHNOLOGY SCOUTING INTERFACES
// ============================================================================

/**
 * Scouting opportunity
 */
export interface ScoutingOpportunity extends BaseEntity {
  /** Opportunity type */
  type: 'startup' | 'research' | 'patent' | 'partnership';
  
  /** Name or title */
  name: string;
  
  /** Technology description */
  technology: string;
  
  /** Relevance score (0-100) */
  relevance: number;
  
  /** Current status */
  status: 'monitoring' | 'evaluating' | 'pursuing' | 'declined';
  
  /** Additional type-specific data */
  // For startups
  funding?: string;
  stage?: string;
  
  // For research
  publications?: number;
  citations?: number;
  institution?: string;
  
  // For patents
  owner?: string;
  filingDate?: string;
  patents?: number;
  
  /** Contact information */
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    linkedIn?: string;
  };
  
  /** Notes and observations */
  notes?: string;
}

/**
 * Scouting configuration
 */
export interface ScoutingConfig {
  /** Technology focus areas */
  technologyFocus: TechnologyCategory[];
  
  /** Alert threshold */
  alertThreshold: number;
  
  /** Sources to monitor */
  sources: Array<{
    type: 'patent-db' | 'research-db' | 'news' | 'startup-db';
    name: string;
    enabled: boolean;
  }>;
  
  /** Update frequency */
  updateFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
  
  /** Email notifications */
  emailNotifications: boolean;
  
  /** High priority alerts only */
  highPriorityOnly: boolean;
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

/**
 * Document attachment
 */
export interface Document {
  /** Document ID */
  id: string;
  
  /** File name */
  name: string;
  
  /** File type */
  type: string;
  
  /** File size in bytes */
  size: number;
  
  /** File URL */
  url: string;
  
  /** Upload date */
  uploadedAt: Date;
  
  /** Uploader */
  uploadedBy: string;
}

/**
 * Comment on an entity
 */
export interface Comment {
  /** Comment ID */
  id: string;
  
  /** Comment text */
  text: string;
  
  /** Author */
  author: string;
  
  /** Timestamp */
  timestamp: Date;
  
  /** Parent comment ID for replies */
  parentId?: string;
  
  /** Attachments */
  attachments?: Document[];
}

/**
 * Notification
 */
export interface Notification {
  /** Notification ID */
  id: string;
  
  /** Type */
  type: string;
  
  /** Title */
  title: string;
  
  /** Message */
  message: string;
  
  /** Severity */
  severity: AlertSeverity;
  
  /** Read status */
  isRead: boolean;
  
  /** Timestamp */
  timestamp: Date;
  
  /** Action URL */
  actionUrl?: string;
  
  /** Action label */
  actionLabel?: string;
}

// ============================================================================
// EXPORT TYPE GUARDS
// ============================================================================

/**
 * Type guard for PipelineItem
 */
export function isPipelineItem(item: any): item is PipelineItem {
  return item && 
    typeof item.title === 'string' &&
    typeof item.stage === 'string' &&
    typeof item.priority === 'string' &&
    Array.isArray(item.milestones);
}

/**
 * Type guard for Patent
 */
export function isPatent(item: any): item is Patent {
  return item &&
    typeof item.number === 'string' &&
    typeof item.title === 'string' &&
    typeof item.status === 'string' &&
    typeof item.marketValue === 'number';
}

/**
 * Type guard for Competitor
 */
export function isCompetitor(item: any): item is Competitor {
  return item &&
    typeof item.name === 'string' &&
    typeof item.patentCount === 'number' &&
    Array.isArray(item.techDomains);
}