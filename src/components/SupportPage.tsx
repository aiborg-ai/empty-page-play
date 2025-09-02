import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Briefcase, 
  Eye, 
  Bot,
  FileText,
  MessageSquare,
  Sparkles,
  Network,
  Shield,
  Zap,
  BookOpen,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface SupportSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  features: {
    name: string;
    description: string;
    tips?: string[];
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
}

const supportSections: SupportSection[] = [
  {
    id: 'search',
    title: 'Search',
    icon: Search,
    description: 'Powerful patent search capabilities with advanced filters and AI-enhanced discovery.',
    features: [
      {
        name: 'Quick Search',
        description: 'Search across millions of patents using keywords, patent numbers, or inventors.',
        tips: [
          'Use quotation marks for exact phrase matching',
          'Combine terms with AND, OR, NOT operators',
          'Use wildcards (*) for partial matches'
        ]
      },
      {
        name: 'Advanced Filters',
        description: 'Refine results by date, jurisdiction, IPC classification, and more.',
        tips: [
          'Save frequently used filter combinations',
          'Export search results to Collections',
          'Set up alerts for new matching patents'
        ]
      },
      {
        name: 'Semantic Search',
        description: 'AI-powered search that understands context and technical concepts.',
        tips: [
          'Describe innovations in natural language',
          'Find similar patents using example documents',
          'Discover related technologies automatically'
        ]
      }
    ],
    faq: [
      {
        question: 'How do I search for patents by a specific inventor?',
        answer: 'Use the Advanced Filters and select "Inventor" field, then enter the inventor name. You can use partial matches or exact names.'
      },
      {
        question: 'Can I save my search queries?',
        answer: 'Yes! Click the "Save Search" button after running a query. Saved searches appear in your Collections.'
      }
    ]
  },
  {
    id: 'work-area',
    title: 'Work Area',
    icon: Briefcase,
    description: 'Your personal workspace for managing projects, collections, and patent analyses.',
    features: [
      {
        name: 'Projects',
        description: 'Organize your patent research into focused projects with team collaboration.',
        tips: [
          'Create project templates for recurring workflows',
          'Invite team members with specific permissions',
          'Track project milestones and deadlines'
        ]
      },
      {
        name: 'Collections',
        description: 'Group related patents and documents for easy reference and analysis.',
        tips: [
          'Drag and drop patents into collections',
          'Share collections with collaborators',
          'Export collections in multiple formats'
        ]
      },
      {
        name: 'Analytics Dashboard',
        description: 'Visualize patent trends, technology landscapes, and competitive intelligence.',
        tips: [
          'Customize dashboard widgets',
          'Schedule automated reports',
          'Compare multiple portfolios side-by-side'
        ]
      }
    ]
  },
  {
    id: 'showcase',
    title: 'Showcase',
    icon: Eye,
    description: 'Discover and run powerful tools, AI agents, and analytical capabilities.',
    features: [
      {
        name: 'AI Agents',
        description: 'Specialized AI assistants for patent analysis, claims generation, and more.',
        tips: [
          'Configure agents with your preferences',
          'Chain multiple agents for complex workflows',
          'Review and edit AI-generated content'
        ]
      },
      {
        name: 'Tools',
        description: 'Professional-grade tools for patent visualization, analysis, and management.',
        tips: [
          'Access tools directly from search results',
          'Integrate tools into your workflows',
          'Export tool outputs to reports'
        ]
      },
      {
        name: 'Datasets',
        description: 'Curated patent datasets and data dictionaries for research and analysis.',
        tips: [
          'Download datasets in multiple formats',
          'Use data dictionaries for field definitions',
          'Combine datasets for comprehensive analysis'
        ]
      }
    ]
  },
  {
    id: 'studio',
    title: 'Studio',
    icon: Sparkles,
    description: 'Create custom dashboards, configure AI agents, and build automated workflows.',
    features: [
      {
        name: 'Dashboard Builder',
        description: 'Design interactive dashboards with drag-and-drop components.',
        tips: [
          'Use pre-built templates to start quickly',
          'Connect live data sources',
          'Share dashboards with stakeholders'
        ]
      },
      {
        name: 'AI Configuration',
        description: 'Customize AI agents with specific prompts and parameters.',
        tips: [
          'Test configurations with sample data',
          'Version control your AI configurations',
          'Monitor AI performance metrics'
        ]
      },
      {
        name: 'Workflow Automation',
        description: 'Build automated pipelines for patent monitoring and analysis.',
        tips: [
          'Set triggers based on events or schedules',
          'Chain multiple actions together',
          'Receive notifications on completion'
        ]
      }
    ]
  },
  {
    id: 'network',
    title: 'Network',
    icon: Network,
    description: 'Connect with professionals, find experts, and collaborate on innovation.',
    features: [
      {
        name: 'Professional Directory',
        description: 'Find and connect with patent attorneys, researchers, and industry experts.',
        tips: [
          'Filter by expertise and location',
          'View professional credentials and experience',
          'Send direct collaboration requests'
        ]
      },
      {
        name: 'Team Collaboration',
        description: 'Work together on patent projects with real-time updates.',
        tips: [
          'Create team workspaces',
          'Assign roles and permissions',
          'Track team activity and contributions'
        ]
      },
      {
        name: 'Expert Network',
        description: 'Access specialized knowledge from domain experts.',
        tips: [
          'Request expert reviews',
          'Schedule consultations',
          'Join expert-led discussions'
        ]
      }
    ]
  },
  {
    id: 'messages',
    title: 'Messages',
    icon: MessageSquare,
    description: 'Communicate with team members and collaborators securely.',
    features: [
      {
        name: 'Direct Messages',
        description: 'Private conversations with team members and contacts.',
        tips: [
          'Share patents and documents in chat',
          'Create message threads for topics',
          'Set message notifications preferences'
        ]
      },
      {
        name: 'Group Discussions',
        description: 'Collaborate in channels organized by project or topic.',
        tips: [
          'Pin important messages',
          'Use @mentions to notify team members',
          'Search message history'
        ]
      }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: FileText,
    description: 'Generate comprehensive patent reports and analytics.',
    features: [
      {
        name: 'Automated Reports',
        description: 'Schedule and generate reports automatically.',
        tips: [
          'Choose from report templates',
          'Customize report sections',
          'Set delivery schedules'
        ]
      },
      {
        name: 'Custom Analysis',
        description: 'Build tailored reports with specific metrics and visualizations.',
        tips: [
          'Select data sources and filters',
          'Add charts and graphs',
          'Export in multiple formats (PDF, Excel, PowerPoint)'
        ]
      }
    ]
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    icon: Bot,
    description: 'Your intelligent assistant for patent research and analysis.',
    features: [
      {
        name: 'Natural Language Queries',
        description: 'Ask questions in plain English about patents and technologies.',
        tips: [
          'Ask for patent summaries',
          'Request prior art searches',
          'Get technology explanations'
        ]
      },
      {
        name: 'Context-Aware Help',
        description: 'AI understands your current work context for relevant assistance.',
        tips: [
          'Reference current search results',
          'Ask about selected patents',
          'Request analysis of collections'
        ]
      }
    ]
  },
  {
    id: 'decision-engines',
    title: 'Decision Engines',
    icon: Zap,
    description: 'Advanced analytical engines for strategic patent decisions.',
    features: [
      {
        name: 'Portfolio Optimization',
        description: 'Analyze and optimize your patent portfolio strategy.',
        tips: [
          'Identify high-value patents',
          'Find gaps in coverage',
          'Plan filing strategies'
        ]
      },
      {
        name: 'Risk Assessment',
        description: 'Evaluate infringement risks and freedom to operate.',
        tips: [
          'Run clearance searches',
          'Assess litigation probability',
          'Monitor competitor activities'
        ]
      },
      {
        name: 'Innovation Forecasting',
        description: 'Predict technology trends and emerging innovations.',
        tips: [
          'Analyze filing trends',
          'Identify emerging players',
          'Forecast technology convergence'
        ]
      }
    ]
  }
];

interface SupportPageProps {
  initialSection?: string;
}

export default function SupportPage({ initialSection }: SupportPageProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(initialSection || null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSection = selectedSection 
    ? supportSections.find(s => s.id === selectedSection)
    : null;

  const filteredSections = supportSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.features.some(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (currentSection) {
    return (
      <div className="h-full bg-gray-50 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm h-full overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
              <button
                onClick={() => setSelectedSection(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Support Center
              </button>
              <div className="flex items-center gap-3">
                <currentSection.icon className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentSection.title}</h1>
                  <p className="text-gray-600 mt-1">{currentSection.description}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Capabilities</h2>
                  <div className="space-y-6">
                    {currentSection.features.map((feature, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-medium text-gray-900 mb-2">{feature.name}</h3>
                        <p className="text-gray-600 mb-3">{feature.description}</p>
                        {feature.tips && feature.tips.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Pro Tips:</h4>
                            <ul className="space-y-1">
                              {feature.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-start gap-2 text-sm text-blue-800">
                                  <span className="text-blue-600 mt-0.5">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {currentSection.faq && currentSection.faq.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {currentSection.faq.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                          <p className="text-gray-600">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-2">Need More Help?</h3>
                  <p className="text-gray-600 mb-4">
                    Our support team is here to assist you with any questions or issues.
                  </p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Contact Support
                    </button>
                    <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300">
                      View Documentation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm h-full overflow-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
                  <p className="text-gray-600 mt-1">Get help with all InnoSpot features and capabilities</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-blue-500 text-left group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{section.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {section.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {feature.name}
                        </span>
                      ))}
                      {section.features.length > 2 && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          +{section.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
                <p className="mb-6 text-blue-100">
                  Our support team is available to help you with any questions or technical issues.
                  We're committed to ensuring you get the most out of InnoSpot.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    Contact Support Team
                  </button>
                  <button className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
                    Browse Documentation
                  </button>
                  <button className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
                    Watch Tutorials
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Getting Started Guide</h3>
                <p className="text-sm text-gray-600 mb-4">
                  New to InnoSpot? Start here with our comprehensive onboarding guide.
                </p>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Guide →
                </a>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <Zap className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Quick Tips</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Learn keyboard shortcuts and productivity tips to work faster.
                </p>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Tips →
                </a>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <Shield className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Security & Privacy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Learn about our security measures and data protection policies.
                </p>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}