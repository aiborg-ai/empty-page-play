import { supabase } from './supabase';
import { InstantAuthService } from './instantAuth';
import type {
  Conversation,
  Message,
  UserPresence,
  SendMessageRequest,
  CreateConversationRequest,
} from '../types/network';

export class ChatService {
  private static presenceChannel: any = null;
  private static conversationChannels: Map<string, any> = new Map();

  /**
   * Initialize real-time subscriptions
   */
  static async initialize(): Promise<void> {
    console.log('🔌 Initializing ChatService...');
    
    const currentUser = InstantAuthService.getCurrentUser();
    if (!currentUser) {
      console.warn('No current user found for chat initialization');
      return;
    }

    // Initialize user presence
    await this.initializePresence(currentUser.id);
  }

  /**
   * Initialize user presence tracking
   */
  private static async initializePresence(userId: string): Promise<void> {
    try {
      // Set user as online
      await this.updateUserPresence(userId, 'online');

      // Subscribe to presence changes
      this.presenceChannel = supabase
        .channel('user_presence')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_presence' },
          (payload) => {
            console.log('👥 Presence update:', payload);
            // Emit custom event for UI updates
            window.dispatchEvent(new CustomEvent('presenceUpdate', { detail: payload }));
          }
        )
        .subscribe();

      console.log('✅ Presence tracking initialized');
    } catch (error) {
      console.error('Error initializing presence:', error);
    }
  }

  /**
   * Update user presence status
   */
  static async updateUserPresence(
    userId: string, 
    status: 'online' | 'away' | 'busy' | 'offline',
    statusMessage?: string,
    currentActivity?: string
  ): Promise<void> {
    try {
      const presenceData = {
        user_id: userId,
        status,
        status_message: statusMessage,
        current_activity: currentActivity,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_presence')
        .upsert(presenceData);

      if (error) {
        console.error('Failed to update presence in database:', error);
        // Store locally for demo
        localStorage.setItem(`presence_${userId}`, JSON.stringify(presenceData));
      }

    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  /**
   * Get user presence information
   */
  static async getUserPresence(userIds: string[]): Promise<UserPresence[]> {
    try {
      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .in('user_id', userIds);

      if (error) {
        console.error('Error fetching presence:', error);
        // Return demo presence data
        return userIds.map(userId => ({
          user_id: userId,
          status: Math.random() > 0.5 ? 'online' : 'offline',
          status_message: undefined,
          current_activity: undefined,
          last_seen_at: new Date().toISOString(),
          timezone: 'America/New_York'
        }));
      }

      return data || [];

    } catch (error) {
      console.error('Error in getUserPresence:', error);
      return [];
    }
  }

  /**
   * Get all conversations for the current user
   */
  static async getConversations(): Promise<Conversation[]> {
    console.log('💬 Fetching conversations...');

    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        console.error('No current user found');
        return [];
      }

      // Try database first
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participant_ids', [currentUser.id])
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.error('Database query failed, using localStorage:', error);
        return this.getConversationsFromLocalStorage(currentUser.id);
      }

      console.log(`✅ Fetched ${data?.length || 0} conversations from database`);
      return data || [];

    } catch (error) {
      console.error('Error fetching conversations:', error);
      const currentUser = InstantAuthService.getCurrentUser();
      return this.getConversationsFromLocalStorage(currentUser?.id || '');
    }
  }

  /**
   * Get conversations from localStorage (fallback)
   */
  private static getConversationsFromLocalStorage(userId: string): Conversation[] {
    try {
      const localConversations = localStorage.getItem(`conversations_${userId}`);
      if (!localConversations) {
        // Return demo conversations
        return this.generateDemoConversations(userId);
      }

      const conversations: Conversation[] = JSON.parse(localConversations);
      console.log(`📱 Loaded ${conversations.length} conversations from localStorage`);
      return conversations;

    } catch (error) {
      console.error('Error loading conversations from localStorage:', error);
      return this.generateDemoConversations(userId);
    }
  }

  /**
   * Generate demo conversations for testing
   */
  private static generateDemoConversations(userId: string): Conversation[] {
    const now = new Date();
    const conversations: Conversation[] = [
      {
        id: 'conv_demo_1',
        type: 'direct',
        name: undefined,
        description: undefined,
        avatar_url: undefined,
        participant_ids: [userId, 'contact_demo_1'],
        created_by: userId,
        admin_ids: [],
        last_message_id: 'msg_demo_1',
        last_message_content: 'Looking forward to collaborating on the AI patent application!',
        last_message_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 min ago
        last_message_sender: 'contact_demo_1',
        is_muted: false,
        is_archived: false,
        is_pinned: false,
        project_context: 'AI-Powered Drug Discovery Platform',
        collaboration_type: 'patent_drafting',
        created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        updated_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'conv_demo_2',
        type: 'group',
        name: 'Blockchain Security Research',
        description: 'Collaboration on blockchain security patents',
        avatar_url: undefined,
        participant_ids: [userId, 'contact_demo_2', 'contact_demo_3'],
        created_by: 'contact_demo_2',
        admin_ids: ['contact_demo_2', userId],
        last_message_id: 'msg_demo_2',
        last_message_content: 'The prior art search is complete. Ready to review findings.',
        last_message_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        last_message_sender: 'contact_demo_3',
        is_muted: false,
        is_archived: false,
        is_pinned: true,
        project_context: 'Quantum-Resistant Blockchain',
        collaboration_type: 'research',
        created_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Store demo conversations
    localStorage.setItem(`conversations_${userId}`, JSON.stringify(conversations));
    return conversations;
  }

  /**
   * Create a new conversation
   */
  static async createConversation(conversationData: CreateConversationRequest): Promise<{ success: boolean; conversation?: Conversation; message: string }> {
    console.log('💬 Creating new conversation:', conversationData);

    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'User must be logged in' };
      }

      const newConversation: Conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: conversationData.type,
        name: conversationData.name,
        description: conversationData.description,
        avatar_url: undefined,
        participant_ids: [currentUser.id, ...conversationData.participant_ids],
        created_by: currentUser.id,
        admin_ids: conversationData.type === 'group' ? [currentUser.id] : [],
        last_message_id: undefined,
        last_message_content: undefined,
        last_message_at: undefined,
        last_message_sender: undefined,
        is_muted: false,
        is_archived: false,
        is_pinned: false,
        project_context: conversationData.project_context,
        collaboration_type: 'general',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try to save to database
      const { data, error } = await supabase
        .from('conversations')
        .insert([newConversation])
        .select()
        .single();

      if (error) {
        console.error('Database insert failed, saving to localStorage:', error);
        return this.saveConversationToLocalStorage(currentUser.id, newConversation);
      }

      // Subscribe to real-time updates for this conversation
      await this.subscribeToConversation(data.id);

      console.log('✅ Conversation created in database:', data);
      return { success: true, conversation: data, message: 'Conversation created successfully' };

    } catch (error) {
      console.error('Error creating conversation:', error);
      const currentUser = InstantAuthService.getCurrentUser();
      if (currentUser && conversationData) {
        const newConversation = this.generateBasicConversation(currentUser.id, conversationData);
        return this.saveConversationToLocalStorage(currentUser.id, newConversation);
      }
      return { success: false, message: 'Failed to create conversation' };
    }
  }

  /**
   * Generate a basic conversation object
   */
  private static generateBasicConversation(userId: string, conversationData: CreateConversationRequest): Conversation {
    return {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: conversationData.type,
      name: conversationData.name,
      description: conversationData.description,
      avatar_url: undefined,
      participant_ids: [userId, ...conversationData.participant_ids],
      created_by: userId,
      admin_ids: conversationData.type === 'group' ? [userId] : [],
      last_message_id: undefined,
      last_message_content: undefined,
      last_message_at: undefined,
      last_message_sender: undefined,
      is_muted: false,
      is_archived: false,
      is_pinned: false,
      project_context: conversationData.project_context,
      collaboration_type: 'general',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Save conversation to localStorage
   */
  private static saveConversationToLocalStorage(userId: string, conversation: Conversation): { success: boolean; conversation: Conversation; message: string } {
    try {
      const localConversations = localStorage.getItem(`conversations_${userId}`);
      const conversations = localConversations ? JSON.parse(localConversations) : [];
      conversations.push(conversation);
      localStorage.setItem(`conversations_${userId}`, JSON.stringify(conversations));

      console.log('📱 Conversation saved to localStorage');
      return { success: true, conversation, message: 'Conversation created successfully (demo mode)' };

    } catch (error) {
      console.error('Error saving conversation to localStorage:', error);
      return { success: false, conversation, message: 'Failed to save conversation' };
    }
  }

  /**
   * Subscribe to real-time updates for a specific conversation
   */
  static async subscribeToConversation(conversationId: string): Promise<void> {
    try {
      // Don't subscribe to the same conversation multiple times
      if (this.conversationChannels.has(conversationId)) {
        return;
      }

      const channel = supabase
        .channel(`conversation_${conversationId}`)
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
          (payload) => {
            console.log('💬 New message received:', payload.new);
            // Emit custom event for UI updates
            window.dispatchEvent(new CustomEvent('newMessage', { 
              detail: { conversationId, message: payload.new } 
            }));
          }
        )
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'conversations', filter: `id=eq.${conversationId}` },
          (payload) => {
            console.log('💬 Conversation updated:', payload.new);
            // Emit custom event for UI updates
            window.dispatchEvent(new CustomEvent('conversationUpdate', { 
              detail: { conversationId, conversation: payload.new } 
            }));
          }
        )
        .subscribe();

      this.conversationChannels.set(conversationId, channel);
      console.log(`✅ Subscribed to conversation: ${conversationId}`);

    } catch (error) {
      console.error('Error subscribing to conversation:', error);
    }
  }

  /**
   * Unsubscribe from a conversation
   */
  static async unsubscribeFromConversation(conversationId: string): Promise<void> {
    const channel = this.conversationChannels.get(conversationId);
    if (channel) {
      await supabase.removeChannel(channel);
      this.conversationChannels.delete(conversationId);
      console.log(`🔌 Unsubscribed from conversation: ${conversationId}`);
    }
  }

  /**
   * Get messages for a specific conversation
   */
  static async getMessages(conversationId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    console.log(`💬 Fetching messages for conversation: ${conversationId}`);

    try {
      // Try database first
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Database query failed, using localStorage:', error);
        return this.getMessagesFromLocalStorage(conversationId, limit, offset);
      }

      // Reverse the order to show oldest first
      const messages = (data || []).reverse();
      console.log(`✅ Fetched ${messages.length} messages from database`);
      return messages;

    } catch (error) {
      console.error('Error fetching messages:', error);
      return this.getMessagesFromLocalStorage(conversationId, limit, offset);
    }
  }

  /**
   * Get messages from localStorage (fallback)
   */
  private static getMessagesFromLocalStorage(conversationId: string, limit: number, offset: number): Message[] {
    try {
      const localMessages = localStorage.getItem(`messages_${conversationId}`);
      if (!localMessages) {
        // Generate demo messages for demo conversations
        if (conversationId.startsWith('conv_demo_')) {
          return this.generateDemoMessages(conversationId);
        }
        return [];
      }

      const messages: Message[] = JSON.parse(localMessages);
      const paginatedMessages = messages.slice(offset, offset + limit);
      console.log(`📱 Loaded ${paginatedMessages.length} messages from localStorage`);
      return paginatedMessages;

    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
      return [];
    }
  }

  /**
   * Generate demo messages for testing
   */
  private static generateDemoMessages(conversationId: string): Message[] {
    const currentUser = InstantAuthService.getCurrentUser();
    if (!currentUser) return [];

    const now = new Date();
    const messages: Message[] = [
      {
        id: 'msg_demo_1',
        conversation_id: conversationId,
        sender_id: 'contact_demo_1',
        sender_name: 'Dr. Sarah Chen',
        sender_avatar: undefined,
        content: 'Hi! I reviewed your AI patent draft. The approach is innovative!',
        message_type: 'text',
        attachments: [],
        patent_references: [],
        reply_to_message_id: undefined,
        thread_count: 0,
        is_edited: false,
        edited_at: undefined,
        is_deleted: false,
        deleted_at: undefined,
        read_by: [{ user_id: currentUser.id, read_at: new Date().toISOString() }],
        reactions: [],
        created_at: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
        updated_at: new Date(now.getTime() - 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg_demo_2',
        conversation_id: conversationId,
        sender_id: currentUser.id,
        sender_name: currentUser.displayName,
        sender_avatar: undefined,
        content: 'Thank you! I\'d love to get your feedback on the claims section.',
        message_type: 'text',
        attachments: [],
        patent_references: [],
        reply_to_message_id: undefined,
        thread_count: 0,
        is_edited: false,
        edited_at: undefined,
        is_deleted: false,
        deleted_at: undefined,
        read_by: [{ user_id: 'contact_demo_1', read_at: new Date().toISOString() }],
        reactions: [],
        created_at: new Date(now.getTime() - 45 * 60 * 1000).toISOString(), // 45 min ago
        updated_at: new Date(now.getTime() - 45 * 60 * 1000).toISOString()
      },
      {
        id: 'msg_demo_3',
        conversation_id: conversationId,
        sender_id: 'contact_demo_1',
        sender_name: 'Dr. Sarah Chen',
        sender_avatar: undefined,
        content: 'Looking forward to collaborating on the AI patent application!',
        message_type: 'text',
        attachments: [],
        patent_references: [{
          patent_number: 'US10,123,456',
          title: 'Machine Learning System for Drug Discovery',
          relevance: 'Similar approach to neural network architecture'
        }],
        reply_to_message_id: undefined,
        thread_count: 0,
        is_edited: false,
        edited_at: undefined,
        is_deleted: false,
        deleted_at: undefined,
        read_by: [],
        reactions: [{ emoji: '👍', user_ids: [currentUser.id] }],
        created_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 min ago
        updated_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
      }
    ];

    // Store demo messages
    localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages));
    return messages;
  }

  /**
   * Send a new message
   */
  static async sendMessage(messageData: SendMessageRequest): Promise<{ success: boolean; message?: Message; messageText: string }> {
    console.log('📨 Sending message:', messageData);

    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, messageText: 'User must be logged in' };
      }

      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversation_id: messageData.conversation_id,
        sender_id: currentUser.id,
        sender_name: currentUser.displayName,
        sender_avatar: undefined,
        content: messageData.content,
        message_type: messageData.message_type,
        attachments: [], // TODO: Handle file uploads
        patent_references: messageData.patent_references || [],
        reply_to_message_id: messageData.reply_to_message_id,
        thread_count: 0,
        is_edited: false,
        edited_at: undefined,
        is_deleted: false,
        deleted_at: undefined,
        read_by: [{ user_id: currentUser.id, read_at: new Date().toISOString() }],
        reactions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try to save to database
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) {
        console.error('Database insert failed, saving to localStorage:', error);
        return this.saveMessageToLocalStorage(newMessage);
      }

      // Update conversation's last message info
      await this.updateConversationLastMessage(messageData.conversation_id, data);

      console.log('✅ Message sent to database:', data);
      return { success: true, message: data, messageText: 'Message sent successfully' };

    } catch (error) {
      console.error('Error sending message:', error);
      const currentUser = InstantAuthService.getCurrentUser();
      if (currentUser && messageData) {
        const newMessage = this.generateBasicMessage(currentUser, messageData);
        return this.saveMessageToLocalStorage(newMessage);
      }
      return { success: false, messageText: 'Failed to send message' };
    }
  }

  /**
   * Generate a basic message object
   */
  private static generateBasicMessage(currentUser: any, messageData: SendMessageRequest): Message {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversation_id: messageData.conversation_id,
      sender_id: currentUser.id,
      sender_name: currentUser.displayName,
      sender_avatar: undefined,
      content: messageData.content,
      message_type: messageData.message_type,
      attachments: [],
      patent_references: messageData.patent_references || [],
      reply_to_message_id: messageData.reply_to_message_id,
      thread_count: 0,
      is_edited: false,
      edited_at: undefined,
      is_deleted: false,
      deleted_at: undefined,
      read_by: [{ user_id: currentUser.id, read_at: new Date().toISOString() }],
      reactions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Save message to localStorage
   */
  private static saveMessageToLocalStorage(message: Message): { success: boolean; message: Message; messageText: string } {
    try {
      const localMessages = localStorage.getItem(`messages_${message.conversation_id}`);
      const messages = localMessages ? JSON.parse(localMessages) : [];
      messages.push(message);
      localStorage.setItem(`messages_${message.conversation_id}`, JSON.stringify(messages));

      // Also update the conversation's last message info in localStorage
      this.updateConversationLastMessageLocal(message.conversation_id, message);

      console.log('📱 Message saved to localStorage');
      
      // Emit custom event for UI updates
      window.dispatchEvent(new CustomEvent('newMessage', { 
        detail: { conversationId: message.conversation_id, message } 
      }));

      return { success: true, message, messageText: 'Message sent successfully (demo mode)' };

    } catch (error) {
      console.error('Error saving message to localStorage:', error);
      return { success: false, message, messageText: 'Failed to save message' };
    }
  }

  /**
   * Update conversation's last message info
   */
  private static async updateConversationLastMessage(conversationId: string, message: Message): Promise<void> {
    try {
      const updateData = {
        last_message_id: message.id,
        last_message_content: message.content.substring(0, 100), // Truncate long messages
        last_message_at: message.created_at,
        last_message_sender: message.sender_id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', conversationId);

      if (error) {
        console.error('Error updating conversation last message:', error);
      }

    } catch (error) {
      console.error('Error in updateConversationLastMessage:', error);
    }
  }

  /**
   * Update conversation's last message info in localStorage
   */
  private static updateConversationLastMessageLocal(conversationId: string, message: Message): void {
    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) return;

      const localConversations = localStorage.getItem(`conversations_${currentUser.id}`);
      if (!localConversations) return;

      const conversations: Conversation[] = JSON.parse(localConversations);
      const conversationIndex = conversations.findIndex(c => c.id === conversationId);

      if (conversationIndex !== -1) {
        conversations[conversationIndex].last_message_id = message.id;
        conversations[conversationIndex].last_message_content = message.content.substring(0, 100);
        conversations[conversationIndex].last_message_at = message.created_at;
        conversations[conversationIndex].last_message_sender = message.sender_id;
        conversations[conversationIndex].updated_at = new Date().toISOString();

        localStorage.setItem(`conversations_${currentUser.id}`, JSON.stringify(conversations));
      }

    } catch (error) {
      console.error('Error updating conversation in localStorage:', error);
    }
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(conversationId: string, messageIds: string[]): Promise<void> {
    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) return;

      // Update in database
      const { error } = await supabase
        .from('messages')
        .update({
          read_by: supabase.rpc('jsonb_add_read_status', {
            current_read_by: 'read_by',
            user_id: currentUser.id,
            read_at: new Date().toISOString()
          })
        })
        .in('id', messageIds)
        .eq('conversation_id', conversationId);

      if (error) {
        console.error('Error marking messages as read:', error);
        // Fallback to localStorage update
        this.markMessagesAsReadLocal(conversationId, messageIds, currentUser.id);
      }

    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
    }
  }

  /**
   * Mark messages as read in localStorage
   */
  private static markMessagesAsReadLocal(conversationId: string, messageIds: string[], userId: string): void {
    try {
      const localMessages = localStorage.getItem(`messages_${conversationId}`);
      if (!localMessages) return;

      const messages: Message[] = JSON.parse(localMessages);
      const readTimestamp = new Date().toISOString();

      messages.forEach(message => {
        if (messageIds.includes(message.id)) {
          const existingRead = message.read_by.find(r => r.user_id === userId);
          if (!existingRead) {
            message.read_by.push({ user_id: userId, read_at: readTimestamp });
          }
        }
      });

      localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages));

    } catch (error) {
      console.error('Error marking messages as read locally:', error);
    }
  }

  /**
   * Cleanup subscriptions and connections
   */
  static async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up ChatService...');

    // Update user presence to offline
    const currentUser = InstantAuthService.getCurrentUser();
    if (currentUser) {
      await this.updateUserPresence(currentUser.id, 'offline');
    }

    // Unsubscribe from all conversation channels
    for (const [, channel] of this.conversationChannels) {
      await supabase.removeChannel(channel);
    }
    this.conversationChannels.clear();

    // Unsubscribe from presence channel
    if (this.presenceChannel) {
      await supabase.removeChannel(this.presenceChannel);
      this.presenceChannel = null;
    }

    console.log('✅ ChatService cleanup complete');
  }
}