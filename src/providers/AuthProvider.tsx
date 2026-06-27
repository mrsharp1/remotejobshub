import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { useAuthStore } from '@/stores/authStore'
interface AuthContextType { isLoading: boolean; user: User | null }
const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const { user, setUser } = useAuthStore()
  useEffect(() => {
    const checkUser = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUser(null)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    checkUser()
  }, [setUser])
  return <AuthContext.Provider value={{ isLoading, user }}>{children}</AuthContext.Provider>
}
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider')
  return context
}