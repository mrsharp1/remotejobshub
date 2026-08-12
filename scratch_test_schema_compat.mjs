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

async function testSchemaCompatibility() {
  console.log('Testing cms_written_reviews...');
  const writtenDummy = {
    id: '00000000-0000-0000-0000-000000000000',
    customer_name: 'Test',
    country: 'Test',
    platform_purchased: 'Test',
    rating: 5,
    title: 'Test',
    body: 'Test',
    avatar: 'Test',
    verified: true,
    is_featured: false,
    show_on_homepage: true,
    show_on_marketplace: true,
    show_on_community: true,
    show_on_about: true,
    show_on_seller_profile: true
  };
  
  const wRes = await supabase.from('cms_written_reviews').insert([writtenDummy]).select();
  if (wRes.error) {
    console.log('cms_written_reviews error:', JSON.stringify(wRes.error, null, 2));
  } else {
    console.log('cms_written_reviews compatible! Cleaning up...');
    await supabase.from('cms_written_reviews').delete().eq('id', '00000000-0000-0000-0000-000000000000');
  }

  console.log('\nTesting cms_video_testimonials...');
  const videoDummy = {
    id: '00000000-0000-0000-0000-000000000000',
    video_url: 'Test',
    thumbnail: 'Test',
    customer_name: 'Test',
    country: 'Test',
    rating: 5,
    summary: 'Test',
    duration: 'Test',
    display_order: 0,
    is_featured: false,
    show_on_homepage: true,
    show_on_marketplace: true,
    show_on_community: true,
    show_on_about: true,
    show_on_seller_profile: true
  };

  const vRes = await supabase.from('cms_video_testimonials').insert([videoDummy]).select();
  if (vRes.error) {
    console.log('cms_video_testimonials error:', JSON.stringify(vRes.error, null, 2));
  } else {
    console.log('cms_video_testimonials compatible! Cleaning up...');
    await supabase.from('cms_video_testimonials').delete().eq('id', '00000000-0000-0000-0000-000000000000');
  }
}

testSchemaCompatibility();
