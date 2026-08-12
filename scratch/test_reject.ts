import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const envFile = fs.readFileSync('.env', 'utf-8')
let supabaseUrl = ''
let supabaseKey = ''

envFile.split('\n').forEach(line => {
  const parts = line.split('=')
  if (parts[0] === 'VITE_SUPABASE_URL') supabaseUrl = parts[1].trim()
  if (parts[0] === 'VITE_SUPABASE_SERVICE_ROLE_KEY') supabaseKey = parts[1].trim()
})

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('--- Checking Reject Listing ---')

  // Find a pending listing
  const { data: listings } = await supabase
    .from('listings')
    .select('id, title')
    .limit(1)

  if (!listings || listings.length === 0) {
    console.log('No listings found to test')
    return
  }

  const listingId = listings[0].id
  console.log('Attempting to reject listing:', listingId)

  const { data, error } = await supabase
    .from('listings')
    .update({
      approval_status: 'rejected',
      status: 'draft',
      review_notes: 'Test rejection',
      approved_by: 'some-admin-id',
      approved_at: new Date().toISOString(),
    })
    .eq('id', listingId)

  if (error) {
    console.error('SUPABASE ERROR:', error)
  } else {
    console.log('Success!', data)
  }
}

run()
