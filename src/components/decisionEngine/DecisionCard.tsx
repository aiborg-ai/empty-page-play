import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Target, Settings, Zap, AlertCircle, Info } from 'lucide-react';
import { StepConfiguration, StepInput } from '../../types/aiAgentBuilder';

interface DecisionCardProps {
  step: StepConfiguration;
  onComplete: (data: Record<string, any>) => void;
  isProcessing?: boolean;
  previousResponse?: Record<string, any>;
  className?: string;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  step,
  onComplete,
  isProcessing = false,
  previousResponse,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState({
    mission: true,
    method: false,
    impact: false
  });
  
  const [formData, setFormData] = useState<Record<string, any>>(previousResponse || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const validateInput = (input: StepInput, value: any): string | null => {
    if (input.required && !value) {
      return `${input.label} is required`;
    }

    if (input.validation) {
      const { min, max, minLength, maxLength, pattern } = input.validation;
      
      if (min !== undefined && Number(value) < min) {
        return `Must be at least ${min}`;
      }
      if (max !== undefined && Number(value) > max) {
        return `Must be at most ${max}`;
      }
      if (minLength && value.length < minLength) {
        return `Must be at least ${minLength} characters`;
      }
      if (maxLength && value.length > maxLength) {
        return `Must be at most ${maxLength} characters`;
      }
      if (pattern && !new RegExp(pattern).test(value)) {
        return input.validation.message || 'Invalid format';
      }
    }

    return null;
  };

  const handleInputChange = (inputId: string, value: any, input: StepInput) => {
    setFormData(prev => ({ ...prev, [inputId]: value }));
    
    // Clear error when user starts typing
    if (errors[inputId]) {
      setErrors(prev => ({ ...prev, [inputId]: '' }));
    }
    
    // Validate on change for better UX
    const error = validateInput(input, value);
    if (error) {
      setErrors(prev => ({ ...prev, [inputId]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all inputs
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    step.inputs.forEach(input => {
      const error = validateInput(input, formData[input.id]);
      if (error) {
        newErrors[input.id] = error;
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    onComplete(formData);
  };

  const renderInput = (input: StepInput) => {
    const value = formData[input.id] || input.defaultValue || '';
    const error = errors[input.id];

    switch (input.type) {
      case 'text':
        return (
          <div key={input.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {input.label}
              {input.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(input.id, e.target.value, input)}
              placeholder={input.placeholder}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {input.helpText && !error && (
              <p className="text-xs text-gray-500 flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5" />
                {input.helpText}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-600 flex items-start gap-1">
                <AlertCircle className="w-3 h-3 mt-0.5" />
                {error}
              </p>
            )}
          </div>
        );

      case 'number':
      case 'currency':
      case 'percentage':
        return (
          <div key={input.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {input.label}
              {input.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              {input.type === 'currency' && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              )}
              <input
                type="number"
                value={value}
                onChange={(e) => handleInputChange(input.id, e.target.value, input)}
                placeholder={input.placeholder}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  input.type === 'currency' ? 'pl-8' : ''
                } ${input.type === 'percentage' ? 'pr-8' : ''} ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {input.type === 'percentage' && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              )}
            </div>
            {error && (
              <p className="text-xs text-red-600 flex items-start gap-1">
                <AlertCircle className="w-3 h-3 mt-0.5" />
                {error}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={input.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {input.label}
              {input.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleInputChange(input.id, e.target.value, input)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select {input.label}</option>
              {input.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <p className="text-xs text-red-600 flex items-start gap-1">
                <AlertCircle className="w-3 h-3 mt-0.5" />
                {error}
              </p>
            )}
          </div>
        );

      case 'multiselect':
        return (
          <div key={input.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {input.label}
              {input.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {input.options?.map(option => (
                <label key={option.value} className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter(v => v !== option.value);
                      handleInputChange(input.id, newValues, input);
                    }}
                    className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    {option.description && (
                      <p className="text-xs text-gray-500">{option.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {error && (
              <p className="text-xs text-red-600 flex items-start gap-1">
                <AlertCircle className="w-3 h-3 mt-0.5" />
                {error}
              </p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={input.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {input.label}
              {input.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleInputChange(input.id, e.target.value, input)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="text-xs text-red-600 flex items-start gap-1">
                <AlertCircle className="w-3 h-3 mt-0.5" />
                {error}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
          {step.description && (
            <p className="text-gray-600 mt-2">{step.description}</p>
          )}
        </div>

        {/* Mission Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('mission')}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Mission</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{step.mission}</p>
              </div>
            </div>
            {expandedSections.mission ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {expandedSections.mission && (
            <div className="mt-4 p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-6">{step.mission}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {step.inputs.map(renderInput)}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Continue to Next Step'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Method Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('method')}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Method</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{step.method}</p>
              </div>
            </div>
            {expandedSections.method ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {expandedSections.method && (
            <div className="mt-4 p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-4">{step.method}</p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Processing Pipeline</h4>
                <p className="text-sm text-gray-600">{step.aiProcessing}</p>
              </div>
            </div>
          )}
        </div>

        {/* Impact Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('impact')}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Impact</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{step.impact}</p>
              </div>
            </div>
            {expandedSections.impact ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {expandedSections.impact && (
            <div className="mt-4 p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-4">{step.impact}</p>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Expected Outputs:</h4>
                {step.outputs.map(output => (
                  <div key={output.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">{output.label}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {output.type}
                      {output.unit && ` (${output.unit})`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecisionCard;