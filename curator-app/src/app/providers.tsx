'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { authenticateDemo, isDemoUser, getDemoPermissions, type DemoUser } from '@/lib/demoAuth'

interface AuthContextType {
  user: User | DemoUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  hasPermission: (permission: string) => boolean
  userRole: string | null
  isDemoAccount: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isDemoAccount, setIsDemoAccount] = useState(false)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      // Check for demo user in localStorage first
      const storedDemoUser = localStorage.getItem('curator_demo_user')
      if (storedDemoUser) {
        try {
          const demoUser: DemoUser = JSON.parse(storedDemoUser)
          setUser(demoUser)
          setUserRole(demoUser.role)
          setIsDemoAccount(true)
          setLoading(false)
          return
        } catch (e) {
          localStorage.removeItem('curator_demo_user')
        }
      }

      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Get user role from database
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        setUserRole(profile?.role ?? null)
        setIsDemoAccount(false)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Get user role from database
          const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()
          
          setUserRole(profile?.role ?? null)
        } else {
          setUserRole(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    // Check if it's a demo account first
    if (isDemoUser(email)) {
      const demoUser = authenticateDemo(email, password)
      if (!demoUser) {
        throw new Error('Invalid demo credentials')
      }
      
      setUser(demoUser)
      setUserRole(demoUser.role)
      setIsDemoAccount(true)
      
      // Store in localStorage for persistence
      localStorage.setItem('curator_demo_user', JSON.stringify(demoUser))
      return
    }

    // Try Supabase authentication for real accounts
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (isDemoAccount) {
      // Clear demo user from localStorage
      localStorage.removeItem('curator_demo_user')
      setUser(null)
      setUserRole(null)
      setIsDemoAccount(false)
      return
    }

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false
    
    // Use demo permissions for demo accounts
    if (isDemoAccount) {
      const permissions = getDemoPermissions(userRole)
      return permissions.includes('*') || permissions.includes(permission)
    }

    // Basic permission system for Supabase users
    const rolePermissions: Record<string, string[]> = {
      super_admin: ['*'],
      admin: ['manage_content', 'manage_users', 'view_analytics'],
      content_manager: ['manage_content', 'view_analytics'],
      content_creator: ['create_content', 'edit_own_content'],
      reviewer: ['review_content', 'approve_content']
    }
    
    const permissions = rolePermissions[userRole] || []
    return permissions.includes('*') || permissions.includes(permission)
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    hasPermission,
    userRole,
    isDemoAccount
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}