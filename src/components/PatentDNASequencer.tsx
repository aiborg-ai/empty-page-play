/**
 * Patent DNA Sequencer - Revolutionary Patent Citation Analysis
 * Maps the "genetic code" of innovations with 3D DNA helix visualization
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import {
  Dna,
  Search,
  BarChart3,
  TreePine,
  Zap,
  Download,
  Play,
  Pause,
  HelpCircle
} from 'lucide-react';
import { PatentDNA, TechnologyMutation } from '../types/innovationIntelligence';
import InnovationIntelligenceService from '../lib/innovationIntelligenceService';
import SearchFilterBar from './common/SearchFilterBar';
import { useSearchFilter } from '../hooks/useSearchFilter';

interface PatentDNASequencerProps {
  onNavigate?: (section: string) => void;
}

interface DNAHelixProps {
  dnaData: PatentDNA;
  isAnimating: boolean;
  selectedBase?: string;
  onBaseSelect: (baseId: string) => void;
}

interface MutationVisualizerProps {
  mutations: TechnologyMutation[];
  position: [number, number, number];
}

// DNA Base Color Mapping
const BASE_COLORS = {
  A: '#FF6B6B', // Adenine - Red
  T: '#4ECDC4', // Thymine - Teal
  G: '#45B7D1', // Guanine - Blue
  C: '#FFA07A'  // Cytosine - Orange
};

// DNA Helix 3D Component
function DNAHelix({ dnaData, isAnimating, selectedBase, onBaseSelect }: DNAHelixProps) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (isAnimating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const helixCurve = useMemo(() => {
    const points = [];
    const helixHeight = dnaData.helix_structure.length * 2;
    
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const angle = t * Math.PI * 4; // Two full turns
      const radius = 8;
      const y = t * helixHeight - helixHeight / 2;
      
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ));
    }
    
    return new THREE.CatmullRomCurve3(points);
  }, [dnaData.helix_structure]);

  const helixPoints = useMemo(() => {
    return helixCurve.getPoints(200);
  }, [helixCurve]);

  return (
    <group ref={groupRef}>
      {/* DNA Backbone */}
      <Line
        points={helixPoints}
        color="#888888"
        lineWidth={2}
        transparent
        opacity={0.6}
      />
      
      {/* Complementary Strand */}
      <Line
        points={helixPoints.map(point => new THREE.Vector3(-point.x, point.y, -point.z))}
        color="#888888"
        lineWidth={2}
        transparent
        opacity={0.6}
      />

      {/* DNA Bases */}
      {dnaData.helix_structure.map((node, _index) => (
        <group key={node.patent_id} position={node.position}>
          {/* Base Sphere */}
          <Sphere
            args={[0.8]}
            position={[0, 0, 0]}
            onClick={() => onBaseSelect(node.patent_id)}
          >
            <meshStandardMaterial
              color={BASE_COLORS[node.base_type]}
              transparent
              opacity={selectedBase === node.patent_id ? 1.0 : 0.8}
              emissive={selectedBase === node.patent_id ? BASE_COLORS[node.base_type] : '#000000'}
              emissiveIntensity={selectedBase === node.patent_id ? 0.3 : 0}
            />
          </Sphere>

          {/* Innovation Strength Indicator */}
          <Sphere
            args={[0.3]}
            position={[0, 1.5, 0]}
          >
            <meshStandardMaterial
              color="#FFD700"
              transparent
              opacity={node.innovation_strength / 10}
            />
          </Sphere>

          {/* Base Type Label */}
          <Text
            position={[0, -1.2, 0]}
            fontSize={0.4}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {node.base_type}
          </Text>

          {/* Patent ID Label */}
          <Text
            position={[0, -1.8, 0]}
            fontSize={0.2}
            color="#CCCCCC"
            anchorX="center"
            anchorY="middle"
          >
            {node.patent_id.slice(-8)}
          </Text>

          {/* Connection Lines */}
          {node.connections.map((connectionId, connIndex) => {
            const targetNode = dnaData.helix_structure.find(n => n.patent_id === connectionId);
            if (targetNode) {
              return (
                <Line
                  key={connIndex}
                  points={[
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(
                      targetNode.position[0] - node.position[0],
                      targetNode.position[1] - node.position[1],
                      targetNode.position[2] - node.position[2]
                    )
                  ]}
                  color="#00FF88"
                  lineWidth={1}
                  transparent
                  opacity={0.4}
                />
              );
            }
            return null;
          })}
        </group>
      ))}

      {/* Mutation Visualizers */}
      {dnaData.mutations.map((mutation, index) => (
        <MutationVisualizer
          key={mutation.id}
          mutations={[mutation]}
          position={[
            Math.sin(index * 1.2) * 12,
            index * 3 - dnaData.mutations.length * 1.5,
            Math.cos(index * 1.2) * 12
          ]}
        />
      ))}
    </group>
  );
}

// Mutation Visualizer Component
function MutationVisualizer({ mutations, position }: MutationVisualizerProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.3;
      groupRef.current.rotation.z += delta * 0.2;
    }
  });

  const getMutationColor = (type: string) => {
    switch (type) {
      case 'enhancement': return '#00FF00';
      case 'pivot': return '#FFFF00';
      case 'fusion': return '#FF00FF';
      case 'disruption': return '#FF0000';
      default: return '#FFFFFF';
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {mutations.map((mutation, _index) => (
        <group key={mutation.id}>
          {/* Mutation Core */}
          <Sphere args={[1.2]}>
            <meshStandardMaterial
              color={getMutationColor(mutation.type)}
              transparent
              opacity={0.7}
              emissive={getMutationColor(mutation.type)}
              emissiveIntensity={0.2}
            />
          </Sphere>

          {/* Energy Rings */}
          {[0, 1, 2].map((ring) => (
            <mesh key={ring} rotation={[Math.PI / 2, 0, ring * Math.PI / 3]}>
              <torusGeometry args={[2 + ring * 0.5, 0.1, 8, 32]} />
              <meshStandardMaterial
                color={getMutationColor(mutation.type)}
                transparent
                opacity={0.3 - ring * 0.1}
              />
            </mesh>
          ))}

          {/* Mutation Type Label */}
          <Text
            position={[0, -2, 0]}
            fontSize={0.3}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {mutation.type.toUpperCase()}
          </Text>

          {/* Strength Indicator */}
          <Text
            position={[0, -2.5, 0]}
            fontSize={0.2}
            color="#CCCCCC"
            anchorX="center"
            anchorY="middle"
          >
            Strength: {mutation.strength.toFixed(1)}
          </Text>
        </group>
      ))}
    </group>
  );
}

// Main Patent DNA Sequencer Component
export default function PatentDNASequencer({ onNavigate }: PatentDNASequencerProps) {
  const [dnaData, setDnaData] = useState<PatentDNA[]>([]);
  const [selectedDNA, setSelectedDNA] = useState<PatentDNA | null>(null);
  const [selectedBase, setSelectedBase] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | 'sequence' | 'analysis'>('3d');
  const [analysisQuery, setAnalysisQuery] = useState('');

  const filterState = useSearchFilter({
    defaultCategory: 'all',
    persistInUrl: false
  });

  const innovationService = InnovationIntelligenceService.getInstance();

  // Sample DNA data for demonstration
  useEffect(() => {
    loadSampleDNAData();
  }, []);

  const loadSampleDNAData = async () => {
    setIsLoading(true);
    try {
      const sampleQuery = {
        domains: ['artificial_intelligence', 'quantum_computing'],
        timeframe: { start: '2020-01-01', end: '2024-01-01' },
        geographic_scope: ['United States', 'China'],
        analysis_type: 'dna' as const,
        filters: {}
      };

      const dnaResults = await innovationService.analyzePatentDNA(sampleQuery);
      setDnaData(dnaResults);
      if (dnaResults.length > 0) {
        setSelectedDNA(dnaResults[0]);
      }
    } catch (error) {
      console.error('Error loading DNA data:', error);
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
        analysis_type: 'dna' as const,
        filters: {}
      };

      const results = await innovationService.analyzePatentDNA(query);
      setDnaData(results);
      if (results.length > 0) {
        setSelectedDNA(results[0]);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBaseSelect = (baseId: string) => {
    setSelectedBase(selectedBase === baseId ? '' : baseId);
  };

  const handleExportDNA = () => {
    if (selectedDNA) {
      const dataStr = JSON.stringify(selectedDNA, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `patent_dna_${selectedDNA.patent_id}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const categories = [
    { value: 'all', label: 'All Technologies', count: dnaData.length },
    { value: 'ai', label: 'Artificial Intelligence', count: Math.floor(dnaData.length * 0.4) },
    { value: 'quantum', label: 'Quantum Computing', count: Math.floor(dnaData.length * 0.3) },
    { value: 'biotech', label: 'Biotechnology', count: Math.floor(dnaData.length * 0.2) },
    { value: 'nanotech', label: 'Nanotechnology', count: Math.floor(dnaData.length * 0.1) }
  ];

  const sortOptions = [
    { value: 'evolution_score', label: 'Evolution Score', count: undefined },
    { value: 'mutation_count', label: 'Mutation Count', count: undefined },
    { value: 'cluster_size', label: 'Cluster Size', count: undefined },
    { value: 'innovation_strength', label: 'Innovation Strength', count: undefined }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Dna className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patent DNA Sequencer</h1>
                <p className="text-gray-600">Revolutionary patent citation analysis with genetic mapping</p>
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
                  { id: '3d', label: '3D Helix', icon: Dna },
                  { id: 'sequence', label: 'Sequence', icon: BarChart3 },
                  { id: 'analysis', label: 'Analysis', icon: TreePine }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === id
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Animation Controls */}
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`p-2 rounded-lg transition-colors ${
                  isAnimating
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
                title={isAnimating ? 'Pause Animation' : 'Play Animation'}
              >
                {isAnimating ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>

              <button
                onClick={handleExportDNA}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                disabled={!selectedDNA}
              >
                <Download className="h-4 w-4" />
                Export DNA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <SearchFilterBar
        placeholder="Analyze patent domains (e.g., AI, quantum computing, biotech)..."
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={analysisQuery}
              onChange={(e) => setAnalysisQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeQuery()}
              placeholder="Enter technology domains to analyze (comma-separated)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAnalyzeQuery}
            disabled={isLoading || !analysisQuery.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="h-4 w-4" />
            {isLoading ? 'Analyzing...' : 'Analyze DNA'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* DNA List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">DNA Sequences</h3>
            <div className="space-y-3">
              {dnaData.map((dna) => (
                <div
                  key={dna.id}
                  onClick={() => setSelectedDNA(dna)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedDNA?.id === dna.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <span className="font-medium text-gray-900">{dna.patent_id}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Genetic Sequence: {dna.genetic_sequence.slice(0, 20)}...
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Evolution Score: {dna.evolution_score.toFixed(1)}</span>
                    <span>{dna.mutations.length} mutations</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dna.dna_clusters.slice(0, 2).map((cluster, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                      >
                        {cluster}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="flex-1 relative">
          {viewMode === '3d' && selectedDNA && (
            <div className="h-full">
              <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <DNAHelix
                  dnaData={selectedDNA}
                  isAnimating={isAnimating}
                  selectedBase={selectedBase}
                  onBaseSelect={handleBaseSelect}
                />
                
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={100}
                  minDistance={5}
                />
              </Canvas>

              {/* 3D Controls Overlay */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium text-gray-700">3D Controls</div>
                <div className="text-xs text-gray-600">
                  <div>Rotate: Click & Drag</div>
                  <div>Zoom: Mouse Wheel</div>
                  <div>Pan: Right Click & Drag</div>
                  <div>Select: Click on bases</div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'sequence' && selectedDNA && (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Genetic Sequence Analysis</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div className="mb-2">Patent ID: {selectedDNA.patent_id}</div>
                <div className="break-all leading-relaxed">
                  {selectedDNA.genetic_sequence.split('').map((base, index) => (
                    <span
                      key={index}
                      className={`inline-block w-4 text-center ${
                        BASE_COLORS[base as keyof typeof BASE_COLORS] ? '' : 'text-gray-500'
                      }`}
                      style={{
                        color: BASE_COLORS[base as keyof typeof BASE_COLORS] || '#gray'
                      }}
                      title={`Position ${index + 1}: ${base}`}
                    >
                      {base}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sequence Statistics */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(BASE_COLORS).map(([base, color]) => {
                  const count = selectedDNA.genetic_sequence.split(base).length - 1;
                  const percentage = ((count / selectedDNA.genetic_sequence.length) * 100).toFixed(1);
                  
                  return (
                    <div key={base} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="font-medium">{base}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-500">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'analysis' && selectedDNA && (
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Patent DNA Analysis</h3>

              {/* Evolution Score */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Evolution Metrics</h4>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{selectedDNA.evolution_score.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Evolution Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{selectedDNA.ancestors.length}</div>
                    <div className="text-sm text-gray-500">Ancestral Patents</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{selectedDNA.mutations.length}</div>
                    <div className="text-sm text-gray-500">Mutations</div>
                  </div>
                </div>
              </div>

              {/* Mutations Analysis */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Technology Mutations</h4>
                <div className="space-y-4">
                  {selectedDNA.mutations.map((mutation, _index) => (
                    <div key={mutation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: mutation.type === 'enhancement' ? '#00FF00' :
                                               mutation.type === 'pivot' ? '#FFFF00' :
                                               mutation.type === 'fusion' ? '#FF00FF' : '#FF0000'
                            }}
                          ></div>
                          <span className="font-medium text-gray-900 capitalize">{mutation.type}</span>
                        </div>
                        <span className="text-sm text-gray-500">Impact: {mutation.impact_score.toFixed(1)}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Strength: {mutation.strength.toFixed(1)} | Parent Patents: {mutation.parent_patents.length}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mutation.mutation_points.map((point, pointIndex) => (
                          <span
                            key={pointIndex}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DNA Clusters */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">DNA Clusters</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedDNA.dna_clusters.map((cluster, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {cluster}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <div className="text-lg font-medium text-gray-900">Analyzing Patent DNA...</div>
                <div className="text-sm text-gray-600">Mapping genetic sequences and mutations</div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedDNA && !isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Dna className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a DNA Sequence</h3>
                <p className="text-gray-600 mb-6">Choose a patent DNA sequence from the sidebar to begin analysis</p>
                <button
                  onClick={loadSampleDNAData}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Load Sample Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Base Info Panel */}
      {selectedBase && selectedDNA && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 max-w-xs">
          <h4 className="font-medium text-gray-900 mb-2">Selected Base</h4>
          {(() => {
            const node = selectedDNA.helix_structure.find(n => n.patent_id === selectedBase);
            return node ? (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Patent ID:</span>{' '}
                  <span className="font-mono">{node.patent_id}</span>
                </div>
                <div>
                  <span className="text-gray-500">Base Type:</span>{' '}
                  <span
                    className="font-mono px-2 py-1 rounded text-white text-xs"
                    style={{ backgroundColor: BASE_COLORS[node.base_type] }}
                  >
                    {node.base_type}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Innovation Strength:</span>{' '}
                  <span className="font-medium">{node.innovation_strength.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Position:</span>{' '}
                  <span className="font-mono text-xs">
                    [{node.position.map(p => p.toFixed(1)).join(', ')}]
                  </span>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}