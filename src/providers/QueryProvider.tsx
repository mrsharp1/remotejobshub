import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
interface QueryProviderProps { children: React.ReactNode }
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 1000 * 60 * 5 } }
  }))
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}