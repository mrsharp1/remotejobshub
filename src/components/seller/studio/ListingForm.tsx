import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowLeft, ArrowRight, Save } from 'lucide-react'
import { Listing } from '@/types'
import { zodResolver } from '@/utils/resolver'
import { ListingImageUploader } from './ListingImageUploader'
import { TagInput } from './TagInput'

const listingFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  platform: z.string().min(1, 'Platform is required'),
  country: z.string().min(1, 'Country is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  reason_for_sale: z.string().optional(),
  account_age: z.string().min(1, 'Account age is required'),
  monthly_income: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().nonnegative('Monthly income must be a positive number')
  ),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive('Price must be greater than 0')
  ),
  original_email_included: z.boolean().default(false),
  recovery_email_included: z.boolean().default(false),
  phone_included: z.boolean().default(false),
  identity_verified: z.boolean().default(false),
})

type ListingFormData = z.infer<typeof listingFormSchema>

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
  const [step, setStep] = useState(1)
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((img) => img.image_url) || []
  )
  const [tags, setTags] = useState<string[]>(
    initialData?.tags?.map((t) => t.tag) || []
  )
  const [savingDraft, setSavingDraft] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isValid },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: initialData?.title || '',
      platform: initialData?.platform || '',
      country: initialData?.country || '',
      description: initialData?.description || '',
      reason_for_sale: initialData?.reason_for_sale || '',
      account_age: initialData?.account_age || '',
      monthly_income: initialData?.monthly_income || 0,
      price: initialData?.price || 0,
      original_email_included: initialData?.original_email_included || false,
      recovery_email_included: initialData?.recovery_email_included || false,
      phone_included: initialData?.phone_included || false,
      identity_verified: initialData?.identity_verified || false,
    },
  })

  const handleNext = async () => {
    let fieldsToValidate: (keyof ListingFormData)[] = []
    if (step === 1) {
      fieldsToValidate = [
        'title',
        'platform',
        'country',
        'description',
        'reason_for_sale',
      ]
    } else if (step === 2) {
      fieldsToValidate = [
        'account_age',
        'monthly_income',
        'original_email_included',
        'recovery_email_included',
        'phone_included',
        'identity_verified',
      ]
    } else if (step === 3) {
      fieldsToValidate = ['price']
    }

    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid) {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleSaveDraftClick = async () => {
    setSavingDraft(true)
    try {
      const data = getValues()
      await onSaveDraft(data, images, tags)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingDraft(false)
    }
  }

  const onFormSubmit = (data: ListingFormData) => {
    onSubmitPreview(data, images, tags)
  }

  const stepsCount = 5

  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Form Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            {initialData?.id ? 'Edit Listing' : 'Create New Listing'}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Step {step} of {stepsCount}:{' '}
            {step === 1
              ? 'General Information'
              : step === 2
                ? 'Account Details'
                : step === 3
                  ? 'Pricing Info'
                  : step === 4
                    ? 'Media Gallery'
                    : 'Metadata Tags'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSaveDraftClick}
            disabled={savingDraft}
            className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
          >
            {savingDraft ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            Save Draft
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(step / stepsCount) * 100}%` }}
        />
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-foreground">
                  Listing Title
                </label>
                <input
                  type="text"
                  className={`mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.title ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="e.g. Verified AdSense Account with $200 Income"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground">
                    Platform
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.platform ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="e.g. Google AdSense"
                    {...register('platform')}
                  />
                  {errors.platform && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.platform.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground">
                    Target Country
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.country ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="e.g. Global, US, NG"
                    {...register('country')}
                  />
                  {errors.country && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground">
                  Detailed Description
                </label>
                <textarea
                  className={`mt-1 block min-h-[100px] w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.description ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="Describe your account history, verification level, details of monthly earnings..."
                  {...register('description')}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground">
                  Reason for Selling{' '}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <textarea
                  className="mt-1 block min-h-[70px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Why are you listing this asset?"
                  {...register('reason_for_sale')}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground">
                    Account Age
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.account_age ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="e.g. 2 years, 6 months"
                    {...register('account_age')}
                  />
                  {errors.account_age && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.account_age.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground">
                    Monthly Income (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={`mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.monthly_income
                        ? 'border-destructive'
                        : 'border-input'
                    }`}
                    placeholder="0.00"
                    {...register('monthly_income')}
                  />
                  {errors.monthly_income && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.monthly_income.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-sm font-bold text-foreground">
                  Security Checkpoints
                </label>
                <div className="space-y-2">
                  <label className="hover:bg-muted/10 flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                      {...register('original_email_included')}
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground">
                        Original Email Included
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Original registration email comes with the sale
                      </p>
                    </div>
                  </label>

                  <label className="hover:bg-muted/10 flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                      {...register('recovery_email_included')}
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground">
                        Recovery Email Included
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Clean recovery email configured for backup security
                      </p>
                    </div>
                  </label>

                  <label className="hover:bg-muted/10 flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                      {...register('phone_included')}
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground">
                        Phone Verification Included
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Associated verification phone number transferred
                      </p>
                    </div>
                  </label>

                  <label className="hover:bg-muted/10 flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                      {...register('identity_verified')}
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground">
                        Owner Identity Verified
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Government checks fully completed for current owner
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-foreground">
                  Selling Price
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-bold text-muted-foreground">
                    USD
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className={`block w-full rounded-lg border bg-background py-2.5 pl-12 pr-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.price ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="0.00"
                    {...register('price')}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Note: Safe Escrow guarantees transaction payouts after
                  compliance validations.
                </p>
                {errors.price && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <ListingImageUploader images={images} onChange={setImages} />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <TagInput tags={tags} onChange={setTags} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Actions */}
        <div className="border-border/60 flex items-center justify-between border-t pt-4">
          <button
            type="button"
            onClick={step === 1 ? onCancel : handleBack}
            className="inline-flex items-center gap-1 rounded-lg border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" /> {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step < stepsCount ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isValid}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              Generate Preview <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
