import { supabase } from '@/lib/supabase'
import { Profile } from '@/types'
import { Session, User } from '@supabase/supabase-js'

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) return null
      return user
    } catch (err) {
      console.error('Error in getCurrentUser:', err)
      return null
    }
  },

  async getCurrentSession(): Promise<Session | null> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) return null
      return session
    } catch (err) {
      console.error('Error in getCurrentSession:', err)
      return null
    }
  },

  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message)
        return null
      }
      return data as Profile
    } catch (err) {
      console.error('Error in getProfile:', err)
      return null
    }
  },

  async updateProfile(
    userId: string,
    profileData: Partial<Profile>
  ): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error.message)
        throw error
      }
      return data as Profile
    } catch (err) {
      console.error('Error in updateProfile:', err)
      throw err
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    } catch (err) {
      console.error('Error in signIn:', err)
      throw err
    }
  },

  async signUp(
    email: string,
    password: string,
    options?: { data?: Record<string, unknown> }
  ) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      })
      if (error) throw error
      return data
    } catch (err) {
      console.error('Error in signUp:', err)
      throw err
    }
  },

  async sendPasswordResetEmail(email: string, redirectTo?: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })
      if (error) throw error
      return data
    } catch (err) {
      console.error('Error in sendPasswordResetEmail:', err)
      throw err
    }
  },

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      console.error('Error in signOut:', err)
      throw err
    }
  },

  onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ) {
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session)
      })
      return subscription
    } catch (err) {
      console.error('Error in onAuthStateChange:', err)
      return {
        unsubscribe: () => {},
      }
    }
  },
}
