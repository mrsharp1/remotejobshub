import { useEffect } from 'react'
import { EventEngine, EventName } from '@/lib/events/EventEngine'

// We use any internally here for the parameter due to complex type extraction,
// but the callback itself is naturally typed correctly by the user when invoking it.
export function useEventSubscriber<T extends EventName>(
  event: T,
  callback: (payload: any) => void
) {
  useEffect(() => {
    const unsubscribe = EventEngine.subscribe(event, callback)
    return () => unsubscribe()
  }, [event, callback])
}
