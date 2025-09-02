// Main AI Agent Builder Engine Generator

import { 
  EngineTemplate, 
  GeneratedEngine, 
  GeneratedComponent, 
  BuilderConfiguration,
  StepConfiguration
} from '@/types/aiAgentBuilder';

export class EngineGenerator {
  // private _config: BuilderConfiguration; // Unused - config passed but not used in generation
  private template: EngineTemplate;

  constructor(template: EngineTemplate, _config?: Partial<BuilderConfiguration>) {
    this.template = template;
    // Configuration is accepted but not currently used in the generation process
    // this._config = {
    //   templateEngine: {
    //     framework: 'react',
    //     styling: 'tailwind',
    //     stateManagement: 'context',
    //     ...config?.templateEngine
    //   },
    //   aiIntegration: {
    //     provider: 'openai',
    //     model: 'gpt-4',
    //     temperature: 0.7,
    //     maxTokens: 2000,
    //     ...config?.aiIntegration
    //   },
    //   deployment: {
    //     target: 'vercel',
    //     environment: 'development',
    //     ...config?.deployment
    //   }
    // };
  }

  async generate(): Promise<GeneratedEngine> {
    const startTime = Date.now();
    
    try {
      // Generate all components
      const components: GeneratedComponent[] = [
        await this.generateMainComponent(),
        ...await this.generateStepComponents(),
        ...await this.generateVisualizationComponents(),
        await this.generateAILogicComponent(),
        await this.generateDataConnectorComponent()
      ];

      // Generate tests
      const testsComponent = await this.generateTests(components);
      components.push(testsComponent);

      const generationTime = Date.now() - startTime;

      const generatedEngine: GeneratedEngine = {
        id: `engine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        templateId: this.template.id,
        name: this.template.name,
        createdAt: new Date().toISOString(),
        createdBy: 'AI Agent Builder',
        status: 'draft',
        version: '1.0.0',
        components,
        metadata: {
          generationTime,
          codeQualityScore: this.calculateQualityScore(components),
          testCoverage: this.calculateTestCoverage(components),
          performance: {
            loadTime: 0,
            stepTransitionTime: 0
          },
          usage: {
            totalRuns: 0,
            completionRate: 0,
            averageTime: 0
          }
        }
      };

      return generatedEngine;
    } catch (error) {
      console.error('Engine generation failed:', error);
      throw new Error(`Failed to generate engine: ${error}`);
    }
  }

  private async generateMainComponent(): Promise<GeneratedComponent> {
    const code = `
import React, { useState, useEffect } from 'react';
import { ${this.template.name.replace(/\s+/g, '')}Provider } from './context';
import StepProgressBar from './components/StepProgressBar';
import DecisionCard from './components/DecisionCard';
import VisualizationCanvas from './components/VisualizationCanvas';
import { useAIProcessor } from './hooks/useAIProcessor';

export const ${this.template.name.replace(/\s+/g, '')}Engine = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [recommendation, setRecommendation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { processStep, generateRecommendation } = useAIProcessor('${this.template.id}');

  const steps = ${JSON.stringify(this.template.steps, null, 2)};
  const totalSteps = ${this.template.totalSteps};

  const handleStepComplete = async (stepData) => {
    setIsProcessing(true);
    try {
      const updatedResponses = { ...responses, [currentStep]: stepData };
      setResponses(updatedResponses);
      
      const result = await processStep(currentStep, stepData);
      
      if (currentStep === totalSteps - 1) {
        const finalRecommendation = await generateRecommendation(updatedResponses);
        setRecommendation(finalRecommendation);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Step processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStepNavigation = (stepIndex) => {
    if (stepIndex <= Object.keys(responses).length) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <${this.template.name.replace(/\s+/g, '')}Provider value={{ responses, recommendation }}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">${this.template.name}</h1>
            <p className="text-gray-600 mt-2">${this.template.description}</p>
          </header>

          <StepProgressBar
            steps={steps}
            currentStep={currentStep}
            completedSteps={Object.keys(responses).map(Number)}
            onStepClick={handleStepNavigation}
          />

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
                <RecommendationDisplay recommendation={recommendation} />
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
      </div>
    </${this.template.name.replace(/\s+/g, '')}Provider>
  );
};

const RecommendationDisplay = ({ recommendation }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold mb-4">Recommendation</h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">Verdict:</span>
        <span className="text-lg font-bold text-blue-600">{recommendation.verdict}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium">Confidence:</span>
        <span className="text-lg">{(recommendation.confidence * 100).toFixed(0)}%</span>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Key Findings:</h3>
        <ul className="space-y-2">
          {recommendation.keyFindings?.map((finding, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-gray-700">{finding.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default ${this.template.name.replace(/\s+/g, '')}Engine;
`;

    return {
      id: 'main-component',
      type: 'ui',
      name: `${this.template.name.replace(/\s+/g, '')}Engine.tsx`,
      code,
      dependencies: ['react', 'tailwindcss']
    };
  }

  private async generateStepComponents(): Promise<GeneratedComponent[]> {
    const components: GeneratedComponent[] = [];

    for (const step of this.template.steps) {
      const stepComponent = await this.generateStepComponent(step);
      components.push(stepComponent);
    }

    // Generate StepProgressBar component
    components.push(this.generateStepProgressBar());
    
    // Generate DecisionCard component
    components.push(this.generateDecisionCard());

    return components;
  }

  private generateStepComponent(step: StepConfiguration): GeneratedComponent {
    const code = `
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const Step${step.id}Component = ({ onComplete, previousResponse }) => {
  const [formData, setFormData] = useState(previousResponse || {});
  const [expandedSections, setExpandedSections] = useState({
    mission: true,
    method: false,
    impact: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">${step.title}</h2>
        ${step.description ? `<p className="text-gray-600 mb-6">${step.description}</p>` : ''}
        
        {/* Mission Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('mission')}
            className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div className="text-left">
                <h3 className="font-semibold">Mission</h3>
                <p className="text-sm text-gray-600">${step.mission}</p>
              </div>
            </div>
            {expandedSections.mission ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.mission && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                ${step.inputs.map(input => this.generateInputField(input)).join('\n')}
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Method Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('method')}
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div className="text-left">
                <h3 className="font-semibold">Method</h3>
                <p className="text-sm text-gray-600">${step.method}</p>
              </div>
            </div>
            {expandedSections.method ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.method && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">AI Processing: ${step.aiProcessing}</p>
            </div>
          )}
        </div>

        {/* Impact Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('impact')}
            className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-left">
                <h3 className="font-semibold">Impact</h3>
                <p className="text-sm text-gray-600">${step.impact}</p>
              </div>
            </div>
            {expandedSections.impact ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.impact && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                ${step.outputs.map(output => `
                  <div className="flex items-center justify-between">
                    <span className="font-medium">${output.label}:</span>
                    <span className="text-gray-600">Pending...</span>
                  </div>
                `).join('')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`;

    return {
      id: `step-${step.id}`,
      type: 'ui',
      name: `Step${step.id}Component.tsx`,
      code,
      dependencies: ['react', 'lucide-react']
    };
  }

  private generateInputField(input: any): string {
    switch (input.type) {
      case 'text':
      case 'number':
      case 'date':
        return `
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    ${input.label} ${input.required ? '<span className="text-red-500">*</span>' : ''}
  </label>
  <input
    type="${input.type}"
    value={formData['${input.id}'] || ''}
    onChange={(e) => setFormData({...formData, '${input.id}': e.target.value})}
    placeholder="${input.placeholder || ''}"
    ${input.required ? 'required' : ''}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
  />
  ${input.helpText ? `<p className="text-xs text-gray-500 mt-1">${input.helpText}</p>` : ''}
</div>`;

      case 'select':
        return `
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    ${input.label} ${input.required ? '<span className="text-red-500">*</span>' : ''}
  </label>
  <select
    value={formData['${input.id}'] || ''}
    onChange={(e) => setFormData({...formData, '${input.id}': e.target.value})}
    ${input.required ? 'required' : ''}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Select...</option>
    ${input.options?.map((opt: any) => 
      `<option value="${opt.value}">${opt.label}</option>`
    ).join('\n')}
  </select>
</div>`;

      case 'multiselect':
        return `
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    ${input.label} ${input.required ? '<span className="text-red-500">*</span>' : ''}
  </label>
  <div className="space-y-2">
    ${input.options?.map((opt: any) => `
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        value="${opt.value}"
        checked={formData['${input.id}']?.includes('${opt.value}') || false}
        onChange={(e) => {
          const current = formData['${input.id}'] || [];
          if (e.target.checked) {
            setFormData({...formData, '${input.id}': [...current, '${opt.value}']});
          } else {
            setFormData({...formData, '${input.id}': current.filter(v => v !== '${opt.value}')});
          }
        }}
        className="rounded border-gray-300"
      />
      <span>${opt.label}</span>
    </label>
    `).join('\n')}
  </div>
</div>`;

      default:
        return '';
    }
  }

  private generateStepProgressBar(): GeneratedComponent {
    const code = `
import React from 'react';
import { Check } from 'lucide-react';

const StepProgressBar = ({ steps, currentStep, completedSteps, onStepClick }) => {
  const progress = ((completedSteps.length / steps.length) * 100).toFixed(0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Progress</h3>
        <span className="text-sm text-gray-600">{progress}% Complete</span>
      </div>
      
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: \`\${progress}%\` }}
          />
        </div>
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isClickable = index <= Math.max(...completedSteps, currentStep);
            
            return (
              <button
                key={index}
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={\`flex flex-col items-center \${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}\`}
              >
                <div className={\`
                  w-10 h-10 rounded-full flex items-center justify-center
                  \${isCompleted ? 'bg-green-500 text-white' : 
                    isCurrent ? 'bg-blue-600 text-white' : 
                    'bg-gray-200 text-gray-600'}
                  \${isClickable && !isCompleted && !isCurrent ? 'hover:bg-gray-300' : ''}
                \`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span className={\`text-xs mt-2 \${isCurrent ? 'font-semibold' : ''}\`}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepProgressBar;
`;

    return {
      id: 'step-progress-bar',
      type: 'ui',
      name: 'StepProgressBar.tsx',
      code,
      dependencies: ['react', 'lucide-react']
    };
  }

  private generateDecisionCard(): GeneratedComponent {
    const code = `
import React from 'react';
import { Loader2 } from 'lucide-react';

const DecisionCard = ({ step, onComplete, isProcessing, previousResponse }) => {
  const StepComponent = require(\`./Step\${step.id}Component\`).default;
  
  return (
    <div className="relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium">Processing your input...</p>
          </div>
        </div>
      )}
      
      <StepComponent 
        onComplete={onComplete}
        previousResponse={previousResponse}
      />
    </div>
  );
};

export default DecisionCard;
`;

    return {
      id: 'decision-card',
      type: 'ui',
      name: 'DecisionCard.tsx',
      code,
      dependencies: ['react', 'lucide-react']
    };
  }

  private async generateVisualizationComponents(): Promise<GeneratedComponent[]> {
    const visualizations = new Set<string>();
    
    // Collect all unique visualizations from steps
    this.template.steps.forEach(step => {
      step.visualizations?.forEach(viz => visualizations.add(viz));
    });

    const components: GeneratedComponent[] = [];
    
    // Generate main visualization canvas
    components.push(this.generateVisualizationCanvas());
    
    // Generate individual visualization components
    for (const vizType of visualizations) {
      components.push(await this.generateVisualizationComponent(vizType));
    }

    return components;
  }

  private generateVisualizationCanvas(): GeneratedComponent {
    const code = `
import React from 'react';
import dynamic from 'next/dynamic';

const visualizationComponents = {
  'prior_art_timeline': dynamic(() => import('./visualizations/PriorArtTimeline')),
  'novelty_score_gauge': dynamic(() => import('./visualizations/NoveltyScoreGauge')),
  'world_map_coverage': dynamic(() => import('./visualizations/WorldMapCoverage')),
  'portfolio_bubble_chart': dynamic(() => import('./visualizations/PortfolioBubbleChart')),
  'risk_heatmap': dynamic(() => import('./visualizations/RiskHeatmap')),
  'technology_radar': dynamic(() => import('./visualizations/TechnologyRadar')),
  'priority_matrix': dynamic(() => import('./visualizations/PriorityMatrix'))
};

const VisualizationCanvas = ({ step, data, visualizations }) => {
  if (!visualizations || visualizations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Insights</h3>
        <div className="text-center py-12 text-gray-500">
          Visualizations will appear as you progress
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {visualizations.map((vizType, index) => {
        const Component = visualizationComponents[vizType];
        if (!Component) return null;
        
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <Component data={data} step={step} />
          </div>
        );
      })}
    </div>
  );
};

export default VisualizationCanvas;
`;

    return {
      id: 'visualization-canvas',
      type: 'ui',
      name: 'VisualizationCanvas.tsx',
      code,
      dependencies: ['react', 'next/dynamic']
    };
  }

  private async generateVisualizationComponent(vizType: string): Promise<GeneratedComponent> {
    const visualizationCode = this.getVisualizationCode(vizType);
    
    return {
      id: `viz-${vizType}`,
      type: 'visualization',
      name: `visualizations/${this.toPascalCase(vizType)}.tsx`,
      code: visualizationCode,
      dependencies: ['react', 'recharts', 'd3']
    };
  }

  private getVisualizationCode(vizType: string): string {
    const vizTemplates: Record<string, string> = {
      'novelty_score_gauge': `
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const NoveltyScoreGauge = ({ data }) => {
  const score = data?.noveltyScore || 0;
  const gaugeData = [
    { value: score, color: score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#ef4444' },
    { value: 100 - score, color: '#e5e7eb' }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Novelty Score</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={gaugeData}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
          >
            {gaugeData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <div className="text-3xl font-bold">{score}%</div>
        <div className="text-sm text-gray-600">
          {score > 70 ? 'High Novelty' : score > 40 ? 'Moderate Novelty' : 'Low Novelty'}
        </div>
      </div>
    </div>
  );
};

export default NoveltyScoreGauge;
`,
      'prior_art_timeline': `
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PriorArtTimeline = ({ data }) => {
  const timelineData = data?.priorArtTimeline || [
    { year: 2019, patents: 12 },
    { year: 2020, patents: 18 },
    { year: 2021, patents: 25 },
    { year: 2022, patents: 32 },
    { year: 2023, patents: 28 },
    { year: 2024, patents: 35 }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Prior Art Timeline</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="patents" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorArtTimeline;
`,
      'risk_heatmap': `
import React from 'react';

const RiskHeatmap = ({ data }) => {
  const risks = data?.risks || [
    { factor: 'Prior Art Overlap', likelihood: 3, impact: 4 },
    { factor: 'Market Competition', likelihood: 4, impact: 3 },
    { factor: 'Technical Feasibility', likelihood: 2, impact: 5 },
    { factor: 'Regulatory Compliance', likelihood: 2, impact: 3 },
    { factor: 'Cost Overrun', likelihood: 3, impact: 2 }
  ];

  const getColor = (likelihood, impact) => {
    const score = likelihood * impact;
    if (score >= 12) return 'bg-red-500';
    if (score >= 8) return 'bg-orange-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Risk Assessment Matrix</h3>
      <div className="grid grid-cols-6 gap-1">
        <div></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="text-xs text-center font-medium">Impact {i}</div>
        ))}
        {[5, 4, 3, 2, 1].map(likelihood => (
          <React.Fragment key={likelihood}>
            <div className="text-xs font-medium">L{likelihood}</div>
            {[1, 2, 3, 4, 5].map(impact => {
              const risk = risks.find(r => r.likelihood === likelihood && r.impact === impact);
              return (
                <div
                  key={impact}
                  className={\`h-12 flex items-center justify-center text-xs \${getColor(likelihood, impact)} text-white rounded\`}
                >
                  {risk && (
                    <span className="truncate px-1">{risk.factor}</span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Low Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Medium Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>High Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Critical Risk</span>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
`
    };

    return vizTemplates[vizType] || this.generateDefaultVisualization(vizType);
  }

  private generateDefaultVisualization(vizType: string): string {
    return `
import React from 'react';

const ${this.toPascalCase(vizType)} = ({ data }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">${this.toTitleCase(vizType)}</h3>
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">Visualization: ${vizType}</p>
        <p className="text-sm text-gray-500 mt-2">Custom visualization component</p>
      </div>
    </div>
  );
};

export default ${this.toPascalCase(vizType)};
`;
  }

  private async generateAILogicComponent(): Promise<GeneratedComponent> {
    const code = `
import { useState, useCallback } from 'react';

export const useAIProcessor = (engineId) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processStep = useCallback(async (stepIndex, stepData) => {
    setIsProcessing(true);
    try {
      // Call AI service with step data
      const response = await fetch('/api/ai/process-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engineId,
          stepIndex,
          data: stepData,
          prompt: getStepPrompt(engineId, stepIndex)
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI processing error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [engineId]);

  const generateRecommendation = useCallback(async (allResponses) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai/generate-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engineId,
          responses: allResponses,
          systemPrompt: getSystemPrompt(engineId)
        })
      });

      const recommendation = await response.json();
      return recommendation;
    } catch (error) {
      console.error('Recommendation generation error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [engineId]);

  return { processStep, generateRecommendation, isProcessing };
};

const getStepPrompt = (engineId, stepIndex) => {
  // Step-specific prompts based on engine and step
  const prompts = {
    'patentability': {
      0: 'Analyze the technical features and identify the inventive concept...',
      1: 'Search for relevant prior art and assess novelty...',
      2: 'Evaluate non-obviousness based on the technical advantages...',
      3: 'Assess commercial viability and market potential...',
      4: 'Generate filing strategy recommendation...'
    }
  };
  
  return prompts[engineId]?.[stepIndex] || 'Process the user input and provide analysis...';
};

const getSystemPrompt = (engineId) => {
  const systemPrompts = {
    'patentability': \`You are an expert patent attorney specializing in patentability assessments. 
      Analyze the invention data and provide a comprehensive recommendation on patentability.
      Consider novelty, non-obviousness, utility, and commercial potential.
      Provide specific, actionable recommendations with confidence scores.\`,
  };
  
  return systemPrompts[engineId] || 'You are an IP decision engine. Provide expert recommendations.';
};
`;

    return {
      id: 'ai-logic',
      type: 'logic',
      name: 'hooks/useAIProcessor.ts',
      code,
      dependencies: ['react']
    };
  }

  private async generateDataConnectorComponent(): Promise<GeneratedComponent> {
    const code = `
export class DataConnector {
  static async searchPriorArt(query) {
    try {
      const response = await fetch('/api/data/prior-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      return await response.json();
    } catch (error) {
      console.error('Prior art search error:', error);
      return { results: [], error: error.message };
    }
  }

  static async getMarketData(technology, markets) {
    try {
      const response = await fetch('/api/data/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technology, markets })
      });
      return await response.json();
    } catch (error) {
      console.error('Market data error:', error);
      return { data: null, error: error.message };
    }
  }

  static async getCostEstimates(jurisdictions, filingType) {
    try {
      const response = await fetch('/api/data/costs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jurisdictions, filingType })
      });
      return await response.json();
    } catch (error) {
      console.error('Cost estimation error:', error);
      return { estimates: {}, error: error.message };
    }
  }

  static async getExaminerStatistics(artUnit, examiner) {
    try {
      const response = await fetch('/api/data/examiner-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artUnit, examiner })
      });
      return await response.json();
    } catch (error) {
      console.error('Examiner stats error:', error);
      return { stats: null, error: error.message };
    }
  }
}
`;

    return {
      id: 'data-connector',
      type: 'data',
      name: 'lib/DataConnector.ts',
      code,
      dependencies: []
    };
  }

  private async generateTests(_components: GeneratedComponent[]): Promise<GeneratedComponent> {
    const testCode = `
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${this.template.name.replace(/\s+/g, '')}Engine from '../${this.template.name.replace(/\s+/g, '')}Engine';

describe('${this.template.name} Engine', () => {
  test('renders engine title and description', () => {
    render(<${this.template.name.replace(/\s+/g, '')}Engine />);
    expect(screen.getByText('${this.template.name}')).toBeInTheDocument();
    expect(screen.getByText('${this.template.description}')).toBeInTheDocument();
  });

  test('displays step progress bar', () => {
    render(<${this.template.name.replace(/\s+/g, '')}Engine />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('0% Complete')).toBeInTheDocument();
  });

  test('shows first step by default', () => {
    render(<${this.template.name.replace(/\s+/g, '')}Engine />);
    const firstStep = screen.getByText('${this.template.steps[0].title}');
    expect(firstStep).toBeInTheDocument();
  });

  test('advances to next step on completion', async () => {
    render(<${this.template.name.replace(/\s+/g, '')}Engine />);
    
    // Fill in required fields for first step
    ${this.template.steps[0].inputs
      .filter(i => i.required)
      .map(input => `
    const ${input.id}Input = screen.getByLabelText('${input.label}');
    fireEvent.change(${input.id}Input, { target: { value: 'test value' } });
    `).join('')}
    
    // Submit the form
    const submitButton = screen.getByText('Continue');
    fireEvent.click(submitButton);
    
    // Wait for next step
    await waitFor(() => {
      expect(screen.getByText('${this.template.steps[1]?.title || 'Next Step'}')).toBeInTheDocument();
    });
  });

  test('allows navigation to completed steps', async () => {
    render(<${this.template.name.replace(/\s+/g, '')}Engine />);
    
    // Complete first step
    // ... completion logic
    
    // Click on first step in progress bar
    const firstStepButton = screen.getByText('1');
    fireEvent.click(firstStepButton);
    
    // Should navigate back to first step
    expect(screen.getByText('${this.template.steps[0].title}')).toBeInTheDocument();
  });
});
`;

    return {
      id: 'tests',
      type: 'ui',
      name: `__tests__/${this.template.name.replace(/\s+/g, '')}Engine.test.tsx`,
      code: testCode,
      dependencies: ['@testing-library/react', '@testing-library/jest-dom', 'jest'],
      tests: testCode
    };
  }

  private calculateQualityScore(components: GeneratedComponent[]): number {
    let score = 100;
    
    // Check for proper error handling
    components.forEach(comp => {
      if (!comp.code.includes('try') || !comp.code.includes('catch')) {
        score -= 5;
      }
    });

    // Check for proper TypeScript usage (if applicable)
    components.forEach(comp => {
      if (comp.name.endsWith('.tsx') && !comp.code.includes('interface') && !comp.code.includes('type')) {
        score -= 3;
      }
    });

    // Check for accessibility
    components.forEach(comp => {
      if (comp.type === 'ui' && !comp.code.includes('aria-')) {
        score -= 2;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  private calculateTestCoverage(components: GeneratedComponent[]): number {
    const testableComponents = components.filter(c => c.type === 'ui' || c.type === 'logic');
    const testedComponents = components.filter(c => c.tests && c.tests.length > 0);
    
    if (testableComponents.length === 0) return 0;
    
    return Math.round((testedComponents.length / testableComponents.length) * 100);
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private toTitleCase(str: string): string {
    return str
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

export default EngineGenerator;