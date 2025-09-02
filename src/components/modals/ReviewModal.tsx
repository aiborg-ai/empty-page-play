import { useState } from 'react';
import { X, Star, ThumbsUp, ThumbsDown, Send, Check, AlertCircle } from 'lucide-react';
// import { ReviewSubmission } from '@/types/reviews';
// import { reviewService } from '@/lib/reviewService';

interface ReviewSubmission {
  capabilityId: string;
  capabilityName: string;
  userName: string;
  userEmail: string;
  organization?: string;
  role?: string;
  rating: number;
  title: string;
  review: string;
  pros: string[];
  cons: string[];
  usageFrequency: 'daily' | 'weekly' | 'monthly' | 'occasionally';
  recommendToOthers: boolean;
}

const reviewService = {
  submitReview: async (submission: ReviewSubmission) => {
    // Mock implementation
    console.log('Review submitted:', submission);
    return { success: true, reviewId: 'mock-review-id', message: 'Review submitted successfully' };
  }
};

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  capabilityId: string;
  capabilityName: string;
}

export const ReviewModal = ({ isOpen, onClose, capabilityId, capabilityName }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [usageFrequency, setUsageFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'occasionally'>('weekly');
  const [recommendToOthers, setRecommendToOthers] = useState(true);
  const [pros, setPros] = useState<string[]>(['']);
  const [cons, setCons] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleAddPro = () => {
    if (pros[pros.length - 1].trim()) {
      setPros([...pros, '']);
    }
  };

  const handleAddCon = () => {
    if (cons[cons.length - 1].trim()) {
      setCons([...cons, '']);
    }
  };

  const handleProChange = (index: number, value: string) => {
    const newPros = [...pros];
    newPros[index] = value;
    setPros(newPros);
  };

  const handleConChange = (index: number, value: string) => {
    const newCons = [...cons];
    newCons[index] = value;
    setCons(newCons);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setStatusMessage('Please select a rating');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const submission: ReviewSubmission = {
      capabilityId,
      capabilityName,
      rating,
      title,
      review,
      userName,
      userEmail,
      organization,
      role,
      usageFrequency,
      recommendToOthers,
      pros: pros.filter(p => p.trim()),
      cons: cons.filter(c => c.trim())
    };

    const result = await reviewService.submitReview(submission);

    if (result.success) {
      setSubmitStatus('success');
      setStatusMessage(result.message);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);
    } else {
      setSubmitStatus('error');
      setStatusMessage(result.message);
    }

    setIsSubmitting(false);
  };

  const resetForm = () => {
    setRating(0);
    setTitle('');
    setReview('');
    setUserName('');
    setUserEmail('');
    setOrganization('');
    setRole('');
    setUsageFrequency('weekly');
    setRecommendToOthers(true);
    setPros(['']);
    setCons(['']);
    setSubmitStatus('idle');
    setStatusMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
            <p className="text-sm text-gray-600 mt-1">Share your experience with {capabilityName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && `${rating} star${rating !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Summarize your experience"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              rows={5}
              placeholder="Tell us about your experience with this capability..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pros
              </label>
              {pros.map((pro, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => handleProChange(index, e.target.value)}
                    placeholder="What did you like?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPro}
                className="text-sm text-green-600 hover:text-green-700"
              >
                + Add another pro
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cons
              </label>
              {cons.map((con, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={con}
                    onChange={(e) => handleConChange(index, e.target.value)}
                    placeholder="What could be improved?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCon}
                className="text-sm text-red-600 hover:text-red-700"
              >
                + Add another con
              </button>
            </div>
          </div>

          {/* Usage and Recommendation */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How often do you use this?
              </label>
              <select
                value={usageFrequency}
                onChange={(e) => setUsageFrequency(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="occasionally">Occasionally</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Would you recommend this?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRecommendToOthers(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
                    recommendToOthers
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setRecommendToOthers(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
                    !recommendToOthers
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  No
                </button>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Your Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll send a verification email to publish your review
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Your company/organization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Your job title/role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus !== 'idle' && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              submitStatus === 'success' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {submitStatus === 'success' ? (
                <Check className="w-5 h-5 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {submitStatus === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="text-sm mt-1">{statusMessage}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};