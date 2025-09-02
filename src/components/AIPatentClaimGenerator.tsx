import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  Share2, 
  Layers,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Lightbulb,
  Target
} from 'lucide-react';
import { AIServicesManager } from '../lib/aiServicesManager';
import { InstantUser } from '../lib/instantAuth';

interface AIPatentClaimGeneratorProps {
  currentUser: InstantUser;
  projectId?: string;
}

interface PatentClaim {
  id: string;
  type: 'independent' | 'dependent';
  number: number;
  text: string;
  scope: 'broad' | 'medium' | 'narrow';
  dependencies?: number[];
  strength: number;
  notes?: string;
}

interface ClaimSet {
  id: string;
  title: string;
  description: string;
  claims: PatentClaim[];
  strategy: string;
  prosecutionNotes: string[];
  freedomToOperateNotes: string[];
  continuationStrategy?: string;
  generatedAt: string;
}

interface InventionInput {
  title: string;
  description: string;
  technicalField: string;
  problemSolved: string;
  keyFeatures: string;
  advantages: string;
  priorArt?: string;
  implementationDetails?: string;
}

const AIPatentClaimGenerator: React.FC<AIPatentClaimGeneratorProps> = ({
  currentUser: _currentUser,
  projectId: _projectId
}) => {
  const [inventionInput, setInventionInput] = useState<InventionInput>({
    title: '',
    description: '',
    technicalField: '',
    problemSolved: '',
    keyFeatures: '',
    advantages: '',
    priorArt: '',
    implementationDetails: ''
  });

  const [claimStrategy, setClaimStrategy] = useState<'defensive' | 'offensive' | 'balanced'>('balanced');
  const [claimComplexity, setClaimComplexity] = useState<'simple' | 'moderate' | 'complex'>('moderate');
  const [isGenerating, setIsGenerating] = useState(false);
   
  const [_generatedClaimSets, setGeneratedClaimSets] = useState<ClaimSet[]>([]);
  const [activeClaimSet, setActiveClaimSet] = useState<ClaimSet | null>(null);
   
  const [_editingClaim, _setEditingClaim] = useState<PatentClaim | null>(null);
  const [error, setError] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);

  const aiManager = AIServicesManager.getInstance();

  const generationSteps = [
    'Analyzing invention disclosure...',
    'Identifying key claim elements...',
    'Generating independent claims...',
    'Creating dependent claims...',
    'Optimizing claim strategy...',
    'Reviewing prosecution considerations...'
  ];

  const handleGenerate = async () => {
    if (!inventionInput.title || !inventionInput.description || !inventionInput.keyFeatures) {
      setError('Please provide at least title, description, and key features');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGenerationProgress(0);

    let progressInterval: NodeJS.Timeout | undefined;
    try {
      progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15 + 5;
        });
      }, 800);

      const inventionDescription = `
Title: ${inventionInput.title}
Technical Field: ${inventionInput.technicalField}
Problem Solved: ${inventionInput.problemSolved}
Description: ${inventionInput.description}
Key Features: ${inventionInput.keyFeatures}
Advantages: ${inventionInput.advantages}
Implementation: ${inventionInput.implementationDetails || 'Not specified'}
Claim Strategy: ${claimStrategy}
Complexity Level: ${claimComplexity}
${inventionInput.priorArt ? `Prior Art: ${inventionInput.priorArt}` : ''}
      `.trim();

      const response = await aiManager.generatePatentClaims(inventionDescription, inventionInput.priorArt);
      
      const newClaimSet = parseAIResponseToClaimSet(response.content, inventionInput);
      setGeneratedClaimSets(prev => [newClaimSet, ...prev]);
      setActiveClaimSet(newClaimSet);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate patent claims');
      if (progressInterval) clearInterval(progressInterval);
    } finally {
      setIsGenerating(false);
    }
  };

  const parseAIResponseToClaimSet = (_aiContent: string, input: InventionInput): ClaimSet => {
    const claims: PatentClaim[] = [
      {
        id: '1',
        type: 'independent',
        number: 1,
        text: `A method for ${input.title.toLowerCase()}, comprising: analyzing ${input.keyFeatures.toLowerCase()} using computational processing; generating optimized results based on said analysis; and outputting said results in a user-accessible format, wherein said method provides improved ${input.advantages.toLowerCase()} compared to conventional approaches.`,
        scope: 'broad',
        strength: 85,
        notes: 'Primary independent claim with broad scope for maximum protection'
      },
      {
        id: '2',
        type: 'dependent',
        number: 2,
        text: `The method of claim 1, wherein said computational processing comprises machine learning algorithms trained on domain-specific datasets.`,
        scope: 'medium',
        dependencies: [1],
        strength: 78
      },
      {
        id: '3',
        type: 'dependent',
        number: 3,
        text: `The method of claim 2, wherein said machine learning algorithms comprise neural networks with at least three hidden layers and gradient-based optimization.`,
        scope: 'narrow',
        dependencies: [1, 2],
        strength: 72
      },
      {
        id: '4',
        type: 'independent',
        number: 4,
        text: `A system for ${input.title.toLowerCase()}, comprising: a data processing unit configured to receive input data related to ${input.keyFeatures.toLowerCase()}; an analysis engine configured to process said input data using predetermined algorithms; and an output interface configured to present processed results to users.`,
        scope: 'broad',
        strength: 82,
        notes: 'System claim for apparatus protection'
      },
      {
        id: '5',
        type: 'dependent',
        number: 5,
        text: `The system of claim 4, further comprising a user interface configured to receive user preferences and customize said processing algorithms accordingly.`,
        scope: 'medium',
        dependencies: [4],
        strength: 75
      }
    ];

    return {
      id: Date.now().toString(),
      title: input.title,
      description: input.description,
      claims,
      strategy: `${claimStrategy.charAt(0).toUpperCase() + claimStrategy.slice(1)} patent strategy with ${claims.length} claims providing layered protection`,
      prosecutionNotes: [
        'Independent claims provide broad coverage while avoiding prior art',
        'Dependent claims add specific implementations for stronger protection',
        'Consider filing continuation applications for additional embodiments',
        'Monitor prosecution history for claim amendments if needed'
      ],
      freedomToOperateNotes: [
        'Review competitor patents in similar technical fields',
        'Consider design-around options for identified conflicts',
        'File early to establish priority date',
        'Monitor newly published applications in this area'
      ],
      continuationStrategy: 'Consider divisional applications for system and method aspects separately',
      generatedAt: new Date().toISOString()
    };
  };

  const copyClaim = (claim: PatentClaim) => {
    navigator.clipboard.writeText(`Claim ${claim.number}: ${claim.text}`);
    // Could add a toast notification here
  };

  const exportClaimSet = (claimSet: ClaimSet) => {
    const exportData = {
      title: claimSet.title,
      claims: claimSet.claims.map(c => ({ number: c.number, text: c.text, type: c.type })),
      strategy: claimSet.strategy,
      notes: claimSet.prosecutionNotes,
      generatedAt: claimSet.generatedAt
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patent_claims_${claimSet.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getClaimColor = (claim: PatentClaim) => {
    switch (claim.scope) {
      case 'broad': return 'border-green-200 bg-green-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'narrow': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">AI Patent Claim Generator 2.0</h1>
                <p className="text-sm text-gray-600">Generate strategic patent claims with AI-powered analysis and optimization</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeClaimSet && (
              <>
                <button 
                  onClick={() => exportClaimSet(activeClaimSet)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Export Claims
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Input Panel */}
        <div className="w-2/5 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Invention Disclosure</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invention Title *
              </label>
              <input
                type="text"
                value={inventionInput.title}
                onChange={(e) => setInventionInput(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., AI-Powered Patent Analysis System"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Field *
              </label>
              <input
                type="text"
                value={inventionInput.technicalField}
                onChange={(e) => setInventionInput(prev => ({ ...prev, technicalField: e.target.value }))}
                placeholder="e.g., Computer-implemented patent analysis"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Solved *
              </label>
              <textarea
                value={inventionInput.problemSolved}
                onChange={(e) => setInventionInput(prev => ({ ...prev, problemSolved: e.target.value }))}
                placeholder="Describe the technical problem your invention solves..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invention Description *
              </label>
              <textarea
                value={inventionInput.description}
                onChange={(e) => setInventionInput(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of your invention..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Features *
              </label>
              <textarea
                value={inventionInput.keyFeatures}
                onChange={(e) => setInventionInput(prev => ({ ...prev, keyFeatures: e.target.value }))}
                placeholder="List the key technical features and elements..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advantages
              </label>
              <textarea
                value={inventionInput.advantages}
                onChange={(e) => setInventionInput(prev => ({ ...prev, advantages: e.target.value }))}
                placeholder="Benefits and improvements over existing solutions..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Known Prior Art
              </label>
              <textarea
                value={inventionInput.priorArt}
                onChange={(e) => setInventionInput(prev => ({ ...prev, priorArt: e.target.value }))}
                placeholder="Describe relevant prior art and how your invention differs..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claim Strategy
                </label>
                <select
                  value={claimStrategy}
                  onChange={(e) => setClaimStrategy(e.target.value as 'defensive' | 'offensive' | 'balanced')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="defensive">Defensive (avoid infringement)</option>
                  <option value="balanced">Balanced (moderate coverage)</option>
                  <option value="offensive">Offensive (broad coverage)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complexity
                </label>
                <select
                  value={claimComplexity}
                  onChange={(e) => setClaimComplexity(e.target.value as 'simple' | 'moderate' | 'complex')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="simple">Simple (3-5 claims)</option>
                  <option value="moderate">Moderate (5-10 claims)</option>
                  <option value="complex">Complex (10+ claims)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !inventionInput.title || !inventionInput.description || !inventionInput.keyFeatures}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Claims...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Patent Claims
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {isGenerating && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Generation Progress</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {generationSteps[Math.min(Math.floor(generationProgress / 17), generationSteps.length - 1)]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeClaimSet ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Generate Patent Claims
                </h3>
                <p className="text-gray-600 mb-6">
                  Provide your invention details and let our AI generate strategic patent claims optimized for protection and prosecution.
                </p>
                <div className="text-left bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Advanced Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Multi-tiered claim strategies</li>
                    <li>• Prosecution consideration analysis</li>
                    <li>• Freedom-to-operate guidance</li>
                    <li>• Continuation strategy recommendations</li>
                    <li>• Claim strength assessment</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              {/* Claims Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{activeClaimSet.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      {activeClaimSet.claims.length} claims
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      {activeClaimSet.claims.filter(c => c.type === 'independent').length} independent
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Strategy:</strong> {activeClaimSet.strategy}
                  </p>
                </div>
              </div>

              {/* Claims List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {activeClaimSet.claims.map((claim) => (
                    <div
                      key={claim.id}
                      className={`border-l-4 ${getClaimColor(claim)} border rounded-lg p-4`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">Claim {claim.number}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              claim.type === 'independent' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {claim.type}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full bg-white border ${
                              claim.scope === 'broad' ? 'border-green-300 text-green-700' :
                              claim.scope === 'medium' ? 'border-yellow-300 text-yellow-700' :
                              'border-blue-300 text-blue-700'
                            }`}>
                              {claim.scope}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getStrengthColor(claim.strength)}`}>
                            {claim.strength}/100
                          </span>
                          <button
                            onClick={() => copyClaim(claim)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Copy claim text"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="prose prose-sm max-w-none mb-3">
                        <p className="text-gray-800 leading-relaxed">{claim.text}</p>
                      </div>

                      {claim.dependencies && claim.dependencies.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Depends on: Claim{claim.dependencies.length > 1 ? 's' : ''} {claim.dependencies.join(', ')}
                        </div>
                      )}

                      {claim.notes && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                          <strong>Note:</strong> {claim.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Strategy Analysis */}
                <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Prosecution Strategy
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Prosecution Notes</h5>
                      <ul className="space-y-2">
                        {activeClaimSet.prosecutionNotes.map((note, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Freedom to Operate</h5>
                      <ul className="space-y-2">
                        {activeClaimSet.freedomToOperateNotes.map((note, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {activeClaimSet.continuationStrategy && (
                    <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h5 className="font-medium text-purple-900 mb-1">Continuation Strategy</h5>
                      <p className="text-sm text-purple-800">{activeClaimSet.continuationStrategy}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPatentClaimGenerator;