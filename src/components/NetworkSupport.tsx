import { useState } from 'react';
import { 
  Home, 
  ChevronRight,
  Search,
  Users,
  PlayCircle,
  Building,
  Coffee,
  Globe,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Share2,
  Eye,
  UserCheck,
  Star,
  Shield,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

export default function NetworkSupport() {
  const [searchQuery, setSearchQuery] = useState('');

  const supportSections = [
    {
      title: 'Getting Started with Professional Network',
      description: 'Learn how to build and manage your network',
      icon: Users
    },
    {
      title: 'Adding Contacts',
      description: 'How to add and categorize your professional contacts',
      icon: UserCheck
    },
    {
      title: 'Contact Categories',
      description: 'Understanding different contact categories and organization',
      icon: Building
    },
    {
      title: 'Search and Discovery',
      description: 'Finding and filtering contacts efficiently',
      icon: Search
    },
    {
      title: 'Sharing and Collaboration',
      description: 'Share assets and collaborate with your network',
      icon: Share2
    },
    {
      title: 'Connection Management',
      description: 'Managing relationship strength and communication history',
      icon: TrendingUp
    },
    {
      title: 'Privacy and Security',
      description: 'Controlling visibility and managing contact data',
      icon: Shield
    }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Accounts & Studio', href: '/work-area' },
    { label: 'Studio', href: '/work-area' },
    { label: 'Network', href: '/network', active: true }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Professional Network</h1>
              
              {/* Video Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-center bg-blue-100 rounded-lg h-64 mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Network Overview</h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <PlayCircle className="w-4 h-4" />
                      <span>0:00 / 4:15</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your Professional Network is a centralized hub for managing relationships with colleagues, 
                  collaborators, suppliers, conference contacts, and business connections. Organize your contacts 
                  by category, track collaboration history, and seamlessly share assets with the right people 
                  at the right time.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Smart Integration</h4>
                      <p className="text-sm text-blue-700">
                        Your network integrates seamlessly with all platform features. When sharing reports, 
                        notifications, or other assets, easily select recipients from your organized contact list.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    Company Contacts
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Colleagues and team members from your organization for internal collaboration.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Department colleagues</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Cross-functional teams</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Management and leadership</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Collaborators
                  </h2>
                  <p className="text-gray-600 mb-4">
                    External partners working on joint projects, research, or publications.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Research partners</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Co-inventors and co-authors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Joint venture partners</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    Suppliers & Vendors
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Service providers, consultants, and business partners supporting your work.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Legal and IP counsel</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Technical consultants</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Service providers</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-orange-600" />
                    Conference Contacts
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Professional connections made at conferences, seminars, and industry events.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Speakers and presenters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Fellow attendees</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Industry experts</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-blue-600 text-sm font-bold bg-blue-100 w-5 h-5 rounded flex items-center justify-center">in</span>
                    LinkedIn Connections
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Professional network contacts imported or connected through LinkedIn.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>LinkedIn imports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Social professional network</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Industry connections</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-yellow-600" />
                    Clients & Customers
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Business clients, customers, and stakeholders you serve or work with.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Current clients</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Prospective customers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Key stakeholders</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Key Features */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Key Features & Capabilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Options & Discovery
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Card view with detailed contact information</li>
                      <li>• List view for quick scanning and bulk actions</li>
                      <li>• Advanced search across names, companies, and tags</li>
                      <li>• Filter by category, location, and collaboration history</li>
                      <li>• Sort by last communication, collaboration count, or connection strength</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Sharing & Collaboration
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Share assets directly with network contacts</li>
                      <li>• Email, WhatsApp, and LinkedIn integration</li>
                      <li>• Track shared projects and collaborations</li>
                      <li>• View collaboration history and shared work</li>
                      <li>• Quick access from asset sharing dialogs</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Connection Strength System */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Connection Strength Indicator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">Strong</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Regular communication and multiple collaborations. Close working relationships with frequent interactions.
                    </p>
                  </div>
                  <div className="border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium text-yellow-800">Medium</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Occasional communication with some collaboration history. Professional relationship with periodic contact.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="font-medium text-gray-800">Weak</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Limited or infrequent communication. New connections or contacts with minimal interaction history.
                    </p>
                  </div>
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Network Management Best Practices
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Recommended Practices
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Regularly update contact information and tags</li>
                      <li>• Add notes after meetings or collaborations</li>
                      <li>• Use descriptive tags for easy categorization</li>
                      <li>• Track project involvement and shared work</li>
                      <li>• Maintain regular communication with strong connections</li>
                      <li>• Review and clean up inactive contacts periodically</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Common Pitfalls to Avoid
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Adding contacts without proper categorization</li>
                      <li>• Neglecting to update collaboration history</li>
                      <li>• Sharing sensitive information without permission</li>
                      <li>• Failing to maintain contact privacy settings</li>
                      <li>• Not utilizing tags and search functionality</li>
                      <li>• Overlooking connection strength indicators</li>
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
            <div className="bg-green-50 rounded-lg border border-green-200 p-4 mb-6">
              <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-green-800 hover:bg-green-100 rounded">
                  → Add Your First Contact
                </button>
                <button className="w-full text-left p-2 text-sm text-green-800 hover:bg-green-100 rounded">
                  → Import LinkedIn Contacts
                </button>
                <button className="w-full text-left p-2 text-sm text-green-800 hover:bg-green-100 rounded">
                  → Set Up Contact Categories
                </button>
                <button className="w-full text-left p-2 text-sm text-green-800 hover:bg-green-100 rounded">
                  → Share Asset with Network
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