#!/usr/bin/env node

/**
 * CMS Deployment Script for InnoSpot
 * 
 * This script deploys the CMS schema to Supabase by executing the migration files.
 * Run this script to set up the database schema and initial data.
 * 
 * Usage: node scripts/deploy-cms.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const SUPABASE_URL = 'https://lkpykvqkobvldrpdktks.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service role key needed for schema changes

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY environment variable is required');
  console.log('Please set your Supabase service role key as an environment variable:');
  console.log('export SUPABASE_SERVICE_KEY=your_service_key_here');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function executeMigration(filename) {
  console.log(`\n📝 Executing migration: ${filename}`);
  
  try {
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', filename);
    const sql = readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️  Warning in ${filename}:`, error.message);
        }
      }
    }
    
    console.log(`✅ Migration ${filename} completed`);
  } catch (error) {
    console.error(`❌ Error executing ${filename}:`, error.message);
    throw error;
  }
}

async function deploySchema() {
  console.log('🚀 Starting CMS deployment to Supabase...\n');
  
  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { data, error } = await supabase.from('pg_tables').select('tablename').limit(1);
    if (error) {
      throw new Error(`Connection failed: ${error.message}`);
    }
    console.log('✅ Connection successful');
    
    // Execute migrations in order
    const migrations = [
      '001_initial_cms_schema.sql',
      '002_rls_policies.sql',
      '003_seed_data.sql'
    ];
    
    for (const migration of migrations) {
      await executeMigration(migration);
    }
    
    console.log('\n🎉 CMS deployment completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Database schema created');
    console.log('- Row Level Security (RLS) policies applied');
    console.log('- Initial categories and content types seeded');
    console.log('- Sample showcase items added');
    
    console.log('\n🔧 Next steps:');
    console.log('1. Update your application to use the new CMS service');
    console.log('2. Create your first admin user through the application');
    console.log('3. Start adding content through the CMS interface');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Execute deployment
deploySchema();