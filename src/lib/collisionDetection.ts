import { UnifiedLLMService } from './llmService';
import type { PatentCollisionAlert } from '../types/innovations';

export class PatentCollisionDetector {
  private llmService: UnifiedLLMService;
  private monitoringActive: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.llmService = UnifiedLLMService.getInstance();
  }

  async detectCollisions(
    patentText: string, 
    claims: string[], 
    patentId: string
  ): Promise<PatentCollisionAlert[]> {
    try {
      const prompt = this.buildCollisionDetectionPrompt(patentText, claims);
      
      const response = await this.llmService.sendMessage([
        {
          role: 'system',
          content: 'You are a patent collision detection AI specializing in identifying potential patent conflicts and overlaps.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return this.parseCollisionResponse(response.content, patentId);
    } catch (error) {
      throw new Error(`Failed to detect collisions: ${error}`);
    }
  }

  private buildCollisionDetectionPrompt(patentText: string, claims: string[]): string {
    return `
Analyze the following patent for potential collisions with existing patents:

**Patent Description:**
${patentText}

**Claims:**
${claims.map((claim, index) => `${index + 1}. ${claim}`).join('\n')}

Please identify:
1. Potential exact matches with existing patents
2. Substantial overlaps that could lead to conflicts
3. Prior art that might invalidate claims
4. Similar inventions that could cause issues

For each potential collision, provide:
- Collision type (exact_match, substantial_overlap, potential_conflict)
- Severity level (low, medium, high, critical)
- Description of the conflict
- Recommended actions
- Confidence score (0-1)

Format as JSON:
{
  "collisions": [
    {
      "collisionType": "substantial_overlap",
      "severity": "high",
      "description": "Description of the collision",
      "recommendedActions": ["action1", "action2"],
      "similarPatents": ["patent1", "patent2"],
      "confidenceScore": 0.85
    }
  ]
}
`;
  }

  private parseCollisionResponse(response: string, patentId: string): PatentCollisionAlert[] {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return parsed.collisions?.map((collision: any, index: number) => ({
        id: `collision_${Date.now()}_${index}`,
        patentId,
        collisionType: collision.collisionType || 'potential_conflict',
        severity: collision.severity || 'medium',
        description: collision.description || 'Potential patent conflict detected',
        recommendedActions: collision.recommendedActions || [],
        similarPatents: collision.similarPatents || [],
        confidenceScore: collision.confidenceScore || 0.5,
        detectedAt: new Date().toISOString()
      })) || [];
    } catch (error) {
      console.error('Failed to parse collision response:', error);
      return [];
    }
  }

  async startRealTimeMonitoring(
    patents: Array<{ id: string; text: string; claims: string[] }>,
    callback: (alerts: PatentCollisionAlert[]) => void
  ): Promise<void> {
    if (this.monitoringActive) {
      return;
    }

    this.monitoringActive = true;
    
    // Check every 5 minutes for new collisions
    this.monitoringInterval = setInterval(async () => {
      try {
        const allAlerts: PatentCollisionAlert[] = [];
        
        for (const patent of patents) {
          const alerts = await this.detectCollisions(patent.text, patent.claims, patent.id);
          allAlerts.push(...alerts);
        }
        
        if (allAlerts.length > 0) {
          callback(allAlerts);
        }
      } catch (error) {
        console.error('Error in real-time monitoring:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  stopRealTimeMonitoring(): void {
    this.monitoringActive = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  async analyzePriorArt(
    patentText: string, 
    claims: string[]
  ): Promise<{ priorArt: string[]; invalidatingReferences: string[]; strengthScore: number }> {
    try {
      const prompt = `
Analyze prior art for this patent:

**Patent Description:**
${patentText}

**Claims:**
${claims.map((claim, index) => `${index + 1}. ${claim}`).join('\n')}

Identify:
1. Relevant prior art references
2. References that might invalidate claims
3. Overall patent strength score (0-100)

Format as JSON:
{
  "priorArt": ["reference1", "reference2"],
  "invalidatingReferences": ["ref1", "ref2"],
  "strengthScore": 75
}
`;

      const response = await this.llmService.sendMessage([
        {
          role: 'system',
          content: 'You are a patent prior art analysis expert.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        priorArt: [],
        invalidatingReferences: [],
        strengthScore: 50
      };
    } catch (error) {
      console.error('Failed to analyze prior art:', error);
      return {
        priorArt: [],
        invalidatingReferences: [],
        strengthScore: 0
      };
    }
  }

  async generateInvalidityReport(
    _patentId: string,
    claims: string[],
    priorArt: string[]
  ): Promise<{ 
    invalidClaims: number[]; 
    validClaims: number[]; 
    report: string; 
    confidence: number 
  }> {
    try {
      const prompt = `
Generate an invalidity analysis for these patent claims:

**Claims:**
${claims.map((claim, index) => `${index + 1}. ${claim}`).join('\n')}

**Prior Art:**
${priorArt.map((art, index) => `${index + 1}. ${art}`).join('\n')}

Provide:
1. List of invalid claim numbers
2. List of valid claim numbers
3. Detailed invalidity report
4. Confidence level (0-1)

Format as JSON:
{
  "invalidClaims": [1, 3],
  "validClaims": [2, 4, 5],
  "report": "Detailed analysis...",
  "confidence": 0.8
}
`;

      const response = await this.llmService.sendMessage([
        {
          role: 'system',
          content: 'You are a patent invalidity analysis expert.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        invalidClaims: [],
        validClaims: Array.from({ length: claims.length }, (_, i) => i + 1),
        report: 'Analysis could not be completed',
        confidence: 0
      };
    } catch (error) {
      console.error('Failed to generate invalidity report:', error);
      return {
        invalidClaims: [],
        validClaims: [],
        report: 'Error generating report',
        confidence: 0
      };
    }
  }

  async checkFreedomToOperate(
    technology: string,
    jurisdiction: string = 'US'
  ): Promise<{
    clearToOperate: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    blockingPatents: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = `
Perform a Freedom to Operate analysis:

**Technology:** ${technology}
**Jurisdiction:** ${jurisdiction}

Analyze:
1. Whether the technology is clear to operate
2. Risk level assessment
3. Blocking patents that might prevent commercialization
4. Recommendations to mitigate risks

Format as JSON:
{
  "clearToOperate": true/false,
  "riskLevel": "low/medium/high",
  "blockingPatents": ["patent1", "patent2"],
  "recommendations": ["recommendation1", "recommendation2"]
}
`;

      const response = await this.llmService.sendMessage([
        {
          role: 'system',
          content: 'You are a Freedom to Operate analysis expert.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        clearToOperate: true,
        riskLevel: 'medium',
        blockingPatents: [],
        recommendations: ['Conduct detailed prior art search']
      };
    } catch (error) {
      console.error('Failed to check freedom to operate:', error);
      return {
        clearToOperate: false,
        riskLevel: 'high',
        blockingPatents: [],
        recommendations: ['Manual analysis required']
      };
    }
  }
}