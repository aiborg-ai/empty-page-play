import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  MapPin, 
  TrendingUp, 
  Users, 
  Building, 
  Zap,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Calendar,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';
import PageHeader from './PageHeader';
import HarmonizedCard from './HarmonizedCard';

interface RegionData {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  innovationScore: number;
  patentCount: number;
  growthRate: number;
  competitorCount: number;
  technologyClusters: string[];
  keyCompanies: string[];
  averagePatentQuality: number;
  investmentLevel: number;
  talentIndex: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface TechnologyCluster {
  id: string;
  technology: string;
  regions: string[];
  intensity: number;
  growthTrend: number;
  patentDensity: number;
  keyPlayers: string[];
  emergingHubs: string[];
}

// interface _TimelapseFrame { // Unused - for future timelapse feature
//   year: number;
//   data: RegionData[];
//   keyEvents: string[];
// }

const InnovationHeatmap: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'global' | 'regional' | 'clusters'>('global');
  const [selectedMetric, setSelectedMetric] = useState<'innovation' | 'patents' | 'growth' | 'investment'>('innovation');
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [isTimelapseRunning, setIsTimelapseRunning] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState(2024);
  const [_showClusters, _setShowClusters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for regional innovation
  const regionData: RegionData[] = [
    {
      id: '1',
      name: 'Silicon Valley',
      country: 'United States',
      lat: 37.4419,
      lng: -122.1430,
      innovationScore: 97,
      patentCount: 15847,
      growthRate: 23.4,
      competitorCount: 1247,
      technologyClusters: ['AI/ML', 'Semiconductor', 'Software', 'Robotics'],
      keyCompanies: ['Apple', 'Google', 'Meta', 'Tesla', 'NVIDIA'],
      averagePatentQuality: 87,
      investmentLevel: 94,
      talentIndex: 96,
      riskLevel: 'medium'
    },
    {
      id: '2',
      name: 'Shenzhen',
      country: 'China',
      lat: 22.5431,
      lng: 114.0579,
      innovationScore: 89,
      patentCount: 21436,
      growthRate: 31.7,
      competitorCount: 892,
      technologyClusters: ['Hardware', 'IoT', 'Telecommunications', 'Manufacturing'],
      keyCompanies: ['Huawei', 'Tencent', 'BYD', 'DJI', 'OnePlus'],
      averagePatentQuality: 72,
      investmentLevel: 87,
      talentIndex: 84,
      riskLevel: 'high'
    },
    {
      id: '3',
      name: 'Tel Aviv',
      country: 'Israel',
      lat: 32.0853,
      lng: 34.7818,
      innovationScore: 92,
      patentCount: 3247,
      growthRate: 28.9,
      competitorCount: 534,
      technologyClusters: ['Cybersecurity', 'Fintech', 'Biotech', 'Defense Tech'],
      keyCompanies: ['Check Point', 'Mobileye', 'Wix', 'Nice', 'Fiverr'],
      averagePatentQuality: 91,
      investmentLevel: 89,
      talentIndex: 93,
      riskLevel: 'low'
    },
    {
      id: '4',
      name: 'London',
      country: 'United Kingdom',
      lat: 51.5074,
      lng: -0.1278,
      innovationScore: 85,
      patentCount: 7891,
      growthRate: 19.2,
      competitorCount: 743,
      technologyClusters: ['Fintech', 'AI/ML', 'Clean Energy', 'Biotech'],
      keyCompanies: ['ARM', 'DeepMind', 'Revolut', 'Monzo', 'BenevolentAI'],
      averagePatentQuality: 84,
      investmentLevel: 82,
      talentIndex: 88,
      riskLevel: 'low'
    },
    {
      id: '5',
      name: 'Bangalore',
      country: 'India',
      lat: 12.9716,
      lng: 77.5946,
      innovationScore: 78,
      patentCount: 4523,
      growthRate: 34.6,
      competitorCount: 654,
      technologyClusters: ['Software', 'Aerospace', 'Biotech', 'Space Tech'],
      keyCompanies: ['Infosys', 'Wipro', 'Biocon', 'ISRO', 'Flipkart'],
      averagePatentQuality: 76,
      investmentLevel: 73,
      talentIndex: 81,
      riskLevel: 'medium'
    },
    {
      id: '6',
      name: 'Tokyo',
      country: 'Japan',
      lat: 35.6762,
      lng: 139.6503,
      innovationScore: 88,
      patentCount: 18932,
      growthRate: 15.3,
      competitorCount: 1156,
      technologyClusters: ['Robotics', 'Automotive', 'Electronics', 'Gaming'],
      keyCompanies: ['Sony', 'Toyota', 'SoftBank', 'Nintendo', 'Honda'],
      averagePatentQuality: 89,
      investmentLevel: 85,
      talentIndex: 87,
      riskLevel: 'low'
    }
  ];

  // Mock data for technology clusters
  const technologyClusters: TechnologyCluster[] = [
    {
      id: '1',
      technology: 'Artificial Intelligence',
      regions: ['Silicon Valley', 'London', 'Tel Aviv', 'Bangalore'],
      intensity: 94,
      growthTrend: 47.3,
      patentDensity: 1247,
      keyPlayers: ['Google', 'Microsoft', 'Meta', 'DeepMind'],
      emergingHubs: ['Montreal', 'Edinburgh', 'Toronto']
    },
    {
      id: '2',
      technology: 'Quantum Computing',
      regions: ['Silicon Valley', 'Tokyo', 'London'],
      intensity: 82,
      growthTrend: 67.8,
      patentDensity: 234,
      keyPlayers: ['IBM', 'Google', 'Rigetti', 'IonQ'],
      emergingHubs: ['Waterloo', 'Vienna', 'Delft']
    },
    {
      id: '3',
      technology: 'Autonomous Vehicles',
      regions: ['Silicon Valley', 'Tokyo', 'Shenzhen'],
      intensity: 89,
      growthTrend: 41.2,
      patentDensity: 892,
      keyPlayers: ['Tesla', 'Waymo', 'Toyota', 'BYD'],
      emergingHubs: ['Munich', 'Stockholm', 'Phoenix']
    },
    {
      id: '4',
      technology: 'Fintech',
      regions: ['London', 'Tel Aviv', 'Singapore'],
      intensity: 91,
      growthTrend: 38.9,
      patentDensity: 567,
      keyPlayers: ['Stripe', 'Square', 'Revolut', 'Klarna'],
      emergingHubs: ['Berlin', 'Amsterdam', 'Hong Kong']
    }
  ];

  // Removed unused timelapse data array

  // Timelapse functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimelapseRunning) {
      interval = setInterval(() => {
        setCurrentTimeframe(prev => {
          const nextYear = prev + 1;
          if (nextYear > 2024) {
            setIsTimelapseRunning(false);
            return 2020;
          }
          return nextYear;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isTimelapseRunning]);

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const getMetricValue = (region: RegionData) => {
    switch (selectedMetric) {
      case 'innovation': return region.innovationScore;
      case 'patents': return region.patentCount;
      case 'growth': return region.growthRate;
      case 'investment': return region.investmentLevel;
      default: return region.innovationScore;
    }
  };

  const getMetricColor = (value: number, metric: string) => {
    let intensity;
    switch (metric) {
      case 'innovation':
        intensity = Math.min(100, value) / 100;
        break;
      case 'patents':
        intensity = Math.min(25000, value) / 25000;
        break;
      case 'growth':
        intensity = Math.min(50, value) / 50;
        break;
      case 'investment':
        intensity = Math.min(100, value) / 100;
        break;
      default:
        intensity = value / 100;
    }
    
    const opacity = 0.3 + (intensity * 0.7);
    return `rgba(59, 130, 246, ${opacity})`;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Innovation Heatmap"
        subtitle="Geographic visualization of global innovation activity and technology clusters"
        breadcrumb={['Analytics', 'Innovation Heatmap']}
      />

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">View:</span>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="global">Global Overview</option>
                <option value="regional">Regional Analysis</option>
                <option value="clusters">Technology Clusters</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Metric:</span>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="innovation">Innovation Score</option>
                <option value="patents">Patent Count</option>
                <option value="growth">Growth Rate</option>
                <option value="investment">Investment Level</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{currentTimeframe}</span>
            </div>
            <button
              onClick={() => setIsTimelapseRunning(!isTimelapseRunning)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isTimelapseRunning 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isTimelapseRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimelapseRunning ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => {
                setCurrentTimeframe(2020);
                setIsTimelapseRunning(false);
              }}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {selectedView === 'global' ? 'Global Innovation Map' :
                 selectedView === 'regional' ? 'Regional Analysis' : 'Technology Clusters'}
              </h3>
            </div>
            
            {/* Simplified Map Representation */}
            <div className="p-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 min-h-[400px] relative overflow-hidden">
                {/* World map placeholder with innovation hotspots */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" viewBox="0 0 800 400" className="text-gray-300">
                    <rect width="800" height="400" fill="currentColor" />
                  </svg>
                </div>
                
                {/* Innovation hotspots */}
                <div className="relative z-10 h-full">
                  {regionData.map((region) => {
                    const size = getMetricValue(region) / (selectedMetric === 'patents' ? 500 : 10);
                    const color = getMetricColor(getMetricValue(region), selectedMetric);
                    
                    return (
                      <div
                        key={region.id}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                        style={{
                          left: `${((region.lng + 180) / 360) * 100}%`,
                          top: `${((90 - region.lat) / 180) * 100}%`,
                          width: `${Math.max(20, Math.min(60, size))}px`,
                          height: `${Math.max(20, Math.min(60, size))}px`,
                          backgroundColor: color,
                          borderRadius: '50%',
                          border: '2px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                        onClick={() => setSelectedRegion(region)}
                        title={`${region.name}: ${getMetricValue(region)}`}
                      >
                        <div className="w-full h-full rounded-full animate-pulse" 
                             style={{ backgroundColor: color, opacity: 0.6 }} />
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Intensity
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                    <span className="text-xs text-gray-600">Low</span>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-600">Medium</span>
                    <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                    <span className="text-xs text-gray-600">High</span>
                  </div>
                </div>

                {/* Current year indicator */}
                <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                  <div className="text-lg font-bold text-gray-900">{currentTimeframe}</div>
                  <div className="text-xs text-gray-600">Current Year</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Selected Region Details */}
          {selectedRegion && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {selectedRegion.name}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Country</span>
                  <span className="font-medium text-gray-900">{selectedRegion.country}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Innovation Score</span>
                  <span className="font-medium text-gray-900">{selectedRegion.innovationScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Patent Count</span>
                  <span className="font-medium text-gray-900">{selectedRegion.patentCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <span className="font-medium text-green-600">+{selectedRegion.growthRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span className={`font-medium ${getRiskColor(selectedRegion.riskLevel)}`}>
                    {selectedRegion.riskLevel.charAt(0).toUpperCase() + selectedRegion.riskLevel.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Technology Clusters</div>
                <div className="flex flex-wrap gap-1">
                  {selectedRegion.technologyClusters.map((cluster) => (
                    <span
                      key={cluster}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {cluster}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Key Companies</div>
                <div className="space-y-1">
                  {selectedRegion.keyCompanies.slice(0, 3).map((company) => (
                    <div key={company} className="text-sm text-gray-600">{company}</div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedRegion(null)}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close Details
              </button>
            </div>
          )}

          {/* Technology Clusters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Hot Technology Clusters
            </h3>
            <div className="space-y-3">
              {technologyClusters.slice(0, 4).map((cluster) => (
                <div key={cluster.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{cluster.technology}</div>
                    <div className="text-xs text-gray-600">{cluster.regions.length} regions</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600 text-sm">+{cluster.growthTrend}%</div>
                    <div className="text-xs text-gray-500">growth</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Global Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {regionData.reduce((sum, r) => sum + r.patentCount, 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Total Patents</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(regionData.reduce((sum, r) => sum + r.innovationScore, 0) / regionData.length)}
                </div>
                <div className="text-xs text-gray-600">Avg Innovation</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  +{Math.round(regionData.reduce((sum, r) => sum + r.growthRate, 0) / regionData.length)}%
                </div>
                <div className="text-xs text-gray-600">Avg Growth</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {regionData.reduce((sum, r) => sum + r.competitorCount, 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Competitors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Cards View */}
      {selectedView === 'regional' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Regional Innovation Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionData.map((region) => (
              <HarmonizedCard
                key={region.id}
                title={region.name}
                description={`Innovation hub in ${region.country} with ${region.technologyClusters.length} major technology clusters and ${region.competitorCount} active competitors.`}
                stats={[
                  {
                    label: 'Innovation Score',
                    value: region.innovationScore,
                    icon: TrendingUp,
                    color: 'text-blue-600'
                  },
                  {
                    label: 'Patent Count',
                    value: region.patentCount.toLocaleString(),
                    icon: BarChart3,
                    color: 'text-green-600'
                  },
                  {
                    label: 'Growth Rate',
                    value: `+${region.growthRate}%`,
                    icon: Activity,
                    color: 'text-purple-600'
                  }
                ]}
                keywords={[
                  { label: `Score: ${region.innovationScore}`, color: 'blue' },
                  { label: `Growth: +${region.growthRate}%`, color: 'green' },
                  { label: `Risk: ${region.riskLevel}`, color: region.riskLevel === 'low' ? 'green' : region.riskLevel === 'medium' ? 'yellow' : 'red' }
                ]}
                attributes={[
                  { label: 'Talent Index', value: `${region.talentIndex}/100`, icon: Users },
                  { label: 'Investment Level', value: `${region.investmentLevel}%`, icon: Target }
                ]}
                actions={[
                  {
                    id: 'view-details',
                    label: 'View Details',
                    icon: Eye,
                    onClick: () => setSelectedRegion(region),
                    isPrimary: true,
                    variant: 'primary'
                  }
                ]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Technology Clusters View */}
      {selectedView === 'clusters' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Technology Cluster Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technologyClusters.map((cluster) => (
              <HarmonizedCard
                key={cluster.id}
                title={cluster.technology}
                description={`Technology cluster spanning ${cluster.regions.length} major regions with ${cluster.keyPlayers.length} key players and ${cluster.emergingHubs.length} emerging hubs.`}
                stats={[
                  {
                    label: 'Intensity Score',
                    value: cluster.intensity,
                    icon: Activity,
                    color: 'text-purple-600'
                  },
                  {
                    label: 'Growth Trend',
                    value: `+${cluster.growthTrend}%`,
                    icon: TrendingUp,
                    color: 'text-green-600'
                  },
                  {
                    label: 'Patent Density',
                    value: cluster.patentDensity.toLocaleString(),
                    icon: BarChart3,
                    color: 'text-blue-600'
                  }
                ]}
                keywords={[
                  { label: `Intensity: ${cluster.intensity}`, color: 'purple' },
                  { label: `+${cluster.growthTrend}% growth`, color: 'green' },
                  { label: `${cluster.regions.length} regions`, color: 'blue' }
                ]}
                attributes={[
                  { label: 'Key Players', value: cluster.keyPlayers.join(', '), icon: Building },
                  { label: 'Emerging Hubs', value: cluster.emergingHubs.join(', '), icon: MapPin }
                ]}
                actions={[
                  {
                    id: 'analyze',
                    label: 'Deep Analysis',
                    icon: Target,
                    onClick: () => console.log('Analyze cluster', cluster.id),
                    isPrimary: true,
                    variant: 'primary'
                  }
                ]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InnovationHeatmap;