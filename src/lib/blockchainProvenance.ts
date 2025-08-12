import type { BlockchainProvenanceRecord } from '../types/innovations';

// Simulate blockchain interaction (in a real implementation, this would connect to a blockchain network)
export class BlockchainProvenanceService {
  private records: Map<string, BlockchainProvenanceRecord[]> = new Map();
  private mockBlockNumber = 1000000;
  
  async createProvenanceRecord(
    patentId: string,
    eventType: 'creation' | 'modification' | 'transfer' | 'license' | 'dispute',
    data: Record<string, any>
  ): Promise<BlockchainProvenanceRecord> {
    const previousRecords = this.records.get(patentId) || [];
    const previousHash = previousRecords.length > 0 
      ? previousRecords[previousRecords.length - 1].transactionHash 
      : undefined;

    const record: BlockchainProvenanceRecord = {
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patentId,
      transactionHash: this.generateTransactionHash(),
      blockNumber: this.mockBlockNumber++,
      timestamp: new Date().toISOString(),
      eventType,
      previousHash,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        blockchainVersion: '1.0',
        networkId: 'patent-chain-mainnet'
      },
      verificationStatus: 'pending'
    };

    // Simulate blockchain verification process
    setTimeout(() => {
      record.verificationStatus = 'verified';
    }, 2000);

    const existingRecords = this.records.get(patentId) || [];
    this.records.set(patentId, [...existingRecords, record]);

    return record;
  }

  async getProvenanceChain(patentId: string): Promise<BlockchainProvenanceRecord[]> {
    return this.records.get(patentId) || [];
  }

  async verifyProvenanceIntegrity(patentId: string): Promise<{
    isValid: boolean;
    issues: string[];
    confidence: number;
  }> {
    const records = await this.getProvenanceChain(patentId);
    const issues: string[] = [];
    
    if (records.length === 0) {
      return {
        isValid: false,
        issues: ['No provenance records found'],
        confidence: 0
      };
    }

    // Verify chain integrity
    for (let i = 1; i < records.length; i++) {
      const currentRecord = records[i];
      const previousRecord = records[i - 1];
      
      if (currentRecord.previousHash !== previousRecord.transactionHash) {
        issues.push(`Chain break detected at record ${i}`);
      }
      
      if (currentRecord.blockNumber <= previousRecord.blockNumber) {
        issues.push(`Invalid block sequence at record ${i}`);
      }
    }

    // Verify timestamps are sequential
    for (let i = 1; i < records.length; i++) {
      const currentTime = new Date(records[i].timestamp).getTime();
      const previousTime = new Date(records[i - 1].timestamp).getTime();
      
      if (currentTime < previousTime) {
        issues.push(`Invalid timestamp sequence at record ${i}`);
      }
    }

    const isValid = issues.length === 0;
    const confidence = isValid ? 1.0 : Math.max(0, 1 - (issues.length * 0.2));

    return {
      isValid,
      issues,
      confidence
    };
  }

  async getOwnershipHistory(patentId: string): Promise<Array<{
    owner: string;
    fromDate: string;
    toDate?: string;
    transactionHash: string;
    eventType: string;
  }>> {
    const records = await this.getProvenanceChain(patentId);
    const ownershipHistory: Array<{
      owner: string;
      fromDate: string;
      toDate?: string;
      transactionHash: string;
      eventType: string;
    }> = [];

    records.forEach((record, index) => {
      if (record.eventType === 'creation' || record.eventType === 'transfer') {
        const nextTransferIndex = records.findIndex((r, i) => 
          i > index && r.eventType === 'transfer'
        );
        
        ownershipHistory.push({
          owner: record.data.owner || record.data.inventor || 'Unknown',
          fromDate: record.timestamp,
          toDate: nextTransferIndex !== -1 ? records[nextTransferIndex].timestamp : undefined,
          transactionHash: record.transactionHash,
          eventType: record.eventType
        });
      }
    });

    return ownershipHistory;
  }

  async getLicenseHistory(patentId: string): Promise<Array<{
    licensee: string;
    licensor: string;
    licenseType: string;
    startDate: string;
    endDate?: string;
    terms: Record<string, any>;
    transactionHash: string;
  }>> {
    const records = await this.getProvenanceChain(patentId);
    const licenseHistory: Array<{
      licensee: string;
      licensor: string;
      licenseType: string;
      startDate: string;
      endDate?: string;
      terms: Record<string, any>;
      transactionHash: string;
    }> = [];

    records
      .filter(record => record.eventType === 'license')
      .forEach(record => {
        licenseHistory.push({
          licensee: record.data.licensee || 'Unknown',
          licensor: record.data.licensor || 'Unknown',
          licenseType: record.data.licenseType || 'Unknown',
          startDate: record.timestamp,
          endDate: record.data.endDate,
          terms: record.data.terms || {},
          transactionHash: record.transactionHash
        });
      });

    return licenseHistory;
  }

  async generateProvenanceCertificate(patentId: string): Promise<{
    certificateId: string;
    patentId: string;
    issuedAt: string;
    validUntil: string;
    verificationHash: string;
    summary: {
      totalRecords: number;
      verificationStatus: string;
      integrityScore: number;
      lastVerified: string;
    };
    digitalSignature: string;
  }> {
    const records = await this.getProvenanceChain(patentId);
    const verification = await this.verifyProvenanceIntegrity(patentId);
    
    const certificateId = `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const verificationHash = this.generateVerificationHash(records);
    const digitalSignature = this.generateDigitalSignature(certificateId, patentId, verificationHash);
    
    return {
      certificateId,
      patentId,
      issuedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      verificationHash,
      summary: {
        totalRecords: records.length,
        verificationStatus: verification.isValid ? 'VERIFIED' : 'ISSUES_DETECTED',
        integrityScore: verification.confidence,
        lastVerified: new Date().toISOString()
      },
      digitalSignature
    };
  }

  async trackInventionDisclosure(
    inventionId: string,
    inventorData: {
      inventors: string[];
      assignee?: string;
      disclosureDate: string;
      description: string;
      documents: Array<{ name: string; hash: string }>;
    }
  ): Promise<BlockchainProvenanceRecord> {
    return this.createProvenanceRecord(inventionId, 'creation', {
      recordType: 'invention_disclosure',
      ...inventorData
    });
  }

  async trackPatentFiling(
    patentId: string,
    filingData: {
      applicationNumber: string;
      filingDate: string;
      claims: string[];
      priorInventionDisclosure?: string;
    }
  ): Promise<BlockchainProvenanceRecord> {
    return this.createProvenanceRecord(patentId, 'creation', {
      recordType: 'patent_filing',
      ...filingData
    });
  }

  async trackPatentGrant(
    patentId: string,
    grantData: {
      grantDate: string;
      grantNumber: string;
      finalClaims: string[];
      examinerNotes?: string;
    }
  ): Promise<BlockchainProvenanceRecord> {
    return this.createProvenanceRecord(patentId, 'modification', {
      recordType: 'patent_grant',
      ...grantData
    });
  }

  async trackOwnershipTransfer(
    patentId: string,
    transferData: {
      fromOwner: string;
      toOwner: string;
      transferDate: string;
      transferType: 'assignment' | 'inheritance' | 'court_order';
      legalDocument?: string;
      consideration?: number;
    }
  ): Promise<BlockchainProvenanceRecord> {
    return this.createProvenanceRecord(patentId, 'transfer', {
      recordType: 'ownership_transfer',
      ...transferData
    });
  }

  async trackLicenseAgreement(
    patentId: string,
    licenseData: {
      licensor: string;
      licensee: string;
      licenseType: 'exclusive' | 'non_exclusive' | 'field_limited';
      startDate: string;
      endDate?: string;
      royaltyRate?: number;
      territory?: string[];
      field?: string;
    }
  ): Promise<BlockchainProvenanceRecord> {
    return this.createProvenanceRecord(patentId, 'license', {
      recordType: 'license_agreement',
      ...licenseData
    });
  }

  async trackDispute(
    patentId: string,
    disputeData: {
      disputeType: 'validity' | 'infringement' | 'ownership';
      plaintiff: string;
      defendant: string;
      filingDate: string;
      court?: string;
      caseNumber?: string;
      status: 'filed' | 'ongoing' | 'resolved';
      resolution?: string;
    }
  ): Promise<BlockchainProvenanceRecord> {
    return this.createProvenanceRecord(patentId, 'dispute', {
      recordType: 'legal_dispute',
      ...disputeData
    });
  }

  private generateTransactionHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  private generateVerificationHash(records: BlockchainProvenanceRecord[]): string {
    // In a real implementation, this would use a cryptographic hash function
    const dataString = records.map(r => r.transactionHash).join('');
    return this.simpleHash(dataString);
  }

  private generateDigitalSignature(certificateId: string, patentId: string, verificationHash: string): string {
    // In a real implementation, this would use private key cryptography
    const signatureData = `${certificateId}_${patentId}_${verificationHash}`;
    return `sig_${this.simpleHash(signatureData)}`;
  }

  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  // Smart contract simulation methods
  async executeSmartContract(
    contractType: 'license_payment' | 'royalty_distribution' | 'automatic_renewal',
    contractData: Record<string, any>
  ): Promise<{
    success: boolean;
    transactionHash: string;
    result: any;
    gasUsed: number;
  }> {
    // Simulate smart contract execution
    const transactionHash = this.generateTransactionHash();
    
    let result: any;
    let gasUsed = 21000; // Base gas cost
    
    switch (contractType) {
      case 'license_payment':
        result = {
          paymentProcessed: true,
          amount: contractData.amount,
          from: contractData.licensee,
          to: contractData.licensor,
          timestamp: new Date().toISOString()
        };
        gasUsed += 50000;
        break;
        
      case 'royalty_distribution':
        result = {
          distributionCompleted: true,
          totalAmount: contractData.totalAmount,
          distributions: contractData.beneficiaries?.map((b: any) => ({
            beneficiary: b.address,
            amount: contractData.totalAmount * b.percentage,
            percentage: b.percentage
          })) || []
        };
        gasUsed += 100000;
        break;
        
      case 'automatic_renewal':
        result = {
          renewalProcessed: true,
          licenseId: contractData.licenseId,
          newEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          renewalFee: contractData.renewalFee
        };
        gasUsed += 30000;
        break;
        
      default:
        throw new Error(`Unknown contract type: ${contractType}`);
    }

    return {
      success: true,
      transactionHash,
      result,
      gasUsed
    };
  }
}