import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '';
let supabaseKey = ''; // this will be the ANON KEY

envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('TEST A - DATABASE');
  
  // Actually, Test A just asks if they exist and count. Test B uses anon key for SELECT.
  // We can do both at the same time using the anon key.
  
  const wRes = await supabase.from('cms_written_reviews').select('*', { count: 'exact' });
  if (wRes.error) {
    console.log('cms_written_reviews: FAIL', wRes.error.message);
  } else {
    console.log(`cms_written_reviews: EXISTS (Rows: ${wRes.data.length})`);
  }

  const vRes = await supabase.from('cms_video_testimonials').select('*', { count: 'exact' });
  if (vRes.error) {
    console.log('cms_video_testimonials: FAIL', vRes.error.message);
  } else {
    console.log(`cms_video_testimonials: EXISTS (Rows: ${vRes.data.length})`);
  }
}

runTests();
