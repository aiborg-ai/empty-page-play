import React, { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardContextValue {
  variant?: 'default' | 'bordered' | 'elevated' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const CardContext = createContext<CardContextValue>({});

interface CardRootProps {
  children: ReactNode;
  variant?: CardContextValue['variant'];
  size?: CardContextValue['size'];
  className?: string;
  onClick?: () => void;
  as?: keyof JSX.IntrinsicElements;
}

const CardRoot: React.FC<CardRootProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  as: Component = 'div'
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    bordered: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg',
    ghost: 'bg-transparent'
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <CardContext.Provider value={{ variant, size }}>
      {React.createElement(
        Component,
        {
          className: cn(
            'rounded-lg transition-all',
            variantClasses[variant],
            sizeClasses[size],
            onClick && 'cursor-pointer hover:shadow-md',
            className
          ),
          onClick
        },
        children
      )}
    </CardContext.Provider>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className, actions }) => {
  const { size } = useContext(CardContext);
  
  const sizeClasses = {
    sm: 'mb-2',
    md: 'mb-3',
    lg: 'mb-4'
  };

  return (
    <div className={cn('flex items-center justify-between', sizeClasses[size || 'md'], className)}>
      <div className="flex-1">{children}</div>
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
};

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className, as: Component = 'h3' }) => {
  const { size } = useContext(CardContext);
  
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <Component className={cn('font-semibold text-gray-900', sizeClasses[size || 'md'], className)}>
      {children}
    </Component>
  );
};

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  const { size } = useContext(CardContext);
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <p className={cn('text-gray-600 mt-1', sizeClasses[size || 'md'], className)}>
      {children}
    </p>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  const { size } = useContext(CardContext);
  
  const sizeClasses = {
    sm: 'space-y-2',
    md: 'space-y-3',
    lg: 'space-y-4'
  };

  return (
    <div className={cn(sizeClasses[size || 'md'], className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className, align = 'right' }) => {
  const { size } = useContext(CardContext);
  
  const sizeClasses = {
    sm: 'mt-3 pt-3',
    md: 'mt-4 pt-4',
    lg: 'mt-5 pt-5'
  };

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={cn(
      'flex items-center border-t border-gray-100',
      sizeClasses[size || 'md'],
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  );
};

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
};