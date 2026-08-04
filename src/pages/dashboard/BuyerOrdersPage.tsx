import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/marketplace/order.service'
import { walletService } from '@/services/marketplace/wallet.service'
import { notificationService } from '@/services/marketplace/notification.service'
import type { Order, Notification } from '@/types'

import { BuyerHero } from '@/components/buyer/BuyerHero'
import { OrderOverview } from '@/components/buyer/OrderOverview'
import { OrderCard } from '@/components/buyer/OrderCard'
import { OrderDetailsDrawer } from '@/components/buyer/OrderDetailsDrawer'
import { EmptyOrders } from '@/components/buyer/EmptyOrders'
import { LoadingSkeleton } from '@/components/buyer/LoadingSkeleton'

export const BuyerOrdersPage: React.FC = () => {
  const { user, profile } = useAuthStore()
  const userId = user?.id ?? ''
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['buyer-orders', userId],
    queryFn: () => {
      if (!userId) throw new Error('No user authenticated')
      return orderService.getBuyerOrders(userId)
    },
    enabled: !!userId,
  })

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['buyer-wallet', userId],
    queryFn: () => walletService.getWallet(userId),
    enabled: !!userId,
  })

  const { data: notifications = [], isLoading: notifsLoading } = useQuery({
    queryKey: ['buyer-notifications', userId],
    queryFn: () => notificationService.getNotifications(userId),
    enabled: !!userId,
  })

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedOrder(null), 300) // allow animation to finish
  }

  const isLoading = ordersLoading || walletLoading || notifsLoading

  if (isLoading) {
    return <LoadingSkeleton />
  }

  const activeOrdersCount = orders.filter(o => 
    o.status !== 'completed' && o.status !== 'cancelled' && o.status !== 'disputed'
  ).length

  const escrowBalance = wallet?.pending_balance ?? 0
  const unreadNotifsCount = notifications.filter((n: Notification) => !n.is_read).length

  return (
    <div className="min-h-screen bg-slate-950 pb-32">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        
        <BuyerHero 
          fullName={profile?.full_name ?? 'Buyer'}
          activeOrdersCount={activeOrdersCount}
          escrowBalance={escrowBalance}
          unreadNotifsCount={unreadNotifsCount}
        />

        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            
            {/* Left Column: Orders List */}
            <div className="space-y-6 lg:col-span-12">
              <OrderOverview orders={orders} />
              
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-bold text-white">Your Purchases</h2>
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onClick={handleOpenOrder} 
                    />
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>

      <OrderDetailsDrawer 
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  )
}
