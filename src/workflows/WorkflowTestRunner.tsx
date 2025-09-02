// Workflow Test Runner - Execute and debug workflows
// Provides testing capabilities with step-by-step execution and debugging

import { useState } from 'react';
import {
  Play,
  Square,
  SkipForward,
  RefreshCw,
  Bug,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  ArrowRight,
  Settings
} from 'lucide-react';
import { WorkflowDefinition, WorkflowExecution } from '../types/automation';
import { automationEngine } from '../lib/automationEngine';

interface WorkflowTestRunnerProps {
  workflow: WorkflowDefinition;
  onClose: () => void;
}

interface TestConfiguration {
  inputData: Record<string, any>;
  debugMode: boolean;
  stepByStep: boolean;
  timeout: number;
}

export default function WorkflowTestRunner({ workflow, onClose }: WorkflowTestRunnerProps) {
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [testConfig, setTestConfig] = useState<TestConfiguration>({
    inputData: {},
    debugMode: true,
    stepByStep: false,
    timeout: 300
  });
  const [showConfig, setShowConfig] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Start workflow test
  const startTest = async () => {
    try {
      setIsRunning(true);
      setExecution(null);
      setCurrentStep(0);
      setLogs(['Starting workflow test...']);

      const newExecution = await automationEngine.executeWorkflow(
        workflow.id,
        testConfig.inputData,
        'test'
      );

      setExecution(newExecution);
      addLog(`Test execution started: ${newExecution.id}`);

      // Monitor execution progress
      monitorExecution(newExecution.id);
    } catch (error) {
      addLog(`Error starting test: ${error instanceof Error ? error.message : String(error)}`);
      setIsRunning(false);
    }
  };

  // Stop workflow test
  const stopTest = async () => {
    if (execution) {
      try {
        await automationEngine.cancelExecution(execution.id);
        addLog('Test execution cancelled');
      } catch (error) {
        addLog(`Error stopping test: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    setIsRunning(false);
  };

  // Monitor execution progress
  const monitorExecution = async (executionId: string) => {
    const checkInterval = setInterval(async () => {
      try {
        const currentExecution = await automationEngine.getExecution(executionId);
        if (currentExecution) {
          setExecution(currentExecution);

          if (currentExecution.status === 'completed') {
            setIsRunning(false);
            addLog('Test execution completed successfully');
            clearInterval(checkInterval);
          } else if (currentExecution.status === 'failed') {
            setIsRunning(false);
            addLog(`Test execution failed: ${currentExecution.error_message}`);
            clearInterval(checkInterval);
          } else if (currentExecution.status === 'cancelled') {
            setIsRunning(false);
            addLog('Test execution was cancelled');
            clearInterval(checkInterval);
          }

          // Update current step
          // const _runningNodes = currentExecution.node_executions.filter(n => n.status === 'running').length;
          const completedNodes = currentExecution.node_executions.filter(n => n.status === 'completed').length;
          setCurrentStep(completedNodes);
        }
      } catch (error) {
        addLog(`Error monitoring execution: ${error instanceof Error ? error.message : String(error)}`);
        clearInterval(checkInterval);
        setIsRunning(false);
      }
    }, 1000);

    // Auto cleanup after timeout
    setTimeout(() => {
      if (isRunning) {
        clearInterval(checkInterval);
        stopTest();
        addLog('Test execution timed out');
      }
    }, testConfig.timeout * 1000);
  };

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Reset test
  const resetTest = () => {
    setExecution(null);
    setIsRunning(false);
    setCurrentStep(0);
    setLogs([]);
  };

  // Get node status icon
  const getNodeStatusIcon = (nodeId: string) => {
    if (!execution) return <Clock className="text-gray-400" size={16} />;

    const nodeExecution = execution.node_executions.find(n => n.node_id === nodeId);
    if (!nodeExecution) {
      return <Clock className="text-gray-400" size={16} />;
    }

    switch (nodeExecution.status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'failed':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'running':
        return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
      case 'skipped':
        return <SkipForward className="text-gray-500" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  // Get execution status color
  const getExecutionStatusColor = () => {
    if (!execution) return 'text-gray-500';
    
    switch (execution.status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'running':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <Bug className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-bold">Workflow Test Runner</h2>
              <p className="text-gray-600">{workflow.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Test Configuration"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Configuration Panel */}
        {showConfig && (
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Test Configuration</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Data (JSON)
                </label>
                <textarea
                  value={JSON.stringify(testConfig.inputData, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setTestConfig(prev => ({ ...prev, inputData: parsed }));
                    } catch {
                      // Invalid JSON, don't update
                    }
                  }}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder='{"key": "value"}'
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={testConfig.timeout}
                    onChange={(e) => setTestConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                    min="30"
                    max="3600"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={testConfig.debugMode}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, debugMode: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-700">Debug Mode</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={testConfig.stepByStep}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, stepByStep: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-700">Step-by-Step Execution</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Control Bar */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
            {!isRunning ? (
              <button
                onClick={startTest}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Play size={16} />
                <span>Start Test</span>
              </button>
            ) : (
              <button
                onClick={stopTest}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Square size={16} />
                <span>Stop Test</span>
              </button>
            )}

            <button
              onClick={resetTest}
              disabled={isRunning}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              <span>Reset</span>
            </button>
          </div>

          {execution && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${getExecutionStatusColor()}`}>
                  {execution.status.toUpperCase()}
                </span>
              </div>
              
              {execution.duration && (
                <div className="flex items-center space-x-2">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-gray-600">{execution.duration}ms</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{currentStep}/{workflow.nodes.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Workflow Visualization */}
          <div className="flex-1 p-6 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Execution Flow</h3>
            
            {workflow.nodes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bug className="mx-auto mb-4 opacity-50" size={48} />
                <p>No nodes to test</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workflow.nodes.map((node, index) => {
                  const nodeExecution = execution?.node_executions.find(n => n.node_id === node.id);
                  
                  return (
                    <div key={node.id} className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        {getNodeStatusIcon(node.id)}
                      </div>

                      <div className="flex-1 p-4 border rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{node.name}</h4>
                          <div className="text-sm text-gray-500 capitalize">{node.type}</div>
                        </div>

                        {nodeExecution && (
                          <div className="space-y-2 text-sm">
                            {nodeExecution.started_at && (
                              <div className="flex items-center space-x-2 text-gray-600">
                                <span>Started:</span>
                                <span>{new Date(nodeExecution.started_at).toLocaleTimeString()}</span>
                              </div>
                            )}

                            {nodeExecution.completed_at && nodeExecution.duration && (
                              <div className="flex items-center space-x-2 text-gray-600">
                                <span>Duration:</span>
                                <span>{nodeExecution.duration}ms</span>
                              </div>
                            )}

                            {nodeExecution.error_message && (
                              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700">
                                <strong>Error:</strong> {nodeExecution.error_message}
                              </div>
                            )}

                            {testConfig.debugMode && nodeExecution.output_data && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                  Output Data
                                </summary>
                                <pre className="mt-2 p-2 bg-gray-100 border rounded text-xs overflow-auto">
                                  {JSON.stringify(nodeExecution.output_data, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        )}
                      </div>

                      {index < workflow.nodes.length - 1 && (
                        <ArrowRight className="text-gray-400" size={16} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Execution Log */}
          <div className="w-96 border-l bg-gray-50 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Execution Log</h3>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No logs yet</p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm text-gray-700 font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {execution && execution.status !== 'running' && (
          <div className="p-6 border-t bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Test Results</h3>
            
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-gray-900">
                  {execution.node_executions.filter(n => n.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-red-600">
                  {execution.node_executions.filter(n => n.status === 'failed').length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">
                  {execution.node_executions.filter(n => n.status === 'skipped').length}
                </div>
                <div className="text-sm text-gray-600">Skipped</div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {execution.duration || 0}ms
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            </div>

            {execution.output_data && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Final Output</h4>
                <pre className="p-4 bg-white border rounded text-sm overflow-auto max-h-40">
                  {JSON.stringify(execution.output_data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}