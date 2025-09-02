import React, { useState } from 'react';
import { DollarSign, TrendingUp, PieChart, Calculator, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const InnovationBudgetOptimizer: React.FC = () => {
  const [optimizing, setOptimizing] = useState(false);

  const projects = [
    {
      id: '1',
      name: 'Quantum Computing Initiative',
      currentBudget: 2500000,
      recommendedBudget: 3200000,
      roi: 420,
      patentPotential: 12,
      marketSize: 45000000,
      riskScore: 'medium'
    },
    {
      id: '2',
      name: 'AI Healthcare Platform',
      currentBudget: 1800000,
      recommendedBudget: 1500000,
      roi: 280,
      patentPotential: 8,
      marketSize: 32000000,
      riskScore: 'low'
    },
    {
      id: '3',
      name: 'Green Energy Storage',
      currentBudget: 3000000,
      recommendedBudget: 3500000,
      roi: 510,
      patentPotential: 15,
      marketSize: 78000000,
      riskScore: 'low'
    }
  ];

  const totalBudget = 10000000;
  const allocatedBudget = projects.reduce((sum, p) => sum + p.currentBudget, 0);
  const recommendedTotal = projects.reduce((sum, p) => sum + p.recommendedBudget, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Innovation Budget Optimizer</h1>
          <p className="text-gray-600 mt-2">AI-powered R&D budget allocation based on patent landscape and ROI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-sm text-gray-500">Total Budget</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${(totalBudget / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-600 mt-1">Annual R&D</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <PieChart className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-gray-500">Allocated</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${(allocatedBudget / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-600 mt-1">{((allocatedBudget / totalBudget) * 100).toFixed(0)}% utilized</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-purple-600" />
              <span className="text-sm text-gray-500">Projected ROI</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">385%</p>
            <p className="text-sm text-green-600 mt-1">+45% optimized</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <span className="text-sm text-gray-500">Patent Output</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">35</p>
            <p className="text-sm text-gray-600 mt-1">Expected filings</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Project Budget Allocation</h2>
              <button
                onClick={() => {
                  setOptimizing(true);
                  setTimeout(() => setOptimizing(false), 2000);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                {optimizing ? 'Optimizing...' : 'Optimize Allocation'}
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Project</th>
                    <th className="pb-3">Current Budget</th>
                    <th className="pb-3">Recommended</th>
                    <th className="pb-3">Change</th>
                    <th className="pb-3">Expected ROI</th>
                    <th className="pb-3">Patent Potential</th>
                    <th className="pb-3">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map(project => {
                    const change = project.recommendedBudget - project.currentBudget;
                    const changePercent = (change / project.currentBudget) * 100;
                    
                    return (
                      <tr key={project.id}>
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-gray-900">{project.name}</p>
                            <p className="text-xs text-gray-500">Market: ${(project.marketSize / 1000000).toFixed(0)}M</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">${(project.currentBudget / 1000000).toFixed(1)}M</p>
                        </td>
                        <td className="py-4">
                          <p className="font-medium text-blue-600">
                            ${(project.recommendedBudget / 1000000).toFixed(1)}M
                          </p>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1">
                            {change > 0 ? (
                              <ArrowUpRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-red-600" />
                            )}
                            <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
                              {changePercent > 0 ? '+' : ''}{changePercent.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{project.roi}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${Math.min(project.roi / 5, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="font-medium">{project.patentPotential}</span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            project.riskScore === 'low' ? 'bg-green-100 text-green-700' :
                            project.riskScore === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {project.riskScore.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!optimizing && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Optimization Summary</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Reallocating ${Math.abs(recommendedTotal - allocatedBudget) / 1000000}M could increase ROI by 45%
                    </p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Apply Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Budget Distribution</h3>
            <div className="space-y-3">
              {['Research', 'Development', 'Patent Filing', 'Prototyping', 'Testing'].map((category, index) => {
                const percentage = [30, 35, 10, 15, 10][index];
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{category}</span>
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
            <h3 className="font-semibold text-gray-900 mb-4">Investment Insights</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">High ROI Opportunity</p>
                <p className="text-xs text-green-700 mt-1">
                  Green Energy Storage shows 510% ROI potential with low risk
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">Consider Reallocation</p>
                <p className="text-xs text-yellow-700 mt-1">
                  AI Healthcare may be over-funded relative to patent potential
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Patent Pipeline Strong</p>
                <p className="text-xs text-blue-700 mt-1">
                  Current allocation supports 35+ patent filings this year
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationBudgetOptimizer;