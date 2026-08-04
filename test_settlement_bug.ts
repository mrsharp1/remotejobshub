import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

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
  const buyerEmail = `buyer_${Date.now()}@example.com`
  const sellerEmail = `seller_${Date.now()}@example.com`
  const password = 'TestPassword123!'

  const { data: buyerData } = await adminClient.auth.admin.createUser({ email: buyerEmail, password, email_confirm: true })
  const buyerId = buyerData.user.id
  await adminClient.from('profiles').insert([{ id: buyerId, email: buyerEmail, full_name: 'Test Buyer', role: 'buyer' }])
  await adminClient.from('wallets').insert([{ user_id: buyerId, available_balance: 10500, escrow_balance: 0 }])
  
  const { data: sellerData } = await adminClient.auth.admin.createUser({ email: sellerEmail, password, email_confirm: true })
  const sellerId = sellerData.user.id
  await adminClient.from('profiles').insert([{ id: sellerId, email: sellerEmail, full_name: 'Test Seller', role: 'seller' }])
  await adminClient.from('wallets').insert([{ user_id: sellerId, available_balance: 0, escrow_balance: 0 }])

  const { data: listing } = await adminClient.from('listings').insert([{ 
    seller_id: sellerId, title: 'Test Listing', description: 'Testing', price: 10000, platform: 'Upwork', country: 'Nigeria', status: 'published' 
  }]).select().single()

  const buyerClient = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false }})
  await buyerClient.auth.signInWithPassword({ email: buyerEmail, password })
  
  const { data: rpcData } = await buyerClient.rpc('rpc_checkout_with_wallet', { p_listing_id: listing.id })
  
  console.log('Order created. Payment ID:', rpcData.payment_id)
  
  // Now simulate markReleased frontend bug!
  console.log('Simulating paymentService.markReleased from frontend...')
  
  const { data: payment, error } = await buyerClient
    .from('payments')
    .update({
      payment_status: 'released',
      released_at: new Date().toISOString(),
    })
    .eq('id', rpcData.payment_id)
    .select()
    .single()
    
  console.log('Error output:', JSON.stringify(error, null, 2))
}

run().catch(console.error)
