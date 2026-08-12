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
  const { data, error } = await supabase
    .from('cms_written_reviews')
    .insert([{ non_existent_column: 1 }])
    .select();
    
  console.log('cms_written_reviews insert error:', error);

  const { data: vData, error: vError } = await supabase
    .from('cms_video_testimonials')
    .insert([{ non_existent_column: 1 }])
    .select();
    
  console.log('cms_video_testimonials insert error:', vError);
}

checkSchema();
