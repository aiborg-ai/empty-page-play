/**
 * Utility functions for search and filter operations
 */

import { 
  FilterableItem, 
  Category, 
  SearchFilterState,
  FilterFunction,
  SortFunction,
  CategoryGenerator,
  SearchFilterError
} from '../types/searchFilter';

/**
 * Generic search function that searches across name, description, and tags
 */
export const searchItems = <T extends FilterableItem>(
  items: T[],
  query: string
): T[] => {
  if (!query.trim()) return items;

  const searchTerm = query.toLowerCase().trim();
  const searchTerms = searchTerm.split(' ').filter(term => term.length > 0);

  return items.filter(item => {
    const searchableText = [
      item.name?.toLowerCase() || '',
      item.description?.toLowerCase() || '',
      ...(item.tags?.map(tag => tag.toLowerCase()) || [])
    ].join(' ');

    return searchTerms.every(term => 
      searchableText.includes(term)
    );
  });
};

/**
 * Generic category filter function
 */
export const filterByCategory = <T extends FilterableItem>(
  items: T[],
  category: string
): T[] => {
  if (!category || category === 'all') return items;
  return items.filter(item => item.category === category);
};

/**
 * Generic filter function that applies all active filters
 */
export const applyFilters = <T extends FilterableItem>(
  items: T[],
  state: SearchFilterState
): T[] => {
  let filtered = items;

  // Apply search
  filtered = searchItems(filtered, state.searchQuery);

  // Apply category filter
  filtered = filterByCategory(filtered, state.selectedCategory);

  // Apply custom filters
  Object.entries(state.activeFilters).forEach(([filterId, value]) => {
    if (value === null || value === undefined || value === '' || value === false) {
      return; // Skip inactive filters
    }

    switch (filterId) {
      case 'recent':
        if (value) {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          filtered = filtered.filter(item => {
            const itemDate = typeof item.createdAt === 'string' 
              ? new Date(item.createdAt) 
              : item.createdAt;
            return itemDate && itemDate >= weekAgo;
          });
        }
        break;

      case 'popular':
        if (value) {
          // Assuming items have a popularity score or download count
          filtered = filtered.filter(item => 
            (item.metadata?.popularity as number) > 100 ||
            (item.metadata?.downloadCount as number) > 50
          );
        }
        break;

      case 'featured':
        if (value) {
          filtered = filtered.filter(item => 
            item.metadata?.featured === true
          );
        }
        break;

      default:
        // Handle custom filters
        if (Array.isArray(value)) {
          // Multi-select filter
          filtered = filtered.filter(item =>
            value.some(val => 
              item.metadata?.[filterId] === val ||
              item.tags?.includes(val)
            )
          );
        } else {
          // Single-select filter
          filtered = filtered.filter(item =>
            item.metadata?.[filterId] === value ||
            item.tags?.includes(value as string)
          );
        }
        break;
    }
  });

  return filtered;
};

/**
 * Generic sorting function
 */
export const sortItems = <T extends FilterableItem>(
  items: T[],
  sortBy: string
): T[] => {
  const sorted = [...items];

  switch (sortBy) {
    case 'name':
    case 'alpha':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'recent':
      return sorted.sort((a, b) => {
        const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt || new Date(0);
        const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

    case 'updated':
      return sorted.sort((a, b) => {
        const dateA = typeof a.updatedAt === 'string' ? new Date(a.updatedAt) : a.updatedAt || new Date(0);
        const dateB = typeof b.updatedAt === 'string' ? new Date(b.updatedAt) : b.updatedAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

    case 'popular':
      return sorted.sort((a, b) => 
        ((b.metadata?.popularity as number) || 0) - ((a.metadata?.popularity as number) || 0)
      );

    case 'rating':
      return sorted.sort((a, b) => 
        ((b.metadata?.rating as number) || 0) - ((a.metadata?.rating as number) || 0)
      );

    case 'relevance':
    default:
      // For relevance, we could implement a scoring algorithm
      // For now, just return as-is (assuming items are already in relevance order)
      return sorted;
  }
};

/**
 * Generate categories from items with counts
 */
export const generateCategories = <T extends FilterableItem>(
  items: T[],
  includeAll = true
): Category[] => {
  const categoryMap = new Map<string, number>();
  
  items.forEach(item => {
    const count = categoryMap.get(item.category) || 0;
    categoryMap.set(item.category, count + 1);
  });

  const categories: Category[] = [];

  if (includeAll) {
    categories.push({
      value: 'all',
      label: 'All',
      count: items.length
    });
  }

  categoryMap.forEach((count, category) => {
    categories.push({
      value: category,
      label: formatCategoryLabel(category),
      count
    });
  });

  return categories.sort((a, b) => {
    if (a.value === 'all') return -1;
    if (b.value === 'all') return 1;
    return a.label.localeCompare(b.label);
  });
};

/**
 * Format category names for display
 */
export const formatCategoryLabel = (category: string): string => {
  return category
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Calculate active filter count
 */
export const getActiveFilterCount = (state: SearchFilterState): number => {
  let count = 0;

  // Count search query
  if (state.searchQuery.trim()) count++;

  // Count category (if not 'all')
  if (state.selectedCategory && state.selectedCategory !== 'all') count++;

  // Count active filters
  Object.values(state.activeFilters).forEach(value => {
    if (value === null || value === undefined || value === '' || value === false) {
      return;
    }
    if (Array.isArray(value) && value.length === 0) {
      return;
    }
    count++;
  });

  return count;
};

/**
 * Validate filter configuration
 */
export const validateFilterConfig = (config: unknown): SearchFilterError[] => {
  const errors: SearchFilterError[] = [];

  if (!config || typeof config !== 'object') {
    errors.push({
      type: 'validation',
      message: 'Configuration must be an object',
      code: 'INVALID_CONFIG'
    });
    return errors;
  }

  // Add more validation rules as needed

  return errors;
};

/**
 * Create filter function for specific use cases
 */
export const createFilterFunction = <T extends FilterableItem>(
  customFilters?: Record<string, (items: T[], value: unknown) => T[]>
): FilterFunction<T> => {
  return (items: T[], state: SearchFilterState): T[] => {
    let filtered = applyFilters(items, state);
    
    // Apply custom filters if provided
    if (customFilters) {
      Object.entries(state.activeFilters).forEach(([filterId, value]) => {
        const customFilter = customFilters[filterId];
        if (customFilter && value !== null && value !== undefined) {
          filtered = customFilter(filtered, value);
        }
      });
    }

    return sortItems(filtered, state.selectedSort);
  };
};

/**
 * Memoization utility for expensive operations
 */
export const memoize = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): ((...args: Args) => Return) => {
  const cache = new Map<string, Return>();
  
  return (...args: Args): Return => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

/**
 * Memoized versions of common operations
 */
export const memoizedGenerateCategories = memoize(generateCategories);
export const memoizedSearchItems = memoize(searchItems);
export const memoizedApplyFilters = memoize(applyFilters);

/**
 * URL state management utilities
 */
export const encodeFiltersForUrl = (state: SearchFilterState): string => {
  const urlState = {
    q: state.searchQuery || undefined,
    c: state.selectedCategory !== 'all' ? state.selectedCategory : undefined,
    s: state.selectedSort !== 'relevance' ? state.selectedSort : undefined,
    f: Object.keys(state.activeFilters).length > 0 
      ? JSON.stringify(state.activeFilters) 
      : undefined
  };

  const params = new URLSearchParams();
  Object.entries(urlState).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  return params.toString();
};

export const decodeFiltersFromUrl = (searchParams: URLSearchParams): Partial<SearchFilterState> => {
  try {
    return {
      searchQuery: searchParams.get('q') || '',
      selectedCategory: searchParams.get('c') || 'all',
      selectedSort: searchParams.get('s') || 'relevance',
      activeFilters: searchParams.get('f') ? JSON.parse(searchParams.get('f')!) : {}
    };
  } catch (error) {
    console.warn('Failed to decode filters from URL:', error);
    return {
      searchQuery: '',
      selectedCategory: 'all',
      selectedSort: 'relevance',
      activeFilters: {}
    };
  }
};