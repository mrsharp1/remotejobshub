require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

async function run() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  const { data, error } = await supabase.auth.signUp({
    email: 'test_admin_temp@example.com',
    password: 'Password123!'
  })
  console.log("Registered:", error || "Success")
}
run()
