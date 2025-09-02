import React, { useState } from 'react';
import { Search, Cpu, TrendingUp, AlertCircle, Star } from 'lucide-react';

const TechnologyScouting: React.FC = () => {
  const [activeSearch, setActiveSearch] = useState(false);

  const opportunities = [
    {
      id: '1',
      type: 'startup',
      name: 'QuantumCore Labs',
      technology: 'Quantum Error Correction',
      relevance: 94,
      status: 'High Priority',
      funding: '$12M Series A',
      patents: 8
    },
    {
      id: '2',
      type: 'research',
      name: 'MIT AI Research Lab',
      technology: 'Neuromorphic Computing',
      relevance: 87,
      status: 'Monitoring',
      publications: 23,
      citations: 456
    },
    {
      id: '3',
      type: 'patent',
      name: 'Advanced Battery Chemistry',
      technology: 'Solid-State Batteries',
      relevance: 82,
      status: 'Under Review',
      owner: 'EnergyTech Corp',
      filingDate: '2025-03-15'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Technology Scouting Assistant</h1>
          <p className="text-gray-600 mt-2">AI agent for continuous technology and partnership discovery</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter technology areas to scout..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={() => setActiveSearch(!activeSearch)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {activeSearch ? 'Searching...' : 'Start Scouting'}
            </button>
          </div>

          {activeSearch && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-900">
                <Cpu className="w-5 h-5 animate-pulse" />
                <p className="font-medium">AI Scout Active</p>
              </div>
              <p className="text-sm text-blue-700 mt-1">Scanning 1,247 sources for relevant technologies...</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Discovered Opportunities</h2>
              </div>
              <div className="p-6 space-y-4">
                {opportunities.map(opp => (
                  <div key={opp.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            opp.type === 'startup' ? 'bg-purple-100 text-purple-700' :
                            opp.type === 'research' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {opp.type.toUpperCase()}
                          </span>
                          <h3 className="font-medium text-gray-900">{opp.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{opp.technology}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {opp.funding && <span>💰 {opp.funding}</span>}
                          {opp.patents && <span>📄 {opp.patents} patents</span>}
                          {opp.publications && <span>📚 {opp.publications} papers</span>}
                          {opp.owner && <span>🏢 {opp.owner}</span>}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-sm font-medium text-gray-900">{opp.relevance}%</span>
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        </div>
                        <span className={`text-xs font-medium ${
                          opp.status === 'High Priority' ? 'text-red-600' :
                          opp.status === 'Monitoring' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {opp.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                        View Details →
                      </button>
                      <button className="text-gray-600 text-sm font-medium hover:text-gray-800">
                        Add to Watchlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Scout Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-700">Technology Focus</label>
                  <div className="mt-2 space-y-2">
                    {['AI/ML', 'Quantum', 'Biotech', 'Energy'].map(tech => (
                      <label key={tech} className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded mr-2" />
                        <span className="text-sm">{tech}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-700">Alert Threshold</label>
                  <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>Relevance &gt; 80%</option>
                    <option>Relevance &gt; 70%</option>
                    <option>All matches</option>
                  </select>
                </div>
                
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Update Configuration
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">New Patent Filing</p>
                    <p className="text-xs text-gray-500">Quantum encryption - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Startup Funding</p>
                    <p className="text-xs text-gray-500">NanoMed raised $25M - 1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyScouting;