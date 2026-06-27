import React from 'react'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { AppRoutes } from '@/routes/AppRoutes'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}
export default App