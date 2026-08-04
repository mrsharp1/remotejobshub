import React from 'react'

export const OrderInformation: React.FC = () => {
  // Generate random IDs for visual representation (will be replaced by real IDs in backend later)
  const orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase()
  const escrowId = 'ESC-' + Math.random().toString(36).substring(2, 9).toUpperCase()

  return (
    <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-900/30 p-6">
      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
        Transaction Details
      </h3>
      <div className="grid grid-cols-2 gap-y-4 text-sm sm:grid-cols-3">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Order ID</span>
          <span className="font-mono text-slate-300">{orderId}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Escrow ID</span>
          <span className="font-mono text-slate-300">{escrowId}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Expected Delivery</span>
          <span className="font-mono text-slate-300">{"< 24 Hours"}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Verification Deadline</span>
          <span className="font-mono text-slate-300">3 Days</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Seller Response Time</span>
          <span className="font-mono text-slate-300">{"< 1 Hour"}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Transaction Status</span>
          <span className="font-mono text-indigo-400">Pending Payment</span>
        </div>
      </div>
    </div>
  )
}
