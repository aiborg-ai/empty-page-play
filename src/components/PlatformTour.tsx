import { useState, useEffect } from 'react';
import { X, Info, Eye, Settings, Filter } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  position: 'left' | 'right' | 'center';
  target?: string;
}

interface PlatformTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function PlatformTour({ isOpen, onClose, onComplete }: PlatformTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      id: 'filter-pane',
      title: 'Filter Pane',
      content: 'The filter pane shows the top faceted values for various patent and scholarly metadata. Explore the values available by expanding or collapsing relevant selections. Click a value to restrict your results to only documents matching that filter. Click a second time to exclude values.',
      position: 'right'
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipTour = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Mock Background Content */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Sidebar */}
        <div className="absolute left-0 top-0 w-12 h-full bg-gray-100 border-r border-gray-300">
          <div className="p-2 space-y-4 pt-6">
            <button className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </button>
            <button className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
              <Info className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-12 h-full bg-gray-50">
          {/* Header */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4">
            <div className="text-lg font-semibold text-gray-900">innospot Platform</div>
          </div>

          {/* Search Results */}
          <div className="p-4">
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Search Results</div>
              <div className="flex gap-2 mb-4">
                <button className="px-3 py-1 bg-gray-200 rounded text-sm">Expand</button>
                <button className="px-3 py-1 bg-gray-200 rounded text-sm">Customise List</button>
                <button className="px-3 py-1 bg-gray-200 rounded text-sm">Save as Query</button>
                <button className="px-3 py-1 bg-gray-200 rounded text-sm">Save as Collection</button>
              </div>
            </div>

            {/* Sample Results */}
            <div className="space-y-4">
              <div className="bg-white rounded border border-gray-200 p-4">
                <h3 className="font-medium text-blue-600 mb-2">
                  Substrates Treated With Solutions Containing Cyclodextrins And Independent Products
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <span className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs">US</span>
                    US 2025/0241804 A1
                  </span>
                  <span>Patent Application</span>
                  <span>Family: 1s / 1ex</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Application No: 18858128    Filed: Apr 17, 2023    Published: Jul 31, 2025</div>
                  <div>Applicants: Rayonier Advanced Materials Inc.</div>
                  <div>Inventors: Harry Chmielewski , Tina Murguia , Mike Peach , Priyanka Bhagat</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded">Unknown</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Full text</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Abstract</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Claims</span>
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded">English</span>
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 p-4">
                <h3 className="font-medium text-blue-600 mb-2">
                  Voltage Scaling Current Limit For Multistage Power Supply
                </h3>
                <div className="text-sm text-gray-600">
                  Additional sample result content...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Filter Pane Tooltip */}
      {currentStep === 0 && (
        <div className="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-60">
          <div className="p-4">
            <p className="text-sm text-gray-700 mb-4">
              The filter pane shows the top faceted values for various patent and scholarly metadata. Explore the values available by expanding or collapsing relevant selections. Click a value to restrict your results to only documents matching that filter. Click a second time to exclude values.
            </p>
            
            <p className="text-sm text-gray-700 mb-4">
              The flags section additionally contains high level filters like "Is Open Access" or "Has Full Text"
            </p>

            <div className="flex gap-2">
              <button 
                onClick={handleSkipTour}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 text-sm rounded"
              >
                Skip Tour
              </button>
              <button 
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}