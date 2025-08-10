import { useState } from 'react';
import { 
  Home, 
  ChevronRight,
  Search,
  Award,
  PlayCircle,
  Users,
  GraduationCap,
  ExternalLink,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Link as LinkIcon,
  Shield
} from 'lucide-react';

export default function ClaimedWorkSupport() {
  const [searchQuery, setSearchQuery] = useState('');

  const supportSections = [
    {
      title: 'Getting Started with Claimed Work',
      description: 'Learn the basics of claiming inventorship and authorship',
      icon: Award
    },
    {
      title: 'ORCID Integration',
      description: 'How to link and sync your work with ORCID',
      icon: LinkIcon
    },
    {
      title: 'Inventorship Claims',
      description: 'Recording and managing patent inventorship',
      icon: Award
    },
    {
      title: 'Authorship Claims',
      description: 'Managing scholarly work authorship records',
      icon: GraduationCap
    },
    {
      title: 'Verification Process',
      description: 'Understanding the verification workflow',
      icon: CheckCircle
    },
    {
      title: 'Sharing Your Work',
      description: 'Share your achievements on social platforms',
      icon: Users
    },
    {
      title: 'Privacy & Security',
      description: 'Managing visibility and access to your claims',
      icon: Shield
    }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Accounts & Studio', href: '/work-area' },
    { label: 'Studio', href: '/work-area' },
    { label: 'Claimed Work', href: '/claimed-work', active: true }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Claimed Work</h1>
              
              {/* Video Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-center bg-blue-100 rounded-lg h-64 mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Claimed Work Overview</h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <PlayCircle className="w-4 h-4" />
                      <span>0:00 / 4:30</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Claimed Work allows you to record and manage your inventorship of patents and authorship of scholarly works. 
                  By linking your ORCID account, you can automatically synchronize your achievements and maintain a comprehensive 
                  record of your research contributions and innovations.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">ORCID Integration Required</h4>
                      <p className="text-sm text-blue-700">
                        To record your inventorship and authorship claims, you need to link your ORCID account. 
                        This ensures proper attribution and allows automatic synchronization with your professional profile.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Patent Inventorship
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Record your role as an inventor on patents. Maintain a comprehensive record of your 
                    innovative contributions and intellectual property achievements.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Link patents to your ORCID profile</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Track co-inventors and collaborations</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Verify inventorship claims</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Share achievements professionally</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    Scholarly Authorship
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Manage your authorship of research papers, articles, and other scholarly publications. 
                    Build a complete academic profile with verified contributions.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Sync publications with ORCID</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Track co-authors and affiliations</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Manage citation metrics</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Export for CV and portfolios</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ORCID Integration */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-purple-600" />
                  ORCID Integration & Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-purple-600" />
                      Automatic Sync
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Automatically synchronize your claimed work with your ORCID profile for global visibility.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Real-time profile updates</li>
                      <li>• Global researcher visibility</li>
                      <li>• Academic network integration</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      Verified Attribution
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Ensure proper attribution of your work with verified claims and institutional backing.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Institutional verification</li>
                      <li>• Peer validation system</li>
                      <li>• Anti-fraud protection</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Career Benefits
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Enhance your professional profile and career opportunities with comprehensive work records.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Enhanced job applications</li>
                      <li>• Grant application support</li>
                      <li>• Professional networking</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Status System */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Verification Status System
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-red-800">Unverified</span>
                    </div>
                    <p className="text-sm text-red-700">
                      Initial status when a claim is first made. Requires verification through ORCID or institutional confirmation.
                    </p>
                  </div>
                  <div className="border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-yellow-800">Pending</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Claim is under review. Additional documentation or institutional verification may be required.
                    </p>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-green-800">Verified</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Claim has been verified and is synchronized with your ORCID profile. Visible to the research community.
                    </p>
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

            {/* ORCID Quick Start */}
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-4 mb-6">
              <h3 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                ORCID Quick Start
              </h3>
              <ul className="text-sm text-purple-800 space-y-2">
                <li>• Create or sign in to ORCID account</li>
                <li>• Link your InnoSpot account</li>
                <li>• Import existing publications</li>
                <li>• Start claiming inventorship</li>
                <li>• Verify your contributions</li>
              </ul>
              <button className="w-full mt-3 bg-purple-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-purple-700">
                Get Started with ORCID
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