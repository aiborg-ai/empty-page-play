import React, { useState } from 'react';
import { Users, MessageSquare, FileText, CheckCircle, Edit3 } from 'lucide-react';

const InnovationTeamHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workspace');

  const inventions = [
    { id: '1', title: 'Smart Battery Management', status: 'drafting', assignee: 'Dr. Chen', progress: 60 },
    { id: '2', title: 'Quantum Algorithm', status: 'review', assignee: 'Dr. Liu', progress: 85 },
    { id: '3', title: 'Nano Sensor Array', status: 'submitted', assignee: 'Dr. Watson', progress: 100 }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Innovation Team Collaboration Hub</h1>
          <p className="text-gray-600 mt-2">Collaborative workspace for R&D teams and patent drafting</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['workspace', 'inventions', 'discussions', 'resources'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'workspace' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Active Inventions</h3>
                    <div className="space-y-4">
                      {inventions.map(inv => (
                        <div key={inv.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{inv.title}</h4>
                            <p className="text-sm text-gray-600">{inv.assignee} • {inv.status}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${inv.progress}%` }}
                              />
                            </div>
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit3 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Patent Drafting Assistant</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">AI-powered suggestions available</p>
                        <button className="mt-2 text-blue-600 text-sm font-medium">Generate Claims →</button>
                      </div>
                      <textarea
                        className="w-full p-3 border rounded-lg"
                        rows={6}
                        placeholder="Start drafting your patent description..."
                      />
                      <div className="flex gap-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          Check Prior Art
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                          Save Draft
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Team Members</h3>
                    <div className="space-y-3">
                      {['Dr. Sarah Chen', 'Dr. Michael Liu', 'Dr. Emma Watson'].map(member => (
                        <div key={member} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-700">{member}</span>
                          </div>
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-gray-900">Claims approved</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-gray-900">New comment on draft</p>
                          <p className="text-xs text-gray-500">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <FileText className="w-4 h-4 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-gray-900">Prior art report ready</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationTeamHub;