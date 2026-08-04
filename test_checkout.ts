import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envFile = fs.readFileSync('.env', 'utf8')
const envConfig: any = {}
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envConfig[match[1]] = match[2].trim()
  }
})

const supabaseUrl = envConfig['VITE_SUPABASE_URL'] || ''
const supabaseKey = envConfig['VITE_SUPABASE_ANON_KEY'] || ''
const serviceRoleKey = envConfig['SUPABASE_SERVICE_ROLE_KEY'] || envConfig['VITE_SUPABASE_SERVICE_ROLE_KEY'] || ''

const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false }})

async function run() {
  console.log('--- ATOMIC CHECKOUT VERIFICATION ---')
  
  // 1. Create a dummy buyer and seller
  const buyerEmail = `buyer_${Date.now()}@example.com`
  const sellerEmail = `seller_${Date.now()}@example.com`
  const password = 'TestPassword123!'

  console.log(`Creating buyer: ${buyerEmail}`)
  const { data: buyerData, error: buyerErr } = await adminClient.auth.admin.createUser({ email: buyerEmail, password, email_confirm: true })
  if (buyerErr) throw buyerErr
  const buyerId = buyerData.user.id
  await adminClient.from('profiles').insert([{ id: buyerId, email: buyerEmail, full_name: 'Test Buyer', role: 'buyer' }])
  await adminClient.from('wallets').insert([{ user_id: buyerId, available_balance: 10500, escrow_balance: 0 }])
  
  console.log(`Creating seller: ${sellerEmail}`)
  const { data: sellerData, error: sellerErr } = await adminClient.auth.admin.createUser({ email: sellerEmail, password, email_confirm: true })
  if (sellerErr) throw sellerErr
  const sellerId = sellerData.user.id
  await adminClient.from('profiles').insert([{ id: sellerId, email: sellerEmail, full_name: 'Test Seller', role: 'seller' }])
  await adminClient.from('wallets').insert([{ user_id: sellerId, available_balance: 0, escrow_balance: 0 }])

  // 2. Create a test listing
  console.log(`Creating listing...`)
  const { data: listing, error: listingErr } = await adminClient.from('listings').insert([{ 
    seller_id: sellerId, 
    title: 'Test Checkout Listing', 
    description: 'Testing', 
    price: 10000, 
    platform: 'Upwork', 
    country: 'Nigeria', 
    status: 'published' 
  }]).select().single()
  
  if (listingErr) throw listingErr

  // 3. Authenticate as the buyer to get JWT for the RPC
  console.log(`Authenticating as buyer...`)
  const buyerClient = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false }})
  const { error: authErr } = await buyerClient.auth.signInWithPassword({ email: buyerEmail, password })
  if (authErr) throw authErr

  // 4. Execute RPC
  console.log(`Executing rpc_checkout_with_wallet...`)
  const { data: rpcData, error: rpcErr } = await buyerClient.rpc('rpc_checkout_with_wallet', { p_listing_id: listing.id })
  
  if (rpcErr) {
    console.error('RPC FAILED:', rpcErr)
  } else {
    console.log('RPC SUCCESS:', rpcData)
    
    console.log('\n--- VERIFYING ATOMICITY ---')
    // 5. Verify wallet deduction
    const { data: wallet } = await adminClient.from('wallets').select('*').eq('user_id', buyerId).single()
    console.log('Buyer Wallet (Expected: Available 0, Escrow 10000):', wallet?.available_balance, wallet?.escrow_balance)
    
    // 6. Verify ledger entries
    const { data: txs } = await adminClient.from('wallet_transactions').select('type, amount').eq('user_id', buyerId)
    console.log('Wallet Transactions (Expected: escrow_hold -10000, purchase -500):', txs)

    // 7. Verify order creation
    const { data: order } = await adminClient.from('orders').select('status, amount').eq('id', rpcData.order_id).single()
    console.log('Order (Expected: payment_received, 10000):', order)

    // 8. Verify payment creation
    const { data: payment } = await adminClient.from('payments').select('payment_status, amount, platform_fee').eq('order_id', rpcData.order_id).single()
    console.log('Payment (Expected: success, 10000, 500):', payment)

    // 9. Verify timeline
    const { data: timeline } = await adminClient.from('order_timeline').select('status').eq('order_id', rpcData.order_id)
    console.log('Order Timeline:', timeline)

    // 10. Verify notifications
    const { data: notifications } = await adminClient.from('notifications').select('title, user_id').eq('reference_id', rpcData.order_id)
    console.log('Notifications (Expected: 1 for buyer, 1 for seller):', notifications?.length)
    
    // 11. Verify listing is sold
    const { data: finalListing } = await adminClient.from('listings').select('status').eq('id', listing.id).single()
    console.log('Listing status (Expected: sold):', finalListing?.status)
  }

  // 12. Test rollback on failure
  console.log('\n--- TESTING ROLLBACK ON INSUFFICIENT FUNDS ---')
  const { data: failListing } = await adminClient.from('listings').insert([{ 
    seller_id: sellerId, 
    title: 'Fail Listing', 
    description: 'Testing', 
    price: 50000, 
    platform: 'Upwork', 
    country: 'Nigeria', 
    status: 'published' 
  }]).select().single()

  const { data: failRpcData, error: failRpcErr } = await buyerClient.rpc('rpc_checkout_with_wallet', { p_listing_id: failListing.id })
  console.log('Insufficient Funds RPC Result:', failRpcErr ? 'FAILED (EXPECTED)' : 'SUCCESS (UNEXPECTED)')
  if (failRpcErr) console.log('Error message:', failRpcErr.message)
}

run().catch(console.error)
