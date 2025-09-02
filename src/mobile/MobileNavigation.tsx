/**
 * Mobile Navigation Component
 * Responsive navigation with hamburger menu, touch gestures, and mobile optimizations
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Search, Home, Briefcase, BarChart3, Users, 
  MessageSquare, Settings, Bot, Wrench, Database, FileText,
  ChevronRight, ChevronDown, Smartphone
} from 'lucide-react';
import { InstantUser } from '../lib/instantAuth';
import PWAStatusIndicator from '../pwa/PWAStatusIndicator';

interface MobileNavigationProps {
  activeSection: string;
  onNavigate: (section: string, category?: string) => void;
  user: InstantUser | null;
  onToggleAIChat?: () => void;
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category?: string;
  children?: NavigationItem[];
  requiresAuth?: boolean;
  badge?: string | number;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'showcase',
    label: 'Home',
    icon: Home,
  },
  {
    id: 'search',
    label: 'Patent Search',
    icon: Search,
    requiresAuth: true,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: Briefcase,
    requiresAuth: true,
  },
  {
    id: 'dashboards',
    label: 'Studio',
    icon: BarChart3,
    requiresAuth: true,
    children: [
      { id: 'dashboards', label: 'Dashboards', icon: BarChart3 },
      { id: 'ai-agents', label: 'AI Agents', icon: Bot },
      { id: 'tools', label: 'Tools', icon: Wrench },
      { id: 'datasets', label: 'Datasets', icon: Database },
      { id: 'reports', label: 'Reports', icon: FileText },
    ]
  },
  {
    id: 'network',
    label: 'Network',
    icon: Users,
    requiresAuth: true,
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    requiresAuth: true,
    badge: 3,
  },
];

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onNavigate,
  user,
  onToggleAIChat,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance to trigger gesture
  const minSwipeDistance = 50;

  useEffect(() => {
    // Handle click outside to close menu
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Handle escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Touch gesture handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    // Only handle horizontal swipes
    if (!isVerticalSwipe) {
      if (isLeftSwipe && isOpen) {
        setIsOpen(false);
      } else if (isRightSwipe && !isOpen) {
        setIsOpen(true);
      }
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (item: NavigationItem) => {
    if (item.requiresAuth && !user) {
      onNavigate('login');
    } else {
      onNavigate(item.id, item.category);
    }
    setIsOpen(false);
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderNavigationItem = (item: NavigationItem, depth: number = 0) => {
    const isActive = activeSection === item.id;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isDisabled = item.requiresAuth && !user;
    
    const IconComponent = item.icon;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              handleNavigation(item);
            }
          }}
          disabled={isDisabled}
          className={`
            w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200
            ${depth > 0 ? 'ml-4 pl-8' : ''}
            ${isActive && !hasChildren ? 'bg-blue-50 text-blue-600 font-medium' : ''}
            ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}
            ${!isDisabled && !isActive ? 'hover:text-gray-900' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <IconComponent className={`w-5 h-5 ${isActive && !hasChildren ? 'text-blue-600' : ''}`} />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                {item.badge}
              </span>
            )}
          </div>
          
          {hasChildren && (
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )}
        </button>

        {/* Child items */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavigationItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Navigation Trigger */}
      <div className={`lg:hidden ${className}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* PWA Status in Header */}
          <PWAStatusIndicator showDetails={false} />
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`
          fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">InnoSpot</h2>
              {user && (
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PWA Status */}
        <div className="p-4 border-b border-gray-200">
          <PWAStatusIndicator />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {navigationItems.map(item => renderNavigationItem(item))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {/* AI Chat Button */}
          {onToggleAIChat && user && (
            <button
              onClick={() => {
                onToggleAIChat();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Bot className="w-5 h-5" />
              <span className="font-medium">AI Assistant</span>
            </button>
          )}

          {/* Settings */}
          <button
            onClick={() => handleNavigation({ id: 'account-settings', label: 'Settings', icon: Settings, requiresAuth: true })}
            className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>

          {/* Login/Logout */}
          {user ? (
            <button
              onClick={() => {
                // Handle logout - this should be passed as a prop
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-xs">⎋</span>
              </div>
              <span className="font-medium">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavigation({ id: 'login', label: 'Sign In', icon: () => null })}
              className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-xs">→</span>
              </div>
              <span className="font-medium">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;