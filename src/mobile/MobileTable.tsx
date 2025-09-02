/**
 * Mobile-Optimized Table Component
 * Responsive table design that transforms into card layout on mobile
 */

import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, ChevronUp, Search, Filter, MoreHorizontal, 
  ArrowUpDown, Eye, Share2, Bookmark
} from 'lucide-react';

export interface MobileTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
  mobileRender?: (value: any, row: any) => React.ReactNode;
  showOnMobile?: boolean;
  priority?: number; // Higher number = higher priority on mobile
}

export interface MobileTableProps {
  data: any[];
  columns: MobileTableColumn[];
  onRowClick?: (row: any, index: number) => void;
  onRowAction?: (action: string, row: any, index: number) => void;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  mobileBreakpoint?: number;
}

type SortOrder = 'asc' | 'desc' | null;

const MobileTable: React.FC<MobileTableProps> = ({
  data,
  columns,
  onRowClick,
  onRowAction,
  searchable = true,
  filterable = false,
  sortable = true,
  pageSize = 20,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  mobileBreakpoint = 768,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < mobileBreakpoint);

  // Listen for window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < mobileBreakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = data.filter(row => {
        return columns.some(column => {
          const value = row[column.key];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply sorting
    if (sortColumn && sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, columns, searchTerm, sortColumn, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Mobile columns (prioritized)
  const mobileColumns = useMemo(() => {
    return columns
      .filter(col => col.showOnMobile !== false)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, 3); // Show max 3 columns on mobile
  }, [columns]);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    if (sortColumn === columnKey) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
      if (sortOrder === 'desc') {
        setSortColumn(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortOrder('asc');
    }
  };

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const renderMobileCard = (row: any, index: number) => {
    const actualIndex = currentPage * pageSize + index;
    const isExpanded = expandedRows.has(actualIndex);

    return (
      <div key={actualIndex} className="bg-white rounded-lg border border-gray-200 mb-3 overflow-hidden">
        {/* Main content - always visible */}
        <div
          onClick={() => onRowClick?.(row, actualIndex)}
          className="p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
        >
          <div className="space-y-3">
            {/* Primary column (most important) */}
            {mobileColumns[0] && (
              <div>
                <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
                  {mobileColumns[0].mobileRender 
                    ? mobileColumns[0].mobileRender(row[mobileColumns[0].key], row)
                    : mobileColumns[0].render 
                      ? mobileColumns[0].render(row[mobileColumns[0].key], row)
                      : row[mobileColumns[0].key]
                  }
                </h3>
              </div>
            )}

            {/* Secondary columns */}
            <div className="grid grid-cols-2 gap-4">
              {mobileColumns.slice(1, 3).map(column => (
                <div key={column.key}>
                  <div className="text-xs text-gray-500 mb-1">{column.label}</div>
                  <div className="text-sm text-gray-900">
                    {column.mobileRender 
                      ? column.mobileRender(row[column.key], row)
                      : column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key] || '—'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expand/Collapse button */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRowAction?.('view', row, actualIndex);
                }}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRowAction?.('share', row, actualIndex);
                }}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRowAction?.('bookmark', row, actualIndex);
                }}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
            
            {columns.length > mobileColumns.length && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRowExpansion(actualIndex);
                }}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                {isExpanded ? (
                  <>
                    <span>Less</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>More</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-gray-100 bg-gray-50 p-4">
            <div className="grid grid-cols-1 gap-3">
              {columns.filter(col => !mobileColumns.includes(col)).map(column => (
                <div key={column.key} className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">{column.label}:</span>
                  <span className="text-sm text-gray-900 text-right flex-1 ml-4">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key] || '—'
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDesktopTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable && sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => column.sortable && sortable && handleSort(column.key)}
                style={{ width: column.width }}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortable && (
                    <div className="flex flex-col">
                      {sortColumn === column.key ? (
                        sortOrder === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : sortOrder === 'desc' ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
            <th className="relative px-4 py-3 w-12">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((row, index) => {
            const actualIndex = currentPage * pageSize + index;
            return (
              <tr
                key={actualIndex}
                onClick={() => onRowClick?.(row, actualIndex)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                {columns.map(column => (
                  <td
                    key={column.key}
                    className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key] || '—'
                    }
                  </td>
                ))}
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Show action menu
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="mb-4 space-y-3">
          {searchable && (
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          {filterable && (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filters</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table/Cards */}
      {processedData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">📭</div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {isMobileView ? (
            <div className="space-y-3">
              {paginatedData.map((row, index) => renderMobileCard(row, index))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {renderDesktopTable()}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, processedData.length)} of {processedData.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileTable;