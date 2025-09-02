# 🚀 InnoSpot Patent Database Setup Guide

This guide will help you connect your InnoSpot application to the real PostgreSQL database from the `../dos` folder.

## 📋 Prerequisites

- Ubuntu/Debian Linux system
- PostgreSQL 16+ installed
- Access to the `/home/vik/dos` folder with patent database schema
- sudo privileges for database setup

## 🔧 Step-by-Step Setup

### Step 1: Set up PostgreSQL Database and User

Run the database setup script:

```bash
cd /home/vik/appinnospot
./setup-database.sh
```

This script will:
- ✅ Check and install PostgreSQL if needed
- ✅ Start PostgreSQL service
- ✅ Create database `local_orchestration_studio`
- ✅ Create user `orchestration` with password `orchestration_password_2024`
- ✅ Set proper permissions
- ✅ Test the connection

**Expected Output:**
```
🚀 Setting up PostgreSQL database for InnoSpot Patent Search
=========================================================
[SUCCESS] PostgreSQL is installed
[INFO] Creating database and user...
[SUCCESS] Database and user created successfully
[SUCCESS] Database connection successful
[SUCCESS] Database setup completed!
```

### Step 2: Create Patent Database Schema

Run the schema setup script:

```bash
./setup-schema.sh
```

This script will:
- ✅ Load the patent database schema from `../dos/database/schema/001_initial_schema.sql`
- ✅ Create all required tables (patents, inventors, assignees, classifications, etc.)
- ✅ Insert sample patent data for testing
- ✅ Set up full-text search indexes
- ✅ Verify all tables are created properly

**Expected Output:**
```
📊 Setting up Patent Database Schema
====================================
[SUCCESS] Schema file found
[INFO] Creating patent database schema...
[SUCCESS] Database schema created successfully
[✓] Table 'patents' exists
[✓] Table 'inventors' exists
[✓] Table 'assignees' exists
[✓] Table 'classifications' exists
[✓] Table 'citations' exists
[SUCCESS] All required tables are present
[SUCCESS] Sample data inserted successfully
```

### Step 3: Restart API Server for Live Database

Stop the current API server and restart it:

```bash
# Stop the API server (Ctrl+C if running in foreground, or find the process)
cd /home/vik/appinnospot/api
npm start
```

**Expected Output:**
```
🚀 Patent API server running on http://localhost:3001
📊 Health check: http://localhost:3001/api/health
✅ Connected to PostgreSQL database
```

### Step 4: Verify Live Database Connection

Test the API endpoints:

```bash
# Test health check
curl http://localhost:3001/api/health

# Expected: {"status":"healthy","database":"connected","timestamp":"..."}

# Test database statistics
curl http://localhost:3001/api/stats

# Test patent search
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "machine learning", "limit": 5}'
```

### Step 5: Test InnoSpot Frontend

1. Open your browser to `http://localhost:8080`
2. Navigate to "Patent Search" in the sidebar
3. Try searching for "machine learning" or "AI"
4. You should see real database statistics and search results

## 🔍 Troubleshooting

### Issue: PostgreSQL connection refused
**Solution:**
```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

### Issue: Permission denied for database
**Solution:**
```bash
# Re-run the database setup script
./setup-database.sh
```

### Issue: Schema creation fails
**Solution:**
```bash
# Check if the DOS schema file exists
ls -la /home/vik/dos/database/schema/001_initial_schema.sql

# If missing, check the DOS folder structure
ls -la /home/vik/dos/
```

### Issue: API still shows "mock_mode"
**Solution:**
```bash
# Restart the API server
cd /home/vik/appinnospot/api
# Kill existing process if needed
pkill -f "node server.js"
# Start fresh
npm start
```

## 📊 Database Information

Once set up, your database will contain:

- **Database Name:** `local_orchestration_studio`
- **Username:** `orchestration`
- **Password:** `orchestration_password_2024`
- **Host:** `localhost`
- **Port:** `5432`

### Sample Data Included

The setup includes sample patent data:
- 3 sample patents (US11234567B2, US11345678B2, US11456789B2)
- 4 sample inventors
- 3 sample assignees
- Classification data (CPC codes)
- Full-text search capabilities

## 🔄 Adding More Patent Data

To add more patent data from the DOS system:

1. Use the DOS patent ingestion tools in `/home/vik/dos`
2. Run the USPTO pipeline to fetch real patent data
3. The InnoSpot API will automatically work with any data added to the database

## ✅ Success Indicators

You'll know everything is working when:

1. **Health check shows:** `"database":"connected"`
2. **Statistics show real numbers** instead of mock data
3. **Search results come from database** with real patent information
4. **Frontend displays** live statistics and search works properly

## 🆘 Getting Help

If you encounter issues:

1. Check the API server logs for connection errors
2. Verify PostgreSQL is running: `sudo systemctl status postgresql`
3. Test direct database connection: `psql -h localhost -U orchestration -d local_orchestration_studio`
4. Check the troubleshooting section above

---

**🎉 Once completed, your InnoSpot application will be connected to a real patent database with full search capabilities!**