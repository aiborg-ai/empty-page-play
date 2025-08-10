import { useState, useMemo, useEffect } from 'react';
import {
  Store,
  Search,
  Filter,
  Star,
  Play,
  ShoppingCart,
  Share2,
  Users,
  Clock,
  TrendingUp,
  Zap,
  Eye,
  X,
  ChevronDown,
  CheckCircle,
  User,
  Settings,
  Folder,
  Gift,
  BarChart3,
  Database,
  Loader2
} from 'lucide-react';
import { Capability, CapabilityCategory, RunCapabilityRequest, CapabilityParameter } from '../types/capabilities';
import { Project } from '../types/projects';
import { useProjectContext } from '../hooks/useProjectContext';
import HarmonizedCard, { HCLStat, HCLKeyword, HCLAttribute, HCLAction } from './HarmonizedCard';
import { ShowcaseService } from '../lib/showcaseService';

interface ShowcaseProps {
  onNavigate?: (section: string) => void;
  initialCategory?: CapabilityCategory | 'all';
}

interface RunCapabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  capability: Capability | null;
  projects: Project[];
  onRun: (request: RunCapabilityRequest) => void;
}

interface ShareCapabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  capability: Capability | null;
  onShare: (capabilityId: string, userEmail: string, message: string) => void;
}

const RunCapabilityModal = ({ isOpen, onClose, capability, projects, onRun }: RunCapabilityModalProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [assetNamingPrefix, setAssetNamingPrefix] = useState('');

  if (!isOpen || !capability) return null;

  const handleRun = () => {
    if (!selectedProjectId) return;

    onRun({
      capabilityId: capability.id,
      projectId: selectedProjectId,
      parameters,
      settings: {
        notifyOnComplete,
        saveAssets: true,
        assetNamingPrefix: assetNamingPrefix || capability.name
      }
    });
    onClose();
  };

  const handleParameterChange = (paramId: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  const renderParameterInput = (param: CapabilityParameter) => {
    const value = parameters[param.id] || param.defaultValue || '';

    switch (param.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder={param.helpText}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
            min={param.validation?.min}
            max={param.validation?.max}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder={param.helpText}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select {param.label}</option>
            {param.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleParameterChange(param.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{param.helpText}</span>
          </label>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder={param.helpText}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Run Capability</h2>
            <p className="text-sm text-gray-600 mt-1">{capability.name}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Project *
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a project...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.assetCount} assets)
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              All generated assets will be saved to the selected project
            </p>
          </div>

          {/* Parameters */}
          {capability.parameters.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
              <div className="space-y-4">
                {capability.parameters.map((param) => (
                  <div key={param.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {param.label}
                      {param.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderParameterInput(param)}
                    {param.description && (
                      <p className="text-xs text-gray-500 mt-1">{param.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Asset Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Naming Prefix
                </label>
                <input
                  type="text"
                  value={assetNamingPrefix}
                  onChange={(e) => setAssetNamingPrefix(e.target.value)}
                  placeholder={capability.name}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Generated assets will be prefixed with this name
                </p>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyOnComplete}
                  onChange={(e) => setNotifyOnComplete(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Notify me when the capability completes</span>
              </label>
            </div>
          </div>

          {/* Estimated Output */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Expected Output</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Estimated runtime: {capability.estimatedRunTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4" />
                <span>Asset types: {capability.outputTypes.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Success rate: {Math.round(capability.successRate * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleRun}
            disabled={!selectedProjectId}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run Capability
          </button>
        </div>
      </div>
    </div>
  );
};

const ShareCapabilityModal = ({ isOpen, onClose, capability, onShare }: ShareCapabilityModalProps) => {
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen || !capability) return null;

  const handleShare = () => {
    if (!userEmail.trim()) return;
    onShare(capability.id, userEmail, message);
    onClose();
    setUserEmail('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Share Capability</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{capability.name}</h4>
            <p className="text-sm text-gray-600">{capability.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Email *
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter user's email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              The user will be able to run this capability and all generated assets will be saved to their projects.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={!userEmail.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Gift className="w-4 h-4" />
            Share Capability
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Showcase({ initialCategory = 'all' }: ShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CapabilityCategory | 'all'>(initialCategory);
  const [showRunModal, setShowRunModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { currentProject } = useProjectContext();

  // Load capabilities from Supabase
  useEffect(() => {
    const loadCapabilities = async () => {
      setLoading(true);
      try {
        const data = await ShowcaseService.getCapabilities(
          selectedCategory,
          searchQuery
        );
        setCapabilities(data);
      } catch (error) {
        console.error('Error loading capabilities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCapabilities();
  }, [selectedCategory, searchQuery]);

  // Fallback mock data for development
  const mockCapabilities: Capability[] = [
    {
      id: '1',
      name: 'AI Patent Landscape Analyzer',
      description: 'Comprehensive AI-powered patent landscape analysis with competitive intelligence',
      longDescription: 'Advanced machine learning tool that analyzes patent landscapes, identifies trends, and provides competitive intelligence insights.',
      category: 'ai',
      type: 'ai-agent',
      providerId: 'provider1',
      providerName: 'John Doe',
      providerCompany: 'AI Analytics Corp',
      status: 'available',
      isEnabled: false,
      isPurchased: false,
      isShared: false,
      price: {
        amount: 29.99,
        currency: 'USD',
        billingType: 'monthly'
      },
      freeTrialAvailable: true,
      trialDuration: 7,
      version: '2.1.0',
      lastUpdated: '2025-08-01T00:00:00Z',
      requirements: ['Patent dataset', 'Minimum 100 patents'],
      supportedDataTypes: ['Patent XML', 'Patent JSON', 'CSV'],
      estimatedRunTime: '5-15 minutes',
      sampleAssets: [],
      outputTypes: ['Analysis Report', 'Trend Dashboard', 'Competitive Matrix'],
      totalRuns: 1247,
      averageRunTime: 8.5,
      successRate: 0.96,
      userRating: 4.8,
      totalReviews: 156,
      parameters: [
        {
          id: 'analysis_depth',
          name: 'analysis_depth',
          label: 'Analysis Depth',
          type: 'select',
          required: true,
          options: [
            { value: 'basic', label: 'Basic Analysis' },
            { value: 'detailed', label: 'Detailed Analysis' },
            { value: 'comprehensive', label: 'Comprehensive Analysis' }
          ],
          defaultValue: 'detailed',
          description: 'Level of analysis depth',
          helpText: 'Choose how deep the analysis should go'
        },
        {
          id: 'include_competitors',
          name: 'include_competitors',
          label: 'Include Competitor Analysis',
          type: 'boolean',
          required: false,
          defaultValue: true,
          description: 'Include competitive intelligence',
          helpText: 'Analyze competitor patent portfolios'
        }
      ],
      thumbnailUrl: '/api/thumbnails/ai-patent-analyzer.jpg',
      screenshotUrls: [],
      tags: ['AI', 'Analytics', 'Competitive Intelligence'],
      shareSettings: {
        allowSharing: true,
        maxShares: 5,
        currentShares: 2
      }
    },
    {
      id: '2',
      name: 'Patent Citation Network Mapper',
      description: 'Visualize and analyze patent citation networks with interactive graphs',
      longDescription: 'Create interactive citation network visualizations to understand patent relationships and influence.',
      category: 'visualization',
      type: 'tool',
      providerId: 'provider2',
      providerName: 'Sarah Chen',
      providerCompany: 'DataViz Solutions',
      status: 'purchased',
      isEnabled: true,
      isPurchased: true,
      isShared: false,
      purchasedAt: '2025-07-15T00:00:00Z',
      enabledAt: '2025-07-15T00:00:00Z',
      price: {
        amount: 49.99,
        currency: 'USD',
        billingType: 'one-time'
      },
      freeTrialAvailable: false,
      version: '1.5.2',
      lastUpdated: '2025-07-20T00:00:00Z',
      requirements: ['Citation data', 'Minimum 50 patents'],
      supportedDataTypes: ['Patent JSON', 'Citation CSV'],
      estimatedRunTime: '2-5 minutes',
      sampleAssets: [],
      outputTypes: ['Interactive Graph', 'Network Statistics', 'Influence Report'],
      totalRuns: 892,
      averageRunTime: 3.2,
      successRate: 0.98,
      userRating: 4.9,
      totalReviews: 89,
      parameters: [
        {
          id: 'layout_type',
          name: 'layout_type',
          label: 'Graph Layout',
          type: 'select',
          required: true,
          options: [
            { value: 'force', label: 'Force-Directed' },
            { value: 'circular', label: 'Circular' },
            { value: 'hierarchical', label: 'Hierarchical' }
          ],
          defaultValue: 'force',
          description: 'Graph layout algorithm',
          helpText: 'Choose visualization layout style'
        }
      ],
      thumbnailUrl: '/api/thumbnails/citation-mapper.jpg',
      screenshotUrls: [],
      tags: ['Visualization', 'Citations', 'Network Analysis'],
      shareSettings: {
        allowSharing: true,
        maxShares: 3,
        currentShares: 0
      }
    },
    {
      id: '3',
      name: 'Automated Patent Summarizer',
      description: 'AI-powered automatic summarization of patent documents',
      longDescription: 'Uses advanced NLP to create concise, accurate summaries of patent documents.',
      category: 'ai',
      type: 'ai-agent',
      providerId: 'provider3',
      providerName: 'Mike Rodriguez',
      providerCompany: 'NLP Innovations',
      status: 'shared',
      isEnabled: true,
      isPurchased: false,
      isShared: true,
      sharedBy: 'colleague@company.com',
      price: {
        amount: 19.99,
        currency: 'USD',
        billingType: 'per-use'
      },
      freeTrialAvailable: true,
      trialDuration: 3,
      version: '3.0.1',
      lastUpdated: '2025-08-05T00:00:00Z',
      requirements: ['Patent text', 'Full patent document'],
      supportedDataTypes: ['Patent PDF', 'Patent XML', 'Plain Text'],
      estimatedRunTime: '30 seconds - 2 minutes',
      sampleAssets: [],
      outputTypes: ['Summary Report', 'Key Points', 'Technical Abstract'],
      totalRuns: 2156,
      averageRunTime: 1.1,
      successRate: 0.94,
      userRating: 4.6,
      totalReviews: 203,
      parameters: [
        {
          id: 'summary_length',
          name: 'summary_length',
          label: 'Summary Length',
          type: 'select',
          required: true,
          options: [
            { value: 'short', label: 'Short (50-100 words)' },
            { value: 'medium', label: 'Medium (100-200 words)' },
            { value: 'long', label: 'Long (200-300 words)' }
          ],
          defaultValue: 'medium',
          description: 'Desired summary length',
          helpText: 'Choose summary length preference'
        }
      ],
      thumbnailUrl: '/api/thumbnails/patent-summarizer.jpg',
      screenshotUrls: [],
      tags: ['AI', 'NLP', 'Summarization'],
      shareSettings: {
        allowSharing: false,
        maxShares: 0,
        currentShares: 0
      }
    },
    {
      id: '4',
      name: 'Global Patent Dataset Explorer',
      description: 'Comprehensive dataset of global patent filings with advanced filtering',
      longDescription: 'Access to 50M+ patent records from major patent offices worldwide with sophisticated search and filtering capabilities.',
      category: 'search',
      type: 'tool',
      providerId: 'provider4',
      providerName: 'Dr. Jennifer Liu',
      providerCompany: 'Patent Data Solutions',
      status: 'available',
      isEnabled: false,
      isPurchased: false,
      isShared: false,
      price: {
        amount: 149.99,
        currency: 'USD',
        billingType: 'monthly'
      },
      freeTrialAvailable: true,
      trialDuration: 14,
      version: '4.2.1',
      lastUpdated: '2025-08-07T00:00:00Z',
      requirements: ['None'],
      supportedDataTypes: ['JSON', 'CSV', 'XML', 'Excel'],
      estimatedRunTime: 'Real-time access',
      sampleAssets: [],
      outputTypes: ['Patent Dataset', 'Filtered Results', 'Export Files'],
      totalRuns: 3842,
      averageRunTime: 0.5,
      successRate: 0.99,
      userRating: 4.9,
      totalReviews: 287,
      parameters: [],
      thumbnailUrl: '/api/thumbnails/patent-dataset.jpg',
      screenshotUrls: [],
      tags: ['Dataset', 'Global', 'Search', 'Patents'],
      shareSettings: {
        allowSharing: true,
        maxShares: 10,
        currentShares: 3
      }
    },
    {
      id: '5',
      name: 'Technology Trends Report Generator',
      description: 'Automated reports on emerging technology trends from patent analysis',
      longDescription: 'Generate comprehensive trend reports combining patent data with market intelligence and expert analysis.',
      category: 'analysis',
      type: 'tool',
      providerId: 'provider5',
      providerName: 'Alex Thompson',
      providerCompany: 'TechTrend Analytics',
      status: 'available',
      isEnabled: false,
      isPurchased: false,
      isShared: false,
      price: {
        amount: 79.99,
        currency: 'USD',
        billingType: 'one-time'
      },
      freeTrialAvailable: true,
      trialDuration: 7,
      version: '2.8.0',
      lastUpdated: '2025-08-06T00:00:00Z',
      requirements: ['Patent data', 'Technology sector selection'],
      supportedDataTypes: ['Patent JSON', 'Market Data'],
      estimatedRunTime: '10-30 minutes',
      sampleAssets: [],
      outputTypes: ['Trend Report', 'Executive Summary', 'Data Visualizations'],
      totalRuns: 1567,
      averageRunTime: 18.5,
      successRate: 0.92,
      userRating: 4.7,
      totalReviews: 143,
      parameters: [
        {
          id: 'tech_sector',
          name: 'tech_sector',
          label: 'Technology Sector',
          type: 'select',
          required: true,
          options: [
            { value: 'ai-ml', label: 'AI & Machine Learning' },
            { value: 'biotech', label: 'Biotechnology' },
            { value: 'clean-energy', label: 'Clean Energy' },
            { value: 'semiconductors', label: 'Semiconductors' }
          ],
          defaultValue: 'ai-ml',
          description: 'Focus sector for trend analysis',
          helpText: 'Select primary technology sector'
        }
      ],
      thumbnailUrl: '/api/thumbnails/tech-trends.jpg',
      screenshotUrls: [],
      tags: ['Reports', 'Trends', 'Technology', 'Analysis'],
      shareSettings: {
        allowSharing: true,
        maxShares: 5,
        currentShares: 1
      }
    },
    {
      id: '6',
      name: 'Deep Dive Innovation Analyzer',
      description: 'Comprehensive deep-dive analysis of innovation patterns and opportunities',
      longDescription: 'Advanced analytical tool that performs deep-dive analysis of innovation landscapes, identifying white spaces and emerging opportunities.',
      category: 'analysis',
      type: 'ai-agent',
      providerId: 'provider6',
      providerName: 'Dr. Maria Gonzalez',
      providerCompany: 'Innovation Insights Lab',
      status: 'available',
      isEnabled: false,
      isPurchased: false,
      isShared: false,
      price: {
        amount: 199.99,
        currency: 'USD',
        billingType: 'per-use'
      },
      freeTrialAvailable: true,
      trialDuration: 3,
      version: '1.4.2',
      lastUpdated: '2025-08-08T00:00:00Z',
      requirements: ['Patent portfolio', 'Market data'],
      supportedDataTypes: ['Patent JSON', 'Market CSV', 'Company Data'],
      estimatedRunTime: '45-90 minutes',
      sampleAssets: [],
      outputTypes: ['Deep Analysis Report', 'Opportunity Map', 'Strategic Recommendations'],
      totalRuns: 234,
      averageRunTime: 67.2,
      successRate: 0.89,
      userRating: 4.8,
      totalReviews: 45,
      parameters: [
        {
          id: 'analysis_scope',
          name: 'analysis_scope',
          label: 'Analysis Scope',
          type: 'select',
          required: true,
          options: [
            { value: 'company', label: 'Company Focus' },
            { value: 'technology', label: 'Technology Focus' },
            { value: 'market', label: 'Market Focus' }
          ],
          defaultValue: 'technology',
          description: 'Primary scope of analysis',
          helpText: 'Choose analysis focus area'
        }
      ],
      thumbnailUrl: '/api/thumbnails/deep-dive.jpg',
      screenshotUrls: [],
      tags: ['Deep Dive', 'Innovation', 'Analysis', 'AI'],
      shareSettings: {
        allowSharing: true,
        maxShares: 3,
        currentShares: 0
      }
    }
  ];

  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'AI Patent Research',
      description: 'AI patent landscape analysis',
      ownerId: '1',
      ownerName: 'Current User',
      createdAt: '2025-08-01T00:00:00Z',
      updatedAt: '2025-08-08T00:00:00Z',
      accessLevel: 'private',
      assets: [],
      assetCount: 12,
      collaborators: [],
      collaboratorCount: 1,
      activities: [],
      lastActivity: '2025-08-08T00:00:00Z',
      settings: {
        autoSaveSearches: true,
        autoCreateAssets: true,
        allowCrossProjectAssets: true,
        notificationSettings: {
          onNewActivity: true,
          onCollaboratorJoin: true,
          onAssetAdded: false
        }
      },
      tags: ['AI', 'research'],
      color: '#3b82f6',
      isFavorite: false,
      isArchived: false
    },
    {
      id: '2',
      name: 'Biotech Analysis',
      description: 'Biotechnology patent analysis',
      ownerId: '1',
      ownerName: 'Current User',
      createdAt: '2025-07-15T00:00:00Z',
      updatedAt: '2025-08-01T00:00:00Z',
      accessLevel: 'team',
      assets: [],
      assetCount: 8,
      collaborators: [],
      collaboratorCount: 3,
      activities: [],
      lastActivity: '2025-08-01T00:00:00Z',
      settings: {
        autoSaveSearches: true,
        autoCreateAssets: true,
        allowCrossProjectAssets: true,
        notificationSettings: {
          onNewActivity: true,
          onCollaboratorJoin: true,
          onAssetAdded: false
        }
      },
      tags: ['biotech', 'analysis'],
      color: '#10b981',
      isFavorite: false,
      isArchived: false
    }
  ]);

  const categories: Array<{ id: CapabilityCategory | 'all'; label: string; icon: any }> = [
    { id: 'all', label: 'All Categories', icon: Store },
    { id: 'ai', label: 'AI & Machine Learning', icon: Zap },
    { id: 'analysis', label: 'Analysis Tools', icon: TrendingUp },
    { id: 'visualization', label: 'Data Visualization', icon: BarChart3 },
    { id: 'search', label: 'Search & Discovery', icon: Search },
    { id: 'automation', label: 'Automation', icon: Settings },
    { id: 'collaboration', label: 'Collaboration', icon: Users }
  ];

  const displayCapabilities = useMemo(() => {
    // If we have data from Supabase, use it; otherwise fall back to mock data
    const dataToUse = capabilities.length > 0 ? capabilities : (loading ? [] : mockCapabilities);
    
    // Since search and filtering are now handled by the service, return data as-is
    return dataToUse;
  }, [capabilities, loading]);

  const handlePurchase = (capability: Capability) => {
    // In real app, handle purchase flow
    console.log('Purchasing capability:', capability.name);
    alert(`Purchasing ${capability.name} for $${capability.price.amount}`);
  };


  const handleRun = (request: RunCapabilityRequest) => {
    console.log('Running capability:', request);
    alert(`Running capability in project "${projects.find(p => p.id === request.projectId)?.name}"`);
  };

  const handleShare = (capabilityId: string, userEmail: string, message: string) => {
    console.log('Sharing capability:', { capabilityId, userEmail, message });
    alert(`Capability shared with ${userEmail}`);
  };



  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Store className="w-5 h-5 text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Showcase</h1>
              </div>
              <p className="text-lg text-gray-600">
                Discover and purchase powerful capabilities to enhance your research workflow
              </p>
              {currentProject && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Current project:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: currentProject.color }}
                    />
                    <span className="font-medium text-blue-600">{currentProject.name}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Marketplace Stats</div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Store className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{displayCapabilities.length} Capabilities</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">12 Providers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">4.2K Runs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search capabilities, providers, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 min-w-48"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading capabilities...</h3>
              <p className="text-gray-600">Discovering the latest capabilities for your research workflow</p>
            </div>
          ) : displayCapabilities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || selectedCategory !== 'all' ? 'No capabilities found' : 'No capabilities available'}
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search terms or category filter'
                  : 'Capabilities will appear here once they are added to the database'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCapabilities.map((capability) => {
                const stats: HCLStat[] = [
                  {
                    label: 'Rating',
                    value: capability.userRating,
                    icon: Star,
                    color: 'text-yellow-500'
                  },
                  {
                    label: 'Runs',
                    value: capability.totalRuns,
                    icon: Play,
                    color: 'text-blue-500'
                  },
                  {
                    label: 'Success',
                    value: `${Math.round(capability.successRate * 100)}%`,
                    icon: CheckCircle,
                    color: 'text-green-500'
                  }
                ];

                const keywords: HCLKeyword[] = [
                  // Status badges as keywords
                  ...(capability.isPurchased ? [{ label: 'Owned', color: 'green' }] : []),
                  ...(capability.isShared ? [{ label: 'Shared', color: 'orange' }] : []),
                  ...(capability.freeTrialAvailable && !capability.isPurchased ? [{ label: 'Trial', color: 'yellow' }] : []),
                  // Tags
                  ...capability.tags.slice(0, 3).map(tag => ({ label: tag, color: 'gray' }))
                ];

                const attributes: HCLAttribute[] = [
                  {
                    label: 'Provider',
                    value: capability.providerName,
                    icon: User
                  },
                  {
                    label: 'Company',
                    value: capability.providerCompany,
                    icon: Settings
                  },
                  {
                    label: 'Price',
                    value: capability.price.amount === 0 ? 'Free' : `$${capability.price.amount}`,
                    icon: Database
                  }
                ];

                const actions: HCLAction[] = [
                  ...(capability.isPurchased ? [
                    {
                      id: 'use',
                      label: 'Use',
                      icon: Play,
                      onClick: () => {
                        setSelectedCapability(capability);
                        setShowRunModal(true);
                      },
                      variant: 'primary' as const,
                      isPrimary: true
                    }
                  ] : capability.freeTrialAvailable ? [
                    {
                      id: 'try-free',
                      label: 'Try Free',
                      icon: Gift,
                      onClick: () => {
                        setSelectedCapability(capability);
                        setShowRunModal(true);
                      },
                      variant: 'primary' as const,
                      isPrimary: true
                    }
                  ] : [
                    {
                      id: 'purchase',
                      label: `$${capability.price.amount}`,
                      icon: ShoppingCart,
                      onClick: () => handlePurchase(capability),
                      variant: 'primary' as const,
                      isPrimary: true
                    }
                  ]),
                  {
                    id: 'share',
                    label: 'Share',
                    icon: Share2,
                    onClick: () => {
                      setSelectedCapability(capability);
                      setShowShareModal(true);
                    }
                  },
                  {
                    id: 'details',
                    label: 'Details',
                    icon: Eye,
                    onClick: () => console.log('View details', capability.id)
                  }
                ];

                return (
                  <HarmonizedCard
                    key={capability.id}
                    title={capability.name}
                    description={capability.description}
                    stats={stats}
                    keywords={keywords}
                    attributes={attributes}
                    actions={actions}
                    colorAccent="#3b82f6"
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <RunCapabilityModal
        isOpen={showRunModal}
        onClose={() => setShowRunModal(false)}
        capability={selectedCapability}
        projects={projects}
        onRun={handleRun}
      />

      <ShareCapabilityModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        capability={selectedCapability}
        onShare={handleShare}
      />
    </div>
  );
}