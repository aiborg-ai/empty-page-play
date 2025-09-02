import { useState } from 'react';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Download,
  Plus,
  Edit3,
  Eye,
  Calendar,
  BarChart3,
  Award,
  Lock,
  Database,
  Scale,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Target,
  Flag,
  XCircle
} from 'lucide-react';
import {
  CompliancePolicy,
  ComplianceReport,
  DataRetentionPolicy,
  ExportControl
} from '@/types/enterprise';

interface ComplianceCenterProps {
  onNavigate?: (section: string) => void;
}

export default function ComplianceCenter({ onNavigate: _onNavigate }: ComplianceCenterProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [_selectedPolicy, _setSelectedPolicy] = useState<string | null>(null);
  const [_showAddModal, setShowAddModal] = useState(false);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set());

  // Mock data for demonstration
  const compliancePolicies: CompliancePolicy[] = [
    {
      id: '1',
      name: 'GDPR Data Protection Policy',
      type: 'gdpr',
      status: 'active',
      organizationId: 'org_1',
      description: 'Comprehensive GDPR compliance framework for data protection and privacy',
      requirements: [
        {
          id: '1',
          title: 'Data Processing Lawfulness',
          description: 'Ensure all data processing has lawful basis',
          category: 'Data Processing',
          priority: 'high',
          status: 'compliant',
          lastReviewed: '2024-01-10',
          nextReview: '2024-04-10',
          assignee: 'Privacy Officer'
        },
        {
          id: '2',
          title: 'Data Subject Rights',
          description: 'Implement mechanisms for data subject requests',
          category: 'Rights Management',
          priority: 'critical',
          status: 'compliant',
          lastReviewed: '2024-01-08',
          nextReview: '2024-04-08',
          assignee: 'Legal Team'
        },
        {
          id: '3',
          title: 'Breach Notification',
          description: 'Process for reporting breaches within 72 hours',
          category: 'Incident Response',
          priority: 'critical',
          status: 'partial',
          lastReviewed: '2024-01-05',
          nextReview: '2024-04-05',
          assignee: 'Security Team'
        }
      ],
      controls: [
        {
          id: '1',
          name: 'Data Encryption',
          description: 'All personal data encrypted at rest and in transit',
          type: 'preventive',
          automationLevel: 'automated',
          frequency: 'continuous',
          status: 'effective',
          lastTested: '2024-01-10',
          nextTest: '2024-02-10',
          owner: 'IT Security'
        }
      ],
      assessmentScore: 85,
      lastAssessment: '2024-01-15',
      nextReview: '2024-04-15',
      owner: 'Privacy Officer',
      createdAt: '2023-05-25',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'ISO 27001 Information Security',
      type: 'iso27001',
      status: 'active',
      organizationId: 'org_1',
      description: 'Information Security Management System based on ISO 27001 standard',
      requirements: [
        {
          id: '4',
          title: 'Risk Assessment',
          description: 'Regular information security risk assessments',
          category: 'Risk Management',
          priority: 'high',
          status: 'compliant',
          lastReviewed: '2024-01-12',
          nextReview: '2024-07-12',
          assignee: 'CISO'
        },
        {
          id: '5',
          title: 'Access Control',
          description: 'Role-based access control implementation',
          category: 'Access Management',
          priority: 'critical',
          status: 'compliant',
          lastReviewed: '2024-01-14',
          nextReview: '2024-04-14',
          assignee: 'IT Admin'
        }
      ],
      controls: [
        {
          id: '2',
          name: 'Multi-Factor Authentication',
          description: 'MFA required for all system access',
          type: 'preventive',
          automationLevel: 'automated',
          frequency: 'continuous',
          status: 'effective',
          lastTested: '2024-01-12',
          nextTest: '2024-02-12',
          owner: 'IT Security'
        }
      ],
      assessmentScore: 92,
      lastAssessment: '2024-01-12',
      nextReview: '2024-07-12',
      owner: 'CISO',
      createdAt: '2023-03-15',
      updatedAt: '2024-01-12'
    },
    {
      id: '3',
      name: 'SOX Financial Controls',
      type: 'sox',
      status: 'draft',
      organizationId: 'org_1',
      description: 'Sarbanes-Oxley Act compliance for financial reporting controls',
      requirements: [
        {
          id: '6',
          title: 'Financial Reporting Controls',
          description: 'Internal controls over financial reporting',
          category: 'Financial Controls',
          priority: 'critical',
          status: 'non-compliant',
          nextReview: '2024-03-01',
          assignee: 'CFO'
        }
      ],
      controls: [],
      nextReview: '2024-03-01',
      owner: 'CFO',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    }
  ];

  const dataRetentionPolicies: DataRetentionPolicy[] = [
    {
      id: '1',
      name: 'Personal Data Retention',
      organizationId: 'org_1',
      dataType: 'Personal Information',
      retentionPeriod: 7,
      retentionUnit: 'years',
      archiveAfter: 3,
      deleteAfter: 7,
      legalHold: false,
      justification: 'Legal requirement under GDPR and business needs',
      approvedBy: 'Privacy Officer',
      effectiveDate: '2023-05-25',
      lastReviewed: '2024-01-15',
      nextReview: '2024-05-25',
      isActive: true
    },
    {
      id: '2',
      name: 'Financial Records Retention',
      organizationId: 'org_1',
      dataType: 'Financial Records',
      retentionPeriod: 10,
      retentionUnit: 'years',
      legalHold: false,
      justification: 'Regulatory requirement for financial records',
      approvedBy: 'CFO',
      effectiveDate: '2023-01-01',
      lastReviewed: '2024-01-01',
      nextReview: '2025-01-01',
      isActive: true
    }
  ];

  const exportControls: ExportControl[] = [
    {
      id: '1',
      organizationId: 'org_1',
      controlType: 'itar',
      jurisdiction: ['US'],
      description: 'ITAR controlled technology and technical data',
      affectedData: ['Technical Drawings', 'Engineering Specifications'],
      restrictions: ['Export license required', 'US persons only'],
      approvalRequired: true,
      approvers: ['Export Control Officer', 'Legal Counsel'],
      isActive: true,
      createdAt: '2023-06-01',
      updatedAt: '2024-01-10'
    }
  ];

  const complianceReports: ComplianceReport[] = [
    {
      id: '1',
      name: 'Q4 2023 GDPR Assessment',
      type: 'assessment',
      organizationId: 'org_1',
      policies: ['1'],
      period: {
        startDate: '2023-10-01',
        endDate: '2023-12-31'
      },
      overallScore: 85,
      findings: [
        {
          id: '1',
          severity: 'medium',
          category: 'Data Processing',
          title: 'Incomplete consent records',
          description: 'Some user consent records missing timestamps',
          evidence: ['audit_log_consent_2023.pdf'],
          remediation: 'Update consent logging system',
          timeline: '30 days',
          assignee: 'Development Team',
          status: 'in-progress'
        }
      ],
      recommendations: ['Enhance consent logging', 'Regular compliance training'],
      generatedBy: 'Compliance Officer',
      generatedAt: '2024-01-15',
      status: 'final'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'active':
      case 'effective':
        return 'text-green-600 bg-green-100';
      case 'partial':
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'non-compliant':
      case 'inactive':
      case 'ineffective':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <Flag className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low': return <Target className="w-4 h-4 text-blue-600" />;
      default: return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getComplianceIcon = (type: string) => {
    switch (type) {
      case 'gdpr': return <Shield className="w-4 h-4" />;
      case 'iso27001': return <Award className="w-4 h-4" />;
      case 'sox': return <Scale className="w-4 h-4" />;
      case 'hipaa': return <Lock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const togglePolicyExpansion = (policyId: string) => {
    const newExpanded = new Set(expandedPolicies);
    if (newExpanded.has(policyId)) {
      newExpanded.delete(policyId);
    } else {
      newExpanded.add(policyId);
    }
    setExpandedPolicies(newExpanded);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Overall Compliance</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">89%</div>
          <div className="text-sm text-green-600">+5% from last quarter</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Active Policies</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{compliancePolicies.filter(p => p.status === 'active').length}</div>
          <div className="text-sm text-blue-600">3 frameworks covered</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Critical Findings</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">2</div>
          <div className="text-sm text-red-600">Require immediate attention</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Due Reviews</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">7</div>
          <div className="text-sm text-orange-600">Next 30 days</div>
        </div>
      </div>

      {/* Compliance Status by Framework */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Compliance Status by Framework</h3>
        <div className="space-y-4">
          {compliancePolicies.filter(p => p.assessmentScore).map((policy) => (
            <div key={policy.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getComplianceIcon(policy.type)}
                <div>
                  <div className="font-medium text-gray-900">{policy.name}</div>
                  <div className="text-sm text-gray-500">{policy.requirements.length} requirements</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${policy.assessmentScore}%` }}
                  ></div>
                </div>
                <span className="font-medium text-gray-900 w-12 text-right">
                  {policy.assessmentScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">GDPR Assessment Completed</div>
                <div className="text-gray-500">85% compliance score achieved</div>
                <div className="text-xs text-gray-400">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-1" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">Control Review Due</div>
                <div className="text-gray-500">Multi-Factor Authentication control</div>
                <div className="text-xs text-gray-400">1 day ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-blue-600 mt-1" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">New Policy Draft</div>
                <div className="text-gray-500">SOX Financial Controls policy created</div>
                <div className="text-xs text-gray-400">3 days ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-red-600 mt-1" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">SOX Compliance Review</div>
                <div className="text-gray-500">Financial reporting controls assessment</div>
                <div className="text-xs text-red-600">Due March 1, 2024</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-yellow-600 mt-1" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">GDPR Review Cycle</div>
                <div className="text-gray-500">Quarterly compliance review</div>
                <div className="text-xs text-yellow-600">Due April 15, 2024</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-orange-600 mt-1" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">ISO 27001 Audit</div>
                <div className="text-gray-500">External certification audit</div>
                <div className="text-xs text-orange-600">Due July 12, 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPoliciesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Compliance Policies</h3>
          <p className="text-sm text-gray-600">Manage regulatory compliance frameworks and policies</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Policy
        </button>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {compliancePolicies.map((policy) => (
          <div key={policy.id} className="border border-gray-200 rounded-lg bg-white">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePolicyExpansion(policy.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedPolicies.has(policy.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getComplianceIcon(policy.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{policy.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                        {policy.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded uppercase">
                        {policy.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {policy.assessmentScore && (
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{policy.assessmentScore}%</div>
                      <div className="text-xs text-gray-500">compliance</div>
                    </div>
                  )}
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit3 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {expandedPolicies.has(policy.id) && (
                <div className="space-y-6 pt-4 border-t border-gray-200">
                  {/* Requirements */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Requirements ({policy.requirements.length})</h5>
                    <div className="space-y-3">
                      {policy.requirements.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {req.status === 'compliant' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : req.status === 'partial' ? (
                                <Clock className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{req.title}</div>
                              <div className="text-sm text-gray-600">{req.description}</div>
                              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                <span>Category: {req.category}</span>
                                {req.assignee && <span>Assignee: {req.assignee}</span>}
                                {req.nextReview && <span>Review: {new Date(req.nextReview).toLocaleDateString()}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(req.priority)}`}>
                              {req.priority}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(req.status)}`}>
                              {req.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  {policy.controls.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Controls ({policy.controls.length})</h5>
                      <div className="space-y-3">
                        {policy.controls.map((control) => (
                          <div key={control.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-3">
                              <Shield className="w-4 h-4 text-blue-600 mt-1" />
                              <div>
                                <div className="font-medium text-gray-900">{control.name}</div>
                                <div className="text-sm text-gray-600">{control.description}</div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                  <span>Type: {control.type}</span>
                                  <span>Owner: {control.owner}</span>
                                  <span>Frequency: {control.frequency}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(control.status)}`}>
                                {control.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <span>Owner: {policy.owner}</span>
                      <span>Created: {new Date(policy.createdAt).toLocaleDateString()}</span>
                      {policy.lastAssessment && (
                        <span>Last Assessment: {new Date(policy.lastAssessment).toLocaleDateString()}</span>
                      )}
                    </div>
                    {policy.nextReview && (
                      <span>Next Review: {new Date(policy.nextReview).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDataGovernanceTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Data Governance</h3>
          <p className="text-sm text-gray-600">Data retention policies and export controls</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Policy
        </button>
      </div>

      {/* Data Retention Policies */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Retention Policies
        </h4>
        <div className="space-y-4">
          {dataRetentionPolicies.map((policy) => (
            <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-medium text-gray-900">{policy.name}</h5>
                  <p className="text-sm text-gray-600">Data Type: {policy.dataType}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(policy.isActive ? 'active' : 'inactive')}`}>
                  {policy.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Retention Period:</span>
                  <div className="font-medium">{policy.retentionPeriod} {policy.retentionUnit}</div>
                </div>
                {policy.archiveAfter && (
                  <div>
                    <span className="text-gray-600">Archive After:</span>
                    <div className="font-medium">{policy.archiveAfter} years</div>
                  </div>
                )}
                {policy.deleteAfter && (
                  <div>
                    <span className="text-gray-600">Delete After:</span>
                    <div className="font-medium">{policy.deleteAfter} years</div>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                Approved by {policy.approvedBy} • Next review: {new Date(policy.nextReview).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Export Controls
        </h4>
        <div className="space-y-4">
          {exportControls.map((control) => (
            <div key={control.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-medium text-gray-900 uppercase">{control.controlType}</h5>
                  <p className="text-sm text-gray-600">{control.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(control.isActive ? 'active' : 'inactive')}`}>
                  {control.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Jurisdiction:</span>
                  <span className="ml-2 font-medium">{control.jurisdiction.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Affected Data:</span>
                  <span className="ml-2 font-medium">{control.affectedData.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Restrictions:</span>
                  <div className="ml-2 mt-1">
                    {control.restrictions.map((restriction, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded mr-2 mb-1">
                        {restriction}
                      </span>
                    ))}
                  </div>
                </div>
                {control.approvalRequired && (
                  <div>
                    <span className="text-gray-600">Approvers:</span>
                    <span className="ml-2 font-medium">{control.approvers?.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
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
          <p className="text-sm text-gray-600">Generate and manage compliance assessment reports</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {complianceReports.map((report) => (
          <div key={report.id} className="border border-gray-200 rounded-lg bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{report.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                      {report.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Period: {new Date(report.period.startDate).toLocaleDateString()} - {new Date(report.period.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{report.overallScore}%</div>
                <div className="text-xs text-gray-500">Overall Score</div>
              </div>
            </div>

            {/* Findings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Critical Findings</span>
                </div>
                <div className="text-xl font-bold text-red-900">
                  {report.findings.filter(f => f.severity === 'critical').length}
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Flag className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">High Priority</span>
                </div>
                <div className="text-xl font-bold text-yellow-900">
                  {report.findings.filter(f => f.severity === 'high').length}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Findings</span>
                </div>
                <div className="text-xl font-bold text-blue-900">{report.findings.length}</div>
              </div>
            </div>

            {/* Findings Details */}
            {report.findings.length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">Key Findings</h5>
                <div className="space-y-2">
                  {report.findings.slice(0, 3).map((finding) => (
                    <div key={finding.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {getSeverityIcon(finding.severity)}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{finding.title}</div>
                        <div className="text-sm text-gray-600">{finding.description}</div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>Category: {finding.category}</span>
                          <span>Timeline: {finding.timeline}</span>
                          {finding.assignee && <span>Assignee: {finding.assignee}</span>}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(finding.status)}`}>
                        {finding.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <span>Generated by {report.generatedBy}</span>
                <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'governance', label: 'Data Governance', icon: Database },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Compliance Center</h1>
        <p className="text-gray-600">Comprehensive regulatory compliance management and monitoring</p>
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
      {selectedTab === 'overview' && renderOverviewTab()}
      {selectedTab === 'policies' && renderPoliciesTab()}
      {selectedTab === 'governance' && renderDataGovernanceTab()}
      {selectedTab === 'reports' && renderReportsTab()}
    </div>
  );
}