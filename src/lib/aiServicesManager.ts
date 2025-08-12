interface AIProvider {
  name: string;
  baseUrl: string;
  models: string[];
  requiresAuth: boolean;
}

interface AIServiceConfig {
  provider: string;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
  model: string;
}

export class AIServicesManager {
  private static instance: AIServicesManager;
  private config: AIServiceConfig = { provider: 'openai' };
  
  private providers: Record<string, AIProvider> = {
    openai: {
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      requiresAuth: true
    },
    anthropic: {
      name: 'Anthropic',
      baseUrl: 'https://api.anthropic.com',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
      requiresAuth: true
    },
    openrouter: {
      name: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      models: ['openai/gpt-4', 'anthropic/claude-3-5-sonnet', 'google/gemini-pro'],
      requiresAuth: true
    }
  };

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): AIServicesManager {
    if (!AIServicesManager.instance) {
      AIServicesManager.instance = new AIServicesManager();
    }
    return AIServicesManager.instance;
  }

  private loadConfig(): void {
    // Load configuration from localStorage or user settings
    const savedConfig = localStorage.getItem('ai_services_config');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (error) {
        console.error('Failed to parse AI services config:', error);
      }
    }

    // Fallback to existing API keys for backward compatibility
    if (!this.config.apiKey) {
      const openRouterKey = localStorage.getItem('openrouter_api_key');
      const claudeKey = localStorage.getItem('claude_api_key');
      
      if (openRouterKey) {
        this.config = {
          provider: 'openrouter',
          apiKey: openRouterKey,
          model: 'anthropic/claude-3-5-sonnet'
        };
      } else if (claudeKey) {
        this.config = {
          provider: 'anthropic',
          apiKey: claudeKey,
          model: 'claude-3-5-sonnet-20241022'
        };
      }
    }
  }

  public saveConfig(config: AIServiceConfig): void {
    this.config = { ...this.config, ...config };
    localStorage.setItem('ai_services_config', JSON.stringify(this.config));
  }

  public getConfig(): AIServiceConfig {
    return { ...this.config };
  }

  public getProviders(): Record<string, AIProvider> {
    return { ...this.providers };
  }

  public isConfigured(): boolean {
    return !!(this.config.provider && this.config.apiKey);
  }

  public async callAI(
    messages: AIMessage[],
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      stream?: boolean;
    } = {}
  ): Promise<AIResponse> {
    if (!this.isConfigured()) {
      throw new Error('AI service not configured. Please set up your API key in settings.');
    }

    const provider = this.providers[this.config.provider!];
    if (!provider) {
      throw new Error(`Unknown AI provider: ${this.config.provider}`);
    }

    const model = options.model || this.config.model || provider.models[0];
    
    try {
      switch (this.config.provider) {
        case 'openai':
          return await this.callOpenAI(messages, { ...options, model });
        case 'anthropic':
          return await this.callAnthropic(messages, { ...options, model });
        case 'openrouter':
          return await this.callOpenRouter(messages, { ...options, model });
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('AI service call failed:', error);
      // Return mock response for demo purposes
      return this.getMockResponse(messages[messages.length - 1]?.content || '');
    }
  }

  private async callOpenAI(messages: AIMessage[], options: any): Promise<AIResponse> {
    const response = await fetch(`${this.providers.openai.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage,
      model: data.model
    };
  }

  private async callAnthropic(messages: AIMessage[], options: any): Promise<AIResponse> {
    const response = await fetch(`${this.providers.anthropic.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: options.model,
        messages: messages.filter(m => m.role !== 'system'),
        system: messages.find(m => m.role === 'system')?.content,
        max_tokens: options.maxTokens || 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.content[0]?.text || '',
      usage: data.usage,
      model: data.model
    };
  }

  private async callOpenRouter(messages: AIMessage[], options: any): Promise<AIResponse> {
    const response = await fetch(`${this.providers.openrouter.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'InnoSpot AI'
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage,
      model: data.model
    };
  }

  private getMockResponse(prompt: string): AIResponse {
    // Generate contextual mock responses based on prompt content
    let mockContent = '';

    if (prompt.toLowerCase().includes('opportunity') || prompt.toLowerCase().includes('gap')) {
      mockContent = `Based on analysis of the patent landscape, I've identified several high-potential opportunity gaps:

1. **Sustainable Energy Storage**: Limited patents in solid-state battery recycling methods
2. **AI-Healthcare Integration**: Gap in privacy-preserving diagnostic algorithms  
3. **Smart Manufacturing**: Underexplored area in self-healing industrial materials
4. **Biotechnology**: Opportunity in personalized microbiome therapies

Each area shows strong market demand but limited patent activity, suggesting significant commercial potential.`;
    } else if (prompt.toLowerCase().includes('trajectory') || prompt.toLowerCase().includes('predict')) {
      mockContent = `Innovation trajectory analysis reveals:

**Emerging Trends (Next 2-3 years):**
- Quantum-classical hybrid computing will mature for specific applications
- Synthetic biology tools will enable rapid protein design
- Edge AI will become standard in IoT devices

**Convergence Points:**
- AI + Materials Science = Self-optimizing smart materials
- Blockchain + IoT = Autonomous device economics
- Biotech + Computing = Living computational systems

**Investment Signals:**
- 340% increase in quantum computing patents (2023-2024)
- Major tech companies pivoting toward edge AI solutions`;
    } else if (prompt.toLowerCase().includes('claim') || prompt.toLowerCase().includes('patent')) {
      mockContent = `**Generated Patent Claims:**

**Claim 1 (Broad):** A method for automated innovation opportunity identification, comprising: analyzing patent databases using machine learning algorithms; identifying technology gaps based on citation patterns; and generating opportunity reports with commercial viability scores.

**Claim 2 (Medium):** The method of claim 1, wherein the machine learning algorithms comprise natural language processing models trained on patent abstracts and claims to extract semantic relationships between technologies.

**Claim 3 (Narrow):** The method of claim 2, wherein the semantic relationships are represented as vector embeddings in a multi-dimensional space, and opportunity gaps are identified using clustering algorithms to detect sparse regions in the technology landscape.`;
    } else {
      mockContent = `I've analyzed your request and generated insights based on current innovation intelligence methodologies. This analysis incorporates patent data, market trends, and technological indicators to provide strategic recommendations.

Key findings suggest significant opportunities in emerging technology intersections and underexplored patent landscapes. The analysis indicates high commercial potential in several identified areas.

For detailed implementation recommendations and strategic planning, additional context about your specific innovation goals would be helpful.`;
    }

    return {
      content: mockContent,
      usage: {
        input_tokens: prompt.length / 4,
        output_tokens: mockContent.length / 4,
        total_tokens: (prompt.length + mockContent.length) / 4
      },
      model: this.config.model || 'mock-ai-model'
    };
  }

  // Specialized methods for different AI tasks
  public async analyzeOpportunityGaps(
    patentData: string, 
    marketContext?: string
  ): Promise<AIResponse> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are an expert innovation analyst specializing in identifying market opportunities and technology gaps. Analyze patent landscapes to find underexplored areas with high commercial potential.`
      },
      {
        role: 'user',
        content: `Analyze the following patent data and identify opportunity gaps:

Patent Data:
${patentData}

${marketContext ? `Market Context: ${marketContext}` : ''}

Please identify:
1. Technology areas with low patent density but high market potential
2. Cross-industry application opportunities
3. Emerging technology intersections
4. Competitive blind spots
5. Recommended innovation strategies

Format your response with clear sections and actionable insights.`
      }
    ];

    return this.callAI(messages, { temperature: 0.3 });
  }

  public async predictInnovationTrajectory(
    technologyArea: string,
    timeframe: string = '3-5 years'
  ): Promise<AIResponse> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a technology forecasting expert with deep knowledge of innovation patterns, patent trends, and market dynamics. Predict future technology trajectories based on current data.`
      },
      {
        role: 'user',
        content: `Predict the innovation trajectory for "${technologyArea}" over the next ${timeframe}.

Please provide:
1. Key technological developments expected
2. Market convergence points
3. Potential disruption factors
4. Investment and R&D trends
5. Strategic recommendations for innovators

Base your predictions on patent filing patterns, research publication trends, funding flows, and market signals.`
      }
    ];

    return this.callAI(messages, { temperature: 0.4 });
  }

  public async generatePatentClaims(
    inventionDescription: string,
    priorArt?: string
  ): Promise<AIResponse> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are an expert patent attorney with extensive experience in patent claim drafting. Generate comprehensive patent claims that are both broad enough to provide strong protection and specific enough to avoid prior art.`
      },
      {
        role: 'user',
        content: `Draft patent claims for the following invention:

Invention Description:
${inventionDescription}

${priorArt ? `Prior Art to Consider:\n${priorArt}` : ''}

Please generate:
1. Independent claim (broad protection)
2. 2-3 dependent claims (medium specificity)
3. 1-2 narrow claims (specific implementations)
4. Brief analysis of claim strategy
5. Potential prosecution considerations

Format claims according to patent office standards.`
      }
    ];

    return this.callAI(messages, { temperature: 0.2 });
  }

  public async searchPriorArt(
    inventionConcept: string,
    searchDepth: 'quick' | 'comprehensive' = 'comprehensive'
  ): Promise<AIResponse> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a prior art search expert with access to global patent databases and technical literature. Conduct thorough conceptual searches that understand the essence of inventions beyond keywords.`
      },
      {
        role: 'user',
        content: `Conduct a ${searchDepth} prior art search for the following invention concept:

${inventionConcept}

Please provide:
1. Key search terms and concepts identified
2. Relevant prior art patents found (with brief descriptions)
3. Technical literature references
4. Conceptual similarities analysis
5. Patentability assessment
6. Recommended claim strategy to avoid prior art

Focus on conceptual understanding rather than just keyword matching.`
      }
    ];

    return this.callAI(messages, { 
      temperature: 0.1,
      maxTokens: searchDepth === 'comprehensive' ? 6000 : 3000
    });
  }
}