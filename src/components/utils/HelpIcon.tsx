import React from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpIconProps {
  section: string;
  onNavigate?: (section: string, subsection?: string) => void;
  className?: string;
}

export default function HelpIcon({ section, onNavigate, className = '' }: HelpIconProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('support', section);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors ${className}`}
      title={`Get help with ${section}`}
      aria-label={`Get help with ${section}`}
    >
      <HelpCircle className="h-4 w-4" />
    </button>
  );
}