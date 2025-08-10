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

export default function ApplicantsDashboard() {
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [currentChartConfig, setCurrentChartConfig] = useState<any>(null);
  
  // Sample data matching the screenshots
  const metrics = {
    patentRecords: '165,281,274',
    patentCitations: '482,259,938',
    citesPatents: '53,973,473',
    citedByPatents: '62,754,553',
    simpleFamilies: '93,379,056',
    extendedFamilies: '89,592,640'
  };

  // Top applicants with logos data
  const topApplicantsLogos = [
    { 
      name: 'Samsung Electronics CO LTD', 
      count: '820,848',
      logo: 'SAMSUNG',
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    },
    { 
      name: 'Canon KK', 
      count: '677,304',
      logo: 'Canon',
      bgColor: 'bg-red-600',
      textColor: 'text-white'
    },
    { 
      name: 'Matsushita Electric Ind CO LTD', 
      count: '593,755',
      logo: 'Panasonic',
      bgColor: 'bg-blue-700',
      textColor: 'text-white'
    },
    { 
      name: 'Hitachi LTD', 
      count: '584,306',
      logo: 'HITACHI',
      bgColor: 'bg-gray-800',
      textColor: 'text-white'
    },
    { 
      name: 'Mitsubishi Electric CORP', 
      count: '543,630',
      logo: 'MITSUBISHI ELECTRIC',
      bgColor: 'bg-red-500',
      textColor: 'text-white'
    },
    { 
      name: 'Siemens AG', 
      count: '516,251',
      logo: 'SIEMENS',
      bgColor: 'bg-teal-600',
      textColor: 'text-white'
    },
    { 
      name: 'IBM', 
      count: '509,219',
      logo: 'IBM',
      bgColor: 'bg-gray-800',
      textColor: 'text-white'
    },
    { 
      name: 'Sony CORP', 
      count: '472,997',
      logo: 'SONY',
      bgColor: 'bg-black',
      textColor: 'text-white'
    },
    { 
      name: 'Fujitsu LTD', 
      count: '419,522',
      logo: 'FUJITSU',
      bgColor: 'bg-red-600',
      textColor: 'text-white'
    },
    { 
      name: 'Huawei Tech CO LTD', 
      count: '404,381',
      logo: 'HUAWEI',
      bgColor: 'bg-red-700',
      textColor: 'text-white'
    },
    { 
      name: 'LG Electronics INC', 
      count: '398,106',
      logo: 'LG Electronics',
      bgColor: 'bg-red-600',
      textColor: 'text-white'
    },
    { 
      name: 'Bosch GMBH Robert', 
      count: '391,750',
      logo: 'BOSCH',
      bgColor: 'bg-gray-600',
      textColor: 'text-white'
    },
    { 
      name: 'Nec CORP', 
      count: '388,876',
      logo: 'NEC',
      bgColor: 'bg-blue-800',
      textColor: 'text-white'
    },
    { 
      name: 'Gen Electric', 
      count: '337,646',
      logo: 'GE',
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    },
    { 
      name: 'Qualcomm INC', 
      count: '330,853',
      logo: 'QUALCOMM',
      bgColor: 'bg-blue-700',
      textColor: 'text-white'
    }
  ];

  // Simple families data
  const simpleFamiliesData = [
    { name: 'Matsushita Electric Ind CO LTD', value: 400000 },
    { name: 'Hitachi LTD', value: 380000 },
    { name: 'Canon KK', value: 350000 },
    { name: 'Mitsubishi Electric CORP', value: 320000 },
    { name: 'Samsung Electronics CO LTD', value: 300000 },
    { name: 'Fujitsu LTD', value: 280000 },
    { name: 'Siemens AG', value: 260000 },
    { name: 'Sony CORP', value: 240000 },
    { name: 'IBM', value: 220000 },
    { name: 'Huawei Tech CO LTD', value: 200000 }
  ];

  // Citation data
  const citationData = [
    { name: 'IBM', value: 6000000 },
    { name: 'Samsung Electronics CO LTD', value: 5200000 },
    { name: 'Canon KK', value: 4800000 },
    { name: 'Hitachi LTD', value: 4400000 },
    { name: 'Microsoft CORP', value: 4000000 },
    { name: 'Sony CORP', value: 3600000 },
    { name: 'Gen Electric', value: 3200000 },
    { name: 'Matsushita Electric Ind CO LTD', value: 2800000 },
    { name: 'Ethicon Endo Surgery INC', value: 2400000 },
    { name: 'Mitsubishi Electric CORP', value: 2000000 }
  ];

  // Legal status data
  const legalStatusData = [
    {
      name: 'Samsung Electronics CO LTD',
      active: 200000, discontinued: 300000, pending: 200000, expired: 100000, inactive: 50000
    },
    {
      name: 'Canon KK',
      active: 150000, discontinued: 250000, pending: 180000, expired: 80000, inactive: 40000
    },
    {
      name: 'Matsushita Electric Ind CO LTD',
      active: 120000, discontinued: 200000, pending: 150000, expired: 70000, inactive: 35000
    },
    {
      name: 'Hitachi LTD',
      active: 100000, discontinued: 180000, pending: 140000, expired: 60000, inactive: 30000
    },
    {
      name: 'Mitsubishi Electric CORP',
      active: 90000, discontinued: 160000, pending: 130000, expired: 55000, inactive: 25000
    },
    {
      name: 'Siemens AG',
      active: 80000, discontinued: 140000, pending: 120000, expired: 50000, inactive: 20000
    },
    {
      name: 'IBM',
      active: 70000, discontinued: 120000, pending: 110000, expired: 45000, inactive: 18000
    },
    {
      name: 'Sony CORP',
      active: 60000, discontinued: 100000, pending: 100000, expired: 40000, inactive: 15000
    },
    {
      name: 'Fujitsu LTD',
      active: 50000, discontinued: 80000, pending: 90000, expired: 35000, inactive: 12000
    },
    {
      name: 'Huawei Tech CO LTD',
      active: 40000, discontinued: 60000, pending: 80000, expired: 30000, inactive: 10000
    }
  ];

  // Document type data
  const documentTypeData = [
    {
      name: 'Samsung Electronics CO LTD',
      designRight: 100000, patentApplication: 50000, unknownDocument: 30000,
      grantedPatent: 400000, limitedPatent: 20000, patentOfAddition: 15000, searchReport: 10000
    },
    {
      name: 'Canon KK',
      designRight: 80000, patentApplication: 40000, unknownDocument: 25000,
      grantedPatent: 350000, limitedPatent: 18000, patentOfAddition: 12000, searchReport: 8000
    },
    {
      name: 'Matsushita Electric Ind CO LTD',
      designRight: 70000, patentApplication: 35000, unknownDocument: 22000,
      grantedPatent: 300000, limitedPatent: 15000, patentOfAddition: 10000, searchReport: 7000
    },
    {
      name: 'Hitachi LTD',
      designRight: 65000, patentApplication: 32000, unknownDocument: 20000,
      grantedPatent: 280000, limitedPatent: 14000, patentOfAddition: 9000, searchReport: 6000
    },
    {
      name: 'Mitsubishi Electric CORP',
      designRight: 60000, patentApplication: 30000, unknownDocument: 18000,
      grantedPatent: 250000, limitedPatent: 12000, patentOfAddition: 8000, searchReport: 5000
    },
    {
      name: 'Siemens AG',
      designRight: 55000, patentApplication: 28000, unknownDocument: 16000,
      grantedPatent: 220000, limitedPatent: 10000, patentOfAddition: 7000, searchReport: 4500
    },
    {
      name: 'IBM',
      designRight: 50000, patentApplication: 25000, unknownDocument: 15000,
      grantedPatent: 200000, limitedPatent: 9000, patentOfAddition: 6000, searchReport: 4000
    },
    {
      name: 'Sony CORP',
      designRight: 45000, patentApplication: 22000, unknownDocument: 14000,
      grantedPatent: 180000, limitedPatent: 8000, patentOfAddition: 5500, searchReport: 3500
    },
    {
      name: 'Fujitsu LTD',
      designRight: 40000, patentApplication: 20000, unknownDocument: 12000,
      grantedPatent: 160000, limitedPatent: 7000, patentOfAddition: 5000, searchReport: 3000
    },
    {
      name: 'Huawei Tech CO LTD',
      designRight: 35000, patentApplication: 18000, unknownDocument: 10000,
      grantedPatent: 140000, limitedPatent: 6000, patentOfAddition: 4500, searchReport: 2500
    }
  ];

  // Country of residence data
  const countryData = [
    { country: 'Korea, Republic of', companies: [
      { name: 'Samsung Electronics CO LTD', value: 700000 },
      { name: 'LG Electronics INC', value: 400000 },
      { name: 'Hyundai Motor CO LTD', value: 200000 },
      { name: 'LG Chemical LTD', value: 150000 },
      { name: 'Samsung Display CO LTD', value: 120000 }
    ]},
    { country: 'United States', companies: [
      { name: 'IBM', value: 500000 },
      { name: 'Qualcomm INC', value: 300000 },
      { name: 'Gen Electric', value: 250000 },
      { name: 'Intel CORP', value: 200000 },
      { name: 'Procter & Gamble', value: 150000 }
    ]},
    { country: 'Japan', companies: [
      { name: 'Canon KK', value: 400000 },
      { name: 'Sony CORP', value: 350000 },
      { name: 'Mitsubishi Electric CORP', value: 300000 },
      { name: 'Toyota Motor CO LTD', value: 250000 },
      { name: 'Toshiba KK', value: 200000 }
    ]},
    { country: 'Germany', companies: [
      { name: 'Siemens AG', value: 350000 },
      { name: 'Bosch GMBH Robert', value: 300000 },
      { name: 'Bayer AG', value: 200000 },
      { name: 'Basf AG', value: 180000 },
      { name: 'Basf SE', value: 150000 }
    ]},
    { country: 'China', companies: [
      { name: 'Huawei Tech CO LTD', value: 300000 },
      { name: 'Zte CORP', value: 100000 },
      { name: 'Boe Technology Group CO LTD', value: 80000 },
      { name: 'Guangdong Oppo Mobile Telecomm...', value: 60000 },
      { name: 'Tencent Tech Shenzhen CO LTD', value: 40000 }
    ]}
  ];

  // CPC classification data
  const cpcData = [
    { class: 'H01L', companies: [
      { name: 'LG Chemical LTD', value: 40000 },
      { name: 'LG Energy Solution LTD', value: 38000 },
      { name: 'Samsung Sdi CO LTD', value: 35000 },
      { name: 'Toyota Motor CO LTD', value: 20000 },
      { name: 'Sanyo Electric CO', value: 18000 }
    ]},
    { class: 'A61B', companies: [
      { name: 'Novartis AG', value: 32000 },
      { name: 'Hoffmann La Roche', value: 30000 },
      { name: 'AstraZeneca Ab', value: 28000 },
      { name: 'Pfizer', value: 25000 },
      { name: 'Lilly CO Eli', value: 22000 }
    ]},
    { class: 'A61P', companies: [
      { name: 'Novartis AG', value: 30000 },
      { name: 'Hoffmann La Roche', value: 28000 },
      { name: 'Genentech INC', value: 25000 },
      { name: 'AstraZeneca Ab', value: 22000 },
      { name: 'Bristol Myers Squibb CO', value: 20000 }
    ]},
    { class: 'A61K', companies: [
      { name: 'Novartis AG', value: 28000 },
      { name: 'Hoffmann La Roche', value: 26000 },
      { name: 'AstraZeneca Ab', value: 24000 },
      { name: 'Pfizer', value: 22000 },
      { name: 'Janssen Pharmaceutica NV', value: 18000 }
    ]},
    { class: 'A61F', companies: [
      { name: 'Hoffmann La Roche', value: 25000 },
      { name: 'Novartis AG', value: 23000 },
      { name: 'Pfizer', value: 20000 },
      { name: 'Janssen Pharmaceutica NV', value: 18000 },
      { name: 'AstraZeneca Ab', value: 16000 }
    ]}
  ];

  const handleChartConfig = (chartType: string, title: string, metric?: string, facet?: string) => {
    setCurrentChartConfig({
      chartType,
      title,
      metric: metric || 'Document Count',
      facet: facet || 'Applicant Name Exact'
    });
    setConfigModalOpen(true);
  };

  const TopApplicantsGrid = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Top Applicants by Patent Documents</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Grid Chart', 'Top Applicants by Patent Documents', 'Document Count', 'Applicant Name Exact')}
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
      
      <div className="grid grid-cols-5 gap-4">
        {topApplicantsLogos.map((company, index) => (
          <div key={index} className="text-center">
            <div className={`${company.bgColor} ${company.textColor} rounded-lg p-4 mb-2 h-20 flex items-center justify-center text-xs font-bold`}>
              {company.logo}
            </div>
            <div className="text-sm text-gray-700 mb-1 truncate" title={company.name}>
              {company.name}
            </div>
            <div className="text-lg font-semibold text-teal-600">
              {company.count}
            </div>
          </div>
        ))}
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
          <h3 className="font-medium text-gray-900">Applicant Patent Documents over time</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Line Chart', 'Applicant Patent Documents over time', 'Document Count', 'Publication Date')}
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
          <span>50,000</span>
          <span>40,000</span>
          <span>30,000</span>
          <span>20,000</span>
          <span>10,000</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-16 h-full border-l border-b border-gray-200 relative">
          <svg viewBox="0 0 800 200" className="w-full h-full">
            {/* Grid lines */}
            <defs>
              <pattern id="applicant-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#applicant-grid)" />
            
            {/* Multiple trend lines for different applicants */}
            <path d="M 0 180 Q 100 160 200 140 Q 300 120 400 100 Q 500 80 600 60 Q 700 40 800 20" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 0 190 Q 100 170 200 150 Q 300 130 400 110 Q 500 90 600 70 Q 700 50 800 30" fill="none" stroke="#10b981" strokeWidth="2" />
            <path d="M 0 185 Q 100 165 200 145 Q 300 125 400 105 Q 500 85 600 65 Q 700 45 800 25" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <path d="M 0 195 Q 100 175 200 155 Q 300 135 400 115 Q 500 95 600 75 Q 700 55 800 35" fill="none" stroke="#ef4444" strokeWidth="2" />
            <path d="M 0 188 Q 100 168 200 148 Q 300 128 400 108 Q 500 88 600 68 Q 700 48 800 28" fill="none" stroke="#8b5cf6" strokeWidth="2" />
            <path d="M 0 192 Q 100 172 200 152 Q 300 132 400 112 Q 500 92 600 72 Q 700 52 800 32" fill="none" stroke="#06b6d4" strokeWidth="2" />
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

      <div className="mt-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Applicant Name Exact</div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Canon KK</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <span>Fujitsu LTD</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-teal-500 rounded"></div>
            <span>Hitachi LTD</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Huawei Tech CO LTD</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Matsushita Electric Ind CO LTD</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span>Mitsubishi Electric CORP</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-700 rounded"></div>
            <span>Samsung Electronics CO LTD</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-800 rounded"></div>
            <span>Siemens AG</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>Sony CORP</span>
          </div>
        </div>
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

  const HorizontalBarChart = ({ title, data, maxValue, colorClass }: any) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Horizontal Bar Chart', title, title.includes('Simple') ? 'Simple Family Size' : 'Sum Cited By Patent Count', 'Applicant Name Exact')}
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
        {data.map((item: any, index: number) => (
          <div key={index} className="flex items-center">
            <div className="w-48 text-xs text-gray-700 pr-2 truncate" title={item.name}>
              {item.name}
            </div>
            <div className="flex-1 flex h-4">
              <div 
                className={`${colorClass} h-full rounded-r`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
                title={`${item.value.toLocaleString()}`}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  const StackedBarChart = ({ title, data, legend }: any) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Stacked Bar Chart', title, 'Document Count', title.includes('Legal') ? 'Legal Status' : 'Document Type')}
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
        {data.slice(0, 10).map((item: any, index: number) => {
          const total = Object.values(item).reduce((sum: number, val: any) => typeof val === 'number' ? sum + val : sum, 0) as number;
          return (
            <div key={index} className="flex items-center">
              <div className="w-48 text-xs text-gray-700 pr-2 truncate" title={item.name}>
                {item.name}
              </div>
              <div className="flex-1 flex h-4 rounded overflow-hidden">
                {Object.entries(item).map(([key, value]: any, segIndex) => {
                  if (key === 'name' || typeof value !== 'number') return null;
                  const width = (value / total) * 100;
                  const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-cyan-500', 'bg-orange-500'];
                  return (
                    <div
                      key={segIndex}
                      className={`h-full ${colors[segIndex % colors.length]}`}
                      style={{ width: `${width}%` }}
                      title={`${key}: ${value.toLocaleString()}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {legend && (
        <div className="flex justify-center gap-4 mt-4 text-xs">
          {legend.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-1">
              <div className={`w-3 h-3 ${item.color} rounded`}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4">
        <button className="text-blue-600 text-xs hover:underline">📝</button>
      </div>
    </div>
  );

  const CountryChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Top Applicants by Country of Residence</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Grouped Bar Chart', 'Top Applicants by Country of Residence', 'Document Count', 'Country of Residence')}
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
        {countryData.map((country, countryIndex) => (
          <div key={countryIndex}>
            <div className="text-sm font-medium text-gray-700 mb-2 -rotate-90 origin-left w-4 h-20 flex items-center justify-end">
              {country.country}
            </div>
            <div className="space-y-1 ml-8">
              {country.companies.map((company, compIndex) => (
                <div key={compIndex} className="flex items-center">
                  <div className="w-48 text-xs text-gray-700 pr-2 truncate" title={company.name}>
                    {company.name}
                  </div>
                  <div className="flex-1 flex h-4">
                    <div 
                      className="bg-gray-400 h-full rounded-r"
                      style={{ width: `${(company.value / 700000) * 100}%` }}
                      title={`${company.value.toLocaleString()} patents`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-8 text-xs text-gray-500">
          <span>0</span>
          <span>100,000</span>
          <span>200,000</span>
          <span>300,000</span>
          <span>400,000</span>
          <span>500,000</span>
          <span>600,000</span>
          <span>700,000</span>
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

  const CPCChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Top Applicants by CPC Classification</h3>
          <button 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => handleChartConfig('Grouped Bar Chart', 'Top Applicants by CPC Classification', 'Document Count', 'CPC Classification')}
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
        {cpcData.map((classification, classIndex) => (
          <div key={classIndex}>
            <div className="text-sm font-medium text-gray-700 mb-2 -rotate-90 origin-left w-4 h-20 flex items-center justify-end">
              {classification.class}
            </div>
            <div className="space-y-1 ml-8">
              {classification.companies.map((company, compIndex) => (
                <div key={compIndex} className="flex items-center">
                  <div className="w-48 text-xs text-gray-700 pr-2 truncate" title={company.name}>
                    {company.name}
                  </div>
                  <div className="flex-1 flex h-4">
                    <div 
                      className="bg-orange-400 h-full rounded-r"
                      style={{ width: `${(company.value / 40000) * 100}%` }}
                      title={`${company.value.toLocaleString()} patents`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>0</span>
          <span>5,000</span>
          <span>10,000</span>
          <span>15,000</span>
          <span>20,000</span>
          <span>25,000</span>
          <span>30,000</span>
          <span>35,000</span>
          <span>40,000</span>
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

  const legalStatusLegend = [
    { label: 'Active', color: 'bg-red-500' },
    { label: 'Discontinued', color: 'bg-green-500' },
    { label: 'Pending', color: 'bg-yellow-500' },
    { label: 'Expired', color: 'bg-purple-500' },
    { label: 'Inactive', color: 'bg-cyan-500' },
    { label: 'Patented', color: 'bg-orange-500' },
    { label: 'Unknown', color: 'bg-gray-500' }
  ];

  const documentTypeLegend = [
    { label: 'Design Right', color: 'bg-blue-500' },
    { label: 'Granted Patent', color: 'bg-blue-400' },
    { label: 'Limited Patent', color: 'bg-blue-300' },
    { label: 'Patent Application', color: 'bg-orange-500' },
    { label: 'Patent of Addition', color: 'bg-orange-400' },
    { label: 'Unknown Document', color: 'bg-orange-300' },
    { label: 'Search Report', color: 'bg-orange-200' }
  ];

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
            <span className="text-red-600">👥</span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Applicants</h1>
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
          {/* Top Row - Logos Grid and Time Series */}
          <div className="grid grid-cols-2 gap-6">
            <TopApplicantsGrid />
            <TimeSeriesChart />
          </div>
          
          {/* Second Row - Simple Families and Citations */}
          <div className="grid grid-cols-2 gap-6">
            <HorizontalBarChart 
              title="Top Applicants by Simple Families" 
              data={simpleFamiliesData} 
              maxValue={400000}
              colorClass="bg-green-500"
            />
            <HorizontalBarChart 
              title="Top Applicants by Patent Citations" 
              data={citationData} 
              maxValue={6000000}
              colorClass="bg-green-500"
            />
          </div>
          
          {/* Third Row - Legal Status and Document Type */}
          <div className="grid grid-cols-2 gap-6">
            <StackedBarChart 
              title="Top Applicants by Legal Status" 
              data={legalStatusData}
              legend={legalStatusLegend}
            />
            <StackedBarChart 
              title="Top Applicants by Document Type" 
              data={documentTypeData}
              legend={documentTypeLegend}
            />
          </div>
          
          {/* Bottom Row - Country and CPC Classification */}
          <div className="grid grid-cols-2 gap-6">
            <CountryChart />
            <CPCChart />
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