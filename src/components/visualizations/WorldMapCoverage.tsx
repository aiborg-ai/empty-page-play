import React from 'react';
import { MapPin, Globe } from 'lucide-react';

interface WorldMapCoverageProps {
  data: Record<string, any>;
  step?: number;
}

const WorldMapCoverage: React.FC<WorldMapCoverageProps> = ({ data }) => {
  const coverage = data?.coverage || [
    { region: 'United States', recommended: true, priority: 'High', cost: 15000, timeline: '12-18 months', marketSize: 'Large' },
    { region: 'European Union', recommended: true, priority: 'High', cost: 12000, timeline: '18-24 months', marketSize: 'Large' },
    { region: 'China', recommended: true, priority: 'Medium', cost: 8000, timeline: '24-30 months', marketSize: 'Large' },
    { region: 'Japan', recommended: false, priority: 'Low', cost: 10000, timeline: '18-24 months', marketSize: 'Medium' },
    { region: 'South Korea', recommended: false, priority: 'Low', cost: 7000, timeline: '12-18 months', marketSize: 'Small' },
    { region: 'Canada', recommended: true, priority: 'Medium', cost: 5000, timeline: '12-18 months', marketSize: 'Medium' }
  ];

  const totalCost = coverage.filter((c: any) => c.recommended).reduce((sum: number, c: any) => sum + c.cost, 0);
  const recommendedCount = coverage.filter((c: any) => c.recommended).length;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <Globe className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{recommendedCount}</div>
          <div className="text-xs text-gray-600">Jurisdictions</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">${(totalCost / 1000).toFixed(0)}k</div>
          <div className="text-xs text-gray-600">Total Cost</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-purple-600">18-24</div>
          <div className="text-xs text-gray-600">Months</div>
        </div>
      </div>

      {/* World Map Placeholder */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
        <Globe className="w-16 h-16 text-blue-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600">Interactive World Map</p>
        <p className="text-xs text-gray-500 mt-1">Recommended filing jurisdictions highlighted</p>
      </div>

      {/* Jurisdiction List */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700">Filing Strategy by Region</h4>
        {coverage.map((region: any, index: number) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-3 rounded-lg border ${
              region.recommended 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className={`w-4 h-4 ${region.recommended ? 'text-blue-600' : 'text-gray-400'}`} />
              <div>
                <div className="font-medium text-sm text-gray-900">{region.region}</div>
                <div className="text-xs text-gray-600">Market: {region.marketSize}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">${(region.cost / 1000).toFixed(0)}k</div>
              <div className="text-xs text-gray-600">{region.timeline}</div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              region.priority === 'High' ? 'bg-red-100 text-red-700' :
              region.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {region.priority}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldMapCoverage;