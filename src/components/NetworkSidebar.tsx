import React from 'react';
import {
  Users,
  Star,
  UserCheck,
  Send,
  Mail,
  Globe,
  TrendingUp,
  MessageSquare,
  Clock,
  Award,
  Zap,
  Target,
  BarChart3,
  Sparkles,
  UserPlus,
  Network
} from 'lucide-react';
import type { NetworkStats, SmartRecommendation, ConnectionStatus } from '../types/network';

interface NetworkSidebarProps {
  networkStats: NetworkStats | null;
  selectedCategory: ConnectionStatus | 'all';
  onCategoryChange: (category: ConnectionStatus | 'all') => void;
  recommendations: SmartRecommendation[];
}

const NetworkSidebar: React.FC<NetworkSidebarProps> = ({
  networkStats,
  selectedCategory,
  onCategoryChange,
  recommendations
}) => {
  
  /**
   * Category configuration with icons and descriptions
   */
  const categories = [
    {
      id: 'all' as const,
      label: 'All Connections',
      icon: <Users className="w-5 h-5" />,
      description: 'All your professional contacts',
      count: networkStats?.total_connections || 0,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      hoverColor: 'hover:bg-gray-200'
    },
    {
      id: 'close_collaborator' as const,
      label: 'Close Collaborators',
      icon: <Star className="w-5 h-5" />,
      description: 'Frequent patent co-authors',
      count: networkStats?.close_collaborators || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      hoverColor: 'hover:bg-purple-200'
    },
    {
      id: 'connected' as const,
      label: 'Connected',
      icon: <UserCheck className="w-5 h-5" />,
      description: 'Accepted connections',
      count: (networkStats?.total_connections || 0) - (networkStats?.close_collaborators || 0) - (networkStats?.known_connections || 0),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      hoverColor: 'hover:bg-green-200'
    },
    {
      id: 'known_connection' as const,
      label: 'Known Connections',
      icon: <Network className="w-5 h-5" />,
      description: 'Industry colleagues & contacts',
      count: networkStats?.known_connections || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      hoverColor: 'hover:bg-blue-200'
    },
    {
      id: 'invitation_sent' as const,
      label: 'Invitations Sent',
      icon: <Send className="w-5 h-5" />,
      description: 'Pending outgoing invitations',
      count: Math.floor((networkStats?.pending_invitations || 0) * 0.6), // Estimate
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      hoverColor: 'hover:bg-orange-200'
    },
    {
      id: 'invitation_received' as const,
      label: 'Invitations Received',
      icon: <Mail className="w-5 h-5" />,
      description: 'Pending incoming invitations',
      count: Math.floor((networkStats?.pending_invitations || 0) * 0.4), // Estimate
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      hoverColor: 'hover:bg-cyan-200'
    }
  ];

  /**
   * Render a stat card
   */
  const StatCard: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: number | string; 
    color: string;
    suffix?: string;
  }> = ({ icon, label, value, color, suffix = '' }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color === 'text-blue-600' ? 'bg-blue-100' : 
                                        color === 'text-green-600' ? 'bg-green-100' :
                                        color === 'text-purple-600' ? 'bg-purple-100' :
                                        color === 'text-orange-600' ? 'bg-orange-100' : 'bg-gray-100'}`}>
          <span className={color}>{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-lg font-semibold text-gray-900">
            {value}{suffix}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
          <Network className="w-5 h-5 text-blue-600" />
          Network Overview
        </h2>
        <p className="text-sm text-gray-600">
          Your professional innovation network
        </p>
      </div>

      {/* Network Statistics */}
      {networkStats && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Network Stats
          </h3>
          
          <div className="space-y-3">
            <StatCard
              icon={<MessageSquare className="w-4 h-4" />}
              label="Active Conversations"
              value={networkStats.active_conversations}
              color="text-blue-600"
            />
            
            <StatCard
              icon={<TrendingUp className="w-4 h-4" />}
              label="Success Rate"
              value={networkStats.success_rate}
              color="text-green-600"
              suffix="%"
            />
            
            <StatCard
              icon={<Clock className="w-4 h-4" />}
              label="Avg Response Time"
              value={networkStats.average_response_time.toFixed(1)}
              color="text-purple-600"
              suffix="h"
            />
            
            <StatCard
              icon={<UserPlus className="w-4 h-4" />}
              label="New This Month"
              value={networkStats.new_connections_this_month}
              color="text-orange-600"
            />
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Connection Types
        </h3>
        
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                selectedCategory === category.id
                  ? `${category.color} ${category.bgColor} shadow-sm border border-current`
                  : `text-gray-700 hover:bg-gray-100 ${category.hoverColor}`
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={selectedCategory === category.id ? category.color : 'text-gray-400'}>
                  {category.icon}
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {category.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {category.description}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-white bg-opacity-80'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Smart Recommendations
          </h3>
          
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-shrink-0">
                    {rec.type === 'connection' && <UserPlus className="w-4 h-4 text-blue-600" />}
                    {rec.type === 'collaboration' && <Zap className="w-4 h-4 text-purple-600" />}
                    {rec.type === 'expertise_match' && <Award className="w-4 h-4 text-green-600" />}
                    {rec.type === 'project_opportunity' && <Target className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {rec.contact_name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {rec.reason}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {rec.confidence_score}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {rec.explanation}
                </p>
                <button className="w-full text-left text-xs text-blue-600 hover:text-blue-700 font-medium">
                  {rec.suggested_action} →
                </button>
              </div>
            ))}
            
            {recommendations.length > 3 && (
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                View all {recommendations.length} recommendations
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Quick Actions
        </h3>
        
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus className="w-4 h-4" />
            <span className="text-sm font-medium">Invite New Contact</span>
          </button>
          
          <button className="w-full flex items-center gap-3 p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Open Messages</span>
          </button>
          
          <button className="w-full flex items-center gap-3 p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Import Contacts</span>
          </button>
        </div>
      </div>

      {/* Collab Hub Insights */}
      {networkStats && (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-blue-100">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Collab Hub Insights
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between bg-white bg-opacity-60 rounded-lg p-3">
              <span className="text-gray-700">Connection Growth</span>
              <span className="font-semibold text-green-600">
                +{networkStats.connection_acceptance_rate}%
              </span>
            </div>
            
            <div className="flex items-center justify-between bg-white bg-opacity-60 rounded-lg p-3">
              <span className="text-gray-700">Active Projects</span>
              <span className="font-semibold text-blue-600">
                {networkStats.active_projects}
              </span>
            </div>
            
            <div className="flex items-center justify-between bg-white bg-opacity-60 rounded-lg p-3">
              <span className="text-gray-700">Collaborations</span>
              <span className="font-semibold text-purple-600">
                {networkStats.completed_collaborations}
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white bg-opacity-80 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">
              💡 <strong>Tip:</strong> Your collab hub is growing at {networkStats.connection_acceptance_rate}% rate. 
              Focus on connecting with experts in complementary fields to maximize collaboration opportunities.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSidebar;