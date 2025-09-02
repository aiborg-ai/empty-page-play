/**
 * Application-wide constants and configuration
 * This file centralizes all magic numbers, strings, and configuration values
 */

// ============================================================================
// APPLICATION METADATA
// ============================================================================
export const APP_NAME = 'InnoSpot';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'Comprehensive Patent Intelligence Platform';

// ============================================================================
// AUTHENTICATION CONSTANTS
// ============================================================================
export const AUTH = {
  // Session duration in milliseconds (24 hours)
  SESSION_DURATION: 24 * 60 * 60 * 1000,
  
  // Token refresh interval (1 hour)
  TOKEN_REFRESH_INTERVAL: 60 * 60 * 1000,
  
  // Demo user credentials
  DEMO_USERS: {
    BASIC: 'demo@innospot.com',
    RESEARCHER: 'researcher@innospot.com',
    COMMERCIAL: 'commercial@innospot.com'
  },
  
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: true
} as const;

// ============================================================================
// UI CONSTANTS
// ============================================================================
export const UI = {
  // Animation durations in milliseconds
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  
  // Breakpoints for responsive design
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1280,
    ULTRAWIDE: 1536
  },
  
  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    NOTIFICATION: 1080
  },
  
  // Default page size for lists
  DEFAULT_PAGE_SIZE: 20,
  
  // Debounce delays
  DEBOUNCE: {
    SEARCH: 300,
    RESIZE: 150,
    SCROLL: 100
  }
} as const;

// ============================================================================
// API CONFIGURATION
// ============================================================================
export const API = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.innospot.com',
  
  // API version
  VERSION: 'v1',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2
  },
  
  // Rate limiting
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 60,
    MAX_REQUESTS_PER_HOUR: 1000
  }
} as const;

// ============================================================================
// INNOVATION HUB CONSTANTS
// ============================================================================
export const INNOVATION = {
  // Pipeline stages
  PIPELINE_STAGES: [
    { id: 'ideation', name: 'Ideation', color: 'purple' },
    { id: 'research', name: 'Research', color: 'blue' },
    { id: 'development', name: 'Development', color: 'indigo' },
    { id: 'filing', name: 'Filing', color: 'yellow' },
    { id: 'prosecution', name: 'Prosecution', color: 'orange' },
    { id: 'granted', name: 'Granted', color: 'green' }
  ],
  
  // Risk levels
  RISK_LEVELS: {
    LOW: { label: 'Low', color: 'green', threshold: 30 },
    MEDIUM: { label: 'Medium', color: 'yellow', threshold: 70 },
    HIGH: { label: 'High', color: 'red', threshold: 100 }
  },
  
  // Priority levels
  PRIORITY_LEVELS: {
    LOW: { label: 'Low', color: 'gray', weight: 1 },
    MEDIUM: { label: 'Medium', color: 'blue', weight: 2 },
    HIGH: { label: 'High', color: 'orange', weight: 3 },
    CRITICAL: { label: 'Critical', color: 'red', weight: 4 }
  },
  
  // KPI thresholds
  KPI_THRESHOLDS: {
    INNOVATION_VELOCITY: 3.0, // inventions per month
    PATENT_GRANT_RATE: 75, // percentage
    CITATION_IMPACT: 100, // average citations
    TECHNOLOGY_DIVERSITY: 7.0 // diversity score
  }
} as const;

// ============================================================================
// PATENT CONSTANTS
// ============================================================================
export const PATENT = {
  // Patent types
  TYPES: [
    'Utility',
    'Design',
    'Plant',
    'Provisional',
    'PCT'
  ],
  
  // Patent status
  STATUS: {
    DRAFT: 'draft',
    FILED: 'filed',
    PUBLISHED: 'published',
    GRANTED: 'granted',
    EXPIRED: 'expired',
    ABANDONED: 'abandoned'
  },
  
  // Jurisdictions
  JURISDICTIONS: [
    { code: 'US', name: 'United States' },
    { code: 'EP', name: 'European Patent Office' },
    { code: 'CN', name: 'China' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'WO', name: 'WIPO (PCT)' }
  ],
  
  // Technology domains
  TECH_DOMAINS: [
    'AI/ML',
    'Quantum Computing',
    'Biotechnology',
    'Green Energy',
    'Robotics',
    'IoT',
    'Blockchain',
    'Nanotechnology',
    'Materials Science',
    'Telecommunications'
  ]
} as const;

// ============================================================================
// VALIDATION PATTERNS
// ============================================================================
export const VALIDATION = {
  // Email validation pattern
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  
  // Phone number validation (international format)
  PHONE: /^\+?[1-9]\d{1,14}$/,
  
  // Patent number formats
  PATENT_NUMBER: {
    US: /^US\d{7,8}[A-Z]?\d?$/,
    EP: /^EP\d{7}[A-Z]\d$/,
    PCT: /^WO\d{4}\/\d{6}$/
  },
  
  // URL validation
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    UNAUTHORIZED: 'You are not authorized to access this resource',
    EMAIL_NOT_VERIFIED: 'Please verify your email address'
  },
  
  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: `Password must be at least ${AUTH.PASSWORD_MIN_LENGTH} characters`,
    PASSWORD_REQUIREMENTS: 'Password must include uppercase, number, and special character',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_URL: 'Please enter a valid URL'
  },
  
  // Network errors
  NETWORK: {
    OFFLINE: 'No internet connection. Please check your network.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    RATE_LIMIT: 'Too many requests. Please slow down.'
  },
  
  // Generic errors
  GENERIC: {
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
    NOT_FOUND: 'The requested resource was not found',
    PERMISSION_DENIED: 'You do not have permission to perform this action'
  }
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN: 'Welcome back!',
    LOGOUT: 'You have been signed out successfully',
    REGISTER: 'Account created successfully',
    PASSWORD_RESET: 'Password reset email sent'
  },
  
  CRUD: {
    CREATE: 'Created successfully',
    UPDATE: 'Updated successfully',
    DELETE: 'Deleted successfully',
    SAVE: 'Saved successfully'
  },
  
  PATENT: {
    FILED: 'Patent application filed successfully',
    GRANTED: 'Patent granted!',
    ANALYSIS_COMPLETE: 'Patent analysis complete'
  }
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================
export const FEATURES = {
  // Enable/disable features
  ENABLE_AI_CHAT: true,
  ENABLE_3D_VISUALIZATION: true,
  ENABLE_BLOCKCHAIN: false,
  ENABLE_VOICE_SEARCH: false,
  ENABLE_DARK_MODE: false,
  
  // Beta features
  BETA_FEATURES: {
    INNOVATION_MANAGER: true,
    DECISION_ENGINES: true,
    PATENT_DNA_SEQUENCER: false
  }
} as const;

// ============================================================================
// THEME CONFIGURATION
// ============================================================================
export const THEME = {
  // Color palette
  COLORS: {
    PRIMARY: '#3b82f6', // blue-500
    SECONDARY: '#8b5cf6', // violet-500
    SUCCESS: '#10b981', // emerald-500
    WARNING: '#f59e0b', // amber-500
    ERROR: '#ef4444', // red-500
    INFO: '#0ea5e9', // sky-500
    
    // Grayscale
    GRAY: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  
  // Border radius values
  RADIUS: {
    NONE: '0',
    SM: '0.125rem',
    DEFAULT: '0.25rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    '2XL': '1rem',
    '3XL': '1.5rem',
    FULL: '9999px'
  },
  
  // Shadow values
  SHADOWS: {
    SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    NONE: 'none'
  }
} as const;

// Export type definitions for TypeScript
export type AuthConfig = typeof AUTH;
export type UIConfig = typeof UI;
export type APIConfig = typeof API;
export type InnovationConfig = typeof INNOVATION;
export type PatentConfig = typeof PATENT;
export type ValidationPatterns = typeof VALIDATION;
export type ThemeConfig = typeof THEME;