require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

async function run() {
  const adminClient = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  
  // We need to sign in as admin or just test the table directly
  const { data: user, error: signinErr } = await adminClient.auth.signInWithPassword({
    email: 'admin@remotejobshub.com', 
    password: 'Password123!'
  })
  
  if (signinErr) {
    console.log("Could not login as admin, testing without auth");
  } else {
    console.log("Logged in as admin");
  }
  
  const { data: selectData, error: selectErr } = await adminClient
    .from('referral_settings')
    .select('id')
    .limit(1)
    .maybeSingle()
    
  console.log("Select Data:", selectData, "Select Error:", selectErr)
  
  if (selectData) {
    const { data: updateData, error: updateErr } = await adminClient
      .from('referral_settings')
      .update({ reward_amount: 1500, updated_at: new Date().toISOString() })
      .eq('id', selectData.id)
      .select()
    console.log("Update Data:", updateData, "Update Error:", updateErr)
  }
}
run()
