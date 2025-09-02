/**
 * Comprehensive TypeScript interfaces for the unified search and filter system
 */

// Base filter option interface
export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'boolean';
  options?: Array<{ value: string; label: string; count?: number }>;
  value?: unknown;
  required?: boolean;
  placeholder?: string;
}

// Category interface with consistent naming
export interface Category {
  value: string;
  label: string;
  count?: number;
  icon?: React.ComponentType;
  description?: string;
}

// Sort option interface
export interface SortOption {
  value: string;
  label: string;
  direction?: 'asc' | 'desc';
}

// Quick filter interface
export interface QuickFilter {
  id: string;
  label: string;
  icon?: React.ComponentType;
  active: boolean;
}

// Search filter state interface
export interface SearchFilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedSort: string;
  activeFilters: Record<string, unknown>;
  quickFilters: Record<string, boolean>;
  isExpanded: boolean;
}

// Search filter actions interface
export interface SearchFilterActions {
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedSort: (sort: string) => void;
  setActiveFilter: (filterId: string, value: unknown) => void;
  toggleQuickFilter: (filterId: string) => void;
  clearAllFilters: () => void;
  setExpanded: (expanded: boolean) => void;
  resetToDefaults: () => void;
}

// Combined hook return interface
export interface UseSearchFilterReturn extends SearchFilterState, SearchFilterActions {
  activeFilterCount: number;
  hasActiveFilters: boolean;
  debouncedSearchQuery: string;
}

// Configuration interface for the hook
export interface SearchFilterConfig {
  defaultCategory?: string;
  defaultSort?: string;
  debounceMs?: number;
  persistInUrl?: boolean;
  urlParamPrefix?: string;
  onSearchChange?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
  onFilterChange?: (filterId: string, value: unknown) => void;
}

// Props interface for SearchFilterBar component
export interface SearchFilterBarProps {
  placeholder?: string;
  categories?: Category[];
  sortOptions?: SortOption[];
  filters?: FilterOption[];
  quickFilters?: QuickFilter[];
  showVoiceSearch?: boolean;
  showCategories?: boolean;
  showSort?: boolean;
  className?: string;
  
  // State from hook
  searchQuery: string;
  selectedCategory: string;
  selectedSort: string;
  activeFilters: Record<string, unknown>;
  isExpanded: boolean;
  activeFilterCount: number;
  
  // Actions from hook
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedSort: (sort: string) => void;
  setActiveFilter: (filterId: string, value: unknown) => void;
  toggleQuickFilter: (filterId: string) => void;
  clearAllFilters: () => void;
  setExpanded: (expanded: boolean) => void;
}

// Generic filterable item interface
export interface FilterableItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  metadata?: Record<string, unknown>;
}

// Filter function type
export type FilterFunction<T extends FilterableItem> = (
  items: T[],
  state: SearchFilterState
) => T[];

// Sort function type
export type SortFunction<T extends FilterableItem> = (
  items: T[],
  sortBy: string
) => T[];

// Category generator function type
export type CategoryGenerator<T extends FilterableItem> = (
  items: T[]
) => Category[];

// Hook options for specific use cases
export interface ShowcaseFilterOptions extends SearchFilterConfig {
  capabilities: FilterableItem[];
  onRunCapability?: (capability: FilterableItem) => void;
  onShareCapability?: (capability: FilterableItem) => void;
}

export interface StudioFilterOptions extends SearchFilterConfig {
  assets: FilterableItem[];
  assetTypes: string[];
  onCreateAsset?: (type: string) => void;
}

export interface ReportsFilterOptions extends SearchFilterConfig {
  reports: FilterableItem[];
  reportTypes: string[];
  onCreateReport?: (type: string) => void;
}

export interface DecisionEngineFilterOptions extends SearchFilterConfig {
  engines: FilterableItem[];
  engineCategories: string[];
  onRunEngine?: (engine: FilterableItem) => void;
}

export interface InnovationHubFilterOptions extends SearchFilterConfig {
  features: FilterableItem[];
  featureCategories: string[];
  onNavigateToFeature?: (feature: string) => void;
}

// Error types
export interface SearchFilterError {
  type: 'validation' | 'network' | 'parsing' | 'unknown';
  message: string;
  field?: string;
  code?: string;
}

// Performance metrics interface
export interface SearchFilterMetrics {
  searchLatency: number;
  filterLatency: number;
  resultCount: number;
  timestamp: Date;
  userAgent: string;
}

// URL state interface
export interface UrlState {
  q?: string; // search query
  c?: string; // category
  s?: string; // sort
  f?: string; // filters (JSON encoded)
  p?: string; // page
}

// Event interfaces for analytics
export interface SearchEvent {
  type: 'search' | 'filter' | 'sort' | 'clear' | 'expand';
  query?: string;
  category?: string;
  sortBy?: string;
  filterId?: string;
  filterValue?: unknown;
  timestamp: Date;
  component: string;
}

export default SearchFilterState;