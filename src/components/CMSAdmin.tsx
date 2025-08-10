import { useState, useEffect } from 'react';
import { 
  Database, 
  Users, 
  FileText, 
  Settings, 
  Activity, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Store,
} from 'lucide-react';
import { CMSService } from '../lib/cmsService';
import type { Content, Project, User, Activity as ActivityType } from '../types/cms';
import ShowcaseManagement from './admin/ShowcaseManagement';

interface CMSAdminProps {
  onNavigate?: (section: string) => void;
}

export default function CMSAdmin({ onNavigate }: CMSAdminProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [contents, setContents] = useState<Content[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const cms = CMSService.getInstance();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load current user
      const userResponse = await cms.getCurrentUser();
      if (userResponse.data) {
        setCurrentUser(userResponse.data);
      }

      // Load data based on active tab
      switch (activeTab) {
        case 'content': {
          const contentResponse = await cms.getContents({ per_page: 50 });
          setContents(contentResponse.data);
          break;
        }
        case 'projects': {
          const projectResponse = await cms.getProjects({ per_page: 50 });
          setProjects(projectResponse.data);
          break;
        }
        case 'activity': {
          const activityResponse = await cms.getActivities(undefined, 100);
          if (activityResponse.data) {
            setActivities(activityResponse.data);
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error loading CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Database },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'projects', label: 'Projects', icon: Settings },
    { id: 'showcase', label: 'Showcase', icon: Store },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Content Items</h3>
            <p className="text-2xl font-semibold text-gray-900">{contents.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Settings className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Projects</h3>
            <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Users</h3>
            <p className="text-2xl font-semibold text-gray-900">-</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Activity className="h-8 w-8 text-orange-600" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Activities</h3>
            <p className="text-2xl font-semibold text-gray-900">{activities.length}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Content Management</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Content
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contents.map((content) => (
              <tr key={content.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{content.title}</div>
                    {content.excerpt && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">{content.excerpt}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {content.content_type?.name || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                    {content.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {content.author?.display_name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(content.updated_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-gray-400 hover:text-blue-600" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-blue-600" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {contents.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first content item.</p>
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Project Management</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <h4 className="font-medium text-gray-900">{project.name}</h4>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            
            {project.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{project.asset_count || 0} assets</span>
              <span>{formatDate(project.updated_at)}</span>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500">
                Owner: {project.owner?.display_name || 'Unknown'}
              </div>
              <div className="flex items-center gap-1">
                <button className="text-gray-400 hover:text-blue-600" title="View">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-blue-600" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && !loading && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first project to get started.</p>
        </div>
      )}
    </div>
  );

  const renderActivity = () => (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user?.display_name || 'System'}</span>
                    {' '}{activity.action.toLowerCase()}{' '}
                    <span className="font-medium">{activity.resource_type}</span>
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(activity.created_at)}</p>
                </div>
              </div>
              {activity.project && (
                <span className="text-xs text-gray-500">
                  {activity.project.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && !loading && (
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
          <p className="mt-1 text-sm text-gray-500">Activity will appear here as users interact with the system.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">CMS Administration</h1>
            <p className="text-sm text-gray-600">Manage content, projects, and system settings</p>
          </div>
          {currentUser && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser.display_name || currentUser.email}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                currentUser.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {currentUser.role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'content' && renderContent()}
            {activeTab === 'projects' && renderProjects()}
            {activeTab === 'showcase' && (
              <div className="flex-1 -m-6">
                <ShowcaseManagement onNavigate={onNavigate} />
              </div>
            )}
            {activeTab === 'users' && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">User Management</h3>
                <p className="mt-1 text-sm text-gray-500">User management features coming soon.</p>
              </div>
            )}
            {activeTab === 'activity' && renderActivity()}
          </>
        )}
      </div>
    </div>
  );
}