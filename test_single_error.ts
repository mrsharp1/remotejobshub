import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const envFile = fs.readFileSync('.env', 'utf8')
const envConfig: any = {}
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envConfig[match[1]] = match[2].trim()
  }
})

const supabaseUrl = envConfig['VITE_SUPABASE_URL'] || ''
const supabaseKey = envConfig['VITE_SUPABASE_ANON_KEY'] || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { error } = await supabase
    .from('payments')
    .update({ payment_status: 'released' })
    .eq('id', '00000000-0000-0000-0000-000000000000')
    .select()
    .single()
    
  console.log('Error object:', JSON.stringify(error, null, 2))
}
run()
