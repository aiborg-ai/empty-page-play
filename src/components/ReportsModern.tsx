import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  ChevronRight,
  Clock,
  TrendingUp,
  BarChart3,
  Download,
  Share2,
  Eye,
  Star,
  Tag,
  Zap,
  Globe,
  Shield,
  Users,
  PieChart,
  LineChart,
  Activity,
  X,
  Filter,
  CheckCircle,
  Calendar
} from 'lucide-react';
import SearchFilterBar from './common/SearchFilterBar';
import HelpIcon from './utils/HelpIcon';

interface ReportsModernProps {
  currentUser: any;
  projectId?: string;
  onNavigate?: (section: string) => void;
}

const REPORT_TYPES = [
  {
    id: 'landscape',
    title: 'Landscape Analysis',
    icon: Globe,
    color: 'blue',
    description: 'Comprehensive patent landscape overview'
  },
  {
    id: 'competitive',
    title: 'Competitive Intelligence',
    icon: Shield,
    color: 'red',
    description: 'Competitor patent portfolio analysis'
  },
  {
    id: 'trend',
    title: 'Trend Analysis',
    icon: TrendingUp,
    color: 'green',
    description: 'Technology trend identification'
  },
  {
    id: 'citation',
    title: 'Citation Network',
    icon: LineChart,
    color: 'purple',
    description: 'Patent citation relationship mapping'
  },
  {
    id: 'portfolio',
    title: 'Portfolio Assessment',
    icon: PieChart,
    color: 'orange',
    description: 'IP portfolio strength evaluation'
  },
  {
    id: 'freedom',
    title: 'Freedom to Operate',
    icon: Activity,
    color: 'indigo',
    description: 'FTO analysis and risk assessment'
  }
];

const SAMPLE_REPORTS = [
  {
    id: 1,
    title: 'Q4 2024 AI Patent Landscape Analysis',
    type: 'landscape',
    created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    author: 'Sarah Chen',
    status: 'completed',
    pages: 45,
    views: 234,
    rating: 4.8,
    tags: ['AI', 'Machine Learning', 'Q4 2024'],
    shared: true,
    team: ['John Doe', 'Mike Rodriguez']
  },
  {
    id: 2,
    title: 'Competitor Analysis: TechCorp Patents',
    type: 'competitive',
    created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    author: 'John Doe',
    status: 'completed',
    pages: 32,
    views: 156,
    rating: 4.6,
    tags: ['Competitive', 'TechCorp', 'Analysis'],
    shared: false,
    team: []
  },
  {
    id: 3,
    title: 'Renewable Energy Patent Trends 2024',
    type: 'trend',
    created: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    author: 'Emma Wilson',
    status: 'draft',
    pages: 28,
    views: 89,
    rating: 0,
    tags: ['Renewable', 'Energy', 'Trends'],
    shared: true,
    team: ['Sarah Chen']
  }
];

// Define FilterSection interface
interface FilterSection {
  id: string;
  title: string;
  icon: any;
  filters: any[];
}

export default function ReportsModern({ onNavigate }: ReportsModernProps) {
  const [reports] = useState(SAMPLE_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Filter sections configuration
  const filterSections: FilterSection[] = [
    {
      id: 'status',
      title: 'Status',
      icon: CheckCircle,
      filters: [
        {
          id: 'report_status',
          label: 'Report Status',
          type: 'checkbox',
          options: [
            { value: 'draft', label: 'Draft', count: 12 },
            { value: 'in_progress', label: 'In Progress', count: 8 },
            { value: 'completed', label: 'Completed', count: 45 },
            { value: 'archived', label: 'Archived', count: 23 }
          ],
          value: activeFilters.report_status || []
        }
      ]
    },
    {
      id: 'date_range',
      title: 'Date Range',
      icon: Calendar,
      filters: [
        {
          id: 'created_after',
          label: 'Created After',
          type: 'date',
          value: activeFilters.created_after || ''
        },
        {
          id: 'created_before',
          label: 'Created Before',
          type: 'date',
          value: activeFilters.created_before || ''
        }
      ]
    },
    {
      id: 'collaboration',
      title: 'Collaboration',
      icon: Users,
      filters: [
        {
          id: 'shared_status',
          label: 'Sharing',
          type: 'radio',
          options: [
            { value: 'all', label: 'All Reports' },
            { value: 'shared', label: 'Shared Only', count: 34 },
            { value: 'private', label: 'Private Only', count: 21 }
          ],
          value: activeFilters.shared_status || 'all'
        },
        {
          id: 'team_size',
          label: 'Team Size',
          type: 'range',
          min: 0,
          max: 20,
          value: activeFilters.team_size || 0
        }
      ]
    },
    {
      id: 'metrics',
      title: 'Metrics',
      icon: BarChart3,
      filters: [
        {
          id: 'min_pages',
          label: 'Minimum Pages',
          type: 'range',
          min: 0,
          max: 100,
          value: activeFilters.min_pages || 0
        },
        {
          id: 'min_views',
          label: 'Minimum Views',
          type: 'range',
          min: 0,
          max: 1000,
          value: activeFilters.min_views || 0
        }
      ]
    },
    {
      id: 'rating',
      title: 'Rating',
      icon: Star,
      filters: [
        {
          id: 'min_rating',
          label: 'Minimum Rating',
          type: 'radio',
          options: [
            { value: '0', label: 'All Ratings' },
            { value: '3', label: '3+ Stars', count: 42 },
            { value: '4', label: '4+ Stars', count: 28 },
            { value: '4.5', label: '4.5+ Stars', count: 15 }
          ],
          value: activeFilters.min_rating || '0'
        }
      ]
    },
    {
      id: 'tags',
      title: 'Tags',
      icon: Tag,
      filters: [
        {
          id: 'report_tags',
          label: 'Report Tags',
          type: 'checkbox',
          options: [
            { value: 'ai', label: 'AI', count: 23 },
            { value: 'biotech', label: 'Biotech', count: 18 },
            { value: 'mechanical', label: 'Mechanical', count: 15 },
            { value: 'software', label: 'Software', count: 31 },
            { value: 'electronics', label: 'Electronics', count: 27 }
          ],
          value: activeFilters.report_tags || []
        }
      ]
    }
  ];

  const handleFilterChange = (_sectionId: string, filterId: string, value: any) => {
    setActiveFilters((prev: any) => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleResetFilters = () => {
    setActiveFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).filter(v => {
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'string') return v !== '' && v !== '0' && v !== 'all';
      if (typeof v === 'number') return v > 0;
      return false;
    }).length;
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = searchQuery === '' || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    
    // Apply advanced filters
    if (activeFilters.report_status?.length > 0) {
      if (!activeFilters.report_status.includes(report.status)) return false;
    }

    if (activeFilters.created_after) {
      const createdDate = new Date(report.created);
      const filterDate = new Date(activeFilters.created_after);
      if (createdDate < filterDate) return false;
    }

    if (activeFilters.created_before) {
      const createdDate = new Date(report.created);
      const filterDate = new Date(activeFilters.created_before);
      if (createdDate > filterDate) return false;
    }

    if (activeFilters.shared_status && activeFilters.shared_status !== 'all') {
      if (activeFilters.shared_status === 'shared' && !report.shared) return false;
      if (activeFilters.shared_status === 'private' && report.shared) return false;
    }

    if (activeFilters.team_size > 0) {
      const teamSize = (report.team?.length || 0) + 1;
      if (teamSize < activeFilters.team_size) return false;
    }

    if (activeFilters.min_pages > 0) {
      if (report.pages < activeFilters.min_pages) return false;
    }

    if (activeFilters.min_views > 0) {
      if (report.views < activeFilters.min_views) return false;
    }

    if (activeFilters.min_rating && activeFilters.min_rating !== '0') {
      if (report.rating < parseFloat(activeFilters.min_rating)) return false;
    }

    if (activeFilters.report_tags?.length > 0) {
      const hasTags = activeFilters.report_tags.some((tag: string) => 
        report.tags.some((rTag: string) => rTag.toLowerCase() === tag)
      );
      if (!hasTags) return false;
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.updated.getTime() - a.updated.getTime();
    }
  });

  // Define FilterPane component inline
  const FilterPane = ({ isOpen, onClose, sections, onFilterChange: _onFilterChange, onReset, activeFiltersCount: _activeFiltersCount, className }: any) => {
    if (!isOpen) return null;
    
    return (
      <div className={`fixed inset-y-0 left-64 w-80 bg-white shadow-xl z-50 overflow-y-auto ${className || ''}`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Advanced Filters</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {sections.map((section: FilterSection) => (
            <div key={section.id} className="mb-6">
              <h4 className="font-medium mb-2">{section.title}</h4>
              {/* Filter controls */}
            </div>
          ))}
          <button onClick={onReset} className="w-full py-2 bg-gray-100 rounded">
            Reset Filters
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      {/* Filter Pane */}
      <FilterPane
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        sections={filterSections}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        activeFiltersCount={getActiveFiltersCount()}
        className="sticky top-0 z-10"
      />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    Reports & Analytics
                    <HelpIcon section="reports" onNavigate={onNavigate} className="text-white/80 hover:text-white hover:bg-white/20" />
                  </h1>
                  <p className="text-lg opacity-90 mt-1">
                    Generate insights and share intelligence across your team
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm">{reports.length} Reports Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Team Collaboration Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm">AI-Powered Insights</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onNavigate?.('create-report')}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Report
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <SearchFilterBar
          placeholder="Search reports by name, type, or tags..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={[
            { value: 'all', label: 'All Reports', count: filteredReports.length },
            { value: 'analytics', label: 'Analytics', count: reports.filter(r => r.type === 'analytics').length },
            { value: 'competitive', label: 'Competitive Intelligence', count: reports.filter(r => r.type === 'competitive').length },
            { value: 'patent', label: 'Patent Analysis', count: reports.filter(r => r.type === 'patent').length },
            { value: 'market', label: 'Market Research', count: reports.filter(r => r.type === 'market').length }
          ]}
          selectedCategory={activeCategory}
          setSelectedCategory={setActiveCategory}
          sortOptions={[
            { value: 'recent', label: 'Most Recent' },
            { value: 'name', label: 'Name (A-Z)' },
            { value: 'updated', label: 'Last Updated' },
            { value: 'popular', label: 'Most Popular' }
          ]}
          selectedSort="recent"
          setSelectedSort={() => {}}
          activeFilters={{}}
          setActiveFilter={() => {}}
          toggleQuickFilter={() => {}}
          clearAllFilters={() => {}}
          setExpanded={() => {}}
          isExpanded={false}
          activeFilterCount={0}
          className="mb-6"
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Search Reports</h3>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            </div>

            {/* Report Types */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Report Types</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedType === 'all' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">All Types</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {reports.length}
                    </span>
                  </div>
                </button>
                {REPORT_TYPES.map(type => {
                  const Icon = type.icon;
                  const count = reports.filter(r => r.type === type.id).length;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedType === type.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{type.title}</span>
                        </div>
                        {count > 0 && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Status</label>
                  <div className="mt-2 space-y-1">
                    {['all', 'completed', 'draft', 'in-progress'].map(status => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedStatus === status ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Sort By</label>
                  <div className="mt-2 space-y-1">
                    {[
                      { value: 'recent', label: 'Most Recent' },
                      { value: 'popular', label: 'Most Viewed' },
                      { value: 'rating', label: 'Highest Rated' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as any)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          sortBy === option.value ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                  showFilters || getActiveFiltersCount() > 0
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">Advanced Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reports Created</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-semibold text-gray-900">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">4.7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="xl:col-span-3">
            {sortedReports.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or create your first report
                </p>
                <button 
                  onClick={() => onNavigate?.('create-report')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Report
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedReports.map(report => {
                  const reportType = REPORT_TYPES.find(t => t.id === report.type);
                  const TypeIcon = reportType?.icon || FileText;
                  
                  return (
                    <div
                      key={report.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl ${getColorClasses(reportType?.color || 'gray')}`}>
                            <TypeIcon className="w-6 h-6" />
                          </div>
                          <div className="flex items-center gap-2">
                            {report.status === 'completed' && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                Completed
                              </span>
                            )}
                            {report.status === 'draft' && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                                Draft
                              </span>
                            )}
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {report.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {report.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                            >
                              <Tag className="w-3 h-3 inline mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{report.pages}</div>
                            <div className="text-xs">Pages</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{report.views}</div>
                            <div className="text-xs">Views</div>
                          </div>
                          <div className="text-center">
                            {report.rating > 0 ? (
                              <>
                                <div className="font-semibold text-gray-900 flex items-center justify-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  {report.rating}
                                </div>
                                <div className="text-xs">Rating</div>
                              </>
                            ) : (
                              <>
                                <div className="font-semibold text-gray-900">-</div>
                                <div className="text-xs">No rating</div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(report.updated)}</span>
                            {report.shared && (
                              <>
                                <span>•</span>
                                <Users className="w-3 h-3" />
                                <span>{report.team.length + 1} users</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle view
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle download
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle share
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Share"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}