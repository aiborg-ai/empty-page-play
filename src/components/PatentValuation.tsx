import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  AlertTriangle,
  Eye,
  Settings,
  Plus,
  Download,
  RefreshCw,
  Calendar,
  Users,
  FileText,
  Zap,
  Award,
  PieChart,
  Activity,
  Search,
  X
} from 'lucide-react';
import { PatentValuation as PatentValuationType, ValuationDashboard } from '../types/patentValuation';
import { patentValuationService } from '../lib/patentValuationService';
import HelpIcon from './utils/HelpIcon';

interface PatentValuationProps {
  currentUser: any;
  onNavigate?: (section: string) => void;
}

const PatentValuation: React.FC<PatentValuationProps> = ({ currentUser, onNavigate }) => {
  const [dashboardData, setDashboardData] = useState<ValuationDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'valuations' | 'portfolios' | 'reports'>('dashboard');
  const [selectedValuation, setSelectedValuation] = useState<PatentValuationType | null>(null);
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'high-value' | 'recent'>('all');

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await patentValuationService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValuatePatent = async (patentId?: string) => {
    try {
      const patentToValuate = patentId || `patent-${Date.now()}`;
      const valuation = await patentValuationService.valuatePatent(patentToValuate);
      setSelectedValuation(valuation);
      setShowValuationModal(true);
      await loadDashboardData(); // Refresh dashboard
    } catch (error) {
      console.error('Error valuating patent:', error);
    }
  };

  const handleExportValuation = async (valuationId: string, format: 'pdf' | 'excel' | 'json') => {
    try {
      const blob = await patentValuationService.exportValuation(valuationId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patent-valuation-${valuationId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting valuation:', error);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getValueChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-50 overflow-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading patent valuation dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="h-full bg-gray-50 overflow-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const filteredValuations = dashboardData.recentValuations.filter(valuation => {
    const matchesSearch = valuation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         valuation.patentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         valuation.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filterBy) {
      case 'high-value': {
        return matchesSearch && valuation.estimatedValue > 2000000;
      }
      case 'recent': {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return matchesSearch && new Date(valuation.lastUpdated) > oneWeekAgo;
      }
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-10 h-10" />
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  AI-Powered Patent Valuation
                  <HelpIcon 
                    section="patent-valuation" 
                    onNavigate={onNavigate} 
                    className="text-white/80 hover:text-white hover:bg-white/20" 
                  />
                </h1>
              </div>
              <p className="text-green-100 text-lg mb-4">
                Advanced AI algorithms for accurate patent portfolio valuation and market analysis
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm">{formatCurrency(dashboardData.totalPortfolioValue)} Total Value</span>
                </div>
                <div className={`flex items-center gap-2 ${getValueChangeColor(dashboardData.valueChange.percentage)}`}>
                  {dashboardData.valueChange.percentage > 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span className="text-sm">
                    {dashboardData.valueChange.percentage > 0 ? '+' : ''}{dashboardData.valueChange.percentage.toFixed(1)}% ({dashboardData.valueChange.period})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm">{dashboardData.recentValuations.length} Recent Valuations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="text-sm">Top {dashboardData.benchmarking.industryPercentile}th Percentile</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleValuatePatent()}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Valuation
              </button>
              <button
                onClick={loadDashboardData}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
              <button
                onClick={() => onNavigate?.('patent-valuation-settings')}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Top Performers</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.topPerformers.length}</p>
            <p className="text-sm text-gray-600">High-value patents</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Underperformers</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.underperformers.length}</p>
            <p className="text-sm text-gray-600">Need attention</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Market Trends</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.marketTrends.length}</p>
            <p className="text-sm text-gray-600">Trending technologies</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Action Items</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.alertsAndActions.length}</p>
            <p className="text-sm text-gray-600">Require attention</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { key: 'valuations', label: 'Patent Valuations', icon: DollarSign },
                { key: 'portfolios', label: 'Portfolio Analysis', icon: PieChart },
                { key: 'reports', label: 'Valuation Reports', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Market Trends */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Trends</h2>
              <div className="space-y-3">
                {dashboardData.marketTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-gray-900">{trend.technology}</div>
                      <div className={`flex items-center gap-1 ${
                        trend.trend === 'up' ? 'text-green-600' : trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {trend.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : trend.trend === 'down' ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <Activity className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {trend.impact > 0 ? '+' : ''}{(trend.impact * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{trend.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Top Performers
                </h2>
                <div className="space-y-3">
                  {dashboardData.topPerformers.slice(0, 3).map((patent) => (
                    <div key={patent.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{patent.patentNumber}</div>
                        <div className="text-sm text-gray-600 truncate">{patent.title}</div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="font-semibold text-green-700">{formatCurrency(patent.estimatedValue)}</div>
                        <div className="text-xs text-gray-500">{Math.round(patent.aiConfidence * 100)}% confidence</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Priority Actions
                </h2>
                <div className="space-y-3">
                  {dashboardData.alertsAndActions.slice(0, 3).map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className={`p-1 rounded ${
                        action.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {action.type === 'license' ? <Target className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 capitalize">{action.type} Action</div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Expected revenue: {formatCurrency(action.estimatedRevenue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Valuations Tab */}
        {activeTab === 'valuations' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patents by number, title, or assignee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Valuations</option>
                  <option value="high-value">High Value (&gt;$2M)</option>
                  <option value="recent">Recent (7 days)</option>
                </select>
                <button
                  onClick={() => handleValuatePatent()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Valuation
                </button>
              </div>
            </div>

            {/* Valuations List */}
            <div className="bg-white rounded-lg shadow-sm">
              {filteredValuations.length === 0 ? (
                <div className="p-12 text-center">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No valuations found</h3>
                  <p className="text-gray-600">Try adjusting your search or create a new valuation</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredValuations.map((valuation) => (
                    <div key={valuation.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{valuation.patentNumber}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              valuation.estimatedValue > 5000000
                                ? 'bg-green-100 text-green-800'
                                : valuation.estimatedValue > 2000000
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {formatCurrency(valuation.estimatedValue)}
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              {Math.round(valuation.aiConfidence * 100)}% confidence
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3 truncate">{valuation.title}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {valuation.assignee}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(valuation.lastUpdated).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              {valuation.valuationMethod.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => {
                              setSelectedValuation(valuation);
                              setShowValuationModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleExportValuation(valuation.id, 'pdf')}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Export PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Portfolio Analysis Tab */}
        {activeTab === 'portfolios' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Portfolio Analysis</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive portfolio valuation and strategic analysis
              </p>
              <button
                onClick={() => handleValuatePatent()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Portfolio Analysis
              </button>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Valuation Reports</h3>
              <p className="text-gray-600 mb-4">
                Generate comprehensive valuation reports for your patents
              </p>
              <button
                onClick={() => handleValuatePatent()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Generate Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Valuation Detail Modal */}
      {showValuationModal && selectedValuation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedValuation.patentNumber}</h2>
                  <p className="text-gray-600">{selectedValuation.title}</p>
                </div>
                <button
                  onClick={() => setShowValuationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Valuation Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Value:</span>
                      <span className="font-semibold">{formatCurrency(selectedValuation.estimatedValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-semibold">{Math.round(selectedValuation.aiConfidence * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-semibold capitalize">{selectedValuation.valuationMethod}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Value Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Technical:</span>
                      <span>{formatCurrency(selectedValuation.valuationBreakdown.technicalValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market:</span>
                      <span>{formatCurrency(selectedValuation.valuationBreakdown.marketValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Legal:</span>
                      <span>{formatCurrency(selectedValuation.valuationBreakdown.legalValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Strategic:</span>
                      <span>{formatCurrency(selectedValuation.valuationBreakdown.strategicValue)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Key Factors</h3>
                <div className="space-y-2">
                  {selectedValuation.keyFactors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        factor.impact === 'positive' ? 'bg-green-500' : 
                        factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900">{factor.factor}</div>
                        <div className="text-sm text-gray-600">{factor.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleExportValuation(selectedValuation.id, 'pdf')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleExportValuation(selectedValuation.id, 'excel')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatentValuation;