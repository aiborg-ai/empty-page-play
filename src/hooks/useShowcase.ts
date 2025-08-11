import { useState, useEffect, useMemo } from 'react';
import { Capability, CapabilityCategory, RunCapabilityRequest } from '../types/capabilities';
import { Project } from '../types/cms';
import { ShowcaseService } from '../lib/showcaseService';
import ProjectService from '../lib/projectService';
import { InstantAuthService } from '../lib/instantAuth';
import { MOCK_CAPABILITIES } from '../constants/mockCapabilities';
import { validateProjectSelection } from '../utils/showcaseUtils';

export const useShowcase = (initialCategory: CapabilityCategory | 'all' = 'all') => {
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CapabilityCategory | 'all'>(initialCategory);
  const [showRunModal, setShowRunModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);
  
  // Data State
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load capabilities from Supabase
  useEffect(() => {
    const loadCapabilities = async () => {
      setLoading(true);
      try {
        const data = await ShowcaseService.getCapabilities(
          selectedCategory,
          searchQuery
        );
        setCapabilities(data);
      } catch (error) {
        console.error('Error loading capabilities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCapabilities();
  }, [selectedCategory, searchQuery]);

  // Load user projects
  useEffect(() => {
    const loadUserProjects = async () => {
      try {
        const user = InstantAuthService.getCurrentUser();
        if (user) {
          const projects = await ProjectService.getUserProjects(user.id);
          setUserProjects(projects);
        }
      } catch (error) {
        console.error('Error loading user projects:', error);
      }
    };

    loadUserProjects();
  }, []);

  // Compute display capabilities (with fallback to mock data)
  const displayCapabilities = useMemo(() => {
    const dataToUse = capabilities.length > 0 ? capabilities : (loading ? [] : MOCK_CAPABILITIES);
    return dataToUse;
  }, [capabilities, loading]);

  // Event Handlers
  const handleRunCapability = (capability: Capability) => {
    setSelectedCapability(capability);
    setShowRunModal(true);
  };

  const handleShareCapability = (capability: Capability) => {
    setSelectedCapability(capability);
    setShowShareModal(true);
  };

  const handleCapabilityDetails = (capabilityId: string) => {
    console.log('View details for capability:', capabilityId);
    // TODO: Implement capability details view
  };

  const handleRunRequest = (request: RunCapabilityRequest) => {
    const validation = validateProjectSelection(request.projectId, userProjects);
    
    if (!validation.isValid) {
      console.error('Invalid project selection');
      return;
    }

    console.log('Running capability:', request);
    alert(`Running capability in project "${validation.project?.name}"`);
    
    // TODO: Implement actual capability execution
  };

  const handleShareRequest = (capabilityId: string, userEmail: string, message: string) => {
    console.log('Sharing capability:', { capabilityId, userEmail, message });
    alert(`Capability shared with ${userEmail}`);
    
    // TODO: Implement actual sharing functionality
  };

  const handlePurchase = (capability: Capability) => {
    console.log('Purchasing capability:', capability.name);
    alert(`Purchasing ${capability.name} for $${capability.price.amount}`);
    
    // TODO: Implement purchase flow
  };

  const closeModals = () => {
    setShowRunModal(false);
    setShowShareModal(false);
    setSelectedCapability(null);
  };

  return {
    // State
    searchQuery,
    selectedCategory,
    selectedCapability,
    capabilities: displayCapabilities,
    userProjects,
    loading,
    
    // UI State
    showRunModal,
    showShareModal,
    
    // Actions
    setSearchQuery,
    setSelectedCategory,
    handleRunCapability,
    handleShareCapability,
    handleCapabilityDetails,
    handleRunRequest,
    handleShareRequest,
    handlePurchase,
    closeModals
  };
};