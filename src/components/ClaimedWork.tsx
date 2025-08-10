import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter,
  Share2,
  Plus,
  MoreHorizontal,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Copy,
  FileText,
  Award,
  BookOpen,
  ExternalLink,
  X,
  HelpCircle,
  Users,
  GraduationCap,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import PageHeader from './PageHeader';

interface ClaimedWorkItem {
  id: string;
  title: string;
  description: string;
  type: 'patent' | 'publication' | 'article' | 'book';
  status: 'verified' | 'pending' | 'unverified';
  orcidLinked: boolean;
  claimedDate: string;
  lastUpdated: string;
  authors?: string[];
  inventors?: string[];
  publicationDate?: string;
  journal?: string;
  doi?: string;
  patentNumber?: string;
}

interface ShareClaimedWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimedWork: ClaimedWorkItem | null;
}

interface ClaimedWorkTabProps {
  type: 'inventorship' | 'authorship';
  items: ClaimedWorkItem[];
  onShare: (item: ClaimedWorkItem) => void;
  onDelete: (id: string) => void;
  onGenerateAISummary: (item: ClaimedWorkItem) => void;
}

const ShareClaimedWorkModal = ({ isOpen, onClose, claimedWork }: ShareClaimedWorkModalProps) => {
  if (!isOpen || !claimedWork) return null;

  const shareUrl = `${window.location.origin}/claimed-work/${claimedWork.id}`;

  const handleShare = (platform: string) => {
    let url = '';
    const text = `Check out my ${claimedWork.type === 'patent' ? 'patent inventorship' : 'research authorship'}: ${claimedWork.title}`;
    
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(claimedWork.title)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`;
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
          <h3 className="text-lg font-semibold">Share Claimed Work</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{claimedWork.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{claimedWork.description}</p>
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

const ClaimedWorkTab = ({ type, items, onShare, onDelete, onGenerateAISummary }: ClaimedWorkTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'unverified'>('all');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
      const matchesType = (type === 'inventorship' && item.type === 'patent') ||
                         (type === 'authorship' && item.type !== 'patent');
      return matchesSearch && matchesFilter && matchesType;
    });
  }, [items, searchQuery, filterStatus, type]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'unverified':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'patent':
        return <Award className="w-4 h-4 text-blue-500" />;
      case 'publication':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'article':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  if (filteredItems.length === 0 && searchQuery === '' && filterStatus === 'all') {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          {type === 'inventorship' ? (
            <Award className="w-10 h-10 text-blue-600" />
          ) : (
            <GraduationCap className="w-10 h-10 text-blue-600" />
          )}
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-4">
          Record your {type === 'inventorship' ? 'Inventorship' : 'Authorship'} of {type === 'inventorship' ? 'Patents' : 'Scholarly Works'}
        </h3>
        <p className="text-gray-600 mb-6 max-w-lg leading-relaxed">
          To record your {type} and upload {type === 'inventorship' ? 'patents' : 'scholarly works'} to your ORCID record requires a linked ORCID account. 
          {type === 'inventorship' ? 'Patents' : 'Scholarly works'} you record {type} for will be automatically added to your ORCID record and displayed on your profile.
        </p>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <LinkIcon className="w-4 h-4" />
            Link to ORCID
          </button>
          <button className="flex items-center gap-2 px-6 py-3 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
            <HelpCircle className="w-4 h-4" />
            Read More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="unverified">Unverified</option>
        </select>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(item.type)}
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    {item.orcidLinked && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="ORCID Linked" />
                    )}
                    <button
                      onClick={() => onGenerateAISummary(item)}
                      className="p-1 text-purple-600 hover:bg-purple-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Generate AI Summary"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onShare(item)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="relative group">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                          <Eye className="w-3 h-3" />
                          View Details
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                          <ExternalLink className="w-3 h-3" />
                          View in ORCID
                        </button>
                        <button 
                          onClick={() => onDelete(item.id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove Claim
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Claimed: {item.claimedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Updated: {item.lastUpdated}</span>
                  </div>
                  {item.publicationDate && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Published: {item.publicationDate}</span>
                    </div>
                  )}
                  {(item.authors || item.inventors) && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{item.authors?.length || item.inventors?.length} co-{type === 'inventorship' ? 'inventors' : 'authors'}</span>
                    </div>
                  )}
                </div>

                {item.journal && (
                  <div className="mt-3 text-sm text-gray-600">
                    <strong>Journal:</strong> {item.journal}
                  </div>
                )}

                {item.doi && (
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>DOI:</strong> 
                    <a href={`https://doi.org/${item.doi}`} className="text-blue-600 hover:underline ml-1">
                      {item.doi}
                    </a>
                  </div>
                )}

                {item.patentNumber && (
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Patent Number:</strong> {item.patentNumber}
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                    {item.orcidLinked && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ORCID Linked
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ClaimedWorkProps {
  onNavigate?: (section: string) => void;
}

export default function ClaimedWork({ onNavigate }: ClaimedWorkProps = {}) {
  const [activeTab, setActiveTab] = useState<'inventorship' | 'authorship'>('inventorship');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClaimedWorkItem | null>(null);

  const [claimedWorkItems] = useState<ClaimedWorkItem[]>([
    {
      id: '1',
      title: 'Machine Learning Algorithm for Patent Classification',
      description: 'A novel approach to automatic patent classification using deep learning',
      type: 'patent',
      status: 'verified',
      orcidLinked: true,
      claimedDate: '2025-08-01',
      lastUpdated: '2025-08-08',
      inventors: ['John Doe', 'Jane Smith', 'Current User'],
      patentNumber: 'US123456789'
    },
    {
      id: '2',
      title: 'Advances in Natural Language Processing for Legal Documents',
      description: 'Research paper on NLP techniques for analyzing legal texts',
      type: 'publication',
      status: 'pending',
      orcidLinked: true,
      claimedDate: '2025-07-15',
      lastUpdated: '2025-08-05',
      authors: ['Current User', 'Dr. Alice Johnson', 'Prof. Bob Wilson'],
      journal: 'Journal of Legal Technology',
      doi: '10.1000/182',
      publicationDate: '2025-07-01'
    }
  ]);

  const handleShare = (item: ClaimedWorkItem) => {
    setSelectedItem(item);
    setShowShareModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this claim? This action cannot be undone.')) {
      // In a real app, this would remove the item from state
      console.log('Removing claim:', id);
    }
  };

  const handleGenerateAISummary = (item: ClaimedWorkItem) => {
    console.log('Generating AI summary for claimed work:', item.title);
    // Implement OpenRouter API integration
    alert(`Generating AI summary for "${item.title}"...`);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <PageHeader
              title="Claimed Work"
              helpLink="claimed-work-support"
              onNavigate={onNavigate}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Claim New Work
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
              <LinkIcon className="w-4 h-4" />
              Link ORCID
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex px-6">
          <button
            onClick={() => setActiveTab('inventorship')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'inventorship'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="w-4 h-4" />
            Inventorship
          </button>
          <button
            onClick={() => setActiveTab('authorship')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'authorship'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Authorship
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <ClaimedWorkTab
          type={activeTab}
          items={claimedWorkItems}
          onShare={handleShare}
          onDelete={handleDelete}
          onGenerateAISummary={handleGenerateAISummary}
        />
      </div>

      <ShareClaimedWorkModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        claimedWork={selectedItem}
      />
    </div>
  );
}