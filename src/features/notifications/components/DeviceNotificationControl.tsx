import React, { useEffect, useState } from 'react'
import { Loader2, Smartphone, CheckCircle2, AlertOctagon, Info } from 'lucide-react'
import { pushNotificationService } from '@/features/notifications/services/push-notification.service'

interface DeviceNotificationControlProps {
  userId: string | undefined
}

export const DeviceNotificationControl: React.FC<DeviceNotificationControlProps> = ({ userId }) => {
  const [pushState, setPushState] = useState<'checking' | 'unsupported' | 'not_enabled' | 'enabled' | 'blocked' | 'error'>('checking')
  const [isPushLoading, setIsPushLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    checkPushStatus()
  }, [])

  const checkPushStatus = async () => {
    if (!pushNotificationService.isPushNotificationSupported() || !('Notification' in window)) {
      setPushState('unsupported')
      return
    }

    if (Notification.permission === 'denied') {
      setPushState('blocked')
      return
    }

    if (Notification.permission === 'granted') {
       try {
         const registration = await navigator.serviceWorker.getRegistration('/sw.js')
         if (registration) {
           const subscription = await registration.pushManager.getSubscription()
           if (subscription) {
             const isInDb = await pushNotificationService.verifySubscriptionInDb(subscription.endpoint)
             if (isInDb) {
               setPushState('enabled')
               return
             }
             // If not in DB but exists in browser, we shouldn't show it as enabled.
             // We'll clean up the dangling browser subscription quietly.
             await subscription.unsubscribe().catch(() => {})
           }
         }
       } catch (e) {
         console.error(e)
       }
    }
    
    setPushState('not_enabled')
  }

  const handleEnablePush = async () => {
    if (!userId) return
    setIsPushLoading(true)
    setErrorMessage(null)
    const result = await pushNotificationService.subscribeToPushNotifications(userId)
    if (result.success) {
      setPushState('enabled')
    } else {
      setErrorMessage(result.error || 'Failed to enable device notifications.')
      if (Notification.permission === 'denied') {
        setPushState('blocked')
      } else {
        setPushState('error')
      }
    }
    setIsPushLoading(false)
  }

  const handleDisablePush = async () => {
    setIsPushLoading(true)
    setErrorMessage(null)
    const result = await pushNotificationService.unsubscribeFromPushNotifications()
    if (result.success) {
      setPushState('not_enabled')
    } else {
      setErrorMessage(result.error || 'Failed to disable device notifications.')
    }
    setIsPushLoading(false)
  }

  if (pushState === 'checking') {
    return (
      <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }

  if (pushState === 'not_enabled') {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm transition-all hover:border-primary/50">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="rounded-full bg-primary/10 p-3 shrink-0 self-start">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-base">Enable Device Notifications</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/80 max-w-[500px]">
              Get important updates from Remote Jobs Hub, including messages, order updates, payments, and account activity directly on this device, even when the website is not actively open.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={handleEnablePush}
                disabled={isPushLoading}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-60 flex items-center gap-2"
              >
                {isPushLoading && <Loader2 className="h-4 w-4 animate-spin" /> }
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (pushState === 'enabled') {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6 shadow-sm">
         <div className="flex flex-col sm:flex-row sm:items-start gap-5">
           <div className="rounded-full bg-green-500/20 p-3 shrink-0 self-start">
             <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
           </div>
           <div className="flex-1">
             <h3 className="font-bold text-foreground text-base">Device Notifications Enabled</h3>
             <p className="mt-1.5 text-sm leading-relaxed text-foreground/80 max-w-[500px]">
               This device is successfully registered to receive instant push alerts from Remote Jobs Hub.
             </p>
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={handleDisablePush}
                  disabled={isPushLoading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 flex items-center gap-2"
                >
                  {isPushLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  Disable on this device
                </button>
                {errorMessage && (
                  <p className="text-xs font-mono text-destructive p-2 bg-destructive/10 rounded-md">
                    Error: {errorMessage}
                  </p>
                )}
              </div>
           </div>
         </div>
      </div>
    )
  }

  if (pushState === 'blocked') {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 shadow-sm">
         <div className="flex items-start gap-5">
           <div className="rounded-full bg-destructive/10 p-3 shrink-0 self-start">
             <AlertOctagon className="h-6 w-6 text-destructive" />
           </div>
           <div className="flex-1">
             <h3 className="font-bold text-foreground text-base">Notifications are blocked</h3>
             <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
               You have denied permission for Remote Jobs Hub to send notifications. To receive important updates, please open your browser's site settings and allow notifications for this website.
             </p>
             {errorMessage && (
               <p className="mt-2 text-xs font-mono text-destructive p-2 bg-destructive/10 rounded-md">
                 Error: {errorMessage}
               </p>
             )}
           </div>
         </div>
      </div>
    )
  }

  if (pushState === 'error') {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 shadow-sm">
         <div className="flex items-start gap-5">
           <div className="rounded-full bg-destructive/10 p-3 shrink-0 self-start">
             <AlertOctagon className="h-6 w-6 text-destructive" />
           </div>
           <div className="flex-1">
             <h3 className="font-bold text-foreground text-base">Subscription Failed</h3>
             <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
               We could not enable device push notifications at this time.
             </p>
             {errorMessage && (
               <p className="mt-3 text-xs font-mono text-destructive p-3 bg-destructive/10 rounded-md border border-destructive/20 break-all">
                 {errorMessage}
               </p>
             )}
             <div className="mt-4">
               <button
                 type="button"
                 onClick={() => setPushState('not_enabled')}
                 className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
               >
                 Try Again
               </button>
             </div>
           </div>
         </div>
      </div>
    )
  }

  // pushState === 'unsupported'
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-6 shadow-sm">
       <div className="flex items-start gap-5">
         <div className="rounded-full bg-muted p-3 shrink-0 self-start">
           <Info className="h-6 w-6 text-muted-foreground" />
         </div>
         <div className="flex-1">
           <h3 className="font-bold text-foreground text-base">Browser Unsupported</h3>
           <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
             Device push notifications are not supported by your current browser or device. You will still receive in-app notifications and emails.
           </p>
         </div>
       </div>
    </div>
  )
}
