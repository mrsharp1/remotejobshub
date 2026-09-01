const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://pgcxvpdohwhcvseloxpi.supabase.co';
const supabaseKey = 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('coupon_redemptions').select('*').limit(1);
  console.log('Error:', error);
}

test();
