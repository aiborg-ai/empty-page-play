/**
 * Performance monitoring component for SearchFilter system
 */

import React, { useEffect, useRef } from 'react';
import { SearchFilterMetrics, SearchEvent } from '../../types/searchFilter';

interface PerformanceMonitorProps {
  enabled?: boolean;
  onMetricsCapture?: (metrics: SearchFilterMetrics) => void;
  onEventTrack?: (event: SearchEvent) => void;
  children: React.ReactNode;
}

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
}

class SearchFilterPerformanceMonitor {
  private static instance: SearchFilterPerformanceMonitor;
  private metrics: SearchFilterMetrics[] = [];
  private events: SearchEvent[] = [];
  private performanceEntries: PerformanceEntry[] = [];

  static getInstance(): SearchFilterPerformanceMonitor {
    if (!SearchFilterPerformanceMonitor.instance) {
      SearchFilterPerformanceMonitor.instance = new SearchFilterPerformanceMonitor();
    }
    return SearchFilterPerformanceMonitor.instance;
  }

  startTiming(name: string): string {
    const id = `${name}_${Date.now()}_${Math.random()}`;
    performance.mark(`${id}_start`);
    return id;
  }

  endTiming(id: string): number {
    performance.mark(`${id}_end`);
    performance.measure(id, `${id}_start`, `${id}_end`);
    
    const entries = performance.getEntriesByName(id, 'measure');
    const duration = entries[0]?.duration || 0;
    
    // Clean up performance marks
    performance.clearMarks(`${id}_start`);
    performance.clearMarks(`${id}_end`);
    performance.clearMeasures(id);
    
    return duration;
  }

  recordMetrics(metrics: SearchFilterMetrics) {
    this.metrics.push(metrics);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  recordEvent(event: SearchEvent) {
    this.events.push(event);
    
    // Keep only last 1000 events to prevent memory leaks
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  getMetrics(): SearchFilterMetrics[] {
    return [...this.metrics];
  }

  getEvents(): SearchEvent[] {
    return [...this.events];
  }

  getAverageSearchLatency(): number {
    const searchMetrics = this.metrics.filter(m => m.searchLatency > 0);
    if (searchMetrics.length === 0) return 0;
    
    const total = searchMetrics.reduce((sum, m) => sum + m.searchLatency, 0);
    return total / searchMetrics.length;
  }

  getAverageFilterLatency(): number {
    const filterMetrics = this.metrics.filter(m => m.filterLatency > 0);
    if (filterMetrics.length === 0) return 0;
    
    const total = filterMetrics.reduce((sum, m) => sum + m.filterLatency, 0);
    return total / filterMetrics.length;
  }

  clear() {
    this.metrics = [];
    this.events = [];
    this.performanceEntries = [];
  }
}

export default function PerformanceMonitor({ 
  enabled = process.env.NODE_ENV === 'development',
  onMetricsCapture,
  onEventTrack,
  children 
}: PerformanceMonitorProps) {
  const monitorRef = useRef<SearchFilterPerformanceMonitor>();
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (!enabled) return;

    monitorRef.current = SearchFilterPerformanceMonitor.getInstance();

    // Setup performance observer for built-in browser metrics
    if ('PerformanceObserver' in window) {
      observerRef.current = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('searchfilter')) {
            const metrics: SearchFilterMetrics = {
              searchLatency: entry.name.includes('search') ? entry.duration : 0,
              filterLatency: entry.name.includes('filter') ? entry.duration : 0,
              resultCount: 0, // This would be set by the actual search/filter operation
              timestamp: new Date(),
              userAgent: navigator.userAgent
            };
            
            monitorRef.current?.recordMetrics(metrics);
            onMetricsCapture?.(metrics);
          }
        }
      });

      try {
        observerRef.current.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }

    // Setup error tracking for search filter operations
    const handleError = (event: ErrorEvent) => {
      if (event.filename?.includes('SearchFilter') || event.message?.includes('search') || event.message?.includes('filter')) {
        const errorEvent: SearchEvent = {
          type: 'search',
          timestamp: new Date(),
          component: 'SearchFilterBar',
          query: 'ERROR: ' + event.message
        };
        
        monitorRef.current?.recordEvent(errorEvent);
        onEventTrack?.(errorEvent);
      }
    };

    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('error', handleError);
    };
  }, [enabled, onMetricsCapture, onEventTrack]);

  // Expose performance monitoring functions via context or props
  const trackSearchEvent = (query: string, resultCount: number, latency: number) => {
    if (!enabled || !monitorRef.current) return;

    const metrics: SearchFilterMetrics = {
      searchLatency: latency,
      filterLatency: 0,
      resultCount,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    };

    const event: SearchEvent = {
      type: 'search',
      query,
      timestamp: new Date(),
      component: 'SearchFilterBar'
    };

    monitorRef.current.recordMetrics(metrics);
    monitorRef.current.recordEvent(event);
    
    onMetricsCapture?.(metrics);
    onEventTrack?.(event);
  };

  const trackFilterEvent = (filterId: string, filterValue: unknown, resultCount: number, latency: number) => {
    if (!enabled || !monitorRef.current) return;

    const metrics: SearchFilterMetrics = {
      searchLatency: 0,
      filterLatency: latency,
      resultCount,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    };

    const event: SearchEvent = {
      type: 'filter',
      filterId,
      filterValue,
      timestamp: new Date(),
      component: 'SearchFilterBar'
    };

    monitorRef.current.recordMetrics(metrics);
    monitorRef.current.recordEvent(event);
    
    onMetricsCapture?.(metrics);
    onEventTrack?.(event);
  };

  // If monitoring is disabled, just render children
  if (!enabled) {
    return <>{children}</>;
  }

  // Add performance monitoring context
  return (
    <div data-performance-monitor="searchfilter">
      {children}
      
      {/* Development-only performance stats */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs font-mono z-50">
          <div className="mb-1">SearchFilter Performance</div>
          <div>Avg Search: {monitorRef.current?.getAverageSearchLatency().toFixed(1)}ms</div>
          <div>Avg Filter: {monitorRef.current?.getAverageFilterLatency().toFixed(1)}ms</div>
          <div>Events: {monitorRef.current?.getEvents().length || 0}</div>
          <div>Metrics: {monitorRef.current?.getMetrics().length || 0}</div>
          <button
            onClick={() => monitorRef.current?.clear()}
            className="mt-1 px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export { SearchFilterPerformanceMonitor };