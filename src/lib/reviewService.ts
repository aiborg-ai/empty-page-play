// Review service with email approval workflow

// import { supabase } from './supabase';

// Define types locally to avoid missing dependency
interface Review {
  id?: string;
  status?: string;
  verificationStatus?: string;
  [key: string]: any;
}

interface ReviewSubmission {
  [key: string]: any;
}

interface ReviewStats {
  [key: string]: any;
}

interface ReviewFilter {
  [key: string]: any;
}

class ReviewService {
  private readonly VERIFICATION_TOKEN_EXPIRY_HOURS = 24;
  // private readonly MAX_VERIFICATION_ATTEMPTS = 3;

  // Submit a new review
  async submitReview(submission: ReviewSubmission): Promise<{ success: boolean; reviewId?: string; message: string }> {
    try {
      // Generate verification token
      const verificationToken = this.generateVerificationToken();
      
      // Create review in pending status
      const review: Partial<Review> = {
        ...submission,
        status: 'pending',
        verificationStatus: 'unverified',
        verificationToken,
        helpful: 0,
        notHelpful: 0,
        isVerifiedPurchase: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store review in database (mock for now)
      const reviewId = `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Send verification email
      await this.sendVerificationEmail(submission.userEmail, submission.userName, verificationToken, reviewId);
      
      // Store review in localStorage for demo
      this.storeReviewLocally(reviewId, review);
      
      return {
        success: true,
        reviewId,
        message: 'Review submitted successfully! Please check your email to verify and publish your review.'
      };
    } catch (error) {
      console.error('Error submitting review:', error);
      return {
        success: false,
        message: 'Failed to submit review. Please try again.'
      };
    }
  }

  // Verify review via email token
  async verifyReview(reviewId: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const review = this.getReviewFromLocal(reviewId);
      
      if (!review) {
        return { success: false, message: 'Review not found' };
      }

      if (review.verificationToken !== token) {
        return { success: false, message: 'Invalid verification token' };
      }

      // Check token expiry
      const createdTime = new Date(review.createdAt).getTime();
      const expiryTime = createdTime + (this.VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
      
      if (Date.now() > expiryTime) {
        return { success: false, message: 'Verification token has expired' };
      }

      // Update review status
      review.verificationStatus = 'email-verified';
      review.verifiedAt = new Date().toISOString();
      
      // Auto-approve if configured
      if (this.shouldAutoApprove(review)) {
        review.status = 'published';
        review.publishedAt = new Date().toISOString();
      } else {
        review.status = 'approved';
      }

      this.storeReviewLocally(reviewId, review);
      
      // Send confirmation email
      await this.sendApprovalEmail(review.userEmail, review.userName);
      
      return {
        success: true,
        message: 'Review verified and published successfully!'
      };
    } catch (error) {
      console.error('Error verifying review:', error);
      return {
        success: false,
        message: 'Failed to verify review'
      };
    }
  }

  // Get reviews for a capability
  async getCapabilityReviews(
    capabilityId: string, 
    filter?: ReviewFilter
  ): Promise<Review[]> {
    try {
      // Get all reviews from localStorage (mock implementation)
      const allReviews = this.getAllReviewsFromLocal();
      
      // Filter by capability and published status
      let reviews = allReviews.filter(r => 
        r.capabilityId === capabilityId && 
        r.status === 'published'
      );

      // Apply additional filters
      if (filter) {
        reviews = this.applyFilters(reviews, filter);
      }

      return reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  // Get review statistics for a capability
  async getReviewStats(capabilityId: string): Promise<ReviewStats> {
    const reviews = await this.getCapabilityReviews(capabilityId);
    
    const stats: ReviewStats = {
      capabilityId,
      totalReviews: reviews.length,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      verifiedPurchaseCount: 0,
      recommendationRate: 0,
      commonPros: [],
      commonCons: [],
      lastReviewDate: undefined
    };

    if (reviews.length === 0) return stats;

    // Calculate statistics
    let totalRating = 0;
    let recommendCount = 0;
    const prosMap = new Map<string, number>();
    const consMap = new Map<string, number>();

    reviews.forEach(review => {
      totalRating += review.rating;
      stats.ratingDistribution[review.rating as 1|2|3|4|5]++;
      
      if (review.isVerifiedPurchase) {
        stats.verifiedPurchaseCount++;
      }
      
      if (review.recommendToOthers) {
        recommendCount++;
      }

      // Track pros and cons
      review.pros?.forEach((pro: any) => {
        prosMap.set(pro, (prosMap.get(pro) || 0) + 1);
      });
      
      review.cons?.forEach((con: any) => {
        consMap.set(con, (consMap.get(con) || 0) + 1);
      });
    });

    stats.averageRating = totalRating / reviews.length;
    stats.recommendationRate = (recommendCount / reviews.length) * 100;
    
    // Get top 5 pros and cons
    stats.commonPros = Array.from(prosMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([pro]) => pro);
    
    stats.commonCons = Array.from(consMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([con]) => con);

    // Get last review date
    const sortedReviews = reviews.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    stats.lastReviewDate = sortedReviews[0]?.createdAt;

    return stats;
  }

  // Mark review as helpful/not helpful
  async markReviewHelpfulness(
    reviewId: string, 
    userId: string, 
    isHelpful: boolean
  ): Promise<boolean> {
    try {
      const review = this.getReviewFromLocal(reviewId);
      if (!review) return false;

      // Check if user already voted (simplified for demo)
      const voteKey = `review-vote-${reviewId}-${userId}`;
      const existingVote = localStorage.getItem(voteKey);
      
      if (existingVote) {
        return false; // Already voted
      }

      // Update helpfulness count
      if (isHelpful) {
        review.helpful++;
      } else {
        review.notHelpful++;
      }

      this.storeReviewLocally(reviewId, review);
      localStorage.setItem(voteKey, isHelpful ? 'helpful' : 'not-helpful');

      return true;
    } catch (error) {
      console.error('Error marking review helpfulness:', error);
      return false;
    }
  }

  // Moderate review (admin function)
  async moderateReview(
    reviewId: string,
    _moderatorId: string,
    action: 'approve' | 'reject' | 'flag',
    reason?: string
  ): Promise<boolean> {
    try {
      const review = this.getReviewFromLocal(reviewId);
      if (!review) return false;

      switch (action) {
        case 'approve':
          review.status = 'published';
          review.publishedAt = new Date().toISOString();
          break;
        case 'reject':
          review.status = 'rejected';
          review.moderatorNotes = reason;
          break;
        case 'flag':
          review.moderatorNotes = `Flagged: ${reason}`;
          break;
      }

      review.updatedAt = new Date().toISOString();
      this.storeReviewLocally(reviewId, review);

      // Send notification email based on action
      if (action === 'approve') {
        await this.sendApprovalEmail(review.userEmail, review.userName);
      } else if (action === 'reject') {
        await this.sendRejectionEmail(review.userEmail, review.userName, reason);
      }

      return true;
    } catch (error) {
      console.error('Error moderating review:', error);
      return false;
    }
  }

  // Private helper methods
  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private shouldAutoApprove(review: Partial<Review>): boolean {
    // Auto-approve verified purchases or trusted users
    return review.isVerifiedPurchase || false;
  }

  private applyFilters(reviews: Review[], filter: ReviewFilter): Review[] {
    let filtered = [...reviews];

    // Filter by rating
    if (filter.rating && filter.rating.length > 0) {
      filtered = filtered.filter(r => filter.rating!.includes(r.rating));
    }

    // Filter by verified status
    if (filter.verified !== undefined) {
      filtered = filtered.filter(r => r.isVerifiedPurchase === filter.verified);
    }

    // Filter by search term
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.review.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    if (filter.dateRange) {
      const startDate = new Date(filter.dateRange.start).getTime();
      const endDate = new Date(filter.dateRange.end).getTime();
      filtered = filtered.filter(r => {
        const reviewDate = new Date(r.createdAt).getTime();
        return reviewDate >= startDate && reviewDate <= endDate;
      });
    }

    // Sort results
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'newest':
          filtered.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'oldest':
          filtered.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case 'highest':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case 'most-helpful':
          filtered.sort((a, b) => b.helpful - a.helpful);
          break;
      }
    }

    return filtered;
  }

  // Email sending methods (mock implementations)
  private async sendVerificationEmail(
    email: string, 
    userName: string, 
    token: string, 
    reviewId: string
  ): Promise<void> {
    const verificationUrl = `${window.location.origin}/verify-review?id=${reviewId}&token=${token}`;
    
    console.log('📧 Sending verification email:', {
      to: email,
      subject: 'Verify Your Review on InnoSpot',
      body: `
        Hi ${userName},
        
        Thank you for submitting your review! Please click the link below to verify and publish your review:
        
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        Best regards,
        The InnoSpot Team
      `
    });

    // In production, this would call an email API
  }

  private async sendApprovalEmail(email: string, userName: string): Promise<void> {
    console.log('📧 Sending approval email:', {
      to: email,
      subject: 'Your Review Has Been Published',
      body: `
        Hi ${userName},
        
        Great news! Your review has been verified and published on InnoSpot.
        
        Thank you for sharing your valuable feedback with the community.
        
        Best regards,
        The InnoSpot Team
      `
    });
  }

  private async sendRejectionEmail(
    email: string, 
    userName: string, 
    reason?: string
  ): Promise<void> {
    console.log('📧 Sending rejection email:', {
      to: email,
      subject: 'Review Not Published',
      body: `
        Hi ${userName},
        
        Unfortunately, we were unable to publish your review.
        
        ${reason ? `Reason: ${reason}` : 'Please ensure your review follows our community guidelines.'}
        
        You may submit a new review at any time.
        
        Best regards,
        The InnoSpot Team
      `
    });
  }

  // Local storage methods for demo
  private storeReviewLocally(reviewId: string, review: Partial<Review>): void {
    const reviews = JSON.parse(localStorage.getItem('capability-reviews') || '{}');
    reviews[reviewId] = { ...review, id: reviewId };
    localStorage.setItem('capability-reviews', JSON.stringify(reviews));
  }

  private getReviewFromLocal(reviewId: string): Review | null {
    const reviews = JSON.parse(localStorage.getItem('capability-reviews') || '{}');
    return reviews[reviewId] || null;
  }

  private getAllReviewsFromLocal(): Review[] {
    const reviews = JSON.parse(localStorage.getItem('capability-reviews') || '{}');
    return Object.values(reviews);
  }
}

export const reviewService = new ReviewService();