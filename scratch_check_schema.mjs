import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '';
let supabaseKey = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_SERVICE_ROLE_KEY=')) supabaseKey = line.split('=')[1].trim();
});

if (!supabaseKey) {
  envFile.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  });
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('--- PHASE 0: DATABASE FORENSIC CHECK ---');
  
  // 1. Check cms_written_reviews
  const { data: writtenCols, error: writtenErr } = await supabase
    .from('cms_written_reviews')
    .select('*')
    .limit(1);
    
  if (writtenErr) {
    console.error('Error querying cms_written_reviews:', writtenErr.message);
  } else {
    console.log('cms_written_reviews exists. Current rows:', writtenCols?.length || 0);
  }

  // 2. Check cms_video_testimonials
  const { data: videoCols, error: videoErr } = await supabase
    .from('cms_video_testimonials')
    .select('*')
    .limit(1);
    
  if (videoErr) {
    console.error('Error querying cms_video_testimonials:', videoErr.message);
  } else {
    console.log('cms_video_testimonials exists. Current rows:', videoCols?.length || 0);
  }

  // 3. Check storage buckets
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
  if (bucketsErr) {
    console.error('Error querying storage buckets:', bucketsErr.message);
  } else {
    console.log('Available buckets:', buckets?.map(b => b.name));
  }
}

checkSchema();
