require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function run() {
  const { data, error } = await supabase.from('wallet_transactions').insert([
    { wallet_id: '00000000-0000-0000-0000-000000000000', user_id: '00000000-0000-0000-0000-000000000000', type: 'FAKE_TYPE', amount: 0, status: 'pending' }
  ])
  console.log("Insert result:", error?.message || "Success")
}
run()
