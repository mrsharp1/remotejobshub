import React from 'react'
import { Laptop, Smartphone, CheckCircle2 } from 'lucide-react'

export interface TrustedDevice {
  id: string
  name: string
  addedOn: string
  icon: 'laptop' | 'mobile'
}

interface TrustedDevicesProps {
  devices: TrustedDevice[]
  onRemove: (id: string) => void
}

export const TrustedDevices: React.FC<TrustedDevicesProps> = ({ devices, onRemove }) => {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="font-heading text-lg font-bold">Trusted Devices</h3>
        <p className="text-sm text-muted-foreground">These devices can log in without requiring 2FA.</p>
      </div>

      <div className="space-y-4">
        {devices.map((device) => (
          <div key={device.id} className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                {device.icon === 'laptop' ? <Laptop className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{device.name}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Added on {device.addedOn}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onRemove(device.id)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors sm:w-auto"
            >
              Remove
            </button>
          </div>
        ))}
        {devices.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No trusted devices found.
          </div>
        )}
      </div>
    </div>
  )
}
