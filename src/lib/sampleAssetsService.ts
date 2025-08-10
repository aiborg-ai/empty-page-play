// Service for generating and managing sample assets from capabilities

import { ProjectAsset } from '../types/projects';
import { ProjectContextService } from './projectContext';

export class SampleAssetsService {
  private static instance: SampleAssetsService;

  static getInstance(): SampleAssetsService {
    if (!SampleAssetsService.instance) {
      SampleAssetsService.instance = new SampleAssetsService();
    }
    return SampleAssetsService.instance;
  }

  // Generate sample assets for "Try Once" functionality (AI agents, Deep Dive)
  generateTryOnceSample(capabilityName: string, capabilityType: string): ProjectAsset[] {
    const baseId = `sample_${Date.now()}`;
    
    const sampleAssets: ProjectAsset[] = [];

    if (capabilityType === 'ai-agent' || capabilityName.toLowerCase().includes('ai')) {
      // AI Agent sample assets
      sampleAssets.push(
        {
          id: `${baseId}_report`,
          name: `${capabilityName} - Sample Analysis Report`,
          description: 'AI-generated sample analysis with key insights and recommendations',
          type: 'report',
          size: 2.4 * 1024 * 1024, // 2.4MB
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system',
          isSharedFromOtherProject: false,
          tags: ['sample', 'ai-generated', 'trial'],
          metadata: {
            sampleData: true,
            trialRun: true,
            format: 'pdf',
            sourceCapabilityId: baseId.split('_')[1],
            sourceType: 'capability-trial',
            keyInsights: [
              'Market trend analysis shows 23% growth in target sector',
              'Competitive landscape identifies 5 key players',
              'Patent filing activity peaked in Q2 2024'
            ],
            confidence: 0.85,
            processingTime: '2.3 minutes',
            permissions: { canEdit: false, canDelete: false, canShare: true }
          }
        },
        {
          id: `${baseId}_insights`,
          name: `${capabilityName} - Key Insights Dashboard`,
          description: 'Interactive dashboard showing AI-extracted insights and patterns',
          type: 'dashboard',
          size: 850 * 1024, // 850KB
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system',
          isSharedFromOtherProject: false,
          tags: ['sample', 'dashboard', 'insights'],
          metadata: {
            sampleData: true,
            trialRun: true,
            format: 'json',
            sourceCapabilityId: baseId.split('_')[1],
            sourceType: 'capability-trial',
            chartTypes: ['trend-analysis', 'competitive-matrix', 'geographic-distribution'],
            dataPoints: 1247,
            visualizations: 6,
            permissions: { canEdit: false, canDelete: false, canShare: true }
          }
        }
      );
    }

    if (capabilityName.toLowerCase().includes('deep dive') || capabilityName.toLowerCase().includes('landscape')) {
      // Deep Dive sample assets
      sampleAssets.push({
        id: `${baseId}_deepdive`,
        name: `${capabilityName} - Comprehensive Deep Dive Report`,
        description: 'Detailed analytical report with multi-dimensional analysis',
        type: 'report',
        size: 5.2 * 1024 * 1024, // 5.2MB
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        isSharedFromOtherProject: false,
        tags: ['sample', 'deep-dive', 'comprehensive'],
        metadata: {
          sampleData: true,
          trialRun: true,
          format: 'pdf',
          sourceCapabilityId: baseId.split('_')[1],
          sourceType: 'capability-trial',
          sections: ['Executive Summary', 'Market Analysis', 'Technical Assessment', 'Competitive Intelligence', 'Future Outlook'],
          pageCount: 47,
          chartsAndGraphs: 23,
          analysisDepth: 'comprehensive',
          permissions: { canEdit: false, canDelete: false, canShare: true }
        }
      });
    }

    return sampleAssets;
  }

  // Generate sample assets for "Sample me" functionality (Datasets, Reports)
  generateSampleData(capabilityName: string, capabilityType: string): ProjectAsset[] {
    const baseId = `sample_${Date.now()}`;
    const sampleAssets: ProjectAsset[] = [];

    if (capabilityType === 'dataset' || capabilityName.toLowerCase().includes('dataset')) {
      // Dataset sample assets
      sampleAssets.push(
        {
          id: `${baseId}_dataset`,
          name: `${capabilityName} - Sample Dataset`,
          description: 'Representative sample of the full dataset with anonymized records',
          type: 'dataset',
          size: 12.5 * 1024 * 1024, // 12.5MB
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system',
          isSharedFromOtherProject: false,
          tags: ['sample', 'dataset', 'anonymized'],
          metadata: {
            sampleData: true,
            format: 'csv',
            sourceCapabilityId: baseId.split('_')[1],
            sourceType: 'capability-sample',
            recordCount: 5000,
            fullDatasetSize: '2.3GB',
            samplePercentage: 0.5,
            columns: ['patent_id', 'title', 'abstract', 'filing_date', 'assignee', 'classification'],
            dataQuality: 0.96,
            lastUpdated: '2025-08-01',
            permissions: { canEdit: false, canDelete: false, canShare: true }
          }
        },
        {
          id: `${baseId}_schema`,
          name: `${capabilityName} - Data Schema Documentation`,
          description: 'Detailed schema and field descriptions for the dataset',
          type: 'report',
          size: 1.2 * 1024 * 1024, // 1.2MB
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system',
          isSharedFromOtherProject: false,
          tags: ['sample', 'schema', 'documentation'],
          metadata: {
            sampleData: true,
            format: 'pdf',
            sourceCapabilityId: baseId.split('_')[1],
            sourceType: 'capability-sample',
            fieldCount: 47,
            dataTypes: ['string', 'datetime', 'integer', 'text', 'categorical'],
            includesExamples: true,
            permissions: { canEdit: false, canDelete: false, canShare: true }
          }
        }
      );
    }

    if (capabilityType === 'report' || capabilityName.toLowerCase().includes('report')) {
      // Report sample assets
      sampleAssets.push({
        id: `${baseId}_report`,
        name: `${capabilityName} - Sample Report`,
        description: 'Preview report showing structure and analytical approach',
        type: 'report',
        size: 3.8 * 1024 * 1024, // 3.8MB
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        isSharedFromOtherProject: false,
        tags: ['sample', 'report', 'preview'],
        metadata: {
          sampleData: true,
          format: 'pdf',
          sourceCapabilityId: baseId.split('_')[1],
          sourceType: 'capability-sample',
          reportType: 'analytical',
          pageCount: 28,
          executiveSummary: true,
          chartsCount: 15,
          tablesCount: 8,
          dataSourcesCount: 12,
          analysisMethodology: 'quantitative-qualitative-mixed',
          permissions: { canEdit: false, canDelete: false, canShare: true }
        }
      });
    }

    return sampleAssets;
  }

  // Add sample assets to current project and return them for immediate Studio access
  async addSampleAssetsToStudio(assets: ProjectAsset[]): Promise<void> {
    const contextService = ProjectContextService.getInstance();
    const currentProject = contextService.getCurrentProject();

    if (!currentProject) {
      throw new Error('No active project. Please select a project first.');
    }

    // Add assets directly to project
    const projectAssets = assets;

    // Add assets to current project
    for (const asset of projectAssets) {
      contextService.addAssetToCurrentProject(asset);
    }

    // Log the sample generation activity
    contextService.logActivity(
      'asset_added',
      `Generated ${assets.length} sample assets from capability trial`,
      {
        assetCount: assets.length,
        assetTypes: assets.map(a => a.type),
        source: 'capability-sample',
        immediate: true
      }
    );
  }

  // Format asset size for display
  formatAssetSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Generate summary for user notification
  generateSampleSummary(assets: ProjectAsset[]): string {
    const types = assets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeDescriptions = Object.entries(types)
      .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
      .join(', ');

    return `Generated ${assets.length} sample assets: ${typeDescriptions}. Available now in your Studio!`;
  }
}