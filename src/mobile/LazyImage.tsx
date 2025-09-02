/**
 * Lazy Image Component
 * Optimized image loading with intersection observer and progressive enhancement
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageIcon, WifiOff } from 'lucide-react';

// Experimental NetworkInformation API
interface NetworkInformation {
  effectiveType?: '2g' | '3g' | '4g' | '5g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string;
  alt: string;
  placeholder?: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  containerClassName?: string;
  showPlaceholder?: boolean;
  aspectRatio?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

interface ImageState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  isInView: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  blurDataURL,
  width,
  height,
  priority = false,
  quality = 75,
  sizes,
  onLoad,
  onError,
  className = '',
  containerClassName = '',
  showPlaceholder = true,
  aspectRatio,
  objectFit = 'cover',
  ...props
}) => {
  const [imageState, setImageState] = useState<ImageState>({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    isInView: priority, // Load immediately if priority
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Setup intersection observer
  useEffect(() => {
    if (priority || imageState.isInView) return;

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px', // Start loading 50px before image comes into view
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setImageState(prev => ({ ...prev, isInView: true }));
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      });
    }, options);

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, imageState.isInView]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      isLoaded: true,
      hasError: false,
    }));
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      isLoaded: false,
      hasError: true,
    }));
    onError?.();
  }, [onError]);

  // Start loading image when in view
  useEffect(() => {
    if (imageState.isInView && !imageState.isLoaded && !imageState.hasError && isOnline) {
      setImageState(prev => ({ ...prev, isLoading: true }));
    }
  }, [imageState.isInView, imageState.isLoaded, imageState.hasError, isOnline]);

  // Generate responsive image URLs
  const generateSrcSet = useCallback((baseSrc: string): string => {
    if (!width || !height) return baseSrc;

    const breakpoints = [480, 768, 1024, 1280, 1920];
    const srcSet = breakpoints
      .filter(bp => bp <= width!)
      .map(bp => {
        const scaledHeight = Math.round((height! / width!) * bp);
        return `${baseSrc}?w=${bp}&h=${scaledHeight}&q=${quality} ${bp}w`;
      });

    return srcSet.join(', ');
  }, [width, height, quality]);

  // Calculate container dimensions
  const containerStyle: React.CSSProperties = {};
  if (aspectRatio) {
    containerStyle.aspectRatio = aspectRatio.toString();
  } else if (width && height) {
    containerStyle.aspectRatio = (width / height).toString();
  }

  // Render placeholder
  const renderPlaceholder = () => {
    if (!showPlaceholder) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
        {blurDataURL ? (
          <img
            src={blurDataURL}
            alt=""
            className={`w-full h-full object-${objectFit} filter blur-sm scale-110`}
            aria-hidden="true"
          />
        ) : placeholder ? (
          <img
            src={placeholder}
            alt=""
            className={`w-full h-full object-${objectFit} opacity-50`}
            aria-hidden="true"
          />
        ) : (
          <ImageIcon className="w-8 h-8" />
        )}
        
        {imageState.isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  };

  // Render error state
  const renderError = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
      {!isOnline ? (
        <>
          <WifiOff className="w-8 h-8 mb-2" />
          <span className="text-sm">Offline</span>
        </>
      ) : (
        <>
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-sm">Failed to load</span>
        </>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 ${containerClassName}`}
      style={containerStyle}
    >
      {/* Actual Image */}
      {imageState.isInView && !imageState.hasError && (
        <img
          ref={imgRef}
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`
            w-full h-full transition-opacity duration-300 
            ${imageState.isLoaded ? 'opacity-100' : 'opacity-0'} 
            object-${objectFit} ${className}
          `}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...props}
        />
      )}

      {/* Placeholder */}
      {(!imageState.isLoaded || imageState.isLoading) && !imageState.hasError && (
        renderPlaceholder()
      )}

      {/* Error State */}
      {imageState.hasError && renderError()}

      {/* Loading Indicator */}
      {imageState.isLoading && (
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 bg-white bg-opacity-75 rounded-full p-1">
            <div className="w-2 h-2 border border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-xs">
          <WifiOff className="w-3 h-3" />
          <span>Offline</span>
        </div>
      )}
    </div>
  );
};

// Hook for preloading images
export const useImagePreload = (srcs: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadPromises = srcs.map((src) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(src));
          resolve(src);
        };
        img.onerror = () => {
          setFailedImages(prev => new Set(prev).add(src));
          reject(src);
        };
        img.src = src;
      });
    });

    Promise.allSettled(preloadPromises);
  }, [srcs]);

  return {
    loadedImages: Array.from(loadedImages),
    failedImages: Array.from(failedImages),
    isLoaded: (src: string) => loadedImages.has(src),
    hasFailed: (src: string) => failedImages.has(src),
  };
};

// Hook for adaptive image quality based on network
export const useAdaptiveQuality = () => {
  const [quality, setQuality] = useState(75);
  const [connection, setConnection] = useState<NetworkInformation | null>(null);

  useEffect(() => {
    // @ts-ignore - NetworkInformation is experimental
    const nav = navigator as any;
    if ('connection' in nav) {
      setConnection(nav.connection);

      const updateQuality = () => {
        const conn = nav.connection;
        if (conn) {
          // Adjust quality based on connection type
          switch (conn.effectiveType) {
            case 'slow-2g':
            case '2g':
              setQuality(30);
              break;
            case '3g':
              setQuality(50);
              break;
            case '4g':
            default:
              setQuality(75);
              break;
          }
        }
      };

      updateQuality();
      nav.connection.addEventListener('change', updateQuality);

      return () => {
        nav.connection.removeEventListener('change', updateQuality);
      };
    }
  }, []);

  return {
    quality,
    connection,
    isSlowConnection: connection?.effectiveType === '2g' || (connection?.effectiveType as string) === 'slow-2g',
  };
};

export default LazyImage;