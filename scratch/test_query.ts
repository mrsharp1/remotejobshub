import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pgcxvpdohwhcvseloxpi.supabase.co'
const supabaseKey = 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching listings:', error)
    return
  }

  console.log('Most recent listings:')
  data.forEach((l, i) => {
    console.log(`\n--- Listing ${i + 1} ---`)
    console.log(`ID: ${l.id}`)
    console.log(`Seller ID: ${l.seller_id}`)
    console.log(`Title: ${l.title}`)
    console.log(`Status: ${l.status}`)
    console.log(`Approval Status: ${l.approval_status}`)
    console.log(`Created At: ${l.created_at}`)
    console.log(`Reason for Sale: ${l.reason_for_sale}`)
  })
}

run()
