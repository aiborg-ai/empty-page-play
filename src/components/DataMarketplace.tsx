import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Database,
  Download,
  Eye,
  Star,
  Globe,
  Calendar,
  DollarSign,
  Play,
  CheckCircle,
  FileText,
  BarChart3,
  Zap,
  RefreshCw,
  Code
} from 'lucide-react';
import { DatasetListing, MarketplaceFilters } from '../types/marketplace';
import HarmonizedCard from './HarmonizedCard';
import PageHeader from './PageHeader';

// Mock data for dataset listings
const mockDatasetListings: DatasetListing[] = [
  {
    id: 'ds-001',
    name: 'Global Patent Intelligence Database',
    description: 'Comprehensive patent data covering 50+ jurisdictions with real-time updates, classification analysis, and citation networks.',
    category: 'patent_data',
    provider: {
      id: 'u-003',
      name: 'PatentScope Analytics',
      email: 'data@patentscope.com',
      avatar: '/api/placeholder/40/40',
      type: 'company',
      verified: true,
      joinDate: '2020-03-15',
      location: 'London, UK'
    },
    recordCount: 125000000,
    fields: [
      { name: 'patent_number', type: 'string', description: 'Unique patent identifier', required: true },
      { name: 'title', type: 'string', description: 'Patent title', required: true },
      { name: 'abstract', type: 'string', description: 'Patent abstract', required: false },
      { name: 'filing_date', type: 'date', description: 'Patent filing date', required: true, format: 'YYYY-MM-DD' },
      { name: 'grant_date', type: 'date', description: 'Patent grant date', required: false, format: 'YYYY-MM-DD' },
      { name: 'inventors', type: 'object', description: 'List of inventors', required: true },
      { name: 'assignees', type: 'object', description: 'List of assignees', required: false },
      { name: 'ipc_codes', type: 'object', description: 'International Patent Classification codes', required: true },
      { name: 'citation_count', type: 'number', description: 'Number of forward citations', required: false }
    ],
    updateFrequency: 'daily',
    lastUpdated: '2024-08-12T23:59:59Z',
    dataQuality: 98,
    coverage: {
      geographicRegions: ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Africa'],
      timeRange: {
        start: '1970-01-01',
        end: '2024-08-12'
      },
      industries: ['Technology', 'Pharmaceuticals', 'Automotive', 'Energy', 'Manufacturing'],
      technologies: ['AI/ML', 'Biotechnology', 'Clean Energy', 'Semiconductors', 'Communications']
    },
    pricing: {
      model: 'subscription',
      tiers: [
        {
          name: 'Starter',
          price: 299,
          period: 'month',
          features: ['Up to 10,000 API calls/month', 'Basic search', 'CSV export', 'Email support'],
          limits: { apiCalls: 10000, downloads: 100 }
        },
        {
          name: 'Professional',
          price: 999,
          period: 'month',
          features: ['Up to 100,000 API calls/month', 'Advanced search', 'Real-time updates', 'Priority support'],
          limits: { apiCalls: 100000, downloads: 1000 }
        },
        {
          name: 'Enterprise',
          price: 2999,
          period: 'month',
          features: ['Unlimited API calls', 'Custom integrations', 'Dedicated account manager', '24/7 support'],
          limits: {}
        }
      ],
      currency: 'USD',
      freeTrialDays: 14
    },
    accessTypes: [
      {
        type: 'api',
        name: 'REST API',
        description: 'RESTful API with JSON responses',
        documentation: 'https://docs.patentscope.com/api',
        rateLimits: { requests: 1000, period: 'hour' }
      },
      {
        type: 'download',
        name: 'Bulk Download',
        description: 'Download datasets in CSV, JSON, or XML format',
        documentation: 'https://docs.patentscope.com/download'
      },
      {
        type: 'dashboard',
        name: 'Analytics Dashboard',
        description: 'Interactive dashboard for data exploration',
        documentation: 'https://docs.patentscope.com/dashboard'
      }
    ],
    sampleData: [
      {
        patent_number: 'US10123456B2',
        title: 'Machine Learning System for Patent Analysis',
        filing_date: '2020-03-15',
        grant_date: '2022-11-08',
        inventors: ['John Smith', 'Jane Doe'],
        assignees: ['TechCorp Inc.'],
        ipc_codes: ['G06N3/08', 'G06Q50/18'],
        citation_count: 23
      }
    ],
    status: 'active',
    listedDate: '2023-09-15',
    downloads: 15420,
    rating: 4.8,
    reviews: [
      {
        id: 'r-001',
        userId: 'u-100',
        userName: 'Research Corp',
        rating: 5,
        comment: 'Excellent data quality and comprehensive coverage. The API is well-documented and reliable.',
        date: '2024-07-15',
        verified: true
      },
      {
        id: 'r-002',
        userId: 'u-101',
        userName: 'IP Analytics Inc',
        rating: 4,
        comment: 'Great dataset, but could use more granular filtering options.',
        date: '2024-06-20',
        verified: true
      }
    ],
    tags: ['Patents', 'Global', 'Real-time', 'High-quality', 'Comprehensive']
  },
  {
    id: 'ds-002',
    name: 'Technology Trend Analysis Dataset',
    description: 'AI-powered analysis of technology trends across industries, including emergence patterns, convergence mapping, and disruption indicators.',
    category: 'technology_trends',
    provider: {
      id: 'u-004',
      name: 'TrendScope AI',
      email: 'contact@trendscopeai.com',
      avatar: '/api/placeholder/40/40',
      type: 'company',
      verified: true,
      joinDate: '2021-08-10',
      location: 'San Francisco, CA'
    },
    recordCount: 2500000,
    fields: [
      { name: 'technology_id', type: 'string', description: 'Unique technology identifier', required: true },
      { name: 'technology_name', type: 'string', description: 'Technology name', required: true },
      { name: 'category', type: 'string', description: 'Technology category', required: true },
      { name: 'emergence_date', type: 'date', description: 'First emergence date', required: true },
      { name: 'growth_rate', type: 'number', description: 'Annual growth rate (%)', required: true },
      { name: 'maturity_level', type: 'string', description: 'Technology maturity stage', required: true },
      { name: 'disruption_score', type: 'number', description: 'Disruption potential (0-100)', required: true },
      { name: 'key_players', type: 'object', description: 'Leading companies/organizations', required: false }
    ],
    updateFrequency: 'weekly',
    lastUpdated: '2024-08-11T12:00:00Z',
    dataQuality: 95,
    coverage: {
      geographicRegions: ['Global'],
      timeRange: {
        start: '2000-01-01',
        end: '2024-08-11'
      },
      industries: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Energy', 'Transportation'],
      technologies: ['AI/ML', 'Quantum Computing', 'Blockchain', 'IoT', 'Robotics', 'Biotechnology']
    },
    pricing: {
      model: 'pay_per_use',
      tiers: [
        {
          name: 'Basic',
          price: 0.10,
          features: ['Per record pricing', 'Standard support', 'CSV format'],
          limits: { records: 1000000 }
        },
        {
          name: 'Premium',
          price: 0.05,
          features: ['Bulk pricing', 'Priority support', 'Multiple formats', 'Real-time alerts'],
          limits: { records: 10000000 }
        }
      ],
      currency: 'USD',
      freeTrialDays: 7
    },
    accessTypes: [
      {
        type: 'api',
        name: 'GraphQL API',
        description: 'Flexible GraphQL API for complex queries',
        documentation: 'https://docs.trendscopeai.com/graphql',
        rateLimits: { requests: 500, period: 'hour' }
      },
      {
        type: 'integration',
        name: 'Data Pipeline',
        description: 'Direct integration with your data warehouse',
        documentation: 'https://docs.trendscopeai.com/pipeline'
      }
    ],
    sampleData: [
      {
        technology_id: 'tech-001',
        technology_name: 'Generative AI',
        category: 'Artificial Intelligence',
        emergence_date: '2017-06-01',
        growth_rate: 127.5,
        maturity_level: 'Growth',
        disruption_score: 95,
        key_players: ['OpenAI', 'Google', 'Microsoft', 'Anthropic']
      }
    ],
    status: 'active',
    listedDate: '2024-01-20',
    downloads: 8750,
    rating: 4.6,
    reviews: [
      {
        id: 'r-003',
        userId: 'u-102',
        userName: 'Strategy Consulting LLC',
        rating: 5,
        comment: 'Invaluable insights for strategic planning. The trend predictions are remarkably accurate.',
        date: '2024-07-30',
        verified: true
      }
    ],
    tags: ['Technology Trends', 'AI Analysis', 'Disruption', 'Strategic Intelligence']
  }
];

export default function DataMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState<DatasetListing | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'schema' | 'sample' | 'pricing'>('overview');

  // Filter datasets based on search and filters
  const filteredDatasets = useMemo(() => {
    let filtered = mockDatasetListings;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(dataset =>
        dataset.name.toLowerCase().includes(query) ||
        dataset.description.toLowerCase().includes(query) ||
        dataset.tags.some(tag => tag.toLowerCase().includes(query)) ||
        dataset.category.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.dataCategory?.length) {
      filtered = filtered.filter(dataset => filters.dataCategory!.includes(dataset.category));
    }

    if (filters.updateFrequency?.length) {
      filtered = filtered.filter(dataset => filters.updateFrequency!.includes(dataset.updateFrequency));
    }

    if (filters.pricingModel?.length) {
      filtered = filtered.filter(dataset => filters.pricingModel!.includes(dataset.pricing.model));
    }

    return filtered;
  }, [searchQuery, filters]);

  const createDatasetStats = (dataset: DatasetListing) => [
    {
      label: 'Records',
      value: dataset.recordCount > 1000000 
        ? `${(dataset.recordCount / 1000000).toFixed(1)}M`
        : `${(dataset.recordCount / 1000).toFixed(0)}K`,
      icon: Database,
      color: 'text-blue-600'
    },
    {
      label: 'Quality Score',
      value: `${dataset.dataQuality}%`,
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      label: 'Downloads',
      value: dataset.downloads.toLocaleString(),
      icon: Download,
      color: 'text-green-600'
    },
    {
      label: 'Rating',
      value: dataset.rating.toFixed(1),
      icon: Star,
      color: 'text-purple-600'
    }
  ];

  const createDatasetKeywords = (dataset: DatasetListing) =>
    dataset.tags.map(tag => ({
      label: tag,
      color: 'bg-green-100 text-green-800'
    }));

  const createDatasetAttributes = (dataset: DatasetListing) => [
    {
      label: 'Category',
      value: dataset.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      icon: BarChart3
    },
    {
      label: 'Update Frequency',
      value: dataset.updateFrequency.charAt(0).toUpperCase() + dataset.updateFrequency.slice(1),
      icon: RefreshCw
    },
    {
      label: 'Pricing Model',
      value: dataset.pricing.model.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      icon: DollarSign
    },
    {
      label: 'Last Updated',
      value: new Date(dataset.lastUpdated).toLocaleDateString(),
      icon: Calendar
    }
  ];

  const createDatasetActions = (dataset: DatasetListing) => [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: () => setSelectedDataset(dataset),
      variant: 'primary' as const,
      isPrimary: true
    },
    {
      id: 'trial',
      label: 'Free Trial',
      icon: Play,
      onClick: () => handleFreeTrial(dataset),
      variant: 'secondary' as const
    },
    {
      id: 'sample',
      label: 'View Sample',
      icon: FileText,
      onClick: () => handleViewSample(dataset),
      variant: 'secondary' as const
    }
  ];

  const handleFreeTrial = (dataset: DatasetListing) => {
    console.log('Starting free trial for:', dataset.id);
  };

  const handleViewSample = (dataset: DatasetListing) => {
    console.log('Viewing sample for:', dataset.id);
  };

  // Removed unused pricing display function

  return (
    <div className="h-full bg-gray-50">
      <PageHeader 
        title="Data Marketplace" 
        subtitle="Discover and access premium patent and innovation datasets"
      />

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search datasets by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    dataCategory: e.target.value ? [e.target.value] : undefined
                  })}
                >
                  <option value="">All Categories</option>
                  <option value="patent_data">Patent Data</option>
                  <option value="market_analysis">Market Analysis</option>
                  <option value="competitor_intelligence">Competitor Intelligence</option>
                  <option value="technology_trends">Technology Trends</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Frequency
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    updateFrequency: e.target.value ? [e.target.value] : undefined
                  })}
                >
                  <option value="">All Frequencies</option>
                  <option value="real-time">Real-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Model
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    pricingModel: e.target.value ? [e.target.value] : undefined
                  })}
                >
                  <option value="">All Models</option>
                  <option value="subscription">Subscription</option>
                  <option value="pay_per_use">Pay Per Use</option>
                  <option value="one_time">One Time</option>
                  <option value="freemium">Freemium</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredDatasets.length} datasets found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded px-3 py-1">
              <option>Relevance</option>
              <option>Most Popular</option>
              <option>Highest Rated</option>
              <option>Recently Updated</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dataset Listings */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDatasets.map((dataset) => (
            <HarmonizedCard
              key={dataset.id}
              title={dataset.name}
              description={dataset.description}
              stats={createDatasetStats(dataset)}
              keywords={createDatasetKeywords(dataset)}
              attributes={createDatasetAttributes(dataset)}
              actions={createDatasetActions(dataset)}
              colorAccent="border-blue-200"
              onTitleClick={() => setSelectedDataset(dataset)}
              className="hover:shadow-lg transition-shadow"
            />
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No datasets found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>

      {/* Dataset Detail Modal */}
      {selectedDataset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedDataset.name}
                  </h2>
                  <p className="text-gray-600">{selectedDataset.description}</p>
                </div>
                <button
                  onClick={() => setSelectedDataset(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mt-6 border-b">
                {['overview', 'schema', 'sample', 'pricing'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab as any)}
                    className={`px-4 py-2 border-b-2 font-medium text-sm ${
                      selectedTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {selectedTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Dataset Overview</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">
                          {selectedDataset.recordCount.toLocaleString()} records
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <RefreshCw className="h-5 w-5 text-green-600" />
                        <span>Updated {selectedDataset.updateFrequency}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-yellow-600" />
                        <span>{selectedDataset.dataQuality}% data quality score</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-purple-600" />
                        <span>{selectedDataset.coverage.geographicRegions.join(', ')}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Coverage Details</h4>
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="font-medium">Time Range:</span> {' '}
                          {selectedDataset.coverage.timeRange.start} to {selectedDataset.coverage.timeRange.end}
                        </div>
                        <div>
                          <span className="font-medium">Industries:</span> {' '}
                          {selectedDataset.coverage.industries.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium">Technologies:</span> {' '}
                          {selectedDataset.coverage.technologies.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Provider Information</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={selectedDataset.provider.avatar} 
                        alt={selectedDataset.provider.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{selectedDataset.provider.name}</div>
                        <div className="text-sm text-gray-600">{selectedDataset.provider.location}</div>
                      </div>
                      {selectedDataset.provider.verified && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Access Methods</h4>
                      <div className="space-y-3">
                        {selectedDataset.accessTypes.map((access, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Code className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="font-medium">{access.name}</div>
                              <div className="text-sm text-gray-600">{access.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'schema' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Data Schema</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 border-b">Field Name</th>
                          <th className="text-left p-3 border-b">Type</th>
                          <th className="text-left p-3 border-b">Required</th>
                          <th className="text-left p-3 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDataset.fields.map((field, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-3 border-b font-mono text-sm">{field.name}</td>
                            <td className="p-3 border-b">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {field.type}
                              </span>
                            </td>
                            <td className="p-3 border-b">
                              {field.required ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <span className="text-gray-400">Optional</span>
                              )}
                            </td>
                            <td className="p-3 border-b text-sm">{field.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedTab === 'sample' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sample Data</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{JSON.stringify(selectedDataset.sampleData, null, 2)}</pre>
                  </div>
                </div>
              )}

              {selectedTab === 'pricing' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pricing Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedDataset.pricing.tiers.map((tier, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="text-center">
                          <h4 className="text-lg font-semibold mb-2">{tier.name}</h4>
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            ${tier.price}
                          </div>
                          {tier.period && (
                            <div className="text-gray-600 text-sm">per {tier.period}</div>
                          )}
                        </div>
                        <ul className="mt-4 space-y-2">
                          {tier.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                          Choose Plan
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedDataset.pricing.freeTrialDays && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <Zap className="h-5 w-5" />
                        <span className="font-medium">
                          {selectedDataset.pricing.freeTrialDays}-day free trial available
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Start Free Trial
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Contact Provider
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Listed {new Date(selectedDataset.listedDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}