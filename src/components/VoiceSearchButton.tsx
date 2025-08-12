import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, X, Volume2 } from 'lucide-react';
import { voiceTranscriptionService } from '../lib/voiceTranscriptionService';

interface VoiceSearchButtonProps {
  onTranscription: (text: string) => void;
  onInterimTranscription?: (text: string) => void;
  className?: string;
  language?: string;
  placeholder?: string;
  showVisualizer?: boolean;
  autoSubmit?: boolean;
}

const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscription,
  onInterimTranscription,
  className = '',
  language = 'en-US',
  placeholder = 'Click to start voice search',
  showVisualizer = true,
  autoSubmit = true
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if voice transcription is supported
    setIsSupported(voiceTranscriptionService.isSupported());

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Setup audio visualizer
  const setupAudioVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      microphoneRef.current.connect(analyserRef.current);
      
      // Start volume monitoring
      monitorVolume();
    } catch (error) {
      console.error('Failed to setup audio visualizer:', error);
    }
  };

  // Monitor microphone volume for visual feedback
  const monitorVolume = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setVolumeLevel(Math.min(100, (average / 128) * 100));
    
    animationFrameRef.current = requestAnimationFrame(monitorVolume);
  };

  const handleStartListening = async () => {
    if (!isSupported) {
      // Fallback to audio recording for LLM transcription
      setError('Voice recognition not supported. Using audio recording fallback.');
      await startLLMRecording();
      return;
    }

    setError(null);
    setTranscript('');
    setIsListening(true);
    setShowModal(true);

    if (showVisualizer) {
      await setupAudioVisualizer();
    }

    try {
      await voiceTranscriptionService.startTranscription({
        continuous: false,
        interimResults: true,
        language,
        onInterimResult: (text) => {
          setTranscript(text);
          onInterimTranscription?.(text);
        },
        onFinalResult: (text) => {
          setTranscript(text);
          if (autoSubmit) {
            handleSubmitTranscription(text);
          }
        },
        onError: (errorMessage) => {
          setError(errorMessage);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start voice search');
      setIsListening(false);
      setShowModal(false);
    }
  };

  const handleStopListening = () => {
    const finalText = voiceTranscriptionService.stopTranscription();
    setIsListening(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (finalText) {
      handleSubmitTranscription(finalText);
    } else {
      setShowModal(false);
    }
  };

  const handleCancelListening = () => {
    voiceTranscriptionService.cancelTranscription();
    setIsListening(false);
    setShowModal(false);
    setTranscript('');
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleSubmitTranscription = (text: string) => {
    if (text.trim()) {
      onTranscription(text.trim());
      setShowModal(false);
      setTranscript('');
      
      // Optional: Speak confirmation
      voiceTranscriptionService.speak('Search query submitted');
    }
  };

  // Fallback: Start LLM-based recording
  const startLLMRecording = async () => {
    setIsProcessing(true);
    setShowModal(true);
    
    try {
      await voiceTranscriptionService.startAudioRecording();
      setIsListening(true);
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (isListening) {
          stopLLMRecording();
        }
      }, 10000);
    } catch (error) {
      setError('Failed to start audio recording');
      setIsProcessing(false);
      setShowModal(false);
    }
  };

  // Fallback: Stop LLM-based recording and transcribe
  const stopLLMRecording = async () => {
    setIsListening(false);
    setIsProcessing(true);
    
    try {
      const audioBlob = await voiceTranscriptionService.stopAudioRecording();
      
      if (audioBlob) {
        const result = await voiceTranscriptionService.transcribeWithLLM(audioBlob);
        
        if (result.success && result.text) {
          setTranscript(result.text);
          handleSubmitTranscription(result.text);
        } else {
          setError(result.error || 'Transcription failed');
        }
      }
    } catch (error) {
      setError('Failed to process audio');
    } finally {
      setIsProcessing(false);
      setShowModal(false);
    }
  };

  if (!isSupported && !navigator.mediaDevices) {
    return (
      <button
        disabled
        className={`p-2 text-gray-300 bg-gray-100 rounded-lg cursor-not-allowed ${className}`}
        title="Voice search is not supported in this browser"
      >
        <MicOff className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      {/* Voice Search Button */}
      <button
        onClick={isListening ? handleStopListening : handleStartListening}
        disabled={isProcessing}
        className={`p-2 rounded-lg transition-all ${
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        title={isListening ? 'Stop voice search' : 'Start voice search'}
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isListening ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {/* Voice Search Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Voice Search</h2>
                <button
                  onClick={handleCancelListening}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Visual Feedback */}
              <div className="flex flex-col items-center">
                {isListening ? (
                  <>
                    <div className="relative">
                      {/* Animated rings */}
                      <div className="absolute inset-0 animate-ping">
                        <div className="w-24 h-24 bg-white/20 rounded-full"></div>
                      </div>
                      <div className="absolute inset-0 animate-ping animation-delay-200">
                        <div className="w-24 h-24 bg-white/10 rounded-full"></div>
                      </div>
                      
                      {/* Microphone icon */}
                      <div className="relative w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">
                        <Mic className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    
                    {/* Volume indicator */}
                    {showVisualizer && (
                      <div className="w-full mt-4">
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white transition-all duration-100"
                            style={{ width: `${volumeLevel}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <p className="mt-4 text-white/90">Listening... Speak now</p>
                  </>
                ) : isProcessing ? (
                  <>
                    <Loader2 className="w-16 h-16 animate-spin mb-4" />
                    <p className="text-white/90">Processing your voice...</p>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-white/90">Preparing microphone...</p>
                  </>
                )}
              </div>
            </div>

            {/* Transcript Display */}
            <div className="p-6">
              <div className="min-h-[100px] p-4 bg-gray-50 rounded-lg">
                {transcript ? (
                  <div>
                    <p className="text-gray-800 text-lg">{transcript}</p>
                    {!isListening && !autoSubmit && (
                      <button
                        onClick={() => handleSubmitTranscription(transcript)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Submit Search
                      </button>
                    )}
                  </div>
                ) : error ? (
                  <p className="text-red-600">{error}</p>
                ) : (
                  <p className="text-gray-400 italic">{placeholder}</p>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Speak clearly into your microphone
                </p>
                <p className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Click the button again to stop recording
                </p>
                <p className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  Your search will auto-submit when done
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {isListening ? (
                  <button
                    onClick={handleStopListening}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <MicOff className="w-5 h-5" />
                    Stop Recording
                  </button>
                ) : (
                  <button
                    onClick={handleCancelListening}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceSearchButton;