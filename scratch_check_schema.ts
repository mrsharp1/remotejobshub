import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  console.log('--- PHASE 0: DATABASE FORENSIC CHECK ---')
  
  // 1. Check cms_written_reviews
  const { data: writtenCols, error: writtenErr } = await supabase
    .from('cms_written_reviews')
    .select('*')
    .limit(1)
    
  if (writtenErr) {
    console.error('Error querying cms_written_reviews:', writtenErr.message)
  } else {
    console.log('cms_written_reviews exists. Current rows:', writtenCols?.length || 0)
    // To get exact columns, we can just insert a bad row or query postgres but we don't have direct SQL access here.
    // Instead we can use RPC or just assume if it didn't error, the table exists.
  }

  // 2. Check cms_video_testimonials
  const { data: videoCols, error: videoErr } = await supabase
    .from('cms_video_testimonials')
    .select('*')
    .limit(1)
    
  if (videoErr) {
    console.error('Error querying cms_video_testimonials:', videoErr.message)
  } else {
    console.log('cms_video_testimonials exists. Current rows:', videoCols?.length || 0)
  }

  // 3. Check storage buckets
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets()
  if (bucketsErr) {
    console.error('Error querying storage buckets:', bucketsErr.message)
  } else {
    console.log('Available buckets:', buckets?.map(b => b.name))
  }
}

checkSchema()
