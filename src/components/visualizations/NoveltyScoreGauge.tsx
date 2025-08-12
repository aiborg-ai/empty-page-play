import React from 'react';

interface NoveltyScoreGaugeProps {
  data: Record<string, any>;
  step?: number;
}

const NoveltyScoreGauge: React.FC<NoveltyScoreGaugeProps> = ({ data }) => {
  const score = data?.noveltyScore || Math.floor(Math.random() * 30 + 60); // Demo: 60-90 range
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI; // Semi-circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#3b82f6'; // blue
    if (score >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Highly Novel';
    if (score >= 60) return 'Moderately Novel';
    if (score >= 40) return 'Limited Novelty';
    return 'Low Novelty';
  };

  const getScoreDescription = (score: number): string => {
    if (score >= 80) return 'Strong patentability potential with minimal prior art overlap';
    if (score >= 60) return 'Good patentability prospects with manageable prior art considerations';
    if (score >= 40) return 'Patentability possible but requires careful claim drafting';
    return 'Significant prior art challenges, consider alternative approaches';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background arc */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress arc */}
          <circle
            stroke={getScoreColor(score)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Decorative marks */}
          {[0, 25, 50, 75, 100].map((mark) => {
            const angle = (mark / 100) * Math.PI;
            const x1 = radius + (normalizedRadius - 15) * Math.cos(angle - Math.PI);
            const y1 = radius + (normalizedRadius - 15) * Math.sin(angle - Math.PI);
            const x2 = radius + (normalizedRadius - 20) * Math.cos(angle - Math.PI);
            const y2 = radius + (normalizedRadius - 20) * Math.sin(angle - Math.PI);
            
            return (
              <line
                key={mark}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#9ca3af"
                strokeWidth="2"
                className="transform rotate-90 origin-center"
                style={{ transformOrigin: `${radius}px ${radius}px` }}
              />
            );
          })}
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>
            {score}%
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Novelty Score
          </div>
        </div>
      </div>

      {/* Score interpretation */}
      <div className="mt-6 text-center space-y-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium`}
             style={{ backgroundColor: `${getScoreColor(score)}20`, color: getScoreColor(score) }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getScoreColor(score) }}></div>
          {getScoreLabel(score)}
        </div>
        <p className="text-xs text-gray-600 max-w-xs">
          {getScoreDescription(score)}
        </p>
      </div>

      {/* Breakdown metrics */}
      <div className="mt-4 w-full space-y-2">
        <MetricBar label="Technical Novelty" value={score + 5} max={100} />
        <MetricBar label="Non-obviousness" value={score - 10} max={100} />
        <MetricBar label="Inventive Step" value={score + 2} max={100} />
      </div>
    </div>
  );
};

const MetricBar: React.FC<{ label: string; value: number; max: number }> = ({ label, value, max }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{Math.round(value)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default NoveltyScoreGauge;