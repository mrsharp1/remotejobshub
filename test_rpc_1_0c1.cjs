require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function run() {
  console.log('--- 1. VERIFY RPC ---')
  const { data: rpcData, error: rpcErr } = await supabase.rpc('rpc_register_user_with_referral', {
    p_referred_id: '00000000-0000-0000-0000-000000000000',
    p_referral_code: 'HUB-NOTREAL'
  })
  console.log('RPC Call (Anon):', rpcData, rpcErr?.message || rpcErr?.details || 'No error')
  
  console.log('\n--- 2. VERIFY REFERRALS TABLE SECURITY ---')
  const { data: refData, error: refErr } = await supabase.from('referrals').select('*').limit(1)
  console.log('Select Referrals (Anon):', refData, refErr?.message || 'No error')
  
  const { data: refInsData, error: refInsErr } = await supabase.from('referrals').insert([
    { referrer_id: '00000000-0000-0000-0000-000000000000', referred_id: '00000000-0000-0000-0000-000000000001', referral_code: 'FAKE', status: 'pending' }
  ])
  console.log('Insert Referrals (Anon):', refInsErr?.message || 'No error')

  const { data: refUpData, error: refUpErr } = await supabase.from('referrals').update({ status: 'paid' }).eq('referral_code', 'FAKE')
  console.log('Update Referrals (Anon):', refUpErr?.message || 'No error')

  console.log('\n--- 6. VERIFY REWARD FOUNDATION ---')
  const { data: setData, error: setErr } = await supabase.from('referral_settings').select('*').limit(1)
  console.log('Referral Settings:', setData, setErr?.message || 'No error')
}
run()
