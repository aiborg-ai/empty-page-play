interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    if (!apiKey || apiKey.trim().length < 10) {
      throw new Error('Invalid API key provided');
    }
    this.apiKey = apiKey.trim();
  }

  async getChatCompletion(
    model: string,
    messages: OpenRouterMessage[]
  ): Promise<OpenRouterResponse> {
    // Validate input parameters
    if (!model || !messages || messages.length === 0) {
      throw new Error('Invalid parameters: model and messages are required');
    }

    // Validate API key format
    if (!this.isValidApiKey()) {
      throw new Error('Invalid API key format');
    }

    // Security settings for safer AI responses
    const secureRequest: OpenRouterRequest = {
      model,
      messages,
      temperature: 0.7, // Moderate creativity to reduce unpredictable outputs
      max_tokens: 2000, // Limit response length
      top_p: 0.9, // Focus on more probable tokens
      frequency_penalty: 0.1, // Reduce repetition
      presence_penalty: 0.1, // Encourage diverse vocabulary
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'InnoSpot AI Assistant',
        'User-Agent': 'InnoSpot-AI-Chat/1.0',
      },
      body: JSON.stringify(secureRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, response.statusText, errorText);
      
      // Provide user-friendly error messages
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (response.status === 402) {
        throw new Error('Insufficient credits. Please check your OpenRouter account balance.');
      } else if (response.status >= 500) {
        throw new Error('OpenRouter service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    return data;
  }

  private isValidApiKey(): boolean {
    // Basic API key format validation for OpenRouter
    return /^sk-or-[a-zA-Z0-9]{48}$/.test(this.apiKey);
  }

  async getAvailableModels(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  static getPopularModels() {
    return [
      { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
      { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
      { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
      { id: 'google/gemini-pro', name: 'Gemini Pro' },
      { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B' },
    ];
  }
}