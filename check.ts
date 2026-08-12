import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Fetching reviews...')
  const { data, error } = await supabase.from('reviews').select('order_id')
  if (error) {
    console.error('Error:', error)
    return
  }
  
  const counts: Record<string, number> = {}
  data?.forEach(d => {
    counts[d.order_id] = (counts[d.order_id] || 0) + 1
  })
  
  const duplicates = Object.entries(counts).filter(([_, c]) => c > 1)
  
  if (duplicates.length > 0) {
    console.log('FOUND DUPLICATES:', duplicates)
  } else {
    console.log('No duplicates found. Safe to proceed.')
  }
}

run()
