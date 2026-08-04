
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://pgcxvpdohwhcvseloxpi.supabase.co', 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L')
async function run() {
  console.log('Invoking paystack-verify...')
  const { data, error } = await supabase.functions.invoke('paystack-verify', {
    body: { reference: 'dummy-reference' },
  })
  console.log('DATA:', JSON.stringify(data, null, 2))
  console.log('ERROR:', JSON.stringify(error, null, 2))
}
run()

