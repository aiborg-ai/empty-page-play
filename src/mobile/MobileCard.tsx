/**
 * Mobile-Optimized Card Component
 * Responsive card design optimized for mobile touch interactions
 */

import React, { useState } from 'react';
import { ChevronRight, MoreVertical, Share2, Star, Bookmark } from 'lucide-react';
import TouchGestureHandler from './TouchGestureHandler';

export interface MobileCardProps {
  title: string;
  description?: string;
  image?: string;
  badge?: string;
  tags?: string[];
  stats?: { label: string; value: string | number }[];
  actions?: { label: string; onClick: () => void; icon?: React.ComponentType<{ className?: string }> }[];
  onTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  isBookmarked?: boolean;
  isStarred?: boolean;
  className?: string;
  compact?: boolean;
  showMoreMenu?: boolean;
}

const MobileCard: React.FC<MobileCardProps> = ({
  title,
  description,
  image,
  badge,
  tags = [],
  stats = [],
  actions = [],
  onTap,
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
  isBookmarked = false,
  isStarred = false,
  className = '',
  compact = false,
  showMoreMenu = true,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [swipeOffset, _setSwipeOffset] = useState(0);

  const handleSwipeLeft = () => {
    if (onSwipeLeft) {
      onSwipeLeft();
    } else if (actions.length > 0) {
      setShowActions(true);
    }
  };

  const handleSwipeRight = () => {
    if (onSwipeRight) {
      onSwipeRight();
    } else if (showActions) {
      setShowActions(false);
    }
  };

  const handleTap = () => {
    if (showActions) {
      setShowActions(false);
    } else if (onTap) {
      onTap();
    }
  };

  return (
    <TouchGestureHandler
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onTap={handleTap}
      onLongPress={onLongPress}
      className={`relative overflow-hidden ${className}`}
    >
      <div className="relative">
        {/* Main Card */}
        <div 
          className={`
            bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 relative
            ${showActions ? 'translate-x-[-80px]' : 'translate-x-0'}
            ${compact ? 'p-3' : 'p-4'}
            hover:shadow-md active:scale-[0.98]
          `}
          style={{ transform: `translateX(${swipeOffset}px)` }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              {/* Badge */}
              {badge && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                  {badge}
                </div>
              )}
              
              {/* Title */}
              <h3 className={`font-semibold text-gray-900 truncate ${compact ? 'text-sm' : 'text-base'}`}>
                {title}
              </h3>
              
              {/* Description */}
              {description && !compact && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            {/* Image */}
            {image && (
              <div className={`ml-3 flex-shrink-0 ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}>
                <img 
                  src={image} 
                  alt={title}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <div className={`flex items-center gap-4 ${compact ? 'mb-2' : 'mb-3'}`}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className={`flex flex-wrap gap-1 ${compact ? 'mb-2' : 'mb-3'}`}>
              {tags.slice(0, compact ? 2 : 3).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
              {tags.length > (compact ? 2 : 3) && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                  +{tags.length - (compact ? 2 : 3)}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {isStarred && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
              {isBookmarked && (
                <Bookmark className="w-4 h-4 text-blue-500 fill-current" />
              )}
            </div>

            {/* Navigation Arrow */}
            <div className="flex items-center gap-2">
              {showMoreMenu && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              )}
              
              {onTap && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons (Revealed on Swipe) */}
        {actions.length > 0 && (
          <div 
            className={`
              absolute top-0 right-0 bottom-0 flex items-center transition-all duration-300
              ${showActions ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
          >
            <div className="flex items-center gap-1 px-2">
              {actions.slice(0, 3).map((action, index) => {
                const IconComponent = action.icon || Share2;
                return (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                      setShowActions(false);
                    }}
                    className="flex flex-col items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-xs mt-1 truncate max-w-[2rem]">
                      {action.label.slice(0, 4)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </TouchGestureHandler>
  );
};

// Specialized card variants
export const MobileProjectCard: React.FC<{
  title: string;
  description?: string;
  assetCount: number;
  collaboratorCount: number;
  lastModified: string;
  color: string;
  onTap?: () => void;
  className?: string;
}> = ({ title, description, assetCount, collaboratorCount, lastModified, onTap, className = '' }) => { // 'color' prop removed - not used in component
  return (
    <MobileCard
      title={title}
      description={description}
      stats={[
        { label: 'Assets', value: assetCount },
        { label: 'Members', value: collaboratorCount },
      ]}
      tags={[`Updated ${lastModified}`]}
      onTap={onTap}
      className={className}
      badge="Project"
    />
  );
};

export const MobilePatentCard: React.FC<{
  title: string;
  publicationNumber: string;
  inventors: string[];
  assignee: string;
  filingDate: string;
  onTap?: () => void;
  className?: string;
}> = ({ title, publicationNumber, inventors, assignee, filingDate, onTap, className = '' }) => {
  return (
    <MobileCard
      title={title}
      description={`${assignee} • Filed ${filingDate}`}
      tags={inventors.slice(0, 2)}
      badge={publicationNumber}
      onTap={onTap}
      className={className}
      actions={[
        { label: 'Share', onClick: () => console.log('Share patent') },
        { label: 'Save', onClick: () => console.log('Save patent') },
        { label: 'Analyze', onClick: () => console.log('Analyze patent') },
      ]}
    />
  );
};

export const MobileDashboardCard: React.FC<{
  title: string;
  description?: string;
  chartCount: number;
  dataPoints: number;
  lastUpdated: string;
  onTap?: () => void;
  className?: string;
}> = ({ title, description, chartCount, dataPoints, lastUpdated, onTap, className = '' }) => {
  return (
    <MobileCard
      title={title}
      description={description}
      stats={[
        { label: 'Charts', value: chartCount },
        { label: 'Data Points', value: dataPoints.toLocaleString() },
      ]}
      tags={[`Updated ${lastUpdated}`]}
      onTap={onTap}
      className={className}
      badge="Dashboard"
    />
  );
};

export default MobileCard;