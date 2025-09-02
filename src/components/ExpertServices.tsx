import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  DollarSign,
  MessageCircle,
  Award,
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  TrendingUp,
  Zap,
  Shield,
  Target,
  BookOpen,
  Eye,
  FileText,
  Send,
  Phone,
  Video,
  Mail
} from 'lucide-react';
import { ServiceListing, MarketplaceFilters } from '../types/marketplace';
import HarmonizedCard from './HarmonizedCard';
import PageHeader from './PageHeader';

// Mock data for service listings
const mockServiceListings: ServiceListing[] = [
  {
    id: 'svc-001',
    title: 'Complete Patent Landscape Analysis & Strategy',
    description: 'Comprehensive patent landscape mapping with competitive analysis, white space identification, and strategic recommendations for R&D and IP portfolio development.',
    category: 'patent_consulting',
    subcategory: 'Landscape Analysis',
    provider: {
      id: 'p-001',
      name: 'Dr. Elena Martinez',
      title: 'Senior Patent Strategist',
      company: 'IP Strategy Partners',
      avatar: '/api/placeholder/60/60',
      bio: 'Former USPTO examiner with 15+ years in patent analysis and IP strategy. Specialized in AI, biotech, and clean energy technologies. Published author and frequent speaker at IP conferences.',
      location: 'Washington, DC',
      timezone: 'EST',
      languages: ['English', 'Spanish', 'Portuguese'],
      education: [
        {
          institution: 'MIT',
          degree: 'PhD',
          field: 'Electrical Engineering',
          year: 2008
        },
        {
          institution: 'Georgetown Law',
          degree: 'JD',
          field: 'Intellectual Property Law',
          year: 2010
        }
      ],
      experience: [
        {
          company: 'USPTO',
          position: 'Patent Examiner',
          duration: '2010-2015',
          description: 'Examined 500+ patent applications in AI and machine learning technologies'
        },
        {
          company: 'BigTech Corp',
          position: 'IP Strategy Director',
          duration: '2015-2020',
          description: 'Led IP strategy for AI division, managed $50M patent portfolio'
        }
      ],
      certifications: [
        {
          name: 'Registered Patent Attorney',
          issuer: 'USPTO',
          date: '2010-12-15',
          credentialId: 'REG-789456',
          verified: true
        }
      ],
      totalEarnings: 2500000,
      projectsCompleted: 247,
      clientSatisfaction: 4.9,
      responseTime: '< 2 hours',
      availability: 'full-time',
      portfolio: [
        {
          id: 'port-001',
          title: 'AI Patent Landscape for Fortune 500 Tech Company',
          description: 'Comprehensive analysis of AI patent landscape identifying 50+ acquisition opportunities',
          category: 'Patent Analysis',
          images: ['/api/placeholder/300/200'],
          results: 'Identified $25M in strategic patent acquisitions, avoided 3 potential infringement issues',
          clientTestimonial: 'Exceptional analysis that guided our entire AI IP strategy',
          date: '2024-03-15'
        }
      ],
      testimonials: [
        {
          id: 'test-001',
          clientName: 'Sarah Johnson',
          clientTitle: 'VP IP, TechInnovate',
          comment: 'Elena provided invaluable insights that saved us millions in potential litigation costs.',
          rating: 5,
          date: '2024-07-20',
          projectTitle: 'Patent Risk Assessment'
        }
      ]
    },
    deliverables: [
      'Comprehensive patent landscape report (50-100 pages)',
      'Interactive patent mapping visualization',
      'Competitive analysis dashboard',
      'White space opportunity matrix',
      'Strategic recommendations document',
      'Executive summary presentation'
    ],
    timeline: '4-6 weeks',
    methodology: 'Proprietary AI-powered patent analysis combined with manual expert review. Includes semantic search, citation analysis, and forward/backward patent mapping.',
    requirements: [
      'Technology area specification',
      'Geographic scope definition',
      'Competitive landscape parameters',
      'Access to confidential IP if needed'
    ],
    pricing: {
      model: 'fixed',
      basePrice: 25000,
      currency: 'USD',
      milestones: [
        {
          name: 'Initial Analysis',
          description: 'Patent search and initial categorization',
          deliverables: ['Preliminary patent dataset', 'Initial analysis framework'],
          payment: 7500,
          timeline: '1 week'
        },
        {
          name: 'Deep Analysis',
          description: 'Comprehensive analysis and competitive mapping',
          deliverables: ['Detailed patent analysis', 'Competitive positioning'],
          payment: 12500,
          timeline: '3 weeks'
        },
        {
          name: 'Strategic Recommendations',
          description: 'Final report and strategic recommendations',
          deliverables: ['Final report', 'Executive presentation'],
          payment: 5000,
          timeline: '1 week'
        }
      ]
    },
    status: 'active',
    listedDate: '2024-07-01',
    completedProjects: 85,
    rating: 4.9,
    reviews: [
      {
        id: 'rev-001',
        clientId: 'c-001',
        clientName: 'Innovation Labs Inc',
        rating: 5,
        comment: 'Outstanding work. The analysis was thorough and the strategic insights were game-changing for our patent portfolio decisions.',
        date: '2024-07-15',
        projectTitle: 'Biotech Patent Landscape',
        categories: {
          communication: 5,
          quality: 5,
          timeliness: 4,
          expertise: 5
        }
      }
    ],
    badges: [
      {
        type: 'top_rated',
        name: 'Top Rated Plus',
        description: 'Consistently excellent client reviews',
        earnedDate: '2024-01-15'
      },
      {
        type: 'expert_vetted',
        name: 'Expert Vetted',
        description: 'Credentials verified by platform experts',
        earnedDate: '2023-08-10'
      }
    ],
    skills: ['Patent Analysis', 'IP Strategy', 'Competitive Intelligence', 'Technology Assessment', 'Portfolio Management'],
    certifications: ['USPTO Registered Attorney', 'Patent Bar Certified', 'IP Valuation Certified']
  },
  {
    id: 'svc-002',
    title: 'Technical Patent Analysis & Prior Art Search',
    description: 'Expert technical analysis of patent applications, comprehensive prior art searches, and patentability assessments using advanced search methodologies.',
    category: 'technical_analysis',
    subcategory: 'Prior Art Search',
    provider: {
      id: 'p-002',
      name: 'James Chen',
      title: 'Technical Patent Analyst',
      company: 'TechSearch Pro',
      avatar: '/api/placeholder/60/60',
      bio: 'PhD in Computer Science with deep expertise in AI, machine learning, and software patents. Former Google engineer with 10+ years in patent technical analysis.',
      location: 'San Francisco, CA',
      timezone: 'PST',
      languages: ['English', 'Mandarin', 'Korean'],
      education: [
        {
          institution: 'Stanford University',
          degree: 'PhD',
          field: 'Computer Science',
          year: 2014
        }
      ],
      experience: [
        {
          company: 'Google',
          position: 'Senior Software Engineer',
          duration: '2014-2020',
          description: 'Led AI research projects, authored 25+ patent applications'
        }
      ],
      certifications: [],
      totalEarnings: 850000,
      projectsCompleted: 156,
      clientSatisfaction: 4.8,
      responseTime: '< 4 hours',
      availability: 'part-time',
      portfolio: [
        {
          id: 'port-002',
          title: 'AI Patent Prior Art Analysis',
          description: 'Comprehensive prior art search for machine learning patent application',
          category: 'Prior Art Search',
          images: ['/api/placeholder/300/200'],
          results: 'Identified 150+ relevant prior art references, prevented potential rejection',
          date: '2024-06-20'
        }
      ],
      testimonials: []
    },
    deliverables: [
      'Comprehensive prior art search report',
      'Technical analysis of key references',
      'Patentability assessment',
      'Claim chart analysis',
      'Search strategy documentation'
    ],
    timeline: '2-3 weeks',
    methodology: 'Multi-database search across patent and non-patent literature using semantic search, keyword combinations, and classification-based strategies.',
    requirements: [
      'Patent application or invention disclosure',
      'Technical specifications',
      'Scope of search parameters'
    ],
    pricing: {
      model: 'fixed',
      basePrice: 5000,
      currency: 'USD'
    },
    status: 'active',
    listedDate: '2024-06-15',
    completedProjects: 156,
    rating: 4.8,
    reviews: [
      {
        id: 'rev-002',
        clientId: 'c-002',
        clientName: 'StartupTech LLC',
        rating: 5,
        comment: 'Incredibly thorough analysis. James found prior art that other searchers missed.',
        date: '2024-06-25',
        projectTitle: 'AI Algorithm Prior Art',
        categories: {
          communication: 4,
          quality: 5,
          timeliness: 5,
          expertise: 5
        }
      }
    ],
    badges: [
      {
        type: 'fast_delivery',
        name: 'Fast Delivery',
        description: 'Consistently delivers ahead of schedule',
        earnedDate: '2024-03-10'
      }
    ],
    skills: ['Prior Art Search', 'Technical Analysis', 'Patent Drafting', 'Software Patents'],
    certifications: ['Technical Search Specialist']
  }
];

export default function ExpertServices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceListing | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'provider' | 'portfolio' | 'reviews'>('overview');

  // Filter services based on search and filters
  const filteredServices = useMemo(() => {
    let filtered = mockServiceListings;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.skills.some(skill => skill.toLowerCase().includes(query)) ||
        service.category.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.serviceCategory?.length) {
      filtered = filtered.filter(service => filters.serviceCategory!.includes(service.category));
    }

    if (filters.providerRating) {
      filtered = filtered.filter(service => service.rating >= filters.providerRating!);
    }

    if (filters.budget) {
      filtered = filtered.filter(service => 
        service.pricing.basePrice >= filters.budget!.min && 
        service.pricing.basePrice <= filters.budget!.max
      );
    }

    return filtered;
  }, [searchQuery, filters]);

  const createServiceStats = (service: ServiceListing) => [
    {
      label: 'Starting Price',
      value: `$${service.pricing.basePrice.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Rating',
      value: service.rating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      label: 'Projects Done',
      value: service.completedProjects,
      icon: Briefcase,
      color: 'text-blue-600'
    },
    {
      label: 'Response Time',
      value: service.provider.responseTime,
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  const createServiceKeywords = (service: ServiceListing) =>
    service.skills.slice(0, 4).map(skill => ({
      label: skill,
      color: 'bg-purple-100 text-purple-800'
    }));

  const createServiceAttributes = (service: ServiceListing) => [
    {
      label: 'Category',
      value: service.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      icon: Target
    },
    {
      label: 'Timeline',
      value: service.timeline,
      icon: Calendar
    },
    {
      label: 'Location',
      value: service.provider.location,
      icon: MapPin
    },
    {
      label: 'Availability',
      value: service.provider.availability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      icon: Clock
    }
  ];

  const createServiceActions = (service: ServiceListing) => [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: () => setSelectedService(service),
      variant: 'primary' as const,
      isPrimary: true
    },
    {
      id: 'contact',
      label: 'Contact Expert',
      icon: MessageCircle,
      onClick: () => handleContact(service),
      variant: 'secondary' as const
    },
    {
      id: 'hire',
      label: 'Hire Now',
      icon: Send,
      onClick: () => handleHire(service),
      variant: 'secondary' as const
    }
  ];

  const handleContact = (service: ServiceListing) => {
    console.log('Contacting expert:', service.provider.id);
  };

  const handleHire = (service: ServiceListing) => {
    console.log('Hiring expert:', service.provider.id);
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'top_rated': return Star;
      case 'expert_vetted': return Shield;
      case 'fast_delivery': return Zap;
      case 'rising_talent': return TrendingUp;
      default: return Award;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'top_rated': return 'bg-yellow-100 text-yellow-800';
      case 'expert_vetted': return 'bg-green-100 text-green-800';
      case 'fast_delivery': return 'bg-blue-100 text-blue-800';
      case 'rising_talent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <PageHeader 
        title="Expert Services" 
        subtitle="Connect with top IP professionals and service providers"
      />

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search services by title, skills, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Category
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    serviceCategory: e.target.value ? [e.target.value] : undefined
                  })}
                >
                  <option value="">All Categories</option>
                  <option value="patent_consulting">Patent Consulting</option>
                  <option value="legal_services">Legal Services</option>
                  <option value="technical_analysis">Technical Analysis</option>
                  <option value="market_research">Market Research</option>
                  <option value="ip_strategy">IP Strategy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    providerRating: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Budget ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    budget: {
                      min: parseInt(e.target.value) || 0,
                      max: filters.budget?.max || 100000
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Budget ($)
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    budget: {
                      min: filters.budget?.min || 0,
                      max: parseInt(e.target.value) || 100000
                    }
                  })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredServices.length} services found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded px-3 py-1">
              <option>Relevance</option>
              <option>Highest Rated</option>
              <option>Most Reviews</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Listings */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <HarmonizedCard
              key={service.id}
              title={service.title}
              description={service.description}
              stats={createServiceStats(service)}
              keywords={createServiceKeywords(service)}
              attributes={createServiceAttributes(service)}
              actions={createServiceActions(service)}
              colorAccent="border-purple-200"
              onTitleClick={() => setSelectedService(service)}
              className="hover:shadow-lg transition-shadow"
            />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedService.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedService.description}</p>
                  
                  {/* Provider Info */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedService.provider.avatar} 
                      alt={selectedService.provider.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{selectedService.provider.name}</div>
                      <div className="text-sm text-gray-600">{selectedService.provider.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{selectedService.rating}</span>
                        <span className="text-sm text-gray-600">
                          ({selectedService.reviews.length} reviews)
                        </span>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex gap-2">
                      {selectedService.badges.map((badge, index) => {
                        const BadgeIcon = getBadgeIcon(badge.type);
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getBadgeColor(badge.type)}`}
                            title={badge.description}
                          >
                            <BadgeIcon className="h-3 w-3" />
                            {badge.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mt-6 border-b">
                {['overview', 'provider', 'portfolio', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab as any)}
                    className={`px-4 py-2 border-b-2 font-medium text-sm ${
                      selectedTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {selectedTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Service Details</h3>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">What You'll Get</h4>
                      <ul className="space-y-2">
                        {selectedService.deliverables.map((deliverable, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            <span className="text-sm">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Requirements</h4>
                      <ul className="space-y-1">
                        {selectedService.requirements.map((requirement, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            • {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Methodology</h4>
                      <p className="text-sm text-gray-700">{selectedService.methodology}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pricing & Timeline</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-green-600">
                          ${selectedService.pricing.basePrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-600">
                          {selectedService.pricing.model === 'fixed' ? 'Fixed Price' : 'Starting at'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Timeline: {selectedService.timeline}
                      </div>
                    </div>

                    {selectedService.pricing.milestones && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Project Milestones</h4>
                        <div className="space-y-3">
                          {selectedService.pricing.milestones.map((milestone, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium">{milestone.name}</div>
                                <div className="font-semibold text-green-600">
                                  ${milestone.payment.toLocaleString()}
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {milestone.description}
                              </div>
                              <div className="text-xs text-gray-500">
                                Timeline: {milestone.timeline}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                        <Send className="h-5 w-5" />
                        Start Project
                      </button>
                      <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'provider' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">About the Expert</h3>
                    <p className="text-gray-700 mb-6">{selectedService.provider.bio}</p>

                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Education</h4>
                      <div className="space-y-3">
                        {selectedService.provider.education.map((edu, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="font-medium">{edu.degree} in {edu.field}</div>
                              <div className="text-sm text-gray-600">{edu.institution}, {edu.year}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Experience</h4>
                      <div className="space-y-4">
                        {selectedService.provider.experience.map((exp, index) => (
                          <div key={index} className="border-l-2 border-blue-200 pl-4">
                            <div className="font-medium">{exp.position}</div>
                            <div className="text-sm text-blue-600">{exp.company}</div>
                            <div className="text-sm text-gray-600">{exp.duration}</div>
                            <div className="text-sm text-gray-700 mt-1">{exp.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Performance Stats</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedService.provider.projectsCompleted}
                        </div>
                        <div className="text-sm text-gray-600">Projects Completed</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedService.provider.clientSatisfaction}
                        </div>
                        <div className="text-sm text-gray-600">Client Satisfaction</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          ${(selectedService.provider.totalEarnings / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-gray-600">Total Earnings</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedService.provider.responseTime}
                        </div>
                        <div className="text-sm text-gray-600">Response Time</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Languages</h4>
                      <div className="flex gap-2">
                        {selectedService.provider.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Video className="h-4 w-4" />
                        Video Call
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Phone className="h-4 w-4" />
                        Phone
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Mail className="h-4 w-4" />
                        Email
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'portfolio' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
                  {selectedService.provider.portfolio.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedService.provider.portfolio.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden">
                          <img 
                            src={item.images[0]} 
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="font-semibold mb-2">{item.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                            <div className="mb-3">
                              <span className="text-sm font-medium text-gray-700">Results: </span>
                              <span className="text-sm text-gray-600">{item.results}</span>
                            </div>
                            {item.clientTestimonial && (
                              <blockquote className="text-sm italic text-gray-600 border-l-2 border-gray-300 pl-3">
                                "{item.clientTestimonial}"
                              </blockquote>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No portfolio items available</p>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Client Reviews</h3>
                  {selectedService.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {selectedService.reviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium">{review.clientName}</div>
                              <div className="text-sm text-gray-600">{review.projectTitle}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4">{review.comment}</p>
                          
                          <div className="grid grid-cols-4 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-sm font-medium">{review.categories.communication}</div>
                              <div className="text-xs text-gray-600">Communication</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">{review.categories.quality}</div>
                              <div className="text-xs text-gray-600">Quality</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">{review.categories.timeliness}</div>
                              <div className="text-xs text-gray-600">Timeliness</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">{review.categories.expertise}</div>
                              <div className="text-xs text-gray-600">Expertise</div>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No reviews yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}