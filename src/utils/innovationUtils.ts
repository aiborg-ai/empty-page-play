/**
 * Utility Functions for Innovation Management
 * 
 * This module provides helper functions for data processing,
 * formatting, calculations, and common operations used across
 * innovation management components.
 * 
 * @module utils/innovationUtils
 * @version 2.0.0
 */

import {
  PipelineStage,
  Priority,
  RiskLevel,
  PatentStatus,
  TechnologyCategory,
  Patent,
  PipelineItem,
  BudgetProject,
  PerformanceMetric
} from '@/types/innovation';

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format large numbers with appropriate units (K, M, B)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with unit
 * 
 * @example
 * formatLargeNumber(1500000) // "1.5M"
 * formatLargeNumber(1234, 0) // "1K"
 */
export function formatLargeNumber(value: number, decimals: number = 1): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }
  return value.toString();
}

/**
 * Format currency values
 * @param value - The amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1500000) // "$1,500,000"
 * formatCurrency(1500.50, 'EUR', 'de-DE') // "1.500,50 €"
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Format percentage values
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @param includeSign - Whether to include + for positive values
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercentage(85.5) // "86%"
 * formatPercentage(12.34, 1, true) // "+12.3%"
 */
export function formatPercentage(
  value: number,
  decimals: number = 0,
  includeSign: boolean = false
): string {
  const formatted = `${value.toFixed(decimals)}%`;
  if (includeSign && value > 0) {
    return `+${formatted}`;
  }
  return formatted;
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param date - The date to format
 * @returns Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 */
export function formatRelativeTime(date: Date | string): string {
  const now = Date.now();
  const then = typeof date === 'string' ? new Date(date).getTime() : date.getTime();
  const diff = now - then;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Format patent number for display
 * @param patentNumber - Raw patent number
 * @returns Formatted patent number
 * 
 * @example
 * formatPatentNumber('US11234567') // "US 11,234,567"
 */
export function formatPatentNumber(patentNumber: string): string {
  // US Patents
  if (patentNumber.startsWith('US')) {
    const number = patentNumber.slice(2);
    return `US ${number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
  
  // European Patents
  if (patentNumber.startsWith('EP')) {
    const number = patentNumber.slice(2);
    return `EP ${number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
  }
  
  // PCT Applications
  if (patentNumber.startsWith('WO')) {
    return patentNumber.replace(/(\d{4})(\d{6})/, 'WO $1/$2');
  }
  
  return patentNumber;
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Get color class for priority level
 * @param priority - Priority level
 * @returns Tailwind CSS color classes
 */
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    [Priority.LOW]: 'text-green-600 bg-green-50',
    [Priority.MEDIUM]: 'text-yellow-600 bg-yellow-50',
    [Priority.HIGH]: 'text-orange-600 bg-orange-50',
    [Priority.CRITICAL]: 'text-red-600 bg-red-50'
  };
  return colors[priority] || 'text-gray-600 bg-gray-50';
}

/**
 * Get color class for risk level
 * @param risk - Risk level
 * @returns Tailwind CSS color classes
 */
export function getRiskColor(risk: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    [RiskLevel.LOW]: 'text-green-600 bg-green-50 border-green-200',
    [RiskLevel.MEDIUM]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    [RiskLevel.HIGH]: 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[risk] || 'text-gray-600 bg-gray-50 border-gray-200';
}

/**
 * Get color class for patent status
 * @param status - Patent status
 * @returns Tailwind CSS color classes
 */
export function getStatusColor(status: PatentStatus): string {
  const colors: Record<PatentStatus, string> = {
    [PatentStatus.DRAFT]: 'text-gray-600 bg-gray-50',
    [PatentStatus.PENDING]: 'text-yellow-600 bg-yellow-50',
    [PatentStatus.FILED]: 'text-blue-600 bg-blue-50',
    [PatentStatus.PUBLISHED]: 'text-purple-600 bg-purple-50',
    [PatentStatus.GRANTED]: 'text-green-600 bg-green-50',
    [PatentStatus.EXPIRED]: 'text-red-600 bg-red-50',
    [PatentStatus.ABANDONED]: 'text-gray-600 bg-gray-50'
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
}

/**
 * Get color for pipeline stage
 * @param stage - Pipeline stage
 * @returns Color configuration object
 */
export function getStageColor(stage: PipelineStage): {
  bg: string;
  border: string;
  text: string;
  icon: string;
} {
  const colors = {
    [PipelineStage.IDEATION]: {
      bg: 'bg-purple-100',
      border: 'border-purple-300',
      text: 'text-purple-700',
      icon: '💡'
    },
    [PipelineStage.RESEARCH]: {
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      text: 'text-blue-700',
      icon: '🔬'
    },
    [PipelineStage.DEVELOPMENT]: {
      bg: 'bg-indigo-100',
      border: 'border-indigo-300',
      text: 'text-indigo-700',
      icon: '⚙️'
    },
    [PipelineStage.FILING]: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
      text: 'text-yellow-700',
      icon: '📄'
    },
    [PipelineStage.PROSECUTION]: {
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      text: 'text-orange-700',
      icon: '⚖️'
    },
    [PipelineStage.GRANTED]: {
      bg: 'bg-green-100',
      border: 'border-green-300',
      text: 'text-green-700',
      icon: '✅'
    }
  };
  
  return colors[stage] || {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-700',
    icon: '❓'
  };
}

// ============================================================================
// CALCULATION UTILITIES
// ============================================================================

/**
 * Calculate portfolio ROI
 * @param patents - Array of patents
 * @returns Average ROI percentage
 */
export function calculatePortfolioROI(patents: Patent[]): number {
  if (patents.length === 0) return 0;
  
  const totalROI = patents.reduce((sum, patent) => sum + patent.roi, 0);
  return totalROI / patents.length;
}

/**
 * Calculate portfolio value
 * @param patents - Array of patents
 * @returns Total portfolio value
 */
export function calculatePortfolioValue(patents: Patent[]): number {
  return patents.reduce((sum, patent) => sum + patent.marketValue, 0);
}

/**
 * Calculate maintenance costs
 * @param patents - Array of patents
 * @returns Annual maintenance cost
 */
export function calculateMaintenanceCosts(patents: Patent[]): number {
  return patents.reduce((sum, patent) => sum + patent.maintenanceCost, 0);
}

/**
 * Calculate innovation velocity
 * @param items - Pipeline items
 * @param periodMonths - Period in months (default: 12)
 * @returns Innovations per month
 */
export function calculateInnovationVelocity(
  items: PipelineItem[],
  periodMonths: number = 12
): number {
  const recentItems = items.filter(item => {
    const itemDate = new Date(item.createdAt || Date.now());
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - periodMonths);
    return itemDate > cutoffDate;
  });
  
  return recentItems.length / periodMonths;
}

/**
 * Calculate patent grant rate
 * @param items - Pipeline items
 * @returns Grant rate percentage
 */
export function calculateGrantRate(items: PipelineItem[]): number {
  const filed = items.filter(item => 
    [PipelineStage.FILING, PipelineStage.PROSECUTION, PipelineStage.GRANTED].includes(item.stage)
  );
  
  if (filed.length === 0) return 0;
  
  const granted = items.filter(item => item.stage === PipelineStage.GRANTED);
  return (granted.length / filed.length) * 100;
}

/**
 * Calculate budget optimization potential
 * @param projects - Budget projects
 * @returns Optimization metrics
 */
export function calculateBudgetOptimization(projects: BudgetProject[]): {
  currentROI: number;
  potentialROI: number;
  improvement: number;
  savingsPotential: number;
} {
  const currentROI = projects.reduce((sum, p) => 
    sum + (p.currentBudget * p.roi / 100), 0
  ) / projects.reduce((sum, p) => sum + p.currentBudget, 0) * 100;
  
  const potentialROI = projects.reduce((sum, p) => 
    sum + (p.recommendedBudget * p.roi / 100), 0
  ) / projects.reduce((sum, p) => sum + p.recommendedBudget, 0) * 100;
  
  const improvement = potentialROI - currentROI;
  
  const overAllocated = projects
    .filter(p => p.recommendedBudget < p.currentBudget)
    .reduce((sum, p) => sum + (p.currentBudget - p.recommendedBudget), 0);
  
  return {
    currentROI,
    potentialROI,
    improvement,
    savingsPotential: overAllocated
  };
}

// ============================================================================
// FILTERING & SORTING UTILITIES
// ============================================================================

/**
 * Filter patents by status
 * @param patents - Array of patents
 * @param status - Status to filter by
 * @returns Filtered patents
 */
export function filterPatentsByStatus(
  patents: Patent[],
  status: PatentStatus | 'all'
): Patent[] {
  if (status === 'all') return patents;
  return patents.filter(p => p.status === status);
}

/**
 * Filter pipeline items by stage
 * @param items - Pipeline items
 * @param stage - Stage to filter by
 * @returns Filtered items
 */
export function filterPipelineByStage(
  items: PipelineItem[],
  stage: PipelineStage | 'all'
): PipelineItem[] {
  if (stage === 'all') return items;
  return items.filter(item => item.stage === stage);
}

/**
 * Sort patents by various criteria
 * @param patents - Array of patents
 * @param sortBy - Sort criteria
 * @param ascending - Sort direction (default: false)
 * @returns Sorted patents
 */
export function sortPatents(
  patents: Patent[],
  sortBy: 'value' | 'roi' | 'citations' | 'date',
  ascending: boolean = false
): Patent[] {
  const sorted = [...patents].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.marketValue - a.marketValue;
      case 'roi':
        return b.roi - a.roi;
      case 'citations':
        return b.citationCount - a.citationCount;
      case 'date':
        return new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime();
      default:
        return 0;
    }
  });
  
  return ascending ? sorted.reverse() : sorted;
}

/**
 * Group items by technology category
 * @param items - Array of items with technology property
 * @returns Grouped items
 */
export function groupByTechnology<T extends { technology?: TechnologyCategory }>(
  items: T[]
): Record<TechnologyCategory, T[]> {
  return items.reduce((groups, item) => {
    if (item.technology) {
      if (!groups[item.technology]) {
        groups[item.technology] = [];
      }
      groups[item.technology].push(item);
    }
    return groups;
  }, {} as Record<TechnologyCategory, T[]>);
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate patent number format
 * @param patentNumber - Patent number to validate
 * @returns Whether the patent number is valid
 */
export function isValidPatentNumber(patentNumber: string): boolean {
  // US Patent
  if (/^US\d{7,8}[A-Z]?\d?$/.test(patentNumber)) return true;
  
  // European Patent
  if (/^EP\d{7}[A-Z]\d$/.test(patentNumber)) return true;
  
  // PCT Application
  if (/^WO\d{4}\/\d{6}$/.test(patentNumber)) return true;
  
  return false;
}

/**
 * Validate email address
 * @param email - Email to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
}

/**
 * Validate date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Whether the date range is valid
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return startDate < endDate;
}

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Convert pipeline items to chart data
 * @param items - Pipeline items
 * @returns Chart-ready data
 */
export function pipelineToChartData(items: PipelineItem[]): {
  labels: string[];
  data: number[];
  colors: string[];
} {
  const stages = Object.values(PipelineStage);
  const data = stages.map(stage => 
    items.filter(item => item.stage === stage).length
  );
  const colors = stages.map(stage => {
    const color = getStageColor(stage);
    return color.bg.replace('bg-', '').replace('-100', '');
  });
  
  return {
    labels: stages.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    data,
    colors
  };
}

/**
 * Calculate technology distribution
 * @param items - Items with technology property
 * @returns Distribution percentages
 */
export function calculateTechDistribution<T extends { technology?: TechnologyCategory }>(
  items: T[]
): Array<{ technology: TechnologyCategory; count: number; percentage: number }> {
  const grouped = groupByTechnology(items);
  const total = items.filter(i => i.technology).length;
  
  return Object.entries(grouped).map(([tech, items]) => ({
    technology: tech as TechnologyCategory,
    count: items.length,
    percentage: total > 0 ? (items.length / total) * 100 : 0
  })).sort((a, b) => b.count - a.count);
}

/**
 * Generate performance summary
 * @param metrics - Performance metrics
 * @returns Summary statistics
 */
export function generatePerformanceSummary(metrics: PerformanceMetric[]): {
  onTrack: number;
  atRisk: number;
  behind: number;
  averagePerformance: number;
} {
  const onTrack = metrics.filter(m => m.performance >= 90).length;
  const atRisk = metrics.filter(m => m.performance >= 70 && m.performance < 90).length;
  const behind = metrics.filter(m => m.performance < 70).length;
  const averagePerformance = metrics.reduce((sum, m) => sum + m.performance, 0) / metrics.length;
  
  return {
    onTrack,
    atRisk,
    behind,
    averagePerformance
  };
}

// ============================================================================
// EXPORT HELPERS
// ============================================================================

/**
 * Export data to CSV format
 * @param data - Array of objects to export
 * @param filename - Output filename
 * @returns CSV string
 */
export function exportToCSV(data: any[], _filename: string = 'export.csv'): string {
  if (data.length === 0) return '';
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  // Convert data to CSV rows
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in values
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Download data as file
 * @param content - File content
 * @param filename - Output filename
 * @param type - MIME type (default: 'text/csv')
 */
export function downloadFile(
  content: string,
  filename: string,
  type: string = 'text/csv'
): void {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

/**
 * Generate mock pipeline items for testing
 * @param count - Number of items to generate
 * @returns Array of mock pipeline items
 */
export function generateMockPipelineItems(count: number): PipelineItem[] {
  const stages = Object.values(PipelineStage);
  const priorities = Object.values(Priority);
  const technologies = Object.values(TechnologyCategory);
  const names = ['Dr. Sarah Chen', 'Dr. Michael Liu', 'Dr. Emma Watson', 'Dr. John Smith'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    title: `Innovation Project ${i + 1}`,
    description: `Description for innovation project ${i + 1}`,
    stage: stages[Math.floor(Math.random() * stages.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    assignee: names[Math.floor(Math.random() * names.length)],
    dueDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    progress: Math.floor(Math.random() * 100),
    milestones: [
      {
        name: 'Initial Research',
        completed: true,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        name: 'Prototype Development',
        completed: Math.random() > 0.5,
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    technology: technologies[Math.floor(Math.random() * technologies.length)],
    estimatedValue: Math.floor(Math.random() * 10000000),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
  }));
}