import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, FileText, TrendingDown, AlertCircle } from 'lucide-react';

const PatentRiskAssessment: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);

  const riskItems = [
    {
      id: '1',
      title: 'Smart Battery Controller',
      type: 'Freedom to Operate',
      riskLevel: 'high',
      score: 78,
      blockers: 3,
      description: 'Potential conflict with US11,234,567 and EP3,456,789'
    },
    {
      id: '2',
      title: 'AI Vision System',
      type: 'Infringement Risk',
      riskLevel: 'medium',
      score: 45,
      blockers: 1,
      description: 'Minor overlap with competitor patent claims'
    },
    {
      id: '3',
      title: 'Quantum Encryption',
      type: 'Invalidity Risk',
      riskLevel: 'low',
      score: 12,
      blockers: 0,
      description: 'Strong novelty, minimal prior art concerns'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patent Risk Assessment Module</h1>
          <p className="text-gray-600 mt-2">Automated FTO analysis and infringement risk scoring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Analysis</h2>
              
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Enter patent number or upload claims..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => {
                    setAnalyzing(true);
                    setTimeout(() => setAnalyzing(false), 2000);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Risk'}
                </button>
              </div>

              <div className="space-y-4">
                {riskItems.map(item => (
                  <div key={item.id} className={`p-4 border-2 rounded-lg ${
                    item.riskLevel === 'high' ? 'border-red-200 bg-red-50' :
                    item.riskLevel === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {item.riskLevel === 'high' ? (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          ) : item.riskLevel === 'medium' ? (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                            item.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {item.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{item.type}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{item.score}%</div>
                        <p className="text-xs text-gray-500">Risk Score</p>
                        {item.blockers > 0 && (
                          <p className="text-sm text-red-600 mt-2">{item.blockers} blockers</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                        View Details →
                      </button>
                      <button className="text-gray-600 text-sm font-medium hover:text-gray-800">
                        Mitigation Strategy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Matrix</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="p-6 bg-green-100 rounded-lg mb-2">
                    <Shield className="w-8 h-8 text-green-600 mx-auto" />
                  </div>
                  <p className="font-medium">Low Risk</p>
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-sm text-gray-600">Patents</p>
                </div>
                <div className="text-center">
                  <div className="p-6 bg-yellow-100 rounded-lg mb-2">
                    <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto" />
                  </div>
                  <p className="font-medium">Medium Risk</p>
                  <p className="text-2xl font-bold text-yellow-600">7</p>
                  <p className="text-sm text-gray-600">Patents</p>
                </div>
                <div className="text-center">
                  <div className="p-6 bg-red-100 rounded-lg mb-2">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
                  </div>
                  <p className="font-medium">High Risk</p>
                  <p className="text-2xl font-bold text-red-600">3</p>
                  <p className="text-sm text-gray-600">Patents</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Assessment Types</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Freedom to Operate</p>
                      <p className="text-xs text-gray-500">Check product clearance</p>
                    </div>
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Infringement Analysis</p>
                      <p className="text-xs text-gray-500">Evaluate patent conflicts</p>
                    </div>
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Invalidity Assessment</p>
                      <p className="text-xs text-gray-500">Prior art analysis</p>
                    </div>
                    <TrendingDown className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Assessments</h3>
              <div className="space-y-3 text-sm">
                <div className="pb-3 border-b">
                  <p className="font-medium text-gray-900">Biotech Patent Portfolio</p>
                  <p className="text-xs text-gray-500">Completed 2 days ago</p>
                  <span className="text-xs text-green-600">✓ Low risk identified</span>
                </div>
                <div className="pb-3 border-b">
                  <p className="font-medium text-gray-900">AI Algorithm Suite</p>
                  <p className="text-xs text-gray-500">Completed 5 days ago</p>
                  <span className="text-xs text-yellow-600">⚠ Medium risk - 2 conflicts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentRiskAssessment;