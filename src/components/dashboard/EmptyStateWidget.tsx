import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'

interface EmptyStateWidgetProps {
  isBuyer?: boolean
}

export const EmptyStateWidget: React.FC<EmptyStateWidgetProps> = ({ isBuyer = true }) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
        <ShoppingBag className="h-6 w-6" />
      </div>
      <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
        No active orders found
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {isBuyer
          ? 'Browse listings in our secure marketplace to purchase your first account.'
          : 'Setup your KYC verification profile and create a seller listing.'}
      </p>
      <Link
        to={isBuyer ? '/marketplace' : '/seller'}
        className="group mt-6 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 transition-all hover:bg-indigo-700"
      >
        {isBuyer ? 'Browse Marketplace' : 'Go to Seller Studio'}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}
