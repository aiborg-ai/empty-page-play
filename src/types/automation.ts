// Automation & Workflows Types for InnoSpot Platform

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed' | 'archived';
export type WorkflowTriggerType = 'manual' | 'scheduled' | 'event' | 'webhook' | 'condition';
export type WorkflowNodeType = 'trigger' | 'condition' | 'action' | 'delay' | 'branch' | 'merge';
export type WorkflowPriority = 'low' | 'medium' | 'high' | 'critical';
export type AutomationScope = 'global' | 'project' | 'space' | 'user';
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

// Core Workflow Interfaces
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  template_data: WorkflowDefinition;
  preview_image?: string;
  complexity_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_setup_time: number; // minutes
  use_cases: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  priority: WorkflowPriority;
  scope: AutomationScope;
  project_id?: string;
  space_id?: string;
  owner_id: string;
  tags: string[];
  version: number;
  is_template: boolean;
  template_id?: string;
  
  // Workflow Structure
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  variables: WorkflowVariable[];
  
  // Execution Settings
  max_retries: number;
  retry_delay: number; // seconds
  timeout: number; // seconds
  concurrent_executions: number;
  
  // Scheduling
  schedule?: WorkflowSchedule;
  
  // Metadata
  created_at: string;
  updated_at: string;
  last_executed_at?: string;
  execution_count: number;
  success_count: number;
  failure_count: number;
}

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  name: string;
  description?: string;
  position: { x: number; y: number };
  
  // Node Configuration
  config: Record<string, any>;
  
  // Input/Output Ports
  inputs: WorkflowPort[];
  outputs: WorkflowPort[];
  
  // Execution Settings
  enabled: boolean;
  continue_on_error: boolean;
  timeout?: number;
  
  // UI Settings
  color?: string;
  icon?: string;
}

export interface WorkflowConnection {
  id: string;
  source_node_id: string;
  source_port_id: string;
  target_node_id: string;
  target_port_id: string;
  condition?: string; // Optional condition for conditional connections
}

export interface WorkflowPort {
  id: string;
  name: string;
  type: 'input' | 'output';
  data_type: string;
  required: boolean;
  description?: string;
}

export interface WorkflowVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: any;
  description?: string;
  is_sensitive: boolean; // For passwords, API keys, etc.
}

export interface WorkflowSchedule {
  enabled: boolean;
  timezone: string;
  cron_expression?: string;
  interval?: {
    value: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
  };
  start_date?: string;
  end_date?: string;
}

// Execution Interfaces
export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  trigger_type: WorkflowTriggerType;
  triggered_by: string;
  started_at: string;
  completed_at?: string;
  duration?: number; // milliseconds
  
  // Execution Data
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  error_message?: string;
  
  // Node Executions
  node_executions: NodeExecution[];
  
  // Metadata
  execution_log: ExecutionLogEntry[];
  resource_usage: ResourceUsage;
}

export interface NodeExecution {
  node_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  started_at?: string;
  completed_at?: string;
  duration?: number;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  error_message?: string;
  retry_count: number;
}

export interface ExecutionLogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  node_id?: string;
  data?: Record<string, any>;
}

export interface ResourceUsage {
  cpu_usage: number; // percentage
  memory_usage: number; // MB
  execution_time: number; // milliseconds
  api_calls: number;
  storage_used: number; // MB
}

// Patent Monitoring Interfaces
export interface PatentMonitorRule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'archived';
  priority: WorkflowPriority;
  
  // Monitoring Criteria
  search_query: string;
  jurisdictions: string[];
  patent_types: string[];
  date_range?: {
    start_date: string;
    end_date?: string;
  };
  
  // Alert Conditions
  alert_conditions: AlertCondition[];
  notification_settings: NotificationSettings;
  
  // Execution Settings
  check_frequency: {
    value: number;
    unit: 'hours' | 'days' | 'weeks';
  };
  
  // Metadata
  owner_id: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
  last_checked_at?: string;
  alerts_generated: number;
}

export interface AlertCondition {
  id: string;
  type: 'new_patents' | 'status_change' | 'citation_added' | 'expiry_approaching' | 'competitor_activity';
  threshold?: number;
  comparison: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'contains';
  value: any;
  severity: AlertSeverity;
}

export interface PatentAlert {
  id: string;
  rule_id: string;
  type: AlertCondition['type'];
  severity: AlertSeverity;
  title: string;
  description: string;
  patent_ids: string[];
  data: Record<string, any>;
  
  // Status
  status: 'new' | 'acknowledged' | 'resolved' | 'dismissed';
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_by?: string;
  resolved_at?: string;
  
  // Metadata
  created_at: string;
  expires_at?: string;
}

// Report Automation Interfaces
export interface ReportAutomation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'archived';
  
  // Report Configuration
  template_id: string;
  parameters: Record<string, any>;
  output_formats: ('pdf' | 'excel' | 'html' | 'csv')[];
  
  // Scheduling
  schedule: WorkflowSchedule;
  
  // Distribution
  distribution_list: ReportDistribution[];
  
  // Conditional Generation
  generation_conditions?: GenerationCondition[];
  
  // Metadata
  owner_id: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
  last_generated_at?: string;
  generation_count: number;
}

export interface ReportDistribution {
  id: string;
  type: 'email' | 'webhook' | 'storage' | 'ftp';
  recipients?: string[];
  webhook_url?: string;
  storage_path?: string;
  credentials?: Record<string, any>;
  enabled: boolean;
}

export interface GenerationCondition {
  id: string;
  type: 'data_available' | 'threshold_met' | 'date_range' | 'custom';
  condition: string;
  value: any;
}

export interface ReportGeneration {
  id: string;
  automation_id: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  output_files: GeneratedFile[];
  error_message?: string;
  
  // Distribution Status
  distribution_status: DistributionStatus[];
}

export interface GeneratedFile {
  id: string;
  filename: string;
  format: string;
  size: number; // bytes
  url: string;
  created_at: string;
}

export interface DistributionStatus {
  distribution_id: string;
  status: 'pending' | 'sent' | 'failed';
  sent_at?: string;
  error_message?: string;
  recipient_count?: number;
}

// Task Automation Interfaces
export interface TaskAutomationRule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'archived';
  
  // Trigger Conditions
  trigger_conditions: TaskTriggerCondition[];
  
  // Actions
  actions: TaskAutomationAction[];
  
  // Assignment Rules
  assignment_rules?: AssignmentRule[];
  
  // Escalation Settings
  escalation_settings?: EscalationSettings;
  
  // Metadata
  owner_id: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
  executions_count: number;
}

export interface TaskTriggerCondition {
  id: string;
  type: 'task_created' | 'deadline_approaching' | 'status_changed' | 'overdue' | 'approval_required';
  parameters: Record<string, any>;
  delay?: number; // minutes
}

export interface TaskAutomationAction {
  id: string;
  type: 'assign_task' | 'send_notification' | 'update_status' | 'create_subtask' | 'escalate' | 'approve' | 'reject';
  parameters: Record<string, any>;
  delay?: number; // minutes
}

export interface AssignmentRule {
  id: string;
  name: string;
  conditions: AssignmentCondition[];
  assignee_selection: AssigneeSelection;
  priority: number;
}

export interface AssignmentCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface AssigneeSelection {
  type: 'specific_user' | 'role_based' | 'load_balancing' | 'expertise_based' | 'random';
  parameters: Record<string, any>;
}

export interface EscalationSettings {
  enabled: boolean;
  levels: EscalationLevel[];
  max_escalations: number;
}

export interface EscalationLevel {
  level: number;
  delay: number; // hours
  escalate_to: string[]; // user IDs or role names
  notification_template: string;
  actions: TaskAutomationAction[];
}

// Data Processing Automation Interfaces
export interface DataProcessingWorkflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  
  // Processing Pipeline
  pipeline_steps: ProcessingStep[];
  
  // Data Sources
  input_sources: DataSource[];
  
  // Output Configuration
  output_config: OutputConfiguration;
  
  // Validation Rules
  validation_rules: ValidationRule[];
  
  // Error Handling
  error_handling: ErrorHandlingConfig;
  
  // Scheduling
  schedule?: WorkflowSchedule;
  
  // Metadata
  owner_id: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
  last_executed_at?: string;
  processed_records: number;
}

export interface ProcessingStep {
  id: string;
  name: string;
  type: 'import' | 'validate' | 'transform' | 'enrich' | 'deduplicate' | 'export';
  configuration: Record<string, any>;
  enabled: boolean;
  order: number;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'file_upload' | 'database' | 'api' | 'ftp' | 'email';
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface OutputConfiguration {
  destinations: OutputDestination[];
  format: string;
  compression?: string;
  encryption?: boolean;
}

export interface OutputDestination {
  id: string;
  type: 'database' | 'file_system' | 'cloud_storage' | 'api' | 'email';
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface ValidationRule {
  id: string;
  name: string;
  field: string;
  rule_type: 'required' | 'format' | 'range' | 'unique' | 'custom';
  parameters: Record<string, any>;
  error_action: 'skip' | 'reject' | 'flag' | 'transform';
}

export interface ErrorHandlingConfig {
  max_errors: number;
  error_threshold: number; // percentage
  on_error_threshold_exceeded: 'stop' | 'continue' | 'notify';
  error_notification_recipients: string[];
}

// Notification Interfaces
export interface NotificationSettings {
  enabled: boolean;
  channels: NotificationChannel[];
  templates: NotificationTemplate[];
  frequency_limits: FrequencyLimit[];
}

export interface NotificationChannel {
  id: string;
  type: 'email' | 'sms' | 'slack' | 'webhook' | 'push';
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel_type: NotificationChannel['type'];
  subject?: string;
  content: string;
  variables: string[];
}

export interface FrequencyLimit {
  channel_type: NotificationChannel['type'];
  max_notifications: number;
  time_window: number; // hours
}

// Integration Interfaces
export interface AutomationIntegration {
  id: string;
  name: string;
  type: 'patent_office' | 'legal_database' | 'crm' | 'project_management' | 'communication' | 'storage';
  status: 'active' | 'inactive' | 'error';
  configuration: Record<string, any>;
  
  // Capabilities
  supported_triggers: string[];
  supported_actions: string[];
  
  // Authentication
  auth_type: 'api_key' | 'oauth' | 'basic' | 'certificate';
  auth_config: Record<string, any>;
  
  // Rate Limiting
  rate_limits: RateLimit[];
  
  // Metadata
  owner_id: string;
  created_at: string;
  updated_at: string;
  last_used_at?: string;
}

export interface RateLimit {
  requests_per_minute: number;
  requests_per_hour: number;
  requests_per_day: number;
}

// Analytics & Reporting Interfaces
export interface AutomationAnalytics {
  workflow_id: string;
  period: {
    start_date: string;
    end_date: string;
  };
  
  // Execution Metrics
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_duration: number; // milliseconds
  
  // Performance Metrics
  throughput: number; // executions per hour
  error_rate: number; // percentage
  resource_usage: ResourceUsage;
  
  // Node Performance
  node_performance: NodePerformanceMetrics[];
  
  // Trends
  execution_trends: ExecutionTrend[];
  error_trends: ErrorTrend[];
}

export interface NodePerformanceMetrics {
  node_id: string;
  node_name: string;
  executions: number;
  average_duration: number;
  success_rate: number;
  error_count: number;
}

export interface ExecutionTrend {
  timestamp: string;
  executions: number;
  success_rate: number;
  average_duration: number;
}

export interface ErrorTrend {
  timestamp: string;
  error_count: number;
  error_types: Record<string, number>;
}