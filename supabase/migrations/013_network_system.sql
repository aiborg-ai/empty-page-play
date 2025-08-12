-- Network System Migration - Revolutionary Patent Professional Network
-- Follows ultra-safe pattern with IF NOT EXISTS and minimal FK dependencies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. NETWORK CONTACTS TABLE
-- Central table for storing professional contacts with patent expertise
CREATE TABLE IF NOT EXISTS network_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- owner of this network entry
  contact_user_id UUID, -- if this contact is also a platform user
  
  -- Basic Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  department TEXT,
  division TEXT,
  location TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  
  -- Contact Information
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  company_website TEXT,
  personal_website TEXT,
  
  -- Professional Profile
  bio TEXT DEFAULT '',
  profile_image TEXT,
  years_experience INTEGER DEFAULT 0,
  education JSONB DEFAULT '[]', -- array of education objects
  
  -- Expertise and Patents (JSONB for flexibility)
  expertise_areas JSONB DEFAULT '[]', -- array of expertise area objects
  patent_profile JSONB DEFAULT '{}', -- patent statistics and notable patents
  publications JSONB DEFAULT '[]', -- array of publication objects
  
  -- Network Relationship
  connection_status TEXT DEFAULT 'known_connection' 
    CHECK (connection_status IN ('connected', 'close_collaborator', 'known_connection', 'invitation_sent', 'invitation_received', 'blocked')),
  connection_strength INTEGER DEFAULT 50 CHECK (connection_strength >= 0 AND connection_strength <= 100),
  connection_date TIMESTAMPTZ,
  connection_source TEXT DEFAULT 'manual'
    CHECK (connection_source IN ('manual', 'imported', 'recommendation', 'event', 'mutual_connection')),
  
  -- Innovation Metrics (AI-calculated)
  innovation_score INTEGER DEFAULT 50 CHECK (innovation_score >= 0 AND innovation_score <= 100),
  collaboration_potential INTEGER DEFAULT 50 CHECK (collaboration_potential >= 0 AND collaboration_potential <= 100),
  response_rate INTEGER DEFAULT 50 CHECK (response_rate >= 0 AND response_rate <= 100),
  collaboration_success_rate INTEGER DEFAULT 50 CHECK (collaboration_success_rate >= 0 AND collaboration_success_rate <= 100),
  
  -- Activity and Engagement
  last_interaction TIMESTAMPTZ,
  interaction_frequency TEXT DEFAULT 'rarely'
    CHECK (interaction_frequency IN ('daily', 'weekly', 'monthly', 'rarely', 'never')),
  mutual_connections INTEGER DEFAULT 0,
  shared_projects JSONB DEFAULT '[]',
  shared_expertise_areas JSONB DEFAULT '[]',
  
  -- Collaboration History
  collaboration_history JSONB DEFAULT '[]', -- array of collaboration record objects
  
  -- System Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT, -- private notes about this contact
  
  -- Unique constraint
  CONSTRAINT network_contacts_unique_user_email UNIQUE(user_id, email)
);

-- 2. CONNECTION INVITATIONS TABLE
-- Manages connection requests and invitations
CREATE TABLE IF NOT EXISTS connection_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  receiver_id UUID,
  receiver_email TEXT NOT NULL,
  message TEXT,
  
  invitation_type TEXT DEFAULT 'connect'
    CHECK (invitation_type IN ('connect', 'collaborate', 'project_invite', 'expertise_request')),
  project_context TEXT,
  expertise_needed JSONB DEFAULT '[]',
  
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CONVERSATIONS TABLE
-- Supports both 1-to-1 and group conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
  name TEXT, -- for group conversations
  description TEXT,
  avatar_url TEXT,
  
  -- Participants (stored as JSONB array for flexibility)
  participant_ids JSONB NOT NULL DEFAULT '[]',
  created_by UUID NOT NULL,
  admin_ids JSONB DEFAULT '[]', -- for group conversations
  
  -- Last Message Info (denormalized for performance)
  last_message_id UUID,
  last_message_content TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_sender UUID,
  
  -- Conversation Settings
  is_archived BOOLEAN DEFAULT FALSE,
  
  -- Collaboration Context
  project_context TEXT, -- linked to a specific patent/project
  collaboration_type TEXT
    CHECK (collaboration_type IN ('patent_drafting', 'prior_art', 'research', 'general') OR collaboration_type IS NULL),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MESSAGES TABLE
-- Stores all chat messages with rich content support
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  
  -- Message Content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text'
    CHECK (message_type IN ('text', 'file', 'system', 'patent_reference', 'collaboration_invite')),
  
  -- File/Media Attachments
  attachments JSONB DEFAULT '[]',
  
  -- Patent References
  patent_references JSONB DEFAULT '[]',
  
  -- Message Threading
  reply_to_message_id UUID,
  thread_count INTEGER DEFAULT 0,
  
  -- Message Status
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  
  -- Read Status (JSONB for flexibility)
  read_by JSONB DEFAULT '[]',
  
  -- Reactions
  reactions JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONVERSATION PARTICIPANTS TABLE
-- Tracks user participation in conversations with settings
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  user_id UUID NOT NULL,
  
  -- Participant Settings
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'owner')),
  is_muted BOOLEAN DEFAULT FALSE,
  notification_settings JSONB DEFAULT '{"all_messages": true, "mentions_only": false, "muted": false}',
  
  -- Activity Tracking
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,
  last_read_message_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  CONSTRAINT conversation_participants_unique UNIQUE(conversation_id, user_id)
);

-- 6. USER PRESENCE TABLE
-- Tracks real-time user presence and activity
CREATE TABLE IF NOT EXISTS user_presence (
  user_id UUID PRIMARY KEY,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  status_message TEXT,
  current_activity TEXT, -- 'Working on Patent #12345', 'In meeting', etc.
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  timezone TEXT DEFAULT 'UTC',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SMART RECOMMENDATIONS TABLE
-- AI-powered networking recommendations
CREATE TABLE IF NOT EXISTS smart_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('connection', 'collaboration', 'expertise_match', 'project_opportunity')),
  
  contact_id UUID,
  contact_name TEXT,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  
  reason TEXT NOT NULL,
  explanation TEXT NOT NULL,
  suggested_action TEXT NOT NULL,
  context_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_dismissed BOOLEAN DEFAULT FALSE,
  is_acted_upon BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMPTZ,
  acted_upon_at TIMESTAMPTZ
);

-- INDEXES for Performance Optimization

-- Network contacts indexes
CREATE INDEX IF NOT EXISTS idx_network_contacts_user_id 
ON network_contacts(user_id);

CREATE INDEX IF NOT EXISTS idx_network_contacts_email 
ON network_contacts(email);

CREATE INDEX IF NOT EXISTS idx_network_contacts_company 
ON network_contacts(company);

CREATE INDEX IF NOT EXISTS idx_network_contacts_connection_status 
ON network_contacts(connection_status);

CREATE INDEX IF NOT EXISTS idx_network_contacts_innovation_score 
ON network_contacts(innovation_score DESC);

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_participant_ids 
ON conversations USING GIN (participant_ids);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at 
ON conversations(last_message_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_created_at 
ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id 
ON messages(sender_id);

-- Connection invitations indexes
CREATE INDEX IF NOT EXISTS idx_connection_invitations_receiver_email 
ON connection_invitations(receiver_email);

CREATE INDEX IF NOT EXISTS idx_connection_invitations_status 
ON connection_invitations(status);

-- Smart recommendations indexes
CREATE INDEX IF NOT EXISTS idx_smart_recommendations_user_id 
ON smart_recommendations(user_id);

CREATE INDEX IF NOT EXISTS idx_smart_recommendations_type 
ON smart_recommendations(type);

-- TRIGGERS for automatic timestamp updates

-- Update network_contacts.updated_at
CREATE OR REPLACE FUNCTION update_network_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_network_contacts_updated_at
    BEFORE UPDATE ON network_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_network_contacts_updated_at();

-- Update conversations.updated_at
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_conversations_updated_at();

-- HELPER FUNCTIONS

-- Function to get user's network statistics
CREATE OR REPLACE FUNCTION get_network_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT JSON_BUILD_OBJECT(
        'total_connections', COUNT(*),
        'close_collaborators', COUNT(*) FILTER (WHERE connection_status = 'close_collaborator'),
        'known_connections', COUNT(*) FILTER (WHERE connection_status = 'known_connection'),
        'connected', COUNT(*) FILTER (WHERE connection_status = 'connected'),
        'pending_invitations', (
            SELECT COUNT(*) FROM connection_invitations 
            WHERE receiver_id = user_uuid AND status = 'pending'
        ),
        'average_innovation_score', ROUND(AVG(innovation_score)),
        'top_expertise_areas', (
            SELECT JSON_AGG(DISTINCT expertise_area)
            FROM network_contacts,
            JSON_ARRAY_ELEMENTS_TEXT(expertise_areas) AS expertise_area
            WHERE user_id = user_uuid
            LIMIT 10
        )
    ) INTO stats
    FROM network_contacts
    WHERE user_id = user_uuid AND is_active = TRUE;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search contacts with advanced filtering
CREATE OR REPLACE FUNCTION search_network_contacts(
    user_uuid UUID,
    search_query TEXT DEFAULT '',
    status_filter TEXT[] DEFAULT NULL,
    min_innovation_score INTEGER DEFAULT 0,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    display_name TEXT,
    title TEXT,
    company TEXT,
    connection_status TEXT,
    innovation_score INTEGER,
    collaboration_potential INTEGER,
    last_interaction TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nc.id,
        nc.display_name,
        nc.title,
        nc.company,
        nc.connection_status,
        nc.innovation_score,
        nc.collaboration_potential,
        nc.last_interaction
    FROM network_contacts nc
    WHERE nc.user_id = user_uuid
        AND nc.is_active = TRUE
        AND (search_query = '' OR 
             nc.display_name ILIKE '%' || search_query || '%' OR
             nc.company ILIKE '%' || search_query || '%' OR
             nc.title ILIKE '%' || search_query || '%' OR
             nc.bio ILIKE '%' || search_query || '%')
        AND (status_filter IS NULL OR nc.connection_status = ANY(status_filter))
        AND nc.innovation_score >= min_innovation_score
    ORDER BY 
        nc.collaboration_potential DESC,
        nc.innovation_score DESC,
        nc.last_interaction DESC NULLS LAST
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ROW LEVEL SECURITY (RLS)

-- Enable RLS on all tables
ALTER TABLE network_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for network_contacts
CREATE POLICY "Users can manage their own contacts" ON network_contacts
FOR ALL USING (user_id = auth.uid());

-- RLS Policies for connection_invitations
CREATE POLICY "Users can see their sent and received invitations" ON connection_invitations
FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can create invitations" ON connection_invitations
FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their received invitations" ON connection_invitations
FOR UPDATE USING (receiver_id = auth.uid());

-- RLS Policies for conversations
CREATE POLICY "Users can see conversations they participate in" ON conversations
FOR SELECT USING (
    participant_ids ? auth.uid()::text OR 
    created_by = auth.uid()
);

CREATE POLICY "Users can create conversations" ON conversations
FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Conversation participants can update conversations" ON conversations
FOR UPDATE USING (
    participant_ids ? auth.uid()::text OR
    admin_ids ? auth.uid()::text
);

-- RLS Policies for messages
CREATE POLICY "Users can see messages in their conversations" ON messages
FOR SELECT USING (
    conversation_id IN (
        SELECT id FROM conversations 
        WHERE participant_ids ? auth.uid()::text
    )
);

CREATE POLICY "Users can send messages to their conversations" ON messages
FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
        SELECT id FROM conversations 
        WHERE participant_ids ? auth.uid()::text
    )
);

CREATE POLICY "Users can update their own messages" ON messages
FOR UPDATE USING (sender_id = auth.uid());

-- RLS Policies for conversation_participants
CREATE POLICY "Users can manage their conversation participation" ON conversation_participants
FOR ALL USING (user_id = auth.uid());

-- RLS Policies for user_presence
CREATE POLICY "Users can see all presence information" ON user_presence
FOR SELECT USING (true);

CREATE POLICY "Users can update their own presence" ON user_presence
FOR ALL USING (user_id = auth.uid());

-- RLS Policies for smart_recommendations
CREATE POLICY "Users can manage their own recommendations" ON smart_recommendations
FOR ALL USING (user_id = auth.uid());

-- PERMISSIONS
GRANT ALL ON TABLE network_contacts TO authenticated;
GRANT ALL ON TABLE connection_invitations TO authenticated;
GRANT ALL ON TABLE conversations TO authenticated;
GRANT ALL ON TABLE messages TO authenticated;
GRANT ALL ON TABLE conversation_participants TO authenticated;
GRANT ALL ON TABLE user_presence TO authenticated;
GRANT ALL ON TABLE smart_recommendations TO authenticated;

GRANT EXECUTE ON FUNCTION get_network_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION search_network_contacts(UUID, TEXT, TEXT[], INTEGER, INTEGER) TO authenticated;

-- Success message
SELECT 'Network system tables, indexes, triggers, and functions created successfully!' as status;