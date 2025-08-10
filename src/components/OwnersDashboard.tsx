import { useState, useMemo, useCallback } from 'react';
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
  List,
  MoreHorizontal
} from 'lucide-react';
import ChartConfiguration from './ChartConfiguration';

// Types
interface Owner {
  name: string;
  count: string;
  logo: string;
  color: string;
}

interface TimeSeriesData {
  owner: string;
  color: string;
  data: { year: number; value: number }[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface StackedChartData {
  name: string;
  data: { status?: string; type?: string; value: number; color: string }[];
}

interface ChartConfig {
  chartType: string;
  title: string;
  metric: string;
  facet: string;
}

export default function OwnersDashboard() {
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [currentChartConfig, setCurrentChartConfig] = useState<ChartConfig | null>(null);

  const handleChartConfig = useCallback((chartType: string, title: string, metric = 'Patent Documents', facet = 'Owner Name Exact') => {
    setCurrentChartConfig({ chartType, title, metric, facet });
    setConfigModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setConfigModalOpen(false);
  }, []);

  const handleSaveConfig = useCallback((config: ChartConfig) => {
    console.log('Chart configuration saved:', config);
  }, []);

  // Memoized data to prevent unnecessary recalculations
  const metrics = useMemo(() => ({
    patentRecords: '165,281,274',
    patentCitations: '482,259,938',
    citesPatents: '53,973,473',
    citedByPatents: '62,754,553',
    simpleFamilies: '93,379,056',
    extendedFamilies: '89,592,640'
  }), []);

  const topOwners: Owner[] = useMemo(() => [
    { name: 'International Business Machines Corp.', count: '278,198', logo: '🏢', color: '#0066cc' },
    { name: 'Samsung Electronics CO LTD', count: '266,759', logo: '📱', color: '#1f77b4' },
    { name: 'Microsoft Technology Licensing LLC', count: '145,834', logo: '🪟', color: '#ff7f0e' },
    { name: 'Canon Kabushiki Kaisha', count: '133,724', logo: '📷', color: '#2ca02c' },
    { name: 'Lg Electronics INC', count: '102,613', logo: '📺', color: '#d62728' },
    { name: 'Intel Corporation', count: '102,236', logo: '💻', color: '#9467bd' },
    { name: 'Qualcomm Incorporated', count: '102,201', logo: '📡', color: '#8c564b' },
    { name: 'Kabushiki Kaisha Toshiba', count: '94,631', logo: '🔧', color: '#e377c2' },
    { name: 'Sony Corporation', count: '93,173', logo: '🎮', color: '#7f7f7f' },
    { name: 'Toyota Jidosha Kabushiki Kaisha', count: '90,687', logo: '🚗', color: '#bcbd22' },
    { name: 'Hewlett-Packard Development Company L.P.', count: '87,748', logo: '🖨️', color: '#17becf' },
    { name: 'General Electric Company', count: '80,874', logo: '⚡', color: '#ff9900' },
    { name: 'Samsung Display CO LTD', count: '75,000', logo: '📺', color: '#1f77b4' },
    { name: 'Fujitsu Limited', count: '74,058', logo: '💾', color: '#ff6600' },
    { name: 'Siemens Aktiengesellschaft', count: '73,549', logo: '🏭', color: '#00cc99' }
  ], []);

  // Memoized time series data generation
  const generateTimeSeriesData = useCallback((startYear: number, endYear: number, intensity: number) => {
    const data = [];
    for (let year = startYear; year <= endYear; year++) {
      let value = 0;
      if (year >= 1980) {
        if (year < 2000) {
          value = Math.random() * intensity * 5000 + 1000;
        } else if (year < 2010) {
          value = Math.random() * intensity * 15000 + 5000;
        } else if (year < 2020) {
          value = Math.random() * intensity * 20000 + 8000;
        } else {
          value = Math.random() * intensity * 10000 + 3000;
        }
      }
      data.push({ year, value: Math.floor(value) });
    }
    return data;
  }, []);

  const ownerTimeSeriesData: TimeSeriesData[] = useMemo(() => [
    { owner: 'Canon Kabushiki Kaisha', color: '#3b82f6', data: generateTimeSeriesData(1950, 2025, 0.3) },
    { owner: 'Kabushiki Kaisha Toshiba', color: '#f59e0b', data: generateTimeSeriesData(1950, 2025, 0.25) },
    { owner: 'Qualcomm Incorporated', color: '#22c55e', data: generateTimeSeriesData(1950, 2025, 0.2) },
    { owner: 'Intel Corporation', color: '#ef4444', data: generateTimeSeriesData(1950, 2025, 0.35) },
    { owner: 'International Business Machines Corp.', color: '#8b5cf6', data: generateTimeSeriesData(1950, 2025, 0.4) },
    { owner: 'Microsoft Technology Licensing LLC', color: '#06b6d4', data: generateTimeSeriesData(1950, 2025, 0.15) },
    { owner: 'Samsung Electronics CO LTD', color: '#f97316', data: generateTimeSeriesData(1950, 2025, 0.28) },
    { owner: 'Sony Corporation', color: '#84cc16', data: generateTimeSeriesData(1950, 2025, 0.22) }
  ], [generateTimeSeriesData]);


  const simpleFamiliesData: ChartData[] = useMemo(() => [
    { name: 'Samsung Electronics CO LTD', value: 140000, color: '#22c55e' },
    { name: 'International Business Machines Corp.', value: 120000, color: '#22c55e' },
    { name: 'Canon Kabushiki Kaisha', value: 80000, color: '#22c55e' },
    { name: 'Kabushiki Kaisha Toshiba', value: 70000, color: '#22c55e' },
    { name: 'Intel Corporation', value: 60000, color: '#22c55e' },
    { name: 'Microsoft Technology Licensing LLC', value: 55000, color: '#22c55e' },
    { name: 'Sony Corporation', value: 50000, color: '#22c55e' },
    { name: 'Qualcomm Incorporated', value: 45000, color: '#22c55e' },
    { name: 'Toyota Jidosha Kabushiki Kaisha', value: 42000, color: '#22c55e' },
    { name: 'Lg Electronics INC', value: 40000, color: '#22c55e' }
  ], []);

  const patentCitationsData: ChartData[] = useMemo(() => [
    { name: 'International Business Machines Corp.', value: 4000000, color: '#22c55e' },
    { name: 'Microsoft Technology Licensing LLC', value: 3500000, color: '#22c55e' },
    { name: 'Samsung Electronics CO LTD', value: 3200000, color: '#22c55e' },
    { name: 'Cilag GMBH International', value: 2800000, color: '#22c55e' },
    { name: 'Ethicon LLC', value: 2600000, color: '#22c55e' },
    { name: 'Microsoft Corporation', value: 2400000, color: '#22c55e' },
    { name: 'Ethicon Endo-Surgery INC', value: 2200000, color: '#22c55e' },
    { name: 'Intel Corporation', value: 2000000, color: '#22c55e' },
    { name: 'Covidien LP', value: 1800000, color: '#22c55e' },
    { name: 'Hewlett-Packard Development Company L.P.', value: 1600000, color: '#22c55e' }
  ], []);

  const legalStatusData: StackedChartData[] = useMemo(() => [
    {
      name: 'International Business Machines Corp.',
      data: [
        { status: 'Active', value: 120000, color: '#ef4444' },
        { status: 'Inactive', value: 100000, color: '#06b6d4' },
        { status: 'Expired', value: 80000, color: '#22c55e' },
        { status: 'Discontinued', value: 60000, color: '#22c55e' },
        { status: 'Pending', value: 20000, color: '#f59e0b' }
      ]
    },
    {
      name: 'Samsung Electronics CO LTD',
      data: [
        { status: 'Active', value: 80000, color: '#ef4444' },
        { status: 'Inactive', value: 140000, color: '#06b6d4' },
        { status: 'Expired', value: 60000, color: '#22c55e' },
        { status: 'Discontinued', value: 40000, color: '#22c55e' },
        { status: 'Pending', value: 15000, color: '#f59e0b' }
      ]
    }
  ], []);

  const documentTypeData: StackedChartData[] = useMemo(() => [
    {
      name: 'International Business Machines Corp.',
      data: [
        { type: 'Patent Application', value: 200000, color: '#f97316' },
        { type: 'Granted Patent', value: 80000, color: '#3b82f6' }
      ]
    },
    {
      name: 'Samsung Electronics CO LTD',
      data: [
        { type: 'Patent Application', value: 180000, color: '#f97316' },
        { type: 'Granted Patent', value: 70000, color: '#3b82f6' }
      ]
    }
  ], []);

  // Extract reusable components
  const TopOwnersGrid = useCallback(() => (
    <div className="grid grid-cols-5 gap-4">
      {topOwners.map((owner, index) => (
        <div key={`${owner.name}-${index}`} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">{owner.logo}</div>
          <div className="text-sm font-medium text-gray-900 mb-2 leading-tight">
            {owner.name}
          </div>
          <div className="text-lg font-bold text-blue-600">
            {owner.count}
          </div>
        </div>
      ))}
    </div>
  ), [topOwners]);

  const TimeSeriesChart = () => {
    const years = [];
    for (let year = 1950; year <= 2025; year += 5) {
      years.push(year);
    }

    return (
      <div className="space-y-4">
        <div className="relative h-80 bg-white p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
            <span>20,000</span>
            <span>18,000</span>
            <span>16,000</span>
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
          <div className="ml-12 h-full relative">
            <svg viewBox="0 0 800 300" className="w-full h-full">
              {/* Grid lines */}
              <defs>
                <pattern id="time-grid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#time-grid)" />
              
              {/* Time series lines */}
              {ownerTimeSeriesData.map((series, seriesIndex) => {
                const points = series.data.map((point, index) => {
                  const x = (index / series.data.length) * 800;
                  const y = 300 - (point.value / 20000) * 300;
                  return `${x},${y}`;
                }).join(' ');
                
                return (
                  <polyline
                    key={seriesIndex}
                    points={points}
                    fill="none"
                    stroke={series.color}
                    strokeWidth="2"
                    opacity="0.8"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2 ml-12">
            {years.map((year) => (
              <span key={year}>{year}</span>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-4">Publication Date</div>
          <div className="text-xs text-gray-500 mb-4">Owner Name Exact</div>
          
          <div className="grid grid-cols-4 gap-2 text-xs max-w-4xl mx-auto">
            {ownerTimeSeriesData.map((series, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded" 
                  style={{ backgroundColor: series.color }}
                ></div>
                <span className="truncate">{series.owner}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
          <div className="text-xs text-yellow-800">
            <strong>WARNING:</strong> Years before 1950 are not displayed by default. To show these, change the "Start Year" field in this chart config. 
            <button className="text-blue-600 hover:underline">Show All</button>
          </div>
        </div>
      </div>
    );
  };

  const HorizontalBarChart = ({ data, title, color }: { data: any[], title: string, color: string }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-48 text-xs text-gray-700 text-right truncate">
              {item.name}
            </div>
            <div className="flex-1 flex items-center">
              <div 
                className="h-6 rounded transition-all hover:opacity-80"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              />
            </div>
          </div>
        ))}
        <div className="text-center text-xs text-gray-500 pt-4">
          {title}
        </div>
      </div>
    );
  };

  const StackedHorizontalBarChart = ({ data, title }: { data: any[], title: string }) => {
    const maxValue = Math.max(...data.map(item => 
      item.data.reduce((sum: number, d: any) => sum + d.value, 0)
    ));

    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="text-xs font-medium text-gray-700 truncate">
              {item.name}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 text-xs text-gray-500 text-right truncate">
                {item.name}
              </div>
              <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden flex">
                {item.data.map((segment: any, segIndex: number) => {
                  const width = (segment.value / maxValue) * 100;
                  return (
                    <div
                      key={segIndex}
                      className="h-full transition-all hover:opacity-80"
                      style={{ 
                        width: `${width}%`, 
                        backgroundColor: segment.color || segment.type === 'Active' ? '#ef4444' : segment.color
                      }}
                      title={`${segment.status || segment.type}: ${segment.value.toLocaleString()}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center text-xs text-gray-500 pt-4">
          Document Count
        </div>
        
        {title === 'Legal Status' && (
          <div className="flex justify-center gap-4 text-xs pt-2">
            <div className="grid grid-cols-3 gap-x-4 gap-y-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-cyan-500 rounded"></div>
                <span>Inactive</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded"></div>
                <span>Expired</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-600 rounded"></div>
                <span>Discontinued</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-800 rounded"></div>
                <span>Patented</span>
              </div>
            </div>
          </div>
        )}
        
        {title === 'Document Type' && (
          <div className="flex justify-center gap-4 text-xs pt-2">
            <div className="grid grid-cols-3 gap-x-4 gap-y-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded"></div>
                <span>Amended Application</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded"></div>
                <span>Amended Patent</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded"></div>
                <span>Design Right</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded"></div>
                <span>Granted Patent</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded"></div>
                <span>Patent Application</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded"></div>
                <span>Search Report</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Sample data for country and CPC charts
  const countryData = [
    { country: 'Korea, Republic of', companies: [
      { name: 'Samsung Electronics CO LTD', value: 240000, color: '#6b7280' },
      { name: 'Lg Electronics INC', value: 120000, color: '#8b5cf6' },
      { name: 'Samsung Display CO LTD', value: 100000, color: '#84cc16' },
      { name: 'Hyundai Motor Company', value: 80000, color: '#f97316' },
      { name: 'Lg Display CO LTD', value: 60000, color: '#22c55e' }
    ]},
    { country: 'Japan', companies: [
      { name: 'Canon Kabushiki Kaisha', value: 160000, color: '#3b82f6' },
      { name: 'Sony Corporation', value: 120000, color: '#84cc16' },
      { name: 'Kabushiki Kaisha Toshiba', value: 140000, color: '#22c55e' },
      { name: 'Toyota Jidosha Kabushiki Kaisha', value: 100000, color: '#06b6d4' },
      { name: 'Fujitsu Limited', value: 80000, color: '#f59e0b' }
    ]}
  ];

  const cpcData = [
    { classification: 'H02J99/00', companies: [
      { name: 'Lg Energy Solution LTD', value: 16000, color: '#f97316' },
      { name: 'Samsung SDI CO LTD', value: 12000, color: '#22c55e' },
      { name: 'Lg Chem LTD', value: 10000, color: '#ef4444' },
      { name: 'Toyota Jidosha Kabushiki Kaisha', value: 8000, color: '#06b6d4' },
      { name: 'Lg Energy Solution LTD KR', value: 6000, color: '#f59e0b' }
    ]},
    { classification: 'A61F2/00', companies: [
      { name: 'Novartis AG', value: 8000, color: '#f59e0b' },
      { name: 'Merck Sharp & Dohme CORP', value: 6000, color: '#f97316' },
      { name: 'AstraZeneca Ab', value: 4000, color: '#06b6d4' },
      { name: 'Takeda Pharmaceutical Company Ltd', value: 3000, color: '#84cc16' },
      { name: 'Vertex Pharmaceuticals Incorporated', value: 2000, color: '#8b5cf6' }
    ]}
  ];

  const CountryChart = ({ data }: { data: any[] }) => (
    <div className="space-y-6">
      {data.map((countryGroup, groupIndex) => (
        <div key={groupIndex}>
          <div className="text-sm font-medium text-gray-700 mb-3">
            {countryGroup.country}
          </div>
          <div className="space-y-2">
            {countryGroup.companies.map((company: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-48 text-xs text-gray-700 text-right truncate">
                  {company.name}
                </div>
                <div className="flex-1 flex items-center">
                  <div 
                    className="h-4 rounded transition-all hover:opacity-80"
                    style={{ 
                      width: `${(company.value / 240000) * 100}%`,
                      backgroundColor: company.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="text-center text-xs text-gray-500 pt-4">
        Document Count
      </div>
    </div>
  );

  const CPCChart = ({ data }: { data: any[] }) => (
    <div className="space-y-6">
      {data.map((cpcGroup, groupIndex) => (
        <div key={groupIndex}>
          <div className="text-sm font-medium text-gray-700 mb-3">
            {cpcGroup.classification}
          </div>
          <div className="space-y-2">
            {cpcGroup.companies.map((company: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-48 text-xs text-gray-700 text-right truncate">
                  {company.name}
                </div>
                <div className="flex-1 flex items-center">
                  <div 
                    className="h-4 rounded transition-all hover:opacity-80"
                    style={{ 
                      width: `${(company.value / 16000) * 100}%`,
                      backgroundColor: company.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="text-center text-xs text-gray-500 pt-4">
        Document Count
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span className="text-blue-600">DASHBOARD</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600">🏢</span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Owners</h1>
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
              <div className="text-gray-600 text-sm font-medium mb-1">Patent Citations</div>
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
              <div className="text-teal-600 text-sm font-medium mb-1">Simple Families</div>
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
          {/* Top Row - Company Logos and Time Series */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Top Owners by Patent Documents</h3>
                  <button 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleChartConfig('Grid', 'Top Owners by Patent Documents', 'Patent Documents', 'Owner Name Exact')}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <TopOwnersGrid />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Owner Patent Documents over time</h3>
                  <button 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleChartConfig('Line Chart', 'Owner Patent Documents over time', 'Document Count', 'Publication Date')}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <TimeSeriesChart />
            </div>
          </div>

          {/* Second Row - Horizontal Bar Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Top Owners by Simple Families</h3>
                  <button 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleChartConfig('Horizontal Bar Chart', 'Top Owners by Simple Families', 'Simple Patent Families', 'Owner Name Exact')}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <HorizontalBarChart data={simpleFamiliesData} title="Simple Patent Families" color="#22c55e" />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Top Owners by Patent Citations</h3>
                  <button 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleChartConfig('Horizontal Bar Chart', 'Top Owners by Patent Citations', 'Sum Cited By Patent Count', 'Owner Name Exact')}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <HorizontalBarChart data={patentCitationsData} title="Sum Cited By Patent Count" color="#22c55e" />
            </div>
          </div>

          {/* Third Row - Stacked Horizontal Bar Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Top Owners by Legal Status</h3>
                  <button 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleChartConfig('Stacked Horizontal Bar Chart', 'Top Owners by Legal Status', 'Document Count', 'Legal Status')}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <StackedHorizontalBarChart data={legalStatusData} title="Legal Status" />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Top Owners by Document Type</h3>
                  <button 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleChartConfig('Stacked Horizontal Bar Chart', 'Top Owners by Document Type', 'Document Count', 'Document Type')}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <StackedHorizontalBarChart data={documentTypeData} title="Document Type" />
            </div>
          </div>

          {/* Fourth Row - Country and CPC Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Top Owners by Country of residence</h3>
                  <button 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleChartConfig('Grouped Horizontal Bar Chart', 'Top Owners by Country of residence', 'Document Count', 'Country of residence')}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <CountryChart data={countryData} />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Top Owners by CPC Classification</h3>
                  <button 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleChartConfig('Grouped Horizontal Bar Chart', 'Top Owners by CPC Classification', 'Document Count', 'CPC Classification')}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <CPCChart data={cpcData} />
            </div>
          </div>

          {/* Global Innovation 100 Analysis Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">100</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Global Innovation 100 Analysis</h2>
                <p className="text-sm text-gray-600">Innovation capability metrics for leading technology companies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 3M Analysis */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-700 font-bold text-lg">3M</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">3M Company</h3>
                    <p className="text-sm text-gray-600">Chemicals & Materials | U.S.</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pioneering company committed to revolutionizing material technology with global presence across 99 countries/regions.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Valid inventions (k)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-blue-200 rounded-full h-2">
                        <div className="w-3/5 bg-blue-600 h-2 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">21k</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Invention application %</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-blue-200 rounded-full h-2">
                        <div className="w-full bg-blue-600 h-2 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">92.9%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Avg forward citations</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-blue-200 rounded-full h-2">
                        <div className="w-2/3 bg-blue-600 h-2 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">10</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Countries/regions covered</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-blue-200 rounded-full h-2">
                        <div className="w-full bg-blue-600 h-2 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">99</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-xs font-medium text-blue-700 mb-2">Innovation Capability Radar</div>
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Pentagon background */}
                          <polygon points="50,5 85,35 70,80 30,80 15,35" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="1" opacity="0.3"/>
                          {/* 3M performance overlay */}
                          <polygon points="50,15 75,30 65,70 35,70 25,30" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" opacity="0.6"/>
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-gray-700">Tech Size</div>
                          <div className="text-blue-600">High</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-700">Tech Quality</div>
                          <div className="text-blue-600">Strong</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-700">Tech Influence</div>
                          <div className="text-blue-600">Strong</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-700">Globalization</div>
                          <div className="text-blue-600">Excellent</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alphabet Analysis */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-700 font-bold text-sm">GOOG</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Alphabet Inc.</h3>
                    <p className="text-sm text-gray-600">Information Technology | U.S.</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Worldwide tech powerhouse with significant impact on global internet landscape, actively exploring AI technologies.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Valid inventions (k)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-green-200 rounded-full h-2">
                        <div className="w-4/5 bg-green-600 h-2 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">49k</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Grant rate of applications %</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-green-200 rounded-full h-2">
                        <div className="w-2/3 bg-green-600 h-2 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">45.3%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Avg forward citations (top 10)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-green-200 rounded-full h-2">
                        <div className="w-full bg-green-600 h-2 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">1063</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">PCT filings (k)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-green-200 rounded-full h-2">
                        <div className="w-1/3 bg-green-600 h-2 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">11</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-xs font-medium text-green-700 mb-2">Innovation Capability Radar</div>
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Pentagon background */}
                          <polygon points="50,5 85,35 70,80 30,80 15,35" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" opacity="0.3"/>
                          {/* Alphabet performance overlay */}
                          <polygon points="50,10 80,28 75,75 25,75 20,28" fill="#22c55e" stroke="#16a34a" strokeWidth="2" opacity="0.6"/>
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-gray-700">Tech Size</div>
                          <div className="text-green-600">Excellent</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-700">Tech Quality</div>
                          <div className="text-green-600">Superior</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-700">Tech Influence</div>
                          <div className="text-green-600">Exceptional</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-700">Globalization</div>
                          <div className="text-green-600">Strong</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Innovation Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">Technology Leadership</div>
                  <div className="text-blue-700 mt-1">Both companies demonstrate strong innovation capability with high patent quality and global reach</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">Citation Impact</div>
                  <div className="text-green-700 mt-1">Alphabet shows exceptional citation performance (1063 avg) while 3M maintains solid innovation metrics</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900">Global Presence</div>
                  <div className="text-purple-700 mt-1">3M's extensive geographic coverage (99 regions) exemplifies successful technology globalization</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Configuration Modal */}
      <ChartConfiguration 
        isOpen={configModalOpen}
        onClose={handleCloseModal}
        initialConfig={currentChartConfig}
        onSave={handleSaveConfig}
      />
    </div>
  );
}