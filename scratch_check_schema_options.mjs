import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '';
let supabaseKey = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

async function getOptions() {
  const writtenRes = await fetch(`${supabaseUrl}/rest/v1/cms_written_reviews`, {
    method: 'OPTIONS',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  console.log('cms_written_reviews OPTIONS headers:', Array.from(writtenRes.headers.entries()));
  
  const videoRes = await fetch(`${supabaseUrl}/rest/v1/cms_video_testimonials`, {
    method: 'OPTIONS',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  console.log('cms_video_testimonials OPTIONS headers:', Array.from(videoRes.headers.entries()));
}

getOptions().catch(console.error);
