import { useState } from 'react';
import { 
  Home, 
  ChevronRight,
  Search,
  FileText,
  PlayCircle,
  Users,
  Settings,
  HelpCircle,
  CheckCircle,
  Share2,
  TrendingUp,
  BarChart3,
  DollarSign,
  Star
} from 'lucide-react';

export default function ReportsSupport() {
  const [searchQuery, setSearchQuery] = useState('');

  const supportSections = [
    {
      title: 'Getting Started with Reports',
      description: 'Learn how to create and manage your reports',
      icon: FileText
    },
    {
      title: 'Report Creation Wizard',
      description: 'Step-by-step guide to creating custom reports',
      icon: Settings
    },
    {
      title: 'Netflix-Style Navigation',
      description: 'Browse and discover reports with carousel interface',
      icon: TrendingUp
    },
    {
      title: 'Sharing Reports',
      description: 'Share your reports via email, WhatsApp, and LinkedIn',
      icon: Share2
    },
    {
      title: 'Premium Reports Marketplace',
      description: 'Access professional market intelligence reports',
      icon: DollarSign
    },
    {
      title: 'Report Analytics',
      description: 'Track views, downloads, and engagement metrics',
      icon: BarChart3
    },
    {
      title: 'Collaboration Features',
      description: 'Work together on reports with your team',
      icon: Users
    }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Accounts & Studio', href: '/work-area' },
    { label: 'Studio', href: '/work-area' },
    { label: 'Reports', href: '/reports', active: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">I</span>
              </div>
              <span className="text-xl font-semibold">SUPPORT</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-300 hover:text-white">Home</a>
              <a href="/app" className="text-gray-300 hover:text-white">Back to Lens</a>
              <a href="/glossary" className="text-gray-300 hover:text-white">Glossary</a>
              <a href="/language" className="text-gray-300 hover:text-white">English</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumbs */}
            <div className="mb-8">
              <nav className="flex items-center text-sm text-gray-500">
                {breadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <a 
                      href={item.href} 
                      className={`flex items-center gap-1 hover:text-blue-600 ${item.active ? 'text-blue-600' : ''}`}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {item.label}
                    </a>
                    {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 mx-2" />}
                  </div>
                ))}
              </nav>
            </div>

            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Reports</h1>
              
              {/* Video Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-center bg-blue-100 rounded-lg h-64 mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Reports Overview</h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <PlayCircle className="w-4 h-4" />
                      <span>0:00 / 3:45</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Reports section provides a comprehensive platform for creating, managing, and sharing 
                  analytical reports. Create custom reports from your research data, discover reports shared by 
                  colleagues, and access professional market intelligence from our premium marketplace.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Netflix-Style Discovery</h4>
                      <p className="text-sm text-blue-700">
                        Our carousel interface makes it easy to discover and browse through different 
                        categories of reports, from user-created content to premium market intelligence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Your Reports
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Create and manage your own analytical reports. Build custom visualizations 
                    from your research data and share insights with your network.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Custom report builder with templates</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Data visualization tools</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Export in multiple formats</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Privacy controls and sharing options</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Shared Reports
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Access reports shared by colleagues and collaborators. Discover insights 
                    from your professional network and research community.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Reports shared by colleagues</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Research community contributions</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Collaborative analysis projects</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Commenting and feedback system</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Premium Marketplace */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  Premium Reports Marketplace
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      Market Intelligence
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Professional market research reports with in-depth industry analysis and forecasts.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Industry trend analysis</li>
                      <li>• Competitive landscape reports</li>
                      <li>• Market forecast and sizing</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      Expert Analysis
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Reports created by industry experts and research institutions with verified credentials.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Expert-authored content</li>
                      <li>• Peer-reviewed research</li>
                      <li>• Institutional backing</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      Quality Assurance
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      All premium reports undergo rigorous quality checks and user rating systems.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Quality verification process</li>
                      <li>• User ratings and reviews</li>
                      <li>• Money-back guarantee</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Features Overview */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  Key Features & Capabilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Report Management
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Create reports with drag-and-drop builder</li>
                      <li>• Multiple export formats (PDF, Excel, PowerPoint)</li>
                      <li>• Version control and revision history</li>
                      <li>• Automated report scheduling and delivery</li>
                      <li>• Custom branding and white-labeling</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Sharing & Collaboration
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Share via email, WhatsApp, and LinkedIn</li>
                      <li>• Granular permission controls</li>
                      <li>• Real-time collaborative editing</li>
                      <li>• Comment threads and feedback system</li>
                      <li>• Track views and engagement metrics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Contents */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Contents</h3>
              <ul className="space-y-2">
                {supportSections.map((section, index) => {
                  const IconComponent = section.icon;
                  return (
                    <li key={index}>
                      <a
                        href={`#${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <IconComponent className="w-4 h-4" />
                        {section.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-blue-800 hover:bg-blue-100 rounded">
                  → Create Your First Report
                </button>
                <button className="w-full text-left p-2 text-sm text-blue-800 hover:bg-blue-100 rounded">
                  → Browse Premium Marketplace
                </button>
                <button className="w-full text-left p-2 text-sm text-blue-800 hover:bg-blue-100 rounded">
                  → Import Data for Analysis
                </button>
                <button className="w-full text-left p-2 text-sm text-blue-800 hover:bg-blue-100 rounded">
                  → Share Report with Team
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">Need Support?</h3>
              <p className="text-sm text-blue-800 mb-4">
                Can't find the answer you're looking for? Submit a ticket and we'll get you an answer.
              </p>
              <button className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-600">
                Submit Ticket
              </button>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-2">Join Our Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Join our newsletter to receive frequent news updates, and notices about new releases. 
                We don't share or sell your information ever.
              </p>
              <button className="w-full bg-gray-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-900">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}