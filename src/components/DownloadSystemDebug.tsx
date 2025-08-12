import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Database, Play, RefreshCw, X, Minimize2, Maximize2 } from 'lucide-react';
import { MigrationRunner, debugDatabase } from '../lib/migrationRunner';
import { CapabilityDownloadService } from '../lib/capabilityDownloadService';
import { InstantAuthService } from '../lib/instantAuth';

interface DebugResult {
  type: 'success' | 'error' | 'info';
  message: string;
  details?: any;
}

export const DownloadSystemDebug: React.FC = () => {
  const [results, setResults] = useState<DebugResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Start hidden by default
  const [isMinimized, setIsMinimized] = useState(false);

  // Add keyboard shortcut to toggle visibility (Ctrl+Shift+D)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const addResult = (result: DebugResult) => {
    setResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const runHealthCheck = async () => {
    setIsLoading(true);
    addResult({ type: 'info', message: 'Starting system health check...' });

    try {
      // Check current user
      const currentUser = InstantAuthService.getCurrentUser();
      if (currentUser) {
        addResult({ 
          type: 'success', 
          message: 'User authenticated', 
          details: { 
            id: currentUser.id, 
            email: currentUser.email, 
            isDemo: currentUser.isDemo 
          }
        });
      } else {
        addResult({ type: 'error', message: 'No authenticated user found' });
      }

      // Check database connection
      const connectionTest = await debugDatabase.testConnection();
      addResult({ 
        type: connectionTest.success ? 'success' : 'error', 
        message: connectionTest.message 
      });

      // Check system health
      const healthCheck = await MigrationRunner.checkSystemHealth();
      addResult({ 
        type: healthCheck.success ? 'success' : 'error', 
        message: healthCheck.message,
        details: {
          tableExists: healthCheck.tableExists,
          canQuery: healthCheck.canQuery,
          canInsert: healthCheck.canInsert
        }
      });

    } catch (error) {
      addResult({ 
        type: 'error', 
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runMigration = async () => {
    setIsLoading(true);
    addResult({ type: 'info', message: 'Running migration...' });

    try {
      const result = await MigrationRunner.runCapabilityDownloadsMigration();
      addResult({ 
        type: result.success ? 'success' : 'error', 
        message: result.message 
      });
    } catch (error) {
      addResult({ 
        type: 'error', 
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDownload = async () => {
    setIsLoading(true);
    addResult({ type: 'info', message: 'Testing capability download...' });

    try {
      const testCapability = {
        id: 'test-capability-' + Date.now(),
        name: 'Test Download Capability',
        type: 'tool',
        category: 'analysis'
      };

      const result = await CapabilityDownloadService.downloadCapability(
        testCapability.id,
        testCapability.name,
        testCapability.type,
        testCapability.category
      );

      addResult({ 
        type: result.success ? 'success' : 'error', 
        message: result.message,
        details: result.data
      });

      // If successful, test removal
      if (result.success) {
        addResult({ type: 'info', message: 'Testing capability removal...' });
        const removeResult = await CapabilityDownloadService.removeDownload(testCapability.id);
        addResult({ 
          type: removeResult.success ? 'success' : 'error', 
          message: `Removal: ${removeResult.message}` 
        });
      }

    } catch (error) {
      addResult({ 
        type: 'error', 
        message: `Download test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const listUserDownloads = async () => {
    setIsLoading(true);
    addResult({ type: 'info', message: 'Loading user downloads...' });

    try {
      const downloads = await CapabilityDownloadService.getUserDownloads();
      addResult({ 
        type: 'success', 
        message: `Found ${downloads.length} downloads`,
        details: downloads
      });

      const downloadsByCategory = await CapabilityDownloadService.getUserDownloadsByCategory();
      addResult({ 
        type: 'success', 
        message: `Downloads grouped by ${downloadsByCategory.length} categories`,
        details: downloadsByCategory
      });

    } catch (error) {
      addResult({ 
        type: 'error', 
        message: `Failed to load downloads: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if not visible
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 z-50 group"
        title="Open Debug Panel"
      >
        <Database className="w-5 h-5" />
        <span className="absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Debug Panel
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border-2 border-gray-300 z-50 transition-all duration-300 ${
      isMinimized ? 'max-h-14' : 'max-h-96'
    }`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Download System Debug
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4 text-gray-600" /> : <Minimize2 className="w-4 h-4 text-gray-600" />}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={runHealthCheck}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            Health Check
          </button>
          
          <button
            onClick={runMigration}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
          >
            <Database className="w-3 h-3" />
            Run Migration
          </button>
          
          <button
            onClick={testDownload}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
          >
            <Play className="w-3 h-3" />
            Test Download
          </button>
          
          <button
            onClick={listUserDownloads}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            List Downloads
          </button>
          
          <button
            onClick={clearResults}
            className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}

        <div className="max-h-48 overflow-y-auto space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-2 rounded text-xs ${
                result.type === 'success' 
                  ? 'bg-green-100 text-green-800 border-l-2 border-green-500'
                  : result.type === 'error'
                  ? 'bg-red-100 text-red-800 border-l-2 border-red-500'
                  : 'bg-blue-100 text-blue-800 border-l-2 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-2">
                {result.type === 'success' && <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                {result.type === 'error' && <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                <div className="flex-1">
                  <div>{result.message}</div>
                  {result.details && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs opacity-75">Details</summary>
                      <pre className="mt-1 text-xs overflow-x-auto bg-black bg-opacity-10 p-1 rounded">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && !isLoading && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Click a button above to run diagnostics
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default DownloadSystemDebug;