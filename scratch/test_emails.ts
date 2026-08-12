import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pgcxvpdohwhcvseloxpi.supabase.co'
const supabaseKey = 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data } = await supabase.from('profiles').select('email, role')
  console.log(data)
}
run()
