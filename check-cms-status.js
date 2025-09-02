#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lkpykvqkobvldrpdktks.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrcHlrdnFrb2J2bGRycGRrdGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTY5ODgsImV4cCI6MjA3MDMzMjk4OH0.44Dj6vX_cnkrsBbjnxSG3lJgR9RK24U3UuT7n1yNKbE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkCMSStatus() {
  console.log('🔍 Checking CMS Deployment Status...\n');
  
  try {
    // Check if categories table exists and has data
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name, slug')
      .limit(3);
    
    if (catError) {
      console.log('❌ CMS not deployed yet');
      console.log(`   Error: ${catError.message}`);
      console.log('\n📋 Ready to deploy! Follow these steps:');
      console.log('1. Open: https://supabase.com/dashboard/project/lkpykvqkobvldrpdktks');
      console.log('2. Go to SQL Editor');
      console.log('3. Follow the steps in DEPLOY_NOW.md');
      return false;
    }

    console.log('✅ CMS Schema Deployed Successfully!');
    console.log(`   Found ${categories?.length || 0} categories:`);
    if (categories) {
      categories.forEach(cat => console.log(`   - ${cat.name} (${cat.slug})`));
    }

    // Check for content
    const { data: contents, error: contentError } = await supabase
      .from('contents')
      .select('title, status')
      .eq('status', 'published')
      .limit(3);

    if (!contentError && contents) {
      console.log(`\n📝 Sample Content Available: ${contents.length} items`);
      contents.forEach(item => console.log(`   - ${item.title}`));
    }

    console.log('\n🎉 Your CMS is ready to use!');
    console.log('\nNext steps:');
    console.log('1. Register a user account through the app');
    console.log('2. Make yourself admin in Supabase:');
    console.log('   UPDATE users SET role = \'admin\' WHERE email = \'your-email\';');
    console.log('3. Access "CMS Admin" from the sidebar');

    return true;
  } catch (error) {
    console.log('❌ Connection or deployment issue:');
    console.log(`   ${error.message}`);
    return false;
  }
}

checkCMSStatus();