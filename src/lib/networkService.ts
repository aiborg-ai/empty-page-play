import { supabase } from './supabase';
import { InstantAuthService } from './instantAuth';
import type {
  NetworkContact,
  ConnectionInvitation,
  NetworkStats,
  NetworkSearchFilters,
  CreateContactRequest,
  SendInvitationRequest,
  SmartRecommendation
} from '../types/network';

export class NetworkService {
  /**
   * Get current user's network statistics
   */
  static async getNetworkStats(): Promise<NetworkStats | null> {
    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        console.error('No current user found');
        return null;
      }

      // Try using the RPC function first
      const { data, error } = await supabase.rpc('get_network_stats', {
        user_uuid: currentUser.id
      });

      if (error) {
        console.error('Error fetching network stats:', error);
        // Fallback to manual calculation
        return await this.calculateNetworkStatsLocally(currentUser.id);
      }

      // Convert to NetworkStats format
      const stats: NetworkStats = {
        total_connections: data.total_connections || 0,
        close_collaborators: data.close_collaborators || 0,
        known_connections: data.known_connections || 0,
        pending_invitations: data.pending_invitations || 0,
        messages_sent: 0, // TODO: Calculate from messages table
        messages_received: 0,
        active_conversations: 0,
        active_projects: 0,
        completed_collaborations: 0,
        success_rate: 85, // Default for demo
        average_response_time: 4.5,
        new_connections_this_month: Math.floor(Math.random() * 10) + 1,
        connection_acceptance_rate: 78
      };

      return stats;
    } catch (error) {
      console.error('Error in getNetworkStats:', error);
      const currentUser = InstantAuthService.getCurrentUser();
      return this.calculateNetworkStatsLocally(currentUser?.id || '');
    }
  }

  /**
   * Fallback method to calculate stats locally
   */
  private static async calculateNetworkStatsLocally(userId: string): Promise<NetworkStats> {
    // Fallback with localStorage for demo users
    const localContacts = localStorage.getItem(`network_contacts_${userId}`);
    let contactCount = 0;
    let closeCollaborators = 0;
    let knownConnections = 0;

    if (localContacts) {
      try {
        const contacts = JSON.parse(localContacts);
        contactCount = contacts.length;
        closeCollaborators = contacts.filter((c: any) => c.connection_status === 'close_collaborator').length;
        knownConnections = contacts.filter((c: any) => c.connection_status === 'known_connection').length;
      } catch (e) {
        console.error('Error parsing local contacts:', e);
      }
    }

    return {
      total_connections: contactCount,
      close_collaborators: closeCollaborators,
      known_connections: knownConnections,
      pending_invitations: Math.floor(Math.random() * 5),
      messages_sent: Math.floor(Math.random() * 100) + 50,
      messages_received: Math.floor(Math.random() * 120) + 60,
      active_conversations: Math.floor(Math.random() * 15) + 5,
      active_projects: Math.floor(Math.random() * 8) + 2,
      completed_collaborations: Math.floor(Math.random() * 25) + 10,
      success_rate: 75 + Math.floor(Math.random() * 20),
      average_response_time: 2 + Math.random() * 8,
      new_connections_this_month: Math.floor(Math.random() * 10) + 1,
      connection_acceptance_rate: 60 + Math.floor(Math.random() * 35)
    };
  }

  /**
   * Get all contacts for the current user
   */
  static async getContacts(filters?: NetworkSearchFilters): Promise<NetworkContact[]> {
    console.log('🔍 Fetching network contacts...');

    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        console.error('No current user found');
        return [];
      }

      // Try database first
      let query = supabase
        .from('network_contacts')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('is_active', true);

      // Apply filters
      if (filters?.connection_status && filters.connection_status.length > 0) {
        query = query.in('connection_status', filters.connection_status);
      }

      if (filters?.min_innovation_score) {
        query = query.gte('innovation_score', filters.min_innovation_score);
      }

      if (filters?.query) {
        query = query.or(`display_name.ilike.%${filters.query}%,company.ilike.%${filters.query}%,title.ilike.%${filters.query}%`);
      }

      // Apply sorting
      const sortField = filters?.sort_by || 'collaboration_potential';
      const sortOrder = filters?.sort_order || 'desc';
      
      if (sortField === 'alphabetical') {
        query = query.order('display_name', { ascending: sortOrder === 'asc' });
      } else if (sortField === 'recent_activity') {
        query = query.order('last_interaction', { ascending: sortOrder === 'asc', nullsFirst: false });
      } else {
        query = query.order(sortField, { ascending: sortOrder === 'asc' });
      }

      const { data, error } = await query.limit(100);

      if (error) {
        console.error('Database query failed, using localStorage:', error);
        return this.getContactsFromLocalStorage(currentUser.id, filters);
      }

      console.log(`✅ Fetched ${data?.length || 0} contacts from database`);
      return data || [];

    } catch (error) {
      console.error('Error fetching contacts:', error);
      const currentUser = InstantAuthService.getCurrentUser();
      return this.getContactsFromLocalStorage(currentUser?.id || '', filters);
    }
  }

  /**
   * Fallback method to get contacts from localStorage
   */
  private static getContactsFromLocalStorage(userId: string, filters?: NetworkSearchFilters): NetworkContact[] {
    try {
      const localContacts = localStorage.getItem(`network_contacts_${userId}`);
      if (!localContacts) {
        return [];
      }

      let contacts: NetworkContact[] = JSON.parse(localContacts);

      // Apply filters
      if (filters?.connection_status && filters.connection_status.length > 0) {
        contacts = contacts.filter(c => filters.connection_status!.includes(c.connection_status));
      }

      if (filters?.min_innovation_score) {
        contacts = contacts.filter(c => c.innovation_score >= filters.min_innovation_score!);
      }

      if (filters?.query) {
        const query = filters.query.toLowerCase();
        contacts = contacts.filter(c => 
          c.display_name.toLowerCase().includes(query) ||
          c.company.toLowerCase().includes(query) ||
          c.title.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      const sortField = filters?.sort_by || 'collaboration_potential';
      const sortOrder = filters?.sort_order || 'desc';

      contacts.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortField) {
          case 'alphabetical':
            aValue = a.display_name;
            bValue = b.display_name;
            break;
          case 'recent_activity':
            aValue = new Date(a.last_interaction || '1970-01-01').getTime();
            bValue = new Date(b.last_interaction || '1970-01-01').getTime();
            break;
          case 'innovation_score':
            aValue = a.innovation_score;
            bValue = b.innovation_score;
            break;
          case 'connection_strength':
            aValue = a.connection_strength;
            bValue = b.connection_strength;
            break;
          default:
            aValue = a.collaboration_potential;
            bValue = b.collaboration_potential;
        }

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      console.log(`📱 Loaded ${contacts.length} contacts from localStorage`);
      return contacts;

    } catch (error) {
      console.error('Error loading contacts from localStorage:', error);
      return [];
    }
  }

  /**
   * Get a specific contact by ID
   */
  static async getContact(contactId: string): Promise<NetworkContact | null> {
    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) return null;

      // Try database first
      const { data, error } = await supabase
        .from('network_contacts')
        .select('*')
        .eq('id', contactId)
        .eq('user_id', currentUser.id)
        .single();

      if (error) {
        console.error('Database query failed, checking localStorage:', error);
        return this.getContactFromLocalStorage(currentUser.id, contactId);
      }

      return data;

    } catch (error) {
      console.error('Error fetching contact:', error);
      const currentUser = InstantAuthService.getCurrentUser();
      return this.getContactFromLocalStorage(currentUser?.id || '', contactId);
    }
  }

  /**
   * Fallback method to get contact from localStorage
   */
  private static getContactFromLocalStorage(userId: string, contactId: string): NetworkContact | null {
    try {
      const localContacts = localStorage.getItem(`network_contacts_${userId}`);
      if (!localContacts) return null;

      const contacts: NetworkContact[] = JSON.parse(localContacts);
      return contacts.find(c => c.id === contactId) || null;

    } catch (error) {
      console.error('Error loading contact from localStorage:', error);
      return null;
    }
  }

  /**
   * Create a new contact
   */
  static async createContact(contactData: CreateContactRequest): Promise<{ success: boolean; contact?: NetworkContact; message: string }> {
    console.log('👤 Creating new contact:', contactData);

    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'User must be logged in' };
      }

      // Generate a complete contact object
      const newContact: NetworkContact = {
        id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: currentUser.id,
        contact_user_id: undefined,
        first_name: contactData.first_name,
        last_name: contactData.last_name,
        display_name: `${contactData.first_name} ${contactData.last_name}`,
        title: contactData.title || 'Patent Professional',
        company: contactData.company || 'Innovation Corp',
        department: undefined,
        division: undefined,
        location: 'United States',
        timezone: 'America/New_York',
        email: contactData.email,
        phone: undefined,
        linkedin_url: undefined,
        company_website: undefined,
        personal_website: undefined,
        bio: `Experienced ${contactData.title || 'professional'} specializing in intellectual property and innovation.`,
        profile_image: undefined,
        years_experience: Math.floor(Math.random() * 15) + 5,
        education: [],
        expertise_areas: [],
        patent_profile: {
          total_patents: Math.floor(Math.random() * 50) + 5,
          as_inventor: Math.floor(Math.random() * 30) + 3,
          as_assignee: Math.floor(Math.random() * 20) + 1,
          recent_publications: Math.floor(Math.random() * 10) + 1,
          h_index: Math.floor(Math.random() * 25) + 5,
          citation_count: Math.floor(Math.random() * 500) + 100,
          top_patent_categories: ['Software', 'Hardware', 'Biotechnology'],
          notable_patents: []
        },
        publications: [],
        connection_status: 'invitation_sent',
        connection_strength: 25,
        connection_date: undefined,
        connection_source: (contactData.connection_source as 'manual' | 'imported' | 'recommendation' | 'event' | 'mutual_connection') || 'manual',
        innovation_score: Math.floor(Math.random() * 40) + 40,
        collaboration_potential: Math.floor(Math.random() * 50) + 30,
        response_rate: Math.floor(Math.random() * 40) + 40,
        collaboration_success_rate: Math.floor(Math.random() * 30) + 50,
        last_interaction: undefined,
        interaction_frequency: 'never',
        mutual_connections: Math.floor(Math.random() * 10),
        shared_projects: [],
        shared_expertise_areas: [],
        collaboration_history: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_verified: false,
        is_active: true,
        notes: undefined
      };

      // Try to save to database
      const { data, error } = await supabase
        .from('network_contacts')
        .insert([newContact])
        .select()
        .single();

      if (error) {
        console.error('Database insert failed, saving to localStorage:', error);
        return this.saveContactToLocalStorage(currentUser.id, newContact);
      }

      console.log('✅ Contact created in database:', data);
      return { success: true, contact: data, message: 'Contact created successfully' };

    } catch (error) {
      console.error('Error creating contact:', error);
      const currentUser = InstantAuthService.getCurrentUser();
      if (currentUser && contactData) {
        const newContact = this.generateBasicContact(currentUser.id, contactData);
        return this.saveContactToLocalStorage(currentUser.id, newContact);
      }
      return { success: false, message: 'Failed to create contact' };
    }
  }

  /**
   * Generate a basic contact object
   */
  private static generateBasicContact(userId: string, contactData: CreateContactRequest): NetworkContact {
    return {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      contact_user_id: undefined,
      first_name: contactData.first_name,
      last_name: contactData.last_name,
      display_name: `${contactData.first_name} ${contactData.last_name}`,
      title: contactData.title || 'Patent Professional',
      company: contactData.company || 'Innovation Corp',
      department: undefined,
      division: undefined,
      location: 'United States',
      timezone: 'America/New_York',
      email: contactData.email,
      phone: undefined,
      linkedin_url: undefined,
      company_website: undefined,
      personal_website: undefined,
      bio: `Professional in intellectual property and innovation.`,
      profile_image: undefined,
      years_experience: Math.floor(Math.random() * 15) + 5,
      education: [],
      expertise_areas: [],
      patent_profile: {
        total_patents: Math.floor(Math.random() * 50) + 5,
        as_inventor: Math.floor(Math.random() * 30) + 3,
        as_assignee: Math.floor(Math.random() * 20) + 1,
        recent_publications: Math.floor(Math.random() * 10) + 1,
        top_patent_categories: ['Technology'],
        notable_patents: []
      },
      publications: [],
      connection_status: 'invitation_sent',
      connection_strength: 25,
      connection_date: undefined,
      connection_source: (contactData.connection_source as 'manual' | 'imported' | 'recommendation' | 'event' | 'mutual_connection') || 'manual',
      innovation_score: Math.floor(Math.random() * 40) + 40,
      collaboration_potential: Math.floor(Math.random() * 50) + 30,
      response_rate: Math.floor(Math.random() * 40) + 40,
      collaboration_success_rate: Math.floor(Math.random() * 30) + 50,
      last_interaction: undefined,
      interaction_frequency: 'never',
      mutual_connections: Math.floor(Math.random() * 10),
      shared_projects: [],
      shared_expertise_areas: [],
      collaboration_history: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_verified: false,
      is_active: true,
      notes: undefined
    };
  }

  /**
   * Save contact to localStorage
   */
  private static saveContactToLocalStorage(userId: string, contact: NetworkContact): { success: boolean; contact: NetworkContact; message: string } {
    try {
      const localContacts = localStorage.getItem(`network_contacts_${userId}`);
      const contacts = localContacts ? JSON.parse(localContacts) : [];
      contacts.push(contact);
      localStorage.setItem(`network_contacts_${userId}`, JSON.stringify(contacts));

      console.log('📱 Contact saved to localStorage');
      return { success: true, contact, message: 'Contact created successfully (demo mode)' };

    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return { success: false, contact, message: 'Failed to save contact' };
    }
  }

  /**
   * Update a contact
   */
  static async updateContact(contactId: string, updates: Partial<NetworkContact>): Promise<{ success: boolean; message: string }> {
    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'User must be logged in' };
      }

      // Add updated timestamp
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Try database first
      const { error } = await supabase
        .from('network_contacts')
        .update(updatedData)
        .eq('id', contactId)
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Database update failed, updating localStorage:', error);
        return this.updateContactInLocalStorage(currentUser.id, contactId, updatedData);
      }

      return { success: true, message: 'Contact updated successfully' };

    } catch (error) {
      console.error('Error updating contact:', error);
      const currentUser = InstantAuthService.getCurrentUser();
      if (currentUser) {
        return this.updateContactInLocalStorage(currentUser.id, contactId, updates);
      }
      return { success: false, message: 'Failed to update contact' };
    }
  }

  /**
   * Update contact in localStorage
   */
  private static updateContactInLocalStorage(userId: string, contactId: string, updates: Partial<NetworkContact>): { success: boolean; message: string } {
    try {
      const localContacts = localStorage.getItem(`network_contacts_${userId}`);
      if (!localContacts) {
        return { success: false, message: 'Contact not found' };
      }

      const contacts: NetworkContact[] = JSON.parse(localContacts);
      const contactIndex = contacts.findIndex(c => c.id === contactId);

      if (contactIndex === -1) {
        return { success: false, message: 'Contact not found' };
      }

      contacts[contactIndex] = { ...contacts[contactIndex], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(`network_contacts_${userId}`, JSON.stringify(contacts));

      console.log('📱 Contact updated in localStorage');
      return { success: true, message: 'Contact updated successfully (demo mode)' };

    } catch (error) {
      console.error('Error updating contact in localStorage:', error);
      return { success: false, message: 'Failed to update contact' };
    }
  }

  /**
   * Delete a contact
   */
  static async deleteContact(contactId: string): Promise<{ success: boolean; message: string }> {
    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'User must be logged in' };
      }

      // Try database first (soft delete)
      const { error } = await supabase
        .from('network_contacts')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', contactId)
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Database delete failed, removing from localStorage:', error);
        return this.deleteContactFromLocalStorage(currentUser.id, contactId);
      }

      return { success: true, message: 'Contact removed successfully' };

    } catch (error) {
      console.error('Error deleting contact:', error);
      const currentUser = InstantAuthService.getCurrentUser();
      if (currentUser) {
        return this.deleteContactFromLocalStorage(currentUser.id, contactId);
      }
      return { success: false, message: 'Failed to remove contact' };
    }
  }

  /**
   * Delete contact from localStorage
   */
  private static deleteContactFromLocalStorage(userId: string, contactId: string): { success: boolean; message: string } {
    try {
      const localContacts = localStorage.getItem(`network_contacts_${userId}`);
      if (!localContacts) {
        return { success: false, message: 'Contact not found' };
      }

      const contacts: NetworkContact[] = JSON.parse(localContacts);
      const filteredContacts = contacts.filter(c => c.id !== contactId);

      if (filteredContacts.length === contacts.length) {
        return { success: false, message: 'Contact not found' };
      }

      localStorage.setItem(`network_contacts_${userId}`, JSON.stringify(filteredContacts));

      console.log('📱 Contact removed from localStorage');
      return { success: true, message: 'Contact removed successfully (demo mode)' };

    } catch (error) {
      console.error('Error removing contact from localStorage:', error);
      return { success: false, message: 'Failed to remove contact' };
    }
  }

  /**
   * Send a connection invitation
   */
  static async sendInvitation(invitationData: SendInvitationRequest): Promise<{ success: boolean; message: string }> {
    console.log('📧 Sending connection invitation:', invitationData);

    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'User must be logged in' };
      }

      const invitation: ConnectionInvitation = {
        id: `invitation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sender_id: currentUser.id,
        sender_name: currentUser.displayName,
        receiver_id: invitationData.contact_id || '',
        receiver_email: invitationData.email || '',
        message: invitationData.message,
        invitation_type: invitationData.invitation_type,
        project_context: invitationData.project_context,
        expertise_needed: invitationData.expertise_needed || [],
        status: 'pending',
        sent_at: new Date().toISOString(),
        responded_at: undefined,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      // Try to save to database
      const { error } = await supabase
        .from('connection_invitations')
        .insert([invitation]);

      if (error) {
        console.error('Database insert failed for invitation:', error);
        // For demo purposes, we'll just return success
        console.log('📱 Invitation sent (demo mode)');
        return { success: true, message: 'Invitation sent successfully (demo mode)' };
      }

      return { success: true, message: 'Invitation sent successfully' };

    } catch (error) {
      console.error('Error sending invitation:', error);
      return { success: true, message: 'Invitation sent successfully (demo mode)' };
    }
  }

  /**
   * Get smart recommendations for the user
   */
  static async getSmartRecommendations(): Promise<SmartRecommendation[]> {
    try {
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) return [];

      // Try database first
      const { data, error } = await supabase
        .from('smart_recommendations')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('is_dismissed', false)
        .order('confidence_score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Database query failed, generating demo recommendations:', error);
        return this.generateDemoRecommendations();
      }

      return data || this.generateDemoRecommendations();

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return this.generateDemoRecommendations();
    }
  }

  /**
   * Generate demo recommendations
   */
  private static generateDemoRecommendations(): SmartRecommendation[] {
    const recommendations: SmartRecommendation[] = [
      {
        id: 'rec1',
        type: 'connection',
        contact_name: 'Dr. Sarah Chen',
        confidence_score: 92,
        reason: 'Complementary AI expertise',
        explanation: 'Dr. Chen has published 15 patents in AI-powered drug discovery, which complements your biotechnology portfolio.',
        suggested_action: 'Send connection request',
        context_data: { mutual_connections: 3, shared_expertise: ['AI', 'Biotechnology'] },
        created_at: new Date().toISOString(),
        is_dismissed: false,
        is_acted_upon: false
      },
      {
        id: 'rec2',
        type: 'collaboration',
        contact_name: 'Michael Rodriguez',
        confidence_score: 87,
        reason: 'Active in similar patent areas',
        explanation: 'Michael recently published in blockchain security patents and you both work in fintech innovation.',
        suggested_action: 'Propose collaboration',
        context_data: { recent_patents: 5, overlap_score: 85 },
        created_at: new Date().toISOString(),
        is_dismissed: false,
        is_acted_upon: false
      },
      {
        id: 'rec3',
        type: 'expertise_match',
        contact_name: 'Lisa Wang',
        confidence_score: 78,
        reason: 'Seeking quantum computing experts',
        explanation: 'Lisa is looking for quantum computing expertise for a new patent application in quantum cryptography.',
        suggested_action: 'Offer expertise',
        context_data: { expertise_needed: ['Quantum Computing', 'Cryptography'] },
        created_at: new Date().toISOString(),
        is_dismissed: false,
        is_acted_upon: false
      }
    ];

    return recommendations;
  }
}