import React from 'react';
import { AlertTriangle, Shield, TrendingUp, Info } from 'lucide-react';

interface RiskHeatmapProps {
  data: Record<string, any>;
  step?: number;
}

interface RiskFactor {
  factor: string;
  category: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  mitigation?: string;
  trend?: 'increasing' | 'stable' | 'decreasing';
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ data }) => {
  const risks: RiskFactor[] = data?.risks || [
    { 
      factor: 'Prior Art Overlap', 
      category: 'Technical',
      likelihood: 3, 
      impact: 4, 
      mitigation: 'Conduct comprehensive prior art search and refine claims',
      trend: 'stable'
    },
    { 
      factor: 'Market Competition', 
      category: 'Commercial',
      likelihood: 4, 
      impact: 3, 
      mitigation: 'Accelerate filing timeline and consider provisional applications',
      trend: 'increasing'
    },
    { 
      factor: 'Technical Feasibility', 
      category: 'Technical',
      likelihood: 2, 
      impact: 5, 
      mitigation: 'Prototype development and technical validation',
      trend: 'decreasing'
    },
    { 
      factor: 'Regulatory Compliance', 
      category: 'Legal',
      likelihood: 2, 
      impact: 3, 
      mitigation: 'Early engagement with regulatory consultants',
      trend: 'stable'
    },
    { 
      factor: 'Cost Overrun', 
      category: 'Financial',
      likelihood: 3, 
      impact: 2, 
      mitigation: 'Phased filing strategy with budget contingencies',
      trend: 'stable'
    },
    {
      factor: 'Examiner Rejection',
      category: 'Procedural',
      likelihood: 3,
      impact: 3,
      mitigation: 'Pre-filing examiner interview and strong specification',
      trend: 'decreasing'
    }
  ];

  const getRiskScore = (likelihood: number, impact: number): number => {
    return likelihood * impact;
  };

  const getRiskColor = (score: number): string => {
    if (score >= 15) return 'bg-red-500'; // Critical
    if (score >= 10) return 'bg-orange-500'; // High
    if (score >= 6) return 'bg-yellow-500'; // Medium
    return 'bg-green-500'; // Low
  };

  const getRiskLabel = (score: number): string => {
    if (score >= 15) return 'Critical Risk';
    if (score >= 10) return 'High Risk';
    if (score >= 6) return 'Medium Risk';
    return 'Low Risk';
  };

  // Create 5x5 grid with risk positions
  const grid: (RiskFactor | null)[][] = Array(5).fill(null).map(() => Array(5).fill(null));
  risks.forEach(risk => {
    // Invert likelihood for display (5 at top, 1 at bottom)
    const row = 5 - risk.likelihood;
    const col = risk.impact - 1;
    grid[row][col] = risk;
  });

  // Calculate overall risk metrics
  const averageRiskScore = risks.reduce((sum, r) => sum + getRiskScore(r.likelihood, r.impact), 0) / risks.length;
  const criticalRisks = risks.filter(r => getRiskScore(r.likelihood, r.impact) >= 15).length;
  const highRisks = risks.filter(r => getRiskScore(r.likelihood, r.impact) >= 10 && getRiskScore(r.likelihood, r.impact) < 15).length;

  return (
    <div className="space-y-4">
      {/* Risk Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{risks.length}</div>
          <div className="text-xs text-gray-600">Total Risks</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{criticalRisks}</div>
          <div className="text-xs text-gray-600">Critical</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">{highRisks}</div>
          <div className="text-xs text-gray-600">High Priority</div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative">
        <div className="flex">
          {/* Y-axis label */}
          <div className="flex flex-col justify-center mr-2">
            <div className="text-xs text-gray-600 -rotate-90 whitespace-nowrap">Likelihood →</div>
          </div>

          {/* Y-axis values */}
          <div className="flex flex-col justify-between mr-2 text-xs text-gray-500">
            <span>5</span>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-5 gap-1">
              {grid.map((row, rowIndex) => 
                row.map((risk, colIndex) => {
                  const score = getRiskScore(5 - rowIndex, colIndex + 1);
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        aspect-square flex items-center justify-center text-xs font-medium rounded
                        ${risk ? `${getRiskColor(score)} text-white cursor-pointer hover:opacity-90` : 'bg-gray-100'}
                        relative group
                      `}
                    >
                      {risk && (
                        <>
                          <span className="truncate px-1 text-center">
                            {risk.factor.split(' ')[0]}
                          </span>
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 whitespace-nowrap">
                              <div className="font-semibold mb-1">{risk.factor}</div>
                              <div className="text-gray-300">Category: {risk.category}</div>
                              <div className="text-gray-300">Likelihood: {risk.likelihood}/5</div>
                              <div className="text-gray-300">Impact: {risk.impact}/5</div>
                              <div className="text-gray-300">Score: {score}</div>
                              <div className="mt-2 text-gray-400 whitespace-normal max-w-xs">
                                {risk.mitigation}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* X-axis values */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>

            {/* X-axis label */}
            <div className="text-center mt-1">
              <span className="text-xs text-gray-600">Impact →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs pt-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Low (1-5)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Medium (6-9)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>High (10-14)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Critical (15+)</span>
        </div>
      </div>

      {/* Risk Details */}
      <div className="space-y-2 mt-4">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Priority Risks & Mitigations
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {risks
            .sort((a, b) => getRiskScore(b.likelihood, b.impact) - getRiskScore(a.likelihood, a.impact))
            .slice(0, 3)
            .map((risk, index) => {
              const score = getRiskScore(risk.likelihood, risk.impact);
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getRiskColor(score)}`}></div>
                      <span className="text-sm font-medium text-gray-900">{risk.factor}</span>
                      {risk.trend && (
                        <TrendIndicator trend={risk.trend} />
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      score >= 15 ? 'bg-red-100 text-red-700' :
                      score >= 10 ? 'bg-orange-100 text-orange-700' :
                      score >= 6 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {getRiskLabel(score)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                    <span>Likelihood: {risk.likelihood}/5</span>
                    <span>Impact: {risk.impact}/5</span>
                    <span>Category: {risk.category}</span>
                  </div>
                  {risk.mitigation && (
                    <div className="flex items-start gap-2 text-xs">
                      <Shield className="w-3 h-3 text-blue-600 mt-0.5" />
                      <p className="text-gray-700">{risk.mitigation}</p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Overall Risk Assessment */}
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Info className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">Risk Assessment Summary</span>
        </div>
        <p className="text-xs text-gray-600">
          Overall risk level is {averageRiskScore < 6 ? 'Low' : averageRiskScore < 10 ? 'Moderate' : 'High'} with 
          an average score of {averageRiskScore.toFixed(1)}. Focus on mitigating {criticalRisks > 0 ? 'critical' : highRisks > 0 ? 'high priority' : 'medium'} risks 
          to improve patentability prospects.
        </p>
      </div>
    </div>
  );
};

const TrendIndicator: React.FC<{ trend: 'increasing' | 'stable' | 'decreasing' }> = ({ trend }) => {
  if (trend === 'increasing') {
    return <TrendingUp className="w-3 h-3 text-red-500" />;
  }
  if (trend === 'decreasing') {
    return <TrendingUp className="w-3 h-3 text-green-500 rotate-180" />;
  }
  return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
};

export default RiskHeatmap;