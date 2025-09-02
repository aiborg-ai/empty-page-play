/**
 * TypeScript definitions for InnoSpot Integration Features
 * Defines interfaces for API marketplace, webhooks, enterprise connectors,
 * patent office integrations, and third-party services
 */

// =============================================================================
// BASE INTEGRATION TYPES
// =============================================================================

export interface BaseIntegration {
  id: string;
  name: string;
  description: string;
  version: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  provider: string;
  iconUrl?: string;
  documentationUrl?: string;
  supportUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
}

export type IntegrationCategory = 
  | 'api_marketplace'
  | 'webhook'
  | 'enterprise'
  | 'patent_office'
  | 'third_party'
  | 'file_storage'
  | 'communication'
  | 'automation';

export type IntegrationStatus = 
  | 'active'
  | 'inactive'
  | 'pending'
  | 'error'
  | 'deprecated'
  | 'beta';

// =============================================================================
// API MARKETPLACE TYPES
// =============================================================================

export interface APIIntegration extends BaseIntegration {
  category: 'api_marketplace';
  endpoint: string;
  methods: HTTPMethod[];
  authentication: AuthenticationType;
  rateLimit: RateLimit;
  pricing: APIPricing;
  schemas: APISchema[];
  examples: APIExample[];
  analytics: APIAnalytics;
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type AuthenticationType = 
  | 'api_key'
  | 'bearer_token'
  | 'oauth2'
  | 'basic_auth'
  | 'digest_auth';

export interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit?: number;
}

export interface APIPricing {
  model: 'free' | 'freemium' | 'paid' | 'enterprise';
  basePrice?: number;
  pricePerRequest?: number;
  monthlyQuota?: number;
  overageRate?: number;
}

export interface APISchema {
  name: string;
  version: string;
  schema: any; // JSON Schema object
  examples: any[];
}

export interface APIExample {
  title: string;
  description: string;
  method: HTTPMethod;
  endpoint: string;
  headers?: Record<string, string>;
  body?: any;
  response: any;
}

export interface APIAnalytics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  uptimePercentage: number;
  lastChecked: string;
  usageByDay: UsageMetric[];
  errorsByType: ErrorMetric[];
}

export interface UsageMetric {
  date: string;
  requests: number;
  errors: number;
  averageResponseTime: number;
}

export interface ErrorMetric {
  errorType: string;
  count: number;
  lastOccurrence: string;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  integrationId: string;
  permissions: string[];
  expiresAt?: string;
  lastUsed?: string;
  isActive: boolean;
  createdAt: string;
}

// =============================================================================
// WEBHOOK TYPES
// =============================================================================

export interface WebhookIntegration extends BaseIntegration {
  category: 'webhook';
  url: string;
  events: WebhookEvent[];
  authentication: WebhookAuthentication;
  retryPolicy: RetryPolicy;
  headers?: Record<string, string>;
  isActive: boolean;
  logs: WebhookLog[];
}

export interface WebhookEvent {
  name: string;
  description: string;
  payloadSchema: any; // JSON Schema
  example: any;
}

export interface WebhookAuthentication {
  type: 'none' | 'secret' | 'signature' | 'bearer_token';
  secret?: string;
  algorithm?: 'sha256' | 'sha1' | 'md5';
  headerName?: string;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  response?: {
    status: number;
    body: any;
    headers: Record<string, string>;
  };
  attempt: number;
  success: boolean;
  error?: string;
  timestamp: string;
  processingTimeMs: number;
}

export interface WebhookTestRequest {
  webhookId: string;
  event: string;
  payload: any;
  timestamp: string;
}

export interface WebhookTestResponse {
  success: boolean;
  status: number;
  response: any;
  error?: string;
  processingTimeMs: number;
}

// =============================================================================
// ENTERPRISE CONNECTOR TYPES
// =============================================================================

export interface EnterpriseConnector extends BaseIntegration {
  category: 'enterprise';
  connectorType: EnterpriseSystem;
  configuration: EnterpriseConfig;
  mappings: FieldMapping[];
  syncSettings: SyncSettings;
  lastSync?: string;
  syncStatus: SyncStatus;
}

export type EnterpriseSystem = 
  | 'sap'
  | 'oracle'
  | 'microsoft_dynamics'
  | 'salesforce'
  | 'rest_api'
  | 'soap_api';

export interface EnterpriseConfig {
  host: string;
  port?: number;
  protocol: 'http' | 'https';
  basePath?: string;
  authentication: EnterpriseAuth;
  timeout: number;
  ssl?: SSLConfig;
}

export interface EnterpriseAuth {
  type: 'basic' | 'oauth2' | 'saml' | 'api_key' | 'certificate';
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  tokenUrl?: string;
  scope?: string[];
  apiKey?: string;
  certificatePath?: string;
}

export interface SSLConfig {
  enabled: boolean;
  verifyCertificate: boolean;
  certificatePath?: string;
  keyPath?: string;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'object';
}

export interface SyncSettings {
  enabled: boolean;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
  direction: 'import' | 'export' | 'bidirectional';
  batchSize: number;
  errorHandling: 'stop' | 'continue' | 'retry';
}

export type SyncStatus = 
  | 'idle'
  | 'running'
  | 'completed'
  | 'failed'
  | 'paused';

// =============================================================================
// PATENT OFFICE INTEGRATION TYPES
// =============================================================================

export interface PatentOfficeIntegration extends BaseIntegration {
  category: 'patent_office';
  office: PatentOffice;
  services: PatentService[];
  credentials: PatentOfficeCredentials;
  docketingSettings: DocketingSettings;
  filingSettings: FilingSettings;
}

export type PatentOffice = 
  | 'uspto'
  | 'epo'
  | 'wipo'
  | 'jpo'
  | 'kipo'
  | 'cnipa'
  | 'ip_australia'
  | 'cipo'
  | 'ukipo';

export type PatentService = 
  | 'filing'
  | 'status_check'
  | 'document_retrieval'
  | 'fee_calculation'
  | 'docketing'
  | 'prior_art_search'
  | 'classification'
  | 'legal_status';

export interface PatentOfficeCredentials {
  customerNumber?: string;
  username?: string;
  password?: string;
  certificate?: string;
  apiKey?: string;
  environment: 'sandbox' | 'production';
}

export interface DocketingSettings {
  enabled: boolean;
  autoSync: boolean;
  reminderDays: number[];
  notificationMethods: NotificationMethod[];
  customFields: CustomField[];
}

export interface FilingSettings {
  autoSubmit: boolean;
  validateBeforeSubmit: boolean;
  backupDocuments: boolean;
  feesAccount?: string;
  defaultCorrespondence: string;
}

export type NotificationMethod = 'email' | 'sms' | 'webhook' | 'in_app';

export interface CustomField {
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface PatentStatus {
  applicationNumber: string;
  status: string;
  statusDate: string;
  nextAction?: string;
  nextActionDate?: string;
  examiner?: string;
  attorney?: string;
  fees: PatentFee[];
  documents: PatentDocument[];
}

export interface PatentFee {
  code: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  paid: boolean;
  paidDate?: string;
}

export interface PatentDocument {
  id: string;
  type: string;
  description: string;
  filename: string;
  size: number;
  uploadDate: string;
  url: string;
}

// =============================================================================
// THIRD-PARTY SERVICE TYPES
// =============================================================================

export interface ThirdPartyIntegration extends BaseIntegration {
  category: 'third_party';
  service: ThirdPartyService;
  configuration: ThirdPartyConfig;
  features: ThirdPartyFeature[];
  permissions: string[];
}

export type ThirdPartyService = 
  | 'slack'
  | 'microsoft_teams'
  | 'google_workspace'
  | 'dropbox'
  | 'box'
  | 'onedrive'
  | 'zapier'
  | 'make'
  | 'ifttt'
  | 'discord'
  | 'telegram';

export interface ThirdPartyConfig {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  scopes: string[];
  webhookUrl?: string;
  customSettings: Record<string, any>;
}

export type ThirdPartyFeature = 
  | 'notifications'
  | 'file_sharing'
  | 'automation'
  | 'messaging'
  | 'calendar'
  | 'task_management'
  | 'document_collaboration';

// =============================================================================
// INTEGRATION MANAGEMENT TYPES
// =============================================================================

export interface IntegrationConnection {
  id: string;
  integrationId: string;
  userId: string;
  name: string;
  isActive: boolean;
  configuration: any;
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  provider: string;
  configuration: any;
  isPopular: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedSetupTime: number; // minutes
}

export interface IntegrationError {
  id: string;
  integrationId: string;
  errorType: 'connection' | 'authentication' | 'configuration' | 'data' | 'rate_limit';
  message: string;
  details?: any;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface IntegrationUsage {
  integrationId: string;
  period: 'hour' | 'day' | 'week' | 'month';
  requests: number;
  errors: number;
  dataTransferred: number; // bytes
  averageResponseTime: number; // ms
  timestamp: string;
}

// =============================================================================
// UI COMPONENT TYPES
// =============================================================================

export interface IntegrationCardProps {
  integration: BaseIntegration;
  onConnect?: (integration: BaseIntegration) => void;
  onDisconnect?: (integration: BaseIntegration) => void;
  onConfigure?: (integration: BaseIntegration) => void;
  onViewDocs?: (integration: BaseIntegration) => void;
}

export interface IntegrationListProps {
  integrations: BaseIntegration[];
  category?: IntegrationCategory;
  searchQuery?: string;
  sortBy?: 'name' | 'popularity' | 'created_at' | 'last_used';
  onIntegrationSelect?: (integration: BaseIntegration) => void;
}

export interface IntegrationConfigProps {
  integration: BaseIntegration;
  onSave?: (config: any) => void;
  onCancel?: () => void;
  onTest?: (config: any) => Promise<boolean>;
}

export interface IntegrationAnalyticsProps {
  integrationId: string;
  timeRange: 'hour' | 'day' | 'week' | 'month' | 'year';
  metrics: ('usage' | 'errors' | 'performance' | 'costs')[];
}