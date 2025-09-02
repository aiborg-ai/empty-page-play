// Data Processing Automation System - Automated data import, validation, and processing
// Provides comprehensive data pipeline automation with intelligent processing workflows

import { useState, useEffect } from 'react';
import {
  Database,
  Upload,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Play,
  Pause,
  Settings,
  Plus,
  BarChart3,
  Zap,
  Globe,
  HardDrive,
  Mail,
  RefreshCw,
  TrendingUp,
  Activity,
  Target
} from 'lucide-react';
import {
  DataProcessingWorkflow
} from '../types/automation';

interface DataProcessingSystemProps {
  projectId?: string;
}

interface ProcessingJob {
  id: string;
  workflow_id: string;
  workflow_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  records_processed: number;
  records_total: number;
  errors_count: number;
  warnings_count: number;
  processing_time?: number;
  triggered_by: string;
}

interface ProcessingStats {
  totalWorkflows: number;
  activeWorkflows: number;
  recordsProcessed: number;
  averageProcessingTime: number;
  errorRate: number;
  successRate: number;
  workflowsByType: Record<string, number>;
  sourceTypes: Record<string, number>;
  recentJobs: ProcessingJob[];
}

export default function DataProcessingSystem({ projectId }: DataProcessingSystemProps) {
  const [workflows, setWorkflows] = useState<DataProcessingWorkflow[]>([]);
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [stats, setStats] = useState<ProcessingStats | null>(null);
  const [_selectedWorkflow, setSelectedWorkflow] = useState<DataProcessingWorkflow | null>(null);
  const [_showWorkflowEditor, setShowWorkflowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflows' | 'jobs' | 'sources' | 'analytics'>('workflows');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load processing data
  useEffect(() => {
    loadProcessingData();
  }, [projectId]);

  const loadProcessingData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real implementation, this would come from API
      const mockWorkflows: DataProcessingWorkflow[] = [
        {
          id: 'workflow_1',
          name: 'Patent Data Import',
          description: 'Import and validate patent data from multiple sources',
          status: 'active',
          pipeline_steps: [
            {
              id: 'step_1',
              name: 'Data Import',
              type: 'import',
              configuration: {
                source_type: 'file_upload',
                supported_formats: ['csv', 'xlsx', 'json'],
                batch_size: 1000
              },
              enabled: true,
              order: 1
            },
            {
              id: 'step_2',
              name: 'Data Validation',
              type: 'validate',
              configuration: {
                validation_rules: ['required_fields', 'format_check', 'duplicate_check'],
                fail_on_error: false
              },
              enabled: true,
              order: 2
            },
            {
              id: 'step_3',
              name: 'Data Enrichment',
              type: 'enrich',
              configuration: {
                enrich_fields: ['technology_category', 'legal_status', 'citations'],
                external_apis: ['patent_office', 'classification_service']
              },
              enabled: true,
              order: 3
            },
            {
              id: 'step_4',
              name: 'Export to Database',
              type: 'export',
              configuration: {
                destination: 'main_database',
                table: 'patents',
                upsert_mode: true
              },
              enabled: true,
              order: 4
            }
          ],
          input_sources: [
            {
              id: 'source_1',
              name: 'File Upload',
              type: 'file_upload',
              configuration: {
                accepted_types: ['csv', 'xlsx', 'json'],
                max_size: '100MB',
                auto_process: true
              },
              enabled: true
            },
            {
              id: 'source_2',
              name: 'Patent Office API',
              type: 'api',
              configuration: {
                endpoint: 'https://api.patentoffice.com/bulk',
                auth_type: 'api_key',
                sync_interval: '24h'
              },
              enabled: true
            }
          ],
          output_config: {
            destinations: [
              {
                id: 'dest_1',
                type: 'database',
                configuration: {
                  connection: 'main_db',
                  table: 'patents',
                  batch_size: 500
                },
                enabled: true
              }
            ],
            format: 'normalized',
            compression: 'gzip'
          },
          validation_rules: [
            {
              id: 'rule_1',
              name: 'Required Fields',
              field: '*',
              rule_type: 'required',
              parameters: {
                required_fields: ['patent_id', 'title', 'applicant', 'publication_date']
              },
              error_action: 'flag'
            },
            {
              id: 'rule_2',
              name: 'Patent ID Format',
              field: 'patent_id',
              rule_type: 'format',
              parameters: {
                pattern: '^[A-Z]{2}[0-9]+$'
              },
              error_action: 'reject'
            }
          ],
          error_handling: {
            max_errors: 100,
            error_threshold: 5, // percentage
            on_error_threshold_exceeded: 'stop',
            error_notification_recipients: ['admin@example.com']
          },
          owner_id: 'user_1',
          project_id: projectId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_executed_at: new Date(Date.now() - 3600000).toISOString(),
          processed_records: 15420
        },
        {
          id: 'workflow_2',
          name: 'Competitor Analysis Data',
          description: 'Process competitor patent filings and market data',
          status: 'active',
          pipeline_steps: [
            {
              id: 'step_5',
              name: 'Competitor Data Fetch',
              type: 'import',
              configuration: {
                source_type: 'api',
                endpoints: ['uspto_api', 'epo_api', 'jpo_api'],
                query_filters: ['competitor_names', 'technology_areas']
              },
              enabled: true,
              order: 1
            },
            {
              id: 'step_6',
              name: 'Market Intelligence',
              type: 'enrich',
              configuration: {
                intelligence_sources: ['market_data', 'financial_data', 'news_analysis'],
                ai_processing: true
              },
              enabled: true,
              order: 2
            }
          ],
          input_sources: [
            {
              id: 'source_3',
              name: 'Market Intelligence API',
              type: 'api',
              configuration: {
                provider: 'market_intel_service',
                refresh_rate: '6h'
              },
              enabled: true
            }
          ],
          output_config: {
            destinations: [
              {
                id: 'dest_2',
                type: 'cloud_storage',
                configuration: {
                  provider: 'aws_s3',
                  bucket: 'competitor-analysis',
                  path_template: '/year/{year}/month/{month}/'
                },
                enabled: true
              }
            ],
            format: 'json',
            encryption: true
          },
          validation_rules: [],
          error_handling: {
            max_errors: 50,
            error_threshold: 10,
            on_error_threshold_exceeded: 'notify',
            error_notification_recipients: ['team@example.com']
          },
          owner_id: 'user_2',
          project_id: projectId,
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          updated_at: new Date().toISOString(),
          last_executed_at: new Date(Date.now() - 7200000).toISOString(),
          processed_records: 8750
        }
      ];

      const mockJobs: ProcessingJob[] = [
        {
          id: 'job_1',
          workflow_id: 'workflow_1',
          workflow_name: 'Patent Data Import',
          status: 'running',
          started_at: new Date(Date.now() - 1800000).toISOString(),
          records_processed: 2450,
          records_total: 5000,
          errors_count: 12,
          warnings_count: 34,
          triggered_by: 'Scheduled'
        },
        {
          id: 'job_2',
          workflow_id: 'workflow_2',
          workflow_name: 'Competitor Analysis Data',
          status: 'completed',
          started_at: new Date(Date.now() - 7200000).toISOString(),
          completed_at: new Date(Date.now() - 5400000).toISOString(),
          records_processed: 1200,
          records_total: 1200,
          errors_count: 3,
          warnings_count: 8,
          processing_time: 1800, // seconds
          triggered_by: 'Manual'
        },
        {
          id: 'job_3',
          workflow_id: 'workflow_1',
          workflow_name: 'Patent Data Import',
          status: 'failed',
          started_at: new Date(Date.now() - 14400000).toISOString(),
          completed_at: new Date(Date.now() - 14100000).toISOString(),
          records_processed: 450,
          records_total: 3000,
          errors_count: 156,
          warnings_count: 23,
          processing_time: 300,
          triggered_by: 'API'
        }
      ];

      const mockStats: ProcessingStats = {
        totalWorkflows: 8,
        activeWorkflows: 6,
        recordsProcessed: 124567,
        averageProcessingTime: 1250, // seconds
        errorRate: 2.3, // percentage
        successRate: 94.2, // percentage
        workflowsByType: {
          import: 4,
          validation: 3,
          enrichment: 2,
          export: 5
        },
        sourceTypes: {
          file_upload: 45,
          api: 32,
          database: 28,
          email: 12,
          ftp: 8
        },
        recentJobs: mockJobs
      };

      setWorkflows(mockWorkflows);
      setJobs(mockJobs);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load processing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter workflows based on search
  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle workflow status
  const toggleWorkflowStatus = async (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' }
        : workflow
    ));
  };

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="text-green-500" size={16} />;
      case 'paused': return <Pause className="text-orange-500" size={16} />;
      case 'completed': return <CheckCircle className="text-green-500" size={16} />;
      case 'failed': return <AlertCircle className="text-red-500" size={16} />;
      case 'running': return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  // Get progress percentage
  const getProgressPercentage = (processed: number, total: number) => {
    return total > 0 ? Math.round((processed / total) * 100) : 0;
  };

  // Format processing time
  const formatProcessingTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const renderWorkflowsTab = () => (
    <div className="space-y-6">
      {/* Workflows Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Processing Workflows</h3>
          <p className="text-gray-600">Configure automated data import and processing pipelines</p>
        </div>
        <button
          onClick={() => setShowWorkflowEditor(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search workflows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Database className="mx-auto mb-4 opacity-50" size={48} />
            <p>No processing workflows found</p>
            <button
              onClick={() => setShowWorkflowEditor(true)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Create your first workflow
            </button>
          </div>
        ) : (
          filteredWorkflows.map((workflow) => (
            <div key={workflow.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(workflow.status)}
                    <h4 className="text-lg font-medium">{workflow.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                      workflow.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{workflow.description}</p>
                  
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Pipeline Steps:</span>
                      <p className="text-sm text-gray-600">{workflow.pipeline_steps.length} steps</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Data Sources:</span>
                      <p className="text-sm text-gray-600">{workflow.input_sources.length} sources</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Validation Rules:</span>
                      <p className="text-sm text-gray-600">{workflow.validation_rules.length} rules</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Records Processed:</span>
                      <p className="text-sm text-gray-600">{workflow.processed_records.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Activity size={14} />
                      <span>
                        Last run: {workflow.last_executed_at ? 
                          new Date(workflow.last_executed_at).toLocaleString() : 
                          'Never'
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target size={14} />
                      <span>Error rate: {workflow.error_handling.error_threshold}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleWorkflowStatus(workflow.id)}
                    className={`p-2 rounded ${
                      workflow.status === 'active' 
                        ? 'text-orange-600 hover:bg-orange-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={workflow.status === 'active' ? 'Pause' : 'Activate'}
                  >
                    {workflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    title="Run Now"
                  >
                    <Zap size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedWorkflow(workflow)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                    title="Settings"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderJobsTab = () => (
    <div className="space-y-6">
      {/* Jobs Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Processing Jobs</h3>
          <p className="text-gray-600">Monitor workflow execution and job history</p>
        </div>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Jobs</option>
            <option>Running</option>
            <option>Completed</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="mx-auto mb-4 opacity-50" size={48} />
            <p>No processing jobs found</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <h4 className="font-medium">{job.workflow_name}</h4>
                    <p className="text-sm text-gray-500">
                      Started {new Date(job.started_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    job.status === 'completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'failed' ? 'bg-red-100 text-red-800' :
                    job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">by {job.triggered_by}</span>
                </div>
              </div>

              {/* Progress Bar for Running Jobs */}
              {job.status === 'running' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-500">
                      {job.records_processed.toLocaleString()} / {job.records_total.toLocaleString()}
                      ({getProgressPercentage(job.records_processed, job.records_total)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${getProgressPercentage(job.records_processed, job.records_total)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {job.records_processed.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Records Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {job.errors_count}
                  </div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {job.warnings_count}
                  </div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatProcessingTime(job.processing_time)}
                  </div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end space-x-2">
                <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                  View Details
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                  Download Logs
                </button>
                {job.status === 'running' && (
                  <button className="px-3 py-1 text-sm text-red-600 hover:text-red-800">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderSourcesTab = () => (
    <div className="space-y-6">
      {/* Sources Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Sources</h3>
          <p className="text-gray-600">Configure and manage data input sources</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Plus size={16} />
          <span>Add Source</span>
        </button>
      </div>

      {/* Source Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <Upload className="mx-auto mb-3 text-blue-600" size={32} />
          <h4 className="font-medium mb-2">File Upload</h4>
          <p className="text-sm text-gray-600">CSV, Excel, JSON files</p>
          <div className="mt-3">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">45 sources</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <Globe className="mx-auto mb-3 text-green-600" size={32} />
          <h4 className="font-medium mb-2">API Endpoints</h4>
          <p className="text-sm text-gray-600">REST APIs, webhooks</p>
          <div className="mt-3">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">32 sources</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <Database className="mx-auto mb-3 text-purple-600" size={32} />
          <h4 className="font-medium mb-2">Database</h4>
          <p className="text-sm text-gray-600">SQL, NoSQL databases</p>
          <div className="mt-3">
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">28 sources</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <Mail className="mx-auto mb-3 text-orange-600" size={32} />
          <h4 className="font-medium mb-2">Email</h4>
          <p className="text-sm text-gray-600">Email attachments</p>
          <div className="mt-3">
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">12 sources</span>
          </div>
        </div>
      </div>

      {/* Recent Sources */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Recent Data Sources</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="text-blue-600" size={20} />
              </div>
              <div>
                <h5 className="font-medium">Patent Data Upload - Q1 2024</h5>
                <p className="text-sm text-gray-600">CSV file • 15,420 records • Processed 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-sm text-green-600">Success</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Globe className="text-green-600" size={20} />
              </div>
              <div>
                <h5 className="font-medium">USPTO API Sync</h5>
                <p className="text-sm text-gray-600">API endpoint • 8,750 records • Scheduled daily</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="text-blue-500" size={16} />
              <span className="text-sm text-blue-600">Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <div>
                <h5 className="font-medium">Market Intelligence Feed</h5>
                <p className="text-sm text-gray-600">API endpoint • Connection failed • Needs attention</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-500" size={16} />
              <span className="text-sm text-red-600">Error</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div>
        <h3 className="text-lg font-semibold">Processing Analytics</h3>
        <p className="text-gray-600">Performance insights and processing statistics</p>
      </div>

      {stats && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalWorkflows}</div>
              <div className="text-sm text-gray-600">Total Workflows</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.recordsProcessed.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Records Processed</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{formatProcessingTime(stats.averageProcessingTime)}</div>
              <div className="text-sm text-gray-600">Avg Processing Time</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Workflow Types */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Workflows by Type</h4>
              <div className="space-y-3">
                {Object.entries(stats.workflowsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(stats.workflowsByType))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Types */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Data Sources</h4>
              <div className="space-y-3">
                {Object.entries(stats.sourceTypes).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {type === 'file_upload' ? <Upload size={16} className="text-gray-500" /> :
                       type === 'api' ? <Globe size={16} className="text-gray-500" /> :
                       type === 'database' ? <Database size={16} className="text-gray-500" /> :
                       type === 'email' ? <Mail size={16} className="text-gray-500" /> :
                       <HardDrive size={16} className="text-gray-500" />}
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(stats.sourceTypes))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Processing Performance */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Active Workflows</h4>
                <Activity className="text-green-500" size={20} />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeWorkflows}</div>
              <p className="text-sm text-gray-600">Currently running</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Error Rate</h4>
                <AlertCircle className="text-red-500" size={20} />
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.errorRate}%</div>
              <p className="text-sm text-gray-600">Processing errors</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Efficiency</h4>
                <TrendingUp className="text-blue-500" size={20} />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round((stats.successRate * stats.recordsProcessed) / 100000)}K
              </div>
              <p className="text-sm text-gray-600">Successful records</p>
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
          <Database className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold">Data Processing Automation</h1>
        </div>
        <p className="text-gray-600">
          Automated data import, validation, processing, and distribution system
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active</p>
                <p className="text-2xl font-bold">{stats.activeWorkflows}</p>
              </div>
              <Play className="text-blue-200" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Processed</p>
                <p className="text-2xl font-bold">{(stats.recordsProcessed / 1000).toFixed(0)}K</p>
              </div>
              <Database className="text-green-200" size={24} />
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
                <p className="text-purple-100">Avg Time</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageProcessingTime / 60)}m</p>
              </div>
              <Clock className="text-purple-200" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'workflows', name: 'Workflows', icon: Settings },
            { id: 'jobs', name: 'Processing Jobs', icon: Activity },
            { id: 'sources', name: 'Data Sources', icon: Upload },
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
          {activeTab === 'workflows' && renderWorkflowsTab()}
          {activeTab === 'jobs' && renderJobsTab()}
          {activeTab === 'sources' && renderSourcesTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      )}
    </div>
  );
}