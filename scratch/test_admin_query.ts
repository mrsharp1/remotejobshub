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
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching listings:', error)
    return
  }

  console.log('Most recent listings:')
  data.forEach((l, i) => {
    console.log(`\n--- Listing ${i + 1} ---`)
    console.log(`ID: ${l.id}`)
    console.log(`Title: ${l.title}`)
    console.log(`Status: ${l.status}`)
    console.log(`Approval Status: ${l.approval_status}`)
    console.log(`Created At: ${l.created_at}`)
  })
}

run()
