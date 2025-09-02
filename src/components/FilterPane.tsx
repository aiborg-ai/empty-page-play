import React from 'react';
import { 
  X, 
  Filter, 
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'date' | 'select';
  options?: Array<{ value: string; label: string; count?: number }>;
  value?: any;
  min?: number;
  max?: number;
  icon?: React.ElementType;
}

export interface FilterSection {
  id: string;
  title: string;
  icon: React.ElementType;
  filters: FilterOption[];
  isExpanded?: boolean;
}

interface FilterPaneProps {
  isOpen: boolean;
  onClose: () => void;
  sections: FilterSection[];
  onFilterChange: (sectionId: string, filterId: string, value: any) => void;
  onReset: () => void;
  activeFiltersCount?: number;
  className?: string;
}

const FilterPane: React.FC<FilterPaneProps> = ({
  isOpen,
  onClose,
  sections,
  onFilterChange,
  onReset,
  activeFiltersCount = 0,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(sections.filter(s => s.isExpanded !== false).map(s => s.id))
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderFilter = (section: FilterSection, filter: FilterOption) => {
    switch (filter.type) {
      case 'checkbox':
        return (
          <div key={filter.id} className="space-y-2">
            {filter.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={filter.value?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = filter.value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    onFilterChange(section.id, filter.id, newValues);
                  }}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                {option.count !== undefined && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {option.count}
                  </span>
                )}
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div key={filter.id} className="space-y-2">
            {filter.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="radio"
                  name={`${section.id}-${filter.id}`}
                  checked={filter.value === option.value}
                  onChange={() => onFilterChange(section.id, filter.id, option.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                {option.count !== undefined && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {option.count}
                  </span>
                )}
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div key={filter.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{filter.label}</span>
              <span className="font-medium text-gray-900">
                {filter.value || filter.min} - {filter.max}
              </span>
            </div>
            <input
              type="range"
              min={filter.min || 0}
              max={filter.max || 100}
              value={filter.value || filter.min || 0}
              onChange={(e) => onFilterChange(section.id, filter.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{filter.min || 0}</span>
              <span>{filter.max || 100}</span>
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="text-sm text-gray-600">{filter.label}</label>
            <input
              type="date"
              value={filter.value || ''}
              onChange={(e) => onFilterChange(section.id, filter.id, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'select':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="text-sm text-gray-600">{filter.label}</label>
            <select
              value={filter.value || ''}
              onChange={(e) => onFilterChange(section.id, filter.id, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              {filter.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sections.map(section => {
              const SectionIcon = section.icon;
              const isExpanded = expandedSections.has(section.id);

              return (
                <div key={section.id} className="space-y-3">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <SectionIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{section.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="space-y-3 pl-6">
                      {section.filters.map(filter => renderFilter(section, filter))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Apply Button */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {activeFiltersCount > 0 
                ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`
                : 'No filters applied'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPane;