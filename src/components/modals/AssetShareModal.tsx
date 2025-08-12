import React, { useState } from 'react';
import {
  X,
  Share2,
  Users,
  Mail,
  Link,
  Copy,
  Check,
  AlertCircle,
  Eye,
  Download,
  Edit,
  Trash2,
  Shield,
  Calendar,
  Plus,
  Search
} from 'lucide-react';
import { Asset, AssetShare, AssetPermission } from '../../types/assets';
import { assetService } from '../../lib/assetService';

interface AssetShareModalProps {
  asset: Asset;
  onClose: () => void;
  onShare: () => void;
}

const AssetShareModal: React.FC<AssetShareModalProps> = ({
  asset,
  onClose,
  onShare
}) => {
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<AssetPermission[]>(['view']);
  const [message, setMessage] = useState('');
  const [expiresIn, setExpiresIn] = useState('never');
  const [linkCopied, setLinkCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'people' | 'link'>('people');
  const [shares, setShares] = useState<AssetShare[]>(asset.sharedWith || []);

  const permissions: { value: AssetPermission; label: string; icon: React.ReactNode }[] = [
    { value: 'view', label: 'View', icon: <Eye className="w-4 h-4" /> },
    { value: 'download', label: 'Download', icon: <Download className="w-4 h-4" /> },
    { value: 'edit', label: 'Edit', icon: <Edit className="w-4 h-4" /> },
    { value: 'share', label: 'Share', icon: <Share2 className="w-4 h-4" /> },
    { value: 'delete', label: 'Delete', icon: <Trash2 className="w-4 h-4" /> }
  ];

  const suggestedUsers = [
    { email: 'team.lead@company.com', name: 'Team Lead' },
    { email: 'researcher@company.com', name: 'Senior Researcher' },
    { email: 'legal@company.com', name: 'Legal Department' },
    { email: 'innovation@company.com', name: 'Innovation Team' }
  ];

  const handleShare = async () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setSharing(true);
    setError('');
    
    try {
      const newShare: AssetShare = {
        email,
        name: email.split('@')[0],
        permissions: selectedPermissions,
        sharedAt: new Date().toISOString(),
        sharedBy: 'current-user',
        message,
        expiresAt: expiresIn === 'never' ? undefined : calculateExpiryDate(expiresIn)
      };
      
      await assetService.shareAsset(asset.id, [newShare]);
      setShares(prev => [...prev, newShare]);
      
      // Reset form
      setEmail('');
      setSelectedPermissions(['view']);
      setMessage('');
      setExpiresIn('never');
      
      onShare();
    } catch (error) {
      console.error('Error sharing asset:', error);
      setError('Failed to share asset. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const calculateExpiryDate = (duration: string): string => {
    const now = new Date();
    switch (duration) {
      case '1day':
        now.setDate(now.getDate() + 1);
        break;
      case '7days':
        now.setDate(now.getDate() + 7);
        break;
      case '30days':
        now.setDate(now.getDate() + 30);
        break;
      case '90days':
        now.setDate(now.getDate() + 90);
        break;
    }
    return now.toISOString();
  };

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/assets/${asset.id}`;
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const removeShare = async (shareEmail: string) => {
    try {
      // In production, this would call the API to remove the share
      setShares(prev => prev.filter(s => s.email !== shareEmail));
    } catch (error) {
      console.error('Error removing share:', error);
    }
  };

  const updateSharePermissions = (shareEmail: string, newPermissions: AssetPermission[]) => {
    setShares(prev => prev.map(s => 
      s.email === shareEmail ? { ...s, permissions: newPermissions } : s
    ));
  };

  const filteredSuggestedUsers = suggestedUsers.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600" />
                Share "{asset.name}"
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage who has access to this asset
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('people')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'people'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Share with People
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'link'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Link className="w-4 h-4 inline mr-2" />
              Share Link
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {activeTab === 'people' ? (
              <div className="space-y-6">
                {/* Add People */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add people
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>
                    <button
                      onClick={handleShare}
                      disabled={sharing || !email.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sharing ? 'Sharing...' : 'Share'}
                    </button>
                  </div>
                </div>
                
                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map(perm => (
                      <label key={perm.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions(prev => [...prev, perm.value]);
                            } else {
                              setSelectedPermissions(prev => prev.filter(p => p !== perm.value));
                            }
                          }}
                          disabled={perm.value === 'view'} // View is always selected
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex items-center gap-1 text-sm text-gray-700">
                          {perm.icon}
                          {perm.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Expiration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access expires
                  </label>
                  <select
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="never">Never</option>
                    <option value="1day">In 1 day</option>
                    <option value="7days">In 7 days</option>
                    <option value="30days">In 30 days</option>
                    <option value="90days">In 90 days</option>
                  </select>
                </div>
                
                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Add a message for the recipient..."
                  />
                </div>
                
                {/* Suggested Users */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested</h3>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search users..."
                    />
                  </div>
                  <div className="space-y-2">
                    {filteredSuggestedUsers.map(user => (
                      <button
                        key={user.email}
                        onClick={() => setEmail(user.email)}
                        className="w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Current Shares */}
                {shares.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      People with access ({shares.length})
                    </h3>
                    <div className="space-y-2">
                      {shares.map(share => (
                        <div key={share.email} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {share.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{share.name}</div>
                                <div className="text-xs text-gray-500">{share.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={share.permissions[0]}
                                onChange={(e) => {
                                  const perm = e.target.value as AssetPermission;
                                  updateSharePermissions(share.email!, [perm]);
                                }}
                                className="text-xs px-2 py-1 border border-gray-300 rounded"
                              >
                                <option value="view">View</option>
                                <option value="edit">Edit</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => removeShare(share.email!)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {share.expiresAt && (
                            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Expires {new Date(share.expiresAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Public Access */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Public Access</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={asset.isPublic}
                        onChange={() => {/* Toggle public access */}}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    {asset.isPublic
                      ? 'Anyone with the link can view this asset'
                      : 'Only people you share with can access this asset'}
                  </p>
                </div>
                
                {/* Share Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/assets/${asset.id}`}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Link Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Link settings</h3>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Allow downloading</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Require password</span>
                  </label>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Link expires
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="never">Never</option>
                      <option value="1day">In 1 day</option>
                      <option value="7days">In 7 days</option>
                      <option value="30days">In 30 days</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetShareModal;