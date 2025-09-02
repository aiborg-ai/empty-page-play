/**
 * Database Test Panel Component
 * 
 * Provides a UI for testing database connectivity and operations
 * from within the InnoSpot application.
 */

import { useState } from 'react';
import { 
  Database, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader
} from 'lucide-react';
import { DatabaseTester } from '../lib/testDatabase';

interface TestResult {
  success: boolean;
  message: string;
  error?: Error;
  details?: any;
}

export default function DatabaseTestPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{
    overall: boolean;
    results: TestResult[];
  } | null>(null);

  /**
   * Run all database tests
   */
  const runTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await DatabaseTester.runAll();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        overall: false,
        results: [{
          success: false,
          message: 'Test execution failed',
          error: error as Error
        }]
      });
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Get status icon
   */
  const getStatusIcon = (success?: boolean) => {
    if (success === undefined) return <AlertCircle className="w-4 h-4 text-gray-400" />;
    return success 
      ? <CheckCircle className="w-4 h-4 text-green-600" />
      : <XCircle className="w-4 h-4 text-red-600" />;
  };

  /**
   * Get status color class
   */
  const getStatusColor = (success?: boolean) => {
    if (success === undefined) return 'text-gray-600';
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Database Test Suite</h2>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Running Tests...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Run Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Test Status Overview */}
      {testResults && (
        <div className={`p-4 rounded-lg mb-6 ${
          testResults.overall 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {getStatusIcon(testResults.overall)}
            <span className={`font-medium ${getStatusColor(testResults.overall)}`}>
              {testResults.overall ? 'All Tests Passed' : 'Some Tests Failed'}
            </span>
          </div>
        </div>
      )}

      {/* Individual Test Results */}
      <div className="space-y-4">
        {/* Connection Test */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Database Connection</h3>
            {getStatusIcon(testResults?.results[0]?.success)}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Tests basic connectivity to PostgreSQL database
          </p>
          {testResults?.results[0] && (
            <div className={`text-sm ${getStatusColor(testResults.results[0].success)}`}>
              {testResults.results[0].message}
              {testResults.results[0].details && (
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(testResults.results[0].details, null, 2)}
                </pre>
              )}
              {testResults.results[0].error && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  {testResults.results[0].error.message}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Operations Test */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Database Operations</h3>
            {getStatusIcon(testResults?.results[1]?.success)}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Tests table structure and basic queries
          </p>
          {testResults?.results[1] && (
            <div className={`text-sm ${getStatusColor(testResults.results[1].success)}`}>
              {testResults.results[1].message}
              {testResults.results[1].details && (
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(testResults.results[1].details, null, 2)}
                </pre>
              )}
              {testResults.results[1].error && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  {testResults.results[1].error.message}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CRUD Test */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">CRUD Operations</h3>
            {getStatusIcon(testResults?.results[2]?.success)}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Tests create, read, update, delete operations
          </p>
          {testResults?.results[2] && (
            <div className={`text-sm ${getStatusColor(testResults.results[2].success)}`}>
              {testResults.results[2].message}
              {testResults.results[2].details && (
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(testResults.results[2].details, null, 2)}
                </pre>
              )}
              {testResults.results[2].error && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  {testResults.results[2].error.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>1. Install PostgreSQL: <code>sudo apt install postgresql postgresql-contrib</code></p>
          <p>2. Run setup script: <code>npm run db:setup</code></p>
          <p>3. Initialize database: <code>npm run db:migrate</code></p>
          <p>4. Load sample data: <code>npm run db:seed</code></p>
        </div>
      </div>
    </div>
  );
}