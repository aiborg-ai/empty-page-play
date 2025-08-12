import React, { useState } from 'react';
import { X, Sparkles, Upload, Wand2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import FileUpload from '../FileUpload';
import { ClaudeService } from '../../lib/claudeService';
import { DashboardService } from '../../lib/dashboardService';
import type { CreateDashboardData } from '../../types/cms';

interface AIDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDashboardCreated: (dashboardId: string) => void;
  currentUser: any;
}

interface GenerationStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

const AIDashboardModal: React.FC<AIDashboardModalProps> = ({
  isOpen,
  onClose,
  onDashboardCreated,
  currentUser: _currentUser
}) => {
  const [step, setStep] = useState<'upload' | 'configure' | 'generating' | 'review'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [generatedDashboard, setGeneratedDashboard] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { id: 'analyze', label: 'Analyzing data structure', status: 'pending' },
    { id: 'extract', label: 'Extracting key metrics', status: 'pending' },
    { id: 'design', label: 'Designing dashboard layout', status: 'pending' },
    { id: 'optimize', label: 'Optimizing visualizations', status: 'pending' },
    { id: 'finalize', label: 'Finalizing dashboard', status: 'pending' }
  ]);

  const claudeService = ClaudeService.getInstance();
  const dashboardService = DashboardService.getInstance();

  const handleFileSelect = (file: File, content: string) => {
    setSelectedFile(file);
    setFileContent(content);
    setError('');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileContent('');
    setError('');
  };

  const updateGenerationStep = (stepId: string, status: GenerationStep['status']) => {
    setGenerationSteps(prev => 
      prev.map(step => step.id === stepId ? { ...step, status } : step)
    );
  };

  const simulateGenerationSteps = async () => {
    const steps = ['analyze', 'extract', 'design', 'optimize', 'finalize'];
    
    for (let i = 0; i < steps.length; i++) {
      updateGenerationStep(steps[i], 'in_progress');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      updateGenerationStep(steps[i], 'completed');
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !fileContent) {
      setError('Please upload a file first');
      return;
    }

    setIsGenerating(true);
    setStep('generating');
    setError('');

    try {
      // Reset generation steps
      setGenerationSteps(prev => 
        prev.map(step => ({ ...step, status: 'pending' as const }))
      );

      // Run generation steps in parallel
      const [generationResult] = await Promise.all([
        claudeService.generateDashboardFromData(selectedFile.name, fileContent, userPrompt),
        simulateGenerationSteps()
      ]);

      // Get insights
      const dataInsights = await claudeService.suggestDataInsights(fileContent);
      setInsights(dataInsights);

      setGeneratedDashboard(generationResult);
      setStep('review');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate dashboard';
      setError(errorMsg);
      setStep('configure');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateDashboard = async () => {
    if (!generatedDashboard) return;

    setIsGenerating(true);
    setError('');

    try {
      const dashboardData: CreateDashboardData = {
        name: generatedDashboard.name,
        description: generatedDashboard.description,
        type: generatedDashboard.type || 'analytics',
        widgets: generatedDashboard.widgets || [],
        layout: { type: 'grid', columns: 12 },
        theme: 'modern',
        access_level: 'private',
        filters: {},
        data_sources: [],
        queries: {},
        parameters: {}
      };

      const { data: dashboard, error } = await dashboardService.createDashboard(dashboardData);
      
      if (error) {
        throw new Error(error);
      }

      if (dashboard) {
        onDashboardCreated(dashboard.id);
        onClose();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create dashboard';
      setError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setSelectedFile(null);
    setFileContent('');
    setUserPrompt('');
    setGeneratedDashboard(null);
    setInsights([]);
    setIsGenerating(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              AI Dashboard Generator
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={isGenerating}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: File Upload */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Your Data
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Upload an Excel file, CSV, or other data file. Our AI will analyze it and create a customized dashboard.
                </p>
              </div>

              <FileUpload
                onFileSelect={handleFileSelect}
                onRemove={handleRemoveFile}
                maxSize={25}
                acceptedTypes={['.xlsx', '.xls', '.csv', '.json', '.txt']}
              />

              {selectedFile && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setStep('configure')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Configure */}
          {step === 'configure' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Configure Your Dashboard
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Provide additional context to help our AI create the most relevant dashboard for your needs.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Upload className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFile?.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {((selectedFile?.size || 0) / 1024).toFixed(1)} KB
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What type of insights are you looking for? (Optional)
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="e.g., Focus on sales performance, customer trends, inventory levels, etc."
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('upload')}
                  className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>Generate Dashboard</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Generating */}
          {step === 'generating' && (
            <div className="space-y-6">
              <div className="text-center">
                <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Creating Your Dashboard
                </h3>
                <p className="text-gray-600">
                  Our AI is analyzing your data and designing the perfect dashboard...
                </p>
              </div>

              <div className="space-y-3">
                {generationSteps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {step.status === 'pending' && (
                      <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                    )}
                    {step.status === 'in_progress' && (
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    )}
                    {step.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {step.status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${
                      step.status === 'completed' ? 'text-gray-900 font-medium' : 'text-gray-600'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 'review' && generatedDashboard && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Review Your Dashboard
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Your AI-generated dashboard is ready! Review the details below and create it.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {generatedDashboard.name}
                </h4>
                <p className="text-gray-700 text-sm mb-3">
                  {generatedDashboard.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {generatedDashboard.tags?.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white bg-opacity-60 text-xs rounded-full text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Dashboard Widgets ({generatedDashboard.widgets?.length || 0})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {generatedDashboard.widgets?.map((widget: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-sm text-gray-900 mb-1">
                        {widget.title}
                      </h5>
                      <p className="text-xs text-gray-600 capitalize">
                        {widget.type.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {insights.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    AI Insights from Your Data
                  </h4>
                  <div className="space-y-2">
                    {insights.map((insight, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('configure')}
                  className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Back to Configure
                </button>
                <button
                  onClick={handleCreateDashboard}
                  disabled={isGenerating}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <span>Create Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDashboardModal;