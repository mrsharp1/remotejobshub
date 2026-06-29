import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Send, Loader2, Megaphone, Users, Eye, CheckCircle } from 'lucide-react'
import { broadcastService } from '@/services/marketplace/broadcast.service'
import { Broadcast } from '@/types'

export const AdminBroadcastsPage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] =
    useState<Broadcast['audience_filter']>('everyone')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
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
        imageUrl || null,
        linkUrl || null,
        null // Immediate send
      )
      setTitle('')
      setMessage('')
      setImageUrl('')
      setLinkUrl('')
      await refetch()
      alert('Broadcast dispatch initialized successfully!')
    } catch {
      alert('Failed to send broadcast')
    } finally {
      setIsSending(false)
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
          Admin Broadcast Center
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Push target notifications and email alerts directly to system users.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Composition panel */}
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm lg:col-span-5">
          <div>
            <h3 className="flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <Megaphone className="h-4 w-4 text-primary" /> Compose
              Announcement
            </h3>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                Announcement Title
              </label>
              <input
                type="text"
                placeholder="Platform System Upgrade Scheduled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border bg-background p-2 text-xs text-foreground"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                Audience Filter Group
              </label>
              <select
                value={audience}
                onChange={(e) =>
                  setAudience(e.target.value as Broadcast['audience_filter'])
                }
                className="w-full rounded-lg border bg-background p-2 text-xs text-foreground"
              >
                <option value="everyone">Everyone (All Profiles)</option>
                <option value="buyers">Buyers Only</option>
                <option value="sellers">Sellers Only</option>
                <option value="verified_sellers">Verified Sellers Only</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                Announcement Message (Rich Text)
              </label>
              <textarea
                placeholder="Compose your rich text markdown announcement here..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border bg-background p-2 text-xs text-foreground"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                Optional Image URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/banner.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-lg border bg-background p-2 text-xs text-foreground"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                Optional Call-To-Action Link
              </label>
              <input
                type="text"
                placeholder="https://example.com/details"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full rounded-lg border bg-background p-2 text-xs text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="hover:bg-primary/95 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-bold text-white transition-colors disabled:opacity-60"
            >
              {isSending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Dispatch Immediate Broadcast
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Sent log history */}
        <div className="rounded-xl border bg-card shadow-sm lg:col-span-7">
          <div className="border-b p-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Dispatched Broadcasts History
            </h3>
          </div>

          <div className="divide-border/50 divide-y">
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
                  className="hover:bg-muted/10 space-y-2 p-4 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{b.title}</h4>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        Target filter:{' '}
                        <span className="font-semibold uppercase text-primary">
                          {b.audience_filter}
                        </span>
                      </p>
                    </div>
                    <span className="text-[9px] text-muted-foreground">
                      {new Date(b.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-[11px] italic leading-relaxed text-muted-foreground">
                    {b.message}
                  </p>

                  <div className="flex items-center gap-4 pt-1 font-mono text-[9px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> Sent: {b.sent_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />{' '}
                      Delivered: {b.delivered_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-primary" /> Read:{' '}
                      {b.read_count}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminBroadcastsPage
