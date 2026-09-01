require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

async function run() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  
  await supabase.auth.signInWithPassword({
    email: 'test_admin_temp@example.com', 
    password: 'Password123!'
  })

  const OID = 'cf7db003-e8b4-45d5-8604-d53e33530a63'
  
  const { data: order } = await supabase.from('orders').select('buyer_id, seller_id').eq('id', OID).single()

  const { data: buyerWallet } = await supabase.from('wallets').select('available_balance, escrow_balance').eq('user_id', order.buyer_id).single()
  const { data: sellerWallet } = await supabase.from('wallets').select('available_balance, escrow_balance').eq('user_id', order.seller_id).single()
  
  console.log("Buyer Wallet Balances:", buyerWallet)
  console.log("Seller Wallet Balances:", sellerWallet)

  const { data: timeline } = await supabase.from('order_timeline').select('*').eq('order_id', OID).order('created_at', { ascending: true })
  console.log("Order Timeline:", timeline)
}

run()
