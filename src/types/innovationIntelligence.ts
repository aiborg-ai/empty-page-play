/**
 * Core Innovation Intelligence Types for InnoSpot
 * Revolutionary patent analysis and prediction system
 */

// Core Innovation Intelligence Types
export interface InnovationQuery {
  domains: string[];
  timeframe: {
    start: string;
    end: string;
  };
  geographic_scope: string[];
  analysis_type: 'dna' | 'collision' | 'whitespace' | 'pulse' | 'sunset' | 'reputation';
  filters: Record<string, any>;
}

export interface InnovationInsights {
  query_id: string;
  analysis_type: string;
  confidence_score: number;
  generated_at: string;
  insights: any[];
  recommendations: string[];
  visualizations: VisualizationData[];
}

export interface VisualizationData {
  type: '3d_dna' | '3d_map' | 'pulse_chart' | 'collision_sim' | 'timeline';
  data: Record<string, any>;
  config: Record<string, any>;
}

// Patent DNA Sequencer Types
export interface PatentDNA {
  id: string;
  patent_id: string;
  genetic_sequence: string; // Encoded technology fingerprint
  ancestors: PatentLineage[];
  mutations: TechnologyMutation[];
  evolution_score: number;
  dna_clusters: string[];
  helix_structure: HelixNode[];
  computed_at: string;
}

export interface PatentLineage {
  parent_patent: string;
  child_patent: string;
  relationship_type: 'direct_citation' | 'continuation' | 'division' | 'improvement';
  strength: number;
  innovation_delta: number;
}

export interface TechnologyMutation {
  id: string;
  type: 'enhancement' | 'pivot' | 'fusion' | 'disruption';
  strength: number;
  parent_patents: string[];
  innovation_delta: Record<string, any>;
  mutation_points: string[];
  impact_score: number;
}

export interface HelixNode {
  position: [number, number, number];
  patent_id: string;
  base_type: 'A' | 'T' | 'G' | 'C'; // Technology DNA bases
  connections: string[];
  innovation_strength: number;
}

// Innovation Pulse Monitor Types
export interface InnovationPulse {
  id: string;
  region: string;
  country_code: string;
  technology_domain: string;
  filing_velocity: number;
  inventor_activity: number;
  funding_signals: number;
  collaboration_index: number;
  pulse_score: number;
  trend_direction: 'accelerating' | 'stable' | 'declining' | 'emerging';
  prediction_confidence: number;
  anomaly_detection: boolean;
  recorded_at: string;
}

export interface PulseMetrics {
  daily_filings: number;
  weekly_trend: number;
  monthly_growth: number;
  inventor_count: number;
  new_inventors: number;
  collaboration_rate: number;
  international_filings: number;
  technology_diversity: number;
}

export interface GlobalPulseMap {
  regions: PulseRegion[];
  hotspots: InnovationHotspot[];
  emerging_clusters: TechnologyCluster[];
  migration_patterns: InnovationMigration[];
}

export interface PulseRegion {
  id: string;
  name: string;
  coordinates: [number, number];
  pulse_data: InnovationPulse;
  visualization_color: string;
  size_scale: number;
}

export interface InnovationHotspot {
  id: string;
  center: [number, number];
  radius: number;
  intensity: number;
  technologies: string[];
  growth_rate: number;
  prediction: HotspotPrediction;
}

export interface HotspotPrediction {
  next_6_months: number;
  next_12_months: number;
  confidence: number;
  key_factors: string[];
}

// White Space Cartographer Types
export interface InnovationWhiteSpace {
  id: string;
  coordinates: [number, number, number]; // 3D space position
  technology_domains: string[];
  market_size_estimate: number;
  entry_difficulty: number;
  time_to_market: number;
  competitive_density: number;
  opportunity_score: number;
  risk_factors: string[];
  enabling_technologies: string[];
  market_readiness: number;
}

export interface WhiteSpaceMap {
  dimensions: WhiteSpaceDimension[];
  spaces: InnovationWhiteSpace[];
  navigation_path: NavigationWaypoint[];
  discovery_zones: DiscoveryZone[];
}

export interface WhiteSpaceDimension {
  name: string;
  axis: 'x' | 'y' | 'z';
  scale: [number, number];
  metric_type: 'patent_density' | 'market_size' | 'competition' | 'innovation_rate';
}

export interface NavigationWaypoint {
  position: [number, number, number];
  label: string;
  description: string;
  opportunity_type: string;
}

export interface DiscoveryZone {
  id: string;
  boundary: [number, number, number][];
  zone_type: 'blue_ocean' | 'emerging_tech' | 'convergence' | 'disruption';
  potential_value: number;
  entry_requirements: string[];
}

// Technology Collision Predictor Types
export interface TechnologyCollision {
  id: string;
  domain_a: string;
  domain_b: string;
  collision_probability: number;
  predicted_timeline: string;
  innovation_potential: number;
  market_readiness: number;
  key_enablers: string[];
  blocking_factors: string[];
  historical_precedents: CollisionPrecedent[];
  simulation_data: CollisionSimulation;
}

export interface CollisionPrecedent {
  domains: string[];
  year_occurred: number;
  resulting_innovations: string[];
  market_impact: number;
  time_to_commercialization: number;
}

export interface CollisionSimulation {
  particle_a: ParticleState;
  particle_b: ParticleState;
  collision_point: [number, number, number];
  energy_release: number;
  resulting_particles: ParticleState[];
  visualization_frames: SimulationFrame[];
}

export interface ParticleState {
  position: [number, number, number];
  velocity: [number, number, number];
  mass: number;
  technology_properties: Record<string, any>;
}

export interface SimulationFrame {
  timestamp: number;
  particle_states: ParticleState[];
  field_effects: FieldEffect[];
}

export interface FieldEffect {
  type: 'gravity' | 'electromagnetic' | 'innovation_force';
  strength: number;
  influence_radius: number;
  center: [number, number, number];
}

// Technology Sunset Detector Types
export interface TechnologySunset {
  technology_id: string;
  technology_name: string;
  sunset_probability: number;
  estimated_timeline: string;
  decline_phase: 'early' | 'accelerating' | 'critical' | 'obsolete';
  decline_indicators: DeclineSignal[];
  replacement_technologies: ReplacementTechnology[];
  transition_strategy: TransitionStrategy;
  impact_assessment: SunsetImpact;
}

export interface DeclineSignal {
  type: 'filing_decrease' | 'citation_decay' | 'funding_shift' | 'market_signals' | 'talent_migration';
  strength: number;
  detected_at: string;
  confidence: number;
  trend_data: number[];
  threshold_crossed: boolean;
}

export interface ReplacementTechnology {
  technology_id: string;
  name: string;
  maturity_level: number;
  adoption_rate: number;
  superiority_factors: string[];
  transition_barriers: string[];
}

export interface TransitionStrategy {
  recommended_actions: string[];
  timeline: TransitionPhase[];
  risk_mitigation: string[];
  investment_recommendations: string[];
}

export interface TransitionPhase {
  phase_name: string;
  duration_months: number;
  key_activities: string[];
  success_metrics: string[];
}

export interface SunsetImpact {
  affected_industries: string[];
  job_displacement: number;
  market_value_at_risk: number;
  innovation_opportunities: string[];
}

// Innovation Time Machine Types
export interface TimeMachineState {
  current_year: number;
  available_technologies: AvailableTechnology[];
  innovation_constraints: InnovationConstraint[];
  possible_inventions: PossibleInvention[];
  counterfactual_scenarios: CounterfactualScenario[];
  historical_context: HistoricalContext;
}

export interface AvailableTechnology {
  technology_id: string;
  name: string;
  first_available: number;
  maturity_level: number;
  enabling_patents: string[];
  dependencies: string[];
}

export interface InnovationConstraint {
  type: 'technical' | 'economic' | 'regulatory' | 'social';
  description: string;
  severity: number;
  affected_domains: string[];
  resolution_timeline: string;
}

export interface PossibleInvention {
  invention_id: string;
  name: string;
  feasibility_score: number;
  required_technologies: string[];
  market_potential: number;
  development_timeline: number;
  key_inventors: string[];
}

export interface CounterfactualScenario {
  scenario_id: string;
  title: string;
  description: string;
  changed_variables: Record<string, any>;
  predicted_outcomes: string[];
  butterfly_effects: ButterflyEffect[];
}

export interface ButterflyEffect {
  trigger_event: string;
  cascade_effects: string[];
  timeline_deviation: number;
  impact_magnitude: number;
}

export interface HistoricalContext {
  major_events: HistoricalEvent[];
  technology_landscape: string[];
  economic_conditions: EconomicConditions;
  regulatory_environment: string[];
}

export interface HistoricalEvent {
  date: string;
  event: string;
  impact_on_innovation: string;
  affected_technologies: string[];
}

export interface EconomicConditions {
  gdp_growth: number;
  rd_investment: number;
  venture_funding: number;
  patent_activity: number;
}

// Patent Warfare Simulator Types
export interface LitigationScenario {
  scenario_id: string;
  plaintiff: LitigationParty;
  defendant: LitigationParty;
  dispute_domain: string;
  patents_in_dispute: string[];
  attack_vectors: AttackVector[];
  defense_strategies: DefenseStrategy[];
  outcome_probability: OutcomeProbability;
  estimated_costs: LitigationCosts;
  timeline_prediction: string;
  settlement_likelihood: number;
}

export interface LitigationParty {
  entity_id: string;
  name: string;
  portfolio_strength: number;
  litigation_history: LitigationHistory[];
  financial_resources: number;
  legal_team_quality: number;
  strategic_position: string;
}

export interface AttackVector {
  patent_id: string;
  claim_strength: number;
  infringement_evidence: number;
  invalidity_risk: number;
  strategic_value: number;
  counter_attack_risk: number;
}

export interface DefenseStrategy {
  strategy_type: 'invalidity' | 'non_infringement' | 'counter_attack' | 'settlement';
  success_probability: number;
  cost_estimate: number;
  time_to_execute: number;
  strategic_advantages: string[];
  risks: string[];
}

export interface OutcomeProbability {
  plaintiff_win: number;
  defendant_win: number;
  settlement: number;
  dismissal: number;
  confidence_interval: [number, number];
}

export interface LitigationCosts {
  legal_fees: number;
  court_costs: number;
  expert_witnesses: number;
  discovery_costs: number;
  business_disruption: number;
  total_estimate: number;
}

export interface LitigationHistory {
  case_id: string;
  year: number;
  opponent: string;
  outcome: string;
  domain: string;
  cost: number;
}

// Inventor Reputation Engine Types
export interface InventorReputation {
  inventor_id: string;
  name: string;
  reputation_score: number;
  citation_impact: CitationMetrics;
  commercialization_rate: number;
  collaboration_network: NetworkMetrics;
  consistency_score: number;
  domain_expertise: Record<string, number>;
  trending_direction: 'rising' | 'stable' | 'declining';
  career_trajectory: CareerPhase[];
  influence_metrics: InfluenceMetrics;
}

export interface CitationMetrics {
  total_citations: number;
  h_index: number;
  i10_index: number;
  recent_citation_velocity: number;
  cross_domain_citations: number;
  self_citation_rate: number;
}

export interface NetworkMetrics {
  collaboration_count: number;
  network_centrality: number;
  cross_industry_connections: number;
  mentorship_score: number;
  team_leadership_score: number;
}

export interface CareerPhase {
  phase_name: string;
  start_year: number;
  end_year?: number;
  focus_areas: string[];
  breakthrough_patents: string[];
  reputation_growth: number;
}

export interface InfluenceMetrics {
  technology_influence: Record<string, number>;
  industry_influence: Record<string, number>;
  academic_influence: number;
  market_influence: number;
  media_mentions: number;
}

// Quantum Patent Search Types
export interface QuantumSearchResult {
  search_id: string;
  query: string;
  primary_patent: string;
  quantum_connections: QuantumConnection[];
  synthesis_opportunities: SynthesisOpportunity[];
  innovation_vectors: InnovationVector[];
  confidence_score: number;
  processing_time: number;
}

export interface QuantumConnection {
  target_patent: string;
  connection_type: 'analogical' | 'functional' | 'structural' | 'emergent' | 'quantum_entangled';
  connection_strength: number;
  innovation_potential: number;
  hidden_relationships: RelationshipPath[];
  explanation: string;
  evidence_strength: number;
}

export interface RelationshipPath {
  path_id: string;
  intermediate_nodes: string[];
  relationship_types: string[];
  path_strength: number;
  discovery_mechanism: string;
}

export interface SynthesisOpportunity {
  opportunity_id: string;
  combining_patents: string[];
  synthesis_type: 'technology_fusion' | 'cross_pollination' | 'paradigm_shift';
  innovation_potential: number;
  technical_feasibility: number;
  market_readiness: number;
  recommended_approach: string;
}

export interface InnovationVector {
  vector_id: string;
  direction: [number, number, number];
  magnitude: number;
  technology_domain: string;
  innovation_type: string;
  breakthrough_potential: number;
}

// Shared utility types
export interface TechnologyCluster {
  cluster_id: string;
  center_point: [number, number, number];
  technologies: string[];
  cluster_strength: number;
  growth_trajectory: number;
  key_players: string[];
}

export interface InnovationMigration {
  from_region: string;
  to_region: string;
  technology_domains: string[];
  migration_strength: number;
  driving_factors: string[];
  timeline: string;
}

// API Response Types
export interface InnovationApiResponse<T> {
  data: T;
  metadata: {
    query_id: string;
    processing_time: number;
    confidence_score: number;
    data_sources: string[];
  };
  error?: string;
}

export interface InnovationAnalysisRequest {
  analysis_types: string[];
  parameters: Record<string, any>;
  output_format: 'full' | 'summary' | 'visualization_only';
  real_time: boolean;
}