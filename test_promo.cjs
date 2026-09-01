const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://pgcxvpdohwhcvseloxpi.supabase.co';
const supabaseKey = 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('promotions').insert([{
    title: 'test',
    discount_type: 'fixed',
    discount_value: 200,
    campaign_type: 'seasonal',
    starts_at: new Date().toISOString(),
    ends_at: new Date().toISOString(),
    is_active: true,
  }]);
  console.log('Error:', error);
}

test();
