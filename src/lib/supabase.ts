import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let clientUrl = supabaseUrl
let clientKey = supabaseAnonKey

// Validate URL format to prevent createClient from throwing synchronous errors
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

if (!clientUrl || !isValidUrl(clientUrl) || !clientKey) {
  console.warn(
    'Supabase credentials are missing or invalid. Falling back to dummy configuration.'
  )
  clientUrl = 'https://placeholder-project.supabase.co'
  clientKey = 'placeholder-key'
}

export const supabase = createClient(clientUrl, clientKey)
