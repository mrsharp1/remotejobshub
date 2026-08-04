import React, { useEffect } from 'react'
import { CheckCircle2, Clock, Server, Shield, MessageSquare, HardDrive } from 'lucide-react'

export const PlatformStatusPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const services = [
    { name: 'Marketplace Engine', status: 'operational', uptime: '99.99%', icon: Server },
    { name: 'Escrow & Payments', status: 'operational', uptime: '100%', icon: Shield },
    { name: 'Authentication', status: 'operational', uptime: '99.98%', icon: CheckCircle2 },
    { name: 'Realtime Messaging', status: 'operational', uptime: '99.95%', icon: MessageSquare },
    { name: 'Storage & Media', status: 'operational', uptime: '99.99%', icon: HardDrive },
  ]

  const incidents = [
    { date: 'Oct 10, 2026', title: 'Routine Maintenance', status: 'Resolved', desc: 'Database index optimizations completed successfully with zero downtime.' },
    { date: 'Sep 22, 2026', title: 'Payment Gateway Delay', status: 'Resolved', desc: 'A third-party payment provider experienced a 15-minute delay in webhook processing. All transactions were queued and processed successfully.' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      
      {/* Status Header */}
      <section className="bg-background border-b py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold font-heading mb-2">Platform Status</h1>
              <p className="text-muted-foreground">Current operational status of Remote Jobs Hub systems.</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg">All Systems Operational</div>
                <div className="text-sm opacity-80">Last updated: Just now</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 border-b bg-muted/30">
              <h2 className="text-lg font-bold font-heading">Core Services</h2>
            </div>
            <div className="divide-y divide-border">
              {services.map(service => (
                <div key={service.name} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <service.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold">{service.name}</div>
                      <div className="text-sm text-muted-foreground">Uptime: {service.uptime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Operational
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Incidents */}
          <h2 className="text-2xl font-bold font-heading mb-6">Past Incidents</h2>
          <div className="space-y-6">
            {incidents.map((incident, i) => (
              <div key={i} className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-bold text-lg">{incident.title}</div>
                  <div className="text-sm font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                    {incident.status}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{incident.desc}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" /> {incident.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
