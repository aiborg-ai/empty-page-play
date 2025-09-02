import React from 'react';
import { TrendingUp, Award, Target, Zap, Activity } from 'lucide-react';

const InnovationMetrics: React.FC = () => {
  const kpis = [
    { label: 'Innovation Velocity', value: '3.2', unit: 'inventions/month', trend: '+15%', icon: Zap },
    { label: 'Patent Grant Rate', value: '78%', unit: 'success rate', trend: '+5%', icon: Award },
    { label: 'Citation Impact', value: '142', unit: 'avg citations', trend: '+22%', icon: TrendingUp },
    { label: 'Technology Diversity', value: '8.5', unit: 'score', trend: '+1.2', icon: Target }
  ];

  const performanceData = [
    { metric: 'Time to Patent', current: '18 months', target: '15 months', performance: 85 },
    { metric: 'R&D Efficiency', current: '$2.3M/patent', target: '$2M/patent', performance: 72 },
    { metric: 'Innovation ROI', current: '340%', target: '300%', performance: 113 },
    { metric: 'Market Penetration', current: '65%', target: '70%', performance: 93 }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Innovation Metrics & KPI Dashboard</h1>
          <p className="text-gray-600 mt-2">Track innovation performance and key metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-green-600">{kpi.trend}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
                <p className="text-sm text-gray-600 mt-1">{kpi.label}</p>
                <p className="text-xs text-gray-500">{kpi.unit}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance vs Target</h2>
            <div className="space-y-4">
              {performanceData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                    <span className="text-sm text-gray-600">{item.current}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.performance >= 100 ? 'bg-green-600' : 
                        item.performance >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(item.performance, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Target: {item.target}</span>
                    <span className="text-xs font-medium">{item.performance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Innovation Funnel</h2>
            <div className="space-y-3">
              {[
                { stage: 'Ideas Submitted', count: 450, percentage: 100 },
                { stage: 'Under Review', count: 320, percentage: 71 },
                { stage: 'In Development', count: 180, percentage: 40 },
                { stage: 'Patent Filed', count: 85, percentage: 19 },
                { stage: 'Patent Granted', count: 67, percentage: 15 }
              ].map((stage, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-700">{stage.stage}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${stage.percentage}%` }}
                      >
                        <span className="text-xs text-white font-medium">{stage.count}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-10">{stage.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Team Performance</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['R&D Team Alpha', 'Innovation Lab Beta', 'Engineering Gamma'].map((team, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">{team}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patents Filed</span>
                    <span className="font-medium">{[28, 22, 19][index]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grant Rate</span>
                    <span className="font-medium">{['82%', '75%', '79%'][index]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Time</span>
                    <span className="font-medium">{['16mo', '19mo', '17mo'][index]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationMetrics;