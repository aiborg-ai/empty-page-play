// Decision Engines configuration based on IDES PRD

import { DecisionEngine, EngineQuestion } from '../types/decisionEngines';

export const DECISION_ENGINES: DecisionEngine[] = [
  {
    id: 'patentability',
    name: 'Patentability Assessment',
    category: 'patent',
    description: 'Evaluate whether your invention is patentable based on novelty, non-obviousness, and utility',
    purpose: 'Determine if an invention meets patentability criteria',
    minimalInputs: ['invention_description', 'tech_field', 'prior_art_known', 'commercial_importance', 'budget'],
    dataSources: ['Prior-art index', 'Novelty scores', 'Patent databases'],
    outputFormat: {
      verdict: {
        type: 'categorical',
        options: ['Patentable', 'Partially Patentable', 'Not Patentable']
      },
      scores: {
        novelty: { min: 0, max: 100, label: 'Novelty Score' },
        nonObviousness: { min: 0, max: 100, label: 'Non-Obviousness Score' }
      }
    },
    icon: '🔬',
    color: 'blue',
    targetPersonas: ['Patent Attorney', 'Innovation Manager'],
    estimatedTime: 10
  },
  {
    id: 'filing-strategy',
    name: 'Filing Strategy',
    category: 'patent',
    description: 'Determine optimal jurisdictions and timeline for patent filing',
    purpose: 'Decide where and when to file patent applications',
    minimalInputs: ['invention_details', 'target_markets', 'budget', 'timeline'],
    dataSources: ['Cost databases', 'PPH statistics', 'Filing deadlines'],
    outputFormat: {
      lists: {
        countries: { label: 'Recommended Countries', itemType: 'country' },
        timeline: { label: 'Filing Timeline', itemType: 'milestone' }
      },
      metrics: {
        totalCost: { label: 'Total Cost', unit: 'USD', format: 'currency' },
        successRate: { label: 'Success Rate', unit: '%', format: 'percentage' }
      }
    },
    icon: '🌍',
    color: 'green',
    targetPersonas: ['Patent Attorney', 'IP Manager'],
    estimatedTime: 15
  },
  {
    id: 'prosecution-response',
    name: 'Prosecution Response',
    category: 'patent',
    description: 'Generate strategic response to office actions',
    purpose: 'Plan response to patent office rejections',
    minimalInputs: ['office_action', 'claim_scope', 'prior_art', 'priorities'],
    dataSources: ['Examiner statistics', 'Similar OA responses', 'Success rates'],
    outputFormat: {
      verdict: {
        type: 'categorical',
        options: ['Argue', 'Amend', 'Appeal', 'Abandon']
      },
      metrics: {
        successProbability: { label: 'Success Rate', unit: '%', format: 'percentage' }
      }
    },
    icon: '📝',
    color: 'purple',
    targetPersonas: ['Patent Attorney'],
    estimatedTime: 20
  },
  {
    id: 'portfolio-pruning',
    name: 'Portfolio Pruning',
    category: 'portfolio',
    description: 'Identify patents to maintain or abandon based on value and cost',
    purpose: 'Optimize patent portfolio maintenance costs',
    minimalInputs: ['portfolio_ids', 'maintenance_budget', 'strategy'],
    dataSources: ['Renewal fees', 'Citation values', 'Market relevance'],
    outputFormat: {
      lists: {
        keep: { label: 'Patents to Keep', itemType: 'patent' },
        abandon: { label: 'Patents to Abandon', itemType: 'patent' }
      },
      metrics: {
        savings: { label: 'Annual Savings', unit: 'USD', format: 'currency' }
      }
    },
    icon: '✂️',
    color: 'red',
    targetPersonas: ['IP Manager', 'CIPO'],
    estimatedTime: 12
  },
  {
    id: 'trademark-clearance',
    name: 'Trademark Clearance',
    category: 'trademark',
    description: 'Assess availability and risk of proposed trademarks',
    purpose: 'Evaluate trademark registration feasibility',
    minimalInputs: ['proposed_mark', 'classes', 'jurisdictions', 'risk_tolerance'],
    dataSources: ['Trademark databases', 'Common-law searches', 'Domain availability'],
    outputFormat: {
      verdict: {
        type: 'categorical',
        options: ['Clear', 'Moderate Risk', 'High Risk', 'Unavailable']
      },
      scores: {
        similarity: { min: 0, max: 100, label: 'Similarity Score' }
      }
    },
    icon: '™️',
    color: 'orange',
    targetPersonas: ['Trademark Attorney', 'Brand Manager'],
    estimatedTime: 8
  },
  {
    id: 'registration-strategy',
    name: 'Registration Strategy',
    category: 'trademark',
    description: 'Plan trademark registration across multiple jurisdictions',
    purpose: 'Create trademark filing roadmap',
    minimalInputs: ['brand_details', 'markets', 'budget'],
    dataSources: ['Cost tables', 'Opposition rates', 'Registration timelines'],
    outputFormat: {
      lists: {
        filingPlan: { label: 'Filing Plan', itemType: 'filing' }
      },
      metrics: {
        totalCost: { label: 'Total Cost', unit: 'USD', format: 'currency' },
        timeToRegistration: { label: 'Time to Registration', unit: 'months', format: 'number' }
      }
    },
    icon: '📋',
    color: 'teal',
    targetPersonas: ['Trademark Attorney', 'Brand Manager'],
    estimatedTime: 10
  },
  {
    id: 'enforcement-decision',
    name: 'Enforcement Decision',
    category: 'trademark',
    description: 'Determine appropriate action for trademark infringement',
    purpose: 'Recommend enforcement strategy',
    minimalInputs: ['infringement_details', 'mark_strength'],
    dataSources: ['Enforcement statistics', 'Litigation costs', 'Settlement data'],
    outputFormat: {
      verdict: {
        type: 'categorical',
        options: ['Cease & Desist', 'Negotiate', 'Litigate', 'Monitor']
      },
      metrics: {
        costEstimate: { label: 'Estimated Cost', unit: 'USD', format: 'currency' },
        successRate: { label: 'Success Rate', unit: '%', format: 'percentage' }
      }
    },
    icon: '⚖️',
    color: 'yellow',
    targetPersonas: ['Trademark Attorney', 'Legal Counsel'],
    estimatedTime: 15
  },
  {
    id: 'budget-allocation',
    name: 'IP Budget Allocation',
    category: 'portfolio',
    description: 'Optimize IP spending across business units and activities',
    purpose: 'Allocate IP budget strategically',
    minimalInputs: ['total_budget', 'bu_priorities'],
    dataSources: ['Portfolio ROI', 'Market intelligence', 'Historical spending'],
    outputFormat: {
      lists: {
        allocation: { label: 'Budget Allocation', itemType: 'allocation' }
      },
      metrics: {
        roi: { label: 'Expected ROI', unit: '%', format: 'percentage' }
      }
    },
    icon: '💰',
    color: 'indigo',
    targetPersonas: ['IP Manager', 'CIPO', 'CFO'],
    estimatedTime: 20
  },
  {
    id: 'licensing-decision',
    name: 'Licensing Decision',
    category: 'portfolio',
    description: 'Evaluate build vs. buy vs. license for technology needs',
    purpose: 'Determine optimal technology acquisition strategy',
    minimalInputs: ['technology_need', 'timeline', 'budget'],
    dataSources: ['Licensing comparables', 'Development costs', 'Market rates'],
    outputFormat: {
      verdict: {
        type: 'categorical',
        options: ['Build', 'Buy', 'License', 'Partner']
      },
      metrics: {
        cost: { label: 'Total Cost', unit: 'USD', format: 'currency' },
        timeToMarket: { label: 'Time to Market', unit: 'months', format: 'number' }
      }
    },
    icon: '🤝',
    color: 'cyan',
    targetPersonas: ['IP Manager', 'Business Development'],
    estimatedTime: 15
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment',
    category: 'portfolio',
    description: 'Evaluate FTO and litigation risks for products',
    purpose: 'Assess IP risk exposure',
    minimalInputs: ['product_specs', 'markets', 'risk_appetite'],
    dataSources: ['Litigation databases', 'Claim maps', 'Competitor patents'],
    outputFormat: {
      scores: {
        overallRisk: { min: 0, max: 100, label: 'Overall Risk Score' },
        litigationRisk: { min: 0, max: 100, label: 'Litigation Risk' }
      },
      lists: {
        riskFactors: { label: 'Risk Factors', itemType: 'risk' }
      }
    },
    icon: '⚠️',
    color: 'pink',
    targetPersonas: ['IP Manager', 'Legal Counsel', 'Product Manager'],
    estimatedTime: 25
  },
  {
    id: 'innovation-pipeline',
    name: 'Innovation Pipeline',
    category: 'innovation',
    description: 'Prioritize R&D projects based on IP and market potential',
    purpose: 'Rank and prioritize innovation projects',
    minimalInputs: ['project_list', 'resources', 'goals'],
    dataSources: ['Market size data', 'NPV calculations', 'Technology trends'],
    outputFormat: {
      lists: {
        prioritizedProjects: { label: 'Prioritized Projects', itemType: 'project' }
      },
      metrics: {
        portfolioValue: { label: 'Portfolio Value', unit: 'USD', format: 'currency' }
      }
    },
    icon: '🚀',
    color: 'emerald',
    targetPersonas: ['Innovation Manager', 'R&D Director'],
    estimatedTime: 18
  },
  {
    id: 'technology-scouting',
    name: 'Technology Scouting',
    category: 'innovation',
    description: 'Identify external technologies for acquisition or partnership',
    purpose: 'Find relevant external technologies',
    minimalInputs: ['need_statement', 'budget', 'fit'],
    dataSources: ['Startup databases', 'Patent clusters', 'University research'],
    outputFormat: {
      lists: {
        technologies: { label: 'Technology Candidates', itemType: 'technology' }
      },
      scores: {
        fitScore: { min: 0, max: 100, label: 'Technology Fit' }
      }
    },
    icon: '🔍',
    color: 'violet',
    targetPersonas: ['Innovation Manager', 'Technology Scout'],
    estimatedTime: 12
  },
  {
    id: 'partnership-decision',
    name: 'Partnership Decision',
    category: 'innovation',
    description: 'Evaluate collaboration and partnership opportunities',
    purpose: 'Assess partnership viability',
    minimalInputs: ['challenge_desc', 'capabilities', 'timeline'],
    dataSources: ['Partner databases', 'JV statistics', 'Success rates'],
    outputFormat: {
      verdict: {
        type: 'categorical',
        options: ['Partner', 'Joint Venture', 'Acquire', 'Go Alone']
      },
      lists: {
        partners: { label: 'Potential Partners', itemType: 'partner' }
      }
    },
    icon: '🤲',
    color: 'amber',
    targetPersonas: ['Business Development', 'Innovation Manager'],
    estimatedTime: 14
  }
];

// Question templates for each engine
export const ENGINE_QUESTIONS: Record<string, EngineQuestion[]> = {
  patentability: [
    {
      id: 'invention_description',
      text: 'Please provide a 2-3 sentence summary of your invention (≤100 words)',
      type: 'text',
      required: true,
      maxLength: 500,
      placeholder: 'Describe the key innovation and how it works...',
      helpText: 'Focus on what makes your invention unique and its technical advantages'
    },
    {
      id: 'tech_field',
      text: 'What is the primary technical field? (IPC/CPC classification if known)',
      type: 'select',
      required: true,
      options: [
        { value: 'A', label: 'Human Necessities' },
        { value: 'B', label: 'Operations & Transport' },
        { value: 'C', label: 'Chemistry & Metallurgy' },
        { value: 'D', label: 'Textiles & Paper' },
        { value: 'E', label: 'Fixed Constructions' },
        { value: 'F', label: 'Mechanical Engineering' },
        { value: 'G', label: 'Physics' },
        { value: 'H', label: 'Electricity' }
      ]
    },
    {
      id: 'prior_art_known',
      text: 'Are you aware of any similar patents or products?',
      type: 'text',
      required: false,
      placeholder: 'List patent numbers or product names if known...'
    },
    {
      id: 'commercial_importance',
      text: 'Rate the commercial importance of this invention',
      type: 'scale',
      required: true,
      validation: { min: 1, max: 5 }
    },
    {
      id: 'budget',
      text: 'Approximate filing budget (USD)?',
      type: 'currency',
      required: false,
      placeholder: '50000'
    }
  ],
  'filing-strategy': [
    {
      id: 'invention_details',
      text: 'Briefly describe your invention and its key markets',
      type: 'text',
      required: true,
      maxLength: 500
    },
    {
      id: 'target_markets',
      text: 'Select your target markets for patent protection',
      type: 'multiselect',
      required: true,
      options: [
        { value: 'US', label: 'United States' },
        { value: 'EP', label: 'Europe' },
        { value: 'CN', label: 'China' },
        { value: 'JP', label: 'Japan' },
        { value: 'KR', label: 'South Korea' },
        { value: 'IN', label: 'India' },
        { value: 'CA', label: 'Canada' },
        { value: 'AU', label: 'Australia' }
      ]
    },
    {
      id: 'budget',
      text: 'Total budget for patent filing (USD)',
      type: 'currency',
      required: true
    },
    {
      id: 'timeline',
      text: 'When do you need patent protection in place?',
      type: 'select',
      required: true,
      options: [
        { value: 'immediate', label: 'Immediate (< 3 months)' },
        { value: 'short', label: 'Short-term (3-6 months)' },
        { value: 'medium', label: 'Medium-term (6-12 months)' },
        { value: 'long', label: 'Long-term (> 12 months)' }
      ]
    }
  ]
  // Additional questions for other engines would be defined here
};

// Engine categories for filtering
export const ENGINE_CATEGORIES = [
  { id: 'all', label: 'All Engines', count: 13, icon: '🎯' },
  { id: 'patent', label: 'Patent', count: 3, icon: '🔬' },
  { id: 'trademark', label: 'Trademark', count: 3, icon: '™️' },
  { id: 'portfolio', label: 'Portfolio', count: 4, icon: '📊' },
  { id: 'innovation', label: 'Innovation', count: 3, icon: '🚀' }
];

// Sample recommendations for demo purposes
export const SAMPLE_RECOMMENDATIONS = {
  patentability: {
    verdict: 'Patentable',
    confidence: 0.85,
    reasoning: [
      'The invention demonstrates clear novelty over existing prior art',
      'Non-obviousness is supported by unexpected technical advantages',
      'Industrial applicability is evident in the target market'
    ],
    keyFindings: [
      {
        title: 'Strong Novelty',
        description: 'No direct prior art found that discloses all claimed elements',
        impact: 'high' as const
      },
      {
        title: 'Market Opportunity',
        description: 'Growing market demand with limited competing solutions',
        impact: 'high' as const
      }
    ],
    nextSteps: [
      'Conduct comprehensive freedom-to-operate analysis',
      'Draft provisional patent application within 30 days',
      'Consider PCT filing for international protection'
    ],
    citations: [
      {
        id: 'US10123456B2',
        type: 'patent' as const,
        reference: 'US10123456B2 - Similar technology with key differences',
        relevance: 0.72,
        excerpt: 'Discloses method for... but lacks the novel feature of...'
      }
    ]
  }
};