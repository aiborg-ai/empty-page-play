import { useState, useEffect } from 'react';
import { Project } from '../types/projects';
import { ProjectContextService } from '../lib/projectContext';

export function useProjectContext() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const contextService = ProjectContextService.getInstance();
    
    // Initialize and get current project
    contextService.initialize();
    setCurrentProject(contextService.getCurrentProject());
    setIsLoading(false);

    // Subscribe to changes
    const unsubscribe = contextService.addProjectChangeListener((project) => {
      setCurrentProject(project);
    });

    return unsubscribe;
  }, []);

  return {
    currentProject,
    isInProject: currentProject !== null,
    isLoading,
    
    // Helper functions
    setCurrentProject: (project: Project | null) => {
      const contextService = ProjectContextService.getInstance();
      contextService.setCurrentProject(project);
    },
    
    logActivity: (type: any, description: string, metadata = {}) => {
      const contextService = ProjectContextService.getInstance();
      contextService.logActivity(type, description, metadata);
    },
    
    addAsset: (asset: any) => {
      const contextService = ProjectContextService.getInstance();
      return contextService.addAssetToCurrentProject(asset);
    }
  };
}