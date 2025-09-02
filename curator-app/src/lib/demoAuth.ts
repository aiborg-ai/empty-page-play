// Demo authentication system for Curator app
export interface DemoUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'content_manager' | 'content_creator' | 'reviewer'
  name: string
  avatar?: string
}

export const DEMO_USERS: Record<string, { password: string; user: DemoUser }> = {
  'admin@curator.com': {
    password: 'curator123',
    user: {
      id: 'demo-admin-1',
      email: 'admin@curator.com',
      role: 'super_admin',
      name: 'Super Admin'
    }
  },
  'manager@curator.com': {
    password: 'curator123',
    user: {
      id: 'demo-manager-1',
      email: 'manager@curator.com',
      role: 'content_manager',
      name: 'Content Manager'
    }
  },
  'creator@curator.com': {
    password: 'curator123',
    user: {
      id: 'demo-creator-1',
      email: 'creator@curator.com',
      role: 'content_creator',
      name: 'Content Creator'
    }
  }
}

export const authenticateDemo = (email: string, password: string): DemoUser | null => {
  const account = DEMO_USERS[email]
  if (!account || account.password !== password) {
    return null
  }
  return account.user
}

export const isDemoUser = (email: string): boolean => {
  return email in DEMO_USERS
}

// Permission mapping for demo users
export const getDemoPermissions = (role: string): string[] => {
  const permissions: Record<string, string[]> = {
    super_admin: ['*'], // All permissions
    admin: [
      'manage_content',
      'manage_users',
      'manage_settings',
      'view_analytics',
      'manage_capabilities',
      'manage_assets',
      'manage_workflows'
    ],
    content_manager: [
      'manage_content',
      'view_analytics',
      'manage_capabilities',
      'manage_assets',
      'create_content',
      'edit_content',
      'approve_content'
    ],
    content_creator: [
      'create_content',
      'edit_own_content',
      'manage_assets',
      'view_capabilities'
    ],
    reviewer: [
      'review_content',
      'approve_content',
      'view_capabilities',
      'view_analytics'
    ]
  }
  
  return permissions[role] || []
}