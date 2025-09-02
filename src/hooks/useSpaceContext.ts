import { useState, useEffect } from 'react';
import { Space } from '../types/spaces';
import { SpaceContextService } from '../lib/spaceContext';

export function useSpaceContext() {
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const contextService = SpaceContextService.getInstance();
    
    // Initialize and get current space
    contextService.initialize();
    setCurrentSpace(contextService.getCurrentSpace());
    setIsLoading(false);

    // Subscribe to changes
    const unsubscribe = contextService.addSpaceChangeListener((space) => {
      setCurrentSpace(space);
    });

    return unsubscribe;
  }, []);

  return {
    currentSpace,
    isInSpace: currentSpace !== null,
    isLoading,
    
    // Helper functions
    setCurrentSpace: (space: Space | null) => {
      const contextService = SpaceContextService.getInstance();
      contextService.setCurrentSpace(space);
    },
    
    logActivity: (type: any, description: string, metadata = {}) => {
      const contextService = SpaceContextService.getInstance();
      contextService.logActivity(type, description, metadata);
    },
    
    addAsset: (asset: any) => {
      const contextService = SpaceContextService.getInstance();
      return contextService.addAssetToCurrentSpace(asset);
    }
  };
}