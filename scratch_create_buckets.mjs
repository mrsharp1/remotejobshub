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

async function createBuckets() {
  console.log('Ensuring buckets exist...');
  
  const { data: vBucket, error: vErr } = await supabase.storage.createBucket('testimonials-videos', {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/webm']
  });
  if (vErr && vErr.message !== 'The resource already exists') {
    console.error('Error creating testimonials-videos:', vErr);
  } else {
    console.log('testimonials-videos ready.');
  }

  const { data: tBucket, error: tErr } = await supabase.storage.createBucket('testimonials-thumbnails', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
  if (tErr && tErr.message !== 'The resource already exists') {
    console.error('Error creating testimonials-thumbnails:', tErr);
  } else {
    console.log('testimonials-thumbnails ready.');
  }
}

createBuckets();
