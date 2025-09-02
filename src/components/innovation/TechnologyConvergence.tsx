import React, { useState, useEffect, useRef } from 'react';
import { Network, Layers, Zap, Target, GitBranch, Eye } from 'lucide-react';

interface TechNode {
  id: string;
  name: string;
  category: string;
  connections: number;
  convergenceScore: number;
  x?: number;
  y?: number;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
  innovations: number;
}

const TechnologyConvergence: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const techNodes: TechNode[] = [
    { id: '1', name: 'AI/ML', category: 'Computing', connections: 8, convergenceScore: 95 },
    { id: '2', name: 'Quantum Computing', category: 'Computing', connections: 6, convergenceScore: 78 },
    { id: '3', name: 'Biotech', category: 'Life Sciences', connections: 7, convergenceScore: 82 },
    { id: '4', name: 'Nanotech', category: 'Materials', connections: 5, convergenceScore: 71 },
    { id: '5', name: 'Green Energy', category: 'Energy', connections: 6, convergenceScore: 88 },
    { id: '6', name: 'Robotics', category: 'Automation', connections: 9, convergenceScore: 91 },
    { id: '7', name: 'IoT', category: 'Connectivity', connections: 7, convergenceScore: 85 },
    { id: '8', name: 'Blockchain', category: 'Security', connections: 4, convergenceScore: 65 }
  ];

  const connections: Connection[] = [
    { source: '1', target: '3', strength: 85, innovations: 23 },
    { source: '1', target: '6', strength: 92, innovations: 31 },
    { source: '1', target: '7', strength: 78, innovations: 18 },
    { source: '2', target: '1', strength: 71, innovations: 12 },
    { source: '3', target: '4', strength: 88, innovations: 27 },
    { source: '5', target: '4', strength: 65, innovations: 9 },
    { source: '6', target: '7', strength: 83, innovations: 21 },
    { source: '7', target: '8', strength: 59, innovations: 7 }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    techNodes.forEach((node, index) => {
      const angle = (index / techNodes.length) * 2 * Math.PI;
      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connections.forEach(conn => {
      const source = techNodes.find(n => n.id === conn.source);
      const target = techNodes.find(n => n.id === conn.target);
      if (source?.x && source?.y && target?.x && target?.y) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = `rgba(59, 130, 246, ${conn.strength / 100})`;
        ctx.lineWidth = Math.max(1, conn.strength / 20);
        ctx.stroke();
      }
    });

    techNodes.forEach(node => {
      if (node.x && node.y) {
        const size = 20 + node.convergenceScore / 5;
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size);
        gradient.addColorStop(0, getCategoryColor(node.category));
        gradient.addColorStop(1, getCategoryColor(node.category, 0.3));
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        if (selectedNode === node.id) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.name, node.x, node.y);
      }
    });
  }, [selectedNode]);

  const getCategoryColor = (category: string, opacity = 1) => {
    const colors: Record<string, string> = {
      'Computing': `rgba(59, 130, 246, ${opacity})`,
      'Life Sciences': `rgba(16, 185, 129, ${opacity})`,
      'Materials': `rgba(139, 92, 246, ${opacity})`,
      'Energy': `rgba(245, 158, 11, ${opacity})`,
      'Automation': `rgba(239, 68, 68, ${opacity})`,
      'Connectivity': `rgba(6, 182, 212, ${opacity})`,
      'Security': `rgba(107, 114, 128, ${opacity})`
    };
    return colors[category] || `rgba(156, 163, 175, ${opacity})`;
  };

  const whiteSpaces = [
    { technologies: ['AI/ML', 'Quantum Computing'], opportunity: 'Quantum ML Algorithms', score: 92 },
    { technologies: ['Biotech', 'Robotics'], opportunity: 'Surgical Nanobots', score: 88 },
    { technologies: ['Green Energy', 'IoT'], opportunity: 'Smart Grid Optimization', score: 85 },
    { technologies: ['Blockchain', 'Biotech'], opportunity: 'Secure Health Records', score: 79 }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Technology Convergence Mapper</h1>
              <p className="text-gray-600 mt-2">Visualize technology intersections and identify innovation opportunities</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
                className="bg-white px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 hover:bg-gray-50"
              >
                <Layers className="w-5 h-5" />
                {viewMode === '2d' ? '3D View' : '2D View'}
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Eye className="w-5 h-5" />
                Full Analysis
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Network className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold">Technologies</h3>
              </div>
              <p className="text-2xl font-bold">{techNodes.length}</p>
              <p className="text-sm text-gray-600 mt-1">Active domains</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <GitBranch className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold">Convergences</h3>
              </div>
              <p className="text-2xl font-bold">{connections.length}</p>
              <p className="text-sm text-gray-600 mt-1">Active intersections</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold">White Spaces</h3>
              </div>
              <p className="text-2xl font-bold">{whiteSpaces.length}</p>
              <p className="text-sm text-gray-600 mt-1">Opportunities identified</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
                <h3 className="font-semibold">Innovation Score</h3>
              </div>
              <p className="text-2xl font-bold">87%</p>
              <p className="text-sm text-gray-600 mt-1">Portfolio alignment</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Convergence Map</h2>
              <canvas
                ref={canvasRef}
                className="w-full h-96 border border-gray-200 rounded-lg"
                onClick={(e) => {
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) {
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const clickedNode = techNodes.find(node => {
                      if (node.x && node.y) {
                        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
                        return distance < 30;
                      }
                      return false;
                    });
                    
                    setSelectedNode(clickedNode?.id || null);
                  }
                }}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from(new Set(techNodes.map(n => n.category))).map(category => (
                  <div key={category} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(category) }}
                    />
                    <span className="text-sm text-gray-600">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Innovation White Spaces</h3>
              <div className="space-y-3">
                {whiteSpaces.map((space, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{space.opportunity}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {space.technologies.join(' × ')}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-blue-600">{space.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Explore Opportunities
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Convergence Strength</h3>
              <div className="space-y-3">
                {connections
                  .sort((a, b) => b.strength - a.strength)
                  .slice(0, 5)
                  .map((conn, index) => {
                    const source = techNodes.find(n => n.id === conn.source);
                    const target = techNodes.find(n => n.id === conn.target);
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">
                          {source?.name} ↔ {target?.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${conn.strength}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{conn.strength}%</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyConvergence;