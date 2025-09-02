import { InstantUser } from '../lib/instantAuth';
import { 
  User, 
  Calendar, 
  Mail, 
  Shield, 
  History, 
  TrendingUp,
  FileText,
  Search,
  BookOpen,
  Bell
} from 'lucide-react';

interface UserDashboardProps {
  user: InstantUser;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const getUserTypeColor = (useType: string) => {
    switch (useType) {
      case 'trial': return 'bg-orange-100 text-orange-800';
      case 'non-commercial': return 'bg-green-100 text-green-800';
      case 'commercial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeLabel = (useType: string) => {
    switch (useType) {
      case 'trial': return 'Trial User';
      case 'non-commercial': return 'Non-Commercial';
      case 'commercial': return 'Commercial';
      default: return useType;
    }
  };

  const demoStats = [
    { label: 'Searches Performed', value: '127', icon: Search, color: 'text-blue-600' },
    { label: 'Collections Created', value: '8', icon: BookOpen, color: 'text-green-600' },
    { label: 'Documents Saved', value: '34', icon: FileText, color: 'text-purple-600' },
    { label: 'Alerts Active', value: '5', icon: Bell, color: 'text-orange-600' }
  ];

  const recentActivity = [
    { action: 'Search: "artificial intelligence patents"', time: '2 hours ago', type: 'search' },
    { action: 'Created collection: "AI Research 2024"', time: '1 day ago', type: 'collection' },
    { action: 'Saved document: "Deep Learning Advances"', time: '2 days ago', type: 'document' },
    { action: 'Set alert: "quantum computing"', time: '3 days ago', type: 'alert' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600">Ready to explore innovation intelligence?</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getUserTypeColor(user.accountType)}`}>
              {getUserTypeLabel(user.accountType)}
            </span>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">@{user.email.split('@')[0]}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{getUserTypeLabel(user.accountType)} Account</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Demo User Account</span>
            </div>
            <div className="flex items-center gap-3">
              <History className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Search History: {user.accountType === 'commercial' ? 'Disabled' : 'Enabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {demoStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activity.type === 'search' ? 'bg-blue-100 text-blue-700' :
                activity.type === 'collection' ? 'bg-green-100 text-green-700' :
                activity.type === 'document' ? 'bg-purple-100 text-purple-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <Search className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm text-gray-700">New Search</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm text-gray-700">My Collections</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm text-gray-700">Saved Documents</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <Bell className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <span className="text-sm text-gray-700">Manage Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
}