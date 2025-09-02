// Marketplace & Monetization Types
export interface PatentListing {
  id: string;
  patentNumber: string;
  title: string;
  description: string;
  abstract: string;
  inventor: string;
  assignee: string;
  filingDate: string;
  grantDate: string;
  expirationDate: string;
  jurisdictions: string[];
  technologyArea: string;
  ipcCodes: string[];
  citationCount: number;
  
  // Marketplace specific fields
  listingType: 'sale' | 'license';
  pricing: PatentPricing;
  status: 'active' | 'pending' | 'sold' | 'withdrawn';
  seller: MarketplaceUser;
  listedDate: string;
  views: number;
  inquiries: number;
  images: string[];
  documents: PatentDocument[];
  keywords: string[];
  
  // Licensing specific
  licensingOptions?: LicensingOptions;
  exclusivityOptions?: ExclusivityOption[];
  
  // Valuation
  estimatedValue: number;
  valuationMethod: string;
  marketComparables: number;
}

export interface PatentPricing {
  salePrice?: number;
  licenseFee?: number;
  royaltyRate?: number;
  minimumRoyalty?: number;
  upfrontFee?: number;
  currency: string;
  negotiable: boolean;
  paymentTerms: string[];
}

export interface LicensingOptions {
  exclusiveAvailable: boolean;
  nonExclusiveAvailable: boolean;
  territorialRestrictions: string[];
  fieldOfUseRestrictions: string[];
  duration: string;
  sublicensingAllowed: boolean;
  improvementRights: boolean;
}

export interface ExclusivityOption {
  type: 'exclusive' | 'non-exclusive' | 'sole';
  territory: string;
  fieldOfUse: string;
  duration: string;
  pricing: PatentPricing;
}

export interface PatentDocument {
  id: string;
  name: string;
  type: 'patent' | 'prosecution_history' | 'valuation' | 'legal_opinion' | 'technical_spec';
  size: number;
  uploadDate: string;
  accessLevel: 'public' | 'registered' | 'interested' | 'premium';
}

// Data Marketplace Types
export interface DatasetListing {
  id: string;
  name: string;
  description: string;
  category: 'patent_data' | 'market_analysis' | 'competitor_intelligence' | 'technology_trends';
  provider: MarketplaceUser;
  
  // Dataset details
  recordCount: number;
  fields: DatasetField[];
  updateFrequency: 'real-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastUpdated: string;
  dataQuality: number; // 0-100 score
  coverage: DataCoverage;
  
  // Pricing and access
  pricing: DataPricing;
  accessTypes: DataAccessType[];
  sampleData: any[];
  
  // Marketplace
  status: 'active' | 'pending' | 'deprecated';
  listedDate: string;
  downloads: number;
  rating: number;
  reviews: DatasetReview[];
  tags: string[];
}

export interface DatasetField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'object';
  description: string;
  required: boolean;
  format?: string;
}

export interface DataCoverage {
  geographicRegions: string[];
  timeRange: {
    start: string;
    end: string;
  };
  industries: string[];
  technologies: string[];
}

export interface DataPricing {
  model: 'subscription' | 'pay_per_use' | 'one_time' | 'freemium';
  tiers: PricingTier[];
  currency: string;
  freeTrialDays?: number;
}

export interface PricingTier {
  name: string;
  price: number;
  period?: 'month' | 'year';
  features: string[];
  limits: {
    apiCalls?: number;
    downloads?: number;
    records?: number;
  };
}

export interface DataAccessType {
  type: 'api' | 'download' | 'dashboard' | 'integration';
  name: string;
  description: string;
  documentation: string;
  rateLimits?: {
    requests: number;
    period: string;
  };
}

export interface DatasetReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Expert Services Types
export interface ServiceListing {
  id: string;
  title: string;
  description: string;
  category: 'patent_consulting' | 'legal_services' | 'technical_analysis' | 'market_research' | 'ip_strategy';
  subcategory: string;
  provider: ServiceProvider;
  
  // Service details
  deliverables: string[];
  timeline: string;
  methodology: string;
  requirements: string[];
  
  // Pricing
  pricing: ServicePricing;
  
  // Marketplace
  status: 'active' | 'busy' | 'unavailable';
  listedDate: string;
  completedProjects: number;
  rating: number;
  reviews: ServiceReview[];
  badges: ServiceBadge[];
  skills: string[];
  certifications: string[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  title: string;
  company?: string;
  avatar: string;
  bio: string;
  location: string;
  timezone: string;
  languages: string[];
  
  // Credentials
  education: Education[];
  experience: WorkExperience[];
  certifications: Certification[];
  
  // Performance
  totalEarnings: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  responseTime: string;
  availability: 'full-time' | 'part-time' | 'project-based';
  
  // Portfolio
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: number;
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verified: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  results: string;
  clientTestimonial?: string;
  date: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  comment: string;
  rating: number;
  date: string;
  projectTitle: string;
}

export interface ServicePricing {
  model: 'fixed' | 'hourly' | 'milestone' | 'retainer';
  basePrice: number;
  hourlyRate?: number;
  currency: string;
  estimatedHours?: number;
  milestones?: Milestone[];
}

export interface Milestone {
  name: string;
  description: string;
  deliverables: string[];
  payment: number;
  timeline: string;
}

export interface ServiceReview {
  id: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  projectTitle: string;
  categories: {
    communication: number;
    quality: number;
    timeliness: number;
    expertise: number;
  };
}

export interface ServiceBadge {
  type: 'top_rated' | 'rising_talent' | 'expert_vetted' | 'fast_delivery' | 'great_communication';
  name: string;
  description: string;
  earnedDate: string;
}

// Project and Transaction Types
export interface MarketplaceProject {
  id: string;
  title: string;
  description: string;
  category: string;
  client: MarketplaceUser;
  provider?: ServiceProvider;
  
  // Project details
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  requirements: string[];
  deliverables: string[];
  
  // Status and progress
  status: 'posted' | 'bidding' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  progress: number;
  milestones: ProjectMilestone[];
  
  // Bidding
  bids: ProjectBid[];
  selectedBid?: string;
  
  // Communication
  messages: ProjectMessage[];
  
  // Dates
  postedDate: string;
  startDate?: string;
  completionDate?: string;
  
  // Files and attachments
  attachments: ProjectAttachment[];
}

export interface ProjectBudget {
  type: 'fixed' | 'hourly';
  min: number;
  max: number;
  currency: string;
  paymentSchedule: 'upfront' | 'milestone' | 'completion' | 'escrow';
}

export interface ProjectTimeline {
  duration: string;
  startDate?: string;
  deadlineFlexible: boolean;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  deliverables: string[];
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  payment: number;
  feedback?: string;
}

export interface ProjectBid {
  id: string;
  providerId: string;
  provider: ServiceProvider;
  amount: number;
  timeline: string;
  proposal: string;
  deliverables: string[];
  questions: string[];
  submittedDate: string;
  status: 'submitted' | 'shortlisted' | 'rejected' | 'selected';
}

export interface ProjectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'client' | 'provider';
  message: string;
  timestamp: string;
  attachments: string[];
}

export interface ProjectAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadDate: string;
}

// Revenue and Analytics Types
export interface MarketplaceUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: 'individual' | 'company' | 'institution';
  verified: boolean;
  joinDate: string;
  location: string;
}

export interface Transaction {
  id: string;
  type: 'patent_sale' | 'patent_license' | 'data_purchase' | 'service_payment' | 'commission' | 'refund';
  amount: number;
  currency: string;
  
  // Parties
  payer: MarketplaceUser;
  payee: MarketplaceUser;
  
  // Transaction details
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  date: string;
  
  // Related items
  patentId?: string;
  datasetId?: string;
  serviceId?: string;
  projectId?: string;
  
  // Payment processing
  paymentMethod: string;
  processingFee: number;
  platformFee: number;
  netAmount: number;
  
  // Tax and compliance
  taxAmount?: number;
  taxRegion?: string;
  invoiceNumber?: string;
  
  // References
  externalTransactionId?: string;
  receiptUrl?: string;
}

export interface RevenueMetrics {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  
  // Revenue breakdown
  totalRevenue: number;
  patentRevenue: number;
  dataRevenue: number;
  servicesRevenue: number;
  
  // Transaction metrics
  totalTransactions: number;
  averageTransactionValue: number;
  
  // Growth metrics
  growthRate: number;
  previousPeriodRevenue: number;
  
  // Commission and fees
  platformCommission: number;
  processingFees: number;
  netRevenue: number;
  
  // User metrics
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: 'bank_transfer' | 'paypal' | 'stripe' | 'wire';
  status: 'requested' | 'processing' | 'completed' | 'failed';
  requestDate: string;
  processedDate?: string;
  fees: number;
  netAmount: number;
  reference?: string;
}

// Search and Filter Types
export interface MarketplaceFilters {
  // Patent filters
  patentType?: string[];
  technologyArea?: string[];
  jurisdiction?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  listingType?: ('sale' | 'license')[];
  
  // Data filters
  dataCategory?: string[];
  updateFrequency?: string[];
  pricingModel?: string[];
  
  // Service filters
  serviceCategory?: string[];
  providerRating?: number;
  budget?: {
    min: number;
    max: number;
  };
  timeline?: string[];
  
  // General filters
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'date' | 'rating' | 'popularity';
}

export interface SearchResult {
  type: 'patent' | 'dataset' | 'service';
  item: PatentListing | DatasetListing | ServiceListing;
  relevanceScore: number;
  matchedKeywords: string[];
}