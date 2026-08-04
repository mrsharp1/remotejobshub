import React, { useState } from 'react'
import { Landmark, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export const WithdrawalsCenter: React.FC = () => {
  const [requests, setRequests] = useState([
    { id: 'W-982', seller: 'Niyi Adedapo', bank: 'Access Bank Nigeria', account: '*****4810', amount: 1200, status: 'pending' },
    { id: 'W-981', seller: 'Sarah Chen', bank: 'Silicon Valley Bank', account: '*****9012', amount: 3500, status: 'processing' },
    { id: 'W-980', seller: 'Liam Henderson', bank: 'Barclays Bank UK', account: '*****3381', amount: 980, status: 'paid' },
  ])

  const handleAction = (id: string, action: 'paid' | 'rejected') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    )
    toast.success(`Withdrawal request ${id} updated to ${action.toUpperCase()}`)
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-indigo-400" />
            <h3 className="font-heading text-base font-bold text-white">Withdrawals Center</h3>
          </div>
          <p className="text-[11px] text-slate-400">Approve payout requests from vendor balances</p>
        </div>
        <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[9px] font-bold text-indigo-400 uppercase">
          {requests.filter((r) => r.status === 'pending' || r.status === 'processing').length} Pending
        </span>
      </div>

      <div className="space-y-3">
        {requests.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-4 rounded-xl border border-white/5 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white">{r.id}</span>
                <span className="text-[10px] text-slate-500">{r.bank} • {r.account}</span>
              </div>
              <p className="text-xs font-bold text-slate-300">{r.seller}</p>
              <span className="block font-mono text-xs font-bold text-indigo-400">
                ₦{r.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {r.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleAction(r.id, 'paid')}
                    className="rounded-lg bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white px-3 py-1.5 text-[10px] font-bold text-emerald-400 transition-all"
                  >
                    Approve Payout
                  </button>
                  <button
                    onClick={() => handleAction(r.id, 'rejected')}
                    className="rounded-lg bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600 hover:text-white px-3 py-1.5 text-[10px] font-bold text-rose-400 transition-all"
                  >
                    Reject
                  </button>
                </>
              )}
              {r.status === 'processing' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Processing
                </span>
              )}
              {r.status === 'paid' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Paid Out
                </span>
              )}
              {r.status === 'rejected' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-2.5 py-1">
                  <XCircle className="h-3.5 w-3.5" /> Rejected
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
