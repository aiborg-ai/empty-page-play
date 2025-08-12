import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Shield,
  Target,
  BarChart3,
  Eye,
  Plus,
  Settings,
  Search,
  Download,
  RefreshCw,
  Bell,
  Zap,
  Globe,
  Calendar,
  FileText,
  Award,
  Activity,
  Building,
  Lightbulb,
  X,
  ExternalLink
} from 'lucide-react';
import {
  Competitor,
  CompetitiveIntelligenceDashboard,
  CompetitiveLandscape,
  Alert,
  CompetitorFilters
} from '../types/competitiveIntelligence';
import { competitiveIntelligenceService } from '../lib/competitiveIntelligenceService';
import HelpIcon from './utils/HelpIcon';

interface CompetitiveIntelligenceProps {
  currentUser: any;
  onNavigate?: (section: string) => void;
}

const CompetitiveIntelligence: React.FC<CompetitiveIntelligenceProps> = ({ currentUser, onNavigate }) => {
  const [dashboardData, setDashboardData] = useState<CompetitiveIntelligenceDashboard | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [landscapes, setLandscapes] = useState<CompetitiveLandscape[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'competitors' | 'landscapes' | 'alerts' | 'insights'>('dashboard');
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [showCompetitorModal, setShowCompetitorModal] = useState(false);
  const [showAddCompetitorModal, setShowAddCompetitorModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [competitorFilters, setCompetitorFilters] = useState<CompetitorFilters>({});
  const [alertFilters, setAlertFilters] = useState({ unreadOnly: false, severity: [] as string[] });

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardResult, competitorsResult, landscapesResult, alertsResult] = await Promise.all([
        competitiveIntelligenceService.getDashboardData(),
        competitiveIntelligenceService.getCompetitors(),
        competitiveIntelligenceService.getLandscapeAnalyses(),
        competitiveIntelligenceService.getAlerts()
      ]);
      
      setDashboardData(dashboardResult);
      setCompetitors(competitorsResult);
      setLandscapes(landscapesResult);
      setAlerts(alertsResult);
    } catch (error) {
      console.error('Error loading competitive intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCompetitor = async (competitorId: string) => {
    try {
      const competitor = await competitiveIntelligenceService.getCompetitor(competitorId);
      setSelectedCompetitor(competitor);
      setShowCompetitorModal(true);
    } catch (error) {
      console.error('Error loading competitor details:', error);
    }
  };

  const handleAddCompetitor = async (competitorData: Partial<Competitor>) => {
    try {
      await competitiveIntelligenceService.addCompetitor(competitorData);
      await loadDashboardData(); // Refresh data
      setShowAddCompetitorModal(false);
    } catch (error) {
      console.error('Error adding competitor:', error);
    }
  };

  // Avoid unused variable warning
  void handleAddCompetitor;

  const getThreatLevelColor = (level: string): string => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Activity className="w-4 h-4 text-yellow-600" />;
      case 'low': return <Bell className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(0);
  };

  const filteredCompetitors = competitors.filter(competitor => {
    const matchesSearch = competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         competitor.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (competitorFilters.industry && !competitor.industry.toLowerCase().includes(competitorFilters.industry.toLowerCase())) {
      return false;
    }
    
    if (competitorFilters.threatLevel && competitorFilters.threatLevel.length > 0) {
      if (!competitorFilters.threatLevel.includes(competitor.marketIntelligence.threatLevel)) {
        return false;
      }
    }
    
    return matchesSearch;
  });

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilters.unreadOnly && alert.readAt) return false;
    if (alertFilters.severity.length > 0 && !alertFilters.severity.includes(alert.severity)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="h-full bg-gray-50 overflow-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading competitive intelligence...</p>
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

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-10 h-10" />
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Competitive Intelligence Dashboard
                  <HelpIcon 
                    section="competitive-intelligence" 
                    onNavigate={onNavigate} 
                    className="text-white/80 hover:text-white hover:bg-white/20" 
                  />
                </h1>
              </div>
              <p className="text-purple-100 text-lg mb-4">
                Advanced competitive analysis and market intelligence for strategic decision making
              </p>
              
              {/* Key Stats */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">{dashboardData.overview.totalCompetitorsMonitored} Competitors Tracked</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm">{dashboardData.overview.activeThreats} Active Threats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <span className="text-sm">{dashboardData.overview.alertsLast30Days} Recent Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span className="text-sm">{dashboardData.keyMetrics.opportunityIndex.toFixed(0)} Opportunity Index</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddCompetitorModal(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Competitor
              </button>
              <button
                onClick={loadDashboardData}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
              <button
                onClick={() => onNavigate?.('competitive-intelligence-settings')}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Threat Level</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 capitalize">{dashboardData.keyMetrics.threatLevel}</p>
            <p className="text-sm text-gray-600">{dashboardData.overview.activeThreats} active threats</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Innovation Velocity</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.keyMetrics.innovationVelocity.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Patents per year growth</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Our Position</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">#{dashboardData.performanceTracking.ourPosition.overallRanking}</p>
            <p className="text-sm text-gray-600">Overall ranking</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">New Opportunities</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.emergingTrends}</p>
            <p className="text-sm text-gray-600">Emerging trends identified</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { key: 'competitors', label: 'Competitors', icon: Users, count: competitors.length },
                { key: 'landscapes', label: 'Market Landscapes', icon: Globe, count: landscapes.length },
                { key: 'alerts', label: 'Alerts & Monitoring', icon: Bell, count: alerts.filter(a => !a.readAt).length },
                { key: 'insights', label: 'Strategic Insights', icon: Lightbulb }
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
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.key ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Market Trends and Hot Technologies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Hot Technologies
                </h2>
                <div className="space-y-4">
                  {dashboardData.trendingAnalysis.hotTechnologies.map((tech, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{tech.technology}</div>
                        <div className="text-sm text-gray-600">
                          Growth: {tech.patentGrowthRate.toFixed(1)}% | Market: {formatCurrency(tech.marketPotential)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {tech.keyPlayers.slice(0, 2).map(player => (
                            <span key={player} className="px-2 py-1 text-xs bg-white rounded border">
                              {player}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tech.disruptivePotential === 'high' ? 'bg-red-100 text-red-800' :
                        tech.disruptivePotential === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {tech.disruptivePotential} risk
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  Emerging Competitors
                </h2>
                <div className="space-y-4">
                  {dashboardData.trendingAnalysis.emergingCompetitors.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{competitor.name}</div>
                        <div className="text-sm text-gray-600">
                          {competitor.industry} | Founded {competitor.foundedYear}
                        </div>
                        <div className="text-sm text-gray-600">
                          {competitor.patentCount} patents | Growth: {competitor.growthRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Funding: {formatCurrency(competitor.fundingRaised)}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(competitor.threatLevel)}`}>
                        {competitor.threatLevel} threat
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Competitive Activity
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patent Filings */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Recent Patent Filings</h3>
                  <div className="space-y-3">
                    {dashboardData.recentActivity.newPatentFilings.slice(0, 3).map((filing) => (
                      <div key={filing.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900">{filing.patentNumber}</div>
                          <div className="text-sm text-gray-600 truncate">{filing.title}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>{filing.applicant}</span>
                            <span>•</span>
                            <span>{filing.filingDate}</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-xs rounded ${
                          filing.significance === 'high' ? 'bg-red-100 text-red-800' :
                          filing.significance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {filing.significance}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Movements */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Competitor Movements</h3>
                  <div className="space-y-3">
                    {dashboardData.recentActivity.competitorMovements.slice(0, 3).map((movement) => (
                      <div key={movement.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Building className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900">{movement.competitor}</div>
                          <div className="text-sm text-gray-600">{movement.description}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="capitalize">{movement.movementType.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{movement.date}</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-xs rounded ${
                          movement.impact === 'high' ? 'bg-red-100 text-red-800' :
                          movement.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {movement.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                Strategic Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.topInsights.slice(0, 6).map((insight) => (
                  <div key={insight.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        insight.category === 'threat' ? 'bg-red-100 text-red-800' :
                        insight.category === 'opportunity' ? 'bg-green-100 text-green-800' :
                        insight.category === 'trend' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {insight.category}
                      </div>
                      <div className={`px-2 py-1 text-xs font-medium rounded ${
                        insight.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        insight.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.priority}
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{insight.confidence}% confidence</span>
                      <span className="text-gray-500">{insight.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search competitors by name or industry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={competitorFilters.industry || ''}
                  onChange={(e) => setCompetitorFilters({...competitorFilters, industry: e.target.value || undefined})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Industries</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Quantum Computing">Quantum Computing</option>
                  <option value="Clean Energy">Clean Energy</option>
                  <option value="Advanced Materials">Advanced Materials</option>
                </select>
                <button
                  onClick={() => setShowAddCompetitorModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Competitor
                </button>
              </div>
            </div>

            {/* Competitors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompetitors.map((competitor) => (
                <div key={competitor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{competitor.name}</h3>
                      <p className="text-sm text-gray-600">{competitor.industry}</p>
                      <p className="text-xs text-gray-500">{competitor.headquarters}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(competitor.marketIntelligence.threatLevel)}`}>
                      {competitor.marketIntelligence.threatLevel}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Patents:</span>
                      <span className="font-medium">{formatNumber(competitor.patentMetrics.totalPatents)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">{formatCurrency(competitor.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Market Share:</span>
                      <span className="font-medium">{competitor.marketIntelligence.marketShare.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Innovation Index:</span>
                      <span className="font-medium">{competitor.marketIntelligence.innovationIndex}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Top Technologies:</div>
                    <div className="flex flex-wrap gap-1">
                      {competitor.patentMetrics.topTechnologies.slice(0, 3).map(tech => (
                        <span key={tech} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewCompetitor(competitor.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>
                    <button
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Generate Report"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Monitor"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCompetitors.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No competitors found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters, or add a new competitor to track.</p>
                <button
                  onClick={() => setShowAddCompetitorModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add First Competitor
                </button>
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Alert Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="unread-only"
                      checked={alertFilters.unreadOnly}
                      onChange={(e) => setAlertFilters({...alertFilters, unreadOnly: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="unread-only" className="text-sm text-gray-700">Unread only</label>
                  </div>
                  
                  <select
                    multiple
                    value={alertFilters.severity}
                    onChange={(e) => setAlertFilters({...alertFilters, severity: Array.from(e.target.selectedOptions, option => option.value)})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <button
                  onClick={loadDashboardData}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Alerts List */}
            <div className="bg-white rounded-lg shadow-sm">
              {filteredAlerts.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
                  <p className="text-gray-600">All alerts have been addressed or try adjusting your filters.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className={`p-6 hover:bg-gray-50 transition-colors ${
                      !alert.readAt ? 'bg-blue-50/30 border-l-4 border-blue-500' : ''
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 rounded-lg bg-white border border-gray-200">
                            {getSeverityIcon(alert.severity)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getThreatLevelColor(alert.severity)}`}>
                                {alert.severity}
                              </span>
                              {!alert.readAt && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">{alert.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {alert.competitor}
                              </span>
                              {alert.technology && (
                                <span className="flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  {alert.technology}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(alert.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {alert.actionRequired && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                              Action Required
                            </span>
                          )}
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <ExternalLink className="w-4 h-4" />
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

        {/* Other tab content placeholders */}
        {activeTab === 'landscapes' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Market Landscapes</h3>
              <p className="text-gray-600 mb-4">Comprehensive competitive landscape analysis and market intelligence</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Landscape Analysis
              </button>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Strategic Insights</h3>
              <p className="text-gray-600 mb-4">AI-powered strategic insights and recommendations</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Generate Insights Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Competitor Details Modal */}
      {showCompetitorModal && selectedCompetitor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedCompetitor.name}</h2>
                  <p className="text-gray-600">{selectedCompetitor.industry} • {selectedCompetitor.headquarters}</p>
                </div>
                <button
                  onClick={() => setShowCompetitorModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Company Overview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Founded:</span>
                      <span>{selectedCompetitor.foundedYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employees:</span>
                      <span>{formatNumber(selectedCompetitor.employeeCount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue:</span>
                      <span>{formatCurrency(selectedCompetitor.revenue)}</span>
                    </div>
                    {selectedCompetitor.marketCap && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Cap:</span>
                        <span>{formatCurrency(selectedCompetitor.marketCap)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Patent Portfolio</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Patents:</span>
                      <span>{formatNumber(selectedCompetitor.patentMetrics.totalPatents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Patents:</span>
                      <span>{formatNumber(selectedCompetitor.patentMetrics.activePatents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last 12 Months:</span>
                      <span>{selectedCompetitor.patentMetrics.patentsLast12Months}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Rate:</span>
                      <span>{selectedCompetitor.patentMetrics.portfolioGrowthRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Top Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCompetitor.patentMetrics.topTechnologies.map(tech => (
                    <span key={tech} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Recent News</h3>
                <div className="space-y-3">
                  {selectedCompetitor.strategicIntelligence.recentNews.slice(0, 3).map(news => (
                    <div key={news.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{news.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{news.summary}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{news.date}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ml-3 ${
                          news.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          news.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {news.sentiment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Setup Monitoring
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Competitor Modal */}
      {showAddCompetitorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add New Competitor</h2>
                <button
                  onClick={() => setShowAddCompetitorModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Add Competitor Form</h3>
                <p className="text-gray-600">Competitor addition form would be implemented here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitiveIntelligence;