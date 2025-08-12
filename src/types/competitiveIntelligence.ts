// Competitive Intelligence Dashboard Types

export interface Competitor {
  id: string;
  name: string;
  industry: string;
  headquarters: string;
  foundedYear: number;
  employeeCount: number;
  revenue: number; // Annual revenue in USD
  marketCap?: number;
  website: string;
  description: string;
  logo?: string;
  
  // Patent Portfolio Metrics
  patentMetrics: {
    totalPatents: number;
    activePatents: number;
    patentsLast12Months: number;
    patentsLast5Years: number;
    averagePatentsPerYear: number;
    portfolioGrowthRate: number; // Percentage
    topTechnologies: string[];
    topInventors: string[];
    geographicCoverage: GeographicCoverage[];
  };
  
  // Market Intelligence
  marketIntelligence: {
    marketShare: number;
    competitiveStrength: 'low' | 'medium' | 'high' | 'dominant';
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    innovationIndex: number; // 0-100
    rdSpending: number;
    rdIntensity: number; // R&D as % of revenue
    recentFundings: Funding[];
    partnerships: Partnership[];
    acquisitions: Acquisition[];
  };
  
  // Patent Activity Analysis
  patentActivity: {
    filingTrend: 'increasing' | 'decreasing' | 'stable';
    technologyFocus: TechnologyArea[];
    citationMetrics: {
      averageForwardCitations: number;
      averageBackwardCitations: number;
      selfCitationRate: number;
      citationImpact: number;
    };
    collaborations: CompetitorCollaboration[];
    licensingActivity: LicensingActivity[];
  };
  
  // Strategic Intelligence
  strategicIntelligence: {
    businessStrategy: string[];
    keyInitiatives: string[];
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    recentNews: NewsItem[];
    executiveChanges: ExecutiveChange[];
    productLaunches: ProductLaunch[];
  };
  
  // Competitive Positioning
  competitivePositioning: {
    overallRank: number;
    patentRank: number;
    innovationRank: number;
    marketPositionRank: number;
    technologicalAdvancement: number; // 0-100
    patentQuality: number; // 0-100
    freedom2Operate: 'high' | 'medium' | 'low';
    blockingPotential: number; // 0-100
  };
  
  lastUpdated: string;
  monitoringStatus: 'active' | 'paused' | 'archived';
}

export interface GeographicCoverage {
  jurisdiction: string;
  patentCount: number;
  percentage: number;
  filingTrend: 'up' | 'down' | 'stable';
}

export interface TechnologyArea {
  technology: string;
  patentCount: number;
  percentage: number;
  growthRate: number;
  strategicImportance: 'high' | 'medium' | 'low';
  overlapWithOurPortfolio: number; // 0-100
}

export interface Funding {
  id: string;
  date: string;
  amount: number;
  type: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'ipo' | 'debt' | 'grant';
  investors: string[];
  description: string;
  useOfFunds: string[];
}

export interface Partnership {
  id: string;
  partner: string;
  type: 'research' | 'licensing' | 'joint_venture' | 'strategic' | 'supplier';
  startDate: string;
  endDate?: string;
  description: string;
  technologyAreas: string[];
  strategicValue: 'high' | 'medium' | 'low';
}

export interface Acquisition {
  id: string;
  target: string;
  date: string;
  value?: number;
  status: 'completed' | 'pending' | 'cancelled';
  rationale: string;
  technologyAcquired: string[];
  patentsAcquired?: number;
  impact: 'major' | 'moderate' | 'minor';
}

export interface CompetitorCollaboration {
  collaborator: string;
  jointPatents: number;
  technologyAreas: string[];
  relationship: 'active' | 'historical';
  strength: 'strong' | 'moderate' | 'weak';
}

export interface LicensingActivity {
  id: string;
  type: 'licensing_out' | 'licensing_in' | 'cross_licensing';
  partner: string;
  technologyArea: string;
  date: string;
  value?: number;
  patentCount?: number;
  exclusivity: 'exclusive' | 'non_exclusive' | 'field_exclusive';
  impact: 'high' | 'medium' | 'low';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  url?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: 'financial' | 'product' | 'legal' | 'strategic' | 'technology' | 'regulatory';
  impact: 'high' | 'medium' | 'low';
  tags: string[];
}

export interface ExecutiveChange {
  id: string;
  name: string;
  position: string;
  changeType: 'hired' | 'promoted' | 'departed' | 'retired';
  date: string;
  previousRole?: string;
  previousCompany?: string;
  impact: 'high' | 'medium' | 'low';
  relevantExperience: string[];
}

export interface ProductLaunch {
  id: string;
  productName: string;
  category: string;
  launchDate: string;
  description: string;
  targetMarket: string[];
  technologyAreas: string[];
  competitiveAdvantage: string[];
  patentProtection?: PatentProtection;
  marketImpact: 'high' | 'medium' | 'low';
}

export interface PatentProtection {
  patentCount: number;
  keyPatents: string[];
  protectionStrength: 'strong' | 'moderate' | 'weak';
  vulnerabilities: string[];
}

// Competitive Landscape Analysis
export interface CompetitiveLandscape {
  id: string;
  name: string;
  description: string;
  technologyDomain: string;
  createdAt: string;
  lastUpdated: string;
  
  // Market Overview
  marketOverview: {
    totalMarketSize: number;
    growthRate: number;
    keyTrends: string[];
    marketSegments: MarketSegment[];
    regulatoryEnvironment: string[];
    disruptiveTechnologies: string[];
  };
  
  // Competitive Metrics
  competitiveMetrics: {
    totalCompetitors: number;
    majorPlayers: number;
    emergingPlayers: number;
    totalPatents: number;
    averagePatentAge: number;
    patentConcentration: number; // HHI or similar
    innovationVelocity: number; // Patents per year growth
  };
  
  // Technology Analysis
  technologyAnalysis: {
    coreTechnologies: CoreTechnology[];
    emergingTechnologies: EmergingTechnology[];
    technologyClusters: TechnologyCluster[];
    patentGaps: PatentGap[];
    whiteSpaceOpportunities: WhiteSpaceOpportunity[];
  };
  
  // Competitive Positioning
  competitorRankings: CompetitorRanking[];
  marketLeaders: Competitor[];
  fastestGrowing: Competitor[];
  highestQuality: Competitor[];
  mostAggressive: Competitor[];
  
  // Strategic Insights
  strategicInsights: {
    keyFindlings: string[];
    opportunities: string[];
    threats: string[];
    recommendations: string[];
    actionItems: ActionItem[];
  };
  
  // Monitoring Setup
  monitoringConfig: {
    competitors: string[];
    technologies: string[];
    keywords: string[];
    alertThresholds: AlertThreshold[];
    updateFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

export interface MarketSegment {
  name: string;
  size: number;
  growthRate: number;
  keyPlayers: string[];
  barriers2Entry: string[];
  opportunities: string[];
}

export interface CoreTechnology {
  name: string;
  patentCount: number;
  keyPlayers: CompetitorShare[];
  maturityLevel: 'emerging' | 'developing' | 'mature' | 'declining';
  innovationRate: number;
  commercializationLevel: number;
  barriersToEntry: 'high' | 'medium' | 'low';
}

export interface EmergingTechnology {
  name: string;
  description: string;
  patentCount: number;
  growthRate: number;
  keyPioneers: string[];
  timeToCommercialization: number; // Years
  disruptivePotential: 'high' | 'medium' | 'low';
  investmentLevel: number;
}

export interface TechnologyCluster {
  name: string;
  technologies: string[];
  centerOfGravity: string; // Primary technology
  keyPlayers: string[];
  patentDensity: number;
  interconnectedness: number; // 0-100
  strategicImportance: 'high' | 'medium' | 'low';
}

export interface PatentGap {
  technologyArea: string;
  description: string;
  identifiedNeeds: string[];
  potentialSolutions: string[];
  competitiveAdvantage: number; // 0-100
  difficultToCircumvent: boolean;
  estimatedValue: number;
  timeToFill: number; // Months
}

export interface WhiteSpaceOpportunity {
  id: string;
  name: string;
  description: string;
  technologyArea: string;
  opportunity: string;
  marketPotential: number;
  competitorActivity: 'none' | 'low' | 'medium' | 'high';
  patentLandscape: 'clear' | 'crowded' | 'blocked';
  recommendedAction: string;
  priority: 'high' | 'medium' | 'low';
  estimatedInvestment: number;
  timeframe: string;
}

export interface CompetitorRanking {
  competitor: string;
  overallRank: number;
  patentPortfolioRank: number;
  innovationRank: number;
  marketPositionRank: number;
  qualityRank: number;
  growthRank: number;
  scores: {
    overall: number;
    patentPortfolio: number;
    innovation: number;
    marketPosition: number;
    quality: number;
    growth: number;
  };
  trend: 'up' | 'down' | 'stable';
  changeFromLastPeriod: number;
}

export interface CompetitorShare {
  competitor: string;
  patentCount: number;
  marketShare: number;
  innovationIndex: number;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: 'monitoring' | 'analysis' | 'strategy' | 'legal' | 'business';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  relatedCompetitors: string[];
  relatedTechnologies: string[];
  estimatedEffort: string;
  expectedOutcome: string;
}

export interface AlertThreshold {
  metric: string;
  threshold: number;
  condition: 'greater_than' | 'less_than' | 'percentage_change';
  timeframe: string;
  notification: 'email' | 'dashboard' | 'both';
}

// Dashboard and Analytics
export interface CompetitiveIntelligenceDashboard {
  overview: {
    totalCompetitorsMonitored: number;
    activeThreats: number;
    newCompetitors: number;
    emergingTrends: number;
    patentLandscapeChanges: number;
    alertsLast30Days: number;
  };
  
  // Key Metrics
  keyMetrics: {
    marketConcentration: number;
    innovationVelocity: number;
    averagePatentQuality: number;
    competitiveIntensity: number;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    opportunityIndex: number;
  };
  
  // Recent Activity
  recentActivity: {
    newPatentFilings: PatentFiling[];
    competitorMovements: CompetitorMovement[];
    marketChanges: MarketChange[];
    strategicDevelopments: StrategicDevelopment[];
  };
  
  // Top Insights
  topInsights: Insight[];
  
  // Trending Analysis
  trendingAnalysis: {
    hotTechnologies: TrendingTechnology[];
    emergingCompetitors: EmergingCompetitor[];
    shiftingLandscapes: ShiftingLandscape[];
    disruptiveSignals: DisruptiveSignal[];
  };
  
  // Performance Tracking
  performanceTracking: {
    ourPosition: CompetitivePosition;
    benchmarkMetrics: BenchmarkMetric[];
    competitiveGaps: CompetitiveGap[];
    strengthsOpportunities: StrengthsOpportunities;
  };
}

export interface PatentFiling {
  id: string;
  patentNumber: string;
  applicant: string;
  title: string;
  filingDate: string;
  technologyArea: string;
  significance: 'high' | 'medium' | 'low';
  competitiveImpact: string;
  potentialThreat: boolean;
}

export interface CompetitorMovement {
  id: string;
  competitor: string;
  movementType: 'acquisition' | 'partnership' | 'hiring' | 'funding' | 'divestiture';
  description: string;
  date: string;
  impact: 'high' | 'medium' | 'low';
  strategicImplications: string[];
}

export interface MarketChange {
  id: string;
  changeType: 'regulation' | 'technology_shift' | 'consumer_behavior' | 'economic' | 'competitive';
  description: string;
  date: string;
  affectedMarkets: string[];
  impact: 'positive' | 'negative' | 'neutral';
  implications: string[];
}

export interface StrategicDevelopment {
  id: string;
  competitor: string;
  developmentType: 'product_launch' | 'technology_breakthrough' | 'market_entry' | 'strategic_shift';
  title: string;
  description: string;
  date: string;
  strategicImpact: string;
  ourResponse?: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  category: 'threat' | 'opportunity' | 'trend' | 'gap' | 'recommendation';
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  source: string;
  relatedCompetitors: string[];
  relatedTechnologies: string[];
  actionRequired: boolean;
  recommendedActions: string[];
  timeframe: string;
  businessImpact: string;
}

export interface TrendingTechnology {
  technology: string;
  patentGrowthRate: number;
  keyPlayers: string[];
  marketPotential: number;
  maturityStage: string;
  investmentActivity: number;
  disruptivePotential: 'high' | 'medium' | 'low';
}

export interface EmergingCompetitor {
  name: string;
  industry: string;
  foundedYear: number;
  patentCount: number;
  growthRate: number;
  fundingRaised: number;
  threatLevel: 'high' | 'medium' | 'low';
  keyTechnologies: string[];
  competitiveAdvantages: string[];
}

export interface ShiftingLandscape {
  technologyArea: string;
  description: string;
  keyChanges: string[];
  newLeaders: string[];
  decliningPlayers: string[];
  opportunities: string[];
  timeframe: string;
}

export interface DisruptiveSignal {
  signal: string;
  description: string;
  source: string;
  likelihood: number; // 0-100
  impact: 'transformative' | 'significant' | 'moderate' | 'minor';
  timeframe: string;
  preparationActions: string[];
}

export interface CompetitivePosition {
  overallRanking: number;
  marketPosition: number;
  patentPosition: number;
  innovationRanking: number;
  strengths: string[];
  weaknesses: string[];
  competitiveAdvantages: string[];
  vulnerabilities: string[];
}

export interface BenchmarkMetric {
  metric: string;
  ourValue: number;
  industryAverage: number;
  bestInClass: number;
  ranking: number;
  trend: 'improving' | 'declining' | 'stable';
  gap: number;
}

export interface CompetitiveGap {
  area: string;
  description: string;
  gapSize: 'large' | 'medium' | 'small';
  priority: 'critical' | 'high' | 'medium' | 'low';
  closingStrategy: string;
  timeframe: string;
  requiredInvestment: number;
  expectedBenefit: string;
}

export interface StrengthsOpportunities {
  strengths: {
    competitive: string[];
    technological: string[];
    market: string[];
    operational: string[];
  };
  opportunities: {
    market: string[];
    technology: string[];
    partnership: string[];
    acquisition: string[];
  };
}

// Service Interface
export interface CompetitiveIntelligenceService {
  // Competitor Management
  getCompetitors(filters?: CompetitorFilters): Promise<Competitor[]>;
  getCompetitor(id: string): Promise<Competitor>;
  addCompetitor(competitor: Partial<Competitor>): Promise<Competitor>;
  updateCompetitor(id: string, updates: Partial<Competitor>): Promise<Competitor>;
  deleteCompetitor(id: string): Promise<void>;
  
  // Landscape Analysis
  createLandscapeAnalysis(config: LandscapeConfig): Promise<CompetitiveLandscape>;
  getLandscapeAnalyses(): Promise<CompetitiveLandscape[]>;
  getLandscapeAnalysis(id: string): Promise<CompetitiveLandscape>;
  updateLandscapeAnalysis(id: string, updates: Partial<CompetitiveLandscape>): Promise<CompetitiveLandscape>;
  
  // Dashboard Data
  getDashboardData(): Promise<CompetitiveIntelligenceDashboard>;
  
  // Intelligence Reports
  generateCompetitorProfile(competitorId: string): Promise<CompetitorReport>;
  generateLandscapeReport(landscapeId: string): Promise<LandscapeReport>;
  generateBenchmarkingReport(competitors: string[]): Promise<BenchmarkingReport>;
  
  // Monitoring and Alerts
  setupMonitoring(config: MonitoringConfig): Promise<MonitoringSetup>;
  getAlerts(filters?: AlertFilters): Promise<Alert[]>;
  
  // Analysis Tools
  performSwotAnalysis(competitorId: string): Promise<SwotAnalysis>;
  identifyWhiteSpaces(technologyArea: string): Promise<WhiteSpaceOpportunity[]>;
  benchmarkPortfolio(competitorIds: string[]): Promise<PortfolioBenchmark>;
}

export interface CompetitorFilters {
  industry?: string;
  region?: string;
  patentCountRange?: [number, number];
  revenueRange?: [number, number];
  threatLevel?: string[];
  monitoringStatus?: string;
}

export interface LandscapeConfig {
  name: string;
  description: string;
  technologyDomain: string;
  competitors: string[];
  technologies: string[];
  geographicScope: string[];
  timeframe: string;
}

export interface MonitoringConfig {
  competitors: string[];
  technologies: string[];
  keywords: string[];
  alertTypes: string[];
  frequency: string;
  recipients: string[];
}

export interface MonitoringSetup {
  id: string;
  name: string;
  config: MonitoringConfig;
  status: 'active' | 'paused';
  createdAt: string;
  lastRun: string;
  nextRun: string;
}

export interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  competitor: string;
  technology?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  createdAt: string;
  readAt?: string;
  actionRequired: boolean;
  relatedData: any;
}

export interface AlertFilters {
  type?: string;
  severity?: string[];
  competitor?: string;
  dateRange?: [string, string];
  unreadOnly?: boolean;
}

export interface CompetitorReport {
  competitor: Competitor;
  executiveSummary: string;
  swotAnalysis: SwotAnalysis;
  patentAnalysis: PatentAnalysis;
  marketPosition: MarketPosition;
  strategicRecommendations: string[];
  threatAssessment: ThreatAssessment;
  generatedAt: string;
}

export interface LandscapeReport {
  landscape: CompetitiveLandscape;
  executiveSummary: string;
  keyFindings: string[];
  competitorProfiles: CompetitorSummary[];
  technologyAnalysis: TechnologyAnalysisReport;
  marketOpportunities: MarketOpportunity[];
  strategicRecommendations: string[];
  generatedAt: string;
}

export interface BenchmarkingReport {
  competitors: Competitor[];
  benchmarkMetrics: BenchmarkMetric[];
  competitivePositioning: CompetitivePosition;
  gapAnalysis: CompetitiveGap[];
  recommendations: string[];
  generatedAt: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategicImplications: string[];
  recommendations: string[];
}

export interface PatentAnalysis {
  portfolioOverview: PortfolioOverview;
  technologyBreakdown: TechnologyBreakdown[];
  citationAnalysis: CitationAnalysisResult;
  filingStrategy: FilingStrategy;
  qualityMetrics: QualityMetrics;
  competitiveLandscape: PatentLandscape;
}

export interface PortfolioOverview {
  totalPatents: number;
  activePatents: number;
  averageAge: number;
  geographicDistribution: GeographicDistribution[];
  filingTrend: FilingTrendData[];
  topTechnologies: TechnologyCount[];
}

export interface TechnologyBreakdown {
  technology: string;
  patentCount: number;
  percentage: number;
  avgCitations: number;
  recentActivity: number;
  strategicImportance: 'high' | 'medium' | 'low';
}

export interface CitationAnalysisResult {
  averageForwardCitations: number;
  averageBackwardCitations: number;
  citationImpact: number;
  highlycited: number;
  selfCitationRate: number;
  citationNetwork: CitationNetwork;
}

export interface FilingStrategy {
  geographicStrategy: string;
  technologyFocus: string[];
  filingPace: string;
  continuationStrategy: string;
  priorityFilings: number;
}

export interface QualityMetrics {
  averageClaimCount: number;
  averagePages: number;
  grantRate: number;
  averageExamRounds: number;
  qualityScore: number;
}

export interface PatentLandscape {
  competitorOverlap: CompetitorOverlap[];
  whiteSpaces: string[];
  blockingPatents: BlockingPatent[];
  licensingOpportunities: LicensingOpportunity[];
}

export interface GeographicDistribution {
  jurisdiction: string;
  count: number;
  percentage: number;
}

export interface FilingTrendData {
  year: number;
  applications: number;
  grants: number;
}

export interface TechnologyCount {
  technology: string;
  count: number;
}

export interface CitationNetwork {
  nodes: CitationNode[];
  links: CitationLink[];
}

export interface CitationNode {
  id: string;
  patent: string;
  citations: number;
  importance: number;
}

export interface CitationLink {
  source: string;
  target: string;
  weight: number;
}

export interface CompetitorOverlap {
  competitor: string;
  overlapCount: number;
  overlapPercentage: number;
  technologies: string[];
}

export interface BlockingPatent {
  patentNumber: string;
  owner: string;
  technology: string;
  blockingPower: number;
  workaroundDifficulty: 'high' | 'medium' | 'low';
}

export interface LicensingOpportunity {
  patentNumber: string;
  owner: string;
  technology: string;
  licensingProbability: number;
  estimatedValue: number;
}

export interface MarketPosition {
  marketShare: number;
  competitiveRanking: number;
  strengths: string[];
  weaknesses: string[];
  marketTrends: string[];
  futureOutlook: string;
}

export interface ThreatAssessment {
  overallThreat: 'critical' | 'high' | 'medium' | 'low';
  patentThreat: 'critical' | 'high' | 'medium' | 'low';
  marketThreat: 'critical' | 'high' | 'medium' | 'low';
  innovationThreat: 'critical' | 'high' | 'medium' | 'low';
  mitigationStrategies: string[];
  monitoringRecommendations: string[];
}

export interface CompetitorSummary {
  competitor: Competitor;
  keyMetrics: KeyMetric[];
  recentActivity: string[];
  strategicFocus: string[];
}

export interface TechnologyAnalysisReport {
  coreTechnologies: CoreTechnology[];
  emergingAreas: EmergingTechnology[];
  technologyClusters: TechnologyCluster[];
  innovationHotspots: InnovationHotspot[];
  disruptiveTechnologies: DisruptiveTechnology[];
}

export interface MarketOpportunity {
  id: string;
  title: string;
  description: string;
  marketSize: number;
  growthPotential: number;
  competitionLevel: 'low' | 'medium' | 'high';
  barrierToEntry: 'low' | 'medium' | 'high';
  timeToMarket: number;
  investmentRequired: number;
  strategicFit: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface KeyMetric {
  name: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  benchmark?: number;
}

export interface InnovationHotspot {
  area: string;
  patentActivity: number;
  growthRate: number;
  keyPlayers: string[];
  investmentLevel: number;
  commercialPotential: 'high' | 'medium' | 'low';
}

export interface DisruptiveTechnology {
  technology: string;
  description: string;
  disruptivePotential: number;
  timeframe: string;
  keyPlayers: string[];
  impactAreas: string[];
  preparationActions: string[];
}

export interface PortfolioBenchmark {
  ourPortfolio: PortfolioMetrics;
  competitorPortfolios: CompetitorPortfolioMetrics[];
  benchmarkAnalysis: BenchmarkAnalysis;
  gaps: PortfolioGap[];
  recommendations: PortfolioRecommendation[];
}

export interface PortfolioMetrics {
  totalPatents: number;
  patentQuality: number;
  technologyCoverage: number;
  geographicCoverage: number;
  innovationIndex: number;
  citationImpact: number;
  portfolioValue: number;
}

export interface CompetitorPortfolioMetrics {
  competitor: string;
  metrics: PortfolioMetrics;
  ranking: number;
}

export interface BenchmarkAnalysis {
  ourRanking: number;
  percentilePosition: number;
  strengthAreas: string[];
  improvementAreas: string[];
  competitiveAdvantages: string[];
}

export interface PortfolioGap {
  area: string;
  description: string;
  impactLevel: 'high' | 'medium' | 'low';
  difficulty: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface PortfolioRecommendation {
  type: 'acquire' | 'develop' | 'license' | 'partner' | 'abandon';
  area: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
  timeline: string;
  estimatedCost: number;
  expectedBenefit: string;
}