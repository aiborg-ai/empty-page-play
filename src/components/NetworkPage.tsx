import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  X,
  MessageSquare, 
  Bell,
  Filter,
  Settings,
  Sparkles,
  TrendingUp,
  Network,
  Zap,
  UserPlus
} from 'lucide-react';
import { InstantUser } from '../lib/instantAuth';
import { NetworkService } from '../lib/networkService';
import { ChatService } from '../lib/chatService';
import { saveMockNetworkToLocalStorage } from '../lib/mockNetworkData';
import type { 
  NetworkContact, 
  NetworkStats, 
  NetworkSearchFilters,
  SmartRecommendation,
  ConnectionStatus 
} from '../types/network';
import NetworkSidebar from './NetworkSidebar';
import ContactCard from './ContactCard';
import ContactModal from './modals/ContactModal';
import ChatPanel from './ChatPanel';
import HelpIcon from './utils/HelpIcon';
import InviteModal from './modals/InviteModal';
import ConnectionManager from './ConnectionManager';
import NetworkAnalytics from './NetworkAnalytics';
import CollaborationWorkspace from './CollaborationWorkspace';
import AIRecommendationEngine from './AIRecommendationEngine';
import VoiceSearchButton from './VoiceSearchButton';
import { ROLE_CATEGORIES, ROLE_LEVELS } from '../constants/professionalRoles';

interface NetworkPageProps {
  currentUser: InstantUser;
}

const NetworkPage: React.FC<NetworkPageProps> = ({ currentUser }) => {
  // State management
  const [contacts, setContacts] = useState<NetworkContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<NetworkContact[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState<ConnectionStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContact, setSelectedContact] = useState<NetworkContact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showConnectionManager, setShowConnectionManager] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [showAIEngine, setShowAIEngine] = useState(false);
  
  // Search and filter state
  const [searchFilters, setSearchFilters] = useState<NetworkSearchFilters>({
    query: '',
    sort_by: 'collaboration_potential',
    sort_order: 'desc'
  });
  
  // Professional role filters
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>('all');
  const [selectedRoleLevel, setSelectedRoleLevel] = useState<string>('all');

  // Initialize network data and chat service
  useEffect(() => {
    initializeNetwork();
    ChatService.initialize();
    
    return () => {
      ChatService.cleanup();
    };
  }, [currentUser]);

  // Apply filters when search or category changes
  useEffect(() => {
    applyFilters();
  }, [contacts, selectedCategory, searchQuery, searchFilters, selectedRoleCategory, selectedRoleLevel]);

  /**
   * Initialize network data
   */
  const initializeNetwork = async () => {
    console.log('🌐 Initializing network for user:', currentUser.id);
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if user has existing network data
      let networkContacts = await NetworkService.getContacts();
      
      // If no contacts exist, generate mock data for demo
      if (networkContacts.length === 0) {
        console.log('📱 No existing network found, generating mock data...');
        networkContacts = saveMockNetworkToLocalStorage(currentUser.id);
      }
      
      setContacts(networkContacts);
      
      // Load network statistics
      const stats = await NetworkService.getNetworkStats();
      setNetworkStats(stats);
      
      // Load smart recommendations
      const smartRecs = await NetworkService.getSmartRecommendations();
      setRecommendations(smartRecs);
      
    } catch (err) {
      console.error('Error initializing network:', err);
      setError('Failed to load network data');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Apply search and category filters
   */
  const applyFilters = useCallback(() => {
    let filtered = [...contacts];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(contact => contact.connection_status === selectedCategory);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.display_name.toLowerCase().includes(query) ||
        contact.company.toLowerCase().includes(query) ||
        contact.title.toLowerCase().includes(query) ||
        contact.expertise_areas.some(expertise => 
          expertise.name.toLowerCase().includes(query)
        )
      );
    }
    
    // Apply professional role filters
    if (selectedRoleCategory !== 'all') {
      filtered = filtered.filter(contact => {
        // Check if contact's title matches any role in the selected category
        return contact.title.toLowerCase().includes(selectedRoleCategory) ||
          (selectedRoleCategory === 'patent' && (
            contact.title.toLowerCase().includes('patent') ||
            contact.title.toLowerCase().includes('epa') ||
            contact.title.toLowerCase().includes('cpa')
          )) ||
          (selectedRoleCategory === 'trademark' && (
            contact.title.toLowerCase().includes('trademark') ||
            contact.title.toLowerCase().includes('trade mark') ||
            contact.title.toLowerCase().includes('brand')
          )) ||
          (selectedRoleCategory === 'legal' && (
            contact.title.toLowerCase().includes('solicitor') ||
            contact.title.toLowerCase().includes('barrister') ||
            contact.title.toLowerCase().includes('counsel') ||
            contact.title.toLowerCase().includes('litigator')
          )) ||
          (selectedRoleCategory === 'management' && (
            contact.title.toLowerCase().includes('manager') ||
            contact.title.toLowerCase().includes('director') ||
            contact.title.toLowerCase().includes('head') ||
            contact.title.toLowerCase().includes('chief') ||
            contact.title.toLowerCase().includes('vp')
          )) ||
          (selectedRoleCategory === 'technical' && (
            contact.title.toLowerCase().includes('analyst') ||
            contact.title.toLowerCase().includes('engineer') ||
            contact.title.toLowerCase().includes('specialist') ||
            contact.title.toLowerCase().includes('searcher')
          )) ||
          (selectedRoleCategory === 'support' && (
            contact.title.toLowerCase().includes('paralegal') ||
            contact.title.toLowerCase().includes('administrator') ||
            contact.title.toLowerCase().includes('admin')
          ));
      });
    }
    
    if (selectedRoleLevel !== 'all') {
      filtered = filtered.filter(contact => {
        const titleLower = contact.title.toLowerCase();
        return (selectedRoleLevel === 'executive' && (
          titleLower.includes('chief') ||
          titleLower.includes('director') ||
          titleLower.includes('head') ||
          titleLower.includes('vp')
        )) ||
        (selectedRoleLevel === 'senior' && (
          titleLower.includes('senior') ||
          titleLower.includes('principal') ||
          titleLower.includes('chartered')
        )) ||
        (selectedRoleLevel === 'mid' && (
          !titleLower.includes('senior') &&
          !titleLower.includes('junior') &&
          !titleLower.includes('trainee') &&
          !titleLower.includes('chief') &&
          !titleLower.includes('director')
        )) ||
        (selectedRoleLevel === 'junior' && (
          titleLower.includes('junior') ||
          titleLower.includes('associate')
        )) ||
        (selectedRoleLevel === 'trainee' && (
          titleLower.includes('trainee') ||
          titleLower.includes('intern')
        ));
      });
    }
    
    // Apply additional filters
    if (searchFilters.min_innovation_score) {
      filtered = filtered.filter(contact => 
        contact.innovation_score >= searchFilters.min_innovation_score!
      );
    }
    
    if (searchFilters.min_collaboration_potential) {
      filtered = filtered.filter(contact => 
        contact.collaboration_potential >= searchFilters.min_collaboration_potential!
      );
    }
    
    // Apply sorting
    const sortField = searchFilters.sort_by;
    const sortOrder = searchFilters.sort_order;
    
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'alphabetical':
          aValue = a.display_name;
          bValue = b.display_name;
          break;
        case 'recent_activity':
          aValue = new Date(a.last_interaction || '1970-01-01').getTime();
          bValue = new Date(b.last_interaction || '1970-01-01').getTime();
          break;
        case 'innovation_score':
          aValue = a.innovation_score;
          bValue = b.innovation_score;
          break;
        case 'connection_strength':
          aValue = a.connection_strength;
          bValue = b.connection_strength;
          break;
        default:
          aValue = a.collaboration_potential;
          bValue = b.collaboration_potential;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setFilteredContacts(filtered);
  }, [contacts, selectedCategory, searchQuery, searchFilters]);

  /**
   * Handle contact selection
   */
  const handleContactClick = (contact: NetworkContact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  /**
   * Handle starting a conversation
   */
  const handleStartConversation = async (contact: NetworkContact) => {
    console.log('💬 Starting conversation with:', contact.display_name);
    // TODO: Implement conversation creation and open chat panel
    setShowChatPanel(true);
  };

  /**
   * Handle sending connection invitation
   */
  const handleSendInvitation = async (contact: NetworkContact) => {
    setSelectedContact(contact);
    setShowInviteModal(true);
  };

  /**
   * Refresh network data
   */
  const refreshNetwork = () => {
    initializeNetwork();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Network className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Your Collab Hub</h3>
          <p className="text-gray-600">Connecting with innovation professionals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Network className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Collab Hub Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refreshNetwork}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full">
      {/* Sidebar */}
      <NetworkSidebar
        networkStats={networkStats}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        recommendations={recommendations}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Collab Hub
                <HelpIcon section="network" onNavigate={undefined} />
                {networkStats && (
                  <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {networkStats.total_connections} connections
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                Your collaboration hub for patent experts and innovators
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <button 
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Invite Contact
              </button>
              
              <button 
                onClick={() => setShowChatPanel(!showChatPanel)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Messages
              </button>
              
              <button 
                onClick={() => setShowConnectionManager(!showConnectionManager)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Network className="w-4 h-4" />
                Manage
              </button>
              
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </button>
              
              <button 
                onClick={() => setShowWorkspace(!showWorkspace)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Workspace
              </button>
              
              <button 
                onClick={() => setShowAIEngine(!showAIEngine)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <Zap className="w-4 h-4" />
                AI Engine
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Search and Filters Bar */}
          <div className="flex items-center gap-4 mt-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts by name, company, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <VoiceSearchButton
                  onTranscription={(text) => setSearchQuery(text)}
                  onInterimTranscription={(text) => setSearchQuery(text)}
                  className="!p-1.5"
                  placeholder="Say the name, company, or expertise you're looking for..."
                />
              </div>
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(searchFilters.min_innovation_score || 
                searchFilters.min_collaboration_potential ||
                selectedRoleCategory !== 'all' ||
                selectedRoleLevel !== 'all') && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
            
            {/* Sort Dropdown */}
            <select
              value={`${searchFilters.sort_by}_${searchFilters.sort_order}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('_') as [NetworkSearchFilters['sort_by'], NetworkSearchFilters['sort_order']];
                setSearchFilters(prev => ({ ...prev, sort_by: sortBy, sort_order: sortOrder }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="collaboration_potential_desc">Best Match</option>
              <option value="innovation_score_desc">Innovation Score</option>
              <option value="connection_strength_desc">Connection Strength</option>
              <option value="recent_activity_desc">Recent Activity</option>
              <option value="alphabetical_asc">Name A-Z</option>
            </select>
          </div>
          
          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              {/* Professional Role Filters */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Professional Roles</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Role Category</label>
                    <select
                      value={selectedRoleCategory}
                      onChange={(e) => setSelectedRoleCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {ROLE_CATEGORIES.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Experience Level</label>
                    <select
                      value={selectedRoleLevel}
                      onChange={(e) => setSelectedRoleLevel(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {ROLE_LEVELS.map(level => (
                        <option key={level.id} value={level.id}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Score Filters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Innovation Score
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={searchFilters.min_innovation_score || 0}
                    onChange={(e) => setSearchFilters(prev => ({ 
                      ...prev, 
                      min_innovation_score: parseInt(e.target.value) || undefined 
                    }))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">
                    {searchFilters.min_innovation_score || 0}/100
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Collaboration Potential
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={searchFilters.min_collaboration_potential || 0}
                    onChange={(e) => setSearchFilters(prev => ({ 
                      ...prev, 
                      min_collaboration_potential: parseInt(e.target.value) || undefined 
                    }))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">
                    {searchFilters.min_collaboration_potential || 0}/100
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => {
                    setSearchFilters({ sort_by: 'collaboration_potential', sort_order: 'desc' });
                    setSelectedRoleCategory('all');
                    setSelectedRoleLevel('all');
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Collab Hub Insights */}
        {recommendations.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-blue-900">Smart Recommendations</h2>
              </div>
              <button className="text-sm text-blue-700 hover:text-blue-800">
                View All ({recommendations.length})
              </button>
            </div>
            <div className="mt-3 flex gap-4 overflow-x-auto">
              {recommendations.slice(0, 3).map(rec => (
                <div
                  key={rec.id}
                  className="flex-shrink-0 bg-white rounded-lg p-4 border border-blue-200 min-w-72"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900">{rec.contact_name}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {rec.confidence_score}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.explanation}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {rec.suggested_action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Connection Manager Panel */}
        {showConnectionManager && (
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-600" />
                Connection Management
              </h2>
              <button
                onClick={() => setShowConnectionManager(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <ConnectionManager onConnectionUpdate={refreshNetwork} />
          </div>
        )}
        
        {/* Analytics Panel */}
        {showAnalytics && (
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Collab Hub Analytics
              </h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <NetworkAnalytics 
              contacts={filteredContacts} 
              onInsightClick={(insight) => console.log('Insight clicked:', insight)}
            />
          </div>
        )}
        
        {/* Collaboration Workspace Panel */}
        {showWorkspace && (
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Collaboration Workspace
              </h2>
              <button
                onClick={() => setShowWorkspace(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <CollaborationWorkspace 
              contacts={contacts}
            />
          </div>
        )}
        
        {/* AI Recommendation Engine Panel */}
        {showAIEngine && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-b border-purple-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                AI Recommendation Engine
              </h2>
              <button
                onClick={() => setShowAIEngine(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <AIRecommendationEngine 
              contacts={contacts}
              onRecommendationAction={(recId, actionId) => console.log('AI Action:', recId, actionId)}
              onFeedback={(recId, feedback) => console.log('AI Feedback:', recId, feedback)}
            />
          </div>
        )}
        
        {/* Contacts Grid */}
        <div className="flex-1 overflow-auto p-6">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery || selectedCategory !== 'all' ? 'No matches found' : 'No contacts yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters to find different contacts.'
                  : 'Start building your innovation network by adding patent professionals.'
                }
              </p>
              {!(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <UserPlus className="w-5 h-5" />
                  Invite First Contact
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-600">
                    Showing {filteredContacts.length} of {contacts.length} contacts
                    {selectedCategory !== 'all' && (
                      <span className="ml-2 text-blue-600">
                        ({selectedCategory.replace('_', ' ')})
                      </span>
                    )}
                  </p>
                  {/* Active Filters Display */}
                  {(selectedRoleCategory !== 'all' || selectedRoleLevel !== 'all') && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedRoleCategory !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {ROLE_CATEGORIES.find(c => c.id === selectedRoleCategory)?.label}
                          <button
                            onClick={() => setSelectedRoleCategory('all')}
                            className="hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedRoleLevel !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {ROLE_LEVELS.find(l => l.id === selectedRoleLevel)?.label}
                          <button
                            onClick={() => setSelectedRoleLevel('all')}
                            className="hover:text-green-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>Average Innovation Score: {Math.round(filteredContacts.reduce((sum, c) => sum + c.innovation_score, 0) / filteredContacts.length)}</span>
                </div>
              </div>
              
              {/* Contacts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContacts.map(contact => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onClick={() => handleContactClick(contact)}
                    onStartConversation={() => handleStartConversation(contact)}
                    onSendInvitation={() => handleSendInvitation(contact)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Chat Panel */}
      {showChatPanel && (
        <ChatPanel
          currentUser={currentUser}
          onClose={() => setShowChatPanel(false)}
        />
      )}
      
      {/* Modals */}
      {showContactModal && selectedContact && (
        <ContactModal
          contact={selectedContact}
          onClose={() => {
            setShowContactModal(false);
            setSelectedContact(null);
          }}
          onStartConversation={() => handleStartConversation(selectedContact)}
          onSendInvitation={() => handleSendInvitation(selectedContact)}
        />
      )}
      
      {showInviteModal && (
        <InviteModal
          preSelectedContact={selectedContact}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedContact(null);
          }}
          onInviteSent={() => {
            setShowInviteModal(false);
            setSelectedContact(null);
            refreshNetwork();
          }}
        />
      )}
    </div>
  );
};

export default NetworkPage;