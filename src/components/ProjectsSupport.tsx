import { 
  FolderPlus, 
  Users, 
  Share2, 
  Settings, 
  Search,
  Activity,
  FileText,
  Database,
  BarChart3
} from 'lucide-react';

export default function ProjectsSupport() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects Help</h1>
              <p className="text-lg text-gray-600">Learn how to organize your research with collaborative projects</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FolderPlus className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-sm text-gray-600 mb-3">Learn how to create and manage your first project</p>
            <button className="text-blue-600 text-sm font-medium hover:underline">Quick Start Guide →</button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Collaboration</h3>
            <p className="text-sm text-gray-600 mb-3">Invite team members and share your research</p>
            <button className="text-blue-600 text-sm font-medium hover:underline">Learn Collaboration →</button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Share2 className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Asset Management</h3>
            <p className="text-sm text-gray-600 mb-3">Organize and share assets across projects</p>
            <button className="text-blue-600 text-sm font-medium hover:underline">Manage Assets →</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What are Projects */}
            <section className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What are Projects?</h2>
              <div className="prose text-gray-600">
                <p className="mb-4">
                  Projects are collaborative workspaces that help you organize your patent research, analysis, and findings. 
                  Think of a project as a digital research folder that can contain various assets like search queries, 
                  datasets, dashboards, reports, and more.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs">💡</span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Pro Tip</p>
                      <p className="text-sm text-blue-800">
                        Start each research initiative as a new project. This keeps your work organized and makes collaboration easier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Project Features */}
            <section className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Activity Tracking</h3>
                    <p className="text-gray-600 text-sm">
                      Every action you take within a project is logged automatically. See who did what and when, 
                      making it easy to track research progress and collaborate effectively.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Asset Management</h3>
                    <p className="text-gray-600 text-sm">
                      Automatically save search queries, datasets, dashboards, and reports as project assets. 
                      Reuse assets across projects and maintain a comprehensive research library.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                    <p className="text-gray-600 text-sm">
                      Invite team members to collaborate on projects. Set permissions, share findings, 
                      and work together on complex research initiatives.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cross-Project Sharing</h3>
                    <p className="text-gray-600 text-sm">
                      Use assets from other projects without duplicating work. Share insights and build 
                      upon previous research across multiple initiatives.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Asset Types */}
            <section className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Asset Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-lg">
                  <Search className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Search Queries</h4>
                    <p className="text-sm text-gray-600">Saved patent searches with filters and results</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-lg">
                  <Database className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Datasets</h4>
                    <p className="text-sm text-gray-600">Patent data collections and analysis results</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Dashboards</h4>
                    <p className="text-sm text-gray-600">Interactive visualizations and analytics</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Reports</h4>
                    <p className="text-sm text-gray-600">Generated research reports and summaries</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Practices</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Start with Clear Objectives</h4>
                    <p className="text-sm text-gray-600">
                      Define your research goals before creating a project. Use descriptive names and detailed descriptions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Use Tags Effectively</h4>
                    <p className="text-sm text-gray-600">
                      Tag projects with relevant keywords to make them easier to find and organize.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Regular Collaboration</h4>
                    <p className="text-sm text-gray-600">
                      Keep team members engaged by regularly sharing updates and encouraging contribution.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Archive Completed Projects</h4>
                    <p className="text-sm text-gray-600">
                      Keep your workspace clean by archiving completed projects while preserving their assets.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200">
                  <FolderPlus className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Create New Project</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200">
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Project Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Invite Collaborators</span>
                </button>
              </div>
            </div>

            {/* Video Tutorials */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Video Tutorials</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 h-32 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">▶️ Creating Your First Project</span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Getting Started with Projects</h4>
                    <p className="text-xs text-gray-600">Learn the basics of project creation and setup</p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 h-32 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">▶️ Team Collaboration</span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Collaborating with Your Team</h4>
                    <p className="text-xs text-gray-600">Invite members and manage permissions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Frequently Asked</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2">How many projects can I create?</h4>
                  <p className="text-xs text-gray-600">There's no limit to the number of projects you can create.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Can I move assets between projects?</h4>
                  <p className="text-xs text-gray-600">Yes, you can share assets across projects or move them entirely.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Are projects automatically saved?</h4>
                  <p className="text-xs text-gray-600">Yes, all project changes are saved automatically in real-time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Need more help? Contact our support team or browse our knowledge base.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="text-blue-600 hover:underline text-sm">Contact Support</button>
            <span className="text-gray-300">|</span>
            <button className="text-blue-600 hover:underline text-sm">Knowledge Base</button>
            <span className="text-gray-300">|</span>
            <button className="text-blue-600 hover:underline text-sm">Video Library</button>
          </div>
        </div>
      </div>
    </div>
  );
}