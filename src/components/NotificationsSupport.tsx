import { useState } from 'react';
import { 
  Home, 
  ChevronRight,
  Search,
  Bell,
  PlayCircle,
  Users,
  Settings,
  Mail,
  Smartphone,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Filter,
  Share2
} from 'lucide-react';

export default function NotificationsSupport() {
  const [searchQuery, setSearchQuery] = useState('');

  const supportSections = [
    {
      title: 'Getting Started with Notifications',
      description: 'Learn how to set up and manage your notifications',
      icon: Bell
    },
    {
      title: 'Query Alerts Setup',
      description: 'Configure alerts for your saved searches',
      icon: Search
    },
    {
      title: 'Email Notifications',
      description: 'Manage email notification preferences',
      icon: Mail
    },
    {
      title: 'Mobile Notifications',
      description: 'Set up push notifications on mobile devices',
      icon: Smartphone
    },
    {
      title: 'Notification Filtering',
      description: 'Filter and organize your notifications',
      icon: Filter
    },
    {
      title: 'Sharing Notifications',
      description: 'Share important updates with colleagues',
      icon: Share2
    },
    {
      title: 'Privacy Settings',
      description: 'Control notification privacy and visibility',
      icon: Settings
    }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Accounts & Studio', href: '/work-area' },
    { label: 'Studio', href: '/work-area' },
    { label: 'Notifications', href: '/notifications', active: true }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Notifications</h1>
              
              {/* Video Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-center bg-blue-100 rounded-lg h-64 mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Notifications Overview</h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <PlayCircle className="w-4 h-4" />
                      <span>0:00 / 3:15</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Stay informed about the latest updates to your research interests. Notifications help you track 
                  new results for your saved queries, updates to your collections, and important system announcements. 
                  Configure your preferences to receive alerts via email or in-app notifications.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Smart Notifications</h4>
                      <p className="text-sm text-blue-700">
                        Our intelligent notification system learns from your preferences and only sends 
                        relevant updates to reduce notification fatigue while keeping you informed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    Query Alerts
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Receive notifications when new results match your saved searches. Stay updated on 
                    the latest patents, publications, and research in your field.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>New patent filings matching your queries</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Scholarly publications in your research area</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Citation updates and new references</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Legal status changes for tracked patents</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Collaboration Updates
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Stay informed about shared content, team activities, and collaborative research 
                    projects with your colleagues and research partners.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>New collections shared with you</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Comments on your shared research</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Team member activity updates</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Collaboration request notifications</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Delivery Methods */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-600" />
                  Notification Delivery Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      In-App Notifications
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Receive instant notifications within the InnoSpot platform for immediate awareness.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Real-time updates</li>
                      <li>• Badge counters</li>
                      <li>• Priority highlighting</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-600" />
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Get detailed email summaries of your notifications with direct links to relevant content.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Daily/weekly digests</li>
                      <li>• Instant alerts</li>
                      <li>• Rich content previews</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-600" />
                      Mobile Push
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Stay connected on the go with mobile push notifications for critical updates.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Mobile app integration</li>
                      <li>• Priority filtering</li>
                      <li>• Offline synchronization</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  Notification Best Practices
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Recommended Settings
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Enable query alerts for active research areas</li>
                      <li>• Set email digest frequency to weekly</li>
                      <li>• Use priority filtering for important updates</li>
                      <li>• Enable mobile notifications for urgent alerts</li>
                      <li>• Review and update preferences monthly</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Common Pitfalls
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Enabling too many non-essential notifications</li>
                      <li>• Not setting up spam filters properly</li>
                      <li>• Ignoring notification preferences updates</li>
                      <li>• Using overly broad search query alerts</li>
                      <li>• Not customizing delivery schedules</li>
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

            {/* Quick Setup */}
            <div className="bg-green-50 rounded-lg border border-green-200 p-4 mb-6">
              <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Quick Setup Guide
              </h3>
              <ol className="text-sm text-green-800 space-y-2">
                <li>1. Create saved queries for your research areas</li>
                <li>2. Enable email notifications in settings</li>
                <li>3. Set your preferred notification frequency</li>
                <li>4. Configure mobile push notifications</li>
                <li>5. Test your notification setup</li>
              </ol>
              <button className="w-full mt-3 bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700">
                Start Setup Wizard
              </button>
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