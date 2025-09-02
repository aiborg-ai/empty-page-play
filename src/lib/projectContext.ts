// Project Context Service
import { Project } from '../types/cms';

class ProjectContextService {
  private static instance: ProjectContextService;
  private currentProject: Project | null = null;
  private listeners: Set<(project: Project | null) => void> = new Set();

  private constructor() {}

  static getInstance(): ProjectContextService {
    if (!ProjectContextService.instance) {
      ProjectContextService.instance = new ProjectContextService();
    }
    return ProjectContextService.instance;
  }

  setCurrentProject(project: Project | null) {
    this.currentProject = project;
    this.notifyListeners();
  }

  getCurrentProject(): Project | null {
    return this.currentProject;
  }

  subscribe(listener: (project: Project | null) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentProject));
  }
}

export const projectContextService = ProjectContextService.getInstance();