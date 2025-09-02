// Unified LLM Service that supports multiple providers
// Supports OpenAI, OpenRouter, Anthropic, Google, and other providers

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
  provider?: string;
}

export interface LLMConfig {
  provider: 'openai' | 'openrouter' | 'anthropic' | 'google' | 'cohere' | 'custom';
  apiKey: string;
  model?: string;
  baseUrl?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface LLMProvider {
  name: string;
  id: string;
  models: Array<{
    id: string;
    name: string;
    description?: string;
    maxTokens: number;
    costPer1kTokens?: number;
  }>;
  requiresApiKey: boolean;
  baseUrl?: string;
}

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    name: 'OpenAI',
    id: 'openai',
    requiresApiKey: true,
    baseUrl: 'https://api.openai.com/v1',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Most advanced multimodal model',
        maxTokens: 128000,
        costPer1kTokens: 0.005
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Faster, cost-effective model',
        maxTokens: 128000,
        costPer1kTokens: 0.00015
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Advanced reasoning with vision',
        maxTokens: 128000,
        costPer1kTokens: 0.01
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and economical',
        maxTokens: 16000,
        costPer1kTokens: 0.0005
      }
    ]
  },
  {
    name: 'OpenRouter',
    id: 'openrouter',
    requiresApiKey: true,
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        description: 'Anthropic\'s most intelligent model',
        maxTokens: 200000,
        costPer1kTokens: 0.003
      },
      {
        id: 'openai/gpt-4o',
        name: 'GPT-4o (via OpenRouter)',
        description: 'OpenAI GPT-4o via OpenRouter',
        maxTokens: 128000,
        costPer1kTokens: 0.005
      },
      {
        id: 'google/gemini-pro-1.5',
        name: 'Gemini Pro 1.5',
        description: 'Google\'s advanced model',
        maxTokens: 1000000,
        costPer1kTokens: 0.00125
      },
      {
        id: 'meta-llama/llama-3.1-405b-instruct',
        name: 'Llama 3.1 405B',
        description: 'Meta\'s largest open model',
        maxTokens: 128000,
        costPer1kTokens: 0.003
      }
    ]
  },
  {
    name: 'Anthropic',
    id: 'anthropic',
    requiresApiKey: true,
    baseUrl: 'https://api.anthropic.com/v1',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'Most capable model for complex tasks',
        maxTokens: 200000,
        costPer1kTokens: 0.003
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: 'Fastest model for simple tasks',
        maxTokens: 200000,
        costPer1kTokens: 0.00025
      }
    ]
  },
  {
    name: 'Google AI',
    id: 'google',
    requiresApiKey: true,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Advanced reasoning and long context',
        maxTokens: 2000000,
        costPer1kTokens: 0.00125
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Fast and efficient',
        maxTokens: 1000000,
        costPer1kTokens: 0.000075
      }
    ]
  }
];

export class UnifiedLLMService {
  private config: LLMConfig;
  private static instance: UnifiedLLMService | null = null;

  constructor(config?: LLMConfig) {
    this.config = config || this.getDefaultConfig();
  }

  static getInstance(): UnifiedLLMService {
    if (!UnifiedLLMService.instance) {
      UnifiedLLMService.instance = new UnifiedLLMService();
    }
    return UnifiedLLMService.instance;
  }

  private getDefaultConfig(): LLMConfig {
    // Try to load from localStorage first
    const savedConfig = localStorage.getItem('llm-config');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (e) {
        console.warn('Failed to parse saved LLM config');
      }
    }

    // Default configuration
    return {
      provider: 'openai',
      apiKey: localStorage.getItem('openai-api-key') || '',
      model: 'gpt-4o-mini',
      maxTokens: 4000,
      temperature: 0.7
    };
  }

  updateConfig(newConfig: Partial<LLMConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('llm-config', JSON.stringify(this.config));
  }

  getConfig(): LLMConfig {
    return { ...this.config };
  }

  async sendMessage(
    messages: LLMMessage | LLMMessage[] | string,
    options?: Partial<LLMConfig>
  ): Promise<LLMResponse> {
    const config = { ...this.config, ...options };
    
    // Normalize messages to array format
    let messageArray: LLMMessage[];
    if (typeof messages === 'string') {
      messageArray = [{ role: 'user', content: messages }];
    } else if (Array.isArray(messages)) {
      messageArray = messages;
    } else {
      messageArray = [messages];
    }

    // Validate API key
    if (!config.apiKey && LLM_PROVIDERS.find(p => p.id === config.provider)?.requiresApiKey) {
      throw new Error(`API key required for ${config.provider}`);
    }

    // Route to appropriate provider
    switch (config.provider) {
      case 'openai':
        return this.callOpenAI(messageArray, config);
      case 'openrouter':
        return this.callOpenRouter(messageArray, config);
      case 'anthropic':
        return this.callAnthropic(messageArray, config);
      case 'google':
        return this.callGoogle(messageArray, config);
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  private async callOpenAI(messages: LLMMessage[], config: LLMConfig): Promise<LLMResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: messages,
        max_tokens: config.maxTokens || 4000,
        temperature: config.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage,
      model: data.model,
      provider: 'openai'
    };
  }

  private async callOpenRouter(messages: LLMMessage[], config: LLMConfig): Promise<LLMResponse> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'InnoSpot Patent Intelligence',
      },
      body: JSON.stringify({
        model: config.model || 'anthropic/claude-3.5-sonnet',
        messages: messages,
        max_tokens: config.maxTokens || 4000,
        temperature: config.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage,
      model: data.model,
      provider: 'openrouter'
    };
  }

  private async callAnthropic(messages: LLMMessage[], config: LLMConfig): Promise<LLMResponse> {
    // Convert messages format for Anthropic
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-5-sonnet-20241022',
        max_tokens: config.maxTokens || 4000,
        temperature: config.temperature || 0.7,
        system: systemMessage,
        messages: userMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0]?.text || '',
      usage: data.usage ? {
        prompt_tokens: data.usage.input_tokens,
        completion_tokens: data.usage.output_tokens,
        total_tokens: data.usage.input_tokens + data.usage.output_tokens
      } : undefined,
      model: data.model,
      provider: 'anthropic'
    };
  }

  private async callGoogle(messages: LLMMessage[], config: LLMConfig): Promise<LLMResponse> {
    // Convert messages format for Google
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-1.5-pro'}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            maxOutputTokens: config.maxTokens || 4000,
            temperature: config.temperature || 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`Google AI error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.candidates[0]?.content?.parts[0]?.text || '',
      model: config.model,
      provider: 'google'
    };
  }

  // Utility methods
  getAvailableProviders(): LLMProvider[] {
    return LLM_PROVIDERS;
  }

  getModelsForProvider(providerId: string): LLMProvider['models'] {
    const provider = LLM_PROVIDERS.find(p => p.id === providerId);
    return provider?.models || [];
  }

  validateApiKey(provider: string, apiKey: string): boolean {
    if (!apiKey) return false;
    
    // Basic validation patterns
    switch (provider) {
      case 'openai':
        return apiKey.startsWith('sk-') && apiKey.length > 20;
      case 'openrouter':
        return apiKey.startsWith('sk-or-') || (apiKey.startsWith('sk-') && apiKey.length > 20);
      case 'anthropic':
        return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
      case 'google':
        return apiKey.length > 10; // Google API keys are typically 39 chars
      default:
        return apiKey.length > 5;
    }
  }

  async testConnection(provider?: string, apiKey?: string, model?: string): Promise<{
    success: boolean;
    error?: string;
    responseTime?: number;
  }> {
    const testConfig = {
      ...this.config,
      ...(provider && { provider: provider as LLMConfig['provider'] }),
      ...(apiKey && { apiKey }),
      ...(model && { model })
    };

    const startTime = Date.now();
    
    try {
      const response = await this.sendMessage(
        { role: 'user', content: 'Hello! Please respond with just "Hello" to confirm the connection.' },
        testConfig
      );
      
      const responseTime = Date.now() - startTime;
      
      if (response.content.toLowerCase().includes('hello')) {
        return { success: true, responseTime };
      } else {
        return { success: false, error: 'Unexpected response from API' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Cost estimation
  estimateCost(messages: LLMMessage[], model?: string): number {
    const selectedModel = this.getModelsForProvider(this.config.provider).find(
      m => m.id === (model || this.config.model)
    );
    
    if (!selectedModel?.costPer1kTokens) return 0;
    
    // Rough token estimation (4 chars = 1 token)
    const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    const estimatedTokens = Math.ceil(totalChars / 4);
    
    return (estimatedTokens / 1000) * selectedModel.costPer1kTokens;
  }
}