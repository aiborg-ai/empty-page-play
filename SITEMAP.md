# InnoSpot Application - Site Map

## Overview
InnoSpot is a comprehensive innovation intelligence platform for patent analysis, research collaboration, and professional networking in the innovation ecosystem.

---

## 🏠 Main Application Structure

### Authentication & Onboarding
- **/** - Landing/Home Page
- **/register** - User Registration
  - Trial Account Setup
  - Non-Commercial Account Setup  
  - Commercial Account Setup
- **/login** - User Authentication
- **/forgot-password** - Password Recovery

---

## 📊 Core Platform Areas

### 1. Main Navigation Structure
*Two-level navigation system with main menu and context-specific secondary menus*

#### 🏠 Home (`/showcase`)
- **Platform Showcase**: Capability discovery and marketplace
- **Capability Categories**: 
  - AI & Machine Learning
  - Analysis Tools  
  - Data Visualization
  - Search & Discovery
  - Automation
  - Collaboration
- **Try Once / Sample Me**: Interactive capability testing
- **AI-Powered Summaries**: Capability insights and recommendations

#### 🏢 Studio (`/studio`) - *Previously Work Area*
*Central hub for project management and asset creation*

##### 📁 Projects (`/projects`)
- **Categorized Project View**:
  - **Recent Projects**: Updated in last 30 days or owned by user
  - **Shared with You**: Collaborative projects where user is contributor  
  - **Other Projects**: Archived and older projects
- **Project Cards**: Netflix-style scrollable interface with:
  - Project color coding and access level indicators
  - Asset count and collaborator information
  - AI Summary generation
  - Quick actions (View, Set Current, Share)
- **Project Management**:
  - **Studio Mode**: Goal-oriented project workspace
  - **Asset Management**: Cross-project resource sharing
  - **Collaboration**: Multi-user project management with roles
  - **Activity Tracking**: Project logs and team activity monitoring
- **Support**: `/projects-support`


##### 🤖 AI Agents (`/ai-agents`)
- AI-powered research assistants
- Custom agent configuration
- Automated analysis workflows

##### 🛠️ Tools (`/tools`)
- Research and analysis tools
- Integration management
- Custom tool configuration

##### 📊 Datasets (`/datasets`)  
- Data collection management
- Import/export capabilities
- Data quality and validation

##### 📋 Reports (`/studio-reports`)
- **Netflix-Style Carousel Interface**:
  - ⭐ Your Favorites
  - 📊 Your Reports  
  - 🤝 Shared with You
  - 🎯 Recommended for You
  - 💰 Premium Reports Marketplace
- Report creation and sharing
- Multi-platform distribution

#### 🤖 AI Assistant (`/ai-assistant`)
- **Interactive AI Chat**: Real-time assistance and insights
- **Context-Aware Support**: Project and task-specific guidance
- **OpenRouter API Integration**: Advanced AI capabilities
- **Multi-Modal Interface**: Chat, voice, and visual interactions

#### 📊 Reports (`/reports`)
- **Report Categories**:
  - **All Reports**: Comprehensive report library
  - **My Reports**: User-created reports
  - **Shared Reports**: Collaborative research
  - **Templates**: Pre-built report structures
- **Report Marketplace**: Premium professional intelligence
- **AI-Enhanced Reporting**: Automated insights and summaries

#### 🌐 Network (`/network`)
- **Network Categories**:
  - **Connections**: Professional contacts and relationships
  - **Discover**: Find new collaborators and experts
  - **Invitations**: Connection requests and networking
  - **Privacy**: Network visibility and access controls
- **InnoSpot Connect System**: Professional networking platform
- **Connection Management**: Contact organization and collaboration history

#### 🔔 Notifications (`/notifications`)
- **Notification Categories**:
  - **All Notifications**: Complete notification center
  - **Alerts**: Critical updates and warnings
  - **Updates**: System and content changes
  - **Preferences**: Notification settings and controls
- **Real-Time Updates**: Project activities and system notifications
- **Multi-Channel Delivery**: Email, in-app, and push notifications

#### 👤 Profile (`/profile`)
- **Professional Profile Management**:
  - **Claimed Work**: Patent inventorship and authorship claims
  - **Inventorship**: Patent invention claims and verification
  - **Authorship**: Scholarly publication claims and ORCID integration
  - **Profile Info**: Professional details and credentials
- **Achievement Tracking**: Innovation portfolio and recognition
- **Public Profile**: Professional visibility and networking

#### ⚙️ Settings (`/settings`)
- **Settings Categories**:
  - **Account Settings**: User preferences and profile management
  - **AI Settings**: AI assistant configuration and preferences  
  - **Notifications**: Communication preferences and controls
  - **Data & Privacy**: Security settings and data management
- **Integration Management**: External service connections
- **Subscription Management**: Plan and billing information

---

## 🔍 Search & Discovery

### Global Search
- **Patent Search**: Advanced patent discovery with AI insights
- **Scholar Search**: Academic publication search and analysis
- **Cross-platform Integration**: Unified search experience
- **Intelligent Filtering**: Context-aware search refinement

### Search Features
- **Saved Queries**: Persistent search storage with project association
- **Query Alerts**: Automated result notifications
- **Advanced Filters**: Comprehensive search refinement
- **Export Options**: Multiple format support and sharing

---

## 🤝 Collaboration Features

### Project-Based Collaboration
- **Studio Mode**: Goal-oriented project workspaces
- **Asset Sharing**: Cross-project resource management
- **Team Management**: Role-based access control
- **Activity Tracking**: Real-time collaboration monitoring

### Sharing System
- **Multi-Platform Integration**:
  - Email sharing with professional templates
  - WhatsApp integration for instant collaboration
  - LinkedIn sharing for professional networking
  - Direct link copying with access controls
- **Asset Types**: Projects, Reports, Dashboards, Assets, Network Contacts

### Professional Network
- **InnoSpot Connect**: Professional connection system
- **Network Discovery**: Find collaborators and experts
- **Connection Management**: Request workflow and relationship tracking
- **Professional Profiles**: Innovation portfolios and credentials

---

## 🤖 AI-Powered Features

### Universal AI Integration
- **AI Summary Generation**: Available across all content types
- **Context-Aware Assistance**: Project and task-specific guidance
- **OpenRouter API**: Advanced AI service integration
- **Intelligent Recommendations**: Personalized content and connection suggestions

### AI-Enhanced Capabilities
- **Try Once**: Interactive capability testing with sample results
- **Sample Me**: Generate representative datasets and reports
- **Smart Categorization**: Automatic content organization
- **Predictive Analytics**: Trend identification and opportunity mapping

### Asset Types with AI Summary
- **Projects**: Purpose, scope, and progress summaries
- **Reports**: Key insights and findings extraction
- **Network Contacts**: Professional background and expertise analysis
- **Datasets**: Content structure and data quality assessment
- **Dashboards**: Analysis interpretation and trend identification

---

## 📱 User Interface Structure

### Navigation Hierarchy
```
InnoSpot Platform
├── Authentication
│   ├── Registration (Trial/Non-Commercial/Commercial)
│   ├── Login
│   └── Password Recovery
├── Home/Showcase
│   ├── Capability Marketplace
│   ├── Interactive Testing ("Try Once" / "Sample Me")
│   └── AI-Powered Recommendations
├── Studio (Project Management Hub)
│   ├── Projects (Recent/Shared/Other - Card View)
│   ├── AI Agents
│   ├── Tools
│   ├── Datasets
│   └── Reports
├── AI Assistant
│   ├── Interactive Chat Interface
│   ├── Context-Aware Support
│   └── Multi-Modal Interactions
├── Reports
│   ├── All Reports
│   ├── My Reports  
│   ├── Shared Reports
│   └── Templates
├── Network
│   ├── Connections
│   ├── Discover
│   ├── Invitations
│   └── Privacy
├── Notifications
│   ├── All Notifications
│   ├── Alerts
│   ├── Updates
│   └── Preferences
├── Profile
│   ├── Claimed Work
│   ├── Inventorship
│   ├── Authorship
│   └── Profile Info
└── Settings
    ├── Account Settings
    ├── AI Settings
    ├── Notifications
    └── Data & Privacy
```

### Modal Components
- **Project Creation**: Multi-step project setup with collaboration settings
- **Asset Management**: Cross-project resource sharing interface
- **AI Summary**: Real-time content analysis and insights
- **Sharing Modals**: Multi-platform sharing with access controls
- **Connection Requests**: Professional networking and messaging

---

## 🔐 Access Control & Privacy

### User Types
- **Trial Users**: Limited feature access with capability testing
- **Non-Commercial Users**: Full personal research features
- **Commercial Users**: Enterprise features and team collaboration

### Project Access Levels
- **Private**: User-only access with complete control
- **Team**: Invite-specific collaborators with role management
- **Organization**: Organization-wide collaboration
- **Public**: Open discovery and collaboration

### Security Features
- **ORCID Integration**: Academic identity verification
- **Professional Networking**: Verified user connections
- **Data Privacy**: Granular visibility and sharing controls
- **Asset Security**: Project-based access management

---

## 📊 Analytics & Reporting

### Dashboard Types (Project-Based)
- **Patent Analysis**: Filing trends and classification insights
- **Citation Analysis**: Impact and influence tracking
- **Legal Status**: Patent lifecycle monitoring
- **Jurisdictional Analysis**: Geographic filing patterns
- **Applicant Analysis**: Entity and competitor intelligence
- **Inventor Analysis**: Individual contribution assessment

### Report Categories
- **User Reports**: Personal research findings and analysis
- **Collaborative Reports**: Multi-user research projects
- **AI-Generated Reports**: Automated insights and summaries
- **Premium Reports**: Professional market intelligence

---

## 🛒 Premium Features & Marketplace

### Capability Marketplace
- **AI Agents**: Advanced analytical capabilities
- **Professional Tools**: Enterprise-grade research tools
- **Premium Datasets**: Curated data collections
- **Expert Reports**: Professional market intelligence

### Trial and Testing
- **Try Once**: Risk-free capability testing with sample results
- **Sample Me**: Representative data and report generation
- **Free Trials**: Time-limited access to premium capabilities
- **Usage Analytics**: Performance metrics and success tracking

---

## 📧 Communication & Notifications

### Notification System
- **Real-Time Updates**: Project activities and collaboration
- **Smart Alerts**: AI-powered notification prioritization  
- **Multi-Channel Delivery**: Email, in-app, and push notifications
- **Context-Aware Notifications**: Project and task-specific updates

### Communication Channels
- **Professional Messaging**: Direct user communication
- **Email Integration**: Professional correspondence templates
- **Social Media Integration**: LinkedIn and WhatsApp sharing
- **Collaborative Spaces**: Project-based communication hubs

---

## 🔗 External Integrations

### Academic & Professional
- **ORCID**: Academic profile and publication integration
- **LinkedIn**: Professional networking and sharing
- **Patent Databases**: Global patent data access and analysis
- **Scholarly Databases**: Academic publication discovery

### AI and Analytics
- **OpenRouter API**: Advanced AI model integration
- **Custom AI Agents**: Specialized analytical capabilities
- **Data Processing**: Automated analysis and insight generation
- **Predictive Modeling**: Trend analysis and forecasting

---

## 🚀 Recent Updates & New Features

### Navigation Refactor (Current)
- **Two-Level Navigation**: Main menu with context-specific secondary panels
- **Studio Concept**: Centralized project management and research tools
- **Categorized Projects**: Organized by Recent/Shared/Other with card interface
- **Project-Centric Workflow**: All assets and activities organized within projects

### AI Integration Enhancements
- **Universal AI Summaries**: Available across all content types
- **Interactive Capability Testing**: "Try Once" and "Sample Me" functionality
- **Context-Aware Assistance**: Project and task-specific AI guidance
- **Intelligent Recommendations**: Personalized content and connection suggestions

---

This comprehensive site map reflects InnoSpot's evolution into a sophisticated innovation intelligence platform with advanced AI integration, streamlined project management, and enhanced collaboration capabilities. The new Studio-centric approach provides users with a powerful workspace for managing research projects while maintaining access to the platform's extensive networking and discovery features.