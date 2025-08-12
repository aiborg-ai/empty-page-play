import { useState } from 'react';
import { X, Clock, Folder, CheckCircle, Play } from 'lucide-react';
import { Capability, RunCapabilityRequest, CapabilityParameter } from '../../types/capabilities';
import { Project } from '../../types/cms';
import { getProjectAssetCount } from '../../utils/showcaseUtils';
import DataDictionaryViewer from '../DataDictionaryViewer';

interface RunCapabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  capability: Capability | null;
  projects: Project[];
  onRun: (request: RunCapabilityRequest) => void;
}

export const RunCapabilityModal = ({ 
  isOpen, 
  onClose, 
  capability, 
  projects, 
  onRun 
}: RunCapabilityModalProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, string | number | boolean>>({});
  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [assetNamingPrefix, setAssetNamingPrefix] = useState('');

  if (!isOpen || !capability) return null;

  const handleRun = () => {
    if (!selectedProjectId) return;

    onRun({
      capabilityId: capability.id,
      projectId: selectedProjectId,
      parameters,
      settings: {
        notifyOnComplete,
        saveAssets: true,
        assetNamingPrefix: assetNamingPrefix || capability.name
      }
    });
    onClose();
  };

  const handleParameterChange = (paramId: string, value: string | number | boolean) => {
    setParameters(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  const renderParameterInput = (param: CapabilityParameter) => {
    const value = parameters[param.id] || param.defaultValue || '';

    switch (param.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder={param.helpText}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
            min={param.validation?.min}
            max={param.validation?.max}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder={param.helpText}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select {param.label}</option>
            {param.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleParameterChange(param.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{param.helpText}</span>
          </label>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder={param.helpText}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Run Capability</h2>
            <p className="text-sm text-gray-600 mt-1">{capability.name}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Show DataDictionaryViewer for dataset capabilities */}
          {capability.type === 'dataset' && capability.id.startsWith('dataset-') ? (
            <DataDictionaryViewer 
              dictionaryId={capability.id} 
              title={capability.name}
            />
          ) : (
            <>
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Project *
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a project...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({getProjectAssetCount(project)} assets)
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  All generated assets will be saved to the selected project
                </p>
              </div>

          {/* Parameters */}
          {capability.parameters.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
              <div className="space-y-4">
                {capability.parameters.map((param) => (
                  <div key={param.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {param.label}
                      {param.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderParameterInput(param)}
                    {param.description && (
                      <p className="text-xs text-gray-500 mt-1">{param.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Asset Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Naming Prefix
                </label>
                <input
                  type="text"
                  value={assetNamingPrefix}
                  onChange={(e) => setAssetNamingPrefix(e.target.value)}
                  placeholder={capability.name}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Generated assets will be prefixed with this name
                </p>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyOnComplete}
                  onChange={(e) => setNotifyOnComplete(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Notify me when the capability completes</span>
              </label>
            </div>
          </div>

              {/* Estimated Output */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Expected Output</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Estimated runtime: {capability.estimatedRunTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    <span>Asset types: {capability.outputTypes.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Success rate: {Math.round(capability.successRate * 100)}%</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            {capability.type === 'dataset' ? 'Close' : 'Cancel'}
          </button>
          {capability.type !== 'dataset' && (
            <button
              onClick={handleRun}
              disabled={!selectedProjectId}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Run Capability
            </button>
          )}
        </div>
      </div>
    </div>
  );
};