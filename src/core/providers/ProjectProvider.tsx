import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Project } from '@/types/cms';
import { projectService } from '@/lib/projectService';
import { useAuth } from './AuthProvider';

interface ProjectContextValue {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: Error | null;
  loadProjects: () => Promise<void>;
  selectProject: (projectId: string | null) => void;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [user]);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const userProjects = await projectService.getUserProjects(user.id);
      setProjects(userProjects);
      
      const storedProjectId = localStorage.getItem('selectedProjectId');
      if (storedProjectId && userProjects.some(p => p.id === storedProjectId)) {
        const project = userProjects.find(p => p.id === storedProjectId);
        setCurrentProject(project || null);
      } else if (userProjects.length > 0) {
        setCurrentProject(userProjects[0]);
        localStorage.setItem('selectedProjectId', userProjects[0].id);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const selectProject = useCallback((projectId: string | null) => {
    if (!projectId) {
      setCurrentProject(null);
      localStorage.removeItem('selectedProjectId');
      return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      localStorage.setItem('selectedProjectId', projectId);
    }
  }, [projects]);

  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      throw new Error('User must be authenticated to create projects');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const newProject = await projectService.createProject({
        ...projectData,
        owner_id: user.id
      });
      
      if (newProject) {
        setProjects(prev => [...prev, newProject]);
        
        if (!currentProject) {
          setCurrentProject(newProject);
          localStorage.setItem('selectedProjectId', newProject.id);
        }
        
        return newProject;
      }
      
      throw new Error('Failed to create project');
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, currentProject]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);
      
      await projectService.updateProject(id, updates);
      
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ));
      
      if (currentProject?.id === id) {
        setCurrentProject(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await projectService.deleteProject(id);
      
      setProjects(prev => prev.filter(p => p.id !== id));
      
      if (currentProject?.id === id) {
        const remainingProjects = projects.filter(p => p.id !== id);
        if (remainingProjects.length > 0) {
          setCurrentProject(remainingProjects[0]);
          localStorage.setItem('selectedProjectId', remainingProjects[0].id);
        } else {
          setCurrentProject(null);
          localStorage.removeItem('selectedProjectId');
        }
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject, projects]);

  const refreshProjects = useCallback(async () => {
    await loadProjects();
  }, [loadProjects]);

  const value: ProjectContextValue = {
    projects,
    currentProject,
    loading,
    error,
    loadProjects,
    selectProject,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};