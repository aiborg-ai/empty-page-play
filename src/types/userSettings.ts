// TypeScript interfaces for user settings

export interface UserSettings {
  id?: string;
  user_id: string;
  
  // Account Settings
  use_type: 'non-commercial' | 'commercial';
  make_profile_public: boolean;
  record_search_history: boolean;
  
  // Interface Settings
  theme: 'light' | 'dark' | 'vanilla' | 'contrast';
  beta_features: boolean;
  
  // AI Settings
  llm_provider: 'openai' | 'openrouter' | 'anthropic' | 'google' | 'cohere';
  default_ai_model?: string;
  default_context_scope: 'search-results' | 'projects' | 'reports' | 'dashboards' | 'patent-corpus';
  save_chat_history: boolean;
  auto_clear_sensitive_data: boolean;
  
  // API Keys (stored as encrypted JSON)
  api_keys: Record<string, string>;
  
  // Agent Settings
  auto_analysis: boolean;
  smart_suggestions: boolean;
  contextual_help: boolean;
  batch_processing: boolean;
  primary_analysis_model?: string;
  batch_processing_model?: string;
  daily_spending_limit: number;
  email_notifications_usage: boolean;
  
  // Payment & Billing Settings
  auto_renew_subscriptions: boolean;
  email_receipts: boolean;
  usage_based_billing_alerts: boolean;
  
  // Privacy Settings
  allow_error_reports: boolean;
  opt_out_analytics: boolean;
  default_access_level: 'restricted' | 'limited' | 'public';
  
  // Security Settings
  two_factor_enabled: boolean;
  session_timeout: number; // seconds
  login_notifications: boolean;
  suspicious_activity_alerts: boolean;
  
  // Notification Preferences
  email_notifications: boolean;
  push_notifications: boolean;
  slack_notifications: boolean;
  notification_frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export interface UserSettingsHistory {
  id: string;
  user_id: string;
  setting_name: string;
  old_value: any;
  new_value: any;
  changed_by?: string;
  change_reason?: string;
  created_at: string;
}

export type UserSettingsUpdate = Partial<UserSettings>;

export interface SettingsSection {
  id: string;
  title: string;
  description: string;
  settings: SettingField[];
}

export interface SettingField {
  key: keyof UserSettings;
  type: 'text' | 'boolean' | 'select' | 'number' | 'password' | 'textarea';
  label: string;
  description?: string;
  placeholder?: string;
  options?: Array<{ value: any; label: string; description?: string }>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  sensitive?: boolean; // For API keys, passwords, etc.
  advanced?: boolean; // For advanced settings that are hidden by default
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data?: UserSettings;
}

export interface ApiKeyConfig {
  provider: string;
  key: string;
  lastUsed?: string;
  isValid?: boolean;
  error?: string;
}

export interface SettingsSyncStatus {
  lastSync: string;
  pendingChanges: boolean;
  syncError?: string;
  autoSync: boolean;
}

// Default settings for new users
export const DEFAULT_USER_SETTINGS: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  // Account Settings
  use_type: 'non-commercial',
  make_profile_public: false,
  record_search_history: true,
  
  // Interface Settings
  theme: 'light',
  beta_features: false,
  
  // AI Settings
  llm_provider: 'openai',
  default_ai_model: 'gpt-4o-mini',
  default_context_scope: 'search-results',
  save_chat_history: true,
  auto_clear_sensitive_data: false,
  
  // API Keys
  api_keys: {},
  
  // Agent Settings
  auto_analysis: true,
  smart_suggestions: true,
  contextual_help: false,
  batch_processing: false,
  daily_spending_limit: 10.00,
  email_notifications_usage: true,
  
  // Payment & Billing Settings
  auto_renew_subscriptions: true,
  email_receipts: true,
  usage_based_billing_alerts: false,
  
  // Privacy Settings
  allow_error_reports: true,
  opt_out_analytics: false,
  default_access_level: 'restricted',
  
  // Security Settings
  two_factor_enabled: false,
  session_timeout: 7200, // 2 hours
  login_notifications: true,
  suspicious_activity_alerts: true,
  
  // Notification Preferences
  email_notifications: true,
  push_notifications: true,
  slack_notifications: false,
  notification_frequency: 'daily'
};

// Settings sections for organized UI
export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'account',
    title: 'Account Settings',
    description: 'Basic account information and commercial use settings',
    settings: [
      {
        key: 'use_type',
        type: 'select',
        label: 'Commercial Use Type',
        description: 'Select your usage type for proper licensing',
        options: [
          { 
            value: 'non-commercial', 
            label: 'Non-commercial use',
            description: 'For students or staff at non-profit institutions'
          },
          { 
            value: 'commercial', 
            label: 'Commercial use',
            description: 'For professionals using for commercial purposes'
          }
        ],
        validation: { required: true }
      },
      {
        key: 'make_profile_public',
        type: 'boolean',
        label: 'Make my profile public',
        description: 'Other users will be able to see your published collections and claimed patents'
      },
      {
        key: 'record_search_history',
        type: 'boolean',
        label: 'Record Search History',
        description: 'Opt in or out of your search history being recorded'
      }
    ]
  },
  {
    id: 'interface',
    title: 'Interface Settings',
    description: 'Customize the appearance and behavior of the platform',
    settings: [
      {
        key: 'theme',
        type: 'select',
        label: 'Theme / Color',
        description: 'Choose your preferred visual theme',
        options: [
          { value: 'light', label: 'Light Theme (Default)' },
          { value: 'dark', label: 'Dark Mode (For working at night)' },
          { value: 'vanilla', label: 'Vanilla (Clean Skin)' },
          { value: 'contrast', label: 'High Contrast (WCAG) (For accessibility)' }
        ]
      },
      {
        key: 'beta_features',
        type: 'boolean',
        label: 'Opt in to Beta Features',
        description: 'Get early access to new UI features and improvements',
        advanced: true
      }
    ]
  },
  {
    id: 'ai',
    title: 'AI Settings',
    description: 'Configure AI providers, models, and API keys',
    settings: [
      {
        key: 'llm_provider',
        type: 'select',
        label: 'AI Provider',
        description: 'Choose your preferred AI service provider',
        options: [
          { value: 'openai', label: 'OpenAI', description: 'GPT models direct from OpenAI' },
          { value: 'openrouter', label: 'OpenRouter', description: 'Access to multiple AI models' },
          { value: 'anthropic', label: 'Anthropic', description: 'Claude models direct from Anthropic' },
          { value: 'google', label: 'Google AI', description: 'Gemini models from Google' }
        ]
      },
      {
        key: 'default_ai_model',
        type: 'text',
        label: 'Default AI Model',
        description: 'Preferred model for new AI conversations',
        placeholder: 'e.g., gpt-4o-mini'
      },
      {
        key: 'default_context_scope',
        type: 'select',
        label: 'Default Context Scope',
        description: 'What data the AI has access to by default',
        options: [
          { value: 'search-results', label: 'Search Results' },
          { value: 'projects', label: 'Current Project' },
          { value: 'reports', label: 'Reports' },
          { value: 'dashboards', label: 'Dashboards' },
          { value: 'patent-corpus', label: 'Complete Patent Corpus' }
        ]
      },
      {
        key: 'save_chat_history',
        type: 'boolean',
        label: 'Save chat history',
        description: 'Keep AI conversations saved locally for future reference'
      },
      {
        key: 'auto_clear_sensitive_data',
        type: 'boolean',
        label: 'Auto-clear sensitive data',
        description: 'Automatically clear API keys from chat history after 24 hours',
        advanced: true
      }
    ]
  },
  {
    id: 'agents',
    title: 'AI Agents',
    description: 'Configure automated AI agents for patent analysis',
    settings: [
      {
        key: 'auto_analysis',
        type: 'boolean',
        label: 'Auto Patent Analysis',
        description: 'Automatically analyze new patents in your collections'
      },
      {
        key: 'smart_suggestions',
        type: 'boolean',
        label: 'Smart Research Suggestions',
        description: 'Get AI-powered suggestions for related patents and research'
      },
      {
        key: 'contextual_help',
        type: 'boolean',
        label: 'Contextual Help System',
        description: 'Enable AI agents to provide contextual guidance'
      },
      {
        key: 'batch_processing',
        type: 'boolean',
        label: 'Batch Processing',
        description: 'Allow agents to process large datasets automatically',
        advanced: true
      },
      {
        key: 'daily_spending_limit',
        type: 'number',
        label: 'Daily Spending Limit (USD)',
        description: 'Maximum daily spending on AI agent operations',
        validation: { min: 1, max: 1000 }
      },
      {
        key: 'email_notifications_usage',
        type: 'boolean',
        label: 'Email notifications for high usage',
        description: 'Get notified when approaching 80% of daily limit'
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    description: 'Control your privacy and data sharing preferences',
    settings: [
      {
        key: 'allow_error_reports',
        type: 'boolean',
        label: 'Allow Error Reports',
        description: 'Share diagnostic information to help improve the service'
      },
      {
        key: 'opt_out_analytics',
        type: 'boolean',
        label: 'Opt out of Web Analytics',
        description: 'Disable Matomo analytics tracking'
      },
      {
        key: 'default_access_level',
        type: 'select',
        label: 'Default Access Level',
        description: 'Default access level for new studio assets',
        options: [
          { value: 'restricted', label: 'Restricted access (Only you can view)' },
          { value: 'limited', label: 'Limited access (Anyone with link can view)' },
          { value: 'public', label: 'Public access (Discoverable through search)' }
        ]
      }
    ]
  },
  {
    id: 'security',
    title: 'Security Settings',
    description: 'Manage security features and access controls',
    settings: [
      {
        key: 'two_factor_enabled',
        type: 'boolean',
        label: 'Two-Factor Authentication',
        description: 'Enable 2FA for enhanced account security',
        advanced: true
      },
      {
        key: 'session_timeout',
        type: 'number',
        label: 'Session Timeout (seconds)',
        description: 'Auto-logout after inactivity',
        validation: { min: 300, max: 86400 }, // 5 minutes to 24 hours
        advanced: true
      },
      {
        key: 'login_notifications',
        type: 'boolean',
        label: 'Login Notifications',
        description: 'Get notified of new login attempts'
      },
      {
        key: 'suspicious_activity_alerts',
        type: 'boolean',
        label: 'Suspicious Activity Alerts',
        description: 'Get alerts for unusual account activity'
      }
    ]
  },
  {
    id: 'notifications',
    title: 'Notification Preferences',
    description: 'Configure how and when you receive notifications',
    settings: [
      {
        key: 'email_notifications',
        type: 'boolean',
        label: 'Email Notifications',
        description: 'Receive notifications via email'
      },
      {
        key: 'push_notifications',
        type: 'boolean',
        label: 'Push Notifications',
        description: 'Receive browser push notifications'
      },
      {
        key: 'notification_frequency',
        type: 'select',
        label: 'Notification Frequency',
        description: 'How often to receive notification summaries',
        options: [
          { value: 'immediate', label: 'Immediate' },
          { value: 'daily', label: 'Daily Summary' },
          { value: 'weekly', label: 'Weekly Summary' },
          { value: 'monthly', label: 'Monthly Summary' }
        ]
      }
    ]
  }
];