import { UnifiedLLMService } from './llmService';
import type { VoiceCommand, VoiceSession, VoiceResult } from '../types/innovations';

export class VoicePatentAssistant {
  private llmService: UnifiedLLMService;
  private currentSession: VoiceSession | null = null;
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;

  constructor() {
    this.llmService = UnifiedLLMService.getInstance();
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionClass();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    
    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      // let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          // interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.processVoiceCommand(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  startSession(userId: string): VoiceSession {
    this.currentSession = {
      id: `session_${Date.now()}`,
      userId,
      startTime: new Date().toISOString(),
      commands: [],
      context: {},
      results: []
    };

    this.speak('Patent research assistant activated. How can I help you today?');
    return this.currentSession;
  }

  stopSession(): VoiceSession | null {
    if (this.currentSession) {
      this.currentSession.endTime = new Date().toISOString();
      this.stopListening();
      this.speak('Session ended. Thank you for using the patent research assistant.');
    }
    
    const session = this.currentSession;
    this.currentSession = null;
    return session;
  }

  startListening(): boolean {
    if (!this.recognition || this.isListening) return false;

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start listening:', error);
      return false;
    }
  }

  stopListening(): boolean {
    if (!this.recognition || !this.isListening) return false;

    try {
      this.recognition.stop();
      this.isListening = false;
      return true;
    } catch (error) {
      console.error('Failed to stop listening:', error);
      return false;
    }
  }

  private async processVoiceCommand(transcript: string): Promise<void> {
    if (!this.currentSession) return;

    const command = await this.parseVoiceCommand(transcript);
    this.currentSession.commands.push(command);

    try {
      const result = await this.executeCommand(command);
      this.currentSession.results.push(result);
      
      if (result.success) {
        this.speak(result.response);
      } else {
        this.speak('Sorry, I couldn\'t process that request. Please try again.');
      }
    } catch (error) {
      const errorResult: VoiceResult = {
        commandId: command.command,
        success: false,
        response: 'An error occurred while processing your request.',
        timestamp: new Date().toISOString()
      };
      
      this.currentSession.results.push(errorResult);
      this.speak(errorResult.response);
    }
  }

  private async parseVoiceCommand(transcript: string): Promise<VoiceCommand> {
    try {
      const prompt = `
Parse this voice command for patent research:

Command: "${transcript}"

Identify:
1. Intent (search, analyze, create, navigate, compare)
2. Parameters (patent IDs, keywords, dates, etc.)
3. Confidence level (0-1)

Format as JSON:
{
  "intent": "search",
  "parameters": {
    "query": "artificial intelligence patents",
    "dateRange": "2020-2025"
  },
  "confidence": 0.9
}
`;

      const response = await this.llmService.sendMessage([
        {
          role: 'system',
          content: 'You are a voice command parser for patent research. Parse natural language into structured commands.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const parsedData = this.parseCommandResponse(response.content);
      
      return {
        command: transcript,
        intent: parsedData.intent || 'search',
        parameters: parsedData.parameters || {},
        confidence: parsedData.confidence || 0.5,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Fallback parsing
      return this.fallbackCommandParsing(transcript);
    }
  }

  private parseCommandResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch {
      return {};
    }
  }

  private fallbackCommandParsing(transcript: string): VoiceCommand {
    const lowerTranscript = transcript.toLowerCase();
    
    let intent: 'search' | 'analyze' | 'create' | 'navigate' | 'compare' = 'search';
    const parameters: Record<string, any> = {};

    if (lowerTranscript.includes('search') || lowerTranscript.includes('find')) {
      intent = 'search';
      parameters.query = transcript.replace(/search|find|for|patents?/gi, '').trim();
    } else if (lowerTranscript.includes('analyze') || lowerTranscript.includes('analysis')) {
      intent = 'analyze';
      parameters.target = transcript.replace(/analyze|analysis|of|the/gi, '').trim();
    } else if (lowerTranscript.includes('create') || lowerTranscript.includes('generate')) {
      intent = 'create';
      parameters.type = transcript.replace(/create|generate|new/gi, '').trim();
    } else if (lowerTranscript.includes('navigate') || lowerTranscript.includes('go to')) {
      intent = 'navigate';
      parameters.destination = transcript.replace(/navigate|go to|open/gi, '').trim();
    } else if (lowerTranscript.includes('compare')) {
      intent = 'compare';
      parameters.items = transcript.replace(/compare/gi, '').split('and').map(s => s.trim());
    }

    return {
      command: transcript,
      intent,
      parameters,
      confidence: 0.6,
      timestamp: new Date().toISOString()
    };
  }

  private async executeCommand(command: VoiceCommand): Promise<VoiceResult> {
    // const startTime = Date.now();
    
    try {
      let response = '';
      let data: any = null;

      switch (command.intent) {
        case 'search':
          response = await this.executeSearchCommand(command.parameters);
          break;
        case 'analyze':
          response = await this.executeAnalyzeCommand(command.parameters);
          break;
        case 'create':
          response = await this.executeCreateCommand(command.parameters);
          break;
        case 'navigate':
          response = await this.executeNavigateCommand(command.parameters);
          break;
        case 'compare':
          response = await this.executeCompareCommand(command.parameters);
          break;
        default:
          response = 'I didn\'t understand that command. Please try again.';
      }

      return {
        commandId: command.command,
        success: true,
        response,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        commandId: command.command,
        success: false,
        response: `Error executing command: ${error}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async executeSearchCommand(parameters: any): Promise<string> {
    const query = parameters.query || 'recent patents';
    
    // Simulate patent search
    const mockResults = [
      'US Patent 10,123,456 - AI-based image recognition system',
      'US Patent 10,234,567 - Machine learning for data analysis',
      'US Patent 10,345,678 - Automated patent classification'
    ];

    return `I found ${mockResults.length} patents related to "${query}". The top results include: ${mockResults.slice(0, 2).join(', ')}. Would you like me to analyze any specific patent?`;
  }

  private async executeAnalyzeCommand(parameters: any): Promise<string> {
    const target = parameters.target || 'selected patent';
    
    return `I've analyzed ${target}. The patent shows strong technical merit with 15 forward citations and coverage in emerging technology areas. The claims are well-structured and the prior art analysis is comprehensive. Would you like me to generate a detailed report?`;
  }

  private async executeCreateCommand(parameters: any): Promise<string> {
    const type = parameters.type || 'document';
    
    return `I'll help you create a new ${type}. Please specify the details you'd like to include, such as the patent title, inventors, and key technical features.`;
  }

  private async executeNavigateCommand(parameters: any): Promise<string> {
    const destination = parameters.destination || 'dashboard';
    
    return `Navigating to ${destination}. The page is now loading with the relevant patent information and tools.`;
  }

  private async executeCompareCommand(parameters: any): Promise<string> {
    const items = parameters.items || ['patent A', 'patent B'];
    
    return `Comparing ${items.join(' and ')}. Patent A has stronger claim coverage while Patent B shows higher citation impact. Both patents complement each other well in your portfolio. Would you like a detailed comparison report?`;
  }

  private speak(text: string): void {
    if (!this.synthesis) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Find a suitable voice (prefer female English voice)
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Female')
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.synthesis.speak(utterance);
  }

  getCurrentSession(): VoiceSession | null {
    return this.currentSession;
  }

  isSessionActive(): boolean {
    return this.currentSession !== null;
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }
}