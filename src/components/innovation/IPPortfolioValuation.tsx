import React, { useState } from 'react';
import { DollarSign, TrendingUp, Award, AlertCircle, Download, Filter, BarChart3 } from 'lucide-react';

interface Patent {
  id: string;
  title: string;
  number: string;
  filingDate: string;
  grantDate?: string;
  status: 'pending' | 'granted' | 'expired';
  technology: string;
  marketValue: number;
  licensingPotential: number;
  citationCount: number;
  maintenanceCost: number;
  remainingLife: number;
  roi: number;
}

const IPPortfolioValuation: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('value');

  const patents: Patent[] = [
    {
      id: '1',
      title: 'Quantum Encryption Algorithm',
      number: 'US11,234,567',
      filingDate: '2021-03-15',
      grantDate: '2023-06-20',
      status: 'granted',
      technology: 'Quantum Computing',
      marketValue: 8500000,
      licensingPotential: 95,
      citationCount: 142,
      maintenanceCost: 25000,
      remainingLife: 18,
      roi: 340
    },
    {
      id: '2',
      title: 'AI-Powered Drug Discovery Platform',
      number: 'US11,345,678',
      filingDate: '2020-08-10',
      grantDate: '2022-11-15',
      status: 'granted',
      technology: 'AI/ML',
      marketValue: 12000000,
      licensingPotential: 88,
      citationCount: 89,
      maintenanceCost: 30000,
      remainingLife: 17,
      roi: 400
    },
    {
      id: '3',
      title: 'Biodegradable Battery Technology',
      number: 'US11,456,789',
      filingDate: '2022-01-20',
      grantDate: '2024-03-10',
      status: 'granted',
      technology: 'Green Energy',
      marketValue: 6500000,
      licensingPotential: 72,
      citationCount: 56,
      maintenanceCost: 20000,
      remainingLife: 19,
      roi: 325
    },
    {
      id: '4',
      title: 'Nanobot Medical Delivery System',
      number: 'PCT/US2024/123456',
      filingDate: '2024-02-15',
      status: 'pending',
      technology: 'Biotech',
      marketValue: 4500000,
      licensingPotential: 65,
      citationCount: 12,
      maintenanceCost: 15000,
      remainingLife: 20,
      roi: 300
    },
    {
      id: '5',
      title: 'Autonomous Vehicle Navigation',
      number: 'US10,987,654',
      filingDate: '2019-05-10',
      grantDate: '2021-08-20',
      status: 'granted',
      technology: 'Robotics',
      marketValue: 9800000,
      licensingPotential: 91,
      citationCount: 203,
      maintenanceCost: 35000,
      remainingLife: 16,
      roi: 280
    }
  ];

  const totalValue = patents.reduce((sum, p) => sum + p.marketValue, 0);
  const avgROI = patents.reduce((sum, p) => sum + p.roi, 0) / patents.length;
  const totalMaintenance = patents.reduce((sum, p) => sum + p.maintenanceCost, 0);

  const technologies = ['all', ...new Set(patents.map(p => p.technology))];
  
  const filteredPatents = selectedTech === 'all' 
    ? patents 
    : patents.filter(p => p.technology === selectedTech);

  const sortedPatents = [...filteredPatents].sort((a, b) => {
    switch (sortBy) {
      case 'value': return b.marketValue - a.marketValue;
      case 'roi': return b.roi - a.roi;
      case 'citations': return b.citationCount - a.citationCount;
      case 'potential': return b.licensingPotential - a.licensingPotential;
      default: return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'expired': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">IP Portfolio Valuation</h1>
              <p className="text-gray-600 mt-2">AI-powered patent portfolio valuation and ROI analysis</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                ${(totalValue / 1000000).toFixed(1)}M
              </h3>
              <p className="text-gray-600 text-sm mt-1">Total Portfolio Value</p>
              <div className="mt-2 text-xs text-green-600">+12.5% YoY</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-600">{avgROI.toFixed(0)}%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">ROI</h3>
              <p className="text-gray-600 text-sm mt-1">Average Return</p>
              <div className="mt-2 text-xs text-blue-600">Above industry avg</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-600">85%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {patents.filter(p => p.licensingPotential > 70).length}
              </h3>
              <p className="text-gray-600 text-sm mt-1">High-Value Patents</p>
              <div className="mt-2 text-xs text-purple-600">Licensing ready</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                ${(totalMaintenance / 1000).toFixed(0)}K
              </h3>
              <p className="text-gray-600 text-sm mt-1">Annual Maintenance</p>
              <div className="mt-2 text-xs text-orange-600">Next payment in 45 days</div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {technologies.map(tech => (
                <option key={tech} value={tech}>
                  {tech === 'all' ? 'All Technologies' : tech}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="value">Sort by Value</option>
              <option value="roi">Sort by ROI</option>
              <option value="citations">Sort by Citations</option>
              <option value="potential">Sort by Potential</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center gap-2 hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Patent Portfolio Analysis</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Market Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ROI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Potential
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPatents.map(patent => (
                      <tr key={patent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {patent.title}
                            </div>
                            <div className="text-sm text-gray-500">{patent.number}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {patent.citationCount} citations • {patent.remainingLife} years left
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            ${(patent.marketValue / 1000000).toFixed(2)}M
                          </div>
                          <div className="text-xs text-gray-500">
                            Maint: ${(patent.maintenanceCost / 1000).toFixed(0)}K/yr
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-900">
                              {patent.roi}%
                            </div>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${Math.min(patent.roi / 5, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${patent.licensingPotential}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {patent.licensingPotential}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patent.status)}`}>
                            {patent.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Technology Distribution</h3>
              <div className="space-y-3">
                {technologies.filter(t => t !== 'all').map(tech => {
                  const techPatents = patents.filter(p => p.technology === tech);
                  const techValue = techPatents.reduce((sum, p) => sum + p.marketValue, 0);
                  const percentage = (techValue / totalValue * 100).toFixed(1);
                  
                  return (
                    <div key={tech}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">{tech}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Licensing Opportunities</h3>
              <div className="space-y-3">
                {sortedPatents
                  .filter(p => p.licensingPotential > 80)
                  .slice(0, 3)
                  .map(patent => (
                    <div key={patent.id} className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">
                        {patent.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Potential: {patent.licensingPotential}% • Est. ${(patent.marketValue * 0.15 / 1000000).toFixed(1)}M/yr
                      </div>
                    </div>
                  ))}
              </div>
              <button className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Explore Licensing
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Risk Assessment</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expiring Soon</span>
                  <span className="text-sm font-medium text-orange-600">2 patents</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maintenance Due</span>
                  <span className="text-sm font-medium text-yellow-600">5 patents</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Citations</span>
                  <span className="text-sm font-medium text-gray-600">1 patent</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                View Risk Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPPortfolioValuation;