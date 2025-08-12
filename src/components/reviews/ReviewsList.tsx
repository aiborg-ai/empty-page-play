import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, CheckCircle, Filter, ChevronDown, MessageSquare } from 'lucide-react';

// Define types locally
interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  review: string;
  pros?: string[];
  cons?: string[];
  isVerifiedPurchase?: boolean;
  helpful?: number;
  notHelpful?: number;
  createdAt: string;
  verifiedAt?: string;
  organization?: string;
  role?: string;
  usageFrequency?: string;
  recommendToOthers?: boolean;
}

interface ReviewFilter {
  sortBy?: string;
  rating?: number;
  verified?: boolean;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  verifiedPurchaseCount: number;
  recommendationRate: number;
  commonPros: [string, number][];
  commonCons: [string, number][];
}

const reviewService = {
  getCapabilityReviews: async (_capabilityId: string, _filter: ReviewFilter) => {
    // Mock implementation
    return [];
  },
  getCapabilityReviewStats: async (_capabilityId: string) => {
    // Mock implementation
    return null;
  },
  getReviewStats: async (_capabilityId: string) => {
    // Mock implementation
    return null;
  },
  markReviewHelpful: async (_reviewId: string, _isHelpful: boolean) => {
    // Mock implementation
    return true;
  },
  markReviewHelpfulness: async (_reviewId: string, _isHelpful: boolean) => {
    // Mock implementation
    return true;
  }
};

interface ReviewsListProps {
  capabilityId: string;
  capabilityName: string;
  onWriteReview: () => void;
}

export const ReviewsList = ({ capabilityId, capabilityName, onWriteReview }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [filter, setFilter] = useState<ReviewFilter>({ sortBy: 'newest' });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [capabilityId, filter]);

  const loadReviews = async () => {
    setLoading(true);
    const data = await reviewService.getCapabilityReviews(capabilityId, filter);
    setReviews(data);
    setLoading(false);
  };

  const loadStats = async () => {
    const data = await reviewService.getReviewStats(capabilityId);
    setStats(data);
  };

  const handleHelpfulness = async (reviewId: string, isHelpful: boolean) => {
    // const userId = localStorage.getItem('userId') || 'anonymous';
    const success = await reviewService.markReviewHelpfulness(reviewId, isHelpful);
    
    if (success) {
      // Reload reviews to show updated counts
      loadReviews();
    }
  };

  const handleRatingFilter = (rating: number) => {
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    
    setSelectedRatings(newRatings);
    setFilter({ ...filter, rating: newRatings.length > 0 ? newRatings[0] : undefined });
  };

  const handleSortChange = (sortBy: ReviewFilter['sortBy']) => {
    setFilter({ ...filter, sortBy });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={`w-4 h-4 ${
              value <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderReviewCard = (review: Review) => {
    const helpfulPercentage = (review.helpful || 0) + (review.notHelpful || 0) > 0
      ? Math.round(((review.helpful || 0) / ((review.helpful || 0) + (review.notHelpful || 0))) * 100)
      : 0;

    return (
      <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {renderStars(review.rating)}
              <h3 className="font-semibold text-gray-900">{review.title}</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{review.userName}</span>
              {review.organization && (
                <>
                  <span>•</span>
                  <span>{review.organization}</span>
                </>
              )}
              {review.role && (
                <>
                  <span>•</span>
                  <span>{review.role}</span>
                </>
              )}
              <span>•</span>
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {review.isVerifiedPurchase && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Verified Purchase</span>
            </div>
          )}
        </div>

        <p className="text-gray-700 mb-4">{review.review}</p>

        {/* Pros and Cons */}
        {(review.pros?.length || review.cons?.length) ? (
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {review.pros && review.pros.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2">Pros</h4>
                <ul className="space-y-1">
                  {review.pros.map((pro: any, index: any) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {review.cons && review.cons.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-2">Cons</h4>
                <ul className="space-y-1">
                  {review.cons.map((con: any, index: any) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Was this review helpful?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleHelpfulness(review.id, true)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{review.helpful}</span>
              </button>
              <button
                onClick={() => handleHelpfulness(review.id, false)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{review.notHelpful}</span>
              </button>
            </div>
            {helpfulPercentage > 0 && (
              <span className="text-sm text-gray-500">
                {helpfulPercentage}% found helpful
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {review.usageFrequency && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                Uses {review.usageFrequency}
              </span>
            )}
            {review.recommendToOthers && (
              <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                Recommends
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      {stats && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(stats.averageRating))}
                  <span className="text-xl font-semibold">{stats.averageRating.toFixed(1)}</span>
                  <span className="text-gray-600">out of 5</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{stats.totalReviews} reviews</span>
                {stats.verifiedPurchaseCount > 0 && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="text-green-600">
                      {stats.verifiedPurchaseCount} verified purchases
                    </span>
                  </>
                )}
              </div>
              {stats.recommendationRate > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round(stats.recommendationRate)}% of users recommend this capability
                </p>
              )}
            </div>
            <button
              onClick={onWriteReview}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Write a Review
            </button>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating as 1|2|3|4|5];
              const percentage = stats.totalReviews > 0 
                ? (count / stats.totalReviews) * 100 
                : 0;

              return (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(rating)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    selectedRatings.includes(rating) 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm text-gray-600 w-12">{rating} star</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-yellow-400 h-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Common Pros and Cons */}
          {(stats.commonPros.length > 0 || stats.commonCons.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
              {stats.commonPros.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Most Mentioned Pros</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.commonPros.map((pro: any, index: any) => (
                      <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded">
                        {pro}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {stats.commonCons.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Most Mentioned Cons</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.commonCons.map((con: any, index: any) => (
                      <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-sm rounded">
                        {con}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filters and Sort */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {selectedRatings.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {selectedRatings.length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={filter.sortBy}
              onChange={(e) => handleSortChange(e.target.value as ReviewFilter['sortBy'])}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="most-helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Filter by verified purchases</label>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setFilter({ ...filter, verified: undefined })}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    filter.verified === undefined
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter({ ...filter, verified: true })}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    filter.verified === true
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Verified Only
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 mt-4">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map(renderReviewCard)
        ) : (
          <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your experience with {capabilityName}</p>
            <button
              onClick={onWriteReview}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write the First Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};