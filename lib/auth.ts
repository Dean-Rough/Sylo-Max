import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import type { User } from '@/types'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth utilities
export async function getSession(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return { user: null, error: 'No token provided' }
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return { user: null, error: 'Invalid token' }
    }

    // Get full user data with firm info
    const fullUser = await db.getUserByEmail(user.email!)
    
    if (!fullUser) {
      return { user: null, error: 'User not found in database' }
    }

    return { user: fullUser, error: null }
  } catch (error) {
    console.error('Auth error:', error)
    return { user: null, error: 'Authentication failed' }
  }
}

export async function requireAuth(request: NextRequest): Promise<User> {
  const { user, error } = await getSession(request)
  
  if (!user || error) {
    throw new Error(error || 'Authentication required')
  }
  
  return user
}

export async function requireRole(request: NextRequest, allowedRoles: string[]): Promise<User> {
  const user = await requireAuth(request)
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return user
}

// Firm-based data isolation middleware
export async function requireFirmAccess(request: NextRequest, firmId: string): Promise<User> {
  const user = await requireAuth(request)
  
  if (user.firmId !== firmId) {
    throw new Error('Access denied to firm data')
  }
  
  return user
}

// Sign up new user with firm association
export async function signUpUser(email: string, password: string, firmId: string, userData: {
  firstName: string
  lastName: string
  role: string
}) {
  try {
    // Create auth user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role
        }
      }
    })

    if (error) {
      return { user: null, error: error.message }
    }

    if (!data.user) {
      return { user: null, error: 'Failed to create user' }
    }

    // Create user record in database
    const dbUser = await db.prisma.user.create({
      data: {
        firmId,
        supabaseUserId: data.user.id,
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
      },
      include: {
        firm: {
          select: { id: true, name: true, slug: true, subscriptionTier: true }
        }
      }
    })

    return { user: dbUser, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { user: null, error: 'Failed to create user account' }
  }
}

// Sign in user
export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { user: null, session: null, error: error.message }
    }

    // Get full user data
    const fullUser = await db.getUserByEmail(email)
    
    return { 
      user: fullUser, 
      session: data.session, 
      error: null 
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return { user: null, session: null, error: 'Failed to sign in' }
  }
}

// Sign out user
export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut()
    return { error: error?.message || null }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error: 'Failed to sign out' }
  }
}

// Password reset
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    })
    
    return { error: error?.message || null }
  } catch (error) {
    console.error('Password reset error:', error)
    return { error: 'Failed to send password reset email' }
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    return { error: error?.message || null }
  } catch (error) {
    console.error('Password update error:', error)
    return { error: 'Failed to update password' }
  }
}

// Get current session
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error: error?.message || null }
  } catch (error) {
    console.error('Get session error:', error)
    return { session: null, error: 'Failed to get session' }
  }
}