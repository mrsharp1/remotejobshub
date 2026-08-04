
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://pgcxvpdohwhcvseloxpi.supabase.co', 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L')
async function run() {
  const { data, error } = await supabase.rpc('process_paystack_deposit', {
    p_user_id: 'db333e9e-8aca-4120-bfe8-428551ea18e4',
    p_amount: 1000,
    p_reference: 'debug-test-reference'
  })
  console.log('DATA:', JSON.stringify(data, null, 2))
  console.log('ERROR:', JSON.stringify(error, null, 2))
}
run()

