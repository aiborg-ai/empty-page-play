/**
 * Integration Service
 * Manages all integration operations including API marketplace, webhooks, 
 * enterprise connectors, and third-party services
 */

import { supabase } from './supabase';
import {
  BaseIntegration,
  APIIntegration,
  WebhookIntegration,
  EnterpriseConnector,
  PatentOfficeIntegration,
  APIKey,
  WebhookLog,
  IntegrationError,
  IntegrationCategory,
  WebhookTestRequest,
  WebhookTestResponse
} from '@/types/integrations';

class IntegrationService {
  private static instance: IntegrationService;

  public static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
    }
    return IntegrationService.instance;
  }

  // =============================================================================
  // GENERAL INTEGRATION METHODS
  // =============================================================================

  /**
   * Get all integrations for the current user
   */
  async getAllIntegrations(userId: string): Promise<BaseIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching integrations:', error);
      throw error;
    }
  }

  /**
   * Get integrations by category
   */
  async getIntegrationsByCategory(
    userId: string, 
    category: IntegrationCategory
  ): Promise<BaseIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching integrations by category:', error);
      throw error;
    }
  }

  /**
   * Create a new integration
   */
  async createIntegration(
    userId: string, 
    integration: Omit<BaseIntegration, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<BaseIntegration> {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .insert({
          ...integration,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating integration:', error);
      throw error;
    }
  }

  /**
   * Update an existing integration
   */
  async updateIntegration(
    integrationId: string,
    updates: Partial<BaseIntegration>
  ): Promise<BaseIntegration> {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', integrationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating integration:', error);
      throw error;
    }
  }

  /**
   * Delete an integration
   */
  async deleteIntegration(integrationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting integration:', error);
      throw error;
    }
  }

  // =============================================================================
  // API MARKETPLACE METHODS
  // =============================================================================

  /**
   * Get available APIs from marketplace
   */
  async getMarketplaceAPIs(): Promise<APIIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('api_marketplace')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching marketplace APIs:', error);
      throw error;
    }
  }

  /**
   * Search marketplace APIs
   */
  async searchMarketplaceAPIs(query: string): Promise<APIIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('api_marketplace')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching marketplace APIs:', error);
      throw error;
    }
  }

  /**
   * Get API usage analytics
   */
  async getAPIAnalytics(apiId: string, timeRange: string = '7d'): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('api_analytics')
        .select('*')
        .eq('api_id', apiId)
        .gte('created_at', this.getTimeRangeStart(timeRange))
        .order('created_at');

      if (error) throw error;
      return this.processAnalyticsData(data || []);
    } catch (error) {
      console.error('Error fetching API analytics:', error);
      throw error;
    }
  }

  /**
   * Create API key
   */
  async createAPIKey(
    userId: string,
    apiId: string,
    keyData: Omit<APIKey, 'id' | 'createdAt'>
  ): Promise<APIKey> {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          ...keyData,
          user_id: userId,
          integration_id: apiId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  }

  /**
   * Get user's API keys
   */
  async getAPIKeys(userId: string): Promise<APIKey[]> {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching API keys:', error);
      throw error;
    }
  }

  /**
   * Revoke API key
   */
  async revokeAPIKey(keyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;
    } catch (error) {
      console.error('Error revoking API key:', error);
      throw error;
    }
  }

  // =============================================================================
  // WEBHOOK METHODS
  // =============================================================================

  /**
   * Create webhook
   */
  async createWebhook(
    userId: string,
    webhook: Omit<WebhookIntegration, 'id' | 'createdAt' | 'updatedAt' | 'logs'>
  ): Promise<WebhookIntegration> {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          ...webhook,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating webhook:', error);
      throw error;
    }
  }

  /**
   * Get user's webhooks
   */
  async getWebhooks(userId: string): Promise<WebhookIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      throw error;
    }
  }

  /**
   * Test webhook
   */
  async testWebhook(request: WebhookTestRequest): Promise<WebhookTestResponse> {
    try {
      const startTime = Date.now();
      
      // Get webhook configuration
      const { data: webhook } = await supabase
        .from('webhooks')
        .select('*')
        .eq('id', request.webhookId)
        .single();

      if (!webhook) {
        throw new Error('Webhook not found');
      }

      // Send test request
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...webhook.headers,
          ...(webhook.authentication.type === 'bearer_token' && {
            'Authorization': `Bearer ${webhook.authentication.secret}`
          })
        },
        body: JSON.stringify(request.payload)
      });

      const responseData = await response.json();
      const processingTime = Date.now() - startTime;

      // Log the test
      await this.logWebhookEvent({
        id: crypto.randomUUID(),
        webhookId: request.webhookId,
        event: request.event,
        payload: request.payload,
        response: {
          status: response.status,
          body: responseData,
          headers: Object.fromEntries(response.headers.entries())
        },
        attempt: 1,
        success: response.ok,
        timestamp: new Date().toISOString(),
        processingTimeMs: processingTime
      });

      return {
        success: response.ok,
        status: response.status,
        response: responseData,
        processingTimeMs: processingTime
      };
    } catch (error) {
      console.error('Error testing webhook:', error);
      return {
        success: false,
        status: 0,
        response: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTimeMs: 0
      };
    }
  }

  /**
   * Log webhook event
   */
  async logWebhookEvent(log: WebhookLog): Promise<void> {
    try {
      const { error } = await supabase
        .from('webhook_logs')
        .insert(log);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging webhook event:', error);
      throw error;
    }
  }

  /**
   * Get webhook logs
   */
  async getWebhookLogs(
    webhookId: string,
    limit: number = 100
  ): Promise<WebhookLog[]> {
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('webhook_id', webhookId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching webhook logs:', error);
      throw error;
    }
  }

  // =============================================================================
  // ENTERPRISE CONNECTOR METHODS
  // =============================================================================

  /**
   * Create enterprise connector
   */
  async createEnterpriseConnector(
    userId: string,
    connector: Omit<EnterpriseConnector, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<EnterpriseConnector> {
    try {
      const { data, error } = await supabase
        .from('enterprise_connectors')
        .insert({
          ...connector,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating enterprise connector:', error);
      throw error;
    }
  }

  /**
   * Test enterprise connection
   */
  async testEnterpriseConnection(connectorId: string): Promise<boolean> {
    try {
      // Implementation would depend on the specific enterprise system
      // This is a placeholder for the actual connection test logic
      const { data: connector } = await supabase
        .from('enterprise_connectors')
        .select('*')
        .eq('id', connectorId)
        .single();

      if (!connector) return false;

      // Perform actual connection test based on connector type
      // For now, return true as placeholder
      return true;
    } catch (error) {
      console.error('Error testing enterprise connection:', error);
      return false;
    }
  }

  // =============================================================================
  // PATENT OFFICE INTEGRATION METHODS
  // =============================================================================

  /**
   * Create patent office integration
   */
  async createPatentOfficeIntegration(
    userId: string,
    integration: Omit<PatentOfficeIntegration, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PatentOfficeIntegration> {
    try {
      const { data, error } = await supabase
        .from('patent_office_integrations')
        .insert({
          ...integration,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating patent office integration:', error);
      throw error;
    }
  }

  /**
   * Sync patent status
   */
  async syncPatentStatus(integrationId: string): Promise<void> {
    try {
      // Implementation would connect to actual patent office APIs
      // This is a placeholder for the sync logic
      console.log(`Syncing patent status for integration ${integrationId}`);
      
      await supabase
        .from('patent_office_integrations')
        .update({ 
          last_sync: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', integrationId);
    } catch (error) {
      console.error('Error syncing patent status:', error);
      throw error;
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private getTimeRangeStart(timeRange: string): string {
    const now = new Date();
    const ranges: { [key: string]: number } = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const ms = ranges[timeRange] || ranges['7d'];
    return new Date(now.getTime() - ms).toISOString();
  }

  private processAnalyticsData(data: any[]): any {
    // Process raw analytics data into chart-friendly format
    return {
      requests: data.reduce((sum, item) => sum + (item.requests || 0), 0),
      errors: data.reduce((sum, item) => sum + (item.errors || 0), 0),
      averageResponseTime: data.length > 0 
        ? data.reduce((sum, item) => sum + (item.response_time || 0), 0) / data.length 
        : 0,
      timeline: data.map(item => ({
        timestamp: item.created_at,
        requests: item.requests || 0,
        errors: item.errors || 0,
        responseTime: item.response_time || 0
      }))
    };
  }

  /**
   * Log integration error
   */
  async logIntegrationError(error: Omit<IntegrationError, 'id'>): Promise<void> {
    try {
      await supabase
        .from('integration_errors')
        .insert({
          ...error,
          id: crypto.randomUUID()
        });
    } catch (err) {
      console.error('Error logging integration error:', err);
    }
  }

  /**
   * Get integration errors
   */
  async getIntegrationErrors(integrationId: string): Promise<IntegrationError[]> {
    try {
      const { data, error } = await supabase
        .from('integration_errors')
        .select('*')
        .eq('integration_id', integrationId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching integration errors:', error);
      return [];
    }
  }
}

export const integrationService = IntegrationService.getInstance();