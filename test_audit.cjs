require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function run() {
  console.log("--- INITIALIZING TEST ACCOUNTS ---")
  const ts = Date.now()
  const referrerEmail = `referrer_${ts}@example.com`
  const buyerEmail = `buyer_${ts}@example.com`

  const { data: refUser } = await supabase.auth.signUp({ email: referrerEmail, password: 'Password123!' })
  const { data: refProfile } = await supabase.from('profiles').select('referral_code').eq('id', refUser.user.id).single()
  
  const { data: buyerUser } = await supabase.auth.signUp({ email: buyerEmail, password: 'Password123!' })
  const supabaseBuyer = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${buyerUser.session.access_token}` } }
  })

  console.log("\n--- TEST: VALID ATTRIBUTION ---")
  const { error: rpcErr } = await supabaseBuyer.rpc('rpc_register_user_with_referral', {
    p_referred_id: buyerUser.user.id,
    p_referral_code: refProfile.referral_code
  })
  const { data: refs } = await supabase.from('referrals').select('*').eq('referred_id', buyerUser.user.id)
  console.log("Referrals after attribution:", refs?.length === 1 ? "PASS" : "FAIL", refs)

  console.log("\n--- TEST: BELOW THRESHOLD PURCHASE ---")
  // Need to create a seller to make an order/payment?
  // We can just call rpc_process_referral_reward(p_buyer_id, p_payment_amount) directly via a test user if it's accessible?
  // Wait, rpc_process_referral_reward is SECURITY DEFINER but can a user call it? Let's check its permissions or just test calling it.
  
  const { data: processBelow, error: errBelow } = await supabaseBuyer.rpc('rpc_process_referral_reward', {
    p_buyer_id: buyerUser.user.id,
    p_payment_amount: 1000 // Minimum is 5000
  })
  console.log("Process below threshold returned:", errBelow?.message || "Success")
  
  const { data: refsAfterBelow } = await supabase.from('referrals').select('status').eq('referred_id', buyerUser.user.id).single()
  console.log("Status after below threshold:", refsAfterBelow?.status === 'pending' ? "PASS (pending)" : "FAIL", refsAfterBelow?.status)

  console.log("\n--- TEST: QUALIFYING PURCHASE ---")
  const { data: processAbove, error: errAbove } = await supabaseBuyer.rpc('rpc_process_referral_reward', {
    p_buyer_id: buyerUser.user.id,
    p_payment_amount: 6000 // Above 5000
  })
  console.log("Process above threshold returned:", errAbove?.message || "Success")
  
  const { data: refsAfterAbove } = await supabase.from('referrals').select('status').eq('referred_id', buyerUser.user.id).single()
  console.log("Status after qualifying purchase:", refsAfterAbove?.status === 'paid' ? "PASS (paid)" : "FAIL", refsAfterAbove?.status)
  
  // Check wallet
  const { data: refWallet } = await supabase.from('wallets').select('*').eq('profile_id', refUser.user.id).single()
  console.log("Referrer Wallet Balance:", refWallet?.available_balance)
  
  console.log("\n--- TEST: REPEATED ESCROW (IDEMPOTENCY) ---")
  const { error: errRepeat } = await supabaseBuyer.rpc('rpc_process_referral_reward', {
    p_buyer_id: buyerUser.user.id,
    p_payment_amount: 8000
  })
  console.log("Process repeat returned:", errRepeat?.message || "Success")
  
  const { data: refWallet2 } = await supabase.from('wallets').select('*').eq('profile_id', refUser.user.id).single()
  console.log("Referrer Wallet Balance after repeat:", refWallet2?.available_balance === refWallet?.available_balance ? "PASS (Unchanged)" : "FAIL (Changed)", refWallet2?.available_balance)
}
run()
