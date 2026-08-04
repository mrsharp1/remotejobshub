import React from 'react'
import { renderToString } from 'react-dom/server'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn()
}))

import { AdminWalletsPage } from './src/pages/admin/AdminWalletsPage'

const queryClient = new QueryClient()

useQuery.mockImplementation(() => ({
  data: [
    {
      id: '123',
      user_id: 'abc',
      available_balance: 100,
      escrow_balance: 50,
      pending_balance: 0,
      profile: [{ full_name: 'test', email: 'test@test.com' }] // ARRAY!
    }
  ],
  isLoading: false
}))

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
