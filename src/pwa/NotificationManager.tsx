/**
 * Notification Manager Component
 * UI for managing push notification preferences and subscriptions
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, BellOff, Clock, X, AlertTriangle, Info, Zap, Users,
  FileText, Wrench
} from 'lucide-react';
import NotificationService, { NotificationPreferences } from './notificationService';

interface NotificationManagerProps {
  className?: string;
  onClose?: () => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  className = '',
  onClose,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);

  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    initializeState();
  }, []);

  const initializeState = async () => {
    setPermission(notificationService.getPermissionStatus());
    setIsSubscribed(notificationService.isSubscribed());
    setPreferences(notificationService.getPreferences());
    
    const active = await notificationService.getActiveNotifications();
    setActiveNotifications(active);
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);
      
      if (newPermission === 'granted') {
        const subscribed = await notificationService.subscribe();
        setIsSubscribed(subscribed);
        
        if (subscribed) {
          // Show welcome notification
          await notificationService.showNotification({
            title: 'Notifications Enabled!',
            body: 'You\'ll now receive patent intelligence updates and alerts.',
            tag: 'welcome-notification',
          });
        }
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    try {
      const unsubscribed = await notificationService.unsubscribe();
      if (unsubscribed) {
        setIsSubscribed(false);
        await notificationService.clearAllNotifications();
      }
    } catch (error) {
      console.error('Failed to disable notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;
    
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    
    try {
      await notificationService.updatePreferences({ [key]: value });
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handleQuietHoursChange = async (field: 'enabled' | 'start' | 'end', value: any) => {
    if (!preferences?.quietHours) return;
    
    const updatedQuietHours = { ...preferences.quietHours, [field]: value };
    const updatedPreferences = { ...preferences, quietHours: updatedQuietHours };
    setPreferences(updatedPreferences);
    
    try {
      await notificationService.updatePreferences({ quietHours: updatedQuietHours });
    } catch (error) {
      console.error('Failed to update quiet hours:', error);
    }
  };

  const handleTestNotification = async () => {
    await notificationService.showNotification({
      title: 'Test Notification',
      body: 'This is a test notification from InnoSpot.',
      tag: 'test-notification',
      requireInteraction: false,
    });
  };

  const handleClearAll = async () => {
    await notificationService.clearAllNotifications();
    setActiveNotifications([]);
  };

  if (!notificationService.isSupported()) {
    return (
      <div className={`p-6 bg-white rounded-xl border border-gray-200 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellOff className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Notifications Not Supported
          </h3>
          <p className="text-gray-600">
            Your browser doesn't support push notifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-500">Manage your alert preferences</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Permission Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-500">
                {permission === 'granted' 
                  ? isSubscribed ? 'Active and receiving notifications' : 'Permission granted'
                  : permission === 'denied' 
                    ? 'Notifications are blocked' 
                    : 'Not enabled yet'
                }
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                permission === 'granted' && isSubscribed
                  ? 'bg-green-500' 
                  : permission === 'denied' 
                    ? 'bg-red-500' 
                    : 'bg-yellow-500'
              }`} />
              
              <button
                onClick={isSubscribed ? handleDisableNotifications : handleEnableNotifications}
                disabled={loading || permission === 'denied'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSubscribed
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isSubscribed ? (
                  'Disable'
                ) : (
                  'Enable'
                )}
              </button>
            </div>
          </div>

          {permission === 'denied' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Notifications Blocked</h4>
                  <p className="text-sm text-red-700 mt-1">
                    To enable notifications, please click on the lock/notification icon in your browser's address bar and allow notifications for this site.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        {isSubscribed && preferences && (
          <>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Notification Types</h3>
              
              <div className="space-y-4">
                {[
                  { 
                    key: 'patentAlerts' as keyof NotificationPreferences, 
                    label: 'Patent Alerts', 
                    description: 'New patents matching your interests',
                    icon: FileText,
                    color: 'blue'
                  },
                  { 
                    key: 'systemUpdates' as keyof NotificationPreferences, 
                    label: 'System Updates', 
                    description: 'Platform updates and new features',
                    icon: Zap,
                    color: 'green'
                  },
                  { 
                    key: 'collaborationInvites' as keyof NotificationPreferences, 
                    label: 'Collaboration Invites', 
                    description: 'Project invitations and team updates',
                    icon: Users,
                    color: 'purple'
                  },
                  { 
                    key: 'reportReady' as keyof NotificationPreferences, 
                    label: 'Reports Ready', 
                    description: 'Analysis reports and generated insights',
                    icon: FileText,
                    color: 'orange'
                  },
                  { 
                    key: 'maintenanceNotices' as keyof NotificationPreferences, 
                    label: 'Maintenance Notices', 
                    description: 'Scheduled maintenance and downtime',
                    icon: Wrench,
                    color: 'gray'
                  },
                  { 
                    key: 'marketing' as keyof NotificationPreferences, 
                    label: 'Marketing Updates', 
                    description: 'Product announcements and tips',
                    icon: Info,
                    color: 'pink'
                  },
                ].map(({ key, label, description, icon: IconComponent, color }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center`}>
                        <IconComponent className={`w-4 h-4 text-${color}-600`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{label}</div>
                        <div className="text-sm text-gray-500">{description}</div>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences[key] as boolean}
                        onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequency Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Frequency</h3>
              
              <div className="space-y-2">
                {[
                  { value: 'immediate', label: 'Immediate', description: 'Notify me right away' },
                  { value: 'hourly', label: 'Hourly', description: 'Bundle notifications every hour' },
                  { value: 'daily', label: 'Daily', description: 'Once per day summary' },
                  { value: 'weekly', label: 'Weekly', description: 'Weekly digest' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={preferences.frequency === option.value}
                      onChange={(e) => handlePreferenceChange('frequency', e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <h3 className="font-medium text-gray-900">Quiet Hours</h3>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={preferences.quietHours?.enabled || false}
                    onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {preferences.quietHours?.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Test and Management */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Test & Manage</h3>
                  <p className="text-sm text-gray-500">
                    {activeNotifications.length} active notification(s)
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestNotification}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Test
                  </button>
                  
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationManager;