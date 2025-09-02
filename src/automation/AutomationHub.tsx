// Automation Hub - Central dashboard for all automation features
// Provides unified access to workflows, monitoring, reporting, and task automation

import { useState, useEffect } from 'react';
import {
  Zap,
  Eye,
  FileText,
  CheckSquare,
  Database,
  Settings,
  BarChart3,
  Bell,
  Activity,
  ArrowRight,
  Plus
} from 'lucide-react';

import WorkflowBuilder from '../workflows/WorkflowBuilder';
import PatentMonitoringSystem from './PatentMonitoringSystem';
import ReportAutomationSystem from './ReportAutomationSystem';
import TaskAutomationSystem from './TaskAutomationSystem';
import DataProcessingSystem from './DataProcessingSystem';

interface AutomationHubProps {
  projectId?: string;
  onClose?: () => void;
}

interface AutomationOverview {
  workflows: {
    total: number;
    active: number;
    paused: number;
  };
  monitoring: {
    rules: number;
    alerts: number;
    coverage: string[];
  };
  reports: {
    automations: number;
    generated: number;
    scheduled: number;
  };
  tasks: {
    rules: number;
    automated: number;
    completion_rate: number;
  };
  processing: {
    workflows: number;
    records_processed: number;
    success_rate: number;
  };
  recent_activity: Array<{
    id: string;
    type: 'workflow' | 'alert' | 'report' | 'task' | 'processing';
    title: string;
    description: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error' | 'info';
  }>;
}

type ActiveSection = 'overview' | 'workflows' | 'monitoring' | 'reports' | 'tasks' | 'processing';

export default function AutomationHub({ projectId, onClose }: AutomationHubProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [overview, setOverview] = useState<AutomationOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load automation overview
  useEffect(() => {
    loadAutomationOverview();
  }, [projectId]);

  const loadAutomationOverview = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real implementation, this would come from API
      const mockOverview: AutomationOverview = {
        workflows: {
          total: 24,
          active: 18,
          paused: 6
        },
        monitoring: {
          rules: 12,
          alerts: 8,
          coverage: ['US', 'EP', 'JP', 'CN', 'KR']
        },
        reports: {
          automations: 15,
          generated: 145,
          scheduled: 8
        },
        tasks: {
          rules: 20,
          automated: 342,
          completion_rate: 87.3
        },
        processing: {
          workflows: 9,
          records_processed: 156420,
          success_rate: 94.2
        },
        recent_activity: [
          {
            id: '1',
            type: 'alert',
            title: 'High Priority Patent Alert',
            description: '12 new AI patents detected from key competitors',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            status: 'warning'
          },
          {
            id: '2',
            type: 'report',
            title: 'Weekly Patent Report Generated',
            description: 'AI Technology Landscape Report completed and distributed',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'success'
          },
          {
            id: '3',
            type: 'processing',
            title: 'Patent Data Import Completed',
            description: '5,420 patent records processed successfully',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'success'
          },
          {
            id: '4',
            type: 'task',
            title: 'Task Auto-Assigned',
            description: 'Patent review task assigned to Dr. Sarah Chen',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            status: 'info'
          },
          {
            id: '5',
            type: 'workflow',
            title: 'Workflow Execution Failed',
            description: 'Competitor Analysis workflow failed due to API timeout',
            timestamp: new Date(Date.now() - 21600000).toISOString(),
            status: 'error'
          }
        ]
      };

      setOverview(mockOverview);
    } catch (error) {
      console.error('Failed to load automation overview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get activity icon
  const getActivityIcon = (type: string, status: string) => {
    const iconProps = { size: 16 };
    const statusColor = 
      status === 'success' ? 'text-green-500' :
      status === 'warning' ? 'text-orange-500' :
      status === 'error' ? 'text-red-500' :
      'text-blue-500';

    switch (type) {
      case 'workflow': return <Zap {...iconProps} className={statusColor} />;
      case 'alert': return <Bell {...iconProps} className={statusColor} />;
      case 'report': return <FileText {...iconProps} className={statusColor} />;
      case 'task': return <CheckSquare {...iconProps} className={statusColor} />;
      case 'processing': return <Database {...iconProps} className={statusColor} />;
      default: return <Activity {...iconProps} className={statusColor} />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Automation Hub</h2>
            <p className="text-blue-100">
              Streamline your patent intelligence workflows with powerful automation tools
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{overview?.workflows.active || 0}</div>
            <div className="text-blue-200">Active Workflows</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <Zap className="mx-auto mb-3 text-blue-600" size={32} />
          <div className="text-2xl font-bold text-gray-900">{overview?.workflows.total || 0}</div>
          <div className="text-sm text-gray-600">Total Workflows</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <Eye className="mx-auto mb-3 text-green-600" size={32} />
          <div className="text-2xl font-bold text-gray-900">{overview?.monitoring.rules || 0}</div>
          <div className="text-sm text-gray-600">Monitor Rules</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <FileText className="mx-auto mb-3 text-purple-600" size={32} />
          <div className="text-2xl font-bold text-gray-900">{overview?.reports.generated || 0}</div>
          <div className="text-sm text-gray-600">Reports Generated</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <CheckSquare className="mx-auto mb-3 text-orange-600" size={32} />
          <div className="text-2xl font-bold text-gray-900">{overview?.tasks.automated || 0}</div>
          <div className="text-sm text-gray-600">Tasks Automated</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <Database className="mx-auto mb-3 text-indigo-600" size={32} />
          <div className="text-2xl font-bold text-gray-900">
            {overview ? (overview.processing.records_processed / 1000).toFixed(0) : 0}K
          </div>
          <div className="text-sm text-gray-600">Records Processed</div>
        </div>
      </div>

      {/* Automation Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Workflow Automation */}
        <div 
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveSection('workflows')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="text-blue-600" size={24} />
            </div>
            <ArrowRight className="text-gray-400" size={16} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Workflow Builder</h3>
          <p className="text-gray-600 text-sm mb-4">
            Create and manage custom automation workflows with visual drag-and-drop builder
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600 font-medium">
              {overview?.workflows.active} Active
            </span>
            <span className="text-gray-500">
              {overview?.workflows.total} Total
            </span>
          </div>
        </div>

        {/* Patent Monitoring */}
        <div 
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveSection('monitoring')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="text-green-600" size={24} />
            </div>
            <ArrowRight className="text-gray-400" size={16} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Patent Monitoring</h3>
          <p className="text-gray-600 text-sm mb-4">
            Automated patent tracking, competitor monitoring, and intelligent alerting
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-orange-600 font-medium">
              {overview?.monitoring.alerts} Alerts
            </span>
            <span className="text-gray-500">
              {overview?.monitoring.coverage.length} Jurisdictions
            </span>
          </div>
        </div>

        {/* Report Automation */}
        <div 
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveSection('reports')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="text-purple-600" size={24} />
            </div>
            <ArrowRight className="text-gray-400" size={16} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Report Automation</h3>
          <p className="text-gray-600 text-sm mb-4">
            Scheduled report generation and intelligent distribution system
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-600 font-medium">
              {overview?.reports.scheduled} Scheduled
            </span>
            <span className="text-gray-500">
              {overview?.reports.automations} Automations
            </span>
          </div>
        </div>

        {/* Task Automation */}
        <div 
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveSection('tasks')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="text-orange-600" size={24} />
            </div>
            <ArrowRight className="text-gray-400" size={16} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Task Automation</h3>
          <p className="text-gray-600 text-sm mb-4">
            Intelligent task assignment, approval workflows, and deadline management
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600 font-medium">
              {overview?.tasks.completion_rate}% Success
            </span>
            <span className="text-gray-500">
              {overview?.tasks.rules} Rules
            </span>
          </div>
        </div>

        {/* Data Processing */}
        <div 
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveSection('processing')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Database className="text-indigo-600" size={24} />
            </div>
            <ArrowRight className="text-gray-400" size={16} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Data Processing</h3>
          <p className="text-gray-600 text-sm mb-4">
            Automated data import, validation, and processing workflows
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-600 font-medium">
              {overview?.processing.success_rate}% Success
            </span>
            <span className="text-gray-500">
              {overview?.processing.workflows} Workflows
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Plus className="text-gray-600" size={24} />
            </div>
            <Settings className="text-gray-400" size={16} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveSection('workflows')}
              className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
            >
              Create Workflow
            </button>
            <button 
              onClick={() => setActiveSection('monitoring')}
              className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
            >
              Add Monitor Rule
            </button>
            <button 
              onClick={() => setActiveSection('reports')}
              className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
            >
              Schedule Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {overview?.recent_activity.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'success' ? 'bg-green-100 text-green-800' :
                  activity.status === 'warning' ? 'bg-orange-100 text-orange-800' :
                  activity.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'workflows':
        return <WorkflowBuilder onClose={() => setActiveSection('overview')} />;
      case 'monitoring':
        return <PatentMonitoringSystem projectId={projectId} />;
      case 'reports':
        return <ReportAutomationSystem projectId={projectId} />;
      case 'tasks':
        return <TaskAutomationSystem projectId={projectId} />;
      case 'processing':
        return <DataProcessingSystem projectId={projectId} />;
      default:
        return renderOverview();
    }
  };

  // Navigation items
  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'workflows', name: 'Workflows', icon: Zap },
    { id: 'monitoring', name: 'Monitoring', icon: Eye },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare },
    { id: 'processing', name: 'Processing', icon: Database }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Automation Hub</h2>
              <p className="text-xs text-gray-500">Streamline workflows</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as ActiveSection)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Status Summary */}
        {overview && activeSection === 'overview' && (
          <div className="p-4 border-t border-gray-200 mt-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">System Status</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Workflows</span>
                <span className="font-medium">{overview.workflows.active}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Recent Alerts</span>
                <span className="font-medium">{overview.monitoring.alerts}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.name || 'Automation Hub'}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeSection === 'overview' 
                  ? 'Comprehensive automation dashboard and control center'
                  : `Manage your ${activeSection} automation settings and configurations`
                }
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
}