import { UnifiedLLMService } from './llmService';
import type { PortfolioOptimization, PortfolioRecommendation } from '../types/innovations';

export class PortfolioOptimizationEngine {
  private llmService: UnifiedLLMService;

  constructor() {
    this.llmService = UnifiedLLMService.getInstance();
  }

  async analyzePortfolio(portfolioData: {
    patents: Array<{
      id: string;
      title: string;
      filingDate: string;
      maintenanceFees: number;
      citations: number;
      legalStatus: string;
      technologyArea: string;
      claims: string[];
    }>;
    budget: number;
    goals: string[];
  }): Promise<PortfolioOptimization> {
    try {
      const prompt = this.buildAnalysisPrompt(portfolioData);
      
      const response = await this.llmService.sendMessage([
        {
          role: 'system',
          content: 'You are a patent portfolio optimization expert. Analyze portfolios and provide strategic recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return this.parseOptimizationResponse(response.content, portfolioData);
    } catch (error) {
      throw new Error(`Failed to analyze portfolio: ${error}`);
    }
  }

  private buildAnalysisPrompt(portfolioData: any): string {
    return `
Analyze this patent portfolio and provide optimization recommendations:

**Portfolio Overview:**
- Total Patents: ${portfolioData.patents.length}
- Annual Budget: $${portfolioData.budget.toLocaleString()}
- Strategic Goals: ${portfolioData.goals.join(', ')}

**Patents:**
${portfolioData.patents.map((patent: any, index: number) => `
${index + 1}. ${patent.title}
   - Filing Date: ${patent.filingDate}
   - Annual Fees: $${patent.maintenanceFees}
   - Citations: ${patent.citations}
   - Status: ${patent.legalStatus}
   - Technology: ${patent.technologyArea}
   - Claims: ${patent.claims.length}
`).join('')}

Provide analysis including:
1. Portfolio value assessment
2. Total maintenance costs
3. Specific recommendations for each patent (file, abandon, license, enforce, maintain)
4. Strength score (0-100)
5. Coverage gaps identification
6. Redundant patents identification

Format as JSON:
{
  "totalValue": 1500000,
  "maintenanceCosts": 50000,
  "recommendedActions": [
    {
      "type": "abandon",
      "patentId": "US123456",
      "priority": "high",
      "reasoning": "Low citation count and high maintenance fees",
      "estimatedImpact": -25000,
      "estimatedCost": 0,
      "timeline": "6 months"
    }
  ],
  "strengthScore": 75,
  "coverageGaps": ["AI hardware accelerators", "Quantum computing"],
  "redundantPatents": ["US123456", "US789012"]
}
`;
  }

  private parseOptimizationResponse(response: string, portfolioData: any): PortfolioOptimization {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        id: `opt_${Date.now()}`,
        portfolioId: `portfolio_${Date.now()}`,
        analysis: {
          totalValue: parsed.totalValue || 1000000,
          maintenanceCosts: parsed.maintenanceCosts || 50000,
          recommendedActions: parsed.recommendedActions?.map((action: any) => ({
            type: action.type,
            patentId: action.patentId,
            priority: action.priority,
            reasoning: action.reasoning,
            estimatedImpact: action.estimatedImpact,
            estimatedCost: action.estimatedCost,
            timeline: action.timeline
          })) || [],
          strengthScore: parsed.strengthScore || 60,
          coverageGaps: parsed.coverageGaps || [],
          redundantPatents: parsed.redundantPatents || []
        },
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
      };
    } catch (error) {
      // Fallback analysis
      return this.generateFallbackAnalysis(portfolioData);
    }
  }

  private generateFallbackAnalysis(portfolioData: any): PortfolioOptimization {
    const totalValue = portfolioData.patents.length * 100000;
    const maintenanceCosts = portfolioData.patents.reduce((sum: number, p: any) => sum + p.maintenanceFees, 0);
    
    return {
      id: `opt_${Date.now()}`,
      portfolioId: `portfolio_${Date.now()}`,
      analysis: {
        totalValue,
        maintenanceCosts,
        recommendedActions: portfolioData.patents.slice(0, 3).map((patent: any) => ({
          type: 'maintain' as const,
          patentId: patent.id,
          priority: 'medium' as const,
          reasoning: 'Continue monitoring patent performance',
          estimatedImpact: 10000,
          estimatedCost: patent.maintenanceFees,
          timeline: '12 months'
        })),
        strengthScore: 65,
        coverageGaps: ['Emerging technologies', 'International markets'],
        redundantPatents: []
      },
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async generateStrategicPlan(
    optimization: PortfolioOptimization,
    timeframe: '1year' | '3years' | '5years'
  ): Promise<{
    phases: Array<{
      phase: number;
      timeframe: string;
      actions: PortfolioRecommendation[];
      expectedOutcome: string;
      budget: number;
    }>;
    totalInvestment: number;
    expectedReturn: number;
    riskAssessment: string;
  }> {
    const actions = optimization.analysis.recommendedActions;
    const phases = this.groupActionsByPhase(actions, timeframe);
    
    return {
      phases,
      totalInvestment: phases.reduce((sum, phase) => sum + phase.budget, 0),
      expectedReturn: phases.reduce((sum, phase) => sum + (phase.budget * 1.5), 0),
      riskAssessment: 'Medium risk with high potential return'
    };
  }

  private groupActionsByPhase(actions: PortfolioRecommendation[], timeframe: string) {
    const phaseCount = timeframe === '1year' ? 2 : timeframe === '3years' ? 3 : 5;
    const phases = [];
    
    for (let i = 0; i < phaseCount; i++) {
      const phaseActions = actions.filter((_, index) => index % phaseCount === i);
      phases.push({
        phase: i + 1,
        timeframe: `${i * (12 / phaseCount)} - ${(i + 1) * (12 / phaseCount)} months`,
        actions: phaseActions,
        expectedOutcome: `Phase ${i + 1} portfolio optimization`,
        budget: phaseActions.reduce((sum, action) => sum + Math.abs(action.estimatedCost), 0)
      });
    }
    
    return phases;
  }
}