import { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  Download,
  User,
  Globe,
  Lock,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreHorizontal,
  RefreshCw,
  FileText,
  Activity,
  MapPin,
  Smartphone,
  Monitor,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { AuditLogEntry, AuditFilter } from '@/types/enterprise';

interface AuditLogProps {
  onNavigate?: (section: string) => void;
}

export default function AuditLog({ onNavigate: _onNavigate }: AuditLogProps) {
  const [selectedTab, setSelectedTab] = useState('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [_selectedEntry, _setSelectedEntry] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<AuditFilter>({
    dateRange: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    users: [],
    actions: [],
    resources: [],
    severity: [],
    categories: [],
    outcomes: []
  });

  // Mock audit log data
  const auditLogs: AuditLogEntry[] = [
    {
      id: '1',
      organizationId: 'org_1',
      userId: 'user_123',
      userName: 'John Smith',
      userEmail: 'john.smith@techcorp.com',
      action: 'user.login',
      resource: 'authentication',
      resourceId: 'session_456',
      details: {
        method: 'sso',
        provider: 'microsoft',
        mfaUsed: true,
        deviceFingerprint: 'fp_789'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: {
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
        coordinates: [37.7749, -122.4194]
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      severity: 'low',
      category: 'authentication',
      outcome: 'success',
      sessionId: 'sess_789'
    },
    {
      id: '2',
      organizationId: 'org_1',
      userId: 'user_456',
      userName: 'Sarah Connor',
      userEmail: 'sarah.connor@techcorp.com',
      action: 'document.export',
      resource: 'patent_document',
      resourceId: 'doc_123',
      details: {
        documentTitle: 'Advanced AI Patent Application',
        format: 'pdf',
        sensitivity: 'confidential',
        exportReason: 'legal review'
      },
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
      location: {
        country: 'United States',
        region: 'New York',
        city: 'New York',
        coordinates: [40.7128, -74.0060]
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      severity: 'medium',
      category: 'data',
      outcome: 'success',
      sessionId: 'sess_890'
    },
    {
      id: '3',
      organizationId: 'org_1',
      userId: 'user_789',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@techcorp.com',
      action: 'user.permission_denied',
      resource: 'admin_panel',
      details: {
        attemptedAction: 'delete_user',
        reason: 'insufficient_permissions',
        requiredRole: 'admin'
      },
      ipAddress: '203.0.113.195',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      location: {
        country: 'Canada',
        region: 'Ontario',
        city: 'Toronto'
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      severity: 'high',
      category: 'authorization',
      outcome: 'failure',
      sessionId: 'sess_123'
    },
    {
      id: '4',
      organizationId: 'org_1',
      userId: 'system',
      userName: 'System',
      userEmail: 'system@techcorp.com',
      action: 'system.backup_completed',
      resource: 'database',
      resourceId: 'backup_456',
      details: {
        backupType: 'full',
        size: '2.5GB',
        duration: '45 minutes',
        location: 's3://backups/prod'
      },
      ipAddress: '127.0.0.1',
      userAgent: 'System/1.0',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      severity: 'low',
      category: 'system',
      outcome: 'success'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failure': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Lock className="w-4 h-4" />;
      case 'authorization': return <Shield className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'compliance': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const toggleEntryExpansion = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const renderLogsTab = () => (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
          <p className="text-sm text-gray-600">Real-time activity monitoring and compliance tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.dateRange.startDate}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, startDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.dateRange.endDate}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, endDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">All Categories</option>
                  <option value="authentication">Authentication</option>
                  <option value="authorization">Authorization</option>
                  <option value="data">Data</option>
                  <option value="system">System</option>
                  <option value="compliance">Compliance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">All Outcomes</option>
                  <option value="success">Success</option>
                  <option value="failure">Failure</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audit Logs List */}
      <div className="space-y-2">
        {auditLogs.map((entry) => (
          <div key={entry.id} className="border border-gray-200 rounded-lg bg-white">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 mt-1">
                    {getOutcomeIcon(entry.outcome)}
                    {getCategoryIcon(entry.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-gray-900">{entry.action}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(entry.severity)}`}>
                        {entry.severity}
                      </span>
                      <span className="text-sm text-gray-500">{entry.resource}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {entry.userName} ({entry.userEmail})
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {entry.ipAddress}
                      </div>
                      {entry.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {entry.location.city}, {entry.location.region}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(entry.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getDeviceIcon(entry.userAgent)}
                  <button
                    onClick={() => toggleEntryExpansion(entry.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedEntries.has(entry.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedEntries.has(entry.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Details */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Event Details</h5>
                      <div className="space-y-2 text-sm">
                        {Object.entries(entry.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-medium text-gray-900">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Metadata</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Session ID:</span>
                          <span className="font-mono text-xs text-gray-900">{entry.sessionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">User Agent:</span>
                          <span className="font-mono text-xs text-gray-900 truncate max-w-48">
                            {entry.userAgent.split(' ')[0]}...
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Timestamp:</span>
                          <span className="font-mono text-xs text-gray-900">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {entry.resourceId && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Resource ID:</span>
                            <span className="font-mono text-xs text-gray-900">{entry.resourceId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      View Full Details
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Related Events
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Audit Analytics</h3>
        <p className="text-sm text-gray-600">Security insights and compliance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Events</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">12,847</div>
          <div className="text-sm text-blue-600">+15% from last week</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Security Events</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">23</div>
          <div className="text-sm text-red-600">3 high severity</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Active Users</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">342</div>
          <div className="text-sm text-green-600">98% with MFA</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Compliance Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">94%</div>
          <div className="text-sm text-purple-600">ISO 27001 compliant</div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Event Timeline</h4>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <TrendingUp className="w-12 h-12 mb-2" />
            <p>Event timeline chart would be displayed here</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Security Incidents</h4>
            <AlertTriangle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <Shield className="w-12 h-12 mb-2" />
            <p>Security incidents chart would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Compliance Reports</h3>
          <p className="text-sm text-gray-600">Generate and manage compliance reports</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            name: 'GDPR Compliance Report',
            description: 'Data protection and privacy compliance',
            lastGenerated: '2024-01-10',
            frequency: 'Monthly'
          },
          {
            name: 'SOX Compliance Report',
            description: 'Financial controls and access audit',
            lastGenerated: '2024-01-05',
            frequency: 'Quarterly'
          },
          {
            name: 'ISO 27001 Report',
            description: 'Information security management',
            lastGenerated: '2024-01-08',
            frequency: 'Quarterly'
          }
        ].map((template, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Generated:</span>
                <span className="font-medium">{template.lastGenerated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frequency:</span>
                <span className="font-medium">{template.frequency}</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100">
              Generate Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'logs', label: 'Audit Logs', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit Log System</h1>
        <p className="text-gray-600">Comprehensive audit trail and compliance monitoring</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'logs' && renderLogsTab()}
      {selectedTab === 'analytics' && renderAnalyticsTab()}
      {selectedTab === 'reports' && renderReportsTab()}
    </div>
  );
}