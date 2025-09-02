// import React from 'react'; // Unused
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, Users, Building, FileText, Award, Link,
  Globe, BookOpen, Tag, TrendingUp, Eye,
  Download, Share2, Heart, Bookmark, ExternalLink,
  User, MapPin, Hash, CheckCircle
} from 'lucide-react';

interface Patent {
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
  status: string;
  full_text_available?: boolean;
  inventors?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    city?: string;
    state?: string;
    country?: string;
  }>;
  assignees?: Array<{
    id: string;
    name: string;
    organization_type?: string;
    city?: string;
    state?: string;
    country?: string;
    industry?: string;
  }>;
  classifications?: Array<{
    id: string;
    scheme: string;
    full_code: string;
    class_title: string;
    is_primary: boolean;
  }>;
  citations?: Array<{
    id: string;
    cited_patent_number?: string;
  }>;
}

interface PatentDetailsModalProps {
  patent: Patent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PatentDetailsModal({ patent, isOpen, onClose }: PatentDetailsModalProps) {
  if (!patent) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'abandoned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-blue-100 font-mono text-sm">
                        {patent.patent_number}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patent.status)}`}>
                        {patent.status}
                      </span>
                      {patent.full_text_available && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Full Text Available
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold leading-tight mb-2">
                      {patent.title}
                    </h2>
                    <div className="flex items-center gap-4 text-blue-100 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Filed: {new Date(patent.filing_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Granted: {new Date(patent.grant_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Abstract */}
                    <section>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Abstract
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {patent.abstract_text || 'No abstract available.'}
                        </p>
                      </div>
                    </section>

                    {/* Inventors */}
                    {patent.inventors && patent.inventors.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          Inventors ({patent.inventors.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {patent.inventors.map((inventor, _index) => (
                            <div key={inventor.id} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {inventor.first_name} {inventor.last_name}
                                  </div>
                                  {(inventor.city || inventor.state || inventor.country) && (
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {[inventor.city, inventor.state, inventor.country].filter(Boolean).join(', ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Assignees */}
                    {patent.assignees && patent.assignees.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Building className="w-5 h-5 text-blue-600" />
                          Assignees ({patent.assignees.length})
                        </h3>
                        <div className="space-y-4">
                          {patent.assignees.map((assignee) => (
                            <div key={assignee.id} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <Building className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 text-lg">
                                    {assignee.name}
                                  </div>
                                  <div className="flex items-center gap-4 mt-1">
                                    {assignee.organization_type && (
                                      <span className="text-sm text-gray-600">
                                        {assignee.organization_type}
                                      </span>
                                    )}
                                    {assignee.industry && (
                                      <span className="text-sm text-blue-600">
                                        {assignee.industry}
                                      </span>
                                    )}
                                  </div>
                                  {(assignee.city || assignee.state || assignee.country) && (
                                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                                      <MapPin className="w-3 h-3" />
                                      {[assignee.city, assignee.state, assignee.country].filter(Boolean).join(', ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Classifications */}
                    {patent.classifications && patent.classifications.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Tag className="w-5 h-5 text-blue-600" />
                          Patent Classifications ({patent.classifications.length})
                        </h3>
                        <div className="space-y-3">
                          {patent.classifications.map((classification) => (
                            <div 
                              key={classification.id} 
                              className={`border rounded-lg p-4 ${
                                classification.is_primary ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                      {classification.full_code}
                                    </code>
                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                      {classification.scheme}
                                    </span>
                                    {classification.is_primary && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        Primary
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-gray-700 mt-2">
                                    {classification.class_title}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Patent Statistics</h4>
                      <div className="space-y-3">
                        {patent.claims_count && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Hash className="w-4 h-4" />
                              Claims
                            </span>
                            <span className="font-medium">{patent.claims_count}</span>
                          </div>
                        )}
                        {patent.page_count && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              Pages
                            </span>
                            <span className="font-medium">{patent.page_count}</span>
                          </div>
                        )}
                        {patent.figure_count && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              Figures
                            </span>
                            <span className="font-medium">{patent.figure_count}</span>
                          </div>
                        )}
                        {patent.citations && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Link className="w-4 h-4" />
                              Citations
                            </span>
                            <span className="font-medium">{patent.citations.length}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Patent Timeline</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Filed</div>
                            <div className="text-sm text-gray-500">
                              {new Date(patent.filing_date).toLocaleDateString()}
                            </div>
                            {patent.application_number && (
                              <div className="text-xs text-gray-400 font-mono">
                                {patent.application_number}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {patent.publication_date && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <Globe className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">Published</div>
                              <div className="text-sm text-gray-500">
                                {new Date(patent.publication_date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Granted</div>
                            <div className="text-sm text-gray-500">
                              {new Date(patent.grant_date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                              {patent.patent_number}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download PDF
                        </button>
                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          View on USPTO
                        </button>
                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Citation Analysis
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}