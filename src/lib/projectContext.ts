// Project Context Management Service

import { Project, ProjectAsset, ProjectActivity, ActivityType, AssetType, AssetCreationContext } from '../types/projects';

export class ProjectContextService {
  private static instance: ProjectContextService;
  private currentProject: Project | null = null;
  private listeners: Set<(project: Project | null) => void> = new Set();

  static getInstance(): ProjectContextService {
    if (!ProjectContextService.instance) {
      ProjectContextService.instance = new ProjectContextService();
    }
    return ProjectContextService.instance;
  }

  // Project Context Management
  getCurrentProject(): Project | null {
    return this.currentProject;
  }

  setCurrentProject(project: Project | null): void {
    this.currentProject = project;
    this.notifyListeners();
    
    // Store in localStorage for persistence
    if (project) {
      localStorage.setItem('currentProjectId', project.id);
    } else {
      localStorage.removeItem('currentProjectId');
    }
  }

  isInProject(): boolean {
    return this.currentProject !== null;
  }

  // Listeners for UI updates
  addProjectChangeListener(listener: (project: Project | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentProject));
  }

  // Activity Logging
  logActivity(
    type: ActivityType, 
    description: string, 
    metadata: Record<string, any> = {},
    assetId?: string,
    assetType?: AssetType
  ): void {
    if (!this.currentProject) return;

    const activity: ProjectActivity = {
      id: Date.now().toString(),
      type,
      description,
      performedBy: 'Current User', // In real app, get from auth context
      performedAt: new Date().toISOString(),
      assetId,
      assetType,
      metadata,
      projectId: this.currentProject.id
    };

    // Add to current project activities
    this.currentProject.activities.unshift(activity);
    this.currentProject.lastActivity = activity.performedAt;
    this.currentProject.updatedAt = activity.performedAt;

    // Keep only last 100 activities
    if (this.currentProject.activities.length > 100) {
      this.currentProject.activities = this.currentProject.activities.slice(0, 100);
    }

    this.notifyListeners();

    // In real app, sync to backend
    this.syncToBackend();
  }

  // Asset Management
  addAssetToCurrentProject(
    asset: Omit<ProjectAsset, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'isSharedFromOtherProject'>,
    context?: AssetCreationContext
  ): ProjectAsset | null {
    const targetProject = context?.projectId 
      ? this.getProjectById(context.projectId) 
      : this.currentProject;

    if (!targetProject) return null;

    const newAsset: ProjectAsset = {
      ...asset,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      isSharedFromOtherProject: false,
      metadata: { ...asset.metadata, ...context?.metadata }
    };

    targetProject.assets.push(newAsset);
    targetProject.assetCount = targetProject.assets.length;
    targetProject.updatedAt = newAsset.createdAt;

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

  removeAssetFromProject(assetId: string, projectId?: string): boolean {
    const targetProject = projectId 
      ? this.getProjectById(projectId) 
      : this.currentProject;

    if (!targetProject) return false;

    const assetIndex = targetProject.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return false;

    const asset = targetProject.assets[assetIndex];
    targetProject.assets.splice(assetIndex, 1);
    targetProject.assetCount = targetProject.assets.length;
    targetProject.updatedAt = new Date().toISOString();

    // Log activity
    this.logActivity(
      'asset_removed',
      `Removed ${asset.type} asset: ${asset.name}`,
      { assetType: asset.type, assetName: asset.name }
    );

    return true;
  }

  // Cross-project asset sharing
  shareAssetWithProject(assetId: string, sourceProjectId: string, targetProjectId: string): boolean {
    const sourceProject = this.getProjectById(sourceProjectId);
    const targetProject = this.getProjectById(targetProjectId);

    if (!sourceProject || !targetProject) return false;

    const asset = sourceProject.assets.find(a => a.id === assetId);
    if (!asset) return false;

    // Create shared asset reference
    const sharedAsset: ProjectAsset = {
      ...asset,
      id: `${assetId}_shared_${Date.now()}`,
      sourceProjectId,
      isSharedFromOtherProject: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    targetProject.assets.push(sharedAsset);
    targetProject.assetCount = targetProject.assets.length;

    // Log activity in both projects
    this.logActivity(
      'asset_shared',
      `Shared ${asset.type} asset "${asset.name}" with project "${targetProject.name}"`,
      { targetProjectId, assetType: asset.type }
    );

    return true;
  }

  // Search and filter assets across projects
  searchAssetsAcrossProjects(
    query: string, 
    assetTypes?: AssetType[], 
    excludeCurrentProject: boolean = false
  ): { asset: ProjectAsset; project: Project }[] {
    const results: { asset: ProjectAsset; project: Project }[] = [];
    const projects = this.getAllProjects();

    projects.forEach(project => {
      if (excludeCurrentProject && project.id === this.currentProject?.id) return;

      project.assets.forEach(asset => {
        const matchesQuery = asset.name.toLowerCase().includes(query.toLowerCase()) ||
                           asset.description?.toLowerCase().includes(query.toLowerCase());
        const matchesType = !assetTypes || assetTypes.includes(asset.type);

        if (matchesQuery && matchesType) {
          results.push({ asset, project });
        }
      });
    });

    return results.sort((a, b) => 
      new Date(b.asset.updatedAt).getTime() - new Date(a.asset.updatedAt).getTime()
    );
  }

  // Utility methods
  private getProjectById(projectId: string): Project | null {
    // In real app, this would fetch from backend/store
    // For now, return current project if IDs match
    return this.currentProject?.id === projectId ? this.currentProject : null;
  }

  private getAllProjects(): Project[] {
    // In real app, this would fetch all user projects
    return this.currentProject ? [this.currentProject] : [];
  }

  private syncToBackend(): void {
    // In real app, sync project state to backend
    if (this.currentProject) {
      localStorage.setItem(`project_${this.currentProject.id}`, JSON.stringify(this.currentProject));
    }
  }

  // Auto-save functionality for different tools
  autoSaveSearchQuery(query: string, results: any[], filters: any = {}): ProjectAsset | null {
    if (!this.currentProject?.settings.autoSaveSearches) return null;

    return this.addAssetToCurrentProject({
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

  autoSaveDataset(name: string, data: any[], source: string): ProjectAsset | null {
    if (!this.currentProject?.settings.autoCreateAssets) return null;

    return this.addAssetToCurrentProject({
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
    const currentProjectId = localStorage.getItem('currentProjectId');
    if (currentProjectId) {
      const savedProject = localStorage.getItem(`project_${currentProjectId}`);
      if (savedProject) {
        try {
          this.currentProject = JSON.parse(savedProject);
          this.notifyListeners();
        } catch (error) {
          console.error('Failed to load saved project:', error);
        }
      }
    }
  }
}