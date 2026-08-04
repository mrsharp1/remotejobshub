import React from 'react'
import {
  X,
  ArrowRightLeft,
  DollarSign,
  Globe,
  Clock,
  ShieldCheck,
  TrendingUp,
  Star,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useComparisonStore } from '@/stores/comparisonStore'
import { Listing } from '@/types'
import { Link } from 'react-router-dom'

function computeScore(listing: Listing): number {
  let s = 60
  if (listing.identity_verified) s += 10
  if (listing.seller?.seller_verified) s += 10
  if (listing.phone_included) s += 5
  if (listing.original_email_included) s += 8
  if (listing.recovery_email_included) s += 5
  if (
    listing.account_age &&
    !['< 1 year', 'Less than 1 year'].includes(listing.account_age)
  )
    s += 7
  return Math.min(99, s)
}

interface CompareRowProps {
  label: string
  icon: React.ElementType
  values: React.ReactNode[]
  highlight?: boolean
}

const CompareRow: React.FC<CompareRowProps> = ({
  label,
  icon: Icon,
  values,
  highlight,
}) => (
  <tr className={`border-b border-border ${highlight ? 'bg-primary/5' : ''}`}>
    <td className="whitespace-nowrap py-3 pl-4 pr-2 text-xs font-semibold text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${highlight ? 'text-primary' : ''}`} />
        {label}
      </div>
    </td>
    {values.map((v, i) => (
      <td key={i} className="px-3 py-3 text-center">
        {v}
      </td>
    ))}
  </tr>
)

export const ListingComparison: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isModalOpen,
    closeModal,
  } = useComparisonStore()

  if (!isModalOpen || compareList.length < 2) return null

  const scores = compareList.map((l) => computeScore(l))
  const bestScore = Math.max(...scores)
  const lowestPrice = Math.min(...compareList.map((l) => l.price))
  const highestIncome = Math.max(
    ...compareList.map((l) => l.monthly_income ?? 0)
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-lg font-bold">Compare Listings</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
            >
              Clear All
            </button>
            <button
              onClick={closeModal}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-auto">
          <table className="w-full table-fixed">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="border-b border-border">
                <th className="w-36 py-4 pl-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Metric
                </th>
                {compareList.map((listing, i) => (
                  <th key={listing.id} className="px-3 py-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        {scores[i] === bestScore && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[8px] font-black text-white">
                            BEST
                          </span>
                        )}
                        <p className="mt-3 line-clamp-2 font-heading text-xs font-bold text-foreground">
                          {listing.title}
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {listing.platform}
                      </p>
                      <button
                        onClick={() => removeFromCompare(listing.id)}
                        className="hover:bg-destructive/10 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="Asking Price"
                icon={DollarSign}
                highlight
                values={compareList.map((l, i) => (
                  <span
                    key={i}
                    className={`font-heading text-base font-black ${l.price === lowestPrice ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}
                  >
                    ₦{Number(l.price).toLocaleString()}
                  </span>
                ))}
              />
              <CompareRow
                label="Health Score"
                icon={ShieldCheck}
                values={compareList.map((_, i) => {
                  const s = scores[i]
                  const color =
                    s >= 80
                      ? 'text-emerald-600'
                      : s >= 60
                        ? 'text-blue-600'
                        : s >= 40
                          ? 'text-amber-600'
                          : 'text-rose-600'
                  return (
                    <span
                      key={i}
                      className={`font-heading text-lg font-black ${color}`}
                    >
                      {s}
                    </span>
                  )
                })}
              />
              <CompareRow
                label="Monthly Income"
                icon={TrendingUp}
                highlight
                values={compareList.map((l, i) => (
                  <span
                    key={i}
                    className={`text-sm font-semibold ${(l.monthly_income ?? 0) === highestIncome && highestIncome > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}
                  >
                    {l.monthly_income
                      ? `₦${Number(l.monthly_income).toLocaleString()}`
                      : 'N/A'}
                  </span>
                ))}
              />
              <CompareRow
                label="Account Age"
                icon={Clock}
                values={compareList.map((l, i) => (
                  <span key={i} className="text-sm font-medium text-foreground">
                    {l.account_age ?? 'N/A'}
                  </span>
                ))}
              />
              <CompareRow
                label="Country"
                icon={Globe}
                values={compareList.map((l, i) => (
                  <span key={i} className="text-sm text-foreground">
                    {l.country}
                  </span>
                ))}
              />
              <CompareRow
                label="Seller Rating"
                icon={Star}
                values={compareList.map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center gap-1"
                  >
                    <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                    <span className="text-sm font-semibold">—</span>
                  </div>
                ))}
              />
              <CompareRow
                label="Identity Verified"
                icon={ShieldCheck}
                values={compareList.map((l, i) =>
                  l.identity_verified ? (
                    <CheckCircle2
                      key={i}
                      className="mx-auto h-5 w-5 text-emerald-500"
                    />
                  ) : (
                    <XCircle
                      key={i}
                      className="mx-auto h-5 w-5 text-slate-300 dark:text-slate-600"
                    />
                  )
                )}
              />
              <CompareRow
                label="Phone Verified"
                icon={ShieldCheck}
                values={compareList.map((l, i) =>
                  l.phone_included ? (
                    <CheckCircle2
                      key={i}
                      className="mx-auto h-5 w-5 text-emerald-500"
                    />
                  ) : (
                    <XCircle
                      key={i}
                      className="mx-auto h-5 w-5 text-slate-300 dark:text-slate-600"
                    />
                  )
                )}
              />
              <CompareRow
                label="Original Email"
                icon={ShieldCheck}
                values={compareList.map((l, i) =>
                  l.original_email_included ? (
                    <CheckCircle2
                      key={i}
                      className="mx-auto h-5 w-5 text-emerald-500"
                    />
                  ) : (
                    <XCircle
                      key={i}
                      className="mx-auto h-5 w-5 text-slate-300 dark:text-slate-600"
                    />
                  )
                )}
              />
            </tbody>
          </table>

          {/* Action Row */}
          <div className="flex border-t border-border bg-slate-50 dark:bg-slate-800/50">
            <div className="w-36 px-4 py-4 text-xs font-semibold text-muted-foreground">
              Actions
            </div>
            {compareList.map((l) => (
              <div key={l.id} className="flex-1 px-3 py-4 text-center">
                <Link
                  to={`/listing/${l.id}`}
                  onClick={closeModal}
                  className="hover:bg-primary/90 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5"
                >
                  View Listing
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Sticky bar at the bottom of the marketplace page */
export const ComparisonBar: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, openModal } =
    useComparisonStore()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-slate-900 shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="scrollbar-hide flex flex-1 items-center gap-3 overflow-x-auto">
          <span className="whitespace-nowrap text-xs font-bold text-white">
            Comparing ({compareList.length}/3):
          </span>
          {compareList.map((l) => (
            <div
              key={l.id}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white"
            >
              <span className="max-w-[120px] truncate font-semibold">
                {l.title}
              </span>
              <button
                onClick={() => removeFromCompare(l.id)}
                className="text-white/60 transition-colors hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={clearCompare}
            className="text-xs font-medium text-white/60 transition-colors hover:text-white"
          >
            Clear
          </button>
          <button
            onClick={openModal}
            disabled={compareList.length < 2}
            className="hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Compare Now
          </button>
        </div>
      </div>
    </div>
  )
}
