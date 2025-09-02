/**
 * Centralized route configuration for the application
 * Supports lazy loading and role-based access control
 */

import { lazy, LazyExoticComponent, ComponentType } from 'react';
import { 
  Home, 
  Search, 
  LayoutGrid, 
  FileText, 
  Users, 
  Settings,
  Shield,
  Briefcase,
  Globe,
  Brain,
  Package,
  BarChart3,
  Database,
  Sparkles,
  Boxes,
  Building2,
  Webhook
} from 'lucide-react';

export interface RouteConfig {
  id: string;
  path: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
  requiresAuth: boolean;
  category?: 'main' | 'workspace' | 'ai' | 'analytics' | 'admin' | 'integration';
  description?: string;
  children?: RouteConfig[];
}

// Lazy load all route components for better performance
const routes: RouteConfig[] = [
  // Main Navigation
  {
    id: 'home',
    path: '/',
    label: 'Home',
    icon: Home,
    component: lazy(() => import('@/components/Home')),
    requiresAuth: false,
    category: 'main'
  },
  {
    id: 'search',
    path: '/search',
    label: 'Patent Search',
    icon: Search,
    component: lazy(() => import('@/components/PatentSearch')),
    requiresAuth: false,
    category: 'main'
  },
  {
    id: 'showcase',
    path: '/showcase',
    label: 'Showcase',
    icon: Sparkles,
    component: lazy(() => import('@/components/ShowcaseModern')),
    requiresAuth: true,
    category: 'main'
  },

  // Workspace
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
    component: lazy(() => import('@/components/Dashboard')),
    requiresAuth: true,
    category: 'workspace'
  },
  {
    id: 'projects',
    path: '/projects',
    label: 'Projects',
    icon: Briefcase,
    component: lazy(() => import('@/components/Projects')),
    requiresAuth: true,
    category: 'workspace'
  },
  {
    id: 'spaces',
    path: '/spaces',
    label: 'Spaces',
    icon: Boxes,
    component: lazy(() => import('@/components/Spaces')),
    requiresAuth: true,
    category: 'workspace'
  },
  {
    id: 'collections',
    path: '/collections',
    label: 'Collections',
    icon: Database,
    component: lazy(() => import('@/components/Collections')),
    requiresAuth: true,
    category: 'workspace'
  },
  {
    id: 'reports',
    path: '/reports',
    label: 'Reports',
    icon: FileText,
    component: lazy(() => import('@/components/ReportsModern')),
    requiresAuth: true,
    category: 'workspace'
  },
  {
    id: 'cms-studio',
    path: '/studio',
    label: 'CMS Studio',
    icon: Building2,
    component: lazy(() => import('@/components/CMSStudioModern')),
    requiresAuth: true,
    category: 'workspace'
  },

  // AI Tools
  {
    id: 'ai-chat',
    path: '/ai/chat',
    label: 'AI Assistant',
    icon: Brain,
    component: lazy(() => import('@/components/AIChat')),
    requiresAuth: true,
    category: 'ai'
  },
  {
    id: 'ai-claim-generator',
    path: '/ai/claim-generator',
    label: 'Claim Generator',
    icon: FileText,
    component: lazy(() => import('@/components/AIClaimGenerator')),
    requiresAuth: true,
    category: 'ai'
  },
  {
    id: 'collision-detection',
    path: '/ai/collision-detection',
    label: 'Collision Detection',
    icon: Shield,
    component: lazy(() => import('@/components/CollisionDetection')),
    requiresAuth: true,
    category: 'ai'
  },
  {
    id: 'innovation-hub',
    path: '/ai/innovation',
    label: 'Innovation Hub',
    icon: Sparkles,
    component: lazy(() => import('@/components/InnovationHub')),
    requiresAuth: true,
    category: 'ai'
  },

  // Analytics
  {
    id: 'citation-3d',
    path: '/analytics/citations',
    label: '3D Citations',
    icon: Globe,
    component: lazy(() => import('@/components/Citation3DVisualization')),
    requiresAuth: true,
    category: 'analytics'
  },
  {
    id: 'competitive-intelligence',
    path: '/analytics/competitive',
    label: 'Competitive Intelligence',
    icon: BarChart3,
    component: lazy(() => import('@/components/CompetitiveIntelligence')),
    requiresAuth: true,
    category: 'analytics'
  },
  {
    id: 'patent-monitoring',
    path: '/analytics/monitoring',
    label: 'Patent Monitoring',
    icon: Shield,
    component: lazy(() => import('@/components/PatentMonitoring')),
    requiresAuth: true,
    category: 'analytics'
  },
  {
    id: 'patent-valuation',
    path: '/analytics/valuation',
    label: 'Patent Valuation',
    icon: BarChart3,
    component: lazy(() => import('@/components/PatentValuation')),
    requiresAuth: true,
    category: 'analytics'
  },

  // Admin
  {
    id: 'network',
    path: '/admin/network',
    label: 'Network',
    icon: Users,
    component: lazy(() => import('@/components/NetworkPage')),
    requiresAuth: true,
    category: 'admin'
  },
  {
    id: 'settings',
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    component: lazy(() => import('@/components/AccountSettings')),
    requiresAuth: true,
    category: 'admin'
  },

  // Integrations
  {
    id: 'third-party',
    path: '/integrations/third-party',
    label: 'Third Party',
    icon: Package,
    component: lazy(() => import('@/integrations/ThirdPartyIntegrations')),
    requiresAuth: true,
    category: 'integration'
  },
  {
    id: 'webhooks',
    path: '/integrations/webhooks',
    label: 'Webhooks',
    icon: Webhook,
    component: lazy(() => import('@/integrations/WebhookManager')),
    requiresAuth: true,
    category: 'integration'
  }
];

// Helper functions
export const getRouteById = (id: string): RouteConfig | undefined => {
  return routes.find(route => route.id === id);
};

export const getRoutesByCategory = (category: string): RouteConfig[] => {
  return routes.filter(route => route.category === category);
};

export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return routes.find(route => route.path === path);
};

export const getAccessibleRoutes = (isAuthenticated: boolean): RouteConfig[] => {
  return routes.filter(route => !route.requiresAuth || isAuthenticated);
};

export default routes;