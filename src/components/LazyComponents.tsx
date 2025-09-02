/**
 * Lazy-loaded components for code splitting
 * Reduces initial bundle size by loading components on demand
 */

import { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading fallback component
 */
export const LoadingFallback = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  </div>
);

/**
 * Wrapper for lazy components with error boundary
 */
export function withLazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackMessage?: string
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded AI components (heavy components)
 */
export const LazyAIComponents = {
  OpportunityGapScanner: withLazyLoad(
    () => import('./OpportunityGapScanner'),
    'Loading Opportunity Gap Scanner...'
  ),
  
  AIPatentClaimGenerator: withLazyLoad(
    () => import('./AIPatentClaimGenerator'),
    'Loading AI Patent Claim Generator...'
  ),
  
  PriorArtOracle: withLazyLoad(
    () => import('./PriorArtOracle'),
    'Loading Prior Art Oracle...'
  ),
  
  InnovationTrajectoryPredictor: withLazyLoad(
    () => import('./InnovationTrajectoryPredictor'),
    'Loading Innovation Trajectory Predictor...'
  ),
  
  Citation3DVisualization: withLazyLoad(
    () => import('./Citation3DVisualization'),
    'Loading 3D Visualization...'
  ),
  
  CollisionDetection: withLazyLoad(
    () => import('./CollisionDetection'),
    'Loading Collision Detection...'
  ),
  
  BlockchainProvenance: withLazyLoad(
    () => import('./BlockchainProvenance'),
    'Loading Blockchain Provenance...'
  )
};

/**
 * Lazy-loaded page components
 */
export const LazyPages = {
  NetworkPage: withLazyLoad(
    () => import('./NetworkPage'),
    'Loading Network...'
  ),
  
  Showcase: withLazyLoad(
    () => import('./Showcase'),
    'Loading Showcase...'
  ),
  
  CMSStudio: withLazyLoad(
    () => import('./CMSStudioModern'),
    'Loading Studio...'
  ),
  
  InnovationHub: withLazyLoad(
    () => import('./InnovationHub'),
    'Loading Innovation Hub...'
  ),
  
  Collections: withLazyLoad(
    () => import('./Collections'),
    'Loading Collections...'
  ),
  
  
  AccountSettings: withLazyLoad(
    () => import('./AccountSettings'),
    'Loading Account Settings...'
  )
};

/**
 * Lazy-loaded modal components
 */
export const LazyModals = {
  RunCapabilityModal: withLazyLoad(
    () => import('./modals/RunCapabilityModal').then(m => ({ default: m.RunCapabilityModal })),
    'Loading modal...'
  ),
  
  ShareCapabilityModal: withLazyLoad(
    () => import('./modals/ShareCapabilityModal').then(m => ({ default: m.ShareCapabilityModal })),
    'Loading modal...'
  ),
  
  ContactModal: withLazyLoad(
    () => import('./modals/ContactModal'),
    'Loading modal...'
  ),
  
  InviteModal: withLazyLoad(
    () => import('./modals/InviteModal'),
    'Loading modal...'
  ),
  
  AIDashboardModal: withLazyLoad(
    () => import('./modals/AIDashboardModal'),
    'Loading AI Dashboard...'
  )
};

/**
 * Preload component for better UX
 */
export function preloadComponent(
  componentName: keyof typeof LazyPages | keyof typeof LazyAIComponents | keyof typeof LazyModals
) {
  // Trigger the lazy import without rendering
  if (componentName in LazyPages) {
    (LazyPages as any)[componentName].preload?.();
  } else if (componentName in LazyAIComponents) {
    (LazyAIComponents as any)[componentName].preload?.();
  } else if (componentName in LazyModals) {
    (LazyModals as any)[componentName].preload?.();
  }
}

/**
 * Batch preload components
 */
export function preloadComponents(componentNames: string[]) {
  componentNames.forEach(name => preloadComponent(name as any));
}