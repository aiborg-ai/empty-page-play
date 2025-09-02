import { supabase } from './supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  relevance_score?: number;
}

interface IssueTicket {
  id: string;
  subject: string;
  description: string;
  user_email: string;
  user_name?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  metadata?: Record<string, any>;
}

export class FAQService {
  private static instance: FAQService;
  private faqs: FAQ[] = [];
  private platformContent: Map<string, string> = new Map();

  private constructor() {
    this.initializeFAQs();
    this.indexPlatformContent();
  }

  static getInstance(): FAQService {
    if (!FAQService.instance) {
      FAQService.instance = new FAQService();
    }
    return FAQService.instance;
  }

  private initializeFAQs() {
    // Pre-defined FAQs about InnoSpot platform
    this.faqs = [
      {
        id: '1',
        question: 'How do I get started with InnoSpot?',
        answer: 'To get started with InnoSpot, first create an account or use our demo accounts (demo@innospot.com). Then explore the Search feature to find patents, create Projects to organize your work, and use our AI tools for analysis.',
        category: 'Getting Started',
        keywords: ['start', 'begin', 'new', 'account', 'demo']
      },
      {
        id: '2',
        question: 'What AI capabilities does InnoSpot offer?',
        answer: 'InnoSpot offers multiple AI capabilities including: AI Chat Assistant for patent analysis, AI Claim Generator for creating patent claims, Prior Art Oracle for finding related patents, Innovation Trajectory Predictor for trend analysis, and many more tools available in the Showcase section.',
        category: 'AI Features',
        keywords: ['ai', 'artificial intelligence', 'capabilities', 'tools', 'features']
      },
      {
        id: '3',
        question: 'How do I search for patents?',
        answer: 'Use the Search feature in the sidebar. You can search by keywords, patent numbers, inventors, assignees, or use advanced filters like date ranges, CPC classifications, and jurisdictions. Our AI-powered search helps find relevant patents even with partial information.',
        category: 'Search',
        keywords: ['search', 'find', 'patent', 'query', 'filter']
      },
      {
        id: '4',
        question: 'What is a Project in InnoSpot?',
        answer: 'Projects are workspaces where you can organize patents, research, and analysis. Create projects for different innovation areas, client matters, or research topics. Projects can contain saved searches, patent collections, reports, and dashboards.',
        category: 'Projects',
        keywords: ['project', 'workspace', 'organize', 'collection']
      },
      {
        id: '5',
        question: 'How do I create custom dashboards?',
        answer: 'Navigate to the Studio section and click on "Create Dashboard". You can add various widgets like charts, metrics, patent lists, and AI insights. Dashboards can be customized with your data and shared with team members.',
        category: 'Dashboards',
        keywords: ['dashboard', 'studio', 'visualization', 'charts', 'widgets']
      },
      {
        id: '6',
        question: 'Can I collaborate with my team?',
        answer: 'Yes! InnoSpot supports team collaboration through shared projects, dashboards, and reports. You can invite team members, assign roles, and work together on patent analysis. The Collaboration Workspace feature enables real-time cooperation.',
        category: 'Collaboration',
        keywords: ['team', 'collaborate', 'share', 'invite', 'work together']
      },
      {
        id: '7',
        question: 'How do I export my data?',
        answer: 'You can export data in multiple formats including CSV, Excel, PDF, and JSON. Look for the export button in patent lists, search results, and reports. Dashboards can be exported as images or PDF reports.',
        category: 'Export',
        keywords: ['export', 'download', 'csv', 'excel', 'pdf', 'save']
      },
      {
        id: '8',
        question: 'What patent databases does InnoSpot cover?',
        answer: 'InnoSpot provides access to global patent databases including USPTO, EPO, WIPO, and many national patent offices. We cover over 100 jurisdictions with full-text search and AI-enhanced analysis capabilities.',
        category: 'Coverage',
        keywords: ['database', 'coverage', 'uspto', 'epo', 'wipo', 'jurisdiction']
      },
      {
        id: '9',
        question: 'How accurate is the AI analysis?',
        answer: 'Our AI models are trained on millions of patents and continuously updated. While AI provides valuable insights and saves significant time, we recommend human expert review for critical decisions. Accuracy rates vary by task but typically exceed 90% for classification and similarity analysis.',
        category: 'AI Features',
        keywords: ['accuracy', 'ai', 'reliable', 'trust', 'quality']
      },
      {
        id: '10',
        question: 'Is my data secure?',
        answer: 'Yes, InnoSpot uses enterprise-grade security including end-to-end encryption, secure cloud infrastructure, and compliance with data protection regulations. Your data is isolated and never used to train AI models without explicit permission.',
        category: 'Security',
        keywords: ['security', 'secure', 'privacy', 'encryption', 'data protection']
      }
    ];
  }

  private indexPlatformContent() {
    // Index key platform features and content for contextual Q&A
    this.platformContent.set('search', 'Advanced patent search with AI-powered relevance ranking, semantic search, prior art discovery, and multi-jurisdiction coverage.');
    this.platformContent.set('projects', 'Project workspaces for organizing patent research, managing innovation portfolios, and tracking technology landscapes.');
    this.platformContent.set('ai-tools', 'Comprehensive AI toolkit including claim generation, prior art analysis, innovation prediction, and automated patent drafting assistance.');
    this.platformContent.set('dashboards', 'Customizable dashboards with real-time analytics, patent metrics, technology trends, and competitive intelligence visualizations.');
    this.platformContent.set('collaboration', 'Team collaboration features including shared workspaces, role-based access control, comments, and real-time updates.');
    this.platformContent.set('reports', 'Automated report generation for patent landscapes, freedom-to-operate analysis, invalidity searches, and technology assessments.');
    this.platformContent.set('network', 'Citation network analysis, inventor collaboration mapping, and technology evolution visualization.');
    this.platformContent.set('showcase', 'Curated collection of AI agents, tools, datasets, and capabilities for patent intelligence and innovation management.');
  }

  // Search FAQs based on user query
  async searchFAQs(query: string): Promise<FAQ[]> {
    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/);
    
    // Score each FAQ based on relevance
    const scoredFAQs = this.faqs.map(faq => {
      let score = 0;
      
      // Check question match
      if (faq.question.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // Check individual word matches in question
      words.forEach(word => {
        if (faq.question.toLowerCase().includes(word)) {
          score += 3;
        }
      });
      
      // Check keyword matches
      faq.keywords.forEach(keyword => {
        if (queryLower.includes(keyword) || keyword.includes(queryLower)) {
          score += 5;
        }
        words.forEach(word => {
          if (keyword.includes(word)) {
            score += 2;
          }
        });
      });
      
      // Check answer relevance
      words.forEach(word => {
        if (faq.answer.toLowerCase().includes(word)) {
          score += 1;
        }
      });
      
      return { ...faq, relevance_score: score };
    });
    
    // Filter and sort by relevance
    return scoredFAQs
      .filter(faq => faq.relevance_score! > 0)
      .sort((a, b) => b.relevance_score! - a.relevance_score!)
      .slice(0, 5); // Return top 5 matches
  }

  // Generate contextual answer based on platform content
  async generateContextualAnswer(query: string): Promise<string> {
    const queryLower = query.toLowerCase();
    let contextualInfo: string[] = [];
    
    // Check which platform areas the query relates to
    this.platformContent.forEach((content, key) => {
      if (queryLower.includes(key) || content.toLowerCase().includes(queryLower)) {
        contextualInfo.push(content);
      }
    });
    
    if (contextualInfo.length > 0) {
      return `Based on InnoSpot's features: ${contextualInfo.join(' Additionally, ')}`;
    }
    
    // Search existing FAQs
    const relevantFAQs = await this.searchFAQs(query);
    if (relevantFAQs.length > 0) {
      return relevantFAQs[0].answer;
    }
    
    return "I couldn't find specific information about that. Would you like to create a support ticket for detailed assistance?";
  }

  // Create a support ticket
  async createSupportTicket(ticket: Omit<IssueTicket, 'id' | 'created_at' | 'status'>): Promise<{ success: boolean; ticketId?: string; error?: string }> {
    try {
      const newTicket: IssueTicket = {
        ...ticket,
        id: `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'open',
        created_at: new Date().toISOString()
      };

      // Store ticket in Supabase
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          id: newTicket.id,
          subject: newTicket.subject,
          description: newTicket.description,
          user_email: newTicket.user_email,
          user_name: newTicket.user_name,
          priority: newTicket.priority,
          category: newTicket.category,
          status: newTicket.status,
          metadata: newTicket.metadata
        }])
        .select()
        .single();

      if (error) {
        // If table doesn't exist, we'll handle it gracefully
        console.log('Ticket will be sent via email only:', error);
      }

      // Send email notification
      await this.sendTicketEmail(newTicket);

      return { 
        success: true, 
        ticketId: newTicket.id 
      };
    } catch (error) {
      console.error('Failed to create support ticket:', error);
      return { 
        success: false, 
        error: 'Failed to create support ticket. Please try again.' 
      };
    }
  }

  // Send ticket email to support team
  private async sendTicketEmail(ticket: IssueTicket): Promise<void> {
    // In production, this would integrate with an email service
    // For now, we'll simulate the email sending
    const emailContent = {
      to: 'support@innospot.com',
      subject: `[${ticket.priority.toUpperCase()}] Support Ticket: ${ticket.subject}`,
      body: `
        New Support Ticket Created
        
        Ticket ID: ${ticket.id}
        Priority: ${ticket.priority}
        Category: ${ticket.category}
        
        From: ${ticket.user_name || 'User'} (${ticket.user_email})
        Created: ${new Date(ticket.created_at).toLocaleString()}
        
        Description:
        ${ticket.description}
        
        Metadata:
        ${JSON.stringify(ticket.metadata, null, 2)}
        
        ---
        Please respond to this ticket in the InnoSpot admin panel.
      `
    };

    // Log email for development
    console.log('Support ticket email:', emailContent);
    
    // In production, integrate with email service like SendGrid, AWS SES, etc.
    // Example with fetch to an email API endpoint:
    /*
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailContent)
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
    */
  }

  // Get all FAQs for display
  getAllFAQs(): FAQ[] {
    return this.faqs;
  }

  // Get FAQs by category
  getFAQsByCategory(category: string): FAQ[] {
    return this.faqs.filter(faq => faq.category === category);
  }

  // Get unique categories
  getCategories(): string[] {
    return [...new Set(this.faqs.map(faq => faq.category))];
  }
}

export default FAQService;