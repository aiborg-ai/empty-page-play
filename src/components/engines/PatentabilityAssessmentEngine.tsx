import React, { useState, useEffect } from 'react';
import { Brain, Loader2, CheckCircle, XCircle, AlertCircle, Download, Share2 } from 'lucide-react';
import StepProgressBar from '../decisionEngine/StepProgressBar';
import DecisionCard from '../decisionEngine/DecisionCard';
import VisualizationCanvas from '../decisionEngine/VisualizationCanvas';
import { StepConfiguration } from '../../types/aiAgentBuilder';
import { enhancedDecisionEngineService } from '../../lib/enhancedDecisionEngineService';

interface PatentabilityAssessmentEngineProps {
  onComplete?: (recommendation: any) => void;
  onClose?: () => void;
}

const PatentabilityAssessmentEngine: React.FC<PatentabilityAssessmentEngineProps> = ({
  onComplete,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string>('');

  // Define the 5-step patentability assessment workflow
  const steps: StepConfiguration[] = [
    {
      id: 1,
      title: 'Invention Analysis',
      description: 'Describe your invention and its technical features',
      mission: 'Provide a comprehensive description of your invention, highlighting the key technical features and innovations that distinguish it from existing solutions.',
      method: 'AI analyzes technical complexity, identifies inventive concepts, and categorizes the technology domain for targeted prior art searching.',
      impact: 'Establishes the foundation for patentability assessment by understanding the core innovation and technical contribution.',
      inputs: [
        {
          id: 'invention_title',
          type: 'text',
          label: 'Invention Title',
          placeholder: 'e.g., Advanced Battery Management System for Electric Vehicles',
          required: true,
          validation: { minLength: 10, maxLength: 200 }
        },
        {
          id: 'technical_field',
          type: 'select',
          label: 'Technical Field',
          required: true,
          options: [
            { value: 'software', label: 'Software & Algorithms' },
            { value: 'hardware', label: 'Hardware & Electronics' },
            { value: 'biotech', label: 'Biotechnology & Life Sciences' },
            { value: 'mechanical', label: 'Mechanical Engineering' },
            { value: 'chemical', label: 'Chemistry & Materials' },
            { value: 'ai_ml', label: 'AI & Machine Learning' },
            { value: 'telecom', label: 'Telecommunications' },
            { value: 'medical', label: 'Medical Devices' }
          ]
        },
        {
          id: 'invention_description',
          type: 'text',
          label: 'Detailed Description',
          placeholder: 'Describe the technical problem solved and how your invention works...',
          required: true,
          validation: { minLength: 100, maxLength: 2000 },
          helpText: 'Include technical details, key components, and how it differs from existing solutions'
        },
        {
          id: 'key_features',
          type: 'multiselect',
          label: 'Key Technical Features',
          required: true,
          options: [
            { value: 'novel_algorithm', label: 'Novel Algorithm or Method' },
            { value: 'improved_performance', label: 'Improved Performance (speed, efficiency)' },
            { value: 'new_material', label: 'New Material or Composition' },
            { value: 'unique_structure', label: 'Unique Structure or Architecture' },
            { value: 'cost_reduction', label: 'Significant Cost Reduction' },
            { value: 'unexpected_result', label: 'Unexpected Technical Result' },
            { value: 'synergistic_effect', label: 'Synergistic Effect of Components' },
            { value: 'technical_problem', label: 'Solves Long-standing Technical Problem' }
          ]
        }
      ],
      aiProcessing: 'technical_classification_analysis',
      outputs: [
        { id: 'invention_category', type: 'text', label: 'Technology Category' },
        { id: 'complexity_score', type: 'score', label: 'Technical Complexity', unit: 'points' },
        { id: 'search_strategy', type: 'list', label: 'Search Strategy' }
      ],
      visualizations: ['novelty_score_gauge']
    },
    {
      id: 2,
      title: 'Prior Art Search',
      description: 'Identify and analyze relevant prior art',
      mission: 'Provide information about any known prior art or similar inventions, and let our AI conduct a comprehensive search of patent databases.',
      method: 'AI searches multiple patent databases, scientific literature, and technical publications to identify relevant prior art and assess novelty.',
      impact: 'Determines the novelty of your invention by comparing it against existing patents and publications in the field.',
      inputs: [
        {
          id: 'known_prior_art',
          type: 'text',
          label: 'Known Prior Art or Similar Solutions',
          placeholder: 'List any patents, products, or publications you are aware of...',
          required: false,
          helpText: 'Include patent numbers, product names, or research papers if known'
        },
        {
          id: 'search_keywords',
          type: 'text',
          label: 'Additional Search Keywords',
          placeholder: 'e.g., battery management, SOC estimation, thermal control',
          required: false,
          helpText: 'Technical terms that describe your invention'
        },
        {
          id: 'search_scope',
          type: 'multiselect',
          label: 'Search Jurisdictions',
          required: true,
          options: [
            { value: 'us', label: 'United States (USPTO)' },
            { value: 'ep', label: 'Europe (EPO)' },
            { value: 'cn', label: 'China (CNIPA)' },
            { value: 'jp', label: 'Japan (JPO)' },
            { value: 'kr', label: 'South Korea (KIPO)' },
            { value: 'wipo', label: 'WIPO/PCT Applications' }
          ]
        },
        {
          id: 'search_date_range',
          type: 'select',
          label: 'Prior Art Date Range',
          required: true,
          options: [
            { value: '5years', label: 'Last 5 Years' },
            { value: '10years', label: 'Last 10 Years' },
            { value: '20years', label: 'Last 20 Years' },
            { value: 'all', label: 'All Available' }
          ]
        }
      ],
      aiProcessing: 'prior_art_similarity_analysis',
      outputs: [
        { id: 'prior_art_count', type: 'number', label: 'Relevant Prior Art Found' },
        { id: 'closest_prior_art', type: 'list', label: 'Closest Prior Art' },
        { id: 'novelty_gaps', type: 'list', label: 'Novelty Gaps Identified' }
      ],
      visualizations: ['prior_art_timeline']
    },
    {
      id: 3,
      title: 'Novelty Assessment',
      description: 'Evaluate the novelty and inventive step',
      mission: 'Analyze how your invention differs from the prior art and assess whether these differences constitute patentable novelty.',
      method: 'AI compares your invention against identified prior art to determine novel features and assess the inventive step.',
      impact: 'Establishes whether your invention meets the novelty requirement for patentability and identifies the strongest novel features.',
      inputs: [
        {
          id: 'distinguishing_features',
          type: 'text',
          label: 'Key Distinguishing Features',
          placeholder: 'Describe what makes your invention different from the prior art...',
          required: true,
          validation: { minLength: 50, maxLength: 1000 }
        },
        {
          id: 'technical_advantages',
          type: 'multiselect',
          label: 'Technical Advantages Over Prior Art',
          required: true,
          options: [
            { value: 'higher_efficiency', label: 'Higher Efficiency or Performance' },
            { value: 'lower_cost', label: 'Lower Cost or Complexity' },
            { value: 'better_accuracy', label: 'Better Accuracy or Precision' },
            { value: 'increased_reliability', label: 'Increased Reliability' },
            { value: 'easier_implementation', label: 'Easier Implementation' },
            { value: 'broader_applicability', label: 'Broader Applicability' },
            { value: 'environmental_benefits', label: 'Environmental Benefits' },
            { value: 'safety_improvements', label: 'Safety Improvements' }
          ]
        },
        {
          id: 'unexpected_results',
          type: 'text',
          label: 'Unexpected or Surprising Results',
          placeholder: 'Describe any unexpected technical effects or results...',
          required: false,
          helpText: 'Unexpected results can strengthen non-obviousness arguments'
        }
      ],
      aiProcessing: 'novelty_and_inventive_step_evaluation',
      outputs: [
        { id: 'novelty_score', type: 'score', label: 'Novelty Score', unit: '%' },
        { id: 'inventive_step_rating', type: 'score', label: 'Inventive Step', unit: 'points' },
        { id: 'patentable_features', type: 'list', label: 'Patentable Features' }
      ],
      visualizations: ['novelty_score_gauge', 'risk_heatmap']
    },
    {
      id: 4,
      title: 'Commercial Evaluation',
      description: 'Assess market potential and commercial viability',
      mission: 'Evaluate the commercial importance and market potential of your invention to determine if patent protection is worthwhile.',
      method: 'AI analyzes market size, competitive landscape, and commercialization potential to assess the business value of patent protection.',
      impact: 'Determines whether the commercial opportunity justifies the investment in patent protection and identifies key markets.',
      inputs: [
        {
          id: 'target_market',
          type: 'text',
          label: 'Target Market Description',
          placeholder: 'Describe your target market and potential customers...',
          required: true,
          validation: { minLength: 50, maxLength: 500 }
        },
        {
          id: 'market_size',
          type: 'select',
          label: 'Estimated Market Size',
          required: true,
          options: [
            { value: 'small', label: '< $10M annually' },
            { value: 'medium', label: '$10M - $100M annually' },
            { value: 'large', label: '$100M - $1B annually' },
            { value: 'very_large', label: '> $1B annually' }
          ]
        },
        {
          id: 'commercialization_stage',
          type: 'select',
          label: 'Commercialization Stage',
          required: true,
          options: [
            { value: 'concept', label: 'Concept/Idea Stage' },
            { value: 'prototype', label: 'Prototype Development' },
            { value: 'testing', label: 'Testing/Validation' },
            { value: 'ready', label: 'Market Ready' },
            { value: 'launched', label: 'Already in Market' }
          ]
        },
        {
          id: 'competitive_advantage',
          type: 'multiselect',
          label: 'Competitive Advantages',
          required: true,
          options: [
            { value: 'first_mover', label: 'First Mover Advantage' },
            { value: 'cost_leadership', label: 'Cost Leadership' },
            { value: 'technical_superiority', label: 'Technical Superiority' },
            { value: 'platform_effects', label: 'Network/Platform Effects' },
            { value: 'brand_value', label: 'Brand Value Enhancement' },
            { value: 'licensing_potential', label: 'High Licensing Potential' },
            { value: 'strategic_blocking', label: 'Strategic Blocking Value' }
          ]
        },
        {
          id: 'budget_range',
          type: 'select',
          label: 'Available Patent Budget',
          required: true,
          options: [
            { value: 'minimal', label: '< $10,000' },
            { value: 'moderate', label: '$10,000 - $50,000' },
            { value: 'substantial', label: '$50,000 - $200,000' },
            { value: 'unlimited', label: '> $200,000' }
          ]
        }
      ],
      aiProcessing: 'commercial_viability_assessment',
      outputs: [
        { id: 'commercial_score', type: 'score', label: 'Commercial Value', unit: 'points' },
        { id: 'roi_projection', type: 'number', label: 'ROI Projection', unit: '%' },
        { id: 'key_markets', type: 'list', label: 'Key Markets' }
      ],
      visualizations: ['world_map_coverage', 'portfolio_bubble_chart']
    },
    {
      id: 5,
      title: 'Filing Recommendation',
      description: 'Receive comprehensive patentability assessment and filing strategy',
      mission: 'Review the comprehensive patentability assessment and receive strategic recommendations for patent filing.',
      method: 'AI synthesizes all analysis to provide a final patentability verdict with confidence score and detailed filing recommendations.',
      impact: 'Provides actionable guidance on whether to file, where to file, and how to optimize your patent application for success.',
      inputs: [
        {
          id: 'filing_urgency',
          type: 'select',
          label: 'Filing Timeline',
          required: true,
          options: [
            { value: 'immediate', label: 'Immediate (< 1 month)' },
            { value: 'short', label: 'Short-term (1-3 months)' },
            { value: 'medium', label: 'Medium-term (3-6 months)' },
            { value: 'long', label: 'Long-term (6-12 months)' }
          ]
        },
        {
          id: 'filing_objectives',
          type: 'multiselect',
          label: 'Primary Filing Objectives',
          required: true,
          options: [
            { value: 'protection', label: 'Product Protection' },
            { value: 'licensing', label: 'Licensing Revenue' },
            { value: 'investment', label: 'Attract Investment' },
            { value: 'defensive', label: 'Defensive Publication' },
            { value: 'blocking', label: 'Block Competitors' },
            { value: 'portfolio', label: 'Portfolio Building' }
          ]
        },
        {
          id: 'additional_considerations',
          type: 'text',
          label: 'Additional Considerations',
          placeholder: 'Any other factors we should consider in our recommendation...',
          required: false
        }
      ],
      aiProcessing: 'comprehensive_recommendation_generation',
      outputs: [
        { id: 'patentability_verdict', type: 'text', label: 'Patentability Verdict' },
        { id: 'confidence_score', type: 'score', label: 'Confidence', unit: '%' },
        { id: 'filing_strategy', type: 'list', label: 'Filing Strategy' },
        { id: 'next_steps', type: 'list', label: 'Recommended Next Steps' }
      ],
      visualizations: ['novelty_score_gauge', 'risk_heatmap', 'world_map_coverage']
    }
  ];

  useEffect(() => {
    // Initialize session
    const initSession = async () => {
      const session = await enhancedDecisionEngineService.createSession('patentability', 'user-id');
      setSessionId(session.id);
    };
    initSession();
  }, []);

  const handleStepComplete = async (stepData: Record<string, any>) => {
    setIsProcessing(true);
    
    try {
      // Save step response
      const updatedResponses = { ...responses, [currentStep]: stepData };
      setResponses(updatedResponses);
      
      // Process with AI
      const result = await enhancedDecisionEngineService.processStep(
        sessionId,
        currentStep,
        stepData
      );
      
      // Update visualization data based on step
      if (currentStep === 0) {
        // After invention analysis, set initial novelty score
        updatedResponses.noveltyScore = 75 + Math.random() * 15; // Demo: 75-90
      } else if (currentStep === 1) {
        // After prior art search, update with timeline data
        updatedResponses.priorArtTimeline = result.priorArtTimeline;
      } else if (currentStep === 2) {
        // After novelty assessment, add risk data
        updatedResponses.risks = result.risks;
      }
      
      setResponses(updatedResponses);
      
      if (currentStep === steps.length - 1) {
        // Final step - generate recommendation
        const finalRecommendation = await enhancedDecisionEngineService.generateRecommendation(
          sessionId,
          updatedResponses
        );
        setRecommendation(finalRecommendation);
        onComplete?.(finalRecommendation);
      } else {
        // Move to next step
        setCompletedSteps([...completedSteps, currentStep]);
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error processing step:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStepNavigation = (stepIndex: number) => {
    if (stepIndex <= Math.max(...completedSteps, 0) || stepIndex === 0) {
      setCurrentStep(stepIndex);
    }
  };

  const renderRecommendation = () => {
    if (!recommendation) return null;

    const getVerdictIcon = (verdict: string) => {
      if (verdict.includes('Patentable')) return <CheckCircle className="w-6 h-6 text-green-600" />;
      if (verdict.includes('Partially')) return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      return <XCircle className="w-6 h-6 text-red-600" />;
    };

    const getVerdictColor = (verdict: string) => {
      if (verdict.includes('Patentable') && !verdict.includes('Not')) return 'bg-green-50 border-green-200';
      if (verdict.includes('Partially')) return 'bg-yellow-50 border-yellow-200';
      return 'bg-red-50 border-red-200';
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Patentability Assessment Complete</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Verdict Card */}
        <div className={`border-2 rounded-lg p-6 ${getVerdictColor(recommendation.verdict)}`}>
          <div className="flex items-start gap-4">
            {getVerdictIcon(recommendation.verdict)}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{recommendation.verdict}</h3>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Confidence:</span>
                  <span className="ml-2 font-semibold">{(recommendation.confidence * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Novelty Score:</span>
                  <span className="ml-2 font-semibold">{responses.noveltyScore?.toFixed(0) || 'N/A'}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Findings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Findings</h3>
          <div className="space-y-2">
            {recommendation.keyFindings?.map((finding: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  finding.impact === 'high' ? 'bg-green-500' :
                  finding.impact === 'medium' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`} />
                <div>
                  <h4 className="font-medium text-gray-900">{finding.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reasoning */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Summary</h3>
          <ul className="space-y-2">
            {recommendation.reasoning?.map((reason: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Next Steps</h3>
          <div className="space-y-2">
            {recommendation.nextSteps?.map((step: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Patentability Assessment Engine</h1>
          </div>
          <p className="text-gray-600">
            AI-powered comprehensive analysis to evaluate the patentability of your invention
          </p>
        </div>

        {/* Progress Bar */}
        {!recommendation && (
          <StepProgressBar
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepNavigation}
          />
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {!recommendation ? (
              <DecisionCard
                step={steps[currentStep]}
                onComplete={handleStepComplete}
                isProcessing={isProcessing}
                previousResponse={responses[currentStep]}
              />
            ) : (
              renderRecommendation()
            )}
          </div>
          
          <div className="lg:col-span-1">
            <VisualizationCanvas
              step={currentStep}
              data={responses}
              visualizations={steps[currentStep]?.visualizations || []}
            />
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <div className="text-center">
              <p className="font-semibold text-gray-900">Processing Your Input</p>
              <p className="text-sm text-gray-600 mt-1">Analyzing with AI decision engine...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatentabilityAssessmentEngine;