import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepProgressBarProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepIndex: number) => void;
  className?: string;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  className = ''
}) => {
  const progress = steps.length > 0 ? ((completedSteps.length / steps.length) * 100).toFixed(0) : 0;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Decision Progress</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">{progress}%</span>
          <span className="text-sm text-gray-600">Complete</span>
        </div>
      </div>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isClickable = index <= Math.max(...completedSteps, currentStep);
            const isNext = index === currentStep + 1 && completedSteps.includes(currentStep);
            
            return (
              <div key={step.id} className="flex flex-col items-center relative group">
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    relative z-10 flex flex-col items-center transition-all duration-200
                    ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                  `}
                >
                  {/* Step Circle */}
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center font-semibold text-lg
                    transition-all duration-300 transform
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-100' 
                      : isCurrent 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl scale-110 ring-4 ring-blue-200' 
                        : isNext
                          ? 'bg-white border-2 border-blue-400 text-blue-600 shadow-md hover:scale-105'
                          : 'bg-gray-100 text-gray-400 border-2 border-gray-200'}
                    ${isClickable && !isCompleted && !isCurrent ? 'hover:shadow-lg hover:scale-105' : ''}
                  `}>
                    {isCompleted ? (
                      <Check className="w-6 h-6" strokeWidth={3} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <p className={`
                      text-sm font-medium transition-colors
                      ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'}
                    `}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-gray-500 mt-1 max-w-[120px]">
                        {step.description}
                      </p>
                    )}
                  </div>

                  {/* Current Step Indicator */}
                  {isCurrent && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        Current Step
                      </div>
                    </div>
                  )}
                </button>

                {/* Connector Arrow (not on last step) */}
                {index < steps.length - 1 && (
                  <ChevronRight className={`
                    absolute top-8 -right-1/2 transform translate-x-1/2 w-5 h-5
                    ${completedSteps.includes(index) ? 'text-green-500' : 'text-gray-300'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Completed: {completedSteps.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">In Progress: {currentStep + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-gray-600">Remaining: {steps.length - completedSteps.length - 1}</span>
            </div>
          </div>
          <div className="text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProgressBar;