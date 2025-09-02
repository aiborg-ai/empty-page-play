import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Radar, 
  Shield, 
  Brain,
  Target,
  Zap,
  Star,
  MapPin,
  Activity,
  Award,
  AlertTriangle,
  Eye,
  ArrowRight,
  Lightbulb,
  Calendar,
  FileText,
  Settings,
  Download,
  RefreshCw,
  Filter,
  Search,
  Bookmark,
  Share2,
  CheckCircle
} from 'lucide-react';
import PageHeader from './PageHeader';
import HarmonizedCard from './HarmonizedCard';
import PredictiveAnalytics from './PredictiveAnalytics';
import InnovationHeatmap from './InnovationHeatmap';
import TechnologyRadar from './TechnologyRadar';
import PatentQualityScorer from './PatentQualityScorer';

interface AnalyticsModule {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'active' | 'beta' | 'coming_soon';
  features: string[];
  metrics: {
    label: string;
    value: string | number;
    trend?: string;
  }[];
  lastUpdated: string;
  category: 'predictive' | 'geographic' | 'competitive' | 'quality';
}

interface DashboardStat {
  label: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface InsightCard {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  relatedModule: string;
}

const AdvancedAnalyticsHub: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDashboard, setShowDashboard] = useState(true);

  // Analytics modules configuration
  const analyticsModules: AnalyticsModule[] = [
    {
      id: 'predictive',
      name: 'Predictive Analytics',
      description: 'ML-powered patent trend forecasting and market opportunity analysis',
      icon: Brain,
      color: 'bg-purple-500',
      status: 'active',
      features: ['Patent Filing Trends', 'Market Opportunities', 'Risk Assessment', 'AI Insights'],
      metrics: [
        { label: 'Prediction Accuracy', value: '94.2%', trend: '+2.1%' },
        { label: 'Technologies Tracked', value: 5, trend: 'stable' },
        { label: 'Market Opportunities', value: 4, trend: '+1' }
      ],
      lastUpdated: '2024-01-15',
      category: 'predictive'
    },
    {
      id: 'heatmap',
      name: 'Innovation Heatmap',
      description: 'Geographic visualization of global innovation activity and technology clusters',
      icon: MapPin,
      color: 'bg-blue-500',
      status: 'active',
      features: ['Global Innovation Map', 'Technology Clusters', 'Regional Analysis', 'Time-lapse View'],
      metrics: [
        { label: 'Regions Tracked', value: 6, trend: 'stable' },
        { label: 'Innovation Hotspots', value: 12, trend: '+2' },
        { label: 'Tech Clusters', value: 4, trend: '+1' }
      ],
      lastUpdated: '2024-01-15',
      category: 'geographic'
    },
    {
      id: 'radar',
      name: 'Technology Radar',
      description: 'Track emerging technologies, assess maturity levels, and identify disruption potential',
      icon: Radar,
      color: 'bg-green-500',
      status: 'active',
      features: ['Technology Positioning', 'Maturity Assessment', 'Disruption Potential', 'Investment Trends'],
      metrics: [
        { label: 'Technologies Analyzed', value: 8, trend: '+2' },
        { label: 'Avg Velocity Score', value: 78, trend: '+5' },
        { label: 'High Disruption Tech', value: 4, trend: '+1' }
      ],
      lastUpdated: '2024-01-15',
      category: 'competitive'
    },
    {
      id: 'quality',
      name: 'Patent Quality Scorer',
      description: 'Comprehensive analysis of patent strength, enforceability, and commercial value',
      icon: Shield,
      color: 'bg-orange-500',
      status: 'active',
      features: ['Quality Scoring', 'Portfolio Analysis', 'Risk Assessment', 'Commercial Valuation'],
      metrics: [
        { label: 'Patents Analyzed', value: 6, trend: 'stable' },
        { label: 'Avg Quality Score', value: 84, trend: '+3' },
        { label: 'High Risk Patents', value: 1, trend: '-1' }
      ],
      lastUpdated: '2024-01-15',
      category: 'quality'
    }
  ];

  // Dashboard statistics
  const dashboardStats: DashboardStat[] = [
    {
      label: 'Total Patents Analyzed',
      value: '2,847',
      change: '+234',
      icon: FileText,
      color: 'text-blue-600',
      trend: 'up'
    },
    {
      label: 'Innovation Hotspots',
      value: 12,
      change: '+2',
      icon: MapPin,
      color: 'text-green-600',
      trend: 'up'
    },
    {
      label: 'Emerging Technologies',
      value: 8,
      change: '+1',
      icon: Zap,
      color: 'text-purple-600',
      trend: 'up'
    },
    {
      label: 'High-Quality Patents',
      value: '78%',
      change: '+5%',
      icon: Star,
      color: 'text-yellow-600',
      trend: 'up'
    }
  ];

  // AI-generated insights
  const insights: InsightCard[] = [
    {
      id: '1',
      title: 'Quantum Computing Patent Surge',
      description: 'Significant 67.8% increase in quantum computing patents expected, with IBM and Google leading innovation.',
      type: 'opportunity',
      priority: 'high',
      actionable: true,
      relatedModule: 'predictive'
    },
    {
      id: '2',
      title: 'Silicon Valley Competition Risk',
      description: 'High competitor density in Silicon Valley may impact patent differentiation and filing strategies.',
      type: 'risk',
      priority: 'medium',
      actionable: true,
      relatedModule: 'heatmap'
    },
    {
      id: '3',
      title: 'Generative AI Market Leadership',
      description: 'Generative AI technologies show highest velocity score (98%) with strong commercial potential.',
      type: 'trend',
      priority: 'high',
      actionable: false,
      relatedModule: 'radar'
    },
    {
      id: '4',
      title: 'Portfolio Quality Improvement',
      description: '3 patents identified for quality enhancement to strengthen competitive position.',
      type: 'recommendation',
      priority: 'medium',
      actionable: true,
      relatedModule: 'quality'
    }
  ];

  // Filter modules by category
  const filteredModules = analyticsModules.filter(module => 
    selectedCategory === 'all' || module.category === selectedCategory
  );

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-green-200 bg-green-50';
      case 'risk': return 'border-red-200 bg-red-50';
      case 'trend': return 'border-blue-200 bg-blue-50';
      case 'recommendation': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return Target;
      case 'risk': return AlertTriangle;
      case 'trend': return TrendingUp;
      case 'recommendation': return Lightbulb;
      default: return Activity;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-500 transform rotate-180" />;
      case 'stable': return <Activity className="w-3 h-3 text-gray-500" />;
      default: return null;
    }
  };

  // Render specific module
  if (activeModule) {
    const renderActiveModule = () => {
      switch (activeModule) {
        case 'predictive':
          return <PredictiveAnalytics />;
        case 'heatmap':
          return <InnovationHeatmap />;
        case 'radar':
          return <TechnologyRadar />;
        case 'quality':
          return <PatentQualityScorer />;
        default:
          return null;
      }
    };

    return (
      <div>
        {/* Navigation bar */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setActiveModule(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Analytics Hub
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Module:</span>
              <span className="font-medium text-gray-900">
                {analyticsModules.find(m => m.id === activeModule)?.name}
              </span>
            </div>
          </div>
        </div>
        {renderActiveModule()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advanced Analytics & Insights"
        subtitle="Comprehensive patent intelligence platform with predictive analytics, geographic insights, and quality assessment"
        breadcrumb={['Analytics']}
      />

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="predictive">Predictive Analytics</option>
                <option value="geographic">Geographic Analysis</option>
                <option value="competitive">Competitive Intelligence</option>
                <option value="quality">Quality Assessment</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              <Search className="w-4 h-4" />
              Search Insights
            </button>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg ${
                showDashboard 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Settings className="w-4 h-4" />
              Configure
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <RefreshCw className="w-4 h-4" />
              Update All
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Statistics */}
      {showDashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    {getTrendIcon(stat.trend)}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((insight) => {
            const IconComponent = getInsightIcon(insight.type);
            return (
              <div
                key={insight.id}
                className={`rounded-lg border p-4 ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </span>
                    {insight.actionable && (
                      <button className="p-1 hover:bg-white rounded">
                        <Bookmark className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Related: {analyticsModules.find(m => m.id === insight.relatedModule)?.name}
                  </span>
                  {insight.actionable && (
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      Take Action
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Modules */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Analytics Modules
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredModules.map((module) => (
            <HarmonizedCard
              key={module.id}
              title={module.name}
              description={module.description}
              stats={module.metrics.map((metric, index) => ({
                label: metric.label,
                value: metric.value,
                icon: [BarChart3, Activity, Target][index] || BarChart3,
                color: ['text-blue-600', 'text-green-600', 'text-purple-600'][index] || 'text-gray-600'
              }))}
              keywords={[
                { label: module.status.replace('_', ' '), color: module.status === 'active' ? 'green' : module.status === 'beta' ? 'yellow' : 'gray' },
                { label: `${module.features.length} features`, color: 'blue' },
                { label: module.category, color: 'purple' }
              ]}
              attributes={[
                { label: 'Last Updated', value: module.lastUpdated, icon: Calendar },
                { label: 'Status', value: module.status.replace('_', ' '), icon: Activity }
              ]}
              actions={[
                {
                  id: 'launch',
                  label: 'Launch Module',
                  icon: Eye,
                  onClick: () => setActiveModule(module.id),
                  isPrimary: true,
                  variant: 'primary'
                },
                {
                  id: 'configure',
                  label: 'Configure',
                  icon: Settings,
                  onClick: () => console.log('Configure', module.id),
                  isPrimary: false,
                  variant: 'secondary'
                },
                {
                  id: 'share',
                  label: 'Share',
                  icon: Share2,
                  onClick: () => console.log('Share', module.id),
                  isPrimary: false,
                  variant: 'secondary'
                }
              ]}
              colorAccent={module.color.replace('bg-', '').replace('-500', '')}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveModule('predictive')}
            className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border"
          >
            <Brain className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Run Predictions</h4>
            <p className="text-sm text-gray-600">Forecast patent trends and market opportunities</p>
          </button>
          
          <button
            onClick={() => setActiveModule('heatmap')}
            className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border"
          >
            <Globe className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Explore Heatmap</h4>
            <p className="text-sm text-gray-600">View global innovation activity and clusters</p>
          </button>
          
          <button
            onClick={() => setActiveModule('quality')}
            className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border"
          >
            <Shield className="w-8 h-8 text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Assess Quality</h4>
            <p className="text-sm text-gray-600">Evaluate patent strength and commercial value</p>
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Platform Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">99.7%</div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">1.2s</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">4.8/5</div>
            <div className="text-sm text-gray-600">User Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsHub;