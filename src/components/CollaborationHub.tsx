import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Crown,
  FileText,
  Activity,
  Target,
  TrendingUp,
  Calendar,
  Star,
  Eye,
  Plus,
  Bell,
  ChevronRight,
  Video,
  CheckCircle
} from 'lucide-react';
import { InstantUser } from '../lib/instantAuth';
import TeamWorkspace from './TeamWorkspace';
import InnovationForum from './InnovationForum';
import ExpertNetwork from './ExpertNetwork';
import CollaborativeReview from './CollaborativeReview';
import HarmonizedCard from './HarmonizedCard';

interface CollaborationHubProps {
  currentUser: InstantUser;
}

type ActiveFeature = 'overview' | 'teams' | 'forum' | 'experts' | 'reviews';

const CollaborationHub: React.FC<CollaborationHubProps> = ({ currentUser }) => {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>('overview');
  const [_recentActivity, _setRecentActivity] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [notifications, setNotifications] = useState<number>(3);

  // Mock data for overview
  const [dashboardStats] = useState({
    totalTeams: 3,
    activeProjects: 8,
    completedTasks: 156,
    totalExperts: 47,
    forumPosts: 234,
    documentsReviewed: 89,
    reputation: 2847,
    consultations: 12
  });

  const [recentActivities] = useState([
    {
      id: 'activity-1',
      type: 'task_completed',
      user: 'Sarah Chen',
      action: 'completed task',
      target: 'Prior Art Analysis',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 'activity-2',
      type: 'document_reviewed',
      user: 'David Rodriguez',
      action: 'reviewed document',
      target: 'AI Patent Application',
      time: '4 hours ago',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 'activity-3',
      type: 'forum_post',
      user: 'Dr. Michael Chen',
      action: 'answered question',
      target: 'Patent Claim Drafting',
      time: '6 hours ago',
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      id: 'activity-4',
      type: 'consultation_booked',
      user: 'Jennifer Lopez',
      action: 'booked consultation',
      target: 'IP Strategy Review',
      time: '1 day ago',
      icon: Calendar,
      color: 'text-orange-600'
    },
    {
      id: 'activity-5',
      type: 'team_joined',
      user: 'Alex Kumar',
      action: 'joined team',
      target: 'Quantum Research Group',
      time: '2 days ago',
      icon: Users,
      color: 'text-indigo-600'
    }
  ]);

  const [featuredExperts] = useState([
    {
      id: 'expert-1',
      name: 'Dr. Michael Chen',
      title: 'Senior Patent Attorney',
      specialization: 'AI/ML Patents',
      rating: 4.9,
      reviews: 127,
      avatar: '/api/placeholder/40/40',
      available: true
    },
    {
      id: 'expert-2',
      name: 'Sarah Williams',
      title: 'Biotech Patent Consultant',
      specialization: 'Biotech & Pharma',
      rating: 4.8,
      reviews: 98,
      avatar: '/api/placeholder/40/40',
      available: true
    },
    {
      id: 'expert-3',
      name: 'David Kumar',
      title: 'Former USPTO Examiner',
      specialization: 'Software Patents',
      rating: 4.7,
      reviews: 156,
      avatar: '/api/placeholder/40/40',
      available: false
    }
  ]);

  const [activeTeams] = useState([
    {
      id: 'team-1',
      name: 'Patent Innovation Squad',
      members: 8,
      projects: 5,
      progress: 75,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'team-2',
      name: 'AI Research Collective',
      members: 12,
      projects: 8,
      progress: 62,
      avatar: '/api/placeholder/40/40'
    }
  ]);

  const [trendingPosts] = useState([
    {
      id: 'post-1',
      title: 'Best practices for AI patent claims',
      author: 'Dr. Sarah Chen',
      replies: 23,
      votes: 156,
      solved: true
    },
    {
      id: 'post-2',
      title: 'Quantum computing prior art strategies',
      author: 'Michael Rodriguez',
      replies: 15,
      votes: 89,
      solved: false
    },
    {
      id: 'post-3',
      title: 'International filing for biotech startups',
      author: 'Jennifer Williams',
      replies: 31,
      votes: 234,
      solved: true
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(45 + Math.floor(Math.random() * 10));
      if (Math.random() > 0.8) {
        setNotifications(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderOverview = () => {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser.firstName}! 👋
              </h2>
              <p className="text-gray-600">
                Connect, collaborate, and innovate with the global patent community
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>{onlineUsers} users online</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>{notifications} notifications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <HarmonizedCard
            title="Team Collaboration"
            description="Active projects and tasks"
            stats={[
              { label: "Teams", value: dashboardStats.totalTeams, icon: Users, color: "text-blue-600" },
              { label: "Projects", value: dashboardStats.activeProjects, icon: Target, color: "text-green-600" }
            ]}
            colorAccent="#3b82f6"
            onTitleClick={() => setActiveFeature('teams')}
          />
          
          <HarmonizedCard
            title="Community Forum"
            description="Knowledge sharing platform"
            stats={[
              { label: "Posts", value: dashboardStats.forumPosts, icon: MessageSquare, color: "text-purple-600" },
              { label: "Reputation", value: dashboardStats.reputation, icon: Star, color: "text-yellow-600" }
            ]}
            colorAccent="#8b5cf6"
            onTitleClick={() => setActiveFeature('forum')}
          />
          
          <HarmonizedCard
            title="Expert Network"
            description="Professional consultations"
            stats={[
              { label: "Experts", value: dashboardStats.totalExperts, icon: Crown, color: "text-orange-600" },
              { label: "Sessions", value: dashboardStats.consultations, icon: Video, color: "text-blue-600" }
            ]}
            colorAccent="#f59e0b"
            onTitleClick={() => setActiveFeature('experts')}
          />
          
          <HarmonizedCard
            title="Document Review"
            description="Collaborative reviewing"
            stats={[
              { label: "Reviewed", value: dashboardStats.documentsReviewed, icon: FileText, color: "text-green-600" },
              { label: "Completed", value: dashboardStats.completedTasks, icon: CheckCircle, color: "text-blue-600" }
            ]}
            colorAccent="#10b981"
            onTitleClick={() => setActiveFeature('reviews')}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
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
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 ${activity.color}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.action}{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Sidebar */}
          <div className="space-y-6">
            {/* Active Teams */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  My Teams
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {activeTeams.map((team) => (
                    <div key={team.id} className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{team.name}</p>
                        <p className="text-xs text-gray-500">{team.members} members • {team.projects} projects</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveFeature('teams')}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  View All Teams
                </button>
              </div>
            </div>

            {/* Featured Experts */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Featured Experts
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {featuredExperts.slice(0, 3).map((expert) => (
                    <div key={expert.id} className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <div className="relative">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Crown className="w-4 h-4 text-blue-600" />
                        </div>
                        {expert.available && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{expert.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500">{expert.rating} ({expert.reviews})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveFeature('experts')}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Browse Experts
                </button>
              </div>
            </div>

            {/* Trending Forum Posts */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending Discussions
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {trendingPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">{post.title}</h4>
                        {post.solved && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">by {post.author}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {post.votes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveFeature('forum')}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Join Discussions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setActiveFeature('teams')}
              className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">Join Team</p>
                <p className="text-xs text-gray-500">Collaborate on projects</p>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveFeature('forum')}
              className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">Ask Question</p>
                <p className="text-xs text-gray-500">Get expert answers</p>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveFeature('experts')}
              className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">Book Expert</p>
                <p className="text-xs text-gray-500">Schedule consultation</p>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveFeature('reviews')}
              className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">Review Document</p>
                <p className="text-xs text-gray-500">Collaborative review</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (activeFeature === 'teams') {
    return <TeamWorkspace currentUser={currentUser} />;
  }

  if (activeFeature === 'forum') {
    return <InnovationForum currentUser={currentUser} />;
  }

  if (activeFeature === 'experts') {
    return <ExpertNetwork currentUser={currentUser} />;
  }

  if (activeFeature === 'reviews') {
    return <CollaborativeReview currentUser={currentUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 -m-6">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Collaboration Hub</h1>
              <p className="text-gray-600 mt-1">Connect, collaborate, and innovate with the global patent community</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>{onlineUsers} online</span>
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'teams', label: 'Teams', icon: Users },
              { id: 'forum', label: 'Forum', icon: MessageSquare },
              { id: 'experts', label: 'Experts', icon: Crown },
              { id: 'reviews', label: 'Reviews', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFeature(tab.id as ActiveFeature)}
                className={`flex items-center gap-2 px-1 py-2 border-b-2 text-sm font-medium transition-colors ${
                  activeFeature === tab.id
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
        {renderOverview()}
      </div>
    </div>
  );
};

export default CollaborationHub;