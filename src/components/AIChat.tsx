import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Settings, 
  Bot, 
  User, 
  ChevronDown, 
  Key,
  Database,
  Search,
  FileText,
  BookOpen,
  Info,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { OpenRouterService } from '../lib/openrouter';
import { AISecurityService } from '../lib/security';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  securityLevel?: 'low' | 'medium' | 'high';
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  userApiKey?: string;
  onNavigate?: (section: string) => void;
}

type ContextScope = 'search-results' | 'collections' | 'reports' | 'patent-corpus';

const contextOptions = [
  { value: 'search-results' as ContextScope, label: 'Search Results', icon: Search },
  { value: 'collections' as ContextScope, label: 'Collections', icon: BookOpen },
  { value: 'reports' as ContextScope, label: 'Reports', icon: FileText },
  { value: 'patent-corpus' as ContextScope, label: 'Complete Patent Corpus', icon: Database },
];

export default function AIChat({ isOpen, onClose, userApiKey, onNavigate }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo');
  const [contextScope, setContextScope] = useState<ContextScope>('search-results');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(userApiKey || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!userApiKey);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState({ remaining: 20, resetTime: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const userId = useRef(Math.random().toString(36).substr(2, 9)); // Simple user ID for session

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getContextSystemMessage = (scope: ContextScope): string => {
    const baseMessage = "You are an AI assistant integrated into InnoSpot, a patent intelligence platform. ";
    
    let contextMessage = "";
    switch (scope) {
      case 'search-results':
        contextMessage = "You have access to the current search results and can help users analyze patents, inventors, applicants, and trends from the filtered results.";
        break;
      case 'collections':
        contextMessage = "You have access to the user's saved patent collections and can help analyze, compare, and derive insights from their curated patent sets.";
        break;
      case 'reports':
        contextMessage = "You have access to the user's generated reports and can help interpret findings, suggest next steps, and provide deeper analysis of report data.";
        break;
      case 'patent-corpus':
        contextMessage = "You have access to the complete patent database with 165+ million patents from 100+ jurisdictions and can help with comprehensive patent landscape analysis.";
        break;
      default:
        contextMessage = "Help users with patent analysis and innovation intelligence.";
    }
    
    // Apply security validation to system message
    return AISecurityService.validateSystemMessage(baseMessage + contextMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey.trim() || isLoading) return;

    // Clear any previous security alerts
    setSecurityAlert(null);

    // Check rate limit
    const rateLimitCheck = AISecurityService.checkRateLimit(userId.current);
    setRateLimitInfo({ remaining: rateLimitCheck.remainingRequests, resetTime: rateLimitCheck.resetTime });
    
    if (!rateLimitCheck.allowed) {
      const resetTime = new Date(rateLimitCheck.resetTime);
      setSecurityAlert(`Rate limit exceeded. Please wait until ${resetTime.toLocaleTimeString()} before sending another message.`);
      
      AISecurityService.logSecurityEvent({
        type: 'rate_limit',
        severity: 'medium',
        details: `Rate limit exceeded for user ${userId.current}`,
        userId: userId.current
      });
      return;
    }

    // Validate and sanitize input
    const validation = AISecurityService.validateInput(input.trim(), userId.current);
    if (!validation.isValid) {
      setSecurityAlert(validation.reason || 'Invalid input detected.');
      
      AISecurityService.logSecurityEvent({
        type: 'blocked_input',
        severity: validation.severity,
        details: validation.reason || 'Input validation failed',
        userId: userId.current,
        input: input.trim()
      });
      return;
    }

    // Check message count limit
    if (messages.length >= 100) {
      setSecurityAlert('Maximum conversation length reached. Please clear the chat to continue.');
      return;
    }

    const sanitizedInput = validation.sanitizedInput!;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: sanitizedInput,
      timestamp: new Date(),
      securityLevel: validation.severity,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const openRouter = new OpenRouterService(apiKey);
      const systemMessage = getContextSystemMessage(contextScope);
      
      // Sanitize conversation history
      const conversationHistory = AISecurityService.sanitizeConversationHistory([
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: userMessage.role, content: userMessage.content }
      ]);
      
      const response = await openRouter.getChatCompletion(selectedModel, [
        { role: 'system', content: systemMessage },
        ...conversationHistory.map(msg => ({ 
          role: msg.role as 'user' | 'assistant' | 'system', 
          content: msg.content 
        }))
      ]);

      const responseContent = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      // Validate AI response
      const responseValidation = AISecurityService.validateResponse(responseContent);
      const finalContent = responseValidation.isValid 
        ? (responseValidation.sanitizedResponse || responseContent)
        : 'I apologize, but I cannot provide that response. Please rephrase your question about patent analysis or innovation intelligence.';

      if (!responseValidation.isValid) {
        AISecurityService.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          details: 'AI response contained potentially sensitive information',
          userId: userId.current
        });
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: finalContent,
        timestamp: new Date(),
        securityLevel: 'low',
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Log suspicious activity if detected
      if (validation.severity === 'medium' || validation.severity === 'high') {
        AISecurityService.logSecurityEvent({
          type: 'suspicious_activity',
          severity: validation.severity,
          details: 'Input contained suspicious patterns but was processed',
          userId: userId.current,
          input: sanitizedInput
        });
      }
      
    } catch (error) {
      console.error('AI Chat error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'Invalid API key. Please check your OpenRouter API key in settings.';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
        } else if (error.message.includes('credits')) {
          errorMessage = 'Insufficient credits. Please check your OpenRouter account balance.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      const errorMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
        securityLevel: 'low',
      };
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSecurityAlert(null);
    setInput('');
    // Reset rate limit info
    setRateLimitInfo({ remaining: 20, resetTime: 0 });
  };

  if (!isOpen) return null;

  const selectedContext = contextOptions.find(opt => opt.value === contextScope);

  return (
    <div className="fixed inset-y-0 left-64 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">AI Assistant</h2>
          {onNavigate && (
            <button
              onClick={() => onNavigate('ai-chat-support')}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Get help with AI Assistant"
            >
              <Info className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-gray-200 rounded"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded"
            title="Close"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gray-50 space-y-4">
          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OpenRouter API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showApiKeyInput ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenRouter API key"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800"
              >
                {showApiKeyInput ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {OpenRouterService.getPopularModels().map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {/* Context Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Context Scope
            </label>
            <div className="relative">
              <select
                value={contextScope}
                onChange={(e) => setContextScope(e.target.value as ContextScope)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                {contextOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Security Information */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Security Status</span>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Prompt Injection Protection:</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Input Validation:</span>
                <span className="text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>Rate Limiting:</span>
                <span className="text-green-600">{rateLimitInfo.remaining}/20</span>
              </div>
              <div className="flex justify-between">
                <span>Response Filtering:</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearChat}
              className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Clear Chat
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Context Indicator & Security Status */}
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            {selectedContext && <selectedContext.icon className="w-4 h-4" />}
            <span>Context: {selectedContext?.label}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-3 h-3 text-green-600" />
            <span className="text-green-700">Protected</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-700">{rateLimitInfo.remaining} requests left</span>
          </div>
        </div>
      </div>

      {/* Security Alert */}
      {securityAlert && (
        <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-800">{securityAlert}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">AI Assistant Ready</p>
            <p className="text-sm mt-2">
              Ask questions about patents, search results, or get insights from your data.
            </p>
            {!apiKey && (
              <p className="text-sm mt-4 text-red-600">
                Please configure your OpenRouter API key in settings to start chatting.
              </p>
            )}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={apiKey ? "Ask about patents, search results, or analysis..." : "Configure API key first..."}
              disabled={!apiKey || isLoading || rateLimitInfo.remaining <= 0}
              rows={3}
              maxLength={4000}
              className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-400 ${
                securityAlert ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            <button
              type="submit"
              disabled={!input.trim() || !apiKey || isLoading || rateLimitInfo.remaining <= 0}
              className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {/* Character count and security info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className={input.length > 3500 ? 'text-red-600' : ''}>
                {input.length}/4000 characters
              </span>
              <span>Messages: {messages.length}/100</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-green-600">Security: Active</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}