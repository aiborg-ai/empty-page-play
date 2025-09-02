/**
 * Patent Office Integrations Component
 * Manages connections to global patent offices including USPTO, EPO, WIPO
 * Provides direct filing, status checking, and automated docketing
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Globe,
  DollarSign,
  Settings,
  Eye,
  Building
} from 'lucide-react';
import { integrationService } from '@/lib/integrationService';
import type { 
  PatentOfficeIntegration, 
  PatentOffice, 
  PatentStatus,
  PatentService,
  DocketingSettings 
} from '@/types/integrations';

interface PatentOfficeIntegrationsProps {
  userId: string;
}

export const PatentOfficeIntegrations: React.FC<PatentOfficeIntegrationsProps> = ({ userId }) => {
  const [integrations, setIntegrations] = useState<PatentOfficeIntegration[]>([]);
  const [_patentStatuses, _setPatentStatuses] = useState<PatentStatus[]>([]);
  const [_selectedIntegration, setSelectedIntegration] = useState<PatentOfficeIntegration | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const officeInfo = {
    uspto: {
      name: 'USPTO',
      fullName: 'United States Patent and Trademark Office',
      country: 'United States',
      flag: '🇺🇸',
      color: 'text-blue-600 bg-blue-100',
      services: ['filing', 'status_check', 'document_retrieval', 'fee_calculation', 'docketing']
    },
    epo: {
      name: 'EPO',
      fullName: 'European Patent Office',
      country: 'Europe',
      flag: '🇪🇺',
      color: 'text-green-600 bg-green-100',
      services: ['filing', 'status_check', 'document_retrieval', 'prior_art_search']
    },
    wipo: {
      name: 'WIPO',
      fullName: 'World Intellectual Property Organization',
      country: 'Global',
      flag: '🌍',
      color: 'text-purple-600 bg-purple-100',
      services: ['filing', 'status_check', 'classification', 'prior_art_search']
    },
    jpo: {
      name: 'JPO',
      fullName: 'Japan Patent Office',
      country: 'Japan',
      flag: '🇯🇵',
      color: 'text-red-600 bg-red-100',
      services: ['filing', 'status_check', 'document_retrieval']
    },
    kipo: {
      name: 'KIPO',
      fullName: 'Korean Intellectual Property Office',
      country: 'South Korea',
      flag: '🇰🇷',
      color: 'text-orange-600 bg-orange-100',
      services: ['filing', 'status_check', 'document_retrieval']
    },
    cnipa: {
      name: 'CNIPA',
      fullName: 'China National Intellectual Property Administration',
      country: 'China',
      flag: '🇨🇳',
      color: 'text-yellow-600 bg-yellow-100',
      services: ['filing', 'status_check', 'document_retrieval']
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const integrationsData = await integrationService.getIntegrationsByCategory(userId, 'patent_office');
      setIntegrations(integrationsData as PatentOfficeIntegration[]);
    } catch (err) {
      console.error('Error loading patent office integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntegration = async (integrationData: Omit<PatentOfficeIntegration, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newIntegration = await integrationService.createPatentOfficeIntegration(userId, integrationData);
      setIntegrations([newIntegration, ...integrations]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating patent office integration:', err);
    }
  };

  const handleSyncStatus = async (integrationId: string) => {
    try {
      await integrationService.syncPatentStatus(integrationId);
      // Refresh integrations to show updated sync time
      await loadIntegrations();
    } catch (err) {
      console.error('Error syncing patent status:', err);
    }
  };

  const mockPatentStatuses: PatentStatus[] = [
    {
      applicationNumber: 'US17/123,456',
      status: 'Under Examination',
      statusDate: '2024-01-15',
      nextAction: 'Respond to Office Action',
      nextActionDate: '2024-03-15',
      examiner: 'John Smith',
      attorney: 'Patent Law Firm LLC',
      fees: [
        {
          code: 'ISSUE_FEE',
          description: 'Issue Fee',
          amount: 1200,
          currency: 'USD',
          dueDate: '2024-03-01',
          paid: false
        }
      ],
      documents: [
        {
          id: 'doc_1',
          type: 'Office Action',
          description: 'Non-Final Office Action',
          filename: 'office_action_20240115.pdf',
          size: 256000,
          uploadDate: '2024-01-15',
          url: '#'
        }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patent Office Integrations</h1>
            <p className="text-gray-600">
              Connect to global patent offices for direct filing and status monitoring
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Integration
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.filter(i => i.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Connections</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockPatentStatuses.length}
              </p>
              <p className="text-sm text-gray-600">Monitored Applications</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockPatentStatuses.filter(p => p.nextActionDate && 
                  new Date(p.nextActionDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                ).length}
              </p>
              <p className="text-sm text-gray-600">Due This Month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${mockPatentStatuses.reduce((sum, p) => 
                  sum + p.fees.filter(f => !f.paid).reduce((feeSum, fee) => feeSum + fee.amount, 0), 0
                ).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Outstanding Fees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Patent Offices */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Patent Offices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(officeInfo).map(([office, info]) => {
            const isConnected = integrations.some(i => i.office === office);
            return (
              <div
                key={office}
                className={`bg-white p-6 rounded-lg shadow-sm border-2 hover:shadow-md transition-all cursor-pointer ${
                  isConnected ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200'
                }`}
                onClick={() => {
                  if (!isConnected) {
                    setShowCreateModal(true);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${info.color}`}>
                      <span className="text-2xl">{info.flag}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{info.name}</h3>
                      <p className="text-sm text-gray-500">{info.country}</p>
                    </div>
                  </div>
                  {isConnected && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{info.fullName}</p>

                <div className="flex flex-wrap gap-1">
                  {info.services.slice(0, 3).map(service => (
                    <span
                      key={service}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {service.replace('_', ' ')}
                    </span>
                  ))}
                  {info.services.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                      +{info.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected Integrations */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Integrations</h2>
            <button
              onClick={() => setShowStatusModal(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            >
              <Eye className="h-4 w-4" />
              View All Status
            </button>
          </div>
        </div>

        <div className="divide-y">
          {integrations.map((integration) => {
            const info = officeInfo[integration.office as keyof typeof officeInfo] || officeInfo.uspto;
            return (
              <PatentOfficeCard
                key={integration.id}
                integration={integration}
                officeInfo={info}
                onSync={() => handleSyncStatus(integration.id)}
                onConfigure={() => {
                  setSelectedIntegration(integration);
                  // Show configuration modal
                }}
              />
            );
          })}
        </div>

        {integrations.length === 0 && (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No patent office integrations configured</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect Your First Office
            </button>
          </div>
        )}
      </div>

      {/* Recent Patent Status Updates */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Status Updates</h2>
        </div>

        <div className="divide-y">
          {mockPatentStatuses.map((status, index) => (
            <PatentStatusCard key={index} status={status} />
          ))}
        </div>
      </div>

      {/* Create Integration Modal */}
      {showCreateModal && (
        <CreateIntegrationModal
          availableOffices={Object.entries(officeInfo)}
          connectedOffices={integrations.map(i => i.office)}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateIntegration}
        />
      )}

      {/* Patent Status Modal */}
      {showStatusModal && (
        <PatentStatusModal
          statuses={mockPatentStatuses}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
};

// Patent Office Card Component
const PatentOfficeCard: React.FC<{
  integration: PatentOfficeIntegration;
  officeInfo: any;
  onSync: () => void;
  onConfigure: () => void;
}> = ({ integration, officeInfo, onSync, onConfigure }) => {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${officeInfo.color}`}>
            <span className="text-2xl">{officeInfo.flag}</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {integration.name}
              </h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                integration.status === 'active' 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-red-600 bg-red-100'
              }`}>
                {integration.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{integration.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Office:</span>
                <p className="font-medium">{officeInfo.fullName}</p>
              </div>
              
              <div>
                <span className="text-gray-500">Services:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {integration.services.slice(0, 2).map(service => (
                    <span
                      key={service}
                      className="px-1 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                    >
                      {service.replace('_', ' ')}
                    </span>
                  ))}
                  {integration.services.length > 2 && (
                    <span className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      +{integration.services.length - 2}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-gray-500">Environment:</span>
                <p className="font-medium capitalize">
                  {integration.credentials.environment}
                </p>
              </div>

              {integration.docketingSettings.enabled && (
                <div>
                  <span className="text-gray-500">Auto Docketing:</span>
                  <p className="font-medium text-green-600">Enabled</p>
                </div>
              )}

              {integration.filingSettings.autoSubmit && (
                <div>
                  <span className="text-gray-500">Auto Filing:</span>
                  <p className="font-medium text-blue-600">Enabled</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onSync}
            className="p-2 text-blue-600 hover:text-blue-800 rounded"
            title="Sync status"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={onConfigure}
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
            title="Configure"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Patent Status Card Component
const PatentStatusCard: React.FC<{
  status: PatentStatus;
}> = ({ status }) => {
  const getStatusColor = (statusText: string) => {
    if (statusText.includes('Approved') || statusText.includes('Granted')) {
      return 'text-green-600 bg-green-100';
    }
    if (statusText.includes('Rejected') || statusText.includes('Abandoned')) {
      return 'text-red-600 bg-red-100';
    }
    if (statusText.includes('Pending') || statusText.includes('Examination')) {
      return 'text-yellow-600 bg-yellow-100';
    }
    return 'text-gray-600 bg-gray-100';
  };

  const isUrgent = status.nextActionDate && 
    new Date(status.nextActionDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {status.applicationNumber}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status.status)}`}>
              {status.status}
            </span>
            {isUrgent && (
              <span className="px-2 py-1 rounded text-xs font-medium text-red-600 bg-red-100 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Urgent
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-500">Status Date:</span>
              <p className="font-medium">{new Date(status.statusDate).toLocaleDateString()}</p>
            </div>
            
            {status.nextAction && (
              <div>
                <span className="text-gray-500">Next Action:</span>
                <p className="font-medium">{status.nextAction}</p>
              </div>
            )}
            
            {status.nextActionDate && (
              <div>
                <span className="text-gray-500">Due Date:</span>
                <p className={`font-medium ${isUrgent ? 'text-red-600' : ''}`}>
                  {new Date(status.nextActionDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {status.examiner && (
              <div>
                <span className="text-gray-500">Examiner:</span>
                <p className="font-medium">{status.examiner}</p>
              </div>
            )}
          </div>

          {/* Outstanding Fees */}
          {status.fees.filter(f => !f.paid).length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Outstanding Fees:</h4>
              <div className="flex flex-wrap gap-2">
                {status.fees.filter(f => !f.paid).map(fee => (
                  <div
                    key={fee.code}
                    className="px-3 py-1 bg-red-50 border border-red-200 rounded text-sm"
                  >
                    <span className="font-medium">{fee.description}</span>
                    <span className="ml-2 text-red-600">
                      ${fee.amount} ({new Date(fee.dueDate).toLocaleDateString()})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Documents */}
          {status.documents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Documents:</h4>
              <div className="flex flex-wrap gap-2">
                {status.documents.slice(0, 3).map(doc => (
                  <button
                    key={doc.id}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="h-3 w-3" />
                    <span>{doc.type}</span>
                    <Download className="h-3 w-3" />
                  </button>
                ))}
                {status.documents.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                    +{status.documents.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Integration Modal Component
const CreateIntegrationModal: React.FC<{
  availableOffices: [string, any][];
  connectedOffices: PatentOffice[];
  onClose: () => void;
  onCreate: (integration: Omit<PatentOfficeIntegration, 'id' | 'createdAt' | 'updatedAt'>) => void;
}> = ({ availableOffices, connectedOffices, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    office: 'uspto' as PatentOffice,
    services: [] as PatentService[],
    credentials: {
      customerNumber: '',
      username: '',
      password: '',
      certificate: '',
      apiKey: '',
      environment: 'sandbox' as 'sandbox' | 'production'
    },
    docketingSettings: {
      enabled: false,
      autoSync: false,
      reminderDays: [30, 7, 1],
      notificationMethods: ['email'] as any[],
      customFields: []
    } as DocketingSettings,
    filingSettings: {
      autoSubmit: false,
      validateBeforeSubmit: true,
      backupDocuments: true,
      feesAccount: '',
      defaultCorrespondence: ''
    }
  });

  const availableServices: { [key in PatentOffice]: PatentService[] } = {
    uspto: ['filing', 'status_check', 'document_retrieval', 'fee_calculation', 'docketing'],
    epo: ['filing', 'status_check', 'document_retrieval', 'prior_art_search'],
    wipo: ['filing', 'status_check', 'classification', 'prior_art_search'],
    jpo: ['filing', 'status_check', 'document_retrieval'],
    kipo: ['filing', 'status_check', 'document_retrieval'],
    cnipa: ['filing', 'status_check', 'document_retrieval'],
    ip_australia: ['filing', 'status_check', 'document_retrieval'],
    cipo: ['filing', 'status_check', 'document_retrieval'],
    ukipo: ['filing', 'status_check', 'document_retrieval']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.services.length > 0) {
      onCreate({
        ...formData,
        category: 'patent_office',
        status: 'pending',
        provider: formData.office,
        version: '1.0.0'
      } as any);
    }
  };

  const toggleService = (service: PatentService) => {
    const exists = formData.services.includes(service);
    if (exists) {
      setFormData({
        ...formData,
        services: formData.services.filter(s => s !== service)
      });
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, service]
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Connect Patent Office</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Integration Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., USPTO Production"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patent Office *
                  </label>
                  <select
                    value={formData.office}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      office: e.target.value as PatentOffice,
                      services: [] // Reset services when office changes
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    {availableOffices.map(([office, info]) => (
                      <option 
                        key={office} 
                        value={office}
                        disabled={connectedOffices.includes(office as PatentOffice)}
                      >
                        {info.name} - {info.fullName}
                        {connectedOffices.includes(office as PatentOffice) ? ' (Connected)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe this integration..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                />
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Available Services *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableServices[formData.office].map(service => (
                  <label key={service} className="flex items-center p-3 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => toggleService(service)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 capitalize">
                        {service.replace('_', ' ')}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Credentials</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environment
                </label>
                <select
                  value={formData.credentials.environment}
                  onChange={(e) => setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      environment: e.target.value as 'sandbox' | 'production'
                    }
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="production">Production</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Number
                  </label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={formData.credentials.customerNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      credentials: {
                        ...formData.credentials,
                        customerNumber: e.target.value
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter API key"
                    value={formData.credentials.apiKey}
                    onChange={(e) => setFormData({
                      ...formData,
                      credentials: {
                        ...formData.credentials,
                        apiKey: e.target.value
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.credentials.username}
                    onChange={(e) => setFormData({
                      ...formData,
                      credentials: {
                        ...formData.credentials,
                        username: e.target.value
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.credentials.password}
                    onChange={(e) => setFormData({
                      ...formData,
                      credentials: {
                        ...formData.credentials,
                        password: e.target.value
                      }
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Docketing Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Docketing Settings</h3>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.docketingSettings.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    docketingSettings: {
                      ...formData.docketingSettings,
                      enabled: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
                <span>Enable automatic docketing</span>
              </label>

              {formData.docketingSettings.enabled && (
                <>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.docketingSettings.autoSync}
                      onChange={(e) => setFormData({
                        ...formData,
                        docketingSettings: {
                          ...formData.docketingSettings,
                          autoSync: e.target.checked
                        }
                      })}
                      className="mr-2"
                    />
                    <span>Auto-sync patent status</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reminder Days Before Due Date
                    </label>
                    <div className="flex gap-2">
                      {[30, 14, 7, 3, 1].map(days => (
                        <label key={days} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.docketingSettings.reminderDays.includes(days)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  docketingSettings: {
                                    ...formData.docketingSettings,
                                    reminderDays: [...formData.docketingSettings.reminderDays, days]
                                  }
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  docketingSettings: {
                                    ...formData.docketingSettings,
                                    reminderDays: formData.docketingSettings.reminderDays.filter(d => d !== days)
                                  }
                                });
                              }
                            }}
                            className="mr-1"
                          />
                          <span className="text-sm">{days}d</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Connect Patent Office
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Patent Status Modal Component
const PatentStatusModal: React.FC<{
  statuses: PatentStatus[];
  onClose: () => void;
}> = ({ statuses, onClose }) => {
  const [filter, setFilter] = useState('all');

  const filteredStatuses = statuses.filter(status => {
    switch (filter) {
      case 'pending': return status.status.includes('Pending') || status.status.includes('Examination');
      case 'urgent': return status.nextActionDate && 
        new Date(status.nextActionDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      case 'fees_due': return status.fees.some(f => !f.paid);
      default: return true;
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Patent Status Overview</h2>
            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">All Patents</option>
                <option value="pending">Pending Review</option>
                <option value="urgent">Urgent Actions</option>
                <option value="fees_due">Fees Due</option>
              </select>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {filteredStatuses.length > 0 ? (
            <div className="divide-y">
              {filteredStatuses.map((status, index) => (
                <PatentStatusCard key={index} status={status} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">
                {filter === 'all' ? 'No patents found' : `No ${filter.replace('_', ' ')} patents found`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};