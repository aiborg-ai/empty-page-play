/**
 * Voice Transcription Service
 * Provides voice-to-text functionality using Web Speech API with LLM fallback
 */

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

// Speech Recognition types are declared in ../types/speechRecognition.d.ts

export interface TranscriptionResult {
  success: boolean;
  text?: string;
  error?: string;
  confidence?: number;
  isFinal?: boolean;
}

export interface VoiceTranscriptionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  maxAlternatives?: number;
  onInterimResult?: (text: string) => void;
  onFinalResult?: (text: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

class VoiceTranscriptionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentTranscript: string = '';
  private finalTranscript: string = '';
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    this.initializeSpeechRecognition();
  }

  /**
   * Initialize the Speech Recognition API
   */
  private initializeSpeechRecognition() {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      this.setupRecognitionDefaults();
    }
  }

  /**
   * Set up default configuration for speech recognition
   */
  private setupRecognitionDefaults() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
    this.recognition.lang = 'en-US';
  }

  /**
   * Check if voice transcription is supported
   */
  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Check if microphone permission is granted
   */
  public async checkMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  /**
   * Start voice transcription
   */
  public async startTranscription(options: VoiceTranscriptionOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    if (this.isListening) {
      console.warn('Already listening');
      return;
    }

    // Check microphone permission
    const hasPermission = await this.checkMicrophonePermission();
    if (!hasPermission) {
      throw new Error('Microphone permission is required for voice search');
    }

    // Configure recognition with options
    if (options.continuous !== undefined) {
      this.recognition.continuous = options.continuous;
    }
    if (options.interimResults !== undefined) {
      this.recognition.interimResults = options.interimResults;
    }
    if (options.language) {
      this.recognition.lang = options.language;
    }
    if (options.maxAlternatives) {
      this.recognition.maxAlternatives = options.maxAlternatives;
    }

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.currentTranscript = '';
      this.finalTranscript = '';
      options.onStart?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          this.finalTranscript += transcript + ' ';
          options.onFinalResult?.(this.finalTranscript.trim());
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (interimTranscript) {
        this.currentTranscript = this.finalTranscript + interimTranscript;
        options.onInterimResult?.(this.currentTranscript);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      let errorMessage = 'Speech recognition error';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone was found. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission was denied.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      options.onError?.(errorMessage);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      options.onEnd?.();
    };

    // Start recognition
    try {
      this.recognition.start();
    } catch (error) {
      throw new Error('Failed to start speech recognition');
    }
  }

  /**
   * Stop voice transcription
   */
  public stopTranscription(): string {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    
    const result = this.finalTranscript || this.currentTranscript;
    this.currentTranscript = '';
    this.finalTranscript = '';
    
    return result.trim();
  }

  /**
   * Cancel voice transcription without returning results
   */
  public cancelTranscription(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
    
    this.currentTranscript = '';
    this.finalTranscript = '';
  }

  /**
   * Check if currently listening
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Get current transcript (including interim results)
   */
  public getCurrentTranscript(): string {
    return this.currentTranscript;
  }

  /**
   * Get final transcript only
   */
  public getFinalTranscript(): string {
    return this.finalTranscript;
  }

  /**
   * Start recording audio for LLM fallback
   * This can be used when Speech Recognition API is not available
   */
  public async startAudioRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start();
    } catch (error) {
      throw new Error('Failed to start audio recording');
    }
  }

  /**
   * Stop audio recording and get the blob
   */
  public async stopAudioRecording(): Promise<Blob | null> {
    if (!this.mediaRecorder) return null;
    
    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];
        resolve(audioBlob);
      };
      
      this.mediaRecorder!.stop();
      this.mediaRecorder!.stream.getTracks().forEach(track => track.stop());
      this.mediaRecorder = null;
    });
  }

  /**
   * Transcribe audio using OpenAI Whisper API or other LLM service
   * This is a placeholder for actual LLM integration
   */
  public async transcribeWithLLM(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      // Convert blob to base64 for API transmission
      const base64Audio = await this.blobToBase64(audioBlob);
      
      // TODO: Replace with actual LLM API call
      // For now, return a mock response
      console.log('Audio blob ready for LLM transcription:', base64Audio.substring(0, 50) + '...');
      
      // Placeholder for actual API call
      // const response = await fetch('/api/transcribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ audio: base64Audio })
      // });
      // const result = await response.json();
      
      return {
        success: true,
        text: 'This is a placeholder transcription. Integrate with OpenAI Whisper or similar service.',
        confidence: 0.95
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to transcribe audio with LLM'
      };
    }
  }

  /**
   * Convert blob to base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Get supported languages
   */
  public getSupportedLanguages(): string[] {
    return [
      'en-US', // English (United States)
      'en-GB', // English (United Kingdom)
      'es-ES', // Spanish (Spain)
      'es-MX', // Spanish (Mexico)
      'fr-FR', // French (France)
      'de-DE', // German (Germany)
      'it-IT', // Italian (Italy)
      'pt-BR', // Portuguese (Brazil)
      'ru-RU', // Russian (Russia)
      'zh-CN', // Chinese (Simplified)
      'ja-JP', // Japanese (Japan)
      'ko-KR', // Korean (Korea)
      'ar-SA', // Arabic (Saudi Arabia)
      'hi-IN', // Hindi (India)
      'nl-NL', // Dutch (Netherlands)
      'sv-SE', // Swedish (Sweden)
      'pl-PL', // Polish (Poland)
      'tr-TR', // Turkish (Turkey)
      'th-TH', // Thai (Thailand)
      'vi-VN'  // Vietnamese (Vietnam)
    ];
  }

  /**
   * Text-to-Speech: Speak the given text
   */
  public speak(text: string, options?: { rate?: number; pitch?: number; volume?: number; voice?: SpeechSynthesisVoice }): void {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (options) {
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      if (options.voice) {
        utterance.voice = options.voice;
      }
    }

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Get available voices for text-to-speech
   */
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices();
  }
}

// Export singleton instance
export const voiceTranscriptionService = new VoiceTranscriptionService();

// Export default
export default voiceTranscriptionService;