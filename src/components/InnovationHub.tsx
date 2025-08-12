import { useState, useEffect } from 'react';
import VoiceSearchButton from './VoiceSearchButton';
import HelpIcon from './utils/HelpIcon';
import SearchFilterBar from './common/SearchFilterBar';
import { 
  Sparkles, 
  Shield, 
  Network, 
  Link, 
  TrendingUp,
  Users,
  BarChart3,
  Bell,
  Store,
  Mic,
  MicOff,
  ChevronRight,
  Zap,
  Globe,
  X
} from 'lucide-react';

interface InnovationHubProps {
  currentUser: any;
  projectId?: string;
  onNavigateToFeature: (feature: string) => void;
}

const INNOVATION_FEATURES = [
  {
    id: 'ai-claim-generator',
    title: 'AI Patent Claim Generator',
    description: 'Generate precise patent claims using advanced AI assistance',
    icon: Sparkles,
    color: 'purple',
    status: 'available',
    stats: { usage: 1247, success: 96 }
  },
  {
    id: 'collision-detection',
    title: 'Real-Time Collision Detection',
    description: 'Monitor and detect potential patent conflicts automatically',
    icon: Shield,
    color: 'red',
    status: 'available',
    stats: { alerts: 23, prevented: 8 }
  },
  {
    id: 'citation-3d',
    title: '3D Citation Network',
    description: 'Explore patent relationships in immersive 3D visualization',
    icon: Network,
    color: 'blue',
    status: 'available',
    stats: { networks: 45, nodes: 1200 }
  },
  {
    id: 'blockchain-provenance',
    title: 'Blockchain Provenance',
    description: 'Immutable tracking of patent lifecycle and ownership',
    icon: Link,
    color: 'indigo',
    status: 'available',
    stats: { records: 567, verified: 100 }
  },
  {
    id: 'portfolio-optimization',
    title: 'Portfolio Optimization',
    description: 'AI-powered analysis and strategic recommendations',
    icon: TrendingUp,
    color: 'green',
    status: 'available',
    stats: { saved: 125000, optimized: 89 }
  },
  {
    id: 'collaborative-review',
    title: 'Collaborative Workspace',
    description: 'Real-time patent review and team collaboration',
    icon: Users,
    color: 'orange',
    status: 'available',
    stats: { reviews: 234, teams: 15 }
  },
  {
    id: 'market-intelligence',
    title: 'Market Intelligence Bridge',
    description: 'Connect patents to market trends and opportunities',
    icon: BarChart3,
    color: 'cyan',
    status: 'available',
    stats: { insights: 890, opportunities: 67 }
  },
  {
    id: 'landscape-monitoring',
    title: 'Landscape Monitoring',
    description: 'Automated monitoring with intelligent alerts',
    icon: Bell,
    color: 'yellow',
    status: 'available',
    stats: { monitors: 12, alerts: 45 }
  },
  {
    id: 'licensing-marketplace',
    title: 'Licensing Marketplace',
    description: 'AI-powered patent licensing and valuation platform',
    icon: Store,
    color: 'pink',
    status: 'available',
    stats: { deals: 34, revenue: 450000 }
  },
  {
    id: 'voice-assistant',
    title: 'Voice Research Assistant',
    description: 'Hands-free patent research with natural language',
    icon: Mic,
    color: 'teal',
    status: 'available',
    stats: { commands: 1567, accuracy: 94 }
  }
];

export default function InnovationHub({ currentUser, projectId: _projectId, onNavigateToFeature }: InnovationHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const categories = [
    { id: 'all', label: 'All Features', count: INNOVATION_FEATURES.length },
    { id: 'ai', label: 'AI-Powered', count: 4 },
    { id: 'analytics', label: 'Analytics', count: 3 },
    { id: 'collaboration', label: 'Collaboration', count: 2 },
    { id: 'monitoring', label: 'Monitoring', count: 2 }
  ];

  useEffect(() => {
    // Load recent activity
    setRecentActivity([
      {
        id: 1,
        feature: 'AI Claim Generator',
        action: 'Generated 5 claims for US10123456',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        user: currentUser?.displayName || 'You'
      },
      {
        id: 2,
        feature: 'Collision Detection',
        action: 'Detected potential conflict with US98765432',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        user: 'System Alert'
      },
      {
        id: 3,
        feature: 'Portfolio Optimization',
        action: 'Completed analysis for Q4 portfolio review',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        user: currentUser?.displayName || 'You'
      }
    ]);
  }, [currentUser]);

  const filteredFeatures = INNOVATION_FEATURES.filter(feature => {
    const matchesSearch = searchQuery === '' || 
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    
    // Simple category filtering based on feature characteristics
    const categoryMatch = {
      'ai': ['ai-claim-generator', 'portfolio-optimization', 'market-intelligence', 'voice-assistant'].includes(feature.id),
      'analytics': ['citation-3d', 'portfolio-optimization', 'market-intelligence'].includes(feature.id),
      'collaboration': ['collaborative-review', 'licensing-marketplace'].includes(feature.id),
      'monitoring': ['collision-detection', 'landscape-monitoring'].includes(feature.id)
    };

    return matchesSearch && categoryMatch[selectedCategory as keyof typeof categoryMatch];
  });

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      cyan: 'bg-cyan-100 text-cyan-600 border-cyan-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      pink: 'bg-pink-100 text-pink-600 border-pink-200',
      teal: 'bg-teal-100 text-teal-600 border-teal-200'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    // In a real implementation, this would integrate with the VoicePatentAssistant
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                Innovation Hub
                <HelpIcon section="innovation-hub" onNavigate={undefined} className="text-white/80 hover:text-white hover:bg-white/20" />
              </h1>
              <p className="text-blue-100 text-lg">
                Explore cutting-edge patent intelligence features powered by AI
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm">{INNOVATION_FEATURES.length} Features Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span className="text-sm">Enterprise Ready</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={handleVoiceToggle}
                className={`p-4 rounded-full transition-all ${
                  isVoiceActive 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {isVoiceActive ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
              <div className="text-xs mt-2 opacity-80">
                {isVoiceActive ? 'Voice Active' : 'Voice Assistant'}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <SearchFilterBar
          placeholder="Search innovation features by name, category, or description..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          categories={[
            { value: 'all', label: 'All Features', count: filteredFeatures.length },
            { value: 'ai', label: 'AI Features', count: INNOVATION_FEATURES.filter(f => f.tags?.includes('ai')).length },
            { value: 'analytics', label: 'Analytics', count: INNOVATION_FEATURES.filter(f => f.tags?.includes('analytics')).length },
            { value: 'visualization', label: 'Visualization', count: INNOVATION_FEATURES.filter(f => f.tags?.includes('visualization')).length }
          ]}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortOptions={[
            { value: 'recent', label: 'Most Recent' },
            { value: 'popular', label: 'Most Popular' },
            { value: 'alpha', label: 'Alphabetical' }
          ]}
          className="mb-6"
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold mb-4">Search Features</h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search features..."
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <VoiceSearchButton
                    onTranscription={(text) => setSearchQuery(text)}
                    onInterimTranscription={(text) => setSearchQuery(text)}
                    className="!p-1.5"
                    placeholder="Say the feature name you're looking for..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.label}</span>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="pb-3 border-b border-gray-100 last:border-0">
                    <div className="text-sm font-medium text-gray-900">{activity.feature}</div>
                    <div className="text-xs text-gray-600 mt-1">{activity.action}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {activity.user} • {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map(feature => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => onNavigateToFeature(feature.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${getColorClasses(feature.color)}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 group-hover:text-gray-600 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Feature Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        {Object.entries(feature.stats).map(([key, value], index) => (
                          <div key={index} className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {typeof value === 'number' && value > 1000 
                                ? `${(value / 1000).toFixed(1)}k` 
                                : value}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {key}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Status Badge */}
                      <div className="mt-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          feature.status === 'available' 
                            ? 'bg-green-100 text-green-700'
                            : feature.status === 'beta'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {feature.status === 'available' && '✓ Available'}
                          {feature.status === 'beta' && '⚡ Beta'}
                          {feature.status === 'coming-soon' && '🚀 Coming Soon'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredFeatures.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No features found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or category filters
                </p>
              </div>
            )}

            {/* Getting Started Guide */}
            {searchQuery === '' && selectedCategory === 'all' && (
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Getting Started with Innovation Features
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Explore our cutting-edge patent intelligence tools designed to revolutionize your IP workflow.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Recommended First Steps:</strong>
                        <ul className="mt-1 space-y-1 text-gray-600">
                          <li>• Try the AI Claim Generator</li>
                          <li>• Explore 3D Citation Networks</li>
                          <li>• Set up Landscape Monitoring</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Advanced Features:</strong>
                        <ul className="mt-1 space-y-1 text-gray-600">
                          <li>• Blockchain Provenance Tracking</li>
                          <li>• Portfolio Optimization Engine</li>
                          <li>• Voice Research Assistant</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}