import React, { useState, useEffect } from 'react';
import {
  FileText,
  Users,
  MessageSquare,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Download,
  Upload,
  Share2,
  MoreHorizontal,
  User,
  Calendar,
  Target,
  GitBranch,
  Reply,
  Check,
  X
} from 'lucide-react';
import { InstantUser } from '../lib/instantAuth';
import {
  ReviewDocument,
  DocumentReviewer,
  DocumentAnnotation,
  ReviewApproval,
  PresenceInfo
} from '../types/collaboration';
import HarmonizedCard from './HarmonizedCard';
import { HCLStat, HCLKeyword, HCLAttribute, HCLAction } from './HarmonizedCard';

interface CollaborativeReviewProps {
  currentUser: InstantUser;
}

const CollaborativeReview: React.FC<CollaborativeReviewProps> = ({ currentUser }) => {
  const [activeView, setActiveView] = useState<'documents' | 'reviews' | 'annotations' | 'approvals'>('documents');
  const [_selectedDocument, setSelectedDocument] = useState<ReviewDocument | null>(null);
  const [_selectedAnnotation, _setSelectedAnnotation] = useState<DocumentAnnotation | null>(null);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [showPresencePanel, setShowPresencePanel] = useState(true);
  const [presenceUsers, setPresenceUsers] = useState<PresenceInfo[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Mock data
  const [documents] = useState<ReviewDocument[]>([
    {
      id: 'doc-1',
      title: 'AI-Powered Patent Classification System',
      document_type: 'patent_application',
      content: {
        sections: [
          { id: 'abstract', title: 'Abstract', content: 'A machine learning system for automatically classifying patent applications...' },
          { id: 'background', title: 'Background', content: 'Current patent classification systems rely heavily on manual review...' },
          { id: 'summary', title: 'Summary', content: 'The present invention provides an automated solution...' },
          { id: 'detailed', title: 'Detailed Description', content: 'The system employs deep learning algorithms...' },
          { id: 'claims', title: 'Claims', content: '1. A method for patent classification comprising...' }
        ]
      },
      file_url: '/api/documents/ai-patent-classification.pdf',
      version: 3,
      status: 'in_progress',
      workflow_stage: 'technical_review',
      created_by: currentUser.id,
      assigned_reviewers: ['reviewer-1', 'reviewer-2', 'reviewer-3'],
      deadline: '2025-09-01',
      priority: 'high',
      metadata: {
        word_count: 8500,
        page_count: 22,
        last_modified: new Date().toISOString()
      },
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'doc-2',
      title: 'Quantum Computing Optimization Method',
      document_type: 'patent_application',
      content: {
        sections: [
          { id: 'abstract', title: 'Abstract', content: 'A novel method for optimizing quantum computing operations...' },
          { id: 'background', title: 'Background', content: 'Quantum computing faces significant challenges in optimization...' },
          { id: 'summary', title: 'Summary', content: 'The disclosed method provides improved efficiency...' },
          { id: 'detailed', title: 'Detailed Description', content: 'The optimization algorithm utilizes...' },
          { id: 'claims', title: 'Claims', content: '1. A quantum optimization method comprising...' }
        ]
      },
      file_url: '/api/documents/quantum-optimization.pdf',
      version: 1,
      status: 'pending',
      workflow_stage: 'initial_review',
      created_by: 'user-2',
      assigned_reviewers: ['reviewer-1', 'reviewer-4'],
      deadline: '2025-08-25',
      priority: 'medium',
      metadata: {
        word_count: 6200,
        page_count: 15,
        last_modified: new Date(Date.now() - 172800000).toISOString()
      },
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  const [reviewers] = useState<DocumentReviewer[]>([
    {
      id: 'reviewer-1',
      document_id: 'doc-1',
      user_id: currentUser.id,
      display_name: currentUser.displayName,
      role: 'primary',
      status: 'reviewing',
      assigned_at: new Date(Date.now() - 86400000).toISOString(),
      sections_reviewed: ['abstract', 'background'],
      total_sections: 5,
      annotations_count: 8,
    },
    {
      id: 'reviewer-2',
      document_id: 'doc-1',
      user_id: 'user-2',
      display_name: 'Dr. Sarah Chen',
      avatar_url: '/api/placeholder/32/32',
      role: 'secondary',
      status: 'completed',
      assigned_at: new Date(Date.now() - 86400000).toISOString(),
      completed_at: new Date(Date.now() - 3600000).toISOString(),
      sections_reviewed: ['abstract', 'background', 'summary', 'detailed', 'claims'],
      total_sections: 5,
      annotations_count: 12,
    },
    {
      id: 'reviewer-3',
      document_id: 'doc-1',
      user_id: 'user-3',
      display_name: 'David Rodriguez',
      avatar_url: '/api/placeholder/32/32',
      role: 'observer',
      status: 'pending',
      assigned_at: new Date(Date.now() - 86400000).toISOString(),
      sections_reviewed: [],
      total_sections: 5,
      annotations_count: 0,
    },
  ]);

  const [annotations] = useState<DocumentAnnotation[]>([
    {
      id: 'annotation-1',
      document_id: 'doc-1',
      reviewer_id: 'reviewer-1',
      reviewer_name: currentUser.displayName,
      type: 'comment',
      content: 'This section needs more technical detail about the machine learning architecture. Consider adding a diagram.',
      position: {
        page: 1,
        line: 15,
        selection: { start: 245, end: 298 }
      },
      severity: 'medium',
      status: 'open',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'annotation-2',
      document_id: 'doc-1',
      reviewer_id: 'reviewer-2',
      reviewer_name: 'Dr. Sarah Chen',
      type: 'suggestion',
      content: 'Suggest rewording this claim to be more specific about the neural network layers used.',
      position: {
        page: 5,
        line: 8,
        selection: { start: 1024, end: 1156 }
      },
      severity: 'high',
      status: 'open',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'annotation-3',
      document_id: 'doc-1',
      reviewer_id: 'reviewer-2',
      reviewer_name: 'Dr. Sarah Chen',
      type: 'approval',
      content: 'This section is well-written and technically sound. Ready for approval.',
      position: {
        page: 2,
        line: 22,
        selection: { start: 512, end: 724 }
      },
      severity: 'low',
      status: 'resolved',
      resolved_by: currentUser.id,
      resolved_at: new Date(Date.now() - 1800000).toISOString(),
      created_at: new Date(Date.now() - 10800000).toISOString(),
      updated_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ]);

  const [approvals] = useState<ReviewApproval[]>([
    {
      id: 'approval-1',
      document_id: 'doc-1',
      reviewer_id: 'reviewer-2',
      reviewer_name: 'Dr. Sarah Chen',
      stage: 'technical_review',
      decision: 'approved',
      comments: 'Technical content is solid. Minor revisions needed for clarity.',
      approval_date: new Date(Date.now() - 3600000).toISOString(),
      conditions: ['Address annotation #2', 'Add diagram to section 3'],
    },
  ]);

  // Simulate real-time presence
  useEffect(() => {
    const updatePresence = () => {
      const activeUsers: PresenceInfo[] = [
        {
          user_id: currentUser.id,
          user_name: currentUser.displayName,
          status: 'active',
          current_section: 'claims',
          last_seen: new Date().toISOString(),
        },
        {
          user_id: 'user-2',
          user_name: 'Dr. Sarah Chen',
          avatar_url: '/api/placeholder/32/32',
          status: 'active',
          current_section: 'detailed',
          last_seen: new Date(Date.now() - 300000).toISOString(),
        },
        ...(Math.random() > 0.5 ? [{
          user_id: 'user-3',
          user_name: 'David Rodriguez',
          avatar_url: '/api/placeholder/32/32',
          status: 'idle' as const,
          current_section: 'background',
          last_seen: new Date(Date.now() - 900000).toISOString(),
        }] : []),
      ];
      setPresenceUsers(activeUsers);
    };

    const interval = setInterval(updatePresence, 3000);
    updatePresence();

    return () => clearInterval(interval);
  }, [currentUser]);

  // Removed unused helper functions

  const getAnnotationTypeIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'suggestion': return <Edit className="w-4 h-4" />;
      case 'issue': return <AlertCircle className="w-4 h-4" />;
      case 'approval': return <CheckCircle className="w-4 h-4" />;
      case 'highlight': return <Target className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getAnnotationTypeColor = (type: string): string => {
    switch (type) {
      case 'comment': return 'text-blue-600 bg-blue-100';
      case 'suggestion': return 'text-purple-600 bg-purple-100';
      case 'issue': return 'text-red-600 bg-red-100';
      case 'approval': return 'text-green-600 bg-green-100';
      case 'highlight': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderDocuments = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Review Documents</h2>
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Documents</option>
              <option value="pending">Pending Review</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {documents.map((doc) => {
            const docReviewers = reviewers.filter(r => r.document_id === doc.id);
            const completedReviewers = docReviewers.filter(r => r.status === 'completed').length;
            const totalAnnotations = annotations.filter(a => a.document_id === doc.id).length;
            const openAnnotations = annotations.filter(a => a.document_id === doc.id && a.status === 'open').length;

            const stats: HCLStat[] = [
              { label: "Version", value: `v${doc.version}`, icon: GitBranch, color: "text-blue-600" },
              { label: "Reviewers", value: `${completedReviewers}/${docReviewers.length}`, icon: Users, color: "text-purple-600" },
              { label: "Annotations", value: totalAnnotations, icon: MessageSquare, color: "text-green-600" },
              { label: "Pages", value: doc.metadata.page_count || 0, icon: FileText, color: "text-gray-600" }
            ];

            const keywords: HCLKeyword[] = [
              { label: doc.status.replace('_', ' '), color: 
                doc.status === 'completed' ? 'green' : 
                doc.status === 'in_progress' ? 'blue' : 
                doc.status === 'approved' ? 'purple' : 'gray' },
              { label: doc.priority, color: 
                doc.priority === 'urgent' ? 'red' : 
                doc.priority === 'high' ? 'orange' : 
                doc.priority === 'medium' ? 'yellow' : 'blue' },
              { label: doc.document_type.replace('_', ' '), color: 'blue' }
            ];

            const attributes: HCLAttribute[] = [
              { label: "Workflow", value: doc.workflow_stage.replace('_', ' '), icon: Target },
              { label: "Deadline", value: doc.deadline ? new Date(doc.deadline).toLocaleDateString() : 'Not set', icon: Calendar },
              { label: "Open Issues", value: openAnnotations.toString(), icon: AlertCircle }
            ];

            const actions: HCLAction[] = [
              { id: 'review', label: 'Start Review', icon: Eye, onClick: () => setSelectedDocument(doc), isPrimary: true, variant: 'primary' },
              { id: 'download', label: 'Download', icon: Download, onClick: () => {} },
              { id: 'share', label: 'Share', icon: Share2, onClick: () => {} }
            ];

            return (
              <HarmonizedCard
                key={doc.id}
                title={doc.title}
                description={`${doc.document_type.replace('_', ' ')} • ${doc.metadata.word_count || 0} words`}
                stats={stats}
                keywords={keywords}
                attributes={attributes}
                actions={actions}
                colorAccent={
                  doc.status === 'completed' ? '#10b981' :
                  doc.status === 'in_progress' ? '#3b82f6' :
                  doc.status === 'approved' ? '#8b5cf6' : '#6b7280'
                }
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Active Reviews</h2>
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="assigned">Assigned to Me</option>
              <option value="created">Created by Me</option>
              <option value="all">All Reviews</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Document</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Deadline</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reviewers.map((reviewer) => {
                  const doc = documents.find(d => d.id === reviewer.document_id);
                  const progress = (reviewer.sections_reviewed.length / reviewer.total_sections) * 100;
                  const isOverdue = doc?.deadline && new Date(doc.deadline) < new Date() && reviewer.status !== 'completed';

                  return (
                    <tr key={reviewer.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{doc?.title}</p>
                          <p className="text-sm text-gray-600">{doc?.document_type.replace('_', ' ')}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          reviewer.role === 'primary' ? 'bg-blue-100 text-blue-800' :
                          reviewer.role === 'secondary' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {reviewer.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {reviewer.sections_reviewed.length}/{reviewer.total_sections} sections
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          reviewer.status === 'completed' ? 'bg-green-100 text-green-800' :
                          reviewer.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {reviewer.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {doc?.deadline && (
                          <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                            {new Date(doc.deadline).toLocaleDateString()}
                            {isOverdue && (
                              <span className="ml-1 text-red-500">
                                (Overdue)
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setSelectedDocument(doc || null)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAnnotations = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Review Annotations</h2>
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Annotations</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="my">My Annotations</option>
            </select>
            <button 
              onClick={() => setShowAnnotationModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Annotation
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {annotations.map((annotation) => {
            const doc = documents.find(d => d.id === annotation.document_id);

            return (
              <div key={annotation.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAnnotationTypeColor(annotation.type)}`}>
                    {getAnnotationTypeIcon(annotation.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{annotation.reviewer_name}</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getAnnotationTypeColor(annotation.type)}`}>
                        {annotation.type}
                      </span>
                      {annotation.severity && (
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          annotation.severity === 'high' ? 'bg-red-100 text-red-800' :
                          annotation.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {annotation.severity}
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        annotation.status === 'open' ? 'bg-orange-100 text-orange-800' :
                        annotation.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {annotation.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-900 mb-2">{annotation.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{doc?.title}</span>
                        <span>Page {annotation.position.page}</span>
                        <span>{new Date(annotation.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {annotation.status === 'open' && (
                          <button className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors">
                            <Check className="w-3 h-3" />
                            Resolve
                          </button>
                        )}
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors">
                          <Reply className="w-3 h-3" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderApprovals = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Review Approvals</h2>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Approvals</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="space-y-4">
          {approvals.map((approval) => {
            const doc = documents.find(d => d.id === approval.document_id);

            return (
              <div key={approval.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    approval.decision === 'approved' ? 'bg-green-100 text-green-600' :
                    approval.decision === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {approval.decision === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                     approval.decision === 'rejected' ? <XCircle className="w-4 h-4" /> :
                     <Clock className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{approval.reviewer_name}</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        approval.decision === 'approved' ? 'bg-green-100 text-green-800' :
                        approval.decision === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {approval.decision}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {approval.stage.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{doc?.title}</h4>
                    
                    {approval.comments && (
                      <p className="text-gray-600 mb-3">{approval.comments}</p>
                    )}
                    
                    {approval.conditions && approval.conditions.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Conditions:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {approval.conditions.map((condition, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                              {condition}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      Approved on {new Date(approval.approval_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 -m-6">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Collaborative Review</h1>
              <p className="text-gray-600 mt-1">Multi-user document review with real-time collaboration</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLiveMode ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600">
                  {isLiveMode ? 'Live Mode' : 'Offline Mode'}
                </span>
                <button
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {isLiveMode ? 'Go Offline' : 'Go Live'}
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-blue-600 font-semibold">{presenceUsers.length}</span> online
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6">
            {[
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'reviews', label: 'My Reviews', icon: Eye },
              { id: 'annotations', label: 'Annotations', icon: MessageSquare },
              { id: 'approvals', label: 'Approvals', icon: CheckCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-1 py-2 border-b-2 text-sm font-medium transition-colors ${
                  activeView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 px-6 py-6">
          {activeView === 'documents' && renderDocuments()}
          {activeView === 'reviews' && renderReviews()}
          {activeView === 'annotations' && renderAnnotations()}
          {activeView === 'approvals' && renderApprovals()}
        </div>

        {/* Presence Panel */}
        {showPresencePanel && (
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Online Users</h3>
              <button
                onClick={() => setShowPresencePanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {presenceUsers.map((user) => (
                <div key={user.user_id} className="flex items-center gap-3 p-2 rounded-lg border border-gray-200">
                  <div className="relative">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.user_name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      user.status === 'active' ? 'bg-green-500' :
                      user.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.user_name}</p>
                    <p className="text-xs text-gray-500">
                      {user.current_section ? `Viewing: ${user.current_section}` : 'Not viewing document'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {presenceUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No users online</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Annotation Modal */}
      {showAnnotationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Annotation</h3>
              <button
                onClick={() => setShowAnnotationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="comment">Comment</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="issue">Issue</option>
                  <option value="approval">Approval</option>
                  <option value="highlight">Highlight</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your annotation..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAnnotationModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAnnotationModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Annotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeReview;