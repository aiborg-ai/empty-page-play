import { useState } from 'react';
import { 
  Home, 
  ChevronRight,
  Search,
  BarChart3,
  PlayCircle,
  Settings,
  Share2,
  PieChart,
  LineChart,
  Activity,
  Target,
  HelpCircle
} from 'lucide-react';

export default function DashboardsSupport() {
  const [searchQuery, setSearchQuery] = useState('');

  const supportSections = [
    {
      title: 'Getting Started with Dashboards',
      description: 'Learn the basics of creating and using analysis dashboards',
      icon: BarChart3
    },
    {
      title: 'Dashboard Types & Templates',
      description: 'Understand different dashboard types and available templates',
      icon: PieChart
    },
    {
      title: 'Visualization Options',
      description: 'Explore different chart types and visualization options',
      icon: LineChart
    },
    {
      title: 'Sharing & Collaboration',
      description: 'Learn how to share dashboards and collaborate with others',
      icon: Share2
    },
    {
      title: 'Data Analysis Best Practices',
      description: 'Tips for effective data analysis and visualization',
      icon: Target
    },
    {
      title: 'Dashboard Management',
      description: 'Organize, edit, and manage your dashboard collection',
      icon: Settings
    },
    {
      title: 'Advanced Features',
      description: 'Explore advanced dashboard features and customization',
      icon: Activity
    }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Accounts & Studio', href: '/work-area' },
    { label: 'Studio', href: '/work-area' },
    { label: 'Dashboards', href: '/dashboards', active: true }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Analysis Dashboards</h1>
              
              {/* Video Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-center bg-blue-100 rounded-lg h-64 mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Dashboards</h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <PlayCircle className="w-4 h-4" />
                      <span>0:00 / 3:45</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our suite of analysis and visualisation tools enable real-time discovery and analysis. 
                  Dashboards can be saved, presented and shared via LinkedIn, Twitter, Facebook or email. 
                  Create custom visualizations to analyze patents, citations, inventors, applicants, and more.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Getting Started</h4>
                      <p className="text-sm text-yellow-700">
                        Start by selecting what you'd like to analyze, then choose from various visualization 
                        options including bar charts, scatter plots, time series, and more. Each dashboard 
                        can contain multiple charts and can be customized to fit your analysis needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Analysis Types
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span><strong>Patents:</strong> Analyze patent documents and trends</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span><strong>Citations:</strong> Citation network analysis</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span><strong>Inventors:</strong> Inventor collaboration networks</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span><strong>Applicants:</strong> Applicant analysis and trends</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span><strong>Legal Status:</strong> Legal status tracking</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span><strong>Jurisdictions:</strong> Geographic analysis</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-green-600" />
                    Visualization Options
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span><strong>Bar Charts:</strong> Compare categorical data</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span><strong>Scatter Plots:</strong> Relationship analysis</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span><strong>Time Series:</strong> Trends over time</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span><strong>Horizontal Bars:</strong> Ranking and comparison</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span><strong>Network Graphs:</strong> Relationship mapping</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span><strong>Heat Maps:</strong> Intensity visualization</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sharing & Collaboration */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-600" />
                  Sharing & Collaboration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Social Sharing</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Share your dashboards directly on LinkedIn, Twitter, Facebook, or via email.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• One-click social media sharing</li>
                      <li>• Custom share messages</li>
                      <li>• Professional presentation mode</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Link Sharing</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Generate shareable links with customizable access permissions.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Public or private links</li>
                      <li>• View-only or interactive access</li>
                      <li>• Expiration date settings</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Collaboration</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Work together with team members on dashboard analysis.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Team workspace sharing</li>
                      <li>• Comment and annotation</li>
                      <li>• Version control</li>
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

            {/* Quick Tips */}
            <div className="bg-green-50 rounded-lg border border-green-200 p-4 mb-6">
              <h3 className="font-medium text-green-900 mb-2">Quick Tips</h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• Start with a specific analysis question</li>
                <li>• Choose the right visualization type</li>
                <li>• Use filters to focus your analysis</li>
                <li>• Save and share insights with your team</li>
                <li>• Export charts for presentations</li>
              </ul>
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