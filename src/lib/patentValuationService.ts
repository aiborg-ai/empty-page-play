// AI-Powered Patent Valuation Service

import {
  PatentValuation,
  PortfolioValuation,
  ValuationParameters,
  ValuationComparison,
  MarketIntelligence,
  ValuationReport,
  ValuationDashboard,
  ValuationService,
  LitigationRecord,
  RevenueProjection,
  CompanyProfile,
  ComparableLicense,
  PatentAction,
  PortfolioAction
} from '../types/patentValuation';

class PatentValuationServiceImpl implements ValuationService {
  private valuations: Map<string, PatentValuation> = new Map();
  private portfolios: Map<string, PortfolioValuation> = new Map();
  private marketIntelligence: Map<string, MarketIntelligence> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize some sample market intelligence data
    this.marketIntelligence.set('artificial-intelligence', {
      technology: 'Artificial Intelligence',
      marketSize: 156000000000, // $156B
      growthRate: 23.5, // 23.5% CAGR
      keyPlayers: [
        { name: 'Google', marketShare: 15.2, patentCount: 8420, averagePatentValue: 2500000 },
        { name: 'Microsoft', marketShare: 12.8, patentCount: 6890, averagePatentValue: 2800000 },
        { name: 'IBM', marketShare: 11.3, patentCount: 9240, averagePatentValue: 1900000 },
        { name: 'OpenAI', marketShare: 8.7, patentCount: 1250, averagePatentValue: 4200000 }
      ],
      licensingActivity: [
        { year: 2023, dealCount: 342, totalValue: 2400000000, averageRoyaltyRate: 3.2 },
        { year: 2022, dealCount: 298, totalValue: 1890000000, averageRoyaltyRate: 2.8 },
        { year: 2021, dealCount: 256, totalValue: 1450000000, averageRoyaltyRate: 2.5 }
      ],
      trends: [
        { trend: 'Large Language Models gaining traction', impact: 'positive', confidence: 0.85 },
        { trend: 'Edge AI deployment increasing', impact: 'positive', confidence: 0.78 },
        { trend: 'Regulatory scrutiny increasing', impact: 'negative', confidence: 0.65 }
      ]
    });

    // Generate sample patent valuations
    this.generateSampleValuations();
  }

  private generateSampleValuations() {
    const samplePatents = [
      {
        id: 'val-1',
        patentNumber: 'US10,123,456B2',
        title: 'Method and System for Neural Network Optimization',
        assignee: 'TechCorp AI Solutions',
        filingDate: '2019-03-15',
        grantDate: '2021-08-22',
        technology: 'artificial-intelligence'
      },
      {
        id: 'val-2',
        patentNumber: 'US10,987,654B1',
        title: 'Blockchain-based Patent Verification System',
        assignee: 'InnovateIP Inc',
        filingDate: '2020-07-10',
        grantDate: '2022-12-15',
        technology: 'blockchain'
      },
      {
        id: 'val-3',
        patentNumber: 'US11,456,789B2',
        title: 'Autonomous Vehicle Navigation Algorithm',
        assignee: 'AutoTech Dynamics',
        filingDate: '2021-01-20',
        grantDate: '2023-06-30',
        technology: 'autonomous-vehicles'
      }
    ];

    samplePatents.forEach(patent => {
      const valuation = this.generateMockValuation(patent);
      this.valuations.set(patent.id, valuation);
    });
  }

  private generateMockValuation(patent: any): PatentValuation {
    // AI-powered valuation simulation
    const baseValue = Math.floor(Math.random() * 5000000) + 500000; // $0.5M - $5.5M
    const confidence = 0.6 + Math.random() * 0.35; // 60-95% confidence
    
    const technicalScore = Math.floor(Math.random() * 40) + 60; // 60-100
    const marketScore = Math.floor(Math.random() * 50) + 50; // 50-100
    const legalScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const strategicScore = Math.floor(Math.random() * 40) + 40; // 40-80

    const weights = {
      technical: 0.25,
      market: 0.35,
      legal: 0.25,
      strategic: 0.15
    };

    const expiryDate = new Date(patent.filingDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 20);

    return {
      id: patent.id,
      patentId: patent.id,
      patentNumber: patent.patentNumber,
      title: patent.title,
      assignee: patent.assignee,
      filingDate: patent.filingDate,
      grantDate: patent.grantDate,
      expiryDate: expiryDate.toISOString().split('T')[0],
      
      estimatedValue: baseValue,
      valuationRange: {
        min: Math.floor(baseValue * 0.7),
        max: Math.floor(baseValue * 1.4),
        confidence
      },
      
      valuationBreakdown: {
        technicalValue: Math.floor(baseValue * weights.technical * (technicalScore / 100)),
        marketValue: Math.floor(baseValue * weights.market * (marketScore / 100)),
        legalValue: Math.floor(baseValue * weights.legal * (legalScore / 100)),
        strategicValue: Math.floor(baseValue * weights.strategic * (strategicScore / 100)),
        weights
      },
      
      marketAnalysis: {
        marketSize: 50000000000 + Math.floor(Math.random() * 100000000000),
        marketGrowthRate: 5 + Math.random() * 25, // 5-30% growth
        competitorCount: Math.floor(Math.random() * 50) + 10,
        marketMaturity: (['emerging', 'growth', 'mature'] as const)[Math.floor(Math.random() * 3)],
        adoptionRate: Math.random(),
        regulatoryRisk: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)]
      },
      
      technicalAssessment: {
        noveltyScore: technicalScore,
        complexityScore: Math.floor(Math.random() * 40) + 60,
        implementationDifficulty: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
        technicalRisk: Math.random() * 0.3 + 0.1, // 10-40% risk
        alternativesAvailability: (['none', 'few', 'many'] as const)[Math.floor(Math.random() * 3)],
        standardsRelevance: Math.random() > 0.5
      },
      
      legalStrength: {
        claimBreadth: legalScore,
        claimCount: Math.floor(Math.random() * 25) + 5,
        independentClaims: Math.floor(Math.random() * 8) + 2,
        priorArtReferences: Math.floor(Math.random() * 50) + 10,
        litigationHistory: [],
        invalidationRisk: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
        enforceabilityScore: legalScore
      },
      
      citationMetrics: {
        forwardCitations: Math.floor(Math.random() * 30),
        backwardCitations: Math.floor(Math.random() * 50) + 10,
        citationVelocity: Math.random() * 10,
        citationQuality: Math.random() * 0.5 + 0.5,
        selfCitations: Math.floor(Math.random() * 5),
        examinerCitations: Math.floor(Math.random() * 20) + 5,
        applicantCitations: Math.floor(Math.random() * 15)
      },
      
      revenuePotential: {
        licensingRevenue: this.generateRevenueProjection(baseValue * 0.1),
        litigationRecovery: this.generateRevenueProjection(baseValue * 0.3),
        strategicValue: Math.floor(baseValue * 0.2),
        blockingValue: Math.floor(baseValue * 0.15),
        defensiveValue: Math.floor(baseValue * 0.1)
      },
      
      licensingAnalysis: {
        licensingProbability: Math.random() * 0.6 + 0.2, // 20-80%
        potentialLicensees: this.generatePotentialLicensees(),
        suggestedRoyaltyRate: {
          rate: Math.random() * 8 + 1, // 1-9%
          range: { min: 0.5, max: 12 },
          basis: 'net_sales'
        },
        comparableDeals: this.generateComparableDeals()
      },
      
      riskAssessment: {
        invalidationRisk: Math.random() * 0.3,
        designAroundRisk: Math.random() * 0.4,
        obsolescenceRisk: Math.random() * 0.5,
        competitiveRisk: Math.random() * 0.6,
        regulatoryRisk: Math.random() * 0.3,
        overallRiskScore: Math.random() * 0.4 + 0.1 // 10-50%
      },
      
      valuationDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
      valuationMethod: 'hybrid',
      dataQuality: confidence,
      
      aiConfidence: confidence,
      keyFactors: [
        {
          factor: 'Strong market demand',
          impact: 'positive',
          weight: 0.25,
          explanation: 'Growing market with high adoption rate increases patent value'
        },
        {
          factor: 'Limited prior art',
          impact: 'positive',
          weight: 0.2,
          explanation: 'Few existing solutions strengthen patent position'
        },
        {
          factor: 'Complex implementation',
          impact: 'negative',
          weight: 0.15,
          explanation: 'High implementation difficulty may limit adoption'
        }
      ],
      
      recommendedActions: this.generateRecommendedActions(baseValue)
    };
  }

  private generateRevenueProjection(baseRevenue: number): RevenueProjection {
    const growthRate = 0.8 + Math.random() * 0.4; // 80-120% growth
    return {
      year1: Math.floor(baseRevenue * growthRate),
      year2: Math.floor(baseRevenue * growthRate * 1.2),
      year3: Math.floor(baseRevenue * growthRate * 1.4),
      year5: Math.floor(baseRevenue * growthRate * 1.8),
      year10: Math.floor(baseRevenue * growthRate * 2.5),
      totalProjected: Math.floor(baseRevenue * growthRate * 8.9),
      confidence: 0.6 + Math.random() * 0.3
    };
  }

  private generatePotentialLicensees(): CompanyProfile[] {
    const companies = [
      'Apple Inc', 'Google LLC', 'Microsoft Corporation', 'Amazon.com Inc',
      'Meta Platforms', 'Tesla Inc', 'NVIDIA Corporation', 'Intel Corporation'
    ];
    
    return companies.slice(0, Math.floor(Math.random() * 5) + 2).map(name => ({
      name,
      industry: 'Technology',
      revenue: Math.floor(Math.random() * 300000000000) + 10000000000, // $10B-$310B
      marketCap: Math.floor(Math.random() * 2000000000000) + 100000000000, // $100B-$2.1T
      relevanceScore: Math.random(),
      contactProbability: Math.random() * 0.8 + 0.1,
      licensingHistory: Math.random() > 0.3
    }));
  }

  private generateComparableDeals(): ComparableLicense[] {
    return Array.from({ length: 3 }, (_, i) => ({
      id: `deal-${i + 1}`,
      licensor: `Company ${i + 1}`,
      licensee: `Licensee ${i + 1}`,
      technology: 'Similar Technology',
      royaltyRate: Math.random() * 8 + 1,
      dealValue: Math.floor(Math.random() * 50000000) + 1000000,
      date: new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      terms: 'Standard licensing terms',
      relevanceScore: Math.random() * 0.4 + 0.6
    }));
  }

  private generateRecommendedActions(value: number): PatentAction[] {
    const actions: PatentAction[] = [];
    
    if (value > 2000000) {
      actions.push({
        type: 'license',
        priority: 'high',
        timeframe: '3-6 months',
        expectedOutcome: 'Generate licensing revenue',
        estimatedCost: 50000,
        estimatedRevenue: value * 0.15,
        description: 'Actively pursue licensing opportunities with identified potential licensees'
      });
    }
    
    if (value > 5000000) {
      actions.push({
        type: 'enforce',
        priority: 'medium',
        timeframe: '6-12 months',
        expectedOutcome: 'Strengthen patent position',
        estimatedCost: 200000,
        estimatedRevenue: value * 0.3,
        description: 'Consider enforcement action against potential infringers'
      });
    }
    
    actions.push({
      type: 'maintain',
      priority: 'medium',
      timeframe: 'Ongoing',
      expectedOutcome: 'Preserve patent rights',
      estimatedCost: 10000,
      estimatedRevenue: 0,
      description: 'Continue maintaining patent through renewal fees'
    });
    
    return actions;
  }

  // Service Implementation

  async valuatePatent(
    patentId: string,
    parameters?: Partial<ValuationParameters>
  ): Promise<PatentValuation> {
    await this.simulateDelay(2000); // AI processing time
    
    // Check if valuation already exists
    let valuation = this.valuations.get(patentId);
    
    if (!valuation) {
      // Generate new valuation
      const mockPatent = {
        id: patentId,
        patentNumber: `US${10000000 + Math.floor(Math.random() * 1000000)}B2`,
        title: 'AI-Generated Patent Valuation',
        assignee: 'Technology Company',
        filingDate: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        grantDate: new Date(Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        technology: 'artificial-intelligence'
      };
      
      valuation = this.generateMockValuation(mockPatent);
      this.valuations.set(patentId, valuation);
    }
    
    // Apply parameters if provided
    if (parameters) {
      valuation = this.applyValuationParameters(valuation, parameters);
    }
    
    return valuation;
  }

  async valuatePortfolio(
    patentIds: string[],
    portfolioName: string,
    parameters?: Partial<ValuationParameters>
  ): Promise<PortfolioValuation> {
    await this.simulateDelay(5000); // Longer processing for portfolios
    
    // Valuate individual patents
    const patents = await Promise.all(
      patentIds.map(id => this.valuatePatent(id, parameters))
    );
    
    const totalValue = patents.reduce((sum, p) => sum + p.estimatedValue, 0);
    const averageValue = totalValue / patents.length;
    
    const portfolio: PortfolioValuation = {
      id: `portfolio-${Date.now()}`,
      portfolioName,
      ownerId: 'current-user',
      ownerName: 'Current User',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      
      summary: {
        totalPatents: patents.length,
        activePatents: patents.filter(p => new Date(p.expiryDate) > new Date()).length,
        totalValue,
        averageValue,
        valueDensity: averageValue,
        portfolioStrength: Math.floor(Math.random() * 30) + 70 // 70-100
      },
      
      patents,
      
      portfolioMetrics: {
        geographicCoverage: [
          { jurisdiction: 'US', patentCount: Math.floor(patents.length * 0.6), totalValue: totalValue * 0.6 },
          { jurisdiction: 'EP', patentCount: Math.floor(patents.length * 0.25), totalValue: totalValue * 0.25 },
          { jurisdiction: 'CN', patentCount: Math.floor(patents.length * 0.15), totalValue: totalValue * 0.15 }
        ],
        technologyCoverage: this.generateTechnologyCoverage(patents, totalValue),
        ageDistribution: this.generateAgeDistribution(patents, totalValue),
        strengthDistribution: this.generateStrengthDistribution(patents, totalValue)
      },
      
      strategicAnalysis: {
        coreStrengths: ['Strong AI patent portfolio', 'High-value strategic patents', 'Good geographic coverage'],
        vulnerabilities: ['Limited coverage in emerging markets', 'Some aging patents'],
        opportunities: ['Growing AI market', 'Licensing opportunities', 'Strategic partnerships'],
        threats: ['Increasing competition', 'Patent invalidation risks', 'Technology obsolescence'],
        competitiveAdvantages: ['First-mover advantage', 'Comprehensive technology coverage'],
        recommendedActions: this.generatePortfolioActions()
      },
      
      benchmarking: {
        industryAverage: averageValue * 0.8,
        topQuartile: averageValue * 1.5,
        peerComparison: this.generatePeerComparison(totalValue, patents.length),
        rankingPosition: Math.floor(Math.random() * 20) + 5, // Top 25
        industryPercentile: Math.floor(Math.random() * 30) + 70 // 70-100th percentile
      }
    };
    
    this.portfolios.set(portfolio.id, portfolio);
    return portfolio;
  }

  async batchValuate(
    patentIds: string[],
    parameters?: Partial<ValuationParameters>
  ): Promise<PatentValuation[]> {
    await this.simulateDelay(patentIds.length * 500); // Scale with number of patents
    
    return Promise.all(
      patentIds.map(id => this.valuatePatent(id, parameters))
    );
  }

  async getValuationHistory(patentId: string): Promise<ValuationComparison> {
    await this.simulateDelay(300);
    
    return {
      patentId,
      valuations: [
        {
          method: 'hybrid',
          value: 2500000,
          confidence: 0.85,
          date: new Date().toISOString()
        },
        {
          method: 'market',
          value: 2200000,
          confidence: 0.78,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          method: 'income',
          value: 2800000,
          confidence: 0.72,
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      variance: 0.12,
      recommendation: 'accept',
      notes: 'Valuations are consistent across different methods'
    };
  }

  async getMarketIntelligence(technology: string): Promise<MarketIntelligence> {
    await this.simulateDelay(500);
    
    return this.marketIntelligence.get(technology) || {
      technology,
      marketSize: 10000000000,
      growthRate: 15.5,
      keyPlayers: [],
      licensingActivity: [],
      trends: []
    };
  }

  async findComparablePatents(
    patentId: string,
    similarity: number
  ): Promise<PatentValuation[]> {
    await this.simulateDelay(800);
    
    // Return similar patents from our dataset
    const allValuations = Array.from(this.valuations.values());
    const targetPatent = this.valuations.get(patentId);
    
    if (!targetPatent) return [];
    
    // Filter by similarity (mock implementation)
    return allValuations
      .filter(v => v.id !== patentId)
      .filter(() => Math.random() > (1 - similarity))
      .slice(0, 5);
  }

  async updateValuation(
    valuationId: string,
    parameters: Partial<ValuationParameters>
  ): Promise<PatentValuation> {
    await this.simulateDelay(1000);
    
    const valuation = this.valuations.get(valuationId);
    if (!valuation) throw new Error('Valuation not found');
    
    const updatedValuation = this.applyValuationParameters(valuation, parameters);
    this.valuations.set(valuationId, updatedValuation);
    
    return updatedValuation;
  }

  async exportValuation(
    valuationId: string,
    format: 'pdf' | 'excel' | 'json'
  ): Promise<Blob> {
    await this.simulateDelay(2000);
    
    const valuation = this.valuations.get(valuationId);
    if (!valuation) throw new Error('Valuation not found');
    
    const content = format === 'json' 
      ? JSON.stringify(valuation, null, 2)
      : `Patent Valuation Report - ${valuation.patentNumber}`;
    
    return new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'application/octet-stream'
    });
  }

  async generateValuationReport(
    portfolioId: string,
    reportType: 'executive' | 'detailed' | 'comparative'
  ): Promise<ValuationReport> {
    await this.simulateDelay(3000);
    
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) throw new Error('Portfolio not found');
    
    return {
      id: `report-${Date.now()}`,
      type: reportType,
      portfolioId,
      generatedAt: new Date().toISOString(),
      summary: {
        totalValue: portfolio.summary.totalValue,
        keyInsights: [
          'Portfolio value has increased 15% over the past year',
          'AI-related patents show highest growth potential',
          'Geographic diversification provides strong market coverage'
        ],
        recommendations: [
          'Focus on licensing high-value AI patents',
          'Consider strategic acquisitions in emerging markets',
          'Strengthen patent positions through continuation applications'
        ],
        riskFactors: [
          'Technology obsolescence in fast-moving sectors',
          'Increased competition may impact licensing rates',
          'Regulatory changes could affect patent enforceability'
        ]
      },
      sections: [
        {
          title: 'Executive Summary',
          content: 'Portfolio overview and key metrics'
        },
        {
          title: 'Individual Patent Analysis',
          content: 'Detailed analysis of each patent'
        },
        {
          title: 'Market Analysis',
          content: 'Technology market trends and opportunities'
        }
      ],
      appendices: [
        {
          title: 'Methodology',
          data: 'Valuation methodology and assumptions'
        }
      ]
    };
  }

  async getDashboard(): Promise<ValuationDashboard> {
    await this.simulateDelay(500);
    
    const allValuations = Array.from(this.valuations.values());
    const totalValue = allValuations.reduce((sum, v) => sum + v.estimatedValue, 0);
    
    return {
      totalPortfolioValue: totalValue,
      valueChange: {
        amount: Math.floor(totalValue * 0.05), // 5% increase
        percentage: 5.2,
        period: '30d'
      },
      topPerformers: allValuations
        .sort((a, b) => b.estimatedValue - a.estimatedValue)
        .slice(0, 3),
      underperformers: allValuations
        .sort((a, b) => a.estimatedValue - b.estimatedValue)
        .slice(0, 3),
      recentValuations: allValuations
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, 5),
      alertsAndActions: allValuations
        .flatMap(v => v.recommendedActions)
        .filter(a => a.priority === 'high')
        .slice(0, 5),
      marketTrends: [
        { technology: 'Artificial Intelligence', trend: 'up', impact: 0.15 },
        { technology: 'Blockchain', trend: 'stable', impact: 0.02 },
        { technology: 'Autonomous Vehicles', trend: 'up', impact: 0.08 }
      ],
      benchmarking: {
        industryRanking: Math.floor(Math.random() * 20) + 5,
        peerComparison: Math.random() * 0.2 + 0.05, // 5-25% above peers
        improvement: Math.random() * 0.15 + 0.05 // 5-20% improvement
      }
    };
  }

  // Helper methods

  private applyValuationParameters(
    valuation: PatentValuation,
    parameters: Partial<ValuationParameters>
  ): PatentValuation {
    // Apply parameter adjustments (simplified implementation)
    const updated = { ...valuation };
    
    if (parameters.discountRate) {
      const adjustment = 1 - (parameters.discountRate / 100);
      updated.estimatedValue = Math.floor(updated.estimatedValue * adjustment);
    }
    
    if (parameters.riskAdjustment) {
      const adjustment = 1 - (parameters.riskAdjustment / 100);
      updated.estimatedValue = Math.floor(updated.estimatedValue * adjustment);
    }
    
    updated.lastUpdated = new Date().toISOString();
    return updated;
  }

  private generateTechnologyCoverage(patents: PatentValuation[], totalValue: number) {
    const technologies = ['AI/ML', 'Blockchain', 'IoT', 'Automotive', 'Healthcare'];
    return technologies.map(tech => ({
      technology: tech,
      patentCount: Math.floor(patents.length / technologies.length) + Math.floor(Math.random() * 3),
      totalValue: totalValue / technologies.length + Math.floor(Math.random() * totalValue * 0.1),
      marketPotential: Math.random() * 50000000000 + 10000000000
    }));
  }

  private generateAgeDistribution(patents: PatentValuation[], totalValue: number) {
    return [
      { ageRange: '0-2 years', patentCount: Math.floor(patents.length * 0.3), totalValue: totalValue * 0.4 },
      { ageRange: '3-5 years', patentCount: Math.floor(patents.length * 0.4), totalValue: totalValue * 0.35 },
      { ageRange: '6-10 years', patentCount: Math.floor(patents.length * 0.2), totalValue: totalValue * 0.2 },
      { ageRange: '10+ years', patentCount: Math.floor(patents.length * 0.1), totalValue: totalValue * 0.05 }
    ];
  }

  private generateStrengthDistribution(patents: PatentValuation[], totalValue: number) {
    return [
      { strengthRange: 'High (80-100)', patentCount: Math.floor(patents.length * 0.25), totalValue: totalValue * 0.5 },
      { strengthRange: 'Medium (60-79)', patentCount: Math.floor(patents.length * 0.5), totalValue: totalValue * 0.35 },
      { strengthRange: 'Low (40-59)', patentCount: Math.floor(patents.length * 0.25), totalValue: totalValue * 0.15 }
    ];
  }

  private generatePortfolioActions(): PortfolioAction[] {
    return [
      {
        type: 'licensing',
        priority: 'high',
        description: 'Pursue licensing opportunities for high-value AI patents',
        estimatedCost: 100000,
        expectedBenefit: 2500000,
        timeframe: '6 months',
        riskLevel: 'medium',
        successProbability: 0.7
      },
      {
        type: 'acquisition',
        priority: 'medium',
        description: 'Acquire complementary patents in emerging technologies',
        estimatedCost: 5000000,
        expectedBenefit: 8000000,
        timeframe: '12 months',
        riskLevel: 'high',
        successProbability: 0.5
      }
    ];
  }

  private generatePeerComparison(totalValue: number, patentCount: number) {
    const peers = ['TechCorp', 'InnovateTech', 'AI Solutions Inc', 'Future Systems'];
    return peers.map(name => ({
      peerName: name,
      portfolioValue: totalValue * (0.7 + Math.random() * 0.6),
      patentCount: patentCount + Math.floor(Math.random() * 100) - 50,
      valueDensity: (totalValue / patentCount) * (0.8 + Math.random() * 0.4)
    }));
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const patentValuationService = new PatentValuationServiceImpl();