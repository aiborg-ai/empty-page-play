import { Bot, Key, Database, Search, FileText, BookOpen, ExternalLink, AlertCircle } from 'lucide-react';

export default function AIChatSupport() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Assistant Help</h1>
              <p className="text-gray-600">Learn how to use the AI Assistant to analyze patents and get insights</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Getting Started */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Configure API Key</p>
                  <p className="text-sm text-gray-600">Add your OpenRouter API key in the settings panel or account settings</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Select Context</p>
                  <p className="text-sm text-gray-600">Choose what data the AI should focus on: search results, collections, reports, or full corpus</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Choose Model</p>
                  <p className="text-sm text-gray-600">Pick the AI model that best fits your needs and budget</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start Chatting</p>
                  <p className="text-sm text-gray-600">Ask questions about patents, trends, or get analysis insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* OpenRouter Setup */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              OpenRouter API Setup
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">1. Create OpenRouter Account</h3>
                <p className="text-sm text-gray-600 mb-2">Visit OpenRouter.ai to create a free account</p>
                <a 
                  href="https://openrouter.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  Visit OpenRouter.ai <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">2. Get API Key</h3>
                <p className="text-sm text-gray-600">Navigate to Keys section and create a new API key</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">3. Add Credits</h3>
                <p className="text-sm text-gray-600">Add credits to your account to use AI models</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    Keep your API key secure. Never share it with others or commit it to version control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Context Scopes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Context Scopes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <Search className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Search Results</h3>
                <p className="text-sm text-gray-600">AI focuses on your current search results and can help analyze patterns, key players, and trends within the filtered patents.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Collections</h3>
                <p className="text-sm text-gray-600">AI analyzes your saved patent collections, comparing portfolios and identifying relationships between curated patent sets.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Reports</h3>
                <p className="text-sm text-gray-600">AI interprets your generated reports, explaining insights and suggesting follow-up analysis or next steps.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Database className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Complete Patent Corpus</h3>
                <p className="text-sm text-gray-600">AI has access to the full database of 165M+ patents for comprehensive landscape analysis and broad trend identification.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Model Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">AI Model Selection</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">GPT-4 Turbo</h3>
                <p className="text-sm text-gray-600 mb-2">Best for complex analysis, detailed explanations, and comprehensive patent research.</p>
                <div className="text-xs text-gray-500">Higher cost, highest quality</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">GPT-3.5 Turbo</h3>
                <p className="text-sm text-gray-600 mb-2">Good balance of cost and performance for general patent queries and analysis.</p>
                <div className="text-xs text-gray-500">Moderate cost, good quality</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Claude 3</h3>
                <p className="text-sm text-gray-600 mb-2">Excellent for detailed analysis, technical explanations, and complex reasoning.</p>
                <div className="text-xs text-gray-500">Variable cost based on version</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Mixtral 8x7B</h3>
                <p className="text-sm text-gray-600 mb-2">Cost-effective option for basic queries and straightforward analysis tasks.</p>
                <div className="text-xs text-gray-500">Lower cost, good performance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Queries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sample Queries</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Patent Analysis</h3>
              <div className="space-y-2">
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">"What are the key trends in AI patents from 2020-2024?"</div>
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">"Compare the patent portfolios of Apple and Google in smartphone technology"</div>
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">"Identify the most cited patents in renewable energy storage"</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Competitive Intelligence</h3>
              <div className="space-y-2">
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">"Who are the top inventors in quantum computing patents?"</div>
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">"What jurisdictions are most active in biotech patent filings?"</div>
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">"Analyze the patent filing strategy of Tesla over the last 5 years"</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Technical Analysis</h3>
              <div className="space-y-2">
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">"Explain the technical approach in patent US1234567"</div>
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">"What are the key claims in this patent collection?"</div>
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">"Identify potential white spaces in 5G technology patents"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Pro Tips</h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Be specific in your queries for better results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Use follow-up questions to dive deeper into analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Switch context scopes to get different perspectives</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Save important insights for later reference</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Monitor your OpenRouter usage to manage costs</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}