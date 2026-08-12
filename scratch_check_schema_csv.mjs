import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '';
let supabaseKey = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

async function getCsvHeader() {
  const writtenRes = await fetch(`${supabaseUrl}/rest/v1/cms_written_reviews?limit=1`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Accept': 'text/csv'
    }
  });
  console.log('cms_written_reviews CSV:', await writtenRes.text());
  
  const videoRes = await fetch(`${supabaseUrl}/rest/v1/cms_video_testimonials?limit=1`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Accept': 'text/csv'
    }
  });
  console.log('cms_video_testimonials CSV:', await videoRes.text());
}

getCsvHeader().catch(console.error);
