import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { InstantUser } from '@/lib/instantAuth';

interface AppLayoutProps {
  children: ReactNode;
  currentUser: InstantUser | null;
  activeRoute: string;
  onRouteChange: (routeId: string) => void;
  onLogout: () => void;
  showAIChat: boolean;
  onToggleAIChat: () => void;
  currentSpace: any;
  noPadding?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  currentUser,
  activeRoute,
  onRouteChange,
  onLogout,
  showAIChat,
  onToggleAIChat,
  currentSpace,
  noPadding = false
}) => {
  const user = currentUser;
  const activeSection = activeRoute;
  
  const isAuthPage = ['login', 'register'].includes(activeSection);
  const isFullScreenPage = ['visual-explorer', 'patent-analytics', 'innovation-hub'].includes(activeSection);
  
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </div>
    );
  }
  
  if (isFullScreenPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          user={currentUser}
          onSignOut={onLogout}
          onNavigate={onRouteChange}
        />
        <main className="w-full">{children}</main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={currentUser}
        onSignOut={onLogout}
        onNavigate={onRouteChange}
      />
      <div className="flex">
        {user && (
          <Sidebar 
            activeSection={activeSection}
            onNavigate={onRouteChange}
            onToggleAIChat={onToggleAIChat}
          />
        )}
        <main className={`flex-1 transition-all duration-300 ${user ? 'ml-64' : 'ml-0'}`}>
          <div className={noPadding ? '' : 'p-6'}>
            {children}
          </div>
          {/* Show current space if available */}
          {currentSpace && (
            <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 text-sm">
              Working in: {currentSpace.name}
            </div>
          )}
          {/* AI Chat indicator */}
          {showAIChat && (
            <div className="fixed bottom-4 left-4 bg-blue-500 text-white rounded-full p-2 text-xs">
              AI Chat Active
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;