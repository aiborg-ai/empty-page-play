/**
 * Pull to Refresh Component
 * Implements native-like pull-to-refresh functionality for mobile
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  pullDistance?: number;
  triggerDistance?: number;
  refreshThreshold?: number;
  disabled?: boolean;
  className?: string;
}

interface TouchPosition {
  y: number;
  timestamp: number;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  pullDistance = 80,
  triggerDistance = 60,
  refreshThreshold = 50,
  disabled = false,
  className = '',
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullOffset, setPullOffset] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<TouchPosition | null>(null);
  const touchMoveRef = useRef<TouchPosition | null>(null);
  const isScrolledToTopRef = useRef(false);

  // Check if container is scrolled to top
  const checkScrollPosition = useCallback(() => {
    if (!containerRef.current) return false;
    
    const scrollTop = containerRef.current.scrollTop;
    const isAtTop = scrollTop <= 0;
    isScrolledToTopRef.current = isAtTop;
    return isAtTop;
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (disabled || isRefreshing) return;

    const touch = event.touches[0];
    touchStartRef.current = {
      y: touch.clientY,
      timestamp: Date.now(),
    };

    checkScrollPosition();
  }, [disabled, isRefreshing, checkScrollPosition]);

  // Handle touch move
  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (disabled || isRefreshing || !touchStartRef.current || !isScrolledToTopRef.current) {
      return;
    }

    const touch = event.touches[0];
    const currentY = touch.clientY;
    const startY = touchStartRef.current.y;
    const deltaY = currentY - startY;

    touchMoveRef.current = {
      y: currentY,
      timestamp: Date.now(),
    };

    // Only handle downward pulls when at the top
    if (deltaY > 0) {
      event.preventDefault();
      
      // Apply resistance curve for more natural feel
      const resistance = 0.5;
      const adjustedOffset = Math.min(
        pullDistance,
        deltaY * resistance * (1 - Math.min(deltaY / (pullDistance * 2), 0.8))
      );

      setPullOffset(adjustedOffset);
      setIsPulling(true);
      setCanRefresh(adjustedOffset >= triggerDistance);
    }
  }, [disabled, isRefreshing, pullDistance, triggerDistance]);

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || !isPulling) return;

    setIsPulling(false);
    
    if (canRefresh && pullOffset >= refreshThreshold) {
      setIsRefreshing(true);
      setPullOffset(0);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setCanRefresh(false);
      }
    } else {
      // Animate back to original position
      const animateBack = () => {
        setPullOffset(prev => {
          const newOffset = prev * 0.8;
          if (newOffset > 1) {
            requestAnimationFrame(animateBack);
            return newOffset;
          } else {
            setCanRefresh(false);
            return 0;
          }
        });
      };
      requestAnimationFrame(animateBack);
    }

    touchStartRef.current = null;
    touchMoveRef.current = null;
  }, [disabled, isRefreshing, isPulling, canRefresh, pullOffset, refreshThreshold, onRefresh]);

  // Reset state when disabled or refreshing changes
  useEffect(() => {
    if (disabled) {
      setPullOffset(0);
      setIsPulling(false);
      setCanRefresh(false);
    }
  }, [disabled]);

  // Calculate refresh indicator properties
  const refreshOpacity = Math.min(1, pullOffset / triggerDistance);
  const refreshRotation = (pullOffset / triggerDistance) * 180;
  const refreshScale = Math.min(1, 0.6 + (pullOffset / triggerDistance) * 0.4);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto touch-pan-y ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        height: '100%',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Pull to Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-transform duration-150 ease-out z-10"
        style={{
          transform: `translateY(${pullOffset - pullDistance}px)`,
          height: pullDistance,
        }}
      >
        <div
          className={`flex flex-col items-center justify-center transition-all duration-200 ${
            canRefresh ? 'text-blue-600' : 'text-gray-400'
          }`}
          style={{
            opacity: refreshOpacity,
            transform: `scale(${refreshScale})`,
          }}
        >
          <div className="relative">
            <RotateCcw
              className={`w-6 h-6 transition-transform duration-200 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              style={{
                transform: isRefreshing ? 'rotate(0deg)' : `rotate(${refreshRotation}deg)`,
              }}
            />
            
            {/* Progress ring */}
            <svg
              className="absolute inset-0 w-6 h-6 -rotate-90"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeOpacity="0.1"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 10}`}
                strokeDashoffset={`${2 * Math.PI * 10 * (1 - Math.min(1, pullOffset / triggerDistance))}`}
                className="transition-all duration-150"
              />
            </svg>
          </div>
          
          <div className="mt-1 text-xs font-medium">
            {isRefreshing 
              ? 'Refreshing...' 
              : canRefresh 
                ? 'Release to refresh' 
                : 'Pull to refresh'
            }
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-150 ease-out"
        style={{
          transform: `translateY(${pullOffset}px)`,
        }}
      >
        {children}
      </div>

      {/* Loading overlay when refreshing */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-200 overflow-hidden">
          <div className="h-full bg-blue-600 animate-pulse" />
        </div>
      )}
    </div>
  );
};

// Hook for using pull-to-refresh functionality
export const usePullToRefresh = (
  refreshFn: () => Promise<void>,
  options: {
    disabled?: boolean;
    pullDistance?: number;
    triggerDistance?: number;
  } = {}
) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (isRefreshing || options.disabled) return;

    setIsRefreshing(true);
    try {
      await refreshFn();
    } catch (error) {
      console.error('Refresh failed:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshFn, isRefreshing, options.disabled]);

  return {
    isRefreshing,
    refresh,
  };
};

export default PullToRefresh;