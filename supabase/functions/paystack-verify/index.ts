import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

// P7-FIX: Restrict CORS to the configured app URL instead of wildcard '*'.
// This prevents cross-origin financial API calls from arbitrary origins.
// APP_URL must be set in Supabase project secrets before production deployment.
const allowedOrigin = Deno.env.get('APP_URL') || 'http://localhost:5173'

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // P6-FIX: Validate that the calling user is authenticated.
    // Previously this function had no auth check, so any caller could trigger
    // a wallet credit for an arbitrary user_id. Now we verify the JWT first,
    // and confirm the user_id from Paystack metadata matches the authenticated user.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { reference } = await req.json()

    if (!reference) {
      throw new Error('Transaction reference is required')
    }

    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecret) {
      throw new Error('Paystack secret key not configured')
    }

    // Verify with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    })
    
    const verifyData = await verifyRes.json()

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return new Response(
        JSON.stringify({ success: false, message: 'Payment verification failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const amountInNaira = Math.round(verifyData.data.amount) / 100
    const metadataUserId = verifyData.data.metadata?.user_id

    if (!metadataUserId) {
      throw new Error('Invalid metadata: Missing user_id')
    }

    // P6-FIX: Ensure the authenticated user matches the user_id in Paystack's metadata.
    // This prevents a user from verifying another user's payment reference.
    if (metadataUserId !== user.id) {
      return new Response(
        JSON.stringify({ success: false, message: 'User mismatch: payment reference does not belong to this account' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase with SERVICE ROLE to execute secure RPC
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Call idempotent RPC — safe against concurrent double-submissions
    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('process_paystack_deposit', {
      p_user_id: metadataUserId,
      p_amount: amountInNaira,
      p_reference: reference,
    })

    if (rpcError) {
      throw rpcError
    }

    return new Response(
      JSON.stringify(rpcData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('paystack-verify error:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
