import React from 'react'
import { format } from 'date-fns'
import { CheckCircle2, AlertTriangle, ShieldCheck, Lock, Upload, Key, Banknote } from 'lucide-react'

interface SystemMessageProps {
  payload: string
  timestamp: string
  eventType?: string | null
}

export const SystemMessage: React.FC<SystemMessageProps> = ({ payload, timestamp }) => {
  let eventData: any = { event: 'UNKNOWN' }
  
  try {
    eventData = JSON.parse(payload)
  } catch (e) {
    // fallback
  }

  const { event } = eventData
  const timeStr = format(new Date(timestamp), 'h:mm a')

  let Icon = CheckCircle2
  let title = 'System Event'
  let color = 'text-primary bg-primary/10 border-primary/20'

  switch (event) {
    case 'PAYMENT_RECEIVED':
      title = 'Payment confirmed'
      Icon = Banknote
      color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      break
    case 'ESCROW_LOCKED':
      title = 'Escrow locked'
      Icon = Lock
      color = 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
      break
    case 'CREDENTIALS_UPLOADED':
      title = 'Seller uploaded credentials'
      Icon = Upload
      color = 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      break
    case 'VERIFICATION_STARTED':
      title = 'Buyer entered verification'
      Icon = ShieldCheck
      color = 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      break
    case 'VERIFICATION_COMPLETED':
      title = 'Verification completed'
      Icon = CheckCircle2
      color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      break
    case 'DISPUTE_OPENED':
      title = 'Dispute opened'
      Icon = AlertTriangle
      color = 'text-destructive bg-destructive/10 border-destructive/20'
      break
    case 'DISPUTE_RESOLVED':
      title = 'Dispute resolved'
      Icon = CheckCircle2
      color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      break
    case 'ESCROW_RELEASED':
      title = 'Escrow released & Settlement complete'
      Icon = Banknote
      color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      break
    case 'ORDER_COMPLETED':
      title = 'Order marked as complete'
      Icon = CheckCircle2
      color = 'text-primary bg-primary/10 border-primary/20'
      break
    default:
      title = event.replace(/_/g, ' ').toLowerCase()
      break
  }

  return (
    <div className="flex w-full justify-center my-6">
      <div className={`flex items-center gap-3 rounded-full border px-4 py-2 shadow-sm ${color}`}>
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold capitalize tracking-wide">{title}</span>
        <span className="text-[10px] font-medium opacity-70 border-l pl-2 ml-1 border-current">
          {timeStr}
        </span>
        {event === 'CREDENTIALS_UPLOADED' && (
          <button className="ml-2 rounded-full bg-background px-2 py-0.5 text-[10px] font-bold shadow-sm hover:scale-105 transition-transform flex items-center gap-1">
            <Key className="h-3 w-3" />
            Open Vault
          </button>
        )}
      </div>
    </div>
  )
}
