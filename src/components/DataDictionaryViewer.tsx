import { useState, useEffect } from 'react';
import { FileText, Download, Copy, Check, Table } from 'lucide-react';

interface DataDictionaryViewerProps {
  dictionaryId: string;
  title: string;
}

// Import data dictionary content based on ID
const DATA_DICTIONARIES: Record<string, string> = {
  'dataset-bibliographic': `/Bibliographic-Data.md`,
  'dataset-legal-events': `/Legal-Events.md`,
  'dataset-full-text': `/Full-Text.md`,
  'dataset-backward-citations': `/Backward-Citations.md`,
  'dataset-forward-citations': `/Forward-Citations.md`,
  'dataset-patent-indicators': `/Patent-Indicators.md`,
  'dataset-pit-data': `/PIT-Data.md`
};

export default function DataDictionaryViewer({ dictionaryId, title }: DataDictionaryViewerProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadDictionaryContent();
  }, [dictionaryId]);

  const loadDictionaryContent = async () => {
    setLoading(true);
    try {
      const filePath = DATA_DICTIONARIES[dictionaryId];
      if (filePath) {
        // In a real app, this would fetch the markdown file
        // For now, we'll use the static content
        const response = await fetch(filePath);
        const text = await response.text();
        setContent(text);
      }
    } catch (error) {
      console.error('Error loading dictionary:', error);
      // Fallback to static content
      setContent(getStaticContent(dictionaryId));
    } finally {
      setLoading(false);
    }
  };

  const getStaticContent = (id: string): string => {
    // Static content for each dictionary
    const dictionaries: Record<string, string> = {
      'dataset-bibliographic': `# Bibliographic Data Dictionary

## Overview
Comprehensive patent bibliographic metadata including publication details, application references, classifications, inventors, and assignees.

## Key Fields

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Publication_Number | String | Patent publication identifier | US20220104154A1 |
| Publication_Date | Date | Date of publication | 2022-03-31 |
| Title | String | Patent title | SYNCHRONIZATION SIGNAL... |
| Application_Number | String | Application identifier | US17427165 |
| Application_Date | Date | Filing date | 2020-02-13 |
| Priority_Date | Date | Priority claim date | 2020-02-13 |
| CPC_Classification | Array | CPC codes | H04W56/001 |
| IPC_Classification | Array | IPC codes | H04W56/00 |
| Inventors | Array | Inventor names | ["John Doe", "Jane Smith"] |
| Assignee_Name | String | Current owner | Apple Inc |
| CDMSID | Integer | InnoSpot company ID | 1439305 |

## Data Structure
- **File Metadata**: Generation date, version, company ID
- **Publication Reference**: Publication number, date, grant date
- **Application Reference**: Application number and filing date
- **Priority Claims**: Priority dates and numbers
- **Classifications**: CPC and IPC codes
- **Parties**: Inventors, applicants, assignees`,

      'dataset-legal-events': `# Legal Events Data Dictionary

## Overview
Patent legal event tracking including notifications, legal status changes, and life state information.

## Key Fields

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Event_Code | String | Legal event identifier | FA |
| Event_Date | Date | Event occurrence date | 2020-13-02 |
| Event_Description | String | Event description | ABANDONMENT OR WITHDRAWAL |
| Status_Code | String | InnoSpot status code | B |
| Status_Description | String | Status meaning | APPLICATION DISCONTINUED |
| Life_State | String | Patent state | Active/Inactive/Terminated |
| Country | String | Jurisdiction | US |

## Event Categories
- **Filing Events**: Application filing, priority claims
- **Examination Events**: Office actions, responses
- **Grant Events**: Patent issuance, certificates
- **Maintenance Events**: Fee payments, renewals
- **Legal Proceedings**: Oppositions, invalidations
- **Ownership Changes**: Assignments, mergers`,

      'dataset-full-text': `# Full-Text Data Dictionary

## Overview
Patent full-text content including claims, abstracts, and detailed descriptions.

## Key Fields

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Abstract | Text | Patent summary | "A method for..." |
| Claims | Array | Patent claims | ["1. A system...", "2. The system..."] |
| Description | Text | Detailed description | Full technical disclosure |
| Claim_Count | Integer | Number of claims | 20 |
| Independent_Claims | Integer | Independent claim count | 3 |
| Dependent_Claims | Integer | Dependent claim count | 17 |
| Word_Count | Integer | Total word count | 15432 |

## Content Structure
- **Abstract**: Brief technical summary
- **Claims**: Legal scope of protection
- **Description**: Complete technical disclosure
- **Drawings**: Figure descriptions
- **Background**: Prior art discussion
- **Summary**: Invention overview`,

      'dataset-backward-citations': `# Backward Citations Data Dictionary

## Overview
Patent backward citation metadata for both patent and non-patent literature references.

## Key Fields

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Cited_Patent | String | Referenced patent | US7123456B2 |
| Citation_Type | String | Citation category | Examiner/Applicant |
| Citation_Date | Date | Citation date | 2019-05-15 |
| NPL_Reference | String | Non-patent literature | IEEE Journal 2018 |
| Relevance_Score | Float | Citation relevance | 0.85 |
| Citation_Context | String | Usage context | Prior art |

## Citation Types
- **Patent Citations**: References to other patents
- **NPL Citations**: Academic papers, standards
- **Examiner Citations**: Added during examination
- **Applicant Citations**: Submitted by applicant
- **Foreign Citations**: International references`,

      'dataset-forward-citations': `# Forward Citations Data Dictionary

## Overview
Patent forward citation tracking showing how patents are cited by later inventions.

## Key Fields

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Citing_Patent | String | Later patent reference | US9876543B1 |
| Citation_Date | Date | When cited | 2023-03-20 |
| Citing_Assignee | String | Citing patent owner | Microsoft Corp |
| Technology_Field | String | Technical domain | 5G Communications |
| Citation_Count | Integer | Total forward citations | 127 |
| Impact_Score | Float | Citation impact metric | 8.7 |

## Impact Metrics
- **Direct Citations**: First-generation citations
- **Indirect Citations**: Second+ generation
- **Citation Velocity**: Citations per year
- **Technology Transfer**: Cross-industry citations
- **Geographic Spread**: International citations`,

      'dataset-patent-indicators': `# Patent Indicators Data Dictionary

## Overview
Comprehensive patent analytics and indicators including activity metrics, growth indicators, and impact indices.

## Key Fields

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Filing_Activity | Integer | Annual filings | 1247 |
| Growth_Rate | Float | YoY growth | 0.23 |
| Technology_Concentration | Float | HHI index | 0.67 |
| Market_Coverage | Integer | Countries covered | 45 |
| Citation_Impact | Float | Average citations | 12.4 |
| Innovation_Index | Float | Composite score | 87.3 |
| R&D_Intensity | Float | R&D/Revenue ratio | 0.15 |

## Indicator Categories
- **Activity Indicators**: Filing trends, grant rates
- **Quality Indicators**: Citation impact, breadth
- **Market Indicators**: Geographic coverage, value
- **Technology Indicators**: Concentration, diversity
- **Competitive Indicators**: Market share, position`,

      'dataset-pit-data': `# PIT (Point-in-Time) Data Dictionary

## Overview
Point-in-Time ownership data including patent reassignments and transaction tracking.

## Key Fields

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Transaction_ID | String | Deal identifier | TXN2023001234 |
| Transaction_Date | Date | Deal date | 2023-06-15 |
| Previous_Owner | String | Seller name | Startup Inc |
| New_Owner | String | Buyer name | BigCorp LLC |
| Patent_Count | Integer | Patents transferred | 234 |
| Deal_Value | Float | Transaction value | 45000000 |
| Deal_Type | String | Transaction type | Acquisition/License |

## Transaction Types
- **Assignments**: Ownership transfers
- **Mergers & Acquisitions**: Corporate deals
- **Licensing**: Rights grants
- **Security Interests**: Collateral agreements
- **Joint Ventures**: Shared ownership`
    };

    return dictionaries[id] || '# Data Dictionary\n\nContent not available.';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading data dictionary...</div>
      </div>
    );
  }

  // Parse markdown to render tables
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    let inTable = false;
    let tableData: string[][] = [];
    let tableHeaders: string[] = [];
    const elements: JSX.Element[] = [];
    let key = 0;

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-2xl font-bold mb-4 text-gray-900">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-xl font-semibold mb-3 mt-6 text-gray-800">
            {line.substring(3)}
          </h2>
        );
      }
      // Tables
      else if (line.includes('|')) {
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
          tableData = [];
        } else if (line.includes('---')) {
          // Skip separator line
        } else {
          tableData.push(cells);
        }

        // Check if this is the last line of the table
        if (index === lines.length - 1 || !lines[index + 1].includes('|')) {
          if (inTable && tableData.length > 0) {
            elements.push(
              <div key={key++} className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableHeaders.map((header, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
            inTable = false;
            tableData = [];
            tableHeaders = [];
          }
        }
      }
      // Lists
      else if (line.startsWith('- ')) {
        elements.push(
          <li key={key++} className="ml-6 mb-1 text-gray-700 list-disc">
            {line.substring(2)}
          </li>
        );
      }
      // Bold text sections
      else if (line.includes('**')) {
        const parts = line.split('**');
        const formatted = parts.map((part, i) => 
          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        );
        elements.push(
          <p key={key++} className="mb-2 text-gray-700">
            {formatted}
          </p>
        );
      }
      // Regular paragraphs
      else if (line.trim()) {
        elements.push(
          <p key={key++} className="mb-2 text-gray-700">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="bg-white rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Table className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 max-h-[600px] overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          {renderMarkdown(content)}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FileText className="w-3 h-3" />
          <span>Data Dictionary Format: Markdown Table</span>
          <span className="mx-2">•</span>
          <span>Fields: JSON Structure</span>
          <span className="mx-2">•</span>
          <span>Version: 1.0.0</span>
        </div>
      </div>
    </div>
  );
}