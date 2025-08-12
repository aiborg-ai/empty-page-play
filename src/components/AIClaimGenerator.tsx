import { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle,
  AlertTriangle,
  Copy,
  Download,
  RefreshCw
} from 'lucide-react';
import { AIClaimGenerator } from '../lib/aiClaimGenerator';
import type { 
  AIClaimGenerationRequest, 
  AIClaimGenerationResponse, 
  PatentClaim 
} from '../types/innovations';

interface AIClaimGeneratorProps {
  currentUser: any;
  projectId?: string;
}

export default function AIClaimGeneratorComponent({ currentUser, projectId: _projectId }: AIClaimGeneratorProps) {
  const [request, setRequest] = useState<Partial<AIClaimGenerationRequest>>({
    innovation: '',
    priorArt: [''],
    technicalField: '',
    inventorNames: [currentUser?.displayName || ''],
    preferredStyle: 'balanced',
    numberOfClaims: 5
  });
  
  const [response, setResponse] = useState<AIClaimGenerationResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingClaim, setEditingClaim] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);

  const claimGenerator = new AIClaimGenerator();

  const handleAddPriorArt = () => {
    setRequest(prev => ({
      ...prev,
      priorArt: [...(prev.priorArt || ['']), '']
    }));
  };

  const handleRemovePriorArt = (index: number) => {
    setRequest(prev => ({
      ...prev,
      priorArt: prev.priorArt?.filter((_, i) => i !== index) || []
    }));
  };

  const handleUpdatePriorArt = (index: number, value: string) => {
    setRequest(prev => ({
      ...prev,
      priorArt: prev.priorArt?.map((art, i) => i === index ? value : art) || []
    }));
  };

  const handleAddInventor = () => {
    setRequest(prev => ({
      ...prev,
      inventorNames: [...(prev.inventorNames || ['']), '']
    }));
  };

  const handleRemoveInventor = (index: number) => {
    setRequest(prev => ({
      ...prev,
      inventorNames: prev.inventorNames?.filter((_, i) => i !== index) || []
    }));
  };

  const handleUpdateInventor = (index: number, value: string) => {
    setRequest(prev => ({
      ...prev,
      inventorNames: prev.inventorNames?.map((name, i) => i === index ? value : name) || []
    }));
  };

  const handleGenerateClaims = async () => {
    if (!request.innovation || !request.technicalField) {
      alert('Please fill in the innovation description and technical field');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await claimGenerator.generateClaims(request as AIClaimGenerationRequest);
      setResponse(result);
    } catch (error) {
      alert(`Failed to generate claims: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleValidateClaims = async () => {
    if (!response?.claims) return;

    try {
      const validation = await claimGenerator.validateClaims(response.claims);
      setValidationResult(validation);
    } catch (error) {
      alert(`Failed to validate claims: ${error}`);
    }
  };

  const handleRefineClaim = async (claim: PatentClaim, feedback: string) => {
    try {
      const refinedClaim = await claimGenerator.refineClaim(claim, feedback);
      setResponse(prev => prev ? {
        ...prev,
        claims: prev.claims.map(c => c.id === claim.id ? refinedClaim : c)
      } : null);
      setEditingClaim(null);
    } catch (error) {
      alert(`Failed to refine claim: ${error}`);
    }
  };

  const handleCopyClaims = () => {
    if (!response?.claims) return;
    
    const claimsText = response.claims.map(claim => 
      `${claim.claimNumber}. ${claim.claimText}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(claimsText);
    alert('Claims copied to clipboard!');
  };

  const handleExportClaims = () => {
    if (!response?.claims) return;

    const claimsText = response.claims.map(claim => 
      `${claim.claimNumber}. ${claim.claimText}`
    ).join('\n\n');
    
    const blob = new Blob([claimsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patent-claims.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Patent Claim Generator</h1>
              <p className="text-gray-600">Generate precise patent claims using AI assistance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Innovation Details</h2>
            
            {/* Innovation Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Innovation Description *
              </label>
              <textarea
                value={request.innovation}
                onChange={(e) => setRequest(prev => ({ ...prev, innovation: e.target.value }))}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your innovation in detail..."
              />
            </div>

            {/* Technical Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Field *
              </label>
              <input
                type="text"
                value={request.technicalField}
                onChange={(e) => setRequest(prev => ({ ...prev, technicalField: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Computer Software, Medical Devices, etc."
              />
            </div>

            {/* Prior Art */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prior Art References
              </label>
              {request.priorArt?.map((art, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={art}
                    onChange={(e) => handleUpdatePriorArt(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Prior art reference..."
                  />
                  <button
                    onClick={() => handleRemovePriorArt(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddPriorArt}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                <Plus className="w-4 h-4" />
                Add Prior Art
              </button>
            </div>

            {/* Inventors */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inventors
              </label>
              {request.inventorNames?.map((name, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleUpdateInventor(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Inventor name..."
                  />
                  <button
                    onClick={() => handleRemoveInventor(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddInventor}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                <Plus className="w-4 h-4" />
                Add Inventor
              </button>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style Preference
                </label>
                <select
                  value={request.preferredStyle}
                  onChange={(e) => setRequest(prev => ({ ...prev, preferredStyle: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="broad">Broad</option>
                  <option value="specific">Specific</option>
                  <option value="balanced">Balanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Claims
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={request.numberOfClaims}
                  onChange={(e) => setRequest(prev => ({ ...prev, numberOfClaims: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateClaims}
              disabled={isGenerating || !request.innovation || !request.technicalField}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Claims...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Claims
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Generated Claims</h2>
              {response && (
                <div className="flex gap-2">
                  <button
                    onClick={handleValidateClaims}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Validate
                  </button>
                  <button
                    onClick={handleCopyClaims}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={handleExportClaims}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              )}
            </div>

            {response ? (
              <div className="space-y-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{response.confidence.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{response.claims.length}</div>
                    <div className="text-sm text-gray-600">Claims</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      response.estimatedStrength === 'strong' ? 'text-green-600' :
                      response.estimatedStrength === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {response.estimatedStrength.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">Strength</div>
                  </div>
                </div>

                {/* Validation Results */}
                {validationResult && (
                  <div className={`p-4 rounded-lg ${
                    validationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {validationResult.valid ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        validationResult.valid ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {validationResult.valid ? 'Claims Validated' : 'Validation Issues Found'}
                      </span>
                    </div>
                    {validationResult.issues?.length > 0 && (
                      <div className="mb-2">
                        <div className="text-sm font-medium text-red-800 mb-1">Issues:</div>
                        <ul className="text-sm text-red-700 list-disc list-inside">
                          {validationResult.issues.map((issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {validationResult.recommendations?.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-blue-800 mb-1">Recommendations:</div>
                        <ul className="text-sm text-blue-700 list-disc list-inside">
                          {validationResult.recommendations.map((rec: string, index: number) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Claims */}
                <div className="space-y-4">
                  {response.claims.map((claim, _index) => (
                    <div key={claim.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            claim.claimType === 'independent' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {claim.claimType.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600">
                            Claim {claim.claimNumber} • Confidence: {(claim.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <button
                          onClick={() => setEditingClaim(editingClaim === claim.id ? null : claim.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-900 mb-3 leading-relaxed">
                        <strong>{claim.claimNumber}.</strong> {claim.claimText}
                      </div>

                      {claim.suggestions.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs font-medium text-gray-700 mb-1">Suggestions:</div>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {claim.suggestions.map((suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {editingClaim === claim.id && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <textarea
                            placeholder="Provide feedback for refinement..."
                            className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                handleRefineClaim(claim, (e.target as HTMLTextAreaElement).value);
                              }
                            }}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={(e) => {
                                const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                                handleRefineClaim(claim, textarea.value);
                              }}
                              className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                              Refine Claim
                            </button>
                            <button
                              onClick={() => setEditingClaim(null)}
                              className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                {response.recommendations.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Recommendations</h3>
                    <ul className="text-sm text-blue-800 list-disc list-inside">
                      {response.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Potential Issues */}
                {response.potentialIssues.length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-medium text-yellow-900 mb-2">Potential Issues</h3>
                    <ul className="text-sm text-yellow-800 list-disc list-inside">
                      {response.potentialIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Fill in the innovation details and click "Generate Claims" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}