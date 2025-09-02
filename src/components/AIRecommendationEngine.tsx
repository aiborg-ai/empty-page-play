import React, { useState, useEffect } from 'react';
import {
  Brain,
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  Clock,
  Star,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
  Sparkles,
  FileText
} from 'lucide-react';
import type { NetworkContact } from '../types/network';

interface AIRecommendation {
  id: string;
  type: 'connection' | 'collaboration' | 'patent_opportunity' | 'market_insight' | 'skill_gap' | 'trend_alert';
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  title: string;
  description: string;
  reasoning: string[];
  
  // Specific data based on type
  target_contact?: NetworkContact;
  suggested_actions: RecommendedAction[];
  related_patents?: string[];
  technology_areas?: string[];
  market_size?: number;
  timeline?: string;
  
  // Metadata
  created_at: string;
  expires_at?: string;
  viewed: boolean;
  acted_upon: boolean;
  feedback?: 'helpful' | 'not_helpful' | 'partially_helpful';
}

interface RecommendedAction {
  id: string;
  action: string;
  description: string;
  estimated_time: string;
  impact_score: number; // 1-10
  complexity: 'low' | 'medium' | 'high';
  prerequisites?: string[];
}

interface AIInsight {
  id: string;
  category: 'network_analysis' | 'market_trends' | 'patent_landscape' | 'collaboration_opportunities';
  title: string;
  summary: string;
  confidence: number;
  data_points: number;
  last_updated: string;
  trend: 'up' | 'down' | 'stable';
  impact: 'low' | 'medium' | 'high';
}

interface AIRecommendationEngineProps {
  contacts: NetworkContact[];
  onRecommendationAction?: (recommendationId: string, actionId: string) => void;
  onFeedback?: (recommendationId: string, feedback: 'helpful' | 'not_helpful' | 'partially_helpful') => void;
}

const AIRecommendationEngine: React.FC<AIRecommendationEngineProps> = ({ 
  contacts, 
  onRecommendationAction,
  onFeedback 
}) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, [contacts]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    setIsGenerating(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newRecommendations = await generateAIRecommendations();
      const newInsights = await generateAIInsights();
      
      setRecommendations(newRecommendations);
      setInsights(newInsights);
      
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const generateAIRecommendations = async (): Promise<AIRecommendation[]> => {
    const recommendations: AIRecommendation[] = [];

    // High-potential collaboration recommendations
    const highPotentialContacts = contacts
      .filter(c => c.collaboration_potential > 80 && c.connection_status !== 'close_collaborator')
      .slice(0, 3);

    highPotentialContacts.forEach((contact, index) => {
      recommendations.push({
        id: `collab_${index + 1}`,
        type: 'collaboration',
        priority: 'high',
        confidence: contact.collaboration_potential,
        title: `High-Value Collaboration Opportunity with ${contact.display_name}`,
        description: `${contact.display_name} shows exceptional collaboration potential (${contact.collaboration_potential}%) in ${contact.expertise_areas[0]?.name || 'shared technology areas'}.`,
        reasoning: [
          `Shared expertise in ${contact.expertise_areas.slice(0, 2).map(e => e.name).join(' and ')}`,
          `High innovation score (${contact.innovation_score}/100)`,
          `Strong patent portfolio (${contact.patent_profile.total_patents} patents)`,
          `Excellent response rate (${contact.response_rate}%)`
        ],
        target_contact: contact,
        suggested_actions: [
          {
            id: 'send_intro',
            action: 'Send Introduction Message',
            description: 'Craft a personalized message highlighting shared interests',
            estimated_time: '15 minutes',
            impact_score: 8,
            complexity: 'low'
          },
          {
            id: 'propose_project',
            action: 'Propose Joint Project',
            description: 'Suggest a collaborative patent application or research project',
            estimated_time: '2 hours',
            impact_score: 10,
            complexity: 'medium'
          }
        ],
        technology_areas: contact.expertise_areas.map(e => e.name),
        timeline: '2-4 weeks',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        viewed: false,
        acted_upon: false
      });
    });

    // Patent opportunity recommendations
    const patentOpportunities = generatePatentOpportunities();
    recommendations.push(...patentOpportunities);

    // Market insight recommendations
    const marketInsights = generateMarketInsights();
    recommendations.push(...marketInsights);

    // Skill gap analysis
    const skillGaps = generateSkillGapAnalysis();
    recommendations.push(...skillGaps);

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || b.confidence - a.confidence;
    });
  };

  const generatePatentOpportunities = (): AIRecommendation[] => {
    return [
      {
        id: 'patent_opp_1',
        type: 'patent_opportunity',
        priority: 'medium',
        confidence: 78,
        title: 'Emerging Patent Gap in Quantum-Enhanced AI',
        description: 'Analysis reveals a significant patent filing opportunity in quantum-enhanced machine learning algorithms.',
        reasoning: [
          'Low patent density in quantum ML intersection',
          '3 major competitors recently filed related applications',
          'Strong technical team coverage in your network',
          'High commercial potential ($2.1B market by 2027)'
        ],
        suggested_actions: [
          {
            id: 'research_prior_art',
            action: 'Conduct Prior Art Research',
            description: 'Comprehensive analysis of existing patents in quantum ML space',
            estimated_time: '1 week',
            impact_score: 9,
            complexity: 'high'
          },
          {
            id: 'form_team',
            action: 'Assemble Expert Team',
            description: 'Connect with quantum computing and ML experts in your network',
            estimated_time: '3 days',
            impact_score: 8,
            complexity: 'medium'
          }
        ],
        related_patents: ['US11,234,567', 'US11,345,678', 'US11,456,789'],
        technology_areas: ['Quantum Computing', 'Machine Learning', 'Algorithm Optimization'],
        market_size: 2100000000, // $2.1B
        timeline: '6-12 months',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        viewed: false,
        acted_upon: false
      }
    ];
  };

  const generateMarketInsights = (): AIRecommendation[] => {
    return [
      {
        id: 'market_insight_1',
        type: 'market_insight',
        priority: 'medium',
        confidence: 85,
        title: 'Rising Investment in Sustainable Technology Patents',
        description: 'Patent filing activity in clean energy storage has increased 340% over the past 18 months.',
        reasoning: [
          'Government incentives driving innovation',
          'Major tech companies increasing R&D budgets',
          'Strong patent-to-commercialization conversion rates',
          'Growing investor interest in ESG technologies'
        ],
        suggested_actions: [
          {
            id: 'explore_cleantech',
            action: 'Explore Clean Technology Collaborations',
            description: 'Connect with contacts working in renewable energy and storage',
            estimated_time: '2 weeks',
            impact_score: 7,
            complexity: 'medium'
          }
        ],
        technology_areas: ['Energy Storage', 'Renewable Energy', 'Smart Grid'],
        market_size: 890000000, // $890M
        timeline: '12-18 months',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        viewed: false,
        acted_upon: false
      }
    ];
  };

  const generateSkillGapAnalysis = (): AIRecommendation[] => {
    const expertiseAreas = new Set<string>();
    contacts.forEach(contact => {
      contact.expertise_areas.forEach(area => expertiseAreas.add(area.name));
    });

    const missingAreas = [
      'Augmented Reality', 'Edge Computing', 'Digital Twins', 'Synthetic Biology'
    ].filter(area => !expertiseAreas.has(area));

    if (missingAreas.length > 0) {
      return [
        {
          id: 'skill_gap_1',
          type: 'skill_gap',
          priority: 'low',
          confidence: 72,
          title: `Network Skill Gap: ${missingAreas[0]}`,
          description: `Your network lacks expertise in ${missingAreas[0]}, a rapidly growing technology area.`,
          reasoning: [
            `${missingAreas[0]} patents increased 156% last year`,
            'No current connections with this expertise',
            'High commercial potential in multiple industries',
            'Strategic advantage for early positioning'
          ],
          suggested_actions: [
            {
              id: 'find_experts',
              action: 'Identify Industry Experts',
              description: `Search for and connect with leading ${missingAreas[0]} professionals`,
              estimated_time: '1 week',
              impact_score: 6,
              complexity: 'medium'
            }
          ],
          technology_areas: [missingAreas[0]],
          timeline: '3-6 months',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          viewed: false,
          acted_upon: false
        }
      ];
    }

    return [];
  };

  const generateAIInsights = async (): Promise<AIInsight[]> => {
    return [
      {
        id: 'insight_1',
        category: 'network_analysis',
        title: 'Network Diversity Index',
        summary: 'Your network spans 12 technology areas with strong depth in AI and biotech',
        confidence: 94,
        data_points: 156,
        last_updated: new Date().toISOString(),
        trend: 'up',
        impact: 'medium'
      },
      {
        id: 'insight_2',
        category: 'collaboration_opportunities',
        title: 'Cross-Pollination Potential',
        summary: '67% of your contacts have complementary expertise for joint projects',
        confidence: 89,
        data_points: 89,
        last_updated: new Date().toISOString(),
        trend: 'stable',
        impact: 'high'
      },
      {
        id: 'insight_3',
        category: 'patent_landscape',
        title: 'Patent Filing Velocity',
        summary: 'Your network collectively filed 23% more patents this quarter',
        confidence: 91,
        data_points: 234,
        last_updated: new Date().toISOString(),
        trend: 'up',
        impact: 'high'
      }
    ];
  };

  const handleRecommendationAction = (recommendationId: string, actionId: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, acted_upon: true }
          : rec
      )
    );
    onRecommendationAction?.(recommendationId, actionId);
  };

  const handleFeedback = (recommendationId: string, feedback: 'helpful' | 'not_helpful' | 'partially_helpful') => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, feedback, viewed: true }
          : rec
      )
    );
    onFeedback?.(recommendationId, feedback);
  };

  const getTypeIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'collaboration': return Users;
      case 'patent_opportunity': return FileText;
      case 'market_insight': return TrendingUp;
      case 'skill_gap': return Target;
      case 'trend_alert': return AlertTriangle;
      default: return Lightbulb;
    }
  };

  const getTypeColor = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'collaboration': return 'text-blue-600 bg-blue-100';
      case 'patent_opportunity': return 'text-green-600 bg-green-100';
      case 'market_insight': return 'text-purple-600 bg-purple-100';
      case 'skill_gap': return 'text-orange-600 bg-orange-100';
      case 'trend_alert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: AIRecommendation['priority']) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
    }
  };

  const filteredRecommendations = recommendations.filter(rec => 
    selectedFilter === 'all' || rec.type === selectedFilter
  );

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="bg-white rounded-xl p-6">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
        <div className="bg-white rounded-xl p-6">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Recommendation Engine</h2>
            <p className="text-sm text-gray-600">Powered by advanced patent intelligence algorithms</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="collaboration">Collaborations</option>
            <option value="patent_opportunity">Patent Opportunities</option>
            <option value="market_insight">Market Insights</option>
            <option value="skill_gap">Skill Gaps</option>
          </select>
          
          <button
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map(insight => (
          <div key={insight.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">{insight.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  insight.trend === 'up' ? 'bg-green-100 text-green-700' :
                  insight.trend === 'down' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {insight.trend}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{insight.summary}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{insight.confidence}% confidence</span>
              <span>{insight.data_points} data points</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Personalized Recommendations ({filteredRecommendations.length})
        </h3>
        
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No recommendations match your current filters</p>
          </div>
        ) : (
          filteredRecommendations.map(recommendation => {
            const TypeIcon = getTypeIcon(recommendation.type);
            
            return (
              <div
                key={recommendation.id}
                className={`bg-white rounded-xl border-l-4 border border-gray-200 p-6 ${getPriorityColor(recommendation.priority)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(recommendation.type)}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{recommendation.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          recommendation.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          recommendation.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {recommendation.priority} priority
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-3 h-3" />
                          <span>{recommendation.confidence}% confidence</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{recommendation.description}</p>
                      
                      {/* Reasoning */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">AI Reasoning:</h5>
                        <ul className="space-y-1">
                          {recommendation.reasoning.map((reason, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Suggested Actions */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-900">Suggested Actions:</h5>
                        {recommendation.suggested_actions.map(action => (
                          <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h6 className="text-sm font-medium text-gray-900">{action.action}</h6>
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                  Impact: {action.impact_score}/10
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">{action.description}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {action.estimated_time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Info className="w-3 h-3" />
                                  {action.complexity} complexity
                                </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleRecommendationAction(recommendation.id, action.id)}
                              className="ml-3 flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                            >
                              Take Action
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Feedback */}
                {!recommendation.feedback && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Was this recommendation helpful?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFeedback(recommendation.id, 'helpful')}
                        className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleFeedback(recommendation.id, 'partially_helpful')}
                        className="px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded"
                      >
                        Partially
                      </button>
                      <button
                        onClick={() => handleFeedback(recommendation.id, 'not_helpful')}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AIRecommendationEngine;