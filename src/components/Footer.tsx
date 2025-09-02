import { ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const policyLinks = [
    {
      title: 'Terms of Use',
      href: '/terms-of-use',
      description: 'Read our terms and conditions'
    },
    {
      title: 'Privacy Policy',
      href: '/privacy-policy',
      description: 'Learn how we protect your data'
    },
    {
      title: 'Responsible Use of AI',
      href: '/responsible-ai',
      description: 'Our AI ethics and guidelines'
    }
  ];

  const handleLinkClick = (title: string) => {
    // For now, show an alert since these are placeholder pages
    // In production, these would navigate to actual policy pages
    alert(`${title} page would be displayed here. This is a demo application.`);
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">I</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">InnoSpot</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your innovation intelligence platform for discovering and analyzing cutting-edge research and patents worldwide.
              </p>
            </div>

            {/* Policy Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Legal & Policies
              </h4>
              <ul className="space-y-3">
                {policyLinks.map((link) => (
                  <li key={link.title}>
                    <button
                      onClick={() => handleLinkClick(link.title)}
                      className="group flex items-start space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      title={link.description}
                    >
                      <ExternalLink className="w-3 h-3 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="hover:underline">{link.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => alert('Help Center would be displayed here. This is a demo application.')}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors hover:underline"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert('Contact form would be displayed here. This is a demo application.')}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors hover:underline"
                  >
                    Contact Support
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert('Documentation would be displayed here. This is a demo application.')}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors hover:underline"
                  >
                    API Documentation
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500">
              © {currentYear} InnoSpot. All rights reserved.
            </div>
            
            {/* AI Disclosure */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>AI-Powered Platform</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <span className="text-center sm:text-right">
                Built with responsible AI practices
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}