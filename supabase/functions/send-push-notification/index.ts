import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import webpush from 'npm:web-push@3.6.7'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    // For VAPID keys, you must set them in Edge Function secrets:
    // supabase secrets set VAPID_PUBLIC_KEY=your_public_key VAPID_PRIVATE_KEY=your_private_key
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

    if (!supabaseUrl || !supabaseServiceKey || !vapidPublicKey || !vapidPrivateKey) {
      throw new Error('Missing necessary environment variables (URL, Service Key, or VAPID Keys).')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const payload = await req.json()
    
    // Handle both direct invocation `{ record: ... }` and webhook `record` payload format
    const notification = payload.record || payload

    if (!notification || !notification.user_id) {
      return new Response(JSON.stringify({ error: 'Missing notification data or user_id' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const { user_id, title, message, link, target_url, type, id, category, priority } = notification

    // Retrieve user push subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user_id)

    if (error) {
      throw error
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: 'No push subscriptions found for this user.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    webpush.setVapidDetails(
      'mailto:admin@remotejobshub.com',
      vapidPublicKey,
      vapidPrivateKey
    )

    // Build the standardized payload
    const pushPayload = JSON.stringify({
      title: title || 'Remote Jobs Hub',
      body: message || 'You have a new notification.',
      url: target_url || link || '/',
      notification_id: id || new Date().toISOString(),
      type: type || 'system',
      category: category || 'system',
      priority: priority || 'informational'
    })

    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh_key,
                auth: sub.auth_key,
              },
            },
            pushPayload
          )
          
          // Optionally update last_used_at for analytics
          await supabase
            .from('push_subscriptions')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', sub.id)
            
          return { success: true, endpoint: sub.endpoint }
        } catch (err: any) {
          // If the subscription is gone/expired, remove it from the database
          if (err.statusCode === 404 || err.statusCode === 410) {
            console.log(`Subscription expired/invalid for user ${user_id}. Removing endpoint.`)
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', sub.id)
          } else {
            console.error('Failed to send push notification:', err)
          }
          return { success: false, endpoint: sub.endpoint, error: err.message }
        }
      })
    )

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Push notification service error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
