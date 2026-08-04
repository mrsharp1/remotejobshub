import { create } from 'zustand'
import { User, Session } from '@supabase/supabase-js'
import { Profile } from '@/types'

export interface SandboxSession {
  enabled: boolean
  role: 'buyer' | 'seller' | 'admin'
  kycStatus?: 'not_started' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_more_info'
}

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  sandboxSession: SandboxSession
  setAuth: (
    user: User | null,
    profile: Profile | null,
    session: Session | null
  ) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setSandboxSession: (sandboxSession: SandboxSession) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  sandboxSession: {
    enabled: false,
    role: 'buyer',
    kycStatus: 'not_started',
  },
  setAuth: (user, profile, session) =>
    set({
      user,
      profile,
      session,
      isAuthenticated: !!user,
      loading: false,
    }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setSandboxSession: (sandboxSession) => set({ sandboxSession }),
  clearAuth: () =>
    set({
      user: null,
      profile: null,
      session: null,
      isAuthenticated: false,
      loading: false,
      sandboxSession: {
        enabled: false,
        role: 'buyer',
        kycStatus: 'not_started',
      },
    }),
}))
