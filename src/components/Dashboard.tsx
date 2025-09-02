import { useState } from 'react';
import { 
  Home, 
  MapPin, 
  Users, 
  User, 
  Scale, 
  Hash,
  Plus,
  Save,
  Share,
  BarChart3,
  Table,
  List,
  MoreHorizontal,
  X,
  Globe,
  AlertTriangle,
  HelpCircle,
  Settings,
  ChevronDown,
  Eye,
  Info
} from 'lucide-react';
import JurisdictionDashboard from './JurisdictionDashboard';
import ApplicantsDashboard from './ApplicantsDashboard';
import PatentCitationsDashboard from './PatentCitationsDashboard';
import LegalStatusDashboard from './LegalStatusDashboard';
import OwnersDashboard from './OwnersDashboard';

interface DashboardProps {
  onNavigate?: (section: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps = {}) {
  const [selectedDashboard, setSelectedDashboard] = useState('jurisdictions');
  const [viewMode, setViewMode] = useState('analysis');

  const dashboards = [
    { id: 'jurisdictions', label: 'Jurisdictions Dashboard', icon: MapPin },
    { id: 'applicants', label: 'Applicants Dashboard', icon: Users },
    { id: 'inventors', label: 'Inventors Dashboard', icon: User },
    { id: 'owners', label: 'Owners Dashboard', icon: Users },
    { id: 'legal-status', label: 'Legal Status Dashboard', icon: Scale },
    { id: 'citations', label: 'Citations Dashboard', icon: Hash }
  ];

  const legalStatusData = {
    pieChart: [
      { label: 'Active', value: 45, color: '#ef4444' },
      { label: 'Discontinued', value: 35, color: '#22c55e' },
      { label: 'Pending', value: 12, color: '#f59e0b' },
      { label: 'Inactive', value: 5, color: '#06b6d4' },
      { label: 'Expired', value: 2, color: '#8b5cf6' },
      { label: 'Unknown', value: 1, color: '#6b7280' }
    ],
    barChartData: [
      {
        jurisdiction: 'Slovenia',
        data: [
          { status: 'Active', value: 280000, color: '#ef4444' },
          { status: 'Expired', value: 120000, color: '#22c55e' },
          { status: 'Pending', value: 80000, color: '#f59e0b' },
          { status: 'Discontinued', value: 60000, color: '#22c55e' },
          { status: 'Inactive', value: 40000, color: '#06b6d4' }
        ]
      },
      {
        jurisdiction: 'Canada',
        data: [
          { status: 'Expired', value: 200000, color: '#22c55e' },
          { status: 'Discontinued', value: 180000, color: '#22c55e' },
          { status: 'Pending', value: 160000, color: '#f59e0b' },
          { status: 'Active', value: 140000, color: '#ef4444' },
          { status: 'Inactive', value: 60000, color: '#06b6d4' }
        ]
      },
      {
        jurisdiction: 'China',
        data: [
          { status: 'Discontinued', value: 280000, color: '#22c55e' },
          { status: 'Expired', value: 260000, color: '#22c55e' },
          { status: 'Pending', value: 200000, color: '#f59e0b' },
          { status: 'Active', value: 180000, color: '#ef4444' },
          { status: 'Inactive', value: 80000, color: '#06b6d4' }
        ]
      },
      {
        jurisdiction: 'Russian Fed.',
        data: [
          { status: 'Discontinued', value: 240000, color: '#22c55e' },
          { status: 'Expired', value: 200000, color: '#22c55e' },
          { status: 'Pending', value: 160000, color: '#f59e0b' },
          { status: 'Active', value: 120000, color: '#ef4444' },
          { status: 'Inactive', value: 40000, color: '#06b6d4' }
        ]
      },
      {
        jurisdiction: 'WashingtonDC',
        data: [
          { status: 'Discontinued', value: 220000, color: '#22c55e' },
          { status: 'Pending', value: 180000, color: '#f59e0b' },
          { status: 'Expired', value: 160000, color: '#22c55e' },
          { status: 'Active', value: 100000, color: '#ef4444' },
          { status: 'Inactive', value: 60000, color: '#06b6d4' }
        ]
      }
    ]
  };

  const PieChart = ({ data }: { data: any[] }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    const createPath = (percentage: number, cumulativePercent: number) => {
      const startAngle = (cumulativePercent * 360) - 90;
      const endAngle = ((cumulativePercent + percentage) * 360) - 90;
      
      const startAngleRad = (Math.PI / 180) * startAngle;
      const endAngleRad = (Math.PI / 180) * endAngle;
      
      const largeArcFlag = percentage > 0.5 ? 1 : 0;
      
      const x1 = 150 + (120 * Math.cos(startAngleRad));
      const y1 = 150 + (120 * Math.sin(startAngleRad));
      
      const x2 = 150 + (120 * Math.cos(endAngleRad));
      const y2 = 150 + (120 * Math.sin(endAngleRad));
      
      return `M 150 150 L ${x1} ${y1} A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };

    return (
      <div className="flex items-center gap-6">
        <svg width="300" height="300" className="transform">
          <circle cx="150" cy="150" r="40" fill="white" />
          {data.map((item, index) => {
            const percentage = item.value / total;
            const path = createPath(percentage, cumulativePercentage);
            cumulativePercentage += percentage;
            
            return (
              <path
                key={`pie-${index}`}
                d={path}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StackedBarChart = ({ data }: { data: any }) => {
    const maxValue = Math.max(...data.map((item: any) => 
      item.data.reduce((sum: number, d: any) => sum + d.value, 0)
    ));

    return (
      <div className="space-y-4">
        {data.map((item: any, itemIndex: number) => (
          <div key={`bar-${itemIndex}`} className="space-y-1">
            <div className="text-sm font-medium text-gray-700 w-24 text-right">
              {item.jurisdiction}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 text-xs text-gray-500 text-right">
                {item.jurisdiction}
              </div>
              <div className="flex-1 h-8 bg-gray-100 rounded overflow-hidden flex">
                {item.data.map((segment: any, segIndex: number) => {
                  const width = (segment.value / maxValue) * 100;
                  return (
                    <div
                      key={segIndex}
                      className="h-full transition-all hover:opacity-80"
                      style={{ 
                        width: `${width}%`, 
                        backgroundColor: segment.color 
                      }}
                      title={`${segment.status}: ${segment.value.toLocaleString()}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex items-center justify-center pt-4">
          <div className="text-xs text-gray-500">Document Count</div>
        </div>
        
        <div className="flex justify-center gap-4 text-xs pt-2">
          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded"></div>
              <span>Discontinued</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-500 rounded"></div>
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded"></div>
              <span>Expired</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-500 rounded"></div>
              <span>Unknown</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TimeSeriesChart = () => {
    const years = [];
    for (let year = 1960; year <= 2025; year += 5) {
      years.push(year);
    }

    return (
      <div className="space-y-4">
        <div className="relative h-64 border border-gray-200 rounded bg-white p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
            <span>9,000,000</span>
            <span>8,000,000</span>
            <span>7,000,000</span>
            <span>6,000,000</span>
            <span>5,000,000</span>
            <span>4,000,000</span>
            <span>3,000,000</span>
            <span>2,000,000</span>
            <span>1,000,000</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-16 h-full">
            <div className="h-full flex items-end justify-between gap-0.5">
              {years.map((_, yearIndex) => {
                const height1 = Math.random() * 60 + 20;
                const height2 = Math.random() * 40 + 10;
                const height3 = Math.random() * 30 + 5;
                const height4 = Math.random() * 20 + 5;
                
                return (
                  <div key={`year-${yearIndex}`} className="flex flex-col items-end" style={{ width: '12px' }}>
                    <div className="flex flex-col w-full">
                      <div className="bg-red-500 w-full transition-all hover:opacity-80" style={{ height: `${height1}%` }} />
                      <div className="bg-green-500 w-full transition-all hover:opacity-80" style={{ height: `${height2}%` }} />
                      <div className="bg-orange-500 w-full transition-all hover:opacity-80" style={{ height: `${height3}%` }} />
                      <div className="bg-cyan-500 w-full transition-all hover:opacity-80" style={{ height: `${height4}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2 ml-16">
            {years.map((year) => (
              <span key={year}>{year}</span>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-2">Publication Date</div>
          <div className="text-xs text-gray-500 mb-4">Legal Status</div>
          
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded"></div>
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded"></div>
              <span>Expired</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-500 rounded"></div>
              <span>Discontinued</span>
            </div>
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

  const WorldMap = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-yellow-100 to-green-100 rounded-lg p-4 h-64 flex items-center justify-center relative overflow-hidden">
        <Globe className="w-32 h-32 text-green-400 opacity-50" />
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white rounded p-2 shadow text-xs">
          <div className="font-medium mb-2">Percent of patents not in Force</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-4 h-2 bg-red-400"></div>
              <span className="ml-1">20</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-2 bg-orange-400"></div>
              <span className="ml-1">40</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-2 bg-yellow-400"></div>
              <span className="ml-1">60</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-2 bg-green-400"></div>
              <span className="ml-1">80</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-2 bg-green-600"></div>
              <span className="ml-1">100</span>
            </div>
          </div>
        </div>
        
        {/* Sample data points */}
        <div className="absolute top-8 right-8 text-xs bg-green-500 text-white px-2 py-1 rounded">
          United States
        </div>
        <div className="absolute bottom-16 left-16 text-xs bg-yellow-500 text-white px-2 py-1 rounded">
          Germany
        </div>
        <div className="absolute top-12 left-1/3 text-xs bg-red-500 text-white px-2 py-1 rounded">
          China
        </div>
      </div>
      
      <div className="text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <strong>This view shows patent legal enforceability by jurisdiction.</strong> This is calculated by classifying any patents with a legal status of "Expired", "Discontinued" or "Inactive" as "Not in Force", and any with a status of "Active" as "In Force". Statuses of Pending and Unknown are disregarded. 
            <button className="text-blue-600 hover:underline ml-1">Read More</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Dashboards */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">DASHBOARDS</span>
            <div className="ml-auto flex items-center gap-1">
              {onNavigate && (
                <button
                  onClick={() => onNavigate('dashboards-support')}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Get help with Dashboards"
                >
                  <Info className="w-4 h-4" />
                </button>
              )}
              <button className="p-1 hover:bg-gray-100 rounded">
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">No Dashboards</span>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Our suite of analysis and visualization tools enable real-time discovery and analysis. Dashboards can be saved, presented and shared via LinkedIn, Twitter, Facebook or email.
            </p>
          </div>

          <div className="mb-6">
            <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <Settings className="w-4 h-4" />
              Explore Presets
            </button>
          </div>

          <div className="space-y-1">
            {dashboards.map((dashboard) => {
              const IconComponent = dashboard.icon;
              return (
                <div
                  key={dashboard.id}
                  onClick={() => setSelectedDashboard(dashboard.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${
                    selectedDashboard === dashboard.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{dashboard.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {selectedDashboard === 'jurisdictions' ? (
          <JurisdictionDashboard />
        ) : selectedDashboard === 'applicants' ? (
          <ApplicantsDashboard />
        ) : selectedDashboard === 'citations' ? (
          <PatentCitationsDashboard />
        ) : selectedDashboard === 'owners' ? (
          <OwnersDashboard />
        ) : selectedDashboard === 'legal-status' ? (
          <LegalStatusDashboard />
        ) : (
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Home className="w-4 h-4" />
            <span>165,281,274 Patents (93,379,056 Simple families)</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Legal Status</h1>
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Explore Science, Technology & Innovation...</span>
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-2">
                Search
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dashboard Type Selector */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-4">
              <span className="font-medium">DASHBOARDS</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Legal Status</h2>
            
            {/* Search Type Selector */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Patents</span>
                <span className="text-sm text-blue-600">(165,281,274)</span>
              </div>
              <span className="text-gray-400">=</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">All Docs</span>
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
                <div className="text-2xl font-bold text-gray-900">165,281,274</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 text-sm font-medium mb-1">Patent Citations</div>
                <div className="text-2xl font-bold text-gray-900">482,259,938</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 text-sm font-medium mb-1">Cites Patents</div>
                <div className="text-2xl font-bold text-gray-900">53,973,473</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 text-sm font-medium mb-1">Cited By Patents</div>
                <div className="text-2xl font-bold text-gray-900">62,754,553</div>
              </div>
              <div className="text-center">
                <div className="text-teal-600 text-sm font-medium mb-1">Simple Families</div>
                <div className="text-2xl font-bold text-gray-900">93,379,056</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 text-sm font-medium mb-1">Extended Families</div>
                <div className="text-2xl font-bold text-gray-900">89,592,640</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-4">
              <button 
                className={`px-3 py-2 text-sm font-medium border-b-2 ${
                  viewMode === 'patents' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setViewMode('patents')}
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

          {/* World Map */}
          <div className="mb-8">
            <WorldMap />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Top Legal Status</h3>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">by Document Count</span>
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
              
              <PieChart data={legalStatusData.pieChart} />
            </div>

            {/* Time Series Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">X: Publication Date</span>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">Y: Document Count</span>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">Colour: Legal Status</span>
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
              
              <TimeSeriesChart />
            </div>
          </div>

          {/* Stacked Bar Charts */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Left Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Top Legal Status</h3>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">by Applicant Name Exact</span>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">compared by Document Count</span>
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
              
              <StackedBarChart data={legalStatusData.barChartData.slice(0, 3)} />
            </div>

            {/* Right Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Top Legal Status</h3>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">by Owner Name Exact</span>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">compared by Document Count</span>
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
              
              <StackedBarChart data={legalStatusData.barChartData.slice(2, 5)} />
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}