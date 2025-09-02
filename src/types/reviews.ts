// Review system types and interfaces

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'published';
export type ReviewVerificationStatus = 'unverified' | 'email-sent' | 'email-verified' | 'verified-purchase';

export interface ReviewSubmission {
  capabilityId: string;
  rating: number; // 1-5 stars
  title: string;
  review: string;
  userEmail: string;
  userName: string;
  organization?: string;
  role?: string;
  usageFrequency?: 'daily' | 'weekly' | 'monthly' | 'occasionally';
  recommendToOthers: boolean;
  pros?: string[];
  cons?: string[];
}

export interface Review {
  id: string;
  capabilityId: string;
  capabilityName: string;
  userId?: string;
  userEmail: string;
  userName: string;
  organization?: string;
  role?: string;
  rating: number; // 1-5 stars
  title: string;
  review: string;
  pros?: string[];
  cons?: string[];
  usageFrequency?: 'daily' | 'weekly' | 'monthly' | 'occasionally';
  recommendToOthers: boolean;
  helpful: number;
  notHelpful: number;
  status: ReviewStatus;
  verificationStatus: ReviewVerificationStatus;
  verificationToken?: string;
  verificationEmailSentAt?: string;
  verifiedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  moderatorNotes?: string;
  isVerifiedPurchase: boolean;
  responses?: ReviewResponse[];
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  userRole: 'provider' | 'admin' | 'user';
  response: string;
  createdAt: string;
  isOfficial: boolean;
}

export interface ReviewEmailVerification {
  reviewId: string;
  token: string;
  email: string;
  expiresAt: string;
  verifiedAt?: string;
  attempts: number;
}

export interface ReviewModeration {
  reviewId: string;
  moderatorId: string;
  moderatorName: string;
  action: 'approve' | 'reject' | 'flag';
  reason?: string;
  notes?: string;
  timestamp: string;
}

export interface ReviewStats {
  capabilityId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchaseCount: number;
  recommendationRate: number;
  commonPros: string[];
  commonCons: string[];
  lastReviewDate?: string;
}

export interface ReviewHelpfulness {
  reviewId: string;
  userId: string;
  isHelpful: boolean;
  timestamp: string;
}

export interface ReviewFilter {
  rating?: number[];
  verified?: boolean;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'most-helpful';
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ReviewWorkflowConfig {
  requireEmailVerification: boolean;
  autoApproveVerifiedPurchases: boolean;
  moderationRequired: boolean;
  emailTemplates: {
    verification: string;
    approved: string;
    rejected: string;
  };
  verificationTokenExpiry: number; // hours
  maxVerificationAttempts: number;
}