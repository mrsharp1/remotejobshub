import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts'

// ---------------------------------------------------------------------------
// PAYSTACK WEBHOOK HANDLER
// ---------------------------------------------------------------------------
// Security model:
//   1. HMAC-SHA512 verified with constant-time comparison (W-1 fix)
//   2. Every verified event logged to webhook_events table (W-9 fix)
//   3. Idempotency: DB unique index on (event_type, paystack_reference) is the
//      first guard; process_paystack_deposit RPC unique index is the second
//   4. Retry strategy (W-3 fix):
//      - Return 200 for all business-logic rejections (bad metadata, duplicates,
//        already-processed) — Paystack should NOT retry these
//      - Return 500 ONLY for: DB unavailable, connection timeout, cold-start RPC failure
//        — Paystack SHOULD retry transient infrastructure failures
// ---------------------------------------------------------------------------

// W-3 FIX: Sentinel error class for infrastructure-only retryable failures.
// Only errors of this type will return 500. All others return 200.
class RetryableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RetryableError'
  }
}

serve(async (req) => {
  // Webhooks are server-to-server. Non-POST requests are rejected immediately.
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // Read raw body BEFORE any JSON parsing — HMAC must be computed on raw bytes.
  // If body read fails it is a retryable infrastructure error.
  let rawBody: string
  try {
    rawBody = await req.text()
  } catch (readErr) {
    console.error(JSON.stringify({ event: 'body_read_error', error: String(readErr) }))
    throw new RetryableError('Failed to read request body')
  }

  // -----------------------------------------------------------------------
  // STEP 0: IP Allowlisting (W-2 FIX - Defense in depth)
  // -----------------------------------------------------------------------
  // Get allowed IPs from environment variable (comma separated), fallback to known Paystack IPs
  const allowedIpsStr = Deno.env.get('PAYSTACK_ALLOWED_IPS') || '52.31.139.75,52.49.173.169,52.214.14.220'
  const paystackIps = allowedIpsStr.split(',').map(ip => ip.trim())
  
  const forwardedIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('cf-connecting-ip')
  
  if (forwardedIp && !paystackIps.includes(forwardedIp)) {
    console.warn(JSON.stringify({
      event: 'unauthorized_ip',
      ip: forwardedIp,
      message: 'Request blocked due to IP mismatch'
    }))
    return new Response('Forbidden', { status: 403 })
  }

  try {
    // -----------------------------------------------------------------------
    // STEP 1: Validate environment
    // -----------------------------------------------------------------------
    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecret) {
      // Missing secret is a deployment misconfiguration — retryable until fixed
      throw new RetryableError('PAYSTACK_SECRET_KEY is not configured')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new RetryableError('Supabase environment variables not configured')
    }

    // -----------------------------------------------------------------------
    // STEP 2: Verify HMAC-SHA512 signature (W-1 FIX — constant-time)
    // -----------------------------------------------------------------------
    const signature = req.headers.get('x-paystack-signature')
    if (!signature) {
      // W-6 FIX: Structured log with event context
      console.error(JSON.stringify({ event: 'missing_signature', ip: req.headers.get('x-forwarded-for') }))
      return new Response('Missing signature', { status: 401 })
    }

    const encoder = new TextEncoder()

    // Import the secret as an HMAC key
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(paystackSecret),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign', 'verify']
    )

    // W-1 FIX: Convert the received hex signature to Uint8Array for constant-time comparison.
    // crypto.subtle.verify() is defined to be constant-time by the Web Crypto specification.
    // This eliminates the timing side-channel that existed with `signature !== expectedSignature`.
    let signatureBytes: Uint8Array
    try {
      signatureBytes = new Uint8Array(
        signature.match(/.{2}/g)!.map((b) => parseInt(b, 16))
      )
    } catch (_) {
      console.error(JSON.stringify({ event: 'malformed_signature', signature_length: signature.length }))
      return new Response('Invalid signature format', { status: 401 })
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encoder.encode(rawBody)
    )

    if (!isValid) {
      // W-6 FIX: Log signature failure with structured context for security monitoring
      console.error(JSON.stringify({
        event: 'signature_mismatch',
        body_length: rawBody.length,
        ip: req.headers.get('x-forwarded-for'),
      }))
      return new Response('Invalid signature', { status: 401 })
    }

    // -----------------------------------------------------------------------
    // STEP 3: Parse event body
    // -----------------------------------------------------------------------
    let body: {
      event: string
      data: {
        amount: number
        reference: string
        status: string
        metadata?: { user_id?: string }
      }
    }

    try {
      body = JSON.parse(rawBody)
    } catch (_) {
      // Malformed JSON after valid HMAC — log and return 200 (not retryable)
      console.error(JSON.stringify({ event: 'json_parse_error', raw_snippet: rawBody.slice(0, 100) }))
      return new Response('OK', { status: 200 })
    }

    const eventType = body.event
    const data = body.data
    const reference = data?.reference ?? null

    // W-6 FIX: Structured log for every received event (after HMAC passes)
    console.log(JSON.stringify({
      event: 'webhook_received',
      event_type: eventType,
      reference,
      status: data?.status,
    }))

    // -----------------------------------------------------------------------
    // STEP 4: Initialize Supabase admin client
    // -----------------------------------------------------------------------
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // -----------------------------------------------------------------------
    // STEP 5: Log event to webhook_events table (W-9 FIX — audit trail)
    // This provides a financial audit record and second idempotency layer (W-5).
    // ON CONFLICT DO NOTHING: if this event+reference was already recorded,
    // we skip silently — the previous execution handled it.
    // -----------------------------------------------------------------------
    // ON CONFLICT: if this (event_type, paystack_reference) pair already exists,
    // the unique index on webhook_events will reject the insert.
    // We handle the 23505 unique-violation code as a duplicate detection signal.
    const { error: logError } = await supabaseAdmin
      .from('webhook_events')
      .insert({
        event_type: eventType,
        paystack_reference: reference,
        payload: body as unknown as Record<string, unknown>,
        processed: false,
      })

    // If webhook_events logging fails, it is a retryable DB error
    // (we want Paystack to retry so we don't lose the event record)
    if (logError) {
      // Check if it's a duplicate (unique constraint violation code = 23505)
      if ((logError as { code?: string }).code === '23505') {
        // Already logged — this is a Paystack retry of an already-processed event
        console.log(JSON.stringify({
          event: 'duplicate_webhook',
          event_type: eventType,
          reference,
        }))
        return new Response('OK', { status: 200 })
      }
      // True DB error — retryable
      throw new RetryableError(`Failed to log webhook event: ${logError.message}`)
    }

    // -----------------------------------------------------------------------
    // STEP 6: Process charge.success events
    // -----------------------------------------------------------------------
    if (eventType === 'charge.success') {
      // W-7 FIX: Explicit guard on data.status with structured log
      if (data.status !== 'success') {
        console.warn(JSON.stringify({
          event: 'charge_success_wrong_status',
          event_type: eventType,
          reference,
          data_status: data.status,
        }))
        // Mark as processed (nothing to do) and return 200 — not retryable
        await supabaseAdmin
          .from('webhook_events')
          .update({ processed: true })
          .eq('event_type', eventType)
          .eq('paystack_reference', reference)
        return new Response('OK', { status: 200 })
      }

      // W-7 FIX: Explicit guard on metadata.user_id with structured log
      const userId = data.metadata?.user_id
      if (!userId) {
        console.error(JSON.stringify({
          event: 'missing_user_id_in_metadata',
          event_type: eventType,
          reference,
          metadata: data.metadata,
        }))
        // Cannot process without user_id. Mark logged event as failed.
        // Return 200 — Paystack retrying will not fix missing metadata.
        await supabaseAdmin
          .from('webhook_events')
          .update({
            processed: false,
            processing_error: 'Missing user_id in metadata',
          })
          .eq('event_type', eventType)
          .eq('paystack_reference', reference)
        return new Response('OK', { status: 200 })
      }

      // W-8 FIX: Integer-safe amount conversion.
      // data.amount is in kobo (integer). Math.round() ensures no float drift
      // before the division. PostgreSQL NUMERIC(12,2) handles the rest.
      const amountInNaira = Math.round(data.amount) / 100

      if (amountInNaira <= 0) {
        console.error(JSON.stringify({
          event: 'invalid_amount',
          event_type: eventType,
          reference,
          raw_amount_kobo: data.amount,
          computed_naira: amountInNaira,
        }))
        await supabaseAdmin
          .from('webhook_events')
          .update({
            processed: false,
            processing_error: `Invalid amount: ${data.amount} kobo`,
          })
          .eq('event_type', eventType)
          .eq('paystack_reference', reference)
        return new Response('OK', { status: 200 })
      }

      // W-6 FIX: Structured log before calling RPC
      console.log(JSON.stringify({
        event: 'processing_deposit',
        event_type: eventType,
        reference,
        user_id: userId,
        amount_naira: amountInNaira,
      }))

      // Call idempotent RPC — safe against concurrent duplicate deliveries.
      // The RPC uses FOR UPDATE lock + ON CONFLICT DO NOTHING on payment_reference.
      const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc(
        'process_paystack_deposit',
        {
          p_user_id: userId,
          p_amount: amountInNaira,
          p_reference: reference,
        }
      )

      if (rpcError) {
        // W-3 FIX: RPC errors are retryable (DB connection issues, lock timeout)
        // Mark the webhook_events record with the error for admin review
        await supabaseAdmin
          .from('webhook_events')
          .update({
            processed: false,
            processing_error: rpcError.message,
          })
          .eq('event_type', eventType)
          .eq('paystack_reference', reference)

        console.error(JSON.stringify({
          event: 'rpc_error',
          event_type: eventType,
          reference,
          user_id: userId,
          error: rpcError.message,
        }))

        // W-3 FIX: Throw RetryableError so Paystack retries until DB recovers
        throw new RetryableError(`RPC process_paystack_deposit failed: ${rpcError.message}`)
      }

      // W-6 FIX: Structured success log
      console.log(JSON.stringify({
        event: 'deposit_processed',
        event_type: eventType,
        reference,
        user_id: userId,
        amount_naira: amountInNaira,
        rpc_result: rpcData,
      }))

      // Mark webhook event as successfully processed
      await supabaseAdmin
        .from('webhook_events')
        .update({ processed: true })
        .eq('event_type', eventType)
        .eq('paystack_reference', reference)
    } else {
      // Unhandled event type — log it, mark as processed (nothing to do)
      console.log(JSON.stringify({
        event: 'unhandled_event_type',
        event_type: eventType,
        reference,
      }))
      await supabaseAdmin
        .from('webhook_events')
        .update({ processed: true })
        .eq('event_type', eventType)
        .eq('paystack_reference', reference)
    }

    // Always return 200 to Paystack after HMAC validation passes
    return new Response('OK', { status: 200 })

  } catch (error) {
    // W-3 FIX: Only RetryableError causes a 500 response.
    // All other unhandled errors (business logic) return 200.
    if (error instanceof RetryableError) {
      console.error(JSON.stringify({
        event: 'retryable_error',
        error: error.message,
      }))
      return new Response('Internal Server Error', { status: 500 })
    }

    // Non-retryable unexpected error — log and return 200
    console.error(JSON.stringify({
      event: 'unexpected_error',
      error: String(error),
    }))
    return new Response('OK', { status: 200 })
  }
})
