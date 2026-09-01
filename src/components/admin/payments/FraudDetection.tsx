import React, { useMemo } from 'react'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { Payment, Dispute } from '@/types'
import { formatCurrency } from '@/utils/currency'

interface FraudDetectionProps {
  payments: Payment[]
  disputes?: Dispute[]
}

interface Alert {
  id: string
  riskScore: number
  type: string
  description: string
  action: string
}

export const FraudDetection: React.FC<FraudDetectionProps> = ({ payments, disputes = [] }) => {
  const alerts = useMemo(() => {
    const generatedAlerts: Alert[] = []
    
    // Group payments by buyer
    const buyerPayments = payments.reduce((acc, p) => {
      if (!acc[p.buyer_id]) acc[p.buyer_id] = []
      acc[p.buyer_id].push(p)
      return acc
    }, {} as Record<string, Payment[]>)

    Object.entries(buyerPayments).forEach(([buyerId, history]) => {
      // Sort history ascending
      history.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

      // Rule 1: Rapid transaction velocity (3+ within 5 minutes)
      for (let i = 0; i < history.length - 2; i++) {
        const t1 = new Date(history[i].created_at).getTime()
        const t3 = new Date(history[i + 2].created_at).getTime()
        const diffMinutes = (t3 - t1) / (1000 * 60)
        
        if (diffMinutes <= 5) {
          const buyerName = history[0].buyer?.full_name || 'Unknown Buyer'
          generatedAlerts.push({
            id: `VEL-${buyerId.substring(0, 6)}`.toUpperCase(),
            riskScore: 78,
            type: 'Rapid transaction velocity',
            description: `Buyer (${buyerName}) initiated 3+ transactions within a 5-minute window.`,
            action: 'Awaiting clearance',
          })
          break // Only one alert per buyer for this rule
        }
      }

      // Rule 2: Repeated payment failures (3+ failures)
      const failedCount = history.filter(p => p.payment_status === 'failed').length
      if (failedCount >= 3) {
        const buyerName = history[0].buyer?.full_name || 'Unknown Buyer'
        generatedAlerts.push({
          id: `FAIL-${buyerId.substring(0, 6)}`.toUpperCase(),
          riskScore: 85,
          type: 'Repeated payment failures',
          description: `Buyer (${buyerName}) has experienced ${failedCount} failed payment attempts.`,
          action: 'Flagged for review',
        })
      }
      
      // Rule 4: Large transaction alerts (> 500,000)
      const largeTx = history.find(p => Number(p.amount) > 500000)
      if (largeTx) {
        const buyerName = history[0].buyer?.full_name || 'Unknown Buyer'
        generatedAlerts.push({
          id: `LRG-${largeTx.id.substring(0, 6)}`.toUpperCase(),
          riskScore: 65,
          type: 'Large transaction alert',
          description: `Buyer (${buyerName}) initiated a transaction of ${formatCurrency(Number(largeTx.amount))}.`,
          action: 'Audit log generated',
        })
      }
    })

    // Rule 3: Multiple disputes (2+ disputes by same buyer)
    const buyerDisputes = disputes.reduce((acc, d) => {
      if (!acc[d.opened_by]) acc[d.opened_by] = []
      acc[d.opened_by].push(d)
      return acc
    }, {} as Record<string, Dispute[]>)

    Object.entries(buyerDisputes).forEach(([buyerId, ds]) => {
      if (ds.length >= 2) {
        generatedAlerts.push({
          id: `DISP-${buyerId.substring(0, 6)}`.toUpperCase(),
          riskScore: 92,
          type: 'Multiple disputes',
          description: `User has opened ${ds.length} disputes on the platform.`,
          action: 'Immediate action required',
        })
      }
    })

    return generatedAlerts.sort((a, b) => b.riskScore - a.riskScore)
  }, [payments, disputes])

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            <h3 className="font-heading text-base font-bold text-foreground">Fraud Radar Insights</h3>
          </div>
          <p className="text-[11px] text-muted-foreground">Security triggers and threat intelligence warnings</p>
        </div>
        <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[9px] font-bold text-rose-500 dark:text-rose-400 uppercase">
          {alerts.length} Warnings Flagged
        </span>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShieldCheck className="h-10 w-10 text-emerald-500/50 mb-3" />
            <p className="text-sm font-bold text-foreground">All systems secure</p>
            <p className="text-xs text-muted-foreground mt-1">Insufficient data to generate security alerts.</p>
          </div>
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-slate-50 dark:bg-slate-900/50 p-4 transition-all duration-300 hover:border-rose-500/30"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400">{a.id}</span>
                    <span className="text-[10px] text-muted-foreground">{a.type}</span>
                  </div>
                  <p className="mt-1 text-xs text-foreground leading-normal">{a.description}</p>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-black font-mono text-rose-600 dark:text-rose-400">{a.riskScore}%</span>
                  <span className="text-[8px] font-bold uppercase text-rose-500/80">Risk level</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
