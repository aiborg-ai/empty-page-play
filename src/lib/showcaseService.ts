import { supabase } from './supabase';
import { Capability, CapabilityCategory, CapabilityParameter } from '../types/capabilities';

interface DatabaseCapability {
  id: string;
  name: string;
  description: string;
  long_description: string | null;
  category: CapabilityCategory;
  type: 'tool' | 'dashboard' | 'ai-agent' | 'workflow' | 'integration';
  provider_id: string;
  price_amount: number;
  price_currency: string;
  billing_type: 'one-time' | 'monthly' | 'per-use';
  free_trial_available: boolean;
  trial_duration: number;
  version: string;
  requirements: string[];
  supported_data_types: string[];
  estimated_run_time: string;
  output_types: string[];
  total_runs: number;
  average_run_time: number;
  success_rate: number;
  user_rating: number;
  total_reviews: number;
  thumbnail_url: string | null;
  screenshot_urls: string[];
  demo_video_url: string | null;
  tags: string[];
  allow_sharing: boolean;
  max_shares: number;
  current_shares: number;
  is_active: boolean;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  capability_providers?: {
    id: string;
    name: string;
    company: string;
    email: string;
    verified: boolean;
    rating: number;
  };
  capability_parameters?: Array<{
    id: string;
    name: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'multi-select' | 'file' | 'date' | 'range';
    required: boolean;
    default_value: string | null;
    options: any[];
    validation: any;
    description: string | null;
    help_text: string | null;
    sort_order: number;
  }>;
}

export class ShowcaseService {
  static async getCapabilities(
    category?: CapabilityCategory | 'all',
    searchQuery?: string,
    userId?: string
  ): Promise<Capability[]> {
    try {
      let query = supabase
        .from('capabilities')
        .select(`
          *,
          capability_providers (
            id, name, company, email, verified, rating
          ),
          capability_parameters (
            id, name, label, type, required, default_value,
            options, validation, description, help_text, sort_order
          )
        `)
        .eq('is_published', true)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('user_rating', { ascending: false });

      // Apply category filter
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Apply search filter
      if (searchQuery && searchQuery.trim()) {
        query = query.textSearch('search_vector', searchQuery.trim());
      }

      const { data: capabilities, error } = await query;

      if (error) {
        console.error('Error fetching capabilities:', error);
        return [];
      }

      if (!capabilities) {
        return [];
      }

      // Transform database format to frontend format
      return capabilities.map((cap: DatabaseCapability) => this.transformCapability(cap, userId));
    } catch (error) {
      console.error('Error in getCapabilities:', error);
      return [];
    }
  }

  static async getCapabilityById(id: string, userId?: string): Promise<Capability | null> {
    try {
      const { data: capability, error } = await supabase
        .from('capabilities')
        .select(`
          *,
          capability_providers (
            id, name, company, email, verified, rating
          ),
          capability_parameters (
            id, name, label, type, required, default_value,
            options, validation, description, help_text, sort_order
          )
        `)
        .eq('id', id)
        .eq('is_published', true)
        .eq('is_active', true)
        .single();

      if (error || !capability) {
        console.error('Error fetching capability:', error);
        return null;
      }

      return this.transformCapability(capability, userId);
    } catch (error) {
      console.error('Error in getCapabilityById:', error);
      return null;
    }
  }

  static async getUserCapabilityStatus(capabilityId: string, userId: string): Promise<{
    isPurchased: boolean;
    isEnabled: boolean;
    isShared: boolean;
    sharedBy?: string;
    status: string;
  }> {
    try {
      const { data: userCapability, error } = await supabase
        .from('user_capabilities')
        .select('*')
        .eq('user_id', userId)
        .eq('capability_id', capabilityId)
        .single();

      if (error || !userCapability) {
        return {
          isPurchased: false,
          isEnabled: false,
          isShared: false,
          status: 'available'
        };
      }

      return {
        isPurchased: userCapability.status === 'purchased' || userCapability.license_type === 'purchased',
        isEnabled: userCapability.status === 'enabled',
        isShared: userCapability.license_type === 'shared',
        sharedBy: userCapability.shared_by || undefined,
        status: userCapability.status
      };
    } catch (error) {
      console.error('Error getting user capability status:', error);
      return {
        isPurchased: false,
        isEnabled: false,
        isShared: false,
        status: 'available'
      };
    }
  }

  private static transformCapability(dbCap: DatabaseCapability, _userId?: string): Capability {
    // Transform parameters
    const parameters: CapabilityParameter[] = (dbCap.capability_parameters || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(param => ({
        id: param.id,
        name: param.name,
        label: param.label,
        type: param.type,
        required: param.required,
        defaultValue: param.default_value,
        options: param.options || [],
        validation: param.validation || {},
        description: param.description || '',
        helpText: param.help_text || ''
      }));

    // Create the capability object
    const capability: Capability = {
      id: dbCap.id,
      name: dbCap.name,
      description: dbCap.description,
      longDescription: dbCap.long_description || dbCap.description,
      category: dbCap.category,
      type: dbCap.type,
      
      // Provider info
      providerId: dbCap.provider_id,
      providerName: dbCap.capability_providers?.name || 'Unknown Provider',
      providerCompany: dbCap.capability_providers?.company || 'Unknown Company',
      
      // Status (will be updated if userId is provided)
      status: 'available',
      isEnabled: false,
      isPurchased: false,
      isShared: false,
      
      // Pricing
      price: {
        amount: dbCap.price_amount,
        currency: dbCap.price_currency,
        billingType: dbCap.billing_type
      },
      freeTrialAvailable: dbCap.free_trial_available,
      trialDuration: dbCap.trial_duration,
      
      // Technical details
      version: dbCap.version,
      lastUpdated: dbCap.updated_at,
      requirements: dbCap.requirements,
      supportedDataTypes: dbCap.supported_data_types,
      estimatedRunTime: dbCap.estimated_run_time,
      outputTypes: dbCap.output_types,
      
      // Sample assets (empty for now - could be populated from another table)
      sampleAssets: [],
      
      // Usage stats
      totalRuns: dbCap.total_runs,
      averageRunTime: dbCap.average_run_time,
      successRate: dbCap.success_rate,
      userRating: dbCap.user_rating,
      totalReviews: dbCap.total_reviews,
      
      // Configuration
      parameters,
      
      // Media
      thumbnailUrl: dbCap.thumbnail_url || '/api/placeholder-thumbnail.jpg',
      screenshotUrls: dbCap.screenshot_urls,
      demoVideoUrl: dbCap.demo_video_url || undefined,
      tags: dbCap.tags,
      
      // Sharing
      shareSettings: {
        allowSharing: dbCap.allow_sharing,
        maxShares: dbCap.max_shares,
        currentShares: dbCap.current_shares
      }
    };

    return capability;
  }

  static async createCapability(capabilityData: {
    name: string;
    description: string;
    longDescription?: string;
    category: CapabilityCategory;
    type: 'tool' | 'dashboard' | 'ai-agent' | 'workflow' | 'integration';
    providerId: string;
    priceAmount?: number;
    priceCurrency?: string;
    billingType?: 'one-time' | 'monthly' | 'per-use';
    freeTrialAvailable?: boolean;
    trialDuration?: number;
    version?: string;
    requirements?: string[];
    supportedDataTypes?: string[];
    estimatedRunTime?: string;
    outputTypes?: string[];
    thumbnailUrl?: string;
    screenshotUrls?: string[];
    demoVideoUrl?: string;
    tags?: string[];
    allowSharing?: boolean;
    maxShares?: number;
    isFeatured?: boolean;
  }): Promise<{ success: boolean; capabilityId?: string; error?: string }> {
    try {
      const { data: capability, error } = await supabase
        .from('capabilities')
        .insert({
          name: capabilityData.name,
          description: capabilityData.description,
          long_description: capabilityData.longDescription,
          category: capabilityData.category,
          type: capabilityData.type,
          provider_id: capabilityData.providerId,
          price_amount: capabilityData.priceAmount || 0,
          price_currency: capabilityData.priceCurrency || 'USD',
          billing_type: capabilityData.billingType || 'one-time',
          free_trial_available: capabilityData.freeTrialAvailable || false,
          trial_duration: capabilityData.trialDuration || 0,
          version: capabilityData.version || '1.0.0',
          requirements: capabilityData.requirements || [],
          supported_data_types: capabilityData.supportedDataTypes || [],
          estimated_run_time: capabilityData.estimatedRunTime || '1-5 minutes',
          output_types: capabilityData.outputTypes || [],
          thumbnail_url: capabilityData.thumbnailUrl,
          screenshot_urls: capabilityData.screenshotUrls || [],
          demo_video_url: capabilityData.demoVideoUrl,
          tags: capabilityData.tags || [],
          allow_sharing: capabilityData.allowSharing !== false,
          max_shares: capabilityData.maxShares || 5,
          is_featured: capabilityData.isFeatured || false,
          is_published: true,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, capabilityId: capability.id };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create capability' };
    }
  }

  static async addCapabilityParameter(parametersData: {
    capabilityId: string;
    name: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'multi-select' | 'file' | 'date' | 'range';
    required?: boolean;
    defaultValue?: string;
    options?: Array<{ value: any; label: string }>;
    validation?: any;
    description?: string;
    helpText?: string;
    sortOrder?: number;
  }[]): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('capability_parameters')
        .insert(parametersData.map(param => ({
          capability_id: param.capabilityId,
          name: param.name,
          label: param.label,
          type: param.type,
          required: param.required || false,
          default_value: param.defaultValue,
          options: param.options || [],
          validation: param.validation || {},
          description: param.description,
          help_text: param.helpText,
          sort_order: param.sortOrder || 0
        })));

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to add parameters' };
    }
  }
}