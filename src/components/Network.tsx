import { useState, useRef, useMemo } from 'react';
import { 
  Search, 
  Filter,
  Share2,
  Plus,
  MoreHorizontal,
  Eye,
  Copy,
  Mail,
  Smartphone,
  X,
  HelpCircle,
  Users,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Check,
  X as XIcon,
  Award,
  Video,
  Sparkles
} from 'lucide-react';

interface NetworkContact {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  location: string;
  profileImage?: string;
  category: 'frequent' | 'network' | 'shared' | 'request' | 'recommended';
  lastCommunication: string;
  lastCollaboration?: string;
  collaborationCount: number;
  connectionStrength: 'strong' | 'medium' | 'weak';
  tags: string[];
  projects?: string[];
  patents?: string[];
  publications?: string[];
  reports?: string[];
  linkedinUrl?: string;
  status: 'connected' | 'pending' | 'requested' | 'stranger';
  notes?: string;
  mutualConnections?: number;
  sharedBy?: string;
  requestDate?: string;
}

interface ShareNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: NetworkContact | null;
  shareType?: 'profile' | 'asset';
  assetTitle?: string;
}

interface NetworkCarouselProps {
  title: string;
  contacts: NetworkContact[];
  onShare: (contact: NetworkContact) => void;
  onConnect: (contact: NetworkContact) => void;
  onAcceptRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onGenerateAISummary: (contact: NetworkContact) => void;
}

interface ConnectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: NetworkContact | null;
  onSendRequest: (contactId: string, message: string) => void;
}

const ShareNetworkModal = ({ isOpen, onClose, contact, shareType = 'profile', assetTitle }: ShareNetworkModalProps) => {
  if (!isOpen || !contact) return null;

  const shareUrl = `${window.location.origin}/network/${contact.id}`;
  const shareText = shareType === 'asset' && assetTitle 
    ? `I'd like to share "${assetTitle}" with you` 
    : `Check out ${contact.name}'s profile in my professional network`;

  const handleShare = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/${contact.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        break;
      case 'email':
        url = `mailto:${contact.email}?subject=${encodeURIComponent(shareType === 'asset' ? assetTitle || 'Shared Asset' : 'Professional Connection')}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
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
          <h3 className="text-lg font-semibold">
            {shareType === 'asset' ? 'Share Asset' : 'Share Contact'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{contact.name}</h4>
              <p className="text-sm text-gray-600">{contact.title} at {contact.company}</p>
            </div>
          </div>

          {shareType === 'asset' && assetTitle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Sharing:</strong> {assetTitle}
              </p>
            </div>
          )}

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
                <Mail className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-medium">Send Email</span>
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              disabled={!contact.phone}
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium">
                {contact.phone ? 'Send WhatsApp' : 'No Phone Number'}
              </span>
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

const ConnectionRequestModal = ({ isOpen, onClose, contact, onSendRequest }: ConnectionRequestModalProps) => {
  const [message, setMessage] = useState(`Hi ${contact?.name?.split(' ')[0]}, I'd like to connect with you on InnoSpot.`);

  if (!isOpen || !contact) return null;

  const handleSendRequest = () => {
    onSendRequest(contact.id, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Send InnoSpot Connect Request</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{contact.name}</h4>
              <p className="text-sm text-gray-600">{contact.title} at {contact.company}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              maxLength={300}
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/300 characters</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSendRequest}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NetworkCarousel = ({ title, contacts, onShare, onConnect, onAcceptRequest, onRejectRequest, onGenerateAISummary }: NetworkCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frequent': return <Clock className="w-4 h-4 text-green-500" />;
      case 'network': return <Users className="w-4 h-4 text-blue-500" />;
      case 'shared': return <Share2 className="w-4 h-4 text-purple-500" />;
      case 'request': return <UserPlus className="w-4 h-4 text-orange-500" />;
      case 'recommended': return <Award className="w-4 h-4 text-yellow-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getConnectionButton = (contact: NetworkContact) => {
    if (contact.category === 'request') {
      return (
        <div className="flex gap-1">
          <button
            onClick={() => onAcceptRequest(contact.id)}
            className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
          >
            <Check className="w-3 h-3 mx-auto" />
          </button>
          <button
            onClick={() => onRejectRequest(contact.id)}
            className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            <XIcon className="w-3 h-3 mx-auto" />
          </button>
        </div>
      );
    }

    if (contact.status === 'connected') {
      return (
        <button className="flex-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded">
          Connected
        </button>
      );
    }

    if (contact.status === 'pending') {
      return (
        <button className="flex-1 px-3 py-1 bg-yellow-100 text-yellow-600 text-xs rounded">
          Pending
        </button>
      );
    }

    return (
      <button
        onClick={() => onConnect(contact)}
        className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
      >
        InnoSpot Connect
      </button>
    );
  };

  if (contacts.length === 0) {
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
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow group"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getCategoryIcon(contact.category)}
                  <button
                    onClick={() => onGenerateAISummary(contact)}
                    className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Generate AI Summary"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">{contact.company}</p>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{contact.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>

              {contact.category === 'request' && contact.requestDate && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-orange-800">
                    Sent connection request on {contact.requestDate}
                  </p>
                </div>
              )}

              {contact.category === 'shared' && contact.sharedBy && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-purple-800">
                    Shared by {contact.sharedBy}
                  </p>
                </div>
              )}

              {contact.category === 'recommended' && contact.mutualConnections && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    {contact.mutualConnections} mutual connections
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-4">
                {contact.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {contact.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{contact.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-4">
                <div className="flex items-center justify-between">
                  <span>Last contact: {contact.lastCommunication}</span>
                  <span>{contact.collaborationCount} collaborations</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {getConnectionButton(contact)}
                <button
                  onClick={() => onShare(contact)}
                  className="p-1.5 text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                >
                  <Share2 className="w-3 h-3" />
                </button>
                <div className="relative group/menu">
                  <button className="p-1.5 text-gray-400 border border-gray-200 rounded hover:bg-gray-50">
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 group-hover/menu:opacity-100 transition-opacity z-10 min-w-32">
                    <button className="flex items-center gap-2 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full">
                      <Eye className="w-3 h-3" />
                      View Profile
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full">
                      <MessageCircle className="w-3 h-3" />
                      Message
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full">
                      <Video className="w-3 h-3" />
                      Schedule Call
                    </button>
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

export default function Network() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<NetworkContact | null>(null);

  const [contacts] = useState<NetworkContact[]>([
    // Most frequently contacted
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      title: 'Senior Research Scientist',
      company: 'TechCorp Innovation Labs',
      email: 'sarah.chen@techcorp.com',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      category: 'frequent',
      lastCommunication: '2025-08-08',
      collaborationCount: 12,
      connectionStrength: 'strong',
      tags: ['AI Research', 'Machine Learning', 'Patents'],
      projects: ['AI Patent Classification'],
      status: 'connected'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      title: 'Patent Attorney',
      company: 'Rodriguez & Associates',
      email: 'm.rodriguez@patentlaw.com',
      phone: '+1-555-0456',
      location: 'Austin, TX',
      category: 'frequent',
      lastCommunication: '2025-08-07',
      collaborationCount: 8,
      connectionStrength: 'strong',
      tags: ['Patent Law', 'IP Strategy'],
      status: 'connected'
    },
    // My Network
    {
      id: '3',
      name: 'Jennifer Park',
      title: 'Innovation Manager',
      company: 'InnoSpot Corp',
      email: 'jennifer.park@innospot.com',
      location: 'New York, NY',
      category: 'network',
      lastCommunication: '2025-08-05',
      collaborationCount: 3,
      connectionStrength: 'medium',
      tags: ['Innovation', 'Management'],
      status: 'connected'
    },
    {
      id: '4',
      name: 'Prof. Ahmed Hassan',
      title: 'Professor of Computer Science',
      company: 'MIT',
      email: 'a.hassan@mit.edu',
      location: 'Cambridge, MA',
      category: 'network',
      lastCommunication: '2025-08-03',
      collaborationCount: 2,
      connectionStrength: 'medium',
      tags: ['Academic', 'Computer Vision'],
      status: 'connected'
    },
    // Shared with you
    {
      id: '5',
      name: 'Lisa Thompson',
      title: 'Business Development Director',
      company: 'DataFlow Solutions',
      email: 'l.thompson@dataflow.com',
      location: 'Chicago, IL',
      category: 'shared',
      lastCommunication: '2025-07-30',
      collaborationCount: 1,
      connectionStrength: 'weak',
      tags: ['Business Development', 'SaaS'],
      status: 'stranger',
      sharedBy: 'Dr. Sarah Chen'
    },
    // Connection Requests
    {
      id: '6',
      name: 'Roberto Silva',
      title: 'CTO',
      company: 'StartupTech Inc',
      email: 'r.silva@startuptech.com',
      location: 'Seattle, WA',
      category: 'request',
      lastCommunication: '2025-08-01',
      collaborationCount: 0,
      connectionStrength: 'weak',
      tags: ['Technology', 'Startup'],
      status: 'requested',
      requestDate: '2025-08-01'
    },
    // Recommended
    {
      id: '7',
      name: 'Dr. Emily Johnson',
      title: 'Research Director',
      company: 'BioTech Labs',
      email: 'e.johnson@biotechlabs.com',
      location: 'Boston, MA',
      category: 'recommended',
      lastCommunication: 'Never',
      collaborationCount: 0,
      connectionStrength: 'weak',
      tags: ['Biotechnology', 'Research'],
      status: 'stranger',
      mutualConnections: 3
    },
    {
      id: '8',
      name: 'David Kim',
      title: 'VP of Engineering',
      company: 'CloudTech Solutions',
      email: 'd.kim@cloudtech.com',
      location: 'San Diego, CA',
      category: 'recommended',
      lastCommunication: 'Never',
      collaborationCount: 0,
      connectionStrength: 'weak',
      tags: ['Engineering', 'Cloud Computing'],
      status: 'stranger',
      mutualConnections: 2
    }
  ]);

  const categorizedContacts = useMemo(() => {
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
      frequent: filtered.filter(c => c.category === 'frequent'),
      network: filtered.filter(c => c.category === 'network'),
      shared: filtered.filter(c => c.category === 'shared'),
      requests: filtered.filter(c => c.category === 'request'),
      recommended: filtered.filter(c => c.category === 'recommended')
    };
  }, [contacts, searchQuery]);

  const handleShare = (contact: NetworkContact) => {
    setSelectedContact(contact);
    setShowShareModal(true);
  };

  const handleConnect = (contact: NetworkContact) => {
    setSelectedContact(contact);
    setShowConnectionModal(true);
  };

  const handleSendConnectionRequest = (contactId: string, message: string) => {
    console.log('Sending connection request to:', contactId, 'with message:', message);
    // Implement connection request logic
    alert(`Connection request sent to ${selectedContact?.name}!`);
  };

  const handleAcceptRequest = (id: string) => {
    console.log('Accepting connection request from:', id);
    alert('Connection request accepted!');
  };

  const handleRejectRequest = (id: string) => {
    console.log('Rejecting connection request from:', id);
    alert('Connection request rejected.');
  };

  const handleGenerateAISummary = (contact: NetworkContact) => {
    console.log('Generating AI summary for:', contact.name);
    // Implement OpenRouter API integration
    alert(`Generating AI summary for ${contact.name}...`);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Professional Network
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
              <HelpCircle className="w-4 h-4" />
              Help
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Find People
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your network..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {categorizedContacts.frequent.length > 0 && (
          <NetworkCarousel
            title="👥 Most Frequently Contacted"
            contacts={categorizedContacts.frequent}
            onShare={handleShare}
            onConnect={handleConnect}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onGenerateAISummary={handleGenerateAISummary}
          />
        )}

        <NetworkCarousel
          title="🌐 My Network"
          contacts={categorizedContacts.network}
          onShare={handleShare}
          onConnect={handleConnect}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
          onGenerateAISummary={handleGenerateAISummary}
        />

        {categorizedContacts.shared.length > 0 && (
          <NetworkCarousel
            title="🤝 Shared with You"
            contacts={categorizedContacts.shared}
            onShare={handleShare}
            onConnect={handleConnect}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onGenerateAISummary={handleGenerateAISummary}
          />
        )}

        {categorizedContacts.requests.length > 0 && (
          <NetworkCarousel
            title="📨 Connection Requests"
            contacts={categorizedContacts.requests}
            onShare={handleShare}
            onConnect={handleConnect}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onGenerateAISummary={handleGenerateAISummary}
          />
        )}

        <NetworkCarousel
          title="💡 Recommended for You"
          contacts={categorizedContacts.recommended}
          onShare={handleShare}
          onConnect={handleConnect}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
          onGenerateAISummary={handleGenerateAISummary}
        />

        {/* Info Section */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">InnoSpot Connect</h3>
          </div>
          <p className="text-blue-800 mb-4">
            Build your professional network by connecting with researchers, inventors, patent attorneys, 
            and industry experts. Send connection requests to collaborate on projects and share knowledge.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Benefits of Connecting:</h4>
              <ul className="space-y-1 text-blue-800">
                <li>• Share reports and research findings</li>
                <li>• Collaborate on patent applications</li>
                <li>• Get introduced to mutual connections</li>
                <li>• Access exclusive industry insights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">How InnoSpot Connect Works:</h4>
              <ul className="space-y-1 text-blue-800">
                <li>• Send personalized connection requests</li>
                <li>• Recipients get email notifications</li>
                <li>• Accept or decline requests easily</li>
                <li>• Only registered users can connect</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ShareNetworkModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        contact={selectedContact}
      />

      <ConnectionRequestModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        contact={selectedContact}
        onSendRequest={handleSendConnectionRequest}
      />
    </div>
  );
}