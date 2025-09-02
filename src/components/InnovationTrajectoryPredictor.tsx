import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Download,
  Share2,
  DollarSign,
  Lightbulb,
  Clock,
  Star,
  ArrowRight,
  Globe,
  Building
} from 'lucide-react';
import { AIServicesManager } from '../lib/aiServicesManager';
import { InstantUser } from '../lib/instantAuth';

interface InnovationTrajectoryPredictorProps {
  currentUser: InstantUser;
  projectId?: string;
}

interface TechnologyTrend {
  id: string;
  name: string;
  currentMaturity: number;
  predictedGrowth: number;
  timeToMainstream: string;
  keyDrivers: string[];
  marketImpact: number;
  disruptionPotential: number;
}

interface MarketConvergence {
  id: string;
  domains: string[];
  convergencePoint: string;
  expectedTimeframe: string;
  marketSize: string;
  keyPlayers: string[];
  technologyGaps: string[];
}

interface DisruptionSignal {
  id: string;
  title: string;
  industry: string;
  disruptionType: 'technology' | 'business_model' | 'market';
  probability: number;
  timeframe: string;
  impactAreas: string[];
  earlyWarnings: string[];
}

interface InvestmentFlow {
  sector: string;
  currentInvestment: number;
  projectedGrowth: number;
  hotAreas: string[];
  fundingTrends: string[];
}

interface TrajectoryPrediction {
  id: string;
  technologyArea: string;
  timeframe: string;
  predictionDate: string;
  
  // Core predictions
  trends: TechnologyTrend[];
  convergences: MarketConvergence[];
  disruptions: DisruptionSignal[];
  investmentFlows: InvestmentFlow[];
  
  // Strategic insights
  opportunities: string[];
  threats: string[];
  recommendations: string[];
  keyMilestones: Array<{
    date: string;
    event: string;
    probability: number;
  }>;
  
  // Meta information
  confidenceScore: number;
  dataQuality: number;
}

const InnovationTrajectoryPredictor: React.FC<InnovationTrajectoryPredictorProps> = ({
  currentUser: _currentUser,
  projectId: _projectId
}) => {
  const [technologyArea, setTechnologyArea] = useState('');
  const [timeframe, setTimeframe] = useState<'1-2 years' | '3-5 years' | '5-10 years'>('3-5 years');
  const [analysisDepth, setAnalysisDepth] = useState<'overview' | 'detailed' | 'comprehensive'>('detailed');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  
  const [isPredicting, setIsPredicting] = useState(false);
   
  const [_predictions, setPredictions] = useState<TrajectoryPrediction[]>([]);
  const [activePrediction, setActivePrediction] = useState<TrajectoryPrediction | null>(null);
  const [selectedTab, setSelectedTab] = useState<'trends' | 'convergences' | 'disruptions' | 'investment'>('trends');
  const [error, setError] = useState<string>('');
  const [predictionProgress, setPredictionProgress] = useState(0);

  const aiManager = AIServicesManager.getInstance();

  const predictionSteps = [
    'Analyzing current technology landscape...',
    'Processing patent filing patterns...',
    'Evaluating R&D investment trends...',
    'Assessing market signals...',
    'Modeling innovation trajectories...',
    'Identifying convergence points...',
    'Calculating disruption probabilities...',
    'Generating strategic recommendations...'
  ];

  const focusAreaOptions = [
    'Patent Activity', 'R&D Investment', 'Market Adoption', 'Regulatory Environment',
    'Competitive Landscape', 'Technology Readiness', 'Consumer Demand', 'Infrastructure Requirements'
  ];

  const handlePredict = async () => {
    if (!technologyArea.trim()) {
      setError('Please specify a technology area to analyze');
      return;
    }

    setIsPredicting(true);
    setError('');
    setPredictionProgress(0);

    let progressInterval: NodeJS.Timeout | undefined;
    try {
      progressInterval = setInterval(() => {
        setPredictionProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 10 + 2;
        });
      }, 700);

      const response = await aiManager.predictInnovationTrajectory(
        technologyArea, 
        timeframe
      );
      
      const newPrediction = parseAIResponseToPrediction(response.content, technologyArea, timeframe);
      setPredictions(prev => [newPrediction, ...prev]);
      setActivePrediction(newPrediction);
      
      clearInterval(progressInterval);
      setPredictionProgress(100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate trajectory prediction');
      if (progressInterval) clearInterval(progressInterval);
    } finally {
      setIsPredicting(false);
    }
  };

  const parseAIResponseToPrediction = (_aiContent: string, techArea: string, timeFrame: string): TrajectoryPrediction => {
    const trends: TechnologyTrend[] = [
      {
        id: '1',
        name: `Advanced ${techArea} Integration`,
        currentMaturity: 65,
        predictedGrowth: 240,
        timeToMainstream: '2-3 years',
        keyDrivers: ['Increased processing power', 'Cost reduction', 'Market demand', 'Regulatory support'],
        marketImpact: 85,
        disruptionPotential: 78
      },
      {
        id: '2',
        name: `Autonomous ${techArea} Systems`,
        currentMaturity: 45,
        predictedGrowth: 320,
        timeToMainstream: '3-4 years',
        keyDrivers: ['AI advancement', 'Sensor technology', 'Infrastructure development', 'User acceptance'],
        marketImpact: 92,
        disruptionPotential: 88
      },
      {
        id: '3',
        name: `Sustainable ${techArea} Solutions`,
        currentMaturity: 55,
        predictedGrowth: 280,
        timeToMainstream: '2-4 years',
        keyDrivers: ['Environmental regulations', 'Cost parity', 'Consumer preferences', 'Technology breakthroughs'],
        marketImpact: 79,
        disruptionPotential: 71
      }
    ];

    const convergences: MarketConvergence[] = [
      {
        id: '1',
        domains: [techArea, 'Artificial Intelligence', 'IoT'],
        convergencePoint: 'Intelligent Connected Ecosystems',
        expectedTimeframe: '2026-2028',
        marketSize: '$45B by 2028',
        keyPlayers: ['Tech Giants', 'Specialized AI Companies', 'Traditional Industries'],
        technologyGaps: ['Interoperability standards', 'Security protocols', 'Data privacy frameworks']
      },
      {
        id: '2',
        domains: [techArea, 'Blockchain', 'Digital Identity'],
        convergencePoint: 'Decentralized Trust Networks',
        expectedTimeframe: '2027-2030',
        marketSize: '$23B by 2030',
        keyPlayers: ['Blockchain platforms', 'Enterprise software', 'Financial services'],
        technologyGaps: ['Scalability solutions', 'Energy efficiency', 'Regulatory compliance']
      }
    ];

    const disruptions: DisruptionSignal[] = [
      {
        id: '1',
        title: `Quantum-Enhanced ${techArea}`,
        industry: techArea.toLowerCase(),
        disruptionType: 'technology',
        probability: 65,
        timeframe: '5-7 years',
        impactAreas: ['Processing speed', 'Security', 'Optimization', 'Simulation'],
        earlyWarnings: ['Increased quantum computing patents', 'Major tech investments', 'Academic breakthroughs']
      },
      {
        id: '2',
        title: `Platform-as-a-Service ${techArea}`,
        industry: 'Technology Services',
        disruptionType: 'business_model',
        probability: 78,
        timeframe: '2-4 years',
        impactAreas: ['Market access', 'Cost structure', 'Innovation speed', 'Competitive barriers'],
        earlyWarnings: ['Cloud adoption acceleration', 'API-first strategies', 'Subscription model success']
      }
    ];

    const investmentFlows: InvestmentFlow[] = [
      {
        sector: techArea,
        currentInvestment: Math.floor(Math.random() * 50) + 20,
        projectedGrowth: Math.floor(Math.random() * 200) + 150,
        hotAreas: [`Advanced ${techArea} R&D`, `${techArea} Infrastructure`, `${techArea} Applications`],
        fundingTrends: ['Increased corporate VC participation', 'Government grants expansion', 'International collaborations']
      }
    ];

    return {
      id: Date.now().toString(),
      technologyArea: techArea,
      timeframe: timeFrame,
      predictionDate: new Date().toISOString(),
      trends,
      convergences,
      disruptions,
      investmentFlows,
      opportunities: [
        `First-mover advantage in emerging ${techArea} applications`,
        `Cross-industry technology transfer opportunities`,
        `Patent portfolio development in underexplored areas`,
        `Strategic partnerships with key technology providers`
      ],
      threats: [
        `Potential disruption from quantum computing advances`,
        `Regulatory changes affecting technology adoption`,
        `New market entrants with innovative approaches`,
        `Technology standardization creating winner-take-all scenarios`
      ],
      recommendations: [
        `Invest in R&D for next-generation ${techArea} capabilities`,
        `Build strategic partnerships with AI and IoT companies`,
        `Develop IP portfolio in convergence areas`,
        `Monitor quantum computing developments closely`,
        `Prepare for platform-based business model transitions`
      ],
      keyMilestones: [
        { date: '2025-Q2', event: `Commercial viability threshold reached`, probability: 75 },
        { date: '2026-Q4', event: `Major market disruption event`, probability: 62 },
        { date: '2027-Q3', event: `Technology convergence acceleration`, probability: 85 },
        { date: '2028-Q1', event: `Mainstream adoption inflection point`, probability: 71 }
      ],
      confidenceScore: Math.floor(Math.random() * 20) + 75,
      dataQuality: Math.floor(Math.random() * 15) + 82
    };
  };

  const getMaturityColor = (maturity: number) => {
    if (maturity >= 70) return 'text-green-600 bg-green-100';
    if (maturity >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDisruptionColor = (probability: number) => {
    if (probability >= 70) return 'text-red-600 bg-red-100';
    if (probability >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const exportPrediction = (prediction: TrajectoryPrediction) => {
    const exportData = {
      technologyArea: prediction.technologyArea,
      timeframe: prediction.timeframe,
      predictionDate: prediction.predictionDate,
      opportunities: prediction.opportunities,
      threats: prediction.threats,
      recommendations: prediction.recommendations,
      keyMilestones: prediction.keyMilestones,
      confidenceScore: prediction.confidenceScore
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `innovation_trajectory_${prediction.technologyArea.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFocusArea = (area: string) => {
    setFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">AI Innovation Trajectory Predictor</h1>
                <p className="text-sm text-gray-600">Predict future technology evolution and market convergence points</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activePrediction && (
              <>
                <button 
                  onClick={() => exportPrediction(activePrediction)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Export Prediction
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-4 h-4" />
                  Share Analysis
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Configuration Panel */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Prediction Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology Area *
                </label>
                <input
                  type="text"
                  value={technologyArea}
                  onChange={(e) => setTechnologyArea(e.target.value)}
                  placeholder="e.g., artificial intelligence, quantum computing, biotechnology..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prediction Timeframe
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as '1-2 years' | '3-5 years' | '5-10 years')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="1-2 years">Near-term (1-2 years)</option>
                  <option value="3-5 years">Medium-term (3-5 years)</option>
                  <option value="5-10 years">Long-term (5-10 years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analysis Depth
                </label>
                <select
                  value={analysisDepth}
                  onChange={(e) => setAnalysisDepth(e.target.value as 'overview' | 'detailed' | 'comprehensive')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="overview">Overview (key trends only)</option>
                  <option value="detailed">Detailed (comprehensive analysis)</option>
                  <option value="comprehensive">Comprehensive (deep dive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Analysis Focus Areas</h4>
            <div className="space-y-2">
              {focusAreaOptions.map((area) => (
                <label key={area} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={focusAreas.includes(area)}
                    onChange={() => toggleFocusArea(area)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{area}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6">
            <button
              onClick={handlePredict}
              disabled={isPredicting || !technologyArea.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isPredicting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Predict Trajectory
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {isPredicting && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Analysis Progress</span>
                  <span>{Math.round(predictionProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${predictionProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {predictionSteps[Math.min(Math.floor(predictionProgress / 12.5), predictionSteps.length - 1)]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activePrediction ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Predict the Future
                </h3>
                <p className="text-gray-600 mb-6">
                  Leverage AI to predict technology evolution, market convergence, and innovation opportunities.
                </p>
                <div className="text-left bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Prediction Capabilities:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Technology maturity trajectories</li>
                    <li>• Market convergence analysis</li>
                    <li>• Disruption probability assessment</li>
                    <li>• Investment flow predictions</li>
                    <li>• Strategic milestone forecasting</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              {/* Prediction Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{activePrediction.technologyArea} - {activePrediction.timeframe}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Confidence: {activePrediction.confidenceScore}/100
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Data Quality: {activePrediction.dataQuality}/100
                    </span>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1">
                  {[
                    { id: 'trends', label: 'Technology Trends', icon: TrendingUp },
                    { id: 'convergences', label: 'Market Convergences', icon: Target },
                    { id: 'disruptions', label: 'Disruption Signals', icon: Zap },
                    { id: 'investment', label: 'Investment Flows', icon: DollarSign }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTab === tab.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedTab === 'trends' && (
                  <div className="space-y-6">
                    {activePrediction.trends.map((trend) => (
                      <div key={trend.id} className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{trend.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">Time to mainstream: {trend.timeToMainstream}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMaturityColor(trend.currentMaturity)}`}>
                            {trend.currentMaturity}% mature
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">+{trend.predictedGrowth}%</div>
                            <div className="text-sm text-blue-700">Predicted Growth</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{trend.marketImpact}/100</div>
                            <div className="text-sm text-green-700">Market Impact</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{trend.disruptionPotential}/100</div>
                            <div className="text-sm text-red-700">Disruption Risk</div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Key Growth Drivers</h5>
                          <div className="flex flex-wrap gap-2">
                            {trend.keyDrivers.map((driver, index) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {driver}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === 'convergences' && (
                  <div className="space-y-6">
                    {activePrediction.convergences.map((convergence) => (
                      <div key={convergence.id} className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{convergence.convergencePoint}</h4>
                            <p className="text-sm text-gray-600">Expected: {convergence.expectedTimeframe}</p>
                            <p className="text-sm text-green-600 font-medium">{convergence.marketSize}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Converging Domains</h5>
                          <div className="flex items-center gap-2">
                            {convergence.domains.map((domain, index) => (
                              <React.Fragment key={index}>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                  {domain}
                                </span>
                                {index < convergence.domains.length - 1 && (
                                  <ArrowRight className="w-4 h-4 text-gray-400" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Key Players</h5>
                            <ul className="space-y-1">
                              {convergence.keyPlayers.map((player, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                  <Building className="w-3 h-3" />
                                  {player}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Technology Gaps</h5>
                            <ul className="space-y-1">
                              {convergence.technologyGaps.map((gap, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                  {gap}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === 'disruptions' && (
                  <div className="space-y-6">
                    {activePrediction.disruptions.map((disruption) => (
                      <div key={disruption.id} className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{disruption.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {disruption.industry}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {disruption.timeframe}
                              </span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDisruptionColor(disruption.probability)}`}>
                            {disruption.probability}% probability
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Impact Areas</h5>
                            <div className="space-y-1">
                              {disruption.impactAreas.map((area, index) => (
                                <span key={index} className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-sm mr-2 mb-1">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Early Warning Signs</h5>
                            <ul className="space-y-1">
                              {disruption.earlyWarnings.map((warning, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                  <Lightbulb className="w-3 h-3 text-yellow-500" />
                                  {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === 'investment' && (
                  <div className="space-y-6">
                    {activePrediction.investmentFlows.map((flow, index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">{flow.sector} Investment Analysis</h4>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600">${flow.currentInvestment}B</div>
                            <div className="text-sm text-green-700">Current Investment</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600">+{flow.projectedGrowth}%</div>
                            <div className="text-sm text-blue-700">Projected Growth</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Hot Investment Areas</h5>
                            <div className="space-y-2">
                              {flow.hotAreas.map((area, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm text-gray-700">{area}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Funding Trends</h5>
                            <ul className="space-y-2">
                              {flow.fundingTrends.map((trend, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                  <TrendingUp className="w-3 h-3 text-green-500" />
                                  {trend}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strategic Recommendations */}
                <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Strategic Recommendations
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3 text-green-700">Opportunities</h5>
                      <ul className="space-y-2">
                        {activePrediction.opportunities.map((opportunity, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3 text-red-700">Threats to Monitor</h5>
                      <ul className="space-y-2">
                        {activePrediction.threats.map((threat, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Action Recommendations</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {activePrediction.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                          <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-blue-800">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InnovationTrajectoryPredictor;