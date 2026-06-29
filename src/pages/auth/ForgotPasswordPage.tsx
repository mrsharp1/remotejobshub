import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { authService } from '@/services/auth/auth.service'
import { zodResolver } from '@/utils/resolver'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      // Use the window location host to build the site reset redirect URL dynamically
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
      const resetUrl = `${siteUrl}/reset-password`
      await authService.sendPasswordResetEmail(data.email, resetUrl)
      setIsSuccess(true)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(
        error.message || 'Failed to send reset link. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 text-center shadow-lg"
        >
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 animate-pulse text-emerald-500" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Check Your Email
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We have sent a secure password reset link to your email address.
            Please follow the instructions in the email to set a new password.
          </p>
          <div className="pt-4">
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg"
      >
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-destructive/10 rounded-lg p-3 text-sm text-destructive"
          >
            {errorMsg}
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email Address
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <input
                id="email"
                type="email"
                className={`block w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.email ? 'border-destructive' : 'border-input'
                }`}
                placeholder="name@company.com"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
