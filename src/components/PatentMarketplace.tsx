import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  DollarSign,
  Calendar,
  MapPin,
  Award,
  FileText,
  Share2,
  ShoppingCart,
  Gavel,
  TrendingUp,
  CheckCircle,
  Download
} from 'lucide-react';
import { PatentListing, MarketplaceFilters } from '../types/marketplace';
import HarmonizedCard from './HarmonizedCard';
import PageHeader from './PageHeader';

// Mock data for patent listings
const mockPatentListings: PatentListing[] = [
  {
    id: 'pt-001',
    patentNumber: 'US10,123,456',
    title: 'Advanced Machine Learning Algorithm for Predictive Analytics',
    description: 'A revolutionary machine learning system that predicts market trends with 95% accuracy using novel neural network architectures.',
    abstract: 'This patent describes a comprehensive machine learning framework that combines deep learning, reinforcement learning, and traditional statistical methods to create highly accurate predictive models for various applications including financial markets, supply chain optimization, and customer behavior analysis.',
    inventor: 'Dr. Sarah Chen',
    assignee: 'TechInnovate Corp',
    filingDate: '2020-03-15',
    grantDate: '2022-11-08',
    expirationDate: '2040-03-15',
    jurisdictions: ['US', 'EU', 'JP', 'CN'],
    technologyArea: 'Artificial Intelligence',
    ipcCodes: ['G06N3/08', 'G06Q10/04'],
    citationCount: 47,
    listingType: 'sale',
    pricing: {
      salePrice: 2500000,
      currency: 'USD',
      negotiable: true,
      paymentTerms: ['Lump sum', 'Installments', 'Royalty conversion']
    },
    status: 'active',
    seller: {
      id: 'u-001',
      name: 'TechInnovate Corp',
      email: 'licensing@techinnovate.com',
      avatar: '/api/placeholder/40/40',
      type: 'company',
      verified: true,
      joinDate: '2019-01-15',
      location: 'Silicon Valley, CA'
    },
    listedDate: '2024-01-15',
    views: 1247,
    inquiries: 23,
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    documents: [
      {
        id: 'doc-1',
        name: 'Patent Specification.pdf',
        type: 'patent',
        size: 2048000,
        uploadDate: '2024-01-15',
        accessLevel: 'public'
      },
      {
        id: 'doc-2',
        name: 'Technical Analysis.pdf',
        type: 'technical_spec',
        size: 1024000,
        uploadDate: '2024-01-15',
        accessLevel: 'registered'
      }
    ],
    keywords: ['Machine Learning', 'AI', 'Predictive Analytics', 'Neural Networks'],
    estimatedValue: 2800000,
    valuationMethod: 'Income Approach',
    marketComparables: 15
  },
  {
    id: 'pt-002',
    patentNumber: 'US10,987,654',
    title: 'Blockchain-Based Supply Chain Tracking System',
    description: 'Innovative blockchain technology for transparent and secure supply chain management across multiple industries.',
    abstract: 'A comprehensive blockchain-based system that provides end-to-end tracking and verification of products throughout the supply chain, ensuring authenticity, reducing fraud, and improving consumer confidence.',
    inventor: 'Michael Rodriguez',
    assignee: 'BlockChain Solutions Inc',
    filingDate: '2019-08-22',
    grantDate: '2021-12-03',
    expirationDate: '2039-08-22',
    jurisdictions: ['US', 'CA', 'AU'],
    technologyArea: 'Blockchain Technology',
    ipcCodes: ['H04L9/06', 'G06Q10/08'],
    citationCount: 31,
    listingType: 'license',
    pricing: {
      licenseFee: 50000,
      royaltyRate: 5.5,
      minimumRoyalty: 25000,
      upfrontFee: 100000,
      currency: 'USD',
      negotiable: true,
      paymentTerms: ['Upfront + Royalty', 'Milestone payments']
    },
    status: 'active',
    seller: {
      id: 'u-002',
      name: 'BlockChain Solutions Inc',
      email: 'ip@blockchainsol.com',
      avatar: '/api/placeholder/40/40',
      type: 'company',
      verified: true,
      joinDate: '2018-06-10',
      location: 'Austin, TX'
    },
    listedDate: '2024-02-01',
    views: 892,
    inquiries: 17,
    images: ['/api/placeholder/400/300'],
    documents: [
      {
        id: 'doc-3',
        name: 'Patent Claims.pdf',
        type: 'patent',
        size: 1536000,
        uploadDate: '2024-02-01',
        accessLevel: 'public'
      }
    ],
    keywords: ['Blockchain', 'Supply Chain', 'Tracking', 'Security'],
    licensingOptions: {
      exclusiveAvailable: true,
      nonExclusiveAvailable: true,
      territorialRestrictions: ['North America', 'Europe', 'Asia-Pacific'],
      fieldOfUseRestrictions: ['Food & Beverage', 'Pharmaceuticals', 'Automotive'],
      duration: '10 years',
      sublicensingAllowed: false,
      improvementRights: true
    },
    estimatedValue: 1200000,
    valuationMethod: 'Market Approach',
    marketComparables: 8
  }
];

export default function PatentMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<PatentListing | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [_viewMode, _setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter patents based on search and filters
  const filteredPatents = useMemo(() => {
    let filtered = mockPatentListings;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(patent =>
        patent.title.toLowerCase().includes(query) ||
        patent.description.toLowerCase().includes(query) ||
        patent.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
        patent.technologyArea.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.listingType?.length) {
      filtered = filtered.filter(patent => filters.listingType!.includes(patent.listingType));
    }

    if (filters.technologyArea?.length) {
      filtered = filtered.filter(patent => filters.technologyArea!.includes(patent.technologyArea));
    }

    if (filters.priceRange) {
      filtered = filtered.filter(patent => {
        const price = patent.pricing.salePrice || patent.pricing.licenseFee || 0;
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
      });
    }

    return filtered;
  }, [searchQuery, filters]);

  const createPatentStats = (patent: PatentListing) => [
    {
      label: 'Price',
      value: patent.pricing.salePrice 
        ? `$${(patent.pricing.salePrice / 1000000).toFixed(1)}M`
        : `${patent.pricing.royaltyRate}% Royalty`,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Citations',
      value: patent.citationCount,
      icon: Award,
      color: 'text-blue-600'
    },
    {
      label: 'Views',
      value: patent.views,
      icon: Eye,
      color: 'text-gray-600'
    },
    {
      label: 'Inquiries',
      value: patent.inquiries,
      icon: MessageCircle,
      color: 'text-purple-600'
    }
  ];

  const createPatentKeywords = (patent: PatentListing) =>
    patent.keywords.map(keyword => ({
      label: keyword,
      color: 'bg-blue-100 text-blue-800'
    }));

  const createPatentAttributes = (patent: PatentListing) => [
    {
      label: 'Patent Number',
      value: patent.patentNumber,
      icon: FileText
    },
    {
      label: 'Technology Area',
      value: patent.technologyArea,
      icon: TrendingUp
    },
    {
      label: 'Jurisdiction',
      value: patent.jurisdictions.join(', '),
      icon: MapPin
    },
    {
      label: 'Grant Date',
      value: new Date(patent.grantDate).toLocaleDateString(),
      icon: Calendar
    }
  ];

  const createPatentActions = (patent: PatentListing) => [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: () => setSelectedListing(patent),
      variant: 'primary' as const,
      isPrimary: true
    },
    {
      id: 'inquire',
      label: patent.listingType === 'sale' ? 'Make Offer' : 'License Inquiry',
      icon: patent.listingType === 'sale' ? ShoppingCart : Gavel,
      onClick: () => handleInquiry(patent),
      variant: 'secondary' as const
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      onClick: () => handleShare(patent),
      variant: 'secondary' as const
    }
  ];

  const handleInquiry = (patent: PatentListing) => {
    // Handle inquiry/offer logic
    console.log('Inquiry for patent:', patent.id);
  };

  const handleShare = (patent: PatentListing) => {
    // Handle share logic
    console.log('Share patent:', patent.id);
  };

  return (
    <div className="h-full bg-gray-50">
      <PageHeader 
        title="Patent Marketplace" 
        subtitle="Discover, license, and acquire valuable patents"
      />

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search patents by title, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Type
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    listingType: e.target.value ? [e.target.value as 'sale' | 'license'] : undefined
                  })}
                >
                  <option value="">All Types</option>
                  <option value="sale">For Sale</option>
                  <option value="license">For License</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology Area
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    technologyArea: e.target.value ? [e.target.value] : undefined
                  })}
                >
                  <option value="">All Technologies</option>
                  <option value="Artificial Intelligence">AI</option>
                  <option value="Blockchain Technology">Blockchain</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Clean Energy">Clean Energy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: {
                      min: parseInt(e.target.value) || 0,
                      max: filters.priceRange?.max || 10000000
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  placeholder="10000000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: {
                      min: filters.priceRange?.min || 0,
                      max: parseInt(e.target.value) || 10000000
                    }
                  })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredPatents.length} patents found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded px-3 py-1">
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
              <option>Most Views</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patent Listings */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatents.map((patent) => (
            <HarmonizedCard
              key={patent.id}
              title={patent.title}
              description={patent.description}
              stats={createPatentStats(patent)}
              keywords={createPatentKeywords(patent)}
              attributes={createPatentAttributes(patent)}
              actions={createPatentActions(patent)}
              colorAccent={patent.listingType === 'sale' ? 'border-green-200' : 'border-blue-200'}
              onTitleClick={() => setSelectedListing(patent)}
              className="hover:shadow-lg transition-shadow"
            />
          ))}
        </div>

        {filteredPatents.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No patents found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>

      {/* Patent Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedListing.title}
                  </h2>
                  <p className="text-gray-600">{selectedListing.patentNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-700">{selectedListing.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Abstract</h3>
                    <p className="text-gray-700 text-sm">{selectedListing.abstract}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Key Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Inventor:</span>
                        <p>{selectedListing.inventor}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Assignee:</span>
                        <p>{selectedListing.assignee}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Filing Date:</span>
                        <p>{new Date(selectedListing.filingDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Grant Date:</span>
                        <p>{new Date(selectedListing.grantDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Pricing</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedListing.pricing.salePrice ? (
                        <div>
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            ${selectedListing.pricing.salePrice.toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-600">Sale Price</p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            {selectedListing.pricing.royaltyRate}%
                          </div>
                          <p className="text-sm text-gray-600">Royalty Rate</p>
                          {selectedListing.pricing.upfrontFee && (
                            <p className="text-sm mt-2">
                              Upfront Fee: ${selectedListing.pricing.upfrontFee.toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                      {selectedListing.pricing.negotiable && (
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Negotiable
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Seller Information</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={selectedListing.seller.avatar} 
                        alt={selectedListing.seller.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{selectedListing.seller.name}</div>
                        <div className="text-sm text-gray-600">{selectedListing.seller.location}</div>
                      </div>
                      {selectedListing.seller.verified && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Documents</h3>
                    <div className="space-y-2">
                      {selectedListing.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <div>
                              <div className="font-medium text-sm">{doc.name}</div>
                              <div className="text-xs text-gray-600">
                                {(doc.size / 1024 / 1024).toFixed(1)} MB
                              </div>
                            </div>
                          </div>
                          <Download className="h-4 w-4 text-blue-600 cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                      {selectedListing.listingType === 'sale' ? (
                        <>
                          <ShoppingCart className="h-5 w-5" />
                          Make Offer
                        </>
                      ) : (
                        <>
                          <Gavel className="h-5 w-5" />
                          License Inquiry
                        </>
                      )}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}