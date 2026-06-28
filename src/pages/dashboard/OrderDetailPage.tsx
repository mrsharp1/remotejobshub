import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle,
  FileText,
  DollarSign,
  ArrowRight,
  MessageSquare,
} from 'lucide-react'
import { orderService } from '@/services/marketplace/order.service'
import { useAuthStore } from '@/stores/authStore'
import { Order, OrderMessage, OrderTimeline } from '@/types'
import { EscrowProgress } from '@/components/marketplace/EscrowProgress'

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messageText, setMessageText] = useState('')
  const [timeline, setTimeline] = useState<OrderTimeline[]>([])
  const [messages, setMessages] = useState<OrderMessage[]>([])
  const [sendingMsg, setSendingMsg] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Fetch Order
  const {
    data: order,
    isLoading: loadingOrder,
    isError: orderError,
    refetch: refetchOrder,
  } = useQuery({
    queryKey: ['order-detail', id],
    queryFn: () => {
      if (!id) throw new Error('No order ID provided')
      return orderService.getOrder(id)
    },
    enabled: !!id,
  })

  // Fetch Messages & Timeline once order loads
  const loadOrderTimeline = async () => {
    if (!id) return
    try {
      const data = await orderService.getTimeline(id)
      setTimeline(data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadOrderMessages = async () => {
    if (!id) return
    try {
      const data = await orderService.getOrderMessages(id)
      setMessages(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (order?.id) {
      loadOrderTimeline()
      loadOrderMessages()
    }
  }, [order?.id])

  // Scroll to bottom of message logs
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check permissions: User must be buyer or seller
  const isParticipant = useMemo(() => {
    if (!user || !order) return false
    return order.buyer_id === user.id || order.seller_id === user.id
  }, [user, order])

  const isBuyer = useMemo(() => {
    return order?.buyer_id === user?.id
  }, [order, user])

  const isSeller = useMemo(() => {
    return order?.seller_id === user?.id
  }, [order, user])

  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !id || !user?.id) return

    setSendingMsg(true)
    try {
      const newMsg = await orderService.sendMessage(
        id,
        user.id,
        messageText.trim()
      )
      setMessages((prev) => [...prev, newMsg])
      setMessageText('')
    } catch (err) {
      console.error(err)
    } finally {
      setSendingMsg(false)
    }
  }

  // Handle Order Status Transitions
  const handleTransitionStatus = async (
    status: Order['status'],
    notes: string
  ) => {
    if (!id) return
    setUpdatingStatus(true)
    try {
      await orderService.updateOrderStatus(id, status, notes)
      refetchOrder()
      loadOrderTimeline()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loadingOrder) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (orderError || !order) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="font-heading text-lg font-bold text-foreground">
          Order not found
        </h2>
        <p className="text-sm text-muted-foreground">
          This order does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
        >
          Browse Marketplace
        </Link>
      </div>
    )
  }

  if (!isParticipant) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="font-heading text-lg font-bold text-foreground">
          Access Denied
        </h2>
        <p className="text-sm text-muted-foreground">
          You are not authorized to view this transaction details.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
        >
          Browse Marketplace
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4">
      {/* Title Header */}
      <div className="border-border/40 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Escrow Order Registry
          </span>
          <h1 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Order Reference: #{order.id.slice(0, 8)}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status Badge:</span>
          <span className="bg-primary/10 border-primary/20 rounded border px-2.5 py-1 text-xs font-bold capitalize text-primary">
            {order.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Escrow Progress visual tracker */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-6 border-b pb-3 font-heading text-sm font-bold text-foreground">
          Escrow Milestone Stages
        </h3>
        <EscrowProgress status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Messages Chat feed and Timeline updates */}
        <div className="space-y-8 lg:col-span-8">
          {/* Timeline Tracking */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="border-b pb-2 font-heading text-sm font-bold text-foreground">
              Timeline History
            </h3>
            <div className="space-y-4">
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-3 text-xs leading-relaxed"
                >
                  <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  <div>
                    <span className="font-bold capitalize text-foreground">
                      {event.status.replace('_', ' ')}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                    {event.notes && (
                      <p className="mt-0.5 text-muted-foreground">
                        {event.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex h-[400px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="bg-muted/40 flex items-center gap-2 border-b border-border px-4 py-3">
              <MessageSquare className="h-4.5 w-4.5 text-muted-foreground" />
              <h4 className="text-sm font-bold text-foreground">
                Escrow Handoff Chat
              </h4>
            </div>

            {/* Message Feed */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-sm rounded-xl px-4 py-2.5 shadow-sm ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold uppercase opacity-80">
                            {msg.sender?.full_name || 'Participant'}
                          </span>
                          <span className="text-[8px] opacity-60">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-xs leading-relaxed">
                          {msg.message_text}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No chat logs found. Send a message below to coordinate
                  details.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Send Form */}
            <form
              onSubmit={handleSendMessage}
              className="bg-muted/40 flex gap-2 border-t border-border p-3"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your handoff details here..."
                disabled={sendingMsg}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={sendingMsg || !messageText.trim()}
                className="rounded-lg bg-primary px-3 py-1.5 text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {sendingMsg ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Escrow Actions & Listing Details */}
        <div className="space-y-6 lg:col-span-4">
          {/* Action Triggers Grid depending on active status state */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="border-b pb-3 font-heading text-sm font-bold text-foreground">
              Escrow Actions
            </h3>

            {updatingStatus ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {/* Step 1 & 2: Payment Pending Simulation */}
                {(order.status === 'pending' ||
                  order.status === 'payment_pending') && (
                  <button
                    onClick={() =>
                      handleTransitionStatus(
                        'payment_received',
                        'Payment received successfully in escrow. Awaiting seller credential release.'
                      )
                    }
                    className="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow hover:opacity-90"
                  >
                    Simulate Payment Receipt
                  </button>
                )}

                {/* Step 3: Payment Received -> Awaiting Seller release */}
                {order.status === 'payment_received' && isSeller && (
                  <button
                    onClick={() =>
                      handleTransitionStatus(
                        'seller_processing',
                        'Seller has marked credentials as released. Awaiting buyer verification review.'
                      )
                    }
                    className="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow hover:opacity-90"
                  >
                    Mark Credentials Delivered
                  </button>
                )}

                {order.status === 'payment_received' && isBuyer && (
                  <p className="text-center text-xs text-muted-foreground">
                    Awaiting seller delivery of account details.
                  </p>
                )}

                {/* Step 4: Seller processing -> Buyer Review */}
                {order.status === 'seller_processing' && isSeller && (
                  <button
                    onClick={() =>
                      handleTransitionStatus(
                        'buyer_review',
                        'Listing details submitted for final review.'
                      )
                    }
                    className="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow hover:opacity-90"
                  >
                    Submit for Buyer Review
                  </button>
                )}

                {order.status === 'seller_processing' && isBuyer && (
                  <p className="text-center text-xs text-muted-foreground">
                    Seller is currently processing details.
                  </p>
                )}

                {/* Step 5: Buyer Review -> Completed / Disputed */}
                {order.status === 'buyer_review' && isBuyer && (
                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleTransitionStatus(
                          'completed',
                          'Escrow completed. Funds successfully dispatched to seller.'
                        )
                      }
                      className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow hover:opacity-90"
                    >
                      Approve & Complete Escrow
                    </button>
                    <button
                      onClick={() =>
                        handleTransitionStatus(
                          'disputed',
                          'Buyer has opened an escrow dispute. Staff review pending.'
                        )
                      }
                      className="w-full rounded-lg border border-orange-500 py-2.5 text-xs font-semibold text-orange-600 hover:bg-orange-500/10"
                    >
                      Open Dispute
                    </button>
                  </div>
                )}

                {order.status === 'buyer_review' && isSeller && (
                  <p className="text-center text-xs text-muted-foreground">
                    Submitted. Awaiting buyer review completion.
                  </p>
                )}

                {/* Completed / Cancelled terminal status views */}
                {order.status === 'completed' && (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-xs font-semibold text-emerald-600">
                    Order completed successfully.
                  </div>
                )}

                {order.status === 'cancelled' && (
                  <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-3 text-center text-xs font-semibold text-destructive">
                    Order has been cancelled.
                  </div>
                )}

                {order.status === 'disputed' && (
                  <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-3 text-center text-xs font-semibold text-orange-600">
                    Escrow under review.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Listing summary metadata details */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="border-b pb-3 font-heading text-sm font-bold text-foreground">
              Listing Summary
            </h3>
            {order.listing && (
              <div className="space-y-3">
                <span className="bg-primary/10 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                  {order.listing.platform}
                </span>
                <h4 className="font-heading text-xs font-bold leading-snug text-foreground">
                  {order.listing.title}
                </h4>
                <div className="border-border/50 space-y-1.5 border-t pt-3 text-[11px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Listing price:</span>
                    <span className="font-bold text-foreground">
                      ${Number(order.listing.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Country:</span>
                    <span className="font-bold text-foreground">
                      {order.listing.country}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default OrderDetailPage
