import { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  FileText,
  Brain,
  Target,
  Clock,
  BarChart3,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { DecisionEngine, EngineQuestion, EngineSession, EngineRecommendation } from '../../types/decisionEngines';
import { ENGINE_QUESTIONS, SAMPLE_RECOMMENDATIONS } from '../../constants/decisionEngines';
import { DecisionEngineService } from '../../lib/decisionEngineService';
import PatentabilityAssessmentEngine from '../engines/PatentabilityAssessmentEngine';

interface DecisionEngineModalProps {
  engine: DecisionEngine;
  currentUser: any;
  onClose: () => void;
  onComplete: (session: EngineSession) => void;
  existingSession?: EngineSession;
}

export default function DecisionEngineModal({
  engine,
  currentUser,
  onClose,
  onComplete,
  existingSession
}: DecisionEngineModalProps) {
  const [currentStep, setCurrentStep] = useState(existingSession?.currentStep || 0);
  const [responses, setResponses] = useState<Record<string, any>>(existingSession?.responses || {});
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendation, setRecommendation] = useState<EngineRecommendation | null>(
    existingSession?.recommendation || null
  );
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<EngineSession | null>(existingSession || null);
  const [showAdvancedEngine, setShowAdvancedEngine] = useState(false);

  const questions = ENGINE_QUESTIONS[engine.id] || [];
  const totalSteps = questions.length + 1; // Questions + recommendation
  const isLastQuestion = currentStep === questions.length - 1;
  const showRecommendation = currentStep >= questions.length;

  useEffect(() => {
    // Initialize or resume session
    if (!session) {
      initializeSession();
    }
  }, []);

  const initializeSession = async () => {
    try {
      const newSession = await DecisionEngineService.createSession(engine.id, currentUser.id);
      setSession(newSession);
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to initialize session');
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentStep];
    
    // Validate current response
    if (currentQuestion && currentQuestion.required && !responses[currentQuestion.id]) {
      setError('Please provide a response to continue');
      return;
    }

    setError(null);

    if (isLastQuestion) {
      // Process responses and generate recommendation
      await generateRecommendation();
    } else {
      // Move to next question
      setCurrentStep(prev => prev + 1);
      
      // Update session
      if (session) {
        await DecisionEngineService.updateSession(session.id, {
          currentStep: currentStep + 1,
          responses
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateRecommendation = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate API call to generate recommendation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, this would call the actual AI service
      // For demo, use sample recommendation
      const sampleRec = SAMPLE_RECOMMENDATIONS.patentability || {
        verdict: 'Pending Analysis',
        confidence: 0.75,
        reasoning: ['Analysis in progress...'],
        keyFindings: [],
        nextSteps: [],
        citations: []
      };

      setRecommendation(sampleRec as EngineRecommendation);
      setCurrentStep(questions.length);

      // Update session
      if (session) {
        const updatedSession = await DecisionEngineService.updateSession(session.id, {
          status: 'completed',
          recommendation: sampleRec,
          completedAt: new Date().toISOString()
        });
        setSession(updatedSession);
        onComplete(updatedSession);
      }
    } catch (error) {
      console.error('Error generating recommendation:', error);
      setError('Failed to generate recommendation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async (format: 'json' | 'pdf') => {
    if (!session || !recommendation) return;

    try {
      const exportData = await DecisionEngineService.exportSession(session.id, format);
      
      // Create download link
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: format === 'json' ? 'application/json' : 'application/pdf' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${engine.id}-recommendation-${session.id}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting session:', error);
      setError('Failed to export session');
    }
  };

  const renderQuestion = (question: EngineQuestion) => {
    const value = responses[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={question.maxLength}
            />
            {question.maxLength && (
              <div className="text-xs text-gray-500 mt-1 text-right">
                {value.length}/{question.maxLength} characters
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select an option...</option>
            {question.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(value as string[])?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = (value as string[]) || [];
                    if (e.target.checked) {
                      handleResponseChange(question.id, [...currentValues, option.value]);
                    } else {
                      handleResponseChange(question.id, currentValues.filter(v => v !== option.value));
                    }
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{question.validation?.min || 1}</span>
              <span className="text-sm text-gray-500">{question.validation?.max || 5}</span>
            </div>
            <input
              type="range"
              min={question.validation?.min || 1}
              max={question.validation?.max || 5}
              value={value || question.validation?.min || 1}
              onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center mt-2">
              <span className="text-2xl font-bold text-indigo-600">{value || question.validation?.min || 1}</span>
            </div>
          </div>
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={value}
              onChange={(e) => handleResponseChange(question.id, parseFloat(e.target.value))}
              placeholder={question.placeholder}
              className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderRecommendation = () => {
    if (!recommendation) return null;

    return (
      <div className="space-y-6">
        {/* Verdict */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recommendation</h3>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">
                {Math.round(recommendation.confidence * 100)}% Confidence
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 mb-2">
            {recommendation.verdict}
          </div>
        </div>

        {/* Key Findings */}
        {recommendation.keyFindings.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              Key Findings
            </h4>
            <div className="space-y-3">
              {recommendation.keyFindings.map((finding, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      finding.impact === 'high' ? 'bg-red-500' :
                      finding.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{finding.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{finding.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reasoning */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-gray-600" />
            Analysis & Reasoning
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2">
              {recommendation.reasoning.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            Recommended Next Steps
          </h4>
          <div className="space-y-2">
            {recommendation.nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                <span className="text-blue-600 font-semibold">{idx + 1}.</span>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Citations */}
        {recommendation.citations.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Supporting Evidence
            </h4>
            <div className="space-y-2">
              {recommendation.citations.map((citation) => (
                <div key={citation.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{citation.reference}</div>
                      {citation.excerpt && (
                        <div className="text-xs text-gray-600 mt-1 italic">"{citation.excerpt}"</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 ml-2">
                      {Math.round(citation.relevance * 100)}% relevant
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleExport('json')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>
    );
  };

  // Check if this is the patentability engine and show advanced version
  if (engine.id === 'patentability' && showAdvancedEngine) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <PatentabilityAssessmentEngine 
          onComplete={(rec) => {
            const completedSession: EngineSession = {
              id: session?.id || `session_${Date.now()}`,
              engineId: engine.id,
              userId: currentUser.id,
              status: 'completed',
              startedAt: session?.startedAt || new Date().toISOString(),
              completedAt: new Date().toISOString(),
              currentStep: 5,
              totalSteps: 5,
              responses,
              recommendation: rec,
              auditTrail: []
            };
            onComplete(completedSession);
          }}
          onClose={onClose}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{engine.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold">{engine.name}</h2>
                  <p className="text-indigo-100 text-sm">{engine.purpose}</p>
                  {engine.id === 'patentability' && (
                    <button
                      onClick={() => setShowAdvancedEngine(true)}
                      className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      Try Advanced AI Engine
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-indigo-100 mb-2">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="bg-indigo-500/30 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {isProcessing ? (
              <div className="py-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Your Inputs</h3>
                <p className="text-gray-600">
                  Our AI is processing your responses and searching relevant databases...
                </p>
              </div>
            ) : showRecommendation ? (
              renderRecommendation()
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Question {currentStep + 1} of {questions.length}
                  </h3>
                  {questions[currentStep] && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {questions[currentStep].text}
                        {questions[currentStep].required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {questions[currentStep].helpText && (
                        <p className="text-sm text-gray-500 mb-3">
                          {questions[currentStep].helpText}
                        </p>
                      )}
                      {renderQuestion(questions[currentStep])}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!isProcessing && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Est. {engine.estimatedTime - currentStep * 2} min remaining</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {currentStep > 0 && !showRecommendation && (
                    <button
                      onClick={handlePrevious}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                  )}
                  
                  {!showRecommendation && (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {isLastQuestion ? 'Generate Recommendation' : 'Next'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  
                  {showRecommendation && (
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}