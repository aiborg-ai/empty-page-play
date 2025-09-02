/**
 * Camera Capture Component
 * Provides camera access for document scanning and image capture
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Camera, X, RotateCcw, Zap, ZapOff, ScanText, FileImage
} from 'lucide-react';

// Extend MediaTrackCapabilities for experimental features
interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
  zoom?: {
    min: number;
    max: number;
    step: number;
  };
}

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  mode?: 'photo' | 'document';
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  className?: string;
}

interface CameraConstraints {
  video: {
    width?: { ideal: number };
    height?: { ideal: number };
    aspectRatio?: number;
    facingMode?: 'user' | 'environment';
    focusMode?: 'continuous' | 'single-shot' | 'manual';
    exposureMode?: 'continuous' | 'single-shot' | 'manual';
    whiteBalanceMode?: 'continuous' | 'single-shot' | 'manual';
  };
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
  mode = 'photo',
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8,
  className = '',
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [_capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      const constraints: CameraConstraints = {
        video: {
          width: { ideal: maxWidth },
          height: { ideal: maxHeight },
          facingMode,
          focusMode: 'continuous',
          exposureMode: 'continuous',
          whiteBalanceMode: 'continuous',
        }
      };

      // For document mode, prefer higher resolution and better focus
      if (mode === 'document') {
        constraints.video.width = { ideal: 1920 };
        constraints.video.height = { ideal: 1080 };
        constraints.video.focusMode = 'single-shot';
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Get available capabilities
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as ExtendedMediaTrackCapabilities;
      
      if (capabilities.torch) {
        // Flash/torch is available
        console.log('Flash available');
      }
      
      if (capabilities.zoom) {
        console.log('Zoom available:', capabilities.zoom);
      }

    } catch (err: any) {
      console.error('Failed to access camera:', err);
      setError(getErrorMessage(err));
    }
  }, [facingMode, maxWidth, maxHeight, mode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const getErrorMessage = (error: any): string => {
    switch (error.name) {
      case 'NotAllowedError':
        return 'Camera access denied. Please allow camera permissions.';
      case 'NotFoundError':
        return 'No camera found on this device.';
      case 'NotReadableError':
        return 'Camera is already in use by another application.';
      case 'OverconstrainedError':
        return 'Camera constraints not supported.';
      default:
        return 'Failed to access camera. Please try again.';
    }
  };

  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    setIsProcessing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context not available');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Apply document processing if in document mode
      if (mode === 'document') {
        await enhanceDocumentImage(ctx, canvas);
      }

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create image blob'));
          },
          'image/jpeg',
          quality
        );
      });

      // Create file
      const file = new File([blob], `capture-${Date.now()}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      // Store captured image for preview
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      // Trigger haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }

      onCapture(file);

    } catch (error) {
      console.error('Failed to capture image:', error);
      setError('Failed to capture image');
    } finally {
      setIsCapturing(false);
      setIsProcessing(false);
    }
  }, [mode, quality, onCapture]);

  const enhanceDocumentImage = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Basic document enhancement (increase contrast, adjust brightness)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast and brightness for better text readability
      // const _avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // Unused - average calculation for potential grayscale conversion
      const contrast = 1.2;
      const brightness = 10;
      
      data[i] = Math.min(255, Math.max(0, contrast * (data[i] - 128) + 128 + brightness));
      data[i + 1] = Math.min(255, Math.max(0, contrast * (data[i + 1] - 128) + 128 + brightness));
      data[i + 2] = Math.min(255, Math.max(0, contrast * (data[i + 2] - 128) + 128 + brightness));
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const toggleFlash = useCallback(async () => {
    if (!stream) return;

    try {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as ExtendedMediaTrackCapabilities;
      
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !flashEnabled } as any]
        });
        setFlashEnabled(!flashEnabled);
      }
    } catch (error) {
      console.error('Failed to toggle flash:', error);
    }
  }, [stream, flashEnabled]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const handleZoom = useCallback(async (delta: number) => {
    if (!stream) return;

    try {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as ExtendedMediaTrackCapabilities;
      
      if (capabilities.zoom) {
        const newZoom = Math.min(capabilities.zoom.max, Math.max(capabilities.zoom.min, zoomLevel + delta));
        await track.applyConstraints({
          advanced: [{ zoom: newZoom } as any]
        });
        setZoomLevel(newZoom);
      }
    } catch (error) {
      console.error('Failed to adjust zoom:', error);
    }
  }, [stream, zoomLevel]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onCapture(file);
    }
  };

  // const _retakePhoto = () => { // Unused - retake functionality handled elsewhere
  //   setCapturedImage(null);
  // };

  if (error) {
    return (
      <div className={`fixed inset-0 bg-black flex items-center justify-center z-50 ${className}`}>
        <div className="bg-white rounded-xl p-6 m-4 max-w-sm text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={startCamera}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
            >
              Upload from Gallery
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black z-50 flex flex-col ${className}`}>
      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {stream && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />
        )}

        {/* Overlay for document mode */}
        {mode === 'document' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-white border-dashed rounded-lg w-80 h-60 opacity-50">
              <div className="w-full h-full flex items-center justify-center">
                <ScanText className="w-12 h-12 text-white opacity-75" />
              </div>
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            {stream && (
              <>
                <button
                  onClick={toggleFlash}
                  className={`p-3 rounded-full hover:bg-opacity-70 ${
                    flashEnabled ? 'bg-yellow-500 text-white' : 'bg-black bg-opacity-50 text-white'
                  }`}
                >
                  {flashEnabled ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={switchCamera}
                  className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-8 left-4 right-4">
          <div className="flex items-center justify-center gap-8">
            {/* Gallery Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
            >
              <FileImage className="w-6 h-6" />
            </button>

            {/* Capture Button */}
            <button
              onClick={captureImage}
              disabled={isCapturing || isProcessing || !stream}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </button>

            {/* Mode Toggle */}
            <div className="p-4 bg-black bg-opacity-50 text-white rounded-full">
              <div className="w-6 h-6 flex items-center justify-center">
                {mode === 'document' ? <ScanText className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
              </div>
            </div>
          </div>

          {/* Mode Label */}
          <div className="text-center mt-2">
            <span className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
              {mode === 'document' ? 'Document Scanner' : 'Photo Mode'}
            </span>
          </div>
        </div>

        {/* Zoom Controls */}
        {zoomLevel > 1 && (
          <div className="absolute bottom-32 right-4 flex flex-col gap-2">
            <button
              onClick={() => handleZoom(0.5)}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full text-sm"
            >
              +
            </button>
            <div className="text-white text-xs text-center bg-black bg-opacity-50 px-2 py-1 rounded-full">
              {zoomLevel.toFixed(1)}x
            </div>
            <button
              onClick={() => handleZoom(-0.5)}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full text-sm"
            >
              -
            </button>
          </div>
        )}
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Hidden file input for gallery upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default CameraCapture;