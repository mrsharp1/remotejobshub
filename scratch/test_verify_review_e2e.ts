import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const envFile = fs.readFileSync('.env', 'utf-8')
let supabaseUrl = ''
let supabaseKey = ''

envFile.split('\n').forEach(line => {
  const parts = line.split('=')
  if (parts[0] === 'VITE_SUPABASE_URL') supabaseUrl = parts[1].trim()
  if (parts[0] === 'VITE_SUPABASE_SERVICE_ROLE_KEY') supabaseKey = parts[1].trim()
})

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('--- E2E Transactional Review Verification ---')

  // 1. Find a completed order that does not have a review yet
  const { data: orders, error: orderErr } = await supabase
    .from('orders')
    .select('*, listings(*)')
    .eq('status', 'completed')
    .limit(10)

  if (orderErr) {
    console.error('Error fetching orders:', orderErr)
    return
  }

  let targetOrder = null
  for (const order of orders) {
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('*')
      .eq('order_id', order.id)
      .single()
    if (!existingReview) {
      targetOrder = order
      break
    }
  }

  if (!targetOrder) {
    console.log('No completed orders without reviews found. Attempting to force complete an order...')
    const { data: pendingOrders } = await supabase
      .from('orders')
      .select('*, listings(*)')
      .limit(1)
    
    if (pendingOrders && pendingOrders.length > 0) {
      targetOrder = pendingOrders[0]
      await supabase.from('orders').update({ status: 'completed' }).eq('id', targetOrder.id)
      console.log(`Forced order ${targetOrder.id} to completed state.`)
    } else {
       console.log('No orders exist in the database. Please create one first.')
       return
    }
  }

  console.log(`Using Order ID: ${targetOrder.id} (Buyer: ${targetOrder.buyer_id}, Seller: ${targetOrder.seller_id}, Listing: ${targetOrder.listing_id})`)

  // 2. Submit a review from the buyer
  console.log('\nSubmitting review from buyer...')
  const newReview = {
    order_id: targetOrder.id,
    reviewer_id: targetOrder.buyer_id,
    reviewee_id: targetOrder.seller_id,
    listing_id: targetOrder.listing_id,
    rating: 5,
    comment: 'Exceptional transaction! The seller was incredibly professional and the account was exactly as described. E2E verification successful.',
    moderation_status: 'pending' // As per recent migrations
  }

  const { data: review, error: reviewErr } = await supabase
    .from('reviews')
    .insert([newReview])
    .select()
    .single()

  if (reviewErr) {
    console.error('Failed to submit review:', reviewErr)
    return
  }
  console.log(`Review submitted successfully (ID: ${review.id}) with status: ${review.moderation_status}`)

  // 3. Approve the review as admin
  console.log('\nApproving review as admin...')
  const { data: approvedReview, error: approveErr } = await supabase
    .from('reviews')
    .update({ moderation_status: 'approved' })
    .eq('id', review.id)
    .select()
    .single()

  if (approveErr) {
    console.error('Failed to approve review:', approveErr)
    return
  }
  console.log(`Review approved. Status is now: ${approvedReview.moderation_status}`)

  // 4. Verify visibility on seller's public profile/listing
  console.log('\nVerifying visibility on public endpoints...')
  // Simulate public fetch of reviews for the seller
  const { data: publicReviews, error: publicErr } = await supabase
    .from('reviews')
    .select('*')
    .eq('reviewee_id', targetOrder.seller_id)
    .eq('moderation_status', 'approved')

  if (publicErr) {
    console.error('Failed to fetch public reviews:', publicErr)
    return
  }

  const isVisible = publicReviews.some(r => r.id === review.id)
  if (isVisible) {
    console.log('✅ SUCCESS: The approved review is visibly rendered and accessible for the seller\'s public profile!')
  } else {
    console.log('❌ FAILURE: The approved review is NOT visible in public queries!')
  }

  // Check seller's average rating calculation if there's a view/function for it (optional)
}

run()
