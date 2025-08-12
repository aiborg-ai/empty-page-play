// Innovation Features Types for InnoSpot

export interface PatentClaim {
  id: string;
  claimNumber: number;
  claimText: string;
  claimType: 'independent' | 'dependent';
  dependsOn?: number[];
  confidence: number;
  aiGenerated: boolean;
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  suggestions: string[];
}

export interface AIClaimGenerationRequest {
  innovation: string;
  priorArt: string[];
  technicalField: string;
  inventorNames: string[];
  preferredStyle: 'broad' | 'specific' | 'balanced';
  numberOfClaims: number;
}

export interface AIClaimGenerationResponse {
  claims: PatentClaim[];
  confidence: number;
  recommendations: string[];
  potentialIssues: string[];
  estimatedStrength: 'weak' | 'moderate' | 'strong';
}

export interface PatentCollisionAlert {
  id: string;
  patentId: string;
  collisionType: 'exact_match' | 'substantial_overlap' | 'potential_conflict';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendedActions: string[];
  similarPatents: string[];
  confidenceScore: number;
  detectedAt: string;
}

export interface Citation3DNode {
  id: string;
  patentId: string;
  title: string;
  inventors: string[];
  filingDate: string;
  citationCount: number;
  category: string;
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
}

export interface Citation3DEdge {
  source: string;
  target: string;
  weight: number;
  type: 'citation' | 'similarity' | 'inventor' | 'assignee';
}

export interface Citation3DGraph {
  nodes: Citation3DNode[];
  edges: Citation3DEdge[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    clusters: number;
    centerNode: string;
  };
}

export interface BlockchainProvenanceRecord {
  id: string;
  patentId: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: string;
  eventType: 'creation' | 'modification' | 'transfer' | 'license' | 'dispute';
  previousHash?: string;
  data: Record<string, any>;
  verificationStatus: 'pending' | 'verified' | 'failed';
}

export interface PortfolioOptimization {
  id: string;
  portfolioId: string;
  analysis: {
    totalValue: number;
    maintenanceCosts: number;
    recommendedActions: PortfolioRecommendation[];
    strengthScore: number;
    coverageGaps: string[];
    redundantPatents: string[];
  };
  generatedAt: string;
  validUntil: string;
}

export interface PortfolioRecommendation {
  type: 'file' | 'abandon' | 'license' | 'enforce' | 'maintain';
  patentId?: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  estimatedImpact: number;
  estimatedCost: number;
  timeline: string;
}

export interface CollaborativeReview {
  id: string;
  patentId: string;
  reviewType: 'prior_art' | 'claim_analysis' | 'freedom_to_operate' | 'validity';
  status: 'in_progress' | 'completed' | 'paused';
  participants: ReviewParticipant[];
  comments: ReviewComment[];
  decisions: ReviewDecision[];
  createdAt: string;
  deadline?: string;
}

export interface ReviewParticipant {
  userId: string;
  name: string;
  role: 'lead' | 'reviewer' | 'observer';
  permissions: string[];
  joinedAt: string;
  lastActive: string;
}

export interface ReviewComment {
  id: string;
  userId: string;
  content: string;
  section: string;
  timestamp: string;
  resolved: boolean;
  replies: ReviewComment[];
}

export interface ReviewDecision {
  id: string;
  type: string;
  decision: 'approve' | 'reject' | 'modify';
  reasoning: string;
  decidedBy: string;
  decidedAt: string;
}

export interface MarketIntelligence {
  patentId: string;
  marketRelevance: number;
  competitorActivity: CompetitorActivity[];
  investmentOpportunities: InvestmentOpportunity[];
  marketTrends: MarketTrend[];
  commercialPotential: number;
  riskFactors: string[];
  recommendations: string[];
}

export interface CompetitorActivity {
  competitorName: string;
  activityType: 'filing' | 'acquisition' | 'licensing' | 'litigation';
  description: string;
  date: string;
  impact: 'high' | 'medium' | 'low';
}

export interface InvestmentOpportunity {
  type: string;
  description: string;
  estimatedValue: number;
  confidence: number;
  timeline: string;
}

export interface MarketTrend {
  trend: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  strength: number;
  relevance: number;
  timeframe: string;
}

export interface LandscapeMonitor {
  id: string;
  name: string;
  keywords: string[];
  competitors: string[];
  technologyAreas: string[];
  alertSettings: AlertSettings;
  lastRun: string;
  nextRun: string;
  alerts: MonitorAlert[];
}

export interface AlertSettings {
  frequency: 'daily' | 'weekly' | 'monthly';
  threshold: number;
  channels: ('email' | 'push' | 'slack')[];
  filters: MonitorFilter[];
}

export interface MonitorFilter {
  type: 'jurisdiction' | 'date_range' | 'applicant' | 'classification';
  value: any;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
}

export interface MonitorAlert {
  id: string;
  type: 'new_filing' | 'competitor_activity' | 'trend_change' | 'opportunity';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  patentIds: string[];
  actionRequired: boolean;
  createdAt: string;
  acknowledgedAt?: string;
}

export interface LicensingOpportunity {
  id: string;
  patentId: string;
  licenseType: 'exclusive' | 'non_exclusive' | 'field_limited';
  price: number;
  currency: string;
  duration: number;
  territory: string[];
  description: string;
  licensorId: string;
  status: 'available' | 'negotiating' | 'licensed' | 'expired';
  interestedParties: string[];
  createdAt: string;
}

export interface LicensingMarketplace {
  opportunities: LicensingOpportunity[];
  valuationModel: ValuationModel;
  matchingAlgorithm: MatchingResult[];
}

export interface ValuationModel {
  patentId: string;
  estimatedValue: number;
  confidence: number;
  factors: ValuationFactor[];
  methodology: string;
  lastUpdated: string;
}

export interface ValuationFactor {
  factor: string;
  weight: number;
  score: number;
  justification: string;
}

export interface MatchingResult {
  licenseId: string;
  buyerId: string;
  matchScore: number;
  reasoning: string[];
  compatibility: number;
}

export interface VoiceCommand {
  command: string;
  intent: 'search' | 'analyze' | 'create' | 'navigate' | 'compare';
  parameters: Record<string, any>;
  confidence: number;
  timestamp: string;
}

export interface VoiceSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  commands: VoiceCommand[];
  context: Record<string, any>;
  results: VoiceResult[];
}

export interface VoiceResult {
  commandId: string;
  success: boolean;
  response: string;
  data?: any;
  timestamp: string;
}