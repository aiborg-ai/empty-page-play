import { Info } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  helpLink?: string;
  onNavigate?: (section: string) => void;
  breadcrumb?: string[];
}

export default function PageHeader({ title, subtitle, helpLink, onNavigate, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>🏠</span>
          {breadcrumb.map((item, index) => (
            <span key={index}>
              {index > 0 && <span className="mx-1">›</span>}
              {item}
            </span>
          ))}
        </div>
      )}
      
      {/* Title with help icon */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600">📊</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {helpLink && (
            <button
              onClick={() => onNavigate?.(helpLink)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Get help with this feature"
            >
              <Info className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-gray-600 ml-[52px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}