import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Bell, Eye, Building2, Activity, BarChart3, Filter } from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  logo: string;
  patentCount: number;
  recentFilings: number;
  techDomains: string[];
  threatLevel: 'low' | 'medium' | 'high';
  lastActivity: string;
}

interface Alert {
  id: string;
  type: 'filing' | 'grant' | 'litigation' | 'acquisition';
  severity: 'info' | 'warning' | 'critical';
  competitor: string;
  title: string;
  description: string;
  timestamp: string;
  patentNumber?: string;
}

const CompetitiveIntelligence: React.FC = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  
  const competitors: Competitor[] = [
    {
      id: '1',
      name: 'TechCorp Industries',
      logo: '🏢',
      patentCount: 3456,
      recentFilings: 45,
      techDomains: ['AI/ML', 'Quantum Computing', 'Battery Tech'],
      threatLevel: 'high',
      lastActivity: '2 hours ago'
    },
    {
      id: '2',
      name: 'Innovation Labs',
      logo: '🔬',
      patentCount: 2189,
      recentFilings: 28,
      techDomains: ['Biotech', 'Nanotech', 'Green Energy'],
      threatLevel: 'medium',
      lastActivity: '1 day ago'
    },
    {
      id: '3',
      name: 'Future Systems',
      logo: '🚀',
      patentCount: 1567,
      recentFilings: 12,
      techDomains: ['Robotics', 'IoT', 'Blockchain'],
      threatLevel: 'low',
      lastActivity: '3 days ago'
    }
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'filing',
      severity: 'critical',
      competitor: 'TechCorp Industries',
      title: 'New Patent Filing in Your Core Technology',
      description: 'TechCorp filed a patent for "Advanced Neural Network Battery Optimization" that overlaps with your current R&D',
      timestamp: '2025-08-13T10:30:00',
      patentNumber: 'US2025/123456'
    },
    {
      id: '2',
      type: 'grant',
      severity: 'warning',
      competitor: 'Innovation Labs',
      title: 'Patent Granted for Competing Technology',
      description: 'Innovation Labs received grant for biodegradable sensor technology',
      timestamp: '2025-08-12T14:20:00',
      patentNumber: 'US11,345,678'
    },
    {
      id: '3',
      type: 'acquisition',
      severity: 'info',
      competitor: 'Future Systems',
      title: 'Strategic Patent Portfolio Acquisition',
      description: 'Future Systems acquired 50+ IoT patents from startup',
      timestamp: '2025-08-10T09:15:00'
    }
  ];

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Competitive Intelligence Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor competitor patent activities and technology trends</p>
            </div>
            <div className="flex gap-3">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Filter className="w-5 h-5" />
                Configure Alerts
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">+12%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">147</h3>
              <p className="text-gray-600 text-sm mt-1">Monitored Patents</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm text-red-600 font-medium">+5</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">23</h3>
              <p className="text-gray-600 text-sm mt-1">High-Risk Overlaps</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">+8%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">85</h3>
              <p className="text-gray-600 text-sm mt-1">New Filings (30d)</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-purple-600 font-medium">Active</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">12</h3>
              <p className="text-gray-600 text-sm mt-1">Competitors Tracked</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Competitor Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {competitors.map(competitor => (
                    <div
                      key={competitor.id}
                      onClick={() => setSelectedCompetitor(competitor.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCompetitor === competitor.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{competitor.logo}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{competitor.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {competitor.patentCount.toLocaleString()} total patents • 
                              {' '}{competitor.recentFilings} recent filings
                            </p>
                            <div className="flex gap-2 mt-2">
                              {competitor.techDomains.map(domain => (
                                <span
                                  key={domain}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {domain}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getThreatColor(competitor.threatLevel)}`}>
                            {competitor.threatLevel.toUpperCase()} THREAT
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Last activity: {competitor.lastActivity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Technology Trend Analysis</h2>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {['AI/ML', 'Quantum Computing', 'Green Energy', 'Biotech', 'Robotics'].map((tech, index) => {
                    const activity = [85, 72, 68, 45, 38][index];
                    const trend = ['+12%', '+8%', '+15%', '-3%', '+5%'][index];
                    const isPositive = !trend.startsWith('-');
                    
                    return (
                      <div key={tech} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{tech}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {trend}
                            </span>
                            <span className="text-sm text-gray-600">{activity} filings</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${activity}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Real-time Alerts</h2>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                    {alerts.length} NEW
                  </span>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {alerts.map(alert => (
                  <div key={alert.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                        {alert.patentNumber && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                            {alert.patentNumber}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Building2 className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{alert.competitor}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Monitoring Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">High Priority Only</span>
                  <input type="checkbox" className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Weekly Digest</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Update Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveIntelligence;