import { useState } from 'react';
import {
  Building2,
  Users,
  Shield,
  Settings,
  CreditCard,
  Plus,
  Edit3,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Download,
  ChevronDown,
  ChevronRight,
  Building
} from 'lucide-react';
import { Organization, Department, Role } from '@/types/enterprise';

interface OrganizationManagerProps {
  onNavigate?: (section: string) => void;
}

export default function OrganizationManager({ onNavigate: _onNavigate }: OrganizationManagerProps) {
  const [selectedTab, setSelectedTab] = useState('organizations');
  const [_selectedOrg, _setSelectedOrg] = useState<string | null>(null);
  const [_showAddModal, _setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());

  // Mock data for demonstration
  const organizations: Organization[] = [
    {
      id: '1',
      name: 'TechCorp Industries',
      domain: 'techcorp.com',
      industry: 'Technology',
      size: 'enterprise',
      tier: 'ultimate',
      createdAt: '2023-01-15',
      updatedAt: '2024-01-15',
      isActive: true,
      settings: {
        allowPublicSignup: false,
        requireEmailVerification: true,
        enableSSO: true,
        defaultRole: 'user',
        sessionTimeout: 8,
        dataRetentionDays: 2555,
        allowGuestAccess: false,
        enableAuditLogging: true,
        complianceMode: 'iso27001'
      },
      billing: {
        subscriptionId: 'sub_123',
        plan: 'Enterprise Ultimate',
        status: 'active',
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-12-31',
        seats: 500,
        usedSeats: 342,
        monthlySpend: 15000,
        annualSpend: 180000
      }
    },
    {
      id: '2',
      name: 'Innovation Labs',
      domain: 'innovlabs.com',
      industry: 'Research',
      size: 'medium',
      tier: 'professional',
      createdAt: '2023-03-20',
      updatedAt: '2024-01-10',
      isActive: true,
      settings: {
        allowPublicSignup: true,
        requireEmailVerification: true,
        enableSSO: false,
        defaultRole: 'researcher',
        sessionTimeout: 4,
        dataRetentionDays: 1825,
        allowGuestAccess: true,
        enableAuditLogging: false,
        complianceMode: 'gdpr'
      },
      billing: {
        subscriptionId: 'sub_456',
        plan: 'Professional',
        status: 'active',
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-12-31',
        seats: 50,
        usedSeats: 28,
        monthlySpend: 2500,
        annualSpend: 30000
      }
    }
  ];

  const departments: Department[] = [
    {
      id: '1',
      name: 'Research & Development',
      description: 'Core innovation and product development',
      organizationId: '1',
      managerId: 'user_1',
      budget: 2000000,
      headcount: 45,
      createdAt: '2023-01-15',
      isActive: true,
      permissions: {
        canCreateProjects: true,
        canManageUsers: false,
        canAccessReports: true,
        canExportData: true,
        maxProjectCount: 20,
        allowedFeatures: ['patents', 'analysis', 'collaboration']
      }
    },
    {
      id: '2',
      name: 'Intellectual Property',
      description: 'Patent portfolio management and strategy',
      organizationId: '1',
      managerId: 'user_2',
      budget: 500000,
      headcount: 12,
      createdAt: '2023-01-15',
      isActive: true,
      permissions: {
        canCreateProjects: true,
        canManageUsers: true,
        canAccessReports: true,
        canExportData: true,
        allowedFeatures: ['patents', 'legal', 'portfolio']
      }
    }
  ];

  const roles: Role[] = [
    {
      id: '1',
      name: 'Organization Admin',
      description: 'Full administrative access to organization',
      organizationId: '1',
      permissions: [
        { id: '1', resource: 'organization', action: 'manage' },
        { id: '2', resource: 'users', action: 'manage' },
        { id: '3', resource: 'billing', action: 'manage' }
      ],
      isSystemRole: true,
      userCount: 5,
      createdAt: '2023-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Project Manager',
      description: 'Manage projects and team collaboration',
      organizationId: '1',
      permissions: [
        { id: '4', resource: 'projects', action: 'manage' },
        { id: '5', resource: 'reports', action: 'read' },
        { id: '6', resource: 'users', action: 'read' }
      ],
      isSystemRole: false,
      userCount: 25,
      createdAt: '2023-02-01',
      updatedAt: '2024-01-10'
    }
  ];

  const toggleOrgExpansion = (orgId: string) => {
    const newExpanded = new Set(expandedOrgs);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedOrgs(newExpanded);
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'past_due': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'enterprise': return <Building2 className="w-4 h-4" />;
      case 'large': return <Building className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const renderOrganizationsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Organizations</h3>
          <p className="text-sm text-gray-600">Manage multi-tenant organizations and hierarchies</p>
        </div>
        <button
          onClick={() => _setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Organization
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Organizations List */}
      <div className="space-y-4">
        {organizations.map((org) => (
          <div key={org.id} className="border border-gray-200 rounded-lg">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleOrgExpansion(org.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedOrgs.has(org.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {getSizeIcon(org.size)}
                  <div>
                    <h4 className="font-semibold text-gray-900">{org.name}</h4>
                    <p className="text-sm text-gray-600">{org.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBillingStatusColor(org.billing.status)}`}>
                      {org.billing.status}
                    </span>
                    <span className="text-sm text-gray-600">{org.tier}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {expandedOrgs.has(org.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Billing Info */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Billing
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan:</span>
                          <span className="font-medium">{org.billing.plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seats:</span>
                          <span className="font-medium">{org.billing.usedSeats}/{org.billing.seats}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly:</span>
                          <span className="font-medium">${org.billing.monthlySpend.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">SSO Enabled:</span>
                          {org.settings.enableSSO ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Audit Logging:</span>
                          {org.settings.enableAuditLogging ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Compliance:</span>
                          <span className="font-medium uppercase">{org.settings.complianceMode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Usage
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Utilization:</span>
                          <span className="font-medium">{Math.round((org.billing.usedSeats / org.billing.seats) * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{new Date(org.createdAt).getFullYear()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Industry:</span>
                          <span className="font-medium">{org.industry}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDepartmentsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Departments</h3>
          <p className="text-sm text-gray-600">Manage organizational departments and teams</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                  <p className="text-sm text-gray-600">{dept.description}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Headcount:</span>
                <span className="font-medium">{dept.headcount} employees</span>
              </div>
              {dept.budget && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Budget:</span>
                  <span className="font-medium">${dept.budget.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Projects:</span>
                <span className="font-medium">{dept.permissions.maxProjectCount || 'Unlimited'}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Permissions</h5>
              <div className="flex flex-wrap gap-2">
                {dept.permissions.canCreateProjects && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Create Projects</span>
                )}
                {dept.permissions.canAccessReports && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Access Reports</span>
                )}
                {dept.permissions.canExportData && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Export Data</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRolesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Roles & Permissions</h3>
          <p className="text-sm text-gray-600">Manage role-based access control (RBAC)</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{role.name}</h4>
                    {role.isSystemRole && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">System Role</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{role.userCount} users</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-900">Permissions</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {role.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      {permission.action} {permission.resource}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <span>Created {new Date(role.createdAt).toLocaleDateString()}</span>
              <span>Updated {new Date(role.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Billing Overview</h3>
          <p className="text-sm text-gray-600">Monitor subscription and usage across all organizations</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Monthly Revenue</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">$17,500</div>
          <div className="text-sm text-green-600">+12% from last month</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Active Organizations</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{organizations.length}</div>
          <div className="text-sm text-blue-600">All organizations active</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Total Seats</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">550</div>
          <div className="text-sm text-purple-600">370 seats used (67%)</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Growth Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">15%</div>
          <div className="text-sm text-orange-600">Month over month</div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Organization Billing Details</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizations.map((org) => (
                <tr key={org.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{org.name}</div>
                        <div className="text-sm text-gray-500">{org.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{org.billing.plan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBillingStatusColor(org.billing.status)}`}>
                      {org.billing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {org.billing.usedSeats} / {org.billing.seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${org.billing.monthlySpend.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'departments', label: 'Departments', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Organization Manager</h1>
        <p className="text-gray-600">Comprehensive multi-tenant organization management and RBAC</p>
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
      {selectedTab === 'organizations' && renderOrganizationsTab()}
      {selectedTab === 'departments' && renderDepartmentsTab()}
      {selectedTab === 'roles' && renderRolesTab()}
      {selectedTab === 'billing' && renderBillingTab()}
    </div>
  );
}