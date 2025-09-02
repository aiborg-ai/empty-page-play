import React, { ReactNode } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigation } from '../providers/NavigationProvider';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallback 
}) => {
  const { user, loading } = useAuth();
  const { navigate } = useNavigation();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">You need {requiredRole} access to view this content.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};