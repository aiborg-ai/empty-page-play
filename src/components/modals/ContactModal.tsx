import React from 'react';
import { X, MessageSquare, UserPlus, Mail, Phone, ExternalLink, MapPin, Building2, Award, BookOpen, Calendar, Users } from 'lucide-react';
import type { NetworkContact } from '../../types/network';

interface ContactModalProps {
  contact: NetworkContact;
  onClose: () => void;
  onStartConversation: () => void;
  onSendInvitation: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({
  contact,
  onClose,
  onStartConversation,
  onSendInvitation
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-semibold text-2xl">
                {contact.first_name[0]}{contact.last_name[0]}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{contact.display_name}</h2>
              <p className="text-gray-600">{contact.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{contact.company}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">{contact.bio}</p>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{contact.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{contact.location}</span>
              </div>
              {contact.linkedin_url && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                  <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Expertise */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Expertise Areas</h3>
            <div className="flex flex-wrap gap-2">
              {contact.expertise_areas.map((expertise, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {expertise.name}
                  <span className="ml-2 text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                    {expertise.years_experience}y
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Patent Profile */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Patent Portfolio</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{contact.patent_profile.total_patents}</div>
                <div className="text-sm text-gray-600">Total Patents</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{contact.patent_profile.h_index || 'N/A'}</div>
                <div className="text-sm text-gray-600">H-Index</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{contact.patent_profile.recent_publications}</div>
                <div className="text-sm text-gray-600">Recent Pubs</div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Innovation Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Innovation Score</span>
                  <span>{contact.innovation_score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${contact.innovation_score}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Collaboration Potential</span>
                  <span>{contact.collaboration_potential}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${contact.collaboration_potential}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{contact.mutual_connections} mutual connections</span>
          </div>
          
          <div className="flex items-center gap-3">
            {contact.connection_status === 'connected' || contact.connection_status === 'close_collaborator' ? (
              <button
                onClick={onStartConversation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <MessageSquare className="w-4 h-4" />
                Start Conversation
              </button>
            ) : (
              <button
                onClick={onSendInvitation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4" />
                Send Invitation
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;