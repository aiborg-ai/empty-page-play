import { useState } from 'react';
import {
  Brain,
  Search,
  ChevronRight,
  Clock,
  Users,
  Target,
  TrendingUp,
  Play,
  History,
  HelpCircle,
  X
} from 'lucide-react';
import { DECISION_ENGINES, ENGINE_CATEGORIES } from '../constants/decisionEngines';
import { DecisionEngine, EngineSession } from '../types/decisionEngines';
import DecisionEngineModal from './modals/DecisionEngineModal';
import { DecisionEngineService } from '../lib/decisionEngineService';
import HelpIcon from './utils/HelpIcon';
import SearchFilterBar from './common/SearchFilterBar';

interface DecisionEnginesProps {
  currentUser: any;
  onNavigate?: (section: string) => void;
}

export default function DecisionEngines({ currentUser, onNavigate }: DecisionEnginesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<DecisionEngine | null>(null);
  const [showEngineModal, setShowEngineModal] = useState(false);
  const [recentSessions, setRecentSessions] = useState<EngineSession[]>([]);
  const [, setIsLoading] = useState(false);

  // Filter engines based on category and search
  const filteredEngines = DECISION_ENGINES.filter(engine => {
    const matchesCategory = selectedCategory === 'all' || engine.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      engine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engine.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Load recent sessions
  useState(() => {
    const loadRecentSessions = async () => {
      try {
        const sessions = await DecisionEngineService.getRecentSessions(currentUser.id);
        setRecentSessions(sessions);
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };
    loadRecentSessions();
  });

  const handleEngineSelect = (engine: DecisionEngine) => {
    setSelectedEngine(engine);
    setShowEngineModal(true);
  };

  const handleSessionComplete = (session: EngineSession) => {
    setRecentSessions(prev => [session, ...prev].slice(0, 5));
    setShowEngineModal(false);
  };

  const handleResumeSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const session = await DecisionEngineService.getSession(sessionId);
      if (session) {
        const engine = DECISION_ENGINES.find(e => e.id === session.engineId);
        if (engine) {
          setSelectedEngine(engine);
          setShowEngineModal(true);
        }
      }
    } catch (error) {
      console.error('Error resuming session:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const getEngineStats = () => {
    const completedSessions = recentSessions.filter(s => s.status === 'completed').length;
    const avgTime = recentSessions.reduce((acc, s) => {
      if (s.completedAt) {
        const duration = new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime();
        return acc + duration;
      }
      return acc;
    }, 0) / (completedSessions || 1) / 60000; // Convert to minutes

    return {
      totalEngines: DECISION_ENGINES.length,
      completedSessions,
      avgTime: Math.round(avgTime)
    };
  };

  const stats = getEngineStats();

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-10 h-10" />
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  IP Decision Engines
                  <HelpIcon section="decision-engines" onNavigate={onNavigate} className="text-white/80 hover:text-white hover:bg-white/20" />
                </h1>
              </div>
              <p className="text-indigo-100 text-lg mb-4">
                AI-powered guidance for critical IP decisions in under 15 minutes
              </p>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span className="text-sm">{stats.totalEngines} Engines Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm">{stats.completedSessions} Decisions Made</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">Avg. {stats.avgTime} min/decision</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.('decision-engines-help')}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Get Help"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <SearchFilterBar
          placeholder="Search decision engines by name, purpose, or category..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          categories={[
            { value: 'all', label: 'All Engines', count: filteredEngines.length },
            ...ENGINE_CATEGORIES.map(cat => ({
              value: cat.id,
              label: cat.label,
              count: DECISION_ENGINES.filter(e => e.category === cat.id).length
            }))
          ]}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortOptions={[
            { value: 'recent', label: 'Most Recent' },
            { value: 'popular', label: 'Most Used' },
            { value: 'duration', label: 'Shortest Duration' },
            { value: 'alpha', label: 'Alphabetical' }
          ]}
          className="mb-6"
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Search Engines</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Search engines..."
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {ENGINE_CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span className="text-sm font-medium">{category.label}</span>
                      </div>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            {recentSessions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Sessions
                </h3>
                <div className="space-y-3">
                  {recentSessions.slice(0, 5).map(session => {
                    const engine = DECISION_ENGINES.find(e => e.id === session.engineId);
                    if (!engine) return null;
                    
                    return (
                      <div
                        key={session.id}
                        className="pb-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {engine.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {session.status === 'completed' ? 'Completed' : 'In Progress'}
                              {' • '}
                              {new Date(session.startedAt).toLocaleDateString()}
                            </div>
                          </div>
                          {session.status === 'active' && (
                            <button
                              onClick={() => handleResumeSession(session.id)}
                              className="text-xs text-indigo-600 hover:text-indigo-700"
                            >
                              Resume
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Engines Grid */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEngines.map(engine => (
                <div
                  key={engine.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => handleEngineSelect(engine)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`text-3xl`}>
                        {engine.icon}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 group-hover:text-gray-600 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {engine.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {engine.purpose}
                    </p>

                    {/* Engine Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{engine.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{engine.targetPersonas[0]}</span>
                      </div>
                    </div>

                    {/* Start Button */}
                    <button
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEngineSelect(engine);
                      }}
                    >
                      <Play className="w-4 h-4" />
                      <span className="font-medium">Start Analysis</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredEngines.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No engines found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}

            {/* Quick Start Guide */}
            {searchQuery === '' && selectedCategory === 'all' && (
              <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      How Decision Engines Work
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-indigo-600">1.</span>
                        <span>Select an engine matching your decision need</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-indigo-600">2.</span>
                        <span>Answer 3-5 adaptive questions about your situation</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-indigo-600">3.</span>
                        <span>AI analyzes data from patent databases and market intelligence</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-indigo-600">4.</span>
                        <span>Receive data-backed recommendations with citations</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-indigo-600">5.</span>
                        <span>Export results as JSON or PDF for audit trail</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() => onNavigate?.('decision-engines-demo')}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Watch Demo →
                      </button>
                      <button
                        onClick={() => onNavigate?.('decision-engines-guide')}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View User Guide →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Engine Modal */}
      {showEngineModal && selectedEngine && (
        <DecisionEngineModal
          engine={selectedEngine}
          currentUser={currentUser}
          onClose={() => {
            setShowEngineModal(false);
            setSelectedEngine(null);
          }}
          onComplete={handleSessionComplete}
        />
      )}
    </div>
  );
}