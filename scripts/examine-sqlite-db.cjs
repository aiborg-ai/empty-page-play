const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the USPTO test database
const dbPath = path.join(__dirname, '../../dos/examples/uspto_test.db');
console.log(`🔍 Examining SQLite database: ${dbPath}`);
console.log('==========================================');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Get table schema
console.log('\n📋 Database Schema:');
db.all("SELECT name, sql FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.error('Error getting schema:', err.message);
    return;
  }
  
  rows.forEach(row => {
    console.log(`\n🗂️  Table: ${row.name}`);
    console.log(`SQL: ${row.sql}`);
  });

  // Get basic statistics
  console.log('\n📊 Database Statistics:');
  
  db.get("SELECT COUNT(*) as total FROM patents", (err, row) => {
    if (err) {
      console.error('Error getting patent count:', err.message);
      return;
    }
    console.log(`   Total Patents: ${row.total}`);
    
    // Get sample patents
    console.log('\n📄 Sample Patents:');
    db.all("SELECT * FROM patents LIMIT 3", (err, patents) => {
      if (err) {
        console.error('Error getting sample patents:', err.message);
        return;
      }
      
      patents.forEach((patent, index) => {
        console.log(`\n   Patent ${index + 1}:`);
        Object.keys(patent).forEach(key => {
          const value = patent[key];
          if (value && value.toString().length > 100) {
            console.log(`     ${key}: ${value.toString().substring(0, 100)}...`);
          } else {
            console.log(`     ${key}: ${value}`);
          }
        });
      });
      
      // Get unique assignees
      db.all("SELECT DISTINCT assignee FROM patents LIMIT 10", (err, assignees) => {
        if (err) {
          console.error('Error getting assignees:', err.message);
          return;
        }
        
        console.log('\n🏢 Sample Assignees:');
        assignees.forEach((assignee, index) => {
          console.log(`   ${index + 1}. ${assignee.assignee}`);
        });
        
        // Close database
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('\n✅ Database examination complete!');
          }
        });
      });
    });
  });
});