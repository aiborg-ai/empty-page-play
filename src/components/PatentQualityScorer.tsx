import React, { useState } from 'react';
import { 
  Shield, 
  Star, 
  TrendingUp, 
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
  Eye,
  FileText,
  Scale,
  Zap,
  Clock,
  DollarSign,
  Globe,
  Search
} from 'lucide-react';
import PageHeader from './PageHeader';
import HarmonizedCard from './HarmonizedCard';

interface Patent {
  id: string;
  title: string;
  patentNumber: string;
  filingDate: string;
  publicationDate: string;
  inventors: string[];
  assignee: string;
  jurisdiction: string;
  technologyArea: string;
  qualityScore: number; // 0-100
  citationImpact: number; // 0-100
  claimsBreadth: number; // 0-100
  priorArtDifferentiation: number; // 0-100
  legalRobustness: number; // 0-100
  commercialPotential: number; // 0-100
  forwardCitations: number;
  backwardCitations: number;
  familySize: number;
  claimsCount: number;
  figuresCount: number;
  pagesCount: number;
  maintenanceFees: number;
  litigationRisk: 'low' | 'medium' | 'high';
  invalidationRisk: 'low' | 'medium' | 'high';
  enforcementStrength: 'weak' | 'moderate' | 'strong';
  marketCoverage: string[];
  competitorImpact: number;
  licensingPotential: number;
  strategicValue: 'low' | 'medium' | 'high';
}

interface QualityMetric {
  name: string;
  weight: number;
  description: string;
  score: number;
  benchmark: number;
}

interface PortfolioAnalysis {
  totalPatents: number;
  averageQuality: number;
  topPerformers: Patent[];
  improvementCandidates: Patent[];
  riskPatents: Patent[];
  strengthDistribution: { [key: string]: number };
  technologyBreakdown: { [key: string]: number };
}

const PatentQualityScorer: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'individual' | 'portfolio' | 'comparison'>('individual');
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [_selectedMetric, _setSelectedMetric] = useState<string>('quality');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock patent data
  const patents: Patent[] = [
    {
      id: '1',
      title: 'Neural Network Architecture for Real-time Image Processing',
      patentNumber: 'US11234567',
      filingDate: '2022-03-15',
      publicationDate: '2023-09-15',
      inventors: ['Dr. Sarah Chen', 'Prof. Michael Johnson', 'Alex Rodriguez'],
      assignee: 'TechnoVision Corp.',
      jurisdiction: 'United States',
      technologyArea: 'Artificial Intelligence',
      qualityScore: 92,
      citationImpact: 89,
      claimsBreadth: 87,
      priorArtDifferentiation: 94,
      legalRobustness: 91,
      commercialPotential: 95,
      forwardCitations: 47,
      backwardCitations: 156,
      familySize: 8,
      claimsCount: 23,
      figuresCount: 12,
      pagesCount: 45,
      maintenanceFees: 85000,
      litigationRisk: 'low',
      invalidationRisk: 'low',
      enforcementStrength: 'strong',
      marketCoverage: ['US', 'EU', 'China', 'Japan'],
      competitorImpact: 88,
      licensingPotential: 92,
      strategicValue: 'high'
    },
    {
      id: '2',
      title: 'Quantum Encryption Key Distribution Method',
      patentNumber: 'US11345678',
      filingDate: '2021-11-08',
      publicationDate: '2023-05-08',
      inventors: ['Dr. quantum.expert@email.com', 'Jane Smith'],
      assignee: 'SecureQuanta Inc.',
      jurisdiction: 'United States',
      technologyArea: 'Quantum Computing',
      qualityScore: 88,
      citationImpact: 82,
      claimsBreadth: 90,
      priorArtDifferentiation: 89,
      legalRobustness: 86,
      commercialPotential: 78,
      forwardCitations: 23,
      backwardCitations: 89,
      familySize: 6,
      claimsCount: 18,
      figuresCount: 8,
      pagesCount: 38,
      maintenanceFees: 67000,
      litigationRisk: 'medium',
      invalidationRisk: 'low',
      enforcementStrength: 'strong',
      marketCoverage: ['US', 'EU', 'Canada'],
      competitorImpact: 75,
      licensingPotential: 84,
      strategicValue: 'high'
    },
    {
      id: '3',
      title: 'Biodegradable Polymer Composite for Packaging',
      patentNumber: 'EP3456789',
      filingDate: '2022-07-22',
      publicationDate: '2024-01-22',
      inventors: ['Dr. Maria Gonzalez', 'Robert Kim'],
      assignee: 'GreenPack Solutions',
      jurisdiction: 'European Union',
      technologyArea: 'Materials Science',
      qualityScore: 76,
      citationImpact: 65,
      claimsBreadth: 82,
      priorArtDifferentiation: 78,
      legalRobustness: 74,
      commercialPotential: 89,
      forwardCitations: 12,
      backwardCitations: 124,
      familySize: 4,
      claimsCount: 15,
      figuresCount: 6,
      pagesCount: 32,
      maintenanceFees: 42000,
      litigationRisk: 'low',
      invalidationRisk: 'medium',
      enforcementStrength: 'moderate',
      marketCoverage: ['EU', 'US'],
      competitorImpact: 72,
      licensingPotential: 81,
      strategicValue: 'medium'
    },
    {
      id: '4',
      title: 'Autonomous Vehicle Navigation System',
      patentNumber: 'CN567890',
      filingDate: '2022-01-10',
      publicationDate: '2023-07-10',
      inventors: ['Li Wei', 'Zhang Ming', 'Wang Fei'],
      assignee: 'AutoDrive Technologies',
      jurisdiction: 'China',
      technologyArea: 'Autonomous Systems',
      qualityScore: 84,
      citationImpact: 78,
      claimsBreadth: 85,
      priorArtDifferentiation: 81,
      legalRobustness: 88,
      commercialPotential: 93,
      forwardCitations: 34,
      backwardCitations: 167,
      familySize: 5,
      claimsCount: 21,
      figuresCount: 14,
      pagesCount: 52,
      maintenanceFees: 58000,
      litigationRisk: 'medium',
      invalidationRisk: 'low',
      enforcementStrength: 'strong',
      marketCoverage: ['China', 'US', 'EU'],
      competitorImpact: 85,
      licensingPotential: 87,
      strategicValue: 'high'
    },
    {
      id: '5',
      title: 'Solar Panel Efficiency Enhancement Method',
      patentNumber: 'JP2023567890',
      filingDate: '2023-02-28',
      publicationDate: '2024-08-28',
      inventors: ['Hiroshi Tanaka', 'Yuki Sato'],
      assignee: 'Solar Innovations KK',
      jurisdiction: 'Japan',
      technologyArea: 'Clean Energy',
      qualityScore: 71,
      citationImpact: 58,
      claimsBreadth: 76,
      priorArtDifferentiation: 73,
      legalRobustness: 69,
      commercialPotential: 85,
      forwardCitations: 8,
      backwardCitations: 98,
      familySize: 3,
      claimsCount: 12,
      figuresCount: 5,
      pagesCount: 28,
      maintenanceFees: 35000,
      litigationRisk: 'low',
      invalidationRisk: 'medium',
      enforcementStrength: 'moderate',
      marketCoverage: ['Japan', 'Korea'],
      competitorImpact: 64,
      licensingPotential: 73,
      strategicValue: 'medium'
    },
    {
      id: '6',
      title: 'Pharmaceutical Compound for Cancer Treatment',
      patentNumber: 'US11678901',
      filingDate: '2020-09-14',
      publicationDate: '2022-03-14',
      inventors: ['Dr. Emily Watson', 'Dr. David Lee', 'Dr. Karen Miller'],
      assignee: 'BioPharma Research Ltd.',
      jurisdiction: 'United States',
      technologyArea: 'Pharmaceuticals',
      qualityScore: 96,
      citationImpact: 97,
      claimsBreadth: 92,
      priorArtDifferentiation: 98,
      legalRobustness: 94,
      commercialPotential: 99,
      forwardCitations: 89,
      backwardCitations: 234,
      familySize: 12,
      claimsCount: 35,
      figuresCount: 18,
      pagesCount: 78,
      maintenanceFees: 125000,
      litigationRisk: 'high',
      invalidationRisk: 'low',
      enforcementStrength: 'strong',
      marketCoverage: ['US', 'EU', 'Canada', 'Australia', 'Japan'],
      competitorImpact: 96,
      licensingPotential: 98,
      strategicValue: 'high'
    }
  ];

  // Quality metrics configuration
  const qualityMetrics: QualityMetric[] = [
    {
      name: 'Citation Impact',
      weight: 0.25,
      description: 'How often this patent is cited by others',
      score: selectedPatent?.citationImpact || 0,
      benchmark: 75
    },
    {
      name: 'Claims Breadth',
      weight: 0.20,
      description: 'Scope and comprehensiveness of patent claims',
      score: selectedPatent?.claimsBreadth || 0,
      benchmark: 70
    },
    {
      name: 'Prior Art Differentiation',
      weight: 0.20,
      description: 'Novelty compared to existing technology',
      score: selectedPatent?.priorArtDifferentiation || 0,
      benchmark: 80
    },
    {
      name: 'Legal Robustness',
      weight: 0.20,
      description: 'Strength of legal protection and enforceability',
      score: selectedPatent?.legalRobustness || 0,
      benchmark: 78
    },
    {
      name: 'Commercial Potential',
      weight: 0.15,
      description: 'Market value and licensing opportunities',
      score: selectedPatent?.commercialPotential || 0,
      benchmark: 72
    }
  ];

  // Portfolio analysis
  const portfolioAnalysis: PortfolioAnalysis = {
    totalPatents: patents.length,
    averageQuality: Math.round(patents.reduce((sum, p) => sum + p.qualityScore, 0) / patents.length),
    topPerformers: patents.filter(p => p.qualityScore >= 90).slice(0, 3),
    improvementCandidates: patents.filter(p => p.qualityScore < 80).slice(0, 3),
    riskPatents: patents.filter(p => p.litigationRisk === 'high' || p.invalidationRisk === 'high'),
    strengthDistribution: {
      'Strong (90+)': patents.filter(p => p.qualityScore >= 90).length,
      'Good (80-89)': patents.filter(p => p.qualityScore >= 80 && p.qualityScore < 90).length,
      'Fair (70-79)': patents.filter(p => p.qualityScore >= 70 && p.qualityScore < 80).length,
      'Weak (<70)': patents.filter(p => p.qualityScore < 70).length
    },
    technologyBreakdown: patents.reduce((acc, p) => {
      acc[p.technologyArea] = (acc[p.technologyArea] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'strong': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'moderate': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'weak': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredPatents = patents.filter(patent => {
    const jurisdictionMatch = selectedJurisdiction === 'all' || patent.jurisdiction.toLowerCase().includes(selectedJurisdiction.toLowerCase());
    return jurisdictionMatch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patent Quality Scorer"
        subtitle="Comprehensive analysis of patent strength, enforceability, and commercial value"
        breadcrumb={['Analytics', 'Patent Quality']}
      />

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">View:</span>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="individual">Individual Analysis</option>
                <option value="portfolio">Portfolio Overview</option>
                <option value="comparison">Comparison View</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Jurisdiction:</span>
              <select
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">All Jurisdictions</option>
                <option value="us">United States</option>
                <option value="eu">European Union</option>
                <option value="china">China</option>
                <option value="japan">Japan</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Analyze
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Individual Analysis View */}
      {selectedView === 'individual' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patent List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Patent Analysis
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPatents.map((patent) => {
                    const qualityBadge = getQualityBadge(patent.qualityScore);
                    
                    return (
                      <HarmonizedCard
                        key={patent.id}
                        title={patent.title}
                        description={`${patent.patentNumber} • ${patent.assignee} • Filed: ${new Date(patent.filingDate).getFullYear()}`}
                        stats={[
                          {
                            label: 'Quality Score',
                            value: patent.qualityScore,
                            icon: Star,
                            color: getQualityColor(patent.qualityScore)
                          },
                          {
                            label: 'Citations',
                            value: patent.forwardCitations,
                            icon: TrendingUp,
                            color: 'text-blue-600'
                          },
                          {
                            label: 'Family Size',
                            value: patent.familySize,
                            icon: Globe,
                            color: 'text-purple-600'
                          }
                        ]}
                        keywords={[
                          { label: qualityBadge.label, color: qualityBadge.color.includes('green') ? 'green' : qualityBadge.color.includes('blue') ? 'blue' : qualityBadge.color.includes('yellow') ? 'yellow' : 'red' },
                          { label: patent.technologyArea, color: 'gray' },
                          { label: patent.jurisdiction.split(' ')[0], color: 'blue' }
                        ]}
                        attributes={[
                          { label: 'Commercial Potential', value: `${patent.commercialPotential}%`, icon: DollarSign },
                          { label: 'Legal Robustness', value: `${patent.legalRobustness}%`, icon: Scale },
                          { label: 'Strategic Value', value: patent.strategicValue, icon: Target }
                        ]}
                        actions={[
                          {
                            id: 'analyze',
                            label: 'Detailed Analysis',
                            icon: Eye,
                            onClick: () => setSelectedPatent(patent),
                            isPrimary: true,
                            variant: 'primary'
                          }
                        ]}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {selectedPatent && (
              <>
                {/* Selected Patent Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Quality Analysis
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getQualityColor(selectedPatent.qualityScore)} mb-2`}>
                        {selectedPatent.qualityScore}
                      </div>
                      <div className="text-sm text-gray-600">Overall Quality Score</div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getQualityBadge(selectedPatent.qualityScore).color}`}>
                        {getQualityBadge(selectedPatent.qualityScore).label}
                      </div>
                    </div>

                    {/* Quality Metrics Breakdown */}
                    <div className="space-y-3">
                      {qualityMetrics.map((metric) => (
                        <div key={metric.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                            <span className="text-sm text-gray-600">{metric.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                metric.score >= metric.benchmark ? 'bg-green-500' : 
                                metric.score >= metric.benchmark * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${metric.score}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{metric.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Risk Assessment
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Litigation Risk</span>
                      <span className={`font-medium ${getRiskColor(selectedPatent.litigationRisk)}`}>
                        {selectedPatent.litigationRisk.charAt(0).toUpperCase() + selectedPatent.litigationRisk.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Invalidation Risk</span>
                      <span className={`font-medium ${getRiskColor(selectedPatent.invalidationRisk)}`}>
                        {selectedPatent.invalidationRisk.charAt(0).toUpperCase() + selectedPatent.invalidationRisk.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Enforcement Strength</span>
                      <div className="flex items-center gap-2">
                        {getStrengthIcon(selectedPatent.enforcementStrength)}
                        <span className="font-medium text-gray-900 capitalize">
                          {selectedPatent.enforcementStrength}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commercial Metrics */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Commercial Value
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{selectedPatent.licensingPotential}%</div>
                      <div className="text-xs text-gray-600">Licensing Potential</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{selectedPatent.competitorImpact}</div>
                      <div className="text-xs text-gray-600">Competitor Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{selectedPatent.marketCoverage.length}</div>
                      <div className="text-xs text-gray-600">Markets Covered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">${(selectedPatent.maintenanceFees / 1000)}K</div>
                      <div className="text-xs text-gray-600">Annual Fees</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!selectedPatent && (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Select a Patent</h3>
                <p className="text-sm text-gray-600">Choose a patent from the list to see detailed quality analysis</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Portfolio Overview */}
      {selectedView === 'portfolio' && (
        <div className="space-y-6">
          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{portfolioAnalysis.totalPatents}</div>
                  <div className="text-sm text-gray-600">Total Patents</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${getQualityColor(portfolioAnalysis.averageQuality)}`}>
                    {portfolioAnalysis.averageQuality}
                  </div>
                  <div className="text-sm text-gray-600">Average Quality</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{portfolioAnalysis.topPerformers.length}</div>
                  <div className="text-sm text-gray-600">Top Performers</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{portfolioAnalysis.riskPatents.length}</div>
                  <div className="text-sm text-gray-600">High Risk Patents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Top Performing Patents
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {portfolioAnalysis.topPerformers.map((patent) => (
                <HarmonizedCard
                  key={patent.id}
                  title={patent.title}
                  description={`Quality Score: ${patent.qualityScore} • ${patent.technologyArea}`}
                  stats={[
                    {
                      label: 'Quality Score',
                      value: patent.qualityScore,
                      icon: Star,
                      color: 'text-green-600'
                    },
                    {
                      label: 'Commercial Value',
                      value: `${patent.commercialPotential}%`,
                      icon: DollarSign,
                      color: 'text-blue-600'
                    }
                  ]}
                  keywords={[
                    { label: 'Top Performer', color: 'green' },
                    { label: patent.strategicValue, color: 'blue' }
                  ]}
                  actions={[
                    {
                      id: 'view',
                      label: 'View Details',
                      icon: Eye,
                      onClick: () => setSelectedPatent(patent),
                      isPrimary: true,
                      variant: 'primary'
                    }
                  ]}
                />
              ))}
            </div>
          </div>

          {/* Portfolio Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Quality Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(portfolioAnalysis.strengthDistribution).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${(count / portfolioAnalysis.totalPatents) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Technology Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(portfolioAnalysis.technologyBreakdown).map(([tech, count]) => (
                  <div key={tech} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{tech}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-purple-500 rounded-full"
                          style={{ width: `${(count / portfolioAnalysis.totalPatents) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Improvement Recommendations */}
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Improvement Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Priority Actions</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Review {portfolioAnalysis.improvementCandidates.length} patents with quality scores below 80</li>
                  <li>• Strengthen claims breadth for better competitive protection</li>
                  <li>• Improve prior art differentiation in key technology areas</li>
                  <li>• Consider abandoning low-value patents to reduce maintenance costs</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Strategic Opportunities</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Increase patent filings in high-growth technology areas</li>
                  <li>• Expand market coverage for top-performing patents</li>
                  <li>• Explore licensing opportunities for high commercial value patents</li>
                  <li>• Monitor competitor patent activity in strategic areas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison View */}
      {selectedView === 'comparison' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Patent Quality Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Patent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Quality Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Citation Impact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Commercial Potential</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Legal Robustness</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Strategic Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatents.map((patent) => (
                  <tr key={patent.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{patent.title}</div>
                        <div className="text-xs text-gray-500">{patent.patentNumber}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`font-bold ${getQualityColor(patent.qualityScore)}`}>
                        {patent.qualityScore}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{patent.citationImpact}%</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{patent.commercialPotential}%</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{patent.legalRobustness}%</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        patent.strategicValue === 'high' ? 'bg-green-100 text-green-800' :
                        patent.strategicValue === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {patent.strategicValue}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedPatent(patent)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatentQualityScorer;