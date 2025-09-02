/**
 * Bottom Navigation Component
 * Mobile-friendly bottom navigation bar for quick access to main sections
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, Search, Briefcase, BarChart3, Users, Bot, 
  MessageSquare, Settings, Plus, Bell
} from 'lucide-react';
import { InstantUser } from '../lib/instantAuth';

interface BottomNavigationProps {
  activeSection: string;
  onNavigate: (section: string, category?: string) => void;
  user: InstantUser | null;
  onToggleAIChat?: () => void;
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category?: string;
  requiresAuth?: boolean;
  badge?: string | number;
  shortcut?: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeSection,
  onNavigate,
  user,
  onToggleAIChat,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Primary navigation items (always visible)
  const primaryItems: NavItem[] = [
    {
      id: 'showcase',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'search',
      label: 'Search',
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
    },
  ];

  // Secondary items (in more menu)
  const secondaryItems: NavItem[] = [
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
    {
      id: 'all-notifications',
      label: 'Notifications',
      icon: Bell,
      requiresAuth: true,
      badge: 5,
    },
    {
      id: 'account-settings',
      label: 'Settings',
      icon: Settings,
      requiresAuth: true,
    },
  ];

  // Handle scroll to show/hide bottom nav
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      // Only hide/show if scroll difference is significant
      if (scrollDifference > 5) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    // Throttle scroll events
    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMoreMenu(false);
    };

    if (showMoreMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMoreMenu]);

  const handleNavigation = (item: NavItem) => {
    if (item.requiresAuth && !user) {
      onNavigate('login');
    } else {
      onNavigate(item.id, item.category);
    }
    setShowMoreMenu(false);
  };

  const renderNavItem = (item: NavItem, isPrimary: boolean = true) => {
    const isActive = activeSection === item.id;
    const isDisabled = item.requiresAuth && !user;
    const IconComponent = item.icon;

    return (
      <button
        key={item.id}
        onClick={() => handleNavigation(item)}
        disabled={isDisabled}
        className={`
          relative flex flex-col items-center justify-center p-2 min-h-[60px] transition-all duration-200
          ${isPrimary ? 'flex-1' : 'w-full'}
          ${isActive && !isDisabled ? 'text-blue-600' : ''}
          ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'}
          ${!isPrimary ? 'hover:bg-gray-50 rounded-lg mx-1' : ''}
        `}
      >
        <div className="relative">
          <IconComponent className={`w-6 h-6 ${isActive && !isDisabled ? 'text-blue-600' : ''}`} />
          
          {/* Badge */}
          {item.badge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.125rem] text-center leading-none">
              {item.badge}
            </span>
          )}

          {/* Active indicator */}
          {isActive && !isDisabled && isPrimary && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
          )}
        </div>
        
        <span className={`text-xs font-medium mt-1 truncate max-w-[60px] ${
          isActive && !isDisabled ? 'text-blue-600' : ''
        }`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div 
        className={`
          fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 transition-transform duration-300 z-30 lg:hidden
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
          ${className}
        `}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between px-1">
          {/* Primary Navigation Items */}
          {primaryItems.map(item => renderNavItem(item, true))}

          {/* AI Chat Button */}
          {onToggleAIChat && user && (
            <button
              onClick={onToggleAIChat}
              className="flex flex-col items-center justify-center p-2 min-h-[60px] flex-1 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <Bot className="w-6 h-6" />
              <span className="text-xs font-medium mt-1">AI</span>
            </button>
          )}

          {/* More Menu */}
          <div className="relative flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreMenu(!showMoreMenu);
              }}
              className="flex flex-col items-center justify-center p-2 min-h-[60px] w-full text-gray-600 hover:text-gray-900 transition-colors"
            >
              <div className="relative">
                <Plus className={`w-6 h-6 transition-transform duration-200 ${showMoreMenu ? 'rotate-45' : ''}`} />
                
                {/* Badge for more items */}
                {secondaryItems.some(item => item.badge) && (
                  <div className="absolute -top-2 -right-2 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="text-xs font-medium mt-1">More</span>
            </button>

            {/* More Menu Dropdown */}
            {showMoreMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Quick Actions</p>
                </div>
                
                <div className="py-1">
                  {secondaryItems.map(item => (
                    <div key={item.id} className="px-1">
                      {renderNavItem(item, false)}
                    </div>
                  ))}
                </div>

                {/* User Section */}
                {user ? (
                  <div className="border-t border-gray-100 pt-2 mt-1">
                    <div className="px-3 py-2">
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <button
                        onClick={() => {
                          // Handle logout
                          setShowMoreMenu(false);
                        }}
                        className="text-sm text-red-600 hover:text-red-700 mt-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-gray-100 pt-2 mt-1">
                    <button
                      onClick={() => {
                        onNavigate('login');
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg mx-1"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:hidden" />
    </>
  );
};

export default BottomNavigation;