import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  TestTube, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  Zap,
  Shield,
  Globe,
  Brain
} from 'lucide-react';
import { AIServicesManager } from '../lib/aiServicesManager';
import { InstantUser } from '../lib/instantAuth';

interface AIServicesConfigProps {
  currentUser: InstantUser;
  onConfigurationChange?: () => void;
}

interface ProviderConfig {
  name: string;
  baseUrl: string;
  models: string[];
  requiresAuth: boolean;
  icon: React.ReactNode;
  description: string;
  setupInstructions: string;
}

const AIServicesConfig: React.FC<AIServicesConfigProps> = ({
  currentUser: _currentUser,
  onConfigurationChange
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const aiManager = AIServicesManager.getInstance();

  const providerConfigs: Record<string, ProviderConfig> = {
    openai: {
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      requiresAuth: true,
      icon: <Brain className="w-5 h-5 text-green-600" />,
      description: 'Access GPT-4 and other OpenAI models for advanced AI analysis',
      setupInstructions: 'Get your API key from https://platform.openai.com/api-keys'
    },
    anthropic: {
      name: 'Anthropic',
      baseUrl: 'https://api.anthropic.com',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
      requiresAuth: true,
      icon: <Zap className="w-5 h-5 text-purple-600" />,
      description: 'Use Claude models for sophisticated reasoning and analysis',
      setupInstructions: 'Get your API key from https://console.anthropic.com/'
    },
    openrouter: {
      name: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      models: ['openai/gpt-4', 'anthropic/claude-3-5-sonnet', 'google/gemini-pro'],
      requiresAuth: true,
      icon: <Globe className="w-5 h-5 text-blue-600" />,
      description: 'Access multiple AI models through a single API endpoint',
      setupInstructions: 'Get your API key from https://openrouter.ai/keys'
    }
  };

  useEffect(() => {
    loadCurrentConfiguration();
  }, []);

  const loadCurrentConfiguration = () => {
    const config = aiManager.getConfig();
    if (config.provider) {
      setSelectedProvider(config.provider);
      setSelectedModel(config.model || '');
      // Don't load API key for security - user needs to re-enter
    }
  };

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    setSelectedModel(providerConfigs[provider].models[0]);
    setApiKey('');
    setTestResult(null);
    setError('');
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);
    setError('');

    try {
      // Save config temporarily for testing
      const testConfig = {
        provider: selectedProvider,
        apiKey: apiKey.trim(),
        model: selectedModel
      };
      
      // const originalConfig = aiManager.getConfig();
      aiManager.saveConfig(testConfig);

      // Test with a simple query
      const response = await aiManager.callAI([
        { role: 'user', content: 'Hello, please respond with "Connection successful" to test the API.' }
      ], { maxTokens: 20 });

      if (response.content.toLowerCase().includes('successful') || response.content.trim().length > 0) {
        setTestResult({ success: true, message: 'Connection successful!' });
      } else {
        setTestResult({ success: false, message: 'Unexpected response from API' });
      }

    } catch (err) {
      console.error('Connection test failed:', err);
      setTestResult({ 
        success: false, 
        message: err instanceof Error ? err.message : 'Connection test failed' 
      });
      
      // Restore original config on failure
      const originalConfig = aiManager.getConfig();
      if (originalConfig.provider !== selectedProvider) {
        aiManager.saveConfig(originalConfig);
      }
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    if (!selectedModel) {
      setError('Please select a model');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const config = {
        provider: selectedProvider,
        apiKey: apiKey.trim(),
        model: selectedModel
      };

      aiManager.saveConfig(config);
      
      // Test the configuration
      await handleTestConnection();
      
      if (onConfigurationChange) {
        onConfigurationChange();
      }

      setTestResult({ success: true, message: 'Configuration saved successfully!' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearConfiguration = () => {
    localStorage.removeItem('ai_services_config');
    setApiKey('');
    setSelectedModel(providerConfigs[selectedProvider].models[0]);
    setTestResult(null);
    setError('');
    
    if (onConfigurationChange) {
      onConfigurationChange();
    }
  };

  const currentConfig = aiManager.getConfig();
  const isConfigured = aiManager.isConfigured();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Services Configuration</h2>
              <p className="text-sm text-gray-600">Configure your AI API keys and preferences</p>
            </div>
          </div>
          
          {isConfigured && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-800 text-sm">
                Currently using {providerConfigs[currentConfig.provider!]?.name} with model {currentConfig.model}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Provider Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select AI Provider</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(providerConfigs).map(([key, provider]) => (
                <button
                  key={key}
                  onClick={() => handleProviderChange(key)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    selectedProvider === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {provider.icon}
                    <span className="font-medium text-gray-900">{provider.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Form */}
          <div className="space-y-6">
            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key *
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${providerConfigs[selectedProvider].name} API key...`}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {providerConfigs[selectedProvider].setupInstructions}
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {providerConfigs[selectedProvider].models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                This model will be used by default for AI features
              </p>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={`p-3 rounded-lg flex items-center gap-2 ${
                testResult.success 
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.message}
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection || !apiKey.trim()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingConnection ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4" />
                )}
                Test Connection
              </button>

              <button
                onClick={handleSaveConfiguration}
                disabled={isSaving || !apiKey.trim() || !selectedModel}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Configuration
              </button>

              {isConfigured && (
                <button
                  onClick={handleClearConfiguration}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Config
                </button>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Security Notice</span>
            </div>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• API keys are stored locally in your browser and never sent to our servers</p>
              <p>• Keys are used only to communicate directly with your chosen AI provider</p>
              <p>• You can clear your configuration at any time</p>
              <p>• Monitor your API usage through your provider's dashboard</p>
            </div>
          </div>

          {/* Usage Information */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">AI Features Using This Configuration</span>
            </div>
            <div className="text-sm text-blue-700 grid grid-cols-1 md:grid-cols-2 gap-2">
              <p>• AI Opportunity Gap Scanner</p>
              <p>• AI Patent Claim Generator 2.0</p>
              <p>• AI Prior Art Oracle</p>
              <p>• AI Innovation Trajectory Predictor</p>
              <p>• AI Dashboard Generation</p>
              <p>• AI Chat Assistant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIServicesConfig;