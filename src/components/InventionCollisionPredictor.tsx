/**
 * Invention Collision Predictor - Cross-Domain Innovation Forecasting
 * Predicts where two separate technology domains will intersect to create breakthroughs
 */

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  Zap,
  Target,
  TrendingUp,
  Clock,
  Lightbulb,
  AlertCircle,
  Play,
  Pause,
  Download,
  HelpCircle
} from 'lucide-react';
import {
  TechnologyCollision,
  ParticleState,
  CollisionPrecedent
} from '../types/innovationIntelligence';
import InnovationIntelligenceService from '../lib/innovationIntelligenceService';
import SearchFilterBar from './common/SearchFilterBar';
import { useSearchFilter } from '../hooks/useSearchFilter';

interface InventionCollisionPredictorProps {
  onNavigate?: (section: string) => void;
}

interface CollisionSimulatorProps {
  collisions: TechnologyCollision[];
  selectedCollision?: string;
  isAnimating: boolean;
  simulationSpeed: number;
  onCollisionSelect: (collisionId: string) => void;
}

interface TechnologyParticleProps {
  particle: ParticleState;
  color: string;
  isColliding: boolean;
  trailEnabled: boolean;
}

interface CollisionEventProps {
  collision: TechnologyCollision;
  animationProgress: number;
}

interface CollisionAnalysisProps {
  collision: TechnologyCollision;
  precedents: CollisionPrecedent[];
}

// Technology Particle Component
function TechnologyParticle({ particle, color, isColliding, trailEnabled: _trailEnabled }: TechnologyParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, _delta) => {
    if (meshRef.current) {
      // Update position
      meshRef.current.position.set(...particle.position);
      
      // Pulsing effect when colliding
      if (isColliding) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.3;
        meshRef.current.scale.setScalar(scale);
      }
      
      // Update trail would go here if implemented
    }
  });

  const particleSize = Math.log10(particle.mass) * 0.5 + 0.5;

  return (
    <group>
      {/* Main particle */}
      <Sphere ref={meshRef} args={[particleSize]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isColliding ? 0.5 : 0.2}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Energy field visualization */}
      <Sphere args={[particleSize * 2]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>

      {/* Technology properties indicators */}
      {Object.entries(particle.technology_properties).slice(0, 3).map(([key, value], index) => (
        <Text
          key={key}
          position={[0, particleSize + 1 + (index * 0.5), 0]}
          fontSize={0.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {key}: {String(value).slice(0, 10)}
        </Text>
      ))}

      {/* Velocity vector */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              ...particle.position,
              particle.position[0] + particle.velocity[0] * 2,
              particle.position[1] + particle.velocity[1] * 2,
              particle.position[2] + particle.velocity[2] * 2
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.5} />
      </line>

      {/* Trail component removed for simplicity */}
    </group>
  );
}

// Collision Event Visualization
function CollisionEvent({ collision, animationProgress }: CollisionEventProps) {
  const explosionRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (explosionRef.current) {
      // Explosion animation
      const scale = 1 + animationProgress * 5;
      explosionRef.current.scale.setScalar(scale);
      
      // Rotation for dynamic effect
      explosionRef.current.rotation.y += delta * 2;
      explosionRef.current.rotation.x += delta * 1.5;
    }
  });

  const collisionPoint = collision.simulation_data.collision_point;

  return (
    <group ref={explosionRef} position={collisionPoint}>
      {/* Central explosion sphere */}
      <Sphere args={[1]}>
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFF00"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7 - animationProgress * 0.5}
        />
      </Sphere>

      {/* Energy rings */}
      {[0, 1, 2, 3].map((ring) => (
        <mesh key={ring} rotation={[Math.PI / 2, 0, ring * Math.PI / 4]}>
          <torusGeometry args={[2 + ring * 1.5, 0.2, 8, 32]} />
          <meshStandardMaterial
            color="#FF6600"
            transparent
            opacity={(0.8 - animationProgress) * (0.8 - ring * 0.2)}
            emissive="#FF6600"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Resulting innovation particles */}
      {collision.simulation_data.resulting_particles.map((particle, index) => (
        <TechnologyParticle
          key={index}
          particle={particle}
          color="#00FF88"
          isColliding={false}
          trailEnabled={true}
        />
      ))}

      {/* Innovation potential indicator */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        INNOVATION BREAKTHROUGH
      </Text>

      <Text
        position={[0, 3.5, 0]}
        fontSize={0.3}
        color="#FFFF00"
        anchorX="center"
        anchorY="middle"
      >
        Potential: {collision.innovation_potential.toFixed(1)}%
      </Text>

      <Text
        position={[0, 3, 0]}
        fontSize={0.25}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
      >
        {collision.domain_a} × {collision.domain_b}
      </Text>
    </group>
  );
}

// Main Collision Simulator Component
function CollisionSimulator({
  collisions,
  selectedCollision,
  isAnimating,
  simulationSpeed,
  onCollisionSelect
}: CollisionSimulatorProps) {
  const [animationTime, setAnimationTime] = useState(0);
  const [collisionEvents, setCollisionEvents] = useState<{ [key: string]: number }>({});

  useFrame((_, delta) => {
    if (isAnimating) {
      setAnimationTime(prev => prev + delta * simulationSpeed);
      
      // Check for collision events
      collisions.forEach(collision => {
        const timeToCollision = Math.sin(animationTime) * 5 + 5; // Simulate collision timing
        if (timeToCollision < 1 && !collisionEvents[collision.id]) {
          setCollisionEvents(prev => ({ ...prev, [collision.id]: animationTime }));
        }
      });
    }
  });

  return (
    <group>
      {/* Simulation space boundaries */}
      <mesh>
        <boxGeometry args={[60, 40, 40]} />
        <meshBasicMaterial
          color="#333333"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Technology particles and collisions */}
      {collisions.map((collision, index) => {
        const isSelected = selectedCollision === collision.id;
        const collisionEventTime = collisionEvents[collision.id];
        const hasCollided = collisionEventTime !== undefined;
        const timeSinceCollision = hasCollided ? animationTime - collisionEventTime : 0;

        return (
          <group key={collision.id} onClick={() => onCollisionSelect(collision.id)}>
            {/* Particle A */}
            <TechnologyParticle
              particle={{
                ...collision.simulation_data.particle_a,
                position: [
                  collision.simulation_data.particle_a.position[0] + 
                  Math.sin(animationTime * 0.5 + index) * 10,
                  collision.simulation_data.particle_a.position[1],
                  collision.simulation_data.particle_a.position[2]
                ]
              }}
              color="#FF4444"
              isColliding={hasCollided && timeSinceCollision < 2}
              trailEnabled={isSelected}
            />

            {/* Particle B */}
            <TechnologyParticle
              particle={{
                ...collision.simulation_data.particle_b,
                position: [
                  collision.simulation_data.particle_b.position[0] + 
                  Math.sin(animationTime * 0.5 + index + Math.PI) * 10,
                  collision.simulation_data.particle_b.position[1],
                  collision.simulation_data.particle_b.position[2]
                ]
              }}
              color="#4444FF"
              isColliding={hasCollided && timeSinceCollision < 2}
              trailEnabled={isSelected}
            />

            {/* Collision Event */}
            {hasCollided && timeSinceCollision < 5 && (
              <CollisionEvent
                collision={collision}
                animationProgress={Math.min(timeSinceCollision / 5, 1)}
              />
            )}

            {/* Prediction trajectory */}
            {isSelected && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      ...collision.simulation_data.particle_a.position,
                      ...collision.simulation_data.collision_point
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#FFFF00" transparent opacity={0.6} />
              </line>
            )}

            {/* Collision probability indicator */}
            <Text
              position={[
                collision.simulation_data.collision_point[0],
                collision.simulation_data.collision_point[1] + 3,
                collision.simulation_data.collision_point[2]
              ]}
              fontSize={0.3}
              color={isSelected ? "#FFFF00" : "#FFFFFF"}
              anchorX="center"
              anchorY="middle"
            >
              {collision.collision_probability.toFixed(1)}%
            </Text>

            {/* Timeline prediction */}
            <Text
              position={[
                collision.simulation_data.collision_point[0],
                collision.simulation_data.collision_point[1] + 2.5,
                collision.simulation_data.collision_point[2]
              ]}
              fontSize={0.2}
              color="#CCCCCC"
              anchorX="center"
              anchorY="middle"
            >
              {collision.predicted_timeline}
            </Text>
          </group>
        );
      })}

      {/* Force field visualization */}
      <mesh>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial
          color="#00FFFF"
          transparent
          opacity={0.05}
          wireframe
        />
      </mesh>
    </group>
  );
}

// Collision Analysis Panel
function CollisionAnalysis({ collision, precedents }: CollisionAnalysisProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Collision Analysis</h3>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-500">Collision Probability</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{collision.collision_probability.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">prediction confidence</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-500">Innovation Potential</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{collision.innovation_potential.toFixed(1)}</div>
          <div className="text-xs text-gray-500">breakthrough score</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-500">Timeline</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{collision.predicted_timeline}</div>
          <div className="text-xs text-gray-500">estimated</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-500">Market Readiness</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{collision.market_readiness.toFixed(0)}%</div>
          <div className="text-xs text-gray-500">adoption likelihood</div>
        </div>
      </div>

      {/* Technology Domains */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Collision Domains</h4>
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            </div>
            <div className="font-medium text-gray-900">{collision.domain_a}</div>
            <div className="text-sm text-gray-500">Domain A</div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-yellow-500"></div>
              <Zap className="h-6 w-6 text-yellow-500" />
              <div className="w-8 h-1 bg-gradient-to-r from-yellow-500 to-blue-500"></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
            <div className="font-medium text-gray-900">{collision.domain_b}</div>
            <div className="text-sm text-gray-500">Domain B</div>
          </div>
        </div>
      </div>

      {/* Key Enablers */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Key Enablers</h4>
        <div className="grid grid-cols-2 gap-4">
          {collision.key_enablers.map((enabler, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800">{enabler}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Blocking Factors */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Blocking Factors</h4>
        <div className="grid grid-cols-2 gap-4">
          {collision.blocking_factors.map((blocker, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-red-800">{blocker}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Precedents */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Historical Precedents</h4>
        <div className="space-y-4">
          {precedents.map((precedent, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">
                  {precedent.domains.join(' × ')}
                </div>
                <span className="text-sm text-gray-500">{precedent.year_occurred}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Market Impact: ${(precedent.market_impact / 1000000).toFixed(0)}M | 
                Time to Market: {precedent.time_to_commercialization} months
              </div>
              <div className="flex flex-wrap gap-2">
                {precedent.resulting_innovations.map((innovation, innIndex) => (
                  <span
                    key={innIndex}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    {innovation}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Energy Release Simulation */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Collision Energy Analysis</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {collision.simulation_data.energy_release.toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">Energy Release (TJ)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {collision.simulation_data.particle_a.mass.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Domain A Mass</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-600">
              {collision.simulation_data.particle_b.mass.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Domain B Mass</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Invention Collision Predictor Component
export default function InventionCollisionPredictor({ onNavigate }: InventionCollisionPredictorProps) {
  const [collisions, setCollisions] = useState<TechnologyCollision[]>([]);
  const [selectedCollision, setSelectedCollision] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'simulation' | 'analysis' | 'timeline'>('simulation');
  const [analysisQuery, setAnalysisQuery] = useState('');

  const filterState = useSearchFilter({
    defaultCategory: 'all',
    persistInUrl: false
  });

  const innovationService = InnovationIntelligenceService.getInstance();

  // Load initial collision data
  useEffect(() => {
    loadCollisionData();
  }, []);

  const loadCollisionData = async () => {
    setIsLoading(true);
    try {
      const query = {
        domains: ['artificial_intelligence', 'biotechnology', 'quantum_computing', 'renewable_energy', 'nanotechnology'],
        timeframe: { start: '2024-01-01', end: '2030-01-01' },
        geographic_scope: ['Global'],
        analysis_type: 'collision' as const,
        filters: {}
      };

      const collisionResults = await innovationService.predictTechnologyCollisions(query);
      setCollisions(collisionResults);
      if (collisionResults.length > 0) {
        setSelectedCollision(collisionResults[0].id);
      }
    } catch (error) {
      console.error('Error loading collision data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeQuery = async () => {
    if (!analysisQuery.trim()) return;

    setIsLoading(true);
    try {
      const domains = analysisQuery.split(',').map(d => d.trim());
      const query = {
        domains,
        timeframe: { start: '2024-01-01', end: '2030-01-01' },
        geographic_scope: ['Global'],
        analysis_type: 'collision' as const,
        filters: {}
      };

      const results = await innovationService.predictTechnologyCollisions(query);
      setCollisions(results);
      if (results.length > 0) {
        setSelectedCollision(results[0].id);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCollisions = () => {
    const exportData = {
      collisions,
      analysis_timestamp: new Date().toISOString(),
      simulation_parameters: {
        speed: simulationSpeed,
        view_mode: viewMode
      },
      summary: {
        total_collisions: collisions.length,
        high_probability: collisions.filter(c => c.collision_probability > 70).length,
        high_innovation: collisions.filter(c => c.innovation_potential > 80).length
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `collision_predictions_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedCollisionData = collisions.find(c => c.id === selectedCollision);

  const categories = [
    { value: 'all', label: 'All Collisions', count: collisions.length },
    { value: 'high_prob', label: 'High Probability (>70%)', count: collisions.filter(c => c.collision_probability > 70).length },
    { value: 'high_innovation', label: 'High Innovation (>80)', count: collisions.filter(c => c.innovation_potential > 80).length },
    { value: 'near_term', label: 'Near Term (&lt;2 years)', count: collisions.filter(c => c.predicted_timeline.includes('month')).length },
    { value: 'market_ready', label: 'Market Ready (>60%)', count: collisions.filter(c => c.market_readiness > 60).length }
  ];

  const sortOptions = [
    { value: 'collision_probability', label: 'Collision Probability', count: undefined },
    { value: 'innovation_potential', label: 'Innovation Potential', count: undefined },
    { value: 'market_readiness', label: 'Market Readiness', count: undefined },
    { value: 'timeline', label: 'Timeline', count: undefined }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invention Collision Predictor</h1>
                <p className="text-gray-600">Cross-domain technology convergence forecasting</p>
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
              {/* Simulation Controls */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`p-2 rounded-md transition-colors ${
                    isAnimating ? 'bg-white text-orange-600' : 'text-gray-600'
                  }`}
                  title={isAnimating ? 'Pause Simulation' : 'Play Simulation'}
                >
                  {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                
                <div className="flex items-center gap-2 px-3">
                  <span className="text-sm text-gray-600">Speed:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={simulationSpeed}
                    onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                    className="w-16"
                  />
                  <span className="text-sm font-mono text-gray-600">{simulationSpeed.toFixed(1)}x</span>
                </div>
              </div>

              {/* View Mode Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'simulation', label: '3D Simulation', icon: Zap },
                  { id: 'analysis', label: 'Analysis', icon: Target },
                  { id: 'timeline', label: 'Timeline', icon: Clock }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === id
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExportCollisions}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                disabled={collisions.length === 0}
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <SearchFilterBar
        placeholder="Predict collisions between technology domains..."
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
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={analysisQuery}
              onChange={(e) => setAnalysisQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeQuery()}
              placeholder="Enter technology domains for collision analysis (comma-separated)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAnalyzeQuery}
            disabled={isLoading || !analysisQuery.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="h-4 w-4" />
            {isLoading ? 'Predicting...' : 'Predict Collisions'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Collisions Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Predicted Collisions</h3>
            <div className="space-y-3">
              {collisions
                .sort((a, b) => b.collision_probability - a.collision_probability)
                .map((collision) => (
                  <div
                    key={collision.id}
                    onClick={() => setSelectedCollision(collision.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedCollision === collision.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="font-medium text-gray-900">
                        {collision.domain_a} × {collision.domain_b}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      Timeline: {collision.predicted_timeline}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Probability:</span>
                        <div className="font-bold text-orange-600">{collision.collision_probability.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Innovation:</span>
                        <div className="font-bold text-green-600">{collision.innovation_potential.toFixed(0)}</div>
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">Market Readiness</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full" 
                          style={{ width: `${collision.market_readiness}%` }}
                        ></div>
                      </div>
                    </div>

                    {collision.key_enablers.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {collision.key_enablers.slice(0, 2).map((enabler, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full"
                          >
                            {enabler.slice(0, 8)}...
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="flex-1 relative">
          {viewMode === 'simulation' && (
            <div className="h-full">
              <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[20, 20, 20]} intensity={1} />
                <pointLight position={[-20, -20, -20]} intensity={0.5} />
                <directionalLight position={[0, 50, 0]} intensity={0.8} />
                
                <CollisionSimulator
                  collisions={collisions}
                  selectedCollision={selectedCollision}
                  isAnimating={isAnimating}
                  simulationSpeed={simulationSpeed}
                  onCollisionSelect={setSelectedCollision}
                />
                
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={100}
                  minDistance={10}
                />
              </Canvas>

              {/* Simulation Info Overlay */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium text-gray-700">Simulation Controls</div>
                <div className="text-xs text-gray-600">
                  <div>Red: Domain A particles</div>
                  <div>Blue: Domain B particles</div>
                  <div>Yellow: Collision trajectories</div>
                  <div>Green: Innovation results</div>
                  {isAnimating && <div className="text-orange-600 font-medium">● Simulation Running</div>}
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xs font-medium text-gray-700 mb-2">Collision Physics</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Technology Domain A</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Technology Domain B</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span>Collision Event</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Innovation Breakthrough</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'analysis' && selectedCollisionData && (
            <div className="p-6">
              <CollisionAnalysis
                collision={selectedCollisionData}
                precedents={selectedCollisionData.historical_precedents}
              />
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Collision Timeline</h3>
              
              <div className="relative">
                {/* Timeline axis */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                
                {/* Timeline events */}
                <div className="space-y-8 ml-8">
                  {collisions
                    .sort((a, b) => {
                      const aMonths = a.predicted_timeline.includes('month') ? 
                        parseInt(a.predicted_timeline) : 
                        parseInt(a.predicted_timeline) * 12;
                      const bMonths = b.predicted_timeline.includes('month') ? 
                        parseInt(b.predicted_timeline) : 
                        parseInt(b.predicted_timeline) * 12;
                      return aMonths - bMonths;
                    })
                    .map((collision) => (
                      <div key={collision.id} className="relative">
                        <div className="absolute -left-10 w-4 h-4 bg-orange-500 rounded-full border-4 border-white"></div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">
                              {collision.domain_a} × {collision.domain_b}
                            </h4>
                            <span className="text-sm text-orange-600 font-medium">
                              {collision.predicted_timeline}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-3">
                            Collision Probability: {collision.collision_probability.toFixed(1)}% | 
                            Innovation Potential: {collision.innovation_potential.toFixed(0)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="font-medium text-gray-700 mb-1">Key Enablers:</div>
                              <ul className="space-y-1">
                                {collision.key_enablers.slice(0, 3).map((enabler, enablerIndex) => (
                                  <li key={enablerIndex} className="text-green-600">• {enabler}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="font-medium text-gray-700 mb-1">Blocking Factors:</div>
                              <ul className="space-y-1">
                                {collision.blocking_factors.slice(0, 3).map((blocker, blockerIndex) => (
                                  <li key={blockerIndex} className="text-red-600">• {blocker}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
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
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <div className="text-lg font-medium text-gray-900">Predicting Collisions...</div>
                <div className="text-sm text-gray-600">Analyzing technology convergence patterns</div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && collisions.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Collisions Predicted</h3>
                <p className="text-gray-600 mb-6">Enter technology domains to predict convergence opportunities</p>
                <button
                  onClick={loadCollisionData}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
          <span>Collisions: {collisions.length}</span>
          <span>High Probability: {collisions.filter(c => c.collision_probability > 70).length}</span>
          <span>Simulation Speed: {simulationSpeed.toFixed(1)}x</span>
        </div>
        <div className="flex items-center gap-2">
          {isAnimating && (
            <>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>Simulation Active</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}