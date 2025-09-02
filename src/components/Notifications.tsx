import { useState, useMemo } from 'react';
import { 
  Bell, 
  BellOff,
  Search,
  Filter,
  Share2,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  FileText,
  X,
  HelpCircle,
  CheckCircle,
  Clock,
  Mail,
  Smartphone,
  Settings,
  BookOpen
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'query_alert' | 'system' | 'share' | 'collection_update' | 'report';
  status: 'unread' | 'read';
  createdDate: string;
  queryName?: string;
  resultCount?: number;
  sender?: string;
}

interface ShareNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
}

const ShareNotificationModal = ({ isOpen, onClose, notification }: ShareNotificationModalProps) => {
  if (!isOpen || !notification) return null;

  const shareUrl = `${window.location.origin}/notifications/${notification.id}`;

  const handleShare = (platform: string) => {
    let url = '';
    const text = `Check out this notification: ${notification.title}`;
    
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(notification.title)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`;
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
          <h3 className="text-lg font-semibold">Share Notification</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{notification.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{notification.description}</p>
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
                <Mail className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-medium">Share via Email</span>
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-green-600" />
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

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Patent Results Available',
      description: 'Your saved query "AI Machine Learning" has 15 new patent results',
      type: 'query_alert',
      status: 'unread',
      createdDate: '2025-08-08',
      queryName: 'AI Machine Learning',
      resultCount: 15
    },
    {
      id: '2',
      title: 'Collection Update',
      description: 'Your AI Patents collection has been updated with 3 new items',
      type: 'collection_update',
      status: 'read',
      createdDate: '2025-08-07',
      resultCount: 3
    },
    {
      id: '3',
      title: 'System Maintenance Complete',
      description: 'Scheduled maintenance has been completed. All services are now available',
      type: 'system',
      status: 'read',
      createdDate: '2025-08-06'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'query_alert' | 'system' | 'share'>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'unread' && notification.status === 'unread') ||
                           (['query_alert', 'system', 'share'].includes(filterType) && notification.type === filterType);
      return matchesSearch && matchesFilter;
    });
  }, [notifications, searchQuery, filterType]);

  const handleShare = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowShareModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, status: 'read' as const } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, status: 'read' as const })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'query_alert':
        return <Search className="w-4 h-4 text-blue-500" />;
      case 'collection_update':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-orange-500" />;
      case 'share':
        return <Share2 className="w-4 h-4 text-purple-500" />;
      case 'report':
        return <FileText className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  if (notifications.length === 0) {
    return (
      <div className="h-full bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600" />
              Notifications
            </h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Bell className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            Notifications of the latest data updates.
          </h3>
          <p className="text-gray-600 mb-6 max-w-lg leading-relaxed">
            Notifications when enabled will send you an email/notification when there are new results that match 
            your saved queries. You can view all new works that match the saved query and have been added to the 
            search index since the last time the alerts were run.
          </p>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <Search className="w-4 h-4" />
              New Patent Search
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <BookOpen className="w-4 h-4" />
              New Scholar Search
            </button>
            <button className="flex items-center gap-2 px-6 py-3 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
              <HelpCircle className="w-4 h-4" />
              Read More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600" />
              Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
              disabled={unreadCount === 0}
            >
              <CheckCircle className="w-4 h-4" />
              Mark All Read
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Settings className="w-4 h-4" />
              Notification Settings
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
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="query_alert">Query Alerts</option>
            <option value="system">System Notifications</option>
            <option value="share">Shared Items</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`bg-white rounded-lg border hover:shadow-md transition-shadow ${
                  notification.status === 'unread' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getTypeIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">{notification.title}</h3>
                          {notification.status === 'unread' && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                        {notification.queryName && (
                          <div className="text-xs text-gray-500 mb-2">
                            Query: <span className="font-medium">{notification.queryName}</span>
                          </div>
                        )}
                        {notification.resultCount && (
                          <div className="text-xs text-gray-500">
                            {notification.resultCount} new results
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShare(notification)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            <Eye className="w-3 h-3" />
                            Mark as Read
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                            <Edit className="w-3 h-3" />
                            Edit Settings
                          </button>
                          <button 
                            onClick={() => handleDelete(notification.id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{notification.createdDate}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.status === 'unread' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.status === 'unread' ? 'New' : 'Read'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Results
                      </button>
                      {notification.type === 'query_alert' && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Open Query
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ShareNotificationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        notification={selectedNotification}
      />
    </div>
  );
}