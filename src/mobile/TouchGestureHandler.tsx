/**
 * Touch Gesture Handler Component
 * Handles swipe gestures for mobile navigation and interactions
 */

import React, { useRef, useState, useCallback } from 'react';

export interface TouchGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchZoom?: (scale: number) => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  minSwipeDistance?: number;
  longPressDelay?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

const TouchGestureHandler: React.FC<TouchGestureProps> = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinchZoom,
  onTap,
  onDoubleTap,
  onLongPress,
  children,
  className = '',
  disabled = false,
  minSwipeDistance = 50,
  longPressDelay = 500,
}) => {
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPoint | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef<boolean>(false);

  // Calculate distance between two points
  const getDistance = useCallback((point1: TouchPoint, point2: TouchPoint): number => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }, []);

  // Calculate distance between two touches (for pinch gesture)
  const getPinchDistance = useCallback((touches: TouchList): number => {
    if (touches.length < 2) return 0;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;

    const touch = e.touches[0];
    const touchPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    setTouchStart(touchPoint);
    setTouchEnd(null);
    isLongPressTriggered.current = false;

    // Handle pinch zoom setup
    if (e.touches.length === 2 && onPinchZoom) {
      const distance = getPinchDistance(e.touches as any);
      setInitialPinchDistance(distance);
    }

    // Setup long press detection
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        isLongPressTriggered.current = true;
        onLongPress();
      }, longPressDelay);
    }
  }, [disabled, onPinchZoom, onLongPress, longPressDelay, getPinchDistance]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchStart) return;

    const touch = e.touches[0];
    const touchPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    setTouchEnd(touchPoint);

    // Cancel long press if user moves finger
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Handle pinch zoom
    if (e.touches.length === 2 && onPinchZoom && initialPinchDistance > 0) {
      const currentDistance = getPinchDistance(e.touches as any);
      const scale = currentDistance / initialPinchDistance;
      onPinchZoom(scale);
    }
  }, [disabled, touchStart, onPinchZoom, initialPinchDistance, getPinchDistance]);

  // Handle touch end
  const handleTouchEnd = useCallback((_e: React.TouchEvent) => {
    if (disabled || !touchStart) return;

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // If long press was triggered, don't process other gestures
    if (isLongPressTriggered.current) {
      return;
    }

    const touchEndPoint: TouchPoint = touchEnd || {
      x: touchStart.x,
      y: touchStart.y,
      timestamp: Date.now(),
    };

    // Calculate swipe distance and direction
    const distanceX = touchStart.x - touchEndPoint.x;
    const distanceY = touchStart.y - touchEndPoint.y;
    const distance = getDistance(touchStart, touchEndPoint);
    
    // Check if it's a swipe gesture
    if (distance > minSwipeDistance) {
      const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
      
      if (isHorizontalSwipe) {
        // Horizontal swipes
        if (distanceX > 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (distanceX < 0 && onSwipeRight) {
          onSwipeRight();
        }
      } else {
        // Vertical swipes
        if (distanceY > 0 && onSwipeUp) {
          onSwipeUp();
        } else if (distanceY < 0 && onSwipeDown) {
          onSwipeDown();
        }
      }
    } else {
      // It's a tap - check for single or double tap
      const now = Date.now();
      const timeSinceLastTap = now - lastTap;
      
      if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        // Double tap
        if (onDoubleTap) {
          onDoubleTap();
        }
        setLastTap(0); // Reset to prevent triple tap
      } else {
        // Single tap - delay to check for double tap
        setTimeout(() => {
          if (Date.now() - now > 250) {
            // No double tap detected, execute single tap
            if (onTap) {
              onTap();
            }
          }
        }, 300);
        setLastTap(now);
      }
    }

    // Reset pinch distance
    setInitialPinchDistance(0);
  }, [
    disabled, 
    touchStart, 
    touchEnd, 
    lastTap, 
    minSwipeDistance,
    getDistance,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap
  ]);

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: onPinchZoom ? 'none' : 'manipulation', // Prevent default touch behaviors
      }}
    >
      {children}
    </div>
  );
};

// Hook for using touch gestures
export const useTouchGestures = () => {
  const [gestureState, setGestureState] = useState({
    isSwipeLeft: false,
    isSwipeRight: false,
    isSwipeUp: false,
    isSwipeDown: false,
    isPinching: false,
    pinchScale: 1,
    lastTapTime: 0,
  });

  const resetGestures = useCallback(() => {
    setGestureState(prev => ({
      ...prev,
      isSwipeLeft: false,
      isSwipeRight: false,
      isSwipeUp: false,
      isSwipeDown: false,
      isPinching: false,
    }));
  }, []);

  const handleSwipeLeft = useCallback(() => {
    setGestureState(prev => ({ ...prev, isSwipeLeft: true }));
    setTimeout(resetGestures, 100);
  }, [resetGestures]);

  const handleSwipeRight = useCallback(() => {
    setGestureState(prev => ({ ...prev, isSwipeRight: true }));
    setTimeout(resetGestures, 100);
  }, [resetGestures]);

  const handleSwipeUp = useCallback(() => {
    setGestureState(prev => ({ ...prev, isSwipeUp: true }));
    setTimeout(resetGestures, 100);
  }, [resetGestures]);

  const handleSwipeDown = useCallback(() => {
    setGestureState(prev => ({ ...prev, isSwipeDown: true }));
    setTimeout(resetGestures, 100);
  }, [resetGestures]);

  const handlePinchZoom = useCallback((scale: number) => {
    setGestureState(prev => ({ 
      ...prev, 
      isPinching: true,
      pinchScale: scale 
    }));
  }, []);

  return {
    gestureState,
    handlers: {
      onSwipeLeft: handleSwipeLeft,
      onSwipeRight: handleSwipeRight,
      onSwipeUp: handleSwipeUp,
      onSwipeDown: handleSwipeDown,
      onPinchZoom: handlePinchZoom,
    },
    resetGestures,
  };
};

export default TouchGestureHandler;