// Patent Monitoring System - Automated patent tracking and alerting
// Provides comprehensive patent monitoring with intelligent alerts and competitor tracking

import { useState, useEffect } from 'react';
import {
  Eye,
  Bell,
  Plus,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings,
  Play,
  Pause,
  Archive,
  Download,
  BarChart3,
  Building
} from 'lucide-react';
import {
  PatentMonitorRule,
  PatentAlert
} from '../types/automation';

interface PatentMonitoringSystemProps {
  projectId?: string;
}

interface MonitoringStats {
  totalRules: number;
  activeRules: number;
  alertsToday: number;
  alertsThisWeek: number;
  topCompetitors: Array<{ name: string; alertCount: number }>;
  alertsByType: Record<string, number>;
}

export default function PatentMonitoringSystem({ projectId }: PatentMonitoringSystemProps) {
  const [rules, setRules] = useState<PatentMonitorRule[]>([]);
  const [alerts, setAlerts] = useState<PatentAlert[]>([]);
  const [stats, setStats] = useState<MonitoringStats | null>(null);
  const [_selectedRule, setSelectedRule] = useState<PatentMonitorRule | null>(null);
  const [_showRuleEditor, setShowRuleEditor] = useState(false);
  const [activeTab, setActiveTab] = useState<'rules' | 'alerts' | 'analytics'>('rules');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused'>('all');

  // Load monitoring data
  useEffect(() => {
    loadMonitoringData();
  }, [projectId]);

  const loadMonitoringData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real implementation, this would come from API
      const mockRules: PatentMonitorRule[] = [
        {
          id: 'rule_1',
          name: 'AI Technology Patents',
          description: 'Monitor new AI and machine learning patents from key competitors',
          status: 'active',
          priority: 'high',
          search_query: 'artificial intelligence OR machine learning OR neural network',
          jurisdictions: ['US', 'EP', 'JP', 'CN'],
          patent_types: ['utility', 'application'],
          date_range: {
            start_date: '2024-01-01'
          },
          alert_conditions: [
            {
              id: 'cond_1',
              type: 'new_patents',
              threshold: 5,
              comparison: 'greater_than',
              value: 5,
              severity: 'warning'
            },
            {
              id: 'cond_2',
              type: 'competitor_activity',
              comparison: 'contains',
              value: 'Google|Apple|Microsoft|Amazon',
              severity: 'critical'
            }
          ],
          notification_settings: {
            enabled: true,
            channels: [
              {
                id: 'email_1',
                type: 'email',
                configuration: { recipients: ['team@example.com'] },
                enabled: true
              }
            ],
            templates: [],
            frequency_limits: []
          },
          check_frequency: { value: 4, unit: 'hours' },
          owner_id: 'user_1',
          project_id: projectId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_checked_at: new Date(Date.now() - 3600000).toISOString(),
          alerts_generated: 12
        },
        {
          id: 'rule_2',
          name: 'Patent Expiry Tracking',
          description: 'Track patent expiries for our portfolio',
          status: 'active',
          priority: 'medium',
          search_query: 'patent_id IN (US123456, EP789012, JP345678)',
          jurisdictions: ['US', 'EP', 'JP'],
          patent_types: ['utility'],
          alert_conditions: [
            {
              id: 'cond_3',
              type: 'expiry_approaching',
              threshold: 90,
              comparison: 'less_than',
              value: 90,
              severity: 'warning'
            }
          ],
          notification_settings: {
            enabled: true,
            channels: [
              {
                id: 'email_2',
                type: 'email',
                configuration: { recipients: ['legal@example.com'] },
                enabled: true
              }
            ],
            templates: [],
            frequency_limits: []
          },
          check_frequency: { value: 1, unit: 'days' },
          owner_id: 'user_2',
          project_id: projectId,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
          last_checked_at: new Date(Date.now() - 7200000).toISOString(),
          alerts_generated: 3
        }
      ];

      const mockAlerts: PatentAlert[] = [
        {
          id: 'alert_1',
          rule_id: 'rule_1',
          type: 'new_patents',
          severity: 'warning',
          title: 'New AI Patents Detected',
          description: '7 new AI patents found from monitored competitors',
          patent_ids: ['US20240001', 'EP20240002', 'JP20240003'],
          data: {
            applicant: 'Google LLC',
            publication_date: '2024-01-15',
            technology_area: 'Machine Learning'
          },
          status: 'new',
          created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 'alert_2',
          rule_id: 'rule_2',
          type: 'expiry_approaching',
          severity: 'critical',
          title: 'Patent Expiry Warning',
          description: 'Patent US123456 expires in 45 days',
          patent_ids: ['US123456'],
          data: {
            expiry_date: '2024-03-01',
            days_remaining: 45,
            patent_title: 'Method for Data Processing'
          },
          status: 'new',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      const mockStats: MonitoringStats = {
        totalRules: 8,
        activeRules: 6,
        alertsToday: 3,
        alertsThisWeek: 15,
        topCompetitors: [
          { name: 'Google', alertCount: 12 },
          { name: 'Apple', alertCount: 8 },
          { name: 'Microsoft', alertCount: 6 }
        ],
        alertsByType: {
          new_patents: 20,
          competitor_activity: 15,
          expiry_approaching: 5,
          status_change: 8
        }
      };

      setRules(mockRules);
      setAlerts(mockAlerts);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter rules based on search and status
  const filteredRules = rules.filter(rule => {
    const matchesSearch = searchTerm === '' || 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || rule.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle rule status toggle
  const toggleRuleStatus = async (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
        : rule
    ));
  };

  // Handle alert acknowledgment
  const acknowledgeAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, status: 'acknowledged', acknowledged_at: new Date().toISOString() }
        : alert
    ));
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="text-green-500" size={16} />;
      case 'paused': return <Pause className="text-orange-500" size={16} />;
      case 'archived': return <Archive className="text-gray-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const renderRulesTab = () => (
    <div className="space-y-6">
      {/* Rules Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Monitoring Rules</h3>
          <p className="text-gray-600">Configure automated patent monitoring</p>
        </div>
        <button
          onClick={() => setShowRuleEditor(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>New Rule</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Eye className="mx-auto mb-4 opacity-50" size={48} />
            <p>No monitoring rules found</p>
            <button
              onClick={() => setShowRuleEditor(true)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Create your first rule
            </button>
          </div>
        ) : (
          filteredRules.map((rule) => (
            <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(rule.status)}
                    <h4 className="text-lg font-medium">{rule.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rule.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.priority}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{rule.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Search Query:</span>
                      <p className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded mt-1">
                        {rule.search_query}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Jurisdictions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.jurisdictions.map(jurisdiction => (
                          <span key={jurisdiction} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {jurisdiction}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Bell size={14} />
                      <span>{rule.alerts_generated} alerts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} />
                      <span>
                        Checks every {rule.check_frequency.value} {rule.check_frequency.unit}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>
                        Last: {rule.last_checked_at ? 
                          new Date(rule.last_checked_at).toLocaleString() : 
                          'Never'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={`p-2 rounded ${
                      rule.status === 'active' 
                        ? 'text-orange-600 hover:bg-orange-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={rule.status === 'active' ? 'Pause' : 'Activate'}
                  >
                    {rule.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={() => setSelectedRule(rule)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                    title="Settings"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAlertsTab = () => (
    <div className="space-y-6">
      {/* Alerts Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Patent Alerts</h3>
          <p className="text-gray-600">Recent monitoring alerts and notifications</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Archive size={16} />
            <span>Archive All</span>
          </button>
        </div>
      </div>

      {/* Alert Filters */}
      <div className="flex space-x-4">
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>All Alerts</option>
          <option>New Patents</option>
          <option>Competitor Activity</option>
          <option>Expiry Warnings</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>All Severities</option>
          <option>Critical</option>
          <option>Warning</option>
          <option>Info</option>
        </select>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="mx-auto mb-4 opacity-50" size={48} />
            <p>No alerts to display</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-6 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle size={20} />
                    <h4 className="text-lg font-medium">{alert.title}</h4>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-white bg-opacity-50">
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{alert.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Patents:</span>
                      <div className="mt-1">
                        {alert.patent_ids.map(patentId => (
                          <span key={patentId} className="inline-block mr-2 mb-1 px-2 py-1 bg-white bg-opacity-50 text-xs rounded">
                            {patentId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Details:</span>
                      <div className="mt-1 text-sm">
                        {Object.entries(alert.data).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace('_', ' ')}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    Created {new Date(alert.created_at).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  {alert.status === 'new' && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-2 bg-white bg-opacity-50 text-gray-700 rounded hover:bg-opacity-75"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button className="px-3 py-2 bg-white bg-opacity-50 text-gray-700 rounded hover:bg-opacity-75">
                    View Patents
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div>
        <h3 className="text-lg font-semibold">Monitoring Analytics</h3>
        <p className="text-gray-600">Insights and trends from patent monitoring</p>
      </div>

      {stats && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalRules}</div>
              <div className="text-sm text-gray-600">Total Rules</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeRules}</div>
              <div className="text-sm text-gray-600">Active Rules</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.alertsToday}</div>
              <div className="text-sm text-gray-600">Alerts Today</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.alertsThisWeek}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Top Competitors */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Top Competitors</h4>
              <div className="space-y-3">
                {stats.topCompetitors.map((competitor, index) => (
                  <div key={competitor.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <span className="font-medium">{competitor.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(competitor.alertCount / Math.max(...stats.topCompetitors.map(c => c.alertCount))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{competitor.alertCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts by Type */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Alerts by Type</h4>
              <div className="space-y-3">
                {Object.entries(stats.alertsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize">{type.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(stats.alertsByType))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4">Recent Activity Timeline</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <span className="font-medium">New monitoring rule created</span>
                  <span className="text-gray-500 ml-2">AI Technology Patents</span>
                </div>
                <span className="text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <span className="font-medium">Alert acknowledged</span>
                  <span className="text-gray-500 ml-2">Patent Expiry Warning</span>
                </div>
                <span className="text-gray-500">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <span className="font-medium">High priority alert</span>
                  <span className="text-gray-500 ml-2">7 new competitor patents</span>
                </div>
                <span className="text-gray-500">6 hours ago</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Eye className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold">Patent Monitoring</h1>
        </div>
        <p className="text-gray-600">
          Automated patent tracking, competitor monitoring, and intelligent alerting system
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active Rules</p>
                <p className="text-2xl font-bold">{stats.activeRules}</p>
              </div>
              <Eye className="text-blue-200" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Alerts Today</p>
                <p className="text-2xl font-bold">{stats.alertsToday}</p>
              </div>
              <Bell className="text-green-200" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">This Week</p>
                <p className="text-2xl font-bold">{stats.alertsThisWeek}</p>
              </div>
              <TrendingUp className="text-orange-200" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Competitors</p>
                <p className="text-2xl font-bold">{stats.topCompetitors.length}</p>
              </div>
              <Building className="text-purple-200" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'rules', name: 'Monitoring Rules', icon: Eye },
            { id: 'alerts', name: 'Alerts', icon: Bell },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          {activeTab === 'rules' && renderRulesTab()}
          {activeTab === 'alerts' && renderAlertsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      )}
    </div>
  );
}