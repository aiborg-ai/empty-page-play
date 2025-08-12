// Real-Time Patent Monitoring & Alerts Service

import {
  PatentAlert,
  Watchlist,
  MonitoringDashboard,
  CompetitorProfile,
  TechnologyTrend,
  AlertRule,
  MonitoringService,
  AlertType,
  AlertSeverity,
  WatchlistFilters,
  AlertSettings
} from '../types/patentMonitoring';

class PatentMonitoringServiceImpl implements MonitoringService {
  private alerts: PatentAlert[] = [];
  private watchlists: Watchlist[] = [];
  private competitors: CompetitorProfile[] = [];
  private alertRules: AlertRule[] = [];
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create sample competitors
    this.competitors = [
      {
        id: 'comp-1',
        name: 'TechGiant Corp',
        aliases: ['TechGiant', 'TG Corp', 'TechGiant Technologies'],
        industry: 'Software & AI',
        description: 'Leading technology company specializing in AI and cloud computing',
        headquarters: 'Cupertino, CA',
        website: 'https://techgiant.com',
        patentPortfolio: {
          totalPatents: 15420,
          activePatents: 12800,
          filingTrend: 'increasing',
          topTechnologies: ['Machine Learning', 'Computer Vision', 'Natural Language Processing'],
          averageClaimsPerPatent: 18.5,
          citationMetrics: {
            averageForwardCitations: 8.3,
            averageBackwardCitations: 12.1,
            hIndex: 145
          }
        },
        trackingSettings: {
          isMonitored: true,
          alertOnNewFilings: true,
          alertOnGrants: true,
          alertOnLitigation: true,
          priorityLevel: 'high'
        },
        lastUpdated: new Date().toISOString(),
        addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comp-2',
        name: 'InnovateTech Solutions',
        aliases: ['InnovateTech', 'ITS'],
        industry: 'Biotechnology',
        description: 'Biotechnology company focused on drug discovery and medical devices',
        headquarters: 'Boston, MA',
        patentPortfolio: {
          totalPatents: 3250,
          activePatents: 2890,
          filingTrend: 'stable',
          topTechnologies: ['Drug Discovery', 'Medical Devices', 'Biomarkers'],
          averageClaimsPerPatent: 24.2,
          citationMetrics: {
            averageForwardCitations: 6.8,
            averageBackwardCitations: 15.3,
            hIndex: 89
          }
        },
        trackingSettings: {
          isMonitored: true,
          alertOnNewFilings: true,
          alertOnGrants: false,
          alertOnLitigation: true,
          priorityLevel: 'medium'
        },
        lastUpdated: new Date().toISOString(),
        addedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Create sample watchlists
    this.watchlists = [
      {
        id: 'watch-1',
        name: 'AI & Machine Learning Patents',
        description: 'Monitor patents related to artificial intelligence and machine learning technologies',
        isActive: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user-1',
        filters: {
          keywords: ['artificial intelligence', 'machine learning', 'neural network', 'deep learning'],
          competitors: ['TechGiant Corp', 'Google LLC', 'Microsoft Corporation'],
          inventors: [],
          assignees: ['TechGiant Corp'],
          classifications: ['G06N', 'G06F15'],
          jurisdictions: ['US', 'EP', 'CN'],
          technologyAreas: ['Computer Science', 'Artificial Intelligence'],
          excludeKeywords: ['toy', 'game'],
          patentStatus: ['pending', 'granted']
        },
        alertSettings: {
          emailNotifications: true,
          pushNotifications: true,
          frequency: 'realtime',
          alertTypes: ['new_patent', 'competitor_filing', 'patent_granted'],
          severityThreshold: 'medium',
          maxAlertsPerDay: 50
        },
        statistics: {
          totalAlerts: 127,
          alertsLast30Days: 34,
          topAlertTypes: [
            { type: 'new_patent', count: 45 },
            { type: 'competitor_filing', count: 32 },
            { type: 'patent_granted', count: 28 }
          ],
          averageAlertsPerDay: 2.3,
          lastAlertDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          patentsMonitored: 8500,
          competitorsTracked: 3
        }
      },
      {
        id: 'watch-2',
        name: 'Biotech Competitor Watch',
        description: 'Track competitor activity in biotechnology and pharmaceutical patents',
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'user-1',
        filters: {
          keywords: ['drug discovery', 'therapeutic', 'biomarker', 'clinical trial'],
          competitors: ['InnovateTech Solutions', 'Pfizer Inc', 'Roche'],
          inventors: [],
          assignees: ['InnovateTech Solutions'],
          classifications: ['A61K', 'C07D', 'G01N33'],
          jurisdictions: ['US', 'EP'],
          technologyAreas: ['Biotechnology', 'Pharmaceuticals'],
          excludeKeywords: ['veterinary'],
          patentStatus: ['pending', 'granted']
        },
        alertSettings: {
          emailNotifications: true,
          pushNotifications: false,
          frequency: 'daily',
          alertTypes: ['new_patent', 'competitor_filing', 'licensing_opportunity'],
          severityThreshold: 'low',
          maxAlertsPerDay: 25
        },
        statistics: {
          totalAlerts: 89,
          alertsLast30Days: 23,
          topAlertTypes: [
            { type: 'new_patent', count: 31 },
            { type: 'competitor_filing', count: 28 },
            { type: 'licensing_opportunity', count: 15 }
          ],
          averageAlertsPerDay: 1.5,
          lastAlertDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          patentsMonitored: 4200,
          competitorsTracked: 3
        }
      }
    ];

    // Generate sample alerts
    this.generateSampleAlerts();
  }

  private generateSampleAlerts() {
    const alertTypes: AlertType[] = [
      'new_patent', 'competitor_filing', 'technology_trend', 'citation_received',
      'patent_granted', 'licensing_opportunity'
    ];
    
    const severities: AlertSeverity[] = ['low', 'medium', 'high', 'critical'];
    
    this.alerts = Array.from({ length: 25 }, (_, i) => ({
      id: `alert-${i + 1}`,
      title: this.generateAlertTitle(alertTypes[i % alertTypes.length]),
      description: this.generateAlertDescription(alertTypes[i % alertTypes.length]),
      type: alertTypes[i % alertTypes.length],
      severity: severities[i % severities.length],
      patentId: `patent-${Math.floor(Math.random() * 1000)}`,
      patentNumber: `US${10000000 + Math.floor(Math.random() * 1000000)}B2`,
      applicant: i % 2 === 0 ? 'TechGiant Corp' : 'InnovateTech Solutions',
      technology: i % 3 === 0 ? 'Machine Learning' : i % 3 === 1 ? 'Drug Discovery' : 'Computer Vision',
      jurisdiction: ['US', 'EP', 'CN', 'JP'][i % 4],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      readAt: i > 15 ? undefined : new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      watchlistId: i % 2 === 0 ? 'watch-1' : 'watch-2',
      watchlistName: i % 2 === 0 ? 'AI & Machine Learning Patents' : 'Biotech Competitor Watch',
      metadata: {
        filingDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        publicationDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        inventors: [`Inventor ${i + 1}`, `Inventor ${i + 2}`],
        claims: Math.floor(Math.random() * 30) + 5,
        citationCount: Math.floor(Math.random() * 50),
        similarityScore: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
        riskLevel: (['low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 4)]
      }
    }));
  }

  private generateAlertTitle(type: AlertType): string {
    switch (type) {
      case 'new_patent':
        return 'New Patent Application Published';
      case 'competitor_filing':
        return 'Competitor Filed New Patent';
      case 'technology_trend':
        return 'Technology Trend Alert';
      case 'citation_received':
        return 'Your Patent Received New Citation';
      case 'patent_granted':
        return 'Patent Application Granted';
      case 'licensing_opportunity':
        return 'Potential Licensing Opportunity Identified';
      default:
        return 'Patent Activity Alert';
    }
  }

  private generateAlertDescription(type: AlertType): string {
    switch (type) {
      case 'new_patent':
        return 'A new patent application matching your watchlist criteria has been published';
      case 'competitor_filing':
        return 'A tracked competitor has filed a new patent application in your technology area';
      case 'technology_trend':
        return 'Unusual activity detected in your monitored technology sector';
      case 'citation_received':
        return 'One of your patents has been cited by a new application';
      case 'patent_granted':
        return 'A monitored patent application has been granted';
      case 'licensing_opportunity':
        return 'A patent with licensing potential has been identified based on your criteria';
      default:
        return 'Patent monitoring system detected activity in your watched areas';
    }
  }

  // Watchlist management
  async createWatchlist(watchlistData: Omit<Watchlist, 'id' | 'createdAt' | 'updatedAt' | 'statistics'>): Promise<Watchlist> {
    await this.simulateDelay(500);
    
    const watchlist: Watchlist = {
      ...watchlistData,
      id: `watch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statistics: {
        totalAlerts: 0,
        alertsLast30Days: 0,
        topAlertTypes: [],
        averageAlertsPerDay: 0,
        patentsMonitored: 0,
        competitorsTracked: watchlistData.filters.competitors.length
      }
    };
    
    this.watchlists.push(watchlist);
    
    if (watchlist.isActive) {
      this.startMonitoring(watchlist.id);
    }
    
    return watchlist;
  }

  async updateWatchlist(id: string, updates: Partial<Watchlist>): Promise<Watchlist> {
    await this.simulateDelay(300);
    
    const index = this.watchlists.findIndex(w => w.id === id);
    if (index === -1) {
      throw new Error('Watchlist not found');
    }
    
    this.watchlists[index] = {
      ...this.watchlists[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Restart monitoring if settings changed
    if (updates.isActive !== undefined || updates.filters || updates.alertSettings) {
      if (this.watchlists[index].isActive) {
        this.stopMonitoring(id);
        this.startMonitoring(id);
      }
    }
    
    return this.watchlists[index];
  }

  async deleteWatchlist(id: string): Promise<void> {
    await this.simulateDelay(200);
    
    this.watchlists = this.watchlists.filter(w => w.id !== id);
    this.alerts = this.alerts.filter(a => a.watchlistId !== id);
    this.stopMonitoring(id);
  }

  async getWatchlists(userId: string): Promise<Watchlist[]> {
    await this.simulateDelay(100);
    return this.watchlists.filter(w => w.userId === userId);
  }

  async getWatchlist(id: string): Promise<Watchlist | null> {
    await this.simulateDelay(50);
    return this.watchlists.find(w => w.id === id) || null;
  }

  // Alert management
  async getAlerts(watchlistId?: string, filters?: any): Promise<PatentAlert[]> {
    await this.simulateDelay(100);
    
    let filteredAlerts = [...this.alerts];
    
    if (watchlistId) {
      filteredAlerts = filteredAlerts.filter(a => a.watchlistId === watchlistId);
    }
    
    if (filters) {
      if (filters.unreadOnly) {
        filteredAlerts = filteredAlerts.filter(a => !a.readAt);
      }
      if (filters.severity) {
        filteredAlerts = filteredAlerts.filter(a => a.severity === filters.severity);
      }
      if (filters.type) {
        filteredAlerts = filteredAlerts.filter(a => a.type === filters.type);
      }
      if (filters.limit) {
        filteredAlerts = filteredAlerts.slice(0, filters.limit);
      }
    }
    
    return filteredAlerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    await this.simulateDelay(50);
    
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.readAt = new Date().toISOString();
    }
  }

  async markAllAlertsAsRead(watchlistId?: string): Promise<void> {
    await this.simulateDelay(100);
    
    const now = new Date().toISOString();
    this.alerts.forEach(alert => {
      if ((!watchlistId || alert.watchlistId === watchlistId) && !alert.readAt) {
        alert.readAt = now;
      }
    });
  }

  async deleteAlert(alertId: string): Promise<void> {
    await this.simulateDelay(50);
    this.alerts = this.alerts.filter(a => a.id !== alertId);
  }

  // Dashboard data
  async getDashboardData(userId: string): Promise<MonitoringDashboard> {
    await this.simulateDelay(200);
    
    const userWatchlists = await this.getWatchlists(userId);
    const alerts = await this.getAlerts();
    const unreadAlerts = alerts.filter(a => !a.readAt);
    const highPriorityAlerts = alerts.filter(a => a.severity === 'high' || a.severity === 'critical');
    
    return {
      alerts: alerts.slice(0, 10), // Recent 10 alerts
      watchlists: userWatchlists,
      globalStats: {
        totalAlerts: alerts.length,
        unreadAlerts: unreadAlerts.length,
        activeWatchlists: userWatchlists.filter(w => w.isActive).length,
        highPriorityAlerts: highPriorityAlerts.length
      },
      trendingTopics: [
        { topic: 'Machine Learning', alertCount: 45, trend: 'up', changePercent: 15.3 },
        { topic: 'Drug Discovery', alertCount: 32, trend: 'up', changePercent: 8.7 },
        { topic: 'Computer Vision', alertCount: 28, trend: 'stable', changePercent: 2.1 },
        { topic: 'Biotechnology', alertCount: 21, trend: 'down', changePercent: -5.4 }
      ],
      recentActivity: [
        {
          id: 'activity-1',
          type: 'alert',
          description: 'New high-priority alert for TechGiant Corp filing',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-2',
          type: 'watchlist_updated',
          description: 'Updated AI & Machine Learning Patents watchlist',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }

  // Competitor tracking
  async addCompetitor(competitorData: Omit<CompetitorProfile, 'id' | 'addedAt' | 'lastUpdated'>): Promise<CompetitorProfile> {
    await this.simulateDelay(300);
    
    const competitor: CompetitorProfile = {
      ...competitorData,
      id: `comp-${Date.now()}`,
      addedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    this.competitors.push(competitor);
    return competitor;
  }

  async updateCompetitor(id: string, updates: Partial<CompetitorProfile>): Promise<CompetitorProfile> {
    await this.simulateDelay(200);
    
    const index = this.competitors.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Competitor not found');
    }
    
    this.competitors[index] = {
      ...this.competitors[index],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    return this.competitors[index];
  }

  async removeCompetitor(id: string): Promise<void> {
    await this.simulateDelay(100);
    this.competitors = this.competitors.filter(c => c.id !== id);
  }

  async getCompetitors(userId: string): Promise<CompetitorProfile[]> {
    await this.simulateDelay(100);
    return [...this.competitors];
  }

  // Technology trends
  async getTechnologyTrends(filters?: any): Promise<TechnologyTrend[]> {
    await this.simulateDelay(300);
    
    // Mock technology trends data
    return [
      {
        id: 'trend-1',
        name: 'Machine Learning in Healthcare',
        description: 'AI and ML applications for medical diagnosis and treatment',
        keywords: ['machine learning', 'healthcare', 'medical AI', 'diagnosis'],
        classifications: ['G06N', 'A61B'],
        growthRate: 23.5,
        patentCount: 8420,
        patentGrowth: 18.7,
        topAssignees: [
          { name: 'TechGiant Corp', patentCount: 1245, marketShare: 14.8 },
          { name: 'MedTech Solutions', patentCount: 892, marketShare: 10.6 },
          { name: 'HealthAI Inc', patentCount: 634, marketShare: 7.5 }
        ],
        geographicDistribution: [
          { jurisdiction: 'US', patentCount: 3920, percentage: 46.5 },
          { jurisdiction: 'CN', patentCount: 2150, percentage: 25.5 },
          { jurisdiction: 'EP', patentCount: 1580, percentage: 18.8 }
        ],
        timeSeriesData: [],
        relatedTrends: ['Computer Vision in Medicine', 'AI Drug Discovery'],
        maturityLevel: 'growing',
        investmentScore: 85,
        riskScore: 35
      }
    ];
  }

  // Real-time monitoring
  async startMonitoring(watchlistId: string): Promise<void> {
    await this.simulateDelay(100);
    
    // Stop existing monitoring if any
    this.stopMonitoring(watchlistId);
    
    // Start new monitoring interval (simulate real-time checks)
    const interval = setInterval(() => {
      this.checkForNewAlerts(watchlistId);
    }, 60000); // Check every minute
    
    this.monitoringIntervals.set(watchlistId, interval);
  }

  async stopMonitoring(watchlistId: string): Promise<void> {
    const interval = this.monitoringIntervals.get(watchlistId);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(watchlistId);
    }
  }

  private async checkForNewAlerts(watchlistId: string) {
    // Simulate checking for new patents and generating alerts
    const watchlist = await this.getWatchlist(watchlistId);
    if (!watchlist || !watchlist.isActive) return;
    
    // Random chance of generating a new alert (for demo purposes)
    if (Math.random() < 0.1) { // 10% chance every minute
      const alertTypes: AlertType[] = ['new_patent', 'competitor_filing', 'patent_granted'];
      const severities: AlertSeverity[] = ['low', 'medium', 'high'];
      
      const newAlert: PatentAlert = {
        id: `alert-${Date.now()}`,
        title: this.generateAlertTitle(alertTypes[Math.floor(Math.random() * alertTypes.length)]),
        description: 'Real-time monitoring detected new patent activity',
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        patentId: `patent-${Date.now()}`,
        patentNumber: `US${10000000 + Math.floor(Math.random() * 1000000)}B2`,
        applicant: watchlist.filters.competitors[0] || 'Unknown Applicant',
        technology: watchlist.filters.keywords[0] || 'Technology',
        jurisdiction: watchlist.filters.jurisdictions[0] || 'US',
        createdAt: new Date().toISOString(),
        watchlistId: watchlistId,
        watchlistName: watchlist.name,
        metadata: {
          filingDate: new Date().toISOString(),
          inventors: ['Real-time Inventor'],
          claims: Math.floor(Math.random() * 20) + 5,
          similarityScore: Math.random() * 0.3 + 0.7,
          riskLevel: 'medium'
        }
      };
      
      this.alerts.unshift(newAlert);
      
      // Update watchlist statistics
      const watchlistIndex = this.watchlists.findIndex(w => w.id === watchlistId);
      if (watchlistIndex !== -1) {
        this.watchlists[watchlistIndex].statistics.totalAlerts++;
        this.watchlists[watchlistIndex].statistics.alertsLast30Days++;
        this.watchlists[watchlistIndex].statistics.lastAlertDate = new Date().toISOString();
      }
      
      // Trigger notification if enabled
      if (watchlist.alertSettings.emailNotifications) {
        this.sendEmailNotification(newAlert);
      }
    }
  }

  private async sendEmailNotification(alert: PatentAlert) {
    // Mock email sending
    console.log(`📧 Email notification sent for alert: ${alert.title}`);
  }

  // Alert rules
  async createAlertRule(ruleData: Omit<AlertRule, 'id' | 'createdAt' | 'triggerCount'>): Promise<AlertRule> {
    await this.simulateDelay(200);
    
    const rule: AlertRule = {
      ...ruleData,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString(),
      triggerCount: 0
    };
    
    this.alertRules.push(rule);
    return rule;
  }

  async updateAlertRule(id: string, updates: Partial<AlertRule>): Promise<AlertRule> {
    await this.simulateDelay(150);
    
    const index = this.alertRules.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Alert rule not found');
    }
    
    this.alertRules[index] = { ...this.alertRules[index], ...updates };
    return this.alertRules[index];
  }

  async deleteAlertRule(id: string): Promise<void> {
    await this.simulateDelay(100);
    this.alertRules = this.alertRules.filter(r => r.id !== id);
  }

  async getAlertRules(watchlistId: string): Promise<AlertRule[]> {
    await this.simulateDelay(100);
    return this.alertRules.filter(r => r.watchlistId === watchlistId);
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const patentMonitoringService = new PatentMonitoringServiceImpl();