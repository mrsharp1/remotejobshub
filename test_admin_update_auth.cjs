require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

async function run() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@remotejobshub.com', 
    password: 'Password123!'
  })
  
  if (authErr) {
    console.error("Auth error:", authErr)
    return
  }
  console.log("Logged in as:", authData.user.id)
  
  // Verify admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single()
  console.log("Role:", profile?.role)
  
  const { data: selectData, error: selectErr } = await supabase
    .from('referral_settings')
    .select('id')
    .limit(1)
    .maybeSingle()
    
  console.log("Select Data:", selectData, selectErr)
  
  if (selectData) {
    const { data: updateData, error: updateErr } = await supabase
      .from('referral_settings')
      .update({ reward_amount: 1500, updated_at: new Date().toISOString() })
      .eq('id', selectData.id)
      .select()
    console.log("Update Data:", updateData, "Error:", updateErr)
  }
}
run()
