/**
 * Push Notification Service
 * Handles push notification subscriptions, sending, and management
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  actions?: NotificationAction[];
  timestamp?: number;
  vibrate?: number[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
  deviceId?: string;
  preferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  patentAlerts: boolean;
  systemUpdates: boolean;
  collaborationInvites: boolean;
  reportReady: boolean;
  maintenanceNotices: boolean;
  marketing: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours?: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "08:00"
  };
}

class NotificationService {
  private static instance: NotificationService;
  private subscription: PushSubscription | null = null;
  private vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY'; // Replace with actual VAPID key
  private notificationQueue: NotificationOptions[] = [];
  private preferences: NotificationPreferences;

  private constructor() {
    this.preferences = this.getStoredPreferences();
    this.initializeNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification service
   */
  private async initializeNotifications(): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Push notifications are not supported');
      return;
    }

    try {
      // Request permission if not already granted
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      }

      // Try to get existing subscription
      const registration = await navigator.serviceWorker.ready;
      this.subscription = await registration.pushManager.getSubscription();

      if (this.subscription) {
        console.log('Existing push subscription found');
        await this.updateSubscriptionOnServer();
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  /**
   * Check if push notifications are supported
   */
  public isSupported(): boolean {
    return (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  }

  /**
   * Check current notification permission
   */
  public getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  /**
   * Request notification permission
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    
    if (permission === 'granted') {
      await this.subscribe();
    }
    
    return permission;
  }

  /**
   * Subscribe to push notifications
   */
  public async subscribe(): Promise<boolean> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      this.subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey) as BufferSource,
      });

      console.log('Push subscription successful:', this.subscription);
      
      // Send subscription to server
      await this.sendSubscriptionToServer();
      
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  public async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      await this.subscription.unsubscribe();
      await this.removeSubscriptionFromServer();
      this.subscription = null;
      console.log('Push subscription cancelled');
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  /**
   * Check if currently subscribed
   */
  public isSubscribed(): boolean {
    return this.subscription !== null;
  }

  /**
   * Get current subscription
   */
  public getSubscription(): PushSubscription | null {
    return this.subscription;
  }

  /**
   * Show local notification
   */
  public async showNotification(options: NotificationOptions): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      console.warn('Cannot show notification: permission not granted');
      return;
    }

    // Check if notification should be shown based on preferences
    if (!this.shouldShowNotification(options)) {
      console.log('Notification filtered by preferences');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const notificationOptions: NotificationOptions = {
        title: options.title,
        body: options.body,
        icon: options.icon || '/icons/icon-192x192.png',
        badge: options.badge || '/icons/badge-72x72.png',
        image: options.image,
        tag: options.tag || 'innospot-notification',
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        actions: options.actions || [
          {
            action: 'view',
            title: 'View Details',
            icon: '/icons/view-action.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/icons/dismiss-action.png'
          }
        ],
        timestamp: options.timestamp || Date.now(),
        vibrate: options.vibrate || [200, 100, 200],
      };

      await registration.showNotification(options.title, notificationOptions);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  /**
   * Schedule notification for later
   */
  public scheduleNotification(options: NotificationOptions, delay: number): void {
    setTimeout(() => {
      this.showNotification(options);
    }, delay);
  }

  /**
   * Queue notification for when app becomes active
   */
  public queueNotification(options: NotificationOptions): void {
    this.notificationQueue.push(options);
    this.saveNotificationQueue();
  }

  /**
   * Process queued notifications
   */
  public async processQueue(): Promise<void> {
    if (this.notificationQueue.length === 0) return;

    for (const options of this.notificationQueue) {
      await this.showNotification(options);
    }

    this.notificationQueue = [];
    this.saveNotificationQueue();
  }

  /**
   * Get notification preferences
   */
  public getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  /**
   * Update notification preferences
   */
  public async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences };
    this.savePreferences();
    
    if (this.subscription) {
      await this.updateSubscriptionOnServer();
    }
  }

  /**
   * Clear all notifications
   */
  public async clearAllNotifications(): Promise<void> {
    if (!this.isSupported()) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const notifications = await registration.getNotifications();
      
      notifications.forEach(notification => notification.close());
      console.log(`Cleared ${notifications.length} notifications`);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  /**
   * Get active notifications
   */
  public async getActiveNotifications(): Promise<Notification[]> {
    if (!this.isSupported()) return [];

    try {
      const registration = await navigator.serviceWorker.ready;
      return await registration.getNotifications();
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }

  // Private helper methods

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(): Promise<void> {
    if (!this.subscription) return;

    const subscriptionData: NotificationSubscription = {
      endpoint: this.subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(this.subscription.getKey('p256dh')!),
        auth: arrayBufferToBase64(this.subscription.getKey('auth')!),
      },
      userId: this.getCurrentUserId(),
      deviceId: this.getDeviceId(),
      preferences: this.preferences,
    };

    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription on server');
      }

      console.log('Subscription saved on server');
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  private async updateSubscriptionOnServer(): Promise<void> {
    // Similar to sendSubscriptionToServer but with PUT method
    await this.sendSubscriptionToServer();
  }

  private async removeSubscriptionFromServer(): Promise<void> {
    if (!this.subscription) return;

    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: this.subscription.endpoint,
          userId: this.getCurrentUserId(),
        }),
      });

      if (response.ok) {
        console.log('Subscription removed from server');
      }
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
    }
  }

  private shouldShowNotification(options: NotificationOptions): boolean {
    // Check quiet hours
    if (this.preferences.quietHours?.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const { start, end } = this.preferences.quietHours;
      
      if (this.isTimeInRange(currentTime, start, end)) {
        return false;
      }
    }

    // Check specific preferences based on notification type
    const tag = options.tag || '';
    
    if (tag.includes('patent') && !this.preferences.patentAlerts) return false;
    if (tag.includes('system') && !this.preferences.systemUpdates) return false;
    if (tag.includes('collaboration') && !this.preferences.collaborationInvites) return false;
    if (tag.includes('report') && !this.preferences.reportReady) return false;
    if (tag.includes('maintenance') && !this.preferences.maintenanceNotices) return false;
    if (tag.includes('marketing') && !this.preferences.marketing) return false;

    return true;
  }

  private isTimeInRange(time: string, start: string, end: string): boolean {
    const [currentHour, currentMin] = time.split(':').map(Number);
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    const currentMinutes = currentHour * 60 + currentMin;
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  }

  private getCurrentUserId(): string | undefined {
    // This should integrate with your auth system
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return user?.id;
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  private getStoredPreferences(): NotificationPreferences {
    const stored = localStorage.getItem('notificationPreferences');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default preferences
    return {
      patentAlerts: true,
      systemUpdates: true,
      collaborationInvites: true,
      reportReady: true,
      maintenanceNotices: false,
      marketing: false,
      frequency: 'immediate',
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
    };
  }

  private savePreferences(): void {
    localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
  }

  private saveNotificationQueue(): void {
    localStorage.setItem('notificationQueue', JSON.stringify(this.notificationQueue));
  }

  // private _loadNotificationQueue(): void { // Unused - queue loading happens on demand
  //   const stored = localStorage.getItem('notificationQueue');
  //   if (stored) {
  //     this.notificationQueue = JSON.parse(stored);
  //   }
  // }
}

// Utility function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default NotificationService;