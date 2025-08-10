import { useState } from 'react';
import { 
  Home, 
  ChevronRight,
  Search,
  Folder,
  PlayCircle,
  FileText,
  Users,
  Bell,
  Settings,
  BookOpen
} from 'lucide-react';

export default function CollectionsSupport() {
  const [searchQuery, setSearchQuery] = useState('');

  const supportSections = [
    {
      title: 'Static Collections',
      description: 'Learn about manually curated collections',
      icon: Folder
    },
    {
      title: 'Dynamic Collections',
      description: 'Understand automatically updated collections',
      icon: Bell
    },
    {
      title: 'Static vs Dynamic Collection',
      description: 'Compare collection types and choose the right one',
      icon: Users
    },
    {
      title: 'Locations',
      description: 'Find out where collections are stored and accessed',
      icon: FileText
    },
    {
      title: 'How to Use',
      description: 'Step-by-step guides for using collections',
      icon: PlayCircle
    },
    {
      title: 'Editing and Management',
      description: 'Learn how to modify and organize collections',
      icon: Settings
    },
    {
      title: 'Anatomy of the Collections Page',
      description: 'Understanding the collections interface',
      icon: BookOpen
    }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Accounts & Studio', href: '/work-area' },
    { label: 'Studio', href: '/work-area' },
    { label: 'Collections', href: '/collections', active: true }
  ];

  const alternateBreadcrumbs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Patents', href: '/patents' },
    { label: 'Patent Toolbar', href: '/patent-toolbar' },
    { label: 'Collections', href: '/collections', active: true }
  ];

  const scholarlyBreadcrumbs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Scholarly Works', href: '/scholarly' },
    { label: 'Scholarly Toolbar', href: '/scholarly-toolbar' },
    { label: 'Collections', href: '/collections', active: true }
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
            <div className="mb-8 space-y-2">
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
              
              <nav className="flex items-center text-sm text-gray-500">
                {alternateBreadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <a 
                      href={item.href} 
                      className={`flex items-center gap-1 hover:text-blue-600 ${item.active ? 'text-blue-600' : ''}`}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {item.label}
                    </a>
                    {index < alternateBreadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 mx-2" />}
                  </div>
                ))}
              </nav>

              <nav className="flex items-center text-sm text-gray-500">
                {scholarlyBreadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <a 
                      href={item.href} 
                      className={`flex items-center gap-1 hover:text-blue-600 ${item.active ? 'text-blue-600' : ''}`}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {item.label}
                    </a>
                    {index < scholarlyBreadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 mx-2" />}
                  </div>
                ))}
              </nav>
            </div>

            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Collections</h1>
              
              {/* Video Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-center bg-blue-100 rounded-lg h-64 mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Folder className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Collections</h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <PlayCircle className="w-4 h-4" />
                      <span>0:00 / 2:05</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Collections are a saved grouping of patents or scholarly works. Any items in a search result 
                  can be manually added or removed from a collection. You can give your collection a name 
                  and description, import/export items or choose your sharing settings. You will need to 
                  register to make collections and access them in future. The current maximum collection 
                  size is 50,000 documents. We have two types of collections.
                </p>
              </div>

              {/* Collection Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Static Collections</h2>
                  <p className="text-gray-700 mb-4">
                    Static collections are manually curated items and are not updated automatically when 
                    items are added to our search index.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Manually curate items</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Add notes to annotate collections</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Private or public publishing</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Dynamic Collections</h2>
                  <p className="text-gray-700 mb-4">
                    Dynamic Collections are collections that are linked to one or more Saved Queries and 
                    updated whenever new scholarly works/patents matching the linked Saved Query are 
                    added to our search index.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Auto update from queries</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Receive alert notifications</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Always up to date</span>
                    </div>
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