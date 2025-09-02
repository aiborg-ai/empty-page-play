/**
 * White Space Cartographer - 3D Innovation Gap Mapping
 * Explores unexplored technological territories and blue ocean opportunities
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  Map,
  Compass,
  Target,
  DollarSign,
  Clock,
  Users,
  Lightbulb,
  Download,
  Navigation,
  Layers,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import {
  InnovationWhiteSpace,
  DiscoveryZone,
  NavigationWaypoint
} from '../types/innovationIntelligence';
import InnovationIntelligenceService from '../lib/innovationIntelligenceService';
import SearchFilterBar from './common/SearchFilterBar';
import { useSearchFilter } from '../hooks/useSearchFilter';

interface WhiteSpaceCartographerProps {
  onNavigate?: (section: string) => void;
}

interface WhiteSpace3DProps {
  whiteSpaces: InnovationWhiteSpace[];
  selectedSpace?: string;
  viewMode: '3d' | 'opportunity' | 'risk';
  isNavigating: boolean;
  onSpaceSelect: (spaceId: string) => void;
}

interface OpportunityZoneProps {
  space: InnovationWhiteSpace;
  isSelected: boolean;
  viewMode: string;
  onClick: () => void;
}

interface NavigationPathProps {
  waypoints: NavigationWaypoint[];
  isAnimating: boolean;
}

interface DiscoveryZoneVisualizationProps {
  zone: DiscoveryZone;
  isVisible: boolean;
}

// Opportunity Zone 3D Component
function OpportunityZone({ space, isSelected, viewMode: _viewMode, onClick }: OpportunityZoneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current && glowRef.current) {
      // Floating animation
      meshRef.current.position.y = space.coordinates[1] + Math.sin(state.clock.elapsedTime + space.coordinates[0]) * 0.5;
      
      // Glow effect for high-opportunity spaces
      if (space.opportunity_score > 70) {
        glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
      }
      
      // Selection highlighting
      if (isSelected) {
        meshRef.current.rotation.y += delta;
      }
    }
  });

  const getOpportunityColor = (score: number) => {
    if (score > 80) return '#00FF00'; // High opportunity - Green
    if (score > 60) return '#FFFF00'; // Medium opportunity - Yellow
    if (score > 40) return '#FFA500'; // Low opportunity - Orange
    return '#FF6B6B'; // Poor opportunity - Red
  };

  const getSpaceSize = (space: InnovationWhiteSpace) => {
    const baseSize = 0.5;
    const marketFactor = Math.log10(space.market_size_estimate / 1000000) * 0.1;
    const opportunityFactor = space.opportunity_score / 100;
    return Math.max(baseSize, baseSize + marketFactor + opportunityFactor);
  };

  const spaceSize = getSpaceSize(space);
  const color = getOpportunityColor(space.opportunity_score);

  return (
    <group position={space.coordinates} onClick={onClick}>
      {/* Main opportunity sphere */}
      <Sphere ref={meshRef} args={[spaceSize]}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.9 : 0.7}
          emissive={color}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
      </Sphere>

      {/* Glow effect for high-value opportunities */}
      {space.opportunity_score > 70 && (
        <Sphere ref={glowRef} args={[spaceSize * 1.5]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
          />
        </Sphere>
      )}

      {/* Market size indicator */}
      <Box args={[0.2, space.market_size_estimate / 5000000000, 0.2]} position={[0, spaceSize + 1, 0]}>
        <meshStandardMaterial color="#4A90E2" transparent opacity={0.6} />
      </Box>

      {/* Risk factor indicators */}
      {space.risk_factors.length > 2 && (
        <Sphere args={[0.2]} position={[spaceSize + 0.5, 0, 0]}>
          <meshStandardMaterial color="#FF4444" />
        </Sphere>
      )}

      {/* Entry difficulty visualization */}
      <mesh position={[0, -spaceSize - 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, space.entry_difficulty / 5]} />
        <meshStandardMaterial 
          color="#FF6B6B"
          transparent 
          opacity={0.7}
        />
      </mesh>

      {/* Labels */}
      <Text
        position={[0, -spaceSize - 1.5, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        Score: {space.opportunity_score.toFixed(0)}
      </Text>

      <Text
        position={[0, -spaceSize - 2, 0]}
        fontSize={0.2}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
      >
        ${(space.market_size_estimate / 1000000).toFixed(0)}M
      </Text>

      {/* Technology domain indicators */}
      {space.technology_domains.slice(0, 3).map((domain, index) => (
        <Text
          key={domain}
          position={[0, -spaceSize - 2.5 - (index * 0.3), 0]}
          fontSize={0.15}
          color="#AAAAAA"
          anchorX="center"
          anchorY="middle"
        >
          {domain.slice(0, 10)}...
        </Text>
      ))}

      {/* Connection lines to enabling technologies */}
      {space.enabling_technologies.slice(0, 2).map((tech, index) => {
        const angle = (index * Math.PI) / 2;
        const endPoint = new THREE.Vector3(
          Math.cos(angle) * 3,
          0,
          Math.sin(angle) * 3
        );
        
        return (
          <Line
            key={tech}
            points={[new THREE.Vector3(0, 0, 0), endPoint]}
            color="#00FF88"
            lineWidth={1}
            transparent
            opacity={0.4}
          />
        );
      })}
    </group>
  );
}

// Navigation Path Component
function NavigationPath({ waypoints, isAnimating }: NavigationPathProps) {
  const lineRef = useRef<any>(null);

  useFrame((state, _delta) => {
    if (lineRef.current && isAnimating) {
      // Animate path discovery
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  const pathPoints = waypoints.map(waypoint => new THREE.Vector3(...waypoint.position));

  return (
    <group>
      {/* Navigation path line */}
      <Line
        ref={lineRef}
        points={pathPoints}
        color="#FFD700"
        lineWidth={2}
        transparent
        opacity={0.6}
      />

      {/* Waypoint markers */}
      {waypoints.map((waypoint, index) => (
        <group key={index} position={waypoint.position}>
          <Sphere args={[0.3]}>
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.3}
            />
          </Sphere>
          
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {waypoint.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

// Discovery Zone Component
function DiscoveryZoneVisualization({ zone, isVisible }: DiscoveryZoneVisualizationProps) {
  const zoneRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (zoneRef.current && isVisible) {
      zoneRef.current.rotation.y += delta * 0.2;
      
      // Pulsing effect for high-value zones
      if (zone.potential_value > 70) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
        zoneRef.current.scale.setScalar(scale);
      }
    }
  });

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'blue_ocean': return '#0077BE';
      case 'emerging_tech': return '#00FF77';
      case 'convergence': return '#FF77FF';
      case 'disruption': return '#FF4444';
      default: return '#FFFFFF';
    }
  };

  if (!isVisible) return null;

  return (
    <group>
      {/* Zone boundary */}
      <mesh ref={zoneRef}>
        <boxGeometry args={[10, 8, 6]} />
        <meshStandardMaterial
          color={getZoneColor(zone.zone_type)}
          transparent
          opacity={0.2}
          wireframe={true}
        />
      </mesh>

      {/* Zone label */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.4}
        color={getZoneColor(zone.zone_type)}
        anchorX="center"
        anchorY="middle"
      >
        {zone.zone_type.replace('_', ' ').toUpperCase()}
      </Text>

      {/* Value indicator */}
      <Text
        position={[0, 4.5, 0]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        Value: {zone.potential_value.toFixed(0)}
      </Text>
    </group>
  );
}

// Main White Space 3D Component
function WhiteSpace3D({
  whiteSpaces,
  selectedSpace,
  viewMode,
  isNavigating,
  onSpaceSelect
}: WhiteSpace3DProps) {
  // Generate navigation waypoints
  const navigationWaypoints: NavigationWaypoint[] = useMemo(() => {
    return whiteSpaces
      .filter(space => space.opportunity_score > 60)
      .slice(0, 5)
      .map((space, index) => ({
        position: space.coordinates,
        label: `Waypoint ${index + 1}`,
        description: `Opportunity Score: ${space.opportunity_score.toFixed(0)}`,
        opportunity_type: space.technology_domains[0] || 'Unknown'
      }));
  }, [whiteSpaces]);

  // Generate discovery zones
  const discoveryZones: DiscoveryZone[] = useMemo(() => {
    return [
      {
        id: 'blue_ocean_1',
        boundary: [
          [-20, -20, -20], [20, -20, -20], [20, 20, -20], [-20, 20, -20],
          [-20, -20, 20], [20, -20, 20], [20, 20, 20], [-20, 20, 20]
        ],
        zone_type: 'blue_ocean',
        potential_value: 85,
        entry_requirements: ['Low competition', 'High market readiness']
      },
      {
        id: 'emerging_tech_1',
        boundary: [
          [40, -10, -10], [60, -10, -10], [60, 10, -10], [40, 10, -10],
          [40, -10, 10], [60, -10, 10], [60, 10, 10], [40, 10, 10]
        ],
        zone_type: 'emerging_tech',
        potential_value: 75,
        entry_requirements: ['Technical expertise', 'Early adoption']
      }
    ];
  }, []);

  return (
    <group>
      {/* Coordinate system axes */}
      <Line points={[new THREE.Vector3(-50, 0, 0), new THREE.Vector3(50, 0, 0)]} color="#666666" />
      <Line points={[new THREE.Vector3(0, -50, 0), new THREE.Vector3(0, 50, 0)]} color="#666666" />
      <Line points={[new THREE.Vector3(0, 0, -50), new THREE.Vector3(0, 0, 50)]} color="#666666" />

      {/* Axis labels */}
      <Text position={[52, 0, 0]} fontSize={1} color="#FFFFFF">Market Size</Text>
      <Text position={[0, 52, 0]} fontSize={1} color="#FFFFFF">Innovation Rate</Text>
      <Text position={[0, 0, 52]} fontSize={1} color="#FFFFFF">Competition</Text>

      {/* White space opportunities */}
      {whiteSpaces.map((space) => (
        <OpportunityZone
          key={space.id}
          space={space}
          isSelected={selectedSpace === space.id}
          viewMode={viewMode}
          onClick={() => onSpaceSelect(space.id)}
        />
      ))}

      {/* Navigation path */}
      {isNavigating && (
        <NavigationPath 
          waypoints={navigationWaypoints}
          isAnimating={isNavigating}
        />
      )}

      {/* Discovery zones */}
      {discoveryZones.map((zone) => (
        <DiscoveryZoneVisualization
          key={zone.id}
          zone={zone}
          isVisible={viewMode === '3d'}
        />
      ))}

      {/* Grid lines for reference */}
      {[-40, -20, 0, 20, 40].map((x) => (
        <Line
          key={`grid-x-${x}`}
          points={[new THREE.Vector3(x, -40, 0), new THREE.Vector3(x, 40, 0)]}
          color="#333333"
          transparent
          opacity={0.3}
        />
      ))}
      {[-40, -20, 0, 20, 40].map((y) => (
        <Line
          key={`grid-y-${y}`}
          points={[new THREE.Vector3(-40, y, 0), new THREE.Vector3(40, y, 0)]}
          color="#333333"
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
}

// Main White Space Cartographer Component
export default function WhiteSpaceCartographer({ onNavigate }: WhiteSpaceCartographerProps) {
  const [whiteSpaces, setWhiteSpaces] = useState<InnovationWhiteSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'opportunity' | 'risk'>('3d');
  const [isNavigating, setIsNavigating] = useState(false);
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [showZones, setShowZones] = useState(true);

  const filterState = useSearchFilter({
    defaultCategory: 'all',
    persistInUrl: false
  });

  const innovationService = InnovationIntelligenceService.getInstance();

  // Load initial data
  useEffect(() => {
    loadWhiteSpaceData();
  }, []);

  const loadWhiteSpaceData = async () => {
    setIsLoading(true);
    try {
      const query = {
        domains: ['artificial_intelligence', 'quantum_computing', 'biotechnology', 'renewable_energy'],
        timeframe: { start: '2020-01-01', end: '2024-01-01' },
        geographic_scope: ['United States', 'China', 'Europe'],
        analysis_type: 'whitespace' as const,
        filters: {}
      };

      const whiteSpaceResults = await innovationService.mapWhiteSpace(query);
      setWhiteSpaces(whiteSpaceResults);
    } catch (error) {
      console.error('Error loading white space data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeQuery = async () => {
    if (!analysisQuery.trim()) return;

    setIsLoading(true);
    try {
      const query = {
        domains: analysisQuery.split(',').map(d => d.trim()),
        timeframe: { start: '2020-01-01', end: '2024-01-01' },
        geographic_scope: ['United States'],
        analysis_type: 'whitespace' as const,
        filters: {}
      };

      const results = await innovationService.mapWhiteSpace(query);
      setWhiteSpaces(results);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportMap = () => {
    const exportData = {
      white_spaces: whiteSpaces,
      analysis_timestamp: new Date().toISOString(),
      view_mode: viewMode,
      total_opportunities: whiteSpaces.length,
      high_value_opportunities: whiteSpaces.filter(s => s.opportunity_score > 70).length
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `white_space_map_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedSpaceData = whiteSpaces.find(s => s.id === selectedSpace);

  const categories = [
    { value: 'all', label: 'All Opportunities', count: whiteSpaces.length },
    { value: 'high_value', label: 'High Value (>80)', count: whiteSpaces.filter(s => s.opportunity_score > 80).length },
    { value: 'medium_value', label: 'Medium Value (60-80)', count: whiteSpaces.filter(s => s.opportunity_score >= 60 && s.opportunity_score <= 80).length },
    { value: 'emerging', label: 'Emerging Markets', count: whiteSpaces.filter(s => s.market_readiness < 5).length },
    { value: 'low_risk', label: 'Low Risk', count: whiteSpaces.filter(s => s.risk_factors.length <= 2).length }
  ];

  const sortOptions = [
    { value: 'opportunity_score', label: 'Opportunity Score', count: undefined },
    { value: 'market_size', label: 'Market Size', count: undefined },
    { value: 'entry_difficulty', label: 'Entry Difficulty', count: undefined },
    { value: 'time_to_market', label: 'Time to Market', count: undefined }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg">
                <Map className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">White Space Cartographer</h1>
                <p className="text-gray-600">3D innovation gap mapping and blue ocean discovery</p>
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
              {/* View Mode Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { id: '3d', label: '3D Map', icon: Map },
                  { id: 'opportunity', label: 'Opportunities', icon: Target },
                  { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === id
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Navigation Toggle */}
              <button
                onClick={() => setIsNavigating(!isNavigating)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isNavigating
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Navigation className="h-4 w-4" />
                Navigate
              </button>

              {/* Zones Toggle */}
              <button
                onClick={() => setShowZones(!showZones)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showZones
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Layers className="h-4 w-4" />
                Zones
              </button>

              <button
                onClick={handleExportMap}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                disabled={whiteSpaces.length === 0}
              >
                <Download className="h-4 w-4" />
                Export Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <SearchFilterBar
        placeholder="Explore innovation domains (e.g., AI, biotech, quantum)..."
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

      {/* Analysis Input */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={analysisQuery}
              onChange={(e) => setAnalysisQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeQuery()}
              placeholder="Enter technology domains to map white spaces (comma-separated)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAnalyzeQuery}
            disabled={isLoading || !analysisQuery.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lightbulb className="h-4 w-4" />
            {isLoading ? 'Mapping...' : 'Map White Spaces'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Opportunities Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Innovation Opportunities</h3>
            <div className="space-y-3">
              {whiteSpaces
                .sort((a, b) => b.opportunity_score - a.opportunity_score)
                .map((space) => (
                  <div
                    key={space.id}
                    onClick={() => setSelectedSpace(space.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedSpace === space.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: space.opportunity_score > 80 ? '#00FF00' :
                                           space.opportunity_score > 60 ? '#FFFF00' :
                                           space.opportunity_score > 40 ? '#FFA500' : '#FF6B6B'
                          }}
                        ></div>
                        <span className="font-medium text-gray-900">
                          Opportunity #{space.id.slice(-4)}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-teal-600">
                        {space.opportunity_score.toFixed(0)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      Market Size: ${(space.market_size_estimate / 1000000).toFixed(0)}M
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Entry: {space.entry_difficulty.toFixed(1)}/10</span>
                      <span>TTM: {space.time_to_market.toFixed(0)}mo</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {space.technology_domains.slice(0, 2).map((domain, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded-full"
                        >
                          {domain.slice(0, 8)}...
                        </span>
                      ))}
                    </div>

                    {space.risk_factors.length > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{space.risk_factors.length} risks</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="flex-1 relative">
          {viewMode === '3d' && (
            <div className="h-full">
              <Canvas camera={{ position: [0, 0, 80], fov: 60 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[20, 20, 20]} intensity={1} />
                <pointLight position={[-20, -20, -20]} intensity={0.5} />
                <directionalLight position={[0, 50, 0]} intensity={0.8} />
                
                <WhiteSpace3D
                  whiteSpaces={whiteSpaces}
                  selectedSpace={selectedSpace}
                  viewMode={viewMode}
                  isNavigating={isNavigating}
                  onSpaceSelect={setSelectedSpace}
                />
                
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={150}
                  minDistance={20}
                />
              </Canvas>

              {/* 3D Controls Overlay */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium text-gray-700">3D Navigation</div>
                <div className="text-xs text-gray-600">
                  <div>Rotate: Click & Drag</div>
                  <div>Zoom: Mouse Wheel</div>
                  <div>Pan: Right Click & Drag</div>
                  <div>Select: Click on opportunities</div>
                  {isNavigating && <div className="text-teal-600 font-medium">● Navigation Active</div>}
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xs font-medium text-gray-700 mb-2">Opportunity Score</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>High (80+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Medium (60-80)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Low (40-60)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Poor (&lt;40)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(viewMode === 'opportunity' || viewMode === 'risk') && selectedSpaceData && (
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {viewMode === 'opportunity' ? 'Opportunity Analysis' : 'Risk Assessment'}
              </h3>

              {viewMode === 'opportunity' && (
                <>
                  {/* Opportunity Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-teal-500" />
                        <span className="text-sm text-gray-500">Opportunity Score</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{selectedSpaceData.opportunity_score.toFixed(0)}</div>
                      <div className="text-xs text-gray-500">out of 100</div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-500">Market Size</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${(selectedSpaceData.market_size_estimate / 1000000000).toFixed(1)}B
                      </div>
                      <div className="text-xs text-gray-500">estimated value</div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-500">Time to Market</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{selectedSpaceData.time_to_market.toFixed(0)}</div>
                      <div className="text-xs text-gray-500">months</div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-gray-500">Competition</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{selectedSpaceData.competitive_density.toFixed(0)}</div>
                      <div className="text-xs text-gray-500">density score</div>
                    </div>
                  </div>

                  {/* Technology Domains */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Technology Domains</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedSpaceData.technology_domains.map((domain, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enabling Technologies */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Enabling Technologies</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedSpaceData.enabling_technologies.map((tech, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{tech}</div>
                          <div className="text-sm text-gray-600">Required for market entry</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {viewMode === 'risk' && (
                <>
                  {/* Risk Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-red-600">{selectedSpaceData.entry_difficulty.toFixed(1)}</div>
                      <div className="text-sm text-gray-500">Entry Difficulty (1-10)</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-orange-600">{selectedSpaceData.risk_factors.length}</div>
                      <div className="text-sm text-gray-500">Risk Factors</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-yellow-600">{selectedSpaceData.market_readiness.toFixed(1)}</div>
                      <div className="text-sm text-gray-500">Market Readiness (1-10)</div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Risk Factors</h4>
                    <div className="space-y-3">
                      {selectedSpaceData.risk_factors.map((risk, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-red-900">{risk}</div>
                            <div className="text-sm text-red-700">Requires mitigation strategy</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Mitigation */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Recommended Mitigation</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>• Conduct thorough market research before entry</div>
                      <div>• Build strategic partnerships to reduce technical risks</div>
                      <div>• Develop minimum viable product for market validation</div>
                      <div>• Secure sufficient funding for extended development cycles</div>
                      <div>• Monitor regulatory environment for changes</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <div className="text-lg font-medium text-gray-900">Mapping White Spaces...</div>
                <div className="text-sm text-gray-600">Analyzing innovation opportunities</div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && whiteSpaces.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No White Spaces Found</h3>
                <p className="text-gray-600 mb-6">Enter technology domains to discover innovation opportunities</p>
                <button
                  onClick={loadWhiteSpaceData}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Load Sample Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-6 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span>Opportunities: {whiteSpaces.length}</span>
          <span>High Value: {whiteSpaces.filter(s => s.opportunity_score > 80).length}</span>
          <span>Avg Score: {whiteSpaces.length > 0 ? (whiteSpaces.reduce((sum, s) => sum + s.opportunity_score, 0) / whiteSpaces.length).toFixed(1) : '0'}</span>
        </div>
        <div className="flex items-center gap-2">
          {isNavigating && (
            <>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              <span>Navigation Mode Active</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}