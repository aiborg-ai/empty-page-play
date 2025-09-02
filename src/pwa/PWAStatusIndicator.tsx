/**
 * PWA Status Indicator Component
 * Shows current PWA status, connectivity, and provides quick actions
 */

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, RotateCcw, AlertTriangle, Check, Smartphone } from 'lucide-react';
import PWAService from './pwaService';

interface PWAStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

const PWAStatusIndicator: React.FC<PWAStatusIndicatorProps> = ({ 
  className = '', 
  showDetails = true 
}) => {
  const [appInfo, setAppInfo] = useState({
    isOnline: true,
    isInstalled: false,
    canInstall: false,
    updateAvailable: false,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const pwaService = PWAService.getInstance();

  useEffect(() => {
    // Initial status check
    updateAppInfo();

    // Listen for PWA events
    const handleEvents = () => updateAppInfo();

    window.addEventListener('pwa-install-available', handleEvents);
    window.addEventListener('pwa-app-installed', handleEvents);
    window.addEventListener('pwa-update-available', handleEvents);
    window.addEventListener('pwa-online-status', handleEvents);

    // Periodic status check
    const interval = setInterval(updateAppInfo, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('pwa-install-available', handleEvents);
      window.removeEventListener('pwa-app-installed', handleEvents);
      window.removeEventListener('pwa-update-available', handleEvents);
      window.removeEventListener('pwa-online-status', handleEvents);
      clearInterval(interval);
    };
  }, []);

  const updateAppInfo = () => {
    const info = pwaService.getAppInfo();
    setAppInfo(info);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await pwaService.updateServiceWorker();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInstall = async () => {
    try {
      await pwaService.showInstallPrompt();
    } catch (error) {
      console.error('Install failed:', error);
    }
  };

  const getStatusColor = () => {
    if (!appInfo.isOnline) return 'bg-red-100 text-red-600';
    if (appInfo.updateAvailable) return 'bg-orange-100 text-orange-600';
    if (appInfo.isInstalled) return 'bg-green-100 text-green-600';
    return 'bg-gray-100 text-gray-600';
  };

  const getStatusIcon = () => {
    if (!appInfo.isOnline) return WifiOff;
    if (appInfo.updateAvailable) return AlertTriangle;
    if (appInfo.isInstalled) return Check;
    return Wifi;
  };

  const getStatusText = () => {
    if (!appInfo.isOnline) return 'Offline';
    if (appInfo.updateAvailable) return 'Update Available';
    if (appInfo.isInstalled) return 'PWA Installed';
    return 'Online';
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center gap-2"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Status Indicator */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          <StatusIcon className="w-3 h-3" />
          {showDetails && <span>{getStatusText()}</span>}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          {/* Update Button */}
          {appInfo.updateAvailable && (
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="p-1 text-orange-600 hover:bg-orange-50 rounded-full"
              title="Update available - click to update"
            >
              <RotateCcw className={`w-3 h-3 ${isUpdating ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* Install Button */}
          {!appInfo.isInstalled && appInfo.canInstall && (
            <button
              onClick={handleInstall}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
              title="Install as app"
            >
              <Download className="w-3 h-3" />
            </button>
          )}

          {/* PWA Installed Indicator */}
          {appInfo.isInstalled && (
            <div className="p-1 text-green-600" title="Installed as PWA">
              <Smartphone className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>

      {/* Detailed Tooltip */}
      {showTooltip && showDetails && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs z-50">
          <div className="space-y-2">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Connection:</span>
              <div className="flex items-center gap-1">
                {appInfo.isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span className="text-green-600">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-red-500" />
                    <span className="text-red-600">Offline</span>
                  </>
                )}
              </div>
            </div>

            {/* Installation Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">PWA Status:</span>
              <div className="flex items-center gap-1">
                {appInfo.isInstalled ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-green-600">Installed</span>
                  </>
                ) : appInfo.canInstall ? (
                  <>
                    <Download className="w-3 h-3 text-blue-500" />
                    <span className="text-blue-600">Can Install</span>
                  </>
                ) : (
                  <span className="text-gray-500">Not Available</span>
                )}
              </div>
            </div>

            {/* Update Status */}
            {appInfo.updateAvailable && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Update:</span>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-orange-500" />
                  <span className="text-orange-600">Available</span>
                </div>
              </div>
            )}

            {/* Storage Info */}
            <StorageInfo />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Storage Info Component - Shows cache and storage usage
 */
const StorageInfo: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    quota: number;
  } | null>(null);

  useEffect(() => {
    const getStorageInfo = async () => {
      const pwaService = PWAService.getInstance();
      const estimate = await pwaService.getStorageEstimate();
      
      if (estimate && estimate.usage && estimate.quota) {
        setStorageInfo({
          used: estimate.usage,
          quota: estimate.quota
        });
      }
    };

    getStorageInfo();
  }, []);

  if (!storageInfo) return null;

  const usedMB = Math.round(storageInfo.used / (1024 * 1024));
  const quotaMB = Math.round(storageInfo.quota / (1024 * 1024));
  const usagePercent = (storageInfo.used / storageInfo.quota) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Storage:</span>
        <span className="text-gray-800">{usedMB}MB / {quotaMB}MB</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1">
        <div 
          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(usagePercent, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default PWAStatusIndicator;