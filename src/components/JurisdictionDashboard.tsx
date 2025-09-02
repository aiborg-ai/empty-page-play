import { useState } from 'react';
import { 
  HelpCircle,
  ChevronDown,
  Plus,
  BarChart3,
  Save,
  Share,
  Eye,
  MoreHorizontal,
  X,
  AlertTriangle,
  Table,
  List
} from 'lucide-react';
import ChartConfiguration from './ChartConfiguration';

export default function JurisdictionDashboard() {
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [currentChartConfig, setCurrentChartConfig] = useState<any>(null);

  const handleChartConfig = (chartType: string, title: string, metric?: string, facet?: string) => {
    setCurrentChartConfig({
      chartType,
      title,
      metric: metric || 'Document Count',
      facet: facet || 'Jurisdiction'
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

  const timeSeriesData = [
    { year: 1950, value: 0 },
    { year: 1955, value: 100000 },
    { year: 1960, value: 300000 },
    { year: 1965, value: 500000 },
    { year: 1970, value: 700000 },
    { year: 1975, value: 900000 },
    { year: 1980, value: 1200000 },
    { year: 1985, value: 1500000 },
    { year: 1990, value: 1800000 },
    { year: 1995, value: 2200000 },
    { year: 2000, value: 2800000 },
    { year: 2005, value: 3500000 },
    { year: 2010, value: 4500000 },
    { year: 2015, value: 5500000 },
    { year: 2020, value: 6000000 },
    { year: 2025, value: 6200000 }
  ];

  const legalStatusData = [
    { jurisdiction: 'China', active: 45, discontinued: 30, pending: 15, expired: 8, inactive: 2 },
    { jurisdiction: 'Japan', active: 35, discontinued: 35, pending: 20, expired: 8, inactive: 2 },
    { jurisdiction: 'United States', active: 25, discontinued: 40, pending: 25, expired: 8, inactive: 2 },
    { jurisdiction: 'European Patents', active: 20, discontinued: 45, pending: 25, expired: 8, inactive: 2 },
    { jurisdiction: 'Germany', active: 15, discontinued: 50, pending: 25, expired: 8, inactive: 2 },
    { jurisdiction: 'Korea, Republic of', active: 30, discontinued: 35, pending: 25, expired: 8, inactive: 2 },
    { jurisdiction: 'WO - WIPO', active: 25, discontinued: 40, pending: 25, expired: 8, inactive: 2 },
    { jurisdiction: 'United Kingdom', active: 20, discontinued: 45, pending: 25, expired: 8, inactive: 2 },
    { jurisdiction: 'France', active: 18, discontinued: 47, pending: 25, expired: 8, inactive: 2 },
    { jurisdiction: 'Canada', active: 15, discontinued: 50, pending: 25, expired: 8, inactive: 2 }
  ];

  const citationData = [
    { jurisdiction: 'United States', value: 15.2 },
    { jurisdiction: 'Macao', value: 12.8 },
    { jurisdiction: 'WO - WIPO', value: 8.5 },
    { jurisdiction: 'Kyrgyzstan', value: 7.2 },
    { jurisdiction: 'Belarus', value: 6.8 },
    { jurisdiction: 'Uzbekistan', value: 6.5 },
    { jurisdiction: 'Kazakhstan', value: 6.2 },
    { jurisdiction: 'Japan', value: 5.9 },
    { jurisdiction: 'European Patents', value: 5.7 },
    { jurisdiction: 'Germany', value: 5.5 }
  ];

  const topApplicants = {
    japan: [
      { name: 'Matsushita Electric Ind CO LTD', value: 45000 },
      { name: 'Hitachi LTD', value: 40000 },
      { name: 'Canon KK', value: 35000 },
      { name: 'Toshiba CORP', value: 30000 },
      { name: 'Mitsubishi Electric CORP', value: 25000 }
    ],
    unitedStates: [
      { name: 'IBM', value: 50000 },
      { name: 'Samsung Electronics CO LTD', value: 45000 },
      { name: 'Canon KK', value: 40000 },
      { name: 'Gen Electric', value: 35000 },
      { name: 'Sony CORP', value: 30000 }
    ],
    china: [
      { name: 'State Grid CORP China', value: 35000 },
      { name: 'Huawei Tech CO LTD', value: 30000 },
      { name: 'Univ Zhejiang', value: 25000 },
      { name: 'Gree Electric Appliances INC Zhuhai', value: 20000 },
      { name: 'Samsung Electronics CO LTD', value: 18000 }
    ],
    germany: [
      { name: 'Siemens AG', value: 25000 },
      { name: 'Bosch GMBH Robert', value: 22000 },
      { name: 'Bayerische Motoren Werke AG', value: 20000 },
      { name: 'Basf AG', value: 18000 },
      { name: 'Bayer AG', value: 16000 }
    ],
    europeanPatents: [
      { name: 'Samsung Electronics CO LTD', value: 28000 },
      { name: 'Huawei Tech CO LTD', value: 25000 },
      { name: 'Siemens AG', value: 22000 },
      { name: 'Bosch GMBH Robert', value: 20000 },
      { name: 'LG Electronics INC', value: 18000 }
    ]
  };

  const topOwners = {
    unitedStates: [
      { name: 'International Business Machines Corp.', value: 240000 },
      { name: 'Samsung Electronics CO LTD', value: 180000 },
      { name: 'Canon Kabushiki Kaisha', value: 160000 },
      { name: 'Microsoft Technology Licensing LLC', value: 140000 },
      { name: 'Intel Corporation', value: 120000 }
    ],
    europeanPatents: [
      { name: 'Samsung Electronics CO LTD', value: 45000 },
      { name: 'Siemens Aktiengesellschaft', value: 40000 },
      { name: 'Panasonic Corporation', value: 35000 },
      { name: 'Koninklijke Philips NV', value: 30000 },
      { name: 'Microsoft Technology Licensing LLC', value: 28000 }
    ],
    germany: [
      { name: 'Schaeffler Technologies AG & CO KG', value: 25000 },
      { name: 'Daimler AG 70327 Stuttgart De', value: 22000 },
      { name: 'Daimlerchrysler AG 70327 Stuttgart De', value: 20000 },
      { name: 'Schaeffler Technologies GMBH & CO', value: 18000 },
      { name: 'Gm Global Technology Operations LLC', value: 16000 }
    ],
    china: [
      { name: 'Microsoft Technology Licensing LLC', value: 35000 },
      { name: 'State Electric Net Corp', value: 32000 },
      { name: 'State Grid Corporation Of China', value: 30000 },
      { name: 'Samsung Display CO LTD', value: 28000 },
      { name: 'Shanghai Huahong Grace Semiconductor...', value: 25000 }
    ]
  };

  const WorldMap = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Top Jurisdictions</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('World Map', 'Top Jurisdictions')}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
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
      
      <div className="relative h-80 bg-gradient-to-br from-green-50 to-green-100 rounded-lg overflow-hidden">
        {/* World map SVG representation */}
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* North America */}
          <path d="M100 120 L280 110 L290 180 L120 190 Z" fill="#22c55e" className="opacity-80" />
          {/* Europe */}
          <path d="M350 100 L450 95 L460 150 L360 155 Z" fill="#16a34a" className="opacity-80" />
          {/* Asia */}
          <path d="M480 90 L680 85 L690 180 L490 185 Z" fill="#15803d" className="opacity-80" />
          {/* China highlighted */}
          <path d="M580 120 L650 115 L655 155 L585 160 Z" fill="#166534" className="opacity-90" />
          {/* Japan */}
          <path d="M680 130 L700 125 L705 145 L685 150 Z" fill="#14532d" className="opacity-90" />
          {/* Australia */}
          <path d="M580 250 L650 245 L655 280 L585 285 Z" fill="#65a30d" className="opacity-70" />
          {/* South America */}
          <path d="M200 220 L260 215 L270 320 L210 325 Z" fill="#84cc16" className="opacity-70" />
          {/* Africa */}
          <path d="M320 180 L420 175 L430 280 L330 285 Z" fill="#a3e635" className="opacity-60" />
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-lg">
          <div className="text-xs font-medium mb-2">Jurisdiction</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Australia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded"></div>
              <span>Austria</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span>Brazil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded"></div>
              <span>Canada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>China</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-300 rounded"></div>
              <span>France</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Germany</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>Japan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span>Korea, Republic of</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span>Soviet Union</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-600 rounded"></div>
              <span>Spain</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span>Switzerland</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-black rounded"></div>
              <span>Taiwan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>United States</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span>WO - WIPO</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-700 rounded"></div>
              <span>United Kingdom</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  const TimeSeriesChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Jurisdiction Patent Documents over time</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Line Chart', 'Jurisdiction Patent Documents over time', 'Document Count', 'Publication Date')}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
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
      
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>6,000,000</span>
          <span>5,000,000</span>
          <span>4,000,000</span>
          <span>3,000,000</span>
          <span>2,000,000</span>
          <span>1,000,000</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-16 h-full border-l border-b border-gray-200 relative">
          <svg viewBox="0 0 800 200" className="w-full h-full">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Time series line */}
            <path 
              d="M 0 180 Q 200 170 400 120 Q 600 60 800 20" 
              fill="none" 
              stroke="#f97316" 
              strokeWidth="3"
            />
            
            {/* Data points */}
            {timeSeriesData.map((point, index) => {
              const x = (index / (timeSeriesData.length - 1)) * 800;
              const y = 200 - (point.value / 6200000) * 180;
              return (
                <circle 
                  key={index}
                  cx={x} 
                  cy={y} 
                  r="4" 
                  fill="#f97316"
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
      
      <div className="mt-4">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  const LegalStatusChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Jurisdictions by Legal Status</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Stacked Bar Chart', 'Jurisdictions by Legal Status', 'Document Count', 'Legal Status')}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
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
      
      <div className="space-y-2">
        <div className="text-right text-sm font-medium text-gray-700 mb-4">Jurisdiction</div>
        {legalStatusData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-32 text-sm text-gray-700 text-right pr-4">
              {item.jurisdiction}
            </div>
            <div className="flex-1 flex h-6 rounded overflow-hidden">
              <div 
                className="bg-red-500 h-full" 
                style={{ width: `${item.active}%` }}
                title={`Active: ${item.active}%`}
              />
              <div 
                className="bg-green-500 h-full" 
                style={{ width: `${item.discontinued}%` }}
                title={`Discontinued: ${item.discontinued}%`}
              />
              <div 
                className="bg-yellow-500 h-full" 
                style={{ width: `${item.pending}%` }}
                title={`Pending: ${item.pending}%`}
              />
              <div 
                className="bg-purple-500 h-full" 
                style={{ width: `${item.expired}%` }}
                title={`Expired: ${item.expired}%`}
              />
              <div 
                className="bg-cyan-500 h-full" 
                style={{ width: `${item.inactive}%` }}
                title={`Inactive: ${item.inactive}%`}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6 text-sm text-gray-600">
        Document Count
      </div>
      
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="grid grid-cols-3 gap-x-6 gap-y-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Discontinued</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Expired</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span>Patented</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Unknown</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  const CitationChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Jurisdictions by Average Cited By Patent Count</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Horizontal Bar Chart', 'Jurisdictions by Average Cited By Patent Count', 'Average Cited By Patent Count', 'Jurisdiction')}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
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
      
      <div className="space-y-2">
        <div className="text-right text-sm font-medium text-gray-700 mb-4">Jurisdiction</div>
        {citationData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-32 text-sm text-gray-700 text-right pr-4">
              {item.jurisdiction}
            </div>
            <div className="flex-1 flex h-6">
              <div 
                className="bg-green-500 h-full rounded-r" 
                style={{ width: `${(item.value / 16) * 100}%` }}
                title={`${item.value} average citations`}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-4 pl-36">
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
        <span>8</span>
        <span>9</span>
        <span>10</span>
        <span>11</span>
        <span>12</span>
        <span>13</span>
        <span>14</span>
        <span>15</span>
        <span>16</span>
      </div>
      
      <div className="flex justify-center mt-6 text-sm text-gray-600">
        Average Cited By Patent Count
      </div>
      
      <div className="mt-4">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  const ApplicantsChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Top Applicants by Jurisdiction</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Grouped Bar Chart', 'Top Applicants by Jurisdiction', 'Document Count', 'Applicant Name Exact')}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
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
      
      <div className="space-y-8">
        {/* Japan */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Japan</div>
          <div className="space-y-1">
            {topApplicants.japan.map((applicant, index) => (
              <div key={index} className="flex items-center">
                <div className="w-64 text-xs text-gray-700 pr-2 truncate">
                  {applicant.name}
                </div>
                <div className="flex-1 flex h-4">
                  <div 
                    className="bg-green-400 h-full" 
                    style={{ width: `${(applicant.value / 50000) * 100}%` }}
                    title={`${applicant.value.toLocaleString()} patents`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* United States */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">United States</div>
          <div className="space-y-1">
            {topApplicants.unitedStates.map((applicant, index) => (
              <div key={index} className="flex items-center">
                <div className="w-64 text-xs text-gray-700 pr-2 truncate">
                  {applicant.name}
                </div>
                <div className="flex-1 flex h-4">
                  <div 
                    className="bg-orange-400 h-full" 
                    style={{ width: `${(applicant.value / 50000) * 100}%` }}
                    title={`${applicant.value.toLocaleString()} patents`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* China */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">China</div>
          <div className="space-y-1">
            {topApplicants.china.map((applicant, index) => (
              <div key={index} className="flex items-center">
                <div className="w-64 text-xs text-gray-700 pr-2 truncate">
                  {applicant.name}
                </div>
                <div className="flex-1 flex h-4">
                  <div 
                    className="bg-gray-500 h-full" 
                    style={{ width: `${(applicant.value / 50000) * 100}%` }}
                    title={`${applicant.value.toLocaleString()} patents`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Germany */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Germany</div>
          <div className="space-y-1">
            {topApplicants.germany.map((applicant, index) => (
              <div key={index} className="flex items-center">
                <div className="w-64 text-xs text-gray-700 pr-2 truncate">
                  {applicant.name}
                </div>
                <div className="flex-1 flex h-4">
                  <div 
                    className="bg-blue-400 h-full" 
                    style={{ width: `${(applicant.value / 50000) * 100}%` }}
                    title={`${applicant.value.toLocaleString()} patents`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* European Patents */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">European Patents</div>
          <div className="space-y-1">
            {topApplicants.europeanPatents.map((applicant, index) => (
              <div key={index} className="flex items-center">
                <div className="w-64 text-xs text-gray-700 pr-2 truncate">
                  {applicant.name}
                </div>
                <div className="flex-1 flex h-4">
                  <div 
                    className="bg-purple-400 h-full" 
                    style={{ width: `${(applicant.value / 50000) * 100}%` }}
                    title={`${applicant.value.toLocaleString()} patents`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-4 text-xs">
          <span>0</span>
          <span>50,000</span>
          <span>100,000</span>
          <span>150,000</span>
          <span>200,000</span>
          <span>250,000</span>
          <span>300,000</span>
          <span>350,000</span>
          <span>400,000</span>
          <span>450,000</span>
          <span>500,000</span>
        </div>
      </div>
      
      <div className="flex justify-center mt-2 text-sm text-gray-600">
        Document Count
      </div>
      
      <div className="mt-4">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  const OwnersChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Top Owners by Jurisdiction</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Grouped Bar Chart', 'Top Owners by Jurisdiction', 'Document Count', 'Owner Name Exact')}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
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
      
      <div className="space-y-8">
        {/* United States */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">United States</div>
          <div className="space-y-1">
            {topOwners.unitedStates.map((owner, index) => (
              <div key={index} className="flex items-center">
                <div className="w-64 text-xs text-gray-700 pr-2 truncate">
                  {owner.name}
                </div>
                <div className="flex-1 flex h-4">
                  <div 
                    className="bg-orange-400 h-full" 
                    style={{ width: `${(owner.value / 250000) * 100}%` }}
                    title={`${owner.value.toLocaleString()} patents`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* European Patents */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">European Patents</div>
          <div className="space-y-1">
            {topOwners.europeanPatents.map((owner, index) => (
              <div key={index} className="flex items-center">
                <div className="w-64 text-xs text-gray-700 pr-2 truncate">
                  {owner.name}
                </div>
                <div className="flex-1 flex h-4">
                  <div 
                    className="bg-green-400 h-full" 
                    style={{ width: `${(owner.value / 250000) * 100}%` }}
                    title={`${owner.value.toLocaleString()} patents`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Germany */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Germany</div>
          <div className="space-y-1">
            {topOwners.germany.map((owner, index) => (
              <div key={index} className="flex items-center">
                <div className="w-64 text-xs text-gray-700 pr-2 truncate">
                  {owner.name}
                </div>
                <div className="flex-1 flex h-4">
                  <div 
                    className="bg-blue-400 h-full" 
                    style={{ width: `${(owner.value / 250000) * 100}%` }}
                    title={`${owner.value.toLocaleString()} patents`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* China */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">China</div>
          <div className="space-y-1">
            {topOwners.china.map((owner, index) => (
              <div key={index} className="flex items-center">
                <div className="w-64 text-xs text-gray-700 pr-2 truncate">
                  {owner.name}
                </div>
                <div className="flex-1 flex h-4">
                  <div 
                    className="bg-yellow-400 h-full" 
                    style={{ width: `${(owner.value / 250000) * 100}%` }}
                    title={`${owner.value.toLocaleString()} patents`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-8 text-xs">
          <span>0</span>
          <span>40,000</span>
          <span>80,000</span>
          <span>120,000</span>
          <span>160,000</span>
          <span>200,000</span>
          <span>240,000</span>
        </div>
      </div>
      
      <div className="flex justify-center mt-2 text-sm text-gray-600">
        Document Count
      </div>
      
      <div className="mt-4">
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
            <span className="text-red-600">🌍</span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Jurisdictions</h1>
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
            <button 
              className="px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-500"
            >
              Patents
            </button>
            <button 
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
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
          {/* Top Row - World Map */}
          <WorldMap />
          
          {/* Second Row - Time Series Chart */}
          <TimeSeriesChart />
          
          {/* Third Row - Legal Status and Citation Charts */}
          <div className="grid grid-cols-2 gap-6">
            <LegalStatusChart />
            <CitationChart />
          </div>
          
          {/* Bottom Row - Applicants and Owners Charts */}
          <div className="grid grid-cols-2 gap-6">
            <ApplicantsChart />
            <OwnersChart />
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