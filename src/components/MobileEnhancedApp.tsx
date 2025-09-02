/**
 * Mobile Enhanced App Component
 * Example integration of mobile and PWA features with the existing app
 */

import React, { useState, useEffect } from 'react';
import { InstantAuthService, InstantUser } from '../lib/instantAuth';

// Import mobile components
import { 
  MobileNavigation, 
  BottomNavigation, 
  TouchGestureHandler,
  PullToRefresh,
  AdaptiveLoader,
  MobileCard,
  WebShareAPI
} from '../mobile';

// Import PWA components
import { PWAInstallPrompt, PWAStatusIndicator, NotificationManager } from '../pwa';
// import PWAService from '../pwa/pwaService';
import NotificationService from '../pwa/notificationService';

// Import existing components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MobileEnhancedAppProps {
  children: React.ReactNode;
  activeSection: string;
  onNavigate: (section: string, category?: string) => void;
  onToggleAIChat?: () => void;
}

const MobileEnhancedApp: React.FC<MobileEnhancedAppProps> = ({
  children,
  activeSection,
  onNavigate,
  onToggleAIChat,
}) => {
  const [currentUser, setCurrentUser] = useState<InstantUser | null>(null);
  const [showPWAInstall, setShowPWAInstall] = useState(false);
  const [showNotificationManager, setShowNotificationManager] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [_refreshing, _setRefreshing] = useState(false);

  // Initialize services
  useEffect(() => {
    // Initialize PWA service
    /* const _pwaService = PWAService.getInstance();
    const _notificationService = NotificationService.getInstance(); */

    // Check for current user
    const user = InstantAuthService.getCurrentUser();
    setCurrentUser(user);

    // Listen for PWA install events
    const handleInstallAvailable = () => setShowPWAInstall(true);
    const handleAppInstalled = () => setShowPWAInstall(false);

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-app-installed', handleAppInstalled);

    // Handle window resize
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-app-installed', handleAppInstalled);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle pull to refresh
  const handleRefresh = async () => {
    _setRefreshing(true);
    
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show notification about refresh
      const notificationService = NotificationService.getInstance();
      await notificationService.showNotification({
        title: 'Content Updated',
        body: 'Your data has been refreshed with the latest information.',
        tag: 'refresh-complete',
      });
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      _setRefreshing(false);
    }
  };

  // Handle swipe gestures
  const handleSwipeLeft = () => {
    // Navigate to next section or open sidebar
    console.log('Swiped left - could open sidebar or navigate');
  };

  const handleSwipeRight = () => {
    // Navigate to previous section or close sidebar
    console.log('Swiped right - could close sidebar or navigate');
  };

  // Handle sign out
  const handleSignOut = () => {
    InstantAuthService.logout();
    setCurrentUser(null);
    onNavigate('register');
  };

  // Share current page
  const shareData = {
    title: 'InnoSpot - Innovation Intelligence Platform',
    text: 'Check out this amazing patent intelligence platform!',
    url: window.location.href,
  };

  // Mobile layout
  if (isMobileView) {
    return (
      <AdaptiveLoader className="min-h-screen bg-gray-50">
        <TouchGestureHandler
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          className="min-h-screen flex flex-col"
        >
          {/* Mobile Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <MobileNavigation
                activeSection={activeSection}
                onNavigate={onNavigate}
                user={currentUser}
                onToggleAIChat={onToggleAIChat}
              />
              
              <div className="flex items-center gap-2">
                <PWAStatusIndicator showDetails={false} />
                
                <WebShareAPI data={shareData}>
                  Share
                </WebShareAPI>
                
                {currentUser && (
                  <button
                    onClick={() => setShowNotificationManager(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    🔔
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content with Pull to Refresh */}
          <PullToRefresh
            onRefresh={handleRefresh}
            className="flex-1 overflow-hidden"
          >
            <main className="flex-1 p-4">
              {children}
            </main>
          </PullToRefresh>

          {/* Bottom Navigation */}
          <BottomNavigation
            activeSection={activeSection}
            onNavigate={onNavigate}
            user={currentUser}
            onToggleAIChat={onToggleAIChat}
          />
        </TouchGestureHandler>

        {/* PWA Install Prompt */}
        {showPWAInstall && (
          <PWAInstallPrompt onClose={() => setShowPWAInstall(false)} />
        )}

        {/* Notification Manager */}
        {showNotificationManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <NotificationManager
                onClose={() => setShowNotificationManager(false)}
              />
            </div>
          </div>
        )}
      </AdaptiveLoader>
    );
  }

  // Desktop layout (existing)
  return (
    <AdaptiveLoader className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        user={currentUser} 
        onSignOut={handleSignOut}
        onNavigate={onNavigate}
      />
      
      <div className="flex flex-1">
        <Sidebar 
          activeSection={activeSection} 
          onNavigate={onNavigate}
          onToggleAIChat={onToggleAIChat}
        />
        
        <main className="flex-1 p-6 flex flex-col">
          {children}
        </main>
      </div>
      
      <Footer />

      {/* Desktop PWA Features */}
      <div className="fixed top-4 right-4 z-40">
        <PWAStatusIndicator />
      </div>

      {showPWAInstall && (
        <PWAInstallPrompt onClose={() => setShowPWAInstall(false)} />
      )}
    </AdaptiveLoader>
  );
};

// Example usage component showing mobile-optimized cards
export const MobilePatentList: React.FC<{
  patents: any[];
  onPatentClick: (patent: any) => void;
}> = ({ patents, onPatentClick }) => {
  return (
    <div className="space-y-3">
      {patents.map((patent, index) => (
        <MobileCard
          key={patent.id || index}
          title={patent.title}
          description={`${patent.assignee} • Filed ${patent.filingDate}`}
          badge={patent.publicationNumber}
          tags={patent.inventors?.slice(0, 2) || []}
          stats={[
            { label: 'Claims', value: patent.claimsCount || 0 },
            { label: 'Citations', value: patent.citationsCount || 0 },
          ]}
          onTap={() => onPatentClick(patent)}
          actions={[
            { 
              label: 'Share', 
              onClick: () => console.log('Share patent:', patent.id) 
            },
            { 
              label: 'Save', 
              onClick: () => console.log('Save patent:', patent.id) 
            },
            { 
              label: 'Analyze', 
              onClick: () => console.log('Analyze patent:', patent.id) 
            },
          ]}
        />
      ))}
    </div>
  );
};

export default MobileEnhancedApp;