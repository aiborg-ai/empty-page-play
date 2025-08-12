import React from 'react';
import { TrendingUp, Calendar, FileText } from 'lucide-react';

interface PriorArtTimelineProps {
  data: Record<string, any>;
  step?: number;
}

const PriorArtTimeline: React.FC<PriorArtTimelineProps> = ({ data }) => {
  // Demo data - in production, this would come from the data prop
  const timelineData = data?.priorArtTimeline || [
    { year: 2019, patents: 12, keyPatent: 'US10234567', title: 'Base Technology Framework' },
    { year: 2020, patents: 18, keyPatent: 'EP3456789', title: 'Enhanced Processing Method' },
    { year: 2021, patents: 25, keyPatent: 'CN9876543', title: 'Optimization Algorithm' },
    { year: 2022, patents: 32, keyPatent: 'US11234567', title: 'Advanced Implementation' },
    { year: 2023, patents: 28, keyPatent: 'WO2023/123456', title: 'Novel Application Method' },
    { year: 2024, patents: 35, keyPatent: 'US12345678', title: 'Latest Innovation' }
  ];

  const maxPatents = Math.max(...timelineData.map(d => d.patents));
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {timelineData.reduce((sum, d) => sum + d.patents, 0)}
          </div>
          <div className="text-xs text-gray-600">Total Prior Art</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {timelineData[timelineData.length - 1].year}
          </div>
          <div className="text-xs text-gray-600">Latest Filing</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            +{Math.round(((timelineData[timelineData.length - 1].patents - timelineData[0].patents) / timelineData[0].patents) * 100)}%
          </div>
          <div className="text-xs text-gray-600">Growth Trend</div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute -left-2 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxPatents}</span>
          <span>{Math.round(maxPatents / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-6 relative h-48 border-l border-b border-gray-300">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map(percent => (
              <div
                key={percent}
                className="absolute w-full border-t border-gray-100"
                style={{ bottom: `${percent}%` }}
              />
            ))}
          </div>

          {/* Data bars */}
          <div className="absolute inset-0 flex items-end justify-between px-2">
            {timelineData.map((item, index) => {
              const height = (item.patents / maxPatents) * 100;
              const isCurrentYear = item.year === currentYear;
              const isHighGrowth = index > 0 && item.patents > timelineData[index - 1].patents;
              
              return (
                <div key={item.year} className="relative group flex-1 mx-1">
                  {/* Bar */}
                  <div className="relative">
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isCurrentYear 
                          ? 'bg-gradient-to-t from-blue-600 to-blue-400' 
                          : isHighGrowth
                            ? 'bg-gradient-to-t from-green-500 to-green-400'
                            : 'bg-gradient-to-t from-gray-400 to-gray-300'
                      } hover:opacity-80`}
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    >
                      {/* Value label */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-semibold text-gray-700">{item.patents}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap">
                      <div className="font-semibold">{item.keyPatent}</div>
                      <div className="text-gray-300">{item.title}</div>
                      <div className="text-gray-400 mt-1">{item.patents} patents filed</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
            {timelineData.map(item => (
              <div key={item.year} className="flex-1 text-center">
                <span className="text-xs text-gray-600">{item.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Patents Section */}
      <div className="mt-8 space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Key Prior Art References
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {timelineData.slice(-3).reverse().map(item => (
            <div key={item.keyPatent} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-900">{item.keyPatent}</span>
                <span className="text-xs text-gray-600">{item.title}</span>
              </div>
              <span className="text-xs text-gray-500">{item.year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">Trend Analysis</span>
        </div>
        <p className="text-xs text-gray-600">
          Prior art activity has increased by {Math.round(((timelineData[timelineData.length - 1].patents - timelineData[timelineData.length - 2].patents) / timelineData[timelineData.length - 2].patents) * 100)}% in the last year, 
          indicating a highly active technology area. Consider expedited filing to establish priority.
        </p>
      </div>
    </div>
  );
};

export default PriorArtTimeline;