import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Eye, Network, MapPin,
  Clock, Award, TrendingUp, Share2, Heart, Bookmark, Play, Pause, RotateCcw, Settings, ChevronRight, GitBranch
} from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';

interface Patent {
  id: string;
  patent_number: string;
  title: string;
  abstract_text?: string;
  filing_date: string;
  grant_date: string;
  status: string;
  inventors: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }>;
  assignees: Array<{
    id: string;
    name: string;
    country: string;
  }>;
  classifications: Array<{
    id: string;
    full_code: string;
    class_title: string;
  }>;
  citations?: Array<{
    id: string;
    cited_patent_number: string;
  }>;
  citationCount?: number;
  familySize?: number;
  impactScore?: number;
}

interface PatentNode {
  id: string;
  name: string;
  type: 'patent' | 'inventor' | 'assignee' | 'classification';
  patent?: Patent;
  size: number;
  color: string;
  x?: number;
  y?: number;
}

interface PatentLink {
  source: string;
  target: string;
  type: 'citation' | 'inventor' | 'assignee' | 'classification';
  strength: number;
}

interface VisualPatentExplorerProps {
  onStartTour?: () => void;
}

export default function VisualPatentExplorer({ onStartTour: _onStartTour }: VisualPatentExplorerProps) {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'family' | 'timeline' | 'landscape'>('network');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [_filterTechnology, _setFilterTechnology] = useState<string>('all');
  const [_filterYears, _setFilterYears] = useState<[number, number]>([2020, 2024]);
  const [_zoomLevel, _setZoomLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [_selectedNodeId, _setSelectedNodeId] = useState<string | null>(null);

  // Load patent data
  useEffect(() => {
    loadPatentData();
  }, []);

  const loadPatentData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in real implementation, this would fetch from your patent API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPatents: Patent[] = [
        {
          id: '1',
          patent_number: 'US11234567B2',
          title: 'Machine Learning System for Patent Analysis',
          abstract_text: 'A comprehensive system for analyzing patents using advanced machine learning algorithms...',
          filing_date: '2020-01-15',
          grant_date: '2023-03-20',
          status: 'active',
          inventors: [
            { id: 'inv1', first_name: 'John', last_name: 'Smith' },
            { id: 'inv2', first_name: 'Sarah', last_name: 'Johnson' }
          ],
          assignees: [
            { id: 'asg1', name: 'Tech Innovation Corp', country: 'US' }
          ],
          classifications: [
            { id: 'cls1', full_code: 'G06N3/08', class_title: 'Neural networks' },
            { id: 'cls2', full_code: 'G06F17/30', class_title: 'Information retrieval' }
          ],
          citations: [
            { id: 'cit1', cited_patent_number: 'US10123456B1' },
            { id: 'cit2', cited_patent_number: 'US10234567B1' }
          ],
          citationCount: 45,
          familySize: 3,
          impactScore: 8.5
        },
        {
          id: '2',
          patent_number: 'US11345678B2',
          title: 'Quantum Computing Circuit Optimization',
          abstract_text: 'Novel methods for optimizing quantum computing circuits using genetic algorithms...',
          filing_date: '2021-03-10',
          grant_date: '2023-08-15',
          status: 'active',
          inventors: [
            { id: 'inv3', first_name: 'Alice', last_name: 'Brown' },
            { id: 'inv4', first_name: 'Bob', last_name: 'Wilson' }
          ],
          assignees: [
            { id: 'asg2', name: 'Quantum Systems Inc', country: 'US' }
          ],
          classifications: [
            { id: 'cls3', full_code: 'G06N10/00', class_title: 'Quantum computing' },
            { id: 'cls4', full_code: 'G06F17/11', class_title: 'Genetic algorithms' }
          ],
          citationCount: 23,
          familySize: 2,
          impactScore: 9.2
        },
        {
          id: '3',
          patent_number: 'US11456789B2',
          title: 'Blockchain-Based Intellectual Property Protection',
          abstract_text: 'Distributed ledger system for protecting intellectual property rights...',
          filing_date: '2019-11-05',
          grant_date: '2022-12-10',
          status: 'active',
          inventors: [
            { id: 'inv2', first_name: 'Sarah', last_name: 'Johnson' },
            { id: 'inv5', first_name: 'David', last_name: 'Lee' }
          ],
          assignees: [
            { id: 'asg1', name: 'Tech Innovation Corp', country: 'US' }
          ],
          classifications: [
            { id: 'cls5', full_code: 'G06Q50/18', class_title: 'Blockchain applications' },
            { id: 'cls6', full_code: 'G06F21/64', class_title: 'Data integrity' }
          ],
          citationCount: 67,
          familySize: 4,
          impactScore: 7.8
        }
      ];
      
      setPatents(mockPatents);
    } catch (error) {
      console.error('Failed to load patent data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate network graph data
  const graphData = useMemo(() => {
    if (!patents.length) return { nodes: [], links: [] };

    const nodes: PatentNode[] = [];
    const links: PatentLink[] = [];
    const nodeMap = new Map();

    // Create patent nodes
    patents.forEach(patent => {
      const patentNode: PatentNode = {
        id: patent.id,
        name: patent.title,
        type: 'patent',
        patent,
        size: Math.max(5, (patent.citationCount || 0) / 2),
        color: getPatentColor(patent)
      };
      nodes.push(patentNode);
      nodeMap.set(patent.id, patentNode);

      // Create inventor nodes
      patent.inventors.forEach(inventor => {
        const inventorId = `inv_${inventor.id}`;
        if (!nodeMap.has(inventorId)) {
          nodes.push({
            id: inventorId,
            name: `${inventor.first_name} ${inventor.last_name}`,
            type: 'inventor',
            size: 3,
            color: '#10b981'
          });
          nodeMap.set(inventorId, true);
        }
        
        links.push({
          source: patent.id,
          target: inventorId,
          type: 'inventor',
          strength: 0.3
        });
      });

      // Create assignee nodes
      patent.assignees.forEach(assignee => {
        const assigneeId = `asg_${assignee.id}`;
        if (!nodeMap.has(assigneeId)) {
          nodes.push({
            id: assigneeId,
            name: assignee.name,
            type: 'assignee',
            size: 4,
            color: '#f59e0b'
          });
          nodeMap.set(assigneeId, true);
        }
        
        links.push({
          source: patent.id,
          target: assigneeId,
          type: 'assignee',
          strength: 0.5
        });
      });

      // Create classification nodes
      patent.classifications.forEach(classification => {
        const classId = `cls_${classification.full_code}`;
        if (!nodeMap.has(classId)) {
          nodes.push({
            id: classId,
            name: classification.class_title,
            type: 'classification',
            size: 3,
            color: '#8b5cf6'
          });
          nodeMap.set(classId, true);
        }
        
        links.push({
          source: patent.id,
          target: classId,
          type: 'classification',
          strength: 0.2
        });
      });
    });

    return { nodes, links };
  }, [patents]);

  const getPatentColor = (patent: Patent) => {
    const year = new Date(patent.grant_date).getFullYear();
    if (year >= 2023) return '#3b82f6'; // Blue for recent
    if (year >= 2021) return '#06b6d4'; // Cyan for medium
    return '#6366f1'; // Indigo for older
  };

  const handleNodeClick = useCallback((node: PatentNode) => {
    if (node.type === 'patent' && node.patent) {
      setSelectedPatent(node.patent);
      _setSelectedNodeId(node.id);
    }
  }, []);

  const PatentCard = ({ patent }: { patent: Patent }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="text-sm text-blue-600 font-medium mb-1">
            {patent.patent_number}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {patent.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{patent.impactScore}/10</div>
            <div className="text-xs text-gray-500">Impact Score</div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {patent.abstract_text}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{patent.citationCount}</div>
          <div className="text-xs text-blue-700">Citations</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{patent.familySize}</div>
          <div className="text-xs text-green-700">Family Size</div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-xs font-medium text-gray-500 mb-1">INVENTORS</div>
          <div className="flex flex-wrap gap-1">
            {patent.inventors.map((inventor, idx) => (
              <span key={idx} className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                {inventor.first_name} {inventor.last_name}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-gray-500 mb-1">ASSIGNEES</div>
          <div className="flex flex-wrap gap-1">
            {patent.assignees.map((assignee, idx) => (
              <span key={idx} className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                {assignee.name}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-gray-500 mb-1">TECHNOLOGIES</div>
          <div className="flex flex-wrap gap-1">
            {patent.classifications.map((cls, idx) => (
              <span key={idx} className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                {cls.full_code}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Filed: {new Date(patent.filing_date).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Patent Universe...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Visual Patent Explorer</h1>
                <p className="text-sm text-gray-600">Interactive patent discovery & analysis</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* View Mode Selector */}
            <div className="flex bg-white/50 rounded-lg p-1">
              {[
                { id: 'network', icon: Network, label: 'Network' },
                { id: 'family', icon: GitBranch, label: 'Family' },
                { id: 'timeline', icon: Clock, label: 'Timeline' },
                { id: 'landscape', icon: MapPin, label: 'Landscape' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-all ${
                    viewMode === mode.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <mode.icon className="w-4 h-4" />
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex">
        {/* Main Visualization Area */}
        <div className="flex-1 relative">
          {viewMode === 'network' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full"
            >
              <ForceGraph2D
                graphData={graphData}
                nodeId="id"
                nodeLabel="name"
                nodeColor={(node: any) => node.color}
                nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                  const label = node.name;
                  const fontSize = 12/globalScale;
                  ctx.font = `${fontSize}px Sans-Serif`;
                  const textWidth = ctx.measureText(label).width;
                  const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                  // Draw node
                  ctx.fillStyle = node.color;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
                  ctx.fill();

                  // Draw label background
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                  ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

                  // Draw label text
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = '#333';
                  ctx.fillText(label, node.x, node.y);
                }}
                onNodeClick={handleNodeClick}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                linkColor={() => 'rgba(59, 130, 246, 0.3)'}
                backgroundColor="transparent"
                width={window.innerWidth * 0.7}
                height={window.innerHeight - 100}
              />
            </motion.div>
          )}

          {viewMode === 'family' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full p-6"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                  Patent Family Tree
                </h3>
                <p className="text-gray-600">Explore patent relationships and family connections</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Patent Family Tree */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Family Relationships</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        Parent
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        Child
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        Continuation
                      </div>
                    </div>
                  </div>

                  {/* Tree Visualization */}
                  <div className="relative h-96 overflow-auto">
                    <svg className="w-full h-full" viewBox="0 0 800 400">
                      {/* Root Patent */}
                      <g transform="translate(400, 50)">
                        <circle r="25" fill="#3b82f6" className="cursor-pointer hover:opacity-80" />
                        <text x="0" y="5" textAnchor="middle" className="text-xs fill-white font-medium">
                          US11234567
                        </text>
                        <text x="0" y="45" textAnchor="middle" className="text-xs fill-gray-600">
                          Parent Patent
                        </text>
                      </g>

                      {/* Connection Lines */}
                      <line x1="400" y1="75" x2="300" y2="150" stroke="#e5e7eb" strokeWidth="2" />
                      <line x1="400" y1="75" x2="500" y2="150" stroke="#e5e7eb" strokeWidth="2" />
                      <line x1="400" y1="75" x2="400" y2="150" stroke="#e5e7eb" strokeWidth="2" />

                      {/* Child Patents */}
                      <g transform="translate(300, 175)">
                        <circle r="20" fill="#10b981" className="cursor-pointer hover:opacity-80" />
                        <text x="0" y="4" textAnchor="middle" className="text-xs fill-white font-medium">
                          US11345678
                        </text>
                        <text x="0" y="35" textAnchor="middle" className="text-xs fill-gray-600">
                          Continuation
                        </text>
                      </g>

                      <g transform="translate(400, 175)">
                        <circle r="20" fill="#8b5cf6" className="cursor-pointer hover:opacity-80" />
                        <text x="0" y="4" textAnchor="middle" className="text-xs fill-white font-medium">
                          US11456789
                        </text>
                        <text x="0" y="35" textAnchor="middle" className="text-xs fill-gray-600">
                          Divisional
                        </text>
                      </g>

                      <g transform="translate(500, 175)">
                        <circle r="20" fill="#10b981" className="cursor-pointer hover:opacity-80" />
                        <text x="0" y="4" textAnchor="middle" className="text-xs fill-white font-medium">
                          US11567890
                        </text>
                        <text x="0" y="35" textAnchor="middle" className="text-xs fill-gray-600">
                          CIP
                        </text>
                      </g>

                      {/* Second Level Connections */}
                      <line x1="300" y1="195" x2="250" y2="270" stroke="#e5e7eb" strokeWidth="2" />
                      <line x1="300" y1="195" x2="350" y2="270" stroke="#e5e7eb" strokeWidth="2" />

                      {/* Grandchild Patents */}
                      <g transform="translate(250, 295)">
                        <circle r="15" fill="#f59e0b" className="cursor-pointer hover:opacity-80" />
                        <text x="0" y="3" textAnchor="middle" className="text-xs fill-white font-medium">
                          US11678901
                        </text>
                        <text x="0" y="30" textAnchor="middle" className="text-xs fill-gray-600">
                          Extension
                        </text>
                      </g>

                      <g transform="translate(350, 295)">
                        <circle r="15" fill="#f59e0b" className="cursor-pointer hover:opacity-80" />
                        <text x="0" y="3" textAnchor="middle" className="text-xs fill-white font-medium">
                          US11789012
                        </text>
                        <text x="0" y="30" textAnchor="middle" className="text-xs fill-gray-600">
                          Foreign
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Family Details Panel */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Family Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Family Size</span>
                        <span className="font-semibold text-blue-600">7 Patents</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Active Patents</span>
                        <span className="font-semibold text-green-600">5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pending Applications</span>
                        <span className="font-semibold text-yellow-600">2</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Jurisdictions</span>
                        <span className="font-semibold text-purple-600">4</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Priority Chain</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">US61/123,456</div>
                          <div className="text-xs text-gray-500">Provisional • Jan 15, 2020</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">US16/234,567</div>
                          <div className="text-xs text-gray-500">Non-Provisional • Jan 14, 2021</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">PCT/US21/12345</div>
                          <div className="text-xs text-gray-500">PCT Filing • Jan 14, 2021</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Related Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        G06N3/08
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        G06F17/30
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        G06N20/00
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        G06Q10/00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'timeline' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full p-6"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Patent Timeline
                </h3>
                <p className="text-gray-600">Chronological patent development and milestone visualization</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
                {/* Timeline Visualization */}
                <div className="xl:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Patent Development Timeline</h4>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                        2019-2024
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-50">
                        All Time
                      </button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative">
                    {/* Timeline axis */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-8"></div>
                    
                    {/* Year markers */}
                    {[2019, 2020, 2021, 2022, 2023, 2024].map((year, index) => (
                      <div key={year} className="absolute" style={{ left: `${index * 16.67}%` }}>
                        <div className="w-3 h-3 bg-gray-400 rounded-full -mt-1.5 mb-2"></div>
                        <div className="text-xs text-gray-500 -ml-2">{year}</div>
                      </div>
                    ))}

                    {/* Patent events */}
                    <div className="mt-16 space-y-4">
                      {/* 2020 Filing */}
                      <div className="relative">
                        <div className="absolute" style={{ left: '16.67%' }}>
                          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md -mt-2"></div>
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-48 shadow-sm">
                              <div className="text-sm font-medium text-blue-900">Application Filed</div>
                              <div className="text-xs text-blue-700">US16/123,456</div>
                              <div className="text-xs text-gray-500 mt-1">Jan 15, 2020</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2021 Publication */}
                      <div className="relative">
                        <div className="absolute" style={{ left: '33.33%' }}>
                          <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-md -mt-2"></div>
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 w-48 shadow-sm">
                              <div className="text-sm font-medium text-yellow-900">Patent Published</div>
                              <div className="text-xs text-yellow-700">US20210234567A1</div>
                              <div className="text-xs text-gray-500 mt-1">Jul 15, 2021</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2023 Grant */}
                      <div className="relative">
                        <div className="absolute" style={{ left: '66.67%' }}>
                          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md -mt-2"></div>
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 w-48 shadow-sm">
                              <div className="text-sm font-medium text-green-900">Patent Granted</div>
                              <div className="text-xs text-green-700">US11234567B2</div>
                              <div className="text-xs text-gray-500 mt-1">Mar 20, 2023</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2024 Citations */}
                      <div className="relative">
                        <div className="absolute" style={{ left: '83.33%' }}>
                          <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md -mt-2"></div>
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 w-48 shadow-sm">
                              <div className="text-sm font-medium text-purple-900">High Citations</div>
                              <div className="text-xs text-purple-700">45+ Forward Citations</div>
                              <div className="text-xs text-gray-500 mt-1">2024 Impact</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Patent lifecycle bars */}
                    <div className="mt-24">
                      <h5 className="text-sm font-medium text-gray-900 mb-3">Patent Lifecycle</h5>
                      {patents.slice(0, 3).map((patent, _index) => (
                        <div key={patent.id} className="mb-3">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="text-sm text-gray-700 w-32">{patent.patent_number}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-2 relative">
                              {/* Filing to Grant */}
                              <div 
                                className="bg-gradient-to-r from-blue-400 to-green-500 h-2 rounded-full"
                                style={{ width: '85%' }}
                              ></div>
                              {/* Maintenance period */}
                              <div 
                                className="absolute right-0 top-0 bg-gray-300 h-2 rounded-r-full"
                                style={{ width: '15%' }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 ml-35">
                            <span>Filed: {new Date(patent.filing_date).getFullYear()}</span>
                            <span>Granted: {new Date(patent.grant_date).getFullYear()}</span>
                            <span>Expires: {new Date(patent.grant_date).getFullYear() + 20}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline Controls */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Timeline Controls</h4>
                    <div className="space-y-3">
                      <button className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Play Timeline
                      </button>
                      <button className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Reset View
                      </button>
                      <div className="pt-2">
                        <label className="text-xs text-gray-500 block mb-1">Animation Speed</label>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="3" 
                          step="0.5" 
                          defaultValue="1" 
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Event Legend</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Filing Date</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Publication</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Grant Date</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Citations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Expiration</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Key Milestones</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>• 3 patents filed</div>
                      <div>• 2 patents granted</div>
                      <div>• 1 application pending</div>
                      <div>• 135 total citations</div>
                      <div>• 4.2 avg years to grant</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'landscape' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full p-6"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Patent Landscape
                </h3>
                <p className="text-gray-600">Technology mapping and competitive landscape analysis</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Technology Map */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Technology Landscape Map</h4>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100">
                        AI/ML
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-50">
                        All Tech
                      </button>
                    </div>
                  </div>

                  {/* Technology Bubble Chart */}
                  <div className="relative h-96 bg-gray-50 rounded-lg overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 600 400">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="600" height="400" fill="url(#grid)" />
                      
                      {/* Axes */}
                      <line x1="50" y1="350" x2="550" y2="350" stroke="#9ca3af" strokeWidth="2" />
                      <line x1="50" y1="50" x2="50" y2="350" stroke="#9ca3af" strokeWidth="2" />
                      
                      {/* Axis labels */}
                      <text x="300" y="380" textAnchor="middle" className="text-sm fill-gray-600">
                        Patent Volume (Maturity)
                      </text>
                      <text x="30" y="200" textAnchor="middle" className="text-sm fill-gray-600" transform="rotate(-90 30 200)">
                        Innovation Rate (Growth)
                      </text>

                      {/* Technology bubbles */}
                      {/* AI/ML - High growth, high volume */}
                      <g transform="translate(420, 120)">
                        <circle r="35" fill="#3b82f6" opacity="0.7" className="cursor-pointer hover:opacity-90" />
                        <text x="0" y="-5" textAnchor="middle" className="text-sm fill-white font-medium">
                          AI/ML
                        </text>
                        <text x="0" y="8" textAnchor="middle" className="text-xs fill-white">
                          15,420
                        </text>
                      </g>

                      {/* Quantum Computing - Very high growth, lower volume */}
                      <g transform="translate(200, 80)">
                        <circle r="25" fill="#8b5cf6" opacity="0.7" className="cursor-pointer hover:opacity-90" />
                        <text x="0" y="-3" textAnchor="middle" className="text-sm fill-white font-medium">
                          Quantum
                        </text>
                        <text x="0" y="10" textAnchor="middle" className="text-xs fill-white">
                          3,240
                        </text>
                      </g>

                      {/* Blockchain - Medium growth, medium volume */}
                      <g transform="translate(300, 200)">
                        <circle r="28" fill="#10b981" opacity="0.7" className="cursor-pointer hover:opacity-90" />
                        <text x="0" y="-3" textAnchor="middle" className="text-sm fill-white font-medium">
                          Blockchain
                        </text>
                        <text x="0" y="10" textAnchor="middle" className="text-xs fill-white">
                          5,680
                        </text>
                      </g>

                      {/* 5G - High volume, medium growth */}
                      <g transform="translate(450, 180)">
                        <circle r="32" fill="#f59e0b" opacity="0.7" className="cursor-pointer hover:opacity-90" />
                        <text x="0" y="-3" textAnchor="middle" className="text-sm fill-white font-medium">
                          5G Tech
                        </text>
                        <text x="0" y="10" textAnchor="middle" className="text-xs fill-white">
                          8,920
                        </text>
                      </g>

                      {/* Autonomous Vehicles - High volume, lower growth */}
                      <g transform="translate(480, 250)">
                        <circle r="30" fill="#ef4444" opacity="0.7" className="cursor-pointer hover:opacity-90" />
                        <text x="0" y="-3" textAnchor="middle" className="text-sm fill-white font-medium">
                          Auto Vehicles
                        </text>
                        <text x="0" y="10" textAnchor="middle" className="text-xs fill-white">
                          7,650
                        </text>
                      </g>

                      {/* Biotech - Medium volume, high growth */}
                      <g transform="translate(350, 140)">
                        <circle r="29" fill="#06b6d4" opacity="0.7" className="cursor-pointer hover:opacity-90" />
                        <text x="0" y="-3" textAnchor="middle" className="text-sm fill-white font-medium">
                          Biotech
                        </text>
                        <text x="0" y="10" textAnchor="middle" className="text-xs fill-white">
                          9,840
                        </text>
                      </g>

                      {/* Renewable Energy - High volume, medium growth */}
                      <g transform="translate(400, 220)">
                        <circle r="31" fill="#22c55e" opacity="0.7" className="cursor-pointer hover:opacity-90" />
                        <text x="0" y="-3" textAnchor="middle" className="text-sm fill-white font-medium">
                          Renewable
                        </text>
                        <text x="0" y="10" textAnchor="middle" className="text-xs fill-white">
                          11,200
                        </text>
                      </g>

                      {/* IoT - Lower growth, high volume */}
                      <g transform="translate(520, 280)">
                        <circle r="27" fill="#a855f7" opacity="0.7" className="cursor-pointer hover:opacity-90" />
                        <text x="0" y="-3" textAnchor="middle" className="text-sm fill-white font-medium">
                          IoT
                        </text>
                        <text x="0" y="10" textAnchor="middle" className="text-xs fill-white">
                          6,450
                        </text>
                      </g>

                      {/* Quadrant labels */}
                      <text x="150" y="80" className="text-xs fill-gray-500 font-medium">Emerging</text>
                      <text x="450" y="80" className="text-xs fill-gray-500 font-medium">Leaders</text>
                      <text x="150" y="330" className="text-xs fill-gray-500 font-medium">Niche</text>
                      <text x="450" y="330" className="text-xs fill-gray-500 font-medium">Mature</text>
                    </svg>
                  </div>
                </div>

                {/* Landscape Analysis */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Competitive Intensity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">AI/Machine Learning</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-xs font-medium text-red-600">High</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Quantum Computing</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-xs font-medium text-yellow-600">Med</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Blockchain</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <span className="text-xs font-medium text-yellow-600">Med</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">5G Technology</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-xs font-medium text-red-600">High</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">White Space Opportunities</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-50 rounded text-sm">
                        <div className="font-medium text-blue-900">AI + Quantum Hybrid</div>
                        <div className="text-blue-700 text-xs">Low patent density, high potential</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded text-sm">
                        <div className="font-medium text-green-900">Biotech AI Applications</div>
                        <div className="text-green-700 text-xs">Emerging opportunity space</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded text-sm">
                        <div className="font-medium text-purple-900">Sustainable Quantum</div>
                        <div className="text-purple-700 text-xs">Underexplored intersection</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Top Players</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">IBM</span>
                        <span className="font-medium text-blue-600">9,043</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Samsung</span>
                        <span className="font-medium text-blue-600">8,539</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Microsoft</span>
                        <span className="font-medium text-blue-600">2,905</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Google</span>
                        <span className="font-medium text-blue-600">1,843</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Technology Trends</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Quantum computing +67.8%
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        AI/ML applications +23.5%
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-yellow-500" />
                        5G technology +18.7%
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Renewable energy +14.2%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg"
          >
            <div className="text-sm font-medium text-gray-900 mb-2">Network Statistics</div>
            <div className="space-y-1 text-xs text-gray-600">
              <div>Patents: {patents.length}</div>
              <div>Nodes: {graphData.nodes.length}</div>
              <div>Connections: {graphData.links.length}</div>
              <div>Avg Citations: {Math.round(patents.reduce((sum, p) => sum + (p.citationCount || 0), 0) / patents.length)}</div>
            </div>
          </motion.div>
        </div>

        {/* Side Panel */}
        <AnimatePresence>
          {selectedPatent && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="w-80 bg-white/80 backdrop-blur-sm border-l border-white/20 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Patent Details</h2>
                <button
                  onClick={() => setSelectedPatent(null)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <PatentCard patent={selectedPatent} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}