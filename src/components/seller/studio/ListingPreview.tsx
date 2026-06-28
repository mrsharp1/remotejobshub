import React, { useState } from 'react'
import {
  Globe,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Listing } from '@/types'

interface ListingPreviewProps {
  listing: Partial<Listing> & { images?: string[]; tags?: string[] }
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
}

export const ListingPreview: React.FC<ListingPreviewProps> = ({
  listing,
  onBack,
  onSubmit,
  submitting,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const images = (listing.images as unknown as string[]) || []
  const tags = (listing.tags as unknown as string[]) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="rounded-lg border bg-background p-2 text-foreground hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Listing Preview
          </h2>
          <p className="text-xs text-muted-foreground">
            Review how your Remote Jobs Hub listing will be presented to
            potential buyers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left column: images, details */}
        <div className="space-y-6 lg:col-span-8">
          {/* Main Image View */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
            {images.length > 0 ? (
              <>
                <img
                  src={images[activeImageIdx]}
                  alt="Listing Detail view"
                  className="h-full w-full object-cover"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <Eye className="h-12 w-12" />
                <span className="mt-2 text-sm">No preview images uploaded</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {images.map((url, idx) => (
                <button
                  key={url}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded border ${
                    idx === activeImageIdx
                      ? 'border-transparent ring-2 ring-primary'
                      : 'border-border'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Title & Platform Header */}
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-extrabold text-foreground">
              {listing.title || 'Untitled Listing'}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/10 rounded px-2.5 py-1 text-xs font-semibold text-primary">
                {listing.platform || 'Unknown platform'}
              </span>
              <span className="flex items-center gap-1 rounded bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                <Globe className="h-3 w-3" /> {listing.country || 'Global'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Listing Description
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {listing.description || 'No description set.'}
            </p>
          </div>

          {/* Reason for selling */}
          {listing.reason_for_sale && (
            <div className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Reason for Sale
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {listing.reason_for_sale}
              </p>
            </div>
          )}
        </div>

        {/* Right column: Purchase, trust stats */}
        <div className="space-y-6 lg:col-span-4">
          {/* Price Card */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">
                Asking Price
              </span>
              <h2 className="flex items-center font-heading text-3xl font-extrabold text-primary">
                <DollarSign className="h-7 w-7" />
                {Number(listing.price || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>

            <div className="border-border/60 my-4 border-t" />

            {/* Quick Metrics */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Age</span>
                <span className="font-semibold text-foreground">
                  {listing.account_age || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Earnings</span>
                <span className="flex items-center font-semibold text-foreground">
                  <DollarSign className="h-3.5 w-3.5" />
                  {Number(listing.monthly_income || 0).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                  /mo
                </span>
              </div>
            </div>
          </div>

          {/* Trust Checklists Card */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-md font-heading font-bold text-foreground">
              Trust & Asset Verification
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  Original Email Included
                </span>
                {listing.original_email_included ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="text-muted-foreground/50 h-5 w-5" />
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  Recovery Email Included
                </span>
                {listing.recovery_email_included ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="text-muted-foreground/50 h-5 w-5" />
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  Phone Number Included
                </span>
                {listing.phone_included ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="text-muted-foreground/50 h-5 w-5" />
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  Identity Verified Owner
                </span>
                {listing.identity_verified ? (
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="text-muted-foreground/50 h-5 w-5" />
                )}
              </div>
            </div>
          </div>

          {/* Tag Chips Card */}
          {tags && tags.length > 0 && (
            <div className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-heading text-sm font-bold text-foreground">
                Metadata Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Submission Buttons */}
          <div className="pt-2">
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {submitting
                ? 'Submitting review request...'
                : 'Confirm & Submit for Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
