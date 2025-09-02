import { useState, useEffect } from 'react';
import { 
  Home, 
  ChevronRight, 
  ChevronDown,
  Calendar, 
  Flag, 
  MapPin, 
  Users, 
  FileText, 
  Hash, 
  Scale, 
  Archive, 
  User, 
  Search,
  Plus,
  Filter,
  HelpCircle,
  Info,
  Globe,
  Loader2
} from 'lucide-react';
import { patentDatabase, SearchFilters, SearchResult, PatentWithRelations, Patent } from '@/lib/patentDatabase';
import PatentDetailsModal from './PatentDetailsModal';

interface PatentSearchProps {
  onStartTour?: () => void;
}

export default function PatentSearch({ onStartTour: _onStartTour }: PatentSearchProps) {
  const [selectedField, setSelectedField] = useState('All Fields');
  const [searchQuery, setSearchQuery] = useState('');
  const [predicate, setPredicate] = useState('AND');
  const [expandedMainSections, setExpandedMainSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('structured');
  const [queryText, setQueryText] = useState('');
  
  // New state for patent data
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [databaseStats, setDatabaseStats] = useState<any>(null);
  const [_selectedFilters, _setSelectedFilters] = useState<SearchFilters>({});
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dateType, setDateType] = useState<'published' | 'filed' | 'priority'>('published');
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([]);
  const [_selectedClassifications, _setSelectedClassifications] = useState<string[]>([]);
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<string[]>([]);
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const [_hasFullText, _setHasFullText] = useState<boolean>(false);
  const [selectedPatent, setSelectedPatent] = useState<PatentWithRelations | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const toggleMainSection = (sectionId: string) => {
    setExpandedMainSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Load database statistics on component mount
  useEffect(() => {
    const loadDatabaseStats = async () => {
      try {
        const stats = await patentDatabase.getDatabaseStats();
        setDatabaseStats(stats);
      } catch (error) {
        console.error('Failed to load database stats:', error);
      }
    };

    loadDatabaseStats();
  }, []);

  // Perform patent search
  const performSearch = async () => {
    if (!searchQuery.trim() && Object.keys(_selectedFilters).length === 0) {
      return;
    }

    setIsSearching(true);
    try {
      const filters: SearchFilters = {
        query: searchQuery,
        field: selectedField === 'All Fields' ? undefined : selectedField,
        ...(dateFrom || dateTo ? {
          dateRange: {
            type: dateType,
            from: dateFrom || undefined,
            to: dateTo || undefined
          }
        } : {}),
        ...(selectedJurisdictions.length > 0 ? { jurisdictions: selectedJurisdictions } : {}),
        ...(_selectedClassifications.length > 0 ? {
          classifications: {
            scheme: 'CPC',
            codes: _selectedClassifications
          }
        } : {}),
        ...(selectedDocumentTypes.length > 0 ? { documentTypes: selectedDocumentTypes } : {}),
        ...(_hasFullText ? { hasFullText: true } : {})
      };

      const results = await patentDatabase.searchPatents(filters, 50, 0);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle filter changes
  const toggleJurisdiction = (code: string) => {
    setSelectedJurisdictions(prev => 
      prev.includes(code) 
        ? prev.filter(j => j !== code)
        : [...prev, code]
    );
  };

  const toggleDocumentType = (docType: string) => {
    setSelectedDocumentTypes(prev => 
      prev.includes(docType) 
        ? prev.filter(d => d !== docType)
        : [...prev, docType]
    );
  };

  const toggleFlag = (flag: string) => {
    setSelectedFlags(prev => 
      prev.includes(flag) 
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  // Handle viewing patent details
  const handleViewDetails = async (patent: PatentWithRelations) => {
    try {
      // If we need more detailed information, fetch it
      const detailedPatent = await patentDatabase.getPatentById(patent.id);
      setSelectedPatent(detailedPatent || patent);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch patent details:', error);
      // Fallback to current patent data
      setSelectedPatent(patent);
      setIsDetailsModalOpen(true);
    }
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPatent(null);
  };

  const filterSections = [
    { 
      icon: Calendar, 
      label: 'Date Range', 
      id: 'date-range', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: Flag, 
      label: 'Flags', 
      id: 'flags', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: MapPin, 
      label: 'Jurisdiction', 
      id: 'jurisdiction', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: Users, 
      label: 'Applicants', 
      id: 'applicants', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: User, 
      label: 'Inventors', 
      id: 'inventors', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: Users, 
      label: 'Owners', 
      id: 'owners', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: Users, 
      label: 'Agents & Attorneys', 
      id: 'agents', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: Scale, 
      label: 'Legal Status', 
      id: 'legal-status', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: FileText, 
      label: 'Document Type', 
      id: 'document-type', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: Hash, 
      label: 'Cited Works', 
      id: 'cited-works', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: Archive, 
      label: 'Biologicals', 
      id: 'biologicals', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: Hash, 
      label: 'Classifications', 
      id: 'classifications', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: FileText, 
      label: 'Document Family', 
      id: 'document-family', 
      count: null,
      hasSubmenu: true 
    },
    { 
      icon: Search, 
      label: 'Query Tools', 
      id: 'query-tools', 
      count: null,
      hasSubmenu: true 
    }
  ];

  const searchTabs = [
    { id: 'structured', label: 'Structured Search' },
    { id: 'text-editor', label: 'Query Text Editor' },
    { id: 'profiles', label: 'Profiles' }
  ];

  const rightTabs = [
    { id: 'data-set', label: 'Data Set', active: true },
    { id: 'search-tips', label: 'Search Tips', active: false },
    { id: 'fields', label: 'Fields', active: false },
    { id: 'presets', label: 'Presets', active: false }
  ];

  const fieldOptions = [
    'All Fields',
    'Title',
    'Abstract',
    'Claims',
    'Description',
    'Inventor',
    'Applicant',
    'Owner',
    'Patent Number',
    'Application Number',
    'Priority Number',
    'Publication Date',
    'Filing Date',
    'Priority Date',
    'Classification'
  ];

  const flagOptions = [
    'Has Title', 'Has Abstract', 'Has Claim',
    'Has Description', 'Has Full Text', 'Has Disclaimer',
    'Application Has Granted Patent', 'Has Grant Event', 'Has National Phase Entry',
    'Has Legal Events', 'Has DOCDB', 'Has Applicant',
    'Has Owner', 'Has Inventor', 'Has Agent',
    'Has Examiner', 'Has Sequence Listing', 'Cited By Patent',
    'Cites NPL', 'Cites Patent', 'Cites Resolved NPL'
  ];

  const documentTypes = [
    'Patent Application', 'Granted Patent', 'Limited Patent',
    'Unknown Document', 'Search Report', 'Design Right',
    'Patent of Addition', 'Abstract', 'Amended Patent',
    'Amended Application', 'Ambiguous', 'Plant Patent',
    'SPC', 'Statutory Invention Registration'
  ];

  const jurisdictions = [
    { name: 'Algeria', flag: '🇩🇿', code: 'DZ' },
    { name: 'Argentina', flag: '🇦🇷', code: 'AR' },
    { name: 'ARIPO Patents', flag: '🌍', code: 'ARIPO' },
    { name: 'Armenia', flag: '🇦🇲', code: 'AM' },
    { name: 'Australia', flag: '🇦🇺', code: 'AU' },
    { name: 'Austria', flag: '🇦🇹', code: 'AT' },
    { name: 'Belarus', flag: '🇧🇾', code: 'BY' },
    { name: 'Belgium', flag: '🇧🇪', code: 'BE' },
    { name: 'Bosnia and Herzegovina', flag: '🇧🇦', code: 'BA' },
    { name: 'Brazil', flag: '🇧🇷', code: 'BR' },
    { name: 'Bulgaria', flag: '🇧🇬', code: 'BG' },
    { name: 'Canada', flag: '🇨🇦', code: 'CA' },
    { name: 'Chile', flag: '🇨🇱', code: 'CL' },
    { name: 'China', flag: '🇨🇳', code: 'CN' },
    { name: 'Colombia', flag: '🇨🇴', code: 'CO' },
    { name: 'Congo', flag: '🇨🇬', code: 'CG' },
    { name: 'Costa Rica', flag: '🇨🇷', code: 'CR' },
    { name: 'Croatia', flag: '🇭🇷', code: 'HR' },
    { name: 'Cuba', flag: '🇨🇺', code: 'CU' },
    { name: 'Cyprus', flag: '🇨🇾', code: 'CY' },
    { name: 'Czech Republic', flag: '🇨🇿', code: 'CZ' },
    { name: 'Czechoslovakia', flag: '🏛️', code: 'CS' },
    { name: 'Denmark', flag: '🇩🇰', code: 'DK' },
    { name: 'Dominican Republic', flag: '🇩🇴', code: 'DO' },
    { name: 'Ecuador', flag: '🇪🇨', code: 'EC' },
    { name: 'Egypt', flag: '🇪🇬', code: 'EG' },
    { name: 'El Salvador', flag: '🇸🇻', code: 'SV' },
    { name: 'Estonia', flag: '🇪🇪', code: 'EE' },
    { name: 'Eurasian Patents', flag: '🌍', code: 'EA' },
    { name: 'European Patents', flag: '🇪🇺', code: 'EP' },
    { name: 'European Trademark Office', flag: '🇪🇺', code: 'EUIPO' },
    { name: 'Finland', flag: '🇫🇮', code: 'FI' },
    { name: 'France', flag: '🇫🇷', code: 'FR' },
    { name: 'GCC Patents', flag: '🌍', code: 'GCC' },
    { name: 'Georgia', flag: '🇬🇪', code: 'GE' },
    { name: 'German Democratic Republic', flag: '🏛️', code: 'DD' },
    { name: 'Germany', flag: '🇩🇪', code: 'DE' },
    { name: 'Greece', flag: '🇬🇷', code: 'GR' },
    { name: 'Guatemala', flag: '🇬🇹', code: 'GT' },
    { name: 'Honduras', flag: '🇭🇳', code: 'HN' },
    { name: 'Hong Kong', flag: '🇭🇰', code: 'HK' },
    { name: 'Hungary', flag: '🇭🇺', code: 'HU' },
    { name: 'Iceland', flag: '🇮🇸', code: 'IS' },
    { name: 'India', flag: '🇮🇳', code: 'IN' },
    { name: 'Indonesia', flag: '🇮🇩', code: 'ID' },
    { name: 'Ireland', flag: '🇮🇪', code: 'IE' },
    { name: 'Israel', flag: '🇮🇱', code: 'IL' },
    { name: 'Italy', flag: '🇮🇹', code: 'IT' },
    { name: 'Japan', flag: '🇯🇵', code: 'JP' },
    { name: 'Jordan', flag: '🇯🇴', code: 'JO' },
    { name: 'Kazakhstan', flag: '🇰🇿', code: 'KZ' },
    { name: 'Kenya', flag: '🇰🇪', code: 'KE' },
    { name: 'Korea, Republic of', flag: '🇰🇷', code: 'KR' },
    { name: 'Kyrgyzstan', flag: '🇰🇬', code: 'KG' },
    { name: 'Latvia', flag: '🇱🇻', code: 'LV' },
    { name: 'Lithuania', flag: '🇱🇹', code: 'LT' },
    { name: 'Luxembourg', flag: '🇱🇺', code: 'LU' },
    { name: 'Macau', flag: '🇲🇴', code: 'MO' },
    { name: 'Malawi', flag: '🇲🇼', code: 'MW' },
    { name: 'Malaysia', flag: '🇲🇾', code: 'MY' },
    { name: 'Malta', flag: '🇲🇹', code: 'MT' },
    { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
    { name: 'Moldova', flag: '🇲🇩', code: 'MD' },
    { name: 'Monaco', flag: '🇲🇨', code: 'MC' },
    { name: 'Mongolia', flag: '🇲🇳', code: 'MN' },
    { name: 'Montenegro', flag: '🇲🇪', code: 'ME' },
    { name: 'Morocco', flag: '🇲🇦', code: 'MA' },
    { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
    { name: 'New Zealand', flag: '🇳🇿', code: 'NZ' },
    { name: 'Nicaragua', flag: '🇳🇮', code: 'NI' },
    { name: 'Norway', flag: '🇳🇴', code: 'NO' },
    { name: 'OAPI Patents', flag: '🌍', code: 'OAPI' },
    { name: 'Panama', flag: '🇵🇦', code: 'PA' },
    { name: 'Peru', flag: '🇵🇪', code: 'PE' },
    { name: 'Philippines', flag: '🇵🇭', code: 'PH' },
    { name: 'Poland', flag: '🇵🇱', code: 'PL' },
    { name: 'Portugal', flag: '🇵🇹', code: 'PT' },
    { name: 'Romania', flag: '🇷🇴', code: 'RO' },
    { name: 'Russia', flag: '🇷🇺', code: 'RU' },
    { name: 'San Marino', flag: '🇸🇲', code: 'SM' },
    { name: 'Saudi Arabia', flag: '🇸🇦', code: 'SA' },
    { name: 'Serbia', flag: '🇷🇸', code: 'RS' },
    { name: 'Singapore', flag: '🇸🇬', code: 'SG' },
    { name: 'Slovakia', flag: '🇸🇰', code: 'SK' },
    { name: 'Slovenia', flag: '🇸🇮', code: 'SI' },
    { name: 'South Africa', flag: '🇿🇦', code: 'ZA' },
    { name: 'Soviet Union', flag: '🏛️', code: 'SU' },
    { name: 'Spain', flag: '🇪🇸', code: 'ES' },
    { name: 'Sweden', flag: '🇸🇪', code: 'SE' },
    { name: 'Switzerland', flag: '🇨🇭', code: 'CH' },
    { name: 'Taiwan', flag: '🇹🇼', code: 'TW' },
    { name: 'Tajikistan', flag: '🇹🇯', code: 'TJ' },
    { name: 'Thailand', flag: '🇹🇭', code: 'TH' },
    { name: 'Trinidad and Tobago', flag: '🇹🇹', code: 'TT' },
    { name: 'Tunisia', flag: '🇹🇳', code: 'TN' },
    { name: 'Turkey', flag: '🇹🇷', code: 'TR' },
    { name: 'Ukraine', flag: '🇺🇦', code: 'UA' },
    { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
    { name: 'United States', flag: '🇺🇸', code: 'US' },
    { name: 'Uruguay', flag: '🇺🇾', code: 'UY' },
    { name: 'Uzbekistan', flag: '🇺🇿', code: 'UZ' },
    { name: 'Viet Nam', flag: '🇻🇳', code: 'VN' },
    { name: 'WO - WIPO', flag: '🌍', code: 'WO' },
    { name: 'Yugoslavia/Serbia and Montenegro', flag: '🏛️', code: 'YU' },
    { name: 'Zambia', flag: '🇿🇲', code: 'ZM' },
    { name: 'Zimbabwe', flag: '🇿🇼', code: 'ZW' }
  ];

  const classificationsData = [
    { code: 'A', title: 'human necessities', icon: '👤' },
    { code: 'B', title: 'performing operations transporting', icon: '🔧' },
    { code: 'C', title: 'chemistry metallurgy', icon: '🧪' },
    { code: 'D', title: 'textiles paper', icon: '📄' },
    { code: 'E', title: 'fixed constructions', icon: '🏗️' },
    { code: 'F', title: 'mechanical engineering lighting heating', icon: '⚙️' },
    { code: 'G', title: 'physics', icon: '🔬' },
    { code: 'H', title: 'electricity', icon: '⚡' }
  ];

  const DateRangeSection = () => (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-gray-900">Date Range</span>
        <button 
          onClick={() => toggleMainSection('date-range')}
          className="ml-auto"
        >
          {expandedMainSections.includes('date-range') ? 
            <ChevronDown className="w-4 h-4 text-gray-400" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400" />
          }
        </button>
      </div>
      
      {expandedMainSections.includes('date-range') && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="dateType" 
                value="published" 
                checked={dateType === 'published'}
                onChange={(e) => setDateType(e.target.value as 'published' | 'filed' | 'priority')}
              />
              <span className="text-sm">Published</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="dateType" 
                value="filed" 
                checked={dateType === 'filed'}
                onChange={(e) => setDateType(e.target.value as 'published' | 'filed' | 'priority')}
              />
              <span className="text-sm">Filed</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="dateType" 
                value="priority" 
                checked={dateType === 'priority'}
                onChange={(e) => setDateType(e.target.value as 'published' | 'filed' | 'priority')}
              />
              <span className="text-sm">Priority</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">from</label>
              <input 
                type="date" 
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">to</label>
              <input 
                type="date" 
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const FlagsSection = () => (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Flag className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-gray-900">Flags</span>
        {selectedFlags.length > 0 && (
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {selectedFlags.length}
          </span>
        )}
        <button 
          onClick={() => toggleMainSection('flags')}
          className="ml-auto"
        >
          {expandedMainSections.includes('flags') ? 
            <ChevronDown className="w-4 h-4 text-gray-400" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400" />
          }
        </button>
      </div>
      
      {expandedMainSections.includes('flags') && (
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
          {flagOptions.map((flag, index) => (
            <label key={index} className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                className="rounded" 
                checked={selectedFlags.includes(flag)}
                onChange={() => toggleFlag(flag)}
              />
              <span className="text-gray-700">{flag}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const ClassificationsSection = () => (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-gray-900">Classifications</span>
        <button 
          onClick={() => toggleMainSection('classifications')}
          className="ml-auto"
        >
          {expandedMainSections.includes('classifications') ? 
            <ChevronDown className="w-4 h-4 text-gray-400" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400" />
          }
        </button>
      </div>
      
      {expandedMainSections.includes('classifications') && (
        <div className="space-y-4">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Explore Patent Classifications"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 mb-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="classificationType" value="cpc" defaultChecked />
              <span className="text-sm font-medium">CPC</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="classificationType" value="ipc" />
              <span className="text-sm">IPC</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="classificationType" value="us" />
              <span className="text-sm">US</span>
            </label>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {classificationsData.map((item) => (
              <div key={item.code} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-sm font-mono">
                    {item.code}
                  </span>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-blue-600 underline cursor-pointer">{item.title}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const JurisdictionsSection = () => (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-gray-900">Jurisdictions</span>
        {selectedJurisdictions.length > 0 && (
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {selectedJurisdictions.length}
          </span>
        )}
        <button 
          onClick={() => toggleMainSection('jurisdictions')}
          className="ml-auto"
        >
          {expandedMainSections.includes('jurisdictions') ? 
            <ChevronDown className="w-4 h-4 text-gray-400" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400" />
          }
        </button>
      </div>
      
      {expandedMainSections.includes('jurisdictions') && (
        <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
          {jurisdictions.map((jurisdiction, index) => (
            <label key={index} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded text-sm">
              <input 
                type="checkbox" 
                className="rounded" 
                checked={selectedJurisdictions.includes(jurisdiction.code)}
                onChange={() => toggleJurisdiction(jurisdiction.code)}
              />
              <span className="text-lg">{jurisdiction.flag}</span>
              <span className="text-gray-700">{jurisdiction.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const DocumentTypeSection = () => (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-gray-900">Document Type</span>
        {selectedDocumentTypes.length > 0 && (
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {selectedDocumentTypes.length}
          </span>
        )}
        <button 
          onClick={() => toggleMainSection('document-type')}
          className="ml-auto"
        >
          {expandedMainSections.includes('document-type') ? 
            <ChevronDown className="w-4 h-4 text-gray-400" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400" />
          }
        </button>
      </div>
      
      {expandedMainSections.includes('document-type') && (
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
          {documentTypes.map((docType, index) => (
            <label key={index} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded text-sm">
              <input 
                type="checkbox" 
                className="rounded" 
                checked={selectedDocumentTypes.includes(docType)}
                onChange={() => toggleDocumentType(docType)}
              />
              <span className="text-gray-700">{docType}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const QueryLanguageSection = () => (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-gray-900">Query Language</span>
        <button 
          onClick={() => toggleMainSection('query-language')}
          className="ml-auto"
        >
          {expandedMainSections.includes('query-language') ? 
            <ChevronDown className="w-4 h-4 text-gray-400" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400" />
          }
        </button>
      </div>
      
      {expandedMainSections.includes('query-language') && (
        <div className="p-2">
          <select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="chinese">Chinese</option>
            <option value="japanese">Japanese</option>
          </select>
        </div>
      )}
    </div>
  );

  const QueryToolsSection = () => (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-gray-900">Query Tools</span>
        <button 
          onClick={() => toggleMainSection('query-tools')}
          className="ml-auto"
        >
          {expandedMainSections.includes('query-tools') ? 
            <ChevronDown className="w-4 h-4 text-gray-400" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400" />
          }
        </button>
      </div>
      
      {expandedMainSections.includes('query-tools') && (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="rounded" />
            <span className="text-gray-700">Query contains regular expression</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-gray-700">Stemmed</span>
            <Info className="w-4 h-4 text-gray-400" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="rounded" />
            <span className="text-gray-700">Inventorship</span>
            <Info className="w-4 h-4 text-gray-400" />
          </label>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Filters */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
              <Filter className="w-4 h-4 text-orange-600" />
            </div>
            <span className="font-medium text-gray-900">FILTERS</span>
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">0</span>
            </div>
          </div>

          <div className="space-y-1">
            {filterSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={section.id}
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 cursor-pointer group"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="flex-1 text-sm text-gray-700">{section.label}</span>
                  {section.hasSubmenu && (
                    <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Home className="w-4 h-4" />
            <span>
              {databaseStats ? (
                `${databaseStats.totalPatents.toLocaleString()} Patents (${Math.floor(databaseStats.totalPatents * 0.56).toLocaleString()} Simple families)`
              ) : (
                'Loading patent statistics...'
              )}
            </span>
          </div>

          {/* Header with Search Button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">New Patent Search</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Explore Science, Technology & Innovation...</span>
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <button 
                onClick={performSearch}
                disabled={isSearching}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {isSearching ? 'Searching...' : 'Search'}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Type Selector */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Patents</span>
              <span className="text-sm text-blue-600">(165,281,274)</span>
            </div>
            <span className="text-gray-400">=</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">All Docs</span>
            </div>
          </div>

          {/* Filters Applied */}
          <div className="mb-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Filters:</span> No filters applied
            </div>
          </div>

          {/* Statistics Row */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            <div className="text-center">
              <div className="text-blue-600 text-sm font-medium mb-1">Patent Records</div>
              <div className="text-2xl font-bold text-gray-900">
                {databaseStats ? databaseStats.totalPatents.toLocaleString() : '...'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Patent Citations</div>
              <div className="text-2xl font-bold text-gray-900">
                {databaseStats ? databaseStats.totalCitations.toLocaleString() : '...'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Total Inventors</div>
              <div className="text-2xl font-bold text-gray-900">
                {databaseStats ? databaseStats.totalInventors.toLocaleString() : '...'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Total Assignees</div>
              <div className="text-2xl font-bold text-gray-900">
                {databaseStats ? databaseStats.totalAssignees.toLocaleString() : '...'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-teal-600 text-sm font-medium mb-1">Classifications</div>
              <div className="text-2xl font-bold text-gray-900">
                {databaseStats ? databaseStats.totalClassifications.toLocaleString() : '...'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Last Updated</div>
              <div className="text-sm font-medium text-gray-700">
                {databaseStats ? new Date(databaseStats.lastUpdated).toLocaleDateString() : '...'}
              </div>
            </div>
          </div>

          {/* Search Interface Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              {searchTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Form - Structured Search */}
          {activeTab === 'structured' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-12 gap-4 items-center mb-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Field</label>
                </div>
                <div className="col-span-1">
                  <label className="text-sm font-medium text-gray-700">Predicate</label>
                </div>
                <div className="col-span-9"></div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2">
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    {fieldOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-1 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      id="and"
                      name="predicate"
                      value="AND"
                      checked={predicate === 'AND'}
                      onChange={(e) => setPredicate(e.target.value)}
                      className="text-green-600"
                    />
                    <label htmlFor="and" className="text-sm text-gray-700">AND</label>
                  </div>
                  <span className="text-gray-400">OR</span>
                </div>

                <div className="col-span-8">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. malaria"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="col-span-1">
                  <button className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700">
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Expandable Sections */}
              <div className="mt-6 border border-gray-200 rounded">
                <DateRangeSection />
                <FlagsSection />
                <ClassificationsSection />
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="flex-1 text-left text-sm font-medium text-gray-700">ORCID Lookup</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <JurisdictionsSection />
                <DocumentTypeSection />
                <QueryLanguageSection />
                <QueryToolsSection />
              </div>

              {/* Search Button */}
              <div className="mt-6">
                <button 
                  onClick={performSearch}
                  disabled={isSearching}
                  className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Query Text Editor */}
          {activeTab === 'text-editor' && (
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Patent Query</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-sm text-gray-600">All Documents</span>
                </div>
                <div className="text-sm font-medium text-gray-700">Query Status:</div>
              </div>

              {/* Query Text Area */}
              <div className="p-4">
                <div className="relative">
                  <textarea
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Start typing your boolean query in here. Fields will be suggested below."
                    className="w-full h-80 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500 font-mono text-sm"
                    style={{ backgroundColor: '#fafafa' }}
                  />
                  <button className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs">×</span>
                  </button>
                </div>

                {/* Operator Buttons */}
                <div className="flex gap-2 mt-4 justify-end">
                  <button
                    onClick={() => setQueryText(prev => prev + ' AND ')}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm font-medium"
                  >
                    AND
                  </button>
                  <button
                    onClick={() => setQueryText(prev => prev + ' OR ')}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm font-medium"
                  >
                    OR
                  </button>
                  <button
                    onClick={() => setQueryText(prev => prev + ' NOT ')}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm font-medium"
                  >
                    NOT
                  </button>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Info className="w-4 h-4" />
                      <span>Keyboard Shortcuts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Info className="w-4 h-4" />
                      <span>Query Length Advice</span>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="mt-6">
                  <button 
                    onClick={performSearch}
                    disabled={isSearching}
                    className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profiles Tab */}
          {activeTab === 'profiles' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Profiles</h3>
                <p className="text-gray-600">Profile search functionality coming soon...</p>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchResults && (
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              {/* Results Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Search Results ({searchResults.totalCount.toLocaleString()} patents found)
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Sort by: Relevance</span>
                    <select className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option>Relevance</option>
                      <option>Grant Date (newest)</option>
                      <option>Grant Date (oldest)</option>
                      <option>Filing Date (newest)</option>
                      <option>Filing Date (oldest)</option>
                    </select>
                  </div>
                </div>

                {/* Applied Filters */}
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      Query: "{searchQuery}"
                      <button className="ml-1 hover:text-blue-600">
                        ×
                      </button>
                    </span>
                  )}
                  {selectedJurisdictions.map(jurisdiction => (
                    <span key={jurisdiction} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                      Jurisdiction: {jurisdiction}
                      <button 
                        onClick={() => toggleJurisdiction(jurisdiction)}
                        className="ml-1 hover:text-green-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {(dateFrom || dateTo) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                      Date: {dateFrom || 'any'} to {dateTo || 'any'} ({dateType})
                      <button 
                        onClick={() => { setDateFrom(''); setDateTo(''); }}
                        className="ml-1 hover:text-purple-600"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* Results List */}
              <div className="divide-y divide-gray-200">
                {searchResults.patents.map((patent, _index) => (
                  <div key={patent.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Patent Number and Status */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-blue-600">
                            {patent.patent_number}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded capitalize ${
                            patent.status === 'active' ? 'bg-green-100 text-green-800' :
                            patent.status === 'expired' ? 'bg-red-100 text-red-800' :
                            patent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {patent.status}
                          </span>
                          {patent.full_text_available && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              Full Text
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                          {patent.title}
                        </h3>

                        {/* Abstract */}
                        {patent.abstract_text && (
                          <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3">
                            {patent.abstract_text}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Filing Date:</span> {new Date(patent.filing_date).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Grant Date:</span> {new Date(patent.grant_date).toLocaleDateString()}
                          </div>
                          {patent.claims_count && (
                            <div>
                              <span className="font-medium">Claims:</span> {patent.claims_count}
                            </div>
                          )}
                          {patent.page_count && (
                            <div>
                              <span className="font-medium">Pages:</span> {patent.page_count}
                            </div>
                          )}
                        </div>

                        {/* Inventors & Assignees */}
                        <div className="mt-3 space-y-2">
                          {patent.inventors.length > 0 && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Inventors: </span>
                              <span className="text-gray-600">
                                {patent.inventors.map(inv => `${inv.first_name} ${inv.last_name}`).join(', ')}
                              </span>
                            </div>
                          )}
                          {patent.assignees.length > 0 && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Assignees: </span>
                              <span className="text-gray-600">
                                {patent.assignees.map(asg => asg.name).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Classifications */}
                        {patent.classifications.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {patent.classifications.slice(0, 5).map((cls, clsIndex) => (
                              <span 
                                key={clsIndex}
                                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {cls.full_code}
                              </span>
                            ))}
                            {patent.classifications.length > 5 && (
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                                +{patent.classifications.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="ml-6 flex flex-col gap-2">
                        <button 
                          onClick={() => handleViewDetails(patent)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded hover:bg-blue-50"
                        >
                          View Details
                        </button>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                          Save to Collection
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {searchResults.totalCount > 50 && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing 1 to {Math.min(50, searchResults.totalCount)} of {searchResults.totalCount.toLocaleString()} results
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        1
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        2
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        3
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-500">...</span>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4">
          {/* Right Sidebar Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200">
            {rightTabs.map((tab) => (
              <button
                key={tab.id}
                className={`pb-2 px-1 border-b-2 font-medium text-xs ${
                  tab.active
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Patent Data & Jurisdictions */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Patent Data & Jurisdictions</h3>
            <div className="bg-teal-50 rounded p-3 mb-4">
              <div className="flex items-center gap-2 text-teal-700 text-xs mb-2">
                <Info className="w-3 h-3" />
                <span>Last updated: Jul 31, 2025 (Release 202531). Updates are performed on a weekly basis at the present time.</span>
              </div>
            </div>

            {/* World Map Visualization */}
            <div className="bg-gray-50 rounded p-4 mb-4">
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                <Globe className="w-16 h-16 text-blue-400" />
              </div>
            </div>

            <div className="text-xs text-gray-600 mb-4">
              Check out the latest stats on the innospot patent data (coverage, date range, and various accessible metadata). Stats on patent sequence data can be found in Patent Data and are updated on a monthly basis at present time.
            </div>

            {/* Further breakdown section */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Further breakdown of patent records</h4>
              <div className="text-xs text-gray-500 mb-3">Source: 26 total jurisdictions</div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-medium text-gray-900">The European Patent Office's DOCDB bibliographic data</span> from the 1700's - present: 130+ million documents from over 100 jurisdictions.
                </div>

                <div>
                  <span className="font-medium text-gray-900">USPTO Applications</span> from 2001 – present with full text and images.
                </div>

                <div>
                  <span className="font-medium text-gray-900">USPTO Grants</span> from 1976 – present with full text and images.
                </div>

                <div>
                  <span className="font-medium text-gray-900">INPADOC and USPTO Assignment legal events</span> for 92+ million patents
                </div>

                <div>
                  <span className="font-medium text-gray-900">European Patent Office (EP) Applications</span> from 1978 – present with full text and images.
                </div>

                <div>
                  <span className="font-medium text-gray-900">European Patent Office (EP) Grants</span> from 1980 – present with full text and images.
                </div>

                <div>
                  <span className="font-medium text-gray-900">WIPO PCT Applications</span> from 1978 – present with full text and images.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patent Details Modal */}
      <PatentDetailsModal 
        patent={selectedPatent as Patent | null}
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
      />
    </div>
  );
}