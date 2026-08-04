
import { createClient } from '@supabase/supabase-js'
try {
  createClient('https://example.com', '')
} catch (err) {
  console.log('ERROR THROWN:', err.message)
}

