import React, { useState } from 'react';
import {
  Database,
  Users,
  BarChart3,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Award,
  Globe,
  MessageCircle,
  ArrowUpRight,
  Clock,
  Target,
  Shield,
  CheckCircle,
  Activity,
  FileText,
  PieChart,
  LineChart
} from 'lucide-react';
import PatentMarketplace from './PatentMarketplace';
import DataMarketplace from './DataMarketplace';
import ExpertServices from './ExpertServices';
import RevenueAnalytics from './RevenueAnalytics';
import PageHeader from './PageHeader';

interface MarketplaceSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  stats: {
    label: string;
    value: string | number;
    change?: string;
    color: string;
  }[];
  features: string[];
}

const marketplaceSections: MarketplaceSection[] = [
  {
    id: 'patents',
    title: 'Patent Marketplace',
    description: 'Buy, sell, and license patents with comprehensive due diligence and valuation tools',
    icon: ShoppingCart,
    component: PatentMarketplace,
    stats: [
      { label: 'Active Listings', value: '2,847', change: '+12%', color: 'text-blue-600' },
      { label: 'Avg Sale Price', value: '$1.2M', change: '+8%', color: 'text-green-600' },
      { label: 'Success Rate', value: '87%', color: 'text-purple-600' },
      { label: 'Time to Close', value: '45 days', color: 'text-orange-600' }
    ],
    features: [
      'Patent valuation & due diligence',
      'Licensing negotiation platform',
      'Transaction management',
      'Legal document generation',
      'Portfolio analytics',
      'Market comparables'
    ]
  },
  {
    id: 'data',
    title: 'Data Marketplace',
    description: 'Access premium patent data, analytics, and research insights from verified providers',
    icon: Database,
    component: DataMarketplace,
    stats: [
      { label: 'Datasets', value: '156', change: '+23%', color: 'text-blue-600' },
      { label: 'Data Quality', value: '96%', color: 'text-green-600' },
      { label: 'API Calls/Month', value: '2.8M', change: '+34%', color: 'text-purple-600' },
      { label: 'Avg Response Time', value: '120ms', color: 'text-orange-600' }
    ],
    features: [
      'Real-time patent data feeds',
      'Custom analytics dashboards',
      'API access & integrations',
      'Bulk data downloads',
      'Machine learning insights',
      'Global coverage'
    ]
  },
  {
    id: 'services',
    title: 'Expert Services',
    description: 'Connect with top IP professionals for consulting, analysis, and strategic guidance',
    icon: Users,
    component: ExpertServices,
    stats: [
      { label: 'Expert Providers', value: '1,247', change: '+18%', color: 'text-blue-600' },
      { label: 'Avg Rating', value: '4.8', color: 'text-yellow-600' },
      { label: 'Projects Completed', value: '5,632', change: '+41%', color: 'text-purple-600' },
      { label: 'Client Satisfaction', value: '94%', color: 'text-green-600' }
    ],
    features: [
      'Verified expert profiles',
      'Project bidding system',
      'Milestone-based payments',
      'Quality assurance',
      'Communication tools',
      '24/7 support'
    ]
  },
  {
    id: 'analytics',
    title: 'Revenue Analytics',
    description: 'Track marketplace performance with comprehensive financial reporting and insights',
    icon: BarChart3,
    component: RevenueAnalytics,
    stats: [
      { label: 'Monthly Revenue', value: '$485K', change: '+24%', color: 'text-green-600' },
      { label: 'Transactions', value: '147', change: '+15%', color: 'text-blue-600' },
      { label: 'Active Users', value: '1,247', change: '+7%', color: 'text-purple-600' },
      { label: 'Avg Deal Size', value: '$3.3K', change: '+11%', color: 'text-orange-600' }
    ],
    features: [
      'Real-time revenue tracking',
      'Transaction analytics',
      'Payout management',
      'Tax reporting',
      'Custom dashboards',
      'Performance insights'
    ]
  }
];

// Mock data for recent activity
const recentActivity = [
  {
    type: 'patent_sale',
    title: 'AI Patent US10,123,456 sold',
    user: 'TechGiant Corp',
    amount: '$2.5M',
    time: '2 hours ago',
    icon: ShoppingCart
  },
  {
    type: 'service_completed',
    title: 'Patent landscape analysis completed',
    user: 'Dr. Elena Martinez',
    amount: '$25K',
    time: '4 hours ago',
    icon: CheckCircle
  },
  {
    type: 'data_subscription',
    title: 'New data subscription started',
    user: 'Research Labs Inc',
    amount: '$999/mo',
    time: '6 hours ago',
    icon: Database
  },
  {
    type: 'expert_joined',
    title: 'New expert joined platform',
    user: 'James Chen',
    amount: 'Technical Analysis',
    time: '1 day ago',
    icon: Users
  }
];

export default function MarketplaceHub() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [_selectedCategory, _setSelectedCategory] = useState<string>('all');

  // If a specific section is selected, render its component
  if (activeSection) {
    const section = marketplaceSections.find(s => s.id === activeSection);
    if (section) {
      const SectionComponent = section.component;
      return (
        <div className="h-full bg-gray-50">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <button
              onClick={() => setActiveSection(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-2"
            >
              ← Back to Marketplace Hub
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{section.title}</h1>
          </div>
          <div className="h-full">
            <SectionComponent />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="h-full bg-gray-50">
      <PageHeader 
        title="Marketplace & Monetization Hub" 
        subtitle="Comprehensive platform for IP commerce, data access, and expert services"
      />

      {/* Overview Stats */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-600">$485K</div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
            <div className="flex items-center justify-center gap-1 text-green-600 text-sm mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+24%</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-600">3,250</div>
            <div className="text-sm text-gray-600">Total Listings</div>
            <div className="flex items-center justify-center gap-1 text-green-600 text-sm mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+15%</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full mx-auto mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-600">1,247</div>
            <div className="text-sm text-gray-600">Active Users</div>
            <div className="flex items-center justify-center gap-1 text-green-600 text-sm mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+7%</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full mx-auto mb-3">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-600">4.8</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
            <div className="text-sm text-gray-500 mt-1">Excellent</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Marketplace Sections */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketplaceSections.map((section) => {
                const SectionIcon = section.icon;
                return (
                  <div
                    key={section.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <SectionIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {section.stats.map((stat, index) => (
                          <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className={`text-lg font-bold ${stat.color}`}>
                              {stat.value}
                            </div>
                            <div className="text-xs text-gray-600">{stat.label}</div>
                            {stat.change && (
                              <div className="text-xs text-green-600 mt-1">{stat.change}</div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Features List */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {section.features.slice(0, 4).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        {section.features.length > 4 && (
                          <div className="text-xs text-blue-600">
                            +{section.features.length - 4} more features
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Explore {section.title}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveSection('patents')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium">List Patent</span>
                </button>
                <button 
                  onClick={() => setActiveSection('data')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Database className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium">Browse Data</span>
                </button>
                <button 
                  onClick={() => setActiveSection('services')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Users className="h-6 w-6 text-purple-600" />
                  <span className="text-sm font-medium">Find Expert</span>
                </button>
                <button 
                  onClick={() => setActiveSection('analytics')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                  <span className="text-sm font-medium">View Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <ActivityIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.user}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-medium text-green-600">{activity.amount}</span>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Platform Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                  </div>
                  <span className="text-sm font-semibold">12.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Market Share</span>
                  </div>
                  <span className="text-sm font-semibold">34.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Avg Response Time</span>
                  </div>
                  <span className="text-sm font-semibold">2.3 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Goal Achievement</span>
                  </div>
                  <span className="text-sm font-semibold">87%</span>
                </div>
              </div>
            </div>

            {/* Trust & Security */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Trust & Security</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Platform Security</div>
                    <div className="text-xs text-gray-600">256-bit SSL encryption</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Verified Users</div>
                    <div className="text-xs text-gray-600">94% verification rate</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Quality Assurance</div>
                    <div className="text-xs text-gray-600">Expert validation process</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Global Compliance</div>
                    <div className="text-xs text-gray-600">50+ jurisdictions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our marketplace experts are here to help you succeed
              </p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <MessageCircle className="h-4 w-4" />
                  Contact Support
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50">
                  <FileText className="h-4 w-4" />
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}