import React, { useState } from 'react';
import { 
  Radar, 
  Zap, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock3,
  Flame,
  Filter,
  Download,
  RefreshCw,
  Play,
  Pause,
  Eye,
  Target,
  BarChart3,
  Lightbulb,
  Rocket,
  Shield
} from 'lucide-react';
import PageHeader from './PageHeader';
import HarmonizedCard from './HarmonizedCard';

interface Technology {
  id: string;
  name: string;
  category: 'emerging' | 'accelerating' | 'mature' | 'declining';
  maturityLevel: number; // 0-100
  velocityScore: number; // 0-100
  disruptionPotential: number; // 0-100
  investmentTrend: number; // percentage growth
  marketReadiness: number; // 0-100
  patentActivity: number;
  keyPlayers: string[];
  applications: string[];
  timeToImpact: number; // years
  riskFactors: string[];
  opportunities: string[];
  quadrant: 'leaders' | 'visionaries' | 'challengers' | 'niche';
  positionX: number; // -100 to 100
  positionY: number; // -100 to 100
  trend: 'up' | 'stable' | 'down';
  confidenceLevel: number;
}

// interface _RadarQuadrant { // Unused - for future quadrant grouping feature
//   name: string;
//   color: string;
//   description: string;
//   technologies: Technology[];
// }

const TechnologyRadar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const [_showDetails, _setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock technology data
  const technologies: Technology[] = [
    {
      id: '1',
      name: 'Quantum Computing',
      category: 'emerging',
      maturityLevel: 25,
      velocityScore: 95,
      disruptionPotential: 98,
      investmentTrend: 87.3,
      marketReadiness: 15,
      patentActivity: 2847,
      keyPlayers: ['IBM', 'Google', 'IonQ', 'Rigetti'],
      applications: ['Cryptography', 'Drug Discovery', 'Optimization', 'AI'],
      timeToImpact: 8,
      riskFactors: ['Technical complexity', 'Scalability challenges', 'Error rates'],
      opportunities: ['Breakthrough computing power', 'New algorithms', 'Security applications'],
      quadrant: 'visionaries',
      positionX: -60,
      positionY: 80,
      trend: 'up',
      confidenceLevel: 78
    },
    {
      id: '2',
      name: 'Generative AI',
      category: 'accelerating',
      maturityLevel: 65,
      velocityScore: 98,
      disruptionPotential: 95,
      investmentTrend: 156.7,
      marketReadiness: 78,
      patentActivity: 5643,
      keyPlayers: ['OpenAI', 'Google', 'Microsoft', 'Anthropic'],
      applications: ['Content Creation', 'Code Generation', 'Design', 'Research'],
      timeToImpact: 2,
      riskFactors: ['Regulatory concerns', 'Bias issues', 'Job displacement'],
      opportunities: ['Productivity gains', 'Creative enhancement', 'Automation'],
      quadrant: 'leaders',
      positionX: 75,
      positionY: 85,
      trend: 'up',
      confidenceLevel: 92
    },
    {
      id: '3',
      name: 'Autonomous Vehicles',
      category: 'accelerating',
      maturityLevel: 72,
      velocityScore: 68,
      disruptionPotential: 89,
      investmentTrend: 34.2,
      marketReadiness: 68,
      patentActivity: 8934,
      keyPlayers: ['Tesla', 'Waymo', 'Cruise', 'Baidu'],
      applications: ['Transportation', 'Delivery', 'Mining', 'Agriculture'],
      timeToImpact: 5,
      riskFactors: ['Regulatory approval', 'Safety concerns', 'Infrastructure needs'],
      opportunities: ['Reduced accidents', 'Efficiency gains', 'New mobility services'],
      quadrant: 'leaders',
      positionX: 65,
      positionY: 45,
      trend: 'stable',
      confidenceLevel: 85
    },
    {
      id: '4',
      name: 'Brain-Computer Interfaces',
      category: 'emerging',
      maturityLevel: 18,
      velocityScore: 76,
      disruptionPotential: 94,
      investmentTrend: 98.4,
      marketReadiness: 12,
      patentActivity: 1234,
      keyPlayers: ['Neuralink', 'Kernel', 'Paradromics', 'Synchron'],
      applications: ['Medical Treatment', 'Prosthetics', 'Communication', 'Enhancement'],
      timeToImpact: 12,
      riskFactors: ['Safety concerns', 'Ethical issues', 'Technical barriers'],
      opportunities: ['Medical breakthroughs', 'Human augmentation', 'New interfaces'],
      quadrant: 'visionaries',
      positionX: -70,
      positionY: 70,
      trend: 'up',
      confidenceLevel: 65
    },
    {
      id: '5',
      name: 'Synthetic Biology',
      category: 'emerging',
      maturityLevel: 38,
      velocityScore: 84,
      disruptionPotential: 91,
      investmentTrend: 67.8,
      marketReadiness: 35,
      patentActivity: 3456,
      keyPlayers: ['Ginkgo Bioworks', 'Synthetic Genomics', 'Twist Bioscience'],
      applications: ['Pharmaceuticals', 'Agriculture', 'Materials', 'Energy'],
      timeToImpact: 6,
      riskFactors: ['Regulatory complexity', 'Biosafety', 'Public acceptance'],
      opportunities: ['Sustainable manufacturing', 'Novel materials', 'Personalized medicine'],
      quadrant: 'visionaries',
      positionX: -45,
      positionY: 55,
      trend: 'up',
      confidenceLevel: 73
    },
    {
      id: '6',
      name: 'Advanced Robotics',
      category: 'accelerating',
      maturityLevel: 68,
      velocityScore: 72,
      disruptionPotential: 83,
      investmentTrend: 45.3,
      marketReadiness: 75,
      patentActivity: 6789,
      keyPlayers: ['Boston Dynamics', 'ABB', 'KUKA', 'Universal Robots'],
      applications: ['Manufacturing', 'Healthcare', 'Logistics', 'Service'],
      timeToImpact: 3,
      riskFactors: ['Cost barriers', 'Job displacement', 'Technical complexity'],
      opportunities: ['Productivity gains', 'Dangerous task automation', 'Aging population support'],
      quadrant: 'leaders',
      positionX: 45,
      positionY: 35,
      trend: 'up',
      confidenceLevel: 88
    },
    {
      id: '7',
      name: 'Extended Reality (XR)',
      category: 'accelerating',
      maturityLevel: 55,
      velocityScore: 64,
      disruptionPotential: 78,
      investmentTrend: 28.7,
      marketReadiness: 58,
      patentActivity: 4321,
      keyPlayers: ['Meta', 'Apple', 'Microsoft', 'Magic Leap'],
      applications: ['Gaming', 'Training', 'Healthcare', 'Design'],
      timeToImpact: 4,
      riskFactors: ['Hardware limitations', 'User adoption', 'Health concerns'],
      opportunities: ['Immersive experiences', 'Remote collaboration', 'New interfaces'],
      quadrant: 'challengers',
      positionX: 25,
      positionY: -30,
      trend: 'stable',
      confidenceLevel: 76
    },
    {
      id: '8',
      name: 'Blockchain',
      category: 'mature',
      maturityLevel: 78,
      velocityScore: 32,
      disruptionPotential: 65,
      investmentTrend: -12.4,
      marketReadiness: 82,
      patentActivity: 5678,
      keyPlayers: ['Ethereum', 'Binance', 'Coinbase', 'Chainlink'],
      applications: ['Finance', 'Supply Chain', 'Identity', 'Gaming'],
      timeToImpact: 1,
      riskFactors: ['Regulatory uncertainty', 'Energy consumption', 'Scalability'],
      opportunities: ['Decentralization', 'Transparency', 'New business models'],
      quadrant: 'challengers',
      positionX: -25,
      positionY: -45,
      trend: 'down',
      confidenceLevel: 69
    }
  ];

  /* const _quadrants: RadarQuadrant[] = [
    {
      name: 'Leaders',
      color: 'bg-green-500',
      description: 'High maturity and high market readiness',
      technologies: technologies.filter(t => t.quadrant === 'leaders')
    },
    {
      name: 'Visionaries',
      color: 'bg-blue-500',
      description: 'High potential but early stage',
      technologies: technologies.filter(t => t.quadrant === 'visionaries')
    },
    {
      name: 'Challengers',
      color: 'bg-yellow-500',
      description: 'Established but facing challenges',
      technologies: technologies.filter(t => t.quadrant === 'challengers')
    },
    {
      name: 'Niche Players',
      color: 'bg-gray-500',
      description: 'Specialized applications or declining',
      technologies: technologies.filter(t => t.quadrant === 'niche')
    }
  ]; */

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emerging': return 'text-blue-600';
      case 'accelerating': return 'text-green-600';
      case 'mature': return 'text-yellow-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'stable': return <Clock3 className="w-4 h-4 text-yellow-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      default: return <Clock3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredTechnologies = technologies.filter(tech => {
    const categoryMatch = selectedCategory === 'all' || tech.category === selectedCategory;
    const quadrantMatch = selectedQuadrant === 'all' || tech.quadrant === selectedQuadrant;
    return categoryMatch && quadrantMatch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technology Radar"
        subtitle="Track emerging technologies, assess maturity levels, and identify disruption potential"
        breadcrumb={['Analytics', 'Technology Radar']}
      />

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Radar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="emerging">Emerging</option>
                <option value="accelerating">Accelerating</option>
                <option value="mature">Mature</option>
                <option value="declining">Declining</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Quadrant:</span>
              <select
                value={selectedQuadrant}
                onChange={(e) => setSelectedQuadrant(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">All Quadrants</option>
                <option value="leaders">Leaders</option>
                <option value="visionaries">Visionaries</option>
                <option value="challengers">Challengers</option>
                <option value="niche">Niche Players</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isAnimating 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAnimating ? 'Pause' : 'Animate'}
            </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Radar className="w-5 h-5 text-blue-600" />
                Technology Radar Chart
              </h3>
            </div>
            
            {/* Radar Visualization */}
            <div className="p-6">
              <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-full">
                {/* Radar Grid */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  {/* Grid circles */}
                  <g stroke="#e5e7eb" strokeWidth="1" fill="none">
                    <circle cx="200" cy="200" r="50" opacity="0.5" />
                    <circle cx="200" cy="200" r="100" opacity="0.5" />
                    <circle cx="200" cy="200" r="150" opacity="0.5" />
                    <circle cx="200" cy="200" r="200" />
                  </g>
                  
                  {/* Grid lines */}
                  <g stroke="#e5e7eb" strokeWidth="1">
                    <line x1="200" y1="0" x2="200" y2="400" opacity="0.5" />
                    <line x1="0" y1="200" x2="400" y2="200" opacity="0.5" />
                  </g>
                  
                  {/* Quadrant backgrounds */}
                  <g opacity="0.1">
                    <path d="M 200 200 L 200 0 A 200 200 0 0 1 400 200 Z" fill="#10b981" />
                    <path d="M 200 200 L 400 200 A 200 200 0 0 1 200 400 Z" fill="#f59e0b" />
                    <path d="M 200 200 L 200 400 A 200 200 0 0 1 0 200 Z" fill="#6b7280" />
                    <path d="M 200 200 L 0 200 A 200 200 0 0 1 200 0 Z" fill="#3b82f6" />
                  </g>
                </svg>
                
                {/* Quadrant Labels */}
                <div className="absolute top-4 right-4 text-xs font-semibold text-green-700 bg-white px-2 py-1 rounded">
                  Leaders
                </div>
                <div className="absolute bottom-4 right-4 text-xs font-semibold text-yellow-700 bg-white px-2 py-1 rounded">
                  Challengers
                </div>
                <div className="absolute bottom-4 left-4 text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded">
                  Niche
                </div>
                <div className="absolute top-4 left-4 text-xs font-semibold text-blue-700 bg-white px-2 py-1 rounded">
                  Visionaries
                </div>
                
                {/* Technology Points */}
                {filteredTechnologies.map((tech) => {
                  const x = 200 + (tech.positionX * 1.5);
                  const y = 200 - (tech.positionY * 1.5);
                  const size = Math.max(8, tech.disruptionPotential / 8);
                  
                  return (
                    <div
                      key={tech.id}
                      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform ${
                        isAnimating ? 'animate-pulse' : ''
                      }`}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        width: `${size}px`,
                        height: `${size}px`
                      }}
                      onClick={() => setSelectedTechnology(tech)}
                      title={tech.name}
                    >
                      <div
                        className={`w-full h-full rounded-full border-2 border-white shadow-lg ${
                          tech.category === 'emerging' ? 'bg-blue-500' :
                          tech.category === 'accelerating' ? 'bg-green-500' :
                          tech.category === 'mature' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                        {tech.name}
                      </div>
                    </div>
                  );
                })}
                
                {/* Center point */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 rounded-full" />
              </div>
              
              {/* Legend */}
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Emerging</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Accelerating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Mature</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Declining</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Selected Technology Details */}
          {selectedTechnology && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                {selectedTechnology.name}
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className={`font-medium ${getCategoryColor(selectedTechnology.category)}`}>
                    {selectedTechnology.category.charAt(0).toUpperCase() + selectedTechnology.category.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Maturity Level</span>
                  <span className="font-medium text-gray-900">{selectedTechnology.maturityLevel}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Disruption Potential</span>
                  <span className="font-medium text-red-600">{selectedTechnology.disruptionPotential}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Investment Trend</span>
                  <span className={`font-medium ${selectedTechnology.investmentTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedTechnology.investmentTrend > 0 ? '+' : ''}{selectedTechnology.investmentTrend}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time to Impact</span>
                  <span className="font-medium text-gray-900">{selectedTechnology.timeToImpact} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trend</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(selectedTechnology.trend)}
                    <span className="font-medium text-gray-900 capitalize">{selectedTechnology.trend}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Key Players</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedTechnology.keyPlayers.map((player) => (
                      <span
                        key={player}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {player}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Applications</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedTechnology.applications.map((app) => (
                      <span
                        key={app}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Risk Factors</div>
                  <div className="space-y-1">
                    {selectedTechnology.riskFactors.slice(0, 3).map((risk) => (
                      <div key={risk} className="flex items-center gap-2 text-xs text-gray-600">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedTechnology(null)}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close Details
              </button>
            </div>
          )}

          {/* Radar Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              Radar Insights
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">Generative AI shows highest velocity with 98% acceleration score</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">Quantum Computing has 98% disruption potential but 8+ years to impact</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">Brain-Computer Interfaces emerging as next breakthrough technology</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">Investment trends favor AI and biotech over traditional blockchain</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Key Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {technologies.filter(t => t.category === 'emerging').length}
                </div>
                <div className="text-xs text-gray-600">Emerging Tech</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {Math.round(technologies.reduce((sum, t) => sum + t.velocityScore, 0) / technologies.length)}
                </div>
                <div className="text-xs text-gray-600">Avg Velocity</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {Math.round(technologies.reduce((sum, t) => sum + t.disruptionPotential, 0) / technologies.length)}
                </div>
                <div className="text-xs text-gray-600">Avg Disruption</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {Math.round(technologies.reduce((sum, t) => sum + t.investmentTrend, 0) / technologies.length)}%
                </div>
                <div className="text-xs text-gray-600">Investment Growth</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Cards View */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-blue-600" />
          Technology Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnologies.map((tech) => (
            <HarmonizedCard
              key={tech.id}
              title={tech.name}
              description={`${tech.category.charAt(0).toUpperCase() + tech.category.slice(1)} technology with ${tech.disruptionPotential}% disruption potential and ${tech.timeToImpact} years to major impact.`}
              stats={[
                {
                  label: 'Maturity Level',
                  value: `${tech.maturityLevel}%`,
                  icon: BarChart3,
                  color: 'text-blue-600'
                },
                {
                  label: 'Velocity Score',
                  value: tech.velocityScore,
                  icon: Zap,
                  color: 'text-green-600'
                },
                {
                  label: 'Disruption Potential',
                  value: `${tech.disruptionPotential}%`,
                  icon: Flame,
                  color: 'text-red-600'
                }
              ]}
              keywords={[
                { 
                  label: tech.category.charAt(0).toUpperCase() + tech.category.slice(1), 
                  color: tech.category === 'emerging' ? 'blue' : tech.category === 'accelerating' ? 'green' : tech.category === 'mature' ? 'yellow' : 'red' 
                },
                { 
                  label: `${tech.investmentTrend > 0 ? '+' : ''}${tech.investmentTrend}% investment`, 
                  color: tech.investmentTrend > 0 ? 'green' : 'red' 
                },
                { label: `${tech.timeToImpact}y to impact`, color: 'gray' }
              ]}
              attributes={[
                { label: 'Market Readiness', value: `${tech.marketReadiness}%`, icon: Target },
                { label: 'Patent Activity', value: tech.patentActivity.toLocaleString(), icon: Shield },
                { label: 'Confidence', value: `${tech.confidenceLevel}%`, icon: CheckCircle }
              ]}
              actions={[
                {
                  id: 'view-details',
                  label: 'View Details',
                  icon: Eye,
                  onClick: () => setSelectedTechnology(tech),
                  isPrimary: true,
                  variant: 'primary'
                }
              ]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologyRadar;