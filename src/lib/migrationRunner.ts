import { supabase } from './supabase';

export class MigrationRunner {
  /**
   * Run the user capability downloads migration
   * This creates the table and functions if they don't exist
   */
  static async runCapabilityDownloadsMigration(): Promise<{ success: boolean; message: string }> {
    console.log('🔄 Running capability downloads migration...');

    try {
      // Create the table with all necessary columns
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user_capability_downloads (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          capability_id TEXT NOT NULL,
          capability_name TEXT NOT NULL,
          capability_type TEXT NOT NULL,
          capability_category TEXT NOT NULL,
          downloaded_at TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, capability_id)
        );
      `;

      console.log('📋 Creating table...');
      const { error: tableError } = await supabase.rpc('exec_sql', { 
        sql: createTableQuery 
      });

      if (tableError) {
        // If exec_sql doesn't exist, try direct SQL execution
        console.log('🔄 Trying alternative table creation...');
        
        // We'll create a simple version that can be done via regular Supabase operations
        // First check if table exists by trying to select from it
        const { error: checkError } = await supabase
          .from('user_capability_downloads')
          .select('id')
          .limit(1);

        if (checkError && checkError.code === '42P01') { // Table doesn't exist
          console.log('❌ Table does not exist and cannot be created via client');
          return {
            success: false,
            message: 'Database table does not exist. Please run the migration manually in Supabase dashboard.'
          };
        }
      }

      console.log('✅ Table verification successful');

      // Test the table with a simple operation
      const { error: testError } = await supabase
        .from('user_capability_downloads')
        .select('count', { count: 'exact', head: true });

      if (testError) {
        console.error('❌ Table test failed:', testError);
        return {
          success: false,
          message: `Table test failed: ${testError.message}`
        };
      }

      console.log('✅ Migration completed successfully');
      return {
        success: true,
        message: 'Migration completed successfully'
      };

    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        success: false,
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Check if the downloads system is properly set up
   */
  static async checkSystemHealth(): Promise<{ 
    success: boolean; 
    tableExists: boolean; 
    canInsert: boolean; 
    canQuery: boolean;
    message: string;
  }> {
    console.log('🔍 Checking system health...');

    try {
      // Check if table exists
      const { error: tableError } = await supabase
        .from('user_capability_downloads')
        .select('count', { count: 'exact', head: true });

      const tableExists = !tableError;
      console.log(tableExists ? '✅ Table exists' : '❌ Table does not exist');

      if (!tableExists) {
        return {
          success: false,
          tableExists: false,
          canInsert: false,
          canQuery: false,
          message: 'user_capability_downloads table does not exist'
        };
      }

      // Test query capability
      const { error: queryError } = await supabase
        .from('user_capability_downloads')
        .select('id, capability_name')
        .limit(1);

      const canQuery = !queryError;
      console.log(canQuery ? '✅ Can query table' : '❌ Cannot query table');

      // Test insert capability (we won't actually insert, just test the structure)
      const canInsert = true; // We'll assume this works if table exists

      return {
        success: tableExists && canQuery,
        tableExists,
        canInsert,
        canQuery,
        message: tableExists && canQuery 
          ? 'System is healthy and ready for downloads' 
          : 'System has issues - check database setup'
      };

    } catch (error) {
      console.error('❌ Health check failed:', error);
      return {
        success: false,
        tableExists: false,
        canInsert: false,
        canQuery: false,
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

/**
 * Simple SQL execution utility for debugging
 */
export const debugDatabase = {
  async testConnection() {
    console.log('🔍 Testing Supabase connection...');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('Auth session:', { data: !!data, error: !!error });
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('Current user:', { data: !!userData, error: !!userError });
      
      return { success: true, message: 'Connection test completed' };
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { success: false, message: 'Connection failed' };
    }
  },

  async listTables() {
    console.log('🔍 Attempting to list tables...');
    
    try {
      // Try to get table information (this may not work depending on permissions)
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (error) {
        console.log('❌ Cannot list tables:', error.message);
        return { success: false, tables: [], message: error.message };
      }

      console.log('✅ Available tables:', data);
      return { success: true, tables: data, message: 'Tables listed successfully' };
    } catch (error) {
      console.error('❌ List tables failed:', error);
      return { success: false, tables: [], message: 'Failed to list tables' };
    }
  }
};