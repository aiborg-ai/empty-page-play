import { useState } from 'react';
import { X, Gift } from 'lucide-react';
import { Capability } from '../../types/capabilities';

interface ShareCapabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  capability: Capability | null;
  onShare: (capabilityId: string, userEmail: string, message: string) => void;
}

export const ShareCapabilityModal = ({ 
  isOpen, 
  onClose, 
  capability, 
  onShare 
}: ShareCapabilityModalProps) => {
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen || !capability) return null;

  const handleShare = () => {
    if (!userEmail.trim()) return;
    onShare(capability.id, userEmail, message);
    onClose();
    setUserEmail('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Share Capability</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{capability.name}</h4>
            <p className="text-sm text-gray-600">{capability.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Email *
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter user's email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              The user will be able to run this capability and all generated assets will be saved to their projects.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={!userEmail.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Gift className="w-4 h-4" />
            Share Capability
          </button>
        </div>
      </div>
    </div>
  );
};