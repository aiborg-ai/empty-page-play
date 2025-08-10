import { useState, useEffect } from 'react';
import { InstantAuthService, InstantUser } from './lib/instantAuth';
import { Search, Filter, Plus, Bot, Wrench, Database, FileText, Eye, X } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard';
import AccountSettings from './components/AccountSettings';
import PlatformTour from './components/PlatformTour';
import PatentSearch from './components/PatentSearch';
import JurisdictionDashboard from './components/JurisdictionDashboard';
import ApplicantsDashboard from './components/ApplicantsDashboard';
import PatentCitationsDashboard from './components/PatentCitationsDashboard';
import LegalStatusDashboard from './components/LegalStatusDashboard';
import OwnersDashboard from './components/OwnersDashboard';
import WorkArea from './components/WorkArea';
import ProjectsSupport from './components/ProjectsSupport';
import Projects from './components/Projects';
import UserDashboards from './components/UserDashboards';
import DashboardsSupport from './components/DashboardsSupport';
import ClaimedWork from './components/ClaimedWork';
import ClaimedWorkSupport from './components/ClaimedWorkSupport';
import AIChat from './components/AIChat';
import AIChatSupport from './components/AIChatSupport';
import Showcase from './components/Showcase';
import CMSAdmin from './components/CMSAdmin';
import CMSStudio from './components/CMSStudio';
import SubscriptionDetails from './components/SubscriptionDetails';
import Checkout from './components/Checkout';
import PaymentSuccess from './components/PaymentSuccess';
import { Product, CartItem } from './types/subscription';
import { ProjectContextService } from './lib/projectContext';
import { Project } from './types/projects';

function App() {
  const [activeSection, setActiveSection] = useState('register');
  const [currentUser, setCurrentUser] = useState<InstantUser | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [showcaseCategory, setShowcaseCategory] = useState<string>('all');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const navigate = (section: string, category?: string) => {
    setActiveSection(section);
    if (category) {
      setShowcaseCategory(category);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const user = InstantAuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setActiveSection('showcase');
    }
    
    // Initialize project context
    const contextService = ProjectContextService.getInstance();
    contextService.initialize();
    
    const unsubscribe = contextService.addProjectChangeListener((project) => {
      setCurrentProject(project);
    });

    return unsubscribe;
  }, []);

  const handleRegistrationSuccess = () => {
    const user = InstantAuthService.getCurrentUser();
    setCurrentUser(user);
    setActiveSection('showcase');
  };

  const handleLoginSuccess = () => {
    const user = InstantAuthService.getCurrentUser();
    setCurrentUser(user);
    setActiveSection('showcase');
  };

  const handleSignOut = () => {
    InstantAuthService.logout();
    setCurrentUser(null);
    setActiveSection('register');
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const handleStartTour = () => {
    setShowTour(true);
  };

  const handleTourClose = () => {
    setShowTour(false);
  };

  const handleTourComplete = () => {
    setShowTour(false);
  };

  const handleToggleAIChat = () => {
    setShowAIChat(!showAIChat);
  };

  const handleCloseAIChat = () => {
    setShowAIChat(false);
  };

  const handleAddToCart = (item: CartItem) => {
    setCartItems([item]); // For simplicity, replace cart with single item
  };

  const handleCheckout = () => {
    setActiveSection('checkout');
  };

  const handlePaymentSuccess = (invoiceId: string) => {
    setInvoiceId(invoiceId);
    setActiveSection('payment-success');
  };

  const handleGoHome = () => {
    setCartItems([]);
    setSelectedProduct(null);
    setActiveSection(currentUser ? 'showcase' : 'register');
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setActiveSection('showcase');
  };

  const handleUnsetProject = () => {
    const contextService = ProjectContextService.getInstance();
    contextService.setCurrentProject(null);
  };

  // Current Project Display Component
  const CurrentProjectBanner = () => {
    if (!currentProject) return null;
    
    return (
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currentProject.color }}
            />
            <div>
              <div className="text-sm font-medium text-blue-900">
                Working on: {currentProject.name}
              </div>
              <div className="text-xs text-blue-700">
                {currentProject.assetCount} assets • {currentProject.collaboratorCount} members
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate('projects')}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
              title="View Project Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleUnsetProject}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
              title="Unset Current Project"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        user={currentUser} 
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
      />
      <div className="flex flex-1">
        <Sidebar 
          activeSection={activeSection} 
          onNavigate={handleNavigate}
          onToggleAIChat={handleToggleAIChat}
        />
        <main className="flex-1 p-6 flex flex-col">
          {activeSection === 'register' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>🏠</span>
                  <span>Register</span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🔒</span>
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-900">Register</h1>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Create a new account or{' '}
                  <button 
                    onClick={() => setActiveSection('login')}
                    className="text-blue-600 hover:underline"
                  >
                    sign in with demo credentials
                  </button>
                </p>
              </div>
              <RegisterForm onSuccess={handleRegistrationSuccess} />
            </div>
          )}

          {activeSection === 'login' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>🏠</span>
                  <span>Sign In</span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🔑</span>
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-900">Sign In</h1>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setActiveSection('register')}
                    className="text-blue-600 hover:underline"
                  >
                    Register here
                  </button>
                </p>
              </div>
              <LoginForm onSuccess={handleLoginSuccess} />
            </div>
          )}

          {activeSection === 'dashboard' && currentUser && (
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>🏠</span>
                  <span>Dashboard</span>
                </div>
              </div>
              <UserDashboard user={currentUser} />
            </div>
          )}

          {activeSection === 'search' && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="flex-1 -m-6">
                <PatentSearch onStartTour={handleStartTour} />
              </div>
            </div>
          )}
          
          {activeSection === 'dashboards' && currentUser && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="flex-1 -m-6">
                <CMSStudio 
                  currentUser={currentUser} 
                  projectId={currentProject?.id}
                />
              </div>
            </div>
          )}
          
          {activeSection === 'jurisdictions' && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="flex-1 -m-6">
                <JurisdictionDashboard />
              </div>
            </div>
          )}
          
          {activeSection === 'applicants' && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="flex-1 -m-6">
                <ApplicantsDashboard />
              </div>
            </div>
          )}
          
          {activeSection === 'citations' && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="flex-1 -m-6">
                <PatentCitationsDashboard />
              </div>
            </div>
          )}
          
          {activeSection === 'legal-status' && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="flex-1 -m-6">
                <LegalStatusDashboard />
              </div>
            </div>
          )}
          
          {activeSection === 'owners' && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="flex-1 -m-6">
                <OwnersDashboard />
              </div>
            </div>
          )}
          
          {activeSection === 'projects' && currentUser && (
            <div className="flex-1 -m-6">
              <Projects onNavigate={handleNavigate} />
            </div>
          )}
          
          {activeSection === 'work-area' && currentUser && (
            <div className="flex-1 -m-6">
              <WorkArea user={currentUser} />
            </div>
          )}
          
          {activeSection === 'projects-support' && (
            <div className="flex-1 -m-6">
              <ProjectsSupport />
            </div>
          )}
          
          {activeSection === 'user-dashboards' && currentUser && (
            <div className="flex-1 -m-6">
              <UserDashboards />
            </div>
          )}
          
          {activeSection === 'dashboards-support' && (
            <div className="flex-1 -m-6">
              <DashboardsSupport />
            </div>
          )}
          
          {activeSection === 'claimed-work' && currentUser && (
            <div className="flex-1 -m-6">
              <ClaimedWork onNavigate={handleNavigate} />
            </div>
          )}
          
          {activeSection === 'claimed-work-support' && (
            <div className="flex-1 -m-6">
              <ClaimedWorkSupport />
            </div>
          )}
          
          {activeSection === 'ai-chat-support' && (
            <div className="flex-1 -m-6">
              <AIChatSupport />
            </div>
          )}
          
          {activeSection === 'account-settings' && currentUser && (
            <AccountSettings user={currentUser} />
          )}
          
          {/* Studio Secondary Navigation Routes */}
          {activeSection === 'ai-agents' && currentUser && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-semibold text-gray-900">AI Agents</h1>
                        <p className="text-sm text-gray-600">Configure and manage AI agents for automated research tasks.</p>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Create Agent
                  </button>
                </div>
              </div>

              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search AI agents..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">Recent</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Shared with me</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">All Agents</button>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No AI agents yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Create AI agents to automate research tasks, analyze data, and generate insights from your patent portfolio.
                  </p>
                  <button 
                    onClick={() => navigate('showcase', 'ai')}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Agent
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'tools' && currentUser && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Tools</h1>
                        <p className="text-sm text-gray-600">Access analysis tools for patent research and data processing.</p>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Add Tool
                  </button>
                </div>
              </div>

              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tools..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">Recent</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Shared with me</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">All Tools</button>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Wrench className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tools configured</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Add and configure analysis tools for patent research, data processing, and insights generation.
                  </p>
                  <button 
                    onClick={() => navigate('showcase', 'analysis')}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Tool
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'datasets' && currentUser && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Database className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Datasets</h1>
                        <p className="text-sm text-gray-600">Manage and analyze your research datasets and data sources.</p>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Import Dataset
                  </button>
                </div>
              </div>

              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search datasets..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">Recent</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Shared with me</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">All Datasets</button>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Database className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Import datasets from your research or create new ones from search results and analyses.
                  </p>
                  <button 
                    onClick={() => navigate('showcase', 'search')}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Dataset
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'reports' && currentUser && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
                        <p className="text-sm text-gray-600">Generate and manage analytical reports and insights.</p>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Create Report
                  </button>
                </div>
              </div>

              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">Recent</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Shared with me</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">All Reports</button>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Create analytical reports from your research data and share insights with your team.
                  </p>
                  <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Create First Report
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Profile Secondary Navigation Routes */}
          {activeSection === 'profile-info' && currentUser && (
            <div className="max-w-6xl mx-auto p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h1>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <p className="text-gray-600">Profile information - coming soon</p>
              </div>
            </div>
          )}
          
          {/* Reports Secondary Navigation Routes */}
          {activeSection === 'all-reports' && currentUser && (
            <div className="max-w-6xl mx-auto p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">All Reports</h1>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <p className="text-gray-600">All reports view - coming soon</p>
              </div>
            </div>
          )}
          
          {/* Network Secondary Navigation Routes */}
          {activeSection === 'connections' && currentUser && (
            <div className="max-w-6xl mx-auto p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Connections</h1>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <p className="text-gray-600">Network connections - coming soon</p>
              </div>
            </div>
          )}
          
          {/* Notifications Secondary Navigation Routes */}
          {activeSection === 'all-notifications' && currentUser && (
            <div className="max-w-6xl mx-auto p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">All Notifications</h1>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <p className="text-gray-600">All notifications - coming soon</p>
              </div>
            </div>
          )}
          
          {activeSection === 'showcase' && !currentUser && (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Welcome to InnoSpot
              </h1>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <p className="text-lg text-gray-600 mb-6">
                  Your innovation intelligence platform for discovering and analyzing cutting-edge research and patents.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveSection('register')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Get Started
                  </button>
                  <button 
                    onClick={() => setActiveSection('login')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'showcase' && currentUser && (
            <div className="flex-1 -m-6">
              <Showcase 
                onNavigate={handleNavigate} 
                initialCategory={showcaseCategory as any}
              />
            </div>
          )}
          
          {activeSection === 'cms-admin' && currentUser && (
            <div className="flex-1 -m-6">
              <CMSAdmin onNavigate={handleNavigate} />
            </div>
          )}
          
          {activeSection === 'subscription-details' && selectedProduct && (
            <div className="flex-1 -m-6">
              <SubscriptionDetails
                product={selectedProduct}
                onBack={handleBackToHome}
                onAddToCart={handleAddToCart}
                onProceedToCheckout={handleCheckout}
              />
            </div>
          )}
          
          {activeSection === 'checkout' && cartItems.length > 0 && (
            <div className="flex-1 -m-6">
              <Checkout
                cartItems={cartItems}
                onBack={() => setActiveSection('subscription-details')}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          )}
          
          {activeSection === 'payment-success' && invoiceId && (
            <div className="flex-1 -m-6">
              <PaymentSuccess
                invoiceId={invoiceId}
                cartItems={cartItems}
                total={cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}
                onGoHome={handleGoHome}
              />
            </div>
          )}
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Platform Tour */}
      <PlatformTour 
        isOpen={showTour}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
      />
      
      {/* AI Chat */}
      <AIChat
        isOpen={showAIChat}
        onClose={handleCloseAIChat}
        onNavigate={handleNavigate}
        userApiKey={localStorage.getItem('openrouter_api_key') || undefined}
      />
    </div>
  );
}

export default App;