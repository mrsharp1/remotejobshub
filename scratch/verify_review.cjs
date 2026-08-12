const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pgcxvpdohwhcvseloxpi.supabase.co';
const supabaseKey = 'sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyOrder() {
  const orderId = '9911df5c-f00f-4d9c-9151-486c13debd8e';
  
  // 1. Fetch Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderError) {
    console.error('Failed to fetch order:', orderError);
    return;
  }

  console.log('Order found:', order);
  
  // 2. Try inserting a review via RLS (Need authenticated session)
  // But we don't have user's JWT. We can use service_role to check constraints.
  // Wait, the user wants me to trace the exact error. I can just test with service_role to see if there's a schema/constraint error.
  
  const reviewPayload = {
    order_id: order.id,
    listing_id: order.listing_id,
    seller_id: order.seller_id,
    buyer_id: order.buyer_id,
    reviewer_type: 'buyer',
    rating: 4,
    title: 'PERFECT PURCHASE',
    review: 'GOOD TO USE SELLER',
    would_recommend: false
    // moderation_status not included, does it default?
  };

  const { data: reviewData, error: reviewError } = await supabase
    .from('reviews')
    .insert([reviewPayload])
    .select();

  console.log('=== TRANSACTIONAL REVIEW FORENSIC ===');
  console.log('order_id:', reviewPayload.order_id);
  console.log('buyer_id:', reviewPayload.buyer_id);
  console.log('seller_id:', reviewPayload.seller_id);
  console.log('listing_id:', reviewPayload.listing_id);
  console.log('reviewer_type:', reviewPayload.reviewer_type);
  console.log('rating:', reviewPayload.rating);
  console.log('would_recommend:', reviewPayload.would_recommend);
  console.log('====================================');
  
  if (reviewError) {
    console.log('SUPABASE REVIEW ERROR:');
    console.log('code:', reviewError.code);
    console.log('message:', reviewError.message);
    console.log('details:', reviewError.details);
    console.log('hint:', reviewError.hint);
  } else {
    console.log('REVIEW INSERT: SUCCESS', reviewData);
  }
}

verifyOrder();
