import { UnifiedLLMService } from './llmService';
import type { LandscapeMonitor, MonitorAlert } from '../types/innovations';

export class LandscapeMonitoringService {
  private llmService: UnifiedLLMService;
  private activeMonitors: Map<string, LandscapeMonitor> = new Map();

  constructor() {
    this.llmService = UnifiedLLMService.getInstance();
  }

  async createMonitor(config: {
    name: string;
    keywords: string[];
    competitors: string[];
    technologyAreas: string[];
    alertSettings: {
      frequency: 'daily' | 'weekly' | 'monthly';
      threshold: number;
      channels: ('email' | 'push' | 'slack')[];
    };
  }): Promise<LandscapeMonitor> {
    const monitor: LandscapeMonitor = {
      id: `monitor_${Date.now()}`,
      name: config.name,
      keywords: config.keywords,
      competitors: config.competitors,
      technologyAreas: config.technologyAreas,
      alertSettings: {
        ...config.alertSettings,
        filters: []
      },
      lastRun: new Date().toISOString(),
      nextRun: this.calculateNextRun(config.alertSettings.frequency),
      alerts: []
    };

    this.activeMonitors.set(monitor.id, monitor);
    return monitor;
  }

  async runMonitor(monitorId: string): Promise<MonitorAlert[]> {
    const monitor = this.activeMonitors.get(monitorId);
    if (!monitor) {
      throw new Error('Monitor not found');
    }

    try {
      const alerts = await this.generateAlerts(monitor);
      
      // Update monitor
      monitor.alerts = [...monitor.alerts, ...alerts];
      monitor.lastRun = new Date().toISOString();
      monitor.nextRun = this.calculateNextRun(monitor.alertSettings.frequency);
      
      this.activeMonitors.set(monitorId, monitor);
      return alerts;
    } catch (error) {
      throw new Error(`Failed to run monitor: ${error}`);
    }
  }

  private async generateAlerts(monitor: LandscapeMonitor): Promise<MonitorAlert[]> {
    const prompt = `
    Monitor patent landscape for the following:
    
    **Keywords:** ${monitor.keywords.join(', ')}
    **Competitors:** ${monitor.competitors.join(', ')}
    **Technology Areas:** ${monitor.technologyAreas.join(', ')}
    
    Generate realistic patent landscape alerts including:
    1. New patent filings
    2. Competitor activity
    3. Technology trend changes
    4. New opportunities
    
    Format as JSON array:
    [
      {
        "type": "new_filing",
        "severity": "high",
        "title": "Critical New Patent Filing",
        "description": "Competitor filed patent in core technology area",
        "patentIds": ["US987654"],
        "actionRequired": true
      }
    ]
    `;

    try {
      const response = await this.llmService.sendMessage([
        {
          role: 'system',
          content: 'You are a patent landscape monitoring AI. Generate realistic alerts based on market activity.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const alertsData = this.parseAlertsResponse(response.content);
      
      return alertsData.map(alert => ({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        patentIds: alert.patentIds || [],
        actionRequired: alert.actionRequired || false,
        createdAt: new Date().toISOString()
      }));
    } catch (error) {
      // Generate fallback alerts
      return this.generateFallbackAlerts(monitor);
    }
  }

  private parseAlertsResponse(response: string): any[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch {
      return [];
    }
  }

  private generateFallbackAlerts(monitor: LandscapeMonitor): MonitorAlert[] {
    const alerts: MonitorAlert[] = [];
    
    // Generate some mock alerts based on monitor configuration
    if (monitor.competitors.length > 0) {
      alerts.push({
        id: `alert_${Date.now()}_1`,
        type: 'competitor_activity',
        severity: 'medium',
        title: `New Activity from ${monitor.competitors[0]}`,
        description: `${monitor.competitors[0]} has increased patent filing activity in ${monitor.technologyAreas[0]}`,
        patentIds: [`US${Math.floor(Math.random() * 9000000) + 1000000}`],
        actionRequired: true,
        createdAt: new Date().toISOString()
      });
    }

    if (monitor.keywords.length > 0) {
      alerts.push({
        id: `alert_${Date.now()}_2`,
        type: 'trend_change',
        severity: 'low',
        title: `Trending Technology: ${monitor.keywords[0]}`,
        description: `Increased patent activity around "${monitor.keywords[0]}" technology`,
        patentIds: [],
        actionRequired: false,
        createdAt: new Date().toISOString()
      });
    }

    return alerts;
  }

  private calculateNextRun(frequency: 'daily' | 'weekly' | 'monthly'): string {
    const now = new Date();
    const nextRun = new Date(now);
    
    switch (frequency) {
      case 'daily':
        nextRun.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        nextRun.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        nextRun.setMonth(now.getMonth() + 1);
        break;
    }
    
    return nextRun.toISOString();
  }

  getActiveMonitors(): LandscapeMonitor[] {
    return Array.from(this.activeMonitors.values());
  }

  async deleteMonitor(monitorId: string): Promise<boolean> {
    return this.activeMonitors.delete(monitorId);
  }

  async acknowledgeAlert(monitorId: string, alertId: string): Promise<boolean> {
    const monitor = this.activeMonitors.get(monitorId);
    if (!monitor) return false;

    const alert = monitor.alerts.find(a => a.id === alertId);
    if (!alert) return false;

    alert.acknowledgedAt = new Date().toISOString();
    this.activeMonitors.set(monitorId, monitor);
    return true;
  }
}