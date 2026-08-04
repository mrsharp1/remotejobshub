import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getOrderStatusDisplayLabel } from '@/utils/OrderStatusMapper'
import { formatCurrency } from '@/utils/currency'

interface Order {
  id: string
  amount: number
  status: string
  created_at: string
}

interface OrderOverviewProps {
  orders: Order[]
  isSeller?: boolean
}

export const OrderOverview: React.FC<OrderOverviewProps> = ({
  orders = [],
  isSeller = false,
}) => {
  const getStatusStep = (status: string) => {
    switch (status) {
      case 'completed':
        return 4
      case 'credentials_delivered':
      case 'delivered':
        return 3
      case 'paid':
      case 'escrow_funded':
        return 2
      default:
        return 1
    }
  }

  const getStatusLabel = (status: string) => {
    return getOrderStatusDisplayLabel(status as any)
  }

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    if (status === 'disputed') return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    if (status === 'cancelled') return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
          Active Contracts
        </h2>
        <Link
          to={isSeller ? '/seller/orders' : '/dashboard/orders'}
          className="group flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          View All Contracts
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {orders.slice(0, 3).map((order) => {
          const currentStep = getStatusStep(order.status)
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="premium-card p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="mt-2 font-heading text-2xl font-black text-slate-900 dark:text-white">
                    {formatCurrency(order.amount)}
                  </p>
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-100 px-4 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                >
                  Verify Handover
                </Link>
              </div>

              {/* Progress Stepper (Only show if not cancelled or disputed) */}
              {order.status !== 'cancelled' && order.status !== 'disputed' && (
                <div className="mt-6">
                  <div className="relative flex justify-between text-xs font-bold text-slate-400">
                    <span className={currentStep >= 1 ? 'text-indigo-500' : ''}>1. Fund Vault</span>
                    <span className={currentStep >= 2 ? 'text-indigo-500' : ''}>2. Locked</span>
                    <span className={currentStep >= 3 ? 'text-indigo-500' : ''}>3. Delivery</span>
                    <span className={currentStep >= 4 ? 'text-indigo-500' : ''}>4. Release</span>
                  </div>
                  <div className="relative mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
