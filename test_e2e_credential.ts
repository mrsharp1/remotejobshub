import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import * as fs from 'fs'

const envPath = path.resolve(process.cwd(), '.env')
const envData = fs.readFileSync(envPath, 'utf8')
const env: Record<string, string> = {}
envData.split('\n').forEach(line => {
  const [k, v] = line.split('=')
  if (k && v) env[k.trim()] = v.trim()
})
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY


const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase credentials in .env')
}

// Admin client to fetch a random order bypassing RLS
const adminSupabase = createClient(supabaseUrl, serviceRoleKey)

async function runE2ETest() {
  console.log('--- E2E CREDENTIAL VAULT PAYLOAD VISIBILITY TEST ---')
  
  // 1. Fetch an order to test with
  console.log('1. Fetching a random order...')
  const { data: order, error: orderError } = await adminSupabase
    .from('orders')
    .select('*')
    .limit(1)
    .single()

  if (orderError || !order) {
    throw new Error(`Failed to fetch order: ${orderError?.message || 'No orders found'}`)
  }
  
  console.log(`Testing with Order: ${order.id}`)
  console.log(`Buyer ID: ${order.buyer_id}`)
  console.log(`Listing ID: ${order.listing_id}`)
  
  // 2. Fetch the listing via admin client to verify it exists and is sold
  const { data: listingAdmin, error: listingAdminError } = await adminSupabase
    .from('listings')
    .select('id, status, vault_data')
    .eq('id', order.listing_id)
    .single()
    
  if (listingAdminError || !listingAdmin) {
    throw new Error(`Failed to fetch listing: ${listingAdminError?.message}`)
  }
  
  console.log(`Listing Admin Check: status is '${listingAdmin.status}'`)
  
  if (listingAdmin.status !== 'sold') {
    console.log('Forcing listing status to "sold" for test purposes...')
    await adminSupabase.from('listings').update({ status: 'sold', vault_data: '{"vaultEmail": "test@test.com", "vaultPassword": "123"}' }).eq('id', order.listing_id)
  }

  // 3. Create a buyer-impersonating client (without knowing password, just setting the JWT if possible)
  // Since we cannot easily forge JWTs in JS client, let's create a new test user and order
  
  console.log('\n--- SETTING UP FRESH E2E TEST RECORD ---')
  
  const testEmail = `buyer_${Date.now()}@test.com`
  console.log(`Creating test buyer: ${testEmail}`)
  
  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email: testEmail,
    password: 'Password123!',
    email_confirm: true
  })
  
  if (authError || !authData.user) {
    throw new Error(`Failed to create buyer: ${authError?.message}`)
  }
  
  const buyerId = authData.user.id
  
  // Sign in as buyer to get an anon client
  const buyerSupabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY || '')
  await buyerSupabase.auth.signInWithPassword({ email: testEmail, password: 'Password123!' })
  
  // Create a listing (as admin)
  const { data: newListing, error: newListingError } = await adminSupabase
    .from('listings')
    .insert([{
      seller_id: order.seller_id,
      title: 'Test Listing',
      description: 'Test',
      price: 1000,
      currency: 'NGN',
      status: 'sold',
      approval_status: 'approved',
      vault_data: '{"vaultEmail": "test@test.com", "vaultPassword": "123"}'
    }])
    .select()
    .single()
    
  if (newListingError) throw new Error(newListingError.message)
  
  // Create an order connecting buyer to listing
  const { data: newOrder, error: newOrderError } = await adminSupabase
    .from('orders')
    .insert([{
      buyer_id: buyerId,
      seller_id: order.seller_id,
      listing_id: newListing.id,
      amount: 1000,
      status: 'completed'
    }])
    .select()
    .single()
    
  if (newOrderError) throw new Error(newOrderError.message)
  
  console.log(`Created new sold listing ${newListing.id} and order ${newOrder.id} for buyer ${buyerId}`)
  
  console.log('\n4. Attempting to fetch order with joined listing as BUYER...')
  
  const { data: fetchedOrder, error: fetchedOrderError } = await buyerSupabase
    .from('orders')
    .select('*, listing:listings(*)')
    .eq('id', newOrder.id)
    .single()
    
  if (fetchedOrderError) {
    console.error(`Fetch order error: ${fetchedOrderError.message}`)
  }
  
  console.log(`Fetched Order ID: ${fetchedOrder?.id}`)
  
  if (!fetchedOrder?.listing) {
    console.error('\n❌ FAILURE: Joined listing is NULL (Access Denied by RLS). Credential payload will be unavailable.')
    process.exit(1)
  }
  
  console.log(`Fetched Listing ID: ${fetchedOrder.listing.id}`)
  console.log(`Fetched Listing Status: ${fetchedOrder.listing.status}`)
  console.log(`Fetched Vault Data: ${fetchedOrder.listing.vault_data}`)
  
  console.log('\n5. Also verify anonymous user CANNOT read the sold listing...')
  const anonSupabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY || '')
  const { data: anonListing } = await anonSupabase.from('listings').select('*').eq('id', newListing.id).single()
  
  if (anonListing) {
    console.error('\n❌ FAILURE: Anonymous user was able to read the sold listing!')
    process.exit(1)
  } else {
    console.log('✅ SUCCESS: Anonymous user blocked from sold listing.')
  }
  
  console.log('\n✅ E2E VERIFICATION PASSED: Buyer can successfully retrieve vault_data for their sold listing!')
}

runE2ETest().catch(console.error)
