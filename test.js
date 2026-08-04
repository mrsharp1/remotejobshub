
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://pgcxvpdohwhcvseloxpi.supabase.co', 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L')
async function run() {
  console.log('Invoking paystack-init...')
  const { data, error } = await supabase.functions.invoke('paystack-init', {
    body: { amount: 5000, callbackUrl: 'http://localhost' },
  })
  console.log('DATA:', JSON.stringify(data, null, 2))
  console.log('ERROR:', JSON.stringify(error, null, 2))
}
run()

