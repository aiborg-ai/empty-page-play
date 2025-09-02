/**
 * Unified search and filter hook for consistent state management across components
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce, useDebouncedCallback } from '../utils/debounce';
import { getActiveFilterCount, encodeFiltersForUrl, decodeFiltersFromUrl } from '../utils/filterUtils';
import {
  SearchFilterState,
  SearchFilterConfig,
  UseSearchFilterReturn,
  SearchEvent
} from '../types/searchFilter';

// Default configuration
const DEFAULT_CONFIG: Required<SearchFilterConfig> = {
  defaultCategory: 'all',
  defaultSort: 'relevance',
  debounceMs: 300,
  persistInUrl: false,
  urlParamPrefix: '',
  onSearchChange: () => {},
  onCategoryChange: () => {},
  onSortChange: () => {},
  onFilterChange: () => {}
};

/**
 * Main hook for search and filter functionality
 */
export function useSearchFilter(config: SearchFilterConfig = {}): UseSearchFilterReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Initialize state from URL if persistence is enabled
  const getInitialState = (): SearchFilterState => {
    if (mergedConfig.persistInUrl && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlState = decodeFiltersFromUrl(urlParams);
      
      return {
        searchQuery: urlState.searchQuery || '',
        selectedCategory: urlState.selectedCategory || mergedConfig.defaultCategory,
        selectedSort: urlState.selectedSort || mergedConfig.defaultSort,
        activeFilters: urlState.activeFilters || {},
        quickFilters: {},
        isExpanded: false
      };
    }

    return {
      searchQuery: '',
      selectedCategory: mergedConfig.defaultCategory,
      selectedSort: mergedConfig.defaultSort,
      activeFilters: {},
      quickFilters: {},
      isExpanded: false
    };
  };

  const [state, setState] = useState<SearchFilterState>(getInitialState);
  
  // Debounced search query for performance
  const debouncedSearchQuery = useDebounce(state.searchQuery, mergedConfig.debounceMs);

  // Calculated values
  const activeFilterCount = useMemo(() => getActiveFilterCount(state), [state]);
  const hasActiveFilters = activeFilterCount > 0;

  // URL synchronization
  const updateUrl = useCallback((newState: SearchFilterState) => {
    if (mergedConfig.persistInUrl && typeof window !== 'undefined') {
      const urlString = encodeFiltersForUrl(newState);
      const newUrl = urlString 
        ? `${window.location.pathname}?${urlString}`
        : window.location.pathname;
      
      window.history.replaceState({}, '', newUrl);
    }
  }, [mergedConfig.persistInUrl]);

  // Analytics tracking
  const trackEvent = useCallback((event: Omit<SearchEvent, 'timestamp' | 'component'>) => {
    // In a real app, this would send to analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('SearchFilter Event:', {
        ...event,
        timestamp: new Date(),
        component: 'SearchFilter'
      });
    }
  }, []);

  // Debounced callbacks for external handlers
  const debouncedOnSearchChange = useDebouncedCallback(
    ((query: string) => mergedConfig.onSearchChange(query)) as (...args: unknown[]) => unknown,
    mergedConfig.debounceMs
  );

  // Action creators
  const setSearchQuery = useCallback((searchQuery: string) => {
    setState(prev => {
      const newState = { ...prev, searchQuery };
      updateUrl(newState);
      return newState;
    });
    
    debouncedOnSearchChange(searchQuery);
    trackEvent({ type: 'search', query: searchQuery });
  }, [updateUrl, debouncedOnSearchChange, trackEvent]);

  const setSelectedCategory = useCallback((selectedCategory: string) => {
    setState(prev => {
      const newState = { ...prev, selectedCategory };
      updateUrl(newState);
      return newState;
    });
    
    mergedConfig.onCategoryChange(selectedCategory);
    trackEvent({ type: 'filter', category: selectedCategory });
  }, [updateUrl, mergedConfig, trackEvent]);

  const setSelectedSort = useCallback((selectedSort: string) => {
    setState(prev => {
      const newState = { ...prev, selectedSort };
      updateUrl(newState);
      return newState;
    });
    
    mergedConfig.onSortChange(selectedSort);
    trackEvent({ type: 'sort', sortBy: selectedSort });
  }, [updateUrl, mergedConfig, trackEvent]);

  const setActiveFilter = useCallback((filterId: string, value: unknown) => {
    setState(prev => {
      const newActiveFilters = { ...prev.activeFilters };
      
      if (value === null || value === undefined || value === '') {
        delete newActiveFilters[filterId];
      } else {
        newActiveFilters[filterId] = value;
      }
      
      const newState = { ...prev, activeFilters: newActiveFilters };
      updateUrl(newState);
      return newState;
    });
    
    mergedConfig.onFilterChange(filterId, value);
    trackEvent({ type: 'filter', filterId, filterValue: value });
  }, [updateUrl, mergedConfig, trackEvent]);

  const toggleQuickFilter = useCallback((filterId: string) => {
    setState(prev => {
      const newQuickFilters = { ...prev.quickFilters };
      newQuickFilters[filterId] = !prev.quickFilters[filterId];
      
      const newActiveFilters = { ...prev.activeFilters };
      if (newQuickFilters[filterId]) {
        newActiveFilters[filterId] = true;
      } else {
        delete newActiveFilters[filterId];
      }
      
      const newState = { 
        ...prev, 
        quickFilters: newQuickFilters,
        activeFilters: newActiveFilters
      };
      updateUrl(newState);
      return newState;
    });
    
    trackEvent({ type: 'filter', filterId });
  }, [updateUrl, trackEvent]);

  const clearAllFilters = useCallback(() => {
    const newState: SearchFilterState = {
      searchQuery: '',
      selectedCategory: mergedConfig.defaultCategory,
      selectedSort: mergedConfig.defaultSort,
      activeFilters: {},
      quickFilters: {},
      isExpanded: false
    };
    
    setState(newState);
    updateUrl(newState);
    
    // Notify external handlers
    mergedConfig.onSearchChange('');
    mergedConfig.onCategoryChange(mergedConfig.defaultCategory);
    mergedConfig.onSortChange(mergedConfig.defaultSort);
    
    trackEvent({ type: 'clear' });
  }, [mergedConfig, updateUrl, trackEvent]);

  const setExpanded = useCallback((isExpanded: boolean) => {
    setState(prev => ({ ...prev, isExpanded }));
    trackEvent({ type: 'expand' });
  }, [trackEvent]);

  const resetToDefaults = useCallback(() => {
    const newState: SearchFilterState = {
      searchQuery: '',
      selectedCategory: mergedConfig.defaultCategory,
      selectedSort: mergedConfig.defaultSort,
      activeFilters: {},
      quickFilters: {},
      isExpanded: false
    };
    
    setState(newState);
    updateUrl(newState);
  }, [mergedConfig, updateUrl]);

  // Effect to handle external state changes
  useEffect(() => {
    if (mergedConfig.persistInUrl && typeof window !== 'undefined') {
      const handlePopState = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlState = decodeFiltersFromUrl(urlParams);
        
        setState(prev => ({
          ...prev,
          ...urlState,
          quickFilters: prev.quickFilters, // Preserve quick filters
          isExpanded: prev.isExpanded // Preserve UI state
        }));
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [mergedConfig.persistInUrl]);

  // Effect to sync debounced search query
  useEffect(() => {
    if (debouncedSearchQuery !== state.searchQuery) {
      // This handles cases where search query changed from external source
      mergedConfig.onSearchChange(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, mergedConfig, state.searchQuery]);

  return {
    // State
    searchQuery: state.searchQuery,
    selectedCategory: state.selectedCategory,
    selectedSort: state.selectedSort,
    activeFilters: state.activeFilters,
    quickFilters: state.quickFilters,
    isExpanded: state.isExpanded,
    
    // Computed values
    activeFilterCount,
    hasActiveFilters,
    debouncedSearchQuery,
    
    // Actions
    setSearchQuery,
    setSelectedCategory,
    setSelectedSort,
    setActiveFilter,
    toggleQuickFilter,
    clearAllFilters,
    setExpanded,
    resetToDefaults
  };
}

/**
 * Hook variants for specific use cases
 */

export function useShowcaseFilter(config: SearchFilterConfig = {}) {
  return useSearchFilter({
    defaultCategory: 'all',
    defaultSort: 'relevance',
    debounceMs: 300,
    persistInUrl: true,
    urlParamPrefix: 'showcase_',
    ...config
  });
}

export function useStudioFilter(config: SearchFilterConfig = {}) {
  return useSearchFilter({
    defaultCategory: 'all',
    defaultSort: 'recent',
    debounceMs: 200,
    persistInUrl: true,
    urlParamPrefix: 'studio_',
    ...config
  });
}

export function useReportsFilter(config: SearchFilterConfig = {}) {
  return useSearchFilter({
    defaultCategory: 'all',
    defaultSort: 'recent',
    debounceMs: 300,
    persistInUrl: true,
    urlParamPrefix: 'reports_',
    ...config
  });
}

export function useDecisionEnginesFilter(config: SearchFilterConfig = {}) {
  return useSearchFilter({
    defaultCategory: 'all',
    defaultSort: 'popular',
    debounceMs: 250,
    persistInUrl: false, // Decision engines might be session-based
    ...config
  });
}

export function useInnovationHubFilter(config: SearchFilterConfig = {}) {
  return useSearchFilter({
    defaultCategory: 'all',
    defaultSort: 'recent',
    debounceMs: 300,
    persistInUrl: false,
    ...config
  });
}

export default useSearchFilter;