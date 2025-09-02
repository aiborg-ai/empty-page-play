/**
 * Web Share API Component
 * Provides native sharing capabilities for mobile devices
 */

import React, { useState } from 'react';
import { Share2, Copy, Mail, MessageCircle, Download, ExternalLink } from 'lucide-react';

export interface ShareData {
  title: string;
  text: string;
  url: string;
  files?: File[];
}

interface WebShareAPIProps {
  data: ShareData;
  children?: React.ReactNode;
  fallbackEnabled?: boolean;
  className?: string;
  onShare?: (method: string) => void;
}

interface ShareMethod {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  available: boolean;
}

const WebShareAPI: React.FC<WebShareAPIProps> = ({
  data,
  children,
  fallbackEnabled = true,
  className = '',
  onShare,
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [copying, setCopying] = useState(false);

  // Check if Web Share API is supported
  const isWebShareSupported = () => {
    return 'share' in navigator && 
           'canShare' in navigator && 
           navigator.canShare(data);
  };

  // Handle native share
  const handleNativeShare = async () => {
    if (!isWebShareSupported()) {
      if (fallbackEnabled) {
        setShowFallback(true);
      }
      return;
    }

    try {
      await navigator.share(data);
      onShare?.('native');
      console.log('Content shared successfully');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Share was cancelled');
      } else {
        console.error('Error sharing:', error);
        if (fallbackEnabled) {
          setShowFallback(true);
        }
      }
    }
  };

  // Fallback share methods
  const shareMethods: ShareMethod[] = [
    {
      name: 'Copy Link',
      icon: Copy,
      available: 'clipboard' in navigator,
      action: async () => {
        setCopying(true);
        try {
          const textToShare = `${data.title}\n${data.text}\n${data.url}`;
          await navigator.clipboard.writeText(textToShare);
          onShare?.('clipboard');
          setShowFallback(false);
          
          // Show temporary success feedback
          setTimeout(() => setCopying(false), 2000);
        } catch (error) {
          console.error('Failed to copy to clipboard:', error);
          setCopying(false);
        }
      },
    },
    {
      name: 'Email',
      icon: Mail,
      available: true,
      action: () => {
        const subject = encodeURIComponent(data.title);
        const body = encodeURIComponent(`${data.text}\n\n${data.url}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
        onShare?.('email');
        setShowFallback(false);
      },
    },
    {
      name: 'SMS',
      icon: MessageCircle,
      available: true,
      action: () => {
        const message = encodeURIComponent(`${data.title}\n${data.text}\n${data.url}`);
        window.open(`sms:?body=${message}`);
        onShare?.('sms');
        setShowFallback(false);
      },
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      available: true,
      action: () => {
        const message = encodeURIComponent(`${data.title}\n${data.text}\n${data.url}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
        onShare?.('whatsapp');
        setShowFallback(false);
      },
    },
    {
      name: 'Twitter',
      icon: ExternalLink,
      available: true,
      action: () => {
        const text = encodeURIComponent(`${data.text}`);
        const url = encodeURIComponent(data.url);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        onShare?.('twitter');
        setShowFallback(false);
      },
    },
    {
      name: 'LinkedIn',
      icon: ExternalLink,
      available: true,
      action: () => {
        const url = encodeURIComponent(data.url);
        const title = encodeURIComponent(data.title);
        const summary = encodeURIComponent(data.text);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
        onShare?.('linkedin');
        setShowFallback(false);
      },
    },
  ];

  // Download data as file (if files are provided)
  const handleDownload = () => {
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      onShare?.('download');
    }
  };

  const ShareButton: React.FC = () => (
    <button
      onClick={handleNativeShare}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors ${className}`}
    >
      <Share2 className="w-4 h-4" />
      {children || 'Share'}
    </button>
  );

  if (!showFallback) {
    return <ShareButton />;
  }

  return (
    <>
      <ShareButton />
      
      {/* Fallback Share Modal */}
      {showFallback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 sm:items-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Share</h3>
              <button
                onClick={() => setShowFallback(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 truncate">{data.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{data.text}</p>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">{data.url}</span>
                </div>
              </div>
            </div>

            {/* Share Methods */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {shareMethods.filter(method => method.available).map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <button
                      key={method.name}
                      onClick={method.action}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center">
                        {method.name === 'Copy Link' && copying ? 'Copied!' : method.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Download Option (if files are available) */}
              {data.files && data.files.length > 0 && (
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Files ({data.files.length})</span>
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Quick share options available</span>
                <div className="flex items-center gap-2">
                  {isWebShareSupported() && (
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Native sharing enabled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Hook for using Web Share API
export const useWebShare = () => {
  const [isSupported, setIsSupported] = useState(false);

  React.useEffect(() => {
    setIsSupported('share' in navigator);
  }, []);

  const share = async (data: ShareData): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    try {
      if (navigator.canShare && !navigator.canShare(data)) {
        return false;
      }

      await navigator.share(data);
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled sharing
        return false;
      }
      throw error;
    }
  };

  return {
    isSupported,
    share,
  };
};

// Utility functions for common share scenarios
export const sharePatent = (patent: {
  title: string;
  publicationNumber: string;
  url: string;
}) => {
  return {
    title: `Patent: ${patent.title}`,
    text: `Check out this patent: ${patent.publicationNumber}`,
    url: patent.url,
  };
};

export const shareProject = (project: {
  name: string;
  description: string;
  url: string;
}) => {
  return {
    title: `InnoSpot Project: ${project.name}`,
    text: project.description,
    url: project.url,
  };
};

export const shareDashboard = (dashboard: {
  title: string;
  description: string;
  url: string;
}) => {
  return {
    title: `Dashboard: ${dashboard.title}`,
    text: `View this innovation dashboard: ${dashboard.description}`,
    url: dashboard.url,
  };
};

export default WebShareAPI;