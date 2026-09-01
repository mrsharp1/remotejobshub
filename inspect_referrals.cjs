require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

async function run() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'test_admin_temp@example.com', 
    password: 'Password123!'
  })
  
  if (authErr) {
    console.log("Could not login", authErr)
    return
  }
  
  const { data: referrals, error: refErr } = await supabase
    .from('referrals')
    .select(`
      id,
      referrer_id,
      referred_id,
      status,
      reward_amount,
      transaction_id,
      created_at,
      referrer:profiles!referrer_id(email),
      referred:profiles!referred_id(email)
    `)
    
  console.log("Referrals:", JSON.stringify(referrals, null, 2))
  
  const { data: txs, error: txsErr } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('type', 'referral_reward')
    
  console.log("Referral Txs:", JSON.stringify(txs, null, 2))
}
run()
