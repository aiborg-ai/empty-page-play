import React, { useState, useEffect } from 'react';
import {
  FileText,
  Users,
  Calendar,
  MessageSquare,
  Share2,
  Download,
  Edit3,
  Clock,
  CheckCircle,
  Plus,
  Search,
  BookOpen,
  Award,
  Target,
  GitBranch,
  Eye,
  Copy,
  ExternalLink,
  X
} from 'lucide-react';
import { InstantAuthService } from '../lib/instantAuth';
import type { NetworkContact } from '../types/network';

interface CollaborationProject {
  id: string;
  title: string;
  description: string;
  type: 'patent_application' | 'research' | 'prior_art' | 'licensing' | 'litigation';
  status: 'planning' | 'active' | 'review' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  deadline?: string;
  progress: number;
  
  // Team
  lead_id: string;
  collaborators: string[];
  invited_contacts: string[];
  
  // Patent Details
  patent_number?: string;
  application_number?: string;
  technology_area: string;
  invention_category: string;
  
  // Documents and Assets
  documents: ProjectDocument[];
  references: PatentReference[];
  tasks: ProjectTask[];
  
  // Collaboration Features
  shared_workspace_id?: string;
  chat_channel_id?: string;
  version_history: VersionHistory[];
  access_level: 'public' | 'team' | 'private';
}

interface ProjectDocument {
  id: string;
  name: string;
  type: 'patent_draft' | 'prior_art' | 'research_note' | 'claim_set' | 'drawing' | 'presentation';
  url: string;
  size: number;
  uploaded_by: string;
  uploaded_at: string;
  version: number;
  is_current: boolean;
}

interface PatentReference {
  patent_number: string;
  title: string;
  assignee: string;
  publication_date: string;
  relevance_score: number;
  notes?: string;
  added_by: string;
}

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  completed_at?: string;
}

interface VersionHistory {
  id: string;
  version: string;
  description: string;
  author: string;
  timestamp: string;
  changes: string[];
}

interface CollaborationWorkspaceProps {
  contacts: NetworkContact[];
  _onProjectSelect?: (project: CollaborationProject) => void;
}

const CollaborationWorkspace: React.FC<CollaborationWorkspaceProps> = ({ 
  contacts 
}) => {
  const [projects, setProjects] = useState<CollaborationProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<CollaborationProject | null>(null);
  const [view, setView] = useState<'overview' | 'documents' | 'tasks' | 'team' | 'chat'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    
    try {
      // Generate mock collaboration projects
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) return;

      const mockProjects: CollaborationProject[] = [
        {
          id: 'proj_1',
          title: 'AI-Powered Drug Discovery Platform',
          description: 'Patent application for a novel machine learning system that accelerates pharmaceutical compound discovery using quantum-enhanced algorithms.',
          type: 'patent_application',
          status: 'active',
          priority: 'high',
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 65,
          lead_id: currentUser.id,
          collaborators: ['contact_1', 'contact_2', 'contact_3'],
          invited_contacts: ['contact_4'],
          technology_area: 'Artificial Intelligence',
          invention_category: 'Computer Technology',
          documents: [
            {
              id: 'doc_1',
              name: 'Patent Application Draft v3.2',
              type: 'patent_draft',
              url: '/documents/ai-drug-discovery-draft.pdf',
              size: 2456789,
              uploaded_by: currentUser.id,
              uploaded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              version: 3,
              is_current: true
            },
            {
              id: 'doc_2',
              name: 'Prior Art Analysis Report',
              type: 'prior_art',
              url: '/documents/prior-art-analysis.pdf',
              size: 1234567,
              uploaded_by: 'contact_1',
              uploaded_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              version: 2,
              is_current: true
            }
          ],
          references: [
            {
              patent_number: 'US10,123,456',
              title: 'Machine Learning for Drug Discovery',
              assignee: 'BigPharma Corp',
              publication_date: '2020-03-15',
              relevance_score: 85,
              notes: 'Similar ML approach but lacks quantum enhancement',
              added_by: 'contact_1'
            }
          ],
          tasks: [
            {
              id: 'task_1',
              title: 'Review quantum algorithm claims',
              description: 'Ensure claims properly differentiate from prior art',
              assigned_to: 'contact_2',
              status: 'in_progress',
              priority: 'high',
              due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          version_history: [
            {
              id: 'ver_1',
              version: 'v3.2',
              description: 'Updated claims section based on examiner feedback',
              author: currentUser.displayName,
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              changes: ['Added claim 15-18', 'Modified claim 3', 'Updated background section']
            }
          ],
          access_level: 'team'
        },
        {
          id: 'proj_2',
          title: 'Quantum-Resistant Blockchain Security',
          description: 'Research collaboration on developing blockchain protocols resistant to quantum computing attacks.',
          type: 'research',
          status: 'planning',
          priority: 'medium',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 25,
          lead_id: 'contact_5',
          collaborators: [currentUser.id, 'contact_6'],
          invited_contacts: [],
          technology_area: 'Cryptography',
          invention_category: 'Computer Technology',
          documents: [],
          references: [],
          tasks: [],
          version_history: [],
          access_level: 'team'
        }
      ];

      setProjects(mockProjects);
      if (mockProjects.length > 0) {
        setSelectedProject(mockProjects[0]);
      }
      
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: CollaborationProject['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: CollaborationProject['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId || c.contact_user_id === contactId);
    return contact?.display_name || 'Unknown User';
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.technology_area.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl p-6">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Project List Sidebar */}
      <div className="w-80 bg-white rounded-xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-purple-600" />
              Collaboration Projects
            </h2>
            <button
              onClick={() => console.log('Create new project')}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
        
        {/* Project List */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedProject?.id === project.id
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 text-sm leading-tight">
                  {project.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  <span>{project.collaborators.length + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className={`w-3 h-3 ${getPriorityColor(project.priority)}`} />
                  <span>{project.progress}%</span>
                </div>
              </div>
              
              {project.deadline && (
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Due {formatDate(project.deadline)}</span>
                </div>
              )}
            </div>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">No projects found</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content Area */}
      {selectedProject ? (
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
          {/* Project Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl font-bold text-gray-900">{selectedProject.title}</h1>
                  <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                  <span className={`text-sm font-medium ${getPriorityColor(selectedProject.priority)}`}>
                    {selectedProject.priority} priority
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{selectedProject.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{selectedProject.technology_area}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(selectedProject.created_at)}</span>
                  </div>
                  {selectedProject.deadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Due {formatDate(selectedProject.deadline)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{selectedProject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${selectedProject.progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-6 border-b">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'tasks', label: 'Tasks', icon: CheckCircle },
                { id: 'team', label: 'Team', icon: Users },
                { id: 'chat', label: 'Chat', icon: MessageSquare }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                    view === tab.id
                      ? 'border-purple-500 text-purple-600'
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
          <div className="flex-1 overflow-auto p-6">
            {view === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <FileText className="w-4 h-4" />
                      Documents
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProject.documents.length}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <CheckCircle className="w-4 h-4" />
                      Tasks
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProject.tasks.length}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Users className="w-4 h-4" />
                      Team Size
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProject.collaborators.length + 1}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <BookOpen className="w-4 h-4" />
                      References
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProject.references.length}</div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {selectedProject.version_history.map(version => (
                      <div key={version.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <GitBranch className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{version.version}</span>
                            <span className="text-sm text-gray-500">by {version.author}</span>
                            <span className="text-sm text-gray-500">{formatDate(version.timestamp)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{version.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {version.changes.map((change, index) => (
                              <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {change}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {view === 'documents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Project Documents</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <Plus className="w-4 h-4" />
                    Upload Document
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedProject.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          {doc.is_current && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Current</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>v{doc.version}</span>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>by {getContactName(doc.uploaded_by)}</span>
                          <span>{formatDate(doc.uploaded_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {selectedProject.documents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>No documents uploaded yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {view === 'team' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Project Team</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <Plus className="w-4 h-4" />
                    Invite Member
                  </button>
                </div>
                
                {/* Team Members */}
                <div className="space-y-3">
                  {[selectedProject.lead_id, ...selectedProject.collaborators].map(memberId => (
                    <div key={memberId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {getContactName(memberId).split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{getContactName(memberId)}</h4>
                        <p className="text-sm text-gray-600">
                          {memberId === selectedProject.lead_id ? 'Project Lead' : 'Collaborator'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Project</h3>
            <p className="text-gray-600">Choose a collaboration project to view details</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationWorkspace;