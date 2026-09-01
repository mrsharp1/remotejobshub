require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

async function run() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  
  // Login as admin
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'test_admin_temp@example.com', 
    password: 'Password123!'
  })

  if (authErr) {
    console.error("Auth error:", authErr)
    return
  }

  const OID = 'cf7db003-e8b4-45d5-8604-d53e33530a63'
  
  console.log("=== FORENSIC TRACE FOR ORDER", OID, "===\n")

  // 1. orders
  const { data: order } = await supabase.from('orders').select('*').eq('id', OID).single()
  console.log("1. Order:", order)

  // 2. payments
  const { data: payment } = await supabase.from('payments').select('*').eq('order_id', OID).single()
  console.log("2. Payment:", payment)

  // 3 & 4. profiles
  const { data: buyer } = await supabase.from('profiles').select('*').eq('id', order.buyer_id).single()
  const { data: seller } = await supabase.from('profiles').select('*').eq('id', order.seller_id).single()
  console.log("3. Buyer Profile:", buyer)
  console.log("4. Seller Profile:", seller)

  // 5 & 6. wallets
  const { data: buyerWallet } = await supabase.from('wallets').select('*').eq('user_id', order.buyer_id).single()
  const { data: sellerWallet } = await supabase.from('wallets').select('*').eq('user_id', order.seller_id).single()
  console.log("5. Buyer Wallet:", buyerWallet)
  console.log("6. Seller Wallet:", sellerWallet)

  // 7. wallet_transactions (Buyer)
  const { data: buyerTxs } = await supabase.from('wallet_transactions').select('*').eq('wallet_id', buyerWallet?.id).order('created_at', { ascending: true })
  console.log("7a. Buyer Wallet Txs:", buyerTxs)

  // 7. wallet_transactions (Seller)
  const { data: sellerTxs } = await supabase.from('wallet_transactions').select('*').eq('wallet_id', sellerWallet?.id).order('created_at', { ascending: true })
  console.log("7b. Seller Wallet Txs:", sellerTxs)

  // 8. disputes
  const { data: dispute } = await supabase.from('disputes').select('*').eq('order_id', OID)
  console.log("8. Disputes:", dispute)

  // M. order_timeline
  const { data: timeline } = await supabase.from('order_timeline').select('*').eq('order_id', OID).order('created_at', { ascending: true })
  console.log("M. Order Timeline:", timeline)
}

run()
