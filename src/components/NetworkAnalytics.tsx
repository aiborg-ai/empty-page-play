import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Award,
  Clock,
  Target,
  Zap,
  Network,
  Star,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import type { NetworkContact } from '../types/network';

interface NetworkAnalyticsProps {
  contacts: NetworkContact[];
  onInsightClick?: (insight: string) => void;
}

interface AnalyticsData {
  connectionGrowth: { month: string; connections: number }[];
  collaborationScore: number;
  engagementRate: number;
  topExpertiseAreas: { name: string; count: number; growth: number }[];
  recentActivity: { date: string; activity: string; contact: string }[];
  networkHealth: {
    diversity: number;
    responsiveness: number;
    innovation: number;
    collaboration: number;
  };
  insights: {
    id: string;
    type: 'opportunity' | 'warning' | 'success';
    title: string;
    description: string;
    action?: string;
  }[];
}

const NetworkAnalytics: React.FC<NetworkAnalyticsProps> = ({ contacts, onInsightClick }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    generateAnalytics();
  }, [contacts, selectedTimeRange]);

  const generateAnalytics = async () => {
    setIsLoading(true);
    
    try {
      // Simulate analytics processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const analytics: AnalyticsData = {
        connectionGrowth: generateConnectionGrowth(),
        collaborationScore: calculateCollaborationScore(),
        engagementRate: calculateEngagementRate(),
        topExpertiseAreas: analyzeExpertiseAreas(),
        recentActivity: generateRecentActivity(),
        networkHealth: calculateNetworkHealth(),
        insights: generateInsights()
      };
      
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error generating analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateConnectionGrowth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      connections: Math.floor(Math.random() * 15) + 5 + (index * 2)
    }));
  };

  const calculateCollaborationScore = () => {
    if (contacts.length === 0) return 0;
    const totalPotential = contacts.reduce((sum, contact) => sum + contact.collaboration_potential, 0);
    return Math.round(totalPotential / contacts.length);
  };

  const calculateEngagementRate = () => {
    if (contacts.length === 0) return 0;
    const activeContacts = contacts.filter(contact => 
      contact.last_interaction && 
      new Date(contact.last_interaction).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    );
    return Math.round((activeContacts.length / contacts.length) * 100);
  };

  const analyzeExpertiseAreas = () => {
    const expertiseMap = new Map<string, number>();
    
    contacts.forEach(contact => {
      contact.expertise_areas.forEach(expertise => {
        expertiseMap.set(expertise.name, (expertiseMap.get(expertise.name) || 0) + 1);
      });
    });

    return Array.from(expertiseMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        growth: Math.floor(Math.random() * 40) - 10 // -10 to +30
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const generateRecentActivity = () => {
    const activities = [
      'Started conversation',
      'Shared patent reference',
      'Joined collaboration',
      'Updated profile',
      'Connected with',
      'Invited to project'
    ];

    return Array.from({ length: 10 }, (_, index) => ({
      date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
      activity: activities[Math.floor(Math.random() * activities.length)],
      contact: contacts[Math.floor(Math.random() * contacts.length)]?.display_name || 'Unknown'
    }));
  };

  const calculateNetworkHealth = () => {
    const diversity = Math.min(100, (analyzeExpertiseAreas().length / 10) * 100);
    const responsiveness = calculateEngagementRate();
    const innovation = contacts.length > 0 ? 
      Math.round(contacts.reduce((sum, c) => sum + c.innovation_score, 0) / contacts.length) : 0;
    const collaboration = calculateCollaborationScore();

    return { diversity, responsiveness, innovation, collaboration };
  };

  const generateInsights = () => {
    const insights: AnalyticsData['insights'] = [];

    // Engagement insight
    const engagementRate = calculateEngagementRate();
    if (engagementRate < 30) {
      insights.push({
        id: 'low_engagement',
        type: 'warning',
        title: 'Low Network Engagement',
        description: `Only ${engagementRate}% of your connections have been active recently.`,
        action: 'Reach out to dormant connections'
      });
    }

    // Expertise diversity
    const expertiseAreas = analyzeExpertiseAreas();
    if (expertiseAreas.length < 5) {
      insights.push({
        id: 'expertise_diversity',
        type: 'opportunity',
        title: 'Expand Expertise Diversity',
        description: 'Your network could benefit from more diverse technical expertise.',
        action: 'Connect with professionals in new fields'
      });
    }

    // High collaboration potential
    const highPotentialContacts = contacts.filter(c => c.collaboration_potential > 80).length;
    if (highPotentialContacts > 5) {
      insights.push({
        id: 'collaboration_opportunity',
        type: 'success',
        title: 'Strong Collaboration Network',
        description: `You have ${highPotentialContacts} high-potential collaboration opportunities.`,
        action: 'Start new collaboration projects'
      });
    }

    return insights;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 5) return <ArrowUp className="w-3 h-3 text-green-500" />;
    if (growth < -5) return <ArrowDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl p-6">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Unable to generate analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Collab Hub Analytics</h2>
            <p className="text-sm text-gray-600">Insights from your collaboration hub</p>
          </div>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { value: '7d', label: '7D' },
            { value: '30d', label: '30D' },
            { value: '90d', label: '90D' },
            { value: '1y', label: '1Y' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedTimeRange(option.value as any)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedTimeRange === option.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
          <div className="text-sm text-gray-600">Connections</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-500">Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analyticsData.collaborationScore}</div>
          <div className="text-sm text-gray-600">Collaboration</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500">Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analyticsData.engagementRate}%</div>
          <div className="text-sm text-gray-600">Engagement</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-gray-500">Growth</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">+12</div>
          <div className="text-sm text-gray-600">This month</div>
        </div>
      </div>

      {/* Network Health Dashboard */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Network Health
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Diversity', value: analyticsData.networkHealth.diversity, icon: Network },
            { label: 'Responsiveness', value: analyticsData.networkHealth.responsiveness, icon: MessageSquare },
            { label: 'Innovation', value: analyticsData.networkHealth.innovation, icon: Star },
            { label: 'Collaboration', value: analyticsData.networkHealth.collaboration, icon: Award }
          ].map(metric => (
            <div key={metric.label} className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${getHealthColor(metric.value)}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <div className="text-lg font-semibold text-gray-900">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Expertise Areas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          Top Expertise Areas
        </h3>
        
        <div className="space-y-3">
          {analyticsData.topExpertiseAreas.map((expertise, index) => (
            <div key={expertise.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">#{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{expertise.name}</div>
                  <div className="text-sm text-gray-600">{expertise.count} connections</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getGrowthIcon(expertise.growth)}
                <span className="text-sm text-gray-600">{Math.abs(expertise.growth)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights and Recommendations */}
      {analyticsData.insights.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            AI Insights & Recommendations
          </h3>
          
          <div className="space-y-4">
            {analyticsData.insights.map(insight => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success' ? 'border-green-500 bg-green-50' :
                  insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                    {insight.action && (
                      <button
                        onClick={() => onInsightClick?.(insight.id)}
                        className={`text-sm font-medium hover:underline ${
                          insight.type === 'success' ? 'text-green-700' :
                          insight.type === 'warning' ? 'text-yellow-700' :
                          'text-blue-700'
                        }`}
                      >
                        {insight.action} →
                      </button>
                    )}
                  </div>
                  
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'success' ? 'bg-green-100' :
                    insight.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {insight.type === 'success' ? <Award className="w-4 h-4 text-green-600" /> :
                     insight.type === 'warning' ? <Clock className="w-4 h-4 text-yellow-600" /> :
                     <TrendingUp className="w-4 h-4 text-blue-600" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          Recent Network Activity
        </h3>
        
        <div className="space-y-3">
          {analyticsData.recentActivity.slice(0, 6).map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">
                  <span className="font-medium">{activity.activity}</span>
                  {' '}
                  <span className="text-gray-600">with {activity.contact}</span>
                </div>
                <div className="text-xs text-gray-500">{formatTimeAgo(activity.date)}</div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default NetworkAnalytics;