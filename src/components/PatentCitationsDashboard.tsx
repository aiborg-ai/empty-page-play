import { useState } from 'react';
import { 
  HelpCircle,
  ChevronDown,
  Plus,
  BarChart3,
  Save,
  Share,
  Eye,
  X,
  AlertTriangle,
  Table,
  List
} from 'lucide-react';
import ChartConfiguration from './ChartConfiguration';

export default function PatentCitationsDashboard() {
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [currentChartConfig, setCurrentChartConfig] = useState<any>(null);

  const handleChartConfig = (chartType: string, title: string, metric?: string, facet?: string) => {
    setCurrentChartConfig({
      chartType,
      title,
      metric: metric || 'Sum Cited By Patent Count',
      facet: facet || 'Publication Date'
    });
    setConfigModalOpen(true);
  };

  // Sample data matching the screenshots
  const metrics = {
    patentRecords: '165,281,274',
    patentCitations: '482,259,938',
    citesPatents: '53,973,473',
    citedByPatents: '62,754,553',
    simpleFamilies: '93,379,056',
    extendedFamilies: '89,592,640'
  };

  // Generate sample data for charts
  const generateYearlyData = () => {
    const data = [];
    for (let year = 1950; year <= 2025; year++) {
      let value;
      if (year < 1970) {
        value = Math.random() * 500000 + 100000;
      } else if (year < 1990) {
        value = Math.random() * 2000000 + 1000000;
      } else if (year < 2010) {
        value = Math.random() * 8000000 + 4000000;
      } else if (year < 2020) {
        value = Math.random() * 16000000 + 8000000;
      } else {
        value = Math.random() * 10000000 + 5000000;
      }
      data.push({ year, value: Math.floor(value) });
    }
    return data;
  };

  const generateAverageYearlyData = () => {
    const data = [];
    for (let year = 1950; year <= 2025; year++) {
      let value;
      if (year < 1980) {
        value = Math.random() * 2 + 1;
      } else if (year < 2000) {
        value = Math.random() * 4 + 2;
      } else if (year < 2010) {
        value = Math.random() * 2 + 5;
      } else {
        value = Math.random() * 1 + 3;
      }
      data.push({ year, value });
    }
    return data;
  };

  const generateScatterData = () => {
    const data = [];
    for (let i = 0; i < 150; i++) {
      const year = Math.floor(Math.random() * 40) + 1975; // 1975-2015
      let citations;
      if (year < 1990) {
        citations = Math.random() * 8000 + 2000;
      } else if (year < 2005) {
        citations = Math.random() * 12000 + 3000;
      } else {
        citations = Math.random() * 6000 + 2000;
      }
      
      const size = Math.random() * 15 + 5; // Bubble size
      data.push({ year, citations: Math.floor(citations), size });
    }
    return data.sort((a, b) => a.year - b.year);
  };

  const generateHistogramData = () => {
    const data = [];
    for (let i = 0; i <= 2400; i += 100) {
      let count;
      if (i === 0) {
        count = 120000000;
      } else if (i < 200) {
        count = Math.random() * 20000000 + 10000000;
      } else if (i < 600) {
        count = Math.random() * 10000000 + 5000000;
      } else if (i < 1000) {
        count = Math.random() * 5000000 + 2000000;
      } else {
        count = Math.random() * 2000000 + 500000;
      }
      data.push({ range: i, count: Math.floor(count) });
    }
    return data;
  };

  const yearlyData = generateYearlyData();
  const averageYearlyData = generateAverageYearlyData();
  const scatterData = generateScatterData();
  const histogramData = generateHistogramData();

  const TopCitedPatentsChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Top Cited Patents</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Scatter Plot', 'Top Cited Patents', 'Cited By Patent Count', 'Publication Date')}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="relative h-80">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>14,000</span>
          <span>12,000</span>
          <span>10,000</span>
          <span>8,000</span>
          <span>6,000</span>
          <span>4,000</span>
          <span>2,000</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-12 h-full border-l border-b border-gray-200 relative">
          <svg viewBox="0 0 800 300" className="w-full h-full">
            {/* Grid lines */}
            <defs>
              <pattern id="scatter-grid" width="40" height="30" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#scatter-grid)" />
            
            {/* Scatter points */}
            {scatterData.map((point, index) => {
              const x = ((point.year - 1975) / 40) * 800;
              const y = 300 - (point.citations / 14000) * 300;
              return (
                <circle 
                  key={index}
                  cx={x} 
                  cy={y} 
                  r={point.size}
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  stroke="#7c3aed"
                  strokeWidth={1}
                />
              );
            })}
          </svg>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2 ml-12">
          <span>1974</span>
          <span>1976</span>
          <span>1978</span>
          <span>1980</span>
          <span>1982</span>
          <span>1984</span>
          <span>1986</span>
          <span>1988</span>
          <span>1990</span>
          <span>1992</span>
          <span>1994</span>
          <span>1996</span>
          <span>1998</span>
          <span>2000</span>
          <span>2002</span>
          <span>2004</span>
          <span>2006</span>
          <span>2008</span>
          <span>2010</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-4">
        <span className="text-sm text-gray-600">Publication Date</span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-gray-600">
          <strong>Jurisdiction</strong> <strong>Cited By Patent Count</strong>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>US</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-gray-300 rounded"></div>
              <span>0</span>
              <div className="w-6 h-3 bg-gray-400 rounded-full"></div>
              <span>5,000</span>
              <div className="w-8 h-4 bg-gray-600 rounded-full"></div>
              <span>10,000</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded">
        📝 This scatter plot represents the most cited patents for this search. All axis including size and colour can be changed via the chart config. Use your mouse wheel to zoom in and identify interesting scholarly works. Click a circle to view that patent.
      </div>
      
      <div className="mt-2">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  const TotalCitationsChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Total Patent Citations by Year of Publication</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Column Chart', 'Total Patent Citations by Year of Publication', 'Sum Cited By Patent Count', 'Publication Date')}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="relative h-80">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>18,000,000</span>
          <span>16,000,000</span>
          <span>14,000,000</span>
          <span>12,000,000</span>
          <span>10,000,000</span>
          <span>8,000,000</span>
          <span>6,000,000</span>
          <span>4,000,000</span>
          <span>2,000,000</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-16 h-full border-l border-b border-gray-200 relative">
          <svg viewBox="0 0 800 300" className="w-full h-full">
            {/* Grid lines */}
            <defs>
              <pattern id="column-grid" width="10" height="30" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#column-grid)" />
            
            {/* Column chart bars */}
            {yearlyData.map((point, index) => {
              const x = (index / yearlyData.length) * 800;
              const height = (point.value / 18000000) * 300;
              const y = 300 - height;
              return (
                <rect 
                  key={index}
                  x={x} 
                  y={y} 
                  width="10"
                  height={height}
                  fill="#8b5cf6"
                  opacity={0.8}
                />
              );
            })}
          </svg>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2 ml-16">
          <span>1950</span>
          <span>1955</span>
          <span>1960</span>
          <span>1965</span>
          <span>1970</span>
          <span>1975</span>
          <span>1980</span>
          <span>1985</span>
          <span>1990</span>
          <span>1995</span>
          <span>2000</span>
          <span>2005</span>
          <span>2010</span>
          <span>2015</span>
          <span>2020</span>
          <span>2025</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-4">
        <span className="text-sm text-gray-600">Publication Date</span>
      </div>
      
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-800">
          <strong>WARNING:</strong> Years before 1950 are not displayed by default. To show these, change the "Start Year" field in this chart config. 
          <button className="text-blue-600 hover:underline ml-1">Show All</button>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded">
        📝 The chart shows the total patent citations (i.e. the sum of Cited by Patent Count) by year of publication and publication type.
      </div>
      
      <div className="mt-2">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  const AverageCitationsChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Average Patent Citations by Year of Publication</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Column Chart', 'Average Patent Citations by Year of Publication', 'Average Cited By Patent Count', 'Publication Date')}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="relative h-80">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>7</span>
          <span>6</span>
          <span>5</span>
          <span>4</span>
          <span>3</span>
          <span>2</span>
          <span>1</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-8 h-full border-l border-b border-gray-200 relative">
          <svg viewBox="0 0 800 300" className="w-full h-full">
            {/* Grid lines */}
            <defs>
              <pattern id="avg-grid" width="10" height="30" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#avg-grid)" />
            
            {/* Average chart bars */}
            {averageYearlyData.map((point, index) => {
              const x = (index / averageYearlyData.length) * 800;
              const height = (point.value / 7) * 300;
              const y = 300 - height;
              return (
                <rect 
                  key={index}
                  x={x} 
                  y={y} 
                  width="10"
                  height={height}
                  fill="#8b5cf6"
                  opacity={0.8}
                />
              );
            })}
          </svg>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2 ml-8">
          <span>1950</span>
          <span>1955</span>
          <span>1960</span>
          <span>1965</span>
          <span>1970</span>
          <span>1975</span>
          <span>1980</span>
          <span>1985</span>
          <span>1990</span>
          <span>1995</span>
          <span>2000</span>
          <span>2005</span>
          <span>2010</span>
          <span>2015</span>
          <span>2020</span>
          <span>2025</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-4">
        <span className="text-sm text-gray-600">Publication Date</span>
      </div>
      
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-800">
          <strong>WARNING:</strong> Years before 1950 are not displayed by default. To show these, change the "Start Year" field in this chart config. 
          <button className="text-blue-600 hover:underline ml-1">Show All</button>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded">
        📝 The chart shows the total patent citations (i.e. the sum of Cited by Patent Count) by year of publication and publication type.
      </div>
      
      <div className="mt-2">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  const HistogramChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Patent Citation Count Histogram</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Histogram', 'Patent Citation Count Histogram', 'Document Count', 'Cited By Patent Count')}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Top histogram */}
        <div className="relative h-40">
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
            <span>120,000,000</span>
            <span>100,000,000</span>
            <span>80,000,000</span>
            <span>60,000,000</span>
            <span>40,000,000</span>
            <span>20,000,000</span>
            <span>0</span>
          </div>
          
          <div className="ml-20 h-full border-l border-b border-gray-200 relative">
            <svg viewBox="0 0 800 150" className="w-full h-full">
              {histogramData.slice(0, 12).map((point, index) => {
                const x = (index / 12) * 800;
                const height = (point.count / 120000000) * 150;
                const y = 150 - height;
                return (
                  <rect 
                    key={index}
                    x={x} 
                    y={y} 
                    width="60"
                    height={height}
                    fill="#ef4444"
                    opacity={0.8}
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1 ml-20">
            <span>0</span>
            <span>200</span>
            <span>400</span>
            <span>600</span>
            <span>800</span>
            <span>1,000</span>
            <span>1,200</span>
          </div>
        </div>

        {/* Bottom histogram */}
        <div className="relative h-40">
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
            <span>100,000,000</span>
            <span>80,000,000</span>
            <span>60,000,000</span>
            <span>40,000,000</span>
            <span>20,000,000</span>
            <span>0</span>
          </div>
          
          <div className="ml-20 h-full border-l border-b border-gray-200 relative">
            <svg viewBox="0 0 800 150" className="w-full h-full">
              {histogramData.slice(12).map((point, index) => {
                const x = (index / (histogramData.length - 12)) * 800;
                const height = (point.count / 100000000) * 150;
                const y = 150 - height;
                return (
                  <rect 
                    key={index}
                    x={x} 
                    y={y} 
                    width="40"
                    height={height}
                    fill="#ef4444"
                    opacity={0.8}
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1 ml-20">
            <span>1,200</span>
            <span>1,400</span>
            <span>1,600</span>
            <span>1,800</span>
            <span>2,000</span>
            <span>2,200</span>
            <span>2,400</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-4">
        <span className="text-sm text-gray-600">Cited By Patent Count</span>
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-800">
          <strong>Please note:</strong> by default, histograms can appear extremely skewed by outliers (e.g. a single Scholarly Work with 3,200 authors or 10,000+ Citing Papers). To combat this, you can change the Min Doc Count and Bucket Size settings in the chart config. You can also change the Y axis from Count to Scale type and click and drag a selection on the small chart at the bottom to zoom in on that selection.
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded">
        📝 Clicking a bar will append a range clause to your query and allow you to see the exact documents that match that range.
      </div>
      
      <div className="mt-2">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span className="text-blue-600">DASHBOARD</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600">📈</span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Patent Citations</h1>
          <div className="flex items-center gap-2 ml-4">
            <button className="text-red-600 hover:text-red-700">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50">
              🔍 Hide Query Details
            </button>
            <button className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50">
              📝 Edit Search
            </button>
            <button className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50">
              🔍 Search Scholar
            </button>
          </div>
        </div>

        {/* Patent Stats */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-gray-700">Patents</span>
              <span className="text-lg text-blue-600">({metrics.patentRecords})</span>
            </div>
            <span className="text-gray-400">=</span>
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-600">All Docs</span>
            </div>
          </div>

          {/* Filters Applied */}
          <div className="mb-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Filters:</span> No filters applied
            </div>
          </div>

          {/* Statistics Row */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            <div className="text-center">
              <div className="text-blue-600 text-sm font-medium mb-1">Patent Records</div>
              <div className="text-2xl font-bold text-gray-900">{metrics.patentRecords}</div>
            </div>
            <div className="text-center">
              <div className="text-teal-600 text-sm font-medium mb-1">Patent Citations</div>
              <div className="text-2xl font-bold text-gray-900">{metrics.patentCitations}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Cites Patents</div>
              <div className="text-2xl font-bold text-gray-900">{metrics.citesPatents}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Cited By Patents</div>
              <div className="text-2xl font-bold text-gray-900">{metrics.citedByPatents}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Simple Families</div>
              <div className="text-2xl font-bold text-gray-900">{metrics.simpleFamilies}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Extended Families</div>
              <div className="text-2xl font-bold text-gray-900">{metrics.extendedFamilies}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-4">
            <button className="px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-500">
              Patents
            </button>
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
              Explore Citations
              <ChevronDown className="w-4 h-4 inline ml-1" />
            </button>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              <Table className="w-4 h-4" />
              Table
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              <List className="w-4 h-4" />
              List
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 border border-blue-200 rounded">
              <BarChart3 className="w-4 h-4" />
              Analysis
            </button>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
            <Plus className="w-4 h-4" />
            Add New Chart
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
            <BarChart3 className="w-4 h-4" />
            New Dashboard
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
            <Save className="w-4 h-4" />
            Save Dashboard
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
            <Share className="w-4 h-4" />
            Share Dashboard
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
            <BarChart3 className="w-4 h-4" />
            Single Column
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
            <Eye className="w-4 h-4" />
            Presentation Mode
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
            <HelpCircle className="w-4 h-4" />
            Help
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
            <X className="w-4 h-4" />
            Clear All
          </button>
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">
          {/* Top Row - Scatter Plot and Bar Chart */}
          <div className="grid grid-cols-2 gap-6">
            <TopCitedPatentsChart />
            <TotalCitationsChart />
          </div>
          
          {/* Bottom Row - Average Chart and Histogram */}
          <div className="grid grid-cols-2 gap-6">
            <AverageCitationsChart />
            <HistogramChart />
          </div>
        </div>
      </div>

      {/* Chart Configuration Modal */}
      <ChartConfiguration 
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        initialConfig={currentChartConfig}
        onSave={(config) => {
          console.log('Chart configuration saved:', config);
          // Here you would typically update the chart with the new configuration
        }}
      />
    </div>
  );
}