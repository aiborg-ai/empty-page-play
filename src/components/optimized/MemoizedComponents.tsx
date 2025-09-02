/**
 * Memoized component wrappers
 * Pre-optimized components to prevent unnecessary re-renders
 */

import React, { memo, ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Memoized button component
 * Prevents re-renders from inline onClick handlers
 */
export const MemoizedButton = memo<ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}>(({ 
  children, 
  icon: Icon, 
  loading, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {Icon && <Icon className={`${children ? 'mr-2' : ''} h-5 w-5`} />}
      {children}
    </button>
  );
});

MemoizedButton.displayName = 'MemoizedButton';

/**
 * Memoized input component
 * Optimized for form inputs with stable onChange handlers
 */
export const MemoizedInput = memo<InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}>(({ 
  label, 
  error, 
  icon: Icon,
  className = '',
  ...props 
}) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${Icon ? 'pl-10' : ''}
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input className={inputClasses} {...props} />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

MemoizedInput.displayName = 'MemoizedInput';

/**
 * Memoized card component
 * Prevents re-renders in lists and grids
 */
export const MemoizedCard = memo<HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
}>(({ 
  title, 
  subtitle, 
  children, 
  actions, 
  footer,
  hoverable = false,
  className = '',
  ...props 
}) => {
  const cardClasses = `
    bg-white rounded-lg border border-gray-200 overflow-hidden
    ${hoverable ? 'hover:shadow-lg transition-shadow cursor-pointer' : 'shadow-sm'}
    ${className}
  `;
  
  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="ml-4">{actions}</div>}
          </div>
        </div>
      )}
      
      {children && (
        <div className="px-6 py-4">
          {children}
        </div>
      )}
      
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
});

MemoizedCard.displayName = 'MemoizedCard';

/**
 * Memoized list item component
 * Optimized for large lists with stable handlers
 */
export const MemoizedListItem = memo<{
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}>(({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions, 
  onClick, 
  selected = false,
  className = '' 
}) => {
  const itemClasses = `
    flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors
    ${selected ? 'bg-blue-50 border-l-4 border-blue-600' : ''}
    ${className}
  `;
  
  return (
    <div className={itemClasses} onClick={onClick}>
      {Icon && (
        <Icon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        )}
      </div>
      
      {actions && (
        <div className="ml-4 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
});

MemoizedListItem.displayName = 'MemoizedListItem';

/**
 * Memoized loading spinner
 */
export const MemoizedSpinner = memo<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}>(({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  return (
    <div className={`flex justify-center ${className}`}>
      <svg className={`animate-spin ${sizeClasses[size]} text-blue-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  );
});

MemoizedSpinner.displayName = 'MemoizedSpinner';

/**
 * Memoized empty state component
 */
export const MemoizedEmptyState = memo<{
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}>(({ icon: Icon, title, description, action, className = '' }) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
});

MemoizedEmptyState.displayName = 'MemoizedEmptyState';

/**
 * HOC to memoize any component
 */
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.MemoExoticComponent<React.ComponentType<P>> {
  return memo(Component, propsAreEqual);
}