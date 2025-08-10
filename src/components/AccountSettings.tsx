import { useState } from 'react';
import { 
  Home, 
  User, 
  Shield, 
  AlertCircle,
  Download,
  Trash2,
  RefreshCw,
  Key,
  Bot,
  Eye,
  EyeOff,
  CreditCard,
  Zap,
  CheckCircle
} from 'lucide-react';
import { PaymentDetails } from '../types/subscription';
import SecuritySettings from './SecuritySettings';

interface AccountSettingsProps {
  user?: any;
}

export default function AccountSettings({ user: _user }: AccountSettingsProps) {
  const [selectedTab, setSelectedTab] = useState('Account Settings');
  const [makeProfilePublic, setMakeProfilePublic] = useState(false);
  const [recordSearchHistory, setRecordSearchHistory] = useState(false);
  const [selectedUseType, setSelectedUseType] = useState<string>('non-commercial');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [agentSettings, setAgentSettings] = useState({
    autoAnalysis: true,
    smartSuggestions: true,
    contextualHelp: false,
    batchProcessing: false
  });

  const tabs = [
    { id: 'Account Settings', label: 'Account Settings' },
    { id: 'AI Settings', label: 'AI Settings' },
    { id: 'Agents', label: 'Agents' },
    { id: 'Payment Details', label: 'Payment Details' },
    { id: 'Security', label: 'Security' },
    { id: 'Privacy', label: 'Privacy' },
    { id: 'Subscriptions', label: 'Subscriptions' }
  ];


  const MainContent = () => (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Home className="w-4 h-4" />
          <span>Account</span>
          <span>Privacy</span>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {selectedTab === 'Account Settings' && (
          <div className="space-y-8">
            {/* Commercial Use Type Selection */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Are you using innospot for Commercial Purposes?</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Individual users who use the platform in their work for a for-profit entity must have a commercial use subscription. This includes staff, consultants, contractors or employees of any business, law firm, start-up or similar organization using innospot, which ensures compliance with the innospot Terms of Use and helps to sustain innospot, with funds going towards supporting equitable access and open innovation knowledge for everyone.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="font-medium text-gray-900">
                      Please confirm which category your use of innospot falls into:
                    </h4>

                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="useType"
                          value="non-commercial"
                          checked={selectedUseType === 'non-commercial'}
                          onChange={(e) => setSelectedUseType(e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">Non-commercial use</span>
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            For students or staff affiliated with a public, good, non-profit institution or using innospot for non-commercial purposes.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="useType"
                          value="commercial"
                          checked={selectedUseType === 'commercial'}
                          onChange={(e) => setSelectedUseType(e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">Commercial use</span>
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            For professionals using, or planning to use, innospot platform (as an account holder) or metadata for commercial purposes.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                        Select
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* innospot for Commercial Use */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">innospot for Commercial Use</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Good news! Many users have asked for an easy and affordable way to license their use of innospot.org for commercial purposes. So we've created a low-cost subscription permitting individual commercial use for professional work or business.
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                      Subscribe
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
                      Read More
                    </button>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Linked Services */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Linked Services</h3>
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Link your accounts from third party services to your innospot profile. We currently support LinkedIn and ORCID accounts.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded"></div>
                    <span className="font-medium text-gray-900">LinkedIn</span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                    Link
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">O</span>
                    </div>
                    <span className="font-medium text-gray-900">ORCID</span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                    Link
                  </button>
                </div>
              </div>
            </div>

            {/* Interface Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interface Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Theme / Color
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={selectedTheme === 'light'}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                      />
                      <span className="text-sm text-gray-700">Light Theme (Default)</span>
                    </label>
                    <div className="w-full h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded mb-2"></div>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={selectedTheme === 'dark'}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                      />
                      <span className="text-sm text-gray-700">Dark Mode (For working at night)</span>
                    </label>
                    <div className="w-full h-3 bg-gradient-to-r from-gray-800 to-gray-600 rounded mb-2"></div>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="theme"
                        value="vanilla"
                        checked={selectedTheme === 'vanilla'}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                      />
                      <span className="text-sm text-gray-700">Vanilla (Clean Skin)</span>
                    </label>
                    <div className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-400 rounded mb-2"></div>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="theme"
                        value="contrast"
                        checked={selectedTheme === 'contrast'}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                      />
                      <span className="text-sm text-gray-700">High Contrast (WCAG) (For accessibility)</span>
                    </label>
                    <div className="w-full h-3 bg-gradient-to-r from-black to-gray-900 rounded"></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Opt in to Beta Features</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    We keep trying new ways to improve your experience, with UI features and changes. If you're interested in seeing these before others,{' '}
                    <a href="#" className="text-blue-600 underline">click here and opt in</a>. Current Beta Features available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'AI Settings' && (
          <div className="space-y-8">
            {/* AI Assistant Configuration */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">AI Assistant</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Configure your AI Assistant settings to chat with the platform and analyze patent data. The AI Assistant uses OpenRouter to provide access to multiple AI models including GPT-4, Claude, and others.
                  </p>
                </div>
              </div>
            </div>

            {/* OpenRouter API Key */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  OpenRouter API Key
                </h3>
                <a 
                  href="https://openrouter.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Get API Key →
                </a>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Your OpenRouter API key is used to access AI models for the chat assistant. This key is stored securely in your browser and is never sent to our servers except when making API requests to OpenRouter.
              </p>

              <div className="relative">
                <div className="flex">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={openRouterApiKey}
                      onChange={(e) => setOpenRouterApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem('openrouter_api_key', openRouterApiKey);
                      alert('API key saved successfully!');
                    }}
                    className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 border border-l-0 border-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Security Notice</p>
                    <p>Your API key is stored locally in your browser and used only for AI chat requests. Never share your API key with others or use it in unsecured environments.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Usage Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Usage Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Default AI Model</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Choose your preferred AI model for new chat sessions. You can change this per conversation in the chat interface.
                  </p>
                  <select 
                    className="w-full max-w-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="openai/gpt-3.5-turbo"
                  >
                    <option value="openai/gpt-4-turbo">GPT-4 Turbo (Recommended)</option>
                    <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Affordable)</option>
                    <option value="anthropic/claude-3-opus">Claude 3 Opus (Best Quality)</option>
                    <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
                    <option value="anthropic/claude-3-haiku">Claude 3 Haiku (Fast)</option>
                    <option value="google/gemini-pro">Gemini Pro</option>
                    <option value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B (Open Source)</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Default Context Scope</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Set the default data context for AI conversations. This determines what information the AI has access to when answering questions.
                  </p>
                  <select 
                    className="w-full max-w-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="search-results"
                  >
                    <option value="search-results">Search Results</option>
                    <option value="collections">Collections</option>
                    <option value="reports">Reports</option>
                    <option value="patent-corpus">Complete Patent Corpus</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                    />
                    <span className="font-medium text-gray-900">Save chat history</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Keep your AI conversations saved locally for future reference. Chat history is stored in your browser and never sent to our servers.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                    />
                    <span className="font-medium text-gray-900">Auto-clear sensitive data</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Automatically clear API keys and sensitive information from chat history after 24 hours for enhanced security.
                  </p>
                </div>
              </div>
            </div>

            {/* OpenRouter Account Info */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">OpenRouter Information</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">What is OpenRouter?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    OpenRouter is a unified API that provides access to multiple AI models from different providers including OpenAI, Anthropic, Google, and others. It offers:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Single API key for multiple AI models</li>
                    <li>• Competitive pricing with pay-per-use</li>
                    <li>• Model comparison and switching</li>
                    <li>• Usage tracking and analytics</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-2">Getting Started</h4>
                  <ol className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>1. Create a free account at <a href="https://openrouter.ai" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">openrouter.ai</a></li>
                    <li>2. Add credits to your account (usually $5-10 provides extensive usage)</li>
                    <li>3. Generate an API key in your account dashboard</li>
                    <li>4. Enter the API key above to start using AI chat</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'Agents' && (
          <div className="space-y-8">
            {/* Agents Configuration */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">AI Agents Configuration</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Configure AI agents to automate patent analysis, competitive intelligence, and research workflows. Agents use your OpenRouter API key to perform autonomous tasks and provide intelligent insights.
                  </p>
                </div>
              </div>
            </div>

            {/* OpenRouter API Key for Agents */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  OpenRouter API Key for Agents
                </h3>
                <a 
                  href="https://openrouter.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Get API Key →
                </a>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                This API key will be used by AI agents for automated workflows. Make sure you have sufficient credits in your OpenRouter account for agent operations.
              </p>

              <div className="relative">
                <div className="flex">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={openRouterApiKey}
                      onChange={(e) => setOpenRouterApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem('agents_api_key', openRouterApiKey);
                      alert('API key saved for agents successfully!');
                    }}
                    className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 border border-l-0 border-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Capabilities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Capabilities</h3>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={agentSettings.autoAnalysis}
                      onChange={(e) => setAgentSettings({...agentSettings, autoAnalysis: e.target.checked})}
                    />
                    <span className="font-medium text-gray-900">Auto Patent Analysis</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Automatically analyze new patents in your collections for key insights, trends, and competitive intelligence.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={agentSettings.smartSuggestions}
                      onChange={(e) => setAgentSettings({...agentSettings, smartSuggestions: e.target.checked})}
                    />
                    <span className="font-medium text-gray-900">Smart Research Suggestions</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Get AI-powered suggestions for related patents, inventors, and research areas based on your current work.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={agentSettings.contextualHelp}
                      onChange={(e) => setAgentSettings({...agentSettings, contextualHelp: e.target.checked})}
                    />
                    <span className="font-medium text-gray-900">Contextual Help System</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Enable AI agents to provide contextual help and guidance based on your current activity and data.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={agentSettings.batchProcessing}
                      onChange={(e) => setAgentSettings({...agentSettings, batchProcessing: e.target.checked})}
                    />
                    <span className="font-medium text-gray-900">Batch Processing</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Allow agents to process large datasets and generate comprehensive reports automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Agent Models Configuration */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Model Preferences</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Primary Analysis Model</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Choose the AI model for complex analysis tasks. Higher-tier models provide better insights but cost more.
                  </p>
                  <select 
                    className="w-full max-w-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="anthropic/claude-3-sonnet"
                  >
                    <option value="anthropic/claude-3-opus">Claude 3 Opus (Best Quality)</option>
                    <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Recommended)</option>
                    <option value="openai/gpt-4-turbo">GPT-4 Turbo (Fast & Reliable)</option>
                    <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo (Budget Friendly)</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Batch Processing Model</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Model for processing large amounts of data efficiently.
                  </p>
                  <select 
                    className="w-full max-w-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="openai/gpt-3.5-turbo"
                  >
                    <option value="anthropic/claude-3-haiku">Claude 3 Haiku (Fast & Efficient)</option>
                    <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo (Balanced)</option>
                    <option value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B (Open Source)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Usage Limits & Cost Control
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Daily Spending Limit (USD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    defaultValue="10"
                    className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Agents will stop processing when this limit is reached.
                  </p>
                </div>
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                    />
                    <span className="font-medium text-gray-900">Email notifications for high usage</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Get notified when agents approach 80% of your daily limit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'Payment Details' && (
          <div className="space-y-8">
            {/* Payment Configuration */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Save your payment information for quick and secure checkout when purchasing subscriptions, agents, or other services.
                  </p>
                </div>
              </div>
            </div>

            {/* Saved Payment Methods */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Saved Payment Methods</h3>
                <button
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {showPaymentForm ? 'Cancel' : 'Add Payment Method'}
                </button>
              </div>

              {/* Existing payment methods (placeholder) */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">•••• •••• •••• 4242</div>
                      <div className="text-sm text-gray-600">Expires 12/25 • Visa</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Default
                    </span>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add Payment Form */}
              {showPaymentForm && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Payment Method</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={paymentDetails.cardNumber}
                        onChange={(e) => {
                          const formatted = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                          setPaymentDetails(prev => ({...prev, cardNumber: formatted}));
                        }}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={paymentDetails.expiryDate}
                        onChange={(e) => setPaymentDetails(prev => ({...prev, expiryDate: e.target.value}))}
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails(prev => ({...prev, cvv: e.target.value}))}
                        placeholder="123"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.cardholderName}
                        onChange={(e) => setPaymentDetails(prev => ({...prev, cardholderName: e.target.value}))}
                        placeholder="John Doe"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-4">Billing Address</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={paymentDetails.billingAddress.street}
                          onChange={(e) => setPaymentDetails(prev => ({
                            ...prev,
                            billingAddress: {...prev.billingAddress, street: e.target.value}
                          }))}
                          placeholder="Street Address"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={paymentDetails.billingAddress.city}
                          onChange={(e) => setPaymentDetails(prev => ({
                            ...prev,
                            billingAddress: {...prev.billingAddress, city: e.target.value}
                          }))}
                          placeholder="City"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={paymentDetails.billingAddress.state}
                          onChange={(e) => setPaymentDetails(prev => ({
                            ...prev,
                            billingAddress: {...prev.billingAddress, state: e.target.value}
                          }))}
                          placeholder="State"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={paymentDetails.billingAddress.zipCode}
                          onChange={(e) => setPaymentDetails(prev => ({
                            ...prev,
                            billingAddress: {...prev.billingAddress, zipCode: e.target.value}
                          }))}
                          placeholder="ZIP Code"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <select
                          value={paymentDetails.billingAddress.country}
                          onChange={(e) => setPaymentDetails(prev => ({
                            ...prev,
                            billingAddress: {...prev.billingAddress, country: e.target.value}
                          }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        // Here you would typically save to backend/Stripe
                        alert('Payment method saved successfully!');
                        setShowPaymentForm(false);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Save Payment Method
                    </button>
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Billing Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                    />
                    <span className="font-medium text-gray-900">Auto-renew subscriptions</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Automatically renew subscriptions using your default payment method.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                    />
                    <span className="font-medium text-gray-900">Email receipts</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Send email receipts for all purchases and subscription renewals.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                    />
                    <span className="font-medium text-gray-900">Usage-based billing alerts</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Get notified when your API usage approaches billing thresholds.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Payment Security
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>256-bit SSL encryption for all transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>PCI DSS compliant payment processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Secure tokenization of payment methods</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Fraud detection and prevention</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'Security' && (
          <SecuritySettings />
        )}

        {selectedTab === 'Privacy' && (
          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={makeProfilePublic}
                    onChange={(e) => setMakeProfilePublic(e.target.checked)}
                  />
                  <span className="font-medium text-gray-900">Make my profile public</span>
                </label>
                <p className="text-sm text-gray-600 ml-6 mt-1">
                  Other users will be able to see your published Collections, Profile Image and any Patents or Scholarly Works you have claimed that are not on your ORCID record.
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={recordSearchHistory}
                    onChange={(e) => setRecordSearchHistory(e.target.checked)}
                  />
                  <span className="font-medium text-gray-900">Record Search History</span>
                </label>
                <p className="text-sm text-gray-600 ml-6 mt-1">
                  Opt in or out of your search history being recorded by default.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Allow Error Reports</h4>
                <p className="text-sm text-gray-600">
                  Share diagnostic information about technical issues you encounter to help improve our service.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Opt out of Web Analytics</h4>
                <p className="text-sm text-gray-600 mb-2">
                  We employ a self-hosted instance of the{' '}
                  <a href="#" className="text-blue-600 underline">Matomo analytics platform</a>{' '}
                  to log your behaviour over time and ensure your privacy is protected, while allowing us to gain aggregated data to improve user experience. See our{' '}
                  <a href="#" className="text-blue-600 underline">Privacy Policy</a>{' '}
                  for more information.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Access Level</h3>
              <p className="text-sm text-gray-600 mb-4">
                When you create studio assets, the default access level will be:
              </p>
              
              <div className="space-y-3 ml-4">
                <div>
                  <span className="font-medium text-gray-900">Restricted access</span>: Only you can view
                </div>
                <div>
                  <span className="font-medium text-gray-900">Limited access</span>: Anyone with the link can view
                </div>
                <div>
                  <span className="font-medium text-gray-900">Public access</span>: Discoverable through search
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Data & Usage</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Download Data</h4>
                    <p className="text-sm text-gray-600">
                      In compliance with GDPR, you can request a copy of your personal data and studio information stored in innospot.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Account Deletion</h4>
                    <p className="text-sm text-gray-600">
                      No longer need your account? Click here to delete your account. This can't be undone, so we recommend exporting all relevant work prior to requesting deletion.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Request Use Type Change</h4>
                    <div className="text-sm text-gray-600">
                      <p className="mb-1"><strong>Recorded Use Type:</strong></p>
                      <p>
                        Have your circumstances changed and you need to revise your confirmed use type? Click here to send a request to our support team advising of your updated use type.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'Subscriptions' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Subscriptions</h2>
              <p className="text-gray-600 mb-8">You have no subscriptions yet, browse our available subscriptions below:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Patent API & Data */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-blue-600 uppercase">innospot PATENT RECORDS</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Patent API & Data</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Access the full corpus of innospot patent records using the flexibility and convenience of a REST API or bulk data downloads. The versioned API allows you to perform and combine several types of searches using a number of different operations and aggregation requests.
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Read More
                </button>
              </div>

              {/* Scholarly API & Data */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">🎓</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-blue-600 uppercase">innospot SCHOLARLY WORKS</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Scholarly API & Data</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Access the full corpus of innospot scholarly works using the flexibility and convenience of a REST API or bulk data downloads. The versioned API allows you to perform and combine several types of searches using a number of different operations and aggregation requests.
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Read More
                </button>
              </div>

              {/* PatSeq Bulk Downloads */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">🧬</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-blue-600 uppercase">SEQUENCE DATA IN PATENTS</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">PatSeq Bulk Downloads</h3>
                <p className="text-sm text-gray-600 mb-4">
                  The PatSeq database contains now over 370 million patent sequences from 17 jurisdictions. The innospot offers this service to enable you to download sequence listings extracted from full-text patents, megafiles, and public databases in two data formats.
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Read More
                </button>
              </div>

              {/* Institutional Toolkit */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">🏛️</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-blue-600 uppercase">innospot FOR INSTITUTIONS</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Institutional Toolkit</h3>
                <p className="text-sm text-gray-600 mb-4">
                  The Institutional Toolkit (ITK) is a model for an enhanced collection of innospot tools and features that will help institutions discover, analyse and manage innovation knowledge. innospot builds on open data to create and provide a unique set of tools (toolkit) for institutions.
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Read More
                </button>
              </div>

              {/* Individual Commercial Use */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-blue-600 uppercase">COMMERCIAL USE FOR INDIVIDUALS</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Individual Commercial Use</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Many registered users have asked for an easy and affordable way to license their use of the innospot platform for commercial purposes. So we have created a new subscription for individuals permitting commercial use in their professional work or business.
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Read More
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <MainContent />
    </div>
  );
}