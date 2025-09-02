import { useState } from 'react';
import { 
  X, 
  Search, 
  ChevronDown, 
  BarChart,
  BarChart3,
  PieChart,
  Calendar,
  Grid3X3,
  HelpCircle,
  Download,
  Info
} from 'lucide-react';

interface ChartConfigurationProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: any;
  onSave?: (config: any) => void;
}

export default function ChartConfiguration({ isOpen, onClose, initialConfig, onSave }: ChartConfigurationProps) {
  const [activeTab, setActiveTab] = useState('Configuration');
  const [selectedChartType, setSelectedChartType] = useState('Bar Chart');
  const [chartTitle, setChartTitle] = useState(initialConfig?.title || 'Top Inventors by Patent Citations');
  const [metric, setMetric] = useState(initialConfig?.metric || 'Sum Cited By Patent Count');
  const [facet, setFacet] = useState(initialConfig?.facet || 'Inventor Name Exact');
  const [height, setHeight] = useState(initialConfig?.height || '800');
  const [orderBy, setOrderBy] = useState(initialConfig?.orderBy || 'Sum Cited By Patent Count');
  const [limit, setLimit] = useState(initialConfig?.limit || '10');
  const [scale, setScale] = useState(initialConfig?.scale || 'Linear');
  const [colorScheme, setColorScheme] = useState(initialConfig?.colorScheme || 'greens');
  const [solidBars, setSolidBars] = useState(initialConfig?.solidBars || false);
  const [alternateColours, setAlternateColours] = useState(initialConfig?.alternateColours || false);
  const [groupOtherValues, setGroupOtherValues] = useState(initialConfig?.groupOtherValues || false);
  const [showMissingValues, setShowMissingValues] = useState(initialConfig?.showMissingValues || false);
  const [restrictToFiltered, setRestrictToFiltered] = useState(initialConfig?.restrictToFiltered || false);
  const [excludeFilteredValues, setExcludeFilteredValues] = useState(initialConfig?.excludeFilteredValues || false);
  
  const [facetSearchTerm, setFacetSearchTerm] = useState('');

  const chartTypes = [
    { id: 'vertBar', name: 'Vert Bar', icon: BarChart3 },
    { id: 'wordCloud', name: 'Word Cloud', icon: Calendar },
    { id: 'pieChart', name: 'Pie Chart', icon: PieChart },
    { id: 'heatMap', name: 'Heat Map', icon: Grid3X3 },
    { id: 'barChart', name: 'Bar Chart', icon: BarChart }
  ];

  const metricOptions = [
    'Document Count',
    'Average Agent Count',
    'Average Applicant Count',
    'Average Cited By Patent Count',
    'Average Extended Family Size',
    'Average Simple Family Size',
    'Average Inventor Count',
    'Average Owner Count',
    'Average Cited NPL Count',
    'Average Cited Resolved Scholarly Works Count',
    'Average Cited Patent Count',
    'Average Sequence Count',
    'Sum Cited By Patent Count',
    'Sum Extended Family Size',
    'Sum Simple Family Size',
    'Sum Cited NPL Count',
    'Sum Cited Resolved Scholarly Works Count',
    'Sum Cited Patent Count',
    'Sum Sequence Count'
  ];

  const facetOptions = [
    'Unique Count Owner Name',
    'Unique Citing Scholarly Works',
    'Unique Cited Patents',
    'Unique Count Biological Organism Name',
    'Unique Count Jurisdiction',
    'Unique Count Owner Country',
    'Unique Count Owner Name',
    'Unique Citing Scholarly Works',
    'Unique Cited Patents',
    'Unique Count Biological Organism Name',
    'Average Cited Patent Count',
    'Average Sequence Count',
    'Unique Count Agent Country',
    'Unique Count Agent Name',
    'Unique Count Applicant Name',
    'Unique Count Applicant Country',
    'Unique Citing Patents',
    'Extended Patent Families',
    'Simple Patent Families',
    'Unique Count Inventor Name',
    'Unique Count Inventor Country',
    'Unique Count Jurisdiction',
    'Inventor Name Exact'
  ];

  const orderByOptions = [
    'Sum Cited By Patent Count',
    'Document Count',
    'Average Cited By Patent Count',
    'Sum Extended Family Size',
    'Sum Simple Family Size',
    'Sum Cited NPL Count',
    'Average Extended Family Size',
    'Average Simple Family Size'
  ];

  const colorSchemeOptions = [
    'greens',
    'blues',
    'reds',
    'purples',
    'oranges',
    'greys',
    'rainbow',
    'viridis',
    'plasma',
    'inferno'
  ];

  const scaleOptions = [
    'Linear',
    'Logarithmic',
    'Square Root'
  ];

  const filteredMetricOptions = metricOptions;

  const filteredFacetOptions = facetOptions.filter(option =>
    option.toLowerCase().includes(facetSearchTerm.toLowerCase())
  );

  const handleSave = () => {
    const config = {
      chartType: selectedChartType,
      title: chartTitle,
      metric,
      facet,
      height: parseInt(height),
      orderBy,
      limit: parseInt(limit),
      scale,
      colorScheme,
      solidBars,
      alternateColours,
      groupOtherValues,
      showMissingValues,
      restrictToFiltered,
      excludeFilteredValues
    };
    
    if (onSave) {
      onSave(config);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button 
              className="p-1 hover:bg-gray-100 rounded"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronDown className="w-5 h-5 text-blue-600" />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {['Configuration', 'Downloads', 'Help'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? 'text-teal-600 border-teal-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'Configuration' && (
            <div className="p-4 space-y-4">
              {/* Chart Type Selection */}
              <div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {chartTypes.map(type => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedChartType(type.name)}
                        className={`p-3 rounded-lg border text-center ${
                          selectedChartType === type.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs">{type.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chart Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Title
                </label>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Metric */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metric
                </label>
                <div className="relative">
                  <select
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    {filteredMetricOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Facet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facet
                </label>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Search"
                    value={facetSearchTerm}
                    onChange={(e) => setFacetSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md">
                  {filteredFacetOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setFacet(option)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                        facet === option ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="in pixels, e.g. 800"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Order By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order By
                </label>
                <div className="relative">
                  <select
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    {orderByOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Limit
                </label>
                <div className="relative">
                  <select
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    {['5', '10', '15', '20', '25', '50', '100'].map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Scale */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale
                </label>
                <div className="relative">
                  <select
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    {scaleOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Solid Bars */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="solidBars"
                  checked={solidBars}
                  onChange={(e) => setSolidBars(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="solidBars" className="text-sm text-gray-700">
                  Solid Colour
                </label>
              </div>

              {/* Colour Scheme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colour Scheme
                </label>
                <div className="relative">
                  <select
                    value={colorScheme}
                    onChange={(e) => setColorScheme(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    {colorSchemeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Alternate Colours */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="alternateColours"
                  checked={alternateColours}
                  onChange={(e) => setAlternateColours(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="alternateColours" className="text-sm text-gray-700 flex items-center gap-1">
                  Alternate Colours
                  <HelpCircle className="w-3 h-3 text-gray-400" />
                </label>
              </div>

              {/* Additional Data */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="groupOtherValues"
                  checked={groupOtherValues}
                  onChange={(e) => setGroupOtherValues(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="groupOtherValues" className="text-sm text-gray-700 flex items-center gap-1">
                  Group Other Values
                  <HelpCircle className="w-3 h-3 text-gray-400" />
                </label>
              </div>

              {/* Missing Values */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showMissingValues"
                  checked={showMissingValues}
                  onChange={(e) => setShowMissingValues(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showMissingValues" className="text-sm text-gray-700">
                  Show Missing Values
                </label>
              </div>

              {/* Filtered Values */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="restrictToFiltered"
                  checked={restrictToFiltered}
                  onChange={(e) => setRestrictToFiltered(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="restrictToFiltered" className="text-sm text-gray-700">
                  Restrict to Filtered Values
                </label>
              </div>

              {/* Exclude Filtered Values */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="excludeFilteredValues"
                  checked={excludeFilteredValues}
                  onChange={(e) => setExcludeFilteredValues(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="excludeFilteredValues" className="text-sm text-gray-700 flex items-center gap-1">
                  Exclude Filtered Values
                  <HelpCircle className="w-3 h-3 text-gray-400" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'Downloads' && (
            <div className="p-4">
              <div className="text-center py-8">
                <Download className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Download Chart</h3>
                <p className="text-sm text-gray-500 mb-4">Export your chart in various formats</p>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Download as PNG
                  </button>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Download as SVG
                  </button>
                  <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                    Download as PDF
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                    Export Data as CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Help' && (
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Chart Types</h4>
                    <p className="text-sm text-gray-600">Choose from various visualization types including bar charts, pie charts, and heat maps.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Metrics</h4>
                    <p className="text-sm text-gray-600">Select the metric you want to measure, such as document count or citation counts.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Facets</h4>
                    <p className="text-sm text-gray-600">Choose how to group your data, such as by inventor name, jurisdiction, or other categories.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Filtering</h4>
                    <p className="text-sm text-gray-600">Control which data points are included or excluded from your visualization.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => console.log('Preview')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Preview
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}