/**
 * Mobile Components Index
 * Export all mobile and PWA components for easy importing
 */

// Navigation Components
export { default as MobileNavigation } from './MobileNavigation';
export { default as BottomNavigation } from './BottomNavigation';

// Touch and Gesture Components
export { default as TouchGestureHandler, useTouchGestures } from './TouchGestureHandler';
export type { TouchGestureProps } from './TouchGestureHandler';

// Mobile-Optimized UI Components
export { default as MobileCard } from './MobileCard';
export { MobileProjectCard, MobilePatentCard, MobileDashboardCard } from './MobileCard';
export type { MobileCardProps } from './MobileCard';

export { default as MobileTable } from './MobileTable';
export type { MobileTableColumn, MobileTableProps } from './MobileTable';

export { default as MobileForm } from './MobileForm';
export type { MobileFormField, MobileFormProps } from './MobileForm';

// Mobile Features
export { default as CameraCapture } from './CameraCapture';
export { default as WebShareAPI, useWebShare, sharePatent, shareProject, shareDashboard } from './WebShareAPI';
export type { ShareData } from './WebShareAPI';

export { default as PullToRefresh, usePullToRefresh } from './PullToRefresh';

// Performance Components
export { default as LazyImage, useImagePreload, useAdaptiveQuality } from './LazyImage';
export { default as SimpleVirtualList } from './SimpleVirtualList';
export type { SimpleVirtualListProps } from './SimpleVirtualList';

export { default as AdaptiveLoader, useAdaptiveLoading } from './AdaptiveLoader';