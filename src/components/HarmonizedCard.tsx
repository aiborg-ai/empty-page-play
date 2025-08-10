import React from 'react';
import { 
  MoreHorizontal
} from 'lucide-react';

export interface HCLStat {
  label: string;
  value: string | number;
  icon?: React.ComponentType<any>;
  color?: string;
}

export interface HCLKeyword {
  label: string;
  color?: string;
}

export interface HCLAttribute {
  label: string;
  value: string;
  icon?: React.ComponentType<any>;
}

export interface HCLAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  isPrimary?: boolean;
}

export interface HarmonizedCardProps {
  title: string;
  description: string;
  stats?: HCLStat[];
  keywords?: HCLKeyword[];
  attributes?: HCLAttribute[];
  actions?: HCLAction[];
  className?: string;
  colorAccent?: string;
  onTitleClick?: () => void;
}

export default function HarmonizedCard({
  title,
  description,
  stats = [],
  keywords = [],
  attributes = [],
  actions = [],
  className = "",
  colorAccent = "#3b82f6",
  onTitleClick
}: HarmonizedCardProps) {
  const [showMoreActions, setShowMoreActions] = React.useState(false);
  
  // Separate primary and secondary actions
  const primaryActions = actions.filter(action => action.isPrimary);
  const secondaryActions = actions.filter(action => !action.isPrimary);
  const visibleSecondaryActions = secondaryActions.slice(0, 2);
  const hiddenActions = secondaryActions.slice(2);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow group ${className}`}>
      <div className="p-6">
        {/* Title & Description */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 
              className={`font-semibold text-gray-900 ${onTitleClick ? 'cursor-pointer hover:text-blue-600' : ''}`}
              onClick={onTitleClick}
            >
              {title}
            </h3>
            {colorAccent && (
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: colorAccent }}
              />
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                {stat.icon && (
                  <stat.icon 
                    className={`w-4 h-4 ${stat.color || 'text-gray-500'}`} 
                  />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  keyword.color 
                    ? `bg-${keyword.color}-100 text-${keyword.color}-800`
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {keyword.label}
              </span>
            ))}
          </div>
        )}

        {/* Attributes */}
        {attributes.length > 0 && (
          <div className="space-y-2 mb-4 text-xs text-gray-500">
            {attributes.map((attr, index) => (
              <div key={index} className="flex items-center gap-2">
                {attr.icon && <attr.icon className="w-3 h-3" />}
                <span className="font-medium">{attr.label}:</span>
                <span>{attr.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {/* Primary Actions */}
            <div className="flex gap-2">
              {primaryActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    action.variant === 'primary' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : action.variant === 'danger'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-1">
              {visibleSecondaryActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  title={action.label}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <action.icon className="w-4 h-4" />
                </button>
              ))}
              
              {hiddenActions.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="More actions"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {showMoreActions && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                      {hiddenActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => {
                            action.onClick();
                            setShowMoreActions(false);
                          }}
                          className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors ${
                            action.variant === 'danger'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <action.icon className="w-4 h-4" />
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}