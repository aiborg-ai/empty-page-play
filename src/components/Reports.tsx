import { useState, useRef } from 'react';
import { 
  FileText, 
  Search,
  Filter,
  Share2,
  Plus,
  MoreHorizontal,
  Calendar,
  Eye,
  Download,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Star,
  Lock,
  Globe,
  X,
  HelpCircle,
  TrendingUp,
  BarChart3,
  LineChart,
  Award,
  BookOpen,
  DollarSign,
  User,
  Sparkles
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'user' | 'shared' | 'recommended' | 'premium';
  category: 'patent_analysis' | 'market_research' | 'competitive_intelligence' | 'trend_analysis' | 'legal_analysis';
  thumbnail: string;
  author: string;
  createdDate: string;
  price?: number;
  rating?: number;
  downloadCount?: number;
  isDownloaded?: boolean;
  isFavorite?: boolean;
  access: 'public' | 'private' | 'premium';
  tags: string[];
}

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

interface ReportCarouselProps {
  title: string;
  reports: Report[];
  onShare: (report: Report) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onGenerateAISummary: (report: Report) => void;
}

const ShareReportModal = ({ isOpen, onClose, report }: ShareReportModalProps) => {
  if (!isOpen || !report) return null;

  const shareUrl = `${window.location.origin}/reports/${report.id}`;

  const handleShare = (platform: string) => {
    let url = '';
    const text = `Check out this report: ${report.title}`;
    
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(report.title)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`;
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
          <h3 className="text-lg font-semibold">Share Report</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{report.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
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

            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">W</span>
              </div>
              <span className="text-sm font-medium">Share on WhatsApp</span>
            </button>

            <button
              onClick={() => handleShare('linkedin')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">in</span>
              </div>
              <span className="text-sm font-medium">Share on LinkedIn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportCarousel = ({ title, reports, onShare, onDelete, onToggleFavorite, onGenerateAISummary }: ReportCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one report card plus margin
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'patent_analysis':
        return <Award className="w-4 h-4 text-blue-500" />;
      case 'market_research':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'competitive_intelligence':
        return <BarChart3 className="w-4 h-4 text-purple-500" />;
      case 'trend_analysis':
        return <LineChart className="w-4 h-4 text-orange-500" />;
      case 'legal_analysis':
        return <BookOpen className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
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
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow group"
          >
            {/* Thumbnail */}
            <div className="relative h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {getCategoryIcon(report.category)}
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                {report.type === 'premium' && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Premium
                  </span>
                )}
                {report.access === 'private' && (
                  <Lock className="w-4 h-4 text-gray-600" />
                )}
                {report.access === 'public' && (
                  <Globe className="w-4 h-4 text-green-600" />
                )}
              </div>
              <div className="absolute top-2 left-2 flex gap-1">
                <button
                  onClick={() => onToggleFavorite(report.id)}
                  className={`p-1 rounded-full ${
                    report.isFavorite 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-white bg-opacity-70 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
                  }`}
                >
                  <Star className={`w-4 h-4 ${report.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => onGenerateAISummary(report)}
                  className="p-1 bg-white bg-opacity-70 text-purple-600 hover:bg-purple-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Generate AI Summary"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
                  {report.title}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => onShare(report)}
                    className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Share2 className="w-3 h-3 text-gray-400" />
                  </button>
                  <div className="relative group/menu">
                    <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-3 h-3 text-gray-400" />
                    </button>
                    <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 group-hover/menu:opacity-100 transition-opacity z-10 min-w-32">
                      <button className="flex items-center gap-2 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full">
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full">
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                      {onDelete && report.type === 'user' && (
                        <button 
                          onClick={() => onDelete(report.id)}
                          className="flex items-center gap-2 px-3 py-1 text-xs text-red-600 hover:bg-red-50 w-full"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                {report.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{report.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{report.createdDate}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {report.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {report.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{report.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  {report.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{report.rating}</span>
                    </div>
                  )}
                  {report.downloadCount && (
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-gray-500" />
                      <span className="text-xs">{report.downloadCount}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {report.price ? (
                    <span className="text-green-600 font-medium text-sm">
                      ${report.price}
                    </span>
                  ) : (
                    <span className="text-blue-600 font-medium text-xs">Free</span>
                  )}
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    {report.isDownloaded ? 'Open' : (report.price ? 'Buy' : 'Download')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'patent_analysis' | 'market_research' | 'competitive_intelligence' | 'trend_analysis' | 'legal_analysis'>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [reports, setReports] = useState<Report[]>([
    // User Reports
    {
      id: '1',
      title: 'AI Patent Landscape Analysis 2025',
      description: 'Comprehensive analysis of AI patents filed in 2024-2025',
      type: 'user',
      category: 'patent_analysis',
      thumbnail: '',
      author: 'Current User',
      createdDate: '2025-08-08',
      isDownloaded: true,
      isFavorite: true,
      access: 'private',
      tags: ['AI', 'Patents', 'Machine Learning'],
      downloadCount: 25,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Quantum Computing Market Report',
      description: 'Market trends and opportunities in quantum computing',
      type: 'user',
      category: 'market_research',
      thumbnail: '',
      author: 'Current User',
      createdDate: '2025-08-05',
      isDownloaded: true,
      isFavorite: false,
      access: 'public',
      tags: ['Quantum', 'Computing', 'Market'],
      downloadCount: 15,
      rating: 4.5
    },
    // Shared Reports
    {
      id: '3',
      title: 'Biotech Innovation Trends',
      description: 'Latest trends in biotechnology innovation and patents',
      type: 'shared',
      category: 'trend_analysis',
      thumbnail: '',
      author: 'Dr. Jane Smith',
      createdDate: '2025-08-03',
      isDownloaded: false,
      isFavorite: true,
      access: 'public',
      tags: ['Biotech', 'Innovation', 'Trends'],
      downloadCount: 145,
      rating: 4.9
    },
    {
      id: '4',
      title: 'Legal Status Analysis Framework',
      description: 'Framework for analyzing patent legal status across jurisdictions',
      type: 'shared',
      category: 'legal_analysis',
      thumbnail: '',
      author: 'Legal Team',
      createdDate: '2025-08-01',
      isDownloaded: true,
      isFavorite: false,
      access: 'public',
      tags: ['Legal', 'Patents', 'Framework'],
      downloadCount: 89,
      rating: 4.6
    },
    // Recommended Reports
    {
      id: '5',
      title: 'Global Patent Competition Intelligence',
      description: 'Competitive intelligence report on global patent filings',
      type: 'recommended',
      category: 'competitive_intelligence',
      thumbnail: '',
      author: 'InnoSpot Analytics',
      createdDate: '2025-07-28',
      price: 299,
      isDownloaded: false,
      isFavorite: false,
      access: 'premium',
      tags: ['Competition', 'Global', 'Intelligence'],
      downloadCount: 234,
      rating: 4.9
    },
    {
      id: '6',
      title: 'Emerging Technology Patent Forecast',
      description: 'Predictive analysis of emerging technology patent trends',
      type: 'recommended',
      category: 'trend_analysis',
      thumbnail: '',
      author: 'Tech Forecasting Inc.',
      createdDate: '2025-07-25',
      price: 199,
      isDownloaded: false,
      isFavorite: true,
      access: 'premium',
      tags: ['Emerging Tech', 'Forecast', 'Patents'],
      downloadCount: 167,
      rating: 4.7
    }
  ]);

  const handleShare = (report: Report) => {
    setSelectedReport(report);
    setShowShareModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const handleToggleFavorite = (id: string) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  const handleGenerateAISummary = (report: Report) => {
    console.log('Generating AI summary for report:', report.title);
    // Implement OpenRouter API integration
    alert(`Generating AI summary for "${report.title}"...`);
  };

  const userReports = reports.filter(r => r.type === 'user');
  const sharedReports = reports.filter(r => r.type === 'shared');
  const recommendedReports = reports.filter(r => r.type === 'recommended');
  const favoriteReports = reports.filter(r => r.isFavorite);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Reports
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
              <HelpCircle className="w-4 h-4" />
              Browse Marketplace
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Create Report
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="patent_analysis">Patent Analysis</option>
            <option value="market_research">Market Research</option>
            <option value="competitive_intelligence">Competitive Intelligence</option>
            <option value="trend_analysis">Trend Analysis</option>
            <option value="legal_analysis">Legal Analysis</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {favoriteReports.length > 0 && (
          <ReportCarousel
            title="⭐ Your Favorites"
            reports={favoriteReports}
            onShare={handleShare}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
            onGenerateAISummary={handleGenerateAISummary}
          />
        )}

        <ReportCarousel
          title="📊 Your Reports"
          reports={userReports}
          onShare={handleShare}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onGenerateAISummary={handleGenerateAISummary}
        />

        <ReportCarousel
          title="🤝 Shared with You"
          reports={sharedReports}
          onShare={handleShare}
          onToggleFavorite={handleToggleFavorite}
          onGenerateAISummary={handleGenerateAISummary}
        />

        <ReportCarousel
          title="🎯 Recommended for You"
          reports={recommendedReports}
          onShare={handleShare}
          onToggleFavorite={handleToggleFavorite}
          onGenerateAISummary={handleGenerateAISummary}
        />

        {/* Premium Reports Section */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Premium Reports Marketplace</h2>
              <p className="text-gray-600">
                Access professional market intelligence and industry analysis reports
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Starting from $99</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 border border-purple-200">
              Browse Premium Reports
            </button>
            <button className="px-4 py-2 text-purple-700 hover:text-purple-800">
              Learn More →
            </button>
          </div>
        </div>
      </div>

      <ShareReportModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        report={selectedReport}
      />
    </div>
  );
}