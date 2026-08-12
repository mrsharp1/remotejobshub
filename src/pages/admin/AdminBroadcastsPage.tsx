import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Send, Loader2, Megaphone, Users, Eye, CheckCircle, Smartphone } from 'lucide-react'
import { broadcastService } from '@/services/marketplace/broadcast.service'
import { Broadcast } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { DeviceNotificationControl } from '@/features/notifications/components/DeviceNotificationControl'

export const AdminBroadcastsPage: React.FC = () => {
  const { user } = useAuthStore()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState<Broadcast['audience_filter']>('everyone')
  const [category, setCategory] = useState('system')
  const [priority, setPriority] = useState('informational')
  const [targetUrl, setTargetUrl] = useState('')
  
  const [isSending, setIsSending] = useState(false)

  // Fetch broadcasts list
  const {
    data: broadcasts = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-broadcasts'],
    queryFn: () => broadcastService.getBroadcasts(),
  })

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !message) return
    setIsSending(true)
    try {
      await broadcastService.createBroadcast(
        title,
        message,
        audience,
        null, // No image URL for now
        targetUrl || null,
        null, // Immediate send
        category,
        priority as 'critical' | 'important' | 'informational' | 'promotional'
      )
      // Note: broadcastService would need updating to support category/priority if we wanted to save it, 
      // but for this phase we are passing targetUrl to the linkUrl field which is fine.
      setTitle('')
      setMessage('')
      setTargetUrl('')
      await refetch()
      toast.success('Broadcast dispatch initialized successfully!')
    } catch (error: any) {
      toast.error(`Broadcast failed: ${error.message || 'Unknown error'}`)
      console.error('Broadcast dispatch error:', error)
    } finally {
      setIsSending(false)
    }
  }

  // Live preview helpers
  const getPreviewIcon = () => {
    if (priority === 'critical') return '🚨'
    switch (category) {
      case 'security': return '🛡️'
      case 'orders': return '🛍️'
      case 'payments': return '💳'
      case 'messages': return '💬'
      case 'verification': return '✅'
      case 'disputes': return '⚖️'
      case 'promotions': return '🎁'
      case 'system':
      case 'announcements':
      default: return '📢'
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Platform Public Relations Office
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Admin Broadcast Command Centre
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Push targeted in-app notifications and device alerts directly to system users.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Composition panel */}
        <div className="space-y-6 lg:col-span-6 xl:col-span-5">
          {/* Admin Push Notifications */}
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <div>
              <h3 className="flex items-center gap-1 font-heading text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                <Smartphone className="h-4 w-4 text-primary" /> Admin Device Notifications
              </h3>
            </div>
            <DeviceNotificationControl userId={user?.id} />
          </div>

          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <div>
              <h3 className="flex items-center gap-1 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                <Megaphone className="h-4 w-4 text-primary" /> Compose Notification
              </h3>
            </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase text-muted-foreground">
                Audience Filter Group
              </label>
              <select
                value={audience}
                onChange={(e) =>
                  setAudience(e.target.value as Broadcast['audience_filter'])
                }
                className="w-full rounded-lg border bg-background p-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="everyone">Everyone (All Profiles)</option>
                <option value="buyers">Buyers Only</option>
                <option value="sellers">Sellers Only</option>
                <option value="verified_sellers">Verified Sellers Only</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border bg-background p-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="system">System</option>
                    <option value="security">Security</option>
                    <option value="orders">Orders</option>
                    <option value="payments">Payments</option>
                    <option value="messages">Messages</option>
                    <option value="verification">Verification</option>
                    <option value="disputes">Disputes</option>
                    <option value="announcements">Announcements</option>
                    <option value="promotions">Promotions</option>
                  </select>
               </div>
               <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase text-muted-foreground">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-lg border bg-background p-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="important">Important</option>
                    <option value="informational">Informational</option>
                    <option value="promotional">Promotional</option>
                  </select>
               </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase text-muted-foreground">
                Notification Title
              </label>
              <input
                type="text"
                placeholder="Platform System Upgrade Scheduled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border bg-background p-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase text-muted-foreground">
                Notification Message
              </label>
              <textarea
                placeholder="Compose your rich text markdown announcement here..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border bg-background p-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase text-muted-foreground">
                Destination (Target URL)
              </label>
              <input
                type="text"
                placeholder="/dashboard/orders or /admin/disputes"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full rounded-lg border bg-background p-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none font-mono"
              />
              <p className="text-[9px] text-muted-foreground mt-1">
                The exact application route the user will be taken to when clicking the notification.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="hover:bg-primary/95 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold text-primary-foreground transition-colors disabled:opacity-60 shadow-md mt-2"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" /> Dispatch Immediate Broadcast
                </>
              )}
            </button>
          </form>
        </div>
        </div>

        {/* Right Column: Preview & History */}
        <div className="space-y-6 lg:col-span-6 xl:col-span-7">
           
          {/* Live Preview Pane */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
             <h3 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-primary mb-4">
               <Smartphone className="h-4 w-4" /> Live Device Preview
             </h3>
             <div className="bg-background rounded-2xl border shadow-xl p-4 max-w-sm mx-auto overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                     <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
                        <Megaphone className="h-3 w-3 text-primary-foreground" />
                     </div>
                     <span className="text-[10px] font-bold text-foreground">Remote Jobs Hub</span>
                   </div>
                   <span className="text-[10px] text-muted-foreground">now</span>
                </div>
                
                <div className="flex gap-3">
                   <div className="text-xl shrink-0 pt-0.5">{getPreviewIcon()}</div>
                   <div>
                     <h4 className="font-bold text-sm text-foreground leading-tight">
                        {title || 'Notification Title'}
                     </h4>
                     <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">
                        {message || 'Your notification message will appear here. It should be concise and actionable.'}
                     </p>
                   </div>
                </div>
                
                {targetUrl && (
                  <div className="mt-3 pt-3 border-t border-border flex justify-end">
                     <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Tap to view</span>
                  </div>
                )}
             </div>
          </div>

          {/* History */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                Dispatched Broadcasts History
              </h3>
            </div>

            <div className="divide-border/50 divide-y max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : broadcasts.length === 0 ? (
                <div className="py-12 text-center text-xs italic text-muted-foreground">
                  No announcements dispatched yet.
                </div>
              ) : (
                broadcasts.map((b: Broadcast) => (
                  <div
                    key={b.id}
                    className="hover:bg-muted/30 space-y-2 p-4 text-xs transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{b.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] uppercase tracking-wider font-bold bg-muted px-1.5 py-0.5 rounded text-foreground/80">
                            {b.audience_filter}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {new Date(b.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground mt-1.5 pr-4">
                      {b.message}
                    </p>

                    {b.link_url && (
                       <p className="text-[10px] font-mono text-primary truncate mt-1">
                          Target: {b.link_url}
                       </p>
                    )}

                    <div className="flex items-center gap-4 pt-2 mt-2 border-t border-border/40 font-mono text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> {b.sent_count} sent
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />{' '}
                        {b.delivered_count} delivered
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5 text-primary" />{' '}
                        {b.read_count} read
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminBroadcastsPage
