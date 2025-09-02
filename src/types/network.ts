// Network and messaging system types and interfaces

export type ConnectionStatus = 
  | 'connected' 
  | 'close_collaborator' 
  | 'known_connection' 
  | 'invitation_sent' 
  | 'invitation_received'
  | 'blocked';

export type ConversationType = 'direct' | 'group';
export type MessageType = 'text' | 'file' | 'system' | 'patent_reference' | 'collaboration_invite';
export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';
export type CollaborationStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export interface ExpertiseArea {
  id: string;
  name: string;
  category: string; // 'technical', 'industry', 'legal', 'business'
  proficiency_level: number; // 1-100
  years_experience: number;
  patent_count?: number; // patents in this area
}

export interface CollaborationRecord {
  id: string;
  project_name: string;
  project_type: 'patent_application' | 'research' | 'prior_art' | 'licensing' | 'litigation';
  collaborator_ids: string[];
  start_date: string;
  end_date?: string;
  status: CollaborationStatus;
  success_rating: number; // 1-5 stars
  patent_numbers?: string[];
  outcome: string;
}

export interface PatentProfile {
  total_patents: number;
  as_inventor: number;
  as_assignee: number;
  recent_publications: number; // last 12 months
  h_index?: number;
  citation_count?: number;
  top_patent_categories: string[];
  notable_patents: Array<{
    patent_number: string;
    title: string;
    publication_date: string;
    citation_count?: number;
  }>;
}

export interface NetworkContact {
  id: string;
  user_id: string; // owner of this network entry
  contact_user_id?: string; // if this contact is also a platform user
  
  // Basic Information
  first_name: string;
  last_name: string;
  display_name: string;
  title: string;
  company: string;
  department?: string;
  division?: string;
  location: string;
  timezone?: string;
  
  // Contact Information
  email: string;
  phone?: string;
  linkedin_url?: string;
  company_website?: string;
  personal_website?: string;
  
  // Professional Profile
  bio: string;
  profile_image?: string;
  years_experience: number;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduation_year: number;
  }>;
  
  // Expertise and Patents
  expertise_areas: ExpertiseArea[];
  patent_profile: PatentProfile;
  publications: Array<{
    title: string;
    journal: string;
    publication_date: string;
    co_authors: string[];
  }>;
  
  // Network Relationship
  connection_status: ConnectionStatus;
  connection_strength: number; // 1-100 calculated score
  connection_date?: string;
  connection_source: 'manual' | 'imported' | 'recommendation' | 'event' | 'mutual_connection';
  
  // Innovation Metrics (AI-calculated)
  innovation_score: number; // 1-100 based on patents, collaborations, impact
  collaboration_potential: number; // 1-100 match score with user's expertise
  response_rate: number; // historical communication response rate
  collaboration_success_rate: number; // success rate of past projects
  
  // Activity and Engagement
  last_interaction?: string;
  interaction_frequency: 'daily' | 'weekly' | 'monthly' | 'rarely' | 'never';
  mutual_connections: number;
  shared_projects: string[];
  shared_expertise_areas: string[];
  
  // Collaboration History
  collaboration_history: CollaborationRecord[];
  
  // System Fields
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  is_active: boolean;
  notes?: string; // private notes about this contact
}

export interface ConnectionInvitation {
  id: string;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  receiver_email: string;
  message?: string;
  invitation_type: 'connect' | 'collaborate' | 'project_invite' | 'expertise_request';
  project_context?: string;
  expertise_needed?: string[];
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sent_at: string;
  responded_at?: string;
  expires_at: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string; // for group conversations
  description?: string;
  avatar_url?: string;
  
  // Participants
  participant_ids: string[];
  created_by: string;
  admin_ids: string[]; // for group conversations
  
  // Last Message Info
  last_message_id?: string;
  last_message_content?: string;
  last_message_at?: string;
  last_message_sender?: string;
  
  // Conversation Settings
  is_muted: boolean;
  is_archived: boolean;
  is_pinned: boolean;
  
  // Collaboration Context
  project_context?: string; // linked to a specific patent/project
  collaboration_type?: 'patent_drafting' | 'prior_art' | 'research' | 'general';
  
  // System Fields
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  
  // Message Content
  content: string;
  message_type: MessageType;
  
  // File/Media Attachments
  attachments?: Array<{
    id: string;
    filename: string;
    file_type: string;
    file_size: number;
    file_url: string;
    thumbnail_url?: string;
  }>;
  
  // Patent References
  patent_references?: Array<{
    patent_number: string;
    title: string;
    relevance: string;
  }>;
  
  // Message Threading
  reply_to_message_id?: string;
  thread_count?: number;
  
  // Message Status
  is_edited: boolean;
  edited_at?: string;
  is_deleted: boolean;
  deleted_at?: string;
  
  // Read Status
  read_by: Array<{
    user_id: string;
    read_at: string;
  }>;
  
  // Reactions
  reactions?: Array<{
    emoji: string;
    user_ids: string[];
  }>;
  
  // System Fields
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  
  // Participant Settings
  role: 'member' | 'admin' | 'owner';
  is_muted: boolean;
  notification_settings: {
    all_messages: boolean;
    mentions_only: boolean;
    muted: boolean;
  };
  
  // Activity Tracking
  joined_at: string;
  last_seen_at?: string;
  last_read_message_id?: string;
  
  // System Fields
  created_at: string;
  updated_at: string;
}

export interface UserPresence {
  user_id: string;
  status: PresenceStatus;
  status_message?: string;
  current_activity?: string; // 'Working on Patent #12345', 'In meeting', etc.
  last_seen_at: string;
  timezone: string;
}

export interface NetworkStats {
  total_connections: number;
  close_collaborators: number;
  known_connections: number;
  pending_invitations: number;
  
  // Engagement Stats
  messages_sent: number;
  messages_received: number;
  active_conversations: number;
  
  // Collaboration Stats
  active_projects: number;
  completed_collaborations: number;
  success_rate: number;
  average_response_time: number; // in hours
  
  // Growth Stats
  new_connections_this_month: number;
  connection_acceptance_rate: number;
}

export interface SmartRecommendation {
  id: string;
  type: 'connection' | 'collaboration' | 'expertise_match' | 'project_opportunity';
  contact_id?: string;
  contact_name?: string;
  confidence_score: number; // 1-100
  reason: string;
  explanation: string;
  suggested_action: string;
  context_data: Record<string, any>;
  created_at: string;
  is_dismissed: boolean;
  is_acted_upon: boolean;
}

export interface NetworkSearchFilters {
  query?: string;
  connection_status?: ConnectionStatus[];
  expertise_areas?: string[];
  companies?: string[];
  locations?: string[];
  min_patents?: number;
  min_innovation_score?: number;
  min_collaboration_potential?: number;
  sort_by: 'relevance' | 'connection_strength' | 'innovation_score' | 'recent_activity' | 'alphabetical' | 'collaboration_potential';
  sort_order: 'asc' | 'desc';
}

// API Request/Response Types
export interface CreateContactRequest {
  first_name: string;
  last_name: string;
  email: string;
  title?: string;
  company?: string;
  connection_source?: string;
  initial_message?: string;
}

export interface SendInvitationRequest {
  contact_id?: string;
  email?: string;
  message?: string;
  invitation_type: 'connect' | 'collaborate';
  project_context?: string;
  expertise_needed?: string[];
}

export interface SendMessageRequest {
  conversation_id: string;
  content: string;
  message_type: MessageType;
  reply_to_message_id?: string;
  attachments?: File[];
  patent_references?: Array<{
    patent_number: string;
    title: string;
    relevance: string;
  }>;
}

export interface CreateConversationRequest {
  type: ConversationType;
  participant_ids: string[];
  name?: string;
  description?: string;
  project_context?: string;
  initial_message?: string;
}