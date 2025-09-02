import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NavigationSection = 
  | 'home' | 'patent-search' | 'dashboard' | 'network' 
  | 'projects' | 'collections' | 'reports' | 'messages'
  | 'notifications' | 'ai-chat' | 'showcase' | 'cms-studio'
  | 'spaces' | 'work-area' | 'assets' | 'checkout'
  | 'payment-success' | 'account' | 'login' | 'register';

interface NavigationState {
  activeSection: NavigationSection;
  previousSection: NavigationSection | null;
  navigationHistory: NavigationSection[];
  queryParams: Record<string, string>;
}

interface NavigationContextValue extends NavigationState {
  navigate: (section: NavigationSection, params?: Record<string, string>) => void;
  goBack: () => void;
  canGoBack: boolean;
  setQueryParam: (key: string, value: string) => void;
  clearQueryParams: () => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  defaultSection?: NavigationSection;
}

const MAX_HISTORY_SIZE = 50;

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  defaultSection = 'home' 
}) => {
  const [state, setState] = useState<NavigationState>({
    activeSection: defaultSection,
    previousSection: null,
    navigationHistory: [defaultSection],
    queryParams: {}
  });

  const navigate = useCallback((section: NavigationSection, params?: Record<string, string>) => {
    setState(prev => {
      const newHistory = [...prev.navigationHistory, section].slice(-MAX_HISTORY_SIZE);
      
      return {
        activeSection: section,
        previousSection: prev.activeSection,
        navigationHistory: newHistory,
        queryParams: params || {}
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      if (prev.navigationHistory.length <= 1) {
        return prev;
      }
      
      const newHistory = prev.navigationHistory.slice(0, -1);
      const newActiveSection = newHistory[newHistory.length - 1];
      const newPreviousSection = newHistory.length > 1 ? newHistory[newHistory.length - 2] : null;
      
      return {
        activeSection: newActiveSection,
        previousSection: newPreviousSection,
        navigationHistory: newHistory,
        queryParams: {}
      };
    });
  }, []);

  const setQueryParam = useCallback((key: string, value: string) => {
    setState(prev => ({
      ...prev,
      queryParams: {
        ...prev.queryParams,
        [key]: value
      }
    }));
  }, []);

  const clearQueryParams = useCallback(() => {
    setState(prev => ({
      ...prev,
      queryParams: {}
    }));
  }, []);

  const value: NavigationContextValue = {
    ...state,
    navigate,
    goBack,
    canGoBack: state.navigationHistory.length > 1,
    setQueryParam,
    clearQueryParams
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};