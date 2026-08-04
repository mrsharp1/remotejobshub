import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase
    .from('wallets')
    .select('*, profile:profiles(*)')
    
  console.log('Error:', error)
  console.log('Data[0]:', data?.[0])
}

test()
