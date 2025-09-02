export interface Organization {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  tier: 'basic' | 'professional' | 'enterprise' | 'ultimate';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  settings: OrganizationSettings;
  billing: BillingInfo;
  parentId?: string;
  children?: Organization[];
}

export interface OrganizationSettings {
  allowPublicSignup: boolean;
  requireEmailVerification: boolean;
  enableSSO: boolean;
  defaultRole: string;
  sessionTimeout: number;
  dataRetentionDays: number;
  allowGuestAccess: boolean;
  enableAuditLogging: boolean;
  complianceMode: 'none' | 'gdpr' | 'hipaa' | 'sox' | 'iso27001';
}

export interface BillingInfo {
  subscriptionId: string;
  plan: string;
  status: 'active' | 'suspended' | 'cancelled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  seats: number;
  usedSeats: number;
  monthlySpend: number;
  annualSpend: number;
  paymentMethod?: PaymentMethod;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'invoice';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  parentId?: string;
  managerId: string;
  budget?: number;
  headcount: number;
  createdAt: string;
  isActive: boolean;
  permissions: DepartmentPermissions;
}

export interface DepartmentPermissions {
  canCreateProjects: boolean;
  canManageUsers: boolean;
  canAccessReports: boolean;
  canExportData: boolean;
  maxProjectCount?: number;
  allowedFeatures: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  permissions: Permission[];
  isSystemRole: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'in' | 'contains' | 'startsWith';
  value: any;
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  location?: GeoLocation;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data' | 'system' | 'compliance';
  outcome: 'success' | 'failure' | 'partial';
  sessionId?: string;
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  coordinates?: [number, number];
}

export interface AuditFilter {
  dateRange: DateRange;
  users?: string[];
  actions?: string[];
  resources?: string[];
  severity?: string[];
  categories?: string[];
  outcomes?: string[];
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oauth' | 'oidc';
  status: 'active' | 'inactive' | 'pending';
  organizationId: string;
  config: SSOConfig;
  userCount: number;
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SSOConfig {
  entityId?: string;
  ssoUrl?: string;
  x509Certificate?: string;
  clientId?: string;
  clientSecret?: string;
  authUrl?: string;
  tokenUrl?: string;
  userInfoUrl?: string;
  scope?: string[];
  attributeMapping: AttributeMapping;
  autoProvisioning: boolean;
  defaultRole?: string;
  groupMapping?: GroupMapping[];
}

export interface AttributeMapping {
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  groups?: string;
}

export interface GroupMapping {
  ssoGroup: string;
  internalRole: string;
  department?: string;
}

export interface CompliancePolicy {
  id: string;
  name: string;
  type: 'gdpr' | 'hipaa' | 'sox' | 'iso27001' | 'ccpa' | 'custom';
  status: 'active' | 'draft' | 'archived';
  organizationId: string;
  description: string;
  requirements: ComplianceRequirement[];
  controls: ComplianceControl[];
  assessmentScore?: number;
  lastAssessment?: string;
  nextReview: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable';
  evidence?: Evidence[];
  lastReviewed?: string;
  nextReview: string;
  assignee?: string;
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective';
  automationLevel: 'manual' | 'semi-automated' | 'automated';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  status: 'effective' | 'partial' | 'ineffective';
  lastTested?: string;
  nextTest: string;
  owner: string;
  evidence?: Evidence[];
}

export interface Evidence {
  id: string;
  name: string;
  type: 'document' | 'screenshot' | 'log' | 'certificate' | 'attestation';
  url?: string;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  expiresAt?: string;
}

export interface DataRetentionPolicy {
  id: string;
  name: string;
  organizationId: string;
  dataType: string;
  retentionPeriod: number;
  retentionUnit: 'days' | 'months' | 'years';
  archiveAfter?: number;
  deleteAfter?: number;
  legalHold: boolean;
  justification: string;
  approvedBy: string;
  effectiveDate: string;
  lastReviewed: string;
  nextReview: string;
  isActive: boolean;
}

export interface ExportControl {
  id: string;
  organizationId: string;
  controlType: 'itar' | 'ear' | 'ofac' | 'custom';
  jurisdiction: string[];
  description: string;
  affectedData: string[];
  restrictions: string[];
  approvalRequired: boolean;
  approvers: string[];
  exemptions?: ExportExemption[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExportExemption {
  id: string;
  type: string;
  description: string;
  countries: string[];
  validUntil?: string;
  approvedBy: string;
  approvedAt: string;
}

export interface ComplianceReport {
  id: string;
  name: string;
  type: 'assessment' | 'audit' | 'certification' | 'incident';
  organizationId: string;
  policies: string[];
  period: DateRange;
  overallScore: number;
  findings: ComplianceFinding[];
  recommendations: string[];
  generatedBy: string;
  generatedAt: string;
  status: 'draft' | 'final' | 'submitted';
  dueDate?: string;
  submittedTo?: string;
}

export interface ComplianceFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  evidence: string[];
  remediation: string;
  timeline: string;
  assignee?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'accepted-risk';
}

export interface EnterpriseMetrics {
  organizations: {
    total: number;
    active: number;
    byTier: Record<string, number>;
    byIndustry: Record<string, number>;
  };
  users: {
    total: number;
    active: number;
    ssoEnabled: number;
    mfaEnabled: number;
  };
  security: {
    auditEvents: number;
    securityIncidents: number;
    failedLogins: number;
    suspiciousActivity: number;
  };
  compliance: {
    policiesActive: number;
    overallScore: number;
    criticalFindings: number;
    overdueReviews: number;
  };
}