import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { NetworkService } from '../lib/networkService';
import { InstantAuthService } from '../lib/instantAuth';
import type { NetworkContact, ConnectionInvitation } from '../types/network';

interface ConnectionManagerProps {
  onConnectionUpdate: () => void;
}

const ConnectionManager: React.FC<ConnectionManagerProps> = ({ onConnectionUpdate }) => {
  const [pendingInvitations, setPendingInvitations] = useState<ConnectionInvitation[]>([]);
  const [recentConnections, setRecentConnections] = useState<NetworkContact[]>([]);
  const [suggestedConnections, setSuggestedConnections] = useState<NetworkContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConnectionData();
  }, []);

  const loadConnectionData = async () => {
    setIsLoading(true);
    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) return;

      // Load recent connections (last 30 days)
      const allContacts = await NetworkService.getContacts({
        sort_by: 'recent_activity',
        sort_order: 'desc'
      });
      
      const recentlyConnected = allContacts
        .filter(contact => 
          contact.connection_date && 
          new Date(contact.connection_date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
        )
        .slice(0, 5);
      
      setRecentConnections(recentlyConnected);

      // Get suggested connections (high collaboration potential, not yet connected)
      const suggested = allContacts
        .filter(contact => 
          contact.connection_status === 'known_connection' && 
          contact.collaboration_potential >= 70
        )
        .slice(0, 8);
      
      setSuggestedConnections(suggested);

      // Generate mock pending invitations for demo
      const mockInvitations: ConnectionInvitation[] = [
        {
          id: 'inv1',
          sender_id: 'sender1',
          sender_name: 'Dr. Michael Rodriguez',
          receiver_id: currentUser.id,
          receiver_email: currentUser.email,
          message: 'Hi! I noticed we both work in blockchain security patents. Would love to connect and potentially collaborate on future projects.',
          invitation_type: 'collaborate',
          project_context: 'Quantum-Resistant Blockchain Security',
          expertise_needed: ['Blockchain', 'Cryptography', 'Security'],
          status: 'pending',
          sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'inv2',
          sender_id: 'sender2',
          sender_name: 'Lisa Wang',
          receiver_id: currentUser.id,
          receiver_email: currentUser.email,
          message: 'Your work on AI patent applications caught my attention. I\'m working on similar innovations and think we could have great synergy.',
          invitation_type: 'connect',
          status: 'pending',
          sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setPendingInvitations(mockInvitations);

    } catch (error) {
      console.error('Error loading connection data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitationResponse = async (invitationId: string, action: 'accept' | 'decline') => {
    try {
      // Update invitation status
      setPendingInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { ...inv, status: action === 'accept' ? 'accepted' : 'declined', responded_at: new Date().toISOString() }
            : inv
        )
      );

      if (action === 'accept') {
        // In a real implementation, this would create the connection
        console.log(`Accepted invitation ${invitationId}`);
        onConnectionUpdate();
      }

      // Remove from pending list after a brief delay for user feedback
      setTimeout(() => {
        setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      }, 1500);

    } catch (error) {
      console.error('Error responding to invitation:', error);
    }
  };

  const sendConnectionRequest = async (contactId: string) => {
    try {
      const contact = suggestedConnections.find(c => c.id === contactId);
      if (!contact) return;

      const result = await NetworkService.sendInvitation({
        contact_id: contactId,
        email: contact.email,
        message: `Hi ${contact.first_name}, I'd like to connect on InnoSpot to explore potential collaboration opportunities in ${contact.expertise_areas[0]?.name || 'innovation'}.`,
        invitation_type: 'connect'
      });

      if (result.success) {
        // Remove from suggested and show success
        setSuggestedConnections(prev => prev.filter(c => c.id !== contactId));
        onConnectionUpdate();
      }

    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl p-6">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-100 rounded"></div>
              <div className="h-12 bg-gray-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pending Invitations</h3>
              <p className="text-sm text-gray-600">
                {pendingInvitations.length} invitation{pendingInvitations.length !== 1 ? 's' : ''} waiting for your response
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingInvitations.map(invitation => (
              <div
                key={invitation.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {invitation.sender_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{invitation.sender_name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>Sent {formatTimeAgo(invitation.sent_at)}</span>
                        {invitation.invitation_type === 'collaborate' && (
                          <>
                            <span>•</span>
                            <Users className="w-3 h-3" />
                            <span>Collaboration</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, 'accept')}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, 'decline')}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <XCircle className="w-3 h-3" />
                      Decline
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{invitation.message}</p>

                {invitation.project_context && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-900 mb-1">
                      <Award className="w-4 h-4" />
                      Project Context
                    </div>
                    <p className="text-sm text-blue-800">{invitation.project_context}</p>
                    {invitation.expertise_needed && invitation.expertise_needed.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {invitation.expertise_needed.map((expertise, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700 border border-blue-200"
                          >
                            {expertise}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Connections */}
      {recentConnections.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Connections</h3>
              <p className="text-sm text-gray-600">
                Your latest professional connections
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {recentConnections.map(contact => (
              <div
                key={contact.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {contact.first_name[0]}{contact.last_name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{contact.display_name}</h4>
                  <p className="text-xs text-gray-600 truncate">{contact.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-green-600 font-medium">
                      Connected {formatTimeAgo(contact.connection_date || contact.created_at)}
                    </span>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Connections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Suggested Connections</h3>
            <p className="text-sm text-gray-600">
              High-potential collaborations based on expertise matching
            </p>
          </div>
        </div>

        {suggestedConnections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm">No new suggestions available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedConnections.map(contact => (
              <div
                key={contact.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {contact.first_name[0]}{contact.last_name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{contact.display_name}</h4>
                      <p className="text-sm text-gray-600 truncate">{contact.title}</p>
                      <p className="text-xs text-gray-500 truncate">{contact.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3" />
                    {contact.collaboration_potential}%
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {contact.expertise_areas.slice(0, 2).map((expertise, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 border"
                    >
                      {expertise.name}
                    </span>
                  ))}
                  {contact.expertise_areas.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-50 text-gray-500 border border-dashed">
                      +{contact.expertise_areas.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{contact.patent_profile.total_patents} patents</span>
                  <span>{contact.mutual_connections} mutual connections</span>
                </div>

                <button
                  onClick={() => sendConnectionRequest(contact.id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionManager;