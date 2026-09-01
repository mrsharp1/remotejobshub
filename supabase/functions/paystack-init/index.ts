import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

// P7-FIX: Restrict CORS to the configured app URL instead of wildcard '*'.
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const reqBody = await req.json()
    const { amount, callbackUrl, metadata } = reqBody

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount')
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY')

    try {
      const { data: config } = await serviceClient
        .from('payment_gateway_settings')
        .select('live_secret_key')
        .eq('is_active', true)
        .maybeSingle()

      if (config && config.live_secret_key) {
        paystackSecret = config.live_secret_key
      }
    } catch (dbError) {
      console.error('Failed to fetch dynamic paystack configuration:', dbError)
    }

    if (!paystackSecret) {
      throw new Error('Paystack secret key not configured in environment or database.')
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount * 100, // Convert NGN to Kobo
        currency: 'NGN',
        callback_url: callbackUrl || Deno.env.get('APP_URL') || Deno.env.get('VITE_APP_URL') || 'http://localhost:5173/dashboard/payment/verify',
        metadata: metadata || {
          user_id: user.id,
          type: 'wallet_deposit',
        },
      }),
    })

    const data = await response.json()

    if (!data.status) {
      throw new Error(data.message || 'Failed to initialize payment')
    }

    return new Response(
      JSON.stringify({
        authorization_url: data.data.authorization_url,
        reference: data.data.reference,
        access_code: data.data.access_code,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
