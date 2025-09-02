#!/usr/bin/env node

/**
 * Database Connection Test Script
 * 
 * This script tests the PostgreSQL database connection and performs
 * basic CRUD operations to verify the setup.
 * 
 * Usage: npm run db:test
 */

const { Client } = require('pg');

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'innospot_dev',
  user: process.env.DB_USER || 'innospot_user',
  password: process.env.DB_PASSWORD || 'innospot_password',
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Log with colors
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Test database connection
 */
async function testConnection() {
  const client = new Client(config);
  
  try {
    log('🔌 Connecting to PostgreSQL...', 'blue');
    await client.connect();
    
    log('✅ Connection successful!', 'green');
    
    // Test basic query
    const result = await client.query('SELECT version(), current_database(), current_user, NOW()');
    const row = result.rows[0];
    
    log('📊 Database Information:', 'cyan');
    log(`  Version: ${row.version.split(',')[0]}`, 'yellow');
    log(`  Database: ${row.current_database}`, 'yellow');
    log(`  User: ${row.current_user}`, 'yellow');
    log(`  Time: ${row.now}`, 'yellow');
    
    return client;
    
  } catch (error) {
    log('❌ Connection failed:', 'red');
    log(`  Error: ${error.message}`, 'red');
    throw error;
  }
}

/**
 * Test table structure
 */
async function testTables(client) {
  log('\n🗄️  Testing table structure...', 'blue');
  
  try {
    // Get list of tables
    const tablesResult = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    log(`✅ Found ${tablesResult.rows.length} tables:`, 'green');
    tablesResult.rows.forEach(row => {
      log(`  • ${row.table_name}`, 'yellow');
    });
    
    // Test specific tables
    const testTables = [
      'user_profiles',
      'spaces', 
      'innovation_pipeline',
      'patents',
      'competitors'
    ];
    
    for (const tableName of testTables) {
      const countResult = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
      log(`  ${tableName}: ${countResult.rows[0].count} rows`, 'cyan');
    }
    
  } catch (error) {
    log('❌ Table test failed:', 'red');
    log(`  Error: ${error.message}`, 'red');
    throw error;
  }
}

/**
 * Test CRUD operations
 */
async function testCRUD(client) {
  log('\n🔧 Testing CRUD operations...', 'blue');
  
  try {
    // Create a test space
    log('Creating test space...', 'yellow');
    const createResult = await client.query(`
      INSERT INTO spaces (name, description, color, owner_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, name, created_at
    `, [
      'Test Space',
      'A test space created by database test script',
      '#3b82f6',
      '00000000-0000-0000-0000-000000000000' // Placeholder UUID
    ]);
    
    const spaceId = createResult.rows[0].id;
    log(`✅ Created space: ${createResult.rows[0].name} (ID: ${spaceId})`, 'green');
    
    // Read the created space
    log('Reading test space...', 'yellow');
    const readResult = await client.query('SELECT * FROM spaces WHERE id = $1', [spaceId]);
    log(`✅ Read space: ${readResult.rows[0].name}`, 'green');
    
    // Update the space
    log('Updating test space...', 'yellow');
    const updateResult = await client.query(`
      UPDATE spaces 
      SET description = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING name, updated_at
    `, [
      'Updated test space description',
      spaceId
    ]);
    log(`✅ Updated space: ${updateResult.rows[0].name}`, 'green');
    
    // Create a test innovation pipeline item
    log('Creating test innovation item...', 'yellow');
    const innovationResult = await client.query(`
      INSERT INTO innovation_pipeline (
        space_id, title, description, stage, priority, progress
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, title
    `, [
      spaceId,
      'Test Innovation',
      'A test innovation item',
      'ideation',
      'medium',
      25
    ]);
    
    const innovationId = innovationResult.rows[0].id;
    log(`✅ Created innovation: ${innovationResult.rows[0].title}`, 'green');
    
    // Test relationships
    log('Testing relationships...', 'yellow');
    const relationResult = await client.query(`
      SELECT s.name as space_name, ip.title as innovation_title, ip.stage, ip.progress
      FROM spaces s
      JOIN innovation_pipeline ip ON s.id = ip.space_id
      WHERE s.id = $1
    `, [spaceId]);
    
    log(`✅ Relationship test passed: ${relationResult.rows.length} items`, 'green');
    relationResult.rows.forEach(row => {
      log(`  • ${row.space_name} → ${row.innovation_title} (${row.stage}, ${row.progress}%)`, 'cyan');
    });
    
    // Clean up test data
    log('Cleaning up test data...', 'yellow');
    await client.query('DELETE FROM innovation_pipeline WHERE id = $1', [innovationId]);
    await client.query('DELETE FROM spaces WHERE id = $1', [spaceId]);
    log('✅ Test data cleaned up', 'green');
    
  } catch (error) {
    log('❌ CRUD test failed:', 'red');
    log(`  Error: ${error.message}`, 'red');
    throw error;
  }
}

/**
 * Test indexes and performance
 */
async function testPerformance(client) {
  log('\n⚡ Testing indexes and performance...', 'blue');
  
  try {
    // Test index usage
    const indexResult = await client.query(`
      SELECT schemaname, tablename, indexname, indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);
    
    log(`✅ Found ${indexResult.rows.length} indexes`, 'green');
    
    // Test full-text search indexes
    const searchTest = await client.query(`
      EXPLAIN (ANALYZE, BUFFERS) 
      SELECT * FROM patents 
      WHERE to_tsvector('english', title) @@ to_tsquery('english', 'test')
      LIMIT 5
    `);
    
    log('✅ Full-text search test completed', 'green');
    
  } catch (error) {
    log('⚠️  Performance test failed (this may be expected for empty database):', 'yellow');
    log(`  Error: ${error.message}`, 'yellow');
  }
}

/**
 * Main test function
 */
async function main() {
  log('🚀 Starting PostgreSQL Database Test Suite', 'blue');
  log('==========================================', 'blue');
  
  let client;
  
  try {
    // Test 1: Connection
    client = await testConnection();
    
    // Test 2: Table Structure
    await testTables(client);
    
    // Test 3: CRUD Operations
    await testCRUD(client);
    
    // Test 4: Performance
    await testPerformance(client);
    
    log('\n🎉 All tests passed successfully!', 'green');
    log('==========================================', 'green');
    log('✅ Database is ready for development', 'green');
    
  } catch (error) {
    log('\n💥 Test suite failed!', 'red');
    log('==========================================', 'red');
    log('❌ Please check the error messages above', 'red');
    process.exit(1);
    
  } finally {
    if (client) {
      await client.end();
      log('\n🔌 Database connection closed', 'cyan');
    }
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n🛑 Test interrupted by user', 'yellow');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  log('❌ Unhandled Rejection at:', 'red');
  console.log(promise);
  log('Reason:', 'red');
  console.log(reason);
  process.exit(1);
});

// Run the tests
main();