const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRpc() {
  console.log('Testing RPC existence (with anon key)...');
  const { data, error } = await supabase.rpc('rpc_redeem_coupon_to_wallet', { p_coupon_code: 'TESTCOUPON' });
  if (error) {
    console.error('RPC Error:', error.message, error.details, error.hint);
  } else {
    console.log('RPC Response:', data);
  }
}
testRpc();
