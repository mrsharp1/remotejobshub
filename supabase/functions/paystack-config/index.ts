import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const allowedOrigin = Deno.env.get('APP_URL') || 'http://localhost:5173'

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authenticate user using ANON key and Auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // 2. Verify Admin Role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      throw new Error('Forbidden: Requires administrator privileges')
    }

    // 3. Initialize Service Role Client for bypassing RLS
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle GET Request: Return masked configuration
    if (req.method === 'GET') {
      const { data, error } = await serviceClient
        .from('payment_gateway_settings')
        .select('live_public_key, live_secret_key, updated_at')
        .eq('is_active', true)
        .maybeSingle()

      if (error) {
        throw new Error('Database query failed')
      }

      if (!data) {
        return new Response(JSON.stringify({ is_configured: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const maskedSecret = data.live_secret_key.substring(0, 8) + '••••••••••••'

      return new Response(
        JSON.stringify({
          is_configured: true,
          live_public_key: data.live_public_key,
          masked_secret_key: maskedSecret,
          updated_at: data.updated_at,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle POST Request: Validate and update configuration
    if (req.method === 'POST') {
      const { live_public_key, live_secret_key } = await req.json()

      if (!live_public_key || !live_secret_key) {
        throw new Error('Both public key and secret key are required.')
      }

      if (!live_public_key.startsWith('pk_live_')) {
        throw new Error('Invalid public key format. Must begin with pk_live_')
      }

      if (!live_secret_key.startsWith('sk_live_')) {
        throw new Error('Invalid secret key format. Must begin with sk_live_')
      }

      // Safe Server-Side Validation Request against Paystack
      const paystackRes = await fetch('https://api.paystack.co/transaction?perPage=1', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${live_secret_key}`,
          'Content-Type': 'application/json',
        },
      })

      if (!paystackRes.ok) {
        throw new Error('Paystack connection failed. Please check your LIVE Paystack credentials.')
      }

      // Upsert into Database using Service Role (Keep single active row)
      const { error: deactivateError } = await serviceClient
        .from('payment_gateway_settings')
        .update({ is_active: false })
        .eq('is_active', true)

      if (deactivateError) throw deactivateError

      const { error: insertError } = await serviceClient
        .from('payment_gateway_settings')
        .insert({
          live_public_key,
          live_secret_key,
          is_active: true,
        })

      if (insertError) throw insertError

      return new Response(JSON.stringify({ success: true, message: 'Paystack connection verified and credentials saved.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Method not allowed')
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
