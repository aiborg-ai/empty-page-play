import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { ChatService } from '../lib/chatService';
import type { UserPresence } from '../types/network';

interface PresenceIndicatorProps {
  userId: string;
  showStatus?: boolean;
  showActivity?: boolean;
  className?: string;
}

const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  userId,
  showStatus = true,
  showActivity = false,
  className = ''
}) => {
  const [presence, setPresence] = useState<UserPresence | null>(null);

  useEffect(() => {
    loadUserPresence();
    
    // Listen for presence updates
    const handlePresenceUpdate = (event: any) => {
      const { detail } = event as CustomEvent;
      if (detail.new?.user_id === userId) {
        setPresence(detail.new);
      }
    };

    window.addEventListener('presenceUpdate', handlePresenceUpdate);
    return () => window.removeEventListener('presenceUpdate', handlePresenceUpdate);
  }, [userId]);

  const loadUserPresence = async () => {
    try {
      const presenceData = await ChatService.getUserPresence([userId]);
      if (presenceData.length > 0) {
        setPresence(presenceData[0]);
      } else {
        // Generate demo presence data
        const demoPresence: UserPresence = {
          user_id: userId,
          status: Math.random() > 0.3 ? 'online' : Math.random() > 0.5 ? 'away' : 'offline',
          status_message: Math.random() > 0.7 ? 'Working on patent application' : undefined,
          current_activity: Math.random() > 0.6 ? 'Reviewing prior art' : undefined,
          last_seen_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          timezone: 'America/New_York'
        };
        setPresence(demoPresence);
      }
    } catch (error) {
      console.error('Error loading user presence:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };


  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!presence) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
        {showStatus && <span className="text-xs text-gray-400">Loading...</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Indicator */}
      <div className="relative flex items-center">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(presence.status)} flex items-center justify-center`}>
          {presence.status === 'online' && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
        
        {/* Activity Indicator for Online Users */}
        {presence.status === 'online' && presence.current_activity && (
          <div className="absolute -top-1 -right-1">
            <Zap className="w-3 h-3 text-blue-500" />
          </div>
        )}
      </div>

      {/* Status Text and Details */}
      {showStatus && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${
              presence.status === 'online' ? 'text-green-600' :
              presence.status === 'away' ? 'text-yellow-600' :
              presence.status === 'busy' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {getStatusText(presence.status)}
            </span>
            
            {presence.status === 'offline' && (
              <span className="text-xs text-gray-400">
                {formatLastSeen(presence.last_seen_at)}
              </span>
            )}
          </div>

          {/* Custom Status Message */}
          {presence.status_message && (
            <span className="text-xs text-gray-600 truncate max-w-32">
              {presence.status_message}
            </span>
          )}

          {/* Current Activity */}
          {showActivity && presence.current_activity && presence.status === 'online' && (
            <div className="flex items-center gap-1 mt-1">
              <Zap className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-blue-600 truncate max-w-40">
                {presence.current_activity}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Enhanced Contact Card with Presence
export const ContactCardWithPresence: React.FC<{
  contact: any;
  _onClick: () => void;
  onStartConversation: () => void;
  _onSendInvitation: () => void;
}> = ({ contact, onStartConversation }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden hover:border-blue-300">
      {/* Header with Presence */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              {/* Avatar with Presence Indicator */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {contact.first_name[0]}{contact.last_name[0]}
                  </span>
                </div>
                
                {/* Presence Indicator */}
                <div className="absolute -bottom-1 -right-1">
                  <PresenceIndicator 
                    userId={contact.contact_user_id || contact.id} 
                    showStatus={false}
                    className="bg-white rounded-full p-0.5"
                  />
                </div>
              </div>
              
              {/* Name and Title with Presence Status */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {contact.display_name}
                </h3>
                <p className="text-sm text-gray-600 truncate">{contact.title}</p>
                
                {/* Presence Status */}
                <div className="mt-1">
                  <PresenceIndicator 
                    userId={contact.contact_user_id || contact.id}
                    showStatus={true}
                    showActivity={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the contact card content would go here */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 mt-4">
          <button 
            onClick={onStartConversation}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresenceIndicator;