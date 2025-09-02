import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  Award,
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  Eye,
  Star,
  Trophy,
  Target,
  Lightbulb,
  HelpCircle,
  CheckCircle,
  Clock,
  Pin,
  Tag,
  ThumbsUp,
  MessageCircle,
  MoreHorizontal,
  Crown,
  Zap,
  Badge
} from 'lucide-react';
import { InstantUser } from '../lib/instantAuth';
import {
  ForumPost,
  InnovationChallenge,
  UserReputation,
  ForumCategory
} from '../types/collaboration';
import HarmonizedCard from './HarmonizedCard';
import { HCLStat, HCLKeyword, HCLAttribute, HCLAction } from './HarmonizedCard';

interface InnovationForumProps {
  currentUser: InstantUser;
}

const InnovationForum: React.FC<InnovationForumProps> = ({ currentUser }) => {
  const [activeView, setActiveView] = useState<'posts' | 'challenges' | 'experts' | 'leaderboard'>('posts');
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending' | 'unanswered'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [_selectedPost, _setSelectedPost] = useState<string | null>(null);

  // Mock data
  const [userReputation] = useState<UserReputation>({
    id: 'rep-1',
    user_id: currentUser.id,
    reputation_score: 2847,
    posts_created: 23,
    replies_created: 156,
    solutions_provided: 34,
    upvotes_received: 287,
    badges: ['helpful', 'expert', 'mentor', 'innovator'],
    level: 'expert',
    updated_at: new Date().toISOString(),
  });

  const [posts] = useState<ForumPost[]>([
    {
      id: 'post-1',
      category: 'patent_strategy',
      title: 'Best practices for patent claim drafting in AI/ML inventions',
      content: 'Looking for advice on how to effectively draft patent claims for machine learning algorithms. What are the key considerations for ensuring the claims are both broad enough for protection and specific enough to meet patentability requirements?',
      author_id: currentUser.id,
      author_name: currentUser.displayName,
      author_avatar: '/api/placeholder/32/32',
      view_count: 127,
      vote_score: 23,
      reply_count: 8,
      is_pinned: false,
      is_solved: true,
      tags: ['ai', 'ml', 'claims', 'drafting'],
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'post-2',
      category: 'technical_help',
      title: 'Prior art search strategies for quantum computing patents',
      content: 'What are the most effective databases and search methodologies for conducting comprehensive prior art searches in the quantum computing domain? Are there specific classification codes or keywords that work best?',
      author_id: 'user-2',
      author_name: 'Dr. Sarah Chen',
      author_avatar: '/api/placeholder/32/32',
      view_count: 89,
      vote_score: 31,
      reply_count: 12,
      is_pinned: true,
      is_solved: false,
      tags: ['quantum', 'prior-art', 'search', 'database'],
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'post-3',
      category: 'legal_advice',
      title: 'International patent filing strategy for biotech startups',
      content: 'As a biotech startup with limited budget, what would be the optimal international filing strategy? Should we focus on PCT filing or direct national phase entries? Looking for cost-effective approaches.',
      author_id: 'user-3',
      author_name: 'Alex Rodriguez',
      author_avatar: '/api/placeholder/32/32',
      view_count: 234,
      vote_score: 45,
      reply_count: 19,
      is_pinned: false,
      is_solved: true,
      tags: ['biotech', 'international', 'pct', 'startup'],
      created_at: new Date(Date.now() - 14400000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'post-4',
      category: 'innovation_challenges',
      title: 'Sustainable energy patent landscape analysis challenge',
      content: 'Challenge: Analyze the patent landscape for sustainable energy technologies and identify white space opportunities. Winner gets $500 prize. Deadline: August 30th.',
      author_id: 'user-4',
      author_name: 'Innovation Team',
      author_avatar: '/api/placeholder/32/32',
      view_count: 456,
      vote_score: 78,
      reply_count: 25,
      is_pinned: true,
      is_solved: false,
      tags: ['challenge', 'sustainable', 'energy', 'landscape'],
      created_at: new Date(Date.now() - 21600000).toISOString(),
      updated_at: new Date(Date.now() - 10800000).toISOString(),
    },
  ]);

  const [challenges] = useState<InnovationChallenge[]>([
    {
      id: 'challenge-1',
      title: 'AI Patent Portfolio Optimization',
      description: 'Design an AI-powered system to optimize patent portfolios for maximum strategic value. Consider factors like competitive landscape, licensing opportunities, and prosecution efficiency.',
      category: 'AI & Machine Learning',
      difficulty: 'advanced',
      prize_amount: 1000,
      currency: 'USD',
      deadline: '2025-09-15',
      status: 'active',
      participant_count: 47,
      submission_count: 12,
      created_by: 'innovation-team',
      created_at: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: 'challenge-2',
      title: 'Quantum Computing Prior Art Database',
      description: 'Create a comprehensive, searchable database of quantum computing prior art with advanced semantic search capabilities.',
      category: 'Database & Search',
      difficulty: 'expert',
      prize_amount: 2500,
      currency: 'USD',
      deadline: '2025-10-01',
      status: 'active',
      participant_count: 23,
      submission_count: 5,
      created_by: 'innovation-team',
      created_at: new Date(Date.now() - 1209600000).toISOString(),
    },
    {
      id: 'challenge-3',
      title: 'Sustainable Tech Patent Classification',
      description: 'Develop an improved classification system for sustainable technology patents to better identify innovation trends and opportunities.',
      category: 'Sustainability',
      difficulty: 'intermediate',
      prize_amount: 750,
      currency: 'USD',
      deadline: '2025-08-30',
      status: 'voting',
      participant_count: 34,
      submission_count: 18,
      created_by: 'innovation-team',
      created_at: new Date(Date.now() - 1814400000).toISOString(),
    },
  ]);

  const [topExperts] = useState([
    {
      id: 'expert-1',
      name: 'Dr. Michael Chen',
      title: 'Senior Patent Attorney',
      specialization: 'AI/ML Patents',
      reputation: 4847,
      solutions: 156,
      avatar: '/api/placeholder/40/40',
      level: 'legend',
    },
    {
      id: 'expert-2',
      name: 'Sarah Williams',
      title: 'IP Strategy Consultant',
      specialization: 'Biotech & Pharma',
      reputation: 3921,
      solutions: 124,
      avatar: '/api/placeholder/40/40',
      level: 'master',
    },
    {
      id: 'expert-3',
      name: 'David Kumar',
      title: 'Patent Examiner (Former)',
      specialization: 'Software Patents',
      reputation: 3456,
      solutions: 98,
      avatar: '/api/placeholder/40/40',
      level: 'expert',
    },
  ]);

  const getPostsByCategory = () => {
    if (selectedCategory === 'all') return posts;
    return posts.filter(post => post.category === selectedCategory);
  };

  const getSortedPosts = () => {
    const filteredPosts = getPostsByCategory();
    switch (sortBy) {
      case 'popular':
        return filteredPosts.sort((a, b) => b.vote_score - a.vote_score);
      case 'trending':
        return filteredPosts.sort((a, b) => (b.vote_score + b.reply_count) - (a.vote_score + a.reply_count));
      case 'unanswered':
        return filteredPosts.filter(p => !p.is_solved).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return filteredPosts.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'helpful': return <ThumbsUp className="w-3 h-3" />;
      case 'expert': return <Star className="w-3 h-3" />;
      case 'mentor': return <Crown className="w-3 h-3" />;
      case 'innovator': return <Lightbulb className="w-3 h-3" />;
      default: return <Badge className="w-3 h-3" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'helpful': return 'bg-blue-100 text-blue-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      case 'mentor': return 'bg-yellow-100 text-yellow-800';
      case 'innovator': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: ForumCategory) => {
    switch (category) {
      case 'patent_strategy': return <Target className="w-4 h-4" />;
      case 'technical_help': return <HelpCircle className="w-4 h-4" />;
      case 'legal_advice': return <Badge className="w-4 h-4" />;
      case 'innovation_challenges': return <Trophy className="w-4 h-4" />;
      case 'general': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Removed unused difficulty color function

  const renderPosts = () => {
    const sortedPosts = getSortedPosts();

    return (
      <div className="space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ForumCategory | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="general">General Discussion</option>
              <option value="patent_strategy">Patent Strategy</option>
              <option value="technical_help">Technical Help</option>
              <option value="legal_advice">Legal Advice</option>
              <option value="innovation_challenges">Innovation Challenges</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
              <option value="unanswered">Unanswered</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {post.author_avatar ? (
                        <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <Users className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {post.is_pinned && <Pin className="w-4 h-4 text-orange-500" />}
                      {getCategoryIcon(post.category)}
                      <span className="text-sm text-gray-600 capitalize">{post.category.replace('_', ' ')}</span>
                      {post.is_solved && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Solved</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                    
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{post.author_name}</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.view_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.reply_count}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 text-green-600 hover:text-green-700">
                            <ChevronUp className="w-4 h-4" />
                            {post.vote_score}
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChallenges = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Innovation Challenges</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Create Challenge
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.map((challenge) => {
            const daysLeft = Math.ceil((new Date(challenge.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            const stats: HCLStat[] = [
              { label: "Prize", value: `$${challenge.prize_amount}`, icon: Trophy, color: "text-yellow-600" },
              { label: "Participants", value: challenge.participant_count, icon: Users, color: "text-blue-600" },
              { label: "Submissions", value: challenge.submission_count, icon: Target, color: "text-green-600" }
            ];

            const keywords: HCLKeyword[] = [
              { label: challenge.status, color: challenge.status === 'active' ? 'green' : challenge.status === 'voting' ? 'blue' : 'gray' },
              { label: challenge.difficulty, color: challenge.difficulty === 'expert' ? 'red' : challenge.difficulty === 'advanced' ? 'orange' : challenge.difficulty === 'intermediate' ? 'yellow' : 'green' }
            ];

            const attributes: HCLAttribute[] = [
              { label: "Category", value: challenge.category, icon: Tag },
              { label: "Deadline", value: `${daysLeft} days left`, icon: Clock }
            ];

            const actions: HCLAction[] = [
              { id: 'view', label: 'View Details', icon: Eye, onClick: () => {}, isPrimary: true, variant: 'primary' },
              { id: 'participate', label: 'Participate', icon: Target, onClick: () => {}, isPrimary: true, variant: 'secondary' }
            ];

            return (
              <HarmonizedCard
                key={challenge.id}
                title={challenge.title}
                description={challenge.description}
                stats={stats}
                keywords={keywords}
                attributes={attributes}
                actions={actions}
                colorAccent={challenge.status === 'active' ? '#10b981' : challenge.status === 'voting' ? '#3b82f6' : '#6b7280'}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderExperts = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Top Experts</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700">View All Experts</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topExperts.map((expert, index) => (
            <div key={expert.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {expert.avatar ? (
                      <img src={expert.avatar} alt={expert.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <Crown className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  {index < 3 && (
                    <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                  <p className="text-sm text-gray-600">{expert.title}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Specialization</span>
                  <span className="font-medium">{expert.specialization}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Reputation</span>
                  <span className="font-medium text-blue-600">{expert.reputation.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Solutions</span>
                  <span className="font-medium text-green-600">{expert.solutions}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  expert.level === 'legend' ? 'bg-purple-100 text-purple-800' :
                  expert.level === 'master' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {expert.level}
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Community Leaderboard</h2>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="monthly">This Month</option>
            <option value="weekly">This Week</option>
            <option value="yearly">This Year</option>
            <option value="alltime">All Time</option>
          </select>
        </div>

        {/* User's Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentUser.displayName}</h3>
              <p className="text-sm text-gray-600">Level: {userReputation.level}</p>
              <div className="flex items-center gap-2 mt-1">
                {userReputation.badges.map((badge) => (
                  <span key={badge} className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(badge)}`}>
                    {getBadgeIcon(badge)}
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userReputation.reputation_score.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Reputation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userReputation.solutions_provided}</div>
              <div className="text-sm text-gray-600">Solutions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userReputation.posts_created}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userReputation.upvotes_received}</div>
              <div className="text-sm text-gray-600">Upvotes</div>
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Contributors</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topExperts.map((expert, index) => (
                <div key={expert.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {expert.avatar ? (
                        <img src={expert.avatar} alt={expert.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <Users className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{expert.name}</h4>
                      <p className="text-sm text-gray-600">{expert.specialization}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">{expert.reputation.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{expert.solutions} solutions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Innovation Forum</h1>
              <p className="text-gray-600 mt-1">Connect, learn, and innovate with the patent community</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Reputation: <span className="font-semibold text-blue-600">{userReputation.reputation_score.toLocaleString()}</span></span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6">
            {[
              { id: 'posts', label: 'Discussions', icon: MessageSquare },
              { id: 'challenges', label: 'Challenges', icon: Trophy },
              { id: 'experts', label: 'Experts', icon: Crown },
              { id: 'leaderboard', label: 'Leaderboard', icon: Award },
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
        {activeView === 'posts' && renderPosts()}
        {activeView === 'challenges' && renderChallenges()}
        {activeView === 'experts' && renderExperts()}
        {activeView === 'leaderboard' && renderLeaderboard()}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Post</h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>General Discussion</option>
                  <option>Patent Strategy</option>
                  <option>Technical Help</option>
                  <option>Legal Advice</option>
                  <option>Innovation Challenges</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What's your question or topic?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide details about your question or share your insights..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add tags separated by commas (e.g., ai, patents, strategy)"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreatePost(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreatePost(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InnovationForum;