// Collaboration & Social Features Types for InnoSpot

export type TeamRole = 'owner' | 'admin' | 'editor' | 'reviewer' | 'member';
export type ExpertSpecialization = 'patent_law' | 'technical_writing' | 'prior_art' | 'ip_strategy' | 'licensing' | 'prosecution' | 'litigation';
export type ForumCategory = 'general' | 'patent_strategy' | 'technical_help' | 'legal_advice' | 'innovation_challenges' | 'announcements';
export type ReviewStatus = 'pending' | 'in_progress' | 'completed' | 'approved' | 'rejected';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

// Team Workspace Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  workspace_id: string;
  created_by: string;
  member_count: number;
  project_count: number;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Relations
  members?: TeamMember[];
  projects?: TeamProject[];
  creator?: TeamMember;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: TeamRole;
  permissions: string[];
  status: 'active' | 'inactive' | 'invited';
  last_active_at?: string;
  joined_at: string;
  invited_by?: string;
  
  // Activity tracking
  tasks_assigned: number;
  tasks_completed: number;
  contribution_score: number;
}

export interface TeamProject {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  progress: number;
  priority: TaskPriority;
  deadline?: string;
  created_by: string;
  assigned_members: string[];
  created_at: string;
  updated_at: string;
  
  // Relations
  tasks?: Task[];
  documents?: SharedDocument[];
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: string;
  created_by: string;
  due_date?: string;
  completed_at?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags: string[];
  dependencies?: string[];
  created_at: string;
  updated_at: string;
  
  // Relations
  assignee?: TeamMember;
  creator?: TeamMember;
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  author?: TeamMember;
}

export interface SharedDocument {
  id: string;
  project_id: string;
  title: string;
  content: Record<string, any>;
  version: number;
  locked_by?: string;
  locked_at?: string;
  created_by: string;
  last_modified_by: string;
  created_at: string;
  updated_at: string;
  
  // Version control
  versions?: DocumentVersion[];
  collaborators?: DocumentCollaborator[];
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  content: Record<string, any>;
  changes_summary: string;
  created_by: string;
  created_at: string;
}

export interface DocumentCollaborator {
  id: string;
  document_id: string;
  user_id: string;
  permissions: ('read' | 'write' | 'comment')[];
  last_accessed_at?: string;
}

export interface TeamActivity {
  id: string;
  team_id: string;
  user_id: string;
  activity_type: 'task_created' | 'task_completed' | 'document_shared' | 'member_joined' | 'project_updated';
  title: string;
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
  
  // Relations
  user?: TeamMember;
}

// Innovation Forum Types
export interface ForumPost {
  id: string;
  category: ForumCategory;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  view_count: number;
  vote_score: number;
  reply_count: number;
  is_pinned: boolean;
  is_solved: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  
  // Relations
  replies?: ForumReply[];
  votes?: ForumVote[];
}

export interface ForumReply {
  id: string;
  post_id: string;
  parent_id?: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  vote_score: number;
  is_solution: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  votes?: ForumVote[];
  replies?: ForumReply[];
}

export interface ForumVote {
  id: string;
  post_id?: string;
  reply_id?: string;
  user_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

export interface InnovationChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prize_amount?: number;
  currency?: string;
  deadline: string;
  status: 'active' | 'voting' | 'completed' | 'cancelled';
  participant_count: number;
  submission_count: number;
  created_by: string;
  created_at: string;
  
  // Relations
  submissions?: ChallengeSubmission[];
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  user_id: string;
  title: string;
  description: string;
  solution_file_url?: string;
  vote_count: number;
  rank?: number;
  created_at: string;
  
  // Relations
  votes?: SubmissionVote[];
}

export interface SubmissionVote {
  id: string;
  submission_id: string;
  user_id: string;
  created_at: string;
}

export interface UserReputation {
  id: string;
  user_id: string;
  reputation_score: number;
  posts_created: number;
  replies_created: number;
  solutions_provided: number;
  upvotes_received: number;
  badges: string[];
  level: 'newcomer' | 'contributor' | 'expert' | 'master' | 'legend';
  updated_at: string;
}

// Expert Network Types
export interface Expert {
  id: string;
  user_id: string;
  display_name: string;
  title: string;
  company?: string;
  bio: string;
  avatar_url?: string;
  specializations: ExpertSpecialization[];
  years_experience: number;
  hourly_rate?: number;
  currency?: string;
  rating: number;
  review_count: number;
  consultation_count: number;
  response_time_hours: number;
  is_available: boolean;
  availability_schedule: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Relations
  reviews?: ExpertReview[];
  consultations?: Consultation[];
}

export interface ExpertReview {
  id: string;
  expert_id: string;
  reviewer_id: string;
  reviewer_name: string;
  consultation_id?: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

export interface Consultation {
  id: string;
  expert_id: string;
  client_id: string;
  title: string;
  description: string;
  type: 'one_time' | 'ongoing' | 'project_based';
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_at?: string;
  duration_minutes?: number;
  rate_per_hour?: number;
  total_cost?: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  meeting_url?: string;
  notes?: string;
  deliverables?: string[];
  created_at: string;
  updated_at: string;
  
  // Relations
  expert?: Expert;
  messages?: ConsultationMessage[];
}

export interface ConsultationMessage {
  id: string;
  consultation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface MentorshipProgram {
  id: string;
  mentor_id: string;
  mentee_id: string;
  program_type: 'patent_basics' | 'ip_strategy' | 'technical_writing' | 'prosecution';
  status: 'active' | 'completed' | 'paused';
  start_date: string;
  end_date?: string;
  session_count: number;
  progress_percentage: number;
  goals: string[];
  created_at: string;
  
  // Relations
  mentor?: Expert;
  sessions?: MentorshipSession[];
}

export interface MentorshipSession {
  id: string;
  program_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  meeting_url?: string;
  notes?: string;
  homework?: string;
  completed_at?: string;
}

// Collaborative Review Types
export interface ReviewDocument {
  id: string;
  title: string;
  document_type: 'patent_application' | 'prior_art' | 'technical_spec' | 'legal_doc' | 'research_paper';
  content: Record<string, any>;
  file_url?: string;
  version: number;
  status: ReviewStatus;
  workflow_stage: string;
  created_by: string;
  assigned_reviewers: string[];
  deadline?: string;
  priority: TaskPriority;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Relations
  reviewers?: DocumentReviewer[];
  annotations?: DocumentAnnotation[];
  approvals?: ReviewApproval[];
  versions?: ReviewDocumentVersion[];
}

export interface DocumentReviewer {
  id: string;
  document_id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  role: 'primary' | 'secondary' | 'observer';
  status: 'pending' | 'reviewing' | 'completed';
  assigned_at: string;
  completed_at?: string;
  
  // Review progress
  sections_reviewed: string[];
  total_sections: number;
  annotations_count: number;
}

export interface DocumentAnnotation {
  id: string;
  document_id: string;
  reviewer_id: string;
  reviewer_name: string;
  type: 'comment' | 'suggestion' | 'issue' | 'approval' | 'highlight';
  content: string;
  position: {
    page?: number;
    line?: number;
    selection?: { start: number; end: number };
    coordinates?: { x: number; y: number };
  };
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved' | 'dismissed';
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  replies?: AnnotationReply[];
}

export interface AnnotationReply {
  id: string;
  annotation_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface ReviewApproval {
  id: string;
  document_id: string;
  reviewer_id: string;
  reviewer_name: string;
  stage: string;
  decision: 'approved' | 'rejected' | 'needs_revision';
  comments?: string;
  signature?: string;
  approval_date: string;
  conditions?: string[];
}

export interface ReviewWorkflow {
  id: string;
  name: string;
  description?: string;
  stages: WorkflowStage[];
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface WorkflowStage {
  id: string;
  name: string;
  description?: string;
  required_approvals: number;
  required_roles: TeamRole[];
  auto_advance: boolean;
  timeout_days?: number;
  parallel_review: boolean;
}

export interface ReviewDocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  content: Record<string, any>;
  file_url?: string;
  changes_summary: string;
  created_by: string;
  created_at: string;
  
  // Change tracking
  changes: DocumentChange[];
}

export interface DocumentChange {
  type: 'addition' | 'deletion' | 'modification';
  section: string;
  old_content?: string;
  new_content?: string;
  user_id: string;
  timestamp: string;
}

// Real-time collaboration types
export interface PresenceInfo {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  cursor_position?: { x: number; y: number };
  selection?: { start: number; end: number };
  current_section?: string;
  status: 'active' | 'idle' | 'away';
  last_seen: string;
}

export interface CollaborationSession {
  id: string;
  document_id: string;
  participants: PresenceInfo[];
  started_at: string;
  ended_at?: string;
  activities: SessionActivity[];
}

export interface SessionActivity {
  id: string;
  session_id: string;
  user_id: string;
  activity_type: 'joined' | 'left' | 'edited' | 'commented' | 'cursor_moved';
  data: Record<string, any>;
  timestamp: string;
}

// Form data types
export interface CreateTeamData {
  name: string;
  description?: string;
  avatar_url?: string;
  workspace_id: string;
}

export interface CreateTaskData {
  project_id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  tags?: string[];
  dependencies?: string[];
}

export interface CreateForumPostData {
  category: ForumCategory;
  title: string;
  content: string;
  tags?: string[];
}

export interface CreateConsultationData {
  expert_id: string;
  title: string;
  description: string;
  type: 'one_time' | 'ongoing' | 'project_based';
  scheduled_at?: string;
  duration_minutes?: number;
}

export interface CreateReviewDocumentData {
  title: string;
  document_type: 'patent_application' | 'prior_art' | 'technical_spec' | 'legal_doc' | 'research_paper';
  content?: Record<string, any>;
  file_url?: string;
  assigned_reviewers: string[];
  deadline?: string;
  priority: TaskPriority;
  workflow_stage?: string;
}