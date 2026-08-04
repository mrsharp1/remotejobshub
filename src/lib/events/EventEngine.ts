type EventPayloads = {
  ORDER_CREATED: { orderId: string; amount: number; buyerId: string; sellerId: string }
  PAYMENT_CONFIRMED: { orderId: string; amount: number }
  ESCROW_LOCKED: { orderId: string; amount: number }
  CREDENTIALS_UPLOADED: { orderId: string; sellerId: string }
  VAULT_OPENED: { orderId: string; buyerId: string }
  VERIFICATION_STARTED: { orderId: string; buyerId: string }
  VERIFICATION_COMPLETED: { orderId: string; buyerId: string }
  ESCROW_RELEASED: { orderId: string; amount: number; sellerId: string }
  SELLER_WALLET_CREDITED: { orderId: string; amount: number; sellerId: string }
  DISPUTE_OPENED: { orderId: string; reason: string; initiatedBy: string }
  DISPUTE_RESOLVED: { orderId: string; resolution: string }
  ORDER_COMPLETED: { orderId: string }
  REVIEW_SUBMITTED: { orderId: string; rating: number; reviewerId: string; targetId: string }
}

export type EventName = keyof EventPayloads

type EventHandler<T extends EventName> = (payload: EventPayloads[T]) => void

class EventEmitter {
  private listeners: Map<EventName, Set<Function>> = new Map()

  subscribe<T extends EventName>(event: T, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler as Function)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(handler as Function)
    }
  }

  publish<T extends EventName>(event: T, payload: EventPayloads[T]): void {
    const handlers = this.listeners.get(event)
    if (!handlers) return

    handlers.forEach((handler) => {
      try {
        // Promise.resolve ensures it runs in microtask queue without blocking
        Promise.resolve().then(() => handler(payload))
      } catch (err) {
        console.error(`Error executing handler for event ${event}:`, err)
      }
    })
  }
}

export const EventEngine = new EventEmitter()
