// AI Agent Builder types and interfaces

export type WorkflowType = 
  | 'linear_with_branching'
  | 'adaptive_complex'
  | 'linear_guided'
  | 'dashboard_analytical'
  | 'strategic_planning'
  | 'decision_focused'
  | 'financial_modeling'
  | 'comparative_analysis'
  | 'risk_analytical'
  | 'portfolio_management'
  | 'opportunity_discovery'
  | 'strategic_partnership'
  | 'linear_with_deep_analysis';

export type VisualizationType =
  | 'prior_art_timeline'
  | 'novelty_score_gauge'
  | 'world_map_coverage'
  | 'portfolio_bubble_chart'
  | 'risk_heatmap'
  | 'technology_radar'
  | 'priority_matrix'
  | 'similarity_spectrum'
  | 'cost_timeline'
  | 'roi_projection'
  | 'examiner_stats'
  | 'success_probability'
  | 'strategic_heatmap';

export type ProfessionalRole = 
  | 'Patent Attorney'
  | 'Trademark Attorney'
  | 'IP Manager'
  | 'Innovation Manager'
  | 'CIPO'
  | 'R&D Director';

export interface StepInput {
  id: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'file' | 'currency' | 'percentage';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: InputValidation;
  options?: SelectOption[];
  helpText?: string;
  defaultValue?: any;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface InputValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
}

export interface StepConfiguration {
  id: number;
  title: string;
  description?: string;
  mission: string;
  method: string;
  impact: string;
  inputs: StepInput[];
  aiProcessing: string;
  outputs: StepOutput[];
  visualizations?: VisualizationType[];
  conditionalNext?: ConditionalNavigation[];
}

export interface StepOutput {
  id: string;
  type: 'text' | 'number' | 'list' | 'chart' | 'score' | 'recommendation';
  label: string;
  format?: string;
  unit?: string;
}

export interface ConditionalNavigation {
  condition: string;
  nextStep: number;
}

export interface EngineTemplate {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  professionalRoles: ProfessionalRole[];
  category: string;
  workflowType: WorkflowType;
  totalSteps: number;
  estimatedTime: number; // minutes
  steps: StepConfiguration[];
  systemPrompt: string;
  dataSources: string[];
  outputFormat: EngineOutputFormat;
  requiredCapabilities?: string[];
  tags: string[];
}

export interface EngineOutputFormat {
  verdict?: {
    type: 'categorical' | 'numerical' | 'boolean';
    options?: string[];
    range?: { min: number; max: number };
  };
  scores?: Record<string, ScoreDefinition>;
  lists?: Record<string, ListDefinition>;
  metrics?: Record<string, MetricDefinition>;
  visualizations?: VisualizationType[];
}

export interface ScoreDefinition {
  min: number;
  max: number;
  label: string;
  description?: string;
  unit?: string;
}

export interface ListDefinition {
  label: string;
  itemType: string;
  maxItems?: number;
}

export interface MetricDefinition {
  label: string;
  unit: string;
  format: 'number' | 'currency' | 'percentage' | 'duration';
}

export interface GeneratedEngine {
  id: string;
  templateId: string;
  name: string;
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'testing' | 'published' | 'deprecated';
  version: string;
  components: GeneratedComponent[];
  customizations?: EngineCustomization[];
  metadata: EngineMetadata;
}

export interface GeneratedComponent {
  id: string;
  type: 'ui' | 'logic' | 'visualization' | 'data';
  name: string;
  code: string;
  dependencies: string[];
  tests?: string;
}

export interface EngineCustomization {
  id: string;
  type: 'step' | 'prompt' | 'visualization' | 'validation';
  target: string;
  modification: any;
}

export interface EngineMetadata {
  generationTime: number; // milliseconds
  codeQualityScore: number;
  testCoverage: number;
  performance: {
    loadTime: number;
    stepTransitionTime: number;
  };
  usage: {
    totalRuns: number;
    completionRate: number;
    averageTime: number;
  };
}

export interface BuilderConfiguration {
  templateEngine: {
    framework: 'react' | 'vue' | 'angular';
    styling: 'tailwind' | 'styled-components' | 'css-modules';
    stateManagement: 'redux' | 'zustand' | 'context';
  };
  aiIntegration: {
    provider: 'openai' | 'anthropic' | 'custom';
    model: string;
    temperature: number;
    maxTokens: number;
  };
  deployment: {
    target: 'vercel' | 'netlify' | 'aws' | 'custom';
    environment: 'development' | 'staging' | 'production';
  };
}

export interface BuilderSession {
  id: string;
  userId: string;
  templateId: string;
  status: 'configuring' | 'generating' | 'testing' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  configuration: Partial<EngineTemplate>;
  generatedEngine?: GeneratedEngine;
  logs: BuilderLog[];
  errors?: BuilderError[];
}

export interface BuilderLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  data?: any;
}

export interface BuilderError {
  code: string;
  message: string;
  details?: any;
  recoverable: boolean;
}