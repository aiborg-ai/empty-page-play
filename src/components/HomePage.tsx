import { useState, useMemo } from 'react';
import { 
  Search, 
  Bot, 
  Microscope, 
  Database, 
  FileSearch, 
  Code, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Product, ProductCategory } from '../types/subscription';

interface HomePageProps {
  onNavigate?: (section: string) => void;
  onProductSelect?: (product: Product) => void;
  userSubscriptions?: string[];
}

const mockProducts: Product[] = [
  // Agents
  {
    id: 'competitor-researcher',
    name: 'Competitor Researcher',
    description: 'AI agent that analyzes competitor patents, strategies, and innovation patterns',
    category: 'agents',
    price: 99,
    billingPeriod: 'monthly',
    features: ['Automated competitor analysis', 'Patent portfolio comparison', 'Strategic insights', 'Real-time alerts'],
    icon: '🕵️',
    badge: 'Popular'
  },
  {
    id: 'technology-researcher',
    name: 'Technology Researcher',
    description: 'AI agent for deep technology analysis and trend identification',
    category: 'agents',
    price: 89,
    billingPeriod: 'monthly',
    features: ['Technology trend analysis', 'Patent landscape mapping', 'Innovation opportunities', 'Technical reports'],
    icon: '🔬'
  },
  {
    id: 'opportunity-hunter',
    name: 'Opportunity Hunter',
    description: 'AI agent that identifies investment and business opportunities',
    category: 'agents',
    price: 129,
    billingPeriod: 'monthly',
    features: ['Market opportunity analysis', 'Investment insights', 'White space identification', 'ROI predictions'],
    icon: '🎯',
    badge: 'New'
  },

  // Deep-dive Tools
  {
    id: 'patent-search-analysis',
    name: 'Patent Search and Analysis',
    description: 'Advanced patent search with AI-powered analysis capabilities',
    category: 'tools',
    price: 149,
    billingPeriod: 'monthly',
    features: ['Advanced search algorithms', 'AI-powered analysis', 'Citation network analysis', 'Export capabilities'],
    icon: '🔍'
  },
  {
    id: 'literature-search-analysis',
    name: 'Literature Search and Analysis',
    description: 'Comprehensive scientific literature search and analysis platform',
    category: 'tools',
    price: 119,
    billingPeriod: 'monthly',
    features: ['Academic database access', 'Citation analysis', 'Research trend identification', 'Collaboration tools'],
    icon: '📚'
  },
  {
    id: 'innovation-indicators',
    name: 'Innovation Indicators for Investment',
    description: 'AI-driven innovation metrics for investment decision making',
    category: 'tools',
    price: 199,
    billingPeriod: 'monthly',
    features: ['Investment scoring', 'Innovation metrics', 'Risk assessment', 'Portfolio optimization'],
    icon: '📊',
    badge: 'Premium'
  },
  {
    id: 'company-portfolio-analysis',
    name: 'Company Portfolio Analysis',
    description: 'Comprehensive analysis of company patent portfolios and strategies',
    category: 'tools',
    price: 179,
    billingPeriod: 'monthly',
    features: ['Portfolio visualization', 'Competitive positioning', 'Strategic analysis', 'Valuation insights'],
    icon: '🏢'
  },

  // Datasets
  {
    id: 'patents-bibliographic',
    name: 'Patents Bibliographic Dataset',
    description: 'Complete bibliographic data for 165M+ patents worldwide',
    category: 'datasets',
    price: 299,
    billingPeriod: 'monthly',
    features: ['165M+ patents', '100+ jurisdictions', 'Real-time updates', 'API access'],
    icon: '📋'
  },
  {
    id: 'patents-fulltext',
    name: 'Patents Full Text Dataset',
    description: 'Full text patent data with claims, descriptions, and abstracts',
    category: 'datasets',
    price: 499,
    billingPeriod: 'monthly',
    features: ['Full text content', 'OCR processed', 'Searchable content', 'Bulk download'],
    icon: '📄',
    badge: 'Enterprise'
  },
  {
    id: 'patents-legal-status',
    name: 'Patents Legal Status Dataset',
    description: 'Real-time patent legal status information and updates',
    category: 'datasets',
    price: 199,
    billingPeriod: 'monthly',
    features: ['Legal status tracking', 'Real-time updates', 'Historical data', 'Alert system'],
    icon: '⚖️'
  },

  // Reports
  {
    id: 'quarterly-iot-reports',
    name: 'Quarterly Innovation Landscape Reports - IoT',
    description: 'Comprehensive quarterly reports on IoT innovation trends',
    category: 'reports',
    price: 599,
    billingPeriod: 'yearly',
    features: ['Quarterly analysis', 'Trend predictions', 'Market insights', 'Executive summaries'],
    icon: '📈'
  },

  // APIs & MCPs
  {
    id: 'patent-api',
    name: 'Patent Search API',
    description: 'RESTful API for patent search and data retrieval',
    category: 'apis',
    price: 0.05,
    billingPeriod: 'one-time',
    features: ['REST API', 'Real-time search', 'JSON responses', 'Rate limiting'],
    icon: '🔗'
  },
  {
    id: 'innovation-mcp',
    name: 'Innovation Analysis MCP',
    description: 'Model Context Protocol for AI-powered innovation analysis',
    category: 'apis',
    price: 79,
    billingPeriod: 'monthly',
    features: ['MCP integration', 'AI model access', 'Custom workflows', 'Cloud deployment'],
    icon: '⚡',
    badge: 'Beta'
  }
];

const categoryInfo = {
  agents: { title: 'AI Agents', icon: Bot, description: 'Intelligent agents for automated research and analysis' },
  tools: { title: 'Deep-dive Tools', icon: Microscope, description: 'Advanced tools for comprehensive analysis' },
  datasets: { title: 'Datasets', icon: Database, description: 'Premium datasets for research and development' },
  reports: { title: 'Reports', icon: FileSearch, description: 'Professional reports and market intelligence' },
  apis: { title: 'Products for your machines', icon: Code, description: 'APIs and MCPs for integration' }
};

export default function HomePage({ onNavigate, onProductSelect, userSubscriptions = [] }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const productsByCategory = useMemo(() => {
    const categories: Record<ProductCategory, Product[]> = {
      agents: [],
      tools: [],
      datasets: [],
      reports: [],
      apis: []
    };

    mockProducts.forEach(product => {
      product.isSubscribed = userSubscriptions.includes(product.id);
      categories[product.category].push(product);
    });

    return categories;
  }, [userSubscriptions]);

  const handleSubscribe = (product: Product) => {
    if (product.isSubscribed) {
      // Navigate to manage subscription
      onNavigate?.('account-settings');
    } else {
      onProductSelect?.(product);
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {product.name}
          </h3>
          {product.badge && (
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
              product.badge === 'Popular' ? 'bg-orange-100 text-orange-700' :
              product.badge === 'New' ? 'bg-green-100 text-green-700' :
              product.badge === 'Premium' ? 'bg-purple-100 text-purple-700' :
              product.badge === 'Enterprise' ? 'bg-indigo-100 text-indigo-700' :
              product.badge === 'Beta' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-2 mb-6">
          {product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
          {product.features.length > 3 && (
            <div className="text-sm text-blue-600">
              +{product.features.length - 3} more features
            </div>
          )}
        </div>

        <button
          onClick={() => handleSubscribe(product)}
          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            product.isSubscribed
              ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
          }`}
        >
          {product.isSubscribed ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Subscribed
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight className="w-3 h-3" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const CategorySection = ({ category, products }: { category: ProductCategory; products: Product[] }) => {
    const info = categoryInfo[category];
    const IconComponent = info.icon;

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{info.title}</h2>
            <p className="text-gray-600 text-sm">{info.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with AI Search */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-medium text-blue-200">AI-Powered Innovation Intelligence</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Discover. Analyze. Innovate.
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Access cutting-edge AI agents, tools, and datasets to accelerate your innovation journey
            </p>
          </div>

          {/* AI Search Box */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Bot className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-16 pr-6 py-6 text-lg bg-white/10 border border-white/20 rounded-2xl placeholder-white/60 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
                placeholder="Ask AI: 'What are the latest trends in quantum computing patents?'"
              />
              <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
                <button className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-blue-200">
              <span>Try:</span>
              <button className="px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                "Competitor analysis for Tesla"
              </button>
              <button className="px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                "AI patent trends 2024"
              </button>
              <button className="px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                "Investment opportunities in biotech"
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {Object.entries(productsByCategory).map(([category, products]) => (
          products.length > 0 && (
            <CategorySection 
              key={category} 
              category={category as ProductCategory} 
              products={products} 
            />
          )
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">165M+</div>
              <div className="text-gray-600">Patents Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
              <div className="text-gray-600">Jurisdictions Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">AI Agents Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}