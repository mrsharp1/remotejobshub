import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function queryVerifications() {
  const { data, error } = await supabase
    .from('seller_verifications')
    .select('*, profile:user_id(full_name, phone, country), documents:verification_documents(*)')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching:', error)
    return
  }

  console.log(JSON.stringify(data, null, 2))
}

queryVerifications()
