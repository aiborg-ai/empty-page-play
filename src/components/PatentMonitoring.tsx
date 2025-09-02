import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Plus,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Settings,
  Users,
  Target,
  Activity,
  Globe,
  FileText,
  Calendar,
  Zap
} from 'lucide-react';
import { MonitoringDashboard, AlertSeverity, AlertType } from '../types/patentMonitoring';
import { patentMonitoringService } from '../lib/patentMonitoringService';
import HelpIcon from './utils/HelpIcon';

interface PatentMonitoringProps {
  currentUser: any;
  onNavigate?: (section: string) => void;
}

const PatentMonitoring: React.FC<PatentMonitoringProps> = ({ currentUser, onNavigate }) => {
  const [dashboardData, setDashboardData] = useState<MonitoringDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'alerts' | 'watchlists' | 'competitors' | 'trends'>('alerts');
  const [selectedAlertType, setSelectedAlertType] = useState<AlertType | 'all'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [_showCreateWatchlist, _setShowCreateWatchlist] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await patentMonitoringService.getDashboardData(currentUser.id);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAlertAsRead = async (alertId: string) => {
    try {
      await patentMonitoringService.markAlertAsRead(alertId);
      await loadDashboardData();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await patentMonitoringService.markAllAlertsAsRead();
      await loadDashboardData();
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  };

  const getSeverityColor = (severity: AlertSeverity): string => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'new_patent': return <FileText className="w-4 h-4" />;
      case 'competitor_filing': return <Users className="w-4 h-4" />;
      case 'technology_trend': return <TrendingUp className="w-4 h-4" />;
      case 'citation_received': return <Target className="w-4 h-4" />;
      case 'patent_granted': return <CheckCircle className="w-4 h-4" />;
      case 'licensing_opportunity': return <Globe className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const filteredAlerts = dashboardData?.alerts.filter(alert => {
    if (selectedAlertType !== 'all' && alert.type !== selectedAlertType) return false;
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (showUnreadOnly && alert.readAt) return false;
    return true;
  }) || [];

  if (loading) {
    return (
      <div className="h-full bg-gray-50 overflow-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading monitoring dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="h-full bg-gray-50 overflow-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Bell className="w-10 h-10" />
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Patent Monitoring & Alerts
                  <HelpIcon 
                    section="patent-monitoring" 
                    onNavigate={onNavigate} 
                    className="text-white/80 hover:text-white hover:bg-white/20" 
                  />
                </h1>
              </div>
              <p className="text-blue-100 text-lg mb-4">
                Real-time tracking of patents, competitors, and technology trends
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <span className="text-sm">{dashboardData.globalStats.totalAlerts} Total Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm">{dashboardData.globalStats.unreadAlerts} Unread</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm">{dashboardData.globalStats.activeWatchlists} Active Watchlists</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm">{dashboardData.globalStats.highPriorityAlerts} High Priority</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => _setShowCreateWatchlist(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Watchlist
              </button>
              <button
                onClick={() => onNavigate?.('patent-monitoring-settings')}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'alerts', label: 'Alerts', icon: Bell, count: dashboardData.globalStats.totalAlerts },
                { key: 'watchlists', label: 'Watchlists', icon: Search, count: dashboardData.globalStats.activeWatchlists },
                { key: 'competitors', label: 'Competitors', icon: Users, count: 0 },
                { key: 'trends', label: 'Technology Trends', icon: TrendingUp, count: 0 }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.key ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Alerts Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Alert Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                    <select
                      value={selectedAlertType}
                      onChange={(e) => setSelectedAlertType(e.target.value as AlertType | 'all')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="new_patent">New Patents</option>
                      <option value="competitor_filing">Competitor Filings</option>
                      <option value="patent_granted">Patents Granted</option>
                      <option value="technology_trend">Technology Trends</option>
                      <option value="citation_received">Citations Received</option>
                      <option value="licensing_opportunity">Licensing Opportunities</option>
                    </select>
                  </div>
                  
                  {/* Severity Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value as AlertSeverity | 'all')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  
                  {/* Unread Only Toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="unread-only"
                      checked={showUnreadOnly}
                      onChange={(e) => setShowUnreadOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="unread-only" className="text-sm text-gray-700">
                      Unread only
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark All Read
                  </button>
                  <button
                    onClick={loadDashboardData}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Bell className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="bg-white rounded-lg shadow-sm">
              {filteredAlerts.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
                  <p className="text-gray-600">
                    {showUnreadOnly ? 'All alerts have been read' : 'Try adjusting your filters or create a new watchlist'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-6 hover:bg-gray-50 transition-colors ${
                        !alert.readAt ? 'bg-blue-50/30 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                            {getAlertTypeIcon(alert.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getSeverityColor(alert.severity)}`}>
                                {alert.severity}
                              </span>
                              {!alert.readAt && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">{alert.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {alert.applicant}
                              </span>
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {alert.jurisdiction}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(alert.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Search className="w-3 h-3" />
                                {alert.watchlistName}
                              </span>
                            </div>
                            {alert.metadata.similarityScore && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-500 mb-1">
                                  Similarity Score: {Math.round(alert.metadata.similarityScore * 100)}%
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                                    style={{ width: `${alert.metadata.similarityScore * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!alert.readAt && (
                            <button
                              onClick={() => handleMarkAlertAsRead(alert.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {/* Navigate to patent details */}}
                            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                          >
                            View Patent
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Watchlists Tab */}
        {activeTab === 'watchlists' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Watchlists</h2>
                <button
                  onClick={() => _setShowCreateWatchlist(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Watchlist
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.watchlists.map((watchlist) => (
                  <div key={watchlist.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{watchlist.name}</h3>
                        {watchlist.isActive ? (
                          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            <Zap className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            Paused
                          </span>
                        )}
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{watchlist.description}</p>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total Alerts</span>
                          <div className="font-semibold">{watchlist.statistics.totalAlerts}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Last 30 Days</span>
                          <div className="font-semibold">{watchlist.statistics.alertsLast30Days}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Patents Monitored</span>
                        <span className="font-semibold">{watchlist.statistics.patentsMonitored.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Competitors</span>
                        <span className="font-semibold">{watchlist.statistics.competitorsTracked}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trends Section */}
        {activeTab === 'trends' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Technology Trends</h2>
            <div className="space-y-4">
              {dashboardData.trendingTopics.map((trend) => (
                <div key={trend.topic} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="font-medium text-gray-900">{trend.topic}</div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                      {trend.alertCount} alerts
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 ${
                    trend.trend === 'up' ? 'text-green-600' : trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {trend.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : trend.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatentMonitoring;