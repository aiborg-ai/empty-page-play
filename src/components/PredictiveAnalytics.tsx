import React, { useState } from 'react';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  AlertTriangle, 
  Calendar, 
  Activity, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Zap,
  Filter,
  Download,
  RefreshCw,
  Info,
  Shield
} from 'lucide-react';
import PageHeader from './PageHeader';
import HarmonizedCard from './HarmonizedCard';

interface TrendPrediction {
  id: string;
  technology: string;
  currentFilings: number;
  predictedFilings: number;
  growthRate: number;
  confidence: number;
  timeframe: string;
  keyFactors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface MarketOpportunity {
  id: string;
  sector: string;
  opportunityScore: number;
  patentGaps: number;
  investmentPotential: number;
  competitionLevel: 'low' | 'medium' | 'high';
  timeToMarket: number;
  description: string;
}

interface RiskAssessment {
  id: string;
  category: string;
  riskScore: number;
  likelihood: number;
  impact: number;
  description: string;
  mitigation: string[];
  trends: number[];
}

const PredictiveAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trends' | 'opportunities' | 'risks' | 'insights'>('trends');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for trend predictions
  const trendPredictions: TrendPrediction[] = [
    {
      id: '1',
      technology: 'Quantum Computing',
      currentFilings: 2847,
      predictedFilings: 4521,
      growthRate: 58.8,
      confidence: 87,
      timeframe: '12 months',
      keyFactors: ['IBM breakthrough', 'Google investments', 'Government funding'],
      riskLevel: 'low'
    },
    {
      id: '2',
      technology: 'Neural Interfaces',
      currentFilings: 1923,
      predictedFilings: 3156,
      growthRate: 64.2,
      confidence: 82,
      timeframe: '12 months',
      keyFactors: ['Neuralink trials', 'Medical applications', 'VR integration'],
      riskLevel: 'medium'
    },
    {
      id: '3',
      technology: 'Solid-State Batteries',
      currentFilings: 1654,
      predictedFilings: 2387,
      growthRate: 44.3,
      confidence: 91,
      timeframe: '12 months',
      keyFactors: ['EV demand', 'Energy density', 'Manufacturing scale'],
      riskLevel: 'low'
    },
    {
      id: '4',
      technology: 'Edge AI Chips',
      currentFilings: 3241,
      predictedFilings: 5678,
      growthRate: 75.2,
      confidence: 79,
      timeframe: '12 months',
      keyFactors: ['5G rollout', 'IoT growth', 'Privacy concerns'],
      riskLevel: 'medium'
    },
    {
      id: '5',
      technology: 'Synthetic Biology',
      currentFilings: 987,
      predictedFilings: 1789,
      growthRate: 81.3,
      confidence: 74,
      timeframe: '12 months',
      keyFactors: ['COVID lessons', 'Climate solutions', 'Regulatory clarity'],
      riskLevel: 'high'
    }
  ];

  // Mock data for market opportunities
  const marketOpportunities: MarketOpportunity[] = [
    {
      id: '1',
      sector: 'Autonomous Vehicles',
      opportunityScore: 94,
      patentGaps: 127,
      investmentPotential: 89,
      competitionLevel: 'high',
      timeToMarket: 18,
      description: 'Advanced sensor fusion and decision-making algorithms show significant patent gaps despite high market potential.'
    },
    {
      id: '2',
      sector: 'Precision Medicine',
      opportunityScore: 88,
      patentGaps: 203,
      investmentPotential: 92,
      competitionLevel: 'medium',
      timeToMarket: 24,
      description: 'Personalized treatment protocols and biomarker discovery present substantial IP opportunities.'
    },
    {
      id: '3',
      sector: 'Carbon Capture',
      opportunityScore: 85,
      patentGaps: 89,
      investmentPotential: 96,
      competitionLevel: 'low',
      timeToMarket: 36,
      description: 'Novel capture mechanisms and storage solutions offer high-value patent opportunities with government support.'
    },
    {
      id: '4',
      sector: 'Space Manufacturing',
      opportunityScore: 76,
      patentGaps: 156,
      investmentPotential: 78,
      competitionLevel: 'low',
      timeToMarket: 48,
      description: 'Zero-gravity manufacturing processes and materials present emerging patent landscape opportunities.'
    }
  ];

  // Mock data for risk assessments
  const riskAssessments: RiskAssessment[] = [
    {
      id: '1',
      category: 'Technology Convergence',
      riskScore: 78,
      likelihood: 85,
      impact: 92,
      description: 'Rapid convergence of AI and biotechnology may disrupt existing patent portfolios',
      mitigation: ['Portfolio diversification', 'Cross-licensing agreements', 'R&D acceleration'],
      trends: [45, 52, 61, 69, 78, 82, 78]
    },
    {
      id: '2',
      category: 'Regulatory Changes',
      riskScore: 65,
      likelihood: 72,
      impact: 88,
      description: 'Evolving patent law and international agreements affecting filing strategies',
      mitigation: ['Legal monitoring', 'Multi-jurisdiction filing', 'Policy engagement'],
      trends: [58, 62, 59, 67, 71, 68, 65]
    },
    {
      id: '3',
      category: 'Competitive Acceleration',
      riskScore: 72,
      likelihood: 89,
      impact: 81,
      description: 'Increased R&D spending by competitors accelerating innovation cycles',
      mitigation: ['Patent monitoring', 'Speed to market', 'Strategic partnerships'],
      trends: [42, 48, 55, 63, 68, 74, 72]
    }
  ];

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  // Removed unused color helper functions

  return (
    <div className="space-y-6">
      <PageHeader
        title="Predictive Analytics"
        subtitle="ML-powered patent trend forecasting and market opportunity analysis"
        breadcrumb={['Analytics', 'Predictive']}
      />

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Forecast Period:</span>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="6M">6 Months</option>
                <option value="1Y">1 Year</option>
                <option value="2Y">2 Years</option>
                <option value="5Y">5 Years</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'trends', label: 'Filing Trends', icon: TrendingUp },
              { id: 'opportunities', label: 'Market Opportunities', icon: Target },
              { id: 'risks', label: 'Risk Assessment', icon: AlertTriangle },
              { id: 'insights', label: 'AI Insights', icon: Brain }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Trend Predictions Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendPredictions.map((prediction) => (
                  <HarmonizedCard
                    key={prediction.id}
                    title={prediction.technology}
                    description={`Predicted ${prediction.growthRate}% growth in patent filings over the next ${prediction.timeframe}`}
                    stats={[
                      {
                        label: 'Current Filings',
                        value: prediction.currentFilings.toLocaleString(),
                        icon: BarChart3,
                        color: 'text-blue-600'
                      },
                      {
                        label: 'Predicted Filings',
                        value: prediction.predictedFilings.toLocaleString(),
                        icon: TrendingUp,
                        color: 'text-green-600'
                      },
                      {
                        label: 'Confidence',
                        value: `${prediction.confidence}%`,
                        icon: Activity,
                        color: 'text-purple-600'
                      }
                    ]}
                    keywords={[
                      { label: `+${prediction.growthRate}%`, color: 'green' },
                      { label: `${prediction.confidence}% confidence`, color: 'blue' },
                      { label: `Risk: ${prediction.riskLevel}`, color: prediction.riskLevel === 'low' ? 'green' : prediction.riskLevel === 'medium' ? 'yellow' : 'red' }
                    ]}
                    attributes={[
                      { label: 'Key Factors', value: prediction.keyFactors.join(', '), icon: Zap }
                    ]}
                    actions={[
                      {
                        id: 'view-details',
                        label: 'View Details',
                        icon: Info,
                        onClick: () => console.log('View details', prediction.id),
                        isPrimary: true,
                        variant: 'primary'
                      }
                    ]}
                  />
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-600" />
                  Trend Analysis Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">64.2%</div>
                    <div className="text-sm text-gray-600">Average Growth Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">82.6%</div>
                    <div className="text-sm text-gray-600">Average Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-sm text-gray-600">Technologies Tracked</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Opportunities Tab */}
          {activeTab === 'opportunities' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {marketOpportunities.map((opportunity) => (
                  <HarmonizedCard
                    key={opportunity.id}
                    title={opportunity.sector}
                    description={opportunity.description}
                    stats={[
                      {
                        label: 'Opportunity Score',
                        value: opportunity.opportunityScore,
                        icon: Target,
                        color: 'text-green-600'
                      },
                      {
                        label: 'Patent Gaps',
                        value: opportunity.patentGaps,
                        icon: Activity,
                        color: 'text-blue-600'
                      },
                      {
                        label: 'Investment Potential',
                        value: `${opportunity.investmentPotential}%`,
                        icon: TrendingUp,
                        color: 'text-purple-600'
                      }
                    ]}
                    keywords={[
                      { label: `Score: ${opportunity.opportunityScore}`, color: 'green' },
                      { label: `Competition: ${opportunity.competitionLevel}`, color: opportunity.competitionLevel === 'low' ? 'green' : opportunity.competitionLevel === 'medium' ? 'yellow' : 'red' },
                      { label: `${opportunity.timeToMarket}mo to market`, color: 'blue' }
                    ]}
                    attributes={[
                      { label: 'Time to Market', value: `${opportunity.timeToMarket} months`, icon: Calendar }
                    ]}
                    actions={[
                      {
                        id: 'analyze',
                        label: 'Deep Analysis',
                        icon: Brain,
                        onClick: () => console.log('Analyze', opportunity.id),
                        isPrimary: true,
                        variant: 'primary'
                      }
                    ]}
                  />
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Top Opportunity Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Immediate Action</h4>
                    <p className="text-sm text-gray-600 mb-3">Focus on Autonomous Vehicles sensor fusion patents</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">High Priority</span>
                      <span className="text-gray-500">127 gaps identified</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Strategic Investment</h4>
                    <p className="text-sm text-gray-600 mb-3">Long-term positioning in Carbon Capture technology</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Strategic</span>
                      <span className="text-gray-500">96% investment potential</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Risk Assessment Tab */}
          {activeTab === 'risks' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {riskAssessments.map((risk) => (
                  <HarmonizedCard
                    key={risk.id}
                    title={risk.category}
                    description={risk.description}
                    stats={[
                      {
                        label: 'Risk Score',
                        value: risk.riskScore,
                        icon: AlertTriangle,
                        color: 'text-red-600'
                      },
                      {
                        label: 'Likelihood',
                        value: `${risk.likelihood}%`,
                        icon: Activity,
                        color: 'text-orange-600'
                      },
                      {
                        label: 'Impact',
                        value: `${risk.impact}%`,
                        icon: TrendingUp,
                        color: 'text-purple-600'
                      }
                    ]}
                    keywords={[
                      { 
                        label: risk.riskScore >= 75 ? 'High Risk' : risk.riskScore >= 50 ? 'Medium Risk' : 'Low Risk', 
                        color: risk.riskScore >= 75 ? 'red' : risk.riskScore >= 50 ? 'yellow' : 'green' 
                      }
                    ]}
                    attributes={[
                      { label: 'Mitigation Strategies', value: `${risk.mitigation.length} identified`, icon: Shield }
                    ]}
                    actions={[
                      {
                        id: 'mitigate',
                        label: 'View Mitigation',
                        icon: Shield,
                        onClick: () => console.log('View mitigation', risk.id),
                        isPrimary: true,
                        variant: 'primary'
                      }
                    ]}
                  />
                ))}
              </div>

              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h3 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Risk Mitigation Priorities
                </h3>
                <div className="space-y-3">
                  {riskAssessments
                    .sort((a, b) => b.riskScore - a.riskScore)
                    .slice(0, 3)
                    .map((risk, index) => (
                      <div key={risk.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{risk.category}</div>
                            <div className="text-sm text-gray-600">Risk Score: {risk.riskScore}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{risk.mitigation.length} strategies</span>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Review →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    ML Model Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Trend Prediction Accuracy</span>
                      <span className="font-semibold text-purple-600">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Market Opportunity Precision</span>
                      <span className="font-semibold text-blue-600">87.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk Assessment Recall</span>
                      <span className="font-semibold text-green-600">91.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Model Confidence</span>
                      <span className="font-semibold text-orange-600">88.4%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Key AI Insights
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Quantum computing patents show 73% correlation with government funding announcements</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Cross-sector collaboration increasing in biotech by 45% year-over-year</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Patent quality scores inversely related to filing volume in saturated markets</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Geographic clusters showing 2.3x higher innovation velocity than distributed teams</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  Prediction Algorithm Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Neural Networks</h4>
                    <p className="text-sm text-gray-600">Deep learning models for pattern recognition in patent data</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Time Series Analysis</h4>
                    <p className="text-sm text-gray-600">LSTM networks for trend forecasting and seasonality detection</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Ensemble Methods</h4>
                    <p className="text-sm text-gray-600">Random forests and gradient boosting for robust predictions</p>
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

export default PredictiveAnalytics;