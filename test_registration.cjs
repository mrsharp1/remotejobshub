require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function run() {
  console.log("Creating user A (referrer)...")
  const emailA = `referrer_${Date.now()}@example.com`
  const { data: userAData, error: userAErr } = await supabase.auth.signUp({ email: emailA, password: 'Password123!', options: { data: { full_name: 'Referrer A' } } })
  
  if (userAErr) { console.error("Error creating user A:", userAErr); return; }
  
  // get user A's referral code
  const { data: profileA } = await supabase.from('profiles').select('id, referral_code').eq('id', userAData.user.id).single()
  console.log("User A Profile:", profileA)
  
  console.log("\nCreating user B (referred)...")
  const emailB = `referred_${Date.now()}@example.com`
  const { data: userBData, error: userBErr } = await supabase.auth.signUp({ email: emailB, password: 'Password123!', options: { data: { full_name: 'Referred B' } } })
  
  if (userBErr) { console.error("Error creating user B:", userBErr); return; }

  // We need to use userB's session to call the RPC since it checks auth.uid()!
  const supabaseB = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${userBData.session.access_token}`
      }
    }
  })

  // call rpc
  console.log("Calling rpc for B with A's code...")
  const { data: rpcData, error: rpcErr } = await supabaseB.rpc('rpc_register_user_with_referral', {
    p_referred_id: userBData.user.id,
    p_referral_code: profileA.referral_code
  })
  
  console.log("RPC result:", rpcData, rpcErr?.message || "No error")
  
  console.log("\nChecking referrals table (from B's perspective)...")
  const { data: refsB } = await supabaseB.from('referrals').select('*').eq('referred_id', userBData.user.id)
  console.log("Referrals for B:", refsB)

  console.log("\nTesting Duplicate...")
  const { data: rpcDupData, error: rpcDupErr } = await supabaseB.rpc('rpc_register_user_with_referral', {
    p_referred_id: userBData.user.id,
    p_referral_code: profileA.referral_code
  })
  console.log("Duplicate RPC result:", rpcDupData, rpcDupErr?.message || "No error")
  const { data: refsBDup } = await supabaseB.from('referrals').select('*').eq('referred_id', userBData.user.id)
  console.log("Referrals for B after duplicate:", refsBDup)
  
  console.log("\nTesting Self-Referral (A refers A)...")
  const supabaseA = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${userAData.session.access_token}`
      }
    }
  })
  const { data: rpcSelf, error: rpcSelfErr } = await supabaseA.rpc('rpc_register_user_with_referral', {
    p_referred_id: userAData.user.id,
    p_referral_code: profileA.referral_code
  })
  console.log("Self-Referral result:", rpcSelf, rpcSelfErr?.message || "No error")
  const { data: refsA } = await supabaseA.from('referrals').select('*').eq('referred_id', userAData.user.id)
  console.log("Referrals for A:", refsA)
}
run()
