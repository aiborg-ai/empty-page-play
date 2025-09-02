// Decision Engines types and interfaces based on IDES PRD

export type EngineId = 
  | 'patentability'
  | 'filing-strategy'
  | 'prosecution-response'
  | 'portfolio-pruning'
  | 'trademark-clearance'
  | 'registration-strategy'
  | 'enforcement-decision'
  | 'budget-allocation'
  | 'licensing-decision'
  | 'risk-assessment'
  | 'innovation-pipeline'
  | 'technology-scouting'
  | 'partnership-decision';

export type EngineCategory = 'patent' | 'trademark' | 'portfolio' | 'innovation';

export interface DecisionEngine {
  id: EngineId;
  name: string;
  category: EngineCategory;
  description: string;
  purpose: string;
  minimalInputs: string[];
  dataSources: string[];
  outputFormat: EngineOutputFormat;
  icon: string;
  color: string;
  targetPersonas: string[];
  estimatedTime: number; // in minutes
}

export interface EngineQuestion {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'scale' | 'currency';
  required: boolean;
  maxLength?: number;
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface EngineSession {
  id: string;
  engineId: EngineId;
  userId: string;
  status: 'active' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  currentStep: number;
  totalSteps: number;
  responses: Record<string, any>;
  recommendation?: EngineRecommendation;
  auditTrail: AuditEntry[];
}

export interface EngineRecommendation {
  verdict: string;
  confidence: number;
  reasoning: string[];
  keyFindings: KeyFinding[];
  nextSteps: string[];
  citations: Citation[];
  riskFactors?: RiskFactor[];
  estimatedCost?: CostEstimate;
  timeline?: TimelineItem[];
  alternatives?: Alternative[];
}

export interface KeyFinding {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  supporting_data?: any;
}

export interface Citation {
  id: string;
  type: 'patent' | 'trademark' | 'case' | 'regulation' | 'market_data';
  reference: string;
  relevance: number;
  excerpt?: string;
  url?: string;
}

export interface RiskFactor {
  factor: string;
  likelihood: number;
  impact: number;
  mitigation?: string;
}

export interface CostEstimate {
  min: number;
  max: number;
  currency: string;
  breakdown?: { item: string; cost: number }[];
}

export interface TimelineItem {
  phase: string;
  duration: string;
  milestone: string;
  dependencies?: string[];
}

export interface Alternative {
  option: string;
  pros: string[];
  cons: string[];
  recommendation: 'preferred' | 'viable' | 'not_recommended';
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  data?: any;
  source: 'user' | 'system' | 'ai';
}

export interface EngineOutputFormat {
  verdict?: {
    type: 'categorical' | 'binary' | 'scale';
    options?: string[];
  };
  scores?: {
    [key: string]: {
      min: number;
      max: number;
      label: string;
    };
  };
  lists?: {
    [key: string]: {
      label: string;
      itemType: string;
    };
  };
  metrics?: {
    [key: string]: {
      label: string;
      unit: string;
      format: 'number' | 'percentage' | 'currency';
    };
  };
}

// Engine-specific input types
export interface PatentabilityInput {
  invention_description: string;
  tech_field: string;
  prior_art_known?: string;
  commercial_importance: number;
  budget?: number;
}

export interface FilingStrategyInput {
  invention_details: string;
  target_markets: string[];
  budget: number;
  timeline: string;
}

export interface ProsecutionResponseInput {
  office_action: string;
  claim_scope: string;
  prior_art: string;
  priorities: string[];
}

export interface PortfolioPruningInput {
  portfolio_ids: string[];
  maintenance_budget: number;
  strategy: string;
}

export interface TrademarkClearanceInput {
  proposed_mark: string;
  classes: string[];
  jurisdictions: string[];
  risk_tolerance: 'low' | 'medium' | 'high';
}

export interface BudgetAllocationInput {
  total_budget: number;
  bu_priorities: { unit: string; priority: number }[];
}

export interface RiskAssessmentInput {
  product_specs: string;
  markets: string[];
  risk_appetite: 'conservative' | 'moderate' | 'aggressive';
}

export interface InnovationPipelineInput {
  project_list: { name: string; resources: number; potential: number }[];
  total_resources: number;
  strategic_goals: string[];
}

export interface TechnologyScoutingInput {
  need_statement: string;
  budget: number;
  technology_fit: string[];
}

export interface PartnershipDecisionInput {
  challenge_description: string;
  internal_capabilities: string[];
  timeline: string;
  budget_range: { min: number; max: number };
}