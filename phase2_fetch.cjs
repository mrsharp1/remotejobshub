require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

async function run() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  
  await supabase.auth.signInWithPassword({
    email: 'test_admin_temp@example.com', 
    password: 'Password123!'
  })

  const OID = 'cf7db003-e8b4-45d5-8604-d53e33530a63'
  
  const { data: order } = await supabase.from('orders').select('*').eq('id', OID).single()
  const { data: payment } = await supabase.from('payments').select('*').eq('order_id', OID).single()
  
  if (!order) return console.log("Order not found");

  const { data: buyerWallet } = await supabase.from('wallets').select('*').eq('user_id', order.buyer_id).single()
  const { data: sellerWallet } = await supabase.from('wallets').select('*').eq('user_id', order.seller_id).single()
  
  const { data: buyerTxs } = await supabase.from('wallet_transactions').select('*').eq('wallet_id', buyerWallet.id).like('payment_reference', '%CF7DB003%')
  const { data: sellerTxs } = await supabase.from('wallet_transactions').select('*').eq('wallet_id', sellerWallet.id).like('payment_reference', '%CF7DB003%')
  
  const { data: disputes } = await supabase.from('disputes').select('*').eq('order_id', OID)
  const { data: timeline } = await supabase.from('order_timeline').select('*').eq('order_id', OID).order('created_at')

  const { data: referrals } = await supabase.from('referrals').select('*').eq('referred_user_id', order.buyer_id)
  
  console.log(JSON.stringify({
    order, payment, buyerWallet, sellerWallet, buyerTxs, sellerTxs, disputes, timeline, referrals
  }, null, 2))
}
run()
