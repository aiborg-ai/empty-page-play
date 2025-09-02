/**
 * Demo Banner Component
 * Shows when user is in live demo mode
 */

import React, { useState, useEffect } from 'react';
import { X, Clock, Sparkles, ArrowRight, Info } from 'lucide-react';
import { getDemoRemainingTime, endDemoSession } from '@/lib/liveDemoService';

interface DemoBannerProps {
  onUpgrade?: () => void;
}

const DemoBanner: React.FC<DemoBannerProps> = ({ onUpgrade }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [remainingTime, setRemainingTime] = useState(getDemoRemainingTime());
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // Update remaining time every minute
    const interval = setInterval(() => {
      setRemainingTime(getDemoRemainingTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleEndDemo = () => {
    if (confirm('Are you sure you want to end the demo session?')) {
      endDemoSession();
      window.location.href = '/';
    }
  };

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default to register page
      window.location.href = '/#register';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">Live Demo Mode</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-lg">LIVE DEMO MODE</span>
            </div>

            {remainingTime && (
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {remainingTime.hours}h {remainingTime.minutes}m remaining
                </span>
              </div>
            )}
          </div>

          {/* Center Section */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm">
              Exploring InnoSpot with full features • No signup required
            </span>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
              title="Demo information"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpgrade}
              className="bg-white text-purple-600 px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <span>Get Full Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleEndDemo}
              className="text-white/80 hover:text-white transition-colors"
              title="End demo"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="text-white/80 hover:text-white transition-colors"
              title="Minimize banner"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Info Dropdown */}
        {showInfo && (
          <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold mb-2">🎯 Demo Features:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>✅ Full Patent Search</div>
              <div>✅ AI Assistant</div>
              <div>✅ 3D Visualizations</div>
              <div>✅ Analytics Dashboard</div>
              <div>✅ Sample Projects</div>
              <div>✅ Export Reports</div>
              <div>✅ Innovation Tools</div>
              <div>✅ No Login Required</div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-sm opacity-90">
                ⚡ This is a fully functional demo. Your session data is temporary and will expire in {remainingTime?.hours || 0} hours.
                Create a free account to save your work permanently.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoBanner;