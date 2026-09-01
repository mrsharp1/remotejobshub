require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

async function run() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  
  // Login as test admin
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'test_admin_temp@example.com', 
    password: 'Password123!'
  })

  if (authErr) {
    console.error("Auth error:", authErr)
    return
  }

  console.log("--- FETCHING ALL PAYMENTS ---")
  const { data: payments, error: payErr } = await supabase
    .from('payments')
    .select(`
      id,
      buyer_id,
      seller_id,
      order_id,
      amount,
      payment_status,
      currency,
      paystack_reference,
      paid_at,
      released_at,
      refunded_at,
      created_at
    `)
    .order('created_at', { ascending: false })
    
  if (payErr) console.error("Payment error:", payErr)
  
  console.log("Payments:", payments?.length)
  // Let's print the specific 50 NGN payment or all payments nicely
  const payMap = {}
  if (payments) payments.forEach(p => payMap[p.order_id] = p)

  console.log("--- FETCHING ALL ORDERS ---")
  const { data: orders, error: ordErr } = await supabase
    .from('orders')
    .select(`
      id,
      buyer_id,
      seller_id,
      listing_id,
      status,
      amount,
      created_at
    `)
    .order('created_at', { ascending: false })
    
  if (ordErr) console.error("Order error:", ordErr)
  console.log("Orders:", orders?.length)

  console.log("--- FETCHING ALL DISPUTES ---")
  const { data: disputes, error: dispErr } = await supabase
    .from('disputes')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (dispErr) console.error("Dispute error:", dispErr)
  console.log("Disputes:", disputes?.length)
  
  console.log("--- FETCHING ALL WALLET TRANSACTIONS ---")
  const { data: wTxs, error: wTxsErr } = await supabase
    .from('wallet_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (wTxsErr) console.error("Wallet Tx error:", wTxsErr)
  
  // Combine logic to find anomaly:
  console.log("\n=== CROSS-REFERENCING ORDERS AND PAYMENTS ===")
  if (orders) {
    orders.forEach(o => {
      const p = payMap[o.id]
      console.log(`Order: ${o.id.substring(0, 8)} | Amt: ${o.amount} | O.Status: ${o.status} | P.Status: ${p ? p.payment_status : 'N/A'}`)
      
      if (o.amount == 50) {
        console.log("  >>> FOUND NGN 50 ANOMALY <<<")
        console.log("  Order detail:", JSON.stringify(o, null, 2))
        console.log("  Payment detail:", JSON.stringify(p, null, 2))
        const d = disputes?.filter(d => d.order_id === o.id) || []
        console.log("  Dispute detail:", JSON.stringify(d, null, 2))
        const w = wTxs?.filter(w => w.payment_reference === (p ? p.paystack_reference : 'none') || w.description.includes(o.id) || w.description.includes(p ? p.id : 'none') || (p && w.description.includes(p.id)))
        console.log("  Wallet txs:", JSON.stringify(w, null, 2))
      }
    })
  }
}
run()
