/**
 * Application router component
 * Handles route rendering and lazy loading with Suspense boundaries
 */

import React, { Suspense, memo } from 'react';
import { Loader2 } from 'lucide-react';
import { getRouteById } from '@/config/routes';
import { InstantUser } from '@/lib/instantAuth';

interface AppRouterProps {
  activeRoute: string;
  currentUser: InstantUser | null;
  onStartTour?: () => void;
}

/**
 * Loading fallback component
 */
const RouteLoadingFallback = memo(() => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
));

RouteLoadingFallback.displayName = 'RouteLoadingFallback';

/**
 * Error boundary fallback component
 */
const RouteErrorFallback = memo(({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center max-w-md">
      <div className="text-red-600 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message || 'An unexpected error occurred'}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Reload Page
      </button>
    </div>
  </div>
));

RouteErrorFallback.displayName = 'RouteErrorFallback';

/**
 * Error boundary for route components
 */
class RouteErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Route error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <RouteErrorFallback error={this.state.error!} />;
    }

    return this.props.children;
  }
}

/**
 * Main router component
 */
const AppRouter: React.FC<AppRouterProps> = ({ 
  activeRoute, 
  currentUser,
  onStartTour 
}) => {
  // Get the current route configuration
  const currentRoute = getRouteById(activeRoute);

  // Handle authentication check
  if (currentRoute?.requiresAuth && !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  // Handle route not found
  if (!currentRoute) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600">The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  // Render the route component
  const RouteComponent = currentRoute.component;

  return (
    <RouteErrorBoundary>
      <Suspense fallback={<RouteLoadingFallback />}>
        <RouteComponent 
          currentUser={currentUser}
          onStartTour={onStartTour}
        />
      </Suspense>
    </RouteErrorBoundary>
  );
};

export default memo(AppRouter);