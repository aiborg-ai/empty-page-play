import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Settings, 
  Bot, 
  User, 
  Key,
  Search,
  FileText,
  Info,
  Shield,
  AlertTriangle,
  BarChart3,
  Folder,
  Check,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Ticket
} from 'lucide-react';
import { UnifiedLLMService } from '../lib/llmService';
import { AISecurityService } from '../lib/security';
import { CMSService } from '../lib/cmsService';
import { FAQService } from '../lib/faqService';

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

type ContextScope = 'search-results' | 'projects' | 'reports' | 'dashboards' | 'faq' | 'support';

interface ContextSelection {
  scope: ContextScope;
  specificItem?: {
    id: string;
    name: string;
  };
}

const contextOptions = [
  { 
    value: 'search-results' as ContextScope, 
    label: 'Search Results', 
    icon: Search,
    description: 'Focus on current search results and filtered patent data',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    iconColor: 'text-blue-600'
  },
  { 
    value: 'projects' as ContextScope, 
    label: 'Projects', 
    icon: Folder,
    description: 'Access data from your project workspaces',
    color: 'bg-green-50 border-green-200 text-green-700',
    iconColor: 'text-green-600'
  },
  { 
    value: 'reports' as ContextScope, 
    label: 'Reports', 
    icon: FileText,
    description: 'Analyze and discuss your generated reports',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    iconColor: 'text-purple-600'
  },
  { 
    value: 'dashboards' as ContextScope, 
    label: 'Dashboards', 
    icon: BarChart3,
    description: 'Explore insights from your dashboard visualizations',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    iconColor: 'text-orange-600'
  },
  { 
    value: 'faq' as ContextScope, 
    label: 'FAQ & Help', 
    icon: HelpCircle,
    description: 'Get answers about InnoSpot features and capabilities',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    iconColor: 'text-indigo-600'
  },
  { 
    value: 'support' as ContextScope, 
    label: 'Support Ticket', 
    icon: Ticket,
    description: 'Create a support ticket for customer service',
    color: 'bg-red-50 border-red-200 text-red-700',
    iconColor: 'text-red-600'
  },
];

export default function AIChat({ isOpen, onClose, userApiKey, onNavigate }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo');
  const [contextSelection, setContextSelection] = useState<ContextSelection>({ scope: 'search-results' });
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(userApiKey || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!userApiKey);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState({ remaining: 20, resetTime: 0 });
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [availableItems, setAvailableItems] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  
  const llmService = UnifiedLLMService.getInstance();
  const cmsService = CMSService.getInstance();
  const faqService = FAQService.getInstance();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const userId = useRef(Math.random().toString(36).substr(2, 9)); // Simple user ID for session
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'general'
  });

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

  // Load available items when context changes
  useEffect(() => {
    const loadItems = async () => {
      if (contextSelection.scope === 'search-results' || contextSelection.scope === 'faq' || contextSelection.scope === 'support') {
        setShowItemSelector(false);
        setShowTicketForm(contextSelection.scope === 'support');
        return;
      }

      setLoadingItems(true);
      setShowItemSelector(true);
      
      try {
        let items: Array<{ id: string; name: string }> = [];
        
        switch (contextSelection.scope) {
          case 'projects': {
            const response = await cmsService.getProjects();
            if (response.data) {
              items = response.data.map((p: any) => ({ id: p.id, name: p.name }));
            }
            break;
          }
          case 'reports': {
            const response = await cmsService.getReports();
            if (response.data) {
              items = response.data.map(r => ({ id: r.id, name: r.title }));
            }
            break;
          }
          case 'dashboards': {
            const response = await cmsService.getDashboards();
            if (response.data) {
              items = response.data.map(d => ({ id: d.id, name: d.name }));
            }
            break;
          }
        }
        
        setAvailableItems(items);
        
        // Auto-select first item if available
        if (items.length > 0 && !contextSelection.specificItem) {
          setContextSelection(prev => ({
            ...prev,
            specificItem: items[0]
          }));
        }
      } catch (error) {
        console.error('Failed to load items:', error);
        setAvailableItems([]);
      } finally {
        setLoadingItems(false);
      }
    };

    loadItems();
  }, [contextSelection.scope]);

  const getContextSystemMessage = (selection: ContextSelection): string => {
    const baseMessage = "You are an AI assistant integrated into InnoSpot, a patent intelligence platform. Focus your responses strictly within the selected context scope. ";
    
    let contextMessage = "";
    const itemInfo = selection.specificItem ? ` Specifically focusing on: ${selection.specificItem.name}.` : '';
    
    switch (selection.scope) {
      case 'search-results':
        contextMessage = "CONTEXT: Current search results. You have access to the filtered patent search results currently displayed to the user. Focus on analyzing patents, inventors, applicants, citation patterns, and trends from these specific results. Do not reference data outside this search scope.";
        break;
      case 'projects':
        contextMessage = `CONTEXT: Project workspace.${itemInfo} You have access to all data within this specific project, including saved searches, collections, reports, and assets. Help analyze project-specific patent portfolios and provide insights based on the project's curated data.`;
        break;
      case 'reports':
        contextMessage = `CONTEXT: Analysis report.${itemInfo} You have access to this specific analysis report and can help interpret findings, explain methodologies, suggest next steps, and provide deeper insights from the report data. Focus specifically on this report's content and conclusions.`;
        break;
      case 'dashboards':
        contextMessage = `CONTEXT: Dashboard visualization.${itemInfo} You have access to this specific dashboard's data and visualizations. Help interpret charts, graphs, metrics, and trends shown in this dashboard. Provide insights based on the visual analytics and suggest ways to dig deeper into the data.`;
        break;
      case 'faq':
        contextMessage = "CONTEXT: FAQ and Help System. You are providing help and answers about InnoSpot platform features, capabilities, and how to use various tools. Focus on being helpful and informative about the platform's functionality.";
        break;
      case 'support':
        contextMessage = "CONTEXT: Customer Support. You are helping the user create a support ticket. Guide them through describing their issue clearly and gathering necessary information for the support team.";
        break;
      default:
        contextMessage = "Help users with patent analysis and innovation intelligence within the selected context.";
    }
    
    // Apply security validation to system message
    return AISecurityService.validateSystemMessage(baseMessage + contextMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle support ticket submission
    if (contextSelection.scope === 'support' && showTicketForm) {
      if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
        setSecurityAlert('Please fill in all required fields for the support ticket.');
        return;
      }
      
      const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
      const userName = localStorage.getItem('userName') || 'InnoSpot User';
      
      const result = await faqService.createSupportTicket({
        subject: ticketForm.subject,
        description: ticketForm.description,
        user_email: userEmail,
        user_name: userName,
        priority: ticketForm.priority,
        category: ticketForm.category,
        metadata: {
          context: 'AI Chat',
          timestamp: new Date().toISOString()
        }
      });
      
      if (result.success) {
        const successMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✅ Support ticket created successfully!\n\nTicket ID: ${result.ticketId}\n\nOur support team will respond to your email within 24 hours. Thank you for contacting InnoSpot support.`,
          timestamp: new Date(),
          securityLevel: 'low'
        };
        setMessages(prev => [...prev, successMessage]);
        setShowTicketForm(false);
        setTicketForm({ subject: '', description: '', priority: 'medium', category: 'general' });
      } else {
        setSecurityAlert(result.error || 'Failed to create support ticket.');
      }
      return;
    }
    
    if (!input.trim() || (!apiKey.trim() && contextSelection.scope !== 'faq') || isLoading) return;

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
      // Handle FAQ context differently
      if (contextSelection.scope === 'faq') {
        // Search FAQs first
        const faqs = await faqService.searchFAQs(sanitizedInput);
        let responseContent = '';
        
        if (faqs.length > 0) {
          responseContent = `I found these relevant FAQs:\n\n`;
          faqs.forEach((faq, index) => {
            responseContent += `**${index + 1}. ${faq.question}**\n${faq.answer}\n\n`;
          });
        } else {
          // Try to generate contextual answer
          responseContent = await faqService.generateContextualAnswer(sanitizedInput);
        }
        
        // Add suggestion to create ticket if needed
        if (!faqs.length || faqs[0].relevance_score! < 5) {
          responseContent += `\n\nIf you need more specific help, you can switch to the Support Ticket context to create a support request.`;
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          securityLevel: 'low',
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }
      const systemMessage = getContextSystemMessage(contextSelection);
      
      // Sanitize conversation history
      const conversationHistory = AISecurityService.sanitizeConversationHistory([
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: userMessage.role, content: userMessage.content }
      ]);
      
      const response = await llmService.sendMessage([
        { role: 'system', content: systemMessage },
        ...conversationHistory.map(msg => ({ 
          role: msg.role as 'user' | 'assistant' | 'system', 
          content: msg.content 
        }))
      ]);

      const responseContent = response.content || 'Sorry, I could not generate a response.';
      
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

  // Remove early return to allow animation

  const selectedContext = contextOptions.find(opt => opt.value === contextSelection.scope);

  const handleContextScopeChange = (newScope: ContextScope) => {
    setContextSelection({ scope: newScope });
    setShowItemSelector(newScope !== 'search-results' && newScope !== 'faq' && newScope !== 'support');
    setShowTicketForm(newScope === 'support');
  };

  const handleItemSelection = (item: { id: string; name: string }) => {
    setContextSelection(prev => ({
      ...prev,
      specificItem: item
    }));
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">AI Assistant</h2>
              <p className="text-xs text-white/80">Powered by Advanced LLMs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onNavigate && (
              <button
                onClick={() => onNavigate('ai-chat-support')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                title="Get help with AI Assistant"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white space-y-4">
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
              {llmService.getAvailableProviders().flatMap(provider =>
                provider.models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({provider.name})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Context Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Focus Context
            </label>
            <div className="space-y-2">
              {contextOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = contextSelection.scope === option.value;
                
                return (
                  <div
                    key={option.value}
                    className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                      isSelected 
                        ? option.color + ' border-opacity-100 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleContextScopeChange(option.value)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${isSelected ? 'bg-white bg-opacity-70' : 'bg-gray-50'} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-4 h-4 ${isSelected ? option.iconColor : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${isSelected ? option.color.split(' ')[2] : 'text-gray-900'}`}>
                            {option.label}
                          </h4>
                          {isSelected && (
                            <Check className={`w-4 h-4 ${option.iconColor}`} />
                          )}
                        </div>
                        <p className={`text-xs mt-1 ${isSelected ? option.color.split(' ')[2] + ' opacity-80' : 'text-gray-500'}`}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Item Selector for specific selection */}
            {showItemSelector && contextSelection.scope !== 'search-results' && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-xs font-medium text-blue-900 mb-2">
                  Select specific {selectedContext?.label.toLowerCase().slice(0, -1)}:
                </label>
                {loadingItems ? (
                  <div className="text-xs text-blue-700">Loading...</div>
                ) : availableItems.length > 0 ? (
                  <select
                    value={contextSelection.specificItem?.id || ''}
                    onChange={(e) => {
                      const item = availableItems.find(i => i.id === e.target.value);
                      if (item) handleItemSelection(item);
                    }}
                    className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    {availableItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-blue-700">No {selectedContext?.label.toLowerCase()} available</div>
                )}
              </div>
            )}
            
            <div className="mt-3 p-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600">
                💡 Choose a context to focus the AI's responses on specific data within InnoSpot
              </p>
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

      {/* Quick Context Switcher */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-b from-purple-50 to-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Focus Context</span>
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-3 h-3 text-green-600" />
            <span className="text-green-700">Protected</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{rateLimitInfo.remaining} left</span>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {contextOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = contextSelection.scope === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => handleContextScopeChange(option.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected 
                    ? option.color + ' border border-opacity-50 shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:shadow-sm'
                }`}
                title={option.description}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? option.iconColor : 'text-gray-500'}`} />
                <span>{option.label}</span>
                {isSelected && <Check className={`w-3 h-3 ${option.iconColor}`} />}
              </button>
            );
          })}
        </div>
        
        {/* Show selected specific item */}
        {contextSelection.specificItem && contextSelection.scope !== 'search-results' && (
          <div className="mt-2 flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">
              {contextSelection.specificItem.name}
            </span>
            {showItemSelector && (
              <button
                onClick={() => setShowItemSelector(false)}
                className="text-xs text-blue-600 hover:text-blue-700 ml-auto"
              >
                Change
              </button>
            )}
          </div>
        )}
        
        {selectedContext && (
          <div className="mt-2">
            <p className={`text-xs ${selectedContext.color.split(' ')[2]} opacity-80`}>
              {selectedContext.description}
            </p>
          </div>
        )}
        
        {/* Quick item selector dropdown */}
        {showItemSelector && contextSelection.scope !== 'search-results' && !showSettings && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
            {loadingItems ? (
              <div className="text-xs text-blue-700">Loading {selectedContext?.label.toLowerCase()}...</div>
            ) : availableItems.length > 0 ? (
              <div className="space-y-1">
                <label className="block text-xs font-medium text-blue-900">
                  Select {selectedContext?.label.toLowerCase().slice(0, -1)}:
                </label>
                <select
                  value={contextSelection.specificItem?.id || ''}
                  onChange={(e) => {
                    const item = availableItems.find(i => i.id === e.target.value);
                    if (item) {
                      handleItemSelection(item);
                      setShowItemSelector(false);
                    }
                  }}
                  className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select a {selectedContext?.label.toLowerCase().slice(0, -1)}</option>
                  {availableItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="text-xs text-blue-700">No {selectedContext?.label.toLowerCase()} available</div>
            )}
          </div>
        )}
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

      {/* Support Ticket Form */}
      {showTicketForm && contextSelection.scope === 'support' && (
        <div className="p-4 border-b border-gray-200 bg-gradient-to-b from-red-50 to-white">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-red-600" />
            Create Support Ticket
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your issue"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={ticketForm.description}
                onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please describe your issue in detail..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing</option>
                  <option value="feature-request">Feature Request</option>
                  <option value="bug-report">Bug Report</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Submit Support Ticket
            </button>
            <p className="text-xs text-gray-500">
              <MessageSquare className="w-3 h-3 inline mr-1" />
              Your ticket will be sent to our support team and you'll receive a response via email.
            </p>
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
              {contextSelection.scope === 'faq' ? (
                <>I'm ready to help! Ask me anything about InnoSpot's features and how to use the platform.</>
              ) : contextSelection.scope === 'support' ? (
                <>Fill out the form above to create a support ticket, and our team will respond within 24 hours.</>
              ) : (
                <>I'm focused on <span className={`font-medium ${selectedContext?.iconColor || 'text-blue-600'}`}>
                  {selectedContext?.label}
                </span>. Ask me anything about your patent data!</>
              )}
            </p>
            {selectedContext && (
              <div className="mt-4 max-w-xs mx-auto">
                <div className={`p-3 rounded-lg ${selectedContext.color} border border-opacity-30`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <selectedContext.icon className={`w-4 h-4 ${selectedContext.iconColor}`} />
                    <span className={`text-sm font-medium ${selectedContext.color.split(' ')[2]}`}>
                      {selectedContext.label} Context
                    </span>
                  </div>
                  <p className={`text-xs ${selectedContext.color.split(' ')[2]} opacity-80`}>
                    {selectedContext.description}
                  </p>
                </div>
              </div>
            )}
            {!apiKey && (
              <p className="text-sm mt-4 text-red-600">
                Please configure your OpenRouter API key in settings to start chatting.
              </p>
            )}
            <div className="mt-4 text-xs text-gray-400">
              {contextSelection.scope === 'faq' ? (
                <p>Try asking: "How do I create a project?" or "What AI tools are available?"</p>
              ) : contextSelection.scope === 'support' ? (
                <p>Describe your issue in the form above and we'll help you as soon as possible.</p>
              ) : (
                <p>Try asking: "What are the key trends in this data?" or "Summarize the main findings"</p>
              )}
            </div>
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
              placeholder={
                contextSelection.scope === 'faq' 
                  ? "Ask about InnoSpot features and capabilities..." 
                  : contextSelection.scope === 'support'
                  ? "Use the form above to create a support ticket..."
                  : apiKey 
                  ? "Ask about patents, search results, or analysis..." 
                  : "Configure API key first..."
              }
              disabled={(!apiKey && contextSelection.scope !== 'faq' && contextSelection.scope !== 'support') || isLoading || rateLimitInfo.remaining <= 0 || contextSelection.scope === 'support'}
              rows={3}
              maxLength={4000}
              className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-400 ${
                securityAlert ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            <button
              type="submit"
              disabled={!input.trim() || (!apiKey && contextSelection.scope !== 'faq') || isLoading || rateLimitInfo.remaining <= 0 || contextSelection.scope === 'support'}
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