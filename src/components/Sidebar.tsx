import { useState, useEffect } from 'react';
import { 
  Store,
  Briefcase,
  Bot,
  FileText,
  Users,
  Bell,
  User,
  Settings,
  BookOpen,
  BarChart3,
  Search,
  Zap,
  Wrench,
  Database,
  Award,
  UserCheck,
  UserPlus,
  Eye,
  X,
  Home,
  Shield,
  Sparkles,
  Target,
  Brain,
  TrendingUp,
  Key,
  MessageSquare,
  HelpCircle,
  Activity,
  DollarSign,
  Dna,
  Globe,
  Map,
  Compass
} from 'lucide-react';
import { AuthService } from '../lib/authService';
import { SpaceContextService } from '../lib/spaceContext';
import { Space } from '../types/spaces';

interface SidebarProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
  onToggleAIChat?: () => void;
}

export default function Sidebar({ activeSection, onNavigate, onToggleAIChat }: SidebarProps) {
  const [activeMainMenu, setActiveMainMenu] = useState<string | null>('studio');
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const contextService = SpaceContextService.getInstance();
    contextService.initialize();
    
    const unsubscribe = contextService.addSpaceChangeListener((space) => {
      setCurrentSpace(space);
    });

    // Check if user is admin
    const authService = AuthService.getInstance();
    authService.isAdmin().then(setIsAdmin);

    return unsubscribe;
  }, []);

  const handleUnsetSpace = () => {
    const contextService = SpaceContextService.getInstance();
    contextService.setCurrentSpace(null);
  };

  // Main menu items - top section
  const topMenuItems = [
    { icon: Home, label: 'Home', id: 'dashboard' },
    { icon: Store, label: 'Showcase', id: 'showcase' },
    { icon: Briefcase, label: 'Studio', id: 'studio' },
    { icon: Sparkles, label: 'Innovation Hub', id: 'innovation-hub', isSpecial: true },
    { icon: Brain, label: 'Decision Engines', id: 'decision-engines', isSpecial: true },
    { icon: Activity, label: 'Patent Monitoring', id: 'patent-monitoring', isSpecial: true },
    { icon: DollarSign, label: 'Patent Valuation', id: 'patent-valuation', isSpecial: true },
    { icon: Shield, label: 'Competitive Intel', id: 'competitive-intelligence', isSpecial: true },
    { icon: FileText, label: 'Reports', id: 'reports' },
    { icon: Users, label: 'Collab Hub', id: 'network' }
  ];

  // Main menu items - bottom section
  const bottomMenuItems = [
    { icon: Bot, label: 'AI Assistant', id: 'ai-assistant' },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
    { icon: Bell, label: 'Notifications', id: 'notifications' },
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: Settings, label: 'Settings', id: 'settings' },
    { icon: HelpCircle, label: 'Support', id: 'support' },
    ...(isAdmin ? [{ icon: Shield, label: 'CMS Admin', id: 'cms-admin' }] : [])
  ];

  // Secondary menu items for each main menu
  const secondaryMenus = {
    studio: [
      { icon: BookOpen, label: 'Spaces', id: 'projects' },
      { icon: Zap, label: 'AI Agents', id: 'ai-agents' },
      { icon: Wrench, label: 'Tools', id: 'tools' },
      { icon: Search, label: 'Search', id: 'search' },
      { icon: Database, label: 'Datasets', id: 'datasets' },
      { icon: BarChart3, label: 'Dashboard', id: 'dashboards' },
      { icon: FileText, label: 'Reports', id: 'studio-reports' }
    ],
    'innovation-hub': [
      // Revolutionary Innovation Intelligence
      { icon: Dna, label: 'Patent DNA Sequencer', id: 'patent-dna-sequencer', isSpecial: true },
      { icon: Globe, label: 'Innovation Pulse Monitor', id: 'innovation-pulse-monitor', isSpecial: true },
      { icon: Map, label: 'White Space Cartographer', id: 'white-space-cartographer', isSpecial: true },
      { icon: Compass, label: 'Collision Predictor', id: 'invention-collision-predictor', isSpecial: true },
      // Traditional Tools
      { icon: Target, label: 'Opportunity Scanner', id: 'opportunity-gap-scanner' },
      { icon: FileText, label: 'AI Patent Claims', id: 'ai-patent-claims' },
      { icon: Brain, label: 'Prior Art Oracle', id: 'prior-art-oracle' },
      { icon: TrendingUp, label: 'Trajectory Predictor', id: 'trajectory-predictor' },
      { icon: Zap, label: 'AI Claim Generator', id: 'ai-claim-generator' },
      { icon: Search, label: 'Collision Detection', id: 'collision-detection' },
      { icon: Eye, label: '3D Citation Viz', id: 'citation-3d' },
      { icon: Shield, label: 'Blockchain Provenance', id: 'blockchain-provenance' },
      { icon: Key, label: 'AI Configuration', id: 'ai-services-config' }
    ],
    notifications: [
      { icon: Bell, label: 'All Notifications', id: 'all-notifications' },
      { icon: Zap, label: 'Alerts', id: 'alerts' },
      { icon: FileText, label: 'Updates', id: 'updates' },
      { icon: Settings, label: 'Preferences', id: 'notification-preferences' }
    ],
    profile: [
      { icon: Award, label: 'Claimed Work', id: 'claimed-work' },
      { icon: UserCheck, label: 'Inventorship', id: 'inventorship' },
      { icon: UserPlus, label: 'Authorship', id: 'authorship' },
      { icon: User, label: 'Profile Info', id: 'profile-info' }
    ],
    settings: [
      { icon: Settings, label: 'Account Settings', id: 'account-settings' },
      { icon: Bot, label: 'AI Settings', id: 'ai-settings-menu' },
      { icon: Bell, label: 'Notifications', id: 'notification-settings' },
      { icon: Database, label: 'Data & Privacy', id: 'data-privacy' }
    ]
  };

  const handleMainMenuClick = (menuId: string) => {
    if (menuId === 'ai-assistant') {
      onToggleAIChat?.();
      return;
    }
    
    if (menuId === 'showcase' || menuId === 'dashboard' || menuId === 'cms-admin' || menuId === 'innovation-hub' || menuId === 'reports' || menuId === 'decision-engines' || menuId === 'patent-monitoring' || menuId === 'patent-valuation' || menuId === 'competitive-intelligence') {
      setActiveMainMenu(null);
      onNavigate?.(menuId);
      return;
    }

    setActiveMainMenu(menuId);
    
    // Navigate to the first item in the secondary menu if available
    const secondaryItems = secondaryMenus[menuId as keyof typeof secondaryMenus];
    if (secondaryItems && secondaryItems.length > 0) {
      onNavigate?.(secondaryItems[0].id);
    } else {
      onNavigate?.(menuId);
    }
  };


  const handleSecondaryMenuClick = (itemId: string) => {
    onNavigate?.(itemId);
  };

  const MenuItem = ({ icon: Icon, label, isActive, onClick, isSpecial = false }: any) => (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
      } ${isSpecial ? 'border border-blue-200 bg-blue-50 text-blue-700' : ''}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  const SecondaryMenuItem = ({ icon: Icon, label, isActive, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm">{label}</span>
    </div>
  );

  return (
    <div className="flex">
      {/* Main Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
        <div className="p-4 h-full flex flex-col">
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Guest</div>
            <div className="text-xs text-gray-400">Guest Account</div>
          </div>

          {/* Top Menu Items */}
          <div className="space-y-1">
            {topMenuItems.map(item => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeMainMenu === item.id || (item.id === 'showcase' && activeSection === 'showcase') || (item.id === 'dashboard' && activeSection === 'dashboard') || (item.id === 'cms-admin' && activeSection === 'cms-admin')}
                isSpecial={item.isSpecial}
                onClick={() => handleMainMenuClick(item.id)}
              />
            ))}
          </div>

          {/* Spacer to push bottom items down */}
          <div className="flex-1" />

          {/* Bottom Menu Items */}
          <div className="space-y-1">
            {bottomMenuItems.map(item => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeMainMenu === item.id || (item.id === 'showcase' && activeSection === 'showcase') || (item.id === 'dashboard' && activeSection === 'dashboard') || (item.id === 'cms-admin' && activeSection === 'cms-admin')}
                isSpecial={false}
                onClick={() => handleMainMenuClick(item.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      {activeMainMenu && secondaryMenus[activeMainMenu as keyof typeof secondaryMenus] && (
        <div className="w-56 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-4">
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {[...topMenuItems, ...bottomMenuItems].find((item: any) => item.id === activeMainMenu)?.label}
              </div>
              
              {/* Current Space Display for Studio */}
              {activeMainMenu === 'studio' && currentSpace && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: currentSpace.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {currentSpace.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Current Space
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => onNavigate?.('projects')}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded"
                        title="View Space Details"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={handleUnsetSpace}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Unset Current Space"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* No Space Selected for Studio */}
              {activeMainMenu === 'studio' && !currentSpace && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-xs text-yellow-800 mb-1">No space selected</div>
                  <button
                    onClick={() => onNavigate?.('projects')}
                    className="text-xs text-yellow-700 hover:text-yellow-900 underline"
                  >
                    Select a space to get started
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              {secondaryMenus[activeMainMenu as keyof typeof secondaryMenus]?.map((item: any) => (
                <SecondaryMenuItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeSection === item.id}
                  onClick={() => handleSecondaryMenuClick(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}