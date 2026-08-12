const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://pgcxvpdohwhcvseloxpi.supabase.co', 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L');

async function check() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Last order:', JSON.stringify(data, null, 2));
  }
}

check().catch(console.error);
