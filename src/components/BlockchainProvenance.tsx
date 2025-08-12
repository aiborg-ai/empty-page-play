import { useState, useEffect } from 'react';
import { 
  Link, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Download,
  Search,
  Plus,
  Hash,
  Database,
  Zap
} from 'lucide-react';
import { BlockchainProvenanceService } from '../lib/blockchainProvenance';
import type { BlockchainProvenanceRecord } from '../types/innovations';

interface BlockchainProvenanceProps {
  currentUser: any;
  projectId?: string;
}

export default function BlockchainProvenance({ currentUser: _currentUser, projectId: _projectId }: BlockchainProvenanceProps) {
  const [selectedPatentId, setSelectedPatentId] = useState('US10123456');
  const [provenanceChain, setProvenanceChain] = useState<BlockchainProvenanceRecord[]>([]);
  const [ownershipHistory, setOwnershipHistory] = useState<any[]>([]);
  const [licenseHistory, setLicenseHistory] = useState<any[]>([]);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [certificate, setCertificate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateRecord, setShowCreateRecord] = useState(false);
  const [newRecordType, setNewRecordType] = useState<'creation' | 'modification' | 'transfer' | 'license' | 'dispute'>('creation');
  const [newRecordData, setNewRecordData] = useState<Record<string, any>>({});
  const [smartContractResult, setSmartContractResult] = useState<any>(null);

  const provenanceService = new BlockchainProvenanceService();

  useEffect(() => {
    if (selectedPatentId) {
      loadProvenanceData();
    }
  }, [selectedPatentId]);

  const loadProvenanceData = async () => {
    setIsLoading(true);
    try {
      const [chain, ownership, licenses, verification] = await Promise.all([
        provenanceService.getProvenanceChain(selectedPatentId),
        provenanceService.getOwnershipHistory(selectedPatentId),
        provenanceService.getLicenseHistory(selectedPatentId),
        provenanceService.verifyProvenanceIntegrity(selectedPatentId)
      ]);

      setProvenanceChain(chain);
      setOwnershipHistory(ownership);
      setLicenseHistory(licenses);
      setVerificationResult(verification);
    } catch (error) {
      alert(`Failed to load provenance data: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRecord = async () => {
    if (!selectedPatentId || !newRecordType) return;

    try {
      const record = await provenanceService.createProvenanceRecord(
        selectedPatentId,
        newRecordType,
        newRecordData
      );

      setProvenanceChain(prev => [...prev, record]);
      setShowCreateRecord(false);
      setNewRecordData({});
      await loadProvenanceData(); // Refresh data
    } catch (error) {
      alert(`Failed to create record: ${error}`);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      const cert = await provenanceService.generateProvenanceCertificate(selectedPatentId);
      setCertificate(cert);
    } catch (error) {
      alert(`Failed to generate certificate: ${error}`);
    }
  };

  const handleExecuteSmartContract = async (
    contractType: 'license_payment' | 'royalty_distribution' | 'automatic_renewal',
    data: Record<string, any>
  ) => {
    try {
      const result = await provenanceService.executeSmartContract(contractType, data);
      setSmartContractResult(result);
    } catch (error) {
      alert(`Failed to execute smart contract: ${error}`);
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'creation': return 'bg-green-100 text-green-800';
      case 'modification': return 'bg-blue-100 text-blue-800';
      case 'transfer': return 'bg-orange-100 text-orange-800';
      case 'license': return 'bg-purple-100 text-purple-800';
      case 'dispute': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Link className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blockchain Patent Provenance</h1>
              <p className="text-gray-600">Immutable tracking of patent lifecycle events</p>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={handleGenerateCertificate}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Shield className="w-4 h-4" />
                Generate Certificate
              </button>
            </div>
          </div>

          {/* Patent Search */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={selectedPatentId}
                  onChange={(e) => setSelectedPatentId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter patent ID..."
                />
              </div>
            </div>
            <button
              onClick={() => setShowCreateRecord(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Verification Status */}
            {verificationResult && (
              <div className={`p-6 rounded-lg ${
                verificationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {verificationResult.isValid ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <h3 className={`font-semibold ${
                      verificationResult.isValid ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {verificationResult.isValid ? 'Chain Integrity Verified' : 'Integrity Issues Detected'}
                    </h3>
                    <p className={`text-sm ${
                      verificationResult.isValid ? 'text-green-700' : 'text-red-700'
                    }`}>
                      Confidence: {Math.round(verificationResult.confidence * 100)}%
                    </p>
                  </div>
                </div>
                
                {verificationResult.issues.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-red-800 mb-2">Issues Found:</div>
                    <ul className="text-sm text-red-700 list-disc list-inside">
                      {verificationResult.issues.map((issue: string, index: number) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Provenance Chain */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Provenance Chain</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Database className="w-4 h-4" />
                  {provenanceChain.length} Records
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading provenance data...</p>
                </div>
              ) : provenanceChain.length > 0 ? (
                <div className="space-y-4">
                  {provenanceChain.map((record, index) => (
                    <div key={record.id} className="relative">
                      {/* Connection Line */}
                      {index > 0 && (
                        <div className="absolute left-6 -top-4 w-0.5 h-4 bg-gray-300"></div>
                      )}
                      
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          {getVerificationIcon(record.verificationStatus)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getEventTypeColor(record.eventType)}`}>
                                {record.eventType.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-600">
                                Block #{record.blockNumber}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(record.timestamp).toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span className="text-xs font-mono text-gray-600 break-all">
                                {record.transactionHash}
                              </span>
                            </div>
                            {record.previousHash && (
                              <div className="flex items-center gap-2">
                                <Link className="w-3 h-3 text-gray-400" />
                                <span className="text-xs font-mono text-gray-500 break-all">
                                  Previous: {record.previousHash}
                                </span>
                              </div>
                            )}
                          </div>

                          {Object.keys(record.data).length > 0 && (
                            <div className="bg-white p-3 rounded border">
                              <div className="text-xs font-medium text-gray-700 mb-2">Event Data:</div>
                              <div className="space-y-1">
                                {Object.entries(record.data).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-xs text-gray-600">{key}:</span>
                                    <span className="text-xs text-gray-900 font-medium">
                                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No provenance records found</p>
                  <p className="text-sm">Add the first record to start tracking</p>
                </div>
              )}
            </div>

            {/* Smart Contract Execution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-yellow-600" />
                <h2 className="text-lg font-semibold">Smart Contract Execution</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleExecuteSmartContract('license_payment', {
                    amount: 10000,
                    licensee: 'Company A',
                    licensor: 'Inventor X'
                  })}
                  className="p-4 border border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50"
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">License Payment</div>
                    <div className="text-xs text-gray-600 mt-1">Process license fees</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExecuteSmartContract('royalty_distribution', {
                    totalAmount: 50000,
                    beneficiaries: [
                      { address: '0x123...', percentage: 0.6 },
                      { address: '0x456...', percentage: 0.4 }
                    ]
                  })}
                  className="p-4 border border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50"
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">Royalty Distribution</div>
                    <div className="text-xs text-gray-600 mt-1">Distribute earnings</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExecuteSmartContract('automatic_renewal', {
                    licenseId: 'LIC123',
                    renewalFee: 5000
                  })}
                  className="p-4 border border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50"
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">Auto Renewal</div>
                    <div className="text-xs text-gray-600 mt-1">Renew licenses</div>
                  </div>
                </button>
              </div>

              {smartContractResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">Smart Contract Executed</span>
                  </div>
                  <div className="space-y-1 text-sm text-green-800">
                    <div>Transaction: {smartContractResult.transactionHash}</div>
                    <div>Gas Used: {smartContractResult.gasUsed}</div>
                    <div>Result: {JSON.stringify(smartContractResult.result, null, 2)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certificate */}
            {certificate && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Provenance Certificate</h3>
                  <button className="text-indigo-600 hover:text-indigo-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Certificate ID:</span>
                    <div className="font-mono text-xs break-all">{certificate.certificateId}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Issued:</span>
                    <div>{new Date(certificate.issuedAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Valid Until:</span>
                    <div>{new Date(certificate.validUntil).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Records:</span>
                    <div>{certificate.summary.totalRecords}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className={`inline-block px-2 py-1 text-xs rounded ${
                      certificate.summary.verificationStatus === 'VERIFIED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {certificate.summary.verificationStatus}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Integrity Score:</span>
                    <div>{Math.round(certificate.summary.integrityScore * 100)}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Ownership History */}
            {ownershipHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold mb-4">Ownership History</h3>
                <div className="space-y-3">
                  {ownershipHistory.map((entry, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-3 pb-3">
                      <div className="font-medium text-sm">{entry.owner}</div>
                      <div className="text-xs text-gray-600">
                        From: {new Date(entry.fromDate).toLocaleDateString()}
                      </div>
                      {entry.toDate && (
                        <div className="text-xs text-gray-600">
                          To: {new Date(entry.toDate).toLocaleDateString()}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {entry.eventType}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* License History */}
            {licenseHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold mb-4">License History</h3>
                <div className="space-y-3">
                  {licenseHistory.map((entry, index) => (
                    <div key={index} className="border-l-2 border-purple-500 pl-3 pb-3">
                      <div className="font-medium text-sm">{entry.licensee}</div>
                      <div className="text-xs text-gray-600">
                        Type: {entry.licenseType}
                      </div>
                      <div className="text-xs text-gray-600">
                        From: {new Date(entry.startDate).toLocaleDateString()}
                      </div>
                      {entry.endDate && (
                        <div className="text-xs text-gray-600">
                          Until: {new Date(entry.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Record Modal */}
        {showCreateRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add Provenance Record</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={newRecordType}
                    onChange={(e) => setNewRecordType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="creation">Creation</option>
                    <option value="modification">Modification</option>
                    <option value="transfer">Transfer</option>
                    <option value="license">License</option>
                    <option value="dispute">Dispute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Data (JSON)
                  </label>
                  <textarea
                    value={JSON.stringify(newRecordData, null, 2)}
                    onChange={(e) => {
                      try {
                        setNewRecordData(JSON.parse(e.target.value));
                      } catch {
                        // Keep existing data if JSON is invalid
                      }
                    }}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    placeholder='{"key": "value"}'
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateRecord}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                >
                  Create Record
                </button>
                <button
                  onClick={() => setShowCreateRecord(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}