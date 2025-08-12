import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Download,
  Share2,
  Star,
  Clock,
  Shield,
  Zap,
  Code,
  Globe,
  Award,
  TrendingUp,
  FileText,
  MessageSquare,
  Heart,
  Bookmark,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Settings,
  Database,
  Bot,
  BarChart3,
  Wrench,
  Store,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Tag,
  ArrowRight,
  Lightbulb,
  Layers,
  Terminal
} from 'lucide-react';
import type { Capability } from '../types/capabilities';

interface CapabilityDetailViewProps {
  capabilities: Capability[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onRun: (capability: Capability) => void;
  onDownload: (capability: Capability, event: React.MouseEvent) => void;
  onShare: (capability: Capability) => void;
  downloadedCapabilities: Record<string, boolean>;
  downloadingCapabilities: Record<string, boolean>;
}

interface DetailedCapabilityData {
  screenshots: string[];
  technicalSpecs: {
    version: string;
    lastUpdated: string;
    compatibility: string[];
    requirements: {
      memory: string;
      storage: string;
      processing: string;
      network: string;
    };
    supportedFormats: string[];
  };
  useCases: {
    title: string;
    description: string;
    industry: string;
    complexity: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
  }[];
  implementation: {
    setup: string[];
    configuration: string[];
    usage: string[];
    troubleshooting: string[];
  };
  reviews: {
    id: string;
    user: string;
    rating: number;
    date: string;
    comment: string;
    helpful: number;
    verified: boolean;
  }[];
  changelog: {
    version: string;
    date: string;
    changes: string[];
    type: 'major' | 'minor' | 'patch';
  }[];
  relatedCapabilities: string[];
  metrics: {
    successRate: number;
    averageExecutionTime: number;
    errorRate: number;
    userSatisfaction: number;
    popularityTrend: number;
  };
}

const CapabilityDetailView: React.FC<CapabilityDetailViewProps> = ({
  capabilities,
  currentIndex,
  onNext,
  onPrevious,
  onClose,
  onRun,
  onDownload,
  onShare,
  downloadedCapabilities,
  downloadingCapabilities
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'usage' | 'reviews' | 'changelog'>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullScreenshot, setShowFullScreenshot] = useState<string | null>(null);

  const capability = capabilities[currentIndex];

  if (!capability) return null;

  // Generate enhanced mock data for detail view
  const getDetailedData = (cap: Capability): DetailedCapabilityData => {
    // Special handling for MCP Integration
    if (cap.id === 'mcp-innospot-1') {
      return {
        screenshots: [
          '/screenshots/demo-screenshot-1.jpg',
          '/screenshots/demo-screenshot-2.jpg',
          '/screenshots/demo-screenshot-3.jpg'
        ],
        technicalSpecs: {
          version: '1.0.0',
          lastUpdated: '2025-08-12',
          compatibility: ['Claude Desktop', 'VS Code', 'Cline', 'Continue Dev', 'OpenAI ChatGPT'],
          requirements: {
            memory: '4GB RAM minimum',
            storage: '500MB available space',
            processing: 'Any modern processor',
            network: 'Stable internet connection for API calls'
          },
          supportedFormats: ['JSON', 'XML', 'CSV', 'Text']
        },
        useCases: [
          {
            title: 'Patent Trend Analysis',
            description: 'Analyze annual application and issued trends for patents in specific technology fields',
            industry: 'R&D Strategy',
            complexity: 'intermediate',
            estimatedTime: '5-10 minutes'
          },
          {
            title: 'Technology Landscape Mapping',
            description: 'Generate word clouds and innovation wheels from recent patent publications',
            industry: 'Innovation Management',
            complexity: 'beginner',
            estimatedTime: '2-5 minutes'
          },
          {
            title: 'Competitive Intelligence',
            description: 'Identify top inventors and assignees in technology domains',
            industry: 'Business Intelligence',
            complexity: 'intermediate',
            estimatedTime: '5-15 minutes'
          },
          {
            title: 'Legal Risk Assessment',
            description: 'Track patent legal status and identify litigation risks',
            industry: 'Legal Technology',
            complexity: 'advanced',
            estimatedTime: '10-20 minutes'
          }
        ],
        implementation: {
          setup: [
            'Clone the InnoSpot MCP repository from GitHub',
            'Install dependencies using npm install',
            'Build the project using npm run build',
            'Run the server using npm start to verify installation'
          ],
          configuration: [
            'Set up InnoSpot API credentials as environment variables (INNOSPOT_CLIENT_ID and INNOSPOT_CLIENT_SECRET)',
            'Add the MCP server configuration to your cline_mcp_settings.json file',
            'Configure the server with command "npx" and args ["@innospot/mcp-server"]',
            'Set autoApprove array for frequently used tools (optional)',
            'Verify the server is enabled (disabled: false in configuration)'
          ],
          usage: [
            'Use the provided tools to interact with InnoSpot\'s API',
            'Ensure you have valid InnoSpot API credentials set as environment variables',
            'Tools will be available in your MCP Host (Claude Desktop, VS Code, etc.)',
            'Select specific tools like get_patent_trends or get_top_inventors as needed',
            'Results will be returned in structured format for further analysis'
          ],
          troubleshooting: [
            'Verify InnoSpot API credentials are correctly set in environment variables',
            'Check that the MCP server is properly configured in cline_mcp_settings.json',
            'Ensure network connectivity to InnoSpot API endpoints',
            'Review server logs for detailed error messages',
            'For API tokens and service access, visit: https://open.innospot.com/home'
          ]
        },
        reviews: [
          {
            id: 'rev1',
            user: 'Dr. Sarah Chen',
            rating: 5,
            date: '2024-01-10',
            comment: 'The MCP integration makes patent analysis seamless within my development workflow. Excellent tool!',
            helpful: 24,
            verified: true
          },
          {
            id: 'rev2',
            user: 'Innovation Manager',
            rating: 5,
            date: '2024-01-08',
            comment: 'Perfect integration with Claude Desktop. The patent trend analysis is incredibly useful.',
            helpful: 18,
            verified: true
          }
        ],
        changelog: [
          {
            version: '1.0.0',
            date: '2025-08-12',
            changes: [
              'Initial release with 9 comprehensive patent intelligence tools',
              'Full InnoSpot Insights API integration',
              'Support for keyword and IPC-based searches',
              'MCP protocol implementation for AI assistant integration'
            ],
            type: 'major'
          }
        ],
        relatedCapabilities: [
          'AI Patent Landscape Analyzer',
          'AI Prior Art Oracle',
          'AI Innovation Trajectory Predictor',
          'Patent Citation Network Mapper'
        ],
        metrics: {
          successRate: 98.2,
          averageExecutionTime: 2.1,
          errorRate: 0.8,
          userSatisfaction: 4.9,
          popularityTrend: 45.8
        }
      };
    }

    // Default implementation for other capabilities
    return {
      screenshots: [
        '/screenshots/demo-screenshot-1.jpg',
        '/screenshots/demo-screenshot-2.jpg',
        '/screenshots/demo-screenshot-3.jpg'
      ],
      technicalSpecs: {
        version: '2.4.1',
        lastUpdated: '2024-01-15',
        compatibility: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+'],
        requirements: {
          memory: '4GB RAM minimum, 8GB recommended',
          storage: '2GB available space',
          processing: 'Dual-core 2.0GHz processor or better',
          network: 'Stable internet connection required'
        },
        supportedFormats: ['PDF', 'DOCX', 'TXT', 'CSV', 'JSON', 'XML']
      },
      useCases: [
        {
          title: 'Patent Prior Art Analysis',
          description: 'Automatically analyze existing patents to identify potential conflicts and opportunities',
          industry: 'Legal Technology',
          complexity: 'intermediate',
          estimatedTime: '15-30 minutes'
        },
        {
          title: 'Innovation Trend Detection',
          description: 'Identify emerging technological trends from patent filing patterns',
          industry: 'R&D Strategy',
          complexity: 'advanced',
          estimatedTime: '1-2 hours'
        },
        {
          title: 'Competitive Intelligence',
          description: 'Monitor competitor patent activities and strategic positioning',
          industry: 'Business Intelligence',
          complexity: 'beginner',
          estimatedTime: '10-20 minutes'
        }
      ],
      implementation: {
        setup: [
          'Click "Download" to add capability to your Studio',
          'Ensure your project has appropriate permissions',
          'Verify system requirements are met',
          'Review configuration options'
        ],
        configuration: [
          'Set up API endpoints and authentication',
          'Configure data sources and filters',
          'Customize output formats and templates',
          'Establish notification preferences'
        ],
        usage: [
          'Navigate to Studio and select the capability',
          'Choose your target project and data sources',
          'Configure analysis parameters',
          'Execute and monitor the analysis process',
          'Review results and export findings'
        ],
        troubleshooting: [
          'Check internet connectivity and API status',
          'Verify all required fields are properly configured',
          'Review error logs in the Console tab',
          'Contact support if issues persist'
        ]
      },
      reviews: [
        {
          id: 'rev1',
          user: 'Dr. Sarah Chen',
          rating: 5,
          date: '2024-01-10',
          comment: 'Exceptional tool for patent analysis. The AI recommendations are incredibly accurate and have saved our team countless hours.',
          helpful: 24,
          verified: true
        },
        {
          id: 'rev2',
          user: 'Patent Attorney Mike',
          rating: 4,
          date: '2024-01-08',
          comment: 'Very useful for prior art searches. Could use better visualization options, but overall excellent functionality.',
          helpful: 18,
          verified: true
        },
        {
          id: 'rev3',
          user: 'Innovation Researcher',
          rating: 5,
          date: '2024-01-05',
          comment: 'Game-changer for our R&D process. The trend analysis features are particularly impressive.',
          helpful: 31,
          verified: false
        }
      ],
      changelog: [
        {
          version: '2.4.1',
          date: '2024-01-15',
          changes: [
            'Improved AI accuracy by 15%',
            'Added support for Chinese patent databases',
            'Fixed memory leak in large dataset processing',
            'Enhanced user interface responsiveness'
          ],
          type: 'minor'
        },
        {
          version: '2.4.0',
          date: '2024-01-01',
          changes: [
            'Major AI algorithm update',
            'New trend visualization dashboard',
            'Integration with USPTO real-time feeds',
            'Performance optimizations'
          ],
          type: 'major'
        }
      ],
      relatedCapabilities: [
        'Patent Landscape Analyzer',
        'Technology Trend Predictor',
        'Innovation Opportunity Scanner'
      ],
      metrics: {
        successRate: 94.7,
        averageExecutionTime: 12.3,
        errorRate: 2.1,
        userSatisfaction: 4.6,
        popularityTrend: 23.5
      }
    };
  };

  const detailedData = getDetailedData(capability);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNext, onPrevious, onClose]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai-agent': return Bot;
      case 'tool': return Wrench;
      case 'dataset': return Database;
      case 'dashboard': return BarChart3;
      case 'report': return FileText;
      default: return Store;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const TypeIcon = getTypeIcon(capability.type);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                <TypeIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{capability.name}</h1>
                <p className="text-lg opacity-90">{capability.description}</p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-lg text-sm">
              {currentIndex + 1} of {capabilities.length}
            </span>
            
            <button
              onClick={onNext}
              disabled={currentIndex === capabilities.length - 1}
              className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>{capability.userRating.toFixed(1)} ({capability.totalReviews} reviews)</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>{capability.totalRuns.toLocaleString()} downloads</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>~{detailedData.metrics.averageExecutionTime}s runtime</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>{detailedData.metrics.successRate}% success rate</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => onRun(capability)}
            className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Run Capability
          </button>
          
          <button
            onClick={(e) => onDownload(capability, e)}
            disabled={downloadingCapabilities[capability.id]}
            className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              downloadedCapabilities[capability.id]
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Download className="w-5 h-5" />
            {downloadedCapabilities[capability.id] ? 'Downloaded' : 'Download'}
          </button>
          
          <button
            onClick={() => onShare(capability)}
            className="px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-3 rounded-lg transition-colors ${
              isBookmarked ? 'bg-yellow-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-lg transition-colors ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 h-full">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'technical', label: 'Technical', icon: Settings },
                { id: 'usage', label: 'Usage', icon: Code },
                { id: 'reviews', label: 'Reviews', icon: MessageSquare },
                { id: 'changelog', label: 'Changelog', icon: Calendar }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Screenshots */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Screenshots & Demos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {detailedData.screenshots.map((screenshot, index) => (
                      <div
                        key={index}
                        className="relative bg-gray-100 rounded-lg aspect-video cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setShowFullScreenshot(screenshot)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Demo Screenshot {index + 1}</p>
                            <p className="text-xs text-gray-400 mt-1">Click to view full size</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: Bot, title: 'AI-Powered Analysis', desc: 'Advanced machine learning algorithms' },
                      { icon: Zap, title: 'Real-time Processing', desc: 'Instant results and live updates' },
                      { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption and privacy' },
                      { icon: Globe, title: 'Global Data Sources', desc: 'Access to worldwide patent databases' },
                      { icon: Award, title: 'Proven Accuracy', desc: '94.7% success rate in production' },
                      { icon: TrendingUp, title: 'Trend Detection', desc: 'Identify emerging technology patterns' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <feature.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Common Use Cases
                  </h3>
                  <div className="space-y-4">
                    {detailedData.useCases.map((useCase, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{useCase.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getComplexityColor(useCase.complexity)}`}>
                              {useCase.complexity}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {useCase.estimatedTime}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{useCase.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-blue-600 font-medium">{useCase.industry}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Success Rate', value: `${detailedData.metrics.successRate}%`, color: 'green' },
                      { label: 'Avg Runtime', value: `${detailedData.metrics.averageExecutionTime}s`, color: 'blue' },
                      { label: 'Error Rate', value: `${detailedData.metrics.errorRate}%`, color: 'red' },
                      { label: 'User Satisfaction', value: `${detailedData.metrics.userSatisfaction}/5`, color: 'purple' }
                    ].map((metric, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className={`text-2xl font-bold text-${metric.color}-600`}>{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="space-y-8">
                {/* System Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    System Requirements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {[
                        { icon: Cpu, label: 'Processing', value: detailedData.technicalSpecs.requirements.processing },
                        { icon: HardDrive, label: 'Memory', value: detailedData.technicalSpecs.requirements.memory },
                        { icon: Database, label: 'Storage', value: detailedData.technicalSpecs.requirements.storage },
                        { icon: Wifi, label: 'Network', value: detailedData.technicalSpecs.requirements.network }
                      ].map((req, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <req.icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900">{req.label}</div>
                            <div className="text-sm text-gray-600">{req.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Browser Compatibility</h4>
                      <div className="space-y-2">
                        {detailedData.technicalSpecs.compatibility.map((browser, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{browser}</span>
                          </div>
                        ))}
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-3 mt-6">Supported Formats</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailedData.technicalSpecs.supportedFormats.map((format, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features & Tools */}
                {capability.features && capability.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Available Tools & Features
                    </h3>
                    <div className="space-y-4">
                      {capability.features.map((feature, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Code className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {feature.name}
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* API Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    API & Integration
                  </h3>
                  <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
                    <div>{'{'}</div>
                    <div className="ml-4">"endpoint": "https://api.innospot.com/v2/{capability.id}",</div>
                    <div className="ml-4">"method": "POST",</div>
                    <div className="ml-4">"authentication": "Bearer Token",</div>
                    <div className="ml-4">"rate_limit": "100 requests/minute",</div>
                    <div className="ml-4">"timeout": "30 seconds"</div>
                    <div>{'}'}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-8">
                {/* Implementation Steps */}
                {[
                  { title: 'Setup', steps: detailedData.implementation.setup, icon: Settings },
                  { title: 'Configuration', steps: detailedData.implementation.configuration, icon: Code },
                  { title: 'Usage', steps: detailedData.implementation.usage, icon: Play },
                  { title: 'Troubleshooting', steps: detailedData.implementation.troubleshooting, icon: AlertCircle }
                ].map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <section.icon className="w-5 h-5" />
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {stepIndex + 1}
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* MCP Configuration Example */}
                {capability.id === 'mcp-innospot-1' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      MCP Host Configuration
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-3">
                        Add this configuration to your <code className="bg-white px-2 py-1 rounded text-xs">cline_mcp_settings.json</code> file:
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-xs overflow-x-auto">
                        <pre>{`{
  "mcpServers": {
    "@innospot/mcp-server": {
      "command": "npx",
      "args": ["@innospot/mcp-server"],
      "env": {
        "INNOSPOT_CLIENT_ID": "your_innospot_client_id_here",
        "INNOSPOT_CLIENT_SECRET": "your_innospot_client_secret_here"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}`}</pre>
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Important:</strong> Replace <code className="bg-blue-100 px-1 rounded">your_innospot_client_id_here</code> and{' '}
                          <code className="bg-blue-100 px-1 rounded">your_innospot_client_secret_here</code> with your actual InnoSpot API credentials.
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                        <a href="https://open.innospot.com/home" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          Get your InnoSpot API credentials
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{capability.userRating.toFixed(1)}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= capability.userRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{capability.totalReviews} reviews</div>
                    </div>
                    
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = Math.floor(Math.random() * 50) + 5;
                        const percentage = (count / capability.totalReviews) * 100;
                        return (
                          <div key={rating} className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-600 w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {detailedData.reviews.map(review => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{review.user[0]}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{review.user}</span>
                              {review.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({review.helpful})</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
                          <ThumbsDown className="w-4 h-4" />
                          <span>Not helpful</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'changelog' && (
              <div className="space-y-6">
                {detailedData.changelog.map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        entry.type === 'major' ? 'bg-red-100 text-red-700' :
                        entry.type === 'minor' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        v{entry.version}
                      </span>
                      <span className="text-sm text-gray-500">{entry.date}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        entry.type === 'major' ? 'bg-red-100 text-red-600' :
                        entry.type === 'minor' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {entry.type}
                      </span>
                    </div>
                    
                    <ul className="space-y-2">
                      {entry.changes.map((change, changeIndex) => (
                        <li key={changeIndex} className="flex items-start gap-2 text-gray-700">
                          <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-auto">
          {/* Related Capabilities */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Related Capabilities
            </h3>
            <div className="space-y-3">
              {detailedData.relatedCapabilities.map((related, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="font-medium text-gray-900 text-sm">{related}</div>
                  <div className="text-xs text-gray-500 mt-1">Similar functionality</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-sm">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                View Documentation
              </button>
              <button className="w-full flex items-center gap-2 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-sm">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                Contact Support
              </button>
              <button className="w-full flex items-center gap-2 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-sm">
                <Tag className="w-4 h-4 text-gray-500" />
                Report Issue
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {capability.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Screenshot Modal */}
      {showFullScreenshot && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={() => setShowFullScreenshot(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="bg-gray-100 rounded-lg aspect-video w-full max-w-4xl flex items-center justify-center">
              <div className="text-center">
                <Monitor className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Full Size Screenshot</p>
                <p className="text-sm text-gray-500 mt-2">{showFullScreenshot}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapabilityDetailView;