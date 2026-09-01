import { supabase } from '@/lib/supabase'
import { getFirebaseToken } from '@/lib/firebase'
import { UAParser } from 'ua-parser-js'

export const pushNotificationService = {
  isPushNotificationSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window
  },

  async requestPushPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied'
    }
    return await Notification.requestPermission()
  },

  getDeviceType(): string {
    try {
      const parser = new UAParser()
      const result = parser.getResult()
      const browserName = result.browser.name || 'Unknown Browser'
      const osName = result.os.name || 'Unknown OS'
      return `${browserName} on ${osName}`
    } catch {
      return 'Unknown Device'
    }
  },

  async subscribeToPushNotifications(userId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isPushNotificationSupported()) return { success: false, error: 'Push notifications not supported on this browser.' }

    const permission = await this.requestPushPermission()
    if (permission !== 'granted') return { success: false, error: `Browser permission denied. Current state: ${permission}` }

    try {
      // Get Firebase config / token
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY // Firebase can also use a VAPID key to generate tokens for web push
      
      // We will first explicitly unregister the old /sw.js to prevent conflicts
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const reg of registrations) {
        if (reg.active?.scriptURL.endsWith('/sw.js')) {
          await reg.unregister()
          console.log('Unregistered legacy VAPID service worker')
        }
      }
      
      const token = await getFirebaseToken(vapidKey)
      
      if (!token) {
        throw new Error('Failed to generate FCM token from Firebase.')
      }

      console.log('Diagnostic: New FCM token generated: YES')

      try {
        await this.savePushSubscription(userId, token)

        const isInDb = await this.verifySubscriptionInDb(token)
        if (!isInDb) {
          throw new Error('Database persistence verification failed')
        }
        console.log('Diagnostic: FCM token saved to database: YES')
      } catch (saveError) {
        console.log('Diagnostic: FCM token saved to database: NO')
        throw saveError
      }

      return { success: true }
    } catch (error: any) {
      console.error('Failed to subscribe to push notifications via FCM:', error)
      return { success: false, error: error.message || 'Unknown error occurred during subscription' }
    }
  },

  async savePushSubscription(_userId: string, token: string): Promise<void> {
    const deviceType = this.getDeviceType()
    
    // Use the secure RPC to bypass RLS when claiming an existing token 
    // from a shared browser session.
    const { error } = await supabase.rpc('register_fcm_token', {
      p_token: token,
      p_device_type: deviceType
    })

    if (error) {
      console.error('Failed to save FCM token to Supabase:', error)
      throw error
    }
  },

  async unsubscribeFromPushNotifications(): Promise<{ success: boolean; error?: string }> {
    try {
      // In Firebase web, we can delete the token if we want, or just remove it from DB.
      // Usually, removing from DB is sufficient so the backend stops sending.
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
      const token = await getFirebaseToken(vapidKey)
      
      if (token) {
        try {
          await this.removePushSubscription(token)
        } catch (dbError: any) {
          console.error('Failed to remove from DB:', dbError)
          return { success: false, error: 'Failed to remove subscription from database.' }
        }
        
        // Note: Firebase `deleteToken` could be called here if we wanted to fully invalidate,
        // but removing from our DB stops the sends and allows clean re-opt-in.
        return { success: true }
      }
      return { success: true } // If no token exists, consider it disabled.
    } catch (error: any) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return { success: false, error: error.message || 'Unknown error during unsubscribe.' }
    }
  },

  async removePushSubscription(token: string): Promise<void> {
    const { error } = await supabase
      .from('fcm_tokens')
      .delete()
      .eq('token', token)

    if (error) {
      console.error('Failed to remove FCM token from Supabase:', error)
      throw error
    }
  },

  async verifySubscriptionInDb(token: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('fcm_tokens')
        .select('id')
        .eq('token', token)
        .maybeSingle()

      if (error) return false
      return !!data
    } catch {
      return false
    }
  }
}
