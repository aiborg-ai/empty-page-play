/**
 * Live Demo Service
 * Provides instant demo access without any authentication
 * Perfect for prospects to explore the platform
 */

import { InstantUser } from './instantAuth';

export interface DemoSession {
  user: InstantUser;
  startedAt: Date;
  expiresAt: Date;
  features: string[];
}

class LiveDemoService {
  private static instance: LiveDemoService;
  private currentSession: DemoSession | null = null;
  private readonly DEMO_DURATION_HOURS = 24; // Demo lasts 24 hours

  private constructor() {
    this.checkExistingSession();
  }

  static getInstance(): LiveDemoService {
    if (!LiveDemoService.instance) {
      LiveDemoService.instance = new LiveDemoService();
    }
    return LiveDemoService.instance;
  }

  /**
   * Start a live demo session instantly
   * No login, no signup, just explore!
   */
  startLiveDemo(): DemoSession {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.DEMO_DURATION_HOURS * 60 * 60 * 1000);

    // Generate a unique demo user
    const demoUser: InstantUser = {
      id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: `demo_${Date.now()}@innospot.live`,
      displayName: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      accountType: 'trial',
      isDemo: true
    };

    this.currentSession = {
      user: demoUser,
      startedAt: now,
      expiresAt,
      features: [
        'Full Patent Database Access',
        'AI Chat Assistant',
        'Advanced Analytics',
        '3D Citation Visualization',
        'Competitive Intelligence',
        'Innovation Hub',
        'Sample Projects & Dashboards',
        'Export Capabilities'
      ]
    };

    // Store in localStorage
    this.saveSession();

    // Track demo start (for analytics)
    this.trackDemoStart();

    return this.currentSession;
  }

  /**
   * Get current demo session
   */
  getCurrentSession(): DemoSession | null {
    if (!this.currentSession) {
      this.checkExistingSession();
    }

    // Check if session expired
    if (this.currentSession && new Date() > this.currentSession.expiresAt) {
      this.endSession();
      return null;
    }

    return this.currentSession;
  }

  /**
   * Check if demo mode is active
   */
  isDemoActive(): boolean {
    const session = this.getCurrentSession();
    return session !== null;
  }

  /**
   * Get demo user
   */
  getDemoUser(): InstantUser | null {
    const session = this.getCurrentSession();
    return session?.user || null;
  }

  /**
   * End demo session
   */
  endSession(): void {
    this.currentSession = null;
    localStorage.removeItem('liveDemoSession');
    localStorage.removeItem('currentUser');
    
    // Track demo end (for analytics)
    this.trackDemoEnd();
  }

  /**
   * Get remaining demo time
   */
  getRemainingTime(): { hours: number; minutes: number } | null {
    const session = this.getCurrentSession();
    if (!session) return null;

    const now = new Date();
    const remaining = session.expiresAt.getTime() - now.getTime();
    
    if (remaining <= 0) {
      this.endSession();
      return null;
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  }

  /**
   * Get demo limitations/restrictions
   */
  getDemoLimitations(): string[] {
    return [
      'Data is read-only (no permanent saves)',
      'Sample dataset (not full database)',
      'Session expires in 24 hours',
      'Some premium features limited',
      'No collaboration features'
    ];
  }

  /**
   * Check for existing session in localStorage
   */
  private checkExistingSession(): void {
    const stored = localStorage.getItem('liveDemoSession');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        session.startedAt = new Date(session.startedAt);
        session.expiresAt = new Date(session.expiresAt);
        
        // Check if still valid
        if (new Date() < session.expiresAt) {
          this.currentSession = session;
        } else {
          this.endSession();
        }
      } catch (error) {
        console.error('Failed to restore demo session:', error);
        this.endSession();
      }
    }
  }

  /**
   * Save session to localStorage
   */
  private saveSession(): void {
    if (this.currentSession) {
      localStorage.setItem('liveDemoSession', JSON.stringify(this.currentSession));
      localStorage.setItem('currentUser', JSON.stringify(this.currentSession.user));
    }
  }

  /**
   * Track demo start for analytics
   */
  private trackDemoStart(): void {
    // Analytics tracking
    console.log('📊 Demo Started:', {
      timestamp: new Date().toISOString(),
      sessionId: this.currentSession?.user.id,
      source: window.location.hostname
    });

    // You can add actual analytics here (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'demo_start', {
        event_category: 'engagement',
        event_label: 'live_demo'
      });
    }
  }

  /**
   * Track demo end for analytics
   */
  private trackDemoEnd(): void {
    console.log('📊 Demo Ended:', {
      timestamp: new Date().toISOString(),
      sessionId: this.currentSession?.user.id
    });

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'demo_end', {
        event_category: 'engagement',
        event_label: 'live_demo'
      });
    }
  }

  /**
   * Generate sample data for demo
   */
  generateDemoData(): any {
    return {
      projects: [
        {
          id: 'demo-project-1',
          name: 'Battery Innovation Portfolio',
          description: 'Next-gen battery technology patents',
          assetCount: 47,
          lastModified: '2 hours ago'
        },
        {
          id: 'demo-project-2',
          name: 'AI Healthcare Solutions',
          description: 'Medical AI patent landscape',
          assetCount: 132,
          lastModified: '1 day ago'
        },
        {
          id: 'demo-project-3',
          name: 'Quantum Computing Research',
          description: 'Quantum algorithm patents',
          assetCount: 28,
          lastModified: '3 days ago'
        }
      ],
      recentSearches: [
        'lithium ion battery management',
        'machine learning diagnosis',
        'quantum encryption',
        'sustainable energy storage',
        'neural network optimization'
      ],
      dashboards: [
        {
          id: 'demo-dash-1',
          name: 'Technology Landscape Overview',
          charts: 8,
          lastUpdated: '1 hour ago'
        },
        {
          id: 'demo-dash-2',
          name: 'Competitive Intelligence Report',
          charts: 12,
          lastUpdated: '3 hours ago'
        }
      ]
    };
  }
}

// Export singleton instance
export const liveDemoService = LiveDemoService.getInstance();

// Export convenience functions
export const startLiveDemo = () => liveDemoService.startLiveDemo();
export const isDemoActive = () => liveDemoService.isDemoActive();
export const getDemoUser = () => liveDemoService.getDemoUser();
export const endDemoSession = () => liveDemoService.endSession();
export const getDemoRemainingTime = () => liveDemoService.getRemainingTime();
export const getDemoData = () => liveDemoService.generateDemoData();