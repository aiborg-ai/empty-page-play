// Patent Database Service using API endpoints
const API_BASE_URL = 'http://localhost:3001/api';

// Patent data interfaces matching the PostgreSQL schema
export interface Patent {
  id: string;
  patent_number: string;
  application_number?: string;
  title: string;
  abstract_text?: string;
  filing_date: string;
  grant_date: string;
  publication_date?: string;
  claims_count?: number;
  page_count?: number;
  figure_count?: number;
  status: 'active' | 'expired' | 'pending' | 'abandoned';
  full_text_available: boolean;
  raw_json?: any;
  ingestion_timestamp: string;
  last_updated: string;
}

export interface Inventor {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  suffix?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface Assignee {
  id: string;
  name: string;
  organization_type?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  website?: string;
  industry?: string;
}

export interface Classification {
  id: string;
  patent_id: string;
  scheme: 'CPC' | 'USPC' | 'IPC' | 'LOCARNO';
  main_class: string;
  subclass?: string;
  group_code?: string;
  subgroup_code?: string;
  full_code: string;
  section?: string;
  class_title?: string;
  subclass_title?: string;
  is_primary: boolean;
  classification_type?: string;
}

export interface Citation {
  id: string;
  citing_patent_id: string;
  citation_type: 'patent' | 'non_patent_literature' | 'foreign' | 'other';
  cited_patent_number?: string;
  cited_patent_id?: string;
  citation_text?: string;
  publication_date?: string;
  author?: string;
  source?: string;
  is_examiner_citation: boolean;
  is_applicant_citation: boolean;
}

export interface PatentWithRelations extends Patent {
  inventors: Inventor[];
  assignees: Assignee[];
  classifications: Classification[];
  citations: Citation[];
}

export interface SearchFilters {
  query?: string;
  field?: string;
  dateRange?: {
    type: 'published' | 'filed' | 'priority';
    from?: string;
    to?: string;
  };
  jurisdictions?: string[];
  assignees?: string[];
  inventors?: string[];
  classifications?: {
    scheme: 'CPC' | 'USPC' | 'IPC' | 'LOCARNO';
    codes: string[];
  };
  documentTypes?: string[];
  status?: ('active' | 'expired' | 'pending' | 'abandoned')[];
  hasFullText?: boolean;
  citationFilters?: {
    citesPatents?: boolean;
    citedByPatents?: boolean;
    hasExaminerCitations?: boolean;
  };
}

export interface SearchResult {
  patents: PatentWithRelations[];
  totalCount: number;
  facets: {
    assignees: { name: string; count: number }[];
    inventors: { name: string; count: number }[];
    classifications: { code: string; title: string; count: number }[];
    jurisdictions: { code: string; name: string; count: number }[];
    years: { year: number; count: number }[];
  };
}

// API-based database service
class PatentDatabaseService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Test connection to the patent database API
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.status === 'healthy' && data.database === 'connected';
    } catch (error) {
      console.error('Failed to connect to patent database API:', error);
      return false;
    }
  }

  // Search patents with advanced filtering
  async searchPatents(filters: SearchFilters, limit = 50, offset = 0): Promise<SearchResult> {
    try {
      const searchPayload = {
        ...filters,
        limit,
        offset
      };

      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchPayload),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search request failed:', error);
      
      // Fallback to mock data if API is unavailable
      const mockPatents: PatentWithRelations[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          patent_number: 'US11234567B2',
          application_number: 'US16/123,456',
          title: 'Machine Learning System for Patent Analysis',
          abstract_text: 'A system and method for analyzing patents using machine learning algorithms to identify patterns and relationships in patent data.',
          filing_date: '2020-01-15',
          grant_date: '2023-03-20',
          publication_date: '2021-07-15',
          claims_count: 20,
          page_count: 45,
          figure_count: 8,
          status: 'active',
          full_text_available: true,
          ingestion_timestamp: '2023-03-21T10:30:00Z',
          last_updated: '2023-03-21T10:30:00Z',
          inventors: [
            {
              id: 'inv-001',
              first_name: 'John',
              last_name: 'Smith',
              city: 'San Francisco',
              state: 'CA',
              country: 'US'
            }
          ],
          assignees: [
            {
              id: 'asg-001',
              name: 'Tech Innovation Corp',
              organization_type: 'Corporation',
              city: 'Palo Alto',
              state: 'CA',
              country: 'US',
              industry: 'Technology'
            }
          ],
          classifications: [
            {
              id: 'cls-001',
              patent_id: '550e8400-e29b-41d4-a716-446655440001',
              scheme: 'CPC',
              main_class: 'G',
              subclass: '06',
              full_code: 'G06N3/08',
              section: 'G',
              class_title: 'Physics',
              is_primary: true,
              classification_type: 'original'
            }
          ],
          citations: [
            {
              id: 'cit-001',
              citing_patent_id: '550e8400-e29b-41d4-a716-446655440001',
              citation_type: 'patent',
              cited_patent_number: 'US10123456B1',
              is_examiner_citation: true,
              is_applicant_citation: false
            }
          ]
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          patent_number: 'US11345678B2',
          application_number: 'US16/234,567',
          title: 'AI-Powered Data Processing Method',
          abstract_text: 'An artificial intelligence system for processing large datasets using neural networks and deep learning techniques.',
          filing_date: '2019-11-20',
          grant_date: '2023-05-15',
          publication_date: '2021-05-20',
          claims_count: 15,
          page_count: 32,
          figure_count: 6,
          status: 'active',
          full_text_available: true,
          ingestion_timestamp: '2023-05-16T14:20:00Z',
          last_updated: '2023-05-16T14:20:00Z',
          inventors: [
            {
              id: 'inv-002',
              first_name: 'Sarah',
              last_name: 'Johnson',
              city: 'Austin',
              state: 'TX',
              country: 'US'
            },
            {
              id: 'inv-003',
              first_name: 'Michael',
              last_name: 'Chen',
              city: 'Seattle',
              state: 'WA',
              country: 'US'
            }
          ],
          assignees: [
            {
              id: 'asg-002',
              name: 'Advanced AI Solutions LLC',
              organization_type: 'LLC',
              city: 'Austin',
              state: 'TX',
              country: 'US',
              industry: 'Artificial Intelligence'
            }
          ],
          classifications: [
            {
              id: 'cls-002',
              patent_id: '550e8400-e29b-41d4-a716-446655440002',
              scheme: 'CPC',
              main_class: 'G',
              subclass: '06',
              full_code: 'G06N20/00',
              section: 'G',
              class_title: 'Physics',
              is_primary: true,
              classification_type: 'original'
            }
          ],
          citations: []
        }
      ];

      // Apply basic filtering
      let filteredPatents = mockPatents;

      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredPatents = filteredPatents.filter(patent => 
          patent.title.toLowerCase().includes(query) ||
          patent.abstract_text?.toLowerCase().includes(query) ||
          patent.patent_number.toLowerCase().includes(query)
        );
      }

      if (filters.dateRange) {
        const { from, to, type } = filters.dateRange;
        filteredPatents = filteredPatents.filter(patent => {
          const dateField = type === 'filed' ? patent.filing_date : 
                           type === 'priority' ? patent.publication_date || patent.grant_date :
                           patent.grant_date;
          
          if (from && dateField < from) return false;
          if (to && dateField > to) return false;
          return true;
        });
      }

      if (filters.status && filters.status.length > 0) {
        filteredPatents = filteredPatents.filter(patent => 
          filters.status!.includes(patent.status)
        );
      }

      // Generate facets
      const facets = {
        assignees: Array.from(new Set(
          filteredPatents.flatMap(p => p.assignees.map(a => a.name))
        )).map(name => ({ name, count: Math.floor(Math.random() * 100) + 1 })),
        
        inventors: Array.from(new Set(
          filteredPatents.flatMap(p => p.inventors.map(i => `${i.first_name} ${i.last_name}`))
        )).map(name => ({ name, count: Math.floor(Math.random() * 50) + 1 })),
        
        classifications: Array.from(new Set(
          filteredPatents.flatMap(p => p.classifications.map(c => c.full_code))
        )).map(code => ({ 
          code, 
          title: code.startsWith('G06') ? 'Computing; Calculating' : 'Other',
          count: Math.floor(Math.random() * 200) + 1 
        })),
        
        jurisdictions: [
          { code: 'US', name: 'United States', count: filteredPatents.length },
          { code: 'EP', name: 'European Patent Office', count: Math.floor(filteredPatents.length * 0.3) },
          { code: 'CN', name: 'China', count: Math.floor(filteredPatents.length * 0.2) }
        ],
        
        years: Array.from(new Set(
          filteredPatents.map(p => new Date(p.grant_date).getFullYear())
        )).map(year => ({ year, count: Math.floor(Math.random() * 1000) + 100 }))
      };

      // Apply pagination
      const paginatedPatents = filteredPatents.slice(offset, offset + limit);

      return {
        patents: paginatedPatents,
        totalCount: filteredPatents.length,
        facets
      };
    }
  }

  // Get patent by ID with all related data
  async getPatentById(id: string): Promise<PatentWithRelations | null> {
    try {
      const response = await fetch(`${this.baseUrl}/patents/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting patent by ID:', error);
      return null;
    }
  }

  // Get database statistics
  async getDatabaseStats(): Promise<{
    totalPatents: number;
    totalCitations: number;
    totalInventors: number;
    totalAssignees: number;
    totalClassifications: number;
    lastUpdated: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting database stats:', error);
      // Return mock statistics as fallback
      return {
        totalPatents: 165281274,
        totalCitations: 482259938,
        totalInventors: 12500000,
        totalAssignees: 2800000,
        totalClassifications: 8500000,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Get top assignees by patent count
  async getTopAssignees(limit = 100): Promise<{ name: string; count: number; country?: string }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/assignees/top?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting top assignees:', error);
      // Return mock data as fallback
      return [
        { name: 'International Business Machines Corporation', count: 150000, country: 'US' },
        { name: 'Samsung Electronics Co., Ltd.', count: 120000, country: 'KR' },
        { name: 'Canon Inc.', count: 95000, country: 'JP' },
        { name: 'Toyota Motor Corporation', count: 85000, country: 'JP' },
        { name: 'Microsoft Corporation', count: 78000, country: 'US' }
      ].slice(0, limit);
    }
  }

  // Get classification hierarchy
  async getClassificationHierarchy(scheme: 'CPC' | 'USPC' | 'IPC' = 'CPC'): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/classifications/hierarchy?scheme=${scheme}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting classification hierarchy:', error);
      // Return mock data as fallback
      if (scheme === 'CPC') {
        return [
          { section: 'A', title: 'Human Necessities', count: 15000000 },
          { section: 'B', title: 'Performing Operations; Transporting', count: 12000000 },
          { section: 'C', title: 'Chemistry; Metallurgy', count: 18000000 },
          { section: 'D', title: 'Textiles; Paper', count: 2500000 },
          { section: 'E', title: 'Fixed Constructions', count: 8000000 },
          { section: 'F', title: 'Mechanical Engineering; Lighting; Heating', count: 14000000 },
          { section: 'G', title: 'Physics', count: 22000000 },
          { section: 'H', title: 'Electricity', count: 19000000 }
        ];
      }
      return [];
    }
  }
}

// Export singleton instance
export const patentDatabase = new PatentDatabaseService();