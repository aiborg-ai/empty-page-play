import { supabase } from './supabase';
import { InstantAuthService } from './instantAuth';

export interface CapabilityDownload {
  id: string;
  userId: string;
  capabilityId: string;
  capabilityName: string;
  capabilityType: string;
  capabilityCategory: string;
  downloadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadsByCategory {
  category: string;
  downloadCount: number;
  capabilities: Array<{
    id: string;
    name: string;
    type: string;
    downloadedAt: string;
  }>;
}

export class CapabilityDownloadService {
  /**
   * Add or update a capability download for the current user
   */
  static async downloadCapability(
    capabilityId: string,
    capabilityName: string,
    capabilityType: string,
    capabilityCategory: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    console.log('🔄 Starting capability download...', {
      capabilityId,
      capabilityName,
      capabilityType,
      capabilityCategory
    });

    try {
      // Get current user
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        console.warn('❌ No current user found');
        return {
          success: false,
          message: 'User must be logged in to download capabilities'
        };
      }

      console.log('👤 Current user:', { 
        id: currentUser.id, 
        email: currentUser.email, 
        isDemo: currentUser.isDemo 
      });

      // First, try to check if the table exists by doing a simple query
      console.log('🔍 Testing table existence...');
      const { error: testError } = await supabase
        .from('user_capability_downloads')
        .select('count', { count: 'exact', head: true });

      if (testError) {
        console.error('❌ Table test failed:', testError);
        
        // If table doesn't exist, try to create the download record directly
        console.log('🔄 Attempting direct table insert...');
        const { data: insertData, error: insertError } = await supabase
          .from('user_capability_downloads')
          .insert([
            {
              user_id: currentUser.id,
              capability_id: capabilityId,
              capability_name: capabilityName,
              capability_type: capabilityType,
              capability_category: capabilityCategory,
              downloaded_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Direct insert failed:', insertError);
          return {
            success: false,
            message: `Database error: ${insertError.message}. The download table may not exist yet.`
          };
        }

        console.log('✅ Direct insert successful:', insertData);
        return {
          success: true,
          message: 'Capability downloaded successfully (direct insert)',
          data: insertData
        };
      }

      console.log('✅ Table exists, proceeding with function call...');

      // Try using the Supabase function first
      const { data, error } = await supabase.rpc('add_capability_download', {
        user_uuid: currentUser.id,
        cap_id: capabilityId,
        cap_name: capabilityName,
        cap_type: capabilityType,
        cap_category: capabilityCategory
      });

      if (error) {
        console.error('❌ RPC function failed:', error);
        
        // Fallback to direct insert if RPC function fails
        console.log('🔄 Fallback to direct insert...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('user_capability_downloads')
          .upsert(
            {
              user_id: currentUser.id,
              capability_id: capabilityId,
              capability_name: capabilityName,
              capability_type: capabilityType,
              capability_category: capabilityCategory,
              downloaded_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              onConflict: 'user_id,capability_id'
            }
          )
          .select()
          .single();

        if (fallbackError) {
          console.error('❌ Fallback insert failed:', fallbackError);
          
          // Final fallback: use localStorage for demo users
          console.log('🔄 Using localStorage fallback for demo...');
          const downloadData = {
            capability_id: capabilityId,
            capability_name: capabilityName,
            capability_type: capabilityType,
            capability_category: capabilityCategory,
            downloaded_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const existingDownloads = localStorage.getItem(`downloads_${currentUser.id}`);
          const downloads = existingDownloads ? JSON.parse(existingDownloads) : [];
          
          // Check if already downloaded
          const existingIndex = downloads.findIndex((d: any) => d.capability_id === capabilityId);
          if (existingIndex >= 0) {
            downloads[existingIndex] = downloadData; // Update existing
          } else {
            downloads.push(downloadData); // Add new
          }
          
          localStorage.setItem(`downloads_${currentUser.id}`, JSON.stringify(downloads));
          console.log('✅ Stored in localStorage:', downloadData);
          
          return {
            success: true,
            message: 'Capability downloaded successfully (localStorage fallback)',
            data: downloadData
          };
        }

        console.log('✅ Fallback insert successful:', fallbackData);
        return {
          success: true,
          message: 'Capability downloaded successfully (fallback)',
          data: fallbackData
        };
      }

      console.log('✅ RPC function successful:', data);
      return {
        success: true,
        message: 'Capability downloaded successfully',
        data
      };
    } catch (error) {
      console.error('❌ Unexpected error in downloadCapability:', error);
      return {
        success: false,
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Remove a capability download for the current user
   */
  static async removeDownload(capabilityId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Get current user
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'User must be logged in'
        };
      }

      // Use the Supabase function to remove capability download
      const { data, error } = await supabase.rpc('remove_capability_download', {
        user_uuid: currentUser.id,
        cap_id: capabilityId
      });

      if (error) {
        console.error('Error removing capability download:', error);
        return {
          success: false,
          message: 'Failed to remove capability download'
        };
      }

      return {
        success: data?.success || false,
        message: data?.success ? 'Capability removed from downloads' : 'Capability not found in downloads'
      };
    } catch (error) {
      console.error('Error in removeDownload:', error);
      return {
        success: false,
        message: 'An error occurred while removing the capability download'
      };
    }
  }

  /**
   * Get all capability downloads for the current user
   */
  static async getUserDownloads(): Promise<CapabilityDownload[]> {
    console.log('🔍 Getting user downloads...');
    
    try {
      // Get current user
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        console.warn('❌ No current user found');
        return [];
      }

      console.log('👤 Current user ID:', currentUser.id);

      // Try the query with better error handling
      const { data, error } = await supabase
        .from('user_capability_downloads')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('downloaded_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user downloads:', error);
        
        // Always fallback to localStorage for any database error (demo users, table issues, etc.)
        console.log('🔄 Database query failed, using localStorage fallback...');
        
        const localDownloads = localStorage.getItem(`downloads_${currentUser.id}`);
        if (localDownloads) {
          console.log('📱 Found local storage data, parsing...');
          try {
            const parsed = JSON.parse(localDownloads);
            const result = parsed.map((item: any) => ({
              id: item.id || `local_${Date.now()}_${Math.random()}`,
              userId: currentUser.id,
              capabilityId: item.capability_id,
              capabilityName: item.capability_name,
              capabilityType: item.capability_type,
              capabilityCategory: item.capability_category,
              downloadedAt: item.downloaded_at,
              createdAt: item.created_at || item.downloaded_at,
              updatedAt: item.updated_at || item.downloaded_at
            }));
            console.log('✅ Loaded', result.length, 'downloads from localStorage');
            return result;
          } catch (parseError) {
            console.error('❌ Error parsing localStorage data:', parseError);
            return [];
          }
        } else {
          console.log('📭 No localStorage data found');
        }
        
        return [];
      }

      console.log('✅ Successfully fetched downloads:', data?.length || 0);

      return data?.map(item => ({
        id: item.id,
        userId: item.user_id,
        capabilityId: item.capability_id,
        capabilityName: item.capability_name,
        capabilityType: item.capability_type,
        capabilityCategory: item.capability_category,
        downloadedAt: item.downloaded_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) || [];
    } catch (error) {
      console.error('❌ Unexpected error in getUserDownloads:', error);
      return [];
    }
  }

  /**
   * Get user downloads grouped by category
   */
  static async getUserDownloadsByCategory(): Promise<DownloadsByCategory[]> {
    console.log('🔍 Getting user downloads by category...');
    
    try {
      // Get current user
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        console.warn('❌ No current user found');
        return [];
      }

      console.log('👤 Current user ID:', currentUser.id);

      // First try to get all downloads using the basic method
      const allDownloads = await this.getUserDownloads();
      
      if (allDownloads.length === 0) {
        console.log('📭 No downloads found');
        return [];
      }

      console.log('📂 Processing', allDownloads.length, 'downloads into categories');

      // Group downloads by category
      const categoryMap = new Map<string, DownloadsByCategory>();
      
      allDownloads.forEach(download => {
        const category = download.capabilityCategory.toLowerCase();
        
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            category,
            downloadCount: 0,
            capabilities: []
          });
        }
        
        const categoryData = categoryMap.get(category)!;
        categoryData.downloadCount++;
        categoryData.capabilities.push({
          id: download.capabilityId,
          name: download.capabilityName,
          type: download.capabilityType,
          downloadedAt: download.downloadedAt
        });
      });

      // Sort capabilities within each category by download date (newest first)
      categoryMap.forEach(categoryData => {
        categoryData.capabilities.sort((a, b) => 
          new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
        );
      });

      const result = Array.from(categoryMap.values()).sort((a, b) => 
        b.downloadCount - a.downloadCount // Sort categories by download count
      );

      console.log('✅ Grouped downloads into', result.length, 'categories:', result.map(r => `${r.category}(${r.downloadCount})`).join(', '));
      
      return result;
    } catch (error) {
      console.error('❌ Error in getUserDownloadsByCategory:', error);
      return [];
    }
  }

  /**
   * Check if a capability is downloaded by the current user
   */
  static async isCapabilityDownloaded(capabilityId: string): Promise<boolean> {
    try {
      // Get current user
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      const { data, error } = await supabase
        .from('user_capability_downloads')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('capability_id', capabilityId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking capability download status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in isCapabilityDownloaded:', error);
      return false;
    }
  }

  /**
   * Get download counts by category for the current user
   */
  static async getDownloadCounts(): Promise<Record<string, number>> {
    try {
      const downloads = await this.getUserDownloadsByCategory();
      const counts: Record<string, number> = {};
      
      downloads.forEach(category => {
        counts[category.category] = category.downloadCount;
      });
      
      return counts;
    } catch (error) {
      console.error('Error in getDownloadCounts:', error);
      return {};
    }
  }

  /**
   * Batch check if multiple capabilities are downloaded
   */
  static async areCapabilitiesDownloaded(capabilityIds: string[]): Promise<Record<string, boolean>> {
    try {
      // Get current user
      const currentUser = InstantAuthService.getCurrentUser();
      if (!currentUser) {
        return {};
      }

      const { data, error } = await supabase
        .from('user_capability_downloads')
        .select('capability_id')
        .eq('user_id', currentUser.id)
        .in('capability_id', capabilityIds);

      if (error) {
        console.error('Error batch checking capability downloads:', error);
        return {};
      }

      const downloadedIds = new Set(data?.map(item => item.capability_id) || []);
      const result: Record<string, boolean> = {};
      
      capabilityIds.forEach(id => {
        result[id] = downloadedIds.has(id);
      });
      
      return result;
    } catch (error) {
      console.error('Error in areCapabilitiesDownloaded:', error);
      return {};
    }
  }
}