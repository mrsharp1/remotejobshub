require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function run() {
  const emailC = `userc_${Date.now()}@example.com`
  const { data: userCData } = await supabase.auth.signUp({ email: emailC, password: 'Password123!' })
  
  const supabaseC = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${userCData.session.access_token}` } }
  })
  
  console.log("3. insert directly into public.referrals")
  const { error: insErr } = await supabaseC.from('referrals').insert([
    { referrer_id: userCData.user.id, referred_id: userCData.user.id, referral_code: 'FAKE', status: 'pending' }
  ])
  console.log("Insert result:", insErr?.message || "No error (FAIL!)")
  
  console.log("4. modify an existing referral")
  const { error: upErr } = await supabaseC.from('referrals').update({ status: 'paid' }).eq('referred_id', userCData.user.id)
  console.log("Update result:", upErr?.message || "No error (FAIL!)")

  console.log("6. invoke the RPC for another user")
  const emailD = `userd_${Date.now()}@example.com`
  const { data: userDData } = await supabase.auth.signUp({ email: emailD, password: 'Password123!' })

  const { data: rpcOther, error: rpcOtherErr } = await supabaseC.rpc('rpc_register_user_with_referral', {
    p_referred_id: userDData.user.id,
    p_referral_code: 'HUB-NOTREAL'
  })
  console.log("RPC for other user:", rpcOther, rpcOtherErr?.message || "No error")
  const { data: refsD } = await supabase.from('referrals').select('*').eq('referred_id', userDData.user.id)
  console.log("Did row insert?", refsD?.length > 0 ? "Yes (FAIL)" : "No (PASS)")
}
run()
