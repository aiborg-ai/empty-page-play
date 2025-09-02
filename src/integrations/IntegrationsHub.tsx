/**
 * Integrations Hub Component
 * Central hub for managing all integration features including API marketplace,
 * webhooks, enterprise connectors, patent offices, and third-party services
 */

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Webhook,
  Building2,
  FileText,
  Link,
  BarChart3,
  Plus,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Shield
} from 'lucide-react';

// Import integration components
import { APIMarketplace } from '@/api/APIMarketplace';
import { APIKeyManager } from '@/api/APIKeyManager';
import { WebhookManager } from './WebhookManager';
import { EnterpriseConnectors } from '@/connectors/EnterpriseConnectors';
import { PatentOfficeIntegrations } from './PatentOfficeIntegrations';
import { ThirdPartyIntegrations } from './ThirdPartyIntegrations';

import { integrationService } from '@/lib/integrationService';
import type { BaseIntegration } from '@/types/integrations';

interface IntegrationsHubProps {
  userId: string;
}

export const IntegrationsHub: React.FC<IntegrationsHubProps> = ({ userId }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [integrations, setIntegrations] = useState<BaseIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    errors: 0
  });

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: BarChart3,
      description: 'Integration dashboard and analytics'
    },
    {
      id: 'api_marketplace',
      title: 'API Marketplace',
      icon: Globe,
      description: 'Browse and connect to APIs'
    },
    {
      id: 'api_keys',
      title: 'API Keys',
      icon: Shield,
      description: 'Manage API keys and credentials'
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      icon: Webhook,
      description: 'Configure webhook endpoints'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Systems',
      icon: Building2,
      description: 'SAP, Oracle, Dynamics, Salesforce'
    },
    {
      id: 'patent_offices',
      title: 'Patent Offices',
      icon: FileText,
      description: 'USPTO, EPO, WIPO integrations'
    },
    {
      id: 'third_party',
      title: 'Third-Party Services',
      icon: Link,
      description: 'Slack, Teams, Google, Dropbox'
    }
  ];

  useEffect(() => {
    loadIntegrationsData();
  }, []);

  const loadIntegrationsData = async () => {
    try {
      setLoading(true);
      const allIntegrations = await integrationService.getAllIntegrations(userId);
      setIntegrations(allIntegrations);
      
      // Calculate stats
      const stats = {
        total: allIntegrations.length,
        active: allIntegrations.filter(i => i.status === 'active').length,
        pending: allIntegrations.filter(i => i.status === 'pending').length,
        errors: allIntegrations.filter(i => i.status === 'error').length
      };
      setStats(stats);
    } catch (err) {
      console.error('Error loading integrations data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'api_marketplace':
        return <APIMarketplace userId={userId} />;
      case 'api_keys':
        return <APIKeyManager userId={userId} />;
      case 'webhooks':
        return <WebhookManager userId={userId} />;
      case 'enterprise':
        return <EnterpriseConnectors userId={userId} />;
      case 'patent_offices':
        return <PatentOfficeIntegrations userId={userId} />;
      case 'third_party':
        return <ThirdPartyIntegrations userId={userId} />;
      default:
        return <IntegrationsOverview 
          userId={userId} 
          integrations={integrations} 
          stats={stats} 
          loading={loading}
          onSectionChange={setActiveSection}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 text-sm mt-1">
            Connect and manage external services
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const categoryIntegrations = integrations.filter(i => {
                if (section.id === 'overview') return false;
                if (section.id === 'api_marketplace' || section.id === 'api_keys') {
                  return i.category === 'api_marketplace';
                }
                return i.category === section.id.replace('_', '');
              });

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 mt-0.5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                      {section.title}
                    </p>
                    <p className={`text-xs mt-0.5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {section.description}
                    </p>
                    {categoryIntegrations.length > 0 && (
                      <p className={`text-xs mt-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {categoryIntegrations.length} connected
                      </p>
                    )}
                  </div>
                  {!isActive && categoryIntegrations.length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {categoryIntegrations.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-gray-600">Active</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

// Integrations Overview Component
const IntegrationsOverview: React.FC<{
  userId: string;
  integrations: BaseIntegration[];
  stats: any;
  loading: boolean;
  onSectionChange: (section: string) => void;
}> = ({ userId: _userId, integrations, stats, loading, onSectionChange }) => {
  const categoryStats = {
    api_marketplace: integrations.filter(i => i.category === 'api_marketplace').length,
    webhook: integrations.filter(i => i.category === 'webhook').length,
    enterprise: integrations.filter(i => i.category === 'enterprise').length,
    patent_office: integrations.filter(i => i.category === 'patent_office').length,
    third_party: integrations.filter(i => i.category === 'third_party').length
  };

  const quickActions = [
    {
      title: 'Connect API',
      description: 'Browse marketplace and connect to APIs',
      action: () => onSectionChange('api_marketplace'),
      icon: Globe,
      color: 'bg-blue-500'
    },
    {
      title: 'Setup Webhook',
      description: 'Configure webhook endpoints',
      action: () => onSectionChange('webhooks'),
      icon: Webhook,
      color: 'bg-green-500'
    },
    {
      title: 'Add Enterprise System',
      description: 'Connect SAP, Oracle, or Dynamics',
      action: () => onSectionChange('enterprise'),
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      title: 'Patent Office',
      description: 'Connect to USPTO, EPO, or WIPO',
      action: () => onSectionChange('patent_offices'),
      icon: FileText,
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Integration Dashboard</h2>
        <p className="text-gray-600">
          Manage all your external service connections and integrations
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Link className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Integrations</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-600">Active Connections</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending Setup</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.errors}</p>
              <p className="text-sm text-gray-600">Need Attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-gray-600 text-sm">{action.description}</p>
                <ArrowRight className="h-4 w-4 text-gray-400 mt-3 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Integration Categories */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard
            title="API Marketplace"
            description="Browse and connect to external APIs"
            count={categoryStats.api_marketplace}
            icon={Globe}
            color="text-blue-600 bg-blue-100"
            onClick={() => onSectionChange('api_marketplace')}
          />
          
          <CategoryCard
            title="Webhooks"
            description="Configure real-time event notifications"
            count={categoryStats.webhook}
            icon={Webhook}
            color="text-green-600 bg-green-100"
            onClick={() => onSectionChange('webhooks')}
          />
          
          <CategoryCard
            title="Enterprise Systems"
            description="SAP, Oracle, Microsoft Dynamics"
            count={categoryStats.enterprise}
            icon={Building2}
            color="text-purple-600 bg-purple-100"
            onClick={() => onSectionChange('enterprise')}
          />
          
          <CategoryCard
            title="Patent Offices"
            description="USPTO, EPO, WIPO direct filing"
            count={categoryStats.patent_office}
            icon={FileText}
            color="text-orange-600 bg-orange-100"
            onClick={() => onSectionChange('patent_offices')}
          />
          
          <CategoryCard
            title="Third-Party Services"
            description="Slack, Teams, Google, Dropbox"
            count={categoryStats.third_party}
            icon={Link}
            color="text-indigo-600 bg-indigo-100"
            onClick={() => onSectionChange('third_party')}
          />
          
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">More Coming Soon</h4>
            <p className="text-gray-500 text-sm">
              Additional integration categories will be added
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="bg-white rounded-lg shadow-sm">
          {integrations.length > 0 ? (
            <div className="divide-y">
              {integrations.slice(0, 5).map((integration, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{integration.name}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {integration.category.replace('_', ' ')} • {integration.provider}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      integration.status === 'active' 
                        ? 'text-green-600 bg-green-100'
                        : integration.status === 'error'
                          ? 'text-red-600 bg-red-100'
                          : 'text-gray-600 bg-gray-100'
                    }`}>
                      {integration.status}
                    </span>
                    <p className="text-sm text-gray-500">
                      {new Date(integration.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No integrations configured yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Get started by connecting your first service
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard: React.FC<{
  title: string;
  description: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
  onClick: () => void;
}> = ({ title, description, count, icon: Icon, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-2xl font-bold text-gray-900">{count}</span>
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-center text-blue-600 group-hover:text-blue-700">
        <span className="text-sm font-medium">Manage</span>
        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};

export default IntegrationsHub;