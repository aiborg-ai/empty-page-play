/**
 * Application content wrapper component
 * Provides consistent content area styling and animations
 */

import React, { memo, ReactNode } from 'react';

interface AppContentProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

const AppContent: React.FC<AppContentProps> = ({ 
  children, 
  className = '', 
  noPadding = false 
}) => {
  return (
    <main 
      className={`
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
    >
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </main>
  );
};

export default memo(AppContent);