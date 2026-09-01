const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://pgcxvpdohwhcvseloxpi.supabase.co';
const supabaseKey = 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('coupons').insert([{
    code: 'TAKE20',
    discount_type: 'fixed',
    discount_value: 200,
    usage_limit: 5,
    usage_count: 5,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  }]);
  console.log('Error:', error);
}

test();
