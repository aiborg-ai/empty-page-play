import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { NavigationProvider } from './NavigationProvider';
import { ProjectProvider } from './ProjectProvider';
import { ThemeProvider } from './ThemeProvider';
import { NotificationProvider } from './NotificationProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NavigationProvider>
            <ProjectProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </ProjectProvider>
          </NavigationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};