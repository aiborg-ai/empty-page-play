import React from 'react';
import {
  MessageSquare,
  UserPlus,
  MapPin,
  Building2,
  Award,
  Zap,
  Network,
  Clock,
  ExternalLink,
  Users,
  Star,
  CheckCircle,
  Circle,
  Clock3,
  Send,
  AlertCircle
} from 'lucide-react';
import type { NetworkContact } from '../types/network';

interface ContactCardProps {
  contact: NetworkContact;
  onClick: () => void;
  onStartConversation: () => void;
  onSendInvitation: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onClick,
  onStartConversation,
  onSendInvitation
}) => {
  
  /**
   * Get status icon and color based on connection status
   */
  const getConnectionStatusDisplay = () => {
    switch (contact.connection_status) {
      case 'close_collaborator':
        return {
          icon: <Star className="w-4 h-4" />,
          text: 'Close Collaborator',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          borderColor: 'border-purple-200'
        };
      case 'connected':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Connected',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        };
      case 'known_connection':
        return {
          icon: <Users className="w-4 h-4" />,
          text: 'Known Connection',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200'
        };
      case 'invitation_sent':
        return {
          icon: <Send className="w-4 h-4" />,
          text: 'Invitation Sent',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-200'
        };
      case 'invitation_received':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Invitation Received',
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-100',
          borderColor: 'border-cyan-200'
        };
      default:
        return {
          icon: <Circle className="w-4 h-4" />,
          text: 'Not Connected',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200'
        };
    }
  };

  /**
   * Get collaboration potential color
   */
  const getCollaborationColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  /**
   * Get innovation score color
   */
  const getInnovationColor = (score: number) => {
    if (score >= 80) return 'text-purple-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-gray-600';
  };

  /**
   * Format last interaction time
   */
  const formatLastInteraction = (dateString?: string) => {
    if (!dateString) return 'No recent activity';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  /**
   * Handle card click (prevent propagation for action buttons)
   */
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  /**
   * Handle action button clicks (prevent event bubbling)
   */
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const statusDisplay = getConnectionStatusDisplay();
  const topExpertise = contact.expertise_areas.slice(0, 3);
  const hasRecentActivity = contact.last_interaction && 
    (Date.now() - new Date(contact.last_interaction).getTime()) < (7 * 24 * 60 * 60 * 1000); // 7 days

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md 
        transition-all duration-200 cursor-pointer group overflow-hidden
        ${statusDisplay.borderColor} hover:border-blue-300
      `}
      onClick={handleCardClick}
    >
      {/* Header with Status */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          {/* Profile Section */}
          <div className="flex-1 min-w-0">
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-3">
              {/* Avatar Placeholder */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-lg">
                  {contact.first_name[0]}{contact.last_name[0]}
                </span>
              </div>
              
              {/* Name and Title */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {contact.display_name}
                  {contact.is_verified && (
                    <CheckCircle className="inline w-4 h-4 text-blue-500 ml-1" />
                  )}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {contact.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate">
                    {contact.company}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color} ${statusDisplay.bgColor}`}>
            {statusDisplay.icon}
            <span className="hidden sm:inline">{statusDisplay.text}</span>
          </div>
        </div>

        {/* Location and Activity */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{contact.location}</span>
          </div>
          {hasRecentActivity && (
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Expertise Tags */}
      {topExpertise.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1">
            {topExpertise.map((expertise, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 border"
              >
                {expertise.name}
              </span>
            ))}
            {contact.expertise_areas.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-50 text-gray-500 border border-dashed">
                +{contact.expertise_areas.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Patent and Innovation Metrics */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* Patent Count */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
              <Award className="w-3 h-3" />
              <span>Patents</span>
            </div>
            <div className="font-semibold text-sm text-gray-900">
              {contact.patent_profile.total_patents}
            </div>
          </div>

          {/* Innovation Score */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
              <Zap className="w-3 h-3" />
              <span>Innovation</span>
            </div>
            <div className={`font-semibold text-sm ${getInnovationColor(contact.innovation_score)}`}>
              {contact.innovation_score}
            </div>
          </div>

          {/* Collaboration Potential */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
              <Network className="w-3 h-3" />
              <span>Match</span>
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCollaborationColor(contact.collaboration_potential)}`}>
              {contact.collaboration_potential}%
            </div>
          </div>
        </div>

        {/* Last Interaction */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Clock className="w-3 h-3" />
          <span>{formatLastInteraction(contact.last_interaction)}</span>
          {contact.mutual_connections > 0 && (
            <>
              <span>•</span>
              <Users className="w-3 h-3" />
              <span>{contact.mutual_connections} mutual</span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex gap-2">
          {/* Primary Action based on connection status */}
          {contact.connection_status === 'connected' || contact.connection_status === 'close_collaborator' ? (
            <button
              onClick={(e) => handleActionClick(e, onStartConversation)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>
          ) : contact.connection_status === 'invitation_received' ? (
            <button
              onClick={(e) => handleActionClick(e, onSendInvitation)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Accept</span>
            </button>
          ) : contact.connection_status === 'invitation_sent' ? (
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium"
            >
              <Clock3 className="w-4 h-4" />
              <span>Pending</span>
            </button>
          ) : (
            <button
              onClick={(e) => handleActionClick(e, onSendInvitation)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              <span>Connect</span>
            </button>
          )}

          {/* Secondary Actions Menu */}
          <button
            onClick={(e) => handleActionClick(e, onClick)}
            className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-5 transition-opacity duration-200 pointer-events-none"></div>
    </div>
  );
};

export default ContactCard;