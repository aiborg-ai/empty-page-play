/**
 * Application sidebar navigation component
 * Provides main navigation and quick access to features
 */

import React, { memo, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { InstantUser } from '@/lib/instantAuth';
import { getRoutesByCategory, RouteConfig } from '@/config/routes';

interface AppSidebarProps {
  currentUser: InstantUser;
  activeRoute: string;
  onRouteChange: (routeId: string) => void;
  collapsed: boolean;
  onToggleSidebar: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  showAIChat: boolean;
  onToggleAIChat: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  currentUser,
  activeRoute,
  onRouteChange,
  collapsed,
  onToggleSidebar,
  mobileMenuOpen,
  onCloseMobileMenu,
  showAIChat,
  onToggleAIChat
}) => {
  const categories = useMemo(() => [
    { id: 'main', label: 'Main', routes: getRoutesByCategory('main') },
    { id: 'workspace', label: 'Workspace', routes: getRoutesByCategory('workspace') },
    { id: 'ai', label: 'AI Tools', routes: getRoutesByCategory('ai') },
    { id: 'analytics', label: 'Analytics', routes: getRoutesByCategory('analytics') },
    { id: 'admin', label: 'Admin', routes: getRoutesByCategory('admin') },
    { id: 'integration', label: 'Integrations', routes: getRoutesByCategory('integration') }
  ], []);

  const renderNavItem = (route: RouteConfig) => {
    const Icon = route.icon;
    const isActive = activeRoute === route.id;

    return (
      <button
        key={route.id}
        onClick={() => onRouteChange(route.id)}
        className={`
          w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
          ${isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-700 hover:bg-gray-100'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
        title={collapsed ? route.label : undefined}
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        {!collapsed && (
          <span className="text-sm font-medium truncate">{route.label}</span>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo / Brand */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                I
              </div>
              <span className="font-bold text-xl">InnoSpot</span>
            </div>
          )}
          
          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:block p-1 rounded hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobileMenu}
            className="lg:hidden p-1 rounded hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {categories.map(category => {
          const categoryRoutes = category.routes.filter(
            (route: RouteConfig) => !route.requiresAuth || currentUser
          );

          if (categoryRoutes.length === 0) return null;

          return (
            <div key={category.id} className="mb-6">
              {!collapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                  {category.label}
                </h3>
              )}
              <div className="space-y-1">
                {categoryRoutes.map(renderNavItem)}
              </div>
            </div>
          );
        })}
      </nav>

      {/* AI Chat Toggle */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={onToggleAIChat}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
            ${showAIChat 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
            }
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'AI Assistant' : undefined}
        >
          <MessageSquare className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium">AI Assistant</span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`
          hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside 
        className={`
          lg:hidden fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 w-64
          transform transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default memo(AppSidebar);