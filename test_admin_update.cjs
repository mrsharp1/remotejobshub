require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

async function run() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  
  // 1. Create a fake admin user
  const ts = Date.now()
  const adminEmail = `admin_${ts}@example.com`
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: adminEmail,
    password: 'Password123!'
  })
  
  if (authErr) {
    console.error("Auth error:", authErr)
    return
  }
  
  // 2. We need service role to make them an admin
  const serviceClient = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)
  
  // Let's just bypass by using an RPC to execute SQL if we can... wait we can't.
  // Instead, let's just log what `updateAdminSettings()` does exactly.
  
  const { data: selectData, error: selectErr } = await supabase
    .from('referral_settings')
    .select('id')
    .limit(1)
    .maybeSingle()
    
  console.log("Anon Select Data:", selectData, selectErr)
  
  if (selectData) {
    const { data: updateData, error: updateErr } = await supabase
      .from('referral_settings')
      .update({ reward_amount: 1500, updated_at: new Date().toISOString() })
      .eq('id', selectData.id)
      .select()
    console.log("Anon Update Data:", updateData, "Error:", updateErr)
  }
}
run()
