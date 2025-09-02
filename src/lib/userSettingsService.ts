import { supabase } from './supabase';
import { UnifiedLLMService } from './llmService';
import type { 
  UserSettings, 
  UserSettingsUpdate, 
  UserSettingsHistory,
  SettingsResponse,
  ApiKeyConfig,
  SettingsSyncStatus
} from '../types/userSettings';
import { DEFAULT_USER_SETTINGS } from '../types/userSettings';

export class UserSettingsService {
  private static instance: UserSettingsService;
  private currentSettings: UserSettings | null = null;
  private syncStatus: SettingsSyncStatus = {
    lastSync: '',
    pendingChanges: false,
    autoSync: true
  };
  private eventListeners: Map<string, ((settings: UserSettings) => void)[]> = new Map();

  static getInstance(): UserSettingsService {
    if (!UserSettingsService.instance) {
      UserSettingsService.instance = new UserSettingsService();
    }
    return UserSettingsService.instance;
  }

  // Event system for settings changes
  addEventListener(event: 'settingsChanged' | 'syncStatusChanged', callback: (data: any) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  removeEventListener(event: 'settingsChanged' | 'syncStatusChanged', callback: (data: any) => void) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Get current user settings
  async getUserSettings(forceRefresh = false): Promise<UserSettings> {
    try {
      // Return cached settings if available and not forcing refresh
      if (this.currentSettings && !forceRefresh) {
        return this.currentSettings;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Try to get settings from database
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching user settings:', error);
        throw error;
      }

      let settings: UserSettings;

      if (data) {
        // Settings found in database
        settings = this.mapDatabaseToSettings(data);
      } else {
        // No settings found, create default settings
        settings = {
          ...DEFAULT_USER_SETTINGS,
          user_id: user.id
        };
        
        // Save default settings to database
        await this.saveSettingsToDatabase(settings);
      }

      this.currentSettings = settings;
      this.syncStatus.lastSync = new Date().toISOString();
      this.emit('settingsChanged', settings);

      return settings;
    } catch (error) {
      console.error('Failed to get user settings:', error);
      throw error;
    }
  }

  // Update user settings
  async updateUserSettings(updates: UserSettingsUpdate): Promise<SettingsResponse> {
    try {
      const currentSettings = await this.getUserSettings();
      const updatedSettings: UserSettings = {
        ...currentSettings,
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Save to database
      const result = await this.saveSettingsToDatabase(updatedSettings);
      
      if (result.success) {
        this.currentSettings = updatedSettings;
        
        // Update LLM service configuration if AI settings changed
        if (updates.llm_provider || updates.default_ai_model || updates.api_keys) {
          await this.syncWithLLMService(updatedSettings);
        }

        this.syncStatus.lastSync = new Date().toISOString();
        this.syncStatus.pendingChanges = false;
        
        this.emit('settingsChanged', updatedSettings);
        this.emit('syncStatusChanged', this.syncStatus);
      }

      return result;
    } catch (error) {
      console.error('Failed to update user settings:', error);
      this.syncStatus.syncError = error instanceof Error ? error.message : 'Unknown error';
      this.emit('syncStatusChanged', this.syncStatus);
      
      return {
        success: false,
        message: `Failed to update settings: ${error}`
      };
    }
  }

  // Save settings to database
  private async saveSettingsToDatabase(settings: UserSettings): Promise<SettingsResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare data for database (remove computed fields)
      const dbData = {
        ...settings,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };
      delete dbData.id;
      delete dbData.created_at;

      const { data, error } = await supabase
        .from('user_settings')
        .upsert(dbData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Settings saved successfully',
        data: this.mapDatabaseToSettings(data)
      };
    } catch (error) {
      console.error('Error saving settings to database:', error);
      return {
        success: false,
        message: `Failed to save settings: ${error}`
      };
    }
  }

  // Map database row to UserSettings interface
  private mapDatabaseToSettings(data: any): UserSettings {
    return {
      id: data.id,
      user_id: data.user_id,
      use_type: data.use_type,
      make_profile_public: data.make_profile_public,
      record_search_history: data.record_search_history,
      theme: data.theme,
      beta_features: data.beta_features,
      llm_provider: data.llm_provider,
      default_ai_model: data.default_ai_model,
      default_context_scope: data.default_context_scope,
      save_chat_history: data.save_chat_history,
      auto_clear_sensitive_data: data.auto_clear_sensitive_data,
      api_keys: data.api_keys || {},
      auto_analysis: data.auto_analysis,
      smart_suggestions: data.smart_suggestions,
      contextual_help: data.contextual_help,
      batch_processing: data.batch_processing,
      primary_analysis_model: data.primary_analysis_model,
      batch_processing_model: data.batch_processing_model,
      daily_spending_limit: data.daily_spending_limit,
      email_notifications_usage: data.email_notifications_usage,
      auto_renew_subscriptions: data.auto_renew_subscriptions,
      email_receipts: data.email_receipts,
      usage_based_billing_alerts: data.usage_based_billing_alerts,
      allow_error_reports: data.allow_error_reports,
      opt_out_analytics: data.opt_out_analytics,
      default_access_level: data.default_access_level,
      two_factor_enabled: data.two_factor_enabled,
      session_timeout: data.session_timeout,
      login_notifications: data.login_notifications,
      suspicious_activity_alerts: data.suspicious_activity_alerts,
      email_notifications: data.email_notifications,
      push_notifications: data.push_notifications,
      slack_notifications: data.slack_notifications,
      notification_frequency: data.notification_frequency,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  // Sync settings with LLM service
  private async syncWithLLMService(settings: UserSettings) {
    try {
      const llmService = UnifiedLLMService.getInstance();
      
      // Update LLM configuration
      const llmConfig = {
        provider: settings.llm_provider as any,
        apiKey: settings.api_keys[settings.llm_provider] || '',
        model: settings.default_ai_model,
        maxTokens: 4000,
        temperature: 0.7
      };

      llmService.updateConfig(llmConfig);
    } catch (error) {
      console.error('Failed to sync with LLM service:', error);
    }
  }

  // API Key management
  async updateApiKey(provider: string, apiKey: string): Promise<SettingsResponse> {
    try {
      const currentSettings = await this.getUserSettings();
      const updatedApiKeys = {
        ...currentSettings.api_keys,
        [provider]: apiKey
      };

      return await this.updateUserSettings({
        api_keys: updatedApiKeys
      });
    } catch (error) {
      return {
        success: false,
        message: `Failed to update API key: ${error}`
      };
    }
  }

  async removeApiKey(provider: string): Promise<SettingsResponse> {
    try {
      const currentSettings = await this.getUserSettings();
      const updatedApiKeys = { ...currentSettings.api_keys };
      delete updatedApiKeys[provider];

      return await this.updateUserSettings({
        api_keys: updatedApiKeys
      });
    } catch (error) {
      return {
        success: false,
        message: `Failed to remove API key: ${error}`
      };
    }
  }

  async getApiKey(provider: string): Promise<string | null> {
    try {
      const settings = await this.getUserSettings();
      return settings.api_keys[provider] || null;
    } catch (error) {
      console.error('Failed to get API key:', error);
      return null;
    }
  }

  // Get all API key configurations
  async getApiKeyConfigs(): Promise<ApiKeyConfig[]> {
    try {
      const settings = await this.getUserSettings();
      const configs: ApiKeyConfig[] = [];

      for (const [provider, key] of Object.entries(settings.api_keys)) {
        if (key) {
          configs.push({
            provider,
            key: key.substring(0, 8) + '...' + key.substring(key.length - 4), // Masked
            lastUsed: undefined, // Could be tracked in future
            isValid: undefined // Could be validated in future
          });
        }
      }

      return configs;
    } catch (error) {
      console.error('Failed to get API key configs:', error);
      return [];
    }
  }

  // Settings history
  async getSettingsHistory(limit = 50): Promise<UserSettingsHistory[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_settings_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get settings history:', error);
      return [];
    }
  }

  // Sync status
  getSyncStatus(): SettingsSyncStatus {
    return { ...this.syncStatus };
  }

  // Reset to defaults
  async resetToDefaults(): Promise<SettingsResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const defaultSettings: UserSettings = {
        ...DEFAULT_USER_SETTINGS,
        user_id: user.id
      };

      return await this.updateUserSettings(defaultSettings);
    } catch (error) {
      return {
        success: false,
        message: `Failed to reset settings: ${error}`
      };
    }
  }

  // Export settings
  async exportSettings(): Promise<UserSettings | null> {
    try {
      const settings = await this.getUserSettings();
      // Remove sensitive data from export
      const exportData = { ...settings };
      exportData.api_keys = {}; // Don't export API keys
      return exportData;
    } catch (error) {
      console.error('Failed to export settings:', error);
      return null;
    }
  }

  // Import settings (without API keys for security)
  async importSettings(settings: Partial<UserSettings>): Promise<SettingsResponse> {
    try {
      // Remove sensitive fields from import
      const safeSettings = { ...settings };
      delete safeSettings.id;
      delete safeSettings.user_id;
      delete safeSettings.created_at;
      delete safeSettings.updated_at;
      delete safeSettings.api_keys; // Don't import API keys for security

      return await this.updateUserSettings(safeSettings);
    } catch (error) {
      return {
        success: false,
        message: `Failed to import settings: ${error}`
      };
    }
  }

  // Initialize settings service
  async initialize(): Promise<void> {
    try {
      // Load user settings and sync with LLM service
      const settings = await this.getUserSettings();
      await this.syncWithLLMService(settings);

      // Set up real-time subscription for settings changes
      supabase
        .channel('user_settings_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_settings'
          },
          (payload) => {
            if (payload.new && 'user_id' in payload.new && this.currentSettings?.user_id === payload.new.user_id) {
              this.currentSettings = this.mapDatabaseToSettings(payload.new);
              this.emit('settingsChanged', this.currentSettings);
            }
          }
        )
        .subscribe();

      console.log('UserSettingsService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize UserSettingsService:', error);
    }
  }

  // Cleanup
  async cleanup(): Promise<void> {
    await supabase.removeAllChannels();
    this.eventListeners.clear();
    this.currentSettings = null;
  }
}

// Create and export singleton instance
export const userSettingsService = UserSettingsService.getInstance();