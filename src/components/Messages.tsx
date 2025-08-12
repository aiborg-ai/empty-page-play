import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  Plus,
  Clock,
  Check,
  CheckCheck,
  X
} from 'lucide-react';
import { InstantUser } from '../lib/instantAuth';
import { ChatService } from '../lib/chatService';
import type { NetworkContact } from '../types/network';

interface MessagesProps {
  currentUser: InstantUser;
}

interface Conversation {
  id: string;
  contact: NetworkContact;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: Array<{ name: string; size: string; type: string }>;
}

const Messages: React.FC<MessagesProps> = ({ currentUser: _currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');

  useEffect(() => {
    // Initialize chat service and load conversations
    ChatService.initialize();
    loadConversations();
    
    return () => {
      ChatService.cleanup();
    };
  }, []);

  const loadConversations = () => {
    // Mock conversations for demo
    const mockConversations: Conversation[] = [
      {
        id: '1',
        contact: {
          id: '1',
          user_id: 'user1',
          email: 'sarah.chen@techcorp.com',
          first_name: 'Sarah',
          last_name: 'Chen',
          display_name: 'Sarah Chen',
          profile_image: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=3b82f6&color=fff',
          title: 'Patent Attorney',
          company: 'TechCorp Legal',
          location: 'San Francisco, CA',
          bio: 'Experienced patent attorney specializing in software patents',
          years_experience: 10,
          education: [],
          expertise_areas: [{
            id: '1',
            name: 'Software Patents',
            category: 'technical',
            proficiency_level: 95,
            years_experience: 10
          }],
          patent_profile: {
            total_patents: 50,
            as_inventor: 5,
            as_assignee: 45,
            recent_publications: 8,
            top_patent_categories: ['Software', 'AI'],
            notable_patents: []
          },
          publications: [],
          innovation_score: 92,
          collaboration_potential: 88,
          connection_strength: 85,
          connection_status: 'connected',
          connected_at: new Date().toISOString(),
          last_interaction: new Date().toISOString(),
          interaction_frequency: 'weekly',
          collaboration_history: [],
          shared_patents: [],
          shared_interests: [],
          tags: [],
          notes: '',
          is_favorite: false,
          is_blocked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as unknown as NetworkContact,
        lastMessage: 'Thanks for reviewing the patent claims!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
        unreadCount: 2,
        isOnline: true,
        isPinned: true,
      },
      {
        id: '2',
        contact: {
          id: '2',
          user_id: 'user2',
          email: 'john.doe@innovate.ai',
          first_name: 'John',
          last_name: 'Doe',
          display_name: 'John Doe',
          profile_image: 'https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff',
          title: 'Innovation Manager',
          company: 'Innovate AI',
          location: 'New York, NY',
          bio: 'Innovation manager focused on AI and ML patents',
          years_experience: 8,
          education: [],
          expertise_areas: [],
          patent_profile: {} as any,
          publications: [],
          innovation_score: 88,
          collaboration_potential: 92,
          connection_strength: 78,
          connection_status: 'connected',
        } as unknown as NetworkContact,
        lastMessage: 'Let\'s schedule a call to discuss the AI patent landscape',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unreadCount: 0,
        isOnline: true,
      },
      {
        id: '3',
        contact: {
          id: '3',
          user_id: 'user3',
          email: 'maria.garcia@pharmatech.com',
          first_name: 'Maria',
          last_name: 'Garcia',
          display_name: 'Maria Garcia',
          profile_image: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=8b5cf6&color=fff',
          title: 'R&D Director',
          company: 'PharmaTech',
          location: 'Boston, MA',
          bio: 'R&D Director specializing in biotechnology and pharmaceutical patents',
          years_experience: 12,
          education: [],
          expertise_areas: [],
          patent_profile: {} as any,
          publications: [],
          innovation_score: 90,
          collaboration_potential: 86,
          connection_strength: 82,
          connection_status: 'connected',
        } as unknown as NetworkContact,
        lastMessage: 'The prior art analysis is ready for review',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
        unreadCount: 1,
        isOnline: false,
      },
    ];
    
    setConversations(mockConversations);
  };

  const loadMessages = (_conversationId: string) => {
    // Mock messages for demo
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Hi! I\'ve reviewed the patent application you sent.',
        sender: 'them',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        status: 'read',
      },
      {
        id: '2',
        text: 'Great! What are your thoughts on the claims?',
        sender: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        status: 'read',
      },
      {
        id: '3',
        text: 'The claims look solid, but I think we should broaden claim 3 to cover more embodiments.',
        sender: 'them',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'read',
      },
      {
        id: '4',
        text: 'I also found some relevant prior art that we should consider.',
        sender: 'them',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        status: 'read',
        attachments: [
          { name: 'prior_art_analysis.pdf', size: '2.4 MB', type: 'pdf' },
        ],
      },
      {
        id: '5',
        text: 'Thanks for the thorough review! I\'ll update claim 3 accordingly.',
        sender: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'delivered',
      },
      {
        id: '6',
        text: 'Thanks for reviewing the patent claims!',
        sender: 'them',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: 'delivered',
      },
    ];
    
    setMessages(mockMessages);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'me',
      timestamp: new Date(),
      status: 'sending',
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    
    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
    }, 500);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchQuery === '' || 
      conv.contact.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'unread' && conv.unreadCount > 0) ||
      (filterType === 'starred' && conv.isPinned) ||
      (filterType === 'archived' && conv.isArchived);
    
    return matchesSearch && matchesFilter;
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Conversations List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Messages
            </h2>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-3">
            {(['all', 'unread', 'starred', 'archived'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                  filterType === filter
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conversation => (
            <button
              key={conversation.id}
              onClick={() => {
                setSelectedConversation(conversation);
                loadMessages(conversation.id);
              }}
              className={`w-full p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={conversation.contact.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.contact.display_name)}&background=3b82f6&color=fff`}
                    alt={conversation.contact.display_name}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">
                      {conversation.contact.display_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {conversation.contact.title} • {conversation.contact.company}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedConversation.contact.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.contact.display_name)}&background=3b82f6&color=fff`}
                    alt={selectedConversation.contact.display_name}
                    className="w-10 h-10 rounded-full"
                  />
                  {selectedConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation.contact.display_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.contact.title} at {selectedConversation.contact.company}
                    {selectedConversation.isOnline && ' • Online'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Info className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${message.sender === 'me' ? 'order-2' : ''}`}>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === 'me'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.attachments && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 p-2 rounded ${
                              message.sender === 'me' ? 'bg-blue-700' : 'bg-gray-200'
                            }`}
                          >
                            <Paperclip className="w-4 h-4" />
                            <span className="text-sm">{attachment.name}</span>
                            <span className="text-xs opacity-75">({attachment.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === 'me' && (
                      <span className="text-xs text-gray-500">
                        {message.status === 'read' ? (
                          <CheckCheck className="w-3 h-3 inline text-blue-600" />
                        ) : message.status === 'delivered' ? (
                          <CheckCheck className="w-3 h-3 inline" />
                        ) : message.status === 'sent' ? (
                          <Check className="w-3 h-3 inline" />
                        ) : (
                          <Clock className="w-3 h-3 inline" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;