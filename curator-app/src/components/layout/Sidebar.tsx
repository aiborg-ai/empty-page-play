'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/providers'
import {
  HomeIcon,
  DocumentTextIcon,
  PhotoIcon,
  UsersIcon,
  ChartBarIcon,
  SparklesIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Capabilities', href: '/dashboard/capabilities', icon: SparklesIcon },
  { name: 'Content', href: '/dashboard/content', icon: DocumentTextIcon },
  { name: 'Assets', href: '/dashboard/assets', icon: PhotoIcon },
  { name: 'Templates', href: '/dashboard/templates', icon: ClipboardDocumentListIcon },
  { name: 'Workflows', href: '/dashboard/workflows', icon: FolderIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, signOut, hasPermission } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Filter navigation based on user permissions
  const filteredNavigation = navigation.filter(item => {
    switch (item.name) {
      case 'Users':
        return hasPermission('manage_users')
      case 'Settings':
        return hasPermission('manage_settings')
      case 'Analytics':
        return hasPermission('view_analytics')
      default:
        return true
    }
  })

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">InnoSpot</h1>
              <p className="text-sm text-primary-600 font-medium">Curator</p>
            </div>
          </div>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/dashboard' && pathname?.startsWith(item.href))
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            isActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-primary-700'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>

          {/* User profile section */}
          <div className="mt-auto">
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500">Curator</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-3 w-full text-left px-2 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Sign out
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}