import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
// Import firebase-admin via esm.sh or npm (Supabase supports both, npm: is often easier if supported, but let's use standard Firebase REST or esm.sh if possible)
// But since the old one used npm:web-push, we can use npm:firebase-admin
import admin from 'npm:firebase-admin@12.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Firebase Admin lazily to prevent errors if env vars are missing during deployment
let firebaseInitialized = false

function initFirebaseAdmin() {
  if (firebaseInitialized) return

  const serviceAccountStr = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')
  
  if (!serviceAccountStr) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT environment variable')
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountStr)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    firebaseInitialized = true
  } catch (err) {
    console.error('Failed to initialize Firebase Admin:', err)
    throw err
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing necessary environment variables (URL, Service Key).')
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

    // Retrieve user push subscriptions from fcm_tokens table
    const { data: subscriptions, error } = await supabase
      .from('fcm_tokens')
      .select('id, token, sound_enabled')
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

    // Initialize Firebase
    initFirebaseAdmin()

    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          // Construct specific payload per subscription to handle individual sound preference
          const targetUrl = target_url || link || '/'
          const notificationId = id || new Date().toISOString()
          
          const payload = {
            data: {
              title: String(title || 'Remote Jobs Hub'),
              body: String(message || 'You have a new notification.'),
              url: String(targetUrl),
              notification_id: String(notificationId),
              type: String(type || 'system'),
              category: String(category || 'system'),
              priority: String(priority || 'informational'),
              silent: sub.sound_enabled === false ? 'true' : 'false'
            },
            token: sub.token
          }

          // Firebase Admin SDK send message
          await admin.messaging().send(payload)
          
          // Optionally update last_used_at for analytics
          await supabase
            .from('fcm_tokens')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', sub.id)
            
          return { success: true, token: sub.token }
        } catch (err: any) {
          // If the subscription is gone/expired (e.g. messaging/registration-token-not-registered)
          if (err.code === 'messaging/registration-token-not-registered' || err.code === 'messaging/invalid-registration-token') {
            console.log(`Token expired/invalid for user ${user_id}. Removing token.`)
            await supabase
              .from('fcm_tokens')
              .delete()
              .eq('id', sub.id)
          } else {
            console.error('Failed to send push notification:', err)
          }
          return { success: false, token: sub.token, error: err.message }
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
