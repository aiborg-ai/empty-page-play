import React from 'react';
import { Circle } from 'lucide-react';

interface PortfolioBubbleChartProps {
  data: Record<string, any>;
  step?: number;
}

const PortfolioBubbleChart: React.FC<PortfolioBubbleChartProps> = ({ data }) => {
  const portfolioData = data?.portfolio || [
    { id: 'P1', name: 'Core Algorithm Patent', value: 85, cost: 12, revenue: 450, size: 'large', category: 'Essential' },
    { id: 'P2', name: 'User Interface Design', value: 65, cost: 8, revenue: 120, size: 'medium', category: 'Strategic' },
    { id: 'P3', name: 'Data Processing Method', value: 45, cost: 15, revenue: 80, size: 'small', category: 'Optional' },
    { id: 'P4', name: 'Security Protocol', value: 75, cost: 10, revenue: 220, size: 'medium', category: 'Essential' },
    { id: 'P5', name: 'Machine Learning Model', value: 90, cost: 5, revenue: 380, size: 'large', category: 'Strategic' }
  ];

  const getBubbleColor = (category: string) => {
    switch(category) {
      case 'Essential': return 'bg-blue-500';
      case 'Strategic': return 'bg-green-500';
      case 'Optional': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getBubbleSize = (size: string) => {
    switch(size) {
      case 'large': return 'w-20 h-20';
      case 'medium': return 'w-14 h-14';
      case 'small': return 'w-10 h-10';
      default: return 'w-12 h-12';
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-gray-900">{portfolioData.length}</div>
          <div className="text-xs text-gray-600">Patents</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">
            ${portfolioData.reduce((sum: number, p: any) => sum + p.revenue, 0)}k
          </div>
          <div className="text-xs text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-red-600">
            ${portfolioData.reduce((sum: number, p: any) => sum + p.cost, 0)}k
          </div>
          <div className="text-xs text-gray-600">Total Cost</div>
        </div>
      </div>

      {/* Bubble Chart Area */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 h-64">
        {/* Axes */}
        <div className="absolute bottom-5 left-5 right-5 border-b border-gray-400"></div>
        <div className="absolute top-5 bottom-5 left-5 border-l border-gray-400"></div>
        
        {/* Axis Labels */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
          Value →
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-600">
          Cost →
        </div>

        {/* Bubbles */}
        <div className="absolute inset-6">
          {portfolioData.map((patent: any, _index: number) => (
            <div
              key={patent.id}
              className={`absolute ${getBubbleSize(patent.size)} ${getBubbleColor(patent.category)} 
                rounded-full opacity-70 hover:opacity-100 transition-all duration-200 cursor-pointer
                flex items-center justify-center text-white font-bold group`}
              style={{
                left: `${(patent.value / 100) * 80}%`,
                bottom: `${(1 - patent.cost / 20) * 80}%`,
                transform: 'translate(-50%, 50%)'
              }}
            >
              <span className="text-xs">{patent.id}</span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap">
                  <div className="font-semibold">{patent.name}</div>
                  <div className="text-gray-300">Value: {patent.value}/100</div>
                  <div className="text-gray-300">Cost: ${patent.cost}k/year</div>
                  <div className="text-gray-300">Revenue: ${patent.revenue}k</div>
                  <div className="text-gray-300">Category: {patent.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quadrant Labels */}
        <div className="absolute top-8 right-8 text-xs text-gray-500">High Value, Low Cost</div>
        <div className="absolute bottom-8 right-8 text-xs text-gray-500">High Value, High Cost</div>
        <div className="absolute top-8 left-8 text-xs text-gray-500">Low Value, Low Cost</div>
        <div className="absolute bottom-8 left-8 text-xs text-gray-500">Low Value, High Cost</div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Essential</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Strategic</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Optional</span>
        </div>
      </div>

      {/* Patent List */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700">Portfolio Details</h4>
        {portfolioData
          .sort((a: any, b: any) => b.value - a.value)
          .map((patent: any) => (
            <div key={patent.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Circle className={`w-3 h-3 ${getBubbleColor(patent.category).replace('bg-', 'text-')}`} fill="currentColor" />
                <span className="text-sm font-medium">{patent.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-600">Value: {patent.value}</span>
                <span className="text-green-600">+${patent.revenue}k</span>
                <span className="text-red-600">-${patent.cost}k</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PortfolioBubbleChart;