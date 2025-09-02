/**
 * Database Connection Test Module
 * 
 * This module provides testing functionality for the PostgreSQL database
 * connection and basic operations.
 */

import { database, initializeDatabase } from './database';

interface TestResult {
  success: boolean;
  message: string;
  error?: Error;
  details?: any;
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<TestResult> {
  try {
    console.log('🔌 Testing database connection...');
    
    const result = await initializeDatabase();
    
    if (!result.success) {
      return {
        success: false,
        message: 'Database connection failed',
        error: result.error,
        details: result
      };
    }

    console.log('✅ Database connection successful');
    return {
      success: true,
      message: 'Database connection successful',
      details: result.connectionInfo
    };

  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return {
      success: false,
      message: 'Database connection test failed',
      error: error as Error
    };
  }
}

/**
 * Test basic database operations
 */
export async function testDatabaseOperations(): Promise<TestResult> {
  try {
    console.log('🗄️  Testing database operations...');

    // Test table existence
    const tablesResult = await database.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 10
    `);

    console.log(`Found ${tablesResult.rows.length} tables`);

    // Test a simple query on a core table
    const spacesCount = await database.count('spaces');
    const pipelinesCount = await database.count('innovation_pipeline');
    const patentsCount = await database.count('patents');

    console.log('✅ Database operations test passed');
    return {
      success: true,
      message: 'Database operations test passed',
      details: {
        tablesFound: tablesResult.rows.length,
        spacesCount,
        pipelinesCount,
        patentsCount
      }
    };

  } catch (error) {
    console.error('❌ Database operations test failed:', error);
    return {
      success: false,
      message: 'Database operations test failed',
      error: error as Error
    };
  }
}

/**
 * Test CRUD operations with temporary data
 */
export async function testCRUDOperations(): Promise<TestResult> {
  try {
    console.log('🔧 Testing CRUD operations...');

    // Create a test space
    const testSpace = await database.insert('spaces', {
      name: 'Test Space',
      description: 'A test space for database validation',
      color: '#3b82f6',
      owner_id: '00000000-0000-0000-0000-000000000000'
    });

    console.log(`Created test space: ${testSpace.name}`);

    // Read the space
    const retrievedSpace = await database.findById('spaces', testSpace.id);
    if (!retrievedSpace) {
      throw new Error('Failed to retrieve created space');
    }

    // Update the space
    const updatedSpace = await database.update('spaces', testSpace.id, {
      description: 'Updated test space description'
    });

    if (!updatedSpace) {
      throw new Error('Failed to update space');
    }

    // Create related innovation pipeline item
    const testInnovation = await database.insert('innovation_pipeline', {
      space_id: testSpace.id,
      title: 'Test Innovation',
      description: 'A test innovation item',
      stage: 'ideation',
      priority: 'medium',
      progress: 25
    });

    console.log(`Created test innovation: ${testInnovation.title}`);

    // Test relationship query
    const relationshipResult = await database.query(`
      SELECT s.name as space_name, ip.title as innovation_title 
      FROM spaces s
      JOIN innovation_pipeline ip ON s.id = ip.space_id
      WHERE s.id = $1
    `, [testSpace.id]);

    if (relationshipResult.rows.length === 0) {
      throw new Error('Relationship test failed');
    }

    // Clean up test data
    await database.delete('innovation_pipeline', testInnovation.id);
    await database.delete('spaces', testSpace.id);

    console.log('✅ CRUD operations test passed');
    return {
      success: true,
      message: 'CRUD operations test passed',
      details: {
        spaceCreated: testSpace.name,
        innovationCreated: testInnovation.title,
        relationshipTest: relationshipResult.rows.length > 0
      }
    };

  } catch (error) {
    console.error('❌ CRUD operations test failed:', error);
    return {
      success: false,
      message: 'CRUD operations test failed',
      error: error as Error
    };
  }
}

/**
 * Run all database tests
 */
export async function runAllDatabaseTests(): Promise<{
  overall: boolean;
  results: TestResult[];
}> {
  console.log('🚀 Running comprehensive database tests...');
  console.log('==========================================');

  const results: TestResult[] = [];

  try {
    // Test 1: Connection
    const connectionTest = await testDatabaseConnection();
    results.push(connectionTest);

    if (!connectionTest.success) {
      console.log('❌ Connection test failed, skipping other tests');
      return { overall: false, results };
    }

    // Test 2: Basic operations
    const operationsTest = await testDatabaseOperations();
    results.push(operationsTest);

    // Test 3: CRUD operations
    const crudTest = await testCRUDOperations();
    results.push(crudTest);

    const overall = results.every(result => result.success);

    if (overall) {
      console.log('🎉 All database tests passed!');
      console.log('==========================================');
    } else {
      console.log('💥 Some database tests failed!');
      console.log('==========================================');
    }

    return { overall, results };

  } catch (error) {
    console.error('❌ Test suite error:', error);
    results.push({
      success: false,
      message: 'Test suite error',
      error: error as Error
    });
    
    return { overall: false, results };
  } finally {
    // Close database connection
    await database.close();
  }
}

/**
 * Export test utilities for use in components
 */
export const DatabaseTester = {
  testConnection: testDatabaseConnection,
  testOperations: testDatabaseOperations,
  testCRUD: testCRUDOperations,
  runAll: runAllDatabaseTests
};