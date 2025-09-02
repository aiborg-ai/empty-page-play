/**
 * Innovation Pulse Monitor - Real-time Global Innovation Tracking
 * Shows the heartbeat of innovation across the world with predictive analytics
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  Activity,
  Globe,
  TrendingUp,
  TrendingDown,
  Zap,
  Users,
  DollarSign,
  Network,
  AlertTriangle,
  Play,
  Pause,
  RotateCw,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import {
  InnovationPulse,
  InnovationHotspot
} from '../types/innovationIntelligence';
import InnovationIntelligenceService from '../lib/innovationIntelligenceService';
import SearchFilterBar from './common/SearchFilterBar';
import { useSearchFilter } from '../hooks/useSearchFilter';

interface InnovationPulseMonitorProps {
  onNavigate?: (section: string) => void;
}

interface PulseGlobeProps {
  pulseData: InnovationPulse[];
  hotspots: InnovationHotspot[];
  isRealTime: boolean;
  selectedRegion?: string;
  onRegionSelect: (region: string) => void;
}

interface PulseVisualizationProps {
  pulse: InnovationPulse;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

interface HotspotVisualizationProps {
  hotspot: InnovationHotspot;
  isAnimating: boolean;
}

// Country coordinates for globe visualization
const COUNTRY_COORDINATES: Record<string, [number, number, number]> = {
  'United States': [0, 0, 25],
  'China': [15, 5, 20],
  'Japan': [20, 8, 18],
  'Germany': [-10, 12, 22],
  'South Korea': [18, 7, 19],
  'United Kingdom': [-8, 15, 23],
  'France': [-6, 13, 22],
  'Canada': [-5, 0, 24],
  'India': [12, 3, 20],
  'Israel': [5, 8, 21],
  'Taiwan': [17, 6, 19],
  'Singapore': [15, 1, 19],
  'Sweden': [-2, 18, 21],
  'Switzerland': [-3, 12, 22]
};

// Pulse Visualization Component
function PulseVisualization({ pulse, position, isSelected, onClick }: PulseVisualizationProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current && ringRef.current) {
      // Pulse animation based on innovation activity
      const pulseIntensity = pulse.pulse_score / 100;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * pulseIntensity * 0.3;
      meshRef.current.scale.setScalar(scale);
      
      // Ring rotation
      ringRef.current.rotation.z += delta * (1 + pulseIntensity);
      
      // Color based on trend direction
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const targetColor = getTrendColor(pulse.trend_direction);
      material.color.lerp(new THREE.Color(targetColor), delta * 2);
    }
  });

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'accelerating': return '#00FF00';
      case 'emerging': return '#FFD700';
      case 'stable': return '#4A90E2';
      case 'declining': return '#FF6B6B';
      default: return '#FFFFFF';
    }
  };

  const radius = Math.max(0.5, pulse.pulse_score / 100 * 2);

  return (
    <group position={position} onClick={onClick}>
      {/* Main pulse sphere */}
      <Sphere ref={meshRef} args={[radius]}>
        <meshStandardMaterial
          color={getTrendColor(pulse.trend_direction)}
          transparent
          opacity={isSelected ? 0.9 : 0.7}
          emissive={getTrendColor(pulse.trend_direction)}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
      </Sphere>

      {/* Pulse ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[radius * 1.5, 0.1, 8, 32]} />
        <meshStandardMaterial
          color={getTrendColor(pulse.trend_direction)}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Anomaly indicator */}
      {pulse.anomaly_detection && (
        <Sphere args={[radius * 0.3]} position={[0, radius * 1.5, 0]}>
          <meshStandardMaterial
            color="#FF0000"
            emissive="#FF0000"
            emissiveIntensity={0.5}
          />
        </Sphere>
      )}

      {/* Region label */}
      <Text
        position={[0, -radius * 2, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {pulse.region}
      </Text>

      {/* Pulse score */}
      <Text
        position={[0, -radius * 2.5, 0]}
        fontSize={0.2}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
      >
        {pulse.pulse_score.toFixed(1)}
      </Text>
    </group>
  );
}

// Hotspot Visualization Component
function HotspotVisualization({ hotspot, isAnimating }: HotspotVisualizationProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && isAnimating) {
      groupRef.current.rotation.y += delta * 0.5;
      
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      groupRef.current.scale.setScalar(scale);
    }
  });

  const position: [number, number, number] = [
    hotspot.center[0] * 0.3,
    hotspot.center[1] * 0.3,
    25
  ];

  return (
    <group ref={groupRef} position={position}>
      {/* Hotspot core */}
      <Sphere args={[hotspot.radius * 0.1]}>
        <meshStandardMaterial
          color="#FF4500"
          transparent
          opacity={0.8}
          emissive="#FF4500"
          emissiveIntensity={0.4}
        />
      </Sphere>

      {/* Heat waves */}
      {[0, 1, 2].map((ring) => (
        <mesh key={ring} rotation={[0, 0, ring * Math.PI / 3]}>
          <torusGeometry
            args={[
              hotspot.radius * 0.1 * (1 + ring * 0.5),
              0.05,
              8,
              32
            ]}
          />
          <meshStandardMaterial
            color="#FF6500"
            transparent
            opacity={0.3 - ring * 0.1}
          />
        </mesh>
      ))}

      {/* Technologies label */}
      <Text
        position={[0, -hotspot.radius * 0.2, 0]}
        fontSize={0.15}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {hotspot.technologies.slice(0, 2).join(', ')}
      </Text>
    </group>
  );
}

// Globe Component
function PulseGlobe({
  pulseData,
  hotspots,
  isRealTime,
  selectedRegion,
  onRegionSelect
}: PulseGlobeProps) {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (globeRef.current && isRealTime) {
      globeRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Earth Globe */}
      <Sphere ref={globeRef} args={[20]}>
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.6}
          wireframe={true}
        />
      </Sphere>

      {/* Pulse Visualizations */}
      {pulseData.map((pulse) => {
        const coordinates = COUNTRY_COORDINATES[pulse.region];
        if (!coordinates) return null;

        return (
          <PulseVisualization
            key={pulse.id}
            pulse={pulse}
            position={coordinates}
            isSelected={selectedRegion === pulse.region}
            onClick={() => onRegionSelect(pulse.region)}
          />
        );
      })}

      {/* Hotspot Visualizations */}
      {hotspots.map((hotspot) => (
        <HotspotVisualization
          key={hotspot.id}
          hotspot={hotspot}
          isAnimating={isRealTime}
        />
      ))}

      {/* Connection lines between high-activity regions */}
      {pulseData
        .filter(p => p.pulse_score > 50)
        .slice(0, 5)
        .map((pulse, index) => {
          const nextPulse = pulseData.filter(p => p.pulse_score > 50)[index + 1];
          if (!nextPulse) return null;

          const startPos = COUNTRY_COORDINATES[pulse.region];
          const endPos = COUNTRY_COORDINATES[nextPulse.region];
          if (!startPos || !endPos) return null;

          return (
            <line key={`connection-${index}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([...startPos, ...endPos])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#00FF88" transparent opacity={0.4} />
            </line>
          );
        })}
    </group>
  );
}

// Main Innovation Pulse Monitor Component
export default function InnovationPulseMonitor({ onNavigate }: InnovationPulseMonitorProps) {
  const [pulseData, setPulseData] = useState<InnovationPulse[]>([]);
  const [hotspots, setHotspots] = useState<InnovationHotspot[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [isRealTime, setIsRealTime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'globe' | 'map' | 'metrics'>('globe');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const filterState = useSearchFilter({
    defaultCategory: 'all',
    persistInUrl: false
  });

  const innovationService = InnovationIntelligenceService.getInstance();

  // Load initial data
  useEffect(() => {
    loadPulseData();
  }, [timeRange]);

  // Real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      updatePulseData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isRealTime, timeRange]);

  const loadPulseData = async () => {
    setIsLoading(true);
    try {
      const query = {
        domains: ['artificial_intelligence', 'biotechnology', 'quantum_computing', 'renewable_energy'],
        timeframe: {
          start: getTimeRangeStart(timeRange),
          end: new Date().toISOString()
        },
        geographic_scope: Object.keys(COUNTRY_COORDINATES),
        analysis_type: 'pulse' as const,
        filters: {}
      };

      const pulseResults = await innovationService.monitorInnovationPulse(query);
      setPulseData(pulseResults);

      // Generate hotspots based on pulse data
      const generatedHotspots = generateHotspots(pulseResults);
      setHotspots(generatedHotspots);
    } catch (error) {
      console.error('Error loading pulse data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePulseData = async () => {
    try {
      // Simulate real-time updates
      setPulseData(current => current.map(pulse => ({
        ...pulse,
        filing_velocity: Math.max(0, pulse.filing_velocity + (Math.random() - 0.5) * 20),
        inventor_activity: Math.max(0, pulse.inventor_activity + (Math.random() - 0.5) * 10),
        funding_signals: Math.max(0, pulse.funding_signals + (Math.random() - 0.5) * 5),
        pulse_score: 0, // Recalculated
        anomaly_detection: Math.random() > 0.95
      })).map(pulse => ({
        ...pulse,
        pulse_score: calculatePulseScore(pulse)
      })));
    } catch (error) {
      console.error('Error updating pulse data:', error);
    }
  };

  const getTimeRangeStart = (range: string): string => {
    const now = new Date();
    switch (range) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const generateHotspots = (pulses: InnovationPulse[]): InnovationHotspot[] => {
    return pulses
      .filter(p => p.pulse_score > 70)
      .slice(0, 5)
      .map((pulse, index) => ({
        id: `hotspot_${index}`,
        center: [Math.random() * 360 - 180, Math.random() * 180 - 90],
        radius: pulse.pulse_score / 10,
        intensity: pulse.pulse_score,
        technologies: [pulse.technology_domain, 'related_tech'],
        growth_rate: Math.random() * 50 + 10,
        prediction: {
          next_6_months: pulse.pulse_score + Math.random() * 20,
          next_12_months: pulse.pulse_score + Math.random() * 40,
          confidence: Math.random() * 30 + 70,
          key_factors: ['Market demand', 'Research funding', 'Talent pool']
        }
      }));
  };

  const calculatePulseScore = (pulse: InnovationPulse): number => {
    return (
      pulse.filing_velocity * 0.3 +
      pulse.inventor_activity * 0.25 +
      pulse.funding_signals * 0.25 +
      pulse.collaboration_index * 0.2
    );
  };

  const selectedPulse = pulseData.find(p => p.region === selectedRegion);

  const globalMetrics = useMemo(() => {
    if (pulseData.length === 0) return null;

    return {
      totalFilings: pulseData.reduce((sum, p) => sum + p.filing_velocity, 0),
      activeInventors: pulseData.reduce((sum, p) => sum + p.inventor_activity, 0),
      fundingVolume: pulseData.reduce((sum, p) => sum + p.funding_signals, 0),
      averagePulse: pulseData.reduce((sum, p) => sum + p.pulse_score, 0) / pulseData.length,
      anomalies: pulseData.filter(p => p.anomaly_detection).length,
      hotRegions: pulseData.filter(p => p.pulse_score > 70).length
    };
  }, [pulseData]);

  const categories = [
    { value: 'all', label: 'All Technologies', count: pulseData.length },
    { value: 'ai', label: 'Artificial Intelligence', count: Math.floor(pulseData.length * 0.3) },
    { value: 'biotech', label: 'Biotechnology', count: Math.floor(pulseData.length * 0.25) },
    { value: 'quantum', label: 'Quantum Computing', count: Math.floor(pulseData.length * 0.2) },
    { value: 'energy', label: 'Renewable Energy', count: Math.floor(pulseData.length * 0.25) }
  ];

  const sortOptions = [
    { value: 'pulse_score', label: 'Pulse Score', count: undefined },
    { value: 'filing_velocity', label: 'Filing Velocity', count: undefined },
    { value: 'trend_direction', label: 'Trend Direction', count: undefined },
    { value: 'region', label: 'Region', count: undefined }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Innovation Pulse Monitor</h1>
                <p className="text-gray-600">Real-time global innovation heartbeat tracking</p>
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('support')}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  title="Help & Documentation"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Real-time Toggle */}
              <button
                onClick={() => setIsRealTime(!isRealTime)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isRealTime
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isRealTime ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRealTime ? 'Live' : 'Paused'}
              </button>

              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              {/* View Mode Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'globe', label: '3D Globe', icon: Globe },
                  { id: 'metrics', label: 'Metrics', icon: BarChart3 }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={loadPulseData}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                title="Refresh Data"
              >
                <RotateCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <SearchFilterBar
        placeholder="Filter by technology domain, region, or trend..."
        categories={categories}
        sortOptions={sortOptions}
        showVoiceSearch={true}
        searchQuery={filterState.searchQuery}
        selectedCategory={filterState.selectedCategory}
        selectedSort={filterState.selectedSort}
        activeFilters={filterState.activeFilters}
        isExpanded={filterState.isExpanded}
        activeFilterCount={filterState.activeFilterCount}
        setSearchQuery={filterState.setSearchQuery}
        setSelectedCategory={filterState.setSelectedCategory}
        setSelectedSort={filterState.setSelectedSort}
        setActiveFilter={filterState.setActiveFilter}
        toggleQuickFilter={filterState.toggleQuickFilter}
        clearAllFilters={filterState.clearAllFilters}
        setExpanded={filterState.setExpanded}
      />

      {/* Global Metrics Dashboard */}
      {globalMetrics && (
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{globalMetrics.totalFilings.toFixed(0)}</div>
              <div className="text-sm text-gray-500">Daily Filings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{globalMetrics.activeInventors.toFixed(0)}</div>
              <div className="text-sm text-gray-500">Active Inventors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">${globalMetrics.fundingVolume.toFixed(0)}M</div>
              <div className="text-sm text-gray-500">Funding Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{globalMetrics.averagePulse.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Avg Pulse Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{globalMetrics.anomalies}</div>
              <div className="text-sm text-gray-500">Anomalies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{globalMetrics.hotRegions}</div>
              <div className="text-sm text-gray-500">Hot Regions</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Region List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regions</h3>
            <div className="space-y-2">
              {pulseData
                .sort((a, b) => b.pulse_score - a.pulse_score)
                .map((pulse) => (
                  <div
                    key={pulse.id}
                    onClick={() => setSelectedRegion(pulse.region)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedRegion === pulse.region
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{pulse.region}</span>
                      <div className="flex items-center gap-1">
                        {pulse.trend_direction === 'accelerating' && <TrendingUp className="h-4 w-4 text-green-500" />}
                        {pulse.trend_direction === 'declining' && <TrendingDown className="h-4 w-4 text-red-500" />}
                        {pulse.anomaly_detection && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {pulse.technology_domain}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Pulse: {pulse.pulse_score.toFixed(1)}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        pulse.trend_direction === 'accelerating' ? 'bg-green-100 text-green-700' :
                        pulse.trend_direction === 'emerging' ? 'bg-yellow-100 text-yellow-700' :
                        pulse.trend_direction === 'stable' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {pulse.trend_direction}
                      </span>
                    </div>

                    {/* Metrics bars */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-12 text-gray-500">Filings</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, pulse.filing_velocity / 10)}%` }}
                          ></div>
                        </div>
                        <div className="w-8 text-right">{pulse.filing_velocity.toFixed(0)}</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-12 text-gray-500">Activity</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: `${pulse.inventor_activity}%` }}
                          ></div>
                        </div>
                        <div className="w-8 text-right">{pulse.inventor_activity.toFixed(0)}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="flex-1 relative">
          {viewMode === 'globe' && (
            <div className="h-full">
              <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <PulseGlobe
                  pulseData={pulseData}
                  hotspots={hotspots}
                  isRealTime={isRealTime}
                  selectedRegion={selectedRegion}
                  onRegionSelect={setSelectedRegion}
                />
                
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={100}
                  minDistance={20}
                />
              </Canvas>

              {/* 3D Controls Overlay */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium text-gray-700">Globe Controls</div>
                <div className="text-xs text-gray-600">
                  <div>Rotate: Click & Drag</div>
                  <div>Zoom: Mouse Wheel</div>
                  <div>Select: Click on pulses</div>
                  {isRealTime && <div className="text-green-600 font-medium">● Live Updates</div>}
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xs font-medium text-gray-700 mb-2">Innovation Trends</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Accelerating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Emerging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Stable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Declining</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'metrics' && selectedPulse && (
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedPulse.region} - Detailed Metrics
              </h3>

              {/* Primary Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-500">Filing Velocity</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{selectedPulse.filing_velocity.toFixed(0)}</div>
                  <div className="text-xs text-gray-500">patents/day</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-500">Inventor Activity</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{selectedPulse.inventor_activity.toFixed(0)}</div>
                  <div className="text-xs text-gray-500">active inventors</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-500">Funding Signals</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">${selectedPulse.funding_signals.toFixed(0)}M</div>
                  <div className="text-xs text-gray-500">investment volume</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-500">Collaboration Index</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{selectedPulse.collaboration_index.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">partnerships/month</div>
                </div>
              </div>

              {/* Pulse Score Breakdown */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Pulse Score Breakdown</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Pulse Score</span>
                      <span className="font-medium">{selectedPulse.pulse_score.toFixed(1)}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" 
                        style={{ width: `${selectedPulse.pulse_score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Trend Direction</span>
                        <span className={`font-medium ${
                          selectedPulse.trend_direction === 'accelerating' ? 'text-green-600' :
                          selectedPulse.trend_direction === 'emerging' ? 'text-yellow-600' :
                          selectedPulse.trend_direction === 'stable' ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                          {selectedPulse.trend_direction}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Prediction Confidence</span>
                        <span className="font-medium">{selectedPulse.prediction_confidence.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Technology Domain</span>
                        <span className="font-medium">{selectedPulse.technology_domain}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Anomaly Detection</span>
                        <span className={`font-medium ${
                          selectedPulse.anomaly_detection ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {selectedPulse.anomaly_detection ? 'Detected' : 'Normal'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotspots in Region */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Innovation Hotspots</h4>
                <div className="space-y-3">
                  {hotspots.slice(0, 3).map((hotspot) => (
                    <div key={hotspot.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">
                          {hotspot.technologies.join(' + ')}
                        </div>
                        <span className="text-sm text-gray-500">
                          Growth: {hotspot.growth_rate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Intensity: {hotspot.intensity.toFixed(1)} | 
                        Radius: {hotspot.radius.toFixed(1)}km
                      </div>
                      <div className="text-xs text-gray-500">
                        6M Prediction: {hotspot.prediction.next_6_months.toFixed(1)} 
                        (Confidence: {hotspot.prediction.confidence.toFixed(1)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <div className="text-lg font-medium text-gray-900">Loading Innovation Pulse...</div>
                <div className="text-sm text-gray-600">Analyzing global innovation patterns</div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && pulseData.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Pulse Data Available</h3>
                <p className="text-gray-600 mb-6">Check your connection and try refreshing the data</p>
                <button
                  onClick={loadPulseData}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-6 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          <span>Regions: {pulseData.length}</span>
          <span>Hotspots: {hotspots.length}</span>
        </div>
        <div className="flex items-center gap-2">
          {isRealTime && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Updates Active</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}