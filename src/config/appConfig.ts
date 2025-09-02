/**
 * ============================================================================
 * InnoSpot Application Configuration
 * ============================================================================
 * 
 * Centralized configuration file for the InnoSpot patent intelligence platform.
 * Contains all application settings, constants, and feature flags.
 * 
 * @author InnoSpot Development Team
 * @version 2.0.0
 * @since 2024
 */

// ============================================================================
// APPLICATION METADATA
// ============================================================================

export const APP_CONFIG = {
  name: 'InnoSpot',
  version: '2.0.0',
  description: 'Patent Intelligence & Innovation Management Platform',
  author: 'InnoSpot Development Team',
  homepage: 'https://innospot.ai',
  documentation: 'https://docs.innospot.ai',
  support: 'https://support.innospot.ai',
  repository: 'https://github.com/innospot/platform'
} as const;

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

export const ENV_CONFIG = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  databaseUrl: import.meta.env.DATABASE_URL || 'postgresql://innospot_user:innospot_password@localhost:5432/innospot_dev'
} as const;

// ============================================================================
// NAVIGATION SECTIONS
// ============================================================================

export const NAVIGATION_SECTIONS = {
  // Authentication
  REGISTER: 'register',
  LOGIN: 'login',
  
  // Core Features
  DASHBOARD: 'dashboard',
  SHOWCASE: 'showcase',
  HOME: 'home',
  
  // Search & Analysis
  SEARCH: 'search',
  JURISDICTIONS: 'jurisdictions',
  APPLICANTS: 'applicants',
  CITATIONS: 'citations',
  LEGAL_STATUS: 'legal-status',
  OWNERS: 'owners',
  
  // Workspace & Projects
  PROJECTS: 'projects',
  WORK_AREA: 'work-area',
  SPACES: 'spaces',
  
  // CMS & Content
  CMS_ADMIN: 'cms-admin',
  CMS_STUDIO: 'cms-studio',
  
  // Innovation Hub
  INNOVATION_HUB: 'innovation-hub',
  INNOVATION_MANAGER: 'innovation-manager',
  
  // AI Tools
  AI_AGENTS: 'ai-agents',
  AI_CLAIM_GENERATOR: 'ai-claim-generator',
  AI_PATENT_CLAIMS: 'ai-patent-claims',
  
  // Advanced Features
  DECISION_ENGINES: 'decision-engines',
  PATENT_MONITORING: 'patent-monitoring',
  PATENT_VALUATION: 'patent-valuation',
  COMPETITIVE_INTELLIGENCE: 'competitive-intelligence',
  
  // Revolutionary Tools
  PATENT_DNA_SEQUENCER: 'patent-dna-sequencer',
  INNOVATION_PULSE_MONITOR: 'innovation-pulse-monitor',
  WHITE_SPACE_CARTOGRAPHER: 'white-space-cartographer',
  COLLISION_PREDICTOR: 'invention-collision-predictor',
  
  // Communication
  NETWORK: 'network',
  MESSAGES: 'messages',
  
  // User Management
  ACCOUNT_SETTINGS: 'account-settings',
  PROFILE_INFO: 'profile-info',
  CLAIMED_WORK: 'claimed-work',
  
  // System
  DATABASE_TEST: 'database-test',
  SUPPORT: 'support',
  
  // E-commerce
  SUBSCRIPTION_DETAILS: 'subscription-details',
  CHECKOUT: 'checkout',
  PAYMENT_SUCCESS: 'payment-success'
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURE_FLAGS = {
  // Core Features
  ENABLE_INNOVATION_HUB: true,
  ENABLE_AI_TOOLS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_COLLABORATION: true,
  ENABLE_ENTERPRISE_FEATURES: true,
  ENABLE_MARKETPLACE: true,
  
  // Advanced Features
  ENABLE_REAL_TIME_COLLABORATION: false, // Simulated for demo
  ENABLE_BLOCKCHAIN_PROVENANCE: true,
  ENABLE_3D_VISUALIZATION: true,
  ENABLE_AI_PATENT_GENERATION: true,
  
  // System Features
  ENABLE_DATABASE_TEST_PANEL: true,
  ENABLE_DEBUG_MODE: ENV_CONFIG.isDevelopment,
  ENABLE_PERFORMANCE_MONITORING: true,
  
  // Authentication
  ENABLE_DEMO_AUTH: true,
  ENABLE_SSO: false, // Enterprise feature
  ENABLE_MFA: false, // Enterprise feature
  
  // UI Features
  ENABLE_PLATFORM_TOUR: true,
  ENABLE_AI_CHAT: true,
  ENABLE_DARK_MODE: false, // Future feature
  ENABLE_MOBILE_APP: false // Future feature
} as const;

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI_CONFIG = {
  // Layout
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64,
  SECONDARY_SIDEBAR_WIDTH: 224,
  
  // Theming
  PRIMARY_COLOR: '#3b82f6',
  SUCCESS_COLOR: '#10b981',
  WARNING_COLOR: '#f59e0b',
  ERROR_COLOR: '#ef4444',
  
  // Animation
  TRANSITION_DURATION: 150,
  LOADING_DELAY: 300,
  
  // Responsive Breakpoints
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  },
  
  // Data Display
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  CARD_GRID_COLS: 3,
  
  // Interaction
  TOOLTIP_DELAY: 500,
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_DELAY: 2000
} as const;

// ============================================================================
// BUSINESS LOGIC CONFIGURATION
// ============================================================================

export const BUSINESS_CONFIG = {
  // Innovation Management
  PIPELINE_STAGES: [
    { id: 'ideation', name: 'Ideation', color: 'purple' },
    { id: 'research', name: 'Research', color: 'blue' },
    { id: 'development', name: 'Development', color: 'yellow' },
    { id: 'filing', name: 'Filing', color: 'orange' },
    { id: 'prosecution', name: 'Prosecution', color: 'red' },
    { id: 'granted', name: 'Granted', color: 'green' }
  ],
  
  // Priority Levels
  PRIORITY_LEVELS: [
    { id: 'low', name: 'Low', color: 'gray' },
    { id: 'medium', name: 'Medium', color: 'blue' },
    { id: 'high', name: 'High', color: 'orange' },
    { id: 'critical', name: 'Critical', color: 'red' }
  ],
  
  // Patent Status
  PATENT_STATUSES: [
    { id: 'draft', name: 'Draft' },
    { id: 'pending', name: 'Pending' },
    { id: 'filed', name: 'Filed' },
    { id: 'published', name: 'Published' },
    { id: 'granted', name: 'Granted' },
    { id: 'expired', name: 'Expired' },
    { id: 'abandoned', name: 'Abandoned' }
  ],
  
  // User Roles
  USER_ROLES: [
    { id: 'admin', name: 'Administrator' },
    { id: 'user', name: 'User' },
    { id: 'researcher', name: 'Researcher' },
    { id: 'commercial', name: 'Commercial' }
  ],
  
  // Subscription Tiers
  SUBSCRIPTION_TIERS: [
    { id: 'free', name: 'Free', price: 0 },
    { id: 'professional', name: 'Professional', price: 99 },
    { id: 'enterprise', name: 'Enterprise', price: 299 }
  ]
} as const;

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  // Base Configuration
  BASE_URL: ENV_CONFIG.apiUrl,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Endpoints
  ENDPOINTS: {
    AUTH: '/auth',
    USERS: '/users',
    PATENTS: '/patents',
    PROJECTS: '/projects',
    REPORTS: '/reports',
    ANALYTICS: '/analytics',
    AI: '/ai',
    MARKETPLACE: '/marketplace'
  },
  
  // Rate Limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 100,
    REQUESTS_PER_HOUR: 1000,
    REQUESTS_PER_DAY: 10000
  }
} as const;

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

export const DATABASE_CONFIG = {
  // Connection Settings
  HOST: 'localhost',
  PORT: 5432,
  DATABASE: 'innospot_dev',
  USER: 'innospot_user',
  PASSWORD: 'innospot_password',
  
  // Pool Settings
  MAX_CONNECTIONS: 20,
  IDLE_TIMEOUT: 30000,
  CONNECTION_TIMEOUT: 2000,
  
  // Query Settings
  QUERY_TIMEOUT: 10000,
  MAX_RETRIES: 3
} as const;

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

export const SECURITY_CONFIG = {
  // Session Management
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  SESSION_REFRESH_INTERVAL: 15 * 60 * 1000, // 15 minutes
  
  // Password Requirements
  MIN_PASSWORD_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: false,
  
  // File Upload
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.txt', '.csv', '.xlsx'],
  
  // Content Security Policy
  CSP: {
    DEFAULT_SRC: "'self'",
    SCRIPT_SRC: "'self' 'unsafe-inline'",
    STYLE_SRC: "'self' 'unsafe-inline'",
    IMG_SRC: "'self' data: https:",
    CONNECT_SRC: "'self' https://api.innospot.ai"
  }
} as const;

// ============================================================================
// DEMO DATA CONFIGURATION
// ============================================================================

export const DEMO_CONFIG = {
  // Demo Users
  DEMO_USERS: [
    {
      email: 'demo@innospot.com',
      password: 'demo123',
      role: 'user',
      name: 'Demo User'
    },
    {
      email: 'researcher@innospot.com',
      password: 'researcher123',
      role: 'researcher',
      name: 'Research Specialist'
    },
    {
      email: 'commercial@innospot.com',
      password: 'commercial123',
      role: 'commercial',
      name: 'Commercial Manager'
    }
  ],
  
  // Feature Availability
  FEATURES_AVAILABLE: true,
  MOCK_DATA_ENABLED: true,
  SIMULATED_DELAYS: ENV_CONFIG.isDevelopment ? 500 : 0
} as const;

// ============================================================================
// MONITORING & ANALYTICS
// ============================================================================

export const MONITORING_CONFIG = {
  // Performance Monitoring
  ENABLE_PERFORMANCE_TRACKING: true,
  PERFORMANCE_SAMPLE_RATE: 0.1,
  
  // Error Tracking
  ENABLE_ERROR_TRACKING: true,
  ERROR_SAMPLE_RATE: 1.0,
  
  // User Analytics
  ENABLE_USER_ANALYTICS: false, // Privacy-focused
  ANALYTICS_SAMPLE_RATE: 0.05,
  
  // System Metrics
  ENABLE_SYSTEM_METRICS: true,
  METRICS_COLLECTION_INTERVAL: 60000 // 1 minute
} as const;

// ============================================================================
// EXPORT CONFIGURATION OBJECT
// ============================================================================

export const CONFIG = {
  APP: APP_CONFIG,
  ENV: ENV_CONFIG,
  NAVIGATION: NAVIGATION_SECTIONS,
  FEATURES: FEATURE_FLAGS,
  UI: UI_CONFIG,
  BUSINESS: BUSINESS_CONFIG,
  API: API_CONFIG,
  DATABASE: DATABASE_CONFIG,
  SECURITY: SECURITY_CONFIG,
  DEMO: DEMO_CONFIG,
  MONITORING: MONITORING_CONFIG
} as const;

export default CONFIG;