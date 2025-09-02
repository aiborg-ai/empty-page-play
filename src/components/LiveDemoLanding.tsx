/**
 * Live Demo Landing Component
 * One-click demo access for prospects
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Shield, 
  Zap, 
  Globe,
  Brain,
  BarChart3,
  Search,
  FileText,
  Users,
  CheckCircle
} from 'lucide-react';
import { startLiveDemo } from '@/lib/liveDemoService';

interface LiveDemoLandingProps {
  onDemoStart?: () => void;
}

const LiveDemoLanding: React.FC<LiveDemoLandingProps> = ({ onDemoStart }) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartDemo = async () => {
    setIsStarting(true);
    
    // Start demo session
    startLiveDemo();
    
    // Small delay for animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Callback or redirect
    if (onDemoStart) {
      onDemoStart();
    } else {
      // Reload to dashboard
      window.location.href = '/#dashboard';
    }
  };

  const features = [
    { icon: Search, label: 'Patent Search', description: 'Search millions of patents' },
    { icon: Brain, label: 'AI Assistant', description: 'Smart analysis & insights' },
    { icon: Globe, label: '3D Visualizations', description: 'Interactive patent maps' },
    { icon: BarChart3, label: 'Analytics', description: 'Competitive intelligence' },
    { icon: FileText, label: 'Reports', description: 'Export-ready documents' },
    { icon: Users, label: 'Collaboration', description: 'Team workspace tools' }
  ];

  const benefits = [
    'No credit card required',
    'No signup or login needed',
    'Full feature access for 24 hours',
    'Real patent data (sample set)',
    'Export & download enabled',
    'All AI features included'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Live Demo - No Signup Required</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Experience InnoSpot
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Instantly
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore the full power of our patent intelligence platform. 
            No signup, no credit card, just click and start.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStartDemo}
            disabled={isStarting}
            className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Starting Demo...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Zap className="w-5 h-5" />
                Start Live Demo Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>

          {/* Timer Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">24-hour full access • No restrictions</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What's Included in the Demo
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.label}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="flex items-start gap-6">
              <Shield className="w-12 h-12 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Zero Commitment Demo
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Click "Start Live Demo"
                </h3>
                <p className="text-gray-600">
                  No forms, no emails, no passwords. Just one click.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Explore Everything
                </h3>
                <p className="text-gray-600">
                  Full access to all features for 24 hours. Search patents, use AI tools, create reports.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Upgrade Anytime
                </h3>
                <p className="text-gray-600">
                  Love what you see? Create an account to save your work and continue with full access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Explore?
        </h2>
        <button
          onClick={handleStartDemo}
          disabled={isStarting}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50"
        >
          <span className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            Start Your Free Demo Now
            <ArrowRight className="w-5 h-5" />
          </span>
        </button>
        <p className="mt-4 text-sm text-gray-600">
          No credit card • No signup • Start in seconds
        </p>
      </div>
    </div>
  );
};

export default LiveDemoLanding;