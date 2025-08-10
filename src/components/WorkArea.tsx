import { useState } from 'react';
import { 
  Search, 
  Archive, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Hash, 
  Bell,
  Award,
  Users,
  Plus,
  Clock,
  User,
  ChevronRight
} from 'lucide-react';
import Collections from './Collections';
import UserDashboards from './UserDashboards';
import ClaimedWork from './ClaimedWork';
import Notifications from './Notifications';
import Reports from './Reports';
import Network from './Network';

interface WorkAreaProps {
  user: any;
}

interface WorkAreaItem {
  id: string;
  title: string;
  type: 'query' | 'collection' | 'dashboard' | 'note' | 'claimedwork' | 'notification' | 'report' | 'network';
  lastAccessed: string;
  itemCount?: number;
  description?: string;
}

export default function WorkArea({ user }: WorkAreaProps) {
  const [activeTab, setActiveTab] = useState<'queries' | 'collections' | 'dashboards' | 'claimedwork' | 'notes' | 'tags' | 'notifications' | 'reports' | 'network' | 'settings'>('collections');

  const workAreaData = {
    savedQueries: [
      {
        id: '1',
        title: 'Patent Search (574)',
        type: 'query' as const,
        lastAccessed: 'Aug 8, 2025',
        itemCount: 574,
        description: 'All Documents'
      }
    ],
    collections: [
      {
        id: '1',
        title: 'AI Patents Collection',
        type: 'collection' as const,
        lastAccessed: 'Aug 8, 2025',
        itemCount: 247,
        description: 'Artificial Intelligence related patents'
      }
    ],
    dashboards: [
      {
        id: '1',
        title: 'Owners',
        type: 'dashboard' as const,
        lastAccessed: 'Aug 8, 2025',
        description: 'Patent ownership analysis'
      },
      {
        id: '2',
        title: 'Legal Status',
        type: 'dashboard' as const,
        lastAccessed: 'Aug 8, 2025',
        description: 'Patent legal status overview'
      }
    ],
    claimedwork: [
      {
        id: '1',
        title: 'Patent Inventorship Claims',
        type: 'claimedwork' as const,
        lastAccessed: 'Aug 8, 2025',
        itemCount: 2,
        description: 'ORCID linked inventorship records'
      }
    ],
    notes: [],
    tags: [],
    notifications: [
      {
        id: '1',
        title: 'New Patent Results Available',
        type: 'query' as const,
        lastAccessed: 'Aug 8, 2025',
        itemCount: 15,
        description: 'AI Machine Learning query alert'
      }
    ],
    reports: [
      {
        id: '1',
        title: 'AI Patent Landscape Analysis 2025',
        type: 'dashboard' as const,
        lastAccessed: 'Aug 8, 2025',
        itemCount: 6,
        description: 'User created and shared reports'
      }
    ],
    network: [
      {
        id: '1',
        title: 'Professional Network',
        type: 'network' as const,
        lastAccessed: 'Aug 8, 2025',
        itemCount: 47,
        description: 'Colleagues, collaborators, and business contacts'
      }
    ]
  };

  const tabs = [
    { id: 'queries', label: 'Queries', icon: Search, count: workAreaData.savedQueries.length },
    { id: 'collections', label: 'Collections', icon: BookOpen, count: workAreaData.collections.length },
    { id: 'dashboards', label: 'Dashboards', icon: BarChart3, count: workAreaData.dashboards.length },
    { id: 'claimedwork', label: 'Claimed Work', icon: Award, count: workAreaData.claimedwork.length },
    { id: 'notes', label: 'Notes', icon: FileText, count: workAreaData.notes.length },
    { id: 'tags', label: 'Tags', icon: Hash, count: workAreaData.tags.length },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: workAreaData.notifications.length },
    { id: 'reports', label: 'Reports', icon: FileText, count: workAreaData.reports.length },
    { id: 'network', label: 'Network', icon: Users, count: workAreaData.network.length }
  ];

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'query':
        return <Search className="w-4 h-4 text-blue-500" />;
      case 'collection':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'dashboard':
        return <BarChart3 className="w-4 h-4 text-purple-500" />;
      case 'claimedwork':
        return <Award className="w-4 h-4 text-green-500" />;
      case 'note':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'network':
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return <Archive className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'collections') {
      return <Collections />;
    }
    
    if (activeTab === 'dashboards') {
      return <UserDashboards />;
    }
    
    if (activeTab === 'claimedwork') {
      return <ClaimedWork />;
    }
    
    if (activeTab === 'notifications') {
      return <Notifications />;
    }
    
    if (activeTab === 'reports') {
      return <Reports />;
    }
    
    if (activeTab === 'network') {
      return <Network />;
    }

    const items = workAreaData[activeTab as keyof typeof workAreaData] as WorkAreaItem[];
    
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Archive className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Your {activeTab} will appear here once you create them. Start by exploring the platform and saving items you find interesting.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Create {activeTab.slice(0, -1)}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getItemIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Last Accessed: {item.lastAccessed}</span>
                    </div>
                    {item.itemCount && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{item.itemCount} items</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{user?.name || 'Current User'}</div>
              <div className="text-sm text-blue-600">Personal Account (Not for Commercial Use)</div>
            </div>
          </div>
          
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
            <Plus className="w-4 h-4" />
            New Item
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="text-xs font-medium text-gray-500 mb-3 uppercase">STUDIO</div>
            
            <div className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count > 0 && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Work */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-500 mb-3 uppercase">RECENT WORK</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Search className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="font-medium">Patent Search (574)</div>
                  <div className="text-xs text-gray-500">All Documents</div>
                  <div className="text-xs text-gray-400">Last Accessed: Aug 8, 2025</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="font-medium">Owners</div>
                  <div className="text-xs text-gray-400">Last Accessed: Aug 8, 2025</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="font-medium">Legal Status</div>
                  <div className="text-xs text-gray-400">Last Accessed: Aug 8, 2025</div>
                </div>
              </div>
              
              <button className="text-xs text-gray-500 hover:text-gray-700 mt-2">
                ... More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <nav className="flex items-center text-sm text-gray-500">
                <span>Studio</span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-blue-600 capitalize">{activeTab}</span>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Explore Science, Technology & Innovation..."
                  className="w-96 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white px-4 py-1 rounded text-sm hover:bg-teal-700">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}