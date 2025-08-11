import { Capability, CapabilityCategory } from '../types/capabilities';

export const MOCK_CAPABILITIES: Capability[] = [
  {
    id: '1',
    name: 'AI Patent Landscape Analyzer',
    description: 'Comprehensive AI-powered patent landscape analysis with competitive intelligence',
    longDescription: 'Advanced machine learning tool that analyzes patent landscapes, identifies trends, and provides competitive intelligence insights.',
    category: 'ai',
    type: 'ai-agent',
    providerId: 'provider1',
    providerName: 'John Doe',
    providerCompany: 'AI Analytics Corp',
    status: 'available',
    isEnabled: true,
    isPurchased: false,
    isShared: false,
    price: {
      amount: 29.99,
      currency: 'USD',
      billingType: 'monthly'
    },
    freeTrialAvailable: true,
    trialDuration: 7,
    version: '2.1.0',
    lastUpdated: '2025-08-01T00:00:00Z',
    requirements: ['Patent dataset', 'Minimum 100 patents'],
    supportedDataTypes: ['Patent XML', 'Patent JSON', 'CSV'],
    estimatedRunTime: '5-15 minutes',
    sampleAssets: [],
    outputTypes: ['Analysis Report', 'Trend Dashboard', 'Competitive Matrix'],
    totalRuns: 1247,
    averageRunTime: 8.5,
    successRate: 0.96,
    userRating: 4.8,
    totalReviews: 156,
    parameters: [
      {
        id: 'analysis_depth',
        name: 'analysis_depth',
        label: 'Analysis Depth',
        type: 'select',
        required: true,
        options: [
          { value: 'basic', label: 'Basic Analysis' },
          { value: 'detailed', label: 'Detailed Analysis' },
          { value: 'comprehensive', label: 'Comprehensive Analysis' }
        ],
        defaultValue: 'detailed',
        description: 'Level of analysis depth',
        helpText: 'Choose how deep the analysis should go'
      },
      {
        id: 'include_competitors',
        name: 'include_competitors',
        label: 'Include Competitor Analysis',
        type: 'boolean',
        required: false,
        defaultValue: true,
        description: 'Include competitive intelligence',
        helpText: 'Analyze competitor patent portfolios'
      }
    ],
    thumbnailUrl: '/api/thumbnails/ai-patent-analyzer.jpg',
    screenshotUrls: [],
    tags: ['AI', 'Analytics', 'Competitive Intelligence'],
    shareSettings: {
      allowSharing: true,
      maxShares: 5,
      currentShares: 2
    }
  },
  {
    id: '2',
    name: 'Patent Citation Network Mapper',
    description: 'Visualize and analyze patent citation networks with interactive graphs',
    longDescription: 'Create interactive citation network visualizations to understand patent relationships and influence.',
    category: 'visualization',
    type: 'tool',
    providerId: 'provider2',
    providerName: 'Sarah Chen',
    providerCompany: 'DataViz Solutions',
    status: 'available',
    isEnabled: true,
    isPurchased: false,
    isShared: false,
    price: {
      amount: 49.99,
      currency: 'USD',
      billingType: 'one-time'
    },
    freeTrialAvailable: false,
    version: '1.5.2',
    lastUpdated: '2025-07-20T00:00:00Z',
    requirements: ['Citation data', 'Minimum 50 patents'],
    supportedDataTypes: ['Patent JSON', 'Citation CSV'],
    estimatedRunTime: '2-5 minutes',
    sampleAssets: [],
    outputTypes: ['Interactive Graph', 'Network Statistics', 'Influence Report'],
    totalRuns: 892,
    averageRunTime: 3.2,
    successRate: 0.98,
    userRating: 4.9,
    totalReviews: 89,
    parameters: [
      {
        id: 'layout_type',
        name: 'layout_type',
        label: 'Graph Layout',
        type: 'select',
        required: true,
        options: [
          { value: 'force', label: 'Force-Directed' },
          { value: 'circular', label: 'Circular' },
          { value: 'hierarchical', label: 'Hierarchical' }
        ],
        defaultValue: 'force',
        description: 'Graph layout algorithm',
        helpText: 'Choose visualization layout style'
      }
    ],
    thumbnailUrl: '/api/thumbnails/citation-mapper.jpg',
    screenshotUrls: [],
    tags: ['Visualization', 'Citations', 'Network Analysis'],
    shareSettings: {
      allowSharing: true,
      maxShares: 3,
      currentShares: 0
    }
  },
  {
    id: '3',
    name: 'Automated Patent Summarizer',
    description: 'AI-powered automatic summarization of patent documents',
    longDescription: 'Uses advanced NLP to create concise, accurate summaries of patent documents.',
    category: 'ai',
    type: 'ai-agent',
    providerId: 'provider3',
    providerName: 'Mike Rodriguez',
    providerCompany: 'NLP Innovations',
    status: 'available',
    isEnabled: true,
    isPurchased: false,
    isShared: true,
    sharedBy: 'colleague@company.com',
    price: {
      amount: 19.99,
      currency: 'USD',
      billingType: 'per-use'
    },
    freeTrialAvailable: true,
    trialDuration: 3,
    version: '3.0.1',
    lastUpdated: '2025-08-05T00:00:00Z',
    requirements: ['Patent text', 'Full patent document'],
    supportedDataTypes: ['Patent PDF', 'Patent XML', 'Plain Text'],
    estimatedRunTime: '30 seconds - 2 minutes',
    sampleAssets: [],
    outputTypes: ['Summary Report', 'Key Points', 'Technical Abstract'],
    totalRuns: 2156,
    averageRunTime: 1.1,
    successRate: 0.94,
    userRating: 4.6,
    totalReviews: 203,
    parameters: [
      {
        id: 'summary_length',
        name: 'summary_length',
        label: 'Summary Length',
        type: 'select',
        required: true,
        options: [
          { value: 'short', label: 'Short (50-100 words)' },
          { value: 'medium', label: 'Medium (100-200 words)' },
          { value: 'long', label: 'Long (200-300 words)' }
        ],
        defaultValue: 'medium',
        description: 'Desired summary length',
        helpText: 'Choose summary length preference'
      }
    ],
    thumbnailUrl: '/api/thumbnails/patent-summarizer.jpg',
    screenshotUrls: [],
    tags: ['AI', 'NLP', 'Summarization'],
    shareSettings: {
      allowSharing: false,
      maxShares: 0,
      currentShares: 0
    }
  },
  {
    id: '4',
    name: 'Global Patent Dataset Explorer',
    description: 'Comprehensive dataset of global patent filings with advanced filtering',
    longDescription: 'Access to 50M+ patent records from major patent offices worldwide with sophisticated search and filtering capabilities.',
    category: 'search',
    type: 'tool',
    providerId: 'provider4',
    providerName: 'Dr. Jennifer Liu',
    providerCompany: 'Patent Data Solutions',
    status: 'available',
    isEnabled: true,
    isPurchased: false,
    isShared: false,
    price: {
      amount: 149.99,
      currency: 'USD',
      billingType: 'monthly'
    },
    freeTrialAvailable: true,
    trialDuration: 14,
    version: '4.2.1',
    lastUpdated: '2025-08-07T00:00:00Z',
    requirements: ['None'],
    supportedDataTypes: ['JSON', 'CSV', 'XML', 'Excel'],
    estimatedRunTime: 'Real-time access',
    sampleAssets: [],
    outputTypes: ['Patent Dataset', 'Filtered Results', 'Export Files'],
    totalRuns: 3842,
    averageRunTime: 0.5,
    successRate: 0.99,
    userRating: 4.9,
    totalReviews: 287,
    parameters: [],
    thumbnailUrl: '/api/thumbnails/patent-dataset.jpg',
    screenshotUrls: [],
    tags: ['Dataset', 'Global', 'Search', 'Patents'],
    shareSettings: {
      allowSharing: true,
      maxShares: 10,
      currentShares: 3
    }
  },
  {
    id: '5',
    name: 'Technology Trends Report Generator',
    description: 'Automated reports on emerging technology trends from patent analysis',
    longDescription: 'Generate comprehensive trend reports combining patent data with market intelligence and expert analysis.',
    category: 'analysis',
    type: 'tool',
    providerId: 'provider5',
    providerName: 'Alex Thompson',
    providerCompany: 'TechTrend Analytics',
    status: 'available',
    isEnabled: true,
    isPurchased: false,
    isShared: false,
    price: {
      amount: 79.99,
      currency: 'USD',
      billingType: 'one-time'
    },
    freeTrialAvailable: true,
    trialDuration: 7,
    version: '2.8.0',
    lastUpdated: '2025-08-06T00:00:00Z',
    requirements: ['Patent data', 'Technology sector selection'],
    supportedDataTypes: ['Patent JSON', 'Market Data'],
    estimatedRunTime: '10-30 minutes',
    sampleAssets: [],
    outputTypes: ['Trend Report', 'Executive Summary', 'Data Visualizations'],
    totalRuns: 1567,
    averageRunTime: 18.5,
    successRate: 0.92,
    userRating: 4.7,
    totalReviews: 143,
    parameters: [
      {
        id: 'tech_sector',
        name: 'tech_sector',
        label: 'Technology Sector',
        type: 'select',
        required: true,
        options: [
          { value: 'ai-ml', label: 'AI & Machine Learning' },
          { value: 'biotech', label: 'Biotechnology' },
          { value: 'clean-energy', label: 'Clean Energy' },
          { value: 'semiconductors', label: 'Semiconductors' }
        ],
        defaultValue: 'ai-ml',
        description: 'Focus sector for trend analysis',
        helpText: 'Select primary technology sector'
      }
    ],
    thumbnailUrl: '/api/thumbnails/tech-trends.jpg',
    screenshotUrls: [],
    tags: ['Reports', 'Trends', 'Technology', 'Analysis'],
    shareSettings: {
      allowSharing: true,
      maxShares: 5,
      currentShares: 1
    }
  },
  {
    id: '6',
    name: 'Deep Dive Innovation Analyzer',
    description: 'Comprehensive deep-dive analysis of innovation patterns and opportunities',
    longDescription: 'Advanced analytical tool that performs deep-dive analysis of innovation landscapes, identifying white spaces and emerging opportunities.',
    category: 'analysis',
    type: 'ai-agent',
    providerId: 'provider6',
    providerName: 'Dr. Maria Gonzalez',
    providerCompany: 'Innovation Insights Lab',
    status: 'available',
    isEnabled: true,
    isPurchased: false,
    isShared: false,
    price: {
      amount: 199.99,
      currency: 'USD',
      billingType: 'per-use'
    },
    freeTrialAvailable: true,
    trialDuration: 3,
    version: '1.4.2',
    lastUpdated: '2025-08-08T00:00:00Z',
    requirements: ['Patent portfolio', 'Market data'],
    supportedDataTypes: ['Patent JSON', 'Market CSV', 'Company Data'],
    estimatedRunTime: '45-90 minutes',
    sampleAssets: [],
    outputTypes: ['Deep Analysis Report', 'Opportunity Map', 'Strategic Recommendations'],
    totalRuns: 234,
    averageRunTime: 67.2,
    successRate: 0.89,
    userRating: 4.8,
    totalReviews: 45,
    parameters: [
      {
        id: 'analysis_scope',
        name: 'analysis_scope',
        label: 'Analysis Scope',
        type: 'select',
        required: true,
        options: [
          { value: 'company', label: 'Company Focus' },
          { value: 'technology', label: 'Technology Focus' },
          { value: 'market', label: 'Market Focus' }
        ],
        defaultValue: 'technology',
        description: 'Primary scope of analysis',
        helpText: 'Choose analysis focus area'
      }
    ],
    thumbnailUrl: '/api/thumbnails/deep-dive.jpg',
    screenshotUrls: [],
    tags: ['Deep Dive', 'Innovation', 'Analysis', 'AI'],
    shareSettings: {
      allowSharing: true,
      maxShares: 3,
      currentShares: 0
    }
  }
];

export const SHOWCASE_CATEGORIES: Array<{ 
  id: CapabilityCategory | 'all'; 
  label: string; 
  icon: any; 
}> = [
  { id: 'all', label: 'All Categories', icon: 'Store' },
  { id: 'ai', label: 'AI Agents', icon: 'Bot' },
  { id: 'analysis', label: 'Tools', icon: 'Wrench' },
  { id: 'visualization', label: 'Datasets', icon: 'Database' },
  { id: 'search', label: 'Reports', icon: 'FileText' },
  { id: 'automation', label: 'Dashboards', icon: 'BarChart3' }
];