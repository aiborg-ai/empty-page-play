import { useState } from 'react';
import {
  Building2,
  Shield,
  Activity,
  FileText,
  Users,
  Settings,
  BarChart3,
  AlertTriangle,
  Clock,
  Award,
  UserCheck,
  Bell,
  Download,
  RefreshCw,
  ChevronRight,
  Star,
  Zap,
  Eye
} from 'lucide-react';
import { EnterpriseMetrics } from '@/types/enterprise';

interface EnterpriseHubProps {
  onNavigate?: (section: string) => void;
}

export default function EnterpriseHub({ onNavigate }: EnterpriseHubProps) {
  const [_selectedQuickAction, _setSelectedQuickAction] = useState<string | null>(null);

  // Mock enterprise metrics
  const enterpriseMetrics: EnterpriseMetrics = {
    organizations: {
      total: 12,
      active: 11,
      byTier: {
        'enterprise': 5,
        'professional': 4,
        'basic': 3
      },
      byIndustry: {
        'Technology': 5,
        'Healthcare': 3,
        'Finance': 2,
        'Manufacturing': 2
      }
    },
    users: {
      total: 1247,
      active: 1089,
      ssoEnabled: 856,
      mfaEnabled: 1156
    },
    security: {
      auditEvents: 15847,
      securityIncidents: 3,
      failedLogins: 127,
      suspiciousActivity: 8
    },
    compliance: {
      policiesActive: 15,
      overallScore: 89,
      criticalFindings: 2,
      overdueReviews: 7
    }
  };

  // Navigation items for enterprise features
  const enterpriseFeatures = [
    {
      id: 'organizations',
      title: 'Organization Manager',
      description: 'Multi-tenant organization management, RBAC, and billing',
      icon: Building2,
      color: 'blue',
      metrics: [
        { label: 'Organizations', value: enterpriseMetrics.organizations.total },
        { label: 'Active', value: enterpriseMetrics.organizations.active },
        { label: 'Users', value: enterpriseMetrics.users.total }
      ]
    },
    {
      id: 'audit',
      title: 'Audit Log System',
      description: 'Comprehensive audit trail and security monitoring',
      icon: Activity,
      color: 'purple',
      metrics: [
        { label: 'Events Today', value: 847 },
        { label: 'Security Incidents', value: enterpriseMetrics.security.securityIncidents },
        { label: 'Failed Logins', value: enterpriseMetrics.security.failedLogins }
      ]
    },
    {
      id: 'sso',
      title: 'Enterprise SSO',
      description: 'Single Sign-On providers and identity management',
      icon: Shield,
      color: 'green',
      metrics: [
        { label: 'SSO Users', value: enterpriseMetrics.users.ssoEnabled },
        { label: 'MFA Enabled', value: Math.round((enterpriseMetrics.users.mfaEnabled / enterpriseMetrics.users.total) * 100) + '%' },
        { label: 'Providers', value: 3 }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance Center',
      description: 'Regulatory compliance and policy management',
      icon: FileText,
      color: 'orange',
      metrics: [
        { label: 'Compliance Score', value: enterpriseMetrics.compliance.overallScore + '%' },
        { label: 'Active Policies', value: enterpriseMetrics.compliance.policiesActive },
        { label: 'Critical Findings', value: enterpriseMetrics.compliance.criticalFindings }
      ]
    }
  ];

  // Quick actions
  const quickActions = [
    {
      id: 'add-org',
      title: 'Add Organization',
      description: 'Create new organization tenant',
      icon: Building2,
      action: () => onNavigate?.('organizations')
    },
    {
      id: 'review-audit',
      title: 'Review Security Events',
      description: 'Check recent security incidents',
      icon: AlertTriangle,
      action: () => onNavigate?.('audit')
    },
    {
      id: 'configure-sso',
      title: 'Configure SSO',
      description: 'Set up identity providers',
      icon: Shield,
      action: () => onNavigate?.('sso')
    },
    {
      id: 'generate-report',
      title: 'Generate Compliance Report',
      description: 'Create compliance assessment',
      icon: FileText,
      action: () => onNavigate?.('compliance')
    }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'organization',
      title: 'New organization added',
      description: 'TechStart Inc. joined the platform',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: Building2,
      color: 'blue'
    },
    {
      id: '2',
      type: 'security',
      title: 'Security incident resolved',
      description: 'Failed login attempts from suspicious IP',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      icon: Shield,
      color: 'red'
    },
    {
      id: '3',
      type: 'compliance',
      title: 'GDPR assessment completed',
      description: '89% compliance score achieved',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      icon: Award,
      color: 'green'
    },
    {
      id: '4',
      type: 'audit',
      title: 'Bulk data export detected',
      description: 'User exported 15,000 patent records',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      icon: Download,
      color: 'yellow'
    },
    {
      id: '5',
      type: 'sso',
      title: 'SSO provider configured',
      description: 'Microsoft Azure AD integration active',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      icon: UserCheck,
      color: 'purple'
    }
  ];

  // System health indicators
  const systemHealth = [
    {
      name: 'Authentication Service',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '142ms'
    },
    {
      name: 'Audit Logging',
      status: 'healthy',
      uptime: '99.8%',
      responseTime: '89ms'
    },
    {
      name: 'Compliance Engine',
      status: 'warning',
      uptime: '98.5%',
      responseTime: '234ms'
    },
    {
      name: 'SSO Gateway',
      status: 'healthy',
      uptime: '99.7%',
      responseTime: '76ms'
    }
  ];

  const getColorClass = (color: string, type: 'bg' | 'text' | 'border' = 'bg') => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' }
    };
    return colorMap[color as keyof typeof colorMap]?.[type] || colorMap.blue[type];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Hub</h1>
        <p className="text-gray-600">Centralized management for enterprise features, security, and compliance</p>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Organizations</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{enterpriseMetrics.organizations.total}</div>
          <div className="text-sm text-blue-600">{enterpriseMetrics.organizations.active} active</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Platform Users</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{enterpriseMetrics.users.total.toLocaleString()}</div>
          <div className="text-sm text-green-600">{Math.round((enterpriseMetrics.users.active / enterpriseMetrics.users.total) * 100)}% active</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Security Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">94%</div>
          <div className="text-sm text-purple-600">{enterpriseMetrics.security.securityIncidents} incidents this month</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Compliance Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{enterpriseMetrics.compliance.overallScore}%</div>
          <div className="text-sm text-orange-600">{enterpriseMetrics.compliance.criticalFindings} critical findings</div>
        </div>
      </div>

      {/* Enterprise Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {enterpriseFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate?.(feature.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${getColorClass(feature.color)} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${getColorClass(feature.color, 'text')}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {feature.metrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-xs text-gray-500">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{action.title}</div>
                    <div className="text-sm text-gray-600">{action.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.slice(0, 5).map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 ${getColorClass(activity.color)} rounded-lg mt-1`}>
                    <Icon className={`w-3 h-3 ${getColorClass(activity.color, 'text')}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{activity.title}</div>
                    <div className="text-sm text-gray-600">{activity.description}</div>
                    <div className="text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Health and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            System Health
          </h3>
          <div className="space-y-4">
            {systemHealth.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'healthy' ? 'bg-green-500' :
                    service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{service.name}</div>
                    <div className="text-xs text-gray-500">Uptime: {service.uptime}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">{service.responseTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Alerts */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            Security Alerts
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
              <div className="flex-1">
                <div className="font-medium text-red-900 text-sm">Critical Compliance Finding</div>
                <div className="text-sm text-red-700">SOX financial controls review overdue</div>
                <div className="text-xs text-red-600 mt-1">Due: March 1, 2024</div>
              </div>
              <button className="text-red-600 hover:text-red-700">
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-600 mt-1" />
              <div className="flex-1">
                <div className="font-medium text-yellow-900 text-sm">Suspicious Login Activity</div>
                <div className="text-sm text-yellow-700">Multiple failed login attempts from new location</div>
                <div className="text-xs text-yellow-600 mt-1">IP: 203.0.113.195 (Toronto, CA)</div>
              </div>
              <button className="text-yellow-600 hover:text-yellow-700">
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Star className="w-4 h-4 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="font-medium text-blue-900 text-sm">Certificate Renewal</div>
                <div className="text-sm text-blue-700">SSL certificate expires in 30 days</div>
                <div className="text-xs text-blue-600 mt-1">Domain: api.innospot.com</div>
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Features Bottom Actions */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Enterprise Administration</h3>
            <p className="text-sm text-gray-600">Comprehensive platform management and monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-white flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}