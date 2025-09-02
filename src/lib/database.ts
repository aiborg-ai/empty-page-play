/**
 * PostgreSQL Database Connection Utility
 * 
 * This module provides a centralized database connection and query interface
 * for the InnoSpot application using PostgreSQL.
 * 
 * @module lib/database
 * @version 2.0.0
 */

import { Pool, QueryResult, PoolConfig } from 'pg';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Database configuration interface
 */
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

/**
 * Query options interface
 */
interface QueryOptions {
  timeout?: number;
  transaction?: boolean;
  retries?: number;
}

/**
 * Database connection result interface
 */
interface ConnectionResult {
  success: boolean;
  message: string;
  error?: Error;
  connectionInfo?: {
    host: string;
    port: number;
    database: string;
    user: string;
  };
}

// ============================================================================
// DATABASE CLASS
// ============================================================================

/**
 * PostgreSQL Database Connection Manager
 * Provides connection pooling, query execution, and transaction management
 */
class Database {
  private pool: Pool | null = null;
  private config: DatabaseConfig | null = null;
  private isConnected: boolean = false;

  /**
   * Initialize database connection
   * @param config - Database configuration
   * @returns Promise resolving to connection result
   */
  async initialize(config?: DatabaseConfig): Promise<ConnectionResult> {
    try {
      // Use provided config or environment variables
      this.config = config || this.getConfigFromEnv();
      
      // Validate configuration
      if (!this.validateConfig(this.config)) {
        throw new Error('Invalid database configuration');
      }

      // Create connection pool
      const poolConfig: PoolConfig = {
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        ssl: this.config.ssl || false,
        max: this.config.max || 20, // Maximum number of connections
        idleTimeoutMillis: this.config.idleTimeoutMillis || 30000,
        connectionTimeoutMillis: this.config.connectionTimeoutMillis || 2000,
      };

      this.pool = new Pool(poolConfig);

      // Test connection
      const client = await this.pool.connect();
      const result = await client.query('SELECT version(), current_database(), current_user');
      client.release();

      this.isConnected = true;

      console.log('✅ Database connected successfully');
      console.log(`📍 Database: ${this.config.database}`);
      console.log(`🏠 Host: ${this.config.host}:${this.config.port}`);
      console.log(`👤 User: ${this.config.user}`);
      console.log(`🗄️ Version: ${result.rows[0].version.split(',')[0]}`);

      return {
        success: true,
        message: 'Database connected successfully',
        connectionInfo: {
          host: this.config.host,
          port: this.config.port,
          database: this.config.database,
          user: this.config.user
        }
      };

    } catch (error) {
      console.error('❌ Database connection failed:', error);
      this.isConnected = false;
      
      return {
        success: false,
        message: 'Database connection failed',
        error: error as Error
      };
    }
  }

  /**
   * Get database configuration from environment variables
   * @returns Database configuration
   */
  private getConfigFromEnv(): DatabaseConfig {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
      // Parse DATABASE_URL if provided
      const url = new URL(databaseUrl);
      return {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        user: url.username,
        password: url.password,
        ssl: url.searchParams.get('sslmode') === 'require'
      };
    }

    // Fallback to individual environment variables
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'innospot_dev',
      user: process.env.DB_USER || 'innospot_user',
      password: process.env.DB_PASSWORD || 'innospot_password',
      ssl: process.env.DB_SSL === 'true'
    };
  }

  /**
   * Validate database configuration
   * @param config - Configuration to validate
   * @returns Whether configuration is valid
   */
  private validateConfig(config: DatabaseConfig): boolean {
    return !!(
      config.host &&
      config.port &&
      config.database &&
      config.user &&
      config.password
    );
  }

  /**
   * Execute a SQL query
   * @param text - SQL query text
   * @param params - Query parameters
   * @param options - Query options
   * @returns Promise resolving to query result
   */
  async query<T extends Record<string, any> = any>(
    text: string, 
    params: any[] = [], 
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    if (!this.isConnected || !this.pool) {
      throw new Error('Database not connected. Call initialize() first.');
    }

    const { timeout = 10000, retries = 1 } = options;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const client = await this.pool.connect();
        
        try {
          // Set query timeout
          if (timeout) {
            await client.query(`SET statement_timeout = ${timeout}`);
          }
          
          const result = await client.query<T>(text, params);
          return result;
          
        } finally {
          client.release();
        }
        
      } catch (error) {
        lastError = error as Error;
        console.error(`Query attempt ${attempt} failed:`, error);
        
        if (attempt < retries) {
          // Wait before retrying (exponential backoff)
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new Error('Query failed after all retries');
  }

  /**
   * Execute multiple queries in a transaction
   * @param queries - Array of queries to execute
   * @returns Promise resolving to array of results
   */
  async transaction<T extends Record<string, any> = any>(
    queries: Array<{ text: string; params?: any[] }>
  ): Promise<QueryResult<T>[]> {
    if (!this.isConnected || !this.pool) {
      throw new Error('Database not connected. Call initialize() first.');
    }

    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const results: QueryResult<T>[] = [];
      
      for (const query of queries) {
        const result = await client.query<T>(query.text, query.params || []);
        results.push(result);
      }
      
      await client.query('COMMIT');
      return results;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get a single record by ID
   * @param table - Table name
   * @param id - Record ID
   * @param columns - Columns to select (default: *)
   * @returns Promise resolving to record or null
   */
  async findById<T extends Record<string, any> = any>(
    table: string, 
    id: string, 
    columns: string = '*'
  ): Promise<T | null> {
    const result = await this.query<T>(
      `SELECT ${columns} FROM ${table} WHERE id = $1`,
      [id]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Get multiple records with filtering
   * @param table - Table name
   * @param where - WHERE conditions object
   * @param options - Query options (limit, offset, orderBy)
   * @returns Promise resolving to array of records
   */
  async findMany<T extends Record<string, any> = any>(
    table: string,
    where: Record<string, any> = {},
    options: {
      columns?: string;
      limit?: number;
      offset?: number;
      orderBy?: string;
    } = {}
  ): Promise<T[]> {
    const {
      columns = '*',
      limit,
      offset,
      orderBy
    } = options;

    let query = `SELECT ${columns} FROM ${table}`;
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    const whereConditions = Object.entries(where);
    if (whereConditions.length > 0) {
      const conditions = whereConditions.map(([key, value]) => {
        params.push(value);
        return `${key} = $${paramIndex++}`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Add ORDER BY
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    // Add LIMIT and OFFSET
    if (limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(limit);
    }
    
    if (offset) {
      query += ` OFFSET $${paramIndex++}`;
      params.push(offset);
    }

    const result = await this.query<T>(query, params);
    return result.rows;
  }

  /**
   * Insert a new record
   * @param table - Table name
   * @param data - Data to insert
   * @returns Promise resolving to inserted record
   */
  async insert<T extends Record<string, any> = any>(table: string, data: Record<string, any>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.query<T>(query, values);
    return result.rows[0];
  }

  /**
   * Update a record by ID
   * @param table - Table name
   * @param id - Record ID
   * @param data - Data to update
   * @returns Promise resolving to updated record
   */
  async update<T extends Record<string, any> = any>(
    table: string, 
    id: string, 
    data: Record<string, any>
  ): Promise<T | null> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const query = `
      UPDATE ${table}
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;
    
    const result = await this.query<T>(query, [...values, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete a record by ID
   * @param table - Table name
   * @param id - Record ID
   * @returns Promise resolving to deleted record
   */
  async delete<T extends Record<string, any> = any>(table: string, id: string): Promise<T | null> {
    const result = await this.query<T>(
      `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
      [id]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Count records in a table
   * @param table - Table name
   * @param where - WHERE conditions
   * @returns Promise resolving to count
   */
  async count(table: string, where: Record<string, any> = {}): Promise<number> {
    let query = `SELECT COUNT(*) as count FROM ${table}`;
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    const whereConditions = Object.entries(where);
    if (whereConditions.length > 0) {
      const conditions = whereConditions.map(([key, value]) => {
        params.push(value);
        return `${key} = $${paramIndex++}`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const result = await this.query<{ count: string }>(query, params);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Check if database is connected
   * @returns Whether database is connected
   */
  isConnectionHealthy(): boolean {
    return this.isConnected && !!this.pool;
  }

  /**
   * Get connection pool statistics
   * @returns Pool statistics
   */
  getPoolStats() {
    if (!this.pool) {
      return null;
    }

    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }

  /**
   * Close database connection
   * @returns Promise resolving when connection is closed
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      console.log('🔌 Database connection closed');
    }
  }

  /**
   * Utility function to delay execution
   * @param ms - Milliseconds to delay
   * @returns Promise resolving after delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Singleton database instance
 */
export const database = new Database();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Initialize database connection (convenience function)
 * @param config - Optional database configuration
 * @returns Promise resolving to connection result
 */
export async function initializeDatabase(config?: DatabaseConfig): Promise<ConnectionResult> {
  return await database.initialize(config);
}

/**
 * Execute a SQL query (convenience function)
 * @param text - SQL query text
 * @param params - Query parameters
 * @param options - Query options
 * @returns Promise resolving to query result
 */
export async function query<T extends Record<string, any> = any>(
  text: string, 
  params: any[] = [], 
  options: QueryOptions = {}
): Promise<QueryResult<T>> {
  return await database.query<T>(text, params, options);
}

/**
 * Execute a transaction (convenience function)
 * @param queries - Array of queries to execute
 * @returns Promise resolving to array of results
 */
export async function transaction<T extends Record<string, any> = any>(
  queries: Array<{ text: string; params?: any[] }>
): Promise<QueryResult<T>[]> {
  return await database.transaction<T>(queries);
}

/**
 * Check database health (convenience function)
 * @returns Whether database is healthy
 */
export function isDatabaseHealthy(): boolean {
  return database.isConnectionHealthy();
}

/**
 * Close database connection (convenience function)
 * @returns Promise resolving when connection is closed
 */
export async function closeDatabase(): Promise<void> {
  await database.close();
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type { DatabaseConfig, QueryOptions, ConnectionResult };
export { Database };

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default database;