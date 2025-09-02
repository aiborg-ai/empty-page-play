/**
 * Refactored App Component
 * Clean architecture with separated concerns
 */

import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Auth
import { InstantAuthService, InstantUser } from '@/lib/instantAuth';

// Layout Components
import AppLayout from '@/layouts/AppLayout';
import AppRouter from '@/components/AppRouter';

// Lazy load non-critical components
const PlatformTour = lazy(() => import('@/components/PlatformTour'));
const AIChat = lazy(() => import('@/components/AIChat'));
const LoginForm = lazy(() => import('@/components/LoginForm'));
const RegisterForm = lazy(() => import('@/components/RegisterForm'));

/**
 * Loading screen component
 */
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900">Loading InnoSpot...</h2>
    </div>
  </div>
);

/**
 * Main App Component - Refactored for better performance and maintainability
 */
function AppRefactored() {
  // Core state
  const [currentUser, setCurrentUser] = useState<InstantUser | null>(null);
  const [activeRoute, setActiveRoute] = useState<string>('home');
  const [isLoading, setIsLoading] = useState(true);

  // Feature toggles
  const [showTour, setShowTour] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  // Workspace state
  const [currentSpace] = useState<any>(null); // TODO: Implement space selection

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for stored session
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
        
        // Restore last route
        const lastRoute = localStorage.getItem('lastRoute');
        if (lastRoute) {
          setActiveRoute(lastRoute);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Save route changes
  useEffect(() => {
    if (activeRoute) {
      localStorage.setItem('lastRoute', activeRoute);
    }
  }, [activeRoute]);

  // Authentication handlers
  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      const result = await InstantAuthService.login(email, password);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        setActiveRoute('dashboard');
        return { success: true };
      }
      return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }, []);


  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setActiveRoute('home');
    setShowAIChat(false);
  }, []);

  // Navigation handler
  const handleRouteChange = useCallback((routeId: string) => {
    setActiveRoute(routeId);
  }, []);

  // Feature toggles
  const handleToggleAIChat = useCallback(() => {
    setShowAIChat(prev => !prev);
  }, []);

  const handleStartTour = useCallback(() => {
    setShowTour(true);
  }, []);

  // Show loading screen during initialization
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Handle authentication pages
  if (activeRoute === 'login' && !currentUser) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <LoginForm 
          onSuccess={() => {
            handleLogin('', ''); // Login already handled internally
            setActiveRoute('dashboard');
          }}
        />
      </Suspense>
    );
  }

  if (activeRoute === 'register' && !currentUser) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <RegisterForm
          onSuccess={() => {
            setActiveRoute('login');
          }}
        />
      </Suspense>
    );
  }

  return (
    <>
      <AppLayout
        currentUser={currentUser}
        activeRoute={activeRoute}
        onRouteChange={handleRouteChange}
        onLogout={handleLogout}
        showAIChat={showAIChat}
        onToggleAIChat={handleToggleAIChat}
        currentSpace={currentSpace}
        noPadding={['visual-explorer', 'citation-3d', 'patent-analytics'].includes(activeRoute)}
      >
        <AppRouter 
          activeRoute={activeRoute}
          currentUser={currentUser}
          onStartTour={handleStartTour}
        />
      </AppLayout>

      {/* AI Chat Panel */}
      {showAIChat && currentUser && (
        <Suspense fallback={null}>
          <div className="fixed left-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300">
            <AIChat 
              isOpen={showAIChat}
              onClose={handleToggleAIChat}
              onNavigate={handleRouteChange}
            />
          </div>
        </Suspense>
      )}

      {/* Platform Tour */}
      {showTour && (
        <Suspense fallback={null}>
          <PlatformTour 
            isOpen={showTour}
            onClose={() => setShowTour(false)}
            onComplete={() => setShowTour(false)}
          />
        </Suspense>
      )}
    </>
  );
}

export default AppRefactored;