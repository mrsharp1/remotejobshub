import React from 'react'
import { renderToString } from 'react-dom/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminWalletsPage } from './src/pages/admin/AdminWalletsPage'

const queryClient = new QueryClient()

try {
  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <AdminWalletsPage />
    </QueryClientProvider>
  )
  console.log("RENDER SUCCESS!")
} catch (e) {
  console.log("RENDER CRASHED!")
  console.error(e)
}
