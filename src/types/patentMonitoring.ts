// Real-Time Patent Monitoring & Alerts System Types

export interface PatentAlert {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  severity: AlertSeverity;
  patentId?: string;
  patentNumber?: string;
  applicant?: string;
  technology?: string;
  jurisdiction?: string;
  createdAt: string;
  readAt?: string;
  watchlistId: string;
  watchlistName: string;
  metadata: {
    filingDate?: string;
    publicationDate?: string;
    inventors?: string[];
    claims?: number;
    citationCount?: number;
    similarityScore?: number;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  };
}

export type AlertType = 
  | 'new_patent'
  | 'competitor_filing'
  | 'technology_trend'
  | 'citation_received'
  | 'litigation_filed'
  | 'patent_granted'
  | 'patent_expired'
  | 'portfolio_change'
  | 'market_movement'
  | 'licensing_opportunity';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  filters: WatchlistFilters;
  alertSettings: AlertSettings;
  statistics: WatchlistStats;
}

export interface WatchlistFilters {
  keywords: string[];
  competitors: string[];
  inventors: string[];
  assignees: string[];
  classifications: string[]; // IPC/CPC codes
  jurisdictions: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  technologyAreas: string[];
  excludeKeywords: string[];
  minimumClaims?: number;
  patentStatus: ('pending' | 'granted' | 'expired' | 'abandoned')[];
}

export interface AlertSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  slackIntegration?: {
    enabled: boolean;
    webhookUrl: string;
    channel: string;
  };
  frequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
  alertTypes: AlertType[];
  severityThreshold: AlertSeverity;
  maxAlertsPerDay: number;
  quietHours?: {
    start: string; // HH:MM format
    end: string;
    timezone: string;
  };
}

export interface WatchlistStats {
  totalAlerts: number;
  alertsLast30Days: number;
  topAlertTypes: Array<{
    type: AlertType;
    count: number;
  }>;
  averageAlertsPerDay: number;
  lastAlertDate?: string;
  patentsMonitored: number;
  competitorsTracked: number;
}

export interface MonitoringDashboard {
  alerts: PatentAlert[];
  watchlists: Watchlist[];
  globalStats: {
    totalAlerts: number;
    unreadAlerts: number;
    activeWatchlists: number;
    highPriorityAlerts: number;
  };
  trendingTopics: Array<{
    topic: string;
    alertCount: number;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'alert' | 'watchlist_created' | 'watchlist_updated';
    description: string;
    timestamp: string;
  }>;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  watchlistId: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
}

export interface RuleCondition {
  field: string; // patent field to check
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in_range' | 'regex';
  value: string | number | string[];
  caseSensitive?: boolean;
}

export interface RuleAction {
  type: 'send_email' | 'create_alert' | 'post_slack' | 'webhook' | 'create_task';
  config: {
    recipients?: string[];
    severity?: AlertSeverity;
    template?: string;
    webhookUrl?: string;
    slackChannel?: string;
  };
}

export interface CompetitorProfile {
  id: string;
  name: string;
  aliases: string[];
  industry: string;
  description: string;
  headquarters: string;
  website?: string;
  patentPortfolio: {
    totalPatents: number;
    activePatents: number;
    filingTrend: 'increasing' | 'decreasing' | 'stable';
    topTechnologies: string[];
    averageClaimsPerPatent: number;
    citationMetrics: {
      averageForwardCitations: number;
      averageBackwardCitations: number;
      hIndex: number;
    };
  };
  trackingSettings: {
    isMonitored: boolean;
    alertOnNewFilings: boolean;
    alertOnGrants: boolean;
    alertOnLitigation: boolean;
    priorityLevel: 'low' | 'medium' | 'high';
  };
  lastUpdated: string;
  addedAt: string;
}

export interface TechnologyTrend {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  classifications: string[];
  growthRate: number; // percentage
  patentCount: number;
  patentGrowth: number; // percentage change
  topAssignees: Array<{
    name: string;
    patentCount: number;
    marketShare: number;
  }>;
  geographicDistribution: Array<{
    jurisdiction: string;
    patentCount: number;
    percentage: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    patentCount: number;
    filingCount: number;
    grantCount: number;
  }>;
  relatedTrends: string[];
  maturityLevel: 'emerging' | 'growing' | 'mature' | 'declining';
  investmentScore: number; // 0-100 scale
  riskScore: number; // 0-100 scale
}

export interface MonitoringService {
  // Watchlist management
  createWatchlist(watchlist: Omit<Watchlist, 'id' | 'createdAt' | 'updatedAt' | 'statistics'>): Promise<Watchlist>;
  updateWatchlist(id: string, updates: Partial<Watchlist>): Promise<Watchlist>;
  deleteWatchlist(id: string): Promise<void>;
  getWatchlists(userId: string): Promise<Watchlist[]>;
  getWatchlist(id: string): Promise<Watchlist | null>;
  
  // Alert management
  getAlerts(watchlistId?: string, filters?: {
    unreadOnly?: boolean;
    severity?: AlertSeverity;
    type?: AlertType;
    limit?: number;
    offset?: number;
  }): Promise<PatentAlert[]>;
  markAlertAsRead(alertId: string): Promise<void>;
  markAllAlertsAsRead(watchlistId?: string): Promise<void>;
  deleteAlert(alertId: string): Promise<void>;
  
  // Dashboard data
  getDashboardData(userId: string): Promise<MonitoringDashboard>;
  
  // Competitor tracking
  addCompetitor(competitor: Omit<CompetitorProfile, 'id' | 'addedAt' | 'lastUpdated'>): Promise<CompetitorProfile>;
  updateCompetitor(id: string, updates: Partial<CompetitorProfile>): Promise<CompetitorProfile>;
  removeCompetitor(id: string): Promise<void>;
  getCompetitors(userId: string): Promise<CompetitorProfile[]>;
  
  // Technology trends
  getTechnologyTrends(filters?: {
    keywords?: string[];
    classifications?: string[];
    jurisdictions?: string[];
    maturityLevel?: TechnologyTrend['maturityLevel'];
    minGrowthRate?: number;
    limit?: number;
  }): Promise<TechnologyTrend[]>;
  
  // Real-time monitoring
  startMonitoring(watchlistId: string): Promise<void>;
  stopMonitoring(watchlistId: string): Promise<void>;
  
  // Alert rules
  createAlertRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'triggerCount'>): Promise<AlertRule>;
  updateAlertRule(id: string, updates: Partial<AlertRule>): Promise<AlertRule>;
  deleteAlertRule(id: string): Promise<void>;
  getAlertRules(watchlistId: string): Promise<AlertRule[]>;
}