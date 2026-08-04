import React from 'react'
import { useGlobalStats, useCMSStore } from '@/services/cms/cms.store'

export const HomepageStatisticsManager: React.FC = () => {
  const stats = useGlobalStats()
  const { updateGlobalStatsDraft } = useCMSStore()

  const handleUpdate = (field: keyof typeof stats, value: string) => {
    updateGlobalStatsDraft({
      ...stats,
      [field]: value
    })
  }

  const statFields = [
    { key: 'users', label: 'Registered Users' },
    { key: 'transactions', label: 'Total Transactions' },
    { key: 'escrowVolume', label: 'Escrow Volume' },
    { key: 'countries', label: 'Countries Served' }
  ] as const

  return (
    <div className="max-w-2xl space-y-6">
      <h3 className="font-heading text-lg font-bold">Homepage Statistics Override</h3>
      <p className="text-sm text-muted-foreground">These statistics are pulled from the Global Stats. Updating them here will update them everywhere.</p>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {statFields.map(field => (
          <div key={field.key}>
            <label className="mb-2 block text-sm font-semibold">{field.label}</label>
            <input 
              type="text" 
              value={stats[field.key]}
              onChange={e => handleUpdate(field.key, e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
