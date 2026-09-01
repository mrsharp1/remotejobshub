import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { authService } from '@/services/auth/auth.service'
import { referralService } from '@/services/marketplace/referral.service'
import { zodResolver } from '@/utils/resolver'
import { useAuthStore } from '@/stores/authStore'
import { springs } from '@/lib/framer-physics'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    phone: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const referralCode = searchParams.get('ref')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')


  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: 'Nigeria',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  })

  const getPasswordStrength = (pass: string) => {
    let score = 0
    if (!pass) return { score, label: 'None', color: 'bg-muted' }
    if (pass.length >= 8) score++
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++
    if (/\d/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 1) return { score, label: 'Weak', color: 'bg-destructive' }
    if (score <= 3) return { score, label: 'Medium', color: 'bg-yellow-500' }
    return { score, label: 'Strong', color: 'bg-emerald-500' }
  }

  const strength = getPasswordStrength(passwordValue)

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const signUpResult = await authService.signUp(data.email, data.password, {
        data: {
          full_name: data.fullName,
          phone: data.phone,
          country: data.country,
        },
      })

      const user = signUpResult?.user
      const session = signUpResult?.session

      if (user) {
        // Immediately update corresponding row in public.profiles table
        try {
          const updatedProfile = await authService.updateProfile(user.id, {
            full_name: data.fullName,
            phone: data.phone || null,
            country: data.country,
          })

          if (referralCode) {
            await referralService.processRegistrationReferral(user.id, referralCode).catch(err => {
              console.error('Failed to process referral attribution:', err)
            })
          }

          // Sync auth store immediately if session was created automatically
          if (session && updatedProfile) {
            useAuthStore.getState().setAuth(user, updatedProfile, session)
          }
        } catch (updateErr) {
          console.error('Failed to complete user profile details:', updateErr)
        }
      }

      setIsSuccess(true)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 text-center"
      >
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 animate-bounce text-emerald-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Account Created Successfully!
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We have sent a verification link to your email address. Please verify
          your email to log in and start using Remote Jobs Hub.
        </p>
        <div className="pt-4">
          <Link
            to="/login"
            className="inline-flex w-full justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Go to Sign In
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
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

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                <User className="h-5 w-5" />
              </span>
              <input
                id="fullName"
                type="text"
                aria-invalid={errors.fullName ? "true" : "false"}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                className={`focus:ring-primary/20 block w-full min-h-[48px] rounded-xl border bg-white py-4 pl-11 pr-4 text-[16px] text-foreground placeholder-muted-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 dark:bg-background ${
                  errors.fullName ? 'border-destructive' : 'border-input'
                }`}
                placeholder="John Doe"
                disabled={isLoading}
                {...register('fullName')}
              />
            </div>
            {errors.fullName && (
              <p id="fullName-error" className="mt-1.5 text-xs font-medium text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <input
                id="email"
                type="email"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`focus:ring-primary/20 block w-full min-h-[48px] rounded-xl border bg-white py-4 pl-11 pr-4 text-[16px] text-foreground placeholder-muted-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 dark:bg-background ${
                  errors.email ? 'border-destructive' : 'border-input'
                }`}
                placeholder="name@company.com"
                disabled={isLoading}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Phone{' '}
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <Phone className="h-5 w-5" />
                </span>
                <input
                  id="phone"
                  type="tel"
                  className="focus:ring-primary/20 block w-full min-h-[48px] rounded-xl border border-input bg-white py-4 pl-11 pr-4 text-[16px] text-foreground placeholder-muted-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 dark:bg-background"
                  placeholder="+234..."
                  disabled={isLoading}
                  {...register('phone')}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Country
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <Globe className="h-5 w-5" />
                </span>
                <select
                  id="country"
                  aria-invalid={errors.country ? "true" : "false"}
                  aria-describedby={errors.country ? "country-error" : undefined}
                  className={`focus:ring-primary/20 block w-full min-h-[48px] rounded-xl border bg-white py-4 pl-11 pr-10 text-[16px] text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 dark:bg-background appearance-none cursor-pointer ${
                    errors.country ? 'border-destructive' : 'border-input'
                  }`}
                  disabled={isLoading}
                  {...register('country')}
                >
                  <option value="" disabled>Select a country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Ghana">Ghana</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.country && (
                <p id="country-error" className="mt-1.5 text-xs font-medium text-destructive">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                <Lock className="h-5 w-5" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`focus:ring-primary/20 block w-full min-h-[48px] rounded-xl border bg-white py-4 pl-11 pr-12 text-[16px] text-foreground placeholder-muted-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 dark:bg-background ${
                  errors.password ? 'border-destructive' : 'border-input'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
                {...register('password', {
                  onChange: (e) => setPasswordValue(e.target.value),
                })}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground focus:outline-none focus:text-primary disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordValue && (
              <div className="mt-2 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">
                    Password strength:
                  </span>
                  <span
                    className={
                      strength.label === 'Strong'
                        ? 'text-emerald-500'
                        : strength.label === 'Medium'
                          ? 'text-yellow-500'
                          : 'text-destructive'
                    }
                  >
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                <Lock className="h-5 w-5" />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                className={`focus:ring-primary/20 block w-full min-h-[48px] rounded-xl border bg-white py-4 pl-11 pr-12 text-[16px] text-foreground placeholder-muted-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 dark:bg-background ${
                  errors.confirmPassword ? 'border-destructive' : 'border-input'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground focus:outline-none focus:text-primary disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="mt-1.5 text-xs font-medium text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  disabled={isLoading}
                  aria-invalid={errors.agreeToTerms ? "true" : "false"}
                  className="premium-input h-5 w-5 sm:h-4 sm:w-4 rounded border-input text-primary focus:ring-primary disabled:opacity-50 cursor-pointer"
                  {...register('agreeToTerms')}
                />
              </div>
              <div className="ml-3 sm:ml-2 text-sm">
                <label htmlFor="agreeToTerms" className="font-medium cursor-pointer transition-colors select-none text-foreground">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {errors.agreeToTerms.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <motion.button
            whileHover={!isLoading && isValid ? { scale: 1.02 } : {}}
            whileTap={!isLoading && isValid ? { scale: 0.98 } : {}}
            transition={springs.snappy}
            type="submit"
            disabled={isLoading || !isValid}
            aria-busy={isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-4 text-base font-bold text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
