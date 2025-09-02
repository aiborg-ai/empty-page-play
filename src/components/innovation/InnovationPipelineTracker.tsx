import React, { useState } from 'react';
import { Plus, Clock, CheckCircle, TrendingUp, Calendar, Users } from 'lucide-react';

interface PipelineItem {
  id: string;
  title: string;
  stage: 'ideation' | 'research' | 'development' | 'filing' | 'prosecution' | 'granted';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate: string;
  progress: number;
  patentNumber?: string;
  description: string;
  milestones: { name: string; completed: boolean; date?: string }[];
}

const InnovationPipelineTracker: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [items, _setItems] = useState<PipelineItem[]>([
    {
      id: '1',
      title: 'AI-Powered Battery Management System',
      stage: 'filing',
      priority: 'high',
      assignee: 'Dr. Sarah Chen',
      dueDate: '2025-09-15',
      progress: 75,
      description: 'Revolutionary battery management using neural networks',
      milestones: [
        { name: 'Concept Development', completed: true, date: '2025-01-15' },
        { name: 'Prototype Testing', completed: true, date: '2025-03-20' },
        { name: 'Patent Drafting', completed: true, date: '2025-06-10' },
        { name: 'USPTO Filing', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Quantum Encryption Protocol',
      stage: 'development',
      priority: 'critical',
      assignee: 'Dr. Michael Liu',
      dueDate: '2025-10-30',
      progress: 45,
      description: 'Next-gen encryption for quantum computing era',
      milestones: [
        { name: 'Theoretical Framework', completed: true, date: '2025-02-01' },
        { name: 'Algorithm Design', completed: true, date: '2025-04-15' },
        { name: 'Security Validation', completed: false },
        { name: 'Patent Application', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Biodegradable Sensor Array',
      stage: 'granted',
      priority: 'medium',
      assignee: 'Dr. Emma Watson',
      dueDate: '2025-07-01',
      progress: 100,
      patentNumber: 'US11,234,567',
      description: 'Environmental sensors that decompose naturally',
      milestones: [
        { name: 'Research Complete', completed: true, date: '2024-08-10' },
        { name: 'Patent Filed', completed: true, date: '2024-11-20' },
        { name: 'Examination', completed: true, date: '2025-03-15' },
        { name: 'Patent Granted', completed: true, date: '2025-06-30' }
      ]
    }
  ]);

  const stages = [
    { id: 'ideation', name: 'Ideation', color: 'bg-purple-100', borderColor: 'border-purple-300', icon: '💡' },
    { id: 'research', name: 'Research', color: 'bg-blue-100', borderColor: 'border-blue-300', icon: '🔬' },
    { id: 'development', name: 'Development', color: 'bg-indigo-100', borderColor: 'border-indigo-300', icon: '⚙️' },
    { id: 'filing', name: 'Filing', color: 'bg-yellow-100', borderColor: 'border-yellow-300', icon: '📄' },
    { id: 'prosecution', name: 'Prosecution', color: 'bg-orange-100', borderColor: 'border-orange-300', icon: '⚖️' },
    { id: 'granted', name: 'Granted', color: 'bg-green-100', borderColor: 'border-green-300', icon: '✅' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Filtering logic removed - was unused
  // const __filteredItems = selectedStage === 'all' 
  //   ? items 
  //   : items.filter(item => item.stage === selectedStage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Innovation Pipeline Tracker</h1>
              <p className="text-gray-600 mt-2">Track innovations from ideation through patent grant</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Plus className="w-5 h-5" />
              New Innovation
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedStage('all')}
              className={`px-4 py-2 rounded-lg ${
                selectedStage === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              All Stages ({items.length})
            </button>
            {stages.map(stage => {
              const count = items.filter(item => item.stage === stage.id).length;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    selectedStage === stage.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  <span>{stage.icon}</span>
                  {stage.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {stages.map(stage => (
            <div key={stage.id} className="space-y-4">
              <div className={`p-4 rounded-lg ${stage.color} ${stage.borderColor} border-2`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <span className="text-2xl">{stage.icon}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {items.filter(item => item.stage === stage.id).length} items
                </p>
              </div>

              <div className="space-y-3">
                {items
                  .filter(item => item.stage === stage.id)
                  .map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.title}
                        </h4>
                      </div>
                      
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Users className="w-3 h-3" />
                          <span className="truncate">{item.assignee}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                        </div>

                        {item.patentNumber && (
                          <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                            <CheckCircle className="w-3 h-3" />
                            <span>{item.patentNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-medium text-gray-900">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Next Milestone:</span>
                          <p className="mt-1">
                            {item.milestones.find(m => !m.completed)?.name || 'All complete'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Pipeline Statistics</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Innovations</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Patents Granted</span>
                <span className="font-semibold text-green-600">
                  {items.filter(i => i.stage === 'granted').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Development</span>
                <span className="font-semibold text-blue-600">
                  {items.filter(i => ['research', 'development'].includes(i.stage)).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Critical Priority</span>
                <span className="font-semibold text-red-600">
                  {items.filter(i => i.priority === 'critical').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Upcoming Deadlines</h3>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="space-y-3">
              {items
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 4)
                .map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 truncate mr-2">{item.title}</span>
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Team Performance</h3>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-3">
              {['Dr. Sarah Chen', 'Dr. Michael Liu', 'Dr. Emma Watson'].map(name => (
                <div key={name} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{name}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {items.filter(i => i.assignee === name).length} projects
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationPipelineTracker;