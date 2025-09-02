'use client'

import { useAuth } from '../providers'
import { 
  DocumentTextIcon,
  PhotoIcon,
  SparklesIcon,
  UsersIcon,
  PencilSquareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/20/solid'

const stats = [
  { 
    name: 'Total Capabilities', 
    value: '24', 
    change: '+4', 
    changeType: 'positive',
    icon: SparklesIcon 
  },
  { 
    name: 'Content Pieces', 
    value: '847', 
    change: '+12', 
    changeType: 'positive',
    icon: DocumentTextIcon 
  },
  { 
    name: 'Assets', 
    value: '1,209', 
    change: '+23', 
    changeType: 'positive',
    icon: PhotoIcon 
  },
  { 
    name: 'Active Users', 
    value: '156', 
    change: '-2', 
    changeType: 'negative',
    icon: UsersIcon 
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'capability',
    action: 'created',
    item: 'AI Patent Landscape Analyzer v2.1',
    user: 'John Smith',
    time: '2 hours ago',
    icon: SparklesIcon,
  },
  {
    id: 2,
    type: 'content',
    action: 'updated',
    item: 'Introduction to Patent Search',
    user: 'Sarah Johnson',
    time: '4 hours ago',
    icon: PencilSquareIcon,
  },
  {
    id: 3,
    type: 'asset',
    action: 'uploaded',
    item: 'patent-workflow-diagram.png',
    user: 'Mike Davis',
    time: '6 hours ago',
    icon: PhotoIcon,
  },
  {
    id: 4,
    type: 'workflow',
    action: 'approved',
    item: 'Prior Art Analysis Tool',
    user: 'Admin',
    time: '8 hours ago',
    icon: CheckCircleIcon,
  },
]

const contentStatus = [
  { status: 'Published', count: 42, color: 'bg-green-500' },
  { status: 'Draft', count: 18, color: 'bg-yellow-500' },
  { status: 'Under Review', count: 7, color: 'bg-blue-500' },
  { status: 'Rejected', count: 3, color: 'bg-red-500' },
]

export default function DashboardPage() {
  const { user, hasPermission } = useAuth()

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your content management system today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                System Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <ArrowUpIcon className="h-3 w-3 flex-shrink-0 self-center text-green-500" />
                        ) : (
                          <ArrowDownIcon className="h-3 w-3 flex-shrink-0 self-center text-red-500" />
                        )}
                        <span className="sr-only">
                          {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 ? (
                        <span
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div>
                          <div className="relative px-1">
                            <div className="h-8 w-8 bg-gray-100 rounded-full ring-8 ring-white flex items-center justify-center">
                              <activity.icon className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">
                                {activity.user}
                              </span>{' '}
                              <span className="text-gray-500">
                                {activity.action} {activity.type}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {activity.item}
                            </p>
                            <div className="mt-2 text-sm text-gray-500">
                              <time>{activity.time}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Content Status */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Content Status
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {contentStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${status.color} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-900">
                      {status.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{status.count}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">Total Content</span>
                <span className="text-gray-500">
                  {contentStatus.reduce((sum, status) => sum + status.count, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg hover:bg-gray-100">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-600 ring-4 ring-white">
                  <SparklesIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  New Capability
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create a new capability card with AI assistance
                </p>
              </div>
            </button>

            <button className="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg hover:bg-gray-100">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                  <DocumentTextIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  New Content
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Write new content with AI writing assistant
                </p>
              </div>
            </button>

            <button className="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg hover:bg-gray-100">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                  <PhotoIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Upload Assets
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Upload and manage digital assets
                </p>
              </div>
            </button>

            {hasPermission('view_analytics') && (
              <button className="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg hover:bg-gray-100">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-600 ring-4 ring-white">
                    <ChartBarIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    View Analytics
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Analyze content performance and usage
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}