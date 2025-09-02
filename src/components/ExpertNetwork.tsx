import React, { useState } from 'react';
import {
  Users,
  Star,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Video,
  Award,
  Search,
  Briefcase,
  Eye,
  BookOpen,
  Target,
  TrendingUp,
  Crown,
  Badge,
  User,
  Plus,
  Calendar as CalendarIcon,
  Timer,
  CreditCard,
  MessageCircle,
  FileText,
  Download,
  X,
  Building
} from 'lucide-react';
import { InstantUser } from '../lib/instantAuth';
import {
  Expert,
  Consultation,
  MentorshipProgram,
  ExpertSpecialization
} from '../types/collaboration';
import HarmonizedCard from './HarmonizedCard';
import { HCLStat, HCLKeyword, HCLAttribute, HCLAction } from './HarmonizedCard';

interface ExpertNetworkProps {
  currentUser: InstantUser;
}

const ExpertNetwork: React.FC<ExpertNetworkProps> = ({ currentUser }) => {
  const [activeView, setActiveView] = useState<'experts' | 'consultations' | 'mentorship' | 'reviews'>('experts');
  const [selectedSpecialization, setSelectedSpecialization] = useState<ExpertSpecialization | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'experience' | 'response_time'>('rating');
  const [priceRange, setPriceRange] = useState<'all' | 'budget' | 'mid' | 'premium'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);

  // Mock data
  const [experts] = useState<Expert[]>([
    {
      id: 'expert-1',
      user_id: 'user-expert-1',
      display_name: 'Dr. Michael Chen',
      title: 'Senior Patent Attorney & IP Strategist',
      company: 'Chen & Associates IP Law',
      bio: 'Over 15 years of experience in AI/ML patent prosecution and IP strategy. Former USPTO examiner with deep technical background in computer science and artificial intelligence. Specialized in helping startups and tech companies build robust patent portfolios.',
      avatar_url: '/api/placeholder/60/60',
      specializations: ['patent_law', 'technical_writing', 'ip_strategy'],
      years_experience: 15,
      hourly_rate: 350,
      currency: 'USD',
      rating: 4.9,
      review_count: 127,
      consultation_count: 234,
      response_time_hours: 2,
      is_available: true,
      availability_schedule: {
        timezone: 'PST',
        hours: 'Mon-Fri 9AM-5PM',
        booking_lead_time: 24
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'expert-2',
      user_id: 'user-expert-2',
      display_name: 'Sarah Williams',
      title: 'Biotech Patent Consultant',
      company: 'BioIP Solutions',
      bio: 'Specialized in biotechnology and pharmaceutical patents with extensive experience in FDA regulatory processes. PhD in Molecular Biology with 12+ years in patent law. Expert in patent landscape analysis and freedom-to-operate studies.',
      avatar_url: '/api/placeholder/60/60',
      specializations: ['patent_law', 'prior_art', 'licensing'],
      years_experience: 12,
      hourly_rate: 275,
      currency: 'USD',
      rating: 4.8,
      review_count: 98,
      consultation_count: 156,
      response_time_hours: 4,
      is_available: true,
      availability_schedule: {
        timezone: 'EST',
        hours: 'Mon-Thu 10AM-6PM',
        booking_lead_time: 48
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'expert-3',
      user_id: 'user-expert-3',
      display_name: 'David Kumar',
      title: 'Former USPTO Patent Examiner',
      company: 'Independent Consultant',
      bio: 'Former USPTO examiner with 10 years of examination experience in software and business method patents. Now provides consultation on patentability assessments, office action responses, and prosecution strategy. Known for practical, examiner-perspective advice.',
      avatar_url: '/api/placeholder/60/60',
      specializations: ['prosecution', 'prior_art', 'technical_writing'],
      years_experience: 10,
      hourly_rate: 225,
      currency: 'USD',
      rating: 4.7,
      review_count: 156,
      consultation_count: 289,
      response_time_hours: 6,
      is_available: false,
      availability_schedule: {
        timezone: 'EST',
        hours: 'Flexible',
        booking_lead_time: 72
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'expert-4',
      user_id: 'user-expert-4',
      display_name: 'Jennifer Lopez',
      title: 'IP Licensing & Monetization Expert',
      company: 'Global IP Ventures',
      bio: 'Expert in IP licensing, monetization strategies, and patent portfolio valuation. 8+ years experience helping companies maximize the value of their IP assets through strategic licensing and partnerships. MBA + JD with technical background in engineering.',
      avatar_url: '/api/placeholder/60/60',
      specializations: ['licensing', 'ip_strategy', 'patent_law'],
      years_experience: 8,
      hourly_rate: 300,
      currency: 'USD',
      rating: 4.9,
      review_count: 73,
      consultation_count: 134,
      response_time_hours: 3,
      is_available: true,
      availability_schedule: {
        timezone: 'PST',
        hours: 'Mon-Fri 8AM-4PM',
        booking_lead_time: 24
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [consultations] = useState<Consultation[]>([
    {
      id: 'consult-1',
      expert_id: 'expert-1',
      client_id: currentUser.id,
      title: 'AI Patent Strategy Review',
      description: 'Need expert review of our AI patent portfolio and strategy recommendations',
      type: 'one_time',
      status: 'completed',
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      duration_minutes: 60,
      rate_per_hour: 350,
      total_cost: 350,
      payment_status: 'paid',
      meeting_url: 'https://meet.example.com/ai-patent-review',
      notes: 'Great session with actionable insights on patent landscape',
      deliverables: ['Portfolio analysis report', 'Strategy recommendations', 'Next steps checklist'],
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'consult-2',
      expert_id: 'expert-2',
      client_id: currentUser.id,
      title: 'Biotech Prior Art Analysis',
      description: 'Prior art search and patentability assessment for new biotech invention',
      type: 'project_based',
      status: 'in_progress',
      scheduled_at: new Date(Date.now() + 172800000).toISOString(),
      duration_minutes: 90,
      rate_per_hour: 275,
      total_cost: 412.5,
      payment_status: 'pending',
      notes: 'Comprehensive analysis in progress',
      deliverables: ['Prior art search report', 'Patentability opinion', 'Claim recommendations'],
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [mentorshipPrograms] = useState<MentorshipProgram[]>([
    {
      id: 'mentorship-1',
      mentor_id: 'expert-1',
      mentee_id: currentUser.id,
      program_type: 'ip_strategy',
      status: 'active',
      start_date: new Date(Date.now() - 2592000000).toISOString(),
      end_date: new Date(Date.now() + 2592000000).toISOString(),
      session_count: 8,
      progress_percentage: 62,
      goals: [
        'Learn IP strategy fundamentals',
        'Develop patent portfolio planning skills',
        'Understand licensing basics'
      ],
      created_at: new Date(Date.now() - 2592000000).toISOString(),
    },
  ]);

  const getFilteredExperts = () => {
    let filtered = experts;

    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter(expert => expert.specializations.includes(selectedSpecialization));
    }

    if (priceRange !== 'all') {
      filtered = filtered.filter(expert => {
        const rate = expert.hourly_rate || 0;
        switch (priceRange) {
          case 'budget': return rate < 200;
          case 'mid': return rate >= 200 && rate < 300;
          case 'premium': return rate >= 300;
          default: return true;
        }
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(expert =>
        expert.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return (a.hourly_rate || 0) - (b.hourly_rate || 0);
        case 'experience':
          return b.years_experience - a.years_experience;
        case 'response_time':
          return a.response_time_hours - b.response_time_hours;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getSpecializationLabel = (spec: ExpertSpecialization): string => {
    switch (spec) {
      case 'patent_law': return 'Patent Law';
      case 'technical_writing': return 'Technical Writing';
      case 'prior_art': return 'Prior Art';
      case 'ip_strategy': return 'IP Strategy';
      case 'licensing': return 'Licensing';
      case 'prosecution': return 'Prosecution';
      case 'litigation': return 'Litigation';
      default: return spec;
    }
  };

  const getSpecializationIcon = (spec: ExpertSpecialization) => {
    switch (spec) {
      case 'patent_law': return <Badge className="w-3 h-3" />;
      case 'technical_writing': return <FileText className="w-3 h-3" />;
      case 'prior_art': return <Search className="w-3 h-3" />;
      case 'ip_strategy': return <Target className="w-3 h-3" />;
      case 'licensing': return <CreditCard className="w-3 h-3" />;
      case 'prosecution': return <BookOpen className="w-3 h-3" />;
      case 'litigation': return <Briefcase className="w-3 h-3" />;
      default: return <Badge className="w-3 h-3" />;
    }
  };

  const renderExperts = () => {
    const filteredExperts = getFilteredExperts();

    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value as ExpertSpecialization | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Specializations</option>
              <option value="patent_law">Patent Law</option>
              <option value="technical_writing">Technical Writing</option>
              <option value="prior_art">Prior Art</option>
              <option value="ip_strategy">IP Strategy</option>
              <option value="licensing">Licensing</option>
              <option value="prosecution">Prosecution</option>
              <option value="litigation">Litigation</option>
            </select>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Price Ranges</option>
              <option value="budget">Budget (&lt;$200/hr)</option>
              <option value="mid">Mid-range ($200-$300/hr)</option>
              <option value="premium">Premium ($300+/hr)</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="price">Lowest Price</option>
              <option value="experience">Most Experience</option>
              <option value="response_time">Fastest Response</option>
            </select>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Expert Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExperts.map((expert) => {
            const stats: HCLStat[] = [
              { label: "Rating", value: `${expert.rating}/5`, icon: Star, color: "text-yellow-600" },
              { label: "Reviews", value: expert.review_count, icon: MessageSquare, color: "text-blue-600" },
              { label: "Sessions", value: expert.consultation_count, icon: Video, color: "text-green-600" },
              { label: "Response", value: `${expert.response_time_hours}h`, icon: Clock, color: "text-purple-600" }
            ];

            const keywords: HCLKeyword[] = [
              { label: expert.is_available ? 'Available' : 'Busy', color: expert.is_available ? 'green' : 'red' },
              { label: `$${expert.hourly_rate}/hr`, color: 'blue' },
              { label: `${expert.years_experience}y exp`, color: 'purple' }
            ];

            const attributes: HCLAttribute[] = [
              { label: "Company", value: expert.company || 'Independent', icon: Building },
              { label: "Experience", value: `${expert.years_experience} years`, icon: Award },
              { label: "Response Time", value: `${expert.response_time_hours} hours`, icon: Timer }
            ];

            const actions: HCLAction[] = [
              { id: 'view', label: 'View Profile', icon: Eye, onClick: () => setSelectedExpert(expert), isPrimary: true, variant: 'secondary' },
              { id: 'book', label: 'Book Consultation', icon: Calendar, onClick: () => { setSelectedExpert(expert); setShowBookModal(true); }, isPrimary: true, variant: 'primary' },
              { id: 'message', label: 'Message', icon: MessageCircle, onClick: () => {} }
            ];

            return (
              <HarmonizedCard
                key={expert.id}
                title={expert.display_name}
                description={expert.title}
                stats={stats}
                keywords={keywords}
                attributes={attributes}
                actions={actions}
                colorAccent={expert.is_available ? '#10b981' : '#ef4444'}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderConsultations = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">My Consultations</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Book New Consultation
          </button>
        </div>

        <div className="space-y-4">
          {consultations.map((consultation) => {
            const expert = experts.find(e => e.id === consultation.expert_id);
            const isUpcoming = new Date(consultation.scheduled_at || '') > new Date();

            const stats: HCLStat[] = [
              { label: "Duration", value: `${consultation.duration_minutes}min`, icon: Clock, color: "text-blue-600" },
              { label: "Cost", value: `$${consultation.total_cost}`, icon: DollarSign, color: "text-green-600" },
              { label: "Type", value: consultation.type.replace('_', ' '), icon: Video, color: "text-purple-600" }
            ];

            const keywords: HCLKeyword[] = [
              { label: consultation.status.replace('_', ' '), color: 
                consultation.status === 'completed' ? 'green' : 
                consultation.status === 'in_progress' ? 'blue' : 
                consultation.status === 'accepted' ? 'yellow' : 'gray' },
              { label: consultation.payment_status, color: consultation.payment_status === 'paid' ? 'green' : 'orange' }
            ];

            const attributes: HCLAttribute[] = [
              { label: "Expert", value: expert?.display_name || 'Unknown', icon: User },
              { label: "Scheduled", value: consultation.scheduled_at ? new Date(consultation.scheduled_at).toLocaleDateString() : 'TBD', icon: CalendarIcon },
              { label: "Created", value: new Date(consultation.created_at).toLocaleDateString(), icon: Clock }
            ];

            const actions: HCLAction[] = [
              { id: 'view', label: 'View Details', icon: Eye, onClick: () => {}, isPrimary: true, variant: 'primary' as const },
              ...(isUpcoming && consultation.meeting_url ? [{ id: 'join', label: 'Join Meeting', icon: Video, onClick: () => {}, isPrimary: true, variant: 'secondary' as const }] : []),
              ...(consultation.deliverables && consultation.deliverables.length > 0 ? [{ id: 'download', label: 'Deliverables', icon: Download, onClick: () => {} }] : [])
            ];

            return (
              <HarmonizedCard
                key={consultation.id}
                title={consultation.title}
                description={consultation.description}
                stats={stats}
                keywords={keywords}
                attributes={attributes}
                actions={actions}
                colorAccent={
                  consultation.status === 'completed' ? '#10b981' :
                  consultation.status === 'in_progress' ? '#3b82f6' :
                  consultation.status === 'accepted' ? '#f59e0b' : '#6b7280'
                }
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderMentorship = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Mentorship Programs</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Find Mentor
          </button>
        </div>

        {mentorshipPrograms.length > 0 ? (
          <div className="space-y-4">
            {mentorshipPrograms.map((program) => {
              const mentor = experts.find(e => e.id === program.mentor_id);

              const stats: HCLStat[] = [
                { label: "Progress", value: `${program.progress_percentage}%`, icon: TrendingUp, color: "text-green-600" },
                { label: "Sessions", value: program.session_count, icon: Video, color: "text-blue-600" },
                { label: "Duration", value: Math.ceil((new Date(program.end_date || '').getTime() - new Date(program.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)) + ' months', icon: Clock, color: "text-purple-600" }
              ];

              const keywords: HCLKeyword[] = [
                { label: program.status, color: program.status === 'active' ? 'green' : program.status === 'completed' ? 'blue' : 'gray' },
                { label: program.program_type.replace('_', ' '), color: 'purple' }
              ];

              const attributes: HCLAttribute[] = [
                { label: "Mentor", value: mentor?.display_name || 'Unknown', icon: Crown },
                { label: "Started", value: new Date(program.start_date).toLocaleDateString(), icon: CalendarIcon },
                { label: "Goals", value: `${program.goals.length} objectives`, icon: Target }
              ];

              const actions: HCLAction[] = [
                { id: 'view', label: 'View Program', icon: Eye, onClick: () => {}, isPrimary: true, variant: 'primary' },
                { id: 'schedule', label: 'Schedule Session', icon: Calendar, onClick: () => {}, isPrimary: true, variant: 'secondary' }
              ];

              return (
                <HarmonizedCard
                  key={program.id}
                  title={`${program.program_type.replace('_', ' ').toUpperCase()} Mentorship`}
                  description={`Working with ${mentor?.display_name} to achieve your IP career goals`}
                  stats={stats}
                  keywords={keywords}
                  attributes={attributes}
                  actions={actions}
                  colorAccent="#8b5cf6"
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Mentorship Programs</h3>
            <p className="text-gray-600 mb-4">Connect with experienced professionals to accelerate your IP career</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
              <Plus className="w-4 h-4" />
              Find a Mentor
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Expert Reviews</h2>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="verified">Verified Only</option>
          </select>
        </div>

        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews Coming Soon</h3>
          <p className="text-gray-600">Expert review system will be available soon</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Expert Network</h1>
              <p className="text-gray-600 mt-1">Connect with patent professionals and IP experts</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="text-blue-600 font-semibold">{experts.filter(e => e.is_available).length}</span> experts available
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6">
            {[
              { id: 'experts', label: 'Find Experts', icon: Users },
              { id: 'consultations', label: 'My Consultations', icon: Video },
              { id: 'mentorship', label: 'Mentorship', icon: Crown },
              { id: 'reviews', label: 'Reviews', icon: Star },
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
        {activeView === 'experts' && renderExperts()}
        {activeView === 'consultations' && renderConsultations()}
        {activeView === 'mentorship' && renderMentorship()}
        {activeView === 'reviews' && renderReviews()}
      </div>

      {/* Expert Profile Modal */}
      {selectedExpert && !showBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Expert Profile</h3>
              <button
                onClick={() => setSelectedExpert(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Expert Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {selectedExpert.avatar_url ? (
                    <img src={selectedExpert.avatar_url} alt={selectedExpert.display_name} className="w-16 h-16 rounded-full" />
                  ) : (
                    <User className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedExpert.display_name}</h4>
                  <p className="text-gray-600">{selectedExpert.title}</p>
                  <p className="text-sm text-gray-500">{selectedExpert.company}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{selectedExpert.rating}</span>
                      <span className="text-sm text-gray-500">({selectedExpert.review_count} reviews)</span>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      selectedExpert.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedExpert.is_available ? 'Available' : 'Busy'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">About</h5>
                <p className="text-gray-600 text-sm">{selectedExpert.bio}</p>
              </div>

              {/* Specializations */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Specializations</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedExpert.specializations.map((spec) => (
                    <span key={spec} className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                      {getSpecializationIcon(spec)}
                      {getSpecializationLabel(spec)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">${selectedExpert.hourly_rate}/hr</div>
                  <div className="text-sm text-gray-600">Rate</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{selectedExpert.years_experience}y</div>
                  <div className="text-sm text-gray-600">Experience</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{selectedExpert.consultation_count}</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{selectedExpert.response_time_hours}h</div>
                  <div className="text-sm text-gray-600">Response</div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Availability</h5>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">
                    <div>Timezone: {selectedExpert.availability_schedule.timezone}</div>
                    <div>Hours: {selectedExpert.availability_schedule.hours}</div>
                    <div>Booking lead time: {selectedExpert.availability_schedule.booking_lead_time} hours</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Book Consultation
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Consultation Modal */}
      {showBookModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Book Consultation</h3>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center py-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedExpert.display_name}</h4>
                <p className="text-sm text-gray-600">${selectedExpert.hourly_rate}/hour</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>One-time consultation</option>
                  <option>Ongoing support</option>
                  <option>Project-based</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What would you like to discuss?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>30 minutes - ${(selectedExpert.hourly_rate || 0) / 2}</option>
                  <option>60 minutes - ${selectedExpert.hourly_rate || 0}</option>
                  <option>90 minutes - ${(selectedExpert.hourly_rate || 0) * 1.5}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date(Date.now() + selectedExpert.availability_schedule.booking_lead_time * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide context about your consultation needs..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBookModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowBookModal(false);
                  setSelectedExpert(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertNetwork;