// Report Automation System - Automated report generation and distribution
// Provides scheduled reporting, custom templates, and intelligent distribution

import { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Send,
  Clock,
  Settings,
  Plus,
  Play,
  Pause,
  Download,
  Mail,
  Globe,
  Database,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Eye,
  Copy
} from 'lucide-react';
import {
  ReportAutomation,
  ReportGeneration
} from '../types/automation';

interface ReportAutomationSystemProps {
  projectId?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  formats: string[];
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: any;
    description: string;
  }>;
}

interface AutomationStats {
  totalAutomations: number;
  activeAutomations: number;
  reportsGenerated: number;
  successRate: number;
  distributionStats: Record<string, number>;
  popularTemplates: Array<{ name: string; usage: number }>;
}

export default function ReportAutomationSystem({ projectId }: ReportAutomationSystemProps) {
  const [automations, setAutomations] = useState<ReportAutomation[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [generations, setGenerations] = useState<ReportGeneration[]>([]);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [_selectedAutomation, setSelectedAutomation] = useState<ReportAutomation | null>(null);
  const [_showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState<'automations' | 'templates' | 'history' | 'analytics'>('automations');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load automation data
  useEffect(() => {
    loadAutomationData();
  }, [projectId]);

  const loadAutomationData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real implementation, this would come from API
      const mockTemplates: ReportTemplate[] = [
        {
          id: 'tmpl_1',
          name: 'Patent Landscape Analysis',
          description: 'Comprehensive patent landscape analysis with trends and competitive insights',
          category: 'Analytics',
          formats: ['pdf', 'html', 'excel'],
          parameters: [
            { name: 'technology_area', type: 'string', required: true, description: 'Technology domain to analyze' },
            { name: 'date_range', type: 'daterange', required: true, description: 'Analysis period' },
            { name: 'top_assignees', type: 'number', required: false, default: 10, description: 'Number of top assignees to include' }
          ]
        },
        {
          id: 'tmpl_2',
          name: 'IP Portfolio Summary',
          description: 'Summary of IP portfolio status, values, and key metrics',
          category: 'Portfolio',
          formats: ['pdf', 'excel'],
          parameters: [
            { name: 'portfolio_id', type: 'string', required: true, description: 'Portfolio identifier' },
            { name: 'include_valuations', type: 'boolean', required: false, default: true, description: 'Include patent valuations' }
          ]
        },
        {
          id: 'tmpl_3',
          name: 'Competitor Activity Report',
          description: 'Track competitor patent activities and filing strategies',
          category: 'Competitive Intelligence',
          formats: ['pdf', 'html'],
          parameters: [
            { name: 'competitors', type: 'array', required: true, description: 'List of competitors to track' },
            { name: 'period', type: 'string', required: true, default: 'monthly', description: 'Reporting period' }
          ]
        }
      ];

      const mockAutomations: ReportAutomation[] = [
        {
          id: 'auto_1',
          name: 'Weekly AI Patent Report',
          description: 'Weekly analysis of AI patent landscape',
          status: 'active',
          template_id: 'tmpl_1',
          parameters: {
            technology_area: 'Artificial Intelligence',
            date_range: { start: '2024-01-01', end: 'now' },
            top_assignees: 15
          },
          output_formats: ['pdf', 'html'],
          schedule: {
            enabled: true,
            timezone: 'UTC',
            cron_expression: '0 9 * * 1', // Every Monday at 9 AM
            interval: { value: 1, unit: 'weeks' }
          },
          distribution_list: [
            {
              id: 'dist_1',
              type: 'email',
              recipients: ['team@example.com', 'cto@example.com'],
              enabled: true
            },
            {
              id: 'dist_2',
              type: 'storage',
              storage_path: '/reports/ai-patents/',
              enabled: true
            }
          ],
          owner_id: 'user_1',
          project_id: projectId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_generated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          generation_count: 12
        },
        {
          id: 'auto_2',
          name: 'Monthly Portfolio Review',
          description: 'Monthly IP portfolio status and metrics',
          status: 'active',
          template_id: 'tmpl_2',
          parameters: {
            portfolio_id: 'portfolio_main',
            include_valuations: true
          },
          output_formats: ['pdf', 'excel'],
          schedule: {
            enabled: true,
            timezone: 'UTC',
            cron_expression: '0 10 1 * *', // First day of month at 10 AM
            interval: { value: 1, unit: 'months' }
          },
          distribution_list: [
            {
              id: 'dist_3',
              type: 'email',
              recipients: ['executives@example.com'],
              enabled: true
            }
          ],
          generation_conditions: [
            {
              id: 'cond_1',
              type: 'data_available',
              condition: 'portfolio_updated_in_last_month',
              value: true
            }
          ],
          owner_id: 'user_2',
          project_id: projectId,
          created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          updated_at: new Date().toISOString(),
          last_generated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          generation_count: 6
        }
      ];

      const mockGenerations: ReportGeneration[] = [
        {
          id: 'gen_1',
          automation_id: 'auto_1',
          status: 'completed',
          started_at: new Date(Date.now() - 3600000).toISOString(),
          completed_at: new Date(Date.now() - 1800000).toISOString(),
          output_files: [
            {
              id: 'file_1',
              filename: 'AI_Patent_Report_2024-01-15.pdf',
              format: 'pdf',
              size: 2048576,
              url: '/reports/ai-patents/AI_Patent_Report_2024-01-15.pdf',
              created_at: new Date(Date.now() - 1800000).toISOString()
            },
            {
              id: 'file_2',
              filename: 'AI_Patent_Report_2024-01-15.html',
              format: 'html',
              size: 512000,
              url: '/reports/ai-patents/AI_Patent_Report_2024-01-15.html',
              created_at: new Date(Date.now() - 1800000).toISOString()
            }
          ],
          distribution_status: [
            {
              distribution_id: 'dist_1',
              status: 'sent',
              sent_at: new Date(Date.now() - 1700000).toISOString(),
              recipient_count: 2
            },
            {
              distribution_id: 'dist_2',
              status: 'sent',
              sent_at: new Date(Date.now() - 1600000).toISOString()
            }
          ]
        }
      ];

      const mockStats: AutomationStats = {
        totalAutomations: 8,
        activeAutomations: 6,
        reportsGenerated: 47,
        successRate: 94.5,
        distributionStats: {
          email: 32,
          storage: 28,
          webhook: 12,
          ftp: 5
        },
        popularTemplates: [
          { name: 'Patent Landscape Analysis', usage: 15 },
          { name: 'IP Portfolio Summary', usage: 12 },
          { name: 'Competitor Activity Report', usage: 8 }
        ]
      };

      setTemplates(mockTemplates);
      setAutomations(mockAutomations);
      setGenerations(mockGenerations);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load automation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter automations based on search
  const filteredAutomations = automations.filter(automation =>
    automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    automation.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle automation status
  const toggleAutomationStatus = async (automationId: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === automationId 
        ? { ...automation, status: automation.status === 'active' ? 'paused' : 'active' }
        : automation
    ));
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="text-green-500" size={16} />;
      case 'paused': return <Pause className="text-orange-500" size={16} />;
      case 'completed': return <CheckCircle className="text-blue-500" size={16} />;
      case 'failed': return <AlertCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get schedule description
  const getScheduleDescription = (automation: ReportAutomation) => {
    if (!automation.schedule?.enabled) return 'Manual only';
    
    if (automation.schedule.interval) {
      const { value, unit } = automation.schedule.interval;
      return `Every ${value} ${unit}`;
    }
    
    return 'Custom schedule';
  };

  const renderAutomationsTab = () => (
    <div className="space-y-6">
      {/* Automations Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Report Automations</h3>
          <p className="text-gray-600">Configure automated report generation and distribution</p>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>New Automation</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search automations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {filteredAutomations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="mx-auto mb-4 opacity-50" size={48} />
            <p>No report automations found</p>
            <button
              onClick={() => setShowEditor(true)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Create your first automation
            </button>
          </div>
        ) : (
          filteredAutomations.map((automation) => {
            const template = templates.find(t => t.id === automation.template_id);
            return (
              <div key={automation.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(automation.status)}
                      <h4 className="text-lg font-medium">{automation.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        automation.status === 'active' ? 'bg-green-100 text-green-800' :
                        automation.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {automation.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{automation.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Template:</span>
                        <p className="text-sm text-gray-600">{template?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Schedule:</span>
                        <p className="text-sm text-gray-600">{getScheduleDescription(automation)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Formats:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {automation.output_formats.map(format => (
                            <span key={format} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {format.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <FileText size={14} />
                        <span>{automation.generation_count} reports generated</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Send size={14} />
                        <span>{automation.distribution_list.length} distributions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>
                          Last: {automation.last_generated_at ? 
                            new Date(automation.last_generated_at).toLocaleDateString() : 
                            'Never'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleAutomationStatus(automation.id)}
                      className={`p-2 rounded ${
                        automation.status === 'active' 
                          ? 'text-orange-600 hover:bg-orange-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={automation.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {automation.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={() => setSelectedAutomation(automation)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                      title="Settings"
                    >
                      <Settings size={16} />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      {/* Templates Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Report Templates</h3>
          <p className="text-gray-600">Available report templates for automation</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Plus size={16} />
          <span>Custom Template</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  template.category === 'Analytics' ? 'bg-blue-100 text-blue-600' :
                  template.category === 'Portfolio' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {template.category === 'Analytics' ? <BarChart3 size={20} /> :
                   template.category === 'Portfolio' ? <PieChart size={20} /> :
                   <TrendingUp size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold">{template.name}</h4>
                  <span className="text-sm text-gray-500">{template.category}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Eye size={16} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">{template.description}</p>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Supported Formats:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.formats.map(format => (
                    <span key={format} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {format.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Parameters:</span>
                <p className="text-sm text-gray-600">{template.parameters.length} configurable</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Use Template
              </button>
              <button className="px-3 py-2 text-gray-600 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      {/* History Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Generation History</h3>
          <p className="text-gray-600">Recent report generations and their status</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Download size={16} />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* Generation List */}
      <div className="space-y-4">
        {generations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="mx-auto mb-4 opacity-50" size={48} />
            <p>No report generations found</p>
          </div>
        ) : (
          generations.map((generation) => {
            const automation = automations.find(a => a.id === generation.automation_id);
            return (
              <div key={generation.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(generation.status)}
                    <div>
                      <h4 className="font-medium">{automation?.name || 'Unknown Automation'}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(generation.started_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    generation.status === 'completed' ? 'bg-green-100 text-green-800' :
                    generation.status === 'failed' ? 'bg-red-100 text-red-800' :
                    generation.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {generation.status}
                  </span>
                </div>

                {generation.status === 'completed' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Generated Files</h5>
                      <div className="space-y-2">
                        {generation.output_files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <FileText size={16} className="text-gray-500" />
                              <div>
                                <p className="text-sm font-medium">{file.filename}</p>
                                <p className="text-xs text-gray-500">
                                  {file.format.toUpperCase()} • {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800">
                              <Download size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Distribution Status</h5>
                      <div className="space-y-2">
                        {generation.distribution_status.map((dist, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {dist.status === 'sent' ? 
                                  <CheckCircle size={14} className="text-green-500" /> :
                                  <AlertCircle size={14} className="text-red-500" />
                                }
                                <span className="text-sm">
                                  Distribution {index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {dist.sent_at && new Date(dist.sent_at).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {generation.error_message && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      <strong>Error:</strong> {generation.error_message}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div>
        <h3 className="text-lg font-semibold">Automation Analytics</h3>
        <p className="text-gray-600">Performance insights and usage statistics</p>
      </div>

      {stats && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalAutomations}</div>
              <div className="text-sm text-gray-600">Total Automations</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeAutomations}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.reportsGenerated}</div>
              <div className="text-sm text-gray-600">Reports Generated</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Popular Templates */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Popular Templates</h4>
              <div className="space-y-3">
                {stats.popularTemplates.map((template, index) => (
                  <div key={template.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(template.usage / Math.max(...stats.popularTemplates.map(t => t.usage))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{template.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution Methods */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Distribution Methods</h4>
              <div className="space-y-3">
                {Object.entries(stats.distributionStats).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {method === 'email' ? <Mail size={16} className="text-gray-500" /> :
                       method === 'storage' ? <Database size={16} className="text-gray-500" /> :
                       method === 'webhook' ? <Globe size={16} className="text-gray-500" /> :
                       <Send size={16} className="text-gray-500" />}
                      <span className="capitalize">{method}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(stats.distributionStats))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <FileText className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold">Report Automation</h1>
        </div>
        <p className="text-gray-600">
          Automated report generation, scheduling, and intelligent distribution system
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active</p>
                <p className="text-2xl font-bold">{stats.activeAutomations}</p>
              </div>
              <CheckCircle className="text-blue-200" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Generated</p>
                <p className="text-2xl font-bold">{stats.reportsGenerated}</p>
              </div>
              <FileText className="text-green-200" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
              </div>
              <TrendingUp className="text-orange-200" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <Settings className="text-purple-200" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'automations', name: 'Automations', icon: Settings },
            { id: 'templates', name: 'Templates', icon: FileText },
            { id: 'history', name: 'History', icon: Clock },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          {activeTab === 'automations' && renderAutomationsTab()}
          {activeTab === 'templates' && renderTemplatesTab()}
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      )}
    </div>
  );
}