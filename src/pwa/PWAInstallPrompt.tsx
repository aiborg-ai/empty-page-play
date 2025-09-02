/**
 * PWA Install Prompt Component
 * Provides a user-friendly interface for installing the app as a PWA
 */

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import PWAService from './pwaService';

interface PWAInstallPromptProps {
  onClose?: () => void;
  className?: string;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ 
  onClose, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [appInfo, setAppInfo] = useState({
    isOnline: true,
    isInstalled: false,
    canInstall: false,
    updateAvailable: false,
  });

  const pwaService = PWAService.getInstance();

  useEffect(() => {
    // Check initial PWA status
    updateAppInfo();

    // Listen for PWA events
    const handleInstallAvailable = () => {
      updateAppInfo();
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      updateAppInfo();
      setIsVisible(false);
      if (onClose) onClose();
    };

    const handleUpdateAvailable = () => {
      updateAppInfo();
    };

    const handleOnlineStatus = (_event: CustomEvent) => {
      updateAppInfo();
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-app-installed', handleAppInstalled);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    window.addEventListener('pwa-online-status', handleOnlineStatus as EventListener);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-app-installed', handleAppInstalled);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      window.removeEventListener('pwa-online-status', handleOnlineStatus as EventListener);
    };
  }, [onClose]);

  const updateAppInfo = () => {
    const info = pwaService.getAppInfo();
    setAppInfo(info);
  };

  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const success = await pwaService.showInstallPrompt();
      if (!success) {
        // Show manual install instructions if prompt failed
        setIsInstalling(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleUpdateApp = async () => {
    try {
      await pwaService.updateServiceWorker();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  // Don't show if already installed or can't install
  if (!isVisible || appInfo.isInstalled || !appInfo.canInstall) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md mx-4 sm:mx-0 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Install InnoSpot</h3>
              <p className="text-sm text-gray-500">Add to your device</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close install prompt"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Native App Experience</p>
              <p className="text-xs text-gray-500">Full-screen app with native navigation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <WifiOff className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Offline Access</p>
              <p className="text-xs text-gray-500">Continue working without internet</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Monitor className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Desktop Integration</p>
              <p className="text-xs text-gray-500">Quick access from your home screen</p>
            </div>
          </div>
        </div>

        {/* Online Status */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          {appInfo.isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">Offline - Install for offline access</span>
            </>
          )}
        </div>

        {/* Update Available */}
        {appInfo.updateAvailable && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Update Available</p>
                <p className="text-xs text-blue-700">New features and improvements</p>
              </div>
              <button
                onClick={handleUpdateApp}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        )}

        {/* Install Button */}
        <div className="space-y-3">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isInstalling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Installing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Install App
              </>
            )}
          </button>

          <button
            onClick={handleClose}
            className="w-full text-gray-600 hover:text-gray-800 text-sm py-2"
          >
            Maybe later
          </button>
        </div>

        {/* Manual Install Instructions */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">
            <strong>Manual Install:</strong>
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Chrome/Edge: Menu → "Install InnoSpot"</p>
            <p>• Safari: Share → "Add to Home Screen"</p>
            <p>• Firefox: Menu → "Install"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;