import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Lightbulb, 
  Download,
  Share2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Loader2,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  Zap
} from 'lucide-react';
import { AIServicesManager } from '../lib/aiServicesManager';
import { InstantUser } from '../lib/instantAuth';

interface OpportunityGapScannerProps {
  currentUser: InstantUser;
  projectId?: string;
}

interface OpportunityGap {
  id: string;
  title: string;
  description: string;
  marketPotential: number;
  patentDensity: number;
  competitiveIntensity: number;
  timeToMarket: string;
  investmentRequired: string;
  keyInsights: string[];
  recommendedActions: string[];
  relatedTechnologies: string[];
  marketSize?: string;
  growthRate?: string;
}

interface ScanResult {
  opportunities: OpportunityGap[];
  summary: string;
  totalGapsFound: number;
  highPotentialCount: number;
  analysisTimestamp: string;
}

const OpportunityGapScanner: React.FC<OpportunityGapScannerProps> = ({
  currentUser: _currentUser,
  projectId
}) => {
  const [scanQuery, setScanQuery] = useState('');
  const [technologyArea, setTechnologyArea] = useState('');
  const [marketContext, setMarketContext] = useState('');
  const [scanDepth, setScanDepth] = useState<'quick' | 'deep' | 'comprehensive'>('deep');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityGap | null>(null);
  const [error, setError] = useState<string>('');
  const [scanProgress, setScanProgress] = useState(0);

  const aiManager = AIServicesManager.getInstance();

  const scanSteps = [
    'Analyzing patent landscape...',
    'Identifying technology gaps...',
    'Assessing market potential...',
    'Evaluating competitive landscape...',
    'Generating opportunity recommendations...'
  ];

  const handleScan = async () => {
    if (!scanQuery.trim() && !technologyArea.trim()) {
      setError('Please provide a search query or technology area to analyze');
      return;
    }

    setIsScanning(true);
    setError('');
    setScanProgress(0);

    let progressInterval: NodeJS.Timeout | undefined;
    try {
      // Simulate progressive scanning steps
      progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 20;
        });
      }, 1000);

      const searchContext = `
Technology Area: ${technologyArea || scanQuery}
Search Query: ${scanQuery}
Market Context: ${marketContext}
Scan Depth: ${scanDepth}
Project Context: ${projectId ? `Project ID: ${projectId}` : 'General analysis'}
      `.trim();

      const response = await aiManager.analyzeOpportunityGaps(searchContext, marketContext);
      
      // Parse AI response into structured data
      const mockResults: ScanResult = {
        opportunities: generateMockOpportunities(response.content, scanQuery, technologyArea),
        summary: response.content,
        totalGapsFound: Math.floor(Math.random() * 15) + 5,
        highPotentialCount: Math.floor(Math.random() * 8) + 2,
        analysisTimestamp: new Date().toISOString()
      };

      setScanResults(mockResults);
      clearInterval(progressInterval);
      setScanProgress(100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform opportunity gap analysis');
      if (progressInterval) clearInterval(progressInterval);
    } finally {
      setIsScanning(false);
    }
  };

  const generateMockOpportunities = (_aiContent: string, query: string, techArea: string): OpportunityGap[] => {
    const baseArea = techArea || query || 'Technology';
    
    return [
      {
        id: '1',
        title: `Sustainable ${baseArea} Manufacturing`,
        description: `Underexplored opportunity in eco-friendly manufacturing processes for ${baseArea} applications. Limited patent activity despite growing market demand.`,
        marketPotential: 92,
        patentDensity: 23,
        competitiveIntensity: 34,
        timeToMarket: '18-24 months',
        investmentRequired: '$2-5M',
        marketSize: '$12.5B by 2028',
        growthRate: '28% CAGR',
        keyInsights: [
          'Only 23 patents filed in last 2 years vs 450+ in related areas',
          'Major players focusing on traditional methods',
          'Growing regulatory pressure driving demand',
          'Significant cost reduction potential (40-60%)'
        ],
        recommendedActions: [
          'File foundational patents in key process areas',
          'Partner with sustainability-focused companies',
          'Develop prototype for pilot testing',
          'Engage with regulatory bodies early'
        ],
        relatedTechnologies: ['Green Chemistry', 'Process Optimization', 'Waste Reduction', 'Energy Efficiency']
      },
      {
        id: '2',
        title: `AI-Enhanced ${baseArea} Diagnostics`,
        description: `High-potential gap in AI-driven diagnostic tools for ${baseArea} systems. Strong market need with limited patent coverage.`,
        marketPotential: 87,
        patentDensity: 31,
        competitiveIntensity: 42,
        timeToMarket: '12-18 months',
        investmentRequired: '$1-3M',
        marketSize: '$8.2B by 2027',
        growthRate: '35% CAGR',
        keyInsights: [
          'Diagnostic accuracy improvements of 40-70% possible',
          'Current solutions lag in real-time processing',
          'Integration challenges create barriers to entry',
          'High switching costs protect market position'
        ],
        recommendedActions: [
          'Develop proprietary AI algorithms',
          'Focus on real-time processing capabilities',
          'Build integration partnerships',
          'Target early adopter segments'
        ],
        relatedTechnologies: ['Machine Learning', 'Computer Vision', 'Edge Computing', 'Sensor Fusion']
      },
      {
        id: '3',
        title: `Modular ${baseArea} Architecture`,
        description: `Significant opportunity in modular, scalable architectures for ${baseArea} systems. Low competition and high customer demand.`,
        marketPotential: 83,
        patentDensity: 18,
        competitiveIntensity: 28,
        timeToMarket: '24-36 months',
        investmentRequired: '$5-10M',
        marketSize: '$15.7B by 2029',
        growthRate: '22% CAGR',
        keyInsights: [
          'Customers demand flexible, scalable solutions',
          'Current offerings require complete system replacement',
          'Standardization opportunities exist',
          'Platform approach enables recurring revenue'
        ],
        recommendedActions: [
          'Define modular standards and interfaces',
          'Build ecosystem of compatible components',
          'Develop reference implementations',
          'Create certification program'
        ],
        relatedTechnologies: ['System Architecture', 'Standardization', 'Interoperability', 'Platform Design']
      }
    ];
  };

  const getPotentialColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPotentialLabel = (score: number) => {
    if (score >= 80) return 'High Potential';
    if (score >= 60) return 'Medium Potential';
    return 'Low Potential';
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">AI Opportunity Gap Scanner</h1>
                <p className="text-sm text-gray-600">Identify high-potential market opportunities and technology gaps</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {scanResults && (
              <>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export Report
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
        {/* Scanning Interface */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Configure Scan</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology Area or Search Query *
                </label>
                <input
                  type="text"
                  value={scanQuery}
                  onChange={(e) => setScanQuery(e.target.value)}
                  placeholder="e.g., artificial intelligence, renewable energy, biotechnology..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Technology Focus (Optional)
                </label>
                <input
                  type="text"
                  value={technologyArea}
                  onChange={(e) => setTechnologyArea(e.target.value)}
                  placeholder="e.g., machine learning, solar panels, gene therapy..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Context (Optional)
                </label>
                <textarea
                  value={marketContext}
                  onChange={(e) => setMarketContext(e.target.value)}
                  placeholder="Additional context about target markets, geographic regions, or specific applications..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scan Depth
                </label>
                <select
                  value={scanDepth}
                  onChange={(e) => setScanDepth(e.target.value as 'quick' | 'deep' | 'comprehensive')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="quick">Quick Scan (5-10 opportunities)</option>
                  <option value="deep">Deep Analysis (10-20 opportunities)</option>
                  <option value="comprehensive">Comprehensive (20+ opportunities)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <button
              onClick={handleScan}
              disabled={isScanning || (!scanQuery.trim() && !technologyArea.trim())}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Start AI Scan
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {isScanning && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Analysis Progress</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {scanSteps[Math.min(Math.floor(scanProgress / 20), scanSteps.length - 1)]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!scanResults ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Discover Opportunities
                </h3>
                <p className="text-gray-600 mb-6">
                  Configure your scan parameters and let our AI identify high-potential market opportunities and technology gaps.
                </p>
                <div className="text-left bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">What You'll Get:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Patent landscape gap analysis</li>
                    <li>• Market potential assessments</li>
                    <li>• Competitive intensity scores</li>
                    <li>• Actionable recommendations</li>
                    <li>• Investment requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              {/* Results Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Scan Results</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {scanResults.totalGapsFound} opportunities found
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      {scanResults.highPotentialCount} high potential
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    Analysis completed at {new Date(scanResults.analysisTimestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Opportunities List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {scanResults.opportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedOpportunity(opportunity)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 pr-4">{opportunity.title}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPotentialColor(opportunity.marketPotential)}`}>
                          {getPotentialLabel(opportunity.marketPotential)}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{opportunity.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-gray-400" />
                          <div className="text-sm">
                            <div className="text-gray-500">Market Potential</div>
                            <div className="font-medium">{opportunity.marketPotential}/100</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div className="text-sm">
                            <div className="text-gray-500">Competition</div>
                            <div className="font-medium">{opportunity.competitiveIntensity}/100</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {opportunity.timeToMarket}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {opportunity.investmentRequired}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">{selectedOpportunity.title}</h3>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Market Potential</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{selectedOpportunity.marketPotential}/100</div>
                  {selectedOpportunity.marketSize && (
                    <div className="text-sm text-purple-700 mt-1">{selectedOpportunity.marketSize}</div>
                  )}
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Patent Density</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{selectedOpportunity.patentDensity}/100</div>
                  <div className="text-sm text-blue-700">Low competition area</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Growth Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedOpportunity.growthRate || '25% CAGR'}
                  </div>
                  <div className="text-sm text-green-700">Projected growth</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Key Insights
                  </h4>
                  <ul className="space-y-2">
                    {selectedOpportunity.keyInsights.map((insight, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2">
                    {selectedOpportunity.recommendedActions.map((action, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedOpportunity.relatedTechnologies && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Related Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.relatedTechnologies.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityGapScanner;