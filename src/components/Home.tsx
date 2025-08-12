import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Search,
  Plus,
  ChevronRight,
  Activity,
  FileText,
  Users,
  BarChart3,
  Clock,
  Star,
  ArrowUp,
  Zap,
  Globe,
  Shield,
  Target
} from 'lucide-react';

interface HomeProps {
  user: any;
  onNavigate?: (section: string) => void;
}

const QUICK_ACTIONS = [
  {
    id: 'patent-search',
    title: 'Patent Search',
    description: 'Search global patent databases',
    icon: Search,
    color: 'blue',
    action: 'search'
  },
  {
    id: 'new-project',
    title: 'Create Project',
    description: 'Start a new innovation project',
    icon: Plus,
    color: 'green',
    action: 'work-area'
  },
  {
    id: 'ai-analysis',
    title: 'AI Analysis',
    description: 'Generate insights with AI',
    icon: Sparkles,
    color: 'purple',
    action: 'innovation-hub'
  },
  {
    id: 'view-reports',
    title: 'View Reports',
    description: 'Access your analytics',
    icon: FileText,
    color: 'indigo',
    action: 'reports'
  }
];

const METRICS = [
  { label: 'Active Projects', value: 12, change: 2, trending: 'up', icon: Target },
  { label: 'Patents Tracked', value: '3.4k', change: 15, trending: 'up', icon: Shield },
  { label: 'Team Members', value: 8, change: 0, trending: 'stable', icon: Users },
  { label: 'Reports Generated', value: 45, change: 5, trending: 'up', icon: BarChart3 }
];

export default function Home({ user, onNavigate }: HomeProps) {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading recent activity
    setRecentActivity([
      {
        id: 1,
        type: 'search',
        title: 'Searched for "quantum computing patents"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: Search,
        color: 'blue'
      },
      {
        id: 2,
        type: 'report',
        title: 'Generated landscape analysis report',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        icon: FileText,
        color: 'green'
      },
      {
        id: 3,
        type: 'project',
        title: 'Updated Project Alpha roadmap',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        icon: Target,
        color: 'purple'
      },
      {
        id: 4,
        type: 'collaboration',
        title: 'Team reviewed 5 patent applications',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        icon: Users,
        color: 'orange'
      }
    ]);

    // Simulate loading AI insights
    setInsights([
      {
        id: 1,
        title: 'Patent Filing Trend',
        description: 'AI patents in your focus areas increased by 23% this quarter',
        icon: TrendingUp,
        severity: 'info',
        action: 'View Details'
      },
      {
        id: 2,
        title: 'Competitor Alert',
        description: 'New patent filed by competitor in your technology space',
        icon: Shield,
        severity: 'warning',
        action: 'Analyze'
      },
      {
        id: 3,
        title: 'Opportunity Identified',
        description: 'Gap detected in renewable energy patent landscape',
        icon: Zap,
        severity: 'success',
        action: 'Explore'
      }
    ]);
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.displayName || 'Innovator'}!
              </h1>
              <p className="text-blue-100 text-lg">
                Your innovation intelligence dashboard
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm">All systems operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span className="text-sm">Global coverage active</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-lg opacity-90">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  {metric.trending === 'up' && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <ArrowUp className="w-4 h-4" />
                      <span>+{metric.change}</span>
                    </div>
                  )}
                  {metric.trending === 'stable' && (
                    <div className="text-gray-400 text-sm">Stable</div>
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => onNavigate?.(action.action)}
                      className="group p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getColorClasses(action.color)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {action.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors mt-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div className="space-y-3">
                {insights.map((insight) => {
                  const Icon = insight.icon;
                  const severityColors = {
                    info: 'bg-blue-50 border-blue-200',
                    warning: 'bg-yellow-50 border-yellow-200',
                    success: 'bg-green-50 border-green-200'
                  };
                  
                  return (
                    <div
                      key={insight.id}
                      className={`p-4 rounded-lg border ${severityColors[insight.severity as keyof typeof severityColors]}`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${
                          insight.severity === 'info' ? 'text-blue-600' :
                          insight.severity === 'warning' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{insight.title}</h3>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-2">
                            {insight.action} →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getColorClasses(activity.color)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={() => onNavigate?.('activity')}
                className="w-full mt-4 text-sm text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Activity →
              </button>
            </div>

            {/* Recommended Actions */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Recommended for You</h3>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => onNavigate?.('innovation-hub')}
                  className="w-full text-left p-3 bg-white rounded-lg hover:shadow-sm transition-shadow group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600">
                      Try AI Patent Generator
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Generate patent claims 10x faster
                  </p>
                </button>
                <button 
                  onClick={() => onNavigate?.('showcase')}
                  className="w-full text-left p-3 bg-white rounded-lg hover:shadow-sm transition-shadow group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600">
                      Explore New Datasets
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    7 new USPTO datasets available
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}