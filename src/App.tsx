/**
 * ============================================================================
 * InnoSpot Patent Intelligence Platform - Main Application
 * ============================================================================
 * 
 * This is the root component that orchestrates the entire InnoSpot application.
 * It manages authentication, routing, global state, and renders the appropriate
 * components based on user navigation.
 * 
 * Key Features:
 * - InstantAuth authentication system for demo users
 * - Dynamic navigation with 30+ sections
 * - Innovation management tools
 * - Advanced analytics and collaboration features
 * - Enterprise-grade functionality
 * - Patent marketplace and monetization
 * 
 * @author InnoSpot Development Team
 * @version 2.0.0
 * @since 2024
 */

import React, { useState, useEffect } from 'react';

// ============================================================================
// AUTHENTICATION & CORE SERVICES
// ============================================================================
import { InstantAuthService, InstantUser } from './lib/instantAuth';
import { isDemoActive, getDemoUser } from './lib/liveDemoService';
import DemoBanner from './components/DemoBanner';

// ============================================================================
// UI COMPONENTS & ICONS
// ============================================================================
import { Search, Filter, Plus, Bot, Wrench, Database, Eye, X } from 'lucide-react';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// ============================================================================
// AUTHENTICATION COMPONENTS
// ============================================================================
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import AccountSettings from './components/AccountSettings';
import PlatformTour from './components/PlatformTour';

// ============================================================================
// CORE DASHBOARD COMPONENTS
// ============================================================================
import Home from './components/Home';
import PatentSearch from './components/PatentSearch';
import PatentAnalyticsDashboard from './components/PatentAnalyticsDashboard';
import WorkArea from './components/WorkArea';
import Spaces from './components/Spaces';

// ============================================================================
// ANALYTICS & VISUALIZATION DASHBOARDS
// ============================================================================
import JurisdictionDashboard from './components/JurisdictionDashboard';
import ApplicantsDashboard from './components/ApplicantsDashboard';
import PatentCitationsDashboard from './components/PatentCitationsDashboard';
import LegalStatusDashboard from './components/LegalStatusDashboard';
import OwnersDashboard from './components/OwnersDashboard';
import UserDashboards from './components/UserDashboards';
import VisualPatentExplorer from './components/VisualPatentExplorer';

// ============================================================================
// CMS & CONTENT MANAGEMENT
// ============================================================================
import ShowcaseModern from './components/ShowcaseModern';
import CMSAdmin from './components/CMSAdmin';
import CMSStudioModern from './components/CMSStudioModern';
import ReportsModern from './components/ReportsModern';

// ============================================================================
// USER MANAGEMENT & COLLABORATION
// ============================================================================
import ClaimedWork from './components/ClaimedWork';
import AIChat from './components/AIChat';

// ============================================================================
// INNOVATION HUB COMPONENTS
// ============================================================================
import InnovationHub from './components/InnovationHub';
import InnovationManagerHub from './components/innovation/InnovationManagerHub';

// ============================================================================
// AI-POWERED TOOLS & ANALYSIS
// ============================================================================
import AIClaimGenerator from './components/AIClaimGenerator';
import CollisionDetection from './components/CollisionDetection';
import Citation3DVisualization from './components/Citation3DVisualization';
import BlockchainProvenance from './components/BlockchainProvenance';

// ============================================================================
// ADVANCED AI INTELLIGENCE FEATURES
// ============================================================================
import OpportunityGapScanner from './components/OpportunityGapScanner';
import AIPatentClaimGenerator from './components/AIPatentClaimGenerator';
import PriorArtOracle from './components/PriorArtOracle';
import InnovationTrajectoryPredictor from './components/InnovationTrajectoryPredictor';
import AIServicesConfig from './components/AIServicesConfig';

// ============================================================================
// COMMUNICATION & NETWORKING
// ============================================================================
import NetworkPage from './components/NetworkPage';
import Messages from './components/Messages';

// ============================================================================
// ENTERPRISE & DECISION SUPPORT
// ============================================================================
import DecisionEngines from './components/DecisionEngines';
import PatentMonitoring from './components/PatentMonitoring';
import PatentValuation from './components/PatentValuation';
import CompetitiveIntelligence from './components/CompetitiveIntelligence';

// ============================================================================
// SYSTEM & SUPPORT COMPONENTS
// ============================================================================
// import DatabaseTestPanel from './components/DatabaseTestPanel'; // Commented out - uses Node.js pg module
import SupportPage from './components/SupportPage';

// ============================================================================
// SUPPORT COMPONENTS (Legacy)
// ============================================================================
import ProjectsSupport from './components/ProjectsSupport';
import DashboardsSupport from './components/DashboardsSupport';
import ClaimedWorkSupport from './components/ClaimedWorkSupport';
import AIChatSupport from './components/AIChatSupport';

// ============================================================================
// E-COMMERCE & SUBSCRIPTION
// ============================================================================
import SubscriptionDetails from './components/SubscriptionDetails';
import Checkout from './components/Checkout';
import PaymentSuccess from './components/PaymentSuccess';

// Revolutionary Innovation Intelligence Components
import PatentDNASequencer from './components/PatentDNASequencer';
import InnovationPulseMonitor from './components/InnovationPulseMonitor';
import WhiteSpaceCartographer from './components/WhiteSpaceCartographer';
import InventionCollisionPredictor from './components/InventionCollisionPredictor';

// Integration Features
import IntegrationsHub from './integrations/IntegrationsHub';

// Automation Features
import AutomationHub from './automation/AutomationHub';

// ============================================================================
// TYPE DEFINITIONS & SERVICES
// ============================================================================
import { Product, CartItem } from './types/subscription';
import { SpaceContextService } from './lib/spaceContext';
import { Space } from './types/spaces';

/**
 * ============================================================================
 * Main Application Component
 * ============================================================================
 * 
 * The central hub of the InnoSpot application that manages:
 * - User authentication and session state
 * - Navigation between different sections
 * - Global application state (spaces, products, cart)
 * - Layout rendering and component orchestration
 * 
 * State Management:
 * - Authentication: Uses InstantAuth for demo users with real Supabase fallback
 * - Navigation: Single activeSection state controls which component renders
 * - Space Context: Global project/space selection affects multiple features
 * - E-commerce: Shopping cart and subscription management
 * 
 * @returns {JSX.Element} The complete application interface
 */
function App() {
  // ============================================================================
  // NAVIGATION & ROUTING STATE
  // ============================================================================
  
  /**
   * Controls which section/component is currently active
   * Possible values: register, login, dashboard, showcase, cms-admin, etc.
   */
  const [activeSection, setActiveSection] = useState('register');
  
  // ============================================================================
  // AUTHENTICATION STATE
  // ============================================================================
  
  /**
   * Current authenticated user (null if not logged in)
   * Uses InstantAuth system for demo users with seamless experience
   */
  const [currentUser, setCurrentUser] = useState<InstantUser | null>(null);
  
  // ============================================================================
  // UI INTERACTION STATE
  // ============================================================================
  
  /**
   * Controls platform tour modal visibility
   * Tour shows new users how to navigate the application
   */
  const [showTour, setShowTour] = useState(false);
  
  /**
   * Controls AI Chat panel visibility
   * AI Chat is available from sidebar and provides contextual assistance
   */
  const [showAIChat, setShowAIChat] = useState(false);
  
  // ============================================================================
  // E-COMMERCE & SUBSCRIPTION STATE
  // ============================================================================
  
  /**
   * Currently selected product for detailed view or purchase
   * Used in subscription flow and product showcase
   */
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  /**
   * Shopping cart items for subscription purchases
   * Supports multiple items with quantities and product details
   */
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  /**
   * Invoice ID for successful payments
   * Used to display payment success page and track transactions
   */
  const [invoiceId, setInvoiceId] = useState<string>('');
  
  /**
   * Currently selected category in the showcase
   * Filters available tools and capabilities: 'all', 'ai-agents', 'tools', etc.
   */
  const [showcaseCategory, setShowcaseCategory] = useState<string>('all');
  
  // ============================================================================
  // SPACE/PROJECT CONTEXT STATE
  // ============================================================================
  
  /**
   * Currently selected workspace/project space
   * Global context that affects multiple features (CMS, Showcase, Work Area)
   * Managed via SpaceContextService singleton
   */
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  
  /**
   * Support section routing parameter
   * Used to navigate to specific help topics in the support system
   */
  const [supportSection, setSupportSection] = useState<string | undefined>(undefined);

  // ============================================================================
  // NAVIGATION FUNCTIONS
  // ============================================================================
  
  /**
   * Main navigation handler for section switching
   * Updates activeSection state and optional category filter
   * 
   * @param {string} section - The target section ID (e.g., 'dashboard', 'showcase')
   * @param {string} [category] - Optional category filter for filtered views
   */
  const navigate = (section: string, category?: string) => {
    setActiveSection(section);
    if (category) {
      if (section === 'support') {
        setSupportSection(category);
      } else {
        setShowcaseCategory(category);
      }
    }
  };

  // ============================================================================
  // COMPONENT LIFECYCLE & EFFECTS
  // ============================================================================
  
  /**
   * Initialize authentication state and context services on component mount
   * 
   * Responsibilities:
   * - Check for existing user session and restore authentication state
   * - Initialize space context service for global project selection
   * - Set up listeners for space changes across the application
   * - Navigate to appropriate initial section based on auth state
   */
  useEffect(() => {
    // Check for active Live Demo session first
    if (isDemoActive()) {
      const demoUser = getDemoUser();
      if (demoUser) {
        setCurrentUser(demoUser);
        setActiveSection('showcase'); // Demo users start at showcase
        console.log('🚀 Live Demo Session Active:', demoUser);
        return;
      }
    }
    
    // Check if user is already logged in via InstantAuth
    const user = InstantAuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setActiveSection('showcase'); // Authenticated users start at showcase
    }
    
    // Initialize and set up space context service for global project/workspace selection
    const contextService = SpaceContextService.getInstance();
    contextService.initialize();
    
    // Listen for space changes and update local state
    const unsubscribe = contextService.addSpaceChangeListener((space) => {
      setCurrentSpace(space);
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  // ============================================================================
  // AUTHENTICATION EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle successful user registration
   * Updates authentication state and navigates to main application
   */
  const handleRegistrationSuccess = () => {
    const user = InstantAuthService.getCurrentUser();
    setCurrentUser(user);
    setActiveSection('showcase'); // New users start with the showcase
  };

  /**
   * Handle successful user login
   * Updates authentication state and navigates to main application
   */
  const handleLoginSuccess = () => {
    const user = InstantAuthService.getCurrentUser();
    setCurrentUser(user);
    setActiveSection('showcase'); // Returning users go to showcase
  };

  /**
   * Handle user sign out
   * Clears authentication state and returns to registration
   */
  const handleSignOut = () => {
    InstantAuthService.logout();
    setCurrentUser(null);
    setActiveSection('register');
  };

  /**
   * General navigation handler
   * Simple wrapper for setActiveSection used by various components
   * 
   * @param {string} section - The target section to navigate to
   */
  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  // ============================================================================
  // UI INTERACTION HANDLERS
  // ============================================================================
  
  /**
   * Start the platform tour for new users
   * Opens the interactive tour modal with step-by-step guidance
   */
  const handleStartTour = () => {
    setShowTour(true);
  };

  /**
   * Close the platform tour modal
   * User can dismiss tour without completing it
   */
  const handleTourClose = () => {
    setShowTour(false);
  };

  /**
   * Handle tour completion
   * Called when user finishes all tour steps
   */
  const handleTourComplete = () => {
    setShowTour(false);
  };

  /**
   * Toggle AI Chat panel visibility
   * AI Chat can be opened/closed from sidebar or keyboard shortcut
   */
  const handleToggleAIChat = () => {
    setShowAIChat(!showAIChat);
  };

  /**
   * Close AI Chat panel
   * Called when user clicks close button or clicks outside panel
   */
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
    const contextService = SpaceContextService.getInstance();
    contextService.setCurrentSpace(null);
  };

  // Current Project Display Component
  const CurrentProjectBanner = () => {
    if (!currentSpace) return null;
    
    return (
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currentSpace.color }}
            />
            <div>
              <div className="text-sm font-medium text-blue-900">
                Working on: {currentSpace.name}
              </div>
              <div className="text-xs text-blue-700">
                {currentSpace.assetCount} assets • {currentSpace.collaboratorCount} members
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
      {/* Show Demo Banner when in Live Demo mode */}
      {currentUser?.isDemo && isDemoActive() && (
        <DemoBanner 
          onUpgrade={() => {
            setActiveSection('register');
          }}
        />
      )}
      
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
            <div className="flex-1 -m-6">
              <Home user={currentUser} onNavigate={handleNavigate} />
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

          {activeSection === 'analytics' && (
            <div className="h-full bg-gray-50 flex flex-col">
              <div className="flex-1 -m-6">
                <PatentAnalyticsDashboard onStartTour={handleStartTour} />
              </div>
            </div>
          )}
          
          {activeSection === 'dashboards' && currentUser && (
            <div className="h-full bg-gray-50 flex flex-col">
              <CurrentProjectBanner />
              <div className="flex-1 -m-6">
                <CMSStudioModern 
                  currentUser={currentUser} 
                  projectId={currentSpace?.id}
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
              <Spaces onNavigate={handleNavigate} />
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
            <AccountSettings user={currentUser} currentUser={currentUser} />
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
            <div className="flex-1 -m-6">
              <ReportsModern 
                currentUser={currentUser} 
                projectId={currentSpace?.id}
                onNavigate={handleNavigate}
              />
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
            <NetworkPage currentUser={currentUser} />
          )}
          
          {activeSection === 'network' && currentUser && (
            <NetworkPage currentUser={currentUser} />
          )}
          
          {activeSection === 'messages' && currentUser && (
            <Messages currentUser={currentUser} />
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
              <ShowcaseModern 
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

          {/* Innovation Hub Features */}
          {activeSection === 'innovation-hub' && currentUser && (
            <div className="flex-1 -m-6">
              <InnovationHub 
                currentUser={currentUser} 
                projectId={currentSpace?.id}
                onNavigateToFeature={(feature) => setActiveSection(feature)}
              />
            </div>
          )}

          {/* Innovation Manager Hub - New Feature */}
          {activeSection === 'innovation-manager' && currentUser && (
            <div className="flex-1 -m-6">
              <InnovationManagerHub />
            </div>
          )}

          {/* Decision Engines */}
          {activeSection === 'decision-engines' && currentUser && (
            <div className="flex-1 -m-6">
              <DecisionEngines 
                currentUser={currentUser}
                onNavigate={(section) => setActiveSection(section)}
              />
            </div>
          )}

          {/* Visual Patent Explorer */}
          {activeSection === 'visual-patent-explorer' && currentUser && (
            <div className="flex-1 -m-6">
              <VisualPatentExplorer onStartTour={handleStartTour} />
            </div>
          )}
          
          {/* Patent Monitoring */}
          {activeSection === 'patent-monitoring' && currentUser && (
            <div className="flex-1 -m-6">
              <PatentMonitoring 
                currentUser={currentUser}
                onNavigate={(section) => setActiveSection(section)}
              />
            </div>
          )}

          {/* Patent Valuation */}
          {activeSection === 'patent-valuation' && currentUser && (
            <div className="flex-1 -m-6">
              <PatentValuation 
                currentUser={currentUser}
                onNavigate={(section) => setActiveSection(section)}
              />
            </div>
          )}

          {/* Competitive Intelligence */}
          {activeSection === 'competitive-intelligence' && currentUser && (
            <div className="flex-1 -m-6">
              <CompetitiveIntelligence 
                currentUser={currentUser}
                onNavigate={(section) => setActiveSection(section)}
              />
            </div>
          )}

          {/* Revolutionary Innovation Intelligence Components */}
          {activeSection === 'patent-dna-sequencer' && currentUser && (
            <div className="flex-1 -m-6">
              <PatentDNASequencer onNavigate={navigate} />
            </div>
          )}

          {activeSection === 'innovation-pulse-monitor' && currentUser && (
            <div className="flex-1 -m-6">
              <InnovationPulseMonitor onNavigate={navigate} />
            </div>
          )}

          {activeSection === 'white-space-cartographer' && currentUser && (
            <div className="flex-1 -m-6">
              <WhiteSpaceCartographer onNavigate={navigate} />
            </div>
          )}

          {activeSection === 'invention-collision-predictor' && currentUser && (
            <div className="flex-1 -m-6">
              <InventionCollisionPredictor onNavigate={navigate} />
            </div>
          )}

          {activeSection === 'ai-claim-generator' && currentUser && (
            <div className="flex-1 -m-6">
              <AIClaimGenerator 
                currentUser={currentUser} 
                projectId={currentSpace?.id}
              />
            </div>
          )}

          {activeSection === 'collision-detection' && !!currentUser && (
            <div className="flex-1 -m-6">
              <CollisionDetection 
                currentUser={currentUser} 
                projectId={currentSpace?.id}
              />
            </div>
          )}

          {activeSection === 'citation-3d' && currentUser && (
            <React.Fragment>
              <div className="flex-1 -m-6">
                <Citation3DVisualization 
                  currentUser={currentUser} 
                  projectId={currentSpace?.id}
                />
              </div>
            </React.Fragment>
          )}

          {activeSection === 'blockchain-provenance' && currentUser && (
            <div className="flex-1 -m-6">
              <BlockchainProvenance 
                currentUser={currentUser} 
                projectId={currentSpace?.id}
              />
            </div>
          )}

          {/* New AI Intelligence Features */}
          {activeSection === 'opportunity-gap-scanner' && currentUser && (
            <div className="flex-1 -m-6">
              <OpportunityGapScanner 
                currentUser={currentUser} 
                projectId={currentSpace?.id}
              />
            </div>
          )}

          {activeSection === 'ai-patent-claims' && currentUser && (
            <div className="flex-1 -m-6">
              <AIPatentClaimGenerator 
                currentUser={currentUser} 
                projectId={currentSpace?.id}
              />
            </div>
          )}

          {activeSection === 'prior-art-oracle' && currentUser && (
            <div className="flex-1 -m-6">
              <PriorArtOracle 
                currentUser={currentUser} 
                projectId={currentSpace?.id}
              />
            </div>
          )}

          {activeSection === 'trajectory-predictor' && currentUser && (
            <div className="flex-1 -m-6">
              <InnovationTrajectoryPredictor 
                currentUser={currentUser} 
                projectId={currentSpace?.id}
              />
            </div>
          )}

          {activeSection === 'ai-services-config' && currentUser && (
            <div className="flex-1 -m-6">
              <AIServicesConfig 
                currentUser={currentUser} 
              />
            </div>
          )}

          {activeSection === 'integrations' && currentUser && (
            <div className="flex-1 -m-6">
              <IntegrationsHub userId={currentUser.id} />
            </div>
          )}

          {activeSection === 'automation' && currentUser && (
            <div className="flex-1 -m-6">
              <AutomationHub projectId={currentSpace?.id} onClose={() => setActiveSection('dashboard')} />
            </div>
          )}

          {activeSection === 'support' && (
            <div className="flex-1 -m-6">
              <SupportPage initialSection={supportSection} />
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

          {/* Database Test Panel */}
          {activeSection === 'database-test' && currentUser && (
            {/* <DatabaseTestPanel /> */}
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