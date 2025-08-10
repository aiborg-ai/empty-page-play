import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  FolderPlus, 
  Search, 
  Filter,
  Share2,
  Plus,
  Folder,
  FileText,
  Calendar,
  User,
  Users,
  Globe,
  X,
  HelpCircle,
  Sparkles,
  Activity,
  BarChart3,
  Database,
  UserCheck,
  Clock,
  Tag,
  Archive,
  Eye,
  Edit,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Target
} from 'lucide-react';
import { Project, CreateProjectData, ProjectActivity, ProjectAccessLevel, AssetType } from '../types/projects';
import { Project as CMSProject, CreateProjectData as CMSCreateProjectData } from '../types/cms';
import ProjectService from '../lib/projectService';
import { ProjectContextService } from '../lib/projectContext';
import PageHeader from './PageHeader';
import HarmonizedCard, { HCLStat, HCLKeyword, HCLAttribute, HCLAction } from './HarmonizedCard';
import SupabaseProjectManager from './SupabaseProjectManager';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: CreateProjectData) => void;
}

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSetCurrent: (project: Project) => void;
}

interface ProjectsProps {
  onNavigate?: (section: string) => void;
}

interface ProjectCategoryProps {
  title: string;
  projects: Project[];
  onShare: (project: Project) => void;
  onShowDetails: (project: Project) => void;
  onSetCurrent: (project: Project) => void;
  onGenerateAISummary: (project: Project) => void;
  getAccessIcon: (access: ProjectAccessLevel) => JSX.Element;
}

const CreateProjectModal = ({ isOpen, onClose, onSave }: CreateProjectModalProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'settings' | 'collaboration'>('details');
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    accessLevel: 'private',
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
    tags: [],
    color: '#3b82f6'
  });

  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      accessLevel: 'private',
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
      tags: [],
      color: '#3b82f6'
    });
    setActiveTab('details');
    setNewTag('');
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  if (!isOpen) return null;

  const colorOptions = [
    { value: '#3b82f6', name: 'Blue' },
    { value: '#10b981', name: 'Green' },
    { value: '#f59e0b', name: 'Amber' },
    { value: '#ef4444', name: 'Red' },
    { value: '#8b5cf6', name: 'Purple' },
    { value: '#06b6d4', name: 'Cyan' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b bg-slate-700 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Create New Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('collaboration')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'collaboration'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Collaboration
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border-2 border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your project goals and scope"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Color
                </label>
                <div className="flex gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color.value ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add tag..."
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Management</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.autoSaveSearches}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, autoSaveSearches: e.target.checked }
                      })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Auto-save search queries</div>
                      <div className="text-sm text-gray-600">Automatically save search queries as project assets</div>
                    </div>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.autoCreateAssets}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, autoCreateAssets: e.target.checked }
                      })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Auto-create assets from tools</div>
                      <div className="text-sm text-gray-600">Automatically create assets when using analysis tools</div>
                    </div>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowCrossProjectAssets}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, allowCrossProjectAssets: e.target.checked }
                      })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Allow cross-project assets</div>
                      <div className="text-sm text-gray-600">Enable using assets from other projects</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collaboration' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Who can access this project?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accessLevel"
                      value="private"
                      checked={formData.accessLevel === 'private'}
                      onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as ProjectAccessLevel })}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Private: Only you can access
                      </div>
                      <div className="text-sm text-gray-600">Complete control over project and assets</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accessLevel"
                      value="team"
                      checked={formData.accessLevel === 'team'}
                      onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as ProjectAccessLevel })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Team: Invite specific collaborators
                      </div>
                      <div className="text-sm text-gray-600">Share with invited team members only</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accessLevel"
                      value="organization"
                      checked={formData.accessLevel === 'organization'}
                      onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as ProjectAccessLevel })}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Organization: Anyone in your organization
                      </div>
                      <div className="text-sm text-gray-600">All organization members can collaborate</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accessLevel"
                      value="public"
                      checked={formData.accessLevel === 'public'}
                      onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as ProjectAccessLevel })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Public: Discoverable by anyone
                      </div>
                      <div className="text-sm text-gray-600">Visible in public project directory</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!formData.name.trim()}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

const ShareProjectModal = ({ isOpen, onClose, project }: ShareProjectModalProps) => {
  if (!isOpen || !project) return null;

  const shareUrl = `${window.location.origin}/projects/${project.id}`;

  const handleShare = (platform: string) => {
    let url = '';
    const text = `Check out my project: ${project.name}`;
    
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(project.name)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`;
        break;
      default:
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        return;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Share Project</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{project.name}</h4>
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleShare('copy')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Copy className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Copy Link</span>
            </button>

            <button
              onClick={() => handleShare('email')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs font-bold">@</span>
              </div>
              <span className="text-sm font-medium">Share via Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetailsModal = ({ isOpen, onClose, project, onSetCurrent }: ProjectDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'activity' | 'collaborators'>('overview');

  if (!isOpen || !project) return null;

  const getAssetIcon = (type: AssetType) => {
    const icons = {
      'search-query': Search,
      'dataset': Database,
      'dashboard': BarChart3,
      'report': FileText,
      'collection': Folder,
      'claimed-work': UserCheck,
      'network-contact': Users
    };
    const IconComponent = icons[type] || FileText;
    return <IconComponent className="w-4 h-4" />;
  };

  const getActivityIcon = (activity: ProjectActivity) => {
    switch (activity.type) {
      case 'project_created': return <Plus className="w-4 h-4 text-green-500" />;
      case 'asset_added': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'asset_removed': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'search_performed': return <Search className="w-4 h-4 text-purple-500" />;
      case 'dashboard_created': return <BarChart3 className="w-4 h-4 text-indigo-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetCurrent(project)}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Set as Current
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            {[
              { key: 'overview', label: 'Overview', icon: Eye },
              { key: 'assets', label: `Assets (${project.assetCount})`, icon: Folder },
              { key: 'activity', label: 'Activity', icon: Activity },
              { key: 'collaborators', label: `Team (${project.collaboratorCount})`, icon: Users }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Folder className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Assets</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{project.assetCount}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Team</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{project.collaboratorCount}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Activities</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{project.activities.length}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">Last Active</span>
                  </div>
                  <div className="text-sm font-bold text-orange-600">
                    {new Date(project.lastActivity).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {project.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Settings</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto-save searches:</span>
                    <span className={project.settings.autoSaveSearches ? 'text-green-600' : 'text-red-600'}>
                      {project.settings.autoSaveSearches ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto-create assets:</span>
                    <span className={project.settings.autoCreateAssets ? 'text-green-600' : 'text-red-600'}>
                      {project.settings.autoCreateAssets ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-4">
              {project.assets.length === 0 ? (
                <div className="text-center py-12">
                  <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assets yet</h3>
                  <p className="text-gray-600">Assets will appear here as you work on this project</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.assets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        {getAssetIcon(asset.type)}
                        <div>
                          <h4 className="font-medium text-gray-900">{asset.name}</h4>
                          <p className="text-sm text-gray-600">{asset.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(asset.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {project.activities.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                  <p className="text-gray-600">Project activities will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.activities.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="mt-1">
                        {getActivityIcon(activity)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <User className="w-3 h-3" />
                          {activity.performedBy}
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          {new Date(activity.performedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'collaborators' && (
            <div className="space-y-4">
              {project.collaborators.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No collaborators</h3>
                  <p className="text-gray-600">This is a private project</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.collaborators.map((collaborator) => (
                    <div key={collaborator.userId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{collaborator.name}</h4>
                          <p className="text-sm text-gray-600">{collaborator.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        collaborator.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                        collaborator.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        collaborator.role === 'contributor' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {collaborator.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCategory = ({ title, projects, onShare, onShowDetails, onSetCurrent, onGenerateAISummary, getAccessIcon }: ProjectCategoryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project) => {
          const stats: HCLStat[] = [
            {
              label: 'Assets',
              value: project.assetCount,
              icon: Folder,
              color: 'text-blue-500'
            },
            {
              label: 'Members',
              value: project.collaboratorCount,
              icon: Users,
              color: 'text-green-500'
            }
          ];

          const keywords: HCLKeyword[] = project.tags.slice(0, 4).map(tag => ({
            label: tag,
            color: 'gray'
          }));

          const attributes: HCLAttribute[] = [
            {
              label: 'Updated',
              value: new Date(project.updatedAt).toLocaleDateString(),
              icon: Calendar
            },
            {
              label: 'Owner',
              value: project.ownerName,
              icon: User
            },
            {
              label: 'Access',
              value: project.accessLevel,
              icon: getAccessIcon(project.accessLevel).type
            }
          ];

          const actions: HCLAction[] = [
            {
              id: 'set-current',
              label: 'Set Current',
              icon: Target,
              onClick: () => onSetCurrent(project),
              variant: 'primary',
              isPrimary: true
            },
            {
              id: 'ai-summary',
              label: 'AI Summary',
              icon: Sparkles,
              onClick: () => onGenerateAISummary(project)
            },
            {
              id: 'share',
              label: 'Share',
              icon: Share2,
              onClick: () => onShare(project)
            },
            {
              id: 'view',
              label: 'View Details',
              icon: Eye,
              onClick: () => onShowDetails(project)
            },
            {
              id: 'edit',
              label: 'Edit',
              icon: Edit,
              onClick: () => console.log('Edit project', project.id)
            },
            {
              id: 'duplicate',
              label: 'Duplicate',
              icon: Copy,
              onClick: () => console.log('Duplicate project', project.id)
            },
            {
              id: 'archive',
              label: 'Archive',
              icon: Archive,
              onClick: () => console.log('Archive project', project.id),
              variant: 'danger'
            }
          ];

          return (
            <div key={project.id} className="flex-shrink-0 w-80">
              <HarmonizedCard
                title={project.name}
                description={project.description}
                stats={stats}
                keywords={keywords}
                attributes={attributes}
                actions={actions}
                colorAccent={project.color}
                onTitleClick={() => onShowDetails(project)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Projects({ onNavigate }: ProjectsProps = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [, setCMSProjects] = useState<CMSProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Legacy mock data for fallback
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'AI Patent Landscape Analysis',
      description: 'Comprehensive analysis of AI patents across different jurisdictions',
      ownerId: '1',
      ownerName: 'John Doe',
      createdAt: '2025-08-01T00:00:00Z',
      updatedAt: '2025-08-08T00:00:00Z',
      accessLevel: 'team',
      assets: [
        {
          id: 'a1',
          type: 'search-query',
          name: 'AI Patents Search Query',
          description: 'Search query for artificial intelligence patents',
          createdAt: '2025-08-01T10:00:00Z',
          updatedAt: '2025-08-01T10:00:00Z',
          createdBy: 'John Doe',
          metadata: { query: 'artificial intelligence', resultCount: 1247 },
          isSharedFromOtherProject: false,
          tags: ['AI', 'search']
        },
        {
          id: 'a2',
          type: 'dataset',
          name: 'AI Patent Dataset',
          description: 'Dataset of 1247 AI patents',
          createdAt: '2025-08-02T14:30:00Z',
          updatedAt: '2025-08-02T14:30:00Z',
          createdBy: 'John Doe',
          metadata: { recordCount: 1247, source: 'patent_search' },
          isSharedFromOtherProject: false,
          tags: ['AI', 'dataset'],
          size: 2450000
        }
      ],
      assetCount: 2,
      collaborators: [
        {
          userId: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'owner',
          joinedAt: '2025-08-01T00:00:00Z',
          lastActive: '2025-08-08T12:00:00Z',
          permissions: {
            canEdit: true,
            canInvite: true,
            canDelete: true,
            canManageAssets: true
          }
        }
      ],
      collaboratorCount: 1,
      activities: [
        {
          id: 'act1',
          type: 'project_created',
          description: 'Created project "AI Patent Landscape Analysis"',
          performedBy: 'John Doe',
          performedAt: '2025-08-01T00:00:00Z',
          metadata: {},
          projectId: '1'
        }
      ],
      lastActivity: '2025-08-08T12:00:00Z',
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
      tags: ['AI', 'patents', 'analysis'],
      color: '#3b82f6',
      isFavorite: true,
      isArchived: false
    },
    {
      id: '2',
      name: 'Blockchain Innovation Research',
      description: 'Research project on blockchain technology innovations and patent trends',
      ownerId: '2',
      ownerName: 'Alice Smith',
      createdAt: '2025-07-15T00:00:00Z',
      updatedAt: '2025-08-05T00:00:00Z',
      accessLevel: 'team',
      assets: [
        {
          id: 'a3',
          type: 'dataset',
          name: 'Blockchain Patent Dataset',
          description: 'Dataset of blockchain-related patents',
          createdAt: '2025-07-16T10:00:00Z',
          updatedAt: '2025-07-16T10:00:00Z',
          createdBy: 'Alice Smith',
          metadata: { recordCount: 856, source: 'patent_search' },
          isSharedFromOtherProject: false,
          tags: ['blockchain', 'dataset'],
          size: 1800000
        }
      ],
      assetCount: 1,
      collaborators: [
        {
          userId: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'contributor',
          joinedAt: '2025-07-20T00:00:00Z',
          lastActive: '2025-08-05T15:30:00Z',
          permissions: {
            canEdit: true,
            canInvite: false,
            canDelete: false,
            canManageAssets: true
          }
        },
        {
          userId: '2',
          name: 'Alice Smith',
          email: 'alice@example.com',
          role: 'owner',
          joinedAt: '2025-07-15T00:00:00Z',
          lastActive: '2025-08-05T16:00:00Z',
          permissions: {
            canEdit: true,
            canInvite: true,
            canDelete: true,
            canManageAssets: true
          }
        }
      ],
      collaboratorCount: 2,
      activities: [
        {
          id: 'act3',
          type: 'project_created',
          description: 'Created project "Blockchain Innovation Research"',
          performedBy: 'Alice Smith',
          performedAt: '2025-07-15T00:00:00Z',
          metadata: {},
          projectId: '2'
        }
      ],
      lastActivity: '2025-08-05T16:00:00Z',
      settings: {
        autoSaveSearches: true,
        autoCreateAssets: false,
        allowCrossProjectAssets: true,
        notificationSettings: {
          onNewActivity: true,
          onCollaboratorJoin: true,
          onAssetAdded: true
        }
      },
      tags: ['blockchain', 'innovation', 'research'],
      color: '#10b981',
      isFavorite: false,
      isArchived: false
    },
    {
      id: '3',
      name: 'Electric Vehicle Technology Trends',
      description: 'Analysis of emerging technologies in electric vehicle industry',
      ownerId: '3',
      ownerName: 'Bob Johnson',
      createdAt: '2025-06-10T00:00:00Z',
      updatedAt: '2025-07-22T00:00:00Z',
      accessLevel: 'public',
      assets: [],
      assetCount: 0,
      collaborators: [
        {
          userId: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'owner',
          joinedAt: '2025-06-10T00:00:00Z',
          lastActive: '2025-07-22T12:00:00Z',
          permissions: {
            canEdit: true,
            canInvite: true,
            canDelete: true,
            canManageAssets: true
          }
        }
      ],
      collaboratorCount: 1,
      activities: [
        {
          id: 'act4',
          type: 'project_created',
          description: 'Created project "Electric Vehicle Technology Trends"',
          performedBy: 'Bob Johnson',
          performedAt: '2025-06-10T00:00:00Z',
          metadata: {},
          projectId: '3'
        }
      ],
      lastActivity: '2025-07-22T12:00:00Z',
      settings: {
        autoSaveSearches: false,
        autoCreateAssets: true,
        allowCrossProjectAssets: false,
        notificationSettings: {
          onNewActivity: false,
          onCollaboratorJoin: false,
          onAssetAdded: false
        }
      },
      tags: ['electric-vehicles', 'technology'],
      color: '#f59e0b',
      isFavorite: false,
      isArchived: false
    }
  ];

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAccess, setFilterAccess] = useState<'all' | 'private' | 'team' | 'public'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Load projects from CMS backend
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProjectService.getProjects();
      if (response.data) {
        setCMSProjects(response.data);
        // Convert CMS projects to legacy format for compatibility
        const convertedProjects = response.data.map(convertCMSProjectToLegacy);
        setProjects(convertedProjects);
      } else {
        // Fallback to mock data if CMS fails
        console.warn('CMS projects unavailable, using mock data');
        setProjects(mockProjects);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      
      // Check if we're in demo mode - if so, don't show error, just use mock data
      const demoUserString = localStorage.getItem('demoUser');
      if (demoUserString) {
        console.log('Demo mode detected, using mock data');
        setProjects(mockProjects);
      } else {
        setError('Failed to load projects');
        setProjects(mockProjects);
      }
    } finally {
      setLoading(false);
    }
  };

  // Convert CMS Project to legacy Project format
  const convertCMSProjectToLegacy = (cmsProject: CMSProject): Project => {
    return {
      id: cmsProject.id,
      name: cmsProject.name,
      description: cmsProject.description || '',
      ownerId: cmsProject.owner_id,
      ownerName: cmsProject.owner?.display_name || 'Unknown',
      createdAt: cmsProject.created_at,
      updatedAt: cmsProject.updated_at,
      accessLevel: cmsProject.is_public ? 'public' : 'private' as ProjectAccessLevel,
      assets: [], // Will be loaded separately
      assetCount: cmsProject.asset_count || 0,
      collaborators: cmsProject.collaborators?.map(collab => ({
        userId: collab.user_id,
        name: collab.user?.display_name || 'Unknown',
        email: collab.user?.email || '',
        role: collab.role as any,
        joinedAt: collab.invited_at,
        lastActive: new Date().toISOString(),
        permissions: {
          canEdit: ['owner', 'admin', 'editor'].includes(collab.role),
          canInvite: ['owner', 'admin'].includes(collab.role),
          canDelete: ['owner'].includes(collab.role),
          canManageAssets: ['owner', 'admin', 'editor'].includes(collab.role)
        }
      })) || [],
      collaboratorCount: cmsProject.collaborator_count || 0,
      activities: [], // Will be loaded separately
      lastActivity: cmsProject.updated_at,
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
      tags: cmsProject.tags || [],
      color: cmsProject.color || '#3b82f6',
      isFavorite: false,
      isArchived: cmsProject.status === 'archived'
    };
  };

  useEffect(() => {
    const contextService = ProjectContextService.getInstance();
    contextService.initialize();
    
    const unsubscribe = contextService.addProjectChangeListener((project) => {
      setCurrentProject(project);
    });

    // Load projects on component mount
    loadProjects();

    return unsubscribe;
  }, []);

  const categorizedProjects = useMemo(() => {
    const currentUserId = '1';
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const allProjects = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filterAccess === 'all' || project.accessLevel === filterAccess;
      return matchesSearch && matchesFilter && !project.isArchived;
    });
    
    const recentProjects = allProjects.filter(project => {
      const updatedDate = new Date(project.updatedAt);
      return updatedDate >= thirtyDaysAgo || project.ownerId === currentUserId;
    });
    
    const sharedProjects = allProjects.filter(project => {
      return project.ownerId !== currentUserId && 
             project.collaborators.some(collab => collab.userId === currentUserId);
    });
    
    const otherProjects = allProjects.filter(project => {
      const updatedDate = new Date(project.updatedAt);
      const isRecent = updatedDate >= thirtyDaysAgo || project.ownerId === currentUserId;
      const isShared = project.ownerId !== currentUserId && 
                      project.collaborators.some(collab => collab.userId === currentUserId);
      return !isRecent && !isShared;
    });
    
    return {
      recent: recentProjects,
      shared: sharedProjects,
      other: otherProjects,
      all: allProjects
    };
  }, [projects, searchQuery, filterAccess]);

  const handleCreateProject = async (projectData: CreateProjectData) => {
    try {
      // Convert legacy project data to CMS format
      const cmsProjectData: CMSCreateProjectData = {
        name: projectData.name,
        description: projectData.description,
        color: projectData.color,
        tags: projectData.tags,
        is_public: projectData.accessLevel === 'public',
        project_type: 'research',
        priority: 'medium',
        notes: ''
      };

      const response = await ProjectService.createProject(cmsProjectData);
      
      if (response.data && !response.error) {
        // Reload projects to get the updated list
        await loadProjects();
      } else {
        throw new Error(response.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      
      // Check if we're in demo mode - if so, don't show error, just create locally
      const demoUserString = localStorage.getItem('demoUser');
      let currentUser = { id: '1', name: 'Current User', email: 'user@example.com' };
      
      if (demoUserString) {
        const demoUser = JSON.parse(demoUserString);
        currentUser = {
          id: demoUser.id,
          name: `${demoUser.firstName} ${demoUser.lastName}`,
          email: demoUser.email
        };
        console.log('Demo mode: Creating project locally');
      } else {
        setError('Failed to create project');
      }
      
      // Fallback: create project in local state only
      const newProject: Project = {
        ...projectData,
        id: (projects.length + 1).toString(),
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assets: [],
        assetCount: 0,
        collaborators: [{
          userId: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: 'owner',
          joinedAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          permissions: {
            canEdit: true,
            canInvite: true,
            canDelete: true,
            canManageAssets: true
          }
        }],
        collaboratorCount: 1,
        activities: [{
          id: 'act_new',
          type: 'project_created',
          description: `Created project "${projectData.name}"`,
          performedBy: currentUser.name,
          performedAt: new Date().toISOString(),
          metadata: { projectName: projectData.name },
          projectId: (projects.length + 1).toString()
        }],
        lastActivity: new Date().toISOString(),
        isFavorite: false,
        isArchived: false
      };

      setProjects([...projects, newProject]);
    }
  };

  const handleShare = (project: Project) => {
    setSelectedProject(project);
    setShowShareModal(true);
  };

  const handleShowDetails = (project: Project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleSetCurrentProject = (project: Project) => {
    const contextService = ProjectContextService.getInstance();
    contextService.setCurrentProject(project);
    setShowDetailsModal(false);
  };

  const handleGenerateAISummary = (project: Project) => {
    console.log('Generating AI summary for project:', project.name);
    alert(`Generating AI summary for project "${project.name}"...`);
  };

  const getAccessIcon = (access: ProjectAccessLevel) => {
    switch (access) {
      case 'private':
        return <User className="w-4 h-4 text-red-500" />;
      case 'team':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'organization':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'public':
        return <Globe className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <PageHeader
              title="Projects"
              subtitle="Organize your research with collaborative projects and shared assets."
              helpLink="projects-support"
              onNavigate={onNavigate}
            />
            {currentProject && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-gray-600">Current project:</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentProject.color }}
                  />
                  <span className="font-medium text-blue-600">{currentProject.name}</span>
                  <button
                    onClick={() => handleShowDetails(currentProject)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStorageManager(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Database className="w-4 h-4" />
              Storage
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterAccess}
            onChange={(e) => setFilterAccess(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Projects</option>
            <option value="private">Private</option>
            <option value="team">Team</option>
            <option value="public">Public</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Projects</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={loadProjects}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : categorizedProjects.all.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FolderPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterAccess !== 'all' ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {searchQuery || filterAccess !== 'all' 
                ? 'Try adjusting your search terms or filters'
                : 'Create your first project to organize your research work and collaborate with your team. Projects help you manage assets, track activities, and share findings.'
              }
            </p>
            {!searchQuery && filterAccess === 'all' && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add First Project
                </button>
                <button className="flex items-center gap-2 px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <HelpCircle className="w-4 h-4" />
                  Learn About Projects
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {categorizedProjects.recent.length > 0 && (
              <ProjectCategory 
                title="Recent Projects" 
                projects={categorizedProjects.recent} 
                onShare={handleShare}
                onShowDetails={handleShowDetails}
                onSetCurrent={handleSetCurrentProject}
                onGenerateAISummary={handleGenerateAISummary}
                getAccessIcon={getAccessIcon}
              />
            )}
            
            {categorizedProjects.shared.length > 0 && (
              <ProjectCategory 
                title="Shared with You" 
                projects={categorizedProjects.shared} 
                onShare={handleShare}
                onShowDetails={handleShowDetails}
                onSetCurrent={handleSetCurrentProject}
                onGenerateAISummary={handleGenerateAISummary}
                getAccessIcon={getAccessIcon}
              />
            )}
            
            {categorizedProjects.other.length > 0 && (
              <ProjectCategory 
                title="Other Projects" 
                projects={categorizedProjects.other} 
                onShare={handleShare}
                onShowDetails={handleShowDetails}
                onSetCurrent={handleSetCurrentProject}
                onGenerateAISummary={handleGenerateAISummary}
                getAccessIcon={getAccessIcon}
              />
            )}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateProject}
      />

      <ShareProjectModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        project={selectedProject}
      />

      <ProjectDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        project={selectedProject}
        onSetCurrent={handleSetCurrentProject}
      />

      {showStorageManager && (
        <SupabaseProjectManager
          projects={projects}
          onProjectsUpdate={setProjects}
          onClose={() => setShowStorageManager(false)}
        />
      )}
    </div>
  );
}