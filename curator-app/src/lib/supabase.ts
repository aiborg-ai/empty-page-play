import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper function to check if user has admin privileges
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()
    
    return ['admin', 'super_admin'].includes(user?.role || '')
  } catch {
    return false
  }
}

// Helper function to get user permissions
export const getUserPermissions = async (userId: string): Promise<string[]> => {
  try {
    const { data: roles } = await supabase
      .from('user_curator_roles')
      .select(`
        curator_roles (
          name,
          permissions
        )
      `)
      .eq('user_id', userId)
    
    const permissions = new Set<string>()
    
    roles?.forEach((role: any) => {
      const rolePermissions = role.curator_roles?.permissions || []
      rolePermissions.forEach((perm: string) => permissions.add(perm))
    })
    
    return Array.from(permissions)
  } catch {
    return []
  }
}