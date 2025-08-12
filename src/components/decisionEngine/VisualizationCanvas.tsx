import React from 'react';
import { TrendingUp, BarChart3, PieChart, Activity, Map, Grid3x3 } from 'lucide-react';
import { VisualizationType } from '../../types/aiAgentBuilder';

// Dynamic imports for visualization components
import NoveltyScoreGauge from '../visualizations/NoveltyScoreGauge';
import PriorArtTimeline from '../visualizations/PriorArtTimeline';
import RiskHeatmap from '../visualizations/RiskHeatmap';
import WorldMapCoverage from '../visualizations/WorldMapCoverage';
import PortfolioBubbleChart from '../visualizations/PortfolioBubbleChart';

interface VisualizationCanvasProps {
  step: number;
  data: Record<string, any>;
  visualizations: VisualizationType[];
  className?: string;
}

const visualizationComponents: Record<VisualizationType, React.ComponentType<any>> = {
  'novelty_score_gauge': NoveltyScoreGauge,
  'prior_art_timeline': PriorArtTimeline,
  'risk_heatmap': RiskHeatmap,
  'world_map_coverage': WorldMapCoverage,
  'portfolio_bubble_chart': PortfolioBubbleChart,
  'technology_radar': () => <PlaceholderVisualization type="technology_radar" />,
  'priority_matrix': () => <PlaceholderVisualization type="priority_matrix" />,
  'similarity_spectrum': () => <PlaceholderVisualization type="similarity_spectrum" />,
  'cost_timeline': () => <PlaceholderVisualization type="cost_timeline" />,
  'roi_projection': () => <PlaceholderVisualization type="roi_projection" />,
  'examiner_stats': () => <PlaceholderVisualization type="examiner_stats" />,
  'success_probability': () => <PlaceholderVisualization type="success_probability" />,
  'strategic_heatmap': () => <PlaceholderVisualization type="strategic_heatmap" />
};

const visualizationIcons: Record<VisualizationType, React.ComponentType<any>> = {
  'novelty_score_gauge': PieChart,
  'prior_art_timeline': TrendingUp,
  'risk_heatmap': Grid3x3,
  'world_map_coverage': Map,
  'portfolio_bubble_chart': Activity,
  'technology_radar': Activity,
  'priority_matrix': Grid3x3,
  'similarity_spectrum': BarChart3,
  'cost_timeline': TrendingUp,
  'roi_projection': TrendingUp,
  'examiner_stats': BarChart3,
  'success_probability': PieChart,
  'strategic_heatmap': Grid3x3
};

const PlaceholderVisualization: React.FC<{ type: string }> = ({ type }) => (
  <div className="bg-gray-50 rounded-lg p-8 text-center">
    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
      <BarChart3 className="w-8 h-8 text-gray-400" />
    </div>
    <h4 className="text-sm font-medium text-gray-700 mb-2">
      {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </h4>
    <p className="text-xs text-gray-500">Visualization will be displayed here</p>
  </div>
);

export const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({
  step,
  data,
  visualizations,
  className = ''
}) => {
  if (!visualizations || visualizations.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Insights & Analytics</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">
            Visualizations will appear as you progress through the decision steps
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {visualizations.map((vizType, index) => {
        const Component = visualizationComponents[vizType];
        const Icon = visualizationIcons[vizType] || BarChart3;
        
        if (!Component) {
          return (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {vizType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h3>
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
              <PlaceholderVisualization type={vizType} />
            </div>
          );
        }
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {getVisualizationTitle(vizType)}
              </h3>
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <Component data={data} step={step} />
          </div>
        );
      })}

      {/* Real-time Insights Panel */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Real-time Insights</h4>
        <div className="space-y-2">
          <InsightItem 
            label="Data Points Analyzed" 
            value={Object.keys(data).length * 10} 
            trend="up"
          />
          <InsightItem 
            label="Confidence Level" 
            value={calculateConfidence(data)} 
            unit="%"
            trend={calculateConfidence(data) > 70 ? 'up' : 'neutral'}
          />
          <InsightItem 
            label="Processing Time" 
            value="< 2s" 
            trend="neutral"
          />
        </div>
      </div>
    </div>
  );
};

const InsightItem: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ label, value, unit, trend = 'neutral' }) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${trendColors[trend]}`}>
        {value}{unit}
      </span>
    </div>
  );
};

const getVisualizationTitle = (vizType: VisualizationType): string => {
  const titles: Record<VisualizationType, string> = {
    'novelty_score_gauge': 'Novelty Assessment',
    'prior_art_timeline': 'Prior Art Timeline',
    'risk_heatmap': 'Risk Assessment Matrix',
    'world_map_coverage': 'Geographic Coverage',
    'portfolio_bubble_chart': 'Portfolio Analysis',
    'technology_radar': 'Technology Landscape',
    'priority_matrix': 'Priority Matrix',
    'similarity_spectrum': 'Similarity Analysis',
    'cost_timeline': 'Cost Projection',
    'roi_projection': 'ROI Analysis',
    'examiner_stats': 'Examiner Statistics',
    'success_probability': 'Success Probability',
    'strategic_heatmap': 'Strategic Assessment'
  };
  
  return titles[vizType] || vizType.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const calculateConfidence = (data: Record<string, any>): number => {
  // Simple confidence calculation based on data completeness
  const totalFields = 10; // Expected fields
  const filledFields = Object.values(data).filter(v => v !== null && v !== undefined && v !== '').length;
  return Math.round((filledFields / totalFields) * 100);
};

export default VisualizationCanvas;