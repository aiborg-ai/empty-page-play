// import * as THREE from 'three';
import type { Citation3DGraph, Citation3DNode, Citation3DEdge } from '../types/innovations';

export class Citation3DGenerator {
  generateMockCitationNetwork(centralPatentId: string, _depth: number = 2): Citation3DGraph {
    const nodes: Citation3DNode[] = [];
    const edges: Citation3DEdge[] = [];
    
    // Create central node
    const centerNode: Citation3DNode = {
      id: centralPatentId,
      patentId: centralPatentId,
      title: 'Central Patent: AI-Based Image Recognition System',
      inventors: ['John Smith', 'Jane Doe'],
      filingDate: '2023-01-15',
      citationCount: 25,
      category: 'Artificial Intelligence',
      x: 0,
      y: 0,
      z: 0,
      size: 20,
      color: '#3b82f6'
    };
    nodes.push(centerNode);

    // Generate citing patents (patents that cite this one)
    const citingPatents = this.generatePatentCluster(15, 'citing', centerNode);
    nodes.push(...citingPatents);
    
    // Create edges from citing patents to center
    citingPatents.forEach(patent => {
      edges.push({
        source: patent.id,
        target: centerNode.id,
        weight: Math.random() * 0.8 + 0.2,
        type: 'citation'
      });
    });

    // Generate cited patents (patents this one cites)
    const citedPatents = this.generatePatentCluster(12, 'cited', centerNode);
    nodes.push(...citedPatents);
    
    // Create edges from center to cited patents
    citedPatents.forEach(patent => {
      edges.push({
        source: centerNode.id,
        target: patent.id,
        weight: Math.random() * 0.6 + 0.3,
        type: 'citation'
      });
    });

    // Generate inventor connections
    const inventorConnections = this.generateInventorConnections(nodes);
    edges.push(...inventorConnections);

    // Generate similarity connections
    const similarityConnections = this.generateSimilarityConnections(nodes);
    edges.push(...similarityConnections);

    return {
      nodes,
      edges,
      metadata: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        clusters: 3,
        centerNode: centerNode.id
      }
    };
  }

  private generatePatentCluster(count: number, type: 'citing' | 'cited', _centerNode: Citation3DNode): Citation3DNode[] {
    const patents: Citation3DNode[] = [];
    const radius = type === 'citing' ? 150 : 100;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = radius + (Math.random() - 0.5) * 50;
      const height = (Math.random() - 0.5) * 100;
      
      const patent: Citation3DNode = {
        id: `patent_${type}_${i}`,
        patentId: `US${Math.floor(Math.random() * 9000000) + 1000000}`,
        title: this.generatePatentTitle(),
        inventors: this.generateInventors(),
        filingDate: this.generateFilingDate(),
        citationCount: Math.floor(Math.random() * 20) + 1,
        category: this.getRandomCategory(),
        x: Math.cos(angle) * distance,
        y: height,
        z: Math.sin(angle) * distance,
        size: Math.random() * 10 + 5,
        color: this.getCategoryColor(this.getRandomCategory())
      };
      
      patents.push(patent);
    }
    
    return patents;
  }

  private generateInventorConnections(nodes: Citation3DNode[]): Citation3DEdge[] {
    const edges: Citation3DEdge[] = [];
    
    // Find patents with common inventors
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const commonInventors = nodes[i].inventors.filter(inv => 
          nodes[j].inventors.includes(inv)
        );
        
        if (commonInventors.length > 0 && Math.random() > 0.7) {
          edges.push({
            source: nodes[i].id,
            target: nodes[j].id,
            weight: commonInventors.length * 0.3,
            type: 'inventor'
          });
        }
      }
    }
    
    return edges;
  }

  private generateSimilarityConnections(nodes: Citation3DNode[]): Citation3DEdge[] {
    const edges: Citation3DEdge[] = [];
    
    // Create similarity connections between patents in same category
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].category === nodes[j].category && Math.random() > 0.8) {
          edges.push({
            source: nodes[i].id,
            target: nodes[j].id,
            weight: Math.random() * 0.4 + 0.1,
            type: 'similarity'
          });
        }
      }
    }
    
    return edges;
  }

  private generatePatentTitle(): string {
    const adjectives = ['Advanced', 'Smart', 'Intelligent', 'Automated', 'Enhanced', 'Novel', 'Improved'];
    const nouns = ['System', 'Method', 'Apparatus', 'Device', 'Process', 'Technique', 'Algorithm'];
    const domains = ['Machine Learning', 'Data Processing', 'Image Recognition', 'Signal Processing', 'Computer Vision', 'Neural Networks'];
    
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${domains[Math.floor(Math.random() * domains.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
  }

  private generateInventors(): string[] {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    const count = Math.floor(Math.random() * 3) + 1;
    const inventors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      inventors.push(`${firstName} ${lastName}`);
    }
    
    return inventors;
  }

  private generateFilingDate(): string {
    const year = 2020 + Math.floor(Math.random() * 5);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  private getRandomCategory(): string {
    const categories = [
      'Artificial Intelligence',
      'Machine Learning', 
      'Computer Vision',
      'Signal Processing',
      'Data Mining',
      'Robotics',
      'Neural Networks',
      'Pattern Recognition'
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private getCategoryColor(category: string): string {
    const colorMap: { [key: string]: string } = {
      'Artificial Intelligence': '#3b82f6',
      'Machine Learning': '#10b981',
      'Computer Vision': '#f59e0b',
      'Signal Processing': '#ef4444',
      'Data Mining': '#8b5cf6',
      'Robotics': '#f97316',
      'Neural Networks': '#ec4899',
      'Pattern Recognition': '#06b6d4'
    };
    return colorMap[category] || '#6b7280';
  }

  calculateNetworkMetrics(graph: Citation3DGraph): {
    centralityScores: { [nodeId: string]: number };
    clusteringCoefficient: number;
    averagePathLength: number;
    networkDensity: number;
  } {
    const nodes = graph.nodes;
    const edges = graph.edges;
    
    // Calculate degree centrality
    const centralityScores: { [nodeId: string]: number } = {};
    const degreeCount: { [nodeId: string]: number } = {};
    
    // Initialize degree counts
    nodes.forEach(node => {
      degreeCount[node.id] = 0;
    });
    
    // Count degrees
    edges.forEach(edge => {
      degreeCount[edge.source] = (degreeCount[edge.source] || 0) + 1;
      degreeCount[edge.target] = (degreeCount[edge.target] || 0) + 1;
    });
    
    // Calculate centrality scores (normalized by max possible degree)
    const maxDegree = Math.max(...Object.values(degreeCount));
    Object.keys(degreeCount).forEach(nodeId => {
      centralityScores[nodeId] = maxDegree > 0 ? degreeCount[nodeId] / maxDegree : 0;
    });
    
    // Calculate network density
    const maxPossibleEdges = (nodes.length * (nodes.length - 1)) / 2;
    const networkDensity = maxPossibleEdges > 0 ? edges.length / maxPossibleEdges : 0;
    
    // Simplified clustering coefficient (local clustering for each node)
    const clusteringCoefficient = this.calculateClusteringCoefficient(graph);
    
    // Simplified average path length estimation
    const averagePathLength = this.estimateAveragePathLength(graph);
    
    return {
      centralityScores,
      clusteringCoefficient,
      averagePathLength,
      networkDensity
    };
  }

  private calculateClusteringCoefficient(graph: Citation3DGraph): number {
    // Simplified clustering coefficient calculation
    let totalClustering = 0;
    let nodeCount = 0;
    
    graph.nodes.forEach(node => {
      const neighbors = this.getNeighbors(node.id, graph.edges);
      if (neighbors.length < 2) return;
      
      let possibleEdges = (neighbors.length * (neighbors.length - 1)) / 2;
      let actualEdges = 0;
      
      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          if (this.hasEdge(neighbors[i], neighbors[j], graph.edges)) {
            actualEdges++;
          }
        }
      }
      
      totalClustering += possibleEdges > 0 ? actualEdges / possibleEdges : 0;
      nodeCount++;
    });
    
    return nodeCount > 0 ? totalClustering / nodeCount : 0;
  }

  private estimateAveragePathLength(graph: Citation3DGraph): number {
    // Simplified estimation based on network structure
    const nodeCount = graph.nodes.length;
    const edgeCount = graph.edges.length;
    
    if (nodeCount <= 1) return 0;
    if (edgeCount === 0) return Infinity;
    
    // Rough estimation based on small world networks
    return Math.log(nodeCount) / Math.log(2 * edgeCount / nodeCount);
  }

  private getNeighbors(nodeId: string, edges: Citation3DEdge[]): string[] {
    const neighbors: string[] = [];
    edges.forEach(edge => {
      if (edge.source === nodeId) {
        neighbors.push(edge.target);
      } else if (edge.target === nodeId) {
        neighbors.push(edge.source);
      }
    });
    return neighbors;
  }

  private hasEdge(nodeA: string, nodeB: string, edges: Citation3DEdge[]): boolean {
    return edges.some(edge => 
      (edge.source === nodeA && edge.target === nodeB) ||
      (edge.source === nodeB && edge.target === nodeA)
    );
  }

  applyPhysicsSimulation(graph: Citation3DGraph, iterations: number = 50): Citation3DGraph {
    const nodes = [...graph.nodes];
    const edges = graph.edges;
    
    // Simple force-directed layout algorithm
    for (let iter = 0; iter < iterations; iter++) {
      // Apply repulsive forces between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance > 0) {
            const force = 500 / (distance * distance);
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            const fz = (dz / distance) * force;
            
            nodes[i].x += fx;
            nodes[i].y += fy;
            nodes[i].z += fz;
            nodes[j].x -= fx;
            nodes[j].y -= fy;
            nodes[j].z -= fz;
          }
        }
      }
      
      // Apply attractive forces along edges
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const dz = targetNode.z - sourceNode.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const targetDistance = 100;
          
          if (distance > 0) {
            const force = (distance - targetDistance) * 0.1 * edge.weight;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            const fz = (dz / distance) * force;
            
            sourceNode.x += fx;
            sourceNode.y += fy;
            sourceNode.z += fz;
            targetNode.x -= fx;
            targetNode.y -= fy;
            targetNode.z -= fz;
          }
        }
      });
      
      // Apply damping
      nodes.forEach(node => {
        node.x *= 0.95;
        node.y *= 0.95;
        node.z *= 0.95;
      });
    }
    
    return {
      ...graph,
      nodes
    };
  }
}