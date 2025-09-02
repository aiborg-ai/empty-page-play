/**
 * Adaptive Loader Component
 * Adjusts loading behavior based on network conditions and device capabilities
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wifi, WifiOff, ZapOff, AlertTriangle, CheckCircle } from 'lucide-react';

interface NetworkInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface DeviceInfo {
  memory: number;
  hardwareConcurrency: number;
  isMobile: boolean;
  isLowPower: boolean;
}

interface AdaptiveLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minLoadTime?: number;
  maxLoadTime?: number;
  enableNetworkAdaptation?: boolean;
  enableDeviceAdaptation?: boolean;
  onLoadingStateChange?: (isLoading: boolean) => void;
  className?: string;
}

interface LoadingStrategy {
  batchSize: number;
  delayBetweenBatches: number;
  prefetchNext: boolean;
  useWebP: boolean;
  quality: number;
  enableCaching: boolean;
}

const AdaptiveLoader: React.FC<AdaptiveLoaderProps> = ({
  children,
  fallback,
  minLoadTime = 0,
  maxLoadTime = 10000,
  enableNetworkAdaptation = true,
  enableDeviceAdaptation = true,
  onLoadingStateChange,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [loadingStrategy, setLoadingStrategy] = useState<LoadingStrategy>({
    batchSize: 10,
    delayBetweenBatches: 100,
    prefetchNext: true,
    useWebP: true,
    quality: 75,
    enableCaching: true,
  });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadingStartTime = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Detect network conditions
  useEffect(() => {
    if (!enableNetworkAdaptation) return;

    const updateNetworkInfo = () => {
      // @ts-ignore - NetworkInformation is experimental
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      if (connection) {
        setNetworkInfo({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 50,
          saveData: connection.saveData || false,
        });
      }
    };

    updateNetworkInfo();

    // @ts-ignore
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, [enableNetworkAdaptation]);

  // Detect device capabilities
  useEffect(() => {
    if (!enableDeviceAdaptation) return;

    const detectDevice = () => {
      // @ts-ignore - deviceMemory is experimental
      const memory = (navigator as any).deviceMemory || 4;
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const userAgent = navigator.userAgent;
      const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
      
      // Detect low-power mode (iOS Safari)
      const isLowPower = 'getBattery' in navigator ? false : false; // Simplified for now

      setDeviceInfo({
        memory,
        hardwareConcurrency,
        isMobile,
        isLowPower,
      });
    };

    detectDevice();
  }, [enableDeviceAdaptation]);

  // Adapt loading strategy based on conditions
  useEffect(() => {
    if (!networkInfo && !deviceInfo) return;

    const adaptStrategy = () => {
      let newStrategy: LoadingStrategy = { ...loadingStrategy };

      // Network-based adaptations
      if (networkInfo) {
        switch (networkInfo.effectiveType) {
          case 'slow-2g':
          case '2g':
            newStrategy = {
              batchSize: 3,
              delayBetweenBatches: 500,
              prefetchNext: false,
              useWebP: true,
              quality: 30,
              enableCaching: true,
            };
            break;
          case '3g':
            newStrategy = {
              batchSize: 5,
              delayBetweenBatches: 200,
              prefetchNext: false,
              useWebP: true,
              quality: 50,
              enableCaching: true,
            };
            break;
          case '4g':
          default:
            newStrategy = {
              batchSize: 15,
              delayBetweenBatches: 50,
              prefetchNext: true,
              useWebP: true,
              quality: 75,
              enableCaching: true,
            };
            break;
        }

        // Adjust for save data mode
        if (networkInfo.saveData) {
          newStrategy.batchSize = Math.max(1, Math.floor(newStrategy.batchSize / 2));
          newStrategy.quality = Math.max(20, newStrategy.quality - 25);
          newStrategy.prefetchNext = false;
        }
      }

      // Device-based adaptations
      if (deviceInfo) {
        // Low memory devices
        if (deviceInfo.memory < 2) {
          newStrategy.batchSize = Math.max(1, Math.floor(newStrategy.batchSize / 2));
          newStrategy.enableCaching = false;
        }

        // Low-power mode
        if (deviceInfo.isLowPower) {
          newStrategy.delayBetweenBatches *= 2;
          newStrategy.prefetchNext = false;
        }

        // Mobile devices
        if (deviceInfo.isMobile) {
          newStrategy.quality = Math.max(30, newStrategy.quality - 10);
        }
      }

      setLoadingStrategy(newStrategy);
    };

    adaptStrategy();
  }, [networkInfo, deviceInfo, loadingStrategy]);

  // Simulate loading with progress
  const simulateLoading = useCallback(async () => {
    const startTime = Date.now();
    let progress = 0;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const estimatedTotal = Math.max(minLoadTime, Math.min(maxLoadTime, 
        networkInfo?.effectiveType === 'slow-2g' ? 5000 :
        networkInfo?.effectiveType === '2g' ? 3000 :
        networkInfo?.effectiveType === '3g' ? 2000 : 1000
      ));

      progress = Math.min(95, (elapsed / estimatedTotal) * 100);
      setLoadingProgress(progress);

      if (elapsed < estimatedTotal && progress < 95) {
        requestAnimationFrame(updateProgress);
      } else {
        // Complete loading
        setLoadingProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          onLoadingStateChange?.(false);
        }, 100);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [networkInfo, minLoadTime, maxLoadTime, onLoadingStateChange]);

  // Start loading simulation
  useEffect(() => {
    loadingStartTime.current = Date.now();
    setIsLoading(true);
    setError(null);
    onLoadingStateChange?.(true);

    // Set maximum timeout
    timeoutRef.current = setTimeout(() => {
      setError('Loading timeout - please check your connection');
      setIsLoading(false);
      onLoadingStateChange?.(false);
    }, maxLoadTime);

    simulateLoading();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [simulateLoading, maxLoadTime, onLoadingStateChange]);

  // Render loading state
  if (isLoading || error) {
    return (
      <div className={`adaptive-loader ${className}`}>
        {fallback || (
          <AdaptiveLoadingIndicator
            progress={loadingProgress}
            networkInfo={networkInfo}
            deviceInfo={deviceInfo}
            strategy={loadingStrategy}
            error={error}
            onRetry={() => window.location.reload()}
          />
        )}
      </div>
    );
  }

  return <>{children}</>;
};

// Adaptive Loading Indicator Component
interface AdaptiveLoadingIndicatorProps {
  progress: number;
  networkInfo: NetworkInfo | null;
  deviceInfo: DeviceInfo | null;
  strategy: LoadingStrategy;
  error: string | null;
  onRetry: () => void;
}

const AdaptiveLoadingIndicator: React.FC<AdaptiveLoadingIndicatorProps> = ({
  progress,
  networkInfo,
  deviceInfo,
  strategy,
  error,
  onRetry,
}) => {
  const getConnectionIcon = () => {
    if (!networkInfo) return Wifi;
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return WifiOff;
      case '3g':
        return AlertTriangle;
      default:
        return Wifi;
    }
  };

  const getConnectionColor = () => {
    if (!networkInfo) return 'text-gray-400';
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'text-red-500';
      case '3g':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const ConnectionIcon = getConnectionIcon();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      {/* Main Loading Spinner */}
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full">
          <div 
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
            style={{
              animationDuration: networkInfo?.effectiveType === 'slow-2g' ? '2s' : '1s'
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading Message */}
      <p className="text-gray-600 mb-4">
        {progress < 30 ? 'Initializing...' :
         progress < 60 ? 'Loading content...' :
         progress < 90 ? 'Almost ready...' : 'Finishing up...'}
      </p>

      {/* Network & Device Info */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        {/* Network Status */}
        <div className="flex items-center gap-1">
          <ConnectionIcon className={`w-4 h-4 ${getConnectionColor()}`} />
          <span>
            {networkInfo?.effectiveType ? networkInfo.effectiveType.toUpperCase() : 'Unknown'}
          </span>
          {networkInfo?.saveData && (
            <div className="flex items-center gap-1 ml-2">
              <ZapOff className="w-3 h-3 text-orange-500" />
              <span className="text-orange-600">Save Data</span>
            </div>
          )}
        </div>

        {/* Device Info */}
        {deviceInfo && (
          <div className="flex items-center gap-1">
            {deviceInfo.isLowPower && (
              <>
                <ZapOff className="w-4 h-4 text-orange-500" />
                <span className="text-orange-600">Low Power</span>
              </>
            )}
            {deviceInfo.memory < 2 && (
              <span className="text-orange-600 ml-2">Low Memory</span>
            )}
          </div>
        )}
      </div>

      {/* Optimization Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Optimizing for your device</span>
        </div>
        <div className="text-xs text-blue-600 space-y-1">
          <div>Quality: {strategy.quality}% • Batch: {strategy.batchSize} items</div>
          {!strategy.prefetchNext && <div>Prefetch disabled to save data</div>}
          {strategy.useWebP && <div>Using WebP format for smaller files</div>}
        </div>
      </div>
    </div>
  );
};

// Hook for adaptive loading
export const useAdaptiveLoading = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    // Detect network
    const updateNetworkInfo = () => {
      // @ts-ignore
      const connection = (navigator as any).connection;
      if (connection) {
        setNetworkInfo({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 50,
          saveData: connection.saveData || false,
        });
      }
    };

    // Detect device
    const detectDevice = () => {
      setDeviceInfo({
        // @ts-ignore
        memory: (navigator as any).deviceMemory || 4,
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
        isMobile: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent),
        isLowPower: false, // Simplified
      });
    };

    updateNetworkInfo();
    detectDevice();

    // @ts-ignore
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  const shouldUseOptimizations = useCallback(() => {
    return (
      networkInfo?.effectiveType === 'slow-2g' ||
      networkInfo?.effectiveType === '2g' ||
      networkInfo?.saveData ||
      (deviceInfo?.memory && deviceInfo.memory < 2) ||
      deviceInfo?.isLowPower
    );
  }, [networkInfo, deviceInfo]);

  return {
    networkInfo,
    deviceInfo,
    shouldUseOptimizations: shouldUseOptimizations(),
    getOptimalImageQuality: () => {
      if (!networkInfo) return 75;
      switch (networkInfo.effectiveType) {
        case 'slow-2g':
        case '2g':
          return 30;
        case '3g':
          return 50;
        default:
          return 75;
      }
    },
    getOptimalBatchSize: () => {
      if (!networkInfo) return 10;
      switch (networkInfo.effectiveType) {
        case 'slow-2g':
        case '2g':
          return 3;
        case '3g':
          return 5;
        default:
          return 15;
      }
    },
  };
};

export default AdaptiveLoader;