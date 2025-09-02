import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckSquare,
  FileText,
  MessageSquare,
  Activity,
  Plus,
  Clock,
  User,
  Edit,
  Eye,
  Share2,
  Download,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  UserPlus,
  Calendar as CalendarIcon,
  Star
} from 'lucide-react';
import { InstantUser } from '../lib/instantAuth';
import {
  Team,
  TeamMember,
  TeamProject,
  Task,
  SharedDocument,
  TeamActivity,
  TaskPriority,
  TaskStatus
} from '../types/collaboration';
import HarmonizedCard from './HarmonizedCard';
import { HCLStat, HCLKeyword, HCLAttribute, HCLAction } from './HarmonizedCard';

interface TeamWorkspaceProps {
  currentUser: InstantUser;
}

const TeamWorkspace: React.FC<TeamWorkspaceProps> = ({ currentUser }) => {
  const [activeView, setActiveView] = useState<'overview' | 'projects' | 'tasks' | 'documents' | 'team' | 'activity'>('overview');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [_searchQuery, _setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'assigned' | 'created' | 'overdue'>('all');
  const [showCreateModal, setShowCreateModal] = useState<'team' | 'project' | 'task' | 'document' | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Mock data
  const [teams] = useState<Team[]>([
    {
      id: 'team-1',
      name: 'Patent Innovation Squad',
      description: 'Focused on breakthrough patent applications and IP strategy',
      avatar_url: '/api/placeholder/40/40',
      workspace_id: 'workspace-1',
      created_by: currentUser.id,
      member_count: 8,
      project_count: 5,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'team-2',
      name: 'AI Research Collective',
      description: 'Advanced AI research and patent landscape analysis',
      avatar_url: '/api/placeholder/40/40',
      workspace_id: 'workspace-1',
      created_by: currentUser.id,
      member_count: 12,
      project_count: 8,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: 'member-1',
      team_id: 'team-1',
      user_id: currentUser.id,
      email: currentUser.email,
      display_name: currentUser.displayName,
      role: 'owner',
      permissions: ['read', 'write', 'admin'],
      status: 'active',
      last_active_at: new Date().toISOString(),
      joined_at: new Date().toISOString(),
      tasks_assigned: 12,
      tasks_completed: 8,
      contribution_score: 95,
    },
    {
      id: 'member-2',
      team_id: 'team-1',
      user_id: 'user-2',
      email: 'sarah@innospot.com',
      display_name: 'Sarah Chen',
      avatar_url: '/api/placeholder/32/32',
      role: 'admin',
      permissions: ['read', 'write', 'review'],
      status: 'active',
      last_active_at: new Date(Date.now() - 300000).toISOString(),
      joined_at: new Date().toISOString(),
      tasks_assigned: 15,
      tasks_completed: 12,
      contribution_score: 88,
    },
    {
      id: 'member-3',
      team_id: 'team-1',
      user_id: 'user-3',
      email: 'david@innospot.com',
      display_name: 'David Rodriguez',
      avatar_url: '/api/placeholder/32/32',
      role: 'editor',
      permissions: ['read', 'write'],
      status: 'active',
      last_active_at: new Date(Date.now() - 600000).toISOString(),
      joined_at: new Date().toISOString(),
      tasks_assigned: 8,
      tasks_completed: 6,
      contribution_score: 76,
    },
  ]);

  const [projects] = useState<TeamProject[]>([
    {
      id: 'project-1',
      team_id: 'team-1',
      name: 'Quantum Computing Patent Portfolio',
      description: 'Comprehensive patent analysis for quantum computing innovations',
      status: 'active',
      progress: 75,
      priority: 'high',
      deadline: '2025-09-15',
      created_by: currentUser.id,
      assigned_members: ['member-1', 'member-2', 'member-3'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'project-2',
      team_id: 'team-1',
      name: 'AI Ethics Framework Documentation',
      description: 'Developing ethical guidelines for AI patent applications',
      status: 'active',
      progress: 45,
      priority: 'medium',
      deadline: '2025-10-30',
      created_by: 'member-2',
      assigned_members: ['member-1', 'member-2'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [tasks] = useState<Task[]>([
    {
      id: 'task-1',
      project_id: 'project-1',
      title: 'Prior Art Analysis - Quantum Algorithms',
      description: 'Research and analyze existing patents in quantum algorithm space',
      status: 'in_progress',
      priority: 'high',
      assigned_to: 'member-2',
      created_by: currentUser.id,
      due_date: '2025-08-20',
      estimated_hours: 16,
      actual_hours: 8,
      tags: ['research', 'quantum', 'analysis'],
      dependencies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'task-2',
      project_id: 'project-1',
      title: 'Patent Claim Drafting',
      description: 'Draft initial patent claims for quantum error correction method',
      status: 'todo',
      priority: 'high',
      assigned_to: 'member-3',
      created_by: currentUser.id,
      due_date: '2025-08-25',
      estimated_hours: 12,
      tags: ['drafting', 'claims', 'quantum'],
      dependencies: ['task-1'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'task-3',
      project_id: 'project-2',
      title: 'Literature Review - AI Ethics',
      description: 'Comprehensive review of AI ethics literature and frameworks',
      status: 'review',
      priority: 'medium',
      assigned_to: currentUser.id,
      created_by: 'member-2',
      due_date: '2025-08-18',
      estimated_hours: 20,
      actual_hours: 18,
      tags: ['research', 'ethics', 'ai'],
      dependencies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [documents] = useState<SharedDocument[]>([
    {
      id: 'doc-1',
      project_id: 'project-1',
      title: 'Quantum Computing Patent Strategy v2.1',
      content: { type: 'document', sections: ['Introduction', 'Technical Analysis', 'Claims Strategy'] },
      version: 2,
      locked_by: 'member-2',
      locked_at: new Date().toISOString(),
      created_by: currentUser.id,
      last_modified_by: 'member-2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'doc-2',
      project_id: 'project-2',
      title: 'AI Ethics Guidelines Draft',
      content: { type: 'document', sections: ['Framework', 'Guidelines', 'Implementation'] },
      version: 1,
      created_by: 'member-2',
      last_modified_by: 'member-2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [activities] = useState<TeamActivity[]>([
    {
      id: 'activity-1',
      team_id: 'team-1',
      user_id: 'member-2',
      activity_type: 'task_completed',
      title: 'Completed Prior Art Research',
      description: 'Sarah completed the quantum algorithm prior art analysis',
      metadata: { task_id: 'task-1', project_id: 'project-1' },
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'activity-2',
      team_id: 'team-1',
      user_id: currentUser.id,
      activity_type: 'document_shared',
      title: 'Shared Patent Strategy Document',
      description: 'Updated the quantum computing patent strategy document',
      metadata: { document_id: 'doc-1', project_id: 'project-1' },
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'activity-3',
      team_id: 'team-1',
      user_id: 'member-3',
      activity_type: 'member_joined',
      title: 'David joined the team',
      description: 'David Rodriguez joined the Patent Innovation Squad',
      metadata: { member_id: 'member-3' },
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  // Simulate real-time presence
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(['member-1', 'member-2', Math.random() > 0.5 ? 'member-3' : ''].filter(Boolean));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // const getCurrentTeam = () => teams.find(t => t.id === selectedTeam) || teams[0];
  const getCurrentMembers = () => teamMembers.filter(m => m.team_id === (selectedTeam || teams[0]?.id));
  const getCurrentProjects = () => projects.filter(p => p.team_id === (selectedTeam || teams[0]?.id));
  const getCurrentTasks = () => {
    const teamProjects = getCurrentProjects();
    return tasks.filter(t => teamProjects.some(p => p.id === t.project_id));
  };

  const getFilteredTasks = () => {
    const teamTasks = getCurrentTasks();
    switch (taskFilter) {
      case 'assigned':
        return teamTasks.filter(t => t.assigned_to === currentUser.id);
      case 'created':
        return teamTasks.filter(t => t.created_by === currentUser.id);
      case 'overdue':
        return teamTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done');
      default:
        return teamTasks;
    }
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case 'done': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'review': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const isUserOnline = (userId: string): boolean => onlineUsers.includes(userId);

  const renderOverview = () => {
    // const _team = getCurrentTeam();
    const members = getCurrentMembers();
    const teamProjects = getCurrentProjects();
    const teamTasks = getCurrentTasks();

    const completedTasks = teamTasks.filter(t => t.status === 'done').length;
    const overdueTasks = teamTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length;
    const avgProgress = teamProjects.reduce((sum, p) => sum + p.progress, 0) / teamProjects.length || 0;

    return (
      <div className="space-y-6">
        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <HarmonizedCard
            title="Active Projects"
            description="Currently running projects"
            stats={[
              { label: "Total", value: teamProjects.length, icon: Target, color: "text-blue-600" },
              { label: "Avg Progress", value: `${Math.round(avgProgress)}%`, icon: TrendingUp, color: "text-green-600" }
            ]}
            colorAccent="#3b82f6"
          />
          <HarmonizedCard
            title="Team Tasks"
            description="Task completion status"
            stats={[
              { label: "Completed", value: completedTasks, icon: CheckCircle, color: "text-green-600" },
              { label: "Overdue", value: overdueTasks, icon: AlertCircle, color: "text-red-600" }
            ]}
            colorAccent="#10b981"
          />
          <HarmonizedCard
            title="Team Members"
            description="Active team collaboration"
            stats={[
              { label: "Total", value: members.length, icon: Users, color: "text-purple-600" },
              { label: "Online", value: members.filter(m => isUserOnline(m.user_id)).length, icon: Activity, color: "text-green-600" }
            ]}
            colorAccent="#8b5cf6"
          />
          <HarmonizedCard
            title="Documents"
            description="Shared team documents"
            stats={[
              { label: "Shared", value: documents.length, icon: FileText, color: "text-orange-600" },
              { label: "Active", value: documents.filter(d => d.locked_by).length, icon: Edit, color: "text-blue-600" }
            ]}
            colorAccent="#f59e0b"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => {
                const member = members.find(m => m.user_id === activity.user_id);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{member?.display_name || 'Unknown User'}</span>{' '}
                        {activity.title.toLowerCase()}
                      </p>
                      {activity.description && (
                        <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Online Team Members */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members ({members.filter(m => isUserOnline(m.user_id)).length} online)
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.display_name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    {isUserOnline(member.user_id) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.display_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{member.contribution_score}% contribution</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(member.contribution_score / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    const teamProjects = getCurrentProjects();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Team Projects</h2>
          <button
            onClick={() => setShowCreateModal('project')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teamProjects.map((project) => {
            const projectTasks = tasks.filter(t => t.project_id === project.id);
            const completedTasks = projectTasks.filter(t => t.status === 'done').length;
            const assignedMembers = teamMembers.filter(m => project.assigned_members.includes(m.id));

            const stats: HCLStat[] = [
              { label: "Progress", value: `${project.progress}%`, icon: TrendingUp, color: "text-green-600" },
              { label: "Tasks", value: `${completedTasks}/${projectTasks.length}`, icon: CheckSquare, color: "text-blue-600" },
              { label: "Members", value: assignedMembers.length, icon: Users, color: "text-purple-600" }
            ];

            const keywords: HCLKeyword[] = [
              { label: project.status, color: project.status === 'active' ? 'green' : 'gray' },
              { label: project.priority, color: project.priority === 'high' ? 'red' : project.priority === 'medium' ? 'yellow' : 'blue' }
            ];

            const attributes: HCLAttribute[] = [
              { label: "Deadline", value: project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set', icon: CalendarIcon },
              { label: "Created", value: new Date(project.created_at).toLocaleDateString(), icon: Clock }
            ];

            const actions: HCLAction[] = [
              { id: 'view', label: 'View', icon: Eye, onClick: () => {}, isPrimary: true, variant: 'primary' },
              { id: 'edit', label: 'Edit', icon: Edit, onClick: () => {} },
              { id: 'share', label: 'Share', icon: Share2, onClick: () => {} }
            ];

            return (
              <HarmonizedCard
                key={project.id}
                title={project.name}
                description={project.description || ''}
                stats={stats}
                keywords={keywords}
                attributes={attributes}
                actions={actions}
                colorAccent={project.priority === 'high' ? '#ef4444' : project.priority === 'medium' ? '#f59e0b' : '#3b82f6'}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderTasks = () => {
    const filteredTasks = getFilteredTasks();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Team Tasks</h2>
          <div className="flex items-center gap-4">
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="assigned">Assigned to Me</option>
              <option value="created">Created by Me</option>
              <option value="overdue">Overdue</option>
            </select>
            <button
              onClick={() => setShowCreateModal('task')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Task</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Assigned</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.map((task) => {
                  const project = projects.find(p => p.id === task.project_id);
                  const assignee = teamMembers.find(m => m.user_id === task.assigned_to);
                  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

                  return (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                          )}
                          {task.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {task.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">{project?.name}</span>
                      </td>
                      <td className="py-4 px-4">
                        {assignee && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              {assignee.avatar_url ? (
                                <img src={assignee.avatar_url} alt={assignee.display_name} className="w-6 h-6 rounded-full" />
                              ) : (
                                <User className="w-3 h-3 text-blue-600" />
                              )}
                            </div>
                            <span className="text-sm text-gray-900">{assignee.display_name}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)} bg-gray-100`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)} bg-gray-100`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {task.due_date && (
                          <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                            {new Date(task.due_date).toLocaleDateString()}
                            {isOverdue && (
                              <span className="ml-1 text-red-500">
                                (Overdue)
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderDocuments = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Shared Documents</h2>
          <button
            onClick={() => setShowCreateModal('document')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Document
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {documents.map((doc) => {
            const project = projects.find(p => p.id === doc.project_id);
            const lockedBy = doc.locked_by ? teamMembers.find(m => m.user_id === doc.locked_by) : null;

            const stats: HCLStat[] = [
              { label: "Version", value: `v${doc.version}`, icon: FileText, color: "text-blue-600" },
              { label: "Modified", value: new Date(doc.updated_at).toLocaleDateString(), icon: Clock, color: "text-gray-600" }
            ];

            const keywords: HCLKeyword[] = [
              { label: project?.name || 'No Project', color: 'blue' },
              ...(doc.locked_by ? [{ label: 'Locked', color: 'red' as const }] : [{ label: 'Available', color: 'green' as const }])
            ];

            const attributes: HCLAttribute[] = [
              { label: "Created by", value: teamMembers.find(m => m.user_id === doc.created_by)?.display_name || 'Unknown', icon: User },
              ...(lockedBy ? [{ label: "Locked by", value: lockedBy.display_name, icon: Edit }] : [])
            ];

            const actions: HCLAction[] = [
              { id: 'view', label: 'View', icon: Eye, onClick: () => {}, isPrimary: true, variant: 'primary' },
              { id: 'edit', label: 'Edit', icon: Edit, onClick: () => {}, isPrimary: !doc.locked_by },
              { id: 'download', label: 'Download', icon: Download, onClick: () => {} },
              { id: 'share', label: 'Share', icon: Share2, onClick: () => {} }
            ];

            return (
              <HarmonizedCard
                key={doc.id}
                title={doc.title}
                description={`${Object.keys(doc.content).length} sections • Version ${doc.version}`}
                stats={stats}
                keywords={keywords}
                attributes={attributes}
                actions={actions}
                colorAccent={doc.locked_by ? '#ef4444' : '#10b981'}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 -m-6">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Workspace</h1>
              <p className="text-gray-600 mt-1">Collaborate with your team on patent innovation projects</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Team Selector */}
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCreateModal('team')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Invite Members
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'projects', label: 'Projects', icon: Target },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'activity', label: 'Activity', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-1 py-2 border-b-2 text-sm font-medium transition-colors ${
                  activeView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'projects' && renderProjects()}
        {activeView === 'tasks' && renderTasks()}
        {activeView === 'documents' && renderDocuments()}
        {activeView === 'team' && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Team Management</h3>
            <p className="text-gray-600">Detailed team management interface coming soon</p>
          </div>
        )}
        {activeView === 'activity' && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Activity Feed</h3>
            <p className="text-gray-600">Detailed activity timeline coming soon</p>
          </div>
        )}
      </div>

      {/* Create Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New {showCreateModal.charAt(0).toUpperCase() + showCreateModal.slice(1)}
              </h3>
              <button
                onClick={() => setShowCreateModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 text-center py-8">
              {showCreateModal.charAt(0).toUpperCase() + showCreateModal.slice(1)} creation interface will be implemented here
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(null)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(null)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamWorkspace;