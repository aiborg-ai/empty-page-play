# 🚀 InnoSpot Patent Database - Quick Setup Reference

## ⚡ Quick Setup Commands (Run in Order)

```bash
# 1. Go to project directory
cd /home/vik/appinnospot

# 2. Set up database and user
./setup-database.sh

# 3. Create schema and sample data
./setup-schema.sh

# 4. Restart API server
pkill -f "node server.js"
cd api && npm start

# 5. Verify connection
curl http://localhost:3001/api/health
```

## 🔗 Important URLs

- **InnoSpot App:** http://localhost:8080
- **API Server:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health
- **API Stats:** http://localhost:3001/api/stats

## 🔑 Database Credentials

- **Database:** `local_orchestration_studio`
- **User:** `orchestration`  
- **Password:** `orchestration_password_2024`
- **Host:** `localhost`
- **Port:** `5432`

## ✅ Success Indicators

| Check | Expected Result |
|-------|----------------|
| Health API | `"database":"connected"` |
| Frontend Stats | Real numbers (not 165M+) |
| Search Results | Actual patent data |
| API Logs | `✅ Connected to PostgreSQL database` |

## 🚨 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| PostgreSQL not running | `sudo systemctl start postgresql` |
| Permission denied | Re-run `./setup-database.sh` |
| API shows mock_mode | Restart API server |
| Schema file missing | Check `/home/vik/dos/database/schema/` exists |

## 📁 Important Files

- **Setup Scripts:** `./setup-database.sh`, `./setup-schema.sh`
- **API Server:** `./api/server.js`
- **Database Service:** `./src/lib/patentDatabase.ts`
- **Patent Search UI:** `./src/components/PatentSearch.tsx`
- **Full Guide:** `./DATABASE_SETUP_GUIDE.md`

## 🔄 Adding Real Patent Data

After setup, use the DOS system tools:
```bash
cd /home/vik/dos
# Follow DOS documentation to ingest real USPTO patent data
# The InnoSpot API will automatically use any data added to the database
```

---
**📝 For detailed instructions, see `DATABASE_SETUP_GUIDE.md`**