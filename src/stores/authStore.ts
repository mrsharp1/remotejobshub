import { create } from 'zustand'
import { User, Session } from '@supabase/supabase-js'
import { Profile } from '@/types'

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  setAuth: (user: User | null, profile: Profile | null, session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  setAuth: (user, profile, session) => set({
    user,
    profile,
    session,
    isAuthenticated: !!user,
    loading: false
  }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  clearAuth: () => set({
    user: null,
    profile: null,
    session: null,
    isAuthenticated: false,
    loading: false
  }),
}))
