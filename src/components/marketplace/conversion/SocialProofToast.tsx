import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, TrendingUp, X, 
  ShieldCheck, Star, Lock, Wallet, Users, BadgeCheck
} from 'lucide-react'
import { EventEngine } from '@/lib/events/EventEngine'

// 4. Smarter Location Data
const LOCATIONS = [
  'United Kingdom', 'Canada', 'United States', 'Australia', 'Germany', 
  'France', 'Netherlands', 'Ireland', 'Nigeria', 'Ghana', 'South Africa'
]

// 5. Humanized Time Labels
const TIME_LABELS = [
  'Just now', '1 minute ago', '3 minutes ago', '7 minutes ago', '12 minutes ago'
]

type EventCategory = 'MARKETPLACE' | 'ESCROW' | 'COMMUNITY' | 'KYC' | 'REVIEW' | 'SECURITY' | 'PLATFORM' | 'WALLET'

interface ToastEvent {
  id: string
  icon: any
  text: string
  color: string
  bg: string
  timeLabel: string
}

// 6. Intelligent Icons mapped to categories
const CATEGORY_MAP: Record<EventCategory, { icon: any, color: string, bg: string }> = {
  ESCROW: { icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  MARKETPLACE: { icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  REVIEW: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  KYC: { icon: BadgeCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  SECURITY: { icon: Lock, color: 'text-slate-500', bg: 'bg-slate-500/10' },
  COMMUNITY: { icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  PLATFORM: { icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  WALLET: { icon: Wallet, color: 'text-rose-500', bg: 'bg-rose-500/10' },
}

// 3. Much Larger Event Pool Generation
const generateRandomText = (): { category: EventCategory, text: string } => {
  const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
  const scenarios = [
    { category: 'MARKETPLACE', text: 'Someone purchased a Freelancer account.' },
    { category: 'MARKETPLACE', text: 'Someone purchased an Upwork account.' },
    { category: 'MARKETPLACE', text: 'Someone purchased a Toptal account.' },
    { category: 'MARKETPLACE', text: 'Someone purchased an Outlier account.' },
    { category: 'MARKETPLACE', text: 'Someone listed a new Fiverr account.' },
    { category: 'MARKETPLACE', text: 'A premium seller listed a verified account.' },
    { category: 'MARKETPLACE', text: 'A featured listing was published.' },
    { category: 'ESCROW', text: 'Escrow payment secured.' },
    { category: 'ESCROW', text: 'Escrow released successfully.' },
    { category: 'ESCROW', text: 'Buyer completed verification.' },
    { category: 'ESCROW', text: 'Seller received payout.' },
    { category: 'COMMUNITY', text: `New member joined from ${loc}.` },
    { category: 'COMMUNITY', text: 'Community reached another milestone.' },
    { category: 'KYC', text: 'Seller verified successfully.' },
    { category: 'KYC', text: 'Identity approved.' },
    { category: 'KYC', text: 'KYC completed.' },
    { category: 'REVIEW', text: 'Buyer left a 5-star review.' },
    { category: 'REVIEW', text: 'Seller earned Top Rated badge.' },
    { category: 'REVIEW', text: 'New testimonial added.' },
    { category: 'SECURITY', text: 'AI blocked suspicious login.' },
    { category: 'SECURITY', text: 'Device verified.' },
    { category: 'SECURITY', text: 'Secure vault accessed.' },
    { category: 'SECURITY', text: 'Credentials encrypted successfully.' },
    { category: 'PLATFORM', text: 'New verified seller onboarded.' },
    { category: 'PLATFORM', text: 'New premium listing approved.' },
    { category: 'PLATFORM', text: 'Marketplace crossed another milestone.' },
  ] as const

  return scenarios[Math.floor(Math.random() * scenarios.length)]
}

const createSimulatedEvent = (): ToastEvent => {
  const { category, text } = generateRandomText()
  const styling = CATEGORY_MAP[category]
  const timeLabel = TIME_LABELS[Math.floor(Math.random() * TIME_LABELS.length)]
  
  return {
    id: Math.random().toString(36).substring(7),
    icon: styling.icon,
    text,
    color: styling.color,
    bg: styling.bg,
    timeLabel
  }
}

const DISPLAY_DURATION_MS = 20000

export const SocialProofToast: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<ToastEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const [isHovered, setIsHovered] = useState(false)
  
  const eventQueue = useRef<ToastEvent[]>([])
  
  // 9. Future-Proof Event Engine
  useEffect(() => {
    const unsubscribes = [
      EventEngine.subscribe('ORDER_CREATED', () => {
        eventQueue.current.push({
          id: Math.random().toString(36).substring(7),
          icon: CATEGORY_MAP.MARKETPLACE.icon,
          text: 'A new marketplace order was just placed.',
          color: CATEGORY_MAP.MARKETPLACE.color,
          bg: CATEGORY_MAP.MARKETPLACE.bg,
          timeLabel: 'Just now'
        })
      }),
      EventEngine.subscribe('ESCROW_RELEASED', () => {
        eventQueue.current.push({
          id: Math.random().toString(36).substring(7),
          icon: CATEGORY_MAP.ESCROW.icon,
          text: 'Escrow funds were successfully released.',
          color: CATEGORY_MAP.ESCROW.color,
          bg: CATEGORY_MAP.ESCROW.bg,
          timeLabel: 'Just now'
        })
      }),
      EventEngine.subscribe('VERIFICATION_COMPLETED', () => {
        eventQueue.current.push({
          id: Math.random().toString(36).substring(7),
          icon: CATEGORY_MAP.KYC.icon,
          text: 'A user successfully completed identity verification.',
          color: CATEGORY_MAP.KYC.color,
          bg: CATEGORY_MAP.KYC.bg,
          timeLabel: 'Just now'
        })
      }),
      EventEngine.subscribe('REVIEW_SUBMITTED', () => {
        eventQueue.current.push({
          id: Math.random().toString(36).substring(7),
          icon: CATEGORY_MAP.REVIEW.icon,
          text: 'A buyer left a new 5-star review.',
          color: CATEGORY_MAP.REVIEW.color,
          bg: CATEGORY_MAP.REVIEW.bg,
          timeLabel: 'Just now'
        })
      }),
      EventEngine.subscribe('SELLER_WALLET_CREDITED', () => {
        eventQueue.current.push({
          id: Math.random().toString(36).substring(7),
          icon: CATEGORY_MAP.WALLET.icon,
          text: 'A seller successfully received their payout.',
          color: CATEGORY_MAP.WALLET.color,
          bg: CATEGORY_MAP.WALLET.bg,
          timeLabel: 'Just now'
        })
      }),
      EventEngine.subscribe('DISPUTE_OPENED', () => {
        eventQueue.current.push({
          id: Math.random().toString(36).substring(7),
          icon: CATEGORY_MAP.SECURITY.icon,
          text: 'A secure dispute resolution was initiated.',
          color: CATEGORY_MAP.SECURITY.color,
          bg: CATEGORY_MAP.SECURITY.bg,
          timeLabel: 'Just now'
        })
      })
    ]
    
    return () => unsubscribes.forEach(unsub => unsub())
  }, [])
  
  // Timing cycle
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const cycleNext = () => {
      // Priority: Real Events ↓ Simulated Events
      let nextEvent = eventQueue.current.length > 0 ? eventQueue.current.shift()! : createSimulatedEvent()
      
      // Avoid immediate simulated repetition if queue was empty
      if (currentEvent && nextEvent.text === currentEvent.text && eventQueue.current.length === 0) {
        nextEvent = createSimulatedEvent()
      }
      
      setCurrentEvent(nextEvent)
      setProgress(100)
      setIsVisible(true)
    }

    if (!isVisible) {
      // 1. Smarter Timing Algorithm: Random interval between 6-18 seconds.
      const waitTime = Math.floor(Math.random() * (18000 - 6000 + 1)) + 6000
      timeoutId = setTimeout(cycleNext, waitTime)
    }

    return () => clearTimeout(timeoutId)
  }, [isVisible])

  // Progress Bar / Hover logic
  useEffect(() => {
    if (!isVisible || isHovered) return

    let lastTime = performance.now()
    let frameId: number

    const tick = (time: number) => {
      const delta = time - lastTime
      lastTime = time
      
      setProgress(p => {
        const next = p - (delta / DISPLAY_DURATION_MS) * 100
        if (next <= 0) {
          setIsVisible(false) // Trigger hiding
          return 0
        }
        return next
      })
      
      frameId = requestAnimationFrame(tick)
    }
    
    frameId = requestAnimationFrame(tick)
    
    return () => cancelAnimationFrame(frameId)
  }, [isVisible, isHovered])

  return (
    <AnimatePresence>
      {isVisible && currentEvent && (
        <motion.div
          key={currentEvent.id}
          initial={{ opacity: 0, x: -20, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.02, y: -2 }}
          className="fixed bottom-24 left-4 z-[100] max-w-[320px] w-[90%] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl dark:bg-slate-900 sm:bottom-6 sm:left-6 transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)]"
        >
          <div className="relative p-4 pb-5">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${currentEvent.bg}`}>
                <currentEvent.icon className={`h-5 w-5 ${currentEvent.color}`} />
              </div>
              <div className="flex-1 pr-6">
                <p className="text-sm font-semibold leading-snug text-foreground break-words">
                  {currentEvent.text}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {currentEvent.timeLabel}
                </p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Animated Progress Bar (controlled by JS requestAnimationFrame) */}
          <div className={`absolute bottom-0 left-0 h-1 ${currentEvent.bg.replace('/10', '/30')} w-full`}>
            <div 
              className={`h-full transition-none ${currentEvent.bg.replace('/10', '')}`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
