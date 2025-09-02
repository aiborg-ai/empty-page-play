/**
 * Application header component
 * Displays user info, notifications, and global actions
 */

import React, { memo } from 'react';
import { Bell, LogOut, Menu, Search, Settings } from 'lucide-react';
import { InstantUser } from '@/lib/instantAuth';

interface AppHeaderProps {
  currentUser: InstantUser;
  currentSpace?: any;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  currentUser,
  currentSpace,
  onLogout,
  onToggleMobileMenu
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Current Space/Project Info */}
          {currentSpace && (
            <div className="hidden sm:block">
              <div className="text-sm text-gray-500">Current Space</div>
              <div className="font-medium text-gray-900">{currentSpace.name}</div>
            </div>
          )}
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Settings */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">
                {currentUser.displayName}
              </div>
              <div className="text-xs text-gray-500">{currentUser.email}</div>
            </div>
            
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {currentUser.displayName?.charAt(0) || 'U'}
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(AppHeader);