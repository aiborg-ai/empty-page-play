import React, { useRef, useId, useState } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Calendar,
  Tag,
  Sparkles
} from 'lucide-react';
import VoiceSearchButton from '../VoiceSearchButton';
import { SearchFilterBarProps, QuickFilter } from '../../types/searchFilter';
import SearchFilterErrorBoundary from './ErrorBoundary';
import PerformanceMonitor from './PerformanceMonitor';

// Default quick filters
const DEFAULT_QUICK_FILTERS: QuickFilter[] = [
  { id: 'recent', label: 'Recently Added', icon: Calendar, active: false },
  { id: 'popular', label: 'Most Popular', icon: Sparkles, active: false },
  { id: 'featured', label: 'Featured', icon: Tag, active: false }
];

/**
 * Accessible dropdown component
 */
interface AccessibleDropdownProps {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string; count?: number }>;
  onChange: (value: string) => void;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

function AccessibleDropdown({ 
  id: _id, 
  label, 
  value, 
  options, 
  onChange, 
  className = '', 
  icon: Icon 
}: AccessibleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const comboboxId = useId();
  const listboxId = useId();

  const selectedOption = options.find(opt => opt.value === value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const firstOption = listboxRef.current?.querySelector('[role="option"]') as HTMLElement;
          firstOption?.focus();
        }
        break;
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChange(optionValue);
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        const nextSibling = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
        nextSibling?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevSibling = (e.currentTarget as HTMLElement).previousElementSibling as HTMLElement;
        if (prevSibling) {
          prevSibling.focus();
        } else {
          buttonRef.current?.focus();
        }
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        id={comboboxId}
        type="button"
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
      >
        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
        <span className="text-gray-700">
          {selectedOption?.label || label}
          {selectedOption?.count !== undefined && ` (${selectedOption.count})`}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={comboboxId}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {options.map((option, _index) => (
            <li
              key={option.value}
              role="option"
              tabIndex={-1}
              aria-selected={option.value === value}
              className={`px-3 py-2 cursor-pointer hover:bg-blue-50 focus:bg-blue-50 focus:outline-none ${
                option.value === value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                buttonRef.current?.focus();
              }}
              onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
            >
              {option.label}
              {option.count !== undefined && (
                <span className="ml-1 text-xs text-gray-500">({option.count})</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchFilterBarComponent({
  placeholder = "Search...",
  categories = [],
  sortOptions = [],
  filters = [],
  quickFilters = DEFAULT_QUICK_FILTERS,
  showVoiceSearch = true,
  showCategories = true,
  showSort = true,
  className = '',
  
  // State from hook
  searchQuery,
  selectedCategory,
  selectedSort,
  activeFilters,
  isExpanded,
  activeFilterCount,
  
  // Actions from hook
  setSearchQuery,
  setSelectedCategory,
  setSelectedSort,
  setActiveFilter,
  toggleQuickFilter,
  clearAllFilters,
  setExpanded
}: SearchFilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchInputId = useId();
  const filterButtonId = useId();
  const expandedSectionId = useId();

  // Handle keyboard shortcuts
  const handleGlobalKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
    if (e.key === 'Escape' && isExpanded) {
      setExpanded(false);
    }
  };

  // Register global keyboard listeners
  React.useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isExpanded]);

  // Handle search input with accessibility
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  return (
    <div className={`bg-white border-y border-gray-200 ${className}`}>
      {/* Main Search Bar - Always Visible */}
      <div className="px-6 py-3" role="search">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <label htmlFor={searchInputId} className="sr-only">
              {placeholder}
            </label>
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              aria-hidden="true" 
            />
            <input
              ref={searchInputRef}
              id={searchInputId}
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={`${placeholder} (Ctrl+K)`}
              className="w-full pl-10 pr-12 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby={activeFilterCount > 0 ? `${searchInputId}-filters` : undefined}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Voice Search */}
          {showVoiceSearch && (
            <VoiceSearchButton onTranscription={setSearchQuery} />
          )}

          {/* Category Selector */}
          {showCategories && categories.length > 0 && (
            <AccessibleDropdown
              id="category-selector"
              label="Categories"
              value={selectedCategory}
              options={categories}
              onChange={setSelectedCategory}
            />
          )}

          {/* Sort Dropdown */}
          {showSort && sortOptions.length > 0 && (
            <AccessibleDropdown
              id="sort-selector"
              label="Sort"
              value={selectedSort}
              options={sortOptions}
              onChange={setSelectedSort}
              icon={SlidersHorizontal}
            />
          )}

          {/* Filter Toggle Button */}
          <button
            id={filterButtonId}
            type="button"
            onClick={() => setExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isExpanded || activeFilterCount > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-expanded={isExpanded}
            aria-controls={expandedSectionId}
            aria-label={`${isExpanded ? 'Hide' : 'Show'} advanced filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span 
                className="ml-1 px-1.5 py-0.5 text-xs bg-white text-blue-600 rounded-full"
                aria-label={`${activeFilterCount} active filters`}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Clear All Button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          )}
        </div>
        
        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <div id={`${searchInputId}-filters`} className="sr-only">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
          </div>
        )}
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div 
          id={expandedSectionId}
          className="px-6 py-4 border-t border-gray-200 bg-gray-50"
          role="region"
          aria-labelledby={filterButtonId}
          aria-label="Advanced filters"
        >
          <div className="space-y-4">
            {/* Quick Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Quick filter options">
                {quickFilters.map(quickFilter => {
                  const Icon = quickFilter.icon;
                  const isActive = !!activeFilters[quickFilter.id];
                  
                  return (
                    <button
                      key={quickFilter.id}
                      type="button"
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 border-blue-300'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleQuickFilter(quickFilter.id)}
                      aria-pressed={isActive}
                      aria-label={`${isActive ? 'Remove' : 'Add'} ${quickFilter.label} filter`}
                    >
                      {Icon && React.createElement(Icon as any, { className: "inline h-3 w-3 mr-1" })}
                      {quickFilter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Filters */}
            {filters.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filters.map(filter => (
                  <div key={filter.id}>
                    <label 
                      htmlFor={`filter-${filter.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {filter.label}
                      {filter.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {filter.type === 'select' && filter.options && (
                      <select
                        id={`filter-${filter.id}`}
                        value={String(activeFilters[filter.id] || '')}
                        onChange={(e) => setActiveFilter(filter.id, e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-describedby={filter.placeholder ? `filter-${filter.id}-help` : undefined}
                      >
                        <option value="">{filter.placeholder || 'All'}</option>
                        {filter.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                            {option.count !== undefined && ` (${option.count})`}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {filter.type === 'multiselect' && filter.options && (
                      <fieldset>
                        <legend className="sr-only">{filter.label} options</legend>
                        <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white">
                          {filter.options.map(option => (
                            <label key={option.value} className="flex items-center text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Array.isArray(activeFilters[filter.id]) && (activeFilters[filter.id] as any[]).includes(option.value)}
                                onChange={(e) => {
                                  const current = Array.isArray(activeFilters[filter.id]) ? (activeFilters[filter.id] as any[]) : [];
                                  const newValue = e.target.checked
                                    ? [...current, option.value]
                                    : (current as any[]).filter((v: string) => v !== option.value);
                                  setActiveFilter(filter.id, newValue.length > 0 ? newValue : null);
                                }}
                                className="mr-2 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                              {option.label}
                              {option.count !== undefined && (
                                <span className="ml-1 text-xs text-gray-500">({option.count})</span>
                              )}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )}
                    
                    {filter.type === 'boolean' && (
                      <label className="flex items-center text-sm cursor-pointer">
                        <input
                          id={`filter-${filter.id}`}
                          type="checkbox"
                          checked={Boolean(activeFilters[filter.id])}
                          onChange={(e) => setActiveFilter(filter.id, e.target.checked || null)}
                          className="mr-2 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        {filter.placeholder || `Enable ${filter.label}`}
                      </label>
                    )}
                    
                    {filter.placeholder && filter.type !== 'boolean' && (
                      <p id={`filter-${filter.id}-help`} className="mt-1 text-xs text-gray-500">
                        {filter.placeholder}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Active Filter Tags */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-300">
                <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                <div className="flex flex-wrap gap-2" role="list">
                  {searchQuery && (
                    <span 
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                      role="listitem"
                    >
                      Search: "{searchQuery}"
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="hover:bg-blue-200 rounded-full p-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-label={`Remove search filter: ${searchQuery}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span 
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                      role="listitem"
                    >
                      {categories.find(c => c.value === selectedCategory)?.label}
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className="hover:bg-blue-200 rounded-full p-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-label={`Remove category filter: ${categories.find(c => c.value === selectedCategory)?.label}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {Object.entries(activeFilters).map(([key, value]) => {
                    if (!value) return null;
                    
                    const displayValue = typeof value === 'boolean' 
                      ? 'Yes' 
                      : Array.isArray(value) 
                        ? value.join(', ')
                        : String(value);
                    
                    return (
                      <span 
                        key={key}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                        role="listitem"
                      >
                        {key}: {displayValue}
                        <button
                          type="button"
                          onClick={() => setActiveFilter(key, null)}
                          className="hover:bg-blue-200 rounded-full p-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          aria-label={`Remove filter: ${key}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapped component with error boundary and performance monitoring
export default function SearchFilterBar(props: SearchFilterBarProps) {
  return (
    <SearchFilterErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <PerformanceMonitor>
        <SearchFilterBarComponent {...props} />
      </PerformanceMonitor>
    </SearchFilterErrorBoundary>
  );
}