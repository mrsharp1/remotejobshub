export class NotificationSoundService {
  private static instance: NotificationSoundService
  private lastPlayed: number = 0
  private readonly COOLDOWN_MS = 2000
  private readonly STORAGE_KEY = 'rjh_notification_sounds_enabled'

  private constructor() {}

  public static getInstance(): NotificationSoundService {
    if (!NotificationSoundService.instance) {
      NotificationSoundService.instance = new NotificationSoundService()
    }
    return NotificationSoundService.instance
  }

  public isSoundEnabled(): boolean {
    if (typeof window === 'undefined') return false
    const pref = localStorage.getItem(this.STORAGE_KEY)
    return pref === 'true'
  }

  public setSoundEnabled(enabled: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, String(enabled))
      
      // Async sync with database to ensure background push notifications respect mute
      import('@/lib/supabase').then(async ({ supabase }) => {
        try {
          await supabase.rpc('update_fcm_sound_preference', { p_sound_enabled: enabled })
        } catch (err) {
          console.error('Failed to sync sound preference to backend', err)
        }
      }).catch(console.error)
    }
  }

  public async play(): Promise<void> {
    if (!this.isSoundEnabled()) return

    const now = Date.now()
    if (now - this.lastPlayed < this.COOLDOWN_MS) {
      return
    }

    try {
      this.lastPlayed = now
      const audio = new Audio('/notification.wav')
      audio.volume = 1
      audio.currentTime = 0
      await audio.play()
    } catch (err: any) {
      console.error('Error playing notification sound:', err)
    }
  }
}

export const notificationSoundService = NotificationSoundService.getInstance()
