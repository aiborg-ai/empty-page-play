import React, { lazy, Suspense } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigation } from '../providers/NavigationProvider';
import { LoadingScreen } from '../components/LoadingScreen';
import { ProtectedRoute } from './ProtectedRoute';

const Home = lazy(() => import('@/components/Home'));
const PatentSearch = lazy(() => import('@/components/PatentSearch'));
const Dashboard = lazy(() => import('@/components/Dashboard'));
const Network = lazy(() => import('@/components/Network'));
const Projects = lazy(() => import('@/components/Projects'));
const Collections = lazy(() => import('@/components/Collections'));
const Reports = lazy(() => import('@/components/Reports'));
const Messages = lazy(() => import('@/components/Messages'));
const Notifications = lazy(() => import('@/components/Notifications'));
const AIChat = lazy(() => import('@/components/AIChat'));
const Showcase = lazy(() => import('@/components/Showcase'));
const CMSStudio = lazy(() => import('@/components/CMSStudio'));
const Spaces = lazy(() => import('@/components/Spaces'));
const WorkArea = lazy(() => import('@/components/WorkArea'));
const Assets = lazy(() => import('@/components/Assets'));
const Checkout = lazy(() => import('@/components/Checkout'));
const PaymentSuccess = lazy(() => import('@/components/PaymentSuccess'));
const AccountSettings = lazy(() => import('@/components/AccountSettings'));
const LoginForm = lazy(() => import('@/components/LoginForm'));
const RegisterForm = lazy(() => import('@/components/RegisterForm'));

const VisualPatentExplorer = lazy(() => import('@/components/VisualPatentExplorer'));
const PatentAnalyticsDashboard = lazy(() => import('@/components/PatentAnalyticsDashboard'));
const InnovationHub = lazy(() => import('@/components/InnovationHub'));
const CollaborationHub = lazy(() => import('@/components/CollaborationHub'));
const MarketplaceHub = lazy(() => import('@/components/MarketplaceHub'));
const EnterpriseHub = lazy(() => import('@/components/EnterpriseHub'));
const AdvancedAnalyticsHub = lazy(() => import('@/components/AdvancedAnalyticsHub'));

interface RouteConfig {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  requiresAuth: boolean;
  allowedRoles?: string[];
}

const routes: Record<string, RouteConfig> = {
  home: { component: Home, requiresAuth: false },
  'patent-search': { component: PatentSearch, requiresAuth: false },
  dashboard: { component: Dashboard, requiresAuth: true },
  network: { component: Network, requiresAuth: true },
  projects: { component: Projects, requiresAuth: true },
  collections: { component: Collections, requiresAuth: true },
  reports: { component: Reports, requiresAuth: true },
  messages: { component: Messages, requiresAuth: true },
  notifications: { component: Notifications, requiresAuth: true },
  'ai-chat': { component: AIChat, requiresAuth: true },
  showcase: { component: Showcase, requiresAuth: true },
  'cms-studio': { component: CMSStudio, requiresAuth: true },
  spaces: { component: Spaces, requiresAuth: true },
  'work-area': { component: WorkArea, requiresAuth: true },
  assets: { component: Assets, requiresAuth: true },
  checkout: { component: Checkout, requiresAuth: true },
  'payment-success': { component: PaymentSuccess, requiresAuth: true },
  account: { component: AccountSettings, requiresAuth: true },
  login: { component: LoginForm, requiresAuth: false },
  register: { component: RegisterForm, requiresAuth: false },
  'visual-explorer': { component: VisualPatentExplorer, requiresAuth: true },
  'patent-analytics': { component: PatentAnalyticsDashboard, requiresAuth: true },
  'innovation-hub': { component: InnovationHub, requiresAuth: true },
  'collaboration-hub': { component: CollaborationHub, requiresAuth: true },
  'marketplace-hub': { component: MarketplaceHub, requiresAuth: true },
  'enterprise-hub': { component: EnterpriseHub, requiresAuth: true, allowedRoles: ['enterprise', 'admin'] },
  'analytics-hub': { component: AdvancedAnalyticsHub, requiresAuth: true }
};

export const AppRouter: React.FC = () => {
  const { user } = useAuth();
  const { activeSection } = useNavigation();
  
  const route = routes[activeSection];
  
  if (!route) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  const Component = route.component;
  
  if (route.requiresAuth && !user) {
    const LoginComponent = routes.login.component;
    return (
      <Suspense fallback={<LoadingScreen />}>
        <LoginComponent />
      </Suspense>
    );
  }
  
  if (route.allowedRoles && user && !route.allowedRoles.includes(user.role || 'standard')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      {route.requiresAuth ? (
        <ProtectedRoute>
          <Component />
        </ProtectedRoute>
      ) : (
        <Component />
      )}
    </Suspense>
  );
};