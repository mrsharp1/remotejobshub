import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pgcxvpdohwhcvseloxpi.supabase.co'
const supabaseKey = 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  // Login as seller
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'seller@example.com',
    password: 'password123',
  })

  if (authError || !authData.user) {
    console.error('Auth error:', authError)
    return
  }

  const sellerId = authData.user.id

  const newListing = {
    seller_id: sellerId,
    title: 'Test Listing from Script',
    platform: 'youtube',
    country: 'United States',
    description: 'Test description',
    reason_for_sale: 'Test reason',
    price: 1500,
    status: 'submitted',
    approval_status: 'pending',
    views: 0,
    favorites_count: 0,
    is_featured: false,
    vault_data: { vaultEmail: 'test@example.com', vaultPassword: 'password' },
    original_email_included: true,
    recovery_email_included: false,
    phone_included: false,
    identity_verified: true,
  }

  console.log('Inserting listing...')
  const { data: listing, error } = await supabase
    .from('listings')
    .insert([newListing])
    .select()
    .single()

  if (error) {
    console.error('LISTING INSERT ERROR:', error)
    return
  }

  console.log('Created Listing ID:', listing.id)

  console.log('Now checking Admin query...')
  // Login as admin
  await supabase.auth.signOut()
  const { data: adminAuth, error: adminAuthErr } = await supabase.auth.signInWithPassword({
    email: 'admin@example.com',
    password: 'password123',
  })

  if (adminAuthErr) {
    console.error('Admin Auth error:', adminAuthErr)
    return
  }

  const { data: adminData, error: adminError } = await supabase
    .from('listings')
    .select(
      '*, seller:profiles!listings_seller_id_fkey(*), images:listing_images(*), tags:listing_tags(*)'
    )
    .order('created_at', { ascending: false })

  if (adminError) {
    console.error('Admin Query Error:', adminError)
    return
  }

  const found = adminData.find(l => l.id === listing.id)
  console.log('Found newly created listing in admin query?', !!found)
  if (found) {
    console.log('Listing status in query:', found.status, found.approval_status)
  }
}

run()
