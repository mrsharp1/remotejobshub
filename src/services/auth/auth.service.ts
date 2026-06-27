import { supabase } from '@/lib/supabase'
import { Profile } from '@/types'
import { Session, User } from '@supabase/supabase-js'

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return null
    return user
  },

  async getCurrentSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) return null
    return session
  },

  async getProfile(userId: string): Promise<Profile | null> {
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
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session)
      }
    )
    return subscription
  }
}
