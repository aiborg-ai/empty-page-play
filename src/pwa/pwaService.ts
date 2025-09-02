/**
 * PWA Service - Manages Progressive Web App functionality
 * Handles service worker registration, updates, and PWA features
 */

export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  outcome: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

// Extend ServiceWorkerRegistration for experimental features
interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
}

class PWAService {
  private static instance: PWAService;
  private registration: ExtendedServiceWorkerRegistration | null = null;
  private installPrompt: BeforeInstallPromptEvent | null = null;
  private isOnline: boolean = navigator.onLine;
  private updateAvailable: boolean = false;

  private constructor() {
    this.initializeServiceWorker();
    this.setupEventListeners();
  }

  public static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  /**
   * Initialize service worker registration
   */
  private async initializeServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        console.log('Registering service worker...');
        
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        }) as ExtendedServiceWorkerRegistration;

        console.log('Service worker registered successfully:', this.registration.scope);

        // Handle service worker updates
        this.registration.addEventListener('updatefound', () => {
          console.log('New service worker available');
          this.handleServiceWorkerUpdate();
        });

        // Check for existing service worker updates
        if (this.registration.waiting) {
          this.updateAvailable = true;
          this.notifyUpdateAvailable();
        }

      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    } else {
      console.log('Service workers not supported');
    }
  }

  /**
   * Setup PWA event listeners
   */
  private setupEventListeners(): void {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      console.log('PWA install prompt available');
      event.preventDefault();
      this.installPrompt = event as BeforeInstallPromptEvent;
      this.notifyInstallAvailable();
    });

    // Listen for successful app install
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      this.installPrompt = null;
      this.notifyAppInstalled();
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyOnlineStatus(false);
    });

    // Listen for visibility changes (for background sync)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.triggerBackgroundSync();
      }
    });
  }

  /**
   * Handle service worker updates
   */
  private handleServiceWorkerUpdate(): void {
    if (!this.registration) return;

    const newWorker = this.registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        console.log('New service worker installed');
        this.updateAvailable = true;
        this.notifyUpdateAvailable();
      }
    });
  }

  /**
   * Show PWA install prompt
   */
  public async showInstallPrompt(): Promise<boolean> {
    if (!this.installPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const choice = await this.installPrompt.userChoice;
      
      console.log('User choice:', choice.outcome);
      
      if (choice.outcome === 'accepted') {
        console.log('User accepted PWA install');
        return true;
      } else {
        console.log('User dismissed PWA install');
        return false;
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  }

  /**
   * Check if PWA can be installed
   */
  public canInstall(): boolean {
    return this.installPrompt !== null;
  }

  /**
   * Check if app is installed as PWA
   */
  public isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.matchMedia('(display-mode: fullscreen)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Update service worker
   */
  public async updateServiceWorker(): Promise<void> {
    if (!this.registration || !this.registration.waiting) return;

    // Send message to waiting service worker to skip waiting
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Listen for controlling service worker change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker updated successfully');
      window.location.reload();
    });
  }

  /**
   * Check for service worker updates
   */
  public async checkForUpdates(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
      console.log('Checked for service worker updates');
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }

  /**
   * Get app info for PWA
   */
  public getAppInfo(): {
    isOnline: boolean;
    isInstalled: boolean;
    canInstall: boolean;
    updateAvailable: boolean;
  } {
    return {
      isOnline: this.isOnline,
      isInstalled: this.isInstalled(),
      canInstall: this.canInstall(),
      updateAvailable: this.updateAvailable,
    };
  }

  /**
   * Register background sync
   */
  public async registerBackgroundSync(tag: string): Promise<void> {
    if (!this.registration || !this.registration.sync) {
      console.log('Background sync not supported');
      return;
    }

    try {
      await this.registration.sync.register(tag);
      console.log(`Background sync registered: ${tag}`);
    } catch (error) {
      console.error(`Failed to register background sync: ${tag}`, error);
    }
  }

  /**
   * Trigger background sync manually
   */
  private triggerBackgroundSync(): void {
    if (this.isOnline) {
      this.registerBackgroundSync('background-data-sync');
    }
  }

  /**
   * Cache important resources
   */
  public async cacheResources(urls: string[]): Promise<void> {
    if (!('caches' in window)) {
      console.log('Cache API not supported');
      return;
    }

    try {
      const cache = await caches.open('innospot-manual-cache');
      await cache.addAll(urls);
      console.log('Resources cached successfully');
    } catch (error) {
      console.error('Failed to cache resources:', error);
    }
  }

  /**
   * Clear app cache
   */
  public async clearCache(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache storage estimate
   */
  public async getStorageEstimate(): Promise<StorageEstimate | null> {
    if (!('storage' in navigator) || !navigator.storage.estimate) {
      return null;
    }

    try {
      return await navigator.storage.estimate();
    } catch (error) {
      console.error('Failed to get storage estimate:', error);
      return null;
    }
  }

  // Event notification methods (to be used with custom events)
  private notifyInstallAvailable(): void {
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  }

  private notifyAppInstalled(): void {
    window.dispatchEvent(new CustomEvent('pwa-app-installed'));
  }

  private notifyUpdateAvailable(): void {
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  private notifyOnlineStatus(isOnline: boolean): void {
    window.dispatchEvent(new CustomEvent('pwa-online-status', { 
      detail: { isOnline } 
    }));
  }
}

export default PWAService;