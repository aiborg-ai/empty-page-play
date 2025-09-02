# 🔧 InnoSpot Troubleshooting Guide

> **Comprehensive solutions for common issues and technical problems**

[![Support](https://img.shields.io/badge/support-active-green.svg)](mailto:support@innospot.ai)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](#)

---

## 📋 Table of Contents

- [Quick Diagnostics](#-quick-diagnostics)
- [Login & Authentication Issues](#-login--authentication-issues)
- [Performance Problems](#-performance-problems)
- [Feature Access Issues](#-feature-access-issues)
- [Database Connection Problems](#-database-connection-problems)
- [UI/Display Issues](#-uidisplay-issues)
- [Data Import/Export Problems](#-data-importexport-problems)
- [Collaboration Issues](#-collaboration-issues)
- [Enterprise Feature Problems](#-enterprise-feature-problems)
- [Development Environment Issues](#-development-environment-issues)

---

## 🚨 Quick Diagnostics

### **Before You Start Troubleshooting**

Run this quick checklist to identify the issue type:

```bash
# Check if it's a browser issue
✓ Try incognito/private mode
✓ Test in different browser (Chrome, Firefox, Edge)
✓ Clear browser cache and cookies
✓ Disable browser extensions

# Check if it's a network issue  
✓ Test internet connection speed
✓ Try accessing other websites
✓ Check corporate firewall settings
✓ Test on different network (mobile hotspot)

# Check if it's an account issue
✓ Verify login credentials
✓ Check account status/permissions
✓ Try different user account
✓ Contact admin if enterprise user
```

### **System Requirements Check**

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Browser** | Chrome 90+, Firefox 88+ | Chrome 100+, Firefox 95+ |
| **RAM** | 4GB | 8GB+ |
| **Internet** | 5 Mbps | 25 Mbps+ |
| **Screen** | 1024x768 | 1920x1080+ |
| **JavaScript** | Enabled | Enabled |
| **Cookies** | Enabled | Enabled |

---

## 🔐 Login & Authentication Issues

### **Problem: Cannot Login with Demo Credentials**

**Symptoms:**
- "Invalid credentials" error
- Login form keeps reloading
- Stuck on login screen

**Solutions:**

1. **Verify Exact Credentials**
   ```
   Email: demo@innospot.com (not Demo@innospot.com)
   Password: demo123 (case sensitive)
   ```

2. **Clear Browser Data**
   ```bash
   # Chrome: Settings → Privacy → Clear browsing data
   # Firefox: Settings → Privacy → Clear Data
   # Safari: Develop → Empty Caches
   ```

3. **Disable Autofill**
   - Manually type credentials instead of using browser autofill
   - Turn off password manager temporarily

4. **Try Alternative Demo Accounts**
   ```
   researcher@innospot.com / researcher123
   commercial@innospot.com / commercial123
   ```

### **Problem: Session Keeps Expiring**

**Symptoms:**
- Frequent "Session expired" messages
- Automatic logout after short periods
- Need to re-login constantly

**Solutions:**

1. **Check Browser Settings**
   - Enable cookies for the application domain
   - Disable "Block third-party cookies" temporarily
   - Add application to browser exceptions

2. **Clear Conflicting Data**
   - Clear localStorage: F12 → Application → Local Storage → Clear
   - Clear sessionStorage: F12 → Application → Session Storage → Clear
   - Restart browser completely

3. **Enterprise Users**
   - Contact IT department about session timeout policies
   - Check if SSO integration is causing conflicts
   - Verify Active Directory/LDAP settings

### **Problem: SSO Integration Not Working**

**Enterprise Feature Issues:**

1. **SAML Configuration**
   ```xml
   <!-- Verify SAML metadata -->
   <EntityDescriptor>
     <SPSSODescriptor>
       <AssertionConsumerService 
         Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
         Location="https://your-domain.innospot.ai/auth/saml/callback"/>
     </SPSSODescriptor>
   </EntityDescriptor>
   ```

2. **OAuth Configuration**
   ```json
   {
     "client_id": "your-client-id",
     "client_secret": "your-client-secret",
     "redirect_uri": "https://your-domain.innospot.ai/auth/oauth/callback",
     "scope": "openid profile email"
   }
   ```

3. **Common SSO Issues**
   - **Clock Skew**: Ensure server times are synchronized
   - **Certificate Issues**: Verify SSL certificates are valid
   - **Attribute Mapping**: Check user attribute mapping configuration
   - **Group Permissions**: Verify group-to-role mapping

---

## ⚡ Performance Problems

### **Problem: Application Loading Slowly**

**Symptoms:**
- Long loading times (>10 seconds)
- White screen on startup
- Incomplete page rendering

**Solutions:**

1. **Browser Optimization**
   ```bash
   # Clear browser cache
   Ctrl+Shift+Delete (Windows/Linux)
   Cmd+Shift+Delete (Mac)
   
   # Close unnecessary tabs (keep <5 tabs open)
   # Restart browser completely
   # Update browser to latest version
   ```

2. **Network Optimization**
   - Test speed: [speedtest.net](https://speedtest.net) (need 5+ Mbps)
   - Switch to wired connection if using WiFi
   - Try different DNS servers (8.8.8.8, 1.1.1.1)
   - Contact ISP if speeds are consistently low

3. **System Optimization**
   ```bash
   # Close memory-heavy applications
   # Check available RAM (need 2GB+ free)
   # Restart computer if running for days
   # Update graphics drivers
   ```

### **Problem: Specific Features Loading Slowly**

**For Analytics/Dashboard Issues:**

1. **Reduce Data Range**
   - Limit date ranges (use last 30 days instead of all time)
   - Apply filters to reduce dataset size
   - Use summary views instead of detailed views

2. **Browser Settings**
   ```javascript
   // Enable hardware acceleration
   // Chrome: Settings → Advanced → System → Hardware acceleration
   // Firefox: Settings → General → Performance → Hardware acceleration
   ```

3. **Database Performance (Developers)**
   ```sql
   -- Check query performance
   EXPLAIN ANALYZE SELECT * FROM patents WHERE filing_date > '2023-01-01';
   
   -- Verify indexes exist
   SELECT * FROM pg_indexes WHERE tablename = 'patents';
   ```

### **Problem: Memory Usage Issues**

**Symptoms:**
- Browser tab crashes
- "Out of memory" errors
- System becomes unresponsive

**Solutions:**

1. **Immediate Relief**
   ```bash
   # Close other applications
   # Refresh current page (F5)
   # Clear browser cache
   # Restart browser
   ```

2. **Long-term Fixes**
   - Upgrade RAM (minimum 8GB recommended)
   - Use Chrome's Task Manager (Shift+Esc) to identify memory hogs
   - Enable browser's memory saver mode
   - Split work across multiple browser windows

---

## 🚫 Feature Access Issues

### **Problem: Menu Items Missing or Disabled**

**Symptoms:**
- Expected features not visible
- Grayed-out menu items
- "Access denied" messages

**Solutions:**

1. **Check Account Type**
   ```
   Free Account → Limited features
   Professional → Full collaboration features
   Enterprise → All features including SSO, compliance
   ```

2. **Verify User Role**
   ```
   Admin → Full access to all features
   User → Standard feature access
   Researcher → Research-focused tools only
   Commercial → Business-focused tools only
   ```

3. **Project Membership**
   - Ensure you're a member of required projects
   - Contact project admin to add you
   - Check if project has specific access restrictions

### **Problem: AI Features Not Working**

**For AI-Powered Tools:**

1. **Check Feature Flags**
   ```env
   # Verify in .env file
   VITE_ENABLE_AI_TOOLS=true
   VITE_ENABLE_ANALYTICS=true
   ```

2. **API Key Configuration**
   - Verify OpenRouter API key in Settings
   - Check API key has sufficient credits
   - Test with different AI model

3. **Network Restrictions**
   - Corporate firewalls may block AI services
   - Whitelist required domains:
     ```
     api.openrouter.ai
     api.openai.com
     api.anthropic.com
     ```

### **Problem: Database Test Panel Not Available**

**For Database Features:**

1. **Enable Feature Flag**
   ```env
   VITE_ENABLE_DATABASE_TEST=true
   ```

2. **Check Database Connection**
   ```bash
   npm run db:test
   ```

3. **Verify PostgreSQL Installation**
   ```bash
   # Check if PostgreSQL is running
   pg_isready -h localhost -p 5432
   
   # Test manual connection
   psql -h localhost -U innospot_user -d innospot_dev
   ```

---

## 🗄 Database Connection Problems

### **Problem: Database Connection Failed**

**Symptoms:**
- "Database not connected" errors
- Empty dashboards/data
- 500 internal server errors

**Solutions:**

1. **Check Connection Parameters**
   ```env
   # Verify .env configuration
   DATABASE_URL=postgresql://innospot_user:innospot_password@localhost:5432/innospot_dev
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=innospot_dev
   DB_USER=innospot_user
   DB_PASSWORD=innospot_password
   ```

2. **Test PostgreSQL Service**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   
   # Start if stopped
   sudo systemctl start postgresql
   
   # Test connection
   pg_isready -h localhost -p 5432
   ```

3. **Database Setup Issues**
   ```bash
   # Run complete setup
   npm run db:setup
   
   # Or manual steps
   sudo -u postgres createuser innospot_user --createdb
   sudo -u postgres createdb innospot_dev --owner=innospot_user
   npm run db:migrate
   npm run db:seed
   ```

### **Problem: Database Queries Timing Out**

**For Performance Issues:**

1. **Check Query Performance**
   ```sql
   -- Enable query logging
   ALTER SYSTEM SET log_statement = 'all';
   SELECT pg_reload_conf();
   
   -- Monitor slow queries
   SELECT query, mean_exec_time, calls 
   FROM pg_stat_statements 
   ORDER BY mean_exec_time DESC 
   LIMIT 10;
   ```

2. **Index Optimization**
   ```sql
   -- Check missing indexes
   SELECT schemaname, tablename, attname, n_distinct, correlation 
   FROM pg_stats 
   WHERE schemaname = 'public' 
   AND n_distinct > 100;
   
   -- Add indexes for slow queries
   CREATE INDEX CONCURRENTLY idx_patents_filing_date ON patents(filing_date);
   ```

3. **Connection Pool Issues**
   ```typescript
   // Verify pool configuration in database.ts
   const poolConfig = {
     max: 20,  // Maximum connections
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000
   };
   ```

---

## 🎨 UI/Display Issues

### **Problem: Layout Broken or Misaligned**

**Symptoms:**
- Overlapping elements
- Text cut off
- Buttons not clickable
- Responsive layout issues

**Solutions:**

1. **Browser Zoom Issues**
   ```bash
   # Reset browser zoom to 100%
   Ctrl+0 (Windows/Linux)
   Cmd+0 (Mac)
   
   # Check if zoom is causing layout issues
   # Test at different zoom levels (75%, 100%, 125%)
   ```

2. **CSS/Styling Problems**
   ```bash
   # Hard refresh to reload CSS
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   
   # Clear browser cache completely
   # Disable browser extensions temporarily
   ```

3. **Screen Resolution Issues**
   - Minimum supported: 1024x768
   - Recommended: 1920x1080 or higher
   - Test on different screen sizes
   - Use browser developer tools to simulate mobile

### **Problem: Icons or Images Not Loading**

**Symptoms:**
- Missing icons (showing boxes or X)
- Broken image placeholders
- Empty dashboard widgets

**Solutions:**

1. **Network/CDN Issues**
   ```bash
   # Check browser console for 404 errors
   F12 → Console → Look for failed requests
   
   # Test CDN connectivity
   ping cdn.lucide.dev
   ```

2. **Browser Settings**
   - Ensure images are not blocked in browser settings
   - Disable ad blockers temporarily
   - Check if content blockers are interfering

3. **Cache Issues**
   ```bash
   # Force reload images
   Ctrl+F5 (Windows/Linux)
   Cmd+Shift+R (Mac)
   
   # Clear image cache specifically
   Browser Settings → Privacy → Images → Clear
   ```

### **Problem: Dark Mode or Theme Issues**

**Note: Dark mode is a planned feature for future releases**

**Current Workarounds:**
1. Use browser extensions for dark mode
2. Adjust display settings at OS level
3. Use browser's force dark mode (Chrome: `chrome://flags/#enable-force-dark`)

---

## 📁 Data Import/Export Problems

### **Problem: CSV Import Failing**

**Symptoms:**
- "Invalid file format" errors
- Import process stuck
- Partial data import

**Solutions:**

1. **File Format Validation**
   ```csv
   # Ensure proper CSV format
   "Patent Number","Title","Filing Date","Status"
   "US10123456","Example Patent","2023-01-15","Granted"
   "US10123457","Another Patent","2023-02-20","Pending"
   ```

2. **Character Encoding**
   ```bash
   # Save file as UTF-8 encoding
   # Remove special characters that might cause issues
   # Check for hidden characters or BOM markers
   ```

3. **File Size Limits**
   - Maximum file size: 50MB
   - For larger files, split into smaller chunks
   - Use database direct import for very large datasets

### **Problem: Export Downloads Failing**

**Symptoms:**
- Download never starts
- Partial file downloads
- Corrupted exported files

**Solutions:**

1. **Browser Download Settings**
   ```bash
   # Check default download location has space
   # Disable "Ask where to save" temporarily
   # Clear download history
   ```

2. **Reduce Export Size**
   - Apply date filters to reduce data
   - Export in smaller chunks
   - Use simpler formats (CSV instead of Excel)

3. **Alternative Export Methods**
   ```bash
   # Try different browsers
   # Use right-click → "Save link as"
   # Copy data and paste into text editor
   ```

---

## 🤝 Collaboration Issues

### **Problem: Real-time Features Not Working**

**Symptoms:**
- Changes not appearing for other users
- Chat messages not sending
- Document annotations missing

**Solutions:**

1. **WebSocket Connection**
   ```bash
   # Check browser console for WebSocket errors
   F12 → Console → Look for "WebSocket connection failed"
   
   # Corporate firewalls may block WebSocket
   # Test on different network
   ```

2. **Browser Compatibility**
   - Ensure all team members use supported browsers
   - Update browsers to latest versions
   - Test with Chrome (best WebSocket support)

3. **Network Configuration**
   ```bash
   # Whitelist required ports
   Port 80, 443 (HTTP/HTTPS)
   Port 3000-3010 (WebSocket)
   
   # Allow domains
   *.innospot.ai
   *.supabase.co
   ```

### **Problem: Team Members Can't Access Projects**

**Symptoms:**
- "Access denied" when opening projects
- Missing team members in project
- Invitation emails not received

**Solutions:**

1. **Permission Management**
   ```
   Project Admin → Settings → Team → Permissions
   
   Roles:
   - Owner: Full control
   - Admin: Manage team and settings  
   - Member: Edit content
   - Viewer: Read-only access
   ```

2. **Email Issues**
   - Check spam/junk folders
   - Verify email addresses are correct
   - Use alternative invitation methods
   - Contact IT about email filtering

3. **Organization Restrictions**
   - Enterprise accounts may have domain restrictions
   - Contact organization admin
   - Verify user is in correct organization

---

## 🏢 Enterprise Feature Problems

### **Problem: SSO Configuration Errors**

**Enterprise customers experiencing SSO issues:**

1. **SAML Metadata Issues**
   ```xml
   <!-- Common SAML problems -->
   
   <!-- Incorrect Assertion Consumer Service URL -->
   <AssertionConsumerService 
     Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
     Location="https://your-domain.innospot.ai/auth/saml/callback"/>
   
   <!-- Missing required attributes -->
   <saml:Attribute Name="email">
   <saml:Attribute Name="firstName">
   <saml:Attribute Name="lastName">
   ```

2. **Certificate Problems**
   ```bash
   # Verify certificate validity
   openssl x509 -in certificate.crt -text -noout
   
   # Check expiration date
   openssl x509 -in certificate.crt -noout -dates
   ```

3. **Attribute Mapping**
   ```json
   {
     "emailAttribute": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
     "firstNameAttribute": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
     "lastNameAttribute": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
   }
   ```

### **Problem: Audit Logs Not Recording**

**For compliance and security tracking:**

1. **Check Audit Configuration**
   ```sql
   -- Verify audit triggers exist
   SELECT trigger_name, event_object_table 
   FROM information_schema.triggers 
   WHERE trigger_name LIKE 'audit_%';
   ```

2. **Database Permissions**
   ```sql
   -- Ensure audit user has necessary permissions
   GRANT INSERT ON audit_logs TO audit_user;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO audit_user;
   ```

3. **Storage Issues**
   - Check database disk space
   - Verify audit log retention policies
   - Archive old audit logs if needed

---

## 💻 Development Environment Issues

### **Problem: npm install Fails**

**For developers setting up the project:**

**Symptoms:**
- Package installation errors
- Missing dependencies
- Version conflicts

**Solutions:**

1. **Clear npm Cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

2. **Node Version Issues**
   ```bash
   # Check Node version (need 18+)
   node --version
   
   # Use nvm to manage versions
   nvm install 18
   nvm use 18
   ```

3. **Permission Issues**
   ```bash
   # Fix npm permissions (Linux/Mac)
   sudo chown -R $(whoami) ~/.npm
   
   # Or use yarn instead
   yarn install
   ```

### **Problem: Development Server Won't Start**

**Symptoms:**
- `npm run dev` fails
- Port already in use errors
- Build errors

**Solutions:**

1. **Port Conflicts**
   ```bash
   # Check what's using port 8080
   lsof -i :8080
   
   # Kill process using port
   kill -9 <PID>
   
   # Or use different port
   npm run dev -- --port 3000
   ```

2. **Environment Variables**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env with your settings
   nano .env
   ```

3. **TypeScript Errors**
   ```bash
   # Fix linting issues
   npm run lint --fix
   
   # Skip TypeScript checks temporarily
   npm run dev -- --skipTS
   ```

### **Problem: Database Setup Fails**

**For local development database:**

1. **PostgreSQL Installation**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Windows
   # Download from postgresql.org
   ```

2. **Permission Issues**
   ```bash
   # Fix PostgreSQL permissions
   sudo -u postgres createuser $USER --createdb
   
   # Set password
   sudo -u postgres psql -c "ALTER USER $USER PASSWORD 'password';"
   ```

3. **Connection Issues**
   ```bash
   # Test PostgreSQL connection
   pg_isready -h localhost -p 5432
   
   # Manual connection test
   psql -h localhost -U postgres -d postgres
   ```

---

## 🆘 When All Else Fails

### **Escalation Steps**

1. **Community Support**
   - Check [community.innospot.ai](https://community.innospot.ai) for similar issues
   - Post detailed question with screenshots
   - Include browser, OS, and account type information

2. **Professional Support**
   ```
   📧 Email: support@innospot.ai
   🎫 Support Portal: support.innospot.ai
   💬 Live Chat: Available in application
   📞 Phone: +1-800-INNOSPOT (Enterprise only)
   ```

3. **Information to Include**
   - **Browser**: Chrome 120.0.6099.199
   - **OS**: Windows 11 / macOS 13.0 / Ubuntu 22.04
   - **Account**: Demo / Free / Professional / Enterprise
   - **Error Message**: Exact text of error messages
   - **Steps to Reproduce**: Detailed steps that cause the issue
   - **Screenshots**: Visual evidence of the problem
   - **Console Logs**: Browser console errors (F12 → Console)

### **Emergency Contacts**

**For Critical Business Impact:**
- 🚨 **Emergency Email**: emergency@innospot.ai
- ⚡ **Enterprise Hotline**: +1-800-INNOSPOT-1
- 🔥 **Guaranteed Response**: 1 hour for Enterprise customers

---

<div align="center">
  <strong>This guide is regularly updated with new solutions</strong><br>
  <sub>Can't find your issue? Contact support with specific details</sub>
</div>