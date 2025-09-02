import { UnifiedLLMService } from './llmService';
import type { 
  AIClaimGenerationRequest, 
  AIClaimGenerationResponse, 
  PatentClaim 
} from '../types/innovations';

export class AIClaimGenerator {
  private llmService: UnifiedLLMService;

  constructor() {
    this.llmService = UnifiedLLMService.getInstance();
  }

  async generateClaims(request: AIClaimGenerationRequest): Promise<AIClaimGenerationResponse> {
    try {
      const prompt = this.buildClaimGenerationPrompt(request);
      
      const response = await this.llmService.sendMessage([
        {
          role: 'system',
          content: 'You are an expert patent attorney specializing in claim drafting. Generate precise, legally sound patent claims based on the provided innovation details.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return this.parseClaimResponse(response.content, request);
    } catch (error) {
      throw new Error(`Failed to generate patent claims: ${error}`);
    }
  }

  private buildClaimGenerationPrompt(request: AIClaimGenerationRequest): string {
    return `
Generate ${request.numberOfClaims} patent claims for the following innovation:

**Innovation Description:**
${request.innovation}

**Technical Field:**
${request.technicalField}

**Prior Art to Consider:**
${request.priorArt.map((art, index) => `${index + 1}. ${art}`).join('\n')}

**Inventors:**
${request.inventorNames.join(', ')}

**Style Preference:**
${request.preferredStyle}

Please provide:
1. Independent claims (1-3)
2. Dependent claims that add specific features
3. Confidence score for each claim
4. Suggestions for strengthening claims
5. Potential issues to address
6. Overall strength assessment

Format as JSON with the following structure:
{
  "claims": [
    {
      "claimNumber": 1,
      "claimText": "A method comprising...",
      "claimType": "independent",
      "confidence": 0.85,
      "suggestions": ["Consider adding step X", "Clarify term Y"]
    }
  ],
  "confidence": 0.82,
  "recommendations": ["Overall recommendation 1", "Overall recommendation 2"],
  "potentialIssues": ["Issue 1", "Issue 2"],
  "estimatedStrength": "strong"
}
`;
  }

  private parseClaimResponse(responseContent: string, request: AIClaimGenerationRequest): AIClaimGenerationResponse {
    try {
      // Extract JSON from response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Transform into our type structure
      const claims: PatentClaim[] = parsed.claims.map((claim: any, index: number) => ({
        id: `claim_${Date.now()}_${index}`,
        claimNumber: claim.claimNumber,
        claimText: claim.claimText,
        claimType: claim.claimType || 'independent',
        dependsOn: claim.dependsOn || [],
        confidence: claim.confidence,
        aiGenerated: true,
        reviewed: false,
        suggestions: claim.suggestions || []
      }));

      return {
        claims,
        confidence: parsed.confidence,
        recommendations: parsed.recommendations || [],
        potentialIssues: parsed.potentialIssues || [],
        estimatedStrength: parsed.estimatedStrength || 'moderate'
      };
    } catch (error) {
      // Fallback parsing if JSON parsing fails
      return this.fallbackParsing(responseContent, request);
    }
  }

  private fallbackParsing(_responseContent: string, request: AIClaimGenerationRequest): AIClaimGenerationResponse {
    // Simple fallback parsing
    const claims: PatentClaim[] = [{
      id: `claim_${Date.now()}`,
      claimNumber: 1,
      claimText: `A ${request.technicalField} system comprising: ${request.innovation}`,
      claimType: 'independent',
      confidence: 0.7,
      aiGenerated: true,
      reviewed: false,
      suggestions: ['Review and refine claim language', 'Add specific technical details']
    }];

    return {
      claims,
      confidence: 0.7,
      recommendations: ['Claims require manual review and refinement'],
      potentialIssues: ['AI parsing failed - manual review required'],
      estimatedStrength: 'moderate'
    };
  }

  async refineClaim(claim: PatentClaim, feedback: string): Promise<PatentClaim> {
    try {
      const prompt = `
Refine this patent claim based on the feedback provided:

**Original Claim:**
${claim.claimText}

**Feedback:**
${feedback}

**Current Suggestions:**
${claim.suggestions.join('\n')}

Please provide an improved version with:
1. Refined claim text
2. Updated confidence score
3. New suggestions if any
4. Explanation of changes made

Format as JSON:
{
  "claimText": "improved claim text",
  "confidence": 0.9,
  "suggestions": ["suggestion 1", "suggestion 2"],
  "changesExplanation": "explanation of changes"
}
`;

      const response = await this.llmService.sendMessage([
        {
          role: 'system',
          content: 'You are a patent attorney refining patent claims based on feedback.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...claim,
          claimText: parsed.claimText,
          confidence: parsed.confidence,
          suggestions: parsed.suggestions || claim.suggestions
        };
      }

      return claim;
    } catch (error) {
      console.error('Failed to refine claim:', error);
      return claim;
    }
  }

  async validateClaims(claims: PatentClaim[]): Promise<{ valid: boolean; issues: string[]; recommendations: string[] }> {
    try {
      const prompt = `
Validate these patent claims for common issues:

${claims.map((claim, _index) => `
Claim ${claim.claimNumber}: ${claim.claimText}
`).join('\n')}

Check for:
1. Claim clarity and definiteness
2. Proper claim dependencies
3. Subject matter eligibility
4. Antecedent basis issues
5. Broad vs specific claim balance

Format as JSON:
{
  "valid": true/false,
  "issues": ["issue 1", "issue 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}
`;

      const response = await this.llmService.sendMessage([
        {
          role: 'system',
          content: 'You are a patent examiner validating patent claims for common issues.'
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
        valid: true,
        issues: [],
        recommendations: ['Manual validation recommended']
      };
    } catch (error) {
      console.error('Failed to validate claims:', error);
      return {
        valid: false,
        issues: ['Validation service temporarily unavailable'],
        recommendations: ['Please review claims manually']
      };
    }
  }
}