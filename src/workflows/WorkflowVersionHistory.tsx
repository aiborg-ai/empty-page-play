// Workflow Version History - Track and manage workflow versions
// Provides version control functionality for workflows

import { useState, useEffect } from 'react';
import {
  History,
  GitBranch,
  Calendar,
  User,
  RotateCcw,
  Copy,
  X,
  ChevronRight,
  FileText,
  Clock
} from 'lucide-react';

interface WorkflowVersion {
  id: string;
  workflow_id: string;
  version: number;
  name: string;
  description: string;
  changes_summary: string;
  created_by: string;
  created_at: string;
  is_current: boolean;
  data: any; // Workflow definition at this version
  tags: string[];
}

interface WorkflowVersionHistoryProps {
  workflowId: string;
  onClose: () => void;
  onRestoreVersion: (version: WorkflowVersion) => void;
}

export default function WorkflowVersionHistory({
  workflowId,
  onClose,
  onRestoreVersion
}: WorkflowVersionHistoryProps) {
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<WorkflowVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<[WorkflowVersion | null, WorkflowVersion | null]>([null, null]);
  const [error, setError] = useState<string | null>(null);

  // Load version history
  useEffect(() => {
    loadVersionHistory();
  }, [workflowId]);

  const loadVersionHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock version history data - in real implementation, this would come from API
      const mockVersions: WorkflowVersion[] = [
        {
          id: 'v1',
          workflow_id: workflowId,
          version: 3,
          name: 'Added email notifications',
          description: 'Enhanced workflow with email notification steps',
          changes_summary: 'Added 2 new email action nodes, updated condition logic',
          created_by: 'john.doe@example.com',
          created_at: new Date().toISOString(),
          is_current: true,
          data: {},
          tags: ['current', 'production']
        },
        {
          id: 'v2',
          workflow_id: workflowId,
          version: 2,
          name: 'Fixed timing issues',
          description: 'Resolved delay node configuration problems',
          changes_summary: 'Updated delay intervals, fixed condition expressions',
          created_by: 'jane.smith@example.com',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          is_current: false,
          data: {},
          tags: ['stable']
        },
        {
          id: 'v3',
          workflow_id: workflowId,
          version: 1,
          name: 'Initial version',
          description: 'First working version of the workflow',
          changes_summary: 'Created basic workflow structure with trigger and action nodes',
          created_by: 'admin@example.com',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          is_current: false,
          data: {},
          tags: ['initial']
        }
      ];

      setVersions(mockVersions);
      
      // Select current version by default
      const currentVersion = mockVersions.find(v => v.is_current);
      if (currentVersion) {
        setSelectedVersion(currentVersion);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load version history');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date)
    };
  };

  // Get relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  // Handle version selection
  const handleVersionSelect = (version: WorkflowVersion) => {
    if (compareMode) {
      if (!compareVersions[0]) {
        setCompareVersions([version, null]);
      } else if (!compareVersions[1] && compareVersions[0].id !== version.id) {
        setCompareVersions([compareVersions[0], version]);
      } else {
        setCompareVersions([version, null]);
      }
    } else {
      setSelectedVersion(version);
    }
  };

  // Toggle compare mode
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setCompareVersions([null, null]);
  };

  // Restore version
  const handleRestoreVersion = (version: WorkflowVersion) => {
    if (confirm(`Restore to version ${version.version} (${version.name})? This will create a new version.`)) {
      onRestoreVersion(version);
    }
  };

  // Create new version from current
  const handleCreateVersion = () => {
    // This would typically open a dialog to create a new version
    console.log('Create new version');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading version history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-red-600 mb-4">Error loading version history</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <History className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-bold">Version History</h2>
              <p className="text-gray-600">Track and manage workflow versions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCompareMode}
              className={`px-3 py-2 rounded ${
                compareMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              } hover:bg-blue-700 hover:text-white`}
            >
              Compare
            </button>
            <button
              onClick={handleCreateVersion}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              New Version
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Version List */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold">Versions ({versions.length})</h3>
              {compareMode && (
                <p className="text-sm text-gray-600 mt-1">
                  Select two versions to compare
                </p>
              )}
            </div>

            <div className="divide-y">
              {versions.map((version) => {
                const formatted = formatDate(version.created_at);
                const isSelected = selectedVersion?.id === version.id;
                const isCompareSelected = compareVersions[0]?.id === version.id || compareVersions[1]?.id === version.id;
                
                return (
                  <div
                    key={version.id}
                    onClick={() => handleVersionSelect(version)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      isSelected && !compareMode ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    } ${
                      isCompareSelected ? 'bg-yellow-50 border-r-4 border-yellow-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">v{version.version}</span>
                          {version.is_current && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Current
                            </span>
                          )}
                          {version.tags.includes('stable') && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              Stable
                            </span>
                          )}
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-1">
                          {version.name}
                        </h4>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {version.changes_summary}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User size={12} />
                            <span>{version.created_by.split('@')[0]}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{formatted.relative}</span>
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight size={16} className="text-gray-400 mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Version Details */}
          <div className="flex-1 overflow-y-auto">
            {compareMode && compareVersions[0] && compareVersions[1] ? (
              // Compare View
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Version Comparison</h3>
                <div className="grid grid-cols-2 gap-6">
                  {compareVersions.map((version, _index) => (
                    <div key={version?.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="font-medium">v{version?.version}</span>
                        <span className="text-gray-600">{version?.name}</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <User size={14} />
                          <span>{version?.created_by}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} />
                          <span>{version ? formatDate(version.created_at).date : ''}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Changes</h4>
                        <p className="text-sm text-gray-600">{version?.changes_summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-4">Differences</h4>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-600">
                      Detailed comparison functionality would be implemented here,
                      showing node-by-node differences between versions.
                    </p>
                  </div>
                </div>
              </div>
            ) : selectedVersion ? (
              // Single Version View
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold">Version {selectedVersion.version}</h3>
                      {selectedVersion.is_current && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg text-gray-900 mb-1">{selectedVersion.name}</h4>
                    <p className="text-gray-600">{selectedVersion.description}</p>
                  </div>

                  <div className="flex space-x-2">
                    {!selectedVersion.is_current && (
                      <button
                        onClick={() => handleRestoreVersion(selectedVersion)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <RotateCcw size={16} />
                        <span>Restore</span>
                      </button>
                    )}
                    <button
                      onClick={() => console.log('Export version')}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      <Copy size={16} />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* Version Metadata */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Details</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <User size={14} className="text-gray-500" />
                          <span className="text-gray-600">Created by:</span>
                          <span className="font-medium">{selectedVersion.created_by}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-500" />
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">
                            {formatDate(selectedVersion.created_at).date} at{' '}
                            {formatDate(selectedVersion.created_at).time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <GitBranch size={14} className="text-gray-500" />
                          <span className="text-gray-600">Version:</span>
                          <span className="font-medium">v{selectedVersion.version}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Tags</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedVersion.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Summary of Changes</h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedVersion.changes_summary}</p>
                    </div>
                  </div>
                </div>

                {/* Version Preview */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-4">Workflow Structure</h5>
                  <div className="bg-gray-50 border rounded-lg p-6">
                    <div className="text-center text-gray-500">
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Workflow visualization would be rendered here</p>
                      <p className="text-sm mt-2">
                        This would show a read-only view of the workflow as it existed in this version
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // No Selection
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <History size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select a version to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}