// AI-Powered Patent Valuation Engine Types

export interface PatentValuation {
  id: string;
  patentId: string;
  patentNumber: string;
  title: string;
  assignee: string;
  filingDate: string;
  grantDate?: string;
  expiryDate: string;
  
  // Core Valuation Metrics
  estimatedValue: number;
  valuationRange: {
    min: number;
    max: number;
    confidence: number; // 0-1 scale
  };
  
  // Valuation Components
  valuationBreakdown: {
    technicalValue: number;
    marketValue: number;
    legalValue: number;
    strategicValue: number;
    weights: {
      technical: number;
      market: number;
      legal: number;
      strategic: number;
    };
  };
  
  // Market Analysis
  marketAnalysis: {
    marketSize: number; // Total addressable market
    marketGrowthRate: number; // Annual growth percentage
    competitorCount: number;
    marketMaturity: 'emerging' | 'growth' | 'mature' | 'declining';
    adoptionRate: number; // 0-1 scale
    regulatoryRisk: 'low' | 'medium' | 'high';
  };
  
  // Technical Assessment
  technicalAssessment: {
    noveltyScore: number; // 0-100
    complexityScore: number; // 0-100
    implementationDifficulty: 'low' | 'medium' | 'high';
    technicalRisk: number; // 0-1 scale
    alternativesAvailability: 'none' | 'few' | 'many';
    standardsRelevance: boolean;
  };
  
  // Legal Strength
  legalStrength: {
    claimBreadth: number; // 0-100
    claimCount: number;
    independentClaims: number;
    priorArtReferences: number;
    litigationHistory: LitigationRecord[];
    invalidationRisk: 'low' | 'medium' | 'high';
    enforceabilityScore: number; // 0-100
  };
  
  // Citation Analysis
  citationMetrics: {
    forwardCitations: number;
    backwardCitations: number;
    citationVelocity: number; // citations per year
    citationQuality: number; // average quality of citing patents
    selfCitations: number;
    examinerCitations: number;
    applicantCitations: number;
  };
  
  // Revenue Potential
  revenuePotential: {
    licensingRevenue: RevenueProjection;
    litigationRecovery: RevenueProjection;
    strategicValue: number;
    blockingValue: number;
    defensiveValue: number;
  };
  
  // Licensing Analysis
  licensingAnalysis: {
    licensingProbability: number; // 0-1 scale
    potentialLicensees: CompanyProfile[];
    suggestedRoyaltyRate: {
      rate: number; // percentage
      range: { min: number; max: number };
      basis: 'net_sales' | 'gross_sales' | 'units' | 'fixed';
    };
    comparableDeals: ComparableLicense[];
  };
  
  // Risk Assessment
  riskAssessment: {
    invalidationRisk: number; // 0-1 scale
    designAroundRisk: number; // 0-1 scale
    obsolescenceRisk: number; // 0-1 scale
    competitiveRisk: number; // 0-1 scale
    regulatoryRisk: number; // 0-1 scale
    overallRiskScore: number; // 0-1 scale
  };
  
  // Metadata
  valuationDate: string;
  lastUpdated: string;
  valuationMethod: 'cost' | 'market' | 'income' | 'hybrid';
  dataQuality: number; // 0-1 scale
  analystNotes?: string;
  
  // AI Confidence and Explainability
  aiConfidence: number; // 0-1 scale
  keyFactors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
    explanation: string;
  }>;
  
  recommendedActions: PatentAction[];
}

export interface LitigationRecord {
  caseId: string;
  court: string;
  plaintiff: string;
  defendant: string;
  filingDate: string;
  status: 'pending' | 'settled' | 'won' | 'lost' | 'dismissed';
  outcome?: string;
  damages?: number;
}

export interface RevenueProjection {
  year1: number;
  year2: number;
  year3: number;
  year5: number;
  year10: number;
  totalProjected: number;
  confidence: number; // 0-1 scale
}

export interface CompanyProfile {
  name: string;
  industry: string;
  revenue: number;
  marketCap?: number;
  relevanceScore: number; // 0-1 scale
  contactProbability: number; // 0-1 scale
  licensingHistory: boolean;
}

export interface ComparableLicense {
  id: string;
  licensor: string;
  licensee: string;
  technology: string;
  royaltyRate: number;
  dealValue?: number;
  date: string;
  terms: string;
  relevanceScore: number; // 0-1 scale
}

export interface PatentAction {
  type: 'license' | 'sell' | 'maintain' | 'abandon' | 'enforce' | 'defend';
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  expectedOutcome: string;
  estimatedCost: number;
  estimatedRevenue: number;
  description: string;
}

export interface PortfolioValuation {
  id: string;
  portfolioName: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  lastUpdated: string;
  
  // Portfolio Summary
  summary: {
    totalPatents: number;
    activePatents: number;
    totalValue: number;
    averageValue: number;
    valueDensity: number; // value per patent
    portfolioStrength: number; // 0-100 score
  };
  
  // Individual Patent Valuations
  patents: PatentValuation[];
  
  // Portfolio-Level Metrics
  portfolioMetrics: {
    geographicCoverage: Array<{
      jurisdiction: string;
      patentCount: number;
      totalValue: number;
    }>;
    technologyCoverage: Array<{
      technology: string;
      patentCount: number;
      totalValue: number;
      marketPotential: number;
    }>;
    ageDistribution: Array<{
      ageRange: string;
      patentCount: number;
      totalValue: number;
    }>;
    strengthDistribution: Array<{
      strengthRange: string;
      patentCount: number;
      totalValue: number;
    }>;
  };
  
  // Strategic Analysis
  strategicAnalysis: {
    coreStrengths: string[];
    vulnerabilities: string[];
    opportunities: string[];
    threats: string[];
    competitiveAdvantages: string[];
    recommendedActions: PortfolioAction[];
  };
  
  // Benchmarking
  benchmarking: {
    industryAverage: number;
    topQuartile: number;
    peerComparison: Array<{
      peerName: string;
      portfolioValue: number;
      patentCount: number;
      valueDensity: number;
    }>;
    rankingPosition: number;
    industryPercentile: number;
  };
}

export interface PortfolioAction {
  type: 'acquisition' | 'divestiture' | 'licensing' | 'strengthening' | 'pruning';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  estimatedCost: number;
  expectedBenefit: number;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  successProbability: number; // 0-1 scale
}

export interface ValuationParameters {
  method: 'cost' | 'market' | 'income' | 'hybrid';
  discountRate: number;
  riskAdjustment: number;
  marketMultiplier: number;
  technologyWeight: number;
  marketWeight: number;
  legalWeight: number;
  strategicWeight: number;
  timeHorizon: number; // years
  currencies: string; // USD, EUR, etc.
  jurisdiction: string;
  industryFocus?: string[];
  includeObsolescenceRisk: boolean;
  includeRegulatoryRisk: boolean;
}

export interface ValuationComparison {
  patentId: string;
  valuations: Array<{
    method: string;
    value: number;
    confidence: number;
    date: string;
  }>;
  variance: number;
  recommendation: 'accept' | 'review' | 'recalculate';
  notes: string;
}

export interface MarketIntelligence {
  technology: string;
  marketSize: number;
  growthRate: number;
  keyPlayers: Array<{
    name: string;
    marketShare: number;
    patentCount: number;
    averagePatentValue: number;
  }>;
  licensingActivity: Array<{
    year: number;
    dealCount: number;
    totalValue: number;
    averageRoyaltyRate: number;
  }>;
  trends: Array<{
    trend: string;
    impact: 'positive' | 'negative' | 'neutral';
    confidence: number;
  }>;
}

export interface ValuationService {
  // Single Patent Valuation
  valuatePatent(
    patentId: string,
    parameters?: Partial<ValuationParameters>
  ): Promise<PatentValuation>;
  
  // Portfolio Valuation
  valuatePortfolio(
    patentIds: string[],
    portfolioName: string,
    parameters?: Partial<ValuationParameters>
  ): Promise<PortfolioValuation>;
  
  // Batch Valuation
  batchValuate(
    patentIds: string[],
    parameters?: Partial<ValuationParameters>
  ): Promise<PatentValuation[]>;
  
  // Historical Valuations
  getValuationHistory(patentId: string): Promise<ValuationComparison>;
  
  // Market Intelligence
  getMarketIntelligence(technology: string): Promise<MarketIntelligence>;
  
  // Comparable Analysis
  findComparablePatents(
    patentId: string,
    similarity: number
  ): Promise<PatentValuation[]>;
  
  // Update Valuation
  updateValuation(
    valuationId: string,
    parameters: Partial<ValuationParameters>
  ): Promise<PatentValuation>;
  
  // Export Valuations
  exportValuation(
    valuationId: string,
    format: 'pdf' | 'excel' | 'json'
  ): Promise<Blob>;
  
  // Valuation Reports
  generateValuationReport(
    portfolioId: string,
    reportType: 'executive' | 'detailed' | 'comparative'
  ): Promise<ValuationReport>;
}

export interface ValuationReport {
  id: string;
  type: 'executive' | 'detailed' | 'comparative';
  portfolioId: string;
  generatedAt: string;
  summary: {
    totalValue: number;
    keyInsights: string[];
    recommendations: string[];
    riskFactors: string[];
  };
  sections: Array<{
    title: string;
    content: any;
    charts?: any[];
  }>;
  appendices: Array<{
    title: string;
    data: any;
  }>;
}

export interface ValuationDashboard {
  totalPortfolioValue: number;
  valueChange: {
    amount: number;
    percentage: number;
    period: '1d' | '7d' | '30d' | '1y';
  };
  topPerformers: PatentValuation[];
  underperformers: PatentValuation[];
  recentValuations: PatentValuation[];
  alertsAndActions: PatentAction[];
  marketTrends: Array<{
    technology: string;
    trend: 'up' | 'down' | 'stable';
    impact: number;
  }>;
  benchmarking: {
    industryRanking: number;
    peerComparison: number;
    improvement: number;
  };
}