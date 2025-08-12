// Decision Engine Service for managing sessions and AI interactions

import { 
  EngineId, 
  EngineSession, 
  EngineRecommendation
} from '../types/decisionEngines';

export class DecisionEngineService {

  // Create a new decision engine session
  static async createSession(engineId: EngineId, userId: string): Promise<EngineSession> {
    const session: EngineSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      engineId,
      userId,
      status: 'active',
      startedAt: new Date().toISOString(),
      currentStep: 0,
      totalSteps: 5, // Will be determined by engine
      responses: {},
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          action: 'session_created',
          source: 'system' as const,
          data: { engineId, userId }
        }
      ]
    };

    // Store in localStorage for demo
    this.saveSession(session);
    
    return session;
  }

  // Update an existing session
  static async updateSession(
    sessionId: string, 
    updates: Partial<EngineSession>
  ): Promise<EngineSession> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    const updatedSession = {
      ...session,
      ...updates,
      auditTrail: [
        ...session.auditTrail,
        {
          timestamp: new Date().toISOString(),
          action: 'session_updated',
          source: 'user' as const,
          data: updates
        }
      ]
    };

    this.saveSession(updatedSession);
    
    return updatedSession;
  }

  // Get a session by ID
  static async getSession(sessionId: string): Promise<EngineSession | null> {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  // Get recent sessions for a user
  static async getRecentSessions(userId: string, limit: number = 10): Promise<EngineSession[]> {
    const sessions = this.getAllSessions();
    
    return sessions
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  }

  // Generate AI recommendation based on responses
  static async generateRecommendation(
    engineId: EngineId,
    _responses: Record<string, any>
  ): Promise<EngineRecommendation> {
    // In production, this would call the actual AI service
    // For demo, simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock recommendation based on engine type
    const recommendations: Record<string, Partial<EngineRecommendation>> = {
      patentability: {
        verdict: 'Patentable with Modifications',
        confidence: 0.82,
        reasoning: [
          'The invention shows significant novelty in the claimed technical approach',
          'Non-obviousness is supported by unexpected technical advantages over prior art',
          'Industrial applicability is clearly demonstrated in the target market segment',
          'Minor claim amendments recommended to strengthen differentiation from cited art'
        ],
        keyFindings: [
          {
            title: 'Strong Technical Merit',
            description: 'The invention addresses a genuine technical problem with a novel solution',
            impact: 'high'
          },
          {
            title: 'Prior Art Differentiation',
            description: 'Key features distinguish from closest prior art US10,234,567',
            impact: 'medium'
          },
          {
            title: 'Market Opportunity',
            description: 'Growing market demand with limited competing IP coverage',
            impact: 'high'
          }
        ],
        nextSteps: [
          'Conduct comprehensive freedom-to-operate (FTO) analysis',
          'Draft provisional patent application focusing on novel aspects',
          'Consider PCT filing for international protection within 12 months',
          'Engage with patent attorney to refine claim strategy'
        ],
        citations: [
          {
            id: 'US10234567B2',
            type: 'patent',
            reference: 'US10,234,567 B2 - Related technology with key differences',
            relevance: 0.73,
            excerpt: 'Teaches similar approach but lacks the innovative feature of...'
          },
          {
            id: 'US9876543A1',
            type: 'patent',
            reference: 'US9,876,543 A1 - Background art in the field',
            relevance: 0.45,
            excerpt: 'Provides context for the problem but different solution approach'
          }
        ],
        riskFactors: [
          {
            factor: 'Potential obviousness rejection',
            likelihood: 0.3,
            impact: 0.6,
            mitigation: 'Emphasize unexpected advantages in application'
          },
          {
            factor: 'Competitive filing activity',
            likelihood: 0.4,
            impact: 0.7,
            mitigation: 'File provisional application urgently to establish priority'
          }
        ]
      },
      'filing-strategy': {
        verdict: 'Phased International Filing Recommended',
        confidence: 0.78,
        reasoning: [
          'Budget constraints favor strategic phased approach',
          'Key markets align with PCT member states',
          'PPH eligibility could accelerate examination in target jurisdictions'
        ],
        keyFindings: [
          {
            title: 'Priority Markets',
            description: 'US, EU, and China represent 85% of potential market',
            impact: 'high'
          }
        ],
        nextSteps: [
          'File US provisional application immediately',
          'Submit PCT application within 12 months',
          'Enter national phase in priority markets at 30 months'
        ]
      }
    };

    const baseRecommendation: EngineRecommendation = {
      verdict: 'Analysis Complete',
      confidence: 0.75,
      reasoning: ['Analysis based on provided inputs'],
      keyFindings: [],
      nextSteps: ['Review recommendation', 'Consult with expert'],
      citations: []
    };

    return {
      ...baseRecommendation,
      ...(recommendations[engineId] || {})
    } as EngineRecommendation;
  }

  // Export session data
  static async exportSession(sessionId: string, format: 'json' | 'pdf'): Promise<any> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    const exportData = {
      session: {
        id: session.id,
        engineId: session.engineId,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        status: session.status
      },
      responses: session.responses,
      recommendation: session.recommendation,
      auditTrail: session.auditTrail,
      metadata: {
        exportedAt: new Date().toISOString(),
        format,
        version: '1.0'
      }
    };

    if (format === 'pdf') {
      // In production, generate actual PDF
      console.log('PDF export would be generated here');
    }

    return exportData;
  }

  // Analyze patterns across sessions for insights
  static async getEngineAnalytics(engineId: EngineId): Promise<any> {
    const sessions = this.getAllSessions();
    const engineSessions = sessions.filter(s => s.engineId === engineId);

    const completed = engineSessions.filter(s => s.status === 'completed');
    const avgCompletionTime = completed.reduce((acc, s) => {
      if (s.completedAt) {
        const duration = new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime();
        return acc + duration;
      }
      return acc;
    }, 0) / (completed.length || 1);

    return {
      totalSessions: engineSessions.length,
      completedSessions: completed.length,
      completionRate: completed.length / (engineSessions.length || 1),
      avgCompletionTime: Math.round(avgCompletionTime / 60000), // minutes
      commonResponses: this.analyzeCommonResponses(engineSessions)
    };
  }

  // Helper: Analyze common response patterns
  private static analyzeCommonResponses(sessions: EngineSession[]): any {
    const responsePatterns: Record<string, Record<string, number>> = {};

    sessions.forEach(session => {
      Object.entries(session.responses).forEach(([key, value]) => {
        if (!responsePatterns[key]) {
          responsePatterns[key] = {};
        }
        const valueStr = String(value);
        responsePatterns[key][valueStr] = (responsePatterns[key][valueStr] || 0) + 1;
      });
    });

    return responsePatterns;
  }

  // Helper: Save session to localStorage
  private static saveSession(session: EngineSession): void {
    const sessions = this.getAllSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }

    localStorage.setItem('decision_engine_sessions', JSON.stringify(sessions));
  }

  // Helper: Get all sessions from localStorage
  private static getAllSessions(): EngineSession[] {
    const stored = localStorage.getItem('decision_engine_sessions');
    return stored ? JSON.parse(stored) : [];
  }

  // Clear all sessions (for testing)
  static clearAllSessions(): void {
    localStorage.removeItem('decision_engine_sessions');
  }

  // Validate responses before submission
  static validateResponses(
    engineId: EngineId,
    responses: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Add validation logic based on engine requirements
    // This is a simplified example
    if (engineId === 'patentability') {
      if (!responses.invention_description) {
        errors.push('Invention description is required');
      }
      if (!responses.tech_field) {
        errors.push('Technical field must be specified');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}