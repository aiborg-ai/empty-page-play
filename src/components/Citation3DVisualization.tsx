import { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import { 
  Box, 
  Maximize, 
  RotateCcw,
  Download,
  BarChart3,
  Network,
  Search
} from 'lucide-react';
import * as THREE from 'three';
import { Citation3DGenerator } from '../lib/citation3D';
import type { Citation3DGraph, Citation3DNode, Citation3DEdge } from '../types/innovations';

interface Citation3DVisualizationProps {
  currentUser: any;
  projectId?: string;
}

interface NodeProps {
  node: Citation3DNode;
  isSelected: boolean;
  onClick: (node: Citation3DNode) => void;
  onHover: (node: Citation3DNode | null) => void;
}

interface EdgeProps {
  edge: Citation3DEdge;
  nodes: Citation3DNode[];
}

function PatentNode({ node, isSelected, onClick, onHover }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={[node.x, node.y, node.z]}>
      <Sphere
        ref={meshRef}
        args={[node.size / 2, 16, 16]}
        onClick={() => onClick(node)}
        onPointerOver={() => {
          setHovered(true);
          onHover(node);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <meshStandardMaterial
          color={node.color}
          opacity={hovered || isSelected ? 1 : 0.8}
          transparent
        />
      </Sphere>
      {(hovered || isSelected) && (
        <Text
          position={[0, node.size / 2 + 10, 0]}
          fontSize={6}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {node.patentId}
        </Text>
      )}
    </group>
  );
}

function PatentEdge({ edge, nodes }: EdgeProps) {
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);
  
  if (!sourceNode || !targetNode) return null;

  const points = [
    new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z),
    new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z)
  ];

  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'citation': return '#3b82f6';
      case 'inventor': return '#10b981';
      case 'similarity': return '#f59e0b';
      case 'assignee': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Line
      points={points}
      color={getEdgeColor(edge.type)}
      lineWidth={edge.weight * 3}
      opacity={0.6}
      transparent
    />
  );
}

function Scene3D({ 
  graph, 
  selectedNode, 
  onNodeClick, 
  onNodeHover 
}: { 
  graph: Citation3DGraph; 
  selectedNode: Citation3DNode | null;
  onNodeClick: (node: Citation3DNode) => void;
  onNodeHover: (node: Citation3DNode | null) => void;
}) {
  // const { camera } = useThree();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enablePan enableZoom enableRotate />
      
      {/* Render edges first (behind nodes) */}
      {graph.edges.map((edge, index) => (
        <PatentEdge key={`edge-${index}`} edge={edge} nodes={graph.nodes} />
      ))}
      
      {/* Render nodes */}
      {graph.nodes.map((node) => (
        <PatentNode
          key={node.id}
          node={node}
          isSelected={selectedNode?.id === node.id}
          onClick={onNodeClick}
          onHover={onNodeHover}
        />
      ))}
    </>
  );
}

export default function Citation3DVisualization({ currentUser: _currentUser, projectId: _projectId }: Citation3DVisualizationProps) {
  const [graph, setGraph] = useState<Citation3DGraph | null>(null);
  const [selectedNode, setSelectedNode] = useState<Citation3DNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Citation3DNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'citation' | 'inventor' | 'similarity'>('all');
  const [showMetrics, setShowMetrics] = useState(false);
  const [networkMetrics, setNetworkMetrics] = useState<any>(null);
  const [centralPatentId, setCentralPatentId] = useState('US10123456');

  const generator = useMemo(() => new Citation3DGenerator(), []);

  const handleGenerateNetwork = async () => {
    setIsLoading(true);
    try {
      let newGraph = generator.generateMockCitationNetwork(centralPatentId);
      
      // Apply physics simulation for better layout
      newGraph = generator.applyPhysicsSimulation(newGraph, 100);
      
      // Calculate network metrics
      const metrics = generator.calculateNetworkMetrics(newGraph);
      
      setGraph(newGraph);
      setNetworkMetrics(metrics);
    } catch (error) {
      alert(`Failed to generate network: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeClick = (node: Citation3DNode) => {
    setSelectedNode(node);
  };

  const handleNodeHover = (node: Citation3DNode | null) => {
    setHoveredNode(node);
  };

  const filteredEdges = graph ? graph.edges.filter(edge => 
    filterType === 'all' || edge.type === filterType
  ) : [];

  const filteredNodes = graph ? graph.nodes.filter(node =>
    searchQuery === '' || 
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.patentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.inventors.some(inv => inv.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  const displayNode = hoveredNode || selectedNode;

  return (
    <div className="h-full bg-gray-50 flex">
      {/* Controls Panel */}
      <div className="w-80 bg-white shadow-sm p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Network className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">3D Citation Network</h2>
            <p className="text-gray-600 text-sm">Interactive patent visualization</p>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Central Patent ID
            </label>
            <input
              type="text"
              value={centralPatentId}
              onChange={(e) => setCentralPatentId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter patent ID..."
            />
          </div>

          <button
            onClick={handleGenerateNetwork}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Box className="w-4 h-4" />
                Generate Network
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        {graph && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Patents
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search patents..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edge Type Filter
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Connections</option>
                <option value="citation">Citations Only</option>
                <option value="inventor">Inventor Connections</option>
                <option value="similarity">Similarity Links</option>
              </select>
            </div>
          </div>
        )}

        {/* Network Metrics */}
        {graph && networkMetrics && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Network Metrics</h3>
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className="text-blue-600 hover:text-blue-700"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
            
            {showMetrics && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-blue-600">{graph.nodes.length}</div>
                    <div className="text-xs text-gray-600">Nodes</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-green-600">{graph.edges.length}</div>
                    <div className="text-xs text-gray-600">Edges</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-purple-600">{networkMetrics.networkDensity.toFixed(3)}</div>
                    <div className="text-xs text-gray-600">Density</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-orange-600">{networkMetrics.clusteringCoefficient.toFixed(3)}</div>
                    <div className="text-xs text-gray-600">Clustering</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Node Details */}
        {displayNode && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{displayNode.patentId}</h3>
            <p className="text-sm text-gray-700 mb-2">{displayNode.title}</p>
            
            <div className="space-y-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">Inventors:</span> {displayNode.inventors.join(', ')}
              </div>
              <div>
                <span className="font-medium">Filing Date:</span> {displayNode.filingDate}
              </div>
              <div>
                <span className="font-medium">Category:</span> {displayNode.category}
              </div>
              <div>
                <span className="font-medium">Citations:</span> {displayNode.citationCount}
              </div>
              {networkMetrics?.centralityScores[displayNode.id] && (
                <div>
                  <span className="font-medium">Centrality:</span> {networkMetrics.centralityScores[displayNode.id].toFixed(3)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        {graph && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Edge Types</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-blue-500"></div>
                <span>Citation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-green-500"></div>
                <span>Inventor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-yellow-500"></div>
                <span>Similarity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-red-500"></div>
                <span>Assignee</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3D Visualization */}
      <div className="flex-1 relative">
        {graph ? (
          <Canvas
            camera={{ position: [200, 200, 200], fov: 75 }}
            style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a)' }}
          >
            <Suspense fallback={null}>
              <Scene3D
                graph={{
                  ...graph,
                  edges: filteredEdges,
                  nodes: filteredNodes
                }}
                selectedNode={selectedNode}
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
              />
            </Suspense>
          </Canvas>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <Network className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">3D Citation Network</h3>
              <p className="text-gray-600 mb-4">Generate a network to explore patent citations in 3D space</p>
              <button
                onClick={handleGenerateNetwork}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <Box className="w-5 h-5" />
                Generate Network
              </button>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        {graph && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => {
                // Reset camera position
                window.location.reload();
              }}
              className="bg-white/90 p-2 rounded-lg shadow-sm hover:bg-white"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              className="bg-white/90 p-2 rounded-lg shadow-sm hover:bg-white"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <button
              className="bg-white/90 p-2 rounded-lg shadow-sm hover:bg-white"
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 animate-spin text-blue-600" />
              <span>Generating 3D citation network...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}