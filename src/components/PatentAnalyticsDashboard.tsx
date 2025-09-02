import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, Building2, Globe,
  Award, Download, RefreshCw, Info, BarChart3, PieChart as PieChartIcon,
  Activity, Lightbulb, Network
} from 'lucide-react';

interface PatentAnalyticsDashboardProps {
  onStartTour?: () => void;
}

interface AnalyticsData {
  trendData: Array<{ year: number; patents: number; growth: number }>;
  topAssignees: Array<{ name: string; count: number; country: string }>;
  topInventors: Array<{ name: string; count: number; location: string }>;
  classificationData: Array<{ section: string; title: string; count: number; percentage: number }>;
  jurisdictionData: Array<{ country: string; count: number; flag: string }>;
  technologyTrends: Array<{ technology: string; trend: number; patents: number }>;
  collaborationNetwork: Array<{ source: string; target: string; strength: number }>;
  citationAnalysis: Array<{ year: number; forward: number; backward: number }>;
}

export default function PatentAnalyticsDashboard({ onStartTour: _onStartTour }: PatentAnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1Y' | '3Y' | '5Y' | '10Y' | 'ALL'>('5Y');
  const [selectedMetric, setSelectedMetric] = useState<'patents' | 'citations' | 'inventors'>('patents');
  const [_expandedSections, _setExpandedSections] = useState<string[]>(['overview', 'trends']);
  const [refreshing, setRefreshing] = useState(false);

  /* const _toggleSection = (_sectionId: string) => {
    _setExpandedSections(prev => 
      prev.includes(_sectionId) 
        ? prev.filter(id => id !== _sectionId)
        : [...prev, _sectionId]
    );
  }; */

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange, selectedMetric]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call various analytics endpoints
      // For now, we'll generate comprehensive mock data
      
      const mockData: AnalyticsData = {
        trendData: [
          { year: 2019, patents: 125000, growth: 3.2 },
          { year: 2020, patents: 142000, growth: 13.6 },
          { year: 2021, patents: 158000, growth: 11.3 },
          { year: 2022, patents: 175000, growth: 10.8 },
          { year: 2023, patents: 198000, growth: 13.1 },
        ],
        topAssignees: [
          { name: 'International Business Machines Corp', count: 9043, country: 'US' },
          { name: 'Samsung Electronics Co Ltd', count: 8539, country: 'KR' },
          { name: 'Canon Inc', count: 3056, country: 'JP' },
          { name: 'Microsoft Corp', count: 2905, country: 'US' },
          { name: 'Intel Corp', count: 2867, country: 'US' },
          { name: 'Apple Inc', count: 2147, country: 'US' },
          { name: 'Huawei Technologies Co Ltd', count: 2035, country: 'CN' },
          { name: 'Google LLC', count: 1843, country: 'US' },
        ],
        topInventors: [
          { name: 'John Smith', count: 156, location: 'San Francisco, CA' },
          { name: 'Li Wei', count: 134, location: 'Beijing, CN' },
          { name: 'Sarah Johnson', count: 128, location: 'Austin, TX' },
          { name: 'Hiroshi Tanaka', count: 122, location: 'Tokyo, JP' },
          { name: 'Maria Rodriguez', count: 118, location: 'Barcelona, ES' },
        ],
        classificationData: [
          { section: 'G', title: 'Physics', count: 52000, percentage: 26.3 },
          { section: 'H', title: 'Electricity', count: 48000, percentage: 24.2 },
          { section: 'C', title: 'Chemistry; Metallurgy', count: 35000, percentage: 17.7 },
          { section: 'A', title: 'Human Necessities', count: 28000, percentage: 14.1 },
          { section: 'B', title: 'Operations; Transporting', count: 20000, percentage: 10.1 },
          { section: 'F', title: 'Mechanical Engineering', count: 10000, percentage: 5.1 },
          { section: 'E', title: 'Fixed Constructions', count: 3000, percentage: 1.5 },
          { section: 'D', title: 'Textiles; Paper', count: 2000, percentage: 1.0 },
        ],
        jurisdictionData: [
          { country: 'United States', count: 95000, flag: '🇺🇸' },
          { country: 'China', count: 48000, flag: '🇨🇳' },
          { country: 'Japan', count: 32000, flag: '🇯🇵' },
          { country: 'South Korea', count: 18000, flag: '🇰🇷' },
          { country: 'Germany', count: 15000, flag: '🇩🇪' },
          { country: 'United Kingdom', count: 8000, flag: '🇬🇧' },
        ],
        technologyTrends: [
          { technology: 'Artificial Intelligence', trend: 23.5, patents: 15420 },
          { technology: 'Machine Learning', trend: 31.2, patents: 12850 },
          { technology: 'Quantum Computing', trend: 67.8, patents: 3240 },
          { technology: 'Blockchain', trend: 12.4, patents: 5680 },
          { technology: '5G Technology', trend: 18.7, patents: 8920 },
          { technology: 'Autonomous Vehicles', trend: 15.3, patents: 7650 },
          { technology: 'Biotechnology', trend: 8.9, patents: 9840 },
          { technology: 'Renewable Energy', trend: 14.2, patents: 11200 },
        ],
        collaborationNetwork: [
          { source: 'IBM', target: 'MIT', strength: 45 },
          { source: 'Google', target: 'Stanford', strength: 38 },
          { source: 'Microsoft', target: 'Carnegie Mellon', strength: 32 },
          { source: 'Apple', target: 'UC Berkeley', strength: 28 },
        ],
        citationAnalysis: [
          { year: 2019, forward: 85000, backward: 120000 },
          { year: 2020, forward: 92000, backward: 135000 },
          { year: 2021, forward: 105000, backward: 148000 },
          { year: 2022, forward: 118000, backward: 162000 },
          { year: 2023, forward: 134000, backward: 178000 },
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patent analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patent Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">Comprehensive patent intelligence and insights</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1Y">Last 1 Year</option>
              <option value="3Y">Last 3 Years</option>
              <option value="5Y">Last 5 Years</option>
              <option value="10Y">Last 10 Years</option>
              <option value="ALL">All Time</option>
            </select>

            {/* Metric Selector */}
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="patents">Patents</option>
              <option value="citations">Citations</option>
              <option value="inventors">Inventors</option>
            </select>

            <button
              onClick={refreshData}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patents</p>
                <p className="text-3xl font-bold text-gray-900">198K</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +13.1% YoY
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Inventors</p>
                <p className="text-3xl font-bold text-gray-900">85.2K</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +8.7% YoY
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Organizations</p>
                <p className="text-3xl font-bold text-gray-900">12.4K</p>
                <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +5.2% YoY
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citations</p>
                <p className="text-3xl font-bold text-gray-900">1.2M</p>
                <p className="text-sm text-orange-600 flex items-center gap-1 mt-1">
                  <Activity className="w-4 h-4" />
                  +15.3% YoY
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Network className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Patent Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Patent Filing Trends</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Info className="w-4 h-4" />
              <span>5-year trend analysis</span>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData?.trendData}>
                <defs>
                  <linearGradient id="colorPatents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="patents" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorPatents)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Assignees */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Top Patent Assignees</h2>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData?.topAssignees.slice(0, 6)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" width={120} stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Technology Classification */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Technology Classification</h2>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData?.classificationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ section, percentage }) => `${section} (${percentage}%)`}
                  >
                    {analyticsData?.classificationData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Technology Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900">Emerging Technology Trends</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData?.technologyTrends.map((tech, _index) => (
              <div key={tech.technology} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{tech.technology}</h3>
                  <div className={`flex items-center gap-1 ${tech.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tech.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm font-medium">{tech.trend > 0 ? '+' : ''}{tech.trend}%</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{tech.patents.toLocaleString()}</p>
                <p className="text-sm text-gray-600">patents</p>
                
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (tech.trend / 70) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Geographic Distribution</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData?.jurisdictionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="country" stroke="#6b7280" angle={-45} textAnchor="end" height={60} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {analyticsData?.jurisdictionData.map((country, _index) => (
                <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-medium text-gray-900">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{country.count.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">patents</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Citation Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Network className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Citation Analysis</h2>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.citationAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="forward" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Forward Citations"
                />
                <Line 
                  type="monotone" 
                  dataKey="backward" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Backward Citations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}