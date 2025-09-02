// Task Automation System - Automated task management and workflow orchestration
// Provides intelligent task assignment, approval workflows, and deadline management

import { useState, useEffect } from 'react';
import {
  CheckSquare,
  Users,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Plus,
  Filter,
  Calendar,
  User,
  Send,
  Eye,
  Edit,
  TrendingUp,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import {
  TaskAutomationRule
} from '../types/automation';

interface TaskAutomationSystemProps {
  projectId?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee_id?: string;
  assignee_name?: string;
  created_by: string;
  created_at: string;
  due_date?: string;
  completed_at?: string;
  tags: string[];
  automation_rule_id?: string;
}

interface AutomationStats {
  totalRules: number;
  activeRules: number;
  tasksAutomated: number;
  averageAssignmentTime: number;
  escalationRate: number;
  completionRate: number;
  tasksByStatus: Record<string, number>;
  assignmentMethods: Record<string, number>;
}

export default function TaskAutomationSystem({ projectId }: TaskAutomationSystemProps) {
  const [rules, setRules] = useState<TaskAutomationRule[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [_selectedRule, setSelectedRule] = useState<TaskAutomationRule | null>(null);
  const [_showRuleEditor, setShowRuleEditor] = useState(false);
  const [activeTab, setActiveTab] = useState<'rules' | 'tasks' | 'analytics' | 'approvals'>('rules');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused'>('all');

  // Load automation data
  useEffect(() => {
    loadAutomationData();
  }, [projectId]);

  const loadAutomationData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real implementation, this would come from API
      const mockRules: TaskAutomationRule[] = [
        {
          id: 'rule_1',
          name: 'Patent Review Assignment',
          description: 'Automatically assign patent reviews to appropriate team members',
          status: 'active',
          trigger_conditions: [
            {
              id: 'trigger_1',
              type: 'task_created',
              parameters: {
                task_type: 'patent_review',
                category: 'technical'
              }
            }
          ],
          actions: [
            {
              id: 'action_1',
              type: 'assign_task',
              parameters: {
                assignment_method: 'expertise_based',
                expertise_required: ['patent_law', 'technical_review']
              }
            },
            {
              id: 'action_2',
              type: 'send_notification',
              parameters: {
                recipients: ['assignee', 'manager'],
                template: 'patent_review_assigned'
              }
            }
          ],
          assignment_rules: [
            {
              id: 'assign_1',
              name: 'Technical Expert Assignment',
              conditions: [
                {
                  field: 'task.category',
                  operator: 'equals',
                  value: 'technical'
                }
              ],
              assignee_selection: {
                type: 'expertise_based',
                parameters: {
                  expertise: ['patent_law', 'technical_review'],
                  workload_balance: true
                }
              },
              priority: 1
            }
          ],
          escalation_settings: {
            enabled: true,
            levels: [
              {
                level: 1,
                delay: 24, // hours
                escalate_to: ['team_lead'],
                notification_template: 'task_overdue_level_1',
                actions: [
                  {
                    id: 'escalate_1',
                    type: 'send_notification',
                    parameters: {
                      recipients: ['team_lead'],
                      urgency: 'high'
                    }
                  }
                ]
              },
              {
                level: 2,
                delay: 48,
                escalate_to: ['manager'],
                notification_template: 'task_overdue_level_2',
                actions: [
                  {
                    id: 'escalate_2',
                    type: 'update_status',
                    parameters: {
                      status: 'escalated',
                      priority: 'critical'
                    }
                  }
                ]
              }
            ],
            max_escalations: 2
          },
          owner_id: 'user_1',
          project_id: projectId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          executions_count: 45
        },
        {
          id: 'rule_2',
          name: 'IP Filing Approval Workflow',
          description: 'Multi-stage approval workflow for IP filing decisions',
          status: 'active',
          trigger_conditions: [
            {
              id: 'trigger_2',
              type: 'approval_required',
              parameters: {
                approval_type: 'ip_filing',
                value_threshold: 10000
              }
            }
          ],
          actions: [
            {
              id: 'action_3',
              type: 'create_subtask',
              parameters: {
                subtask_type: 'approval',
                approvers: ['legal_team', 'budget_manager']
              }
            }
          ],
          owner_id: 'user_2',
          project_id: projectId,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
          executions_count: 23
        }
      ];

      const mockTasks: Task[] = [
        {
          id: 'task_1',
          title: 'Review AI Patent Application US2024001234',
          description: 'Technical review of machine learning patent application for novelty and patentability',
          status: 'in_progress',
          priority: 'high',
          assignee_id: 'user_3',
          assignee_name: 'Dr. Sarah Chen',
          created_by: 'user_1',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          due_date: new Date(Date.now() + 172800000).toISOString(),
          tags: ['patent_review', 'ai', 'technical'],
          automation_rule_id: 'rule_1'
        },
        {
          id: 'task_2',
          title: 'Approve Filing for Blockchain Patent',
          description: 'Budget and strategic approval for blockchain patent filing',
          status: 'pending',
          priority: 'medium',
          created_by: 'user_2',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          due_date: new Date(Date.now() + 259200000).toISOString(),
          tags: ['approval', 'blockchain', 'filing'],
          automation_rule_id: 'rule_2'
        },
        {
          id: 'task_3',
          title: 'Prior Art Search Completion',
          description: 'Complete comprehensive prior art search for IoT patent',
          status: 'assigned',
          priority: 'medium',
          assignee_id: 'user_4',
          assignee_name: 'Mike Johnson',
          created_by: 'user_1',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          due_date: new Date(Date.now() + 345600000).toISOString(),
          tags: ['prior_art', 'iot', 'research']
        }
      ];

      const mockStats: AutomationStats = {
        totalRules: 12,
        activeRules: 9,
        tasksAutomated: 156,
        averageAssignmentTime: 23, // minutes
        escalationRate: 12.5, // percentage
        completionRate: 87.3, // percentage
        tasksByStatus: {
          pending: 8,
          assigned: 15,
          in_progress: 23,
          review: 7,
          completed: 103
        },
        assignmentMethods: {
          expertise_based: 45,
          load_balancing: 32,
          round_robin: 28,
          manual: 12
        }
      };

      setRules(mockRules);
      setTasks(mockTasks);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load automation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter rules based on search and status
  const filteredRules = rules.filter(rule => {
    const matchesSearch = searchTerm === '' || 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || rule.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Toggle rule status
  const toggleRuleStatus = async (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
        : rule
    ));
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'assigned': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="text-green-500" size={16} />;
      case 'paused': return <Pause className="text-orange-500" size={16} />;
      case 'completed': return <CheckSquare className="text-green-500" size={16} />;
      case 'in_progress': return <Clock className="text-blue-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const renderRulesTab = () => (
    <div className="space-y-6">
      {/* Rules Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Automation Rules</h3>
          <p className="text-gray-600">Configure automated task assignment and workflow rules</p>
        </div>
        <button
          onClick={() => setShowRuleEditor(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>New Rule</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckSquare className="mx-auto mb-4 opacity-50" size={48} />
            <p>No automation rules found</p>
            <button
              onClick={() => setShowRuleEditor(true)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Create your first rule
            </button>
          </div>
        ) : (
          filteredRules.map((rule) => (
            <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(rule.status)}
                    <h4 className="text-lg font-medium">{rule.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rule.status === 'active' ? 'bg-green-100 text-green-800' :
                      rule.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{rule.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Triggers:</span>
                      <p className="text-sm text-gray-600">
                        {rule.trigger_conditions.length} condition{rule.trigger_conditions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Actions:</span>
                      <p className="text-sm text-gray-600">
                        {rule.actions.length} action{rule.actions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Escalation:</span>
                      <p className="text-sm text-gray-600">
                        {rule.escalation_settings?.enabled ? 
                          `${rule.escalation_settings.levels.length} level${rule.escalation_settings.levels.length !== 1 ? 's' : ''}` :
                          'Disabled'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Zap size={14} />
                      <span>{rule.executions_count} executions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>Created {new Date(rule.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={`p-2 rounded ${
                      rule.status === 'active' 
                        ? 'text-orange-600 hover:bg-orange-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={rule.status === 'active' ? 'Pause' : 'Activate'}
                  >
                    {rule.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={() => setSelectedRule(rule)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                    title="Settings"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="space-y-6">
      {/* Tasks Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Automated Tasks</h3>
          <p className="text-gray-600">Tasks created and managed by automation rules</p>
        </div>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Tasks</option>
            <option>My Tasks</option>
            <option>Overdue</option>
            <option>High Priority</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckSquare className="mx-auto mb-4 opacity-50" size={48} />
            <p>No automated tasks found</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </div>
                    {task.automation_rule_id && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        AUTOMATED
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-lg font-medium mb-2">{task.title}</h4>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Assignee:</span>
                      <p className="text-sm text-gray-600">
                        {task.assignee_name || 'Unassigned'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Due Date:</span>
                      <p className="text-sm text-gray-600">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <User size={14} />
                      <span>Created by {task.created_by}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>{new Date(task.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                    title="View Task"
                  >
                    <Eye size={16} />
                  </button>
                  {task.assignee_id && (
                    <button
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      title="Message Assignee"
                    >
                      <Send size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderApprovalsTab = () => (
    <div className="space-y-6">
      {/* Approvals Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Approval Workflows</h3>
          <p className="text-gray-600">Manage multi-stage approval processes</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Plus size={16} />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Pending Approvals</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-orange-600" size={20} />
              </div>
              <div>
                <h5 className="font-medium">IP Filing Budget Approval</h5>
                <p className="text-sm text-gray-600">Blockchain patent filing - $15,000</p>
                <p className="text-xs text-gray-500">Waiting for budget manager approval</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Approve
              </button>
              <button className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Reject
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckSquare className="text-blue-600" size={20} />
              </div>
              <div>
                <h5 className="font-medium">Patent Strategy Review</h5>
                <p className="text-sm text-gray-600">Q1 2024 patent portfolio strategy</p>
                <p className="text-xs text-gray-500">Requires legal team approval</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Approve
              </button>
              <button className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Approval History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Recent Approvals</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">AI Patent Filing Approved</span>
              <span className="text-sm text-gray-500">by John Manager</span>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-medium">Budget Request Rejected</span>
              <span className="text-sm text-gray-500">by Budget Team</span>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Contract Review Approved</span>
              <span className="text-sm text-gray-500">by Legal Team</span>
            </div>
            <span className="text-sm text-gray-500">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div>
        <h3 className="text-lg font-semibold">Task Automation Analytics</h3>
        <p className="text-gray-600">Performance insights and automation effectiveness</p>
      </div>

      {stats && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalRules}</div>
              <div className="text-sm text-gray-600">Total Rules</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.tasksAutomated}</div>
              <div className="text-sm text-gray-600">Tasks Automated</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.averageAssignmentTime}m</div>
              <div className="text-sm text-gray-600">Avg Assignment Time</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.completionRate}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Tasks by Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Tasks by Status</h4>
              <div className="space-y-3">
                {Object.entries(stats.tasksByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'in_progress' ? 'bg-blue-500' :
                        status === 'assigned' ? 'bg-purple-500' :
                        status === 'pending' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="capitalize">{status.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(stats.tasksByStatus))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignment Methods */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Assignment Methods</h4>
              <div className="space-y-3">
                {Object.entries(stats.assignmentMethods).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <span className="capitalize">{method.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(stats.assignmentMethods))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Escalation Rate</h4>
                <AlertTriangle className="text-orange-500" size={20} />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.escalationRate}%</div>
              <p className="text-sm text-gray-600">Tasks requiring escalation</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Active Rules</h4>
                <Target className="text-green-500" size={20} />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeRules}</div>
              <p className="text-sm text-gray-600">Currently running</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Efficiency</h4>
                <TrendingUp className="text-blue-500" size={20} />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round((stats.completionRate * stats.tasksAutomated) / 100)}
              </div>
              <p className="text-sm text-gray-600">Successful automations</p>
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
          <CheckSquare className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold">Task Automation</h1>
        </div>
        <p className="text-gray-600">
          Intelligent task assignment, approval workflows, and deadline management system
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active Rules</p>
                <p className="text-2xl font-bold">{stats.activeRules}</p>
              </div>
              <Play className="text-blue-200" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Automated</p>
                <p className="text-2xl font-bold">{stats.tasksAutomated}</p>
              </div>
              <Zap className="text-green-200" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Avg Time</p>
                <p className="text-2xl font-bold">{stats.averageAssignmentTime}m</p>
              </div>
              <Clock className="text-orange-200" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Success Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
              <TrendingUp className="text-purple-200" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'rules', name: 'Automation Rules', icon: Settings },
            { id: 'tasks', name: 'Tasks', icon: CheckSquare },
            { id: 'approvals', name: 'Approvals', icon: Users },
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
          {activeTab === 'rules' && renderRulesTab()}
          {activeTab === 'tasks' && renderTasksTab()}
          {activeTab === 'approvals' && renderApprovalsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      )}
    </div>
  );
}