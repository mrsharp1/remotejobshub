import React from 'react'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { AppRoutes } from '@/routes/AppRoutes'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Toaster } from 'sonner'
import { SocialProofToast } from '@/components/marketplace/conversion/SocialProofToast'
import { GlobalEventHooks } from '@/lib/events/GlobalEventHooks'

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              closeButton
              toastOptions={{
                className:
                  'rounded-xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-xl dark:bg-slate-900/80 font-body text-foreground',
                classNames: {
                  toast:
                    'rounded-xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-xl dark:bg-slate-900/80',
                  title: 'text-foreground font-bold font-heading',
                  description: 'text-muted-foreground text-xs',
                  success: 'text-emerald-600 dark:text-emerald-400',
                  error: 'text-destructive dark:text-rose-400',
                  warning: 'text-amber-600 dark:text-amber-400',
                  info: 'text-primary dark:text-blue-400',
                },
              }}
            />
            <SocialProofToast />
            <GlobalEventHooks />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}
export default App
