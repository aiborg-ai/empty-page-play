import { useState, useEffect } from 'react';
import { 
  Database, 
  Upload, 
  Download, 
  AlertCircle,
  CheckCircle,
  Cloud,
  HardDrive
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SpaceService from '../lib/spaceService';
import type { Space } from '../types/spaces';
import type { Project as CMSSpace, CreateProjectData as CMSCreateSpaceData } from '../types/cms';

interface SupabaseSpaceManagerProps {
  spaces: Space[];
  onSpacesUpdate: (spaces: Space[]) => void;
  onClose: () => void;
}

export default function SupabaseSpaceManager({ 
  spaces, 
  onSpacesUpdate, 
  onClose 
}: SupabaseSpaceManagerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [storageMode, setStorageMode] = useState<'local' | 'supabase'>('local');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    checkSupabaseConnection();
    detectStorageMode();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSupabaseUser(user);
        setIsConnected(true);
        setStorageMode('supabase');
      }
    } catch (error) {
      console.error('Error checking Supabase connection:', error);
    }
  };

  const detectStorageMode = () => {
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      setStorageMode('local');
    }
  };

  const handleSignInToSupabase = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        setSupabaseUser(data.user);
        setIsConnected(true);
        setStorageMode('supabase');
      }
    } catch (error) {
      console.error('Error signing in to Supabase:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpToSupabase = async (email: string, password: string, userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: `${userData.firstName} ${userData.lastName}`,
            first_name: userData.firstName,
            last_name: userData.lastName
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        setSupabaseUser(data.user);
        setIsConnected(true);
        setStorageMode('supabase');
      }
    } catch (error) {
      console.error('Error signing up to Supabase:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const syncSpacesToSupabase = async () => {
    if (!isConnected || !supabaseUser) {
      setError('Not connected to Supabase');
      return;
    }

    setSyncStatus('syncing');
    setError(null);

    try {
      // Get local spaces
      const localSpaces = spaces.filter(p => !p.id.includes('supabase'));
      
      for (const space of localSpaces) {
        const spaceData: CMSCreateSpaceData = {
          name: space.name,
          description: space.description,
          color: space.color,
          tags: space.tags,
          is_public: space.accessLevel === 'public',
          project_type: 'research',
          priority: 'medium',
          notes: ''
        };

        const result = await SpaceService.createSpace(spaceData);
        if (result.error) {
          throw new Error(`Failed to sync space "${space.name}": ${result.error}`);
        }
      }
      
      // Reload all spaces from Supabase
      await loadSpacesFromSupabase();
      setSyncStatus('success');
      
    } catch (error) {
      console.error('Error syncing spaces:', error);
      setError(error instanceof Error ? error.message : 'Failed to sync spaces');
      setSyncStatus('error');
    }
  };

  const loadSpacesFromSupabase = async () => {
    if (!isConnected) return;

    setLoading(true);
    setError(null);

    try {
      const response = await SpaceService.getSpaces();
      if (response.data) {
        const convertedSpaces = response.data.map(convertCMSSpaceToLegacy);
        onSpacesUpdate(convertedSpaces);
      }
    } catch (error) {
      console.error('Error loading spaces from Supabase:', error);
      setError(error instanceof Error ? error.message : 'Failed to load spaces');
    } finally {
      setLoading(false);
    }
  };

  const convertCMSSpaceToLegacy = (cmsSpace: CMSSpace): Space => {
    return {
      id: `supabase_${cmsSpace.id}`,
      name: cmsSpace.name,
      description: cmsSpace.description || '',
      ownerId: cmsSpace.owner_id,
      ownerName: cmsSpace.owner?.display_name || 'Unknown',
      createdAt: cmsSpace.created_at,
      updatedAt: cmsSpace.updated_at,
      accessLevel: cmsSpace.is_public ? 'public' : 'private' as any,
      assets: [],
      assetCount: 0,
      collaborators: [],
      collaboratorCount: 0,
      activities: [],
      lastActivity: cmsSpace.updated_at,
      settings: {
        autoSaveSearches: true,
        autoCreateAssets: true,
        allowCrossSpaceAssets: true,
        notificationSettings: {
          onNewActivity: true,
          onCollaboratorJoin: true,
          onAssetAdded: false
        }
      },
      tags: cmsSpace.tags || [],
      color: cmsSpace.color || '#3b82f6',
      isFavorite: false,
      isArchived: cmsSpace.status === 'archived'
    };
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setSupabaseUser(null);
      setIsConnected(false);
      setStorageMode('local');
      setSyncStatus('idle');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">Space Storage Manager</h2>
              <p className="text-sm text-gray-600">Manage where your spaces are stored</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Storage Mode */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Current Storage Mode</h3>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                storageMode === 'local' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                <HardDrive className="w-4 h-4" />
                <span className="text-sm font-medium">Local Storage</span>
                {storageMode === 'local' && <CheckCircle className="w-4 h-4" />}
              </div>
              
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                storageMode === 'supabase' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                <Cloud className="w-4 h-4" />
                <span className="text-sm font-medium">Supabase Cloud</span>
                {storageMode === 'supabase' && <CheckCircle className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Error</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Supabase Connection Status */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Supabase Connection</h3>
              <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>

            {isConnected ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p><strong>User:</strong> {supabaseUser?.email}</p>
                  <p><strong>ID:</strong> {supabaseUser?.id}</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={syncSpacesToSupabase}
                    disabled={loading || syncStatus === 'syncing'}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Local Spaces'}
                  </button>
                  
                  <button
                    onClick={loadSpacesFromSupabase}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4" />
                    Load from Supabase
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>

                {syncStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Sync Complete</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">Spaces have been synchronized to Supabase.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Connect to Supabase to store your spaces in the cloud and enable collaboration features.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium mb-2">Demo Users: Sign Up for Full Features</p>
                  <p className="text-sm text-blue-700">
                    You're currently using demo mode with local storage. Create a Supabase account to:
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Store spaces permanently in the cloud</li>
                    <li>• Share spaces with team members</li>
                    <li>• Access spaces from any device</li>
                    <li>• Enable real-time collaboration</li>
                  </ul>
                </div>

                <SupabaseAuthForm 
                  onSignIn={handleSignInToSupabase}
                  onSignUp={handleSignUpToSupabase}
                  loading={loading}
                />
              </div>
            )}
          </div>

          {/* Space Count Info */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Local Spaces: {spaces.filter(p => !p.id.includes('supabase')).length}</span>
              <span>Supabase Spaces: {spaces.filter(p => p.id.includes('supabase')).length}</span>
              <span>Total: {spaces.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SupabaseAuthFormProps {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string, userData: any) => void;
  loading: boolean;
}

function SupabaseAuthForm({ onSignIn, onSignUp, loading }: SupabaseAuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signin') {
      onSignIn(email, password);
    } else {
      onSignUp(email, password, { firstName, lastName });
    }
  };

  // Pre-fill with demo user data if available
  useEffect(() => {
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      const user = JSON.parse(demoUser);
      setEmail(user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, []);

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('signin')}
          className={`px-3 py-2 text-sm rounded ${
            mode === 'signin' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`px-3 py-2 text-sm rounded ${
            mode === 'signup' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="px-3 py-2 border rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
        </button>
      </form>
    </div>
  );
}