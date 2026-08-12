import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pgcxvpdohwhcvseloxpi.supabase.co'
const supabaseKey = 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'listings' })
  // If rpc doesn't exist, we can't fetch it this way.
  console.log('We cannot fetch RLS policies directly without admin key.')
}
run()
