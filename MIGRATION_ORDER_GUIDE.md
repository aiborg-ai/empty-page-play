# 🔄 Safe Migration Order Guide

## ❌ **Current Error:**
```
ERROR: 42P01: relation "public.capability_providers" does not exist
```

**Cause**: You're trying to run seed data before creating the required tables.

## ✅ **CORRECT MIGRATION ORDER:**

### **Phase 1: Core CMS Tables (Optional)**
If you want the **full CMS system** with projects, organizations, etc.:

```sql
-- 1. First run the safe core CMS schema
-- File: 001_initial_cms_schema_safe.sql
```

### **Phase 2: Dashboard System (Required)**
For the **dashboard system** we built:

```sql  
-- 2. Run the ultra-safe dashboard migration
-- File: 008_ultra_safe_dashboard.sql
```

### **Phase 3: Showcase System (Optional)**
If you want the **showcase marketplace** features:

```sql
-- 3. Run showcase tables migration
-- File: 003_showcase_tables.sql
```

### **Phase 4: Seed Data (Optional)**  
Only AFTER running the corresponding migrations:

```sql
-- 4a. Dashboard sample data (after Phase 2)
-- File: supabase/seed_data/002_sample_dashboards.sql

-- 4b. Showcase sample data (after Phase 3)  
-- File: supabase/seed_data/001_showcase_seed_data.sql
```

## 🎯 **RECOMMENDED APPROACH FOR YOUR USE CASE:**

Since you want to test the **dashboard system**, here's the minimal setup:

### **Step 1: Dashboard System Only**
```sql
-- Run this in Supabase SQL Editor:
-- File: 008_ultra_safe_dashboard.sql
```

### **Step 2: Add Sample Dashboards (Optional)**
```sql
-- After Step 1, optionally run:
-- File: supabase/seed_data/002_sample_dashboards.sql
```

**Skip the showcase seed data for now** - you don't need it for dashboard testing.

## 🛠️ **Quick Fix for Current Error:**

### **Option A: Skip Showcase Seed Data**
Simply **don't run** `001_showcase_seed_data.sql` for now. You can test dashboards without it.

### **Option B: Add Showcase Tables First**
If you want showcase data:

1. **First run**: `003_showcase_tables.sql`
2. **Then run**: `001_showcase_seed_data.sql`

## 📋 **Migration Checklist:**

### **For Dashboard System Testing:**
- [ ] ✅ `008_ultra_safe_dashboard.sql` (Required)
- [ ] ✅ `002_sample_dashboards.sql` (Optional - sample data)
- [ ] ❌ Skip showcase files for now

### **For Full CMS System:**
- [ ] ✅ `001_initial_cms_schema_safe.sql` (Core tables)
- [ ] ✅ `008_ultra_safe_dashboard.sql` (Dashboards) 
- [ ] ✅ `003_showcase_tables.sql` (Showcase tables)
- [ ] ✅ `001_showcase_seed_data.sql` (Showcase sample data)
- [ ] ✅ `002_sample_dashboards.sql` (Dashboard sample data)

## 🎯 **What Each Migration Does:**

| File | Purpose | Required For |
|------|---------|-------------|
| `001_initial_cms_schema_safe.sql` | Core CMS tables (users, projects, organizations) | Full CMS system |
| `008_ultra_safe_dashboard.sql` | Dashboard system | Dashboard testing |
| `003_showcase_tables.sql` | Showcase marketplace tables | Showcase features |
| `002_sample_dashboards.sql` | Sample dashboard data | Dashboard testing |
| `001_showcase_seed_data.sql` | Sample showcase data | Showcase testing |

## 🚀 **Quick Start for Dashboard Testing:**

1. **Run ONLY**: `008_ultra_safe_dashboard.sql`
2. **Test dashboard system** via Sidebar → Studio → Dashboard
3. **Optionally add sample data**: `002_sample_dashboards.sql`
4. **Skip showcase files** for now

## 🔍 **Verify What Tables You Have:**

Check what tables exist in your database:

```sql
-- Run this in Supabase SQL Editor:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected for dashboard system**:
- `dashboards`
- `dashboard_collaborators` 
- `dashboard_comments`

## ❓ **Need Help Deciding?**

**Just want to test dashboards?** → Run `008_ultra_safe_dashboard.sql` only

**Want full showcase marketplace?** → Run migrations in order: `003_showcase_tables.sql` first, then seed data

**Want everything?** → Follow the "Full CMS System" checklist above

**Your dashboard system will work perfectly with just the ultra-safe dashboard migration! 🎉**