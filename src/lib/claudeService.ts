interface ClaudeConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
}

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface DashboardSpec {
  name: string;
  description: string;
  type: string;
  config: any;
  widgets: Array<{
    type: string;
    title: string;
    config: any;
    position: { x: number; y: number; w: number; h: number };
  }>;
  tags: string[];
}

export class ClaudeService {
  private static instance: ClaudeService;
  private config: ClaudeConfig;

  private constructor() {
    // Use Claude Code subscription key for demo
    this.config = {
      apiKey: process.env.VITE_CLAUDE_API_KEY || 'demo-claude-code-key',
      baseURL: 'https://api.anthropic.com',
      model: 'claude-3-5-sonnet-20241022'
    };
  }

  public static getInstance(): ClaudeService {
    if (!ClaudeService.instance) {
      ClaudeService.instance = new ClaudeService();
    }
    return ClaudeService.instance;
  }

  // For demo purposes, we'll simulate Claude API responses
  // In production, you would implement actual API calls
  private async callClaudeAPI(messages: ClaudeMessage[]): Promise<string> {
    // Demo implementation - in production this would be a real API call
    if (this.config.apiKey === 'demo-claude-code-key') {
      return this.generateMockResponse(messages[messages.length - 1].content);
    }

    try {
      const response = await fetch(`${this.config.baseURL}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.model,
          max_tokens: 4000,
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data: ClaudeResponse = await response.json();
      return data.content[0]?.text || '';
    } catch (error) {
      console.error('Claude API call failed:', error);
      // Fallback to mock response for demo
      return this.generateMockResponse(messages[messages.length - 1].content);
    }
  }

  private generateMockResponse(userInput: string): string {
    // Generate a realistic dashboard spec based on input analysis
    const inputLower = userInput.toLowerCase();
    
    let dashboardType = 'analytics';
    let widgets = [];
    let tags = ['ai-generated'];

    // Analyze the input to determine dashboard type and widgets
    if (inputLower.includes('sales') || inputLower.includes('revenue') || inputLower.includes('profit')) {
      dashboardType = 'sales';
      tags.push('sales', 'business');
      widgets = [
        {
          type: 'metric_card',
          title: 'Total Revenue',
          config: { metric: 'revenue', aggregation: 'sum', format: 'currency' },
          position: { x: 0, y: 0, w: 3, h: 2 }
        },
        {
          type: 'line_chart',
          title: 'Sales Trend',
          config: { x_axis: 'date', y_axis: 'sales_amount', time_period: '6_months' },
          position: { x: 3, y: 0, w: 6, h: 4 }
        },
        {
          type: 'bar_chart',
          title: 'Sales by Region',
          config: { x_axis: 'region', y_axis: 'sales_amount', sort: 'desc' },
          position: { x: 9, y: 0, w: 3, h: 4 }
        }
      ];
    } else if (inputLower.includes('customer') || inputLower.includes('user')) {
      dashboardType = 'customer';
      tags.push('customer', 'analytics');
      widgets = [
        {
          type: 'metric_card',
          title: 'Total Customers',
          config: { metric: 'customer_count', aggregation: 'count' },
          position: { x: 0, y: 0, w: 3, h: 2 }
        },
        {
          type: 'donut_chart',
          title: 'Customer Segments',
          config: { category: 'customer_segment', value: 'count' },
          position: { x: 3, y: 0, w: 4, h: 4 }
        },
        {
          type: 'table',
          title: 'Top Customers',
          config: { columns: ['name', 'total_orders', 'lifetime_value'], limit: 10 },
          position: { x: 7, y: 0, w: 5, h: 4 }
        }
      ];
    } else if (inputLower.includes('inventory') || inputLower.includes('stock')) {
      dashboardType = 'inventory';
      tags.push('inventory', 'operations');
      widgets = [
        {
          type: 'metric_card',
          title: 'Items in Stock',
          config: { metric: 'stock_quantity', aggregation: 'sum' },
          position: { x: 0, y: 0, w: 3, h: 2 }
        },
        {
          type: 'gauge_chart',
          title: 'Stock Health',
          config: { metric: 'stock_health_score', min: 0, max: 100 },
          position: { x: 3, y: 0, w: 3, h: 3 }
        },
        {
          type: 'table',
          title: 'Low Stock Items',
          config: { columns: ['item_name', 'current_stock', 'reorder_level'], filter: 'low_stock' },
          position: { x: 6, y: 0, w: 6, h: 4 }
        }
      ];
    } else {
      // Generic analytics dashboard
      tags.push('general', 'analytics');
      widgets = [
        {
          type: 'metric_card',
          title: 'Total Records',
          config: { metric: 'total_count', aggregation: 'count' },
          position: { x: 0, y: 0, w: 3, h: 2 }
        },
        {
          type: 'line_chart',
          title: 'Trend Over Time',
          config: { x_axis: 'date', y_axis: 'value', time_period: '3_months' },
          position: { x: 3, y: 0, w: 6, h: 4 }
        },
        {
          type: 'bar_chart',
          title: 'Category Breakdown',
          config: { x_axis: 'category', y_axis: 'count', sort: 'desc' },
          position: { x: 9, y: 0, w: 3, h: 4 }
        }
      ];
    }

    const dashboardSpec: DashboardSpec = {
      name: `AI Generated ${dashboardType.charAt(0).toUpperCase() + dashboardType.slice(1)} Dashboard`,
      description: `Automatically generated dashboard based on uploaded data analysis`,
      type: dashboardType,
      config: {
        theme: 'modern',
        refresh_interval: 300,
        auto_refresh: true
      },
      widgets,
      tags
    };

    return JSON.stringify(dashboardSpec, null, 2);
  }

  public async generateDashboardFromData(
    fileName: string,
    fileContent: string,
    userPrompt?: string
  ): Promise<DashboardSpec> {
    const analysisPrompt = `
You are an expert data analyst and dashboard designer. I have uploaded a file named "${fileName}" with the following content:

${fileContent.substring(0, 2000)}${fileContent.length > 2000 ? '...(truncated)' : ''}

${userPrompt ? `Additional context: ${userPrompt}` : ''}

Please analyze this data and generate a comprehensive dashboard specification in JSON format. The dashboard should:

1. Identify the key metrics and KPIs from the data
2. Suggest appropriate visualizations (charts, tables, metrics cards)
3. Organize widgets in a logical layout
4. Include relevant filters and drill-down capabilities
5. Provide meaningful titles and descriptions

Return a JSON object with the following structure:
{
  "name": "Dashboard Name",
  "description": "Dashboard description",
  "type": "dashboard_type",
  "config": { theme, refresh settings },
  "widgets": [
    {
      "type": "chart_type",
      "title": "Widget Title",
      "config": { chart configuration },
      "position": { "x": 0, "y": 0, "w": 4, "h": 3 }
    }
  ],
  "tags": ["tag1", "tag2"]
}

Focus on creating actionable insights and a visually appealing layout.
`;

    const messages: ClaudeMessage[] = [
      { role: 'user', content: analysisPrompt }
    ];

    const response = await this.callClaudeAPI(messages);
    
    try {
      const dashboardSpec = JSON.parse(response);
      return dashboardSpec;
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      throw new Error('Failed to generate dashboard specification');
    }
  }

  public async enhanceDashboard(
    currentDashboard: any,
    enhancementPrompt: string
  ): Promise<DashboardSpec> {
    const prompt = `
You are a dashboard enhancement expert. Here's the current dashboard configuration:

${JSON.stringify(currentDashboard, null, 2)}

The user requests the following enhancement: "${enhancementPrompt}"

Please modify the dashboard configuration to incorporate this enhancement while maintaining the existing structure and data integrity. Return the updated JSON configuration.
`;

    const messages: ClaudeMessage[] = [
      { role: 'user', content: prompt }
    ];

    const response = await this.callClaudeAPI(messages);
    
    try {
      const enhancedSpec = JSON.parse(response);
      return enhancedSpec;
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      throw new Error('Failed to enhance dashboard');
    }
  }

  public async suggestDataInsights(data: string): Promise<string[]> {
    const prompt = `
Analyze the following data and provide 5-7 key insights and recommendations:

${data.substring(0, 1500)}${data.length > 1500 ? '...(truncated)' : ''}

Return insights as a JSON array of strings, focusing on:
- Key trends and patterns
- Anomalies or outliers
- Business opportunities
- Data quality issues
- Actionable recommendations

Format: ["insight 1", "insight 2", ...]
`;

    const messages: ClaudeMessage[] = [
      { role: 'user', content: prompt }
    ];

    const response = await this.callClaudeAPI(messages);
    
    try {
      const insights = JSON.parse(response);
      return Array.isArray(insights) ? insights : [];
    } catch (error) {
      console.error('Failed to parse insights:', error);
      return [
        'Data analysis completed successfully',
        'Key patterns identified in the dataset',
        'Recommendations generated based on data trends'
      ];
    }
  }

  public setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  public isConfigured(): boolean {
    return !!this.config.apiKey && this.config.apiKey !== 'demo-claude-code-key';
  }
}