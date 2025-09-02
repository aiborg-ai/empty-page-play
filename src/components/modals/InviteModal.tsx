import React, { useState } from 'react';
import { X, Send, Mail, UserPlus, Building2, MapPin } from 'lucide-react';
import { NetworkService } from '../../lib/networkService';
import type { NetworkContact, SendInvitationRequest } from '../../types/network';

interface InviteModalProps {
  preSelectedContact?: NetworkContact | null;
  onClose: () => void;
  onInviteSent: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  preSelectedContact,
  onClose,
  onInviteSent
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    company: '',
    message: preSelectedContact 
      ? `Hi ${preSelectedContact.first_name}, I'd like to connect with you on InnoSpot to collaborate on patent-related projects and share innovation insights.`
      : `Hi, I'd like to connect with you on InnoSpot to collaborate on patent-related projects and share innovation insights.`
  });
  const [invitationType, setInvitationType] = useState<'connect' | 'collaborate'>('connect');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (preSelectedContact) {
        // Send invitation to existing contact
        const invitationData: SendInvitationRequest = {
          contact_id: preSelectedContact.id,
          email: preSelectedContact.email,
          message: formData.message,
          invitation_type: invitationType
        };
        
        const result = await NetworkService.sendInvitation(invitationData);
        
        if (result.success) {
          setSuccess(true);
          setTimeout(() => {
            onInviteSent();
          }, 1500);
        } else {
          setError(result.message);
        }
      } else {
        // Create new contact and send invitation
        const contactData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          title: formData.title,
          company: formData.company,
          connection_source: 'manual'
        };
        
        const createResult = await NetworkService.createContact(contactData);
        
        if (createResult.success && createResult.contact) {
          // Send invitation to the newly created contact
          const invitationData: SendInvitationRequest = {
            contact_id: createResult.contact.id,
            email: createResult.contact.email,
            message: formData.message,
            invitation_type: invitationType
          };
          
          const inviteResult = await NetworkService.sendInvitation(invitationData);
          
          if (inviteResult.success) {
            setSuccess(true);
            setTimeout(() => {
              onInviteSent();
            }, 1500);
          } else {
            setError(inviteResult.message);
          }
        } else {
          setError(createResult.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error sending invitation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); // Clear error when user starts typing
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Invitation Sent!</h3>
          <p className="text-gray-600 mb-4">
            Your {invitationType} invitation has been sent successfully.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Closing in a moment...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            {preSelectedContact ? `Invite ${preSelectedContact.first_name}` : 'Invite New Contact'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Invitation Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invitation Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="invitationType"
                  value="connect"
                  checked={invitationType === 'connect'}
                  onChange={(e) => setInvitationType(e.target.value as 'connect')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Connect</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="invitationType"
                  value="collaborate"
                  checked={invitationType === 'collaborate'}
                  onChange={(e) => setInvitationType(e.target.value as 'collaborate')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Collaborate</span>
              </label>
            </div>
          </div>

          {/* Contact Information - only show if not pre-selected */}
          {!preSelectedContact && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john.doe@company.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Senior Patent Attorney"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Innovation Corp"
                  />
                </div>
              </div>
            </>
          )}

          {/* Show existing contact info if pre-selected */}
          {preSelectedContact && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {preSelectedContact.first_name[0]}{preSelectedContact.last_name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{preSelectedContact.display_name}</h3>
                  <p className="text-sm text-gray-600">{preSelectedContact.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>{preSelectedContact.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{preSelectedContact.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Personal Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add a personal note to your invitation..."
            />
            <p className="text-xs text-gray-500 mt-1">
              A personal message increases your chance of connection by 50%
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!preSelectedContact && (!formData.firstName || !formData.lastName || !formData.email))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Invitation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;