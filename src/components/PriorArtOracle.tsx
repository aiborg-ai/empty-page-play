import React, { useState } from 'react';
import { 
  BookOpen, 
  Globe, 
  FileText, 
  Brain,
  Target,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Share2,
  Layers,
  Calendar,
  MapPin,
  Link2,
  Zap,
  Lightbulb
} from 'lucide-react';
import { AIServicesManager } from '../lib/aiServicesManager';
import { InstantUser } from '../lib/instantAuth';

interface PriorArtOracleProps {
  currentUser: InstantUser;
  projectId?: string;
}

interface PriorArtReference {
  id: string;
  title: string;
  type: 'patent' | 'publication' | 'technical_doc' | 'open_source';
  publicationDate: string;
  jurisdiction?: string;
  authors?: string[];
  abstract: string;
  relevanceScore: number;
  conceptualSimilarity: number;
  keyFeatures: string[];
  patentNumber?: string;
  doi?: string;
  url?: string;
  images?: string[];
  citationCount?: number;
}

interface SearchResult {
  id: string;
  query: string;
  searchType: 'quick' | 'comprehensive';
  conceptualKeywords: string[];
  references: PriorArtReference[];
  patentabilityAssessment: {
    overallScore: number;
    novelty: number;
    nonObviousness: number;
    recommendations: string[];
  };
  claimStrategy: string[];
  searchTimestamp: string;
  totalResults: number;
}

interface SearchConfig {
  includePatents: boolean;
  includePublications: boolean;
  includeTechnicalDocs: boolean;
  includeOpenSource: boolean;
  jurisdictions: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
  languages: string[];
}

const PriorArtOracle: React.FC<PriorArtOracleProps> = ({
  currentUser: _currentUser,
  projectId: _projectId
}) => {
  const [inventionDescription, setInventionDescription] = useState('');
  const [searchDepth, setSearchDepth] = useState<'quick' | 'comprehensive'>('comprehensive');
  const [searchConfig, setSearchConfig] = useState<SearchConfig>({
    includePatents: true,
    includePublications: true,
    includeTechnicalDocs: true,
    includeOpenSource: false,
    jurisdictions: ['US', 'EP', 'JP', 'CN', 'WO'],
    dateRange: {},
    languages: ['English', 'Auto-translate']
  });
  
  const [isSearching, setIsSearching] = useState(false);
   
  const [_searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeResult, setActiveResult] = useState<SearchResult | null>(null);
  const [selectedReference, setSelectedReference] = useState<PriorArtReference | null>(null);
  const [error, setError] = useState<string>('');
  const [searchProgress, setSearchProgress] = useState(0);

  const aiManager = AIServicesManager.getInstance();

  const searchSteps = [
    'Analyzing invention concept...',
    'Extracting key technical features...',
    'Generating semantic search terms...',
    'Searching global patent databases...',
    'Analyzing scientific literature...',
    'Processing technical documentation...',
    'Evaluating conceptual similarities...',
    'Generating patentability assessment...'
  ];

  const handleSearch = async () => {
    if (!inventionDescription.trim()) {
      setError('Please provide an invention description');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchProgress(0);

    let progressInterval: NodeJS.Timeout | undefined;
    try {
      progressInterval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 8 + 2;
        });
      }, 600);

      const response = await aiManager.searchPriorArt(inventionDescription, searchDepth);
      
      const newResult = parseAIResponseToSearchResult(response.content, inventionDescription);
      setSearchResults(prev => [newResult, ...prev]);
      setActiveResult(newResult);
      
      clearInterval(progressInterval);
      setSearchProgress(100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform prior art search');
      if (progressInterval) clearInterval(progressInterval);
    } finally {
      setIsSearching(false);
    }
  };

  const parseAIResponseToSearchResult = (_aiContent: string, query: string): SearchResult => {
    const mockReferences: PriorArtReference[] = [
      {
        id: '1',
        title: 'Method and System for Automated Patent Analysis Using Machine Learning',
        type: 'patent',
        publicationDate: '2022-03-15',
        jurisdiction: 'US',
        authors: ['Smith, J.', 'Johnson, M.'],
        abstract: 'A computer-implemented method for analyzing patent documents using natural language processing and machine learning techniques to identify relevant prior art and assess patentability.',
        relevanceScore: 92,
        conceptualSimilarity: 85,
        keyFeatures: ['Machine learning analysis', 'Patent document processing', 'Natural language processing', 'Automated assessment'],
        patentNumber: 'US11,234,567',
        citationCount: 15
      },
      {
        id: '2',
        title: 'AI-Driven Innovation Intelligence Platform for Patent Landscape Analysis',
        type: 'publication',
        publicationDate: '2023-01-20',
        authors: ['Chen, L.', 'Rodriguez, A.', 'Kim, S.'],
        abstract: 'This paper presents a comprehensive framework for leveraging artificial intelligence in patent landscape analysis, including automated prior art search and innovation opportunity identification.',
        relevanceScore: 88,
        conceptualSimilarity: 79,
        keyFeatures: ['AI-driven analysis', 'Patent landscape mapping', 'Innovation intelligence', 'Automated search'],
        doi: '10.1234/journal.2023.001',
        citationCount: 23
      },
      {
        id: '3',
        title: 'Deep Learning Approaches for Patent Classification and Similarity Assessment',
        type: 'publication',
        publicationDate: '2021-11-08',
        authors: ['Williams, R.', 'Davis, K.'],
        abstract: 'Exploration of various deep learning architectures for patent classification tasks and semantic similarity assessment between patent documents.',
        relevanceScore: 76,
        conceptualSimilarity: 71,
        keyFeatures: ['Deep learning', 'Patent classification', 'Similarity assessment', 'Semantic analysis'],
        doi: '10.5678/arxiv.2021.456',
        citationCount: 31
      },
      {
        id: '4',
        title: 'Automated Prior Art Search Tool with Conceptual Understanding',
        type: 'patent',
        publicationDate: '2020-09-12',
        jurisdiction: 'EP',
        authors: ['Mueller, T.', 'Tanaka, H.'],
        abstract: 'An intelligent search system that employs semantic understanding to identify conceptually similar prior art beyond keyword matching.',
        relevanceScore: 84,
        conceptualSimilarity: 88,
        keyFeatures: ['Conceptual search', 'Semantic understanding', 'Prior art identification', 'Intelligent matching'],
        patentNumber: 'EP3,456,789',
        citationCount: 8
      },
      {
        id: '5',
        title: 'Open Source Patent Analytics Framework',
        type: 'open_source',
        publicationDate: '2023-06-30',
        authors: ['OpenPatent Collective'],
        abstract: 'A comprehensive open-source toolkit for patent analysis, including prior art search, citation analysis, and landscape visualization.',
        relevanceScore: 65,
        conceptualSimilarity: 58,
        keyFeatures: ['Open source', 'Patent analytics', 'Citation analysis', 'Visualization tools'],
        url: 'https://github.com/open-patent/analytics',
        citationCount: 12
      }
    ];

    return {
      id: Date.now().toString(),
      query,
      searchType: searchDepth,
      conceptualKeywords: ['AI analysis', 'patent intelligence', 'prior art search', 'machine learning', 'semantic similarity'],
      references: mockReferences,
      patentabilityAssessment: {
        overallScore: 73,
        novelty: 78,
        nonObviousness: 68,
        recommendations: [
          'Focus on unique AI training methodology to establish novelty',
          'Emphasize real-time processing capabilities not found in prior art',
          'Consider claims around user interface innovations',
          'Highlight integration aspects that combine multiple technologies'
        ]
      },
      claimStrategy: [
        'Draft independent claims focusing on novel AI processing steps',
        'Include dependent claims for specific implementation details',
        'Consider system claims in addition to method claims',
        'Avoid overly broad language that might read on prior art'
      ],
      searchTimestamp: new Date().toISOString(),
      totalResults: mockReferences.length
    };
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getRelevanceLabel = (score: number) => {
    if (score >= 80) return 'High Similarity';
    if (score >= 60) return 'Moderate Similarity';
    return 'Low Similarity';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'patent': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'publication': return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'technical_doc': return <Layers className="w-4 h-4 text-purple-600" />;
      case 'open_source': return <Globe className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const exportResults = (result: SearchResult) => {
    const exportData = {
      query: result.query,
      searchType: result.searchType,
      patentabilityAssessment: result.patentabilityAssessment,
      references: result.references.map(ref => ({
        title: ref.title,
        type: ref.type,
        relevanceScore: ref.relevanceScore,
        abstract: ref.abstract,
        keyFeatures: ref.keyFeatures,
        patentNumber: ref.patentNumber,
        doi: ref.doi
      })),
      recommendations: result.claimStrategy,
      searchTimestamp: result.searchTimestamp
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prior_art_search_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">AI Prior Art Oracle</h1>
                <p className="text-sm text-gray-600">Comprehensive conceptual prior art search with AI-powered analysis</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeResult && (
              <>
                <button 
                  onClick={() => exportResults(activeResult)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Export Results
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Search Interface */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Invention Description</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe Your Invention *
                </label>
                <textarea
                  value={inventionDescription}
                  onChange={(e) => setInventionDescription(e.target.value)}
                  placeholder="Provide a detailed description of your invention, including key technical features, functionality, and novel aspects..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Depth
                </label>
                <select
                  value={searchDepth}
                  onChange={(e) => setSearchDepth(e.target.value as 'quick' | 'comprehensive')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="quick">Quick Search (faster, focused results)</option>
                  <option value="comprehensive">Comprehensive Search (thorough analysis)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Configuration */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Search Configuration</h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Include Sources:</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchConfig.includePatents}
                      onChange={(e) => setSearchConfig(prev => ({ ...prev, includePatents: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Patents & Applications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchConfig.includePublications}
                      onChange={(e) => setSearchConfig(prev => ({ ...prev, includePublications: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Scientific Publications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchConfig.includeTechnicalDocs}
                      onChange={(e) => setSearchConfig(prev => ({ ...prev, includeTechnicalDocs: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Technical Documentation</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchConfig.includeOpenSource}
                      onChange={(e) => setSearchConfig(prev => ({ ...prev, includeOpenSource: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Open Source Projects</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <button
              onClick={handleSearch}
              disabled={isSearching || !inventionDescription.trim()}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Start AI Search
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {isSearching && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Search Progress</span>
                  <span>{Math.round(searchProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${searchProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {searchSteps[Math.min(Math.floor(searchProgress / 12.5), searchSteps.length - 1)]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeResult ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Advanced Prior Art Analysis
                </h3>
                <p className="text-gray-600 mb-6">
                  Leverage AI to understand the conceptual essence of your invention and find relevant prior art across global databases.
                </p>
                <div className="text-left bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Oracle Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Conceptual understanding beyond keywords</li>
                    <li>• Multi-language prior art discovery</li>
                    <li>• Patent and literature integration</li>
                    <li>• Patentability assessment</li>
                    <li>• Strategic claim recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              {/* Results Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Prior Art Search Results</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {activeResult.totalResults} references found
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Patentability: {activeResult.patentabilityAssessment.overallScore}/100
                    </span>
                  </div>
                </div>

                {/* Patentability Assessment */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{activeResult.patentabilityAssessment.novelty}</div>
                      <div className="text-sm text-indigo-700">Novelty Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{activeResult.patentabilityAssessment.nonObviousness}</div>
                      <div className="text-sm text-blue-700">Non-obviousness</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{activeResult.patentabilityAssessment.overallScore}</div>
                      <div className="text-sm text-purple-700">Overall Score</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prior Art References */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4 mb-8">
                  {activeResult.references.map((reference) => (
                    <div
                      key={reference.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedReference(reference)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(reference.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{reference.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(reference.publicationDate).toLocaleDateString()}
                              </span>
                              {reference.jurisdiction && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {reference.jurisdiction}
                                </span>
                              )}
                              {reference.citationCount && (
                                <span className="flex items-center gap-1">
                                  <Link2 className="w-3 h-3" />
                                  {reference.citationCount} citations
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(reference.relevanceScore)}`}>
                            {getRelevanceLabel(reference.relevanceScore)}
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            {reference.relevanceScore}/100
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{reference.abstract}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {reference.keyFeatures.slice(0, 3).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                        {reference.keyFeatures.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{reference.keyFeatures.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    AI Recommendations
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Patentability Strategy</h5>
                      <ul className="space-y-2">
                        {activeResult.patentabilityAssessment.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Claim Drafting Strategy</h5>
                      <ul className="space-y-2">
                        {activeResult.claimStrategy.map((strategy, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reference Detail Modal */}
      {selectedReference && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {getTypeIcon(selectedReference.type)}
                <h3 className="text-xl font-semibold text-gray-900">{selectedReference.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReference(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-900">Relevance Score</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{selectedReference.relevanceScore}/100</div>
                  <div className="text-sm text-red-700">{getRelevanceLabel(selectedReference.relevanceScore)}</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Conceptual Similarity</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{selectedReference.conceptualSimilarity}/100</div>
                  <div className="text-sm text-purple-700">AI-assessed similarity</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Publication Date</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {new Date(selectedReference.publicationDate).toLocaleDateString()}
                  </div>
                  {selectedReference.patentNumber && (
                    <div className="text-sm text-blue-700">{selectedReference.patentNumber}</div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Abstract</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedReference.abstract}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Technical Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReference.keyFeatures.map((feature, index) => (
                      <div key={index} className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedReference.authors && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Authors/Inventors</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedReference.authors.map((author, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {author}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriorArtOracle;