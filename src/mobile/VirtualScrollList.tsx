/**
 * Virtual Scroll List Component
 * Efficiently renders large lists by only rendering visible items
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { List, Grid, RowComponentProps, CellComponentProps } from 'react-window';

// Type aliases for backwards compatibility
type ListChildComponentProps = RowComponentProps;
type GridChildComponentProps = CellComponentProps;

export interface VirtualScrollListProps<T = any> {
  items: T[];
  itemHeight: number | ((index: number) => number);
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  width?: number | string;
  height: number;
  overscanCount?: number;
  className?: string;
  onItemsRendered?: (items: { startIndex: number; endIndex: number }) => void;
  onScroll?: (scrollTop: number) => void;
  scrollToIndex?: number;
  scrollToAlignment?: 'auto' | 'smart' | 'center' | 'start' | 'end';
  initialScrollTop?: number;
  innerElementType?: React.ElementType;
  outerElementType?: React.ElementType;
  estimatedItemSize?: number;
}

export interface VirtualGridProps<T = any> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  columnCount: number;
  renderItem: (item: T, columnIndex: number, rowIndex: number, style: React.CSSProperties) => React.ReactNode;
  width: number;
  height: number;
  overscanCount?: number;
  className?: string;
}

// Fixed size virtual list
export const VirtualScrollList = <T,>({
  items,
  itemHeight,
  renderItem,
  width = '100%',
  height,
  overscanCount = 5,
  className = '',
  onItemsRendered,
  // onScroll, // Not used in react-window v2 API
  scrollToIndex,
  scrollToAlignment = 'auto',
  // initialScrollTop = 0, // Not supported in react-window v2
  // innerElementType, // Not supported in react-window v2
  // outerElementType, // Not supported in react-window v2
}: VirtualScrollListProps<T>) => {
  const listRef = useRef<any>(null); // react-window v2 List ref type
  const [isScrolling] = useState(false); // Removed setIsScrolling - not used in v2
  // const scrollTimeoutRef = useRef<NodeJS.Timeout>(); // Not needed without scroll handler

  // Handle scroll events - Not used in react-window v2
  // const handleScroll = useCallback(({ scrollTop }: { scrollTop: number }) => {
  //   onScroll?.(scrollTop);
  //   setIsScrolling(true);

  //   // Clear existing timeout
  //   if (scrollTimeoutRef.current) {
  //     clearTimeout(scrollTimeoutRef.current);
  //   }

  //   // Set scrolling to false after scroll ends
  //   scrollTimeoutRef.current = setTimeout(() => {
  //     setIsScrolling(false);
  //   }, 150);
  // }, [onScroll]);

  // Handle items rendered
  const handleItemsRendered = useCallback(({ visibleStartIndex, visibleStopIndex }: any) => {
    onItemsRendered?.({ startIndex: visibleStartIndex, endIndex: visibleStopIndex });
  }, [onItemsRendered]);

  // Scroll to specific index
  useEffect(() => {
    if (typeof scrollToIndex === 'number' && listRef.current) {
      listRef.current.scrollToItem(scrollToIndex, scrollToAlignment);
    }
  }, [scrollToIndex, scrollToAlignment]);

  // Item renderer wrapper
  const ItemRenderer = useCallback(({ index, style }: ListChildComponentProps) => {
    const item = items[index];
    if (!item) return null;

    return (
      <div style={style} className="virtual-list-item">
        {renderItem(item, index, style)}
      </div>
    );
  }, [items, renderItem]);

  // Use List for dynamic heights (react-window v2 unified API)
  if (typeof itemHeight === 'function') {
    return (
      <div className={`virtual-scroll-container ${className}`}>
        <List
          listRef={listRef}
          defaultHeight={height}
          rowCount={items.length}
          rowHeight={itemHeight}
          overscanCount={overscanCount}
          onRowsRendered={handleItemsRendered}
          rowComponent={ItemRenderer}
          rowProps={{}} // Empty props object as required by API
          style={{ width, height }}
        />
      </div>
    );
  }

  // Use FixedSizeList for consistent heights
  return (
    <div className={`virtual-scroll-container ${isScrolling ? 'scrolling' : ''} ${className}`}>
      <List
        listRef={listRef}
        defaultHeight={height}
        rowCount={items.length}
        rowHeight={itemHeight as number}
        overscanCount={overscanCount}
        onRowsRendered={handleItemsRendered}
        rowComponent={ItemRenderer}
        rowProps={{}} // Empty props object as required by API
        style={{ width, height }}
      />
    </div>
  );
};

// Virtual grid for grid layouts
export const VirtualGrid = <T,>({
  items,
  itemWidth,
  itemHeight,
  columnCount,
  renderItem,
  width,
  height,
  overscanCount = 5,
  className = '',
}: VirtualGridProps<T>) => {
  const gridRef = useRef<any>(null); // react-window v2 Grid ref type
  const rowCount = Math.ceil(items.length / columnCount);

  // Grid item renderer
  const GridItemRenderer = useCallback(({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
    const index = rowIndex * columnCount + columnIndex;
    const item = items[index];
    
    if (!item) return null;

    return (
      <div style={style} className="virtual-grid-item">
        {renderItem(item, columnIndex, rowIndex, style)}
      </div>
    );
  }, [items, columnCount, renderItem]);

  return (
    <div className={`virtual-grid-container ${className}`}>
      <Grid
        gridRef={gridRef}
        columnCount={columnCount}
        rowCount={rowCount}
        columnWidth={itemWidth}
        rowHeight={itemHeight}
        defaultWidth={width}
        defaultHeight={height}
        overscanCount={overscanCount}
        cellComponent={GridItemRenderer}
        cellProps={{}} // Empty props object as required by API
        style={{ width, height }}
      />
    </div>
  );
};

// Hook for virtual scrolling with dynamic data
export const useVirtualScroll = <T,>(
  items: T[],
  containerHeight: number,
  itemHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + 2
    );

    setVisibleRange({ start: startIndex, end: endIndex });

    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight,
    }));
  }, [items, scrollTop, containerHeight, itemHeight]);

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    scrollTop,
    visibleRange,
    setScrollTop,
  };
};

// Custom hook for infinite loading with virtual scroll
export const useVirtualInfiniteScroll = <T,>(
  items: T[],
  loadMore: () => Promise<void>,
  hasMore: boolean,
  threshold: number = 0.8
) => {
  const [isLoading, setIsLoading] = useState(false);
  const lastLoadRef = useRef(0);

  const handleItemsRendered = useCallback(
    async ({ endIndex }: { startIndex: number; endIndex: number }) => {
      // Check if we should load more items
      const shouldLoadMore = 
        hasMore &&
        !isLoading &&
        endIndex >= items.length * threshold &&
        Date.now() - lastLoadRef.current > 1000; // Debounce by 1 second

      if (shouldLoadMore) {
        setIsLoading(true);
        lastLoadRef.current = Date.now();
        
        try {
          await loadMore();
        } catch (error) {
          console.error('Failed to load more items:', error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [hasMore, isLoading, items.length, threshold, loadMore]
  );

  return {
    isLoading,
    handleItemsRendered,
  };
};

// Optimized list item component
export const VirtualListItem: React.FC<{
  children: React.ReactNode;
  style: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}> = React.memo(({ children, style, className = '', onClick }) => {
  return (
    <div
      style={style}
      className={`virtual-list-item-wrapper ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

VirtualListItem.displayName = 'VirtualListItem';

// Performance monitoring hook
export const useVirtualScrollPerformance = (itemCount: number) => {
  const [renderTime, setRenderTime] = useState(0);
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let animationFrame: number;

    const measurePerformance = (currentTime: number) => {
      frameCountRef.current++;
      const timeDiff = currentTime - lastTimeRef.current;

      if (timeDiff >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / timeDiff));
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationFrame = requestAnimationFrame(measurePerformance);
    };

    const startTime = performance.now();
    animationFrame = requestAnimationFrame(measurePerformance);

    // Measure initial render time
    setTimeout(() => {
      setRenderTime(performance.now() - startTime);
    }, 100);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [itemCount]);

  return {
    renderTime,
    fps,
    isPerformanceGood: fps > 30 && renderTime < 100,
  };
};

export default VirtualScrollList;