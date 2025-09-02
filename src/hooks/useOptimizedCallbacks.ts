/**
 * Performance optimization hooks
 * Provides utilities to eliminate inline functions and optimize re-renders
 */

import { useCallback, useMemo, useRef, DependencyList } from 'react';

/**
 * Creates a stable callback with arguments
 * Eliminates the need for inline arrow functions
 * 
 * @example
 * // Instead of: onClick={() => handleClick(id)}
 * // Use: onClick={useCallbackWithArgs(handleClick, id)}
 */
export function useCallbackWithArgs<T extends (...args: any[]) => any>(
  callback: T,
  ...args: Parameters<T>
): () => void {
  return useCallback(() => {
    callback(...args);
  }, [callback, ...args]);
}

/**
 * Creates multiple stable callbacks at once
 * Useful for components with many event handlers
 * 
 * @example
 * const handlers = useCallbackMap({
 *   onClick: () => console.log('clicked'),
 *   onEdit: (id) => editItem(id),
 *   onDelete: (id) => deleteItem(id)
 * }, [editItem, deleteItem]);
 */
export function useCallbackMap<T extends Record<string, (...args: any[]) => any>>(
  callbacks: T,
  deps: DependencyList = []
): T {
  return useMemo(() => {
    const memoizedCallbacks: any = {};
    for (const key in callbacks) {
      memoizedCallbacks[key] = callbacks[key];
    }
    return memoizedCallbacks;
  }, deps);
}

/**
 * Creates a stable event handler that prevents default and stops propagation
 * Common pattern for form submissions and link clicks
 */
export function usePreventDefault<T extends Event = Event>(
  callback?: (event: T) => void,
  deps: DependencyList = []
) {
  return useCallback((event: T) => {
    event.preventDefault();
    callback?.(event);
  }, deps);
}

/**
 * Creates a debounced callback that only fires after a delay
 * Useful for search inputs and other expensive operations
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList = []
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [delay, ...deps]) as T;
}

/**
 * Creates a throttled callback that limits execution frequency
 * Useful for scroll and resize handlers
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList = []
): T {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRunRef.current;
    
    if (timeSinceLastRun >= delay) {
      callback(...args);
      lastRunRef.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRunRef.current = Date.now();
      }, delay - timeSinceLastRun);
    }
  }, [delay, ...deps]) as T;
}

/**
 * Creates a stable reference to the latest value
 * Useful for accessing current state in callbacks without causing re-renders
 */
export function useLatest<T>(value: T): { readonly current: T } {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

/**
 * Memoizes an expensive computation with deep comparison
 * Better than useMemo for complex objects
 */
export function useDeepMemo<T>(factory: () => T, deps: DependencyList): T {
  const ref = useRef<{ deps: DependencyList; value: T }>();
  
  if (!ref.current || !deepEqual(deps, ref.current.deps)) {
    ref.current = { deps, value: factory() };
  }
  
  return ref.current.value;
}

/**
 * Deep equality comparison helper
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

/**
 * Creates stable handlers for common list operations
 * Eliminates inline functions in lists
 */
export function useListHandlers<T>(
  onItemClick?: (item: T, index: number) => void,
  onItemEdit?: (item: T, index: number) => void,
  onItemDelete?: (item: T, index: number) => void,
  deps: DependencyList = []
) {
  const handlersRef = useRef<Map<number, {
    onClick: () => void;
    onEdit: () => void;
    onDelete: () => void;
  }>>(new Map());

  return useMemo(() => ({
    getHandlers: (item: T, index: number) => {
      if (!handlersRef.current.has(index)) {
        handlersRef.current.set(index, {
          onClick: () => onItemClick?.(item, index),
          onEdit: () => onItemEdit?.(item, index),
          onDelete: () => onItemDelete?.(item, index),
        });
      }
      return handlersRef.current.get(index)!;
    },
    clearHandlers: () => handlersRef.current.clear(),
  }), deps);
}