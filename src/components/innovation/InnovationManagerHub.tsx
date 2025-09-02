import React, { useState } from 'react';
import { 
  Lightbulb, TrendingUp, Shield, Users, Map, BarChart3, 
  Search, Calculator, DollarSign, Activity, ChevronRight 
} from 'lucide-react';

import InnovationPipelineTracker from './InnovationPipelineTracker';
import CompetitiveIntelligence from './CompetitiveIntelligence';
import IPPortfolioValuation from './IPPortfolioValuation';
import TechnologyConvergence from './TechnologyConvergence';
import InnovationTeamHub from './InnovationTeamHub';
import PatentLandscapeGenerator from './PatentLandscapeGenerator';
import InnovationMetrics from './InnovationMetrics';
import TechnologyScouting from './TechnologyScouting';
import PatentRiskAssessment from './PatentRiskAssessment';
import InnovationBudgetOptimizer from './InnovationBudgetOptimizer';

const InnovationManagerHub: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'pipeline',
      title: 'Innovation Pipeline Tracker',
      description: 'Track innovations from ideation through patent grant',
      icon: Activity,
      color: 'bg-purple-100 text-purple-600',
      component: InnovationPipelineTracker
    },
    {
      id: 'competitive',
      title: 'Competitive Intelligence',
      description: 'Monitor competitor patent activities and trends',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
      component: CompetitiveIntelligence
    },
    {
      id: 'valuation',
      title: 'IP Portfolio Valuation',
      description: 'AI-powered patent portfolio valuation and ROI',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      component: IPPortfolioValuation
    },
    {
      id: 'convergence',
      title: 'Technology Convergence',
      description: 'Visualize technology intersections and opportunities',
      icon: Map,
      color: 'bg-indigo-100 text-indigo-600',
      component: TechnologyConvergence
    },
    {
      id: 'team',
      title: 'Team Collaboration Hub',
      description: 'Collaborative workspace for R&D teams',
      icon: Users,
      color: 'bg-pink-100 text-pink-600',
      component: InnovationTeamHub
    },
    {
      id: 'landscape',
      title: 'Patent Landscape Generator',
      description: 'One-click comprehensive patent reports',
      icon: Map,
      color: 'bg-yellow-100 text-yellow-600',
      component: PatentLandscapeGenerator
    },
    {
      id: 'metrics',
      title: 'Innovation Metrics & KPIs',
      description: 'Track innovation performance metrics',
      icon: BarChart3,
      color: 'bg-cyan-100 text-cyan-600',
      component: InnovationMetrics
    },
    {
      id: 'scouting',
      title: 'Technology Scouting',
      description: 'AI agent for technology discovery',
      icon: Search,
      color: 'bg-orange-100 text-orange-600',
      component: TechnologyScouting
    },
    {
      id: 'risk',
      title: 'Patent Risk Assessment',
      description: 'FTO analysis and infringement risk scoring',
      icon: Shield,
      color: 'bg-red-100 text-red-600',
      component: PatentRiskAssessment
    },
    {
      id: 'budget',
      title: 'Budget Optimizer',
      description: 'AI-powered R&D budget allocation',
      icon: Calculator,
      color: 'bg-emerald-100 text-emerald-600',
      component: InnovationBudgetOptimizer
    }
  ];

  if (activeFeature) {
    const feature = features.find(f => f.id === activeFeature);
    if (feature) {
      const Component = feature.component;
      return (
        <div>
          <div className="px-6 py-4 bg-white shadow-sm">
            <button
              onClick={() => setActiveFeature(null)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              ← Back to Innovation Hub
            </button>
          </div>
          <Component />
        </div>
      );
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Lightbulb className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Innovation Manager Hub</h1>
              <p className="text-gray-600 mt-1">Comprehensive tools for innovation managers and R&D leaders</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Active Innovations</h3>
            <p className="text-3xl font-bold">127</p>
            <p className="text-blue-100 text-sm mt-1">In pipeline</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Patents This Year</h3>
            <p className="text-3xl font-bold">43</p>
            <p className="text-green-100 text-sm mt-1">Filed & granted</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Portfolio Value</h3>
            <p className="text-3xl font-bold">$42M</p>
            <p className="text-purple-100 text-sm mt-1">Total valuation</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Innovation ROI</h3>
            <p className="text-3xl font-bold">385%</p>
            <p className="text-orange-100 text-sm mt-1">Average return</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
                <button className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-800">
                  Open Tool →
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Need Help Getting Started?</h3>
              <p className="text-gray-600 mt-1">
                Our AI assistant can guide you through setting up your innovation management workflow
              </p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Launch Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationManagerHub;