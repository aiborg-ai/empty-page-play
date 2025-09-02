# 🚀 InnoSpot Quick Reference Guide

> **Fast access to common tasks and essential information**

---

## 🔑 Demo Login Credentials

| Account Type | Email | Password | Features |
|--------------|-------|----------|----------|
| **General Demo** | demo@innospot.com | demo123 | All features available |
| **Researcher** | researcher@innospot.com | researcher123 | Research-focused tools |
| **Commercial** | commercial@innospot.com | commercial123 | Business tools |

---

## 🧭 Quick Navigation

### **Main Sections**
- **Home** → Landing page and overview
- **Showcase** → Feature demonstrations and tool access
- **Innovation Hub** → 10 innovation management tools
- **Studio** → Content management and workspace
- **Settings** → Account and system configuration

### **Key Features Access**
```
Innovation Manager → Innovation Hub → Select Tool
Analytics → Showcase → Advanced Analytics
Collaboration → Team features throughout app
Enterprise → Settings → Enterprise features
Marketplace → Showcase → Marketplace section
Database Test → Settings → Database Test
```

---

## 🔧 Common Tasks

### **Starting a New Innovation Project**
1. Navigate to **Spaces** or **Innovation Manager Hub**
2. Click **"Create New Project"**
3. Fill in project details (name, description, tech area)
4. Assign team members
5. Start adding pipeline items

### **Running Patent Analysis**
1. Go to **Showcase** → **AI-Powered Tools**
2. Select **Patent Analysis** tool
3. Upload patent document or enter patent number
4. Choose analysis type (prior art, quality, landscape)
5. Review generated insights and recommendations

### **Setting Up Team Collaboration**
1. Access **Team Workspace** from sidebar
2. Create new workspace or join existing
3. Invite team members via email
4. Set up project boards and tasks
5. Configure notification preferences

### **Accessing Enterprise Features**
1. Navigate to **Settings** → **Enterprise Hub**
2. Configure organization structure
3. Set up SSO and audit logging
4. Manage compliance policies
5. Review security settings

---

## 🎯 Feature Quick Access

### **Innovation Management (10 Tools)**
| Tool | Purpose | Quick Access |
|------|---------|--------------|
| Pipeline Tracker | Manage innovation stages | Innovation Hub → Pipeline |
| Competitive Intel | Monitor competitors | Innovation Hub → Intelligence |
| Portfolio Valuation | Assess patent value | Innovation Hub → Valuation |
| Technology Mapping | Visualize tech relationships | Innovation Hub → Mapping |
| Team Collaboration | Coordinate teams | Innovation Hub → Teams |
| Landscape Generator | Create patent landscapes | Innovation Hub → Landscape |
| KPI Dashboard | Track metrics | Innovation Hub → Metrics |
| Technology Scouting | Find emerging tech | Innovation Hub → Scouting |
| Risk Assessment | Analyze risks | Innovation Hub → Risk |
| Budget Optimizer | Optimize resources | Innovation Hub → Budget |

### **Advanced Analytics**
| Feature | Description | Location |
|---------|-------------|----------|
| Predictive Analytics | ML trend forecasting | Showcase → Analytics |
| Innovation Heatmap | Geographic visualization | Showcase → Analytics |
| Technology Radar | Tech maturity tracking | Showcase → Analytics |
| Quality Scorer | Patent strength evaluation | Showcase → Analytics |

### **Collaboration Tools**
| Tool | Function | Access Path |
|------|----------|-------------|
| Team Workspace | Real-time collaboration | Sidebar → Workspace |
| Innovation Forum | Community discussions | Sidebar → Forum |
| Expert Network | Professional networking | Sidebar → Experts |
| Document Review | Multi-user reviews | Any document → Review |

---

## ⚙️ Configuration Quick Setup

### **Environment Variables (.env)**
```env
# Essential configuration
NODE_ENV=development
DATABASE_URL=postgresql://innospot_user:innospot_password@localhost:5432/innospot_dev
VITE_ENABLE_DEMO_AUTH=true

# Optional features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_MARKETPLACE=true
VITE_ENABLE_COLLABORATION=true
```

### **Database Quick Setup**
```bash
# One-command setup
npm run db:setup

# Manual steps if needed
npm run db:migrate  # Create tables
npm run db:seed     # Load sample data  
npm run db:test     # Verify connection
```

### **Development Commands**
```bash
npm install         # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Check code quality
npm run preview     # Preview production build
```

---

## 🎨 UI Navigation Tips

### **Keyboard Shortcuts**
| Action | Shortcut | Description |
|--------|----------|-------------|
| **Search** | `Ctrl/Cmd + K` | Global search |
| **AI Chat** | `Ctrl/Cmd + /` | Toggle AI assistant |
| **Help** | `F1` | Open help documentation |
| **Settings** | `Ctrl/Cmd + ,` | Quick settings access |

### **Sidebar Navigation**
- **Primary Sidebar** → Main feature navigation
- **Secondary Sidebar** → Sub-feature navigation (when applicable)
- **Collapsible** → Click logo to collapse/expand
- **Context-Aware** → Changes based on current section

### **Dashboard Widgets**
- **Drag & Drop** → Rearrange dashboard widgets
- **Resize** → Drag corners to resize widgets
- **Configure** → Click gear icon for widget settings
- **Export** → Download widget data as PDF/Excel

---

## 🔍 Search & Filtering

### **Global Search**
- **Patent Search** → Patent numbers, titles, inventors
- **Technology Search** → Keywords, classifications, companies
- **People Search** → Team members, experts, contacts
- **Document Search** → Full-text search across all documents

### **Advanced Filters**
```
Date Range: Last 30 days, 6 months, 1 year, custom
Technology: AI/ML, Biotech, Electronics, Mechanical, etc.
Status: Draft, Pending, Filed, Granted, Expired
Priority: Low, Medium, High, Critical
Assignee: Specific team members or unassigned
```

---

## 📊 Data Export Options

### **Export Formats**
| Format | Use Case | Available From |
|--------|----------|----------------|
| **PDF** | Reports, presentations | All dashboards |
| **Excel** | Data analysis | Tables, charts |
| **CSV** | Raw data import | Data tables |
| **JSON** | API integration | Technical exports |
| **PowerPoint** | Executive presentations | Analytics reports |

### **Quick Export Steps**
1. Navigate to desired data/chart
2. Click **Export** button (usually top-right)
3. Select format (PDF, Excel, CSV, etc.)
4. Choose options (date range, filters)
5. Download generated file

---

## 🛠 Troubleshooting Quick Fixes

### **Common Issues & Solutions**

| Issue | Quick Fix |
|-------|-----------|
| **Can't log in** | Clear cookies, try incognito mode |
| **Page won't load** | Hard refresh (Ctrl+F5) |
| **Features missing** | Check account permissions |
| **Slow performance** | Close unused tabs, clear cache |
| **Data not updating** | Refresh page, check internet connection |
| **Export failed** | Reduce data range, try different format |

### **Emergency Recovery**
```bash
# If development server stops
pkill -f vite && npm run dev

# If database connection fails  
npm run db:test

# If build fails
npm run lint --fix && npm run build
```

---

## 🚨 Support Quick Contact

### **Immediate Help**
- **In-App Help** → Click `?` icon anywhere
- **AI Assistant** → Press `Ctrl/Cmd + /`
- **Live Chat** → Bottom-right chat widget
- **Documentation** → Top menu → Help

### **Contact Methods**
- 📧 **Email**: support@innospot.ai
- 🎫 **Tickets**: [support.innospot.ai](https://support.innospot.ai)
- 💬 **Community**: [community.innospot.ai](https://community.innospot.ai)
- 📞 **Enterprise**: +1-800-INNOSPOT

---

## 🎯 Power User Tips

### **Efficiency Hacks**
- **Bulk Operations** → Select multiple items with Ctrl+Click
- **Keyboard Navigation** → Use Tab/Shift+Tab to navigate
- **Quick Actions** → Right-click for context menus
- **Bookmark Views** → Save frequently used filters/views
- **Template Usage** → Create templates for common workflows

### **Advanced Features**
- **API Access** → Settings → Integrations → API Keys
- **Webhooks** → Real-time notifications to external systems
- **Custom Fields** → Add organization-specific data fields
- **Workflow Automation** → Set up automated processes
- **Advanced Analytics** → Custom metrics and calculations

---

<div align="center">
  <strong>Keep this guide handy for quick reference!</strong><br>
  <sub>Print-friendly | Bookmark for easy access</sub>
</div>