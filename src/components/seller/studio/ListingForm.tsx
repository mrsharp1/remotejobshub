import React, { useState, useRef } from 'react'
import { storageService } from '@/services/marketplace/storage.service'
import { formatCurrency } from '@/utils/currency'
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Save,
  ShieldCheck,
  CheckCircle,
  Upload,
  Trash2,
  Laptop,
  Tablet as TabletIcon,
  Phone as PhoneIcon,
  Sparkles,
} from 'lucide-react'
import { Listing } from '@/types'
import { CategorySelector } from './CategorySelector'
import { SecureCredentialVault } from './SecureCredentialVault'
import { PricingPanel } from './PricingPanel'
import { SecurityChecklist } from './SecurityChecklist'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

interface ListingFormProps {
  initialData?: Partial<Listing>
  onSaveDraft: (
    data: Partial<Listing>,
    images: string[],
    tags: string[]
  ) => Promise<void>
  onSubmitPreview: (
    data: Partial<Listing>,
    images: string[],
    tags: string[]
  ) => void
  onCancel: () => void
}

export const ListingForm: React.FC<ListingFormProps> = ({
  initialData,
  onSaveDraft,
  onSubmitPreview,
  onCancel,
}) => {
  const { profile, sandboxSession } = useAuthStore()
  const [step, setStep] = useState(1)
  const [savingDraft, setSavingDraft] = useState(false)
  const [success, setSuccess] = useState(false)

  // Step 1: Category selector platform state
  const [platform, setPlatform] = useState(initialData?.platform || 'outlier')

  // Step 2: Account Details
  const [title, setTitle] = useState(initialData?.title || '')
  const [country, setCountry] = useState(initialData?.country || 'US')
  const [accountAge, setAccountAge] = useState(initialData?.account_age || '')
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(
    initialData?.monthly_income || 0
  )
  const [hoursWorked, setHoursWorked] = useState<string>('')
  const [skills, setSkills] = useState<string>('')
  const [longDesc, setLongDesc] = useState(initialData?.description || '')
  const [reasonForSale, setReasonForSale] = useState(
    initialData?.reason_for_sale || ''
  )

  // Step 3: Secure Credential Vault
  const [vaultData, setVaultData] = useState<any>({
    vaultEmail: '',
    vaultPassword: '',
    vaultRecoveryEmail: '',
    vaultRecoveryPhone: '',
    vaultBackupCodes: '',
    vault2faEnabled: false,
    vaultCookies: '',
    vaultInstructions: '',
  })

  // Step 4: Documents Uploads
  const [documents, setDocuments] = useState<string[]>([])
  const [uploadingDocuments, setUploadingDocuments] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 5: Pricing
  const [price, setPrice] = useState<number>(initialData?.price || 0)
  const [negotiable, setNegotiable] = useState(false)
  const [instantBuy, setInstantBuy] = useState(true)

  // Step 6: Preview device state
  const [previewDevice, setPreviewDevice] = useState<
    'desktop' | 'tablet' | 'mobile'
  >('desktop')

  // Step 7 & 8: Review & Publish celebration status
  const kycApproved =
    import.meta.env.DEV && sandboxSession.enabled
      ? sandboxSession.kycStatus === 'approved'
      : profile?.seller_verified || false

  const stepsCount = 8

  const handleNext = () => {
    if (step === 2) {
      if (!title || !accountAge || !longDesc || !reasonForSale) {
        alert(
          'Please fill out listing title, account age, description, and reason for sale.'
        )
        return
      }
    }
    if (step === 5) {
      if (price <= 0) {
        alert('Please set a selling price greater than zero.')
        return
      }
    }
    setStep((s) => Math.min(stepsCount, s + 1))
  }

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1))
  }

  // Format payload for submitting / saving draft
  const getCompiledData = (): Partial<Listing> => {
    const formattedDesc = `=== ACCOUNT METRICS ===\nPlatform: ${platform.toUpperCase()}\nHours worked: ${hoursWorked || 'N/A'}\nSkills: ${skills || 'N/A'}\n\n=== DESCRIPTION ===\n${longDesc}`

    return {
      title,
      platform,
      country,
      account_age: accountAge,
      monthly_income: monthlyRevenue,
      price,
      description: formattedDesc,
      reason_for_sale: reasonForSale,
      vault_data: vaultData,
      original_email_included: !!vaultData.vaultEmail,
      recovery_email_included: !!vaultData.vaultRecoveryEmail,
      phone_included: !!vaultData.vaultRecoveryPhone,
      identity_verified: kycApproved,
    }
  }

  const handleSaveDraftClick = async () => {
    setSavingDraft(true)
    try {
      const data = getCompiledData()
      await onSaveDraft(data, documents, [platform, country])
      toast.success('Listing progress saved as a draft.')
    } catch {
      toast.error('Failed to save draft.')
    } finally {
      setSavingDraft(false)
    }
  }

  const handlePublish = async () => {
    setSavingDraft(true)
    try {
      const data = getCompiledData()
      onSubmitPreview(data, documents, [platform, country])
      setSuccess(true)
    } catch {
      toast.error('Failed to publish listing.')
    } finally {
      setSavingDraft(false)
    }
  }

  const handleDocumentSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const MAX_SIZE = 10 * 1024 * 1024
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp']

    setUploadingDocuments(true)

    try {
      const newUploads: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (!validMimeTypes.includes(file.type)) {
          toast.error(
            `Invalid file type: ${file.name}. Please select a JPG, PNG, or WEBP image.`
          )
          continue
        }

        if (file.size > MAX_SIZE) {
          toast.error(`Image must be 10 MB or smaller: ${file.name}`)
          continue
        }

        const sellerId = profile?.id || 'unknown_seller'
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')
        const path = `sellers/${sellerId}/listings-drafts/${Date.now()}-${Math.random().toString(36).substring(7)}-${safeName}`

        const url = await storageService.uploadFile('listings', path, file)
        newUploads.push(url)
      }

      if (newUploads.length > 0) {
        setDocuments((prev) => [...prev, ...newUploads])
        toast.success('Image uploaded successfully.')
      }
    } catch (err) {
      console.error('Upload error:', err)
      toast.error(
        "We couldn't upload this image. Please check the file type and size and try again."
      )
    } finally {
      setUploadingDocuments(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeDoc = (idx: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== idx))
  }

  if (success) {
    return (
      <div className="animate-in fade-in rounded-3xl border border-white/5 bg-slate-900/60 p-8 text-center shadow-2xl backdrop-blur-xl duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-950/20">
          <Sparkles className="h-8 w-8 animate-bounce" />
        </div>
        <h3 className="mt-6 font-heading text-xl font-bold text-white">
          Listing Ready & Published
        </h3>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-400">
          Your remote work account asset has been published successfully. It is
          now live in the marketplace feed.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="bg-purple-650 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-purple-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
      {/* Sticky Progress Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-white">
            {initialData?.id ? 'Edit Listing' : 'Create New Listing'}
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Step {step} of {stepsCount}:{' '}
            {step === 1
              ? 'Account Category'
              : step === 2
                ? 'Account Details'
                : step === 3
                  ? 'Secure Credentials Vault'
                  : step === 4
                    ? 'Upload Documents'
                    : step === 5
                      ? 'Pricing Setup'
                      : step === 6
                        ? 'Marketplace Preview'
                        : step === 7
                          ? 'Compliance Checklist'
                          : 'Publish Listing'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSaveDraftClick}
            disabled={savingDraft}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/5 bg-slate-950 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-900 disabled:opacity-50"
          >
            {savingDraft ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5 text-purple-400" />
            )}
            Save Draft
          </button>
        </div>
      </div>

      {/* Stepper progress indicator */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-950">
        <div
          className="from-purple-550 to-indigo-650 h-full bg-gradient-to-r transition-all duration-300"
          style={{ width: `${(step / stepsCount) * 100}%` }}
        />
      </div>

      {/* Stepper Body Container */}
      <div className="min-h-[300px]">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <CategorySelector selected={platform} onSelect={setPlatform} />
        )}

        {/* Step 2: Account Details */}
        {step === 2 && (
          <div className="animate-in fade-in space-y-4 duration-200">
            <h4 className="font-heading text-sm font-bold text-white">
              Account Details
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-gray-100">
                  Listing Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Outlier AI Reinforced Learning Level 3 account"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="placeholder-gray-400 w-full rounded-xl border border-white/5 !bg-gray-800 p-3 text-xs !text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-gray-100">
                  Country Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. US, NG, GB"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="placeholder-gray-400 w-full rounded-xl border border-white/5 !bg-gray-800 p-3 text-xs !text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-gray-100">
                  Account Age
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 year, 6 months"
                  value={accountAge}
                  onChange={(e) => setAccountAge(e.target.value)}
                  className="placeholder-gray-400 w-full rounded-xl border border-white/5 !bg-gray-800 p-3 text-xs !text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-gray-100">
                  Monthly Revenue (NGN)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={monthlyRevenue || ''}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="placeholder-gray-400 w-full rounded-xl border border-white/5 !bg-gray-800 p-3 text-xs !text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-gray-100">
                  Hours worked per week
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15-20 hours"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(e.target.value)}
                  className="placeholder-gray-400 w-full rounded-xl border border-white/5 !bg-gray-800 p-3 text-xs !text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-gray-100">
                  Required Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, SQL, reinforcement learning"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="placeholder-gray-400 w-full rounded-xl border border-white/5 !bg-gray-800 p-3 text-xs !text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-gray-100">
                  Detailed Description
                </label>
                <textarea
                  placeholder="Detail account standing, reviews feedback logs, and transaction conditions..."
                  value={longDesc}
                  onChange={(e) => setLongDesc(e.target.value)}
                  rows={3}
                  className="placeholder-gray-400 w-full rounded-xl border border-white/5 !bg-gray-800 p-3 text-xs !text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <label className="mb-1 block text-[10px] font-bold uppercase text-gray-100">
                  Reason for Sale
                </label>
                <textarea
                  placeholder="Why are you selling this account?"
                  value={reasonForSale}
                  onChange={(e) => setReasonForSale(e.target.value)}
                  rows={2}
                  className="placeholder-gray-400 w-full rounded-xl border border-white/5 bg-gray-800 p-3 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
          </div>
        )}

        {/* Step 3: Secure Credential Vault */}
        {step === 3 && (
          <SecureCredentialVault formData={vaultData} onChange={setVaultData} />
        )}

        {/* Step 4: Documents Uploads */}
        {step === 4 && (
          <div className="animate-in fade-in space-y-4 duration-200">
            <div>
              <h4 className="font-heading text-sm font-bold text-white">
                Media screenshots documents
              </h4>
              <p className="text-xs text-slate-400">
                Upload dashboard stats or verification proof to increase buyer
                trust
              </p>
            </div>

            <div
              onClick={() =>
                !uploadingDocuments && fileInputRef.current?.click()
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (!uploadingDocuments) fileInputRef.current?.click()
                }
              }}
              tabIndex={0}
              className={`cursor-pointer rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center transition hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${uploadingDocuments ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleDocumentSelect}
              />
              {uploadingDocuments ? (
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-400" />
              ) : (
                <Upload className="mx-auto h-8 w-8 text-purple-400 group-hover:animate-bounce" />
              )}
              <span className="mt-2 block text-xs font-bold uppercase text-white">
                {uploadingDocuments
                  ? 'Uploading...'
                  : 'Upload Dashboard Screenshot'}
              </span>
              <p className="text-[10px] text-slate-500">
                JPG, PNG, WEBP up to 10MB
              </p>
            </div>

            {documents.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {documents.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-video overflow-hidden rounded-xl border border-white/5 bg-slate-950"
                  >
                    <img
                      src={url}
                      alt="Verification Upload"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeDoc(idx)}
                      className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-rose-500 opacity-0 transition hover:bg-black/90 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Pricing Setup */}
        {step === 5 && (
          <PricingPanel
            price={price}
            onPriceChange={setPrice}
            negotiable={negotiable}
            onNegotiableChange={setNegotiable}
            instantBuy={instantBuy}
            onInstantBuyChange={setInstantBuy}
          />
        )}

        {/* Step 6: Marketplace Preview */}
        {step === 6 && (
          <div className="animate-in fade-in space-y-4 duration-200">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div>
                <h4 className="font-heading text-sm font-black font-bold text-white">
                  Marketplace Preview
                </h4>
                <p className="text-[10px] text-slate-400">
                  See how your listing will render to buyers
                </p>
              </div>

              {/* View Breakpoints toggles */}
              <div className="flex gap-1 rounded-xl border border-white/5 bg-slate-950 p-1">
                {[
                  { key: 'desktop', icon: Laptop },
                  { key: 'tablet', icon: TabletIcon },
                  { key: 'mobile', icon: PhoneIcon },
                ].map((item) => {
                  const Icon = item.icon
                  const isCurrent = previewDevice === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setPreviewDevice(item.key as any)}
                      className={`rounded-lg p-1.5 text-xs font-bold transition ${
                        isCurrent
                          ? 'bg-purple-650 text-white shadow'
                          : 'hover:text-slate-350 text-slate-500'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Flexible Preview Wrapper Frame */}
            <div className="flex justify-center overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 p-6 transition-all duration-300">
              <div
                className={`space-y-4 rounded-2xl border border-white/10 bg-slate-900 p-5 text-xs shadow-xl transition-all duration-300 ${
                  previewDevice === 'desktop'
                    ? 'animate-in w-full max-w-xl'
                    : previewDevice === 'tablet'
                      ? 'w-[420px]'
                      : 'w-[290px]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-purple-400">
                      {platform.toUpperCase()}
                    </span>
                    <h5 className="mt-2 font-heading text-sm font-bold leading-tight text-white">
                      {title || 'Untitled account listing'}
                    </h5>
                  </div>
                  <span className="font-heading font-mono text-base font-black text-white">
                    {formatCurrency(Number(price || 0))}
                  </span>
                </div>

                <div className="space-y-2 rounded-xl border border-white/5 bg-slate-950/40 p-3.5 text-[10px] leading-normal text-slate-400">
                  <div className="flex justify-between">
                    <span>Target Country:</span>
                    <span className="font-semibold text-white">{country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Age:</span>
                    <span className="font-semibold text-white">
                      {accountAge || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Income:</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(Number(monthlyRevenue || 0))}
                    </span>
                  </div>
                </div>

                {documents.length > 0 && (
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/5 bg-slate-950">
                    <img
                      src={documents[0]}
                      alt="Thumbnail Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Security Checklist */}
        {step === 7 && (
          <SecurityChecklist
            kycApproved={kycApproved}
            credentialsVaulted={
              !!vaultData.vaultEmail && !!vaultData.vaultPassword
            }
            documentsUploaded={documents.length > 0}
            priceSet={price > 0}
          />
        )}

        {/* Step 8: Publish Celebration */}
        {step === 8 && (
          <div className="animate-in zoom-in space-y-4 py-6 text-center duration-300">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="h-7 w-7" />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold text-white">
                Listing Ready to Deploy
              </h4>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
                AES-256 keys generated. Credentials securely locked inside
                escrow vaults. Proceed to publish.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Controls */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <button
          type="button"
          onClick={step === 1 ? onCancel : handleBack}
          className="inline-flex items-center gap-1 rounded-xl border border-white/5 bg-slate-900/60 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {step === 1 ? 'Cancel' : 'Back'}
        </button>

        {step < stepsCount ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={uploadingDocuments}
            className="bg-purple-650 inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-purple-700 disabled:opacity-50"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePublish}
            disabled={savingDraft}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {savingDraft ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="h-4.5 w-4.5" /> Publish Listing
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
