import React, { createContext, useContext, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { Profile } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/auth/auth.service'
import { LoadingScreen } from '@/components/shared/LoadingScreen'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    user,
    profile,
    session,
    loading,
    isAuthenticated,
    setAuth,
    setProfile,
    setLoading,
    clearAuth,
  } = useAuthStore()

  useEffect(() => {
    let isMounted = true

    const { subscription } = authService.onAuthStateChange(async (_event, currentSession) => {
      try {
        if (currentSession?.user) {
          const fetchedProfile = await authService.getProfile(currentSession.user.id)
          if (isMounted) {
            setAuth(currentSession.user, fetchedProfile, currentSession)
          }
        } else {
          if (isMounted) {
            clearAuth()
          }
        }
      } catch (err) {
        console.error('Authentication status sync failed:', err)
        if (isMounted) {
          clearAuth()
        }
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [setAuth, clearAuth])

  const refreshProfile = async () => {
    if (user) {
      setLoading(true)
      try {
        const fetchedProfile = await authService.getProfile(user.id)
        setProfile(fetchedProfile)
      } catch (err) {
        console.error('Failed to refresh profile:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authService.signOut()
    } catch (err) {
      console.error('Failed to sign out:', err)
    } finally {
      clearAuth()
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isAuthenticated,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined)
    throw new Error('useAuth must be used within AuthProvider')
  return context
}
