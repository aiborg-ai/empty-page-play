// Space Context Management Service

import { Space, SpaceAsset, SpaceActivity, ActivityType, AssetType, AssetCreationContext } from '../types/spaces';

export class SpaceContextService {
  private static instance: SpaceContextService;
  private currentSpace: Space | null = null;
  private listeners: Set<(space: Space | null) => void> = new Set();

  static getInstance(): SpaceContextService {
    if (!SpaceContextService.instance) {
      SpaceContextService.instance = new SpaceContextService();
    }
    return SpaceContextService.instance;
  }

  // Space Context Management
  getCurrentSpace(): Space | null {
    return this.currentSpace;
  }

  setCurrentSpace(space: Space | null): void {
    this.currentSpace = space;
    this.notifyListeners();
    
    // Store in localStorage for persistence
    if (space) {
      localStorage.setItem('currentSpaceId', space.id);
    } else {
      localStorage.removeItem('currentSpaceId');
    }
  }

  isInSpace(): boolean {
    return this.currentSpace !== null;
  }

  // Listeners for UI updates
  addSpaceChangeListener(listener: (space: Space | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentSpace));
  }

  // Activity Logging
  logActivity(
    type: ActivityType, 
    description: string, 
    metadata: Record<string, any> = {},
    assetId?: string,
    assetType?: AssetType
  ): void {
    if (!this.currentSpace) return;

    const activity: SpaceActivity = {
      id: Date.now().toString(),
      type,
      description,
      performedBy: 'Current User', // In real app, get from auth context
      performedAt: new Date().toISOString(),
      assetId,
      assetType,
      metadata,
      spaceId: this.currentSpace.id
    };

    // Add to current space activities
    this.currentSpace.activities.unshift(activity);
    this.currentSpace.lastActivity = activity.performedAt;
    this.currentSpace.updatedAt = activity.performedAt;

    // Keep only last 100 activities
    if (this.currentSpace.activities.length > 100) {
      this.currentSpace.activities = this.currentSpace.activities.slice(0, 100);
    }

    this.notifyListeners();

    // In real app, sync to backend
    this.syncToBackend();
  }

  // Asset Management
  addAssetToCurrentSpace(
    asset: Omit<SpaceAsset, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'isSharedFromOtherSpace'>,
    context?: AssetCreationContext
  ): SpaceAsset | null {
    const targetSpace = context?.spaceId 
      ? this.getSpaceById(context.spaceId) 
      : this.currentSpace;

    if (!targetSpace) return null;

    const newAsset: SpaceAsset = {
      ...asset,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      isSharedFromOtherSpace: false,
      metadata: { ...asset.metadata, ...context?.metadata }
    };

    targetSpace.assets.push(newAsset);
    targetSpace.assetCount = targetSpace.assets.length;
    targetSpace.updatedAt = newAsset.createdAt;

    // Log activity
    this.logActivity(
      'asset_added',
      `Added ${asset.type} asset: ${asset.name}`,
      { assetType: asset.type, assetName: asset.name },
      newAsset.id,
      asset.type
    );

    return newAsset;
  }

  removeAssetFromSpace(assetId: string, spaceId?: string): boolean {
    const targetSpace = spaceId 
      ? this.getSpaceById(spaceId) 
      : this.currentSpace;

    if (!targetSpace) return false;

    const assetIndex = targetSpace.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return false;

    const asset = targetSpace.assets[assetIndex];
    targetSpace.assets.splice(assetIndex, 1);
    targetSpace.assetCount = targetSpace.assets.length;
    targetSpace.updatedAt = new Date().toISOString();

    // Log activity
    this.logActivity(
      'asset_removed',
      `Removed ${asset.type} asset: ${asset.name}`,
      { assetType: asset.type, assetName: asset.name }
    );

    return true;
  }

  // Cross-space asset sharing
  shareAssetWithSpace(assetId: string, sourceSpaceId: string, targetSpaceId: string): boolean {
    const sourceSpace = this.getSpaceById(sourceSpaceId);
    const targetSpace = this.getSpaceById(targetSpaceId);

    if (!sourceSpace || !targetSpace) return false;

    const asset = sourceSpace.assets.find(a => a.id === assetId);
    if (!asset) return false;

    // Create shared asset reference
    const sharedAsset: SpaceAsset = {
      ...asset,
      id: `${assetId}_shared_${Date.now()}`,
      sourceSpaceId,
      isSharedFromOtherSpace: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    targetSpace.assets.push(sharedAsset);
    targetSpace.assetCount = targetSpace.assets.length;

    // Log activity in both spaces
    this.logActivity(
      'asset_shared',
      `Shared ${asset.type} asset "${asset.name}" with space "${targetSpace.name}"`,
      { targetSpaceId, assetType: asset.type }
    );

    return true;
  }

  // Search and filter assets across spaces
  searchAssetsAcrossSpaces(
    query: string, 
    assetTypes?: AssetType[], 
    excludeCurrentSpace: boolean = false
  ): { asset: SpaceAsset; space: Space }[] {
    const results: { asset: SpaceAsset; space: Space }[] = [];
    const spaces = this.getAllSpaces();

    spaces.forEach(space => {
      if (excludeCurrentSpace && space.id === this.currentSpace?.id) return;

      space.assets.forEach(asset => {
        const matchesQuery = asset.name.toLowerCase().includes(query.toLowerCase()) ||
                           asset.description?.toLowerCase().includes(query.toLowerCase());
        const matchesType = !assetTypes || assetTypes.includes(asset.type);

        if (matchesQuery && matchesType) {
          results.push({ asset, space });
        }
      });
    });

    return results.sort((a, b) => 
      new Date(b.asset.updatedAt).getTime() - new Date(a.asset.updatedAt).getTime()
    );
  }

  // Utility methods
  private getSpaceById(spaceId: string): Space | null {
    // In real app, this would fetch from backend/store
    // For now, return current space if IDs match
    return this.currentSpace?.id === spaceId ? this.currentSpace : null;
  }

  private getAllSpaces(): Space[] {
    // In real app, this would fetch all user spaces
    return this.currentSpace ? [this.currentSpace] : [];
  }

  private syncToBackend(): void {
    // In real app, sync space state to backend
    if (this.currentSpace) {
      localStorage.setItem(`space_${this.currentSpace.id}`, JSON.stringify(this.currentSpace));
    }
  }

  // Auto-save functionality for different tools
  autoSaveSearchQuery(query: string, results: any[], filters: any = {}): SpaceAsset | null {
    if (!this.currentSpace?.settings.autoSaveSearches) return null;

    return this.addAssetToCurrentSpace({
      type: 'search-query',
      name: `Search: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`,
      description: `Patent search query with ${results.length} results`,
      metadata: {
        query,
        resultCount: results.length,
        filters,
        timestamp: new Date().toISOString()
      },
      tags: ['auto-saved', 'search']
    });
  }

  autoSaveDataset(name: string, data: any[], source: string): SpaceAsset | null {
    if (!this.currentSpace?.settings.autoCreateAssets) return null;

    return this.addAssetToCurrentSpace({
      type: 'dataset',
      name: `Dataset: ${name}`,
      description: `Dataset from ${source} with ${data.length} records`,
      metadata: {
        source,
        recordCount: data.length,
        columns: Object.keys(data[0] || {}),
        createdFrom: source
      },
      tags: ['auto-saved', 'dataset'],
      size: JSON.stringify(data).length
    });
  }

  // Initialize from localStorage
  initialize(): void {
    const currentSpaceId = localStorage.getItem('currentSpaceId');
    if (currentSpaceId) {
      const savedSpace = localStorage.getItem(`space_${currentSpaceId}`);
      if (savedSpace) {
        try {
          this.currentSpace = JSON.parse(savedSpace);
          this.notifyListeners();
        } catch (error) {
          console.error('Failed to load saved space:', error);
        }
      }
    }
  }
}