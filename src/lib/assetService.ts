// Asset Management Service

import { 
  Asset, 
  AssetFilter, 
  AssetSort, 
  AssetStats, 
  AssetUpload,
  AssetShare,
  AssetActivity,
  AssetType,
  AssetSource
} from '@/types/assets';

class AssetService {
  private mockAssets: Asset[] = this.generateMockAssets();

  // Get assets with filtering and sorting
  async getAssets(filter: AssetFilter, sort: AssetSort): Promise<Asset[]> {
    await this.simulateApiDelay();
    
    let filtered = [...this.mockAssets];

    // Apply filters
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchLower) ||
        a.description?.toLowerCase().includes(searchLower) ||
        a.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    if (filter.type && filter.type.length > 0) {
      filtered = filtered.filter(a => filter.type!.includes(a.type));
    }

    if (filter.source && filter.source.length > 0) {
      filtered = filtered.filter(a => filter.source!.includes(a.source));
    }

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(a => filter.status!.includes(a.status));
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(a => 
        filter.tags!.some(tag => a.tags.includes(tag))
      );
    }

    if (filter.myAssets) {
      filtered = filtered.filter(a => a.createdBy === 'current-user');
    }

    if (filter.sharedWithMe) {
      filtered = filtered.filter(a => a.sharedWith.length > 0);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sort.field];
      let bVal: any = b[sort.field];

      if (sort.field === 'createdAt' || sort.field === 'updatedAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (sort.direction === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }

  // Get asset statistics
  async getStats(): Promise<AssetStats> {
    await this.simulateApiDelay();

    const assetsByType: Record<AssetType, number> = {} as any;
    const assetsBySource: Record<AssetSource, number> = {} as any;
    
    this.mockAssets.forEach(asset => {
      assetsByType[asset.type] = (assetsByType[asset.type] || 0) + 1;
      assetsBySource[asset.source] = (assetsBySource[asset.source] || 0) + 1;
    });

    const totalSize = this.mockAssets.reduce((sum, a) => sum + a.fileSize, 0);

    return {
      totalAssets: this.mockAssets.length,
      totalSize,
      assetsByType,
      assetsBySource,
      recentActivity: this.generateRecentActivity(),
      topAssets: this.mockAssets.slice(0, 5),
      storageUsed: totalSize,
      storageLimit: 10 * 1024 * 1024 * 1024 // 10GB
    };
  }

  // Upload new asset
  async uploadAsset(upload: AssetUpload): Promise<Asset> {
    await this.simulateApiDelay();

    const newAsset: Asset = {
      id: `asset-${Date.now()}`,
      name: upload.name || upload.file.name,
      description: upload.description,
      type: upload.type,
      source: 'user-upload',
      status: 'processing',
      fileSize: upload.file.size,
      mimeType: upload.file.type,
      extension: upload.file.name.split('.').pop() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      createdByName: 'Current User',
      spaces: upload.spaces,
      tags: upload.tags,
      version: 1,
      isPublic: upload.isPublic || false,
      sharedWith: [],
      permissions: {
        owner: ['view', 'download', 'edit', 'delete', 'share', 'admin'],
        space: ['view', 'download'],
        shared: ['view'],
        public: []
      },
      viewCount: 0,
      downloadCount: 0
    };

    // Simulate processing
    setTimeout(() => {
      newAsset.status = 'ready';
      this.mockAssets.unshift(newAsset);
    }, 2000);

    return newAsset;
  }

  // Share asset
  async shareAsset(assetId: string, shares: AssetShare[]): Promise<boolean> {
    await this.simulateApiDelay();
    
    const asset = this.mockAssets.find(a => a.id === assetId);
    if (asset) {
      asset.sharedWith.push(...shares);
      return true;
    }
    return false;
  }

  // Bulk delete assets
  async bulkDelete(assetIds: string[]): Promise<boolean> {
    await this.simulateApiDelay();
    
    this.mockAssets = this.mockAssets.filter(a => !assetIds.includes(a.id));
    return true;
  }

  // Bulk archive assets
  async bulkArchive(assetIds: string[]): Promise<boolean> {
    await this.simulateApiDelay();
    
    this.mockAssets.forEach(asset => {
      if (assetIds.includes(asset.id)) {
        asset.status = 'archived';
      }
    });
    return true;
  }

  // Download asset
  async downloadAsset(assetId: string): Promise<Blob> {
    await this.simulateApiDelay();
    
    const asset = this.mockAssets.find(a => a.id === assetId);
    if (asset) {
      asset.downloadCount++;
      // Return mock blob
      return new Blob(['Mock file content'], { type: asset.mimeType });
    }
    throw new Error('Asset not found');
  }

  // Get asset details
  async getAssetDetails(assetId: string): Promise<Asset | null> {
    await this.simulateApiDelay();
    
    const asset = this.mockAssets.find(a => a.id === assetId);
    if (asset) {
      asset.viewCount++;
      asset.lastViewedAt = new Date().toISOString();
    }
    return asset || null;
  }

  // Private helper methods
  private simulateApiDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  private generateMockAssets(): Asset[] {
    const types: AssetType[] = ['document', 'report', 'dataset', 'visualization', 'dashboard', 'ai-output'];
    const sources: AssetSource[] = ['platform-generated', 'user-upload', 'ai-generated', 'decision-engine'];
    
    return Array.from({ length: 25 }, (_, i) => ({
      id: `asset-${i + 1}`,
      name: this.generateAssetName(i),
      description: `Description for asset ${i + 1}. This is a sample asset generated for demonstration purposes.`,
      type: types[i % types.length],
      source: sources[i % sources.length],
      status: 'ready' as const,
      fileSize: Math.floor(Math.random() * 10000000) + 100000,
      mimeType: this.getMimeType(types[i % types.length]),
      extension: this.getExtension(types[i % types.length]),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: i % 3 === 0 ? 'current-user' : `user-${i}`,
      createdByName: i % 3 === 0 ? 'You' : `User ${i}`,
      spaces: [`space-${(i % 3) + 1}`],
      tags: this.generateTags(i),
      version: 1,
      isPublic: i % 4 === 0,
      sharedWith: i % 3 === 0 ? [
        {
          email: 'colleague@example.com',
          name: 'Colleague Name',
          permissions: ['view', 'download'],
          sharedAt: new Date().toISOString(),
          sharedBy: 'current-user'
        }
      ] : [],
      permissions: {
        owner: ['view', 'download', 'edit', 'delete', 'share', 'admin'],
        space: ['view', 'download'],
        shared: ['view'],
        public: i % 4 === 0 ? ['view'] : []
      },
      viewCount: Math.floor(Math.random() * 100),
      downloadCount: Math.floor(Math.random() * 50),
      lastViewedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      generatedBy: i % 2 === 0 ? {
        type: 'decision-engine' as const,
        id: 'patentability',
        name: 'Patentability Assessment Engine'
      } : undefined,
      metadata: this.generateMetadata(types[i % types.length])
    }));
  }

  private generateAssetName(index: number): string {
    const names = [
      'Patent Landscape Analysis Q3 2024',
      'Prior Art Search Results',
      'Innovation Pipeline Dashboard',
      'Competitor Analysis Report',
      'Technology Scouting Dataset',
      'FTO Assessment Document',
      'Portfolio Valuation Model',
      'Litigation Risk Matrix',
      'Market Analysis Presentation',
      'R&D Investment Strategy',
      'Patent Citation Network',
      'Trademark Clearance Report',
      'IP Budget Allocation Plan',
      'Filing Strategy Roadmap',
      'Licensing Opportunities',
      'Patent Family Tree',
      'Infringement Analysis',
      'Patent Prosecution Timeline',
      'Technology Transfer Agreement',
      'IP Audit Report',
      'Patent Classification Analysis',
      'Innovation Metrics Dashboard',
      'Patent Examiner Statistics',
      'Competitive Intelligence Report',
      'Patent Portfolio Overview'
    ];
    return names[index % names.length];
  }

  private generateTags(index: number): string[] {
    const tagSets = [
      ['patent', 'analysis', 'Q3-2024'],
      ['prior-art', 'search', 'AI'],
      ['dashboard', 'metrics', 'innovation'],
      ['competitor', 'analysis', 'market'],
      ['technology', 'scouting', 'emerging'],
      ['FTO', 'risk', 'assessment'],
      ['portfolio', 'valuation', 'financial'],
      ['litigation', 'risk', 'matrix'],
      ['market', 'analysis', 'presentation']
    ];
    return tagSets[index % tagSets.length];
  }

  private getMimeType(type: AssetType): string {
    const mimeTypes: Record<AssetType, string> = {
      'document': 'application/pdf',
      'report': 'application/pdf',
      'dataset': 'text/csv',
      'visualization': 'image/png',
      'dashboard': 'application/json',
      'ai-output': 'application/json',
      'patent-search': 'application/json',
      'analysis': 'application/pdf',
      'presentation': 'application/vnd.ms-powerpoint',
      'spreadsheet': 'application/vnd.ms-excel',
      'image': 'image/png',
      'video': 'video/mp4',
      'code': 'text/plain',
      'model': 'application/octet-stream',
      'template': 'application/json'
    };
    return mimeTypes[type] || 'application/octet-stream';
  }

  private getExtension(type: AssetType): string {
    const extensions: Record<AssetType, string> = {
      'document': 'pdf',
      'report': 'pdf',
      'dataset': 'csv',
      'visualization': 'png',
      'dashboard': 'json',
      'ai-output': 'json',
      'patent-search': 'json',
      'analysis': 'pdf',
      'presentation': 'pptx',
      'spreadsheet': 'xlsx',
      'image': 'png',
      'video': 'mp4',
      'code': 'js',
      'model': 'pkl',
      'template': 'json'
    };
    return extensions[type] || 'bin';
  }

  private generateMetadata(type: AssetType): any {
    switch (type) {
      case 'report':
      case 'analysis':
        return {
          patentCount: Math.floor(Math.random() * 1000) + 100,
          dateRange: {
            start: '2024-01-01',
            end: '2024-12-31'
          },
          jurisdiction: ['US', 'EP', 'CN']
        };
      case 'dataset':
        return {
          recordCount: Math.floor(Math.random() * 10000) + 1000,
          columns: ['patent_id', 'title', 'abstract', 'claims', 'filing_date']
        };
      case 'ai-output':
        return {
          model: 'GPT-4',
          confidence: 0.85 + Math.random() * 0.14
        };
      case 'visualization':
      case 'dashboard':
        return {
          chartType: 'mixed',
          dataSource: 'patent-database'
        };
      default:
        return {};
    }
  }

  private generateRecentActivity(): AssetActivity[] {
    const actions: AssetActivity['action'][] = ['created', 'viewed', 'downloaded', 'edited', 'shared'];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: `activity-${i + 1}`,
      assetId: `asset-${Math.floor(Math.random() * 25) + 1}`,
      assetName: this.generateAssetName(i),
      action: actions[i % actions.length],
      userId: i % 2 === 0 ? 'current-user' : `user-${i}`,
      userName: i % 2 === 0 ? 'You' : `User ${i}`,
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      details: `${actions[i % actions.length]} the asset`
    }));
  }
}

export const assetService = new AssetService();